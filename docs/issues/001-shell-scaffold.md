# Build the Craft shell: sidebar, header, command palette, and study pipeline

## Problem Statement

Craft has no interactive shell yet. The repo contains a bare Astro scaffold with shadcn installed and sample sidebar data, but none of the core architecture exists — no study routing, no sidebar populated from metadata, no command palette, no header bar, no viewport framing. There is no way to create a study and have it appear in the UI.

## Solution

Build the complete shell infrastructure so that dropping a new folder under `src/pages/studies/` with three files (`index.astro`, `component.tsx`, `meta.ts`) automatically registers it in the sidebar, makes it routable, and renders it inside a consistent shell with a header bar, viewport preview toggle, command palette search, and inspiration citation popover. The shell should recede — all visual energy belongs to the studies.

## User Stories

1. As a developer, I want to create a new study by adding a single folder with three files, so that I don't need to update any central config or registry.
2. As a developer, I want TypeScript to error if my study metadata is malformed, so that I catch mistakes before they reach the UI.
3. As a user, I want to see all studies listed in the sidebar grouped by category and sorted by date, so that I can navigate between them.
4. As a user, I want to click a study in the sidebar and navigate to it, so that I can view it in the content area.
5. As a user, I want the active study to be visually highlighted in the sidebar, so that I know which study I'm viewing.
6. As a user, I want the sidebar to show each study's title, a one-line truncated description, and tags as plain muted inline text, so that I can scan studies at a glance.
7. As a user, I want to collapse the sidebar with `cmd+b` / `ctrl+b` or via the rail, so that the study gets full-bleed space.
8. As a user, I want the sidebar collapse state to persist across page loads, so that I don't have to re-collapse it every time I navigate.
9. As a user, I want to see "Craft" as a wordmark at the top of the sidebar, so that the project has a clear identity.
10. As a user, I want a search-input-styled button below the sidebar wordmark that opens the command palette when clicked, so that I have a visible affordance for search.
11. As a user, I want to press `cmd+k` / `ctrl+k` to open a command palette overlay, so that I can quickly search and navigate to any study.
12. As a user, I want the command palette to search across study title, tags, and techniques in real time, so that I can find studies by any attribute I remember.
13. As a user, I want to navigate command palette results with arrow keys and enter, so that I can search without touching the mouse.
14. As a user, I want the command palette to dismiss on `esc`, backdrop click, or selection, so that it gets out of my way.
15. As a user, I want a slim header bar at the top of the content area showing the viewport toggle on the left, a separator, then the study title and inline tags, so that I have context about the current study without heavy chrome.
16. As a user, I want desktop/tablet/mobile toggle buttons in the header bar (like shadcn's blocks preview), so that I can preview how a study looks at different viewport widths.
17. As a user, I want the viewport toggle to default based on the study's `viewport` metadata value, so that each study opens at its intended size.
18. As a user, I want the study content area to resize to match the selected device width, so that I can test responsive behavior.
19. As a user, I want a small unobtrusive button in the bottom-right corner of the study area when the study has inspiration URLs, so that I can access citations without them cluttering the UI.
20. As a user, I want clicking the inspiration button to open a popover listing linked URLs, so that I can revisit references that inspired or informed the study.
21. As a user, I want the `data-theme` attribute applied to the content area based on the study's `theme` metadata, so that studies can use dark or light mode styling.
22. As a user, I want the `/` route to redirect to the first study, so that the app has a landing page without needing a dedicated homepage.
23. As a user, I want direct links to `/studies/[id]` to work, so that I can bookmark and share study URLs.
24. As a user, I want the sidebar to be responsive on small screens (via shadcn's built-in sheet behavior), so that I can browse studies on mobile if needed.

## Implementation Decisions

### Architecture

- **Thin Astro layer, React shell.** Astro handles file-based routing and data collection (glob imports). A single React component (`Shell`) is mounted via `client:load` in the Astro layout and handles all interactive UI: sidebar, header bar, viewport frame, command palette.
- **Study components are Astro slots.** Each study's React component is rendered via `client:load` inside the Astro `<slot />`, making it an independent React island. The study has no awareness of the shell and shares no React state with it.
- **Full page loads for navigation.** No client-side router or view transitions in the initial build. Sidebar state persists via cookie (built into shadcn sidebar). View transitions are a future enhancement.
- **Explicit per-study routing.** Each study has its own `index.astro` wrapper — no dynamic `[id].astro` route with `getStaticPaths`. This keeps things explicit and allows per-study hydration strategy choices.

### Modules

1. **Meta type** (`src/types/study.ts`) — Shared `Meta` type. `status` field is included but not used for filtering in this build.

2. **Study data loader** (`src/lib/studies.ts`) — Utility that takes the result of `import.meta.glob` and returns a sorted `Meta[]`. Sort by date descending. Used by the Astro layout to pass data as props.

3. **React Shell** (`src/components/Shell.tsx`) — Top-level React component. Wraps `SidebarProvider`, renders `AppSidebar` and the content area. Props: `studies: Meta[]`, `activeStudyId: string`, `meta: Meta` (current study). Children are slotted Astro content.

4. **App Sidebar** (`src/components/app-sidebar.tsx`) — Rework the existing scaffolded component. Header: "Craft" wordmark + command palette trigger button. Body: studies grouped by `category`, each group under a section header. Each item: title, 1-line description, plain muted inline tags. Active item highlighted via `activeStudyId` prop. Rail for collapse.

5. **Header Bar** (`src/components/study-header.tsx`) — Slim bar. Left: viewport toggle buttons (desktop/tablet/mobile icons). Separator. Then: study title + inline tags flowing left to right.

6. **Viewport Frame** (`src/components/viewport-frame.tsx`) — Wraps slotted study content. Provides device width toggle. Defaults based on `meta.viewport`. Device widths abstracted into named constants (not magic numbers).

7. **Command Palette** (`src/components/command-palette.tsx`) — Built with shadcn's command component (cmdk). Receives `Meta[]`. Searches title, tags, techniques. Navigates via `window.location` on selection. Triggered by `cmd+k` and by the sidebar search button.

8. **Inspiration Popover** (`src/components/inspiration-popover.tsx`) — Fixed-position button, bottom-right of study area. Only rendered if `meta.inspiration` is non-empty. shadcn popover with linked URLs.

9. **Astro Layout** (`src/layouts/Base.astro`) — Runs `import.meta.glob('/src/pages/studies/**/meta.ts', { eager: true })`. Passes `Meta[]` and `activeStudyId` into the React Shell. Provides `<slot />` for study content.

10. **Placeholder Study** (`src/pages/studies/001-placeholder/`) — `index.astro`, `component.tsx`, `meta.ts`. Simple centered text element. Verifies the full pipeline.

11. **Homepage Redirect** (`src/pages/index.astro`) — Redirects to the first study by date.

### Key conventions

- Path alias: `~/` points to `src/` (already configured in `tsconfig.json`)
- Study React component always named `component.tsx`
- `activeStudyId` passed from Astro layout to React shell as a prop (no client-side URL parsing)
- Navigation between studies is plain `<a href>` — full page loads
- Sidebar uses cookie persistence (shadcn default)

## Testing Decisions

### Two-tier testing strategy

- **Vitest** for unit tests and basic component tests (fast, no browser needed). Tests live alongside source as `*.test.{ts,tsx}`.
- **Vitest Browser Mode with Playwright** for integration tests that need real browser behavior (viewport resizing, keyboard shortcuts, navigation). Tests live alongside source as `*.browser.test.{ts,tsx}` or under a dedicated test directory.

### What makes a good test

- Test external behavior and user-visible outcomes, not implementation details.
- If a refactor doesn't change behavior, no tests should break.
- Prefer rendering components and asserting on DOM output over testing internal state.

### Modules to test

**Vitest (unit/component):**

- **Study data loader** — sorts by date descending, handles empty input, extracts metadata correctly from glob result shape.
- **Command palette** — search filtering returns correct results for title, tags, and techniques queries. Empty state when no matches.
- **Meta type** — verify `satisfies Meta` catches malformed objects (this is a compile-time check, but a type-level test file can document the contract).

**Vitest Browser (Playwright):**

- **Viewport frame** — toggling between desktop/tablet/mobile actually resizes the content area to the correct widths. Default selection matches `meta.viewport`.
- **Sidebar keyboard shortcut** — `cmd+b` toggles sidebar visibility.
- **Command palette keyboard shortcut** — `cmd+k` opens the palette, `esc` closes it.

## Out of Scope

- Homepage / study grid overview
- Draft/published filtering (all studies visible)
- Deployment and production concerns
- View transitions / SPA-like navigation
- Dark/light mode toggle
- Comments or social features
- Auth or backend
- Building actual studies beyond the placeholder

## Further Notes

- The shadcn sidebar component, command component, popover, and related UI primitives are already installed in the repo.
- The existing `app-sidebar.tsx` contains scaffolded sample data that will be replaced with study metadata.
- `VersionSwitcher` and `SearchForm` components can be removed — they are shadcn sample code not used in Craft.
- Three.js, React Three Fiber, and motion are installed and available for future studies but are not used in this build.
- The `status` field in `Meta` is kept for future deployment filtering but has no effect in this build.
