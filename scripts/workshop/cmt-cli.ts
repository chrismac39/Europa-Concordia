import { spawn } from "node:child_process";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { packageWorkshopMod } from "./packager.js";
import { prepareCmtWorkspace } from "./cmt.js";

interface CmtProfileConfiguration {
  workshopDirectory: string;
  workshopItemId: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadCmtProfileConfiguration(
  rootDirectory: string,
  profileId: string,
): Promise<CmtProfileConfiguration> {
  const configuration = JSON.parse(
    await readFile(
      path.join(rootDirectory, "config", "cmt-workshop.json"),
      "utf8",
    ),
  ) as unknown;
  if (
    !isRecord(configuration) ||
    configuration.version !== 1 ||
    !isRecord(configuration.profiles)
  ) {
    throw new Error("config/cmt-workshop.json has an invalid structure");
  }
  const profile = configuration.profiles[profileId];
  if (
    !isRecord(profile) ||
    typeof profile.workshopDirectory !== "string" ||
    typeof profile.workshopItemId !== "number" ||
    !Number.isSafeInteger(profile.workshopItemId) ||
    profile.workshopItemId < 0
  ) {
    throw new Error(
      `Profile ${profileId} is not registered in config/cmt-workshop.json with a Workshop directory and non-negative item ID`,
    );
  }
  return {
    workshopDirectory: profile.workshopDirectory,
    workshopItemId: profile.workshopItemId,
  };
}

function parseArguments(argumentsValue: string[]): {
  command: "prepare" | "publish";
  profileId: string;
  toolkitDirectory: string;
  pythonCommand: string;
  confirmation?: string;
} {
  const [command, ...options] = argumentsValue;
  if (command !== "prepare" && command !== "publish") {
    throw new Error(
      "Usage: npm run workshop:cmt -- <prepare|publish> --profile PROFILE_ID --toolkit-dir PATH [--python PATH] [--confirm-publish PHRASE]",
    );
  }
  let profileId: string | undefined;
  let toolkitDirectory: string | undefined;
  let pythonCommand: string | undefined;
  let confirmation: string | undefined;
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    if (
      option === "--profile" ||
      option === "--toolkit-dir" ||
      option === "--python" ||
      option === "--confirm-publish"
    ) {
      const value = options[index + 1];
      if (!value) {
        throw new Error(`${option} requires a value`);
      }
      if (option === "--profile") {
        if (profileId !== undefined) {
          throw new Error("--profile may only be specified once");
        }
        profileId = value;
      } else if (option === "--toolkit-dir") {
        if (toolkitDirectory !== undefined) {
          throw new Error("--toolkit-dir may only be specified once");
        }
        toolkitDirectory = value;
      } else if (option === "--python") {
        if (pythonCommand !== undefined) {
          throw new Error("--python may only be specified once");
        }
        pythonCommand = value;
      } else {
        if (confirmation !== undefined) {
          throw new Error("--confirm-publish may only be specified once");
        }
        confirmation = value;
      }
      index += 1;
    } else if (option.startsWith("--profile=")) {
      if (profileId !== undefined) {
        throw new Error("--profile may only be specified once");
      }
      profileId = option.slice("--profile=".length);
    } else if (option.startsWith("--toolkit-dir=")) {
      if (toolkitDirectory !== undefined) {
        throw new Error("--toolkit-dir may only be specified once");
      }
      toolkitDirectory = option.slice("--toolkit-dir=".length);
    } else if (option.startsWith("--python=")) {
      if (pythonCommand !== undefined) {
        throw new Error("--python may only be specified once");
      }
      pythonCommand = option.slice("--python=".length);
      if (!pythonCommand) {
        throw new Error("--python requires a value");
      }
    } else if (option.startsWith("--confirm-publish=")) {
      if (confirmation !== undefined) {
        throw new Error("--confirm-publish may only be specified once");
      }
      confirmation = option.slice("--confirm-publish=".length);
      if (!confirmation) {
        throw new Error("--confirm-publish requires a value");
      }
    } else {
      throw new Error(`Unknown option: ${option}`);
    }
  }
  if (!profileId || !toolkitDirectory) {
    throw new Error(
      "Usage: npm run workshop:cmt -- <prepare|publish> --profile PROFILE_ID --toolkit-dir PATH [--python PATH] [--confirm-publish PHRASE]",
    );
  }
  if (command === "prepare" && confirmation !== undefined) {
    throw new Error("--confirm-publish may only be used with publish");
  }
  return {
    command,
    profileId,
    toolkitDirectory,
    pythonCommand: pythonCommand ?? "python",
    confirmation,
  };
}

