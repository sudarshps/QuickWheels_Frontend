import React, { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
  } from "recharts";
import { ChevronDown } from "lucide-react";

interface OrderStatsProps{
  name:string;
  value:number;
  color?:string;
}

interface OrderGraphFCProps{
    status:{
      active: number;
      completed: number;
      upcoming: number;
    }
}

const OrderGraph:React.FC<OrderGraphFCProps> = ({status}) => {

    const [orderStats, setOrderStats] = useState<OrderStatsProps[]>([]);

      useEffect(()=>{
        const stats = [] as OrderStatsProps[]
        Object.entries(status).forEach(([key,val])=>{
          if(key==='completed'){
            stats.push({name:"Completed",value:val})
          }else if(key==="upcoming"){
            stats.push({name:"Upcoming",value:val})
          }else{
            stats.push({name:"Active",value:val})
          }
        })
        setOrderStats(stats)
      },[status])      

  return (
    <div className="bg-gradient-to-br from-[#1c1d73] to-[#2a32c8] text-white p-6 rounded-xl">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <h3 className="font-semibold text-lg md:text-base mb-2 md:mb-0">Orders Overview</h3>
      <button className="flex items-center gap-2 text-sm">
        Last Month
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={orderStats}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#ffffff" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ffffff" tick={{ fill: "#ffffff" }} />
          <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
          <Tooltip contentStyle={{ backgroundColor: "#333333", color: "#ffffff" }} />
          <Bar dataKey="value" fill="#3B82F6">
            {orderStats.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {Object.entries(status).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-sm text-white">
            {key}: {value}
          </span>
        </div>
      ))}
    </div>
  </div>
  
  )
}

export default OrderGraph
