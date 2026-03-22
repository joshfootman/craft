import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CommandPaletteContent } from "./command-palette";
import type { Meta } from "~/types/study";

afterEach(cleanup);

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

describe("CommandPaletteContent", () => {
  it("renders all studies", () => {
    const studies = [
      make_meta({ id: "a", title: "Spring List" }),
      make_meta({ id: "b", title: "Flip Card" }),
    ];

    render(<CommandPaletteContent studies={studies} />);

    expect(screen.getByText("Spring List")).toBeInTheDocument();
    expect(screen.getByText("Flip Card")).toBeInTheDocument();
  });

  it("renders tags for studies", () => {
    const studies = [make_meta({ id: "a", title: "Spring List", tags: ["motion", "spring"] })];

    render(<CommandPaletteContent studies={studies} />);

    expect(screen.getByText("motion · spring")).toBeInTheDocument();
  });

  it("shows empty state when no studies match", () => {
    render(<CommandPaletteContent studies={[]} />);

    expect(screen.getByText("No studies found.")).toBeInTheDocument();
  });
});
