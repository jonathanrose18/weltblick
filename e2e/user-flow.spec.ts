import { test, expect } from "@playwright/test";

test.describe("User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/weather/germany", async (route) => {
      const json = {
        current: {
          temperature_2m: 25,
          weather_code: 0,
          wind_speed_10m: 10,
        },
      };
      await route.fulfill({ json });
    });

    await page.route("**/v3.1/name/germany*", async (route) => {
      const json = [
        {
          name: { common: "Germany", official: "Federal Republic of Germany" },
          flags: {
            png: "https://flagcdn.com/w320/de.png",
            alt: "Flag of Germany",
          },
          capital: ["Berlin"],
        },
      ];
      await route.fulfill({ json });
    });
  });

  test("should navigate to country page and show weather", async ({ page }) => {
    await page.goto("/");

    // assuming Germany is in the list or we can search/click it
    await page.route("**/v3.1/all*", async (route) => {
      const json = [
        {
          name: { common: "Germany", official: "Federal Republic of Germany" },
          flags: {
            png: "https://flagcdn.com/w320/de.png",
            alt: "Flag of Germany",
          },
          capital: ["Berlin"],
        },
      ];
      await route.fulfill({ json });
    });

    await page.reload();

    await expect(page.getByText("Germany")).toBeVisible();
    await page.getByText("Germany").click();

    await expect(page).toHaveURL(/\/countries\/germany/i);
    await expect(page.getByText("Weather in Berlin")).toBeVisible();
    await expect(page.getByText("25°C")).toBeVisible();
  });
});
