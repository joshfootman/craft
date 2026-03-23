import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { SidebarProvider } from "~/components/ui/sidebar";
import { StudyContent } from "./study-content";
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

describe("StudyContent (browser)", () => {
  beforeEach(async () => {
    await page.viewport(1024, 720);
  });

  it("defaults to full width when viewport is desktop", async () => {
    const meta = makeMeta({ viewport: "desktop" });

    render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const desktopBtn = page.getByRole("button", { name: "desktop" });
    await expect.element(desktopBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("resizes content area when toggling to mobile", async () => {
    const meta = makeMeta({ viewport: "desktop" });

    render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const mobileBtn = page.getByRole("button", { name: "mobile" });
    await mobileBtn.click();

    await expect.element(mobileBtn).toHaveAttribute("aria-pressed", "true");

    const desktopBtn = page.getByRole("button", { name: "desktop" });
    await expect.element(desktopBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("defaults to mobile width when viewport is mobile", async () => {
    const meta = makeMeta({ viewport: "mobile" });

    render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const mobileBtn = page.getByRole("button", { name: "mobile" });
    await expect.element(mobileBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("dragging the resize handle changes the frame width", async () => {
    const meta = makeMeta({ viewport: "mobile" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    expect(handle).not.toBeNull();

    const frame = result.container.querySelector("[data-testid='study']")!.parentElement!;
    const initialWidth = frame.offsetWidth;

    const handleRect = handle.getBoundingClientRect();
    const startX = handleRect.left + handleRect.width / 2;
    const startY = handleRect.top + handleRect.height / 2;

    handle.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: startX, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
      new PointerEvent("pointermove", { clientX: startX + 100, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
      new PointerEvent("pointerup", { clientX: startX + 100, clientY: startY, bubbles: true }),
    );

    await expect.poll(() => frame.offsetWidth).not.toBe(initialWidth);
  });

  it("dragging to a non-preset width deselects all preset buttons", async () => {
    const meta = makeMeta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const tabletBtn = page.getByRole("button", { name: "tablet" });
    await tabletBtn.click();
    await expect.element(tabletBtn).toHaveAttribute("aria-pressed", "true");

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    const handleRect = handle.getBoundingClientRect();
    const startX = handleRect.left + handleRect.width / 2;
    const startY = handleRect.top + handleRect.height / 2;

    handle.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: startX, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
      new PointerEvent("pointermove", { clientX: startX - 20, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
      new PointerEvent("pointerup", { clientX: startX - 20, clientY: startY, bubbles: true }),
    );

    await expect
      .element(page.getByRole("button", { name: "desktop" }))
      .toHaveAttribute("aria-pressed", "false");
    await expect
      .element(page.getByRole("button", { name: "tablet" }))
      .toHaveAttribute("aria-pressed", "false");
    await expect
      .element(page.getByRole("button", { name: "mobile" }))
      .toHaveAttribute("aria-pressed", "false");
  });

  it("handle is hidden when frame is at container width", async () => {
    const meta = makeMeta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;

    await expect
      .poll(
        () => {
          const style = getComputedStyle(handle);
          return style.opacity;
        },
        { timeout: 5000 },
      )
      .toBe("0");
  });

  it("handle is visible when frame is below container width", async () => {
    const meta = makeMeta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const tabletBtn = page.getByRole("button", { name: "tablet" });
    await tabletBtn.click();

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    await expect.poll(() => getComputedStyle(handle).opacity).toBe("1");
  });

  it("drag is clamped to mobile preset minimum", async () => {
    const meta = makeMeta({ viewport: "desktop" });

    const result = await render(
      <SidebarProvider>
        <StudyContent meta={meta}>
          <div data-testid="study">content</div>
        </StudyContent>
      </SidebarProvider>,
    );

    const tabletBtn = page.getByRole("button", { name: "tablet" });
    await tabletBtn.click();

    const handle = result.container.querySelector("[data-testid='resize-handle']") as HTMLElement;
    const frame = result.container.querySelector("[data-testid='study']")!.parentElement!;

    const handleRect = handle.getBoundingClientRect();
    const startX = handleRect.left + handleRect.width / 2;
    const startY = handleRect.top + handleRect.height / 2;

    handle.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: startX, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
      new PointerEvent("pointermove", { clientX: startX - 2000, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
      new PointerEvent("pointerup", { clientX: startX - 2000, clientY: startY, bubbles: true }),
    );

    await expect.poll(() => frame.offsetWidth).toBe(390);
  });
});
