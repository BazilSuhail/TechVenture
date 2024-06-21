import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../Config/Config';

function AddSpecification() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [specifications, setSpecifications] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSpecifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productId);

      if (error) throw error;
      setSpecifications(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchSpecifications();
  }, [fetchSpecifications]);

  const handleAddSpecification = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('product_specifications').insert([
        {
          product_id: productId,
          attribute_name: newAttribute.name,
          attribute_value: newAttribute.value,
        },
      ]);

      if (error) throw error;

      // Fetch specifications again after insertion to get updated data
      await fetchSpecifications();

      setNewAttribute({ name: '', value: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Product Specifications</h2>
      <button onClick={() => navigate(-1)}>Back to Products</button>
      <form onSubmit={handleAddSpecification}>
        <input
          type="text"
          value={newAttribute.name}
          onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
          placeholder="Attribute Name"
          required
        />
        <input
          type="text"
          value={newAttribute.value}
          onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
          placeholder="Attribute Value"
        />
        <button type="submit">Add Specification</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Attribute Name</th>
            <th>Attribute Value</th>
          </tr>
        </thead>
        <tbody>
          {specifications.length === 0 ? (
            <tr>
              <td colSpan="2">No specifications found</td>
            </tr>
          ) : (
            specifications.map((spec) => (
              <tr key={spec.id}>
                <td>{spec.attribute_name}</td>
                <td>{spec.attribute_value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default AddSpecification;
