// MainComponent.js
"use client";
import React, { useEffect, useState } from "react";
import fieldTypes from "./fieldTypes"; // Adjust the path as needed
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
import { List, ListItem } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { Domain } from "@/Domain";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa";

import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";

const MainComponent = () => {
  const [items, setItems] = useState([]);
  const [allitems, setAllItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [allcustomers, setAllCustomers] = useState([]);
  const [boms, setBoms] = useState([]);
  const [allboms, setAllBoms] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [allprocessSteps, setAllProcessSteps] = useState([]);
  const [processes, setProcess] = useState(null);
  const [allprocesses, setAllProcess] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [allsuppliers, setAllSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [alllocations, setAllLocations] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [alltransporters, setAllTransporters] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [allvendors, setAllVendors] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [alltaxes, setAllTaxes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("items");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [isDialogOpenCreate, setIsDialogOpenCreate] = useState(false);
  const [formDataCreate, setFormDataCreate] = useState({});
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [factory, setFactory] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (selectedCategory === "items") {
      fetchItems();
    } else if (selectedCategory === "customers") {
      fetchCustomers();
    } else if (selectedCategory === "boms") {
      fetchBoms();
    } else if (selectedCategory === "processSteps") {
      fetchProcessSteps();
    } else if (selectedCategory === "process") {
      fetchProcess();
    } else if (selectedCategory === "suppliers") {
      fetchSuppliers();
    } else if (selectedCategory === "locations") {
      fetchLocations();
    } else if (selectedCategory === "transporters") {
      fetchTransporters();
      fetchFactory();
    } else if (selectedCategory === "vendors") {
      fetchVendors();
    } else if (selectedCategory === "taxes") {
      fetchTax();
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchItems();
    fetchCustomers();
    fetchBoms();
    fetchProcessSteps();
    fetchProcess();
    fetchSuppliers();
    fetchLocations();
    fetchTransporters();
    fetchVendors();
    fetchTax();
    fetchFactory();
  }, []);

  useEffect(() => {
    console.log("error", formErrors);
  }, [formErrors]);

  useEffect(() => {
    // Update autocomplete items based on selected category
    if (selectedCategory === "customers") {
      setAutocompleteItems(customers);
    } else if (selectedCategory === "items") {
      setAutocompleteItems(items);
    } else if (selectedCategory === "boms") {
      setAutocompleteItems(items);
    } else if (selectedCategory === "processSteps") {
      setAutocompleteItems(items);
    } else if (selectedCategory === "process") {
      setAutocompleteItems(process);
    } else if (selectedCategory === "suppliers") {
      setAutocompleteItems(suppliers);
    } else if (selectedCategory === "locations") {
      setAutocompleteItems(locations);
    } else if (selectedCategory === "transporters") {
      setAutocompleteItems(transporters);
    } else if (selectedCategory === "vendors") {
      setAutocompleteItems(vendors);
    } else if (selectedCategory === "taxes") {
      setAutocompleteItems(taxes);
    }
  }, [
    selectedCategory,
    customers,
    items,
    boms,
    processSteps,
    suppliers,
    process,
    locations,
    vendors,
    taxes,
  ]);

  const handleCreateClick = (category) => {
    setSelectedCategory(category);
  
    setIsDialogOpenCreate(true);
    setFormDataCreate({});
  };

  const requiredFields = {
    customers: [
      "name",
      "email_id",
      "address_type",
      "phone_number",
      "address",
      "state",
      "city",
      "country",
      "gstin",
      "payment_terms",
    ],
    items: ["uom", "supplier_item_name"],
    suppliers: [
      "name",
      "address_type",
      "address",
      "state",
      "country",
      "gstin",
      "payment_terms",
      "phone_number",
      "email_id",
    ],
    boms: ["item_name", "component_name", "quantity"],
    processSteps: ["process_id", "item_id", "sequence"],
    locations: ["type", "factory_name", "name"],
    transporters: ["phone_number", "name"],
    vendors: ["type", "name", "address", "state", "country", "gstin"],
    taxes: ["percentage", "name"],

    // Add other categories and their required fields here
  };

  const itemFieldOptions = ["sell", "purchase", "component"];
  const locationFieldOptions = [
    "PUTAWAY",
    "GRN",
    "TRANSIT",
    "INSPECTION",
    "PACKING",
    "SCRAP",
  ];
  const vendorFieldOptions = ["internal", "external"];

  const validateFormData = (category, formData) => {
    const errors = {};
    const fields = requiredFields[category] || [];
   
  

    fields.forEach((field) => {
   
      if (!formData[field]) {
        errors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    return errors;
  };

  const handleInputChange = (e, column) => {

    setFormDataCreate({
      ...formDataCreate,
      [column]: e.target.value,
    });
    if (fieldName === "Internal_Item_Name") {
      formDataCreate["supplier_item_name"] = value;
    }
    setFormErrors({
      ...formErrors,
      [column]: "",
    });
  };

  const handleSubmit = async () => {
    try {

      const errors = validateFormData(selectedCategory, formDataCreate);
      const formDataCreateWithNumbers = {
        ...formDataCreate,
        tax_1: formDataCreate.tax_1 ? Number(formDataCreate.tax_1) : null,
        tax_2: formDataCreate.tax_2 ? Number(formDataCreate.tax_2) : null,
      };

      const categoryFields = fieldTypes[selectedCategory];

      const newErrors = {};

      for (const field in categoryFields) {
        const value = formDataCreate[field];
        const expectedType = categoryFields[field];
        const isRequired = requiredFields[selectedCategory]?.includes(
          field.toLowerCase()
        );

        // Skip validation if the field is not required and is empty
        if (!isRequired && (value === undefined || value === "")) {
          continue;
        }
       

        if (expectedType === "string" && typeof value !== "string") {
       
          newErrors[field.toLowerCase()] = `This field should be a string.`;
        } else if (expectedType === "number" && isNaN(Number(value))) {
     
          newErrors[field.toLowerCase()] = `This field should be a number.`;
        } else if (
          expectedType === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          newErrors[
            field.toLowerCase()
          ] = `This field should be a valid email address.`;
        }
        // Add other datatype checks as needed
      }
      setFormErrors(newErrors);

   

      // If there are errors, prevent form submission
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      if (Object.keys(newErrors).length > 0) {
        return; // Prevent form submission if there are errors
      }

      let endpoint = "";
     
      switch (selectedCategory) {
        case "customers":
          endpoint = `${Domain}/customers`;
          break;
        case "items":
          endpoint = `${Domain}/items`;
         
          const taxOne = alltaxes.find(
            (tax) => tax.name === formDataCreate.tax_1
          );
          const taxTwo = alltaxes.find(
            (tax) => tax.name === formDataCreate.tax_2
          );
         

          // Extract the tax IDs from the tax objects
          // const taxOneId = taxOne ? taxOne.id : null;
          // const taxTwoId = taxTwo ? taxTwo.id : null;
        

          // // Include tax IDs in the formDataCreate
          // formDataCreate.tax_1 = taxOneId;
          // formDataCreate.tax_2 = taxTwoId;

          break;
        case "suppliers":
          endpoint = `${Domain}/suppliers`;
          break;
        case "transporters":
          endpoint = `${Domain}/transporter`;
          break;
        case "vendors":
          endpoint = `${Domain}/vendors`;
          break;
        case "taxes":
          endpoint = `${Domain}/tax`;
          break;
        case "boms":
          endpoint = `${Domain}/bom`;
          const item = allitems.find(
            (item) =>
              item.internal_item_name === formDataCreate.internal_item_name
          );
        
          const component = allitems.find(
            (item) => item.internal_item_name === formDataCreate.component_name
          );
          const itemId = item ? item.id : null;
          const componentId = component ? component.id : null;
        
          formDataCreate.item_id = itemId;
          formDataCreate.component_id = componentId;

          // // Remove the old keys from formDataCreate if needed
          // delete formDataCreate.internal_item_name;
          // delete formDataCreate.component_name;

          break;
        case "processSteps":
          endpoint = `${Domain}/processSteps`;
          // const items = allitems.find(
          //   (item) =>
          //     item.internal_item_name === formDataCreate.item_name
          // );
         

          // const itemsId = item ? item.id : null;

        

          // formDataCreate.item_id = itemsId;

          // Remove the old keys from formDataCreate if needed
          // delete formDataCreate.internal_item_name;
          // delete formDataCreate.component_name;
          break;
        case "locations":
        

          endpoint = `${Domain}/location`;
          break;
        // Add more cases for other categories
        default:
          throw new Error("Invalid category");
      }

      const token = localStorage.getItem("token");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataCreate),
      });
  

      if (response.ok) {
        // Handle successful response
        console.log(`${selectedCategory} created successfully.`);

        switch (selectedCategory) {
          case "customers":
            fetchCustomers();
            break;
          case "items":
            fetchItems();
            alert("Redirecting to create the BOM for the item");
            // Prepare to create BOM

            setIsDialogOpenCreate(true);
            if (isDialogOpenCreate == true) {
              setSelectedCategory("boms");
       
            }
            const itemName = formDataCreate.internal_item_name || "";
            const componentName = formDataCreate.internal_item_name || ""; // Get component name from formDataCreate or set to empty string if undefined

            // Update formDataCreate with item name and component name for bom
            setFormDataCreate({
              ...formDataCreate,
              item_name: itemName,
              component_name: componentName,
            });

            break;
          case "suppliers":
            fetchSuppliers();
            break;
          case "transporters":
            fetchTransporters();
            break;
          case "vendors":
            fetchVendors();
            break;
          case "taxes":
            fetchTax();
            break;
          case "boms":
            fetchBoms();
            alert("Redirecting to create the process step for the BOM");
            setIsDialogOpenCreate(true);
            if (isDialogOpenCreate === true) {
              setSelectedCategory("processSteps");
            }

            // Prepare to create process step

            break;
          case "processSteps":
            fetchProcessSteps();
            break;
          case "locations":
            fetchLocations();
            break;

          // Add more cases for other categories
          default:
            break;
        }

        // Optionally refresh data or give feedback to the user
      } else {
        // Handle error response
        console.error(`Failed to create ${selectedCategory}.`);
      }
    } catch (error) {
      console.error(`Error creating ${selectedCategory}:`, error);
    }

    if (selectedCategory != "items" && selectedCategory != "boms") {
      setIsDialogOpenCreate(false);
    }

    // if (selectedCategory === "items") {
    //   alert("Redirecting to create the bOM of the item")
    //   setIsDialogOpenCreate(true);
    // }

    // if (isDialogOpenCreate === true) {
    //   setSelectedCategory("boms");
    //   const itemName = formDataCreate.internal_item_name || ""; // Get item name from formDataCreate or set to empty string if undefined
    //   const componentName = formDataCreate.internal_item_name || ""; // Get component name from formDataCreate or set to empty string if undefined

    //   // Update formDataCreate with item name and component name for bom
    //   setFormDataCreate({
    //     ...formDataCreate,
    //     item_name: itemName,
    //     component_name: componentName,
    //   });
    // }
  };
  const uomFieldOptions = ["Kgs", "litres"];

  const handleDropdownChange = (selectedItemId, column) => {
    console.log("Selected Item ID:", selectedItemId);
    setFormDataCreate((prevFormData) => ({
      ...prevFormData,
      [column === "item name" ? "item_id" : "component_id"]: selectedItemId,
    }));
  };

  const handleProcessDropdownChange = (selectedItemId, column) => {
   
    const selectedProcess = allprocesses.find(
      (process) => process.id === parseInt(selectedItemId)
    );
   

    setFormDataCreate((prevFormData) => ({
      ...prevFormData,
      process_id: selectedProcess.id,
    }));
   
  };

  const handleFactoryDropdownChange = (selectedFactoryId) => {
    console.log("selectedfactory", selectedFactoryId);
    setFormDataCreate((prevFormData) => ({
      ...prevFormData,
      factory_id: selectedFactoryId,
    }));
  };

  const renderFormFields = () => {
    let columns = [];
    switch (selectedCategory) {
      case "customers":
        columns = customerColumns;
        break;
      case "items":
        columns = itemColumns;
        break;
      case "suppliers":
        columns = supplierColumns;
        break;
      case "transporters":
        columns = transporterColumns;
        break;
      case "vendors":
        columns = vendorColumns;
        break;
      case "taxes":
        columns = taxColumns;
        break;
      case "boms":
        columns = bomColumns;
        break;
      case "processSteps":
        columns = processStepColumns;
        break;
      case "locations":
        columns = locationColumns;
        break;
      // Add more cases for other categories
      default:
        break;
    }

    return columns.map((column, index) => {
      if (column.toLowerCase() !== "action") {
        const isRequired = requiredFields[selectedCategory]?.includes(
          column.toLowerCase()
        );

        return (
          <div key={index} className="flex items-center gap-1 m-1">
            <label>
              {column}
              {isRequired && <span className="text-red-500">*</span>}
            </label>

            {(selectedCategory === "items" || selectedCategory === "vendors") &&
            (column.toLowerCase() === "type" ||
              column.toLowerCase().startsWith("tax_")) ? (
              <select
                className="p-0.5 border-2 rounded-md"
                name={column.toLowerCase()}
                value={formDataCreate[column.toLowerCase()] || ""}
                onChange={(e) => handleInputChange(e, column.toLowerCase())}
              >
                <option value="">Select an option</option>
                {column.toLowerCase() === "type"
                  ? itemFieldOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))
                  : selectedCategory === "vendors" &&
                    column.toLowerCase() === "type"
                  ? vendorFieldOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))
                  : alltaxes.map((tax) => (
                      <option key={tax.id} value={tax.id}>
                        {tax.name}
                      </option>
                    ))}
              </select>
            ) : selectedCategory === "items" &&
              column.toLowerCase() === "uom" ? (
              <select
                className="p-0.5 border-2 rounded-md"
                name={column.toLowerCase()}
                value={formDataCreate[column.toLowerCase()] || ""}
                onChange={(e) => handleInputChange(e, column.toLowerCase())}
              >
                {/* Map over the UOM options */}
                {uomFieldOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : selectedCategory === "processSteps" &&
              column.toLowerCase() === "process_name" ? (
              <Autocomplete
                label={column}
                placeholder={`Select ${column}`}
                defaultItems={allprocesses} // Assuming processData contains the process options
                className="w-full"
                onSelectionChange={(selectedItemId) =>
                  handleProcessDropdownChange(
                    selectedItemId,
                    column.toLowerCase()
                  )
                }
              >
                {(process) => (
                  <AutocompleteItem key={process.id}>
                    {process.process_name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            ) : ["Item Name", "Component Name"].includes(column) ? (
              <Autocomplete
                label={column}
                placeholder={`Select ${column}`}
                defaultItems={items}
                className="w-full"
                onSelectionChange={(selectedItemId) =>
                  handleDropdownChange(selectedItemId, column.toLowerCase())
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>
                    {item.internal_item_name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            ) : ["Process_Name"].includes(column) ? (
              <Autocomplete
                label={column}
                placeholder={`Select ${column}`}
                defaultItems={allprocesses}
                className="w-full"
                onSelectionChange={(selectedItemId) =>
                  handleProcessDropdownChange(
                    selectedItemId,
                    column.toLowerCase()
                  )
                }
              >
                {(process) => (
                  <AutocompleteItem key={process.id}>
                    {process.process_name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            ) : ["Factory_Name"].includes(column) ? (
              <Autocomplete
                label={column}
                placeholder={`Select ${column}`}
                defaultItems={factory}
                className="w-full"
                onSelectionChange={handleFactoryDropdownChange}
              >
                {(factory) => (
                  <AutocompleteItem key={factory.id}>
                    {factory.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            ) : (
              <>
                <input
                  className={`p-0.5 border-2 rounded-md ${
                    formErrors[column.toLowerCase()] ? "border-red-500" : ""
                  }`}
                  type="text"
                  name={column.toLowerCase()}
                  value={formDataCreate[column.toLowerCase()] || ""}
                  onChange={(e) => handleInputChange(e, column.toLowerCase())}
                />
                {formErrors[column.toLowerCase()] && (
                  <p className="text-red-500 text-sm">
                    {formErrors[column.toLowerCase()]}
                  </p>
                )}
              </>
            )}
          </div>
        );
      }
      return null;
    });
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/customers`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      data = sortByCreatedDate(data);
      setCustomers(data);
      setAllCustomers(data);

    
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

      let data = await response.json();
      data = sortByCreatedDate(data);
      if (data?.error) {
        toast.error(data.error);
      }
      setItems(data);
      setAllItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const fetchBoms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/bom`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setBoms(data);
      setAllBoms(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchProcessSteps = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/processSteps`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setProcessSteps(data);
      setAllProcessSteps(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const fetchProcess = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/processes`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setProcess(data);
      setAllProcess(data);
    } catch (error) {
      console.error("Error fetching items:", error);
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
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setSuppliers(data);
      setAllSuppliers(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/location`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setLocations(data);
      setAllLocations(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchTransporters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/transporter`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setTransporters(data);
      setAllTransporters(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/vendors`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setVendors(data);
      setAllVendors(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchTax = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/tax`, {
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
      }
      data = sortByCreatedDate(data);
      setTaxes(data);
      setAllTaxes(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchFactory = async () => {
    try {
    
      const token = localStorage.getItem("token");

      const response = await fetch(`${Domain}/factories`, {
        headers: {
          Authorization: token,
        },
      });

    
      let data = await response.json();
      data = sortByCreatedDate(data);

      if (data?.error) {
        toast.error(data.error);
      }

      setFactory(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  function sortByCreatedDate(array) {
    return array.sort((a, b) => {
      const dateA = new Date(b.updatedAt); // Use b.updatedAt for descending order
      const dateB = new Date(a.updatedAt); // Use a.updatedAt for descending order
      return dateA - dateB;
    });
  }

  const handleListItemClick = (category) => {
    setSelectedCategory(category);
  };

  const handleEditClick = (entityType, entity) => {

    setSelectedEntity({ type: entityType, data: entity });
    setUpdateData(entity);
    setIsDialogOpen(true);

  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async (entityType, updatedData) => {
    try {
      const errors = validateFormData(selectedCategory, updatedData);

      const categoryFields = fieldTypes[selectedCategory];

      const newErrors = {};

      for (const field in categoryFields) {
        const value = updatedData[field];
  
        const expectedType = categoryFields[field];
        const isRequired = requiredFields[selectedCategory]?.includes(
          field.toLowerCase()
        );


        // Skip validation if the field is not required and is empty
        if (!isRequired && (value === undefined || value === null)) {
          continue;
        }
       

        if (expectedType === "string" && typeof value !== "string") {
       
          newErrors[field.toLowerCase()] = `This field should be a string.`;
        } else if (expectedType === "number" && isNaN(Number(value))) {
        
          newErrors[field.toLowerCase()] = `This field should be a number.`;
        } else if (expectedType === "boolean" && typeof value !== "boolean") {
          newErrors[field.toLowerCase()] = `This field should be a boolean.`;
        } else if (
          expectedType === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          newErrors[
            field.toLowerCase()
          ] = `This field should be a valid email address.`;
        }
        // Add other datatype checks as needed
      }
      setFormErrors(newErrors);



      // If there are errors, prevent form submission
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      if (Object.keys(newErrors).length > 0) {
        return; // Prevent form submission if there are errors
      }
     
      const token = localStorage.getItem("token");
      let endpoint = "";

      switch (entityType.type) {
        case "customer":
          endpoint = `${Domain}/customers`;
          break;
        case "item":
          endpoint = `${Domain}/items`;
          break;
        case "bom":
          endpoint = `${Domain}/bom`;
          break;
        case "process":
          endpoint = `${Domain}/processes`;
          break;
        case "supplier":
          endpoint = `${Domain}/suppliers`;
          break;
        case "location":
          endpoint = `${Domain}/location`;
          break;
        case "transporter":
          endpoint = `${Domain}/transporter/${entityType.data.id}`;
          break;
        case "vendor":
          endpoint = `${Domain}/vendors/${entityType.data.id}`;
          break;
        case "tax":
          endpoint = `${Domain}/tax/${entityType.data.id}`;
          break;
        case "processStep":
          endpoint = `${Domain}/processSteps`;
          break;
        // Add more cases for other entity types
        default:
          throw new Error("Invalid entity type");
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });



      if (response.status === 200) {

        toast.success(`${entityType.type} updated successfully.`);
        setIsDialogOpen(false);

        // Refresh the data after update
       
        if (
          selectedCategory === entityType.type + "s" ||
          selectedCategory === entityType.type + "es"
        ) {
          
          switch (entityType.type) {
            case "customer":
              fetchCustomers();
              break;
            case "item":
              fetchItems();
              break;
            case "bom":
              fetchBoms();
              break;
            case "process":
              fetchProcess();
              break;
            case "supplier":
              fetchSuppliers();
              break;
            case "location":
              fetchLocations();
              break;
            case "transporter":
              fetchTransporters();
              break;
            case "vendor":
              fetchVendors();
              break;
            case "tax":
              fetchTax();
              break;
            case "processStep":
              fetchProcessSteps();
              break;
            // Add more cases for other entity types
            default:
              break;
          }
        }
      } else {
        toast.error(`Failed to update ${entityType}.`);
      }
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      toast.error(`An error occurred while updating ${entityType}.`);
    }
  };

  const handleDeleteClick = async (entityType, entityId) => {
    try {
     
      const token = localStorage.getItem("token");
      // Determine the API endpoint based on the entity type
      let endpoint = "";
     
      switch (entityType) {
        case "customer":
          endpoint = `${Domain}/customers/${entityId}`;
          break;
        case "item":
          endpoint = `${Domain}/items/${entityId}`;
          break;
        case "process":
          endpoint = `${Domain}/processes/${entityId}`;
          break;
        case "supplier":
          endpoint = `${Domain}/suppliers/${entityId}`;
          break;
        case "bom":
          endpoint = `${Domain}/bom/${entityId}`;
          break;
        case "location":
          endpoint = `${Domain}/location/${entityId}`;
          break;
        case "transporter":
          endpoint = `${Domain}/transporter/${entityId}`;
          break;
        case "vendor":
          endpoint = `${Domain}/vendors/${entityId}`;
          break;
        case "processStep":
          endpoint = `${Domain}/processSteps/${entityId}`;
          break;
        case "tax":
          endpoint = `${Domain}/tax/${entityId}`;
          break;

        // Add more cases for other entity types as needed
        default:
          throw new Error("Invalid entity type");
      }

      // Call the API to delete the entity
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        // If deletion is successful, update the corresponding state
        switch (entityType) {
          case "customer":
            setCustomers(customers.filter((c) => c.id !== entityId));
            break;
          case "item":
            setItems(items.filter((c) => c.id !== entityId));
            break;
          case "process":
            setProcess(processes.filter((c) => c.id !== entityId));
            break;
          case "supplier":
            setSuppliers(suppliers.filter((c) => c.id !== entityId));
            break;
          case "processStep":
            setProcessSteps(processSteps.filter((c) => c.id !== entityId));
            break;
          case "bom":
            setBoms(boms.filter((c) => c.id !== entityId));
            break;
          case "location":
            setLocations(locations.filter((c) => c.id !== entityId));
            break;
          case "transporter":
            setTransporters(transporters.filter((c) => c.id !== entityId));
            break;
          case "vendor":
            setVendors(vendors.filter((c) => c.id !== entityId));
            break;
          case "processStep":
            setProcessSteps(processSteps.filter((c) => c.id !== entityId));
            break;
          case "tax":
            setTaxes(taxes.filter((c) => c.id !== entityId));
            break;

          // Add more cases for other entity types as needed
          default:
            break;
        }

        toast.success(`${entityType} deleted successfully.`);
      } else {
        // If deletion fails, display an error message
        toast.error(`Failed to delete ${entityType}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      // toast.error(`An error occurred while deleting ${entityType}.`);
    }
  };

  const renderEditDeleteButtons = (onClickEdit, onClickDelete) => {
    return (
      <div className="flex justify-start gap-3">
        <button onClick={onClickEdit}>Edit</button>
        <button onClick={onClickDelete}>Delete</button>
      </div>
    );
  };

  // Define column headers outside of TableHeader component
  const itemColumns = [
    "Internal_Item_Name",
    "Item_Description",
    "UOM",
    "Rate",
    "avg_weight_needed",
    "avg_weight",
    "type",

    "max_buffer",
    "min_buffer",

    "tax_1",
    "tax_2",
    "drawing_revision_number",
    "drawing_revision_date",
    "alternate_name",
    "shopfloor_alternate_name",
    "scrap_type",
    "supplier_item_name",
    "customer_item_name",

    "action",
  ];

  const customerColumns = [
    "Name",
    "Phone_Number",
    "Email_Id",
    "address_type",
    "mailing_name",
    "godown_name",

    "Address",
    "alternate_address_1",
    "alternate_address_2",
    "city",
    "state",
    "country",
    "gstin",
    "payment_terms",

    "action",
  ];
  const bomColumns = ["Item_Name", "Component_Name", "Quantity", "Action"];

  const processStepColumns = [
    "Item_Name",
    "Process_Name",
    "sequence",
    "conversion_Ratio",
    "action",
  ];
  const processColumns = ["Process_Name", "Type", "Action"];
  const supplierColumns = [
    "Name",
    "POC_Name",
    "Phone_Number",
    "Email_id",
    "address_type",
    "mailing_name",
    "address",
    "City",
    "State",
    "Country",
    "gstin",

    "Payment_Terms",
    "action",
  ];
  const vendorColumns = [
    "Name",
    "Type",

    "Address",

    "State",
    "Country",
    "GSTIN",

    "action",
  ];
  const transporterColumns = ["Name", "Phone_Number", "action"];
  const taxColumns = ["Name", "Percentage", "action"];

  const locationColumns = ["Name", "Factory_Name", "Type", "action"];

  const handleItemChange = (selectedItemId, selectedCategory) => {
    console.log("Selected item ID:", selectedItemId);
    console.log("Selected category:", selectedCategory);

    // Determine which array to search based on the selected category

    switch (selectedCategory) {
      case "items":
        const selectedItem = items.find((item) => item.id == selectedItemId);
       
        if (selectedItem) {
          setItems([selectedItem]);
        } else {
          setItems(allitems);
        }
        break;
      case "customers":
        const selectedItem1 = customers.find(
          (item) => item.id == selectedItemId
        );
       
        if (selectedItem1) {
          setCustomers([selectedItem1]);
        } else {
          setCustomers(allcustomers);
        }
        break;
      case "boms":
        const selectedItem2 = boms.find((item) => item.id == selectedItemId);

        if (selectedItem2) {
          setBoms([selectedItem2]);
        } else {
          setBoms(allboms);
        }
        break;
      case "processSteps":
        const selectedItem3 = processSteps.find(
          (item) => item.id == selectedItemId
        );
        
        if (selectedItem3) {
          setProcessSteps([selectedItem3]);
        } else {
          setProcessSteps(allprocessSteps);
        }
        break;
      case "process":
        const selectedItem4 = processes.find(
          (item) => item.id == selectedItemId
        );

        if (selectedItem4) {
          setProcess([selectedItem4]);
        } else {
          setProcess(allprocesses);
        }
        break;
      case "locations":
        const selectedItem5 = locations.find(
          (item) => item.id == selectedItemId
        );

        if (selectedItem5) {
          setLocations([selectedItem5]);
        } else {
          setLocations(alllocations);
        }
        break;
      case "suppliers":
        const selectedItem10 = suppliers.find(
          (item) => item.id == selectedItemId
        );
       
        if (selectedItem10) {
          setSuppliers([selectedItem10]);
        } else {
          setSuppliers(allsuppliers);
        }
        break;
      case "vendors":
        const selectedItem6 = vendors.find((item) => item.id == selectedItemId);
  
        if (selectedItem6) {
          setVendors([selectedItem6]);
        } else {
          setVendors(allvendors);
        }
        break;
      case "transporters":
        const selectedItem7 = transporters.find(
          (item) => item.id == selectedItemId
        );

        if (selectedItem7) {
          setTransporters([selectedItem7]);
        } else {
          setTransporters(alltransporters);
        }
        break;
      case "taxes":
        const selectedItem8 = taxes.find((item) => item.id == selectedItemId);
     
        if (selectedItem8) {
          setTaxes([selectedItem8]);
        } else {
          setTaxes(alltaxes);
        }
        break;
      // Add more cases for other categories if needed
      default:
        console.error("Invalid category:", selectedCategory);
        return;
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="flex p-4">
        <div className="w-1/4 mr-4">
          <List>
            <ListItem onClick={() => handleListItemClick("items")}>
              Items
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("customers")}>
              Customers
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("boms")}>
              boms
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("processSteps")}>
              Process Steps
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("process")}>
              Process
            </ListItem>
          </List>

          <List>
            <ListItem onClick={() => handleListItemClick("suppliers")}>
              Suppliers
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("locations")}>
              Locations
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("transporters")}>
              Transporters
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("vendors")}>
              Vendors
            </ListItem>
          </List>
          <List>
            <ListItem onClick={() => handleListItemClick("taxes")}>
              Taxes
            </ListItem>
          </List>
        </div>
        <div className="w-3/4">
          <div className="flex px-10 py-5 w-full justify-between">
            <button className="bg-blue-600 text-white py-3 px-3 rounded-xl ">
              Download sample sheet
            </button>
            <button className="bg-blue-600 text-white py-3 px-3 rounded-xl">
              Upload data
            </button>
          </div>
          <div className="flex items-center w-full justify-between px-10 ">
            <Autocomplete
              label="Item Name"
              placeholder={`Select ${selectedCategory} Name`}
              defaultItems={autocompleteItems}
              onSelectionChange={(selectedItemId) =>
                handleItemChange(selectedItemId, selectedCategory)
              }
              className="lg:w-2/5 w-full "
            >
              {(item) => (
                <AutocompleteItem key={item.id}>
                  {item?.internal_item_name ||
                    item?.name ||
                    item?.Item?.internal_item_name}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <div>
              <button
                className={`text-white py-3 px-3 rounded-xl mr-16 ${
                  selectedCategory === "processSteps" ||
                  selectedCategory === "boms"
                    ? "bg-white text-black"
                    : "bg-black"
                }`}
                onClick={() => handleCreateClick(selectedCategory)}
              >
                {selectedCategory !== "processSteps" &&
                  selectedCategory !== "boms" && <FaPlus />}
              </button>
            </div>
          </div>
          {selectedCategory && (
            <div>
              <Table
                className="relative"
                aria-label="Example table with static content"
              >
                <TableHeader>
                  {selectedCategory === "items"
                    ? itemColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === itemColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[123px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "customers"
                    ? customerColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === customerColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[170px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "processSteps"
                    ? processStepColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === processStepColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[120px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "process"
                    ? processColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === processColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[120px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "suppliers"
                    ? supplierColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === supplierColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[120px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "locations"
                    ? locationColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === locationColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[120px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "transporters"
                    ? transporterColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === transporterColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black "
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "vendors"
                    ? vendorColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === vendorColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[120px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : selectedCategory === "taxes"
                    ? taxColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === taxColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black "
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))
                    : bomColumns.map((column, index) => (
                        <TableColumn
                          className={
                            index === bomColumns.length - 1 &&
                            "sticky -right-4 z-10 bg-black min-w-[120px]"
                          }
                          key={index}
                        >
                          {column}
                        </TableColumn>
                      ))}
                </TableHeader>

                <TableBody>
                  {selectedCategory === "customers" &&
                    customers &&
                    customers.map((customer, index) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>

                        <TableCell>{customer.phone_number}</TableCell>
                        <TableCell>{customer.email_id}</TableCell>
                        <TableCell>{customer.address_type}</TableCell>
                        <TableCell>{customer.mailing_name}</TableCell>
                        <TableCell>{customer.godown_name}</TableCell>

                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{customer.alternate_address_1}</TableCell>
                        <TableCell>{customer.alternate_address_2}</TableCell>
                        <TableCell>{customer.city}</TableCell>
                        <TableCell>{customer.state}</TableCell>
                        <TableCell>{customer.country}</TableCell>
                        <TableCell>{customer.gstin}</TableCell>
                        <TableCell>{customer.payment_terms}</TableCell>
                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() =>
                                handleEditClick("customer", customer)
                              }
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick("customer", customer.id)
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
               
                  
                  {selectedCategory === "items" &&
                    Array.isArray(items) &&
                    items.length > 0 &&
                    items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.internal_item_name}</TableCell>

                        <TableCell>{item.item_description}</TableCell>
                        <TableCell>{item.uom}</TableCell>
                        <TableCell>{item.rate}</TableCell>
                        <TableCell>{item.avg_weight_needed}</TableCell>
                        <TableCell>{item.avg_weight}</TableCell>
                        <TableCell>{item.type}</TableCell>

                        <TableCell>{item.min_buffer}</TableCell>
                        <TableCell>{item.max_buffer}</TableCell>

                        <TableCell>
                          {taxes.find((tax) => tax.id === item.tax_1)?.name ||
                            ""}
                        </TableCell>
                        <TableCell>
                          {taxes.find((tax) => tax.id === item.tax_2)?.name ||
                            ""}
                        </TableCell>
                        <TableCell>{item.drawing_revision_number}</TableCell>
                        <TableCell>{item.drawing_revision_date}</TableCell>
                        <TableCell>{item.alternate_name}</TableCell>
                        <TableCell>{item.shopfloor_alternate_name}</TableCell>
                        <TableCell>{item.scrap_type}</TableCell>
                        <TableCell>{item.supplier_item_name}</TableCell>
                        <TableCell>{item.customer_item_name}</TableCell>
                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() => handleEditClick("item", item)}
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick("item", item.id)
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "boms" &&
                    boms &&
                    boms.map((bom, index) => (
                      <TableRow key={bom.id}>
                        <TableCell>{bom.item_name}</TableCell>
                        <TableCell>{bom.component_name}</TableCell>
                        <TableCell>{bom.quantity}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button onClick={() => handleEditClick("bom", bom)}>
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() => handleDeleteClick("bom", bom.id)}
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "processSteps" &&
                    processSteps &&
                    processSteps.map((processStep, index) => (
                      <TableRow key={processStep.id}>
                        <TableCell>{processStep.item_name}</TableCell>
                        <TableCell>{processStep.process_name}</TableCell>
                        <TableCell>{processStep.sequence}</TableCell>
                        <TableCell>{processStep.conversion_ratio}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() =>
                                handleEditClick("processStep", processStep)
                              }
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick(
                                    "processStep",
                                    processStep.id
                                  )
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "process" &&
                    processes &&
                    processes.map((process, index) => (
                      <TableRow key={process.id}>
                        <TableCell>{process.process_name}</TableCell>
                        <TableCell>{process.type}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() => {
                                handleEditClick("process", process);
                              }}
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() => {
                                  handleDeleteClick("process", process.id);
                                }}
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "suppliers" &&
                    suppliers &&
                    suppliers.map((supplier, index) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.poc_name}</TableCell>
                        <TableCell>{supplier.phone_number}</TableCell>
                        <TableCell>{supplier.email_id}</TableCell>
                        <TableCell>{supplier.address_type}</TableCell>
                        <TableCell>{supplier.mailing_name}</TableCell>
                        <TableCell>{supplier.address}</TableCell>
                        <TableCell>{supplier.city}</TableCell>
                        <TableCell>{supplier.state}</TableCell>
                        <TableCell>{supplier.country}</TableCell>
                        <TableCell>{supplier.gstin}</TableCell>
                        <TableCell>{supplier.payment_terms}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() =>
                                handleEditClick("supplier", supplier)
                              }
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick("supplier", supplier.id)
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "locations" &&
                    locations &&
                    locations.map((location, index) => (
                      <TableRow key={location.id}>
                        <TableCell>{location.name}</TableCell>
                        <TableCell>{location.Factory.name}</TableCell>
                        <TableCell>{location.type}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() =>
                                handleEditClick("location", location)
                              }
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick("location", location.id)
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "vendors" &&
                    vendors &&
                    vendors.map((vendor, index) => (
                      <TableRow key={vendor.id}>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.type}</TableCell>
                        <TableCell>{vendor.address}</TableCell>
                        <TableCell>{vendor.state}</TableCell>
                        <TableCell>{vendor.country}</TableCell>
                        <TableCell>{vendor.gstin}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() => handleEditClick("vendor", vendor)}
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick("vendor", vendor.id)
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "transporters" &&
                    transporters &&
                    transporters.map((transporter, index) => (
                      <TableRow key={transporter.id}>
                        <TableCell>{transporter.name}</TableCell>
                        <TableCell>{transporter.phone_number}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button
                              onClick={() =>
                                handleEditClick("transporter", transporter)
                              }
                            >
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() =>
                                  handleDeleteClick(
                                    "transporter",
                                    transporter.id
                                  )
                                }
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {selectedCategory === "taxes" &&
                    taxes &&
                    taxes.map((tax, index) => (
                      <TableRow key={tax.id}>
                        <TableCell>{tax.name}</TableCell>
                        <TableCell>{tax.percentage}</TableCell>

                        <TableCell className="text-right sticky -right-4 z-10 bg-white border-l-1 border-r-1">
                          <div className="flex justify-start gap-3">
                            <button onClick={() => handleEditClick("tax", tax)}>
                              <IoPencil className="h-4 w-4 shrink-0" />
                            </button>
                            <button>
                              <MdDelete
                                className="h-4 w-4 shrink-0"
                                onClick={() => handleDeleteClick("tax", tax.id)}
                              />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>{" "}
            </div>
          )}
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg ">
            <h2 className="text-center text-2xl font-semibold">
              Update {selectedEntity.type}
            </h2>
            {eval(selectedEntity.type + "Columns").map((column, index) => {
              const isRequired = requiredFields[selectedCategory]?.includes(
                column.toLowerCase()
              );

              return (
                <div key={index} className="flex items-center gap-1 m-1 ">
                  {column !== "action" ? (
                    <>
                      <label>
                        {column}
                        {isRequired && <span className="text-red-500">*</span>}
                      </label>
                      {column.toLowerCase() === "tax_1" ||
                      column.toLowerCase() === "tax_2" ||
                      column.toLowerCase() === "type" ? (
                        <select
                          className="p-0.5 border-2 rounded-md"
                          name={column.toLowerCase()}
                          value={updateData[column.toLowerCase()] || ""}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              [column.toLowerCase()]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select an option</option>
                          {selectedCategory === "items" &&
                          column.toLowerCase() === "type"
                            ? itemFieldOptions.map((option, i) => (
                                <option key={i} value={option}>
                                  {option}
                                </option>
                              ))
                            : column.toLowerCase() === "type" // Check if column is vendor
                            ? vendorFieldOptions.map((option, i) => (
                                <option key={i} value={option}>
                                  {option}
                                </option>
                              ))
                          
                            : alltaxes.map((tax) => (
                                <option key={tax.id} value={tax.id}>
                                  {tax.name}
                                </option>
                              ))}
                        </select>
                      ) : selectedCategory === "items" && column.toLowerCase() === "uom" ? (
                        <select
                          className="p-0.5 border-2 rounded-md"
                          name={column.toLowerCase()}
                          value={updateData[column.toLowerCase()] || ""}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              [column.toLowerCase()]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select a UOM</option>
                          {uomFieldOptions.map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) :(
                        <>
                          <input
                            className=" p-0.5 border-2 rounded-md"
                            type="text"
                            name={column.toLowerCase()} // Assuming column names are in lowercase
                            value={updateData[column.toLowerCase()]}
                            onChange={(e) =>
                              setUpdateData({
                                ...updateData,
                                [column.toLowerCase()]: e.target.value,
                              })
                            }
                          />
                          {formErrors[column.toLowerCase()] && (
                            <p className="text-red-500 text-sm">
                              {formErrors[column.toLowerCase()]}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}
            <div className="flex w-full justify-end gap-2 ">
              <button
                className="bg-blue-600 text-white py-3 px-3 rounded-xl "
                onClick={() => handleFormSubmit(selectedEntity, updateData)}
              >
                Submit
              </button>
              <button
                className="bg-gray-200 text-black py-3 px-3 rounded-xl "
                onClick={handleDialogClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDialogOpenCreate && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg ">
            <h2 className="text-center text-2xl font-semibold">
              Create {selectedCategory.slice(0, -1)}
            </h2>
            <div className="">{renderFormFields()}</div>
            <div className="flex w-full justify-end gap-2 ">
              <button
                className="bg-blue-600 text-white py-3 px-3 rounded-xl "
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="bg-gray-200 text-black py-3 px-3 rounded-xl "
                onClick={() => setIsDialogOpenCreate(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* { <UpdateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        entity={selectedEntity}
        onSubmit={handleUpdateSubmit}
      /> } */}
      <ToastContainer />
    </>
  );
};

export default MainComponent;
