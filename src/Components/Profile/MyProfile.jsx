import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import { useNavigate } from 'react-router-dom';
import LikedProducts from './LikedProducts';
import LikedReviews from './LikedReviews';

import { Bars } from 'react-loader-spinner'

function MyProfile() {
    const [profile, setProfile] = useState({ email: '', full_name: '', bio: '' });
    const [likedProducts, setLikedProducts] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const [activeTab, setActiveTab] = useState('reviews');
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

            //setProfileImage(imageUrl.publicUrl);
            // Validate if the URL returns an image
            const response = await fetch(imageUrl.publicUrl, { method: 'HEAD' });

            if (response.ok && response.headers.get('Content-Type').includes('image')) {
                setProfileImage(imageUrl.publicUrl);
            } else {

                setProfileImage(null);
            }
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
            alert("Are You Sure You Want to delete Account !!")

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

    return (
        <div className='h-full w-full pt-[84px]'>
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
                <div className='grid grid-cols-1 xsx:grid-cols-12'>
                    <div className=' xsx:col-span-5 flex flex-col justify-center'>
                        <h2 className='ml-[15px] text-4xl font-bold '>Profile</h2>
                        {profileImage !== null ? (
                            <div>
                                <img src={profileImage} alt="Product" className='md:w-[250px] w-[180px] h-[180px] md:h-[250px] rounded-full mx-auto my-[25px]' />
                            </div>
                        ) : (
                            <div className='md:w-[250px] w-[180px] h-[180px] md:h-[250px] mx-auto  flex flex-col overflow-hidden items-center justify-center rounded-full bg-gray-300 '>
                                <div className='md:w-[90px] w-[60px] h-[60px] md:h-[90px] translate-y-[45px]  flex flex-col items-center justify-center rounded-full bg-gray-400 '> </div>
                                <div className='md:w-[220px] w-[160px] h-[150px] md:h-[250px] translate-y-[60px] flex flex-col items-center justify-center rounded-full bg-gray-400 '> </div>
                            </div>
                        )
                        }
                        {editMode ? (
                            <form onSubmit={handleUpdate} className='flex flex-col items-center' >
                                <div>
                                    <input
                                        type="file"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className='ml-[32px] xsx:mt-[0px] mt-[15px] font-bold border-2 border-gray-700 rounded-md p-[4px] text-md text-gray-700'
                                        accept="image/jpeg"
                                    />
                                    <br />
                                    <div className='flex items-center  ml-[15px] rounded-md w-[325px] p-[8px] '>

                                        <div className='ml-[9px] font-bold text-2xl text-black'>Name: </div>
                                        <input
                                            type="text"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className='ml-[9px] w-[250px] font-bold border-2 border-gray-700 rounded-xl px-[10px] text-2xl text-gray-700'
                                            placeholder="Full Name"
                                            required
                                        />
                                    </div>

                                    <div className='flex items-center  ml-[15px] rounded-md w-[325px] p-[8px] '>
                                        <div className='ml-[9px] font-bold text-2xl text-black'>Email: </div>
                                        <p className='ml-[9px] font-bold   text-2xl text-gray-700'>{profile.email}</p>
                                    </div>
                                    <div className='ml-[32px] mt-[10px] font-bold text-2xl text-black'>Bio: </div>

                                    <textarea
                                        value={profile.bio}
                                        className='ml-[32px] mt-[18px] border-2 border-gray-600 rounded-md w-[330px] md:w-[250px] xsx:w-[510px] p-[10px] font-bold pt-[10px] text-md text-gray-700'
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        placeholder="Bio"
                                    />
                                    <div className='flex justify-around]'>
                                        <button className='ml-[32px] mt-[22px] bg-green-800 rounded-3xl py-[8px] px-[18px] text-lg xsx:text-2xl text-white font-medium' type="submit">Save Changes</button>
                                        <button className='ml-[5px] mt-[22px] bg-red-800 rounded-3xl py-[8px] px-[18px] text-lg xsx:text-2xl text-white font-medium' type="button" onClick={() => setEditMode(false)}>Cancel</button>

                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className='flex flex-col items-center xsx:items-start'>
                                <div className='flex items-center md:ml-[24px] rounded-md w-[325px] p-[8px] '>
                                    <div className='  font-bold text-2xl text-black'>Name: </div>
                                    <p className='ml-[9px] font-bold text-2xl text-gray-700'>{profile.full_name}</p>
                                </div>

                                <div className='flex items-center  md:ml-[24px] rounded-md w-[325px] p-[8px] '>
                                    <div className=' font-bold text-2xl text-black'>Email: </div>
                                    <p className='ml-[9px] font-bold text-2xl text-gray-700'>{profile.email}</p>
                                </div>

                                <div className='ml-[15px] md:ml-[32px]'>
                                    <div className='  mt-[10px] font-bold text-2xl text-black'>Bio: </div>
                                    <p className='  mt-[18px] border-2 border-gray-600 rounded-md w-[100%] p-[10px] font-bold pt-[10px] text-md text-gray-700'>{profile.bio}</p>
                                </div>

                                <div className='flex justify-around]'>
                                    <button className='md:ml-[32px] mt-[22px] bg-blue-950 rounded-3xl py-[8px] px-[18px]  text-lg xsx:text-2xl text-white font-medium' onClick={() => setEditMode(true)}>Edit Profile</button>
                                    <button className='ml-[5px] mt-[22px] bg-red-800 rounded-3xl py-[8px] px-[18px] text-lg xsx:text-2xl text-white font-medium' onClick={handleDelete} >Delete Account</button>
                                    <button className=' hidden' onClick={() => setEditMode(true)} >Delete Account</button>
                                    {/*onClick={handleDelete} */}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='h-[3px] w-[95vw] bg-black xsx:hidden mx-auto rounded-3xl mt-[35px] mb-[25px]'></div>

                    <div className='xsx:col-span-7 flex flex-col  xsx:overflow-y-auto xsx:h-[calc(98vh-85px)]'>
                        <div className='w-[100%] xsx:mt-[15px]  my-[15px] flex justify-evenly text-lg md:text-2xl'>

                            <p onClick={() => setActiveTab('reviews')}
                                className={`cursor-pointer  px-[8px] md:px-[15px] py-[4px] transition duration-200 font-bold rounded-md ${activeTab === 'reviews' ? 'bg-gray-800 text-white ' : 'border-gray-900 text-black border-2'}`} >
                                Liked Reviews
                            </p>
                            <p onClick={() => setActiveTab('products')}
                                className={`cursor-pointer px-[8px] md:px-[15px]  py-[4px] font-bold rounded-md ${activeTab === 'products' ? 'bg-gray-800 text-white ' : 'border-gray-900 text-black border-2'}`} >
                                Liked Products
                            </p>

                        </div>
                        {activeTab === 'products' && <LikedProducts products={likedProducts} />}
                        {activeTab === 'reviews' && <LikedReviews reviews={likedReviews} />}
                    </div>
                </div >
            )}
        </div >

    );
}

export default MyProfile;
