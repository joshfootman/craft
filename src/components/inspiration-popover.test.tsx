import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { InspirationPopover } from "./inspiration-popover";

afterEach(cleanup);

describe("InspirationPopover", () => {
  it("does not render when inspiration is undefined", () => {
    render(<InspirationPopover />);

    expect(
      screen.queryByRole("button", { name: /inspiration/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render when inspiration is empty", () => {
    render(<InspirationPopover inspiration={[]} />);

    expect(
      screen.queryByRole("button", { name: /inspiration/i }),
    ).not.toBeInTheDocument();
  });

  it("renders button when inspiration has URLs", () => {
    render(<InspirationPopover inspiration={["https://example.com"]} />);

    expect(
      screen.getByRole("button", { name: /inspiration/i }),
    ).toBeInTheDocument();
  });
});
