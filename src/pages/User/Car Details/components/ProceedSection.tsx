import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axiosInstance from "../../../../api/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";

interface ProceedSectionFCProps{
  amount:number | undefined;
  carId:string | null;
  handleAlert:(action:string,message:string)=>void
}


const ProceedSection: React.FC<ProceedSectionFCProps> = ({ amount, carId, handleAlert }) => {
  const [selectedHours, setSelectedHours] = useState<number>();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const date = sessionStorage.getItem("date");
  const parsedDate = JSON.parse(date as string);
  const toDate = new Date(parsedDate.to);
  const fromDate =new Date(parsedDate.from);

  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    if (date) {
      const hourDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60);
      setSelectedHours(hourDiff);
    }
  }, []);

  const username = useSelector((state: RootState) => state.auth.user) as string;
  const email = useSelector((state: RootState) => state.auth.email) as string;
  const userId = useSelector(
    (state: RootState) => state.userDetails.userId
  ) as string;
  const verifiedUser = useSelector(
    (state: RootState) => state.userDetails.verifiedUser
  );

  const phone = useSelector(
    (state: RootState) => state.userDetails.phone
  ) as string;
  const navigate = useNavigate();  

  const totalAmount = Math.ceil((selectedHours??0) * (amount??0) + 1500 + 149);

  const handleLogin = () => {
    handleAlert("login", "please login to continue");
  };

  const handleVerify = () => {
    handleAlert("profile", "please verify your profile to proceed");
  };

  useEffect(() => {
    axiosInstance
      .get("/getwalletdetails", {
        params: {
          userId,
        },
      })
      .then((res) => {
        if (res.data) {
          setWalletBalance(res.data.wallet.balance);
        }
      });
  }, [userId, selectedPayment]);

  const handlePaymentSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(e.target.value);
  };

  //razor pay

  const { Razorpay } = useRazorpay();

  const makePayment = async () => {
    await axiosInstance.post("/order", { totalAmount }).then((res) => {
      if (res.data) {
        const options: RazorpayOrderOptions = {
          key: import.meta.env.VITE_RAZOR_PAY_API,
          amount: res.data.amount, // Amount in paise
          currency: res.data.currency,
          name: "QuickWheels",
          description: "Order Transaction",
          order_id: res.data.order_id, // Generate order_id on server
          handler: (response) => {
            console.log(response);
            const orderId = response.razorpay_order_id;
            const paymentId = response.razorpay_payment_id;
            const amount = res.data.amount;
            const method = "razorpay";
            axiosInstance
              .post("/successorder", {
                orderId,
                toDate,  
                fromDate,
                carId,
                paymentId,
                method,
                amount,
                userId,
              })
              .then((res) => {
                if (res.data) {
                  console.log("res", res.data);
                  navigate(`/orderplaced?id=${res.data._id}`);
                }
              });
          },
          prefill: {
            name: username,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    });
  };

  //wallet payment

  const makeWalletPayment = () => {
    if (walletBalance < totalAmount) {
      alert("Insufficient Balance!");
      return;
    }
    
    const generateOrderId = () => {
      const randomPart = Math.random().toString(36).substring(2, 10);
      const timeStampPart = Date.now().toString(36);
      return `order_${randomPart}-${timeStampPart}`;
    };

    const orderId = generateOrderId();
    const method = 'wallet'
    const paymentId = `payment_${Math.random().toString(36).substring(2, 10)}`
    axiosInstance.post("/successorder", {
      orderId,
      toDate,
      fromDate,
      carId,
      paymentId,
      method,
      amount:totalAmount,
      userId,
    }).then(res=>{
      if(res.data){
        navigate(`/orderplaced?id=${res.data._id}`);
      }
    })
  };

  const selectPayment = () => {
    setIsOpenModal(true);
  };

  return (
    <div className="lg:w-1/3">
      <div>
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Choose Payment Method</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="razorpay"
                  name="payment"
                  value="razorpay"
                  checked={selectedPayment === "razorpay"}
                  onChange={handlePaymentSelection}
                  className="mr-2"
                />
                <label htmlFor="razorpay" className="text-lg">
                  Razor Pay
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

            {selectedPayment === "razorpay" && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold">Razor Pay</h3>
                <p className="text-sm text-gray-600">
                  Complete your payment using Cards / Netbanking / Pay Later
                </p>
              </div>
            )}

            {selectedPayment === "wallet" && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold">Quick Wallet</h3>

                <p className="text-sm text-gray-800 font-semibold py-2">
                  Available Balance: ₹ {walletBalance}.00
                </p>
                <p className="text-sm text-gray-600">
                  Pay securely using your QuickWallet balance.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button
                className="bg-red-500 w-full"
                onClick={
                  selectedPayment === "razorpay"
                    ? makePayment
                    : makeWalletPayment
                }
              >
                Proceed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-red-100 rounded-lg shadow-md p-6 sticky top-20">
        <div className="border-b py-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Trip Protection Package</span>
            <span className="text-xl font-bold">₹1,500</span>
          </div>
          <button className="text-red-500 text-sm">Change</button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">Rent Amount</span>
          <div>
            <span className="text-xl font-bold">₹{amount}/hr</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">Convenience Fee</span>
          <div>
            <span className="text-xl font-bold">₹149.00</span>
          </div>
        </div>
        {selectedHours ? (
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold">Total Amount</span>
            <div>
              <span className="text-2xl font-bold">₹{totalAmount}</span>
              <button className="text-red-500 text-sm block">
                View Details
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <button
          className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors duration-300"
          onClick={
            verifiedUser && email
              ? selectPayment
              : email
              ? handleVerify
              : handleLogin
          }
        >
          PROCEED TO PAY
        </button>
      </div>
    </div>
  );
};

export default ProceedSection;
