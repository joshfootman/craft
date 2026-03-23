import { describe, expect, it } from "vitest";
import { get_pattern } from "./patterns";

describe("get_pattern", () => {
  it("returns the same result for the same id", () => {
    const a = get_pattern("stripe-toggle");
    const b = get_pattern("stripe-toggle");

    expect(a).toEqual(b);
  });

  it("produces different results for different ids", () => {
    const results = new Set(
      ["alpha", "beta", "gamma", "delta", "epsilon"].map((id) => JSON.stringify(get_pattern(id))),
    );

    expect(results.size).toBeGreaterThan(1);
  });

  it("returns values within valid ranges", () => {
    const valid_patterns = ["dots", "plus", "vertical-bars", "horizontal-bars", "diagonal"];
    const valid_sizes = [12, 16, 20];
    const ids = ["foo", "bar", "baz", "qux", "hello-world", "001-placeholder"];

    for (const id of ids) {
      const result = get_pattern(id);

      expect(valid_patterns).toContain(result.pattern);
      expect(valid_sizes).toContain(result.size);
      expect(result.bg).toMatch(/^#[0-9a-f]{6}$/);
      expect(result.fg).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
