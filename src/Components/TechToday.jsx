import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { Link } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';
import { FaRegCalendarPlus, FaStar } from 'react-icons/fa';
import { AiOutlineLike } from 'react-icons/ai';


const TechToday = () => {
    const [topLikedProducts, setTopLikedProducts] = useState([]);
    const [recentlyCreatedProducts, setRecentlyCreatedProducts] = useState([]);
    const [recentlyCreatedReviews, setRecentlyCreatedReviews] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [news, setNews] = useState([]);
    //const sapiKey = '1330f7f3382c28ce768d06b7be4097a7';
    const apiKey = '1330f7f3382c28ce768d06b7be4097a7';

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    `https://api.mediastack.com/v1/news?access_key=${apiKey}&categories=technology`
                );

                const data = await response.json();  
                    console.log(data.data);
                    console.log("Length is "+data.data.length); 

                if (data.data.length > 0) {
                    setNews(data.data);
                    //console.log("Length is "+data.data.length);
                    setTotalPages(Math.ceil(data.data.length / 6));
                } else {
                    setNews([]);
                    setTotalPages(1);
                    console.warn("No news data available");
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, [apiKey]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const fetchTopLikedProducts = async () => {
                    const { data: products, error } = await supabase
                        .from('products')
                        .select('*');

                    if (error) {
                        throw error;
                    }

                    const productsWithLikes = await Promise.all(
                        products.map(async (product) => {
                            const { data: likesData, error: likesError } = await supabase
                                .from('product_likes')
                                .select('user_id')
                                .eq('product_id', product.id);

                            if (likesError) {
                                throw likesError;
                            }

                            return { ...product, likes: likesData.length };
                        })
                    );

                    const sortedProducts = productsWithLikes
                        .sort((a, b) => b.likes - a.likes)
                        .slice(0, 5);

                    setTopLikedProducts(sortedProducts);
                };

                // Fetch top 5 recently created products
                const fetchRecentlyCreatedProducts = async () => {
                    const { data: createdProducts, error: createdProductsError } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(5);

                    if (createdProductsError) throw createdProductsError;

                    setRecentlyCreatedProducts(createdProducts);
                };


                // Fetch top 5 recently created reviews
                const fetchRecentlyCreatedReviews = async () => {
                    const { data: createdReviews, error: createdReviewsError } = await supabase
                        .from('product_reviews')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(5);

                    if (createdReviewsError) throw createdReviewsError;

                    setRecentlyCreatedReviews(createdReviews);

                    fetchUserNamesAndProductNames(createdReviews);
                };

                // Fetch user names and product names based on user IDs and product IDs in reviews
                const fetchUserNamesAndProductNames = async (reviews) => {
                    const userIds = reviews.map((review) => review.user_id);

                    const usersData = await Promise.all(
                        userIds.map(async (userId) => {
                            const { data: userData, error } = await supabase
                                .from('profiles')
                                .select('full_name')
                                .eq('user_id', userId)
                                .single();

                            if (error) {
                                console.error('Error fetching user data:', error.message);
                                return null;
                            }

                            return { userId, userName: userData.full_name };
                        })
                    );

                    const userNamesMap = usersData.reduce((acc, curr) => {
                        if (curr) {
                            acc[curr.userId] = curr.userName;
                        }
                        return acc;
                    }, {});
                    setUserNames((prevNames) => ({ ...prevNames, ...userNamesMap }));
                };

                await fetchTopLikedProducts();
                await fetchRecentlyCreatedProducts();
                await fetchRecentlyCreatedReviews();

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const truncateDescription = (description) => {
        return description.length > 50 ? description.slice(0, 50) + '...' : description;
    };

    const displayedNews = news.length > 0
        ? news.slice((currentPage - 1) * 6, currentPage * 6)
        : [];

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handlePageClick = (pageNum) => setCurrentPage(pageNum);

    return (
        <div className="overflow-x-hidden min-h-screen bg-gray-100 pt-[85px] text-gray-800">
            {loading ? (
                <div className='flex justify-center items-center h-[calc(100vh-95px)]'>
                    <Bars height="50" width="50" color="#363636" ariaLabel="loading" visible />
                </div>
            ) : (
                <div className="">
                    <h1 className="text-center mt-[45px] mb-[-25px] text-3xl md:text-4xl font-bold  text-gray-800">Catchout Tech Latest News</h1>
                    {displayedNews ?
                        <section className="scale-[0.9] container mx-auto px-6 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedNews.map((article) => (
                                    <div key={article.url} className="bg-white h-[520px] flex flex-col rounded-lg shadow-lg overflow-hidden">
                                        <img
                                            src={article.image || 'https://via.placeholder.com/150'}
                                            alt={article.title}
                                            className="w-full h-56 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>
                                            <p className="text-gray-600 mb-4">{article.description.length > 200 ? article.description.slice(0, 200) + '...' : article.description}</p>
                                            <Link to={article.url} target="_blank" className="text-blue-600 underline text-[18px] mt-auto font-[600] underline-offset-2">
                                                Read More..
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="xl:scale-[1.2] flex justify-center items-center mt-8 space-x-4">
                                <div onClick={goToPrevPage} className={`cursor-pointer ${currentPage === 1 && 'opacity-50 pointer-events-none'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageClick(index + 1)}
                                        className={`px-3 py-1 rounded-md font-semibold ${currentPage === index + 1 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <div onClick={goToNextPage} className={`cursor-pointer ${currentPage === totalPages && 'opacity-50 pointer-events-none'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </section>
                        : <p classname="text-green-600 text-[18px]">No Latest News Found ...</p>
                    }


                    <section className="grid md:scale-[0.88] mt-[-15px] scale-[0.82] overflow-hidden md:grid-cols-2 grid-cols-1 lg:grid-cols-4 place-content-center my-[28px]" >
                        <div className="flex items-center justify-center mx-auto  text-gray-800 py-[30px] ">
                            <div className='text-[80px] md:text-[55px] mr-[12px] font-mono font-[500]'>1500+</div>
                            <div className="text-center mt-[5px] rounded-lg font-[600] text-gray-500 text-lg">Catalog<div>Gadgets</div></div>
                        </div>
                        <div className="flex items-center justify-center mx-auto text-gray-700 py-[30px] ">
                            <div className='text-[80px] md:text-[55px] mr-[12px] font-mono font-[500]'>1000</div>
                            <div className="text-center mt-[5px] rounded-lg font-[600] text-gray-500 text-lg">120 <div>Categories</div></div>
                        </div>
                        <div className="flex items-center justify-center mx-auto  text-gray-700 py-[30px] ">
                            <div className='text-[80px] md:text-[55px] mr-[12px] font-mono font-[500]'>2500+</div>
                            <div className="text-center mt-[5px] rounded-lg font-[600] text-gray-500 text-lg">Expert<div>Reviewers</div></div>
                        </div>
                        <div className="flex items-center justify-center mx-auto  text-gray-700 py-[30px] ">
                            <div className='text-[80px] md:text-[55px] mr-[12px] font-mono font-[500]'>150,000</div>
                            <div className="text-center mt-[5px] rounded-lg font-[600] text-gray-500 text-lg">Reviews <div>Made</div></div>
                        </div>
                    </section>

                    {/* Top 5 Most Liked Products */}
                    <section className='bg-black  py-[15px] px-[2px]  md:px-[15px]] text-white'>
                        <div className="text-[24px] my-[28px] md:text-[28px] underline text-center font-[700] ">Top 5 Most Liked Products</div>
                        <div className="my-[15px] flex overflow-x-auto scrollbar-hide">
                            {topLikedProducts.map((product) => (
                                <div key={product.id} className='flex flex-col justify-center bg-gray-800 rounded-xl mr-[25px] h-[375px] w-[390px] p-[8px] m-[6px]'>
                                    <h3 className='px-[6px] py-[16px] w-full bg-gray-600 font-[500] text-center text-[22px] rounded-[12px]'>{product.name}</h3>
                                    <p className='font-bold px-[4px] mt-[10px] h-[38%] text-md text-gray-300'>{truncateDescription(product.description)}</p>

                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center bg-gray-200 w-[95px] rounded-lg'>
                                            <div className='px-[15px] bg-blue-800 py-[6px] text-white rounded-lg'><AiOutlineLike size={18} /></div>
                                            <p className='text-[19px] font-[700] text-blue-900 ml-[12px]'>{product.likes}</p>
                                        </div>
                                        <div className='flex my-[5px] justify-between'> <p></p>
                                            <p className='text-lg align-baseline font-[600] text-blue-200'><span className='text-blue-300'>$</span><span className='underline'>{product.price.toFixed(2)}</span></p>
                                        </div>
                                    </div>
                                    <Link to={`/product-specifications/${product.id}`} className='bg-gray-900  text-center mx-auto mt-[15px] w-[360px] text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]' >
                                        Review Gadget
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className='py-[15px] px-[2px]  md:px-[15px] text-black'>
                        <div className="text-[24px] my-[28px] md:text-[28px] underline text-center font-[700] ">Recently Launched Gadgets</div>
                        <div className="my-[15px] flex overflow-x-auto scrollbar-hide">
                            {recentlyCreatedProducts.map((product) => (
                                <div key={product.id} className='flex flex-col justify-center   bg-white rounded-lg mr-[25px] h-[375px] w-[390px] py-[12px] px-[15px] m-[6px]'>
                                    <h3 className='px-[6px] py-[12px] bg-[#373232] text-white font-[600] text-center text-[22px] rounded-[12px]'>{product.name}</h3>
                                    <p className='font-[500] mt-[10px] h-[38%] text-md text-[#373232]'>{truncateDescription(product.description)}</p>

                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center bg-gray-200 w-[170px] rounded-lg'>
                                            <div className='px-[15px] bg-blue-800 py-[6px] text-white rounded-lg'><FaRegCalendarPlus size={18} /></div>
                                            <p className='text-[17px] font-[600] ml-[8px]'>{new Date(product.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div className='flex my-[5px] justify-between'> <p></p>
                                            <p className='text-lg align-baseline font-[700] text-blue-600'><span className='text-blue-800'>$</span><span className='underline'>{product.price.toFixed(2)}</span></p>
                                        </div>
                                    </div>

                                    <Link to={`/product-specifications/${product.id}`} className='bg-[#373232] text-center mx-auto mt-[15px] w-[360px] text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]' >
                                        Review Gadget
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recently Published Reviews */}
                    <section className="mb-16 rounded-lg p-6">
                        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-700">Recently Published Reviews</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentlyCreatedReviews.slice(0, 6).map(review => (
                                <div
                                    key={review.id}
                                    className="bg-white p-5 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className='flex items-start justify-between'>
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-800">
                                                {userNames[review.user_id]?.charAt(0)}
                                            </div>
                                            <div className='ml-3 flex flex-col'>
                                                <div className="text-gray-800">{userNames[review.user_id]}</div>
                                                <div className='flex items-center'>
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <FaStar key={index} className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className=' scale-[0.76] flex items-center bg-gray-200 w-[220px] rounded-lg'>
                                            <div className='px-[15px] bg-gray-500 py-[6px] text-white rounded-lg'><FaRegCalendarPlus size={18} /></div>
                                            <p className='text-[17px] font-[600] ml-[12px]'>{new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 break-words font-sans mb-4">{review.comment}</p>

                                </div>
                            ))}
                        </div>
                    </section>
                </div>

            )}
        </div>
    );
};
export default TechToday;
