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
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Signin</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSignin}>
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
        <button type="submit">Signin</button>
      </form>
    </div>
  );
}

export default Signin;
