#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
TARGET = (ROOT / "index.html").resolve().as_uri()

def main():
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1440, "height": 900})

            page.on("console", lambda msg: print(f"PAGE_CONSOLE {msg.type}: {msg.text}"))
            page.on("pageerror", lambda err: print(f"PAGE_ERROR: {err}"))

            page.goto(TARGET, wait_until="load", timeout=30_000)
            page.wait_for_selector("#worldCanvas", timeout=20_000)
            page.wait_for_timeout(800)

            # Pause simulation
            page.click("#playPauseBtn")

            forced_war = page.evaluate("""() => {
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
            }""")

            # Step forward a bunch
            for _ in range(240):
                page.click("#stepBtn")

            war_evolution = page.evaluate("""() => {
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
            }""")

            subdivisions = page.evaluate("""() => {
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
            }""")

            result = {"forcedWar": forced_war, "warEvolution": war_evolution, "subdivisions": subdivisions}
            print(json.dumps(result, indent=2))

            browser.close()
    except Exception as exc:
        print("ERROR:", exc)
        sys.exit(1)

if __name__ == '__main__':
    main()
