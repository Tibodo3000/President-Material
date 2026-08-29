/* President Material — éditeur d'événements : logique.
   ==========================================================================
   Organisation (une IIFE, aucune dépendance, tout tient en file://) :
     0. Garde-fou             10. Widgets de valeur
     1. Vocabulaire           11. Widgets de map (nummap/flagmap/statmap)
     2. Specs & aide          12. Éditeurs when / effects / roll / choix
     3. Helpers DOM           13. Formulaire complet
     4. Toast                 14. Validation
     5. Brouillons (storage)  15. Aperçu
     6. État & historique     16. Liste
     7. Dirty / statut        17. Actions
     8. Sélection             18. Câblage & init
   Le modèle édité (state.model) est la seule source de vérité ; les widgets le
   mutent, puis on synchronise (sync) ou on reconstruit (buildForm). L'historique
   garde des instantanés JSON pour l'annulation.
   ========================================================================== */
(function () {
"use strict";
const byId = (id) => document.getElementById(id);

/* ===== 0. Garde-fou ===================================================== */
if (typeof EVENT_DATA === "undefined" || typeof PARTIES === "undefined" || typeof TRAIT_DATA === "undefined") {
  document.body.innerHTML =
    '<div class="fatal"><h1>★ Données du jeu non chargées</h1>' +
    "<p>L'éditeur charge les vraies données depuis <code>../js/</code>. Pour qu'un simple " +
    "double-clic fonctionne, ce fichier doit rester dans <code>tools/</code>, à côté du dossier " +
    "<code>js/</code> du dépôt.</p><p class=\"muted\">Vérifiez l'emplacement du fichier, puis rechargez.</p></div>";
  throw new Error("President Material editor: game data not loaded");
}

/* ===== 1. Vocabulaire (dérivé des données réelles) ====================== */
const DECKS = {
  events: EVENT_DATA.events, campaign: EVENT_DATA.campaign, runoff: EVENT_DATA.runoff,
  nomination: EVENT_DATA.nomination, support: EVENT_DATA.support, aside: EVENT_DATA.aside, races: EVENT_DATA.races,
};
const THEME_FILES = {debuts:EV_debuts,medias:EV_medias,argent:EV_argent,appareil:EV_appareil,chaines:EV_chaines,
  rivaux:EV_rivaux,vie_privee:EV_vie_privee,partis:EV_partis,caractere:EV_caractere,institutions:EV_institutions,
  assemblee:EV_assemblee,grandes_decisions:EV_grandes_decisions,divers:EV_divers};
const idTheme = {};
for (const [t, arr] of Object.entries(THEME_FILES)) arr.forEach((e) => { idTheme[e.id] = t; });

const trFR = translations.fr;
const PARTY_KEYS = Object.keys(PARTIES);
const STAT_KEYS = Object.keys(BASE_STATS);
const TRAIT_LIST = Object.keys(TRAIT_DATA);
const TRAIT_IDS = new Set(TRAIT_LIST);
const ORIGINS = Object.keys(STAT_MODIFIERS.origin);
const BACKGROUNDS = Object.keys(STAT_MODIFIERS.background);
const PERSONALITIES = Object.entries(TRAIT_DATA).filter(([, d]) => d.family === "caractere").map(([id]) => id);
const POSITIONS = Object.keys(trFR).filter((k) => k.startsWith("pos_") && !k.endsWith("_low")).map((k) => k.slice(4));
const FLAGS = Object.keys(trFR).filter((k) => k.startsWith("flag_")).map((k) => k.slice(5));
const ELECTION_IDS = Object.keys(trFR).filter((k) => k.startsWith("elec_") && !k.endsWith("_low")).map((k) => k.slice(5));
const END_TYPES = ["victory", "retire", "withdrawal", "death", "conviction"];
const CAST_OPTIONS = ["opponent", "leader", "ruling", "neighbour", "camp", "camp_senior", "minor", "eliminated"];
const PLUS_KEYS = [...STAT_KEYS, "popularity", "standing", "money"];
const LANDSCAPE_TARGETS = ["self", "scene", "ruling", "ally", ...PARTY_KEYS];
/* "chef" n'est plus une fonction : la direction du parti se donne avec l'effet
   "lead", et se lit dans une condition avec "partyLead" (ou avec "chef" dans
   une liste de positions, qui veut dire « dirige son parti »). */
const OFFICE_LIST = [...POSITIONS.filter((p) => p !== "chef"), "none"];
const ALLIANCE_TARGETS = ["self", "scene", "ruling", "ally", ...PARTY_KEYS, "null"];
const EFFECT_KEYS = new Set([...STAT_KEYS, "popularity", "standing", "money", "poll", "score",
  "flags", "trait", "strike", "untrait", "chain", "landscape", "office", "lead", "join", "alliance",
  "approval", "dissolve", "end", "axis", "appeal"]);
const WHEN_KEYS = new Set(["party","position","origin","background","personality","minAge","maxAge","minTurn","maxTurn",
  "minPopularity","maxPopularity","minStanding","maxStanding","minMoney","maxMoney","stat","flag","trait","anyTrait",
  "notTrait","ruling","allied","minShare","rulingClose","legal","comms",
  // L'exécutif, l'Assemblée et la direction du parti. Elles existaient dans le
  // moteur et manquaient ici : l'éditeur signalait donc « condition inconnue »
  // sur des conditions parfaitement valides.
  "partyLead","majority","inCoalition","firstGroup","pivot","minSeats","maxSeats","outshinePresident","foeIncumbent","foeParty","foeFar",
  "minApproval","maxApproval","dissolved","belowPeak","season"]);
const ALL_IDS = {};
for (const arr of Object.values(DECKS)) arr.forEach((e) => { ALL_IDS[e.id] = (ALL_IDS[e.id] || 0) + 1; });

/* ===== 2. Spécifications de widgets & textes d'aide ===================== */
const WHEN_SPEC = {
  party:{t:"multi",v:PARTY_KEYS}, position:{t:"multi",v:POSITIONS}, origin:{t:"multi",v:ORIGINS},
  background:{t:"multi",v:BACKGROUNDS}, personality:{t:"multi",v:PERSONALITIES},
  trait:{t:"multi",v:TRAIT_LIST}, anyTrait:{t:"multi",v:TRAIT_LIST}, notTrait:{t:"multi",v:TRAIT_LIST},
  minAge:{t:"num"},maxAge:{t:"num"},minTurn:{t:"num"},maxTurn:{t:"num"},minPopularity:{t:"num"},maxPopularity:{t:"num"},
  minStanding:{t:"num"},maxStanding:{t:"num"},minMoney:{t:"num"},maxMoney:{t:"num"},minShare:{t:"num"},legal:{t:"num"},
  comms:{t:"num"}, ruling:{t:"bool"},allied:{t:"bool"},rulingClose:{t:"bool"}, stat:{t:"statmap"}, flag:{t:"flagmap"},
  partyLead:{t:"bool"}, majority:{t:"multi",v:["absolue","relative","aucune"]},
  inCoalition:{t:"bool"}, firstGroup:{t:"bool"}, pivot:{t:"bool"}, outshinePresident:{t:"bool"},
  foeIncumbent:{t:"bool"}, foeFar:{t:"bool"}, foeParty:{t:"multi",v:PARTY_KEYS},
  minSeats:{t:"num"}, maxSeats:{t:"num"}, minApproval:{t:"num"}, maxApproval:{t:"num"},
  dissolved:{t:"bool"}, belowPeak:{t:"bool"},
  season:{t:"multi",v:["printemps","ete","automne","hiver"]},
};
const EFFECT_SPEC = {};
STAT_KEYS.forEach((s) => EFFECT_SPEC[s] = {t:"num"});
["popularity","standing","money","poll","score","approval"].forEach((k) => EFFECT_SPEC[k] = {t:"num"});
EFFECT_SPEC.dissolve = {t:"bool"}; EFFECT_SPEC.lead = {t:"bool"};
EFFECT_SPEC.trait = EFFECT_SPEC.strike = EFFECT_SPEC.untrait = {t:"trait"};
EFFECT_SPEC.chain = {t:"idlist"}; EFFECT_SPEC.flags = {t:"flagmap"};
EFFECT_SPEC.landscape = {t:"nummap",v:LANDSCAPE_TARGETS};
EFFECT_SPEC.office = {t:"select",v:OFFICE_LIST}; EFFECT_SPEC.join = {t:"select",v:LANDSCAPE_TARGETS};
EFFECT_SPEC.alliance = {t:"select",v:ALLIANCE_TARGETS}; EFFECT_SPEC.end = {t:"select",v:END_TYPES};
EFFECT_SPEC.axis = {t:"axis"};
EFFECT_SPEC.appeal = {t:"nummap",v:["self","others","scene","ruling","ally",...PARTY_KEYS]};

const HELP = {
  id:"Identifiant unique (lettres, chiffres, _). Clé pour les chaînes et le suivi « déjà vu ».",
  weight:"Poids de tirage (défaut 2). Plus haut = sort plus souvent. 0 = réservé aux chaînes, jamais au hasard.",
  repeatable:"Peut revenir dans une partie. Réservé aux « temps morts » sans conséquence durable.",
  once:"Ne se joue qu'une fois par partie — déjà le comportement par défaut de tout événement identifié.",
  cast:"Qui est {rival} : opponent (autre parti), leader (chef adverse), ruling (chef du camp au pouvoir), neighbour (chef du camp le plus proche), camp / camp_senior (votre parti), minor / eliminated (présidentielle).",
  tag:"Étiquette de catégorie en tête de carte. FR et EN obligatoires.",
  text:"La situation présentée au joueur. Marques : {rival}, {rival_party}, {party}, accords {il}/{le}/{he}…",
  delay:"Cible de chaîne : nombre de tours, soit de trimestres (min→max), avant que la suite ne tombe.",
  moment:"Decks de campagne : à quel point de la fin la scène peut apparaître (1 = dernier temps). Paire = bornée des deux côtés.",
  required:"Decks de campagne : scène qui a toujours lieu (le grand débat). Une ou deux au maximum.",
  race:"Deck races : limite la scène à certains scrutins.",
  when:"Conditions d'apparition : toutes doivent être remplies.",
  whenChoice:"Rend ce choix conditionnel : il n'apparaît que si ces conditions tiennent (losange).",
  label:"Libellé du bouton de choix. FR et EN obligatoires.",
  effects:"Ce que le choix applique. Tout est optionnel.",
  result:"Texte affiché après le choix. FR et EN obligatoires.",
  base:"Seuil à battre (statistique + dé).", stat:"Statistique principale du jet (poids 1).",
  dice:"Amplitude du hasard (défaut 6).", plus:"Contributions secondaires : autres stats, popularité, cote, argent.",
  bonus:"Bonus conditionnels ajoutés au score.", chance:"Probabilité fixe de réussite (0 à 1).",
  chanceBonus:"Ajustements conditionnels de la probabilité.", effectsIf:"Effets appliqués seulement dans certaines situations.",
};
const WHEN_HELP = {
  party:"Le joueur est dans l'un de ces partis.", position:"Fonction actuelle du joueur.",
  origin:"Origine sociale.", background:"Parcours.", personality:"Caractère de création.",
  trait:"Porte TOUS ces traits.", anyTrait:"Porte AU MOINS UN de ces traits.", notTrait:"Ne porte AUCUN de ces traits.",
  stat:"Bornes sur une statistique (échelle 0-20).", flag:"État d'un drapeau.", ruling:"Votre camp gouverne.",
  allied:"Vous avez un pacte.", minShare:"Poids de votre camp (points).", rulingClose:"Un camp voisin gouverne (pas le vôtre).",
  legal:"Niveau min. de conseil juridique.", comms:"Niveau min. de communication.",
  minMoney:"Fortune min. (€).", maxMoney:"Fortune max. (€).", minAge:"Âge min.", maxAge:"Âge max.",
  minStanding:"Cote au parti min.", maxStanding:"Cote au parti max.", minPopularity:"Popularité min.", maxPopularity:"Popularité max.",
  minTurn:"Tour min. (4 tours = 1 an).", maxTurn:"Tour max. (4 tours = 1 an).",
  partyLead:"Le joueur dirige son parti (cumulable avec un mandat).",
  majority:"État de l'Assemblée : absolue / relative / aucune.",
  inCoalition:"Votre camp vote les textes du gouvernement.",
  firstGroup:"Votre parti est le premier groupe de l'Assemblée.",
  pivot:"Le gouvernement n'a pas la majorité et l'aurait avec vous.",
  outshinePresident:"Vous êtes plus populaire que le président, et il est de votre camp.",
  foeIncumbent:"Second tour : l'adversaire porte un bilan (Élysée ou Matignon).",
  foeParty:"Second tour : le camp de l'adversaire.",
  foeFar:"Second tour : son camp est loin du vôtre (au-delà du voisinage).",
  minSeats:"Sièges min. de votre parti (sur 577).", maxSeats:"Sièges max. de votre parti (sur 577).",
  minApproval:"Cote du gouvernement min.", maxApproval:"Cote du gouvernement max.",
  dissolved:"Législatives anticipées après dissolution.",
  belowPeak:"La fonction actuelle est sous le sommet atteint.",
  season:"La saison du tour. Pour ce qui n'arrive qu'à un moment de l'année : une sécheresse, une rentrée.",
};
const FX_HELP = {
  trait:"Ajoute un trait (applique ses points).", strike:"Un écart de plus vers une marque à récidive.",
  untrait:"Retire un trait.", chain:"Programme une ou plusieurs suites.", flags:"Pose ou retire des drapeaux.",
  landscape:"Déplace les intentions de vote entre partis.", office:"Donne une fonction sans élection (none = quitte).",
  join:"Change le joueur de parti.", alliance:"Signe (cible) ou rompt (null) un pacte.", end:"Termine la partie.",
  popularity:"Jauge de popularité (0-100).", standing:"Cote au parti (0-100).", money:"Argent (€).",
  poll:"Sondage présidentiel.", score:"Avantage de campagne locale.",
  axis:"Où se situe le choix (−100 à +100). Avec « popularity », le moteur répartit la réaction entre les six électorats.",
  appeal:"Réaction écrite à la main, électorat par électorat. Cibles : self, others, scene (le camp de la figure en scène), ruling, ally, ou un parti.",
  approval:"Cote du gouvernement (0-100).", dissolve:"Le président dissout : législatives au tour suivant.",
  lead:"Donne (true) ou retire (false) la direction du parti. Le mandat ne bouge pas.",
};

/* ===== 3. Helpers DOM =================================================== */
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in (attrs || {})) {
    const val = attrs[k];
    if (k === "class") e.className = val;
    else if (k[0] === "o" && k[1] === "n") e[k] = val;
    else if (val === true) e.setAttribute(k, "");
    else if (val != null && val !== false) e.setAttribute(k, val);
  }
  for (const kid of kids) { if (kid == null || kid === false) continue; e.append(kid.nodeType ? kid : document.createTextNode(kid)); }
  return e;
}
const opt = (v, label, sel) => h("option", { value: v, selected: sel ? "" : false }, label == null ? v : label);
const clone = (o) => JSON.parse(JSON.stringify(o));
const snapshot = () => (state.model ? JSON.stringify(state.model) : "");
function helpIcon(key) { return HELP[key] ? h("i", { class: "help", title: HELP[key] }, "?") : null; }
function lab(text, helpKey) { return h("span", { class: "flabel" }, text, helpIcon(helpKey)); }
function frow(text, helpKey, ...widgets) { return h("div", { class: "frow" }, lab(text, helpKey), ...widgets); }

