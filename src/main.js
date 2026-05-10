const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EPOCH_YEAR = 2026;
const HOURS_PER_DAY = 24;
const HOURS_PER_WEEK = 168;
const HOURS_PER_MONTH = 720;
const TIME_STEP_OPTIONS = {
  1: "Hours",
  24: "Days",
  168: "Weeks",
  720: "Months",
};

const IDEOLOGIES = [
  {
    name: "Federal",
    economy: 0.72,
    diplomacy: 0.72,
    aggression: 0.34,
    stability: 0.66,
    tax: 0.23,
    conscription: 0.18,
  },
  {
    name: "Mercantile",
    economy: 0.88,
    diplomacy: 0.56,
    aggression: 0.28,
    stability: 0.58,
    tax: 0.2,
    conscription: 0.13,
  },
  {
    name: "Autocratic",
    economy: 0.57,
    diplomacy: 0.34,
    aggression: 0.63,
    stability: 0.52,
    tax: 0.29,
    conscription: 0.27,
  },
  {
    name: "Revolutionary",
    economy: 0.5,
    diplomacy: 0.28,
    aggression: 0.76,
    stability: 0.44,
    tax: 0.25,
    conscription: 0.31,
  },
  {
    name: "Military",
    economy: 0.47,
    diplomacy: 0.22,
    aggression: 0.82,
    stability: 0.5,
    tax: 0.32,
    conscription: 0.35,
  },
  {
    name: "Council",
    economy: 0.66,
    diplomacy: 0.62,
    aggression: 0.42,
    stability: 0.7,
    tax: 0.24,
    conscription: 0.2,
  },
];

const GOVERNMENT_SUFFIX = {
  Federal: ["Federation", "Union", "Republic", "Commonwealth"],
  Mercantile: ["Trade League", "Consortium", "Compact", "Free Ports"],
  Autocratic: ["State", "Dominion", "Directorate", "Authority"],
  Revolutionary: ["Commune", "Front", "Assembly", "People's League"],
  Military: ["Command", "Junta", "Marshalcy", "Defense State"],
  Council: ["Council", "Accord", "League", "Covenant"],
};

const BEHAVIOR_NAME_SUFFIX = {
  military: ["Command", "War Council", "Defense Authority", "Marshalcy", "Shield Directorate"],
  mercantile: ["Trade League", "Mercantile Union", "Prosperity Compact", "Exchange", "Free Ports"],
  stable: ["Republic", "Commonwealth", "Federation", "Civic Union", "Constitutional State"],
  crisis: ["Restoration Front", "Emergency Council", "Provisional State", "National Salvation Authority", "Reconstruction Pact"],
  revolutionary: ["Commune", "People's League", "Assembly", "Liberation Front", "Popular Union"],
  council: ["Council", "Accord", "League", "Covenant", "Concord"],
};

const UNIVERSAL_NAME_STEMS = [
  "Aurora",
  "Meridian",
  "Horizon",
  "Summit",
  "Harbor",
  "Frontier",
  "Keystone",
  "Vanguard",
  "Citadel",
  "Aegis",
  "Solstice",
  "Pioneer",
  "Concord",
  "Atlas",
  "Argent",
  "Verdant",
  "Crescent",
  "Northstar",
  "Equinox",
  "New Dawn",
];

const UNIVERSAL_NAME_FORMS = ["Union", "Accord", "Compact", "Commonwealth", "Directorate"];
const UNIVERSAL_NAMES = UNIVERSAL_NAME_STEMS.flatMap((stem) =>
  UNIVERSAL_NAME_FORMS.map((form) => `${stem} ${form}`),
);

const RELIGION_COLORS = {
  Christianity: "#6ca6d9",
  Islam: "#4fb07a",
  Hinduism: "#d89a4d",
  Buddhism: "#d8b84d",
  "Chinese folk": "#d76157",
  Judaism: "#8fa5d8",
  Shinto: "#e07e95",
  Secular: "#afa890",
  Indigenous: "#76b084",
};

const MAP_MODES = {
  political: "Political",
  alliances: "Alliances",
  puppets: "Puppets",
  religions: "Religions",
  economy: "GDP",
  stability: "Stability",
  unrest: "Unrest",
  population: "Population",
  wars: "War Fronts",
  warAlliances: "Wars & Alliances",
  landmass: "Landmass",
};

const DATA_DRIVEN_MAP_MODES = new Set(["economy", "stability", "unrest", "population"]);

const ADMIN1_SUMMARY = window.WORLD_ADMIN1_SUMMARY || { byIso: {}, byIso3: {}, byAdmin: {}, meta: null };
const ADMIN1_GEOMETRY = window.WORLD_ADMIN1_GEOMETRY || { byIso: {}, byIso3: {}, byAdmin: {}, meta: null };
const GENERIC_SUBDIVISION_TYPES = ["Province", "Region", "Territory", "District"];

const PALETTE = [
  "#58bfa6",
  "#d98b55",
  "#d76157",
  "#d8b84d",
  "#87b768",
  "#b879c8",
  "#64a7c7",
  "#e07e95",
  "#a2a850",
  "#c8946f",
  "#76b084",
  "#ce6f67",
  "#87a0d8",
  "#bfa365",
  "#60b7b2",
  "#d7773f",
  "#9c8fd5",
  "#d45f86",
  "#69a45e",
  "#c3b34f",
];

const ROBINSON_X = [
  1, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216, 0.8962,
  0.8679, 0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322,
];

const ROBINSON_Y = [
  0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958, 0.5571,
  0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1,
];

