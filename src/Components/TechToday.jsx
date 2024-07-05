import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { Link } from 'react-router-dom';

const TechToday = () => {
    const [topLikedProducts, setTopLikedProducts] = useState([]);
    const [recentlyCreatedProducts, setRecentlyCreatedProducts] = useState([]);
    const [topLikedReviews, setTopLikedReviews] = useState([]);
    const [recentlyCreatedReviews, setRecentlyCreatedReviews] = useState([]);
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        // Fetch top 5 most liked products
        const fetchTopLikedProducts = async () => {
            try {
                const { data: products, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) {
                    throw error;
                }

                // Fetch likes count for each product using separate queries
                const productsWithLikes = await Promise.all(
                    products.map(async (product) => {
                        const { data: likesData, error: likesError } = await supabase
                            .from('product_likes')
                            .select('user_id')
                            .eq('product_id', product.id);

                        if (likesError) {
                            throw likesError;
                        }

                        return { ...product, likes: likesData.length };
                    })
                );

                // Sort products by likes in descending order and limit to top 5
                const sortedProducts = productsWithLikes
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 5);

                setTopLikedProducts(sortedProducts);
            } catch (error) {
                console.error('Error fetching top liked products:', error.message);
            }
        };

        // Fetch top 5 recently created products
        const fetchRecentlyCreatedProducts = async () => {
            try {
                const { data: createdProducts, error: createdProductsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (createdProductsError) throw createdProductsError;

                setRecentlyCreatedProducts(createdProducts);
            } catch (error) {
                console.error('Error fetching recently created products:', error.message);
            }
        };

        // Fetch top 5 liked reviews
        const fetchTopLikedReviews = async () => {
            try {
                const { data: likedReviews, error: likedReviewsError } = await supabase
                    .from('product_reviews')
                    .select('*')
                    .order('likes', { ascending: false })
                    .limit(5);

                if (likedReviewsError) throw likedReviewsError;

                setTopLikedReviews(likedReviews);

                // Fetch user names for liked reviews
                fetchUserNames(likedReviews);
            } catch (error) {
                console.error('Error fetching top liked reviews:', error.message);
            }
        };

        // Fetch top 5 recently created reviews
        const fetchRecentlyCreatedReviews = async () => {
            try {
                const { data: createdReviews, error: createdReviewsError } = await supabase
                    .from('product_reviews')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (createdReviewsError) throw createdReviewsError;

                setRecentlyCreatedReviews(createdReviews);

                // Fetch user names for recently created reviews
                fetchUserNames(createdReviews);
            } catch (error) {
                console.error('Error fetching recently created reviews:', error.message);
            }
        };

        // Fetch user names based on user IDs in reviews
        const fetchUserNames = async (reviews) => {
            const userIds = reviews.map((review) => review.user_id);
            const usersData = await Promise.all(
                userIds.map(async (userId) => {
                    const { data: userData, error } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('user_id', userId)
                        .single();

                    if (error) {
                        console.error('Error fetching user data:', error.message);
                        return null;
                    }

                    return { userId, userName: userData.full_name };
                })
            );

            const userNamesMap = usersData.reduce((acc, curr) => {
                if (curr) {
                    acc[curr.userId] = curr.userName;
                }
                return acc;
            }, {});

            setUserNames((prevNames) => ({ ...prevNames, ...userNamesMap }));
        };

        // Execute all fetch functions
        fetchTopLikedProducts();
        fetchRecentlyCreatedProducts();
        fetchTopLikedReviews();
        fetchRecentlyCreatedReviews();
    }, []);

    return (
        <div className="container mx-auto px-4 pt-[85px]">
            <h2 className="text-3xl font-semibold mb-4">Tech Today</h2>

            <div className="slider" style={{ '--width': '150px', '--height': '50px', '--quantity': 10 }}>
                <div className="list">
                    <div className="item" style={{ '--position': 1 }}> <div><button>Smartphone</button> </div> </div>
                    <div className="item" style={{ '--position': 2 }}> <div><button>Tablet</button> </div> </div>
                    <div className="item" style={{ '--position': 3 }}> <div><button>Laptop</button> </div> </div>
                    <div className="item" style={{ '--position': 4 }}> <div><button>Camera</button> </div> </div>
                    <div className="item" style={{ '--position': 5 }}> <div><button>Headphones</button> </div> </div>
                    <div className="item" style={{ '--position': 6 }}> <div><button>Smartwatch</button> </div> </div>
                    <div className="item" style={{ '--position': 7 }}> <div><button>Drone</button> </div> </div>
                    <div className="item" style={{ '--position': 8 }}> <div><button>Speaker</button> </div> </div>
                    <div className="item" style={{ '--position': 9 }}> <div><button>Monitor</button> </div> </div>
                    <div className="item" style={{ '--position': 10 }}> <div><button>VR Headset</button> </div> </div>
                </div>
            </div>

            <div className="slider" style={{ '--width': '100px', '--height': '50px', '--quantity': 10 }} reverse="true">
                <div className="list">
                    <div className="item" style={{ '--position': 1 }}>
                        <div>
                            <button>Bluetooth Earbuds</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 2 }}>
                        <div>
                            <button>Game Console</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 3 }}>
                        <div>
                            <button>Power Bank</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 4 }}>
                        <div>
                            <button>Printers</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 5 }}>
                        <div>
                            <button>Router</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 6 }}>
                        <div>
                            <button>External Hard Drive</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 7 }}>
                        <div>
                            <button>Smart Home Devices</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 8 }}>
                        <div>
                            <button>Graphics Card</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 9 }}>
                        <div>
                            <button>Keyboard</button>
                        </div>
                    </div>
                    <div className="item" style={{ '--position': 10 }}>
                        <div>
                            <button>Mouse</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Top 5 Most Liked Products</h3>
                <ul>
                    {topLikedProducts.map((product) => (
                        <li key={product.id} className="mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold">{product.name}</h4>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p className="text-gray-700">Price: ${product.price.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 mb-2">Likes: {product.likes}</p>
                                    <Link
                                        to={`/product-specifications/${product.id}`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
                                    >
                                        View Specifications
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Top 5 Recently Created Products</h3>
                <ul>
                    {recentlyCreatedProducts.map((product) => (
                        <li key={product.id} className="mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold">{product.name}</h4>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p className="text-gray-700">Price: ${product.price.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 mb-2">
                                        Created At: {new Date(product.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <Link
                                        to={`/product-specifications/${product.id}`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
                                    >
                                        View Specifications
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Top 5 Liked Reviews</h3>
                <ul>
                    {topLikedReviews.map((review) => (
                        <li key={review.id} className="mb-4">
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <p className="text-gray-700">Review ID: {review.id}</p>
                                    <p className="text-gray-700">Likes: {review.likes}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>User:</strong> {userNames[review.user_id]}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Rating:</strong> {review.rating}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Comment:</strong> {review.comment}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Top 5 Recently Created Reviews</h3>
                <ul>
                    {recentlyCreatedReviews.map((review) => (
                        <li key={review.id} className="mb-4">
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <p className="text-gray-700">Review ID: {review.id}</p>
                                    <p className="text-gray-700">
                                        Created At: {new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>User:</strong> {userNames[review.user_id]}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Rating:</strong> {review.rating}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Comment:</strong> {review.comment}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TechToday;
