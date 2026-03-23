# Hub page and sidebar category support

## Problem Statement

Studies display in a flat, date-sorted list with no visual grouping. When breaking down a complex component or website (e.g., Stripe's pricing page) into multiple studies, there is no way to see which studies belong together. The index page is still the Astro starter default and does not serve as a useful entry point.

## Solution

Introduce a hub/dashboard as the index page that groups studies by category into visual cards. Update the sidebar to surface category context on individual studies without cluttering the list.

## User Stories

1. As a user, I want to see studies grouped by category on the index page, so that I can understand which studies belong to the same breakdown.
2. As a user, I want each named breakdown (e.g., "Stripe Pricing") to appear as a card with its child studies listed, so that I can browse a breakdown as a cohesive unit.
3. As a user, I want standalone studies (category "General") to appear in an unlabeled section below the breakdown cards, so that they don't get lost but also don't clutter the grouped view.
4. As a user, I want the sidebar to remain sorted by date, so that I always see the most recent work first regardless of category.
5. As a user, I want the sidebar to show a category badge below the study title when a study belongs to a named breakdown, so that I have context without navigating away.
6. As a user, I want no category badge on "General" studies in the sidebar, so that the badge only appears when it carries meaning.
7. As a user, I want study titles in the sidebar to wrap up to two lines and truncate with ellipsis after that, so that long titles remain readable without blowing out the layout.
8. As a user, I want to click a study in either the hub or the sidebar to navigate to it, so that both entry points lead to the same destination.
9. As a user, I want breakdown cards on the hub to show the category name as a header, so that I can identify the group at a glance.
10. As a user, I want to create a new study that belongs to a breakdown by setting its category to the breakdown name, so that no additional configuration is needed.

## Implementation Decisions

- **No schema changes.** The existing `Meta` type already has `category` (string) and `tags` (string[]). `"General"` remains the default category for standalone studies.
- **No explicit ordering within breakdowns.** Study file name prefixes (e.g., `012-`, `013-`) handle implicit ordering. No `sequence` field needed.
- **Hub page replaces the current index.** The hub lives at `/` — a personal sandbox does not need a separate landing page.
- **Grouping utility in `src/lib/studies.ts`.** A pure function that takes a list of `Meta` and returns named breakdown groups and a standalone list. This is the core logic both the hub and sidebar depend on.
- **Sidebar modifications in `src/components/app-sidebar.tsx`.** Conditional rendering of a category badge (using existing Badge component) below the title. Badge only renders when category is not `"General"`.
- **Title truncation.** Sidebar study titles use CSS line-clamp (2 lines max) with ellipsis overflow. Category badges sit on their own line below.
- **Hub layout.** Grouped cards for named breakdowns at the top, unlabeled flat section for "General" studies below. Each card shows category name as header and lists child studies.

## Testing Decisions

- Only test core logic that would cause cascading issues if broken. Avoid testing UI components at this stage — they will change shape as the design evolves.
- **Study grouping utility** — test that it correctly separates named breakdowns from "General" standalone studies, handles edge cases (no studies, all "General", all one category), and preserves date sorting within groups.
- Prior art: existing tests follow Vitest conventions with `@testing-library`.

## Out of Scope

- Filtering or searching by tags on the hub page.
- Resizable sidebar.
- Category management UI — categories are set directly in `_meta.ts` files.
- Any changes to the study `Meta` type or directory structure.

## Further Notes

This lays the groundwork for a "study breakdown" workflow: pick a complex website or component, decompose it into isolated studies, and use the category to tie them together. The hub becomes the primary way to see the big picture, while the sidebar stays focused on recency.
