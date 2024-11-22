import React, { useState } from "react";

interface SidebarProps {
  onSelect:(component:string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<string>("dashboard");

  const handleSelection = (option: string) => {
    onSelect(option);
    setSelectedOption(option);
  };
  return (
    <div className="w-full md:w-1/6 h-screen p-4 border-r border-gray-200 bg-white">
  <ul className="space-y-4 cursor-pointer">
    <li
      className={`text-gray-700 font-semibold ${selectedOption === "dashboard" ? "bg-red-500 text-white rounded p-2" : "hover:bg-gray-200 p-2"}`}
      onClick={() => handleSelection("dashboard")}
    >
      Dashboard
    </li>
    <li
      className={`text-gray-700 font-semibold ${selectedOption === "mycars" ? "bg-red-500 text-white rounded p-2" : "hover:bg-gray-200 p-2"}`}
      onClick={() => handleSelection("mycars")}
    >
      My Cars
    </li>
    <li
      className={`text-gray-700 font-semibold ${selectedOption === "addcar" ? "bg-red-500 text-white rounded p-2" : "hover:bg-gray-200 p-2"}`}
      onClick={() => handleSelection("addcar")}
    >
      Add Car
    </li>
    <li
      className={`text-gray-700 font-semibold ${selectedOption === "orders" ? "bg-red-500 text-white rounded p-2" : "hover:bg-gray-200 p-2"}`}
      onClick={() => handleSelection("orders")}
    >
      Orders
    </li>
  </ul>
</div>


  );
};

export default Sidebar;
