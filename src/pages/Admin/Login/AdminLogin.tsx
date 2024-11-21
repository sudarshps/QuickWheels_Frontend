import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { setAdminToken } from '../../../slices/adminAuthSlice';
import { useDispatch } from 'react-redux';


const AdminLogin: React.FC = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  axios.defaults.withCredentials = true;

  const handleLogin = async() => {
    if(!email.trim()){
      alert('please provide email')
      return
    }

    if(!password.trim()){
      alert('please provide password')
      return
    }

    try {
      await axios.post('http://localhost:3000/admin/adminlogin',{email,password})
      .then(res=>{
        if(res.data){
          if(res.data.validated){
            const token = res.data.accessToken
            
            dispatch(setAdminToken({token}))
            navigate('/admin/dashboard')
          }else{
            setError('Incorrect credentials!')
          }
        }
      })
    } catch (error) {
      console.error('validation failed',error)
    }
    

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0C2D]">
      <div className="bg-gradient-to-b from-[#0E1145] to-[#11208C] rounded-lg shadow-lg p-10 max-w-xs w-full">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">Admin Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 rounded bg-gradient-to-r from-[#0E1145] to-[#11208C] text-white font-semibold hover:from-[#11208C] hover:to-[#0E1145]"
          >
            Login
          </button>
          <p className='text-red-500 ml-10 mt-5'>{error}</p>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
