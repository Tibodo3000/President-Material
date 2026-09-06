/*
 * President Material — AUDIT DES CHOIX.
 * ============================================================================
 *
 * À QUOI ÇA SERT. Le vérificateur de contenu dit si un mot existe, l'audit
 * d'opinion dit si un camp applaudit quand il ne devrait pas. Ni l'un ni
 * l'autre ne dit si un CHOIX se pose vraiment. Or une scène peut être
 * parfaitement valide et complètement morte : trois options dont deux que
 * personne ne prendra jamais, et un dilemme qui n'en est pas un.
 *
 * Cet outil mesure trois choses, dans cet ordre d'importance :
 *
 *   1. LES OPTIONS QUI NE RAPPORTENT RIEN. Une option libre dont tous les
 *      effets sont négatifs et qui n'apporte ni trait, ni chaîne, ni drapeau,
 *      ni position. Le joueur la lit, comprend qu'elle ne sert à rien, et la
 *      scène perd une branche. Il ne doit pas en rester.
 *
 *   2. LES OPTIONS DOMINÉES. Une autre option libre fait aussi bien sur
 *      chaque grandeur et mieux sur au moins une. Là non plus, le choix ne se
 *      pose pas : il n'y a qu'une réponse.
 *
 *   3. L'OPTION QUI GAGNE QUOI QU'ON PRIVILÉGIE. La mesure qui compte le
 *      plus, et la plus difficile à voir à l'œil. On tire huit cents barèmes
 *      au hasard sur les monnaies du jeu — un joueur qui joue la popularité,
 *      un autre la cote, un autre l'argent, un autre l'énergie — et l'on
 *      compte sous combien d'entre eux chaque option sort première. Une
 *      option qui gagne sous quatre-vingts pour cent des barèmes n'est pas un
 *      choix : c'est la réponse, et les autres branches sont du décor.
 *
 *      CE QUE CETTE MESURE NE VOIT PAS : une option à gros risque et gros
 *      gain. Elle est comparée sur sa moyenne, donc elle perd contre une
 *      certitude équivalente, alors qu'elle est le bon choix quand il faut un
 *      renversement et le mauvais quand on mène. Avant de corriger une scène
 *      signalée, vérifier si l'option perdante n'est pas simplement le pari.
 *
 *      Le défaut typique n'est pas qu'une option soit trop forte, c'est que
 *      l'option prudente ne renonce à RIEN : elle gagne sur cinq axes et n'en
 *      cède aucun, pendant que l'option risquée est un pari dont la réussite
 *      dépasse à peine cette certitude. Corriger se fait presque toujours du
 *      côté prudent : la hauteur doit coûter la notoriété qu'elle ne prend
 *      pas, la base qu'elle déçoit, ou l'adversaire qu'elle laisse intact.
 *
 *   4. CE QUI ENTRE DANS UN JET. Un jet qui ne lit qu'une statistique ne
 *      récompense qu'un profil. Le parcours, les traits et la situation
 *      doivent peser sur la probabilité, pas seulement ouvrir des options.
 *
 *   5. LE RAPPORT DE FORCE. Combien de branches le déplacent, et combien le
 *      déplacent CONTRE la carrière ou au profit d'un camp concurrent. C'est
 *      ce second chiffre qui fait qu'un choix est un arbitrage et pas une
 *      récompense.
 *
 *   6. CE QUE CHAQUE PROFIL DÉBLOQUE. Le nombre d'options réservées à chaque
 *      parcours, tempérament et origine. C'est la mesure la plus utile du
 *      lot : elle dit si la création de personnage engage à quelque chose.
 *      Mesuré la première fois, « Acharné » ouvrait UNE option dans tout le
 *      jeu contre trente-quatre pour « Calculateur ». Choisir un tempérament
 *      ne changeait donc presque rien, ce qu'aucun autre outil ne voyait.
 *
 * CE QU'IL NE DIT PAS. Une option coûteuse n'est pas une option morte : la
 * tension morale du jeu repose sur des gestes qui se paient. Refuser
 * Matignon, s'arrêter avant d'être poussé, écrire ce qu'on pense vraiment
 * doivent coûter. Le filtre ne signale donc que le cas indéfendable, celui
 * où l'on paie SANS RIEN RECEVOIR, fût-ce de la réputation ou du calme.
 *
 * Usage :
 *     node tools/audit-choix.js            # les trois mesures
 *     node tools/audit-choix.js --profils  # seulement la troisième
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2] : path.join(__dirname, "..");
const SEULEMENT_PROFILS = process.argv.includes("--profils");

/* --- Charger les paquets sans DOM ---------------------------------------- */
const dossier = path.join(ROOT, "js/events");
const morceaux = fs.readdirSync(dossier)
  .filter((f) => f.endsWith(".data.js") && f !== "_assemble.data.js")
  .map((f) => fs.readFileSync(path.join(dossier, f), "utf8"));
