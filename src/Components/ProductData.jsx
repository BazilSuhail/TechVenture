import React from 'react';

function ProductData({ product, subcategories, viewSpecifications, showSubcategory }) {

    const truncateDescription = (description) => {
        return description.length > 50 ? description.slice(0, 50) + '...' : description;
    };
    
    return (
        <div className='flex flex-col justify-center border-2 border-gray-400 rounded-lg h-[95%] w-[95%] p-[15px] m-[6px]'>

            <h3 className='px-[6px] py-[16px] border-2 mt-[8px] font-bold text-center text-2xl border-gray-300 rounded-lg'>{product.name}</h3>
            <p className='font-bold py-[25px] text-md text-gray-500'>{truncateDescription(product.description)}</p>
           
            {showSubcategory && (
                    <div className='flex justify-between items-center mb-[30px]'>
                        <p className='text-white bg-black rounded-lg py-[5px] px-[10px]'>{subcategories.find(subcategory => subcategory.id === product.subcategory_id)?.name}</p>
                        <p className='text-xl font-extrabold text-gray-800'>${product.price}</p>
                    </div>
                )
            }
            <button onClick={() => viewSpecifications(product.id)} className='bg-gray-800 text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]'>View Specifications</button>
        </div>
    );
}

export default ProductData;
/*{loadingImage ? (
                <div>Loading Image...</div>
            ) : (
                <div>
                    {imageUrl ? (
                        <img src={imageUrl} alt="Product" className='mx-auto w-[250px] h-[250px] rounded-lg' />
                    ) : (
                        <div className='w-[250px] mx-auto flex flex-col items-center justify-center rounded-lg bg-gray-400 h-[250px]'>
                            <div className='w-[200px] flex flex-col items-center justify-center rounded-lg bg-gray-300 h-[200px]'>
                                <div className='w-[150px] flex flex-col items-center justify-center rounded-lg bg-gray-200 h-[150px]'>
                                    <div className='w-[90px] flex flex-col items-center justify-center rounded-lg bg-gray-50 h-[90px]'></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )} */