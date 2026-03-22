import { describe, expect, it } from "vitest";
import { load_studies } from "./studies";
import type { Meta } from "~/types/study";

function make_glob_result(studies: Meta[]): Record<string, { meta: Meta }> {
  return Object.fromEntries(
    studies.map((meta) => [`/src/pages/studies/${meta.id}/meta.ts`, { meta }]),
  );
}

function make_meta(overrides: Partial<Meta> = {}): Meta {
  return {
    id: "test-study",
    title: "Test Study",
    description: "A test study",
    status: "published",
    techniques: [],
    tags: [],
    category: "test",
    date: "2026-01-01",
    theme: "light",
    viewport: "desktop",
    ...overrides,
  };
}

describe("load_studies", () => {
  it("returns empty array for empty glob result", () => {
    expect(load_studies({})).toEqual([]);
  });

  it("returns studies sorted by date descending", () => {
    const oldest = make_meta({ id: "oldest", date: "2026-01-01" });
    const middle = make_meta({ id: "middle", date: "2026-02-15" });
    const newest = make_meta({ id: "newest", date: "2026-03-20" });

    const result = load_studies(make_glob_result([oldest, newest, middle]));

    expect(result.map((s) => s.id)).toEqual(["newest", "middle", "oldest"]);
  });

  it("preserves all metadata fields", () => {
    const study = make_meta({
      id: "full",
      title: "Full Study",
      description: "All fields populated",
      techniques: ["motion.dev"],
      tags: ["motion", "spring"],
      category: "motion",
      inspiration: ["https://example.com"],
      theme: "dark",
      viewport: "mobile",
    });

    const [result] = load_studies(make_glob_result([study]));

    expect(result).toEqual(study);
  });
});
