import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../../slices/adminAuthSlice";
import { useDispatch } from "react-redux";
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <nav className="bg-transparent p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center mt-5">
          <span className="Logo-Quick py-1 px-1 self-center text-xl font-bold whitespace-nowrap text-white rounded-md italic">
            Quick
          </span>
          <span className="self-center text-lg font-bold whitespace-nowrap text-white italic">
            Wheels
          </span>
        </div>

        <button
          className="lg:hidden text-white hover:text-gray-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden lg:flex space-x-6 text-white font-medium">
          <Link to={'/admin/dashboard'} className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/admin/userlist" className="hover:text-gray-400">
            Users
          </Link>
          <Link to="/admin/hostlist" className="hover:text-gray-400">
            Host
          </Link>
          <Link to="/admin/orders" className="hover:text-gray-400">
            Orders
          </Link>
          {/* <Link to="#" className="hover:text-gray-400">
            Payments
          </Link> */}
          <Link to="/admin/category" className="hover:text-gray-400">
            Category
          </Link>
          <p 
            className="hover:text-gray-400 cursor-pointer" 
            onClick={() => dispatch(logout())}
          >
            Log Out
          </p>
        </div>
      </div>

      <div 
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } lg:hidden flex-col space-y-4 absolute left-0 right-0 mt-4 bg-black/50 backdrop-blur-sm p-4 z-50`}
      >
        <Link 
          to={'/admin/dashboard'} 
          className="text-white hover:text-gray-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/userlist" 
          className="text-white hover:text-gray-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Users
        </Link>
        <Link 
          to="/admin/hostlist" 
          className="text-white hover:text-gray-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Host
        </Link>
        <Link 
          to="/admin/orders" 
          className="text-white hover:text-gray-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Orders
        </Link>
        {/* <Link to="#" className="text-white hover:text-gray-400">
          Payments
        </Link> */}
        <Link 
          to="/admin/category" 
          className="text-white hover:text-gray-400"
          onClick={() => setIsMenuOpen(false)}
        >
          Category
        </Link>
        <p 
          className="text-white hover:text-gray-400 cursor-pointer" 
          onClick={() => {
            dispatch(logout());
            setIsMenuOpen(false);
          }}
        >
          Log Out
        </p>
      </div>
    </nav>
  );
};

export default Navbar;