/*
 * President Material — page de choix du parti (party.html).
 *
 * Relit le personnage enregistré à l'étape précédente et affiche les
 * partis avec deux indicateurs distincts :
 *   - la COMPATIBILITÉ, qui dépend du profil du personnage ;
 *   - la DIFFICULTÉ, propriété du parti (la route vers le pouvoir).
 * Les données et les calculs sont dans js/data.js.
 */

const character = loadCharacter();

// Page atteinte sans personnage : on renvoie à l'étape précédente.
if (!character) {
  window.location.replace("create.html");
}

const partyForm = document.getElementById("party-form");
const partyGrid = document.getElementById("party-grid");

/** Parti actuellement coché, ou le premier de la liste au premier passage. */
function selectedParty() {
  const checked = partyGrid.querySelector("input[name=party]:checked");
  return checked ? checked.value : character.party || Object.keys(PARTIES)[0];
}

/** Le profil complet, personnage plus parti retenu. */
function currentChoices() {
  return { ...character, party: selectedParty() };
}

/** Position d'un curseur d'axe, de 0 % (pôle gauche) à 100 % (pôle droit). */
function axisPercent(value) {
  return (value + 100) / 2;
}

/**
 * Positionnement sur la carte, en étiquettes plutôt qu'en graphique.
 *
 * Chaque pôle marqué donne une étiquette avec son icône. Un axe sur lequel
 * le parti n'a pas de position n'apparaît pas du tout : l'absence est
 * l'information. On lit ainsi un parti comme une liste de positions
 * tenues, et la fiche de droite garde les jauges précises.
 */
const NEUTRAL_THRESHOLD = 12;

/** Une icône par pôle, en traits simples pour rester lisible à 13 pixels. */
const AXIS_ICONS = {
  // Société : la flèche qui avance contre la colonne qui tient
  social_left:  '<path d="M5 19L19 5"/><path d="M10 5h9v9"/>',
  social_right: '<path d="M5 4h14"/><path d="M5 20h14"/><path d="M9 4v16"/><path d="M15 4v16"/>',

  // Monde : le globe contre le drapeau
  world_left:  '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><ellipse cx="12" cy="12" rx="4" ry="8.5"/>',
  world_right: '<path d="M6 21V4"/><path d="M6 4.5h11l-2.5 3.5 2.5 3.5H6"/>',

  // Économie : le collectif contre le capital
  economy_left:  '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0111 0"/><path d="M16.5 6.6a3 3 0 010 5.8"/><path d="M20.5 19a5.2 5.2 0 00-3.4-4.6"/>',
  economy_right: '<ellipse cx="12" cy="6.5" rx="7" ry="2.8"/><path d="M5 6.5v11c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-11"/><path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8"/>',

  // Pouvoir : le cadenas fermé contre le cadenas ouvert
  power_left:  '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8.5 11V7.5a3.5 3.5 0 017 0V11"/>',
  power_right: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8.5 11V7.5a3.5 3.5 0 017 0"/>',
};

function axisIcon(pole) {
  return (
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"' +
      ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      AXIS_ICONS[pole] +
    "</svg>"
  );
}

function partyTags(key) {
  const axes = PARTIES[key].axes;

  return AXES.map((axis) => {
    const value = axes[axis];
    if (Math.abs(value) < NEUTRAL_THRESHOLD) return "";

    const pole = axis + (value < 0 ? "_left" : "_right");
    return (
      '<span class="tag">' + axisIcon(pole) +
        "<span>" + t("axis_" + pole) + "</span>" +
      "</span>"
    );
  }).join("");
}

/** Cinq points de difficulté, remplis selon la note du parti. */
function difficultyDots(key) {
  const level = PARTIES[key].difficulty;
  const label = t("difficulty_label") + t("colon") + t("difficulty_" + level);

  let dots = "";
  for (let i = 1; i <= 5; i++) {
    dots += '<span class="diff-dot' + (i <= level ? " on" : "") + '"></span>';
  }

  return (
    '<span class="diff-dots diff-' + level + '" role="img"' +
      ' title="' + label + '" aria-label="' + label + '">' + dots + "</span>"
  );
}

/**
 * Construit les cartes à partir de PARTIES : ajouter un parti ne demande
 * qu'une entrée dans les données et ses deux traductions.
 */
