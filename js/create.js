/*
 * President Material — page de création de personnage (create.html).
 *
 * Gère le formulaire, le générateur de noms et la fiche en direct.
 * Les données et les calculs sont dans js/data.js.
 * À la validation, le personnage est enregistré puis on passe au parti.
 */

const form = document.getElementById("character-form");
const nameInput = document.getElementById("char-name");
const randomNameBtn = document.getElementById("random-name");

/** Lit l'état actuel du formulaire. */
function readChoices() {
  const data = new FormData(form);
  return {
    name: (data.get("name") || "").trim(),
    sex: data.get("sex"),
    origin: data.get("origin"),
    background: data.get("background"),
    personality: data.get("personality"),
  };
}

/* Panneaux de description : une seule zone de texte par section. */
const DESC_PANELS = [
  { id: "origin-desc", field: "origin", prefix: "origin_" },
  { id: "background-desc", field: "background", prefix: "bg_" },
  { id: "personality-desc", field: "personality", prefix: "perso_" },
];

function renderDescs(choices) {
  DESC_PANELS.forEach((panel) => {
    document.getElementById(panel.id).textContent =
      t(panel.prefix + choices[panel.field] + "_desc");
  });
}

function refresh() {
  const choices = readChoices();
  renderDescs(choices);
  renderCharacterSheet(choices);
}

/** Reconstruit ce qui contient du texte traduit, puis rafraîchit. */
function renderAll() {
  buildStatRows();
  refresh();
}

form.addEventListener("input", refresh);
form.addEventListener("change", refresh);

// Bouton dé : propose un nom différent de celui déjà affiché.
randomNameBtn.addEventListener("click", () => {
  const sex = readChoices().sex;
  let name = randomName(sex);

  for (let i = 0; i < 5 && name === nameInput.value; i++) {
    name = randomName(sex);
  }

  nameInput.value = name;
  randomNameBtn.classList.remove("is-rolling");
  void randomNameBtn.offsetWidth; // relance l'animation du dé
  randomNameBtn.classList.add("is-rolling");
  refresh();
});

// Étape suivante : on garde le personnage et on passe au choix du parti.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCharacter(readChoices());
  window.location.href = "party.html";
});

document.addEventListener("DOMContentLoaded", renderAll);
document.addEventListener("languagechange", renderAll);
