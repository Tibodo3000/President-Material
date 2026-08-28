# The game loop

What actually happens each turn, how cards are drawn and resolved, and how the set
pieces branch off. The engine is [game.js](../js/game.js); the interpreter it calls is
in [interprete.js](../js/game/interprete.js); each set piece lives in its own file under
[js/game/modes/](../js/game/modes/) and registers itself with the engine
([registry.js](../js/game/registry.js)).

---

## A turn = a season

`4 turns = 1 year` (`TURNS_PER_YEAR`, in [balance.js](../js/balance.js)). The player
starts at age 30 (`START_AGE`) as a `militant`. Each turn presents **one card** on the
right of `game.html`. The player reads it, makes a choice, sees the consequences, clicks
continue — and the next turn advances.

**It used to be two turns a year, and elections ate the game.** Five contests per
five-year cycle spread over ten turns meant one turn in two was a ballot: measured over
sixty whole careers, **52% of turns were an election**, and a career played only **40 of
the 250 ordinary events**. The rest was not cut, it was drowned — there was no room
between two campaigns. Quartering the year changes nothing about the calendar (the
country still votes as often per decade) and doubles the number of turns between two
ballots. Same sixty careers, after: **27% of turns are an election, and 93 events get
played**.

**What that costs.** The player now lives through roughly twice as many scenes per year,
so a career accumulates progress faster — peak popularity rises from 63 to 77, peak
standing from 69 to 80, and the Élysée falls in 13 careers out of 60 instead of 3. That
is a balancing pass of its own, deliberately left out of the calendar change.

**Two rules keep the conversion honest.** Anything measured *per year* — a salary, a
mortality risk, a gauge drift — is written per year and divided by `TURNS_PER_YEAR` at
the moment it is applied. Anything measured *in delays* — an electoral cycle, the
follow-up to a scandal, a `minTurn` gate — is written in turns, and a turn is now a
quarter, so those numbers were doubled. Random noise is divided by √2 rather than 2:
it is a random walk, and it is the yearly variance that has to be preserved.

**The seasons are the French calendar.** `turn % 4` gives spring, summer, autumn,
winter, and every contest owns one of them: presidential in spring, legislative and
European in summer, municipal in autumn, party conference in winter. That is not
decoration — the engine holds at most one ballot per turn, so the offsets have to be
chosen so no two ever collide (see the `ELECTIONS` comment).

---

## `advanceTurn()` — the per-turn pipeline

Called between cards. In order ([game.js](../js/game.js) `advanceTurn`):

```
turn++, age += 0.25
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
bodyWarning()          → the body may schedule its next warning card (never ends anything)
──── burnout gate ─────  exhaustion, only after two warnings → end
──── mortality gate ────  accident always; illness only after a warning → end
──── withdrawal gate ───  forced exit (62+), only after a warning → end
── pick the card for this turn ──
```

Then it decides **which card** to show:

```
election due this turn?
├─ the party congress → straight to enterElection()   (no opening: see below)
├─ yes → a "scrutin" card: the election announces itself   (advanceTurn stops here)
│         └─ Continue → enterElection()  ─┬─ presidentielle AND the player runs → startCampaign()
│                                         ├─ presidentielle without them → startSupport()
│                                         ├─ no stake, or hopeless → startAside()
│                                         ├─ blocked but in reach → drawNomination()
│                                         └─ eligible → an "election" card (run / stand aside)
└─ no  → drawEvent()  (a normal event card)
```

**An election announces itself before it is played.** `advanceTurn` used to drop straight
into the election card, with the name of the contest tucked into the same line, case and
colour as an ordinary scene's title: `Législatives · 46 ans · Printemps · Année 17` looked
exactly like `Guerre interne · 49 ans · Printemps · Année 20`. Nothing told the player they
had changed regime.

Every election therefore opens on a **`scrutin` card** (`renderScrutinCard`): what is being
elected, the state of the country (`forcesHTML`, the same table as a campaign poll; for a
party congress, the contenders instead, because a congress does not ask the country), the
outgoing Assembly for a legislative, and — the line that was missing everywhere — **what is
at stake for the player** (`scrutinStake`): a seat you are defending, a nomination in reach,
the party leadership, or nothing at all. It costs a click, not a turn: `enterElection()`
runs in the same season, from the same `game.turn`.

