import Image from "next/image";
import Link from "next/link";
import { ClockIcon, CloudIcon, MoveLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { HoverCard } from "@/shared/components/ui/hover-card";
import { Layout } from "@/shared/components/layout";
import { countriesClient } from "@/shared/countries/countries-client";
import type { NextPageWithLayout } from "@/pages/_app";

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png: string;
    svg: string;
  };
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  timezones?: string[];
  continents?: string[];
  capitalInfo?: {
    latlng: [number, number];
  };
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  landlocked: boolean;
  cca2: string;
}

interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

export const getServerSideProps = (async (context) => {
  const res = await countriesClient.get(
    `/name/${context.query.name}?fullText=true`
  );

  return {
    props: {
      country: res.data[0] || null,
    },
  };
}) satisfies GetServerSideProps<{}>;

const Page: NextPageWithLayout<{ country: Country }> = ({ country }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "/api/weather/" + country.name.common.toLocaleLowerCase()
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Weather fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [country]);

  if (!country) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-center text-muted-foreground">
          Country could not be found
        </p>
      </div>
    );
  }

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
    };

    return weatherCodes[code] || "Unknown";
  };

  return (
    <>
      <div className="mb-4">
        <Link
          className="text-primary gap-2 flex flex-row items-center hover:underline mb-4"
          href="/"
        >
          <MoveLeftIcon size={16} /> Back to overview
        </Link>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden border shadow-lg">
            <Image
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="object-cover"
              fill
              src={country.flags.png}
            />
          </div>

          <div className="flex-1">
            <div className="flex mb-2 flex-col">
              <span>{country.name.common}</span>
              <span className="text-sm text-balance text-muted-foreground">
                {country.name.official}
              </span>
            </div>
            {country.continents?.map((continent) => (
              <Badge key={continent}>{continent}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {country.capital && country.capital[0] && (
          <HoverCard hoverable={false}>
            <div className="flex items-center gap-2 mb-2">
              <CloudIcon className="w-5 h-5" />
              Weather in {country.capital[0]}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading weather data…</p>
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
              <p className="text-muted-foreground">
                Weather could not be loaded
              </p>
            )}
          </HoverCard>
        )}

        {country.timezones && country.timezones.length > 0 && (
          <HoverCard hoverable={false}>
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-5 h-5" />
              Timezone
            </div>
            {country.timezones.map((timezone) => (
              <Badge key={timezone} variant="outline">
                {timezone}
              </Badge>
            ))}
          </HoverCard>
        )}
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
