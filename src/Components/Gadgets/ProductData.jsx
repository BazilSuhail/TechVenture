import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";

function ProductData({ product, subcategories, viewSpecifications, showSubcategory }) {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0.02, 0.08], [0.95, 1]);
    const opacity = useTransform(scrollYProgress, [0.02, 0.08], [0.8, 1]);

    const truncateDescription = (description) => {
        return description.length > 150 ? description.slice(0, 180) + '...' : description;
    };

    return (
        <motion.div className='flex flex-col justify-center border bg-white  rounded-lg h-[95%] w-full p-[28px] m-[6px]'
            style={{ scale, opacity }}
        >
            <h3 className='px-[6px] py-[16px] border-2 mt-[8px] font-bold text-center text-2xl border-gray-300 rounded-lg'>{product.name}</h3>
            <p className='font-bold py-[25px] text-md text-gray-500'>{truncateDescription(product.description)}</p>

            {showSubcategory && (
                <div className='flex justify-between items-center mb-[30px]'>
                    <p className='text-white font-[600] scale-[0.85] ml-[-12px] bg-black rounded-[25px] py-[5px] px-[10px]'>{subcategories.find(subcategory => subcategory.id === product.subcategory_id)?.name}</p>
                    <p className='text-xl font-[700] text-gray-800'>${product.price}</p>
                </div>
            )
            }
            <button onClick={() => viewSpecifications(product.id)} className='bg-gray-800 text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]'>View Specifications</button>
        </motion.div>
    );
}

export default ProductData; 