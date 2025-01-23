import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import {
  CalendarIcon,
  MapPinIcon,
  ChevronRightIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ChatUI from "../../../components/Chat/MainChatUI";
import { Socket } from "socket.io-client";
import {
  Pagination as PaginationMain,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import Footer from "../../../components/User/Footer/Footer";

interface OrderFCProps {
  socket: Socket;
}

interface CarMakeProps {
  name: string;
}

interface UserProps {
  _id: string;
}

interface CarProps {
  make: CarMakeProps;
  userId: UserProps;
  carModel: string;
  address: string;
}

interface OrdersProps {
  _id: string;
  pickUpDate: string;
  dropOffDate: string;
  status: string;
  carId: CarProps;
  orderId: string;
  amount: number;
}

const Orders: React.FC<OrderFCProps> = ({ socket }) => {
  const userId = useSelector(
    (state: RootState) => state.userDetails.userId
  ) as string;
  // const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrdersProps[]>([]);
  const [hostId, setHostId] = useState("");
  const [chatId, setChatId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0)

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage-1)
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage+1)
    }
  };

  const buttonTrigger = (hostId: string) => {
    setHostId(hostId);
    axiosInstance
      .post("/chat/accesschat", { receiverId: hostId, senderId: userId })
      .then((res) => {
        if (res.data) {
          setChatId(res.data._id);
          setIsOpen(true);
        }
      });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const calculateOrderStatus = (
    pickUpDate: string,
    dropOffDate: string,
    status: string
  ) => {
    const currentDate = new Date();
    const startDate = new Date(pickUpDate);
    const endDate = new Date(dropOffDate);

    if (status === "success") {
      if (currentDate < startDate) {
        return "Upcoming";
      } else if (currentDate >= startDate && currentDate <= endDate) {
        return "Active";
      } else {
        return "Completed";
      }
    } else {
      return "Cancelled";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-red-500";
    }
  };

  useEffect(() => {
    axiosInstance
      .get("/userorders", {
        params: {
          userId,page:currentPage
        },
      })
      .then((res) => {
        setTotalPages(res.data.totalPages)
        setOrders(res.data.response);
      });
  }, [currentPage,userId]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-10 mt-20">
          <div className="container mx-auto">
            {/* <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Orders</h1>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            {orders.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, ind) => {
                      const status = calculateOrderStatus(
                        order?.pickUpDate,
                        order?.dropOffDate,
                        order?.status
                      );
                      return (
                        <TableRow key={ind}>
                          <TableCell>
                            <div className="font-medium">
                              {order?.carId.make.name} {order?.carId.carModel}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Order ID: <br />
                              {order?.orderId}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-sm">
                                {order?.pickUpDate.toString().slice(0, 10)} to{" "}
                                {order?.dropOffDate.toString().slice(0, 10)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPinIcon className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-sm">
                                {order?.carId.address.split(" ")[0]}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(status)}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">
                              {order?.amount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/orderdetails?id=${order?._id}`)
                                }
                              >
                                View Details
                                <ChevronRightIcon className="ml-2 h-4 w-4" />
                              </Button>
                              {/* {order.status === 'Upcoming' && (
                       <Button variant="destructive" size="sm">Cancel</Button>
                     )} */}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">
                              <button
                                className="px-2 py-2 rounded bg-red-500 text-white flex items-center"
                                onClick={() =>
                                  buttonTrigger(order?.carId.userId._id)
                                }
                              >
                                <MessageSquare /> Connect Host
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <PaginationMain>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={handlePrev} className="hover:cursor-pointer"/>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" size={"default"}>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={handleNext} className="hover:cursor-pointer"/>
                    </PaginationItem>
                  </PaginationContent>
                </PaginationMain>
              </div>
            ) : (
              <h1 className="font-semibold">No Orders Found!</h1>
            )}
            {orders === null && (
              <div className="text-center py-10">
                <p className="text-xl text-gray-500">No orders found</p>
              </div>
            )}
          </div>
          {isOpen ? (
            <ChatUI
              isChatOpen={isOpen}
              onClose={handleClose}
              hostId={hostId}
              chatId={chatId}
              socket={socket}
            />
          ) : (
            ""
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Orders;