/* ===== 4. Toast & bandeau ============================================== */
let toastTimer = null;
function toast(msg, kind) {
  const t = byId("toast"); t.textContent = msg; t.className = "toast show" + (kind ? " " + kind : "");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.className = "toast"; }, 1800);
}
function banner(msg, kind) {
  const b = byId("banner"); b.className = "banner " + (kind || "info");
  b.innerHTML = ""; b.append(h("span", {}, msg), h("span", { class: "sp" }),
    h("button", { class: "mini", onclick: () => { b.innerHTML = ""; b.className = "banner"; } }, "×"));
}

/* ===== 5. Brouillons (localStorage) ==================================== */
const DRAFT_STORE = "pm-event-editor-drafts";
let drafts = load();
function load() { try { return JSON.parse(localStorage.getItem(DRAFT_STORE)) || {}; } catch (e) { return {}; } }
function persist() { try { localStorage.setItem(DRAFT_STORE, JSON.stringify(drafts)); } catch (e) { toast("Stockage indisponible", "err"); } }
const dkey = (deck, id) => deck + "::" + id;
const currentDraftKey = () => state.model ? dkey(state.deck, state.model.id || "") : null;
const hasDraft = () => { const k = currentDraftKey(); return !!(k && drafts[k]); };

/* ===== 6. État & historique =========================================== */
const state = {
  deck: "events", theme: "*", search: "",
  selectedId: null, original: null, model: null, loadedFrom: null,
  baseline: "", history: [], hi: -1, dirty: false,
};
function resetHistory() { state.history = [snapshot()]; state.hi = 0; }
function pushHistory() {
  const s = snapshot();
  if (state.history[state.hi] === s) { updateButtons(); return; }
  state.history = state.history.slice(0, state.hi + 1);
  state.history.push(s);
  if (state.history.length > 120) state.history.shift();
  state.hi = state.history.length - 1;
  updateButtons();
}
function undo() { if (state.hi <= 0) return; state.hi--; state.model = JSON.parse(state.history[state.hi]); buildForm(); }
function redo() { if (state.hi >= state.history.length - 1) return; state.hi++; state.model = JSON.parse(state.history[state.hi]); buildForm(); }

