import { describe, expect, it } from 'vitest';

import { sortCountriesByName } from './utils';
import type { Country } from './types';

describe('sortCountriesByName', () => {
  it('should sort countries alphabetically by common name', () => {
    const input: Country[] = [
      {
        name: { common: 'Germany', official: 'Federal Republic of Germany' },
        flags: { png: '', alt: '', svg: '' },
        capital: ['Berlin'],
      },
      {
        name: { common: 'Australia', official: 'Commonwealth of Australia' },
        flags: { png: '', alt: '', svg: '' },
        capital: ['Canberra'],
      },
      {
        name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
        flags: { png: '', alt: '', svg: '' },
        capital: ['Brasília'],
      },
    ] as unknown as Country[];

    const sorted = sortCountriesByName(input);

    expect(sorted[0].name.common).toBe('Australia');
    expect(sorted[1].name.common).toBe('Brazil');
    expect(sorted[2].name.common).toBe('Germany');
  });

  it('should handle empty array', () => {
    const input: Country[] = [];
    const sorted = sortCountriesByName(input);
    expect(sorted).toEqual([]);
  });
  it('should not mutate the original array', () => {
    const input: Country[] = [
      { name: { common: 'B', official: 'B' }, flags: { png: '', alt: '', svg: '' }, capital: [] },
      { name: { common: 'A', official: 'A' }, flags: { png: '', alt: '', svg: '' }, capital: [] },
    ] as unknown as Country[];
    const originalInput = [...input];
    sortCountriesByName(input);
    expect(input).toEqual(originalInput);
  });

  it('should handle special characters correctly', () => {
    const input: Country[] = [
      {
        name: { common: 'Österreich', official: 'Republic of Austria' },
        flags: { png: '', alt: '', svg: '' },
        capital: [],
      },
      {
        name: { common: 'Australia', official: 'Commonwealth of Australia' },
        flags: { png: '', alt: '', svg: '' },
        capital: [],
      },
    ] as unknown as Country[];
    const sorted = sortCountriesByName(input);
    expect(sorted[0].name.common).toBe('Australia');
    expect(sorted[1].name.common).toBe('Österreich');
  });

  it('should handle single element array', () => {
    const input: Country[] = [
      {
        name: { common: 'Germany', official: 'Federal Republic of Germany' },
        flags: { png: '', alt: '', svg: '' },
        capital: [],
      },
    ] as unknown as Country[];
    const sorted = sortCountriesByName(input);
    expect(sorted).toEqual(input);
  });
});
