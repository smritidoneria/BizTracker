/* eslint-disable react-hooks/exhaustive-deps */
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
  Input,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [processData, setProcessData] = React.useState(null);
  const [processDataPlanOrder, setProcessDataPlanOrder] = React.useState([]);
  const [processId, setProcessId] = React.useState("");
  const [hasZeroQuantity, setHasZeroQuantity] = React.useState(false);
  const router = useRouter();
  let params;

  if (global?.window !== undefined) {
    params = new URLSearchParams(global.window.location.search);
  }
  const id = params?.get("id");
  const processID = params?.get("processId");

  useEffect(() => {
    setProcessId(processID);
  }, [processID]);

  useEffect(() => {
    let params;

    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
    const processID = params?.get("processId");
    setProcessId(processID);
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
        if (!response.ok) {
          throw new Error("Failed to fetch process data");
        }
        const data = await response.json();

        setProcessData(data.inventoryEntry);
        setProcessDataPlanOrder(data.planOrderSchedules);
        let updatedComponentsInfo;
        let hasZeroQty = false;
        if (Array.isArray(data.inventoryEntry.components_info)) {
          updatedComponentsInfo = await Promise.all(
            data.inventoryEntry.components_info.map(async (component) => {
              const planOrderId = data.inventoryEntry.plan_order_id;
              const locationResponse = await fetch(
                `${Domain}/inventory/item-location?item_id=${component.id}&plan_order_id=${planOrderId}`,
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              const locationData = await locationResponse.json();
              if (locationData?.error) {
                toast.error(locationData.error);
              }

              if (locationData.length > 0 && locationData[0].qty === 0) {
                hasZeroQty = true;
              }

              return {
                ...component,
                location:
                  locationData.length > 0 ? locationData[0].Location.name : "",
                itemQty:
                  locationData.length > 0
                    ? parseInt(locationData[0].qty, 10)
                    : 0,

                qcState:
                  locationData.length > 0 ? locationData[0].QCState.name : "",
              };
            })
          );
        } else if (data.inventoryEntry.components_info) {
          const component = data.inventoryEntry.components_info;
          const planOrderId = data.inventoryEntry.plan_order_id;
          const locationResponse = await fetch(
            `${Domain}/inventory/item-location?item_id=${component.id}&plan_order_id=${planOrderId}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const locationData = await locationResponse.json();
          if (locationData?.error) {
            toast.error(locationData.error);
            return;
          }
          if (locationData.length > 0 && locationData[0].qty == 0) {
            hasZeroQty = true;
          }
          updatedComponentsInfo = [
            {
              ...component,
              location:
                locationData.length > 0 ? locationData[0].Location.name : "",
              itemQty:
                locationData.length > 0 ? parseInt(locationData[0].qty, 10) : 0,
              qcState:
                locationData.length > 0 ? locationData[0].QCState.name : "",
            },
          ];
        }
        setHasZeroQuantity(hasZeroQty);
        setProcessData((prevData) => ({
          ...prevData,
          components_info: updatedComponentsInfo,
        }));
      } catch (error) {
        console.error("Error fetching process data:", error);
      }
    };
 
    fetchData();
    setShowAnimation(false);
  }, [id]);

  const handleCollectRM = async () => {
    setShowAnimation(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/start-process`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inventory_id: id }), // id taken from the URL
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
        setShowAnimation(false)
        throw new Error("Failed to start the process");
      } else {
        toast.success("Process started successfully");

        router.push(`/StoreApp/Process?id=${processId}`);
      }
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };

  const renderComponentInfo = () => {
    if (processData?.ProcessStep?.sequence > 1) {
      const matchingPlanOrder = processDataPlanOrder.find(
        (planOrder) => planOrder.process_id === processData.previous_process_id
      );
      if (matchingPlanOrder) {
        return (
          <Card className={`bg-gray-900 p-1 mt-6 mb-6 planOrderCard`}>
            <CardBody>
              <h1 className="font-bold text-white mt-3 mb-4 text-center text-xl">
                Previous Process Information
              </h1>
              <div className="p-4 bg-gray-800 rounded shadow-md">
                <p className="text-white mt-4 mb-4">
                  <strong>Process Name:</strong>{" "}
                  {matchingPlanOrder?.Process?.process_name || "N/A"}
                </p>
                <p className="text-white mt-4 mb-4">
                  <strong>Internal Item Name:</strong>{" "}
                  {matchingPlanOrder?.Item?.internal_item_name || "N/A"}
                </p>
                <p className="text-white mt-4 mb-4">
                  <strong>Produced Quantity:</strong>{" "}
                  {matchingPlanOrder?.produced_qty || "N/A"}
                </p>
              </div>
            </CardBody>
          </Card>
        );
      } else {
        return <p className="text-white">No matching plan order found.</p>;
      }
    } else {
      return (
        <>
          <h1 className="font-bold text-white mt-3 mb-4 text-center text-xl">
            Components Info
          </h1>
          <Table aria-label="Components Info Table">
            <TableHeader>
              <TableColumn>Component Name</TableColumn>
              <TableColumn>Location</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>QC State</TableColumn>
            </TableHeader>
            <TableBody>
              {Array.isArray(processData?.components_info) ? (
                processData.components_info.map((component, index) => (
                  <TableRow key={index}>
                    <TableCell>{component?.name || "N/A"}</TableCell>
                    <TableCell>{component?.location || "N/A"}</TableCell>
                    <TableCell>{component?.itemQty || "N/A"}</TableCell>
                    <TableCell>{component?.qcState || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : processData?.components_info ? (
                <TableRow>
                  <TableCell>
                    {processData.components_info?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {processData.components_info?.location || "N/A"}
                  </TableCell>
                  <TableCell>
                    {processData.components_info?.itemQty || "N/A"}
                  </TableCell>
                  <TableCell>
                    {processData.components_info?.qcState || "N/A"}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </>
      );
    }
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black" >
        <Card className="bg-gray-900 p-1 mt-6 mb-6">
          <CardBody>{renderComponentInfo()}</CardBody>
        </Card>
        <hr className="my-8 border-blue-gray-50" />
        <Button
          className="font-bold text-white flex m-auto mt-5 mb-3"
          color="success"
          onClick={handleCollectRM}
          isDisabled={hasZeroQuantity}
        >
          Collect RM
        </Button>
      </div>
      <FooterWithLogo />
      <ToastContainer />
      {showAnimation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
          <img
            src="/Animation-3.gif"
            alt="Loading Animation"
            className="animateGif w-56 h-56"
          />
        </div>
      )}
    </>
  );
};

export default page;
