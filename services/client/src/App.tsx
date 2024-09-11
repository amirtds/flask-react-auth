import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Users from "./components/Users";
import AddUser from "./components/AddUser";
import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

interface User {
  created_date: string;
  email: string;
  id: number;
  username: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [title] = useState("TestDriven.io");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVICE_URL}/users`,
        );
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to add new user to the users state
  const addUserToList = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <ChakraProvider>
      <NavBar title={title} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AddUser addUserToList={addUserToList} />
              <Users users={users} />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/register"
          element={<RegisterForm onSubmit={() => {}} />}
        />
        <Route path="/login" element={<LoginForm onSubmit={() => {}} />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
