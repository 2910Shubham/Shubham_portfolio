import { test, expect } from "./fixtures/device-fixture";
import { recordTestResult, updateProjectResults } from "./utils/results-store";

type LongTaskRecord = {
  duration: number;
  startTime: number;
};

type WebGLMetrics = {
  frameCount: number;
};

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

test("Performance metrics are captured for this device tier in a reproducible way", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    (window as Window & { __longTasks?: LongTaskRecord[]; __latestLcp?: number }).__longTasks = [];
    (window as Window & { __latestLcp?: number }).__latestLcp = 0;

    const longTaskObserver = new PerformanceObserver((list) => {
      const bag = (window as Window & { __longTasks?: LongTaskRecord[] }).__longTasks;
      if (!bag) return;
      list.getEntries().forEach((entry) => {
        bag.push({ duration: entry.duration, startTime: entry.startTime });
      });
    });
    longTaskObserver.observe({ entryTypes: ["longtask"] });

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length === 0) return;
      const latest = entries[entries.length - 1];
      (window as Window & { __latestLcp?: number }).__latestLcp = latest.startTime;
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  });

  const client = await page.context().newCDPSession(page);
  await client.send("Performance.enable");

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);
  await page.waitForFunction(() => {
    return Boolean((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics);
  }, undefined, { timeout: 30_000, polling: 100 });

  const cdpMetrics = await client.send("Performance.getMetrics");
  expect(Array.isArray(cdpMetrics.metrics)).toBe(true);

  const baselineFrameCount = await page.evaluate(() => {
    const m = (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics;
    return m?.frameCount ?? 0;
  });
  await page.waitForTimeout(1000);
  const nextFrameCount = await page.evaluate(() => {
    const m = (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics;
    return m?.frameCount ?? 0;
  });
  const fps = Math.max(0, nextFrameCount - baselineFrameCount);
  const frameTimeMs = fps > 0 ? 1000 / fps : 0;

  const perfSnapshot = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const fcp = performance.getEntriesByName("first-contentful-paint")[0] as PerformanceEntry | undefined;
    const latestLcp = (window as Window & { __latestLcp?: number }).__latestLcp ?? 0;
    const longTasks = (window as Window & { __longTasks?: LongTaskRecord[] }).__longTasks ?? [];
    const totalBlockingTime = longTasks
      .filter((t) => t.duration > 50)
      .reduce((sum, t) => sum + (t.duration - 50), 0);

    const usedHeapBytes =
      (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;

    return {
      loadTimeMs: nav ? Math.max(0, nav.loadEventEnd - nav.startTime) : 0,
      heapMb: usedHeapBytes / (1024 * 1024),
      fcpMs: fcp?.startTime ?? 0,
      lcpMs: latestLcp,
      totalBlockingTimeMs: totalBlockingTime,
      longTasksCount: longTasks.length,
    };
  });

  updateProjectResults(testInfo.project.name, (project) => {
    project.performance = {
      ...perfSnapshot,
      fps,
      frameTimeMs,
    };
  });
});
