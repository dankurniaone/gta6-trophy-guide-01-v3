# gta6-trophy-guide-01-v3

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dankurniaone/gta6-trophy-guide-01-v3/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dankurniaone/gta6-trophy-guide-01-v3/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legend is a free, offline GTA VI trophy guide and tracker for PlayStation 5: all 55 official trophies with their names, descriptions and grades, an own-words guide to each one that cites its source, a six-stage road to the Platinum, the one possibly missable trophy flagged, and a tracker that saves your progress in the browser with export and import. No network, no account, no ads.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` into the output directory and writes `out/dossier.json`. To use the guide itself, serve `app/` from any static server and open `index.html` in a desktop browser — for example:

```sh
python3 -m http.server 8000 --directory app
```

Then open http://localhost:8000 in Chrome. Everything works with the network off.

## What is inside

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 27 visible and 28 hidden. Each card shows the official name, description and grade, an own-words guide, and the source it cites (Exophase, PSNProfiles, PowerPyx, Push Square or GTA BOOM).
- **The road to the Platinum** — six stages in the order that wastes the least time: first steps, the story start to finish, the eight stranger strands, collectibles and the map, activities and mastery, then the Platinum itself. Click a stage to filter the list to it. PowerPyx rates the Platinum near 200 hours at difficulty 4/10; one playthrough is enough.
- **The missable one, flagged** — Positive Mental Attitude (meditate at every spot across Leonida) is the only trophy reported as possibly missable (PowerPyx, GTABase). The guide tells you to keep a manual save at the start of each chapter and to meditate at every spot you find as you go.
- **A tracker that remembers** — check off trophies as you earn them; progress is saved in localStorage, with export and import as JSON and a reset. Filters by kind (story, collectibles, activities), by missable, by hidden, by stage, and by search. A spoiler setting hides story trophies until you earn them.
- **Honest gaps** — six trophies have no publicly confirmed unlock method yet (Personal Best, Actions Speak Louder, Bad Luck I Guess, The Truth Is Out There, Catch Me If You Can, Challenging Tank). Their cards say so instead of guessing. For Personal Best the two published theories are given side by side (PowerPyx: max Strength on both characters; Push Square: max body fat).

## Rules of the road

- Cheats disable trophies and saving — leave them off for a trophy run.
- Keep a manual save at the start of each chapter (see the missable trophy above).
- There are no online trophies; all 55 are earned in single-player.

## Sources

Trophy names, descriptions and grades as reported from PlayStation Network by Exophase, cross-checked with PSNProfiles and TrueAchievements (18 November 2026). Method notes from PowerPyx, Push Square and GTA BOOM where cited on each card. Guides are written in the author's own words; nothing here copies another guide's text.

## Layout

- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts`.
- `app/index.html`, `app/style.css`, `app/app.js` — the guide and tracker (static, no build step, no network requests).
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, hidden flag, kind, stage, missable flag, own-words guide and source.
- `screenshots/` — four renders of the running app (cover, roadmap, missable, tracker).
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## License

MIT. See `LICENSE`. Leonida Legend is an unofficial fan guide. Grand Theft Auto, GTA and Rockstar Games are trademarks of their owners.

---

<sub>Entered on [make.fun](https://make.fun/?ref=adyjn11j&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
