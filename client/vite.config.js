import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        secure: false,
      },
      "/auth/google": {
        target: "http://localhost:5000",
        secure: false,
      },
      "/strains": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/api/register": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/api/login": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/api/logOut": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
