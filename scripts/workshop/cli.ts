import path from "node:path";
import { fileURLToPath } from "node:url";
import { installWorkshopModLocally } from "./packager.js";

async function main(): Promise<void> {
  const [command] = process.argv.slice(2);
  if (command !== "install") {
    throw new Error("Usage: npm run workshop:install");
  }

  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const modDirectory = await installWorkshopModLocally(rootDirectory);
  console.log(
    `Installed Europa Concordia for the EU5 launcher at ${modDirectory}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
