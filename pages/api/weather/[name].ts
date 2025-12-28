import type { NextApiRequest, NextApiResponse } from "next";

import { weatherClient } from "@/shared/weather/weather-client";
import { countriesClient } from "@/shared/countries/countries-client";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const countryName = req.query.name;

  if (!countryName) {
    res.status(400).end();
    return;
  }

  const countriesResponse = await countriesClient.get(
    `/name/${(req.query.name as string).toLocaleLowerCase()}?fullText=true`
  );

  const latlng = countriesResponse.data[0]?.capitalInfo?.latlng || null;

  console.log({ latlng });

  if (!latlng) {
    res.status(404).end();
    return;
  }

  const [lat, lng] = latlng;

  if (!lat || !lng) {
    res.status(400).end();
    return;
  }

  const weatherResponse = await weatherClient.get(
    `/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m`
  );
  const weather = weatherResponse.data;

  res.status(200).json(weather);
}
