import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import Subcategories from './SubCategories';
import Products from './Products';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      setCategories(data || []);
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
      fetchCategories();
    } catch (error) {
      alert('Error adding category: ' + error.message);
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

      <Subcategories categories={categories} />
      <Products categories={categories} />
    </React.Fragment>
  );
}

export default AdminDashboard;
