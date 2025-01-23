import React from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone,faEnvelope } from '@fortawesome/free-solid-svg-icons';


const Footer:React.FC = () => {
  return (
    <>
    <footer className="bg-gray-900 text-white py-10 px-16 mt-20">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
      <Link
          to={import.meta.env.VITE_FRONTEND_URL}
          className="flex items-center rtl:space-x-reverse"
        >
          <span className="Logo-Quick py-1 px-1 self-center text-xl font-bold whitespace-nowrap dark:text-white rounded-md italic">
            Quick
          </span>
          <span className="self-center text-lg font-bold whitespace-nowrap dark:text-white italic">
            Wheels
          </span>
        </Link>
        <p className="mt-4 text-sm">
          Discover a seamless car rental experience that puts you in the driver's seat. 
          Whether you're planning a quick city getaway or an epic road trip, we have the perfect vehicle to meet your needs.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Our Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About Us</a></li>
          <li><a href="#" className="hover:underline">Contact Us</a></li>
          <li><a href="#" className="hover:underline">Services</a></li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Other Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">FAQ</a></li>
          <li><a href="#" className="hover:underline">Support</a></li>
          <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Location</h3>
        <p className="text-sm">
          Ramanattukara,Calicut,Kerala
        </p>
      </div>
    </div>

    <div className="mt-10 border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
      <div className='flex items-center gap-2'>
        <FontAwesomeIcon icon={faEnvelope} className='text-red-500'/>
        <h4 className="font-semibold">Mail</h4>
        <p>quickwheels@xyz.com</p>
      </div>
      <div className='flex items-center gap-2'>
      <FontAwesomeIcon icon={faPhone} className='text-red-500'/>
        <h4 className="font-semibold">Call Now</h4>
        <p>1800-258-6324</p>
      </div>
    </div>
  </div>
</footer>
</>
  )
}

export default Footer
