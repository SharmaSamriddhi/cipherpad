import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import API_URL from "../apiConfig";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = { email };
    try {
      const res = await axios.post(
        `${API_URL}/user/reset-password/inititae`,
        data
      );
      setMessage(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data);
    }
  };

  return (
    <div className="h-screen w-screen  flex justify-center items-center flex-col gap-10">
      <div>
        <img
          src="https://res.cloudinary.com/dwjisi2ul/image/upload/v1707656119/dry3jbhpodfmi6naqf1g.png"
          alt="logo"
          className="w-36"
        />
      </div>
      <div className="p-4 w-11/12 lg:w-2/6">
        <div className="text-center font-semibold text-lg lg:text-xl">
          Forgot Password?
          <span className="block text-slate-400 text-xs lg:text-sm font-medium capitalize">
            Reset now using your email address
          </span>
        </div>
        <form
          className="border rounded shadow p-4 mt-8"
          onSubmit={handleSubmit}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email Address"
            className="block mb-2 p-2 rounded border outline-none focus:border-blue-900 focus:border-2 w-full"
          />

          <button className="mt-2 p-2 rounded bg-blue-900 hover:bg-blue-800 text-white w-full font-semibold">
            {loading
              ? "Please Wait..."
              : message
              ? message.message
              : "Send Password Reset Link"}
          </button>
        </form>
        <div className="flex flex-col gap-2 lg:justify-between items-center mt-5">
          <NavLink
            to="/login"
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
          >
            &larr; Back to Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