/* Points d'entrée d'édition : sync (léger) et commit (avec instantané). */
function commitVal() { pushHistory(); sync(); }
const struct = (fn) => () => { fn(); pushHistory(); buildForm(); };

/* ===== 7. Dirty, statut, boutons ====================================== */
function sync() {
  const has = !!state.model;
  byId("jsonOut").textContent = has ? JSON.stringify(state.model, null, 2) : "";
  byId("target").innerHTML = has ? "Fichier cible : <code>" + targetFile() + "</code> · l'éditeur n'écrit pas les fichiers." : "";
  state.dirty = has && snapshot() !== state.baseline;
  renderStatus(); renderValidation(state.model); renderPreview(state.model); updateButtons();
}
function renderStatus() {
  const el = byId("status");
  if (!state.model) { el.innerHTML = ""; return; }
  const pill = state.dirty ? '<span class="pill dirty">● non enregistré</span>'
    : hasDraft() ? '<span class="pill saved">brouillon à jour</span>'
    : '<span class="pill clean">' + (state.loadedFrom === "new" ? "nouveau" : "inchangé") + "</span>";
  el.innerHTML = pill;
}
function updateButtons() {
  const m = !!state.model;
  byId("btnUndo").disabled = !(m && state.hi > 0);
  byId("btnRedo").disabled = !(m && state.hi < state.history.length - 1);
  ["btnSave", "btnRevert", "btnDup", "btnValidate", "btnCopy"].forEach((b) => byId(b).disabled = !m);
  byId("btnLoadDraft").disabled = !hasDraft();
  byId("btnDelDraft").disabled = !hasDraft();
}
function targetFile() {
  if (state.deck === "events") { const t = state.model && idTheme[state.model.id]; return t ? "js/events/" + t + ".data.js" : "js/events/<thème>.data.js"; }
  return "js/events/" + state.deck + ".data.js";
}

/* ===== 8. Sélection =================================================== */
const template = () => ({ id: "nouvel_evenement", tag: { fr: "", en: "" }, text: { fr: "", en: "" },
  choices: [{ label: { fr: "", en: "" }, effects: {}, result: { fr: "", en: "" } }] });
function selectEvent(id) {
  state.selectedId = id;
  const inData = DECKS[state.deck].find((e) => e.id === id);
  state.original = inData ? clone(inData) : null;
  const k = dkey(state.deck, id);
  if (drafts[k]) { state.model = clone(drafts[k].event); state.loadedFrom = "draft"; }
  else { state.model = inData ? clone(inData) : template(); state.loadedFrom = inData ? "data" : "new"; }
  state.baseline = snapshot(); resetHistory(); renderList(); buildForm(); byId("banner").innerHTML = "";
}

/* ===== 9. (validation en 14, aperçu en 15) ============================ */

/* ===== 10. Widgets de valeur ========================================== */
function txt(obj, key, o) {
  o = o || {};
  const e = o.area ? h("textarea", { rows: o.area === true ? 2 : o.area, class: "fin" }) : h("input", { type: "text", class: "fin" });
  e.value = obj[key] == null ? "" : obj[key];
  e.oninput = () => { if (e.value === "" && !o.keep) delete obj[key]; else obj[key] = e.value; sync(); };
  e.onchange = pushHistory;
  return e;
}
function numw(obj, key) {
  const e = h("input", { type: "number", class: "fin num", step: "any" });
  e.value = obj[key] == null ? "" : obj[key];
  e.oninput = () => { if (e.value === "") delete obj[key]; else obj[key] = Number(e.value); sync(); };
  e.onchange = pushHistory;
  return e;
}
function boolw(obj, key) {
  const s = h("select", { class: "fin num" }, opt("true"), opt("false"));
  s.value = String(!!obj[key]); s.onchange = () => { obj[key] = (s.value === "true"); commitVal(); };
  return s;
}
function selectw(obj, key, vocab, o) {
  o = o || {};
  const s = h("select", { class: "fin" });
  if (o.empty) s.appendChild(opt("", "— aucun —"));
  vocab.forEach((v) => s.appendChild(opt(v)));
  s.value = obj[key] == null ? "" : String(obj[key]);
  s.onchange = () => { const v = s.value; if (v === "null") obj[key] = null; else if (v === "") delete obj[key]; else obj[key] = v; commitVal(); };
  return s;
}
function multiw(owner, key, vocab) {
  const s = h("select", { multiple: true, class: "fmulti", size: Math.min(7, Math.max(3, vocab.length)) });
  vocab.forEach((v) => s.appendChild(opt(v, v, (owner[key] || []).includes(v))));
  s.onchange = () => { const vals = [...s.selectedOptions].map((x) => x.value); if (vals.length) owner[key] = vals; else delete owner[key]; commitVal(); };
  return s;
}
function biText(obj, o) {
  if (typeof obj.fr !== "string") obj.fr = ""; if (typeof obj.en !== "string") obj.en = "";
  return h("div", { class: "bitext" },
    h("div", { class: "bt" }, h("span", { class: "lang" }, "FR"), txt(obj, "fr", { area: o && o.area, keep: true })),
    h("div", { class: "bt" }, h("span", { class: "lang" }, "EN"), txt(obj, "en", { area: o && o.area, keep: true })));
}
function idlistw(fx, key) {
  const cur = fx[key];
  const e = h("input", { type: "text", class: "fin", list: "allIds", placeholder: "id, id, …" });
  e.value = Array.isArray(cur) ? cur.join(", ") : (cur || "");
  e.oninput = () => { const ids = e.value.split(/[,\s]+/).filter(Boolean); fx[key] = ids.length <= 1 ? (ids[0] || "") : ids; sync(); };
  e.onchange = pushHistory;
  return e;
}

