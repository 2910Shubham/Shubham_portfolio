import { expect, test } from "@playwright/test";

type WebGLMetrics = {
  isRAFRunning: boolean;
  isTabVisible: boolean;
  frameCount: number;
};

const getMetrics = async (page: Parameters<typeof test>[0]["page"]) =>
  page.evaluate(() => {
    return (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics ?? null;
  });

test("RAF loop runs on initial load", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);

  const metrics = await getMetrics(page);
  expect(metrics).not.toBeNull();
  expect(metrics?.isRAFRunning).toBe(true);
});

test("RAF loop pauses when tab is hidden", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, writable: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(500);

  const metrics = await getMetrics(page);
  expect(metrics).not.toBeNull();
  expect(metrics?.isRAFRunning).toBe(false);
});

test("RAF loop resumes when tab becomes visible again", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, writable: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: false, writable: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(500);

  const metrics = await getMetrics(page);
  expect(metrics).not.toBeNull();
  expect(metrics?.isRAFRunning).toBe(true);
});
