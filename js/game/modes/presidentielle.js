/*
 * TEMPS FORT — LA PRÉSIDENTIELLE.
 *
 * Le dernier acte, et le seul qui se joue en deux tours. Six temps de
 * campagne avec un sondage VISIBLE qui bouge à chaque décision, le soir du
 * premier tour, puis — si l'on est dans les deux premiers — la quinzaine de
 * l'entre-deux-tours et son débat.
 *
 * LES DEUX TOURS TIENNENT DANS UN SEUL FICHIER, et ce n'est pas de la
 * paresse : ils partagent leur état (game.campaign, dont le second tour n'est
 * qu'une phase), leur tireur de scènes (pickCampaignScene, qui sert les deux
 * paquets) et leur carte (renderCampaignCard, qui dessine les quatre phases).
 * Séparés, on obtiendrait deux fichiers dont aucun ne se comprend seul.
 *
 * C'EST ICI QUE SE PAIE LE POSITIONNEMENT. Le premier tour ne demande pas de
 * gagner mais d'être dans les deux premiers ; le second transfère les voix
 * des éliminés par proximité idéologique, amortie par le taux de rejet de
 * chaque finaliste. Une campagne qui a passionné une base sans convaincre
 * personne d'autre mène le premier tour et perd le second.
 *
 * Ce que le moteur garde : les helpers de chronologie (momentOf, momentFits,
 * rememberMoment), que la course et la présidentielle des autres utilisent
 * aussi, et le tableau de sondage (pollHTML, sortedField, fieldName).
 */

/**
 * Les adversaires en lice. Une présidentielle n'oppose pas deux personnes :
 * chaque parti présente sa figure, et le président sortant part avec la
 * prime au bilan tant qu'il peut se représenter. Avec six noms sur la ligne
 * de départ, arriver dans les deux premiers est déjà un objectif.
 *
 * La part de départ de chaque camp est celle du rapport de force affiché au
 * joueur pendant toute la partie : rien n'est caché, la campagne commence là
 * où le pays en est.
 */
/**
 * L'ADHÉSION N'EST PAS UN BULLETIN. On ne convertit jamais en voix tout ce
 * qu'un électorat pense de bien de vous : il a son propre candidat, ses
 * habitudes et son abstention. Le coefficient ramène la somme des adhésions
 * sur l'échelle d'un premier tour, où l'on gagne à vingt-cinq pour cent.
 */
const PRESIDENTIAL_CONVERSION = 0.45;

/**
 * Ce que le joueur convertit, électorat par électorat, pondéré par le poids de
 * chacun dans le pays. C'est une part de voix, lisible telle quelle.
 */
function playerFirstRound() {
  if (!game.appeal) return game.landscape[game.party] * playerPull();

  let voix = 0;
  Object.keys(PARTIES).forEach((key) => {
    voix += (game.appeal[key] / 100) * (game.landscape[key] || 0);
  });
  return voix * PRESIDENTIAL_CONVERSION;
}

function presidentialField() {
  const ally = allyParty();

  const field = [
    {
      name: game.character.name || null,
      nameKey: game.character.name ? null : "sheet_name_empty",
      party: game.party,
      // CE QU'ON PÈSE AU PREMIER TOUR SE CALCULE ÉLECTORAT PAR ÉLECTORAT.
      //
      // C'était la part nationale du camp multipliée par un tirage global :
      // le score ne dépendait donc que de la taille du parti et d'une
      // popularité moyenne, et il ne servait à rien d'être adoré des siens si
      // la moyenne ne bougeait pas. On additionne désormais ce qu'on convertit
      // dans CHAQUE électorat, pondéré par ce qu'il pèse dans le pays : un
      // camp à trente pour cent avec quatre-vingts d'adhésion vaut vingt-quatre
      // points avant même d'avoir parlé à quelqu'un d'autre.
      pop: game.popularity,
      share: Math.max(1, playerFirstRound() * (ally ? 1.12 : 1)),
      isPlayer: true,
    },
  ];

  Object.keys(PARTIES).forEach((key) => {
    if (key === game.party) return;

    // presidentialCandidate écarte le sortant qui a fait ses deux mandats :
    // s'il est encore là, c'est qu'il peut se représenter.
    const figure = presidentialCandidate(key);
    const sortant = Boolean(figure) && isPresident(figure);

    // Un allié présente quand même son candidat, mais une partie de son
    // électorat a déjà fait le voyage.
    const pull = (figure ? figurePull(figure, sortant) : 0.8) * (key === ally ? 0.82 : 1);

    field.push({
      name: figure ? figure.name : null,
      nameKey: figure ? null : "party_" + key,
      party: key,
      pop: figure ? figure.popularity : 45,
      share: Math.max(1, game.landscape[key] * pull),
      isPlayer: false,
    });
  });

  const total = field.reduce((sum, c) => sum + c.share, 0);
  field.forEach((c) => { c.share = (c.share / total) * 100; });
  return field;
}

