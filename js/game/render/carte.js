/*
 * RENDU — DE QUOI UNE CARTE EST FAITE.
 *
 * Les meubles partagés par toutes les cartes du jeu : le bandeau de scrutin,
 * la ligne de date, les boutons de choix, les puces de conséquence, le
 * tableau de sondage, le bouton « continuer ». Le moteur et les sept temps
 * forts s'en servent tous — c'est ce qui fait qu'une carte de campagne et un
 * événement ordinaire se ressemblent au lieu d'être deux jeux différents.
 *
 * Ce qui n'est PAS ici : renderCard(), qui reste au moteur parce qu'il ne
 * dessine pas une carte, il choisit qui la dessine.
 */

function cardHeader() {
  const year = Math.floor(game.turn / 2) + 1;
  return fmtAge(game.age) + " · " + seasonLabel() + " · " + t("year_label") + " " + year;
}

/* ==========================================================================
   LE BANDEAU DE SCRUTIN
   ==========================================================================
   Une élection se lisait comme une scène ordinaire. Le nom du scrutin était
   posé dans la même ligne, la même casse et la même couleur que le titre
   d'un événement : « Législatives · 46 ans · Printemps · Année 17 » avait
   exactement l'allure de « Guerre interne · 49 ans · Printemps · Année 20 ».
   Le joueur n'avait aucun signal lui disant qu'il venait de changer de
   régime, et il ne pouvait pas s'y retrouver entre une carte de campagne,
   une carte d'investiture et un simple tour.

   Tout ce qui appartient à une élection porte donc un bandeau : le nom du
   scrutin en tête de carte, et le temps où l'on en est quand il y en a un.
   Ce qui n'en porte pas est un tour ordinaire. C'est la seule chose que le
   joueur ait besoin de savoir avant de lire la carte.
   ========================================================================== */

function electionBanner(electionId, sub) {
  return (
    '<div class="card-banner">' +
      '<span class="card-banner-name">' + t("elec_" + electionId) + "</span>" +
      (sub ? '<span class="card-banner-step">' + sub + "</span>" : "") +
    "</div>"
  );
}

/* ==========================================================================
   Conséquences affichées
   ==========================================================================
   Le jeu n'annonce jamais ce qu'une option va coûter ou rapporter : on
   choisit comme en politique, sur ce qu'on croit, pas sur un tableau de
   gains. En revanche, une fois le choix fait, tout est dit — statistiques,
   jauges, argent, traits gagnés ou levés.
   ========================================================================== */

function signed(n) {
  const value = String(Math.abs(n));
  return (n > 0 ? "+" : "−") + (currentLang === "fr" ? value.replace(".", ",") : value);
}

