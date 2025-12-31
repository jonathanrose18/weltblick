import { countriesClient } from "@/features/countries/countries-client";
import { weatherClient } from "@/features/weather/weather-client";
import type { Country } from "@/features/countries/types";
import type { WeatherData } from "@/features/weather/types";

import { NotFoundError } from "@/shared/lib/errors";

export async function getWeatherForCountry(
  countryName: string
): Promise<WeatherData> {
  const sanitizedCountryName = countryName.trim().toLowerCase();
  const countriesResponse = await countriesClient.get<Country[]>(
    `/name/${sanitizedCountryName}?fullText=true`
  );

  const countryData = countriesResponse.data[0];
  const latlng = countryData?.capitalInfo?.latlng;

  if (!latlng || latlng.length !== 2) {
    throw new NotFoundError(
      `No location data found for country: ${sanitizedCountryName}`
    );
  }

  const [lat, lng] = latlng;

  const weatherResponse = await weatherClient.get<WeatherData>(`/forecast`, {
    params: {
      current: "temperature_2m,weather_code,wind_speed_10m",
      latitude: lat,
      longitude: lng,
    },
  });

  if (!weatherResponse.data) {
    throw new Error("Failed to fetch weather data");
  }

  return weatherResponse.data;
}
