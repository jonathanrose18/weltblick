import type { Country } from './types';

export function sortCountriesByName(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common));
}

export function getCurrentTimeInTimezone(timezone: string, now: Date = new Date()): string {
  if (timezone === 'UTC') {
    return now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
  }

  const match = timezone.match(/^UTC([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    return '';
  }

  const [_, sign, hoursStr, minutesStr] = match;
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const offsetTotalMinutes = (hours * 60 + minutes) * (sign === '+' ? 1 : -1);
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const targetTime = new Date(utcTime + offsetTotalMinutes * 60000);

  return targetTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
