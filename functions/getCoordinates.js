const axios = require('axios');

exports.handler = async function(event, context) {
  const placeId = event.path.split('/').pop();

  if (!placeId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing Place ID' }) };
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'geometry',
        key: process.env.GOOGLE_API_KEY
      }
    });

    const data = response.data;

    if (data.result && data.result.geometry && data.result.geometry.location) {
      const { lat, lng } = data.result.geometry.location;
      return {
        statusCode: 200,
        body: JSON.stringify({ latitude: lat, longitude: lng })
      };
    } else {
      return { statusCode: 404, body: JSON.stringify({ error: 'Location not found' }) };
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
