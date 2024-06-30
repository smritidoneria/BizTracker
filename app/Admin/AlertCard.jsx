"use client";
import React from "react";
import { Card, CardBody, CardFooter,Button } from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

const AlertsCard = () => {
  return (
    <>
      <div className="bg-black lg:p-9 p-8">
        <h1 className="font-bold text-center text-white text-3xl mt-4 mb-4">Dashboard</h1>
        <Card className="bg-white shadow-gray-500 shadow-lg mt-8 p-2">
          <CardBody>
            <h1 className="font-bold lg:text-3xl text-2xl flex gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 mt-1 text-red-500 fontbold "
                
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              Alerts
            </h1>
            <div className="flex justify-between gap-4 lg:flex-nowrap flex-wrap p-2 ">
          
            <Card className="bg-white shadow-gray-500 shadow-lg mt-8 bg-[#fff5f7] hover:cursor-pointer hover:bg-white  ">
              <CardBody className="flex flex-row justify-between p-4">
                <div>
                <h1 className="font-bold text-xl">Item Name</h1>
                <h1>B/4 Parker Female tee 3/4 Tree 20</h1>
                <h1 className="mt-4 flex "> Current Qty -<p className=" font-semibold ">3000</p> </h1>
                <h1 className="mt-4 flex "> Required Qty -<p className=" font-semibold ">70000</p> </h1>
                <h1 className="mt-4 flex font-semibold" >State- <p className="">GRN</p></h1>
                <h1 className="mt-4 flex font-semibold" >Date- <p className="">17-01-202</p></h1>
                </div>
                <div className="m-2"><img src="/alert-card-gif.gif" alt="" /></div>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-gray-500 shadow-lg mt-8 bg-[#fff5f7] hover:cursor-pointer hover:bg-white  ">
              <CardBody className="flex flex-row justify-between p-4">
                <div>
                <h1 className="font-bold text-xl">Item Name</h1>
                <h1>B/4 Parker Female tee 3/4 Tree 20</h1>
                <h1 className="mt-4 flex "> Current Qty -<p className=" font-semibold ">3000</p> </h1>
                <h1 className="mt-4 flex "> Required Qty -<p className=" font-semibold ">70000</p> </h1>
                <h1 className="mt-4 flex font-semibold" >State- <p className="">GRN</p></h1>
                <h1 className="mt-4 flex font-semibold" >Date- <p className="">17-01-202</p></h1>
                </div>
                <div className="m-2"><img src="/alert-card-gif.gif" alt="" /></div>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-gray-500 shadow-lg mt-8 bg-[#ffeed6] hover:cursor-pointer hover:bg-gray-100  ">
              <CardBody className="flex flex-row justify-between p-4">
                <div>
                <h1 className="font-bold text-xl">Item Name</h1>
                <h1>B/4 Parker Female tee 3/4 Tree 20</h1>
                <h1 className="mt-4 flex "> Current Qty -<p className=" font-semibold ">3000</p> </h1>
                <h1 className="mt-4 flex "> Required Qty -<p className=" font-semibold ">70000</p> </h1>
                <h1 className="mt-4 flex font-semibold" >State- <p className="">GRN</p></h1>
                <h1 className="mt-4 flex font-semibold" >Date- <p className="">17-01-202</p></h1>
                </div>
                <div className="m-2"><img src="/alert-warning.gif" alt="" /></div>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-gray-500 shadow-lg mt-8 bg-[#ffeed6] hover:cursor-pointer hover:bg-gray-100  ">
              <CardBody className="flex flex-row justify-between p-4">
                <div>
                <h1 className="font-bold text-xl">Item Name</h1>
                <h1>B/4 Parker Female tee 3/4 Tree 20</h1>
                <h1 className="mt-4 flex "> Current Qty -<p className=" font-semibold ">3000</p> </h1>
                <h1 className="mt-4 flex "> Required Qty -<p className=" font-semibold ">70000</p> </h1>
                <h1 className="mt-4 flex font-semibold" >State- <p className="">GRN</p></h1>
                <h1 className="mt-4 flex font-semibold" >Date- <p className="">17-01-202</p></h1>
                </div>
                <div className="m-2"><img src="/alert-warning.gif" alt="" /></div>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-gray-500 shadow-lg mt-8 bg-[#ffeed6] hover:cursor-pointer hover:bg-gray-100  ">
              <CardBody className="flex flex-row justify-between p-4">
                <div>
                <h1 className="font-bold text-xl">Item Name</h1>
                <h1>B/4 Parker Female tee 3/4 Tree 20</h1>
                <h1 className="mt-4 flex "> Current Qty -<p className=" font-semibold ">3000</p> </h1>
                <h1 className="mt-4 flex "> Required Qty -<p className=" font-semibold ">70000</p> </h1>
                <h1 className="mt-4 flex font-semibold" >State- <p className="">GRN</p></h1>
                <h1 className="mt-4 flex font-semibold" >Date- <p className="">17-01-202</p></h1>
                </div>
                <div className="m-2"><img src="/alert-warning.gif" alt="" /></div>
              </CardBody>
            </Card>
            </div>
          </CardBody>
          <CardFooter className=" block">
            <h1 className="font-bold text-center mt-3 mb-3 text-xl">+ 20 more</h1>
            <Button color="primary" className="font-bold flex m-auto mt-4">See Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
export default AlertsCard;