/* ===== 11. Widgets de map (clé→valeur) ================================ */
function keySel(obj, oldKey, vocab, after) {
  const s = h("select", {}, ...vocab.filter((v) => v === oldKey || !(v in obj)).map((v) => opt(v, v, v === oldKey)));
  s.onchange = () => { const val = obj[oldKey]; delete obj[oldKey]; obj[s.value] = val; after(); };
  return s;
}
function addDrop(label, avail, onPick) {
  const s = h("select", { class: "fadd" }, opt("", label), ...avail.map((v) => opt(v)));
  s.onchange = () => { if (s.value) onPick(s.value); };
  return s;
}
function nummap(owner, key, vocab) {
  const obj = owner[key] || {}; const box = h("div", { class: "sub" });
  Object.keys(obj).forEach((k) => {
    const val = h("input", { type: "number", class: "num", step: "any" }); val.value = obj[k];
    val.oninput = () => { obj[k] = Number(val.value); sync(); }; val.onchange = pushHistory;
    box.appendChild(h("div", { class: "krow" }, keySel(obj, k, vocab, struct(() => {})), val,
      h("button", { class: "mini rm", onclick: struct(() => { delete obj[k]; if (!Object.keys(obj).length) delete owner[key]; }) }, "×")));
  });
  const avail = vocab.filter((v) => !(v in obj));
  if (avail.length) box.appendChild(addDrop("+ clé…", avail, (v) => struct(() => { (owner[key] || (owner[key] = {}))[v] = 0; })()));
  return box;
}
/* OÙ SE SITUE UN CHOIX.
   "axis" prend deux formes : une position chiffrée sur tout ou partie des
   quatre axes, ou le mot "self" / "ally", qui veut dire « là où est mon camp »
   sans qu'on ait à écrire de chiffres. Le widget bascule entre les deux, et
   les curseurs vont de −100 à +100 pour qu'on voie tout de suite de quel côté
   on penche. */
const AXIS_KEYS = ["social", "world", "economy", "power"];
const AXIS_HELP = {
  social: "−100 progressiste · +100 conservateur",
  world: "−100 internationaliste · +100 souverainiste",
  economy: "−100 socialiste · +100 libéral",
  power: "−100 étatiste · +100 laisser-faire",
};

function axisw(owner, key) {
  const box = h("div", { class: "sub" });
  const val = owner[key];
  const mode = typeof val === "string" ? val : "chiffres";

  const sel = h("select", { class: "fadd" },
    opt("chiffres", "position chiffrée"), opt("self", "self — là où est mon camp"),
    opt("ally", "ally — là où est mon allié"));
  sel.value = mode;
  sel.onchange = struct(() => {
    owner[key] = sel.value === "chiffres" ? {} : sel.value;
  });
  box.appendChild(h("div", { class: "krow" }, h("span", { class: "kname" }, "forme"), sel));

  if (mode !== "chiffres") return box;

  const obj = owner[key] || (owner[key] = {});
  AXIS_KEYS.forEach((ax) => {
    const actif = obj[ax] !== undefined;
    const on = h("input", { type: "checkbox" });
    on.checked = actif;
    on.onchange = struct(() => { if (on.checked) obj[ax] = 0; else delete obj[ax]; });

    const row = [h("span", { class: "kname", title: AXIS_HELP[ax] }, ax), on];
    if (actif) {
      const rng = h("input", { type: "range", min: "-100", max: "100", step: "5" });
      rng.value = obj[ax];
      const num = h("input", { type: "number", class: "num", min: "-100", max: "100" });
      num.value = obj[ax];
      rng.oninput = () => { obj[ax] = Number(rng.value); num.value = rng.value; sync(); };
      num.oninput = () => { obj[ax] = Number(num.value); rng.value = num.value; sync(); };
      rng.onchange = num.onchange = pushHistory;
      row.push(rng, num, h("span", { class: "khint" }, AXIS_HELP[ax]));
    }
    box.appendChild(h("div", { class: "krow" }, ...row));
  });
  return box;
}

function flagmap(owner, key) {
  const obj = owner[key] || {}; const box = h("div", { class: "sub" });
  Object.keys(obj).forEach((k) => box.appendChild(h("div", { class: "krow" },
    keySel(obj, k, FLAGS, struct(() => {})), boolw(obj, k),
    h("button", { class: "mini rm", onclick: struct(() => { delete obj[k]; if (!Object.keys(obj).length) delete owner[key]; }) }, "×"))));
  const avail = FLAGS.filter((v) => !(v in obj));
  if (avail.length) box.appendChild(addDrop("+ drapeau…", avail, (v) => struct(() => { (owner[key] || (owner[key] = {}))[v] = true; })()));
  return box;
}
function statmap(owner, key) {
  const obj = owner[key] || {}; const box = h("div", { class: "sub" });
  Object.keys(obj).forEach((s) => {
    const rng = obj[s] || (obj[s] = {});
    box.appendChild(h("div", { class: "krow" }, keySel(obj, s, STAT_KEYS, struct(() => {})),
      "min", rngNum(rng, "min"), "max", rngNum(rng, "max"),
      h("button", { class: "mini rm", onclick: struct(() => { delete obj[s]; if (!Object.keys(obj).length) delete owner[key]; }) }, "×")));
  });
  const avail = STAT_KEYS.filter((v) => !(v in obj));
  if (avail.length) box.appendChild(addDrop("+ stat…", avail, (v) => struct(() => { (owner[key] || (owner[key] = {}))[v] = { min: 0 }; })()));
  return box;
}
function rngNum(rng, which) {
  const e = h("input", { type: "number", class: "num", step: "any" }); e.value = rng[which] == null ? "" : rng[which];
  e.oninput = () => { if (e.value === "") delete rng[which]; else rng[which] = Number(e.value); sync(); }; e.onchange = pushHistory;
  return e;
}

/* ===== 12. Éditeurs when / effects / roll / choix ===================== */
function whenEditor(owner, key) {
  const w = owner[key]; const box = h("div", { class: "sub" });
  if (w) Object.keys(w).forEach((ck) => {
    const spec = WHEN_SPEC[ck] || { t: "num" };
    let widget;
    if (spec.t === "multi") widget = multiw(w, ck, spec.v);
    else if (spec.t === "num") widget = numw(w, ck);
    else if (spec.t === "bool") widget = boolw(w, ck);
    else if (spec.t === "statmap") widget = statmap(w, ck);
    else if (spec.t === "flagmap") widget = flagmap(w, ck);
    box.appendChild(h("div", { class: "krow" }, h("span", { class: "kname", title: WHEN_HELP[ck] || "" }, ck), widget,
      h("button", { class: "mini rm", onclick: struct(() => { delete w[ck]; if (!Object.keys(w).length) delete owner[key]; }) }, "×")));
  });
  const avail = Object.keys(WHEN_SPEC).filter((k) => !(w && k in w));
  box.appendChild(addDrop("+ condition…", avail, (k) => struct(() => { (owner[key] || (owner[key] = {}))[k] = defWhen(k); })()));
  return box;
}
const defWhen = (k) => { const t = (WHEN_SPEC[k] || {}).t; return t === "multi" ? [] : t === "bool" ? true : (t === "statmap" || t === "flagmap") ? {} : 0; };

function effectsEditor(owner, key) {
  const fx = owner[key]; const box = h("div", { class: "sub" });
  if (fx) Object.keys(fx).forEach((ek) => {
    const spec = EFFECT_SPEC[ek] || { t: "num" };
    let widget;
    if (spec.t === "num") widget = numw(fx, ek);
    else if (spec.t === "trait") widget = selectw(fx, ek, TRAIT_LIST);
    else if (spec.t === "select") widget = selectw(fx, ek, spec.v);
    else if (spec.t === "idlist") widget = idlistw(fx, ek);
    else if (spec.t === "flagmap") widget = flagmap(fx, ek);
    else if (spec.t === "nummap") widget = nummap(fx, ek, spec.v);
    else if (spec.t === "axis") widget = axisw(fx, ek);
    box.appendChild(h("div", { class: "krow" }, h("span", { class: "kname", title: FX_HELP[ek] || "" }, ek), widget,
      h("button", { class: "mini rm", onclick: struct(() => { delete fx[ek]; if (!Object.keys(fx).length) delete owner[key]; }) }, "×")));
  });
  const avail = Object.keys(EFFECT_SPEC).filter((k) => !(fx && k in fx));
  box.appendChild(addDrop("+ effet…", avail, (k) => struct(() => { (owner[key] || (owner[key] = {}))[k] = defEffect(k); })()));
  return box;
}
const defEffect = (k) => { const t = (EFFECT_SPEC[k] || {}).t; if (t === "trait") return TRAIT_LIST[0]; if (t === "select") return EFFECT_SPEC[k].v[0]; if (t === "idlist") return ""; if (t === "flagmap" || t === "nummap" || t === "axis") return {}; return 0; };

