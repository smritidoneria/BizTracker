/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";
import {
  Badge,
  Spinner,
  Card,
  CardBody,
  Tabs,
  Tab,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "@/app/StoreApp/Navbar/page";
import { FooterWithLogo } from "@/app/StoreApp/Footer/StoreAppFooter";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QrReader from "@/app/QRreader/QRreader";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [processedData, setProcessedData] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);
  const [vendors, setVendors] = React.useState([]);
  const [factories, setFactories] = React.useState([]);
  const [showCamera, setShowCamera] = React.useState(true);
  const [scannedValue, setScannedValue] = React.useState("");
  const [isOpenQRModal, setOpenQRModal] = React.useState(false);
  const [matchedLocation, setMatchedLocation] = React.useState(null);
  const [dispatchLocations, setDispatchLocations] = React.useState([]);
  const [isQRScanned, setIsQRScanned] = React.useState(false);
  const [selectedVendor, setSelectedvendor] = React.useState(null);
  const [selectedFactory, setSelectedfactory] = React.useState(null);
  const router = useRouter();
  const [nextButtonDisable, setNextButtonDisable] = React.useState(false);
  const [transferId, setTransferId] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      let params;
      if (global?.window !== undefined) {
        params = new URLSearchParams(global.window.location.search);
      }
      const id = params?.get("id");
      const tfId = params?.get("tf");
      setTransferId(tfId);
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
          setNextButtonDisable(true);
          return;
        } else {
          setProcessedData(data.inventoryEntry);

          const processId = data.inventoryEntry.process_id;
          const matchingSchedules = data.planOrderSchedules.filter(
            (schedule) => schedule.process_id === processId
          );

          setTableData(matchingSchedules);
        }
      } catch (error) {
        console.error("Error fetching inventory entry data:", error);
      }
    };

    const fetchVendorsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/vendors`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
         toast.error(data.error)
        }else{
        setVendors(data);
        }
      } catch (error) {
        console.error("Error fetching vendors data:", error);
      }
    };
    const fetchFacoriesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/factories`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error)
        } else {
        setFactories(data);
        }
      } catch (error) {
        console.error("Error fetching factories data:", error);
      }
    };
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const factoryId = localStorage.getItem("factoryId");
        const response = await fetch(`${Domain}/location/users-location`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        }else{
        const dispatchLocations = data.filter(
          (location) =>
            location.type === "DISPATCH" && location.factory_id == factoryId
        );
        setDispatchLocations(dispatchLocations);
      }
      } catch (error) {
        console.error("Error fetching Locations:", error);
      }
    };

    fetchLocations();
    fetchFacoriesData();
    fetchVendorsData();
    fetchData();
    setShowAnimation(false);
  }, []);

  let params;
  if (global?.window !== undefined) {
    params = new URLSearchParams(global.window.location.search);
  }
  const id = params?.get("id");

  const handleVendors = (id) => {
    const Vendor = vendors.find((vendor) => vendor.id == id);

    setSelectedvendor(Vendor);
  };
  const handleFactories = (id) => {
    const factory = factories.find((factory) => factory.id == id);

    setSelectedfactory(factory);
  };

  const handleTabClick = async () => {

    setShowAnimation(true);
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        inventory_id: processedData.id,
        location_id: matchedLocation.id,
      };

      if (transferId == 1) {
        requestBody.factory_id = selectedFactory ? selectedFactory.id : null;
      } else {
        requestBody.vendor_id = selectedVendor ? selectedVendor.id : null;
      }

      const response = await fetch(`${Domain}/inventory/start-process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }

      toast.success("Process started successfully:", data);
      router.push(`/StoreApp`);
    } catch (error) {
      console.error("Error starting process:", error);
    } finally {
      setShowAnimation(false);
    }
  };

  const handleQRScan = (e) => {
    const scannedLocation = dispatchLocations.find(
      (location) => location.name === e.text
    );
    if (scannedLocation) {
      // Do something with the scanned location object

      toast.success("Scanned location:", scannedLocation);
      setMatchedLocation(scannedLocation);

      setScannedValue(e.text);
      setShowCamera(false);
      setOpenQRModal(false);
      setIsQRScanned(true);
    } else {
      console.log("Location not found:", e.text);
      toast.error("Location not found:", e.text);
    }
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            <div className="mt-3 mb-4">
              {processedData && (
                <div className=" shadow-blue-600 shadow-md bg-blue-600  rounded-xl p-3">
                  <h1
                    className="text-white font-bold text-center my-4"
                   
                  >
                    Item Info
                  </h1>
                  <div className="flex justify-between">
                    <span className="font-bold text-white">
                      {processedData?.Item?.internal_item_name}
                    </span>
                    <span className="font-bold text-white">
                      {processedData.qty}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {transferId == 1 ? (
              <div className="flex p-3 justify-center gap-5 mt-5 mb-5 h-64">
                <h1 className="font-bold text-white">Select Factory</h1>
                <Autocomplete
                  label="factory"
                  className="w-full"
                  value={factories}
                  onSelectionChange={handleFactories}
                >
                  {factories.map((factory) => (
                    <AutocompleteItem key={factory.id}>
                      {factory.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            ) : (
              <>
                <div className="flex p-3 justify-center gap-5 mt-5 mb-5">
                  <h1 className="font-bold text-white">Select Vendor</h1>
                  <Autocomplete
                    label="Vendor"
                    className="w-full"
                    value={vendors}
                    onSelectionChange={handleVendors}
                  >
                    {vendors.map((vendor) => (
                      <AutocompleteItem key={vendor.id}>
                        {vendor.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </>
            )}
            <div className="flex mt-4 justify-center">
              {scannedValue ? (
                <Button
                  color="success"
                  className="font-bold text-white"
                  onClick={handleTabClick}
                  isDisabled={nextButtonDisable}
                >
                  Next
                </Button>
              ) : (
                <>
                {selectedVendor && (
                <Button
                  color="primary"
                  className="font-bold text-white"
                  onClick={() => setOpenQRModal(true)}
                  isDisabled={nextButtonDisable}
                >
                  Scan Location
                </Button>
                )}
                
                 {selectedFactory && (
                <Button
                  color="primary"
                  className="font-bold text-white"
                  onClick={() => setOpenQRModal(true)}
                  isDisabled={nextButtonDisable}
                >
                  Scan Location
                </Button>
                )}
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
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
                <span key={location.id}>{`${location.name},`}</span>
              ))}
            </div>
            <QrReader onRead={handleQRScan} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <FooterWithLogo />
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
