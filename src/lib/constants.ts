export const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: 768,
  mobile: 390,
} as const;

export type Device = keyof typeof DEVICE_WIDTHS;

export const STUDY_PATTERN_TAGS = [
  "Button",
  "Link",
  "Nav",
  "Menu",
  "Drawer",
  "Modal",
  "Card",
  "Hero",
  "Tabs",
  "Accordion",
  "Tooltip",
  "Popover",
  "Input",
  "Cursor",
  "Loader",
  "Gallery",
  "Carousel",
  "Marquee",
] as const;

export const STUDY_MOTION_TAGS = [
  "Hover",
  "Click",
  "Reveal",
  "Swap",
  "Slide",
  "Fade",
  "Scale",
  "Rotate",
  "Rotation",
  "Opacity",
  "Stagger",
  "Spring",
  "Easing",
  "Parallax",
  "Morph",
  "Mask",
  "Split",
  "Underline",
] as const;

export const STUDY_STACK_TAGS = [
  "CSS",
  "Motion",
  "GSAP",
  "SVG",
  "Canvas",
  "WebGL",
  "Three",
] as const;

export const STUDY_TAGS = [
  ...STUDY_PATTERN_TAGS,
  ...STUDY_MOTION_TAGS,
  ...STUDY_STACK_TAGS,
  "Complete",
] as const;

export type StudyTag = (typeof STUDY_TAGS)[number];