function bonusEditor(roll, key, label) {
  const box = h("div", { class: "sub" });
  (roll[key] || []).forEach((b, i) => box.appendChild(h("div", { class: "branch" },
    h("div", { class: "bt-title" }, label + " [" + i + "]",
      h("button", { class: "mini rm", style: "float:right", onclick: struct(() => { roll[key].splice(i, 1); if (!roll[key].length) delete roll[key]; }) }, "×")),
    frow("valeur", null, numw(b, "value")), frow("condition", null, whenEditor(b, "when")))));
  box.appendChild(h("button", { class: "mini fadd", onclick: struct(() => { (roll[key] || (roll[key] = [])).push({ value: 0, when: {} }); }) }, "+ " + label));
  return box;
}
function effectsIfEditor(branch) {
  const box = h("div", { class: "sub" });
  (branch.effectsIf || []).forEach((rule, i) => box.appendChild(h("div", { class: "branch" },
    h("div", { class: "bt-title" }, "effectsIf [" + i + "]",
      h("button", { class: "mini rm", style: "float:right", onclick: struct(() => { branch.effectsIf.splice(i, 1); if (!branch.effectsIf.length) delete branch.effectsIf; }) }, "×")),
    frow("condition", null, whenEditor(rule, "when")), frow("effets", null, effectsEditor(rule, "effects")))));
  box.appendChild(h("button", { class: "mini fadd", onclick: struct(() => { (branch.effectsIf || (branch.effectsIf = [])).push({ when: {}, effects: {} }); }) }, "+ effectsIf"));
  return box;
}
function branchEditor(branch) {
  if (!branch.result) branch.result = { fr: "", en: "" };
  return h("div", {}, frow("effets", "effects", effectsEditor(branch, "effects")),
    frow("result", "result", biText(branch.result, { area: true })), frow("cond.", "effectsIf", effectsIfEditor(branch)));
}
function rollEditor(choice) {
  const roll = choice.roll; const isChance = roll.chance !== undefined;
  const seg = h("div", { class: "seg" },
    h("button", { class: isChance ? "" : "on", onclick: struct(() => { delete roll.chance; delete roll.chanceBonus; if (roll.base === undefined && roll.difficulty === undefined) roll.base = 12; if (!roll.stat) roll.stat = STAT_KEYS[0]; }) }, "score composite"),
    h("button", { class: isChance ? "on" : "", onclick: struct(() => { ["base", "difficulty", "stat", "plus", "bonus", "dice"].forEach((k) => delete roll[k]); roll.chance = 0.5; }) }, "probabilité fixe"));
  const body = h("div", {});
  if (isChance) { body.append(frow("chance", "chance", numw(roll, "chance")), frow("chanceBonus", "chanceBonus", bonusEditor(roll, "chanceBonus", "chanceBonus"))); }
  else {
    body.append(frow("base", "base", numw(roll, "base")), frow("stat", "stat", selectw(roll, "stat", STAT_KEYS)),
      frow("dice", "dice", numw(roll, "dice")), frow("plus", "plus", nummap(roll, "plus", PLUS_KEYS)), frow("bonus", "bonus", bonusEditor(roll, "bonus", "bonus")));
  }
  return h("div", { class: "branch" }, h("div", { class: "bt-title" }, "roll", helpIcon("roll") || ""), seg, body);
}
/* LES DEUX EXTRÊMES. Facultatives : une scène n'en écrit une que si elle a
   quelque chose de plus à dire qu'un succès ou un échec ordinaire. Tant
   qu'elle est absente, le moteur ne tire même pas le dé de sévérité. */
function extremeEditor(choice, key, label) {
  if (!choice[key]) {
    return h("button", { class: "mini fadd", onclick: struct(() => {
      choice[key] = { effects: {}, result: { fr: "", en: "" } };
    }) }, "+ " + label);
  }
  return h("div", { class: "branch" },
    h("div", { class: "bt-title" }, key + " · " + label,
      h("button", { class: "mini rm", style: "float:right", onclick: struct(() => { delete choice[key]; }) }, "×")),
    branchEditor(choice[key]));
}

function choiceEditor(choice, i, choices) {
  if (!choice.label) choice.label = { fr: "", en: "" };
  const hasRoll = !!choice.roll;
  const head = h("div", { class: "chead" }, h("span", { class: "n" }, "Choix " + (i + 1)), h("span", { class: "sp" }),
    h("button", { class: "mini", title: "Monter", onclick: struct(() => { if (i > 0)[choices[i - 1], choices[i]] = [choices[i], choices[i - 1]]; }) }, "↑"),
    h("button", { class: "mini", title: "Descendre", onclick: struct(() => { if (i < choices.length - 1)[choices[i + 1], choices[i]] = [choices[i], choices[i + 1]]; }) }, "↓"),
    h("button", { class: "mini rm", onclick: struct(() => { choices.splice(i, 1); }) }, "Supprimer"));
  const toggle = h("div", { class: "seg" },
    h("button", { class: hasRoll ? "" : "on", onclick: struct(() => { if (hasRoll) { delete choice.roll; delete choice.success; delete choice.failure; delete choice.triumph; delete choice.debacle; choice.result = choice.result || { fr: "", en: "" }; choice.effects = choice.effects || {}; } }) }, "effet certain"),
    h("button", { class: hasRoll ? "on" : "", onclick: struct(() => { if (!hasRoll) { choice.roll = { base: 12, stat: STAT_KEYS[0] }; choice.success = { effects: {}, result: { fr: "", en: "" } }; choice.failure = { effects: {}, result: { fr: "", en: "" } }; delete choice.effects; delete choice.result; } }) }, "jet (roll)"));
  const body = h("div", {}, frow("label", "label", biText(choice.label)), frow("when", "whenChoice", whenEditor(choice, "when")), frow("type", null, toggle));
  if (hasRoll) {
    if (!choice.success) choice.success = { effects: {}, result: { fr: "", en: "" } };
    if (!choice.failure) choice.failure = { effects: {}, result: { fr: "", en: "" } };
    body.append(rollEditor(choice),
      h("div", { class: "branch" }, h("div", { class: "bt-title" }, "success", helpIcon("effects") || ""), branchEditor(choice.success)),
      h("div", { class: "branch" }, h("div", { class: "bt-title" }, "failure"), branchEditor(choice.failure)),
      extremeEditor(choice, "triumph", "coup critique"),
      extremeEditor(choice, "debacle", "débâcle"));
  } else body.append(branchEditor(choice));
  return h("div", { class: "card" }, head, body);
}

