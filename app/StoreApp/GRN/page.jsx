/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NavbarStore from "../Navbar/page";
import { FooterWithLogo } from "../Footer/StoreAppFooter";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [selectedFactories, setselectedFactories] = React.useState(null);
  const [Factories, setFactories] = React.useState([]);
  const [suppliers, setsuppliers] = React.useState([]);
  const [PurchaseOrders, setPurchaseOrders] = React.useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = React.useState(
    []
  );
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [selectedsupplier, setSelectedsupplier] = React.useState(null);
  const router = useRouter();
  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
    const fetchsuppliers = async () => {
      try {
        const response = await fetch(`${Domain}/suppliers`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setsuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
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
        setFactories(data);
      } catch (error) {
        console.error("Error fetching Transporters:", error);
      }
    };
    const fetchItems = async () => {
      try {
        const response = await fetch(`${Domain}/items`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error){
          toast.error(data.error)
          return ;
        }
        const purchaseItems = data.filter((item) => item.type === "purchase");
        setItems(purchaseItems);
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    fetchItems();
    fetchFactories();
    fetchsuppliers();
  }, []);
  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }

    const fetchPOs = async () => {
      try {
        const response = await fetch(
          `${Domain}/po/grn?factory_id=${selectedFactories.id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        setPurchaseOrders(data);
        setFilteredPurchaseOrders(data);
      } catch (error) {
        console.error("Error fetching POs:", error);
      }
    };

    if (selectedFactories) {
      fetchPOs();
    }
  }, [selectedFactories]);

  // React.useEffect(() => {
  //   if (selectedsupplier) {
  //     const filteredPOs = PurchaseOrders.filter(
  //       (po) => po.Supplier.name === selectedsupplier.name
  //     );
  //     setFilteredPurchaseOrders(filteredPOs);
  //   } else if  (selectedItem) {
  //     const filteredItemPOs = PurchaseOrders.filter((po) =>
  //       po.PurchaseOrderItems.some(
  //         (item) => item.Item.internal_item_name === selectedItem.internal_item_name
  //       )
  //     );
  //     setFilteredPurchaseOrders(filteredItemPOs);
  //   }
  //     else {
  //     setFilteredPurchaseOrders(PurchaseOrders);
  //   }
  // }, [selectedsupplier, PurchaseOrders, selectedItem]);
  React.useEffect(() => {
    let filteredPOs = PurchaseOrders;

    if (selectedsupplier) {
      filteredPOs = filteredPOs.filter(
        (po) => po.Supplier.name === selectedsupplier.name
      );
    }

    if (selectedItem) {
      filteredPOs = filteredPOs.filter((po) =>
        po.PurchaseOrderItems.some(
          (item) => item.Item.internal_item_name === selectedItem.internal_item_name
        )
      );
    }

    setFilteredPurchaseOrders(filteredPOs);
  }, [selectedsupplier, PurchaseOrders, selectedItem]);

  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);
    
    setSelectedItem(dropdownSelectedItem);
  };

  const handleFactoriesChange = (id) => {
    const Factory = Factories.find((factories) => factories.id == id);

    setselectedFactories(Factory);
  };

  const handlesupplierChange = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id == id);
    setSelectedsupplier(supplier);
  };
  const handleTabClick = (poId) => {
    setShowAnimation(true);
    router.push(`/StoreApp/GRN/Step_2?po_id=${poId}`);
  };
  
  const handlerefresh = () => {
    setFilteredPurchaseOrders(PurchaseOrders);
    setSelectedItem(null);
  };

  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2">
          <CardBody>
          <div className="flex justify-center  items-center gap-4">
            <h1 className="font-bold text-white text-center text-3xl mt-4 mb-4">
              GRN
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

            <div className="p-4 flex justify-center items-center">
              <Autocomplete
                label="Select Factories"
                className="w-full"
                value={selectedFactories ? selectedFactories.name : ""}
                onSelectionChange={handleFactoriesChange}
                endContent={
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3488/3488773.png"
                    alt=""
                    className="w-6 h-6"
                  />
                }
              >
                {Factories.map((factory) => (
                  <AutocompleteItem key={factory.id}>
                    {factory.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="p-4 flex justify-center items-center">
              <Autocomplete
                label="Select Supplier"
                className="w-full"
                value={selectedsupplier ? selectedsupplier.name : ""}
                onSelectionChange={handlesupplierChange}
                endContent={
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2982/2982602.png"
                    alt=""
                    className="w-6 h-6"
                  />
                }
              >
                {suppliers && suppliers.map((supplier) => (
                  <AutocompleteItem key={supplier.id}>
                    {supplier.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            {selectedFactories && (
            <div className="p-4 flex justify-center items-center">
              <Autocomplete
                label="Item Name"
                placeholder="Select Item Name"
                defaultItems={items}
                onSelectionChange={handleItemChange}
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                    />
                  </svg>
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>
                    {item.internal_item_name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            )}
            <hr className="border-t-1 border-gray-500 mt-6 mb-6" />
            {selectedFactories ? (
              <>
                {filteredPurchaseOrders.map((po) => (
                  <Card key={po.id} className="p-2 bg-white mt-4 mb-4">
                    <CardBody
                      className="p-3"
                      onClick={() => handleTabClick(po.id)}
                    >
                      <div className="p-2">
                        <h1 className="font-bold mt-4 mb-4">
                          PO ID - {po.purchase_order_number}
                        </h1>
                        <h1 className="font-bold mt-4 mb-4">
                          Supplier Name - {po.Supplier.name}
                        </h1>
                        <hr className="border-t-1 border-gray-500 mt-6 mb-6" />
                        {po.PurchaseOrderItems.slice(0, 2).map((item) => (
                          <div key={item.id}>
                            <h2 className="font-semibold mt-4 mb-4 flex gap-6">
                              <p>{item.Item.internal_item_name}</p>
                              <p>
                                Remaining Qty :
                                {`${Math.max(
                                  0,
                                  item.qty - item.received_qty
                                )}/${item.qty}`}
                              </p>
                            </h2>
                            <h2 className="font-semibold mb-2">
                              Date -
                              {item.estimate_date_of_arrival.substring(0, 10)}
                            </h2>
                            <hr className="border-t-1 border-gray-500 mt-6 mb-6" />
                          </div>
                        ))}
                        {po.PurchaseOrderItems.length > 2 && (
                          <h3 className="flex justify-end items-end font-bold text-green-600">
                            +{po.PurchaseOrderItems.length - 2} More
                          </h3>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </>
            ) : (
              <div className="flex justify-center items-center gap-2 mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white font-bold"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21"
                  />
                </svg>
                <p className="text-white text-center">
                  Please select a factory
                </p>
              </div>
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
