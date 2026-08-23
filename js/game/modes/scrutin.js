/*
 * TEMPS FORT — LA CARTE D'OUVERTURE D'UN SCRUTIN.
 *
 * Le premier des deux temps d'une échéance. Trois choses, dans cet ordre, et
 * rien d'autre : ce qu'on élit, qui est en face, et ce qui se joue pour vous.
 * La troisième est celle qui manquait le plus : le joueur découvrait après
 * coup qu'il défendait un siège, ou qu'il n'était candidat à rien.
 *
 * Un seul bouton, qui fait entrer dans le scrutin proprement dit — course,
 * investiture refusée, campagne présidentielle ou soirée qu'on regarde de
 * loin, c'est enterElection() qui tranche.
 *
 * Le bandeau (electionBanner) et le tableau de sondage (pollHTML) restent au
 * moteur : la moitié des cartes du jeu s'en servent.
 */

/**
 * Le rapport de force, en tête de scrutin. On réutilise le tableau des
 * sondages plutôt que d'en inventer un second : c'est la même information,
 * elle doit avoir la même tête.
 */
function forcesHTML() {
  const liste = sortedLandscape().map((key) => ({
    nameKey: "party_" + key, party: key,
    share: game.landscape[key], isPlayer: key === game.party,
  }));
  return pollHTML(liste, "scrutin_forces", 2.6);
}

/** L'Assemblée sortante, la veille de la remettre en jeu. */
function sortanteHTML() {
  if (!game.assembly) return "";
  return '<p class="scrutin-line"><span class="scrutin-label">' + t("scrutin_outgoing") +
    '</span><span class="scrutin-value">' +
    t("majority_" + majorityState()).replace("{n}", governmentSeats()) + "</span></p>";
}

/**
 * CE QUI SE JOUE POUR VOUS. La phrase la plus utile de la carte, et la seule
 * que le jeu ne disait nulle part : on apprenait qu'on défendait un siège en
 * lisant le résultat.
 */
function scrutinStake(electionId) {
  const stake = playerStake(electionId);
  if (!stake) return t("scrutin_you_none");
  if (electionId === "presidentielle") return t("scrutin_you_president");

  // LA DIRECTION DU PARTI N'EST PAS UN MANDAT, et elle ne se dit pas comme
  // un mandat : « briguer un mandat de chef du parti » n'existe ni dans la
  // langue ni dans le jeu. Chaque phrase a donc sa variante.
  const suffixe = stake.target === "chef" ? "_lead" : "";
  const poste = t("pos_" + stake.target).toLowerCase();

  if (stake.defense) return t("scrutin_you_defend" + suffixe).replace("{pos}", poste);
  if (nominationBlocked(stake)) {
    const cle = inTheRunning(stake) ? "scrutin_you_blocked" : "scrutin_you_far";
    return t(cle + suffixe).replace("{pos}", poste);
  }
  return t("scrutin_you_run" + suffixe).replace("{pos}", poste);
}

function renderScrutinCard(host, card) {
  const id = card.id;

  host.innerHTML =
    '<div class="event-card event-card-election event-card-scrutin">' +
      electionBanner(id) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      '<p class="event-text scrutin-lede">' + t("scrutin_lede_" + id) + "</p>" +
      forcesHTML() +
      (id === "legislatives" ? sortanteHTML() : "") +
      '<p class="scrutin-line is-you"><span class="scrutin-label">' + t("scrutin_you") +
        '</span><span class="scrutin-value">' + scrutinStake(id) + "</span></p>" +
      continueButton("data-scrutin") +
    "</div>";
}

MODES.scrutin = {
  render: renderScrutinCard,
  clicks: {
    // On entre dans le scrutin qu'on vient de présenter. Le tour ne bouge
    // pas : c'est la même échéance, lue puis jouée.
    "data-scrutin": () => {
      enterElection(game.card.id);
      saveGame();
      renderAll();
    },
  },
};
