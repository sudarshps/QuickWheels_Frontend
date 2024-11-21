import React, { useState } from "react";
import Navbar from "../../../components/Admin/Navbar/AdminNavbar";
import Sidebar from "./Components/Sidebar";
import CategoryType from "./Components/CategoryType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cat: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("make");

  const handleSidebarSelect = (category: string) => {
    setActiveCategory(category); 
  };


  const alertMessage = (action:boolean | null,message:string) => {
    if(action){
      toast.success(message)
    }else if(action === null){
      toast.error(message)
    }else{
      toast.error(message)
    }
  }
  return (
    <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
      <Navbar />
      <div className="p-4 md:p-6">
        <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
          Category Management
        </h2>
        <ToastContainer autoClose={2000}/>
        <div className="grid grid-cols-1 lg:grid-cols-4 rounded-lg gap-6 bg-gradient-to-br from-[#10114f] to-[#1416b5]">
          <div className="lg:col-span-1">
            <Sidebar onSelect={handleSidebarSelect} />
          </div>
          <div className="lg:col-span-3">
            <CategoryType activeCategory={activeCategory} handleAlert={alertMessage}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cat;
