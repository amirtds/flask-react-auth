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
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";

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
  const [messageType, setMessageType] = useState<
    "info" | "warning" | "success" | "error" | null
  >(null);
  const [messageText, setMessageText] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      await validRefresh();
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a test message when the component mounts
  useEffect(() => {
    createMessage("info", "Welcome to the application!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to add new user to the users state
  const addUserToList = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    createMessage("success", "User added successfully."); // Display success message
  };

  const clearMessage = () => {
    setMessageType(null);
    setMessageText(null);
  };

  const createMessage = (
    type: "info" | "warning" | "success" | "error",
    text: string,
  ) => {
    setMessageType(type);
    setMessageText(text);
    setTimeout(() => {
      clearMessage();
    }, 3000);
  };

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

  const handleRegisterFormSubmit = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const url = `${import.meta.env.VITE_API_SERVICE_URL}/auth/register`;
      const response = await axios.post(url, data);
      console.log(response.data);
      createMessage("success", "Registration successful! You can now log in."); // Display success message
    } catch (err) {
      console.log(err);
      createMessage(
        "error",
        "Registration failed. The user might already exist.",
      ); // Display error message
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
      await fetchUsers();
      createMessage("success", "Login successful!"); // Display success message
    } catch (err) {
      console.log(err);
      createMessage("error", "Login failed. Please check your credentials."); // Display error message
    }
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const logoutUser = () => {
    setAccessToken(null);
    window.localStorage.removeItem("refreshToken");
    createMessage("info", "You have been logged out."); // Display success message
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
      {messageType && messageText && (
        <Message
          messageType={messageType}
          messageText={messageText}
          onClose={clearMessage} // Make sure this is passed
        />
      )}
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
        <Route
          path="/status"
          element={
            <UserStatus
              accessToken={accessToken || ""}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
