import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/authenticate": "http://localhost:8080",
      "/logout": "http://localhost:8080",
      "/api": "http://localhost:8080",
      "/demo": "http://localhost:8080",
      "/nft": "http://localhost:8080",
      "/wallet": "http://localhost:8080",
    },
  },
});
