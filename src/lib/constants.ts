export const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: 768,
  mobile: 390,
} as const;

export type Device = keyof typeof DEVICE_WIDTHS;
