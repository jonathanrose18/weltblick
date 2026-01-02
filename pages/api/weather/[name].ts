import type { NextApiRequest, NextApiResponse } from "next";

import { NotFoundError } from "@/shared/lib/errors";
import { getWeatherForCountry } from "@/features/weather/weather-service";
import type { WeatherData } from "@/features/weather/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherData | { message: string }>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Country name is required" });
  }

  try {
    const weatherData = await getWeatherForCountry(name);
    return res.status(200).json(weatherData);
  } catch (error: unknown) {
    console.error("API Error:", error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }

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
