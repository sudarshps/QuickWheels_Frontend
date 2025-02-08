import React,{useEffect, useState,useCallback} from "react";
import { Input } from "../../../../components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";

interface ChildProps{
    getLocation:(data:string) => void
}

interface Suggestion {
  address_line1: string;
  address_line2?: string; 
  lon:number;
  lat:number;
}

interface SuggestionsResponse {
results: Suggestion[];
}

const LocationUI: React.FC<ChildProps> = ({getLocation}) => {

    const[userLocation,setUserLocation] = useState('')
    const [suggestions, setSuggestions] = useState<SuggestionsResponse>();
    const [hideAddressList, setHideAddressList] = useState(false);

    const handleLocation = (data:string) => {
        getLocation(data)
    }

    const handleLocationSelection = (e:React.ChangeEvent<HTMLInputElement>) => {
      const locationInput = e.target.value
      setUserLocation(locationInput)
      addressAutoComplete(locationInput)
    }


    const addressAutoComplete = useCallback(
      debounce((location:string)=>{
        fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${location}&format=json&apiKey=${import.meta.env.VITE_LOCATION_API}`)
    .then(response => response.json())
    .then(result => {
      setHideAddressList(true)
      setSuggestions(result)
      console.log(result);
    })
    .catch(error => console.log('error', error));
      },2000),[])

    const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          sessionStorage.setItem('userlocation',JSON.stringify({lng,lat}))
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleAddressSelection = (location:string,lng:number,lat:number) => {
    setUserLocation(location)
    sessionStorage.setItem('userlocation',JSON.stringify({lng,lat}))
    handleLocation(location)
    setHideAddressList(false)
  }

  useEffect(()=>{
    const storedLocation = sessionStorage.getItem('userlocation')
    if(storedLocation){
      const {lng,lat} = JSON.parse(storedLocation)
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
    <div className="m-4">
        <div className="flex gap-8 h-20 md:h-full">
      <Input
        type="text"
        placeholder="Enter location"
        className="md:w-80 md:h-12"
        value={userLocation}
        onChange={handleLocationSelection}
      />
      <div>
        <button className="bg-red-500 text-white text-xs px-2 py-2 rounded-lg hover:bg-red-600 flex items-center"
        onClick={getUserLocation}
        >
            <FontAwesomeIcon icon={faLocationCrosshairs} className="text-lg"/>
          <span>Current Location</span>
        </button>
      </div>
    </div>
    {hideAddressList && suggestions?.results && suggestions.results.length > 0 && (
        <ul className="border border-gray-300 mt-1 rounded bg-white">
          {suggestions.results.map((suggestion, index) => (
            <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={()=>handleAddressSelection(`${suggestion.address_line1} ${suggestion.address_line2}`,suggestion.lon,suggestion.lat)}>
              {suggestion.address_line1} <span className="text-gray-500">{suggestion.address_line2}</span>
    
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
};

export default LocationUI;
