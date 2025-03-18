import React from 'react'

import EmployeeTable from '../components/EmployeeTable'
import FileUpload from '../components/FileUpload'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <div>
       <ToastContainer position="top-right" autoClose={3000} />
      <FileUpload/>
     <EmployeeTable/>
    
    </div>
  )
}

export default Home
