/*
 * TEMPS FORT — L'INVESTITURE, ET CE QU'ON FAIT QUAND ON NE L'A PAS.
 *
 * Deux cartes, et c'est la même histoire vue des deux côtés.
 *
 * LA CARTE D'ÉLECTION ("election") pose la question : on y va, ou on laisse
 * passer son tour. Quand l'appareil ferme la porte, le bouton « se présenter »
 * devient « travailler l'appareil » — c'est le même écran, ce n'est plus la
 * même proposition.
 *
 * LA SCÈNE D'INVESTITURE REFUSÉE ("nomination") se joue quand la porte est
 * fermée mais que le compte n'est pas loin. On ne proposait qu'un bouton
 * « travailler l'appareil » : il y a désormais une scène, avec de vrais choix
 * et de vrais coûts — et, si l'écart est mince, LA DISSIDENCE : y aller sans
 * l'étiquette, ou claquer la porte et changer de camp.
 *
 * Ce que le moteur garde : standDown(), qui rend un mandat — la carte
 * ordinaire s'en sert aussi quand une scène coûte un siège.
 */

/**
 * Une scène d'investiture refusée. Le paquet est petit, donc on accepte de
 * revoir une scène déjà jouée si tout a été vu : une carrière bloquée l'est
 * souvent plusieurs fois, et toujours par les mêmes gens.
 */
/*
 * UNE INVESTITURE REFUSÉE N'EST PAS LA MÊME PARTOUT.
 *
 * Le paquet était tiré sans regarder le scrutin : on voyait donc, pour la
 * direction du parti, une investiture « donnée à quelqu'un que personne n'a
 * jamais vu ici, envoyé par le siège » et une fédération furieuse. On ne
 * parachute pas un chef de parti, et il n'y a pas de liste à équilibrer dans
 * un congrès. Les scènes qui parlent de listes et de circonscriptions portent
 * donc un champ "election", sur le modèle du champ "race" du paquet des
 * campagnes ; celles qui parlent de l'appareil valent partout.
 */
function drawNomination(electionId) {
  const eligible = NOMINATION_EVENTS.filter((ev) =>
    (!ev.election || ev.election.includes(electionId)) &&
    eventMatches({ ...ev, id: null }, game));
  if (!eligible.length) return null;

  const fresh = eligible.filter((ev) => !game.seen[ev.id]);
  const repli = sansTrace(eligible);
  const secours = sansTrace(NOMINATION_EVENTS.filter((ev) =>
    !ev.election || ev.election.includes(electionId)));

  let pool = fresh.length ? fresh : (repli.length ? repli : secours);
  if (!pool.length) return null;

  // Une carrière est bloquée dix fois : sans cette garde, le paquet de repli
  // rejouait la même scène deux fois de suite dès qu'il était réduit, et
  // c'est exactement ce qui donnait l'impression d'une boucle.
  const autres = pool.filter((ev) => ev.id !== game.lastNominationId);
  if (autres.length) pool = autres;

  const ev = pool[randInt(pool.length)];
  game.lastNominationId = ev.id;
  setScene(ev);
  return ev;
}

/** Le parti refuse-t-il l'investiture faute de cote suffisante ? */

function inTheRunning(stake) {
  // Un sortant est toujours dans la course pour son propre siège, si bas
  // soit-il : c'est le sien, et ne pas se représenter le lui coûte.
  if (stake.defense) return true;

  const need = nominationNeed(stake, game);
  if (need === undefined) return true;
  return game.standing >= need - NOMINATION_REACH;
}

function nominationBlocked(stake) {
  // Une investiture deja accordee ne se refuse pas deux fois : le parti a
  // donne la tete de liste, il ne peut pas barrer la porte au meme scrutin.
  if (stake.listHead) return false;

  const need = nominationNeed(stake, game);
  if (need === undefined) return false;
  return game.standing < need;
}

/**
 * Ce que rapporte une campagne passée dans les fédérations plutôt que dans les
 * urnes. Rendements décroissants : c'est ainsi qu'on se fait connaître de
 * l'appareil, ce n'est pas ainsi qu'on le prend.
 */
