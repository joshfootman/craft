import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { StudyVariants } from "./study-variants";

afterEach(cleanup);

describe("StudyVariants", () => {
  it("renders tab triggers for each variant label", () => {
    const variants = [
      { label: "Button", component: () => <div>button content</div> },
      { label: "Sidebar", component: () => <div>sidebar content</div> },
    ];

    render(<StudyVariants variants={variants} />);

    expect(screen.getByRole("tab", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Sidebar" })).toBeInTheDocument();
  });

  it("shows the first variant by default", () => {
    const variants = [
      { label: "Button", component: () => <div>button content</div> },
      { label: "Sidebar", component: () => <div>sidebar content</div> },
    ];

    render(<StudyVariants variants={variants} />);

    expect(screen.getByText("button content")).toBeInTheDocument();
    expect(screen.queryByText("sidebar content")).not.toBeInTheDocument();
  });

  it("switches to another variant when its tab is clicked", () => {
    const variants = [
      { label: "Button", component: () => <div>button content</div> },
      { label: "Sidebar", component: () => <div>sidebar content</div> },
    ];

    render(<StudyVariants variants={variants} />);

    fireEvent.click(screen.getByRole("tab", { name: "Sidebar" }));

    expect(screen.getByText("sidebar content")).toBeInTheDocument();
    expect(screen.queryByText("button content")).not.toBeInTheDocument();
  });

  it("renders without tabs when there is only one variant", () => {
    const variants = [{ label: "Button", component: () => <div>button content</div> }];

    render(<StudyVariants variants={variants} />);

    expect(screen.getByText("button content")).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
});