**The party congress has no opening card.** It has no balance of forces to show — a congress
does not ask the country — and its own card already says everything an opening would. A
presentation window every four years to announce a members' meeting is a click for nothing.

---

## The card lifecycle

Every interactive card follows the same two-phase shape:

1. **Unresolved** — shows the event text and choice buttons.
2. **Resolved** — the player picked a choice; shows the *result text* + the change chips
   (`fx` pills), and a **Continue** button.

`renderCard()` ([game.js](../js/game.js)) looks `card.kind` up in the **mode registry**
and hands over; only the ordinary event card is drawn by the engine itself.
The HTML itself is produced in [js/game/render/](../js/game/render/) — the card's band,
buttons, chips and poll bars are the same pieces for every mode, which is what makes a
campaign card and an ordinary event feel like one game.
`handleClick()` is the single delegated click handler on `#event-area`: it reads the
`data-*` attribute of the clicked button, asks the **displayed card's mode** first, and
falls through to the engine's generic branches (`data-choice`, `data-continue`,
`data-restart`) when the mode does not know that button. That is what lets `data-choice`
mean one thing on a campaign card and another on an ordinary event, without the engine
knowing either mode exists. See *The set pieces* in
[architecture.md](architecture.md).

**The election band.** Everything that belongs to an election carries a `card-banner` at
the top of the card (`electionBanner(id, sub)`): the name of the contest, and the stage
when there is one ("Législatives · Temps 2 sur 3", "Présidentielle · Entre les deux tours").
A card without a band is an ordinary turn. That is the only thing the player needs to know
before reading the card, and the date line below it drops back to being a discreet marker
rather than a title.

**Resolving a choice** goes through `resolveChoice()` ([interprete.js](../js/game/interprete.js)):
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

## The set pieces

Most turns are a single event card. A handful of situations replace that with a
multi-screen flow, and each one owns a file: its state, its draw, its resolution, its
card and its buttons.

| Set piece | File | Card kinds |
|---|---|---|
| Presidential election, both rounds | [presidentielle.js](../js/game/modes/presidentielle.js) | `campaign` |
| Run or stand aside · refused nomination | [investiture.js](../js/game/modes/investiture.js) | `election`, `nomination` |
| Ordinary election campaign · choice of ground | [race.js](../js/game/modes/race.js) | `race`, `seat` |
| The presidential election you are not in | [soutien.js](../js/game/modes/soutien.js) | `support` |
| The primary | [primaire.js](../js/game/modes/primaire.js) | `primaire` |
| The card that opens an election | [scrutin.js](../js/game/modes/scrutin.js) | `scrutin` |
| The ballot that happens without you | [aside.js](../js/game/modes/aside.js) | `aside` |

### 1. Ordinary election → a "race" (2–3 steps)
When the player runs in a municipal/European/legislative/congress election, it isn't one
click. `startRace()` runs a `RACE_STEPS[election]`-long campaign (2 for most, 3 for
legislatives, 1 for a council seat). Each step is a race card that shifts a hidden
cumulative `bonus` via its `score` effect. Then `resolveRace()` computes the margin,
picks an outcome tier, and narrates it. The player sees a poll and a mood phrase
("it's close"), never a number.

- Poll math: `racePoll()` / `pollFor()` — the poll *is* the margin turned into percentages,
  so it can't lie without the result also lying. **The lead over the best rival is the
  margin**, and that took a fix: the player's share used to be an absolute function of the
  margin (31% for a margin of zero) while three rivals split the rest, so a coin-flip race
  displayed as 31 against 28, and a margin that loses one time in six displayed as 36
  against 26. The player read a comfortable lead and lost without understanding, which
  looks like a bug because it was one. A margin of zero now shows two bars at the same
  height, and an eleven-point lead on screen is an eleven-point margin — a defeat a little
  above one percent. The count's dice were not touched; the display was what lied.
- **The result card shows the result.** It used to show the *forecast*: `pollFor()` built
  its percentages from the margin plus `LUCK_MEAN`, while the verdict was drawn with
  `electionLuck()` — two different draws on one screen. You could read "25% against 31%"
  directly underneath the word *rout*. `pollFor()` now takes the realised margin as a
  fourth argument and `resolveRace()` passes it, so a rout displays as a rout.