function lobbyGain(s) {
  return Math.max(2, Math.round(9 * (1 - s.standing / 130)));
}

/* ==========================================================================
   QUAND ON REFUSE DE SE LAISSER ÉCARTER
   ==========================================================================
   Le refus d'investiture était un mur : à un point du seuil, avec soixante-dix
   de cote et une bonne popularité, on lisait « ce ne sera pas vous » et on
   n'avait que des scènes de couloir pour s'occuper. Aucune part de hasard,
   aucun recours, rien à décider.

   Deux portes s'ouvrent donc sur chaque carte d'investiture refusée.

   SE PRÉSENTER QUAND MÊME — la candidature dissidente. On y va contre
   l'appareil, le scrutin a lieu pour de bon, et la direction fait payer
   l'affront quoi qu'il arrive. Réservée à ceux qui sont assez près du compte
   pour que ce ne soit pas ridicule, et aux scrutins où le pays vote : voir
   dissidencePossible().

   CLAQUER LA PORTE — on ne prend pas la direction d'un parti qui n'en veut
   pas, alors on en change. C'est cher, définitif, et parfois c'est la seule
   chose qui reste.
   ========================================================================== */






function rebelGap(card) {
  // La carte porte le poste visé et le mandat éventuellement défendu : de
  // quoi retrouver le tarif réel, primes comprises.
  const need = nominationNeed({ target: card.target, defense: Boolean(card.defends) }, game);
  if (need === undefined) return null;
  return need - game.standing;
}

/**
 * UNE DISSIDENCE A BESOIN D'ÉLECTEURS.
 *
 * On se présente sans l'investiture parce qu'il existe un bulletin où le pays
 * peut préférer votre nom à celui que le parti a retenu : la dissidence est
 * un appel par-dessus l'appareil, et elle suppose quelqu'un à qui faire
 * appel. La direction du parti ne se prend pas devant le pays. Elle se prend
 * dans une salle qui appartient au parti, devant des militants qui sont
 * l'appareil lui-même, et « se présenter sans l'investiture » à son propre
 * congrès ne veut rien dire : le geste qui y correspond, c'est déposer une
 * motion sans avoir le compte de signatures, et la scène du congrès le
 * propose déjà, avec la commission des statuts qui la déclare irrecevable en
 * douze secondes.
 *
 * Quand la maison vous ferme sa direction, il reste la porte.
 */
function dissidencePossible(card) {
  return card.target !== "chef";
}

function rebellionButtons(card) {
  if (!card.target) return "";

  const gap = rebelGap(card);
  let html = "";

  if (dissidencePossible(card) &&
      gap !== null && gap <= REBEL_REACH && game.popularity >= REBEL_POPULARITY) {
    html += '<button type="button" class="event-choice is-unlocked" data-rebel="run">' +
      '<span class="choice-key" aria-hidden="true">◆</span>' +
      '<span class="choice-label">' + t("rebel_run") + "</span>" +
      '<span class="choice-notes"><span class="choice-why">' + t("rebel_run_note") + "</span></span>" +
      "</button>";
  }

  const refuge = rebelRefuge();
  if (refuge) {
    html += '<button type="button" class="event-choice is-unlocked" data-rebel="leave">' +
      '<span class="choice-key" aria-hidden="true">◆</span>' +
      '<span class="choice-label">' + t("rebel_leave").replace("{party}", t("party_the_" + refuge)) + "</span>" +
      '<span class="choice-notes"><span class="choice-why">' + t("rebel_leave_note") + "</span></span>" +
      "</button>";
  }
  return html;
}

/**
 * Le camp voisin le mieux placé pour vous accueillir.
 *
 * PAS CELUI QU'ON A DÉJÀ QUITTÉ. Le bouton porte la mention « Définitif. On ne
 * revient pas dans un parti qu'on a quitté », et le jeu proposait quand même
 * d'y revenir : le refuge se choisissait sur la seule distance idéologique,
 * qui ne se souvient de rien. Une porte claquée reste fermée.
 */
