#!/usr/bin/env python3
import json, os, re, sys, datetime
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source_path = os.path.join(root, 'data', 'admin1.geojson')
target_path = os.path.join(root, 'data', 'admin1-summary.js')

def clean(value, fallback=""):
    v = value if value is not None else fallback
    s = str(v)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

iso_groups = {}
iso3_groups = {}
admin_groups = {}

if not os.path.exists(source_path):
    print('Source file not found:', source_path)
    sys.exit(1)

with open(source_path, 'r', encoding='utf8') as f:
    source = json.load(f)

for feature in source.get('features', []):
    props = feature.get('properties', {}) or {}
    iso = clean(props.get('iso_a2') or props.get('adm0_a3') or props.get('sov_a3') or "")
    iso3 = clean(props.get('adm0_a3') or props.get('sov_a3') or "")
    adminName = clean(props.get('admin') or props.get('geonunit') or props.get('name_en') or props.get('name') or "")
    name = clean(props.get('name_en') or props.get('name') or props.get('gn_name') or props.get('name_alt') or "")
    typev = clean(props.get('type_en') or props.get('type') or "Subdivision", "Subdivision")
    if not name:
        continue
    entry = {'name': name, 'type': typev}
    if iso:
        g = iso_groups.setdefault(iso, {'list': [], '_seen': set()})
        key = f"{entry['name']}|{entry['type']}"
        if key not in g['_seen']:
            g['_seen'].add(key)
            g['list'].append(entry)
    if iso3:
        g = iso3_groups.setdefault(iso3, {'list': [], '_seen': set()})
        key = f"{entry['name']}|{entry['type']}"
        if key not in g['_seen']:
            g['_seen'].add(key)
            g['list'].append(entry)
    if adminName:
        g = admin_groups.setdefault(adminName, {'list': [], '_seen': set()})
        key = f"{entry['name']}|{entry['type']}"
        if key not in g['_seen']:
            g['_seen'].add(key)
            g['list'].append(entry)


def sortable(entries):
    return sorted(entries, key=lambda x: x['name'])

byIso = {k: sortable(v['list']) for k, v in iso_groups.items()}
byIso3 = {k: sortable(v['list']) for k, v in iso3_groups.items()}
byAdmin = {k: sortable(v['list']) for k, v in admin_groups.items()}
payload = {
    'byIso': byIso,
    'byIso3': byIso3,
    'byAdmin': byAdmin,
    'meta': {
        'source': 'Natural Earth Admin-1',
        'builtAt': datetime.datetime.utcnow().isoformat() + 'Z',
        'countries': len(byIso),
        'countriesIso3': len(byIso3),
        'countryNames': len(byAdmin),
        'count': len(source.get('features', [])),
    }
}

with open(target_path, 'w', encoding='utf8') as f:
    f.write('window.WORLD_ADMIN1_SUMMARY=' + json.dumps(payload, ensure_ascii=False) + ';')

print('Wrote', target_path)
print('Countries:', payload['meta']['countries'], 'entries:', payload['meta']['count'])
