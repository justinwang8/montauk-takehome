import type { Context } from "@netlify/functions";
import axios from "axios";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const input = url.searchParams.get("input");

  if (!input) {
    return new Response(JSON.stringify({ error: "Input query parameter is required" }), { status: 400 });
  }

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
      params: { input, key: process.env.GOOGLE_API_KEY }
    });
    return new Response(JSON.stringify(response.data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error finding autocomplete options", error);
    return new Response(JSON.stringify({ error: "Error finding autocomplete options" }), { status: 500 });
  }
};