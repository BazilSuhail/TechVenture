import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

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
    <div className='flex items-center justify-center w-[100vw] h-[100vh]'>
            <div className='border-2 border-gray-600 rounded-[25px] p-[25px] h-[480px] md:h-[510px] w-[350px] md:w-[590px] flex flex-col'>
        <h2 className='text-white bg-black rounded-md w-[100%] p-[8px] text-center text-3xl'>Sign Up</h2>

        <div className='flex items-center mt-[20px] justify-center'>

          <p className='text-lg md:text-xl font-medium '>Already Have An Account </p>
          <p onClick={() => { navigate("/signin") }} className='cursor-pointer ml-[10px] underline font-bold text-2xl text-blue-800'>SignIN</p>

        </div>

        <form onSubmit={handleSignup} className='flex flex-col'>
          <p className='text-xl md:text-2xl font-semibold mt-[8px] md:mt-[14px]'>Name:</p>
          <input   type="text" placeholder="Enter Display Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className='text-lg border-2 border-gray-600 placeholder:text-gray-600 font-medium rounded-xl mt-[4px] md:mt-[8px] p-[8px]' />
          
          <p  className='text-xl md:text-2xl font-semibold mt-[5px]'>Email:</p>
          <input  type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required className='text-lg border-2 border-gray-600 placeholder:text-gray-600 font-medium rounded-xl mt-[4px] md:mt-[8px] p-[8px]' />
          
          <p  className='text-xl md:text-2xl font-semibold mt-[5px]'>Password:</p>
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required className='text-lg border-2 border-gray-600 placeholder:text-gray-600 font-medium rounded-xl mt-[4px] md:mt-[8px] p-[8px]' />
          
          <button className='mt-[15px] bg-gray-800 shadow-custom-light text-[25px] md:text-[30px] rounded-[30px] text-white py-[8px]' type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
