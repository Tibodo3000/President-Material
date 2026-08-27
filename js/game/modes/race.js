/*
 * TEMPS FORT — LA COURSE D'UNE ÉLECTION ORDINAIRE.
 *
 * Municipales, européennes, législatives, congrès : quand le joueur s'y
 * présente, ce n'est pas un clic. Deux ou trois temps de campagne, chacun
 * déplaçant un avantage CACHÉ (l'effet "score"), puis le dépouillement à la
 * marge. Le joueur voit un sondage et une phrase d'ambiance — « c'est
 * serré » — jamais un chiffre : le sondage EST la marge traduite en
 * pourcentages, il ne peut donc pas mentir sans que le résultat mente aussi.
 *
 * Le mode couvre aussi LE CHOIX DU TERRAIN (la carte "seat") : trois portes,
 * et chacune dit ce qu'elle coûte. Elle précède la course et n'existe que
 * pour elle, d'où les deux entrées dans le registre en fin de fichier.
 *
 * Ce que le moteur garde : ce que VAUT un résultat (ELECTION_OUTCOMES,
 * outcomeFor, applyOutcome, outcomeText, leadershipText) et le calcul du
 * sondage (pollFor, moodFor). Une élection peut se résoudre sans campagne —
 * resolveElectionRun s'en sert aussi.
 */

/** Combien de temps dure une campagne, selon ce qui se joue. */
const RACE_STEPS = {
  municipales: 2,
  congres: 2,
  europeennes: 2,
  legislatives: 3,
};

/**
 * On ne fait pas campagne pour soi quand on brigue un siège de conseiller :
 * on est sur la liste de quelqu'un d'autre, on colle des affiches à son nom
 * et on découvre son propre score le dimanche soir. Un seul temps suffit à
 * raconter ça ; deux en faisaient une campagne personnelle qu'elle n'est pas.
 */
const RACE_STEPS_BY_TARGET = { conseiller: 1 };

function raceSteps(electionId, target) {
  const cible = target || (game.race && game.race.stake && game.race.stake.target);
  if (cible && RACE_STEPS_BY_TARGET[cible] !== undefined) return RACE_STEPS_BY_TARGET[cible];
  return RACE_STEPS[electionId] || 2;
}

function startRace(electionId, stake) {
  game.race = { id: electionId, step: 0, bonus: 0, used: [], moment: null, stake };
  game.card = { kind: "race", id: drawRaceEvent().id, resolved: false };
}

/**
 * Un temps de campagne. On préfère toujours ce que le joueur n'a jamais vu,
 * et on ne rejoue jamais deux fois la même scène dans une même campagne.
 */
function drawRaceEvent() {
  const used = game.race.used;
  const temps = raceSteps(game.race.id);
  const eligible = RACE_EVENTS.filter((ev) => {
    if (used.includes(ev.id)) return false;
    if (ev.race && !ev.race.includes(game.race.id)) return false;
    // Une scène de dernière semaine n'a aucun sens au premier temps, et une
    // scène de cinquième semaine n'en a plus une fois qu'on l'a passée.
    if (!momentFits(ev, game.race, temps)) return false;
    return eventMatches({ ...ev, id: null }, game);
  });

  // Le dernier recours ignore les scènes déjà jouées dans CETTE campagne
  // plutôt que d'autoriser une scène à trace : mieux vaut revoir un décor que
  // récolter une marque parce que le paquet est vide.
  const fresh = eligible.filter((ev) => !game.seen[ev.id]);
  const repli = sansTrace(eligible);
  const secours = sansTrace(RACE_EVENTS.filter((ev) =>
    momentOf(ev) === null && (!ev.race || ev.race.includes(game.race.id))));

  const pool = fresh.length ? fresh : (repli.length ? repli : secours);
  const ev = pool.length ? pool[randInt(pool.length)] : RACE_EVENTS[0];

  used.push(ev.id);
  rememberMoment(ev, game.race);
  setScene(ev);
  return ev;
}

