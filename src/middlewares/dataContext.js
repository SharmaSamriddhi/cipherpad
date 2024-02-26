import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../apiConfig";
import { jwtDecode } from "jwt-decode";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getUser = async () => {
    try {
      const token = await localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const res = await axios.get(
          `${API_URL}/user/view/${decodedToken.userId}`
        );
        setUserData(res.data.userDetails);
        localStorage.setItem("key", `2SHTD63U${res.data.userDetails.email}`);
      } else {
        console.log("no token");
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };
  const getNotes = async () => {
    try {
      const token = await localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const res = await axios.get(
          `${API_URL}/note/view/all/${decodedToken.userId}`
        );
        setNotes(res.data.notes);
      } else {
        console.log("no token");
      }
    } catch (error) {
      console.log(error.response);
      console.log("something wen wrong");
    }
  };
  const refreshUserData = async () => {
    await getUser();
  };
  const refreshNotes = async () => {
    await getNotes();
  };
  useEffect(() => {
    getUser();
    getNotes();
  }, []);
  const contextValue = {
    userData,
    notes,
    isOpen,
    refreshNotes,
    refreshUserData,
    toggleSidebar,
  };
  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
