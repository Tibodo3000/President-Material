/*
 * President Material — moteur de la boucle de jeu (game.html).
 *
 * Un tour = six mois. À chaque tour : vieillissement, revenus, risque de
 * décès, puis UNE carte à droite — une élection si le calendrier en prévoit
 * une, sinon un événement tiré au sort. Les rivaux évoluent en arrière-plan.
 *
 * Les données (échelle, événements, calendrier) sont dans js/game-data.js,
 * les chiffres de création dans js/data.js.
 */

const GAME_KEY = "pm-game";

/* ==========================================================================
   État
   ========================================================================== */

let game = null;

/**
 * LES FIGURES DU PAYSAGE POLITIQUE.
 *
 * Chaque parti a son visage : celui ou celle qui l'incarne, qui monte, qui
 * gouverne ou qui s'accroche. Ce ne sont pas de simples rivaux, ce sont les
 * gens que le pays connaît, et le joueur se compare à eux tout au long de sa
 * carrière. Le parti du joueur a lui aussi sa figure : c'est le concurrent
 * de l'intérieur, celui qu'il faudra écarter pour prendre la direction.
 */
/** Le nom de famille seul, pour éviter deux homonymes dans le même paysage. */
function surnameOf(fullName) {
  return String(fullName).slice(String(fullName).indexOf(" ") + 1);
}

/**
 * Trois profils par parti, qui donnent au casting sa hiérarchie :
 *
 *   chef     celui qui dirige, installé, connu, souvent le plus âgé
 *   cadre    l'élu confirmé qui attend son tour
 *   espoir   le jeune qui monte, encore peu connu
 */
const FIGURE_RANKS = {
  chef:   { minAge: 22, spread: 18, position: "chef", floor: 6, notoriety: 6 },
  cadre:  { minAge: 12, spread: 18, position: null,   floor: 4, notoriety: 3 },
  espoir: { minAge: -2, spread: 13, position: null,   floor: 2, notoriety: 1 },
};

function makeFigure(partyKey, usedNames, rank) {
  const model = FIGURE_RANKS[rank] || FIGURE_RANKS.cadre;
  const sex = Math.random() < 0.5 ? "female" : "male";

  let name = randomName(sex);
  for (let i = 0; i < 12 && (usedNames[name] || usedNames[surnameOf(name)]); i++) {
    name = randomName(sex);
  }
  usedNames[name] = true;
  usedNames[surnameOf(name)] = true;

  const figure = {
    name,
    sex,
    party: partyKey,
    rank,
    age: Math.max(26, START_AGE + model.minAge + randInt(model.spread)),
    position: model.position ||
      (rank === "espoir" ? ["militant", "conseiller"][randInt(2)] : ["maire", "depute"][randInt(2)]),
    progress: 0,
    stats: {
      charisme: model.floor + randInt(5),
      reseau: model.floor + randInt(5),
      notoriete: model.notoriety + randInt(5),
      reputation: 3 + randInt(5),
    },
  };
  figure.popularity = figurePopularity(figure);
  return figure;
}

/** La popularité d'une figure : ce que le pays pense d'elle, de 0 à 100. */
function figurePopularity(figure) {
  return clamp100(
    6 + figure.stats.notoriete * 3.4 + figure.stats.charisme * 1.6 +
    figure.stats.reputation * 1.2 + POSITION_EXPOSURE[figure.position] * 0.8
  );
}

/**
 * CE QU'ON EST EN ARRIVANT.
 *
 * On ne choisit ni son visage, ni sa voix, ni ce qu'on aime, ni ce qu'on fait
 * devant un conflit. Le jeu distribue ces traits-là au départ, sans que le
 * joueur les choisisse : c'est la première main, et toute la partie consiste
 * à faire avec.
 *
 * Le tirage se fait UN AXE À LA FOIS, indépendamment : on peut être beau et
 * zozoter, avoir une voix de radio et être lâche. Chaque axe a sa part de
 * chance de ne rien donner, et cette part est la même partout.
 */
const BIRTH_NONE = 9;

function dealBirthTraits(state) {
  const axes = {};
  Object.keys(TRAIT_DATA).forEach((id) => {
    const def = TRAIT_DATA[id];
    if (!def.birth) return;
    (axes[def.axis || "divers"] = axes[def.axis || "divers"] || []).push(id);
  });

  const donnes = [];
  Object.values(axes).forEach((pool) => {
    const total = pool.reduce((sum, id) => sum + TRAIT_DATA[id].birth, 0) + BIRTH_NONE;
    let draw = Math.random() * total;
    for (const id of pool) {
      draw -= TRAIT_DATA[id].birth;
      if (draw <= 0) { addTrait(state, id); donnes.push(id); return; }
    }
  });

  if (donnes.length) {
    state.log.unshift({ turn: 0, text: {
      fr: "On vous décrira longtemps par ce que vous êtes avant de vous décrire par ce que vous pensez : " +
          donnes.map((id) => L(TRAIT_DATA[id].label).toLowerCase()).join(", ") + ".",
      en: "People will describe what you are long before they describe what you think: " +
          donnes.map((id) => L(TRAIT_DATA[id].label).toLowerCase()).join(", ") + ".",
    } });
  }
  return donnes;
}

/** Nouvelle partie à partir du personnage créé. */
function newGame(character) {
  const usedNames = { [character.name || ""]: true, [surnameOf(character.name || "")]: true };
  const partyKeys = Object.keys(PARTIES);

  // Trois personnalités par parti, dont un chef : à trente ans, on entre
  // toujours dans un paysage déjà occupé, avec ses chefs installés, ses
  // cadres qui attendent leur tour et ses jeunes pressés.
  const rivals = [];
  partyKeys.forEach((key) => {
    ["chef", "cadre", "espoir"].forEach((rank) => {
      rivals.push(makeFigure(key, usedNames, rank));
    });
  });

  const state = {
    character,
    party: character.party,
    stats: computeStats(character),
    money: computeMoney(character),
    age: START_AGE,
    turn: 0,
    position: "militant",
    peakPosition: "militant",
    flags: {},
    traits: [],        // marques durables laissées par les choix
    strikes: {},       // écarts commis, avant qu'ils ne fassent une réputation
    investments: {},   // niveaux des postes de dépense choisis par le joueur
    seen: {},          // événements déjà joués : ils ne reviendront pas
    pending: [],       // suites programmées, avec le tour où elles tombent
    popularity: 0,
    standing: 0,
    rivals,               // une figure par parti
    landscape: {},        // rapport de force entre les partis, en pourcentage
    landscapeBefore: {},  // le même, au tour précédent : sert aux tendances
    alliance: null,       // { party, turn } : le pacte en cours, s'il y en a un
    scene: null,          // la figure mise en scène par la carte affichée
    president: null,      // { name, party } ou { isPlayer: true }
    presidentTerms: 1,    // mandats consécutifs déjà faits par le sortant
    log: [],
    ended: null,
    card: null, // la carte affichée à droite : { kind, ... }
  };

  // Le pays sort d'une décennie centriste : le président en exercice est le
  // chef des centristes, il a un nom, et il en est à son premier mandat.
  const sortant = rivals.find((r) => r.party === "centrists" && r.position === "chef");
  state.president = { name: sortant.name, party: "centrists" };
  state.presidentTerms = 1;
  state.landscape = initialLandscape(state);

  // Ce qu'on est de naissance passe avant tout le reste : ces traits modifient
  // les statistiques, donc ils doivent être en place quand on calcule les jauges.
  dealBirthTraits(state);

  // On démarre pile sur la cible : le personnage arrive avec le crédit que
  // son profil lui vaut, ni plus ni moins.
  state.popularity = popularityTarget(state);
  state.standing = standingTarget(state);
  return state;
}

/* ==========================================================================
   Paysage politique
   ==========================================================================
   Le rapport de force entre les partis, en pourcentage d'intentions de vote,
   qui bouge pendant toute la partie. Quatre forces le déplacent :

     L'USURE DU POUVOIR   le parti qui occupe l'Élysée s'érode lentement.
     LES FIGURES          un parti porté par quelqu'un de populaire monte.
     LE JOUEUR            d'autant plus qu'il occupe une fonction exposée.
     LE HASARD            l'air du temps, qui ne s'explique jamais après coup.

   Les événements le déplacent eux aussi, par leur effet "landscape" : un
   débat gagné, un ralliement, une trahison se paient en points d'intentions
   de vote, et pas seulement en popularité personnelle.

   C'est ce tableau qui décide de la force des adversaires à la présidentielle
   et qui donne au joueur une lecture de la partie : contre qui il se bat,
   et si son camp est en train de monter ou de s'effondrer.
   ========================================================================== */

/** Un parti ne descend jamais tout à fait à zéro : il lui reste ses fidèles. */
const LANDSCAPE_FLOOR = 1.5;

/**
 * Le socle d'un parti : le niveau vers lequel il revient toujours quand plus
 * rien ne le pousse. Un grand parti de gouvernement remonte, un parti de
 * rupture redescend, et c'est ce qui donne son identité au paysage. Sans ce
 * rappel, quarante tours de hasard finissaient par rendre les six partis
 * interchangeables, et le choix du parti ne voulait plus rien dire.
 */
function naturalShare(key) {
  return 24 - PARTIES[key].difficulty * 3;
}

