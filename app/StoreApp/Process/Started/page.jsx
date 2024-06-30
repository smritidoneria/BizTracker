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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QrReader from "@/app/QRreader/QRreader";
import Webcam from "react-webcam";
import AWS from "aws-sdk";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [processData, setProcessData] = React.useState(null);
  const [scannedValue, setScannedValue] = React.useState("");
  const [avgValue, setAVGValue] = React.useState("");
  const [ProductionWeight, setProductionWeight] = React.useState("");
  const [ProducedQty, setProducedQty] = React.useState("");
  const [rmConsumedData, setRmConsumedData] = React.useState([]);
  const [isOpenQRModal, setOpenQRModal] = React.useState(false);
  const [isQRScanned, setQRScanned] = React.useState(false);
  const [locations, setLocations] = React.useState([]);
  const [allowedLocations, setAllowedLocations] = React.useState([]);
  const [invId, setInvId] = React.useState("");
  const router = useRouter();
  const [showCamera, setShowCamera] = React.useState(true);
  const webcamRef = React.useRef(null);
  const [isOpenSecondModal, setOpenSecondModal] = React.useState(false);
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const [capturedWeightImage, setCapturedWeightImage] = React.useState([]);
  const [capturedweightImages, setCapturedweightImages] = React.useState([]);
  const [capturedAvgWeightImage, setCapturedAvgWeightImage] = React.useState(
    []
  );
  const [capturedavgweightImages, setCapturedavgweightImages] = React.useState(
    []
  );
  const openFirstModal = () => setOpenFirstModal(true);
  const closeFirstModal = () => setOpenFirstModal(false);
  const openSecondModal = () => setOpenSecondModal(true);
  const closeSecondModal = () => setOpenSecondModal(false);
  const [scrapPercentage, setScrapPercentage] = React.useState(0);
  const [scrapGenerated, setScrapGenerated] = React.useState(0);
  const [conversionPercentage, setConversionPercentage] = React.useState(null);
  const [userEnteredQuantities, setUserEnteredQuantities] = React.useState({});
  const [transferId, setTransferId] = React.useState(null);
  React.useEffect(() => {
    let params;
    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
    const tfId = params?.get("tf");
    setTransferId(parseInt(tfId));
    setInvId(id);
    if (id) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${Domain}/inventory/particular-item-in-process/${id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const data = await response.json();
          if (data?.error) {
            toast.error(data.error);
            return;
          }

          setProcessData(data.inventoryEntry);
          setConversionPercentage(
            parseInt(data.inventoryEntry.ProcessStep.conversion_ratio)
          );

          if (data.inventoryEntry.Process.scrap) {
            const scrapResponse = await fetch(
              `${Domain}/inventory/scrap-conversion-percentage/${data.inventoryEntry.ProcessStep.id}`,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            const scrapData = await scrapResponse.json();
            if (scrapData?.error) {
              toast.error(scrapData.error);
            }
            setScrapPercentage(scrapData.conversionPercentage);
          }
          // Fetch components used for item
          const item_id = data.inventoryEntry.item_id;
          const componentsResponse = await fetch(
            `${Domain}/inventory/components-used-for-item/${item_id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const componentsData = await componentsResponse.json();
          if (componentsData?.error) {
            toast.error(componentsResponse.error);
            return;
          } else {
            setRmConsumedData(componentsData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchLocations = async () => {
        try {
          const token = localStorage.getItem("token");

          const response = await fetch(`${Domain}/location/users-location`, {
            headers: {
              Authorization: token,
            },
          });
          const data = await response.json();
          if (data?.error) {
            toast.error(data.error);
          } else {
            setLocations(data);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };

      fetchLocations();
      fetchData();
      setShowAnimation(false);
    }
  }, []);

  React.useEffect(() => {
    if (processData && processData.Process.average_weight) {
      if (ProductionWeight && avgValue) {
        const calculatedQty = (
          parseFloat(ProductionWeight * 100) / parseFloat(avgValue)
        ).toFixed(2);
        setProducedQty(calculatedQty);
      }
    }
  }, [ProductionWeight, avgValue, processData]);

  React.useEffect(() => {
    if (processData && processData.Process.scrap && !isNaN(ProductionWeight)) {
      const calculatedScrap =
        (ProductionWeight * 100 * (1 - scrapPercentage / 100)) /
        scrapPercentage;

      // Check if the calculated value is a valid number
      if (isFinite(calculatedScrap) && calculatedScrap >= 0) {
        setScrapGenerated(calculatedScrap.toFixed(2));
      } else {
        setScrapGenerated(0);
      }
    } else {
      setScrapGenerated(0);
    }
  }, [processData, scrapPercentage, ProductionWeight]);

  const handleQRScan = (e) => {
    const isLocationAllowed = allowedLocations.some(
      (loc) => loc.name == e.text
    );
    if (!isLocationAllowed) {
      toast.error("Scanned location is not allowed for this process");
    } else {
      setScannedValue(e.text);
      setQRScanned(true);
      toast.success("Location scanned successfully");
    }
    setOpenQRModal(false);
  };

  const handleCameraIconClick = () => {
    const factoryID = localStorage.getItem("factoryId");
    const locationsAllowed = locations.filter(
      (location) =>
        location.name == processData.Process.process_name &&
        location.factory_id == factoryID &&
        location.type === "PROCESS"
    );
    setAllowedLocations(locationsAllowed);
    setOpenQRModal(true);
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

  const handleFinishProcess = async () => {
    try {
      const token = localStorage.getItem("token");
      const locationId = allowedLocations.find(
        (loc) => loc.name == scannedValue
      )?.id;
  
      const requestBody = {
        inventory_id: parseInt(invId),
        produced_qty: parseInt(ProducedQty),
        scrap_location_id: parseInt(locationId),
        location_id: parseInt(locationId),
        production_weight: parseInt(ProductionWeight),
        avg_weight: parseInt(avgValue),
        other_images: [...capturedWeightImage, ...capturedAvgWeightImage],
      };

      if (transferId === 1 && processData.Item.type === 'purchase') {
        requestBody.component_and_raw_meterial_consumed = rmConsumedData.map((item) => {
          const calculatedQuantity = (() => {
            let consumedQty;
            if (item.uom === "Nos") {
              consumedQty = (ProducedQty * 100) / conversionPercentage;
            } else if (
              item.uom === "Kgs" &&
              processData?.Process.average_weight
            ) {
              consumedQty = (ProductionWeight * 100) / conversionPercentage;
            } else {
              consumedQty =
                (ProducedQty * processData.Item.avg_weight * 100) /
                conversionPercentage;
            }
            return consumedQty.toFixed(2);
          })();
  
          return {
            item_id: item.id,
            type: item.type,
            quantity: parseInt(
              userEnteredQuantities[item.id] || calculatedQuantity
            ),
          };
        });
      }
  
      if (processData.Process.scrap) {
        requestBody.scrap_generated = parseFloat(scrapGenerated);
      } else {
        requestBody.scrap_generated = 0;
      }
  
      const response = await fetch(`${Domain}/inventory/finish-process`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Process finished successfully");
        router.push("/StoreApp");
      }
    } catch (error) {
      console.error("Error finishing process:", error);
      toast.error("Failed to finish process");
    }
  };
  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            
            {processData && (
              <>
                {processData.Process.average_weight && (
                  <>
                    <div className="">
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
                                value={ProductionWeight}
                                onChange={(e) =>
                                  setProductionWeight(e.target.value)
                                }
                              ></Input>
                            </div>
                          )
                        ) : null}
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
                                Avg Weight (100pcs):-
                              </h1>
                              <Input
                                placeholder="Avg Weight"
                                value={avgValue}
                                onChange={(e) => setAVGValue(e.target.value)}
                              ></Input>
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>
                  </>
                )}
                <div className="p-3 bg-gray-800 rounded-xl shadow-black shadow-md mt-4 mb-4">
                  <h1
                    className="text-white font-bold text-center mt-3 mb-4"
                    onClick={() => console.log(conversionPercentage)}
                  >
                    {`${
                      processData?.Process.average_weight
                        ? "Produced Qty"
                        : "Enter Qty"
                    }`}
                  </h1>
                  <Input
                    label={`${
                      processData?.Process.average_weight
                        ? "Produced Qty"
                        : "Enter Qty"
                    }`}
                    value={ProducedQty}
                    onChange={(e) => setProducedQty(e.target.value)}
                    isDisabled={processData?.Process.average_weight}
                  />
                </div>
                {rmConsumedData && rmConsumedData.length > 0
              ? rmConsumedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-800 rounded-xl shadow-black shadow-md mt-4 mb-4"
                    style={{
                      display:
                        transferId === 1
                          ? "none"
                          : processData?.ProcessStep.sequence === 1
                          ? "block"
                          : "none",
                    }}
                  >
                    <h1 className="text-white font-bold text-center mt-3 mb-4">
                      <p className="text-green-400 font-bold">
                        {item.internal_item_name}
                      </p>{" "}
                      Consumed
                    </h1>
                    <Input
                      label="Consumed Qty"
                      value={
                        userEnteredQuantities[item.id] ||
                        (() => {
                          let consumedQty;
                          if (item.uom === "Nos") {
                            consumedQty =
                              (ProducedQty * 100) / conversionPercentage;
                          } else if (
                            item.uom === "Kgs" &&
                            processData?.Process.average_weight
                          ) {
                            consumedQty =
                              (ProductionWeight * 100) / conversionPercentage;
                          } else {
                            consumedQty =
                              (ProducedQty *
                                processData.Item.avg_weight *
                                100) /
                              conversionPercentage;
                          }
                          return consumedQty.toFixed(2);
                        })()
                      }
                      onChange={(e) =>
                        setUserEnteredQuantities((prevQuantities) => ({
                          ...prevQuantities,
                          [item.id]: e.target.value,
                        }))
                      }
                      isReadOnly={item.type === "component"}
                      isDisabled={item.type === "component"}
                    />
                  </div>
                ))
              : null}

                {processData.Process.scrap && (
                  <div className="p-2 bg-gray-800 mt-3 mb-2 shadow-gray-900 shadow-md rounded-xl">
                    <div className="flex justify-between gap-5 mt-3 mb-3 p-1">
                      <h1 className="font-bold text-white text-lg">
                        Scrap Generated
                      </h1>
                      <Input
                        placeholder="Scrap Generated"
                        value={scrapGenerated}
                        onChange={(e) => setScrapGenerated(e.target.value)}
                      ></Input>
                    </div>
                  </div>
                )}
                {ProducedQty && (
                  <Button
                    className="font-bold flex m-auto justify-center text-white mt-4 mb-4"
                    color="success"
                    onClick={
                      isQRScanned ? handleFinishProcess : handleCameraIconClick
                    }
                  >
                    {isQRScanned ? "Finish Process" : "Scan Location"}
                  </Button>
                )}
              </>
            )}
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
              {allowedLocations.map((location) => (
                <span key={location.id}>{`${location.name}, `}</span>
              ))}
            </div>
            <QrReader onRead={handleQRScan} />
          </ModalBody>
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
      <ToastContainer />
    </>
  );
};

export default page;