function rebelRefuge() {
  const parcours = partyHistory(game);
  const voisins = Object.keys(PARTIES)
    .filter((k) => k !== game.party && !parcours.includes(k) &&
                   ideologicalDistance(k, game.party) <= NEIGHBOUR_DISTANCE)
    .sort((a, b) => game.landscape[b] - game.landscape[a]);
  return voisins[0] || null;
}

/**
 * Le parti ferme la porte. La cote interne est une abstraction : on ne
 * l'écrit jamais en chiffres, on raconte ce qu'elle vaut. Trois degrés
 * selon la distance au seuil, pour que le joueur sente s'il est près du
 * but ou hors course.
 */
function blockedPitch(stake) {
  const gap = nominationNeed(stake, game) - game.standing;

  // UN CONGRÈS N'INVESTIT PERSONNE. Ce qui vous barre la route n'est pas une
  // commission qui choisit un candidat pour un siège, ce sont des secrétaires
  // de fédération qui ne signent pas votre motion. Le sortant est logé à la
  // même enseigne : il ne défend pas la maison sans déposer de texte, et
  // standDown() lui fait déjà rendre la direction faute de motion.
  if (stake.target === "chef") {
    if (gap > 16) {
      return L({
        fr: "Vous cherchez des signatures pour déposer une motion. Les fédérations vous reçoivent très bien, vous offrent le café et signent chez quelqu'un d'autre.",
        en: "You go looking for signatures to table a motion. The federations receive you warmly, offer you coffee and sign somebody else's.",
      });
    }
    if (gap > 6) {
      return L({
        fr: "Vous réunissez la moitié des signatures qu'exige une motion. On vous dit d'attendre le prochain congrès, du ton dont on l'a dit à tous ceux qui n'y sont jamais revenus.",
        en: "You gather half the signatures a motion requires. You are told to wait for the next congress, in the tone used on everyone who never came back to one.",
      });
    }
    return L({
      fr: "Il vous manque deux fédérations pour déposer votre motion. Deux secrétaires qui ne rappellent pas, et la direction se joue sans vous.",
      en: "You are two federations short of tabling your motion. Two secretaries who do not call back, and the leadership is decided without you.",
    });
  }

  const role = t("pos_" + stake.target).toLowerCase();

  if (gap > 16) {
    return L({
      fr: "La commission d'investiture s'est réunie sans que votre nom soit prononcé une seule fois. On ne vous voit pas " + role + ", on ne vous voit pas du tout.",
      en: "The nominations committee met without your name coming up once. They do not see you as " + role + "; they do not see you at all.",
    });
  }
  if (gap > 6) {
    return L({
      fr: "Votre candidature a été évoquée puis écartée. « Pas cette fois », vous dit-on, avec ce ton qui signifie qu'on vous trouve prématuré.",
      en: "Your name came up and was set aside. “Not this time,” they say, in the tone that means they find you premature.",
    });
  }
  return L({
    fr: "Vous avez manqué l'investiture de très peu. Deux ou trois soutiens de plus dans la salle et la décision basculait.",
    en: "You missed the nomination by a hair. Two or three more backers in the room and it would have gone your way.",
  });
}

