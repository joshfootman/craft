import type { Meta } from "~/types/study";

export function load_studies(glob_result: Record<string, { meta: Meta }>): Meta[] {
  return Object.values(glob_result)
    .map((mod) => mod.meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}
