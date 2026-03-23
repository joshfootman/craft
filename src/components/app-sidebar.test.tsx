import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import type { Meta } from "~/types/study";

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

function render_sidebar(props: { studies: Meta[]; active_study_id: string }) {
  return render(
    <SidebarProvider>
      <AppSidebar studies={props.studies} active_study_id={props.active_study_id} />
    </SidebarProvider>,
  );
}

describe("AppSidebar", () => {
  it("renders header with wordmark and search trigger", () => {
    render_sidebar({ studies: [], active_study_id: "" });

    expect(screen.getByLabelText("Craft logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("marks the active study", () => {
    const studies = [
      make_meta({ id: "a", title: "Study A" }),
      make_meta({ id: "b", title: "Study B" }),
    ];

    render_sidebar({ studies, active_study_id: "b" });

    const link_a = screen.getByText("Study A").closest("a");
    const link_b = screen.getByText("Study B").closest("a");

    expect(link_b).toHaveAttribute("data-active");
    expect(link_a).not.toHaveAttribute("data-active");
  });

  it("groups studies by category", () => {
    const studies = [
      make_meta({ id: "a", title: "Study A", category: "Stripe Pricing" }),
      make_meta({ id: "b", title: "Study B", category: "Stripe Pricing" }),
      make_meta({ id: "c", title: "Study C", category: "General" }),
    ];

    render_sidebar({ studies, active_study_id: "a" });

    expect(screen.getAllByText("Stripe Pricing").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study B").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study C").length).toBeGreaterThanOrEqual(1);
  });
});
