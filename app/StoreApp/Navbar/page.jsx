"use client";
import React from "react";
import { Card, Progress } from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import {
  CircularProgress,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
const NavbarStore = () => {
  const router = useRouter();

  let Name; let RoleName; let Email;
  if (typeof localStorage !== "undefined") {
    Name = localStorage.getItem("name");
    RoleName = localStorage.getItem("roleName");
    Email = localStorage.getItem("email");
  }

  return (
    <>
      <div className="p-2 bg-black ">
        <Navbar className="navbar rounded-xl p-2 bg-gray-900 ">
          <NavbarBrand className="gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/128/10951/10951884.png"
              alt=""
              className="w-6 h-6 cursor-pointer"
              onClick={()=> router.push("/StoreApp")}
            />

            <p className="font-bold text-white">InveeSync</p>
          </NavbarBrand>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://cdn-icons-png.flaticon.com/128/236/236832.png"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{Email}</p>
                </DropdownItem>
                <DropdownItem key="name" color="primary" className="font-bold">
                  <span className="font-bold"> Name: {Name} </span>
                </DropdownItem>
                <DropdownItem
                  key="RoleName"
                  color="primary"
                  className="font-bold"
                >
                  <span className="font-bold"> Role: {RoleName} </span>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("isAdmin");
                    localStorage.removeItem("roleId");
                    localStorage.removeItem("email");
                    localStorage.removeItem("name");
                    localStorage.removeItem("factoryId");
                      router.push("/");
                  }}
                >
                  <span className="text-red-600 font-bold"> Log Out </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>
      </div>
    </>
  );
};

export default NavbarStore;
