import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../../../components/User/Navbar/Navbar'
import './HostStartup.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import axiosInstance from '../../../api/axiosInstance'
import Footer from '../../../components/User/Footer/Footer'
import { toast,ToastContainer } from 'react-toastify'


const HostStartup:React.FC = () => {

  const userEmail = useSelector((state: RootState) => state.auth.email);

     
      const [updatedProfile, setUpdatedProfile] = useState(false);
      const [verified, setVerified] = useState(false);


  useEffect(() => {
    const fetchUserDetails = async () => {
      
      // if (profileUpdated) {
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
      // }
    };

    fetchUserDetails();
  }, [userEmail, updatedProfile]);

    const navigate = useNavigate()
    // const profileUpdated = useSelector((state:RootState)=>state.auth.profileUpdated)

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
    <>
      <Navbar/>
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
      <div className='host-page relative'>
        <div className="content-1 flex-none absolute top-32 mt-12 left-20">
        <h1 className='text-4xl font-bold'>
            Feel Free To Host With Us!
        </h1>
        <p className='text-xs text-gray-500 pt-8 max-w-[500px]'>
        QuickWheels makes it easy for you to earn extra income by renting out your car to trusted drivers.<br/> Simply list your car, set your availability,
         and watch as your vehicle works for you. With our seamless process,<br/> you can manage your bookings and communicate with renters all in one place.
          Join our community of car hosts today<br/> and start earning from your car with minimal effort!
        </p>
        <button className='text-red-500 border border-red-500 mt-8 font-medium py-1 px-3 rounded hover:border-orange-500 hover:text-orange-500' onClick={handleHostRoute}>Get Started</button>
        </div>
      </div>

      <div className='host-content-2 relative'>
        <div className="content-1 flex-none absolute top-32 left-1/2 px-4">
        <h1 className='text-4xl font-bold'>
        Flexible Scheduling
        </h1>
        <p className='text-xs text-gray-500 pt-8 max-w-[500px]'>
        QuickWheels empowers you with complete control over your vehicle’s availability through a flexible scheduling system. You can specify the days and times your car is available for rent, accommodating your personal needs and preferences. Whether you prefer to rent out your vehicle during weekdays, weekends, or only on specific dates, our platform adapts to your schedule. This flexibility ensures that your car is earning money when it's convenient for you, without interfering with your own use. Enjoy the freedom to maximize your earnings on your terms.
        </p>
        </div>
      </div>

      <div className='host-content-3 relative'>
        <div className="content-1 flex-none absolute top-32 left-36 px-4">
        <h1 className='text-4xl font-bold'>
        Comprehensive Insurance<br></br> 
        Coverage
        </h1>
        <p className='text-xs text-gray-500 pt-8 max-w-[500px]'>
        QuickWheels provides comprehensive insurance coverage for your vehicle during rental periods, ensuring peace of mind for both hosts and renters. This coverage includes protection against damage, theft, and liability, offering you the security you need when renting out your car. You can confidently share your vehicle knowing that it’s covered by a robust insurance policy, which minimizes potential risks and protects your investment. Our commitment to safety and security ensures that you and your car are well-protected throughout the rental process, making your hosting experience stress-free and reliable.
        </p>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default HostStartup
