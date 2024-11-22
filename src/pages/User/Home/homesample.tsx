import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCarSide,
  faLocationArrow,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu.tsx";
import LocationUI from "./components/LocationUI.tsx";
import { DatePickerWithRange } from "../../../components/ui/daterangepicker.tsx";
import { DateRange } from "react-day-picker";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.tsx";
import Footer from "../../../components/User/Footer/Footer.tsx";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleLocation = (data: string) => {
    setLocation(data);
  };

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
  };

  const handleBookButton = () => {
    if (!date) {
      alert("select dates!");
      return;
    }
    navigate("/availablecars");
  };

  const userFeedback = [
    {
      content: `I had  an amazing experience 
with quickwheels. Listing my car was 
straightforward,and the rental process
 was smooth and secure.`,
      name: `Rooney`,
    },
    {
      content: `As a renter, quickwheels exceeded
 my expectations. I found the perfect car 
just a few blocks away from my apartment,
 and the owner was friendly and 
accommodating`,
      name: `Giggs`,
    },
    {
      content: `I’ve been using quickwheels for a 
few months now, both as a car owner 
and a renter. The flexibility of the 
platform allows
me to choose when to rent out my car 
and also find vehicles nearby
 when I need them.`,
      name: `Beckham`,
    },
  ];

  // useEffect(()=>{
  //   if(date){
  //     sessionStorage.setItem('date',JSON.stringify(date))
  //   }
  // },[date])

  useEffect(() => {
    if (date && date.from && date.to) {
      // Convert the dates to local time instead of UTC
      const fromLocalTime = new Date(
        date.from.getTime() - date.from.getTimezoneOffset() * 60000
      ).toISOString();

      const toLocalTime = new Date(
        date.to.getTime() - date.to.getTimezoneOffset() * 60000
      ).toISOString();

      const formattedDate = {
        from: fromLocalTime,
        to: toLocalTime,
      };

      sessionStorage.setItem("date", JSON.stringify(formattedDate));
    }
  }, [date]);

  useEffect(() => {
    const storedLocation = sessionStorage.getItem("userlocation");
    if (!storedLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            sessionStorage.setItem(
              "userlocation",
              JSON.stringify({ lng, lat })
            );
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-page relative min-h-screen w-full">
        {/* Hero Section */}
        <div className="content-1 px-4 md:px-0 md:absolute md:top-28 md:mt-8 md:left-20 pt-20 md:pt-0">
          <h1 className="text-2xl md:text-3xl font-bold">
            Enjoy Your Ride With
            <br />
            Our Best Service
          </h1>
          <p className="text-sm text-gray-500 pt-6 max-w-xl">
            We provide you the best service. Discover a seamless car rental
            experience that puts you in the driver's seat. Whether you're
            planning a quick city getaway or an epic road trip, we have the
            perfect vehicle to meet your needs. Choose from our wide range of
            cars, from compact city cars to spacious SUVs and luxury models.
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full px-4 md:px-0 md:absolute md:left-1/2 md:ml-[-24rem] md:top-[450px]">
          <div className="bg-white flex flex-col md:flex-row shadow-lg rounded-lg mt-3 items-center justify-between p-4 w-full md:min-w-[48rem]">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faLocationArrow}
                  className="text-red-500"
                />
                <section className="w-full">
                  <NavigationMenu
                    heading={
                      location.trim()
                        ? location.slice(0, 30)
                        : "Choose Your Location"
                    }
                    UI={<LocationUI getLocation={handleLocation} />}
                  />
                </section>
              </div>
            </div>

            <div className="w-full md:w-auto md:px-4 mb-4 md:mb-0">
              <DatePickerWithRange onDateChange={handleDateChange} />
            </div>

            <div className="w-full md:w-auto md:px-4">
              <button
                className="w-full md:w-auto bg-red-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-red-600"
                onClick={handleBookButton}
              >
                Book Your Ride
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-20 md:mt-40 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-red-500 font-semibold">How It Works</h1>
          <h1 className="font-bold text-2xl">Our Working Steps</h1>
          <div className="mt-4 border-b-2 border-red-400 w-28 mx-auto rounded-lg"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16 p-6 mt-10">
          <div className="text-center">
            <div className="bg-red-100 w-20 h-20 rounded-lg flex items-center justify-center mx-auto">
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className="text-red-500 text-3xl"
              />
            </div>
            <h3 className="font-semibold text-lg mt-4">Choose Location</h3>
            <p className="text-gray-500 text-sm mt-2 w-64">
              When you choose your location we’ll provide you the nearest
              available cars. So you can get it simply.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-500 w-20 h-20 rounded-lg flex items-center justify-center mx-auto">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="text-white text-3xl"
              />
            </div>
            <h3 className="font-semibold text-lg mt-4">Pick-Up Date</h3>
            <p className="text-gray-500 text-sm mt-2 w-64">
              Choose the Pick-Up date so that you can schedule the trip easily.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-100 w-20 h-20 rounded-lg flex items-center justify-center mx-auto">
              <FontAwesomeIcon
                icon={faCarSide}
                className="text-red-500 text-3xl"
              />
            </div>
            <h3 className="font-semibold text-lg mt-4">Book Your Car</h3>
            <p className="text-gray-500 text-sm mt-2 w-64">
              Book your favorite car and enjoy your trip.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="home-page-s2 mt-10 relative min-h-screen w-full">
        <div className="content-1 px-4 md:px-0 md:absolute md:top-28 md:left-1/2 md:ml-[4rem] max-w-xl py-20 md:py-0">
          <h1 className="text-xl md:text-2xl text-red-500 font-bold text-center md:text-left">
            About Us
          </h1>
          <p className="text-sm md:text-base text-gray-500 pt-4 text-center md:text-left">
            We are redefining the way people think about car rental. Our
            platform connects car owners with individuals in need of a ride,
            creating a community where mobility is shared, convenient, and
            sustainable. We empower car owners to turn their vehicles into
            income-generating assets while offering renters a diverse selection
            of cars to suit their needs and budgets. Our commitment to safety,
            transparency, and ease of use makes us a trusted choice in the
            car-sharing market. Join us in driving a future where every journey
            is a shared adventure.
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="px-4 md:px-20 py-10">
        <div className="text-center">
          <h1 className="text-red-500 font-semibold">Feedback</h1>
          <h1 className="font-bold text-2xl">What Our Customers Says</h1>
          <div className="mt-4 border-b-2 border-red-400 w-28 mx-auto rounded-lg"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16 mt-10">
          {userFeedback.map((data, ind) => (
            <Card key={ind} className="text-center w-full md:w-96 shadow-md">
              <CardHeader className="space-y-6">
                <CardTitle className="text-yellow-500">★★★★★</CardTitle>
                <CardDescription className="text-black">{`❝${data.content}❞`}</CardDescription>
              </CardHeader>
              <CardContent className="font-semibold">
                <p>{data.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