morceaux.push(fs.readFileSync(path.join(dossier, "_assemble.data.js"), "utf8"));
morceaux.push(fs.readFileSync(path.join(ROOT, "js/traits.data.js"), "utf8"));
morceaux.push("globalThis.__decks = EVENT_DATA; globalThis.__traits = TRAIT_DATA;");
const bac = { console };
vm.createContext(bac);
vm.runInContext(morceaux.join("\n;\n"), bac);
const DECKS = bac.__decks;
const TRAITS = bac.__traits;

/* Dans quel fichier vit chaque scène, pour pouvoir aller la corriger. */
const fichierDe = {};
for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith(".data.js"))) {
  const texte = fs.readFileSync(path.join(dossier, f), "utf8");
  for (const m of texte.matchAll(/"id": "([a-z_0-9]+)"/g)) {
    if (!fichierDe[m[1]]) fichierDe[m[1]] = f.replace(".data.js", "");
  }
}

/* Les grandeurs comparables entre deux options d'une même scène. */
const GRANDEURS = ["popularity", "standing", "score", "poll", "approval", "charisme",
  "eloquence", "energie", "sangfroid", "reseau", "notoriete", "reputation",
  "credibilite", "money"];

/* Tout le reste : un trait, une chaîne, un drapeau, une position. Une option
   qui en porte un n'est jamais « vide », même si tous ses chiffres sont
   négatifs : elle achète quelque chose qui ne se compte pas en points. */
const SEL = ["trait", "untrait", "strike", "chain", "flags", "axis", "appeal",
  "landscape", "lead", "office", "nominate", "alliance", "join", "dissolve", "end"];

function effetsDe(choix) {
  return choix.roll ? (choix.success && choix.success.effects) || {} : choix.effects || {};
}

let problemes = 0;

if (!SEULEMENT_PROFILS) {
  const vides = [], dominees = [];

  for (const [deck, liste] of Object.entries(DECKS)) {
    for (const ev of liste) {
      const libres = (ev.choices || []).filter((c) => !c.when);

      for (const c of libres) {
        if (c.roll) continue;                       // un jet paie son risque
        const e = c.effects || {};
        const chiffres = Object.entries(e).filter(([k]) => GRANDEURS.includes(k));
        const assaisonne = Object.keys(e).some((k) => SEL.includes(k));
        if (chiffres.length && !assaisonne && chiffres.every(([, x]) => x < 0)) {
          vides.push({ deck, id: ev.id, label: c.label.fr, e: JSON.stringify(e) });
        }
      }

      for (let i = 0; i < libres.length; i++) {
        for (let j = 0; j < libres.length; j++) {
          if (i === j || libres[i].roll || libres[j].roll) continue;
          const a = effetsDe(libres[i]), b = effetsDe(libres[j]);
          if (Object.keys(a).some((k) => SEL.includes(k))) continue;
          if (Object.keys(b).some((k) => SEL.includes(k))) continue;
          let mieux = false, jamaisPire = true;
          for (const k of GRANDEURS) {
            const va = a[k] || 0, vb = b[k] || 0;
            if (va < vb) jamaisPire = false;
            if (va > vb) mieux = true;
          }
          if (jamaisPire && mieux) {
            dominees.push({ deck, id: ev.id, perd: libres[j].label.fr, gagne: libres[i].label.fr });
          }
        }
      }
    }
  }

  console.log("== OPTIONS QUI NE RAPPORTENT RIEN (" + vides.length + ") ==");
  vides.forEach((v) => console.log("   " + (v.id + " [" + fichierDe[v.id] + "]").padEnd(42) +
    "« " + v.label + " »  " + v.e));
  console.log("\n== OPTIONS STRICTEMENT DOMINÉES (" + dominees.length + ") ==");
  dominees.forEach((d) => console.log("   " + (d.id + " [" + fichierDe[d.id] + "]").padEnd(42) +
    "« " + d.perd + " »  écrasée par  « " + d.gagne + " »"));
  console.log("");
  problemes = vides.length + dominees.length;
}

