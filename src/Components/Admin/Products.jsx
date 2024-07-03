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
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductData, setEditingProductData] = useState({ name: '', description: '', price: '', subcategory_id: '' });
  const navigate = useNavigate();
  const [registerProduct, setregisterProduct] = useState(null);

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
  const deleteProduct = async (id) => {
    try {
      // Delete related records in the product_specifications table
      const { error: specError } = await supabase.from('product_specifications').delete().eq('product_id', id);
      if (specError) throw specError;

      // Delete the product
      const { error: productError } = await supabase.from('products').delete().eq('id', id);
      if (productError) throw productError;

      fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };


  const editProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('products').update(editingProductData).eq('id', editingProduct);
      if (error) throw error;
      setEditingProduct(null);
      setEditingProductData({ name: '', description: '', price: '', subcategory_id: '' });
      fetchProducts();
    } catch (error) {
      alert('Error editing product: ' + error.message);
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


  return (
    <div className='h-full w-full'>
      <h2 className='text-custom-blue border- text-2xl text-center font-bold p-[8px] rounded-2xl'>Products Details</h2>
      <div className='w-[95%] mb-[15px] mx-auto h-[2px] bg-custom-blue'></div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>

          <div className='my-[8px] flex flex-col w-[95%] mx-auto p-[15px] justify-center bg-gray-100 rounded-xl overflow-x-auto'>
            <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Sub-Categories Data</h2>
            <div className="relative overflow-x-auto shadow-md rounded-lg"></div>
            <table className="w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-md text-gray-200 uppercase bg-gray-700">
                <tr className='text-center'>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Description</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap"> Price</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap"> Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className='text-center odd:bg-white even:bg-gray-200 text-custom-blue text-md font-bold'>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct === product.id ? (
                        <input
                          type="text"
                          value={editingProductData.name}
                          className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                          onChange={(e) => setEditingProductData({ ...editingProductData, name: e.target.value })}
                        />
                      ) : (
                        product.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct === product.id ? (
                        <input
                          type="text"
                          className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                          value={editingProductData.description}
                          onChange={(e) => setEditingProductData({ ...editingProductData, description: e.target.value })}
                        />
                      ) : (
                        product.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct === product.id ? (
                        <input
                          type="number"
                          value={editingProductData.price}
                          onChange={(e) => setEditingProductData({ ...editingProductData, price: e.target.value })}
                        />
                      ) : (
                        product.price
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct === product.id ? (
                        <button onClick={editProduct}>Save</button>
                      ) : (
                        <>
                          <button onClick={() => {
                            setEditingProduct(product.id);
                            setEditingProductData({
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              subcategory_id: product.subcategory_id
                            });
                          }} className="whitespace-nowrap bg-custom-blue hover:bg-white hover:shadow-custom-light hover:text-custom-blue text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                            Edit
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="ml-[10px] whitespace-nowrap bg-red-700 hover:bg-white hover:shadow-custom-light hover:text-red-700 text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                            Delete
                          </button>
                          <button onClick={() => navigate(`/add-specifications/${product.id}`)} className="ml-[10px] whitespace-nowrap bg-blue-700 hover:bg-white hover:shadow-custom-light hover:text-blue-700 text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                            Edit Specification
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          <button onClick={() => { setregisterProduct(!registerProduct) }} className='w-[210px] mx-auto my-[15px] ml-[40px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
            {registerProduct ? 'Close Registration' : 'Create Product'}
          </button>

          {registerProduct &&
            <div className='my-[38px] flex flex-col w-[95%] lg::w-[65%] mx-auto p-[15px] justify-center shadow-custom-light rounded-xl overflow-x-auto'>
              <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Categories</h2>
              <form onSubmit={addProduct}>
                <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                <input
                  type="text"
                  value={newProduct.name}
                  className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="New Product"
                  required
                />
                <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                <input
                  type="text"
                  value={newProduct.description}
                  className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Description"
                />
                <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                <input
                  type="number"
                  value={newProduct.price}
                  className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Price"
                  required
                />
                <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                <select
                  value={newProduct.subcategory_id}
                  className="my-[15px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                  onChange={(e) => setNewProduct({ ...newProduct, subcategory_id: e.target.value })}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id} className='bg-custom-blue text-white text-lg ' >
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                  accept="image/jpeg"
                />
                    <button type="submit" className='w-[190px] mx-auto my-[15px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
                      Add Product
                    </button>
              </form>
            </div>
          }

        </div>
      )}
    </div >

  );
}


export default Products;
