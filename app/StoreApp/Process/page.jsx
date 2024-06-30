/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";
import { Badge, Spinner, Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../Navbar/page";
import { FooterWithLogo } from "../Footer/StoreAppFooter";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [processData, setProcessData] = React.useState(null);
  const [filteredProcessData, setFilteredProcessData] = React.useState(null);
  const [StartedProcessData, setStartedProcessData] = React.useState(null);
  const [FilteredStartedProcessData, setFilteredStartedProcessData] =
    React.useState(null);
  const [selected, setSelected] = React.useState("NotStarted");
  const [processId, setProcessId] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [selectedFactory, setSelectedFactory] = React.useState(null);
  const [factories, setFactories] = React.useState([]);
  const router = useRouter();
  React.useEffect(() => {
    let params;
    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
    setProcessId(id);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/inventory/process/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch process data");
        }
        const data = await response.json();

        setProcessData(data);
        const factoryId = localStorage.getItem("factoryId");
        if (factoryId) {
          const filteredData = data.filter(
            (item) => item.Location?.Factory?.id.toString() === factoryId
          );
          setFilteredProcessData(filteredData);
        } else {
          setFilteredProcessData(data);
        }
      } catch (error) {
        console.error("Error fetching process data:", error);
      }
    };

    const fetchStartedData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${Domain}/inventory/started-processes/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        if (data?.error) {
          throw new Error("Failed to fetch started process data");
        }
       else{
        setStartedProcessData(data);
       
        // Filter started data based on factory ID from localStorage
        const factoryId = localStorage.getItem("factoryId");
        if (factoryId) {
          const filteredStartedData = data.filter(
            (item) => item.Location?.Factory?.id == factoryId
          );
          setFilteredStartedProcessData(filteredStartedData);
        } else {
          setFilteredStartedProcessData(data);
        }
      }
      } catch (error) {
        console.error("Error fetching started process data:", error);
      }
    };
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/items`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error);
        }
        setItems(data);
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };

    const fetchFactories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/factories`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setFactories(data);
      } catch (error) {
        console.error("Error fetching Factories:", error);
      }
    };
    fetchItems();
    fetchData();
    fetchStartedData();
    fetchFactories();
    setShowAnimation(false);
  }, []);
  
  React.useEffect(() => {
    if (selectedItem) {
      const filteredNotStarted = processData?.filter(
        (item) =>
          item.Item.internal_item_name === selectedItem.internal_item_name
      );
      const filteredStarted = StartedProcessData?.filter(
        (item) =>
          item.Item.internal_item_name === selectedItem.internal_item_name
      );
      setFilteredProcessData(filteredNotStarted);
      setFilteredStartedProcessData(filteredStarted);
    } else {
      setFilteredProcessData(processData);
      setFilteredStartedProcessData(StartedProcessData);
    }
  }, [selectedItem, processData, StartedProcessData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  };
  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);
    setSelectedItem(dropdownSelectedItem);
  };

  const handleTabClick = (id) => {
    setShowAnimation(true);
    router.push(`/StoreApp/Process/Step3?id=${id}&processId=${processId}`);
  };

  const handleStartedCardClick = (id) => {
    setShowAnimation(true);
    router.push(`/StoreApp/Process/Started?id=${id}`);
  };

  const handlerefresh = () => {
    setFilteredStartedProcessData(StartedProcessData);
    setFilteredProcessData(processData);
    setSelectedItem(null);
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
            {processData && (
              <>
                <div className="flex justify-center  items-center gap-4">
                  <h1
                    className="font-bold text-white text-center text-3xl mt-4 mb-4"
                    
                  >
                    {processData[0]?.Process?.process_name}
                  </h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-white mt-1"
                    onClick={handlerefresh}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </div>
                <div className="p-4 flex justify-center  items-center">
                  <Autocomplete
                    label="Item Name"
                    placeholder="Select Item Name"
                    defaultItems={items}
                    onSelectionChange={handleItemChange}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id}>
                        {item.internal_item_name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                <div className="flex w-full  justify-center items-center flex-col mt-4 mb-5">
                  <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="bordered"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                  >
                    <Tab
                      key="NotStarted"
                      title={
                        <div className="flex items-center space-x-2">
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/4415/4415438.png"
                            alt=""
                            className="w-3 h-3"
                          />
                          <span>Not Started</span>
                        </div>
                      }
                    />
                    <Tab
                      key="Started"
                      title={
                        <div className="flex items-center space-x-2">
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/8838/8838885.png"
                            alt=""
                            className="w-4 h-4"
                          />
                          <span>Started</span>
                        </div>
                      }
                    />
                  </Tabs>
                </div>
                <hr className="border-t-1 border-gray-500 mt-6 mb-6" />
                { selected === "NotStarted"&& filteredProcessData && (
                  <>
                    {filteredProcessData.map((item) => {
                     
                      return (
                        <Card className="p-2 bg-white mt-4 mb-4" key={item.id}>
                          <CardBody onClick={() => handleTabClick(item.id)}>
                            <div className="p-2">
                              <div className="flex justify-between">
                                <h2 className="font-bold mb-2">
                                  Date -{" "}
                                  {item.PlanOrder
                                    ? formatDate(
                                        item.PlanOrder
                                          .estimated_production_date || "N/A"
                                      )
                                    : "N/A"}
                                </h2>
                                <h2 className="font-bold mb-2">
                                  {" "}
                                  PLO ID - {item.plan_order_id}
                                </h2>
                              </div>
                              <h2 className="font-bold mt-4 mb-4 flex gap-6">
                                <p>{item.Item.internal_item_name}</p>
                                <p>Qty - {item.qty}</p>
                              </h2>
                              <hr className="border-t-2 border-black my-4 mt-4" />
                              <h2 className="font-bold mt-3 mb-3">
                                Component Or Raw Material Info
                              </h2>
                              {Array.isArray(item.components_info) ? (
                                item.components_info.map((component) => (
                                  <h2
                                    key={component.id}
                                    className="font-bold mt-4 mb-4 flex gap-6"
                                  >
                                    <p className="text-green-400">
                                      {component.name}
                                    </p>
                                    <p>{component.quantity}</p>
                                    <p>{component.type}</p>
                                  </h2>
                                ))
                              ) : Object.keys(item.components_info).length >
                                0 ? (
                                Object.keys(item.components_info).map((key) => (
                                  <h2
                                    key={key}
                                    className="font-bold mt-4 mb-4 flex gap-6"
                                  >
                                    <p className="text-green-400">
                                      {key}: {item.components_info[key]}
                                    </p>
                                  </h2>
                                ))
                              ) : (
                                <p>No components info available.</p>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </>
                )}

                {selected === "Started" && FilteredStartedProcessData && (
                  <>
                    {FilteredStartedProcessData.map((item) => (
                      <Card className="p-2 bg-white mt-4 mb-4" key={item.id}>
                        <CardBody
                          onClick={() => handleStartedCardClick(item.id)}
                        >
                          <div className="p-2">
                            <div className="flex justify-between">
                            <h2 className="font-bold mb-2">
                                  Date -{" "}
                                  {item.PlanOrder
                                    ? formatDate(
                                        item.PlanOrder
                                          .estimated_production_date || "N/A"
                                      )
                                    : "N/A"}
                                </h2>
                              <h2 className="font-bold mb-2">
                                {" "}
                                PLO-ID{item.PlanOrder?item.PlanOrder.id:"N/A"}
                               
                              </h2>
                            </div>
                            <h2 className="font-bold mt-4 mb-4 flex gap-6">
                              <p>{item.Item.internal_item_name}</p>
                              <p>Qty - {item.qty}</p>
                            </h2>
                            <hr className="border-t-2 border-black my-4 mt-4" />
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </>
                )}
              </>
            )}
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
