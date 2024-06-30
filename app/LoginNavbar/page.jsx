"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Domain } from "@/Domain";
import {Spinner} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const NavbarMain = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showSpinner, setShowSpinner] = React.useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
  
    if (token) {
      if (isAdmin === 'true') {
        router.push('/Admin');
      } else {
        router.push('/StoreApp');
      }
    }
  }, []);
  const handleLogin = async () => {
    setShowSpinner(true);
    try {
      const response = await fetch(`${Domain}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const responseData = await response.json();
      if (responseData?.error) {
        toast.error(responseData.error);
        throw new Error('Failed to login');
      }
  
      const { user } = responseData;
      toast.success('Logged in successfully!');
      const { name, email: userEmail, roleId, roleName, token, factory_ids } = user;
      localStorage.setItem('name', name);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('roleName', roleName);
      localStorage.setItem('token', token);
      if (factory_ids && factory_ids.length > 0) {
        localStorage.setItem('factoryId', factory_ids[0]);
      }
    
      if (roleId === 2) {
        localStorage.setItem('isAdmin', 'true');
        router.push('/Admin');
      } else {
        router.push('/StoreApp');
      }
    } catch (error) {
      console.error('Failed to login:', error.message);
    }
    setShowSpinner(false);
  };
  
  

  return (
    <>
    <div className="bg-black">
    <nav className="bg-gray-900 p-4 rounded-b-lg shadow-2xl mx-1 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <a
          className="flex m-auto  items-center space-x-2 text-black"
          onClick={() => {
            router.push("/StoreApp");
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/7656/7656409.png" // Replace with the path to your logo
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <span
            className="text-white font-bold text-lg text-center"
            onClick={() => {
              router.push("/MainTabs");
            }}
          >
            INVEE Sync
          </span>
        </a>
      </div>
    </nav>
    <div className="bg-black mb-14  p-8 flex justify-center items-center">
      <Card className="w-96 lg:mt-[4.5rem] mt-16 lg:mb-12 mb-8">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Log In
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            size="lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth onClick={handleLogin}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
    <footer className="bg-black lg:h-16 md:h-36 h-60"></footer>
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

export default NavbarMain;