/* ===== 13. Formulaire complet ========================================= */
const isCampaignDeck = () => ["campaign", "support", "races"].includes(state.deck);
function buildForm() {
  const host = byId("formHost"); host.innerHTML = "";
  const model = state.model;
  if (!model) { host.appendChild(h("p", { class: "muted" }, "Sélectionnez un événement à gauche, ou créez-en un nouveau.")); sync(); return; }

  const gen = h("fieldset", {}, h("legend", {}, "Général"));
  gen.append(frow("id", "id", txt(model, "id", { keep: true, ph: "identifiant_unique" })), frow("weight", "weight", numw(model, "weight")),
    frow("options", null, chk(model, "repeatable", "repeatable"), chk(model, "once", "once"), isCampaignDeck() ? chk(model, "required", "required") : null),
    frow("cast", "cast", selectw(model, "cast", CAST_OPTIONS, { empty: true })),
    frow("tag", "tag", biText(model.tag || (model.tag = { fr: "", en: "" }))),
    frow("text", "text", biText(model.text || (model.text = { fr: "", en: "" }), { area: 3 })));
  if (state.deck === "races") gen.append(frow("race", "race", multiw(model, "race", ELECTION_IDS)));
  if (isCampaignDeck()) gen.append(frow("moment", "moment", momentEditor(model)));
  gen.append(frow("delay", "delay", delayEditor(model)));
  host.appendChild(gen);

  host.appendChild(h("fieldset", {}, h("legend", {}, "Conditions (when)", helpIcon("when") || ""), whenEditor(model, "when")));

  const choices = model.choices || (model.choices = []);
  const chBox = h("fieldset", {}, h("legend", {}, "Choix (" + choices.length + ")"));
  choices.forEach((c, i) => chBox.appendChild(choiceEditor(c, i, choices)));
  chBox.appendChild(h("button", { class: "mini fadd", onclick: struct(() => { choices.push({ label: { fr: "", en: "" }, effects: {}, result: { fr: "", en: "" } }); }) }, "+ Ajouter un choix"));
  host.appendChild(chBox);

  sync();
}
function chk(obj, key, label) {
  const c = h("input", { type: "checkbox" }); c.checked = !!obj[key];
  c.onchange = () => { if (c.checked) obj[key] = true; else delete obj[key]; commitVal(); };
  return h("label", { class: "chk" }, c, label);
}
function numArr(arr, i) { const e = h("input", { type: "number", class: "num" }); e.value = arr[i]; e.oninput = () => { arr[i] = Number(e.value); sync(); }; e.onchange = pushHistory; return e; }
function momentEditor(model) {
  const isPair = Array.isArray(model.moment); const wrap = h("span", { class: "krow" });
  if (isPair) wrap.append(numArr(model.moment, 0), numArr(model.moment, 1));
  else { const e = h("input", { type: "number", class: "num" }); e.value = model.moment == null ? "" : model.moment; e.oninput = () => { if (e.value === "") delete model.moment; else model.moment = Number(e.value); sync(); }; e.onchange = pushHistory; wrap.append(e); }
  const c = h("input", { type: "checkbox" }); c.checked = isPair;
  c.onchange = struct(() => { model.moment = c.checked ? [6, 4] : 1; });
  wrap.append(h("label", { class: "chk" }, c, "paire")); return wrap;
}
function delayEditor(model) {
  const has = Array.isArray(model.delay); const wrap = h("span", { class: "krow" });
  const c = h("input", { type: "checkbox" }); c.checked = has;
  c.onchange = struct(() => { if (c.checked) model.delay = [2, 4]; else delete model.delay; });
  wrap.append(h("label", { class: "chk" }, c, "délai (chaîne)"));
  if (has) wrap.append(numArr(model.delay, 0), "→", numArr(model.delay, 1));
  return wrap;
}

/* ===== 14. Validation ================================================= */
const isText = (o) => o && typeof o === "object" && typeof o.fr === "string" && typeof o.en === "string";
const filled = (o) => isText(o) && o.fr.trim() && o.en.trim();
function checkEffects(fx, where, out) {
  if (!fx || typeof fx !== "object") return;
  for (const [k, v] of Object.entries(fx)) {
    if (!EFFECT_KEYS.has(k)) { out.push(["error", "Effet inconnu <code>" + k + "</code> (" + where + ")"]); continue; }
    if ((k === "trait" || k === "strike" || k === "untrait") && !TRAIT_IDS.has(v)) out.push(["error", "Trait inexistant <code>" + v + "</code> (" + where + ")"]);
    if (k === "chain") (Array.isArray(v) ? v : [v]).forEach((id) => { if (id && !ALL_IDS[id]) out.push(["warn", "Chaîne vers un id inconnu <code>" + id + "</code> (" + where + ")"]); });
    if (k === "office" && !OFFICE_LIST.includes(v)) out.push(["warn", "Fonction inconnue <code>" + v + "</code> (" + where + ")"]);
    if (k === "landscape" && v && typeof v === "object") Object.keys(v).forEach((tg) => { if (!LANDSCAPE_TARGETS.includes(tg)) out.push(["warn", "Cible landscape inconnue <code>" + tg + "</code> (" + where + ")"]); });
  }
}
function checkWhen(when, where, out) {
  if (!when || typeof when !== "object") return;
  for (const [k, v] of Object.entries(when)) {
    if (!WHEN_KEYS.has(k)) { out.push(["warn", "Condition inconnue <code>" + k + "</code> (" + where + ")"]); continue; }
    const inList = (arr, ok, label) => (arr || []).forEach((x) => { if (!ok(x)) out.push(["error", label + " invalide <code>" + x + "</code> (" + where + ")"]); });
    if (k === "party") inList(v, (x) => PARTY_KEYS.includes(x), "Parti");
    if (k === "position") inList(v, (x) => POSITIONS.includes(x), "Fonction");
    if (k === "origin") inList(v, (x) => ORIGINS.includes(x), "Origine");
    if (k === "background") inList(v, (x) => BACKGROUNDS.includes(x), "Parcours");
    if (k === "personality") inList(v, (x) => PERSONALITIES.includes(x), "Personnalité");
    if (k === "trait" || k === "anyTrait" || k === "notTrait") inList(v, (x) => TRAIT_IDS.has(x), "Trait");
    if (k === "stat" && v && typeof v === "object") Object.keys(v).forEach((s) => { if (!STAT_KEYS.includes(s)) out.push(["error", "Stat inconnue <code>" + s + "</code> (" + where + ")"]); });
    if (k === "flag" && v && typeof v === "object") Object.keys(v).forEach((f) => { if (!FLAGS.includes(f)) out.push(["warn", "Drapeau inconnu <code>" + f + "</code> (" + where + ")"]); });
  }
}
function validateEvent(ev) {
  const out = [];
  if (!ev.id || typeof ev.id !== "string") out.push(["error", "id manquant"]);
  else if (!/^[a-zA-Z0-9_]+$/.test(ev.id)) out.push(["warn", "id peu conventionnel (préférez lettres, chiffres, _)"]);
  else if (ALL_IDS[ev.id] > 1 && ev.id !== state.selectedId) out.push(["error", "id <code>" + ev.id + "</code> déjà utilisé ailleurs"]);
  if (!isText(ev.tag)) out.push(["error", "tag doit avoir fr et en"]);
  else if (!filled(ev.tag)) out.push(["warn", "tag vide (fr ou en)"]);
  if (!isText(ev.text)) out.push(["error", "text doit avoir fr et en"]);
  else if (!filled(ev.text)) out.push(["warn", "text vide (fr ou en)"]);
  checkWhen(ev.when, "when", out);
  if (!Array.isArray(ev.choices) || !ev.choices.length) { out.push(["error", "au moins un choix requis"]); return out; }
  if (!ev.choices.some((c) => !c.when || !Object.keys(c.when).length)) out.push(["error", "au moins un choix doit être inconditionnel (sans when)"]);
  ev.choices.forEach((c, i) => {
    const at = "choix " + (i + 1);
    if (!isText(c.label)) out.push(["error", "label fr/en manquant (" + at + ")"]);
    else if (!filled(c.label)) out.push(["warn", "label vide (" + at + ")"]);
    checkWhen(c.when, at + ".when", out);
    if (c.roll) {
      const r = c.roll;
      if (r.chance === undefined && !STAT_KEYS.includes(r.stat)) out.push(["error", "roll : stat inconnue ou chance manquante (" + at + ")"]);
      if (!c.success || !c.failure) out.push(["error", "roll : success et failure requis (" + at + ")"]);
      [["success", c.success], ["failure", c.failure],
       ["triumph", c.triumph], ["debacle", c.debacle]].forEach(([br, b]) => {
        if (!b) return;
        if (!isText(b.result)) out.push(["error", "result fr/en manquant (" + at + " / " + br + ")"]);
        else if (!filled(b.result)) out.push(["warn", "result vide (" + at + " / " + br + ")"]);
        checkEffects(b.effects, at + "." + br, out);
        (b.effectsIf || []).forEach((e, j) => { checkWhen(e.when, at + "." + br + ".effectsIf[" + j + "]", out); checkEffects(e.effects, at + "." + br + ".effectsIf", out); });
      });
      (r.bonus || []).forEach((b, j) => checkWhen(b.when, at + ".roll.bonus[" + j + "]", out));
      (r.chanceBonus || []).forEach((b, j) => checkWhen(b.when, at + ".roll.chanceBonus[" + j + "]", out));
    } else {
      ["triumph", "debacle"].forEach((k) => c[k] && out.push(["error",
        "branche <code>" + k + "</code> sur un choix sans jet : elle ne jouera jamais (" + at + ")"]));
      if (!isText(c.result)) out.push(["error", "result fr/en manquant (" + at + ")"]);
      else if (!filled(c.result)) out.push(["warn", "result vide (" + at + ")"]);
      checkEffects(c.effects, at, out);
      (c.effectsIf || []).forEach((e, j) => { checkWhen(e.when, at + ".effectsIf[" + j + "]", out); checkEffects(e.effects, at + ".effectsIf", out); });
    }
  });
  return out;
}
function renderValidation(obj) {
  const host = byId("validation"); host.innerHTML = "";
  if (!obj) { host.appendChild(vline("warn", "Aucun événement")); return; }
  const issues = validateEvent(obj);
  if (!issues.length) { host.appendChild(vline("ok", "Aucun problème détecté")); return; }
  issues.forEach(([lvl, msg]) => host.appendChild(vline(lvl, msg)));
}
function vline(lvl, msg) {
  const s = h("span"); s.innerHTML = msg;
  return h("div", { class: "v " + lvl }, h("span", { class: "mark" }, lvl === "error" ? "✕" : lvl === "warn" ? "!" : "✓"), s);
}

