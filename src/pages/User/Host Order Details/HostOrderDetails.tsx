import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { User, Truck, IdCard, Info, CircleCheck } from "lucide-react";
import Navbar from "../../../components/User/Navbar/Navbar";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface UserProps{
  status:string;
  name:string;
  email:string;
  drivingID:string;
  drivingExpDate:string;
}

interface OrderDetailsProps{
  pickUpDate:string;
  dropOffDate:string;
  userId:UserProps;
  amount:number;
  createdAt:string;
  orderId:string;


}

const HostOrderDetails: React.FC = () => {
  const { id } = useParams();

  const [orderDetails, setOrderDetails] = useState<OrderDetailsProps>();
  const [status, setStatus] = useState("Upcoming");

  useEffect(() => {
    axiosInstance
      .get("/orderdetails", {
        params: {
          orderId: id,
        },
      })
      .then((res) => {
        setOrderDetails(res.data);
        if (res.data.status === "cancelled") {
          setStatus("Cancelled");
        } else {
          const currentDate = new Date();
          const dateFrom = new Date(orderDetails?.pickUpDate.slice(0, 10) || '');
          const dateTo = new Date(orderDetails?.dropOffDate.slice(0, 10) || '');

          if (currentDate >= dateFrom && currentDate <= dateTo) {
            setStatus("Active");
          } else if (currentDate >= dateTo) {
            setStatus("Completed");
          }
        }
      });
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-8 mt-20">
          <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
            <div className="grid grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Order Details
                </h2>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <h3 className="text-sm font-medium text-gray-500">Status:</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>
            </div>

            {/* User Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Details
                  </div>

                  {orderDetails?.userId.status === "Verified" && (
                    <div className="flex items-center text-green-500">
                      <CircleCheck className="mr-1" />
                      <p>Verified</p>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Name
                      </h3>
                      <p className="text-lg">{orderDetails?.userId.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="text-lg">{orderDetails?.userId.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-2 p-4 border rounded-lg shadow-md bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-600">
                            Driver's License
                          </h3>
                          <IdCard className="h-6 w-6 mt-1 text-gray-700" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800 mt-2">
                          <span className="text-gray-600 me-3 font-normal">
                            ID:
                          </span>
                          {orderDetails?.userId.drivingID}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires: {orderDetails?.userId.drivingExpDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Order ID
                      </h3>
                      <p className="text-lg">{orderDetails?.orderId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Order Date
                      </h3>
                      <p className="text-lg">
                        {orderDetails?.createdAt.slice(0, 10)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <TooltipProvider>
                      <Tooltip>
                        <div className="flex justify-end text-blue-500">
                          <TooltipTrigger>
                            <div className="flex items-center">
                              <Info />
                              <p className="text-lg">info</p>
                            </div>
                          </TooltipTrigger>
                        </div>
                        <TooltipContent className="bg-gray-50">
                          <p className="text-black">
                            {`Car rental amount of ${
                              (orderDetails?.amount || 0) - 1500 - 149
                            }.00 will be credited`}
                            <br /> {`to your account after the car returned.`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-gray-600 mb-2">
                            <span>Car Rental</span>
                            <span>{(orderDetails?.amount || 0) - 1500 - 149}.00</span>
                          </div>
                          <div className="flex justify-between text-gray-600 mb-2">
                            <span>Insurance</span>
                            <span>1500.00</span>
                          </div>
                          <div className="flex justify-between text-gray-600 mb-2">
                            <span>Convenience Fee</span>
                            <span>149.00</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold text-green-600">
                              {orderDetails?.amount}.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostOrderDetails;
