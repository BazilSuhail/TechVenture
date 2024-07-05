import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaStar } from 'react-icons/fa';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="pt-[80px] bg-gray-100">
            <section className="h-[100vh] w-full flex flex-col justify-center items-center text-white shadow-lg gradient-background">
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>

                <div className="mt-[-72px] lg:mt-[-85px] flex sm:flex-row flex-col font-extrabold text-[45px] sm:text-[65px] md:text-[75px]">
                    <p className="text-gray-400">
                        Discover Gadgets
                    </p>
                    <p className="text-white mt-[-18px] sm:mt-[0px] mx-auto sm:ml-[15px]">&</p>
                </div>
                <div className="mt-[-22px] lg:mt-[-15px] flex sm:flex-row flex-col font-extrabold text-[45px] sm:text-[65px] md:text-[75px]">
                    Publish Reviews
                </div>

                <p className="px-[10px] text-sm md:text-md text-center font-bold text-gray-200 mt-[5px]">
                    Discover the future of technology with our expert reviews and in-depth analyses.
                </p>
                <p className="px-[10px]  text-sm md:text-md text-center font-bold text-gray-200 ">
                    TechVenture !! ultimate destination for the latest gadgets and their specifications.
                </p>


                <div onClick={() => { navigate("/searchprojects") }} className='w-[95%] md:w-[70%]  mt-[15px] flex justify-center mx-[5px] mb-[25px] p-[4px]'>
                    <div onClick={() => { navigate("/searchprojects") }} className='w-[85%] flex items-center p-[8px] border-2 border-white rounded-lg bg-white text-gray-800 font-medium'> <IoIosSearch onClick={() => { navigate("/searchprojects") }} className='text-gray-900 ml-[10px] mr-[25px]' size={28} /><p onClick={() => { navigate("/searchprojects") }}>   Search Gadget By Name !!</p> </div>
                </div>
            </section>


            <section className="py-10 bg-gray-200">
                <div className="text-center mb-8">
                    <h2 className="autoAppear text-2xl md:text-4xl font-extrabold w-[85vw] text-white rounded-2xl p-[15px] mx-auto bg-black">Why Choose Us?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-[20px] gap-8">
                    <div className="autoShow p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Reviews</h3>
                        <p className="text-gray-600">Our team of experts provides detailed and honest reviews to ensure you get the best insights.</p>
                    </div>
                    <div className="autoShow p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Latest Updates</h3>
                        <p className="text-gray-600">Stay ahead with the latest updates on new gadget releases and technological advancements.</p>
                    </div>
                    <div className="autoShow p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">User-Friendly Interface</h3>
                        <p className="text-gray-600">Our website is designed to provide you with a seamless and enjoyable browsing experience.</p>
                    </div>
                    <div className="autoShow p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Customer Support</h3>
                        <p className="text-gray-600">We offer 24/7 customer support to assist you with any queries or concerns you may have.</p>
                    </div>
                </div>
            </section>



            <section className="autoAppear py-[50px]">
                <div className="text-center mb-[30px]">
                    <h2 className="text-2xl md:text-6xl border-[3px] border-gray-900 mx-[25px] py-[15px]  rounded-[25px] font-extrabold text-gray-800">Testimonials</h2>
                    <p className="text-gray-600">Hear what our satisfied users have to say about TechVenture.</p>
                </div>
                <div className="flex flex-wrap justify-around">
                    <div className="autoBLur w-[90%] md:w-[60%] my-[15px] p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-[35px] font-bold text-gray-800">John Doe</h3>
                        <h3 className="text-md font-bold text-gray-400">john@gmail.com</h3>
                        <div className="flex my-[6px]">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    size={25}
                                    key={index}
                                    className={`cursor-pointer ${index < 5 ? 'text-yellow-500' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 font-medium text-center">"TechVenture's expert reviews have guided me through many tech purchases, ensuring I get the best value for my money. The detailed insights and comparisons make decision-making easy."</p>
                    </div>

                    <div className="autoBLur w-[90%] md:w-[60%] my-[15px] p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-[35px] font-bold text-gray-800">Jane Smith</h3>
                        <h3 className="text-md font-bold text-gray-400">jane.smith@example.com</h3>
                        <div className="flex my-[6px]">
                            {[...Array(4)].map((_, index) => (
                                <FaStar
                                    size={25}
                                    key={index}
                                    className={`cursor-pointer ${index < 4 ? 'text-yellow-500' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 font-medium text-center">"The detailed specifications and user-friendly interface of TechVenture make shopping for gadgets a breeze. I've found exactly what I needed with their clear and comprehensive reviews."</p>
                    </div>

                    <div className="autoBLur w-[90%] md:w-[60%] my-[15px] p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-[35px] font-bold text-gray-800">Robert Brown</h3>
                        <h3 className="text-md font-bold text-gray-400">rbrown@example.com</h3>
                        <div className="flex my-[6px]">
                            {[...Array(3)].map((_, index) => (
                                <FaStar
                                    size={25}
                                    key={index}
                                    className={`cursor-pointer ${index < 3 ? 'text-yellow-500' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 font-medium text-center">"TechVenture's expert reviews have guided me through many tech purchases, ensuring I get the best value for my money. Their recommendations have never disappointed."</p>
                    </div>

                    <div className="autoBLur w-[90%] md:w-[60%] my-[15px] p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-[35px] font-bold text-gray-800">Emily Johnson</h3>
                        <h3 className="text-md font-bold text-gray-400">emily.j@example.com</h3>
                        <div className="flex my-[6px]">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    size={25}
                                    key={index}
                                    className={`cursor-pointer ${index < 5 ? 'text-yellow-500' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 font-medium text-center">"TechVenture keeps me updated with the latest tech trends. I highly recommend this site to all tech enthusiasts! Their detailed insights and reliable updates have been invaluable."</p>
                    </div>

                </div>
            </section>

            <section className="py-[50px] bg-gray-200 text-center">
                <div>
                    <h2 className="autoAppear text-2xl md:text-4xl font-extrabold text-gray-800">Get Started</h2>
                    <p className="text-gray-600 mb-[20px]">Ready to dive into the world of gadgets? Use our search feature to find your next tech companion.</p>
                    <button className="bg-black text-white py-[10px] px-[20px] rounded-md shadow-lg hover:bg-gray-800 transition">Search for Gadgets</button>
                </div>
            </section>

            <footer className="py-6 px-4 lg:px-24 bg-black text-white text-center">
                <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="mb-4 lg:mb-0">
                        <p className="text-lg mb-2">&copy; 2024 TechVenture. All rights reserved.</p>
                        <p className="text-sm">Explore more: <a href="/about" className="hover:underline">About Us</a> | <a href="/careers" className="hover:underline">Careers</a> | <a href="/blog" className="hover:underline">Blog</a></p>
                    </div>
                    <nav className="flex md:flex-row flex-col md:mr-[0px] mr-auto lg:justify-end ">
                        <p className="hover:underline ml-[12px]">Home</p>
                        <p className="hover:underline ml-[12px]">TechToday</p>
                        <p className="hover:underline ml-[12px]">Tredning</p>
                        <p className="hover:underline ml-[12px]">Serach</p>
                        <p className="hover:underline ml-[12px]">Support</p>
                    </nav>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;
