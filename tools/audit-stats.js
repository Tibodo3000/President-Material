/*
 * President Material — AUDIT DES STATISTIQUES.
 * ============================================================================
 *
 * À QUOI ÇA SERT. L'audit des choix dit si un dilemme se pose, l'audit
 * d'opinion dit si le bon camp applaudit. Ni l'un ni l'autre ne regarde la
 * FICHE : ce que les huit statistiques valent au bout du compte, d'où elles
 * viennent, et si elles veulent encore dire quelque chose à cinquante ans.
 *
 * Ce qui a rendu l'outil nécessaire : une fiche de quadragénaire montrait
 * quatre barres pleines. Le sang-froid, le réseau et la notoriété touchaient
 * le plafond vers quarante ans, et les trente années suivantes ne pouvaient
 * plus rien y changer. Rien ne le signalait — aucun test ne peut voir ça,
 * c'est une mesure, pas une erreur.
 *
 * Il mesure quatre choses, dans cet ordre :
 *
 *   1. CE QUE LE CONTENU OFFRE. Combien de points chaque statistique reçoit et
 *      perd sur l'ensemble des paquets. Le déséquilibre saute aux yeux : la
 *      notoriété est distribuée dix fois plus que le charisme, et reprise
 *      douze fois moins souvent qu'elle n'est donnée.
 *
 *   2. CE QUI EST LU CONTRE CE QUI EST PAYÉ. Une statistique sert à deux
 *      choses : entrer dans un jet, ouvrir une porte. Une statistique très
 *      payée et jamais lue est une monnaie sans marchandise ; une statistique
 *      très lue et jamais payée est un capital de naissance dont on ne peut
 *      rien faire. Le jeu a les deux, et c'est la mesure la plus utile du lot.
 *
 *   3. CE QU'UNE CARRIÈRE ENCAISSE VRAIMENT. On joue des carrières entières et
 *      l'on compte, statistique par statistique, ce que le contenu OFFRE et ce
 *      qui arrive vraiment sur la barre. Les deux chiffres ne se lisent pas de
 *      la même façon selon ce qu'on cherche :
 *        — l'écart entre les offres et l'échelle dit si le contenu paie trop.
 *          Soixante-treize points de notoriété offerts pour une échelle qui en
 *          compte vingt, c'est une monnaie émise trois fois de trop, et aucun
 *          frein ne rendra cette monnaie intéressante à dépenser ;
 *        — l'écart entre offert et encaissé, lui, est retenu par le frein
 *          (gainStat) autant que par le plafond. Avant le frein, il était
 *          intégralement du gaspillage : 64 % de la notoriété distribuée
 *          n'arrivait nulle part. Aujourd'hui c'est du ralentissement voulu, et
 *          c'est la courbe du 4 qui dit s'il est bien réglé.
 *
 *   4. LA COURBE PAR ÂGE. Où en sont les huit barres à trente-cinq ans, à
 *      quarante, à cinquante. C'est la mesure qui répond à la seule question
 *      qui compte : à quel âge la fiche cesse-t-elle de bouger ?
 *
 * CE QU'IL NE DIT PAS. Il ne dit pas si le jeu est trop facile ou trop dur :
 * pour ça, il faut regarder les sommets de carrière, et c'est tools/regression.js
 * qui les trace. Il ne juge pas non plus une scène : qu'un plateau télé paie en
 * notoriété est juste, c'est leur nombre qui ne l'est pas.
 *
 * Le pilote joue AU HASARD parmi les boutons réellement rendus. Il mesure donc
 * un plancher : un joueur qui choisit bien encaisse davantage, et sature plus
 * tôt. Les chiffres du bas sont à lire comme « même en jouant n'importe
 * comment ».
 *
 * Usage :
 *
 *     node tools/audit-stats.js                # les quatre mesures
 *     node tools/audit-stats.js --contenu      # seulement 1 et 2, sans jouer
 *     PM_CARRIERES=200 node tools/audit-stats.js   # plus de carrières
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const args = process.argv.slice(2);
const CONTENU_SEUL = args.includes("--contenu");
const ROOT = args.find((a) => !a.startsWith("--")) || path.join(__dirname, "..");
const CARRIERES = Number(process.env.PM_CARRIERES || 60);
const PAS_MAX = Number(process.env.PM_PAS || 600);

const STATS = ["charisme", "eloquence", "energie", "sangfroid",
               "reseau", "notoriete", "reputation", "credibilite"];

/* L'ordre de chargement, lu dans game.html comme partout ailleurs. */
function ordreDeChargement() {
  const html = fs.readFileSync(path.join(ROOT, "game.html"), "utf8");
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
}

