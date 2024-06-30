/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Webcam from "react-webcam";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AWS from "aws-sdk";
const page = () => {
  const [poID, setPoID] = React.useState(null);
  // let params;
  // if (global?.window !== undefined) {
  //   params = new URLSearchParams(global.window.location.search);
  // }
  // const poID = params?.get("po_id");
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const [capturedImages, setCapturedImages] = React.useState([]);
  const [PurchaseOrderDetails, setPurchaseOrderDetails] = React.useState([]);
  const [invoiceQty, setInvoiceQty] = React.useState({});
  const router = useRouter();
  const openFirstModal = () => setOpenFirstModal(true);
  const closeFirstModal = () => setOpenFirstModal(false);
  const [imagesSubmitted, setImagesSubmitted] = React.useState(false);
  const [alreadyScheduled, seAlreadyScheduled] = React.useState(false);

  const [invoiceImage, setInvoiceImage] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const purchaseOrderID = params.get("po_id");
      setPoID(purchaseOrderID);
    }
  }, []);
  React.useEffect(() => {
    const fetchPODetails = async () => {
      try {
        setShowAnimation(true);
        let token;
        if (typeof localStorage !== "undefined") {
          token = localStorage.getItem("token");
        }
        const response = await fetch(
          `${Domain}/po/particular-grn?purchase_order_id=${poID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        } else {
          setPurchaseOrderDetails(data);
          setTimeout(() => {
            checkPendingSchedules();
          }, 500); 
        }
     
        // Assuming you want to hide the animation after fetching the data
      } catch (error) {
        console.error("Error fetching PO details:", error);
      }
    };

    const checkPendingSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${Domain}/po/putaway-pending-check?purchase_order_id=${poID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        if (data?.error) {
          seAlreadyScheduled(true);
          toast.warning(data.error);
          setTimeout(() => {
            router.push(`/StoreApp/GRN/Step_4?po_id=${poID}`);
          }, 2000); 
        }
      } catch (error) {
        console.error("Error checking pending schedules:", error);
      }
    };

    if (poID) {
      fetchPODetails();
    }
    setShowAnimation(false);
  }, [poID]);
  const webcamRef = React.useRef(null);
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages((prevImages) => [...prevImages, imageSrc]);
  };

  const handleCaptureInvoice = () => {
    openFirstModal();
  };

  const handleChange = (itemId, value) => {
    setInvoiceQty((prevInvoiceQty) => ({
      ...prevInvoiceQty,
      [itemId]: value,
    }));
  };

  const checkNonZeroQty = () =>{
    for (let key in invoiceQty) {
      if(!!invoiceQty[key] && invoiceQty[key]!=="0" && Number(invoiceQty[key])>0){
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async () => {
    const bucketName = "exposync-bucket";
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    capturedImages.forEach((image, index) => {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const key = `inveesync/grn/po/${Date.now()}-${index}.png`;
      s3.putObject(
        {
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: "image/png",
        },
        (err, data) => {
          if (err) {
            console.log("Error uploading image:", err);
          } else {
            console.log("Image uploaded successfully:", data);
            setInvoiceImage(
              `https://exposync-bucket.s3.ap-south-1.amazonaws.com${key}`
            );
          }
        }
      );
    });
    closeFirstModal();
    try {
      let token;
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
      }
      const items = PurchaseOrderDetails.flatMap((order) =>
        order.PurchaseOrderItems.map((item) => ({
          item_id: item.item_id,
          invoice_qty: parseInt(invoiceQty[item.id]) || 0,
          invoice_image: invoiceImage,
        }))
      );
      const poID = PurchaseOrderDetails[0]?.id;
      const response = await fetch(`${Domain}/po/putaway-pending`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          purchase_order_id: poID,
        }),
      });
        const data = await response.json()
      if (data?.error) {
        toast.error("Error Submmiting Data");
        console.error("Error submitting data:", response.statusText);
      } else {
        toast.success("Successfull");
        router.push(`/StoreApp/GRN/Step_3?po_id=${poID}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
    setImagesSubmitted(true);
  };

  // if(alreadyScheduled){
  //   router.push(`/StoreApp/GRN/Step_4?po_id=${poID}`);
  // }
  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            <h1 className="font-bold text-white text-center text-2xl mt-4 mb-4">
              Selected PO'S Name
            </h1>
            {PurchaseOrderDetails.length > 0 && (
             <Table aria-label="Example static collection table">
             <TableHeader>
               <TableColumn>Item Name</TableColumn>
               <TableColumn>Remaining Qty</TableColumn>
               <TableColumn>Invoice Qty</TableColumn>
             </TableHeader>
             <TableBody>
               {PurchaseOrderDetails.flatMap((order) =>
                 order.PurchaseOrderItems.map((item) => (
                   <TableRow key={item.id}>
                     <TableCell>{item?.Item?.internal_item_name}</TableCell>
                     <TableCell>
                       {`${Math.max(item.qty - item.received_qty, 0)}/${item.qty}`}
                     </TableCell>
                     <TableCell>
                       <Input
                         placeholder="Qty"
                         value={invoiceQty[item.id] || ""}
                         onChange={(e) => handleChange(item.id, e.target.value)}
                         isDisabled={item.qty - item.received_qty <= 0}
                       />
                     </TableCell>
                   </TableRow>
                 ))
               )}
             </TableBody>
           </Table>
            )}

            <Button
              color="primary"
              onClick={handleCaptureInvoice}
              className="font-bold flex m-auto mt-3 mb-3"
              isDisabled={ checkNonZeroQty() }

            >
              Capture Invoice
            </Button>
          </CardBody>
        </Card>
      </div>
      <FooterWithLogo />
      <Modal
        isOpen={isOpenFirstModal}
        onChange={closeFirstModal}
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Camera</ModalHeader>
              <ModalBody className=" overflow-y-scroll">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  videoConstraints={{
                    facingMode: "environment",
                  }}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full"
                />

                {capturedImages.map((image, index) => (
                  <img key={index} src={image} alt={`Captured ${index}`} />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button onClick={closeFirstModal} color="primary">
                  Close
                </Button>
                <Button onClick={capture} color="primary">
                  Capture Invoice
                </Button>
                <Button color="success" onClick={handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {showAnimation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
          <img
            src="/Animation-3.gif"
            alt="nothing"
            className="animateGif w-56 h-56"
          />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default page;
