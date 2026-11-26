# Lab 4 Homework 3 - Production Multi-Route Photo & Evidence Gallery SPA

Single-page photo and evidence gallery built with React, TypeScript, Vite, Tailwind CSS v3, and React Router v7, featuring URL-synchronized query parameters (`useSearchParams`) and a native HTML5 `<dialog>` lightbox modal.

## Key Features & Architecture

- **React Router v7 Routing (`homework3/src/main.tsx`, `homework3/src/App.tsx`):** Wraps the root `<App />` inside `<BrowserRouter>` and renders `PhotoGalleryLayout` via `<Routes>` and `<Route>`.
- **URL Search Params Deep Linking (`useSearchParams`):** Synchronizes category filtering (`?category=...`) and selected photo state (`?photoId=...`) directly with the browser URL query string without duplicating modal open state in `useState`.
- **Native HTML5 `<dialog>` Lightbox & WCAG 2.2 AA:** Binds `dialogRef` to `<dialog>`, toggles `showModal()` / `close()` inside `useEffect`, clears `photoId` on `onClose`, supports `Esc` dismissal, focuses the close control when opened, and uses `aria-pressed` and `aria-labelledby`.

## Project Structure

- `homework3/src/main.tsx` — Entry point mounting `<App />` inside `<BrowserRouter>`.
- `homework3/src/App.tsx` — `PhotoGalleryLayout`, URL search param helpers, category/keyword filtering, and `<dialog>` lightbox.
- `homework3/tailwind.config.js` & `homework3/postcss.config.js` — Tailwind CSS v3 configuration.

## Running Locally

```bash
cd homework3
npm install
npm run dev