# AI Failure Audit & Resolution Log
*(Lab 4 - Full-Stack React Systems & Multi-Route Architecture)*

---

## Homework 1 - Swipe Deck SPA

### 1. Mongoose 8 Deprecated Connection Flags
- **AI Hallucination:** The AI initially suggested using legacy connection flags such as `mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })`.
- **Resolution:** Updated to modern Mongoose 8 standards by removing all deprecated flags to strictly follow the Lab 4 Contract. Implemented the connection cleanly using `mongoose.connect(URI)`.

### 2. React Router v5 Routing Syntax
- **AI Hallucination:** The AI recommended using `<Switch>` and `<Route component={...}>` which belong to the deprecated React Router v5.
- **Resolution:** Refactored the code to use `<Routes>` and `<Route element={<Component />}>` as per React Router v7 standards. Resolved the `useRoutes()` context error by wrapping the root `<App />` with `<BrowserRouter>` in `main.tsx`.

### 3. Unhandled Promise Rejection in API POST
- **AI Hallucination:** The AI generated an asynchronous POST fetch request (`/api/swipe`) without a `try/catch` block.
- **Resolution:** Implemented a `try/catch` block around the asynchronous fetch call to adhere to the Full-Stack Verification Contract and prevent unhandled promise rejections during network failures.

---

## Homework 2 - Esports Fair-Play Appeal Tribunal

### 1. Unvalidated Verdict Status Transitions
- **AI Hallucination:** Suggested updating `status` directly from `req.body.status` without validating allowed verdict states (`UPHELD` / `OVERTURNED`) or running Mongoose schema validators on update.
- **Resolution:** Enforced an explicit allowlist check (`['UPHELD', 'OVERTURNED']`) and enabled `runValidators: true` with `new: true` in `PATCH /api/appeals/:id/verdict`.

### 2. Mutable Count State vs. Derived Summary Counters
- **AI Hallucination:** Proposed storing separate `pendingCount`, `upheldCount`, and `overturnedCount` states updated manually inside every create, filter, and verdict handler, risking state drift.
- **Resolution:** Computed `pendingCount`, `upheldCount`, and `overturnedCount` as pure derived values from `appeals` during the render pass so summary counters always stay consistent with persisted records.

### 3. Missing Router Context & Package Drift After Vite Scaffold
- **AI Hallucination:** Generated route components assuming `<BrowserRouter>` was already mounted at the root and overlooked dependency resets when scaffolding with `npm create vite`.
- **Resolution:** Wrapped `<App />` with `<BrowserRouter>` in `homework2/src/main.tsx`, defined routes via `<Routes>` and `<Route>` in `App.tsx`, and reinstalled `react-router` and `react-router-dom` cleanly in `homework2/`.

---

## Homework 3 Audit — Photo & Evidence Gallery SPA (`useSearchParams` & `<dialog>`)

1. **Duplicate / Conflicting Modal State (`useState` + `photoId` query param):**
   - *Failure Risk:* Storing a separate `isOpen` boolean in `useState` alongside `searchParams.get('photoId')` causes URL and modal state to drift on browser back/forward or page reload.
   - *Fix / Engineering Rule:* Derive `selectedPhotoId` directly from `useSearchParams()` and drive `<dialog>` via `showModal()` / `close()` inside `useEffect`, clearing `photoId` in `onClose`.

2. **Non-Modal `<div>` Popups Instead of Native `<dialog>`:**
   - *Failure Risk:* Custom `div` overlays often miss native `Esc` dismissal, backdrop isolation, and focus management.
   - *Fix / Engineering Rule:* Use native HTML `<dialog ref={dialogRef} onClose={...}>` with explicit focus handling on the close button and `aria-labelledby`.

3. **Outdated React Router v5 / Unlabelled Controls:**
   - *Failure Risk:* Using legacy `<Switch>` or unlabelled icon/close buttons (`aria-label` missing) harms routing and accessibility.
   - *Fix / Engineering Rule:* Use React Router v7 `<Routes>` / `<Route>` and explicit `aria-label` / `aria-pressed` attributes on interactive controls.