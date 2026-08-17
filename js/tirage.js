/*
 * President Material — la page du tirage (tirage.html).
 *
 * Entre le choix du parti et la première décision, le jeu montre ce qu'il a
 * distribué : le caractère choisi et les deux traits tirés au sort, avec leur
 * description et leurs effets en clair.
 *
 * Cette page ne tire rien elle-même. La main est tirée au moment où le parti
 * est validé (js/party.js) et voyage avec le personnage, pour qu'un
 * rechargement ne redistribue pas les cartes : on ne rejoue pas un tirage
 * parce qu'il ne plaît pas.
 */

const character = loadCharacter();

// Sans personnage ni parti, il n'y a rien à tirer : on renvoie au début.
if (!character || !character.party) {
  window.location.replace("create.html");
}

/** La main du personnage, retirée seulement si elle manque vraiment. */
function currentDraw() {
  if (character.draw && character.draw.traits && character.draw.traits.length) {
    return character.draw;
  }
  character.draw = drawBirthTraits();
  saveCharacter(character);
  return character.draw;
}

/**
 * Un trait, présenté en grand : son nom, d'où il vient, ce qu'il raconte et
 * ce qu'il change. C'est le seul écran du jeu où l'on prend le temps de tout
 * dire, parce que c'est le seul moment où le joueur n'a rien décidé.
 */
function traitCardHTML(id, tire) {
  const def = TRAIT_DATA[id];
  if (!def) return "";

  return (
    '<div class="draw-trait draw-' + (def.kind === "asset" ? "asset" : "mark") + '">' +
      '<p class="draw-trait-head">' +
        '<span class="draw-trait-name">' + L(def.label) + "</span>" +
        '<span class="draw-trait-tag">' + t(tire ? "draw_dealt" : "draw_chosen") + "</span>" +
      "</p>" +
      '<p class="draw-trait-desc">' + L(def.desc) + "</p>" +
      '<p class="draw-trait-fx">' + traitEffects(def) + "</p>" +
    "</div>"
  );
}

/**
 * Ce qu'un trait change, écrit depuis ses données. La page de jeu a sa propre
 * version, qui connaît le parti du joueur ; ici on s'en tient à ce qui vaut
 * partout, plus ce que le parti choisi ajoute.
 */
function traitEffects(def) {
  const parts = [];
  const signe = (n) => (n > 0 ? "+" : "−") + String(Math.abs(n)).replace(".", ",");

  if (def.stats) {
    Object.entries(def.stats).forEach(([stat, v]) => parts.push(t("stat_" + stat) + " " + signe(v)));
  }
  if (def.target) {
    Object.entries(def.target).forEach(([gauge, v]) =>
      parts.push(t(gauge === "popularity" ? "label_popularity" : "label_standing") + " " + signe(v)));
  }
  if (def.partyTarget && def.partyTarget[character.party]) {
    Object.entries(def.partyTarget[character.party]).forEach(([gauge, v]) =>
      parts.push(t(gauge === "popularity" ? "label_popularity" : "label_standing") + " " + signe(v)));
  }
  if (def.energy) parts.push(t("fx_energy_cap") + " " + signe(def.energy * 2));
  if (def.soften) parts.push(t("trait_fx_soften") + " " + Math.round(def.soften * 100) + " %");
  if (def.rejection) {
    parts.push(t("trait_fx_rejection") + " " + signe(Math.round(def.rejection * 100)) + " %");
  }
  if (def.risk) parts.push(t("trait_fx_risk"));

  return parts.join(" · ");
}

function renderAll() {
  if (!character || !character.party) return;

  const draw = currentDraw();

  document.getElementById("draw-name").textContent = character.name || t("sheet_name_empty");
  document.getElementById("draw-meta").textContent =
    t("sex_" + character.sex) + " · " + t("start_age") + " · " +
    t("origin_" + character.origin) + " · " + t("party_" + character.party);
  document.getElementById("draw-intro").textContent = t("draw_mix_" + draw.mix);

  document.getElementById("draw-cards").innerHTML =
    traitCardHTML(character.personality, false) +
    draw.traits.map((id) => traitCardHTML(id, true)).join("");
}

document.addEventListener("DOMContentLoaded", renderAll);
document.addEventListener("languagechange", renderAll);
