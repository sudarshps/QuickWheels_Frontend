import React, { useState,FormEvent } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import axiosInstance from "../../../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { email } = location.state || {};

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("mismatch in password!");
      return;
    }
    axiosInstance
      .patch("/updateuserpassword", { email, password })
      .then((res) => {
        if (res.data) {
          toast.success("password changed successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      })
  };
  return (
    <>
      <Navbar />
      <ToastContainer autoClose={2000} />
      <div className="main-div relative flex justify-center items-center min-h-screen">
        <div className="flex flex-col md:flex-row w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-auto p-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-xl md:text-2xl font-semibold">
                Set New Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-4 space-y-4">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                  <Input
                    id="confirmpassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SetPassword;
