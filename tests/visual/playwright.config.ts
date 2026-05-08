import { defineConfig } from '@playwright/test'

const PORT = Number(process.env.QA_PORT ?? 3100)

export default defineConfig({
  testDir: __dirname,
  testMatch: /visual\.qa\.spec\.ts$/,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'tests/visual/output/report.json' }]],
  use: {
    baseURL: process.env.QA_BASE_URL ?? `http://127.0.0.1:${PORT}`,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  outputDir: 'tests/visual/output/artifacts',
  webServer: process.env.QA_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        url: `http://127.0.0.1:${PORT}`,
        timeout: 120_000,
        reuseExistingServer: true,
        env: {
          NODE_ENV: 'production',
        },
      },
})
