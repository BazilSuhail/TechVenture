import React from 'react';
import { useNavigate } from 'react-router-dom';

const LikedProducts = ({ products }) => {
    const navigate = useNavigate();

    const viewSpecifications = (productId) => {
        navigate(`/product-specifications/${productId}`);
    };

    return (
        <div className='scrollbar-custom'>
            {products.map((product) => (
                <div key={product.id}  className='flex justify-between shadow-custom-card mx-auto my-[20px] items-center p-[5px] w-[95%]'> 
                    <p className='text-md ld:text-xl ml-[12px] font-medium m-[6px] border-2 border-gray-400 p-[5px] rounded-xl'>{product.name}</p>
                    <button onClick={() => viewSpecifications(product.id)}
                    className='text-md ld:text-xl ml-[12px] font-medium m-[6px] hover:text-gray-900 hover:bg-gray-200 bg-gray-900 text-white px-[12px] py-[4px] rounded-xl'>
                        Review
                    </button>
                    {/* Display other product details as needed */}
                </div>
            ))}
        </div>
    );
};

export default LikedProducts;
