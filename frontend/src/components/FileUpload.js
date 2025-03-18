import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadExcel, exportExcel,fetchEmployees } from "../redux/employeeSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      await dispatch(uploadExcel(file)); 
      dispatch(fetchEmployees()); 
      setFile(null);
    } else {
      alert("Please select a file first!");
    }
  };

  return (
    <div className="flex justify-end items-center gap-4 w-[93%]   ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex gap-4 mt-12">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="file:mr-4 cursor-pointer file:py-2 w-72 border rounded-md file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          onClick={handleUpload}
          className="flex-1 cursor-pointer w-64 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
        >
          Upload Excel
        </button>
        <button
          onClick={exportExcel}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
