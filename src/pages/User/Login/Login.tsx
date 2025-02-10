import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import Navbar from "../../../components/User/Navbar/Navbar";
import LoginImage from "../../../assets/carlogin.jpg";
import GoogleLogo from "../../../assets/icons8-google.svg";
import Modal from "../../../components/User/Login Modal/loginModal";
import { useNavigate,useLocation } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";
import { setAuthorization } from "../../../slices/authSlice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/User/Footer/Footer";
import { toast,ToastContainer } from "react-toastify";



const Login: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [invalidMsg, setInvalidMsg] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token,setToken] = useState<string>("")

  const navigate = useNavigate();
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  
  const dispatch = useDispatch<AppDispatch>();

  axiosInstance.defaults.withCredentials = true;

  const checkEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Provide correct email");
      return;
    }

    interface CheckEmailRequest {
      email: string;
    }

    interface CheckEmailResponse {
      emailExists: boolean;
      message: string;
    }

    const requestData: CheckEmailRequest = { email };

    try {
      const response = await axiosInstance.post<CheckEmailResponse>(
        "/checkMail",
        requestData
      );

      const { emailExists } = response.data;

      if (emailExists) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    } catch (error) {
      console.error("Error on user mail checking", error);
    }
  };

  const requestOtp = async () => {
    interface mail {
      email: string;
    }

    const requestData: mail = { email };

    interface otpResponse {
      otpSent: boolean;
      message: string;
    }

    if (!userName.trim()) {
      toast.error("Provide a username");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.trim()) {
      toast.error("Provide a password");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password should be strong");
      return;
    }

    if (confirmPassword !== password) {
      toast.error("mismatch in confirm password!");
      return;
    }

    try {
      const response = await axiosInstance.post<otpResponse>(
        "/sentOtp",
        requestData
      );

      if (response.data.otpSent) {
        setOpenModal(true);
      }
    } catch (error) {
      console.error("error in request otp", error);
    }
  };

  const verifyOtp = async (otp: string) => {
    interface otpResponse {
      validOtp: boolean;
      message: string;
    }

    interface userResponse {
      userCreated: boolean;
      validUser:boolean;
      userId: string;
      token: string;
      message: string;
    }

    try {
      const response = await axiosInstance.post<otpResponse>("/verifyOtp", {
        otp,
        emailToVerify: email,
      });

      if (response.data.validOtp) {
        const loginMethod = "userlogin";
        const userRegistration = await axiosInstance.post<userResponse>(
          "/userRegister",
          { userName, password, email, loginMethod }
        );        
        if (userRegistration.data.validUser) {
          setOpenModal(false);
          navigate("/");
        }
      } else {
        setInvalidMsg("Invalid Otp!");
      }
    } catch (error) {
      console.error("error in verifying otp", error);
    }
  };

  const googleLogin = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth`;
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    const token = searchParams.get('auth')
    if(token)setToken(token)
  },[])


  const userLogin = async () => {
    interface response {
      validUser: boolean;
      token: string;
      username: string;
      userId: string;
      profileUpdated: boolean;
      isHost: boolean;
      status: string;
      isVerified: boolean;
      role: string[];
      message: string;
    }

    try {
      const loginMethod = "userlogin";
      const userResponse = await axiosInstance.post<response>("/userLogin", {
        email,
        password,
        loginMethod,
      });

      if (userResponse.data.validUser) {
        const profileUpdated = userResponse.data.profileUpdated;
        const isHost = userResponse.data.isHost;
        const userId = userResponse.data.userId;
        dispatch(
          setAuthorization({
            userId: userId,
            profileUpdated: profileUpdated,
            isHost: isHost,
          })
        );
        navigate("/");
      } else {
        setLoginError("Incorrect Password!");
      }
    } catch (error) {
      console.error("error in login", error);
    }
  };


  useEffect(() => {
    let password = import.meta.env.VITE_GOOGLE_LOGIN_PASS;
    if (token) {                    
      axiosInstance.get("/verifyToken",{
        headers:{
          Authorization: `Bearer ${token}`
        },
        withCredentials:true
      })
        .then((res) => {
          if (res.data){    
            console.log(res.data);              
            const email = res.data.email;
            const name = res.data.given_name;
            axiosInstance.post("/checkMail", { email }).then((res) => {
              if (res.data) {
                if (!res.data.emailExists) {
                  const loginMethod = "userlogin";
                  axiosInstance
                    .post("userRegister", {
                      userName: name,
                      password,
                      email,
                      loginMethod,
                    })
                    .then((res) => {
                      if (res.data) {
                        navigate("/");
                      }
                    });
                } else {
                  password = res.data.password;
                  const loginMethod = "googleauth";
                  axiosInstance
                    .post("/userLogin", { email, password, loginMethod })
                    .then((res) => {
                      if (res.data) {
                        navigate("/");
                      }
                    });
                }
              }
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  return (
    <>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onVerify={verifyOtp}
        onResend={requestOtp}
        invalidMessage={invalidMsg}
        children
      ></Modal>
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
      <div
        className={`main-div ${
          openModal ? "blur-sm" : ""
        } flex flex-col min-h-screen pt-16`}
      >
        {" "}
        <div className="flex-grow flex items-center justify-center px-4 py-8">
          <div className={`login-card flex flex-col md:flex-row items-center justify-center ${login===false?`h-[600px]`:`h-[450px]`} md:h-full w-3/4 bg-white rounded-lg overflow-hidden shadow-lg`}>
            <div
              className={`
             image-container hidden md:block w-full md:w-1/2 
              bg-gray-200 bg-cover bg-center 
              ${login === false ? "md:h-[600px]" : "md:h-80"}
              ${login === true ? "md:h-[500px]" : "md:h-80"}
            `}
              style={{ backgroundImage: `url(${LoginImage})` }}
            ></div>

            <div
              className={`
              w-full md:w-1/2 
              ${login === false ? "md:h-[600px]" : "md:h-80"}
              ${login === true ? "md:h-[500px]" : "md:h-80"}
              flex items-center justify-center 
              bg-red-100 p-4 
              rounded-r-lg
            `}
            >
              <div className="login-form-container flex justify-center items-center min-h-screen">
                <div className="login-form w-full max-w-md p-6 rounded-md">
                  <h1 className="text-sm font-bold text-center md:text-left mb-4">
                    {login === false
                      ? "Create Account"
                      : login === true
                      ? "Sign In"
                      : login === null
                      ? "Sign In or Create Account"
                      : ""}
                  </h1>
                  <div className="email-field mt-8 w-full">
                    <p className="text-sm font-semibold">Enter Email</p>
                    <input
                      type="text"
                      className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={login === false}
                    />
                  </div>
                  {login === false ? (
                    <div className="username-field mt-8 w-full">
                      <p className="text-sm font-semibold">Enter Username</p>
                      <input
                        type="text"
                        className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  ) : null}
                  {login === true || login === false ? (
                    <div className="password-field mt-8 w-full">
                      <p className="text-sm font-semibold">Enter Password</p>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <FontAwesomeIcon
                          icon={faEye}
                          className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      </div>
                    </div>
                  ) : null}
                  {login === false ? (
                    <div className="password-field mt-8 w-full">
                      <p className="text-sm font-semibold">Confirm Password</p>
                      <input
                        type="password"
                        className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  ) : null}
                  <p className="text-red-500">{loginError}</p>
                  <div className="flex justify-center">
                    <button
                      className="mt-8 w-full md:w-32 bg-red-500 rounded p-1 font-semibold text-white"
                      onClick={
                        login === false
                          ? requestOtp
                          : login === true
                          ? userLogin
                          : login === null
                          ? checkEmail
                          : undefined
                      }
                    >
                      {login === false
                        ? "Request OTP"
                        : login === true
                        ? "Sign In"
                        : login === null
                        ? "Continue"
                        : ""}
                    </button>
                  </div>

                  {login === true ? (
                    <div className="mt-2 text-center">
                      <a
                        className="text-xs hover:cursor-pointer"
                        onClick={() => navigate("/forgotpassword")}
                      >
                        Forgot your password?
                      </a>
                    </div>
                  ) : null}
                  <hr className="border-gray-500 my-8" />
                  <div className="social-sign flex justify-center space-x-4">
                    <div
                      onClick={() => googleLogin()}
                      className="social-sign flex items-center space-x-2 w-48 h-10 p-1 bg-white rounded justify-center hover:cursor-pointer"
                    >
                      <img
                        src={GoogleLogo}
                        alt="Google logo"
                        className="w-5 h-5"
                      />
                      <h1 className="text-sm font-semibold">Sign In With Google</h1>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
