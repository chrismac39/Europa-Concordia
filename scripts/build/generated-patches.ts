export type GeneratedPatchStrategy =
  | "gh-exchequer-glorp-ui-left-panel"
  | "glorp-ui-construction-manager-production"
  | "glorp-ui-construction-manager-location-window"
  | "glorp-ui-without-autonomous-diplomats"
  | "glorp-ui-without-construction-manager-building-location"
  | "glorp-ui-without-construction-manager-food-production"
  | "glorp-ui-without-construction-manager-raw-goods"
  | "glorp-ui-without-construction-manager-pause-menu"
  | "glorp-ui-without-construction-manager-production"
  | "glorp-ui-without-construction-manager-warning-suppression"
  | "glorp-ui-without-construction-manager-scripted-gui"
  | "standard-of-living-without-construction-manager-location-window";

function occurrenceCount(contents: string, value: string): number {
  return contents.split(value).length - 1;
}

function replaceExpected(
  contents: string,
  search: string,
  replacement: string,
  expectedOccurrences: number,
  label: string,
): string {
  const actualOccurrences = occurrenceCount(contents, search);
  if (actualOccurrences !== expectedOccurrences) {
    throw new Error(
      `${label} expected ${expectedOccurrences} occurrence(s), found ${actualOccurrences}`,
    );
  }
  return contents.split(search).join(replacement);
}

function findGuiBlockEnd(
  contents: string,
  openingBraceIndex: number,
  label: string,
): number {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = openingBraceIndex; index < contents.length; index += 1) {
    const character = contents[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }
    if (character === "#") {
      const lineEnd = contents.indexOf("\n", index);
      if (lineEnd < 0) {
        break;
      }
      index = lineEnd;
      continue;
    }
    if (character === '"') {
      inString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return index + 1;
      }
    }
  }
  throw new Error(`${label} has an unterminated GUI block`);
}

function removeGuiBlocksByName(
  contents: string,
  name: string,
  expectedOccurrences: number,
  label: string,
): string {
  const blockPattern = new RegExp(`^[\\t ]*${name}[\\t ]*=[\\t ]*\\{`, "gm");
  const matches = Array.from(contents.matchAll(blockPattern));
  if (matches.length !== expectedOccurrences) {
    throw new Error(
      `${label} expected ${expectedOccurrences} occurrence(s), found ${matches.length}`,
    );
  }
  let result = contents;
  for (const match of matches.reverse()) {
    const start = match.index;
    if (start === undefined) {
      throw new Error(`${label} is missing a source location`);
    }
    const end = findGuiBlockEnd(
      result,
      start + match[0].lastIndexOf("{"),
      label,
    );
    const lineEnd = result.indexOf("\n", end);
    result =
      result.slice(0, start) + result.slice(lineEnd < 0 ? end : lineEnd + 1);
  }
  return result;
}

function removeGuiBlocksContaining(
  contents: string,
  parentName: string,
  anchor: string,
  expectedOccurrences: number,
  label: string,
): string {
  const anchorPositions: number[] = [];
  let nextPosition = 0;
  while (true) {
    const position = contents.indexOf(anchor, nextPosition);
    if (position < 0) {
      break;
    }
    anchorPositions.push(position);
    nextPosition = position + anchor.length;
  }
  if (anchorPositions.length !== expectedOccurrences) {
    throw new Error(
      `${label} expected ${expectedOccurrences} occurrence(s), found ${anchorPositions.length}`,
    );
  }

  const blockPattern = new RegExp(
    `^[\\t ]*${parentName}[\\t ]*=[\\t ]*\\{`,
    "gm",
  );
  let result = contents;
  for (const anchorPosition of anchorPositions.reverse()) {
    const parentMatches = Array.from(
      result.slice(0, anchorPosition).matchAll(blockPattern),
    );
    const parent = parentMatches.at(-1);
    if (parent?.index === undefined) {
      throw new Error(`${label} has no containing ${parentName} block`);
    }
    const start = parent.index;
    const end = findGuiBlockEnd(
      result,
      start + parent[0].lastIndexOf("{"),
      label,
    );
    if (anchorPosition >= end) {
      throw new Error(`${label} is outside its ${parentName} block`);
    }
    const lineEnd = result.indexOf("\n", end);
    const removeEnd = lineEnd < 0 ? end : lineEnd + 1;
    const precedingLineStart = result.lastIndexOf("\n", start - 2) + 1;
    const precedingLine = result.slice(precedingLineStart, start).trim();
    const removeStart = precedingLine.startsWith("# GlorpUI: CMM menu button")
      ? precedingLineStart
      : start;
    result = result.slice(0, removeStart) + result.slice(removeEnd);
  }
  return result;
}