/** Vitesse du rappel vers le socle, par tour. */
const LANDSCAPE_PULL = 0.05;

/** Répartition de départ, adossée à la difficulté des partis. */
function initialLandscape(state) {
  const shares = {};
  Object.keys(PARTIES).forEach((key) => {
    shares[key] = Math.max(4, naturalShare(key) + Math.random() * 8);
  });
  return normalizeLandscape(shares);
}

function normalizeLandscape(shares) {
  const total = Object.values(shares).reduce((sum, v) => sum + v, 0) || 1;
  Object.keys(shares).forEach((key) => { shares[key] = (shares[key] / total) * 100; });
  return shares;
}

/** Le parti au pouvoir, ou null si c'est le joueur qui l'occupe. */
function rulingParty() {
  if (!game.president) return null;
  return game.president.isPlayer ? game.party : game.president.party;
}

/** Le parti allié au camp du joueur, s'il y en a un. */
function allyParty() {
  return game.alliance ? game.alliance.party : null;
}

/** Un tour de vie du paysage. */
function driftLandscape() {
  const ruling = rulingParty();
  const ally = allyParty();

  // Le socle est exprimé sur la même échelle que le tableau une fois ramené
  // à cent, sinon le rappel tirerait tout le monde dans le même sens.
  const floor = Object.keys(PARTIES).reduce((sum, key) => sum + naturalShare(key), 0) / 100;

  Object.keys(game.landscape).forEach((key) => {
    let move = (Math.random() - 0.5) * 1.6;

    // Le rappel vers ce que le parti pèse naturellement dans le pays.
    move += (naturalShare(key) / floor - game.landscape[key]) * LANDSCAPE_PULL;

    // Gouverner use : le camp au pouvoir perd du terrain, doucement.
    if (key === ruling) move -= 0.5;

    // Une figure populaire tire son parti vers le haut.
    const figure = figureOf(key);
    if (figure) move += (figure.popularity - 45) / 90;

    // Le joueur pèse sur son propre camp, d'autant plus qu'il est haut placé.
    // Un militant aimé de son quartier ne déplace pas les intentions de vote
    // nationales ; un chef de parti, oui. Le coefficient reste volontairement
    // bas : être populaire aide son camp, cela ne le porte pas à bout de bras.
    // Ce sont les événements qui doivent faire le gros du travail.
    if (key === game.party) {
      move += ((game.popularity - 50) / 95) * (0.4 + POSITION_EXPOSURE[game.position] / 28);
    }

    // Deux partis alliés finissent par ressembler à une offre de gouvernement,
    // ce qui profite un peu aux deux.
    if (ally && (key === ally || key === game.party)) move += 0.15;

    game.landscape[key] = Math.max(LANDSCAPE_FLOOR, game.landscape[key] + move);
  });

  normalizeLandscape(game.landscape);
}

/**
 * Déplace la part d'un parti et renvoie ce qui a réellement bougé une fois le
 * tableau ramené à cent. Les autres partis reculent d'autant : le paysage est
 * un gâteau, il ne grandit pas.
 */
function moveShare(s, partyKey, amount) {
  if (!partyKey || !s.landscape || s.landscape[partyKey] === undefined) return 0;

  const before = s.landscape[partyKey];
  s.landscape[partyKey] = Math.max(LANDSCAPE_FLOOR, before + amount);
  normalizeLandscape(s.landscape);
  return s.landscape[partyKey] - before;
}

/** Fait bouger le paysage après un résultat : gagner déplace les lignes. */
function shiftLandscape(partyKey, amount) {
  return moveShare(game, partyKey, amount);
}

/**
 * À qui s'applique un effet "landscape" écrit dans un événement. Un événement
 * ne connaît pas le nom des partis de la partie en cours : il désigne un rôle,
 * et le moteur le résout.
 *
 *   "self"   votre parti          "scene"  le parti de la figure mise en scène
 *   "ruling" le camp au pouvoir   "ally"   votre allié du moment
 *
 * Une clé de parti écrite en toutes lettres reste possible pour les événements
 * qui visent un camp précis.
 */
function landscapeTarget(s, token) {
  if (token === "self") return s.party;
  if (token === "scene") return s.scene ? s.scene.party : null;
  if (token === "ruling") return rulingParty();
  if (token === "ally") return s.alliance ? s.alliance.party : null;
  return PARTIES[token] ? token : null;
}

/** Toutes les personnalités d'un parti, le chef d'abord, puis les plus connues. */
function figuresOf(partyKey) {
  return game.rivals
    .filter((r) => r.party === partyKey)
    .sort((a, b) =>
      (b.position === "chef") - (a.position === "chef") || b.popularity - a.popularity
    );
}

/** Celui ou celle qui dirige le parti, et qui le représentera à l'Élysée. */
function leaderOf(partyKey) {
  return game.rivals.find((r) => r.party === partyKey && r.position === "chef") ||
    figuresOf(partyKey)[0] || null;
}

/** La figure la plus en vue d'un parti, chef compris. */
function figureOf(partyKey) {
  return leaderOf(partyKey);
}

/** Les partis, du plus fort au plus faible. */
function sortedLandscape() {
  return Object.keys(game.landscape).sort((a, b) => game.landscape[b] - game.landscape[a]);
}

/**
 * Glissement des deux jauges vers ce que valent les statistiques.
 *
 * Vers le haut, la jauge monte au rythme ordinaire : c'est le dossier qui
 * finit par payer. Vers le bas, elle retombe d'autant moins vite que le
 * joueur entretient sa position. Une popularité gagnée par un coup d'éclat
 * ne tient pas toute seule ; c'est exactement ce que paient l'attaché de
 * presse et l'appartement où l'on reçoit.
 */
function driftToward(current, target, hold) {
  const rate = target < current ? DRIFT * (1 - hold) : DRIFT;
  return clamp100(current + (target - current) * rate);
}

function driftGauges() {
  game.popularity = driftToward(game.popularity, popularityTarget(game), investHold(game, "popularity"));
  game.standing = driftToward(game.standing, standingTarget(game), investHold(game, "standing"));
}

function saveGame() {
  // Les fonctions des événements ne sont pas sérialisables : on ne stocke
  // que l'identifiant de la carte courante et on la reconstruira.
  const copy = { ...game, card: game.card ? { kind: game.card.kind, id: game.card.id } : null };
  localStorage.setItem(GAME_KEY, JSON.stringify(copy));
}

function loadGame() {
  try {
    return JSON.parse(localStorage.getItem(GAME_KEY));
  } catch (error) {
    return null;
  }
}

/* ==========================================================================
   Calendrier et élections
   ========================================================================== */

function electionAtTurn(turn) {
  if (turn <= 0) return null;
  return ELECTIONS.find((e) => turn % e.cycle === e.offset) || null;
}

/** La prochaine échéance électorale, pour l'affichage. */
function nextElection() {
  for (let ahead = 1; ahead <= 12; ahead++) {
    const e = electionAtTurn(game.turn + ahead);
    if (e) return { election: e, inTurns: ahead };
  }
  return null;
}

/**
 * Ce que cette élection propose au joueur selon sa fonction actuelle.
 * Renvoie null si elle ne le concerne pas (elle se joue alors sans lui).
 */
function playerStake(electionId) {
  const pos = game.position;

  if (electionId === "municipales") {
    if (pos === "militant") return { target: "conseiller", threshold: 34 };
    if (pos === "conseiller") return { target: "maire", threshold: 46 };
    return null;
  }
  if (electionId === "europeennes") {
    // La liste européenne est le seul scrutin où l'on entre par la porte de
    // service : elle est plus facile que la législative, et elle vaut moins.
    if (pos === "euro") return { target: "euro", threshold: 34, defense: true };
    if (pos === "conseiller" || pos === "maire") return { target: "euro", threshold: 42 };
    if (pos === "militant") return { target: "euro", threshold: 56 };
    return null;
  }
  if (electionId === "legislatives") {
    if (pos === "conseiller" || pos === "maire" || pos === "euro") return { target: "depute", threshold: 54 };
    if (pos === "militant") return { target: "depute", threshold: 66 };
    if (pos === "depute") return { target: "depute", threshold: 42, defense: true };
    return null;
  }
  if (electionId === "congres") {
    // Un ministre part avec l'appareil dans la poche : il a distribué des
    // postes pendant des années, et le congrès s'en souvient.
    if (pos === "ministre") return { target: "chef", threshold: 58 };
    if (pos === "depute" || pos === "maire" || pos === "euro") return { target: "chef", threshold: 66 };
    if (pos === "chef") return { target: "chef", threshold: 58, defense: true };
    return null;
  }
  if (electionId === "presidentielle") {
    if (pos === "chef") return { target: "president", threshold: 0 };
    return null;
  }
  return null;
}

/**
 * Donne une fonction sans passer par les urnes, et tient à jour le sommet
 * atteint : une carrière se juge à la plus haute marche qu'elle a touchée,
 * pas à celle où elle s'arrête.
 */
function setOffice(s, position) {
  if (!position || !LADDER.includes(position) || s.position === position) return false;

  s.position = position;
  if (LADDER.indexOf(position) > LADDER.indexOf(s.peakPosition)) s.peakPosition = position;
  return true;
}

