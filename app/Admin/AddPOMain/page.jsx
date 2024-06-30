/* eslint-disable react/no-unescaped-entities */
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [suppliers, setsuppliers] = React.useState([]);
  const [Factories, setFactories] = React.useState([]);
  const [tax, setTax] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [selectedsupplier, setSelectedsupplier] = React.useState(null);
  const [selectedFactories, setselectedFactories] = React.useState(null);
  const [supplierOrderDate, setsupplierOrderDate] = React.useState(
    getCurrentDate()
  );
  const [poNumber, setpoNumber] = React.useState("");
  const [partyDetails, setPartyDetails] = React.useState("");
  const [otherRef, setOtherRef] = React.useState("");
  const [termsofPayment, setTermsofPayment] = React.useState("");
  const [tableitems, setTableItems] = React.useState([]);
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const closeFirstModal = () => setOpenFirstModal(false);
  const [purchaseIndents, setPurchaseIndents] = React.useState([]);
  const [filteredPurchaseIndents, setFilteredPurchaseIndents] = React.useState(
    []
  );
  const [selectedPiId, setSelectedPiId] = React.useState([]);
  const [selectedPi, setSelectedPi] = React.useState(null);
  const [highlightedRows, setHighlightedRows] = React.useState([]);
  const [disabledRows, setDisabledRows] = React.useState([]);
  const [RoundOffButtonClicked, setRoundOffButtonClicked] = React.useState(
    false
  );
  const [precision, setPrecision] = React.useState(2);
  const [firstItemTaxDetails, setFirstItemTaxDetails] = React.useState({});
  const [selectedPiTaxDetails, setSelectedPiTaxDetails] = React.useState({
    taxOneName: "",
    taxOnePercentage: 0,
    taxTwoName: "",
    taxTwoPercentage: 0,
  });
  const [selectedItem, setSelectedItem] = React.useState(null);

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
        if (data?.error) {
          toast.error(data.error);
        } else {
          setsuppliers(data);
        }
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
        if (!data?.error) {
          setFactories(data);
        }
      } catch (error) {
        console.error("Error fetching Transporters:", error);
      }
    };
    const fetchTax = async () => {
      try {
        const response = await fetch(`${Domain}/tax`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          toast.error(data.error);
        } else {
          setTax(data);
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
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
        if (data?.error) {
          toast.error(data.error);
        } else {
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching Tax:", error);
      }
    };
    fetchItems();
    fetchTax();
    fetchFactories();
    fetchsuppliers();
  }, []);

  React.useEffect(() => {
    if (selectedItem) {
      const filteredItems = purchaseIndents.filter(
        (pi) => pi.Item.internal_item_name === selectedItem.internal_item_name
      );
      setFilteredPurchaseIndents(filteredItems);
    } else {
      setFilteredPurchaseIndents(purchaseIndents);
    }
  }, [purchaseIndents, selectedItem]);

  const handlesupplierChange = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id == id);
    setSelectedsupplier(supplier);
    setPartyDetails(supplier ? supplier.name : null);
  };
  const handleFactoriesChange = (id) => {
    const Factory = Factories.find((factories) => factories.id == id);
    setselectedFactories(Factory);
  };

  const openFirstModal = async () => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
    try {
      const response = await fetch(`${Domain}/purchaseIndent`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      } else {
        setPurchaseIndents(data);
        setFilteredPurchaseIndents(data);
        setOpenFirstModal(true);
      }
    } catch (error) {
      console.error("Error fetching purchase indents:", error);
      toast.error("Error fetching purchase indents");
    }
  };
  const handleAddToTable = (row, piId) => {
    setSelectedPi(row);
    const { suggested_supplier } = row; // Assuming the suggested_supplier_id exists in the row object
    const suggestedSupplier = suppliers
      ? suppliers.find((supplier) => supplier.id == suggested_supplier)
      : null;

    if (suggestedSupplier) {
      setSelectedsupplier(suggestedSupplier);
    }

    const taxOneName =
      row.Item.taxOne && row.Item.taxOne.name ? row.Item.taxOne.name : "";
    const taxOnePercentage =
      row.Item.taxOne && row.Item.taxOne.percentage
        ? row.Item.taxOne.percentage
        : 0;
    const taxTwoName =
      row.Item.taxTwo && row.Item.taxTwo.name ? row.Item.taxTwo.name : "";
    const taxTwoPercentage =
      row.Item.taxTwo && row.Item.taxTwo.percentage
        ? row.Item.taxTwo.percentage
        : 0;

    if (tableitems.length === 0) {
      const taxDetails = {
        [taxOneName]: taxOnePercentage,
        [taxTwoName]: taxTwoPercentage,
      };
      setSelectedPiTaxDetails({
        taxOneName,
        taxOnePercentage,
        taxTwoName,
        taxTwoPercentage,
      });

      setFirstItemTaxDetails(taxDetails);
      setTableItems([...tableitems, row]);
      setSelectedPiId([...selectedPiId, piId]);
      setHighlightedRows([...highlightedRows, row.id]);
      setDisabledRows([...disabledRows, row.id]);
      // closeFirstModal();
    } else {
      const newItemTaxDetails = {
        [taxOneName]: taxOnePercentage,
        [taxTwoName]: taxTwoPercentage,
      };

      if (
        JSON.stringify(newItemTaxDetails) !==
        JSON.stringify(firstItemTaxDetails)
      ) {
        toast.error("Tax details of the new item do not match the first item.");
        return;
      } else {
        setSelectedPiTaxDetails({
          taxOneName,
          taxOnePercentage,
          taxTwoName,
          taxTwoPercentage,
        });

        setTableItems([...tableitems, row]);
        setSelectedPiId([...selectedPiId, piId]);
        setHighlightedRows([...highlightedRows, row.id]);
        setDisabledRows([...disabledRows, row.id]);
        // closeFirstModal();
      }
    }
  };
  function splitMultiLineString(multiLineString) {
    return multiLineString.split("\n");
  }


  const handleRateChange = (e, itemId) => {
    const newRate = e.target.value;
    const updatedItems = tableitems.map((item) =>
      item.id === itemId
        ? { ...item, Item: { ...item.Item, rate: newRate } }
        : item
    );
    setTableItems(updatedItems);
  };

  const totalRateAmount = tableitems.reduce((total, item) => {
    const rate = parseFloat(item.Item.rate || 0);
    const qty = parseFloat(item.qty || 0);
    return total + parseFloat((rate * qty).toFixed(0));
  }, 0);

  const handleRoundOff = () => {
    setRoundOffButtonClicked(true);
    setPrecision(0);
    toast.warning("Value Rounded Off");
  };

  function formatDate(dateString) {
    return dateString.replace(/-/g, "");
  }

  const handleSubmitPO = async () => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
    try {
      const response = await fetch(`${Domain}/po`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          supplier_id: selectedsupplier.id,
          factory_id: selectedFactories.id,
          purchase_order_number: poNumber,
          order_date: supplierOrderDate,
          purchase_indent_ids: selectedPiId,
          items: tableitems.map((item) => ({
            item_id: item.Item.id,
            qty: parseInt(item.qty),
            rate: parseInt(item.Item.rate),
            estimate_date_of_arrival: item.expected_order_date,
          })),
          tally_json: {
            "ENVELOPE": {
              "HEADER": {
                "TALLYREQUEST": "Import Data"
              },
              "BODY": {
                "IMPORTDATA": {
                  "REQUESTDESC": {
                    "REPORTNAME": "All Masters",
                    "STATICVARIABLES": {
                      "SVCURRENTCOMPANY": "VAISHNAV FASTNERS"
                    }
                  },
                  "REQUESTDATA": {
                    "TALLYMESSAGE": {
                      "VOUCHER": {
                        "DATE": formatDate(supplierOrderDate),
                        "PARTYNAME": partyDetails,
                        "VOUCHERTYPENAME": "Purchase Order",
                        "VOUCHERNUMBER": poNumber,
                        "REFERENCE": otherRef,
                        "PARTYLEDGERNAME": partyDetails,
                        "PERSISTEDVIEW": "Invoice Voucher View",
                        "ADDRESS.LIST": {
                          "ADDRESS": [
                            splitMultiLineString(selectedsupplier.address)
                          ],
                          "_TYPE": "String"
                        },
                        "STATENAME": selectedsupplier?selectedsupplier.state : null,
                        "PARTYGSTIN": selectedsupplier?selectedsupplier.gstin : null,
                        "CONSIGNEEGSTIN": selectedsupplier?selectedsupplier.gstin : null,
                        "CONSIGNEEMAILINGNAME": "VAISHNAV FASTNERS",
                        "BASICBUYERADDRESS.LIST": {
                          "BASICBUYERADDRESS": [
                            splitMultiLineString(selectedsupplier?selectedsupplier.address : null)
                          ],
                          "_TYPE": "String"
                        },
                        "BASICORDERREF": otherRef,
                        "CONSIGNEESTATENAME": selectedsupplier?selectedsupplier.state : null,
                        "CONSIGNEECOUNTRYNAME": selectedsupplier?selectedsupplier.country : null,
                        "BASICFINALDESTINATION": "Vasai",
                        "BASICDUEDATEOFPYMT": selectedsupplier?selectedsupplier.payment_terms : null,
                        "BASICORDERTERMS.LIST": {
                          "BASICORDERTERMS": [
                            splitMultiLineString(termsofPayment)
                          ],
                          "_TYPE": "String"
                        },
                        "LEDGERENTRIES.LIST": [
                          {
                            "LEDGERNAME": selectedsupplier?selectedsupplier.name : null,
                            "ISDEEMEDPOSITIVE": "No",
                            "ISLASTDEEMEDPOSITIVE": "Yes",
                            "AMOUNT": totalRateAmount
                          },
                          {
                            "BASICRATEOFINVOICETAX.LIST": {
                              "BASICRATEOFINVOICETAX": selectedPiTaxDetails.taxOnePercentage,
                              "_TYPE": "Number"
                            },
                            "ROUNDTYPE": "",
                            "LEDGERNAME": `${selectedPiTaxDetails.taxOneName} ${selectedPiTaxDetails.taxOnePercentage} `,
                            "ISDEEMEDPOSITIVE": "Yes",
                            "AMOUNT": taxOneAmount,
                          },
                          {
                            "BASICRATEOFINVOICETAX.LIST": {
                              "BASICRATEOFINVOICETAX": selectedPiTaxDetails.taxTwoPercentage,
                              "_TYPE": "Number"
                            },
                            "ROUNDTYPE": "",
                            "LEDGERNAME": `${selectedPiTaxDetails.taxTwoName} ${selectedPiTaxDetails.taxTwoPercentage} `,
                            "ISDEEMEDPOSITIVE": "Yes",
                            "AMOUNT": taxTwoAmount,
                          }
                        ],
                        "ALLINVENTORYENTRIES.LIST": tableitems.map((item) => ({
                            "STOCKITEMNAME": item.Item.internal_item_name,
                            "ISDEEMEDPOSITIVE": "Yes",
                            "RATE": `${item.Item.rate}/${item.uom}`,
                            "AMOUNT": `${item.qty * item.Item.rate}`,
                            "ACTUALQTY": item.qty,
                            "BILLEDQTY": item.qty,
                            "BATCHALLOCATIONS.LIST": {
                              "GODOWNNAME": "Main Location",
                              "BATCHNAME": "Primary Batch",
                              "AMOUNT": `${item.qty * item.Item.rate}`,
                              "ACTUALQTY": item.qty,
                              "BILLEDQTY": item.qty,
                              "ORDERDUEDATE": formatDate(item.expected_order_date)
                            }
                          })),
                        "_VCHTYPE": "Purchase Order",
                        "_ACTION": "Create"
                      },
                      "_xmlns:UDF": "TallyUDF"
                    }
                  }
                }
              }
            }
          }
        }),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Successfully Submited Purchase Order");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting Purchase Order:", error);
      toast.error("Error submitting Purchase Order");
    }
  };
  const handleDeleteItem = (itemId) => {
    const updatedTableItems = tableitems.filter((item) => item.id !== itemId);
    const updatedSelectedPiId = selectedPiId.filter((piId) => piId !== itemId);
    const updatedHighlightedRows = highlightedRows.filter(
      (rowId) => rowId !== itemId
    );
    const updatedDisabledRows = disabledRows.filter(
      (rowId) => rowId !== itemId
    );
    setTableItems(updatedTableItems);
    setSelectedPiId(updatedSelectedPiId);
    setHighlightedRows(updatedHighlightedRows);
    setDisabledRows(updatedDisabledRows);
  };

  const formattedTaxDetails = `${selectedPiTaxDetails.taxOneName} - ${selectedPiTaxDetails.taxOnePercentage}, ${selectedPiTaxDetails.taxTwoName} - ${selectedPiTaxDetails.taxTwoPercentage}`;
  const taxOneAmount = parseFloat(
    (totalRateAmount * selectedPiTaxDetails.taxOnePercentage) / 100
  );
  const taxTwoAmount = parseFloat(
    (totalRateAmount * selectedPiTaxDetails.taxTwoPercentage) / 100
  );

  const totalAmountWithTaxes =
    parseFloat(totalRateAmount.toFixed(precision)) +
    taxOneAmount +
    taxTwoAmount;

  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);

    setSelectedItem(dropdownSelectedItem);
  };
  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black">
        <Card className="p-4 bg-gray-800">
          <h1
            className="p-2 text-center text-white font-bold text-3xl mb-3"
          
          >
            ADD PO
          </h1>
          {selectedsupplier && (
            <Card className="p-4 bg-gray-900 shadow-md shadow-gray-700 mb-5">
              <h1 className="p-2 text-center text-white font-bold text-3xl mb-3">
                Supplier Details
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
                        label=" supplier Email ID"
                        value={
                          selectedsupplier ? selectedsupplier.email_id : null
                        }
                        disabled
                      ></Input>
                      <Input
                        className="w-full"
                        label="Address"
                        value={
                          selectedsupplier ? selectedsupplier.address : null
                        }
                        disabled
                      ></Input>
                    </div>{" "}
                  </div>

                  <div className="flex justify-center mt-6 gap-5 lg:flex-nowrap flex-wrap">
                    <Input
                      label="State"
                      value={selectedsupplier ? selectedsupplier.state : null}
                      disabled
                    ></Input>
                    <Input
                      label="Country"
                      value={selectedsupplier ? selectedsupplier.country : null}
                      disabled
                    ></Input>
                    <Input
                      label="GSTIN"
                      value={selectedsupplier ? selectedsupplier.gstin : null}
                      disabled
                    ></Input>
                    <Input
                      label="Terms Of Payment"
                      value={
                        selectedsupplier ? selectedsupplier.payment_terms : null
                      }
                      disabled
                    ></Input>
                  </div>
                </AccordionItem>
              </Accordion>
            </Card>
          )}

          <Card className="p-4 bg-gray-900 shadow-md shadow-gray-700">
            <CardBody>
              <div className="flex mb-2 justify-between">
                <Button
                  color="primary"
                  className="font-bold text-white lg:w-1/5 w-auto mb-2"
                  onClick={openFirstModal}
                >
                  Link PI
                </Button>
                <span className="font-bold text-white">
                  {" "}
                  Linked Pi's: {selectedPiId.join(", ")}
                </span>
              </div>
              <div className="flex justify-center gap-5 lg:flex-nowrap flex-wrap">
                <div className="flex justify-between gap-5 w-full">
                  <Input
                    className="w-full"
                    value={poNumber}
                    onChange={(e) => setpoNumber(e.target.value)}
                    label="Tally Po Number"
                  ></Input>
                  <Input
                    label="Order Date"
                    type="date"
                    value={supplierOrderDate}
                    onChange={(e) => setsupplierOrderDate(e.target.value)}
                  ></Input>
                </div>
                <div className="flex justify-between gap-5 w-full">
                  <Autocomplete
                    label="supplier"
                    className="w-full"
                    value={suppliers}
                    selectedKey={`${
                      selectedsupplier ? selectedsupplier.id : ""
                    }`}
                    onSelectionChange={handlesupplierChange}
                  >
                    {suppliers
                      ? suppliers.map((supplier) => (
                          <AutocompleteItem key={supplier.id}>
                            {supplier.name}
                          </AutocompleteItem>
                        ))
                      : null}
                  </Autocomplete>
                  <Autocomplete
                    label="Select Inwarding Factories"
                    className="w-full"
                    value={selectedFactories ? selectedFactories.name : ""}
                    onSelectionChange={handleFactoriesChange}
                  >
                    {Factories
                      ? Factories.map((factory) => (
                          <AutocompleteItem key={factory.id}>
                            {factory.name}
                          </AutocompleteItem>
                        ))
                      : null}
                  </Autocomplete>
                </div>
              </div>

              <div className="flex justify-center mt-6 gap-5 lg:flex-nowrap flex-wrap">
                <Input label="Terms of Delivery" multiline rows={4} value={termsofPayment} onChange={(e)=> setTermsofPayment(e.target.value)}></Input>
                <Input label="Other Ref.." value={otherRef} onChange={(e)=> setOtherRef(e.target.value)}></Input>
                <Input
                  label="Tax"
                  value={formattedTaxDetails ? formattedTaxDetails : ""}
                ></Input>
              </div>
              <div className="flex justify-center gap-5 p-4">
                <Button
                  color="warning"
                  className="w-full font-bold"
                  onClick={handleRoundOff}
                >
                  Round-Off
                </Button>
                <Button
                  color="success"
                  className="w-full text-white font-bold"
                  onClick={handleSubmitPO}
                >
                  Submit PO
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
                  <TableColumn>UOM</TableColumn>
                  <TableColumn>Rate </TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>DELETE</TableColumn>
                </TableHeader>
                <TableBody>
                  {tableitems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item?.Item?.internal_item_name}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item?.Item?.uom}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item?.Item?.rate}
                          onChange={(e) => handleRateChange(e, item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {item.expected_order_date.substring(0, 10)}
                      </TableCell>
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
                    {totalRateAmount}
                  </h1>
                </div>
                <hr className="border-t-2 border-black my-2 mt-2" />
                <div className="">
                  <div className="w-full mt-4 mb-4 flex justify-between">
                    <span className="bg-blue-600 rounded-xl mt-3 mb-3 flex gap-4 p-2 font-bold text-white leading-8">
                      {selectedPiTaxDetails?.taxOneName}:{" "}
                      {selectedPiTaxDetails?.taxOnePercentage}%
                    </span>
                    <span className="mt-3 mb-3">{taxOneAmount}</span>
                  </div>
                  <div className="w-full mt-4 mb-4 flex justify-between ">
                    <span className="bg-blue-600 rounded-xl mt-3 mb-3 flex gap-4 p-2 font-bold text-white leading-8">
                      {selectedPiTaxDetails?.taxTwoName}:{" "}
                      {selectedPiTaxDetails?.taxTwoPercentage}%
                    </span>
                    <span className="mt-3 mb-3">{taxTwoAmount}</span>
                  </div>
                </div>
                <hr className="border-t-2 border-black my-2 mt-2" />
                <div className="flex justify-between p-2">
                  <h1 className="font-italic font-semibold text-black lg:text-medium md:text-medium text-sm">
                    Amount (Tax included):
                  </h1>
                  <h1 className="font-semibold text-black lg:text-medium md:text-medium text-sm lg:mt-0 md:mt-0 mt-3">
                    {totalAmountWithTaxes ? totalAmountWithTaxes : "0.00"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <ToastContainer />
      <Modal
        isOpen={isOpenFirstModal}
        onOpenChange={closeFirstModal}
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 m-auto text-center justify-center font-bold">
                Link PI
              </ModalHeader>
              <ModalBody className="overflow-y-scroll">
                <div className="p-4 flex justify-center w-1/2 items-center">
                  <Autocomplete
                    label="Item Name"
                    placeholder="Select Item Name"
                    value={selectedItem ? selectedItem.name : ""}
                    onSelectionChange={handleItemChange}
                  >
                    {items.map((item) => (
                      <AutocompleteItem key={item.id}>
                        {item.internal_item_name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <Table aria-label="Purchase Indent table">
                  <TableHeader>
                    <TableColumn>PI ID</TableColumn>
                    <TableColumn>Item Name</TableColumn>
                    <TableColumn>Qty</TableColumn>
                    <TableColumn>Rate</TableColumn>
                    <TableColumn>Expected Order Date</TableColumn>
                    <TableColumn>Created By</TableColumn>
                    <TableColumn>Add</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchaseIndents.map((pi) => (
                      <TableRow
                        key={pi.id}
                        className={
                          highlightedRows.includes(pi.id) ? "bg-green-400" : ""
                        }
                      >
                        <TableCell>{pi.id}</TableCell>
                        <TableCell>{pi.Item?.internal_item_name}</TableCell>
                        <TableCell>{pi.qty}</TableCell>
                        <TableCell>{pi.Item?.rate}</TableCell>
                        <TableCell>{pi.expected_order_date}</TableCell>
                        <TableCell>{pi.created_by}</TableCell>
                        <TableCell>
                          <Button
                            color="success"
                            className="font-bold text-white"
                            isDisabled={disabledRows.includes(pi.id)}
                            onClick={() => handleAddToTable(pi, pi.id)}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