function electionPitch(electionId, stake) {
  if (electionId === "presidentielle") {
    return L({
      fr: "L'élection présidentielle est là. Vous menez votre parti : c'est peut-être votre tour.",
      en: "The presidential election has arrived. You lead your party: this may be your moment.",
    });
  }
  // LE CONGRÈS NE MET PAS UN SIÈGE DANS LA BALANCE. Ce qui se joue est une
  // maison, et le joueur doit le lire avant de se décider, pas après : c'est
  // exactement l'information qui manquait quand prendre le parti coûtait un
  // mandat.
  if (stake.target === "chef") {
    const mandat = MANDATES.includes(game.position)
      ? fillMarks(L({
          fr: " Vous restez {pos_low:" + game.position + "} quoi qu'il arrive : un congrès ne compte pas les électeurs, il compte les militants.",
          en: " You remain {pos_low:" + game.position + "} either way: a congress does not count voters, it counts members.",
        }))
      : "";
    return L(stake.defense
      ? { fr: "Le congrès du parti. Votre direction est remise en jeu, et quelqu'un a déposé une motion contre vous.",
          en: "The party congress. Your leadership is on the line, and somebody has tabled a motion against you." }
      : { fr: "Le congrès du parti. La direction est à prendre, et l'on ne la prend pas au pays : on la prend aux fédérations.",
          en: "The party congress. The leadership is there to be taken, and it is not taken from the country: it is taken from the federations." }) + mandat;
  }
  if (stake.defense) {
    return L({
      fr: "Votre mandat remis en jeu. Une défaite ne vous rendrait rien : on ne tient qu'un mandat, et vous n'en auriez plus.",
      en: "Your seat is on the line. Defeat would hand you nothing back: you only hold one office, and you would no longer have it.",
    });
  }
  // ON NE TIENT QU'UN MANDAT. Le joueur qui brigue autre chose que son
  // propre siège n'était prévenu de rien : il découvrait après coup que sa
  // mairie avait servi de monnaie d'échange. Perdre ne coûte rien ici, c'est
  // gagner qui coûte, et c'est exactement l'arbitrage qu'il faut poser avant
  // le vote et non après. C'est aussi la règle réelle depuis la loi sur le
  // cumul : on ne démissionne pas pour se présenter, on choisit une fois élu.
  const quitte = MANDATES.includes(game.position) ? game.position : null;
  const enJeu = L({
    fr: "Les " + t("elec_" + electionId).toLowerCase() + " approchent. Une investiture est à portée : " + t("pos_" + stake.target).toLowerCase() + ".",
    en: "The " + t("elec_" + electionId).toLowerCase() + " are coming. A nomination is within reach: " + t("pos_" + stake.target).toLowerCase() + ".",
  });
  if (!quitte) return enJeu;

  return enJeu + " " + fillMarks(L({
    fr: "Vous êtes {pos_low:" + quitte + "} : gagner vous ferait rendre ce mandat le soir même. Perdre ne vous le prendrait pas.",
    en: "You are {pos_low:" + quitte + "}: winning would mean giving that seat up the same evening. Losing would not take it from you.",
  }));
}

function renderNominationCard(host, card) {
  const ev = eventById(card.id);
  // Ce qui se joue, en toutes lettres. La carte disait « investiture
  // refusée » sans jamais nommer le scrutin ni le siège.
  const enjeu = card.target
    ? '<p class="event-text nomination-stake">' +
        fillMarks(L(card.target === "chef"
          // Le congrès ne désigne pas un candidat, il désigne un chef, et ce
          // qui vous en écarte n'est pas une investiture refusée mais une
          // motion qu'on ne peut pas déposer.
          ? { fr: "Le congrès va se donner un chef. Sans les signatures qu'exige une motion, ce ne sera pas vous.",
              en: "The congress is about to give itself a leader. Without the signatures a motion requires, it will not be you." }
          : { fr: "Le parti désigne son candidat {pos_low:" + card.target + "}. Ce ne sera pas vous.",
              en: "The party is picking its candidate for {pos_low:" + card.target + "}. It will not be you." })) + "</p>"
    : "";

  // Une scène de l'appareil se joue aussi bien avant un congrès qu'avant une
  // législative, mais son étiquette, elle, ne voyage pas : « Investiture
  // refusée » au-dessus d'un congrès nomme une chose qui n'existe pas.
  const tag = card.election === "congres"
    ? L({ fr: "Direction refusée", en: "Leadership denied" })
    : L(ev.tag);

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner(card.election) +
      '<p class="event-tag">' + tag + " · " + cardHeader() + "</p>" +
      (card.resolved
        ? '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) + continueButton("data-continue")
        : enjeu + '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
          '<div class="event-choices">' + choiceButtons(ev, game) +
            rebellionButtons(card) + "</div>") +
    "</div>";
}

/*
 * Un scrutin qui se joue sans vous : on annonce le résultat, puis on
 * demande ce que vous avez fait de ces six semaines.
 */
