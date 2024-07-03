import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import ProductData from './ProductData';

function ClientProducts() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
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

  return (
    <div className='pt-[82px]'>
      <div><button onClick={() => { navigate("/searchprojects") }} >Search Projects</button></div>
      <div>

        <h2 className='text-custom-blue text-xl font-bold p-[8px] rounded-2xl'>Filter By Category</h2>
        <div className="flex font-bold mx-[15px] rounded-lg overflow-x-auto justify-center space-x-2 py-[8px]">
          <div
            className={`px-4 py-2 rounded-md cursor-pointer ${!selectedCategory ? 'bg-black text-white' : 'bg-gray-300'}`}
            onClick={() => handleCategoryChange({ target: { value: '' } })}
          >
            All Categories
          </div>
          {categories.map(category => (
            <div
              key={category.id}
              className={`px-4 hover:bg-gray-400 hover:text-white font-bold transition duration-200  py-2 rounded-md cursor-pointer ${selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-300'}`}
              onClick={() => handleCategoryChange({ target: { value: category.id } })}
            >
              {category.name}
            </div>
          ))}
        </div>
        <div className="scrollbar-hide flex mx-[5px] my-[10px] rounded-lg overflow-x-auto justify-center space-x-2 py-[8px]">
          <div
            className={`px-4 hover:bg-gray-400 hover:text-white font-bold transition duration-200  whitespace-nowrap flex items-center rounded-md cursor-pointer ${!selectedSubcategory ? 'bg-black text-white' : 'bg-gray-300'}`}
            onClick={() => handleSubcategoryChange({ target: { value: '' } })}
          >
            All Sub-Categories
          </div>
          {subcategories
            .filter(subcategory => !selectedCategory || subcategory.category_id === selectedCategory)
            .map(subcategory => (
              <div
                key={subcategory.id}
                className={`px-4 hover:bg-gray-400 hover:text-white font-bold transition duration-200 whitespace-nowrap flex items-center py-2 rounded-md cursor-pointer ${selectedSubcategory === subcategory.id ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => handleSubcategoryChange({ target: { value: subcategory.id } })}
              >
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
            showSubcategory = {true}
            subcategories={subcategories}
            viewSpecifications={viewSpecifications}
          />
        ))}
      </div>
    </div>
  );
}

export default ClientProducts;
