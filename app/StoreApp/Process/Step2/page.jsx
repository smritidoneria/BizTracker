/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";
import { Badge, Spinner,Card,CardBody,Tabs, Tab, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Domain } from "@/Domain";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [processedData, setProcessedData] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);
  const router = useRouter();
React.useEffect(() => {
  const fetchData = async () => {
    let params;
    if (global?.window !== undefined) {
       params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/particular-item-in-process/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch inventory entry data");
      }
      const data = await response.json();
      setProcessedData(data.inventoryEntry);
      const processId = data.inventoryEntry.process_id;
      const matchingSchedules = data.planOrderSchedules.filter(schedule => schedule.process_id === processId);

      setTableData(matchingSchedules);
    } catch (error) {
      console.error("Error fetching inventory entry data:", error);
    }
  };

  fetchData();
  setShowAnimation(false)
}, []);

const handleTabClick = () => {
  setShowAnimation(true);
  router.push(`/StoreApp/Process/Step3?id=${processedData.id}`);
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
      <h1 className="text-white font-bold text-center my-4">Item Info</h1>
      <div className="flex justify-between">
        <span className="font-bold text-white">{processedData.Item.internal_item_name}</span>
        <span className="font-bold text-white">{processedData.qty}</span>
      </div>
    </div>
  )}
              </div>
          <h1 className="font-bold text-white text-center text-2xl mt-6 mb-4">Process Schedule</h1>
          <Table className="mt-3 mb-4">
            <TableHeader>
              <TableColumn>Item Name</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.Item.internal_item_name}</TableCell>
                  <TableCell>{item.produced_qty}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        
                <div className="flex mt-4 justify-center">
                    <Button color="success" className="font-bold text-white" onClick={handleTabClick}>Next</Button>
                </div>
        </CardBody>
      </Card>
    </div>
    <FooterWithLogo />
    {showAnimation && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
        <img src="/Animation-3.gif" alt="nothing" className="animateGif w-56 h-56"/>
      </div>
    )}
  </>
);
};

export default page;
