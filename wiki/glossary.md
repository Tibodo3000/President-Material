# Function & concept index

A jump table to the code. Grouped by concern; each row says what it does and where it
lives. Filenames link to the file — search the function name inside to land on it.

---

## i18n — [script.js](../js/script.js)
| Symbol | What it does |
|--------|--------------|
| `translations` | The whole FR/EN dictionary object |
| `t(key)` | Look up a dictionary key in the active language |
| `L(obj)` | Return `obj.fr`/`obj.en` for inline `{ fr, en }` prose |
| `applyLanguage(lang)` | Re-translate the page; dispatches a `languagechange` event |
| `translateAttribute` | Translate `placeholder`/`title`/`aria-label` attributes |

## Creation-side shared logic — [data.js](../js/data.js)
| Symbol | What it does |
|--------|--------------|
| `BASE_STATS`, `STAT_MIN/MAX` | Starting stats and clamp bounds |
| `STAT_MODIFIERS`, `MONEY` | Per-choice stat and money tables (origin, background) |
| `computeStats(choices)` | Base + modifiers + personality trait, clamped |
| `computeMoney(choices)` | Sum inherited + earned capital |
| `formatMoney(amount)` | Locale-aware currency string |
| `PARTIES`, `AXES` | Party definitions; axis display order |
| `computeFit`, `fitLevel`, `FIT_LEVELS` | Party↔profile compatibility score → tier |
| `randomName`, `randomSurname`, `pickRandom` | Name generator (reads `NAME_DATA`) |
| `DRAW_MIX`, `pickWeighted`, `drawBirthTraits` | The starting-hand draw |
| `saveCharacter`, `loadCharacter` | `pm-character` persistence |
| `buildStatRows`, `renderCharacterSheet` | The shared right-hand sheet (DOM) |

## Loop rules & interpreter — [game-data.js](../js/game-data.js)
| Symbol | What it does |
|--------|--------------|
| `START_AGE`, `LADDER` | Age 30; the office ladder (the party leadership is *not* on it) |
| `officeAfterDefeat`, `NO_OFFICE_STANDING` | Where you land when you lose |
| `leadsParty`, `LEAD_EXPOSURE`, `LEAD_RANK` | The party leadership, which cumulates with the office |
| `exposureOf`, `rankOf` | Office + leadership, as read by the gauge targets |
| `ELECTIONS` | The electoral calendar (cycle/offset in turns) |
| `DRIFT`, `driftToward`* | Gauge convergence rate (*`driftToward` is in game.js) |
| `popularityTarget`, `standingTarget` | Stat-derived gauge targets |
| `NOMINATION_THRESHOLD`, `INCUMBENT_DISCOUNT` | Standing gates for candidacy |
| `deathProbability`, `withdrawalProbability` | End-of-career risk by age/health |
| `STAT_SCALE`, `statScore` | The 0–20 → 0–10 conversion used by every formula |
| `bump`, `bumpPop`, `bumpStanding`, `pay` | Bounded mutators (diminishing returns, soften) |
| `traitsOf`, `hasTrait`, `addTrait`, `removeTrait`, `applyTraitStats` | Trait bookkeeping |
| `addStrike`, `strikesNeeded`, `traitAllowed`, `partyHistory` | The strikes system |
| `traitTarget`, `traitSoften`, `traitSum` | What worn traits contribute |
| `investments`, `investSpec`, `setInvestment` | Budget-post state |
| `annualIncome`, `annualExpenses`, `annualBalance`, `applyBudget` | The semester ledger |
| `investHold`, `investProtect`, `investNerve` | What spending buys |
| `energyCeiling`, `recoverEnergy`, `fatigueMalus` | The energy system |
| `energyCost`, `payEnergy` | What a choice costs, and the residual overdraft |
| `wearOut`, `burnout`, `STRAIN_*`, `BURNOUT_*` | Strain, the `epuise` mark, and the career that stops (game.js) |
| `credibilityDrift`, `credibilityTarget`, `CREDIBILITY_BY_OFFICE`, `CREDIBILITY_LEAD` | Stature from office and from the party leadership |
| `eventMatches(ev, s)` | Evaluate a `when` block — the core condition engine |
| `fillText`, `fillBoth`, `fillGender`, `fillMarks`, `scenePresentation` | Text placeholder resolution |
| `applyEffects(effects, s, soften)` | Apply an `effects` block; returns real changes |
| `availableChoices`, `rollScore`, `rollBase`, `rollChance`, `rollSucceeds` | Choice rolls |
| `resolveChoice(choice, s)` | Roll → branch → effects → result + log |
| `mergeChanges`, `markSeen` | Chip de-duplication; once-tracking |
| `scheduleChain`, `dueChain`, `CHAIN_PATIENCE` | Delayed follow-ups |
| `applyTraitTurn`, `wealthAttention`, `wealthRisk`, `WEALTH_EXPLAINABLE` | Per-turn trait/money risk |
| `ideologicalDistance`, `NEIGHBOUR_DISTANCE`, `partyAxes` | Party geometry |
| `rejectionRate`, `runoff` | The second-round math |
| `shiftPoll`, `driftCampaign`, `CAMPAIGN_STEPS` | Presidential poll movement |
| `resolveEnding` | Pick the narrated ending from final state |