function removeExpectedPattern(
  contents: string,
  pattern: RegExp,
  expectedOccurrences: number,
  label: string,
): string {
  const matches = Array.from(contents.matchAll(pattern));
  if (matches.length !== expectedOccurrences) {
    throw new Error(
      `${label} expected ${expectedOccurrences} occurrence(s), found ${matches.length}`,
    );
  }
  return contents.replace(pattern, "");
}

function addRootVisibility(
  block: string,
  condition: string,
  indentation: string,
  label: string,
): string {
  const newlineIndex = block.indexOf("\n");
  if (newlineIndex < 0) {
    throw new Error(`${label} is missing its opening line`);
  }
  return (
    block.slice(0, newlineIndex + 1) +
    `${indentation}\tvisible = "[${condition}]"\n` +
    block.slice(newlineIndex + 1)
  );
}

function updateEconomyTab(
  sourceBlock: string,
  indentation: string,
  variant: "closed" | "open" | "trade-open",
): string {
  const settings = {
    closed: {
      label: "Economy tab (closed)",
      visibility: "Not(IsLateralGroupOpened('economy_group'))",
      widgetVisible: "yes",
      down: "no",
      action: "[OpenLateralView('economy')]",
      iconVisible: "no",
    },
    open: {
      label: "Economy tab (open)",
      visibility:
        "And(IsLateralGroupOpened('economy_group'), Not(Or(IsLateralViewOpened('trade'), IsLateralViewOpened('trade_policies'))))",
      widgetVisible: "no",
      down: "yes",
      action: "[ToggleLateralGroup('economy_group')]",
      iconVisible: "yes",
    },
    "trade-open": {
      label: "Economy tab (Trade view open)",
      visibility:
        "Or(IsLateralViewOpened('trade'), IsLateralViewOpened('trade_policies'))",
      widgetVisible: "yes",
      down: "no",
      action: "[OpenLateralView('economy')]",
      iconVisible: "no",
    },
  }[variant];

  let block = replaceExpected(
    sourceBlock,
    "button_panel_tab_alt = { ### economy tab",
    `button_panel_tab_alt = { ### Concordia: ${settings.label}`,
    1,
    "Glorp UI economy-tab marker",
  );
  block = replaceExpected(
    block,
    `visible = "[Not(IsLateralGroupOpened('economy_group'))]"`,
    `visible = ${settings.widgetVisible}`,
    1,
    "Glorp UI economy-tab widget visibility",
  );
  block = replaceExpected(
    block,
    `down = "[IsLateralGroupOpened('economy_group')]"`,
    `down = ${settings.down}`,
    1,
    "Glorp UI economy-tab state",
  );
  block = replaceExpected(
    block,
    `on_action = "[ToggleLateralGroup('economy_group')]"`,
    `on_action = "${settings.action}"`,
    1,
    "Glorp UI economy-tab action",
  );
  block = replaceExpected(
    block,
    `blockoverride "icon_effect_visible" { visible = "[IsLateralGroupOpened('economy_group')]" }`,
    `blockoverride "icon_effect_visible" { visible = ${settings.iconVisible} }`,
    2,
    "Glorp UI economy-tab icon state",
  );
  return addRootVisibility(
    block,
    settings.visibility,
    indentation,
    "Glorp UI economy-tab variant",
  );
}