/* ==========================================================================
   1 ET 2 — CE QUE LE CONTENU OFFRE, ET CE QU'IL LIT
   ==========================================================================
   Les données suffisent : on ne charge que les paquets, sans moteur ni DOM.
   ========================================================================== */

const ctxData = vm.createContext({
  console, window: {}, document: { addEventListener() {} },
  localStorage: { getItem: () => null, setItem() {} }, location: { pathname: "/" },
});
for (const f of ordreDeChargement().filter((x) => /\.data\.js$|\/(script|data|balance)\.js$/.test(x))) {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctxData, { filename: f }); }
  catch (e) { console.log("CHARGEMENT " + f + " : " + e.message); process.exit(1); }
}
const DECKS = vm.runInContext("EVENT_DATA", ctxData);

const offre = {};
STATS.forEach((s) => (offre[s] = { plus: 0, nPlus: 0, moins: 0, nMoins: 0, gros: 0 }));
const lecture = {};
STATS.forEach((s) => (lecture[s] = { jet: 0, appoint: 0, porte: 0 }));

function compterEffets(e) {
  if (!e) return;
  for (const s of STATS) {
    const v = e[s];
    if (!v) continue;
    if (v > 0) { offre[s].plus += v; offre[s].nPlus++; if (v >= 3) offre[s].gros++; }
    else { offre[s].moins += v; offre[s].nMoins++; }
  }
}

function compterPortes(w) {
  if (!w || !w.stat) return;
  for (const [k, v] of Object.entries(w.stat)) {
    if (!lecture[k]) continue;
    if (v.min !== undefined || v.max !== undefined) lecture[k].porte++;
  }
}

for (const paquet of Object.values(DECKS)) {
  for (const ev of paquet) {
    compterPortes(ev.when);
    for (const c of ev.choices || []) {
      compterPortes(c.when);
      compterEffets(c.effects);
      for (const b of ["success", "failure", "triumph", "debacle"]) {
        if (c[b]) compterEffets(c[b].effects);
      }
      if (!c.roll) continue;
      if (c.roll.stat && lecture[c.roll.stat]) lecture[c.roll.stat].jet++;
      for (const k of Object.keys(c.roll.plus || {})) if (lecture[k]) lecture[k].appoint++;
    }
  }
}

const col = (v, n) => String(v).padStart(n);

console.log("1. CE QUE LE CONTENU OFFRE");
console.log("   statistique   donnés  versements  repris  reprises   net   dont >= 3");
for (const s of STATS) {
  const o = offre[s];
  console.log("   " + s.padEnd(13) + col(o.plus, 6) + col(o.nPlus, 12) + col(o.moins, 8) +
    col(o.nMoins, 10) + col(o.plus + o.moins, 6) + col(o.gros, 12));
}

console.log("\n2. CE QUI EST LU, CONTRE CE QUI EST PAYÉ");
console.log("   Un jet principal pèse 1, un appoint pèse moins ; une porte s'ouvre ou reste");
console.log("   fermée. Une statistique payée sans être lue ne sert qu'à remplir une barre.");
console.log("\n   statistique   jets  appoints  portes  |  points donnés  points par lecture");
for (const s of STATS) {
  const l = lecture[s];
  const lu = l.jet + l.appoint + l.porte;
  const ratio = lu ? (offre[s].plus / lu).toFixed(1) : "—";
  console.log("   " + s.padEnd(13) + col(l.jet, 5) + col(l.appoint, 10) + col(l.porte, 8) +
    "  |" + col(offre[s].plus, 15) + col(ratio, 20));
}

if (CONTENU_SEUL) process.exit(0);

