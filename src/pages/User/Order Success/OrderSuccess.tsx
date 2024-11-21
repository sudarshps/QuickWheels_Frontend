import React, { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Car, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import Navbar from '../../../components/User/Navbar/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';


interface CarMakeTypeProps{
  name:string
}

interface CarProps{
  make:CarMakeTypeProps;
  carModel:string;
}

interface OrderDetailsProps{
  carId:CarProps;
  pickUpDate:string;
  dropOffDate:string;
  amount:number;
  orderId:string;
}

const OrderSuccess:React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('id')

    const[orderDetails,setOrderDetails] = useState<OrderDetailsProps>()

    useEffect(()=>{
      axiosInstance.get('/orderdetails',{
        params:{
          orderId
        }
      })
      .then(res=>{
        if(res.data){
          setOrderDetails(res.data)
        }
      })
    },[])
  return (
    <>
    <Navbar/>
    <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <CardHeader>
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-red-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="mt-2 text-lg text-gray-600">Thank you for choosing our service</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-t border-b border-gray-200 py-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div className="flex items-center">
                <Car className="h-6 w-6 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Vehicle</p>
                  <p className="text-sm text-gray-600">{orderDetails?.carId.make.name} {orderDetails?.carId.carModel}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Rental Period</p>
                  <p className="text-sm text-gray-600">{orderDetails?.pickUpDate.slice(0,10)} - {orderDetails?.dropOffDate.slice(0,10)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Payment</p>
                  <p className="text-sm text-gray-600">{orderDetails?.amount}.00 - Paid</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-6 w-6 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
                  #
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Order ID</p>
                  <p className="text-sm text-gray-600">{orderDetails?.orderId}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors" onClick={()=>navigate(`/orderdetails?id=${orderId}`)}>
              View Booking Details
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need help? <a href="#" className="text-red-600 hover:text-red-700">Contact our support team</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
    </>
   
  );
}


export default OrderSuccess