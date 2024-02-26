import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Accepting isOpen as a prop
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className={`flex-col bg-white justify-between h-screen text-black border-r px-4 ${
        isOpen ? "block" : "hidden lg:flex"
      }`}
    >
      <div className="flex justify-between items-center w-full lg:h-16">
        <div className="p-2">
          <Logo />
        </div>
        {isOpen && <div onClick={() => toggleSidebar()}>X</div>}
      </div>
      <div className="text-lg py-4 flex flex-col gap-2">
        <NavLink
          to="/"
          className={`p-2 mb-2 flex items-center rounded hover:bg-blue-50 hover:text-blue-600 ${
            currentPage === "" ? "bg-slate-100 text-blue-600 font-medium" : ""
          }`}
        >
          <i class="fa-regular fa-note-sticky"></i>&nbsp;Notes
        </NavLink>
        <NavLink
          to="/new"
          className={`p-2 mb-2 flex items-center rounded hover:bg-blue-50 hover:text-blue-600 ${
            currentPage === "new"
              ? "bg-slate-100 text-blue-600 font-medium"
              : ""
          }`}
        >
          <i class="fa-solid fa-plus"></i>&nbsp;New Note
        </NavLink>
        <NavLink
          to="/account"
          className={`p-2 mb-2 flex items-center rounded hover:bg-blue-50 hover:text-blue-600 ${
            currentPage === "account"
              ? "bg-slate-100 text-blue-600 font-medium"
              : ""
          }`}
        >
          <i class="fa-regular fa-user"></i>&nbsp;Account
        </NavLink>
      </div>
      <div className="mt-auto mb-4">
        <div
          onClick={() => handleLogout()}
          className="cursor-pointer p-2 bg-white text-black font-semibold text-lg text-center rounded bg-red-50 hover:bg-red-100 border border-red-300 text-red-600"
        >
          Logout&nbsp;<i class="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
