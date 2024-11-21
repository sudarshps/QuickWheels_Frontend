import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Admin/Navbar/AdminNavbar";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";
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
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { OrbitProgress } from "react-loading-indicators";

interface User {
  _id: string;
  name: string;
  email: string;
  dob: string;
  phone: string;
  drivingExpDate: string;
  address: string;
  drivingID: string;
  drivingIDFront: string;
  drivingIDBack: string;
  isVerified: boolean;
  isActive: boolean;
  profileUpdated:boolean
}



const UserList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const rowsPerPage = 5;
  const [endIndex, setEndIndex] = useState(rowsPerPage);

  const [refresh,setRefresh] = useState(false)

  const handlePrev = () => {
    setStartIndex(startIndex - rowsPerPage);
    setEndIndex(endIndex - rowsPerPage);
  };

  const handleNext = () => {
    if (endIndex < users.length) {
      setStartIndex(startIndex + rowsPerPage);
      setEndIndex(endIndex + rowsPerPage);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/getuserlist");
        if (response.data) {
          const updatedProfile = response.data.filter(
            (updated:User) => updated.profileUpdated === true
          );
          setUsers(updatedProfile);
        }
      } catch (error) {
        console.error("error fetching user list", error);
      }
    };

    fetchUsers();
  }, [refresh]);


  const handleAction = (status:boolean, userId:string) => {
    const userStatus = !status;
    axios.put("/userstatus", { status: userStatus, userId }).then((res) => {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
        setRefresh(prev=>!prev)
    });
  };

  return (
    <>
      <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
        <Navbar />
        <div className="p-4 md:p-6">
          <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
            Users
          </h2>
          <ToastContainer/>
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 rounded-lg w-full md:w-1/2 lg:w-1/3 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {users.length > 0 ? (
            <div className="bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-xl shadow-lg overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-2 md:px-4">No.</th>
                    <th className="py-3 px-2 md:px-4">Name</th>
                    <th className="py-3 px-2 md:px-4">Email</th>
                    <th className="py-3 px-2 md:px-4">Phone</th>
                    <th className="py-3 px-2 md:px-4">DOB</th>
                    <th className="py-3 px-2 md:px-4">Status</th>
                    <th className="py-3 px-2 md:px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(startIndex, endIndex).map((user, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-2 md:px-4">{index + 1}</td>
                      <td className="py-3 px-2 md:px-4">{user.name}</td>
                      <td className="py-3 px-2 md:px-4">{user.email}</td>
                      <td className="py-3 px-2 md:px-4">
                        {user.phone ? user.phone : `N/A`}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        {user.dob ? user.dob : `N/A`}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        {user.isVerified ? `Verified` : `Not Verified`}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <button
                          className={
                            user.isActive
                              ? `bg-red-500 rounded-md px-3 py-1`
                              : `bg-green-500 rounded-md px-3 py-1`
                          }
                        >
                          <AlertDialog>
                            <AlertDialogTrigger>
                              {user.isActive ? "Block" : "Unblock"}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure want to{" "}
                                  {user.isActive ? `block` : `unblock`} user?
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleAction(user.isActive, user._id)
                                  }
                                >
                                  Yes
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </button>
                      </td>
                      <td
                        className="py-3 px-2 md:px-4 text-blue-300 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/userverification?id=${user._id}`)
                        }
                      >
                        View Details
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
            <OrbitProgress color="#193ddf" size="medium"/>
            <div className="flex items-center justify-center">
              <p className="text-white">No Recored Found!</p>
            </div>
            </>      
          )}
          {users.length > rowsPerPage ? (
            <Pagination
              dataLength={users.length}
              startIndex={startIndex}
              endIndex={endIndex}
              prev={handlePrev}
              next={handleNext}
              textColor={"text-white mt-3"}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      
    </>
  );
};

export default UserList;
