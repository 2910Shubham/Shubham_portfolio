import fs from "node:fs";
import {
  RAW_RESULTS_PATH,
  createEmptyResults,
  ensureReportsDir,
  HTML_REPORT_PATH,
} from "./utils/results-store";

async function globalSetup() {
  ensureReportsDir();
  fs.writeFileSync(RAW_RESULTS_PATH, JSON.stringify(createEmptyResults(), null, 2), "utf-8");
  if (fs.existsSync(HTML_REPORT_PATH)) {
    fs.rmSync(HTML_REPORT_PATH);
  }
}

export default globalSetup;

