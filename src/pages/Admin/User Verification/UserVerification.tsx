import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Admin/Navbar/AdminNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Dialog from "../../../components/Dialog/Dialog";
import axios from '../../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const UserVerification: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  interface UserDetails {
    name: string;
    email: string;
    address: string;
    dob: string;
    drivingExpDate: string;
    drivingID: string;
    drivingIDBack: string;
    drivingIDFront: string;
    phone: string;
    isVerified:boolean;
  }

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [frontIsEnlarged, setFrontIsEnlarged] = useState(false);
  const [backIsEnlarged, setBackIsEnlarged] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refresh,setRefresh] = useState(false)

  useEffect(() => {
    axios
      .get("/getuserdetails", {
        params: {
          id: id,
        },
      })
      .then((res) => setUserDetails(res.data));
  }, [id,refresh]);

  const handleProceed = (status: string, reasonNote:string) => {
    let userStatus = "Verified"
    let note = ''
    if(status==="reject"){
      note = reasonNote
      userStatus = "Not Verified"
    }
    
      axios
        .post("/verifyuser", { userStatus, id,note })
        .then((res) => {
          if (res.data.statusUpdated) {
            toast.success('status updated', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
              });
              setRefresh(prev => !prev)
          }else{
            toast.success('status updated', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
              });
              setRefresh(prev => !prev)

          }
        });
  };

  const handleReason = (reason:string) => {
    handleProceed('reject',reason)
  }

  return (
    <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
      <Navbar />
      <div className="p-4 md:p-6">
        <div className="pl-44 mb-8">
          <h2 className="text-white text-xl md:text-2xl font-semibold">
            User Verification
          </h2>
        </div>
        <ToastContainer/>

        <div className="bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-md shadow-lg w-full max-w-3xl p-8 mx-auto space-y-8">
          <div className="flex items-center space-x-6 ml-28">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-white ml-28">
              <label className="text-gray-300">Address:</label>
              <h2 className="text-lg font-semibold mb-4">
                {userDetails?.address}
              </h2>
              <label className="text-gray-300">Phone:</label>

              <h2 className="text-lg font-semibold mb-4">
                {userDetails?.phone}
              </h2>

              <label className="text-gray-300">Date of Birth:</label>

              <h2 className="text-lg font-semibold mb-4">{userDetails?.dob}</h2>
            </div>
            <div className="text-white ml-28">
              <label className="text-gray-300">Driving Licence ID:</label>
              <h2 className="text-lg font-semibold mb-4">
                {userDetails?.drivingID}
              </h2>
              <label className="text-gray-300">Expiry Date:</label>

              <h2 className="text-lg font-semibold mb-4">
                {userDetails?.drivingExpDate}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center ml-8">
              <h2 className="text-lg text-white mb-2">License Front</h2>
              <div className="w-40 h-24 bg-gray-200 rounded-md">
                <img
                  src={`${userDetails?.drivingIDFront}`}
                  alt="License Front"
                  className={`w-full h-full object-cover transform transition-transform duration-300 hover:scale-150 ${
                    frontIsEnlarged ? "scale-200" : "scale-100"
                  }`}
                  onClick={() => setFrontIsEnlarged(!frontIsEnlarged)}
                />
              </div>
            </div>

            <div className="flex flex-col items-center ml-8">
              <h2 className="text-lg text-white mb-2">License Back</h2>
              <div className="w-40 h-24 bg-gray-200 rounded-md">
                <img
                  src={`${userDetails?.drivingIDBack}`}
                  alt="License Back"
                  onClick={() => setBackIsEnlarged(!backIsEnlarged)}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-150 "
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-8 pe-16">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsDialogOpen(true)}
            >
              Reject
            </button>
            <button
              className={`bg-blue-500 ${!userDetails?.isVerified?`hover:bg-blue-600`:``} text-white font-bold py-2 px-4 rounded`}
              onClick={() => handleProceed("approve",'')}
              disabled={userDetails?.isVerified?true:false}
            >
              {userDetails?.isVerified?`Approved`:`Approve`}
            </button>
          </div>
        </div>
      </div>
      {isDialogOpen ? (
        <Dialog
          dialogOpen={isDialogOpen}
          dialogClose={() => setIsDialogOpen(false)}
          reason={handleReason}
        />
      ) : undefined}
    </div>
  );
};

export default UserVerification;
