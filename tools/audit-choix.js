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
 *   3. CE QUE CHAQUE PROFIL DÉBLOQUE. Le nombre d'options réservées à chaque
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
morceaux.push("globalThis.__decks = EVENT_DATA;");
const bac = { console };
vm.createContext(bac);
vm.runInContext(morceaux.join("\n;\n"), bac);
const DECKS = bac.__decks;

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
