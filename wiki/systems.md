# Game systems (the rules)

The actual mechanics and how their numbers are calibrated. Most of this lives in
[game-data.js](../js/game-data.js), with the creation-side numbers in
[data.js](../js/data.js).

---

## Statistics: eight stats, two groups, scored `/20`

Stats live in `state.stats`, each clamped `0..20`. Two groups
(`STAT_GROUPS` in [data.js](../js/data.js)):

- **Personal (character):** `charisme`, `eloquence`, `energie`, `sangfroid`
- **External (influence):** `reseau`, `notoriete`, `reputation`, `credibilite`

The four external stats are deliberately distinct (see the long note atop
[data.js](../js/data.js)):
- **réseau** — who owes you something.
- **notoriété** — how well-known you are. Rises almost on its own; being known is not a
  virtue.
- **réputation** — how *clean* what's known about you is.
- **crédibilité** — *stature*: can people picture you in the chair? Added last, because
  the other three kept stepping on each other. Comes mostly from the office you hold
  (`CREDIBILITY_BY_OFFICE`), not from stunts.

### The `/20` vs `/10` scaling — important
Stats are stored on a 0–20 scale, but all the game's formulas, election thresholds, and
event difficulties were calibrated on a 0–10 scale. So they're converted at the point of
use by `statScore(s, key) = s.stats[key] * STAT_SCALE`, with `STAT_SCALE = 0.58`
([game-data.js](../js/game-data.js)). The factor is deliberately *not* 0.5: it keeps a
full career from saturating the ceiling while preserving the old point values. **When you
read a formula, remember most stat references go through `statScore`, not the raw value.**

Starting values are `BASE_STATS`; the creation choices add `STAT_MODIFIERS` (origin +
background), and the chosen personality is a *trait* whose stats are applied too
(`computeStats`). Balance intent, from the [data.js](../js/data.js) header:
- **Origin is intentionally unbalanced** — privilege is the subject of the game (+1 net &
  €5k for modest, up to +5 net & €400k for a dynasty, €3M for high bourgeoisie).
- **Personality is strictly balanced** — +3 net for every trait.
- **A lucrative background gives fewer stat points** — money is paid for in points.

---

## The two career gauges (0–100)

These exist only once the game starts and they drive everything:
- **popularity** — what the *country* thinks; wins universal-suffrage elections.
- **standing** (cote au parti) — what the *machine* thinks; without it, no nomination.

Two forces move them:
1. **Drift toward a target.** Each turn they slide toward a stat-derived target at rate
   `DRIFT = 0.28` (`driftGauges` → `driftToward`). This is "the bottom of your file",
   slow to move. Upward drifts at full rate; downward drift is *slowed* by how much you
   spend to hold your position (`investHold`).
2. **Event jolts.** Each choice gives an immediate hit, often in opposite directions —
   pleasing the machine costs you with the country, and vice versa.

Targets (`popularityTarget`, `standingTarget`):
- Popularity leans on notoriety, then reputation and charisma, plus office exposure. A
  perfect profile caps around **65, not 100** — stats set the sea level; the last 20
  points are taken event by event and only hold if you keep defending them. Ministers
  (−8) and PMs (−12) are penalized: the office makes you known, not loved; the PM is the
  fuse.
- Standing leans on réseau, credibility, party `fit`, and rank. Dirty money costs −8.

**Diminishing returns** (`bumpPop`): gaining points when you already top out is nearly
impossible; bad news always costs full price. Some traits (téflon) absorb a share via
`traitSoften`.

---

## Energy — the one spendable stat

`energie` is spent by demanding choices and recovered slowly:
- **Recovery** (`recoverEnergy`): +2 every 2 years (`turn % 4 === 0`), never above a
  ceiling.
- **Ceiling** (`energyCeiling`): holds at 14 until ~50, then drops 1 point every 3 years;
  health flags and some traits shift it. The UI draws a marker on the energy bar at this
  ceiling.
- **Cost of fatigue** (`fatigueMalus`): below 8, a penalty applies to *every* roll — you
  prepare badly and miss. Below a threshold, some choices are *hidden entirely* (a
  `when: { stat: { energie: { min: 8 } } }` on the choice), and the UI shows an
  "exhausted" note so the player knows options were removed, not just points.

---

## Credibility drift — stature comes from office

`credibilityDrift` ([game-data.js](../js/game-data.js)): every 2 years, credibility drifts
toward `CREDIBILITY_BY_OFFICE[position]`. It rises to reach your office's level, and
erodes if you sit well above it — but never all the way back down (`CREDIBILITY_OVERSHOOT`
= 4 points of earned stature stick). Two terms as a councillor will never make you
presidential material, whatever you answer to the cards. The header lists all nine places
credibility is read, for anyone tuning it by hand.

---

## Traits & strikes

Traits are durable marks (definitions in [traits.data.js](../js/traits.data.js), engine in
[game-data.js](../js/game-data.js)). Unlike stats, you either have one or you don't.
A trait can modify stats (applied on gain, reclaimed on loss), shift gauge *targets*
(`target` / party-specific `partyTarget`), change the energy ceiling, add second-round
`rejection`, soften bad news, produce hidden `income`, carry a per-turn `risk`, `block`
other traits, or require having been in certain parties (`requiresParty`).

