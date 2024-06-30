/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import NavbarAdmin from "../../adminNavbar/page";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
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
const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [items, setItems] = React.useState([]);
  const [factory, setFactory] = React.useState([]);
  const [selectedUOM, setSelectedUOM] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedFactory, setSelectedFactory] = React.useState(null);
  const [ploId, setPLOId] = React.useState(null);
  const [qty, setQty] = React.useState("");
  const [estimateDate, setEstimateDate] = React.useState("");
  const [addedItems, setAddedItems] = React.useState([]);
  const [isAddButtonDisabled, setAddButtonDisabled] = React.useState(false);
  const [itemPresence, setItemPresence] = React.useState([]);

  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
    const fetchItems = async () => {
      try {
        const response = await fetch(`${Domain}/items`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error);
        } else {
          const sellItems = data.filter((item) => item.type === "sell");

          setItems(sellItems);
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    const fetchFactories = async () => {
      try {
        const response = await fetch(`${Domain}/factories`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        } else {
        setFactory(data);
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };

    const fetchPlanOrders = async () => {
      try {
        const response = await fetch(`${Domain}/planOrder`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        }else {
        if (data.length === 0) {
          setPLOId(1);
        } else {
          const highestId = Math.max(...data.map((order) => order.id));
          // Set the PLO ID to the highest ID + 1
          setPLOId(highestId + 1);
        }
      }
      } catch (error) {
        console.error("Error fetching Plan Orders:", error);
      }
    };

    fetchPlanOrders();
    fetchItems();
    fetchFactories();
  }, []);

  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);

    setSelectedItem(dropdownSelectedItem);
    setSelectedUOM(dropdownSelectedItem?.uom);
  };

  const handlefactoryChange = (id) => {
    const dropdownSelectedItem = factory.find((factory) => factory.id == id);

    setSelectedFactory(dropdownSelectedItem);
  };

  const handleAddItem = async () => {
    const newItem = {
      id: selectedItem.id,
      qty: qty,
      estimated_production_date: estimateDate,
    };
    setAddedItems([...addedItems, newItem]);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${Domain}/planOrder/item-presence/${selectedItem.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if(data?.error){
        toast.error(data.error)
      }else {
      const filteredData = data.filter(
        (item) => item.ProcessState.name !== "not_picked"
      );
      const aggregatedData = filteredData.reduce((acc, item) => {
        const processName = item.Process.process_name;
        if (acc[processName]) {
          acc[processName].qty += parseFloat(item.qty);
        } else {
          acc[processName] = { ...item, qty: parseFloat(item.qty) };
        }
        return acc;
      }, {});

      setItemPresence(Object.values(aggregatedData));
      setAddButtonDisabled(true);
    }
    } catch (error) {
      console.error("Error fetching Item Presence:", error);
    }
  };

  const handleSubmitPLO = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/planOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          factory_id: selectedFactory.id,
          item_id: selectedItem.id,
          qty: qty,
          sale_order_id: null,
          estimated_production_date: estimateDate,
        }),
      });
      const data = await response.json();
      if(data?.error){
        toast.error(data.error)
      } else {
        toast.success("PLO submitted successfully");

        // Call the approval API
        try {
          const approvalResponse = await fetch(`${Domain}/planOrder/approval`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              id: data.id, // Assuming ploId is the PLO ID
              approved_by: localStorage.getItem("name"), // Assuming 'name' is the key used to store the name in localStorage
            }),
          });
          const approvalData = await approvalResponse.json();
          if (approvalData?.error) {
            toast.error(approvalData.error);
          } else {
            toast.success("PLO approved successfully");
            window.location.reload()
          }
        } catch (error) {
          toast.error("Error approving PLO");
        }
      }
    } catch (error) {
      toast.error("Error submitting PLO");
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black">
        <Card className="p-4 bg-gray-800">
          <h1 className="p-2 text-center text-white font-bold text-3xl mb-3">
            Add Planning Order
          </h1>
          <Card className="p-4 bg-gray-900 shadow-md shadow-gray-700">
            <CardBody>
              <div className="flex justify-center gap-5 lg:flex-nowrap flex-wrap">
                <Input label="Enter PLO ID" isDisabled value={ploId}></Input>
                <Autocomplete
                  label="Item Name"
                  placeholder="Select Item Name"
                  defaultItems={items}
                  onSelectionChange={handleItemChange}
                  isDisabled={isAddButtonDisabled}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.internal_item_name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Autocomplete
                  label="Factory id "
                  placeholder="Select Factory name"
                  defaultItems={factory}
                  onSelectionChange={handlefactoryChange}
                  isDisabled={isAddButtonDisabled}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div className="flex lg:p-5 p-0 mt-6 justify-center gap-5 lg:flex-nowrap flex-wrap">
                <Input
                  label="Enter Qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  isDisabled={isAddButtonDisabled}
                ></Input>
                <Input
                  label="Enter Date"
                  type="date"
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
                  isDisabled={isAddButtonDisabled}
                ></Input>
                <Input label="Enter UoM" value={selectedUOM} isDisabled></Input>
              </div>
              <div className="flex justify-center gap-5 p-4">
                <Button
                  color="primary"
                  className="w-full font-bold"
                  onClick={handleAddItem}
                  isDisabled={isAddButtonDisabled}
                >
                  Add items
                </Button>
                <Button
                  color="success"
                  className="w-full text-white font-bold"
                  isDisabled={!isAddButtonDisabled}
                  onClick={handleSubmitPLO}
                >
                  Submit PLO
                </Button>
              </div>
            </CardBody>
          </Card>
          {addedItems.length === 0 ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg mt-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <p className="text-lg font-bold">No Items added</p>
            </div>
          ) : (
            <Table
              aria-label="Example static collection table"
              className="mt-5 mb-6"
            >
              <TableHeader>
                <TableColumn>Steps</TableColumn>
                <TableColumn>Process Name</TableColumn>
                <TableColumn>Process State</TableColumn>
                <TableColumn>Qty</TableColumn>
              </TableHeader>
              <TableBody>
                {itemPresence.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.ProcessStep ? item.ProcessStep.sequence : ""}
                    </TableCell>
                    <TableCell>{item?.Process?.process_name}</TableCell>
                    <TableCell>{item?.ProcessState?.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
      <ToastContainer />
    </>
  );
};

export default page;
