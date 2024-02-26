import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../apiConfig";
import axios from "axios";
import CryptoJS from "crypto-js";
import Sidebar from "../components/Sidebar";
import Nav2 from "../components/Nav2";
import { useData } from "../middlewares/dataContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ViewNote = () => {
  const { userData, notes, refreshNotes } = useData();
  const location = useLocation();
  const uid = localStorage.getItem("uid");
  const key = localStorage.getItem("key");
  const noteId = location.pathname.split("/")[2];
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");

  const [message, setMessage] = useState("Fetching Data");
  const truncate = (data, len) => {
    const words = data.split(" ");
    const truncatedWords = words.slice(0, len);
    const truncatedText = truncatedWords.join(" ");
    const lines = truncatedText.split("\n").slice(0, 3);
    const truncatedNote = lines.join("\n");
    return truncatedNote;
  };
  const getNote = async () => {
    try {
      setMessage({ status: true, message: "Fetching Data" });
      const params = { userId: uid, noteId };
      const res = await axios.get(`${API_URL}/note/view`, { params });
      setMessage({ status: true, message: "Decrypting Data" });
      if (res.data.noteData.note) {
        const bytes = CryptoJS.AES.decrypt(res.data.noteData.note, key);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        setNote(originalText);
      }
      if (res.data.noteData.title) {
        const bytes = CryptoJS.AES.decrypt(res.data.noteData.title, key);
        let originalTitle = bytes.toString(CryptoJS.enc.Utf8);
        setTitle(originalTitle);
      }
      setMessage(null);
    } catch (error) {
      setMessage({ status: false, message: "Something Went Wrong" });
      console.log(error);
    }
  };
  useEffect(() => {
    getNote();
  }, [noteId, location.pathname]);
  function truncateString(str) {
    const words = str.trim().split(/\s+/);
    if (words.length > 2) {
      return words.slice(0, 4).join(" ") + "...";
    } else {
      return str;
    }
  }
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const handleDelete = async () => {
    try {
      setMessage({ status: true, message: "Deleting Note" });
      const userId = userData._id;
      const params = {
        userId,
        noteId,
      };
      const res = await axios.delete(`${API_URL}/note/delete`, { params });
      refreshNotes();
      setMessage({ status: true, message: "Note Deleted" });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const userId = userData?._id;
    let ed;
    let eTitle;
    try {
      setMessage({ status: true, message: "Encrypting Data" });
      ed = await CryptoJS.AES.encrypt(note, key).toString();
      eTitle = await CryptoJS.AES.encrypt(title, key).toString();
    } catch (err) {
      setMessage({ status: false, message: "Data Encryption Failed" });
      console.log(err);
    }
    setMessage({ status: true, message: "...." });
    const data = {
      userId,
      noteId,
      updatedNote: ed,
      updatedTitle: eTitle,
    };
    try {
      setMessage({ status: true, message: "Saving Note" });
      const res = await axios.put(`${API_URL}/note/update`, data);
      console.log("Note Updated successfully:", res.data);
      refreshNotes();
      getNote();
      setEditModal(false);
    } catch (error) {
      setMessage(error.response.data);
      console.log("Error saving note:", error.response.data);
    }
    setMessage(null);
  };

  return (
    <>
      {message ? (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-5">
          <div className="page-loader-black"></div>
          <span className="text-slate-800">{message.message}</span>
          {message.status == false ? (
            <NavLink to="/" className="text-blue-600 hover:text-blue-800">
              &larr; Back to Home
            </NavLink>
          ) : null}
        </div>
      ) : editModal ? (
        <div className="w-11/12 lg:w-1/2 border border-slate-200 p-4 mx-auto my-5 bg-white rounded">
          <div className="flex gap-2 items-center justify-between">
            <div className="font-bold text-lg lg:text-xl">Edit Note</div>
            <div
              onClick={() => setEditModal(false)}
              className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 flex justify-center items-center h-8 w-8 lg:h-10 lg:w-10 rounded"
            >
              <i class="fa-solid fa-xmark"></i>{" "}
            </div>
          </div>
          <form onSubmit={handleSave} className="mt-4">
            <label className="block text-slate-400 font-semibold mb-1">
              Title
            </label>
            <input
              className="focus:outline-none text-lg lg:text-xl border border-slate-200 focus:border-blue-900 w-full rounded mb-3 p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <ReactQuill theme="snow" value={note} onChange={setNote} />

            <button
              type="submit"
              className="text-white mt-3 bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold w-full"
            >
              {message ? message.message : "Update"}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex max-h-screen">
          <div className="lg:w-1/6">
            <Sidebar />
          </div>
          <div className="w-full lg:w-5/6">
            <Nav2
              userData={userData}
              pageName="View Note"
              isView={true}
              toggleEdit={toggleEdit}
              editModal={editModal}
              onDelete={handleDelete}
            />
            <div className="p-4 lg:p-0">
              <div className="mb-5 border flex gap-5 flex-col lg:flex-row lg:justify-between lg:px-8 p-4 bg-white">
                <div className="text-lg font-semibold lg:text-2xl lg:w-3/4">
                  <span className="hidden lg:inline">
                    {truncate(title, 20)}...
                  </span>
                  <span className="lg:hidden">{title}</span>
                </div>
                <div className="flex gap-2 lg:w-1/4 lg:justify-end">
                  <div
                    onClick={() => toggleEdit()}
                    className={`bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800 flex justify-center items-center lg:h-10 p-2 px-4 w-fit text-xs lg:text-sm font-bold rounded`}
                  >
                    <i
                      className={`fa-${
                        editModal
                          ? "solid fa-times"
                          : "regular fa-pen-to-square"
                      }`}
                    ></i>
                    &nbsp; Edit
                  </div>

                  <div
                    onClick={() => handleDelete()}
                    className={`bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 flex justify-center items-center p-2 px-4 lg:h-10 w-fit text-xs lg:text-sm font-bold rounded`}
                  >
                    <i class="fa-solid fa-trash"></i>&nbsp;Delete
                  </div>
                </div>
              </div>
              <div className="w-full h-90vh lg:px-8 lg:pr-6 text-justify lg:overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <div
                    className="mt-10 pt-10 lg:text-lg"
                    dangerouslySetInnerHTML={{
                      __html: note.replace(/\n/g, "<br>"),
                    }}
                    style={{ margin: 0, padding: 0, whiteSpace: "pre-line" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewNote;
