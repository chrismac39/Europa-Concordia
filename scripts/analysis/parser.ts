import { createHash } from "node:crypto";

export interface Definition {
  category: string;
  key: string;
  mode: "define" | "replace" | "inject";
  normalizedBody: string;
}

export interface LocalizationEntry {
  language: string;
  key: string;
  value: string;
}

function stripComment(line: string): string {
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '"' && line[index - 1] !== "\\") {
      quoted = !quoted;
    } else if (line[index] === "#" && !quoted) {
      return line.slice(0, index);
    }
  }
  return line;
}

export function semanticCategory(relativePath: string): string | undefined {
  const parts = relativePath.split("/");
  if (parts[0] === "in_game" && parts[1] === "common" && parts[2]) {
    return `common/${parts[2]}`;
  }
  if (parts[0] === "main_menu" && parts[1] === "common" && parts[2]) {
    return `main_menu/${parts[2]}`;
  }
  if (parts[0] === "in_game" && parts[1] === "events") {
    return "events";
  }
  return undefined;
}

export function extractDefinitions(
  relativePath: string,
  contents: string,
): Definition[] {
  const category = semanticCategory(relativePath);
  if (!category || !relativePath.endsWith(".txt")) {
    return [];
  }

  const lines = contents.replace(/^\uFEFF/, "").split(/\r?\n/);
  const definitions: Definition[] = [];
  let depth = 0;
  let active:
    | {
        category: string;
        key: string;
        mode: Definition["mode"];
        lines: string[];
        startDepth: number;
      }
    | undefined;

  for (const originalLine of lines) {
    const line = stripComment(originalLine);
    if (!active && depth === 0) {
      const match = line.match(
        /^\s*(?:(REPLACE|INJECT):)?([A-Za-z0-9_.-]+)\s*=\s*\{/,
      );
      if (match) {
        active = {
          category,
          key: match[2],
          mode:
            match[1] === "REPLACE"
              ? "replace"
              : match[1] === "INJECT"
                ? "inject"
                : "define",
          lines: [],
          startDepth: depth,
        };
      }
    }

    active?.lines.push(line);
    const braces = line.replace(/"([^"\\]|\\.)*"/g, "");
    depth += (braces.match(/\{/g) ?? []).length;
    depth -= (braces.match(/\}/g) ?? []).length;

    if (active && depth === active.startDepth) {
      definitions.push({
        category: active.category,
        key: active.key,
        mode: active.mode,
        normalizedBody: active.lines.join("\n").replace(/\s+/g, " ").trim(),
      });
      active = undefined;
    }
  }
  return definitions;
}

export function extractLocalization(
  relativePath: string,
  contents: string,
): LocalizationEntry[] {
  if (!relativePath.endsWith(".yml")) {
    return [];
  }
  const language =
    relativePath.match(/localization\/([^/]+)\//)?.[1] ?? "unknown";
  const entries: LocalizationEntry[] = [];
  for (const line of contents.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const match = line.match(
      /^\s*([A-Za-z0-9_.-]+):(?:\d+)?\s+"((?:[^"\\]|\\.)*)"/,
    );
    if (match) {
      entries.push({ language, key: match[1], value: match[2] });
    }
  }
  return entries;
}

export function extractLocalizationLine(
  relativePath: string,
  line: string,
): LocalizationEntry | undefined {
  const language =
    relativePath.match(/localization\/([^/]+)\//)?.[1] ?? "unknown";
  const match = line
    .replace(/^\uFEFF/, "")
    .match(/^\s*([A-Za-z0-9_.-]+):(?:\d+)?\s+"((?:[^"\\]|\\.)*)"/);
  return match ? { language, key: match[1], value: match[2] } : undefined;
}

export function extractGlobalVariables(contents: string): string[] {
  const variables = new Set<string>();
  const patterns = [
    /\b(?:set|change|remove|has)_global_variable\s*=\s*([A-Za-z0-9_.-]+)/g,
    /\b(?:set|change)_global_variable\s*=\s*\{[\s\S]{0,300}?\bname\s*=\s*([A-Za-z0-9_.-]+)/g,
  ];
  for (const pattern of patterns) {
    for (const match of contents.matchAll(pattern)) {
      variables.add(match[1]);
    }
  }
  return [...variables].sort();
}

export function extractCountryTags(contents: string): Map<string, number> {
  const counts = new Map<string, number>();
  const patterns = [
    /\bc:([A-Z][A-Z0-9_]{2,})\b/g,
    /\b(?:tag|has_or_had_tag)\s*=\s*([A-Z][A-Z0-9_]{2,})\b/g,
  ];
  for (const pattern of patterns) {
    for (const match of contents.matchAll(pattern)) {
      counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
    }
  }
  return counts;
}

export function fingerprint(parts: string[]): string {
  return createHash("sha256")
    .update(parts.join("\u0000"))
    .digest("hex")
    .slice(0, 16);
}
