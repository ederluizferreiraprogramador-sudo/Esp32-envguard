import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@/lib": path.resolve(__dirname, "src/lib"), "@/data": path.resolve(__dirname, "src/data") } },
  test: { environment: "jsdom", include: ["src/**/*.test.ts"] },
});