/* ==========================================================================
   3 ET 4 — CE QU'UNE CARRIÈRE ENCAISSE, ET QUAND LA FICHE CESSE DE BOUGER
   ==========================================================================
   Il faut jouer pour le savoir : on charge le jeu entier dans un vm muni d'un
   faux DOM et d'un Math.random seedé, et l'on clique sur les boutons
   RÉELLEMENT RENDUS. Le faux DOM est celui de tools/regression.js, réduit à ce
   dont l'audit a besoin.
   ========================================================================== */

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function element(tag) {
  const el = {
    tagName: tag || "div", _attrs: {}, innerHTML: "", textContent: "", hidden: false,
    dataset: {}, style: { width: "", setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute(k, v) { el._attrs[k] = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(el._attrs, k) ? el._attrs[k] : null; },
    hasAttribute(k) { return Object.prototype.hasOwnProperty.call(el._attrs, k); },
    removeAttribute(k) { delete el._attrs[k]; },
    appendChild() {}, addEventListener() {}, closest() { return el; },
    querySelector() { return element("div"); }, querySelectorAll() { return []; },
  };
  let parent = null;
  Object.defineProperty(el, "parentElement", {
    get() { if (!parent) { parent = element("div"); parent.parentElement = parent; } return parent; },
    set(v) { parent = v; }, configurable: true,
  });
  return el;
}

function demarrer(seed, personnage) {
  const parId = new Map();
  const pretsDom = [];
  const document = {
    readyState: "loading", title: "", body: element("body"), documentElement: element("html"),
    getElementById(id) { if (!parId.has(id)) parId.set(id, element("div")); return parId.get(id); },
    querySelector() { return element("div"); }, querySelectorAll() { return []; },
    createElement(t) { return element(t); },
    addEventListener(t, fn) { if (t === "DOMContentLoaded") pretsDom.push(fn); },
    dispatchEvent() { return true; },
  };
  const stock = new Map();
  stock.set("pm-character", JSON.stringify(personnage));
  stock.set("pm-lang", "fr");

  const bac = {
    document,
    localStorage: {
      getItem: (k) => (stock.has(k) ? stock.get(k) : null),
      setItem: (k, v) => stock.set(k, String(v)), removeItem: (k) => stock.delete(k),
    },
    console: { log() {}, warn() {}, error() {}, info() {} },
    navigator: { language: "fr-FR" }, location: { replace() {}, href: "" },
    CustomEvent: function (type, init) { return { type, detail: init && init.detail }; },
    Math: Object.create(Math),
    JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error, Map, Set,
    parseInt, parseFloat, isNaN, isFinite,
  };
  bac.window = bac; bac.globalThis = bac; bac.window.confirm = () => true;
  bac.Math.random = mulberry32(seed);

  const ctx = vm.createContext(bac);
  for (const rel of ordreDeChargement()) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx, { filename: rel });
  }
  document.readyState = "complete";
  pretsDom.forEach((fn) => fn());

  /* ON COMPTE À LA SOURCE. Tout ce qui touche une statistique passe par l'une
     de deux portes : gainStat() pour ce qui se construit — les scènes, les
     soirées électorales, les primaires — et bump() pour le reste, l'énergie et
     les dérives. On enveloppe les deux pour relever ce qui était ANNONCÉ et ce
     qui est réellement ARRIVÉ ; leur écart est ce qui n'a pas été encaissé,
     que ce soit par le frein ou par le plafond.

     Le drapeau évite de compter deux fois : gainStat appelle bump pour chaque
     point qui tombe pour de bon. */
  vm.runInContext(`
    var __recu = {}, __vide = {}, __dansGain = false;
    var __bumpOrigine = bump;
    bump = function (state, stat, delta) {
      var avant = state.stats[stat];
      __bumpOrigine(state, stat, delta);
      if (delta > 0 && !__dansGain) {
        __recu[stat] = (__recu[stat] || 0) + delta;
        __vide[stat] = (__vide[stat] || 0) + (delta - (state.stats[stat] - avant));
      }
    };
    var __gainOrigine = gainStat;
    gainStat = function (state, stat, delta) {
      if (!(delta > 0)) { __gainOrigine(state, stat, delta); return; }
      var avant = state.stats[stat];
      __dansGain = true;
      try { __gainOrigine(state, stat, delta); } finally { __dansGain = false; }
      __recu[stat] = (__recu[stat] || 0) + delta;
      __vide[stat] = (__vide[stat] || 0) + (delta - (state.stats[stat] - avant));
    };
  `, ctx);

  return { ctx, bac, parId };
}

function boutons(html) {
  const out = [];
  for (const m of html.matchAll(/<button\b([^>]*)>/g)) {
    const brut = m[1];
    if (/\bdisabled\b/.test(brut)) continue;
    const attrs = {};
    for (const a of brut.matchAll(/([a-zA-Z-]+)(?:="([^"]*)")?/g)) {
      if (a[1] === "class" || a[1] === "type") continue;
      attrs[a[1]] = a[2] === undefined ? "" : a[2];
    }
    if (Object.keys(attrs).some((k) => k.startsWith("data-"))) out.push(attrs);
  }
  return out;
}

function fauxBouton(attrs) {
  const el = element("button");
  el._attrs = { ...attrs };
  el.closest = (sel) => (sel === "button" ? el : null);
  return el;
}

/* Les huit profils de tools/regression.js : six personnalités, six partis,
   quatre origines. Un profil unique fausserait la mesure — un ancien
   journaliste part avec quatre points de notoriété qu'un militant n'a pas. */
