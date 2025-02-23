import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../../../components/User/Navbar/Navbar'
import './HostStartup.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import axiosInstance from '../../../api/axiosInstance'
import Footer from '../../../components/User/Footer/Footer'
import { toast,ToastContainer } from 'react-toastify'
import Img1 from '../../../assets/hostcontent1.jpeg'
import Img2 from '../../../assets/hostcontent2.png'
import Img3 from '../../../assets/hostcontent3.png'


const HostStartup:React.FC = () => {

  const userEmail = useSelector((state: RootState) => state.auth.email);

     
      const [updatedProfile, setUpdatedProfile] = useState(false);
      const [verified, setVerified] = useState(false);


  useEffect(() => {
    const fetchUserDetails = async () => {
      
        if (userEmail) {
          try {
            await axiosInstance
              .get("/userDetails", {
                params: {
                  email: userEmail,
                },
              })
              .then((res) => {
                if (res.data) {
                  
                  setUpdatedProfile(res.data.profileUpdated)
                  setVerified(res.data.isVerified)

                }
              });
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        } else {
          console.log("Email is not provided, request not sent.");
        }
    };

    fetchUserDetails();
  }, [userEmail, updatedProfile]);

    const navigate = useNavigate()

    const handleHostRoute = () => {
      if(updatedProfile){
        if(verified){
          navigate('/hostregister')
        }else{
          toast.error('You need to verify by admin!')
          navigate('/')
        }
      }else{
        toast.error('please complete your profile details')
        navigate('/profile')
      }
    }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-8">
        <section className="relative min-h-[600px] w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16">
          <div className="flex items-center justify-center w-full order-2 md:order-1">
            <div className="w-full">
              <div className="max-w-xl mx-auto md:mx-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left">
                  Feel Free To Host With Us!
                </h1>
                <p className="text-sm md:text-base mb-8 text-center md:text-left">
                  QuickWheels makes it easy for you to earn extra income by renting out your car to trusted drivers. Simply list your car, set your availability, and watch as your vehicle works for you. With our seamless process, you can manage your bookings and communicate with renters all in one place. Join our community of car hosts today and start earning from your car with minimal effort!
                </p>
                <div className="text-center md:text-left">
                  <button 
                    className="text-red-500 bg-white border border-red-500 py-2 px-6 rounded hover:border-orange-500 hover:text-orange-500 transition duration-300"
                    onClick={handleHostRoute}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-full order-1 md:order-2">
            <img src={Img1} alt="Background" className="object-cover w-full h-full max-h-[500px]" />
          </div>
        </section>

        <section className="relative min-h-[600px] w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16">
          <div className="hidden md:flex items-center justify-center w-full">
            <img src={Img3} alt="Insurance" className="object-cover w-full h-full max-h-[500px]" />
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="w-full">
              <div className="max-w-xl mx-auto md:mx-0">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left">
                  Comprehensive Insurance Coverage
                </h2>
                <p className="text-sm md:text-base mb-8 text-center md:text-left">
                  QuickWheels provides comprehensive insurance coverage for your vehicle during rental periods, ensuring peace of mind for both hosts and renters. This coverage includes protection against damage, theft, and liability, offering you the security you need when renting out your car. You can confidently share your vehicle knowing that it's covered by a robust insurance policy, which minimizes potential risks and protects your investment. Our commitment to safety and security ensures that you and your car are well-protected throughout the rental process, making your hosting experience stress-free and reliable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[600px] w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16">
          <div className="flex items-center justify-center w-full order-2 md:order-1">
            <div className="w-full">
              <div className="max-w-xl mx-auto md:mx-0">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left">
                  Flexible Scheduling
                </h2>
                <p className="text-sm md:text-base mb-8 text-gray-600 text-center md:text-left">
                  QuickWheels empowers you with complete control over your vehicle's availability through a flexible scheduling system. You can specify the days and times your car is available for rent, accommodating your personal needs and preferences. Whether you prefer to rent out your vehicle during weekdays, weekends, or only on specific dates, our platform adapts to your schedule. This flexibility ensures that your car is earning money when it's convenient for you, without interfering with your own use. Enjoy the freedom to maximize your earnings on your terms.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-full order-1 md:order-2">
            <img src={Img2} alt="Scheduling" className="object-cover w-full h-full max-h-[500px]" />
          </div>
        </section>
      </div>

      <Footer />
    </div>

  )
}

export default HostStartup
