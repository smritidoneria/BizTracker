/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import NavbarAdmin from "../adminNavbar/page";
import {
  Card,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState("");


  const [processes, setProcesses] = useState([]);
  const [allInventoryData, setAllInventoryData] = useState([]);
  const [allInventoryDataProcess, setAllInventoryDataProcess] = useState([]);
  const [isOpenFirstModal, setOpenFirstModal] = useState(false);
  const [itemLocationData, setItemLocationData] = useState([]);
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [toggleView, setToggleView] = useState("aggregate"); // default view
  const [searchTerm, setSearchTerm] = useState(""); // search term for item name
  const [selectedItemDescription, setSelectedItemDescription] = useState("");
  const [sellItems, setSellItems] = useState([]);
  const [searchResultss, setSearchResultss] = useState([]);
  const [sellItemsProcess, setsellItemsProcess] = useState([]);
  const [selectedprocess, setselectedprocess] = useState([]);
  const [scrap, setScrap] = useState([]);
  const [selectedScrap, setselectedScrap] = useState("");
  const [itemName, setItemName] = useState([]);
  const [processName, setProcessName] = useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [allprocess, setAllProcess] = useState([]);
 
  const[allScraps,setAllScaps]=useState([]);
  const[scrapData,setScrapData]=useState([]);
  const [allprocessdata, setAllProcessData] = useState([]);
  const [processdata, setProcessData] = useState([]);
  const [factoryData, setFactoryData] = useState([]);
  const [allFactoryData, setAllFactoryData] = useState([]);
  const [selectedProcessNameScrap,setSelectedProcessNameScrap]=useState(null);
  const [selectedItemNameScrap,setSelectedItemNameScrap]=useState(null);
  const [selectedLocationNameScrap,setSelectedLocationNameScrap]=useState(null);
  

  const [selectedItemType, setSelectedItemType] = useState(null); // State to store the selected item type

  let token; 
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
     
    }
  const openFirstModal = () => setOpenFirstModal(true);
  const closeFirstModal = () => setOpenFirstModal(false);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch(
          `${Domain}/items`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await response.json();
        

        setItems(data);
        setAllItems(data);

  
      } catch (error) {
        toast.error("Failed to fetch inventory data.");
      }
    };

    const fetchAllProcess = async () => {
      try {
        const response = await fetch(
          `${Domain}/processes`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await response.json();
        

        setProcessData(data);
        setAllProcessData(data);

  
      } catch (error) {
        toast.error("Failed to fetch inventory data.");
      }
    };

    const fetchAllFactories = async () => {
      try {
        const response = await fetch(
          `${Domain}/factories`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await response.json();

        

        setFactoryData(data);
        setAllFactoryData(data);

  
      } catch (error) {
        console.log("eeror",error);
        toast.error("Failed to fetch factories data.");
      }
    };








    const fetchInventoryData = async () => {
      try {
        const response = await fetch(
          `${Domain}/dashboard/inventory/aggregate`,
          {
            headers: {
              Authorization: token,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await response.json();

        setInventoryData(data);

        setAllInventoryData(data);
      } catch (error) {
        toast.error("Failed to fetch inventory data.");
      }
    };

    const fetchInventoryDataProcess = async () => {
      try {
        const response = await fetch(
          `${Domain}/dashboard/inventory/process`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inventory data");
        }

        const data = await response.json();
      
        setSearchResultss(data);
        setAllProcess(data);
 
 
       

        
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };
    const fetchDataScrap = async () => {
      try {
        const response = await fetch(
          `${Domain}/dashboard/all-scraps`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inventory data");
        }

        const data = await response.json();
        const filteredData = data.filter(item => item.scrap_type !== null);
        setScrap(filteredData);
        setAllScaps(filteredData);  
        setScrapData(filteredData);
    


     
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
    fetchAllItems(),
    fetchInventoryDataProcess();
    fetchDataScrap();
    fetchAllProcess();
    fetchAllFactories();
  }, []);

  useEffect(() => {
   
  }, [searchTerm]);

  useEffect(() => {
   
  }, [selectedProcess]);
  const handleItemTypeSelect = async (type) => {
    // Set the selected item type
    setSelectedItemType(type);

    // Make an API call to fetch items based on the selected type
    try {
      const response = await fetch(
        `${Domain}/items/search/aggregate/${type}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();

   

      setSellItems(data);
      const itemNames = data.map((item) => item.internal_item_name);

      const filteredData = allInventoryData.filter((item) =>
        itemNames.includes(item.item_name)
      );
      setInventoryData(filteredData);
      // Handle the fetched items data as needed
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleItemTypeSelectProcess = async (type) => {
    // Set the selected item type
    setSelectedProcess(type);

    // Make an API call to fetch items based on the selected type
    try {
      const response = await fetch(
        `${Domain}/items/search/inventory/${type}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();

   
  

      const itemNames = data.map((item) => item.itemName);

      const filteredData = allprocess.filter((item) =>
        itemNames.includes(item.Item.internal_item_name)
      );

      setsellItemsProcess(data);
      setSearchResultss(filteredData);
      // Handle the fetched items data as needed
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleItemTypeSelectScrap = async (scrapname, processName1) => {
    // Set the selected item type
    setSelectedProcess(processName1);


    // Make an API call to fetch items based on the selected type
    try {

      const baseUrl = `${Domain}/dashboard/scraps`;

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        scrap_type: scrapname.scrap_type, // Replace 'your_scrap_type' with the actual scrap type
        name: processName, // Replace 'your_factory_name' with the actual factory name
        process_name: processName1, // Replace 'your_process_name' with the actual process name
        internal_item_name: itemName, // Replace 'your_internal_item_name' with the actual internal item name
      });


      // Combine the base URL with the query parameters
      const apiUrl = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: token,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();

     

      const itemNames = data.map((item) => item.scrap_type);


      

      setsellItemsProcess(data);

      setScrapData(data);



     
      // Handle the fetched items data as needed
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const formatUpdatedAt = (updatedAt) => {
    const date = new Date(updatedAt);
    return date.toLocaleString(); // Adjust locale and options as needed
  };

  const handleItemTypeProcessSelectProcess = async (type) => {
    // Set the selected item type
    setSelectedItemType(type);

    // Make an API call to fetch items based on the selected type
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${Domain}/items/items-by-process-name/${type}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      console.log("rrr",data);

   
    
      const process = data.processName;
      console.log("process",process);
   

      const itemNames = data.items.map((item) => item.internal_item_name);
     
     
      const filteredData = allprocess.filter(
        (item) =>
          itemNames.includes(item?.Item?.internal_item_name ?? "") &&
          item?.Process?.process_name === type
      );
     
      setSearchResultss(filteredData);
      // Handle the fetched items data as needed
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleRemoveFilters = () => {
    setSelectedProcessNameScrap(null);
    setSelectedItemNameScrap(null);
    setSelectedLocationNameScrap(null);
    setScrapData(allScraps)
    if (toggleView === 'aggregate') {
      setInventoryData(allInventoryData);
    }else if (toggleView === 'process') {
      setSearchResultss(allprocess);
    }
    
  };
  const handleItemChange = (selectedItemId) => {

    const dropdownSelectedItem = items.find((item) => item.id == selectedItemId);
 
    setSelectedItem(dropdownSelectedItem);
  
    if (dropdownSelectedItem) {
      const filteredInventoryData = inventoryData.filter((item) => item.item_name.toLowerCase() === dropdownSelectedItem.internal_item_name.toLowerCase());
 
      setInventoryData(filteredInventoryData);
    } else {
    
      setInventoryData(allInventoryData);
    }
   

   
  };

  const handleItemChangeProcess = (selectedItemId) => {


    const dropdownSelectedItem = items.find((item) => item.id == selectedItemId);

    setSelectedItem(dropdownSelectedItem);
   
    if (dropdownSelectedItem) {
     
      const filteredProcessData = searchResultss.filter((item) => item.Item.internal_item_name.toLowerCase() === dropdownSelectedItem.internal_item_name.toLowerCase());
    
      setSearchResultss(filteredProcessData);
    } else {
      
      setSearchResultss(allprocess);
    }
   

   
  };


  const handleItemChange2 = (selectedItemId) => {
    /*
    const q = selectedItemId;


    const dropdownSelectedItem = scrap.find((item) => item.scrap_type === q);



     <TableCell>{selectedProcess}</TableCell>
                    <TableCell>{itemName}</TableCell>
                    <TableCell>{processName}</TableCell>

    setScrap(dropdownSelectedItem ? [dropdownSelectedItem] : []);
    setSearchTerm(selectedItemId ? selectedItemId : "");
   
    */
    const dropdownSelectedItem = scrap.find((item) => item.scrap_type == selectedItemId);
 
    setselectedScrap(dropdownSelectedItem);
   // setSearchTerm(dropdownSelectedItem.scrap_type);
   
    if (dropdownSelectedItem) {
     
      const filteredProcessData = allScraps.filter((item) => item.scrap_type === selectedItemId);
    
      setScrapData(filteredProcessData)
    } else {
     
      setScrapData(allScraps);
      // setSelectedProcess("");
      // setItemName("");
      // setProcessName("");
    }
   

  };


  const handleProcessScrap = (searchTerm, locationName) => {
    setProcessName(locationName);
    // Call your API endpoint with the selected item description
    fetchScrapByProcess(searchTerm, locationName);
  };

  const fetchScrapByProcess = async (searchTerm, locationName) => {
    try {
     
      const baseUrl = `${Domain}/dashboard/scraps`;

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        scrap_type: searchTerm.scrap_type, // Replace 'your_scrap_type' with the actual scrap type
        name: locationName, // Replace 'your_factory_name' with the actual factory name
        process_name: selectedProcess, // Replace 'your_process_name' with the actual process name
        internal_item_name: itemName, // Replace 'your_internal_item_name' with the actual internal item name
      });
    

      // Combine the base URL with the query parameters
      const apiUrl = `${baseUrl}?${queryParams.toString()}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: token,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
   
      setScrapData(data);
      /*
      const itemNames = data.items.map(item => item.internal_item_name);
      const filteredData = allInventoryData.filter(item => itemNames.includes(item.item_name));
      setInventoryData(filteredData);
      */

      // Handle the response data as needed
    } catch (error) {
      console.error("Error searching items:", error);
      // Handle error
    }
  };

  const handleItemClickScrap = (processName, itemName, locationName) => {
    setSelectedProcessNameScrap(processName);
    setSelectedItemNameScrap(itemName);
    setSelectedLocationNameScrap(locationName);
  
    try {
      // Filter scrapData based on processName, itemName, and locationName
      const filteredData = allScraps.filter(item => {
        const isProcessMatch = processName ? item?.Process?.process_name === processName : true;
        const isItemMatch = itemName ? item?.Item?.internal_item_name === itemName : true;
        const isLocationMatch = locationName ? item?.Factory?.name === locationName : true;
  
        return isProcessMatch && isItemMatch && isLocationMatch;
      });
  
      // Update state or perform further actions with filteredData
      console.log("Filtered Data:", filteredData);
  
      // Example: Update state with filtered data
      setScrapData(filteredData);
  
    } catch (error) {
      console.error("Error filtering data:", error);
      // Handle error state or show error message to the user
    }
  };
  

  const fetchScrapByName = async (searchTerm, locationName) => {
    try {
      
      const baseUrl = `${Domain}/dashboard/scraps`;

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        scrap_type: searchTerm.scrap_type, // Replace 'your_scrap_type' with the actual scrap type
        name: locationName, // Replace 'your_factory_name' with the actual factory name
        process_name: selectedProcess, // Replace 'your_process_name' with the actual process name
        internal_item_name: itemName, // Replace 'your_internal_item_name' with the actual internal item name
      });


      // Combine the base URL with the query parameters
      const apiUrl = `${baseUrl}?${queryParams.toString()}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: token,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
   
      setScrapData(data);
      /*
      const itemNames = data.items.map(item => item.internal_item_name);
      const filteredData = allInventoryData.filter(item => itemNames.includes(item.item_name));
      setInventoryData(filteredData);
      */

      // Handle the response data as needed
    } catch (error) {
      console.error("Error searching items:", error);
      // Handle error
    }
  };

  // const handleItemClick = (itemDescription) => {
  //   setSelectedItemDescription(itemDescription);
  //   // Call your API endpoint with the selected item description
  //   fetchItemsByDescription(itemDescription);
  // };

  // const fetchItemsByDescription = async (itemDescription) => {
  //   try {
  //     const response = await fetch(
  //       `${Domain}/items/search/items-by-id/aggregate/?item_description=${encodeURIComponent(
  //         itemDescription
  //       )}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: token,
  //           "Cache-Control": "no-cache",
  //           "Content-Type": "application/json",
  //           "Cache-Control": "no-cache",
  //           Pragma: "no-cache",
  //           Expires: "0",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch search results");
  //     }

  //     const data = await response.json();
  //     const itemNames = data.items.map((item) => item.internal_item_name);
  //     const filteredData = allInventoryData.filter((item) =>
  //       itemNames.includes(item.item_name)
  //     );
  //     setInventoryData(filteredData);

  //     // Handle the response data as needed
  //   } catch (error) {
  //     console.error("Error searching items:", error);
  //     // Handle error
  //   }
  // };


  const handleItemClickProcess = (itemDescription) => {
    setSelectedItemDescription(itemDescription);
    // Call your API endpoint with the selected item description
    fetchItemsByDescription1(itemDescription);
  };

  const fetchItemsByDescription1 = async (itemDescription) => {
    try {
      const response = await fetch(
        `${Domain}/items/search/items-by-id/process?item_description=${encodeURIComponent(
          itemDescription
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      const itemNames = data.items.map((item) => item.internal_item_name);
   

      const filteredData = allprocess.filter((item) =>
        itemNames.includes(item.Item.internal_item_name)
      );
     
      setSearchResultss(filteredData);

      // Handle the response data as needed
    } catch (error) {
      console.error("Error searching items:", error);
      // Handle error
    }
  };

  const handleItemColor = (color) => {
    // Filter items based on the color
    const filteredItems = allInventoryData.filter((item) => {
      switch (color.toLowerCase()) {
        case "red":
          // Sell: pending SO qty > current qty + pending PLO qty
          // Purchase: current qty = 0, pending PO qty = 0, min buffer > 0
          return (
            item.pending_so_qty > item.total_qty + item.pending_po_qty ||
            (item.total_qty === 0 &&
              item.pending_po_qty === 0 &&
              item.min_buffer > 0)
          );
        case "yellow":
          // Sell: pending SO qty + min buffer > current + pending PLO qty
          // Purchase: min buffer > current qty + pending PO qty
          return (
            item.pending_so_qty + item.min_buffer >
              item.total_qty + item.pending_po_qty ||
            item.min_buffer > item.total_qty + item.pending_po_qty
          );
        case "green":
          return (
            item.total_qty > item.pending_so_qty + item.min_buffer ||
            item.total_qty > item.pending_po_qty + item.min_buffer
          );
        default:
          return false;
      }
    });

 
    const itemNames = filteredItems.map((item) => item.item_name);


    const filteredData1 = allInventoryData.filter((item) =>
      itemNames.includes(item.item_name)
    );
    setInventoryData(filteredData1);

   
  


  };

  const handleRowClick = async (item_id) => {
    try {
      console.log("i am heree");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${Domain}/dashboard/item-location?item_id=${item_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      console.log("dataaaaa", data);
  
      // Summarize quantities by location_name
      const summarizedData = data.reduce((acc, item) => {
        if (item.Location.name) {
          if (!acc[item.Location.name]) {
            acc[item.Location.name] = {
              ...item,
              total_qty: parseFloat(item.qty),
            };
          } else {
            acc[item.Location.name].total_qty += parseFloat(item.qty);
          }
        }
        return acc;
      }, {});
  
      const summarizedArray = Object.values(summarizedData);

      console.log("summarizedArray", summarizedArray)
  
      setItemLocationData(summarizedArray);
      openFirstModal();
    } catch (error) {
      toast.error("Failed to fetch item location data.");
    }
  };
  






  return (
    <>
      <NavbarAdmin />
      <div className="flex justify-center  bg-black">
        <h1 className="p-2 text-center text-white font-bold text-3xl mb-3">
          Inventory View
        </h1>
      </div>
      <div className="lg:p-8 p-4 bg-black">
        <div className="flex justify-center mb-4  ">
          <div className="flex gap-20 bg-gray-800 p-4 rounded-lg ">
            <ToggleButton
              text="Aggregate"
              active={toggleView === "aggregate"}
              onClick={() => setToggleView("aggregate")}
              className="w-40"
            />
            <ToggleButton
              text="Process"
              active={toggleView === "process"}
              onClick={() => setToggleView("process")}
            />
            <ToggleButton
              text="Scrap"
              active={toggleView === "scrap"}
              onClick={() => setToggleView("scrap")}
            />
          </div>
        </div>
        {toggleView === "aggregate" && (
          <Card className="p-4 bg-gray-900">
            <h1 className="p-2 text-center text-white font-bold text-3xl mb-3"></h1>
            <div className="flex justify-center mb-4 gap-11">
              <Autocomplete
                label="Item Name"
                placeholder="Select Item Name"
                defaultItems={items}
             
                onSelectionChange={handleItemChange}
                className="lg:w-2/5 w-full"
              >
                {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.internal_item_name}
                    </AutocompleteItem>
                  )}
              </Autocomplete>

              {/* Item Type dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>Item Type</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleItemTypeSelect("sell")}>
                    sell
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleItemTypeSelect("purchase")}
                  >
                    purchase
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleItemTypeSelect("component")}
                  >
                    component
                  </DropdownItem>
                  {/* Add more item types as DropdownItems */}
                </DropdownMenu>
              </Dropdown>

              {/* Item Tag dropdown */}
              {/* <Dropdown>
                <DropdownTrigger>
                  <Button>Item Tag</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleItemClick("This is Widget A")}
                  >
                    This is Widget A
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleItemClick("This is Widget B")}
                  >
                    This is Widget B
                  </DropdownItem>
                 
                </DropdownMenu>
              </Dropdown> */}

              {/* Item Color dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>Item Color</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleItemColor("red")}>
                    red
                  </DropdownItem>
                  <DropdownItem onClick={() => handleItemColor("Yellow")}>
                    yellow
                  </DropdownItem>
                  <DropdownItem onClick={() => handleItemColor("green")}>
                    green
                  </DropdownItem>
                  {/* Add more colors as DropdownItems */}
                </DropdownMenu>
              </Dropdown>
              <button
      className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 h-10 text-sm"
      onClick={handleRemoveFilters}
    >
      Remove Filters
    </button>
            </div>

            <Table
              aria-label="Aggregate Inventory Table"
              className="p-2 mt-3 mb-4"
            >
              <TableHeader>
                <TableColumn>ITEM NAME</TableColumn>
                <TableColumn>TOTAL QTY</TableColumn>
                <TableColumn>MIN BUFFER</TableColumn>
                <TableColumn>PENDING PO QTY</TableColumn>
                <TableColumn>PENDING SO QTY</TableColumn>
                <TableColumn>APPROVED QTY</TableColumn>
                <TableColumn>RECEIVED QTY</TableColumn>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(item.item_id)}
                    className="cursor-pointer"
                  >
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.total_qty}</TableCell>
                    <TableCell>{item.min_buffer}</TableCell>
                    <TableCell>{item.pending_po_qty}</TableCell>
                    <TableCell>{item.pending_so_qty}</TableCell>
                    <TableCell>{item.approved_qty}</TableCell>
                    <TableCell>{item.received_qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
        {toggleView === "process" && (
          <Card className="p-4 bg-gray-900">
            <h1 className="p-2 text-center text-white font-bold text-3xl mb-3"></h1>
            <div className="flex justify-center mb-4 gap-11">
            <Autocomplete
                label="Item Name"
                placeholder="Select Item Name"
                defaultItems={items}
             
                onSelectionChange={handleItemChangeProcess}
                className="lg:w-2/5 w-full"
              >
                {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.internal_item_name}
                    </AutocompleteItem>
                  )}
              </Autocomplete>

              {/* Item Type dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>Item Type</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleItemTypeSelectProcess("sell")}
                  >
                    sell
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleItemTypeSelectProcess("purchase")}
                  >
                    purchase
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleItemTypeSelectProcess("component")}
                  >
                    component
                  </DropdownItem>

                  {/* Add more item types as DropdownItems */}
                </DropdownMenu>
              </Dropdown>

              {/* Item Tag dropdown
              <Dropdown>
                <DropdownTrigger>
                  <Button>Item Tag</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleItemClickProcess("This is Widget A")}
                  >
                    This is Widget A
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleItemClickProcess("This is Widget B")}
                  >
                    This is Widget B
                  </DropdownItem>
                
                </DropdownMenu>
              </Dropdown> */}

              {/* Item Color dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>Process</Button>
                </DropdownTrigger>
                <DropdownMenu>
                {allprocessdata?.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() =>  handleItemTypeProcessSelectProcess( item.process_name)}
          >
            {item.process_name}
          </DropdownItem>
          
        ))}
     
               

                  {/* Add more colors as DropdownItems */}
                </DropdownMenu>
              </Dropdown>
              <button
      className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 h-10 text-sm"
      onClick={handleRemoveFilters}
    >
      Remove Filters
    </button>
            </div>
            {/* Process component or content */}
            <Table
              aria-label="Aggregate Inventory Table"
              className="p-2 mt-3 mb-4"
            >
              <TableHeader>
                <TableColumn>ITEM NAME</TableColumn>
                <TableColumn>Process</TableColumn>
                <TableColumn>current qty</TableColumn>
                <TableColumn>last updated at</TableColumn>
                <TableColumn>last updated by</TableColumn>
              </TableHeader>
              <TableBody>
              
                {searchResultss.map((item, index) => (
                  <TableRow
                    key={index}
                   
                    className="cursor-pointer"
                  >
                    <TableCell>{item.Item.internal_item_name}</TableCell>
                    <TableCell>{item?.Process?.process_name ?? "N/A"}</TableCell>

                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{formatUpdatedAt(item.updatedAt)}</TableCell>
                    {/* Assuming you have a way to retrieve the last_updated_by_name */}
                    <TableCell>{item.Item.User.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
        {toggleView === "scrap" && (
          <Card className="p-4 bg-gray-900">
          

            <div className="flex justify-center mb-4 gap-11">
              <Autocomplete
                label="Scrap Type"
                placeholder="Search by  Scrap type"
                value={selectedScrap}
                onSelectionChange={(id) => handleItemChange2(id)}
                className="lg:w-2/5 w-full"
              >
                {scrap.map((item) => (
                  <AutocompleteItem
                    key={item.scrap_type}
                    value={item.scrap_type}
                  >
                    {item.scrap_type}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              {/* Item Type dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>Process</Button>
                </DropdownTrigger>
                <DropdownMenu>
                {allprocessdata?.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleItemClickScrap(item.process_name,selectedItemNameScrap,selectedLocationNameScrap)}
          >
            {item.process_name}
          </DropdownItem>
        ))}
                  {/* Add more item types as DropdownItems */}
                </DropdownMenu>
              </Dropdown>

              {/* Item Tag dropdown */}
              <Dropdown>
      <DropdownTrigger>
        <Button>Item</Button>
      </DropdownTrigger>
      <DropdownMenu>
        {allItems.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleItemClickScrap( selectedProcessNameScrap,item.internal_item_name,selectedLocationNameScrap)}
          >
            {item.internal_item_name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>

              {/* Item Color dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>Location</Button>
                </DropdownTrigger>
                <DropdownMenu>
                { allFactoryData?.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleItemClickScrap(selectedProcessNameScrap, selectedItemNameScrap,item.name)}
          >
            {item.name}
          </DropdownItem>
        ))}

                  {/* Add more colors as DropdownItems */}
                </DropdownMenu>
              </Dropdown>
              {/* Remove Filters Button */}
    <button
      className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 h-10 text-sm"
      onClick={handleRemoveFilters}
    >
      Remove Filters
    </button>

            </div>
            {/* Scrap component or content */}
            <Table
              aria-label="Aggregate Inventory Table"
              className="p-2 mt-3 mb-4"
            >
              <TableHeader>
                <TableColumn>Scrap type</TableColumn>
                <TableColumn>Process</TableColumn>
                <TableColumn>Item</TableColumn>
                <TableColumn>Location</TableColumn>
                <TableColumn>total_qty</TableColumn>
              </TableHeader>
              <TableBody>
                {scrapData.map((item, index) => (
                  <TableRow
                    key={index}
                  
                    className="cursor-pointer"
                  >
                    <TableCell>{item.scrap_type}</TableCell>
                    <TableCell>{item.Process?.process_name}</TableCell>
                    <TableCell>{item.Item?.internal_item_name}</TableCell>
                    <TableCell>{item?.Factory?.name}</TableCell>
                    
                    <TableCell>{item.total_qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
      <Modal isOpen={isOpenFirstModal} onClose={closeFirstModal}>
        <ModalContent>
          <ModalHeader>Item Location Data</ModalHeader>
          <ModalBody>
            <Table aria-label="Item Location Data" className="p-2 mt-3 mb-4">
              <TableHeader>
                <TableColumn>Location</TableColumn>
                <TableColumn>Quantity</TableColumn>
              </TableHeader>
              <TableBody>
                {itemLocationData.map((location, index) => (
                  <TableRow key={index}>
                    <TableCell>{location.Location.name}</TableCell>
                    <TableCell>{location.total_qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

const ToggleButton = ({ text, active, onClick }) => (
  <button
    className={`px-4 py-2 rounded-lg font-bold ${
      active ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

export default Page;
