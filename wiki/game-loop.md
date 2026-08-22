# The game loop

What actually happens each turn, how cards are drawn and resolved, and how the special
modes branch off. The engine is [game.js](../js/game.js); the interpreter it calls is in
[game-data.js](../js/game-data.js).

---

## A turn = six months

`2 turns = 1 year`. The player starts at age 30 (`START_AGE`) as a `militant`. Each turn
presents **one card** on the right of `game.html`. The player reads it, makes a choice,
sees the consequences, clicks continue — and the next turn advances.

---

## `advanceTurn()` — the per-turn pipeline

Called between cards. In order ([game.js](../js/game.js) `advanceTurn`):

```
turn++, age += 0.5
applyBudget()          → income in, expenses out; auto-cut a post if broke
recoverEnergy()        → +2 every 2 years, capped at the age-eroding ceiling
credibilityDrift()     → stature drifts toward the level of your office
driftGauges()          → popularity & standing slide toward their stat-based targets
promoteWithinParty()   → militant↔cadre based on standing (the appareil job)
evolveRivals()         → figures age, rise, retire; heirs spawn; leaders ensured
landscapeBefore = {…}; driftLandscape()   → the national vote-share shifts
ensureGovernment()     → the ruling camp gets a PM + ministers
maybeDefection()       → someone may cross the floor
applyTraitTurn()       → hidden income, per-trait risk rolls, wealth-attention rolls
──── mortality gate ────  death (60+) → end
──── withdrawal gate ───  forced exit (62+, worsened by exhaustion) → end
── pick the card for this turn ──
```

Then it decides **which card** to show:

```
election due this turn?
├─ presidentielle AND player leads party → startCampaign()   (6-step campaign)
├─ other election:
│   ├─ blocked & hopeless (too far below threshold) → informational "aside" election card
│   ├─ blocked but in reach → drawNomination()  (a nomination-refused scene)
│   └─ eligible → an "election" card (run / stand aside)
└─ no election → drawEvent()  (a normal event card)
```

---

## The card lifecycle

Every interactive card follows the same two-phase shape:

1. **Unresolved** — shows the event text and choice buttons.
2. **Resolved** — the player picked a choice; shows the *result text* + the change chips
   (`fx` pills), and a **Continue** button.

`renderCard()` ([game.js](../js/game.js)) switches on `card.kind` and renders the right
template. `handleClick()` is the single delegated click handler on `#event-area`; it
reads `data-*` attributes on the clicked button (`data-choice`, `data-run`, `data-skip`,
`data-lobby`, `data-continue`, `data-race-next`, `data-campaign-next`, …) and drives the
state machine.

**Resolving a choice** goes through `resolveChoice()` ([game-data.js](../js/game-data.js)):
- If the choice has a `roll`, it rolls (`rollSucceeds`) and picks the `success` or
  `failure` branch; otherwise the choice *is* the branch.
- A *lost gamble* gets softened by `investNerve()` (your press service cushions bad luck).
- It applies `branch.effects` and any conditional `branch.effectsIf`, then returns the
  result text, a journal line, and the **actually-observed** changes (measured after the
  fact, so a stat already at its cap shows no change).

---

## How an event is drawn

`drawEvent()` ([game.js](../js/game.js)):
1. **A due chain wins first.** `dueChain()` returns any scheduled follow-up whose delay
   has elapsed and whose conditions match. This is how storylines unfold (a slush fund →
   an investigation → a search → a trial), with realistic delays.
2. Otherwise, build a weighted pool of every event whose `when` matches
   (`eventMatches()`), skipping the last one shown and anything already `seen` (unless
   `repeatable`). Higher `weight` = more copies in the pool. `weight: 0` reserves an
   event for chains only.
