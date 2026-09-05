# Architecture

How the pieces fit together: the layers, the load order, the page handoff, and the
shape of the state that flows through it all.

---

## The layering

The codebase is built in seven layers, from inert numbers up to the DOM. Each layer only
depends on the ones below it.

```
┌────────────────────────────────────────────────────────────────┐
│  MODES            js/game/modes/*.js  (one per set piece)      │  ← own their card
├────────────────────────────────────────────────────────────────┤
│  RENDER           js/game/render/*.js  (sheet, panels, card…)  │  ← draw the HTML
├────────────────────────────────────────────────────────────────┤
│  CONTROLLERS      create.js · party.js · tirage.js · game.js   │  ← touch the DOM
├────────────────────────────────────────────────────────────────┤
│  RULES / CALC     data.js · js/game/*.js  (the seven modules)  │  ← pure functions
├────────────────────────────────────────────────────────────────┤
│  BALANCE          balance.js  (the 107 tuning knobs)           │  ← numbers only
├────────────────────────────────────────────────────────────────┤
│  CONTENT (DATA)   *.data.js                                    │  ← strict JSON shape
├────────────────────────────────────────────────────────────────┤
│  I18N             script.js  (translations, t(), L())          │  ← loaded first
└────────────────────────────────────────────────────────────────┘
```

**The top two layers are the odd ones out**: they sit *above* the controller and
depend on it, not the reverse.

- **RENDER** holds every function that produces HTML — the left sheet, the three
  panels, the furniture a card is made of, the budget, the end screen. It reads the
  game state; it never changes it. `game.js` keeps only `renderCard()` (which picks
  who draws) and `renderAll()` (which repaints in order).
- **MODES** owns one card kind end to end — state, draw, resolution, rendering and
  buttons — and registers itself in `MODES`
  ([js/game/registry.js](../js/game/registry.js)). `game.js` never names a mode: it
  looks the card up in the registry and hands over.

