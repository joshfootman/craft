# Aardvark Book Club Motion Studies

Reference: [aardvarkbookclub.com](https://www.aardvarkbookclub.com/)

This document turns the Aardvark Book Club site into a set of small, reusable interaction studies. The aim is to reproduce the behavior closely enough to understand its construction, then extract components that work outside the source layout and brand.

Use original copy and substitute assets in the studies. Source assets and bundles are evidence for dimensions, sequencing, timing, and implementation—not dependencies for the finished components.

## What the source uses

The current homepage is a Webflow build with a custom Slater script and stylesheet. The inspected page loads:

- GSAP 3.15 with ScrollTrigger, SplitText, CustomEase, InertiaPlugin, and DrawSVGPlugin
- Lenis 1.3.17 for smooth scrolling
- Smooothy 0.0.35 for drag and wheel-driven sliders
- Barba for page transitions and prefetching
- Canvas 2D image sequences made from numbered WebP frames
- Degular, Champ ExtraBold, and Hello Organic Hand for the contrasting type system

The custom bundle defines three important eases:

```ts
const eases = {
  osmo: "cubic-bezier(0.625, 0.05, 0, 1)",
  path: "cubic-bezier(0.78, 0.18, 0.18, 1)",
  energy: "M0,0 C0.32,0.72 0,1 1,1",
};
```

The site's character comes less from any one library than from four repeated choices:

1. Squash and rotation precede most entrances.
2. Elastic settling creates a handmade, physical response.
3. Elements enter in overlapping groups instead of one sequence at a time.
4. Illustration, type, and controls share the same motion language.

## Study map

| Order | Abstract study                  | Source example                 | Main lesson                               | Effort     |
| ----- | ------------------------------- | ------------------------------ | ----------------------------------------- | ---------- |
| 1     | Elastic character button        | Primary and secondary links    | Split text, keyframes, focus parity       | Small      |
| 2     | Elastic word reveal             | Hero heading and page headings | Distorted anticipation and stagger        | Small      |
| 3     | Handwritten character reveal    | Hero note and section notes    | Fast character-level elastic motion       | Small      |
| 4     | Momentum hover object           | Small illustrations and badges | Pointer velocity, torque, inertia         | Medium     |
| 5     | Reactive card stack             | Promotional callout groups     | Pointer regions and sibling displacement  | Medium     |
| 6     | Elastic drag carousel           | Monthly books and winners      | Drag physics, parallax, card rotation     | Large      |
| 7     | Anchored hover list             | Genre list                     | Shared hover visual and CSS geometry      | Large      |
| 8     | Scroll-scrubbed frame sequence  | How-it-works box sequence      | Progressive loading and scroll mapping    | Large      |
| 9     | Viewport-looping frame sequence | Hero product visual            | Canvas playback lifecycle                 | Medium     |
| 10    | Orchestrated page intro         | Loader and hero entrance       | One master timeline and overlapping cues  | Large      |
| 11    | Composed landing page           | Selected homepage sections     | Integration, cleanup, responsive behavior | Very large |

The first ten studies should remain independent. Study 11 proves that their APIs compose without importing source-specific selectors or timing assumptions.

## 1. Elastic character button

### Reference behavior

Each label is split into characters. On hover, the characters dip to `yPercent: 55`, compress vertically to `scaleY: 0.3`, and rotate `17deg` during the first 20% of the animation. They then rebound to rest with `elastic.out(1, 0.4)`.

Observed parameters:

- Total duration: `0.725s`
- Stagger distributed across: `0.225s`
- Leave/reset duration: `0.2s`
- Leave/reset ease: `power2.out`
- Runs only for fine pointers, hover-capable devices, and no reduced-motion preference
- Keyboard focus uses the same response

### Reusable component

```tsx
<ElasticTextButton asChild stagger="forward">
  <a href="/example">Explore books</a>
</ElasticTextButton>
```

The wrapper owns splitting and animation. The child owns semantics, color, shape, and navigation. Use Base UI's `Button` only when the result performs an action; preserve an anchor for navigation.

### Acceptance criteria

- [x] Hover and `:focus-visible` produce the same animation.
- [x] Leaving mid-animation settles every character cleanly.
- [x] The accessible name contains the label once, not once per split character.
- [x] The component preserves child refs and event handlers.
- [x] Reduced motion and coarse pointers render an ordinary label.
- [x] Variable-width labels do not shift surrounding layout.

## 2. Elastic word reveal

### Reference behavior

Hero headings start with each word translated diagonally, slightly narrow, almost flat vertically, rotated, and transparent. The words regain their natural proportions with an elastic settle.

Observed initial state:

- `xPercent: 40`
- `yPercent: -10`
- `scaleX: 0.85`
- `scaleY: 0.1`
- `rotate: 8deg`
- `opacity: 0`
- Transform origin: top left

Observed entrance:

- Duration: `0.875s`
- Stagger: `0.088s` per word
- Ease: `elastic.out(1, 0.72)`
- Opacity becomes visible during the first 10% of each word's keyframes

### Reusable component

Build `ElasticWordReveal`, with `trigger="mount" | "in-view" | "manual"`, a forwarded timeline ref, and a render mode that preserves semantic heading markup.

### What makes it effective

The reveal does not merely slide words into place. The strong vertical squash supplies anticipation, while the elastic restoration makes the heavy type feel rubbery. A short, constant stagger lets phrases remain readable as phrases.

## 3. Handwritten character reveal

### Reference behavior

Characters begin at `x: -0.25em`, `y: 0.5em`, `rotate: 22deg`, and zero opacity. They resolve with `elastic.out(1, 0.75)` over `0.75s`, staggered by `0.016s`. In the scroll-scrubbed box sequence, the duration becomes `0.625s` and stagger `0.011s`.

### Reusable component

Make this a preset of a lower-level `SplitTextReveal`, not an unrelated component:

```tsx
<SplitTextReveal split="chars" preset="handwritten" trigger="in-view">
  Shipping to the USA and Canada
</SplitTextReveal>
```

The study should compare characters, words, and lines, and document why the loose handwritten font tolerates a denser stagger than the display face.

## 4. Momentum hover object

### Reference behavior

The bundle measures pointer velocity once per animation frame. On pointer entry it calculates torque around the target's center, then sends x velocity, y velocity, and rotational velocity into GSAP InertiaPlugin.

Observed parameters:

- Position velocity multiplier: `25`
- Rotation multiplier: `15`
- Inertia resistance: `160`
- X/Y velocity clamp: `-1080..1080`
- Rotation velocity clamp: `-60..60`
- Fine pointers only

### Reusable component

Build `MomentumHover` around a target ref. Its public API should expose multipliers, clamps, resistance, and a disabled state. Keep pointer sampling outside React state.

### Deeper-dive questions

- How much of the feel comes from the entry velocity versus the offset from center?
- Should repeated entries overwrite, blend with, or add to existing inertia?
- Can Motion's inertia transition match the source closely enough to avoid GSAP InertiaPlugin?

Implement both engines behind the same demo controls. Use GSAP as the fidelity baseline and Motion as the portability comparison.

## 5. Reactive card stack

### Reference behavior

The source divides a horizontal container into one pointer region per card. Entering a region straightens and enlarges that card while pushing the other cards sideways. Cards begin and return to slightly randomized x, y, and rotation values.

Observed parameters:

- Entrance: cards rise from `yPercent: +150`
- Entrance duration: `1.05s`
- Entrance stagger: `0.088s`
- Active scale: `1.075`
- Active/reset duration: `0.85s`
- Ease: `elastic.out(1, 0.75)`
- Sibling displacement: `45 / (siblingIndex - activeIndex)` percent

### Reusable component

Call the abstraction `ReactiveCardStack`. It receives an array of cards and supplies active state, transforms, and pointer-zone handling through context or render props. Seed the random offsets so screenshots and tests remain stable.

## 6. Elastic drag carousel

### Reference behavior

The monthly book carousel is a non-infinite, unsnapped Smooothy slider on desktop. Drag and wheel input update a lerped position. Cards counter-rotate relative to their travel and expose next/previous controls. Other page carousels reuse the core with centered snapping or variable widths.

Observed monthly-books configuration:

- Drag sensitivity: `0.008`
- Lerp factor: `0.225`
- Scroll sensitivity: `1`
- Bounce limit: `0.5`
- No snapping and no infinite loop
- Desktop activation at `992px`
- End offset: wrapper width minus `32px`

### Reusable architecture

Separate the study into:

- `useDragTrack`: input, bounds, velocity, interpolation, and accessibility state
- `Carousel`: semantic viewport, track, items, and controls
- `useParallaxItem`: item-local translation and rotation derived from track progress
- Base UI button primitives for previous and next controls

Prefer Motion values for drag and spring experiments. Use a small `requestAnimationFrame` controller if matching Smooothy's lerp proves clearer than coercing a spring into the same behavior.

### Acceptance criteria

- [ ] Pointer drag, wheel input, buttons, and keyboard controls agree on one position model.
- [ ] Bounds include a soft overscroll and deterministic return.
- [ ] Card rotation responds to velocity without remaining tilted at rest.
- [ ] Controls expose disabled states at both ends.
- [ ] Mobile has a deliberate native-scroll or touch-drag behavior.
- [ ] Resize recomputes bounds without jumping the current item.

## 7. Anchored hover list

### Reference behavior

The genre section looks like a list interaction but is implemented as a shared visual anchored to the active list item. Item bounds are cached. CSS custom properties describe the start index, active index, width difference, random offsets, and pointer parallax. The visual translates and resizes between items instead of mounting a new visual for each one.

Important source behaviors:

- Cache every item's x, y, width, and height.
- Treat the first hovered item as the anchor.
- Move the shared scope by the delta from that anchor.
- Resize it by the active item's width difference.
- Add small randomized transforms to layered boxes.
- Map pointer position inside the list into `--px` and `--py` parallax values.
- Wait for the scale-out transition to finish before clearing the anchor.

### Reusable component

Name the abstraction `AnchoredHoverList` or `SharedHoverPreview`. Its API should decouple list content from the preview renderer:

```tsx
<AnchoredHoverList
  items={genres}
  renderItem={(genre) => genre.label}
  renderPreview={(genre) => <BookStack covers={genre.covers} />}
/>
```

Start with colored planes or book-cover images. A 3D version can replace `BookStack` without changing the list's geometry controller.

### Why it feels good

Continuity is the key. One preview appears to travel through the list, so rapid hovering reads as one physical object responding to intent. The irregular layers stop its precise measurement from feeling mechanical.

## 8. Scroll-scrubbed frame sequence

### Reference behavior

The how-it-works/product-box sequence is not a 3D model. It is a numbered image sequence drawn into a cover-fitted Canvas 2D element and mapped directly to normalized ScrollTrigger progress.

Loading strategy:

1. Load the first frame and draw it immediately.
2. Load the last frame.
3. Recursively bisect the remaining range, loading midpoint frames first.
4. If the requested frame is absent, draw the nearest loaded frame.

Choreography:

- Canvas progress maps to `round(progress * (frames - 1))`.
- Handwritten text enters between progress `0.30` and `0.60`, then reverses.
- Final copy and buttons enter from progress `0.81`.
- The canvas moves from `-25%` to `0%` during the first quarter on desktop and from `-50%` on mobile.
- Reduced motion draws a supplied static frame.

### Reusable architecture

- `useImageSequence`: URL generation, prioritized loading, cache, nearest-frame lookup, and cleanup
- `CanvasCover`: DPR-aware sizing and cover-fit drawing
- `ScrollSequence`: converts section progress into a frame and named cue states
- `SequenceCue`: threshold-based enter/exit timelines for overlay content

Do not put loaded images or frame changes in React state. Keep them in refs and draw imperatively.

### Alternative 3D track

After matching the image sequence, build a second renderer with React Three Fiber using a simple box. Feed both renderers the same normalized progress. This isolates the real lesson—scroll choreography—from the asset format.

## 9. Viewport-looping frame sequence

### Reference behavior

The desktop hero visual uses the same progressive image loader, but its playhead loops at a configured FPS while the section intersects the viewport. It pauses when the section leaves. The source uses a static image for reduced motion and does not initialize the sequence below `992px`.

### Reusable component

Reuse `useImageSequence` and `CanvasCover`. Add `LoopingImageSequence`, whose lifecycle is controlled by Intersection Observer or ScrollTrigger callbacks. Compare memory use between decoded `ImageBitmap` frames and ordinary images, and close bitmaps during cleanup.

## 10. Orchestrated page intro

### Reference behavior

The initial visit combines a drawn SVG loader, a rotating elastic logo, header entrance, expanding hero background, word reveal, supporting-copy entrance, handwritten character reveal, and product visual. These motions share one GSAP timeline and overlap around a common label.

Selected source timings:

- Loader path: `1.25s` after a `0.65s` delay; stroke expands before the path collapses to its endpoint.
- Loader logo enters over `0.65s` with `elastic.out(1, 0.72)` and exits over `0.6s` with matching elastic-in motion.
- Header begins around `1.1s`, lasts `0.5s`, and uses the custom `energy` ease.
- Desktop background expands from `ellipse(20% 0% at 100% 100%)` to `ellipse(150% 130% at 100% 100%)` over `1.1s`.
- Heading, copy, button, note, looping sequence, and hero visual all overlap rather than queue.
- Hero visual enters from `y: 5em`, `rotate: -43deg` to `rotate: -21deg` over `0.75s`.

### Proposed study

Build this last among the isolated studies. Compose the earlier primitives into `PageIntro`, but keep the master timeline in the page-level component. Child components should expose targets or paused timelines, not create autonomous mount animations that compete with orchestration.

### Deeper-dive questions

- Can the loader be skipped on repeat visits without changing the hero's relative timing?
- Which elements should become visible before fonts and sequence frames are ready?
- Should the background reveal use `clip-path`, a pseudo-element transform, or an SVG mask?
- How does the intro recover if the tab is hidden midway through playback?

## Supporting micro-studies

These are useful but should follow the main set:

- `PlopIn`: scale `0`, `rotate(-20deg)`, and `y(-4em)` to scale `1`, `rotate(11deg)` over `0.7s` with elastic easing.
- `EmojiRain`: a pooled particle burst with randomized delay, scale, rotation, ascent, and side-to-side yoyo motion.
- `Accordion`: Base UI Accordion with source-inspired icon and content transitions.
- `FooterParallax`: a clipped footer layer whose contents lag page scroll.
- `CurveTagline`: text or decoration following an SVG path, with DrawSVG as an optional comparison.

## Shared implementation requirements

### Component boundaries

- React owns composition, semantics, configuration, and discrete UI state.
- GSAP owns orchestrated timelines, ScrollTrigger, and imperative split-text effects.
- Motion owns isolated gestures, values, and spring/inertia comparisons.
- Base UI owns accessible behavior for buttons, accordions, dialogs, and tabs.
- React Three Fiber owns optional 3D renderers; it should consume progress rather than calculate scroll state.

Avoid a generic `AnimatedSection` component. It would hide the mechanics the studies are meant to teach. Prefer small primitives such as `SplitTextReveal`, `useSectionProgress`, `CanvasCover`, and `useDragTrack`.

### Lifecycle

Every study must clean up timelines, ScrollTriggers, pointer listeners, resize listeners, decoded images, RAF callbacks, and split text. Use `gsap.context()` inside React effects and revert it during cleanup.

### Accessibility

- Preserve unsplit text for screen readers and selection.
- Match pointer interactions with keyboard behavior where the interaction performs an action.
- Disable decorative pointer effects on coarse pointers.
- Provide static or substantially shorter reduced-motion states.
- Never make smooth scrolling a requirement for navigation or focus.
- Keep carousel controls and slide status understandable without drag input.

### Performance

- Keep per-frame data in refs, Motion values, CSS variables, or renderer-local objects.
- Avoid React renders during pointer tracking, scroll scrubbing, and frame playback.
- Cap canvas DPR; start with `Math.min(devicePixelRatio, 2)` rather than the source's uncapped DPR.
- Pause looping work outside the viewport and while the document is hidden.
- Seed random values when they affect visual regression tests.
- Test decoded image memory before choosing frame count and resolution.

### Testing

Each study should include:

- Unit tests for progress mapping, bounds, thresholds, and URL generation
- Browser tests for keyboard behavior and reduced motion
- Screenshot states at rest, mid-animation, active hover, and mobile layout
- A debug mode that displays progress, frame index, pointer velocity, and active cue

## Recommended build phases

### Phase 1: establish the motion language

Build the elastic character button, elastic word reveal, handwritten reveal, and plop-in preset. These share split-text infrastructure and source eases.

Deliverables:

- `SplitText`-style accessible React primitive
- GSAP presets with documented timing
- Comparison controls for duration, stagger, amplitude, and ease

### Phase 2: pointer physics

Build momentum hover and reactive card stack. Compare GSAP InertiaPlugin with Motion inertia and springs.

Deliverables:

- RAF-throttled pointer-velocity hook
- Deterministic random transform utility
- Fine-pointer and reduced-motion gates

### Phase 3: spatial navigation

Build the elastic carousel and anchored hover list. These require careful bounds measurement, resize behavior, and shared transform state.

Deliverables:

- Drag-track controller
- Accessible carousel shell
- Shared-preview geometry controller
- Plane/image preview followed by an optional R3F renderer

### Phase 4: canvas sequences and scroll choreography

Build the scroll-scrubbed and looping image sequences. Then replace one sequence with a procedural cube or book-box model driven by the same progress API.

Deliverables:

- Progressive sequence loader
- Canvas cover renderer
- Normalized section-progress hook
- Threshold cue controller
- Static reduced-motion fallback

### Phase 5: orchestration and composition

Build the page intro and a reduced landing-page reconstruction from the finished studies. Recreate the motion and layout closely while using substitute copy and assets.

Deliverables:

- Page-level master timeline
- Responsive composition
- Cross-study cleanup audit
- Performance profile and lessons-learned document

## Suggested first implementation set

Start with four routes:

1. `013-aardvark-elastic-text-button`
2. `014-aardvark-elastic-word-reveal`
3. `015-aardvark-handwritten-reveal`
4. `016-aardvark-momentum-hover`

These give quick, testable results and establish the easing, split-text, pointer, accessibility, and cleanup patterns needed by the larger sections.

## Open decisions

- Use GSAP SplitText for direct fidelity, or write an accessible in-house splitter to avoid a plugin dependency?
- Treat Lenis as an optional integration study, or omit it until a native-scroll version exposes a real need?
- Recreate Smooothy's lerp controller directly, or use Motion values and accept a slightly different response?
- Store substitute frame sequences in the repository, generate them from a simple 3D scene, or begin with CSS-colored diagnostic frames?
- Make the final composition a faithful homepage slice or a neutral pattern gallery that demonstrates the same systems?

The best default is: write the splitter, use native scrolling until proven inadequate, reproduce the carousel's position model directly, generate a small original sequence, and finish with a faithful but unbranded homepage slice.
