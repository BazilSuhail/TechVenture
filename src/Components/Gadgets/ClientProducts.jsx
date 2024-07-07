import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Config';
import { useNavigate } from 'react-router-dom';
import ProductData from './ProductData';
import { IoIosSearch } from "react-icons/io";
import { Bars } from 'react-loader-spinner'

function ClientProducts() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [loading, setLoading] = useState(true); // Initialize loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*');
        const { data: subcategoriesData, error: subcategoriesError } = await supabase.from('subcategories').select('*');
        const { data: productsData, error: productsError } = await supabase.from('products').select('*');

        if (categoriesError || subcategoriesError || productsError) {
          throw new Error('Failed to fetch data');
        }

        setCategories(categoriesData || []);
        setSubcategories(subcategoriesData || []);
        setProducts(productsData || []);
        setFilteredProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []); // Dependency array empty because fetchData does not depend on any state

  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products]; // Create a copy to avoid mutating state directly

      if (selectedCategory) {
        filtered = filtered.filter(product => {
          const subcategory = subcategories.find(sc => sc.id === product.subcategory_id);
          return subcategory && subcategory.category_id === selectedCategory;
        });
      }

      if (selectedSubcategory) {
        filtered = filtered.filter(product => product.subcategory_id === selectedSubcategory);
      }

      setFilteredProducts(filtered);
    };

    filterProducts(); // Call filterProducts directly in the useEffect

  }, [selectedCategory, selectedSubcategory, products, subcategories]); // Include all dependencies used in filterProducts

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
  };

  const viewSpecifications = (productId) => {
    navigate(`/product-specifications/${productId}`);
  };
  // px-4 lg:hover:bg-gray-400 whitespace-nowrap hover:text-white font-bold transition duration-200 rounded-md cursor-pointer ${selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-300'}
  return (
    <div className='h-full w-full pt-[85px] '>
      {loading ? (
        <div className='h-[calc(98vh-95px)] w-screen flex flex-col justify-center items-center'> 
        <Bars
          height="50"
          width="50"
          color="#363636"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true} />
      </div>
      ) : (
        <div className='scrollbar-custom'>

          <div onClick={() => { navigate("/searchprojects") }} className='w-[100%] mt-[15px] flex justify-center mx-[5px] mb-[25px] p-[4px]'>
            <div className='w-[85%] p-[8px] border-2 border-gray-600 rounded-lg text-gray-600 font-medium'>Search Product !!</div>
            <button className='text-gray-600 ml-[10px]'><IoIosSearch size={35} /></button>
          </div>

          <div className=' my-[14px] md:my-[30px] '>

            <div className="flex font-bold mx-[15px]rounded-lg overflow-x-auto justify-center space-x-2 py-[8px]">
              <div onClick={() => handleCategoryChange({ target: { value: '' } })} className={`px-4 py-[6px] rounded-md cursor-pointer ${!selectedCategory ? 'bg-black text-white' : 'bg-gray-300'}`}>
                All Categories
              </div>
              {categories.map(category => (
                <div key={category.id} onClick={() => handleCategoryChange({ target: { value: category.id } })} className={`px-4 lg:hover:bg-gray-400 whitespace-nowrap py-[6px] hover:text-white font-bold transition duration-200 rounded-md cursor-pointer ${selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-300'}`}            >
                  {category.name}
                </div>
              ))}
            </div>

            <div className="scrollbar-hide flex mx-[5px] my-[10px] rounded-lg overflow-x-auto justify-center space-x-2 py-[8px]">
              <div onClick={() => handleSubcategoryChange({ target: { value: '' } })} className={`px-4 hover:bg-gray-400 hover:text-white font-bold transition duration-200  whitespace-nowrap flex items-center rounded-md cursor-pointer ${!selectedSubcategory ? 'bg-black text-white' : 'bg-gray-300'}`}>
                All Sub-Categories
              </div>

              {subcategories.filter(subcategory => !selectedCategory || subcategory.category_id === selectedCategory).map(subcategory => (
                <div key={subcategory.id} onClick={() => handleSubcategoryChange({ target: { value: subcategory.id } })}
                  className={`px-4 lg:hover:bg-gray-400 hover:text-white font-bold transition duration-200 whitespace-nowrap flex items-center py-2 rounded-md cursor-pointer ${selectedSubcategory === subcategory.id ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  {subcategory.name}
                </div>
              ))}
            </div>

          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-[95%] mx-auto place-items-center gap-y-[25px]'>
            {filteredProducts.map((product) => (
              <ProductData
                key={product.id}
                product={product}
                showSubcategory={true}
                subcategories={subcategories}
                viewSpecifications={viewSpecifications}
              />
            ))}
          </div>
        </div>)}
    </div>

  );
}
export default ClientProducts;
