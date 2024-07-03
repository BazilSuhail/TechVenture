import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import Subcategories from './SubCategories';
import Products from './Products';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(false);
  const [registerCategory, setregisterCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

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

  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      alert('Error deleting category: ' + error.message);
    }
  };

  const editCategory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('categories').update({ name: editingCategoryName }).eq('id', editingCategory);
      if (error) throw error;
      setEditingCategory(null);
      setEditingCategoryName('');
      fetchCategories();
    } catch (error) {
      alert('Error editing category: ' + error.message);
    }
  };
 
  return (
    <React.Fragment>
      <div className='h-full w-full pt-[84px]'>
        <h2 className='text-custom-blue border- text-2xl text-center font-bold p-[8px] rounded-2xl'>Categories Details</h2>
        <div className='w-[95%] mb-[15px] mx-auto h-[2px] bg-custom-blue'></div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (

          <div>
            <div className='my-[8px] flex flex-col w-[95%] mx-auto p-[15px] justify-center bg-gray-100 rounded-xl overflow-x-auto'>
              <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Categories Data</h2>
              <div className="relative overflow-x-auto shadow-md rounded-lg"></div>
              <table className="w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-md text-gray-200 uppercase bg-gray-700">
                  <tr className='text-center'>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className='text-center odd:bg-white even:bg-gray-200 text-custom-blue text-md font-bold'>
                      {/*<td>{category.id}</td>*/}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCategory === category.id ? (
                          <input
                            type="text"
                            className='rounded-lg p-[4px] shadow-custom-light text-lg font-bold'
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCategory === category.id ? (
                          <button onClick={editCategory} className="whitespace-nowrap bg-green-900 mr-[15px] w-[75px] hover:bg-white hover:shadow-custom-light hover:text-custom-blue text-md py-[8px] px-[12px] font-semibold text-white rounded-xl">
                            Save
                          </button>
                        ) : (
                          <>
                            <button onClick={() => {
                              setEditingCategory(category.id);
                              setEditingCategoryName(category.name);
                            }} className="whitespace-nowrap bg-custom-blue hover:bg-white hover:shadow-custom-light hover:text-custom-blue text-md py-[8px] px-[25px] font-semibold text-white rounded-xl" >
                              Edit
                            </button>
                            <button onClick={() => deleteCategory(category.id)} className="ml-[10px] whitespace-nowrap bg-red-700 hover:bg-white hover:shadow-custom-light hover:text-red-700 text-md py-[8px] px-[25px] font-semibold text-white rounded-xl">
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
              {registerCategory ? 'Close Registration' : 'Register Category'}
            </button>

            {registerCategory &&
              <div className='my-[38px] flex flex-col w-[95%] lg::w-[65%] mx-auto p-[15px] justify-center shadow-custom-light rounded-xl overflow-x-auto'>
                <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Categories</h2>
                <form onSubmit={addCategory}>
                  <label className="block text-lg  font-medium text-gray-700" htmlFor="studentEmail">Category Name:</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category"
                    className="my-[5px] shadow-custom-light block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
                    required
                  />
                  <button type="submit" className='w-[190px] mx-auto my-[15px] py-[8px] justify-center rounded-md bg-custom-blue text-lg font-bold hover:text-custom-blue hover:bg-white text-white' >
                    Add Category
                  </button>
                </form>
              </div>
            }

            <Subcategories categories={categories} />
            <Products categories={categories} />
          </div>
        )}
      </div>

    </React.Fragment >
  );
}


export default AdminDashboard;
