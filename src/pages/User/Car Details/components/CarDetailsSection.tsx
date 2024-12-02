import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStar,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";

interface RatingProps {
  overallRating: number;
  ratingCount: number;
}

interface CarDetailsFCProps {
  carImages: string[];
  make: string;
  type: string;
  model: string;
  transmission: string;
  fuel: string;
  seat: string;
  hostName: string;
  address: string;
  features: string[];
  rating: RatingProps[] | undefined;
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
  rating,
}) => {
  useEffect(() => {
    setSelectedImg(carImages[0]);
  }, [carImages]);

  const [selectedImg, setSelectedImg] = useState(carImages[0]);
  const [enlargedImg, setEnlargedImg] = useState(false);

  return (
    <>
      {enlargedImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setEnlargedImg(false)}
        >
          <div className="relative">
            <img
              src={selectedImg}
              alt="Enlarged"
              className="md:max-w-[1366px] md:max-h-[500px] rounded-lg"
            />
            <FontAwesomeIcon
              icon={faRectangleXmark}
              className="absolute top-2 right-2 text-red-500 cursor-pointer h-6 w-6"
              onClick={(e) => {
                e.stopPropagation(); 
                setEnlargedImg(false);
              }}
            />
          </div>
        </div>
      )}
      <div className="lg:w-2/3">
        <div className="bg-gray-100 rounded-lg p-2 shadow-md overflow-hidden mb-6">
          <img
            src={selectedImg}
            alt="image"
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
            onClick={() => setEnlargedImg(true)}
          />
          <div className="mt-2 flex space-x-1 md:space-x-3">
            {carImages.map((img, ind) => (
              <img
                key={ind}
                src={`${img}`}
                alt="Interior"
                className="w-[4rem] md:w-[6rem] h-16 md:h-24 object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-100 rounded-lg p-4 gap-4">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">
            {make} <span>{model}</span>
          </h1>
          <div className="text-gray-600 mt-2">
            {transmission} · {fuel} · {seat} · {type}
          </div>
        </div>

        <div className="flex items-center text-gray-700">
          <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-3" />
          <span>Hosted by {hostName}</span>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Car Location</h2>
          <p className="text-gray-600">{address}</p>
        </div>
      </div>

      {rating && rating.length > 0 && (
        <div className="flex justify-end items-start">
          <div className="bg-white rounded-lg shadow-md p-4 w-40 text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-2xl" />
              <span className="text-yellow-500 font-bold text-3xl">
                {rating[0].overallRating.toFixed(1)}
              </span>
            </div>
            <div className="text-gray-500 text-sm">
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
