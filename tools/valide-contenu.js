/*
 * President Material — VÉRIFICATION DU CONTENU.
 *
 * À quoi ça sert. Une faute de vocabulaire dans un événement ne casse rien :
 * elle ne fait rien. Une condition écrite "personality": ["brutal"] quand la
 * personnalité s'appelle "provocative" produit un choix qui ne s'affiche
 * jamais ; un "strike": "meprisant" sur une marque qui n'existe pas produit
 * un effet qui ne s'applique jamais ; un "chain" vers un identifiant absent
 * produit une suite qui ne tombe jamais. Le jeu tourne, le harnais de
 * non-régression ne voit rien, et la scène est morte.
 *
 * Ce fichier lit donc tout le contenu et confronte chaque mot à ce que le
 * moteur connaît vraiment — les partis, les fonctions, les origines, les
 * parcours, les personnalités, les traits, les statistiques, les scrutins,
 * les drapeaux — au lieu de faire confiance à la relecture.
 *
 * Il vérifie aussi les DEUX LANGUES. C'est le piège de ce dépôt : une clef
 * renommée d'un côté et pas de l'autre casse silencieusement une langue, et
 * personne ne joue jamais dans les deux.
 *
 * Usage :
 *
 *     node tools/valide-contenu.js            # depuis la racine
 *     node tools/valide-contenu.js /chemin    # ou en précisant la racine
 *
 * Sortie vide et code 0 : tout va bien. Sinon, une ligne par problème, avec
 * le paquet, l'identifiant de la scène et l'endroit exact.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.argv[2] || path.join(__dirname, "..");

/* On charge exactement ce que game.html charge, et dans le même ordre : les
   données et les traductions suffisent, le moteur n'est pas nécessaire. */
const html = fs.readFileSync(path.join(ROOT, "game.html"), "utf8");
const order = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
  .map((m) => m[1])
  .filter((f) => /\.data\.js$|\/(script|data|balance)\.js$/.test(f));

const ctx = vm.createContext({
  window: {}, document: { addEventListener() {} },
  localStorage: { getItem: () => null, setItem() {} }, location: { pathname: "/" },
});
for (const f of order) {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f }); }
  catch (e) { console.log("CHARGEMENT " + f + " : " + e.message); process.exit(1); }
}
const read = (name) => { try { return vm.runInContext(name, ctx); } catch { return undefined; } };

/* GENDER_MARKS vit dans js/game-data.js, que l'on ne charge pas ici : le
   moteur entier réclamerait un DOM. On lit donc la table dans le fichier,
   pour que ce contrôle suive le jour où quelqu'un ajoute une marque. */
function genderMarks() {
  const src = fs.readFileSync(path.join(ROOT, "js/game-data.js"), "utf8");
  const bloc = /const GENDER_MARKS = \{([\s\S]*?)\n\};/.exec(src);
  if (!bloc) return [];
  return [...bloc[1].matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*):/gm)].map((m) => m[1]);
}

const DECKS = read("EVENT_DATA");
const ENDINGS = read("ENDING_DATA") || [];
const TRAITS = read("TRAIT_DATA");
const MODS = read("STAT_MODIFIERS");
const LANG = read("translations");
const FR = LANG.fr, EN = LANG.en;

const STAT_KEYS = Object.keys(read("BASE_STATS"));
const PARTIES = Object.keys(read("PARTIES"));
const ORIGINS = Object.keys(MODS.origin);
const BACKGROUNDS = Object.keys(MODS.background);
const PERSONALITIES = Object.entries(TRAITS).filter(([, d]) => d.family === "caractere").map(([id]) => id);
const keysFrom = (prefix) => Object.keys(FR).filter((k) => k.startsWith(prefix) && !k.endsWith("_low")).map((k) => k.slice(prefix.length));
const POSITIONS = keysFrom("pos_").concat("chef");
const ELECTIONS = keysFrom("elec_");
const CASTS = ["opponent", "leader", "ruling", "neighbour", "camp", "camp_senior", "minor", "eliminated"];

const WHEN_KEYS = new Set(["party", "position", "origin", "background", "personality", "minAge", "maxAge",
  "minTurn", "maxTurn", "minPopularity", "maxPopularity", "minStanding", "maxStanding", "minMoney", "maxMoney",
  "minGeneral", "maxGeneral", "minDecline", "maxDecline", "minElectionsWon", "minElectionsLost",
  "stat", "flag", "trait", "anyTrait", "notTrait", "ruling", "allied", "partyLead", "minShare", "maxShare", "minCampaignSpend", "yearEnd", "rulingClose",
  "belowPeak", "legal", "comms", "majority", "minApproval", "maxApproval", "inCoalition", "firstGroup", "pivot",
  "minSeats", "maxSeats", "dissolved", "outshinePresident", "foeIncumbent", "foeParty", "foeFar", "minorClose",
  "election", "race"]);