## The engine — [game.js](../js/game.js)

What is left once the set pieces and the drawing have moved out: the state, the
country, the career, the maths of an election, the turn, and the boot.
| Symbol | What it does |
|--------|--------------|
| `newGame(character)` | Build the whole `state` |
| `saveGame`, `loadGame`, `GAME_KEY` | `pm-game` persistence (stores card id only) |
| `init()` (bottom IIFE) | Boot: resume or start, backfill old saves, wire handlers |
| **Rivals & landscape** | |
| `makeFigure`, `figurePopularity`, `spawnFigure`, `FIGURE_RANKS` | The named figures |
| `initialLandscape`, `naturalShare`, `driftLandscape`, `normalizeLandscape` | Vote-share model |
| `moveShare`, `shiftLandscape`, `landscapeTarget` | Landscape mutation + effect targeting |
| `figuresOf`, `leaderOf`, `figureOf`, `sortedLandscape` | Landscape queries |
| **The Assembly** | |
| `computeAssembly`, `ASSEMBLY_SEATS/MAJORITY/POWER` | The 577 seats, dealt on legislative night |
| `formCoalition`, `governmentBloc`, `governmentSeats`, `majorityState` | Who backs the government, and how solidly |
| `partySeats`, `partyIsFirstGroup`, `partyIsPivot` | Where the *player's* party sits in the chamber |
| `driftApproval`, `approvalTarget`, `maybeCensure`, `primeMinister`, `governmentKind` | The government's standing and its fall |
| `evolveRivals`, `retireFigure`, `ensureLeaders`, `ensureGovernment` | Rivals' background life |
| `maybeDefection`, `defectionTarget`, `defectionWeight` | Floor-crossing |
| `switchParty`, `setAlliance` | Player changes camp / signs a pact |
| **Calendar & elections** | |
| `electionAtTurn`, `nextElection` | Calendar lookups |
| `electionCalendar`, `horizonLabel`, `renderCalendar` | The strip above the card: where you are, then the four deadlines ahead |
| `playerStake(electionId)` | What an election offers the player (target + threshold) |
| `electionScore`, `electionBase`, `partyWind` | Ordinary-election scoring |
| `applyOutcome`, `outcomeFor`, `outcomeText`, `ELECTION_OUTCOMES` | Result tiers → effects/text |
| `pollFor`, `moodFor` | The poll behind a contest, and its narrated mood — read by the race *and* by the card that offers it |
| `shiftSupport`, `driftSupport` | What a `score` effect and the rivals do to that poll |
| `setPresident`, `presidentName`, `isPresident`, `incumbentTermLimited`, `MAX_TERMS` | The presidency |
| `presidentialCandidate(party)` | Who a party fields — never a president who has served their two terms |
| `playerPull`, `figurePull` | A candidacy's weight |
| `backgroundElectionText`, `weightedParty` | Elections without the player |
| **Turn & cards** | |
| `advanceTurn()` | The per-turn pipeline |
| `enterElection(id)` | The second beat of an election: what `advanceTurn` used to do inline |
| `electionBanner` | The band at the top of every election card |
| `warnAboutAge` | The two one-time end-of-career warnings |
| `drawEvent`, `quietEvent`, `laisseUneTrace`, `sansTrace`, `eventById` | Event drawing |
| `setScene`, `castFor`, `pickByWeight` | Staging the figure |
| `setOffice`, `promoteWithinParty`, `MANDATES`, `CADRE_IN/OUT` | Office transitions |
| `setPartyLead` | Take or hand back the party leadership; never touches the office |
| `leadershipText` | How a congress night is narrated (it is not an election) |
| `standDown` | Handing back a mandate you will not defend |
| `addLog`, `logText` | The journal |
| **Rendering & input** | |
| `renderAll` | Repaint everything, in order (sets `data-party`) |
| `renderCard` | The right card — looks `card.kind` up in `MODES`, draws the ordinary event itself |
| `snapshot`, `diffSince` | Photograph the state before an election, compare after — elections move the gauges themselves, they do not go through `applyEffects` |
| `handleClick`, `retire` | Input handlers (the rest of the drawing lives in `js/game/render/`) |

