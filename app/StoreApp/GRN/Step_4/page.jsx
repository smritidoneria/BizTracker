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
  const [weight, setWeight] = React.useState(null);
  const [avgWeight, setAvgWeight] = React.useState(null);
  const [DerivedQty, setDerivedQty] = React.useState(0);
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const [isOpenSecondModal, setOpenSecondModal] = React.useState(false);
  const [isOpenThirdModal, setOpenThirdModal] = React.useState(false);
  const [capturedWeightImage, setCapturedWeightImage] = React.useState([]);
  const [matchedLocation, setMatchedLocation] = React.useState(null);
  const [capturedAvgWeightImage, setCapturedAvgWeightImage] = React.useState(
    []
  );
  const [capturedQtyImage, setCapturedQtyImage] = React.useState([]);
  const router = useRouter();
  const [scheduleId, setScheduleId] = React.useState(null);
  const [scheduleItemName, setScheduleItemName] = React.useState(null);
  const [capturedImages, setCapturedImages] = React.useState([]);
  const [capturedweightImages, setCapturedweightImages] = React.useState([]);
  const [capturedavgweightImages, setCapturedavgweightImages] = React.useState(
    []
  );
  const [showCamera, setShowCamera] = React.useState(true);
  const [scannedValue, setScannedValue] = React.useState("");
  const [uom, setUom] = React.useState("");
  const [isOpenQRModal, setOpenQRModal] = React.useState(false);
  const [grnLocations, setGrnLocations] = React.useState([]);
  const webcamRef = React.useRef(null);
  const [isQRScanned, setIsQRScanned] = React.useState(false);
  const openFirstModal = () => setOpenFirstModal(true);
  const closeFirstModal = () => setOpenFirstModal(false);
  const openSecondModal = () => setOpenSecondModal(true);
  const closeSecondModal = () => setOpenSecondModal(false);
  const openThirdModal = () => setOpenThirdModal(true);
  const closeThirdModal = () => setOpenThirdModal(false);
  const [purchaseOrderItems, setPurchaseOrderItems] = React.useState(null);
  const [derivedQtyDisable, setDerivedQtyDisable] = React.useState(false);
  const [weightError, setWeightError] = React.useState("");
  const [avgWeightError, setAvgWeightError] = React.useState("");
  const [Qtyimagesubmit, setQtyimagesubmit] = React.useState(false);
  let params;
  if (global?.window !== undefined) {
    params = new URLSearchParams(global.window.location.search);
  }
  const poID = params?.get("po_id");
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const factoryID = localStorage.getItem("factoryId");
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${Domain}/location`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        const finishStockLocations = data.filter(
          (location) =>
            location.type == "PUTAWAY" && location.factory_id == factoryID
        );

        setGrnLocations(finishStockLocations);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchLocations();
  }, []);
  React.useEffect(() => {
    const fetchScheduleId = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${Domain}/po/particular-putaway-pending?purchase_order_id=${poID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        } else{ 
        if (data.PurchaseOrderItems.length === 0) {
          router.push("/StoreApp/GRN");
        }else{
        setPurchaseOrderItems(data.PurchaseOrderItems);
        const scheduleId =
          data.PurchaseOrderItems[0].PurchaseOrderSchedules[0].id;

        const invoiceQty =
          data.PurchaseOrderItems[0]?.PurchaseOrderSchedules[0]?.invoice_qty;

        if (invoiceQty === 0 || invoiceQty === "0") {
          toast.warning("Invoice quantity is 0");
          router.push("/StoreApp/GRN");
          return;
        }
        const itemUom = data.PurchaseOrderItems[0]?.Item?.uom;
        setScheduleItemName(data.PurchaseOrderItems[0]?.Item?.internal_item_name);
        setScheduleId(scheduleId);
        setUom(itemUom);
        if (data.PurchaseOrderItems[0]?.Item?.avg_weight_needed) {
          if (weight !== null && avgWeight !== null && avgWeight !== 0) {
            const derivedQuantity =
              parseFloat(weight * 100) / parseFloat(avgWeight);
            setDerivedQty(derivedQuantity);
          } else {
            setDerivedQty(0); // or some placeholder value
          }
          setDerivedQtyDisable(true);
        }
      }
    }
      } catch (error) {
        console.error("Error fetching schedule ID:", error);
      }
    };

    fetchScheduleId();
  }, [poID, weight, avgWeight]);

  const handleWeightImagesSubmit = async () => {
    const bucketName = "exposync-bucket";
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const urls = [];

    const uploadPromises = capturedweightImages.map((image, index) => {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
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

  const handleCaptureQtyImageSubmit = async () => {
    const bucketName = "exposync-bucket";
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const urls = [];

    const uploadPromises = capturedImages.map((image, index) => {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
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
      setCapturedQtyImage(urls);
      setQtyimagesubmit(true);
      toast.success("image submitted successfully"); // Set the state with the accumulated URLs
      closeThirdModal();
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle error (e.g., show error message)
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages((prevImages) => [...prevImages, imageSrc]);
  };

  const handleQRScan = (e) => {
    const scannedLocation = grnLocations.find(
      (location) => location.name === e.text
    );
    if (scannedLocation) {
      setMatchedLocation(scannedLocation);
      setIsQRScanned(true);
      setOpenQRModal(false);
      setScannedValue(e.text);
      setShowCamera(false);
    } else {
      console.log("Location not found:", e.text);
      toast.error("Location not found:", e.text);
    }
  };

  const handleCameraIconClick = () => {
    if (purchaseOrderItems && purchaseOrderItems[0]?.Item?.avg_weight_needed) {
      // Validate weight
      if (!weight) {
        setWeightError("Please enter the weight.");
        return;
      }

      // Validate average weight
      if (!avgWeight) {
        setAvgWeightError("Please enter the average weight.");
        return;
      }

      // Validate weight image
      if (!capturedWeightImage) {
        setWeightError("Please capture the weight image.");
        return;
      }

      // Validate average weight image
      if (!capturedAvgWeightImage) {
        setAvgWeightError("Please capture the average weight image.");
        return;
      }
    }
    setOpenQRModal(true);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/po/putaway-done`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          scheduleId: scheduleId,
          receivedQty: parseInt(DerivedQty),
          weight: parseInt(weight),
          avgWeight: parseInt(avgWeight),
          locationId: parseInt(matchedLocation.id),
          otherImages: [
            ...capturedWeightImage,
            ...capturedAvgWeightImage,
            ...capturedQtyImage,
          ],
        }),
      });
      const data = await response.json();
      if (data.error) {
        toast.error("Error Submitting Item");
        return;
      }
      toast.success("PutAway Done Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      // router.push("/StoreApp/GRN");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <NavbarStore />
      <div className="bg-black p-2 ">
        <div className="p-5 bg-black mt-4">
          <Card className="bg-gray-900 p-5 mt-8 mb-8">
            <CardBody>
              <h1
                className="font-bold text-white text-center text-xl mt-4 mb-4"
                
              >
                {scheduleItemName}
              </h1>
              {purchaseOrderItems &&
                purchaseOrderItems.slice(0, 1).map((item) => (
                  <div key={item.id}>
                    <h1 className="font-bold mt-4 mb-4 text-white text-center">
                      Invoice Qty - {item?.PurchaseOrderSchedules[0]?.invoice_qty}
                    </h1>
                    {item?.Item?.avg_weight_needed ? (
                      <>

                        <div className="p-2 bg-gray-800 mt-3 mb-2 shadow-gray-900 shadow-md rounded-xl">
                          {capturedweightImages ? (
                            capturedweightImages.length === 0 ? (
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
                                  onChange={(e) => setWeight(e.target.value)}
                                  isInvalid={weightError !== ""}
                                ></Input>
                              </div>
                            )
                          ) : null}
                          {weightError && (
                            <p className="text-red-500 text-sm">
                              {weightError}
                            </p>
                          )}
                        </div>
                        <div className="p-2 bg-gray-800 mt-3 mb-2 shadow-gray-900 shadow-md rounded-xl">
                          {capturedavgweightImages ? (
                            capturedavgweightImages.length === 0 ? (
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
                                  Avg Weight (100 pc):
                                </h1>
                                <Input
                                  placeholder="Avg Weight"
                                  value={avgWeight}
                                  onChange={(e) => setAvgWeight(e.target.value)}
                                  isInvalid={avgWeightError !== ""}
                                ></Input>
                              </div>
                            )
                          ) : null}
                          {avgWeightError && (
                            <p className="text-red-500 text-sm">
                              {avgWeightError}
                            </p>
                          )}
                        </div>
                        {avgWeight && weight ? (
                          <Input
                            placeholder="Enter Quantity"
                            className="w-full mt-4 mb-4"
                            value={DerivedQty}
                            onChange={(e) => setDerivedQty(e.target.value)}
                            isDisabled
                          />
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Button
                          color="primary"
                          className="font-bold text-white flex justify-center w-full mt-3 mb-2"
                          onClick={openThirdModal}
                          style={{ display: Qtyimagesubmit ? "none" : "block" }}
                        >
                          Capture Qty
                        </Button>
                        {capturedImages.length > 0 && (
                          <div className="flex justify-center gap-4">
                            <Input
                              placeholder="Enter Quantity"
                              className="w-full mt-4 mb-4"
                              value={DerivedQty}
                              onChange={(e) => setDerivedQty(e.target.value)}
                              isDisabled={derivedQtyDisable}
                            ></Input>
                            <Input
                              placeholder="uom"
                              className="w-1/3 mt-4 mb-4"
                              value={uom}
                              isDisabled
                            ></Input>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

              {DerivedQty && (
                <Button
                  color="success"
                  className="font-bold text-white flex justify-center w-full mt-3 mb-2"
                  onClick={handleCameraIconClick}
                  style={{ display: isQRScanned ? "none" : "block" }}
                >
                  Scan Process Pending Location
                </Button>
              )}
              <Button
                color="success"
                className="font-bold text-white flex justify-center w-full mt-3 mb-6"
                onClick={handleSubmit}
                style={{ display: isQRScanned ? "block" : "none" }}
              >
                Submit
              </Button>
            </CardBody>
          </Card>
        </div>
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
        isOpen={isOpenThirdModal}
        onChange={closeThirdModal}
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
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
                {capturedImages.map((image, index) => (
                  <img key={index} src={image} alt={`Captured ${index}`} />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onClick={closeThirdModal}
                  className="text-white font-bold"
                >
                  Close
                </Button>
                <Button onClick={capture} color="primary">
                  Capture Invoice
                </Button>
                <Button color="success" onClick={handleCaptureQtyImageSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenSecondModal} onChange={closeSecondModal} size="full">
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
              {grnLocations.map((location) => (
                <span key={location.id}>{`${location.name},`}</span>
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
