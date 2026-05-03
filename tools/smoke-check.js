const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "msedge", headless: true });
  } catch {}
  try {
    return await chromium.launch({
      executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      headless: true,
    });
  } catch {}
  return chromium.launch({ headless: true });
}

async function main() {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];

  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  const defaultTarget = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;
  const target = process.env.WORLDLINE_URL || defaultTarget;
  await page.goto(target, { waitUntil: "load", timeout: 30_000 });
  await page.waitForSelector("#worldCanvas", { timeout: 20_000 });
  await page.waitForTimeout(800);

  const initial = await page.evaluate(() => ({
    title: document.title,
    step: document.querySelector("#timeStepSelect")?.value,
    scenario: document.querySelector("#scenarioSelect")?.value,
    mapModes: [...document.querySelector("#mapModeSelect").options].map((option) => option.value),
    scenarios: [...document.querySelector("#scenarioSelect").options].map((option) => option.value),
    date: document.querySelector("#dateLabel")?.textContent?.trim(),
    universalNames: UNIVERSAL_NAMES.length,
    territoriesWithFiveNames: state.territories.filter((territory) => territory.alternateNames?.length >= 5).length,
    territoryCount: state.territories.length,
  }));

  // Pause for deterministic stepping.
  await page.click("#playPauseBtn");
  const forcedWar = await page.evaluate(() => {
    const frontier = state.territories.find((territory) =>
      territory.neighbors.some((neighborId) => state.territories[neighborId].ownerId !== territory.ownerId),
    );
    if (!frontier) return { started: false, reason: "No frontier found" };
    const neighborId = frontier.neighbors.find((id) => state.territories[id].ownerId !== frontier.ownerId);
    if (neighborId == null) return { started: false, reason: "No rival territory found" };
    const attackerId = frontier.ownerId;
    const defenderId = state.territories[neighborId].ownerId;
    const started = startWar(attackerId, defenderId, "smoke test border crisis");
    let immediateContested = 0;
    let immediateSubdivisionShift = 0;
    if (started) {
      const contested = state.territories.filter(
        (territory) => territory.contestedById === attackerId && territory.contestedProgress > 0.01,
      );
      immediateContested = contested.length;
      if (contested[0]) {
        immediateSubdivisionShift = transferSubdivisionControl(contested[0], attackerId, 1);
      }
    }
    return {
      started,
      attackerId,
      defenderId,
      fromTerritoryId: frontier.id,
      targetTerritoryId: neighborId,
      immediateContested,
      immediateSubdivisionShift,
    };
  });

  for (let i = 0; i < 240; i += 1) {
    await page.click("#stepBtn");
  }

  const after = await page.evaluate(() => ({
    date: document.querySelector("#dateLabel")?.textContent?.trim(),
    warsLogged: document.querySelectorAll(".log-entry.war").length,
    revoltsLogged: document.querySelectorAll(".log-entry.revolt").length,
  }));

  const warEvolution = await page.evaluate(() => {
    const contested = state.territories.filter(
      (territory) => territory.contestedById != null && territory.contestedProgress > 0.01,
    );
    return {
      activeWars: uniqueWars().length,
      contestedCount: contested.length,
      shiftedSubdivisions: contested.filter((territory) =>
        territory.subdivisions?.some((subdivision) => subdivision.ownerId === territory.contestedById),
      ).length,
      sample: contested.slice(0, 5).map((territory) => ({
        id: territory.id,
        originalName: territory.originalName,
        contestedProgress: Number(territory.contestedProgress.toFixed(3)),
        contestedById: territory.contestedById,
        controlRatio: Number(subdivisionControlRatio(territory, territory.contestedById).toFixed(3)),
      })),
    };
  });

  const labelChecks = await page.evaluate(() => {
    renderMap();
    const russia = state.territories.find((territory) => territory.originalName === "Russia");
    const owner = russia ? state.nations.get(russia.ownerId) : null;
    if (!russia || !owner) return { russiaFound: false };
    const anchor = nationLabelAnchor(owner);
    return {
      russiaFound: true,
      anchorInsideRussia: Boolean(anchor && russia.path && ctx.isPointInPath(russia.path, anchor.x, anchor.y, "evenodd")),
      anchor,
    };
  });

  const conquest = await page.evaluate(() => {
    const boundary = state.territories.find((territory) =>
      territory.neighbors.some((neighborId) => state.territories[neighborId].ownerId !== territory.ownerId),
    );
    if (!boundary) return { ok: false, reason: "No frontier found" };

    const targetId = boundary.neighbors.find((neighborId) => state.territories[neighborId].ownerId !== boundary.ownerId);
    if (targetId == null) return { ok: false, reason: "No target found" };

    transferTerritory(targetId, boundary.ownerId, { reason: "captured", quiet: true, event: "Smoke test capture." });
    selectTerritory(targetId);

    const territory = state.territories[targetId];
    const owner = state.nations.get(territory.ownerId);
    const details = document.querySelector("#selectionDetails")?.innerText || "";
    return {
      ok: true,
      targetId,
      territoryName: territory.name,
      ownerName: owner?.name || null,
      originalName: territory.originalName,
      ownerHistory: territory.ownerHistory || [],
      detailsHasHistory: /Historical Owners/i.test(details),
      detailsHasOriginal: /Original/i.test(details),
      detailsSnippet: details.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 18),
    };
  });

  const subdivisions = await page.evaluate(() => {
    let withSubdivisions = 0;
    let admin1Backed = 0;
    let synthetic = 0;
    let min = Infinity;
    let max = 0;
    let sum = 0;
    for (const territory of state.territories) {
      const count = territory.subdivisions?.length || 0;
      if (count > 0) withSubdivisions += 1;
      if (territory.subdivisionSource === "admin1") admin1Backed += 1;
      if (territory.subdivisionSource === "synthetic") synthetic += 1;
      min = Math.min(min, count);
      max = Math.max(max, count);
      sum += count;
    }
    return {
      total: state.territories.length,
      withSubdivisions,
      admin1Backed,
      synthetic,
      min: Number.isFinite(min) ? min : 0,
      max,
      avg: state.territories.length ? Number((sum / state.territories.length).toFixed(2)) : 0,
    };
  });

  await page.selectOption("#mapModeSelect", "alliances");
  await page.waitForTimeout(250);
  const alliancesApplied = await page.$eval("#mapModeSelect", (select) => select.value);
  await page.selectOption("#mapModeSelect", "puppets");
  await page.waitForTimeout(250);
  const puppetsApplied = await page.$eval("#mapModeSelect", (select) => select.value);
  await page.selectOption("#mapModeSelect", "religions");
  await page.waitForTimeout(250);
  const religionsApplied = await page.$eval("#mapModeSelect", (select) => select.value);
  await page.selectOption("#mapModeSelect", "population");
  await page.waitForTimeout(250);
  const populationApplied = await page.$eval("#mapModeSelect", (select) => select.value);

  const uiChecks = await page.evaluate(() => {
    const first = state.territories.find((territory) => territory.ownerId != null);
    if (first) selectTerritory(first.id);
    renderAll();
    const live = liveNations();
    return {
      graphCards: document.querySelectorAll(".graph-card").length,
      graphRows: document.querySelectorAll(".graph-row").length,
      labelsAllowed: Math.ceil(live.length / 3),
      selectedDetails: document.querySelector("#selectionDetails")?.innerText || "",
    };
  });

  await page.screenshot({ path: path.resolve(__dirname, "..", "assets", "worldline-smoke.png"), fullPage: false });
  await browser.close();

  const result = {
    initial,
    forcedWar,
    after,
    warEvolution,
    alliancesApplied,
    puppetsApplied,
    religionsApplied,
    labelChecks,
    conquest,
    subdivisions,
    populationApplied,
    uiChecks,
    errors,
  };

  console.log(JSON.stringify(result, null, 2));

  if (errors.length) process.exit(1);
  if (
    initial.step !== "1" ||
    initial.scenario !== "historic" ||
    !initial.mapModes.includes("alliances") ||
    !initial.mapModes.includes("puppets") ||
    !initial.mapModes.includes("religions")
  ) process.exit(2);
  if (!["rome", "paxromana", "romanschism", "medieval", "coldwar", "napoleonic"].every((scenario) => initial.scenarios.includes(scenario))) process.exit(11);
  if (initial.universalNames < 100 || initial.territoriesWithFiveNames !== initial.territoryCount) process.exit(8);
  if (!forcedWar.started) process.exit(3);
  if (
    forcedWar.immediateContested < 1 &&
    warEvolution.contestedCount < 1 &&
    warEvolution.shiftedSubdivisions < 1
  ) {
    process.exit(4);
  }
  if (!conquest.ok || conquest.territoryName !== conquest.ownerName || conquest.ownerHistory.length < 2) process.exit(5);
  if (!conquest.detailsHasHistory || !conquest.detailsHasOriginal) process.exit(6);
  if (subdivisions.withSubdivisions !== subdivisions.total) process.exit(7);
  if (populationApplied !== "population" || uiChecks.graphCards < 4 || uiChecks.graphRows < 16) process.exit(9);
  if (!/Name Bank|Admin-1 Detail|Rating/.test(uiChecks.selectedDetails)) process.exit(10);
  if (puppetsApplied !== "puppets" || religionsApplied !== "religions" || !labelChecks.anchorInsideRussia) process.exit(12);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