/**
 * Score du joueur. Les scrutins au suffrage universel se jouent sur la
 * POPULARITÉ, le congrès du parti sur la COTE INTERNE. Les statistiques
 * n'interviennent plus qu'en appoint : elles ont déjà façonné les jauges.
 */
/**
 * Le vent qui souffle sur votre camp, en points d'avance ou de retard sur un
 * parti moyen. On ne gagne pas une législative tout seul : la même campagne
 * ne donne pas le même résultat selon que votre parti fait vingt-cinq pour
 * cent dans le pays ou huit. C'est ce qui rend le rapport de force lisible
 * dans les urnes, et pas seulement dans le tableau.
 *
 * L'allié compte pour un tiers : dans une circonscription, un accord de
 * désistement se voit au premier tour.
 */
function partyWind() {
  const average = 100 / Object.keys(PARTIES).length;
  const ally = allyParty();
  const share = (game.landscape[game.party] || average) +
    (ally ? (game.landscape[ally] || 0) * 0.33 : 0);
  return share - average;
}

function electionScore(electionId) {
  const dice = Math.random() * 12;

  if (electionId === "municipales") {
    // Un scrutin local : la personne compte plus que l'étiquette, mais
    // l'étiquette compte quand même.
    return game.popularity * 0.55 + statScore(game, "reseau") * 2 + statScore(game, "energie") + partyWind() * 0.9 + dice;
  }
  if (electionId === "legislatives") {
    // Un scrutin national : on est d'abord élu sous une couleur. Un parti qui
    // s'effondre emporte ses députés avec lui, y compris les bons.
    return game.popularity * 0.7 + statScore(game, "eloquence") + statScore(game, "reseau") + partyWind() * 1.7 + dice;
  }
  // Le congrès se joue entre militants. Un parti qui s'effondre cherche
  // toutefois un visage neuf, ce qui aide celui qui se présente.
  return game.standing * 0.8 + statScore(game, "reseau") + statScore(game, "eloquence") * 0.5 - partyWind() * 0.25 + dice;
}

/* --------------------------------------------------------------------------
   Limite des mandats : deux consécutifs, pas trois. Au terme du second,
   le siège est ouvert — le sortant ne peut pas se représenter, et la barre
   à franchir s'effondre pour tout le monde.
   -------------------------------------------------------------------------- */

const MAX_TERMS = 2;

function incumbentTermLimited() {
  return game.presidentTerms >= MAX_TERMS;
}

/** Le président a toujours un nom : celui du joueur, ou celui d'une figure. */
function presidentName() {
  if (!game.president) return t("president_vacant");
  return game.president.isPlayer ? (game.character.name || t("sheet_name_empty")) : game.president.name;
}

function isPresident(figure) {
  return Boolean(game.president && !game.president.isPlayer && game.president.name === figure.name);
}

/**
 * Enregistre qui prend l'Élysée, met à jour le compteur de mandats et
 * déplace le rapport de force : une victoire présidentielle tire tout un
 * camp vers le haut.
 */
function setPresident(who) {
  const same = game.president && who &&
    Boolean(game.president.isPlayer) === Boolean(who.isPlayer) &&
    game.president.name === who.name;

  game.presidentTerms = same ? game.presidentTerms + 1 : 1;
  game.president = who;
  shiftLandscape(who && (who.isPlayer ? game.party : who.party), +6);

  // Un ministre n'est ministre que tant que son camp gouverne. Le jour où le
  // camp perd, on rend les clés et la voiture, et on retourne au groupe.
  if (game.position === "ministre" && rulingParty() !== game.party) {
    game.position = "depute";
    bumpStanding(game, -6);
    addLog({
      fr: "Le gouvernement démissionne. Vous rendez votre ministère et retrouvez un bureau de député, plus petit que celui de votre ancien directeur de cabinet.",
      en: "The government resigns. You hand back your ministry and return to a member's office, smaller than the one your chief of staff used to have.",
    });
  }
}

/* --------------------------------------------------------------------------
   CE QU'UNE CANDIDATURE PÈSE

   Une présidentielle ne se joue pas entre sept personnes, elle se joue entre
   sept camps. La part de départ d'un candidat, c'est celle de son parti dans
   le pays ; sa personne ne fait que la multiplier. Quelqu'un que le pays aime
   peut valoir la moitié en plus à son camp, un candidat impossible lui coûte
   le tiers de sa base, mais personne ne transforme trois pour cent en second
   tour. C'est la règle qui rend le rapport de force décisif : on ne devient
   pas président contre son propre parti, on le devient avec lui.
   -------------------------------------------------------------------------- */

const PULL_MIN = 0.65;
const PULL_MAX = 1.6;

function clampPull(value) {
  return Math.max(PULL_MIN, Math.min(PULL_MAX, value));
}

/** Le multiplicateur du joueur : ses jauges, son profil et ses marques. */
function playerPull() {
  return clampPull(
    1 +
    (game.popularity - 50) / 55 +
    (game.standing - 50) / 320 +
    (statScore(game, "charisme") + statScore(game, "sangfroid") - 11.6) / 55 -
    PARTIES[game.party].difficulty * 0.02 +
    (Math.random() - 0.5) * 0.3
  );
}

/**
 * Le multiplicateur d'une figure. La prime au sortant s'applique après le
 * plafond, et pas avant : sortir d'un mandat n'est pas une qualité de plus,
 * c'est un avantage d'une autre nature. Un président sortant qui se
 * représente est le candidat à battre, et il doit le rester.
 */
function figurePull(figure, incumbent) {
  const s = figure.stats;
  const pull = clampPull(
    1 +
    (figure.popularity - 50) / 55 +
    (s.reseau + s.reputation - 10) / 60 -
    PARTIES[figure.party].difficulty * 0.02 +
    (Math.random() - 0.5) * 0.3
  );
  return incumbent ? pull * 1.45 : pull;
}

