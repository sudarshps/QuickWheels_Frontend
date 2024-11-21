import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import Navbar from "../../../components/User/Navbar/Navbar";

import "react-toastify/dist/ReactToastify.css";
import MyCars from "./Components/MyCars";
import HostRegister from "../Host Registration/HostRegister";
import MyOrders from "./Components/MyOrders";
import Dashboard from "./Components/Dashboard";
import Footer from "../../../components/User/Footer/Footer";


const HostDashboard: React.FC = () => {
  
  const[componentType,setComponentType] = useState('dashboard')
 
  const handleSelection = (component:string) => {
    setComponentType(component)
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8 mt-20">
          <div className="flex">
            <Sidebar onSelect={handleSelection}/>
            {componentType==="dashboard"?<Dashboard/>:componentType==='mycars'?
            <MyCars/>:componentType==='addcar'?<HostRegister isComponent={true}/>:<MyOrders/>}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default HostDashboard;
