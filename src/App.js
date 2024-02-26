import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NewNote from "./pages/NewNote";
import ViewNote from "./pages/ViewNote";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" Component={Login}></Route>
        <Route path="/signup" Component={Signup}></Route>
        <Route path="/forgot-password" Component={ForgotPassword}></Route>
        <Route path="/" element={<ProtectedRoute Component={Home} />}></Route>
        <Route
          path="/new"
          element={<ProtectedRoute Component={NewNote} />}
        ></Route>
        <Route
          path="/note/:id/view"
          element={<ProtectedRoute Component={ViewNote} />}
        ></Route>
        <Route
          path="/account"
          element={<ProtectedRoute Component={Profile} />}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
