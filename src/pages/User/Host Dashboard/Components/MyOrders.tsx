import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import axiosInstance from "../../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";

interface UserProps {
  name:string;
}

interface CarProps{
  carModel:string;
}

interface OrdersProps{
  _id:string;
  pickUpDate:string;
  dropOffDate:string;
  status:string;
  orderId:string;
  userId:UserProps;
  carId:CarProps;
  amount:number;
}

const MyOrders: React.FC = () => {

  const[orders,setOrders] = useState<OrdersProps[]>([])
  const userId = useSelector((state:RootState)=>state.userDetails.userId)
  const navigate = useNavigate()
  
  useEffect(()=>{
    axiosInstance.get('/hostdashboardorders',{
      params:{
        hostId:userId
      }
    }).then(res=>{
      setOrders(res.data)
    })
  },[userId])

  const calculateOrderStatus = (pickUpDate: string, dropOffDate: string,status:string) => {
    const currentDate = new Date();
    const startDate = new Date(pickUpDate);
    const endDate = new Date(dropOffDate);

    if(status==='success'){        
      if (currentDate < startDate) {
        return 'Upcoming';
      } else if (currentDate >= startDate && currentDate <= endDate) {
        return 'Active';
      } else {
        return 'Completed';
      }
    }else{
      return 'Cancelled'
    }
    
  };
  
  
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'upcoming':
          return 'bg-blue-100 text-blue-800'
        case 'completed':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-red-500'
      }
    }    
  return (
    <>
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Orders</h2>
        <div className="relative p-6 bg-white shadow rounded mb-5 w-[115%]">
          {orders && orders?.length>0?<Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead className="text-center">Username</TableHead>
                <TableHead className="text-center">Car</TableHead>
                <TableHead className="text-center">Pick Up</TableHead>
                <TableHead className="text-center">Drop Off</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order,ind)=>{
                const status = calculateOrderStatus(
                  order?.pickUpDate,
                  order?.dropOffDate,
                  order?.status
                );
              return(
                 <TableRow key={ind}>
                 <TableCell>{order.orderId}</TableCell>
                 <TableCell>{order.userId.name}</TableCell>
                 <TableCell>{order.carId?.carModel}</TableCell>
                 <TableCell>{order.pickUpDate.slice(0,10)}</TableCell>
                 <TableCell className="text-right">{order.dropOffDate.slice(0,10)}</TableCell>
                 <TableCell className={`text-right`}>
                    <Badge className={`text-right ${getStatusColor(status)}`}>{status}</Badge>
                 </TableCell>
                 <TableCell className="text-right">₹{order.amount}.00</TableCell>
                 <TableCell className="text-right"><Button className="bg-red-500 text-white" onClick={()=>navigate(`/hostorderdetails/${order._id}`)}>View Details</Button></TableCell>
               </TableRow>
              )})}
            </TableBody> 
          </Table>:<p>No orders!</p>}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
