/*
 * RENDU — LES TROIS PANNEAUX SOUS LA CARTE.
 *
 * DEUX RAPPORTS DE FORCE, ET CE NE SONT PAS LES MÊMES. « Le pouvoir » montre
 * ce que les camps TIENNENT — l'exécutif, l'hémicycle, la majorité et le bloc
 * qui vote les textes. « Dans l'opinion » montre ce qu'ils PÈSENT — les
 * intentions de vote, leurs tendances, et les figures qui les incarnent. On
 * peut dominer l'une sans l'autre, et c'est tout l'intérêt de les séparer.
 *
 * L'HÉMICYCLE EST DESSINÉ, PAS ÉCRIT. Cinq cent soixante-dix-sept sièges en
 * arcs concentriques, rangés de la gauche à la droite de la salle : un
 * tableau de nombres ne dit pas si une majorité tient, un demi-cercle le dit
 * d'un coup d'œil. Aucune dépendance : c'est du HTML positionné en CSS.
 *
 * Le journal ferme la colonne : ce que la partie a retenu, du plus récent au
 * plus ancien.
 */

function trendHTML(key) {
  const before = game.landscapeBefore && game.landscapeBefore[key];
  if (before === undefined) return "";

  const delta = game.landscape[key] - before;
  if (Math.abs(delta) < 0.5) return "";

  return '<span class="force-trend ' + (delta > 0 ? "is-up" : "is-down") + '">' +
    (delta > 0 ? "▲" : "▼") + Math.abs(delta).toFixed(1) + "</span>";
}

const HEMICYCLE_ORDER = ["radical_left", "socdem", "centrists", "liberals", "conservatives", "identitarians"];

/** Combien de rangées de bancs. Dix se lisent ; vingt font un moiré. */
const HEMICYCLE_ROWS = 10;

/**
 * Place les 577 sièges en arcs concentriques. Chaque rangée reçoit un nombre
 * de sièges proportionnel à son rayon, sans quoi les rangées du fond seraient
 * aussi serrées que celles du premier rang.
 */
function hemicycleSeats() {
  const rInt = 40, rExt = 98;
  const rayons = [];
  for (let i = 0; i < HEMICYCLE_ROWS; i++) {
    rayons.push(rInt + (rExt - rInt) * (i / (HEMICYCLE_ROWS - 1)));
  }

  const sommeRayons = rayons.reduce((s, r) => s + r, 0);
  const parRangee = rayons.map((r) => Math.max(1, Math.round((r / sommeRayons) * ASSEMBLY_SEATS)));

  // L'arrondi ne tombe pas juste : on ajuste sur la rangée du fond.
  let total = parRangee.reduce((s, n) => s + n, 0);
  parRangee[parRangee.length - 1] += ASSEMBLY_SEATS - total;

  // Chaque siège reçoit son angle. On parcourt rangée par rangée, mais on
  // trie ensuite par angle pour que les partis se posent bien de gauche à
  // droite à travers toutes les rangées.
  const places = [];
  rayons.forEach((rayon, i) => {
    const n = parRangee[i];
    for (let j = 0; j < n; j++) {
      const angle = Math.PI * (n === 1 ? 0.5 : j / (n - 1));
      places.push({ angle, rayon });
    }
  });

  places.sort((a, b) => b.angle - a.angle);
  return places;
}

function hemicycleHTML() {
  if (!game.assembly) return "";

  const places = hemicycleSeats();
  const couleurs = [];
  HEMICYCLE_ORDER.forEach((key) => {
    for (let i = 0; i < (game.assembly[key] || 0); i++) couleurs.push(key);
  });

  const points = places.map((p, i) => {
    const key = couleurs[i] || HEMICYCLE_ORDER[0];
    const x = 100 + Math.cos(p.angle) * p.rayon;
    const y = 104 - Math.sin(p.angle) * p.rayon;
    return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
      '" r="2.6" fill="var(--p-' + key + ')" />';
  }).join("");

  return '<svg class="hemicycle" viewBox="0 0 200 112" role="img" aria-label="' +
    t("label_assembly") + '">' + points + "</svg>";
}

