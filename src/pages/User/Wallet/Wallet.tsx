import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import { Wallet, Calendar, IndianRupee } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Footer from "../../../components/User/Footer/Footer";

interface HistoryProps {
  amount: number;
  date: string;
  reason: string;
  type: string;
}
interface WalletObjProps {
  balance: number;
  history: HistoryProps[];
}

interface WalletProps {
  wallet: WalletObjProps;
}

const WalletUI: React.FC = () => {
  const userId = useSelector(
    (state: RootState) => state.userDetails.userId
  ) as string;
  const [walletDetails, setWalletDetails] = useState<WalletProps>();
  useEffect(() => {
    axiosInstance
      .get("/getwalletdetails", {
        params: {
          userId,
        },
      })
      .then((res) => {
        if (res.data) {
          setWalletDetails(res.data);
        }
      });
  }, [userId]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl px-4 mt-24">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-red-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">My Wallet</CardTitle>
                <Wallet className="h-6 w-6" />
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="mb-6">
                <p className="text-gray-600 text-sm">Available Balance</p>
                <h2 className="text-3xl font-bold text-gray-900">
                  ₹{walletDetails?.wallet.balance}.00
                </h2>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Recent Transactions
                </h3>
                {walletDetails && walletDetails?.wallet?.history?.length > 0 ? (
                  <div className="space-y-4">
                    {walletDetails?.wallet.history.map((transaction, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Transaction Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "Credit"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              <IndianRupee
                                className={`h-4 w-4 ${
                                  transaction.type === "Credit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.reason}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                transaction.type === "Credit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "Credit" ? "+" : "-"}₹
                              {transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h1 className="font-semibold">No Transactions!</h1>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default WalletUI;
