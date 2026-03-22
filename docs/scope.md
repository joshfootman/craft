# study — Scope & Requirements

## Overview

A personal interaction laboratory. A collection of isolated UI studies, each one a deliberate exploration of motion, design, or 3D. Built to develop craft, document growth, and serve as a living portfolio for design engineering roles.

Not a product. Not an app. A series of moments.

---

## Tech Stack

- **Framework**: Astro (latest)
- **Component layer**: React (via `@astrojs/react`)
- **Styling**: Tailwind CSS (latest)
- **Animation**: Motion.dev
- **3D**: Three.js / React Three Fiber
- **Language**: TypeScript throughout

---

## Core Architecture

### File-based study registration

Each study lives in its own folder under `src/studies/`. Dropping a new folder automatically registers it in the sidebar. There is no central config or registry to maintain.

```
src/
  studies/
    001-spring-list/
      index.astro       ← Astro route wrapper
      SpringList.tsx    ← React study component
      meta.ts           ← Exported metadata
  components/
    Sidebar.astro
    StudyShell.astro    ← Layout: sidebar + content
  layouts/
    Base.astro
```

### Study metadata

Every study exports a typed metadata object from `meta.ts`. This is the single source of truth for the sidebar and any future filtering.

```ts
// src/studies/001-spring-list/meta.ts
import type { Meta } from "../../types/study";

export const meta = {
  id: "001-spring-list",
  title: "Spring List Reveal",
  description: "Staggered list entry using spring physics over linear easing.",
  status: "published",
  techniques: ["motion.dev", "spring physics"],
  tags: ["motion", "list", "spring"],
  category: "motion",
  inspiration: ["https://..."],
  date: "2026-03-21",
  theme: "dark",
  viewport: "desktop",
} satisfies Meta;
```

`status: 'draft'` studies are visible in development, hidden in production.

### Glob-based sidebar population

The sidebar uses `import.meta.glob('/src/studies/**/meta.ts', { eager: true })` to collect all study metadata at build time. Use the absolute glob path (prefixed with `/src/`) to avoid ambiguity regardless of where the importing file lives. No imports to add, no arrays to update. Sort by date descending.

### Study route wrapper

Each `index.astro` follows the same minimal pattern:

```astro
---
import StudyShell from '../../components/StudyShell.astro'
import { meta } from './meta.ts'
import SpringList from './SpringList.tsx'
---

<StudyShell {meta}>
  <SpringList client:load />
</StudyShell>
```

The React component itself has no awareness of routing or layout — it's just a component.

---

## Layout & UI

### Shell

Two-panel layout. Sidebar left, study content right. The sidebar is the only persistent UI element across all studies.

- Sidebar width: fixed, approximately 260px
- Content area: fills remaining viewport width and full height
- No global header, no footer — the only persistent chrome outside the sidebar is the per-study header bar inside the content area

### Sidebar

- Lists all published studies, sorted by date (newest first)
- Each item shows: title, short description, and tags (truncated — tags are rendered inline and clipped based on available sidebar width, no fixed count limit)
- Studies are grouped by `category`, each group rendered under a simple section header
- Active study is visually highlighted
- Collapsible — a toggle button collapses it to icon/rail width, giving the study full bleed. Keyboard shortcut: `cmd+b` / `ctrl+b`
- Sidebar state (open/collapsed) persists in localStorage

### Study shell

When a study is active, the right panel is split into two vertical regions:

1. **Header bar** — a minimal fixed-height bar at the top of the content area showing the study title and all tags in full. This is the only persistent chrome in the content area. It should be slim and typographically simple — not a page header, just a label strip.
2. **Study area** — fills the remaining height below the header bar. The study component renders here with no imposed padding. Studies manage their own internal spacing and layout.

A small fixed button sits in the bottom-right corner of the study area. It is only rendered if the study has one or more `inspiration` URLs. Clicking it opens a modal listing the inspiration sources as linked URLs — similar to the acknowledgements overlay in Google Maps. The button should be minimal and unobtrusive, it should not compete with the study itself.

### Viewport framing

The shell reads `viewport` from the study meta and adjusts the content area accordingly:

