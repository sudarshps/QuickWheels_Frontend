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
  const isHost = useSelector(
    (state: RootState) => state.userDetails.isHost
  ) as boolean;
  
  
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
  

  useEffect(() => {
    setHost(isHost);
  }, []);

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
    <nav className={`${className} p-4 fixed w-full z-50 transition-colors duration-300 ${isScrolled?'bg-white shadow-md':'bg-transparent'}`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-12 p-4">
        <Link
          to="http://localhost:5173/"
          className="flex items-center rtl:space-x-reverse"
        >
          <span className="Logo-Quick py-1 px-1 self-center text-xl font-bold whitespace-nowrap dark:text-white rounded-md italic">
            Quick
          </span>
          <span className="self-center text-lg font-bold whitespace-nowrap dark:text-white italic">
            Wheels
          </span>
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul
            className={`font-medium flex flex-col p-4 md:p-0 mt-4 items-center rounded-lg border md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ${
              isMenuOpen ? "bg-gray-50 dark:bg-gray-800" : ""
            }`}
          >
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-red-500 rounded md:bg-transparent md:text-red-600 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Contact Us
              </a>
            </li>
            <li>
              {isAuthenticated ? (
                <div>
                  <span
                    className="md:hover:text-red-600"
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faUser} />

                    <FontAwesomeIcon icon={faCaretDown} />
                  </span>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/profile")}
                        >
                          Profile
                        </li>
                        {!host ? (
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/becomehost")}
                          >
                            Become a host
                          </li>
                        ) : (
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/hostdashboard")}
                          >
                            My Dashboard
                          </li>
                        )}
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/orders")}
                          >
                           My Orders
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate("/mywallet")}
                          >
                            QuickWallet
                          </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={handleLogout}
                        >
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="block bg-red-600 text-white font-medium py-1 px-3 rounded hover:text-black"
                  onClick={signIn}
                >
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
