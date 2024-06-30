"use client";
import React from "react";
import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react";
import { users } from "./data";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Domain } from "@/Domain";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SpecificUserAnalysis = () => {
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${Domain}/users`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setUsers(data);
        setShowSpinner(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div className="bg-black p-8">
        <h1 className="font-bold bg-gradient-to-r to-[#f00]  to-[#f84a4a]  to-[#c6ff77] to-[#ff7f7f] from-[#71bdff] to-[#ffff] bg-clip-text text-transparent  mt-4 mb-8 lg:text-4xl text-3xl ">
          Specific User Ananlysis
        </h1>
        <div className="flex justify-between mt-6">
        <Autocomplete
  defaultItems={users}
  label="Assigned to"
  placeholder="Select a user"
  labelPlacement="inside"
>
  {(user) => (
    <AutocompleteItem key={user.id} textValue={user.name}>
      {user.name}
    </AutocompleteItem>
  )}
</Autocomplete>
        </div>
        <h1 className=" font-bold text-xl text-white mt-8 mb-8">
          User Activity
        </h1>
        <Table
          aria-label="Example static collection table"
          className="mt-5 mb-3"
        >
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Tony Reichert</TableCell>
              <TableCell>CEO</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Zoey Lang</TableCell>
              <TableCell>Technical Lead</TableCell>
              <TableCell>Paused</TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Jane Fisher</TableCell>
              <TableCell>Senior Developer</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>William Howard</TableCell>
              <TableCell>Community Manager</TableCell>
              <TableCell>Vacation</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <ToastContainer />
      {showSpinner && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <Spinner color="white" />
        </div>
      )}
    </>
  );
};

export default SpecificUserAnalysis;
