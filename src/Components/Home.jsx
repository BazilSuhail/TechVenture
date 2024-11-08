import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosRocket, IoIosSearch, IoLogoDribbble } from "react-icons/io";
import { FaBullseye, FaLightbulb, FaBalanceScale, FaUsers, FaCog, FaEnvelope, FaStar, FaChevronUp, FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MdOutlineDevices, MdSupportAgent } from "react-icons/md";

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

const faqs = [
    {
        question: "What types of clothing does Texleath Industries offer?",
        answer: "Texleath Industries specializes in exporting men's clothing, including categories such as sportswear, fitness wear, safety gear, and many more. We are experts in manufacturing and have a strong network in the e-commerce business."
    },
    {
        question: "How can I place an order?",
        answer: "You can place an order through our website by selecting the desired products and following the checkout process. For bulk or custom orders, please contact our sales team directly."
    },
    {
        question: "What are the payment options available?",
        answer: "We offer various payment options including credit/debit cards, PayPal, and bank transfers. All transactions are securely processed."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we offer international shipping. Please review our shipping policies or contact our support team for more information on shipping rates and delivery times."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of purchase, provided the items are in their original condition. Please refer to our return policy page for detailed instructions on how to process returns."
    }
];


const HomePage = () => {

    const [openIndex, setOpenIndex] = useState(null);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0.09, 0.15], [800, 0]);
    const yOpposite = useTransform(scrollYProgress, [0.09, 0.15], [-800, 0]);
    const opacity_Cards = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);
    const x = useTransform(scrollYProgress, [0.30, 0.38], [-900, 0]);
    const opacity = useTransform(scrollYProgress, [0.30, 0.38], [0, 1]);
    const navigate = useNavigate();


    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-[80px] w-full overflow-x-hidden bg-gray-100 ">
            <section className="h-screen z-40 w-screen flex flex-col justify-center items-center gradient-background">
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

                <motion.div className="mt-[-22px] lg:mt-[-15px] text-white flex sm:flex-row flex-col font-extrabold text-[40px] sm:text-[65px] md:text-[75px]"
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

                <div onClick={() => { navigate("/searchprojects") }} className='w-[95%] mt-[18px] xl:mt-[45px] md:w-[70%] lg:w-[52%] xl:w-[45%] flex justify-center mx-[5px] mb-[25px] p-[4px]'>
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
            </section>

            <h2 className="text-2xl absolute z-40 md:text-4xl font-[700] text-center bg-black text-white p-[15px] mx-auto w-[100%]">About Us</h2>

            <section className="pb-10 mt-[110px] z-30 bg-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-[20px] gap-8">
                    <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ y: yOpposite, opacity: opacity_Cards }}>
                        <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                            <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex items-center justify-center"> <FaBullseye size={24} /></div>
                            <h3 className="text-xl font-bold">Our Mission</h3>
                        </div>
                        <p className="text-gray-600">
                            Our mission is to provide reliable, up-to-date information on the latest gadgets and technology to help our users make informed decisions.
                        </p>
                    </motion.div>

                    <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ y: yOpposite, opacity: opacity_Cards }}>
                        <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                            <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex items-center justify-center"> <FaLightbulb size={24} /></div>

                            <h3 className="text-xl font-bold">Our Vision</h3>
                        </div>
                        <p className="text-gray-600">
                            We envision a world where technology enhances everyday life, and our goal is to be the leading source of tech reviews and insights.
                        </p>
                    </motion.div>

                    <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ y: yOpposite, opacity: opacity_Cards }}>
                        <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                            <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex items-center justify-center"> <FaBalanceScale size={24} /></div>

                            <h3 className="text-xl font-bold">Our Values</h3>
                        </div>
                        <p className="text-gray-600">
                            Integrity, transparency, and excellence are at the core of everything we do. We strive to provide honest reviews and high-quality content.
                        </p>
                    </motion.div>

                    <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ y, opacity: opacity_Cards }}>
                        <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                            <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex items-center justify-center"> <FaUsers size={24} /></div>
                            <h3 className="text-xl font-bold">Our Team</h3>
                        </div>
                        <p className="text-gray-600">
                            Our team consists of experienced tech enthusiasts, writers, and researchers dedicated to bringing you the best information.
                        </p>
                    </motion.div>

                    <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ y, opacity: opacity_Cards }}>
                        <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                            <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex items-center justify-center"> <FaCog size={24} /></div>
                            <h3 className="text-xl font-bold">Our Services</h3>
                        </div>
                        <p className="text-gray-600">
                            We offer a range of services including tech reviews, buyer guides, and the latest news in the technology sector.
                        </p>
                    </motion.div>

                    <motion.div className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ y, opacity: opacity_Cards }}>
                        <div className="flex items-center space-x-2 text-gray-700 p-2 rounded-md mb-4">
                            <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex items-center justify-center"> <FaEnvelope size={18} /></div>
                            <h3 className="text-xl font-bold">Contact Us</h3>
                        </div>
                        <p className="text-gray-600">
                            Have questions or feedback? Reach out to us anytime via our contact page or through our social media channels.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className=' w-[100%] bg-black py-[55px]'>
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

            <section className="pb-10 xl:px-[65px] bg-black">
                <div className="text- mb-[6px]">
                    <h2 className="  text-2xl md:text-[35px] font-[700] w-[100%] text-gray-200 p-[15px]">Why Trust Us?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-[20px] gap-8" id="mission-section">
                    <motion.div className="p-6 bg-gray-800 flex items-center text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <IoLogoDribbble size={28} className="mr-4" />
                        <div>
                            <h3 className="text-[22px] font-bold mb-1">Expert Reviews</h3>
                            <p className="text-sm">Our team of experts provides detailed and honest reviews to ensure you get the best insights.</p>
                        </div>
                    </motion.div>

                    <motion.div className="p-6 bg-gray-800 flex items-center text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <IoIosRocket size={28} className="mr-4" />
                        <div>
                            <h3 className="text-[22px] font-bold mb-1">Latest Updates</h3>
                            <p className="text-sm">Stay ahead with the latest updates on new gadget releases and technological advancements.</p>
                        </div>
                    </motion.div>

                    <motion.div className="p-6 bg-gray-800 flex items-center text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <MdOutlineDevices size={28} className="mr-4" />
                        <div>
                            <h3 className="text-[22px] font-bold mb-1">User-Friendly Interface</h3>
                            <p className="text-sm">Our website is designed to provide you with a seamless and enjoyable browsing experience.</p>
                        </div>
                    </motion.div>

                    <motion.div className="p-6 bg-gray-800 flex items-center text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                        style={{ opacity, x }}
                    >
                        <MdSupportAgent size={28} className="mr-4" />
                        <div>
                            <h3 className="text-[22px] font-bold mb-1">Customer Support</h3>
                            <p className="text-sm">We offer 24/7 customer support to assist you with any queries or concerns you may have.</p>
                        </div>
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

            <section className='xl:px-[150px] mt-[115px] px-[15px] flex flex-col lg:px-[35px]'>
                <h1 className='text-2xl md:text-3xl flex items-center font-bold mx-auto text-gray-700'>
                    <FaQuestionCircle className='inline mr-2' />
                    Frequently Asked Questions
                </h1>
                <p className='text-[17px] text-center xl:px-[220px] mt-[25px] text-gray-800  font-[500] font-serif mb-6'>
                    Welcome to the FAQ section of TechVenture. Here you'll find answers to common questions about our catalog, products, and reviews. If you have any other inquiries, feel free to reach out to our customer support team.
                </p>

                <div className='h-[3px] w-full mb-[25px] mx-auto bg-gray-300 '></div>

                <div>
                    {faqs.map((faq, index) => (
                        <div key={index} className='mb-4'>
                            <button
                                className='w-full text-left text-lg font-semibold text-gray-800 py-[15px] px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-between'
                                onClick={() => handleToggle(index)}
                                type='button'
                            >
                                <span>{faq.question}</span>
                                <motion.div
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: openIndex === index ? 0.8 : 1.2 }}
                                    transition={{ duration: 0.5 }}
                                    className='text-gray-800'
                                >
                                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='mt-2 px-4'
                                    >
                                        <p className='text-gray-700'>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-[50px]  text-center">
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
