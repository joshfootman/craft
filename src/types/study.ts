import type { StudyTag } from "~/lib/constants";

export type Status = "draft" | "published";
export type Theme = "dark" | "light" | "any";
export type Viewport = "mobile" | "desktop" | "any";

export type Meta = {
  id: string;
  title: string;
  description: string;
  status: Status;
  tags: readonly StudyTag[];
  category: string;
  inspiration?: string[];
  date: string; // ISO 8601 e.g. '2026-03-21'
  theme: Theme;
  viewport: Viewport;
};
