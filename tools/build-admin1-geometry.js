const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const inputPath = path.join(root, "data/admin1.geojson");
const outputPath = path.join(root, "data/admin1-geometry.js");
const MAX_RINGS_PER_FEATURE = 6;
const MAX_POINTS_PER_RING = 70;

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function roundCoord(value) {
  return Math.round(Number(value) * 10000) / 10000;
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const next = (i + 1) % ring.length;
    area += ring[i][0] * ring[next][1] - ring[next][0] * ring[i][1];
  }
  return Math.abs(area / 2);
}

function simplifyRing(ring) {
  if (!Array.isArray(ring) || ring.length < 4) return null;
  const step = Math.max(1, Math.ceil(ring.length / MAX_POINTS_PER_RING));
  const simplified = [];
  for (let i = 0; i < ring.length; i += step) {
    const point = ring[i];
    if (!point || point.length < 2) continue;
    const next = [roundCoord(point[0]), roundCoord(point[1])];
    const last = simplified[simplified.length - 1];
    if (!last || last[0] !== next[0] || last[1] !== next[1]) simplified.push(next);
  }
  const first = simplified[0];
  const last = simplified[simplified.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) simplified.push([...first]);
  return simplified.length >= 4 ? simplified : null;
}

function outerRings(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return [geometry.coordinates?.[0]].filter(Boolean);
  if (geometry.type === "MultiPolygon") return (geometry.coordinates || []).map((polygon) => polygon?.[0]).filter(Boolean);
  return [];
}

function compactRings(geometry) {
  return outerRings(geometry)
    .map((ring) => ({ ring, area: ringArea(ring) }))
    .sort((a, b) => b.area - a.area)
    .slice(0, MAX_RINGS_PER_FEATURE)
    .map(({ ring, area }) => ({ ring: simplifyRing(ring), area }))
    .filter((item) => item.ring);
}

function pushEntry(bucket, key, entry) {
  if (!key) return;
  if (!bucket[key]) bucket[key] = [];
  bucket[key].push(entry);
}

const geojson = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const out = { byIso: {}, byIso3: {}, byAdmin: {}, meta: { generated: new Date().toISOString(), features: 0 } };

for (const feature of geojson.features || []) {
  const props = feature.properties || {};
  const name = String(props.name_en || props.name || props.gn_name || props.name_alt || "").trim();
  if (!name) continue;
  const ringsWithArea = compactRings(feature.geometry);
  if (!ringsWithArea.length) continue;
  const weight = Math.max(0.1, ringsWithArea.reduce((sum, item) => sum + item.area, 0));
  const entry = {
    name,
    type: String(props.type_en || props.type || "Subdivision").trim() || "Subdivision",
    weight,
    gdpWeight: weight,
    rings: ringsWithArea.map((item) => item.ring),
  };
  const iso2 = String(props.iso_a2 || "").toUpperCase();
  const iso3 = String(props.adm0_a3 || props.iso_a3 || props.sov_a3 || "").toUpperCase();
  const admin = normalizeKey(props.admin || props.geonunit || props.admin_name || "");
  pushEntry(out.byIso, iso2, entry);
  pushEntry(out.byIso3, iso3, entry);
  pushEntry(out.byAdmin, admin, entry);
  out.meta.features += 1;
}

for (const bucket of [out.byIso, out.byIso3, out.byAdmin]) {
  for (const key of Object.keys(bucket)) {
    bucket[key].sort((a, b) => a.name.localeCompare(b.name));
  }
}

const text = `window.WORLD_ADMIN1_GEOMETRY = ${JSON.stringify(out)};\n`;
fs.writeFileSync(outputPath, text, "utf8");
console.log(`Wrote ${outputPath} with ${out.meta.features} admin-1 geometries (${Math.round(text.length / 1024)} KiB).`);