## The rendering — [js/game/render/](../js/game/render/)

Everything that produces HTML. It reads the state and never changes it.

| Symbol | Where | What it draws |
|--------|-------|---------------|
| `renderStatus`, `renderGauge`, `renderCalendar`, `fmtAge`, `seasonLabel` | [fiche.js](../js/game/render/fiche.js) | The left sheet and the calendar strip above the card |
| `renderAssembly`, `renderExecutive`, `hemicycleHTML`, `hemicycleSeats`, `HEMICYCLE_ORDER` | [panneaux.js](../js/game/render/panneaux.js) | The power panel: who governs, and the 577 seats as a drawn hemicycle |
| `renderLandscape`, `trendHTML`, `renderJournal` | [panneaux.js](../js/game/render/panneaux.js) | The opinion panel, its ▲/▼ trends, and the journal |
| `cardHeader`, `electionBanner` | [carte.js](../js/game/render/carte.js) | The date line, and the band that says an election is on |
| `choiceButton`, `choiceButtons`, `unlockReasons`, `RISKY_CHANCE` | [carte.js](../js/game/render/carte.js) | Choice buttons, and why one is open |
| `fxChip`, `fxLabel`, `fxDirection`, `effectsHTML`, `changesHTML` | [carte.js](../js/game/render/carte.js) | The consequence chips |
| `traitRowsHTML`, `traitRowHTML`, `traitEffectText` | [carte.js](../js/game/render/carte.js) | Traits, on the sheet and on a card |
| `pollHTML`, `sortedField`, `fieldName`, `winnerName`, `continueButton` | [carte.js](../js/game/render/carte.js) | The poll table — the same widget for a contest's balance of power, both rounds, and the presidential election you are not in |
| `renderBudget`, `investPostHTML`, `investEffectText`, `budgetLine`, `handleBudgetClick` | [budget.js](../js/game/render/budget.js) | The budget block, and the only controls outside a card |
| `renderEnd` | [fin.js](../js/game/render/fin.js) | The ending and the career recap |

## The set pieces — [js/game/modes/](../js/game/modes/)

Each file owns one flow end to end and registers itself in `MODES`
([registry.js](../js/game/registry.js)): `ready?`, `render`, `clicks`. The engine
never names them. See *The set pieces* in [architecture.md](architecture.md).

