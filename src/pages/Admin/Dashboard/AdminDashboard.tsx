import React,{useEffect, useState} from "react";
import Navbar from "../../../components/Admin/Navbar/AdminNavbar";
import Stats from './Components/Stats'
import OrderGraph from "./Components/OrderGraph";
import LeaderBoard from "./Components/LeaderBoard";
import OrderTable from "./Components/OrderTable";
import axios from "../../../api/axios";

interface OrderDetailsProps{
  pickUpDate:string;
  dropOffDate:string;
  status:string;
}

const Dashboard: React.FC = () => {
  const [orderDetails,setOrderDetails] = useState<OrderDetailsProps[]>([])
  const [statusCounts, setStatusCounts] = useState({ active: 0, completed: 0, upcoming: 0 });
  const revenueTotal = () => {
    let total = 0
    orderDetails?.map(order=>{
      if(order.status==='success'){
        total+=149
      }
  })
  return total
  }

  const totalRevenue = revenueTotal()

  useEffect(()=>{
    axios.get('/allorderdetails').then(res=>{
        setOrderDetails(res.data)

        const now = new Date();

    let active = 0;
    let completed = 0;
    let upcoming = 0;

    (res.data as OrderDetailsProps[])?.forEach(order => {
      const pickupDate = new Date(order.pickUpDate);
      const dropoffDate = new Date(order.dropOffDate);
      if(order.status==='success'){
        if (now >= pickupDate && now <= dropoffDate) {
          active++;
        } else if (now > dropoffDate) {
          completed++;
        } else if (now < pickupDate) {
          upcoming++;
        }
      }

    })

    setStatusCounts({ active, completed, upcoming });
    })
    

},[])
  return (
    <>
      <div className="min-h-screen bg-[#0A0C2D] px-12">
        <Navbar />
        <div className="p-6 mt-10 bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-xl max-w-6xl mx-auto">
        <Stats totalOrders={totalRevenue/149} totalRevenue={totalRevenue}/>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <OrderGraph status={statusCounts}/>
           <LeaderBoard/>
          </div>
          <OrderTable/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
