/*
 * President Material — HARNAIS DE NON-RÉGRESSION.
 *
 * À quoi ça sert. Le projet n'a pas de tests, et il n'en veut pas : pas de
 * build, pas de dépendance, on ouvre index.html en double-cliquant. Mais on
 * refactore quand même, et il faut bien savoir si le moteur s'est mis à
 * répondre autre chose. D'où ce fichier, qui ne teste RIEN en particulier et
 * vérifie LA SEULE chose qui compte pour un refactor : le jeu se comporte-t-il
 * exactement comme avant ?
 *
 * Comment. Il charge les scripts du jeu dans l'ordre déclaré par game.html —
 * lu dans le fichier, pas recopié à la main, donc l'ordre de chargement est
 * vérifié lui aussi — dans un contexte vm muni d'un faux DOM et d'un
 * Math.random SEEDÉ. Puis il joue des carrières entières en cliquant sur les
 * boutons RÉELLEMENT RENDUS (les vrais <button> du HTML produit, pas des
 * appels de fonction devinés), et écrit une trace : à chaque étape, l'état du
 * jeu et l'empreinte du HTML de chaque panneau.
 *
 * Usage :
 *
 *     node tools/regression.js > avant.txt      # sur le code d'origine
 *     … on refactore …
 *     node tools/regression.js > apres.txt
 *     diff avant.txt apres.txt                  # vide = aucune régression
 *
 * Réglages par variables d'environnement :
 *   PM_CAREERS  nombre de carrières (60 par défaut ; 200 pour une passe sérieuse)
 *   PM_STEPS    clics maximum par carrière (400 par défaut)
 *
 * La couverture (types de carte et boutons traversés) part sur stderr, donc
 * elle ne pollue pas la trace : `node tools/regression.js > t.txt` l'affiche.
 *
 * CE QU'IL NE FAIT PAS. Il ne dit pas si le jeu est BON, seulement s'il a
 * changé. Une régression volontaire (un réglage d'équilibrage) fera diverger
 * la trace : c'est normal, on relit le diff et on reprend une référence. Et il
 * ne remplace pas d'ouvrir le jeu : il a un faux DOM, pas de CSS, pas d'œil.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

/* La racine du projet : le dossier parent de tools/. */
const ROOT = process.argv[2] || path.join(__dirname, "..");

/* --- L'ordre de chargement, lu dans game.html (pas recopié à la main) ----- */
function loadOrder() {
  const html = fs.readFileSync(path.join(ROOT, "game.html"), "utf8");
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
}

/* --- Aléa seedé (mulberry32) --------------------------------------------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --- Un DOM juste assez vrai --------------------------------------------- */
function makeElement(tag) {
  const el = {
    tagName: tag || "div",
    _attrs: {},
    innerHTML: "",
    textContent: "",
    hidden: false,
    dataset: {},
    style: { width: "", setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute(k, v) { el._attrs[k] = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(el._attrs, k) ? el._attrs[k] : null; },
    hasAttribute(k) { return Object.prototype.hasOwnProperty.call(el._attrs, k); },
    removeAttribute(k) { delete el._attrs[k]; },
    appendChild() {},
    addEventListener() {},
    closest() { return el; },
    querySelector() { return makeElement("div"); },
    querySelectorAll() { return []; },
  };
  // parentElement : cree a la demande, une seule fois, et sans remonter a
  // l'infini (le parent d'un parent est lui-meme).
  let parent = null;
  Object.defineProperty(el, "parentElement", {
    get() {
      if (!parent) { parent = makeElement("div"); parent.parentElement = parent; }
      return parent;
    },
    set(v) { parent = v; },
    configurable: true,
  });
  return el;
}

function makeDom() {
  const byId = new Map();
  const domReady = [];

  const document = {
    readyState: "loading",
    title: "",
    body: makeElement("body"),
    documentElement: makeElement("html"),
    getElementById(id) {
      if (!byId.has(id)) byId.set(id, makeElement("div"));
      return byId.get(id);
    },
    querySelector() { return makeElement("div"); },
    querySelectorAll() { return []; },
    createElement(tag) { return makeElement(tag); },
    addEventListener(type, fn) { if (type === "DOMContentLoaded") domReady.push(fn); },
    dispatchEvent() { return true; },
  };
  return { document, byId, domReady };
}

function makeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _map: map,
  };
}

