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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      await validRefresh();
    };
    checkAuth();
  }, []);

  // Function to add new user to the users state
  const addUserToList = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleRegisterFormSubmit = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const url = `${import.meta.env.VITE_API_SERVICE_URL}/auth/register`;
      const response = await axios.post(url, data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoginFormSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    try {
      const url = `${import.meta.env.VITE_API_SERVICE_URL}/auth/login`;
      const response = await axios.post(url, data);
      console.log(response.data);
      setAccessToken(response.data.access_token);
      window.localStorage.setItem("refreshToken", response.data.refresh_token);
      await fetchUsers(); // Fetch users after successful login
    } catch (err) {
      console.log(err);
    }
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const logoutUser = () => {
    setAccessToken(null);
    window.localStorage.removeItem("refreshToken");
  };

  const validRefresh = async () => {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_SERVICE_URL}/auth/refresh`,
          {
            refresh_token: token,
          },
        );
        setAccessToken(response.data.access_token);
        await fetchUsers();
        window.localStorage.setItem(
          "refreshToken",
          response.data.refresh_token,
        );
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    return false;
  };

  return (
    <ChakraProvider>
      <NavBar
        title={title}
        logoutUser={logoutUser}
        isAuthenticated={isAuthenticated}
      />
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
          element={
            <RegisterForm
              onSubmit={handleRegisterFormSubmit}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              onSubmit={handleLoginFormSubmit}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
