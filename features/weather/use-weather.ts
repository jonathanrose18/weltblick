import { useQuery } from '@tanstack/react-query';

import type { WeatherData } from '@/features/weather/types';

export function useWeather(countryName: string) {
  return useQuery({
    queryKey: ['weather-' + countryName.toLowerCase()],
    queryFn: async (): Promise<WeatherData> => {
      const res = await fetch(`/api/weather/${countryName.toLowerCase()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch weather');
      }
      return res.json();
    },
    enabled: !!countryName,
  });
}
