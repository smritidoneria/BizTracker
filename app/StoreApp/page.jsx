/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import NavbarStore from "./Navbar/page";
import { FooterWithLogo } from "./Footer/StoreAppFooter";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Page = () => {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [processes, setProcesses] = React.useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  React.useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const token = localStorage.getItem("token");
        const factoryId = localStorage.getItem("factoryId");
        const response = await fetch(`${Domain}/processes/users-processes`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error);
        } else {
          setProcesses(data);
        }
      } catch (error) {
        console.error("Error fetching Process:", error);
      }
    };

    fetchProcesses();
  }, []);

  const handleTabClick = async (route, type, ID) => {
    setShowAnimation(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (type === "external") {
      router.push(`/ExternalProcessPages/Step_1?id=${ID}`);
    } else if (type === "transfer") {
      router.push(`/ExternalProcessPages/Step_1?id=${ID}&tf=1`);
    } else {
      router.push(route);
    }
    setShowAnimation(false);
  };

  return (
    <>
      <NavbarStore />
      <div className="p-6 bg-black">
        <div className="flex flex-wrap">
          <div className="lg:w-1/3 md:w-1/3 w-1/2 p-4">
            <div className="bg-blue-500 rounded-lg shadow-lg shadow-gray-600 h-32 flex items-center justify-center cursor-pointer transition ease-in-out duration-300" onClick={() => handleTabClick("/StoreApp/GRN")}>
              <h1 className="text-white font-bold text-xl text-center">GRN</h1>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/3 w-1/2 p-4">
            <div className="bg-blue-500 rounded-lg shadow-lg shadow-gray-600 h-32 flex items-center justify-center cursor-pointer transition ease-in-out duration-300" onClick={() => handleTabClick("/StoreApp/Dispatch")}>
              <h1 className="text-white font-bold text-xl text-center">Dispatch</h1>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/3 w-1/2 p-4">
            <div className="bg-blue-500 rounded-lg shadow-lg shadow-gray-600 h-32 flex items-center justify-center cursor-pointer transition ease-in-out duration-300">
              <h1 className="text-white font-bold text-xl text-center">Audit</h1>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/3 w-1/2 p-4">
            <div className="bg-blue-500 rounded-lg shadow-lg shadow-gray-600 h-32 flex items-center justify-center cursor-pointer transition ease-in-out duration-300" onClick={() => handleTabClick("/StoreApp/Onboarding")}>
              <h1 className="text-white font-bold text-xl text-center">Onboarding</h1>
            </div>
          </div>
          {processes && processes.length > 0 ? processes.map((process) => (
            <div
              key={process.id}
              className="lg:w-1/3 md:w-1/3 w-1/2 p-4"
              onClick={() => handleTabClick(`/StoreApp/Process?id=${process.process_id}`, process.process_type, process.process_id)}
            >
              <div className="bg-blue-500 h-32 flex items-center justify-center rounded-lg shadow-lg shadow-gray-600 cursor-pointer transition ease-in-out duration-300">
                <h1 className="text-white font-bold text-lg text-center">{process.process_name}</h1>
              </div>
            </div>
          )) : null}
        </div>
      </div>
      <FooterWithLogo />
      {showAnimation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
          <img src="/Animation-3.gif" alt="nothing" className="animateGif w-56 h-56" />
        </div>
      )}
    </>
  );
};

export default Page;
