const axios = require('axios');

exports.handler = async function(event, context) {
  const input = event.queryStringParameters.input;
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: process.env.GOOGLE_API_KEY
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error finding autocomplete options', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error finding autocomplete options' })
    };
  }
};