import type { Context } from "@netlify/functions";
import axios from "axios";

export default async (req: Request, context: Context) => {
  const { departureAirport, arrivalAirport } = await req.json();

  if (!departureAirport || !arrivalAirport) {
    return new Response(JSON.stringify({ error: "Departure and Arrival Airports must be provided" }), { status: 400 });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${departureAirport}&destinations=place_id:${arrivalAirport}&key=${Netlify.env.get("GOOGLE_API_KEY")}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status !== "OK" || data.rows[0].elements[0].status !== "OK") {
      return new Response(JSON.stringify({ error: "Error calculating distance", details: data }), { status: 400 });
    }

    const distanceInfo = data.rows[0].elements[0];
    return new Response(JSON.stringify({
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: distanceInfo.distance.text,
      distanceInMeters: distanceInfo.distance.value,
      duration: distanceInfo.duration.text,
      durationInSeconds: distanceInfo.duration.value,
    }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error calculating distance from Google Maps API:", error);
    return new Response(JSON.stringify({ error: "Error calculating distance" }), { status: 500 });
  }
};