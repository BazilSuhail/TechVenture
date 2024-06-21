import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../Config/Config';

function ManageReviews() {
    const { productId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); // State to store the logged-in user's ID

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch user ID
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (!data || !data.user) throw new Error('User not logged in');
                const userId = data.user.id;
                setUserId(userId);

                // Fetch reviews excluding user's own reviews
                const { data: reviewData, error: reviewError } = await supabase
                    .from('product_reviews')
                    .select('*')
                    .neq('user_id', userId) // Exclude user's own reviews
                    .eq('product_id', productId);
                if (reviewError) throw reviewError;

                // Iterate through reviews to compute likes count for each review
                const reviewsWithLikes = await Promise.all(reviewData.map(async (review) => {
                    const { data: likesData, error: likesError } = await supabase
                        .from('review_likes')
                        .select('id')
                        .eq('review_id', review.id);
                    if (likesError) throw likesError;

                    return {
                        ...review,
                        likes: likesData.length // Compute likes count
                    };
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

            // Display alert while liking
            alert('Liking review...');

            // Check if user already liked the review
            const { data: likedData, error: likedError } = await supabase
                .from('review_likes')
                .select('id')
                .eq('review_id', reviewId)
                .eq('user_id', userId);
            if (likedError) throw likedError;

            if (likedData.length > 0) {
                // Unlike the review
                const { error: deleteError } = await supabase
                    .from('review_likes')
                    .delete()
                    .eq('review_id', reviewId)
                    .eq('user_id', userId);
                if (deleteError) throw deleteError;
            } else {
                // Like the review
                const { error: insertError } = await supabase
                    .from('review_likes')
                    .insert({ user_id: userId, review_id: reviewId });
                if (insertError) throw insertError;
            }

            // Refresh reviews after liking/unliking
            const { data: updatedReviews, error: fetchError } = await supabase
                .from('product_reviews')
                .select('*')
                .neq('user_id', userId) // Exclude user's own reviews
                .eq('product_id', productId);
            if (fetchError) throw fetchError;

            // Update reviews with new likes count
            const reviewsWithUpdatedLikes = await Promise.all(updatedReviews.map(async (review) => {
                const { data: likesData } = await supabase
                    .from('review_likes')
                    .select('id')
                    .eq('review_id', review.id);

                return {
                    ...review,
                    likes: likesData.length // Compute likes count
                };
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
                    <li key={review.id}>
                        <strong>User ID:</strong> {review.user_id} <br />
                        <strong>Rating:</strong> {review.rating} <br />
                        <strong>Comment:</strong> {review.comment} <br />
                        <button onClick={() => handleLikeReview(review.id)}>
                            Like ({review.likes})
                        </button>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageReviews;
