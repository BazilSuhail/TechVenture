import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../Config/Config';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import ReviewItem from './ReviewItem';
import { Bars } from 'react-loader-spinner';
function ManageReviews() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (!data || !data.user) throw new Error('User not logged in');
                const userId = data.user.id;
                setUserId(userId);

                const { data: reviewData, error: reviewError } = await supabase
                    .from('product_reviews')
                    .select('*')
                    .neq('user_id', userId)
                    .eq('product_id', productId);
                if (reviewError) throw reviewError;

                const { data: likedReviews, error: likedReviewsError } = await supabase
                    .from('review_likes')
                    .select('review_id')
                    .eq('user_id', userId);
                if (likedReviewsError) throw likedReviewsError;

                const likedReviewIds = likedReviews.map(like => like.review_id);

                const reviewsWithLikes = reviewData.map(review => ({
                    ...review,
                    userLiked: likedReviewIds.includes(review.id),
                }));

                setReviews(reviewsWithLikes);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    const handleLikeReview = async (reviewId) => {
        try {
            if (!userId) throw new Error('User not logged in');

            const { data: likedData, error: likedError } = await supabase
                .from('review_likes')
                .select('id')
                .eq('review_id', reviewId)
                .eq('user_id', userId);
            if (likedError) throw likedError;

            if (likedData.length > 0) {
                const { error: deleteError } = await supabase
                    .from('review_likes')
                    .delete()
                    .eq('review_id', reviewId)
                    .eq('user_id', userId);
                if (deleteError) throw deleteError;
            } else {
                const { error: insertError } = await supabase
                    .from('review_likes')
                    .insert({ user_id: userId, review_id: reviewId });
                if (insertError) throw insertError;
            }

            const { data: updatedReviews, error: fetchError } = await supabase
                .from('product_reviews')
                .select('*')
                .neq('user_id', userId)
                .eq('product_id', productId);
            if (fetchError) throw fetchError;

            const { data: likedReviews, error: likedReviewsError } = await supabase
                .from('review_likes')
                .select('review_id')
                .eq('user_id', userId);
            if (likedReviewsError) throw likedReviewsError;

            const likedReviewIds = likedReviews.map(like => like.review_id);

            const reviewsWithUpdatedLikes = updatedReviews.map(review => ({
                ...review,
                userLiked: likedReviewIds.includes(review.id),
            }));

            setReviews(reviewsWithUpdatedLikes);
        } catch (error) {
            alert('Error liking review: ' + error.message);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div className='h-full w-full pt-[85px]'>
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
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div>

                    <button onClick={handleBack}><IoArrowBackCircleOutline size={55} /></button>
                    {reviews.map((review) => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            userId={userId}
                            handleLikeReview={handleLikeReview}
                        />
                    ))}
                </div>
            )}
        </div >

    );
}

export default ManageReviews;
