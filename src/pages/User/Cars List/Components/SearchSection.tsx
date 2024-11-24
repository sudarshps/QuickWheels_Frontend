import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow,faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchSectionProps{
  onSearch:(input:string)=>void
}

const SearchSection:React.FC<SearchSectionProps>= ({onSearch}) => {

    const[searchValue,setSearchValue] = useState('')
    const[userLocation,setUserLocation] = useState('')

    const handleSearch = () => {
        onSearch(searchValue)
    }

    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
  
            sessionStorage.setItem('userlocation',JSON.stringify({lng,lat}))
            console.log(`Latitude: ${lat}, longitude: ${lng}`);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const handleLocation = (location:string) => {
      setUserLocation(location)
    }

    useEffect(()=>{
      if(sessionStorage.getItem('userlocation')){
        const storedLocation = sessionStorage.getItem('userlocation')
        const {lng,lat} = JSON.parse(storedLocation as string)
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${import.meta.env.VITE_LOCATION_API}`)
        .then(response => response.json())
        .then(result => {
          if (result.features.length) {
              handleLocation(result.features[0].properties.formatted)
          } else {
            console.log("No address found");
          }
        });      
      }
    },[])


  return (
    <>
      <div className="w-full bg-red-100 rounded-lg">
        <div className="flex flex-col md:flex-row mx-12 p-4 items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <FontAwesomeIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
              icon={faLocationArrow}
            />
            <select className="w-48 pl-10 pr-4 py-2 border border-red-300 rounded-md focus:ring-1 focus:ring-red-500 truncate" onChange={(e) => {
                  if (e.target.value === "current location") {
                    getUserLocation();
                  }
                }}>
              <option>{userLocation}</option>
              <option value='current location'>Current Location</option>
            </select>
          </div>
          <div className="relative flex-grow">
            <FontAwesomeIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              icon={faSearch}
            />
            <input
              type="text"
              placeholder="Search for models, features, etc..."
              value={searchValue}
              onChange={(e)=>setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button onClick={handleSearch} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-500 transition-colors duration-300">
            Search
          </button>
        </div>
        </div>
    </>
  )
}

export default SearchSection
