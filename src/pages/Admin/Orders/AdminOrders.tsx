import React,{useEffect, useState} from 'react'
import Navbar from '../../../components/Admin/Navbar/AdminNavbar'
import axios from '../../../api/axios';
import Pagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';

interface UserProps {
  name:string;
}

interface CarProps{
  userId:UserProps
  carModel:string;
  reservedDateFrom:string;
  reservedDateTo:string;

}

interface OrderProps{
  _id:string;
  userId:UserProps
  carId:CarProps;
  status:string;
}

const AdminOrders:React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders,setOrders] = useState<OrderProps[]>([])
  const [startIndex, setStartIndex] = useState(0);
  const rowsPerPage = 5;
  const [endIndex, setEndIndex] = useState(rowsPerPage);

  const navigate = useNavigate()

  useEffect(()=>{
    axios.get('/getorderslist')
    .then(res=>{
      if(res.data){
        setOrders(res.data)
      }
    })
  },[])

  const handlePrev = () => {
    setStartIndex(startIndex - rowsPerPage);
    setEndIndex(endIndex - rowsPerPage);
  };

  const handleNext = () => {
    if (endIndex < orders.length) {
      setStartIndex(startIndex + rowsPerPage);
      setEndIndex(endIndex + rowsPerPage);
    }
  };


  return (
    <>  
    <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
      <Navbar/>
      <div className="p-4 md:p-6">
          <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
            User Orders
          </h2>
          
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 rounded-lg w-full md:w-1/2 lg:w-1/3 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


          {orders.length>0?<div className="bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-2 md:px-4">No.</th>
                  <th className="py-3 px-2 md:px-4">Username</th>
                  <th className="py-3 px-2 md:px-4">Hostname</th>
                  <th className="py-3 px-2 md:px-4">Car Model</th>
                  <th className="py-3 px-2 md:px-4">Rent Date</th>
                  <th className="py-3 px-2 md:px-4">Status</th>
                  {/* <th className="py-3 px-2 md:px-4">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {orders?.filter(order=>order?.carId!==null).slice(startIndex,endIndex).map((order,index)=>(
                        <tr key={index} className="border-b border-white/10">
                        <td className="py-3 px-2 md:px-4">{index+1}</td>
                        <td className="py-3 px-2 md:px-4">{order?.userId.name}</td>
                        <td className="py-3 px-2 md:px-4">{order?.carId.userId.name}</td>
                        <td className="py-3 px-2 md:px-4">{order?.carId.carModel}</td>
                        <td className="py-3 px-2 md:px-4">{order?.carId.reservedDateFrom?.slice(0,10)} - {order?.carId.reservedDateTo?.slice(0,10)}</td>
                        <td className="py-3 px-2 md:px-4">{order.status}</td>
                        {/* <td className="py-3 px-2 md:px-4"><button className={order.isActive?`bg-red-500 rounded-md px-3 py-1`:`bg-green-500 rounded-md px-3 py-1`} >{order.isActive?'Block':'Unblock'}</button></td> */}
                        <td className="py-3 px-2 md:px-4 text-blue-300 hover:underline cursor-pointer" onClick={()=>navigate(`/admin/orderdetails?id=${order._id}`)}>
                          View Details
                        </td>
                      </tr>
                )
                )}
              </tbody>
            </table>
          </div>:<div className="flex items-center justify-center"><p className="text-white">No Recored Found!</p></div>}
          {orders.length>rowsPerPage?<Pagination 
          dataLength={orders.length}
          startIndex={startIndex}
          endIndex={endIndex}
          prev={handlePrev}
          next={handleNext}
          textColor={"text-white mt-3"}/>:''}

          </div>
    </div>
    </>
  )
}

export default AdminOrders