function startCampaign() {
  // Le compteur de candidatures. Il a servi de plafond — deux par carrière —
  // et ne sert plus à rien fermer : ce qui freine désormais est la primaire,
  // où chaque défaite pèse. On le tient parce qu'une carrière se raconte
  // aussi par le nombre de fois qu'on y est allé.
  game.presidentialRuns = (game.presidentialRuns || 0) + 1;

  game.campaign = {
    step: 0, field: presidentialField(), lastId: null, used: [], moment: null, phase: "campaign",
    // CE QUE VALAIT LE CAMP AVANT QUE VOUS NE LE PORTIEZ. Sans ce repère, une
    // défaite ne peut se lire qu'en « gagné / perdu », et le parti reproche
    // la même chose à celui qui a doublé son score et à celui qui l'a coulé.
    baseShare: game.landscape[game.party],
  };
  game.card = { kind: "campaign", id: drawCampaignEvent().id, resolved: false };
}

/**
 * LA FIGURE DERRIÈRE UNE LIGNE DE SONDAGE. Le sondage ne retient qu'un nom et
 * un parti ; les textes, eux, ont besoin de savoir à qui ils parlent. Sans ce
 * détour par la liste des figures, l'adversaire d'une campagne était accordé
 * au masculin quoi qu'il arrive, ce que le reste du jeu avait déjà corrigé
 * partout ailleurs.
 */
function campaignFigure(candidate) {
  if (!candidate || !candidate.name) return null;
  const figure = game.rivals.find((r) => r.name === candidate.name);
  return figure
    ? { name: figure.name, party: figure.party, position: figure.position, sex: figure.sex }
    : { name: candidate.name, party: candidate.party, position: "chef" };
}

/**
 * L'adversaire d'une campagne n'est pas tiré au sort : c'est celui qui est
 * devant vous dans les sondages. Il change donc en cours de route, comme dans
 * une vraie campagne, où l'on finit par ne plus parler que d'une personne.
 */
function campaignOpponent() {
  const others = game.campaign.field.filter((c) => !c.isPlayer && c.name);
  if (!others.length) return null;

  return campaignFigure(others.reduce((top, c) => (c.share > top.share ? c : top), others[0]));
}

/**
 * Le plus petit du champ. On ne propose pas le même marché au favori et à
 * celui qui plafonne à cinq pour cent : les scènes qui parlent d'un appoint
 * portent "cast": "minor".
 */
function campaignMinor() {
  const others = game.campaign.field.filter((c) => !c.isPlayer && c.name);
  if (!others.length) return null;

  return campaignFigure(others.reduce((bas, c) => (c.share < bas.share ? c : bas), others[0]));
}

/**
 * Le tirage d'une scène de campagne, premier ou second tour.
 *
 * Trois règles, dans cet ordre. Les scènes OBLIGATOIRES passent devant tout
 * le monde dès qu'il ne reste plus que le temps qu'il leur faut : une
 * présidentielle sans grand débat n'existe pas, et on ne va pas la confier
 * au hasard. Ensuite on ne rejoue jamais le même moment dans une même
 * campagne. Enfin on préfère toujours ce que le joueur n'a jamais vu : une
 * carrière peut compter trois présidentielles, et à la troisième on repasse
 * forcément par des scènes connues, mais jamais dans la même année.
 */
