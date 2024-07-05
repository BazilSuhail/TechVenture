import React, { useEffect, useState } from 'react';
import { supabase } from '../../Config/Config';
import { FaStar } from 'react-icons/fa';
import { AiFillLike } from "react-icons/ai";

const ReviewItem = ({ review, userId, handleLikeReview }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchProfileData = async (userId) => {
            try {
                const { data: imageUrl, error: imageError } = await supabase
                    .storage
                    .from('profile_images')
                    .getPublicUrl(`${userId}.jpeg`);
                if (imageError) throw imageError;

                setProfileImage(imageUrl.publicUrl);
                // Validate if the URL returns an image
                const response = await fetch(imageUrl.publicUrl, { method: 'HEAD' });

                if (response.ok && response.headers.get('Content-Type').includes('image')) {
                    setProfileImage(imageUrl.publicUrl);
                } else {
                    setProfileImage(null);
                }

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('user_id', userId)
                    .single();

                if (profileError) throw profileError;

                setUserName(profileData.full_name);
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        };

        fetchProfileData(review.user_id);
    }, [review.user_id]);

    return (
        <div key={review.id} className='my-[15px] shadow-custom-card w-[85%] mx-auto rounded-lg p-[10px]' >

            <div className='flex items-center'>
                <div className='w-[45px] h-[45px]'>
                    {profileImage ? (
                        <img src={profileImage} alt="User Profile" className='w-[100%] h-[100%]  rounded-[50%]' />
                    ) : (
                        <div className='w-[45px] mx-auto  flex flex-col  overflow-hidden items-center justify-center rounded-full bg-gray-300 h-[45px]'>
                            <div className='w-[15px] translate-y-[10px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[15px]'> </div>
                            <div className='w-[35px] translate-y-[14px] flex flex-col items-center justify-center rounded-full bg-gray-400 h-[30px]'> </div>
                        </div>
                    )}
                </div> 
                <div className='ml-[8px] text-xl font-medium'>  {userName} </div>
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
            <div className='mt-[4px] font-bold text-2xl text-black'>Review: </div>
            <p className='mt-[18px] border-2  overflow-x-auto scrollbar-hide  border-gray-300 rounded-md w-[100%] p-[10px] font-bold pt-[10px] text-md text-gray-700'>{review.comment}</p>

            <div className='flex justify-between my-[8px]'>
                <div className='flex items-center px-[8px] ml-auto md:px-[12px] py-[5px] '>
                    <button onClick={() => handleLikeReview(review.id)}>
                        <AiFillLike size={35} className={review.userLiked ? 'text-blue-600' : 'text-gray-200'} />
                    </button>
                    <div className='h-[70%] ml-[5px] w-[3px] bg-gray-500 '> </div>
                    <div className='font-bold text-md md:text-lg ml-[10px]'>Likes: </div>
                    <p className='bg-gray-800 rounded-md px-[10px] text-lg md:text- xl ml-[15px] text-white'>{review.likes}</p>
                </div> 
            </div>
 
        </div >
    );
};

export default ReviewItem;
/*
            <strong>User:</strong> {userName} <br />
            <strong>Rating:</strong> {review.rating} <br />
            <strong>Comment:</strong> {review.comment} <br />
            <button onClick={() => handleLikeReview(review.id)}>
                {review.userLiked ? 'Unlike' : 'Like'} ({review.likes})
            </button>
            <hr /> */