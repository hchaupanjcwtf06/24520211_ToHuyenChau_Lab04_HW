# Lab 4 Homework 1 - Full-Stack Interactive Card-Swipe Deck ('Hẹn Hò Nhưng Không Yêu')

Full-stack interactive swipe-deck application built with React, TypeScript, Vite, Tailwind CSS v3, and React Router v7 on the frontend, paired with an Express and Mongoose 8 REST API backed by MongoDB Atlas.

## Architecture & Key Features

- **Frontend (`homework1/src/`):** React + TypeScript + Vite with React Router v7 (`<BrowserRouter>`, `<Routes>`), Tailwind CSS v3 dark mode UI, dynamic drag-to-swipe pointer physics, keyboard/pointer swipe handlers, a LIFO undo stack (`Backspace`), and asymmetric score calculation computed via derived state.
- **Backend (`homework1/backend/`):** Node.js, Express, and Mongoose 8 (`mongoose.connect(process.env.MONGODB_URI)` without deprecated flags), exposing `GET /api/profiles` (optimized with `.lean()`) and `POST /api/swipe` with `try/catch` payload validation, plus `seed.js` to populate sample profiles.

## Project Structure

- `homework1/backend/server.js` — Express server, Mongoose schemas, and `/api/profiles` & `/api/swipe` routes.
- `homework1/backend/seed.js` — Seed script for initial swipe-deck profiles.
- `homework1/src/main.tsx` — Entry point mounting `<App />` inside `<BrowserRouter>`.
- `homework1/src/App.tsx` — Swipe deck UI, pointer/keyboard controls, undo stack, and derived score logic.

## Running Locally

### 1. Backend API

Configure `MONGODB_URI` in `homework1/backend/.env`, then run:

```bash
cd homework1/backend
npm install
node seed.js
node server.js