/* ==========================================================================
   Campagne présidentielle
   ==========================================================================
   Quand le joueur dirige son parti à l'heure de la présidentielle, l'année
   se joue en six temps au lieu de deux, avec un sondage visible qui bouge
   à chaque décision. Le vote est décidé par les parts finales, pas par un
   jet caché : ce que le joueur voit est ce qui compte.
   ========================================================================== */

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
function presidentialField() {
  const limited = incumbentTermLimited();
  const ally = allyParty();

  const field = [
    {
      name: game.character.name || null,
      nameKey: game.character.name ? null : "sheet_name_empty",
      party: game.party,
      // On ne se présente jamais seul : ce qu'on pèse au premier tour, c'est
      // d'abord ce que pèse son camp.
      pop: game.popularity,
      share: Math.max(1, game.landscape[game.party] * playerPull() * (ally ? 1.12 : 1)),
      isPlayer: true,
    },
  ];

  Object.keys(PARTIES).forEach((key) => {
    if (key === game.party) return;

    const figure = figureOf(key);
    const sortant = figure && isPresident(figure) && !limited;

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
  game.campaign = { step: 0, field: presidentialField(), lastId: null, used: [], phase: "campaign" };
  game.card = { kind: "campaign", id: drawCampaignEvent().id, resolved: false };
}

/**
 * L'adversaire d'une campagne n'est pas tiré au sort : c'est celui qui est
 * devant vous dans les sondages. Il change donc en cours de route, comme dans
 * une vraie campagne, où l'on finit par ne plus parler que d'une personne.
 */
function campaignOpponent() {
  const others = game.campaign.field.filter((c) => !c.isPlayer && c.name);
  if (!others.length) return null;

  const best = others.reduce((top, c) => (c.share > top.share ? c : top), others[0]);
  return { name: best.name, party: best.party, position: "chef" };
}

/**
 * Un temps de campagne. Deux règles, dans cet ordre : jamais deux fois le
 * même moment dans une campagne, et on préfère toujours ce que le joueur n'a
 * jamais vu. Une campagne dure six temps et une carrière peut en compter
 * plusieurs : à la troisième, on finit par repasser par des scènes connues,
 * mais jamais dans la même année.
 */
function drawCampaignEvent() {
  const used = game.campaign.used || (game.campaign.used = []);

  const eligible = CAMPAIGN_EVENTS.filter((ev) => {
    const weight = ev.weight === undefined ? 2 : ev.weight;
    if (weight <= 0 || used.includes(ev.id)) return false;
    return eventMatches({ ...ev, id: null }, game);
  });

  const fresh = eligible.filter((ev) => !game.seen[ev.id]);
  const choices = fresh.length ? fresh : eligible;

  const pool = [];
  choices.forEach((ev) => {
    const weight = ev.weight === undefined ? 2 : ev.weight;
    for (let i = 0; i < weight; i++) pool.push(ev);
  });

  const ev = pool.length ? pool[randInt(pool.length)] : CAMPAIGN_EVENTS[0];
  used.push(ev.id);
  game.campaign.lastId = ev.id;
  game.scene = campaignOpponent() || game.scene;
  return ev;
}

function campaignEventById(id) {
  return CAMPAIGN_EVENTS.find((e) => e.id === id) || CAMPAIGN_EVENTS[0];
}

/** Le nom affiché d'un candidat, traduit à la volée si c'est une clé. */
function fieldName(c) {
  return c.nameKey ? t(c.nameKey) : c.name;
}

/** Le sondage trié, du meilleur au moins bon. */
function sortedField() {
  return [...game.campaign.field].sort((a, b) => b.share - a.share);
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

/** Second tour : les voix des éliminés décident, et elles ne se commandent pas. */
function resolveRunoff() {
  const result = runoff(game.campaign.field, game);
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
  concedeElection(result.winner);
}

/**
 * Ce que coûte une présidentielle perdue, quel que soit le tour où elle
 * s'arrête. Renvoie vrai si le parti retire la direction dans la foulée.
 */
function concedeElection(winner) {
  setPresident({ name: winner.name, party: winner.party });
  bump(game, "notoriete", +1);
  bumpPop(game, +6);
  bumpStanding(game, -14);
  shiftLandscape(game.party, -4);

  if (game.standing >= NOMINATION_THRESHOLD.chef) return false;

  game.position = "depute";
  bump(game, "reputation", -1);
  if (game.campaign && game.campaign.result) game.campaign.result.lostLeadership = true;
  return true;
}

/* ==========================================================================
   La vie des figures
   ========================================================================== */

/* Une carrière politique finit toujours par s'arrêter : l'âge, ou les sondages. */
const RETIRE_AGE = 73;
const RETIRE_POPULARITY = 15;

/**
 * Chaque tour, les figures vieillissent, montent, s'usent. Celle qui dirige
 * déjà son parti ne grimpe plus : elle défend sa place, et sa popularité
 * s'érode si son camp gouverne.
 */
function evolveRivals() {
  const ruling = rulingParty();

  // On travaille sur une copie : la liste bouge quand quelqu'un se retire.
  [...game.rivals].forEach((r) => {
    if (game.rivals.indexOf(r) < 0) return;

    r.age += 0.5;

    if (Math.random() < 0.25) {
      const keys = Object.keys(r.stats);
      const k = keys[randInt(keys.length)];
      r.stats[k] = Math.max(1, Math.min(9, r.stats[k] + (Math.random() < 0.5 ? -1 : 1)));
    }

    if (Math.random() < 0.3) r.progress++;

    if (r.position === "militant" && r.progress >= 3) { r.position = "conseiller"; r.progress = 0; }
    else if (r.position === "conseiller" && r.progress >= 4) { r.position = "maire"; r.progress = 0; }
    else if (r.position === "maire" && r.progress >= 5) { r.position = "depute"; r.progress = 0; }

    // La popularité glisse vers ce que valent les statistiques et la fonction,
    // moins l'usure de ceux qui gouvernent.
    const target = figurePopularity(r) - (r.party === ruling ? 8 : 0);
    r.popularity = clamp100(r.popularity + (target - r.popularity) * 0.2 + (Math.random() - 0.5) * 3);

    // Le président en exercice ne quitte pas la scène tant qu'il est en poste.
    if (isPresident(r)) return;

    if (r.age >= RETIRE_AGE && Math.random() < 0.18) return retireFigure(r, "age");
    if (r.popularity <= RETIRE_POPULARITY && Math.random() < 0.12) return retireFigure(r, "popularity");
  });

  ensureLeaders();
}

/**
 * Quelqu'un s'en va, quelqu'un arrive. Un parti ne se vide jamais : la place
 * libérée est reprise par une figure plus jeune, et le journal le raconte.
 */
/** Fabrique une figure de plus, sans jamais deux fois le même nom. */
function spawnFigure(partyKey, rank) {
  const usedNames = { [game.character.name || ""]: true };
  game.rivals.forEach((r) => { usedNames[r.name] = true; usedNames[surnameOf(r.name)] = true; });
  return makeFigure(partyKey, usedNames, rank);
}

function retireFigure(figure, reason) {
  const heir = spawnFigure(figure.party, figure.position === "chef" ? "cadre" : "espoir");
  const at = game.rivals.indexOf(figure);
  game.rivals.splice(at, 1, heir);

  addLog(reason === "age"
    ? {
        fr: figure.name + " quitte la vie politique. " + heir.name + " ({party:" + figure.party + "}) prend sa place.",
        en: figure.name + " leaves politics. " + heir.name + " ({party:" + figure.party + "}) takes their place.",
      }
    : {
        fr: figure.name + " est écarté après des sondages catastrophiques. " + heir.name + " est poussé en avant.",
        en: figure.name + " is pushed aside after disastrous polling. " + heir.name + " is put forward instead.",
      });
}

/**
 * Un parti a toujours un chef, et un seul. Sauf dans le camp du joueur quand
 * c'est lui qui dirige : là, personne d'autre ne porte le titre.
 */
function ensureLeaders() {
  Object.keys(PARTIES).forEach((key) => {
    let figures = game.rivals.filter((r) => r.party === key);

    // Un parti vidé par les départs ne disparaît pas : il descend dans ses
    // fédérations et remonte quelqu'un que personne ne connaît. La ligne du
    // journal est écrite plus bas, avec les autres prises de direction.
    if (!figures.length) {
      const newcomer = spawnFigure(key, "cadre");
      game.rivals.push(newcomer);
      figures = [newcomer];
    }

    const chefs = figures.filter((r) => r.position === "chef");
    const playerLeads = key === game.party && game.position === "chef";

    if (playerLeads) {
      chefs.forEach((r) => {
        r.position = "depute";
        addLog({
          fr: r.name + " cède la direction du parti et retourne au groupe.",
          en: r.name + " gives up the party leadership and returns to the benches.",
        });
      });
      return;
    }

    if (chefs.length === 1) return;

    if (chefs.length > 1) {
      // Deux chefs, cela n'existe pas : le plus populaire garde la maison.
      chefs.sort((a, b) => b.popularity - a.popularity).slice(1)
        .forEach((r) => { r.position = "depute"; });
      return;
    }

    const heir = figures.sort((a, b) => b.popularity - a.popularity)[0];
    heir.position = "chef";
    addLog({
      fr: heir.name + " prend la tête {party_of:" + key + "}.",
      en: heir.name + " takes over the leadership of {party_of:" + key + "}.",
    });
  });
}

/* ==========================================================================
   La figure mise en scène
   ==========================================================================
   Un événement qui parle de quelqu'un doit parler du même quelqu'un du début
   à la fin. Le nom est donc tiré une fois, au moment où la carte sort, et il
   est conservé dans la partie : le texte de la question, celui du résultat et
   les effets visent tous la même personne, et le même parti.

   Un événement choisit son casting avec le champ "cast" :

     "opponent"  une figure d'un autre parti, tirée au poids de son camp
     "leader"    le chef d'un autre parti, même pondération
     "camp"      une figure de votre propre parti, le concurrent de l'intérieur
     (rien)      n'importe qui, comme avant
   ========================================================================== */

/** Tire une figure dans une liste, en favorisant les partis qui pèsent. */
function pickByWeight(list) {
  if (!list.length) return null;

  const weights = list.map((figure) => Math.max(0.5, game.landscape[figure.party] || 1));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let draw = Math.random() * total;

  for (let i = 0; i < list.length; i++) {
    draw -= weights[i];
    if (draw <= 0) return list[i];
  }
  return list[list.length - 1];
}

/** Le casting de la carte qui vient de sortir. */
function castFor(ev) {
  const cast = ev && ev.cast;
  const others = game.rivals.filter((r) => r.party !== game.party);

  let figure = null;
  if (cast === "leader") figure = pickByWeight(others.filter((r) => r.position === "chef"));
  else if (cast === "opponent") figure = pickByWeight(others);
  else if (cast === "camp") figure = pickByWeight(game.rivals.filter((r) => r.party === game.party));

  if (!figure) figure = pickByWeight(others) || anyRival(game);
  return figure ? { name: figure.name, party: figure.party, position: figure.position } : null;
}

function setScene(ev) {
  game.scene = castFor(ev);
}

/* ==========================================================================
   Ralliements, défections et alliances
   ==========================================================================
   Un paysage politique ne bouge pas seulement parce que les électeurs
   changent d'avis : il bouge parce que les gens changent de camp. Un cadre
   qui traverse la salle emporte avec lui une part de ce que son parti pesait,
   et la donne à celui qui l'accueille.

   Trois façons d'en jouer : les figures se rallient toutes seules en arrière
   plan, le joueur peut lui-même changer de parti, et deux camps peuvent
   signer un pacte qui se paiera au second tour.
   ========================================================================== */

/** Chance, à chaque tour, qu'un ralliement se produise quelque part. */
const DEFECTION_CHANCE = 0.11;

/**
 * Ce qu'un ralliement déplace, en points d'intentions de vote. Une figure
 * connue emporte davantage qu'un second couteau, et un chef de parti est un
 * séisme.
 */
function defectionWeight(figure) {
  const rank = figure.position === "chef" ? 2.2 : 1;
  return rank * (0.5 + figure.popularity / 90);
}

/** Vers qui va celui qui part : un parti voisin, et si possible qui monte. */
function defectionTarget(figure) {
  const options = Object.keys(PARTIES).filter((key) => key !== figure.party);
  const weights = options.map((key) => {
    const proximity = 1 - ideologicalDistance(figure.party, key);
    const gain = game.landscape[key] - game.landscape[figure.party];
    return Math.max(0.05, Math.pow(proximity, 4) * 6 + gain * 0.12);
  });

  const total = weights.reduce((sum, w) => sum + w, 0);
  let draw = Math.random() * total;
  for (let i = 0; i < options.length; i++) {
    draw -= weights[i];
    if (draw <= 0) return options[i];
  }
  return options[options.length - 1];
}

/**
 * Quelqu'un traverse. On ne part pas d'un camp qui gagne, et on ne part pas
 * quand on est à l'Élysée : les candidats au départ sont ceux qui plafonnent
 * dans un parti qui plafonne.
 */
function maybeDefection() {
  if (Math.random() >= DEFECTION_CHANCE) return;

  // On ne part pas de l'Élysée, et on ne laisse jamais un parti sans personne :
  // le dernier d'un camp reste, quitte à éteindre la lumière lui-même.
  const average = 100 / Object.keys(PARTIES).length;
  const candidates = game.rivals.filter((r) =>
    !isPresident(r) &&
    game.rivals.filter((other) => other.party === r.party).length > 1 &&
    (game.landscape[r.party] < average || r.popularity < 42)
  );
  if (!candidates.length) return;

  const figure = candidates[randInt(candidates.length)];
  const to = defectionTarget(figure);
  const from = figure.party;
  const weight = defectionWeight(figure);

  figure.party = to;
  if (figure.position === "chef") figure.position = "depute";

  moveShare(game, from, -weight);
  moveShare(game, to, +weight * 0.8);
  ensureLeaders();

  addLog(to === game.party
    ? {
        fr: figure.name + " quitte {party_the:" + from + "} et rejoint votre parti. On lui promet une place ; personne ne dit laquelle.",
        en: figure.name + " leaves {party_the:" + from + "} and joins your party. They are promised a place; nobody says which one.",
      }
    : {
        fr: figure.name + " quitte {party_the:" + from + "} pour rejoindre {party_the:" + to + "}. Le mot de trahison est prononcé dès le soir même.",
        en: figure.name + " leaves {party_the:" + from + "} to join {party_the:" + to + "}. The word betrayal is used by the evening.",
      });
}

/**
 * Le joueur change de camp. On n'arrive pas dans un parti à la place qu'on
 * occupait dans l'autre : le mandat suit, la direction jamais, et l'appareil
 * d'accueil vous regarde comme ce que vous êtes devenu.
 */
function switchParty(s, key) {
  if (!key || !PARTIES[key] || key === s.party) return null;

  const from = s.party;
  s.party = key;
  s.character.party = key;
  s.alliance = null;

  if (s.position === "chef") s.position = "depute";

  // Deux marques pour un seul geste : le pays retient le courage, l'appareil
  // retient le couteau.
  addTrait(s, "renegat");
  s.standing = clamp100(Math.min(s.standing, 30) + 6);

  moveShare(s, from, -2.5);
  moveShare(s, key, +2);
  ensureLeaders();

  addLog({
    fr: "Vous quittez {party_the:" + from + "} pour {party_the:" + key + "}. Ceux que vous laissez derrière vous ne vous le pardonneront pas, et ils vous survivront.",
    en: "You leave {party_the:" + from + "} for {party_the:" + key + "}. The people you leave behind will not forgive it, and they will outlive you.",
  });

  return from;
}

/** Signe ou rompt un pacte. Un parti ne s'allie qu'avec un seul autre. */
function setAlliance(s, key) {
  if (!key) {
    const broken = s.alliance;
    s.alliance = null;
    if (broken) {
      addLog({
        fr: "Le pacte avec {party_the:" + broken.party + "} est rompu. Chacun se retrouve seul, avec les mêmes électeurs à convaincre.",
        en: "The pact with {party_the:" + broken.party + "} is over. Both sides are alone again, with the same voters to win over.",
      });
    }
    return null;
  }

  if (!PARTIES[key] || key === s.party) return null;
  s.alliance = { party: key, turn: s.turn };

  addLog({
    fr: "Accord signé avec {party_the:" + key + "}. Les deux appareils annoncent une victoire, ce qui est toujours mauvais signe pour l'un des deux.",
    en: "A deal is signed with {party_the:" + key + "}. Both machines call it a win, which is always a bad sign for one of them.",
  });
  return key;
}

/* ==========================================================================
   Tour de jeu
   ========================================================================== */

function advanceTurn() {
  game.turn++;
  game.age += 0.5;
  const compte = applyBudget(game);
  if (compte && compte.cut) {
    addLog({
      fr: "Faute de trésorerie, vous coupez dans le budget : " + L(BUDGET_DATA.investments[compte.cut].label).toLowerCase() + ".",
      en: "Out of cash, you cut the budget: " + L(BUDGET_DATA.investments[compte.cut].label).toLowerCase() + ".",
    });
  }
  recoverEnergy(game);
  driftGauges();
  evolveRivals();

  // On garde le tableau du tour précédent : c'est lui qui permet d'afficher
  // qui monte et qui descend, la seule information qui rende un paysage
  // lisible d'un coup d'œil.
  game.landscapeBefore = { ...game.landscape };
  driftLandscape();
  maybeDefection();
  applyTraitTurn(game);

  // La mort peut frapper à partir de 60 ans.
  if (Math.random() < deathProbability(game)) {
    game.ended = { type: "death" };
    game.card = { kind: "end" };
    return;
  }

  const election = electionAtTurn(game.turn);

  // La présidentielle où le joueur est candidat devient une campagne de six
  // temps ; toutes les autres échéances restent une carte unique.
  if (election && election.id === "presidentielle" && playerStake("presidentielle")) {
    startCampaign();
    return;
  }

  if (election) {
    game.card = { kind: "election", id: election.id, resolved: false };
  } else {
    game.card = { kind: "event", id: drawEvent().id, resolved: false };
  }
}

/**
 * Tire un événement. Une chaîne en attente passe avant tout : c'est ainsi
 * que se déroulent les suites (mécène → enquête → perquisition → procès).
 * Sinon on tire au sort parmi les événements dont les conditions sont
 * remplies, pondérés par leur "weight". Un poids de 0 réserve l'événement
 * aux chaînes : il ne sort jamais au hasard.
 */
function drawEvent() {
  const suite = dueChain(game);
  if (suite) {
    game.lastEventId = suite.id;
    setScene(suite);
    return suite;
  }

  const pool = [];
  EVENTS.forEach((ev) => {
    const weight = ev.weight === undefined ? 2 : ev.weight;
    if (weight <= 0) return;
    if (game.lastEventId === ev.id) return;
    if (!eventMatches(ev, game)) return;
    for (let i = 0; i < weight; i++) pool.push(ev);
  });

  // Plus rien de neuf à jouer : la carrière traverse un semestre sans
  // histoire. Les temps morts sont les seuls événements qui peuvent revenir.
  const ev = pool.length ? pool[randInt(pool.length)] : quietEvent();
  game.lastEventId = ev.id;
  setScene(ev);
  return ev;
}

/** Un temps mort, en évitant celui du tour précédent. */
function quietEvent() {
  const quiet = EVENTS.filter((ev) => ev.repeatable && eventMatches(ev, game));
  const fresh = quiet.filter((ev) => ev.id !== game.lastEventId);
  const pool = fresh.length ? fresh : quiet;
  return pool.length ? pool[randInt(pool.length)] : EVENTS[0];
}

function eventById(id) {
  return EVENTS.find((e) => e.id === id) || EVENTS[0];
}

/**
 * Une ligne de journal. On y met de préférence l'objet { fr, en } plutôt que
 * la phrase déjà traduite : le journal se relit alors dans la langue du
 * moment, et changer de langue en cours de partie ne laisse plus des lignes
 * françaises dans une interface anglaise.
 *
 * Les textes de résultat d'événement font exception : ils contiennent déjà des
 * noms propres tirés au sort, donc ils entrent tels quels.
 */
function addLog(text) {
  game.log.unshift({ turn: game.turn, text });
  game.log = game.log.slice(0, 8);
}

/**
 * Le texte d'une ligne de journal, ancienne ou nouvelle.
 *
 * Les noms de partis n'y sont pas écrits en toutes lettres mais en marques du
 * type {party_the:centrists}, résolues ici. Sans cela, une ligne écrite en
 * français garderait ses noms français dans une interface anglaise, ce qui est
 * exactement la fuite qu'on cherche à éviter. Les marques acceptées sont les
 * noms de partis, dans les trois formes que le français impose (party pour
 * Centristes, party_the pour les Centristes, party_of pour des Centristes),
 * les fonctions (pos) et les scrutins (elec). Le suffixe _low donne la forme
 * minuscule, pour les marques employées au milieu d'une phrase.
 */
function fillMarks(text) {
  return String(text).replace(/\{(party|party_the|party_of|pos|elec)(_low)?:([a-z_]+)\}/g,
    (mark, form, low, key) => {
      const mot = t(form + "_" + key);
      return low ? mot.toLowerCase() : mot;
    });
}

function logText(entry) {
  return fillMarks(typeof entry.text === "string" ? entry.text : L(entry.text));
}

/* ==========================================================================
   Résolution des élections
   ========================================================================== */

function resolveElectionRun(electionId) {
  const stake = playerStake(electionId);

  if (electionId === "presidentielle") {
    // Chemin de secours. Une présidentielle où le joueur est candidat se joue
    // normalement en six temps de campagne ; si on arrive quand même ici, on
    // tranche d'un coup, avec le même champ de candidats et le même second tour.
    const result = runoff(presidentialField(), game);

    if (result.winner.isPlayer) {
      setPresident({ isPlayer: true, name: game.character.name || "", party: game.party });
      game.ended = { type: "victory" };
      return { won: true, final: true };
    }

    return {
      won: false,
      beatenBy: result.winner.name,
      lostLeadership: concedeElection(result.winner),
    };
  }

  const score = electionScore(electionId);
  const won = score >= stake.threshold;

  if (won) {
    setOffice(game, stake.target);
    bump(game, "notoriete", +1);
    bumpPop(game, +5);
    bumpStanding(game, +7);
  } else if (stake.defense) {
    // Une défense perdue renvoie là d'où l'on vient.
    setOffice(game, DEMOTION[game.position] || game.position);
    bump(game, "reputation", -1);
    bumpPop(game, -12);
    bumpStanding(game, -18);
  } else {
    // Une candidature perdue coûte, mais moins qu'un mandat perdu.
    bumpPop(game, -5);
    bumpStanding(game, -8);
  }
  return { won };
}

/**
 * Ce que rapporte une campagne passée dans les fédérations plutôt que dans les
 * urnes. Rendements décroissants : c'est ainsi qu'on se fait connaître de
 * l'appareil, ce n'est pas ainsi qu'on le prend.
 */
function lobbyGain(s) {
  return Math.max(2, Math.round(9 * (1 - s.standing / 130)));
}

/** Le parti refuse-t-il l'investiture faute de cote suffisante ? */
function nominationBlocked(stake) {
  const need = NOMINATION_THRESHOLD[stake.target];
  return need !== undefined && game.standing < need;
}

/**
 * L'élection se joue sans le joueur. Elle n'est pas décorative pour autant :
 * elle donne un président à la République, et elle déplace le rapport de
 * force que le joueur retrouvera au moment de se présenter.
 */
function backgroundElectionText(electionId) {
  if (electionId !== "presidentielle") {
    // Législatives, municipales, congrès : le pays vote, le paysage bouge un peu.
    const winner = weightedParty();
    shiftLandscape(winner, +2);
    return {
      fr: "Les {elec_low:" + electionId + "} se jouent sans vous cette fois.",
      en: "The {elec_low:" + electionId + "} happen without you this time.",
    };
  }

  const limited = incumbentTermLimited();
  const winnerParty = weightedParty(limited ? 0 : 30);
  ensureLeaders();
  const winner = figureOf(winnerParty);
  if (!winner) return { fr: "", en: "" };
  const reelected = isPresident(winner);

  setPresident({ name: winner.name, party: winnerParty });

  if (reelected) {
    return {
      fr: winner.name + " est réélu pour un second mandat. Le pays reprend son souffle, pas vous.",
      en: winner.name + " is re-elected for a second term. The country catches its breath; you do not.",
    };
  }
  return {
    fr: winner.name + " ({party:" + winnerParty + "}) remporte l'élection présidentielle.",
    en: winner.name + " ({party:" + winnerParty + "}) wins the presidential election.",
  };
}

/**
 * Tire un parti au sort, pondéré par sa force du moment. Le paramètre donne
 * au camp du président sortant la prime au bilan, quand il peut se
 * représenter.
 */
function weightedParty(incumbentBonus) {
  const ruling = rulingParty();
  const weights = Object.keys(PARTIES).map((key) => ({
    key,
    weight: game.landscape[key] + (incumbentBonus && key === ruling ? incumbentBonus : 0),
  }));

  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let draw = Math.random() * total;
  for (const w of weights) {
    draw -= w.weight;
    if (draw <= 0) return w.key;
  }
  return weights[weights.length - 1].key;
}

/* ==========================================================================
   Rendu — fiche de gauche
   ========================================================================== */

function fmtAge(age) {
  const years = Math.floor(age);
  return currentLang === "fr" ? years + " ans" : "Age " + years;
}

function seasonLabel() {
  return t(game.turn % 2 === 0 ? "season_spring" : "season_autumn");
}

/** Une jauge 0-100 : libellé, barre et valeur. */
function renderGauge(key, value, labelKey) {
  document.getElementById("gauge-" + key + "-label").textContent = t(labelKey);
  document.getElementById("gauge-" + key + "-fill").style.width = value + "%";
  document.getElementById("gauge-" + key + "-value").textContent = value;
}

function renderStatus() {
  document.getElementById("sheet-name").textContent =
    game.character.name || t("sheet_name_empty");

  document.getElementById("sheet-meta").textContent =
    fmtAge(game.age) + " · " + t("party_" + game.party);

  document.getElementById("sheet-meta-2").textContent = t("pos_" + game.position);

  // Les deux jauges de carrière, en tête de fiche.
  renderGauge("pop", game.popularity, "label_popularity");
  renderGauge("standing", game.standing, "label_standing");

  document.querySelectorAll(".stat-row").forEach((row) => {
    const value = game.stats[row.getAttribute("data-stat")];
    if (value === undefined) return;
    row.querySelector(".stat-bar-fill").style.width = (value / STAT_MAX) * 100 + "%";
    row.querySelector(".stat-row-value").textContent = value;
  });

  document.getElementById("sheet-money").textContent = formatMoney(game.money);

  // Le solde annuel, juste sous la fortune : on doit voir tout de suite si
  // la carrière se finance ou si elle mange le capital.
  const solde = annualBalance(game);
  const soldeEl = document.getElementById("sheet-balance");
  soldeEl.textContent = (solde < 0 ? "−" : "+") + formatMoney(Math.abs(solde)) + " " + t("budget_per_year");
  soldeEl.classList.toggle("is-negative", solde < 0);

  // Prochaine échéance
  const next = nextElection();
  const deadline = document.getElementById("sheet-deadline");
  if (next) {
    const years = next.inTurns / 2;
    const when = years <= 0.5
      ? t("deadline_soon")
      : (currentLang === "fr" ? "dans " + years + " an" + (years > 1 ? "s" : "") : "in " + years + " year" + (years > 1 ? "s" : ""));
    deadline.textContent = t("elec_" + next.election.id) + " · " + when;
  } else {
    deadline.textContent = "—";
  }

  // Traits : ce que la carrière a laissé sur le personnage, avec ce que
  // chacun change écrit noir sur blanc.
  const traits = traitsOf(game);
  document.getElementById("trait-rows").innerHTML = traits.length
    ? traitRowsHTML(traits)
    : '<p class="trait-empty">' + t("traits_none") + "</p>";
}

/* ==========================================================================
   Rendu — le rapport de force
   ==========================================================================
   Le tableau du paysage politique : chaque parti avec sa force du moment et
   la figure qui l'incarne. Le camp du joueur y figure comme les autres, avec
   son propre nom en face, et l'Élysée est signalé. C'est là que se lit la
   partie : contre qui on se bat, et si son camp monte ou s'effondre.
   ========================================================================== */

/**
 * La tendance d'un parti depuis le tour précédent. En dessous d'un demi point
 * on n'affiche rien : un paysage qui clignote à chaque tour ne se lit plus.
 */
function trendHTML(key) {
  const before = game.landscapeBefore && game.landscapeBefore[key];
  if (before === undefined) return "";

  const delta = game.landscape[key] - before;
  if (Math.abs(delta) < 0.5) return "";

  return '<span class="force-trend ' + (delta > 0 ? "is-up" : "is-down") + '">' +
    (delta > 0 ? "▲" : "▼") + Math.abs(delta).toFixed(1) + "</span>";
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
                    age: game.age, popularity: game.popularity, isPlayer: true });
    }
    figuresOf(key).forEach((figure) => {
      people.push({ name: figure.name, position: figure.position,
                    age: figure.age, popularity: figure.popularity });
    });

    return (
      '<div class="force-row' + (mine ? " is-mine" : "") + '">' +
        '<div class="force-head">' +
          '<span class="force-party">' + t("party_" + key) +
            (key === ruling ? ' <span class="force-tag">' + t("force_ruling") + "</span>" : "") +
            (key === ally ? ' <span class="force-tag is-ally">' + t("force_ally") + "</span>" : "") +
          "</span>" +
          '<span class="force-share">' + trendHTML(key) + Math.round(share) + "%</span>" +
        "</div>" +
        '<span class="force-track"><span class="force-fill" style="width:' +
          Math.min(100, share * 2.4) + '%"></span></span>' +
        people.map((p) =>
          '<div class="force-person' + (p.isPlayer ? " is-player" : "") +
            (p.position === "chef" ? " is-leader" : "") + '">' +
            '<span class="force-name">' + p.name +
              (p.name === presidentName() && !p.isPlayer ? " ★" : "") + "</span>" +
            '<span class="force-role">' + t("pos_" + p.position) +
              " · " + Math.floor(p.age) + " " + t("age_short") + "</span>" +
            '<span class="force-pop">' + Math.round(p.popularity) + "</span>" +
          "</div>"
        ).join("") +
      "</div>"
    );
  }).join("");
}

