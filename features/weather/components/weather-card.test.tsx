import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { WeatherCard } from './weather-card';
import type { WeatherData } from '../types';

describe('WeatherCard', () => {
  const mockWeather: WeatherData = {
    current: {
      temperature_2m: 25.5,
      weather_code: 0,
      wind_speed_10m: 15,
    },
  };

  it('should display loading state', () => {
    render(<WeatherCard capital='Berlin' weather={null} loading={true} error={null} />);
    expect(screen.getByText('Loading weather data…')).toBeDefined();
  });

  it('should display error message', () => {
    render(<WeatherCard capital='Berlin' weather={null} loading={false} error='Failed to fetch' />);
    expect(screen.getByText('Failed to fetch')).toBeDefined();
  });

  it('should display weather data correctly when loaded', () => {
    render(<WeatherCard capital='Berlin' weather={mockWeather} loading={false} error={null} />);

    expect(screen.getByText('Weather in Berlin')).toBeDefined();
    expect(screen.getByText('25.5°C')).toBeDefined();
    expect(screen.getByText('15 km/h')).toBeDefined();
    expect(screen.getByText('Clear')).toBeDefined();
  });

  it('should handle unknown weather codes gracefully', () => {
    const unknownWeather = {
      ...mockWeather,
      current: { ...mockWeather.current, weather_code: 999 },
    };
    render(<WeatherCard capital='Berlin' weather={unknownWeather} loading={false} error={null} />);

    expect(screen.getByText('Unknown')).toBeDefined();
  });

  it('should display fallback when no weather data and no loading/error', () => {
    render(<WeatherCard capital='Berlin' weather={null} loading={false} error={null} />);
    expect(screen.getByText('Weather could not be loaded')).toBeDefined();
  });
});
