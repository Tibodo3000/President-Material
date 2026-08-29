# Content authoring

The schemas for everything you can add without touching engine code. Keep this open while
writing content. Each data file also carries its own long header — read it; it encodes the
balance intent.

The golden rule everywhere: **every player-facing string is `{ "fr": "...", "en": "..." }`**
(read by `L()`), and **no raw gauge numbers appear in prose**.

---

## Adding an EVENT — [js/events/](../js/events/)

Events live in **`js/events/`**, split by theme (one file per theme, one per auxiliary
deck) and reassembled into `EVENT_DATA` by `_assemble.data.js`. You can author two ways:

- **By hand** — add an object to the right theme/deck file (schema below).
- **With the [event editor](../tools/event-editor.html)** (`tools/event-editor.html`,
  double-click) — a form builds the event, validates it against the real vocab, previews
  the FR/EN text, and names the exact file to paste the exported JSON into. Recommended;
  it catches the mistakes below before they reach the data.

**Either way, run `node tools/valide-contenu.js` afterwards.** A vocabulary mistake in an
event does not break anything — it does nothing, which is worse. A `"personality":
["brutal"]` when the personality is called `provocative` is a choice that never shows; a
`"strike"` on a mark that does not exist is an effect that never applies; a `"chain"` to a
missing id is a follow-up that never fires. The game runs, the regression harness sees
nothing, and the scene is dead. The checker confronts every word with what the engine
actually knows, in both languages, and prints one line per problem.

`EVENT_DATA` has seven decks. Pick the right one:

| Deck | When it's drawn | Special fields |
|------|-----------------|----------------|
| `events` | Ordinary turns (273 events) | the full schema below |
| ↳ *the player against their own camp* | inside `events`, in [arbitrages.data.js](../js/events/arbitrages.data.js) | nothing new in the schema, one rule in the writing: **every choice moves `landscape`, and never in the same direction as the career**. A choice that pays in standing *and* in vote share is not an arbitration, it is a reward, and it belongs in another file |
| ↳ *end-of-career scenes* | inside `events`, in [declin.data.js](../js/events/declin.data.js) | `"decline": 1\|2\|3` marks which of the body's three warnings a scene is. `"weight": 0` is **required** — the engine schedules them itself (`scheduleDecline`), they must never come out of a random draw. Keep **one scene per stage with no `when` at all**: if none matched, nothing would be scheduled and the exits would stay shut forever |
| `campaign` | The 6 steps before the first round, when the player runs (26) | effects use `poll`; bigger swings; `moment`, `required`, `cast: "minor"` |
| `runoff` | The 3 steps between the two rounds (12) | `poll` moves the head-to-head; `cast: "eliminated"` |
| `support` | The 3 steps of a presidential campaign the player is not in (16) | effects use `score`, which moves your camp's line in a poll the player watches for three scenes |
| `aside` | An ordinary election that happens without the player (12) | ordinary effects, no `score`. Split in two halves by `partyLead` (6 and 6): an election you merely watch is a different evening when you are the one who signed every nomination — **keep both halves populated**, `drawAside()` falls back to the whole deck when nothing matches |
| `nomination` | When the party refuses to nominate you (14) | rewards `standing` different ways. `"election": ["municipales","legislatives","europeennes"]` restricts a scene to the contests it makes sense in — the same idea as `race` in the `races` deck. Anything about lists, constituencies or a candidate parachuted in by head office needs it: nobody parachutes a party leader, and a congress has no list to balance. Scenes about the machine itself carry no `election` and play everywhere |
| `races` | Steps of an ordinary election campaign (22) | effects use `score`; `race: [...]`, `moment` |

### Event shape
```jsonc
{
  "id": "unique_id",              // required, unique across the deck
  "weight": 2,                    // draw weight (default 2). 0 = chains only, never random
  "once": true,                   // play at most once (default for non-repeatable anyway)
  "repeatable": true,             // may return; only these fill "quiet turns"
  "cast": "opponent",             // who {rival} is (see below)
  "delay": [4, 8],                // if used as a chain target: fire 4–8 turns (= quarters) after scheduling
  "when": { ... },                // appearance conditions (see below)
  "tag":  { "fr": "...", "en": "..." },   // small category label
  "text": { "fr": "...", "en": "..." },   // the situation
  "choices": [ ... ]              // at least one must be unconditional
}
```

