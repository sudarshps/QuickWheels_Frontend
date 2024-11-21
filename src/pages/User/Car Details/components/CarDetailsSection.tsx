import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faStar } from "@fortawesome/free-solid-svg-icons";


interface RatingProps{
  overallRating:number;
  ratingCount:number;
}

interface CarDetailsFCProps{
  carImages:string[];
  make:string;
  type:string;
  model:string;
  transmission:string;
  fuel:string;
  seat:string;
  hostName:string;
  address:string;
  features:string[];
  rating:RatingProps[] | undefined;

}

const CarDetailsSection: React.FC<CarDetailsFCProps> = ({
  carImages,
  make,
  type,
  model,
  transmission,
  fuel,
  seat,
  hostName,
  address,
  rating
}) => {    
  return (
    <>
      <div className="lg:w-2/3">
        <div className="bg-gray-100 rounded-lg p-2 shadow-md overflow-hidden mb-6">
          <img
            src={`${carImages[0]}`}
            alt="image"
            className="w-full h-96 object-cover"
          />
          <div className="mt-2 flex space-x-2">
            {carImages.slice(1).map((img, ind) => (
              <img
                key={ind}
                src={`${img}`}
                alt="Interior"
                className="w-1/3 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {make} <span>{model}</span>
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-4">
                {transmission} · {fuel} · {seat} · {type}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2" />
              <span>Hosted by {hostName}</span>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold">Car Location</h1>
              <div className="grid grid-cols-2">
                <div>
                  <h6 className="font-normal">{address}</h6>
                </div>
                <div>{/* <h6 className='font-normal'>Map</h6> */}</div>
              </div>
            </div>

            {/* <div>
            <h1 className="font-semibold">Features</h1>
           
            
          </div> */}
          </div>

          {rating && rating?.length > 0 && (
  <div className="flex flex-col items-end">
    <div className="w-32 h-20 rounded bg-white p-2 shadow-md">
      <div className="flex items-center gap-2">
        <div className="text-yellow-500 font-bold text-3xl">
          <FontAwesomeIcon icon={faStar} />
        </div>
        <div className="text-yellow-500 font-bold text-3xl">
          {rating[0].overallRating.toFixed(1)}
        </div>
        {/* <div className="text-gray-500 text-xs ml-2">(250 reviews)</div> */}
      </div>
      <div className="text-gray-500 text-xs mt-1">
        {`${rating[0].ratingCount} people rated`}
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </>
  );
};

export default CarDetailsSection;
