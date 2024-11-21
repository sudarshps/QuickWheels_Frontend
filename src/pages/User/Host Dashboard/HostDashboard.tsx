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

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
     <Navbar />
     <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8 mt-20">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar for Mobile View */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:w-1/5 w-full lg:block`}>
          <Sidebar onSelect={handleSelection} />
        </div>

        {/* Hamburger Toggle Button for Mobile View */}
        <button
          className="lg:hidden p-2 text-gray-500"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          &#9776; {/* Hamburger Icon */}
        </button>

        {/* Main Content */}
        <div className="lg:w-4/5 w-full">
          {componentType === "dashboard" ? (
            <Dashboard />
          ) : componentType === "mycars" ? (
            <MyCars />
          ) : componentType === "addcar" ? (
            <HostRegister isComponent={true} />
          ) : (
            <MyOrders />
          )}
        </div>
      </div>
    </div>
  </div>
<Footer />

    </>
  );
};

export default HostDashboard;
