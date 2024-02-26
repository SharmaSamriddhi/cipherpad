import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Nav2 from "../components/Nav2";
import { useData } from "../middlewares/dataContext";
import moment from "moment";
import CryptoJS from "crypto-js";
import { NavLink } from "react-router-dom";

const Home = () => {
  const { userData, notes, isOpen, toggleSidebar } = useData();
  const key = localStorage.getItem("key");

  const decyrpt = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  const truncate = (data, len) => {
    const words = data.split(" ");
    const truncatedWords = words.slice(0, len);
    const truncatedText = truncatedWords.join(" ");
    const lines = truncatedText.split("\n").slice(0, 3);
    const truncatedNote = lines.join("\n");
    return truncatedNote;
  };
  const renderNoteItem = (item) => {
    let note = decyrpt(item.note);
    let title = decyrpt(item.title);

    return (
      <div className="rounded border border-slate-200 p-2 lg:p-4 bg-white w-full lg:w-72 lg:h-50 flex flex-col justify-between">
        <NavLink
          to={`/note/${item?._id}/view`}
          className="flex flex-col h-full"
        >
          <div>
            <div className="text-slate-400 text-xs lg:text-sm mb-2">
              {moment(item.updatedAt).format("MMM Do YY")}
            </div>
            {item.title && (
              <div className="text-slate-800 lg:text-lg font-semibold mb-1">
                {truncate(title, 5)}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: truncate(note, 20) }} />
          </div>
        </NavLink>
      </div>
    );
  };

  return (
    <div className="flex">
      <div className={`${isOpen ? "w-full" : "lg:w-1/6"}`}>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className={`${isOpen ? "hidden" : "w-full lg:w-5/6"}`}>
        <Nav2
          userData={userData}
          pageName="Notes"
          toggleSidebar={toggleSidebar}
        />
        <div className="p-4 lg:px-8">
          {isOpen}
          <div className="lg:hidden flex gap-2 lg:text-lg rounded border border-slate-200 p-1 px-2 w-full bg-white p-3">
            <span className="text-slate-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <span>
              <input
                placeholder="Search Notes..."
                className="focus:outline-none w-5/6 lg:w-full"
              />
            </span>
          </div>
          <div>
            <div
              className={`bg-blue-600 p-1 text-white rounded w-fit min-w-20 text-center`}
            >
              All
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 mt-5">
            {notes?.map((item) => (
              <div key={item?._id}>{renderNoteItem(item)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
