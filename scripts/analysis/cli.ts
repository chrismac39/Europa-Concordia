import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateProject } from "../build/validation.js";
import { analyzeProject } from "./analyzer.js";
import { writeConflictReports } from "./report.js";

async function main(): Promise<void> {
  if (process.argv.length > 2) {
    throw new Error("Usage: npm run analyze");
  }
  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const configuration = await validateProject(rootDirectory);
  const analysis = await analyzeProject(configuration);
  await writeConflictReports(rootDirectory, analysis);
  const unresolved = analysis.findings.filter(
    (finding) => !finding.resolved,
  ).length;
  console.log(
    `Analyzed ${analysis.packageCount} packages: ${analysis.findings.length} findings, ${unresolved} requiring decisions.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