function renderElectionCard(host, card) {
  const stake = card.aside ? null : playerStake(card.id);

  if (!card.resolved) {
    if (!stake) {
      // Élection sans le joueur : résolue immédiatement en carte informative.
      const text = backgroundElectionText(card.id);
      card.resolved = true;
      card.resultText = fillMarks(L(text));
      addLog(text);
      saveGame();
      renderCard();
      return;
    }
    const blocked = nominationBlocked(stake);

    // CE QU'ON SAIT AVANT D'Y ALLER. Le joueur décidait à l'aveugle : le
    // sondage n'apparaissait qu'une fois la campagne lancée. Il a désormais
    // le même tableau que pendant la campagne, plus la phrase qui dit où
    // l'on en est — et rien de chiffré sur ses propres chances, parce que
    // personne n'a jamais eu ce chiffre-là.
    const avis = blocked ? "" :
      (pollFor(card.id, stake, 0) ? pollHTML(pollFor(card.id, stake, 0), "label_poll_before") : "") +
      '<p class="event-text race-mood">' + t(moodFor(card.id, stake, 0)) + "</p>";

    host.innerHTML =
      '<div class="event-card event-card-election">' +
        electionBanner(card.id) +
        '<p class="event-tag">' + cardHeader() + "</p>" +
        '<p class="event-text">' +
          (blocked ? blockedPitch(stake) : electionPitch(card.id, stake)) + "</p>" +
        avis +
        '<div class="event-choices">' +
          (blocked
            ? '<button type="button" class="event-choice" data-lobby>' + t("game_lobby") + "</button>"
            : '<button type="button" class="event-choice" data-run>' + t("game_run") + "</button>") +
          '<button type="button" class="event-choice" data-skip>' + t("game_decline") + "</button>" +
        "</div>" +
      "</div>";
  } else {
    host.innerHTML =
      '<div class="event-card event-card-election">' +
        electionBanner(card.id) +
        '<p class="event-tag">' + cardHeader() + "</p>" +
        '<p class="event-text event-result">' + card.resultText + "</p>" +
        changesHTML(card.resultChanges) +
        continueButton("data-continue") +
      "</div>";
  }
}

function electionRun() {
  const id = game.card.id;
  const stake = playerStake(id);

  // Quand on pèse assez pour choisir son terrain, on le choisit avant de
  // faire campagne : c'est une décision, elle mérite son écran.
  if (seatChoiceAvailable(id, stake)) {
    game.card = { kind: "seat", id, resolved: false };
    saveGame();
    renderAll();
    return;
  }

  // Tout sauf la présidentielle passe désormais par deux ou trois temps de
  // campagne. La présidentielle, elle, a déjà les siens.
  if (stake && id !== "presidentielle") {
    startRace(id, stake);
    saveGame();
    renderAll();
    return;
  }

  const before = snapshot(game);
  const outcome = resolveElectionRun(id);
  game.card.resolved = true;
  game.card.resultChanges = diffSince(before, game);

  if (outcome.final) {
    game.card = { kind: "end" };
  } else if (id === "presidentielle") {
    const battu = {
      fr: "Battu" + (outcome.beatenBy ? " par " + outcome.beatenBy : " par le sortant") + ". Il faudra cinq ans de plus.",
      en: "Beaten" + (outcome.beatenBy ? " by " + outcome.beatenBy : " by the incumbent") + ". It will take five more years.",
    };
    game.card.resultText = L(battu);
    addLog(battu);
  } else {
    // Le même texte que le dépouillement d'une campagne : la soirée se
    // raconte à la marge, qu'on ait fait campagne ou non.
    const soir = outcomeText(outcome.outcome);
    game.card.resultText = fillMarks(L(soir));
    addLog(soir);
  }
  saveGame();
  renderAll();
}

/*
 * LA DISSIDENCE. Deux façons de refuser l'investiture qu'on vous refuse :
 * y aller quand même sous sa propre étiquette, ou claquer la porte.
 */