function pickCampaignScene(deck, state, steps) {
  const used = state.used || (state.used = []);

  const enAttente = deck.filter((ev) =>
    ev.required && !used.includes(ev.id) && eventMatches({ ...ev, id: null }, game) &&
    (state.moment == null || momentOf(ev) === null || momentOf(ev) <= state.moment));

  const obligatoires = enAttente.filter((ev) => momentFits(ev, state, steps));

  // Le temps restant ne suffit plus qu'à elles : la plus tardive passe.
  if (obligatoires.length >= steps - state.step) {
    const rang = (ev) => (momentOf(ev) === null ? Infinity : momentOf(ev));
    return obligatoires.reduce((tard, ev) => (rang(ev) > rang(tard) ? ev : tard), obligatoires[0]);
  }

  // UNE OBLIGATOIRE SE RÉSERVE SA PLACE. Le débat porte une date, et toute
  // scène plus tardive jouée avant lui la lui ferme définitivement : on avait
  // ainsi une présidentielle sur vingt qui se terminait sans débat, parce que
  // « dix jours avant le vote » était tombé d'abord. Tant qu'une obligatoire
  // attend, ce qui vient après elle dans le calendrier attend aussi.
  const dates = enAttente.map(momentOf).filter((m) => m !== null);
  const plancher = dates.length ? Math.max(...dates) : null;

  const eligible = deck.filter((ev) => {
    const weight = ev.weight === undefined ? 2 : ev.weight;
    if (weight <= 0 || used.includes(ev.id)) return false;
    if (!momentFits(ev, state, steps)) return false;
    if (plancher !== null && momentOf(ev) !== null && momentOf(ev) < plancher) return false;
    return eventMatches({ ...ev, id: null }, game);
  });

  const fresh = eligible.filter((ev) => !game.seen[ev.id]);
  const choices = fresh.length ? fresh : eligible;

  const pool = [];
  choices.forEach((ev) => {
    const weight = ev.weight === undefined ? 2 : ev.weight;
    for (let i = 0; i < weight; i++) pool.push(ev);
  });

  return pool.length ? pool[randInt(pool.length)] : (obligatoires[0] || deck[0]);
}

/** Un temps de la campagne du premier tour. */
function drawCampaignEvent() {
  const ev = pickCampaignScene(CAMPAIGN_EVENTS, game.campaign, CAMPAIGN_STEPS);
  game.campaign.used.push(ev.id);
  rememberMoment(ev, game.campaign);
  game.campaign.lastId = ev.id;
  // Une scène qui déclare son casting l'obtient ; les autres parlent de celui
  // qui est devant, parce que c'est de lui qu'une campagne finit par parler.
  game.scene =
    (ev.cast === "minor" ? campaignMinor() : ev.cast ? castFor(ev) : campaignOpponent()) ||
    game.scene;
  return ev;
}

/** Les deux paquets portent des identifiants distincts : on cherche dans les deux. */
function campaignEventById(id) {
  return CAMPAIGN_EVENTS.find((e) => e.id === id) ||
    RUNOFF_EVENTS.find((e) => e.id === id) || CAMPAIGN_EVENTS[0];
}

/**
 * Premier tour : il ne s'agit pas de gagner, il s'agit d'être dans les deux
 * premiers. Une campagne qui a passionné une base sans convaincre personne
 * d'autre s'arrête ici, et c'est une des façons de perdre les plus dures.
 */
