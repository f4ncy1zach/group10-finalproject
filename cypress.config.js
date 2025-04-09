import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    requestTimeout: 180000,
    responseTimeout: 180000,
  },
});