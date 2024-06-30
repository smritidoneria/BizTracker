/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import NavbarStore from "../../Navbar/page";
import { FooterWithLogo } from "../../Footer/StoreAppFooter";
import {
  Card,
  CardBody,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const [itemDetails, setItemDetails] = React.useState([]);
  const [isOpenFinishstockModal, setOpenFinishstockModal] = React.useState(
    false
  );
  const openFinishstockModal = () => setOpenFinishstockModal(true);
  const closeFinishStockModal = () => setOpenFinishstockModal(false);
  const [
    selectedFinishStockLocation,
    setSelectedFinishStockLocation,
  ] = React.useState(null);
  const [
    finishStockLocationOptions,
    setFinishStockLocationOptions,
  ] = React.useState([]);
  const [finishStockEntry, setFinishStockEntry] = React.useState(null);

  const [selectedProcess, setSelectedProcess] = React.useState(null);
  const [isOpenProcessModal, setOpenProcessModal] = React.useState(false);
  const openProcessModal = (process) => {
    setSelectedProcess(process);
    setOpenProcessModal(true);
  };
  const closeProcessModal = () => {
    setOpenProcessModal(false);
    setSelectedProcess(null);
  };

  const [processEntries, setProcessEntries] = React.useState({});
  const [processLocation, setProcessLocation] = React.useState(null);
  const [processQuantity, setProcessQuantity] = React.useState("");
  const [combinedEntries, setCombinedEntries] = React.useState([]);
  const [editedQuantities, setEditedQuantities] = React.useState({});
  const handleProcessLocationChange = (id) => {
    const dropdownSelectedItem = finishStockLocationOptions.find(
      (item) => item.id == id
    );
    setProcessLocation(dropdownSelectedItem);
  };

  const handleQuantityChange = (
    processId,
    processStateId,
    locationId,
    newQuantity
  ) => {
    setEditedQuantities((prevEditedQuantities) => ({
      ...prevEditedQuantities,
      [`${selectedProcess.item_id}-${processId}-${processStateId}-${locationId}`]: newQuantity,
    }));
  };

  const handleAddProcessEntry = () => {
    if (!processLocation || !processQuantity) return;

    const newEntry = {
      item_id: selectedProcess.component_id
        ? selectedProcess.component_id
        : selectedProcess.item_id,
      component_id: selectedProcess.component_id || null,
      inventory_state_id: 1, // Default to 1
      process_state_id: selectedProcess.process_state_id,
      process_step_id: selectedProcess.process_step_id,
      process_id: selectedProcess.process_id,
      location_id: processLocation.id,
      location_name: processLocation.name,
      qty: parseFloat(processQuantity),
    };

    const entryKey = `${
      selectedProcess.component_id || selectedProcess.item_id
    }-${selectedProcess.process_id}-${selectedProcess.process_state_id}`;
    setProcessEntries((prevEntries) => ({
      ...prevEntries,
      [entryKey]: [...(prevEntries[entryKey] || []), newEntry],
    }));
    setCombinedEntries((prevEntries) => [...prevEntries, newEntry]);
    setProcessLocation(null);
    setProcessQuantity("");
  };

  const handleProcessQtyChange = (e) => {
    setProcessQuantity(e.target.value);
  };

  const router = useRouter();

  React.useEffect(() => {
    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }
    let params;
    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const id = params?.get("id");
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${Domain}/inventoryOnboarding/components-with-process-steps/${id}`,
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
          setItemDetails(data);
        }
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    };
    const fetchLocations = async () => {
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
              location.type === "PROCESS" || location.type === "DISPATCH"
          );
          setFinishStockLocationOptions(finishStockLocations);
        }
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    };
    fetchLocations();
    fetchData();
  }, []);

  const handleSubmitProcessEntries = () => {
    setProcessEntries((prevEntries) => {
      const updatedEntries = { ...prevEntries };
      Object.keys(editedQuantities).forEach((key) => {
        const [itemId, processId, processStateId, locationId] = key.split("-");
        const entryKey = `${itemId}-${processId}-${processStateId}`;
        const entryIndex = updatedEntries[entryKey].findIndex(
          (entry) => entry.location_id === parseInt(locationId)
        );
        if (entryIndex !== -1) {
          updatedEntries[entryKey][entryIndex].qty = editedQuantities[key];
        }
      });
      return updatedEntries;
    });
    setEditedQuantities({});
    closeProcessModal();
  };

  const checkAllEntriesMade = () => {
    const rootItemCheck = itemDetails.rootItemWithProcessSteps.processes.every(
      (process) =>
        itemDetails.processStates.every(
          (processState) =>
            processEntries[
              `${itemDetails.rootItemWithProcessSteps.item_id}-${process.process_id}-${processState.id}`
            ]?.length > 0
        )
    );

    const componentsCheck = itemDetails.componentsWithProcessSteps.every(
      (component) =>
        component.processes.every((process) =>
          itemDetails.processStates.every(
            (processState) =>
              processEntries[
                `${component.component_id}-${process.process_id}-${processState.id}`
              ]?.length > 0
          )
        )
    );

    return rootItemCheck && componentsCheck;
  };

  const handleFinalSubmit = () => {
    const allEntriesMade = checkAllEntriesMade();

    if (!allEntriesMade) {
      alert("Please make entries for all processes and process states.");
      return;
    }

    let params;
    if (global?.window !== undefined) {
      params = new URLSearchParams(global.window.location.search);
    }
    const sellItemId = params?.get("id");

    const adjustedEntries = combinedEntries.map((entry) => ({
      ...entry,
      item_id: entry.component_id ? entry.component_id : entry.item_id,
    }));

    const requestData = {
      sell_item_id: parseInt(sellItemId),
      inventory_entries: adjustedEntries,
    };

    let token;
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("token");
    }

    fetch(`${Domain}/inventoryOnboarding/onboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "Inventory entries onboarded successfully") {
          toast.success("🎉You onboarded this item successfully");
          router.push("/StoreApp/Onboarding");
        } else {
          console.log("Error:", data);
          toast.error(" Error Onboarding Item");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <>
      <NavbarStore />
      <div className="p-3 bg-black">
        <Card className="bg-gray-900 p-2 mt-6 mb-6">
          <CardBody>
            <h1 className="font-bold text-white mt-3 mb-4 text-center text-2xl">
              Onboarding Items
            </h1>
            {itemDetails.rootItemWithProcessSteps && (
              <Card className="bg-white mb-4 p-4">
                <h2 className="font-bold text-lg mb-2">{`Item: ${itemDetails.rootItemWithProcessSteps.item_name}`}</h2>
                {itemDetails.rootItemWithProcessSteps.processes.map((process) =>
                  itemDetails.processStates.map((processState) => (
                    <Card
                      key={`${process.process_id}-${processState.id}`}
                      className="bg-gray-200 shadow-md shadow-black mt-3 mb-3 p-2"
                    >
                      <div className="flex justify-between">
                        <div className="p-2">
                          <h3 className="font-bold">{process.process_name}</h3>
                          <p>{processState.name}</p>
                        </div>
                        <Button
                          color={
                            processEntries[
                              `${itemDetails.rootItemWithProcessSteps.item_id}-${process.process_id}-${processState.id}`
                            ]
                              ? "warning"
                              : "primary"
                          }
                          className="font-bold text-white mt-3"
                          onClick={() =>
                            openProcessModal({
                              ...process,
                              process_state_id: processState.id,
                              item_id:
                                itemDetails.rootItemWithProcessSteps.item_id,
                            })
                          }
                        >
                          {processEntries[
                            `${itemDetails.rootItemWithProcessSteps.item_id}-${process.process_id}-${processState.id}`
                          ]
                            ? "Edit Qty"
                            : "Enter Qty"}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </Card>
            )}

            {itemDetails.componentsWithProcessSteps?.length > 0 &&
              itemDetails.componentsWithProcessSteps.map((component) => (
                <div key={component.component_id}>
                  <Card className="bg-white mb-4 p-4">
                    <h2 className="font-bold text-lg mb-2">{`Component: ${component.component_name}`}</h2>
                    {component.processes.map((process) =>
                      itemDetails.processStates.map((processState) => (
                        <Card
                          key={`${process.process_id}-${processState.id}`}
                          className="bg-gray-200 shadow-md shadow-black mt-3 mb-3 p-2"
                        >
                          <div className="flex justify-between">
                            <div className="p-2">
                              <h3 className="font-bold">
                                {process.process_name}
                              </h3>
                              <p>{processState.name}</p>
                            </div>
                            <Button
                              color={
                                processEntries[
                                  `${component.component_id}-${process.process_id}-${processState.id}`
                                ]
                                  ? "warning"
                                  : "primary"
                              }
                              className="font-bold text-white mt-3"
                              onClick={() =>
                                openProcessModal({
                                  ...process,
                                  process_state_id: processState.id,
                                  component_id: component.component_id,
                                })
                              }
                            >
                              {processEntries[
                                `${component.component_id}-${process.process_id}-${processState.id}`
                              ]
                                ? "Edit Qty"
                                : "Enter Qty"}
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </Card>
                </div>
              ))}
            <Button
              color="success"
              className="font-bold text-white flex m-auto mt-3 mb-3"
              onClick={handleFinalSubmit}
            >
              Submit
            </Button>
          </CardBody>
        </Card>
      </div>
      <Modal
        isOpen={isOpenProcessModal}
        onOpenChange={closeProcessModal}
        size="full"
        className="overflow-y-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 m-auto text-center justify-center font-bold">
                Select Location and Quantity
              </ModalHeader>
              <ModalBody className="overflow-y-scroll">
                <Autocomplete
                  label="Location Name"
                  placeholder="Select Location Name"
                  defaultItems={finishStockLocationOptions}
                  selectedKeys={[processLocation?.id]}
                  onSelectionChange={handleProcessLocationChange}
                  className="mt-4 mb-3"
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.id}
                      textValue={`${item.name} - ${
                        item.Factory?.name || "N/A"
                      }`}
                    >
                      {item.name} - {item.Factory?.name || "N/A"}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Input
                  type="number"
                  label="Enter Quantity"
                  placeholder="Enter Quantity"
                  value={processQuantity}
                  onChange={handleProcessQtyChange}
                  className="mt-4 mb-3"
                />
                <Button
                  color="primary"
                  className="mt-4 mb-3"
                  onClick={handleAddProcessEntry}
                >
                  Add
                </Button>
                {processEntries[
                  `${
                    selectedProcess?.item_id || selectedProcess?.component_id
                  }-${selectedProcess?.process_id}-${
                    selectedProcess?.process_state_id
                  }`
                ]?.length > 0 && (
                  <div className="mt-4 max-w-md m-auto">
                    <table className="table-auto w-full text-center">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">Location</th>
                          <th className="border px-4 py-2">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processEntries[
                          `${
                            selectedProcess.item_id ||
                            selectedProcess.component_id
                          }-${selectedProcess.process_id}-${
                            selectedProcess.process_state_id
                          }`
                        ].map((entry, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2">
                              {entry.location_name}
                            </td>
                            <td className="border px-4 py-2">
                              <Input
                                type="number"
                                value={
                                  editedQuantities[
                                    `${
                                      selectedProcess.item_id ||
                                      selectedProcess.component_id
                                    }-${selectedProcess.process_id}-${
                                      selectedProcess.process_state_id
                                    }-${entry.location_id}`
                                  ] || entry.qty
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    selectedProcess.process_id,
                                    selectedProcess.process_state_id,
                                    entry.location_id,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={handleSubmitProcessEntries}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
      <FooterWithLogo />
    </>
  );
};

export default page;
