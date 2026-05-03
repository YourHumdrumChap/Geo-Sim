const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(projectRoot, "data", "admin1.geojson");
const targetPath = path.join(projectRoot, "data", "admin1-summary.js");

function clean(value, fallback = "") {
  return String(value ?? fallback)
    .replace(/\s+/g, " ")
    .trim();
}

function pushEntry(group, entry) {
  const key = `${entry.name}|${entry.type}`;
  if (!group._seen.has(key)) {
    group._seen.add(key);
    group.list.push(entry);
  }
}

function sortable(entries) {
  return entries.slice().sort((a, b) => a.name.localeCompare(b.name));
}

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const isoGroups = new Map();
const iso3Groups = new Map();
const adminGroups = new Map();

for (const feature of source.features || []) {
  const props = feature?.properties || {};
  const iso = clean(props.iso_a2 || props.adm0_a3 || props.sov_a3 || "");
  const iso3 = clean(props.adm0_a3 || props.sov_a3 || "");
  const adminName = clean(props.admin || props.geonunit || props.name_en || props.name || "");
  const name = clean(props.name_en || props.name || props.gn_name || props.name_alt || "");
  const type = clean(props.type_en || props.type || "Subdivision", "Subdivision");

  if (!name) continue;
  const entry = { name, type };

  if (iso) {
    if (!isoGroups.has(iso)) isoGroups.set(iso, { list: [], _seen: new Set() });
    pushEntry(isoGroups.get(iso), entry);
  }

  if (iso3) {
    if (!iso3Groups.has(iso3)) iso3Groups.set(iso3, { list: [], _seen: new Set() });
    pushEntry(iso3Groups.get(iso3), entry);
  }

  if (adminName) {
    if (!adminGroups.has(adminName)) adminGroups.set(adminName, { list: [], _seen: new Set() });
    pushEntry(adminGroups.get(adminName), entry);
  }
}

const byIso = Object.fromEntries(
  [...isoGroups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([iso, group]) => [iso, sortable(group.list)]),
);
const byIso3 = Object.fromEntries(
  [...iso3Groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([iso, group]) => [iso, sortable(group.list)]),
);
const byAdmin = Object.fromEntries(
  [...adminGroups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([admin, group]) => [admin, sortable(group.list)]),
);

const payload = {
  byIso,
  byIso3,
  byAdmin,
  meta: {
    source: "Natural Earth Admin-1",
    builtAt: new Date().toISOString(),
    countries: Object.keys(byIso).length,
    countriesIso3: Object.keys(byIso3).length,
    countryNames: Object.keys(byAdmin).length,
    count: source.features?.length || 0,
  },
};

fs.writeFileSync(targetPath, `window.WORLD_ADMIN1_SUMMARY=${JSON.stringify(payload)};`, "utf8");
console.log(`Wrote ${targetPath}`);
console.log(`Countries: ${payload.meta.countries}, entries: ${payload.meta.count}`);
