/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";
import { Domain } from "@/Domain";
import {
  Card,
  CardBody,
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
import { ToastContainer,toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const [item, setItem] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [locations, setLocations] = React.useState([]);
  const [showInputs, setShowInputs] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);
  const router = useRouter()
  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }

    let params;
    if (typeof window !== "undefined") {
      params = new URLSearchParams(window.location.search);
    }
    const id = params?.get("id");

    const fetchPendingItems = async () => {
      try {
        const response = await fetch(
          `${Domain}/inventoryOnboarding/pending-items`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error);
        } else {
          const filteredItem = data.pendingItems?.find((item) => item.id == id);
          if (filteredItem) {
            setItem(filteredItem);
            setInputValue(filteredItem.name);
          }
        }
      } catch (error) {
        console.error("Error fetching pending items:", error);
      }
    };

    const fetchLocations = async () => {
      const FactoryId = localStorage.getItem("factoryId");
      try {
        const response = await fetch(`${Domain}/location`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error);
        } else {
          const finishStockLocations = data.filter(
            (location) =>
              location.type === "PUTAWAY" && location.factory_id == FactoryId
          );
          setLocations(finishStockLocations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    if (token && id) {
      fetchLocations();
      fetchPendingItems();
    }
  }, []);

  const handleLocationChange = async (id) => {
    if (locations) {
      const dropdownSelectedLocation = locations.find((location) => location.id == id);
      setSelectedLocation(dropdownSelectedLocation);
    }
  };

  const handleAddItemClick = () => {
    if (selectedLocation && qty) {
      setTableData([{ location: selectedLocation, qty }]);
      setShowInputs(false);
    }
  };

  const handleQtyChange = (e) => {
    const newQty = e.target.value;
    setQty(newQty);
    if (selectedLocation) {
      setTableData([{ location: selectedLocation, qty: newQty }]);
    }
  };

  const handleFinalSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!item || !tableData.length) {
      toast.error("Please add an item and quantity before submitting.");
      return;
    }

    const payload = {
      item_id: item.id,
      quantitiesAndLocations: tableData.map((data) => ({
        qty: parseInt(data.qty),
        location_id: data.location.id,
      })),
    };

    try {
      const response = await fetch(`${Domain}/inventoryOnboarding/onboard-purchase-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.error) {
        toast.error(data.error || "Something went wrong!");
        } else {
        toast.success("Item onboarded successfully!");
            router.push("/StoreApp/Onboarding")
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    }
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2 mt-6 mb-6">
          <CardBody>
            <h1 className="font-bold text-white mt-3 mb-4 text-center text-2xl">
              Onboarding
            </h1>
            {item ? (
              <>
                <div className="mt-4 mb-4">
                  <h1 className="text-center font-bold text-white text-xl">
                    Item Name
                  </h1>
                  <h1 className="text-center font-bold text-green-400 text-xl mt-3 mb-3">
                    {inputValue}
                  </h1>
                </div>
                {showInputs ? (
                  <>
                    <Autocomplete
                      label="Location Name"
                      placeholder="Location Name"
                      defaultItems={locations}
                      onSelectionChange={handleLocationChange}
                      className="mt-4 mb-4"
                    >
                      {(location) => (
                        <AutocompleteItem key={location.id}>
                          {location.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    <Input
                      label="Enter Qty"
                      value={qty}
                      onChange={(e) => handleQtyChange(e)}
                      className="mt-4 mb-4"
                      fullWidth
                    />
                    <Button
                      color="success"
                      className="font-bold text-white flex m-auto"
                      onClick={handleAddItemClick}
                      isDisabled={!selectedLocation || !qty}
                    >
                      Add Item
                    </Button>
                  </>
                ) : (
                  <>
                    <Table aria-label="Selected Location and Quantity">
                      <TableHeader>
                        <TableColumn>Location Name</TableColumn>
                        <TableColumn>Quantity</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.location?.name}</TableCell>
                            <TableCell>
                              <Input
                                value={data.qty}
                                onChange={handleQtyChange}
                                fullWidth
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button
                      color="success"
                      className="font-bold text-white flex m-auto mt-4"
                      onClick={handleFinalSubmit}
                    >
                      Submit
                    </Button>
                  </>
                )}
              </>
            ) : (
              <p className="text-white">No item found with the given ID</p>
            )}
          </CardBody>
        </Card>
      </div>
      <FooterWithLogo />
      <ToastContainer />
    </>
  );
};

export default page;
