import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": resolve(import.meta.dirname, "src"),
    },
  },
  optimizeDeps: {
    include: [
      "@base-ui/react/merge-props",
      "@base-ui/react/use-render",
      "@base-ui/react/button",
      "@base-ui/react/input",
      "@base-ui/react/dialog",
      "@base-ui/react/tooltip",
      "class-variance-authority",
      "cmdk",
    ],
  },
  test: {
    include: ["src/**/*.browser.test.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: "chromium",
          context: { viewport: { width: 1280, height: 720 } },
        },
      ],
    },
  },
});
