import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import ProductData from './ProductData';
import { IoIosSearch } from "react-icons/io";

import { Bars } from 'react-loader-spinner'

function SearchProjects() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

    const viewSpecifications = (productId) => {
        navigate(`/product-specifications/${productId}`);
    };

    return (
        <div className='pt-[85px]'>
            <div className='w-[100%]  mt-[15px] flex justify-center mx-[5px] mb-[25px] p-[4px]'>

                <input
                    type="text"
                    className='w-[85%] p-[8px] border-2 border-gray-600 rounded-lg placeholder:text-gray-600 font-medium'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Product !!"
                />
                <button className='text-gray-600 ml-[10px]' onClick={handleSearch}><IoIosSearch size={35} /></button>
            </div>

            {loading &&
                <div className='h-[calc(98vh-135px)] w-screen flex flex-col justify-center items-center'>
                    <Bars
                        height="50"
                        width="50"
                        color="#363636"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true} />
                </div>
            }
            {error && <p className='flex justify-center mx-auto text-lg text-red-600 font-medium'>Error: {error}</p>}

            {searched && searchTerm.trim() !== '' && (
                products.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-[95%] mx-auto place-items-center gap-y-[25px]'>
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
                    <p className='flex justify-center mx-auto text-lg text-red-600 font-medium'>No results found</p>
                )
            )}
        </div>
    );
}

export default SearchProjects;
