import Image from "next/image";
import Link from "next/link";
import { ClockIcon, MoveLeftIcon } from "lucide-react";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";

import { Layout } from "@/shared/components/layout";
import { Badge } from "@/shared/components/ui/badge";
import { HoverCard } from "@/shared/components/ui/hover-card";
import { WeatherCard } from "@/shared/components/weather-card";
import { countriesClient } from "@/features/countries/countries-client";
import type { Country } from "@/features/countries/types";
import { useWeather } from "@/features/weather/use-weather";
import type { NextPageWithLayout } from "@/pages/_app";

export const getServerSideProps = (async (context) => {
  const name = context.query.name;
  if (!name || typeof name !== "string") {
    return { notFound: true };
  }

  try {
    const res = await countriesClient.get<Country[]>(
      `/name/${name}?fullText=true`
    );
    return {
      props: {
        country: res.data[0] || null,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{}>;

const Page: NextPageWithLayout<{ country: Country }> = ({ country }) => {
  const {
    isPending: loading,
    error,
    data: weather,
  } = useWeather(country.name.common);

  if (!country) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-center text-muted-foreground">
          Country could not be found
        </p>
      </div>
    );
  }

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
          <WeatherCard
            capital={country.capital[0]}
            weather={weather || null}
            loading={loading}
            error={error?.message || null}
          />
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
