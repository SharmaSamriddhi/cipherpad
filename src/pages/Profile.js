import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Nav2 from "../components/Nav2";
import { useData } from "../middlewares/dataContext";
import moment from "moment";
import CryptoJS from "crypto-js";
import { NavLink } from "react-router-dom";
import API_URL from "../apiConfig";
import axios from "axios";

const Profile = () => {
  const { userData, notes, refreshNotes, isOpen, toggleSidebar } = useData();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ status: false, message: "Please Wait" });
    if (password != confirmPassword) {
      setLoading(false);
      setMessage({ status: false, message: "Passwords do not match" });
      setTimeout(() => {
        setMessage(null);
      }, 500);
      return;
    }
    const data = {
      userId: userData._id,
      currentPassword,
      newPassword: password,
    };
    console.log(data);
    try {
      const res = await axios.put(`${API_URL}/user/change-password`, data);
      setMessage(res.data);
      setConfirmPassword("");
      setCurrentPassword("");
      setPassword("");
    } catch (error) {
      setLoading(false);
      console.log(error.response?.data);
      setMessage(error?.response?.data || "Something Went Wrong");
    }
    setMessage(null);
  };
  const [editModal, setEditModal] = useState(false);
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  return (
    <>
      {editModal ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="bg-white w-11/12 lg:w-1/4 mx-auto p-4 rounded shadow border">
            <div className="flex gap-2 items-center justify-between">
              <div className="font-bold text-lg lg:text-xl">
                Change Password{" "}
              </div>
              <div
                onClick={() => setEditModal(false)}
                className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 flex justify-center items-center h-8 w-8 rounded"
              >
                <i class="fa-solid fa-xmark"></i>{" "}
              </div>
            </div>
            <form className="mt-5" onSubmit={handleUpdate}>
              <input
                className="focus:outline-none text-lg lg:text-xl border border-slate-200 focus:border-blue-900 w-full rounded mb-3 p-2"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                type="password"
              />
              <input
                className="focus:outline-none text-lg lg:text-xl border border-slate-200 focus:border-blue-900 w-full rounded mb-3 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                type="password"
              />
              <input
                className="focus:outline-none text-lg lg:text-xl border border-slate-200 focus:border-blue-900 w-full rounded mb-3 p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                type="password"
              />
              <button
                type="submit"
                className="flex justify-center items-center text-white bg-blue-900 hover:bg-blue-800 p-2 rounded font-semibold w-full"
              >
                {message ? (
                  <>
                    <div className="btn-loader-white"></div>&nbsp;
                    {message.message}
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className={`${isOpen ? "w-full" : "lg:w-1/6"}`}>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          </div>
          <div className={`${isOpen ? "hidden" : "w-full lg:w-5/6"}`}>
            <Nav2
              userData={userData}
              pageName="My Account"
              isProfile={true}
              toggleSidebar={toggleSidebar}
            />
            <div className="p-4 flex flex-col gap-5 lg:flex-row">
              <div className="w-full lg:h-screen lg:w-1/2">
                <div className="flex justify-between">
                  <div>
                    <div className="text-lg lg:text-xl font-semibold">
                      {userData?.name}
                    </div>
                    <div className="text-slate-400">{userData?.email}</div>
                  </div>
                  <div>
                    <div className="text-lg lg:text-xl font-semibold">
                      Notes Count
                    </div>
                    <div className="text-slate-400">{notes?.length}</div>
                  </div>
                </div>
                <div className="mt-5 text-slate-600 font-medium lg:text-lg">
                  Last Login Details
                </div>
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 mt-2 text-slate-400 text-sm lg:text-base">
                  <span>
                    <i class="fa-regular fa-clock"></i>{" "}
                    {moment(userData?.lastLoginData.time).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>{" "}
                  <span>
                    <i class="fa-solid fa-satellite-dish"></i>{" "}
                    {userData?.lastLoginData.ip}
                  </span>{" "}
                  <span>
                    <i class="fa-solid fa-location-dot"></i>{" "}
                    {userData?.lastLoginData.city},{" "}
                    {userData?.lastLoginData.region},{" "}
                    {userData?.lastLoginData.country}
                  </span>
                </div>
                <div
                  onClick={() => toggleEdit()}
                  className="cursor-pointer bg-blue-900 hover:bg-blue-800 p-2 px-6 w-fit text-white rounded mt-5"
                >
                  Change Password
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
