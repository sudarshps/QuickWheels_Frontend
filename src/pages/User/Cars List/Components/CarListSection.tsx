import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlinkBlur } from "react-loading-indicators";

interface CarDetailsType {
  _id: string;
  images: string[];
  carModel: string;
  transmission: string;
  fuel: string;
  seatCapacity: string;
  rentAmount: string;
  distance:number
}

interface CarListingsProps{
  carListings:CarDetailsType[]
}

const CarListSection: React.FC<CarListingsProps> = ({ carListings }) => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(true)

  
  useEffect(()=>{    
    setTimeout(() => {
        setLoading(false)
    }, 2000);
    return ()=> {
      setLoading(true)
    }
  },[carListings])
  
  return (
    <>
      <section className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ps-4 mt-20 md:mt-0">
        {carListings.length? (
          carListings.map((car, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md h-80 overflow-hidden hover:cursor-pointer"
              onClick={() => navigate(`/cardetails?id=${car._id}`)}
            >
              <img
                src={`${car.images[0]}`}
                alt={car.carModel}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{car.carModel}</h2>
                <p className="text-gray-600 mb-2">
                  {car.transmission} · {car.fuel} · {car.seatCapacity}
                </p>
                <div className="grid grid-cols-2 items-center">
                  <div className="text-2xl font-bold">₹{car.rentAmount}/hr</div>
                  {sessionStorage.getItem("userlocation") ? (
                    <div className="text-right">
                      <span className="text-xl mr-1 font-semibold">
                        {Math.floor(car.distance / 1000)}
                      </span>
                      <span className="text-gray-600 text-sm ">KM away</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))
        ) : 
          loading && (<div className="flex items-center justify-center ms-96">
            <BlinkBlur color="#ce2b2a" size="large"/>
          </div>)} 

         
              <div className="flex items-center justify-center">
              <p className="text-white">No Matching Result!</p>
            </div>
          
      </section>
    </>
  );
};

export default CarListSection;
