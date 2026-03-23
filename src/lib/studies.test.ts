import { describe, expect, it } from "vitest";
import { group_studies, load_studies } from "./studies";
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

  it("preserves all meta fields", () => {
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

describe("group_studies", () => {
  it("places general studies in the standalone list", () => {
    const study = make_meta({ id: "solo", category: "General" });

    const result = group_studies([study]);

    expect(result.breakdowns.size).toBe(0);
    expect(result.standalone).toEqual([study]);
  });

  it("places named-category studies in breakdowns", () => {
    const study = make_meta({ id: "stripe-toggle", category: "Stripe Pricing" });

    const result = group_studies([study]);

    expect(result.standalone).toEqual([]);
    expect(result.breakdowns.get("Stripe Pricing")).toEqual([study]);
  });

  it("separates mixed input into breakdowns and standalone", () => {
    const solo = make_meta({ id: "solo", category: "General" });
    const stripe_a = make_meta({ id: "stripe-a", category: "Stripe Pricing" });
    const stripe_b = make_meta({ id: "stripe-b", category: "Stripe Pricing" });
    const linear = make_meta({ id: "linear-cmd", category: "Linear Command Palette" });

    const result = group_studies([solo, stripe_a, stripe_b, linear]);

    expect(result.standalone).toEqual([solo]);
    expect(result.breakdowns.size).toBe(2);
    expect(result.breakdowns.get("Stripe Pricing")).toEqual([stripe_a, stripe_b]);
    expect(result.breakdowns.get("Linear Command Palette")).toEqual([linear]);
  });

  it("returns empty collections for empty input", () => {
    const result = group_studies([]);

    expect(result.breakdowns.size).toBe(0);
    expect(result.standalone).toEqual([]);
  });

  it("preserves input order within each group", () => {
    const newest = make_meta({ id: "s-new", category: "Stripe", date: "2026-03-20" });
    const oldest = make_meta({ id: "s-old", category: "Stripe", date: "2026-01-01" });

    const result = group_studies([newest, oldest]);

    const ids = result.breakdowns.get("Stripe")!.map((s) => s.id);
    expect(ids).toEqual(["s-new", "s-old"]);
  });
});
