export type GeneratedPatchStrategy =
  | "gh-exchequer-glorp-ui-left-panel"
  | "glorp-ui-construction-manager-production"
  | "glorp-ui-construction-manager-location-window";

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
  throw new Error(`Unknown generated patch strategy: ${strategy}`);
}
