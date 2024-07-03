import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"; 
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
    <> 
      <div className="login-container">
        <div className="signup">Sign Up</div>  
        <div className="text">Already have an account? <Link className="link" to="/signin">Sign In</Link> </div>

        <form className="form-data" onSubmit={handleSignup}> 
          <input className="display-name" type="text" placeholder="Display Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input className="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button className="login-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
}

export default Signup;
