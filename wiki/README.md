# President Material — Project Wiki

*A political-career simulation game that runs entirely in the browser.*

> **One goal: the presidency.** You create a character at age 30, choose a party,
> get dealt a starting hand of traits, then climb the ladder from local activist to
> President of the Republic — one season at a time — through events,
> elections, money, alliances, betrayals, scandals and the slow erosion of age.

This wiki is the map of the codebase: how it's structured, how the game loop works,
what the rules are, and how to add content without touching engine code.

---

## The 30-second mental model

- **No build, no server, no dependencies.** Pure HTML/CSS/vanilla JS. You open
  `index.html` by double-clicking it. That single constraint explains almost every
  design decision (e.g. why data files are `.js` and not `.json`).
- **Data is separated from logic, and numbers from both.** Content lives in `*.data.js`
  files as strict JSON-shaped objects; every balancing knob lives in
  [balance.js](../js/balance.js) and nowhere else. The rules that *read* both live in a
  few calculation files. The engine is isolated in `game.js`; everything that produces
  HTML lives in `js/game/render/`; and each **set piece** of the game — a presidential campaign, an
  ordinary race, a primary, a refused nomination — owns a file in `js/game/modes/`
  that registers itself with the engine.
- **Adding content requires no code.** New events, traits, parties, endings, names,
  and budget tiers are all data entries. The engine interprets them — and a form-based
  **event editor** (`tools/event-editor.html`, double-click) makes writing events
  point-and-click.
- **Everything is bilingual (FR/EN).** Every player-facing string is either a
  dictionary key (`t("...")`) or an inline `{ fr, en }` object read by `L(...)`.

---

## Page flow

The game is four pages the player walks through in order, plus the landing page and the honours cabinet hanging off it:

```
index.html ──▶ create.html ──▶ party.html ──▶ tirage.html ──▶ game.html
 (landing)     (character)      (party)        (the draw)      (the loop)
     │
     └──▶ achievements.html   (the honours cabinet, a dead end by design)
```

State is handed between pages through `localStorage`, not a router or framework.

| Page | Role | Controller |
|------|------|-----------|
| [index.html](../index.html) | Landing / pitch | [script.js](../js/script.js) only |
| [create.html](../create.html) | Build the character (identity, origin, background, personality) | [create.js](../js/create.js) |
| [party.html](../party.html) | Pick a starting party; see fit & difficulty | [party.js](../js/party.js) |
| [tirage.html](../tirage.html) | Reveal the two random birth traits + chosen character trait | [tirage.js](../js/tirage.js) |
| [game.html](../game.html) | The turn-by-turn game loop | [game.js](../js/game.js) |
| [achievements.html](../achievements.html) | The honours cabinet, reached by a button on the landing page. Off the flow: it is not a step, and nothing leads back into one from it | [achievements.js](../js/achievements.js) |

---

## File map

### Content (pure data — edit freely, no code needed)
| File | Contains |
|------|----------|
| [js/events/](../js/events/) | **391 events** across 7 decks (`events`, `campaign`, `runoff`, `nomination`, `support`, `aside`, `races`). Split by theme into 15 files (`debuts`, `medias`, `argent`, `appareil`, `arbitrages`, `epoque`, `chaines`, `assemblee`, …) plus one file per auxiliary deck, all reassembled into `EVENT_DATA` by `_assemble.data.js`. The engine still reads a single `EVENT_DATA`. |
| [js/traits.data.js](../js/traits.data.js) | All traits (character, physical, talent, party, reputation, money) |
| [js/endings.data.js](../js/endings.data.js) | The narrated end-of-game screens, chosen by final state |
| [js/budget.data.js](../js/budget.data.js) | Salaries, lifestyle, and the adjustable spending tiers |
| [js/names.data.js](../js/names.data.js) | Name pools for the random name generator |
| [js/achievements.data.js](../js/achievements.data.js) | The honours the game awards. Empty for now: the cabinet is built, the medals are not written |

### Balance & rules (numbers, then the logic that reads them; no DOM in either)
| File | Contains |
|------|----------|
| [js/balance.js](../js/balance.js) | **Every tuning constant in the game** — 107 of them, and nothing else. Scale, pace, gauge drift, opinion spread, election weights, result curves, fatigue, criticals. Loads first, before `data.js`. This is the file you open to rebalance |
| [js/data.js](../js/data.js) | Shared by creation pages: stats, money, parties, fit, name gen, the draw, the character sheet |
| [js/game/carriere.js](../js/game/carriere.js) | The ladder, the party leadership that cumulates with it, the electoral calendar, the two gauge targets, energy, and the posterity score |
| [js/game/corps.js](../js/game/corps.js) | Health, decline, the accident, mortality, forced withdrawal. Written per year, converted to turns at the last moment |
| [js/game/traits.js](../js/game/traits.js) | The traits engine: gains, losses, strikes, what a trait pulls on the gauges, what it rolls each turn |
| [js/game/argent.js](../js/game/argent.js) | Investments and what they protect, income and expenses, campaign accounts, the wealth that sleeps. Named `argent` so it is never confused with `render/budget.js`, which draws it |
| [js/game/opinion.js](../js/game/opinion.js) | The six electorates and everything read off them, standing, credibility — plus the shared `bump`, `statScore`, `pay`, `randInt` |
| [js/game/urnes.js](../js/game/urnes.js) | The polls, the campaign drift, party geometry, and the runoff transfer |
| [js/game/interprete.js](../js/game/interprete.js) | The event interpreter, whole: `when` conditions, texts and gender agreement, choices and their energy price, dice rolls, effects, follow-ups. The file you read to write content |