const PROFILS = [
  { name: "Alpha", sex: "male", origin: "modest", background: "civil", personality: "calculating", party: "socdem" },
  { name: "Beta", sex: "female", origin: "dynasty", background: "business", personality: "principled", party: "conservatives" },
  { name: "Gamma", sex: "female", origin: "middle", background: "academia", personality: "clever", party: "centrists" },
  { name: "Delta", sex: "male", origin: "bourgeois", background: "law", personality: "provocative", party: "identitarians" },
  { name: "Epsilon", sex: "male", origin: "modest", background: "activism", personality: "hardworking", party: "radical_left" },
  { name: "Zeta", sex: "female", origin: "middle", background: "comms", personality: "charming", party: "liberals" },
  { name: "Eta", sex: "female", origin: "bourgeois", background: "journalism", personality: "clever", party: "socdem" },
  { name: "Theta", sex: "male", origin: "middle", background: "celebrity", personality: "charming", party: "centrists" },
];

const TRANCHES = [35, 40, 45, 50, 55, 60, 65, 70];
const releve = {};
TRANCHES.forEach((t) => { releve[t] = { n: 0, pleines: 0 }; STATS.forEach((s) => (releve[t][s] = [])); });
const recu = {}, vide = {};
STATS.forEach((s) => { recu[s] = 0; vide[s] = 0; });
let jouees = 0, ageFin = [];

function jouer(seed, personnage) {
  const { ctx, bac, parId } = demarrer(seed, personnage);
  const tire = mulberry32(seed ^ 0x5f3759df);
  const html = (id) => (parId.has(id) ? String(parId.get(id).innerHTML) : "");
  const vues = new Set();

  for (let i = 0; i < PAS_MAX; i++) {
    const g = vm.runInContext("game", ctx);

    if (g && g.stats) {
      let seuil = null;
      for (const t of TRANCHES) if (g.age >= t) seuil = t;
      if (seuil !== null && !vues.has(seuil)) {
        vues.add(seuil);
        releve[seuil].n++;
        STATS.forEach((s) => {
          releve[seuil][s].push(g.stats[s]);
          if (g.stats[s] >= 20) releve[seuil].pleines++;
        });
      }
    }

    if (g && g.ended && (!g.card || g.card.kind === "end")) break;
    const dispo = boutons(html("event-area")).filter((b) => !("data-restart" in b));
    if (!dispo.length) break;
    try { bac.handleClick({ target: fauxBouton(dispo[Math.floor(tire() * dispo.length)]) }); }
    catch (e) { break; }
  }

  const g = vm.runInContext("game", ctx);
  const r = vm.runInContext("__recu", ctx), v = vm.runInContext("__vide", ctx);
  STATS.forEach((s) => { recu[s] += r[s] || 0; vide[s] += v[s] || 0; });
  if (g) ageFin.push(g.age);
  jouees++;
}

for (let n = 0; n < CARRIERES; n++) {
  try { jouer(1000 + n, PROFILS[n % PROFILS.length]); } catch (e) { /* une carrière perdue ne fausse rien */ }
}

const moyenne = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const mediane = (a) => {
  if (!a.length) return NaN;
  const t = [...a].sort((x, y) => x - y);
  return t[Math.floor(t.length / 2)];
};

console.log("\n3. CE QU'UNE CARRIÈRE ENCAISSE  (" + jouees + " carrières jouées au hasard, " +
  "fin à " + moyenne(ageFin).toFixed(0) + " ans en moyenne)");
console.log("   « offerts » est ce que le contenu annonce sur une carrière ; « encaissés »");
console.log("   ce qui arrive sur la barre. L'écart est retenu par le frein (gainStat) et");
console.log("   par le plafond. Comparer d'abord les offres à l'échelle, qui compte 20 :");
console.log("   au-delà de deux fois, la statistique est une monnaie émise en trop.");
console.log("\n   statistique   offerts/carrière   encaissés   retenus   × l'échelle");
for (const s of STATS) {
  const offert = recu[s] / jouees, retenu = vide[s] / jouees;
  console.log("   " + s.padEnd(13) + col(offert.toFixed(1), 13) + col((offert - retenu).toFixed(1), 12) +
    col(retenu.toFixed(1), 10) + col((offert / 20).toFixed(1), 12));
}

console.log("\n4. LA COURBE PAR ÂGE  (médiane des huit barres, et combien sont pleines)");
console.log("   âge    n  " + STATS.map((s) => s.slice(0, 6).padStart(7)).join("") + "    somme   pleines");
for (const t of TRANCHES) {
  const r = releve[t];
  if (!r.n) continue;
  const med = STATS.map((s) => mediane(r[s]));
  console.log("   " + String(t).padEnd(6) + col(r.n, 3) + "  " + med.map((m) => col(m, 7)).join("") +
    col(med.reduce((x, y) => x + y, 0), 9) + col((r.pleines / r.n).toFixed(2), 10));
}