- `desktop` — content area fills all available space, no constraints
- `mobile` — content area is constrained to a 390px wide centered frame with a phone-like aspect ratio, allowing the study to be experienced as intended on desktop
- `any` — content area fills all available space, no constraints

The `data-theme` attribute is applied to the content area wrapper based on the `theme` field, so Tailwind's dark mode variant and any shell chrome (e.g. the overlay) can adapt.

### Homepage

Deferred — not in scope for initial build. The `/` route can redirect to the first published study for now.

---

## Routing

- Each study is accessible at `/studies/[id]` — e.g. `/studies/001-spring-list`
- Direct links must work — navigating to a study URL loads that study directly
- The sidebar highlights the correct active item based on current route

---

## Command Search

A `cmd+k` / `ctrl+k` keyboard shortcut opens a command palette overlay. This is the primary search and navigation mechanism across studies.

### Behaviour

- Opens as a floating overlay, centered, above all content
- Dismisses on `esc`, on backdrop click, or on selection
- Autofocuses the search input on open
- Searches across study `title`, `tags`, and `techniques` in real time as the user types
- Results show study title and tags, clicking navigates to that study and closes the palette
- If no results match, show a minimal empty state

### Tags

Tags are a free-form string array on each study's metadata. They are distinct from `techniques` — techniques describe the tooling used, tags describe the concept or interaction type. Examples: `motion`, `3d`, `scroll`, `gesture`, `spring`, `typography`, `game`, `data`.

Tags appear in the sidebar under each study item and are also searchable via the command palette.

### Implementation notes

- The palette should be built as a React component rendered at the root layout level
- Study list for search is passed in at build time via the same glob that populates the sidebar — no runtime fetch
- Keyboard navigation through results (arrow keys + enter) is required

---

## Study Component Contract

A study component should:

- Be a default React export
- Manage its own internal state and layout
- Fill the space it's given (avoid fixed pixel dimensions that break on different viewport sizes)
- Be self-contained — no shared state outside the component

A study component should not:

- Know about routing
- Import anything from the sidebar or shell
- Have a title, description, or tags rendered inside it — title and full tags live in the header bar, description lives in the sidebar

---

## Metadata Type

Define a shared TypeScript type for study metadata. Use this across the glob import and the shell component.

```ts
// src/types/study.ts
export type Status = "draft" | "published";
export type Theme = "dark" | "light" | "any";
export type Viewport = "mobile" | "desktop" | "any";

export type Meta = {
  id: string;
  title: string;
  description: string;
  status: Status;
  techniques: string[];
  tags: string[];
  category: string;
  inspiration?: string[];
  date: string; // ISO 8601 e.g. '2026-03-21'
  theme: Theme;
  viewport: Viewport;
};
```

---

## Design Constraints

- **Minimal chrome.** The UI surrounding studies should recede completely. No gradients, no decorative elements in the shell itself — that energy belongs to the studies.

---

## Astro Configuration

`astro.config.mjs` should be configured as follows:

- `output: 'static'`
- React integration enabled via `@astrojs/react`
- Tailwind v4 configured via the Vite plugin (`@tailwindcss/vite`) — do not use `@astrojs/tailwind`, that package targets v3
- No SSR, no server endpoints — this is a fully static site

---

## Placeholder Study

Scaffold one complete placeholder study as part of the initial build — `001-placeholder` — so the full pipeline can be verified end to end: glob picks it up, sidebar renders it, route resolves, shell applies theme and viewport correctly. The component itself can be a single centred text element. It should have `status: 'published'` so it appears in both dev and prod.

---

## Developer Experience Requirements

- Adding a new study requires creating one folder with three files (`index.astro`, `meta.ts`, `YourComponent.tsx`) and nothing else
- TypeScript errors on malformed metadata (enforced via the `Meta` type)
- Draft studies visible in dev, invisible in prod — no extra config needed
- Hot reload works on study components as expected via Vite
- `@/` path alias configured in `tsconfig.json` pointing to `src/` — use this for all internal imports

---

## Out of Scope (for now)

- Homepage / study grid overview
- Comments or social features
- Auth of any kind
- Any backend
- Mobile layout (studies are desktop-first, sidebar may simply be hidden on small screens)
- Dark/light toggle