- When the forecast and the count disagree, `resolveRace()` **says so** — in all four
  directions, not just one. Losing from ahead is the salt of an election night, but a
  consequence you cannot trace to its cause does not read as bad luck, it reads as a bug,
  and that is just as true of the player who takes three points of standing for a rout as
  of the one who takes fifteen for losing by a hair.

#### What an election night leaves
`ELECTION_OUTCOMES` still maps a margin to one of six texts (`large`, `win`, `narrow`,
`honorable`, `loss`, `rout`), but it no longer carries the numbers. Those come from
`applyOutcome(electionId, stake, marge, attendu)` in [game.js](../js/game.js), which reads
four things instead of one:

| | what it is | why |
|---|---|---|
| `OUTCOME_WON` / `OUTCOME_LOST` | two interpolated curves, standing + image | one table of tiers made a single point of margin worth four points of standing, and one continuous table would have paid six standing for losing by a tenth of a point — the win/loss line is a cliff, not a slope |
| `expectationFactor` + `outcomeGap` | the margin the poll showed the night before | nobody in politics is judged on their score; they are judged on the gap between their score and the one they were promised |
| `OUTCOME_STAKE` | what the office weighs inside the machine | a council seat and the party leadership were billed at the same rate |
| `ELECTION_WEIGHT` | how public the election was, and how far the news travels | the engine applied the result to all six electorates at the same amount, so a lost European seat cost eighteen points of opinion *with the radical left* |

Two more things changed with them. A losing *defense* no longer pays a forfeit on top
(`×1.4` then `−4` per gauge, which turned a nominal −1 of reputation into −5 and a rout
into −21 standing): it costs the seat, plus 15% on the negatives, and it keeps half of the
consolation the text promises. And `SEAT_KINDS` lost its `gain`/`perte` multipliers — the
ground you choose moves the *threshold*, which moves the forecast, which moves the bill,
so writing it twice only doubled it.

These stay in the engine on purpose: an election can be resolved without any campaign, and
`resolveElectionRun()` does exactly that — computing the same `attendu` from the poll the
scrutin card already showed the player.

#### Choosing your ground (`SEAT_KINDS`)
Above `SEAT_CHOICE_STANDING` (55), a conquest on a municipal/European/legislative ballot
opens a `seat` card first: safe seat, ordinary seat, or unwinnable constituency. Three
numbers describe each one, and they do different jobs:

- `SEAT_EDGE` — the **starting margin the label guarantees** (+10 / — / −14). This is the
  one that makes the word mean something: you are always ahead on the first poll in a safe
  seat, and never ahead in an unwinnable one.
- `threshold` — the ordinary shift underneath (−4 / 0 / +4), which still bites in bad years.
- `wind` — what the constituency owes the **national** balance of power, applied to
  `partyWind()` inside `electionBase()` via `seatShelter()` (0.3 / 1 / 1.6).

Both were missing, and without them the choice barely existed: nine or eleven points of
threshold, on a margin that the landscape and the dice move by thirty, is a nudge. Measured
over 150 careers, a **safe seat was won 54% of the time and led the first poll 55% of the
time**, while its card promised "won in advance — the seat is handed to you"; the unwinnable
one put the player *ahead* one time in ten, and one time in three when the party was riding
high. A word that is true nine times out of ten is not a word, it is a tendency.

Two ideas fix it. A safe seat is not a slightly easier seat, it is a seat where the national
balance of power does not apply — that is its definition, it holds when the party collapses
everywhere else, and the price of the shelter is that it does not ride the good years
either. And **you pick the constituency, not the candidate**: the general secretary does not
put a handicap on someone, he opens a file and finds a town that matches the label. An
excellent candidate in a surging party simply gets sent somewhere harder. So the terrain
guarantees a starting margin (`seatThreshold()` keeps whichever of the two thresholds is
harsher for an unwinnable seat, gentler for a safe one) instead of nudging a probability.

| | leads the first poll | wins: bad campaign / average / excellent |
|---|---|---|
| bastion | **100%** | 96% / 100% / 100% |
| ordinaire | 38% | 39% / 50% / 61% |
| imprenable | **0%** | 0% / 6% / 24% |

The unwinnable seat is a real bet again rather than a punishment: it takes an excellent
campaign *and* a good night, and the landscape is what decides whether it is worth trying —
with a great campaign it goes 17% when the party is weak against **33% when the party is
surging**, while never once showing the player in front on the opening poll. The three card
notes say all of this, since the game states what you are playing for and never a
probability.

