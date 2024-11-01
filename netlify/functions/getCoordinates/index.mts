import type { Context } from "@netlify/functions";
import axios from "axios";

export default async (req: Request, context: Context) => {
  const placeId = context.params.placeId;

  if (!placeId) {
    return new Response(JSON.stringify({ error: "Missing Place ID" }), { status: 400 });
  }

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: { place_id: placeId, fields: "geometry", key: Netlify.env.get("GOOGLE_API_KEY") }
    });

    const data = response.data;
    if (data.result && data.result.geometry && data.result.geometry.location) {
      const location = data.result.geometry.location;
      return new Response(JSON.stringify({ latitude: location.lat, longitude: location.lng }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Location not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const config = {
  path: "/getCoordinates/:placeId"
};