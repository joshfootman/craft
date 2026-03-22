import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { SidebarProvider } from "~/components/ui/sidebar";
import { StudyContent } from "./study-content";
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

describe("StudyContent (browser)", () => {
  it("defaults to full width when viewport is desktop", async () => {
    const meta = make_meta({ viewport: "desktop" });

    render(<SidebarProvider><StudyContent meta={meta}><div data-testid="study">content</div></StudyContent></SidebarProvider>);

    const desktop_btn = page.getByRole("button", { name: "desktop" });
    await expect.element(desktop_btn).toHaveAttribute("aria-pressed", "true");
  });

  it("resizes content area when toggling to mobile", async () => {
    const meta = make_meta({ viewport: "desktop" });

    render(<SidebarProvider><StudyContent meta={meta}><div data-testid="study">content</div></StudyContent></SidebarProvider>);

    const mobile_btn = page.getByRole("button", { name: "mobile" });
    await mobile_btn.click();

    await expect.element(mobile_btn).toHaveAttribute("aria-pressed", "true");

    const desktop_btn = page.getByRole("button", { name: "desktop" });
    await expect.element(desktop_btn).toHaveAttribute("aria-pressed", "false");
  });

  it("defaults to mobile width when viewport is mobile", async () => {
    const meta = make_meta({ viewport: "mobile" });

    render(<SidebarProvider><StudyContent meta={meta}><div data-testid="study">content</div></StudyContent></SidebarProvider>);

    const mobile_btn = page.getByRole("button", { name: "mobile" });
    await expect.element(mobile_btn).toHaveAttribute("aria-pressed", "true");
  });
});
