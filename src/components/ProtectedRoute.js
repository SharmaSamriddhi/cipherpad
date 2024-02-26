import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";

const ProtectedRoute = (props) => {
  const { Component } = props;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const validToken = async () => {
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        setIsLogged(false);
        localStorage.clear();
        navigate("/login");
        return;
      }
      setIsLogged(true);
    } else {
      setIsLogged(false);
      navigate("/login");
    }
  };
  useEffect(() => {
    validToken();
  }, [token]);
  return <React.Fragment>{isLogged ? <Component /> : null}</React.Fragment>;
};

export default ProtectedRoute;
