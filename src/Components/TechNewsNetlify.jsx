const axios = require('axios');

exports.handler = async function(event, context) {
    const { q, pageSize } = event.queryStringParameters;

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: q || 'technology OR tech gadgets',
                apiKey: process.env.NEWS_API_KEY,
                pageSize: pageSize || 30
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch news' })
        };
    }
};
