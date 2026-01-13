import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { useWeather } from './use-weather';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useWeather', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch weather data successfully', async () => {
    const mockData = { current: { temperature_2m: 20 } };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useWeather('Germany'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith('/api/weather/germany');
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useWeather('BorkedCountry'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should not fetch when country name is empty', () => {
    const { result } = renderHook(() => useWeather(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false); // Should stay in 'pending' or equivalent non-fetching state initially depending on React Query version but effectively 'idle' logic
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
