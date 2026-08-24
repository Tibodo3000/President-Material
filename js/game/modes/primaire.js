/*
 * TEMPS FORT — LA PRIMAIRE.
 *
 * Qui le parti présente à la présidentielle. Le jeu réservait la candidature
 * au chef du parti : un ministre brillant, très bien coté et connu du pays
 * voyait passer chaque échéance sans qu'on lui propose jamais rien. On
 * concourt désormais parce qu'on a gagné l'investiture, et elle se dispute
 * quelques mois avant le scrutin, quand rien d'autre n'occupe le calendrier.
 *
 * Une seule carte, mais quatre portes qui ne coûtent pas la même chose : y
 * aller, y aller à fond, se ranger derrière le meneur, ou passer son tour.
 */

/* ==========================================================================
   LA PRIMAIRE
   ==========================================================================
   Un parti ne se réveille pas le matin de la présidentielle avec un candidat.
   Il en désigne un, quelques mois avant, et cette désignation est le vrai
   tournant d'une carrière : c'est là qu'on cesse d'être un espoir.

   Le moteur ne connaissait que la fonction — chef du parti, et personne
   d'autre. Un ministre très bien coté, connu et crédible n'avait aucune
   porte : il lisait « vous n'êtes pas investi » à chaque échéance sans
   pouvoir rien y faire. Il peut maintenant se présenter, ou choisir qui
   soutenir, et l'un comme l'autre se paie.
   ========================================================================== */

/** Combien de tours avant la présidentielle la primaire se joue. */
const PRIMARY_LEAD = 3;

/** La cote au parti en dessous de laquelle on ne concourt même pas. */
/*
 * Elle était à 42, à la portée de presque toutes les carrières : le joueur
 * disputait trois à quatre présidentielles par partie et finissait par en
 * gagner une. L'Élysée tombait dans plus d'un quart des parties, contre trois
 * pour cent avant que la primaire n'existe. Une candidature à la présidence
 * doit rester le sommet d'une carrière, pas un rendez-vous quinquennal.
 */
const PRIMARY_FLOOR = 58;

/*
 * COMBIEN DE FOIS ON SE PRÉSENTE : AUTANT QUE LE PARTI VOUS PRÉSENTE.
 *
 * Il a existé ici un plafond de deux candidatures par carrière, puis une
 * pénalité par défaite qui le remplaçait. Les deux étaient artificiels, et le
 * second l'était autant que le premier : il punissait le NOMBRE de défaites
 * sans jamais regarder ce qu'elles valaient. Un candidat de petit parti qui
 * perd deux fois en progressant à chaque fois n'a rien à se faire pardonner.
 *
 * Il n'y a donc plus rien ici. Ce qui décide, c'est la cote au parti, et une
 * présidentielle perdue la déplace déjà dans le bon sens : concedeElection()
 * la juge sur l'écart entre ce que le camp valait et ce qu'il a fait. Celui
 * qui coule son parti n'obtient plus l'investiture ; celui qui l'a fait
 * grandir l'obtient encore. C'est le parti qui tranche, pas un compteur.
 *
 * La seule limite qui reste est celle qui existe vraiment : on ne fait pas
 * trois mandats de suite à l'Élysée. Elle vit dans MAX_TERMS et ne concerne
 * que les figures — une victoire du joueur arrête la partie.
 */

/**
 * Le poids d'un prétendant dans une primaire : ce que l'appareil pèse, ce que
 * le pays connaît, et ce qu'on imagine de lui à l'Élysée. Les militants
 * votent pour celui qu'ils croient capable de gagner, ce qui n'est pas la
 * même chose que celui qu'ils préfèrent.
 */
function primaryWeight(standing, popularity, credibilite, rang) {
  return standing * 0.5 + popularity * 0.35 + credibilite * 1.2 + rang * 2.2;
}

/**
 * LA FONCTION COMPTE AUTANT QUE LA COTE. Le joueur ne pesait que sa cote au
 * parti, si bien qu'un cadre sans mandat très bien noté battait un chef de
 * parti installé. Un congrès ne choisit pas ainsi : il cherche quelqu'un
 * qu'on puisse mettre sur une affiche nationale.
 */
function playerPrimaryWeight() {
  return primaryWeight(
    game.standing, game.popularity,
    statScore(game, "credibilite") * 1.7,
    rankOf(game)
  );
}

function figurePrimaryWeight(f) {
  const rang = { chef: 66, premier: 62, ministre: 54, depute: 46, maire: 44, euro: 42 };
  return primaryWeight(
    rang[f.position] || 36, f.popularity,
    (f.stats.credibilite || 5) * 1.7,
    POSITION_RANK[f.position] || 0
  );
}

/**
 * Les prétendants, LE PRÉSIDENT EN EXERCICE MIS À PART.
 *
 * Il figurait dans la liste, et souvent en tête : on proposait donc au joueur
 * une primaire dont la favorite était la personne déjà à l'Élysée, ce qui ne
 * veut rien dire. Un sortant qui peut se représenter n'a pas de primaire à
 * gagner, il est le candidat ; un sortant en fin de second mandat n'est plus
 * candidat du tout.
 */
function primaryField() {
  return game.rivals
    .filter((r) => r.party === game.party &&
      !["militant", "cadre"].includes(r.position) &&
      !isPresident(r))
    .sort((a, b) => figurePrimaryWeight(b) - figurePrimaryWeight(a))
    .slice(0, 3);
}

