/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import NavbarStore from "../Navbar/page";
import { FooterWithLogo } from "../Footer/StoreAppFooter";
import {
  Card,
  CardBody,
  Autocomplete,
  AutocompleteItem,
  Button
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const [items, setItems] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [PendingItem, setPendingItem] = React.useState(null);
  const [isItemOnboarded, setIsItemOnboarded] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
  
    const fetchPendingItems = async () => {
      try {
        const response = await fetch(`${Domain}/inventoryOnboarding/pending-items`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        }else{
        setPendingItem(data.pendingItemsLength);
        setItems(data.pendingItems)
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    fetchPendingItems();
  }, []);

  const handleItemChange = async (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);
    setSelectedItem(dropdownSelectedItem);
    setIsItemOnboarded(false);
  };

  const handleOnboardClick = () => {
    if (selectedItem.type === "purchase") {
      router.push(`/StoreApp/Onboarding/PurchaseItemOnboarding?id=${selectedItem.id}`);
    } else if (selectedItem.type === "sell") {
      router.push(`/StoreApp/Onboarding/Step_2?id=${selectedItem.id}`);
    }
  };
  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black" >
        <Card className="bg-gray-900 p-2 mt-6 mb-6">
          <CardBody>
            <h1 className="font-bold text-white mt-3 mb-4 text-center text-2xl">
              Onboarding
            </h1>
            <span className="text-center text-white mt-3 mb-5">
              Please count and update initial inventory
            </span>
            <span className="text-white font-bold text-xl mt-6 mb-6 text-center">
                    Pending Items - {PendingItem}
            </span>
            <Autocomplete
                  label="Item Name"
                  placeholder="Select Item Name"
                  defaultItems={items}
                  onSelectionChange={handleItemChange}
                  className="mt-8 mb-8"
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Button color="success" className="font-bold text-white flex m-auto mt-4 mb-4 "  onClick={handleOnboardClick}
              isDisabled={!selectedItem || isItemOnboarded}>Onboard item</Button>
          </CardBody>
        </Card>
      </div>
      <ToastContainer />
      <FooterWithLogo />
    </>
  );
};

export default page;
