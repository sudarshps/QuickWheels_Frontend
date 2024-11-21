import './App.css'
import Home from './pages/User/Home/Home.tsx'
import Login from './pages/User/Login/Login.tsx'
import HostStartup from './pages/User/Host Startup/HostStartup.tsx'
import RegisterForm from './pages/User/Host Registration/HostRegister.tsx'
import AdminLogin from './pages/Admin/Login/AdminLogin.tsx'
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard.tsx'
import HostDashboard from './pages/User/Host Dashboard/HostDashboard.tsx'
import UserList from './pages/Admin/User List/UserList.tsx'
import HostList from './pages/Admin/Host List/HostList.tsx'
import Profile from './pages/User/Profile/Profile.tsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/Protected Route/ProtectedRoute.tsx'
import HostCarDetails from './pages/User/Host Car Details/HostCarDetails.tsx'
import AdminProtectedRoute from './components/Protected Route/AdminProtectedRoute.tsx'
import UserVerification from './pages/Admin/User Verification/UserVerification.tsx'
import CarsList from './pages/User/Cars List/CarsList.tsx'
import CarDetails from './pages/User/Car Details/CarDetails.tsx'
import HostVerification from './pages/Admin/Host Verification/HostVerification.tsx'
import ForbiddenPage from './pages/User/403/ForbiddenPage.tsx'
import Category from './pages/Admin/Category/Category.tsx'
import WalletUI from './pages/User/Wallet/Wallet.tsx'
import GuestRoute from './components/Guest Route/GuestRoute.tsx'
import Orders from './pages/User/Orders/Orders.tsx'
import OrderDetails from './pages/User/Order Details/OrderDetails.tsx'
import AdminOrders from './pages/Admin/Orders/AdminOrders.tsx'
import OrderSuccess from './pages/User/Order Success/OrderSuccess.tsx'
import AdminOrderDetails from './pages/Admin/Order Details/OrderDetails.tsx'
import {io} from 'socket.io-client'
import ChatWidget from './components/Chat/MainChatUI.tsx'
import HostOrderDetails from './pages/User/Host Order Details/HostOrderDetails.tsx'
import ForgotPass from './pages/User/Forgot password/ForgotPass.tsx'
import SetPassword from './pages/User/Set New password/SetPassword.tsx'
import { useState } from 'react'

const socket = io('https://apollofurniture.online',{
  withCredentials:true,
  transports: ['polling', 'websocket'],
})

function App() {

  const [otpVerified,setOtpVerfied]= useState(false)

  return(
    <Router>
      <Routes>
        <Route path='/*' element={<Home/>}/>
        <Route path='/admin/*' element={<AdminLogin/>}/>
        <Route path='/forgotpassword' element={<ForgotPass verify={()=>setOtpVerfied(true)}/>}/>
        <Route path='/setnewpassword' element={otpVerified?<SetPassword/>:<Navigate to={'/'} replace/>}/>
        <Route path='/login' element={
          <GuestRoute>
            <Login/>
          </GuestRoute>
        }/>
        <Route path='/availablecars' element={<CarsList/>} />
        <Route path='/cardetails' element={<CarDetails/>} />
        <Route path='/unauthorized' element={<ForbiddenPage/>} />
        <Route element={<ProtectedRoute allowedRoles={['USER']}/>}>
        <Route path='/becomehost' element={<HostStartup/>}/>
        <Route path='/profile' element={<><Profile/><ChatWidget  socket={socket} /></>}/>
        <Route path='/hostregister' element={<RegisterForm isComponent={false}/>}/>
        <Route path='/orders' element={<><Orders socket={socket}/><ChatWidget socket={socket}/></>}/>
        <Route path='/orderdetails' element={<OrderDetails/>}/>
        <Route path='/orderplaced' element={<OrderSuccess/>}/>
        <Route path='/mywallet' element={<WalletUI/>}/>
        </Route>


        <Route element={<ProtectedRoute allowedRoles={['HOST']}/>}>
        <Route path='/hostdashboard' element={<HostDashboard/>}/>
        <Route path='/editcardetails' element={<HostCarDetails/>}/>
        <Route path='/hostorderdetails/:id' element={<HostOrderDetails/>}/>
        </Route>
        

        <Route path='/admin' element={<AdminLogin/>}/>
        <Route element={<AdminProtectedRoute/>}>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/userlist' element={<UserList/>}/>
        <Route path='/admin/hostlist' element={<HostList/>}/>
        <Route path='/admin/userverification' element={<UserVerification/>}/>
        <Route path='/admin/hostverification' element={<HostVerification/>}/>
        <Route path='/admin/category' element={<Category/>}/>
        <Route path='/admin/orders' element={<AdminOrders/>}/>
        <Route path='/admin/orderdetails' element={<AdminOrderDetails/>}/>
        </Route>     
      </Routes>
    </Router>
  )  
}

export default App