/* --- Boot d'une partie ---------------------------------------------------- */
function boot(seed, character) {
  const { document, byId, domReady } = makeDom();
  const localStorage = makeStorage();
  localStorage.setItem("pm-character", JSON.stringify(character));
  localStorage.setItem("pm-lang", "fr");

  const redirects = [];
  const sandbox = {
    document, localStorage,
    console: { log: () => {}, warn: () => {}, error: () => {}, info: () => {} },
    navigator: { language: "fr-FR" },
    location: { replace: (u) => redirects.push(u), href: "" },
    CustomEvent: function (type, init) { return { type, detail: init && init.detail }; },
    Math: Object.create(Math),
    JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error, Map, Set,
    parseInt, parseFloat, isNaN, isFinite,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.window.confirm = () => true;
  sandbox.Math.random = mulberry32(seed);

  const ctx = vm.createContext(sandbox);

  for (const rel of loadOrder()) {
    const code = fs.readFileSync(path.join(ROOT, rel), "utf8");
    try {
      vm.runInContext(code, ctx, { filename: rel });
    } catch (e) {
      throw new Error("Chargement de " + rel + " : " + e.message);
    }
  }

  // Dans le navigateur, les scripts sont en fin de <body> : readyState vaut
  // "loading" pendant le chargement, et DOMContentLoaded part après.
  document.readyState = "complete";
  domReady.forEach((fn) => fn());

  if (redirects.length) throw new Error("Redirection inattendue : " + redirects.join(", "));
  return { ctx, sandbox, byId };
}

/* --- Lecture des boutons réellement rendus -------------------------------- */
function parseButtons(html) {
  const out = [];
  for (const m of html.matchAll(/<button\b([^>]*)>/g)) {
    const raw = m[1];
    if (/\bdisabled\b/.test(raw)) continue;
    const attrs = {};
    for (const a of raw.matchAll(/([a-zA-Z-]+)(?:="([^"]*)")?/g)) {
      if (a[1] === "class" || a[1] === "type") continue;
      attrs[a[1]] = a[2] === undefined ? "" : a[2];
    }
    if (Object.keys(attrs).some((k) => k.startsWith("data-"))) out.push(attrs);
  }
  return out;
}

function fakeButton(attrs) {
  const el = makeElement("button");
  el._attrs = { ...attrs };
  el.closest = (sel) => (sel === "button" ? el : null);
  return el;
}

const md5 = (s) => crypto.createHash("md5").update(String(s)).digest("hex").slice(0, 10);

/* --- Une carrière, du premier tour à l'écran de fin ----------------------- */
const PANES = ["event-area", "sheet-name", "sheet-meta", "sheet-meta-2", "pane-assembly",
               "pane-landscape", "pane-journal", "sheet-budget", "election-calendar",
               "gauge-pop-value", "gauge-standing-value", "sheet-money", "trait-rows"];

const COVER = { kinds: new Map(), clicks: new Map() };
const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);

function playCareer(seed, character, maxSteps) {
  const { ctx, sandbox, byId } = boot(seed, character);
  const pick = mulberry32(seed ^ 0x5f3759df); // aléa du PILOTE, séparé de celui du jeu
  const trace = [];
  const html = (id) => (byId.has(id) ? String(byId.get(id).innerHTML) : "");
  const paneHash = (id) => md5(html(id) + "" + (byId.has(id) ? String(byId.get(id).textContent) : ""));

  const step = (label, clicked) => {
    const g = vm.runInContext("game", ctx);
    trace.push([
      label, clicked || "",
      g ? g.turn : -1,
      g ? Math.round(g.age * 10) / 10 : -1,
      g ? g.position : "?",
      g ? (g.partyLead ? "chef" : "-") : "?",
      g ? Math.round(g.popularity) : -1,
      g ? Math.round(g.standing) : -1,
      g ? Math.round(g.money) : -1,
      g ? g.party : "?",
      g && g.card ? g.card.kind + ":" + (g.card.id || "") + ":" + (g.card.resolved ? "r" : "u") : "none",
      g && g.ended ? g.ended.type : "-",
      g ? (g.traits || []).slice().sort().join("|") : "",
      g ? (g.log || []).length : -1,
      PANES.map(paneHash).join(","),
    ].join("\t"));
  };

  step("boot");

  for (let i = 0; i < maxSteps; i++) {
    const g = vm.runInContext("game", ctx);
    if (g && g.card) bump(COVER.kinds, g.card.kind);
    if (g && g.ended && (!g.card || g.card.kind === "end")) break;

    const buttons = parseButtons(html("event-area")).filter((b) => !("data-restart" in b));
    if (!buttons.length) { trace.push("PLUS DE BOUTON\t" + (g && g.card ? g.card.kind : "?")); break; }

    const chosen = buttons[Math.floor(pick() * buttons.length)];
    const label = Object.keys(chosen).filter((k) => k.startsWith("data-"))
      .map((k) => k + (chosen[k] ? "=" + chosen[k] : "")).join(" ");

    Object.keys(chosen).filter((k) => k.startsWith("data-")).forEach((k) => bump(COVER.clicks, k));
    try {
      sandbox.handleClick({ target: fakeButton(chosen) });
    } catch (e) {
      trace.push("ERREUR\t" + label + "\t" + e.message + "\n" +
        String(e.stack).split("\n").slice(0, 4).join(" | "));
      break;
    }
    step("clic", label);
  }
  return trace;
}

