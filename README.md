# weltblick

Minimal country explorer built with Next.js.

It shows a list of countries, then a detail page with:

- country info (name, flag, continent)
- current weather for the capital
- local times for the country timezones

Data comes from:

- [REST Countries](https://restcountries.com/)
- [Open-Meteo](https://open-meteo.com/)

## Tech

- Next.js (Pages Router) + React + TypeScript
- Axios for API requests
- Tailwind CSS + shadcn/ui components
- Vitest + Testing Library (unit/integration)
- Playwright (e2e)

## Project structure

```txt
pages/      Routes and API endpoints
features/   Domain logic (countries, weather)
shared/     Reusable UI, styles, and helpers
e2e/        End-to-end tests
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # biome check
npm run format   # biome format
npm run test     # vitest
npm run e2e      # playwright
```