/**
 * LE PRÉSIDENT N'EST PAS L'ÉGAL DE SON PREMIER MINISTRE.
 *
 * Les deux fonctions étaient présentées côte à côte, deux fiches de même
 * taille, comme deux champs d'un même formulaire. C'est faux sur le fond :
 * sous la Cinquième République, l'un est élu par le pays et l'autre est
 * nommé par lui. Et c'était plat à regarder, parce que deux blocs de poids
 * égal ne font aucune composition.
 *
 * L'Élysée prend donc la place d'un titre, dans la serif d'affichage, avec
 * la mise en page que le jeu emploie déjà pour présenter quelqu'un : le
 * surtitre en petites capitales, le nom, la ligne de contexte en dessous.
 * Matignon suit sur une ligne, à sa place. La couleur du camp éclaire le
 * fond, comme l'or éclaire la fiche du candidat.
 */
function renderExecutive(president, pm, nature) {
  const parti = president ? president.party : (pm ? pm.party : game.party);
  const mandat = game.presidentTerms >= 2 ? t("term_second") : t("term_first");

  const matignon = pm
    ? '<p class="exec-pm">' +
        '<span class="exec-pm-label">' + fillGender(t("label_pm"), pm) + "</span>" +
        '<span class="exec-pm-name' + (pm.isPlayer ? " is-mine" : "") + '">' + pm.name +
          (pm.party !== parti
            ? ' <span style="color:var(--p-' + pm.party + ')">' + t("party_" + pm.party) + "</span>"
            : "") + "</span>" +
      "</p>"
    : '<p class="exec-pm"><span class="exec-pm-label">' + t("label_pm") +
        '</span><span class="exec-pm-name">' + t("president_vacant") + "</span></p>";

  return (
    '<div class="exec" style="--tint:var(--p-' + parti + ')">' +
      '<div class="exec-head">' +
        '<p class="exec-office">' + fillGender(t("label_president"), president) + "</p>" +
        '<p class="exec-person' + (president && president.isPlayer ? " is-mine" : "") + '">' +
          (president ? president.name : t("president_vacant")) + "</p>" +
        (president
          ? '<p class="exec-meta">' + t("party_" + president.party) + " · " + mandat + "</p>"
          : "") +
      "</div>" +
      matignon +
      (nature ? '<p class="exec-kind is-' + nature + '">' + t("gov_" + nature) + "</p>" : "") +
      '<div class="exec-approval">' +
        '<span class="exec-approval-label">' + t("label_approval") + "</span>" +
        '<span class="power-track"><span class="power-fill" style="width:' +
          Math.round(game.approval) + '%"></span></span>' +
        '<span class="exec-approval-value">' + Math.round(game.approval) + "%</span>" +
      "</div>" +
    "</div>"
  );
}

/**
 * L'ONGLET DU POUVOIR. Qui est à l'Élysée, qui est à Matignon, de quelle
 * nature est le gouvernement, ce que le pays en pense, et ce qu'il peut
 * faire voter. C'est l'onglet qu'on ouvre en premier parce que c'est le
 * décor dans lequel toute la carrière se joue.
 */
