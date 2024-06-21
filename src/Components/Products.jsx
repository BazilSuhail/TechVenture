import React, { useState, useEffect } from 'react';
import { supabase } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

function Products() {
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
    <div>
      <div><button onClick={()=>{navigate("/searchprojects")}} >Search Projects</button></div>
      <h2>Products</h2>
      <div>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={selectedSubcategory} onChange={handleSubcategoryChange}>
          <option value="">All Subcategories</option>
          {subcategories
            .filter(subcategory => !selectedCategory || subcategory.category_id === selectedCategory)
            .map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Subcategory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{subcategories.find(subcategory => subcategory.id === product.subcategory_id)?.name}</td>
              <td>
                <button onClick={() => viewSpecifications(product.id)}>View Specifications</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
