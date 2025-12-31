import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWeatherForCountry } from "./weather-service";
import { countriesClient } from "@/features/countries/countries-client";
import { weatherClient } from "@/features/weather/weather-client";
import type { Country } from "@/features/countries/types";
import { NotFoundError } from "@/shared/lib/errors";

// Mock the clients
vi.mock("@/features/countries/countries-client", () => ({
  countriesClient: {
    get: vi.fn(),
  },
}));

vi.mock("@/features/weather/weather-client", () => ({
  weatherClient: {
    get: vi.fn(),
  },
}));

describe("WeatherService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch weather data for a valid country name", async () => {
    // Mock Country Data
    const mockCountry: Partial<Country> = {
      name: { common: "Germany", official: "Federal Republic of Germany" },
      capitalInfo: { latlng: [51.0, 9.0] },
    };
    (countriesClient.get as any).mockResolvedValue({ data: [mockCountry] });

    // Mock Weather Data
    const mockWeather = {
      current: {
        temperature_2m: 20,
        weather_code: 1,
        wind_speed_10m: 10,
      },
    };
    (weatherClient.get as any).mockResolvedValue({ data: mockWeather });

    const result = await getWeatherForCountry("Germany");

    expect(countriesClient.get).toHaveBeenCalledWith(
      "/name/germany?fullText=true"
    );
    expect(weatherClient.get).toHaveBeenCalledWith(
      "/forecast",
      expect.objectContaining({
        params: expect.objectContaining({
          latitude: 51.0,
          longitude: 9.0,
        }),
      })
    );
    expect(result).toEqual(mockWeather);
  });

  it("should throw NotFoundError if country lookup fails", async () => {
    (countriesClient.get as any).mockRejectedValue({
      response: { status: 404 },
    });

    await expect(getWeatherForCountry("InvalidCountry")).rejects.toThrow();
  });

  it("should throw NotFoundError if country has no location data", async () => {
    const mockCountry: Partial<Country> = {
      name: { common: "Nowhere", official: "No Where" },
      capitalInfo: { latlng: undefined as any }, // No location
    };
    (countriesClient.get as any).mockResolvedValue({ data: [mockCountry] });

    await expect(getWeatherForCountry("Nowhere")).rejects.toThrow(
      NotFoundError
    );
  });

  it("should throw Error if weather fetch fails", async () => {
    // Mock Country Data
    const mockCountry: Partial<Country> = {
      name: { common: "Germany", official: "Federal Republic of Germany" },
      capitalInfo: { latlng: [51.0, 9.0] },
    };
    (countriesClient.get as any).mockResolvedValue({ data: [mockCountry] });

    (weatherClient.get as any).mockRejectedValue(new Error("Weather API Down"));

    await expect(getWeatherForCountry("Germany")).rejects.toThrow(
      "Weather API Down"
    );
  });
});
