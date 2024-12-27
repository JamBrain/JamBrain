import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  server: {
    preset: "static",
  },
  routeDir: "navigation",
  vite: {
    define: {
      API_ENDPOINT: JSON.stringify("https://api.ldjam.com"),
      STATIC_ENDPOINT: JSON.stringify("//static.jam.host"),
    },
  },
});
