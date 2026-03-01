import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  reporter: "list",
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  use: {
    baseURL: "http://localhost:3010",
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
    launchOptions: {
      args: [
        "--use-angle=swiftshader",
        "--enable-webgl",
        "--ignore-gpu-blocklist",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    },
  },
  projects: [
    {
      name: "Desktop High",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        hasTouch: false,
        deviceScaleFactor: 1,
      },
    },
    {
      name: "Tablet Mid",
      use: {
        viewport: { width: 768, height: 1024 },
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) CriOS/122.0.0.0 Mobile/15E148 Safari/604.1",
        hasTouch: false,
        deviceScaleFactor: 2,
      },
    },
    {
      name: "Mobile Low",
      use: {
        ...devices["Pixel 5"],
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "next dev -p 3010",
    port: 3010,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
