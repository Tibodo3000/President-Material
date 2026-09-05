/*
 * President Material — LA VITRINE DES DISTINCTIONS.
 *
 * Dessine la section « Distinctions » de la page d'accueil à partir de
 * ACHIEVEMENT_DATA, et se souvient de ce qui a été obtenu.
 *
 * Ce fichier ne décide de rien : il ne sait pas ce qui mérite une médaille,
 * seulement laquelle est déjà au mur. C'est le moteur qui décerne, en
 * appelant `unlockAchievement()`.
 *
 * Chargé par index.html après script.js, pour que `L()` soit disponible.
 * game.html ne le charge pas encore : il le fera le jour où le moteur aura
 * quelque chose à décerner.
 */

/* Une quatrième clé de stockage, à côté de pm-lang, pm-character et pm-game.
   Celle-ci ne se vide pas au début d'une partie : c'est justement ce qui la
   distingue des trois autres. */
const ACHIEVEMENT_KEY = "pm-achievements";

/* Le nombre de cases de la vitrine quand il y a moins de distinctions que ça.
   Une vitrine à moitié montée n'a l'air de rien ; une vitrine dont les
   emplacements attendent leurs médailles se lit tout de suite. */
const ACHIEVEMENT_SLOTS = 8;

/** Les identifiants déjà obtenus, dans l'ordre où ils l'ont été. */
function unlockedAchievements() {
  try {
    const raw = JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    // Un stockage illisible ne doit pas empêcher la page de s'afficher :
    // le joueur perd son palmarès, pas sa partie.
    return [];
  }
}

/**
 * Décerne une distinction. Sans effet si elle l'est déjà, ou si l'identifiant
 * ne correspond à rien : on ne veut pas d'une médaille orpheline au mur le
 * jour où une entrée est retirée des données.
 *
 * Renvoie true si c'est une première fois, pour que l'appelant puisse
 * l'annoncer au joueur.
 */
function unlockAchievement(id) {
  if (!ACHIEVEMENT_DATA.some((a) => a.id === id)) return false;

  const acquis = unlockedAchievements();
  if (acquis.includes(id)) return false;

  acquis.push(id);
  try {
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(acquis));
  } catch (e) {
    return false;
  }
  return true;
}

/** Échappe le texte des données, qui n'a aucune raison de porter du HTML. */
function achEscape(texte) {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Une case de la vitrine : médaille, nom, indice. */
function achievementTile(distinction, obtenue) {
  // Une distinction secrète non obtenue ne dit pas même son nom : la vitrine
  // montre qu'il manque quelque chose, pas quoi.
  const secrete = distinction.secret && !obtenue;

  const titre = secrete ? t("ach_secret_title") : L(distinction.title);
  const ligne = secrete
    ? t("ach_secret_hint")
    : L(obtenue && distinction.note ? distinction.note : distinction.hint);

  return (
    '<li class="ach-tile' +
    (obtenue ? " is-earned" : "") +
    (secrete ? " is-secret" : "") +
    '">' +
    '<span class="ach-medal" aria-hidden="true">' +
    (secrete ? "?" : "★") +
    "</span>" +
    '<p class="ach-name">' + achEscape(titre) + "</p>" +
    '<p class="ach-hint">' + achEscape(ligne) + "</p>" +
    "</li>"
  );
}

/** Une case vide : la vitrine est montée, la médaille n'est pas écrite. */
function achievementSlot() {
  return (
    '<li class="ach-tile is-slot" aria-hidden="true">' +
    '<span class="ach-medal">★</span>' +
    "</li>"
  );
}

/**
 * Redessine la vitrine. Appelée au chargement et à chaque changement de
 * langue, puisque tous les textes viennent des données.
 */
function renderAchievements() {
  const grille = document.getElementById("ach-grid");
  if (!grille) return;

  const acquis = unlockedAchievements();
  const total = ACHIEVEMENT_DATA.length;
  const nombre = ACHIEVEMENT_DATA.filter((a) => acquis.includes(a.id)).length;

  const cases = ACHIEVEMENT_DATA.map((a) =>
    achievementTile(a, acquis.includes(a.id))
  );
  for (let i = cases.length; i < ACHIEVEMENT_SLOTS; i++) cases.push(achievementSlot());
  grille.innerHTML = cases.join("");

  // Le compteur ne s'affiche que s'il y a quelque chose à compter. Un
  // « 0 sur 0 » ne dit rien à personne.
  const compteur = document.getElementById("ach-meter");
  if (compteur) {
    compteur.hidden = total === 0;
    if (total > 0) {
      const valeur = compteur.querySelector(".ach-count");
      const barre = compteur.querySelector(".ach-bar-fill");
      if (valeur) valeur.textContent = nombre + " / " + total;
      if (barre) barre.style.width = Math.round((nombre / total) * 100) + "%";
    }
  }

  const vide = document.getElementById("ach-empty");
  if (vide) vide.hidden = total !== 0;
}

document.addEventListener("DOMContentLoaded", renderAchievements);
document.addEventListener("languagechange", renderAchievements);
