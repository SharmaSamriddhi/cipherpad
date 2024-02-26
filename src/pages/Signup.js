import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import API_URL from "../apiConfig";

const Signup = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confimPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const data = { name, email, password };
    try {
      const res = await axios.post(`${API_URL}/user/signup`, data);
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
          Get Started
          <span className="block text-slate-400 text-xs lg:text-sm font-medium">
            Create New Account
          </span>
        </div>
        <form
          className="border rounded shadow p-4 mt-8"
          onSubmit={handleSignup}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Full Name"
            className="block mb-2 p-2 rounded border outline-none focus:border-blue-900 focus:border-2 w-full"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email Address"
            className="block mb-2 p-2 rounded border outline-none focus:border-blue-900 focus:border-2 w-full"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Password"
            className="block mb-2 p-2 rounded border outline-none focus:border-blue-900 focus:border-2 w-full"
          />
          <input
            value={confimPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            placeholder="Password"
            className="block mb-2 p-2 rounded border outline-none focus:border-blue-900 focus:border-2 w-full"
          />
          <button className="mt-2 p-2 rounded bg-blue-900 hover:bg-blue-800 text-white w-full font-semibold">
            {loading ? "Getting you onboard" : "Signup"}
          </button>
          {message ? (
            message.status == false ? (
              <div className="text-red-600 mt-4 text-center">
                {message.message}
              </div>
            ) : (
              <div className="text-green-600 mt-4 text-center">
                {message.message}
              </div>
            )
          ) : (
            ""
          )}
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

export default Signup;
