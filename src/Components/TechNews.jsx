import React, { useEffect, useState } from 'react';
import { Bars } from 'react-loader-spinner';
import axios from 'axios';

const TechNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 6;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/.netlify/functions/fetchNews', {
                    params: {
                        q: 'technology OR tech gadgets',
                        pageSize: 30
                    }
                });
                setNews(response.data.articles);
            } catch (err) {
                setError('Failed to fetch news');
            } finally {
                setLoading(false);
            }
        };
        

        fetchNews();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(news.length / resultsPerPage);
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={i === currentPage ? 'bg-white text-black rounded-md px-[10px]' : 'px-[10px]'}
                >
                    {i}
                </button>
            );
        }

        return <div className="pagination">{pages}</div>;
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = news.slice(indexOfFirstResult, indexOfLastResult);


    const truncateTitle = (description) => {
        return description.length > 30 ? description.slice(0, 30) + '...' : description;
    };
    const truncateDescription = (description) => {
        return description.length > 150 ? description.slice(0, 150) + '...' : description;
    };
    return (
        <div>
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
            ) : error ? (
                <div className="p-[15px] rounded-lg text-red-600 mx-auto border-2 border-red-600">{error}</div>
            ) : news.length === 0 ? (
                <div className="p-[15px] rounded-lg text-red-600 mx-auto border-2 border-red-600">No news found</div>
            ) : (
                <div>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-[95%] mx-auto place-items-center gap-y-[25px]'>
                        {currentResults.map((article, index) => (
                            <div key={index} className='flex flex-col justify-center border-2 border-gray-400 rounded-lg h-[95%] w-[95%] p-[15px] m-[6px]'>

                                {article.urlToImage ? (
                                    <img src={article.urlToImage} className='w-[350px] h-[200px] rounded-md mx-auto my-[25px]' alt={article.title} />
                                ) : (
                                    <div className='w-[350px] mx-auto my-[25px] flex flex-col items-center justify-center rounded-lg bg-gray-400 h-[250px]'>
                                        <div className='w-[300px] flex flex-col items-center justify-center rounded-lg bg-gray-300 h-[200px]'>
                                            <div className='w-[250px] flex flex-col items-center justify-center rounded-lg bg-gray-200 h-[150px]'>
                                                <div className='w-[180px] flex flex-col items-center justify-center rounded-lg bg-gray-50 h-[90px]'></div>
                                            </div>
                                        </div>
                                    </div>

                                )}

                                <h3 className='px-[6px] py-[16px] border-2 mt-[8px] font-bold text-center text-2xl border-gray-300 rounded-lg'>{truncateTitle(article.title)}</h3>
                                <p className='font-bold py-[25px] text-md text-gray-500'>{truncateDescription(article.description)}</p>
                                <button
                                    onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                                    className='bg-gray-800 text-white rounded-lg p-[10px] font-bold hover:bg-gray-500 transition duration-[200ms]'
                                >
                                    Checkout
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className='w-[90%] text-[25px] py-[9px] mx-auto text-center bg-black text-white rounded-xl'>{renderPagination()}</div>
                </div>
            )}
        </div>
    );
};

export default TechNews;
