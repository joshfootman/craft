import { getViteConfig } from "astro/config";

export default getViteConfig({
  define: {
    PROJECT_ROOT: JSON.stringify(process.cwd()),
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/**/*.browser.test.{ts,tsx}", "node_modules"],
  },
});
