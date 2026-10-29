import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { format } from "prettier";
import type {
  ConflictAnalysis,
  ConflictFinding,
  FindingSource,
} from "./model.js";
import { extractCustomizableLocalizationRules } from "./parser.js";

function markdownPath(fromDirectory: string, absolutePath: string): string {
  return path.relative(fromDirectory, absolutePath).split(path.sep).join("/");
}

function reviewSources(finding: ConflictFinding): FindingSource[] {
  const selected: FindingSource[] = [];
  const byPackage = new Map<string, FindingSource[]>();
  const seen = new Set<string>();
  for (const source of finding.sources) {
    const key = `${source.packageId}\u0000${source.relativePath}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const group = byPackage.get(source.packageId) ?? [];
    group.push(source);
    byPackage.set(source.packageId, group);
  }
  for (const packageSources of byPackage.values()) {
    selected.push(...packageSources.slice(0, 8));
  }
  return selected.slice(0, 24);
}

function decisionDomain(finding: ConflictFinding): string {
  if (
    finding.type === "system-overlap" ||
    finding.type === "system-interaction"
  ) {
    return "Cross-system country behavior";
  }
  if (finding.type === "global-variable") {
    return "Shared runtime state";
  }
  if (finding.type === "localization") {
    return "Localization and displayed names";
  }
  const evidence = [
    finding.title,
    ...finding.symbols,
    ...finding.sources.map((source) => source.relativePath),
  ]
    .join(" ")
    .toLowerCase();
  const domains: Array<[RegExp, string]> = [
    [/map_data|spline_network|setup\/1337|rivers\.png/, "Map and 1337 setup"],
    [/gui|interface/, "User interface"],
    [
      /customizable_localization|languages|country_name/,
      "Dynamic names and languages",
    ],
    [/formable_countries|form_country/, "Formable countries"],
    [/disaster|events|on_action|situation/, "Historical events and disasters"],
    [/goods|prices|production|living_standard|market/, "Economy and goods"],
    [/building|town_right|urban/, "Buildings and urban systems"],
    [/advance/, "Advances and progression"],
    [/government|law|subject_type|interaction/, "Government and subjects"],
    [/peace_treat|casus_belli|wargoal|war/, "War, diplomacy, and peace"],
    [/culture|religion|pop/, "Cultures, religions, and population"],
    [/coat_of_arms|flag/, "Flags and visual identity"],
    [/localization/, "Localization and displayed names"],
  ];
  return (
    domains.find(([pattern]) => pattern.test(evidence))?.[1] ??
    (finding.type === "path"
      ? "Shared output files"
      : "Other scripted definitions")
  );
}

const categoryLabels: Record<string, string> = {
  advances: "advances",
  buildings: "buildings",
  casus_belli: "casus belli",
  coat_of_arms: "coats of arms",
  cultures: "cultures",
  customizable_localization: "dynamic names",
  disasters: "disasters",
  events: "events",
  formable_countries: "formable countries",
  generic_actions: "country actions",
  goods: "goods",
  governments: "governments",
  government_reforms: "government reforms",
  international_organizations: "international organizations",
  laws: "laws",
  on_action: "event triggers and on-actions",
  peace_treaties: "peace treaties",
  religions: "religions",
  script_values: "scripted values",
  scripted_effects: "scripted effects",
  scripted_triggers: "scripted triggers",
  subject_types: "subject types",
};

const languageLabels: Record<string, string> = {
  braz_por: "Brazilian Portuguese",
  english: "English",
  french: "French",
  german: "German",
  japanese: "Japanese",
  korean: "Korean",
  polish: "Polish",
  russian: "Russian",
  simp_chinese: "Simplified Chinese",
  spanish: "Spanish",
  turkish: "Turkish",
};

function sourceCategory(relativePath: string): string | undefined {
  const normalized = relativePath.replaceAll("\\", "/");
  const common = /\/common\/([^/]+)/.exec(normalized)?.[1];
  if (common) {
    return categoryLabels[common] ?? common.replaceAll("_", " ");
  }
  if (/\/events\//.test(normalized)) {
    return "events";
  }
  if (/\/gui\//.test(normalized)) {
    return "user interface";
  }
  if (/\/localization\//.test(normalized)) {
    if (/\/location_names\//.test(normalized)) {
      return "location names";
    }
    return "localization";
  }
  if (/\/map_data\//.test(normalized) || /\/setup\/1337\//.test(normalized)) {
    return "map and 1337 setup";
  }
  return undefined;
}

function findingTopic(finding: ConflictFinding): string {
  if (finding.type === "system-overlap") {
    return "shared-country behavior";
  }
  if (finding.type === "system-interaction") {
    return "active shared-country behavior";
  }
  if (finding.type === "global-variable") {
    return "shared runtime variables";
  }
  if (finding.type === "localization") {
    const language = finding.symbols[0]?.split(":", 1)[0];
    const category =
      finding.sources
        .map((source) => sourceCategory(source.relativePath))
        .find((value) => value !== undefined) ?? "localization";
    return `${languageLabels[language ?? ""] ?? language ?? "unknown-language"} ${category}`;
  }
  const symbolCategory = finding.symbols[0]?.split(":", 1)[0].split("/").at(-1);
  return (
    (symbolCategory &&
      (categoryLabels[symbolCategory] ??
        symbolCategory.replaceAll("_", " "))) ??
    finding.sources
      .map((source) => sourceCategory(source.relativePath))
      .find((value) => value !== undefined) ??
    "scripted content"
  );
}

function sourceRole(relativePath: string): string {
  const category = sourceCategory(relativePath);
  const parsed = path.parse(relativePath.replaceAll("\\", "/"));
  const name = parsed.name
    .replace(/^(?:\d+|zz|zzz|ia|lot|htc|mo|rus_gathering)[_-]+/i, "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!name || name.toLowerCase() === category?.toLowerCase()) {
    return category ?? "scripted content";
  }
  return category ? `${name} (${category})` : name;
}

function directConflictDescription(
  typeCounts: Map<string, number>,
  symbolCount: number,
): string[] {
  const descriptions: string[] = [];
  const paths = typeCounts.get("path") ?? 0;
  const definitions = typeCounts.get("definition") ?? 0;
  const localization = typeCounts.get("localization") ?? 0;
  const globals = typeCounts.get("global-variable") ?? 0;
  const overlaps = typeCounts.get("system-overlap") ?? 0;
  if (paths > 0) {
    descriptions.push(
      `${paths} exact output path${paths === 1 ? "" : "s"} contain competing files. Concordia cannot ship both versions at the same path; each needs a winner or a merged replacement.`,
    );
  }
  if (definitions > 0) {
    descriptions.push(
      `${definitions} scripted definition finding${definitions === 1 ? "" : "s"} redefine the same EU5 object from different files or replacement modes. The effective body and its triggers/effects must be chosen or merged.`,
    );
  }
  if (localization > 0) {
    descriptions.push(
      `${localization} localization group${localization === 1 ? "" : "s"} assign different displayed text to shared keys. Unique keys can coexist, but every differing shared key needs an intentional text source or curated value.`,
    );
  }
  if (globals > 0) {
    descriptions.push(
      `${globals} shared-state finding${globals === 1 ? "" : "s"} use the same global variable names. Their writers, readers, reset timing, and expected value contract must agree.`,
    );
  }
  if (overlaps > 0) {
    descriptions.push(
      `${overlaps} country-footprint warning${overlaps === 1 ? " shows" : "s show"} both systems acting on many of the same tags. This is not proof of a collision; the real choice is whether to accept coexistence after an interaction audit or establish one system as authoritative for those countries.`,
    );
  }
  if (symbolCount > 0) {
    descriptions.push(
      `Across this card, ${symbolCount} distinct symbol${symbolCount === 1 ? "" : "s"} or localization key${symbolCount === 1 ? "" : "s"} are implicated.`,
    );
  }
  return descriptions;
}

function sourceMarkdown(
  source: FindingSource,
  integrationDirectory: string,
): string {
  const packageLabel = source.packageName
    .replaceAll("[", "")
    .replaceAll("]", "");
  return `[${packageLabel}: ${source.relativePath}](${markdownPath(integrationDirectory, source.absolutePath)})`;
}

function findingSourceKey(source: FindingSource): string {
  return `${source.packageId}\u0000${source.relativePath}`;
}

function ruleTheme(localizationKey: string): string {
  const words = localizationKey
    .replace(/^(?:ia|ht)_/, "")
    .replace(/^(?:country_flavor|country_rank|rank)_/, "")
    .split("_")
    .filter(
      (word) =>
        !["county", "duchy", "kingdom", "empire", "heir"].includes(word),
    );
  return words.join(" ");
}

function sourceIntentComments(contents: string): string[] {
  const paragraphs: string[] = [];
  let current: string[] = [];
  const flush = (): void => {
    if (current.length > 0) {
      paragraphs.push(current.join(" ").replace(/\s+/g, " ").trim());
      current = [];
    }
  };
  for (const line of contents.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const match = /^\s*#\s?(.*)$/.exec(line);
    if (match) {
      current.push(match[1]);
    } else {
      flush();
    }
  }
  flush();
  return paragraphs
    .filter(
      (paragraph) =>
        /\b(?:this mod|mod's|imperial ambitions|historical tweaks|gathering|prussian destiny)\b/i.test(
          paragraph,
        ) || /\bdisabled\b/i.test(paragraph),
    )
    .filter(
      (paragraph) =>
        !/\b(?:do not edit|generator|re-run)\b/i.test(paragraph) ||
        /\b(?:plus one|this mod|mod's)\b/i.test(paragraph),
    )
    .map((paragraph) => {
      if (paragraph.length <= 280) {
        return paragraph;
      }
      const intentIndex = paragraph.search(
        /\b(?:plus one|this mod's|imperial ambitions|historical tweaks|gathering|prussian destiny)\b/i,
      );
      const start = intentIndex > 80 ? intentIndex - 80 : 0;
      return `${start > 0 ? "..." : ""}${paragraph.slice(start, start + 277)}...`;
    })
    .slice(0, 3);
}

async function definitionSourceNotes(
  sources: FindingSource[],
): Promise<Map<string, string[]>> {
  const notes = new Map<string, string[]>();
  for (const source of reviewSources({
    fingerprint: "",
    type: "definition",
    title: "",
    summary: "",
    packages: [],
    symbols: [],
    sources,
    resolved: false,
  })) {
    if (!source.relativePath.endsWith(".txt")) {
      continue;
    }
    const contents = await readFile(source.absolutePath, "utf8");
    const declaresDisabled = /^\s*#\s*DISABLED\b/im.test(contents);
    const sourceNotes = sourceIntentComments(contents)
      .filter((note) => !declaresDisabled || !/\bdisabled\b/i.test(note))
      .filter((note) =>
        /\b(?:disabled|human|ai|never starts?|replaces?|creates?|releases?|successor|dissolv|collapse|ends?)\b/i.test(
          note,
        ),
      )
      .slice(0, 2);
    if (declaresDisabled) {
      const activeContents = contents
        .split(/\r?\n/)
        .filter((line) => !/^\s*#/.test(line))
        .join("\n");
      sourceNotes.push(
        /\balways\s*=\s*no\b/.test(activeContents)
          ? "The source declares this system disabled and contains an active `always = no` guard."
          : "The source declares this system disabled, but its `always = no` guard is commented out; the definition remains active as written.",
      );
    }
    if (sourceNotes.length > 0) {
      notes.set(findingSourceKey(source), [...new Set(sourceNotes)]);
    }
  }
  return notes;
}

function customizableLocalizationPurpose(sources: FindingSource[]): string {
  const names = new Set(
    sources.map((source) => path.basename(source.relativePath).toLowerCase()),
  );
  if (names.has("country_ranks.txt")) {
    return "This file selects conditional country-rank, ruler-title, and heir-title text such as Tsardom, Khanate, Sultanate, or Confederation. Its downstream effect is display-only: it does not fire events, create successors, mutate state, or replace the underlying country tag.";
  }
  if (names.has("country_name_construction.txt")) {
    return "This file controls how rank words, adjectives, prefixes, suffixes, and base names are assembled into the displayed long country name. Its rules complement, rather than replace, the rank/title rules in `country_ranks.txt`.";
  }
  return "These files select conditional displayed text from localization keys. Their rule ordering and triggers determine which name or title is shown.";
}

interface SemanticSourceSummary {
  concise: string;
}

interface CustomizableLocalizationAnalysis {
  assessments: string[];
  sharedDifferences: string[];
  sources: Map<string, SemanticSourceSummary>;
}

interface ConditionProfile {
  ruleCount: number;
  tags: string[];
  variables: string[];
  reforms: string[];
  ranks: string[];
  governments: string[];
  languages: string[];
  advances: string[];
  hasTimingGuard: boolean;
  normalized: string;
}

function matchedValues(contents: string, pattern: RegExp): string[] {
  return [...new Set([...contents.matchAll(pattern)].map((match) => match[1]))]
    .filter((value) => value !== undefined)
    .sort((left, right) => left.localeCompare(right, "en-US"));
}

function conditionProfile(
  rules: ReturnType<typeof extractCustomizableLocalizationRules>,
): ConditionProfile {
  const contents = rules.map((rule) => rule.normalizedBody).join(" ");
  return {
    ruleCount: rules.length,
    tags: [...new Set(rules.flatMap((rule) => rule.tags))].sort(),
    variables: [...new Set(rules.flatMap((rule) => rule.variables))].sort(),
    reforms: [...new Set(rules.flatMap((rule) => rule.reforms))].sort(),
    ranks: [
      ...new Set([
        ...matchedValues(contents, /\bcountry_rank_is_([a-z_]+)\s*=\s*yes/g),
        ...matchedValues(contents, /\bcountry_rank_level\s*=\s*(\d+)/g).map(
          (level) => `level-${level}`,
        ),
      ]),
    ].sort(),
    governments: matchedValues(
      contents,
      /\bgovernment_type\s*=\s*government_type:([A-Za-z0-9_.-]+)/g,
    ),
    languages: matchedValues(
      contents,
      /\b(?:court_language|culture\.language)\s*\?=\s*language:([A-Za-z0-9_.-]+)/g,
    ),
    advances: matchedValues(contents, /\bhas_advance\s*=\s*([A-Za-z0-9_.-]+)/g),
    hasTimingGuard: /\btrigger_if\s*=\s*\{/.test(contents),
    normalized: contents,
  };
}

function describeConditionProfile(profile: ConditionProfile): string {
  const parts: string[] = [];
  if (profile.ruleCount > 1) {
    parts.push(`${profile.ruleCount} alternative rule branches`);
  }
  if (profile.tags.length > 0) {
    parts.push(`tags ${profile.tags.join("/")}`);
  }
  if (profile.ranks.length > 0) {
    parts.push(`rank ${profile.ranks.join("/")}`);
  } else {
    parts.push("no explicit rank guard");
  }
  if (profile.governments.length > 0) {
    parts.push(`government ${profile.governments.join("/")}`);
  }
  if (profile.variables.length > 0) {
    parts.push(`state ${profile.variables.join("/")}`);
  }
  if (profile.reforms.length > 0) {
    parts.push(`reform ${profile.reforms.join("/")}`);
  }
  if (profile.languages.length > 0) {
    parts.push(`language ${profile.languages.join("/")}`);
  }
  if (profile.advances.length > 0) {
    parts.push(`advance ${profile.advances.join("/")}`);
  }
  if (profile.hasTimingGuard) {
    parts.push("ruler/reform timing guard");
  }
  return parts.join("; ");
}

function difference<T>(left: T[], right: T[]): T[] {
  const rightValues = new Set(right);
  return left.filter((value) => !rightValues.has(value));
}

function profileImplication(
  key: string,
  baseline: ConditionProfile,
  variant: ConditionProfile,
): string {
  const implications: string[] = [];
  const addedTags = difference(variant.tags, baseline.tags);
  const removedTags = difference(baseline.tags, variant.tags);
  const addedVariables = difference(variant.variables, baseline.variables);
  const removedVariables = difference(baseline.variables, variant.variables);
  const addedLanguages = difference(variant.languages, baseline.languages);
  const removedLanguages = difference(baseline.languages, variant.languages);
  const addedAdvances = difference(variant.advances, baseline.advances);
  const removedAdvances = difference(baseline.advances, variant.advances);
  if (variant.ruleCount > baseline.ruleCount) {
    implications.push(
      `adds ${variant.ruleCount - baseline.ruleCount} activation branch(es)`,
    );
  } else if (variant.ruleCount < baseline.ruleCount) {
    implications.push(
      `drops ${baseline.ruleCount - variant.ruleCount} activation branch(es)`,
    );
  }
  if (addedTags.length > 0) {
    implications.push(`extends the title to ${addedTags.join("/")}`);
  }
  if (removedTags.length > 0) {
    implications.push(
      `removes explicit eligibility for ${removedTags.join("/")}`,
    );
  }
  if (addedVariables.length > 0) {
    implications.push(
      `activates from state ${addedVariables.map((value) => `\`${value}\``).join("/")}`,
    );
  }
  if (removedVariables.length > 0) {
    implications.push(
      `does not activate from state ${removedVariables.map((value) => `\`${value}\``).join("/")}`,
    );
  }
  if (addedLanguages.length > 0) {
    implications.push(
      `extends eligibility to ${addedLanguages.join("/")} speakers`,
    );
  }
  if (removedLanguages.length > 0) {
    implications.push(
      `drops ${removedLanguages.join("/")} language eligibility`,
    );
  }
  if (addedAdvances.length > 0) {
    implications.push(`adds advance gate ${addedAdvances.join("/")}`);
  }
  if (removedAdvances.length > 0) {
    implications.push(`drops advance gate ${removedAdvances.join("/")}`);
  }
  if (baseline.ranks.length > 0 && variant.ranks.length === 0) {
    implications.push(
      "removes the rank restriction and may apply at other ranks",
    );
  } else if (baseline.ranks.length === 0 && variant.ranks.length > 0) {
    implications.push(`restricts the title to rank ${variant.ranks.join("/")}`);
  } else {
    const addedRanks = difference(variant.ranks, baseline.ranks);
    const removedRanks = difference(baseline.ranks, variant.ranks);
    if (addedRanks.length > 0) {
      implications.push(`adds rank ${addedRanks.join("/")} eligibility`);
    }
    if (removedRanks.length > 0) {
      implications.push(`drops rank ${removedRanks.join("/")} eligibility`);
    }
  }
  if (baseline.hasTimingGuard && !variant.hasTimingGuard) {
    implications.push("removes the ruler/reform timing guard");
  } else if (!baseline.hasTimingGuard && variant.hasTimingGuard) {
    implications.push("adds a ruler/reform timing guard");
  }
  if (implications.length === 0) {
    if (
      key === "rank_duchy_principality" &&
      baseline.normalized.includes("tag = ANR AND =") &&
      variant.normalized.includes("tag = ANR } country_rank_is_duchy")
    ) {
      implications.push(
        "requires ANR to be a duchy, while the majority variant lets ANR display Principality regardless of rank",
      );
    } else {
      implications.push(
        "uses different boolean grouping or unsupported conditions; inspect the linked source before merging",
      );
    }
  }
  return implications.join("; ");
}

function conciseIntent(comment: string): string {
  const oneLineChange =
    /plus one line of this mod's:\s*tag\s*=\s*([A-Z0-9_]+)\s+under localization_key\s*=\s*([A-Za-z0-9_.-]+)/i.exec(
      comment,
    );
  if (oneLineChange) {
    return `Adds tag \`${oneLineChange[1]}\` to the \`${oneLineChange[2].replace(/\.+$/g, "")}\` title rule`;
  }
  const vanillaDelta = /Vanilla's file WHOLE,\s*(.+)/i.exec(comment)?.[1];
  return (vanillaDelta ?? comment)
    .replace(/[.\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function customizableLocalizationSummaries(
  sources: FindingSource[],
): Promise<CustomizableLocalizationAnalysis> {
  const groups = new Map<string, FindingSource[]>();
  for (const source of sources) {
    const normalized = source.relativePath.replaceAll("\\", "/");
    if (!normalized.includes("/common/customizable_localization/")) {
      continue;
    }
    const group = groups.get(normalized.toLowerCase()) ?? [];
    if (
      !group.some(
        (candidate) => findingSourceKey(candidate) === findingSourceKey(source),
      )
    ) {
      group.push(source);
    }
    groups.set(normalized.toLowerCase(), group);
  }

  const summaries = new Map<string, SemanticSourceSummary>();
  const assessments: string[] = [];
  const sharedDifferences: string[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }
    const parsed = await Promise.all(
      group.map(async (source) => {
        const contents = await readFile(source.absolutePath, "utf8");
        return {
          source,
          rules: extractCustomizableLocalizationRules(
            source.relativePath,
            contents,
          ),
          intentComments: sourceIntentComments(contents),
        };
      }),
    );
    const keySources = new Map<string, Set<string>>();
    const signatures = new Map<string, Set<string>>();
    for (const entry of parsed) {
      const sourceId = findingSourceKey(entry.source);
      const rulesByKey = new Map<string, string[]>();
      for (const rule of entry.rules) {
        const bodies = rulesByKey.get(rule.localizationKey) ?? [];
        bodies.push(rule.normalizedBody);
        rulesByKey.set(rule.localizationKey, bodies);
      }
      for (const [key, bodies] of rulesByKey) {
        const owners = keySources.get(key) ?? new Set<string>();
        owners.add(sourceId);
        keySources.set(key, owners);
        const variants = signatures.get(key) ?? new Set<string>();
        variants.add(JSON.stringify(bodies.sort()));
        signatures.set(key, variants);
      }
    }
    const commonKeys = [...keySources].filter(
      ([key, owners]) =>
        owners.size === group.length && signatures.get(key)?.size === 1,
    );
    const uniqueGroupKeys = [...keySources].filter(
      ([, owners]) => owners.size === 1,
    );
    const changedGroupKeys = [...keySources].filter(
      ([key, owners]) =>
        owners.size > 1 && (signatures.get(key)?.size ?? 0) > 1,
    );
    assessments.push(
      `Across \`${path.basename(group[0].relativePath)}\`, ${commonKeys.length} shared keys match every copy, ${uniqueGroupKeys.length} keys are package-specific, and ${changedGroupKeys.length} shared keys have different triggers. The package-specific additions are mostly additive; preserve them all and merge only the differing shared triggers.`,
    );
    for (const [key] of changedGroupKeys) {
      const variants = new Map<
        string,
        {
          packageNames: string[];
          profile: ConditionProfile;
        }
      >();
      for (const entry of parsed) {
        const rules = entry.rules.filter(
          (rule) => rule.localizationKey === key,
        );
        if (rules.length === 0) {
          continue;
        }
        const signature = JSON.stringify(
          rules.map((rule) => rule.normalizedBody).sort(),
        );
        const variant = variants.get(signature) ?? {
          packageNames: [],
          profile: conditionProfile(rules),
        };
        variant.packageNames.push(entry.source.packageName);
        variants.set(signature, variant);
      }
      const orderedVariants = [...variants.values()].sort(
        (left, right) => right.packageNames.length - left.packageNames.length,
      );
      const baseline = orderedVariants[0];
      const alternatives = orderedVariants.slice(1);
      sharedDifferences.push(
        `- \`${key}\` — **${baseline.packageNames.join(" / ")}:** ${describeConditionProfile(baseline.profile)}.${alternatives
          .map(
            (variant) =>
              ` **${variant.packageNames.join(" / ")}:** ${describeConditionProfile(variant.profile)}. **Implication:** ${profileImplication(key, baseline.profile, variant.profile)}.`,
          )
          .join("")}`,
      );
    }

    for (const entry of parsed) {
      const sourceId = findingSourceKey(entry.source);
      const uniqueKeys = [
        ...new Set(
          entry.rules
            .map((rule) => rule.localizationKey)
            .filter((key) => keySources.get(key)?.size === 1),
        ),
      ].sort();
      const relevantRules = entry.rules.filter((rule) =>
        uniqueKeys.includes(rule.localizationKey),
      );
      const variables = [
        ...new Set(relevantRules.flatMap((rule) => rule.variables)),
      ].sort();
      const themes = [
        ...new Set(uniqueKeys.map(ruleTheme).filter((theme) => theme !== "")),
      ];
      const conciseParts: string[] = [];
      if (themes.length > 0) {
        conciseParts.push(
          `Adds conditional title/name rules for ${themes
            .slice(0, 12)
            .join(
              ", ",
            )}${themes.length > 12 ? `, and ${themes.length - 12} more` : ""}.`,
        );
      } else if (entry.intentComments.length > 0) {
        conciseParts.push(`${conciseIntent(entry.intentComments[0])}.`);
      } else {
        conciseParts.push(
          "Adds no package-specific localization key; its differences are confined to shared trigger bodies.",
        );
      }
      if (variables.length > 0 && themes.length > 0) {
        conciseParts.push(
          `State-driven behavior uses ${variables
            .slice(0, 6)
            .map((value) => `\`${value}\``)
            .join(
              ", ",
            )}${variables.length > 6 ? `, and ${variables.length - 6} more` : ""}.`,
        );
      }
      summaries.set(sourceId, {
        concise: conciseParts.join(" "),
      });
    }
  }
  return { assessments, sharedDifferences, sources: summaries };
}

function readableOperations(values: string[]): string {
  return values
    .slice(0, 12)
    .map((value) => `\`${value.replace(":", " → ")}\``)
    .join(", ");
}

function definitionBehaviorSummary(findings: ConflictFinding[]): {
  lines: string[];
  consequence: string | undefined;
} {
  const variants = findings.flatMap(
    (finding) => finding.definitionVariants ?? [],
  );
  if (variants.length === 0) {
    return { lines: [], consequence: undefined };
  }
  const grouped = new Map<string, typeof variants>();
  for (const variant of variants) {
    const group = grouped.get(variant.packageId) ?? [];
    group.push(variant);
    grouped.set(variant.packageId, group);
  }
  const lines: string[] = [];
  const outcomeSets = new Map<string, string[]>();
  let meaningful = false;
  for (const packageVariants of grouped.values()) {
    const packageName = packageVariants[0].packageName;
    const conditions = [
      ...new Set(
        packageVariants.flatMap(
          (variant) => variant.direct.importantConditions,
        ),
      ),
    ];
    const values = [
      ...new Set(
        packageVariants.flatMap((variant) => variant.direct.importantValues),
      ),
    ];
    const events = [
      ...new Set(
        packageVariants.flatMap((variant) => variant.direct.eventReferences),
      ),
    ];
    const variables = [
      ...new Set(
        packageVariants.flatMap((variant) => variant.direct.variablesWritten),
      ),
    ];
    const directOutcomes = [
      ...new Set(
        packageVariants.flatMap((variant) => variant.direct.countryOutcomes),
      ),
    ];
    const downstreamOutcomes = [
      ...new Set(
        packageVariants.flatMap(
          (variant) => variant.downstream.countryOutcomes,
        ),
      ),
    ];
    const dependencies = [
      ...new Set(
        packageVariants.flatMap((variant) => variant.direct.dependencySymbols),
      ),
    ];
    const allOutcomes = [
      ...new Set([...directOutcomes, ...downstreamOutcomes]),
    ].sort();
    outcomeSets.set(packageName, allOutcomes);
    const statements: string[] = [];
    if (conditions.length > 0) {
      statements.push(`entry/end conditions: ${conditions.join(", ")}`);
    }
    if (values.length > 0) {
      statements.push(`balance values: ${values.join(", ")}`);
    }
    if (events.length > 0) {
      statements.push(`fires events ${events.slice(0, 12).join(", ")}`);
    }
    if (variables.length > 0) {
      statements.push(`writes state ${readableOperations(variables)}`);
    }
    if (allOutcomes.length > 0) {
      statements.push(
        `country outcomes found in the traced chain: ${readableOperations(allOutcomes)}`,
      );
    } else if (dependencies.length > 0) {
      statements.push(
        `delegates downstream behavior to ${dependencies
          .slice(0, 12)
          .map((value) => `\`${value}\``)
          .join(", ")}`,
      );
    }
    meaningful ||= statements.length > 0;
    lines.push(
      `- **${packageName}:** ${statements.length > 0 ? statements.join("; ") : "No recognized gameplay effects were extracted; inspect the linked definition"}.`,
    );
  }
  if (!meaningful) {
    return { lines: [], consequence: undefined };
  }
  const distinctOutcomes = new Set(
    [...outcomeSets.values()].map((outcomes) => JSON.stringify(outcomes)),
  );
  let consequence: string | undefined;
  if ([...outcomeSets.values()].some((outcomes) => outcomes.length > 0)) {
    consequence =
      distinctOutcomes.size > 1
        ? `The traced country outcomes differ: ${[...outcomeSets].map(([packageName, outcomes]) => `**${packageName}** ${outcomes.length > 0 ? readableOperations(outcomes) : "has no recognized country-creation/release outcome"}`).join("; ")}. Those successor outcomes must be chosen explicitly before merging.`
        : "The traced country-creation/release outcomes match across implementations; the remaining choice is trigger, balance, state, and event behavior.";
  } else {
    consequence =
      "No direct country creation, release, annexation, destruction, or tag change was found in the traced package-local dependency chains. If successor states are produced indirectly by engine behavior or an unrecognized command, the linked event chain still requires manual review.";
  }
  return { lines, consequence };
}

export async function writeConflictReports(
  rootDirectory: string,
  analysis: ConflictAnalysis,
): Promise<void> {
  const reportsDirectory = path.join(rootDirectory, "reports");
  const integrationDirectory = path.join(rootDirectory, "integration");
  await mkdir(reportsDirectory, { recursive: true });

  const portableAnalysis = {
    ...analysis,
    findings: analysis.findings.map((finding) => ({
      ...finding,
      sources: finding.sources.map((source) => ({
        packageId: source.packageId,
        packageName: source.packageName,
        relativePath: source.relativePath,
      })),
    })),
  };
  await writeFile(
    path.join(reportsDirectory, "conflicts.json"),
    `${JSON.stringify(portableAnalysis, null, 2)}\n`,
    "utf8",
  );

  const unresolved = analysis.findings.filter((finding) => !finding.resolved);
  const observations = analysis.findings.filter(
    (finding) => finding.type === "system-observation",
  );
  const interactions = analysis.findings.filter(
    (finding) => finding.type === "system-interaction",
  );
  const resolved = analysis.findings.filter(
    (finding) =>
      finding.resolved &&
      finding.type !== "system-observation" &&
      finding.type !== "system-interaction",
  );
  const counts = new Map<string, number>();
  for (const finding of analysis.findings) {
    counts.set(finding.type, (counts.get(finding.type) ?? 0) + 1);
  }

  const deepLines = [
    "# Deep integration frontier",
    "",
    `Generated by \`npm run analyze\` from ${analysis.packageCount} enabled packages for EU5 ${analysis.targetGameVersion}.`,
    "No unresolved finding selects a winner automatically; every resolution requires an explicit user-approved rule or Concordia merge.",
    "",
    "## Review commands",
    "",
    "Open any numbered item in VS Code's labeled side-by-side diff editor:",
    "",
    "```sh",
    "npm run diff -- 1",
    "```",
    "",
    "The complete machine-readable evidence, including every source path and symbol, is in",
    "[`reports/conflicts.json`](../reports/conflicts.json). The Markdown frontier limits very large interaction-risk items to representative source files.",
    "",
    "## Summary",
    "",
    `- Unresolved findings: ${unresolved.length}`,
    `- User-approved resolved findings: ${resolved.length}`,
    `- Exact path findings: ${counts.get("path") ?? 0}`,
    `- Cross-file definition findings: ${counts.get("definition") ?? 0}`,
    `- Localization findings: ${counts.get("localization") ?? 0}`,
    `- Shared global-variable findings: ${counts.get("global-variable") ?? 0}`,
    `- Country-system overlap findings: ${counts.get("system-overlap") ?? 0}`,
    `- Non-blocking active interaction risks: ${interactions.length}`,
    `- Categorized non-conflict observations: ${observations.length}`,
    "",
    "## Navigation index",
    "",
    ...analysis.findings.map(
      (finding, index) =>
        `- [#${index + 1} — ${finding.type}: ${finding.title}](#finding-${index + 1})`,
    ),
    "",
    "## Findings",
    "",
  ];

  analysis.findings.forEach((finding, index) => {
    const status =
      finding.type === "system-observation"
        ? "NOT A CONFLICT"
        : finding.type === "system-interaction"
          ? "INTERACTION RISK"
          : finding.resolved
            ? "RESOLVED"
            : "DECISION REQUIRED";
    deepLines.push(
      `<a id="finding-${index + 1}"></a>`,
      `- **#${index + 1}** \`${finding.type}: ${finding.title}\`:`,
      `  **${status}** — ${finding.summary}`,
      `  Fingerprint: \`${finding.fingerprint}\``,
    );
    if (finding.symbols.length > 0) {
      const shown = finding.symbols
        .slice(0, 20)
        .map((symbol) => `\`${symbol}\``);
      deepLines.push(
        `  Symbols: ${shown.join(", ")}${finding.symbols.length > shown.length ? `, and ${finding.symbols.length - shown.length} more` : ""}`,
      );
    }
    if (finding.resolution) {
      deepLines.push(`  Resolution: ${finding.resolution}`);
    }
    const sources = reviewSources(finding);
    for (const source of sources) {
      deepLines.push(`  ${sourceMarkdown(source, integrationDirectory)}`);
    }
    if (finding.sources.length > sources.length) {
      deepLines.push(
        `  ${finding.sources.length - sources.length} additional source file(s) are listed in the JSON report.`,
      );
    }
    deepLines.push("");
  });

  const deepMarkdown = await format(`${deepLines.join("\n")}\n`, {
    parser: "markdown",
  });
  await writeFile(
    path.join(integrationDirectory, "deep-frontier.md"),
    deepMarkdown,
    "utf8",
  );

  const packageNames = new Map<string, string>();
  for (const finding of analysis.findings) {
    for (const source of finding.sources) {
      packageNames.set(source.packageId, source.packageName);
    }
  }
  const deepNumbers = new Map(
    analysis.findings.map((finding, index) => [finding.fingerprint, index + 1]),
  );
  const decisionGroups = new Map<
    string,
    {
      domain: string;
      packages: string[];
      findings: ConflictFinding[];
    }
  >();
  for (const finding of unresolved) {
    const domain = decisionDomain(finding);
    const packages = finding.packages.slice().sort();
    const key = `${domain}\u0000${packages.join("\u0000")}`;
    const group = decisionGroups.get(key) ?? {
      domain,
      packages,
      findings: [],
    };
    group.findings.push(finding);
    decisionGroups.set(key, group);
  }
  const decisions = [...decisionGroups.values()].sort((left, right) =>
    `${left.domain}:${left.packages.join(":")}`.localeCompare(
      `${right.domain}:${right.packages.join(":")}`,
      "en-US",
    ),
  );
  const decisionLines = [
    "# High-level decision frontier",
    "",
    `Generated by \`npm run analyze\` from ${analysis.packageCount} enabled packages for EU5 ${analysis.targetGameVersion}.`,
    `The ${unresolved.length} unresolved deep findings are grouped into ${decisions.length} system-level votes.`,
    "These cards ask what Concordia should preserve or use as its base. A vote does not itself alter files; it authorizes the subsequent merge and semantic-resolution records.",
    "",
    "## How to decide",
    "",
    "Each card now explains the collision mechanism, breaks broad cards into concrete system questions, and presents choices tailored to the packages and evidence involved. You may choose one option for the whole card or answer its sub-decisions separately.",
    "",
    "Country-tag overlap alone is excluded from this voting frontier. Read-only and historical-reference overlap is categorized as non-conflicting; active overlap remains a non-blocking runtime interaction risk in the deep frontier. Exact paths, duplicate definitions, differing localization, and shared state remain here because they present concrete integration choices.",
    "",
    "Reply with the decision number, option letter, and any exceptions. For example: `Decision 3, option C; use Imperial Ambitions' horde collapse as the base but preserve the Rus successor-state names, events, and Tatar-yoke mechanics.`",
    "",
    "## Navigation index",
    "",
    ...decisions.map((decision, index) => {
      const labels = decision.packages.map(
        (packageId) => packageNames.get(packageId) ?? packageId,
      );
      return `- [Decision ${index + 1} — ${decision.domain}: ${labels.join(" / ")}](#decision-${index + 1})`;
    }),
    "",
    "## Decisions",
    "",
  ];
  for (const [index, decision] of decisions.entries()) {
    const typeCounts = new Map<string, number>();
    const symbols = new Set<string>();
    const allSources: FindingSource[] = [];
    const topics = new Map<string, ConflictFinding[]>();
    for (const finding of decision.findings) {
      typeCounts.set(finding.type, (typeCounts.get(finding.type) ?? 0) + 1);
      finding.symbols.forEach((symbol) => symbols.add(symbol));
      allSources.push(...finding.sources);
      const topic = findingTopic(finding);
      const topicFindings = topics.get(topic) ?? [];
      topicFindings.push(finding);
      topics.set(topic, topicFindings);
    }
    const semanticSummaries =
      await customizableLocalizationSummaries(allSources);
    const definitionBehavior = definitionBehaviorSummary(decision.findings);
    const definitionNotes =
      definitionBehavior.lines.length > 0
        ? await definitionSourceNotes(allSources)
        : new Map<string, string[]>();
    const sourceSelection = reviewSources({
      ...decision.findings[0],
      sources: allSources,
    }).slice(0, 12);
    const packageLabels = decision.packages.map(
      (packageId) => packageNames.get(packageId) ?? packageId,
    );
    const deepIds = decision.findings
      .map((finding) => deepNumbers.get(finding.fingerprint))
      .filter((value): value is number => value !== undefined);
    const sortedTopics = [...topics].sort(([left], [right]) =>
      left.localeCompare(right, "en-US"),
    );
    const hasDirectConflict = [
      "path",
      "definition",
      "localization",
      "global-variable",
    ].some((type) => (typeCounts.get(type) ?? 0) > 0);
    const hasOverlap = (typeCounts.get("system-overlap") ?? 0) > 0;
    const onlyOverlap = hasOverlap && !hasDirectConflict;
    const onlyLocalization =
      typeCounts.size === 1 && typeCounts.has("localization");
    const onActionCollision =
      sortedTopics.length > 0 &&
      sortedTopics.every(
        ([topic]) => topic === "event triggers and on-actions",
      );
    const packageRoles = decision.packages.map((packageId) => {
      const roles = [
        ...new Set(
          allSources
            .filter((source) => source.packageId === packageId)
            .map((source) => sourceRole(source.relativePath)),
        ),
      ];
      return {
        label: packageNames.get(packageId) ?? packageId,
        roles,
      };
    });
    const choices: string[] = [];
    let choiceCode = 65;
    let preservationChoice: string | undefined;
    const addChoice = (title: string, description: string): string => {
      const code = String.fromCharCode(choiceCode);
      choices.push(`- **${code} — ${title}:** ${description}`);
      choiceCode += 1;
      return code;
    };
    if (onActionCollision) {
      preservationChoice = addChoice(
        "Merge every compatible hook",
        "build one Concordia on-action definition that retains each package's registered callbacks, then decide ordering and remove only callbacks proven mutually exclusive. This is normally the preservation-first choice for shared pulses and lifecycle hooks.",
      );
      addChoice(
        "Use one package's hook as the authority",
        "name the authoritative package and explicitly list which callbacks from every other package should be ported or dropped.",
      );
      addChoice(
        "Curate hooks individually",
        "answer each system question separately and select the callbacks, ordering, limits, and country scopes Concordia should keep.",
      );
    } else if (onlyOverlap) {
      preservationChoice = addChoice(
        "Permit coexistence after an interaction audit",
        "retain both systems, test the shared countries and event chains, and resolve only concrete trigger, ordering, balance, or lifecycle conflicts found during review. The static evidence does not yet justify discarding either system.",
      );
      for (const packageLabel of packageLabels) {
        addChoice(
          `Make ${packageLabel} authoritative`,
          "use this package's lifecycle and behavior for the shared countries, then name specific mechanics from the other package(s) that must be ported.",
        );
      }
    } else if (onlyLocalization) {
      for (const packageLabel of packageLabels) {
        addChoice(
          `Prefer ${packageLabel}'s shared text`,
          "use its values whenever localization keys differ while retaining all non-conflicting keys from every package.",
        );
      }
      preservationChoice = addChoice(
        "Curate by language or key family",
        "answer the language/content questions separately, selecting a source for each set and writing Concordia values only where neither source is satisfactory.",
      );
    } else {
      for (const packageLabel of packageLabels) {
        addChoice(
          `Use ${packageLabel} as the base`,
          "keep its implementation for the shared parts of this domain, then explicitly name mechanics, data, triggers, effects, or presentation from the other package(s) that must be ported.",
        );
      }
      if (hasDirectConflict) {
        preservationChoice = addChoice(
          "Synthesize a Concordia merge",
          "review the system questions independently, preserve compatible unique content from every package, and write Concordia-owned replacements for the genuinely competing definitions, files, values, or state contracts.",
        );
      }
    }
    addChoice(
      "Reduce scope",
      "disable one package's affected subsystem, or exclude a package if its design cannot be reconciled with the intended Concordia behavior.",
    );
    decisionLines.push(
      `<a id="decision-${index + 1}"></a>`,
      `## Decision ${index + 1} — ${decision.domain}`,
      "",
      `**Packages:** ${packageLabels.join(" / ")}`,
      "",
      "### What conflicts",
      "",
      ...directConflictDescription(typeCounts, symbols.size),
      "",
      ...(semanticSummaries.sources.size === 0 &&
      definitionBehavior.lines.length === 0
        ? [
            "**Package contributions inferred from the colliding source files:**",
            "",
            ...packageRoles.map(
              ({ label, roles }) =>
                `- **${label}:** ${roles
                  .slice(0, 10)
                  .join(
                    ", ",
                  )}${roles.length > 10 ? `, and ${roles.length - 10} more` : ""}.`,
            ),
            "",
          ]
        : []),
      ...(definitionBehavior.lines.length > 0
        ? [
            "**Behavioral variants:**",
            "",
            ...definitionBehavior.lines,
            "",
            ...(definitionNotes.size > 0
              ? [
                  "**Source-declared behavior and warnings:**",
                  "",
                  ...decision.packages.flatMap((packageId) => {
                    const packageNotes = [
                      ...new Set(
                        allSources
                          .filter((source) => source.packageId === packageId)
                          .flatMap(
                            (source) =>
                              definitionNotes.get(findingSourceKey(source)) ??
                              [],
                          ),
                      ),
                    ];
                    return packageNotes.length > 0
                      ? [
                          `- **${packageNames.get(packageId) ?? packageId}:** ${packageNotes.join(" ")}`,
                        ]
                      : [];
                  }),
                  "",
                ]
              : []),
            `**Downstream implications:** ${definitionBehavior.consequence}`,
            "",
          ]
        : []),
      ...(semanticSummaries.sources.size > 0
        ? [
            `**What this content controls:** ${customizableLocalizationPurpose(allSources)}`,
            "",
            `**Decision summary:** ${semanticSummaries.assessments.join(" ")}`,
            "",
            "**What each mod adds:**",
            "",
            ...decision.packages.flatMap((packageId) => {
              const summaries = [
                ...new Set(
                  allSources
                    .filter((source) => source.packageId === packageId)
                    .map((source) =>
                      semanticSummaries.sources.get(findingSourceKey(source)),
                    )
                    .filter(
                      (value): value is SemanticSourceSummary =>
                        value !== undefined,
                    )
                    .map((value) => value.concise),
                ),
              ];
              return summaries.length > 0
                ? [
                    `- **${packageNames.get(packageId) ?? packageId}:** ${summaries.join(" ")}`,
                  ]
                : [];
            }),
            "",
            ...(semanticSummaries.sharedDifferences.length > 0
              ? [
                  "**Shared trigger differences and implications:**",
                  "",
                  ...semanticSummaries.sharedDifferences,
                  "",
                ]
              : []),
            `**Recommended approach: option ${preservationChoice ?? "merge"}.** Retain the common rules once, preserve every package-specific addition, and reconcile only the changed shared triggers.`,
            "",
          ]
        : []),
      ...(semanticSummaries.sources.size === 0
        ? [
            `**Evidence:** ${decision.findings.length} deep finding(s): ${[...typeCounts].map(([type, count]) => `${count} ${type}`).join(", ")}.`,
            "",
            "### System questions",
            "",
            ...sortedTopics.slice(0, 16).map(([topic, findings]) => {
              const topicTypes = new Set(
                findings.map((finding) => finding.type),
              );
              const topicSymbols = [
                ...new Set(findings.flatMap((finding) => finding.symbols)),
              ];
              const ids = findings
                .map((finding) => deepNumbers.get(finding.fingerprint))
                .filter((value): value is number => value !== undefined);
              const instruction =
                topicTypes.size === 1 && topicTypes.has("system-overlap")
                  ? "Decide whether these systems can coexist for the shared countries, or which package should govern their overlapping lifecycle and behavior."
                  : topicTypes.size === 1 && topicTypes.has("localization")
                    ? "Choose the displayed-name source globally for this language/content set, or identify keys that need curated Concordia values."
                    : topic === "event triggers and on-actions"
                      ? "Decide which callbacks from each package must run, their ordering, and whether any are mutually exclusive; shared on-actions normally require an additive Concordia registration rather than a whole-package winner."
                      : "Choose the owning package or require a semantic merge; identify mechanics, triggers, effects, or data from the non-base implementation that must survive.";
              return `- **${topic}** — ${findings.length} finding(s), deep ${ids
                .slice(0, 8)
                .map((id) => `[#${id}](deep-frontier.md#finding-${id})`)
                .join(
                  ", ",
                )}${ids.length > 8 ? ` and ${ids.length - 8} more` : ""}. ${instruction}${
                topicSymbols.length > 0
                  ? ` Representative items: ${topicSymbols
                      .slice(0, 6)
                      .map((symbol) => `\`${symbol}\``)
                      .join(", ")}${topicSymbols.length > 6 ? ", …" : ""}.`
                  : ""
              }`;
            }),
            ...(sortedTopics.length > 16
              ? [
                  `- **Additional topics** — ${sortedTopics.length - 16} more topic group(s) remain linked through the complete deep-finding list above.`,
                ]
              : []),
            "",
          ]
        : []),
      "### Choices",
      "",
      ...choices,
      "",
      ...(preservationChoice && semanticSummaries.sources.size === 0
        ? [
            `**Preservation-first starting point:** option **${preservationChoice}**. This is not automatic; it is the least destructive policy implied by the static evidence.`,
            "",
          ]
        : []),
      "<details>",
      "<summary>Deep evidence and source links</summary>",
      "",
      "### Review aids",
      "",
      `**Evidence:** ${decision.findings.length} deep finding(s): ${[...typeCounts].map(([type, count]) => `${count} ${type}`).join(", ")}.`,
      "",
      `**All deep findings:** ${deepIds
        .slice(0, 30)
        .map((id) => `[#${id}](deep-frontier.md#finding-${id})`)
        .join(
          ", ",
        )}${deepIds.length > 30 ? `, and ${deepIds.length - 30} more` : ""}`,
      "",
      `**Representative symbols:** ${[...symbols]
        .slice(0, 20)
        .map((symbol) => `\`${symbol}\``)
        .join(
          ", ",
        )}${symbols.size > 20 ? `, and ${symbols.size - 20} more` : ""}`,
      "",
      "**Representative sources:**",
      "",
      ...sourceSelection.map(
        (source) => `- ${sourceMarkdown(source, integrationDirectory)}`,
      ),
      "",
      "</details>",
      "",
      `**Answer format:** \`Decision ${index + 1}, option <letter>\` plus exceptions or answers to individual system questions. No underlying finding is resolved until the chosen behavior is implemented and verified.`,
      "",
    );
  }
  const decisionMarkdown = await format(`${decisionLines.join("\n")}\n`, {
    parser: "markdown",
  });
  await writeFile(
    path.join(integrationDirectory, "decision-frontier.md"),
    decisionMarkdown,
    "utf8",
  );
  await rm(path.join(integrationDirectory, "frontier.md"), { force: true });
}
