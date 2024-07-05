import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from '../Config/Config';
import { FiX } from "react-icons/fi";
import { CgMenuLeftAlt } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { LuNewspaper } from "react-icons/lu";
import { AiFillProduct } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/signin');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const linkStyles = "text-md ml-[15px] border-black border-2 hover:border-white p-[8px] flex items-center font-medium rounded-xl";
    const activeLinkStyles = "bg-white text-black";

    return (
        <nav>
            <div className="w-full h-[80px] fixed p-4 bg-black flex items-center justify-between z-50">
                <div className="flex justify-between w-full items-center">

                    <button className="xsx:hidden text-white" onClick={toggleMenu}>
                        {isOpen ? <FiX size={24} /> : <CgMenuLeftAlt size={24} />}
                    </button>

                    <div className="xsx:flex hidden text-md items-center text-white">
                        <NavLink to="/" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}> Home</NavLink>
                        <NavLink to="/techtoday" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}> TechToday</NavLink>
                        <NavLink to="/products" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}> Gadgets</NavLink>
                    </div>

                    <div className="text-white font-serif text-2xl px-[8px] xsx:mr-[105px] lg:mr-[185px] xl:mr-[145px] py-[2px] rounded-xl">TechVenture</div>
                    <NavLink to="/searchprojects" className="xsx:hidden block text-white"><IoIosSearch size={30} /></NavLink>

                    <div className="xsx:flex hidden">
                        <NavLink to="/profile" className="text-white mr-[10px] text-md p-[10px] hover:bg-white hover:text-black border-2 border-white rounded-full"><FaUserEdit className="text-[25px]" /></NavLink>
                        {user ? (
                            <button className="text-white text-lg px-[8px] py-[2px] font-medium flex items-center hover:bg-red-700 hover:text-white rounded-xl border-2 border-white" onClick={handleLogout}><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Logout</p></button>
                        ) : (
                            <NavLink to="/signin" className="text-white text-lg px-[8px] py-[2px] font-medium flex items-center hover:bg-white hover:text-black rounded-xl border-2 border-white" onClick={handleLogout}><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Register</p></NavLink>
                        )}
                    </div>
                </div>
            </div>

            <div className={`fixed top-0 left-0 w-3/5 h-full bg-black z-40 transition-transform duration-900 transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <div className="flex flex-col items-baseline text-white">
                    <div className="flex h-[calc(100vh-75px)] flex-col items-baseline ml-[-55px] text-white">
                        <NavLink to="/" className="mb-[75px]">Home</NavLink>
                        <NavLink to="/" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}><CiHome className="text-[25px] mt-[1px] mr-[4px]" />Home</NavLink>
                        <NavLink to="/techtoday" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}><LuNewspaper className="text-[25px] mt-[1px] mr-[4px]" />TechToday</NavLink>
                        <NavLink to="/products" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}><AiFillProduct className="text-[25px] mt-[1px] mr-[4px]" />Gadgets</NavLink>

                        <NavLink to="/profile" className="text-white text-lgl mt-[10px] px-[10px] py-[2px] flex items-center font-bold hover:bg-white border-2 border-white hover:text-black rounded-xl"><FaUserEdit className="text-[30px] mt-[1px] mr-[9px]" /><p>View Profile</p></NavLink>
                    </div>
                    <div className="ml-[10px]">
                        {user ? (
                            <button className="text-white text-xl px-[8px] py-[2px] font-medium flex items-center hover:bg-red-700 hover:text-white rounded-xl border-2 border-white" onClick={handleLogout}><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Logout</p></button>
                        ) : (
                            <NavLink onClick={toggleMenu} className="text-white text-xl px-[8px] py-[2px] font-medium flex items-center hover:bg-white hover:text-black rounded-xl border-2 border-white"><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Get Started</p></NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
