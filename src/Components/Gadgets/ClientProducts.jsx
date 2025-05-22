"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../Config/Config"
import { useNavigate } from "react-router-dom"
import ProductData from "./ItemData"
import { IoIosSearch } from "react-icons/io"
import { motion } from "framer-motion"
import { FiFilter, FiX } from "react-icons/fi"

function ClientProducts() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      window.scrollTo(0, 0)
      try {
        const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*")
        const { data: subcategoriesData, error: subcategoriesError } = await supabase.from("subcategories").select("*")
        const { data: productsData, error: productsError } = await supabase.from("products").select("*")

        if (categoriesError || subcategoriesError || productsError) {
          throw new Error("Failed to fetch data")
        }

        setCategories(categoriesData || [])
        setSubcategories(subcategoriesData || [])
        setProducts(productsData || [])
        setFilteredProducts(productsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products]

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(
          (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
        )
      }

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter((product) => {
          const subcategory = subcategories.find((sc) => sc.id === product.subcategory_id)
          return subcategory && subcategory.category_id === selectedCategory
        })
      }

      // Filter by subcategory
      if (selectedSubcategory) {
        filtered = filtered.filter((product) => product.subcategory_id === selectedSubcategory)
      }

      setFilteredProducts(filtered)
    }

    filterProducts()
  }, [selectedCategory, selectedSubcategory, products, subcategories, searchQuery])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory("")
  }

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId)
  }

  const viewSpecifications = (productId) => {
    navigate(`/product-specifications/${productId}`)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedSubcategory("")
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[85px]">
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-85px)]">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-6 xl:px-24 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              />
              <IoIosSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={24} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle (Mobile) */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilters}
              className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <FiFilter className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filters Section */}
          <div className={`mb-8 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              {(selectedCategory || selectedSubcategory) && (
                <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-black flex items-center">
                  <FiX className="mr-1" /> Clear filters
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    !selectedCategory
                      ? "bg-black text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-black text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {(selectedCategory || subcategories.length > 0) && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Subcategories</h3>
                <div className="flex  overflow-auto gap-2">
                  <button
                    onClick={() => handleSubcategoryChange("")}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      !selectedSubcategory
                        ? "bg-black text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    All Subcategories
                  </button>
                  {subcategories
                    .filter((subcategory) => !selectedCategory || subcategory.category_id === selectedCategory)
                    .map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => handleSubcategoryChange(subcategory.id)}
                        className={`px-4 py-2 min-w-[180px] text-sm font-medium rounded-full transition-all duration-300 ${
                          selectedSubcategory === subcategory.id
                            ? "bg-black text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-medium">{filteredProducts.length}</span> products
              {selectedCategory &&
                ` in ${categories.find((cat) => cat.id === selectedCategory)?.name || "selected category"}`}
              {selectedSubcategory &&
                ` > ${
                  subcategories.find((subcat) => subcat.id === selectedSubcategory)?.name || "selected subcategory"
                }`}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductData
                    product={product}
                    showSubcategory={true}
                    subcategories={subcategories}
                    viewSpecifications={viewSpecifications}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <IoIosSearch className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your criteria. Try adjusting your filters or search query.
              </p>
              <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ClientProducts
