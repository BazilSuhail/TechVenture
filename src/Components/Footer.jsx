import React from 'react'
import { MdOutlineFacebook } from "react-icons/md";
import { FaTwitterSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import { IoLogoYoutube } from "react-icons/io";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className=' bg-black w-full text-white'>
      <div className='grid  grid-cols-1 md:grid-cols-3 xsx:p-[55px] mx-auto   gap-y-[25px]'>
        <div className='flex flex-col p-[28px] justify-center '>
          <div className='font-serif text-center xsx:text-left text-[45px]  '>TechVenture</div>
          <div className='ml-[15px] text-center xsx:text-left text-sm mb-[25px]'>Your ultimate Destination to find gadgets with Analysis,Specifications and expert Reviews</div>
        </div>

        <div className="mx-auto grid p-[7px] m-[7px]  grid-cols-2 grid-rows-2 gap-4">
          <div>
            <p className='text-lg font-bold'>Popular Categories:</p>
            <div className="flex text-sm flex-col ml-[7px]">
              <p>Camera</p>
              <p>Desktops</p>
              <p>Laptops</p>
            </div>
          </div>
          <div>
            <p className='text-lg  font-bold'>Popular Subcategories</p>
            <div className="flex text-sm flex-col ml-[7px]">
              <p>DSLR</p>
              <p>Gaming Laptops</p>
              <p>Ultrabooks</p>
              <p>Action Cameras</p>
            </div>
          </div>
          <div>
            <p className='text-lg font-bold'>Top Companies</p>
            <div className="flex text-sm flex-col ml-[7px]">
              <p>Canon</p>
              <p>Dell</p>
              <p>Apple</p>
            </div>
          </div>
          <div>
            <p className='text-lg font-bold'>Most Searched Gadgets</p>
            <div className="flex text-sm flex-col ml-[7px]">
              <p>iPhone</p>
              <p>Galaxy S21</p>
              <p>MacBook Pro</p>
              <p>Surface Pro</p>
            </div>
          </div>
        </div>

        <div className='my-auto  xsx:ml-[25px]'>
          <p className='font-bold text-lg ml-[12px] xsx:ml-[0px]'>Get in Touch</p>

          <div className='flex  mt-[8px] text-[35px]'>
            <MdOutlineFacebook className='ml-[15px] hover:bg-white hover:text-black' />
            <FaLinkedin className='ml-[15px] hover:bg-white hover:text-black' />
            <FaTwitterSquare className='ml-[15px] hover:bg-white hover:text-black' />
            <IoLogoYoutube className='ml-[15px] hover:bg-white hover:text-black' />

          </div>

          <div className='text-gray-600 font-medium py-[7px] px-[15px] m-[15px] bg-gray-100 rounded-lg' onClick={() => navigate("/searchprojects")}>
            Search A Gadget !!
          </div>
        </div>

      </div>

      <div className='col-span-3 flex flex-col '>
        <p className='bg-gray-800 rounded-lg w-[95%] h-[4px] my-[15px]'></p>
        <p className='text-center text-lg  text-white  mb-[25px]'>@2024 TechVenture, All Rights Reserved  </p>
      </div>
    </footer>
  )
}

export default Footer