function resolveFirstRound() {
  const sorted = sortedField();
  const me = game.campaign.field.find((c) => c.isPlayer);
  const qualified = sorted.slice(0, 2).some((c) => c.isPlayer);

  game.campaign.first = {
    qualified,
    myShare: Math.round(me.share),
    leaderName: sorted[0].isPlayer ? null : sorted[0].name,
    leaderKey: sorted[0].isPlayer ? null : (sorted[0].nameKey || null),
    rivalName: qualified ? (sorted.find((c) => !c.isPlayer) || {}).name : null,
  };

  if (!qualified) {
    game.campaign.result = {
      playerWon: false,
      eliminated: true,
      myShare: Math.round(me.share),
      winnerName: sorted[0].name,
      winnerKey: sorted[0].nameKey || null,
    };
    concedeElection(sorted[0]);
  }
}

/* ==========================================================================
   L'ENTRE-DEUX-TOURS
   ==========================================================================
   Quinze jours, trois scènes, et un sondage en tête-à-tête qui somme à cent.
   Le report des voix est fait DÈS LA QUALIFICATION, pas au dépouillement :
   le joueur lit pendant quinze jours le score exact qu'on comptera le
   dimanche, et ce qu'il fait pendant ces quinze jours le déplace.
   ========================================================================== */

/** Le soir du premier tour : les reports tombent, le face-à-face commence. */
function startDuel() {
  const result = runoff(game.campaign.field, game);
  game.campaign.duel = { step: 0, used: [], moment: null, field: result.finalists };
  game.campaign.phase = "duel";
  game.card = { kind: "campaign", id: drawRunoffEvent().id, resolved: false };
}

/** Au second tour il n'y a plus qu'un adversaire, et on ne parle que de lui. */
function runoffOpponent() {
  return campaignFigure(game.campaign.duel.field.find((c) => !c.isPlayer && c.name));
}

/**
 * L'adversaire du second tour, pour les conditions d'événement. Renvoie null
 * hors de l'entre-deux-tours : ces conditions n'ont de sens que là.
 */
function runoffFoe() {
  if (!game.campaign || !game.campaign.duel) return null;
  return game.campaign.duel.field.find((c) => !c.isPlayer) || null;
}

/**
 * PORTE-T-IL UN BILAN ? Seuls l'Élysée et Matignon en donnent un : on ne
 * demande pas des comptes sur cinq ans à quelqu'un qui n'a rien gouverné.
 */
function foeHoldsOffice(foe) {
  if (!foe || !foe.name) return false;
  if (game.president && !game.president.isPlayer && game.president.name === foe.name) return true;

  const figure = game.rivals.find((r) => r.name === foe.name);
  return Boolean(figure) && figure.position === "premier";
}

/**
 * Le candidat qu'on va chercher entre les deux tours : le plus gros des
 * éliminés, parce que ce sont ses voix qui décident. Les scènes qui le
 * mettent en scène portent "cast": "eliminated".
 */
function eliminatedCandidate() {
  const finalistes = game.campaign.duel.field.map((c) => c.name);
  const dehors = game.campaign.field.filter((c) =>
    !c.isPlayer && c.name && !finalistes.includes(c.name));
  if (!dehors.length) return null;

  return campaignFigure(dehors.reduce((top, c) => (c.share > top.share ? c : top), dehors[0]));
}

/** Un temps d'entre-deux-tours. */
function drawRunoffEvent() {
  const duel = game.campaign.duel;
  const ev = pickCampaignScene(RUNOFF_EVENTS, duel, RUNOFF_STEPS);
  duel.used.push(ev.id);
  rememberMoment(ev, duel);
  game.scene =
    (ev.cast === "eliminated" ? eliminatedCandidate() : runoffOpponent()) || game.scene;
  return ev;
}

/** Le face-à-face, trié : c'est ce sondage-là qui compte désormais. */
function duelField() {
  return [...game.campaign.duel.field].sort((a, b) => b.share - a.share);
}

/**
 * Second tour : les voix des éliminés décident, et elles ne se commandent
 * pas. Ce qu'on dépouille est exactement ce que le joueur a lu pendant
 * quinze jours ; le repli recalcule les reports pour une partie sauvegardée
 * avant que l'entre-deux-tours n'existe.
 */
function resolveRunoff() {
  const duel = game.campaign.duel;
  const result = duel
    ? { finalists: duelField(), winner: duelField()[0] }
    : runoff(game.campaign.field, game);
  game.campaign.runoff = result;

  const me = result.finalists.find((c) => c.isPlayer);
  game.campaign.result = {
    playerWon: result.winner.isPlayer,
    myShare: Math.round(me.share),
    winnerName: result.winner.name,
    winnerKey: result.winner.nameKey || null,
  };

  if (result.winner.isPlayer) {
    setPresident({ isPlayer: true, name: game.character.name || "", party: game.party });
    game.ended = { type: "victory" };
    return;
  }
  concedeElection(result.winner, me ? Math.round(me.share) : undefined);
}

/**
 * Ce que coûte une présidentielle perdue, quel que soit le tour où elle
 * s'arrête. Renvoie vrai si le parti retire la direction dans la foulée.
 */
/**
 * Une présidentielle perdue, et ce qu'elle laisse.
 *
 * ÊTRE ALLÉ AU SECOND TOUR NE SE PERD PAS. Le moteur ne comptait que la
 * défaite : on sortait d'un second tour à quarante-neuf pour cent avec
 * quatorze points de cote en moins, et l'on se retrouvait incapable d'obtenir
 * l'investiture de son propre parti. C'est l'inverse de ce qui se passe — un
 * finaliste devient le patron de son camp, même battu, surtout de peu.
 *
 * On ne retire par ailleurs la direction qu'à ceux qui l'avaient : le message
 * s'affichait pour des candidats qui n'avaient jamais dirigé le parti.
 */
/**
 * L'ÉCART ENTRE CE QU'ON VOUS A CONFIÉ ET CE QUE VOUS EN AVEZ FAIT, en points
 * de premier tour. C'est la seule mesure qui ait un sens : un candidat de
 * petit parti qui passe de huit à dix-huit pour cent a fait une très grande
 * campagne, et il l'a perdue.
 */
function campaignGap() {
  const c = game.campaign;
  if (!c || !c.first) return 0;
  const base = c.baseShare === undefined ? game.landscape[game.party] : c.baseShare;
  return c.first.myShare - base;
}

function concedeElection(winner, share) {
  setPresident({ name: winner.name, party: winner.party });
  bump(game, "notoriete", +1);
  bumpPop(game, +6);

  /* CE QU'ON REPROCHE À UN CANDIDAT, C'EST L'ÉCART, PAS LA DÉFAITE.
     Le moteur comptait un forfait : quatorze points de cote en moins pour
     qui sortait au premier tour, quatre points de paysage en moins pour tout
     le monde, sans jamais regarder le score. Le candidat d'un petit parti qui
     doublait sa part était donc puni exactement comme celui qui avait dilapidé
     un camp en tête des sondages, et un parti reprochait à quelqu'un de lui
     avoir fait gagner dix points.
     Un parti sait très bien faire cette différence : il compare ce qu'il
     valait et ce qu'il vaut le lendemain. */
  const ecart = campaignGap();
  bumpStanding(game, Math.max(-14, Math.min(12, Math.round(ecart * 1.6))));
  shiftLandscape(game.party, Math.max(-4, Math.min(4, ecart * 0.4)));

  // Le second tour compte en plus : y être allé installe, l'avoir frôlé
  // installe pour longtemps. Cela s'ajoute à l'écart, cela ne le remplace pas.
  if (share !== undefined) {
    const marge = 50 - share;
    bump(game, "credibilite", marge <= 2 ? 3 : marge <= 8 ? 2 : 1);
    bumpStanding(game, marge <= 2 ? 8 : marge <= 8 ? 4 : 0);
  }

  const etaitChef = leadsParty(game);
  if (!etaitChef || game.standing >= NOMINATION_THRESHOLD.chef) return false;

  // On rend la maison, pas le siège : le mandat a été gagné ailleurs, par
  // d'autres électeurs, et il n'était pas dans la balance.
  setPartyLead(game, false);
  bump(game, "reputation", -1);
  if (game.campaign && game.campaign.result) game.campaign.result.lostLeadership = true;
  return true;
}

function renderCampaignCard(host, card) {
  const campaign = game.campaign;
  const step = campaign.step;

  // Dimanche du second tour : le verdict.
  if (campaign.phase === "runoff") {
    const res = campaign.result;
    host.innerHTML =
      '<div class="event-card event-card-campaign">' +
        electionBanner("presidentielle", t("label_round2")) +
        '<p class="event-tag">' + cardHeader() + "</p>" +
        // Le titre du sondage répétait mot pour mot celui de la carte.
        pollHTML(campaign.runoff.finalists, "label_result", 1) +
        '<p class="event-text event-result">' +
          L(res.playerWon
            ? { fr: "Vous êtes élu président de la République avec " + res.myShare + " % des voix.",
                en: "You are elected president with " + res.myShare + "% of the vote." }
            : {
                fr: winnerName(res) + " l'emporte au second tour. Vous finissez à " + res.myShare + " %." +
                    (res.lostLeadership ? " Le parti vous retire la direction dans la foulée." : ""),
                en: winnerName(res) + " wins the runoff. You finish on " + res.myShare + "%." +
                    (res.lostLeadership ? " The party strips you of the leadership straight after." : ""),
              }) +
        "</p>" +
        continueButton("data-campaign-done") +
      "</div>";
    return;
  }

  // Dimanche du premier tour : il fallait être dans les deux premiers.
  if (campaign.phase === "first") {
    const first = campaign.first;
    const leader = first.leaderKey ? t(first.leaderKey) : first.leaderName;

    host.innerHTML =
      '<div class="event-card event-card-campaign">' +
        electionBanner("presidentielle", t("label_round1")) +
        '<p class="event-tag">' + cardHeader() + "</p>" +
        pollHTML(sortedField(), "label_round1") +
        '<p class="event-text event-result">' +
          L(first.qualified
            ? { fr: "Vous êtes au second tour avec " + first.myShare + " % des voix. Reste à convaincre ceux qui ont voté pour quelqu'un d'autre, et ils sont la majorité.",
                en: "You are through to the runoff on " + first.myShare + "%. Now you have to win over the people who voted for somebody else, and they are the majority." }
            : { fr: "Éliminé au premier tour avec " + first.myShare + " % des voix. " + (leader || "Un autre") + " ira au second tour, vous le regarderez comme tout le monde." +
                    (campaign.result && campaign.result.lostLeadership ? " Le parti vous retire la direction dans la foulée." : ""),
                en: "Knocked out in the first round on " + first.myShare + "%. " + (leader || "Somebody else") + " goes through to the runoff; you will watch it like everyone else." +
                    (campaign.result && campaign.result.lostLeadership ? " The party strips you of the leadership straight after." : ""),
              }) +
        "</p>" +
        continueButton(first.qualified ? "data-campaign-runoff" : "data-campaign-done") +
      "</div>";
    return;
  }

  // Les quinze jours du face-à-face. Même carte, mais le sondage affiché
  // n'est plus le premier tour : c'est le duel, et il fait cent pour cent.
  if (campaign.phase === "duel") {
    const scene = campaignEventById(card.id);
    const duel = campaign.duel;
    const dernier = duel.step >= RUNOFF_STEPS - 1;

    host.innerHTML =
      '<div class="event-card event-card-campaign">' +
        electionBanner("presidentielle", t("label_between") + " · " + t("step_of")
          .replace("{n}", duel.step + 1).replace("{total}", RUNOFF_STEPS)) +
        '<p class="event-tag">' + cardHeader() + "</p>" +
        pollHTML(duelField(), "label_round2", 1) +
        '<p class="event-sub-tag">' + L(scene.tag) + "</p>" +
        '<p class="event-text' + (card.resolved ? " event-result" : "") + '">' +
          (card.resolved ? card.resultText : fillText(scene.text, game)) + "</p>" +
        (card.resolved ? changesHTML(card.resultChanges) : "") +
        (card.resolved
          ? continueButton(dernier ? "data-campaign-verdict" : "data-duel-next")
          : '<div class="event-choices">' + choiceButtons(scene, game) + "</div>") +
      "</div>";
    return;
  }

  const ev = campaignEventById(card.id);
  const header = t("step_of").replace("{n}", step + 1).replace("{total}", CAMPAIGN_STEPS);

  host.innerHTML =
    '<div class="event-card event-card-campaign">' +
      electionBanner("presidentielle", header) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      pollHTML() +
      '<p class="event-sub-tag">' + L(ev.tag) + "</p>" +
      '<p class="event-text' + (card.resolved ? " event-result" : "") + '">' +
        (card.resolved ? card.resultText : fillText(ev.text, game)) + "</p>" +
      (card.resolved ? changesHTML(card.resultChanges) : "") +
      (card.resolved
        ? continueButton("data-campaign-next")
        : '<div class="event-choices">' + choiceButtons(ev, game) + "</div>") +
    "</div>";
}