function createTradeTab(
  sourceBlock: string,
  indentation: string,
  variant: "closed" | "open",
): string {
  const isOpen = variant === "open";
  const viewCondition =
    "Or(IsLateralViewOpened('trade'), IsLateralViewOpened('trade_policies'))";
  let block = replaceExpected(
    sourceBlock,
    "button_panel_tab_alt = { ### economy tab",
    `button_panel_tab_alt = { ### Concordia: GH Trade tab (${variant})`,
    1,
    "Glorp UI trade-tab marker",
  );
  block = replaceExpected(
    block,
    `visible = "[Not(IsLateralGroupOpened('economy_group'))]"`,
    `visible = ${isOpen ? "no" : "yes"}`,
    1,
    "Glorp UI trade-tab widget visibility",
  );
  block = replaceExpected(
    block,
    "name = economy_tab_button",
    "name = concordia_gh_trade_tab_button",
    1,
    "Glorp UI trade-tab name",
  );
  block = replaceExpected(
    block,
    "using = TabEconomyTooltip",
    "using = GHTabTradeTooltip",
    1,
    "Glorp UI trade-tab tooltip",
  );
  block = replaceExpected(
    block,
    'title = "TAB_TOOLTIP_ECONOMY_LEFT_CLICK"',
    'title = "GH_TD_TAB_LEFT_CLICK"',
    1,
    "Glorp UI trade-tab title",
  );
  block = replaceExpected(
    block,
    `on_action = "[ToggleLateralGroup('economy_group')]"`,
    isOpen
      ? `on_action = "[ToggleLateralGroup('economy_group')]"`
      : `on_action = "[OpenLateralViewWithParams('trade', 'subtab = markets')]"`,
    1,
    "Glorp UI trade-tab action",
  );
  block = replaceExpected(
    block,
    'input_action = "top_left_2"',
    'input_action = "top_left_3"',
    1,
    "Glorp UI trade-tab shortcut",
  );
  block = replaceExpected(
    block,
    `down = "[IsLateralGroupOpened('economy_group')]"`,
    `down = ${isOpen ? "yes" : "no"}`,
    1,
    "Glorp UI trade-tab state",
  );
  block = replaceExpected(
    block,
    `blockoverride "icon_effect_visible" { visible = "[IsLateralGroupOpened('economy_group')]" }`,
    `blockoverride "icon_effect_visible" { visible = ${isOpen ? "yes" : "no"} }`,
    2,
    "Glorp UI trade-tab icon state",
  );
  block = replaceExpected(
    block,
    '"gfx/interface/icons/flat_icons/tabicons/economy.dds"',
    '"gfx/interface/flat_icons/tabicons/gh_trade.dds"',
    1,
    "Glorp UI default trade-tab icon",
  );
  block = replaceExpected(
    block,
    '"gfx/interface/icons/flat_icons/tabicons/economy_c.dds"',
    '"gfx/interface/flat_icons/tabicons/gh_trade.dds"',
    1,
    "Glorp UI colored trade-tab icon",
  );
  block = replaceExpected(
    block,
    "color = { 0.80 0.65 0.10 1.0 }",
    "color = { 0.20 0.65 0.75 1.0 }",
    1,
    "Glorp UI default trade-tab color",
  );
  block = replaceExpected(
    block,
    "color = { 0.85 0.40 0.10 1.0 }",
    "color = { 0.20 0.65 0.75 1.0 }",
    1,
    "Glorp UI colored trade-tab color",
  );
  return addRootVisibility(
    block,
    isOpen ? viewCondition : `Not(${viewCondition})`,
    indentation,
    "Glorp UI trade-tab variant",
  );
}

