import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaBullseye, FaLightbulb, FaBalanceScale, FaUsers, FaCog, FaEnvelope, FaStar } from 'react-icons/fa';

import { motion, useScroll, useTransform } from "framer-motion";

const reviews = [
    {
        name: "Jane Doe",
        review: "Texleath Industries has been an incredible partner. Their commitment to quality is evident in every product we receive. Highly recommended!",
        email: "jane.doe@example.com",
        rating: 5,
    },
    {
        name: "John Smith",
        review: "The attention to detail and customer service at Texleath Industries is second to none. I’m always impressed with their professionalism.",
        email: "john.smith@example.com",
        rating: 4,
    },
    {
        name: "Emily Johnson",
        review: "Exceptional quality and excellent service. Texleath Industries exceeds expectations every time!",
        email: "emily.johnson@example.com",
        rating: 3,
    },
    {
        name: "Michael Brown",
        review: "I've been consistently impressed with the products from Texleath Industries. Their attention to detail is unmatched.",
        email: "michael.brown@example.com",
        rating: 4,
    },
    {
        name: "Sarah Wilson",
        review: "Texleath Industries provides top-notch products and excellent customer support. I highly recommend them!",
        email: "sarah.wilson@example.com",
        rating: 5,
    },
    {
        name: "David Lee",
        review: "A fantastic company with exceptional quality. I’ve always been satisfied with their products and service.",
        email: "david.lee@example.com",
        rating: 5,
    },
];

