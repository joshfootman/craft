# Lesson Learned: First Item Glitch with `overflow-hidden` + `RotateUp`

## Problem Statement

In `006-osmo-complete`, the first menu item appeared to animate incorrectly when `overflow-hidden` was applied to a parent container around the menu list.

Observed behavior:

- item 1 looked like it started at a different Y position
- item 1 appeared to rotate in the wrong direction ("down" instead of "up")
- items 2+ animated normally

At first glance this looked like a Motion variant bug (`y`/`rotate`) or a transform-origin issue, but it was not.

## Root Cause

This was caused by **focus auto-management interacting with overflow clipping/scrolling**, not by React state or the animation math itself.

What happened on open:

1. The drawer auto-focused the first focusable element (the first menu anchor).
2. Because an ancestor was `overflow-hidden`, the browser treated that area as a scroll/clipping context.
3. Focus-to-visible behavior scrolled the first row container (`scrollTop` changed for row 1 only).
4. That scroll offset changed item 1's apparent transform path while the animation was running.
5. Items 2+ were not auto-focused, so they kept normal motion.

Why this is confusing:

- `transform` animation and overflow clipping are visual operations.
- focus-induced scrolling is a layout/scroll operation.
- when both happen at the same time, the first row can look like it has a different animation curve/direction even though it uses the same variants.

## Solution

Prevent the drawer from auto-focusing the first animated link on open.

- Set `initialFocus={false}` on `DrawerContent` so the first menu item is not auto-focused during entry animation.
- Keep animation staggering explicit per item if needed, but the critical fix is focus behavior.

Applied in:

- `src/pages/studies/006-osmo-complete/_component.tsx`

```tsx
<DrawerContent initialFocus={false} ...>
```

## Alternatives (if you want managed focus)

If accessibility requirements need initial focus, use one of these patterns:

- focus a non-animated control first (e.g. close button)
- delay focus until after the intro animation completes
- keep animated list items outside any parent that can become a scrolling/clipping focus target

## Debugging Checklist for Similar Bugs

When only the first animated item breaks under `overflow-hidden`, check:

- `document.activeElement` right after open
- `scrollTop` on row wrappers/parents during the first 200-400ms
- whether only row 1 receives scroll/focus side effects
- whether disabling auto-focus removes the anomaly

If yes, you are likely looking at a focus/scroll side effect, not a bad transform variant.
