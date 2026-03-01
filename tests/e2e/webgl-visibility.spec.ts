import { expect, test } from "./fixtures/device-fixture";
import type { Page } from "@playwright/test";

type WebGLMetrics = {
  isRAFRunning: boolean;
  isTabVisible: boolean;
  frameCount: number;
};

const getMetrics = async (page: Page) => {
  await page.waitForFunction(() => {
    return Boolean((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics);
  }, undefined, { timeout: 30_000, polling: 100 });
  return page.evaluate(() => {
    return (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics ?? null;
  });
};

test("RAF loop runs on initial load", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const metrics = await getMetrics(page);
  expect(metrics).not.toBeNull();
  expect(metrics?.isRAFRunning).toBe(true);
});

test("RAF loop pauses when tab is hidden", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, writable: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForFunction(() => {
    const m = (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics;
    return Boolean(m && m.isRAFRunning === false);
  }, undefined, { timeout: 5_000, polling: 100 });

  const metrics = await getMetrics(page);
  expect(metrics).not.toBeNull();
  expect(metrics?.isRAFRunning).toBe(false);
});

test("RAF loop resumes when tab becomes visible again", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
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
  await page.waitForFunction(() => {
    const m = (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics;
    return Boolean(m && m.isRAFRunning === true);
  }, undefined, { timeout: 5_000, polling: 100 });

  const metrics = await getMetrics(page);
  expect(metrics).not.toBeNull();
  expect(metrics?.isRAFRunning).toBe(true);
});
