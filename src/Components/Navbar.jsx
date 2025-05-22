"use client"

import { useState, useEffect, useRef } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../Config/Config"
import { FiSettings, FiX } from "react-icons/fi"
import { CgMenuLeftAlt } from "react-icons/cg"
import { IoLogOutOutline } from "react-icons/io5"
import { motion, AnimatePresence } from "framer-motion"
import { FaUserEdit } from "react-icons/fa"
import { IoIosSearch } from "react-icons/io"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setActiveDropdown(!activeDropdown)
  }

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      authListener.subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate("/signin")
    } catch (error) {
      console.error("Error logging out:", error.message)
    }
  }

  const handleMenuToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="z-50">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full h-[80px] fixed p-4 z-50 transition-all duration-300 ${
          scrolled ? "bg-black bg-opacity-95 shadow-lg backdrop-blur-sm" : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          {/* Mobile Menu Button */}
          <button
            className="xsx:hidden text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <CgMenuLeftAlt size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="xsx:flex hidden items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2 font-medium transition-colors duration-300 hover:text-gray-300 ${
                  isActive
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                    : "text-gray-300"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/techtoday"
              className={({ isActive }) =>
                `relative px-4 py-2 font-medium transition-colors duration-300 hover:text-gray-300 ${
                  isActive
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                    : "text-gray-300"
                }`
              }
            >
              TechToday
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `relative px-4 py-2 font-medium transition-colors duration-300 hover:text-gray-300 ${
                  isActive
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                    : "text-gray-300"
                }`
              }
            >
              Gadgets
            </NavLink>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              TechVenture
            </motion.div>
          </div>

          {/* Right Side - Search & User */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <NavLink
              to="/searchprojects"
              className="xsx:hidden block text-white hover:text-gray-300 transition-colors duration-300"
            >
              <IoIosSearch size={30} />
            </NavLink>

            {/* Search Button - Desktop */}
            <NavLink
              to="/searchprojects"
              className="hidden xsx:flex items-center text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300"
            >
              <IoIosSearch size={20} className="mr-2" />
              <span className="font-medium">Search</span>
            </NavLink>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-all duration-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  aria-label="User menu"
                >
                  <FaUserEdit size={22} />
                </button>

                <AnimatePresence>
                  {activeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      <NavLink
                        to="/profile"
                        className="flex items-center w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <FiSettings size={18} className="mr-3 text-gray-600" />
                        <span className="font-medium">My Profile</span>
                      </NavLink>
                      <div className="h-px bg-gray-200"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <IoLogOutOutline size={20} className="mr-3 text-gray-600" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                to="/signin"
                className="hidden xsx:flex items-center text-white hover:bg-white hover:text-black px-4 py-2 rounded-full transition-colors duration-300 border border-white font-medium"
              >
                <IoLogOutOutline size={20} className="mr-2" />
                <span>Register</span>
              </NavLink>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[80px] left-0 right-0 bg-black z-40 border-t border-gray-800"
          >
            <div className="flex flex-col p-4 space-y-3">
              <NavLink
                to="/"
                className="text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/techtoday"
                className="text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                TechToday
              </NavLink>
              <NavLink
                to="/products"
                className="text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Gadgets
              </NavLink>
              <NavLink
                to="/searchprojects"
                className="text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <IoIosSearch size={20} className="mr-2" />
                <span>Search</span>
              </NavLink>
              {!user && (
                <NavLink
                  to="/signin"
                  className="text-white py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <IoLogOutOutline size={20} className="mr-2" />
                  <span>Register</span>
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
