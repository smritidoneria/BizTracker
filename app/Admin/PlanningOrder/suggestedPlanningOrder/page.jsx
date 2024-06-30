/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import NavbarAdmin from "../../adminNavbar/page";
import {
  Card,
  CardBody,
  Button,
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
  useDisclosure,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
const page = () => {
  const [isOpenFirstModal, setOpenFirstModal] = React.useState(false);
  const [planningOrders, setPlanningOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const router = useRouter();
  const openFirstModal = (order) => {
    setSelectedOrder(order);
    setOpenFirstModal(true);
  };

  const closeFirstModal = () => setOpenFirstModal(false);

  React.useEffect(() => {
    const fetchPlanningOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Domain}/planOrder/pending`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch planning orders");
        }
        const data = await response.json();
        setPlanningOrders(data);
      } catch (error) {
        console.error("Error fetching planning orders:", error);
      }
    };
    fetchPlanningOrders();
  }, []);

  const handleApproveOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/planOrder/approval`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedOrder.id,
          approved_by: localStorage.getItem("name"),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to approve planning order");
      }
      toast.success("PLO Approved")
      setPlanningOrders(planningOrders.filter((order) => order.id !== selectedOrder.id));
      closeFirstModal();
    } catch (error) {
      console.error("Error approving planning order:", error);
      toast.error("Error approving planning order:", error)
    }
  };

  const handleRejectOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Domain}/planOrder/${selectedOrder.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete planning order");
      }
      toast.success("PLO Deleted");
      setPlanningOrders(planningOrders.filter((order) => order.id !== selectedOrder.id));
      closeFirstModal();
    } catch (error) {
      console.error("Error deleting planning order:", error);
      toast.error("Error deleting planning order");
    }
  };
  return (
    <>
      <NavbarAdmin />
      <div className="lg:p-8 p-4 bg-black">
        <Card className="p-2 bg-gray-800 mt-6 mb-7">
          <h1 className="p-2 text-center text-white font-bold text-3xl mt-5 mb-3">
            Suggested Planning Order
          </h1>
          <Card className="p-4 bg-gray-900 shadow-md shadow-black mt-6 mb-6">
            <CardBody>
              {planningOrders.map((order) => (
                <div key={order.id} className="mb-6">
                  <Table aria-label="PLO Item Table" bottomContent={<div className="flex justify-center gap-5 m-auto mt-2">
                    <Button
                      color="primary"
                      onClick={() => openFirstModal(order)}
                    >
                      Action
                    </Button>
                  </div>}>
                    <TableHeader>
                      <TableColumn>Item Name</TableColumn>
                      <TableColumn>Quantity</TableColumn>
                      <TableColumn>Unit of Measure</TableColumn>
                      <TableColumn>Estimated Production Date</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow onClick={() => setSelectedOrder(order)}>
                        <TableCell>{order.Item.internal_item_name}</TableCell>
                        <TableCell>{order.qty}</TableCell>
                        <TableCell>{order.Item.uom}</TableCell>
                        <TableCell>
                          {new Date(order.estimated_production_date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                </div>
              ))}
            </CardBody>
          </Card>
        </Card>
        <div className="bg-black h-40"></div>
      </div>
      <footer className="fixed bottom-0 w-full  p-4">
        <Button color="success" className="flex m-auto font-bold text-white" onClick={()=> router.push("/Admin/PlanningOrder/AddPlanningOrder")}>
          Check Later
        </Button>
      </footer>
      <Modal
        isOpen={isOpenFirstModal}
        onClose={closeFirstModal}
      >
        <ModalContent>
          <ModalHeader className=" flex justify-center gap-6">
            Approve Planning Order
          </ModalHeader>
          <ModalBody>
           You Want to Approve this Planning order ?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={closeFirstModal}>
              Close
            </Button>
            <Button color="danger" onClick={handleRejectOrder}>
              Reject
            </Button>
            <Button color="primary" onClick={handleApproveOrder}>
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default page;
