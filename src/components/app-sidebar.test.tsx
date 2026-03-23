import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import type { Meta } from "~/types/study";

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

function renderSidebar(props: { studies: Meta[]; activeStudyId: string }) {
  return render(
    <SidebarProvider>
      <AppSidebar studies={props.studies} activeStudyId={props.activeStudyId} />
    </SidebarProvider>,
  );
}

describe("AppSidebar", () => {
  it("renders header with wordmark and search trigger", () => {
    renderSidebar({ studies: [], activeStudyId: "" });

    expect(screen.getByLabelText("Craft logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("marks the active study", () => {
    const studies = [
      makeMeta({ id: "a", title: "Study A" }),
      makeMeta({ id: "b", title: "Study B" }),
    ];

    renderSidebar({ studies, activeStudyId: "b" });

    const linkA = screen.getByText("Study A").closest("a");
    const linkB = screen.getByText("Study B").closest("a");

    expect(linkB).toHaveAttribute("data-active");
    expect(linkA).not.toHaveAttribute("data-active");
  });

  it("groups studies by category", () => {
    const studies = [
      makeMeta({ id: "a", title: "Study A", category: "Stripe Pricing" }),
      makeMeta({ id: "b", title: "Study B", category: "Stripe Pricing" }),
      makeMeta({ id: "c", title: "Study C", category: "General" }),
    ];

    renderSidebar({ studies, activeStudyId: "a" });

    expect(screen.getAllByText("Stripe Pricing").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study B").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study C").length).toBeGreaterThanOrEqual(1);
  });
});
