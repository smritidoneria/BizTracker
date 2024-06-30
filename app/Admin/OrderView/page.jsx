/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import NavbarAdmin from "../adminNavbar/page";
import {
  Card,
  Button,
  Input,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Autocomplete,
  Pagination,
  AutocompleteItem,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const [selected, setSelected] = useState("sales");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayOrders, setDisplayOrders] = useState([]); // New state for mapping
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for selected customer
  const [selectedSuppliers, setSelectedSuppliers] = useState(null); // State for selected customer
  const [ProcessNames, setProcessNames] = React.useState([]);
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const openFirstModal = () => setOpenFirstModal(true);
  const closeFirstModal = () => setOpenFirstModal(false);
  const [isOpenSecondModal, setOpenSecondModal] = React.useState(false);
  const openSecondModal = () => setOpenSecondModal(true);
  const closeSecondModal = () => setOpenSecondModal(false);
  const [items, setItems] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedProcessName, setSelectedProcessName] = React.useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [
    selectedPurchaseOrderDetails,
    setSelectedPurchaseOrderDetails,
  ] = useState(null);
  const [selectedTab, setSelectedTab] = useState("sales");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState(null);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      let endpoint;
      switch (selectedTab) {
        case "sales":
          endpoint = `${Domain}/dashboard/orders`;
          break;
        case "manufacturing":
          endpoint = `${Domain}/dashboard/plan-orders`;
          break;
        case "purchase":
          endpoint = `${Domain}/dashboard/purchase-orders`;
          break;
        case "pi":
          endpoint = `${Domain}/dashboard/purchase-indents`;
          break;
        default:
          endpoint = `${Domain}/dashboard/orders`;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      setOrders(data);
      setDisplayOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/processes`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        if (data?.error) {
          console.log("failed to fetch process");
          return;
        }
        setProcessNames(data);
      } catch (error) {
        console.error("Error fetching Process:", error);
      }
    };
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/customers`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/suppliers`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
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
    fetchProcess();
    fetchItems();
    fetchCustomers();
    fetchOrders();
    fetchSuppliers();
  }, [selectedTab]);

  const handleCustomerSelect = (customerName) => {
    setSelectedCustomer(customerName);
    filterOrders(
      customerName,
      selectedStatus,
      selectedItem?.internal_item_name,
      selectedDate
    );
  };

  const handleProcessSelect = (processName) => {
    setSelectedProcessName(processName);
    filterOrders(
      selectedCustomer,
      selectedStatus,
      selectedItem?.internal_item_name,
      selectedDate,
      processName
    );
  };

  const handleSupplierSelect = (supplierName) => {
    setSelectedSuppliers(supplierName);
    filterOrders(
      selectedCustomer,
      selectedStatus,
      selectedItem?.internal_item_name,
      selectedDate,
      null, // Pass null for processName
      supplierName
    );
  };

  const handleItemChange = (id) => {
    const dropdownSelectedItem = items.find((item) => item.id == id);

    setSelectedItem(dropdownSelectedItem);
    filterOrders(
      selectedCustomer,
      selectedStatus,
      dropdownSelectedItem?.internal_item_name,
      selectedDate
    );
  };

  const resetFilter = () => {
    setSelectedCustomer(null);
    setSelectedStatus(null);
    setSelectedItem(null);
    setSelectedDate(null);
    setSelectedProcessName(null);
    setSelectedSuppliers(null);
    setDisplayOrders(orders);
  };

  const pages = Math.ceil(displayOrders.length / rowsPerPage);

  const itemsToShow = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return displayOrders.slice(start, end);
  }, [page, displayOrders]);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    filterOrders(
      selectedCustomer,
      status,
      selectedItem?.internal_item_name,
      selectedDate
    );
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    filterOrders(
      selectedCustomer,
      selectedStatus,
      selectedItem?.internal_item_name,
      date
    );
  };

  const handleTabChange = (tab) => {
    setSelected(tab);
    setSelectedTab(tab);
  };

  const filterOrders = (
    customerName,
    status,
    itemName,
    date,
    processName,
    supplierName
  ) => {
    if (selectedTab === "sales") {
      let filteredOrders = orders;

      if (customerName) {
        filteredOrders = filteredOrders.filter(
          (order) => order.Customer?.name === customerName
        );
      }

      if (status) {
        filteredOrders = filteredOrders.filter(
          (order) => order.state === status
        );
      }

      if (itemName) {
        filteredOrders = filteredOrders.filter((order) =>
          order.OrderItems.some(
            (orderItem) => orderItem.Item.internal_item_name === itemName
          )
        );
      }

      if (date) {
        filteredOrders = filteredOrders.filter((order) =>
          order.customer_order_date.startsWith(date)
        );
      }

      setDisplayOrders(filteredOrders);
    } else if (selectedTab === "manufacturing") {
      let filterManufacturing = orders;

      if (itemName) {
        filterManufacturing = filterManufacturing.filter(
          (order) => order.Item.internal_item_name === itemName
        );
      }

      if (processName) {
        filterManufacturing = filterManufacturing.filter((order) =>
          order.PlanOrderSchedules?.some(
            (schedule) => schedule.Process.process_name === processName
          )
        );
      }

      if (date) {
        filterManufacturing = filterManufacturing.filter((order) =>
          order.estimated_production_date.startsWith(date)
        );
      }

      setDisplayOrders(filterManufacturing);
    } else if (selectedTab === "purchase") {
      let filterPurchase = orders;

      if (supplierName) {
        filterPurchase = filterPurchase.filter(
          (order) => order.Supplier?.name === supplierName
        );
      }
      if (itemName) {
        filterPurchase = filterPurchase.filter((order) =>
          order.PurchaseOrderItems.some(
            (orderItem) => orderItem.Item.internal_item_name === itemName
          )
        );
      }

      if (status) {
        filterPurchase = filterPurchase.filter(
          (order) => order.state === status
        );
      }

      if (date) {
        filterPurchase = filterPurchase.filter((order) =>
          order.order_date.startsWith(date)
        );
      }

      setDisplayOrders(filterPurchase);
    } else if (selectedTab === "pi") {
      let filterPurchaseIndents = orders;

      if (supplierName) {
        filterPurchaseIndents = filterPurchaseIndents.filter(
          (order) => order.Supplier?.name?.toLowerCase() === supplierName.toLowerCase()
        );
      }
      if (itemName) {
        filterPurchaseIndents = filterPurchaseIndents.filter(
          (order) => order.Item.internal_item_name === itemName
        );
      }

      if (status !== null) {
     
        filterPurchaseIndents = filterPurchaseIndents.filter(
          (order) => order.purchase_order_done === (status === "true")
        );
      }

      if (date) {
        filterPurchaseIndents = filterPurchaseIndents.filter((order) =>
          order.expected_order_date.startsWith(date)
        );
      }

      setDisplayOrders(filterPurchaseIndents);
    }
  };

  const handleRowClick = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/dashboard/orders?id=${orderId}`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      setSelectedOrderId(orderId);
      setSelectedOrderDetails(data);
      openFirstModal();
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details");
    }
  };

  const handleShortClose = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/orders/force-complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ order_id: selectedOrderId }),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error || "Failed to short-close order");
      } else {
        toast.success("Order short-closed successfully");
        closeFirstModal();
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.error("Error short-closing order:", error);
      toast.error("Failed to short-close order");
    }
  };

  const handlePurchaseShortClose = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/po/force-complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ purchase_order_id: selectedPurchaseOrderId }),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error || "Failed to short-close Purchase order");
      } else {
        toast.success("Purchase Order short-closed successfully");
        closeFirstModal();
        setSelectedPurchaseOrderId(null);
      }
    } catch (error) {
      console.error("Error short-closing Purchase order:", error);
      toast.error("Failed to short-close Purchase order");
    }
  };

  const handlePurchaseRowClick = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${Domain}/dashboard/purchase-orders?id=${orderId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      setSelectedPurchaseOrderId(orderId);
      setSelectedPurchaseOrderDetails(data);
      openSecondModal();
    } catch (error) {
      console.error("Error fetching Purchase order details:", error);
      toast.error("Failed to fetch Purchase order details");
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black">
        <Card className="p-4 mt-6 mb-6 bg-gray-900">
          <div className="flex justify-between flex-1 lg:flex-nowrap md:flex-nowrap flex-wrap ">
            <h1
              className="p-2 text-center text-white font-bold text-3xl mb-3"
       
            >
              Order View
            </h1>
            <div className="flex justify-center mt-3 mb-4">
              <Tabs
                color="primary"
                aria-label="Tabs colors"
                radius="full"
                selectedKeys={selected}
                onSelectionChange={handleTabChange}
              >
                <Tab key="sales" title="Sales" />
                <Tab key="manufacturing" title="Manufacturing" />
                <Tab key="purchase" title="Purchase" />
                <Tab key="pi" title="PI" />
              </Tabs>
            </div>
          </div>
          <div className="flex justify-between p-3 mt-4 mb-5 lg:flex-nowrap flex-wrap">
            <Autocomplete
              placeholder="Search For Item Name ..."
              className="lg:w-2/5 w-full lg:mb-0 mb-4"
              defaultItems={items}
              onSelectionChange={handleItemChange}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>
                  {item.internal_item_name}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              type="date"
              className="lg:w-1/6 w-full lg:mt-0 lg:mb-0 mt-2 mb-3"
              onChange={handleDateChange}
            />
            {selectedTab === "sales" && (
              <>
                <div className="flex justify-between gap-3 ">
                  <Dropdown backdrop="blur" className="">
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        className="font-bold"
                        endContent={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className=" font-bold mt-1 text-white w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        Customers
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Static Actions">
                      <DropdownItem
                        key="all"
                        onClick={() => handleCustomerSelect(null)}
                      >
                        All Customers
                      </DropdownItem>
                      {customers.map((customer) => (
                        <DropdownItem
                          key={customer.id}
                          onClick={() => handleCustomerSelect(customer.name)}
                        >
                          {customer.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown backdrop="blur" className="">
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        className="font-bold"
                        endContent={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className=" font-bold mt-1 text-white w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        Status
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Static Actions">
                      <DropdownItem
                        key="completed"
                        onClick={() => handleStatusSelect("completed")}
                      >
                        Completed
                      </DropdownItem>
                      <DropdownItem
                        key="pending"
                        onClick={() => handleStatusSelect("pending")}
                      >
                        Pending
                      </DropdownItem>
                      <DropdownItem
                        key="ForceCompleted"
                        onClick={() => handleStatusSelect("force_completed")}
                      >
                        Force Completed
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  {(selectedCustomer ||
                    selectedStatus ||
                    selectedItem ||
                    selectedDate ||
                    selectedProcessName) && (
                    <Button
                      color="warning"
                      className="font-bold"
                      onClick={resetFilter}
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              </>
            )}
            {selectedTab === "manufacturing" && (
              <>
                <Dropdown backdrop="blur" className="">
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      className="font-bold"
                      endContent={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className=" font-bold mt-1 text-white w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      }
                    >
                      Process
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Static Actions">
                    <DropdownItem
                      key="all"
                      onClick={() => handleProcessSelect(null)}
                    >
                      All Process
                    </DropdownItem>
                    {ProcessNames.map((process) => (
                      <DropdownItem
                        key={process.id}
                        onClick={() =>
                          handleProcessSelect(process.process_name)
                        }
                      >
                        {process.process_name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                {(selectedItem || selectedDate || selectedProcessName) && (
                  <Button
                    color="warning"
                    className="font-bold"
                    onClick={resetFilter}
                  >
                    Reset Filter
                  </Button>
                )}
              </>
            )}

            {selectedTab === "purchase" && (
              <>
                <div className="flex justify-between gap-3 ">
                  <Dropdown backdrop="blur" className="">
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        className="font-bold"
                        endContent={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className=" font-bold mt-1 text-white w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        Suppliers
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Static Actions">
                      <DropdownItem
                        key="all"
                        onClick={() => handleCustomerSelect(null)}
                      >
                        All Suppliers
                      </DropdownItem>
                      {suppliers.map((supplier) => (
                        <DropdownItem
                          key={supplier.id}
                          onClick={() => handleSupplierSelect(supplier.name)}
                        >
                          {supplier.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown backdrop="blur" className="">
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        className="font-bold"
                        endContent={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className=" font-bold mt-1 text-white w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        Status
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Static Actions">
                      <DropdownItem
                        key="completed"
                        onClick={() => handleStatusSelect("completed")}
                      >
                        Completed
                      </DropdownItem>
                      <DropdownItem
                        key="pending"
                        onClick={() => handleStatusSelect("pending")}
                      >
                        Pending
                      </DropdownItem>
                      <DropdownItem
                        key="ForceCompleted"
                        onClick={() => handleStatusSelect("force_completed")}
                      >
                        Force Completed
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  {(selectedStatus ||
                    selectedItem ||
                    selectedDate ||
                    selectedSuppliers) && (
                    <Button
                      color="warning"
                      className="font-bold"
                      onClick={resetFilter}
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              </>
            )}
            {selectedTab === "pi" && (
              <>
                <div className="flex justify-between gap-3 ">
                  <Dropdown backdrop="blur" className="">
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        className="font-bold"
                        endContent={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className=" font-bold mt-1 text-white w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        Suppliers
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Static Actions">
                      <DropdownItem
                        key="all"
                        onClick={() => handleSupplierSelect(null)}
                      >
                        All Suppliers
                      </DropdownItem>
                      {suppliers.map((supplier) => (
                        <DropdownItem
                          key={supplier.id}
                          onClick={() => handleSupplierSelect(supplier.name)}
                        >
                          {supplier.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown backdrop="blur" className="">
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        className="font-bold"
                        endContent={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className=" font-bold mt-1 text-white w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        }
                      >
                        Status
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Static Actions">
                      <DropdownItem
                        key="completed"
                        onClick={() => handleStatusSelect("true")}
                      >
                        Ordered
                      </DropdownItem>
                      <DropdownItem
                        key="pending"
                        onClick={() => handleStatusSelect("false")}
                      >
                        Pending to order
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  {(selectedStatus ||
                    selectedItem ||
                    selectedDate ||
                    selectedSuppliers) && (
                    <Button
                      color="warning"
                      className="font-bold"
                      onClick={resetFilter}
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          {selectedTab == "sales" && (
            <>
              <Table
                aria-label="Example static collection table"
                className="p-2 mt-3 mb-4"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
                classNames={{
                  wrapper: "min-h-[222px]",
                }}
              >
                <TableHeader>
                  <TableColumn>ORDER ID</TableColumn>
                  <TableColumn>CUSTOMER NAME</TableColumn>
                  <TableColumn>ORDER ITEMS</TableColumn>
                  <TableColumn>CREATED AT</TableColumn>
                  <TableColumn>ORDER TIME</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                  {(order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => handleRowClick(order.id)}
                      className=" transition duration-300 ease-in-out hover:bg-orange-100 cursor-pointer"
                    >
                      <TableCell>
                        {order.sale_order_id ? order.sale_order_id : "N/A"}
                      </TableCell>
                      <TableCell>{order.Customer?.name ?? "N/A"}</TableCell>
                      <TableCell>
                        {order.OrderItems && order.OrderItems.length > 0 ? (
                          <Tooltip
                            content={(order.OrderItems ?? [])
                              .map(
                                (item) => item?.Item?.internal_item_name ?? ""
                              )
                              .join("   ||   ")}
                            className="bg-black text-white font-bold"
                          >
                            <span>
                              {order.OrderItems?.[0]?.Item
                                ?.internal_item_name ?? "No Items"}
                            </span>
                          </Tooltip>
                        ) : (
                          "No Items"
                        )}
                      </TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {order.customer_order_date
                          ? new Date(order.customer_order_date).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{order.state ?? "N/A"}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}

          {selectedTab == "manufacturing" && (
            <>
              <Table
                aria-label="Example static collection table"
                className="p-2 mt-3 mb-4"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
                classNames={{
                  wrapper: "min-h-[222px]",
                }}
              >
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>ITEM NAME</TableColumn>
                  <TableColumn>QTY</TableColumn>
                  <TableColumn>PROCESS NAME</TableColumn>
                  <TableColumn>APPROVED BY</TableColumn>
                  <TableColumn>ESTIMATED PRODUCTION DATE</TableColumn>
                  <TableColumn>CREATED AT</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                  {(order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.Item?.internal_item_name}</TableCell>
                      <TableCell>{order.qty}</TableCell>
                      <TableCell>
                        {order.PlanOrderSchedules?.[0]?.Process?.process_name ??
                          "N/A"}
                      </TableCell>
                      <TableCell>{order.approved_by ?? "N/A"}</TableCell>
                      <TableCell>
                        {order.estimated_production_date
                          ? new Date(
                              order.estimated_production_date
                            ).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}

          {selectedTab == "purchase" && (
            <>
              <Table
                aria-label="Example static collection table"
                className="p-2 mt-3 mb-4"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
                classNames={{
                  wrapper: "min-h-[222px]",
                }}
              >
                <TableHeader>
                  <TableColumn>PO ID</TableColumn>
                  <TableColumn>SUPPLIER NAME</TableColumn>
                  <TableColumn>ITEMS</TableColumn>
                  <TableColumn>ORDER CREATED AT </TableColumn>
                  <TableColumn>ORDER TIME</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                  {(order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => handlePurchaseRowClick(order.id)}
                      className=" transition duration-300 ease-in-out hover:bg-orange-100 cursor-pointer"
                    >
                      <TableCell>{order.purchase_order_number}</TableCell>
                      <TableCell>{order.Supplier?.name}</TableCell>
                      <TableCell>
                        {order.PurchaseOrderItems &&
                        order.PurchaseOrderItems.length > 0 ? (
                          <Tooltip
                            content={(order.PurchaseOrderItems ?? [])
                              .map(
                                (item) => item?.Item?.internal_item_name ?? ""
                              )
                              .join("   ||   ")}
                            className="bg-black text-white font-bold"
                          >
                            <span>
                              {order.PurchaseOrderItems?.[0]?.Item
                                ?.internal_item_name ?? "No Items"}
                            </span>
                          </Tooltip>
                        ) : (
                          "No Items"
                        )}
                      </TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {order.order_date
                          ? new Date(order.order_date).toLocaleString()
                          : "N/A"}
                      </TableCell>

                      <TableCell>{order.state ?? "N/A"}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
          {selectedTab == "pi" && (
            <>
              <Table
                aria-label="Example static collection table"
                className="p-2 mt-3 mb-4"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
                classNames={{
                  wrapper: "min-h-[222px]",
                }}
              >
                <TableHeader>
                  <TableColumn>PI ID</TableColumn>
                  <TableColumn>SUGGESTED SUPPLIER NAME</TableColumn>
                  <TableColumn>ITEMS</TableColumn>
                  <TableColumn>ORDER CREATED BY </TableColumn>
                  <TableColumn>ORDER TIME</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody items={itemsToShow}>
                  {(order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.Supplier?.name??  "N/A"}</TableCell>
                      <TableCell>{order.Item?.internal_item_name}</TableCell>
                      <TableCell>{order.created_by ?? "N/A"}</TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {order.purchase_order_done
                          ? "ordered"
                          : "pending to order"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </Card>
      </div>
      <ToastContainer />
      <Modal
        isOpen={isOpenFirstModal}
        onOpenChange={closeFirstModal}
        placement="center"
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>

          <ModalBody className="overflow-y-scroll">
            {selectedOrderDetails ? (
              <>
                <Card className="p-4 my-4 ">
                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">
                      Sale Order ID:
                    </h2>
                    <p className="text-black">
                      {selectedOrderDetails.sale_order_id || "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">
                      Customer Order Date:
                    </h2>
                    <p className="text-black">
                      {selectedOrderDetails.customer_order_date
                        ? new Date(
                            selectedOrderDetails.customer_order_date
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">Status:</h2>
                    <p className="text-black">
                      {selectedOrderDetails.state || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">
                      Customer Name:
                    </h2>
                    <p className="text-black">
                      {selectedOrderDetails.Customer?.name || "N/A"}
                    </p>
                  </div>
                </Card>

                <Card className="p-4 my-4 ">
                  <h2 className="text-black font-bold mb-4">Order Items</h2>
                  <Table aria-label="Order Items Table">
                    <TableHeader>
                      <TableColumn>Item Name</TableColumn>
                      <TableColumn>Scheduled Qty</TableColumn>
                      <TableColumn>Estimate Date of Dispatch</TableColumn>
                      <TableColumn>Dispatched Qty</TableColumn>
                      <TableColumn>Actual Dispatch Date</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {selectedOrderDetails.OrderItems.map((orderItem) => (
                        <TableRow key={orderItem.id}>
                          <TableCell>
                            {orderItem.Item.internal_item_name}
                          </TableCell>
                          <TableCell>{orderItem.qty}</TableCell>
                          <TableCell>
                            {orderItem.estimate_date_of_dispatch
                              ? new Date(
                                  orderItem.estimate_date_of_dispatch
                                ).toLocaleString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {orderItem.OrderSchedules?.[0]?.dispatched_qty ||
                              "N/A"}
                          </TableCell>
                          <TableCell>
                            {orderItem.OrderSchedules?.[0]?.createdAt
                              ? new Date(
                                  orderItem.OrderSchedules[0].createdAt
                                ).toLocaleString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
                <div className="flex justify-center gap-3">
                  <Button
                    color="success"
                    variant="ghost"
                    className="font-bold text-black"
                    onClick={handleShortClose}
                  >
                    Short Close
                  </Button>
                  <Button
                    color="primary"
                    variant="ghost"
                    className="font-bold text-black"
                    onClick={closeFirstModal}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-white">
                Click on a row to view order details.
              </p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenSecondModal}
        onOpenChange={closeSecondModal}
        placement="center"
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          <ModalHeader>Purchase Order Details</ModalHeader>

          <ModalBody className="overflow-y-scroll">
            {selectedPurchaseOrderDetails ? (
              <>
                <Card className="p-4 my-4 ">
                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">
                      Purchase Order ID:
                    </h2>
                    <p className="text-black">
                      {selectedPurchaseOrderDetails.purchase_order_number ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">Order Date:</h2>
                    <p className="text-black">
                      {selectedPurchaseOrderDetails.order_date
                        ? new Date(
                            selectedPurchaseOrderDetails.order_date
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">Status:</h2>
                    <p className="text-black">
                      {selectedPurchaseOrderDetails.state || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-7 mt-4 mb-4">
                    <h2 className="text-black font-bold mb-2">
                      Supplier Name:
                    </h2>
                    <p className="text-black">
                      {selectedPurchaseOrderDetails.Supplier?.name || "N/A"}
                    </p>
                  </div>
                </Card>

                <Card className="p-4 my-4 ">
                  <h2 className="text-black font-bold mb-4">Order Items</h2>
                  <Table aria-label="Order Items Table">
                    <TableHeader>
                      <TableColumn>Item Name</TableColumn>
                      <TableColumn>Scheduled Qty</TableColumn>
                      <TableColumn>Estimate Date of Arrival</TableColumn>
                      <TableColumn>Received Qty</TableColumn>
                      <TableColumn>Actual Inward Date</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {selectedPurchaseOrderDetails.PurchaseOrderItems.map(
                        (orderItem) => (
                          <TableRow key={orderItem.id}>
                            <TableCell>
                              {orderItem.Item.internal_item_name}
                            </TableCell>
                            <TableCell>{orderItem.qty}</TableCell>
                            <TableCell>
                              {orderItem.estimate_date_of_arrival
                                ? new Date(
                                    orderItem.estimate_date_of_arrival
                                  ).toLocaleString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {orderItem.PurchaseOrderSchedules?.[0]
                                ?.received_qty || "N/A"}
                            </TableCell>
                            <TableCell>
                              {orderItem.PurchaseOrderSchedules?.[0]?.createdAt
                                ? new Date(
                                    orderItem.PurchaseOrderSchedules[0].createdAt
                                  ).toLocaleString()
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Card>
                <div className="flex justify-center gap-3">
                  <Button
                    color="success"
                    variant="ghost"
                    className="font-bold text-black"
                    onClick={handlePurchaseShortClose}
                  >
                    Short Close
                  </Button>
                  <Button
                    color="primary"
                    variant="ghost"
                    className="font-bold text-black"
                    onClick={closeFirstModal}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-white">
                Click on a row to view order details.
              </p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
