# President Material — Project Wiki

*A political-career simulation game that runs entirely in the browser.*

> **One goal: the presidency.** You create a character at age 30, choose a party,
> get dealt a starting hand of traits, then climb the ladder from local activist to
> President of the Republic — one six-month turn at a time — through events,
> elections, money, alliances, betrayals, scandals and the slow erosion of age.

This wiki is the map of the codebase: how it's structured, how the game loop works,
what the rules are, and how to add content without touching engine code.

---

## The 30-second mental model

- **No build, no server, no dependencies.** Pure HTML/CSS/vanilla JS. You open
  `index.html` by double-clicking it. That single constraint explains almost every
  design decision (e.g. why data files are `.js` and not `.json`).
- **Data is separated from logic.** Content lives in `*.data.js` files as strict
  JSON-shaped objects. The rules that *read* that content live in a few calculation
  files. The DOM-driving engine is isolated in `game.js`.
- **Adding content requires no code.** New events, traits, parties, endings, names,
  and budget tiers are all data entries. The engine interprets them.
- **Everything is bilingual (FR/EN).** Every player-facing string is either a
  dictionary key (`t("...")`) or an inline `{ fr, en }` object read by `L(...)`.

---

## Page flow

The game is four pages the player walks through in order, plus the landing page:

```
index.html ──▶ create.html ──▶ party.html ──▶ tirage.html ──▶ game.html
 (landing)     (character)      (party)        (the draw)      (the loop)
```

State is handed between pages through `localStorage`, not a router or framework.

| Page | Role | Controller |
|------|------|-----------|
| [index.html](../index.html) | Landing / pitch | [script.js](../js/script.js) only |
| [create.html](../create.html) | Build the character (identity, origin, background, personality) | [create.js](../js/create.js) |
| [party.html](../party.html) | Pick a starting party; see fit & difficulty | [party.js](../js/party.js) |
| [tirage.html](../tirage.html) | Reveal the two random birth traits + chosen character trait | [tirage.js](../js/tirage.js) |
| [game.html](../game.html) | The turn-by-turn game loop | [game.js](../js/game.js) |

---

## File map

### Content (pure data — edit freely, no code needed)
| File | Contains |
|------|----------|
| [js/events.data.js](../js/events.data.js) | **198 events** across 4 decks: `events`, `campaign`, `nomination`, `races` |
| [js/traits.data.js](../js/traits.data.js) | All traits (character, physical, talent, party, reputation, money) |
| [js/endings.data.js](../js/endings.data.js) | The narrated end-of-game screens, chosen by final state |
| [js/budget.data.js](../js/budget.data.js) | Salaries, lifestyle, and the adjustable spending tiers |
| [js/names.data.js](../js/names.data.js) | Name pools for the random name generator |

### Rules / calculation (logic that reads the data; no DOM in `data.js`)
| File | Contains |
|------|----------|
| [js/data.js](../js/data.js) | Shared by creation pages: stats, money, parties, fit, name gen, the draw, the character sheet |
| [js/game-data.js](../js/game-data.js) | The rules of the loop: ladder, calendar, gauge targets, traits engine, budget engine, event interpreter, elections math, endings resolver |

### Engine & controllers
| File | Contains |
|------|----------|
| [js/game.js](../js/game.js) | The game loop engine: state, turn cycle, rivals, landscape, elections, campaigns, all rendering |
| [js/script.js](../js/script.js) | The i18n dictionary (`translations`) + language switch + `t()` / `L()` |
| [js/create.js](../js/create.js) · [party.js](../js/party.js) · [tirage.js](../js/tirage.js) | Thin per-page glue |
| [css/style.css](../css/style.css) | All styling; party colors are driven by a single `data-party` attribute |

---

## The wiki

1. **[architecture.md](architecture.md)** — Layering, script load order, the page-to-page
   handoff, the shape of the game `state` object, and the localStorage keys.
2. **[game-loop.md](game-loop.md)** — What happens each turn, how a card is drawn and
   resolved, and how the special modes (ordinary races, presidential campaign, blocked
   nominations) branch off the main loop.
3. **[systems.md](systems.md)** — The actual rules: the two career gauges, stats & the
   `/20` vs `/10` scaling, traits & strikes, energy, credibility, the money/budget model,
   the political landscape, elections and the two-round presidential math.
4. **[content-authoring.md](content-authoring.md)** — The schemas. How to add an event
   (with every `when` condition and `effect` type), a trait, a party, an ending, a budget
   tier, or names — the reference you'll actually keep open while writing content.
5. **[glossary.md](glossary.md)** — A function index: the key functions, what they do,
   and where they live, so you can jump straight to the code.

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