function shiftFollowingTabShortcuts(contents: string): string {
  const actionPattern = /input_action = "top_left_(\d+)"/g;
  const actions = [...contents.matchAll(actionPattern)].map((match) =>
    Number(match[1]),
  );
  const expected = [3, 4, 5, 6, 7, 8, 9];
  if (
    actions.length !== expected.length ||
    actions.some((action, index) => action !== expected[index])
  ) {
    throw new Error(
      `Glorp UI downstream tab shortcuts changed; expected ${expected.join(", ")}, found ${actions.join(", ")}`,
    );
  }
  return contents.replace(actionPattern, (_match, actionText: string) => {
    const action = Number(actionText);
    return `input_action = "top_left_${action + 1}"`;
  });
}

function generateGlorpGhExchequerLeftPanel(source: string): string {
  const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
  const contents = source.replace(/\r\n/g, "\n");
  const economyMarker = "button_panel_tab_alt = { ### economy tab";
  const productionMarker = "button_panel_tab_alt = {### production tab";
  if (
    occurrenceCount(contents, economyMarker) !== 1 ||
    occurrenceCount(contents, productionMarker) !== 1
  ) {
    throw new Error(
      "Glorp UI economy/production tab anchors changed; re-review this generated patch",
    );
  }

  const economyStart = contents.indexOf(economyMarker);
  const productionStart = contents.indexOf(productionMarker);
  if (productionStart <= economyStart) {
    throw new Error(
      "Glorp UI production tab no longer follows the economy tab",
    );
  }
  const indentationStart = contents.lastIndexOf("\n", economyStart) + 1;
  const productionLineStart = contents.lastIndexOf("\n", productionStart) + 1;
  const indentation = contents.slice(indentationStart, economyStart);
  const sourceBlock = contents
    .slice(economyStart, productionLineStart)
    .trimEnd();
  const generatedTabs = [
    updateEconomyTab(sourceBlock, indentation, "closed"),
    updateEconomyTab(sourceBlock, indentation, "open"),
    updateEconomyTab(sourceBlock, indentation, "trade-open"),
    createTradeTab(sourceBlock, indentation, "closed"),
    createTradeTab(sourceBlock, indentation, "open"),
  ];
  const followingTabs = shiftFollowingTabShortcuts(
    contents.slice(productionLineStart),
  );
  const generated =
    contents.slice(0, economyStart) +
    generatedTabs.join(`\n\n${indentation}`) +
    "\n\n" +
    followingTabs;
  return lineEnding === "\n" ? generated : generated.replace(/\n/g, lineEnding);
}

function generateGlorpConstructionManagerProduction(source: string): string {
  const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
  let contents = source.replace(/\r\n/g, "\n");
  const vanillaExpandAnchor =
    'visible = "[And(ObjectsEqual(Building.GetOwner, Player.Self), BuildingType.IsMultipleLevels)]"';
  if (occurrenceCount(contents, vanillaExpandAnchor) !== 1) {
    throw new Error(
      "Glorp UI existing-building auto-expand anchor changed; re-review this generated patch",
    );
  }
  const anchorIndex = contents.indexOf(vanillaExpandAnchor);
  const buttonStart = contents.lastIndexOf(
    "button_square_checkbox = {",
    anchorIndex,
  );
  if (
    buttonStart < 0 ||
    contents.slice(buttonStart, anchorIndex).trim() !==
      "button_square_checkbox = {"
  ) {
    throw new Error(
      "Glorp UI existing-building auto-expand control structure changed; re-review this generated patch",
    );
  }
  const lineStart = contents.lastIndexOf("\n", buttonStart) + 1;
  const indentation = contents.slice(lineStart, buttonStart);
  const concordiaButton = [
    `${indentation}# Concordia: restore Construction Manager 1.4 auto-expand for existing buildings`,
    `${indentation}cm_auto_expand_existing_building_button = {`,
    `${indentation}\tvisible = "[And3(ObjectsEqual(Building.GetOwner, Player.Self), Building.GetType.IsMultipleLevels, Not(GetScriptedGui('cm_is_building_obsolete').IsShown(GuiScope.SetRoot(Building.MakeScope).End)))]"`,
    `${indentation}\tsize = { 20 16 }`,
    `${indentation}\tblockoverride "checked_icon_size" { size = { 14 14 } }`,
    `${indentation}\tblockoverride "unchecked_icon_size" { size = { 14 14 } }`,
    `${indentation}}`,
    "",
  ].join("\n");
  contents =
    contents.slice(0, lineStart) + concordiaButton + contents.slice(lineStart);
  contents = replaceExpected(
    contents,
    vanillaExpandAnchor,
    `visible = "[And3(Not(GetScriptedGui('glorpui_is_cm_active').IsShown(GuiScope.SetRoot(GetPlayer.MakeScope).End)), ObjectsEqual(Building.GetOwner, Player.Self), BuildingType.IsMultipleLevels)]"`,
    1,
    "Glorp UI vanilla auto-expand visibility",
  );
  contents = replaceExpected(
    contents,
    "position = { -133 0 }",
    "position = { -271 0 }",
    1,
    "Glorp UI Construction Manager 1.4 new-building button position",
  );
  return lineEnding === "\n" ? contents : contents.replace(/\n/g, lineEnding);
}