function raceEventById(id) {
  return RACE_EVENTS.find((e) => e.id === id) || RACE_EVENTS[0];
}

/**
 * LE SONDAGE D'UNE CAMPAGNE ORDINAIRE.
 *
 * Ce n'est pas un second système : c'est la marge du dépouillement, mise en
 * pourcentages. Ce que le joueur lit est donc exactement ce qui va se passer,
 * au dé près, et le sondage ne peut pas mentir sans que le résultat mente
 * aussi.
 *
 * Les adversaires n'ont pas de nom : dans une législative, on affronte le
 * candidat d'un parti, et c'est précisément ce que le scrutin a de brutal.
 * Le congrès, lui, n'a pas de sondage : on n'interroge pas le pays sur un
 * vote de militants.
 */
function racePoll() {
  const race = game.race;
  return pollFor(race.id, race.stake, race.bonus);
}

function raceMood() {
  return moodFor(game.race.id, game.race.stake, game.race.bonus);
}

/* ==========================================================================
   OÙ L'ON SE PRÉSENTE
   ==========================================================================
   Trois terrains, trois paris : un bastion qu'on garde, une circonscription
   ordinaire, ou l'imprenable qu'on prend pour se faire un nom.
   ========================================================================== */

/** La cote au parti à partir de laquelle on choisit son terrain. */
const SEAT_CHOICE_STANDING = 55;

/*
 * DEUX NOMBRES PAR TERRAIN, ET LE SECOND EST LE PLUS IMPORTANT.
 *
 * `threshold` déplace la barre. `wind` dit CE QUE LE TERRAIN DOIT AU VENT
 * NATIONAL, et c'est là que se jouait tout le problème : le terrain ne
 * pesait que neuf ou onze points sur une marge que le rapport de force et le
 * dé déplacent de trente. Mesuré sur cent cinquante carrières, un bastion se
 * gagnait cinquante-quatre fois sur cent — un pile ou face — pendant que la
 * carte promettait « gagné d'avance, on vous offre le siège ».
 *
 * Or un bastion n'est pas un siège un peu plus facile : c'est un siège où le
 * rapport de force national ne s'applique pas. C'est même sa définition — il
 * tient quand le camp s'effondre partout ailleurs, et le jeu l'écrit déjà à
 * propos des maires sortants. Il est donc ABRITÉ du vent, et le prix de
 * l'abri est de ne pas profiter des bonnes années non plus.
 *
 * L'imprenable fait l'inverse, et c'est ce qui en fait un pari plutôt qu'une
 * punition : le vent y souffle PLUS FORT qu'ailleurs. Une circonscription
 * qu'on ne gagne jamais est exactement celle qui bascule le jour où le pays
 * bascule. On la perd huit fois sur dix ; les deux autres fois, c'est qu'il
 * se passait quelque chose dans le pays, et le joueur pouvait le lire dans le
 * rapport de force avant de choisir.
 */
const SEAT_KINDS = {
  bastion:    { threshold: -4, wind: 0.3 },
  ordinaire:  { threshold: 0,   wind: 1 },
  imprenable: { threshold: 4,  wind: 1.6 },
};

/**
 * Le choix n'est proposé que pour une conquête, sur un scrutin où l'on est
 * réellement placé quelque part. On ne choisit pas où défendre son propre
 * siège, et un congrès de parti n'a pas de circonscription.
 */
const SEAT_ELECTIONS = ["municipales", "legislatives", "europeennes"];

