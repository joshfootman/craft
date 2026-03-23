# Plan: Viewport Frame Resize Handle

> Source: Grilling session — viewport frame similar to shadcn blocks documentation

## Architectural decisions

Durable decisions that apply across all phases:

- **State model**: Single numeric pixel value for frame width. Preset buttons (desktop, tablet, mobile) set known pixel values. Dragging sets freely. Active preset button determined by comparing current width to preset values — no match means no button is active.
- **Handle position**: Right edge of the frame only.
- **Handle style**: Thin vertical bar (~4-6px) with subtle grip texture (dots or lines).
- **Bounds**: Minimum width is the mobile preset (390px). Maximum width is the available container width.
- **Desktop preset**: Sets width to the current container width (measured dynamically). "100%" string is replaced by a concrete pixel value.
- **Preset click behavior**: Instant snap, no animation/transition.
- **Width indicator**: None — no tooltip or label shown during drag.
- **Content model**: Inline React slot, no iframe. No overlay needed during drag.
- **Drag deselection**: Dragging to a non-preset width deselects all preset buttons.

---

## Phase 1: Numeric state model + drag handle

### What to build

Convert the frame width state from `Device` to a numeric pixel value. Measure the container width on mount and on resize to determine the desktop value and the max constraint. Preset buttons set their known pixel values (container width for desktop, 768 for tablet, 390 for mobile). Add a draggable resize handle on the right edge of the frame — a thin vertical bar with grip texture. Pointer down on the handle starts tracking horizontal movement. Pointer move updates the frame width in real time, clamped between mobile preset and container width. Pointer up ends the drag. While dragging, the active preset button reflects whether the current width matches a preset exactly, or no button is active.

### Tests (written first)

- **Vitest component**: Preset buttons set numeric width. Active button deselects when width doesn't match a preset.
- **Vitest browser (Playwright)**: Dragging the handle resizes the frame. Width is clamped to min/max bounds.

### Acceptance criteria

- [x] Frame width state is a single numeric pixel value
- [x] Desktop preset sets width to measured container width
- [x] Tablet and mobile presets set width to their known pixel values
- [x] Drag handle appears on the right edge of the frame as a thin vertical bar with grip texture
- [x] Dragging the handle resizes the frame width in real time
- [x] Width is clamped between mobile preset (min) and container width (max)
- [x] Preset buttons reflect active state by comparing current width to preset values
- [x] Dragging to a non-preset width deselects all preset buttons
- [x] Clicking a preset after dragging snaps to that width and re-selects the button

---

## Phase 2: Handle visibility at full width

### What to build

When the frame is at container width (the desktop preset), the drag handle is hidden. A hover zone near the right edge of the content area (~95% width) reveals the handle with a subtle fade-in. Once the user starts dragging, the handle stays visible until they release and the frame returns to full width. At any width below the container width, the handle is always visible.

### Tests (written first)

- **Vitest browser (Playwright)**: Handle is not visible when frame is at container width. Handle becomes visible on hover near the right edge. Handle stays visible during and after drag to a narrower width.

### Acceptance criteria

- [x] Handle is hidden when frame width equals container width
- [x] Hovering near the right edge (~95% of container) reveals the handle
- [x] Handle fades in smoothly on hover
- [x] Handle remains visible at any width below container width
- [x] Handle stays visible during drag even if started from hover-reveal state
- [x] Returning to full width (via desktop preset) hides the handle again
