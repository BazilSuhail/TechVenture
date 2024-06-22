import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';

function Subcategories({ categories }) {
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', category_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubcategories();
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

  const addSubcategory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('subcategories').insert([newSubcategory]);
      if (error) throw error;
      setNewSubcategory({ name: '', category_id: '' });
      fetchSubcategories();
    } catch (error) {
      alert('Error adding subcategory: ' + error.message);
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
  );
}

export default Subcategories;
