import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { format } from "prettier";
import type {
  ConflictAnalysis,
  ConflictFinding,
  FindingSource,
} from "./model.js";

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
  if (finding.type === "system-overlap") {
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
  const resolved = analysis.findings.filter((finding) => finding.resolved);
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
    "[`reports/conflicts.json`](../reports/conflicts.json). The Markdown frontier limits very large system-overlap items to representative source files.",
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
    const status = finding.resolved ? "RESOLVED" : "DECISION REQUIRED";
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
    "Country-footprint overlap is deliberately labeled as a warning rather than a proven conflict. Exact paths and duplicate definitions cannot safely coexist without a winner or merge; localization and broad system overlap often can, after deliberate review.",
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
  decisions.forEach((decision, index) => {
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
      `**Evidence:** ${decision.findings.length} deep finding(s): ${[...typeCounts].map(([type, count]) => `${count} ${type}`).join(", ")}.`,
      "",
      `**All deep findings:** ${deepIds
        .slice(0, 30)
        .map((id) => `[#${id}](deep-frontier.md#finding-${id})`)
        .join(
          ", ",
        )}${deepIds.length > 30 ? `, and ${deepIds.length - 30} more` : ""}`,
      "",
      "",
      "### System questions",
      "",
      ...sortedTopics.slice(0, 16).map(([topic, findings]) => {
        const topicTypes = new Set(findings.map((finding) => finding.type));
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
      "### Choices",
      "",
      ...choices,
      "",
      ...(preservationChoice
        ? [
            `**Preservation-first starting point:** option **${preservationChoice}**. This is not an automatic decision; it is the least destructive initial policy implied by the static evidence and still requires the system questions and deep evidence to be reviewed.`,
            "",
          ]
        : []),
      "<details>",
      "<summary>Deep evidence and source links</summary>",
      "",
      "### Review aids",
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
  });
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
