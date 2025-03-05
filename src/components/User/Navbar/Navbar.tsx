import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { logOut } from "../../../slices/authSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { setCredentials } from "../../../slices/authSlice";
import { setUserDetails } from "../../../slices/userDetailSlice";

interface NavbarProps{
  className?:string
}

const Navbar: React.FC<NavbarProps> = ({className}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [host, setHost] = useState(false);
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.email);
  
  const handleScroll = () => {
    
    if(window.scrollY>40){
      setIsScrolled(true)
    }else{
      setIsScrolled(false)
    }
  }  

  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)
    return() => {
      window.removeEventListener('scroll',handleScroll)
    }
  },[])


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };  

  const navigate = useNavigate();

  const signIn = () => {
    navigate("/login");
  };

  axiosInstance.defaults.withCredentials = true;

  useEffect(() => {
    axiosInstance
      .get("/authorized")
      .then((res) => {
        if (res.data.valid) {          
          const userName = res.data.user.username;
          const email = res.data.user.email;
          const profileUpdated = res.data.user.profileUpdated;
          const isHost = res.data.user.isHost;
          const role = res.data.user.role;                    
          dispatch(setCredentials({ userName, email, profileUpdated, isHost,role }));
        } else {
          dispatch(logOut()); 
        }
      })
      .catch((err) => {
        console.error(err)
        // alert(err.response.data.message)
        // navigate('/')
      });
  }, [dispatch]);


  useEffect(()=>{
    if(isAuthenticated){
      axiosInstance.get('/userDetails',{
        params:{
          email:email
        }
      })
      .then(res=>{
        const userId = res.data.id
        const dob = res.data.dob
        const phone = res.data.phone
        const drivingExpDate = res.data.drivingExpDate
        const address = res.data.address
        const drivingID = res.data.drivingID
        const drivingIDFront = res.data.drivingIDFront
        const drivingIDBack = res.data.drivingIDBack
        const profileUpdated = res.data.profileUpdated
        const isHost = res.data.isHost
        const status = res.data.status
        const note = res.data.note
        const role = res.data.role   
        const verifiedUser = res.data.isVerified 
        setHost(isHost)
          dispatch(setUserDetails({userId,dob,phone,drivingExpDate,address,drivingID,
            drivingIDFront,drivingIDBack,profileUpdated,isHost,status,note,role,verifiedUser}))        
      })
    }
  },[isAuthenticated,dispatch,email])



    
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout").then((res) => {
        if (res.data.status) {
          sessionStorage.removeItem('userlocation')
          dispatch(logOut());
          navigate('/')
        }
      });
    } catch (error) {
      console.error("error in logging out", error);
    }
  };

  return (

    <nav className={`${className} p-4 fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link
            to={import.meta.env.VITE_FRONTEND_URL}
            className="flex items-center"
          >
            <span className="Logo-Quick py-1 px-1 text-xl font-bold italic rounded-md dark:text-white">
              Quick
            </span>
            <span className="text-lg font-bold italic dark:text-white">
              Wheels
            </span>
          </Link>

          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className={`
            ${isMenuOpen ? 'block' : 'hidden'} 
            absolute top-full left-0 right-0 md:static md:block md:w-auto
            bg-white md:bg-transparent shadow-lg md:shadow-none
            mt-2 md:mt-0 transition-all duration-300 ease-in-out
          `}>
            <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 p-4 md:p-0">
              <li className="py-2 md:py-0">
                <Link
                  to="/"
                  className="block text-red-600 hover:text-red-700 md:inline-block"
                >
                  Home
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <a
                  href="#"
                  className="block text-gray-900 hover:text-red-600 md:inline-block"
                >
                  About Us
                </a>
              </li>
              <li className="py-2 md:py-0">
                <a
                  href="#"
                  className="block text-gray-900 hover:text-red-600 md:inline-block"
                >
                  Services
                </a>
              </li>
              <li className="py-2 md:py-0">
                <a
                  href="#"
                  className="block text-gray-900 hover:text-red-600 md:inline-block"
                >
                  Contact Us
                </a>
              </li>
              
              <li className="relative py-2 md:py-0">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center space-x-2 text-gray-900 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => navigate("/profile")}
                            className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Profile
                          </button>
                          
                          {!host ? (
                            <button
                              onClick={() => navigate("/becomehost")}
                              className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                            >
                              Become a host
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate("/hostdashboard")}
                              className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                            >
                              My Dashboard
                            </button>
                          )}
                          
                          <button
                            onClick={() => navigate("/orders")}
                            className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            My Orders
                          </button>
                          
                          <button
                            onClick={() => navigate("/mywallet")}
                            className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            QuickWallet
                          </button>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={signIn}
                    className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
