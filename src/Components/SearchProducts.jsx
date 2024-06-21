import React, { useState } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

function SearchProjects() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
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
    const viewSpecifications = (productId) => {
        navigate(`/product-specifications/${productId}`);
    };
    return (
        <div>
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

            {
                products.size !== 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Check Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <button onClick={() => viewSpecifications(product.id)}>View Specifications</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    :
                    <></>
            }
        </div >
    );
}

export default SearchProjects;