const FX_KEYS = new Set([...STAT_KEYS, "popularity", "standing", "axis", "appeal", "money", "poll", "score",
  "flags", "trait", "strike", "untrait", "chain", "landscape", "office", "lead", "approval", "dissolve",
  "join", "alliance", "end"]);
const LANDSCAPE_TARGETS = ["self", "scene", "ruling", "ally", ...PARTIES];
const APPEAL_TARGETS = ["self", "others", ...PARTIES];

/* Les drapeaux connus : ceux qui ont une traduction, plus tous ceux qu'un
   effet pose quelque part. Un drapeau qu'aucun effet ne pose et qu'aucune
   traduction ne nomme est une faute de frappe. */
const FLAGS = new Set(keysFrom("flag_"));
Object.values(DECKS).flat().forEach((e) => {
  if (!e || !e.choices) return;
  e.choices.forEach((c) => [c.effects, c.success && c.success.effects, c.failure && c.failure.effects,
    c.triumph && c.triumph.effects, c.debacle && c.debacle.effects]
    .forEach((fx) => fx && fx.flags && Object.keys(fx.flags).forEach((k) => FLAGS.add(k))));
});
/* Ceux que le moteur pose lui-même, hors événements. */
["presidentRenonce", "dirtyMoney", "onTrial", "frailHealth", "carefulHealth"].forEach((f) => FLAGS.add(f));

const ALL_IDS = new Set(Object.values(DECKS).flat().filter(Boolean).map((e) => e.id));

const problems = [];
const say = (deck, id, msg) => problems.push(deck + " / " + id + " : " + msg);

function checkWhen(deck, id, w, where) {
  if (!w) return;
  for (const k of Object.keys(w)) {
    if (!WHEN_KEYS.has(k)) { say(deck, id, where + " condition inconnue « " + k + " »"); continue; }
    const v = w[k];
    const list = Array.isArray(v) ? v : [v];
    const inVocab = (vocab, what) => list.forEach((x) =>
      !vocab.includes(x) && say(deck, id, where + " " + what + " « " + x + " »"));

    if (k === "party" || k === "foeParty") inVocab(PARTIES, "parti inconnu");
    if (k === "position") inVocab(POSITIONS, "fonction inconnue");
    if (k === "origin") inVocab(ORIGINS, "origine inconnue");
    if (k === "background") inVocab(BACKGROUNDS, "parcours inconnu");
    if (k === "personality") inVocab(PERSONALITIES, "personnalité inconnue");
    if (k === "trait" || k === "anyTrait" || k === "notTrait")
      list.forEach((x) => !TRAITS[x] && say(deck, id, where + " trait inconnu « " + x + " »"));
    if (k === "election" || k === "race") inVocab(ELECTIONS, "scrutin inconnu");
    if (k === "flag") Object.keys(v).forEach((x) =>
      !FLAGS.has(x) && say(deck, id, where + " drapeau inconnu « " + x + " »"));
    if (k === "stat") Object.keys(v).forEach((x) =>
      !STAT_KEYS.includes(x) && say(deck, id, where + " statistique inconnue « " + x + " »"));
  }
}

function checkEffects(deck, id, fx, where) {
  if (!fx) return;
  for (const k of Object.keys(fx)) {
    if (!FX_KEYS.has(k)) { say(deck, id, where + " effet inconnu « " + k + " »"); continue; }
    if (k === "trait" || k === "untrait" || k === "strike")
      [].concat(fx[k]).forEach((x) => !TRAITS[x] && say(deck, id, where + " trait inconnu « " + x + " »"));
    if (k === "chain")
      [].concat(fx[k]).forEach((x) => !ALL_IDS.has(x) && say(deck, id, where + " suite vers un identifiant inexistant « " + x + " »"));
    if (k === "flags") Object.keys(fx[k]).forEach((x) =>
      !FLAGS.has(x) && say(deck, id, where + " drapeau inconnu « " + x + " »"));
    if (k === "appeal") Object.keys(fx[k]).forEach((x) =>
      !APPEAL_TARGETS.includes(x) && say(deck, id, where + " électorat inconnu « " + x + " »"));
    if (k === "landscape") Object.keys(fx[k]).forEach((x) =>
      !LANDSCAPE_TARGETS.includes(x) && say(deck, id, where + " cible de paysage inconnue « " + x + " »"));
    if (k === "office" && fx[k] !== "none" && !POSITIONS.includes(fx[k]))
      say(deck, id, where + " fonction inconnue « " + fx[k] + " »");
  }
}