/**
 * IMPRENABLE VEUT DIRE IMPRENABLE.
 *
 * Le décalage de seuil déplaçait les probabilités, il ne garantissait rien :
 * une imprenable mettait quand même le joueur en tête du premier sondage une
 * fois sur dix — et une fois sur trois quand le camp était haut dans le pays.
 * Un mot qui est vrai neuf fois sur dix n'est pas un mot, c'est une tendance.
 *
 * Or ON CHOISIT LA CIRCONSCRIPTION, PAS LE CANDIDAT. Le secrétaire général ne
 * pose pas un handicap sur quelqu'un : il ouvre un dossier et il en sort une
 * ville qui correspond à l'étiquette. Si le candidat est excellent et le camp
 * haut, il prend simplement une ville plus dure — l'imprenable existe pour
 * tout le monde, il suffit de la chercher un peu plus loin.
 *
 * Le terrain garantit donc une MARGE DE DÉPART, celle que le joueur lit sur le
 * premier sondage : devant dans un bastion, derrière dans une imprenable,
 * toujours. Le décalage de seuil reste par-dessous et continue de faire le
 * gros du travail les mauvaises années ; la garantie ne fait que refuser les
 * cas où l'étiquette aurait menti.
 */
const SEAT_EDGE = { bastion: 10, imprenable: -14 };

function seatThreshold(electionId, stake, kind) {
  const terrain = SEAT_KINDS[kind] || SEAT_KINDS.ordinaire;
  const seuil = stake.threshold + (terrain.threshold || 0);

  const edge = SEAT_EDGE[kind];
  if (edge === undefined) return seuil;

  // Le seuil qui place exactement le joueur là où l'étiquette le promet. On
  // garde le plus dur des deux pour une imprenable, le plus doux pour un
  // bastion : la garantie est un plancher, jamais un plafond.
  const garanti = electionBase(electionId, { ...stake, seat: kind }) + LUCK_MEAN - edge;
  return edge > 0 ? Math.min(seuil, garanti) : Math.max(seuil, garanti);
}

function seatChoiceAvailable(electionId, stake) {
  return Boolean(stake) && !stake.defense &&
    SEAT_ELECTIONS.includes(electionId) &&
    game.standing >= SEAT_CHOICE_STANDING;
}

/** Le dépouillement, une fois les temps de campagne joués. */
/** Ajoute une phrase à un texte bilingue sans le dupliquer des deux côtés. */
function ajouter(texte, suite) {
  return { fr: texte.fr + suite.fr, en: texte.en + suite.en };
}