### `cast` — who `{rival}` refers to
`"opponent"` (a figure from another party) · `"leader"` (another party's chief) ·
`"ruling"` (the chief of the governing camp — the person you negotiate with when you hold
the votes they lack) · `"neighbour"` (the chief of the camp closest to yours; an alliance is
not signed with just anybody, and `"leader"` picks by weight, so a hard-left party was being
offered a pact by the identitarians one time in six) · `"camp"` (someone from your own
party) · `"camp_senior"` (a weighty figure from your camp, for internal-nomination fights) ·
*absent* (anyone). The figure is fixed when the card is drawn, so the name is stable across
question, result, and effects.

Two casts exist only during a presidential election, where the field is known:
`"minor"` (the smallest candidate of the first round — you do not offer the front-runner the
deal you offer someone stuck at five per cent) and `"eliminated"` (the biggest of the
first-round losers, whose voters decide the runoff; `runoff` deck only). With no `cast`, a
first-round scene talks about whoever leads the poll, and a runoff scene talks about the
other finalist.

### `moment` — where a scene sits in a campaign
Campaign decks only (`campaign`, `support`, `races`). A campaign plays out as a handful of
randomly drawn steps, and randomness cannot read a calendar: without this field, the evening
of the first round can land before the last weekend of canvassing. `moment` says how close to
the END of the campaign a scene may appear, at the earliest:

| `moment` | Earliest slot | Typical scene |
|---------|---------------|---------------|
| `1` | final step only | "the last evening", "between the two rounds" |
| `2` | last two steps | "ten days to go" |
| `3` | last three steps | "three weeks before the vote" |

Lower number = later in time. A dated scene never plays after a later one already has, so the
calendar only runs forwards. Leave `moment` out for anything undatable: a scandal has no date.

A **pair** closes the window at both ends, for scenes that only make sense early:
`"moment": [6, 4]` plays between six and four steps from the end, so the five hundred
mayoral signatures are never collected the night before the vote.

### `required` — a scene that always happens
Campaign decks only. A presidential election without a big debate does not exist, so the
debate is not left to the draw. A `required` scene is drawn normally while it still has room;
nothing that would close its window is allowed to play ahead of it; and once only its own
slot is left, it plays. Keep it to one or two scenes per deck — beyond that the campaign is
no longer drawn, it is scripted.

### `when` — every condition (all must hold)
```jsonc
"party": ["radical_left","socdem"]     "position": ["maire","depute"]
"origin": ["bourgeois"]                "background": ["business"]
"personality": ["provocative"]
"minAge": 55,  "maxAge": 70            "minTurn": 10,  "maxTurn": 40
"minPopularity": 60, "maxPopularity": 30
"minStanding": 60,   "maxStanding": 30
"minMoney": 200000,  "maxMoney": 5000
"minDecline": 3, "maxDecline": 0     // how many times the body has spoken (0..3)
"stat": { "notoriete": { "min": 6 }, "energie": { "max": 4 } }   // remember: 0..20 scale
"flag": { "dirtyMoney": true, "onTrial": false }
"trait": ["orateur","teflon"]          // ALL of these traits
"anyTrait": ["zozote","voix"]          // AT LEAST ONE
"notTrait": ["renegat"]                // NONE of these
"ruling": true                         // your camp holds the presidency
"allied": false                        // you have a pact
"partyLead": true                      // you lead your party (whatever office you hold)
"minShare": 18                         // your camp's national weight, in points
"rulingClose": true                    // a *neighbouring* camp governs (not yours)
"belowPeak": true                      // your office is under the peak of your career
"legal": 1,  "comms": 2                // minimum budget-post level reached

// The executive and the Assembly
"majority": ["relative","aucune"]      // "absolue" | "relative" | "aucune"; a list is an OR
"minApproval": 40, "maxApproval": 34   // the government's standing in the country, 0..100
"inCoalition": true                    // your camp votes the government's bills
"firstGroup": true                     // your party is the largest group in the Assembly
"pivot": true                          // the government has no majority, and would with you
"minSeats": 60, "maxSeats": 32         // your party's seats, out of 577 (289 = a majority)
"dissolved": true                      // a snap legislative election after a dissolution
"outshinePresident": true              // you are more popular than the president, and
                                       //   they are from your own camp

// The runoff opponent — these only hold during the fortnight between the rounds,
// where the field is known. Every other condition describes the player; without
// these, a scene could offer to "attack the record" of somebody who has never
// governed anything.
"foeIncumbent": true                   // they carry a record: Élysée or Matignon
"foeParty": ["identitarians"]          // their camp, spelled out
"foeFar": true                         // their camp is beyond your ideological
                                       //   neighbourhood — the front républicain register
```

**A note on `"position"` and `"chef"`.** The party leadership is not an office any more
(see *Leading the party* in [systems.md](systems.md)). Inside a `position` list, `"chef"`
therefore means **"leads their party"**, whatever mandate they hold alongside it — so
`"position": ["depute","ministre","chef"]` reads as "a senior figure", which is what it
always meant. `"partyLead"` says the same thing on its own, for a scene that is about the
leadership and does not care about the mandate.

### `choices` — two forms

**Certain choice:**
```jsonc
{ "label": {...}, "effects": { ... }, "result": {...},
  "when": { "minMoney": 200000 } }    // optional: a conditional choice (shown with a ◆)
```

**Uncertain choice (a roll):**
```jsonc
{ "label": {...},
  "roll": {
    "base": 12,                        // (or "difficulty") the target to beat
    "stat": "charisme",                // main stat, weight 1 (goes through statScore)
    "plus": { "eloquence": 0.5, "popularity": 0.06, "standing": 0.04, "money": 0.5 },
    "bonus": [ { "when": {...}, "value": 2 } ],   // conditional flat bonuses
    "dice": 6                          // random amplitude (default 6)
  },
  "success": { "effects": {...}, "result": {...} },
  "failure": { "effects": {...}, "result": {...} } }
```

**Fixed-probability roll** instead of a composite score:
```jsonc
"roll": { "chance": 0.5, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] }
```

### `triumph` / `debacle` — when a roll goes further than it had to

Two **optional** branches, same shape as `success` and `failure`. Once the roll has said
whether it passes, a second draw can push a success into a `triumph` or a failure into a
`debacle`.

```jsonc
"success": { "effects": {...}, "result": {...} },
"failure": { "effects": {...}, "result": {...} },
"triumph": { "effects": {...}, "result": {...} },   // optional
"debacle": { "effects": {...}, "result": {...} }    // optional
```

The second draw reads **the attributes the roll already names** — you never declare them
twice. Competence turns its successes and limits its damage; the reverse for
incompetence. See *Criticals* in [systems.md](systems.md) for the formula. A roll written
as a fixed `chance` names no attribute, so its severity is pure luck (7.5 % either way):
if you want a character-driven critical, write the scene as a composite score.

**Write one only when you have something more to say.** No branch, no draw — a scene
without them behaves exactly as it always has, down to the random sequence. Do not
retrofit: aim for the twenty or forty scenes where a catastrophe or a moment is worth
staging, and leave the rest alone.

**The rule that keeps balancing readable: a critical does not change the nature of the
effect, it adds a named consequence.** Keep the numbers close to the ordinary branch —
×1.3, no more — and put the payload in something durable: a `trait`, a `strike`, a
`chain`, a `flag`. A debacle that costs three more points of popularity is not worth
writing; one that costs two more *and* opens a case is.

```jsonc
"failure": { "effects": { "reputation": -1, "popularity": -9, "standing": -4 },
             "result": {...} },
"debacle": { "effects": { "reputation": -1, "popularity": -12, "standing": -5,
                          "strike": "menteur" },                 // ← le vrai contenu
             "result": {...} }
```

**The exception is the campaign decks** (`campaign`, `runoff`, `support`, `races`). A
campaign has no *later* for a chain to land in, so there the extreme is honestly a bigger
`poll` or `score` swing plus its prose — which is the one thing that still matters when
the game may end in three scenes.

A `triumph` or a `debacle` on a choice **without a `roll`** never fires.
`node tools/valide-contenu.js` reports it.

A branch may also carry `effectsIf: [ { "when": {...}, "effects": {...} } ]` — extra
effects that apply only in some situations (an arrangement passes unnoticed for a
calculator, ruins someone with an integrity reputation).

### `effects` — every effect type (all optional)
```jsonc
"charisme" / "eloquence" / … / "credibilite"   // stat deltas, clamped 0..20
"popularity" / "standing"                       // gauge deltas, clamped 0..100
"axis": { "social": -70, "economy": -40 }       // WHERE the choice stands (see below)
"axis": "self"                                  // …or simply: where your own camp stands
"appeal": { "scene": -8, "self": 6 }            // one electorate at a time, by hand
"money": 80000                                  // euros
"poll": 5           // presidential campaign only — moves voting intentions
"score": 4          // ordinary race only — moves the hidden campaign advantage
"flags": { "dirtyMoney": true }                 // set/clear a flag
"trait": "orateur"                              // gain a trait (applies its stats)
"strike": "menteur"                             // one strike toward a multi-strike mark
"untrait": "lache"                              // remove a trait
"chain": "event_id"   or   ["id_a","id_b"]      // schedule follow-up(s)
"landscape": { "self": 2, "scene": -2 }         // shift vote share; targets:
                                                //   self, scene, ruling, ally, or a party key
"office": "ministre"                            // grant an office (no election)
"office": "none"                                // leave office → officeAfterDefeat() decides
"lead": true   or   false                       // give / take back the party leadership.
                                                //   The office does NOT move: that is the point.
"approval": -8                                  // the government's standing, 0..100
"dissolve": true                                // the president dissolves: snap legislatives
                                                //   next turn, off-calendar
"join": "scene"                                 // switch parties
"alliance": "scene"   or   null                 // sign / break a pact
"end": "conviction"                             // end the game with this type
```

### Who reacts, not just by how much

Three ways to write an opinion move, and the scene decides which one:

| The scene | Write | Because |
|---|---|---|
| has no side — a gaffe, a good broadcast, a scandal, a disaster handled well | `popularity` alone | the country reacts as one, which is what a bare number says |
| takes a **position** — the economy, order, the nation, Europe | `popularity` + `axis` | the six electorates judge it from where they stand |
| **targets somebody** — a camp refused, a leader humiliated, a government censured, an ally dropped | `popularity` + `appeal` | the camp you aimed at cannot applaud |

**The third line is the one that gets forgotten, and a bare `popularity` there says the
opposite of the scene's own text.** A flat gain is spread over all six electorates *and
tilted towards the ones closest to you* (`APPEAL_TILT`), so "I refused an alliance with the
hard left" written as `"popularity": 9` warms the hard left most of all. Refusing a pact,
telling the country what a rival demanded behind closed doors, bringing down a government
you sat in, crossing the floor: all of them need the camp on the other end named.

```jsonc
// Runoff: you say on air what the eliminated candidate asked for.
"effects": { "poll": 5, "popularity": 7, "standing": 8,
             "appeal": { "scene": -11 } }      // his voters heard it too
```

### Positioning — `axis`, and the sign trap

`popularity` alone means **everybody, uniformly**: that is what it has always meant and
most scenes want nothing else. A scene is never obliged to take a side.

Add `axis` and the engine splits the reaction across the six electorates, from the distance
between the position you declare and each party's own axes, **on the declared axes only** —
a gesture about the economy is not judged on foreign policy. `"axis": "self"` means "where
my own camp stands", which is how you write *"give the base what it wants"* without knowing
who the player is.

> **The sign flips meaning.** Without `axis`, `"popularity": -7` means *the country dislikes
> this*. **With `axis`, the number is what those who AGREE with you gain** — so it is almost
> always positive, and the national cost comes out of the model on its own. Writing
> `"popularity": -7` next to a left-wing position tells the engine that the left hates it.
> When you add a position to an existing effect, flip the sign and re-read the magnitude.

Measured on the same starting point of 48 everywhere:

| scene | radical | socdem | centre | liberal | conserv. | identit. |
|---|---|---|---|---|---|---|
| joining the picket line | **51** | 50 | 47 | 45 | 42 | 44 |
| owning the deregulation | 33 | 42 | 49 | **54** | 51 | 44 |
| calling to block the far right | 53 | **54** | 53 | 54 | 44 | **35** |
| a plague on both houses | 52 | 48 | 47 | **42** | 50 | 52 |

A polarising choice yields less in aggregate than a consensual one of the same size. That is
the arbitration the split exists to create.

### Aiming at an electorate rather than a position

`"appeal"` names electorates directly. **Its targets are the ones `landscape` already
uses** — there is only one vocabulary to remember:

| Target | Whose opinion moves |
|---|---|
| `self` | your own electorate |
| `scene` | the camp of the figure the card put on stage (`cast`) |
| `ruling` | the camp that holds the presidency |
| `ally` | the camp you have a pact with |
| a party key | that camp, spelled out |
| `others` | every electorate but yours (`appeal` only — it means nothing for a landscape) |

A target that does not exist in this game (no ally, nobody on stage) does nothing, exactly
as in `landscape`, and the scene plays anyway.

```jsonc
"appeal": { "self": 7, "others": -2 }   // mobilise your base, and nobody else
"appeal": { "self": -11 }               // only your own voters punish you for this
"appeal": { "scene": -8 }               // the camp you just went after
"appeal": { "self": -13, "ruling": 6 }  // you took a job in their government
```

**Effects apply in the order they are written**, which matters exactly twice: an `appeal` on
`ally` goes *before* the `"alliance": null` that breaks the pact, and an `appeal` on `self`
after a `"join"` means the camp you have just joined (write `scene` instead and the order
stops mattering).

Use it for the three cases the axes cannot express. **Corridor scenes** — a federation
dinner, a signature traded, a committee — which the country never hears about: those belong
to `self` alone, and a national popularity move there is simply wrong. **Scenes whose own
text names the camp**: if the label says *"mobilise your base and nobody else"*, the effect
had better do exactly that. And **scenes aimed at somebody**, where the gesture is not
ideological at all but personal: you humiliated a leader, you refused a hand, you broke a
word. Nothing in the axes says that; `scene` does.

**Scale.** Five points with one electorate are worth about one point of national average.
Your own camp is two thirds of the gauge on the sheet (`POPULARITY_FOCUS`), so `self: -8`
is felt immediately and `scene: -8` mostly shows up on the day it decides a runoff.

`node tools/audit-popularite.js` reads the whole content and lists the choices that gain
popularity flat while the same effects damage a named camp. It should print nothing.

### Rolls: the branches may disagree, and usually should

A roll keeps its `success` and `failure` branches, and they do not have to carry the same
shape. The usual pattern: **a success is positioned** (it lands with the people who agree),
**a failure is uniform** (everybody thinks less of you for botching it). A left-wing gesture
that flops does not warm the far right — it just costs you everywhere, which is what a plain
negative `popularity` already says. Only give the failure a position when the botch itself
reads as a statement.

### Text placeholders
`{rival}` = staged figure's name (first mention adds party+office), `{rival_party}` =
their party, `{party}` = yours. **Gender agreement marks** for the staged figure (resolved
by `fillGender`): FR `{il}{le}{lui}{celui}{un}{e}{premier}`, EN `{he}{him}{his}`. Capitalize
the mark to capitalize the output: `{Le} soutenir`.

**A mark the table does not know is printed as-is**, braces and all, in the middle of the
sentence. Nothing crashes and nothing warns; the player simply reads `{son} suppléant`.
`node tools/valide-contenu.js` checks every mark in every deck against the real table —
run it after writing.

Three traps that are *not* mark problems, and that the checker cannot see:

- **The French possessive agrees with the thing owned, not the person.** *son nom*, *sa
  place*, *ses militants* — write them plainly, whatever the figure's gender. There is no
  `{son}` and there does not need to be one.
- **`{lui}` is the disjunctive pronoun** (*derrière lui / derrière elle*), and it resolves
  to `elle` for a woman. The indirect object pronoun is invariant — *lui proposer*, *vous
  lui offrez* — so write that one plainly too, or a woman gets *elle proposer*.
- **Elision does not vary.** *l'exclure* is the same for both, so write it out;
  `{Le} exclure` produces *Le exclure*.

---

## Adding a TRAIT — [traits.data.js](../js/traits.data.js)

```jsonc
"trait_id": {
  "family": "physique",          // caractere|physique|talent|appareil|reputation|affaires
  "kind": "asset",               // "asset" (good) or "mark" (bad) — sets the color
  "core": true,                  // chosen at creation; never drawn/lost/counted in the draw
  "birth": 5,                    // draw weight at birth (absent = never drawn)
  "axis": "apparence",           // birth traits are drawn once PER AXIS, independently
  "strikes": 3,                  // times an event must "strike" before it sticks
  "requiresParty": ["radical_left","identitarians"],   // only for (ex-)members of these
  "label": { "fr": "...", "en": "..." },
  "desc":  { "fr": "...", "en": "..." },
  "stats": { "eloquence": 2 },   // permanent stat mods, applied on gain / reclaimed on loss
  "target": { "popularity": 4, "standing": -3 },       // shifts gauge targets
  "partyTarget": { "conservatives": { "standing": -6 } }, // party-dependent target shift
  "energy": 2,                   // shifts the energy ceiling
  "rejection": 0.08,             // second-round voters who refuse you (0.08 = 8 points)
  "soften": 0.45,                // damps bad popularity news (0..1)
  "income": 14000,               // hidden euros per half-year (the engine prorates it per turn)
  "risk": { "p": 0.05, "chain": "enquete_ouverte" },   // per-YEAR chance to trigger a chain
  "blocks": ["intouchable"]      // incompatible traits removed when this is gained
}
```

**Writing rules (from the header):** one or two mods, each justifiable in a clause; never
add a malus "to balance" — balance happens *at the draw*. A trait must open/close event
doors, not just move numbers. A trait says what a person *is* ("orator", "heavyset"), not
where they are in a network. The body is a subject of satire toward how politics treats
bodies, never of the bodies themselves.

---

## Adding a PARTY — [data.js](../js/data.js) `PARTIES`

```jsonc
"party_key": {
  "axes": { "social": -85, "world": -70, "economy": -90, "power": -65 },  // each −100..+100
  "difficulty": 4,               // 1 (easy road to power) .. 5 (near impossible)
  "fit": {                       // compatibility with each origin & background; summed
    "modest": +3, "middle": +1, "bourgeois": -3, "dynasty": -1,
    "activism": +4, "journalism": +1, /* … all backgrounds … */ "celebrity": -2
  }
}
```

Axes: `social` (progressivism↔conservatism), `world` (internationalism↔nationalism),
`economy` (socialism↔capitalism), `power` (authoritarianism↔laissez-faire). Fit combines
three logics: **class** (anti-capitalist parties distrust wealth), **establishment** (a
dynasty is welcome in governing parties, resented by anti-system ones — left or right),
and **trade** (activism ↔ movement parties, business ↔ market parties, etc.).

Also add: a color `--p-party_key` in [style.css](../css/style.css), and the full set of
translation keys in [script.js](../js/script.js): `party_key`, `party_of_key`,
`party_the_key`, `party_key_desc` (the FR article forms are all needed).

---

## Adding an ENDING — [endings.data.js](../js/endings.data.js)

An ordered list; the **first** entry matching `from` + `when` wins, so put special cases
before the plain fallback that closes each family.
```jsonc
{ "id": "irreprochable",
  "from": "victory",             // engine end type: victory|retire|withdrawal|death|conviction
  "when": { "notTrait": ["caisse_noire"], "stat": { "reputation": { "min": 14 } },
            "flag": { "dirtyMoney": false } },   // same `when` grammar as events, plus trait/notTrait
  "title": { "fr": "...", "en": "..." },
  "text":  { "fr": "...", "en": "..." } }
```

---

## Adding a BUDGET post/tier — [budget.data.js](../js/budget.data.js)

Under `investments`, each post has ordered `levels` (level 0 = "none"):
```jsonc
"communication": {
  "label": {...}, "desc": {...},
  "levels": [
    { "name": {...}, "cost": 0 },
    { "name": {...}, "cost": 32000, "hold": { "popularity": 0.22 }, "nerve": 0.14 },
    { "name": {...}, "cost": 68000, "hold": { "popularity": 0.42 }, "nerve": 0.30 }
  ]
}
```
`hold` slows a gauge's decay, `nerve` cushions failed gambles, `protect` absorbs legal
risk. Reference a post's level in event `when` via `legal` / `comms`. Numbers should be
real-world plausible — "if an amount surprises, it's wrong."

---

## Adding NAMES — [names.data.js](../js/names.data.js)

`NAME_DATA` holds `female`, `male`, `surnames`, `surnames_particle`, and `rates`
(`particle`, `double` — probabilities 0..1 for the two rare surname forms). Pure lists;
add/remove freely. No full name of a real public figure — a resemblance breaks immersion.

---

## Adding a translation KEY — [script.js](../js/script.js)

For static HTML strings, add a key under both `fr` and `en` in `translations`, and
reference it with `data-i18n="key"` in HTML (or `data-i18n-placeholder` / `-title` /
`-aria` for attributes). A missing key logs a `[i18n]` console warning and leaves the HTML
text in place. Content-file prose does **not** use dictionary keys — it uses inline
`{ fr, en }` objects read by `L()`.
