# AI Failure Audit & Resolution Log
*(Lab 4 - Homework 1: Swipe Deck SPA)*

## 1. Mongoose 8 Deprecated Connection Flags
- **AI Hallucination:** The AI initially suggested using legacy connection flags such as `mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })`.
- **Resolution:** Updated to modern Mongoose 8 standards by removing all deprecated flags to strictly follow the Lab 4 Contract. Implemented the connection simply using `mongoose.connect(URI)`[cite: 1].

## 2. React Router v7 Routing Syntax
- **AI Hallucination:** The AI recommended using `<Switch>` and `<Route component={...}>` which belong to the deprecated React Router v5[cite: 1].
- **Resolution:** Refactored the code to use `<Routes>` and `<Route element={<Component />}>` as per React Router v7 standards[cite: 1]. Resolved the `useRoutes()` context error by wrapping the root `<App />` with `<BrowserRouter>` in `main.tsx`.

## 3. Unhandled Promise Rejection in API POST
- **AI Hallucination:** The AI generated an asynchronous POST fetch request (`/api/swipe`) without a `try/catch` block.
- **Resolution:** Implemented a robust `try/catch` block around the asynchronous fetch call to adhere to the Full-Stack Verification Contract, preventing application crashes during network failures[cite: 1].