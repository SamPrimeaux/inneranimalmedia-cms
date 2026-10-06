import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "../../integration/host-adapters/editorial-assets",
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: "oxc",
    lib: {
      entry: "./src/portable/publish-entry.tsx",
      formats: ["es"],
      fileName: () => "editorial-runtime.js",
    },
    rollupOptions: {
      output: { assetFileNames: () => "editorial-runtime.css" },
    },
  },
});
