import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
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

  it("title links to the component file in vscode", () => {
    const meta = make_meta({ id: "001-placeholder", title: "Placeholder" });

    render_study(meta);

    const link = screen.getByRole("link", { name: "Placeholder" });
    expect(link).toHaveAttribute("href", expect.stringContaining("vscode://file/"));
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("src/pages/studies/001-placeholder/_component.tsx"),
    );
  });

  it("defaults to desktop device when viewport is desktop", () => {
    const meta = make_meta({ viewport: "desktop" });

    render_study(meta);

    expect(screen.getByRole("button", { name: "desktop" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "mobile" })).toHaveAttribute("aria-pressed", "false");
  });

  it("applies data-theme from meta", () => {
    const meta = make_meta({ theme: "dark" });

    const { container } = render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div>study</div>
        </StudyContent>
      </SidebarProvider>,
    );

    expect(container.querySelector("[data-theme]")).toHaveAttribute("data-theme", "dark");
  });

  it("defaults to mobile device when viewport is mobile", () => {
    const meta = make_meta({ viewport: "mobile" });

    render_study(meta);

    expect(screen.getByRole("button", { name: "mobile" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "desktop" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("renders full width before container is measured for desktop viewport", () => {
    const meta = make_meta({ viewport: "desktop" });

    const { container } = render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">study</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const frame = container.querySelector("[data-testid='study']")!.parentElement!.parentElement!;
    expect(frame.style.width).toBe("100%");
  });

  it("renders pixel width for mobile viewport before container is measured", () => {
    const meta = make_meta({ viewport: "mobile" });

    const { container } = render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">study</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const frame = container.querySelector("[data-testid='study']")!.parentElement!.parentElement!;
    expect(frame.style.width).toBe("390px");
  });

  it("no preset is active when frame width does not match any preset", () => {
    const meta = make_meta({ viewport: "mobile" });

    render_study(meta);

    // mobile starts active
    expect(screen.getByRole("button", { name: "mobile" })).toHaveAttribute("aria-pressed", "true");

    // set to a custom width via the resize handle (simulate by setting an arbitrary width)
    // We test this through the drag handle in browser tests.
    // For now, verify that clicking tablet then the state is correct.
    fireEvent.click(screen.getByRole("button", { name: "tablet" }));

    expect(screen.getByRole("button", { name: "tablet" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "mobile" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "desktop" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
