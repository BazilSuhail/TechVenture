import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import { useNavigate } from 'react-router-dom';
import ProductData from './ItemData';
import { IoIosSearch } from "react-icons/io";
import { Bars } from 'react-loader-spinner'; 

function SearchProjects() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        
        window.scrollTo(0, 0);
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('name', `%${searchTerm}%`);

                if (error) throw error;

                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (searched && searchTerm.trim() !== '') {
            fetchProducts();
        }
    }, [searchTerm, searched]);

    const handleSearch = () => {
        setSearched(true);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const viewSpecifications = (productId) => {
        navigate(`/product-specifications/${productId}`);
    };

    return (
        <div className='pt-[85px] bg-white min-h-screen w-full overflow-x-hidden'>
            <div className='w-full mt-[15px] flex justify-center mx-[5px] mb-[25px] p-[4px]'>
                <input
                    type="text"
                    className='w-[85%] p-[8px] border-2 border-gray-600 rounded-lg placeholder:text-gray-600 font-medium'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search Product !!"
                />
                <button className='text-gray-600 ml-[10px]' onClick={handleSearch}>
                    <IoIosSearch size={35} />
                </button>
            </div>

            {loading && (
                <div className='h-[calc(98vh-135px)] scale-[0.9] w-full flex flex-col justify-center items-center'>
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
            )}
            {error && (
                <p className='flex justify-center mx-auto text-lg text-red-600 font-medium'>{error}</p>
            )}

            {!searched && !loading && !error && (
                <div className='flex xl:scale-[1.2] flex-col items-center justify-center h-[calc(98vh-135px)] text-gray-600'>
                    <div className=' w-[255px] h-[255px] rounded-full overflow-hidden filter'>
                        <img className='w-full h-full grayscale' src="https://img.freepik.com/free-vector/search-concept-landing-page_52683-18927.jpg?t=st=1731061761~exp=1731065361~hmac=7c6b67cc5a6009237a08bbdf6f548c7c1e0820c7aed9dedac070ba990e1f9d90&w=740" alt="" />
                    </div>
                    <p className='text-[22px] bg-white z-50 mt-[-20px] font-medium'>Search the Catalog Now</p>
                    <p className='text-[12px] text-gray-509'>Find the products you're looking for</p>
                </div>
            )}


            {searched && searchTerm.trim() !== '' && (
                products.length > 0 ? (
                    <div className='scrollbar-hide grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-[95%] mx-auto place-items-center gap-[25px]'>
                        {products.map((product) => (
                            <ProductData
                                key={product.id}
                                product={product}
                                showSubcategory={false}
                                subcategories={[]}
                                viewSpecifications={viewSpecifications}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex xl:scale-[1.2] flex-col items-center justify-center h-[calc(98vh-135px)] text-gray-600'>
                        <div className=' w-[255px] h-[255px] rounded-full overflow-hidden filter'>
                            <img className='w-full h-full' src="https://img.freepik.com/free-vector/search-concept-landing-page_52683-18927.jpg?t=st=1731061761~exp=1731065361~hmac=7c6b67cc5a6009237a08bbdf6f548c7c1e0820c7aed9dedac070ba990e1f9d90&w=740" alt="" />
                        </div>
                        <p className='text-[18px] bg-white text-red-600 z-50 mt-[-20px] font-medium'>No Results Found</p> 
                    </div>
                )
            )}
        </div>
    );
}

export default SearchProjects;
