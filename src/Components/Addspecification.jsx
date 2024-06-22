import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../Config/Config';

function AddSpecification() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({ name: '', description: '', price: '', subcategory_id: '' });
  const [specifications, setSpecifications] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editedAttribute, setEditedAttribute] = useState({ name: '', value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productImage, setProductImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const fetchProductDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (error) throw error;
      setProductDetails(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchSpecifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productId);
      if (error) throw error;
      setSpecifications(data || []);
    } catch (error) {
      setError(error.message);
    }
  }, [productId]);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase.from('subcategories').select('*');
      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProductImage = useCallback(async () => {
    try {
      const { data: imageUrl, error: imageError } = await supabase
        .storage
        .from('product_images')
        .getPublicUrl(`${productId}.jpeg`);
      if (imageError) {
        throw imageError;
      }
      setProductImage(imageUrl.publicUrl);
    } catch (error) {
      setError(error.message);
    }
  }, [productId]);

  useEffect(() => {
    Promise.all([
      fetchProductDetails(),
      fetchSpecifications(),
      fetchProductImage(),
      fetchSubcategories()
    ]).then(() => setLoading(false));
  }, [fetchProductDetails, fetchSpecifications, fetchProductImage]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('products')
        .update(productDetails)
        .eq('id', productId);
      if (error) throw error;
      alert('Product details updated successfully');
    } catch (error) {
      setError(error.message);
    }
  };

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
      await fetchSpecifications();
      setNewAttribute({ name: '', value: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (imageFile && imageFile.type === 'image/jpeg') {
      try {
        const { error } = await supabase.storage
          .from('product_images')
          .upload(`${productId}.jpeg`, imageFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) throw error;
        fetchProductImage();
        alert('Image updated successfully');
        setImageFile(null); // Reset the image file after successful upload
      } catch (error) {
        setError(error.message);
      }
    } else {
      alert('Please upload a JPEG image.');
    }
  };

  const handleEditSpecification = (spec) => {
    setEditingAttribute(spec.id);
    setEditedAttribute({ name: spec.attribute_name, value: spec.attribute_value });
  };

  const handleSaveSpecification = async (specId) => {
    try {
      const { error } = await supabase
        .from('product_specifications')
        .update({ attribute_name: editedAttribute.name, attribute_value: editedAttribute.value })
        .eq('id', specId);
      if (error) throw error;
      await fetchSpecifications();
      setEditingAttribute(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingAttribute(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Product</h2>
      <button onClick={() => navigate(-1)}>Back to Products</button>
      {productImage && (
        <div>
          <img src={productImage} alt="Product" style={{ width: '200px', margin: '20px 0' }} />
          <form onSubmit={handleImageUpload}>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/jpeg" />
            <button type="submit">Update Image</button>
          </form>
        </div>
      )}
      <form onSubmit={handleUpdateProduct}>
        <input
          type="text"
          value={productDetails.name}
          onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          value={productDetails.description}
          onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
          placeholder="Description"
        />
        <input
          type="number"
          value={productDetails.price}
          onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
          placeholder="Price"
          required
        />
        <select
          value={productDetails.subcategory_id}
          onChange={(e) => setProductDetails({ ...productDetails, subcategory_id: e.target.value })}
          required
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        <button type="submit">Update Product</button>
      </form>

      <h2>Product Specifications</h2>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specifications.length === 0 ? (
            <tr>
              <td colSpan="3">No specifications found</td>
            </tr>
          ) : (
            specifications.map((spec) => (
              <tr key={spec.id}>
                {editingAttribute === spec.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editedAttribute.name}
                        onChange={(e) => setEditedAttribute({ ...editedAttribute, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedAttribute.value}
                        onChange={(e) => setEditedAttribute({ ...editedAttribute, value: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSaveSpecification(spec.id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{spec.attribute_name}</td>
                    <td>{spec.attribute_value}</td>
                    <td>
                      <button onClick={() => handleEditSpecification(spec)}>Edit</button>
                    </td>
                  </>
                )}
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
