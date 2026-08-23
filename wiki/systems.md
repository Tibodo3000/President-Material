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
  prepare badly and miss. Some choices are also *hidden entirely* by a
  `when: { stat: { energie: { min: 8 } } }`, and the UI shows an "exhausted" note so the
  player knows options were removed, not just points.

### You cannot spend what you do not have

`energie` is clamped at 0, so a choice costing three points cost *nothing* to somebody who
had none. Once empty, you said yes to everything for free, and the one resource the game
asks you to manage became an unlimited overdraft: zero was the best position in the game,
which is the exact opposite of what it is meant to say.

`availableChoices()` ([game-data.js](../js/game-data.js)) therefore **removes any choice
you cannot afford**. The gating cost is `energyCost(choice)` — the *worst* branch of a
roll, since you choose before you know which one comes out, and a choice must never be able
to end in an overdraft. A safety net keeps the cheapest option when everything is too
expensive: a card with no playable choice is not a card.

`payEnergy()` still exists for the residual overdraft — trait risks, conditional extra
effects on top of a cost already paid — and charges the unpayable part to `sangfroid`,
which is what gives way first when you do not sleep.

### Living on empty: strain, `epuise`, and burnout

You do not burn out on one sleepless night, you burn out on years without margin.
`wearOut()` ([game.js](../js/game.js)) keeps a **strain** counter on `state.strain`:

| | |
|---|---|
| `STRAIN_LOW` (3) | at or below this energy, strain climbs by 1 each turn |
| `STRAIN_REST` (7) | at or above it, strain falls by 1 — easing off genuinely undoes it |
| `STRAIN_STRIKE` (5) | every five points, the body sends a sign: a strike toward `epuise` |
| `BURNOUT_STRAIN` (14) | past this, and only while still empty, the career can stop |

`epuise` ("Épuisé") is **not** `use` ("Usé"). Wear is the erosion of a late career and does
not heal; exhaustion is an acute state you inflict on yourself and come back from. It costs
`sangfroid` −2 and two points of recovery ceiling, needs two strikes to land, and
`fatigue_arret` can lift it — for twelve points of standing.

Burnout ends the career as a `withdrawal`, **warned one turn ahead** (`burnout()`): a
game-over that falls without notice is a game-over you did not get to play. The narrated
ending is `burnout` in [endings.data.js](../js/endings.data.js) for anyone under 58, since
"the party calls it a transition" means nothing at forty-three.

Measured over 150 careers: a player choosing at random ends up exhausted 10% of the time and
warned 3%; a player who always takes the most demanding option is exhausted 95% of the time
and forced out by their body in 93% of careers. Forcing has a term, and it is a career
choice rather than a random punishment.

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
militant → cadre → conseiller → maire → euro → depute → ministre → premier → (president)
```

**You hold only one office at a time.** No accumulation: a mayor elected as MP leaves the
town hall that evening and doesn't get it back if beaten. This is what gives each rung its
price — climbing means letting go.

> **The one exception is the party leadership, and it is not on this ladder.** See
> *Leading the party* below.

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

## Leading the party — the only thing that cumulates

`chef` used to be a rung of the ladder, wedged between `ministre` and `premier`. The engine
drew the only conclusion it could: taking the party meant handing back your seat. A player
elected leader of their own camp woke up with no constituency, no town hall and no ministry,
and every MP-gated event stopped firing. There is not a party leader in France who is not
also a deputy or a mayor; it is the other way round — you take the house *because* you have
a base somewhere.

**So the leadership left the ladder.** It lives in its own field, `state.partyLead`, and the
career peak remembers it separately in `state.peakLead`. `state.position` keeps holding the
office, and the two are displayed together on the sheet ("Député · Chef du parti").

What it adds, on top of whatever the office already gives (`game-data.js`):

| | Value | Read by |
|---|---|---|
| `LEAD_EXPOSURE` | +12 | `exposureOf()` → popularity target, landscape pull |
| `LEAD_RANK` | +4 | `rankOf()` → standing target, primary weight |
| `CREDIBILITY_LEAD` | 15 (a floor, +3 above it) | `credibilityTarget()` → stature drift |

The three numbers restate what the old `chef` rung was worth (22 exposure, 7 rank, 15
stature) minus what an ordinary elected official already has: the cumul closes the gap, it
is not a gift. A leader with no mandate is therefore weaker inside the machine than a leader
who is also an MP, which is exactly right.

**Taking and losing it.** `setPartyLead()` ([game.js](../js/game.js)) is the only door.
It is opened by the party congress (`electionStake("congres")` targets `"chef"`, and
`applyOutcome` routes that target to `setPartyLead` instead of `setOffice`), by the `lead`
event effect, and it is closed by: losing the congress you were defending, standing aside at
that congress, a presidential run lost from too low a standing, or crossing the floor
(`switchParty` — the mandate follows you, the leadership never does). **None of these touch
`position`.** A congress is not an election: it counts members, not voters, and it cannot
take a constituency away from anyone.

`officeAfterDefeat()` also floors a leader at `cadre`: you do not go back to being a rank
and file member of a party you chair.

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

## The Assembly — where the player actually sits

577 seats, dealt on legislative-election night (`computeAssembly` in
[game.js](../js/game.js)) and untouched until the next one. First-past-the-post is modelled
by raising each party's vote share to `ASSEMBLY_POWER` (2.1) before normalising, so a party
on 28% takes far more than 28% of the seats and a party on 8% takes almost nothing.
`formCoalition()` then decides, once per legislature, which neighbouring camps vote the
government's bills; `majorityState()` returns `"absolue"`, `"relative"` or `"aucune"`.

All of that existed and drove almost nothing: five events out of 211 read the majority, and
none asked the player what they intended to do about it. Four helper functions now expose
the player's own position in the chamber, and they are what the event `when` grammar reads
(`inCoalition`, `firstGroup`, `pivot`, `minSeats`/`maxSeats`):

| Function | Says |
|---|---|
| `partySeats()` | how many seats your party holds |
| `partyIsFirstGroup()` | your party is the largest group — which is *not* governing, and is the most uncomfortable place in the Fifth Republic |
| `partyIsPivot()` | the government has no majority and would have one with you. Nothing in the constitution describes this position and it is the most expensive one in the country |
| `governmentBloc()` | the parties that vote the government's bills |

The [assemblee](../js/events/assemblee.data.js) deck covers the whole matrix (camp in power
or not × absolute / relative / no majority × with or without a pact), plus the five-step
alliance chain a party leader plays when a legislative election gives nobody a majority.

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
