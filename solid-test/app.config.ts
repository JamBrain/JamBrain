import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  server: {
    preset: "static",
    // fix build error: Top-level await is not available in the configured target environment ("es2019")
    esbuild: { options: { target: "esnext" } },
  },
  routeDir: "navigation",
  vite: {
    define: {
      API_ENDPOINT: JSON.stringify("https://api.ldjam.com"),
      STATIC_ENDPOINT: JSON.stringify("//static.jam.host"),
    },
  },
});
