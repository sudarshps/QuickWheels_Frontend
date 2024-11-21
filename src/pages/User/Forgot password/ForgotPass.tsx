import React,{useState} from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import axiosInstance from "../../../api/axiosInstance";
import { toast,ToastContainer } from "react-toastify";
import Modal from "../../../components/User/Login Modal/loginModal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface ForgotPassFCProps {
  verify:(isValid:boolean)=>void
}

const ForgotPass: React.FC<ForgotPassFCProps> = ({verify}) => {
  const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState('');
    const [invalidMsg, setInvalidMsg] = useState("");
    const navigate = useNavigate()


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance.post('/checkMail',{email})
    .then(res=>{
      if(res.data){
        if(res.data.emailExists){
          axiosInstance.post('/sentOtp',{email})
          .then(res=>{
            if(res.data){
              if(res.data.otpSent){
                Swal.fire({
                  title: "Verify OTP!",
                  text: "OTP has been sent to your email!"
                })
                setOpenModal(true)
              }else{
                toast.error('error while otp sent')
              }
            }
          })
        }else{
          toast.error('email address is not exist!')
        }
      }
    })
  };

  const resendOtp = () => {
    axiosInstance.post('/sentOtp',{email})
    .then(res=>{
      if(res.data){
        if(res.data.otpSent){
          Swal.fire({
            title: "Verify OTP!",
            text: "OTP has been sent to your email!"
          })
          setOpenModal(true)
        }else{
          toast.error('error while otp sent')
        }
      }
    })
  }


  const verifyOtp = async (otp: string) => {
    interface otpResponse {
      validOtp: boolean;
      message: string;
    }

    try {
      const response = await axiosInstance.post<otpResponse>(
        "/verifyOtp",
        { otp, emailToVerify: email }
      );

      if (response.data.validOtp) {
        verify(true)
        navigate('/setnewpassword',{state:{verified:true,email:email}})
        
      } else {
        setInvalidMsg("Invalid Otp!");
      }
    } catch (error) {
      console.error("error in verifying otp",error);
    }
  };


  return (
    <>
    <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onVerify={verifyOtp}
        onResend={resendOtp}
        invalidMessage={invalidMsg}
        children
      >
      </Modal>
  <Navbar />
  <ToastContainer autoClose={2000}/>
  <div className="main-div relative flex justify-center items-center min-h-screen">
    <div className="flex flex-col md:flex-row w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl font-semibold">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Next
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</>

  );
};

export default ForgotPass;