/* ===== 15. Aperçu ===================================================== */
const GENDER = { il: "elle", le: "la", lui: "elle", celui: "celle", un: "une", e: "e", he: "she", him: "her", his: "her" };
function fillMarks(text, lang) {
  const partyName = (k) => translations[lang]["party_" + k] || k;
  return String(text || "").replace(/\{([A-Za-zÀ-ÿ]+)\}/g, (m, w) => {
    const key = w.charAt(0).toLowerCase() + w.slice(1);
    if (key === "rival") return "Agnès Martin (" + partyName(PARTY_KEYS[0]) + ")";
    if (key === "rival_party") return partyName(PARTY_KEYS[1]);
    if (key === "party") return partyName("socdem");
    if (GENDER[key] === undefined) return m;
    const f = GENDER[key];
    return w.charAt(0) === key.charAt(0) ? f : f.charAt(0).toUpperCase() + f.slice(1);
  });
}
const fxSummary = (fx) => fx ? Object.entries(fx).map(([k, v]) => k + "=" + (typeof v === "object" ? JSON.stringify(v) : v)).join("  ") : "";

/* ===== 15 bis. CE QUE L'EFFET FAIT AUX SIX ÉLECTORATS ===================
   On ne pouvait doser à l'aveugle : « popularity: 8 » ne dit pas si le
   résultat sera six colonnes identiques ou un vrai clivage, et le seul moyen
   de le savoir était de lancer une partie. L'aperçu rejoue donc ici la même
   arithmétique que le moteur — le filtre partisan, le positionnement sur les
   axes, les cibles self / others — et montre les six deltas.

   Une seule différence avec le jeu, et elle est signalée : les rendements
   décroissants dépendent de l'adhésion du moment, qu'un éditeur ne connaît
   pas. Les chiffres sont donc ceux d'un effet « plein tarif ». */
const AXES_L = ["social", "world", "economy", "power"];
const NEUTRAL_AXES_L = { social: 5, world: -15, economy: 25, power: 5 };
const AXIS_NEUTRAL_L = 0.68;
const APPEAL_TILT_L = 0.3;

const axesOfL = (k) => (PARTIES[k] ? PARTIES[k].axes : NEUTRAL_AXES_L);
const distanceL = (a, b) => {
  const A = axesOfL(a), B = axesOfL(b);
  return AXES_L.reduce((s, x) => s + Math.abs(A[x] - B[x]), 0) / (AXES_L.length * 200);
};
function affinityL(pos, k) {
  const ax = axesOfL(k);
  const dec = AXES_L.filter((x) => pos[x] !== undefined);
  if (!dec.length) return AXIS_NEUTRAL_L;
  return 1 - dec.reduce((s, x) => s + Math.abs(pos[x] - ax[x]), 0) / (dec.length * 200);
}

/* « scene », « ruling » et « ally » désignent un camp que la partie décide et
   qu'aucun aperçu ne peut deviner : on le choisit à la main, à côté du sien. */
function previewTarget(token, moi) {
  if (token === "self") return moi;
  if (token === "scene" || token === "ruling" || token === "ally") return previewScene;
  return PARTY_KEYS.includes(token) ? token : null;
}

function appealPreview(fx, moi) {
  const out = {};
  PARTY_KEYS.forEach((k) => { out[k] = 0; });
  if (!fx) return out;

  if (typeof fx.popularity === "number") {
    if (fx.axis !== undefined) {
      const pos = typeof fx.axis === "string" ? axesOfL(previewTarget(fx.axis, moi) || moi) : fx.axis;
      PARTY_KEYS.forEach((k) => {
        out[k] += fx.popularity * ((affinityL(pos, k) - AXIS_NEUTRAL_L) / (1 - AXIS_NEUTRAL_L));
      });
    } else {
      PARTY_KEYS.forEach((k) => {
        const pen = ((1 - distanceL(k, moi)) - AXIS_NEUTRAL_L) * APPEAL_TILT_L * 2;
        out[k] += fx.popularity * (fx.popularity >= 0 ? 1 + pen : 1 - pen);
      });
    }
  }
  if (fx.appeal) Object.entries(fx.appeal).forEach(([cible, v]) => {
    if (cible === "others") return PARTY_KEYS.forEach((k) => { if (k !== moi) out[k] += v; });
    const k = previewTarget(cible, moi);
    if (k) out[k] += v;
  });
  return out;
}

function appealRow(fx, moi) {
  if (!fx || (fx.popularity === undefined && !fx.appeal)) return null;
  const deltas = appealPreview(fx, moi);
  const row = h("div", { class: "elec" });
  PARTY_KEYS.forEach((k) => {
    const d = Math.round(deltas[k] * 10) / 10;
    const cls = "e" + (d > 0.05 ? " up" : d < -0.05 ? " down" : " flat");
    row.appendChild(h("span", { class: cls, title: trFR["party_" + k] || k },
      (trFR["party_" + k] || k).slice(0, 4) + " " + (d > 0 ? "+" : "") + d));
  });
  return row;
}
const el = (tag, cls, text) => { const e = h(tag, { class: cls }); e.textContent = text; return e; };
/* Le camp depuis lequel on lit l'aperçu : « self », la distance idéologique et
   le filtre partisan en dépendent tous, donc la même scène ne donne pas les
   mêmes six chiffres selon qui la joue. */
let previewParty = PARTY_KEYS[0];
/* Et le camp d'en face, celui que « scene », « ruling » et « ally » visent. */
let previewScene = PARTY_KEYS[PARTY_KEYS.length - 1];