/* ==========================================================================
   Rendu — carte de droite
   ========================================================================== */

function cardHeader() {
  const year = Math.floor(game.turn / 2) + 1;
  return fmtAge(game.age) + " · " + seasonLabel() + " · " + t("year_label") + " " + year;
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
  if (fx.kind === "money") return (fx.delta > 0 ? "+" : "−") + formatMoney(Math.abs(fx.delta));
  // Le rapport de force : le parti concerné, puis ce qu'il gagne ou perd.
  if (fx.kind === "landscape") {
    return t("party_" + fx.key) + " " + signed(fx.delta) + " " + t("label_points");
  }
  if (fx.kind === "office") return t("pos_" + fx.key);
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
  if (fx.kind === "office") return fx.up ? "up" : "down";
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

/* ---------- Les traits, en clair ---------- */

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

/*
 * Les élections ne passent pas par applyEffects : elles bougent les jauges
 * elles-mêmes. On photographie donc l'état avant, et on compare après, pour
 * que le joueur lise les conséquences d'un scrutin comme celles d'un choix.
 */
function snapshot(s) {
  return { popularity: s.popularity, standing: s.standing, money: s.money, stats: { ...s.stats } };
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
  return changes;
}

/* ---------- Pourquoi une option est ouverte, et ce qu'elle risque ---------- */

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
      '<span class="choice-label">' + L(choice.label) + "</span>" +
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
  const hiddenByFatigue = ev.choices.some((c) =>
    c.when && c.when.stat && c.when.stat.energie &&
    !open.some((o) => o.choice === c)
  );
  if (hiddenByFatigue) html += '<p class="fatigue-note">' + t("note_exhausted") + "</p>";

  return html;
}

