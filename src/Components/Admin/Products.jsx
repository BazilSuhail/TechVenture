import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import { useNavigate } from 'react-router-dom';

function Products({ categories }) {
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', subcategory_id: '' });
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
    fetchProducts();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('subcategories').select('*');
      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (productId) => {
    try {
      /*
      const { data, error } = await supabase.storage
        .from('product_images')
        .upload(`${productId}/${productId}.jpeg`, productImage, {
          cacheControl: '3600',
          upsert: false,
        });
      */
      const { error } = await supabase.storage
        .from('product_images')
        .upload(`${productId}.jpeg`, productImage, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      fetchProducts();
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw error;

      const addedProduct = data[0];

      if (productImage) {
        await handleImageUpload(addedProduct.id);
      }

      setNewProduct({ name: '', description: '', price: '', subcategory_id: '' });
      setProductImage(null);
      fetchProducts();
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/jpeg') {
      setProductImage(file);
    } else {
      alert('Please upload a JPEG image.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Products</h3>
      <form onSubmit={addProduct}>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="New Product"
          required
        />
        <input
          type="text"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Description"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Price"
          required
        />
        <select
          value={newProduct.subcategory_id}
          onChange={(e) => setNewProduct({ ...newProduct, subcategory_id: e.target.value })}
          required
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg"
        />
        <button type="submit">Add Product</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <button onClick={() => navigate(`/add-specifications/${product.id}`)}>Add Specification</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