/* --- Plusieurs profils, pour couvrir tous les modes -----------------------
   LES PROFILS DOIVENT EXISTER. Quatre des six personnalités écrites ici
   n'étaient pas des personnalités : « sincere », « charismatic », « brutal »
   et « tenacious » ne figurent nulle part dans TRAIT_DATA, où la famille
   « caractere » s'appelle hardworking, charming, clever, provocative,
   principled, calculating. Une condition sur une personnalité inexistante
   n'échoue pas, elle ne correspond simplement jamais : le harnais jouait donc
   quatre carrières sur six SANS personnalité du tout, et onze événements du
   jeu — tous ceux qui demandent d'être provocateur, brillant, charmeur,
   intègre ou acharné — n'ont jamais été joués une seule fois en trois cents
   carrières. Le harnais couvrait ce qu'il croyait couvrir.

   Les six profils balaient donc les six personnalités, les six partis, les
   quatre origines et six des huit parcours. Journalisme, célébrité et
   communication étaient dans le même angle mort : les scènes qui les
   demandent ne sortaient jamais non plus. */
const CHARACTERS = [
  { name: "Test Alpha",   sex: "male",   origin: "modest",    background: "civil",      personality: "calculating", party: "socdem" },
  { name: "Test Beta",    sex: "female", origin: "dynasty",   background: "business",   personality: "principled",  party: "conservatives" },
  { name: "Test Gamma",   sex: "female", origin: "middle",    background: "academia",   personality: "clever",      party: "centrists" },
  { name: "Test Delta",   sex: "male",   origin: "bourgeois", background: "law",        personality: "provocative", party: "identitarians" },
  { name: "Test Epsilon", sex: "male",   origin: "modest",    background: "activism",   personality: "hardworking", party: "radical_left" },
  { name: "Test Zeta",    sex: "female", origin: "middle",    background: "comms",      personality: "charming",    party: "liberals" },
  { name: "Test Eta",     sex: "female", origin: "bourgeois", background: "journalism", personality: "clever",      party: "socdem" },
  { name: "Test Theta",   sex: "male",   origin: "middle",    background: "celebrity",  personality: "charming",    party: "centrists" },
];

const CAREERS = Number(process.env.PM_CAREERS || 60);
const MAX_STEPS = Number(process.env.PM_STEPS || 400);

const lines = [];
for (let n = 0; n < CAREERS; n++) {
  const character = CHARACTERS[n % CHARACTERS.length];
  lines.push("### carriere " + n + " seed=" + (1000 + n) + " " + character.party + "/" + character.background);
  try {
    lines.push(...playCareer(1000 + n, character, MAX_STEPS));
  } catch (e) {
    lines.push("BOOT ERREUR\t" + e.message);
  }
}

process.stdout.write(lines.join("\n") + "\n");

const fmt = (m) => [...m.entries()].sort().map(([k, v]) => k + "=" + v).join(" ");
console.error("COUVERTURE cartes : " + fmt(COVER.kinds));
console.error("COUVERTURE clics  : " + fmt(COVER.clicks));