function renderAssembly() {
  const pane = document.getElementById("pane-assembly");
  if (!pane || !game.assembly) return;

  const ruling = rulingParty();
  const sieges = governmentSeats();
  const etat = majorityState();
  const nature = governmentKind();

  // game.president ne retient qu'un nom et un parti : le sexe se retrouve
  // dans la liste des figures, sans quoi toutes les présidentes de la
  // République s'appelaient « Président ».
  const president = game.president
    ? (game.president.isPlayer
        ? { name: game.character.name || t("sheet_name_empty"), party: game.party,
            sex: game.character.sex, isPlayer: true }
        : { ...game.president,
            sex: (game.rivals.find((r) => r.name === game.president.name) || {}).sex })
    : null;

  // On marque qui soutient le gouvernement : sans cela, le total du bloc
  // était un nombre qui ne correspondait à aucune ligne du tableau.
  const bloc = governmentBloc();
  const lignes = HEMICYCLE_ORDER
    .filter((key) => game.assembly[key])
    .map((key) =>
      '<div class="seat-row' + (key === game.party ? " is-mine" : "") +
        (bloc.includes(key) ? " is-bloc" : "") + '">' +
        '<span class="seat-dot" style="background:var(--p-' + key + ')"></span>' +
        '<span class="seat-party">' + t("party_" + key) +
          (key === ruling
            ? ' <span class="force-tag">' + t("force_ruling") + "</span>"
            : bloc.includes(key) ? ' <span class="force-tag is-bloc">' + t("force_support") + "</span>" : "") +
        "</span>" +
        '<span class="seat-count">' + game.assembly[key] + "</span>" +
      "</div>"
    ).join("");

  pane.innerHTML =
    renderExecutive(president, primeMinister(), nature) +
    hemicycleHTML() +
    '<p class="power-note is-' + etat + '">' +
      t("majority_" + etat).replace("{n}", sieges) + "</p>" +
    '<div class="seat-list">' + lignes + "</div>";
}

function renderLandscape() {
  const pane = document.getElementById("pane-landscape");
  if (!pane) return;

  const ruling = rulingParty();
  const ally = allyParty();

  pane.innerHTML = sortedLandscape().map((key) => {
    const share = game.landscape[key];
    const mine = key === game.party;

    // Dans le camp du joueur, les figures du parti sont ses concurrents
    // internes : on le met en tête, puis les autres, chef d'abord.
    const people = [];
    if (mine) {
      people.push({ name: game.character.name || t("sheet_name_empty"), position: game.position,
                    lead: leadsParty(game),
                    age: game.age, popularity: game.popularity, isPlayer: true });
    }
    figuresOf(key).forEach((figure) => {
      people.push({ name: figure.name, position: figure.position,
                    age: figure.age, popularity: figure.popularity });
    });

    return (
      '<div class="force-row' + (mine ? " is-mine" : "") +
        '" data-party="' + key + '" style="--tint:var(--p-' + key + ')">' +
        '<div class="force-head">' +
          '<span class="force-party">' + t("party_" + key) +
            (key === ruling ? ' <span class="force-tag">' + t("force_ruling") + "</span>" : "") +
            (key === ally ? ' <span class="force-tag is-ally">' + t("force_ally") + "</span>" : "") +
          "</span>" +
          '<span class="force-share">' + trendHTML(key) + Math.round(share) + "%</span>" +
        "</div>" +
        '<span class="force-track"><span class="force-fill" style="width:' +
          Math.min(100, share * 2.4) + '%"></span></span>' +
        '<button type="button" class="force-toggle">' + t("force_people") +
          " (" + people.length + ")</button>" +
        '<div class="force-people">' +
        people.map((p) =>
          '<div class="force-person' + (p.isPlayer ? " is-player" : "") +
            (p.position === "chef" || p.lead ? " is-leader" : "") + '">' +
            '<span class="force-name">' + p.name +
              // Une petite étoile ne se voyait pas. Le président porte
              // désormais un vrai badge, comme le parti au pouvoir.
              (p.name === presidentName() && !p.isPlayer
                ? ' <span class="force-tag is-president">' + t("force_president") + "</span>"
                : "") + "</span>" +
            '<span class="force-role">' + t("pos_" + p.position) +
              (p.lead ? " · " + t("pos_chef") : "") +
              " · " + Math.floor(p.age) + " " + t("age_short") + "</span>" +
            '<span class="force-pop">' + Math.round(p.popularity) + "</span>" +
          "</div>"
        ).join("") +
        "</div>" +
      "</div>"
    );
  }).join("");
}

function renderJournal() {
  const pane = document.getElementById("pane-journal");
  if (!pane) return;

  pane.innerHTML = game.log.length
    ? game.log.map((l) =>
        '<p class="journal-line"><span class="journal-turn">' + t("year_label") + " " +
        (Math.floor(l.turn / 2) + 1) + "</span>" + logText(l) + "</p>"
      ).join("")
    : '<p class="trait-empty">' + t("journal_empty") + "</p>";
}