function generateGlorpConstructionManagerLocationWindow(
  source: string,
): string {
  const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
  const contents = source.replace(/\r\n/g, "\n");
  const rgoHeaderMarker = 'name = "location_rgo"';
  const locationContext = 'datacontext = "[LocationView.GetLocation]"';
  if (occurrenceCount(contents, rgoHeaderMarker) !== 1) {
    throw new Error(
      "Glorp UI location RGO header changed; re-review this generated patch",
    );
  }
  if (
    occurrenceCount(contents, "cm_auto_food_widget_location_window = {}") !==
      0 ||
    occurrenceCount(
      contents,
      "cm_auto_expand_rgo_widget_location_window = {}",
    ) !== 0
  ) {
    throw new Error(
      "Construction Manager RGO controls are already present; re-review this generated patch",
    );
  }
  const headerIndex = contents.indexOf(rgoHeaderMarker);
  const contextIndex = contents.indexOf(locationContext, headerIndex);
  const tooltipIndex = contents.indexOf("tooltipwidget = {", headerIndex);
  if (contextIndex < 0 || tooltipIndex < 0 || tooltipIndex < contextIndex) {
    throw new Error(
      "Glorp UI location RGO context changed; re-review this generated patch",
    );
  }
  const contextLineEnd = contents.indexOf("\n", contextIndex);
  if (contextLineEnd < 0) {
    throw new Error("Glorp UI location RGO context has no line ending");
  }
  const lineStart = contents.lastIndexOf("\n", contextIndex) + 1;
  const indentation = contents.slice(lineStart, contextIndex);
  const controls = [
    `${indentation}# Concordia: retain Construction Manager RGO automation controls`,
    `${indentation}cm_auto_food_widget_location_window = {}`,
    `${indentation}cm_auto_expand_rgo_widget_location_window = {}`,
  ].join("\n");
  const generated =
    contents.slice(0, contextLineEnd + 1) +
    `${controls}\n` +
    contents.slice(contextLineEnd + 1);
  return lineEnding === "\n" ? generated : generated.replace(/\n/g, lineEnding);
}

function generateGlorpWithoutAutonomousDiplomats(source: string): string {
  const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
  const widgetBlock = [
    "\t\t# GlorpUI: Autonomous Diplomats auto-cancel widget",
    "\t\tatd_outliner_auto_cancel_widget = {}",
    "\t\t# GlorpUI: Autonomous Diplomats sync widget",
    "\t\tatd_outliner_sync_widget = {}",
  ].join("\n");
  const contents = replaceExpected(
    source.replace(/\r\n/g, "\n"),
    widgetBlock,
    "",
    1,
    "Glorp UI Autonomous Diplomats outliner widgets",
  );
  return lineEnding === "\n" ? contents : contents.replace(/\n/g, lineEnding);
}

function withSourceLineEndings(
  source: string,
  transform: (contents: string) => string,
): string {
  const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
  const contents = transform(source.replace(/\r\n/g, "\n"));
  return lineEnding === "\n" ? contents : contents.replace(/\n/g, lineEnding);
}