const canvas = document.querySelector("#worldCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
const historyCanvas = document.querySelector("#historyCanvas");
const historyCtx = historyCanvas.getContext("2d");

const els = {
  playPauseBtn: document.querySelector("#playPauseBtn"),
  playPauseIcon: document.querySelector("#playPauseIcon"),
  stepBtn: document.querySelector("#stepBtn"),
  speedRange: document.querySelector("#speedRange"),
  timeStepSelect: document.querySelector("#timeStepSelect"),
  mapModeSelect: document.querySelector("#mapModeSelect"),
  scenarioSelect: document.querySelector("#scenarioSelect"),
  newWorldBtn: document.querySelector("#newWorldBtn"),
  selectionDetails: document.querySelector("#selectionDetails"),
  // removed military unit toggle
  selectedBadge: document.querySelector("#selectedBadge"),
  toolHint: document.querySelector("#toolHint"),
  nationPolicy: document.querySelector("#nationPolicy"),
  aiBadge: document.querySelector("#aiBadge"),
  dateLabel: document.querySelector("#dateLabel"),
  worldStats: document.querySelector("#worldStats"),
  mapTooltip: document.querySelector("#mapTooltip"),
  leaderboard: document.querySelector("#leaderboard"),
  powerCount: document.querySelector("#powerCount"),
  ledgerStats: document.querySelector("#ledgerStats"),
  countryGraphs: document.querySelector("#countryGraphs"),
  eventLog: document.querySelector("#eventLog"),
  saveBtn: document.querySelector("#saveBtn"),
  loadBtn: document.querySelector("#loadBtn"),
  clearLogBtn: document.querySelector("#clearLogBtn"),
  stabilizeBtn: document.querySelector("#stabilizeBtn"),
  fundRebelsBtn: document.querySelector("#fundRebelsBtn"),
  inciteWarBtn: document.querySelector("#inciteWarBtn"),
  puppetBtn: document.querySelector("#puppetBtn"),
  zoomInBtn: document.querySelector("#zoomInBtn"),
  zoomOutBtn: document.querySelector("#zoomOutBtn"),
  resetViewBtn: document.querySelector("#resetViewBtn"),
  countrySearch: document.querySelector("#countrySearch"),
  subtitle: document.querySelector("#subtitle"),
};

const state = {
  territories: [],
  nations: new Map(),
  relations: new Map(),
  borderPairs: new Map(),
  eventLog: [],
  history: [],
  year: 2026,
  month: 0,
  day: 1,
  hour: 0,
  elapsedHours: 0,
  lastHistoryHours: null,
  running: false,
  speed: 4,
  timeStepHours: 1,
  scenario: "historic",
  mapMode: "political",
  activeTool: "inspect",
  selectedTerritoryId: null,
  selectedNationId: null,
  selectedSubdivisionId: null,
  hoveredTerritoryId: null,
  hoveredSubdivisionId: null,
  nextNationId: 1,
  seed: Math.floor(Math.random() * 1_000_000),
  tickHandle: null,
  view: { zoom: 1, panX: 0, panY: 0 },
  dragging: false,
  dragStart: null,
  lastPointer: null,
  worldBounds: null,
  projection: null,
  animationHandle: null,
  animationTime: 0,
  lastMapAnimation: 0,
  fps: 0,
  fpsCounter: 0,
  lastFpsTime: 0,
  lastPanelRenderAt: 0,
  lastLeaderboardRenderAt: 0,
  // unit system removed
  segmentMapCache: null,
  segmentMapDirty: false,
  segmentMapVersion: 0,
  borderPathCache: null,
  ownerBoundaryCache: new Map(),
  // fill cache for territory base fills per `mapMode`
  fillCache: null,
  fillCacheDirty: true,
  bgCanvas: null,
  lastProjectionKey: null,
  eventLinkCache: null,
  // cached aggregates to avoid repeated array allocations
  cachedMaxPopulation: 1,
  cachedMaxGdp: 1,
};

let rng = mulberry32(state.seed);

function mulberry32(seed) {
  let t = seed >>> 0;
  return function random() {
    t += 0x6d2b79f5;
    let value = Math.imul(t ^ (t >>> 15), t | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function choice(items) {
  return items[Math.floor(rng() * items.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function scaledChance(monthlyChance, monthScale) {
  const chance = clamp(monthlyChance, 0, 1);
  return 1 - (1 - chance) ** Math.max(0, monthScale);
}

function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

const NUMBER_FORMATTERS = new Map();

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(value)) return "0";
  let formatter = NUMBER_FORMATTERS.get(digits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: digits });
    NUMBER_FORMATTERS.set(digits, formatter);
  }
  return formatter.format(value);
}

function formatPopulation(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return formatNumber(value);
}

function formatMoney(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}T`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}B`;
  return `$${value.toFixed(0)}M`;
}

function safeName(value, fallback = "Unknown") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function normalizeKey(value) {
  return safeName(value, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(value) {
  let hash = 2166136261;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hash01(value) {
  return hashString(value) / 4294967295;
}

function coordinateKey(point) {
  return `${Math.round(point[0] * 10000)}:${Math.round(point[1] * 10000)}`;
}

function segmentKeyFromLonLat(a, b) {
  const ka = coordinateKey(a);
  const kb = coordinateKey(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

function buildTerritorySegments(lonLatRings, projectedRings) {
  const segments = [];
  for (let r = 0; r < lonLatRings.length; r += 1) {
    const lonLatRing = lonLatRings[r];
    const projectedRing = projectedRings[r];
    if (!lonLatRing || !projectedRing || lonLatRing.length < 2) continue;
    for (let i = 0; i < lonLatRing.length; i += 1) {
      const next = (i + 1) % lonLatRing.length;
      segments.push({
        key: segmentKeyFromLonLat(lonLatRing[i], lonLatRing[next]),
        a: projectedRing[i],
        b: projectedRing[next],
      });
    }
  }
  return segments;
}

function territorySubdivisionEntries(territory) {
  const byIso = ADMIN1_SUMMARY.byIso || {};
  const byIso3 = ADMIN1_SUMMARY.byIso3 || {};
  const byAdmin = ADMIN1_SUMMARY.byAdmin || {};
  const isoEntry = territory.iso2 && byIso[territory.iso2] ? byIso[territory.iso2] : null;
  if (isoEntry?.length) return isoEntry;
  const iso3Entry = territory.iso && byIso3[territory.iso] ? byIso3[territory.iso] : null;
  if (iso3Entry?.length) return iso3Entry;

  const direct = byAdmin[territory.originalName] || byAdmin[territory.longName] || null;
  if (direct?.length) return direct;

  const normalizedWanted = normalizeKey(territory.originalName);
  for (const [adminName, entries] of Object.entries(byAdmin)) {
    if (normalizeKey(adminName) === normalizedWanted) return entries;
  }
  return null;
}

function normalizeAdminEntries(entries) {
  if (!entries?.length) return null;
  const seen = new Set();
  const unique = [];
  for (const entry of entries) {
    const name = safeName(entry.name, "");
    if (!name) continue;
    const type = safeName(entry.type, "Subdivision");
    const key = `${normalizeKey(name)}|${normalizeKey(type)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({
      name,
      type,
      rings: entry.rings || null,
      weight: entry.weight ?? 1,
      gdpWeight: entry.gdpWeight ?? entry.weight ?? 1,
    });
  }
  return unique.length ? unique.sort((a, b) => a.name.localeCompare(b.name)) : null;
}

function admin1GeometryEntries(territory) {
  const byIso = ADMIN1_GEOMETRY.byIso || {};
  const byIso3 = ADMIN1_GEOMETRY.byIso3 || {};
  const byAdmin = ADMIN1_GEOMETRY.byAdmin || {};
  const entries = [];
  const iso2 = safeName(territory.iso2, "").toUpperCase();
  const iso3 = safeName(territory.iso, "").toUpperCase();
  const adminKey = normalizeKey(territory.originalName || territory.name || territory.longName || "");
  if (iso2 && byIso[iso2]?.length) entries.push(...byIso[iso2]);
  if (iso3 && byIso3[iso3]?.length) entries.push(...byIso3[iso3]);
  if (adminKey && byAdmin[adminKey]?.length) entries.push(...byAdmin[adminKey]);
  return normalizeAdminEntries(entries);
}

function admin1SubdivisionEntries(territory) {
  const compiled = admin1GeometryEntries(territory);
  if (compiled?.length) return compiled;

  const src = window.WORLD_ADMIN1_GEO;
  if (!src?.features?.length) return null;
  const entries = [];
  const wantIso3 = territory.iso || "";
  const wantIso2 = territory.iso2 || "";
  const wantNameNorm = normalizeKey(territory.originalName || territory.name || "");
  for (const feature of src.features || []) {
    const props = feature.properties || {};
    const adm0 = String(props.adm0_a3 || props.iso_a3 || props.sov_a3 || "");
    const iso2 = String(props.iso_a2 || "");
    const admin = String(props.admin || props.geonunit || props.name_en || props.name || "");
    const name = String(props.name_en || props.name || props.gn_name || props.name_alt || "").trim();
    const type = String(props.type_en || props.type || "Subdivision").trim();
    if (!name) continue;
    if (wantIso3 && adm0 && adm0 === wantIso3) {
      entries.push({ name, type, rings: geometryToRings(feature.geometry) });
      continue;
    }
    if (wantIso2 && iso2 && iso2 === wantIso2) {
      entries.push({ name, type, rings: geometryToRings(feature.geometry) });
      continue;
    }
    if (normalizeKey(admin) === wantNameNorm) {
      entries.push({ name, type, rings: geometryToRings(feature.geometry) });
    }
  }
  return normalizeAdminEntries(entries);
}

function ensureTerritorySubdivisions(territory, ownerId) {
  if (!territory) return;
  if (territory.subdivisions?.length) return;

  // Build or reuse a subdivisions template
  let template = territory.subdivisionsTemplate && territory.subdivisionsTemplate.length ? territory.subdivisionsTemplate : null;
  if (!template) {
    const adminEntries = admin1SubdivisionEntries(territory) || territorySubdivisionEntries(territory) || null;
    if (adminEntries && adminEntries.length) {
      template = adminEntries.map((e) => ({
        name: e.name,
        type: e.type,
        rings: e.rings || null,
        weight: e.weight ?? 1,
        gdpWeight: e.gdpWeight ?? e.weight ?? 1,
      }));
      territory.subdivisionSource = "admin1";
    } else {
      const n = Math.min(6, Math.max(1, Math.round(Math.log10(Math.max(100000, territory.population || 100000)) - 4 + 1)));
      template = new Array(n).fill(0).map((_, i) => ({ name: `${territory.originalName} ${i + 1}`, type: GENERIC_SUBDIVISION_TYPES[i % GENERIC_SUBDIVISION_TYPES.length] }));
      territory.subdivisionSource = "wedge";
    }
    territory.subdivisionsTemplate = template;
  }

  const weights = (territory.subdivisionsTemplate || []).map((entry) => entry.weight ?? 1);
  const totalWeight = weights.reduce((s, v) => s + v, 0) || 1;
  const gdpWeights = (territory.subdivisionsTemplate || []).map((entry, idx) => entry.gdpWeight ?? weights[idx]);
  const totalGdpWeight = gdpWeights.reduce((s, v) => s + v, 0) || 1;

  territory.subdivisions = (territory.subdivisionsTemplate || []).map((entry, idx) => ({
    id: `${territory.id}-${idx}`,
    name: safeName(entry.name, `${territory.originalName} ${idx + 1}`),
    type: safeName(entry.type, territory.subdivisionsType),
    populationShare: weights[idx] / totalWeight,
    gdpShare: gdpWeights[idx] / totalGdpWeight,
    ownerId: ownerId ?? territory.ownerId,
    history: ownerId != null ? [ownerId] : [],
    contestedById: null,
    contestedProgress: 0,
    contestedUpdatedAt: 0,
    geoRings: entry.rings || null,
    sliceStart: 0,
    sliceEnd: 0,
    centroidProjected: null,
    projectedRings: null,
  }));

  // Compute subdivision geometry (projected rings or wedge fallbacks)
  for (let i = 0; i < territory.subdivisions.length; i += 1) {
    const s = territory.subdivisions[i];
    if (s.geoRings) {
      try {
        const projectedRings = s.geoRings.map((ring) => ring.map(([lon, lat]) => robinsonProject(lon, lat)));
        s.projectedRings = projectedRings;
        s.centroidProjected = representativePoint(projectedRings);
      } catch (e) {
        s.projectedRings = null;
        s.centroidProjected = territory.centroid || [0, 0];
      }
    } else {
      const n = territory.subdivisions.length || 1;
      const center = territory.centroid || [0, 0];
      const pb = territory.bounds || { minX: center[0] - 0.5, minY: center[1] - 0.5, maxX: center[0] + 0.5, maxY: center[1] + 0.5 };
      const maxDim = Math.max(pb.maxX - pb.minX, pb.maxY - pb.minY, 0.001);
      const baseRadius = Math.max(0.18, maxDim * 0.52);
      const start = (i / n) * Math.PI * 2;
      const end = ((i + 1) / n) * Math.PI * 2;
      const mid = (start + end) / 2;
      const radius = baseRadius * (0.82 + (hash01(`${territory.id}-${i}-r`) - 0.5) * 0.28);
      const cx = center[0] + Math.cos(mid) * radius;
      const cy = center[1] + Math.sin(mid) * radius;
      s.sliceStart = start;
      s.sliceEnd = end;
      s.centroidProjected = [cx, cy];
    }
  }

  updateTerritoryContestStatus(territory);
}

function subdivisionControlCount(territory, nationId) {
  if (!territory.subdivisions?.length) return 0;
  return territory.subdivisions.reduce((sum, subdivision) => sum + (subdivision.ownerId === nationId ? 1 : 0), 0);
}

function subdivisionControlRatio(territory, nationId) {
  if (!territory.subdivisions?.length) return 1;
  return subdivisionControlCount(territory, nationId) / territory.subdivisions.length;
}

function totalSubdivisionControlCount(nationId) {
  let total = 0;
  for (const territory of state.territories) total += subdivisionControlCount(territory, nationId);
  return total;
}

function transferSubdivisionControl(territory, toNationId, amount = 1, preferredIndexes = null, reason = "annexed") {
  if (!territory.subdivisions?.length) return 0;
  let moved = 0;
  // If preferredIndexes provided, try those first
  const indexes = Array.isArray(preferredIndexes)
    ? [...preferredIndexes, ...territory.subdivisions.map((_, i) => i).filter((i) => !preferredIndexes.includes(i))]
    : territory.subdivisions.map((_, i) => i);
  for (const idx of indexes) {
    if (moved >= amount) break;
    const subdivision = territory.subdivisions[idx];
    if (!subdivision) continue;
    if (subdivision.ownerId === toNationId) continue;
    subdivision.ownerId = toNationId;
    subdivision.history = subdivision.history || [];
    const last = subdivision.history[subdivision.history.length - 1];
    if (last !== toNationId) subdivision.history.push(toNationId);
    subdivision.lastTransferAt = worldMonthIndex();
    subdivision.transferReason = reason;
    subdivision.permanentFromPeace = subdivision.permanentFromPeace ?? false;
    moved += 1;
  }
  // update aggregated territory contest/ownership metadata
  updateTerritoryContestStatus(territory);
  // mark segment ownership cache dirty so borders update
  state.segmentMapDirty = true;
  // mark fill cache dirty so territorial fills update
  state.fillCacheDirty = true;
  return moved;
}

function transferSubdivision(territoryId, subdivisionIndex, toNationId, { reason = "annexed", event = null, quiet = false } = {}) {
  const territory = state.territories[territoryId];
  if (!territory || !territory.subdivisions?.[subdivisionIndex]) return false;
  const subdivision = territory.subdivisions[subdivisionIndex];
  const fromNationId = subdivision.ownerId;
  if (fromNationId === toNationId) return false;
  subdivision.ownerId = toNationId;
  subdivision.history = subdivision.history || [];
  const last = subdivision.history[subdivision.history.length - 1];
  if (last !== toNationId) subdivision.history.push(toNationId);
  subdivision.lastTransferAt = worldMonthIndex();
  subdivision.transferReason = reason;
  subdivision.permanentFromPeace = subdivision.permanentFromPeace ?? false;
  updateTerritoryContestStatus(territory);
  if (!quiet && event) pushEvent(reason === "captured" ? "war" : "diplomacy", event);
  // mark segment ownership cache dirty so borders update
  state.segmentMapDirty = true;
  // mark fill cache dirty so territorial fills update
  state.fillCacheDirty = true;
  return true;
}

function updateTerritoryContestStatus(territory) {
  if (!territory || !territory.subdivisions) return;
  let maxProgress = 0;
  let leading = null;
  let latest = 0;
  for (const s of territory.subdivisions) {
    if (s.contestedProgress > maxProgress) {
      maxProgress = s.contestedProgress;
      leading = s.contestedById;
    }
    if ((s.contestedUpdatedAt || 0) > latest) latest = s.contestedUpdatedAt;
  }
  territory.contestedById = leading;
  territory.contestedProgress = maxProgress;
  territory.contestedUpdatedAt = latest;
  // set contestedFromId based on leading subdivision
  if (leading != null) {
    const lead = territory.subdivisions.find((s) => s.contestedById === leading && s.contestedProgress === maxProgress);
    territory.contestedFromId = lead?.contestedFromTerritoryId ?? null;
  } else {
    territory.contestedFromId = null;
  }
}

function robinsonProject(lon, lat) {
  const absLat = Math.min(90, Math.abs(lat));
  const index = Math.min(17, Math.floor(absLat / 5));
  const fraction = (absLat - index * 5) / 5;
  const xCoeff = lerp(ROBINSON_X[index], ROBINSON_X[index + 1], fraction);
  const yCoeff = lerp(ROBINSON_Y[index], ROBINSON_Y[index + 1], fraction);
  const x = 0.8487 * xCoeff * ((lon * Math.PI) / 180);
  const y = 1.3523 * yCoeff * Math.sign(lat || 1);
  return [x, -y];
}

function geometryToRings(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

function projectedBounds(rings) {
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  for (const ring of rings) {
    for (const point of ring) {
      bounds.minX = Math.min(bounds.minX, point[0]);
      bounds.minY = Math.min(bounds.minY, point[1]);
      bounds.maxX = Math.max(bounds.maxX, point[0]);
      bounds.maxY = Math.max(bounds.maxY, point[1]);
    }
  }
  return bounds;
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const next = (i + 1) % ring.length;
    area += ring[i][0] * ring[next][1] - ring[next][0] * ring[i][1];
  }
  return area / 2;
}

function ringCentroid(ring) {
  const area = ringArea(ring);
  if (Math.abs(area) < 0.000001) return ring[0] || [0, 0];
  let x = 0;
  let y = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const next = (i + 1) % ring.length;
    const cross = ring[i][0] * ring[next][1] - ring[next][0] * ring[i][1];
    x += (ring[i][0] + ring[next][0]) * cross;
    y += (ring[i][1] + ring[next][1]) * cross;
  }
  return [x / (6 * area), y / (6 * area)];
}

function representativePoint(rings) {
  const largest = rings
    .filter((ring) => ring.length > 2)
    .slice()
    .sort((a, b) => Math.abs(ringArea(b)) - Math.abs(ringArea(a)))[0];
  return largest ? ringCentroid(largest) : [0, 0];
}

function lonLatBounds(rings) {
  const bounds = {
    minLon: Infinity,
    minLat: Infinity,
    maxLon: -Infinity,
    maxLat: -Infinity,
  };
  for (const ring of rings) {
    for (const point of ring) {
      bounds.minLon = Math.min(bounds.minLon, point[0]);
      bounds.minLat = Math.min(bounds.minLat, point[1]);
      bounds.maxLon = Math.max(bounds.maxLon, point[0]);
      bounds.maxLat = Math.max(bounds.maxLat, point[1]);
    }
  }
  return bounds;
}

function prepareTerritories(geojson) {
  const territories = geojson.features
    .filter((feature) => feature.geometry && feature.properties?.name !== "Antarctica")
    .map((feature, id) => {
      const props = feature.properties || {};
      const lonLatRings = geometryToRings(feature.geometry).filter((ring) => ring.length > 2);
      const projectedRings = lonLatRings.map((ring) =>
        ring.map(([lon, lat]) => robinsonProject(lon, lat)),
      );
      const pb = projectedBounds(projectedRings);
      const gb = lonLatBounds(lonLatRings);
      const originalName = safeName(props.name || props.admin, `Territory ${id + 1}`);
      const labelPoint = representativePoint(projectedRings);
      const geoLabelPoint = representativePoint(lonLatRings);
      const population = Math.max(85_000, Number(props.pop_est) || 350_000 + rng() * 4_500_000);
      const estimatedGdp =
        Number(props.gdp_md_est) ||
        (population * (4_000 + rng() * 22_000)) / 1_000_000;

      return {
        id,
        name: originalName,
        longName: safeName(props.name_long || props.admin || props.name, `Territory ${id + 1}`),
        iso: safeName(props.iso_a3 || props.adm0_a3 || props.sov_a3, `T${id}`),
        iso2: safeName(props.iso_a2, ""),
        continent: safeName(props.continent, "World"),
        region: safeName(props.subregion || props.region_un || props.region_wb, "Unaligned"),
        incomeGroup: safeName(props.income_grp, "Mixed income"),
        economyClass: safeName(props.economy, "Diversified"),
        religion: dominantReligionForTerritory(originalName, safeName(props.subregion || props.region_un || props.region_wb, ""), safeName(props.continent, "")),
        population,
        basePopulation: population,
        gdp: Math.max(65, estimatedGdp),
        baseGdp: Math.max(65, estimatedGdp),
        infrastructure: clamp(0.54 + incomeScore(props.income_grp) * 0.12 + rng() * 0.22, 0.38, 1.45),
        unrest: clamp(0.1 + rng() * 0.22 - incomeScore(props.income_grp) * 0.012, 0.03, 0.66),
        fortification: clamp(0.08 + rng() * 0.16, 0, 0.72),
        occupation: 0,
        contestedById: null,
        contestedFromId: null,
        contestedProgress: 0,
        contestedUpdatedAt: 0,
        captureFlash: 0,
        ownerId: null,
        coreOwnerId: null,
        previousOwnerId: null,
        capital: false,
        lonLatRings,
        projectedRings,
        bounds: pb,
        geoBounds: gb,
        centroid: labelPoint,
        geoCentroid: geoLabelPoint,
        boundsCentroid: [(pb.minX + pb.maxX) / 2, (pb.minY + pb.maxY) / 2],
        geoBoundsCentroid: [(gb.minLon + gb.maxLon) / 2, (gb.minLat + gb.maxLat) / 2],
        neighbors: [],
        ownerHistory: [],
        originalOwnerId: null,
        originalName,
        alternateNames: countryNameBank(originalName, safeName(props.subregion || props.region_un || props.region_wb, ""), safeName(props.continent, "")),
        subdivisions: [],
        subdivisionsTemplate: [],
        subdivisionsType: "Subdivision",
        subdivisionSource: "unknown",
        segments: buildTerritorySegments(lonLatRings, projectedRings),
        path: null,
      };
    });

  const bounds = {
    minX: Math.min(...territories.map((t) => t.bounds.minX)),
    minY: Math.min(...territories.map((t) => t.bounds.minY)),
    maxX: Math.max(...territories.map((t) => t.bounds.maxX)),
    maxY: Math.max(...territories.map((t) => t.bounds.maxY)),
  };

  buildAdjacency(territories);
  return { territories, bounds };
}

function dominantReligionForTerritory(name, region, continent) {
  const text = `${name} ${region} ${continent}`.toLowerCase();
  if (/india|nepal/.test(text)) return "Hinduism";
  if (/israel/.test(text)) return "Judaism";
  if (/japan/.test(text)) return "Shinto";
  if (/china|taiwan|hong kong|macau/.test(text)) return "Chinese folk";
  if (/thailand|myanmar|cambodia|laos|sri lanka|bhutan|mongolia/.test(text)) return "Buddhism";
  if (/afghanistan|pakistan|iran|iraq|syria|jordan|saudi|yemen|oman|emirates|qatar|kuwait|bahrain|turkey|azerbaijan|kazakhstan|uzbekistan|turkmenistan|tajikistan|kyrgyzstan|bangladesh|malaysia|indonesia|brunei|morocco|algeria|tunisia|libya|egypt|sudan|somalia|mali|niger|senegal|gambia|guinea|mauritania|western sahara/.test(text)) {
    return "Islam";
  }
  if (/europe|america|oceania|russia|philippines|armenia|georgia|ethiopia|kenya|uganda|tanzania|congo|angola|zambia|zimbabwe|south africa|namibia|botswana|lesotho|eswatini|madagascar/.test(text)) {
    return "Christianity";
  }
  if (/antarctica/.test(text)) return "Secular";
  if (/africa|papua|greenland|amazon/.test(text)) return "Indigenous";
  return "Secular";
}

function incomeScore(group) {
  const text = String(group || "").toLowerCase();
  if (text.includes("high")) return 5;
  if (text.includes("upper middle")) return 4;
  if (text.includes("lower middle")) return 3;
  if (text.includes("low")) return 1.5;
  return 2.5;
}

function addNeighborLink(territories, aId, bId, maritime = false) {
  const a = territories[aId];
  const b = territories[bId];
  if (!a || !b || a.id === b.id) return;
  if (!a.neighbors.includes(b.id)) a.neighbors.push(b.id);
  if (!b.neighbors.includes(a.id)) b.neighbors.push(a.id);
  if (maritime) {
    a.maritimeNeighbors = a.maritimeNeighbors || [];
    b.maritimeNeighbors = b.maritimeNeighbors || [];
    if (!a.maritimeNeighbors.includes(b.id)) a.maritimeNeighbors.push(b.id);
    if (!b.maritimeNeighbors.includes(a.id)) b.maritimeNeighbors.push(a.id);
  }
}

function territoryDescriptor(territory) {
  return `${territory.originalName || territory.name || ""} ${territory.region || ""} ${territory.subregion || ""} ${territory.continent || ""}`.toLowerCase();
}

function isIslandLikeTerritory(territory) {
  const text = territoryDescriptor(territory);
  return (
    territory.neighbors.length < 2 ||
    /caribbean|oceania|island|bahamas|barbados|dominica|grenada|jamaica|trinidad|tobago|cuba|haiti|dominican|saint|st\.? kitts|st\.? lucia|st\.? vincent|antigua|mauritius|seychelles|comoros|maldives|fiji|samoa|tonga|vanuatu|solomon|kiribati|micronesia|marshall|palau|tuvalu|nauru|cape verde|sao tome|timor|cyprus|iceland|greenland/.test(text)
  );
}

function maritimeNeighborLimit(territory) {
  const text = territoryDescriptor(territory);
  if (/caribbean|bahamas|barbados|dominica|grenada|jamaica|trinidad|tobago|cuba|haiti|dominican|saint|st\.? kitts|st\.? lucia|st\.? vincent|antigua/.test(text)) return 6;
  if (/oceania|pacific|island|maldives|fiji|samoa|tonga|vanuatu|solomon|kiribati|micronesia|marshall|palau|tuvalu|nauru/.test(text)) return 5;
  if (territory.neighbors.length < 1) return 4;
  if (territory.neighbors.length < 2) return 3;
  return 0;
}

function buildMaritimeAdjacency(territories) {
  for (const territory of territories) territory.maritimeNeighbors = [];
  for (const territory of territories) {
    const limit = maritimeNeighborLimit(territory);
    if (!limit) continue;
    const islandLike = isIslandLikeTerritory(territory);
    const maxDistance = territory.neighbors.length < 1 ? 3400 : islandLike ? 2400 : 1250;
    const candidates = territories
      .filter((other) => other.id !== territory.id)
      .map((other) => {
        const distance = haversine(territory.geoCentroid, other.geoCentroid);
        const sameRegion = territory.region && territory.region === other.region;
        const sameContinent = territory.continent && territory.continent === other.continent;
        const sameSubregion = territory.subregion && territory.subregion === other.subregion;
        const score = distance * (sameSubregion ? 0.54 : sameRegion ? 0.68 : sameContinent ? 0.84 : 1.15);
        return { id: other.id, distance, score };
      })
      .filter((candidate) => candidate.distance <= maxDistance || territory.neighbors.length < 1)
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);
    for (const candidate of candidates) addNeighborLink(territories, territory.id, candidate.id, true);
  }
}

function buildAdjacency(territories) {
  for (const territory of territories) {
    territory.neighbors = [];
    territory.maritimeNeighbors = [];
  }

  const vertexOwners = new Map();
  for (const territory of territories) {
    for (const ring of territory.lonLatRings) {
      for (const [lon, lat] of ring) {
        const key = `${Math.round(lon * 1000)}:${Math.round(lat * 1000)}`;
        let owners = vertexOwners.get(key);
        if (!owners) {
          owners = new Set();
          vertexOwners.set(key, owners);
        }
        owners.add(territory.id);
      }
    }
  }

  const shared = new Map();
  for (const owners of vertexOwners.values()) {
    if (owners.size < 2) continue;
    const ids = [...owners];
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const key = pairKey(ids[i], ids[j]);
        shared.set(key, (shared.get(key) || 0) + 1);
      }
    }
  }

  for (const [key, count] of shared) {
    if (count < 2) continue;
    const [a, b] = key.split("|").map(Number);
    addNeighborLink(territories, a, b, false);
  }

  for (const territory of territories) {
    if (territory.neighbors.length >= 2) continue;
    const candidates = territories
      .filter((other) => other.id !== territory.id)
      .map((other) => ({
        id: other.id,
        score:
          haversine(territory.geoCentroid, other.geoCentroid) *
          (territory.continent === other.continent ? 0.62 : 1) *
          (territory.region === other.region ? 0.72 : 1),
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, territory.neighbors.length ? 1 : 2);

    for (const candidate of candidates) addNeighborLink(territories, territory.id, candidate.id, true);
  }

  buildMaritimeAdjacency(territories);

  for (const territory of territories) {
    territory.neighbors = [...new Set(territory.neighbors)].sort((a, b) => a - b);
    territory.maritimeNeighbors = [...new Set(territory.maritimeNeighbors || [])]
      .filter((id) => id !== territory.id)
      .sort((a, b) => a - b);
  }
}

function haversine(a, b) {
  const toRad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toRad;
  const dLon = (b[0] - a[0]) * toRad;
  const lat1 = a[1] * toRad;
  const lat2 = b[1] * toRad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function initializeGame({ scenario = state.scenario, seed = Math.floor(Math.random() * 1_000_000) } = {}) {
  state.seed = seed;
  rng = mulberry32(seed);
  state.scenario = scenario;
  state.nations = new Map();
  state.relations = new Map();
  state.borderPairs = new Map();
  state.eventLog = [];
  state.history = [];
  state.year = 2026;
  state.month = 0;
  state.day = 1;
  state.hour = 0;
  state.elapsedHours = 0;
  state.lastHistoryHours = null;
  state.nextNationId = 1;
  state.selectedTerritoryId = null;
  state.selectedNationId = null;
  state.selectedSubdivisionId = null;
  state.hoveredTerritoryId = null;
  state.hoveredSubdivisionId = null;
  state.view = { zoom: 1, panX: 0, panY: 0 };
  state.segmentMapCache = null;
  state.segmentMapDirty = true;
  state.borderPathCache = null;
  state.ownerBoundaryCache.clear();
  state.fillCache = null;
  state.fillCacheDirty = true;
  state.bgCanvas = null;
  state.lastProjectionKey = null;
  state.eventLinkCache = null;
  state.lastPanelRenderAt = 0;
  state.lastLeaderboardRenderAt = 0;
  clearScreenPathCaches();
  syncCalendarFromHours();

  for (const territory of state.territories) {
    territory.name = territory.originalName;
    territory.longName = territory.originalName;
    territory.gdp = territory.baseGdp;
    territory.population = territory.basePopulation;
    territory.infrastructure = clamp(territory.infrastructure + (rng() - 0.5) * 0.05, 0.38, 1.5);
    territory.unrest = clamp(0.08 + rng() * 0.22, 0.02, 0.68);
    territory.fortification = clamp(0.08 + rng() * 0.16, 0, 0.78);
    territory.occupation = 0;
    territory.contestedById = null;
    territory.contestedFromId = null;
    territory.contestedProgress = 0;
    territory.contestedUpdatedAt = 0;
    territory.captureFlash = 0;
    territory.ownerId = null;
    territory.previousOwnerId = null;
    territory.coreOwnerId = null;
    territory.ownerHistory = [];
    territory.originalOwnerId = null;
    territory.subdivisions = [];
    territory.subdivisionsTemplate = [];
    territory.subdivisionSource = "unknown";
    territory.maritimeNeighbors = territory.maritimeNeighbors || [];
    territory.capital = false;
  }

  if (scenario === "historic") buildHistoricScenario();
  if (scenario === "regional") buildSeededScenario(44, "regional");
  if (scenario === "continental") buildContinentalScenario();
  if (scenario === "fractured") buildSeededScenario(74, "fractured");
  if (scenario === "rome") buildRomeScenario();
  if (scenario === "paxromana") buildPaxRomanaScenario();
  if (scenario === "romanschism") buildRomanSchismScenario();
  if (scenario === "medieval") buildMedievalScenario();
  if (scenario === "crusades") buildCrusadesScenario();
  if (scenario === "ww2") buildWW2Scenario();
  if (scenario === "coldwar") buildColdWarScenario();
  if (scenario === "napoleonic") buildNapoleonicScenario();

  for (const territory of state.territories) {
    territory.originalOwnerId = territory.ownerId;
    territory.ownerHistory = territory.ownerId != null ? [territory.ownerId] : [];
    ensureTerritorySubdivisions(territory, territory.ownerId);
    updateTerritoryRulerName(territory);
  }

  initializeRelations();
  recalculateNationStats();
  pushEvent("diplomacy", "A new simulation begins on the world map.");
  captureHistory();
  syncControls();
  renderAll();
  startLoop();
}

function buildHistoricScenario() {
  for (const territory of state.territories) {
    const ideology = ideologyForTerritory(territory);
    const nation = createNation({
      name: territory.longName,
      capitalId: territory.id,
      ideology,
      color: colorForIndex(state.nextNationId + territory.id),
    });
    claimTerritory(territory.id, nation.id, { core: true, capital: true, quiet: true });
  }
}

function buildSeededScenario(seedCount, type) {
  const candidates = weightedTerritorySeeds(seedCount);
  const queue = [];
  for (const territory of candidates) {
    const ideology = ideologyForTerritory(territory);
    const nation = createNation({
      name: makeNationName(territory.name, ideology.name),
      capitalId: territory.id,
      ideology,
      color: colorForIndex(state.nextNationId + territory.id),
      ambition: type === "fractured" ? 0.45 + rng() * 0.4 : 0.35 + rng() * 0.32,
    });
    claimTerritory(territory.id, nation.id, { core: true, capital: true, quiet: true });
    queue.push(territory.id);
  }

  let guard = 0;
  while (state.territories.some((territory) => !territory.ownerId) && guard < 10_000) {
    guard += 1;
    const currentId = queue.shift() ?? choice(candidates).id;
    const current = state.territories[currentId];
    const owner = current.ownerId;
    const openNeighbors = current.neighbors
      .map((id) => state.territories[id])
      .filter((territory) => !territory.ownerId);
    if (!openNeighbors.length) continue;
    const next = choice(openNeighbors);
    claimTerritory(next.id, owner, { core: false, quiet: true });
    queue.push(next.id);
  }

  for (const territory of state.territories.filter((item) => !item.ownerId)) {
    const nearest = [...state.nations.values()]
      .map((nation) => ({
        nation,
        distance: haversine(territory.geoCentroid, state.territories[nation.capitalId].geoCentroid),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    claimTerritory(territory.id, nearest.nation.id, { core: false, quiet: true });
  }
}

function buildContinentalScenario() {
  const groups = new Map();
  for (const territory of state.territories) {
    const regionKey =
      territory.continent === "Europe" || territory.continent === "Asia"
        ? territory.region
        : territory.continent;
    if (!groups.has(regionKey)) groups.set(regionKey, []);
    groups.get(regionKey).push(territory);
  }

  for (const [region, territories] of groups) {
    const capital = territories
      .slice()
      .sort((a, b) => b.population + b.gdp * 7 - (a.population + a.gdp * 7))[0];
    const ideology = ideologyForTerritory(capital);
    const nation = createNation({
      name: `${region} ${choice(["Accord", "Union", "Compact", "League"])}`,
      capitalId: capital.id,
      ideology,
      color: colorForIndex(state.nextNationId + capital.id),
      ambition: 0.38 + rng() * 0.34,
    });
    for (const territory of territories) {
      claimTerritory(territory.id, nation.id, {
        core: territory.id === capital.id,
        capital: territory.id === capital.id,
        quiet: true,
      });
    }
  }
}

function createScenarioNation(name, territories, ideologyName, options = {}) {
  const owned = territories.filter(Boolean);
  if (!owned.length) return null;
  const capital =
    owned.find((territory) => territory.originalName === options.capitalName) ||
    owned.slice().sort((a, b) => b.population + b.gdp * 7 - (a.population + a.gdp * 7))[0];
  const ideology = IDEOLOGIES.find((item) => item.name === ideologyName) || ideologyForTerritory(capital);
  const nation = createNation({
    name,
    capitalId: capital.id,
    ideology,
    color: colorForIndex(state.nextNationId + capital.id),
    ambition: options.ambition ?? 0.48 + rng() * 0.28,
    stability: options.stability ?? 0.48 + rng() * 0.24,
    treasury: options.treasury ?? 180 + rng() * 220,
  });
  for (const territory of owned) {
    claimTerritory(territory.id, nation.id, {
      core: territory.id === capital.id,
      capital: territory.id === capital.id,
      quiet: true,
    });
  }
  return nation;
}

function unownedTerritories() {
  return state.territories.filter((territory) => !territory.ownerId);
}

function territoriesWhere(predicate) {
  return state.territories.filter((territory) => !territory.ownerId && predicate(territory));
}

function fillRemainingWithRegionalStates(prefix = "Free") {
  const remaining = unownedTerritories();
  const groups = new Map();
  for (const territory of remaining) {
    const key = territory.region || territory.continent;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(territory);
  }
  for (const [region, territories] of groups) {
    createScenarioNation(`${region} ${prefix} League`, territories, "Federal", { ambition: 0.32 + rng() * 0.2 });
  }
}

function buildRomeScenario() {
  createScenarioNation(
    "Roman Empire",
    territoriesWhere((territory) =>
      territory.continent === "Europe" &&
      /Italy|France|Spain|Portugal|Greece|Croatia|Slovenia|Bosnia|Serbia|Montenegro|Albania|Macedonia|Bulgaria|Romania|Turkey/.test(territory.originalName),
    ).concat(territoriesWhere((territory) => /Northern Africa|Western Asia/.test(territory.region) && /Egypt|Libya|Tunisia|Algeria|Morocco|Syria|Jordan|Israel|Lebanon/.test(territory.originalName))),
    "Autocratic",
    { capitalName: "Italy", ambition: 0.78, stability: 0.62, treasury: 520 },
  );
  createScenarioNation("Parthian Shahdom", territoriesWhere((territory) => /Iran|Iraq|Afghanistan|Pakistan|Turkmenistan/.test(territory.originalName)), "Autocratic", { capitalName: "Iran", ambition: 0.7 });
  createScenarioNation("Germanic Confederation", territoriesWhere((territory) => /Germany|Poland|Czechia|Netherlands|Denmark|Sweden|Norway/.test(territory.originalName)), "Council", { capitalName: "Germany" });
  createScenarioNation("Nile Kingdoms", territoriesWhere((territory) => /Sudan|Ethiopia|Eritrea|Somalia/.test(territory.originalName)), "Mercantile", { capitalName: "Ethiopia" });
  fillRemainingWithRegionalStates("Tribal");
}

function buildPaxRomanaScenario() {
  // Pax Romana: Unified Roman Empire at its height
  createScenarioNation(
    "Roman Empire",
    territoriesWhere((territory) =>
      territory.continent === "Europe" &&
      /Italy|France|Spain|Portugal|Greece|Croatia|Slovenia|Bosnia|Serbia|Montenegro|Albania|Macedonia|Bulgaria|Romania|Turkey|Germany|Poland|Czechia|Netherlands|Denmark|Sweden|Norway|United Kingdom|Ireland/.test(territory.originalName),
    ).concat(territoriesWhere((territory) => /Northern Africa|Western Asia/.test(territory.region) && /Egypt|Libya|Tunisia|Algeria|Morocco|Syria|Jordan|Israel|Lebanon|Iraq/.test(territory.originalName))),
    "Autocratic",
    { capitalName: "Italy", ambition: 0.9, stability: 0.8, treasury: 800 },
  );
  createScenarioNation("Parthian Shahdom", territoriesWhere((territory) => /Iran|Afghanistan|Pakistan|Turkmenistan/.test(territory.originalName)), "Autocratic", { capitalName: "Iran", ambition: 0.6 });
  createScenarioNation("Nile Kingdoms", territoriesWhere((territory) => /Sudan|Ethiopia|Eritrea|Somalia/.test(territory.originalName)), "Mercantile", { capitalName: "Ethiopia" });
  fillRemainingWithRegionalStates("Tribal");
}

function buildRomanSchismScenario() {
  // After the Great Schism: Western and Eastern Roman Empires
  createScenarioNation(
    "Western Roman Empire",
    territoriesWhere((territory) =>
      /Italy|France|Spain|Portugal|Germany|Poland|Czechia|Netherlands|Denmark|Sweden|Norway|United Kingdom|Ireland/.test(territory.originalName),
    ),
    "Autocratic",
    { capitalName: "Italy", ambition: 0.7, stability: 0.5, treasury: 300 },
  );
  createScenarioNation(
    "Eastern Roman Empire",
    territoriesWhere((territory) =>
      /Greece|Croatia|Slovenia|Bosnia|Serbia|Montenegro|Albania|Macedonia|Bulgaria|Romania|Turkey/.test(territory.originalName),
    ).concat(territoriesWhere((territory) => /Northern Africa|Western Asia/.test(territory.region) && /Egypt|Libya|Tunisia|Algeria|Morocco|Syria|Jordan|Israel|Lebanon|Iraq/.test(territory.originalName))),
    "Autocratic",
    { capitalName: "Greece", ambition: 0.75, stability: 0.55, treasury: 400 },
  );
  createScenarioNation("Parthian Shahdom", territoriesWhere((territory) => /Iran|Afghanistan|Pakistan|Turkmenistan/.test(territory.originalName)), "Autocratic", { capitalName: "Iran", ambition: 0.7 });
  createScenarioNation("Germanic Confederation", territoriesWhere((territory) => /Austria|Switzerland|Belgium|Luxembourg/.test(territory.originalName)), "Council", { capitalName: "Austria" });
  createScenarioNation("Nile Kingdoms", territoriesWhere((territory) => /Sudan|Ethiopia|Eritrea|Somalia/.test(territory.originalName)), "Mercantile", { capitalName: "Ethiopia" });
  fillRemainingWithRegionalStates("Tribal");
}

function buildMedievalScenario() {
  createScenarioNation("Holy Roman Empire", territoriesWhere((territory) => /Germany|Austria|Switzerland|Czechia|Netherlands|Belgium|Luxembourg|Slovenia/.test(territory.originalName)), "Council", { capitalName: "Germany" });
  createScenarioNation("Kingdom of France", territoriesWhere((territory) => /France|Monaco/.test(territory.originalName)), "Autocratic", { capitalName: "France" });
  createScenarioNation("Byzantine Empire", territoriesWhere((territory) => /Greece|Turkey|Bulgaria|North Macedonia|Albania/.test(territory.originalName)), "Autocratic", { capitalName: "Greece" });
  createScenarioNation("Caliphate of the Crescent", territoriesWhere((territory) => /Morocco|Algeria|Tunisia|Libya|Egypt|Saudi Arabia|Yemen|Oman|Syria|Iraq|Iran|Jordan|Lebanon|Israel/.test(territory.originalName)), "Mercantile", { capitalName: "Egypt" });
  createScenarioNation("Rus Principalities", territoriesWhere((territory) => /Russia|Ukraine|Belarus/.test(territory.originalName)), "Federal", { capitalName: "Russia" });
  createScenarioNation("Iberian Crowns", territoriesWhere((territory) => /Spain|Portugal|Andorra/.test(territory.originalName)), "Federal", { capitalName: "Spain" });
  fillRemainingWithRegionalStates("Crown");
}

function buildCrusadesScenario() {
  createScenarioNation(
    "Byzantine Empire",
    territoriesWhere((t) => /Greece|Turkey|Bulgaria|North Macedonia|Albania|Balkans/.test(t.originalName)),
    "Autocratic",
    { capitalName: "Constantinople", ambition: 0.62, stability: 0.6 },
  );
  createScenarioNation(
    "Seljuk Sultanate",
    territoriesWhere((t) => /Turkey|Iran|Iraq|Syria/.test(t.originalName)),
    "Autocratic",
    { capitalName: "Persia", ambition: 0.64, stability: 0.48 },
  );
  createScenarioNation(
    "Fatimid Caliphate",
    territoriesWhere((t) => /Egypt|Libya|Tunisia|Algeria/.test(t.originalName)),
    "Mercantile",
    { capitalName: "Cairo", ambition: 0.46 },
  );
  createScenarioNation(
    "Kingdom of Jerusalem",
    territoriesWhere((t) => /Lebanon|Israel|Palestine|Jordan|Syria/.test(t.originalName)),
    "Autocratic",
    { capitalName: "Jerusalem", ambition: 0.5, stability: 0.4 },
  );
  createScenarioNation("Kingdom of France", territoriesWhere((t) => /France/.test(t.originalName)), "Autocratic", { capitalName: "Paris", ambition: 0.48 });
  createScenarioNation("Kingdom of England", territoriesWhere((t) => /United Kingdom|Ireland/.test(t.originalName)), "Federal", { capitalName: "London", ambition: 0.46 });
  createScenarioNation("Holy Roman Empire", territoriesWhere((t) => /Germany|Austria|Switzerland|Czechia|Netherlands|Belgium/.test(t.originalName)), "Council", { capitalName: "Germany", ambition: 0.5 });
  fillRemainingWithRegionalStates("Principalities");

  // set some antagonisms typical of the period
  const byz = [...state.nations.values()].find((n) => /Byzantine/.test(n.name));
  const sel = [...state.nations.values()].find((n) => /Seljuk/.test(n.name));
  const fat = [...state.nations.values()].find((n) => /Fatimid/.test(n.name));
  const jer = [...state.nations.values()].find((n) => /Jerusalem/.test(n.name));
  if (byz && sel) setRelation(byz.id, sel.id, -68);
  if (jer && fat) setRelation(jer.id, fat.id, -84);
}

function buildColdWarScenario() {
  const western = createScenarioNation(
    "Atlantic Treaty Bloc",
    territoriesWhere((territory) =>
      /United States|Canada|United Kingdom|France|Germany|Italy|Spain|Portugal|Netherlands|Belgium|Luxembourg|Norway|Denmark|Iceland|Greece|Turkey|Japan|South Korea|Australia|New Zealand/.test(territory.originalName),
    ),
    "Federal",
    { capitalName: "United States of America", ambition: 0.5, stability: 0.7 },
  );
  const eastern = createScenarioNation(
    "Warsaw Security Bloc",
    territoriesWhere((territory) => /Russia|Ukraine|Belarus|Poland|Czechia|Slovakia|Hungary|Romania|Bulgaria|Moldova|Kazakhstan|Uzbekistan|Turkmenistan|Tajikistan|Kyrgyzstan|Georgia|Armenia|Azerbaijan/.test(territory.originalName)),
    "Military",
    { capitalName: "Russia", ambition: 0.72, stability: 0.58 },
  );
  const nonAligned = createScenarioNation(
    "Non-Aligned Congress",
    territoriesWhere((territory) => /India|Indonesia|Egypt|Ghana|Tanzania|Zambia|Zimbabwe|South Africa|Brazil|Mexico|Argentina|Chile|Peru|Colombia/.test(territory.originalName)),
    "Council",
    { capitalName: "India", ambition: 0.42 },
  );
  if (western && eastern) setRelation(western.id, eastern.id, -72);
  if (nonAligned) {
    if (western) setRelation(nonAligned.id, western.id, 12);
    if (eastern) setRelation(nonAligned.id, eastern.id, -8);
  }
  fillRemainingWithRegionalStates("Neutral");
}

function buildWW2Scenario() {
  // Major WWII belligerents and theaters (broad, modern-country based grouping)
  createScenarioNation(
    "Nazi Germany",
    territoriesWhere((territory) => /Germany|Austria|Czechia|Poland|Netherlands|Belgium|Luxembourg|Denmark|Norway/.test(territory.originalName)),
    "Military",
    { capitalName: "Germany", ambition: 0.86, stability: 0.48, treasury: 320 },
  );

  createScenarioNation(
    "Kingdom of Italy",
    territoriesWhere((territory) => /Italy|San Marino|Vatican|Slovenia|Croatia|Albania/.test(territory.originalName)),
    "Autocratic",
    { capitalName: "Italy", ambition: 0.64, stability: 0.44 },
  );

  createScenarioNation(
    "Empire of Japan",
    territoriesWhere((territory) => /Japan|Korea|Taiwan|Philippines/.test(territory.originalName)),
    "Military",
    { capitalName: "Japan", ambition: 0.86, stability: 0.54 },
  );

  createScenarioNation(
    "Soviet Union",
    territoriesWhere((territory) => /Russia|Ukraine|Belarus|Moldova|Kazakhstan|Georgia|Armenia|Azerbaijan/.test(territory.originalName)),
    "Autocratic",
    { capitalName: "Russia", ambition: 0.78, stability: 0.46 },
  );

  createScenarioNation(
    "United Kingdom",
    territoriesWhere((territory) => /United Kingdom|Ireland|Canada|Australia|New Zealand/.test(territory.originalName)),
    "Mercantile",
    { capitalName: "United Kingdom", ambition: 0.62, stability: 0.6 },
  );

  createScenarioNation(
    "United States of America",
    territoriesWhere((territory) => /United States|United States of America|USA/.test(territory.originalName)),
    "Federal",
    { capitalName: "United States of America", ambition: 0.68, stability: 0.74 },
  );

  createScenarioNation(
    "French Republic",
    territoriesWhere((territory) => /France|Monaco/.test(territory.originalName)),
    "Federal",
    { capitalName: "France", ambition: 0.48, stability: 0.5 },
  );

  createScenarioNation(
    "Republic of China",
    territoriesWhere((territory) => /China|Taiwan|Hong Kong|Macau/.test(territory.originalName)),
    "Council",
    { capitalName: "China", ambition: 0.46, stability: 0.44 },
  );

  fillRemainingWithRegionalStates("Wartime");
}

function buildNapoleonicScenario() {
  createScenarioNation("French Empire", territoriesWhere((territory) => /France|Belgium|Netherlands|Luxembourg|Italy|Switzerland|Spain/.test(territory.originalName)), "Military", { capitalName: "France", ambition: 0.82, stability: 0.52 });
  createScenarioNation("British Empire", territoriesWhere((territory) => /United Kingdom|Ireland|Canada|Australia|New Zealand|India|South Africa/.test(territory.originalName)), "Mercantile", { capitalName: "United Kingdom", ambition: 0.62 });
  createScenarioNation("Russian Empire", territoriesWhere((territory) => /Russia|Ukraine|Belarus|Finland|Poland|Kazakhstan|Georgia|Armenia|Azerbaijan/.test(territory.originalName)), "Autocratic", { capitalName: "Russia", ambition: 0.68 });
  createScenarioNation("Austrian Empire", territoriesWhere((territory) => /Austria|Hungary|Czechia|Slovakia|Slovenia|Croatia|Bosnia|Serbia|Romania/.test(territory.originalName)), "Autocratic", { capitalName: "Austria" });
  createScenarioNation("Ottoman Empire", territoriesWhere((territory) => /Turkey|Syria|Iraq|Jordan|Lebanon|Israel|Saudi Arabia|Egypt|Libya|Greece|Bulgaria|Albania|North Macedonia/.test(territory.originalName)), "Autocratic", { capitalName: "Turkey" });
  fillRemainingWithRegionalStates("Concert");
}

function weightedTerritorySeeds(count) {
  const result = [];
  const byContinent = new Map();
  for (const territory of state.territories) {
    if (!byContinent.has(territory.continent)) byContinent.set(territory.continent, []);
    byContinent.get(territory.continent).push(territory);
  }

  const continentWeights = [...byContinent.entries()].map(([continent, territories]) => ({
    continent,
    count: Math.max(2, Math.round((territories.length / state.territories.length) * count)),
    territories,
  }));

  for (const group of continentWeights) {
    const pool = group.territories.slice();
    for (let i = 0; i < group.count && pool.length; i += 1) {
      pool.sort((a, b) => seedScore(b) - seedScore(a));
      const pickIndex = Math.floor(rng() ** 1.9 * Math.min(pool.length, 12));
      result.push(pool.splice(pickIndex, 1)[0]);
    }
  }

  while (result.length > count) result.splice(Math.floor(rng() * result.length), 1);
  while (result.length < count) {
    const territory = choice(state.territories);
    if (!result.includes(territory)) result.push(territory);
  }
  return result;
}

function seedScore(territory) {
  return territory.population / 1_000_000 + territory.gdp / 30_000 + rng() * 15;
}

function ideologyForTerritory(territory) {
  const income = incomeScore(territory.incomeGroup);
  if (income >= 4.5) return rng() < 0.52 ? IDEOLOGIES[0] : IDEOLOGIES[1];
  if (territory.region.includes("Eastern") && rng() < 0.38) return IDEOLOGIES[3];
  if (territory.gdp > 1_000_000 && rng() < 0.3) return IDEOLOGIES[1];
  if (rng() < 0.2) return IDEOLOGIES[4];
  if (rng() < 0.42) return IDEOLOGIES[2];
  return choice(IDEOLOGIES);
}

function makeNationName(base, ideologyName) {
  const suffixes = GOVERNMENT_SUFFIX[ideologyName] || ["State"];
  return `${base} ${choice(suffixes)}`;
}

function countryNameBank(baseName, region = "", continent = "") {
  const base = safeName(baseName, "Nation");
  const regionWord = safeName(region, continent || "World").split(" ").filter(Boolean)[0] || "World";
  return [
    `Kingdom of ${base}`,
    `${base} Republic`,
    `${base} Commonwealth`,
    `${base} Federation`,
    `${base} Dominion`,
    `${base} Restoration`,
    `${base} People's Union`,
    `${base} Free State`,
    `${regionWord} ${base} Accord`,
    `New ${base}`,
  ];
}

function behaviorProfile(nation) {
  if (!nation) return "stable";
  if (nation.wars.size >= 2 || nation.ideology.aggression > 0.72 || nation.army > Math.max(8, nation.population / 8_000_000)) {
    return "military";
  }
  if (nation.treasury > 620 || nation.ideology.economy > 0.78 || nation.income > nation.expenses * 1.5) {
    return "mercantile";
  }
  if (nation.legitimacy < 0.34 || nation.warExhaustion > 0.65 || nation.stability < 0.34) {
    return "crisis";
  }
  if (nation.ideology.name === "Revolutionary" || nation.ambition > 0.72) return "revolutionary";
  if (nation.ideology.name === "Council") return "council";
  return "stable";
}

function namesForBehavior(nation) {
  return BEHAVIOR_NAME_SUFFIX[behaviorProfile(nation)] || BEHAVIOR_NAME_SUFFIX.stable;
}

function behaviorNameCandidate(baseName, nation) {
  const suffixes = namesForBehavior(nation);
  return `${safeName(baseName, "New")} ${choice(suffixes)}`;
}

function createNation({
  name,
  capitalId,
  ideology,
  color,
  ambition = null,
  stability = null,
  treasury = null,
} = {}) {
  const id = state.nextNationId;
  state.nextNationId += 1;
  const nation = {
    id,
    name: safeName(name, `Nation ${id}`),
    color: color || colorForIndex(id),
    capitalId,
    ideology: ideology || choice(IDEOLOGIES),
    ambition: ambition ?? clamp(0.22 + rng() * 0.58, 0.12, 0.92),
    stability: stability ?? clamp(0.45 + rng() * 0.32, 0.18, 0.92),
    legitimacy: clamp(0.46 + rng() * 0.32, 0.2, 0.95),
    tech: clamp(0.36 + rng() * 0.4, 0.15, 0.96),
    treasury: treasury ?? 120 + rng() * 260,
    army: 0,
    manpower: 0,
    warExhaustion: 0,
    alive: true,
    overlordId: null,
    puppets: new Set(),
    allies: new Set(),
    rivals: new Set(),
    wars: new Map(),
    territories: [],
    population: 0,
    gdp: 0,
    power: 0,
    rating: 0,
    ratingGrade: "C",
    economicScore: 0,
    militaryScore: 0,
    stabilityScore: 0,
    diplomaticScore: 0,
    geopoliticalScore: 0,
    geoeconomicScore: 0,
    income: 0,
    expenses: 0,
    nameHistory: [],
    nameIdeas: [],
  };
  nation.nameHistory = [nation.name];
  state.nations.set(id, nation);
  return nation;
}

function colorForIndex(index) {
  const hue = (index * 137.508 + 31) % 360;
  const saturation = 54 + ((index * 19) % 22);
  const lightness = 45 + ((index * 23) % 14);
  return hslToHex(hue, saturation, lightness);
}

function hslToHex(hue, saturation, lightness) {
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x];
  return `#${[r1, g1, b1]
    .map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function shiftColor(hex, amount) {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = clamp(((value >> 16) & 255) + amount, 0, 255);
  const g = clamp(((value >> 8) & 255) + amount, 0, 255);
  const b = clamp((value & 255) + amount, 0, 255);
  return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
}

function updateTerritoryRulerName(territory) {
  const owner = state.nations.get(territory.ownerId);
  if (!owner) return;
  const conquered = territory.originalOwnerId != null && territory.ownerId !== territory.originalOwnerId;
  territory.name = conquered ? owner.name : territory.originalName;
  territory.longName = territory.name;
}

function recordTerritoryOwnerChange(territory, ownerId) {
  territory.ownerHistory = territory.ownerHistory || [];
  const lastOwner = territory.ownerHistory[territory.ownerHistory.length - 1];
  if (lastOwner !== ownerId) territory.ownerHistory.push(ownerId);
}

function claimTerritory(territoryId, nationId, { core = false, capital = false, quiet = false } = {}) {
  const territory = state.territories[territoryId];
  const previous = state.nations.get(territory.ownerId);
  territory.ownerHistory = territory.ownerHistory || [];
  if (!territory.originalOwnerId && territory.ownerId != null) territory.originalOwnerId = territory.ownerId;
  if (previous) {
    territory.previousOwnerId = previous.id;
    previous.territories = previous.territories.filter((id) => id !== territoryId);
  } else {
    territory.originalOwnerId = territory.originalOwnerId ?? nationId;
    if (!territory.originalName) territory.originalName = territory.name;
  }
  territory.ownerId = nationId;
  recordTerritoryOwnerChange(territory, nationId);
  if (core || territory.coreOwnerId == null) territory.coreOwnerId = nationId;
  territory.capital = Boolean(capital);
  territory.occupation = quiet ? 0 : clamp(territory.occupation + 0.38, 0, 1);
  territory.unrest = quiet ? territory.unrest : clamp(territory.unrest + 0.18, 0, 1);

  const nation = state.nations.get(nationId);
  if (nation && !nation.territories.includes(territoryId)) nation.territories.push(territoryId);
  if (capital && nation) nation.capitalId = territoryId;
  if (!territory.subdivisions?.length) ensureTerritorySubdivisions(territory, nationId);
  if (!quiet) transferSubdivisionControl(territory, nationId, territory.subdivisions.length);
  updateTerritoryRulerName(territory);
}

function initializeRelations() {
  for (const territory of state.territories) {
    for (const neighborId of territory.neighbors) {
      const neighbor = state.territories[neighborId];
      if (territory.ownerId === neighbor.ownerId) continue;
      const key = pairKey(territory.ownerId, neighbor.ownerId);
      if (state.relations.has(key)) continue;
      const a = state.nations.get(territory.ownerId);
      const b = state.nations.get(neighbor.ownerId);
      const ideologicalGap = Math.abs(a.ideology.aggression - b.ideology.aggression);
      const sameRegion = territory.region === neighbor.region ? 12 : 0;
      const sameContinent = territory.continent === neighbor.continent ? 6 : -6;
      setRelation(a.id, b.id, clamp(-18 + sameRegion + sameContinent - ideologicalGap * 20 + rng() * 44, -90, 90));
    }
  }
}

function getRelation(a, b) {
  if (a === b) return 100;
  return state.relations.get(pairKey(a, b)) ?? 0;
}

function setRelation(a, b, value) {
  if (!a || !b || a === b) return;
  state.relations.set(pairKey(a, b), clamp(value, -100, 100));
}

function adjustRelation(a, b, amount) {
  setRelation(a, b, getRelation(a, b) + amount);
}

function relativeLog(value, maxValue) {
  if (maxValue <= 0) return 0;
  return clamp(Math.log10(value + 1) / Math.log10(maxValue + 1), 0, 1);
}

function gradeForRating(rating) {
  if (rating >= 88) return "S";
  if (rating >= 76) return "A";
  if (rating >= 64) return "B";
  if (rating >= 52) return "C";
  if (rating >= 40) return "D";
  return "E";
}

function nationNameIdeas(nation) {
  const territoryIds = nation.territories?.length ? nation.territories : nation.controlledTerritories || [];
  const territories = territoryIds.map((id) => state.territories[id]).filter(Boolean);
  const dominant = territories.slice().sort((a, b) => b.gdp + b.population / 1_000_000 - (a.gdp + a.population / 1_000_000))[0];
  const baseIdeas = dominant?.alternateNames?.length ? dominant.alternateNames : countryNameBank(dominant?.originalName || nation.name);
  const behaviorIdeas = territories
    .slice(0, 4)
    .map((territory) => behaviorNameCandidate(territory.originalName, nation));
  return [...new Set([...baseIdeas, ...behaviorIdeas, ...UNIVERSAL_NAMES])];
}

function recalculateNationStats() {
  for (const nation of state.nations.values()) {
    nation.territories = [];
    nation.controlledTerritories = [];
    nation.controlledSubdivisions = 0;
    nation.population = 0;
    nation.gdp = 0;
    nation.power = 0;
    nation.alive = false;
  }

  const addShare = (nationId, territory, populationShare, gdpShare, officialOwner = false) => {
    const nation = state.nations.get(nationId);
    if (!nation) return;
    nation.alive = true;
    if (officialOwner && !nation.territories.includes(territory.id)) nation.territories.push(territory.id);
    if (!nation.controlledTerritories.includes(territory.id)) nation.controlledTerritories.push(territory.id);
    nation.population += territory.population * populationShare;
    nation.gdp += territory.gdp * gdpShare * territory.infrastructure * (1 - territory.unrest * 0.28);
  };

  for (const territory of state.territories) {
    const subdivisions = territory.subdivisions || [];
    const official = state.nations.get(territory.ownerId);
    const splitControl = subdivisions.length && subdivisions.some((subdivision) => subdivision.ownerId !== territory.ownerId);

    if (!subdivisions.length || !splitControl) {
      if (official) {
        addShare(territory.ownerId, territory, 1, 1, true);
        official.controlledSubdivisions += Math.max(1, subdivisions.length || 1);
      }
      continue;
    }

    if (official && !official.territories.includes(territory.id)) official.territories.push(territory.id);
    const shares = new Map();
    const fallbackShare = 1 / Math.max(1, subdivisions.length);
    for (const subdivision of subdivisions) {
      const ownerId = subdivision.ownerId ?? territory.ownerId;
      if (ownerId == null) continue;
      const data = shares.get(ownerId) || { populationShare: 0, gdpShare: 0, count: 0 };
      data.populationShare += subdivision.populationShare || fallbackShare;
      data.gdpShare += subdivision.gdpShare || fallbackShare;
      data.count += 1;
      shares.set(ownerId, data);
    }

    for (const [ownerId, data] of shares) {
      addShare(ownerId, territory, data.populationShare, data.gdpShare, ownerId === territory.ownerId);
      const controller = state.nations.get(ownerId);
      if (controller) controller.controlledSubdivisions += data.count;
    }
  }

  for (const nation of state.nations.values()) {
    if (!nation.controlledSubdivisions && !nation.controlledTerritories.length) {
      nation.alive = false;
      nation.army = Math.max(0, nation.army * 0.85);
      continue;
    }
    const capital = state.territories[nation.capitalId];
    const capitalControlled = capital?.subdivisions?.length
      ? subdivisionControlCount(capital, nation.id) > 0
      : capital?.ownerId === nation.id;
    if (!capitalControlled) {
      const holdings = (nation.territories.length ? nation.territories : nation.controlledTerritories)
        .slice()
        .filter((id) => state.territories[id]);
      nation.capitalId = holdings.sort((a, b) => state.territories[b].gdp - state.territories[a].gdp)[0] ?? nation.capitalId;
    }
    nation.nameIdeas = nationNameIdeas(nation);
  }

  const alive = [...state.nations.values()].filter((nation) => nation.alive && (nation.controlledSubdivisions || nation.controlledTerritories.length));
  const maxGdp = Math.max(1, ...alive.map((nation) => nation.gdp));
  const maxPopulation = Math.max(1, ...alive.map((nation) => nation.population));
  const maxArmy = Math.max(1, ...alive.map((nation) => nation.army));
  const maxTerritories = Math.max(1, ...alive.map((nation) => nation.controlledTerritories?.length || nation.territories.length));

  for (const nation of alive) {
    const treatyScore = clamp((nation.allies.size * 9 + nation.puppets.size * 7 - nation.rivals.size * 4) / 36, 0, 1);
    const budgetHealth = clamp((nation.income - nation.expenses + 40) / 100, 0, 1);
    const controlledCount = nation.controlledTerritories?.length || nation.territories.length;
    nation.economicScore = clamp(
      (relativeLog(nation.gdp, maxGdp) * 0.58 + budgetHealth * 0.22 + nation.tech * 0.2) * 100,
      0,
      100,
    );
    nation.militaryScore = clamp(
      (relativeLog(nation.army, maxArmy) * 0.56 + nation.tech * 0.2 + nation.ideology.conscription * 1.15 * 0.14 + (nation.wars.size ? 0.1 : 0)) * 100,
      0,
      100,
    );
    nation.stabilityScore = clamp(
      (nation.stability * 0.43 + nation.legitimacy * 0.34 + (1 - nation.warExhaustion) * 0.23) * 100,
      0,
      100,
    );
    nation.diplomaticScore = clamp((nation.ideology.diplomacy * 0.48 + treatyScore * 0.34 + (nation.overlordId ? 0.08 : 0.18)) * 100, 0, 100);
    nation.geopoliticalScore = clamp(
      (relativeLog(controlledCount, maxTerritories) * 0.42 + relativeLog(nation.population, maxPopulation) * 0.28 + nation.ambition * 0.16 + nation.stability * 0.14) * 100,
      0,
      100,
    );
    nation.geoeconomicScore = clamp(
      (relativeLog(nation.gdp, maxGdp) * 0.46 + relativeLog(nation.population, maxPopulation) * 0.18 + budgetHealth * 0.18 + nation.ideology.economy * 0.18) * 100,
      0,
      100,
    );
    nation.rating = clamp(
      nation.economicScore * 0.22 +
        nation.militaryScore * 0.2 +
        nation.stabilityScore * 0.2 +
        nation.diplomaticScore * 0.12 +
        nation.geopoliticalScore * 0.14 +
        nation.geoeconomicScore * 0.12,
      0,
      100,
    );
    nation.ratingGrade = gradeForRating(nation.rating);
    nation.power =
      nation.rating * 0.72 +
      nation.militaryScore * 0.28 +
      nation.economicScore * 0.2 +
      nation.geopoliticalScore * 0.16;
  }

  for (const nation of state.nations.values()) {
    nation.puppets = new Set([...nation.puppets].filter((id) => state.nations.get(id)?.alive));
    nation.allies = new Set([...nation.allies].filter((id) => state.nations.get(id)?.alive));
    nation.rivals = new Set([...nation.rivals].filter((id) => state.nations.get(id)?.alive));
    nation.wars = new Map(
      [...nation.wars].filter(([id]) => state.nations.get(id)?.alive && state.nations.get(id)?.wars.has(nation.id)),
    );
  }

  state.borderPairs = collectBorderPairs();
}

function collectBorderPairs() {
  const pairs = new Map();
  for (const territory of state.territories) {
    for (const neighborId of territory.neighbors) {
      const neighbor = state.territories[neighborId];
      if (territory.ownerId === neighbor.ownerId) continue;
      const key = pairKey(territory.ownerId, neighbor.ownerId);
      let pair = pairs.get(key);
      if (!pair) {
        pair = { a: territory.ownerId, b: neighbor.ownerId, fronts: [] };
        pairs.set(key, pair);
      }
      pair.fronts.push([territory.id, neighborId]);
    }
  }
  return pairs;
}

function startLoop() {
  if (state.tickHandle) window.clearInterval(state.tickHandle);
  const interval = clamp(1300 / state.speed, 70, 1400);
  state.tickHandle = window.setInterval(() => {
    if (state.running) advanceTime(state.timeStepHours);
  }, interval);
}

function advanceMonth() {
  advanceTime(HOURS_PER_MONTH);
}

function advanceTime(hours = state.timeStepHours, { forceRender = false } = {}) {
  const stepHours = Math.max(1, Number(hours) || 1);
  state.elapsedHours += stepHours;
  syncCalendarFromHours();
  const monthScale = stepHours / HOURS_PER_MONTH;

  recalculateNationStats();
  updateEconomy(monthScale);
  updateDomesticPolitics(monthScale);
  updateDiplomacy(monthScale);
  tryPeacefulUnifications(monthScale);
  evolveNationNames(monthScale);
  processWars(monthScale);
  reconcileSubdivisionOwnership();
  decayInactiveFronts(monthScale);
  processRevolts(monthScale);
  recalculateNationStats();
  cleanupDefeatedNations();
  captureHistory();
  renderAfterSimulationStep({ forceRender });
}

function simulationDate() {
  return new Date(Date.UTC(EPOCH_YEAR, 0, 1, 0, 0, 0) + state.elapsedHours * 60 * 60 * 1000);
}

function syncCalendarFromHours() {
  const date = simulationDate();
  state.year = date.getUTCFullYear();
  state.month = date.getUTCMonth();
  state.day = date.getUTCDate();
  state.hour = date.getUTCHours();
}

function updateEconomy(monthScale = 1) {
  const volatility = Math.sqrt(Math.max(monthScale, 1 / 720));
  for (const territory of state.territories) {
    const owner = state.nations.get(territory.ownerId);
    if (!owner?.alive) continue;
    const atWar = owner.wars.size > 0;
    const tradeAccess = territory.neighbors.reduce((sum, id) => {
      const neighborOwner = state.nations.get(state.territories[id].ownerId);
      if (!neighborOwner || neighborOwner.id === owner.id) return sum + 0.12;
      if (owner.allies.has(neighborOwner.id)) return sum + 0.22;
      if (owner.wars.has(neighborOwner.id)) return sum - 0.28;
      return sum + clamp((getRelation(owner.id, neighborOwner.id) + 40) / 520, -0.08, 0.16);
    }, 0);
    const hostileNeighborCount = territory.neighbors.reduce((sum, id) => sum + (owner.wars.has(state.territories[id]?.ownerId) ? 1 : 0), 0);
    const tradeBonus = clamp(tradeAccess / Math.max(1, territory.neighbors.length) - (atWar ? 0.04 + hostileNeighborCount * 0.018 : 0), -0.26, 0.2);
    const debtDrag = owner.treasury < -150 ? 0.004 : 0;
    const ideologyGrowth = owner.ideology.economy * 0.006;
    const warTradePenalty = atWar ? clamp(0.009 + owner.wars.size * 0.004 + owner.warExhaustion * 0.01 + hostileNeighborCount * 0.003, 0, 0.045) : 0;
    const peaceBonus = atWar ? -0.01 - owner.warExhaustion * 0.004 : 0.004;
    const instabilityDrag = territory.unrest * 0.01 + owner.warExhaustion * (atWar ? 0.006 : 0.002) + territory.occupation * 0.004 + warTradePenalty + debtDrag;
    const growth = clamp(
      (ideologyGrowth + peaceBonus + tradeBonus * 0.012 - instabilityDrag) * monthScale + (rng() - 0.48) * 0.004 * volatility,
      -0.018 * Math.max(monthScale, 0.08),
      0.018 * Math.max(monthScale, 0.08),
    );
    territory.gdp = Math.max(24, territory.gdp * (1 + growth));
    territory.population = Math.max(
      50_000,
      territory.population *
        (1 +
          clamp(
            (0.0005 + rng() * 0.0018 - territory.unrest * 0.0016) * monthScale,
            -0.003 * Math.max(monthScale, 0.08),
            0.004 * Math.max(monthScale, 0.08),
          )),
    );
    territory.infrastructure = clamp(
      territory.infrastructure +
        ((owner.treasury > 0 ? 0.0025 : -0.003) - territory.occupation * 0.004) * monthScale,
      0.22,
      1.62,
    );
    territory.occupation = clamp(territory.occupation - 0.018 * monthScale, 0, 1);
    const pressure = owner.stability < 0.42 ? 0.013 : -0.005;
    territory.unrest = clamp(
      territory.unrest +
        (pressure + owner.warExhaustion * 0.002 - owner.legitimacy * 0.004) * monthScale +
        (rng() - 0.52) * 0.01 * volatility,
      0,
      1,
    );
  }

  recalculateNationStats();

  for (const nation of liveNations()) {
    const tax = clamp(nation.ideology.tax + (nation.stability < 0.34 ? 0.03 : 0) + (nation.treasury < -250 ? 0.025 : 0), 0.08, 0.42);
    const income = nation.gdp * tax * 0.000085;
    const puppetTribute = nation.overlordId && state.nations.get(nation.overlordId)?.alive ? income * 0.1 : 0;
    const maintenance = nation.army * (0.18 + nation.tech * 0.05 + nation.wars.size * 0.05);
    const investment = Math.max(0, Math.min(income * 0.18, nation.treasury * 0.08));
    nation.income = income - puppetTribute;
    nation.expenses = maintenance + investment;
    nation.treasury += (nation.income - nation.expenses) * monthScale;
    if (puppetTribute) state.nations.get(nation.overlordId).treasury += puppetTribute * monthScale;

    const recruits =
      (nation.population / 1_000_000) *
      nation.ideology.conscription *
      (0.015 + nation.stability * 0.012) *
      (nation.wars.size ? 1.45 : 0.75);
    nation.army = Math.max(0, nation.army + recruits * monthScale - nation.army * 0.005 * monthScale);

    if (nation.treasury < -250) {
      nation.stability = clamp(nation.stability - 0.012 * monthScale, 0.04, 1);
      nation.legitimacy = clamp(nation.legitimacy - 0.01 * monthScale, 0.03, 1);
      nation.ambition = clamp(nation.ambition + 0.004 * monthScale, 0.08, 1);
    } else if (nation.treasury > 400 && !nation.wars.size) {
      nation.stability = clamp(nation.stability + 0.0035 * monthScale, 0.04, 1);
      nation.legitimacy = clamp(nation.legitimacy + 0.002 * monthScale, 0.03, 1);
      nation.tech = clamp(nation.tech + 0.0015 * monthScale, 0.08, 1);
    }

    if (nation.overlordId && rng() < scaledChance(0.015, monthScale)) {
      const overlord = state.nations.get(nation.overlordId);
      if (overlord?.alive && getRelation(nation.id, overlord.id) < -42 && nation.stability > 0.48) {
        nation.overlordId = null;
        overlord.puppets.delete(nation.id);
        startWar(nation.id, overlord.id, "puppet revolt");
        pushEvent("revolt", `${nation.name} breaks puppet rule and rises against ${overlord.name}.`);
      }
    }

    nation.warExhaustion = clamp(
      nation.warExhaustion + (nation.wars.size * 0.035 - (nation.wars.size ? 0 : 0.018)) * monthScale,
      0,
      1,
    );
  }
}

function ideologyByName(name) {
  return IDEOLOGIES.find((ideology) => ideology.name === name) || IDEOLOGIES[0];
}

function ideologyShiftCandidate(nation) {
  if (nation.warExhaustion > 0.68 || nation.wars.size >= 2) return ideologyByName("Military");
  if (nation.stability < 0.32 && nation.legitimacy < 0.42) return ideologyByName("Revolutionary");
  if (nation.treasury < -300 && nation.unrestAverage > 0.48) return ideologyByName("Autocratic");
  if (nation.treasury > 520 && nation.income > nation.expenses * 1.35) return ideologyByName("Mercantile");
  if (nation.allies.size >= 3 && nation.stability > 0.58) return ideologyByName("Council");
  if (nation.stability > 0.7 && nation.legitimacy > 0.62 && nation.warExhaustion < 0.2) return ideologyByName("Federal");
  return null;
}

function updateDomesticPolitics(monthScale = 1) {
  for (const nation of liveNations()) {
    const territories = nation.territories.map((id) => state.territories[id]).filter(Boolean);
    nation.unrestAverage = territories.length
      ? territories.reduce((sum, territory) => sum + territory.unrest, 0) / territories.length
      : 0;

    const candidate = ideologyShiftCandidate(nation);
    if (!candidate || candidate.name === nation.ideology.name) continue;
    const pressure =
      Math.abs(candidate.aggression - nation.ideology.aggression) * 0.018 +
      nation.unrestAverage * 0.025 +
      (nation.treasury < -250 ? 0.025 : 0) +
      (nation.warExhaustion > 0.55 ? 0.02 : 0) +
      (nation.treasury > 500 ? 0.012 : 0);
    if (rng() > scaledChance(pressure, monthScale)) continue;

    const previous = nation.ideology.name;
    nation.ideology = candidate;
    nation.stability = clamp(nation.stability - 0.045 + candidate.stability * 0.04, 0.04, 1);
    nation.legitimacy = clamp(nation.legitimacy + (candidate.name === "Federal" || candidate.name === "Council" ? 0.04 : -0.025), 0.03, 1);
    nation.ambition = clamp(nation.ambition + (candidate.aggression - 0.45) * 0.04, 0.08, 1);
    pushEvent("diplomacy", `${nation.name} shifts from ${previous} politics toward ${candidate.name} rule.`);
  }
}

function updateDiplomacy(monthScale = 1) {
  const pairs = [...state.borderPairs.values()];
  for (const pair of pairs) {
    const a = state.nations.get(pair.a);
    const b = state.nations.get(pair.b);
    if (!a?.alive || !b?.alive || a.id === b.id) continue;
    const relation = getRelation(a.id, b.id);
    const borderFriction = (a.ambition + b.ambition) * 1.15 + pair.fronts.length * 0.04;
    const puppetTie = a.overlordId === b.id || b.overlordId === a.id ? 1.5 : 0;
    const allyTie = a.allies.has(b.id) ? 0.9 : 0;
    const geoEco = geoeconomicPressure(a, b, pair);
    const drift =
      (-borderFriction + puppetTie + allyTie - geoEco * 8) * monthScale +
      (rng() - 0.46) * 3.2 * Math.sqrt(Math.max(monthScale, 1 / 720));
    adjustRelation(a.id, b.id, drift);

    if (a.wars.has(b.id)) continue;
    if (a.allies.has(b.id) && relation < 10 && rng() < scaledChance(0.1, monthScale)) {
      breakAlliance(a.id, b.id, "relations collapsed");
      continue;
    }

    if (
      !a.allies.has(b.id) &&
      relation > 68 &&
      a.allies.size < 4 &&
      b.allies.size < 4 &&
      rng() < scaledChance(0.035, monthScale)
    ) {
      makeAlliance(a.id, b.id);
      continue;
    }

    // require worse relations to trigger a war and use a slightly lower base desire
    if (relation < -62 && rng() < scaledChance(warDesire(a, b, pair), monthScale)) {
      const attacker = attackScore(a, b) > attackScore(b, a) ? a : b;
      const defender = attacker.id === a.id ? b : a;
      startWar(attacker.id, defender.id, "border crisis");
    }
  }

  for (const nation of liveNations()) {
    // reduce frequency of opportunistic rival selection
    if (!nation.wars.size && rng() < scaledChance(0.007, monthScale)) {
      const rivals = [...state.borderPairs.values()]
        .map((pair) => {
          if (pair.a === nation.id) return state.nations.get(pair.b);
          if (pair.b === nation.id) return state.nations.get(pair.a);
          return null;
        })
        .filter((item) => item?.alive && !nation.allies.has(item.id));
      const rival = rivals.sort((a, b) => getRelation(nation.id, a.id) - getRelation(nation.id, b.id))[0];
      if (rival && getRelation(nation.id, rival.id) < -32) nation.rivals.add(rival.id);
    }
  }
}

function renameNation(nation, nextName, reason) {
  const cleaned = safeName(nextName, nation.name);
  if (!cleaned || cleaned === nation.name) return;
  const previous = nation.name;
  nation.name = cleaned;
  if (!nation.nameHistory?.length) nation.nameHistory = [previous];
  if (nation.nameHistory[nation.nameHistory.length - 1] !== cleaned) {
    nation.nameHistory.push(cleaned);
  }
  for (const territoryId of nation.territories) {
    const territory = state.territories[territoryId];
    if (territory) updateTerritoryRulerName(territory);
  }
  nation.lastNameChangeAt = worldMonthIndex();
  pushEvent("diplomacy", `${previous} is now known as ${cleaned} after ${reason}.`);
}

function behaviorSuffix(nation) {
  return choice(namesForBehavior(nation));
}

function historicNameCandidate(nation) {
  const territory = nation.territories
    .map((id) => state.territories[id])
    .sort((a, b) => b.gdp - a.gdp)[0];
  if (!territory) return null;
  const ideas = territory.alternateNames?.length ? territory.alternateNames : nation.nameIdeas || [];
  const behavior = behaviorProfile(nation);
  const filtered = ideas.filter((name) => {
    const lowered = name.toLowerCase();
    if (behavior === "military") return /command|war|defense|marshal|shield|dominion/.test(lowered);
    if (behavior === "mercantile") return /trade|prosperity|compact|free ports|exchange|mercantile/.test(lowered);
    if (behavior === "crisis") return /restoration|emergency|provisional|salvation|reconstruction/.test(lowered);
    if (behavior === "revolutionary") return /people|commune|assembly|liberation|popular|free/.test(lowered);
    if (behavior === "council") return /council|accord|league|covenant|concord/.test(lowered);
    return /republic|commonwealth|federation|constitutional|kingdom/.test(lowered);
  });
  const pool = filtered.length ? filtered : territory.alternateNames?.length ? territory.alternateNames : ideas;
  return pool.length ? choice(pool) : behaviorNameCandidate(territory.originalName, nation);
}

function creativeNameCandidate(nation) {
  const capital = state.territories[nation.capitalId];
  const behavior = behaviorProfile(nation);
  const universal = UNIVERSAL_NAMES.filter((name) => {
    const lowered = name.toLowerCase();
    if (behavior === "military") return /directorate|compact/.test(lowered);
    if (behavior === "mercantile") return /compact|accord/.test(lowered);
    if (behavior === "crisis") return /directorate|union/.test(lowered);
    if (behavior === "council") return /accord|commonwealth/.test(lowered);
    return /union|commonwealth|accord/.test(lowered);
  });
  if (rng() < 0.42 && universal.length) return choice(universal);
  const anchor = capital?.originalName || nation.name.split(" ")[0] || "Union";
  return behaviorNameCandidate(anchor, nation);
}

function geoeconomicPressure(a, b, pair) {
  const combinedGdp = a.gdp + b.gdp;
  if (!combinedGdp) return 0;
  const gdpGap = Math.abs(a.gdp - b.gdp) / combinedGdp;
  const borderWeight = Math.min(1, pair.fronts.length / 14);
  const tradeStress = clamp((a.treasury < -120 ? 0.18 : 0) + (b.treasury < -120 ? 0.12 : 0), 0, 0.3);
  return gdpGap * 0.14 + borderWeight * 0.08 + tradeStress;
}

function evolveNationNames(monthScale = 1) {
  for (const nation of liveNations()) {
    const instability = clamp((0.5 - nation.stability) * 0.02, 0, 0.018);
    const pressure = clamp((nation.wars.size ? 0.003 : 0) + nation.warExhaustion * 0.01 + instability, 0, 0.028);
    const prosperity = nation.treasury > 550 ? 0.004 : 0;
    const geopoliticalShock = nation.territories.length > 10 && nation.ambition > 0.65 ? 0.003 : 0;
    // Make renames rarer and avoid frequent churn
    if (nation.lastNameChangeAt && worldMonthIndex() - nation.lastNameChangeAt < 48) continue;
    const renameChance = scaledChance(0.0009 + pressure + prosperity + geopoliticalShock, monthScale);
    if (rng() > renameChance) continue;
    const useHistoric = rng() < 0.55 + (nation.warExhaustion > 0.55 ? 0.2 : 0);
    const candidate = useHistoric ? historicNameCandidate(nation) : creativeNameCandidate(nation);
    if (!candidate || candidate === nation.name) continue;
    // Prevent whimsical creative renames for stable, prosperous nations
    if (!useHistoric) {
      const territories = nation.territories.map((id) => state.territories[id]).filter(Boolean);
      const unrestAverage = territories.length ? territories.reduce((s, t) => s + t.unrest, 0) / territories.length : 0;
      if (nation.stability > 0.62 && unrestAverage < 0.32 && nation.treasury > -120) continue;
    }
    renameNation(nation, candidate, useHistoric ? "a historical revival" : "a political realignment");
  }
}

function warDesire(a, b, pair) {
  const relation = getRelation(a.id, b.id);
  const strengthGap = Math.abs(a.power - b.power) / Math.max(1, a.power + b.power);
  const allianceCount = [...b.allies].filter((id) => state.nations.get(id)?.alive).length;
  const allianceRisk = allianceCount * 0.02;
  const aggression = (a.ideology.aggression + b.ideology.aggression + a.ambition + b.ambition) / 4;
  const geoEco = geoeconomicPressure(a, b, pair);
  const relationPenalty = Math.max(0, -relation - 62);
  const isIslandWar = pair.fronts.some(([leftId, rightId]) =>
    state.territories[leftId]?.maritimeNeighbors?.includes(rightId) || state.territories[rightId]?.maritimeNeighbors?.includes(leftId),
  );
  const islandBonus = isIslandWar ? 0.014 : 0;  return clamp(
    0.006 +
      aggression * 0.035 +
      strengthGap * 0.02 +
      Math.min(pair.fronts.length, 6) * 0.0006 -
      allianceRisk * 0.9 +
      geoEco * 0.55 +
      relationPenalty * 0.0005 +
      islandBonus,
    0,
    0.12,
  );
}

function attackScore(attacker, defender) {
  const treasuryEffect = attacker.treasury < -100 ? 0.82 : 1.04;
  const exhaustion = 1 - attacker.warExhaustion * 0.36;
  const allyHelp = [...attacker.allies].reduce((sum, id) => {
    const ally = state.nations.get(id);
    return sum + (ally?.wars.has(defender.id) ? ally.power * 0.12 : 0);
  }, 0);
  return (attacker.army * 2.3 + attacker.power * 0.55 + allyHelp) * treasuryEffect * exhaustion;
}

function makeAlliance(aId, bId) {
  const a = state.nations.get(aId);
  const b = state.nations.get(bId);
  if (!a?.alive || !b?.alive) return;
  a.allies.add(bId);
  b.allies.add(aId);
  adjustRelation(aId, bId, 18);
  state.fillCacheDirty = true;
  pushEvent("diplomacy", `${a.name} and ${b.name} sign an alliance.`);
}

function breakAlliance(aId, bId, reason) {
  const a = state.nations.get(aId);
  const b = state.nations.get(bId);
  if (!a || !b) return;
  a.allies.delete(bId);
  b.allies.delete(aId);
  state.fillCacheDirty = true;
  pushEvent("diplomacy", `${a.name} and ${b.name} end their alliance after ${reason}.`);
}

function closestTerritoryPairBetweenNations(a, b) {
  let best = null;
  for (const aId of a.controlledTerritories?.length ? a.controlledTerritories : a.territories) {
    const left = state.territories[aId];
    if (!left) continue;
    for (const bId of b.controlledTerritories?.length ? b.controlledTerritories : b.territories) {
      const right = state.territories[bId];
      if (!right) continue;
      const distance = haversine(left.geoCentroid, right.geoCentroid);
      const neighborBonus = left.neighbors.includes(right.id) ? 0.55 : 1;
      const score = distance * neighborBonus;
      if (!best || score < best.score) best = { left, right, score, distance };
    }
  }
  return best;
}

function ensureWarBorderPair(attacker, defender) {
  const key = pairKey(attacker.id, defender.id);
  const existing = state.borderPairs.get(key);
  if (existing?.fronts?.length) return existing;
  const best = closestTerritoryPairBetweenNations(attacker, defender);
  const pair = existing || { a: attacker.id, b: defender.id, fronts: [] };
  if (best) pair.fronts = [[best.left.id, best.right.id]];
  state.borderPairs.set(key, pair);
  return pair;
}

function startWar(attackerId, defenderId, reason) {
  if (attackerId === defenderId) return false;
  const attacker = state.nations.get(attackerId);
  const defender = state.nations.get(defenderId);
  if (!attacker?.alive || !defender?.alive || attacker.wars.has(defenderId)) return false;
  if (attacker.overlordId === defenderId || defender.overlordId === attackerId) {
    if (reason !== "puppet revolt") return false;
  }

  attacker.allies.delete(defenderId);
  defender.allies.delete(attackerId);
  attacker.rivals.add(defenderId);
  defender.rivals.add(attackerId);
  const warState = {
    started: worldMonthIndex(),
    reason,
    [`${attackerId}Territories`]: Math.max(1, attacker.territories.length),
    [`${defenderId}Territories`]: Math.max(1, defender.territories.length),
    [`${attackerId}Subdivisions`]: Math.max(1, totalSubdivisionControlCount(attackerId)),
    [`${defenderId}Subdivisions`]: Math.max(1, totalSubdivisionControlCount(defenderId)),
  };
  attacker.wars.set(defenderId, { ...warState });
  defender.wars.set(attackerId, { ...warState });
  adjustRelation(attackerId, defenderId, -34);
  ensureWarBorderPair(attacker, defender);
  seedWarFronts(attacker, defender);

  for (const allyId of attacker.allies) {
    const ally = state.nations.get(allyId);
    if (ally?.alive && getRelation(ally.id, defenderId) < 36 && rng() < 0.22) {
      const allyWarState = {
        started: worldMonthIndex(),
        reason: "allied intervention",
        [`${ally.id}Territories`]: Math.max(1, ally.territories.length),
        [`${defender.id}Territories`]: Math.max(1, defender.territories.length),
        [`${ally.id}Subdivisions`]: Math.max(1, totalSubdivisionControlCount(ally.id)),
        [`${defender.id}Subdivisions`]: Math.max(1, totalSubdivisionControlCount(defender.id)),
      };
      ally.wars.set(defenderId, { ...allyWarState });
      defender.wars.set(ally.id, { ...allyWarState });
      ensureWarBorderPair(ally, defender);
      seedWarFronts(ally, defender);
      // territory visuals may change as allied wars seed fronts
      state.fillCacheDirty = true;
    }
  }

  pushEvent("war", `${attacker.name} declares war on ${defender.name} over ${reason}.`);
  state.fillCacheDirty = true;
  return true;
}

function seedWarFronts(attacker, defender) {
  const pair = state.borderPairs.get(pairKey(attacker.id, defender.id));
  if (!pair?.fronts.length) {
    // Handle island wars or distant wars: seed on capital or random territory
    const targetTerritory = state.territories[defender.capitalId] || choice(defender.territories.map(id => state.territories[id]));
    if (!targetTerritory || !targetTerritory.subdivisions?.length) return;
    const fromTerritory = state.territories[attacker.capitalId] || choice(attacker.territories.map(id => state.territories[id]));
    // Pick a random subdivision to attack
    const bestIdx = Math.floor(rng() * targetTerritory.subdivisions.length);
    const subdiv = targetTerritory.subdivisions[bestIdx];
    if (subdiv.contestedById) return; // already contested
    subdiv.contestedById = attacker.id;
    subdiv.contestedFromTerritoryId = fromTerritory.id;
    subdiv.contestedProgress = 0.03 + rng() * 0.03;
    subdiv.contestedUpdatedAt = worldMonthIndex();
    updateTerritoryContestStatus(targetTerritory);
    if (rng() < 0.12) transferSubdivision(targetTerritory.id, bestIdx, attacker.id, { reason: "naval invasion", event: `${attacker.name} launches naval invasion on ${subdiv.name}.`, quiet: true });
    return;
  }
  for (const [leftId, rightId] of pair.fronts.slice(0, 8)) {
    const left = state.territories[leftId];
    const right = state.territories[rightId];
    let target = null;
    let from = null;
    if (left.ownerId === attacker.id && right.ownerId === defender.id) {
      from = left;
      target = right;
    } else if (right.ownerId === attacker.id && left.ownerId === defender.id) {
      from = right;
      target = left;
    }
    if (!target || !target.subdivisions?.length) continue;
    // determine border point: prefer actual shared border segment midpoint
    let bp = [(left.centroid[0] + right.centroid[0]) / 2, (left.centroid[1] + right.centroid[1]) / 2];
    try {
      const segments = sharedBorderSegments(left, right);
      if (segments && segments.length) {
        let bestMid = null;
        let bestSegDist = Infinity;
        const ref = from?.centroid || left.centroid;
        for (const seg of segments) {
          const mid = [(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2];
          const dx = mid[0] - ref[0];
          const dy = mid[1] - ref[1];
          const d2 = dx * dx + dy * dy;
          if (d2 < bestSegDist) {
            bestSegDist = d2;
            bestMid = mid;
          }
        }
        if (bestMid) bp = bestMid;
      }
    } catch (e) {
      /* fall back to centroid midpoint on error */
    }
    // pick subdivision nearest to the border point that is not already controlled by attacker
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < target.subdivisions.length; i += 1) {
      const s = target.subdivisions[i];
      const c = s.centroidProjected || target.centroid;
      const dx = c[0] - bp[0];
      const dy = c[1] - bp[1];
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist && s.ownerId !== attacker.id) {
        bestDist = d2;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) continue;
    const subdiv = target.subdivisions[bestIdx];
    if (subdiv.contestedById) continue;
    subdiv.contestedById = attacker.id;
    subdiv.contestedFromTerritoryId = from.id;
    subdiv.contestedProgress = 0.03 + rng() * 0.03;
    subdiv.contestedUpdatedAt = worldMonthIndex();
    updateTerritoryContestStatus(target);
    // Don't immediately flip subdivisions on seeding; make it less automatic
    if (rng() < 0.12) transferSubdivision(target.id, bestIdx, attacker.id, { reason: "captured", event: `${attacker.name} seizes ${subdiv.name}.`, quiet: true });
  }
}

function endWar(aId, bId, message = null) {
  const a = state.nations.get(aId);
  const b = state.nations.get(bId);
  // capture war metadata before tearing down war links
  const warMetaA = a?.wars.get(bId) ?? null;
  const warMetaB = b?.wars.get(aId) ?? null;
  const warStart = (warMetaA?.started ?? warMetaB?.started) ?? null;

  // If this is a negotiated peace/ceasefire, finalize any subdivision transfers
  const isPeaceMessage = typeof message === "string" && /peace|ceasefire|tired peace|accept/i.test(message);
  if (warStart != null && isPeaceMessage) {
    for (const territory of state.territories) {
      if (!territory.subdivisions?.length) continue;
      for (const s of territory.subdivisions) {
        if (!s.lastTransferAt) continue;
        // If subdivision was transferred during the war, mark it permanent
        if (s.lastTransferAt >= warStart) {
          s.permanentFromPeace = true;
          s.finalizedAt = worldMonthIndex();
        }
      }
    }
    // ensure border segment cache updates to show final annexations
    state.segmentMapDirty = true;
    state.fillCacheDirty = true;
  }

  if (a) a.wars.delete(bId);
  if (b) b.wars.delete(aId);
  state.fillCacheDirty = true;
  if (message) pushEvent("diplomacy", message);
}

function processWars(monthScale = 1) {
  const wars = uniqueWars();
  for (const [aId, bId] of wars) {
    const a = state.nations.get(aId);
    const b = state.nations.get(bId);
    if (!a?.alive || !b?.alive) {
      endWar(aId, bId);
      continue;
    }

    const pair = state.borderPairs.get(pairKey(aId, bId));
    const duration = worldMonthIndex() - (a.wars.get(bId)?.started ?? worldMonthIndex());
    const isIslandWar = !pair || !pair.fronts.length;
    if (isIslandWar) {
      // For island wars, don't end quickly; instead, resolve naval battles
      const tempo = Math.max(monthScale, 1 / 120);
      if (monthScale >= 1 || rng() < scaledChance(0.5, tempo)) {
        // Simulate naval battle: pick random territories
        const aTerr = choice(a.territories.map(id => state.territories[id]));
        const bTerr = choice(b.territories.map(id => state.territories[id]));
        if (aTerr && bTerr) {
          // Simple naval attack: damage economy or something
          const damage = 0.01 * tempo;
          b.treasury = Math.max(b.treasury - damage * b.gdp, b.treasury * 0.9);
          a.warExhaustion = Math.min(a.warExhaustion + 0.02 * tempo, 1);
          b.warExhaustion = Math.min(b.warExhaustion + 0.02 * tempo, 1);
          if (rng() < 0.1 * tempo) {
            // Occasional "victory": transfer a territory
            const targetTerr = bTerr;
            if (targetTerr.subdivisions?.length) {
              const idx = Math.floor(rng() * targetTerr.subdivisions.length);
              transferSubdivision(targetTerr.id, idx, a.id, { reason: "naval conquest", event: `${a.name} conquers ${targetTerr.subdivisions[idx].name} via naval invasion.` });
            }
          }
        }
      }
      // End island war after longer time or by chance
      if (duration > 12 || rng() < scaledChance(0.1, monthScale)) {
        endWar(aId, bId, `${a.name} and ${b.name} end their naval war.`);
      }
      continue;
    }

    const tempo = Math.max(monthScale, 1 / 120);
    // slightly reduce simultaneous battles to save CPU and make wars less explosive
    const battles = Math.min(2, Math.max(1, Math.ceil(Math.floor(pair.fronts.length / 3) * Math.sqrt(tempo))));
    for (let i = 0; i < battles; i += 1) {
      if (monthScale >= 1 || rng() < scaledChance(0.82, tempo)) {
        resolveBattle(a, b, pair, monthScale);
      }
    }

    maybeResolveWar(a, b, duration, monthScale);
  }
  // unit movement/skirmish system removed
}

function uniqueWars() {
  const wars = [];
  const seen = new Set();
  for (const nation of liveNations()) {
    for (const enemyId of nation.wars.keys()) {
      const key = pairKey(nation.id, enemyId);
      if (seen.has(key)) continue;
      seen.add(key);
      wars.push([nation.id, enemyId]);
    }
  }
  return wars;
}

function resolveBattle(a, b, pair, monthScale = 1) {
  const aScore = attackScore(a, b) * (0.75 + rng() * 0.5);
  const bScore = attackScore(b, a) * (0.75 + rng() * 0.5);
  const attacker = aScore >= bScore ? a : b;
  const defender = attacker.id === a.id ? b : a;
  const fronts = pair.fronts
    .map(([left, right]) => {
      const t1 = state.territories[left];
      const t2 = state.territories[right];
      if (t1.ownerId === attacker.id && t2.ownerId === defender.id) return { from: t1, target: t2 };
      if (t2.ownerId === attacker.id && t1.ownerId === defender.id) return { from: t2, target: t1 };
      return null;
    })
    .filter(Boolean);

  if (!fronts.length) return;
  const front = choice(fronts);
  // pick a target subdivision near the border (prefer actual shared segment midpoint)
  let bp = front.target.centroid;
  if (front.from && front.target) {
    bp = [(front.from.centroid[0] + front.target.centroid[0]) / 2, (front.from.centroid[1] + front.target.centroid[1]) / 2];
    try {
      const segments = sharedBorderSegments(front.from, front.target);
      if (segments && segments.length) {
        let bestMid = null;
        let bestSegDist = Infinity;
        for (const seg of segments) {
          const mid = [(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2];
          const dx = mid[0] - front.from.centroid[0];
          const dy = mid[1] - front.from.centroid[1];
          const d2 = dx * dx + dy * dy;
          if (d2 < bestSegDist) {
            bestSegDist = d2;
            bestMid = mid;
          }
        }
        if (bestMid) bp = bestMid;
      }
    } catch (e) {
      /* fallback to centroid midpoint */
    }
  }
  const targetTerritory = front.target;
  if (!targetTerritory || !targetTerritory.subdivisions?.length) return;
  let bestIdx = -1;
  let bestDist = Infinity;
  for (let i = 0; i < targetTerritory.subdivisions.length; i += 1) {
    const s = targetTerritory.subdivisions[i];
    const c = s.centroidProjected || targetTerritory.centroid;
    const dx = c[0] - bp[0];
    const dy = c[1] - bp[1];
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDist && s.ownerId !== attacker.id) {
      bestDist = d2;
      bestIdx = i;
    }
  }
  if (bestIdx === -1) return;
  const subdiv = targetTerritory.subdivisions[bestIdx];
  const terrainDefense = targetTerritory.fortification * 0.42 + targetTerritory.infrastructure * 0.08;
  // Momentum calculation: reflect the relative combat power (armies, tech, allies)
  const baseAttackerScore = attackScore(attacker, defender);
  const baseDefenderScore = attackScore(defender, attacker);
  const momentum = baseAttackerScore / Math.max(1, baseDefenderScore);
  // Power imbalance: larger gaps increase success chance and casualty asymmetry
  const powerGap = Math.max(0, Math.log(Math.max(momentum, 0.1)));
  // Success chance: sensitive to momentum, terrain, tech, and exhaustion
  const successChance = clamp(
    0.32 + powerGap * 0.32 + attacker.tech * 0.12 - terrainDefense * 0.5 - attacker.warExhaustion * 0.08 - defender.legitimacy * 0.05,
    0.04,
    0.96,
  );

  const scale = 0.25 + rng() * 0.5;
  // Realistic casualty scaling: power gap makes stronger army suffer less, weaker army more
  // Base casualty rate increases with power gaps
  const momentumFactor = clamp(Math.sqrt(Math.abs(Math.log(momentum)) + 1), 0.5, 2.2);
  const defenderWeariness = 1 + (defender.warExhaustion + (1 - defender.stability)) * 0.25;
  const attackerAdvantage = Math.max(0.6, Math.min(2, momentum * 0.8));
  // Attacker casualties increase if defender has advantage; decrease if attacker dominates
  const attCas = Math.max(0.04, (defender.army * 0.016 * scale * momentumFactor) / attackerAdvantage);
  // Defender casualties are much higher when attacker has superior force
  const defCas = Math.max(0.12, attacker.army * 0.018 * scale * momentumFactor * defenderWeariness);
  attacker.army = Math.max(0, attacker.army - attCas);
  defender.army = Math.max(0, defender.army - defCas);

  // attempt to advance pressure on the specific subdivision
  if (rng() < successChance) {
    const captured = advanceSubdivisionPressure(targetTerritory, bestIdx, attacker, defender, successChance, monthScale);
    if (captured) {
      attacker.legitimacy = clamp(attacker.legitimacy + 0.008, 0, 1);
      defender.legitimacy = clamp(defender.legitimacy - 0.016, 0, 1);
      // Successful advances give morale boost to next battle
      attacker.warExhaustion = clamp(attacker.warExhaustion - 0.008, 0, 1);
    }
  } else if (rng() < 0.08) {
    // Retreat scenario: defender holds ground but fortification weakens attacker confidence
    reduceSubdivisionPressure(targetTerritory, bestIdx, attacker.id, monthScale);
    targetTerritory.fortification = clamp(targetTerritory.fortification - 0.02, 0, 1);
    // Defender gains small morale boost on successful defense
    defender.warExhaustion = clamp(defender.warExhaustion + 0.004, 0, 1);
  }
}

function advanceFrontPressure(front, attacker, defender, successChance, monthScale) {
  const target = front.target;
  const tempo = Math.sqrt(Math.max(monthScale, 1 / 120));
  if (target.contestedById !== attacker.id) {
    target.contestedProgress = target.contestedProgress > 0 ? target.contestedProgress * 0.35 : 0.04;
    target.contestedById = attacker.id;
  }
  target.contestedFromId = front.from.id;
  target.contestedUpdatedAt = worldMonthIndex();
  const defenseDrag = target.fortification * 0.08 + target.infrastructure * 0.03;
  // Slow down pressure growth to make advances more deliberate
  const delta = Math.max(0.008, (0.14 + successChance * 0.18 - defenseDrag) * tempo);
  target.contestedProgress = clamp(target.contestedProgress + delta, 0, 1.15);

  if (target.subdivisions?.length) {
    // Make province captures depend more on sustained pressure
    const provinceChance = clamp(0.12 + Math.pow(target.contestedProgress, 1.25) * 0.45 + successChance * 0.18, 0.06, 0.6);
    if (rng() < provinceChance) {
      const batch = monthScale >= 1 ? 2 : 1;
      transferSubdivisionControl(target, attacker.id, batch);
    }
  }

  const controlRatio = subdivisionControlRatio(target, attacker.id);
  const requiredControl = target.subdivisions?.length <= 2 ? 1 : 0.78;
  const canFlipCountry = target.contestedProgress >= 0.96 && controlRatio >= requiredControl;
  if (canFlipCountry) {
    transferTerritory(target.id, attacker.id, {
      reason: "captured",
      event: `${attacker.name} captures ${target.originalName} from ${defender.name}.`,
    });
    return true;
  }
  return false;
}

function advanceSubdivisionPressure(territory, subdivisionIndex, attacker, defender, successChance, monthScale) {
  const subdiv = territory.subdivisions?.[subdivisionIndex];
  if (!subdiv) return false;
  const tempo = Math.sqrt(Math.max(monthScale, 1 / 120));
  if (subdiv.contestedById !== attacker.id) {
    subdiv.contestedProgress = subdiv.contestedProgress > 0 ? subdiv.contestedProgress * 0.35 : 0.04;
    subdiv.contestedById = attacker.id;
  }
  subdiv.contestedFromTerritoryId = subdiv.contestedFromTerritoryId || null;
  subdiv.contestedUpdatedAt = worldMonthIndex();
  const defenseDrag = territory.fortification * 0.08 + territory.infrastructure * 0.03;
  const delta = Math.max(0.006, (0.12 + successChance * 0.16 - defenseDrag) * tempo);
  subdiv.contestedProgress = clamp(subdiv.contestedProgress + delta, 0, 1.15);

  // chance to flip this specific subdivision depends on sustained pressure
  const subdivChance = clamp(0.12 + Math.pow(subdiv.contestedProgress, 1.25) * 0.5 + successChance * 0.16, 0.06, 0.85);
  if (rng() < subdivChance) {
    const flipped = transferSubdivision(territory.id, subdivisionIndex, attacker.id, { reason: "captured", event: `${attacker.name} captures ${subdiv.name} from ${defender.name}.`, quiet: true });
    if (flipped) {
      updateTerritoryContestStatus(territory);
      // check for territory flip
      const controlRatio = subdivisionControlRatio(territory, attacker.id);
      const requiredControl = territory.subdivisions?.length <= 2 ? 1 : 0.78;
      if (subdiv.contestedProgress >= 0.96 && controlRatio >= requiredControl) {
        transferTerritory(territory.id, attacker.id, {
          reason: "captured",
          event: `${attacker.name} captures ${territory.originalName} from ${defender.name}.`,
        });
        return true;
      }
    }
  }
  updateTerritoryContestStatus(territory);
  return false;
}

function reduceSubdivisionPressure(territory, subdivisionIndex, attackerId, monthScale) {
  const subdiv = territory.subdivisions?.[subdivisionIndex];
  if (!subdiv) return;
  if (subdiv.contestedById !== attackerId) return;
  const owner = state.nations.get(territory.ownerId);
  if (owner?.id != null && territory.subdivisions?.length && rng() < 0.45) {
    // occasionally recover one subdivision for owner
    // prefer subdivisions nearest center
    const idxs = territory.subdivisions.map((_, i) => i).sort((a, b) => Math.abs(a - subdivisionIndex) - Math.abs(b - subdivisionIndex));
    for (const idx of idxs) {
      const s = territory.subdivisions[idx];
      if (s.ownerId !== owner.id) {
        transferSubdivision(territory.id, idx, owner.id, { reason: "recapture", quiet: true });
        break;
      }
    }
  }
  const tempo = Math.sqrt(Math.max(monthScale, 1 / 120));
  subdiv.contestedProgress = clamp(subdiv.contestedProgress - (0.06 + territory.fortification * 0.04) * tempo, 0, 1);
  subdiv.contestedUpdatedAt = worldMonthIndex();
  if (subdiv.contestedProgress <= 0.01) {
    subdiv.contestedById = null;
    subdiv.contestedFromTerritoryId = null;
    subdiv.contestedProgress = 0;
  }
  updateTerritoryContestStatus(territory);
}

function reduceFrontPressure(territory, attackerId, monthScale) {
  if (territory.contestedById !== attackerId) return;
  const owner = state.nations.get(territory.ownerId);
  if (owner?.id != null && territory.subdivisions?.length && rng() < 0.45) {
    // Prefer recapturing subdivisions that are not finalized by a peace treaty
    const candidates = territory.subdivisions
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => s.ownerId !== owner.id && !s.permanentFromPeace);
    if (candidates.length) {
      const sel = choice(candidates);
      transferSubdivision(territory.id, sel.idx, owner.id, { reason: "recaptured", quiet: true });
    } else {
      // fallback: recapture any available subdivision
      transferSubdivisionControl(territory, owner.id, 1, null, "recaptured");
    }
  }
  const tempo = Math.sqrt(Math.max(monthScale, 1 / 120));
  territory.contestedProgress = clamp(territory.contestedProgress - (0.06 + territory.fortification * 0.05) * tempo, 0, 1);
  territory.contestedUpdatedAt = worldMonthIndex();
  if (territory.contestedProgress <= 0.01) {
    territory.contestedById = null;
    territory.contestedFromId = null;
    territory.contestedProgress = 0;
  }
}

// Unit system removed: military unit logic deleted.

function transferTerritory(territoryId, toNationId, { reason = "annexed", event = null, quiet = false } = {}) {
  const territory = state.territories[territoryId];
  const fromNation = state.nations.get(territory.ownerId);
  const toNation = state.nations.get(toNationId);
  if (!territory || !toNation || territory.ownerId === toNationId) return;
  territory.originalOwnerId = territory.originalOwnerId ?? territory.ownerId ?? toNationId;
  territory.previousOwnerId = territory.ownerId;
  territory.ownerId = toNationId;
  recordTerritoryOwnerChange(territory, toNationId);
  territory.capital = territory.id === toNation.capitalId;
  territory.occupation = clamp(territory.occupation + 0.48, 0, 1);
  territory.contestedById = null;
  territory.contestedFromId = null;
  territory.contestedProgress = 0;
  territory.contestedUpdatedAt = worldMonthIndex();
  territory.captureFlash = 1;
  territory.unrest = clamp(territory.unrest + (reason === "liberated" ? -0.08 : 0.2), 0, 1);
  territory.infrastructure = clamp(territory.infrastructure - (reason === "captured" ? 0.04 : 0.015), 0.22, 1.62);
  if (!territory.subdivisions?.length) ensureTerritorySubdivisions(territory, territory.previousOwnerId ?? toNationId);
  transferSubdivisionControl(territory, toNationId, territory.subdivisions.length);
  toNation.territories.push(territoryId);
  if (fromNation) fromNation.territories = fromNation.territories.filter((id) => id !== territoryId);
  updateTerritoryRulerName(territory);

  if (!quiet && event) pushEvent(reason === "captured" ? "war" : "diplomacy", event);
  // changing territory ownership affects segment ownership mapping
  state.segmentMapDirty = true;
  state.fillCacheDirty = true;
}

function dominantSubdivisionOwner(territory) {
  if (!territory?.subdivisions?.length) return territory?.ownerId != null ? { ownerId: territory.ownerId, ratio: 1, count: 1 } : null;
  const totals = new Map();
  for (const subdivision of territory.subdivisions) {
    const ownerId = subdivision.ownerId ?? territory.ownerId;
    if (ownerId == null) continue;
    const current = totals.get(ownerId) || { count: 0, weight: 0 };
    current.count += 1;
    current.weight += subdivision.populationShare || 1 / territory.subdivisions.length;
    totals.set(ownerId, current);
  }
  let best = null;
  for (const [ownerId, data] of totals) {
    if (!best || data.weight > best.weight || (data.weight === best.weight && data.count > best.count)) {
      best = { ownerId, count: data.count, weight: data.weight };
    }
  }
  if (!best) return null;
  return { ownerId: best.ownerId, count: best.count, ratio: clamp(best.weight, 0, 1) };
}

function reconcileSubdivisionOwnership() {
  for (const territory of state.territories) {
    if (!territory.subdivisions?.length || territory.ownerId == null) continue;
    const dominant = dominantSubdivisionOwner(territory);
    if (!dominant || dominant.ownerId === territory.ownerId) continue;
    const currentHeld = subdivisionControlCount(territory, territory.ownerId);
    const required = territory.subdivisions.length <= 2 ? 1 : 0.76;
    const completeLoss = currentHeld === 0;
    const sustainedBreakthrough = dominant.ratio >= required && (territory.contestedProgress >= 0.82 || territory.contestedById === dominant.ownerId);
    if (!completeLoss && !sustainedBreakthrough) continue;
    const previous = state.nations.get(territory.ownerId);
    const controller = state.nations.get(dominant.ownerId);
    if (!controller?.alive) continue;
    transferTerritory(territory.id, dominant.ownerId, {
      reason: "captured",
      quiet: true,
    });
    if (previous?.alive) pushEvent("war", `${controller.name} secures full control of ${territory.originalName} from ${previous.name}.`);
  }
}

function maybeResolveWar(a, b, duration, monthScale = 1) {
  recalculateNationStats();
  const weaker = a.power < b.power ? a : b;
  const stronger = weaker.id === a.id ? b : a;
  const weakerCapital = state.territories[weaker.capitalId];
  const capitalLost = !weakerCapital || subdivisionControlCount(weakerCapital, weaker.id) === 0 || weakerCapital.ownerId !== weaker.id;
  const warMeta = weaker.wars.get(stronger.id) || stronger.wars.get(weaker.id) || {};
  const originalWeakerTerritories = Math.max(1, warMeta[`${weaker.id}Territories`] || weaker.territories.length || weaker.controlledTerritories?.length || 1);
  const originalWeakerSubdivisions = Math.max(1, warMeta[`${weaker.id}Subdivisions`] || totalSubdivisionControlCount(weaker.id) || originalWeakerTerritories);
  const territoryLostShare = clamp((originalWeakerTerritories - weaker.territories.length) / originalWeakerTerritories, 0, 1);
  const subdivisionLostShare = clamp((originalWeakerSubdivisions - totalSubdivisionControlCount(weaker.id)) / originalWeakerSubdivisions, 0, 1);
  const occupiedShare = Math.max(territoryLostShare, subdivisionLostShare);
  const powerRatio = stronger.power / Math.max(1, weaker.power);
  const armyRatio = stronger.army / Math.max(0.5, weaker.army);
  const seriousOccupation = occupiedShare >= 0.28 || (capitalLost && occupiedShare >= 0.12);
  const weakEnoughToSubmit = powerRatio > 2.15 && (armyRatio > 1.6 || weaker.warExhaustion > 0.58) && occupiedShare >= 0.18;
  const collapseRisk =
    (seriousOccupation && powerRatio > 1.65 ? 0.18 : 0) +
    (weakEnoughToSubmit ? 0.16 : 0) +
    (capitalLost ? 0.18 : 0) +
    (weaker.warExhaustion > 0.72 ? 0.14 : 0) +
    (occupiedShare > 0.5 ? 0.2 : 0);

  if (duration > 0.6 && (seriousOccupation || weakEnoughToSubmit) && rng() < scaledChance(collapseRisk, monthScale)) {
    const annexPreference = clamp(
      0.22 + stronger.ideology.aggression * 0.58 + stronger.ambition * 0.2 - stronger.ideology.diplomacy * 0.24 + (stronger.ideology.name === "Military" ? 0.12 : 0),
      0.08,
      0.92,
    );
    const shouldAnnex =
      occupiedShare > 0.72 ||
      (capitalLost && occupiedShare > 0.34) ||
      (weakEnoughToSubmit && rng() < annexPreference) ||
      rng() < annexPreference * 0.55;
    if (shouldAnnex) {
      const territories = [...new Set([...(weaker.territories || []), ...(weaker.controlledTerritories || [])])];
      for (const territoryId of territories) {
        transferTerritory(territoryId, stronger.id, { quiet: true });
      }
      endWar(a.id, b.id, `${weaker.name} collapses and is annexed by ${stronger.name}.`);
    } else {
      makePuppet(weaker.id, stronger.id);
      endWar(a.id, b.id, `${weaker.name} submits to ${stronger.name} as a puppet after losing ${Math.round(occupiedShare * 100)}% of its subdivisions.`);
    }
    return;
  }

  if (duration > 18 && rng() < scaledChance(0.08 + (a.warExhaustion + b.warExhaustion) * 0.08, monthScale)) {
    a.warExhaustion = clamp(a.warExhaustion - 0.12, 0, 1);
    b.warExhaustion = clamp(b.warExhaustion - 0.12, 0, 1);
    endWar(a.id, b.id, `${a.name} and ${b.name} sign a tired peace.`);
  }
}

function decayInactiveFronts(monthScale = 1) {
  const tempo = Math.sqrt(Math.max(monthScale, 1 / 720));
  for (const territory of state.territories) {
    territory.captureFlash = clamp((territory.captureFlash || 0) - 0.22 * tempo, 0, 1);
    if (!territory.subdivisions?.length) continue;
    let changed = false;
    for (const subdiv of territory.subdivisions) {
      if (!subdiv.contestedById) continue;
      const attacker = state.nations.get(subdiv.contestedById);
      const owner = state.nations.get(territory.ownerId);
      const active = attacker?.alive && owner?.alive && attacker.id !== owner.id && attacker.wars.has(owner.id);
      if (active) continue;
      subdiv.contestedProgress = clamp(subdiv.contestedProgress - 0.12 * tempo, 0, 1);
      subdiv.contestedUpdatedAt = worldMonthIndex();
      if (subdiv.contestedProgress <= 0.01) {
        subdiv.contestedById = null;
        subdiv.contestedFromTerritoryId = null;
        subdiv.contestedProgress = 0;
      }
      changed = true;
    }
    if (changed) updateTerritoryContestStatus(territory);
  }
}

function makePuppet(subjectId, overlordId) {
  const subject = state.nations.get(subjectId);
  const overlord = state.nations.get(overlordId);
  if (!subject?.alive || !overlord?.alive || subject.id === overlord.id) return;
  if (subject.overlordId) state.nations.get(subject.overlordId)?.puppets.delete(subject.id);
  subject.overlordId = overlord.id;
  overlord.puppets.add(subject.id);
  subject.warExhaustion = clamp(subject.warExhaustion - 0.18, 0, 1);
  subject.legitimacy = clamp(subject.legitimacy - 0.1, 0, 1);
  setRelation(subject.id, overlord.id, -8);
  state.fillCacheDirty = true;
}

function processRevolts(monthScale = 1) {
  // Civil revolts: require high unrest plus clear owner weakness or occupation.
  const candidates = state.territories.filter((territory) => {
    const owner = state.nations.get(territory.ownerId);
    if (!owner?.alive) return false;
    if (owner.territories.length <= 1) return false;
    // require significant unrest
    if (territory.unrest < 0.62) return false;
    // simple cooldown: don't allow repeated revolts in same territory within ~6 months
    if (territory.lastRevoltAt && worldMonthIndex() - territory.lastRevoltAt < 6) return false;
    // if owner looks strong and legitimate, skip
    if (owner.stability > 0.6 && owner.legitimacy > 0.65 && owner.treasury > -100 && owner.warExhaustion < 0.3 && territory.occupation < 0.08)
      return false;
    return true;
  });

  for (const territory of candidates) {
    const owner = state.nations.get(territory.ownerId);
    // Check for nearby military presence: nearby armies suppress revolts
    const militaryPresence = checkNearbyMilitaryPresence(territory, owner.id, 3);
    const unrestFactor = Math.pow(Math.max(0, (territory.unrest - 0.6) / 0.4), 2);
    const financialStress = owner.treasury < 0 ? clamp(-owner.treasury / 600, 0, 1) : 0;
    const ownerWeakness = (1 - owner.stability) * 0.5 + owner.warExhaustion * 0.35 + financialStress * 0.25 + territory.occupation * 0.4;
    // Historical/core territory suppresses revolts (harder to rebel in heartland)
    const coreBonus = territory.originalOwnerId === owner.id ? 0.3 : 0;
    let chance = 0.006 + unrestFactor * 0.06 + ownerWeakness * 0.045 - owner.legitimacy * 0.02 - militaryPresence * 0.15 - coreBonus;
    chance = clamp(chance, 0.002, 0.18);
    if (rng() > scaledChance(chance, monthScale)) continue;

    // create a localized rebel nation
    const ideology = choice([IDEOLOGIES[0], IDEOLOGIES[3], IDEOLOGIES[5], owner.ideology]);
    const rebel = createNation({
      name: `${territory.name} ${choice(["Free State", "Commune", "Restoration", "Front"])}`,
      capitalId: territory.id,
      ideology,
      color: shiftColor(owner.color, 44),
      ambition: 0.38 + rng() * 0.42,
      stability: 0.34 + rng() * 0.3,
      treasury: 50 + rng() * 180,
    });

    transferTerritory(territory.id, rebel.id, { reason: "liberated", quiet: true });
    territory.capital = true;
    territory.coreOwnerId = rebel.id;
    territory.unrest = clamp(territory.unrest - 0.22, 0.2, 0.86);
    territory.lastRevoltAt = worldMonthIndex();

    // neighboring spread: cascade effect if neighbors are already unstable and nearby enemy military presence is weak
    for (const neighborId of territory.neighbors) {
      const neighbor = state.territories[neighborId];
      if (neighbor.ownerId === owner.id && neighbor.unrest > 0.68) {
        const neighborMilitary = checkNearbyMilitaryPresence(neighbor, owner.id, 2);
        if (rng() < (0.28 - neighborMilitary * 0.25)) {
          transferTerritory(neighbor.id, rebel.id, { reason: "liberated", quiet: true });
        }
      }
    }

    startWar(rebel.id, owner.id, "civil revolt");
    pushEvent("revolt", `${rebel.name} erupts from unrest inside ${owner.name}.`);
  }

  // Subdivision-level revolts: local insurgencies. Make them rarer and sensitive to local unrest and population share.
  for (const territory of state.territories) {
    if (!territory.subdivisions?.length) continue;
    const owner = state.nations.get(territory.ownerId);
    if (!owner?.alive) continue;
    const territoryMilitary = checkNearbyMilitaryPresence(territory, owner.id, 2);
    for (let i = 0; i < territory.subdivisions.length; i += 1) {
      const s = territory.subdivisions[i];
      // cooldown to avoid churn
      if (s.lastRevoltAt && worldMonthIndex() - s.lastRevoltAt < 6) continue;
      const popShare = s.populationShare ?? 1 / territory.subdivisions.length;
      // require at least modest local share and moderate territory unrest
      if (popShare < 0.035 || territory.unrest < 0.5) continue;
      const subdivUnrest = territory.unrest * (0.5 + 0.8 * popShare);

      // skip if owner is relatively stable/legitimate
      if (owner.stability > 0.62 && owner.legitimacy > 0.66 && owner.warExhaustion < 0.4 && territory.occupation < 0.08) continue;

      const severity = Math.pow(Math.max(0, (subdivUnrest - 0.45) / 0.55), 2);
      const financialStress = owner.treasury < 0 ? clamp(-owner.treasury / 600, 0, 1) : 0;
      const ownerWeakness = (1 - owner.stability) * 0.4 + owner.warExhaustion * 0.25 + financialStress * 0.2 + territory.occupation * 0.3;
      // Core/historical suppression of revolts
      const coreBonus = s.originalOwnerId === owner.id ? 0.15 : 0;
      let chance = 0.003 + severity * 0.05 + ownerWeakness * 0.03 - owner.legitimacy * 0.015 - territoryMilitary * 0.08 - coreBonus;
      chance = clamp(chance, 0.001, 0.12);
      if (rng() > scaledChance(chance, monthScale)) continue;

      const ideology = choice([IDEOLOGIES[0], IDEOLOGIES[3], IDEOLOGIES[5], owner.ideology]);
      const rebel = createNation({
        name: `${s.name || territory.name} ${choice(["Liberation Front", "Rebels", "Insurgents", "Autonomy Movement"])}`,
        capitalId: territory.id,
        ideology,
        color: shiftColor(owner.color, 32),
        ambition: 0.28 + rng() * 0.46,
        stability: 0.26 + rng() * 0.38,
        treasury: 30 + rng() * 100,
      });

      transferSubdivision(territory.id, i, rebel.id, { reason: "liberated", quiet: true });
      s.lastRevoltAt = worldMonthIndex();
      startWar(rebel.id, owner.id, "subdivision revolt");
      pushEvent("revolt", `${rebel.name} rises in ${s.name || territory.name}.`);

      // Smart spread: only spread if unrest is contagious and owner is weak
      if (rng() < (0.12 - territoryMilitary * 0.08) && owner.warExhaustion > 0.4) {
        for (const nid of territory.neighbors) {
          const neighbor = state.territories[nid];
          if (!neighbor?.subdivisions?.length) continue;
          if (neighbor.ownerId !== owner.id) continue;
          // Spread only if neighbor is also unstable
          if (neighbor.unrest > 0.52) {
            const idx = Math.floor(rng() * neighbor.subdivisions.length);
            transferSubdivision(neighbor.id, idx, rebel.id, { reason: "liberated", quiet: true });
          }
        }
      }
    }
  }
}

function checkNearbyMilitaryPresence(territory, ownerId, checkDistance = 3) {
  // Check for nearby friendly armies that suppress revolts
  // checkDistance: how many territory-hops away to check
  let totalFriendlyArmy = 0;
  let territoriesChecked = 0;
  const visited = new Set([territory.id]);
  const queue = [[territory.id, 0]];

  while (queue.length && territoriesChecked < 12) {
    const [tid, dist] = queue.shift();
    const t = state.territories[tid];
    if (!t) continue;
    territoriesChecked += 1;

    // Add friendly armies in this territory
    if (t.ownerId === ownerId) {
      const distanceFactor = 1 / Math.max(1, dist);
      totalFriendlyArmy += (state.nations.get(ownerId)?.army || 0) * distanceFactor * 0.25;
    }

    // Expand search to neighbors within distance
    if (dist < checkDistance) {
      for (const neighborId of t.neighbors || []) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push([neighborId, dist + 1]);
        }
      }
    }
  }

  // Normalize to a 0-1 presence factor; higher armies = higher presence
  return clamp(totalFriendlyArmy / 250, 0, 1);
}

function dominantReligionForNationState(nation) {
  const counts = new Map();
  const territoryIds = nation.controlledTerritories?.length ? nation.controlledTerritories : nation.territories;
  for (const id of territoryIds || []) {
    const territory = state.territories[id];
    if (!territory?.religion) continue;
    counts.set(territory.religion, (counts.get(territory.religion) || 0) + (territory.population || 1));
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "Secular";
}

function ideologySimilarityScore(a, b) {
  const aggression = 1 - Math.abs(a.ideology.aggression - b.ideology.aggression);
  const economy = 1 - Math.abs(a.ideology.economy - b.ideology.economy);
  const diplomacy = 1 - Math.abs(a.ideology.diplomacy - b.ideology.diplomacy);
  return clamp((aggression * 0.44 + economy * 0.28 + diplomacy * 0.28), 0, 1);
}

function geographicProximityScore(a, b) {
  if (state.borderPairs.has(pairKey(a.id, b.id))) return 1;
  const best = closestTerritoryPairBetweenNations(a, b);
  if (!best) return 0;
  return clamp(1 - best.distance / 2600, 0, 1);
}

function culturalCompatibilityScore(a, b) {
  const religionA = dominantReligionForNationState(a);
  const religionB = dominantReligionForNationState(b);
  if (religionA === religionB) return 1;
  if (religionA === "Secular" || religionB === "Secular") return 0.45;
  return 0.12;
}

function tryPeacefulUnifications(monthScale = 1) {
  const nations = liveNations();
  for (let i = 0; i < nations.length; i += 1) {
    for (let j = i + 1; j < nations.length; j += 1) {
      const a = nations[i];
      const b = nations[j];
      if (!a?.alive || !b?.alive || a.id === b.id) continue;
      if (a.wars.has(b.id) || b.wars.has(a.id)) continue;
      if (a.overlordId === b.id || b.overlordId === a.id) continue;
      const relation = getRelation(a.id, b.id);
      if (relation < 72) continue;
      const combinedAmbition = (a.ambition + b.ambition) / 2;
      const powerRatio = Math.max(a.power / Math.max(1, b.power), b.power / Math.max(1, a.power));
      
      const religionBonus = culturalCompatibilityScore(a, b) * 0.018;
      const ideologyBonus = ideologySimilarityScore(a, b) * 0.014;
      const proximityBonus = geographicProximityScore(a, b) * 0.018;
      
      const base = 0.006;
      const chance = base + clamp((relation - 72) / 240, 0, 0.06) - combinedAmbition * 0.01 + (powerRatio > 2 ? 0.02 : 0) + religionBonus + ideologyBonus + proximityBonus;      if (rng() < scaledChance(chance, monthScale)) {
        const absorber = a.power >= b.power ? a : b;
        const absorbed = absorber.id === a.id ? b : a;
        for (const tid of absorbed.territories.slice()) {
          transferTerritory(tid, absorber.id, { reason: "unification", quiet: true });
        }
        absorbed.alive = false;
        pushEvent("diplomacy", `${absorbed.name} peacefully unites with ${absorber.name}.`);
        recalculateNationStats();
      }
    }
  }
}

function cleanupDefeatedNations() {
  reconcileSubdivisionOwnership();
  for (const nation of state.nations.values()) {
    if (totalSubdivisionControlCount(nation.id) > 0) continue;
    if (nation.alive) pushEvent("diplomacy", `${nation.name} leaves the world stage.`);
    nation.alive = false;
    for (const other of state.nations.values()) {
      other.wars.delete(nation.id);
      other.allies.delete(nation.id);
      other.rivals.delete(nation.id);
      other.puppets.delete(nation.id);
      if (other.overlordId === nation.id) other.overlordId = null;
    }
  }
}

function liveNations() {
  return [...state.nations.values()].filter((nation) => nation.alive && (nation.territories.length || totalSubdivisionControlCount(nation.id) > 0));
}

function worldMonthIndex() {
  return state.elapsedHours / HOURS_PER_MONTH;
}

function currentDateLabel() {
  const day = String(state.day).padStart(2, "0");
  const hour = String(state.hour).padStart(2, "0");
  return `${MONTHS[state.month]} ${day}, ${state.year} ${hour}:00`;
}

function captureHistory() {
  const minGap = Math.max(HOURS_PER_DAY, state.timeStepHours);
  if (state.lastHistoryHours != null && state.elapsedHours - state.lastHistoryHours < minGap) return;
  const alive = liveNations();
  const wars = uniqueWars().length;
  const worldGdp = alive.reduce((sum, nation) => sum + nation.gdp, 0);
  state.history.push({
    date: currentDateLabel(),
    nations: alive.length,
    wars,
    gdp: worldGdp,
  });
  state.lastHistoryHours = state.elapsedHours;
  if (state.history.length > 180) state.history.shift();
}

function pushEvent(type, text) {
  state.eventLog.unshift({
    type,
    text,
    date: currentDateLabel(),
  });
  if (state.eventLog.length > 120) state.eventLog.pop();
  state.eventLinkCache = null;
  renderEventLog();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width));
  canvas.height = Math.max(320, Math.floor(rect.height));
  renderMap();
}

function renderPanels() {
  renderSelection();
  renderStats();
  renderLeaderboard();
  renderCountryGraphs();
  renderHistory();
  syncControls();
}

function renderAll() {
  renderMap();
  renderPanels();
  state.lastPanelRenderAt = performance.now();
  state.lastLeaderboardRenderAt = state.lastPanelRenderAt;
}

function renderAfterSimulationStep({ forceRender = false } = {}) {
  if (forceRender || !state.running) {
    renderAll();
    return;
  }

  const isDataDrivenMap = DATA_DRIVEN_MAP_MODES.has(state.mapMode);
  if (isDataDrivenMap) state.fillCacheDirty = true;
  if (isDataDrivenMap || state.fillCacheDirty || state.segmentMapDirty) renderMap();

  const now = performance.now();
  if (now - state.lastPanelRenderAt >= 250) {
    renderSelection();
    renderStats();
    renderHistory();
    syncControls();
    state.lastPanelRenderAt = now;
  }
  if (now - state.lastLeaderboardRenderAt >= 1000) {
    renderLeaderboard();
    renderCountryGraphs();
    state.lastLeaderboardRenderAt = now;
  }
}

function startVisualLoop() {
  if (state.animationHandle) window.cancelAnimationFrame(state.animationHandle);
  const frame = (time) => {
    state.animationTime = time / 1000;
    // Calculate FPS
    state.fpsCounter++;
    if (time - state.lastFpsTime >= 1000) {
      state.fps = state.fpsCounter;
      state.fpsCounter = 0;
      state.lastFpsTime = time;
    }
    if (time - state.lastMapAnimation > 120 && hasActiveFrontVisuals()) {
      state.lastMapAnimation = time;
      renderMap();
    }
    state.animationHandle = window.requestAnimationFrame(frame);
  };
  state.animationHandle = window.requestAnimationFrame(frame);
}

function hasActiveFrontVisuals() {
  return (
    uniqueWars().length > 0 ||
    state.territories.some((territory) =>
      territory.captureFlash > 0.01 ||
      (territory.subdivisions && territory.subdivisions.some((s) => s.contestedById && s.contestedProgress > 0.01)),
    )
  );
}

function projectionForCanvas() {
  const width = canvas.width;
  const height = canvas.height;
  const bounds = state.worldBounds;
  const worldWidth = bounds.maxX - bounds.minX;
  const worldHeight = bounds.maxY - bounds.minY;
  const scale = Math.min(width / worldWidth, height / worldHeight) * 0.9;
  const baseX = (width - worldWidth * scale) / 2;
  const baseY = (height - worldHeight * scale) / 2;
  return { width, height, bounds, scale, baseX, baseY };
}

function projectToScreen(point) {
  const p = state.projection || projectionForCanvas();
  const baseX = (point[0] - p.bounds.minX) * p.scale + p.baseX;
  const baseY = (point[1] - p.bounds.minY) * p.scale + p.baseY;
  return [
    (baseX - p.width / 2) * state.view.zoom + p.width / 2 + state.view.panX,
    (baseY - p.height / 2) * state.view.zoom + p.height / 2 + state.view.panY,
  ];
}

function clearScreenPathCaches() {
  for (const territory of state.territories) {
    territory.path = null;
    territory.screenBounds = null;
    for (const subdivision of territory.subdivisions || []) subdivision.path = null;
  }
  state.borderPathCache = null;
  state.ownerBoundaryCache.clear();
}

function renderMap() {
  if (!state.territories.length || !canvas.width || !canvas.height) return;
  state.projection = projectionForCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Cache static background (ocean + graticule) per projection to avoid redrawing heavy static layers
  const projectionKey = `${state.view.zoom}|${state.view.panX}|${state.view.panY}|${state.projection.scale}|${state.projection.baseX}|${state.projection.baseY}|${canvas.width}|${canvas.height}`;
  const rebuildPaths = state.lastProjectionKey !== projectionKey;
  if (rebuildPaths) {
    clearScreenPathCaches();
    try {
      const bg = document.createElement("canvas");
      bg.width = canvas.width;
      bg.height = canvas.height;
      const bgCtx = bg.getContext("2d", { alpha: false });
      drawOcean(bgCtx, bg);
      drawGraticule(bgCtx, bg);
      state.bgCanvas = bg;
    } catch (e) {
      state.bgCanvas = null;
    }
    state.lastProjectionKey = projectionKey;
  }
  if (state.bgCanvas) ctx.drawImage(state.bgCanvas, 0, 0);

  const mode = state.mapMode;
  const territories = state.territories;
  // Cache global aggregates once per render to avoid repeated allocations
  if (mode === "population" || mode === "economy") {
    let maxPop = 1;
    let maxGdp = 1;
    for (const t of territories) {
      if (mode === "population" && t && Number.isFinite(t.population)) maxPop = Math.max(maxPop, t.population);
      if (mode === "economy" && t && Number.isFinite(t.gdp)) maxGdp = Math.max(maxGdp, t.gdp);
    }
    if (mode === "population") state.cachedMaxPopulation = maxPop;
    if (mode === "economy") state.cachedMaxGdp = maxGdp;
  }
  // Avoid rebuilding territory path geometry every frame - only when projection/view changes
  // `rebuildPaths` set above when background was rebuilt
  const offscreenMargin = 96;
  if (rebuildPaths) {
    for (const territory of territories) {
      const bounds = screenBoundsForTerritory(territory, true);
      // skip heavy geometry for territories well off-screen
      if (
        bounds.maxX < -offscreenMargin ||
        bounds.minX > canvas.width + offscreenMargin ||
        bounds.maxY < -offscreenMargin ||
        bounds.minY > canvas.height + offscreenMargin
      ) {
        // cache screen bounds for culling
        territory.screenBounds = bounds;
        continue;
      }
      const path = buildPath(territory);
      territory.path = path;
      territory.screenBounds = bounds;
    }
  } else {
    for (const territory of territories) {
      if (!territory.path) territory.path = buildPath(territory);
    }
  }

  // Cache subdivision screen-space Path2D objects when projection/view changes
  if (rebuildPaths) {
    for (const territory of territories) {
      const bounds = territory.screenBounds || screenBoundsForTerritory(territory, true);
      // cache screen bounds for reuse
      territory.screenBounds = bounds;
      const projectedCenter = territory.centroid || [0, 0];
      const centerScreen = projectToScreen(projectedCenter);
      const radius = Math.max(bounds.width, bounds.height) * 0.7;
      // skip subdivision path building for off-screen territories
      if (
        bounds.maxX < -offscreenMargin ||
        bounds.minX > canvas.width + offscreenMargin ||
        bounds.maxY < -offscreenMargin ||
        bounds.minY > canvas.height + offscreenMargin
      ) {
        continue;
      }
      for (let i = 0; i < (territory.subdivisions || []).length; i += 1) {
        const s = territory.subdivisions[i];
        if (!s) continue;
        if (s.projectedRings && s.projectedRings.length) {
          const path = new Path2D();
          for (const ring of s.projectedRings) {
            for (let j = 0; j < ring.length; j += 1) {
              const [x, y] = projectToScreen(ring[j]);
              if (j === 0) path.moveTo(x, y);
              else path.lineTo(x, y);
            }
            path.closePath();
          }
          s.path = path;
        } else {
          // fallback wedge geometry cached in screen-space
          const n = territory.subdivisions.length || 1;
          const start = s.sliceStart ?? (i / n) * Math.PI * 2;
          const end = s.sliceEnd ?? ((i + 1) / n) * Math.PI * 2;
          const steps = Math.max(4, Math.ceil((end - start) / (Math.PI * 2) * 8));
          const path = new Path2D();
          path.moveTo(centerScreen[0], centerScreen[1]);
          for (let t = 0; t <= steps; t += 1) {
            const ang = lerp(start, end, t / Math.max(1, steps));
            const x = centerScreen[0] + Math.cos(ang) * radius * 0.9;
            const y = centerScreen[1] + Math.sin(ang) * radius * 0.9;
            path.lineTo(x, y);
          }
          path.closePath();
          s.path = path;
        }
      }
    }

    // Update segment ownership map and cache segment screen positions when projection changes
    const segmentMap = currentSegmentOwnerMap();
    if (rebuildPaths && segmentMap) {
      for (const entry of segmentMap.values()) {
        const seg = entry.segment;
        if (seg && seg.a && seg.b) {
          seg.screenA = projectToScreen(seg.a);
          seg.screenB = projectToScreen(seg.b);
        }
      }
    }
  }

  // Draw territory fills; use an offscreen cached layer per `mode` when possible
  const margin = 48; // pixels
  let didUseFillCache = false;
  if (
    state.fillCache &&
    state.fillCache.mode === mode &&
    !state.fillCacheDirty &&
    !rebuildPaths &&
    state.fillCache.canvas &&
    state.fillCache.canvas.width === canvas.width &&
    state.fillCache.canvas.height === canvas.height
  ) {
    try {
      ctx.drawImage(state.fillCache.canvas, 0, 0);
      didUseFillCache = true;
    } catch (e) {
      state.fillCache = null;
      didUseFillCache = false;
    }
  }

  if (!state.fillCache || state.fillCache.mode !== mode || state.fillCacheDirty || rebuildPaths) {
    try {
      const fc = document.createElement("canvas");
      fc.width = canvas.width;
      fc.height = canvas.height;
      const fctx = fc.getContext("2d");
      // precompute subdivision max for population mode to render subdivisions into the fill cache
      let maxSubdivisionPopulation = 1;
      if (mode === "population") {
        for (const territory of territories) {
          const basePop = Number.isFinite(territory.population) ? territory.population : 0;
          for (const subdivision of territory.subdivisions || []) {
            const pop = basePop * (subdivision.populationShare || 0);
            if (Number.isFinite(pop) && pop > maxSubdivisionPopulation) maxSubdivisionPopulation = pop;
          }
        }
        maxSubdivisionPopulation = Math.max(1, maxSubdivisionPopulation);
      }
      for (const territory of territories) {
        const bounds = territory.screenBounds || screenBoundsForTerritory(territory);
        if (
          bounds.maxX < -margin ||
          bounds.minX > canvas.width + margin ||
          bounds.maxY < -margin ||
          bounds.minY > canvas.height + margin
        ) {
          continue;
        }
        const path = territory.path || buildPath(territory);
        fctx.fillStyle = fillForTerritory(territory, mode);
        fctx.fill(path, "evenodd");
        // render subdivisions into the fill cache for population/political modes
        if (mode === "population" && territory.subdivisions?.length) {
          renderTerritorySubdivisionsToCtx(territory, fctx, maxSubdivisionPopulation);
        }
      }
      state.fillCache = { canvas: fc, mode };
      state.fillCacheDirty = false;
      ctx.drawImage(fc, 0, 0);
      didUseFillCache = true;
    } catch (e) {
      // fallback to direct draw on error
      for (const territory of territories) {
        const bounds = territory.screenBounds || screenBoundsForTerritory(territory);
        if (
          bounds.maxX < -margin ||
          bounds.minX > canvas.width + margin ||
          bounds.maxY < -margin ||
          bounds.minY > canvas.height + margin
        ) {
          continue;
        }
        ctx.fillStyle = fillForTerritory(territory, mode);
        ctx.fill(territory.path || buildPath(territory), "evenodd");
      }
    }
  }
  if (mode === "population" && !didUseFillCache) drawPopulationSubdivisions();
  if (mode === "political") drawSubdivisionsOverlay();
  drawContestedTerritories();
  drawMapBorders(mode);

  drawWarFronts();
  drawSubdivisionFronts();
  drawSelectionHalo();
  drawLabels();
}

function drawOcean(toCtx = ctx, toCanvas = canvas) {
  const gradient = toCtx.createLinearGradient(0, 0, toCanvas.width, toCanvas.height);
  gradient.addColorStop(0, "#1c3031");
  gradient.addColorStop(0.58, "#20302f");
  gradient.addColorStop(1, "#151b1b");
  toCtx.fillStyle = gradient;
  toCtx.fillRect(0, 0, toCanvas.width, toCanvas.height);
}

function drawGraticule(toCtx = ctx, toCanvas = canvas) {
  toCtx.save();
  toCtx.strokeStyle = "rgba(255,255,255,0.12)";
  toCtx.lineWidth = 1.2;
  for (let lon = -180; lon <= 180; lon += 30) {
    const path = new Path2D();
    for (let lat = -80; lat <= 85; lat += 4) {
      const [x, y] = projectToScreen(robinsonProject(lon, lat));
      if (lat === -80) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    toCtx.stroke(path);
  }
  for (let lat = -60; lat <= 75; lat += 15) {
    const path = new Path2D();
    for (let lon = -180; lon <= 180; lon += 4) {
      const [x, y] = projectToScreen(robinsonProject(lon, lat));
      if (lon === -180) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    toCtx.stroke(path);
  }
  toCtx.restore();
}

function buildPath(territory) {
  const path = new Path2D();
  for (const ring of territory.projectedRings) {
    if (ring.length < 3) continue;
    ring.forEach((point, index) => {
      const [x, y] = projectToScreen(point);
      if (index === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
    path.closePath();
  }
  return path;
}

function currentSegmentOwnerMap() {
  // Return cached map when nothing changed
  if (state.segmentMapCache && !state.segmentMapDirty) return state.segmentMapCache;

  const segments = new Map();
  for (const territory of state.territories) {
    for (const segment of territory.segments || []) {
      let entry = segments.get(segment.key);
      if (!entry) {
        entry = { segment, owners: new Set(), territories: new Set() };
        segments.set(segment.key, entry);
      }
      entry.owners.add(territory.ownerId);
      entry.territories.add(territory.id);
    }
  }

  state.segmentMapCache = segments;
  state.segmentMapDirty = false;
  state.segmentMapVersion += 1;
  state.borderPathCache = null;
  state.ownerBoundaryCache.clear();
  return segments;
}

function addProjectedSegmentToPath(target, segment) {
  if (segment.screenA && segment.screenB) {
    target.moveTo(segment.screenA[0], segment.screenA[1]);
    target.lineTo(segment.screenB[0], segment.screenB[1]);
    return;
  }
  const [x1, y1] = projectToScreen(segment.a);
  const [x2, y2] = projectToScreen(segment.b);
  target.moveTo(x1, y1);
  target.lineTo(x2, y2);
}

function strokeProjectedSegment(segment) {
  addProjectedSegmentToPath(ctx, segment);
}

function drawMapBorders(mode) {
  const segmentMap = currentSegmentOwnerMap();
  const showInternal = mode === "population" || state.view.zoom > 2.7;
  const cacheKey = `${state.lastProjectionKey}|${state.segmentMapVersion}|${showInternal ? 1 : 0}`;
  let cache = state.borderPathCache;

  if (!cache || cache.key !== cacheKey) {
    const internalPath = new Path2D();
    const externalPath = new Path2D();
    for (const entry of segmentMap.values()) {
      if (entry.owners.size === 1 && entry.territories.size > 1) addProjectedSegmentToPath(internalPath, entry.segment);
      if (entry.territories.size === 1 || entry.owners.size > 1) addProjectedSegmentToPath(externalPath, entry.segment);
    }
    cache = { key: cacheKey, internalPath, externalPath };
    state.borderPathCache = cache;
  }

  if (showInternal) {
    ctx.save();
    ctx.lineWidth = 0.32 + state.view.zoom * 0.05;
    ctx.strokeStyle = mode === "population" ? "rgba(255,255,255,0.16)" : "rgba(13,15,14,0.16)";
    ctx.stroke(cache.internalPath);
    ctx.restore();
  }

  ctx.save();
  ctx.lineWidth = state.view.zoom > 1.5 ? 0.85 : 0.55;
  ctx.strokeStyle = "rgba(9,10,10,0.54)";
  ctx.stroke(cache.externalPath);
  ctx.restore();
}

function fillForTerritory(territory, mode) {
  const owner = state.nations.get(territory.ownerId);
  if (!owner) return "#6d6d62";
  if (mode === "political") return owner.color;
  if (mode === "alliances") {
    return allianceColorForNation(owner);
  }
  if (mode === "puppets") {
    return puppetColorForNation(owner);
  }
  if (mode === "religions") {
    return RELIGION_COLORS[territory.religion] || RELIGION_COLORS.Secular;
  }
  if (mode === "economy") {
    const maxGdp = state.cachedMaxGdp || Math.max(1, ...state.territories.map((item) => item.gdp));
    const value = relativeLog(territory.gdp, maxGdp);
    return redGreenScale(value);
  }
  if (mode === "stability") {
    return redGreenScale(owner.stability);
  }
  if (mode === "unrest") {
    return mixColor("#4a625a", "#d76157", territory.unrest);
  }
  if (mode === "population") {
    const maxPopulation = state.cachedMaxPopulation || Math.max(1, ...state.territories.map((item) => item.population));
    const value = relativeLog(territory.population, maxPopulation);
    return blueWhiteScale(value);
  }
  if (mode === "wars") {
    if (!owner.wars.size) return desaturate(owner.color, 0.64);
    return mixColor(owner.color, "#d76157", 0.62);
  }
  if (mode === "warAlliances") {
    // Show wars in red, alliances in blue, puppet relationships in yellow
    if (owner.wars.size) return "#d76157";
    if (owner.allies.size) return "#4d7ec4";
    if (owner.puppets.size || owner.overlordId) return "#d8b84d";
    return owner.color;
  }
  if (mode === "landmass") {
    return "#8B4513"; // Brown color for land
  }
  return owner.color;
}

function allianceColorForNation(nation) {
  if (!nation?.alive) return "#6d6d62";
  const group = allianceGroup(nation);
  if (!group.networked) return desaturate(nation.color, 0.68);
  const color = colorForIndex(group.root * 7);
  if (nation.overlordId) return mixColor(color, "#f4efe2", 0.18);
  if (nation.wars.size) return mixColor(color, "#d76157", 0.3);
  return color;
}

function overlordRoot(nation) {
  let current = nation;
  const seen = new Set();
  while (current?.overlordId && !seen.has(current.id)) {
    seen.add(current.id);
    const next = state.nations.get(current.overlordId);
    if (!next?.alive) break;
    current = next;
  }
  return current || nation;
}

function puppetColorForNation(nation) {
  if (!nation?.alive) return "#6d6d62";
  if (!nation.overlordId && !nation.puppets.size) return desaturate(nation.color, 0.72);
  const root = overlordRoot(nation);
  const color = colorForIndex(root.id * 11);
  if (nation.id === root.id) return color;
  return mixColor(color, "#f4efe2", 0.28);
}

function allianceGroup(nation) {
  const visited = new Set();
  const queue = [nation.id];
  let root = nation.id;
  let networked = nation.allies.size > 0 || nation.overlordId != null || nation.puppets.size > 0;
  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    root = Math.min(root, id);
    const current = state.nations.get(id);
    if (!current?.alive) continue;
    const linked = new Set([...current.allies, ...current.puppets]);
    if (current.overlordId) linked.add(current.overlordId);
    if (linked.size) networked = true;
    for (const nextId of linked) {
      const next = state.nations.get(nextId);
      if (next?.alive && !visited.has(nextId)) queue.push(nextId);
    }
  }
  return { root, networked };
}

function mixColor(a, b, amount) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const t = clamp(amount, 0, 1);
  return `rgb(${Math.round(lerp(ca.r, cb.r, t))}, ${Math.round(lerp(ca.g, cb.g, t))}, ${Math.round(lerp(ca.b, cb.b, t))})`;
}

function redGreenScale(value) {
  const t = clamp(value, 0, 1);
  if (t < 0.5) return mixColor("#c8463e", "#d8b84d", t / 0.5);
  return mixColor("#d8b84d", "#4fb07a", (t - 0.5) / 0.5);
}

function blueWhiteScale(value) {
  const t = clamp(value, 0, 1);
  // 0 -> white, 1 -> deep blue
  return mixColor("#ffffff", "#2b6fd6", t);
}

function desaturate(hex, amount) {
  const color = hexToRgb(hex);
  const gray = (color.r + color.g + color.b) / 3;
  return `rgb(${Math.round(lerp(color.r, gray, amount))}, ${Math.round(lerp(color.g, gray, amount))}, ${Math.round(lerp(color.b, gray, amount))})`;
}

function hexToRgb(hex) {
  const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function screenBoundsForTerritory(territory, force = false) {
  if (!force && territory.screenBounds) return territory.screenBounds;
  const a = projectToScreen([territory.bounds.minX, territory.bounds.minY]);
  const b = projectToScreen([territory.bounds.maxX, territory.bounds.maxY]);
  return {
    minX: Math.min(a[0], b[0]),
    minY: Math.min(a[1], b[1]),
    maxX: Math.max(a[0], b[0]),
    maxY: Math.max(a[1], b[1]),
    width: Math.abs(b[0] - a[0]),
    height: Math.abs(b[1] - a[1]),
  };
}

function drawPopulationSubdivisions() {
  // compute max subdivision population without creating intermediate arrays
  let maxSubdivisionPopulation = 1;
  for (const territory of state.territories) {
    const basePop = Number.isFinite(territory.population) ? territory.population : 0;
    for (const subdivision of territory.subdivisions || []) {
      const pop = basePop * (subdivision.populationShare || 0);
      if (Number.isFinite(pop) && pop > maxSubdivisionPopulation) maxSubdivisionPopulation = pop;
    }
  }
  maxSubdivisionPopulation = Math.max(1, maxSubdivisionPopulation);

  for (const territory of state.territories) {
    if (!territory.path || !territory.subdivisions?.length) continue;
    const projectedCenter = territory.centroid || [0, 0];
    const bounds = screenBoundsForTerritory(territory);
    const radius = Math.max(bounds.width, bounds.height) * 0.7;

    ctx.save();
    ctx.clip(territory.path, "evenodd");
    // Skip detailed subdivision drawing for very small on-screen territories to improve performance
    if (Math.max(bounds.width, bounds.height) < 14) {
      ctx.restore();
      continue;
    }
    for (let i = 0; i < territory.subdivisions.length; i += 1) {
      const s = territory.subdivisions[i];
      // If subdivision has exact projected rings from admin1, draw that polygon
      if (s.projectedRings && s.projectedRings.length) {
        let path = s.path || null;
        if (!path) {
          path = new Path2D();
          for (const ring of s.projectedRings) {
            for (let j = 0; j < ring.length; j += 1) {
              const [x, y] = projectToScreen(ring[j]);
              if (j === 0) path.moveTo(x, y);
              else path.lineTo(x, y);
            }
            path.closePath();
          }
          // cache best-effort screen-space path
          s.path = path;
        }
        const pop = territory.population * (s.populationShare || 1 / territory.subdivisions.length);
        const value = relativeLog(pop, maxSubdivisionPopulation);
        ctx.globalAlpha = 0.72;
        ctx.fillStyle = blueWhiteScale(value);
        ctx.fill(path);
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 0.4;
        ctx.stroke(path);
        continue;
      }
      const start = s.sliceStart ?? (i / territory.subdivisions.length) * Math.PI * 2;
      const end = s.sliceEnd ?? ((i + 1) / territory.subdivisions.length) * Math.PI * 2;
      const steps = Math.max(4, Math.ceil((end - start) / (Math.PI * 2) * 8));
      let path = s.path || null;
      if (!path) {
        path = new Path2D();
        const centerScreen = projectToScreen(projectedCenter);
        path.moveTo(centerScreen[0], centerScreen[1]);
        for (let t = 0; t <= steps; t += 1) {
          const ang = lerp(start, end, t / Math.max(1, steps));
          const proj = [projectedCenter[0] + Math.cos(ang) * (radius / state.projection.scale || 1) * 0.9, projectedCenter[1] + Math.sin(ang) * (radius / state.projection.scale || 1) * 0.9];
          const [x, y] = projectToScreen(proj);
          path.lineTo(x, y);
        }
        path.closePath();
        s.path = path;
      }
      const pop = territory.population * (s.populationShare || 1 / territory.subdivisions.length);
      const value = relativeLog(pop, maxSubdivisionPopulation);
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = blueWhiteScale(value);
      ctx.fill(path);
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 0.4;
      ctx.stroke(path);
    }
    ctx.restore();
  }
}

function renderTerritorySubdivisionsToCtx(territory, toCtx, maxSubdivisionPopulation) {
  if (!territory.path || !territory.subdivisions?.length) return;
  const bounds = territory.screenBounds || screenBoundsForTerritory(territory);
  if (Math.max(bounds.width, bounds.height) < 14) return;
  const projectedCenter = territory.centroid || [0, 0];

  toCtx.save();
  toCtx.clip(territory.path, "evenodd");
  for (let i = 0; i < territory.subdivisions.length; i += 1) {
    const s = territory.subdivisions[i];
    if (!s) continue;
    let path = s.path || null;
    if (!path) {
      if (s.projectedRings && s.projectedRings.length) {
        path = new Path2D();
        for (const ring of s.projectedRings) {
          for (let j = 0; j < ring.length; j += 1) {
            const [x, y] = projectToScreen(ring[j]);
            if (j === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
          }
          path.closePath();
        }
      } else {
        const start = s.sliceStart ?? (i / territory.subdivisions.length) * Math.PI * 2;
        const end = s.sliceEnd ?? ((i + 1) / territory.subdivisions.length) * Math.PI * 2;
        const steps = Math.max(4, Math.ceil((end - start) / (Math.PI * 2) * 8));
        path = new Path2D();
        const centerScreen = projectToScreen(projectedCenter);
        path.moveTo(centerScreen[0], centerScreen[1]);
        const radius = Math.max(bounds.width, bounds.height) * 0.7;
        for (let t = 0; t <= steps; t += 1) {
          const ang = lerp(start, end, t / Math.max(1, steps));
          const proj = [projectedCenter[0] + Math.cos(ang) * (radius / state.projection.scale || 1) * 0.9, projectedCenter[1] + Math.sin(ang) * (radius / state.projection.scale || 1) * 0.9];
          const [x, y] = projectToScreen(proj);
          path.lineTo(x, y);
        }
        path.closePath();
      }
      s.path = path;
    }
    const pop = territory.population * (s.populationShare || 1 / territory.subdivisions.length);
    const value = relativeLog(pop, maxSubdivisionPopulation);
    toCtx.globalAlpha = 0.72;
    toCtx.fillStyle = blueWhiteScale(value);
    toCtx.fill(path);
    toCtx.globalAlpha = 0.18;
    toCtx.strokeStyle = "rgba(255,255,255,0.12)";
    toCtx.lineWidth = 0.4;
    toCtx.stroke(path);
  }
  toCtx.restore();
}

function drawSubdivisionsOverlay() {
  // subtle subdivision outlines/fills for political map visuals (not selectable)
  for (const territory of state.territories) {
    if (!territory.path || !territory.subdivisions?.length) continue;
    // don't render subdivision overlays at low zoom or for tiny territories
    if (state.view.zoom < 1.6) continue;
    const projectedCenter = territory.centroid || [0, 0];
    const bounds = screenBoundsForTerritory(territory);
    const radius = Math.max(bounds.width, bounds.height) * 0.7;
    if (Math.max(bounds.width, bounds.height) < 12) continue;

    ctx.save();
    ctx.clip(territory.path, "evenodd");
    for (let i = 0; i < territory.subdivisions.length; i += 1) {
      const s = territory.subdivisions[i];
      const owner = state.nations.get(s.ownerId);
      const path = s.path || null;
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = owner ? desaturate(owner.color, 0.28) : "rgba(108,108,98,0.9)";
      if (path) {
        ctx.fill(path);
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 0.5 + state.view.zoom * 0.02;
        ctx.stroke(path);
        continue;
      }
      const start = s.sliceStart ?? (i / territory.subdivisions.length) * Math.PI * 2;
      const end = s.sliceEnd ?? ((i + 1) / territory.subdivisions.length) * Math.PI * 2;
      const steps = Math.max(4, Math.ceil((end - start) / (Math.PI * 2) * 8));
      const fallback = new Path2D();
      const centerScreen = projectToScreen(projectedCenter);
      fallback.moveTo(centerScreen[0], centerScreen[1]);
      for (let t = 0; t <= steps; t += 1) {
        const ang = lerp(start, end, t / Math.max(1, steps));
        const x = centerScreen[0] + Math.cos(ang) * radius * 0.9;
        const y = centerScreen[1] + Math.sin(ang) * radius * 0.9;
        fallback.lineTo(x, y);
      }
      fallback.closePath();
      ctx.fill(fallback);
      ctx.globalAlpha = 0.28;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.5 + state.view.zoom * 0.02;
      ctx.stroke(fallback);
    }
    ctx.restore();
  }
}

function drawSubdivisionControlCells(territory, controllerId, color) {
  if (!territory.subdivisions?.length) return;
  const projectedCenter = territory.centroid || [0, 0];
  const bounds = screenBoundsForTerritory(territory);
  const radius = Math.max(bounds.width, bounds.height) * 0.7;

  ctx.save();
  ctx.clip(territory.path, "evenodd");
  for (let i = 0; i < territory.subdivisions.length; i += 1) {
    const s = territory.subdivisions[i];
    if (s.ownerId !== controllerId) continue;
    // If we have precise projected rings, draw the polygon; otherwise draw wedge
    if (s.projectedRings && s.projectedRings.length) {
      const path = new Path2D();
      for (const ring of s.projectedRings) {
        for (let j = 0; j < ring.length; j += 1) {
          const [x, y] = projectToScreen(ring[j]);
          if (j === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
        }
        path.closePath();
      }
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = color;
      ctx.fill(path);
      ctx.globalAlpha = 0.72;
      ctx.strokeStyle = "rgba(244,239,226,0.2)";
      ctx.lineWidth = 0.45;
      ctx.stroke(path);
      continue;
    }
    const start = s.sliceStart ?? (i / territory.subdivisions.length) * Math.PI * 2;
    const end = s.sliceEnd ?? ((i + 1) / territory.subdivisions.length) * Math.PI * 2;
    const steps = Math.max(4, Math.ceil((end - start) / (Math.PI * 2) * 8));
    const path = new Path2D();
    const centerScreen = projectToScreen(projectedCenter);
    path.moveTo(centerScreen[0], centerScreen[1]);
    for (let t = 0; t <= steps; t += 1) {
      const ang = lerp(start, end, t / Math.max(1, steps));
      const proj = [projectedCenter[0] + Math.cos(ang) * (radius / state.projection.scale || 1) * 0.9, projectedCenter[1] + Math.sin(ang) * (radius / state.projection.scale || 1) * 0.9];
      const [x, y] = projectToScreen(proj);
      path.lineTo(x, y);
    }
    path.closePath();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = "rgba(244,239,226,0.2)";
    ctx.lineWidth = 0.45;
    ctx.stroke(path);
  }
  ctx.restore();
}

function drawContestedTerritories() {
  for (const territory of state.territories) {
    if (!territory.path || !territory.subdivisions?.length) continue;
    const hasSubdivisionVisual =
      territory.captureFlash > 0.01 ||
      territory.subdivisions.some((s) => (s.contestedById && s.contestedProgress > 0.01) || s.ownerId !== territory.ownerId);
    if (!hasSubdivisionVisual) continue;
    const bounds = screenBoundsForTerritory(territory);
    const projectedCenter = territory.centroid || [0, 0];
    const radius = Math.max(bounds.width, bounds.height) * 0.7;

    ctx.save();
    ctx.clip(territory.path, "evenodd");
    for (let i = 0; i < territory.subdivisions.length; i += 1) {
      const s = territory.subdivisions[i];
      let path = s.path || null;
      if (!path) {
        if (s.projectedRings && s.projectedRings.length) {
          path = new Path2D();
          for (const ring of s.projectedRings) {
            for (let j = 0; j < ring.length; j += 1) {
              const [x, y] = projectToScreen(ring[j]);
              if (j === 0) path.moveTo(x, y);
              else path.lineTo(x, y);
            }
            path.closePath();
          }
        } else {
          const start = s.sliceStart ?? (i / territory.subdivisions.length) * Math.PI * 2;
          const end = s.sliceEnd ?? ((i + 1) / territory.subdivisions.length) * Math.PI * 2;
          const steps = Math.max(4, Math.ceil((end - start) / (Math.PI * 2) * 8));
          const centerScreen = projectToScreen(projectedCenter);
          path = new Path2D();
          path.moveTo(centerScreen[0], centerScreen[1]);
          for (let t = 0; t <= steps; t += 1) {
            const ang = lerp(start, end, t / Math.max(1, steps));
            const proj = [projectedCenter[0] + Math.cos(ang) * (radius / state.projection.scale || 1) * 0.9, projectedCenter[1] + Math.sin(ang) * (radius / state.projection.scale || 1) * 0.9];
            const [x, y] = projectToScreen(proj);
            path.lineTo(x, y);
          }
          path.closePath();
        }
        // cache for reuse until projection changes
        s.path = path;
      }

      // base fill for subdivision (owner color)
      const owner = state.nations.get(s.ownerId);
      ctx.globalAlpha = 0.76;
      ctx.fillStyle = owner ? desaturate(owner.color, 0.12) : "rgba(108,108,98,0.9)";
      ctx.fill(path);

      // contested overlay
      if (s.contestedById && s.contestedProgress > 0.01) {
        const attacker = state.nations.get(s.contestedById);
        if (attacker) {
          ctx.globalAlpha = clamp(0.18 + s.contestedProgress * 0.7, 0.12, 0.9);
          ctx.fillStyle = attacker.color;
          ctx.fill(path);
          ctx.globalAlpha = clamp(0.28 + s.contestedProgress * 0.32, 0.22, 0.94);
          ctx.strokeStyle = attacker.color;
          ctx.lineWidth = 1 + state.view.zoom * 0.18;
          ctx.stroke(path);
        }
      }
    }
    ctx.restore();

    if (territory.captureFlash > 0.01) {
      ctx.save();
      ctx.globalAlpha = territory.captureFlash * 0.26;
      ctx.fillStyle = "#f4efe2";
      ctx.fill(territory.path, "evenodd");
      ctx.restore();
    }
  }
}

function sharedBorderSegments(left, right) {
  const rightKeys = new Set((right.segments || []).map((segment) => segment.key));
  return (left.segments || []).filter((segment) => rightKeys.has(segment.key));
}

function drawWarFronts() {
  ctx.save();
  const isWarsMode = state.mapMode === "wars";
  ctx.setLineDash(isWarsMode ? [] : [5, 4]);
  ctx.lineDashOffset = -state.animationTime * 12;
  for (const pair of state.borderPairs.values()) {
    const a = state.nations.get(pair.a);
    const b = state.nations.get(pair.b);
    if (!a?.wars.has(b?.id)) continue;
    for (const [leftId, rightId] of pair.fronts.slice(0, isWarsMode ? 160 : 42)) {
      const left = state.territories[leftId];
      const right = state.territories[rightId];
      const contestedLevel = Math.max(left.contestedProgress || 0, right.contestedProgress || 0);
      const pulse = 0.46 + Math.sin(state.animationTime * 6 + left.id + right.id) * 0.24;
      const baseAlpha = clamp(0.36 + contestedLevel * 0.58 + pulse * 0.15, 0.28, 0.98);
      const innerColor = `rgba(236, 89, 77, ${baseAlpha})`;
      const outerAlpha = clamp(0.08 + contestedLevel * 0.22, 0.06, 0.36);
      const outerColor = `rgba(236, 89, 77, ${outerAlpha})`;
      const lineWidth = (isWarsMode ? 2.6 : 1) + state.view.zoom * 0.36 + contestedLevel * 1.6;
      const segments = sharedBorderSegments(left, right);
      ctx.beginPath();
      if (segments.length) {
        for (const segment of segments) strokeProjectedSegment(segment);
      } else {
        const [x1, y1] = projectToScreen(left.centroid);
        const [x2, y2] = projectToScreen(right.centroid);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      if (isWarsMode) {
        // Outer glow / halo for prominence
        ctx.save();
        ctx.lineWidth = lineWidth + 3.5;
        ctx.strokeStyle = outerColor;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.restore();
        // subtle shadow for depth
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = outerColor;
      }
      ctx.strokeStyle = innerColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      if (isWarsMode) ctx.restore();
    }
  }
  ctx.restore();
}

function drawSubdivisionFronts() {
  if (state.view.zoom < 0.9) return;
  ctx.save();
  for (const territory of state.territories) {
    if (!territory.subdivisions?.length) continue;
    const tOwner = state.nations.get(territory.ownerId);
    if (!tOwner) continue;
    for (const s of territory.subdivisions) {
      if (!s || s.ownerId === territory.ownerId) continue;
      const sOwner = state.nations.get(s.ownerId);
      if (!sOwner || !(sOwner.wars.has(tOwner.id) || tOwner.wars.has(sOwner.id))) continue;
      const contestedLevel = s.contestedProgress || 0;
      const pulse = 0.38 + Math.sin(state.animationTime * 8 + (s.ownerId || 0)) * 0.18;
      const baseAlpha = clamp(0.46 + contestedLevel * 0.5 + pulse * 0.12, 0.2, 0.96);
      const innerColor = `rgba(236,89,77,${baseAlpha})`;
      const outerAlpha = clamp(0.06 + contestedLevel * 0.22, 0.04, 0.36);
      const outerColor = `rgba(236,89,77,${outerAlpha})`;
      const lineWidth = 1 + state.view.zoom * 0.26 + contestedLevel * 1.2;
      const path = s.path || null;
      if (path) {
        ctx.save();
        ctx.beginPath();
        if (outerAlpha > 0.02) {
          ctx.lineWidth = lineWidth + 3;
          ctx.strokeStyle = outerColor;
          ctx.globalAlpha = 0.95;
          ctx.stroke(path);
        }
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = innerColor;
        ctx.stroke(path);
        ctx.restore();
      } else if (s.projectedRings && s.projectedRings.length) {
        const tmp = new Path2D();
        for (const ring of s.projectedRings) {
          for (let j = 0; j < ring.length; j += 1) {
            const [x, y] = projectToScreen(ring[j]);
            if (j === 0) tmp.moveTo(x, y);
            else tmp.lineTo(x, y);
          }
          tmp.closePath();
        }
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = lineWidth + 3;
        ctx.strokeStyle = outerColor;
        ctx.globalAlpha = 0.95;
        ctx.stroke(tmp);
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = innerColor;
        ctx.stroke(tmp);
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

function drawOwnerBoundary(ownerId, options = {}) {
  if (!ownerId) return;
  const segmentMap = currentSegmentOwnerMap();
  const cacheKey = `${state.lastProjectionKey}|${state.segmentMapVersion}|${ownerId}`;
  let boundaryPath = state.ownerBoundaryCache.get(cacheKey);
  if (!boundaryPath) {
    boundaryPath = new Path2D();
    for (const entry of segmentMap.values()) {
      if (!entry.owners.has(ownerId)) continue;
      if (entry.territories.size === 1 || entry.owners.size > 1) addProjectedSegmentToPath(boundaryPath, entry.segment);
    }
    if (state.ownerBoundaryCache.size > 16) state.ownerBoundaryCache.clear();
    state.ownerBoundaryCache.set(cacheKey, boundaryPath);
  }
  ctx.save();
  ctx.lineWidth = options.lineWidth || 2;
  ctx.strokeStyle = options.strokeStyle || "#ffffff";
  ctx.shadowColor = options.shadowColor || "rgba(255,255,255,0.5)";
  ctx.shadowBlur = options.shadowBlur ?? 10;
  ctx.stroke(boundaryPath);
  ctx.restore();
}

// Military unit markers removed.

function drawSelectionHalo() {
  const selected = state.territories[state.selectedTerritoryId];
  const hovered = state.territories[state.hoveredTerritoryId];
  if (hovered?.path) {
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.stroke(hovered.path);
    ctx.restore();
  }
  const selectedOwnerId = state.selectedNationId ?? selected?.ownerId;
  if (selectedOwnerId) {
    const owner = state.nations.get(selectedOwnerId);
    const ownerTerritoryIds = owner?.controlledTerritories?.length ? owner.controlledTerritories : owner?.territories || [];
    if (ownerTerritoryIds.length) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      for (const territoryId of ownerTerritoryIds) {
        const territory = state.territories[territoryId];
        if (territory?.path) ctx.fill(territory.path, "evenodd");
      }
      ctx.restore();
    }
    drawOwnerBoundary(selectedOwnerId);
  }
}

function shortNationLabel(name) {
  const cleaned = safeName(name, "Nation");
  const stripped = cleaned
    .replace(/\b(Federation|Republic|Union|Commonwealth|State|Dominion|Directorate|Authority|League|Compact|Front|Council|Command|Junta|Marshalcy)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const label = stripped || cleaned;
  return label.length > 18 ? `${label.slice(0, 17)}.` : label;
}

function labelOverlaps(rect, others) {
  for (const other of others) {
    if (
      rect.x < other.x + other.w &&
      rect.x + rect.w > other.x &&
      rect.y < other.y + other.h &&
      rect.y + rect.h > other.y
    ) {
      return true;
    }
  }
  return false;
}

function nationLabelAnchor(nation) {
  if (!nation?.territories?.length) return null;
  const territories = nation.territories.map((id) => state.territories[id]).filter(Boolean);
  if (!territories.length) return null;

  let bestTerritory = territories[0];
  let bestScore = -Infinity;
  let sumWeight = 0;
  let sumX = 0;
  let sumY = 0;

  for (const territory of territories) {
    const wealthWeight = Math.log10(territory.gdp + 10) * 1.3;
    const populationWeight = Math.sqrt(Math.max(1, territory.population / 2_000_000));
    const weight = Math.max(1, wealthWeight + populationWeight);
    sumWeight += weight;
    sumX += territory.centroid[0] * weight;
    sumY += territory.centroid[1] * weight;

    const strategicScore = territory.gdp + territory.population / 4_000_000;
    if (strategicScore > bestScore) {
      bestScore = strategicScore;
      bestTerritory = territory;
    }
  }

  const blended = sumWeight > 0 ? [sumX / sumWeight, sumY / sumWeight] : bestTerritory.centroid;
  const [x, y] = projectToScreen(blended);
  const inViewport = x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height;
  const insideOwnedLand = territories.some((territory) => territory.path && ctx.isPointInPath(territory.path, x, y, "evenodd"));
  if (inViewport && insideOwnedLand) return { x, y, territoryCount: territories.length };

  const [fallbackX, fallbackY] = projectToScreen(bestTerritory.centroid);
  return { x: fallbackX, y: fallbackY, territoryCount: territories.length };
}

function drawLabels() {
  if (state.view.zoom < 1.14 && canvas.width < 900) return;
  const alive = liveNations();
  const labelCount = Math.max(1, Math.ceil(alive.length / 3));
  const topNations = alive
    .slice()
    .sort((a, b) => b.rating - a.rating || b.power - a.power)
    .slice(0, labelCount);
  const placed = [];
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const nation of topNations) {
    const anchor = nationLabelAnchor(nation);
    if (!anchor) continue;
    const { x, y, territoryCount } = anchor;
    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) continue;
    const label = shortNationLabel(nation.name);
    const sizeBoost = territoryCount > 18 ? 2 : territoryCount > 9 ? 1 : 0;
    const fontSize = state.view.zoom > 2.2 ? 12 + sizeBoost : 11 + sizeBoost;
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    const width = ctx.measureText(label).width + 10;
    const rect = { x: x - width / 2, y: y - (fontSize + 4) / 2, w: width, h: fontSize + 4 };
    if (labelOverlaps(rect, placed)) continue;
    placed.push(rect);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(10,10,9,0.82)";
    ctx.strokeText(label, x, y);
    ctx.fillStyle = "#f4efe2";
    ctx.fillText(label, x, y);
  }
  ctx.restore();
}

function selectedSubdivision() {
  const territory = state.territories[state.selectedTerritoryId];
  if (!territory?.subdivisions?.length || !state.selectedSubdivisionId) return null;
  return territory.subdivisions.find((subdivision) => subdivision.id === state.selectedSubdivisionId) || null;
}

function ownerHistoryLinks(ownerIds) {
  return ownerIds
    .filter((id) => id != null)
    .filter((id, idx, list) => list.indexOf(id) === idx || idx === list.length - 1)
    .map((id, idx, list) => {
      const label = escapeHtml(state.nations.get(id)?.name || "Unknown");
      const sep = idx < list.length - 1 ? " -> " : "";
      return '<a href="#" class="link-nation" data-nation-id="' + id + '">' + label + '</a>' + sep;
    })
    .join("");
}

function neighboringNationsForTerritory(territory, ownerId) {
  if (!territory) return [];
  return territory.neighbors
    .map((id) => state.nations.get(state.territories[id]?.ownerId))
    .filter((item) => item?.alive && item.id !== ownerId)
    .filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index)
    .sort((a, b) => getRelation(ownerId, a.id) - getRelation(ownerId, b.id));
}

function renderSelection() {
  const territory = state.territories[state.selectedTerritoryId];
  const sub = selectedSubdivision();
  const effectiveOwnerId = sub?.ownerId ?? territory?.ownerId ?? state.selectedNationId;
  const nation = territory ? state.nations.get(effectiveOwnerId) : state.nations.get(state.selectedNationId);
  els.selectedBadge.textContent = territory ? territory.iso : "None";
  els.aiBadge.textContent = nation ? nation.ideology.name : "Autonomous";

  if (!territory || !nation) {
    els.selectionDetails.innerHTML = detailRows([
      ["Territory", "None"],
      ["Owner", "None"],
      ["Population", "0"],
      ["GDP", "$0M"],
    ]);
    els.nationPolicy.innerHTML = "";
    for (const button of [els.stabilizeBtn, els.fundRebelsBtn, els.inciteWarBtn, els.puppetBtn]) {
      button.disabled = true;
    }
    return;
  }

  const relations = neighboringNationsForTerritory(territory, nation.id);

  const originalOwner = state.nations.get(territory.originalOwnerId);
  const wasConquered = territory.originalOwnerId != null && territory.ownerId !== territory.originalOwnerId;
  const subdivisionCount = territory.subdivisions?.length || 0;
  const heldByOwner = subdivisionControlCount(territory, nation.id);
  const ownerHistory = sub?.history?.length
    ? sub.history
    : territory.ownerHistory?.length
      ? territory.ownerHistory
      : [territory.originalOwnerId, territory.ownerId].filter((id) => id != null);
  const historyLine = ownerHistoryLinks(ownerHistory);
  els.selectionDetails.innerHTML = detailRows([
    ["Territory", territory.name],
    ["Original", territory.originalName],
    ["Owner", nation.name],
    ["Subdivision", sub ? `${sub.name} (${sub.type})` : "Whole territory"],
    ["Status", wasConquered ? "Conquered" : "Sovereign"],
    ["Rating", `${nation.ratingGrade} ${nation.rating.toFixed(0)}/100`],
    ["Ideology", nation.ideology.name],
    ["Religion", territory.religion],
    ["Origin Owner", originalOwner?.name || nation.name],
    ["Region", territory.region],
    ["Population", formatPopulation(territory.population)],
    ["GDP", formatMoney(territory.gdp)],
    ["Subdivisions", subdivisionCount ? heldByOwner + "/" + subdivisionCount + " controlled by " + nation.name : "N/A"],
    ["Unrest", Math.round(territory.unrest * 100) + "%"],
    ["Fortified", Math.round(territory.fortification * 100) + "%"],
    ["Treasury", nation.treasury.toFixed(0) + " credits"],
    ["Army", nation.army.toFixed(1) + " brigades"],
    ["Wars", String(nation.wars.size)],
    ["Neighbors", relations.slice(0, 3).map((item) => item.name).join(", ") || "No foreign neighbors"],
  ]);
  els.selectionDetails.innerHTML += '<div class="detail-row"><span>Historical Owners</span><strong>' + historyLine + '</strong></div>';
  els.selectionDetails.innerHTML += fullDetailRow("Admin-1 Detail", subdivisionSummary(territory));
  els.selectionDetails.innerHTML += fullDetailRow("Name Bank", nameIdeaSummary(nation));

  els.nationPolicy.innerHTML = [
    meter("Stability", nation.stability),
    meter("Legitimacy", nation.legitimacy),
    meter("Ambition", nation.ambition),
    meter("Tech", nation.tech),
    meter("Economy Rating", nation.economicScore / 100),
    meter("Military Rating", nation.militaryScore / 100),
    meter("Tax", nation.ideology.tax),
    meter("Conscription", nation.ideology.conscription),
  ].join("");

  for (const button of [els.stabilizeBtn, els.fundRebelsBtn, els.inciteWarBtn, els.puppetBtn]) {
    button.disabled = false;
  }
}

function detailRows(rows) {
  return rows
    .map(
      ([label, value]) =>
        `<div class="detail-row"><span>${escapeHtml(label)}</span><strong title="${escapeHtml(String(value))}">${escapeHtml(String(value))}</strong></div>`,
    )
    .join("");
}

function fullDetailRow(label, value) {
  return `<div class="detail-row full"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function subdivisionSummary(territory) {
  if (!territory.subdivisions?.length) return "No admin-1 data";
  return territory.subdivisions
    .slice()
    .sort((a, b) => b.populationShare - a.populationShare)
    .slice(0, 5)
    .map((subdivision) => `${subdivision.name} - ${state.nations.get(subdivision.ownerId)?.name || "Unclaimed"} (${formatPopulation(territory.population * subdivision.populationShare)})`)
    .join(", ");
}

function nameIdeaSummary(nation) {
  const ideas = nation.nameIdeas?.filter((name) => name !== nation.name) || [];
  return ideas.slice(0, 8).join(", ") || "No alternates";
}

function meter(label, value) {
  const pct = clamp(value * 100, 0, 100);
  return `<div class="policy-meter"><header><span>${escapeHtml(label)}</span><strong>${Math.round(pct)}%</strong></header><div class="meter" style="--value:${pct}%"><span></span></div></div>`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderStats() {
  const alive = liveNations();
  const wars = uniqueWars();
  const gdp = alive.reduce((sum, nation) => sum + nation.gdp, 0);
  const population = alive.reduce((sum, nation) => sum + nation.population, 0);
  els.dateLabel.textContent = currentDateLabel();
  els.subtitle.textContent = state.running
    ? `${MAP_MODES[state.mapMode]} map running by ${timeStepLabel().toLowerCase()}`
    : `${MAP_MODES[state.mapMode]} map paused`;
  els.worldStats.innerHTML = [
    statChip("Nations", alive.length),
    statChip("Wars", wars.length),
    statChip("GDP", formatMoney(gdp)),
    statChip("People", formatPopulation(population)),
    statChip("FPS", state.fps),
  ].join("");
  els.ledgerStats.innerHTML = detailRows([
    ["Scenario", scenarioName(state.scenario)],
    ["Time Step", timeStepLabel()],
    ["Seed", state.seed],
    ["Treaties", alive.reduce((sum, nation) => sum + nation.allies.size, 0) / 2],
    ["Puppets", alive.filter((nation) => nation.overlordId).length],
  ]);
}

function statChip(label, value) {
  return `<div class="stat-chip"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function scenarioName(id) {
  return {
    regional: "Regional Powers",
    historic: "Modern States",
    continental: "Continental Blocs",
    fractured: "Fractured Empires",
    ww2: "World War II",
    rome: "Roman Europe",
    paxromana: "Pax Romana",
    romanschism: "Roman Schism",
    medieval: "Medieval Realms",
    coldwar: "Cold War Blocs",
    napoleonic: "Napoleonic Europe",
  }[id];
}

function timeStepLabel() {
  return TIME_STEP_OPTIONS[state.timeStepHours] || `${state.timeStepHours} hours`;
}

function renderLeaderboard() {
  const top = liveNations()
    .slice()
    .sort((a, b) => b.rating - a.rating || b.power - a.power)
    .slice(0, 8);
  els.powerCount.textContent = `${liveNations().length} alive`;
  els.leaderboard.innerHTML = top
    .map(
      (nation, index) => `
        <li class="leader-row" data-nation-id="${nation.id}">
          <span class="leader-swatch" style="background:${nation.color}"></span>
          <div>
            <div class="leader-name" title="${escapeHtml(nation.name)}">${index + 1}. ${escapeHtml(nation.name)}</div>
            <div class="leader-meta">${nation.territories.length} lands · ${nation.ideology.name}${nation.overlordId ? " · puppet" : ""} · ${nation.ratingGrade}</div>
          </div>
          <span class="leader-power">${nation.rating.toFixed(0)}</span>
        </li>`,
    )
    .join("");
}

function renderCountryGraphs() {
  const nations = liveNations();
  const graphDefs = [
    { key: "gdp", label: "GDP", value: (nation) => nation.gdp, format: formatMoney },
    { key: "army", label: "Military", value: (nation) => nation.militaryScore, format: (value) => `${value.toFixed(0)}` },
    { key: "stability", label: "Stability", value: (nation) => nation.stabilityScore, format: (value) => `${value.toFixed(0)}%` },
    { key: "population", label: "Population", value: (nation) => nation.population, format: formatPopulation },
  ];

  els.countryGraphs.innerHTML = graphDefs
    .map((graph) => {
      const sorted = nations
        .slice()
        .sort((a, b) => graph.value(b) - graph.value(a))
        .slice(0, 6);
      const maxValue = Math.max(1, ...sorted.map(graph.value));
      const rows = sorted
        .map((nation) => {
          const value = graph.value(nation);
          const pct = clamp((value / maxValue) * 100, 0, 100);
          return `<div class="graph-row" title="${escapeHtml(nation.name)}">
            <span class="graph-label">${escapeHtml(shortNationLabel(nation.name))}</span>
            <span class="graph-bar"><span style="--value:${pct}%"></span></span>
            <span class="graph-value">${escapeHtml(graph.format(value))}</span>
          </div>`;
        })
        .join("");
      return `<section class="graph-card" data-graph="${graph.key}">
        <div class="graph-title"><span>${escapeHtml(graph.label)}</span><span>${sorted.length} countries</span></div>
        ${rows}
      </section>`;
    })
    .join("");
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function eventLinkCacheKey() {
  return `${state.territories.length}|${state.nations.size}|${state.nextNationId}|${state.eventLog.length}`;
}

function eventLinkifier() {
  const key = eventLinkCacheKey();
  if (state.eventLinkCache?.key === key) return state.eventLinkCache;

  const labelMap = new Map();
  for (const territory of state.territories) {
    if (territory?.name) labelMap.set(territory.name, { type: "territory", id: territory.id, label: territory.name });
  }
  for (const nation of state.nations.values()) {
    if (!labelMap.has(nation?.name) && nation?.name) labelMap.set(nation.name, { type: "nation", id: nation.id, label: nation.name });
  }

  const keys = [...labelMap.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  state.eventLinkCache = {
    key,
    labelMap,
    re: keys.length ? new RegExp(`(${keys.join("|")})`, "g") : null,
  };
  return state.eventLinkCache;
}

function linkifyEventText(text, linkifier = eventLinkifier()) {
  if (!text) return "";
  if (!linkifier.re) return escapeHtml(text);

  let last = 0;
  let out = "";
  let m;
  const re = linkifier.re;
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) {
    const idx = m.index;
    const match = m[0];
    out += escapeHtml(text.slice(last, idx));
    const info = linkifier.labelMap.get(match);
    if (info) {
      if (info.type === "nation") {
        out += `<a href="#" class="event-link nation" data-nation-id="${info.id}">${escapeHtml(match)}</a>`;
      } else {
        out += `<a href="#" class="event-link territory" data-territory-id="${info.id}">${escapeHtml(match)}</a>`;
      }
    } else {
      out += escapeHtml(match);
    }
    last = idx + match.length;
  }
  out += escapeHtml(text.slice(last));
  return out;
}

function renderEventLog() {
  const linkifier = eventLinkifier();
  els.eventLog.innerHTML = state.eventLog
    .slice(0, 70)
    .map((event) => `<article class="log-entry ${event.type}"><time>${escapeHtml(event.date)}</time><span>${linkifyEventText(event.text, linkifier)}</span></article>`)
    .join("");
}

function renderHistory() {
  const width = historyCanvas.width;
  const height = historyCanvas.height;
  historyCtx.clearRect(0, 0, width, height);
  historyCtx.fillStyle = "#121412";
  historyCtx.fillRect(0, 0, width, height);
  drawHistoryLine("gdp", "#d8b84d", 0.68);
  drawHistoryLine("nations", "#58bfa6", 0.5);
  drawHistoryLine("wars", "#d76157", 0.42);
  historyCtx.fillStyle = "rgba(244,239,226,0.72)";
  historyCtx.font = "11px Inter, system-ui, sans-serif";
  historyCtx.fillText("GDP", 10, 18);
  historyCtx.fillText("Nations", 54, 18);
  historyCtx.fillText("Wars", 120, 18);
}

function drawHistoryLine(key, color, yScale) {
  const data = state.history;
  if (data.length < 2) return;
  const values = data.map((point) => point[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  historyCtx.save();
  historyCtx.strokeStyle = color;
  historyCtx.lineWidth = 1.6;
  historyCtx.beginPath();
  data.forEach((point, index) => {
    const x = 8 + (index / (data.length - 1)) * (historyCanvas.width - 16);
    const normalized = (point[key] - min) / span;
    const y = historyCanvas.height - 10 - normalized * (historyCanvas.height * yScale);
    if (index === 0) historyCtx.moveTo(x, y);
    else historyCtx.lineTo(x, y);
  });
  historyCtx.stroke();
  historyCtx.restore();
}

function syncControls() {
  els.playPauseIcon.textContent = state.running ? "Ⅱ" : "▶";
  els.mapModeSelect.value = state.mapMode;
  els.scenarioSelect.value = state.scenario;
  els.speedRange.value = state.speed;
  els.timeStepSelect.value = String(state.timeStepHours);
  document.querySelectorAll(".tool-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.activeTool);
  });
  els.toolHint.textContent = {
    inspect: "Inspect",
    annex: "Annex",
    liberate: "Liberate",
    boost: "Boost",
    agitate: "Agitate",
    fortify: "Fortify",
  }[state.activeTool];
}

function selectTerritory(id, subdivisionId = null) {
  const territory = state.territories[id];
  if (!territory) return;
  const subdivision = subdivisionId ? territory.subdivisions?.find((item) => item.id === subdivisionId) : null;
  state.selectedTerritoryId = id;
  state.selectedSubdivisionId = subdivision?.id ?? null;
  state.selectedNationId = subdivision?.ownerId ?? territory.ownerId;
  renderAll();
}

function territoryAt(x, y) {
  for (let i = state.territories.length - 1; i >= 0; i -= 1) {
    const territory = state.territories[i];
    const bounds = territory.screenBounds;
    if (bounds && (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY)) continue;
    if (territory.path && ctx.isPointInPath(territory.path, x, y, "evenodd")) return territory;
  }
  return null;
}

function subdivisionAt(territory, x, y) {
  if (!territory?.subdivisions?.length) return null;
  for (let i = territory.subdivisions.length - 1; i >= 0; i -= 1) {
    const subdivision = territory.subdivisions[i];
    if (subdivision.path && ctx.isPointInPath(subdivision.path, x, y, "evenodd")) return subdivision;
  }
  return null;
}

function mapSelectionAt(x, y) {
  const territory = territoryAt(x, y);
  if (!territory) return null;
  const subdivision = subdivisionAt(territory, x, y);
  return {
    territory,
    subdivision,
    ownerId: subdivision?.ownerId ?? territory.ownerId,
  };
}

function handleMapClick(event) {
  const point = canvasPoint(event);
  const hit = mapSelectionAt(point.x, point.y);
  const territory = hit?.territory || null;
  
  // Click on ocean deselects current selection
  if (!territory) {
    if (state.activeTool === "inspect") {
      state.selectedTerritoryId = null;
      state.selectedNationId = null;
      state.selectedSubdivisionId = null;
      renderAll();
      renderMap();
    }
    return;
  }

  if (state.activeTool === "inspect") {
    selectTerritory(territory.id, hit.subdivision?.id ?? null);
    return;
  }

  // Wars & Alliances mode: show war/alliance info
  if (state.mapMode === "warAlliances") {
    selectTerritory(territory.id, hit.subdivision?.id ?? null);
    return;
  }

  applyTool(territory);
}

function applyTool(territory) {
  const selectedNation = state.nations.get(state.selectedNationId);
  const owner = state.nations.get(territory.ownerId);
  if (state.activeTool === "annex" && selectedNation?.alive) {
    transferTerritory(territory.id, selectedNation.id, {
      reason: "annexed",
      event: `${selectedNation.name} receives ${territory.name} by decree.`,
    });
  }
  if (state.activeTool === "liberate") {
    liberateTerritory(territory);
  }
  if (state.activeTool === "boost") {
    territory.gdp *= 1.1;
    territory.infrastructure = clamp(territory.infrastructure + 0.08, 0.22, 1.62);
    territory.unrest = clamp(territory.unrest - 0.08, 0, 1);
    pushEvent("economy", `${territory.name} receives a development surge.`);
  }
  if (state.activeTool === "agitate") {
    territory.unrest = clamp(territory.unrest + 0.2, 0, 1);
    owner.stability = clamp(owner.stability - 0.02, 0, 1);
    pushEvent("revolt", `Unrest rises in ${territory.name}.`);
  }
  if (state.activeTool === "fortify") {
    territory.fortification = clamp(territory.fortification + 0.18, 0, 1);
    pushEvent("diplomacy", `${territory.name} strengthens its border defenses.`);
  }
  recalculateNationStats();
  selectTerritory(territory.id);
}

function liberateTerritory(territory) {
  const ideology = choice([IDEOLOGIES[0], IDEOLOGIES[1], IDEOLOGIES[5], IDEOLOGIES[3]]);
  const nation = createNation({
    name: makeNationName(territory.name, ideology.name),
    capitalId: territory.id,
    ideology,
    color: colorForIndex(state.nextNationId + territory.id),
    ambition: 0.32 + rng() * 0.38,
    stability: 0.48 + rng() * 0.26,
    treasury: 90 + rng() * 180,
  });
  transferTerritory(territory.id, nation.id, { reason: "liberated", quiet: true });
  territory.coreOwnerId = nation.id;
  territory.capital = true;
  pushEvent("diplomacy", `${nation.name} is proclaimed in ${territory.name}.`);
}

function stabilizeSelection() {
  const territory = state.territories[state.selectedTerritoryId];
  if (!territory) return;
  const nation = state.nations.get(territory.ownerId);
  territory.unrest = clamp(territory.unrest - 0.24, 0, 1);
  territory.infrastructure = clamp(territory.infrastructure + 0.03, 0.22, 1.62);
  nation.stability = clamp(nation.stability + 0.04, 0, 1);
  nation.treasury -= 35;
  pushEvent("economy", `${nation.name} stabilizes ${territory.name}.`);
  renderAll();
}

function fundRebelsSelection() {
  const territory = state.territories[state.selectedTerritoryId];
  if (!territory) return;
  territory.unrest = clamp(territory.unrest + 0.34, 0, 1);
  state.nations.get(territory.ownerId).legitimacy = clamp(
    state.nations.get(territory.ownerId).legitimacy - 0.04,
    0,
    1,
  );
  pushEvent("revolt", `Dissidents in ${territory.name} receive outside support.`);
  processRevolts();
  recalculateNationStats();
  renderAll();
}

function candidateWarTargetsForTerritory(territory, owner) {
  if (!territory || !owner) return [];
  const byNation = new Map();
  const addCandidate = (nation, territoryRef, distance = 0, maritime = false) => {
    if (!nation?.alive || nation.id === owner.id || owner.allies.has(nation.id)) return;
    const relation = getRelation(owner.id, nation.id);
    const seaPenalty = maritime ? 8 : 0;
    const score = relation + seaPenalty + distance / 90 - nation.power / Math.max(1, owner.power + nation.power) * 8;
    const existing = byNation.get(nation.id);
    if (!existing || score < existing.score) byNation.set(nation.id, { nation, territory: territoryRef, distance, score, maritime });
  };

  for (const neighborId of territory.neighbors || []) {
    const neighbor = state.territories[neighborId];
    const nation = state.nations.get(neighbor?.ownerId);
    const maritime = territory.maritimeNeighbors?.includes(neighborId);
    addCandidate(nation, neighbor, neighbor ? haversine(territory.geoCentroid, neighbor.geoCentroid) : 0, maritime);
  }

  const seaLimit = isIslandLikeTerritory(territory) ? 2600 : 1450;
  for (const other of state.territories) {
    if (other.id === territory.id) continue;
    const nation = state.nations.get(other.ownerId);
    if (!nation?.alive || nation.id === owner.id) continue;
    const distance = haversine(territory.geoCentroid, other.geoCentroid);
    if (distance > seaLimit) continue;
    addCandidate(nation, other, distance, true);
  }

  return [...byNation.values()].sort((a, b) => a.score - b.score);
}

function inciteWarSelection() {
  const territory = state.territories[state.selectedTerritoryId];
  if (!territory) return;
  const sub = selectedSubdivision();
  const owner = state.nations.get(sub?.ownerId ?? territory.ownerId);
  const target = candidateWarTargetsForTerritory(territory, owner)[0]?.nation;
  if (!owner || !target) return;
  setRelation(owner.id, target.id, -88);
  startWar(owner.id, target.id, "manufactured crisis");
  renderAll();
}
function puppetSelection() {
  const territory = state.territories[state.selectedTerritoryId];
  if (!territory) return;
  const subject = state.nations.get(selectedSubdivision()?.ownerId ?? territory.ownerId);
  const overlord = candidateWarTargetsForTerritory(territory, subject)
    .map((candidate) => candidate.nation)
    .sort((a, b) => b.power - a.power)[0];
  if (!overlord) return;
  makePuppet(subject.id, overlord.id);
  pushEvent("diplomacy", `${subject.name} becomes a puppet of ${overlord.name}.`);
  renderAll();
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function updateTooltip(event) {
  const point = canvasPoint(event);
  const previousTerritoryId = state.hoveredTerritoryId;
  const previousSubdivisionId = state.hoveredSubdivisionId;
  const hit = mapSelectionAt(point.x, point.y);
  const territory = hit?.territory || null;
  const sub = hit?.subdivision || null;
  state.hoveredTerritoryId = territory?.id ?? null;
  state.hoveredSubdivisionId = sub?.id ?? null;
  const hoverChanged =
    previousTerritoryId !== state.hoveredTerritoryId ||
    previousSubdivisionId !== state.hoveredSubdivisionId;
  if (!territory) {
    els.mapTooltip.hidden = true;
    if (hoverChanged) renderMap();
    return;
  }

  const nation = state.nations.get(hit.ownerId);
  const conquered = territory.originalOwnerId != null && territory.ownerId !== territory.originalOwnerId;
  let topSubdivision = sub || null;
  if (!topSubdivision && state.mapMode === "population" && territory.subdivisions?.length) {
    for (const item of territory.subdivisions) {
      if (!topSubdivision || item.populationShare > topSubdivision.populationShare) topSubdivision = item;
    }
  }
  els.mapTooltip.hidden = false;
  els.mapTooltip.style.left = `${Math.min(point.x + 14, canvas.width - 252)}px`;
  els.mapTooltip.style.top = `${Math.min(point.y + 14, canvas.height - 112)}px`;
  els.mapTooltip.innerHTML = `
    <strong>${escapeHtml(sub?.name || territory.name)}</strong>
    ${escapeHtml(nation?.name || "Unclaimed")}<br />
    ${sub ? `${escapeHtml(territory.originalName)} subdivision<br />` : ""}
    ${conquered ? `Originally ${escapeHtml(territory.originalName)}<br />` : ""}
    ${state.mapMode === "population" && topSubdivision ? `${escapeHtml(topSubdivision.name)} ${escapeHtml(formatPopulation(territory.population * topSubdivision.populationShare))}<br />` : ""}
    GDP ${escapeHtml(formatMoney(territory.gdp))} · Unrest ${Math.round(territory.unrest * 100)}%
  `;
  if (hoverChanged) renderMap();
}

function zoomBy(multiplier) {
  state.view.zoom = clamp(state.view.zoom * multiplier, 0.72, 7);
  renderMap();
}

function saveGame() {
  recalculateNationStats();
  const payload = {
    version: 1,
    seed: state.seed,
    scenario: state.scenario,
    year: state.year,
    month: state.month,
    day: state.day,
    hour: state.hour,
    elapsedHours: state.elapsedHours,
    lastHistoryHours: state.lastHistoryHours,
    timeStepHours: state.timeStepHours,
    nextNationId: state.nextNationId,
    running: state.running,
    mapMode: state.mapMode,
    selectedTerritoryId: state.selectedTerritoryId,
    selectedSubdivisionId: state.selectedSubdivisionId,
    territories: state.territories.map((territory) => ({
      id: territory.id,
      ownerId: territory.ownerId,
      coreOwnerId: territory.coreOwnerId,
      previousOwnerId: territory.previousOwnerId,
      ownerHistory: territory.ownerHistory || [],
      originalOwnerId: territory.originalOwnerId ?? null,
      originalName: territory.originalName ?? territory.name,
      name: territory.name,
      longName: territory.longName,
      iso2: territory.iso2,
      gdp: territory.gdp,
      population: territory.population,
      infrastructure: territory.infrastructure,
      unrest: territory.unrest,
      fortification: territory.fortification,
      occupation: territory.occupation,
      contestedById: territory.contestedById,
      contestedFromId: territory.contestedFromId,
      contestedProgress: territory.contestedProgress,
      contestedUpdatedAt: territory.contestedUpdatedAt,
      captureFlash: territory.captureFlash,
      subdivisionsType: territory.subdivisionsType || "Subdivision",
      subdivisionSource: territory.subdivisionSource || "unknown",
      subdivisionsTemplate: territory.subdivisionsTemplate || [],
      subdivisions: (territory.subdivisions || []).map((subdivision) => {
        const { path, ...rest } = subdivision;
        return rest;
      }),
      capital: territory.capital,
    })),
    nations: [...state.nations.values()].map((nation) => ({
      ...nation,
      ideology: nation.ideology.name,
      allies: [...nation.allies],
      rivals: [...nation.rivals],
      puppets: [...nation.puppets],
      wars: [...nation.wars],
    })),
    relations: [...state.relations],
    eventLog: state.eventLog,
    history: state.history,
  };
  localStorage.setItem("worldline-conflict-save", JSON.stringify(payload));
  pushEvent("diplomacy", "The world state is saved.");
}

function loadGame() {
  const raw = localStorage.getItem("worldline-conflict-save");
  if (!raw) return;
  const payload = JSON.parse(raw);
  state.seed = payload.seed;
  rng = mulberry32(state.seed);
  state.scenario = payload.scenario;
  state.elapsedHours =
    payload.elapsedHours ??
    ((payload.year ?? EPOCH_YEAR) - EPOCH_YEAR) * 12 * HOURS_PER_MONTH +
      (payload.month ?? 0) * HOURS_PER_MONTH;
  syncCalendarFromHours();
  state.lastHistoryHours = payload.lastHistoryHours ?? null;
  state.timeStepHours = payload.timeStepHours ?? 1;
  state.nextNationId = payload.nextNationId;
  state.running = payload.running;
  state.mapMode = payload.mapMode;
  // military unit toggle removed; no-op
  state.selectedTerritoryId = payload.selectedTerritoryId;
  state.selectedSubdivisionId = payload.selectedSubdivisionId ?? null;
  state.selectedNationId = null;
  state.nations = new Map();
  state.relations = new Map(payload.relations);
  state.eventLog = payload.eventLog || [];
  state.history = payload.history || [];

  for (const data of payload.nations) {
    const ideology = IDEOLOGIES.find((item) => item.name === data.ideology) || IDEOLOGIES[0];
    state.nations.set(data.id, {
      ...data,
      ideology,
      allies: new Set(data.allies),
      rivals: new Set(data.rivals),
      puppets: new Set(data.puppets),
      wars: new Map(data.wars),
    });
  }

  for (const data of payload.territories) {
    const territory = state.territories[data.id];
    Object.assign(territory, data);
    territory.contestedById ??= null;
    territory.contestedFromId ??= null;
    territory.contestedProgress ??= 0;
    territory.contestedUpdatedAt ??= 0;
    territory.captureFlash ??= 0;
    territory.ownerHistory = data.ownerHistory ?? territory.ownerHistory ?? [];
    territory.originalOwnerId = data.originalOwnerId ?? territory.originalOwnerId ?? null;
    territory.originalName = data.originalName ?? territory.originalName ?? territory.name;
    territory.iso2 = data.iso2 ?? territory.iso2 ?? "";
    territory.subdivisionsType = data.subdivisionsType ?? territory.subdivisionsType ?? "Subdivision";
    territory.subdivisionSource = data.subdivisionSource ?? territory.subdivisionSource ?? "unknown";
    territory.subdivisionsTemplate = data.subdivisionsTemplate ?? territory.subdivisionsTemplate ?? [];
    territory.subdivisions = data.subdivisions ?? territory.subdivisions ?? [];
    for (const subdivision of territory.subdivisions || []) {
      subdivision.path = null;
      if (subdivision.geoRings && !subdivision.projectedRings) {
        subdivision.projectedRings = subdivision.geoRings.map((ring) => ring.map(([lon, lat]) => robinsonProject(lon, lat)));
        subdivision.centroidProjected = representativePoint(subdivision.projectedRings);
      }
    }
    if (!territory.subdivisions?.length) ensureTerritorySubdivisions(territory, territory.ownerId);
    updateTerritoryRulerName(territory);
  }

  recalculateNationStats();
  if (state.selectedTerritoryId != null) {
    const selectedTerritory = state.territories[state.selectedTerritoryId];
    const loadedSubdivision = selectedTerritory?.subdivisions?.find((item) => item.id === state.selectedSubdivisionId);
    state.selectedNationId = loadedSubdivision?.ownerId ?? selectedTerritory?.ownerId ?? null;
  }
  pushEvent("diplomacy", "The saved world state is restored.");
  startLoop();
  renderAll();
}

function bindEvents() {
  window.addEventListener("resize", resizeCanvas);
  els.playPauseBtn.addEventListener("click", () => {
    state.running = !state.running;
    syncControls();
  });
  els.stepBtn.addEventListener("click", () => advanceTime(state.timeStepHours, { forceRender: true }));
  els.speedRange.addEventListener("input", () => {
    state.speed = Number(els.speedRange.value);
    startLoop();
  });
  els.timeStepSelect.addEventListener("change", () => {
    state.timeStepHours = Number(els.timeStepSelect.value);
    syncControls();
  });
  // military toggle removed
  els.mapModeSelect.addEventListener("change", () => {
    state.mapMode = els.mapModeSelect.value;
    renderAll();
  });
  els.countrySearch.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      state.selectedTerritoryId = null;
      state.selectedNationId = null;
      renderAll();
      renderMap();
      return;
    }
    // Search for unconquered countries (capitals only to find nations)
    for (const nation of state.nations.values()) {
      if (!nation.alive) continue;
      if (nation.name.toLowerCase().includes(query)) {
        const capital = state.territories[nation.capitalId];
        if (capital) {
          selectTerritory(capital.id);
          break;
        }
      }
    }
    // Also search for territories
    for (const territory of state.territories) {
      if (territory.name.toLowerCase().includes(query)) {
        selectTerritory(territory.id);
        break;
      }
    }
  });
  els.scenarioSelect.addEventListener("change", () => {
    state.scenario = els.scenarioSelect.value;
  });
  els.newWorldBtn.addEventListener("click", () => {
    initializeGame({ scenario: els.scenarioSelect.value });
  });
  els.saveBtn.addEventListener("click", saveGame);
  els.loadBtn.addEventListener("click", loadGame);
  els.clearLogBtn.addEventListener("click", () => {
    state.eventLog = [];
    renderEventLog();
  });
  els.stabilizeBtn.addEventListener("click", stabilizeSelection);
  els.fundRebelsBtn.addEventListener("click", fundRebelsSelection);
  els.inciteWarBtn.addEventListener("click", inciteWarSelection);
  els.puppetBtn.addEventListener("click", puppetSelection);
  els.zoomInBtn.addEventListener("click", () => zoomBy(1.25));
  els.zoomOutBtn.addEventListener("click", () => zoomBy(0.8));
  els.resetViewBtn.addEventListener("click", () => {
    state.view = { zoom: 1, panX: 0, panY: 0 };
    renderMap();
  });

  document.querySelectorAll(".tool-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTool = button.dataset.tool;
      syncControls();
    });
  });

  els.leaderboard.addEventListener("click", (event) => {
    const row = event.target.closest("[data-nation-id]");
    if (!row) return;
    const nation = state.nations.get(Number(row.dataset.nationId));
    if (!nation) return;
    state.selectedNationId = nation.id;
    state.selectedTerritoryId = nation.capitalId;
    renderAll();
  });

  // clickable nation/territory links in event log
  els.eventLog.addEventListener("click", (e) => {
    const a = e.target.closest("a.event-link");
    if (!a) return;
    e.preventDefault();
    if (a.dataset.nationId) {
      const id = Number(a.dataset.nationId);
      if (!Number.isNaN(id)) {
        state.selectedNationId = id;
        state.selectedTerritoryId = state.nations.get(id)?.capitalId ?? null;
        renderAll();
      }
    } else if (a.dataset.territoryId) {
      const tid = Number(a.dataset.territoryId);
      if (!Number.isNaN(tid)) {
        state.selectedTerritoryId = tid;
        state.selectedNationId = state.territories[tid]?.ownerId ?? null;
        renderAll();
      }
    }
  });

  // clickable owner links in the selection details
  els.selectionDetails.addEventListener("click", (e) => {
    const a = e.target.closest("a.link-nation");
    if (!a) return;
    e.preventDefault();
    const id = Number(a.dataset.nationId);
    if (!Number.isNaN(id)) {
      state.selectedNationId = id;
      state.selectedTerritoryId = state.nations.get(id)?.capitalId ?? null;
      renderAll();
    }
  });

  canvas.addEventListener("click", handleMapClick);
  canvas.addEventListener("mousemove", (event) => {
    if (state.dragging) {
      const point = canvasPoint(event);
      const dx = point.x - state.lastPointer.x;
      const dy = point.y - state.lastPointer.y;
      state.lastPointer = point;
      state.view.panX += dx;
      state.view.panY += dy;
      renderMap();
      return;
    }
    updateTooltip(event);
  });
  canvas.addEventListener("mouseleave", () => {
    state.hoveredTerritoryId = null;
    els.mapTooltip.hidden = true;
    state.dragging = false;
    canvas.classList.remove("dragging");
    renderMap();
  });
  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.lastPointer = canvasPoint(event);
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("dragging");
  });
  canvas.addEventListener("pointerup", (event) => {
    state.dragging = false;
    canvas.releasePointerCapture(event.pointerId);
    canvas.classList.remove("dragging");
  });
  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const before = canvasPoint(event);
      const previousZoom = state.view.zoom;
      const multiplier = event.deltaY < 0 ? 1.12 : 0.9;
      state.view.zoom = clamp(state.view.zoom * multiplier, 0.72, 7);
      const ratio = state.view.zoom / previousZoom;
      state.view.panX = before.x - (before.x - state.view.panX - canvas.width / 2) * ratio - canvas.width / 2;
      state.view.panY = before.y - (before.y - state.view.panY - canvas.height / 2) * ratio - canvas.height / 2;
      renderMap();
    },
    { passive: false },
  );
}

function boot() {
  if (!window.WORLD_COUNTRIES?.features?.length) {
    document.body.innerHTML = "<main class='load-error'>Country data could not be loaded.</main>";
    return;
  }
  const prepared = prepareTerritories(window.WORLD_COUNTRIES);
  state.territories = prepared.territories;
  state.worldBounds = prepared.bounds;
  bindEvents();
  resizeCanvas();
  initializeGame({ scenario: state.scenario, seed: state.seed });
  startVisualLoop();
}

boot();




















