/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Avatar,
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Domain } from "@/Domain";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DeleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-red-500 font-bold hover:text-red-900 cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const EditIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-blue-500 font-bold hover:text-blue-900 cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
    />
  </svg>
);

const avatarUrls = [
  "https://cdn-icons-png.flaticon.com/128/4336/4336786.png",
  "https://cdn-icons-png.flaticon.com/128/5347/5347689.png",
  "https://cdn-icons-png.flaticon.com/128/10344/10344865.png",
];

const shuffleAvatarUrls = () => {
  const shuffled = [...avatarUrls];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const UserCrudTable = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [isOpenDeleteModal, setOpenDeleteModal] = React.useState(false);
  const closeDeleteModal = () => setOpenDeleteModal(false);
  const [deleteUserId, setDeleteUserId] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState("All");
  const [isOpenEditModal, setOpenEditModal] = React.useState(false);
  const [editUserData, setEditUserData] = React.useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role_id: "",
  });
  const openEditModal = (user) => {
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.role_id,
    });
    setOpenEditModal(true);
  };
  const closeEditModal = () => setOpenEditModal(false);
  const [isOpenAddModal, setOpenAddModal] = React.useState(false);
  const [addUserData, setAddUserData] = React.useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
  });
  const openAddModal = () => setOpenAddModal(true)
  const closeAddModal = () => setOpenAddModal(false)
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setOpenDeleteModal(true);
  };

  const deleteHandler = async (userId) => {
    let token;
    if (typeof localStorage !== "undefined") {
       token = localStorage.getItem("token");
    }
    try {
      await fetch(`${Domain}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const updateUser = async () => {
    let token;
    if (typeof localStorage !== "undefined") {
       token = localStorage.getItem("token");
    }    
    try {
      const response = await fetch(`${Domain}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(editUserData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        toast.success("User updated successfully");
        setOpenEditModal(false);
      } else {
        toast.error("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    }
  };
  const addUser = async () => {
    let token;
    if (typeof localStorage !== "undefined") {
       token = localStorage.getItem("token");
    }
    try {
      const response = await fetch(`${Domain}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(addUserData),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]); // Add the new user to the existing list
        toast.success("User added successfully");
        closeAddModal();
      } else {
        toast.error("Error adding user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user");
    }
  };

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, users.length);
  
  const filteredUsers = selectedRole === "All" ? users : users.filter(user => user.Role.name === selectedRole);
  const visibleUsers = filteredUsers.slice(startIndex, endIndex);
  
  const shuffledAvatarUrls = shuffleAvatarUrls();

  return (
    <>
      {showSpinner && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <Spinner color="white" />
        </div>
      )}
      <div className="bg-black p-8">
        <h1 className="font-bold bg-gradient-to-r from-[#71bdff] to-[#ffff] to-[#af4af8]  to-[#c6ff77] to-[#ff7f7f] bg-clip-text text-transparent flex justify-center mt-4 mb-8 lg:text-4xl text-3xl ">
          User Details
        </h1>
        <div className="bg-white p-5 rounded-xl mt-3">
          <div className="flex justify-between gap-8 mt-4 mb-2 p-1 w-full lg:flex-nowrap md:flex-nowrap flex-wrap">
            <div className=" lg:w-1/3 md:w-1/3 w-full">
              <Input
                placeholder="Search for User"
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                }
              />
            </div>
            <div className="flex  justify-end lg:gap-8 md:gap-8 gap-2 lg:w-2/3 md:w-2/3 w-full">
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    className="bg-blue-700 text-white border-blue-700"
                    endContent={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="font-bold w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                        />
                      </svg>
                    }
                  >
                    Role Name
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Static Actions">
                <DropdownItem key="All" onClick={() => setSelectedRole("All")}>
  All
</DropdownItem>
<DropdownItem key="Admin" onClick={() => setSelectedRole("Admin")}>
  Admin
</DropdownItem>
<DropdownItem key="SystemAdmin" onClick={() => setSelectedRole("SystemAdmin")}>
  SystemAdmin
</DropdownItem>
<DropdownItem key="Operator" onClick={() => setSelectedRole("Operator")}>
  Operator
</DropdownItem>

                </DropdownMenu>
              </Dropdown>
              <Button
                color="success"
                onClick={openAddModal}
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                }
                className="font-bold text-white"
              >
                Add New
              </Button>
            </div>
          </div>
          <Table
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            aria-label="Example table with client side pagination"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn key="avatar">Avatar</TableColumn>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="email">Email</TableColumn>
              <TableColumn key="roleName">Role Name</TableColumn>
              <TableColumn key="Delete">Delete</TableColumn>
              <TableColumn key="Edit">Edit</TableColumn>
            </TableHeader>
            <TableBody>
              {visibleUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar
                      src={shuffledAvatarUrls[index % 3]} // Cycling through the shuffled URLs
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.Role.name}</TableCell>
                  <TableCell>
                    <button onClick={() => openDeleteModal(user.id)}>
                      {DeleteIcon}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => openEditModal(user)}>
                      {EditIcon}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Modal isOpen={isOpenDeleteModal} onOpenChange={closeDeleteModal}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete User
                </ModalHeader>
                <ModalBody>Are You Sure You Want to Delete This User</ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    No
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      deleteHandler(deleteUserId);
                      closeDeleteModal();
                    }}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpenEditModal}
          onOpenChange={closeEditModal}
          placement="bottom-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit User
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Enter Name"
                    value={editUserData.name}
                    onChange={(e) =>
                      setEditUserData({ ...editUserData, name: e.target.value })
                    }
                  />
                  <Input
                    label="Enter Email"
                    value={editUserData.email}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        email: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Enter Password"
                    value={editUserData.password}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        password: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Enter Role Id"
                    type="number"
                    value={editUserData.role_id}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        role_id: e.target.value,
                      })
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onPress={() => {
                      onClose();
                      setEditUserData({
                        id: null,
                        name: "",
                        email: "",
                        password: "",
                        role_id: "",
                      });
                    }}
                  >
                    Close
                  </Button>
                  <Button color="primary" onPress={updateUser}>
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
  isOpen={isOpenAddModal}
  onOpenChange={closeAddModal}
  placement="bottom-center"
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">
          Add User
        </ModalHeader>
        <ModalBody>
          <Input
            label="Enter Name"
            value={addUserData.name}
            onChange={(e) =>
              setAddUserData({ ...addUserData, name: e.target.value })
            }
          />
          <Input
            label="Enter Email"
            value={addUserData.email}
            onChange={(e) =>
              setAddUserData({ ...addUserData, email: e.target.value })
            }
          />
          <Input
            label="Enter Password"
            value={addUserData.password}
            onChange={(e) =>
              setAddUserData({ ...addUserData, password: e.target.value })
            }
          />
          <Input
            label="Enter Role Id"
            type="number"
            value={addUserData.role_id}
            onChange={(e) =>
              setAddUserData({ ...addUserData, role_id: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onPress={() => {
              onClose();
              setAddUserData({
                name: "",
                email: "",
                password: "",
                role_id: "",
              });
            }}
          >
            Close
          </Button>
          <Button color="primary" onPress={addUser}>
            Submit
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>

      </div>
      <ToastContainer />
    </>
  );
};

export default UserCrudTable;
