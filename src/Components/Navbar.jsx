import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from '../Config/Config';
import { FiX } from "react-icons/fi";
import { CgMenuLeftAlt } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
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

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };

    const linkStyles = "text-md ml-[15px] my-[8px] border-black border-2 hover:border-white px-[8px] py-[5px] flex items-center font-medium rounded-xl";
    const activeLinkStyles = "bg-white text-black";

    return (
        <nav>
            <div className="w-full h-[80px] fixed p-4 bg-black flex items-center justify-between z-50">
                <div className="flex justify-between w-full items-center">

                    <button className="xsx:hidden text-white" onClick={handleMenuToggle}>
                        {isOpen ? <FiX size={24} /> : <CgMenuLeftAlt size={24} />}
                    </button>

                    <div className="xsx:flex hidden text-md items-center text-white">
                        <NavLink to="/" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}> Home</NavLink>
                        <NavLink to="/techtoday" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}> TechToday</NavLink>
                        <NavLink to="/products" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}> Gadgets</NavLink>
                    </div>

                    <div className="text-white font-serif text-2xl px-[8px] xsx:mr-[105px] lg:mr-[185px] xl:mr-[145px] py-[2px] rounded-xl">TechVenture</div>
                    <NavLink to="/searchprojects" className="xsx:hidden block text-white"><IoIosSearch size={30} /></NavLink>


                    {user ? (
                        <details className="text-white cursor-pointer xsx:block hidden">
                            <summary className="text-white list-none mr-[10px] text-md p-[10px] hover:bg-white hover:text-black border-2 border-white rounded-full"><FaUserEdit className="text-[25px]" /></summary>
                            <div className="absolute mt-[20px] ml-[-165px] p-[8px] w-[210px] list-none bg-white border-4 rounded-xl shadow-custom-slider text-black">
                                <button className="text-red cursor-pointer-500 w-[100%] text-[22px] px-[12px] py-[6px] font-medium flex items-center hover:bg-red-700 hover:text-white rounded-xl border-2 border-white" onClick={handleLogout}><IoLogOutOutline className="text-[29px] mt-[4px] mr-[3px]" /><p>Logout</p></button>
                                <NavLink to="/profile" className="text-black-500 w-[100%] text-[22px] px-[12px] py-[6px] font-medium flex items-center hover:bg-gray-800 hover:text-white rounded-xl border-2 border-white"><FaUserEdit className="text-[28px] mt-[4px] mr-[6px]" /><p>My Profile</p></NavLink>
                            </div>
                        </details>

                    ) : (
                        <NavLink to="/signin" className="text-white xsx:flex hidden text-lg px-[8px] py-[2px] font-medium items-center hover:bg-white hover:text-black rounded-xl border-2 border-white" onClick={handleLogout}><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Register</p></NavLink>
                    )}

                </div>
            </div>


            {/* Hamburger menu button */}
            <div className="relative bg-black md:hidden">

                {/* Full navbar for smaller screens */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ y: -100, height: 0 }}
                            animate={{ y: 0, height: "100vh", transition: { duration: 0.8 } }}
                            exit={{ y: -100, height: 0, transition: { duration: 0.5, delay: 0.3 } }}
                            className="fixed inset-0 bg-black flex flex-col h-screen px-4 py-3 z-40"
                            onClick={handleMenuToggle}
                        >
                            <div className='my-[25px]'></div>
                            {/* Menu items */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
                                exit={{ x: -100, opacity: 0, transition: { duration: 0.3 } }}
                                className="flex h-full pb-12 flex-col mt-10"
                                onClick={handleMenuToggle}
                            >
                                <NavLink href={"/"} className="font-medium w-[85%] rounded-lg bg-gray-800 mx-auto py-[5px] text-[18px] text-center text-slate-300 mb-[15px] cursor-pointer">Home</NavLink>
                                <NavLink href={"/techtoday"} className="font-medium w-[85%] rounded-lg bg-gray-800 mx-auto py-[5px] text-center text-[18px] text-slate-300 mb-[15px] cursor-pointer">Tech Today</NavLink>
                                <NavLink href={"/products"} className="font-medium w-[85%] rounded-lg bg-gray-800 mx-auto py-[5px] text-center text-[18px] text-slate-300 mb-[15px] cursor-pointer">Gadgets</NavLink>
                                <div className="mt-auto"></div>
                                {user ? (
                                    <button className="font-medium w-[85%] rounded-lg bg-gray-800 mx-auto py-[5px] text-[18px] text-center text-slate-300 mb-[15px] cursor-pointer" onClick={handleLogout}><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Logout</p></button>
                                ) : (
                                    <NavLink onClick={handleMenuToggle} to="/signup"  className="font-medium w-[85%] flex items-center py-3 px-3  rounded-lg bg-gray-900 mx-auto  text-[18px] text-center text-slate-300 mb-[15px] cursor-pointer"><IoLogOutOutline className="text-[28px] mr-[3px]" /><p>Get Started</p></NavLink>
                                )}
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/*
            
            <div className={`fixed top-0 left-0 w-3/5 h-full bg-black z-40 transition-transform duration-900 transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <div className="flex flex-col items-baseline text-white">
                    <div className="flex h-[calc(100vh-75px)] flex-col items-baseline ml-[-55px] text-white">
                        <NavLink to="/" className="mb-[75px]">Home</NavLink>
                        <NavLink to="/" onClick={toggleMenu} className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}><CiHome className="text-[25px] mt-[1px] mr-[4px]" />Home</NavLink>
                        <NavLink to="/techtoday" onClick={toggleMenu} className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}><LuNewspaper className="text-[25px] mt-[1px] mr-[4px]" />TechToday</NavLink>
                        <NavLink to="/products" onClick={toggleMenu} className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ""}`}><AiFillProduct className="text-[25px] mt-[1px] mr-[4px]" />Gadgets</NavLink>

                        <NavLink to="/profile" onClick={toggleMenu} className="text-white  text-lgl mt-[19px] px-[10px] py-[2px] flex items-center font-bold hover:bg-white border-2 border-white hover:text-black rounded-xl"><FaUserEdit className="text-[30px] mt-[1px] mr-[9px]" /><p>View Profile</p></NavLink>
                    </div>
                    <div className="ml-[-5px] flex">
                        <div className="w-[15px]"></div>
                        {user ? (
                            <button className="text-white text-xl px-[8px] py-[2px] font-medium flex items-center hover:bg-red-700 hover:text-white rounded-xl border-2 border-white" onClick={handleLogout}><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Logout</p></button>
                        ) : (
                            <NavLink onClick={toggleMenu} to="/signup" className="text-white text-xl px-[8px] py-[2px] font-medium flex items-center hover:bg-white hover:text-black rounded-xl border-2 border-white"><IoLogOutOutline className="text-[25px] mt-[3px] mr-[3px]" /><p>Get Started</p></NavLink>
                        )}
                    </div>
                </div>
            </div>
            */}
        </nav>
    );
};

export default Navbar;
