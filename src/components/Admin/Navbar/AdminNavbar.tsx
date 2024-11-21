import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../../../slices/adminAuthSlice";
import { useDispatch } from "react-redux";

const Navbar: React.FC = () => {
  const dispatch = useDispatch()
  return (
    <nav className="bg-transparent p-4 flex justify-between items-center">
      <div className="flex items-center mt-5">
      <span className="Logo-Quick py-1 px-1 self-center text-xl font-bold whitespace-nowrap text-white rounded-md italic">Quick</span>
      <span className="self-center text-lg font-bold whitespace-nowrap text-white italic">Wheels</span>
      </div>

      <div className="flex space-x-6 text-white font-medium">
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
        <p className="hover:text-gray-400 cursor-pointer" onClick={()=>dispatch(logout())}>
          Log Out
        </p>
      </div>
    </nav>
  );
};

export default Navbar;