import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  ssr: false,
  server: {
    preset: "static",
    // fix build error: Top-level await is not available in the configured target environment ("es2019")
    esbuild: { options: { target: "esnext" } },
  },
  solid: {
    solid: {
      // https://github.com/MananTank/validate-html-nesting/issues/11
      validate: false,
    },
  },
  routeDir: "navigation",
  vite: {
    plugins: [tailwindcss()],
    define: {
      API_ENDPOINT: JSON.stringify("https://api.ldjam.com"),
      STATIC_ENDPOINT: JSON.stringify("//static.jam.host"),
    },
  },
});
