import { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import ReviewItem from './ReviewItem';
import { Bars } from 'react-loader-spinner';
import { MdCancel } from 'react-icons/md';
import noComments from "../../noComments.webp";

function ManageReviews({ productId, onClose }) {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                console.log(productId);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-gray-100 rounded-[25px] shadow-lg w-[90vw] md:w-[80vw] lg:w-[75vw] xl:w-[70vw] h-[90vh] p-6 no-scrollbar overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 mb-[55px] text-gray-600 hover:text-gray-900">
                    <MdCancel size={30} />
                </button>

                {loading ? (
                    <div className="flex scale-[0.9] justify-center items-center h-full">
                        <Bars
                            height="50"
                            width="50"
                            color="#363636"
                            ariaLabel="bars-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center mt-6">Error: {error}</div>
                ) : (
                    <div className='mt-[55px]'>
                        {reviews.length === 0 &&
                            <div className='w-full flex flex-col scale-[0.55] mx-auto contrast justify-center items-center '>
                            <img className='grayscale  contrast-75' src={noComments} alt="" />
                           <p className='text-gray-400 font-[600] text-[32px]'>No Review Made Till Now</p>
                            </div>
                        }
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
            </div>
        </div>
    );
}

export default ManageReviews;
