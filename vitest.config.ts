// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: [
        "client/components/builder/**",
        "server/routes/**",
        "src/services/**",
        "src/utils/**",
      ],
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "~": path.resolve(__dirname, "./"),
    },
  },
});
