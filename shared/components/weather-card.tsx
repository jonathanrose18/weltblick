import { CloudIcon } from "lucide-react";

import { HoverCard } from "@/shared/components/ui/hover-card";
import type { WeatherData } from "@/shared/types";

interface WeatherCardProps {
  capital: string;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const WeatherCard = ({
  capital,
  weather,
  loading,
  error,
}: WeatherCardProps) => {
  const getWeatherDescription = (code: number) => {
    const weatherCodes: Record<number, string> = {
      0: "Clear",
      1: "Mostly clear",
      2: "Partly cloudy",
      3: "Cloudy",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      61: "Light rain",
      80: "Rain showers",
      112: "Heavy rain",
    };

    return weatherCodes[code] || "Unknown";
  };

  return (
    <HoverCard hoverable={false}>
      <div className="flex items-center gap-2 mb-2">
        <CloudIcon className="w-5 h-5" />
        Weather in {capital}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading weather data…</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : weather ? (
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div>
              <p>{weather.current.temperature_2m}°C</p>
              <p className="text-xs text-muted-foreground">Temperature</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <p>{getWeatherDescription(weather.current.weather_code)}</p>
              <p className="text-xs text-muted-foreground">Conditions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <p>{weather.current.wind_speed_10m} km/h</p>
              <p className="text-xs text-muted-foreground">Wind speed</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Weather could not be loaded</p>
      )}
    </HoverCard>
  );
};
