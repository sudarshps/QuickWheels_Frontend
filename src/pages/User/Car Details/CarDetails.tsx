import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import CarDetailsSection from "./components/CarDetailsSection";
import ProceedSection from "./components/ProceedSection";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/User/Footer/Footer";

const CarDetails: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();

  const [carImages, setCarImages] = useState<string[]>([]);
  const [make, setMake] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [seat, setSeat] = useState("");
  const [features, setFeatures] = useState([]);
  const [hostName, setHostName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<number>();
  const [ratings,setRatings] = useState()
  
  useEffect(() => {
    axiosInstance
      .get("/cardetails", {
        params: {
          id,
        },
      })
      .then((res) => {        
        setCarImages(res.data.images);
        setAddress(res.data.address);
        setMake(res.data.carMake[0].name);
        setType(res.data.carType[0].name);
        setModel(res.data.carModel);
        setTransmission(res.data.transmission);
        setFuel(res.data.fuel);
        setFeatures(res.data.features);
        setSeat(res.data.seatCapacity);
        setHostName(res.data.userDetails[0].name);
        setAmount(res.data.rentAmount);
      });

      axiosInstance.get('/carreview',{
        params:{
          id
        }
      })
      .then((res)=>{
        setRatings(res.data)  
      })
  }, [id]);

  const handleAlertMessage = (action:string,message:string) => {
    
    toast.warn(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    if(action==='login'){
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }else{
      setTimeout(() => {
        navigate('/profile')
      }, 3000);
    }
    
  };

  return (
    <>
      <Navbar className="top-0" />
      <div className="flex flex-col lg:flex-row gap-8 mt-24 p-4 px-4 md:px-16">
        <ToastContainer />
        <CarDetailsSection
          carImages={carImages}
          make={make}
          type={type}
          model={model}
          transmission={transmission}
          fuel={fuel}
          seat={seat}
          hostName={hostName}
          address={address}
          features={features} 
          rating={ratings}
        />
        <ProceedSection
          amount={amount}
          carId={id}
          handleAlert={handleAlertMessage}
        />
      </div>
      <Footer/>
    </>
  );
};

export default CarDetails;
