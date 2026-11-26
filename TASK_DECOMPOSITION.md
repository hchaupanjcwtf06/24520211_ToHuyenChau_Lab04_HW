## Lab 4 Homework 1 - Full-Stack Swipe Deck ('Hẹn Hò Nhưng Không Yêu')

### Phase 1 - Backend API & Persistence (Express + Mongoose 8)
- [x] T11: Configure Express server and Mongoose 8 connection with zero deprecated flags.
- [x] T12: Define Schema and implement GET `/api/profiles` endpoint optimized with `.lean()`.
- [x] T13: Implement POST `/api/swipe` endpoint with `try/catch` payload validation.
- [x] T14: Create `seed.js` script to populate MongoDB Atlas with stable image URLs.

### Phase 2 - Frontend Integration & Gestures
- [x] T15: Integrate Backend API to fetch profiles and POST swipe actions.
- [x] T16: Configure React Router v7 (`<BrowserRouter>` and `<Routes>`).
- [x] T17: Synchronize LIFO Undo Stack (Backspace) and compute Asymmetric Score via pure derived state.
- [x] T18: Implement dynamic drag-to-swipe physics (Pointer Events) and Tailwind CSS v3 dark mode UI.

### Phase 3 - Quality Gates & Audit
- [x] T19: Document AI hallucinations (React Router v5, Mongoose legacy flags) in `AI_FAILURE_AUDIT.md`.
- [x] T20: Capture final UI screenshot with Tailwind styling and compile into a single PDF submission.

---

## Progress Log - Lab 4 Homework 1

### Commit 1 - init: scaffold express backend setup for swipe deck
Status: Completed.
Scope: Initialized Node.js backend, installed express/mongoose/cors/dotenv, added .gitignore.

### Commit 2 - feat(backend): setup express server and mongoose 8 secure connection
Status: Completed.
Scope: Configured server.js, connected to MongoDB Atlas without deprecated flags.

### Commit 3 - feat(backend): implement mongoose schemas and GET/POST swipe endpoints
Status: Completed.
Scope: Added Profile/Swipe schemas, GET /api/profiles, POST /api/swipe.

### Commit 4 - build(frontend): configure React Router v7 and dependencies
Status: Completed.
Scope: Installed react-router, configured BrowserRouter in main.tsx.

### Commit 5 - feat(frontend): implement full SwipeDeck in App.tsx with TS and React Router v7
Status: Completed.
Scope: Built SwipeDeck UI, dual event listeners, Asymmetric Score logic, backend API integration.

### Commit 6 - chore(backend): add seed script to populate mock profiles
Status: Completed.
Scope: Wrote seed.js to inject initial data and fixed stable image URLs.

### Commit 7 - fix(frontend): sync react-router-dom imports and resolve routing context
Status: Completed.
Scope: Wrapped App in BrowserRouter to fix `useRoutes()` context error.

### Commit 8 - docs: add AI_FAILURE_AUDIT.md documenting resolutions
Status: Completed.
Scope: Documented Mongoose 8 and React Router v7 AI hallucinations.

### Commit 9 - build(frontend): install tailwind v3 and revamp SwipeDeck UI with animations
Status: Completed.
Scope: Configured Tailwind CLI, PostCSS, and applied basic Tinder-like UI styles.

### Commit 10 - feat(frontend): implement dynamic drag-to-swipe physics and dark mode theme
Status: Completed.
Scope: Added Pointer move events, dynamic inline transform rotations, LIKE/NOPE stamps, and dark slate theme.

### Commit 11 - docs: add PDF screenshot of SwipeDeck UI final result
Status: Completed.
Scope: Capture the newly styled UI and submit as PDF.

## Lab 4 Homework 2 - Esports Fair-Play Appeal Tribunal (Himass & TanVuu Case)

### Phase 1 - Backend API & Persistence (Express + Mongoose 8)
- [x] T21: Scaffold Express backend in `homework2/backend/` and configure Mongoose 8 connection without deprecated flags.
- [x] T22: Define Dossier and Appeal schemas with GET `/api/dossiers` and GET `/api/dossiers/:playerId` endpoints.
- [x] T23: Implement POST `/api/appeals` with payload validation and UUID generation, plus GET `/api/sla/:playerId` server-sync timer endpoint.
- [x] T24: Add `seed.js` script to populate esports fair-play dossiers for Himass and TanVuu.

### Phase 2 - Frontend Tribunal UI & Routing (React Router v7)
- [x] T25: Configure React Router v7 (`<Routes>`, `<Outlet />`, `useParams()`) for `/dossier/:playerID` dynamic routing.
- [x] T26: Build Context Form Engine (`FormContext`, `InputField`, `ShowData`) with synchronous derived validation in render pass (zero `useEffect` waterfall).
- [x] T27: Develop `useAppealSlaTimer()` hook with system timestamp delta and Page Visibility API (`document.addEventListener('visibilitychange')`) for zero-drift countdown.
- [x] T28: Implement `DisproportionalityMatrix` with derived state `useMemo(() => computeMatrix(dossierData))` comparing ban and fine ratios.

### Phase 3 - Quality Gates & Governance Audit
- [x] T29: Append HW2 AI hallucinations, waterfall loop fixes, and timer drift resolutions to `AI_FAILURE_AUDIT.md`.
- [x] T30: Document project overview, setup commands, and architectural contracts in `homework2/README.md`.

---

## Progress Log - Lab 4 Homework 2

### Commit 12 - docs: append WBS tasks for Lab 4 Homework 2 esports appeal tribunal
Status: Completed.
Scope: Defined T21-T30 breakdown covering backend dossiers, SLA timer sync, context form engine, and disproportionality matrix.

### Commit 13 - feat(hw2-backend): setup express server and mongoose 8 connection
Status: Completed.
Scope: Initialized Node.js backend on port 3001 with Mongoose 8 connection (zero deprecated flags) and `.env` validation.

### Commit 14 - feat(hw2-backend): add dossier/appeal schemas, SLA endpoint, and Himass/TanVuu seed script
Status: Completed.
Scope: Implemented GET `/api/dossiers`, GET `/api/dossiers/:playerId`, POST `/api/appeals`, GET `/api/sla/:playerId`, and `seed.js`.

### Commit 15 - feat(hw2-frontend): build tribunal SPA with React Router v7, FormContext, and SLA timer
Status: Completed.
Scope: Configured `/dossier/:playerID` routing with `useParams` and `<Outlet />`, synchronous derived validation in `FormContext`, and anti-drift `useAppealSlaTimer()`.

### Commit 16 - feat(hw2-frontend): implement DisproportionalityMatrix with memoized ratio calculations
Status: Completed.
Scope: Compute ban duration and financial penalty disproportionality ratios using `useMemo` in render pass.

### Commit 17 - docs(hw2): update AI_FAILURE_AUDIT.md, README.md, and final WBS status
Status: Status: Completed.
Scope: Document timer tab-drift, `useEffect` waterfall, and router fixes; add setup guide in `homework2/README.md` and final PDF evidence.