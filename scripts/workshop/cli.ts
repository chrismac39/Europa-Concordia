import path from "node:path";
import { fileURLToPath } from "node:url";
import { installWorkshopModLocally } from "./packager.js";

async function main(): Promise<void> {
  const [command, ...argumentsValue] = process.argv.slice(2);
  if (command !== "install") {
    throw new Error(
      "Usage: npm run workshop:install -- [--profile PROFILE_ID]",
    );
  }
  let profileId: string | undefined;
  for (let index = 0; index < argumentsValue.length; index += 1) {
    const option = argumentsValue[index];
    if (
      option === "--profile" &&
      profileId === undefined &&
      argumentsValue[index + 1]
    ) {
      profileId = argumentsValue[index + 1];
      index += 1;
    } else if (
      option.startsWith("--profile=") &&
      profileId === undefined &&
      option.length > "--profile=".length
    ) {
      profileId = option.slice("--profile=".length);
    } else {
      throw new Error(
        "Usage: npm run workshop:install -- [--profile PROFILE_ID]",
      );
    }
  }

  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const modDirectory = await installWorkshopModLocally(rootDirectory, {
    profileId,
  });
  console.log(
    `Installed the generated Concordia patch for profile ${profileId ?? "current-intended"} at ${modDirectory}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
