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
import { Accordion, AccordionItem } from "@nextui-org/accordion";
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
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [customers, setCustomers] = React.useState([]);
  const [partyDetailsDropdown, setPartyDetailsDropdown] = React.useState([]);
  const [transporters, setTransporters] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [factories, setFactories] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedTransporters, setSelectedTransporters] = React.useState(null);
  const [selectedUOM, setSelectedUOM] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedFactory, setSelectedFactory] = React.useState(null);
  const [customerOrderDate, setCustomerOrderDate] = React.useState(
    getCurrentDate()
  );
  const [soNumber, setSoNumber] = React.useState("");
  const [customerPoNumber, setCustomerPoNumber] = React.useState("");
  const [otherRefrence, setOtherRefrence] = React.useState("");
  const [rate, setRate] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [partyDetails, setPartyDetails] = React.useState("");
  const [estimateDate, setEstimateDate] = React.useState("");
  const [tableitems, setTableItems] = React.useState([]);
  const [mandatoryFieldsFilled, setMandatoryFieldsFilled] = React.useState(
    false
  );
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [fieldsDisabled, setFieldsDisabled] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [itemsFieldsDisabled, setItemsFieldsDisabled] = React.useState(false);
  const [selectedItemRate, setSelectedItemRate] = React.useState("");
  const [selectedPartyDetails, setSelectedPartyDetails] = React.useState(null);
  const [firstItemTaxDetails, setFirstItemTaxDetails] = React.useState({});
  const [decimalPlaces, setDecimalPlaces] = React.useState(2);
  const [showValue, setShowValue] = React.useState(false);
  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${Domain}/customers`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        } else {
        setCustomers(data);
        setPartyDetailsDropdown(data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
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
        if (data?.error){
          toast.error(data.error)
        } else {
        setFactories(data);
        }
      } catch (error) {
        console.error("Error fetching Transporters:", error);
      }
    };

    const fetchTransporter = async () => {
      try {
        const response = await fetch(`${Domain}/transporter`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if(data?.error){
          toast.error(data.error)
        } else {
        setTransporters(data);
        }
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
        if(data?.error) {
            toast.error(data.error)
        }else{
        const sellItems = data.filter((item) => item.type === "sell");
        setItems(sellItems);
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    fetchItems();
    fetchTransporter();
    fetchCustomers();
    fetchFactories();
  }, []);

  React.useEffect(() => {
    const totalAmount = calculateTotalAmount();
    setTotalAmount(totalAmount);
  }, [tableitems]);

  const handleCustomerChange = (id) => {
    const customer = customers.find((customer) => customer.id == id);

    setSelectedCustomer(customer);
    setPartyDetails(customer ? customer.name : null);
  };

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const handlePartyDetailsChange = (id) => {
    const partyDetail = partyDetailsDropdown.find(
      (partyName) => partyName.id == id
    );
    setSelectedPartyDetails(partyDetail);

  };

  const handleTransporterChange = (id) => {
    const Transporter = transporters.find(
      (transporter) => transporter.id == id
    );
 
    setSelectedTransporters(Transporter);
  };
  const handleFactoryChange = (id) => {
    const Factory = factories.find((factory) => factory.id == id);
   
    setSelectedFactory(Factory);
  };

  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);
 
    setSelectedItem(dropdownSelectedItem);
    setSelectedUOM(dropdownSelectedItem ? dropdownSelectedItem.uom : null);

    setSelectedItemRate(
      dropdownSelectedItem ? dropdownSelectedItem.rate : null
    );
  };

  const handleAddItem = () => {
    if (!mandatoryFieldsFilled) {
      if (
        soNumber === "" ||
        customerOrderDate === "" ||
        selectedCustomer === null ||
        selectedTransporters === null ||
        selectedFactory === null ||
        customerPoNumber === ""
      ) {
    
        toast.error(
          "Please fill all mandatory fields before adding the first item."
        );
        return;
      }
      setMandatoryFieldsFilled(true);
      setFieldsDisabled(true);
    }

    if (selectedItemRate === "" || qty === "" || estimateDate === "") {
      toast.error(
        "Please fill all fields (Rate, Qty, Estimated Date) before adding an item."
      );
      return;
    }

    // Allow adding the first item without any validations
    if (tableitems.length === 0) {
      const amount = (qty * selectedItemRate).toFixed(2);
      const newItem = {
        id: selectedItem.id,
        name: selectedItem.internal_item_name,
        qty: qty,
        uom: selectedItem.uom,
        rate: parseFloat(selectedItemRate).toFixed(2),
        amount: amount,
        date: estimateDate,
      };
      setTableItems([...tableitems, newItem]);

      // Set the first item's tax details as the main tax details
      const taxDetails = {
        [selectedItem?.taxOne?.name]: selectedItem?.taxOne?.percentage,
        [selectedItem?.taxTwo?.name]: selectedItem?.taxTwo?.percentage,
      };
      setFirstItemTaxDetails(taxDetails);

      setQty("");
      setRate("");
      setEstimateDate("");
      return;
    }

    // Check if the new item's tax details match the first item's tax details
    const newItemTaxDetails = {
      [selectedItem?.taxOne?.name]: selectedItem?.taxOne?.percentage,
      [selectedItem?.taxTwo?.name]: selectedItem?.taxTwo?.percentage,
    };

    if (
      JSON.stringify(newItemTaxDetails) !== JSON.stringify(firstItemTaxDetails)
    ) {
      toast.error("Tax details of the new item do not match the first item.");
      return;
    }

    const amount = (qty * selectedItemRate).toFixed(2);
    const newItem = {
      id: selectedItem.id,
      name: selectedItem.internal_item_name,
      qty: qty,
      uom: selectedItem.uom,
      rate: parseFloat(selectedItemRate).toFixed(2),
      amount: amount,
      date: estimateDate,
    };
    setTableItems([...tableitems, newItem]);
    setQty("");
    setRate("");
    setEstimateDate("");
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = tableitems.filter((item) => item.id !== itemId);
    setTableItems(updatedItems);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    tableitems.forEach((item) => {
      total += parseFloat(item.amount);
    });
    return total.toFixed(2);
  };

  const calculateTotalAmountWithoutGST = () => {
    let totalAmountBeforeGST = parseFloat(calculateTotalAmount());

    return {
      totalAmountBeforeGST: totalAmountBeforeGST.toFixed(2),
    };
  };

  const calculateTotalAmountWithGST = () => {
    let totalAmountBeforeGST = parseFloat(calculateTotalAmount());
    let totalGST = 0;
    for (const tax in firstItemTaxDetails) {
      totalGST += (totalAmountBeforeGST * firstItemTaxDetails[tax]) / 100;
    }

    return {
      totalAmountBeforeGST: totalAmountBeforeGST.toFixed(decimalPlaces),
      totalGST: totalGST.toFixed(2),
    };
  };

  const handleRoundOffButtonClick = () => {
    setDecimalPlaces(0);
    setShowValue(true);
  };
  const totalAmounts = calculateTotalAmountWithoutGST();
  const totalAmountWithGst = calculateTotalAmountWithGST();

  function formatDate(dateString) {
    return dateString.replace(/-/g, "");
  }

  function splitMultiLineString(multiLineString) {
    return multiLineString.split("\n");
  }

  const calculateTaxAmounts = () => {
    const { totalAmountBeforeGST } = calculateTotalAmountWithGST();
    const taxAmounts = {};

    for (const tax in firstItemTaxDetails) {
      const taxRate = firstItemTaxDetails[tax];
      const taxAmount = (totalAmountBeforeGST * taxRate) / 100;
      taxAmounts[tax] = parseFloat(taxAmount.toFixed(2));
    }

    return taxAmounts;
  };
  
  const taxAmounts = calculateTaxAmounts();

  const handleSubmitSO = async () => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }

    const requestBody = {
      customer_id: selectedCustomer.id,
      transporter_id: selectedTransporters.id,
      factory_id: selectedFactory.id,
      sale_order_id: soNumber,
      customer_order_date: customerOrderDate,
      tally_json: {
        ENVELOPE: {
          HEADER: {
            TALLYREQUEST: "Import Data",
          },
          BODY: {
            IMPORTDATA: {
              REQUESTDESC: {
                REPORTNAME: "All Masters",
                STATICVARIABLES: {
                  SVCURRENTCOMPANY: "VAISHNAV FASTNERS",
                },
              },
              REQUESTDATA: {
                TALLYMESSAGE: {
                  VOUCHER: {
                    DATE: formatDate(customerOrderDate),
                    PARTYNAME: selectedPartyDetails
                      ? selectedPartyDetails.name
                      : "",
                    VOUCHERTYPENAME: "Sales Order",
                    VOUCHERNUMBER: soNumber,
                    REFERENCE: customerPoNumber,
                    PARTYLEDGERNAME: selectedPartyDetails
                      ? selectedPartyDetails.name
                      : "",
                    PERSISTEDVIEW: "Invoice Voucher View",
                    "ADDRESS.LIST": {
                      ADDRESS: splitMultiLineString(selectedCustomer.address),
                      _TYPE: "String",
                    },
                    CONSIGNEEMAILINGNAME: selectedPartyDetails
                      ? selectedPartyDetails.name
                      : "",
                    "BASICBUYERADDRESS.LIST": {
                      BASICBUYERADDRESS: splitMultiLineString(
                        selectedCustomer.address
                      ),
                      _TYPE: "String",
                    },
                    BASICSHIPPEDBY: selectedTransporters.name,
                    BASICDUEDATEOFPYMT: selectedCustomer.payment_terms,
                    BASICORDERREF: otherRefrence,
                    BASICFINALDESTINATION: selectedCustomer.city,
                    PARTYGSTIN: selectedCustomer.gstin,
                    CONSIGNEEGSTIN: selectedCustomer.gstin,
                    CONSIGNEESTATENAME: selectedCustomer.state,
                    SHIPPEDTOSTATE: selectedCustomer.state,
                    CONSIGNEECOUNTRYNAME: selectedCustomer.country,
                    "LEDGERENTRIES.LIST": [
                      {
                        LEDGERNAME: selectedCustomer.name,
                        ISDEEMEDPOSITIVE: "Yes",
                        ISLASTDEEMEDPOSITIVE: "Yes",
                        AMOUNT: totalAmounts.totalAmountBeforeGST,
                      },
                      {
                        "BASICRATEOFINVOICETAX.LIST": {
                          BASICRATEOFINVOICETAX: selectedItem.taxOne.percentage,
                          _TYPE: "Number",
                        },
                        ROUNDTYPE: "",
                        LEDGERNAME: `${selectedItem.taxOne.name} @ ${selectedItem.taxOne.percentage}%`,
                        ISDEEMEDPOSITIVE: "No",
                        AMOUNT: `${
                          taxAmounts[Object.keys(firstItemTaxDetails)[0]]
                        }`,
                      },
                      {
                        "BASICRATEOFINVOICETAX.LIST": {
                          BASICRATEOFINVOICETAX: selectedItem.taxTwo.percentage,
                          _TYPE: "Number",
                        },
                        ROUNDTYPE: "",
                        LEDGERNAME: `${selectedItem.taxTwo.name} @ ${selectedItem.taxTwo.percentage}%`,
                        ISDEEMEDPOSITIVE: "No",
                        AMOUNT: `${
                          taxAmounts[Object.keys(firstItemTaxDetails)[1]]
                        }`,
                      },
                    ],
                    "ALLINVENTORYENTRIES.LIST": tableitems.map((item) => ({
                      STOCKITEMNAME: item.name,
                      ISDEEMEDPOSITIVE: "No",
                      RATE: `${item.rate}/${item.uom}`,
                      AMOUNT: item.amount,
                      ACTUALQTY: item.qty,
                      "BATCHALLOCATIONS.LIST": {
                        GODOWNNAME: `${selectedCustomer.godown_name}`,
                        BATCHNAME: "Primary Batch",
                        AMOUNT: item.amount,
                        ACTUALQTY: item.qty,
                        BILLEDQTY: item.qty,
                        ORDERDUEDATE: formatDate(item.date),
                      },
                    })),
                    _VCHTYPE: "Sales Order",
                    _ACTION: "Create",
                  },
                  "_xmlns:UDF": "TallyUDF",
                },
              },
            },
          },
        },
      },
      items: tableitems?tableitems.map((item) => ({
        item_id: item.id,
        qty: parseInt(item.qty),
        rate: parseInt(item.rate),
        estimate_date_of_dispatch: item.date,
      })) : null,
    };

    try {
      const response = await fetch(`${Domain}/orders`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
        throw new Error("Failed to submit SO");
      } else {
        toast.success("So Submitted SuccessFully");

        setTableItems([]);
        setSelectedCustomer(null);
        setSelectedTransporters(null);
        setSelectedFactory(null);
        setCustomerOrderDate("");
        setSoNumber("");
        setCustomerPoNumber("");
        setOtherRefrence("");
        setRate("");
        setQty("");
        setEstimateDate("");
        setMandatoryFieldsFilled(false);
        setFieldsDisabled(false);
        setItemsFieldsDisabled(false);
        setTotalAmount(0);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting SO:", error);
      // Show error message to the user
      alert("Failed to submit SO. Please try again.");
    }
  };

  const taxDetails = selectedItem
    ? `${selectedItem?.taxOne.name} (${selectedItem?.taxOne?.percentage}%), ${selectedItem?.taxTwo?.name} (${selectedItem?.taxTwo?.percentage}%)`
    : "";

  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black">
        <Card className="p-4 bg-gray-800">
          <h1
            className="p-2 text-center text-white font-bold text-3xl mb-3"
            onClick={() => {
              console.log(
                "Tax One Amount:",
                taxAmounts[Object.keys(firstItemTaxDetails)[0]]
              );
              console.log(
                "Tax Two Amount:",
                taxAmounts[Object.keys(firstItemTaxDetails)[1]]
              );
            }}
          >
            ADD SO
          </h1>
          {selectedCustomer && (
            <Card className="p-4 bg-gray-900 shadow-md shadow-gray-700 mb-5">
              <h1 className="p-2 text-center text-white font-bold text-3xl mb-3">
                Customer Details
              </h1>
              <Accordion className="p-3">
                <AccordionItem
                  key="1"
                  aria-label="Accordion 1"
                  title="Details"
                  className="bg-white font-bold p-3 rounded-xl"
                >
                  <div className="flex justify-center gap-5 lg:flex-nowrap flex-wrap overflow-x-hidden overflow-y-hidden">
                    <div className="flex justify-between gap-5 w-full">
                      <Input
                        className="w-full"
                        label=" Customer Email ID"
                        value={
                          selectedCustomer ? selectedCustomer.email_id : null
                        }
                        disabled
                      ></Input>
                      <Input
                        className="w-full"
                        label="Billing Address"
                        value={
                          selectedCustomer ? selectedCustomer.address : null
                        }
                        disabled
                      ></Input>
                      <Input
                        className="w-full"
                        label="Godown Name "
                        value={
                          selectedCustomer ? selectedCustomer.godown_name : null
                        }
                        disabled
                      ></Input>
                    </div>{" "}
                    <Autocomplete
                      label="Shipping Address"
                      className="w-full"
                      defaultSelectedKey={`${
                        selectedCustomer ? selectedCustomer.address : null
                      }`}
                      onSelectionChange={handleAddressChange}
                    >
                      {[
                        {
                          label: `${
                            selectedCustomer ? selectedCustomer.address : null
                          }`,

                          value: selectedCustomer
                            ? selectedCustomer.address
                            : null,
                        },
                        {
                          label: `${
                            selectedCustomer
                              ? selectedCustomer.alternate_address_1
                              : null
                          }`,
                          value: selectedCustomer
                            ? selectedCustomer.alternate_address_1
                            : null,
                        },
                        {
                          label: `${
                            selectedCustomer
                              ? selectedCustomer.alternate_address_2
                              : null
                          }`,

                          value: selectedCustomer
                            ? selectedCustomer.alternate_address_2
                            : null,
                        },
                      ].map((option) => (
                        <AutocompleteItem key={option.label}>
                          {option.value}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>

                  <div className="flex justify-center mt-6 gap-5 lg:flex-nowrap flex-wrap">
                    <Input
                      label="State"
                      value={selectedCustomer ? selectedCustomer.state : null}
                      disabled
                    ></Input>
                    <Input
                      label="Country"
                      value={selectedCustomer ? selectedCustomer.country : null}
                      disabled
                    ></Input>
                    <Input
                      label="GSTIN"
                      value={selectedCustomer ? selectedCustomer.gstin : null}
                      disabled
                    ></Input>
                    <Input
                      label="Terms Of Payment"
                      value={
                        selectedCustomer ? selectedCustomer.payment_terms : null
                      }
                      disabled
                    ></Input>
                    <Input
                      label="Destination"
                      value={selectedCustomer ? selectedCustomer.city : null}
                      disabled
                    ></Input>
                    <Autocomplete
                      label="Party Details"
                      defaultSelectedKey={`${selectedCustomer.name}`}
                      onSelectionChange={handlePartyDetailsChange}
                    >
                      {partyDetailsDropdown?partyDetailsDropdown.map((Details) => (
                        <AutocompleteItem key={Details.id}>
                          {Details.name}
                        </AutocompleteItem>
                      )) : null}
                    </Autocomplete>
                  </div>
                </AccordionItem>
              </Accordion>
            </Card>
          )}

          <Card className="p-4 bg-gray-900 shadow-md shadow-gray-700">
            <h1 className="p-2 text-center text-white font-bold text-3xl mb-3">
              SO Details
            </h1>
            <CardBody>
              <div className="flex justify-center gap-5 lg:flex-nowrap flex-wrap">
                <div className="flex justify-between gap-5 w-full">
                  <Input
                    className="w-full"
                    value={soNumber}
                    onChange={(e) => setSoNumber(e.target.value)}
                    label="Tally So Number"
                    isDisabled={fieldsDisabled}
                  ></Input>
                  <Input
                    label="Cust. Order Date"
                    type="date"
                    value={customerOrderDate}
                    onChange={(e) => setCustomerOrderDate(e.target.value)}
                    isDisabled={fieldsDisabled}
                  ></Input>
                </div>
                <div className="flex justify-between gap-5 w-full">
                  <Autocomplete
                    label="Customer"
                    className="w-full"
                    value={customers}
                    onSelectionChange={handleCustomerChange}
                    isDisabled={fieldsDisabled}
                  >
                    {customers
                      ? customers.map((customer) => (
                          <AutocompleteItem key={customer.id}>
                            {customer.name}
                          </AutocompleteItem>
                        ))
                      : null}
                  </Autocomplete>
                  <Autocomplete
                    label="Select Transporter"
                    className="w-full"
                    value={
                      selectedTransporters ? selectedTransporters.name : ""
                    }
                    onSelectionChange={handleTransporterChange}
                    isDisabled={fieldsDisabled}
                  >
                    {transporters
                      ? transporters.map((transporter) => (
                          <AutocompleteItem key={transporter.id}>
                            {transporter.name}
                          </AutocompleteItem>
                        ))
                      : null}
                  </Autocomplete>
                </div>
              </div>

              <div className="flex justify-center mt-6 gap-5 lg:flex-nowrap flex-wrap">
                <Autocomplete
                  label="Select Factory"
                  className="w-full"
                  value={selectedFactory ? selectedFactory.name : ""}
                  onSelectionChange={handleFactoryChange}
                  isDisabled={fieldsDisabled}
                >
                  {factories
                    ? factories.map((factory) => (
                        <AutocompleteItem key={factory.id}>
                          {factory.name}
                        </AutocompleteItem>
                      ))
                    : null}
                </Autocomplete>
                <Input
                  label="Cust. PO Number"
                  value={customerPoNumber}
                  onChange={(e) => setCustomerPoNumber(e.target.value)}
                  isDisabled={fieldsDisabled}
                ></Input>
                <Input
                  label="Enter Any Other Refrence"
                  value={otherRefrence}
                  onChange={(e) => setOtherRefrence(e.target.value)}
                  isDisabled={fieldsDisabled}
                ></Input>
                <Input
                  label="Tax"
                  value={taxDetails}
                  isDisabled={fieldsDisabled}
                ></Input>
              </div>
            </CardBody>
          </Card>
          <Card className="p-4 mt-4 bg-gray-900 shadow-md shadow-gray-700">
            <h1 className="p-2 text-center text-white font-bold text-3xl">
              Item Selection
            </h1>
            <CardBody>
              <div className="flex lg:p-5 p-0 mt-3 justify-center gap-5 lg:flex-nowrap flex-wrap  ">
                <Autocomplete
                  label="Item Name"
                  placeholder="Select Item Name"
                  defaultItems={items}
                  onSelectionChange={handleItemChange}
                  isDisabled={itemsFieldsDisabled}
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
                  isDisabled={itemsFieldsDisabled}
                ></Input>
                <Input
                  label="Enter Rate"
                  value={selectedItemRate}
                  onChange={(e) => setSelectedItemRate(e.target.value)}
                  isDisabled={itemsFieldsDisabled}
                ></Input>
                <Input
                  label="Enter Dispatch Date"
                  type="date"
                  className=" w-full"
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
                  isDisabled={itemsFieldsDisabled}
                ></Input>
                <Input label="Enter UoM" value={selectedUOM} isDisabled></Input>
              </div>
              {selectedItem && (
                <div className="flex justify-center gap-8 flex-wrap p-2">
                  <h1 className="font-bold  text-white text-md mt-4 mb-4">
                    Drawing Revision Number :
                    {selectedItem ? selectedItem.drawing_revision_number : ""}
                  </h1>
                  <h1 className="font-bold  text-white text-md mt-4 mb-4">
                    Drawing Revision Date :
                    {selectedItem.drawing_revision_date
                      ? selectedItem.drawing_revision_date.substring(0, 10)
                      : ""}
                  </h1>
                </div>
              )}
              <div className="flex justify-center gap-5 p-4">
                <Button
                  color="warning"
                  className="w-full font-bold"
                  onClick={handleRoundOffButtonClick}
                >
                  Round-Off
                </Button>
                <Button
                  color="primary"
                  className="w-full font-bold"
                  onClick={handleAddItem}
                  isDisabled={itemsFieldsDisabled}
                >
                  Add items
                </Button>
                <Button
                  color="success"
                  className="w-full text-white font-bold"
                  onClick={handleSubmitSO}
                >
                  Submit SO
                </Button>
              </div>
            </CardBody>
          </Card>
          <div className="p-3 mt-3">
            {tableitems.length === 0 ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg">
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
                  <TableColumn>Rate</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>DELETE</TableColumn>
                </TableHeader>
                <TableBody>
                  {tableitems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                      <TableCell>{item.amount}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="p-3 mt-3 mb-3 bg-gray-900 rounded-xl">
              <div className="p-4 mt-3 mb-3 bg-white rounded-xl">
                <div className="flex justify-between p-2">
                  <h1 className="font-italic font-semibold text-black lg:text-medium md:text-medium text-sm">
                    Amount (Gst not included):
                  </h1>
                  <h1 className="font-semibold text-black lg:text-medium md:text-medium text-sm lg:mt-0 md:mt-0 mt-3">
                    {totalAmounts?.totalAmountBeforeGST}
                  </h1>
                </div>
                <div className="flex justify-between ">
                  {Object.keys(firstItemTaxDetails).length > 0 && (
                    <div>
                      {Object.entries(firstItemTaxDetails).map(
                        ([taxName, percentage], index) => (
                          <div key={index} className="w-full">
                            <span className="bg-blue-600 rounded-xl mt-3 mb-3 flex gap-4 p-2 font-bold text-white leading-8">
                              {taxName}: {percentage}%
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                  <span>{totalAmountWithGst?.totalGST}</span>
                </div>
                <hr className="border-t-2 border-black my-2 mt-2" />
                <div className="flex mt-3 mb-4 justify-between">
                  <span className="font-bold ">Amount After GST</span>
                  <span className="font-bold ">
                    {" "}
                    {showValue ? "   Value Rounded Off  ---- " : ""}
                    {parseFloat(totalAmounts?.totalAmountBeforeGST) +
                      parseFloat(totalAmountWithGst?.totalGST)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <ToastContainer />
    </>
  );
};

export default page;
