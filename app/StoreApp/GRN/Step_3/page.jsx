/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import {  Card, CardBody,Button,Input } from "@nextui-org/react";
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
import QrReader from "@/app/QRreader/QRreader";
import { Domain } from "@/Domain";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [isOpenQRModal, setOpenQRModal] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(true);
  const [scannedValue, setScannedValue] = React.useState("");
  const [grnLocations, setGrnLocations] = React.useState([]); 
  const router = useRouter();
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
        if (data?.error) {
          throw new Error(data.error);
        }
        const locations = data.filter(
          (location) => location.type === "GRN" && location.factory_id == factoryID
        );
        setGrnLocations(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);


  const handleQRScan = (e) => {
    const scannedLocation = grnLocations.find(
      (location) => location.name === e.text
    );
    if (scannedLocation) {
      // Do something with the scanned location object

      setScannedValue(e.text);
      setShowCamera(false);
      setOpenQRModal(false);
      router.push("/StoreApp")
    } else {
      console.log("Location not found:", e.text);
      toast.error("Location not found:", e.text)
    }

   
    // setIsQRScanned(true);
  };
  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            <h1 className="font-bold text-white text-center text-2xl mt-4 mb-4" >
                Weight Now or Later
            </h1>
            <div className="w-full h-full flex items-center justify-center mt-4 mb-3">
                <img src="/Animation-8.gif" alt="nothing" className="animateGif w-56 h-56"/>
                </div>
            <div className="flex justify-center gap-4 ">
            <div className="p-3 ">
            <Button color="success" className="flex m-auto rounded-xl font-bold text-white" onClick={()=>{
              setOpenQRModal(true);
            }}>Weight Later</Button>
            </div>
            <h1 className="text-center font-bold text-white mt-5">OR</h1>
            <div className="p-3">
            <Button color="primary" className="flex m-auto rounded-xl font-bold text-white" onClick={()=>{
              router.push(`/StoreApp/GRN/Step_4?po_id=${poID}`)
            }}>Weight Now</Button>
            </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <FooterWithLogo />
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
