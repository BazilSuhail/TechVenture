import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from '../Config/Config';
import "../Styles/navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/signin');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    return (
        <div className="navbar">
            <NavLink to="/" className="nav-links">Home</NavLink>
            <NavLink to="/products" className="nav-links">Products</NavLink>
            <NavLink to="/signup" className="nav-links">Sign Up</NavLink>
            <NavLink to="/signin" className="nav-links">Sign In</NavLink>
            <NavLink to="/profile" className="nav-links">Profile</NavLink>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Navbar;