function resolveRace() {
  const stake = game.race.stake;

  /* CE QU'ON VOUS PROMETTAIT, ET CE QUI EST SORTI DES URNES.
     Deux nombres, et le moteur n'en connaissait qu'un. Le sondage affiché
     pendant la campagne — et, faute de mieux, sur la carte de résultat —
     valait la marge SANS LE DÉ ; le verdict, lui, se tirait avec. On lisait
     donc « vous êtes à six points » sous le mot « déroute », et les deux
     étaient vrais dans leur monde respectif.
     On garde les deux : l'attendu sert à savoir ce qu'on vous reprochera, le
     réel sert à tout le reste, à commencer par le tableau qu'on affiche. */
  const attendu = electionBase(game.race.id, stake) + game.race.bonus + LUCK_MEAN - stake.threshold;
  const marge = electionBase(game.race.id, stake) + electionLuck() + game.race.bonus - stake.threshold;
  const sondage = pollFor(game.race.id, stake, game.race.bonus, marge);
  const before = snapshot(game);

  const res = applyOutcome(game.race.id, stake, marge, attendu);
  const won = res.won;
  let texte = outcomeText(res);

  /* QUAND LE SONDAGE S'EST TROMPÉ, ON LE DIT — ET ON DIT AUSSI CE QUE ÇA
     CHANGE. Perdre en étant donné devant arrive, et doit arriver : c'est le
     sel d'une soirée électorale. Mais une conséquence qu'on ne relie pas à sa
     cause ne se lit pas comme un coup du sort, elle se lit comme un bug —
     et c'est vrai dans les deux sens. Le joueur qui prend trois points de
     cote pour une déroute a autant besoin de savoir pourquoi que celui qui
     en prend quinze pour une défaite d'un cheveu. */
  const donneDevant = attendu >= 4;
  const donneDerriere = attendu <= -4;

  if (donneDevant && !won) {
    texte = ajouter(texte, {
      fr: " Tous les sondages vous donnaient devant, et ils avaient tort. On expliquera la participation, le report du second tour, le temps qu'il faisait ; personne ne saura jamais lequel des trois, et au siège on ne retiendra que vous.",
      en: " Every poll had you ahead, and every poll was wrong. They will blame turnout, the second-round transfers, the weather; nobody will ever know which of the three, and at headquarters the only name remembered will be yours.",
    });
  } else if (donneDerriere && !won) {
    texte = ajouter(texte, {
      fr: " Personne ne vous avait promis cette élection, et personne au siège ne fera semblant du contraire : on ne reproche pas à quelqu'un d'avoir perdu ce que le parti n'a jamais tenu.",
      en: " Nobody had promised you this one, and nobody at headquarters will pretend otherwise: you are not blamed for losing what the party never held.",
    });
  } else if (donneDerriere && won) {
    texte = ajouter(texte, {
      fr: " Aucun sondage ne vous donnait gagnant. Vous passez la soirée à expliquer que vous n'aviez jamais douté, ce qui est faux et ce que personne ne vous demande de prouver.",
      en: " No poll had you winning. You spend the evening explaining that you never doubted it, which is untrue and which nobody asks you to prove.",
    });
  } else if (donneDevant && won) {
    texte = ajouter(texte, {
      fr: " On vous félicite comme on félicite quelqu'un qui a fait exactement ce qu'on attendait de lui, c'est-à-dire poliment et sans y revenir.",
      en: " They congratulate you the way people congratulate somebody who did exactly what was expected, which is politely and only once.",
    });
  }

  // La note de la dissidence : l'appareil la présente une fois le résultat
  // connu, et il la module selon le résultat.
  if (game.race.rebel) {
    bumpStanding(game, won ? REBEL_COST_WON : REBEL_COST_LOST);
    bump(game, "energie", -1);
    const suite = won
      ? { fr: " Vous y êtes allé contre l'appareil et vous avez gagné. Il vous le fera payer moins cher que prévu, et pendant beaucoup plus longtemps.",
          en: " You went against the machine and you won. It will charge you less than it intended, and for a great deal longer." }
      : { fr: " Vous y êtes allé contre l'appareil et vous avez perdu. Il n'y a pas de mot pour cela au siège, seulement une liste, et vous y êtes.",
          en: " You went against the machine and you lost. There is no word for that at headquarters, only a list, and you are on it." };
    texte = ajouter(texte, suite);
  }

  game.race.result = { won, text: texte, poll: sondage, verdict: res,
                       changes: diffSince(before, game) };
  addLog(texte);
  return won;
}

/**
 * Un temps de campagne, ou le résultat. L'état de la campagne est raconté,
 * jamais chiffré : on dit « c'est serré », pas « il vous manque quatre points ».
 */
function renderRaceCard(host, card) {
  const race = game.race;

  if (race.result) {
    const dernier = race.result.poll;
    // LE DÉPOUILLEMENT N'EST PAS UNE CARTE. Voir « LES TEMPS FORTS NE SONT
    // PAS DES CARTES » dans js/game/render/carte.js.
    const verdict = raceVerdict(race.result.verdict);
    host.innerHTML = momentHTML({
      tone: verdict.tone,
      kicker: t("cal_elec_" + race.id) + " · " + cardHeader(),
      word: verdict.word,
      note: verdict.note,
      body:
        (dernier ? pollHTML(dernier, "label_result") : "") +
        '<p class="moment-text">' + logText({ text: race.result.text }) + "</p>" +
        changesHTML(race.result.changes) +
        continueButton("data-race-done"),
    });
    return;
  }

  const ev = raceEventById(card.id);
  // « Temps 1 sur 1 » ne veut rien dire : quand la campagne tient en une
  // scène, on ne compte pas les scènes.
  const temps = raceSteps(race.id);
  const entete = temps > 1
    ? t("step_of").replace("{n}", race.step + 1).replace("{total}", temps)
    : "";

  const sondage = racePoll();

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner(race.id, entete) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      (sondage ? pollHTML(sondage, "label_poll") : "") +
      '<p class="race-mood">' + t(raceMood()) + "</p>" +
      '<p class="event-sub-tag">' + L(ev.tag) + "</p>" +
      '<p class="event-text' + (card.resolved ? " event-result" : "") + '">' +
        (card.resolved ? card.resultText : fillText(ev.text, game)) + "</p>" +
      (card.resolved ? changesHTML(card.resultChanges) : "") +
      (card.resolved
        ? continueButton("data-race-next")
        : '<div class="event-choices">' + choiceButtons(ev, game) + "</div>") +
    "</div>";
}