function rebelChoice(target) {
  const quoi = target.getAttribute("data-rebel");

  // LA DISSIDENCE. Le scrutin a lieu pour de bon, avec les mêmes temps de
  // campagne que n'importe quel autre, mais on le mène sans la machine : le
  // handicap part avec la campagne et ne se rattrape qu'en la jouant bien.
  if (quoi === "run") {

    const carte = game.card;
    const stake = playerStake(carte.election);
    if (!stake) return;

    startRace(carte.election, stake);
    game.race.bonus += REBEL_HANDICAP;
    game.race.rebel = true;
    addLog({
      fr: "Vous déposez votre candidature sans l'investiture {party_of:" + game.party + "}. Le siège apprend la nouvelle par la presse, ce qui était le but.",
      en: "You file your candidacy without the party's endorsement. Headquarters learns of it from the press, which was the point.",
    });
    saveGame();
    renderAll();
    return;
  }

  // CLAQUER LA PORTE. switchParty fait tout le travail : la marque de
  // renégat, la cote qu'on laisse derrière soi, le paysage qui se déplace.
  // Reste à dire ce qu'il advient du siège qu'on ne défendra pas.
  const carte = game.card;
  const refuge = rebelRefuge();
  if (!refuge) return;

  const avant = snapshot(game);
  const quitte = switchParty(game, refuge);
  if (!quitte) return;

  const rendu = carte.defends
    ? standDown({ defense: true, target: carte.defends })
    : null;

  carte.resolved = true;
  carte.resultChanges = diffSince(avant, game);
  carte.resultText = fillMarks(L({
    fr: "Vous écrivez une lettre de quatre lignes et vous la rendez publique avant qu'on ait pu la lire au siège. On vous accueille le jour même chez {party_the:" + refuge + "}, avec des égards que vous ne reverrez plus jamais.",
    en: "You write a four-line letter and make it public before anyone at headquarters has read it. You are taken in the same day by {party_the:" + refuge + "}, with a warmth you will never see again.",
  }) + (rendu ? " " + L(rendu) : ""));
  saveGame();
  renderAll();
}

function electionLobby() {
  const before = snapshot(game);
  // Travailler l'appareil rapporte d'autant moins qu'on y est déjà installé :
  // les dîners de fédération font un inconnu, ils ne font pas un chef.
  bumpStanding(game, lobbyGain(game));
  bump(game, "reseau", +1);
  bump(game, "energie", -1);
  // Le temps passé dans les fédérations est du temps passé loin du bulletin :
  // un sortant qui ne se représente pas rend son mandat.
  const rendu = standDown(playerStake(game.card.id));
  game.card.resolved = true;
  game.card.resultChanges = diffSince(before, game);
  const appareil = {
    fr: "Vous passez la campagne dans les fédérations plutôt que dans les urnes. Des dîners, des promesses, quelques appuis gagnés à l'usure.",
    en: "You spend the campaign in the party bodies rather than at the ballot box. Dinners, promises, a few backers won by attrition.",
  };
  game.card.resultText = fillMarks(L(appareil) + (rendu ? " " + L(rendu) : ""));
  addLog(appareil);
  saveGame();
  renderAll();
}

function electionSkip() {
  const before = snapshot(game);
  const rendu = game.card.kind === "election" ? standDown(playerStake(game.card.id)) : null;
  game.card.resolved = true;
  if (rendu) game.card.resultChanges = diffSince(before, game);
  // « Les absents ont toujours tort, mais ils durent » ne vaut que pour qui
  // n'a rien à perdre : un sortant qui ne se représente pas ne dure pas.
  game.card.resultText = fillMarks(rendu ? L(rendu) : L({
    fr: "Vous laissez passer votre tour. Les absents ont toujours tort, mais ils durent.",
    en: "You sit this one out. The absent are always wrong, but they last.",
  }));
  saveGame();
  renderAll();
}

MODES.nomination = {
  render: renderNominationCard,
  clicks: { "data-rebel": rebelChoice },
};

MODES.election = {
  render: renderElectionCard,
  clicks: {
    "data-run": electionRun,
    "data-lobby": electionLobby,
    "data-skip": electionSkip,
  },
};
