import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildProject } from "./pipeline.js";
import { validateProject } from "./validation.js";

interface CliArguments {
  command: "build" | "validate";
  targetGameVersion?: string;
}

function parseArguments(argumentsValue: string[]): CliArguments {
  const [command, ...options] = argumentsValue;
  if (command !== "build" && command !== "validate") {
    throw new Error(
      "Usage: npm run <build|validate> -- [--target-game-version MAJOR.MINOR.PATCH]",
    );
  }

  let targetGameVersion: string | undefined;
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    let value: string | undefined;
    if (option === "--target-game-version") {
      value = options[index + 1];
      index += 1;
    } else if (option.startsWith("--target-game-version=")) {
      value = option.slice("--target-game-version=".length);
    } else {
      throw new Error(`Unknown option: ${option}`);
    }
    if (!value) {
      throw new Error("--target-game-version requires a value");
    }
    if (targetGameVersion !== undefined) {
      throw new Error("--target-game-version may only be specified once");
    }
    targetGameVersion = value;
  }

  return { command, targetGameVersion };
}

async function main(): Promise<void> {
  const { command, targetGameVersion } = parseArguments(process.argv.slice(2));
  const options = { targetGameVersion };

  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  if (command === "validate") {
    const configuration = await validateProject(rootDirectory, options);
    console.log(
      `Validated ${configuration.packages.length} enabled package(s) for EU5 ${configuration.build.targetGameVersion}.`,
    );
    return;
  }

  const outputDirectory = await buildProject(rootDirectory, options);
  console.log(
    `Built ${path.relative(rootDirectory, outputDirectory)} for EU5 ${
      targetGameVersion ?? "configured target"
    }.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