function generateGlorpWithoutConstructionManagerBuildingLocation(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) => {
    let patched = removeGuiBlocksByName(
      contents,
      "cm_auto_expand_building_button_bll",
      1,
      "Glorp UI building-location auto-expand widget",
    );
    patched = removeGuiBlocksByName(
      patched,
      "cm_mass_auto_expand_button_bll",
      4,
      "Glorp UI building-location mass auto-expand widgets",
    );
    patched = removeGuiBlocksByName(
      patched,
      "cm_mass_auto_expand_overlay_no_upgrade",
      1,
      "Glorp UI no-upgrade auto-expand overlay",
    );
    patched = removeGuiBlocksByName(
      patched,
      "cm_mass_auto_expand_overlay_upgrade",
      1,
      "Glorp UI upgrade auto-expand overlay",
    );
    return replaceExpected(
      patched,
      `visible = "[Not(GetScriptedGui('glorpui_is_cm_active').IsShown(GuiScope.SetRoot(GetPlayer.MakeScope).End))]"`,
      "",
      1,
      "Glorp UI building-location visibility",
    );
  });
}

function generateGlorpWithoutConstructionManagerFoodProduction(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) =>
    removeGuiBlocksByName(
      contents,
      "cm_auto_food_widget_food_production_lateralview",
      1,
      "Glorp UI food-production auto-food widget",
    ),
  );
}

function generateGlorpWithoutConstructionManagerRawGoods(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) => {
    let patched = removeGuiBlocksByName(
      contents,
      "cm_mass_auto_expand_rgo_button",
      1,
      "Glorp UI RGO mass auto-expand button",
    );
    patched = removeGuiBlocksByName(
      patched,
      "cm_auto_expand_rgo_widget_expand_raw_goods_lateralview",
      1,
      "Glorp UI RGO auto-expand widget",
    );
    return replaceExpected(
      patched,
      `visible = "[Not(GetScriptedGui('glorpui_is_cm_active').IsShown(GuiScope.SetRoot(GetPlayer.MakeScope).End))]"`,
      "",
      1,
      "Glorp UI RGO auto-expand visibility",
    );
  });
}

function generateGlorpWithoutConstructionManagerPauseMenu(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) =>
    removeGuiBlocksContaining(
      contents,
      "button_wax",
      'text = "CMM_PAUSE_MENU_BUTTON"',
      2,
      "Glorp UI Construction Manager pause-menu buttons",
    ),
  );
}

function generateGlorpWithoutConstructionManagerProduction(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) => {
    let patched = removeGuiBlocksByName(
      contents,
      "cm_mass_auto_expand_button_pl",
      1,
      "Glorp UI production mass auto-expand button",
    );
    patched = removeGuiBlocksByName(
      patched,
      "cm_auto_expand_new_building_button_pl",
      1,
      "Glorp UI unbuilt-building auto-expand button",
    );
    return replaceExpected(
      patched,
      `visible = "[And4(BuildingItem.HasBuildings, BuildingItem.GetBuildingType.IsMultipleLevels, Not(GetScriptedGui('glorpui_is_cm_active').IsShown(GuiScope.SetRoot(GetPlayer.MakeScope).End)), Not(BuildingItem.GetBuildingType.OnlyEstatesCanBuild))]"`,
      `visible = "[And3(BuildingItem.HasBuildings, BuildingItem.GetBuildingType.IsMultipleLevels, Not(BuildingItem.GetBuildingType.OnlyEstatesCanBuild))]"`,
      1,
      "Glorp UI production auto-expand visibility",
    );
  });
}

function generateGlorpWithoutConstructionManagerWarningSuppression(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) =>
    replaceExpected(
      contents,
      "add_to_global_variable_list = { name = cmf_active_mod_ids target = flag:cm }",
      "",
      1,
      "Glorp UI Construction Manager warning suppression",
    ),
  );
}

