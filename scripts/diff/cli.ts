import { copyFile, mkdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseFrontierCollisions } from "./frontier.js";

interface CodeLauncher {
  command: string;
  leadingArguments: string[];
  environment?: NodeJS.ProcessEnv;
}

function parseArguments(argumentsValue: string[]): {
  profileId: string;
  collisionId: number;
} {
  if (argumentsValue.length === 1 && /^[1-9]\d*$/.test(argumentsValue[0])) {
    return {
      profileId: "current-intended",
      collisionId: Number(argumentsValue[0]),
    };
  }
  if (
    argumentsValue.length === 3 &&
    argumentsValue[0] === "--profile" &&
    /^[a-z0-9][a-z0-9-]*$/.test(argumentsValue[1]) &&
    /^[1-9]\d*$/.test(argumentsValue[2])
  ) {
    return {
      profileId: argumentsValue[1],
      collisionId: Number(argumentsValue[2]),
    };
  }
  throw new Error(
    "Usage: npm run diff -- [--profile PROFILE_ID] FRONTIER_NUMBER",
  );
}

function sanitizeFileName(value: string): string {
  return [...value.replace(/[<>:"/\\|?*]/g, "_")]
    .map((character) => (character.charCodeAt(0) < 32 ? "_" : character))
    .join("");
}

async function resolveCodeLauncher(): Promise<CodeLauncher> {
  if (process.platform !== "win32") {
    return { command: "code", leadingArguments: [] };
  }

  const whereResult = spawnSync("where.exe", ["code.cmd"], {
    encoding: "utf8",
    windowsHide: true,
  });
  const codeCommandFile = whereResult.stdout
    ?.split(/\r?\n/)
    .find((candidate) => candidate.trim() !== "")
    ?.trim();
  if (!codeCommandFile) {
    throw new Error("Could not locate code.cmd on PATH");
  }

  const commandContents = await readFile(codeCommandFile, "utf8");
  const launcherMatch = commandContents.match(
    /"%~dp0\.\.\\([^"]+\.exe)"\s+"%~dp0\.\.\\([^"]+cli\.js)"/i,
  );
  if (!launcherMatch) {
    throw new Error(`Could not parse the VS Code launcher: ${codeCommandFile}`);
  }

  const installDirectory = path.resolve(path.dirname(codeCommandFile), "..");
  return {
    command: path.join(installDirectory, launcherMatch[1]),
    leadingArguments: [path.join(installDirectory, launcherMatch[2])],
    environment: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
  };
}

async function main(): Promise<void> {
  const { profileId, collisionId } = parseArguments(process.argv.slice(2));
  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const frontierFile = path.join(
    rootDirectory,
    "reports",
    profileId,
    "deep-frontier.md",
  );
  const collisions = parseFrontierCollisions(
    await readFile(frontierFile, "utf8"),
  );
  const collision = collisions.get(collisionId);
  if (!collision) {
    throw new Error(`Unknown frontier collision #${collisionId}`);
  }

  const sources = collision.sources.map((source) => ({
    ...source,
    path: path.resolve(path.dirname(frontierFile), source.link),
  }));
  for (const source of sources) {
    const sourcePath = source.path;
    if (!(await stat(sourcePath).catch(() => undefined))?.isFile()) {
      throw new Error(
        `Frontier collision #${collisionId} source does not exist: ${sourcePath}`,
      );
    }
  }

  const reviewDirectory = path.join(
    rootDirectory,
    "dist",
    "diff-review",
    `frontier-${profileId}-${collisionId}`,
  );
  await rm(reviewDirectory, { recursive: true, force: true });
  await mkdir(reviewDirectory, { recursive: true });
  const reviewPaths: string[] = [];
  for (const source of sources) {
    const reviewPath = path.join(
      reviewDirectory,
      `${sanitizeFileName(source.label)} - ${path.basename(source.path)}`,
    );
    await copyFile(source.path, reviewPath);
    reviewPaths.push(reviewPath);
    console.log(
      `${source.label}: ${path.relative(rootDirectory, source.path)}`,
    );
  }

  const launcher = await resolveCodeLauncher();
  const basePath = reviewPaths[0];
  for (const comparisonPath of reviewPaths.slice(1)) {
    const codeArguments = ["--diff", basePath, comparisonPath];
    const result = spawnSync(
      launcher.command,
      [...launcher.leadingArguments, ...codeArguments],
      {
        cwd: rootDirectory,
        env: launcher.environment,
        stdio: "inherit",
        windowsHide: true,
      },
    );
    if (result.error) {
      throw new Error(
        `Could not start the VS Code CLI: ${result.error.message}`,
      );
    }
    if (result.status !== 0) {
      throw new Error(
        `VS Code could not open frontier collision #${collisionId}`,
      );
    }
  }

  console.log(
    `Opened ${reviewPaths.length - 1} labeled diff view(s) for frontier #${collisionId}: ${collision.outputPath}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
