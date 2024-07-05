import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from '../Config/Config';

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
    // <div className="bg-[black]/40 backdrop-blur-md h-[100%] flex items-center justify-between rounded-lg">
    return (
        <nav className="w-[100vw] z-100 scrollbar-hide h-[80px] fixed p-[4px] bg-black  flex items-center justify-between  scrollbar-custom">

            <div className="flex text-white items-center">
                <NavLink to="/" className="text-md lg:text-lg mx-[4px] lg:mx-[8px] font-medium hover:bg-white hover:rounded-lg hover:text-custom-blue p-[2px] lg:p-[5px] ">Home</NavLink>
                <NavLink to="/admindashboard" className="text-md lg:text-lg mx-[4px] lg:mx-[8px] font-medium hover:bg-white hover:rounded-lg hover:text-custom-blue p-[2px] lg:p-[5px] ">Admin Dashboard</NavLink>
                <NavLink to="/products" className="text-md lg:text-lg mx-[4px] lg:mx-[8px] font-medium hover:bg-white hover:rounded-lg hover:text-custom-blue p-[2px] lg:p-[5px] ">Products</NavLink>
                <NavLink to="/profile" className="text-md lg:text-lg mx-[4px] lg:mx-[8px] font-medium hover:bg-white hover:rounded-lg hover:text-custom-blue p-[2px] lg:p-[5px] ">Profile</NavLink>
                <NavLink to="/signin" className="text-md lg:text-lg mx-[4px] lg:mx-[8px] font-medium hover:bg-white hover:rounded-lg hover:text-custom-blue p-[2px] lg:p-[5px] ">Sign In</NavLink>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>

        </nav>
    );
};

export default Navbar;
