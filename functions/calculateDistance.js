const axios = require('axios');

exports.handler = async function(event, context) {
  const { departureAirport, arrivalAirport } = JSON.parse(event.body);

  if (!departureAirport || !arrivalAirport) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Departure and Arrival Airports must be provided' })
    };
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${departureAirport}&destinations=place_id:${arrivalAirport}&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status !== 'OK') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Error fetching distance data', details: data }) };
    }

    const distanceInfo = data.rows[0].elements[0];

    if (distanceInfo.status !== 'OK') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Error calculating distance', details: distanceInfo }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        origin: data.origin_addresses[0],
        destination: data.destination_addresses[0],
        distance: distanceInfo.distance.text,
        distanceInMeters: distanceInfo.distance.value,
        duration: distanceInfo.duration.text,
        durationInSeconds: distanceInfo.duration.value
      })
    };
  } catch (error) {
    console.error('Error calculating distance:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error calculating distance' }) };
  }
};
