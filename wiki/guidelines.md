# Contributing guidelines

How to work in this repo without making it worse. Three habits carry most of it: **start
from an up-to-date `main`**, **read the wiki before you write code**, and **update the
wiki in the same commit as the change**.

The rest of this page is about the fourth: keeping files small enough that the next
person can still find things.

---

## 1. Before you touch anything

**Get up to date before you write a line. Every session, no exceptions.** Which command
depends on whether you already have work in progress.

**Starting something new** — get back on `main` and pull:

```bash
git checkout main && git pull
```

Then branch. `main` is for pulling, not for working:

```bash
git checkout -b what-you-are-doing
```

**Picking up work you already started** — you have commits, or uncommitted changes, on a
branch. **Do not go through `main`**: you would only have to come back, and switching
branches with a dirty tree is how you lose an afternoon's work. Stay where you are and
replay your commits on top of what has landed since:

```bash
git pull --rebase
```

Rebase rather than merge, so your branch keeps reading as a straight line of your own
commits rather than growing a merge bubble for every sync.

Two things that will bite you here:

- **Rebase refuses on a dirty tree** (`rebase.autoStash` is not set in this repo). Commit
  or `git stash` first, rebase, then `git stash pop`.
- **A branch you have never pushed has no upstream**, so `git pull --rebase` stops with
  *"There is no tracking information for the current branch"*. That is not a failure — it
  means nothing remote can have moved under you. What you may still want is whatever
  landed on `main`:

```bash
git pull --rebase origin main
```

Skipping all this is how you spend an afternoon fixing a file someone already fixed, or
rewriting a decision that is already written down somewhere.

**Then read the wiki.** Not all of it — the page that covers what you are about to do:

| You are about to… | Read first |
|---|---|
| add or edit an event, trait, party, ending | [content-authoring.md](content-authoring.md) |
| change a rule, a gauge, a probability | [systems.md](systems.md) |
| touch the turn, a card, a set piece | [game-loop.md](game-loop.md) |
| add a file, move code, change load order | [architecture.md](architecture.md) |
| find where a function lives | [glossary.md](glossary.md) |
| **refactor anything** | **[Roadmap.md](Roadmap.md) — especially §10** |

That last row is not decoration. This project measures its own files and writes down what
should come out of them and — more usefully — **what must not**. A refactor plan drawn up
without reading it will contradict a decision that was made deliberately, with numbers.
It has already happened: a plan to split the event interpreter into four files was drawn
up and started before anyone noticed the Roadmap said, in writing, that it must stay
whole and why. Ten minutes of reading would have saved the detour.

---

## 2. The layering, and where new code goes

Dependencies point **down**. A layer never calls the one above it.

```
MODES          js/game/modes/*.js     one set piece per file, self-registering
RENDER         js/game/render/*.js    produces HTML, never mutates state
CONTROLLERS    create · party · tirage · game.js    the only files that touch the DOM
RULES          js/game/*.js · data.js  pure functions, no DOM
BALANCE        balance.js             numbers and nothing else
CONTENT        *.data.js              strict JSON shape
I18N           script.js              loaded first
```

Deciding where something belongs:

| What you are adding | Where it goes |
|---|---|
| a number that could be different without breaking anything | [balance.js](../js/balance.js), **always** |
| a word the content names (`LADDER`, `STAT_KEYS`, an election id) | the rules module that owns it — renaming it breaks content |
| a player-facing string | a `*.data.js` file, as `{ fr, en }` |
| a rule that reads those | the matching `js/game/*.js` module |
| anything that builds HTML | `js/game/render/` |
| a new multi-screen sequence | one file in `js/game/modes/`, registered in `registry.js` |

**No build, no ES modules, no server.** Everything is a global loaded by a `<script>` tag
in the right order. Adding a file means adding a line to `game.html` — and to any other
page that needs it. That cost is real, and it is the reason for the cap in §4.

---

## 3. The god-file test

A file has gone wrong when **you cannot say what is in it in one sentence**. Line count
is a symptom, not the disease: `interprete.js` is 1 107 lines and healthy, because it
describes one thing — an event, end to end.

Three questions, in order:

1. **Can I name it in one sentence?** If the honest answer is "the rules, and also the
   money, and also the polls", it is a god file.
2. **Do people scroll to find things?** Two related functions 1 500 lines apart is the
   real cost, and it does not show up in any metric.
3. **Does a change here force a change somewhere unrelated in the same file?**

`game-data.js` failed all three at 2 888 lines across ten subjects, and is now seven
modules. **`game.js` fails the first one today** at 3 584 lines — that is the known debt,
measured and planned as [Roadmap.md](Roadmap.md) §10.A. If you are about to add 200 lines
to it, read that section first.

---

## 4. How to split — measure, do not eyeball

**Count calls before you move anything.** For a candidate group of functions: how many
calls stay inside the group, how many leave it.

```
cohesion = internal calls / outgoing calls
```

Real numbers from this repo, and what they meant:

| group | internal | outgoing | verdict |
|---|---|---|---|
| the traits engine | 18 | 1 | **extract** — it only talks to itself |
| the money engine | 16 | 1 | **extract** |
| the country (landscape, approval, Assembly) | 32 | 5 | **extract** |
| the event interpreter | 22 | 22 | keep whole (see below) |
| election resolution | 4 | 18 | **do not touch** — 12 of the 18 go to the career; it is one thing |
| the turn pipeline | 13 | 13 | **do not touch** — its job *is* to call everyone |