/**
 * La primaire est-elle à l'ordre du jour ? Seulement une fois par
 * présidentielle, et seulement si le joueur pèse assez pour que la question
 * se pose. En dessous, l'appareil désigne sans lui et il l'apprend par la
 * presse, comme avant.
 */
/**
 * Dans combien de tours la présidentielle ? On la cherche explicitement :
 * nextElection() renvoie le scrutin le plus proche, et ce n'est presque
 * jamais celui-là — la primaire ne se déclenchait donc jamais.
 */
function turnsToPresidential() {
  for (let ahead = 1; ahead <= 24; ahead++) {
    const e = electionAtTurn(game.turn + ahead);
    if (e && e.id === "presidentielle") return ahead;
  }
  return null;
}

function primaryDue() {
  if (game.nominee) return false;
  if (turnsToPresidential() !== PRIMARY_LEAD) return false;

  // Un président de votre camp qui peut se représenter EST le candidat :
  // aucun parti n'organise une primaire contre son propre président. Sauf
  // s'il a renoncé, et l'on sait très bien comment on fait renoncer un
  // président : voir la fronde, dans js/events/partis.data.js.
  if (rulingParty() === game.party && !incumbentTermLimited() &&
      !game.flags.presidentRenonce &&
      game.president && !game.president.isPlayer) {
    return false;
  }

  return game.standing >= PRIMARY_FLOOR;
}

/**
 * Désigne le candidat du parti quand le joueur ne concourt pas, ou quand il
 * perd. Renvoie la figure retenue.
 */
function designateNominee() {
  const champ = primaryField();
  if (!champ.length) return null;
  game.nominee = champ[0].name;
  return champ[0];
}

/**
 * Le dépouillement de la primaire. Le joueur s'est présenté : on compare son
 * poids à celui du meilleur des autres, avec la part de hasard qui fait qu'une
 * primaire n'est jamais jouée d'avance.
 */
function resolvePrimary(effort) {
  const champ = primaryField();
  const rival = champ[0] || null;
  const moi = playerPrimaryWeight() + effort + (Math.random() - 0.5) * 14;
  const eux = rival ? figurePrimaryWeight(rival) + (Math.random() - 0.5) * 14 : 0;

  if (moi >= eux) {
    game.nominee = "player";
    return { gagne: true, rival };
  }
  game.nominee = rival ? rival.name : null;
  return { gagne: false, rival };
}

function renderPrimaryCard(host, card) {
  const champ = primaryField();
  const meneur = champ[0];

  const liste = champ.length
    ? '<div class="poll"><p class="poll-title">' + t("primaire_field") + "</p>" +
      champ.map((f) =>
        '<div class="poll-row" style="--tint:var(--p-' + f.party + ')">' +
          '<span class="poll-name">' + f.name + "</span>" +
          '<span class="poll-track"></span>' +
          '<span class="poll-share">' + t("pos_" + f.position) + "</span>" +
        "</div>").join("") + "</div>"
    : "";

  const boutons = card.resolved ? "" :
    '<button type="button" class="event-choice" data-primaire="run">' + t("primaire_run") + "</button>" +
    '<button type="button" class="event-choice" data-primaire="hard">' + t("primaire_run_hard") + "</button>" +
    (meneur
      ? '<button type="button" class="event-choice" data-primaire="back">' +
        t("primaire_back").replace("{name}", meneur.name) + "</button>"
      : "") +
    '<button type="button" class="event-choice" data-primaire="out">' + t("primaire_out") + "</button>";

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner("presidentielle", t("primaire_tag")) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      (card.resolved
        ? '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) + continueButton("data-continue")
        : '<p class="event-text">' + t("primaire_intro") + "</p>" + liste +
          '<div class="event-choices">' + boutons + "</div>") +
    "</div>";
}

function primaryChoice(target) {
  const quoi = target.getAttribute("data-primaire");
  const before = snapshot(game);
  let texte;

  if (quoi === "back") {
    const meneur = primaryField()[0];
    game.nominee = meneur ? meneur.name : null;
    bumpStanding(game, +10);
    bump(game, "reseau", +1);
    bumpPop(game, -3);
    texte = tBoth("primaire_backed", { name: meneur ? meneur.name : "" });
  } else if (quoi === "out") {
    designateNominee();
    bumpStanding(game, -6);
    texte = tBoth("primaire_out_result");
  } else {
    // Y aller à fond coûte l'énergie d'une campagne entière, et pèse.
    const fond = quoi === "hard";
    if (fond) { bump(game, "energie", -3); pay(game, -40000); }
    const res = resolvePrimary(fond ? 9 : 0);

    if (res.gagne) {
      bumpStanding(game, +12);
      bump(game, "notoriete", +2);
      bumpPop(game, +6);
      texte = tBoth("primaire_won");
    } else {
      bumpStanding(game, -8);
      bump(game, "notoriete", +1);
      texte = tBoth("primaire_lost", { name: res.rival ? res.rival.name : "" });
    }
  }

  game.card.resolved = true;
  game.card.resultText = L(texte);
  game.card.resultChanges = diffSince(before, game);
  addLog(texte);
  saveGame();
  renderAll();
}

MODES.primaire = {
  render: renderPrimaryCard,
  clicks: { "data-primaire": primaryChoice },
};
