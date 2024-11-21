import React, { useState, useEffect } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import {
  CalendarIcon,
  CarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,   
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactStars from "react-rating-stars-component";
import { Input } from "../../../components/ui/input";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Footer from "../../../components/User/Footer/Footer";

const MySwal = withReactContent(Swal)

interface CarTypeMakeProps{
  name:string;
}

interface UserProps{
  name:string;
  email:string;
  phone:string;
}

interface CarProps{
  _id:string;
  images:string[];
  carModel:string;
  address:string;
  userId:UserProps;
  make:CarTypeMakeProps;

}

interface OrderDetailsProps {
  carId:CarProps;
  amount:number;
  paymentId:string;
  orderId:string;
  pickUpDate:string;
  dropOffDate:string;
  userId:UserProps;
  review:string;
}

const OrderDetails: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsProps>();
  const [status, setStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refresh,setRefresh] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const userId = useSelector((state:RootState)=>state.userDetails.userId)

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  useEffect(() => {
    axiosInstance
      .get("/orderdetails", {
        params: {
          orderId,
        },
      })
      .then((res) => {
        if (res.data) {
          setOrderDetails(res.data);
          if (res.data.status === "cancelled") {
            setStatus("Cancelled");
          } else {
            const currentDate = new Date();
            const dateFrom = new Date(res.data?.pickUpDate);
            const dateTo = new Date(res.data?.dropOffDate);

            if (currentDate >= dateFrom && currentDate <= dateTo) {
              setStatus("Active");
            } else if (currentDate >= dateTo) {
              setStatus("Completed");
            } else if (currentDate <= dateFrom) {
              setStatus("Upcoming");
            }
          }
        }
      });
  }, [refresh,orderId]);

  const handleRating = () => {
    if (!rating) {
     MySwal.fire({
      icon: "error",
      title: "Oops...",
      text: "We are expecting your rating!"
     });
      return;
    }
    const carId = orderDetails?.carId._id
    axiosInstance.post('/usercarrating',{userId,carId,orderId,rating,feedback})
    .then(res=>{
      console.log(res.data);
      setRefresh(prev => !prev)
    })
  };  

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
  }
  const handleAction = () => {
    if (selectedPayment === "wallet") {
      axiosInstance.put("/cancelorder", { id: orderId }).then((res) => {
        if (res.data) {
          if (res.data.isCancelled) {
            setStatus("Cancelled");
            toast.success("Your request for refund has been processed!");
            setIsDialogOpen(false);
          }
        }
      });
    } else {
      axiosInstance
        .post("/refund", {
          amount: orderDetails?.amount,
          paymentId: orderDetails?.paymentId,
          orderId,
        })
        .then((res) => {
          setStatus("Cancelled");
          console.log(res.data);
          Swal.fire({
            title: "Refund Processed!",
            text: `Your refund amount of ₹${res.data.razorpayResponse.amount} will be credited to your bank account within 7 business days!`,
            icon: "success"
          });
          setIsDialogOpen(false);
        });
    }
  };

  const handlePaymentSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(e.target.value);
  };

  const ratingChanged = (newRating:number) => {
    setRating(newRating);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-10 mt-20">
          <div className="min-h-screen">
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <header className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* <button
                    onClick={() => console.log("Navigate back")}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Orders
                  </button> */}
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Car Information
                      </h2>
                      <img
                        src={`${orderDetails?.carId.images[0]}`}
                        alt={`${orderDetails?.carId.make.name} ${orderDetails?.carId.carModel}`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-semibold">
                        {orderDetails?.carId.make.name}{" "}
                        {orderDetails?.carId.carModel}
                      </h3>
                      <div className="mt-2 flex items-center text-gray-600">
                        <CarIcon className="mr-2 h-4 w-4" />
                        <span>Order ID: {orderDetails?.orderId}</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Rental Details
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          <span>
                            {orderDetails?.pickUpDate.slice(0, 10)} -{" "}
                            {orderDetails?.dropOffDate.slice(0, 10)}
                          </span>
                        </div>
                        {/* <div className="flex items-center text-gray-600">
                          <ClockIcon className="mr-2 h-5 w-5" />
                          <span>
                            Pickup: {order.pickupTime} | Return:{" "}
                            {order.returnTime}
                          </span>
                        </div> */}
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="mr-2 h-5 w-5" />
                          <span>{orderDetails?.carId.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Customer Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Name
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {orderDetails?.userId.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Email
                        </h3>
                        <p className="mt-1 text-gray-900 flex items-center">
                          <MailIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {orderDetails?.userId.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Phone
                        </h3>
                        <p className="mt-1 text-gray-900 flex items-center">
                          <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {orderDetails?.userId.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Host Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Name
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {orderDetails?.carId.userId.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Email
                        </h3>
                        <p className="mt-1 text-gray-900 flex items-center">
                          <MailIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {orderDetails?.carId.userId.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Phone
                        </h3>
                        <p className="mt-1 text-gray-900 flex items-center">
                          <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {orderDetails?.carId.userId.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Amount Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Car Rental</span>
                          <span>{(orderDetails?.amount || 0) - 1500}.00</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Insurance</span>
                          <span>1500.00</span>
                        </div>
                        {/* <div className="flex justify-between text-gray-600 mb-2">
                          <span>Taxes and Fees</span>
                          <span>${order.taxes.toFixed(2)}</span>
                        </div> */}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold text-green-600">
                            {orderDetails?.amount}.00
                          </span>
                        </div>
                        {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CreditCardIcon className="mr-2 h-4 w-4" />
                          <span>Paid with Credit Card ending in 1234</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                {(status === "Upcoming" || status === "Completed" && !orderDetails?.review) && (
                  <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6">
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                      {/* <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Download Receipt
                    </button> */}
                      <button className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger>
                            {status === "Upcoming"
                              ? `Cancel Order`
                              : `Rate Your XP`}
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                <div className="flex justify-center">
                                  {status === "Upcoming"
                                    ? `Are you sure want to cancel order?`
                                    : `Share your rating and experience`}
                                </div>
                              </AlertDialogTitle>
                              {status === "Completed" ? (
                                <>
                                  <div className="flex justify-center">
                                    <ReactStars
                                      count={5}
                                      onChange={ratingChanged}
                                      size={24}
                                      isHalf={true}
                                      emptyIcon={
                                        <i className="far fa-star"></i>
                                      }
                                      halfIcon={
                                        <i className="fa fa-star-half-alt"></i>
                                      }
                                      fullIcon={<i className="fa fa-star"></i>}
                                      activeColor="#FFA500"
                                    />
                                  </div>
                                  <div className="flex justify-center">
                                    <Input
                                      className="w-64"
                                      placeholder="Write your feedback"
                                      value={feedback}
                                      onChange={(e) =>
                                        setFeedback(e.target.value)
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600 hover:text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={
                                  status === "Upcoming"
                                    ? () => setIsDialogOpen(true)
                                    : handleRating
                                }
                                className="bg-green-500 text-white hover:hover:bg-green-600"
                              >
                                {status === "Upcoming" ? `Yes` : `Submit`}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </button>
                    </div>
                  </div>
                )}
                {isDialogOpen && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Choose Refund Transfer Method</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="razorpay"
                            name="payment"
                            value="account"
                            checked={selectedPayment === "account"}
                            onChange={handlePaymentSelection}
                            className="mr-2"
                          />
                          <label htmlFor="razorpay" className="text-lg">
                            Bank Account
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="wallet"
                            name="payment"
                            value="wallet"
                            checked={selectedPayment === "wallet"}
                            onChange={handlePaymentSelection}
                            className="mr-2"
                          />
                          <label htmlFor="wallet" className="text-lg">
                            Quick Wallet
                          </label>
                        </div>
                      </div>

                      {selectedPayment === "account" && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                          <h3 className="text-lg font-semibold">
                            Account Transer
                          </h3>
                          <p className="text-sm text-gray-600">
                            Your refund will be processed within 7 business
                            days.
                          </p>
                        </div>
                      )}

                      {selectedPayment === "wallet" && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                          <h3 className="text-lg font-semibold">
                            Wallet Transfer
                          </h3>

                          <p className="text-sm text-gray-600">
                            Amount will credited within 24 hours.
                          </p>
                        </div>
                      )}

                      <DialogFooter>
                        <Button
                          className="bg-red-500 w-full"
                          onClick={handleAction}
                        >
                          Proceed
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </main>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default OrderDetails;
