import { describe, expect, it } from "vitest";
import { getPattern } from "./patterns";

describe("getPattern", () => {
  it("returns the same result for the same id", () => {
    const a = getPattern("stripe-toggle");
    const b = getPattern("stripe-toggle");

    expect(a).toEqual(b);
  });

  it("produces different results for different ids", () => {
    const results = new Set(
      ["alpha", "beta", "gamma", "delta", "epsilon"].map((id) => JSON.stringify(getPattern(id))),
    );

    expect(results.size).toBeGreaterThan(1);
  });

  it("returns values within valid ranges", () => {
    const validPatterns = ["dots", "plus", "vertical-bars", "horizontal-bars", "diagonal"];
    const validSizes = [12, 16, 20];
    const ids = ["foo", "bar", "baz", "qux", "hello-world", "001-placeholder"];

    for (const id of ids) {
      const result = getPattern(id);

      expect(validPatterns).toContain(result.pattern);
      expect(validSizes).toContain(result.size);
      expect(result.bg).toMatch(/^#[0-9a-f]{6}$/);
      expect(result.fg).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
