# Bonus Exercise - 'Hẹn Hò Nhưng Không Yêu' State Machine
## Task Decomposition & Work Breakdown Structure (WBS)

### Phase 1 - FSM Contract & State Specification
- [x] T01: Define RelationshipPhase FSM contract ('FRIENDS' | 'DATING_NO_LOVE' | 'OFFICIAL_LOVE' | 'GHOSTED_EXIT').
- [x] T02: Model Asymmetric Effort Formula ('Em cố 100 lần < Ai đó 1 phần') with immutable signal log.
- [x] T03: Write CLI test check-situationship-fsm.mjs to verify deterministic state transitions.

### Phase 2 - Advanced Reducer & Async Ping Simulation
- [x] T04: Implement FSM useReducer with legal transition matrix and transition guards (Commit 3).
- [x] T05: Implement cancelable message ping simulation with AbortController lifecycle (Commit 4).
- [x] T06: Add Web Audio synthesizer sound effects for red-flag alert and memory exit (Commit 5).

### Phase 3 - Signals Interaction & Visual Telemetry
- [x] T07: Implement signal log filtering and immutable undo action rollback (Commit 6).
- [x] T08: Build AsymmetricRatioBar visual component for emotional balance telemetry (Commit 7).
- [x] T09: Add CLI test check-transition-matrix.mjs verifying legal and illegal transitions (Commit 8).

### Phase 4 - A11y Verification & Quality Gate Sign-off
- [x] T10: Add WCAG 2.2 AA keyboard hotkeys (KeyE, KeyA, Esc), verify 375px viewport and finalize sign-off (Commit 9 & 10).

---

## Progress Log

### Commit 1 - feat(fsm): model HenHoKhongYeu state machine
Status: Completed.  
Scope:
- Defined core FSM contract eliminating boolean soup (`'FRIENDS' | 'DATING_NO_LOVE' | 'OFFICIAL_LOVE' | 'GHOSTED_EXIT'`).
- Modeled asymmetric effort formula ('Em cố 100 lần < Ai đó 1 phần') with pure derived state.
- Created `scripts/check-situationship-fsm.mjs` verifying math logic and state transitions via CLI.

### Commit 2 - feat(ui): add derived red-flag meter & ghosting cleanup
Status: Completed.  
Scope:
- Built accessible UI with high-contrast color scheme, useId() label bindings, and ARIA live regions.
- Added 5-second ghosting countdown with leak-free interval cleanup.
- Configured 375px mobile viewport layout with zero horizontal overflow.

### Commit 3 - feat(bonus): implement FSM reducer with strict transition validation table
Status: Completed.  
Scope:
- Created `situationshipReducer` and legal transition matrix `LEGAL_TRANSITIONS`.
- Enforced transition guards blocking invalid state transitions (e.g., jumping directly from `GHOSTED_EXIT` to `OFFICIAL_LOVE`).
- Migrated component state management to `useReducer` and verified zero unused variable warnings.

### Commit 4 - feat(bonus): add AbortController message ping simulation and cancelable fetch
Status: Completed.  
Scope:
- Created `useCancelableMessagePing` hook leveraging `AbortController` to simulate unreciprocated chat pings.
- Aborted active pending requests immediately when switching focus to "Ai Đó" or clicking "Unbind & Free Memory".
- Rendered live status badge reflecting network state (`IDLE`, `SENDING`, `SEEN_NO_REP`, `ABORTED`).

### Commit 5 - feat(bonus): integrate Web Audio synthesizer sound effects for FSM state events
Status: Completed.  
Scope:
- Built `SituationshipAudioEngine` using pure Web Audio API oscillators and gain envelopes.
- Emitted dual-tone sawtooth alert for Red-Flag triggers and descending sine chimes on unbind exit.
- Added audio toggle controls with WCAG compliant accessible button states.

### Commit 6 - feat(bonus): implement interaction signal filtering and undo effort rollback
Status: Completed.  
Scope:
- Implemented pure derived state signal filtering (`ALL`, `EM`, `AI_DO`) during render.
- Added immutable rollback handler restoring state snapshots and recalculating effort points.
- Handled empty state displays and disabled button states cleanly.

### Commit 7 - feat(bonus): add visual emotional radar gauge and asymmetric impact ratio bar
Status: Completed.  
Scope:
- Built dedicated `AsymmetricRatioBar` component visualizing dynamic effort percentage.
- Styled proportional progress bars with high-contrast indicator badges.
- Computed pure percentage values dynamically without redundant state variables.

### Commit 8 - test(bonus): add CLI test suite for transition validation matrix and abort lifecycle
Status: Completed.  
Scope:
- Created `scripts/check-transition-matrix.mjs` with Node.js assertions.
- Verified legal transition paths and enforced illegal transition rejection.
- Validated AbortController event listener cleanup and signal lifecycle.

### Commit 9 - test(bonus): verify WCAG 2.2 AA keyboard shortcuts and 375px mobile responsiveness
Status: Completed.  
Scope:
- Bound physical `e.code` handlers (`KeyE`, `KeyA`, `Escape`) with OS repeat guards and input isolation.
- Rendered semantic `<kbd>` accessibility guide elements.
- Verified zero horizontal overflow on 375px mobile viewport.

### Commit 10 - docs(bonus): complete WBS documentation and final quality gate sign-off
Status: Completed.  
Scope:
- Verified all 10 WBS sub-tasks completed with zero linter warnings and clean build.
- Documented full commit history and architectural contracts.
- Final quality gate sign-off ready for live defense.

## Lab 4 Homework 1 - Full-Stack Swipe Deck ('Hẹn Hò Nhưng Không Yêu')

### Phase 1 - Backend API & Persistence (Express + Mongoose 8)
- [x] T11: Configure Express server and Mongoose 8 connection with zero deprecated flags.
- [x] T12: Define Schema and implement GET `/api/profiles` endpoint optimized with `.lean()`.
- [x] T13: Implement POST `/api/swipe` endpoint with `try/catch` payload validation.

### Phase 2 - Frontend Integration & Gestures
- [x] T14: Integrate Backend API to fetch profiles instead of using mock data.
- [x] T15: Implement POST requests within the Dual Keyboard/Pointer Event Listeners.
- [ ] T16: Synchronize LIFO Undo Stack (Backspace) with the new backend architecture.
- [x] T17: Compute Asymmetric Score using Pure Derived State during the render pass.

### Phase 3 - Quality Gates & Audit
- [ ] T18: Document any AI hallucinations and manual fixes in `AI_FAILURE_AUDIT.md`.
- [ ] T19: Capture final result screenshots and compile into a single PDF submission.

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
Status: Pending.
Scope: Write seed.js to inject initial data into MongoDB Atlas for UI testing.

### Commit 7 - docs: update TASK_DECOMPOSITION.md with Lab 4 tracking
Status: Pending.
Scope: Update WBS and append Progress Log.

### Commit 8 - fix(frontend): synchronize LIFO undo stack with backend state
Status: Pending.
Scope: Ensure Backspace undo pops the history stack correctly.

### Commit 9 - docs: add AI_FAILURE_AUDIT.md documenting resolutions
Status: Pending.
Scope: Document Mongoose 8 and React Router v7 AI hallucinations.

### Commit 10 - docs: add PDF screenshot of Swipe Deck final result
Status: Pending.
Scope: Capture final UI and submit.