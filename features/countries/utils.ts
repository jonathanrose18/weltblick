import type { Country } from "./types";

export function sortCountriesByName(countries: Country[]): Country[] {
  return [...countries].sort((a, b) =>
    a.name.common.localeCompare(b.name.common),
  );
}
