import { test as base, expect } from "@playwright/test";
import { expectedTierByProject, type DeviceTier, type ProjectName } from "../utils/results-store";

type DeviceMockProfile = {
  cores: number;
  memory: number;
  expectedTier: DeviceTier;
};

const profileByProject: Record<ProjectName, DeviceMockProfile> = {
  "Desktop High": { cores: 12, memory: 8, expectedTier: "high" },
  "Tablet Mid": { cores: 4, memory: 4, expectedTier: "mid" },
  "Mobile Low": { cores: 2, memory: 2, expectedTier: "low" },
};

function getProfile(projectName: string): DeviceMockProfile {
  if (projectName in profileByProject) {
    return profileByProject[projectName as ProjectName];
  }
  return { cores: 4, memory: 4, expectedTier: "mid" };
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const profile = getProfile(testInfo.project.name);
    await page.addInitScript(
      ({ cores, memory }) => {
        Object.defineProperty(navigator, "hardwareConcurrency", {
          value: cores,
          configurable: true,
        });
        Object.defineProperty(navigator, "deviceMemory", {
          value: memory,
          configurable: true,
        });
      },
      { cores: profile.cores, memory: profile.memory },
    );
    await use(page);
  },
});

export { expect };

export function expectedTierForProject(projectName: string): DeviceTier {
  if (projectName in expectedTierByProject) {
    return expectedTierByProject[projectName as ProjectName];
  }
  return "mid";
}

