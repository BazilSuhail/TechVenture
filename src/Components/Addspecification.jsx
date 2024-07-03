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
  const [imageFound, setimageFound] = useState(false);
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

      // Check if imageUrl exists and is not null
      if (imageUrl && imageUrl.publicUrl) {
        console.log(imageUrl.publicUrl);
        setProductImage(imageUrl.publicUrl);
      } else {
        // If imageUrl or publicUrl is not available, set a placeholder image
        setimageFound(true);
      }
    } catch (error) {
      // Handle error and set appropriate state
      setError(`Error fetching product image: ${error.message}`);
      // Set a placeholder image on error
      setProductImage('path_to_placeholder_image.jpg'); // Replace with your placeholder image path
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

  return (
    <div className='pt-[85px]'>
      <h2 className='text-custom-blue border- text-2xl text-center font-bold p-[8px] rounded-2xl'>Products Specification Details</h2>
      <div className='w-[95%] mb-[15px] mx-auto h-[2px] bg-custom-blue'></div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <button onClick={() => navigate(-1)} className='w-[210px] mx-auto my-[15px] ml-[40px] py-[8px] justify-center rounded-md bg-gray-700 text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
            Back to Products</button>

          <div className='my-[38px] w-[95%] mx-auto p-[15px] shadow-custom-light rounded-xl overflow-x-auto'>
            <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Product Image</h2>
            <form onSubmit={handleImageUpload}>
              <div className=' grid grid-cols-1 md:grid-cols-2 place-items-center' >

                {imageFound ? (
                  <img src={productImage} alt="" className=' w-[300px]  h-[300px]' />
                ) : (
                  <div className=' w-[300px] flex flex-col items-center justify-center rounded-lg bg-gray-400 h-[300px]'>
                    <div className=' w-[250px] flex flex-col items-center justify-center rounded-lg bg-gray-300 h-[250px]'>
                      <div className=' w-[150px] flex flex-col items-center justify-center rounded-lg bg-gray-200 h-[150px]'>
                        <div className=' w-[90px] flex flex-col items-center justify-center rounded-lg bg-gray-50 h-[90px]'></div></div></div>
                  </div>
                )}

                <div className='p-[10px] md:my-[0px] mt-[25px] bg-gray-300 rounded-xl w-[100%] h-[100%]'>
                  <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/jpeg"
                    className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md" />
                  <button type="submit" className='w-[190px] mx-auto my-[15px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
                    Update Image
                  </button>
                </div>
              </div>

            </form>
          </div>

          <div className='my-[38px] flex flex-col w-[95%] lg::w-[65%] mx-auto p-[15px] justify-center shadow-custom-light rounded-xl overflow-x-auto'>
            <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Update Sub-Categories</h2>
            <form onSubmit={handleUpdateProduct}  >
              <select
                value={productDetails.subcategory_id}
                className="my-[15px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                onChange={(e) => setProductDetails({ ...productDetails, subcategory_id: e.target.value })}
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id} className='bg-custom-blue text-white text-lg ' >
                    {subcategory.name}
                  </option>
                ))}
              </select>
              <button type="submit" className='w-[190px] mx-auto my-[15px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
                Update Product
              </button>
            </form>
          </div>


          <div className='my-[38px] flex flex-col w-[95%] lg::w-[65%] mx-auto p-[15px] justify-center shadow-custom-light rounded-xl overflow-x-auto'>
            <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Update Sub-Categories</h2>
            <form onSubmit={handleAddSpecification}>

              <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Attribute Name:</label>
              <input
                type="text"
                className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                placeholder="Attribute Name"
                required
              />

              <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Attribute Value</label>
              <input
                type="text"
                value={newAttribute.value}
                onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                placeholder="Attribute Value"
              />
              <button type="submit" className='w-[190px] mx-auto my-[15px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
                Add Specification
              </button>
            </form>
          </div>

          <div className='my-[8px] flex flex-col w-[95%] mx-auto p-[15px] justify-center bg-gray-100 rounded-xl overflow-x-auto'>
            <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Product Attribute's Details</h2>
            <div className="relative overflow-x-auto shadow-md rounded-lg"></div>
            <table className="w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-md text-gray-200 uppercase bg-gray-700">
                <tr className='text-center'>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Value</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap"> Actions</th>
                </tr>
              </thead>
              <tbody>
                {specifications.length === 0 ? (
                  <tr className='text-center odd:bg-white even:bg-gray-200 text-custom-blue text-md font-bold'>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap">No specifications found</td>
                  </tr>
                ) : (
                  specifications.map((spec) => (
                    <tr key={spec.id} className='text-center odd:bg-white even:bg-gray-200 text-custom-blue text-md font-bold'>
                      {editingAttribute === spec.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                              value={editedAttribute.name}
                              onChange={(e) => setEditedAttribute({ ...editedAttribute, name: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                              value={editedAttribute.value}
                              onChange={(e) => setEditedAttribute({ ...editedAttribute, value: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => handleSaveSpecification(spec.id)} className="ml-[10px] whitespace-nowrap bg-blue-700 hover:bg-white hover:shadow-custom-light hover:text-blue-700 text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                              Save
                            </button>
                            <button onClick={handleCancelEdit} className="ml-[10px] whitespace-nowrap bg-red-700 hover:bg-white hover:shadow-custom-light hover:text-red-700 text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{spec.attribute_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{spec.attribute_value}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => handleEditSpecification(spec)} className="whitespace-nowrap bg-custom-blue hover:bg-white hover:shadow-custom-light hover:text-custom-blue text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                              Edit
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {error && <div>Error: {error}</div>}
        </div>
      )}
    </div>
  );
}

export default AddSpecification;
