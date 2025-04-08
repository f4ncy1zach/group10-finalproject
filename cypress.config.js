import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    requestTimeout: 180000,
    responseTimeout: 180000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
