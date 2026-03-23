# Plan: Shell Scaffold

> Source PRD: `docs/issues/001-shell-scaffold.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: Studies at `/studies/[id]` (e.g. `/studies/001-placeholder`). Homepage `/` redirects to the first study by date.
- **Data model**: `Meta` type in `src/types/study.ts` — id, title, description, status, techniques, tags, category, inspiration, date, theme, viewport. `status` exists in the type but is not used for filtering.
- **Data flow**: Astro layout runs `import.meta.glob` to collect study metadata, passes `Meta[]` + `activeStudyId` as props into a single React shell mounted via `client:load`. Study components are slotted as independent React islands via Astro `<slot />`.
- **Navigation**: Full page loads via `<a href>`. No client-side router. Sidebar state persists via cookie.
- **Path alias**: `~/` resolves to `src/`.
- **Study file convention**: Each study is a folder under `src/pages/studies/[id]/` containing `index.astro`, `_component.tsx`, `_meta.ts`. Non-page files are prefixed with `_` so Astro ignores them as routes.
- **Shell UI**: shadcn components for sidebar, command palette, popover, and header primitives. Studies use whatever they want.
- **Testing**: TDD. Vitest for unit/component tests. Vitest browser mode with Playwright for integration tests requiring real browser behavior. Tests written before implementation in each phase.
- **Device width constants**: Viewport frame widths (desktop, tablet, mobile) abstracted into named constants, not hardcoded.

---

## Phase 1: Foundation — Meta type, data loader, placeholder study, routing

**User stories**: 1, 2, 22, 23

### What to build

The thinnest end-to-end tracer bullet. Define the `Meta` type. Build a study data loader utility that takes a glob result and returns a sorted `Meta[]`. Scaffold the placeholder study with all three files. Create the Astro layout that runs the glob and renders slotted study content. Wire up the homepage redirect. No React shell yet — the Astro layout renders study content directly to verify the full routing pipeline works.

### Tests (written first)

- **Vitest unit**: Study data loader sorts by date descending, handles empty input, correctly extracts metadata from the glob result shape.
- **Type-level**: Verify `satisfies Meta` catches malformed metadata (compile-time, documented in a test file).

### Acceptance criteria

- [x] `Meta` type exists and is importable via `~/types/study`
- [x] Study data loader takes a glob result object and returns `Meta[]` sorted by date descending
- [x] Study data loader unit tests pass
- [x] Placeholder study exists at `src/pages/studies/001-placeholder/` with `index.astro`, `_component.tsx`, `_meta.ts`
- [x] Navigating to `/studies/001-placeholder` renders the placeholder component
- [x] Navigating to `/` redirects to `/studies/001-placeholder`
- [x] Astro layout collects metadata via glob and makes it available for future phases

---

## Phase 2: React Shell + Sidebar

**User stories**: 3, 4, 5, 6, 7, 8, 9, 24

### What to build

Mount the React shell in the Astro layout via `client:load`. The shell wraps `SidebarProvider` and renders the app sidebar and a content area where the Astro slot passes through. Rework the existing `app-sidebar.tsx` — replace sample data with study metadata. Sidebar header: "Craft" wordmark and a search-input-styled button (placeholder for the command palette trigger in Phase 4). Body: studies grouped by `category`, each group under a section header. Each item shows title, one-line truncated description, and plain muted inline tags. Active study highlighted via `activeStudyId` prop. Rail for collapse, `cmd+b` / `ctrl+b` toggle, cookie persistence. Remove unused `VersionSwitcher` and `SearchForm` components.

### Tests (written first)

- **Vitest component**: Sidebar renders study items grouped by category. Active study receives the correct active state. Sidebar header renders "Craft" wordmark and search trigger button.
- **Vitest browser (Playwright)**: `cmd+b` toggles sidebar collapsed/expanded.

### Acceptance criteria

- [x] React shell renders inside the Astro layout with sidebar left, content right
- [x] Sidebar header shows "Craft" wordmark and a search-button placeholder
- [x] Studies are grouped by category with section headers
- [x] Each study item shows title, one-line truncated description, and muted inline tags
- [x] Clicking a study item navigates to `/studies/[id]`
- [x] Active study is visually highlighted
- [x] `cmd+b` / `ctrl+b` collapses and expands the sidebar (shadcn built-in)
- [x] Sidebar state persists across page loads via cookie (shadcn built-in)
- [x] Sidebar is responsive on small screens (shadcn sheet behavior)
- [x] `VersionSwitcher` and `SearchForm` sample components are removed

---

## Phase 3: Header bar + Viewport frame

**User stories**: 15, 16, 17, 18, 21

### What to build

Add a slim header bar at the top of the content area inside the React shell. Layout: viewport toggle buttons on the left (desktop/tablet/mobile icons, styled like shadcn's blocks preview), a vertical separator, then the study title and tags flowing inline to the right. Build the viewport frame component that wraps the slotted study content. The frame resizes its width based on the selected device toggle. Device widths are defined as named constants. The default toggle selection is driven by the study's `viewport` metadata value. Apply `data-theme` attribute to the content area wrapper based on the study's `theme` metadata.

### Tests (written first)

- **Vitest component**: Header bar renders viewport toggle, title, and tags from metadata. Viewport frame defaults to the correct device width based on `meta.viewport`.
- **Vitest browser (Playwright)**: Clicking each toggle button resizes the content area to the corresponding device width. Default selection matches `meta.viewport`.

### Acceptance criteria

- [x] Header bar renders as a single slim line above the study content
- [x] Viewport toggle buttons (desktop/tablet/mobile) are on the left side of the header
- [x] A separator sits between the viewport toggle and the title
- [x] Study title and tags render inline after the separator
- [x] Clicking a toggle button resizes the study content area to the corresponding device width
- [x] Default toggle selection matches the study's `viewport` metadata
- [x] Device widths are abstracted into named constants
- [x] `data-theme` attribute is applied to the content area wrapper based on `meta.theme`

---

## Phase 4: Command palette

**User stories**: 10, 11, 12, 13, 14

### What to build

Install the shadcn command component (cmdk). Build the command palette as a React component inside the shell. It receives the `Meta[]` array and provides real-time search across title, tags, and techniques. Wire two triggers: the `cmd+k` / `ctrl+k` global keyboard shortcut and the sidebar search button from Phase 2. Results show study title and tags. Selecting a result navigates to that study and closes the palette. Keyboard navigation with arrow keys and enter. Dismiss on `esc`, backdrop click, or selection. Minimal empty state when no results match.

### Tests (written first)

- **Vitest component**: Search filtering returns correct results for title, tags, and techniques queries. Empty state renders when no matches. Results display title and tags.
- **Vitest browser (Playwright)**: `cmd+k` opens the palette, `esc` closes it. Clicking the sidebar search button opens the palette. Typing filters results in real time. Selecting a result navigates to the study URL.

### Acceptance criteria

- [x] `cmd+k` / `ctrl+k` opens the command palette overlay
- [x] Sidebar search button opens the command palette
- [x] Palette is centered, floating above all content
- [x] Search input is autofocused on open
- [x] Typing filters studies by title, tags, and techniques in real time (cmdk built-in)
- [x] Results show study title and tags
- [x] Arrow keys + enter navigate and select results (cmdk built-in)
- [x] Selecting a result navigates to `/studies/[id]` and closes the palette
- [x] `esc` closes the palette (dialog built-in)
- [x] Backdrop click closes the palette (dialog built-in)
- [x] Empty state shown when no results match

---

## Phase 5: Inspiration popover

**User stories**: 19, 20

### What to build

Add a small fixed-position button in the bottom-right corner of the study area. Only rendered when the current study's `meta.inspiration` array is non-empty. Clicking the button opens a shadcn popover listing the inspiration URLs as clickable links. The button should be minimal and unobtrusive — it serves as a citation reference, not a primary UI element.

### Tests (written first)

- **Vitest component**: Popover button does not render when `inspiration` is undefined or empty. Popover button renders when `inspiration` has URLs. Popover content lists all URLs as links.

### Acceptance criteria

- [x] Button is not rendered when study has no inspiration URLs
- [x] Button is rendered in the bottom-right corner when study has inspiration URLs
- [x] Button is visually minimal and does not compete with study content
- [x] Clicking the button opens a popover with linked inspiration URLs
- [x] Each URL is a clickable link that opens in a new tab
