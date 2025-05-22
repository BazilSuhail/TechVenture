"use client"

import { useState, useEffect } from "react"
import { supabase } from "../Config/Config"
import { Link } from "react-router-dom"
import { Bars } from "react-loader-spinner"
import { FaRegCalendarPlus, FaStar, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { AiOutlineLike } from "react-icons/ai"

const TechToday = () => {
  const [topLikedProducts, setTopLikedProducts] = useState([])
  const [recentlyCreatedProducts, setRecentlyCreatedProducts] = useState([])
  const [recentlyCreatedReviews, setRecentlyCreatedReviews] = useState([])
  const [userNames, setUserNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [news, setNews] = useState([])
  const apiKey = "1330f7f3382c28ce768d06b7be4097a7"

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchNews = async () => {
      try {
        const response = await fetch(`https://api.mediastack.com/v1/news?access_key=${apiKey}&categories=technology`)

        const data = await response.json()
        console.log(data.data)
        console.log("Length is " + data.data.length)

        if (data.data.length > 0) {
          setNews(data.data)
          setTotalPages(Math.ceil(data.data.length / 6))
        } else {
          setNews([])
          setTotalPages(1)
          console.warn("No news data available")
        }
      } catch (error) {
        console.error("Error fetching news:", error)
      }
    }

    fetchNews()
  }, [apiKey])

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchTopLikedProducts = async () => {
          const { data: products, error } = await supabase.from("products").select("*")

          if (error) {
            throw error
          }

          const productsWithLikes = await Promise.all(
            products.map(async (product) => {
              const { data: likesData, error: likesError } = await supabase
                .from("product_likes")
                .select("user_id")
                .eq("product_id", product.id)

              if (likesError) {
                throw likesError
              }

              return { ...product, likes: likesData.length }
            }),
          )

          const sortedProducts = productsWithLikes.sort((a, b) => b.likes - a.likes).slice(0, 5)

          setTopLikedProducts(sortedProducts)
        }

        // Fetch top 5 recently created products
        const fetchRecentlyCreatedProducts = async () => {
          const { data: createdProducts, error: createdProductsError } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5)

          if (createdProductsError) throw createdProductsError

          setRecentlyCreatedProducts(createdProducts)
        }

        // Fetch top 5 recently created reviews
        const fetchRecentlyCreatedReviews = async () => {
          const { data: createdReviews, error: createdReviewsError } = await supabase
            .from("product_reviews")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5)

          if (createdReviewsError) throw createdReviewsError

          setRecentlyCreatedReviews(createdReviews)

          fetchUserNamesAndProductNames(createdReviews)
        }

        // Fetch user names and product names based on user IDs and product IDs in reviews
        const fetchUserNamesAndProductNames = async (reviews) => {
          const userIds = reviews.map((review) => review.user_id)

          const usersData = await Promise.all(
            userIds.map(async (userId) => {
              const { data: userData, error } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("user_id", userId)
                .single()

              if (error) {
                console.error("Error fetching user data:", error.message)
                return null
              }

              return { userId, userName: userData.full_name }
            }),
          )

          const userNamesMap = usersData.reduce((acc, curr) => {
            if (curr) {
              acc[curr.userId] = curr.userName
            }
            return acc
          }, {})
          setUserNames((prevNames) => ({ ...prevNames, ...userNamesMap }))
        }

        await fetchTopLikedProducts()
        await fetchRecentlyCreatedProducts()
        await fetchRecentlyCreatedReviews()

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error.message)
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const truncateDescription = (description) => {
    return description.length > 50 ? description.slice(0, 50) + "..." : description
  }

  const displayedNews = news.length > 0 ? news.slice((currentPage - 1) * 6, currentPage * 6) : []

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handlePageClick = (pageNum) => setCurrentPage(pageNum)

  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20 text-gray-800">
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-95px)]">
          <Bars height="50" width="50" color="#363636" ariaLabel="loading" visible />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center mt-8 mb-12 text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Catchout Tech Latest News
            </span>
          </h1>

          {displayedNews.length > 0 ? (
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedNews.map((article) => (
                  <div
                    key={article.url}
                    className="bg-white h-[520px] flex flex-col rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="h-56 overflow-hidden">
                      <img
                        src={article.image || "https://via.placeholder.com/150"}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-4">
                        {article.description || "No description available"}
                      </p>
                      <Link
                        to={article.url}
                        target="_blank"
                        className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors mt-auto group"
                      >
                        Read More
                        <FaExternalLinkAlt className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-10 space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  } transition-colors`}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageClick(index + 1)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        currentPage === index + 1
                          ? "bg-teal-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  } transition-colors`}
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          ) : (
            <p className="text-center text-lg text-gray-600">No Latest News Found...</p>
          )}

          {/* Stats Section */}
          <section className="py-16 px-4 bg-white rounded-2xl shadow-sm mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl md:text-6xl font-bold text-teal-600 mb-2">1500+</div>
                <div className="text-lg font-medium text-gray-600">Catalog Gadgets</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl md:text-6xl font-bold text-teal-600 mb-2">120</div>
                <div className="text-lg font-medium text-gray-600">Categories</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl md:text-6xl font-bold text-teal-600 mb-2">2500+</div>
                <div className="text-lg font-medium text-gray-600">Expert Reviewers</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl md:text-6xl font-bold text-teal-600 mb-2">150,000</div>
                <div className="text-lg font-medium text-gray-600">Reviews Made</div>
              </div>
            </div>
          </section>

          {/* Top 5 Most Liked Products */}
          <section className="mb-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">Top 5 Most Liked Products</h2>

              <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-6">
                {topLikedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-80 bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h3 className="px-4 py-3 bg-gray-700 text-white font-medium text-lg truncate">{product.name}</h3>

                    <div className="p-5">
                      <p className="text-gray-300 mb-6 line-clamp-3 h-20">{product.description}</p>

                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                          <div className="px-3 py-2 bg-teal-600 text-white">
                            <AiOutlineLike size={18} />
                          </div>
                          <p className="px-3 font-bold text-white">{product.likes}</p>
                        </div>

                        <div className="text-xl font-bold text-teal-400">${product.price.toFixed(2)}</div>
                      </div>

                      <Link
                        to={`/product-specifications/${product.id}`}
                        className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Review Gadget
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recently Launched Gadgets */}
          <section className="mb-16 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
                Recently Launched Gadgets
              </h2>

              <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-6">
                {recentlyCreatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h3 className="px-4 py-3 bg-gray-800 text-white font-medium text-lg truncate">{product.name}</h3>

                    <div className="p-5">
                      <p className="text-gray-700 mb-6 line-clamp-3 h-20">{product.description}</p>

                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                          <div className="px-3 py-2 bg-teal-600 text-white">
                            <FaRegCalendarPlus size={16} />
                          </div>
                          <p className="px-3 text-sm font-medium text-gray-700">
                            {new Date(product.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="text-xl font-bold text-teal-600">${product.price.toFixed(2)}</div>
                      </div>

                      <Link
                        to={`/product-specifications/${product.id}`}
                        className="block w-full text-center bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Review Gadget
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recently Published Reviews */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
              Recently Published Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentlyCreatedReviews.slice(0, 6).map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center font-semibold text-teal-700">
                        {userNames[review.user_id]?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-800">{userNames[review.user_id]}</div>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <FaStar
                              key={index}
                              className={`w-4 h-4 ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-4">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default TechToday