/* --- L'option qui gagne quel que soit le barème ---------------------------- */
const MONNAIES = ["popularity", "standing", "score", "approval", "money", "energie",
  "charisme", "eloquence", "sangfroid", "reseau", "notoriete", "reputation",
  "credibilite", "durable"];

/* Un point de statistique ne vaut pas un point de jauge : les statistiques
   sont permanentes, les jauges glissent vers leur cible à chaque tour. */
const ECHELLE = { popularity: 1, standing: 1, score: 1.4, poll: 1.4, approval: 0.5,
  money: 1 / 9000, energie: 2.2, charisme: 3.4, eloquence: 3.4, sangfroid: 3.4,
  reseau: 2.8, notoriete: 2.6, reputation: 3, credibilite: 3.4 };

/* Ce qu'un trait vaut réellement : ses modificateurs permanents de
   statistiques, plus ce qu'il tire sur les cibles des deux jauges. */
function valeurTrait(id) {
  const t = TRAITS[id];
  if (!t) return 0;
  let v = 0;
  for (const [k, x] of Object.entries(t.stats || {})) v += x * (ECHELLE[k] || 0);
  for (const [k, x] of Object.entries(t.target || {})) v += x * 0.9;
  // Un trait sans chiffres n'est pas sans effet : il ouvre ou ferme des
  // scènes. On lui laisse le signe de sa famille, en petit.
  if (!v) v = t.kind === "mark" ? -4 : 4;
  return v;
}

function vecteur(e) {
  const v = {};
  MONNAIES.forEach((a) => (v[a] = 0));
  if (!e) return v;
  for (const [k, x] of Object.entries(e)) {
    if (k === "poll") { v.score += x * ECHELLE.poll; continue; }
    if (ECHELLE[k] !== undefined && typeof x === "number") { v[k] += x * ECHELLE[k]; continue; }
    // UN TRAIT SE PÈSE PAR CE QU'IL CONTIENT, PAS PAR SA COULEUR.
    //
    // Il était compté forfaitairement, plus neuf pour un atout et moins neuf
    // pour une marque. C'est faux pour la moitié d'entre eux : « homme
    // d'appareil » est rangé dans les atouts et donne moins deux de notoriété
    // et moins trois sur la cible de popularité. La mesure le payait comme un
    // cadeau, et signalait donc une scène équilibrée comme écrasée.
    // On additionne maintenant ses statistiques et ses cibles, ce que le
    // moteur applique réellement.
    if (k === "trait") v.durable += valeurTrait(x);
    else if (k === "untrait") v.durable += -valeurTrait(x);
    else if (k === "strike") v.durable += valeurTrait(x) / 3;
    else if (k === "flags") {
      v.durable += Object.entries(x).reduce((a, [f, b]) =>
        a + (["dirtyMoney", "onTrial", "investigated"].includes(f) ? (b ? -16 : 12) : 0), 0);
    } else if (k === "lead") v.durable += x ? 16 : -16;
    // PERDRE UNE FONCTION N'EST PAS UN COÛT UNIQUE, C'EST UN REVENU QUI
    // S'ARRÊTE. Un ministre gagne de la cote et de l'exposition à chaque tour
    // où il l'est ; la mesure ne comptait que le jour du départ, et classait
    // donc « démissionner en choisissant le moment » comme la meilleure
    // réponse à peu près partout.
    else if (k === "office") v.durable += x === "none" ? -26 : 20;
    else if (k === "nominate") v.durable += 9;
    else if (k === "end") v.durable += -40;
    else if (k === "appeal") v.popularity += Object.values(x).reduce((a, b) => a + b, 0) * 0.3;
    else if (k === "landscape") v.durable += (x.self || 0) * 3;
  }
  return v;
}

function vecteurChoix(c) {
  if (!c.roll) return vecteur(c.effects);
  const p = c.roll.chance !== undefined ? c.roll.chance : 0.55;
  const a = vecteur(c.success && c.success.effects);
  const b = vecteur(c.failure && c.failure.effects);
  const v = {};
  MONNAIES.forEach((x) => (v[x] = p * a[x] + (1 - p) * b[x]));
  return v;
}

