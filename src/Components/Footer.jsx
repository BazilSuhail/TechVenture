"use client"
import { MdOutlineFacebook } from "react-icons/md"
import { FaTwitterSquare } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa"
import { IoLogoYoutube } from "react-icons/io"
import { FaSearch } from "react-icons/fa"
import { useNavigate, Link } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-gradient-to-b from-black via-gray-950 to-[#1b1b1b] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-3 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">
              TechVenture
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-md">
              Your ultimate destination to find gadgets with Analysis, Specifications and expert Reviews
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://facebook.com" className="text-gray-400 hover:text-gray-100 transition-colors duration-300">
                <MdOutlineFacebook className="w-7 h-7" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-100 transition-colors duration-300">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-100 transition-colors duration-300">
                <FaTwitterSquare className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-gray-100 transition-colors duration-300">
                <IoLogoYoutube className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-md font-bold text-gray-50">Popular Categories</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/category/camera" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Camera
                  </Link>
                </li>
                <li>
                  <Link to="/category/desktops" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Desktops
                  </Link>
                </li>
                <li>
                  <Link to="/category/laptops" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Laptops
                  </Link>
                </li>
              </ul>

              <h3 className="text-md font-bold text-gray-50 pt-4">Top Companies</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/company/canon" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Canon
                  </Link>
                </li>
                <li>
                  <Link to="/company/dell" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Dell
                  </Link>
                </li>
                <li>
                  <Link to="/company/apple" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Apple
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-bold text-gray-50">Popular Subcategories</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/subcategory/dslr" className="text-gray-300 hover:text-white transition-colors duration-200">
                    DSLR
                  </Link>
                </li>
                <li>
                  <Link to="/subcategory/gaming-laptops" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Gaming Laptops
                  </Link>
                </li>
                <li>
                  <Link to="/subcategory/ultrabooks" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Ultrabooks
                  </Link>
                </li>
                <li>
                  <Link to="/subcategory/action-cameras" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Action Cameras
                  </Link>
                </li>
              </ul>

              <h3 className="text-md font-bold text-gray-50 pt-4">Most Searched Gadgets</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/gadget/iphone" className="text-gray-300 hover:text-white transition-colors duration-200">
                    iPhone
                  </Link>
                </li>
                <li>
                  <Link to="/gadget/galaxy-s21" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Galaxy S21
                  </Link>
                </li>
                <li>
                  <Link to="/gadget/macbook-pro" className="text-gray-300 hover:text-white transition-colors duration-200">
                    MacBook Pro
                  </Link>
                </li>
                <li>
                  <Link to="/gadget/surface-pro" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Surface Pro
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-md font-bold text-gray-50">Get in Touch</h3>
            <p className="text-gray-300">Have questions or feedback? We'd love to hear from you.</p>

            <button
              onClick={() => navigate("/searchprojects")}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaSearch className="w-4 h-4" />
              <span>Search A Gadget</span>
            </button>

            <div className="pt-4">
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for the latest tech updates and reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 TechVenture. All Rights Reserved</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm text-gray-400">
                <li>
                  <Link to="/privacy-policy" className="hover:text-gray-100 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="hover:text-gray-100 transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us" className="hover:text-gray-100 transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer