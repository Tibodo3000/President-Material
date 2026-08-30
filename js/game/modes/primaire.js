/*
 * TEMPS FORT — QUI LE PARTI PRÉSENTE À LA PRÉSIDENTIELLE.
 *
 * Un parti ne se réveille pas le matin de la présidentielle avec un candidat.
 * Il en désigne un quelques mois avant, et cette désignation est le vrai
 * tournant d'une carrière : c'est là qu'on cesse d'être un espoir.
 *
 * DEUX ROUTES, ET ELLES NE COMPTENT PAS LES MÊMES GENS.
 *
 * LA DÉSIGNATION. Une trentaine de personnes dans une pièce, et ce qu'elles
 * pèsent est la cote au parti, le rang occupé, ce qu'on peut mettre sur une
 * affiche. C'est la route ordinaire, celle qui existait, et le joueur y a
 * droit comme les autres : il ne gagnait rien à être aimé du pays si le siège
 * ne lui devait rien.
 *
 * LA PRIMAIRE. Les militants votent, et ils ne votent pas pour celui à qui
 * l'appareil doit quelque chose : ils votent pour celui qu'ils aiment. Ce
 * qui pèse ici est LA BASE — ce que votre propre camp pense de vous, la
 * seule popularité qui vaille dans cette salle. Elle s'ouvre quand la
 * direction n'a pas de patron évident, parfois parce que l'époque le veut,
 * et toujours quand le joueur la réclame — ce qui se paie.
 *
 * Le joueur choisit donc sa balance quand il a les deux : bien coté à
 * l'appareil, on fait valoir ses titres ; aimé de la base et ignoré du siège,
 * on réclame une primaire et on force la porte. Les deux se refusent à qui
 * n'a ni l'un ni l'autre.
 */

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
 * Dans combien de tours la présidentielle ? On la cherche explicitement :
 * nextElection() renvoie le scrutin le plus proche, et ce n'est presque
 * jamais celui-là — la désignation ne se déclencherait donc jamais.
 */
function turnsToPresidential() {
  for (let ahead = 1; ahead <= 48; ahead++) {
    const e = electionAtTurn(game.turn + ahead);
    if (e && e.id === "presidentielle") return ahead;
  }
  return null;
}

/* ==========================================================================
   CE QUE PÈSE UN PRÉTENDANT, SUR CHACUNE DES DEUX BALANCES
   ========================================================================== */

/**
 * LA BALANCE DE L'APPAREIL. Ce que le siège pèse : la cote au parti d'abord,
 * le rang occupé ensuite, la crédibilité, et ce que le pays connaît de vous —
 * une direction n'investit pas quelqu'un dont personne n'imagine le nom sur
 * une affiche nationale.
 *
 * LA FONCTION COMPTE AUTANT QUE LA COTE. Le joueur ne pesait que sa cote, si
 * bien qu'un cadre sans mandat très bien noté battait un chef de parti
 * installé. Une commission ne choisit pas ainsi.
 */
function apparatusWeight(standing, popularity, credibilite, rang) {
  return standing * 0.5 + popularity * 0.35 + credibilite * 1.2 + rang * 2.2;
}

function playerApparatusWeight() {
  return apparatusWeight(
    // Les rivaux n'ont qu'une popularité nationale : on se pèse sur la même
    // balance qu'eux, sinon la désignation est gagnée d'avance.
    game.standing, nationalPopularity(game),
    statScore(game, "credibilite") * 1.7,
    rankOf(game)
  );
}

const FIGURE_STANDING = { chef: 66, premier: 62, ministre: 54, depute: 46, maire: 44, euro: 42 };

function figureApparatusWeight(f) {
  return apparatusWeight(
    FIGURE_STANDING[f.position] || 36, f.popularity,
    (f.stats.credibilite || 5) * 1.7,
    POSITION_RANK[f.position] || 0
  );
}

/**
 * LA BALANCE DES MILITANTS. Ce que pense de vous VOTRE camp, et rien d'autre
 * en premier lieu : une primaire fermée ne demande pas son avis au pays. La
 * popularité nationale compte ensuite, parce qu'on veut aussi gagner, et le
 * rang ne compte presque plus — c'est très exactement ce qu'on vient chercher
 * en ouvrant les urnes aux militants.
 */
function baseWeight(base, popularity, rang) {
  return base * 0.75 + popularity * 0.2 + rang * 0.8;
}

function playerBaseWeight() {
  return baseWeight(basePopularity(game), nationalPopularity(game), rankOf(game));
}

/**
 * LA BASE D'UNE FIGURE. Les rivaux n'ont qu'une popularité nationale : leur
 * crédit chez les militants s'en déduit, corrigé par ce qui plaît dans une
 * salle de congrès et par ce qui n'y plaît pas. On applaudit le charisme et
 * la réputation ; l'homme d'appareil, lui, est toujours moins aimé de la base
 * que ses sondages ne le laissent croire, et c'est pour cela qu'il redoute
 * les primaires.
 */
function figureBase(f) {
  return clamp100(f.popularity +
    ((f.stats.charisme || 5) + (f.stats.reputation || 5) - (f.stats.reseau || 5)) * 1.2);
}

function figureBaseWeight(f) {
  return baseWeight(figureBase(f), f.popularity, POSITION_RANK[f.position] || 0);
}

function weightOn(road, f) {
  return road === "base" ? figureBaseWeight(f) : figureApparatusWeight(f);
}

function playerWeightOn(road) {
  return road === "base" ? playerBaseWeight() : playerApparatusWeight();
}

/**
 * Les prétendants, LE PRÉSIDENT EN EXERCICE MIS À PART.
 *
 * Il figurait dans la liste, et souvent en tête : on proposait donc au joueur
 * une désignation dont la favorite était la personne déjà à l'Élysée, ce qui
 * ne veut rien dire. Un sortant qui peut se représenter n'a pas d'investiture
 * à gagner, il est le candidat ; un sortant en fin de second mandat n'est
 * plus candidat du tout.
 *
 * L'ordre dépend de la salle : le premier de la commission n'est pas le
 * premier des militants, et c'est tout l'objet de ces deux pages.
 */
function primaryField(road) {
  return game.rivals
    .filter((r) => r.party === game.party &&
      !["militant", "cadre"].includes(r.position) &&
      !isPresident(r))
    .sort((a, b) => weightOn(road, b) - weightOn(road, a))
    .slice(0, 3);
}

/* ==========================================================================
   QUELLE ROUTE S'OUVRE, ET À QUI
   ========================================================================== */

/** L'appareil vous compte-t-il parmi les prétendants ? */
function canBeDesignated() {
  return game.standing >= PRIMARY_FLOOR;
}

/**
 * Peut-on réclamer une primaire ? Il faut la base derrière soi — on ne
 * demande pas un vote pour savoir si les militants vous aiment, on le demande
 * parce qu'on le sait — et il faut que le parti connaisse votre nom.
 */
function canCallPrimary() {
  return basePopularity(game) >= PRIMARY_CALL_BASE && game.standing >= PRIMARY_CALL_FLOOR;
}

/**
 * Le parti ouvre-t-il une primaire de lui-même ? Quand la direction n'a
 * personne à imposer, elle se décharge sur les militants ; et il arrive
 * qu'on en ouvre une parce que ne pas le faire se verrait.
 */
function partyOpensPrimary() {
  const champ = primaryField("appareil");
  const ecart = champ.length > 1
    ? figureApparatusWeight(champ[0]) - figureApparatusWeight(champ[1])
    : 99;
  return ecart < PRIMARY_OPEN_GAP || Math.random() < PRIMARY_OPEN_CHANCE;
}

/**
 * La désignation est-elle à l'ordre du jour ? Une seule fois par
 * présidentielle, et seulement si le joueur a l'une des deux routes ouvertes.
 * Sans aucune des deux, l'appareil désigne sans lui et il l'apprend par la
 * presse, comme avant.
 */
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

  return canBeDesignated() || canCallPrimary();
}

/**
 * La carte du moment : une primaire si le parti en ouvre une, la commission
 * sinon. Le moteur ne connaît que cette fonction.
 */
function nominationCard() {
  return partyOpensPrimary()
    ? { kind: "primaire", resolved: false, called: false }
    : { kind: "designation", resolved: false };
}

/**
 * Désigne le candidat du parti quand le joueur ne concourt pas, ou quand il
 * perd. Renvoie la figure retenue.
 */
function designateNominee(road) {
  const champ = primaryField(road || "appareil");
  if (!champ.length) return null;
  game.nominee = champ[0].name;
  return champ[0];
}

/**
 * Le dépouillement. Le joueur concourt : on compare son poids à celui du
 * meilleur des autres SUR LA MÊME BALANCE, avec la part de hasard qui fait
 * qu'une désignation n'est jamais jouée d'avance.
 */
function resolveNomination(road, effort) {
  const champ = primaryField(road);
  const rival = champ[0] || null;
  const moi = playerWeightOn(road) + effort + (Math.random() - 0.5) * 14;
  const eux = rival ? weightOn(road, rival) + (Math.random() - 0.5) * 14 : 0;

  if (moi >= eux) {
    game.nominee = "player";
    return { gagne: true, rival };
  }
  game.nominee = rival ? rival.name : null;
  return { gagne: false, rival };
}

/* ==========================================================================
   LES DEUX CARTES
   ========================================================================== */

/**
 * L'INVESTITURE EST UNE BASCULE. On ne se présente pas parce qu'on l'a
 * décidé, on se présente parce que le parti l'a décidé, et cela se lisait
 * comme un compte rendu de commission.
 */
function nominationVerdict(host, card, kicker) {
  host.innerHTML = momentHTML({
    tone: card.verdict === "won" ? "win" : "loss",
    kicker: t("elec_presidentielle") + " · " + kicker,
    word: t(card.verdict === "won" ? "verdict_nomination" : "verdict_nomination_lost"),
    note: cardHeader(),
    body:
      '<p class="moment-text">' + card.resultText + "</p>" +
      changesHTML(card.resultChanges) + continueButton("data-continue"),
  });
}

/** La liste des autres prétendants, dans l'ordre de la salle où l'on est. */
function fieldHTML(champ, titre) {
  if (!champ.length) return "";
  return '<div class="poll"><p class="poll-title">' + t(titre) + "</p>" +
    champ.map((f) =>
      '<div class="poll-row" style="--tint:var(--p-' + f.party + ')">' +
        '<span class="poll-name">' + f.name + "</span>" +
        '<span class="poll-track"></span>' +
        '<span class="poll-share">' + t("pos_" + f.position) + "</span>" +
      "</div>").join("") + "</div>";
}

function renderDesignationCard(host, card) {
  const champ = primaryField("appareil");
  const meneur = champ[0];

  const boutons = card.resolved ? "" :
    (canBeDesignated()
      ? '<button type="button" class="event-choice" data-designation="push">' + t("designation_push") + "</button>"
      : "") +
    (canCallPrimary()
      ? '<button type="button" class="event-choice" data-designation="call">' + t("designation_call") + "</button>"
      : "") +
    (meneur
      ? '<button type="button" class="event-choice" data-designation="back">' +
        t("primaire_back").replace("{name}", meneur.name) + "</button>"
      : "") +
    '<button type="button" class="event-choice" data-designation="out">' + t("primaire_out") + "</button>";

  if (card.resolved && card.verdict) {
    nominationVerdict(host, card, t("designation_tag"));
    return;
  }

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner("presidentielle", t("designation_tag")) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      (card.resolved
        ? '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) + continueButton("data-continue")
        : '<p class="event-text">' + t("designation_intro") + "</p>" +
          fieldHTML(champ, "designation_field") +
          '<div class="event-choices">' + boutons + "</div>") +
    "</div>";
}

function renderPrimaryCard(host, card) {
  const champ = primaryField("base");
  const meneur = champ[0];

  const boutons = card.resolved ? "" :
    '<button type="button" class="event-choice" data-primaire="run">' + t("primaire_run") + "</button>" +
    '<button type="button" class="event-choice" data-primaire="hard">' + t("primaire_run_hard") + "</button>" +
    (meneur
      ? '<button type="button" class="event-choice" data-primaire="back">' +
        t("primaire_back").replace("{name}", meneur.name) + "</button>"
      : "") +
    '<button type="button" class="event-choice" data-primaire="out">' + t("primaire_out") + "</button>";

  if (card.resolved && card.verdict) {
    nominationVerdict(host, card, t("primaire_tag"));
    return;
  }

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner("presidentielle", t("primaire_tag")) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      (card.resolved
        ? '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) + continueButton("data-continue")
        : '<p class="event-text">' + t(card.called ? "primaire_intro_called" : "primaire_intro") + "</p>" +
          fieldHTML(champ, "primaire_field") +
          '<div class="event-choices">' + boutons + "</div>") +
    "</div>";
}

/* ==========================================================================
   CE QU'ON EN FAIT
   ========================================================================== */

/** Se ranger derrière le meneur : la place se négocie, elle ne se donne pas. */
function standBehind(road) {
  const meneur = primaryField(road)[0];
  game.nominee = meneur ? meneur.name : null;
  bumpStanding(game, +10);
  bump(game, "reseau", +1);
  bumpPop(game, -3);
  return tBoth("primaire_backed", { name: meneur ? meneur.name : "" });
}

/** Passer son tour : l'appareil tranche, et il note qui n'était pas là. */
function stayOut(road) {
  designateNominee(road);
  bumpStanding(game, -6);
  return tBoth("primaire_out_result");
}

function closeCard(before, texte, verdict) {
  game.card.verdict = verdict || null;
  game.card.resolved = true;
  game.card.resultText = L(texte);
  game.card.resultChanges = diffSince(before, game);
  addLog(texte);
  saveGame();
  renderAll();
}

function designationChoice(target) {
  const quoi = target.getAttribute("data-designation");
  const before = snapshot(game);

  // RÉCLAMER UNE PRIMAIRE. On force la main de la direction, elle s'en
  // souvient, et la carte devient celle des militants : la même échéance, une
  // autre salle et une autre balance.
  if (quoi === "call") {
    bumpStanding(game, PRIMARY_CALL_COST);
    const forcee = tBoth("designation_called");
    addLog(forcee);
    game.card = { kind: "primaire", resolved: false, called: true };
    saveGame();
    renderAll();
    return;
  }

  if (quoi === "back") { closeCard(before, standBehind("appareil")); return; }
  if (quoi === "out") { closeCard(before, stayOut("appareil")); return; }

  const res = resolveNomination("appareil", 0);
  if (res.gagne) {
    bumpStanding(game, +6);
    bump(game, "notoriete", +2);
    closeCard(before, tBoth("designation_won"), "won");
  } else {
    bumpStanding(game, -4);
    closeCard(before, tBoth("designation_lost", { name: res.rival ? res.rival.name : "" }), "lost");
  }
}

function primaryChoice(target) {
  const quoi = target.getAttribute("data-primaire");
  const before = snapshot(game);

  if (quoi === "back") { closeCard(before, standBehind("base")); return; }
  if (quoi === "out") { closeCard(before, stayOut("base")); return; }

  // Y aller à fond coûte l'énergie d'une campagne entière, et pèse. Une
  // primaire arrachée, elle, se dispute avec la machine en face : voir
  // PRIMARY_CALL_HANDICAP.
  const fond = quoi === "hard";
  if (fond) { bump(game, "energie", -3); pay(game, -40000); }
  const res = resolveNomination("base",
    (fond ? 9 : 0) + (game.card.called ? PRIMARY_CALL_HANDICAP : 0));

  if (res.gagne) {
    bumpStanding(game, +12);
    bump(game, "notoriete", +2);
    bumpPop(game, +6);
    closeCard(before, tBoth("primaire_won"), "won");
  } else {
    bumpStanding(game, -8);
    bump(game, "notoriete", +1);
    closeCard(before, tBoth("primaire_lost", { name: res.rival ? res.rival.name : "" }), "lost");
  }
}

MODES.designation = {
  render: renderDesignationCard,
  clicks: { "data-designation": designationChoice },
};

MODES.primaire = {
  render: renderPrimaryCard,
  clicks: { "data-primaire": primaryChoice },
};
