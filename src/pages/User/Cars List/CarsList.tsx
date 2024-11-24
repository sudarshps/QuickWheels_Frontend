import React, { useState,useEffect } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import FilterSection from "./Components/FilterSection";
import CarListSection from "./Components/CarListSection";
import SearchSection from "./Components/SearchSection";
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Footer from "../../../components/User/Footer/Footer";

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

const CarsList: React.FC = () => { 

  const[sort,setSort] = useState('')
  const[transmission,setTransmission] = useState<string[]>([])
  const[fuel,setFuel] = useState<string[]>([])
  const[seat,setSeat] = useState<string[]>([]) 
  const[distance,setDistance] = useState<number[]>([0]) 
  const [carListings, setCarListings] = useState<CarDetailsType[]>([]);
  const [searchValue,setSearchValue] = useState('')
  const [carType,setCarType] = useState<string[]>([])
  const [carMake,setCarMake] = useState('')

  const[userSearch,setUserSearch] = useState('')
  
  const userId = useSelector((state: RootState) => state.userDetails.userId)
  
  const handleSortChange = (sort:string,transmission:string[],fuel:string[],seat:string[],distance:number[],carType:string[],search:string,carMake:string) => {    
      setSort(sort)
      setTransmission(transmission)
      setFuel(fuel)
      setSeat(seat)
      setDistance(distance)
      setUserSearch(search)
      setCarType(carType)
      setCarMake(carMake)
      
  }
  

  const handleSearch = (input:string) =>{
    setSearchValue(input)
  }
  
  useEffect(() => {
    let lng = 0
    let lat = 0
    let dateFrom = null
    let dateTo = null
    if(sessionStorage.getItem('userlocation')){
      const storedLocation = sessionStorage.getItem('userlocation')
      const coordinates = JSON.parse(storedLocation as string)
      lng = coordinates.lng
      lat = coordinates.lat  
    }

    if(sessionStorage.getItem('date')){
      const storedDate = sessionStorage.getItem('date')
      const parsedDate = JSON.parse(storedDate as string)
      dateFrom = new Date(parsedDate.from)
      dateTo = new Date(parsedDate.to)

    }
    
    axiosInstance
      .get("/getrentcardetails", {
        params:{
          sort,transmission,fuel,seat,distance,userSearch,lng,lat,carType,carMake,
          dateFrom,dateTo,userId
        }
      })
      .then((res) => {
        setCarListings(res.data);
      });
  }, [sort,transmission,fuel,seat,distance,userSearch,carType,carMake,userId]);
  

  return (
    <>
      <Navbar className="top-0" />
      <main className="container mx-auto px-4 py-8 mt-24">
      <SearchSection onSearch={handleSearch}/>

        <div className="flex flex-col md:flex-row mx-auto p-4">
          <FilterSection onSortChange={handleSortChange} search={searchValue}/>
          <CarListSection carListings={carListings}/>
        </div>
      </main>
      <Footer/>
    </>
  );
};

export default CarsList;
