/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
"use client";
import React from "react";
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";
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
import QrReader from "@/app/QRreader/QRreader";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [weight, setWeight] = React.useState("");
  const [avgWeight, setAvgWeight] = React.useState("");
  const [derivedQty, setDerivedQty] = React.useState("");
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const [isOpenInvoiceModal, setOpenInvoiceModal] = React.useState(false);
  const [isOpenSecondModal, setOpenSecondModal] = React.useState(false);
  const [capturedWeightImage, setCapturedWeightImage] = React.useState([]);
  const [capturedweightImages, setCapturedweightImages] = React.useState([]);
  const [capturedAvgWeightImage, setCapturedAvgWeightImage] = React.useState(
    []
  );
  const [capturedavgweightImages, setCapturedavgweightImages] = React.useState(
    []
  );
  const [matchedLocation, setMatchedLocation] = React.useState(null);
  const [isQRScanned, setIsQRScanned] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(true);
  const [invoiceImage, setInvoiceImage] = React.useState("");
  const [imagesSubmitted, setImagesSubmitted] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [OrderDetails, setSalesOrderDetails] = React.useState([]);
  const [capturedImages, setCapturedImages] = React.useState([]);
  const webcamRef = React.useRef(null);
  const openFirstModal = () => setOpenFirstModal(true);
  const closeFirstModal = () => setOpenFirstModal(false);
  const OpenInvoiceModal = () => setOpenInvoiceModal(true);
  const closeInvoiceModal = () => setOpenInvoiceModal(false);
  const openSecondModal = () => setOpenSecondModal(true);
  const closeSecondModal = () => setOpenSecondModal(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [scannedValue, setScannedValue] = React.useState("");
  const [isOpenQRModal, setOpenQRModal] = React.useState(false);
  const [dispatchLocations, setDispatchLocations] = React.useState([]);
  const router = useRouter();
  let params;
  if (global?.window !== undefined) {
    params = new URLSearchParams(global.window.location.search);
  }
  const soID = params?.get("so_id");
  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const factoryID = localStorage.getItem("factoryId");
    
        const response = await fetch(`${Domain}/location`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error){
          toast.error(data.error)
        } else {
        const dispatchLocations = data.filter(
          (location) => location.type === "DISPATCH" && location.factory_id == factoryID
        );
        setDispatchLocations(dispatchLocations);
      }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    const fetchOrderDetailId = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${Domain}/orders/particular-dispatch?order_id=${soID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error)
        } else {
        setSalesOrderDetails(data.pendingOrder);
        }
      } catch (error) {
        console.error("Error Order details:", error);
      }
    };

    fetchOrderDetailId();
    fetchLocations();
  }, [soID]);

  React.useEffect(() => {
    const calculateDerivedQty = () => {
      if (weight && avgWeight) {
        const calculatedDerivedQty = parseFloat(weight*100) / parseFloat(avgWeight);
        if (isFinite(calculatedDerivedQty)) {
          setDerivedQty(calculatedDerivedQty.toString());
        } else {
          setDerivedQty("");
        }
      } else {
        setDerivedQty("");
      }
    };

    calculateDerivedQty();
  }, [weight, avgWeight]);

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleAvgWeightChange = (e) => {
    setAvgWeight(e.target.value);
  };

  const handleWeightImagesSubmit = async () => {
    const bucketName = "exposync-bucket";
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const urls = [];

    const uploadPromises = capturedweightImages.map((image, index) => {
      const base64Data = image?.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const key = `inveesync/grn/po/${Date.now()}-${index}.png`;

      return new Promise((resolve, reject) => {
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
              reject(err);
            } else {
              console.log("Image uploaded successfully:", data);
              const url = `https://exposync-bucket.s3.ap-south-1.amazonaws.com/${key}`;
              urls.push(url);
              resolve();
            }
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      setCapturedWeightImage(urls); // Set the state with the accumulated URLs
      closeFirstModal();
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle error (e.g., show error message)
    }
  };

  const captureWeightClick = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedweightImages((prevImages) => [...prevImages, imageSrc]);
  };

  const handleAvgWeightImageSubmit = async () => {
    const bucketName = "exposync-bucket";
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const urls = [];

    const uploadPromises = capturedavgweightImages.map((image, index) => {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const key = `inveesync/Dispatch/so//${Date.now()}-${index}.png`;

      return new Promise((resolve, reject) => {
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
              reject(err);
            } else {
              console.log("Image uploaded successfully:", data);
              const url = `https://exposync-bucket.s3.ap-south-1.amazonaws.com/${key}`;
              urls.push(url);
              resolve();
            }
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      setCapturedAvgWeightImage(urls); // Set the state with the accumulated URLs
      closeSecondModal();
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle error (e.g., show error message)
    }
  };

  const captureAvgWeightClick = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedavgweightImages((prevImages) => [...prevImages, imageSrc]);
  };

  const handleConfirm = () => {
    if (!weight) {
      toast.error("Please enter the weight.");
      return;
    }

    // Validate average weight input
    if (!avgWeight) {
      toast.error("Please enter the average weight.");
      return;
    }

    // Validate weight image
    if (!capturedWeightImage) {
      toast.error("Please capture the weight image.");
      return;
    }

    // Validate average weight image
    if (!capturedAvgWeightImage) {
      toast.error("Please capture the average weight image.");
      return;
    }
    if (isFinite(parseFloat(derivedQty))) {
      const newItem = {
        item_id: OrderDetails.OrderItems[currentIndex].item_id,
        dispatch_qty: derivedQty,
        other_images: [...capturedWeightImage, ...capturedAvgWeightImage],
        weight: weight,
        avg: avgWeight,
      };
      setItems([...items, newItem]);
      setWeight("");
      setAvgWeight("");
      setDerivedQty("");
      setCapturedweightImages([]);
      setCapturedavgweightImages([]);
      setCurrentIndex(currentIndex + 1); // Increment currentIndex by 1
    } else {
      toast.error("Invalid derived quantity value.");
    } 
  };

  const renderButton = () => {
    if (
      OrderDetails?.OrderItems &&
      currentIndex >= OrderDetails?.OrderItems?.length
    ) {
      if (!imagesSubmitted) {
        return (
          <Button
            color="primary"
            className="font-bold flex m-auto mt-3 mb-3"
            onClick={handleCaptureInvoice}
          >
            Capture Invoice
          </Button>
        );
      } else if (!scannedValue) {
        return (
          <Button
            color="primary"
            className="font-bold flex m-auto mt-3 mb-3"
            onClick={handleCameraIconClick}
          >
            Scan Location
          </Button>
        );
      } else {
        return (
          <Button
            color="success"
            className="font-bold text-white flex m-auto mt-3 mb-3"
            onClick={ProceedFurther}
          >
            Proceed Further
          </Button>
        );
      }
    } else {
      return (
        <>
        {derivedQty && (
          <Button
            color="success"
            className="font-bold text-white flex justify-center w-full mt-3 mb-2"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        )}
        </>
      );
    }
  };

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
      const key = `inveesync/Dispatch/Invoice/${Date.now()}-${index}.png`;
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
            // Handle success (e.g., update state, show success message)
          }
        }
      );
    });
    closeInvoiceModal();
    setImagesSubmitted(true);
  };
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages((prevImages) => [...prevImages, imageSrc]);
  };

  const handleCaptureInvoice = () => {
    OpenInvoiceModal();
  };

  const ProceedFurther = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${Domain}/orders/dispatch`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: soID,
        location_id: matchedLocation.id,
        items: items.map((item) => ({
          item_id: item.item_id,
          dispatched_qty: parseInt(item.dispatch_qty),
          invoice_image: invoiceImage,
          other_images: item.other_images,
          weight: parseInt(item.weight),
          avg_weight: parseInt(item.avg),
        })),
      }),
    });
    if (response.ok) {
      // Handle success (e.g., show success message)
      toast.success("Dispatched successfully");
      setItems([]);
      setImagesSubmitted(false);
      router.push("/StoreApp/Dispatch");
    } else {
      // Handle error (e.g., show error message)
      toast.error("Failed to dispatch");
    }
  };

  const handleQRScan = (e) => {
    const scannedLocation = dispatchLocations.find(
      (location) => location.name === e.text
    );
    if (scannedLocation) {
      // Do something with the scanned location object
  
      setScannedValue(e.text);
      setShowCamera(false);
      setOpenQRModal(false);
      setIsQRScanned(true);
      setMatchedLocation(scannedLocation);
    } else {
     
      toast.error("Location not found:", e.text);
    }
  };

  const handleCameraIconClick = () => {
    setOpenQRModal(true);
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            {OrderDetails.OrderItems &&
            OrderDetails.OrderItems.length > currentIndex ? (
              <>
                <h1
                  className="font-bold text-white text-center text-2xl mt-4 mb-4"
                 
                >
                  {
                    OrderDetails.OrderItems[currentIndex].Item
                      .internal_item_name
                  }
                </h1>
                <div className="">
                  <div className="p-2 bg-gray-800 mt-3 mb-2 shadow-gray-900 shadow-md rounded-xl">
                    {capturedweightImages?capturedweightImages.length === 0 ? (
                      <Button
                        color="primary"
                        className="font-bold text-white flex justify-center w-full mt-3 mb-2"
                        onClick={openFirstModal}
                      >
                        Capture Weight
                      </Button>
                    ) : (
                      <div className="flex justify-between gap-5 mt-3 mb-3 p-1">
                        <h1 className="font-bold text-white text-lg mt-2">
                          Weight:-
                        </h1>
                        <Input
                          placeholder="Enter Weight"
                          value={weight}
                          onChange={handleWeightChange}
                        ></Input>
                      </div>
                    ): null}
                  </div>

                  <div className="p-2 bg-gray-800 mt-3 mb-2 shadow-gray-900 shadow-md rounded-xl">
                    {capturedavgweightImages?capturedavgweightImages.length === 0 ? (
                      <Button
                        color="primary"
                        className="font-bold text-white flex justify-center w-full mt-3 mb-2"
                        onClick={openSecondModal}
                      >
                        Capture Avg Weight
                      </Button>
                    ) : (
                      <div className="flex justify-between gap-5 mt-3 mb-3 p-1">
                        <h1 className="font-bold text-white text-lg">
                          Avg Weight (100pcs):-
                        </h1>
                        <Input
                          placeholder="Avg Weight"
                          value={avgWeight}
                          onChange={handleAvgWeightChange}
                        ></Input>
                      </div>
                    ):null}
                  </div>
                </div>
                <Input
                  placeholder="Derived Quantity"
                  className="w-full mt-4 mb-4"
                  value={derivedQty}
                  isDisabled
                ></Input>
              </>
            ) : (
              <>
                <div className="flex justify-center items-center h-64 gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-9 h-9 font-bold text-white "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="text-white mt-4 mb-4 text-center text-xl">
                    Nothing To Do Here
                  </span>
                </div>
              </>
            )}

            {renderButton()}
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
          <ModalHeader>Camera</ModalHeader>
          <ModalBody className="overflow-y-scroll">
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{
                facingMode: "environment",
              }}
              screenshotFormat="image/jpeg"
              className="w-full h-full"
            />
            {capturedweightImages.map((image, index) => (
              <img key={index} src={image} alt={`Captured ${index}`} />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={closeFirstModal}
              className="text-white font-bold"
            >
              Close
            </Button>
            <Button onClick={captureWeightClick} color="primary">
              Capture Invoice
            </Button>
            <Button color="success" onClick={handleWeightImagesSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenSecondModal}
        onChange={closeSecondModal}
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          <ModalHeader>Camera</ModalHeader>
          <ModalBody className="overflow-y-scroll">
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{
                facingMode: "environment",
              }}
              screenshotFormat="image/jpeg"
              className="w-full h-full"
            />
            {capturedavgweightImages.map((image, index) => (
              <img key={index} src={image} alt={`Captured ${index}`} />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={closeSecondModal}
              className="text-white font-bold"
            >
              Close
            </Button>
            <Button onClick={captureAvgWeightClick} color="primary">
              Capture Invoice
            </Button>
            <Button color="success" onClick={handleAvgWeightImageSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenInvoiceModal}
        onChange={closeInvoiceModal}
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
      <Modal
        isOpen={isOpenQRModal}
        onOpenChange={setOpenQRModal}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Scan QR Code</ModalHeader>

          <ModalBody>
            <div className="mt-3 mb-4">
              <span className="font-bold text-black">
                Allowed Locations are:
              </span>
              {dispatchLocations.map((location) => (
                <span key={location.id}>{`${location.name}, `}</span>
              ))}
            </div>
            <QrReader onRead={handleQRScan} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ToastContainer />
      {showAnimation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
          <img
            src="/Animation-3.gif"
            alt="nothing"
            className="animateGif w-56 h-56"
          />
        </div>
      )}
    </>
  );
};

export default page;