Two rules the numbers do not give you:

- **Cohesion is not the only criterion.** The interpreter measures 1:1, which on paper
  says "split it". It stays whole because it is the file people read *when they write
  content*, and it describes one event from the `when` that lets a scene appear to the
  follow-up a choice schedules. Splitting it would mean opening four files to understand
  one card. **Ask who reads the file, not just who calls it.**
- **Stop at six or seven modules per layer.** Nothing enforces a boundary here — no ES
  modules, no imports — so past that point you are not organising, you are scattering,
  and each file costs a line in `game.html` that someone will forget.

### The protocol for a pure move

A move that changes no behaviour can be proven. Do it that way:

```bash
PM_CAREERS=200 node tools/regression.js > avant.txt
```

Move the code — **not one line rewritten**, only lines changed file. Then:

```bash
PM_CAREERS=200 node tools/regression.js > apres.txt
```

`diff avant.txt apres.txt` must be **empty**. If it is not, you changed behaviour; find
out why before you commit. Commit one module at a time, wiring `game.html` as you go, so
the game is playable at every commit.

**Never mix a move and a rewrite in the same commit.** The empty diff is the whole proof,
and it stops proving anything the moment you also changed logic.

---

## 5. What not to do

- **Do not move comments to the wiki.** In the engine and rules files, **43 % of the
  lines are comment** — 46 % in `game.js`, 52 % across the seven rule modules. That is
  not bloat, it is the *reason* sitting next to the rule, and it is the single most
  valuable thing this repo has. Deleting it looks like a huge win on a line count and is
  pure loss. The wiki says what a system is; the comment says why the number is what it
  is. They are not the same document, and one cannot replace the other.
- **Do not add a tuning number outside `balance.js`.** The test: if the value could be
  different without anything breaking — only the game playing differently — it belongs
  there.
- **Do not split a file because it is long.** Split it because it holds more than one
  subject. See §3.
- **Do not add a `<script>` tag without checking order.** Function declarations hoist and
  cross-file calls happen at runtime, so order is almost always free. The exception is a
  constant evaluated at load time: `interprete.js` opens with
  `const EVENTS = EVENT_DATA.events`, so it must come after `events/_assemble.data.js`.
- **Do not "improve" code you are not there to change.** Match the surrounding style even
  where you would write it differently. If you spot unrelated dead code, mention it —
  do not delete it.

---

## 6. Verify before you commit

Two commands, both from the repo root, both fast:

```bash
node tools/valide-contenu.js
```

Confronts every word of content with what the engine actually knows, in both languages.
A vocabulary mistake in an event does not crash anything — it silently does nothing,
which is worse.

```bash
PM_CAREERS=60 node tools/regression.js > /dev/null
```

Loads every script in the order `game.html` declares (read from the file, so the order is
tested too), then plays whole careers by clicking the **real rendered buttons**.

**Know its blind spot.** The harness proves the game has not *changed*. It does not prove
the code landed in the right place, and it does not prove the game is *good*. It has a
fake DOM, no CSS and no eye. When your change touches `game.html`, the load order, or
anything visual, also open the game and click through it.

---

## 7. Update the wiki — in the same commit

**The wiki is not a changelog. It describes the code as it is now.** When your change
makes a sentence in it false, the sentence is a bug, and you fix it in place.

| You changed… | Update |
|---|---|
| a file name, or where a function lives | [architecture.md](architecture.md), [glossary.md](glossary.md), [README.md](README.md) file map |
| the `<script>` list in `game.html` | [architecture.md](architecture.md) load order |
| a rule, a formula, a threshold | [systems.md](systems.md) |
| the turn, a card, a set piece | [game-loop.md](game-loop.md) |
| an event schema, a `when` key, an effect key | [content-authoring.md](content-authoring.md) — **and** `tools/editor.js` and `tools/valide-contenu.js`, which each redeclare the vocabulary |
| finished, or invalidated, a planned track | [Roadmap.md](Roadmap.md) |

Two things that are easy to miss:

- **A measurement in the wiki is a claim with a date.** If you quote a line count or a
  ratio, and the file later grows, the claim silently becomes a lie. Either re-measure it
  when you touch the section, or say when it was taken. §10 of the Roadmap now carries
  both the figures of its day and today's, for exactly this reason.
- **Some tools read the source as text.** `tools/valide-contenu.js` pulls `GENDER_MARKS`
  out of `interprete.js` by regex so it can check content without booting a DOM. Move
  that table and you repoint the tool.

Check your links before committing — one line, from the repo root:

```bash
node -e 'const fs=require("fs"),p=require("path");let k=0;for(const f of fs.readdirSync("wiki").filter(x=>x.endsWith(".md")))for(const m of fs.readFileSync(p.join("wiki",f),"utf8").matchAll(/\]\((\.\.\/[^)#]+)\)/g))if(!fs.existsSync(p.join("wiki",m[1]))){console.log("broken",f,m[1]);k++}console.log(k+" broken")'
```

---

## 8. Committing

Branch, never `main`. Commit as the personal `bebedou` account, never the work identity —
git identity is repo-local here.

Messages are in French, like the code. A subject line that says something about the
*game* or the *problem*, not about the mechanics of the edit — look at `git log` for the
register. The body is where you write down what you decided and why, including what you
deliberately did **not** do. That body is often the only place a rejected option survives,
and the next person needs it more than the diff.
