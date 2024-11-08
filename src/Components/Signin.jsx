import React, { useEffect, useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

import { IoLockClosedOutline } from "react-icons/io5";
import { IoMail } from "react-icons/io5";

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            navigate('/profile');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <main className='flex flex-col min-h-screen items-center justify-center'>
            <form onSubmit={handleSignin} className="w-full  sm:w-[520px] bg-white p-8 rounded-lg font-sans">
                <div className='text-gray-800 text-[28px] lg:text-[35px] text-center font-bold'>Welcome Back</div>
                <div className='text-gray-800 text-sm text-center font-medium'>Please enter Email and Password</div>
                <div className='h-[3px] bg-gray-400 w-[90%] mx-auto my-4'></div>
                <div className='flex flex-col'>
                    <label className='text-gray-800 font-semibold'>Email </label>
                </div>
                <div className='flex items-center border border-gray-300 rounded-lg h-12 px-3 transition-colors duration-200 ease-in-out focus-within:border-blue-600'>
                    <IoMail className='text-gray-800' size={23} />
                    <input type="email"
                        className="ml-2 border-none outline-none w-full h-full"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your Email" />
                </div>

                <div className='flex flex-col mt-4'>
                    <label className='text-gray-800 font-semibold'>Password </label>
                </div>
                <div className='flex items-center border border-gray-300 rounded-lg h-12 px-3 transition-colors duration-200 ease-in-out focus-within:border-blue-600'>
                    <IoLockClosedOutline className='text-gray-800' size={23} />
                    <input type="password"
                        className="ml-2 border-none outline-none w-full h-full"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your Password" />
                </div>

                {error && <div className='text-red-600 mt-[15px] text-[15px] font-[600]'>* No User Found with these credentials</div>}
                <div className='flex items-center mt-4'>
                    <input type="checkbox" className='mr-2' />
                    <label className='text-gray-800'>Remember me </label>
                </div>
                <button className="bg-black text-white text-lg font-medium rounded-lg h-12 w-full mt-5 mb-2 cursor-pointer hover:bg-gray-800">Sign In</button>
                <p className="mt-[-5px] text-center text-lg">
                    Don't have an account?
                    <span className="text-blue-600 font-medium underline cursor-pointer ml-1" onClick={() => { navigate("/signup") }}>Sign Up</span>
                </p>
            </form>
        </main>

    );
}


export default Signin;
 