function buildPartyCards() {
  const selected = selectedParty();

  partyGrid.innerHTML = Object.keys(PARTIES).map((key) =>
    '<label class="party-row" style="--tint:var(--p-' + key + ')">' +
      '<input type="radio" name="party" value="' + key + '"' +
        (key === selected ? " checked" : "") + ">" +
      '<span class="party-face">' +
        '<span class="party-top">' +
          '<span class="party-name">' + t("party_" + key) + "</span>" +
          '<span class="fit-badge" data-fit-for="' + key + '"></span>' +
        "</span>" +
        '<span class="party-diff">' +
          '<span class="party-diff-label">' + t("difficulty_label") + "</span>" +
          difficultyDots(key) +
        "</span>" +
        '<span class="party-tags">' + partyTags(key) + "</span>" +
      "</span>" +
    "</label>"
  ).join("");
}

/** Pastilles de compatibilité : elles dépendent du personnage, pas du parti coché. */
function renderFitBadges() {
  document.querySelectorAll("[data-fit-for]").forEach((badge) => {
    const level = fitLevel(computeFit(badge.getAttribute("data-fit-for"), character));
    badge.textContent = t(level.key);
    badge.className = "fit-badge " + level.cls;
  });
}

/** Description du parti sélectionné, sous la grille. */
function renderPartyDesc() {
  document.getElementById("party-desc").textContent =
    t("party_" + selectedParty() + "_desc");
}

/** Détaille le parti retenu dans la fiche : axes, difficulté, compatibilité. */
function renderPartyPanel() {
  const key = selectedParty();
  const party = PARTIES[key];

  document.getElementById("sheet-party-name").textContent = t("party_" + key);
  // La fiche de droite prend la couleur du camp qu'on est en train de choisir.
  document.body.dataset.party = key;
  document.getElementById("sheet-party-name").style.setProperty("--tint", "var(--p-" + key + ")");

  document.getElementById("sheet-axes").innerHTML = AXES.map((axis) => {
    const value = party.axes[axis];
    const leaning = value < 0 ? "axis_" + axis + "_left" : "axis_" + axis + "_right";

    return (
      '<div class="sheet-axis">' +
        '<div class="sheet-axis-labels">' +
          "<span>" + t("axis_" + axis + "_left") + "</span>" +
          "<span>" + t("axis_" + axis + "_right") + "</span>" +
        "</div>" +
        '<div class="axis-track" role="img" aria-label="' + t(leaning) + '">' +
          '<span class="axis-dot" style="left:' + axisPercent(value) + '%"></span>' +
        "</div>" +
      "</div>"
    );
  }).join("");

  const diff = document.getElementById("sheet-diff");
  diff.innerHTML =
    t("difficulty_label") + t("colon") + t("difficulty_" + party.difficulty) +
    " " + difficultyDots(key);
  diff.className = "sheet-diff diff-" + party.difficulty;

  const level = fitLevel(computeFit(key, character));
  const fit = document.getElementById("sheet-fit");
  fit.textContent = t("fit_label") + t("colon") + t(level.key);
  fit.className = "sheet-fit " + level.cls;
}

function refresh() {
  renderPartyDesc();
  renderPartyPanel();
}

/** Reconstruit ce qui contient du texte traduit, puis rafraîchit. */
function renderAll() {
  buildStatRows();
  renderCharacterSheet(character);
  buildPartyCards();
  renderFitBadges();
  refresh();
}

if (character) {
  partyForm.addEventListener("change", refresh);

  // Personnage et parti choisis : la partie peut commencer.
  partyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Le tirage se fait ici, une fois, et voyage avec le personnage : la page
    // suivante ne fait que le montrer, et la partie ne fait que l'appliquer.
    // La main se tire une fois pour un personnage. Repasser par cette page
    // pour changer de parti ne redistribue pas les cartes : le physique et le
    // caractère ne dépendent pas du parti qu'on rejoint.
    saveCharacter({ ...currentChoices(), draw: (character && character.draw) || drawBirthTraits() });
    localStorage.removeItem("pm-game"); // repartir de zéro, pas d'ancienne partie
    window.location.href = "tirage.html";
  });

  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("languagechange", renderAll);
}
