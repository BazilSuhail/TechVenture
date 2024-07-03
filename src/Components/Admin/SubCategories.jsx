import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';

function Subcategories({ categories }) {
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', category_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editingSubcategoryData, setEditingSubcategoryData] = useState({ name: '', category_id: '' });
  const [registerCategory, setregisterCategory] = useState(null);

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

  const deleteSubcategory = async (id) => {
    try {
      const { error } = await supabase.from('subcategories').delete().eq('id', id);
      if (error) throw error;
      fetchSubcategories();
    } catch (error) {
      alert('Error deleting subcategory: ' + error.message);
    }
  };

  const editSubcategory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('subcategories').update(editingSubcategoryData).eq('id', editingSubcategory);
      if (error) throw error;
      setEditingSubcategory(null);
      setEditingSubcategoryData({ name: '', category_id: '' });
      fetchSubcategories();
    } catch (error) {
      alert('Error editing subcategory: ' + error.message);
    }
  };


  const getCategoryName = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div className='h-full w-full'>
      <h2 className='text-custom-blue border- text-2xl text-center font-bold p-[8px] rounded-2xl'>Sub-Categories Details</h2>
      <div className='w-[95%] mb-[15px] mx-auto h-[2px] bg-custom-blue'></div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div >
          <div className='my-[8px] flex flex-col w-[95%] mx-auto p-[15px] justify-center bg-gray-100 rounded-xl overflow-x-auto'>
            <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Sub-Categories Data</h2>
            <div className="relative overflow-x-auto shadow-md rounded-lg"></div>
            <table className="w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-md text-gray-200 uppercase bg-gray-700">
                <tr className='text-center'>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Category Name</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap"> Name</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap"> Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcategory) => (
                  <tr key={subcategory.id} className='text-center odd:bg-white even:bg-gray-200 text-custom-blue text-md font-bold'>
                    {/*<td>{subcategory.id}</td>*/}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSubcategory === subcategory.id ? (
                        <select
                          value={editingSubcategoryData.category_id}

                          className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                          onChange={(e) => setEditingSubcategoryData({ ...editingSubcategoryData, category_id: e.target.value })}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        getCategoryName(subcategory.category_id)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSubcategory === subcategory.id ? (
                        <input
                          type="text"
                          className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                          value={editingSubcategoryData.name}
                          onChange={(e) => setEditingSubcategoryData({ ...editingSubcategoryData, name: e.target.value })}
                        />
                      ) : (
                        subcategory.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSubcategory === subcategory.id ? (
                        <button onClick={editSubcategory} className="whitespace-nowrap bg-green-900 mr-[15px] w-[75px] hover:bg-white hover:shadow-custom-light hover:text-custom-blue text-md py-[8px] px-[12px] font-semibold text-white rounded-xl">
                          Save
                        </button>
                      ) : (
                        <>
                          <button onClick={() => {
                            setEditingSubcategory(subcategory.id);
                            setEditingSubcategoryData({ name: subcategory.name, category_id: subcategory.category_id });
                          }} className="whitespace-nowrap bg-custom-blue hover:bg-white hover:shadow-custom-light hover:text-custom-blue text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                            Edit</button>
                          <button onClick={() => deleteSubcategory(subcategory.id)} className="ml-[10px] whitespace-nowrap bg-red-700 hover:bg-white hover:shadow-custom-light hover:text-red-700 text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={() => { setregisterCategory(!registerCategory) }} className='w-[210px] mx-auto my-[15px] ml-[40px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
            {registerCategory ? 'Close Registration' : 'Register Sub-Category'}
          </button>

          {registerCategory &&
            <div className='my-[38px] flex flex-col w-[95%] lg::w-[65%] mx-auto p-[15px] justify-center shadow-custom-light rounded-xl overflow-x-auto'>
              <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Sub-Categories</h2>
              <form onSubmit={addSubcategory}>
                <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                <input
                  type="text"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                  placeholder="New Subcategory"
                  required
                />
                <select
                  value={newSubcategory.category_id}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
                  required
                  className="my-[15px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                >
                  <option value=""   >Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className='bg-custom-blue text-white text-lg ' >
                      {category.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className='w-[190px] mx-auto my-[15px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
                  Add Subcategory
                </button>
              </form>
            </div>
          }

        </div>
      )}
    </div >

  );
}


export default Subcategories;
