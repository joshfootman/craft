import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { StudyContent } from "./study-content";
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

function render_study(meta: Meta, children: React.ReactNode = <div>study</div>) {
  return render(
    <SidebarProvider>
      <StudyContent meta={meta}>{children}</StudyContent>
    </SidebarProvider>,
  );
}

describe("StudyContent", () => {
  it("renders title and tags in the header", () => {
    const meta = make_meta({
      title: "Spring List",
      tags: ["motion", "spring"],
    });

    render_study(meta);

    expect(screen.getByText("Spring List")).toBeInTheDocument();
    expect(screen.getByText("motion")).toBeInTheDocument();
    expect(screen.getByText("spring")).toBeInTheDocument();
  });

  it("defaults to desktop device when viewport is desktop", () => {
    const meta = make_meta({ viewport: "desktop" });

    render_study(meta);

    expect(screen.getByRole("button", { name: "desktop" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "mobile" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("applies data-theme from meta", () => {
    const meta = make_meta({ theme: "dark" });

    const { container } = render(
      <SidebarProvider>
        <StudyContent meta={meta}><div>study</div></StudyContent>
      </SidebarProvider>,
    );

    expect(container.querySelector("[data-theme]")).toHaveAttribute(
      "data-theme",
      "dark",
    );
  });

  it("defaults to mobile device when viewport is mobile", () => {
    const meta = make_meta({ viewport: "mobile" });

    render_study(meta);

    expect(screen.getByRole("button", { name: "mobile" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "desktop" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
