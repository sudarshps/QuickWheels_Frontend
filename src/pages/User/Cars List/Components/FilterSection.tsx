import React, { useEffect, useState } from "react";
import { TooltipDemo } from "./Tooltip";
import axiosInstance from "../../../../api/axiosInstance";

interface FilterSectionProps {
  onSortChange: (
    sort: string,
    transmission: string[],
    fuel: string[],
    seat: string[],
    distance:number[],
    carType:string[],
    search:string,
    carMake:string
  ) => void;
  search:string
}

interface MakeTypeProps{
  name:string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onSortChange,search }) => {
  const [transmission, setTransmission] = useState<string[]>([]);
  const [fuel, setFuel] = useState<string[]>([]);
  const [seat, setSeat] = useState<string[]>([]);
  const [sort, setSort] = useState("Relevance");
  const [carMake,setCarMake] = useState('')
  const [distance,setDistance] = useState([0])
  const [type,setType] = useState<MakeTypeProps[]>([])
  const [make,setMake] = useState<MakeTypeProps[]>([])
  const [carType,setCarType] = useState<string[]>([])

    
  const handleTransmission = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setTransmission([...transmission, value]);
    } else {
      setTransmission(transmission.filter((item) => item !== value));
    }
  };

  const handleFuelType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setFuel([...fuel, value]);
    } else {
      setFuel(fuel.filter((item) => item !== value));
    }
  };

  const handleSeatType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setSeat([...seat, value]);
    } else {
      setSeat(seat.filter((item) => item !== value));
    }
  };

  const handleCarType = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setCarType([...carType, value]);
    } else {
      setCarType(carType.filter((item) => item !== value));
    }
  }
  

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
  };

  const handleDistanceChange = (value:number[]) =>{
    setDistance(value)
  }
  
  useEffect(() => {    
    onSortChange(sort, transmission, fuel, seat, distance, carType,search,carMake);
  }, [search]);

  useEffect(()=> {
    axiosInstance.get('/getcartype')
    .then(res=>{
      setType(res.data)
    })

    axiosInstance.get('/getcarmake')
    .then(res=>{
      setMake(res.data)
    })
  },[])

  return (
    <>

      <aside className="w-full md:w-1/4 pr-8 border-b border-double border-gray-300">
        <div className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md mb-4">
          Filters
        </div>
        <div className="custom-scrollbar space-y-6 h-80 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-red-500">
          <div>
            <h3 className="font-semibold mb-2">Sort By</h3>
            <div className="flex items-center">
              <select
                onChange={handleSortChange}
                className="pl-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option>Relevance</option>
                <option value="lowtohigh">Price: Low to High</option>
                <option value="hightolow">Price: High to Low</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Distance</h3>
            <TooltipDemo onDistanceChange={handleDistanceChange}/>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Car Make</h3>
            <div className="flex items-center">
              <select
                onChange={e=>setCarMake(e.target.value)}
                className="pl-3 pr-8 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option>Select</option>
                {make.map((make,ind)=>(
                  <option key={ind} value={make.name}>{make.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Delivery Type</h3>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-red-500" />
              <span className="ml-2">Home Delivery</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Additional delivery charges applicable
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Car Details</h3>
            <h4 className="text-sm text-gray-600 mb-1">
              Filter by Transmission
            </h4>
            {["Manual", "Automatic"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleTransmission}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="text-sm text-gray-600 mb-1">Filter by Car Type</h4>
            {type.map((type,ind) => (
              <label key={ind} className="flex items-center">
                <input
                  type="checkbox"
                  value={type.name}
                  onChange={handleCarType}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type.name}</span>
              </label>
            ))}
          </div>

          <div>
          <h4 className="text-sm text-gray-600 mb-1">Filter by Fuel Type</h4>
            {["Petrol", "Diesel", "EV"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleFuelType}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="text-sm text-gray-600 mb-1">
              Filter by Seat Capacity
            </h4>
            {["4-5 Seater", "6-7 Seater"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleSeatType}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <button
              className="bg-red-500 text-white px-12 py-2 rounded-md hover:bg-red-600 transition-colors duration-100 whitespace-nowrap"
              onClick={() => onSortChange(sort, transmission, fuel, seat, distance,carType,search,carMake)}>
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSection;