/*
 * LE CHOIX DU TERRAIN. Trois portes, et chacune dit ce qu'elle coûte : le
 * jeu ne donne jamais une probabilité, il dit de quoi on joue.
 */
function renderSeatCard(host, card) {
  const stake = playerStake(card.id);
  const poste = stake ? t("pos_low_" + stake.target) || t("pos_" + stake.target).toLowerCase() : "";

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner(card.id) +
      '<p class="event-tag">' + t("seat_tag") + " · " + cardHeader() + "</p>" +
      '<p class="event-text">' + fillMarks(t("seat_intro").replace("{pos}", poste)) + "</p>" +
      '<div class="event-choices">' +
        ["bastion", "ordinaire", "imprenable"].map((kind) =>
          '<button type="button" class="event-choice" data-seat="' + kind + '">' +
            '<span class="choice-label">' + t("seat_" + kind) + "</span>" +
            '<span class="choice-notes"><span class="choice-why">' +
              t("seat_" + kind + "_note") + "</span></span>" +
          "</button>"
        ).join("") +
      "</div>" +
    "</div>";
}

/* Un temps de campagne ordinaire : le choix déplace l'avantage. */
function raceChoice(target) {
  const ev = raceEventById(game.card.id);
  const choice = ev.choices[Number(target.getAttribute("data-choice"))];
  const outcome = resolveChoice(choice, game);
  markSeen(ev, game);

  game.card.resolved = true;
  game.card.resultText = outcome.text;
  game.card.resultChanges = outcome.changes;
  saveGame();
  renderAll();
}

function raceNext() {
  game.race.step++;
  if (game.race.step >= raceSteps(game.race.id)) resolveRace();
  else game.card = { kind: "race", id: drawRaceEvent().id, resolved: false };
  saveGame();
  renderAll();
}

function raceDone() {
  auditCampaignAccounts(game, RACE_ACCOUNTS);
  game.race = null;
  game.card = null;
  if (!game.ended) advanceTurn();
  else game.card = { kind: "end" };
  saveGame();
  renderAll();
}

/* Le terrain choisi : on l'inscrit dans l'enjeu et la campagne commence. */
function seatChoice(target) {
  const choix = target.getAttribute("data-seat");
  const id = game.card.id;
  const stake = playerStake(id);
  if (!stake) return;

  startRace(id, { ...stake, seat: choix, threshold: seatThreshold(id, stake, choix) });
  addLog({
    fr: fillMarks("Vous obtenez d'être placé " + t("seat_log_" + choix) + " pour {elec_low:" + id + "}."),
    en: fillMarks("You get yourself placed " + t("seat_log_" + choix) + " for {elec_low:" + id + "}."),
  });
  saveGame();
  renderAll();
}

MODES.race = {
  // Sans game.race, la carte n'a ni sondage ni compteur de temps.
  ready: () => Boolean(game.race),
  render: renderRaceCard,
  clicks: {
    "data-choice": raceChoice,
    "data-race-next": raceNext,
    "data-race-done": raceDone,
  },
};

/* Le choix du terrain précède la course : même mode, autre carte. */
MODES.seat = {
  render: renderSeatCard,
  clicks: { "data-seat": seatChoice },
};
