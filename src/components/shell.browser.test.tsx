import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { Shell } from "./shell";
import type { Meta } from "~/types/study";

function makeMeta(overrides: Partial<Meta> = {}): Meta {
  return {
    id: "test-study",
    title: "Test Study",
    description: "A test study",
    status: "published",
    tags: ["Motion"],
    category: "test",
    date: "2026-01-01",
    theme: "light",
    viewport: "desktop",
    ...overrides,
  };
}

const studies: Meta[] = [
  makeMeta(),
  makeMeta({
    id: "second-study",
    title: "Second Study",
    tags: ["CSS"],
    category: "layout",
  }),
];

describe("Shell (browser)", () => {
  beforeEach(async () => {
    // Ensure iframe is wide enough for desktop sidebar (md: 768px)
    await page.viewport(1024, 720);
  });

  it("cmd+b toggles sidebar collapsed/expanded", async () => {
    const result = await render(
      <Shell studies={studies} active={studies[0]}>
        <div>content</div>
      </Shell>,
    );

    const sidebar = result.container.querySelector(
      '[data-slot="sidebar"][data-state]',
    ) as HTMLElement;

    expect(sidebar).not.toBeNull();
    expect(sidebar.dataset.state).toBe("expanded");

    await userEvent.keyboard("{Meta>}b{/Meta}");
    await expect.poll(() => sidebar.dataset.state).toBe("collapsed");

    await userEvent.keyboard("{Meta>}b{/Meta}");
    await expect.poll(() => sidebar.dataset.state).toBe("expanded");
  });

  it("cmd+k opens the command palette", async () => {
    await render(
      <Shell studies={studies} active={studies[0]}>
        <div>content</div>
      </Shell>,
    );

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();

    await userEvent.keyboard("{Meta>}k{/Meta}");

    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toBeVisible();
  });

  it("esc closes the command palette", async () => {
    await render(
      <Shell studies={studies} active={studies[0]}>
        <div>content</div>
      </Shell>,
    );

    await userEvent.keyboard("{Meta>}k{/Meta}");
    await expect.element(page.getByRole("dialog")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("sidebar search button opens the command palette", async () => {
    await render(
      <Shell studies={studies} active={studies[0]}>
        <div>content</div>
      </Shell>,
    );

    const searchBtn = page.getByRole("button", { name: /search/i });
    await searchBtn.click();

    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toBeVisible();
  });
});