async function confirmPublication(
  profileId: string,
  modName: string,
  version: string,
  workshopItemId: number,
  confirmation?: string,
): Promise<boolean> {
  const action = workshopItemId === 0 ? "CREATE" : "UPDATE";
  const expectedConfirmation = `PUBLISH ${profileId} ${action}`;
  console.log(
    `About to ${action.toLowerCase()} a Workshop item for ${modName} ${version}.`,
  );
  console.log(
    `Target Workshop item ID: ${workshopItemId === 0 ? "0 (creates a new item)" : workshopItemId}.`,
  );
  console.log(
    "Confirm build and conflict checks passed, permissions and attribution are documented, and the thumbnail, page, release notes, and required-item plan are reviewed.",
  );
  if (confirmation !== undefined) {
    if (confirmation !== expectedConfirmation) {
      throw new Error(
        `To confirm this upload, use --confirm-publish "${expectedConfirmation}"`,
      );
    }
    console.log("Explicit CMT publish confirmation accepted.");
    return true;
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      `CMT publishing requires an interactive terminal or --confirm-publish "${expectedConfirmation}"`,
    );
  }
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = await prompt.question(
      `Type ${expectedConfirmation} to continue: `,
    );
    return answer === expectedConfirmation;
  } finally {
    prompt.close();
  }
}

async function runCmtUpload(
  pythonCommand: string,
  scriptPath: string,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      pythonCommand,
      [scriptPath, "--mod", "--workshop-pages", "--change-notes"],
      { stdio: "inherit" },
    );
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (signal) {
        reject(new Error(`CMT upload process terminated by ${signal}`));
      } else {
        resolve(code ?? 1);
      }
    });
  });
}

async function persistCreatedWorkshopItemId(
  rootDirectory: string,
  profileId: string,
  workspaceDirectory: string,
): Promise<void> {
  const cmtConfig = await readFile(
    path.join(workspaceDirectory, "tools", "config.toml"),
    "utf8",
  );
  const matches = [
    ...cmtConfig.matchAll(
      /^\s*workshop_upload_item_id\s*=\s*(\d+)\s*(?:#.*)?$/gm,
    ),
  ];
  if (matches.length !== 1) {
    throw new Error(
      "CMT tools/config.toml must contain exactly one numeric workshop_upload_item_id setting",
    );
  }
  const workshopItemId = Number(matches[0][1]);
  if (!Number.isSafeInteger(workshopItemId) || workshopItemId <= 0) {
    return;
  }

  const configPath = path.join(rootDirectory, "config", "cmt-workshop.json");
  const configuration = JSON.parse(
    await readFile(configPath, "utf8"),
  ) as unknown;
  if (
    !isRecord(configuration) ||
    !isRecord(configuration.profiles) ||
    !isRecord(configuration.profiles[profileId])
  ) {
    throw new Error(`Unable to persist CMT Workshop ID for ${profileId}`);
  }
  const profile = configuration.profiles[profileId];
  if (typeof profile.workshopItemId !== "number") {
    throw new Error(`Invalid Workshop ID configuration for ${profileId}`);
  }
  if (profile.workshopItemId === 0) {
    profile.workshopItemId = workshopItemId;
    await writeFile(configPath, `${JSON.stringify(configuration, null, 2)}\n`);
  } else if (profile.workshopItemId !== workshopItemId) {
    throw new Error(
      `CMT used Workshop item ${workshopItemId}, but config/cmt-workshop.json specifies ${profile.workshopItemId}`,
    );
  }
}

async function main(): Promise<void> {
  const { command, profileId, toolkitDirectory, pythonCommand, confirmation } =
    parseArguments(process.argv.slice(2));
  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const cmtProfile = await loadCmtProfileConfiguration(
    rootDirectory,
    profileId,
  );
  const { artifactDirectory, metadata } = await packageWorkshopMod(
    rootDirectory,
    { profileId },
  );
  const result = await prepareCmtWorkspace({
    rootDirectory,
    profileId,
    artifactDirectory,
    workshopDirectory: path.resolve(
      rootDirectory,
      cmtProfile.workshopDirectory,
    ),
    toolkitDirectory: path.resolve(toolkitDirectory),
    workshopItemId: cmtProfile.workshopItemId,
    version: metadata.version,
  });
  console.log(
    `Prepared CMT workspace for ${metadata.name} at ${path.relative(rootDirectory, result.workspaceDirectory)}.`,
  );
  console.log(
    `CMT Workshop item ID: ${result.workshopItemId}. Preparation does not upload or create a Workshop item.`,
  );
  if (result.reusedWorkshopItemId) {
    console.log(
      `A locally saved item ID was retained. Update config/cmt-workshop.json with ${result.workshopItemId} to share it across machines.`,
    );
  }
  if (command === "publish") {
    const thumbnailPath = path.join(
      result.workspaceDirectory,
      ".metadata",
      "thumbnail.png",
    );
    await access(thumbnailPath);
    if (
      !(await confirmPublication(
        profileId,
        metadata.name,
        metadata.version,
        result.workshopItemId,
        confirmation,
      ))
    ) {
      console.log("Cancelled; no Workshop upload was started.");
      return;
    }

    let uploadExitCode = 1;
    try {
      uploadExitCode = await runCmtUpload(
        pythonCommand,
        path.join(result.workspaceDirectory, "tools", "upload.py"),
      );
    } finally {
      await persistCreatedWorkshopItemId(
        rootDirectory,
        profileId,
        result.workspaceDirectory,
      );
    }
    if (uploadExitCode !== 0) {
      throw new Error(`CMT upload exited with status ${uploadExitCode}`);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
