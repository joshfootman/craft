import { describe, expect, it } from "vitest";
import { groupStudies, loadStudies } from "./studies";
import type { Meta } from "~/types/study";

function makeGlobResult(studies: Meta[]): Record<string, { meta: Meta }> {
  return Object.fromEntries(
    studies.map((meta) => [`/src/pages/studies/${meta.id}/meta.ts`, { meta }]),
  );
}

function makeMeta(overrides: Partial<Meta> = {}): Meta {
  return {
    id: "test-study",
    title: "Test Study",
    description: "A test study",
    status: "published",
    tags: [],
    category: "test",
    date: "2026-01-01",
    theme: "light",
    viewport: "desktop",
    ...overrides,
  };
}

describe("loadStudies", () => {
  it("returns empty array for empty glob result", () => {
    expect(loadStudies({})).toEqual([]);
  });

  it("returns studies sorted by date descending", () => {
    const oldest = makeMeta({ id: "oldest", date: "2026-01-01" });
    const middle = makeMeta({ id: "middle", date: "2026-02-15" });
    const newest = makeMeta({ id: "newest", date: "2026-03-20" });

    const result = loadStudies(makeGlobResult([oldest, newest, middle]));

    expect(result.map((s) => s.id)).toEqual(["newest", "middle", "oldest"]);
  });

  it("breaks same-day ties by id descending", () => {
    const study004 = makeMeta({ id: "004-osmo-underline-hover", date: "2026-03-29" });
    const study005 = makeMeta({ id: "005-osmo-intro", date: "2026-03-29" });

    const result = loadStudies(makeGlobResult([study004, study005]));

    expect(result.map((s) => s.id)).toEqual(["005-osmo-intro", "004-osmo-underline-hover"]);
  });

  it("preserves all meta fields", () => {
    const study = makeMeta({
      id: "full",
      title: "Full Study",
      description: "All fields populated",
      tags: ["Motion", "Spring"],
      category: "motion",
      inspiration: ["https://example.com"],
      theme: "dark",
      viewport: "mobile",
    });

    const [result] = loadStudies(makeGlobResult([study]));

    expect(result).toEqual(study);
  });
});

describe("groupStudies", () => {
  it("places general studies in the standalone list", () => {
    const study = makeMeta({ id: "solo", category: "General" });

    const result = groupStudies([study]);

    expect(result.breakdowns.size).toBe(0);
    expect(result.standalone).toEqual([study]);
  });

  it("places named-category studies in breakdowns", () => {
    const study = makeMeta({ id: "stripe-toggle", category: "Stripe Pricing" });

    const result = groupStudies([study]);

    expect(result.standalone).toEqual([]);
    expect(result.breakdowns.get("Stripe Pricing")).toEqual([study]);
  });

  it("separates mixed input into breakdowns and standalone", () => {
    const solo = makeMeta({ id: "solo", category: "General" });
    const stripeA = makeMeta({ id: "stripe-a", category: "Stripe Pricing" });
    const stripeB = makeMeta({ id: "stripe-b", category: "Stripe Pricing" });
    const linear = makeMeta({ id: "linear-cmd", category: "Linear Command Palette" });

    const result = groupStudies([solo, stripeA, stripeB, linear]);

    expect(result.standalone).toEqual([solo]);
    expect(result.breakdowns.size).toBe(2);
    expect(result.breakdowns.get("Stripe Pricing")).toEqual([stripeA, stripeB]);
    expect(result.breakdowns.get("Linear Command Palette")).toEqual([linear]);
  });

  it("returns empty collections for empty input", () => {
    const result = groupStudies([]);

    expect(result.breakdowns.size).toBe(0);
    expect(result.standalone).toEqual([]);
  });

  it("preserves input order within each group", () => {
    const newest = makeMeta({ id: "s-new", category: "Stripe", date: "2026-03-20" });
    const oldest = makeMeta({ id: "s-old", category: "Stripe", date: "2026-01-01" });

    const result = groupStudies([newest, oldest]);

    const ids = result.breakdowns.get("Stripe")!.map((s) => s.id);
    expect(ids).toEqual(["s-new", "s-old"]);
  });
});