What is left in `game.js` is the engine proper: the `state`, the country (landscape,
approval, the Assembly, the figures' background life), the career (calendar, stakes,
offices), the maths of an election, the turn pipeline, the ordinary event card, the
two dispatchers, and the boot.

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
script.js          → translations, t(), L()
balance.js         → the 107 tuning constants — MUST come before data.js
names.data.js      → NAME_DATA
data.js            → BASE_STATS, PARTIES, computeStats(), the draw…
traits.data.js     → TRAIT_DATA
budget.data.js     → BUDGET_DATA
endings.data.js    → ENDING_DATA
events/*.data.js   → EV_*, then _assemble.data.js → EVENT_DATA
game/carriere.js   → the ladder, the calendar, the two gauges, energy, the score
game/corps.js      → health, decline, the accident, mortality, forced withdrawal
game/traits.js     → the traits engine (strikes, gains, per-turn risk)
game/argent.js     → investments, income, expenses, campaign accounts, wealth
game/opinion.js    → the six electorates, standing, credibility, bump/statScore/pay
game/urnes.js      → the polls, the campaign drift, the runoff transfer
game/interprete.js → the event interpreter — MUST come after _assemble.data.js
game/registry.js   → MODES = {} — must precede every mode file
game/render/*.js   → the HTML producers (order-free)
game/modes/*.js    → each one writes its entry into MODES on load
game.js            → the engine (IIFE that boots on load)
```

Two rules govern where a mode file may sit:

- **`registry.js` before the modes**, because they assign into `MODES` at load time.
- **the modes before `game.js`**, because `game.js` declares `let game`, and a `let`
  at the top level of a classic script is *not* a property of `window` — it is a
  binding in the shared global lexical scope, readable by every script but only once
  its own script has run. Modes only touch `game` inside functions called later, so
  they are safe; the reverse order would not be.

Everything else is order-free: `function` declarations hoist within their file, and
every cross-file call happens at runtime, once the page is fully loaded.

The creation pages load a subset: `script.js`, `balance.js`, `names.data.js`,
`traits.data.js`, `data.js`, then their own controller. `party.html` and
`tirage.html` are the same set with a different final controller.

> If you add a data file, wire it into the `<script>` list of every page that needs it,
> **before** the code that reads it.

### `balance.js` loads first, and that is not decoration

Every tuning constant in the game lives in [balance.js](../js/balance.js) — 107 of them,
gathered from ten files. It holds numbers and nothing else: no function, no rule, no DOM.

It must load **before `data.js`**, because four of its constants are evaluated from
another at load time (`YEARS_PER_TURN`, `ASSEMBLY_MAJORITY`, `COALITION_DISTANCE`,
`STRAIN_TALKS`), so order *inside* the file matters too. All four pages and the event
editor load it in second position, right after `script.js`.

What is **not** in it, deliberately: the vocabulary (`LADDER`, `STAT_KEYS`, `ELECTIONS`,
`MANDATES` — renaming a word there breaks the content that names it), the character-creation
tables (`BASE_STATS`, `STAT_MODIFIERS`, `MONEY`, `PARTIES`, `FIT_LEVELS`, `DRAW_MIX`, which
stay in `data.js` where the checker and the editor read them), and the plumbing (storage
keys, gender marks, chip families). The test is simple: a constant belongs in `balance.js`
if its value could be different without anything breaking — only the game would play
differently.

---

## The rules (`js/game/*.js`)

The loop's rules used to be one 2 888-line file, `game-data.js`. It held ten unrelated
subjects and nobody could name it in one sentence. It is now seven modules, each with
a subject you can say out loud. Load order among them does not matter — with **one
exception**, called out below.

| File | Holds |
|---|---|
| [carriere.js](../js/game/carriere.js) | where you are, what you have to keep going, and what it will be worth: the office ladder, the party leadership that *cumulates* with the office, the electoral calendar, the two gauges, energy, and the posterity score |
| [corps.js](../js/game/corps.js) | health, decline, the accident, mortality, forced withdrawal. Every number here is written **per year** and converted at the last moment |
| [traits.js](../js/game/traits.js) | the traits engine: gains, losses, strikes that only stick on a repeat, what a trait pulls on the gauges, what it rolls each turn |
| [argent.js](../js/game/argent.js) | investments and what they protect, income and expenses, what a campaign cost and who comes to count it, the wealth that sleeps. **Named `argent`, not `budget`**, because [render/budget.js](../js/game/render/budget.js) draws the budget and this one computes it |
| [opinion.js](../js/game/opinion.js) | the six electorates and everything read off them, standing, credibility — plus the shared vocabulary `bump`, `statScore`, `pay`, `randInt`, called 65 times from the rest of the game |
| [urnes.js](../js/game/urnes.js) | the first-round poll, the presidential race you are not in, the campaign drift, and the runoff transfer computed on ideological distance |
| [interprete.js](../js/game/interprete.js) | the event schema, end to end: the `when` conditions, the texts and their gender agreement, the choices offered and their energy price, the dice roll, the effects, the follow-ups |

**`interprete.js` is the one with an order constraint**: it reads `EVENT_DATA` at load
time (`const EVENTS = EVENT_DATA.events`), so it must come after
`events/_assemble.data.js`. The other six only call each other at runtime.

**It stays whole on purpose.** At ~1 100 lines it is the biggest file of the seven, and
splitting it into conditions / texts / effects / choices was considered and rejected:
it is the file people read when they *write content*, and it describes one event from
the `when` that lets a scene appear to the follow-up a choice schedules. Four files
would mean opening four files to understand one card. The real lever on its size is not
a split — it is turning `eventMatches` (53 `when` keys) and `applyEffects` (~20 effect
branches) into two registries. That is axis B4 of [Roadmap.md](Roadmap.md).

**Two things they do that the layering does not sanction**, and they are named rather
than hidden. `applyEffects` calls `setOffice`, `switchParty`, `moveShare`,
`ensureGovernment` and a dozen more that live in [game.js](../js/game.js) — the layer
*above*. Two of those calls admit it with a `typeof x === "function"` guard. And
`tools/valide-contenu.js` reads `GENDER_MARKS` out of `interprete.js` **as text**, by
regex, so it can check content without booting a DOM: move that table and you repoint
the tool.

---

## The rendering (`js/game/render/`)

Every function that produces HTML lives here. They read the game state and return (or
set) markup; none of them changes the state. Load order among them does not matter.

| File | Draws |
|---|---|
| [fiche.js](../js/game/render/fiche.js) | the left sheet: identity, the two career gauges, the stat bars, and the election calendar above the card |
| [panneaux.js](../js/game/render/panneaux.js) | the three panels under the card: *the power* (executive, hemicycle, majority), *the opinion* (vote shares, trends, figures), and the journal |
| [carte.js](../js/game/render/carte.js) | what a card is *made of*: the election band, the date line, the choice buttons, the consequence chips, the poll table, the continue button |
| [budget.js](../js/game/render/budget.js) | the budget block and its plus/minus controls — the only place the player acts outside a card |
| [fin.js](../js/game/render/fin.js) | the end screen: the narrated ending plus the career recap |

Two rendering functions deliberately stay in [game.js](../js/game.js), because neither
draws anything:

- **`renderCard()`** picks *who* draws — it looks the card kind up in `MODES` and hands
  over, drawing only the ordinary event card itself.
- **`renderAll()`** repaints everything in order, and is the single entry point the
  click handlers call after they change the state.

**`carte.js` is the shared furniture, and that is the point.** The engine and all seven
set pieces build their cards out of the same pieces — same band, same buttons, same
chips, same poll bars. It is what makes a presidential-campaign card and an ordinary
event feel like one game rather than two.

---

## The set pieces (`js/game/modes/`)

Most turns are one card: read it, choose, continue. A handful of situations replace
that with a **multi-screen flow** — a campaign, a race, a primary, a refused
nomination. Each is a small state machine with its own state, its own draw, its own
resolution, its own card and its own buttons, and each lives in **one file**.

| File | Card kinds (`MODES` keys) | What it is |
|---|---|---|
| [presidentielle.js](../js/game/modes/presidentielle.js) | `campaign` | six campaign steps, first round, then the runoff fortnight |
| [investiture.js](../js/game/modes/investiture.js) | `election`, `nomination` | run or stand aside; and the refused nomination, with the two doors out |
| [race.js](../js/game/modes/race.js) | `race`, `seat` | the 2–3 step campaign of an ordinary election, and the choice of ground |
| [soutien.js](../js/game/modes/soutien.js) | `support` | the presidential election you are not in |
| [primaire.js](../js/game/modes/primaire.js) | `designation`, `primaire` | who the party puts up: the committee weighs standing, a primary weighs the base |
| [scrutin.js](../js/game/modes/scrutin.js) | `scrutin` | the card that opens an election |
| [aside.js](../js/game/modes/aside.js) | `aside` | the ballot that happens without you |

### The contract

A mode registers itself under the **card kind** it draws
([registry.js](../js/game/registry.js)):

```js
MODES.race = {
  ready:  () => Boolean(game.race),   // optional: is the mode's state in place?
  render: renderRaceCard,             // draws into #event-area
  clicks: { "data-race-next": raceNext, "data-race-done": raceDone },
};
```

`renderCard()` looks up `MODES[card.kind]` and hands over; `handleClick()` asks the
**displayed** card's mode first, and only then falls through to the engine's generic
branches (`data-choice`, `data-continue`, `data-restart`). That last part is what lets
`data-choice` mean one thing on a campaign card and another on an ordinary event,
without the engine knowing either mode exists.

Two extra keys exist for exactly one case, and are named rather than hidden:
`renderWhenEnded` and `clicksWhenEnded`. A won presidential election sets `game.ended`
*before* the count is shown — so that one card must still draw, and its dismiss button
must still answer, after everything else has frozen.

**What stays in the engine.** Anything two modes share, or that a mode and the engine
share: `momentOf` / `momentFits` / `rememberMoment` (scene timing, used by three
modes), `pollHTML` (the poll widget, used by four), `standDown`, and the vocabulary of
a result (`ELECTION_OUTCOMES`, `applyOutcome`, `outcomeText`) — an election can be
resolved without a campaign, and `resolveElectionRun()` does exactly that.

**The one dependency that points the wrong way**: `enterElection()` in `game.js` calls
`startRace()`, `startSupport()`, `startAside()` to *open* a mode. Something has to
decide which set piece a given election becomes, and that decision reads the player's
stake, which is engine business. The registry removes the engine's knowledge of how a
mode draws and behaves, not of when one begins.

---

## The page handoff (localStorage)

There is no router and no shared runtime between pages — each page is a fresh document.
State travels in `localStorage` under four keys:

| Key | Written by | Read by | Holds |
|-----|-----------|---------|-------|
| `pm-lang` | [script.js](../js/script.js) | every page | `"fr"` or `"en"` |
| `pm-character` (`CHARACTER_KEY`) | create.js / party.js | party, tirage, game | the character choices + the dealt `draw` |
| `pm-game` (`GAME_KEY`) | game.js | game.js | the entire in-progress game `state` |
| `pm-achievements` (`ACHIEVEMENT_KEY`) | achievements.js | index.html | the ids of the honours earned. The one key a new game does **not** clear |

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
  age, turn,          // age in years; turn counts seasons (4 turns = 1 year)
  position,           // current rung on the LADDER
  peakPosition,       // highest rung ever reached (a career is judged by its peak)
  partyLead,          // do you lead your party? NOT a rung — it cumulates with the office
  peakLead,           // did you ever lead it? the peak is read on two lines, not one
  flags: {},          // dirtyMoney, onTrial, frailHealth, carefulHealth, ageWarned…
  traits: [...],      // durable marks (trait ids from TRAIT_DATA)
  strikes: {},        // partial marks: { traitId: count } before a reputation sticks
  investments: {},    // { budgetPostKey: level }
  decline, declineTurn, // how many times the body has spoken, and when (see systems.md)
  seen: {},           // events already played (they don't return)
  pending: [...],     // scheduled chain follow-ups: { id, turn, expires }
  popularity, standing,   // the two career gauges, 0..100
  rivals: [...],      // the political landscape's named figures (5 per party)
  landscape: {},      // party → % vote share; landscapeTrail = the last four turns (for trends)
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
`"scrutin"` (an election announcing itself), `"event"`, `"nomination"`, `"election"`,
`"aside"`, `"support"`, `"seat"`, `"designation"`, `"primaire"`, `"race"`, `"campaign"`, `"info"`, `"end"`.

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
