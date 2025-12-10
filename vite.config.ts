import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "kickable-mitzie-unexecutorial.ngrok-free.dev"
    ],
    host: true,   // important pour URLs externes
    port: 3000    // ou ton port actuel
  }
});