**Strikes** (`addStrike`): some marks don't stick the first time. A trait with
`strikes: 3` needs three "strike" events before it lands. This is how "you said one thing
too many" becomes a reputation without every scene having to lie about what it depicts.
The UI warns the player as strikes accumulate.

**Birth draw:** two physical traits are dealt at character creation from different axes
(you can't be tall *and* short). The mix is weighted (`DRAW_MIX`): ~56% one asset + one
mark, ~22% two assets, ~22% two marks. See `drawBirthTraits` in [data.js](../js/data.js).

Families, in sheet display order (`TRAIT_FAMILIES`): `caractere`, `physique`, `talent`,
`appareil`, `reputation`, `affaires`.

---

## The career ladder & offices

`LADDER` ([game-data.js](../js/game-data.js)):
```
militant → cadre → conseiller → maire → euro → depute → ministre → chef → premier → (president)
```

**You hold only one office at a time.** No accumulation: a mayor elected as MP leaves the
town hall that evening and doesn't get it back if beaten. This is what gives each rung its
price — climbing means letting go.

**When you lose, you fall nowhere.** `officeAfterDefeat()`: a party job (`cadre`) if your
standing still justifies it (`NO_OFFICE_STANDING = 30`), otherwise back to `militant`. You
never drop onto a mandate you didn't win. `office: "none"` in an event routes through this.

Three offices aren't won at the ballot box: `cadre` (party apparatus, via standing),
`euro` and `ministre` (given — a ministry only exists while your camp governs and falls
the day it loses), and `premier` (Matignon — appointed and revoked by the president).

Nomination thresholds (`NOMINATION_THRESHOLD`) gate candidacy by standing; incumbents get
`INCUMBENT_DISCOUNT` (12) on mandates. Two of these locks — party leadership and the
presidential nomination — are the real bottlenecks of the game.

---

## The political landscape

`state.landscape` maps each party to a % vote share that lives and breathes the whole
game (`driftLandscape` in [game.js](../js/game.js)). Four forces move it: **incumbency
erosion**, **popular figures** pulling their party up, **the player** (more so at exposed
offices), and **random drift**. A `naturalShare()` floor pulls each party back toward
what it's "worth" (`24 − difficulty×3`) so 40 turns of noise don't make the six parties
interchangeable. Events move it too, via the `landscape` effect. `landscapeBefore` snapshots
last turn so the UI can show ▲/▼ trends.

The landscape decides the strength of presidential rivals and gives the player a readout of
the game: who they're fighting and whether their camp is rising or collapsing.

---

## Money & the budget

Money is euros, not a `/10` score, and the orders of magnitude are real
([budget.data.js](../js/budget.data.js) header). Each half-year, `applyBudget` runs a
semester of accounting:

- **Income** (`annualIncome`): office `salary` + `wealth_yield` (1.8%) on capital +
  hidden trait `income`.
- **Expenses** (`annualExpenses`): `lifestyle` (a *share* of income, ×origin multiplier,
  with a floor) + the chosen investment posts.
- **Balance** halved (semester) adjusts `money`. If it empties the account, the engine
  auto-cuts the most expensive post — nobody funds a comms agency on an overdraft.

**Adjustable posts** (`BUDGET_DATA.investments`, tuned live in the Budget panel):
- **communication** — its `hold` slows gauge *decay* (money doesn't buy popularity; it
  keeps earned popularity from refluxing) and its `nerve` cushions failed gambles.
- **juridique** — its `protect` absorbs a share of legal risk.

Spending is what makes risk playable: a lawyer on retainer or a press agency is exactly
what lets the player take chances. Budget levels are also usable as event *conditions*
(`when: { legal: 1, comms: 2 }`).

**Sleeping wealth attracts attention** (`wealthAttention` / `wealthRisk`): what's watched
is *enrichment* (`money − startMoney − WEALTH_EXPLAINABLE`), not inherited wealth. Clean
money draws a control you pass and brag about; dirty money draws a judge you don't always
pass. Lawyers reduce both.

---

## Chains (delayed follow-ups)

A scandal doesn't break the turn after the facts. An event can `chain: "some_id"` to
*schedule* a follow-up. `scheduleChain` picks a delay (the target event's `delay: [min,max]`
in turns, else `DEFAULT_CHAIN_DELAY`), and `dueChain` fires it when its turn arrives and
its conditions match — otherwise it waits, then expires after `CHAIN_PATIENCE` (not every
affair surfaces). This decoupling is the point: you don't immediately connect the
consequence to the decision.

---

## Elections math (summary)

- **Ordinary elections** score on `electionBase(electionId)` + dice, compared to the
  stake's `threshold`. Each election type weights different things: municipals are a
  contest of persons (réseau, weak party label), Europeans are the most national (party
  wind dominates), legislatives mix both, congress is standing-only (militants, not the
  country). See `electionBase` for the exact coefficients and their rationale.
- **`partyWind()`** turns the landscape into points of advantage/handicap — you don't win
  a legislative alone; your camp's national weight (plus a third of an ally's) shows up in
  the ballot box.
- **Presidential** is two rounds (`presidentialField` → `runoff`). Round one: be top two.
  Round two: eliminated votes transfer by ideological proximity, damped by each
  finalist's `rejectionRate` (radicalism, scandals, being a woman `femme` trait, an ally
  the country refuses, low stature). An alliance is paid here — an eliminated ally's voters
  follow you almost entirely. Term-limited incumbents (`MAX_TERMS = 2`) can't run again,
  and the bar collapses for everyone.
