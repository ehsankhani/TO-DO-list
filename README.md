### Tasks — a scalable To‑Do List (CRUD) app

This repo is a **production‑ready, LocalStorage‑persisted To‑Do List** built with **React (JavaScript)**, HTML, and CSS.

It’s intentionally “teachable”: you get a predictable state flow (`useReducer`), clean service/selector boundaries, and a small design system with CSS variables—without adding heavy dependencies.

---

### Key features

- **CRUD**: create, read, update (inline), delete tasks
- **Task fields**: title (required), description, due date, priority, tags, status, completed checkbox
- **Bulk actions**: complete all, clear completed, delete selected
- **Filtering/sorting/search**: status/priority/tags, sort by due date + title, debounced keyword search
- **Persistence**: LocalStorage via a **versioned + validated** `useLocalStorage` hook (no direct LocalStorage calls in UI components)
- **Optimistic UX**: state updates immediately; write failures trigger a toast + rollback to last saved snapshot
- **Theme toggle**: dark/light with persisted preference
- **Accessible UI**: semantic structure, focus ring, labels, modal focus trap, keyboard shortcuts
- **Performance**: memoized selector, debounced search, optional virtualization when list is **> 500 items**
- **Testing**: Jest + React Testing Library coverage for reducers, selectors, hooks, and key UI flows

---

### Example screenshots (placeholders)

These are lightweight **SVG placeholders** you can replace with real screenshots or GIFs later:

- Light: `docs/media/light.svg`
- Dark: `docs/media/dark.svg`
- Filters/bulk: `docs/media/filters.svg`

---

### Architecture overview

This app follows a predictable “data in → state → derived view → UI” flow:

```text
UI components
  -> dispatch action (intent)
    -> todosReducer(state, action) (pure)
      -> persisted snapshot (useLocalStorage, batched)
        -> derived view (filteredTasksSelector)
          -> render
```

The **business logic** is kept out of components:

- `services/` encapsulates domain invariants + normalization (e.g. tags, task creation)
- `selectors/` computes filtered/sorted/derived lists for rendering
- `reducers/` is pure state transition logic
- `hooks/` composes reducer + persistence + rollback into a controller API for UI

---

### Folder structure (feature‑first)

```text
src/
  app/                # providers, theme, global styles, config
  features/
    todos/            # domain logic + UI for the to-do feature
  shared/             # reusable hooks + UI primitives + utils
  assets/             # illustrations (empty state)
docs/
  media/              # example screenshots (SVG placeholders)
```

---

### Design system

The UI uses a small token system (CSS variables) for:

- **Spacing**: `--sp-*`
- **Radii**: `--r-*`
- **Typography**: `--text-*`, `--font-sans`
- **Shadows**: `--shadow-*`
- **Motion**: `--dur-*` and `prefers-reduced-motion` support

Tokens live in `src/app/styles/tokens.css`. Global utilities live in `src/app/styles/global.css`.

---

### Accessibility notes (how to test)

- **Keyboard**:
  - Arrow keys navigate the list when focus is on a list row (not inside form fields)
  - **Enter** toggles inline edit
  - **Space** toggles completion (when not typing in an input)
  - **Escape** closes modals / cancels inline edit
- **Modal**: focus trap, Escape to close, click backdrop to close
- **Toasts**: `aria-live="polite"` region for announcements
- **Focus**: visible focus ring (`:focus-visible`)

Try: tab through controls, edit a task, close the modal with Escape, and ensure focus stays sensible.

---

### Performance notes

- **Debounced search**: prevents re-filtering on every keystroke
- **Selector**: `filteredTasksSelector` performs filtering + sorting in one pass
- **Virtualization**: when tasks exceed **500**, the list switches to a small fixed-row windowing implementation in `src/shared/ui/virtual/VirtualList.jsx`

No Framer Motion dependency is used; animations are handled with **CSS transitions** and respect `prefers-reduced-motion`.

---

### Configuration

Vite injects build‑time config via `__APP_CONFIG__` (defined in `vite.config.mjs`):

- **`LOCAL_STORAGE_KEY`** (default: `todo.state`)
- **`THEME_STORAGE_KEY`** (default: `todo.theme`)
- **`ANIMATION_MS`** (default: `180`)

To override:

```bash
# PowerShell example
$env:LOCAL_STORAGE_KEY="my.todos.v1"
$env:ANIMATION_MS="200"
npm run dev
```

---

### Setup

Prerequisites:

- Node.js 18+ recommended

Install & run:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

---

### Testing

Run unit + UI tests:

```bash
npm test
```

What’s covered:

- **Reducer** (`todosReducer`) action behavior
- **Selector** (`filteredTasksSelector`) filtering + sorting
- **Hook** (`useLocalStorage`) hydrate, set, migrate, rollback helpers
- **UI flow**: add → edit → delete task

---

### Limitations & future work

- **Cross-device sync** (e.g., server sync, multi-tab sync)
- **Reminders/notifications** (due date alerts)
- **PWA offline-first** (workbox, background sync)
- **More i18n**: add language packs + formatting utilities

---

### Contributing

- **Code style**: functional components, hooks, feature‑first modules
- **Commits**: small, descriptive commits (e.g. `feat(todos): add bulk delete`)
- **Adding components**: prefer `src/shared/ui/*` for primitives, `src/features/*` for feature UI

---

### License

MIT. See `LICENSE` (add one if you plan to publish).
