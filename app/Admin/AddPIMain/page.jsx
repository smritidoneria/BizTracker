/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import NavbarAdmin from "../adminNavbar/page";
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
  const [supplier, setSupplier] = React.useState([]);
  const [selectedUOM, setSelectedUOM] = React.useState(null);
  const [PINumber, setPINumber] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedSupplier, setSelectedSupplier] = React.useState(null);
  const [qty, setQty] = React.useState("");
  const [estimateDate, setEstimateDate] = React.useState("");
  const [tableitems, setTableItems] = React.useState([]);
  const [itemAdded, setItemAdded] = React.useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchItems = async () => {
      try {
        const response = await fetch(`${Domain}/items`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        }else{
        const purchaseItems = data.filter(item => item.type === "purchase");
        setItems(purchaseItems);
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`${Domain}/suppliers`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        }else{
        setSupplier(data)
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    fetchItems();
    fetchSupplier();
  }, []);

  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);
    setSelectedItem(dropdownSelectedItem?dropdownSelectedItem:null);
    setSelectedUOM(dropdownSelectedItem?dropdownSelectedItem.uom:null);
  };

  const handleSupplierChange = (id) => {
    const Supplier = supplier.find((supplier) => supplier.id == id);
    setSelectedSupplier(Supplier);

  };
  const handleAddItem = () => {
    const newItem = {
      id: selectedItem?selectedItem.id : null,
      name: selectedItem?selectedItem.internal_item_name : null,
      qty: parseInt(qty),// Format rate to 3 decimal places
      date: estimateDate,
    };
    setTableItems([...tableitems, newItem]);
    setItemAdded(true);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = tableitems.filter((item) => item.id !== itemId);
    setTableItems(updatedItems);
  };



  const handleSubmitSPI = async () => {
    let token; let user;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
      user =localStorage.getItem("name");
    }
    const requestBody = {
        purchases: tableitems.map((item) => ({
        item_id: item.id,
        suggested_supplier: selectedSupplier?selectedSupplier.id: null,
        qty: parseInt(item.qty),
        expected_order_date: item.date,
        created_by: user,
        last_updated_by: user,
      })),
    };
  
    try {
      const response = await fetch(`${Domain}/purchaseIndent`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
        const data = await response.json();
      if (data?.error) {
       toast.error(data.error, "Failed to Submit PI")
      } else {
      setTableItems([]);
      toast.success("PI submitted successfully!") 
      setTimeout(() => {
        window.location.reload()
      }, 800);
      }
    } catch (error) {
      console.error("Error submitting SO:", error);
      // Show error message to the user
      toast.error("Failed to submit PI. Please try again.");
    }
  };
  
  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black lg:h-[40vw] h-auto  " >
        <Card className="p-4 bg-gray-800 mt-6">
          <h1
            className="p-2 text-center text-white font-bold text-3xl mb-3"
          >
            ADD PI
          </h1>
          <Card className="p-4 bg-gray-900 shadow-md shadow-gray-700">
            <CardBody>
              <div className="flex justify-center gap-5 lg:flex-nowrap flex-wrap">
                <div className="flex justify-between gap-5 lg:flex-nowrap md:flex-wrap flex-wrap w-full">
          <Autocomplete
                  label="Suggested Supplier"
                  placeholder="Suggested Supplier"
                  defaultItems={supplier?supplier:null}
                  onSelectionChange={handleSupplierChange}
                  isDisabled={itemAdded} 
                >
                  {(supplier) => (
                    <AutocompleteItem key={supplier.id}>
                      {supplier.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
          <Autocomplete
                  label="Item Name"
                  placeholder="Select Item Name"
                  defaultItems={items}
                  onSelectionChange={handleItemChange}
                  isDisabled={itemAdded} 
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.internal_item_name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Input
                  label="Enter Qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  isDisabled={itemAdded} 
                   
                ></Input>
                <Input
                  label="Enter Dispatch Date"
                  type="date"
                  className=" w-full"
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
                  isDisabled={itemAdded} 
                ></Input>
                </div>
              </div>
            {selectedItem && ( <h1 className="font-bold text-white text-center text-lg mt-4 mb-1">Selected Item Uom : {selectedUOM}</h1>)} 
              <div className="flex justify-center gap-5 p-4 mt-6">
                <Button
                  color="primary"
                  className="w-full font-bold"
                  onClick={handleAddItem}
                  isDisabled={itemAdded || !selectedItem || !qty || !estimateDate} 
                >
                  Add items
                </Button>
                <Button
                  color="success"
                  className="w-full text-white font-bold"
                  onClick={handleSubmitSPI}
                  isDisabled={tableitems.length <= 0}
                >
                  Submit PI
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="p-3 mt-3">
            {tableitems.length === 0 ? (
              <div className="flex justify-center items-center h-32 bg-white rounded-lg">
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
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>Item Name</TableColumn>
                  <TableColumn>Qty</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>DELETE</TableColumn>
                </TableHeader>
                <TableBody>
                  {tableitems?tableitems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-red-600 cursor-pointer transition ease-in-out hover:text-red-200"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
      <ToastContainer />
    </>
  );
};

export default page;
