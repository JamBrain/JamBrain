import { defineConfig } from "cypress";
import { glob } from "tinyglobby";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
      on("task", {
        async getNodes() {
          return (await glob(["cypress/fixtures/nodes/**/*.ts"])).map((p) =>
            p.slice("cypress/fixtures/nodes".length, -".ts".length),
          );
        },
      });
    },
  },
});
