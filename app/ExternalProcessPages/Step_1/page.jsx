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
  AutocompleteItem,
  Autocomplete,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "@/app/StoreApp/Navbar/page";
import { FooterWithLogo } from "@/app/StoreApp/Footer/StoreAppFooter";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [processData, setProcessData] = React.useState([]);
  const [StartedProcessData, setStartedProcessData] = React.useState([]);
  const [
    filteredStartedProcessData,
    setFilteredStartedProcessData,
  ] = React.useState([]);
  const [filteredProcessData, setFilteredProcessData] = React.useState([]);
  const [selected, setSelected] = React.useState("NotStarted");
  const [selectedFactory, setSelectedFactory] = React.useState(null);
  const [
    selectedGrnTransferFactory,
    setSelectedGrnTransferFactory,
  ] = React.useState(null);
  const [factories, setFactories] = React.useState([]);
  const [selectedVendor, setSelectedvendor] = React.useState(null);
  const [vendors, setVendors] = React.useState([]);
  const router = useRouter();
  const [transferId, setTransferId] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    let params;
    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
    const tfId = params?.get("tf");
    setTransferId(tfId);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/inventory/process/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          throw new Error(data.error, "Failed to fetch process data");
        }
        const factoryId = localStorage.getItem("factoryId");
        if (factoryId) {
          const filteredStartedData = data.filter(
            (item) => item.Location?.Factory?.id == factoryId
          );
          setProcessData(filteredStartedData);
          setFilteredProcessData(filteredStartedData);
        } else {
          setFilteredProcessData(data);
        }
      } catch (error) {
        console.error("Error fetching process data:", error);
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
    const fetchVendorsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/vendors`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch vendors data");
        }
        const data = await response.json();

        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors data:", error);
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

    fetchItems();

    fetchVendorsData();
    fetchFactories();
    fetchData();

    setShowAnimation(false);
  }, [transferId]);

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

  React.useEffect(() => {
    let params;
    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
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
        const startedData = await response.json();
        if (startedData?.error) {
          toast.error(startedData.error);
          throw new Error(startedData.error, "Failed to fetch process data");
        } else {
          if (transferId == 1) {
            const factoryId = localStorage.getItem("factoryId");
            const filterdDataforStarted = startedData.filter(
              (item) => item.factory_id == factoryId
            );
            setFilteredStartedProcessData(filterdDataforStarted);
            setStartedProcessData(filterdDataforStarted);
          
          } else {
            const factoryId = localStorage.getItem("factoryId");
            const filterdDataforStarted = startedData.filter(
              (item) => item.Location?.Factory?.id == factoryId
            );
            setFilteredStartedProcessData(filterdDataforStarted);
            setStartedProcessData(filterdDataforStarted);
        
          }
        }
      } catch (error) {
        console.error("Error fetching process data:", error);
      }
    };
    fetchStartedData();
  }, [transferId, selected]);

  const handleVendors = (id) => {
    const Vendor = vendors.find((vendor) => vendor.id == id);
   
    setSelectedvendor(Vendor);
    if (Vendor) {
      const filteredData = StartedProcessData.filter(
        (item) => item.vendor_id == Vendor.id
      );
      setFilteredStartedProcessData(filteredData);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  };

  const handleTabClick = (id) => {
    setShowAnimation(true);
    router.push(`/ExternalProcessPages/Step_2?id=${id}&tf=${transferId}`);
  };

  const handleStartedCardClick = (id) => {
    setShowAnimation(true);
    router.push(`/StoreApp/Process/Started?id=${id}&tf=${transferId}`);
  };
  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);

    setSelectedItem(dropdownSelectedItem);
  };

  const handlerefresh = () => {
    setFilteredStartedProcessData(StartedProcessData);
    setFilteredProcessData(processData);
    setSelectedGrnTransferFactory(null);
    setSelectedvendor(null);
    setSelectedFactory(null);
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
                    onClick={()=> console.log(filteredStartedProcessData)}
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
                {selected === "Started" && StartedProcessData && (
                  <>
                    {transferId == 1 ? (
                      <div className="flex  justify-center items-center p-4"></div>
                    ) : (
                      <div className="flex justify-center items-center p-4">
                        <Autocomplete
                          label="Vendor"
                          className="w-full p-2 mt-4 mb-3"
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
                    )}
                  </>
                )}
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
                          <span>Dispatch</span>
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
                          <span>GRN</span>
                        </div>
                      }
                    />
                  </Tabs>
                </div>
                <hr className="border-t-1 border-gray-500 mt-6 mb-6" />
                {selected === "NotStarted" && filteredProcessData && (
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
                                <p>{item?.Item?.internal_item_name}</p>
                                <p>Qty - {item.qty}</p>
                              </h2>
                              <hr className="border-t-2 border-black my-4 mt-4" />
                              <h2 className="font-bold mt-3 mb-3">
                                Component Or Raw Material Info
                              </h2>
                              {Array.isArray(item.components_info) ? (
                                item.components_info.map((component) => (
                                  <div
                                    key={component.id}
                                    className="font-bold mt-4 mb-4 flex gap-6"
                                  >
                                    <p className="text-green-400">
                                      {component.name}
                                    </p>
                                    <p>{component.quantity}</p>
                                  </div>
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

                {selected === "Started" &&
                  Array.isArray(filteredStartedProcessData) &&
                  filteredStartedProcessData.length > 0 && (
                    <>
                      <div>
                        {filteredStartedProcessData.map((item) => (
                          <Card
                            className="p-2 bg-white mt-4 mb-4"
                            key={item.id}
                          >
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
                                  PLO ID - {item.plan_order_id}
                                </h2>
                              </div>
                                <h2 className="font-bold mt-4 mb-4 flex gap-6">
                                  <p>{item?.Item?.internal_item_name}</p>
                                  <p>Qty - {item.qty}</p>
                                </h2>
                                <hr className="border-t-2 border-black my-4 mt-4" />
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
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
    </>
  );
};

export default page;
