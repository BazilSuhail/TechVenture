import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
 
import { IoLockClosedOutline } from "react-icons/io5";
import { IoMail } from "react-icons/io5";

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        <main className='flex flex-col items-center justify-center mt-10 md:mt-0 lg:mb-[-30px] h-screen'>
        <form onSubmit={handleSignin} className="w-full  sm:w-[520px] bg-white p-8 rounded-lg font-sans">
            <div className='text-gray-800 text-[28px] lg:text-[35px] text-center font-bold'>Welcome Back</div>
            <div className='text-gray-800 text-sm text-center font-medium'>Please enter Email and Password</div>
            <div className='h-[3px] bg-gray-400 w-[90%] mx-auto my-4'></div>
            {error && <div className='text-gray-700 p-1 border-2 border-gray-600 rounded-md'>Error: {error}</div>}
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

/*
 
 
        <div className='flex items-center justify-center w-[100vw] h-[100vh]'>
            <div className='p-[25px] h-[480px] md:h-[510px] w-[350px] md:w-[590px] flex flex-col'>
                <h2 className='text-black font-extrabold p-[8px] text-center text-3xl'>Welcome Back</h2>
                <div className='h-[2px] rounded-xl bg-gray-800 w-full'></div>
                {error && <div>Error: {error}</div>}
                <div className='flex items-center mt-[20px] justify-center'>

                    <p className='text-lg md:text-xl font-medium '>Dont Have An Account </p>
                    <p onClick={()=>{navigate("/signup")}} className='cursor-pointer ml-[10px] underline font-bold text-xl text-blue-800'>SignUP</p>

                </div>
                <form onSubmit={handleSignin} className='flex flex-col'>
                    <p className='text-xl md:text-2xl font-semibold mt-[15px]'>Email:</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='text-lg border-2 border-gray-300 placeholder:text-gray-400 font-medium rounded-md mt-[8px] p-[8px]'
                        placeholder="Enter Email"
                        required
                    />
                    <p className='text-xl md:text-2xl font-semibold mt-[5px]'>Password:</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='text-lg border-2 border-gray-300 placeholder:text-gray-400 font-medium rounded-md mt-[8px] p-[8px]'
                        placeholder="Enter Password"
                        required
                    />
                    <button className='mt-[28px] bg-gray-800 shadow-custom-light text-[25px] md:text-[30px] rounded-[30px] text-white py-[8px]' type="submit">Signin</button>
                </form>
            </div>
        </div>
*/