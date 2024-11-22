import React,{useEffect,useState} from 'react'
import axios from '../../../../api/axios'

interface UserProps{
  name:string;
}

interface CarProps{
  userId:UserProps
  carModel:string;
}
interface OrderProps{
  userId:UserProps
  carId:CarProps;
  pickUpDate:string;
  dropOffDate:string;
  status:string;
}

const OrderTable:React.FC = () => {

  const [orders,setOrders] = useState<OrderProps[]>([])

  useEffect(()=>{
    axios.get('/recentorders')
    .then(res=>{
      setOrders(res.data)
    })
  },[])

  return (
    <div className="bg-gradient-to-br from-[#1c1d73] to-[#2a32c8] rounded-xl p-4 text-white">
  <h2 className="mb-5 font-bold text-lg md:text-xl">Recent Orders</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-sm md:text-base">
      <thead>
        <tr className="text-left">
          <th className="py-2 px-3">Username</th>
          <th className="py-2 px-3">Hostname</th>
          <th className="py-2 px-3">Car Model</th>
          <th className="py-2 px-3">Rent Date</th>
          <th className="py-2 px-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={index} className="border-b">
            <td className="py-3 px-3">{order.userId.name}</td>
            <td className="px-3">{order.carId.userId.name}</td>
            <td className="px-3">{order.carId.carModel}</td>
            <td className="px-3">
              {order.pickUpDate.slice(0, 10)} - {order.dropOffDate.slice(0, 10)}
            </td>
            <td className="px-3">{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  )
}

export default OrderTable
