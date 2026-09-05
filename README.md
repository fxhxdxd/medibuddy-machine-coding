# MediBuddy Machine Coding

This is a React-based medicine search application built using Vite, Tailwind CSS and shadcn.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vite

## How to Use

1. Search for a medicine by its brand name.
2. Select a result to view its details.
3. Use the Back button to return to the search results.

## Run Locally

```bash
npm install
npm run dev
```

## Trade-offs

- The app uses the public openFDA API directly to keep the setup simple, so it depends on the API being available.
- The code is kept in a small number of components. In a larger app, repeated loading and error states could be moved into reusable components.

## If I Had More Time

- I would improve API handling by adding timeouts and showing more specific error messages.
- I would add tests for loading, empty, error, retry, and medicine detail states.
- I would improve the UI and check the experience across more screen sizes.
