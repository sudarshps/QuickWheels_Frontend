import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Admin/Navbar/AdminNavbar'
import { ToastContainer } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import axios from '../../../api/axios'


interface CarMakeProps{
  name:string;
}
interface CarProps {
  images:string;
  carModel:string;
  make:CarMakeProps;
  registerNumber:string;
  reservedDateFrom:string;
  reservedDateTo:string;
  address:string;
}

interface OrderProps{
  carId:CarProps;
  orderId:string;
  amount:number;
  paymentId:string;
}

const OrderDetails:React.FC = () => {
    const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [orderDetails,setOrderDetails] = useState<OrderProps>()

  useEffect(()=>{
    axios.get('/getorderdetails',{
        params:{
            id
        }
    })
    .then(res=>{
        if(res.data){
            console.log('orderdet',res.data);  
            setOrderDetails(res.data)
        }
    })
  },[id])
  
  return (
    <>
      <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
      <Navbar />
      <div className="p-4 md:p-6">
        <div className="pl-44 mb-8">
          <h2 className="text-white text-xl md:text-2xl font-semibold">
            Order Details
          </h2>
          <ToastContainer/>
        </div>
        <div className="bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-md shadow-lg w-full max-w-3xl p-8 mx-auto space-y-8">
          {/* <div className="flex items-center space-x-6 ml-28">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-3xl text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">
                {userDetails?.name}
              </h1>
              <p className="text-gray-300">{userDetails?.email}</p>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="w-60 h-40 bg-gray-200 rounded flex justify-center items-center ml-28">
              <img
                src={`${orderDetails?.carId.images[0]}`}
                alt=""
              />
            </div>

            <div className="flex flex-col ml-28 gap-4">
              <h1 className="text-white text-2xl font-bold">
                <span>{orderDetails?.carId.make.name} {orderDetails?.carId.carModel}</span>
              </h1>
              <h2 className="text-white text-lg ">
                {orderDetails?.carId.registerNumber}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-white ml-28">
              <label className="text-gray-300">Order ID:</label>
              <h2 className="text-lg font-semibold mb-4">
                {orderDetails?.orderId}
              </h2>
              <label className="text-gray-300">Reserved Date:</label>

              <h2 className="text-lg font-semibold mb-4">
                {orderDetails?.carId.reservedDateFrom.slice(0,10)} - {orderDetails?.carId.reservedDateTo.slice(0,10)}
              </h2>

              <label className="text-gray-300">Total Amount:</label>

              <h2 className="text-lg font-semibold mb-4">
                {orderDetails?.amount}.00
              </h2>
            </div>
            <div className="text-white ml-28">
              <label className="text-gray-300">Car Location:</label>
              <h2 className="text-lg font-semibold mb-4">
                {orderDetails?.carId.address}
              </h2>
              <label className="text-gray-300">Payment ID:</label>

              <h2 className="text-lg font-semibold mb-4">
                {orderDetails?.paymentId}
              </h2>

              {/* <label className="text-gray-300">Car Type:</label> */}

              {/* <h2 className="text-lg font-semibold mb-4">
                {hostDetails?.carType[0].name}
              </h2> */}
            </div>
          </div>

          

          {/* <div className="flex justify-end gap-8 pe-16">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleProceed("reject")}
              onClick={() => setIsDialogOpen(true)}
            >
              Reject
            </button>
            <button
              className={`bg-blue-500 ${
                !hostDetails?.isVerified ? `hover:bg-blue-600` : ``
              } text-white font-bold py-2 px-4 rounded`}
              onClick={() => handleProceed("approve")}
              disabled={hostDetails?.isVerified ? true : false}
            >
              {hostDetails?.isVerified ? `Approved` : `Approve`}
            </button>
          </div> */}
        </div>
      </div>
      </div>
    </>
  )
}

export default OrderDetails