### Engine & controllers
| File | Contains |
|------|----------|
| [js/game.js](../js/game.js) | The engine: state, turn cycle, rivals, landscape, the Assembly, election maths, the ordinary event card, the two dispatchers and the boot |
| [js/game/render/](../js/game/render/) | Everything that produces HTML, and nothing that changes the state: the left sheet, the three panels, what a card is made of, the budget, the end screen |
| [js/game/registry.js](../js/game/registry.js) | `MODES` — the set-piece registry the engine consults instead of naming each mode |
| [js/game/modes/](../js/game/modes/) | One file per set piece, each owning its state, draw, resolution, card and buttons: `presidentielle`, `investiture`, `race`, `soutien`, `primaire`, `scrutin`, `aside` |
| [js/script.js](../js/script.js) | The i18n dictionary (`translations`) + language switch + `t()` / `L()` |
| [js/achievements.js](../js/achievements.js) | Draws the honours cabinet on `achievements.html`, and remembers what was earned. Knows what is on the wall, never what deserves to be |
| [js/create.js](../js/create.js) · [party.js](../js/party.js) · [tirage.js](../js/tirage.js) | Thin per-page glue |
| [css/style.css](../css/style.css) | All styling; party colors are driven by a single `data-party` attribute |

### Tooling (dev-only, not shipped with the game)
| File | Contains |
|------|----------|
| [tools/regression.js](../tools/regression.js) | **Non-regression harness.** `node tools/regression.js > before.txt`, refactor, run again, `diff`. Loads the game's scripts in the order `game.html` declares them, with a seeded `Math.random` and a fake DOM, then plays whole careers by clicking the buttons actually rendered, and writes a deterministic trace (game state + a hash of every panel's HTML, at every step). An empty diff means nothing changed. `PM_CAREERS` / `PM_STEPS` tune the run; coverage goes to stderr. It tells you the game *changed*, never that it is *good* — it does not replace opening the page. |
| [tools/valide-contenu.js](../tools/valide-contenu.js) | **Content checker.** `node tools/valide-contenu.js`. Reads every deck and confronts each word — parties, offices, origins, backgrounds, personalities, traits, stats, contests, flags, chain targets, gender marks — with what the engine actually knows, in both languages. A vocabulary mistake in an event does not crash: it silently does nothing, and neither the game nor the regression harness notices. Exits non-zero with one line per problem. |
| [tools/audit-popularite.js](../tools/audit-popularite.js) | **Opinion audit.** `node tools/audit-popularite.js`. Popularity is six electorates, and a flat `popularity` moves all six the same way — which is wrong for any gesture aimed at a camp: refusing a pact, humiliating a leader, censuring the government you sat in. Written flat, the scene warms the very people it just went after. The tool reports a flat gain sitting in an effects block that elsewhere takes vote share from a named camp, or signs, breaks or crosses; `--relire` adds the softer list, where the country applauds while the machine pays. Exits non-zero when something needs correcting. |
| [tools/event-editor.html](../tools/event-editor.html) | Standalone **form-based event editor** — open by double-click. Loads the real game data so every dropdown matches what exists (parties, traits, stats, positions); builds an event through a form (general, `when` conditions, choices, rolls, effects, branches); validates live against the schema; previews FR/EN with placeholders resolved; **saves drafts to `localStorage`** with undo/redo; and exports JSON with the target theme file named. Logic in [tools/editor.js](../tools/editor.js), styles in [tools/editor.css](../tools/editor.css). |

---

## The wiki

0. **[guidelines.md](guidelines.md)** — **Start here.** How to work in this repo: get up
   to date before writing a line (`main` + pull for something new, `pull --rebase` on the
   branch when you are resuming), read the wiki before writing code, keep files from
   turning into god files (and how to measure that), what to verify before committing,
   and what to update in the wiki afterwards.
1. **[architecture.md](architecture.md)** — Layering, script load order, the page-to-page
   handoff, the shape of the game `state` object, and the localStorage keys.
2. **[game-loop.md](game-loop.md)** — What happens each turn, how a card is drawn and
   resolved, and how the set pieces (ordinary races, presidential campaign, primary,
   blocked nominations) branch off the main loop — with the file that owns each.
3. **[systems.md](systems.md)** — The actual rules: the two career gauges, stats & the
   `/20` vs `/10` scaling, traits & strikes, energy, credibility, the office ladder and the
   party leadership that cumulates with it, the money/budget model, the political landscape,
   the Assembly, elections and the two-round presidential math.
4. **[content-authoring.md](content-authoring.md)** — The schemas. How to add an event
   (with every `when` condition and `effect` type), a trait, a party, an ending, a budget
   tier, or names — the reference you'll actually keep open while writing content.
5. **[glossary.md](glossary.md)** — A function index: the key functions, what they do,
   and where they live, so you can jump straight to the code.
6. **[Roadmap.md](Roadmap.md)** — Where the project is headed: planned gameplay systems,
   infrastructure, UI and tooling, each with codebase-grounded implementation notes.

---

## Conventions worth knowing before you read code

- **Comments and identifiers are in French.** The game is French-first; the code follows.
  Variable names like `choisi`, `parcours`, `enjeu`, `rendu` are normal here.
- **Every rule is commented with its *reason*, not just its *what*.** The data files
  open with long design-rationale headers. Read them — they encode balance intent
  (e.g. why privilege is deliberately *not* balanced, why a losing campaign can be
  worth more than an easy win).
- **No numbers are shown to the player as raw gauge values.** Elections are narrated
  ("it's close", "a rout"), never "you're 4 points short". Consequences are shown only
  *after* a choice, as chips.
- **Git identity is repo-local** — commit as the personal `bebedou` account, never the
  work identity. See the memory note in the parent project.