| Symbol | Where | What it does |
|--------|-------|--------------|
| `MODES`, `modeFor`, `modeClick` | [registry.js](../js/game/registry.js) | The registry, and the two lookups the engine makes |
| `startCampaign`, `presidentialField`, `campaignOpponent`, `campaignMinor`, `drawCampaignEvent`, `pickCampaignScene` | [presidentielle.js](../js/game/modes/presidentielle.js) | The six campaign steps and their scene picker |
| `resolveFirstRound`, `startDuel`, `drawRunoffEvent`, `duelField`, `resolveRunoff`, `concedeElection` | [presidentielle.js](../js/game/modes/presidentielle.js) | First-round verdict, the fortnight, the runoff count |
| `renderCampaignCard`, `campaignChoice`, `campaignNext`, `campaignRunoff`, `duelNext`, `campaignVerdict`, `campaignDone` | [presidentielle.js](../js/game/modes/presidentielle.js) | Its card and its six buttons |
| `nominationBlocked`, `inTheRunning`, `drawNomination`, `lobbyGain` | [investiture.js](../js/game/modes/investiture.js) | The nomination gate, and working the machine |
| `rebelGap`, `rebellionButtons`, `rebelRefuge`, `rebelChoice`, `REBEL_*` | [investiture.js](../js/game/modes/investiture.js) | The two doors out of a refused nomination |
| `renderElectionCard`, `renderNominationCard`, `electionPitch`, `blockedPitch`, `electionRun`, `electionSkip`, `electionLobby` | [investiture.js](../js/game/modes/investiture.js) | Run or stand aside, and the refused-nomination scene |
| `startRace`, `raceSteps`, `drawRaceEvent`, `racePoll`, `raceMood`, `resolveRace`, `RACE_STEPS` | [race.js](../js/game/modes/race.js) | The 2–3 step campaign of an ordinary election |
| `seatChoiceAvailable`, `renderSeatCard`, `seatChoice`, `SEAT_KINDS` | [race.js](../js/game/modes/race.js) | Choosing the ground before running on it |
| `startSupport`, `supportField`, `supportPoll`, `supportMood`, `resolveSupport` | [soutien.js](../js/game/modes/soutien.js) | The presidential election the player is not in |
| `primaryDue`, `primaryField`, `designateNominee`, `resolvePrimary`, `PRIMARY_*` | [primaire.js](../js/game/modes/primaire.js) | Who the party puts up |
| `renderScrutinCard`, `forcesHTML`, `sortanteHTML`, `scrutinStake` | [scrutin.js](../js/game/modes/scrutin.js) | The card that opens a contest: the country, the outgoing Assembly, what it means for you |
| `startAside`, `drawAside`, `renderAsideCard` | [aside.js](../js/game/modes/aside.js) | The ballot that happens without you |

## Page controllers
| File | Entry points |
|------|-------------|
| [create.js](../js/create.js) | `readChoices`, `refresh`, random-name button, submit → `party.html` |
| [party.js](../js/party.js) | `buildPartyCards`, `renderFitBadges`, `renderPartyPanel`, submit → rolls draw → `tirage.html` |
| [tirage.js](../js/tirage.js) | `currentDraw`, `traitCardHTML`, `traitEffects` — display only |

---

## Quick "where do I change…?" table

| I want to change… | Go to |
|-------------------|-------|
| A number a player sees (salary, cost, threshold) | the relevant `*.data.js`, or the named const in [game-data.js](../js/game-data.js) |
| How hard an election is | `playerStake` thresholds + `electionBase` in [game.js](../js/game.js) |
| What a stat/gauge is worth | `popularityTarget`/`standingTarget` and `STAT_SCALE` in [game-data.js](../js/game-data.js) |
| The turn order | `advanceTurn()` in [game.js](../js/game.js) |
| A UI string | `translations` in [script.js](../js/script.js) (static) or the content file (prose) |
| Party colors | `--p-*` vars in [style.css](../css/style.css) |
| Add game content | see [content-authoring.md](content-authoring.md) |