function escapeAttr(text) {
  return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function fxLabel(fx) {
  if (fx.kind === "stat") return t("stat_" + fx.key) + " " + signed(fx.delta);
  if (fx.kind === "gauge") {
    return t(fx.key === "popularity" ? "label_popularity" : "label_standing") + " " + signed(fx.delta);
  }
  if (fx.kind === "poll") return t("label_poll_short") + " " + signed(fx.delta) + " " + t("label_points");
  if (fx.kind === "approval") return t("label_approval") + " " + signed(fx.delta) + " " + t("label_points");
  if (fx.kind === "dissolve") return t("fx_dissolve");
  if (fx.kind === "money") return (fx.delta > 0 ? "+" : "−") + formatMoney(Math.abs(fx.delta));
  // Le rapport de force : le parti concerné, puis ce qu'il gagne ou perd.
  if (fx.kind === "landscape") {
    return t("party_" + fx.key) + " " + signed(fx.delta) + " " + t("label_points");
  }
  // L'opinion d'un électorat. Le regroupement en blocs titrés est la phase
  // suivante ; ici on garantit seulement qu'une pastille se lit.
  if (fx.kind === "appeal") {
    return (fx.base ? t("label_base") : t("party_" + fx.key)) + " " + signed(fx.delta);
  }
  if (fx.kind === "office") return t("pos_" + fx.key);
  if (fx.kind === "lead") return (fx.on ? "" : "✕ ") + t("pos_chef");
  if (fx.kind === "party") return t("fx_join") + " " + t("party_" + fx.key);
  if (fx.kind === "alliance") {
    return (fx.on ? "" : "✕ ") + t("fx_alliance") + " " + t("party_" + fx.key);
  }
  // Une marque qui disparaît garde son nom, barré d'une croix : aucune
  // langue à traduire, et le joueur comprend au premier coup d'œil.
  if (fx.kind === "trait") {
    const def = TRAIT_DATA[fx.key];
    return (fx.gained ? "" : "✕ ") + (def ? L(def.label) : fx.key);
  }
  if (fx.kind === "flag") return (fx.on ? "" : "✕ ") + t("flag_" + fx.key);
  // Un écart qui n'a pas encore fait une réputation : on le dit, sans chiffre
  // de compteur, mais assez clairement pour que le joueur sente venir la suite.
  if (fx.kind === "strike") {
    const def = TRAIT_DATA[fx.key];
    return t(fx.need - fx.count > 1 ? "fx_strike_first" : "fx_strike_last") +
      " " + (def ? L(def.label).toLowerCase() : fx.key);
  }
  if (fx.kind === "end") return t("fx_end");
  return "";
}

/** Bonne ou mauvaise nouvelle ? C'est ce qui donne sa couleur à la pastille. */
function fxDirection(fx) {
  if (fx.kind === "trait") {
    const def = TRAIT_DATA[fx.key];
    return (def && def.kind === "asset") === fx.gained ? "up" : "down";
  }
  if (fx.kind === "flag") return (fx.key === "carefulHealth") === fx.on ? "up" : "down";
  if (fx.kind === "end") return "down";
  if (fx.kind === "strike") return "down";
  // Des points pris à un adversaire sont une bonne nouvelle, et réciproquement.
  if (fx.kind === "landscape") {
    const mine = fx.key === game.party || fx.key === allyParty();
    return mine === (fx.delta > 0) ? "up" : "down";
  }
  if (fx.kind === "appeal") return fx.delta > 0 ? "up" : "down";
  if (fx.kind === "office") return fx.up ? "up" : "down";
  if (fx.kind === "lead") return fx.on ? "up" : "down";
  if (fx.kind === "party") return "up";
  if (fx.kind === "alliance") return fx.on ? "up" : "down";
  return fx.delta > 0 ? "up" : "down";
}

function fxChip(fx) {
  const def = fx.kind === "trait" ? TRAIT_DATA[fx.key] : null;
  return (
    '<span class="fx fx-' + fxDirection(fx) + (fx.kind === "trait" ? " fx-trait" : "") + '"' +
      (def ? ' title="' + escapeAttr(L(def.desc)) + '"' : "") + ">" +
      fxLabel(fx) +
    "</span>"
  );
}

/**
 * Ce qu'un trait change, écrit à partir de ses données plutôt que recopié à
 * la main : le jour où un trait est retouché dans js/traits.data.js, la fiche
 * dit la vérité sans qu'on y pense.
 */
function traitEffectText(id) {
  const def = TRAIT_DATA[id];
  if (!def) return "";

  const parts = [];
  if (def.stats) {
    Object.entries(def.stats).forEach(([stat, value]) => {
      parts.push(t("stat_" + stat) + " " + signed(value));
    });
  }
  if (def.target) {
    Object.entries(def.target).forEach(([gauge, value]) => {
      parts.push(t(gauge === "popularity" ? "label_popularity" : "label_standing") + " " + signed(value));
    });
  }
  if (def.energy) parts.push(t("fx_energy_cap") + " " + signed(def.energy * 2));
  if (def.soften) parts.push(t("trait_fx_soften") + " " + Math.round(def.soften * 100) + " %");
  // Ce qu'il vaut selon le camp où l'on milite : on n'affiche que le sien.
  if (def.partyTarget && def.partyTarget[game.party]) {
    Object.entries(def.partyTarget[game.party]).forEach(([gauge, valeur]) => {
      parts.push(t(gauge === "popularity" ? "label_popularity" : "label_standing") + " " + signed(valeur));
    });
  }
  if (def.income) parts.push(formatMoney(def.income) + " " + t("trait_fx_income"));
  // Le second tour se raconte : untel ne votera jamais pour vous, untel n'y
  // voit plus d'obstacle. C'est plus parlant qu'un bonus sans unité.
  if (def.rejection) {
    parts.push(t("trait_fx_rejection") + " " + signed(Math.round(def.rejection * 100)) + " %");
  }
  if (def.risk) parts.push(t("trait_fx_risk"));

  return parts.join(" · ");
}

/** Une ligne de trait : son nom, puis ce qu'il fait, sans survol nécessaire. */
function traitRowHTML(id) {
  const def = TRAIT_DATA[id];
  if (!def) return "";

  return (
    '<div class="trait-row trait-' + (def.kind === "asset" ? "asset" : "mark") + '"' +
      ' title="' + escapeAttr(L(def.desc)) + '">' +
      '<span class="trait-name">' + L(def.label) + "</span>" +
      '<span class="trait-fx">' + traitEffectText(id) + "</span>" +
    "</div>"
  );
}

/**
 * Les traits rangés par famille. Sans ce regroupement, la fiche d'une longue
 * carrière est une liste où le physique, les affaires et les talents se
 * mélangent, et l'on n'y lit plus rien.
 */
function traitRowsHTML(list) {
  return TRAIT_FAMILIES.map((family) => {
    const ids = list.filter((id) => TRAIT_DATA[id] && TRAIT_DATA[id].family === family);
    if (!ids.length) return "";
    return '<p class="trait-family">' + t("trait_family_" + family) + "</p>" +
      ids.map(traitRowHTML).join("");
  }).join("");
}

/** Une ligne de pastilles. */
function effectsHTML(list) {
  if (!list || !list.length) return "";
  return '<span class="fx-line">' + list.map(fxChip).join("") + "</span>";
}

/** Ce qui a bougé après coup, sous le texte de résultat. */
function changesHTML(changes) {
  if (!changes || !changes.length) return "";
  return '<div class="event-changes">' + effectsHTML(changes) + "</div>";
}

function diffSince(before, s) {
  const changes = [];
  STAT_KEYS.forEach((key) => {
    const delta = s.stats[key] - before.stats[key];
    if (delta) changes.push({ kind: "stat", key, delta });
  });
  if (s.popularity !== before.popularity) {
    changes.push({ kind: "gauge", key: "popularity", delta: s.popularity - before.popularity });
  }
  if (s.standing !== before.standing) {
    changes.push({ kind: "gauge", key: "standing", delta: s.standing - before.standing });
  }
  if (s.money !== before.money) changes.push({ kind: "money", delta: s.money - before.money });
  // Prendre ou rendre la direction du parti ne bouge aucune jauge et ne se
  // lisait donc nulle part dans les conséquences : c'est pourtant la seule
  // chose qu'un congrès change.
  if (Boolean(s.partyLead) !== Boolean(before.partyLead)) {
    changes.push({ kind: "lead", on: Boolean(s.partyLead) });
  }
  return changes;
}

/**
 * Traduit la condition d'un choix en raisons lisibles. Un choix réservé ne
 * doit pas seulement être signalé : le joueur doit savoir ce qui le lui
 * ouvre, sinon la marque dorée n'est qu'une décoration.
 */
function unlockReasons(when) {
  const parts = [];
  const names = (list, prefix) => list.map((key) => t(prefix + key)).join(" / ");

  if (when.personality) parts.push(names(when.personality, "perso_"));
  if (when.background) parts.push(names(when.background, "bg_"));
  if (when.origin) parts.push(names(when.origin, "origin_"));
  if (when.party) parts.push(names(when.party, "party_"));
  if (when.position) parts.push(names(when.position, "pos_"));
  if (when.partyLead) parts.push(t("pos_chef"));

  const nomTrait = (id) => (TRAIT_DATA[id] ? L(TRAIT_DATA[id].label) : id);
  if (when.trait) parts.push(when.trait.map(nomTrait).join(" · "));
  if (when.anyTrait) parts.push(when.anyTrait.map(nomTrait).join(" / "));
  if (when.stat) {
    Object.entries(when.stat).forEach(([stat, range]) => {
      if (range.min !== undefined) parts.push(t("stat_" + stat) + " " + range.min + "+");
      if (range.max !== undefined) parts.push(t("stat_" + stat) + " ≤ " + range.max);
    });
  }
  if (when.minMoney !== undefined) parts.push(formatMoney(when.minMoney));
  // Ce qu'un poste de budget ouvre : sans cette ligne, le joueur voyait un
  // choix marqué comme conditionnel sans jamais savoir ce qui l'avait ouvert.
  const posteAtteint = (key, level) => {
    const def = BUDGET_DATA.investments[key];
    const spec = def && def.levels[Math.min(level, def.levels.length - 1)];
    if (spec) parts.push(L(def.label) + " · " + L(spec.name));
  };
  if (when.legal !== undefined) posteAtteint("juridique", when.legal);
  if (when.comms !== undefined) posteAtteint("communication", when.comms);
  if (when.minStanding !== undefined) parts.push(t("label_standing") + " " + when.minStanding + "+");
  if (when.minPopularity !== undefined) parts.push(t("label_popularity") + " " + when.minPopularity + "+");

  return parts;
}

/** En dessous d'une chance sur quatre, on prévient. */
const RISKY_CHANCE = 0.25;

/**
 * Un bouton de choix. Les choix conditionnels portent une marque et la raison
 * qui les ouvre ; ceux dont le jet est très mal engagé portent un
 * avertissement. On ne dit pas la probabilité exacte : on dit qu'on joue gros.
 */
function choiceButton(choice, index) {
  const unlocked = Boolean(choice.when);
  const reasons = unlocked ? unlockReasons(choice.when) : [];
  const risky = Boolean(choice.roll) && rollChance(choice.roll, game) < RISKY_CHANCE;

  const notes =
    (reasons.length ? '<span class="choice-why">' + t("choice_unlocked") + " " + reasons.join(" · ") + "</span>" : "") +
    (risky ? '<span class="choice-risky">' + t("choice_risky") + "</span>" : "");

  return (
    '<button type="button" class="event-choice' + (unlocked ? " is-unlocked" : "") +
      (risky ? " is-risky" : "") + '" data-choice="' + index + '">' +
      (unlocked ? '<span class="choice-key" aria-hidden="true">◆</span>' : "") +
      // Le libellé parle de la figure mise en scène autant que le texte :
      // il doit s'accorder comme lui. Sans cela, « {Le} soutenir » s'affichait
      // tel quel sur le bouton.
      '<span class="choice-label">' + fillGender(L(choice.label), game.scene) + "</span>" +
      (notes ? '<span class="choice-notes">' + notes + "</span>" : "") +
    "</button>"
  );
}

/** Les boutons de tous les choix jouables dans la situation actuelle. */
function choiceButtons(ev, s) {
  const open = availableChoices(ev, s);
  let html = open.map(({ choice, index }) => choiceButton(choice, index)).join("");

  // Si l'épuisement a fermé des portes, on le dit : le joueur doit
  // comprendre que son état lui coûte des options, pas seulement des points.
  // Ce que la fatigue a retiré de la carte : une option réservée à qui tient
  // debout, ou simplement une option qu'on n'a plus les moyens de payer. Sans
  // cette ligne, le joueur croit que la carte a moins de choix qu'elle n'en a.
  const hiddenByFatigue = ev.choices.some((c) => {
    if (open.some((o) => o.choice === c)) return false;
    if (c.when && c.when.stat && c.when.stat.energie) return true;
    return energyCost(c) > game.stats.energie;
  });
  if (hiddenByFatigue) html += '<p class="fatigue-note">' + t("note_exhausted") + "</p>";

  return html;
}

/* ==========================================================================
   LE TABLEAU DE SONDAGE
   ==========================================================================
   Une seule barre par candidat, triée, la vôtre marquée. Le même widget
   sert le rapport de force d'un scrutin, le premier tour, le second et la
   présidentielle des autres : c'est la même information, elle doit avoir
   la même tête.
   ========================================================================== */

/** Le nom affiché d'un candidat, traduit à la volée si c'est une clé. */
function fieldName(c) {
  return c.nameKey ? t(c.nameKey) : c.name;
}

/** Le sondage présidentiel trié, du meilleur au moins bon. */
function sortedField() {
  return [...game.campaign.field].sort((a, b) => b.share - a.share);
}

/** Le sondage, en barres empilées : l'information centrale de la campagne. */
function pollHTML(list, titleKey, scale) {
  // L'échelle est taillée pour un premier tour, où le mieux placé plafonne
  // vers trente pour cent. À deux, elle doit revenir à un pour un, sinon
  // quarante-sept et cinquante-trois donnent deux barres pleines identiques.
  const echelle = scale || 1.8;
  return (
    '<div class="poll">' +
      '<p class="poll-title">' + t(titleKey || "label_poll") + "</p>" +
      (list || sortedField()).map((c) =>
        '<div class="poll-row' + (c.isPlayer ? " is-player" : "") +
          '" style="--tint:var(--p-' + (c.party || game.party) + ')">' +
          '<span class="poll-name">' + fieldName(c) + "</span>" +
          '<span class="poll-track"><span class="poll-fill" style="width:' +
            Math.min(100, c.share * echelle) + '%"></span></span>' +
          '<span class="poll-share">' + Math.round(c.share) + "%</span>" +
        "</div>"
      ).join("") +
    "</div>"
  );
}

/** Le nom d'un finaliste, clé de traduction ou nom propre. */
function winnerName(res) {
  return res.winnerKey ? t(res.winnerKey) : res.winnerName;
}

function continueButton(attr) {
  return '<div class="event-choices">' +
    '<button type="button" class="event-choice event-continue" ' + attr + ">" +
    t("game_continue") + "</button></div>";
}
