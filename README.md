# Worldline Conflict Simulator

A browser-based world war sandbox inspired by observer-style map simulators. It uses the included Natural Earth country GeoJSON and level1 administration for real national borders, then runs an original AI simulation over those territories.

## Run

Open `index.html` directly in a modern browser, or use the tiny static server:

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

If the Windows `node` app alias is blocked, use any local static server from this folder. The app has no package dependencies.

## Systems

- Real country polygons from `data/countries.geojson`
- Robinson-projected canvas map with pan, zoom, tooltips, owner-level borders, and map modes
- Hour-based simulation clock with selectable hour, day, week, and month steps
- AI nations with ideology, tax, conscription, stability, legitimacy, tech, treasury, armies, and ambition
- Diplomacy with alliances, rivals, puppet states, relations, ceasefires, and peace
- Alliance, puppet, religion, population, GDP, stability, unrest, and war-front map modes
- Border wars with animated front pressure, live contested borders, admin-1 occupation, conquest, capitulation, annexation, and puppet outcomes
- Economy with GDP growth, infrastructure, trade access, debt pressure, war exhaustion, unrest, tribute, maintenance, and recruitment
- Domestic ideological shifts driven by war exhaustion, debt, unrest, prosperity, diplomacy, and legitimacy
- Behavior-aware country renaming with country-specific alternatives and universal future names
- Toggleable real-time military unit markers inspired by the included unit-symbol reference
- Revolts and civil wars driven by unrest and instability
- God tools for annexing, liberating, boosting, agitating, fortifying, stabilizing, funding rebels, puppeting, and inciting wars
- Save/load through browser local storage

## Scenarios

- Modern States
- Regional Powers
- Continental Blocs
- Fractured Empires
- Roman Europe
- Medieval Realms
- Cold War Blocs
- Napoleonic Europe
- WWII


## TODO LIST
- add more optimization and ways to increase frames per second
- add fps counter
- add world wraps around the sides of map and through poles
- add faint longitude and latitude lines
- two roman scenarios, one before the great schism during pax romana and one after
- why can't countries in the carribean attack anyone or be attacked?
- why does gdp fall during wars?
- update everything in the README
- add landmass graph
- on app start, default to paused game
- update world ledger graph
- update some of the scenarios so that only the important parts of the map(for that specific scenario) is in play and cut off the rest of the map. For example, the medieval realms scenario should only have Europe as the map, not the whole globe.