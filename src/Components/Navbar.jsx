import React from "react";
import { NavLink } from "react-router-dom";
import "../Styles/navbar.css"

const Navbar = () => {
    return (
        <div className="navbar">
            <NavLink to="/" className="nav-links">Home</NavLink>
            <NavLink to="/products" className="nav-links">Products</NavLink>
            <NavLink to="/signup" className="nav-links">signup</NavLink>
            <NavLink to="/signin" className="nav-links">sign in </NavLink>
            <NavLink to="/profile" className="nav-links">profile</NavLink>
        </div>
    );
};

export default Navbar;