/* ---------- LES MARQUES D'ACCORD ----------------------------------------
   Une marque que fillGender() ne connaît pas n'est pas remplacée : elle
   s'affiche telle quelle, accolades comprises, au milieu d'une phrase. Rien
   ne plante, rien ne prévient, et le joueur lit « {son} suppléant ». C'est
   la faute la plus facile à commettre — on invente une marque en écrivant —
   et la seule qui se voie à l'écran.

   Rappel de ce qui existe : {il} {le} {lui} {celui} {un} {e} {premier} en
   français, {he} {him} {his} en anglais. Le possessif français s'accorde
   avec l'objet possédé et non avec la personne : « son nom » et « sa place »
   s'écrivent en clair, sans marque.
   ------------------------------------------------------------------------ */
const MARKS = new Set([...genderMarks(), "rival", "rival_party", "party", "party_the"]);

function checkMarks(deck, id, o, where) {
  if (!o) return;
  ["fr", "en"].forEach((lang) => {
    if (typeof o[lang] !== "string") return;
    for (const m of o[lang].matchAll(/\{([A-Za-zÀ-ÿ_]+)\}/g)) {
      const clé = m[1].charAt(0).toLowerCase() + m[1].slice(1);
      if (!MARKS.has(clé)) say(deck, id, where + " (" + lang + ") marque inconnue « {" + m[1] + "} »");
    }
  });
}

/* Les deux langues. Un texte identique dans les deux est normal pour une
   étiquette d'un mot (« Justice », « Archives »), suspect au-delà. */
function checkBilingual(deck, id, o, where, prose) {
  if (!o) return say(deck, id, where + " manquant");
  checkMarks(deck, id, o, where);
  if (typeof o.fr !== "string" || !o.fr.trim()) say(deck, id, where + " sans texte français");
  if (typeof o.en !== "string" || !o.en.trim()) say(deck, id, where + " sans texte anglais");
  if (prose && o.fr && o.fr === o.en) say(deck, id, where + " identique en français et en anglais");
}

for (const [deck, list] of Object.entries(DECKS)) {
  const seen = new Set();
  list.forEach((e, n) => {
    if (!e || !e.id) return say(deck, "entrée " + n, "vide — virgule en trop dans le tableau");
    if (seen.has(e.id)) say(deck, e.id, "identifiant en double");
    seen.add(e.id);

    if (e.cast && !CASTS.includes(e.cast)) say(deck, e.id, "cast inconnu « " + e.cast + " »");
    /* Les scènes de fin de carrière : le moteur les programme lui-même, elles
       ne doivent donc jamais pouvoir sortir d'un tirage au hasard. */
    if (e.decline !== undefined) {
      if (![1, 2, 3].includes(e.decline)) say(deck, e.id, "temps du corps invalide « " + e.decline + " »");
      if (e.weight !== 0) say(deck, e.id, "scène de fin de carrière tirable au hasard (weight doit valoir 0)");
      if (e.weightBonus) say(deck, e.id, "scène de fin de carrière avec « weightBonus » : elle redeviendrait tirable");
    }
    /* Un poids qui dépend de la situation : même écriture que "chanceBonus". */
    if (e.weightBonus !== undefined) {
      if (!Array.isArray(e.weightBonus)) say(deck, e.id, "« weightBonus » doit être une liste");
      else e.weightBonus.forEach((b, i) => {
        const w = "weightBonus " + (i + 1);
        if (typeof b.value !== "number") say(deck, e.id, w + " sans valeur numérique");
        checkWhen(deck, e.id, b.when, w);
      });
    }
    checkBilingual(deck, e.id, e.text, "texte", true);
    checkBilingual(deck, e.id, e.tag, "étiquette", false);
    checkWhen(deck, e.id, e.when, "when");

    if (!Array.isArray(e.choices) || !e.choices.length) return say(deck, e.id, "aucun choix");
    if (!e.choices.some((c) => !c.when)) say(deck, e.id, "aucun choix inconditionnel");

    e.choices.forEach((c, i) => {
      const w = "choix " + (i + 1);
      checkBilingual(deck, e.id, c.label, w + " libellé", true);
      checkWhen(deck, e.id, c.when, w);

      const branch = (b, name) => {
        if (!b) return say(deck, e.id, w + " branche « " + name + " » manquante");
        checkBilingual(deck, e.id, b.result, w + "/" + name + " résultat", true);
        checkEffects(deck, e.id, b.effects, w + "/" + name);
        (b.effectsIf || []).forEach((x) => {
          checkWhen(deck, e.id, x.when, w + "/" + name + " effectsIf");
          checkEffects(deck, e.id, x.effects, w + "/" + name + " effectsIf");
        });
      };

      // Une branche extrême sans jet ne se déclenchera jamais : elle ne casse
      // rien, elle ne joue simplement pas. C'est le genre de contenu mort que
      // ce fichier existe pour attraper.
      if (!c.roll) {
        ["triumph", "debacle"].forEach((name) => c[name] &&
          say(deck, e.id, w + " branche « " + name + " » sur un choix sans jet : elle ne jouera jamais"));
        return branch(c, "certain");
      }

      if (c.roll.chance === undefined && c.roll.base === undefined && c.roll.difficulty === undefined)
        say(deck, e.id, w + " jet sans seuil ni probabilité");
      if (c.roll.stat && !STAT_KEYS.includes(c.roll.stat))
        say(deck, e.id, w + " statistique de jet inconnue « " + c.roll.stat + " »");
      if (c.roll.plus) Object.keys(c.roll.plus).forEach((k) =>
        ![...STAT_KEYS, "popularity", "standing", "money"].includes(k) &&
        say(deck, e.id, w + " appoint de jet inconnu « " + k + " »"));
      [...(c.roll.bonus || []), ...(c.roll.chanceBonus || [])].forEach((b) =>
        checkWhen(deck, e.id, b.when, w + " bonus"));
      branch(c.success, "success");
      branch(c.failure, "failure");
      // Les deux extrêmes sont facultatives : on ne les vérifie que si elles
      // sont là, sinon toute scène ordinaire serait signalée comme incomplète.
      if (c.triumph) branch(c.triumph, "triumph");
      if (c.debacle) branch(c.debacle, "debacle");
    });
  });
}

