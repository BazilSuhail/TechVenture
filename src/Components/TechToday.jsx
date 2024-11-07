import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { Link } from 'react-router-dom'; 
import { Bars } from 'react-loader-spinner';
import TechNews from './TechNews';

import { FaStar } from 'react-icons/fa';
import { AiOutlineLike, AiOutlineCalendar } from 'react-icons/ai';


const TechToday = () => {
    const [topLikedProducts, setTopLikedProducts] = useState([]);
    const [recentlyCreatedProducts, setRecentlyCreatedProducts] = useState([]);
    const [topLikedReviews, setTopLikedReviews] = useState([]);
    const [recentlyCreatedReviews, setRecentlyCreatedReviews] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [productNames, setProductNames] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch top 5 most liked products
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

                // Fetch top 5 liked reviews
                const fetchTopLikedReviews = async () => {
                    const { data: likedReviews, error: likedReviewsError } = await supabase
                        .from('product_reviews')
                        .select('*')
                        .order('likes', { ascending: false })
                        .limit(5);

                    if (likedReviewsError) throw likedReviewsError;

                    setTopLikedReviews(likedReviews);

                    fetchUserNamesAndProductNames(likedReviews);
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
                    const productIds = reviews.map((review) => review.product_id);

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

                    const productsData = await Promise.all(
                        productIds.map(async (productId) => {
                            const { data: productData, error } = await supabase
                                .from('products')
                                .select('name')
                                .eq('id', productId)
                                .single();

                            if (error) {
                                console.error('Error fetching product data:', error.message);
                                return null;
                            }

                            return { productId, productName: productData.name };
                        })
                    );

                    const userNamesMap = usersData.reduce((acc, curr) => {
                        if (curr) {
                            acc[curr.userId] = curr.userName;
                        }
                        return acc;
                    }, {});

                    const productNamesMap = productsData.reduce((acc, curr) => {
                        if (curr) {
                            acc[curr.productId] = curr.productName;
                        }
                        return acc;
                    }, {});

                    setUserNames((prevNames) => ({ ...prevNames, ...userNamesMap }));
                    setProductNames((prevNames) => ({ ...prevNames, ...productNamesMap }));
                };

                await fetchTopLikedProducts();
                await fetchRecentlyCreatedProducts();
                await fetchTopLikedReviews();
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

    return (
        <div className="overflow-x-hidden min-h-screen bg-white pt-[85px] text-gray-800">
        {loading ? (
            <div className='flex justify-center items-center h-[calc(100vh-95px)]'>
                <Bars height="50" width="50" color="#363636" ariaLabel="loading" visible />
            </div>
        ) : (
            <div className="px-6 md:px-12">
            <h1 className="text-center text-3xl md:text-4xl font-bold mb-8 text-gray-800">Catchout Latest News</h1>
        
            {/* Top 5 Most Liked Products */}
            <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-700">Top 5 Most Liked Products</h2>
                <div className="flex overflow-x-auto gap-6 scrollbar-hide">
                    {topLikedProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="bg-white p-5 rounded-xl w-[320px] shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <h3 className="text-center text-xl font-semibold text-gray-800">{product.name}</h3>
                            <p className="mt-3 text-sm text-gray-600">{truncateDescription(product.description)}</p>
                            <p className="text-center text-gray-800 font-bold mt-3">${product.price.toFixed(2)}</p>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center text-gray-600">
                                    <span className="text-blue-600 font-semibold">{product.likes}</span>
                                    <span className="ml-1">Likes</span>
                                </div>
                                <Link to={`/product-specifications/${product.id}`} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg font-semibold transition">
                                    Review
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        
            {/* Recently Launched Gadgets */}
            <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-700">Recently Launched Gadgets</h2>
                <div className="flex overflow-x-auto gap-6 scrollbar-hide">
                    {recentlyCreatedProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="bg-white p-5 rounded-xl w-[320px] shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <h3 className="text-center text-xl font-semibold text-gray-800">{product.name}</h3>
                            <p className="mt-3 text-sm text-gray-600">{truncateDescription(product.description)}</p>
                            <p className="text-center text-gray-800 font-bold mt-3">${product.price.toFixed(2)}</p>
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-500">
                                    {new Date(product.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <Link to={`/product-specifications/${product.id}`} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg font-semibold transition">
                                    Review
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        
            {/* Most Liked Reviews */}
            <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-700">Most Liked Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topLikedReviews.slice(0, 6).map(review => (
                        <div 
                            key={review.id} 
                            className="bg-white p-5 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-gray-800">
                                    {userNames[review.user_id]?.charAt(0)}
                                </div>
                                <div className="ml-3 text-gray-800">{userNames[review.user_id]}</div>
                            </div>
                            <div className="flex items-center mb-3">
                                <span className="text-gray-600 mr-2">Rating:</span>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <FaStar key={index} className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            <div className="flex items-center justify-end text-gray-500">
                                <AiOutlineLike className="mr-2" />
                                <span>{review.likes}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        
            {/* Recently Published Reviews */}
            <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-700">Recently Published Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentlyCreatedReviews.slice(0, 6).map(review => (
                        <div 
                            key={review.id} 
                            className="bg-white p-5 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-gray-800">
                                    {userNames[review.user_id]?.charAt(0)}
                                </div>
                                <div className="ml-3 text-gray-800">{userNames[review.user_id]}</div>
                            </div>
                            <div className="flex items-center mb-3">
                                <span className="text-gray-600 mr-2">Rating:</span>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <FaStar key={index} className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            <div className="flex items-center justify-end text-gray-500">
                                <AiOutlineCalendar className="mr-2" />
                                <span>
                                    {new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
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


/*


 <TechNews />
                    <section className='w-[100%] mt-[25px] '>
                        <div className="slider" style={{ '--width': '420px', '--height': '132px', '--quantity': 9 }}>
                            <div className="list">
                                <div className="techtoday" style={{ '--position': 1 }}><div className='text-black text-stroke '>ULTIMATE</div></div>
                                <div className="techtoday" style={{ '--position': 2 }}><div className='text-no-stroke text-stroke '>DESTINATION</div></div>
                                <div className="techtoday" style={{ '--position': 3 }}><div className='text-black text-stroke '>FOR LATEST</div></div>
                                <div className="techtoday" style={{ '--position': 4 }}><div className='text-no-stroke  text-stroke'>GADGETS</div></div>
                                <div className="techtoday" style={{ '--position': 5 }}><div className='text-black text-stroke'>AND</div></div>
                                <div className="techtoday" style={{ '--position': 6 }}><div className=' text-no-stroke text-stroke '>IN DEPTH</div></div>
                                <div className="techtoday" style={{ '--position': 7 }}><div className='text-black text-stroke '>ANALYSIS</div></div>
                                <div className="techtoday" style={{ '--position': 8 }}><div className='text-no-stroke text-stroke '> WITH </div></div>
                                <div className="techtoday" style={{ '--position': 9 }}><div className='text-stroke text-black'> REVIEWS</div></div>
                            </div>
                        </div>
                    </section>
*/