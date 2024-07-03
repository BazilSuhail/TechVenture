import React, { useEffect, useState } from 'react';
import { supabase } from '../../Config/Config';

const ReviewItem = ({ review, userId, handleLikeReview }) => {
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchProfileImage = async (userId) => {
            try {
                const { data: imageUrl, error: imageError } = await supabase
                    .storage
                    .from('profile_images')
                    .getPublicUrl(`${userId}.jpeg`);
                if (imageError) throw imageError;

                setProfileImage(imageUrl.publicUrl);
            } catch (error) {
                console.error('Error fetching profile image:', error.message);
            }
        };

        fetchProfileImage(review.user_id);
    }, [review.user_id]);

    return (
        <li key={review.id}>
            {profileImage ? (
                <img src={profileImage} alt="User Profile" style={{ width: '50px', height: '50px' }} />
            ) : (
                <div>No Image</div>
            )}
            <strong>User ID:</strong> {review.user_id} <br />
            <strong>Rating:</strong> {review.rating} <br />
            <strong>Comment:</strong> {review.comment} <br />
            <button onClick={() => handleLikeReview(review.id)}>
                {review.userLiked ? 'Unlike' : 'Like'} ({review.likes})
            </button>
            <hr />
        </li>
    );
};

export default ReviewItem;
