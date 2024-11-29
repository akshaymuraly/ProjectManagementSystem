import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Route API requests to the backend server
      "/api": {
        target: "http://localhost:3000", // Backend server URL
        changeOrigin: true, // Adjust the origin of the request to match the target
        secure: false, // Set to true if using HTTPS and you want to verify the certificate
      },
    },
  },
});
