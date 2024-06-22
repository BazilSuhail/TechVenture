import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../Config/Config';
import ReviewItem from './ReviewItem';

function ManageReviews() {
    const { productId } = useParams();
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Product Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        userId={userId}
                        handleLikeReview={handleLikeReview}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ManageReviews;
