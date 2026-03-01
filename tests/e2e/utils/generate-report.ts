import fs from "node:fs";
import {
  HTML_REPORT_PATH,
  ensureReportsDir,
  expectedTierByProject,
  readResults,
  type DeviceTier,
  type ProjectName,
  type ProjectResults,
} from "./results-store";

const PROJECTS: ProjectName[] = ["Desktop High", "Tablet Mid", "Mobile Low"];

function esc(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function statusBadge(passed: boolean): string {
  return passed ? `<span class="ok">✅ PASS</span>` : `<span class="bad">❌ FAIL</span>`;
}

function metricState(metric: "lcp" | "tbt" | "heap", value: number): "green" | "amber" | "red" {
  if (metric === "lcp") {
    if (value < 2500) return "green";
    if (value < 4000) return "amber";
    return "red";
  }
  if (metric === "tbt") {
    if (value < 200) return "green";
    if (value < 600) return "amber";
    return "red";
  }
  if (value < 80) return "green";
  if (value < 150) return "amber";
  return "red";
}

function testCell(project: ProjectResults, testTitle: string, showNA = false): string {
  if (showNA) return `<td class="na">N/A</td>`;
  const rec = project.tests[testTitle];
  if (!rec) return `<td class="na">N/A</td>`;
  if (rec.status === "passed") return `<td class="ok">✅</td>`;
  if (rec.status === "skipped") return `<td class="na">N/A</td>`;
  const err = rec.error ? `<div class="err">${esc(rec.error)}</div>` : "";
  return `<td class="bad">❌${err}</td>`;
}

function value(project: ProjectResults, key: "quality" | "pixelRatio" | "fps" | "frameSkip" | "rippleSlots"): string {
  if (key === "quality") return project.quality?.currentQuality?.toFixed(1) ?? "N/A";
  if (key === "pixelRatio") return project.quality?.pixelRatio?.toFixed(2) ?? "N/A";
  if (key === "fps") return project.quality?.fps?.toFixed(0) ?? project.performance?.fps?.toFixed(0) ?? "N/A";
  if (key === "frameSkip") {
    const ratio = project.quality?.frameSkipRatio;
    return ratio == null ? "N/A" : `${(ratio * 100).toFixed(0)}%`;
  }
  return project.quality?.rippleSlots?.toString() ?? "N/A";
}

function performanceBarRows(projectData: Record<ProjectName, ProjectResults>) {
  const metrics = [
    { key: "lcpMs", label: "Largest Contentful Paint (ms)", kind: "lcp" as const },
    { key: "heapMb", label: "JS Heap Size (MB)", kind: "heap" as const },
    { key: "totalBlockingTimeMs", label: "Total Blocking Time (ms)", kind: "tbt" as const },
    { key: "longTasksCount", label: "Long Tasks Count", kind: "heap" as const },
  ];

  return metrics
    .map(({ key, label, kind }) => {
      const vals = PROJECTS.map((project) => {
        const perf = projectData[project].performance;
        return Number((perf as Record<string, number> | undefined)?.[key] ?? 0);
      });
      const max = Math.max(...vals, 1);
      const bars = PROJECTS.map((project, idx) => {
        const val = vals[idx];
        const pct = Math.max(3, (val / max) * 100);
        const cls =
          key === "longTasksCount"
            ? val < 6
              ? "green"
              : val < 12
              ? "amber"
              : "red"
            : metricState(kind, val);
        return `<div class="bar-wrap">
          <div class="bar-label">${project}</div>
          <div class="bar-track"><div class="bar ${cls}" style="width:${pct}%"></div></div>
          <div class="bar-value">${val.toFixed(2)}</div>
        </div>`;
      }).join("");
      return `<div class="metric-card"><h4>${label}</h4>${bars}</div>`;
    })
    .join("");
}

function buildRecommendations(projectData: Record<ProjectName, ProjectResults>): string[] {
  const recs: string[] = [];
  for (const project of PROJECTS) {
    const perf = projectData[project].performance;
    if (!perf) continue;
    if (perf.lcpMs > 2500) {
      recs.push(
        `LCP exceeds 2.5s on ${project}. Consider dynamic importing WebGLBackground after LCP paint.`,
      );
    }
  }
  const lowPerf = projectData["Mobile Low"].performance;
  if (lowPerf && lowPerf.totalBlockingTimeMs > 200) {
    recs.push(
      "Total Blocking Time on low tier is high. Check for synchronous operations during initialization.",
    );
  }

  const lowFrames = projectData["Mobile Low"].frameWindow?.framesIn1s;
  if (typeof lowFrames === "number" && lowFrames < 20) {
    recs.push("Frame rate on low tier is below 20fps. Frame skip may not be working correctly.");
  }

  const allPerf = PROJECTS.map((p) => projectData[p].performance).filter(Boolean);
  const allGreen =
    allPerf.length > 0 &&
    allPerf.every((p) => {
      const perf = p!;
      return (
        metricState("lcp", perf.lcpMs) === "green" &&
        metricState("heap", perf.heapMb) === "green" &&
        metricState("tbt", perf.totalBlockingTimeMs) === "green"
      );
    });

  if (allGreen) {
    recs.push("All tiers performing within target thresholds. Ready for Phase 2 optimization.");
  }

  if (recs.length === 0) {
    recs.push("No performance recommendations generated yet. Re-run performance tests to populate metrics.");
  }
  return recs;
}

export function generateQualityReport() {
  ensureReportsDir();
  const data = readResults();
  const projectData = data.projects;

  const tierRows = PROJECTS.map((project) => {
    const expected = expectedTierByProject[project];
    const actual = projectData[project].actualTier ?? "N/A";
    const pass = actual === expected;
    return `<tr>
      <td>${project}</td>
      <td>${expected}</td>
      <td>${actual}</td>
      <td>${statusBadge(pass)}</td>
    </tr>`;
  }).join("");

  const qualityRows = `
    <tr><td>u_quality</td><td>${value(projectData["Desktop High"], "quality")}</td><td>${value(projectData["Tablet Mid"], "quality")}</td><td>${value(projectData["Mobile Low"], "quality")}</td></tr>
    <tr><td>Pixel Ratio</td><td>${value(projectData["Desktop High"], "pixelRatio")}</td><td>${value(projectData["Tablet Mid"], "pixelRatio")}</td><td>${value(projectData["Mobile Low"], "pixelRatio")}</td></tr>
    <tr><td>FPS (measured)</td><td>${value(projectData["Desktop High"], "fps")}</td><td>${value(projectData["Tablet Mid"], "fps")}</td><td>${value(projectData["Mobile Low"], "fps")}</td></tr>
    <tr><td>Frame Skip</td><td>${value(projectData["Desktop High"], "frameSkip")}</td><td>${value(projectData["Tablet Mid"], "frameSkip")}</td><td>${value(projectData["Mobile Low"], "frameSkip")}</td></tr>
    <tr><td>Ripple Slots</td><td>${value(projectData["Desktop High"], "rippleSlots")}</td><td>${value(projectData["Tablet Mid"], "rippleSlots")}</td><td>${value(projectData["Mobile Low"], "rippleSlots")}</td></tr>
  `;

  const tests = [
    "Correct tier is detected for each device class",
    "RAF loop is running and incrementing frames over time",
    "RAF pauses when tab is hidden and resumes when visible again",
    "Touch interactions trigger ripple behavior and keep rendering stable",
    "Floating mascot is present and visible on every tier",
    "Frame skip ratio matches expected behavior for each tier",
    "Correct quality values are applied per device tier",
  ];

  const testRows = tests
    .map((title) => {
      const touchOnly = title === "Touch interactions trigger ripple behavior and keep rendering stable";
      return `<tr>
        <td>${esc(title)}</td>
        ${testCell(projectData["Desktop High"], title, touchOnly)}
        ${testCell(projectData["Tablet Mid"], title, touchOnly)}
        ${testCell(projectData["Mobile Low"], title, false)}
      </tr>`;
    })
    .join("");

  const recs = buildRecommendations(projectData)
    .map((r) => `<li>${esc(r)}</li>`)
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Quality Tier Report</title>
  <style>
    body { margin:0; font-family: Inter, Segoe UI, sans-serif; background:#0a0a1a; color:#e0e0e0; }
    .wrap { max-width:1200px; margin:0 auto; padding:24px; }
    h1,h2 { margin:0 0 12px; }
    h1 { font-size:28px; color:#5c6bc0; }
    h2 { font-size:18px; color:#c5cae9; margin-top:24px; }
    .meta { opacity:.8; margin-bottom:16px; font-size:13px; }
    .card { background:#16213e; border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:16px; margin-bottom:16px; }
    table { width:100%; border-collapse:collapse; font-size:14px; }
    th,td { border-bottom:1px solid rgba(255,255,255,.08); padding:10px; text-align:left; vertical-align:top; }
    th { color:#c5cae9; font-weight:600; }
    .ok { color:#4caf50; font-weight:600; }
    .bad { color:#f44336; font-weight:600; }
    .na { color:#ff9800; font-weight:600; }
    .err { margin-top:6px; color:#ffb4b4; font-size:11px; line-height:1.3; white-space:pre-wrap; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .metric-card { background:rgba(255,255,255,.03); border-radius:10px; padding:12px; margin-bottom:12px; }
    .metric-card h4 { margin:0 0 8px; color:#c5cae9; font-size:14px; }
    .bar-wrap { display:grid; grid-template-columns:120px 1fr 80px; gap:10px; align-items:center; margin:8px 0; }
    .bar-track { background:rgba(255,255,255,.08); border-radius:999px; overflow:hidden; height:12px; }
    .bar { height:100%; border-radius:999px; }
    .bar.green { background:#4caf50; }
    .bar.amber { background:#ff9800; }
    .bar.red { background:#f44336; }
    .bar-label { font-size:12px; color:#c5cae9; }
    .bar-value { font-size:12px; text-align:right; opacity:.9; }
    ul { margin:8px 0 0 18px; padding:0; }
    li { margin:6px 0; line-height:1.4; }
    @media (max-width: 900px) { .grid { grid-template-columns:1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Adaptive Quality Validation Report</h1>
    <div class="meta">Generated: ${esc(data.generatedAt)}</div>

    <div class="card">
      <h2>Section 1: Tier Detection Summary</h2>
      <table>
        <thead><tr><th>Device</th><th>Expected Tier</th><th>Actual Tier</th><th>Status</th></tr></thead>
        <tbody>${tierRows}</tbody>
      </table>
    </div>

    <div class="card">
      <h2>Section 2: Quality Values Table</h2>
      <table>
        <thead><tr><th>Metric</th><th>High</th><th>Mid</th><th>Low</th></tr></thead>
        <tbody>${qualityRows}</tbody>
      </table>
    </div>

    <div class="card">
      <h2>Section 3: Performance Comparison</h2>
      <div class="grid">${performanceBarRows(projectData)}</div>
    </div>

    <div class="card">
      <h2>Section 4: Test Results Grid</h2>
      <table>
        <thead><tr><th>Test Name</th><th>High</th><th>Mid</th><th>Low</th></tr></thead>
        <tbody>${testRows}</tbody>
      </table>
    </div>

    <div class="card">
      <h2>Section 5: Recommendations</h2>
      <ul>${recs}</ul>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(HTML_REPORT_PATH, html, "utf-8");
}