if (!SEULEMENT_PROFILS) {
  /* Aléa seedé : la mesure doit donner le même chiffre deux fois de suite. */
  let graine = 12345;
  const tirage = () => { graine = (graine * 1103515245 + 12345) & 0x7fffffff; return graine / 0x7fffffff; };
  const baremes = [];
  for (let i = 0; i < 800; i++) {
    const w = {};
    MONNAIES.forEach((a) => (w[a] = Math.pow(tirage(), 2)));
    baremes.push(w);
  }

  const ecrasantes = [];
  let scenes = 0;
  for (const [deck, liste] of Object.entries(DECKS)) {
    for (const ev of liste) {
      /* Une option qui ARRÊTE la partie ne se compare pas aux autres sur des
         monnaies de carrière : se retirer n'est pas une mauvaise affaire, c'est
         une autre partie. On la sort de la comparaison plutôt que de signaler
         éternellement les scènes qui offrent une sortie. */
      const finit = (c) => ["effects", "success", "failure"].some((b) => {
        const e = b === "effects" ? c[b] : c[b] && c[b].effects;
        return e && e.end;
      });
      const libres = (ev.choices || []).filter((c) => !c.when && !finit(c));
      if (libres.length < 2) continue;
      scenes++;
      const V = libres.map(vecteurChoix);
      const gains = new Array(libres.length).fill(0);
      for (const w of baremes) {
        let meilleur = -1e9, lequel = 0;
        V.forEach((v, i) => {
          const note = MONNAIES.reduce((a, x) => a + v[x] * w[x], 0);
          if (note > meilleur) { meilleur = note; lequel = i; }
        });
        gains[lequel]++;
      }
      const part = gains.map((g) => g / baremes.length);
      const max = Math.max(...part);
      if (max >= 0.8) {
        ecrasantes.push({ id: ev.id, max, label: libres[part.indexOf(max)].label.fr });
      }
    }
  }
  ecrasantes.sort((a, b) => b.max - a.max);
  console.log("== UNE OPTION GAGNE SOUS AU MOINS 80 % DES BARÈMES (" +
    ecrasantes.length + " scènes sur " + scenes + ") ==");
  ecrasantes.slice(0, 25).forEach((e) => console.log("   " +
    (e.id + " [" + fichierDe[e.id] + "]").padEnd(40) +
    Math.round(e.max * 100) + "%  « " + e.label + " »"));
  if (ecrasantes.length > 25) console.log("   … et " + (ecrasantes.length - 25) + " autres");
  console.log("");

  /* --- Ce qui entre dans un jet ------------------------------------------- */
  let jets = 0, avecBonus = 0, maigres = 0;
  for (const liste of Object.values(DECKS)) {
    for (const ev of liste) {
      for (const c of ev.choices || []) {
        if (!c.roll) continue;
        jets++;
        const bonus = (c.roll.bonus || c.roll.chanceBonus || []).length;
        if (bonus) avecBonus++;
        const entrees = (c.roll.stat ? 1 : 0) + Object.keys(c.roll.plus || {}).length;
        if (!bonus && entrees <= 2) maigres++;
      }
    }
  }
  /* --- Combien d'options sont des certitudes ------------------------------ */
  let optionsTotal = 0, certitudes = 0, sansAucunJet = 0;
  for (const liste of Object.values(DECKS)) {
    for (const ev of liste) {
      let paris = 0;
      for (const c of ev.choices || []) {
        optionsTotal++;
        if (c.roll) paris++; else certitudes++;
      }
      if (!paris && (ev.choices || []).length >= 2) sansAucunJet++;
    }
  }
  console.log("== LE RISQUE ==");
  console.log("   options écrites                    : " + optionsTotal);
  console.log("   qui sont des certitudes            : " + certitudes +
    "  (" + Math.round((100 * certitudes) / optionsTotal) + " %)");
  console.log("   scènes sans un seul pari           : " + sansAucunJet +
    "   <-- on y choisit sans jamais rien risquer");
  console.log("");

  console.log("== CE QUI ENTRE DANS LES JETS ==");
  console.log("   jets écrits                        : " + jets);
  console.log("   portant un bonus conditionnel      : " + avecBonus +
    "  (" + Math.round((100 * avecBonus) / jets) + " %)");
  console.log("   deux entrées au plus, aucun bonus  : " + maigres +
    "  (" + Math.round((100 * maigres) / jets) + " %)   <-- ne récompensent qu'un profil");
  console.log("");

  /* --- Le rapport de force ------------------------------------------------ */
  let branches = 0, avecPaysage = 0, arbitrage = 0, profiteAutre = 0;
  for (const liste of Object.values(DECKS)) {
    for (const ev of liste) {
      for (const c of ev.choices || []) {
        for (const b of ["effects", "success", "failure", "triumph", "debacle"]) {
          const e = b === "effects" ? c[b] : c[b] && c[b].effects;
          if (!e) continue;
          branches++;
          if (!e.landscape) continue;
          avecPaysage++;
          const self = e.landscape.self || 0;
          const carriere = (e.standing || 0) + (e.popularity || 0) * 0.5;
          if (self && carriere && Math.sign(self) !== Math.sign(carriere)) arbitrage++;
          if (Object.entries(e.landscape).some(([t, n]) => t !== "self" && n > 0)) profiteAutre++;
        }
      }
    }
  }
  console.log("== LE RAPPORT DE FORCE ==");
  console.log("   branches d'effets                  : " + branches);
  console.log("   qui le déplacent                   : " + avecPaysage +
    "  (" + Math.round((100 * avecPaysage) / branches) + " %)");
  console.log("   dont il va CONTRE la carrière      : " + arbitrage);
  console.log("   dont un autre camp y gagne aussi   : " + profiteAutre);
  console.log("");
}

