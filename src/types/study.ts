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