// Define the variants for the reveal animation
const Sectionvariants = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const HomePage = () => {

    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0.09, 0.15], [0.95, 1]);
    const opacity_Cards = useTransform(scrollYProgress, [0.1, 0.12], [0.4, 1]);
    const x = useTransform(scrollYProgress, [0.33, 0.40], [-900, 0]);
    const opacity = useTransform(scrollYProgress, [0.33, 0.40], [0, 1]);
    const y = useTransform(scrollYProgress, [0.15, 0.18], [20, 0]);
    const navigate = useNavigate();

    return (
        <div className="pt-[80px] bg-gray-100 ">
            <motion.section className="  h-[100vh] w-full flex flex-col justify-center items-center text-white shadow-lg gradient-background"
                initial="hidden"
                animate="visible"
                variants={Sectionvariants}
            >
                {/*
                
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                */}

                <motion.div className="mt-[-72px] lg:mt-[-85px] flex sm:flex-row flex-col font-extrabold text-[40px] sm:text-[65px] md:text-[75px]"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                >
                    <p className="text-gray-400 ">
                        Discover Gadgets
                    </p>
                    <p className="text-white mt-[-18px] sm:mt-[0px] mx-auto sm:ml-[15px]">&</p>
                </motion.div>

                <motion.div className="mt-[-22px] lg:mt-[-15px] flex sm:flex-row flex-col font-extrabold text-[40px] sm:text-[65px] md:text-[75px]"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                >
                    Publish Reviews
                </motion.div>

                <p className="px-[10px] text-sm md:text-md sm:block hidden text-center font-bold text-gray-200 mt-[5px]">
                    Discover the future of technology with our expert reviews and in-depth analyses.
                </p>
                <p className="px-[10px] sm:block hidden text-sm md:text-md text-center font-bold text-gray-200 ">
                    TechVenture !! ultimate destination for the latest gadgets and their specifications.
                </p>


                <p className="px-[10px] sm:hidden block text-[15px] mt-[25px] text-center font-bold text-gray-200 ">
                    Discover the future of technology with our expert reviews and in-depth analyses.
                    TechVenture !! ultimate destination for the latest gadgets and their specifications.
                </p>

                <div onClick={() => { navigate("/searchprojects") }} className='w-[95%] mt-[18px] xl:mt-[65px] md:w-[70%] lg:w-[55%] flex justify-center mx-[5px] mb-[25px] p-[4px]'>
                    <motion.div onClick={() => { navigate("/searchprojects") }} className='w-[80%] sm:w-[85%] flex items-center p-[8px] border-2 border-white rounded-[28px] text-gray-50 font-medium'
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                    >
                        <IoIosSearch onClick={() => { navigate("/searchprojects") }} className='ml-[10px] mr-[25px]' size={28} />
                        <p onClick={() => { navigate("/searchprojects") }}>
                            Search Gadget By Name !!
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            <section className="pb-10 bg-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-extrabold bg-black text-white p-[15px] mx-auto w-[100%]">About Us</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-[20px] gap-8">
            <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                style={{ scale, y, opacity: opacity_Cards }}>
                <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                    <FaBullseye className="text-gray-800 text-2xl" />
                    <h3 className="text-xl font-bold">Our Mission</h3>
                </div>
                <p className="text-gray-600">
                    Our mission is to provide reliable, up-to-date information on the latest gadgets and technology to help our users make informed decisions.
                </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                style={{ scale, y, opacity: opacity_Cards }}>
                <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                    <FaLightbulb className="text-gray-800 text-2xl" />
                    <h3 className="text-xl font-bold">Our Vision</h3>
                </div>
                <p className="text-gray-600">
                    We envision a world where technology enhances everyday life, and our goal is to be the leading source of tech reviews and insights.
                </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                style={{ scale, y, opacity: opacity_Cards }}>
                <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                    <FaBalanceScale className="text-gray-800 text-2xl" />
                    <h3 className="text-xl font-bold">Our Values</h3>
                </div>
                <p className="text-gray-600">
                    Integrity, transparency, and excellence are at the core of everything we do. We strive to provide honest reviews and high-quality content.
                </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                style={{ scale, y, opacity: opacity_Cards }}>
                <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                    <FaUsers className="text-gray-800 text-2xl" />
                    <h3 className="text-xl font-bold">Our Team</h3>
                </div>
                <p className="text-gray-600">
                    Our team consists of experienced tech enthusiasts, writers, and researchers dedicated to bringing you the best information.
                </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                style={{ scale, y, opacity: opacity_Cards }}>
                <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                    <FaCog className="text-gray-800 text-2xl" />
                    <h3 className="text-xl font-bold">Our Services</h3>
                </div>
                <p className="text-gray-600">
                    We offer a range of services including tech reviews, buyer guides, and the latest news in the technology sector.
                </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                style={{ scale, y, opacity: opacity_Cards }}>
                <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                    <FaEnvelope className="text-gray-800 text-2xl" />
                    <h3 className="text-xl font-bold">Contact Us</h3>
                </div>
                <p className="text-gray-600">
                    Have questions or feedback? Reach out to us anytime via our contact page or through our social media channels.
                </p>
            </motion.div>
        </div>
            </section>

            <section className='w-[100%] bg-black py-[22px]'>
                <div className="slider" style={{ '--width': '120px', '--height': '52px', '--quantity': 10 }}>
                    <div className="list">
                        <div className="item" style={{ '--position': 1 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Smartphones</div></div>
                        <div className="item" style={{ '--position': 2 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Flagships</div></div>
                        <div className="item" style={{ '--position': 3 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Tablets</div></div>
                        <div className="item" style={{ '--position': 4 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Laptops</div></div>
                        <div className="item" style={{ '--position': 5 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Camera</div></div>
                        <div className="item" style={{ '--position': 6 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Desktops</div></div>
                        <div className="item" style={{ '--position': 7 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Accessories</div></div>
                        <div className="item" style={{ '--position': 8 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Speakers</div></div>
                        <div className="item" style={{ '--position': 9 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Processors</div></div>
                        <div className="item" style={{ '--position': 10 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Ipads</div></div>
                    </div>
                </div>
                <div className="slider mt-[-5px]" style={{ '--width': '140px', '--height': '52px', '--quantity': 10 }} reverse="true">
                    <div className="list">
                        <div className="item" style={{ '--position': 2 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">AMD</div></div>
                        <div className="item" style={{ '--position': 3 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Xiomi</div></div>
                        <div className="item" style={{ '--position': 1 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Iphone</div></div>
                        <div className="item" style={{ '--position': 4 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Oppo</div></div>
                        <div className="item" style={{ '--position': 5 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Nvidia</div></div>
                        <div className="item" style={{ '--position': 6 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Qualcomm</div></div>
                        <div className="item" style={{ '--position': 7 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Intel</div></div>
                        <div className="item" style={{ '--position': 8 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Meta</div></div>
                        <div className="item" style={{ '--position': 9 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Poco</div></div>
                        <div className="item" style={{ '--position': 10 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Vivo</div></div>
                    </div>
                </div>
                <div className="slider mt-[-5px]" style={{ '--width': '180px', '--height': '52px', '--quantity': 10 }} >
                    <div className="list">
                        <div className="item" style={{ '--position': 1 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Iphone 13</div></div>
                        <div className="item" style={{ '--position': 2 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Ryzen 9 5900X</div></div>
                        <div className="item" style={{ '--position': 3 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Redmi Note 10</div></div>
                        <div className="item" style={{ '--position': 4 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Oppo Find X3</div></div>
                        <div className="item" style={{ '--position': 5 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">GeForce RTX 3080</div></div>
                        <div className="item" style={{ '--position': 6 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Snapdragon 888</div></div>
                        <div className="item" style={{ '--position': 7 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Core i9-11900K</div></div>
                        <div className="item" style={{ '--position': 8 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Oculus Quest 2</div></div>
                        <div className="item" style={{ '--position': 9 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Poco X3</div></div>
                        <div className="item" style={{ '--position': 10 }}><div className="bg-gray-800 text-white rounded-2xl text-center text-lg font-medium py-[4px]">Vivo V21</div></div>
                    </div>
                </div>
            </section>

            <section className="pb-10 bg-gray-900">
                <div className="text-center mb-8">
                    <h2 className="  text-2xl md:text-4xl font-extrabold w-[100%] text-black bg-gray-200 p-[15px]">Why Trust Us?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-[20px] gap-8" id="mission-section">
                    <motion.div className=" p-6 bg-gray-700 text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <h3 className="text-[25px] font-bold  mb-2">Expert Reviews</h3>
                        <p >Our team of experts provides detailed and honest reviews to ensure you get the best insights.</p>
                    </motion.div>
                    <motion.div className=" p-6 bg-gray-700 text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <h3 className="text-[25px] font-bold   mb-2">Latest Updates</h3>
                        <p >Stay ahead with the latest updates on new gadget releases and technological advancements.</p>
                    </motion.div>
                    <motion.div className=" p-6 bg-gray-700 text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <h3 className="text-[25px] font-bold   mb-2">User-Friendly Interface</h3>
                        <p >Our website is designed to provide you with a seamless and enjoyable browsing experience.</p>
                    </motion.div>
                    <motion.div className=" p-6 bg-gray-700 text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <h3 className="text-[25px] font-bold   mb-2">Customer Support</h3>
                        <p  >We offer 24/7 customer support to assist you with any queries or concerns you may have.</p>
                    </motion.div>
                </div>
            </section>

            <section className='md:w-[90%] xl:w-[85%] w-[95%] mb-[45px] mx-auto mt-[35px]'>
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-6 text-gray-700 text-center">
                        Testimonials
                    </h2>
                    <p className="text-gray-800 text-center font-serif">Hear what our satisfied users have to say about TechVenture.</p>
                    <div className='flex w-full h-2 sm:h-4 mx-auto justify-center mb-[25px] items-center'>
                        <div className='h-[3px] w-[89%] mx-auto bg-gray-300 '></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                <div className='flex items-center'>
                                    <div className='flex flex-col'>
                                        <p className="font-bold">{review.name}</p>
                                        <p className="text-sm text-gray-600">{review.email}</p>
                                    </div>
                                </div>

                                <div className="flex mt-2">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <FaStar
                                            key={i}
                                            size={18}
                                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <p className="text-md text-red-950 font-serif  my-4">{review.review}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="py-[50px] bg-gray-200 text-center">
                <div>
                    <h2 className="  text-2xl md:text-4xl font-extrabold text-gray-800">Get Started</h2>
                    <p className="text-gray-600 pt-[15px] font-bold mb-[20px]">Ready to dive into the world of gadgets? Use our search feature to find your next tech companion.</p>
                    <button className="bg-black text-white py-[10px] px-[20px] rounded-md shadow-lg hover:bg-gray-800 transition" onClick={() => { navigate("/products") }}>Search for Gadgets</button>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
