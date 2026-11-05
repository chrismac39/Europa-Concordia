import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateProject } from "../build/validation.js";
import { analyzeProject } from "./analyzer.js";
import { writeConflictReports } from "./report.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let profileId: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--profile") {
      if (profileId !== undefined || !args[index + 1]) {
        throw new Error(
          "--profile requires one profile ID and may be specified once",
        );
      }
      profileId = args[index + 1];
      index += 1;
    } else if (option.startsWith("--profile=")) {
      if (profileId !== undefined || option.length === "--profile=".length) {
        throw new Error(
          "--profile requires one profile ID and may be specified once",
        );
      }
      profileId = option.slice("--profile=".length);
    } else {
      throw new Error("Usage: npm run analyze -- [--profile PROFILE_ID]");
    }
  }
  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const configuration = await validateProject(rootDirectory, { profileId });
  const analysis = await analyzeProject(configuration);
  await writeConflictReports(rootDirectory, analysis);
  const unresolved = analysis.findings.filter(
    (finding) => !finding.resolved,
  ).length;
  console.log(
    `Analyzed profile ${analysis.profileId} with ${analysis.packageCount} mods: ${analysis.findings.length} findings, ${unresolved} requiring decisions.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
