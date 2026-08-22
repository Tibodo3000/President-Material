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
| `playerStake(electionId)` | What an election offers the player (target + threshold) |
| `electionScore`, `electionBase`, `partyWind` | Ordinary-election scoring |
| `nominationBlocked`, `inTheRunning`, `drawNomination` | The nomination gate |
| `applyOutcome`, `outcomeFor`, `outcomeText`, `ELECTION_OUTCOMES` | Result tiers → effects/text |
| `startRace`, `drawRaceEvent`, `raceSteps`, `racePoll`, `pollFor`, `resolveRace` | Ordinary campaigns |
| `moodFor`, `raceMood` | The narrated "how it's going" phrase |
| `startCampaign`, `presidentialField`, `campaignOpponent`, `drawCampaignEvent` | Presidential campaign |
| `resolveFirstRound`, `resolveRunoff`, `concedeElection` | Presidential resolution |
| `setPresident`, `presidentName`, `isPresident`, `incumbentTermLimited`, `MAX_TERMS` | The presidency |
| `playerPull`, `figurePull` | A candidacy's weight |
| `backgroundElectionText`, `weightedParty` | Elections without the player |
| **Turn & cards** | |
| `advanceTurn()` | The per-turn pipeline |
| `warnAboutAge` | The two one-time end-of-career warnings |
| `drawEvent`, `quietEvent`, `laisseUneTrace`, `sansTrace`, `eventById` | Event drawing |
| `setScene`, `castFor`, `pickByWeight` | Staging the figure |
| `setOffice`, `promoteWithinParty`, `MANDATES`, `CADRE_IN/OUT` | Office transitions |
| `setPartyLead` | Take or hand back the party leadership; never touches the office |
| `leadershipText` | How a congress night is narrated (it is not an election) |
| `standDown`, `lobbyGain` | Not running / working the machine |
| `addLog`, `logText` | The journal |
| **Rendering** | |
| `renderAll` | Repaint everything (sets `data-party`) |
| `renderStatus`, `renderGauge`, `renderLandscape`, `renderJournal`, `renderBudget` | The left sheet & panels |
| `renderCard` | The right card — switches on `card.kind` |
| `renderRaceCard`, `renderCampaignCard`, `renderEnd` | Special-mode cards |
| `choiceButton`, `choiceButtons`, `unlockReasons` | Choice buttons + why-unlocked notes |
| `fxChip`, `fxLabel`, `fxDirection`, `effectsHTML`, `changesHTML` | The consequence chips |
| `traitRowsHTML`, `traitRowHTML`, `traitEffectText` | Traits on the sheet |
| `pollHTML`, `snapshot`, `diffSince` | Poll bars; before/after diffing for elections |
| `handleClick`, `handleBudgetClick`, `retire` | Input handlers |

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
