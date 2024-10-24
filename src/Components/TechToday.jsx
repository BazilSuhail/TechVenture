import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { Bars } from 'react-loader-spinner';
import TechNews from './TechNews';

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

        <div className="overflow-x-hidden min-h-screen pt-[85px]">
            {loading ? (
                <div className='h-[calc(98vh-95px)] w-screen flex flex-col justify-center items-center'>
                    <Bars
                        height="50"
                        width="50"
                        color="#363636"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true} />
                </div>
            ) : (

                <div>

                    <div className="text-[29px] md:text-[34px] mx-auto text-center md:w-[70%] font-serif ">Catchout Latest News</div>
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

                    <section className='bg-black py-[15px] px-[2px]  md:px-[15px] text-white'>
                        <div className="text-[24px] p-[6px] md:text-[28px] mx-auto text-center mb-[15px] rounded-[15px]   w-[95%] md:w-[70%] font-semibold ">Top 5 Most Liked Products</div>
                        <div className="my-[15px] flex overflow-x-auto scrollbar-hide">
                            {topLikedProducts.map((product) => (
                                <div key={product.id} className='flex flex-col justify-center shadow-custom-lighter bg-gray-800 border-gray-400 rounded-lg mr-[25px] h-[375px] w-[390px] p-[8px] m-[6px]'>

                                    <h3 className='px-[6px] py-[16px] border-[2px] w-[95%] mx-auto font-bold text-center text-2xl border-gray-300 rounded-[18px]'>{product.name}</h3>
                                    <p className='font-bold px-[4px] mt-[10px] h-[33%] text-md text-gray-300'>{truncateDescription(product.description)}</p>

                                    <div className='flex my-[5px] justify-between'> <p></p>
                                        <p className='text-lg align-baseline font-extrabold text-gray-500'>${product.price.toFixed(2)}</p>
                                    </div>

                                    <div className='flex pl-[15px] text-lg'>
                                        <p className="bg-white text-blue-900 px-[5px] py-[2px] rounded-lg pl-[70px] pr-[15px] z-1  font-extrabold  mr-[8px]   "> {product.likes}</p>
                                        <p className="text-white px-[5px] py-[2px] ml-[-104px] rounded-lg bg-blue-900 z-2">Likes:  </p>
                                    </div>
                                    <Link to={`/product-specifications/${product.id}`} className='bg-gray-900  text-center mx-auto mt-[15px] w-[360px] text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]' >
                                        Review Gadget
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className=' bg-gray-200 py-[15px] px-[2px]  md:px-[15px] text-black'>
                        <div className="text-[24px] p-[6px] md:text-[28px] mx-auto text-center mb-[15px] rounded-[15px] shadow-custom-shadow bg-white   w-[95%] md:w-[70%] font-semibold ">Recently Launched Gadgets</div>
                        <div className="my-[15px] flex overflow-x-auto scrollbar-hide">
                            {recentlyCreatedProducts.map((product) => (
                                <div key={product.id} className='flex flex-col justify-center   bg-white rounded-lg mr-[25px] h-[375px] w-[390px] p-[8px] m-[6px]'>

                                    <h3 className='px-[6px] py-[16px] border-[2px] w-[95%] mx-auto font-bold text-center text-2xl border-gray-900 rounded-[18px]'>{product.name}</h3>
                                    <p className='font-bold px-[4px] mt-[10px] h-[33%] text-md text-gray-800'>{truncateDescription(product.description)}</p>

                                    <div className='flex my-[5px] justify-between'> <p></p>
                                        <p className='text-lg align-baseline font-extrabold text-gray-500'>${product.price.toFixed(2)}</p>
                                    </div>

                                    <div className='flex pl-[15px] text-lg'>
                                        <p className="bg-white text-blue-600 px-[5px] py-[2px] rounded-lg pl-[125px] border-2 border-blue-900 pr-[15px] font-extrabold  mr-[8px]   "> {new Date(product.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        <p className="text-white px-[5px] py-[2px] ml-[-274px] rounded-lg bg-blue-900 ">Uploaded At:  </p>
                                    </div>
                                    <Link to={`/product-specifications/${product.id}`} className='bg-gray-900  text-center mx-auto mt-[15px] w-[360px] text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]' >
                                        Review Gadget
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className='bg-black py-[15px] px-[2px] md:px-[15px] text-white'>
                        <div className="text-[24px] p-[6px] md:text-[28px] mx-auto text-center mb-[15px] rounded-[15px]   w-[95%] md:w-[70%] font-semibold ">Most Liked Reviews</div>
                        <div className="my-[15px] flex h-[900px] flex-col overflow-y-auto scrollbar-custom-white">
                            {topLikedReviews.map((review) => (

                                <div key={review.id} className='my-[15px] shadow-custom-card w-[85%] bg-white mx-auto rounded-[25px] p-[10px]' >

                                    <div className='flex items-center'>
                                        <div className='w-[45px] h-[45px]'>
                                            <div className='w-[45px] mx-auto  flex flex-col  overflow-hidden items-center justify-center rounded-full bg-gray-300 h-[45px]'>
                                                <div className='w-[15px] translate-y-[10px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[15px]'> </div>
                                                <div className='w-[35px] translate-y-[14px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[30px]'> </div>
                                            </div>
                                        </div>
                                        <div className='ml-[8px] text-black text-xl font-medium'>{userNames[review.user_id]}</div>
                                    </div>

                                    <div className='my-[10px] flex'>
                                        <div className='text-lg text-gray-500 font-medium mr-[10px]'>Rating:</div>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <FaStar
                                                size={25}
                                                key={index}
                                                className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='font-bold  text-white bg-black py-[2px] px-[10px] rounded-xl text-lg'>{productNames[review.product_id]}</p>
                                        <p></p>
                                    </div>
                                    <div className='mt-[4px] font-bold text-2xl text-black'>Review: </div>
                                    <p className='mt-[18px] border-2 border-gray-300 rounded-md w-[100%] p-[10px] font-bold pt-[10px] text-md text-gray-700'>{review.comment}</p>

                                    <div className='flex justify-between my-[15px]'>
                                        <div className='flex items-center shadow-custom-shadow rounded-xl px-[8px] ml-auto md:px-[12px] py-[5px] '>
                                            <div className='font-bold  text-md text-black text-[20px] ml-[10px]'>Likes: </div>
                                            <p className='bg-gray-800 rounded-md px-[10px] text-lg md:text-xl ml-[8px] text-white'>{review.likes}</p>
                                        </div>
                                    </div>

                                </div >
                            ))}
                        </div>
                    </section>

                    <section className='bg-gray-200 py-[15px] px-[2px] md:px-[15px] text-black'>
                        <div className="text-[24px] p-[6px] md:text-[28px] mx-auto text-center mb-[15px] rounded-[15px]   w-[95%] md:w-[70%] font-semibold ">Recenlty Published Reviews</div>
                        <div className="my-[15px] flex h-[900px] flex-col overflow-y-auto scrollbar-custom">
                            {recentlyCreatedReviews.map((review) => (

                                <div key={review.id} className='my-[15px] shadow-custom-card w-[85%] bg-black mx-auto rounded-[25px] p-[10px]' >

                                    <div className='flex items-center'>
                                        <div className='w-[45px] h-[45px]'>
                                            <div className='w-[45px] mx-auto  flex flex-col  overflow-hidden items-center justify-center rounded-full bg-gray-300 h-[45px]'>
                                                <div className='w-[15px] translate-y-[10px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[15px]'> </div>
                                                <div className='w-[35px] translate-y-[14px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[30px]'> </div>
                                            </div>
                                        </div>
                                        <div className='ml-[8px] text-white text-xl font-medium'>{userNames[review.user_id]}</div>
                                    </div>

                                    <div className='my-[10px] flex'>
                                        <div className='text-lg text-gray-300 font-bold mr-[10px]'>Rating:</div>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <FaStar
                                                size={25}
                                                key={index}
                                                className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='font-bold  text-white bg-gray-700 py-[2px] px-[10px] rounded-xl text-lg'>{productNames[review.product_id]}</p>
                                        <p></p>
                                    </div>

                                    <div className='mt-[4px] font-bold text-2xl text-gray-100'>Review: </div>
                                    <div className='mt-[18px] border-2 overflow-hidden border-gray-300 rounded-md w-[100%] p-[10px] font-bold pt-[10px] text-md text-gray-50'>
                                        {review.comment}
                                    </div>

                                    <div className='flex justify-between my-[15px]'>
                                        <div className='flex items-center bg-white rounded-xl px-[4px] ml-auto md:px-[12px] py-[5px] '>
                                            <div className='font-bold text-md md:text-lg text-black ml-[10px]'>Published At: </div>
                                            <p className='bg-gray-800 rounded-md px-[10px] text-md md:text-lg ml-[8px] text-white'>{new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div >
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
export default TechToday;
