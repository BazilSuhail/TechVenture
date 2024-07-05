import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

function Signin() {
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
        <div className='flex items-center justify-center w-[100vw] h-[100vh]'>
            <div className='border-2 border-gray-600 rounded-[25px] p-[25px] h-[480px] md:h-[510px] w-[350px] md:w-[590px] flex flex-col'>
                <h2 className='text-white bg-black rounded-md w-[100%] p-[8px] text-center text-3xl'>Signin</h2>
                {error && <div>Error: {error}</div>}
                <div className='flex items-center mt-[20px] justify-center'>

                    <p className='text-lg md:text-xl font-medium '>Dont Have An Account </p>
                    <p onClick={()=>{navigate("/signup")}} className='cursor-pointer ml-[10px] underline font-bold text-2xl text-blue-800'>SignUP</p>

                </div>
                <form onSubmit={handleSignin} className='flex flex-col'>
                    <p className='text-xl md:text-2xl font-semibold mt-[28px]'>Email:</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='text-lg border-2 border-gray-600 placeholder:text-gray-600 font-medium rounded-xl mt-[8px] p-[8px]'
                        placeholder="Enter Email"
                        required
                    />
                    <p className='text-xl md:text-2xl font-semibold mt-[5px]'>Password:</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='text-lg border-2 border-gray-600 placeholder:text-gray-600 font-medium rounded-xl mt-[8px] p-[8px]'
                        placeholder="Enter Password"
                        required
                    />
                    <button className='mt-[42px] bg-gray-800 shadow-custom-light text-[25px] md:text-[30px] rounded-[30px] text-white py-[8px]' type="submit">Signin</button>
                </form>
            </div>
        </div>
    );
}

export default Signin;