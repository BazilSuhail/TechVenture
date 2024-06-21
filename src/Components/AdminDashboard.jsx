import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ name: '', category_id: '' });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', subcategory_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, subcategoriesData, productsData] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('subcategories').select('*'),
        supabase.from('products').select('*')
      ]);

      if (categoriesData.error) throw categoriesData.error;
      if (subcategoriesData.error) throw subcategoriesData.error;
      if (productsData.error) throw productsData.error;

      setCategories(categoriesData.data || []);
      setSubcategories(subcategoriesData.data || []);
      setProducts(productsData.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('categories').insert([{ name: newCategory }]);
      if (error) throw error;
      setNewCategory('');
      fetchData();
    } catch (error) {
      alert('Error adding category: ' + error.message);
    }
  };

  const addSubcategory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('subcategories').insert([newSubcategory]);
      if (error) throw error;
      setNewSubcategory({ name: '', category_id: '' });
      fetchData();
    } catch (error) {
      alert('Error adding subcategory: ' + error.message);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      setNewProduct({ name: '', description: '', price: '', subcategory_id: '' });
      fetchData();
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <React.Fragment>
      <h2>Admin Dashboard</h2>

      <div>
        <h3>Categories</h3>
        <form onSubmit={addCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            required
          />
          <button type="submit">Add Category</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>Subcategories</h3>
        <form onSubmit={addSubcategory}>
          <input
            type="text"
            value={newSubcategory.name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
            placeholder="New Subcategory"
            required
          />
          <select
            value={newSubcategory.category_id}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Subcategory</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id}>
                <td>{subcategory.id}</td>
                <td>{subcategory.category_id}</td>
                <td>{subcategory.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          <button type="submit">Add Product</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subcategory ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.subcategory_id}</td>
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
    </React.Fragment>
  );
}

export default AdminDashboard;