/*
 * Après le dépouillement : soit la partie est gagnée, soit elle continue.
 */
function campaignDone() {
  const won = Boolean(game.ended);
  game.campaign = null;
  game.card = won ? { kind: "end" } : null;
  if (!won) advanceTurn();
  saveGame();
  renderAll();
}

/* Un temps de campagne : on applique le choix, le sondage bouge. */
function campaignChoice(target) {
  const ev = campaignEventById(game.card.id);
  const choice = ev.choices[Number(target.getAttribute("data-choice"))];
  const outcome = resolveChoice(choice, game);
  markSeen(ev, game);

  game.card.resolved = true;
  game.card.resultText = outcome.text;
  game.card.resultChanges = outcome.changes;
  addLog(outcome.log);
  saveGame();
  renderAll();
}

/* Passage au temps suivant, puis les deux dimanches de dépouillement. */
function campaignNext() {
  game.campaign.step++;
  game.age += 1 / CAMPAIGN_STEPS;
  driftCampaign(game);

  if (game.campaign.step >= CAMPAIGN_STEPS) {
    resolveFirstRound();
    game.campaign.phase = "first";
    game.card = { kind: "campaign", id: game.card.id, resolved: true };
  } else {
    game.card = { kind: "campaign", id: drawCampaignEvent().id, resolved: false };
  }
  saveGame();
  renderAll();
}

/* Le soir du premier tour ouvre l'entre-deux-tours au lieu de trancher. */
function campaignRunoff() {
  startDuel();
  saveGame();
  renderAll();
}

function duelNext() {
  game.campaign.duel.step++;
  driftRunoff(game);
  game.card = { kind: "campaign", id: drawRunoffEvent().id, resolved: false };
  saveGame();
  renderAll();
}

function campaignVerdict() {
  resolveRunoff();
  game.campaign.phase = "runoff";
  saveGame();
  renderAll();
}

MODES.campaign = {
  // Sans game.campaign, la carte n'a ni sondage ni compteur : on la laisse
  // au moteur plutôt que de dessiner une campagne vide.
  ready: () => Boolean(game.campaign),
  // LE DÉPOUILLEMENT S'AFFICHE MÊME PARTIE GAGNÉE : game.ended est posé avant
  // qu'on ait vu le résultat du vote, et on veut le voir.
  renderWhenEnded: true,
  render: renderCampaignCard,
  clicks: {
    "data-choice": campaignChoice,
    "data-campaign-next": campaignNext,
    "data-campaign-runoff": campaignRunoff,
    "data-duel-next": duelNext,
    "data-campaign-verdict": campaignVerdict,
  },
  // Celui-là doit répondre alors que la partie est déjà terminée : c'est lui
  // qui referme le dépouillement et ouvre l'écran de fin.
  clicksWhenEnded: { "data-campaign-done": campaignDone },
};
