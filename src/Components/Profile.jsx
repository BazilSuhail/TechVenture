import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [profile, setProfile] = useState({ email: '', full_name: '', bio: '' });
    const [likedProducts, setLikedProducts] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error || !session) throw new Error('User not logged in');

                const { user } = session;
                await Promise.all([
                    fetchProfile(user.id),
                    fetchLikedProducts(user.id),
                    fetchLikedReviews(user.id),
                    fetchProfileImage(user.id),
                ]);
            } catch (error) {
                console.error('Error fetching session data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data: userAccount, error: userError } = await supabase
                .from('user_account')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (userError) throw userError;

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (profileError) throw profileError;

            setProfile({ ...userAccount, ...profileData });
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchLikedProducts = async (userId) => {
        try {
            const { data: likedProductsData, error: likedProductsError } = await supabase
                .from('product_likes')
                .select('product_id, liked_at')
                .eq('user_id', userId);

            if (likedProductsError) throw likedProductsError;

            // Fetch details of liked products using product_id
            const productIds = likedProductsData.map((item) => item.product_id);
            const likedProductsDetails = await Promise.all(
                productIds.map(async (productId) => {
                    const { data: productData, error: productError } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', productId)
                        .single();

                    if (productError) throw productError;
                    return productData;
                })
            );

            setLikedProducts(likedProductsDetails);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchLikedReviews = async (userId) => {
        try {
            const { data: likedReviewsData, error: likedReviewsError } = await supabase
                .from('review_likes')
                .select('review_id, liked_at')
                .eq('user_id', userId);

            if (likedReviewsError) throw likedReviewsError;

            // Fetch details of liked reviews using review_id
            const reviewIds = likedReviewsData.map((item) => item.review_id);
            const likedReviewsDetails = await Promise.all(
                reviewIds.map(async (reviewId) => {
                    const { data: reviewData, error: reviewError } = await supabase
                        .from('product_reviews')
                        .select('*')
                        .eq('id', reviewId)
                        .single();

                    if (reviewError) throw reviewError;
                    return reviewData;
                })
            );

            setLikedReviews(likedReviewsDetails);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchProfileImage = async (userId) => {
        try {
            const { data: imageUrl, error: imageError } = await supabase
                .storage
                .from('profile_images')
                .getPublicUrl(`${userId}.jpeg`);
            if (imageError) throw imageError;

            setProfileImage(imageUrl.publicUrl);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({ user_id: profile.user_id, full_name: profile.full_name, bio: profile.bio });

            if (error) throw error;

            if (imageFile) {
                await uploadProfileImage(profile.user_id);
            }

            await fetchProfileImage(profile.user_id); // Fetch the updated profile image

            alert('Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const uploadProfileImage = async (userId) => {
        try {
            const { error } = await supabase.storage
                .from('profile_images')
                .upload(`${userId}.jpeg`, imageFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) throw new Error('User not logged in');

            const { user } = session;

            await Promise.all([
                supabase.from('profiles').delete().eq('user_id', user.id),
                supabase.from('user_account').delete().eq('user_id', user.id),
                supabase.auth.signOut(),
            ]);

            navigate('/signup');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='pt-[89px]'>
            <h2>Profile</h2>
            <p>Email: {profile.email}</p>
            {profileImage && (
                <div>
                    <img src={profileImage} alt="Profile" style={{ width: '200px', margin: '20px 0' }} />
                </div>
            )}
            {editMode ? (
                <form onSubmit={handleUpdate}>
                    <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Full Name"
                        required
                    />
                    <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Bio"
                    />
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        accept="image/jpeg"
                    />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <p>Name: {profile.full_name}</p>
                    <p>Bio: {profile.bio}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                    <button onClick={handleDelete}>Delete Account</button>
                </div>
            )}

            <div>
                <h3>Liked Products</h3>
                <ul>
                    {likedProducts.map((product) => (
                        <li key={product.id}>
                            <p>{product.name}</p>
                            {/* Display other product details as needed */}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Liked Reviews</h3>
                <ul>
                    {likedReviews.map((review) => (
                        <li key={review.id}>
                            <p>Review_ID: {review.id}</p>
                            <p>Rating: {review.rating}</p>
                            <p>Comment: {review.comment}</p>
                            {/* Display other review details as needed */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Profile;
