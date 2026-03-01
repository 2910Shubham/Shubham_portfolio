import { recordTestResult, updateProjectResults, type DeviceTier } from "./utils/results-store";
import { expect, test, expectedTierForProject } from "./fixtures/device-fixture";
import type { Page } from "@playwright/test";

type WebGLMetrics = {
  deviceTier: DeviceTier;
  isRAFRunning: boolean;
  isTabVisible: boolean;
  frameCount: number;
  currentQuality: number;
  pixelRatio: number;
  skippedFrames: number;
};

const rippleSlotsByTier: Record<DeviceTier, number> = {
  high: 5,
  mid: 3,
  low: 2,
};

async function getMetrics(page: Page) {
  await page.waitForFunction(() => {
    return Boolean((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics);
  }, undefined, { timeout: 30_000, polling: 100 });
  const metrics = await page.evaluate(() => {
    return (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics ?? null;
  });
  expect(metrics).not.toBeNull();
  return metrics as WebGLMetrics;
}

test.afterEach(async ({}, testInfo) => {
  const message = testInfo.errors[0]?.message
    ? testInfo.errors[0].message.slice(0, 500)
    : undefined;
  recordTestResult(
    testInfo.project.name,
    testInfo.title,
    testInfo.status === "passed" ? "passed" : testInfo.status === "skipped" ? "skipped" : "failed",
    message,
  );
});

test("Correct tier is detected for each device class", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const metrics = await getMetrics(page);
  const expectedTier = expectedTierForProject(testInfo.project.name);
  expect(metrics.deviceTier).toBe(expectedTier);

  updateProjectResults(testInfo.project.name, (project) => {
    project.actualTier = metrics.deviceTier;
  });
});

test("Correct quality values are applied per device tier", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const metrics = await getMetrics(page);
  const expectedTier = expectedTierForProject(testInfo.project.name);

  if (expectedTier === "high") {
    expect(metrics.currentQuality).toBe(1.0);
    expect(metrics.pixelRatio).toBeGreaterThanOrEqual(1.0);
    expect(metrics.pixelRatio).toBeLessThanOrEqual(1.5);
  }
  if (expectedTier === "mid") {
    expect(metrics.currentQuality).toBe(0.6);
    expect(metrics.pixelRatio).toBeLessThanOrEqual(1.0);
  }
  if (expectedTier === "low") {
    expect(metrics.currentQuality).toBe(0.3);
    expect(metrics.pixelRatio).toBe(0.75);
  }

  updateProjectResults(testInfo.project.name, (project) => {
    project.quality = {
      currentQuality: metrics.currentQuality,
      pixelRatio: metrics.pixelRatio,
      rippleSlots: rippleSlotsByTier[expectedTier],
      fps: project.quality?.fps,
      frameSkipRatio: project.quality?.frameSkipRatio,
    };
  });
});

test("RAF loop is running and incrementing frames over time", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const countA = (await getMetrics(page)).frameCount;
  await page.waitForTimeout(1000);
  const countB = (await getMetrics(page)).frameCount;
  expect(countB).toBeGreaterThan(countA);

  const framesIn1s = countB - countA;
  const expectedTier = expectedTierForProject(testInfo.project.name);
  if (expectedTier === "low") {
    expect(framesIn1s).toBeGreaterThanOrEqual(20);
    expect(framesIn1s).toBeLessThanOrEqual(40);
  }
  if (expectedTier === "high") {
    expect(framesIn1s).toBeGreaterThanOrEqual(8);
  }

  updateProjectResults(testInfo.project.name, (project) => {
    project.frameWindow = {
      ...project.frameWindow,
      framesIn1s,
    };
    project.quality = {
      currentQuality: project.quality?.currentQuality ?? 0,
      pixelRatio: project.quality?.pixelRatio ?? 0,
      rippleSlots: project.quality?.rippleSlots,
      frameSkipRatio: project.quality?.frameSkipRatio,
      fps: framesIn1s,
    };
  });
});

test("RAF pauses when tab is hidden and resumes when visible again", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: true,
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(500);
  expect((await getMetrics(page)).isRAFRunning).toBe(false);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: false,
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(500);
  expect((await getMetrics(page)).isRAFRunning).toBe(true);
});

test("Touch interactions trigger ripple behavior and keep rendering stable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "Mobile Low", "This interaction applies only to Mobile Low.");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const baseline = (await getMetrics(page)).frameCount;

  await page.touchscreen.tap(190, 350);
  await page.waitForTimeout(500);
  expect((await getMetrics(page)).frameCount).toBeGreaterThan(baseline);

  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const touch = new Touch({
      identifier: 1,
      target: canvas,
      clientX: 200,
      clientY: 300,
    });
    canvas.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [touch],
        changedTouches: [touch],
      }),
    );
  });
  await page.waitForTimeout(200);
  expect(errors.length).toBe(0);
});

test("Floating mascot is present and visible on every tier", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const mascotVideo = page.locator('video[src*="mascot2.webm"]').first();
  await expect(mascotVideo).toBeVisible();

  const box = await mascotVideo.boundingBox();
  expect(box).not.toBeNull();

  if (testInfo.project.name === "Mobile Low" && box) {
    expect(box.width).toBeLessThanOrEqual(320);
  }
});

test("Frame skip ratio matches expected behavior for each tier", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const a = await getMetrics(page);
  await page.waitForTimeout(2000);
  const b = await getMetrics(page);

  const skippedDelta = b.skippedFrames - a.skippedFrames;
  const frameDelta = b.frameCount - a.frameCount;
  const total = skippedDelta + frameDelta;
  const skipRatio = total > 0 ? skippedDelta / total : 0;
  const expectedTier = expectedTierForProject(testInfo.project.name);

  if (expectedTier === "high") expect(skipRatio).toBe(0);
  if (expectedTier === "mid") expect(skipRatio).toBe(0);
  if (expectedTier === "low") expect(skipRatio).toBeGreaterThanOrEqual(0.3);

  updateProjectResults(testInfo.project.name, (project) => {
    project.frameWindow = {
      ...project.frameWindow,
      frameSkipRatio: skipRatio,
    };
    project.quality = {
      currentQuality: project.quality?.currentQuality ?? b.currentQuality,
      pixelRatio: project.quality?.pixelRatio ?? b.pixelRatio,
      rippleSlots: project.quality?.rippleSlots ?? rippleSlotsByTier[expectedTier],
      fps: project.quality?.fps,
      frameSkipRatio: skipRatio,
    };
  });
});
