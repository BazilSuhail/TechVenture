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
        <div className='h-full bg-gray-100 w-full py-[84px]'>
            {loading ? (
                <div className='min-h-screen scale-[0.9] w-full flex flex-col justify-center items-center'>
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
                    <div className='px-[20px] xsx:col-span-5 flex flex-col justify-center'>
                        <h2 className='ml-[15px] text-[22px] underline font-[600]'>Your Profile Details</h2>
                        <div className='scale-[0.7] ml-[-90px] my-[-15px]'>
                            {profileImage !== null ? (
                                <div>
                                    <img src={profileImage} alt="Product" className='md:w-[250px] w-[180px] h-[180px] md:h-[250px] rounded-full mx-auto my-[25px]' />
                                </div>
                            ) : (
                                <div className=' md:w-[250px] w-[180px] h-[180px] md:h-[250px] flex flex-col overflow-hidden items-center justify-center rounded-full bg-gray-300 '>
                                    <div className='md:w-[90px] w-[60px] h-[60px] md:h-[140px] translate-y-[45px]  flex flex-col items-center justify-center rounded-full bg-gray-400 '> </div>
                                    <div className='md:w-[220px] w-[160px] h-[150px] md:h-[250px] translate-y-[60px] flex flex-col items-center justify-center rounded-full bg-gray-400 '> </div>
                                </div>
                            )}
                        </div>

                        {editMode ? (
                            <form onSubmit={handleUpdate} className='w-full flex flex-col items-center' >
                                <div className="w-full flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-gray-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7a4 4 0 014-4h3m-7 0a4 4 0 00-4 4v4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Change Profile Photo</h2>
                                        <input
                                            type="file"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className='scale-[0.8] ml-[-30px] border border-gray-300 p-2 bg-gray-100 file:bg-gray-950 file:my-[4px] file:text-gray-100 file:rounded-xl file:px-[15px] file:mr-[15px] rounded'
                                            accept="image/jpeg"
                                        />
                                    </div>
                                </div> 
                                <div className="w-full flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-blue-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5v3c0 1.38 1.12 2.5 2.5 2.5H5c1.38 0 2.5 1.12 2.5 2.5v2c0 1.38 1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5v-2c0-1.38 1.12-2.5 2.5-2.5h.5C19.88 16.5 21 15.38 21 14v-3c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Full Name</h2>
                                        <input
                                            type="text"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className='mt-[8px] bg-gray-100 font-[600]  rounded-xl p-[10px] text-[17px] text-gray-700'
                                            placeholder="Full Name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-blue-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-4m0 0l-4 4m4-4v12" />
                                            <path d="M16 5H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Email</h2>
                                        <p className="text-gray-600">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="w-full flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-green-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h2l1 2m4 0l1-2h5a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2m-2 0H3m0 0V9m0 0a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3V9a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-[16px] font-semibold text-gray-800">Bio</h2>
                                        <textarea
                                            value={profile.bio}
                                            className='rounded-md break-words bg-gray-100 w-full p-[10px] font-bold pt-[10px] text-md text-gray-700'
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            placeholder="Bio"
                                        />
                                    </div>
                                </div>

                                <div className='flex justify-around]'>
                                    <button className='ml-[32px] mt-[22px] bg-green-800 rounded-[15px] py-[8px] px-[18px] text-lg xsx:text-[16px] text-white font-medium' type="submit">Save Changes</button>
                                    <button className='ml-[5px] mt-[22px] bg-red-800 rounded-[15px] py-[8px] px-[18px] text-lg xsx:text-[16px] text-white font-medium' type="button" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex w-full flex-col">
                                <div className="flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-blue-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5v3c0 1.38 1.12 2.5 2.5 2.5H5c1.38 0 2.5 1.12 2.5 2.5v2c0 1.38 1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5v-2c0-1.38 1.12-2.5 2.5-2.5h.5C19.88 16.5 21 15.38 21 14v-3c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Full Name</h2>
                                        <p className="text-gray-600">{profile.full_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-blue-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-4m0 0l-4 4m4-4v12" />
                                            <path d="M16 5H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Email</h2>
                                        <p className="text-gray-600">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 bg-white mb-[15px] p-4 rounded-lg shadow-sm">
                                    <div className="p-3 bg-green-600 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h2l1 2m4 0l1-2h5a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2m-2 0H3m0 0V9m0 0a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3V9a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
                                        <p className="text-gray-600">{profile.bio}</p>
                                    </div>
                                </div>
                                <div className='flex ml-[-15px] scale-[0.75] '>
                                    <button className='md:ml-[-75px] mt-[22px] bg-blue-700 rounded-[17px] py-[8px] px-[18px]  text-lg xsx:text-[22px] text-white font-medium' onClick={() => setEditMode(true)}>Edit Profile</button>
                                    <button className='ml-[5px] mt-[22px] bg-red-800 rounded-[17px] py-[8px] px-[18px] text-lg xsx:text-2xl text-white font-medium' onClick={handleDelete} >Delete Account</button>
                                    <button className=' hidden' onClick={() => setEditMode(true)} >Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='h-[3px] w-[95vw] bg-black xsx:hidden mx-auto rounded-3xl mt-[35px] mb-[25px]'></div>

                    <div className='xsx:col-span-7 flex flex-col no-scrollbar xsx:overflow-y-auto xsx:h-[calc(98vh-85px)]'>
                        <div className='w-[100%] xsx:mt-[15px] my-[15px] flex scale-[0.8] text-lg md:text-2xl'>
                            <p onClick={() => setActiveTab('reviews')}
                                className={`cursor-pointer mr-[15px] px-[8px] md:px-[15px] py-[4px] transition duration-200 font-[600] rounded-[10px] ${activeTab === 'reviews' ? 'bg-gray-800 text-white ' : 'bg-white border border-gray-400 text-black'}`} >
                                Liked Reviews
                            </p>
                            <p onClick={() => setActiveTab('products')}
                                className={`cursor-pointer px-[8px] md:px-[15px]  py-[4px] font-[600] rounded-[10px] ${activeTab === 'products' ? 'bg-gray-800 text-white ' : 'bg-white border border-gray-400 text-black'}`} >
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