/* --- Ce que chaque profil débloque --------------------------------------- */
const compte = { background: {}, personality: {}, origin: {}, trait: {}, stat: {} };
let scenesTirees = 0, scenesQuiDemandent = 0;

for (const liste of Object.values(DECKS)) {
  for (const ev of liste) {
    if ((ev.weight === undefined ? 2 : ev.weight) === 0) continue;   // chaînes exclues
    scenesTirees++;
    let demande = false;
    for (const c of ev.choices || []) {
      if (!c.when) continue;
      for (const [clef, seau] of [["background", "background"], ["personality", "personality"],
        ["origin", "origin"], ["trait", "trait"], ["anyTrait", "trait"]]) {
        if (!c.when[clef]) continue;
        demande = true;
        for (const v of [].concat(c.when[clef])) compte[seau][v] = (compte[seau][v] || 0) + 1;
      }
      if (c.when.stat) {
        demande = true;
        for (const k of Object.keys(c.when.stat)) compte.stat[k] = (compte.stat[k] || 0) + 1;
      }
    }
    if (demande) scenesQuiDemandent++;
  }
}

const CATALOGUE = {
  background: ["law", "business", "journalism", "activism", "civil", "academia", "celebrity", "comms"],
  personality: ["hardworking", "charming", "clever", "provocative", "principled", "calculating"],
  origin: ["modest", "middle", "bourgeois", "dynasty"],
};

for (const [categorie, valeurs] of Object.entries(CATALOGUE)) {
  console.log("== " + categorie.toUpperCase() + " : OPTIONS DÉBLOQUÉES ==");
  const paires = valeurs.map((v) => [v, compte[categorie][v] || 0]).sort((a, b) => a[1] - b[1]);
  paires.forEach(([v, n]) => console.log("   " + v.padEnd(14) + String(n).padStart(3)));
  // Un écart de plus de six entre le premier et le dernier veut dire qu'une
  // moitié du menu de création ne se choisit pas pour de vraies raisons.
  const ecart = paires[paires.length - 1][1] - paires[0][1];
  console.log("   écart " + ecart + (ecart > 6 ? "   <-- à combler" : ""));
  console.log("");
}

console.log("== STATISTIQUES QUI DÉBLOQUENT ==");
Object.entries(compte.stat).sort((a, b) => b[1] - a[1])
  .forEach(([v, n]) => console.log("   " + v.padEnd(14) + n));

console.log("\n== TRAITS QUI DÉBLOQUENT ==");
Object.entries(compte.trait).sort((a, b) => b[1] - a[1])
  .forEach(([v, n]) => console.log("   " + v.padEnd(20) + n));

console.log("\nScènes tirées qui demandent quelque chose du personnage : " +
  scenesQuiDemandent + " / " + scenesTirees +
  "  (" + Math.round((100 * scenesQuiDemandent) / scenesTirees) + " %)");

process.exit(problemes ? 1 : 0);
