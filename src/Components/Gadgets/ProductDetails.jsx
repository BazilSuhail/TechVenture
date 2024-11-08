import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../Config/Config';
import { IoArrowBack } from "react-icons/io5";
import { FaStar } from 'react-icons/fa';
import { AiFillLike } from "react-icons/ai";
import { Bars } from 'react-loader-spinner';
import ManageReviews from '../ManageReiews/ManageReview';

function ProductSpecifications() {
    const { productId } = useParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

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
        window.scrollTo(0, 0);
    }, []);
    
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
                /*
                const { data: imageUrl, error: imageError } = await supabase
                    .storage
                    .from('product_images')
                    .getPublicUrl(`${productId}.jpeg`);
                if (imageError) throw imageError;
                setProductImage(imageUrl.publicUrl);
                */

                const { data: imageUrl, error: imageError } = await supabase
                    .storage
                    .from('product_images')
                    .getPublicUrl(`${productId}.jpeg`);

                if (imageError) throw imageError;

                // Validate if the URL returns an image
                const response = await fetch(imageUrl.publicUrl, { method: 'HEAD' });

                if (response.ok && response.headers.get('Content-Type').includes('image')) {
                    setProductImage(imageUrl.publicUrl);
                } else {

                    setProductImage(null);
                }
            }
            catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleStarClick = (index) => {
        setRating(index + 1); // Set rating based on star index (1-based)
    };
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
        setSelectedProductId(productId);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedProductId(null);
    };


    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className='min-h-screen no-scrollbar w-full pt-[45px]'>
            {loading ? (
                <div className='h-screen w-full flex flex-col justify-center items-center'>
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
                <div className='text-center w-[250px] mx-auto bg-red-200 p-3 text-red-700 rounded-lg mt-[85px]'>{error}</div>
            ) : (

                <div className='xl:scale-[0.9] grid grid-cols-1 m-[15px] xsx:grid-cols-11'>
                    <div className=' xsx:col-span-6 xsx:shadow-slider p-[5px] md:p-[15px] m-[5px] md:m-[20px] xsx:overflow-auto  no-scrollbar'>
                        <button className='bg-gray-600 hover:bg-gray-900 duration-150 p-[5px] text-white rounded-lg ' onClick={handleBack}><IoArrowBack size={32} /></button>
                        {
                            productImage !== null ? (
                                <div>
                                    <img src={productImage} alt="Product" className='w-[250px] h-[250px] rounded-md mx-auto my-[25px]' />
                                </div>
                            ) : (
                                <div className='w-[250px] mx-auto my-[25px] flex flex-col items-center justify-center rounded-lg bg-gray-400 h-[250px]'>
                                    <div className='w-[200px] flex flex-col items-center justify-center rounded-lg bg-gray-300 h-[200px]'>
                                        <div className='w-[150px] flex flex-col items-center justify-center rounded-lg bg-gray-200 h-[150px]'>
                                            <div className='w-[90px] flex flex-col items-center justify-center rounded-lg bg-gray-50 h-[90px]'></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        <h2 className='px-[16px] text-center py-[16px] border-2 mt-[8px] mx-auto font-bold text-xl border-gray-500 rounded-lg'>{productName}</h2>
                        <div className='ml-[9px] font-bold pt-[8px] text-lg text-black'>Description: </div>
                        <p className='ml-[9px] font-bold pt-[10px] text-md text-gray-700'>{productDescription}</p>

                        <div className='xsx:ml-[9px] mx-[5px] mt-[6px] md:mt-[0px] flex justify-between'>
                            <div className='text-xl font-extrabold text-gray-800'>Price:</div>
                            <div className='text-xl font-extrabold text-gray-800'>${productPrice}</div>
                        </div>

                        <div className='w-[100%] h-[2px] bg-gray-400 mt-[28px]'></div>

                        <div className='flex justify-between mx-[-20px] my-[25px]'>
                            <div className='flex scale-[0.8] items-center ml-[25px] px-[8px] md:px-[12px] py-[5px] shadow-custom-light rounded-lg'>
                                <button onClick={handleLikeProduct} className='text-[32px] md:text-[40px]'>
                                    <AiFillLike className={likedByUser ? 'text-blue-600' : 'text-gray-200'} />
                                </button>
                                <div className='h-[70%] ml-[5px] w-[3px] bg-gray-500 '> </div>
                                <div className='font-bold text-lg md:text-xl ml-[10px]'>Likes: </div>
                                <p className='bg-gray-800 rounded-md px-[10px] text-xl md:text-2xl ml-[7px] xsx:ml-[15px] text-white'> {likes} </p>
                            </div>
                            <button className='md:mr-[25px] scale-[0.85] mr-[15px] hover:bg-gray-400 bg-gray-800 text-white px-[18px] text-[15px] xsx:text-[20px] rounded-[25px] ' onClick={handleReadReviews}>
                                Read Reviews
                            </button>
                        </div>

                        <h2 className='ml-[15px] md:ml-[0px] md:text-3xl md:mb-[25px] text-2xl text-custom-blue mb-[8px] font-bold '>Sepcifications Details</h2>

                        <div className='rounded-[18px] overflow-hidden'>
                            <table className="w-full rounded-[28px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-md text-gray-200 uppercase bg-gray-700">
                                    <tr className='text-center'>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Features</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specifications.map((spec) => (
                                        <tr key={spec.id} className='text-center odd:bg-white even:bg-gray-200 text-custom-blue text-md font-bold'>
                                            <td className="px-6 py-4 whitespace-nowrap">{spec.attribute_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{spec.attribute_value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div className='xsx:px-0 px-[15px] xsx:col-span-5 xsx:mt-[0px] mt-[35px] flex flex-col xsx:overflow-y-auto min-h-screen no-scrollbar'>
                        <div className='xsx:mt-[45px]'>
                            <h3 className='text-2xl text-custom-blue mb-[8px] font-bold '>Add Your Review</h3>
                            <form onSubmit={handleAddReview} className="flex flex-col space-y-4">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your review..."
                                    required
                                    className="p-[15px] bg-gray-100 w-full h-[180px] mx-auto text-md font-medium rounded-[12px] focus:outline-none"
                                />

                                <div className='flex items-center  mt-[15px] justify-between'>
                                    <div className="flex items-center">
                                        <label className="mr-[10px] text-xl font-semibold">Rating:</label>
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                size={25}
                                                key={index}
                                                className={`cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                onClick={() => handleStarClick(index)}
                                            />
                                        ))}
                                    </div>

                                    <button type="submit" className="bg-gray-700 text-lg w-[150px] hover:bg-gray-400 text-white py-[4px] rounded-xl">
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className='w-full mt-[15px] mx-auto'>
                            <h2 className='md:text-[20px] text-[17px] underline text-custom-blue mb-[8px] mt-[20px] font-bold '>Your Reviews</h2>
                            <div>
                                {reviews.map((review) => (
                                    <div key={review.id}>
                                        {review.user_id === userId && (
                                            <div className='py-[8px] px-[10px] bg-gray-100 rounded-xl  scrollbar-hide  my-[15px] mx-auto' >
                                                <div className='pl-auto flex'>
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <FaStar
                                                            size={25}
                                                            key={index}
                                                            className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                                <p className='font-[550] text-gray-600 text-[16px] mt-[8px] break-words'>{review.comment}</p>
                                            </div>
                                        )}
                                        {review.user_id !== userId && (
                                            <></>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}
            {modalVisible && selectedProductId && (
                <ManageReviews onClose={closeModal} productId={selectedProductId} />
            )}
        </div >

    );
}

export default ProductSpecifications; 