function renderCard() {
  const host = document.getElementById("event-area");
  const card = game.card;

  // Le dépouillement s'affiche même quand la partie est gagnée : on veut
  // voir le résultat du vote avant l'écran de fin.
  if (card && card.kind === "campaign" && game.campaign) {
    renderCampaignCard(host, card);
    return;
  }

  // Une carte déjà résolue s'affiche même si la partie vient de se
  // terminer : on veut lire ce qui s'est passé avant l'écran de fin.
  const showingResult = card && card.resolved && card.resultText;
  if (!showingResult && (!card || game.ended)) { renderEnd(host); return; }

  if (card.kind === "event") {
    const ev = eventById(card.id);

    if (!card.resolved) {
      host.innerHTML =
        '<div class="event-card">' +
          '<p class="event-tag">' + L(ev.tag) + " · " + cardHeader() + "</p>" +
          '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
          '<div class="event-choices">' +
            choiceButtons(ev, game) +
          "</div>" +
        "</div>";
    } else {
      host.innerHTML =
        '<div class="event-card">' +
          '<p class="event-tag">' + L(ev.tag) + " · " + cardHeader() + "</p>" +
          '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) +
          continueButton("data-continue") +
        "</div>";
    }
    return;
  }

  if (card.kind === "election") {
    const stake = playerStake(card.id);

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

      host.innerHTML =
        '<div class="event-card event-card-election">' +
          '<p class="event-tag">' + t("elec_" + card.id) + " · " + cardHeader() + "</p>" +
          '<p class="event-text">' +
            (blocked ? blockedPitch(stake) : electionPitch(card.id, stake)) + "</p>" +
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
          '<p class="event-tag">' + t("elec_" + card.id) + " · " + cardHeader() + "</p>" +
          '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) +
          continueButton("data-continue") +
        "</div>";
    }
  }
}

