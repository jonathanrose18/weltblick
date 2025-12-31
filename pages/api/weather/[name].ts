import type { NextApiRequest, NextApiResponse } from "next";

import { countriesClient } from "@/shared/countries/countries-client";
import { weatherClient } from "@/shared/weather/weather-client";
import type { WeatherData } from "@/shared/types";

type ResponseData = WeatherData | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Country name is required" });
  }

  const sanitizedCountryName = name.trim().toLowerCase();

  try {
    const countriesResponse = await countriesClient.get(
      `/name/${sanitizedCountryName}?fullText=true`
    );

    const countryData = countriesResponse.data[0];
    const latlng = countryData?.capitalInfo?.latlng;

    if (!latlng || latlng.length !== 2) {
      console.warn(
        `No location data found for country: ${sanitizedCountryName}`
      );
      return res.status(404).json({ message: "Location data not found" });
    }

    const [lat, lng] = latlng;

    const weatherResponse = await weatherClient.get(`/forecast`, {
      params: {
        latitude: lat,
        longitude: lng,
        current: "temperature_2m,weather_code,wind_speed_10m",
      },
    });

    if (!weatherResponse.data) {
      throw new Error("Failed to fetch weather data");
    }

    const weather: WeatherData = weatherResponse.data;

    return res.status(200).json(weather);
  } catch (error: unknown) {
    console.error("API Error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as any).response?.status === 404
    ) {
      return res.status(404).json({ message: "Country not found" });
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: errorMessage });
  }
}
