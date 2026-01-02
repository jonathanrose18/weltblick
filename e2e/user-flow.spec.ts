import { test, expect } from '@playwright/test';

test.describe('User Flow', () => {
  // We can mock the API responses to ensure stable testing without external dependency
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/weather/germany', async route => {
      const json = {
        current: {
          temperature_2m: 25,
          weather_code: 0,
          wind_speed_10m: 10,
        },
      };
      await route.fulfill({ json });
    });

    await page.route('**/v3.1/name/germany*', async route => {
      const json = [
        {
          name: { common: 'Germany', official: 'Federal Republic of Germany' },
          flags: {
            png: 'https://flagcdn.com/w320/de.png',
            alt: 'Flag of Germany',
          },
          capital: ['Berlin'],
        },
      ];
      await route.fulfill({ json });
    });
  });

  test('should navigate to country page and show weather', async ({ page }) => {
    // 1. Start at home
    await page.goto('/');

    // 2. Click on a country link (assuming Germany is in the list or we can search/click it)
    // Since the main page fetches /all, we might rely on the real list or we should mock /all as well.
    // Let's assume the real list loads Germany. In a strict E2E, we might want to mock /all too.
    // For simplicity, let's navigate directly or checking if we can find Germany.

    // Let's mock the /restcountries/v3.1/all call to be safe and fast.
    await page.route('**/v3.1/all*', async route => {
      const json = [
        {
          name: { common: 'Germany', official: 'Federal Republic of Germany' },
          flags: {
            png: 'https://flagcdn.com/w320/de.png',
            alt: 'Flag of Germany',
          },
          capital: ['Berlin'],
        },
      ];
      await route.fulfill({ json });
    });

    // Reload to pick up the mock
    await page.reload();

    await expect(page.getByText('Germany')).toBeVisible();
    await page.getByText('Germany').click();

    // 3. Verify URL
    await expect(page).toHaveURL(/\/countries\/germany/i);

    // 4. Verify Content
    await expect(page.getByText('Weather in Berlin')).toBeVisible();
    await expect(page.getByText('25°C')).toBeVisible();
  });
});
