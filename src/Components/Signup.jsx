import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

import { FaUserEdit } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoMail } from "react-icons/io5";

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  console.log(error);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const signUpResult = await supabase.auth.signUp({ email, password });
      if (signUpResult.error) {
        throw signUpResult.error;
      }

      // Fetch the user details from Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user_id = userData.user.id;
      const user_email = userData.user.email;

      // Insert user into user_account table
      const { error: insertUserAccountError } = await supabase.from('user_account').insert([{ user_id, email: user_email }]);
      if (insertUserAccountError) throw insertUserAccountError;

      // Insert user into profiles table with full_name
      const { error: insertProfileError } = await supabase.from('profiles').insert([{ user_id, full_name: fullName, bio: '' }]);
      if (insertProfileError) throw insertProfileError;

      navigate('/signin');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mt-10 md:mt-0 lg:mb-[-30px] h-screen'>
      <form onSubmit={handleSignup} className='w-full sm:w-[520px] bg-white p-8 rounded-lg font-sans'>
        <div className='text-gray-800 text-[28px] lg:text-[35px] text-center font-bold'>Starting Exploring Today</div>
        <div className='text-gray-800 text-sm text-center font-medium'>Please enter your details to create an account</div>
        <div className='h-[3px] bg-gray-400 w-[90%] mx-auto my-4'></div>

        <div className='flex flex-col'>
          <label className='text-gray-800 font-semibold'>Name</label>
          <div className='flex items-center border border-gray-300 rounded-lg h-12 px-3 transition-colors duration-200 ease-in-out focus-within:border-blue-600'>
            <FaUserEdit className='text-gray-800' size={23} />
            <input type="text"
              className="ml-2 border-none outline-none w-full h-full"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Display Name" />
          </div>
        </div>
        <div className='flex flex-col mt-4'>
          <label className='text-gray-800 font-semibold'>Email</label>
          <div className='flex items-center border border-gray-300 rounded-lg h-12 px-3 transition-colors duration-200 ease-in-out focus-within:border-blue-600'>
            <IoMail className='text-gray-800' size={23} />
            <input type="email"
              className="ml-2 border-none outline-none w-full h-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email" />
          </div>
        </div>

        <div className='flex flex-col mt-4'>
          <label className='text-gray-800 font-semibold'>Password</label>
          <div className='flex items-center border border-gray-300 rounded-lg h-12 px-3 transition-colors duration-200 ease-in-out focus-within:border-blue-600'>
            <IoLockClosedOutline className='text-gray-800' size={23} />
            <input type="password"
              className="ml-2 border-none outline-none w-full h-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password" />
          </div>
        </div>

        <button className="bg-black text-white text-lg font-medium rounded-lg h-12 w-full mt-5 mb-2 cursor-pointer hover:bg-gray-800" type="submit">Sign Up</button>

        <p className="text-center text-lg">
          Already have an account?
          <span className="text-blue-600 font-medium underline cursor-pointer ml-1" onClick={() => { navigate("/signin") }}>Sign In</span>
        </p>
      </form>
    </div>

  );
}

export default Signup;
