# Lab 4 Homework 2 - Esports Fair-Play Appeal Tribunal

Full-stack web application for reviewing esports fair-play appeals, inspecting player dossiers via dynamic routing (`/dossier/:playerID`), and recording verdicts (`UPHELD` / `OVERTURNED`) backed by Express and Mongoose 8.

## Architecture & Key Features

- **Backend (`homework2/backend/`):** Node.js, Express, and Mongoose 8 (`mongoose.connect(...)` without deprecated connection flags) exposing appeal endpoints (`GET /api/appeals`, `POST /api/appeals`, `PATCH /api/appeals/:id/verdict`) on port `3001`, with `seed.js` for sample data.
- **Frontend (`homework2/src/`):** React with TypeScript, Vite, Tailwind CSS v3, and React Router v7 (`<BrowserRouter>`, `<Routes>`, `<Route>`, `useParams()`, `<Link>`, and `useNavigate()`).
- **Derived State & Validation:** Summary counters (`Pending`, `Upheld`, `Overturned`) are computed directly from `appeals` state during render, and verdict updates validate allowed statuses (`UPHELD` / `OVERTURNED`) with `runValidators: true`.

## Project Structure

- `homework2/backend/server.js` — Express API server, Mongoose schema, and CRUD/verdict routes.
- `homework2/backend/seed.js` — Script to seed initial esports appeal cases into MongoDB.
- `homework2/backend/.env.example` — Environment variable template (`MONGODB_URI`).
- `homework2/src/main.tsx` — Root entry mounting `<App />` inside `<BrowserRouter>`.
- `homework2/src/App.tsx` — `TribunalDashboard` and dynamic `PlayerDossierView` (`/dossier/:playerID`).

## Running Locally

### 1. Backend API (Port 3001)

Configure `homework2/backend/.env` with your `MONGODB_URI`, then run:

```bash
cd homework2/backend
npm install
node seed.js
node server.js