### 2. Presidential election → 6 steps, then a fortnight
When the player leads their party at a presidential election, `startCampaign()` opens a
`CAMPAIGN_STEPS` (6) flow with a **visible poll** that moves on every decision
(`shiftPoll`). Between steps, rivals also move (`driftCampaign`). One scene is marked
`required` in the `campaign` deck: the big first-round debate always happens. Then:
- `resolveFirstRound()` — you must finish in the top two, or you're out.
- `startDuel()` — if you qualify, `runoff()` ([urnes.js](../js/game/urnes.js)) transfers
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

**The presidential election is the exception, and it used to be the worst card in the
game.** Three scenes were played blind, an invisible counter went up, and on the third
click a weighted draw named a president out of nowhere. The two things had no relation to
each other: what the player had been shown for three scenes and what decided the election
were separate systems, and there was nothing to watch.

It now runs on **a real field that the player can see move** (`supportField()`), built
exactly like a candidacy's except that the player is not in it — their camp is, carried by
whoever the primary nominated, flagged `mine`. Each of the three scenes shows the poll and
a mood line (`supportPoll`, `supportMood`); a `score` effect moves their camp's line
(`shiftSupport`, same diminishing returns as `shiftPoll`); the rivals move between scenes
(`driftSupport`). Then `resolveSupport()` **counts that field and nothing else**: the same
`runoff()` that resolves the player's own second round transfers the eliminated
candidates' votes, and the result card shows both rounds. A pact is honoured there too —
`runoff()` gives the ally's transfer to `isPlayer || mine`, because a pact is between
parties, not people.

Measured over 200 careers and 1361 such elections: the player's camp wins 11%, loses the
runoff 15%, is out in the first round 75%, and a sitting camp is returned 55% of the time.
Three scenes played well move their line by up to about seven points, which decides a close
election and never a lost one.

**The night is judged on the gap, then charged in proportion to what you were holding.**
It used to be a flat lookup on the winner's name: +10 standing if your camp won, −2 if it
lost the runoff, −6 if it went out in the first round. So a camp given fourth and carried
all the way to the final duel was *penalised* two points, and a camp handed to you in the
lead and dragged down to third cost exactly the same. Two functions now:

- `supportOutcome()` compares two numbers — what the camp was worth when the campaign
  opened (`support.baseShare`, recorded by `startSupport()`, same idea as `campaign.baseShare`)
  and what it polled on the Sunday. Where it finished still counts (govern +10, reach the
  runoff +3, go out first +6 against), but the progression is worth up to ±8 on top, and
  that is what separates a great losing campaign from a squandered one.
- `supportShare()` decides whose bill it is. Standing measures what you are worth *to your
  own side*, i.e. by comparison with them, and a collective beating demotes nobody inside
  the house: the swing is scaled by `rankOf()`, with anyone who leads the party at full
  weight. A militant answers for nothing — what they did in the three scenes is already
  paid by the scenes themselves, which do move standing. Good news travels wider than bad,
  though, so a positive result keeps a floor of 0.3: a camp that wins has posts to hand
  out, and having been there is worth something.

The result text says which way the camp moved, because a rising standing under the words
"your side did not make the runoff" reads as a bug otherwise.

---

## Ending the game

**An ending announces itself first.** Both forced exits — the withdrawal and death by
illness — are closed until the body has spoken on a card the player actually read
(`bodySpoke`, see *The end announces itself* in [systems.md](systems.md)). The scenes live
in [declin.data.js](../js/events/declin.data.js), three stages of three, and the last stage
always offers to stop on your own terms. The single exception is the **accident**: rare,
flat with age, announced by nothing, and with its own endings — because something has to
stay unforeseeable once everything else is foretold.

The engine knows only a handful of end *types* (`victory`, `retire`, `withdrawal`,
`death`, `conviction`), set by writing `game.ended = { type }`. The **narrated** ending
is then chosen by `resolveEnding()` ([carriere.js](../js/game/carriere.js)): it walks
[endings.data.js](../js/endings.data.js) in order and picks the first entry whose `from`
matches the type and whose `when` matches the final state. So the *same* victory reads
differently depending on whether you arrived clean or with a slush fund behind you.
`renderEnd()` draws the recap (years, peak office, final wealth, the traits you'll be
remembered by).
