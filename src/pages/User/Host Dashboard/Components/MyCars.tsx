import React,{useEffect,useState} from 'react'
import axiosInstance from "../../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "../../../../components/Tooltip/Tooltip";
import {
  faClock,
  faCircleCheck,
  faCircleXmark,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { DatePickerWithRange } from "../../../../components/ui/daterangepicker";
import { DateRange } from "react-day-picker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CarProps{
  _id:string;
  status:string;
  note:string;
  images:string[];
  registerNumber:string;
  carModel:string;
  insuranceExp:string;
  availabilityFrom:string;
  availabilityTo:string;

}

const MyCars:React.FC = () => {
    const email = useSelector((state: RootState) => state.auth.email);
  const [refresh, setRefresh] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState<
    DateRange | undefined
  >();
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarProps[]>([]);

  const handleDate = (date: DateRange | undefined) => {    
    setAvailabilityDate(date);
  };

  useEffect(() => {
    if (email) {
      try {
        axiosInstance
          .get("/getcardetails", {
            params: { email },
          })
          .then((res) => {
            if (res.data) {
              setCars(res.data);
            }
          });
      } catch (error) {
        console.error("error in fetching car details", error);
      }
    }
  }, [email, refresh]);

  const handleAvailabilitySet = (action:string,carId:string) => {
    let dateFrom = null;
    let dateTo = null;
    if (action === "list") {
      dateFrom = availabilityDate?.from?.toISOString().slice(0,10)
      dateTo = availabilityDate?.to?.toISOString().slice(0,10)      
    }      
    axiosInstance
      .put("/setavailablitydate", { dateFrom, dateTo, carId })
      .then((res) => {
        if (res.data.dateUpdated) {
          toast.success("Date set successfully!");
          setRefresh((prev) => !prev);
        } else {
          toast.error("Date was not updated!");
          setRefresh((prev) => !prev);
        }
      });
  };

  const handleRemove = (carId:string) => {
      axiosInstance.delete('/removecarfromhost',{data:{carId}})
      .then(res=>{
        if(res.data.isRemoved){
          toast.success(res.data.message)
          setRefresh(prev => !prev)
        }else{
          toast.error(res.data.message)
          setRefresh(prev => !prev)
        }
      })
  }

  return (
    <div className="w-3/4 p-6">
        <ToastContainer />
    <h2 className="text-2xl font-bold text-gray-800 mb-5">My Cars</h2>
    {cars.length ?
      cars.map((car) => (
        <div className="relative p-6 bg-white shadow rounded mb-5">
          <span className="absolute top-2 right-2 text-gray-700 px-2 py-1 rounded">
            {car.status === "Verification Pending" ? (
              <div className="text-gray-500">
                <FontAwesomeIcon icon={faClock} />
                {car.status}
              </div>
            ) : car.status === "Verified" ? (
              <div className="text-green-500">
                <FontAwesomeIcon icon={faCircleCheck} />
                {car.status}
              </div>
            ) : (
              <Tooltip
                content={car.note}
                elements={
                  <div className="text-red-500">
                    <FontAwesomeIcon icon={faCircleXmark} />
                    {car.status}
                  </div>
                }
              />
            )}
          </span>

          <div className="flex">
            <img
              src={`${car.images[0]}`}
              alt="Car"
              className="w-40 h-24 object-cover rounded"
            />
            <div className="ml-4">
              <h3 className="text-xl font-bold">
                {car.registerNumber}
              </h3>
              <p className="text-lg font-semibold">{car.carModel}</p>
              <p>
                Insurance:{" "}
                <span className="text-green-600">
                  {car.insuranceExp}
                </span>
              </p>
              <p className="flex items-center  ">
                Availability:{" "}
                <span className="ms-2">
                  {car.availabilityFrom?.toString().slice(0, 10)} -{" "}
                  {car.availabilityTo?.toString().slice(0, 10)}
                </span>
              </p>
              <p className="mt-4 flex">
                <span>
                  <DatePickerWithRange onDateChange={handleDate} />
                </span>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 ms-2 text-sm rounded mr-2"
                  onClick={() => handleAvailabilitySet("list",car._id)}
                >
                  List
                </button>

                {car.availabilityFrom ? (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 ms-2 text-sm rounded mr-2"
                    onClick={() => handleAvailabilitySet("unlist",car._id)}
                  >
                    Unlist
                  </button>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
          <div className="flex grid grid-cols-2 mt-4">
                <div>
                <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/editcardetails?id=${car._id}`)}
            >
              View Details
            </button>
                </div>
           <div className="flex justify-end w-full">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={()=>handleRemove(car._id)}>
            <FontAwesomeIcon icon={faTrash} /> Remove
            </button>
           </div>
          </div>
        </div>
      )):<h1>No cars available</h1>}
  </div>
  )
}

export default MyCars
