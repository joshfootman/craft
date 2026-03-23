# Plan: Hub page and category support

> Source PRD: docs/issues/002-hub-page-and-category-support.md

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: Hub lives at `/`. Study pages remain at `/studies/{id}`.
- **Schema**: No changes. Existing `Meta` type with `category` (string) and `tags` (string[]) is sufficient.
- **Key models**: `"General"` is the default category. Any other category value defines a named breakdown. The grouping utility is the single source of truth for separating breakdowns from standalone studies.

---

## Phase 1: Grouping utility and tests

**User stories**: 1, 2, 3, 10

### What to build

A pure function that takes a sorted list of study metadata and returns two collections: a map of named breakdown groups (keyed by category name, each containing its studies in date order) and a flat list of standalone "General" studies. This function replaces the existing `group_by_category` in the sidebar and becomes the shared grouping logic for both the hub page and sidebar.

### Acceptance criteria

- [ ] Function returns named breakdowns separately from "General" standalone studies
- [ ] Studies within each group preserve their date sort order
- [ ] Returns empty collections gracefully (no studies, all "General", all one category)
- [ ] Tests cover the above edge cases

---

## Phase 2: Hub page

**User stories**: 1, 2, 3, 8, 9

### What to build

Replace the current index redirect with an Astro page that renders the hub. The hub uses the grouping utility from Phase 1 to display named breakdowns as cards (category name as header, child studies listed inside) and standalone studies in an unlabeled section below. Each study links to its `/studies/{id}` route.

### Acceptance criteria

- [ ] Index page renders grouped breakdown cards with category headers
- [ ] Each card lists its child studies with clickable links
- [ ] Standalone "General" studies appear in an unlabeled section below the cards
- [ ] Empty states handled (no breakdowns, no standalone studies)
- [ ] Page uses the shared grouping utility from Phase 1

---

## Phase 3: Sidebar updates

**User stories**: 4, 5, 6, 7

### What to build

Flatten the sidebar from category-grouped sections to a single date-sorted list. Add a category badge below the study title for studies belonging to a named breakdown (not "General"). Apply 2-line clamp with ellipsis truncation to study titles.

### Acceptance criteria

- [ ] Sidebar lists all studies in a single date-sorted list (no category group headers)
- [ ] Studies with a non-"General" category show a badge below the title
- [ ] "General" studies show no badge
- [ ] Study titles wrap to a maximum of 2 lines with ellipsis truncation
- [ ] Category badge sits on its own line below the title
