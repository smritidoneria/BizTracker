/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";
import {
  Badge,
  Spinner,
  Card,
  CardBody,
  Input,
  Tabs,
  Tab,
  Button
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";

const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(false);

  const handleTabClick = () => {
    setShowAnimation(true);
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            <h1 className="font-bold text-white text-center text-3xl mt-4 mb-4">
              Process 1
            </h1>
            <div className=" flex justify-center gap-3 mt-4 mb-4">
              <h1 className="font-bold text-white">RM</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
              <h1 className="font-bold text-white">Sale_Item</h1>
            </div>
            <div className=" flex justify-center gap-3 mt-4 mb-4">
              <h1 className="font-bold text-white">1000kg</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
              <h1 className="font-bold text-white">100000</h1>
            </div>
            <div className="flex justify-center gap-6 mt-5 mb-5 w-full p-3 rounded-xl bg-gray-800">
              <h1 className="font-bold text-white w-2/5">
                Enter RM Qty going in Process -:
              </h1>
              <Input label="Enter Qty" className="w-3/5 mt-2"></Input>
            </div>
            <div className="w-full h-full mt-5 flex items-center justify-center">
              <img
                src="/Animation-5.gif"
                alt="nothing"
                className="animateGif w-full lg:hidden md:hidden flex w-92 h-56"
              />
            </div>
            <Button className=" flex justify-center items-center mt-7" color="primary">Scan To Start Process </Button>
          </CardBody>
        </Card>
      </div>
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
    </>
  );
};

export default page;
