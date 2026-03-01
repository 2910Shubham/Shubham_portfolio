import fs from "node:fs";
import path from "node:path";

export type DeviceTier = "low" | "mid" | "high";
export type ProjectName = "Desktop High" | "Tablet Mid" | "Mobile Low";

export type TestStatus = "passed" | "failed" | "skipped";

export type TestResultRecord = {
  status: TestStatus;
  error?: string;
};

export type QualitySnapshot = {
  currentQuality: number;
  pixelRatio: number;
  fps?: number;
  frameSkipRatio?: number;
  rippleSlots?: number;
};

export type PerformanceSnapshot = {
  loadTimeMs: number;
  heapMb: number;
  fcpMs: number;
  lcpMs: number;
  totalBlockingTimeMs: number;
  longTasksCount: number;
  fps: number;
  frameTimeMs: number;
};

export type ProjectResults = {
  projectName: ProjectName;
  expectedTier: DeviceTier;
  actualTier?: DeviceTier;
  quality?: QualitySnapshot;
  frameWindow?: {
    framesIn1s?: number;
    frameSkipRatio?: number;
  };
  performance?: PerformanceSnapshot;
  tests: Record<string, TestResultRecord>;
};

export type FullResults = {
  generatedAt: string;
  projects: Record<ProjectName, ProjectResults>;
};

export const REPORTS_DIR = path.resolve(process.cwd(), "tests/e2e/reports");
export const RAW_RESULTS_PATH = path.join(REPORTS_DIR, "raw-results.json");
export const HTML_REPORT_PATH = path.join(REPORTS_DIR, "quality-report.html");

export const expectedTierByProject: Record<ProjectName, DeviceTier> = {
  "Desktop High": "high",
  "Tablet Mid": "mid",
  "Mobile Low": "low",
};

export function ensureReportsDir() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export function createEmptyResults(): FullResults {
  return {
    generatedAt: new Date().toISOString(),
    projects: {
      "Desktop High": {
        projectName: "Desktop High",
        expectedTier: "high",
        tests: {},
      },
      "Tablet Mid": {
        projectName: "Tablet Mid",
        expectedTier: "mid",
        tests: {},
      },
      "Mobile Low": {
        projectName: "Mobile Low",
        expectedTier: "low",
        tests: {},
      },
    },
  };
}

export function readResults(): FullResults {
  ensureReportsDir();
  if (!fs.existsSync(RAW_RESULTS_PATH)) {
    const initial = createEmptyResults();
    fs.writeFileSync(RAW_RESULTS_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(RAW_RESULTS_PATH, "utf-8")) as FullResults;
  } catch {
    const initial = createEmptyResults();
    fs.writeFileSync(RAW_RESULTS_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

export function writeResults(data: FullResults) {
  ensureReportsDir();
  data.generatedAt = new Date().toISOString();
  fs.writeFileSync(RAW_RESULTS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function updateProjectResults(
  projectName: string,
  mutator: (project: ProjectResults) => void,
) {
  if (!(projectName in expectedTierByProject)) return;
  const data = readResults();
  const typedProject = projectName as ProjectName;
  mutator(data.projects[typedProject]);
  writeResults(data);
}

export function recordTestResult(
  projectName: string,
  testName: string,
  status: TestStatus,
  error?: string,
) {
  updateProjectResults(projectName, (project) => {
    project.tests[testName] = { status, error };
  });
}