3. If the pool is empty (everything's been seen), fall back to a `quietEvent()` — the
   only events allowed to repeat.

`setScene()` fixes the staged figure (`game.scene`) when the card is drawn, so the name
stays the same across the question, the result, and the effects. The `cast` field
(`"opponent"`, `"leader"`, `"camp"`, `"camp_senior"`) chooses *who*.

**One event is played at most once per game** (unless `repeatable`). Events that leave a
permanent trace (a trait, a strike, a chain) can *never* repeat — otherwise a mark would
eventually fall in every game. See `laisseUneTrace()`.

---

## The three special modes

Most turns are a single event card. Three situations replace that with a mini-flow.

### 1. Ordinary election → a "race" (2–3 steps)
When the player runs in a municipal/European/legislative/congress election, it isn't one
click. `startRace()` runs a `RACE_STEPS[election]`-long campaign (2 for most, 3 for
legislatives, 1 for a council seat). Each step is a race card that shifts a hidden
cumulative `bonus` via its `score` effect. Then `resolveRace()` computes the margin,
picks an outcome tier, and narrates it. The player sees a poll and a mood phrase
("it's close"), never a number.

- Poll math: `racePoll()` / `pollFor()` — the poll *is* the margin turned into percentages,
  so it can't lie without the result also lying.
- Outcome tiers: `ELECTION_OUTCOMES` in [game.js](../js/game.js) map a margin to text +
  effects (`large`, `win`, `narrow`, `honorable`, `loss`, `rout`). A losing *defense*
  costs extra — you lose a seat, not just a try.

### 2. Presidential election → 6 steps, then a fortnight
When the player leads their party at a presidential election, `startCampaign()` opens a
`CAMPAIGN_STEPS` (6) flow with a **visible poll** that moves on every decision
(`shiftPoll`). Between steps, rivals also move (`driftCampaign`). One scene is marked
`required` in the `campaign` deck: the big first-round debate always happens. Then:
- `resolveFirstRound()` — you must finish in the top two, or you're out.
- `startDuel()` — if you qualify, `runoff()` ([game-data.js](../js/game-data.js)) transfers
  eliminated candidates' votes right away, by ideological proximity minus each finalist's
  `rejectionRate`. This is where positioning is paid: a candidate who thrilled their base
  and scared everyone else leads round one and loses round two. The transfers are shown
  immediately, as a two-way poll summing to 100.
- **The fortnight** — `RUNOFF_STEPS` (3) scenes from the `runoff` deck, ending on the
  runoff debate (`required`, `moment: 1`). `poll` effects now move the head-to-head
  (`shiftRunoff`, damped by `RUNOFF_WEIGHT`); `driftRunoff` adds a small wobble between
  steps. A well-played fortnight is worth roughly +2 points playing safe and up to +8
  taking every risk: enough to decide a close runoff, never enough to save a lost one.
- `resolveRunoff()` — counts exactly the head-to-head the player has been reading for a
  fortnight. No hidden second roll.

### 3. Blocked nomination → a "nomination" scene
If the party won't nominate you (`nominationBlocked()`: standing below the threshold),
you don't get a plain "work the machine" button. `drawNomination()` plays a scene from
the `nomination` deck with real choices and costs. If you're hopelessly far below
(`inTheRunning()` is false), the election just happens without you as an informational
card instead.

---

## Elections that don't involve the player

Every scheduled election still resolves in the background so the country always has a
president and the landscape keeps moving. `backgroundElectionText()` picks a winner by
weighted vote share (`weightedParty()`, with an incumbent bonus for a re-electable
sitting president) and nudges the landscape.

---

## Ending the game

The engine knows only a handful of end *types* (`victory`, `retire`, `withdrawal`,
`death`, `conviction`), set by writing `game.ended = { type }`. The **narrated** ending
is then chosen by `resolveEnding()` ([game-data.js](../js/game-data.js)): it walks
[endings.data.js](../js/endings.data.js) in order and picks the first entry whose `from`
matches the type and whose `when` matches the final state. So the *same* victory reads
differently depending on whether you arrived clean or with a slush fund behind you.
`renderEnd()` draws the recap (years, peak office, final wealth, the traits you'll be
remembered by).