function renderPreview(obj) {
  const host = byId("preview"); host.innerHTML = "";
  if (!obj || !obj.text) return;

  const sel = h("select", { class: "fadd" }, ...PARTY_KEYS.map((k) => opt(k, trFR["party_" + k] || k)));
  sel.value = previewParty;
  sel.onchange = () => { previewParty = sel.value; renderPreview(obj); };
  const face = h("select", { class: "fadd" }, ...PARTY_KEYS.map((k) => opt(k, trFR["party_" + k] || k)));
  face.value = previewScene;
  face.onchange = () => { previewScene = face.value; renderPreview(obj); };
  host.appendChild(h("div", { class: "elec-head" },
    h("span", {}, "Vu depuis le camp"), sel,
    h("span", {}, "en face"), face,
    h("span", { class: "elec-note" }, "effet plein tarif, hors rendements décroissants")));

  ["fr", "en"].forEach((lang) => {
    const box = h("div", { class: "pv" }, el("div", "lang", lang), el("p", "txt", fillMarks((obj.text && obj.text[lang]) || "", lang)));
    (obj.choices || []).forEach((c) => {
      const ch = h("div", { class: "ch" }, el("div", "lbl", "▸ " + fillMarks((c.label && c.label[lang]) || "", lang)));
      (c.roll ? [["✓", c.success], ["✗", c.failure], ["✓✓", c.triumph], ["✗✗", c.debacle]]
        : [["", c]]).forEach(([mk, b]) => {
        if (!b) return;
        const fx = fxSummary(b.effects); if (fx) ch.appendChild(el("div", "fx", mk + " " + fx));
        // La déclinaison ne se lit qu'une fois : elle ne dépend pas de la langue.
        if (lang === "fr") { const r = appealRow(b.effects, previewParty); if (r) ch.appendChild(r); }
        if (b.result) ch.appendChild(el("div", "res", mk + " " + fillMarks((b.result && b.result[lang]) || "", lang)));
      });
      box.appendChild(ch);
    });
    host.appendChild(box);
  });
}

/* ===== 16. Liste ====================================================== */
function matchFilter(e) {
  if (state.deck === "events" && state.theme !== "*" && idTheme[e.id] !== state.theme) return false;
  if (!state.search) return true;
  return (e.id + " " + JSON.stringify(e.tag || "") + " " + JSON.stringify(e.text || "")).toLowerCase().includes(state.search);
}
function evRow(e, badge, badgeClass) {
  const id = h("div", { class: "id" }, e.id);
  if (badge) id.appendChild(h("span", { class: "badge " + (badgeClass || "") }, badge));
  return h("div", { class: "ev" + (e.id === state.selectedId ? " sel" : ""), onclick: () => selectEvent(e.id) },
    id, h("div", { class: "tag" }, e.tag ? (e.tag.fr || "") : ""));
}
function renderList() {
  const inData = DECKS[state.deck];
  const dataIds = new Set(inData.map((e) => e.id));
  const gameList = inData.filter(matchFilter);
  const draftOnly = Object.values(drafts).filter((d) => d.deck === state.deck && !dataIds.has(d.event.id)).map((d) => d.event).filter(matchFilter);

  byId("listCount").textContent = gameList.length + draftOnly.length + " événement(s)";
  const host = byId("list"); host.innerHTML = "";
  gameList.forEach((e) => {
    const draft = drafts[dkey(state.deck, e.id)];
    host.appendChild(evRow(e, state.deck === "events" ? (idTheme[e.id] || "?") : (draft ? "brouillon" : ""), draft ? "draft" : ""));
    // pour le deck events, on montre le thème ; le brouillon éventuel se lit au statut
  });
  if (draftOnly.length) {
    host.appendChild(h("p", { class: "grp-title" }, "Nouveaux brouillons"));
    draftOnly.forEach((e) => host.appendChild(evRow(e, "brouillon", "newdraft")));
  }
}

/* ===== 17. Actions ==================================================== */
function save() {
  if (!state.model) return;
  const id = state.model.id;
  if (!id) { toast("Donnez un id avant d'enregistrer", "err"); return; }
  drafts[dkey(state.deck, id)] = { savedAt: Date.now(), deck: state.deck, event: clone(state.model) };
  persist(); state.baseline = snapshot();
  toast("Brouillon enregistré", "ok"); renderList(); sync();
}
function loadDraft() {
  const k = currentDraftKey(); if (!k || !drafts[k]) return;
  state.model = clone(drafts[k].event); state.loadedFrom = "draft"; state.baseline = snapshot();
  resetHistory(); buildForm(); toast("Brouillon chargé", "ok");
}
function delDraft() {
  const k = currentDraftKey(); if (!k || !drafts[k]) return;
  if (!confirm("Supprimer le brouillon enregistré pour « " + state.model.id + " » ?")) return;
  delete drafts[k]; persist();
  if (state.loadedFrom === "draft") { state.model = state.original ? clone(state.original) : template(); state.loadedFrom = state.original ? "data" : "new"; state.baseline = snapshot(); resetHistory(); }
  renderList(); buildForm(); toast("Brouillon supprimé", "ok");
}
function revert() {
  if (!state.model) return;
  const hasOrig = !!state.original;
  if (!confirm(hasOrig ? "Revenir à la version d'origine ? Les modifications non enregistrées seront perdues."
    : "Réinitialiser cet événement ?")) return;
  state.model = hasOrig ? clone(state.original) : template();
  state.baseline = snapshot(); resetHistory(); buildForm(); toast("Réinitialisé", "ok");
}
function validateNow() {
  if (!state.model) return;
  const issues = validateEvent(state.model);
  const errs = issues.filter((i) => i[0] === "error").length;
  const warns = issues.filter((i) => i[0] === "warn").length;
  if (errs) banner("✗ Inutilisable — " + errs + " erreur(s)" + (warns ? " et " + warns + " avertissement(s)" : "") + ". Voir le panneau Validation.", "err");
  else if (warns) banner("⚠ Utilisable, mais " + warns + " avertissement(s) — champs vides ? Voir le panneau.", "warn");
  else banner("✓ Événement prêt à l'emploi.", "ok");
}
async function copyJSON() {
  if (!state.model) return;
  const t = JSON.stringify(state.model, null, 2);
  try { await navigator.clipboard.writeText(t); }
  catch (e) { const ta = h("textarea", {}); ta.value = t; document.body.append(ta); ta.select(); try { document.execCommand("copy"); } catch (e2) {} ta.remove(); }
  toast("JSON copié — collez-le dans " + targetFile(), "ok");
}
function newEvent() { state.selectedId = null; state.original = null; state.model = template(); state.loadedFrom = "new"; state.baseline = snapshot(); resetHistory(); renderList(); buildForm(); byId("banner").innerHTML = ""; }
function duplicate() { if (!state.model) return; state.model = clone(state.model); state.model.id = (state.model.id || "event") + "_copie"; state.selectedId = null; state.original = null; state.loadedFrom = "new"; state.baseline = snapshot(); resetHistory(); renderList(); buildForm(); }

/* ===== 18. Câblage & init ============================================= */
function fillThemes() {
  const sel = byId("theme"); sel.innerHTML = "";
  ["*", ...Object.keys(THEME_FILES)].forEach((t) => sel.appendChild(opt(t, t === "*" ? "tous les thèmes" : t)));
  sel.style.display = state.deck === "events" ? "" : "none";
}
function init() {
  byId("allIds").innerHTML = Object.keys(ALL_IDS).map((id) => '<option value="' + id + '">').join("");
  byId("loadInfo").textContent = Object.values(DECKS).reduce((n, a) => n + a.length, 0) + " événements chargés";

  const deckSel = byId("deck");
  Object.keys(DECKS).forEach((d) => deckSel.appendChild(opt(d, d + " (" + DECKS[d].length + ")")));
  deckSel.onchange = () => { state.deck = deckSel.value; state.theme = "*"; fillThemes(); state.selectedId = null; state.model = null; state.original = null; renderList(); buildForm(); byId("banner").innerHTML = ""; };
  byId("theme").onchange = (e) => { state.theme = e.target.value; renderList(); };
  byId("search").oninput = (e) => { state.search = e.target.value.trim().toLowerCase(); renderList(); };

  byId("btnNew").onclick = newEvent;
  byId("btnDup").onclick = duplicate;
  byId("btnUndo").onclick = undo;
  byId("btnRedo").onclick = redo;
  byId("btnSave").onclick = save;
  byId("btnLoadDraft").onclick = loadDraft;
  byId("btnDelDraft").onclick = delDraft;
  byId("btnRevert").onclick = revert;
  byId("btnValidate").onclick = validateNow;
  byId("btnCopy").onclick = copyJSON;

  document.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === "s") { e.preventDefault(); save(); }
    else if (k === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
    else if (k === "y" || (k === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
  });

  fillThemes(); renderList(); buildForm();
}
init();
})();
