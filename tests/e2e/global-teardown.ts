import { generateQualityReport } from "./utils/generate-report";

async function globalTeardown() {
  generateQualityReport();
}

export default globalTeardown;