function generateGlorpWithoutConstructionManagerScriptedGui(
  source: string,
): string {
  const contents = source.replace(/\r\n/g, "\n");
  if (
    occurrenceCount(contents, "glorpui_is_cm_active = {") !== 1 ||
    occurrenceCount(contents, "target = flag:cm") !== 1
  ) {
    throw new Error(
      "Glorp UI Construction Manager detection changed; re-review this generated patch",
    );
  }
  return "# Concordia: Construction Manager integration is excluded.\n";
}

function generateStandardOfLivingWithoutConstructionManagerLocationWindow(
  source: string,
): string {
  return withSourceLineEndings(source, (contents) => {
    let patched = replaceExpected(
      contents,
      `onmousehierarchyenter = "[PdxGuiWidget.PushMapModeOverride('cm_best_town_right')]"`,
      "",
      3,
      "SoL town-rights map-mode hover",
    );
    patched = replaceExpected(
      patched,
      `on_action = "[GetMapMode('cm_best_town_right').SetMapMode]" # GlorpUI: Construction Manager best urban rights mapmode on grant`,
      "",
      1,
      "SoL town-rights map-mode action",
    );
    patched = replaceExpected(
      patched,
      `visible = "[And(IsAutoExpand(LocationBuildingItem.GetBuilding.Self), Not(GetScriptedGui('glorpui_is_cm_active').IsShown(GuiScope.SetRoot(GetPlayer.MakeScope).End)))]"`,
      `visible = "[IsAutoExpand(LocationBuildingItem.GetBuilding.Self)]"`,
      1,
      "SoL auto-expand visibility",
    );
    patched = removeGuiBlocksByName(
      patched,
      "cm_is_auto_expand_on_icon",
      1,
      "SoL Construction Manager auto-expand status icon",
    );
    return removeExpectedPattern(
      patched,
      /^[ \t]*on_action = "\[GetScriptedGui\('cm_check_for_auto_expand_when_upgrading_building'\)[^\n]*\n/gm,
      3,
      "SoL Construction Manager auto-expand upgrade actions",
    );
  });
}

export function generatePatchContents(
  strategy: GeneratedPatchStrategy,
  source: string,
): string {
  if (strategy === "gh-exchequer-glorp-ui-left-panel") {
    return generateGlorpGhExchequerLeftPanel(source);
  }
  if (strategy === "glorp-ui-construction-manager-production") {
    return generateGlorpConstructionManagerProduction(source);
  }
  if (strategy === "glorp-ui-construction-manager-location-window") {
    return generateGlorpConstructionManagerLocationWindow(source);
  }
  if (strategy === "glorp-ui-without-autonomous-diplomats") {
    return generateGlorpWithoutAutonomousDiplomats(source);
  }
  if (strategy === "glorp-ui-without-construction-manager-building-location") {
    return generateGlorpWithoutConstructionManagerBuildingLocation(source);
  }
  if (strategy === "glorp-ui-without-construction-manager-food-production") {
    return generateGlorpWithoutConstructionManagerFoodProduction(source);
  }
  if (strategy === "glorp-ui-without-construction-manager-raw-goods") {
    return generateGlorpWithoutConstructionManagerRawGoods(source);
  }
  if (strategy === "glorp-ui-without-construction-manager-pause-menu") {
    return generateGlorpWithoutConstructionManagerPauseMenu(source);
  }
  if (strategy === "glorp-ui-without-construction-manager-production") {
    return generateGlorpWithoutConstructionManagerProduction(source);
  }
  if (
    strategy === "glorp-ui-without-construction-manager-warning-suppression"
  ) {
    return generateGlorpWithoutConstructionManagerWarningSuppression(source);
  }
  if (strategy === "glorp-ui-without-construction-manager-scripted-gui") {
    return generateGlorpWithoutConstructionManagerScriptedGui(source);
  }
  if (
    strategy ===
    "standard-of-living-without-construction-manager-location-window"
  ) {
    return generateStandardOfLivingWithoutConstructionManagerLocationWindow(
      source,
    );
  }
  throw new Error(`Unknown generated patch strategy: ${strategy}`);
}
