import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildProject } from "./pipeline.js";
import { validateProject } from "./validation.js";

async function main(): Promise<void> {
  const command = process.argv[2];
  if (command !== "build" && command !== "validate") {
    throw new Error("Usage: npm run <build|validate>");
  }

  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  if (command === "validate") {
    const configuration = await validateProject(rootDirectory);
    console.log(
      `Validated ${configuration.packages.length} enabled package(s).`,
    );
    return;
  }

  const outputDirectory = await buildProject(rootDirectory);
  console.log(`Built ${path.relative(rootDirectory, outputDirectory)}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
