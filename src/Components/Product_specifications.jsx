import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../Config/Config';

function ProductSpecifications() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [specifications, setSpecifications] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [likes, setLikes] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);
    const [productImage, setProductImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user ID
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                if (!userData || !userData.user) throw new Error('User not logged in');
                const userId = userData.user.id;
                setUserId(userId);

                // Fetch product details
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('name, description, price')
                    .eq('id', productId)
                    .single();
                if (productError) throw productError;
                setProductName(productData.name);
                setProductDescription(productData.description);
                setProductPrice(productData.price);

                // Fetch specifications
                const { data: specData, error: specError } = await supabase
                    .from('product_specifications')
                    .select('*')
                    .eq('product_id', productId);
                if (specError) throw specError;
                setSpecifications(specData);

                // Fetch reviews
                const { data: reviewData, error: reviewError } = await supabase
                    .from('product_reviews')
                    .select('*')
                    .eq('product_id', productId);
                if (reviewError) throw reviewError;
                setReviews(reviewData);

                // Fetch likes
                const { data: likesData, error: likesError } = await supabase
                    .from('product_likes')
                    .select('id')
                    .eq('product_id', productId);
                if (likesError) throw likesError;
                setLikes(likesData.length);

                // Check if user liked the product
                if (userId) {
                    const { data: userLikedData, error: userLikedError } = await supabase
                        .from('product_likes')
                        .select('id')
                        .eq('product_id', productId)
                        .eq('user_id', userId);
                    if (userLikedError) throw userLikedError;
                    setLikedByUser(userLikedData.length > 0);
                }

                // Fetch product image
                const { data: imageUrl, error: imageError } = await supabase
                    .storage
                    .from('product_images')
                    .getPublicUrl(`${productId}.jpeg`);
                if (imageError) throw imageError;
                setProductImage(imageUrl.publicUrl);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            if (!userId) throw new Error('User not logged in');

            const { error: insertError } = await supabase.from('product_reviews').insert([
                { user_id: userId, product_id: productId, comment, rating }
            ]);
            if (insertError) throw insertError;

            // Refresh reviews after adding new review
            const { data: newReviews, error: fetchError } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId);
            if (fetchError) throw fetchError;
            setReviews(newReviews);

            alert('Review added successfully!');
            setComment('');
            setRating(1);
        } catch (error) {
            alert('Error adding review: ' + error.message);
        }
    };

    const handleLikeProduct = async () => {
        try {
            if (!userId) throw new Error('User not logged in');

            if (likedByUser) {
                // Unlike the product
                const { error: deleteError } = await supabase
                    .from('product_likes')
                    .delete()
                    .eq('product_id', productId)
                    .eq('user_id', userId);
                if (deleteError) throw deleteError;
            } else {
                // Like the product
                const { error: insertError } = await supabase
                    .from('product_likes')
                    .insert({ user_id: userId, product_id: productId });
                if (insertError) throw insertError;
            }

            // Update likes count and likedByUser state
            const { data: updatedLikes, error: fetchError } = await supabase
                .from('product_likes')
                .select('id')
                .eq('product_id', productId);
            if (fetchError) throw fetchError;
            setLikes(updatedLikes.length);
            setLikedByUser(!likedByUser); // Toggle likedByUser state
        } catch (error) {
            alert('Error liking product: ' + error.message);
        }
    };

    const handleReadReviews = () => {
        navigate(`/manage-reviews/${productId}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='pt-[85px]'>
            <h2>{productName}</h2>
            <p><strong>Description:</strong> {productDescription}</p>
            <p><strong>Price:</strong> ${productPrice}</p>

            <button onClick={handleBack}>Back to Products</button>
            
            {productImage && (
                <div>
                    <img src={productImage} alt="Product" style={{ width: '200px', margin: '20px 0' }} />
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Attribute Name</th>
                        <th>Attribute Value</th>
                    </tr>
                </thead>
                <tbody>
                    {specifications.map((spec) => (
                        <tr key={spec.id}>
                            <td>{spec.attribute_name}</td>
                            <td>{spec.attribute_value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <h3>Reviews</h3>
                <div>
                    {reviews.map((review) => (
                        <div key={review.id}>
                            {review.user_id === userId && ( // Show only user's own reviews
                                <>
                                    <strong>Rating:</strong> {review.rating} <br />
                                    <strong>Comment:</strong> {review.comment}
                                </>
                            )}
                            {review.user_id !== userId && ( // Hide other users' reviews
                                <></>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3>Add Your Review</h3>
                <form onSubmit={handleAddReview}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review..."
                        required
                    />
                    <label>
                        Rating:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </label>
                    <button type="submit">Submit Review</button>
                </form>
            </div>

            <div>
                <h3>Like Product</h3>
                <div>
                    Total Likes: {likes}
                </div>
                <button onClick={handleLikeProduct}>
                    {likedByUser ? 'Unlike' : 'Like'}
                </button>
            </div>

            <div>
                <button onClick={handleReadReviews}>Read Reviews</button>
            </div>
        </div>
    );
}

export default ProductSpecifications;
