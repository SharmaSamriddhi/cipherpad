import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API_URL from "../apiConfig";
import { useData } from "../middlewares/dataContext";

const Login = () => {
  const navigate = useNavigate();
  const { refreshUserData, refreshNotes } = useData();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const ipData = await axios.get("https://api.ipify.org/?format=json");
    let date = new Date();
    let ip = ipData.data.ip;
    const data = { email, password, ip, date };
    try {
      const res = await axios.post(`${API_URL}/user/login`, data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("uid", res.data.userId);
      refreshUserData();
      refreshNotes();
      navigate("/");
      setMessage(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data);
    }
  };

  return (
    <div className="bg-white h-screen w-screen  flex justify-center items-center flex-col gap-10">
      <div>
        <img
          src="https://res.cloudinary.com/dwjisi2ul/image/upload/v1707656119/dry3jbhpodfmi6naqf1g.png"
          alt="logo"
          className="w-36"
        />
      </div>
      <div className="p-4 w-11/12 lg:w-2/6">
        <div className="text-center font-semibold text-lg lg:text-xl">
          Welcome Back
          <span className="block text-slate-400 text-xs lg:text-sm font-medium">
            Login to continue
          </span>
        </div>
        <form className="border rounded shadow p-4 mt-8" onSubmit={handleLogin}>
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
          <button className="mt-2 p-2 rounded bg-blue-900 hover:bg-blue-800 text-white w-full font-semibold">
            {loading ? "Logging you in" : message ? message.message : "Login"}
          </button>
        </form>
        <div className="flex flex-col gap-2 lg:justify-between items-center mt-5">
          <NavLink
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
          >
            Forgot Password?
          </NavLink>
          <NavLink
            to="/signup"
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
          >
            Create New Account
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
