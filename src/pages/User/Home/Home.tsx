import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.tsx";
import { Car, Calendar, MapPin, Navigation } from "lucide-react";
import NavigationMenu from "./components/NavigationMenu";
import LocationUI from "./components/LocationUI";
import { DatePickerWithRange } from "../../../components/ui/daterangepicker";
import Navbar from "../../../components/User/Navbar/Navbar.tsx";
import Footer from "../../../components/User/Footer/Footer.tsx";
import ImageCarousel from "./components/ImageCarousel.tsx";
import AboutImg from "../../../assets/about.png";

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();

  const handleLocation = (data: string) => {
    setLocation(data);
  };

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
  };

  const handleBookButton = () => {
    if (!date) {
      toast.error("Please select the dates!");
      return;
    }
    navigate("/availablecars");
  };

  const userFeedback = [
    {
      content:
        "I had an amazing experience with quickwheels. Listing my car was straightforward, and the rental process was smooth and secure.",
      name: "Rooney",
    },
    {
      content:
        "As a renter, quickwheels exceeded my expectations. I found the perfect car just a few blocks away from my apartment, and the owner was friendly and accommodating",
      name: "Giggs",
    },
    {
      content:
        "I've been using quickwheels for a few months now, both as a car owner and a renter. The flexibility of the platform allows me to choose when to rent out my car and also find vehicles nearby when I need them.",
      name: "Beckham",
    },
  ];

  useEffect(() => {
    if (date?.from && date?.to) {
      const fromLocalTime = new Date(
        date.from.getTime() - date.from.getTimezoneOffset() * 60000
      ).toISOString();
      const toLocalTime = new Date(
        date.to.getTime() - date.to.getTimezoneOffset() * 60000
      ).toISOString();
      sessionStorage.setItem(
        "date",
        JSON.stringify({ from: fromLocalTime, to: toLocalTime })
      );
    }
  }, [date]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" theme="colored" />

      <div className="relative">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex flex-col">
                Enjoy Your Ride With Our Best Service
              </h1>
              <p className="text-lg text-gray-600">
                Discover a seamless car rental experience that puts you in the
                driver's seat. Choose from our wide range of cars, from compact
                city cars to luxury models.
              </p>
              <Card className="mt-8">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
                    <div className="flex items-center w-full md:w-1/2">
                      <MapPin className="text-red-500" />
                      <div className="w-full">
                        <NavigationMenu
                          heading={
                            location.trim()
                              ? location.slice(0, 30)
                              : "Choose Your Location"
                          }
                          UI={<LocationUI getLocation={handleLocation} />}
                        />
                      </div>
                    </div>

                    <div className="flex items-center w-full md:w-1/2 space-x-3">
                      <Calendar className="text-red-500" />
                      <div className="w-full">
                        <DatePickerWithRange onDateChange={handleDateChange} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBookButton}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
                  >
                    Book Your Ride
                  </button>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-red-500 font-semibold">How It Works</h2>
            <h3 className="text-3xl font-bold mt-2">Our Working Steps</h3>
            <div className="mt-4 w-28 h-1 bg-red-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Navigation className="w-8 h-8" />,
                title: "Choose Location",
                description: "Find the nearest available cars in your area",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Pick-Up Date",
                description: "Schedule your trip with flexible dates",
              },
              {
                icon: <Car className="w-8 h-8" />,
                title: "Book Your Car",
                description: "Select your perfect car and start your journey",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
                    index === 1
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {step.icon}
                </div>
                <h4 className="mt-6 text-xl font-semibold">{step.title}</h4>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-96 bg-gray-100 rounded-lg shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-transparent" />
                  <img
                    src={AboutImg}
                    alt="About us"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-red-500">About Us</h2>
              <p className="text-lg text-gray-600">
                We are redefining the way people think about car rental. Our
                platform connects car owners with individuals in need of a ride,
                creating a community where mobility is shared, convenient, and
                sustainable.
              </p>
              <p className="text-lg text-gray-600">
                Join us in driving a future where every journey is a shared
                adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-red-500 font-semibold">Feedback</h2>
            <h3 className="text-3xl font-bold mt-2">What Our Customers Say</h3>
            <div className="mt-4 w-28 h-1 bg-red-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userFeedback.map((feedback, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition"
              >
                <CardHeader>
                  <CardTitle className="text-yellow-500 text-center">
                    ★★★★★
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-lg italic">
                    "{feedback.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center font-semibold text-gray-900">
                    {feedback.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
