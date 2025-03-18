import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../redux/authSlice";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    dispatch(signup(user))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigate("/login");  // Navigate after 3 seconds
        }, 3000);
      })
      .catch(() => {});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
       <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />

        {/* Role Dropdown */}
        <select
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          required
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
