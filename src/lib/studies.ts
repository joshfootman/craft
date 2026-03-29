import type { Meta } from "~/types/study";

export type GroupedStudies = {
  breakdowns: Map<string, Meta[]>;
  standalone: Meta[];
};

export function groupStudies(studies: Meta[]): GroupedStudies {
  const breakdowns = new Map<string, Meta[]>();
  const standalone: Meta[] = [];

  for (const study of studies) {
    if (study.category === "General") {
      standalone.push(study);
    } else {
      const group = breakdowns.get(study.category) ?? [];
      group.push(study);
      breakdowns.set(study.category, group);
    }
  }

  return { breakdowns, standalone };
}

export function loadStudies(globResult: Record<string, { meta: Meta }>): Meta[] {
  return Object.values(globResult)
    .map((mod) => mod.meta)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.id.localeCompare(a.id, undefined, { numeric: true }),
    );
}
