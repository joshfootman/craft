# Haoqi Design Motion Studies

Reference: [haoqi.design](https://haoqi.design/)

This document tracks four motion studies inspired by Haoqi Wen's portfolio. Reproduce the interaction principles and timing with original code and assets. Do not copy the site's branded models, stickers, imagery, or written content.

## Status

| Study                       | Priority | Status  | Confidence  | Main technology                   |
| --------------------------- | -------- | ------- | ----------- | --------------------------------- |
| Text scramble               | 1        | Tuning  | Very high   | React, CSS                        |
| Pixel cursor trail          | 2        | Planned | High        | React Three Fiber, GLSL           |
| Arrow-to-hyperspace section | 3        | Planned | Medium-high | React Three Fiber, Three.js, GLSL |
| Falling stickers            | 4        | Planned | High        | React Three Fiber, instancing     |

Status values: `Planned`, `Researching`, `Building`, `Tuning`, or `Complete`.

## Shared Requirements

- Build each effect as an isolated Craft study with its own route and metadata.
- Use original visual assets. The reference implementation's assets are useful only for understanding scale, composition, and behavior.
- Keep frame-by-frame updates outside React's render cycle.
- Cap canvas DPR and reduce simulation work on constrained devices.
- Provide a static or substantially calmer `prefers-reduced-motion` state.
- Disable pointer-specific behavior for coarse pointers when it has no useful touch equivalent.
- Verify desktop and mobile layouts with screenshots and canvas pixel checks.

## 1. Text Scramble

### Reference Behavior

Text starts invisible, then resolves one character at a time. Each active character briefly cycles through random symbols and two accent colors before settling. Multiple lines use different start delays to create a short cascade.

Observed parameters:

- Character set: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-=?/<>[]{}`
- Shared update interval: `40ms`
- Default and display-headline letter stagger: `80ms`
- Small homepage metadata letter stagger: `10ms`
- Display headline line delays: `300ms`, `500ms`, and `700ms`
- Display headline lines: `I bring`, `craft & taste`, and `to digital work`
- Display type: TikTok Sans, `700` weight, uppercase, unit line height, `"wdth" 120`
- No easing curve; a `40ms` stepped ticker drives the effect
- Intersection threshold: `0.1`
- Accent colors: lime plus a darker or lighter companion based on theme
- Entrance plays once after both the element and route transition are ready

### Proposed Study

Create a small `TextScramble` React component for one line of text. Compose several instances in the demo so line length and start delay produce the headline cascade. Keep typography and layout outside the component.

### Acceptance Criteria

- [x] Characters reveal in a stable left-to-right order.
- [x] Each headline line runs as an independent instance with source-matched timing.
- [x] All lines keep the same left anchor while their temporary glyph widths change.
- [x] The final text is selectable and accessible to screen readers.
- [x] Reduced motion renders the settled text immediately.
- [x] Use TikTok Sans at the reference's `"wdth" 120` setting.

### Deeper-Dive Questions

- Should replay occur on every viewport entry, on demand, or only once?
- Should the random sequence be seeded for deterministic visual tests?
- Is the two-step color flash important, or is character replacement alone enough?

## 2. Pixel Cursor Trail

### Reference Behavior

The pointer is represented by a lime square snapped to a fixed pixel grid. Previous cells form a short trail whose strength decays smoothly. The cursor is composited into the WebGL post-processing pipeline rather than rendered as DOM elements.

Observed parameters:

- Grid cell size: `16px`
- Active trail samples: `14`
- Backing trail buffer: `16`
- Color: `#c0fe04`
- Trail strength damping rate: approximately `2`
- A new sample is added only when the pointer enters a different grid cell
- Trail decay continues after the pointer leaves the viewport

### Proposed Study

Start with a full-screen shader pass fed by a fixed-size uniform array. Track pointer coordinates in CSS pixels, quantize them to cells, shift the trail only when the cell changes, and damp trail strengths in `useFrame`.

### Acceptance Criteria

- [ ] The lead square stays aligned to the same CSS grid at DPR 1 and DPR 2.
- [ ] Slow movement creates discrete cells; fast movement still reads as a continuous trail.
- [ ] The trail fades without React state updates per frame.
- [ ] Pointer leave, window blur, and visibility changes clear the active point cleanly.
- [ ] Native controls and text selection remain usable.
- [ ] Coarse pointers and reduced motion receive a normal cursor with no trail.

### Deeper-Dive Questions

- Should the study hide the native cursor or show both cursors for comparison?
- Should gaps between fast pointer samples be interpolated?
- Can a Canvas 2D version match the shader closely enough to serve as a cheaper fallback?

## 3. Arrow-to-Hyperspace Section

### Reference Behavior

This is one coordinated, scroll-bound sequence rather than a collection of independent effects. A 3D arrow grows from an in-page object into a full-screen transition, rotates, and reveals a procedural field of radial light streaks. The section remains sticky while typography changes through four stages. A scroll-driven ellipse sculpture appears in the third stage before the sequence resolves into the final scene.

Observed structure:

- Sticky section height: `8 * viewportHeight`
- Stages `0-1`: `Innovate / with / purpose`
- Stages `2-3`: `Innovate / with a / human touch`
- Stages `4-5`: four supporting text groups plus seven animated ellipses
- Stages `6-7`: `FUTURE-FIRST / ALWAYS`
- Arrow scale is tied to its DOM target's viewport position
- Arrow rotation reaches about `180deg` during the full-screen expansion
- Hyperspace streaks are procedural GLSL lines with per-ray variation and animated color
- Character entrances use deterministic, seeded stagger offsets

### Proposed Study

Treat the sequence as a finite state machine driven by normalized section progress. Keep one source of truth for the arrow transform, shader uniforms, typography stage, and ellipse progress. Use an original arrow model or a simple procedural pointer mesh.

Build it in four vertical slices:

1. Sticky section, normalized progress, and stage switching.
2. DOM-positioned arrow that expands and spins into a full-screen mesh.
3. Hyperspace shader whose speed, density, brightness, and color respond to progress.
4. Typography and ellipse choreography layered over the canvas.

### Acceptance Criteria

- [ ] Scrolling forward and backward produces reversible, deterministic states.
- [ ] The arrow remains visually continuous while changing from in-page scale to full-screen scale.
- [ ] No stage boundary flashes, remounts the canvas, or resets the shader clock.
- [ ] Text remains readable against the brightest shader frames.
- [ ] Resize and orientation changes preserve the current stage and framing.
- [ ] Mobile uses reduced ray density and DPR without changing the narrative timing.
- [ ] Reduced motion replaces the eight-viewport journey with a short static composition.

### Deeper-Dive Questions

- Which part provides the strongest impression: arrow continuity, streak shader, or typography staging?
- Should progress follow raw scroll position or a gently filtered value?
- Can the arrow-to-fullscreen handoff use one mesh throughout, avoiding a crossfade?
- How many rays and shader operations can mid-range mobile GPUs sustain at 60 fps?

## 4. Falling Stickers

### Reference Behavior

Twelve transparent sticker images are packed into a texture atlas and rendered as instanced planes. Stickers fall, drift sideways with sinusoidal wind, rotate, fade near the beginning and end of their path, and recycle with a different texture. A click or short tap emits a temporary burst from the pointer position.

Observed parameters:

- Reference sticker count: `12`
- Base spawn width and height: `32` by `24` world units
- Initial vertical position: `24`
- Fall distance: `48`
- Wind strength: `1.8`
- Wind frequency: `0.3`
- Base scale: `1.4`
- Rotation speed: `0.8`
- Fall speed: `1.8` with randomized variation
- Click bursts stagger particles by roughly `40-80ms`
- Clicks are ignored after a drag, long press, or active text selection

### Proposed Study

Pack a small set of original transparent PNGs into a runtime atlas. Render them through one instanced mesh with per-instance position, rotation, scale, texture rectangle, and lifecycle state. Use object pools so normal falling particles recycle and click particles expire without allocation churn.

### Acceptance Criteria

- [ ] Stickers preserve their source aspect ratios within the shared atlas.
- [ ] Wind, rotation, and fall-speed variation feel organic without becoming chaotic.
- [ ] Recycling does not repeat the same sticker conspicuously.
- [ ] Click bursts originate at the pointer's world-space position.
- [ ] Dragging, selecting text, and long pressing do not emit bursts.
- [ ] The active instance count remains bounded during repeated clicking.
- [ ] Reduced motion shows a static sticker composition or removes the effect.

### Deeper-Dive Questions

- Should stickers collide, or is depth sorting and overlap enough?
- Should the first implementation build its atlas at runtime or use a prepacked asset?
- What is the lowest instance count that still creates a convincing field?

## Suggested Build Order

1. Text scramble: establishes the study pattern with little rendering risk.
2. Pixel cursor trail: introduces a small full-screen shader and pointer pipeline.
3. Falling stickers: adds texture atlasing, instancing, and lifecycle management.
4. Arrow-to-hyperspace: combines the earlier scroll, shader, 3D, and typography lessons.

## Source Notes

The reference site ships minified production code without public source maps. The observed values above come from its live homepage bundle and rendered behavior. They are starting points for study, not requirements for an exact clone.
