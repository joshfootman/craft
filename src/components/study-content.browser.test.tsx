import { beforeEach, describe, expect, it } from "vitest";
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
  beforeEach(async () => {
    await page.viewport(1024, 720);
  });

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

  it("dragging the resize handle changes the frame width", async () => {
    const meta = make_meta({ viewport: "mobile" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}><div data-testid="study">content</div></StudyContent>
      </SidebarProvider>,
    );

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    expect(handle).not.toBeNull();

    const frame = result.container.querySelector("[data-testid='study']")!.parentElement!;
    const initial_width = frame.offsetWidth;

    const handle_rect = handle.getBoundingClientRect();
    const start_x = handle_rect.left + handle_rect.width / 2;
    const start_y = handle_rect.top + handle_rect.height / 2;

    handle.dispatchEvent(new PointerEvent("pointerdown", { clientX: start_x, clientY: start_y, bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: start_x + 100, clientY: start_y, bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointerup", { clientX: start_x + 100, clientY: start_y, bubbles: true }));

    await expect.poll(() => frame.offsetWidth).not.toBe(initial_width);
  });

  it("dragging to a non-preset width deselects all preset buttons", async () => {
    const meta = make_meta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}><div data-testid="study">content</div></StudyContent>
      </SidebarProvider>,
    );

    // Click tablet to set a known preset width
    const tablet_btn = page.getByRole("button", { name: "tablet" });
    await tablet_btn.click();
    await expect.element(tablet_btn).toHaveAttribute("aria-pressed", "true");

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    const handle_rect = handle.getBoundingClientRect();
    const start_x = handle_rect.left + handle_rect.width / 2;
    const start_y = handle_rect.top + handle_rect.height / 2;

    // Drag slightly left — to a non-preset width
    handle.dispatchEvent(new PointerEvent("pointerdown", { clientX: start_x, clientY: start_y, bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: start_x - 20, clientY: start_y, bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointerup", { clientX: start_x - 20, clientY: start_y, bubbles: true }));

    // All presets should be deselected
    await expect.element(page.getByRole("button", { name: "desktop" })).toHaveAttribute("aria-pressed", "false");
    await expect.element(page.getByRole("button", { name: "tablet" })).toHaveAttribute("aria-pressed", "false");
    await expect.element(page.getByRole("button", { name: "mobile" })).toHaveAttribute("aria-pressed", "false");
  });

  it("handle is hidden when frame is at container width", async () => {
    const meta = make_meta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}><div data-testid="study">content</div></StudyContent>
      </SidebarProvider>,
    );

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    // Wait for container measurement and re-render
    await expect.poll(() => {
      const style = getComputedStyle(handle)
      return style.opacity
    }, { timeout: 5000 }).toBe("0");
  });

  it("handle is visible when frame is below container width", async () => {
    const meta = make_meta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}><div data-testid="study">content</div></StudyContent>
      </SidebarProvider>,
    );

    const tablet_btn = page.getByRole("button", { name: "tablet" });
    await tablet_btn.click();

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    await expect.poll(() => getComputedStyle(handle).opacity).toBe("1");
  });

  it("drag is clamped to mobile preset minimum", async () => {
    const meta = make_meta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}><div data-testid="study">content</div></StudyContent>
      </SidebarProvider>,
    );

    // Start at tablet so we have a known numeric width
    const tablet_btn = page.getByRole("button", { name: "tablet" });
    await tablet_btn.click();

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    const frame = result.container.querySelector("[data-testid='study']")!.parentElement!;

    const handle_rect = handle.getBoundingClientRect();
    const start_x = handle_rect.left + handle_rect.width / 2;
    const start_y = handle_rect.top + handle_rect.height / 2;

    // Drag far left — should clamp to 390px (mobile preset)
    handle.dispatchEvent(new PointerEvent("pointerdown", { clientX: start_x, clientY: start_y, bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: start_x - 2000, clientY: start_y, bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointerup", { clientX: start_x - 2000, clientY: start_y, bubbles: true }));

    // Frame should be at mobile width (390px), not smaller
    await expect.poll(() => frame.offsetWidth).toBe(390);
  });
});
