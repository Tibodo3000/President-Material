# Architecture

How the pieces fit together: the layers, the load order, the page handoff, and the
shape of the state that flows through it all.

---

## The layering

The codebase is built in four layers, from inert data up to the DOM. Each layer only
depends on the ones below it.

```
┌─────────────────────────────────────────────────────────────┐
│  CONTROLLERS      create.js · party.js · tirage.js · game.js  │  ← touch the DOM
├─────────────────────────────────────────────────────────────┤
│  RULES / CALC     data.js · game-data.js                      │  ← pure functions
├─────────────────────────────────────────────────────────────┤
│  CONTENT (DATA)   *.data.js                                   │  ← strict JSON shape
├─────────────────────────────────────────────────────────────┤
│  I18N             script.js  (translations, t(), L())         │  ← loaded first
└─────────────────────────────────────────────────────────────┘
```

**Why `.data.js` and not `.json`?** A real `.json` file fetched by the page would
require a web server (CORS blocks `file://` fetches). By making the data a `.js` file
that assigns a global (`const EVENT_DATA = { ... }`), the game runs by double-clicking
`index.html`. Everything after the first line of each data file is valid JSON. This is
called out in the header of every data file.

**The one hard rule of the layering:** [data.js](../js/data.js) never touches the DOM.
It holds numbers, tables, and calculation functions shared by the creation pages. The
rendering lives in the controllers. This is what lets `create.html` and `party.html`
share the character-sheet logic.

---

## Script load order

Order matters because these are plain globals, not modules — a file can only use what
was loaded before it. Each page's `<script>` tags encode its dependency chain.

**game.html** (the full stack):
```
script.js        → translations, t(), L()
names.data.js    → NAME_DATA
data.js          → BASE_STATS, PARTIES, computeStats(), the draw…
traits.data.js   → TRAIT_DATA
budget.data.js   → BUDGET_DATA
endings.data.js  → ENDING_DATA
events.data.js   → EVENT_DATA
game-data.js     → the loop's rules + event interpreter
game.js          → the engine (IIFE that boots on load)
```

The creation pages load a subset: `script.js`, `names.data.js`, `traits.data.js`,
`data.js`, then their own controller. `party.html` and `tirage.html` are the same set
with a different final controller.

> If you add a data file, wire it into the `<script>` list of every page that needs it,
> **before** the code that reads it.

---

## The page handoff (localStorage)

There is no router and no shared runtime between pages — each page is a fresh document.
State travels in `localStorage` under three keys:

| Key | Written by | Read by | Holds |
|-----|-----------|---------|-------|
| `pm-lang` | [script.js](../js/script.js) | every page | `"fr"` or `"en"` |
| `pm-character` (`CHARACTER_KEY`) | create.js / party.js | party, tirage, game | the character choices + the dealt `draw` |
| `pm-game` (`GAME_KEY`) | game.js | game.js | the entire in-progress game `state` |

The flow of the character object:

1. **create.js** — `saveCharacter({ name, sex, origin, background, personality })`
2. **party.js** — re-saves with `{ ...choices, party, draw }`. The **draw is rolled
   here, once** (`drawBirthTraits()`), so reloading `tirage.html` can't re-roll a hand
   the player didn't like. It also clears any old `pm-game`.
3. **tirage.js** — only *displays* the draw; it re-rolls only if one is genuinely missing.
4. **game.js** — `newGame(character)` builds the full `state`, or `loadGame()` resumes.

Serialization detail: functions aren't serializable, so `saveGame()` stores only the
*id* of the current card (`{ kind, id }`) and `renderCard()` reconstructs everything
from the id. See [game.js](../js/game.js) `saveGame` / the `init` IIFE at the bottom.

---

## The `state` object (`game`)

Built by `newGame()` in [game.js](../js/game.js). This single object *is* the game.
Every rule reads and mutates it. Key fields:

```js
{
  character,          // the create-page choices (name, sex, origin, background, personality, party, draw)
  party,              // current party key (can change mid-game via defection)
  parties: [...],     // every party ever been in — some traits need an origin camp
  stats: { charisme, eloquence, energie, sangfroid,   // "personal" stats
           reseau, notoriete, reputation, credibilite }, // "external" stats — all 0..20
  money, startMoney,  // euros now, and euros at entry (justice cares about the delta)
  age, turn,          // age in years; turn counts six-month steps (2 turns = 1 year)
  position,           // current rung on the LADDER
  peakPosition,       // highest rung ever reached (a career is judged by its peak)
  partyLead,          // do you lead your party? NOT a rung — it cumulates with the office
  peakLead,           // did you ever lead it? the peak is read on two lines, not one
  flags: {},          // dirtyMoney, onTrial, frailHealth, carefulHealth, ageWarned…
  traits: [...],      // durable marks (trait ids from TRAIT_DATA)
  strikes: {},        // partial marks: { traitId: count } before a reputation sticks
  investments: {},    // { budgetPostKey: level }
  seen: {},           // events already played (they don't return)
  pending: [...],     // scheduled chain follow-ups: { id, turn, expires }
  popularity, standing,   // the two career gauges, 0..100
  rivals: [...],      // the political landscape's named figures (5 per party)
  landscape: {},      // party → % vote share; landscapeBefore = last turn (for trends)
  assembly: {},       // party → seats, out of 577; fixed on each legislative night
  coalition: [...],   // the parties that vote the government's bills
  approval,           // the government's standing in the country, 0..100
  dissolution,        // the turn of a snap legislative election, if one is pending
  alliance,           // { party, turn } or null
  scene,              // the figure this card is staging (fixed when the card is drawn)
  race, campaign,     // active ordinary-election / presidential-campaign sub-state
  president,          // { name, party } or { isPlayer: true }; presidentTerms counts consecutive
  log: [...],         // journal, most-recent first, capped at 8
  ended,              // { type } once the game is over
  card,               // the card currently shown on the right: { kind, id, resolved, ... }
}
```

The `card.kind` is the discriminator that drives `renderCard()`:
`"event"`, `"nomination"`, `"election"`, `"race"`, `"campaign"`, `"end"`.

---

## Save-compatibility handling

The `init()` IIFE at the bottom of [game.js](../js/game.js) is defensive: it backfills
fields that older saves lack (credibility, party history, `startMoney`, the landscape,
chains, etc.) rather than crashing or inventing a rich past. If you add a new field to
`state`, add a matching backfill here so existing saves keep loading.

The trickiest one is worth knowing about: saves written while `chef` was still a rung of the
ladder carry `position: "chef"` and therefore no mandate at all. They are converted to
`partyLead: true` with `position: "cadre"` — the leadership is handed back in its own field,
and the player is put at headquarters, which is where they were actually leading from. The
engine does not invent a constituency they never won.

---

## Party color theming

All party color comes from **one attribute**: `document.body.dataset.party = game.party`.
CSS defines `--p-<party>` custom properties (see [style.css](../css/style.css) "LES SIX
COULEURS"), and the whole page — background, accents, poll bars, the party name on the
sheet — reads from that. Changing party at runtime is a one-line visual change.