/**
 * Le parti ferme la porte. La cote interne est une abstraction : on ne
 * l'écrit jamais en chiffres, on raconte ce qu'elle vaut. Trois degrés
 * selon la distance au seuil, pour que le joueur sente s'il est près du
 * but ou hors course.
 */
function blockedPitch(stake) {
  const gap = NOMINATION_THRESHOLD[stake.target] - game.standing;
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

/* ---------- Rendu de la campagne ---------- */

/** Le sondage, en barres empilées : l'information centrale de la campagne. */
function pollHTML(list, titleKey) {
  return (
    '<div class="poll">' +
      '<p class="poll-title">' + t(titleKey || "label_poll") + "</p>" +
      (list || sortedField()).map((c) =>
        '<div class="poll-row' + (c.isPlayer ? " is-player" : "") + '">' +
          '<span class="poll-name">' + fieldName(c) + "</span>" +
          '<span class="poll-track"><span class="poll-fill" style="width:' +
            Math.min(100, c.share * 1.8) + '%"></span></span>' +
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

function renderCampaignCard(host, card) {
  const campaign = game.campaign;
  const step = campaign.step;

  // Dimanche du second tour : le verdict.
  if (campaign.phase === "runoff") {
    const res = campaign.result;
    host.innerHTML =
      '<div class="event-card event-card-campaign">' +
        '<p class="event-tag">' + t("label_round2") + " · " + cardHeader() + "</p>" +
        pollHTML(campaign.runoff.finalists, "label_round2") +
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
        '<p class="event-tag">' + t("label_round1") + " · " + cardHeader() + "</p>" +
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

  const ev = campaignEventById(card.id);
  const header = t("label_campaign") + " · " + t("step_of")
    .replace("{n}", step + 1).replace("{total}", CAMPAIGN_STEPS);

  host.innerHTML =
    '<div class="event-card event-card-campaign">' +
      '<p class="event-tag">' + header + "</p>" +
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

function electionPitch(electionId, stake) {
  if (electionId === "presidentielle") {
    return L({
      fr: "L'élection présidentielle est là. Vous menez votre parti : c'est peut-être votre tour.",
      en: "The presidential election has arrived. You lead your party: this may be your moment.",
    });
  }
  if (stake.defense) {
    return L({
      fr: "Votre mandat remis en jeu. Une défaite vous ferait redescendre d'une marche.",
      en: "Your seat is on the line. Defeat would knock you down a rung.",
    });
  }
  return L({
    fr: "Les " + t("elec_" + electionId).toLowerCase() + " approchent. Une investiture est à portée : " + t("pos_" + stake.target).toLowerCase() + ".",
    en: "The " + t("elec_" + electionId).toLowerCase() + " are coming. A nomination is within reach: " + t("pos_" + stake.target).toLowerCase() + ".",
  });
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

/* ==========================================================================
   Rendu — le budget
   ==========================================================================
   Ce qui rentre, ce qui sort, et ce qu'on décide d'y mettre. Les postes se
   règlent ici, à tout moment : c'est le seul endroit du jeu où le joueur
   agit en dehors d'une carte, et c'est voulu. Un budget se pilote, il ne se
   subit pas.
   ========================================================================== */

function budgetLine(label, amount, extraClass) {
  return (
    '<div class="budget-line' + (extraClass || "") + '">' +
      "<span>" + label + "</span>" +
      "<span>" + (amount < 0 ? "−" : "") + formatMoney(Math.abs(amount)) + "</span>" +
    "</div>"
  );
}

/** Ce qu'un niveau de dépense apporte, écrit à partir de ses données. */
function investEffectText(spec) {
  const parts = [];
  if (spec.hold) {
    Object.entries(spec.hold).forEach(([gauge, value]) => {
      parts.push(t(gauge === "popularity" ? "label_popularity" : "label_standing") + " : " +
        t("budget_fx_hold") + " " + Math.round(value * 100) + " %");
    });
  }
  if (spec.energy) parts.push(t("fx_energy_cap") + " " + signed(spec.energy * 2));
  if (spec.protect) parts.push(t("budget_fx_protect") + " " + Math.round(spec.protect * 100) + " %");
  return parts.join(" · ");
}

function investPostHTML(key) {
  const def = BUDGET_DATA.investments[key];
  const level = investLevel(game, key);
  const spec = def.levels[level];
  const next = def.levels[level + 1];
  const canUp = Boolean(next) && game.money >= next.cost;

  return (
    '<div class="budget-post">' +
      '<div class="budget-line">' +
        '<span title="' + escapeAttr(L(def.desc)) + '">' + L(def.label) + "</span>" +
        "<span>" + (spec.cost ? "−" + formatMoney(spec.cost) : "—") + "</span>" +
      "</div>" +
      '<div class="budget-level">' +
        '<button type="button" class="budget-btn" data-invest="' + key + '" data-delta="-1"' +
          (level > 0 ? "" : " disabled") + ">−</button>" +
        '<span class="budget-level-name">' + L(spec.name) +
          (level > 0 ? ' <span class="budget-level-fx">' + investEffectText(spec) + "</span>" : "") +
        "</span>" +
        '<button type="button" class="budget-btn" data-invest="' + key + '" data-delta="1"' +
          (canUp ? "" : " disabled") + ">+</button>" +
      "</div>" +
      (next
        ? '<p class="budget-next">' + t("budget_next") + " " + L(next.name) + " · −" +
            formatMoney(next.cost) + " · " + investEffectText(next) + "</p>"
        : "") +
    "</div>"
  );
}

function renderBudget() {
  const pane = document.getElementById("sheet-budget");
  if (!pane) return;

  const income = annualIncome(game);
  const expenses = annualExpenses(game);
  const balance = annualBalance(game);

  pane.innerHTML =
    '<p class="budget-title">' + t("budget_income") + "</p>" +
    budgetLine(t("budget_salary") + " · " + t("pos_" + game.position), income.salary) +
    budgetLine(t("budget_wealth"), income.wealth) +
    (income.hidden ? budgetLine(t("budget_hidden"), income.hidden) : "") +

    '<p class="budget-title">' + t("budget_expenses") + "</p>" +
    budgetLine(t("budget_lifestyle"), -expenses.lifestyle) +
    Object.keys(BUDGET_DATA.investments).map(investPostHTML).join("") +

    '<div class="budget-line budget-total' + (balance < 0 ? " is-negative" : "") + '">' +
      "<span>" + t("budget_balance") + "</span>" +
      "<span>" + (balance < 0 ? "−" : "+") + formatMoney(Math.abs(balance)) + "</span>" +
    "</div>";
}

/** Réglage d'un poste de dépense, depuis la fiche. */
function handleBudgetClick(event) {
  const post = event.target.closest("[data-invest]");
  if (!post) return;

  setInvestment(game, post.getAttribute("data-invest"), Number(post.getAttribute("data-delta")));
  saveGame();
  renderAll();
}

/* ==========================================================================
   Rendu — fins de partie
   ========================================================================== */

function renderEnd(host) {
  // La fin dépend de l'état exact de la carrière : la même victoire ne se
  // raconte pas de la même façon selon ce qu'on a laissé derrière soi.
  const ending = resolveEnding(game) || { title: { fr: "", en: "" }, text: { fr: "", en: "" } };
  const years = Math.floor(game.turn / 2);
  const traits = traitsOf(game);

  host.innerHTML =
    '<div class="event-card end-card end-' + game.ended.type + '">' +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      '<p class="end-title">' + L(ending.title) + "</p>" +
      '<p class="event-text">' + L(ending.text) + "</p>" +
      '<div class="end-recap">' +
        '<p><span>' + t("end_recap_years") + "</span><strong>" + years + "</strong></p>" +
        '<p><span>' + t("end_recap_peak") + "</span><strong>" +
          t(game.ended.type === "victory" ? "pos_president" : "pos_" + game.peakPosition) + "</strong></p>" +
        '<p><span>' + t("end_recap_money") + "</span><strong>" + formatMoney(game.money) + "</strong></p>" +
      "</div>" +
      (traits.length
        ? '<div class="end-traits">' +
            '<p class="end-traits-title">' + t("end_recap_traits") + "</p>" +
            traitRowsHTML(traits) +
          "</div>"
        : "") +
      '<div class="event-choices">' +
        '<button type="button" class="event-choice event-continue" data-restart>' + t("game_restart") + "</button>" +
      "</div>" +
    "</div>";
}

/* ==========================================================================
   Interactions
   ========================================================================== */

function handleClick(event) {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.hasAttribute("data-restart")) {
    localStorage.removeItem(GAME_KEY);
    localStorage.removeItem(CHARACTER_KEY);
    window.location.href = "create.html";
    return;
  }

  // Après le dépouillement : soit la partie est gagnée, soit elle continue.
  if (target.hasAttribute("data-campaign-done")) {
    const won = Boolean(game.ended);
    game.campaign = null;
    game.card = won ? { kind: "end" } : null;
    if (!won) advanceTurn();
    saveGame();
    renderAll();
    return;
  }

  if (game.ended && !target.hasAttribute("data-continue")) return;

  // Un temps de campagne : on applique le choix, le sondage bouge.
  if (target.hasAttribute("data-choice") && game.card.kind === "campaign") {
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
    return;
  }

  // Passage au temps suivant, puis les deux dimanches de dépouillement.
  if (target.hasAttribute("data-campaign-next")) {
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
    return;
  }

  if (target.hasAttribute("data-campaign-runoff")) {
    resolveRunoff();
    game.campaign.phase = "runoff";
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-choice")) {
    const ev = eventById(game.card.id);
    const choice = ev.choices[Number(target.getAttribute("data-choice"))];
    const outcome = resolveChoice(choice, game);
    markSeen(ev, game);
    game.card.resolved = true;
    game.card.resultText = outcome.text;
    game.card.resultChanges = outcome.changes;
    addLog(outcome.log);
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-run")) {
    const id = game.card.id;
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
    } else if (outcome.won) {
      const elu = {
        fr: "Victoire. Vous voici {pos_low:" + game.position + "}.",
        en: "Victory. You are now {pos_low:" + game.position + "}.",
      };
      game.card.resultText = fillMarks(L(elu));
      addLog(elu);
    } else {
      const battue = {
        fr: "Défaite. La politique rend tout, mais jamais tout de suite.",
        en: "Defeat. Politics gives everything back, never right away.",
      };
      game.card.resultText = L(battue);
      addLog(battue);
    }
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-lobby")) {
    const before = snapshot(game);
    // Travailler l'appareil rapporte d'autant moins qu'on y est déjà installé :
    // les dîners de fédération font un inconnu, ils ne font pas un chef.
    bumpStanding(game, lobbyGain(game));
    bump(game, "reseau", +1);
    bump(game, "energie", -1);
    game.card.resolved = true;
    game.card.resultChanges = diffSince(before, game);
    const appareil = {
      fr: "Vous passez la campagne dans les fédérations plutôt que dans les urnes. Des dîners, des promesses, quelques appuis gagnés à l'usure.",
      en: "You spend the campaign in the party bodies rather than at the ballot box. Dinners, promises, a few backers won by attrition.",
    };
    game.card.resultText = L(appareil);
    addLog(appareil);
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-skip")) {
    game.card.resolved = true;
    game.card.resultText = L({
      fr: "Vous laissez passer votre tour. Les absents ont toujours tort, mais ils durent.",
      en: "You sit this one out. The absent are always wrong, but they last.",
    });
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-continue")) {
    if (game.ended) game.card = { kind: "end" };
    else advanceTurn();
    saveGame();
    renderAll();
  }
}

function retire() {
  if (game.ended) return;
  if (!window.confirm(t("game_retire_confirm"))) return;
  game.ended = { type: "retire" };
  game.card = { kind: "end" };
  saveGame();
  renderAll();
}

/* ==========================================================================
   Démarrage
   ========================================================================== */

function renderAll() {
  buildStatRows();
  renderStatus();
  renderCard();
  renderBudget();
  renderLandscape();
  renderJournal();
}

(function init() {
  const saved = loadGame();
  if (saved) {
    game = saved;
    // Compatibilité avec les parties commencées avant les chaînes et avant
    // les traits : une sauvegarde d'alors n'a pas ces champs.
    if (!game.seen) game.seen = {};
    if (!game.traits) game.traits = [];
    if (!game.strikes) game.strikes = {};
    if (!game.investments) game.investments = {};
    if (!game.pending) {
      game.pending = [];
      // Une sauvegarde d'avant les délais avait une suite en attente immédiate.
      if (typeof game.pendingChain === "string") {
        game.pending.push({ id: game.pendingChain, turn: game.turn, expires: game.turn + 14 });
      }
      delete game.pendingChain;
    }
    if (game.campaign && !game.campaign.used) game.campaign.used = [];

    // Le paysage politique et les figures nommées sont arrivés après : une
    // partie plus ancienne se les voit reconstruire au chargement.
    if (!game.landscape) game.landscape = initialLandscape(game);
    if (!game.landscapeBefore) game.landscapeBefore = { ...game.landscape };
    if (game.alliance === undefined) game.alliance = null;
    if (game.scene === undefined) game.scene = null;
    game.rivals.forEach((r) => {
      if (r.popularity === undefined) r.popularity = figurePopularity(r);
    });

    // Chaque parti doit compter trois personnalités et un chef : on complète
    // les partis restés vides dans une sauvegarde d'avant.
    const usedNames = { [game.character.name || ""]: true };
    game.rivals.forEach((r) => { usedNames[r.name] = true; usedNames[surnameOf(r.name)] = true; });
    Object.keys(PARTIES).forEach((key) => {
      const count = game.rivals.filter((r) => r.party === key).length;
      for (let i = count; i < 3; i++) {
        game.rivals.push(makeFigure(key, usedNames, i === 0 ? "chef" : "espoir"));
      }
    });
    ensureLeaders();
    if (typeof game.president === "string" || !game.president) {
      const named = game.rivals.find((r) => r.name === game.president);
      game.president = game.president === "player"
        ? { isPlayer: true, name: game.character.name || "", party: game.party }
        : { name: named ? named.name : game.rivals[0].name,
            party: named ? named.party : game.rivals[0].party };
    }
    // La carte courante ne stocke que des identifiants : rien à reconstruire,
    // renderCard sait tout retrouver. Une carte non résolue perd son texte de
    // résultat au rechargement : on retire simplement au sort si besoin.
    if (game.card && game.card.kind === "event" && game.card.resolved && !game.card.resultText) {
      game.card = { kind: "event", id: drawEvent().id, resolved: false };
    }
  } else {
    const character = loadCharacter();
    if (!character || !character.party) {
      window.location.replace("create.html");
      return;
    }
    game = newGame(character);
    game.card = { kind: "event", id: drawEvent().id, resolved: false };
    saveGame();
  }

  document.getElementById("event-area").addEventListener("click", handleClick);
  document.getElementById("sheet-budget").addEventListener("click", handleBudgetClick);
  document.getElementById("retire-btn").addEventListener("click", retire);

  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("languagechange", renderAll);
  if (document.readyState !== "loading") renderAll();
})();
