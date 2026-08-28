/*
 * President Material — QUI RÉAGIT, DANS CHAQUE SCÈNE.
 *
 * À quoi ça sert. La popularité n'est pas un nombre, c'est six : un électorat
 * par parti. Un effet "popularity" nu les touche tous les six du même montant,
 * en penchant même LÉGÈREMENT VERS LES SIENS (APPEAL_TILT). C'est ce qu'il
 * faut pour une gaffe ou un plateau réussi, et c'est une faute pour tout geste
 * qui vise quelqu'un : refuser une alliance à un camp, humilier le chef d'en
 * face, censurer le gouvernement dont on était. Écrite en popularité nue, la
 * scène fait monter la cote chez ceux-là mêmes qu'elle vient de viser, et
 * raconte donc le contraire de son propre texte de résultat.
 *
 * Rien ne plante, rien ne prévient : le nombre monte, la carte affiche
 * « popularité générale +4 », et l'incohérence ne se voit qu'à la lecture.
 * D'où ce fichier, qui la cherche à la place du relecteur.
 *
 * CE QU'IL SAIT VOIR. Une seule chose, mais sans faux positif : un gain de
 * popularité nue dans un bloc d'effets qui, par ailleurs, prend des points au
 * paysage d'un camp nommé ("landscape" négatif sur scene, ruling ou ally) ou
 * signe, rompt, ou traverse. Le contenu déclare lui-même qui il vise ; il
 * suffit de vérifier que l'opinion suit.
 *
 * CE QU'IL SIGNALE SANS TRANCHER (option --relire). Les scènes où le pays
 * applaudit pendant que l'appareil encaisse : une popularité nue et une grosse
 * perte de cote au parti. La plupart sont justes — c'est l'arbitrage central du
 * jeu, plaire au pays coûte à la maison — mais c'est là que se cachent les
 * dernières, celles où ce n'est pas l'appareil qui en veut au joueur, c'est son
 * propre électorat. Aucune n'est une faute en soi : à lire, pas à corriger.
 *
 * Usage :
 *
 *     node tools/audit-popularite.js            # depuis la racine
 *     node tools/audit-popularite.js --relire   # avec la liste à relire
 *     node tools/audit-popularite.js /chemin    # ou en précisant la racine
 *
 * Voir wiki/content-authoring.md, « Who reacts, not just by how much ».
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const args = process.argv.slice(2);
const RELIRE = args.includes("--relire");
const ROOT = args.find((a) => !a.startsWith("--")) || path.join(__dirname, "..");

/* On charge ce que charge game.html, dans le même ordre : les données suffisent. */
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
const DECKS = vm.runInContext("EVENT_DATA", ctx);

/* Le fichier de chaque scène, pour qu'on sache où aller la corriger. */
const FICHIERS = {};
for (const f of fs.readdirSync(path.join(ROOT, "js/events")).filter((n) => n.endsWith(".data.js"))) {
  const src = fs.readFileSync(path.join(ROOT, "js/events", f), "utf8");
  for (const m of src.matchAll(/"id":\s*"([^"]+)"/g)) if (!FICHIERS[m[1]]) FICHIERS[m[1]] = f;
}

const BRANCHES = ["success", "failure", "triumph", "debacle"];

/** Tous les blocs d'effets d'un choix, avec le nom de leur branche. */
function blocs(choix) {
  const out = [];
  if (choix.effects) out.push(["", choix.effects, choix]);
  (choix.effectsIf || []).forEach((e, i) => out.push(["si" + i, e.effects, choix]));
  for (const b of BRANCHES) {
    if (!choix[b]) continue;
    if (choix[b].effects) out.push([b, choix[b].effects, choix[b]]);
    (choix[b].effectsIf || []).forEach((e, i) => out.push([b + ".si" + i, e.effects, choix[b]]));
  }
  return out;
}

const CAMPS = ["scene", "ruling", "ally"];
const nue = (fx) => fx.popularity !== undefined && fx.axis === undefined && fx.appeal === undefined;
const viseUnCamp = (fx) => {
  const paysage = fx.landscape || {};
  return CAMPS.some((c) => paysage[c] < 0) || fx.alliance !== undefined || fx.join !== undefined;
};

const court = (s, n) => (s || "").replace(/\s+/g, " ").slice(0, n);
const fautes = [];
const relire = [];
const compte = { nue: 0, position: 0, visee: 0 };

for (const [deck, scenes] of Object.entries(DECKS)) {
  for (const ev of scenes) {
    (ev.choices || []).forEach((choix, i) => {
      blocs(choix).forEach(([branche, fx, source]) => {
        if (fx.popularity !== undefined || fx.appeal !== undefined) {
          if (fx.axis !== undefined) compte.position++;
          else if (fx.appeal !== undefined) compte.visee++;
          else compte.nue++;
        }
        if (!nue(fx)) return;

        const ou = (FICHIERS[ev.id] || deck) + " · " + ev.id + " · choix " + i +
          (branche ? " · " + branche : "");
        const dit = "« " + court(choix.label && choix.label.fr, 60) + " » → " +
          court(source && source.result && source.result.fr, 90);

        if (fx.popularity > 0 && viseUnCamp(fx)) {
          fautes.push(ou + "\n    popularité nue +" + fx.popularity +
            " dans un geste qui vise un camp : " + JSON.stringify(fx.landscape || {}) +
            (fx.alliance !== undefined ? " alliance" : "") + (fx.join !== undefined ? " join" : "") +
            "\n    " + dit);
        } else if (RELIRE && fx.popularity >= 5 && fx.standing <= -8) {
          relire.push(ou + "\n    popularité nue +" + fx.popularity + ", cote " + fx.standing +
            "\n    " + dit);
        }
      });
    });
  }
}

if (fautes.length) {
  console.log("À CORRIGER — l'opinion ne suit pas ce que la scène déclare viser :\n");
  fautes.forEach((f) => console.log("  " + f + "\n"));
}

if (RELIRE && relire.length) {
  console.log("À RELIRE — le pays applaudit pendant que l'appareil encaisse. C'est presque");
  console.log("toujours juste ; vérifier seulement que ce n'est pas l'électorat du camp qui\n" +
              "en veut au joueur, auquel cas il faut un \"appeal\": { \"self\": … }.\n");
  relire.forEach((r) => console.log("  " + r + "\n"));
}

const total = compte.nue + compte.position + compte.visee;
console.log("Opinion : " + total + " blocs, dont " + compte.position + " positionnés (axis) et " +
  compte.visee + " visés (appeal). " +
  (fautes.length ? fautes.length + " à corriger." : "Rien à signaler.") +
  (RELIRE ? "" : " (--relire pour la liste à relire.)"));

process.exit(fautes.length ? 1 : 0);
