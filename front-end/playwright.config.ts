import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Dossier où se trouvent les tests E2E
  testDir: './src/tests/e2e',

  // Chaque test a 10 secondes pour se terminer
  timeout: 10_000,

  use: {
    // URL de l'appli lancée en local
    baseURL: 'http://localhost:5173',
    // Ouvre le navigateur en mode visible (false = headless)
    headless: true,
  },
});