/* ---------- LES FINS ------------------------------------------------------
   Elles vivent dans js/endings.data.js, elles lisent les mêmes conditions que
   les événements, et personne ne les vérifiait. Une fin dont le "when" porte
   une faute ne se déclenche jamais : c'est la fin ordinaire de sa famille qui
   passe à sa place, et le joueur ne sait pas qu'il a raté un texte. */
const END_TYPES = ["victory", "retire", "withdrawal", "death", "conviction"];
const parFamille = {};

const vues = new Set();
ENDINGS.forEach((e, n) => {
  const id = e && e.id ? e.id : "entrée " + n;
  if (!e || !e.id) return say("fins", id, "vide — virgule en trop dans le tableau");
  if (vues.has(e.id)) say("fins", id, "identifiant en double : la seconde ne jouera jamais");
  vues.add(e.id);
  if (!END_TYPES.includes(e.from)) say("fins", id, "type de fin inconnu « " + e.from + " »");
  checkBilingual("fins", id, e.title, "titre", true);
  checkBilingual("fins", id, e.text, "texte", true);
  checkWhen("fins", id, e.when, "when");
  if (!e.when) (parFamille[e.from] = parFamille[e.from] || []).push(id);
});

/* Chaque famille doit se fermer sur une fin sans condition, et celle-ci doit
   être la dernière : la liste est parcourue dans l'ordre et la première qui
   correspond gagne, donc une fin ordinaire placée trop haut mange toutes les
   suivantes. */
END_TYPES.forEach((type) => {
  const ordinaires = parFamille[type] || [];
  if (!ordinaires.length) return say("fins", type, "aucune fin ordinaire : cette famille peut ne rien afficher");
  if (ordinaires.length > 1) say("fins", type, "plusieurs fins sans condition (" + ordinaires.join(", ") + ") : seule la première jouera");
  const liste = ENDINGS.filter((e) => e && e.from === type);
  if (liste.length && liste[liste.length - 1].id !== ordinaires[0])
    say("fins", ordinaires[0], "fin ordinaire placée avant d'autres fins de la même famille, qui ne joueront jamais");
});

if (problems.length) {
  console.log(problems.join("\n"));
  console.log("\n" + problems.length + " problème(s).");
  process.exit(1);
}
console.log("Contenu vérifié : " +
  Object.entries(DECKS).map(([k, v]) => k + " " + v.length).join(", ") +
  ", fins " + ENDINGS.length + ". Rien à signaler.");
