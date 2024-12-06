import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
  // import dotenv from "dotenv";
  // import { fileURLToPath } from "url";

// const _filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(_filename);

// // Load environment variables from .env file
// dotenv.config({ path: path.resolve(__dirname, ".env") });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // build: {
  //   chunkSizeWarningLimit: 2000, // increase limit to 1000 kB
  // },
});
