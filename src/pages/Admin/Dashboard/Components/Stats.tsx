import React from 'react'
import { ChevronDown,IndianRupee,Car } from "lucide-react";


interface StatsProps{
  totalOrders:number;
  totalRevenue:number;
}

const Stats:React.FC<StatsProps> = ({totalOrders,totalRevenue}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {/* Total Orders */}
    <div className="bg-gradient-to-br from-[#1c1d73] to-[#2a32c8] p-4 rounded-xl">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Car />
        </div>
        <div className="text-white">
          <div className="text-2xl font-bold">{totalOrders}</div>
          <div>Total Orders</div>
        </div>
      </div>
    </div>
  
    {/* Total Revenue */}
    <div className="bg-gradient-to-br from-[#1c1d73] to-[#2a32c8] p-4 rounded-xl text-white">
      <div className="flex items-center gap-2">
        <div className="bg-green-500 p-2 rounded-lg text-white">
          <IndianRupee />
        </div>
        <div>
          <div className="text-2xl font-bold">{totalRevenue}.00</div>
          <div>Total Revenue</div>
        </div>
      </div>
    </div>
  
    {/* Time Period Selector */}
    <div className="flex justify-end items-center">
      <button className="flex items-center text-white gap-2 px-4 py-2 border rounded-lg">
        Last Month
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  </div>
  
  )
}

export default Stats
