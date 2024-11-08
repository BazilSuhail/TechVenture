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
            {reviews.length === 0 &&
                <div className=' flex justify-center lg:mt-[95px] items-center'>
                    <img className='mix-blend-multiply z-30' src="https://www.shutterstock.com/image-vector/like-icon-dislike-thumbs-down-260nw-1506167246.jpg" alt="" />
                    <div className='bg-gray-100 absolute opacity-100 font-[600] pb-[65px] z-50 text-[15px] mt-[205px]'> No Review Liked till now ...</div>
                </div>
            }
            {reviews.map((review) => (
                <div key={review.id} className='my-[15px] bg-white border border-gray-200 w-[85%] mx-auto rounded-lg p-[16px]' >

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
                    <div className='flex scale-[0.8] items-center rounded-md py-[6px]'> 
                        <p className='font-[700] ml-[-44px] md:ml-[-88px] text-white bg-gray-700  py-[2px] px-[10px] rounded-xl text-lg'>{products[review.product_id]}</p>
                    </div>
                    <div className='mt-[4px] font-[700] text-2xl text-black'>Review: </div>
                    <p className='mt-[18px] border-2 border-gray-300 rounded-md w-[100%] p-[10px] break-words font-bold pt-[10px] text-md text-gray-700'>{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default LikedReviews;
