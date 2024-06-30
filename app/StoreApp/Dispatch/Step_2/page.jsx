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
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AWS from "aws-sdk";
const page = () => {
  const [soID, setSoID] = React.useState(null);
  const [showAnimation, setShowAnimation] = React.useState(false);

  const [SalesOrderDetails, setSalesOrderDetails] = React.useState([]);

  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const salesOrderID = params.get("so_id");
      setSoID(salesOrderID);
    }
  }, []);

  React.useEffect(() => {
    const fetchSODetails = async () => {
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
        if(data?.error){
          toast.error(data.error)
        }
        else {
          setSalesOrderDetails(data.pendingOrder);
        }
      } catch (error) {
        console.error("Error fetching PO details:", error);
      }
    };
    if (soID) {
      fetchSODetails();
    }
    
  }, [soID]);

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2 mt-5 mb-6">
          <CardBody>
            <h1 className="font-bold text-white text-center text-2xl mt-4 mb-4">
              Dispatch Schedule
            </h1>

            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>Item Name</TableColumn>
                <TableColumn>Qty</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                {SalesOrderDetails?.OrderItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item?.Item?.internal_item_name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      {item.estimate_date_of_dispatch?.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              className="text-white font-bold flex justify-center items-center m-auto mt-4 mb-3"
              color="success"
              onClick={() => {
                router.push(`/StoreApp/Dispatch/Step_3?so_id=${soID}`);
              }}
            >
              Next
            </Button>
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
      <ToastContainer />
    </>
  );
};

export default page;
