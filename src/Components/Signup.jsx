import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Fetch the user details from Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user_id = userData.user.id;
      const user_email = userData.user.email;

      // Insert user into user_account table
      const { error: insertUserAccountError } = await supabase.from('user_account').insert([{ user_id, email: user_email }]);
      if (insertUserAccountError) throw insertUserAccountError;

      // Insert user into profiles table
      const { error: insertProfileError } = await supabase.from('profiles').insert([{ user_id, full_name: '', bio: '' }]);
      if (insertProfileError) throw insertProfileError;

      navigate('/signin');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
