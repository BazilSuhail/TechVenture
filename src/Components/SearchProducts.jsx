import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import ProductData from './ProductData';

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
            <h2>Search Projects</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter product name"
            />
            <button onClick={handleSearch}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

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
                    <p>No results found</p>
                )
            )}
        </div>
    );
}

export default SearchProjects;
