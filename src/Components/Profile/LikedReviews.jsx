import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../../Config/Config';

const LikedReviews = ({ reviews }) => {
    const [userImages, setUserImages] = useState({});
    const [userNames, setUserNames] = useState({});
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchUserImagesAndNames = async () => {
            const userIds = reviews.map((review) => review.user_id);
            const userImagesAndNamesData = await Promise.all(
                userIds.map(async (userId) => {
                    const { data: imageUrl, error: imageError } = await supabase
                        .storage
                        .from('profile_images')
                        .getPublicUrl(`${userId}.jpeg`);

                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('user_id', userId)
                        .single();

                    if (imageError || profileError) {
                        console.error('Error fetching user image or name:', imageError?.message || profileError?.message);
                        return null;
                    }

                    // Validate if the URL returns an image
                    const response = await fetch(imageUrl.publicUrl, { method: 'HEAD' });

                    if (response.ok && response.headers.get('Content-Type').includes('image')) {
                        return { userId, imageUrl: imageUrl.publicUrl, userName: profileData.full_name };
                    } else {
                        return { userId, imageUrl: null, userName: profileData.full_name };
                    }
                })
            );

            const images = userImagesAndNamesData.reduce((acc, curr) => {
                if (curr) {
                    acc[curr.userId] = curr.imageUrl;
                }
                return acc;
            }, {});

            const names = userImagesAndNamesData.reduce((acc, curr) => {
                if (curr) {
                    acc[curr.userId] = curr.userName;
                }
                return acc;
            }, {});

            setUserImages(images);
            setUserNames(names);
        };

        const fetchProductNames = async () => {
            const productIds = reviews.map((review) => review.product_id);
            const productsData = await Promise.all(
                productIds.map(async (productId) => {
                    const { data: productData, error } = await supabase
                        .from('products')
                        .select('name')
                        .eq('id', productId)
                        .single();
                    if (error) {
                        console.error('Error fetching product name:', error.message);
                        return null;
                    }
                    return { productId, productName: productData.name };
                })
            );
            const productsMap = productsData.reduce((acc, curr) => {
                if (curr) {
                    acc[curr.productId] = curr.productName;
                }
                return acc;
            }, {});
            setProducts(productsMap);
        };

        fetchUserImagesAndNames();
        fetchProductNames();
    }, [reviews]);

    return (
        <div className='scrollbar-custom'>
            {reviews.map((review) => (
                <div key={review.id} className='my-[15px] shadow-custom-card w-[85%] mx-auto rounded-lg p-[10px]' >

                    <div className='flex items-center'>
                        <div className='w-[45px] h-[45px]'>
                            {userImages[review.user_id] ? (
                                <img
                                    src={userImages[review.user_id]}
                                    alt="User"
                                    className='w-[100%] h-[100%]  rounded-[50%]'
                                />
                            ) : (
                                <div className='w-[45px] mx-auto  flex flex-col  overflow-hidden items-center justify-center rounded-full bg-gray-300 h-[45px]'>
                                    <div className='w-[15px] translate-y-[10px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[15px]'> </div>
                                    <div className='w-[35px] translate-y-[14px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[30px]'> </div>
                                </div>
                            )}
                        </div>

                        <div className='ml-[8px] text-xl font-medium'> {userNames[review.user_id]}</div>
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


                    <div className='flex items-center rounded-md py-[6px]'>
                        {/*<div className='font-bold text-lg text-gray-600'>Product: </div> */}
                        <p className='font-bold  text-white bg-gray-700  py-[2px] px-[10px] rounded-xl text-lg'>{products[review.product_id]}</p>
                    </div>

                    <div className='mt-[4px] font-bold text-2xl text-black'>Review: </div>
                    <p className='mt-[18px] border-2 border-gray-300 rounded-md w-[100%] p-[10px] font-bold pt-[10px] text-md text-gray-700'>{review.comment}</p>



                    {/* Display other <p>Comment: {review.comment}</p> review details as 
                        <p>Rating: {review.rating}</p> needed */}
                </div>
            ))}
        </div>
    );
};

export default LikedReviews;
