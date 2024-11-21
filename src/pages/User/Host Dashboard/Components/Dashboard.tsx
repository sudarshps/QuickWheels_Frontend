import React, { useEffect, useState } from 'react'
import { Card } from "../../../../components/ui/card"
import { Select } from "../../../../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table"
import { Check,IndianRupee } from "lucide-react"
import { OrderStatusChart } from './Dashboard Component/OrderStatusChart'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import axiosInstance from '../../../../api/axiosInstance'


interface MetricCardProps{
  id:string;
  title:string;
  value:string;
  subtext:string;
}

interface UserProps {
  name:string;
  address:string;
}

interface CarProps {
  carModel:string
}

interface OrderDetailsProps{
  userId:UserProps;
  carId:CarProps;
  pickUpDate:string;
  dropOffDate:string;
  status:string;
  amount:number;
}

interface OrderTableProps{
  orderDetails:OrderDetailsProps[]
}

const MetricCard = ({id, title, value, subtext }:MetricCardProps) => (
  <Card className="p-6 flex flex-col items-start">
    <div className="text-4xl font-bold text-green-500 flex items-center gap-2">
      {id==='3'?`+ ${value}`:`${value}`}
      <span className="text-sm text-gray-500">{subtext}</span>
    </div>
    <div className="text-sm text-gray-500 mt-2">{title}</div>
    <div className="mt-4 bg-green-100 rounded-full p-2">
      {id==='1'?<Check className="text-green-500" />:id==='3'?<IndianRupee className="text-green-500"/>:''}
    </div>
  </Card>
)

const SalesChart = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      {/* <div className="flex gap-2">   
        <Button variant="outline" size="sm">Month</Button>
        <Button variant="outline" size="sm">Week</Button>
        <Button variant="default" size="sm">Day</Button>
      </div> */}
      <Select>
        <option>Monthly Orders</option>
      </Select>
    </div>
    <div className="h-64 bg-gray-100 rounded flex items-end">
      <div className="w-full h-full bg-gradient-to-t from-red-200 to-red-500 rounded" />
    </div>
  </div>
)


const OrderTable = ({orderDetails}:OrderTableProps) => {  
 return (
 <Card>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Orders</h3>
        {/* <Select>
          <option>SORT LIST BY</option>
        </Select> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="w-[100px]">Product</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Pickup-Date</TableHead>
            <TableHead>Dropoff-Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderDetails?.map((item:OrderDetailsProps, index:number) => (
            <TableRow key={index}>
              {/* <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Image src={item.img} alt={item.name} width={40} height={40} className="rounded" />
                  <span>{item.name}</span>
                </div>
              </TableCell> */}
              <TableCell>{item.userId.name}</TableCell>
              <TableCell>{item.carId.carModel}</TableCell>
              <TableCell>{item.userId.address.split(' ')[0]}</TableCell>
              <TableCell>{item.pickUpDate.slice(0,10)}</TableCell>
              <TableCell>{item.dropOffDate.slice(0,10)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'success' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              {/* <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <div className="flex justify-center mt-4 gap-2">
        <Button variant="outline" size="sm">1</Button>
        <Button variant="default" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">4</Button>
        <Button variant="outline" size="sm">5</Button>
      </div> */}
    </div>
  </Card>
 )
}

const Dashboard:React.FC = () => {
  const hostId = useSelector((state:RootState)=>state.userDetails.userId)
  const [orderDetails,setOrderDetails] = useState<OrderDetailsProps[]|[]>([])
  const [statusCounts, setStatusCounts] = useState({ active: 0, completed: 0, upcoming: 0 });

  const totalEarnings = () => {
    const orderLength = orderDetails?.length
    const reductions = orderLength * (149+1500)
    let totalAmount = 0
        orderDetails?.map((val)=>{
          totalAmount += val.amount 
        })
        return totalAmount - reductions
  }  

  useEffect(()=>{
    axiosInstance.get('/hostdashboardorders',{
      params:{
        hostId
      }
    }).then(res=>{
      setOrderDetails(res.data)

      const now = new Date();

    let active = 0;
    let completed = 0;
    let upcoming = 0;

    res.data?.forEach((order:OrderDetailsProps) => {
      const pickupDate = new Date(order.pickUpDate);
      const dropoffDate = new Date(order.dropOffDate);

      if (now >= pickupDate && now <= dropoffDate) {
        active++;
      } else if (now > dropoffDate) {
        completed++;
      } else if (now < pickupDate) {
        upcoming++;
      }
    });
    setStatusCounts({ active, completed, upcoming });
    })
  },[])
  
  return (
    <div className="min-h-screen p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard id="1" title="ORDER RECEIVED" value={`${orderDetails?.length}`} subtext="" />
        {/* <MetricCard id='2' title="TOTAL CHARGES" value="2390" subtext="" /> */}
        <MetricCard id="3" title="TOTAL EARNINGS" value={`₹${totalEarnings()}`} subtext="" />
      </div>
  
      {/* Sales Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:ms-20">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-2">
          <OrderStatusChart active={statusCounts.active} completed={statusCounts.completed} upcoming={statusCounts.upcoming} />
        </div>
      </div>
  
      {/* Order Table Section */}
      <OrderTable orderDetails={orderDetails} />
    </div>
  </div>
  
  )
}

export default Dashboard
