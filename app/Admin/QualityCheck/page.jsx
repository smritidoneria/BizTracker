/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../adminNavbar/page";
import {
  Card,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  Autocomplete,
  AutocompleteItem
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const [inventoryEntries, setInventoryEntries] = React.useState([]);
  const [qcStates, setQcStates] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState("pending");
  const [selectedStates, setSelectedStates] = React.useState({});
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [filteredEntries, setFilteredEntries] = React.useState([]);
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
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
  }, []);
  const fetchQCProcessData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/qc-process`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setInventoryEntries(data.inventoryEntries);
      setFilteredEntries(data.inventoryEntries)
    } catch (error) {
      toast.error("Failed to fetch QC process data.");
    }
  };

  const fetchQCRejectedHoldData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/qc-rejected-hold`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setInventoryEntries(data.inventoryEntries);
      setFilteredEntries(data.inventoryEntries)
    } catch (error) {
      toast.error("Failed to fetch rejected/hold data.");
    }
  };

  const fetchQCStates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/qc-states`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setQcStates(data);
    } catch (error) {
      toast.error("Failed to fetch QC states.");
    }
  };

  React.useEffect(() => {
    fetchQCStates();

    if (selectedTab === "pending") {
      fetchQCProcessData();
    } else if (selectedTab === "rejected") {
      fetchQCRejectedHoldData();
    }
  }, [selectedTab]);

  React.useEffect(() => {
    if (selectedItem) {
      setFilteredEntries(
        inventoryEntries.filter(
          (entry) => entry?.Item?.internal_item_name === selectedItem.internal_item_name
        )
      );
    } else {
      setFilteredEntries(inventoryEntries);
    }
  }, [selectedItem, inventoryEntries]);
  

  const handleStateSelect = (inventoryId, stateId) => {
    setSelectedStates((prevStates) => ({
      ...prevStates,
      [inventoryId]: stateId,
    }));
  };

  const handleSubmit = async (inventoryId) => {
    const newQCStateId = selectedStates[inventoryId];
    if (!newQCStateId) {
      toast.error("Please select a state before submitting.");
      return;
    }

    const selectedStateName = qcStates
      .find((state) => state.id == newQCStateId)
      ?.name.toLowerCase();

    try {
      const token = localStorage.getItem("token");

      if (selectedStateName === "rejected" || selectedStateName === "hold") {
        const response = await fetch(`${Domain}/inventory/qc-state-update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            inventory_id: inventoryId,
            newQCStateId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update QC state.");
        }
      } else {
        const response = await fetch(`${Domain}/inventory/qc-process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            inventory_id: inventoryId,
            newQCStateId,
            location_id: null,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit QC state.");
        }
      }

      setInventoryEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== inventoryId)
      );

      toast.success("QC state submitted successfully.");
    } catch (error) {
      toast.error("Failed to submit QC state.");
    }
  };

  const handleScrapClick = async (inventoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/qc-process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          inventory_id: inventoryId,
          newQCStateId: 4, // Assuming 4 is the ID for the "Scrap" state
          location_id: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as scrap.");
      }

      setInventoryEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== inventoryId)
      );

      toast.success("Item marked as scrap successfully.");
    } catch (error) {
      toast.error("Failed to mark as scrap.");
    }
  };
  const handleFinishClick = async (inventoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/inventory/qc-process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          inventory_id: inventoryId,
          newQCStateId: 2, // Assuming 4 is the ID for the "Scrap" state
          location_id: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as scrap.");
      }

      setInventoryEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== inventoryId)
      );

      toast.success("Item marked as Finish successfully.");
    } catch (error) {
      toast.error("Failed to mark as Finish.");
    }
  };
  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);
  
    setSelectedItem(dropdownSelectedItem);
  };

  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black">
        <Card className="p-4 bg-gray-900">
          <h1
            className="p-2 text-center text-white font-bold text-3xl mb-3"
   
          >
            Quality Check
          </h1>
          <div className="p-4 flex justify-center  items-center w-full">
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
          <div className="flex justify-center mt-3 mb-4">
            <Tabs
              color="primary"
              aria-label="Tabs colors"
              radius="full"
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
            >
              <Tab key="pending" title="Pending" />
              <Tab key="rejected" title="Rejected" />
            </Tabs>
          </div>
          {selectedTab === "rejected"
            ? filteredEntries.map((entry) => (
                <div
                  className="mt-6 mb-4 flex justify-center gap-8 lg:flex-nowrap md:flex-nowrap flex-wrap p-4 bg-white rounded-xl"
                  key={entry.id}
                >
                  <Card className="bg-white p-4 w-full">
                    <h1 className="font-bold text-black mt-3 mb-4 text-2xl">
                      PLO ID: {entry.plan_order_id}
                    </h1>
                    <div className="flex justify-between gap-8 ">
                      <div>
                        <h1 className="font-semibold mb-2">Item Name</h1>
                        <h1 className="">{entry?.Item?.internal_item_name}</h1>
                      </div>
                      <div>
                        <h1 className="font-semibold mb-2">Process Name</h1>
                        <h1 className="">{entry?.Process?.process_name}</h1>
                      </div>
                      <div>
                        <h1 className="font-semibold mb-2">Qty</h1>
                        <h1 className="">{entry.qty}</h1>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white p-4 w-full ">
                    <div className="flex justify-center gap-7">
                      <Button
                        className="font-bold lg:mt-8 md:mt-9 mt-4 mb-4"
                        color="danger"
                        onClick={() => handleScrapClick(entry.id)}
                      >
                        Mark As Scrap
                      </Button>

                      <Button
                        className="text-white font-bold lg:mt-8 md:mt-9 mt-4 mb-4"
                        color="success"
                        onClick={() => handleFinishClick(entry.id)}
                      >
                        Mark As Finish
                      </Button>
                    </div>
                  </Card>
                </div>
              ))
            : filteredEntries.map((entry) => (
                <div
                  className="mt-6 mb-4 flex justify-center gap-8 lg:flex-nowrap md:flex-nowrap flex-wrap p-4 bg-white rounded-xl"
                  key={entry.id}
                >
                  <Card className="bg-white p-4 w-full">
                    <h1 className="font-bold text-black mt-3 mb-4 text-2xl">
                      PLO ID: {entry.plan_order_id}
                    </h1>
                    <div className="flex justify-between gap-8 ">
                      <div>
                        <h1 className="font-semibold mb-2">Item Name</h1>
                        <h1 className="">{entry?.Item?.internal_item_name}</h1>
                      </div>
                      <div>
                        <h1 className="font-semibold mb-2">Process Name</h1>
                        <h1 className="">{entry?.Process?.process_name}</h1>
                      </div>
                      <div>
                        <h1 className="font-semibold mb-2">Qty</h1>
                        <h1 className="">{entry.qty}</h1>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white p-4 w-full">
                    <h1 className="font-bold text-black mt-3 mb-2 text-xl text-center">
                      Select State For Item
                    </h1>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="font-bold lg:mt-4 md:mt-9 mt-4 mb-4"
                          color="primary"
                        >
                          {selectedStates[entry.id]
                            ? qcStates.find(
                                (state) => state.id == selectedStates[entry.id]
                              )?.name
                            : "Press Here"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="QC States"
                        onAction={(key) => handleStateSelect(entry.id, key)}
                      >
                        {qcStates.map((state) => (
                          <DropdownItem key={state.id}>
                            {state.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Card>

                  <Card className="bg-white p-4 w-full">
                    <h1 className="font-bold text-black mt-3 mb-2 text-xl text-center">
                      Submit Item
                    </h1>
                    <Button
                      className="text-white font-bold lg:mt-4 md:mt-9 mt-4 mb-4"
                      color="success"
                      isDisabled={!selectedStates[entry.id]}
                      onClick={() => handleSubmit(entry.id)}
                    >
                      Submit
                    </Button>
                  </Card>
                </div>
              ))}
        </Card>
      </div>

      <ToastContainer />
    </>
  );
};

export default page;
