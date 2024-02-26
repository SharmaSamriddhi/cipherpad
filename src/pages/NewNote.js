import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Nav2 from "../components/Nav2";
import { useData } from "../middlewares/dataContext";
import moment from "moment";
import CryptoJS from "crypto-js";
import { NavLink } from "react-router-dom";
import API_URL from "../apiConfig";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewNote = () => {
  const { userData, notes, refreshNotes, isOpen, toggleSidebar } = useData();
  const [message, setMessage] = useState("");
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
      <div className="rounded border border-slate-200 p-2 lg:p-4 bg-white w-full lg:h-50 flex flex-col justify-between">
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
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = userData._id;
    let ed;
    let eTitle;
    if (note.length == 0) {
      setMessage({ status: false, message: "Empty Content" });
      setTimeout(() => {
        setMessage(null);
      }, 200);
      return;
    }
    try {
      setMessage({ status: true, message: "Encrypting Data" });
      ed = await CryptoJS.AES.encrypt(note, key).toString();
      eTitle = await CryptoJS.AES.encrypt(title, key).toString();
    } catch (err) {
      setMessage({ status: false, message: "Data Encryption Failed" });
      setTimeout(() => {
        setMessage("");
      }, 1000);
      console.log(err);
    }
    setMessage({ status: true, message: "...." });

    const data = {
      user: userId,
      note: ed,
      title: eTitle,
    };
    try {
      setMessage({ status: true, message: "Saving Note" });
      const res = await axios.post(`${API_URL}/note/create`, data);
      console.log("Note saved successfully:", res.data);
      setNote("");
      setTitle("");
      refreshNotes();
    } catch (error) {
      setMessage(error.response.data);
      console.log("Error saving note:", error.response.data);
    }
    setMessage(null);
  };
  return (
    <div className="flex">
      <div className={`${isOpen ? "w-full" : "lg:w-1/6"}`}>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`${isOpen ? "hidden" : "w-full lg:w-5/6"}`}>
        <Nav2
          userData={userData}
          pageName="New Note"
          toggleSidebar={toggleSidebar}
        />
        <div className="flex flex-col gap-5 lg:gap-1 lg:flex-row">
          <div className="w-full lg:h-screen lg:w-2/3 bg-white p-4 lg:border-r lg:px-8">
            <form onSubmit={handleSave}>
              <input
                className="focus:outline-none text-lg lg:text-xl border border-slate-200 focus:border-blue-900 w-full rounded mb-3 p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              {/* <textarea
                className="w-full lg:h-full h-20 focus:outline-none text-lg lg:text-xl border border-slate-200 focus:border-blue-900 w-full rounded mb-3 p-2 resize-none"
                rows={16}
                placeholder="start typing..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea> */}
              <ReactQuill theme="snow" value={note} onChange={setNote} />
              <button
                className="text-white mt-3 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold flex gap-2 justify-center items-center"
                type="submit"
              >
                {message ? (
                  <>
                    <div className="btn-loader-white"></div>&nbsp;
                    {message.message}
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/3 p-4">
            {notes?.length > 0 && (
              <div className="font-bold text-slate-400 mb-4"></div>
            )}{" "}
            <div className="flex flex-col gap-2">
              {notes?.map((item) => (
                <div key={item?._id}>{renderNoteItem(item)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNote;
