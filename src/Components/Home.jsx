import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosRocket, IoIosSearch, IoLogoDribbble } from "react-icons/io";
import { 
  FaBullseye, FaLightbulb, FaBalanceScale, FaUsers, FaCog, FaEnvelope, 
  FaStar, FaChevronUp, FaChevronDown, FaQuestionCircle, FaArrowRight, 
  FaLaptop, FaMobileAlt, FaHeadphones, FaCamera, FaRegLightbulb,
  FaShieldAlt, FaRegThumbsUp, FaRegCommentDots
} from 'react-icons/fa';
import { 
  MdOutlineDevices, MdSupportAgent, MdCompare, 
  MdOutlineCategory, MdOutlineReviews, MdOutlineNewReleases 
} from "react-icons/md";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { BiCategoryAlt } from "react-icons/bi";

const reviews = [
    {
        name: "Jane Doe",
        review: "Texleath Industries has been an incredible partner. Their commitment to quality is evident in every product we receive. Highly recommended!",
        email: "jane.doe@example.com",
        rating: 5,
    },
    {
        name: "John Smith",
        review: "The attention to detail and customer service at Texleath Industries is second to none. I'm always impressed with their professionalism.",
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
        review: "A fantastic company with exceptional quality. I've always been satisfied with their products and service.",
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

const featuredCategories = [
  {
    name: "Smartphones",
    icon: <FaMobileAlt className="text-gray-100" size={24} />,
    count: "1,200+ Products",
    description: "Latest flagship and budget smartphones"
  },
  {
    name: "Laptops",
    icon: <FaLaptop className="text-gray-100" size={24} />,
    count: "850+ Products",
    description: "Gaming, business, and ultrabooks"
  },
  {
    name: "Audio",
    icon: <FaHeadphones className="text-gray-100" size={24} />,
    count: "950+ Products",
    description: "Headphones, earbuds, and speakers"
  },
  {
    name: "Cameras",
    icon: <FaCamera className="text-gray-100" size={24} />,
    count: "600+ Products",
    description: "DSLR, mirrorless, and action cameras"
  }
];

const howItWorks = [
  {
    title: "Browse Categories",
    icon: <BiCategoryAlt size={28} />,
    description: "Explore our extensive catalog of gadgets organized by categories and brands."
  },
  {
    title: "Read Expert Reviews",
    icon: <MdOutlineReviews size={28} />,
    description: "Get insights from our team of tech experts and community reviews."
  },
  {
    title: "Compare Specifications",
    icon: <MdCompare size={28} />,
    description: "Compare different products side by side to find the perfect match for your needs."
  },
  {
    title: "Stay Updated",
    icon: <MdOutlineNewReleases size={28} />,
    description: "Keep up with the latest tech releases and industry trends."
  }
];

const stats = [
  { number: "10K+", label: "Products", icon: <MdOutlineDevices size={24} /> },
  { number: "5K+", label: "Reviews", icon: <MdOutlineReviews size={24} /> },
  { number: "120+", label: "Categories", icon: <MdOutlineCategory size={24} /> },
  { number: "50+", label: "Brands", icon: <FaRegLightbulb size={24} /> }
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
        <div className="pt-[80px] w-full overflow-x-hidden bg-gray-100">
            {/* Hero Section */}
            <section className="h-screen z-40 w-screen flex flex-col justify-center items-center gradient-background">
                <motion.div className="mt-[-72px] lg:mt-[-85px] flex sm:flex-row flex-col font-extrabold text-[40px] sm:text-[65px] md:text-[75px]"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                >
                    <p className="text-gray-400">
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
                <p className="px-[10px] sm:block hidden text-sm md:text-md text-center font-bold text-gray-200">
                    TechVenture !! ultimate destination for the latest gadgets and their specifications.
                </p>

                <p className="px-[10px] sm:hidden block text-[15px] mt-[25px] text-center font-bold text-gray-200">
                    Discover the future of technology with our expert reviews and in-depth analyses.
                    TechVenture !! ultimate destination for the latest gadgets and their specifications.
                </p>

                <div onClick={() => { navigate("/searchprojects") }} className='w-[95%] mt-[18px] xl:mt-[45px] md:w-[70%] lg:w-[52%] xl:w-[45%] flex justify-center mx-[5px] mb-[25px] p-[4px]'>
                    <motion.div onClick={() => { navigate("/searchprojects") }} className='w-[80%] sm:w-[85%] flex items-center p-[8px] border-2 border-white rounded-[28px] text-gray-50 font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-300'
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <IoIosSearch onClick={() => { navigate("/searchprojects") }} className='ml-[10px] mr-[25px]' size={28} />
                        <p onClick={() => { navigate("/searchprojects") }}>
                            Search Gadget By Name !!
                        </p>
                    </motion.div>
                </div>
            </section>

            <h2 className="text-2xl absolute z-40 md:text-4xl font-[700] text-center bg-black text-white p-[15px] mx-auto w-[100%]">About Us</h2>

            {/* About Us Section */}
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

            {/* Categories Slider Section */}
            <section className='w-[100%] bg-black py-[55px]'>
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

            {/* Why Trust Us Section */}
            <section className="pb-10 xl:px-[65px] bg-black">
                <div className="text- mb-[6px]">
                    <h2 className="text-2xl md:text-[35px] font-[700] w-[100%] text-gray-200 p-[15px]">Why Trust Us?</h2>
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

            {/* NEW SECTION 1: Featured Categories */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Categories</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Explore our most popular gadget categories with expert reviews and detailed specifications</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredCategories.map((category, index) => (
                            <motion.div 
                                key={index}
                                className="bg-black rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                                <div className="p-6">
                                    <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                                    <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 text-sm">{category.count}</span>
                                        <button 
                                            onClick={() => navigate("/products")}
                                            className="flex items-center text-gray-300 hover:text-white transition-colors"
                                        >
                                            Explore <FaArrowRight className="ml-2" size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION 2: How It Works */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How TechVenture Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Your comprehensive guide to discovering and comparing the latest technology</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-gray-100 rounded-xl p-6 h-full">
                                    <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4 text-white">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                                
                                {index < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                                        <FaArrowRight className="text-gray-400" size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SECTION 3: Stats Counter */}
            <section className="py-16 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">TechVenture by Numbers</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Our growing catalog of tech products and expert reviews</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className='md:w-[90%] xl:w-[85%] w-[95%] mb-[45px] mx-auto mt-[35px]'>
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-6 text-gray-700 text-center">
                        Testimonials
                    </h2>
                    <p className="text-gray-800 text-center font-serif">Hear what our satisfied users have to say about TechVenture.</p>
                    <div className='flex w-full h-2 sm:h-4 mx-auto justify-center mb-[25px] items-center'>
                        <div className='h-[3px] w-[89%] mx-auto bg-gray-300'></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
                                <p className="text-md text-red-950 font-serif my-4">{review.review}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IMPROVED: FAQ Section */}
            <section className='py-16 bg-gray-100'>
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center'>
                            <FaQuestionCircle className='mr-3 text-gray-700' />
                            Frequently Asked Questions
                        </h2>
                        <p className='text-gray-600 max-w-3xl mx-auto'>
                            Welcome to the FAQ section of TechVenture. Here you'll find answers to common questions about our catalog, products, and reviews.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className='bg-white rounded-xl overflow-hidden shadow-md'>
                                <button
                                    className={`w-full text-left py-5 px-6 focus:outline-none transition-colors duration-300 ${
                                        openIndex === index ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleToggle(index)}
                                    type='button'
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium">{faq.question}</span>
                                        <motion.div
                                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {openIndex === index ? 
                                                <FaChevronUp className={`${openIndex === index ? 'text-white' : 'text-gray-500'}`} /> : 
                                                <FaChevronDown className="text-gray-500" />
                                            }
                                        </motion.div>
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 py-5 bg-white border-t border-gray-100">
                                                <p className='text-gray-700 leading-relaxed'>{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IMPROVED: Get Started Section */}
            <section className="py-20 bg-black text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Explore the Tech World?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                        Join thousands of tech enthusiasts who discover, compare, and review the latest gadgets on TechVenture.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <motion.button 
                            className="bg-white text-black py-4 px-8 rounded-full font-bold text-lg flex items-center shadow-lg hover:bg-gray-100 transition-all duration-300"
                            onClick={() => { navigate("/products") }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IoIosSearch className="mr-2" size={24} />
                            Browse Gadgets
                        </motion.button>
                        
                        <motion.button 
                            className="bg-gray-800 text-white py-4 px-8 rounded-full font-bold text-lg flex items-center shadow-lg hover:bg-gray-700 transition-all duration-300"
                            onClick={() => { navigate("/tech-today") }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <HiOutlineTrendingUp className="mr-2" size={24} />
                            Latest Tech News
                        </motion.button>
                    </div>
                    
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <FaRegThumbsUp size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Trusted Reviews</h3>
                            <p className="text-gray-400">Honest opinions from tech experts and community</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <FaShieldAlt size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Verified Information</h3>
                            <p className="text-gray-400">Accurate specs and detailed comparisons</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <FaRegCommentDots size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Community Insights</h3>
                            <p className="text-gray-400">Join discussions with fellow tech enthusiasts</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
