# Sprint 8 — Optimisation

**Goal:** Performance, UX quality, and code robustness improvements post-MVP. No new features — tighten what exists.

---

## 1. Performance

### Context selector / memoisation
- `AppContext` re-renders every consumer on every action. Replace with `useMemo` + split contexts (or `use-context-selector`) so components only re-render when their slice changes.
- Wrap `BoardView`, `ListView`, `TimelineView` in `React.memo`.
- Memoize derived values (`visible`, `sorted`, `milestoneTasks`) with `useMemo`.

### Virtualized list
- `ListView` renders every task as a DOM row. At 500+ tasks this becomes sluggish. Switch to a windowed list (`@tanstack/react-virtual`) — only render visible rows.

### Lazy-load views
- Split `BoardView`, `ListView`, `TimelineView` into async chunks with `React.lazy` + `Suspense`. The initial JS payload is currently ~270 kB; code-splitting the three views reduces the critical path.

---

## 2. UX Quality

### Optimistic drag-and-drop feedback
- When a card is dropped, the status update is synchronous (localStorage), but there is no visual confirmation. Add a brief green flash on the card after a successful drop.

### Keyboard shortcut cheatsheet
- Add a `?` shortcut that opens a small overlay listing all available shortcuts (`N`, `M`, `1/2/3`, `Esc`, `?`).
- Shortcut overlay uses the same `popIn`/`popOut` CSS animation as the milestone modal.

### Toast notifications
- Replace `window.confirm` delete dialogs with an inline confirm pattern (a small "Are you sure?" row that appears beneath the delete button, auto-dismisses after 5 s).
- Add lightweight toast for successful create/update/delete: appears bottom-right, fades out after 2.5 s. No library — single `Toast.jsx` component with CSS animation.

### Board column scroll indicator
- When a column has many cards it silently overflows. Add a subtle gradient fade at the bottom of `.board-column-cards` when scrollable content is hidden.

### Timeline zoom controls
- Currently the timeline has a fixed px-per-day ratio. Add `+` / `−` buttons (or scroll-wheel) to zoom the axis in/out between "week view" and "quarter view".

---

## 3. Code Robustness

### Form validation with user feedback
- `TaskModal` silently does nothing if `title` is empty. Add an inline validation message under the title field ("Title is required") instead of the silent no-op.
- Highlight empty required fields with a red border on attempted save.

### Stale `isOverdue` reference in `MilestoneList`
- `const now = new Date()` is evaluated once at module load time (not reactive). Move it inside the render or the `isTaskOverdue` function so it reflects the actual current time.

### Error boundary
- Wrap `<AppShell>` in an `ErrorBoundary` component. If any view throws, show a graceful "Something went wrong — reload" screen rather than a blank white page.

### Storage error handling
- `localStorage` can throw `QuotaExceededError`. Wrap all `saveTasks` / `saveProjects` / `saveMilestones` calls in try/catch in `storage.js` and surface a toast if it fails.

### `nanoid` consistency
- `nanoid` is imported directly in components (TaskModal, MilestoneModal, ProjectList). Move ID generation into `storage.js` so the service layer owns it and it's easier to swap to UUIDs when Supabase is introduced.

---

## 4. Accessibility

- All icon-only buttons (column `+`, sidebar `+`, drawer close `×`) need `aria-label`.
- Modal overlays should trap focus (`focus-trap` pattern or `inert` attribute on the rest of the DOM).
- `BoardView` drag-and-drop is pointer-only. Add keyboard drag support via `@dnd-kit`'s `KeyboardSensor`.
- Color-only status/priority indicators (dots, border colours) need a text alternative for screen readers.

---

## Acceptance Criteria
- [ ] No unnecessary re-renders measurable via React DevTools Profiler
- [ ] ListView handles 500+ tasks without frame drops
- [ ] Delete flow uses inline confirm, not `window.confirm`
- [ ] Toast shown on create / update / delete
- [ ] Error boundary catches and displays gracefully
- [ ] All icon buttons have `aria-label`

## Estimated Complexity: Medium
