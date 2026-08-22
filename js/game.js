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
    // LE PARLEMENT EUROPÉEN N'ÉTAIT NULLE PART. Aucune figure n'était jamais
    // députée européenne, ni à la création ni par promotion : le joueur
    // pouvait siéger à Strasbourg sans y croiser un seul nom connu, et le
    // rapport de force ne montrait jamais personne à ce poste. Le siège est
    // plus rare que les autres, comme dans la vraie vie, mais il existe.
    position: model.position ||
      (rank === "espoir"
        ? ["militant", "conseiller", "conseiller"][randInt(3)]
        : ["maire", "depute", "depute", "euro"][randInt(4)]),
    progress: 0,
    stats: {
      charisme: model.floor + randInt(5),
      reseau: model.floor + randInt(5),
      notoriete: model.notoriety + randInt(5),
      reputation: 3 + randInt(5),
      // La stature suit le rang : un chef de parti installé se présente tout
      // seul, un espoir doit encore convaincre qu'il tiendrait le poste.
      credibilite: model.floor + randInt(4),
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
 * La main tirée sur la page de tirage est enregistrée avec le personnage : la
 * partie l'applique, elle ne la retire pas. Une partie lancée sans passer par
 * cette page (une vieille sauvegarde, une adresse tapée à la main) tire quand
 * même, pour ne jamais démarrer sans rien.
 */
function dealBirthTraits(state) {
  const main = (state.character.draw && state.character.draw.traits)
    ? state.character.draw
    : drawBirthTraits();

  main.traits.forEach((id) => addTrait(state, id));
  state.draw = main;
  return main.traits;
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
    // Huit figures par parti, ET CE SONT DES PONTES. On est passé de trois à
    // cinq quand le paysage était trop pauvre pour former un gouvernement,
    // puis à huit pour qu'un parti au pouvoir ait encore des députés après
    // avoir fourni un Premier ministre et trois ministres.
    //
    // La composition compte autant que le nombre. À quatre espoirs sur huit,
    // la moitié d'une fédération était faite de militants de trente ans dont
    // personne n'a entendu parler : on ne reconnaissait aucun nom d'un tour
    // sur l'autre. Un parti, ce sont des cadres installés qui se disputent
    // la place, et deux jeunes qui poussent derrière. Les jeunes montent
    // tout seuls, et les places se libèrent avec les retraites.
    ["chef", "cadre", "cadre", "cadre", "cadre", "cadre", "espoir", "espoir"].forEach((rank) => {
      rivals.push(makeFigure(key, usedNames, rank));
    });
  });

  const state = {
    character,
    party: character.party,
    // Tous les camps traversés. Une étiquette d'origine ne se décolle jamais
    // tout à fait, et certains traits ne se donnent qu'à ceux qui en viennent.
    parties: [character.party],
    // Combien de fois le parti vous a présenté à la présidentielle.
    presidentialRuns: 0,
    stats: computeStats(character),
    money: computeMoney(character),
    // Ce avec quoi on entre en politique. Sert de point zéro : la justice
    // s'intéresse à ce qu'une carrière rapporte, pas à ce dont on a hérité.
    startMoney: computeMoney(character),
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
    draw: null,           // le tirage de départ, pour la carte d'ouverture
    race: null,           // la campagne d'une élection ordinaire, en cours
    president: null,      // { name, party } ou { isPlayer: true }
    presidentTerms: 1,    // mandats consécutifs déjà faits par le sortant
    approval: 52,         // la cote du gouvernement dans le pays, 0 à 100
    assembly: null,       // les 577 sièges, par parti ; fixés à chaque législative
    coalition: null,      // les partis qui soutiennent le gouvernement
    dissolution: null,    // le tour d'une législative anticipée, s'il y en a une
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

  // Le caractère est un trait, mais ses points sont déjà dans computeStats :
  // on l'inscrit sur la fiche sans les compter une seconde fois.
  if (TRAIT_DATA[character.personality]) traitsOf(state).push(character.personality);

  // Celui-là ne se tire pas et ne se choisit pas : il vient avec la fiche.
  if (character.sex === "female") traitsOf(state).push("femme");

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
  return 28 - PARTIES[key].difficulty * 5;
}

/**
 * Vitesse du rappel vers le socle, par tour.
 *
 * Elle était deux fois plus forte, et c'est ce qui rendait le tableau
 * illisible : un choc encaissé revenait à son point de départ en une dizaine
 * de tours, si bien que rien de ce qui arrivait dans la partie ne laissait de
 * trace. Le paysage doit garder la mémoire de ce qu'on lui fait, sinon il
 * n'est qu'un décor qui tremble.
 */
const LANDSCAPE_PULL = 0.03;

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

/* ==========================================================================
   LE POUVOIR : SA COTE, SA MAJORITÉ
   ==========================================================================
   Le jeu savait QUI gouverne, jamais COMMENT. Un parti au pouvoir voyait sa
   part s'éroder dans le tableau, et c'était tout : rien ne disait si le
   gouvernement était aimé ou détesté, rien ne distinguait un exécutif qui
   tient l'Assemblée d'un exécutif qui négocie chaque texte. Or c'est
   exactement là que se joue une carrière : on ne fait pas la même chose dans
   l'opposition face à un pouvoir à trente pour cent de cote et face au même
   pouvoir à soixante.

   DEUX VALEURS, ET ELLES SE VOIENT. La cote du gouvernement bouge à chaque
   tour, tirée par ce que pèse le parti au pouvoir, usée par l'exercice, et
   secouée par un peu de hasard ; les événements la déplacent aussi, avec
   l'effet "approval". La majorité, elle, se fixe à chaque législative et ne
   bouge plus jusqu'à la suivante.
   ========================================================================== */

/** Ce que gouverner coûte par tour, et de plus en plus au second mandat. */
const APPROVAL_WEAR = 1.3;

/**
 * Vitesse de rappel vers la cote que mérite le parti au pouvoir, et amplitude
 * du bruit autour.
 *
 * Le premier réglage rappelait trop fort et secouait trop peu : mesurée sur
 * soixante-dix carrières, la cote tenait entre quarante-quatre et
 * cinquante-neuf neuf fois sur dix. Un gouvernement n'était jamais ni aimé ni
 * détesté, seulement tiède, et les scènes qui demandent un pouvoir aux abois
 * ne sortaient donc jamais. Un rappel plus lâche et un bruit plus large font
 * de vraies traversées du désert, et de vrais états de grâce.
 */
const APPROVAL_PULL = 0.09;
const APPROVAL_NOISE = 9;

/**
 * La cote que vaudrait le gouvernement au vu de la seule force de son camp.
 * Un parti à seize pour cent gouverne autour de cinquante ; à vingt-huit, il
 * est porté ; à huit, il ne l'est plus par personne.
 */
function approvalTarget() {
  const ruling = rulingParty();
  if (!ruling) return 50;
  return clamp100(30 + (game.landscape[ruling] || 16) * 1.25);
}

function driftApproval() {
  if (!game.president) return;

  let move = (approvalTarget() - game.approval) * APPROVAL_PULL;
  move -= APPROVAL_WEAR + (game.presidentTerms - 1) * 1.1;
  move += (Math.random() - 0.5) * APPROVAL_NOISE;

  game.approval = clamp100(game.approval + move);
}

/* --------------------------------------------------------------------------
   L'ASSEMBLÉE
   --------------------------------------------------------------------------
   Cinq cent soixante-dix-sept sièges, répartis le soir des législatives et
   plus retouchés jusqu'aux suivantes.

   LE SCRUTIN MAJORITAIRE N'EST PAS PROPORTIONNEL, et c'est tout l'intérêt de
   le modéliser : à deux tours, dans cinq cent soixante-dix-sept duels, un
   parti à vingt-huit pour cent des voix rafle bien plus de vingt-huit pour
   cent des sièges, et un parti à huit n'a presque rien même s'il a des
   électeurs partout. On élève donc les parts à une puissance avant de
   normaliser : c'est la façon la plus simple d'obtenir cette amplification,
   et elle se règle d'un seul chiffre.

   La cote du gouvernement pèse en plus, parce qu'on vote les législatives un
   an après la présidentielle et qu'on donne encore sa chance à celui qu'on
   vient d'élire, ou qu'on le lui reprend déjà.

   Il n'y a pas de Sénat. Ce n'est pas un oubli : il ne se dissout pas, il ne
   censure pas, et il ne changerait rien à une carrière.
   -------------------------------------------------------------------------- */

const ASSEMBLY_SEATS = 577;

/** La majorité absolue : deux cent quatre-vingt-neuf sièges. */
const ASSEMBLY_MAJORITY = Math.floor(ASSEMBLY_SEATS / 2) + 1;

/**
 * L'AMPLIFICATION DU SCRUTIN MAJORITAIRE.
 *
 * À 1,7, le premier parti plafonnait à trente pour cent des sièges et la
 * majorité absolue n'existait tout simplement pas : deux fois sur mille en
 * soixante-dix carrières. Or une Assemblée où personne ne peut jamais
 * gouverner seul n'est pas une Assemblée, c'est une impasse permanente.
 *
 * À 2,1, un camp qui domine nettement l'opinion sort avec une majorité, un
 * camp qui domine de peu sort avec une majorité relative, et un paysage
 * éclaté ne donne rien à personne. C'est le comportement du scrutin
 * majoritaire à deux tours.
 */
const ASSEMBLY_POWER = 2.1;

/** Répartit les sièges. Appelé le soir de chaque législative, et seulement là. */
function computeAssembly() {
  const ruling = rulingParty();

  const poids = {};
  Object.keys(PARTIES).forEach((key) => {
    const part = Math.max(0.5, game.landscape[key] || 0);
    // La prime au camp du président, ou la note qu'il paie : un an après son
    // élection, on lui donne une majorité ou on la lui refuse.
    const souffle = key === ruling ? 1 + (game.approval - 50) / 160 : 1;
    // Chaque scrutin a ses accidents locaux.
    poids[key] = Math.pow(part, ASSEMBLY_POWER) * souffle * (0.9 + Math.random() * 0.2);
  });

  const total = Object.values(poids).reduce((s, w) => s + w, 0) || 1;
  const sieges = {};
  let places = 0;
  Object.keys(poids).forEach((key) => {
    sieges[key] = Math.round((poids[key] / total) * ASSEMBLY_SEATS);
    places += sieges[key];
  });

  // L'arrondi ne tombe jamais juste : le reste va au plus gros groupe.
  const plusGros = Object.keys(sieges).reduce((a, b) => (sieges[a] >= sieges[b] ? a : b));
  sieges[plusGros] += ASSEMBLY_SEATS - places;

  game.assembly = sieges;
  formCoalition();
  return sieges;
}

/**
 * LE BLOC QUI SOUTIENT LE GOUVERNEMENT.
 *
 * Un gouvernement ne gouverne jamais seul : une majorité présidentielle est
 * toujours une coalition, et les partis idéologiquement les plus proches
 * votent ses textes sans être de son parti. Sans cela, la majorité absolue
 * n'existait pas du tout, un pour cent des tours mesurés.
 *
 * ON RENVOIE LA LISTE, PAS UN NOMBRE PONDÉRÉ. Le premier réglage comptait
 * les voisins pour trois cinquièmes de leurs sièges : cela donnait un
 * gouvernement à trois cent soixante-dix-sept sièges alors qu'aucun parti
 * affiché n'en avait plus de cent soixante-neuf, et le joueur n'avait aucun
 * moyen de refaire l'addition. Une information qu'on ne peut pas vérifier
 * n'est pas une information. Le bloc est donc une liste de partis, ses
 * sièges s'additionnent exactement, et l'interface les nomme.
 *
 * En échange de cette franchise, on est plus exigeant sur qui en fait
 * partie : la moitié de la distance de voisinage, c'est-à-dire le camp
 * immédiatement adjacent, pas tout le côté de l'hémicycle.
 */
const COALITION_DISTANCE = NEIGHBOUR_DISTANCE / 2;

/**
 * QUI SOUTIENT, ÇA SE NÉGOCIE, ÇA NE SE DÉDUIT PAS.
 *
 * Le bloc était une fonction de la seule distance idéologique : avec les
 * centristes au pouvoir, les sociaux-démocrates soutenaient dans toutes les
 * parties, à tous les tours, sans exception. Un paysage qui donne toujours
 * la même réponse ne raconte rien.
 *
 * La coalition se forme donc au soir de chaque législative, une fois, et
 * tient jusqu'aux suivantes. La proximité donne sa chance à chaque camp, et
 * la cote du gouvernement pèse : on rejoint volontiers un pouvoir qui monte,
 * on laisse seul un pouvoir qui coule. Le parti du président en fait
 * évidemment partie, et un pacte signé par le joueur tient quoi qu'il
 * arrive, parce que celui-là, il l'a payé.
 */
function formCoalition() {
  const ruling = rulingParty();
  if (!ruling) { game.coalition = []; return game.coalition; }

  const pacte = ruling === game.party ? allyParty() : null;
  const bloc = [];

  Object.keys(PARTIES).forEach((key) => {
    if (key === ruling || key === pacte) { bloc.push(key); return; }

    const distance = ideologicalDistance(key, ruling);
    if (distance > NEIGHBOUR_DISTANCE) return;

    const proximite = 1 - distance / NEIGHBOUR_DISTANCE;
    const chance = 0.10 + proximite * 0.5 + (game.approval - 50) / 220;
    if (Math.random() < chance) bloc.push(key);
  });

  game.coalition = bloc;
  return bloc;
}

function governmentBloc() {
  const ruling = rulingParty();
  if (!ruling || !game.assembly) return [];
  if (!game.coalition || !game.coalition.includes(ruling)) return formCoalition();
  return game.coalition;
}

function governmentSeats() {
  if (!game.assembly) return 0;
  return governmentBloc().reduce((total, key) => total + (game.assembly[key] || 0), 0);
}

/**
 * « absolue », « relative » ou « aucune ». C'est ce que lisent les événements.
 *
 * Le seuil du milieu ne se compte pas en sièges mais en rang : un
 * gouvernement qui est le premier groupe de l'Assemblée gouverne, en
 * négociant chaque texte ; un gouvernement qui n'est même pas le premier
 * groupe ne gouverne que parce que ceux d'en face ne s'entendent pas. Un
 * seuil fixe au tiers classait « sans majorité » un camp de cent
 * soixante-quinze sièges qui dominait pourtant l'hémicycle.
 */
function majorityState() {
  const sieges = governmentSeats();
  if (sieges >= ASSEMBLY_MAJORITY) return "absolue";
  if (!game.assembly) return "relative";

  const plusGros = Math.max(...Object.values(game.assembly));
  return sieges >= plusGros ? "relative" : "aucune";
}

/** Qui occupe Matignon : le joueur, une figure, ou personne. */
function primeMinister() {
  if (game.position === "premier") {
    return { name: game.character.name || t("sheet_name_empty"), party: game.party,
             sex: game.character.sex, isPlayer: true };
  }
  const figure = game.rivals.find((r) => r.position === "premier");
  return figure ? { name: figure.name, party: figure.party, sex: figure.sex } : null;
}

/**
 * LA NATURE DU GOUVERNEMENT. Un Premier ministre du parti du président
 * gouverne avec sa majorité ; un Premier ministre venu d'ailleurs est un
 * gouvernement d'ouverture, et cela se paie des deux côtés.
 */
function governmentKind() {
  const pm = primeMinister();
  const ruling = rulingParty();
  if (!pm || !ruling) return null;
  return pm.party === ruling ? "majorite" : "ouverture";
}

/** Ce que l'onglet affiche : les sièges du bloc, et ceux du seul parti. */
function rulingPartySeats() {
  const ruling = rulingParty();
  return ruling && game.assembly ? game.assembly[ruling] || 0 : 0;
}

/**
 * LA CENSURE QUI ARRIVE SANS VOUS.
 *
 * Une dissolution ne pouvait tomber que par un choix du joueur, dans une
 * scène rare, sur un jet réussi : mesurée sur quatre-vingts carrières
 * entières, elle n'est jamais arrivée une seule fois. Un mécanisme qui
 * n'existe jamais n'existe pas.
 *
 * Un gouvernement très impopulaire et sans majorité absolue peut donc
 * désormais tomber tout seul, que le joueur soit député d'opposition,
 * ministre ou maire d'une ville moyenne qui l'apprend à la radio. C'est
 * ainsi que ces choses se passent : on est rarement celui qui compte les
 * voix. Le président dissout dans la foulée et le pays revote.
 */
const CENSURE_APPROVAL = 26;
const CENSURE_CHANCE = 0.11;

function maybeCensure() {
  if (game.dissolution || !game.president) return;
  if (game.approval > CENSURE_APPROVAL) return;
  if (majorityState() === "absolue") return;
  if (Math.random() > CENSURE_CHANCE) return;

  game.dissolution = game.turn + 1;
  game.approval = clamp100(game.approval - 6);

  addLog({
    fr: "Une motion de censure est adoptée et le gouvernement tombe. Le président dissout l'Assemblée dans la nuit : le pays revote dans six semaines.",
    en: "A no-confidence motion passes and the government falls. The president dissolves the Assembly overnight: the country votes again in six weeks.",
  });
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
    // Moins de bruit qu'avant : quand tout tremble sans raison, le joueur ne
    // peut pas voir ce que ses choix ont fait. Le mouvement doit être causé.
    let move = (Math.random() - 0.5) * 0.9;

    // Le rappel vers ce que le parti pèse naturellement dans le pays.
    move += (naturalShare(key) / floor - game.landscape[key]) * LANDSCAPE_PULL;

    // GOUVERNER USE, ET DE PLUS EN PLUS. Un premier mandat s'entame
    // doucement, un second se paie plein tarif : c'est ce qui fait respirer
    // le tableau au lieu de le laisser figé sur ses socles.
    if (key === ruling) move -= 0.45 + (game.presidentTerms - 1) * 0.5;

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
  reportLandscape();
}

/* ==========================================================================
   DIRE POURQUOI ÇA BOUGE
   ==========================================================================
   Le tableau montrait des flèches et jamais une raison. Un parti montait de
   quatre points en six ans sans que rien, nulle part, ne l'explique : le
   joueur voyait le résultat d'une mécanique qu'il ne pouvait pas apprendre.

   On surveille donc les mouvements de fond — pas ceux d'un tour, qui ne
   veulent rien dire — et quand un camp a franchi une marche, on l'écrit dans
   le journal avec la cause la plus probable. C'est une lecture d'éditorial,
   pas un relevé : on dit « le pays se lasse de ceux qui gouvernent », jamais
   « moins 0,9 point par tour ».
   ========================================================================== */

/**
 * Le mouvement qu'il faut avoir accumulé pour qu'on en parle. Deux points et
 * demi : au-dessus, le tableau bougeait sans que le journal l'explique jamais
 * ; en dessous, on commenterait le bruit.
 */
const LANDSCAPE_STORY = 2.5;

function reportLandscape() {
  if (!game.landscapeMarks) game.landscapeMarks = { ...game.landscape };

  const ruling = rulingParty();

  Object.keys(game.landscape).forEach((key) => {
    const depuis = game.landscapeMarks[key];
    if (depuis === undefined) { game.landscapeMarks[key] = game.landscape[key]; return; }

    const ecart = game.landscape[key] - depuis;
    if (Math.abs(ecart) < LANDSCAPE_STORY) return;

    game.landscapeMarks[key] = game.landscape[key];
    const monte = ecart > 0;

    // La cause la plus probable, dans l'ordre où elle compte.
    let texte;
    if (!monte && key === ruling) texte = {
      fr: "Dans le pays, {party_the:" + key + "} " + accordParti(key, "s'érode", "s'érodent") +
          ". C'est ce qui arrive quand on gouverne, et personne au pouvoir n'a jamais trouvé le remède.",
      en: "Out in the country, {party_the:" + key + "} are slipping. That is what governing does, and nobody in power has ever found the cure.",
    };
    else if (monte && key === game.party) texte = {
      fr: "Les intentions de vote pour {party_the:" + key + "} montent nettement, et l'on commence à écrire que vous y êtes pour quelque chose.",
      en: "Voting intentions for {party_the:" + key + "} are up sharply, and people are starting to write that you have something to do with it.",
    };
    else if (!monte && key === game.party) texte = {
      fr: "Dans les sondages, {party_the:" + key + "} " + accordParti(key, "décroche", "décrochent") +
          ". En réunion, personne ne vous regarde en le disant, ce qui est pire que de vous regarder.",
      en: "In the polls, {party_the:" + key + "} are falling away. In meetings nobody looks at you while saying it, which is worse than if they did.",
    };
    else if (monte) texte = {
      fr: "Partout, {party_the:" + key + "} " + accordParti(key, "progresse", "progressent") +
          ". On " + accordParti(key, "l'invitait", "les invitait") + " pour meubler, on " +
          accordParti(key, "l'invite", "les invite") + " maintenant pour ce " +
          accordParti(key, "qu'elle pèse", "qu'ils pèsent") + ".",
      en: "Everywhere you look, {party_the:" + key + "} are gaining. They used to be invited to fill airtime; now they are invited for what they weigh.",
    };
    else texte = {
      fr: "Le reflux est net : {party_the:" + key + "} " + accordParti(key, "recule", "reculent") +
          ", et " + accordParti(key, "ses", "leurs") +
          " cadres commencent à se demander tout haut si c'est le programme ou la personne.",
      en: "The retreat is clear: {party_the:" + key + "} are losing ground, and their people are starting to ask out loud whether it is the programme or the person.",
    };

    addLog(texte);
  });
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
  const rate = target < current ? DRIFT_DOWN * (1 - hold) : DRIFT;
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
  // Une dissolution insère des législatives hors calendrier. Elles comptent
  // comme les autres, elles apparaissent dans la frise, et elles ne
  // décalent pas le calendrier ordinaire : l'Assemblée élue à chaud reprend
  // simplement le cycle là où il en était.
  if (game.dissolution === turn) return ELECTIONS.find((e) => e.id === "legislatives");
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

/* ==========================================================================
   LE CALENDRIER ÉLECTORAL
   ==========================================================================
   Les échéances tombaient sans prévenir. La prochaine était écrite en petit
   au milieu de la fiche, entre les traits et le budget ; les suivantes
   n'existaient nulle part. On découvrait le congrès qui décide de la
   direction du parti le jour où il se tenait, avec la cote qu'on avait ce
   jour-là, et il était trop tard pour en avoir une autre.

   Une carrière politique se prépare à trois ans, pas à six mois. Le
   calendrier donne donc les quatre prochaines échéances et, pour chacune, ce
   qu'elle veut dire pour vous AUJOURD'HUI : le siège qu'on peut prendre,
   celui qu'on défend, l'investiture qui n'est pas gagnée, ou le scrutin qui
   se jouera sans vous. C'est une projection, pas une promesse : elle est
   lue avec la fonction et la cote du moment, et c'est précisément ce qui la
   rend utile, puisqu'on a le temps de les changer.
   ========================================================================== */

/** Combien d'échéances on montre. Quatre couvrent trois à cinq ans. */
const CALENDAR_LENGTH = 4;

/** Jusqu'où on cherche. Deux cycles complets suffisent toujours. */
const CALENDAR_HORIZON = 26;

function electionCalendar() {
  const suite = [];
  for (let ahead = 1; ahead <= CALENDAR_HORIZON && suite.length < CALENDAR_LENGTH; ahead++) {
    const e = electionAtTurn(game.turn + ahead);
    if (e) suite.push({ id: e.id, inTurns: ahead, stake: playerStake(e.id) });
  }
  return suite;
}

/**
 * Dans combien de temps, en toutes lettres. Un tour vaut six mois, et
 * « dans 2.5 ans » ne se dit pas.
 */
function horizonLabel(turns) {
  if (turns <= 1) return t("cal_six_months");
  if (turns === 2) return t("cal_one_year");
  // « dans 1 ans et demi » ne se dit pas : la première année s'écrit en toutes lettres.
  if (turns === 3) return t("cal_one_year_half");

  const ans = Math.floor(turns / 2);
  const demi = turns % 2 === 1;
  return t(demi ? "cal_years_half" : "cal_years").replace("{n}", ans);
}

/**
 * Ce que cette élection propose au joueur selon sa fonction actuelle.
 * Renvoie null si elle ne le concerne pas (elle se joue alors sans lui).
 */
/**
 * La cote au parti à partir de laquelle un cadre prend une tête de liste
 * municipale plutôt qu'une place sur celle d'un autre. En dessous, on fait
 * le nombre ; au-dessus, on porte la ville.
 */
const CADRE_MAYOR_STANDING = 50;

function playerStake(electionId) {
  const pos = game.position;

  /* Les seuils ne sont pas devinés : ils sont calés sur ce que valent
     réellement les candidats au moment où ils se lancent, mesuré sur des
     milliers de tentatives. Une marche à monter se gagne un peu moins d'une
     fois sur deux, une défense un peu plus de trois fois sur quatre, et la
     direction du parti reste le verrou de la partie. */

  if (electionId === "municipales") {
    // Six ans, et la ville revote. La mairie est le mandat le mieux défendu du
    // jeu — on vote pour quelqu'un qu'on croise au marché, et un sortant
    // survit à l'effondrement national de son parti — mais il se défend :
    // seuil calé sur cinq réélections sur six, mesuré en partie réelle.
    if (pos === "maire") return { target: "maire", threshold: 60, defense: true };
    if (pos === "militant") return { target: "conseiller", threshold: 41 };
    // LA MARCHE MANQUANTE. Le cadre ne pouvait viser que le conseil, et la
    // mairie n'était donc accessible qu'à un conseiller municipal encore en
    // poste le jour du scrutin, une fois tous les six ans. Entre-temps, le
    // siège européen se prend avec une cote de 14 contre 57, et il arrive
    // avant : le conseiller partait à Strasbourg avant d'avoir pu viser
    // l'hôtel de ville. Résultat mesuré sur cent vingt carrières entières,
    // dix-sept pour cent seulement passaient par une mairie.
    //
    // Un secrétaire de fédération qui pèse prend une tête de liste sans être
    // passé par le conseil : c'est ainsi que ça se fait. Les autres restent
    // sur la liste de quelqu'un d'autre.
    if (pos === "cadre") {
      return game.standing >= CADRE_MAYOR_STANDING
        ? { target: "maire", threshold: 62 }
        : { target: "conseiller", threshold: 43 };
    }
    // Le conseiller qui vise la mairie brigue la tête de liste, pas un
    // deuxième siège : échouer le laisse au conseil, où il était déjà.
    if (pos === "conseiller") return { target: "maire", threshold: 57 };
    return null;
  }
  if (electionId === "europeennes") {
    /* La liste européenne est la porte de service : elle s'ouvre plus
       facilement que les autres, et elle vaut moins cher.

       ELLE ÉTAIT GRANDE OUVERTE. Les seuils valaient 12 à 22 quand le score
       d'une européenne tourne autour de soixante : quarante-cinq à cinquante
       points de marge, c'est-à-dire un siège offert à qui le demandait. Le
       résultat se lisait dans les carrières : quatre-vingt-trois pour cent
       d'entre elles passaient par Strasbourg, contre dix-sept par une
       mairie. Le député européen n'était pas une voie alternative, c'était
       la voie normale, et le conseiller municipal partait à Bruxelles avant
       d'avoir pu viser son hôtel de ville.

       Le coupable était le VENT, pas les seuils : le rapport de force pesait
       2,6 fois son poids ici contre 0,35 aux municipales, si bien que la
       part nationale du camp faisait à elle seule tout le score. Le
       coefficient est ramené dans le rang avec les autres (voir
       PARTY_WEIGHT), et les seuils restent bas, à peine relevés, parce que
       la base d'une européenne est basse par construction : on y vote pour
       une étiquette, la personne du candidat n'y fait presque rien.

       Reste que la porte était trop grande ouverte : quatre-vingt-deux pour
       cent des carrières passaient par Strasbourg contre dix-huit par une
       mairie. Les seuils de conquête ont donc été relevés jusqu'à ce que les
       deux voies s'équilibrent, en mesurant à chaque palier sur quatre-vingt
       -dix carrières entières plutôt qu'en le devinant. Le seuil de DÉFENSE,
       lui, reste bien plus bas que ceux de conquête : garder un siège doit
       être plus facile que d'en prendre un, c'est tout le sujet de
       INCUMBENT_EDGE. */
    if (pos === "euro") return { target: "euro", threshold: 40, defense: true };
    if (pos === "maire") return { target: "euro", threshold: 52 };
    if (pos === "conseiller") return { target: "euro", threshold: 46 };
    if (pos === "cadre") return { target: "euro", threshold: 46 };
    if (pos === "militant") return { target: "euro", threshold: 44 };
    return null;
  }
  if (electionId === "legislatives") {
    if (pos === "depute") return { target: "depute", threshold: 68, defense: true };
    if (pos === "euro") return { target: "depute", threshold: 58 };
    if (pos === "maire") return { target: "depute", threshold: 46 };
    if (pos === "conseiller") return { target: "depute", threshold: 43 };
    // Un battu que l'appareil a recasé repart avec le fichier et la machine,
    // pas avec la circonscription : un peu mieux qu'un militant, moins bien
    // qu'un élu qui a un bilan à montrer.
    if (pos === "cadre") return { target: "depute", threshold: 41 };
    if (pos === "militant") return { target: "depute", threshold: 38 };
    return null;
  }
  if (electionId === "congres") {
    // Le verrou de la partie : on ne prend pas la direction d'un parti parce
    // qu'on est aimé du pays, mais parce que l'appareil n'a pas trouvé mieux.
    if (pos === "chef") return { target: "chef", threshold: 69, defense: true };
    // Matignon est une rampe de lancement vers la direction du parti : on
    // arrive au congrès avec un bilan que les autres n'ont pas.
    if (pos === "premier") return { target: "chef", threshold: 64 };
    if (pos === "ministre") return { target: "chef", threshold: 68 };
    if (pos === "depute" || pos === "maire" || pos === "euro") return { target: "chef", threshold: 68 };
    // Sans mandat, mais avec l'appareil : c'est ainsi que reviennent les
    // battus. Le seuil de cote au parti reste le vrai verrou.
    if (pos === "cadre") return { target: "chef", threshold: 66 };
    return null;
  }
  if (electionId === "presidentielle") {
    // Deux candidatures par carrière, quel que soit le chemin. Au-delà, le
    // parti cherche un visage neuf, et c'est ce qu'il fait dans la vraie vie.
    if ((game.presidentialRuns || 0) >= PRIMARY_MAX_RUNS) return null;

    // C'EST LA PRIMAIRE QUI DÉSIGNE, PAS LA FONCTION. Le jeu réservait la
    // présidentielle au chef du parti : un ministre brillant, très bien coté
    // et connu du pays voyait passer chaque échéance sans qu'on lui propose
    // jamais rien. On concourt désormais parce qu'on a gagné l'investiture.
    if (game.nominee === "player") return { target: "president", threshold: 0 };
    if (game.nominee) return null;

    // Filet de sécurité : si aucune primaire n'a eu lieu, la direction du
    // parti reste la porte d'entrée qu'elle a toujours été.
    if (pos === "chef" || pos === "premier") return { target: "president", threshold: 0 };
    return null;
  }
  return null;
}

/**
 * Les fonctions qui sont des mandats : elles s'obtiennent devant des
 * électeurs, et on ne peut en tenir qu'une. Militant et cadre du parti n'en
 * sont pas, un ministère se donne, la direction du parti se vote entre
 * militants.
 */
const MANDATES = ["conseiller", "maire", "euro", "depute"];

/**
 * Donne une fonction sans passer par les urnes, et tient à jour le sommet
 * atteint : une carrière se juge à la plus haute marche qu'elle a touchée,
 * pas à celle où elle s'arrête.
 *
 * C'est aussi ici qu'on lâche ce qu'on tenait. Le cumul n'existe pas : on
 * démissionne du mandat précédent en prenant le suivant, et le joueur doit
 * le lire noir sur blanc, sans quoi il croit garder sa mairie.
 */
function setOffice(s, position) {
  if (!position || !LADDER.includes(position) || s.position === position) return false;

  const quitte = s.position;
  const monte = LADDER.indexOf(position) > LADDER.indexOf(quitte);


  s.position = position;
  if (LADDER.indexOf(position) > LADDER.indexOf(s.peakPosition)) s.peakPosition = position;

  // Le maire est conseiller municipal : c'est le même mandat, pas un
  // deuxième. On ne démissionne de rien en montant du conseil à la mairie.
  const memeMandat = quitte === "conseiller" && position === "maire";

  // Ce qu'on a été reste. La marque tombe en quittant la fonction, jamais en
  // l'occupant : on n'est pas « ancien ministre » tant qu'on est ministre.
  if (quitte === "ministre") addTrait(s, "ancien_ministre");
  if (quitte === "premier") addTrait(s, "ancien_premier");

  if (monte && !memeMandat && MANDATES.includes(quitte)) {
    addLog({
      fr: "Vous quittez vos fonctions de {pos_low:" + quitte + "} : on ne tient qu'un mandat à la fois, et votre successeur était désigné avant votre départ.",
      en: "You step down as {pos_low:" + quitte + "}: you only get to hold one office at a time, and your successor was picked before you left.",
    });
  }
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

/**
 * LA PART DE HASARD D'UNE SOIRÉE ÉLECTORALE.
 *
 * Elle valait Math.random() * 12 : une bande plate de douze points, où
 * toutes les fortunes étaient également probables. Douze points, quand le
 * rapport de force en déplaçait trente-neuf à lui seul, ne laissaient
 * aucune place au doute : mesuré scrutin par scrutin, on passait de zéro
 * pour cent de victoires à cent en franchissant cinq points de paysage. Ce
 * n'étaient pas des courbes, c'étaient des falaises, et le joueur n'a jamais
 * vu une élection se jouer de peu.
 *
 * Trois tirages moyennés font une cloche : les soirées ordinaires se
 * ressemblent, les surprises existent et restent rares, ce qui est
 * exactement le comportement d'un scrutin. La moyenne reste à six points,
 * de sorte qu'aucun seuil du jeu n'a besoin d'être retouché ; c'est
 * seulement l'écart-type qui passe de trois et demi à six, et la zone où le
 * résultat est réellement incertain qui passe de six points à vingt.
 */
const LUCK_MEAN = 6;
const LUCK_SPREAD = 36;

function electionLuck() {
  // Trois dés moyennés : une cloche entre −0,5 et +0,5, écart-type 1/6.
  const cloche = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
  return LUCK_MEAN + cloche * LUCK_SPREAD;
}

/**
 * LE POIDS DU RAPPORT DE FORCE, SCRUTIN PAR SCRUTIN.
 *
 * Le coefficient dit combien de points de score vaut UN point de part
 * nationale au-dessus de la moyenne. Il valait 0,35 aux municipales et 2,6
 * aux européennes : passer de dix à vingt-cinq pour cent dans le pays
 * rapportait cinq points sur un scrutin et trente-neuf sur l'autre. Le
 * premier ne se sentait pas, le second écrasait tout le reste et
 * transformait l'élection en interrupteur.
 *
 * Les quatre coefficients sont désormais du même ordre de grandeur, et
 * classés comme ils doivent l'être : plus le scrutin est national, plus
 * l'étiquette pèse. Passer de dix à vingt-cinq pour cent vaut vingt-deux
 * points aux européennes, dix-huit aux législatives, dix aux municipales.
 * Cela déplace toujours une élection ; cela ne la décide plus tout seul.
 *
 * LE CONGRÈS GARDE SON SIGNE NÉGATIF, et ce n'est pas un oubli : on n'y
 * vote pas dans le pays mais entre militants, et un parti qui s'effondre
 * cherche un visage neuf quand un parti qui gagne garde le sien. La
 * magnitude passe seulement de 0,25 à 0,15, pour que ce soit une couleur et
 * non un verrou.
 */
const PARTY_WEIGHT = {
  municipales: 0.7,
  legislatives: 1.2,
  europeennes: 1.5,
  congres: -0.15,
};

/**
 * L'AVANTAGE DU SORTANT.
 *
 * Un sortant a son nom sur les panneaux depuis six ans, un bilan à montrer
 * et une machine locale qui a déjà gagné une fois. Le moteur lui donnait
 * l'inverse : un seuil PLUS HAUT que celui d'un challenger, soixante-huit
 * contre quarante-six pour un siège de député, compensé seulement par de
 * meilleures statistiques. Et une défaite en défense se paie au tarif
 * majoré, effets négatifs multipliés par 1,4, mandat perdu. Défendre était
 * donc le mauvais côté du pari, ce qui est l'exact contraire de la vie
 * politique réelle, où l'on bat très rarement un sortant.
 *
 * L'avantage est fort là où l'on vote pour quelqu'un qu'on croise au
 * marché, faible là où l'on vote pour une étiquette qu'on ne connaît pas.
 */
const INCUMBENT_EDGE = {
  municipales: 14,
  legislatives: 9,
  europeennes: 4,
  congres: 6,
};

function electionScore(electionId, stake) {
  return electionBase(electionId, stake) + electionLuck();
}

/**
 * La part du score qui ne doit rien au hasard. C'est elle qui permet de dire
 * au joueur, pendant une campagne, si c'est serré ou plié, sans jamais lui
 * montrer un nombre : les jauges sont des abstractions, elles ne se récitent
 * pas.
 */
function electionBase(electionId, stake) {
  const vent = partyWind() * (PARTY_WEIGHT[electionId] || 0);
  // Le sortant, plus ce que les traits font gagner ou perdre ICI : un ancrage
  // local vaut sept points dans sa ville et rien du tout à Strasbourg.
  const dice = (stake && stake.defense ? INCUMBENT_EDGE[electionId] || 0 : 0) +
    traitElections(game, electionId);

  if (electionId === "municipales") {
    // UN SCRUTIN DE PERSONNES. On vote pour quelqu'un qu'on croise au marché,
    // et l'étiquette ne pèse presque rien : un maire sortant peut survivre à
    // l'effondrement national de son parti, et cela arrive tout le temps.
    return game.popularity * 0.75 + statScore(game, "reseau") * 2.4 +
      statScore(game, "energie") + vent + dice;
  }
  if (electionId === "europeennes") {
    // LE SCRUTIN LE PLUS NATIONAL DE TOUS. Personne ne connaît les candidats,
    // on vote pour une étiquette et pour sanctionner le gouvernement. La
    // personne du candidat ne fait presque rien, ce qui est bien le problème
    // des européennes.
    return game.popularity * 0.35 + statScore(game, "notoriete") * 0.8 +
      vent + dice;
  }
  if (electionId === "legislatives") {
    // Un scrutin national mais incarné : on est élu sous une couleur, dans une
    // circonscription où l'on a un nom. Un parti qui s'effondre emporte ses
    // députés avec lui, y compris les bons.
    // On envoie à l'Assemblée quelqu'un dont on peut dire qu'il y a sa place.
    return game.popularity * 0.6 + statScore(game, "eloquence") + statScore(game, "reseau") +
      statScore(game, "credibilite") * 0.7 + vent + dice;
  }
  // LE CONGRÈS. Il ne se joue pas devant le pays mais entre militants : la
  // popularité n'y entre pas, la cote au parti y fait tout. Un parti qui
  // s'effondre cherche toutefois un visage neuf, ce qui aide le candidat.
  // Un congrès choisit une tête d'affiche pour les cinq ans qui viennent :
  // la stature y pèse plus que partout ailleurs sauf à la présidentielle.
  return game.standing * 0.8 + statScore(game, "reseau") + statScore(game, "eloquence") * 0.5 +
    statScore(game, "credibilite") * 0.9 + vent + dice;
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

  // L'ÉTAT DE GRÂCE. Un président qu'on vient d'élire est populaire, et il
  // l'est d'autant plus qu'il est neuf : un sortant reconduit reprend là où
  // il s'était arrêté, avec seulement le sursaut du soir de victoire.
  game.approval = same ? clamp100(game.approval + 8) : 62;
  game.dissolution = null;
  // Un président neuf renégocie sa majorité : le bloc d'avant ne le suit pas
  // par héritage.
  game.coalition = null;
  // L'investiture ne vaut que pour une élection : la suivante se rejoue.
  game.nominee = null;
  shiftLandscape(who && (who.isPlayer ? game.party : who.party), +6);

  ensureGovernment();

  // Un ministre n'est ministre que tant que son camp gouverne. Le jour où le
  // camp perd, on rend les clés et la voiture, et on retourne au groupe.
  if ((game.position === "ministre" || game.position === "premier") &&
      rulingParty() !== game.party) {
    const quitteMatignon = game.position === "premier";
    // On ne retombe jamais : rendre un ministère ne rend pas le mandat qu'on
    // avait démissionné pour l'obtenir. Il reste ce que le parti veut bien
    // vous garder, comme après n'importe quelle défaite.
    setOffice(game, officeAfterDefeat(game));
    bumpStanding(game, -6);
    addLog(quitteMatignon
      ? {
          fr: "Le gouvernement démissionne. Vous quittez Matignon par la grande porte, ce qui est la seule façon d'en sortir, et vous n'avez plus rien.",
          en: "The government resigns. You leave the prime minister's residence by the front door, which is the only way out, and you have nothing left.",
        }
      : {
          fr: "Le gouvernement démissionne. Vous rendez votre ministère et il n'y a rien derrière : vous aviez démissionné de tout pour entrer là.",
          en: "The government resigns. You hand back your ministry and there is nothing behind it: you had resigned from everything to get in.",
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

/*
 * CE QU'UN CANDIDAT PEUT FAIRE DE SON PARTI.
 *
 * La fourchette allait de 0,65 à 1,6 : un très bon candidat multipliait sa
 * base par plus du double de ce qu'un mauvais en tirait, et le rapport de
 * force ne décidait donc plus rien. On voyait gagner des candidats de partis
 * à douze pour cent, ce qui n'arrive pas.
 *
 * Resserrée, elle laisse encore un excellent candidat sur-performer nettement
 * son étiquette — c'est le sujet du jeu — sans lui permettre d'effacer un
 * écart de dix points dans le pays.
 */
const PULL_MIN = 0.72;
const PULL_MAX = 1.34;

function clampPull(value) {
  return Math.max(PULL_MIN, Math.min(PULL_MAX, value));
}

/** Le multiplicateur du joueur : ses jauges, son profil et ses marques. */
function playerPull() {
  return clampPull(
    1 +
    (game.popularity - 50) / 55 +
    (game.standing - 50) / 320 +
    (statScore(game, "charisme") + statScore(game, "sangfroid") - 11.6) / 55 +
    (statScore(game, "credibilite") - 5.8) / 42 -
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
    (s.reseau + s.reputation - 10) / 60 +
    ((s.credibilite || 5) - 5) / 24 -
    PARTIES[figure.party].difficulty * 0.02 +
    (Math.random() - 0.5) * 0.3
  );
  return incumbent ? pull * 1.45 : pull;
}

/* ==========================================================================
   LA CHRONOLOGIE D'UNE CAMPAGNE
   ==========================================================================
   Une campagne se joue en quelques temps tirés au hasard, et le hasard ne
   sait pas lire un calendrier. On a donc vu le soir du premier tour tomber
   avant le porte-à-porte de la dernière semaine, ce qui suffit à démolir
   toute une campagne : le joueur cesse de croire ce qu'on lui raconte.

   Les scènes datées portent un "moment", compté en temps AVANT LA FIN de la
   campagne : 1 pour le dernier temps, 2 pour les deux derniers, 3 pour les
   trois derniers. Plus le chiffre est petit, plus la scène est tardive. Un
   couple [6, 4] donne un créneau fermé des deux côtés, pour ce qui n'a de
   sens qu'au début : les cinq cents signatures ne se ramassent pas la veille
   du vote. Les scènes sans "moment" se jouent n'importe quand, parce qu'un
   scandale ou une caisse vide n'ont pas de date.

   Deux règles suffisent alors. Une scène datée attend son créneau et ne le
   dépasse pas. Et elle n'apparaît jamais après une scène plus tardive déjà
   jouée : le calendrier ne revient pas en arrière.
   ========================================================================== */

/** Le créneau d'une scène, [au plus tôt, au plus tard], ou null si elle flotte. */
function momentWindow(ev) {
  if (ev.moment === undefined) return null;
  return Array.isArray(ev.moment) ? ev.moment : [ev.moment, 1];
}

/** Sa date, pour l'ordre. Plus le chiffre est petit, plus la scène est tardive. */
function momentOf(ev) {
  const creneau = momentWindow(ev);
  return creneau ? creneau[0] : null;
}

/**
 * Cette scène est-elle à sa place ? "state" est la campagne en cours, celle
 * du joueur, celle qu'il soutient ou une élection ordinaire ; elle retient
 * dans "moment" la scène la plus tardive déjà jouée.
 */
function momentFits(ev, state, steps) {
  const creneau = momentWindow(ev);
  if (!creneau) return true;

  const reste = steps - state.step;
  // Trop tôt : il reste plus de temps de campagne que la scène n'en admet.
  if (reste > creneau[0]) return false;
  // Trop tard : son créneau est passé.
  if (reste < creneau[1]) return false;
  // Le calendrier ne revient pas en arrière.
  return state.moment == null || creneau[0] <= state.moment;
}

/** Retient la date de la scène jouée, pour que la suivante s'y tienne. */
function rememberMoment(ev, state) {
  const moment = momentOf(ev);
  if (moment !== null && (state.moment == null || moment < state.moment)) {
    state.moment = moment;
  }
}

/* ==========================================================================
   LA PRÉSIDENTIELLE DES AUTRES
   ==========================================================================
   Quand le joueur n'est pas candidat, la plus grande élection du jeu se
   réglait en une phrase et un vainqueur tiré au sort. Cinq ans basculaient
   sans qu'il ait rien à en dire.

   Elle se joue maintenant en trois temps, avec des scènes qui dépendent de
   ce qu'on est : un militant colle des affiches, un ministre défend un
   bilan, un chef de parti négocie un désistement, et celui qui est plus
   populaire que son propre candidat doit décider s'il le porte ou s'il
   s'installe pour la fois d'après.

   Ce qu'on y gagne ou qu'on y perd s'accumule dans "bonus", qui pèse ensuite
   sur le tirage du vainqueur. Un peu, jamais assez pour renverser le pays :
   on ne fait pas élire un candidat en collant des affiches, on l'aide.
   ========================================================================== */

const SUPPORT_STEPS = 3;

/** Ce qu'un point de soutien vaut en points d'intentions de vote. */
const SUPPORT_WEIGHT = 0.5;

function startSupport(nominee) {
  game.support = { step: 0, bonus: 0, used: [], moment: null, nominee: nominee || null };
  return { kind: "support", id: drawSupport().id, resolved: false };
}

function drawSupport() {
  const used = game.support.used;
  const situation = SUPPORT_EVENTS.filter((ev) => eventMatches({ ...ev, id: null }, game));
  const datees = situation.filter((ev) => momentFits(ev, game.support, SUPPORT_STEPS));
  const eligible = datees.filter((ev) => !used.includes(ev.id));

  // Le repli ignore ce qui a déjà été joué dans CETTE campagne plutôt que
  // d'ouvrir des scènes qui ne correspondent pas à la situation. Le dernier
  // recours ouvre les scènes sans date : revoir un décor coûte moins cher
  // que raconter le premier tour après le second.
  const pool = eligible.length
    ? eligible
    : (datees.length ? datees : situation.filter((ev) => momentOf(ev) === null));

  const ev = pool.length ? pool[randInt(pool.length)] : SUPPORT_EVENTS[0];
  used.push(ev.id);
  rememberMoment(ev, game.support);
  setScene(ev);
  return ev;
}

/**
 * Le dépouillement. Le camp du joueur part avec ce que vaut son parti, plus
 * ce que la campagne du joueur y a ajouté ou retiré.
 */
function resolveSupport() {
  const bonus = game.support.bonus * SUPPORT_WEIGHT;
  const limited = incumbentTermLimited();

  const ruling = rulingParty();
  const poids = Object.keys(PARTIES).map((key) => ({
    key,
    weight: Math.max(0.5, game.landscape[key] +
      (key === game.party ? bonus : 0) +
      (!limited && key === ruling ? 30 : 0)),
  }));

  const total = poids.reduce((sum, w) => sum + w.weight, 0);
  let tirage = Math.random() * total;
  let gagnant = poids[poids.length - 1].key;
  for (const w of poids) { tirage -= w.weight; if (tirage <= 0) { gagnant = w.key; break; } }

  ensureLeaders();
  const figure = figureOf(gagnant);
  if (figure) setPresident({ name: figure.name, party: gagnant });

  const mien = gagnant === game.party;
  game.support = null;

  if (mien) {
    bumpStanding(game, 10);
    bumpPop(game, 4);
    return {
      fr: (figure ? figure.name : "") + " est élu{e} président{e} de la République. Votre camp gouverne, et vous avez fait campagne pour lui.",
      en: (figure ? figure.name : "") + " is elected president. Your side is in power, and you campaigned for it.",
    };
  }
  bumpStanding(game, -4);
  return {
    fr: (figure ? figure.name : "") + " ({party:" + gagnant + "}) remporte l'élection présidentielle. Votre camp repart pour cinq ans d'opposition.",
    en: (figure ? figure.name : "") + " ({party:" + gagnant + "}) wins the presidential election. Your side faces five more years in opposition.",
  };
}

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

/**
 * Ce qu'un candidat malheureux traîne à la primaire suivante. On ne redevient
 * pas le champion naturel de son camp cinq ans après l'avoir mené à la
 * défaite : les mêmes qui vous ont porté rappellent qu'ils avaient prévenu.
 */
const PRIMARY_BEATEN = 14;

/**
 * COMBIEN DE FOIS UN PARTI VOUS PRÉSENTE.
 *
 * Deux, et c'est déjà généreux. Sans cette limite, une carrière bien menée
 * restait au-dessus du seuil pendant trente ans et se présentait à chaque
 * échéance : trois à quatre finales par partie, dont on finit forcément par
 * en gagner une. L'Élysée devenait une question de patience.
 *
 * Deux candidatures, c'est le maximum qu'on voit dans une vraie carrière, et
 * la seconde se dispute avec l'étiquette de celui qui a déjà perdu.
 */
const PRIMARY_MAX_RUNS = 2;

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
    POSITION_RANK[game.position] || 0
  ) - (game.beatenNominee ? PRIMARY_BEATEN : 0);
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
  if ((game.presidentialRuns || 0) >= PRIMARY_MAX_RUNS) return false;
  if (turnsToPresidential() !== PRIMARY_LEAD) return false;

  // Un président de votre camp qui peut se représenter EST le candidat :
  // aucun parti n'organise une primaire contre son propre président.
  if (rulingParty() === game.party && !incumbentTermLimited() &&
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
  // C'est le seul endroit par lequel une candidature présidentielle du joueur
  // passe réellement : le compteur va donc ici, et pas dans la primaire. Il y
  // était, et la limite ne servait à rien pour un chef de parti, qui est
  // candidat de droit à chaque échéance.
  game.presidentialRuns = (game.presidentialRuns || 0) + 1;

  game.campaign = { step: 0, field: presidentialField(), lastId: null, used: [], moment: null, phase: "campaign" };
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

/* ==========================================================================
   L'ENTRE-DEUX-TOURS
   ==========================================================================
   Le joueur qualifié passait du dimanche soir au verdict sans qu'on lui
   demande rien : quinze jours, le moment le plus regardé de la vie politique
   française, et pas une décision à prendre.

   Les reports sont désormais calculés le soir même du premier tour. Le
   joueur voit d'entrée ce que le pays lui a laissé, souvent quarante-sept
   pour cent et deux semaines pour trouver le reste, et il joue trois temps
   pour aller le chercher. Le dernier est toujours le grand débat.
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
function concedeElection(winner, share) {
  setPresident({ name: winner.name, party: winner.party });
  bump(game, "notoriete", +1);
  bumpPop(game, +6);
  shiftLandscape(game.party, -4);

  // Le second tour compte double : y être allé installe, y avoir frôlé la
  // victoire installe pour longtemps.
  // Avoir mené son camp à la défaite se paie à la primaire suivante.
  game.beatenNominee = true;

  const finaliste = share !== undefined;
  if (finaliste) {
    const marge = 50 - share;
    if (marge <= 2) { bumpStanding(game, 10); bump(game, "credibilite", 2); }
    else if (marge <= 8) { bumpStanding(game, 4); bump(game, "credibilite", 1); }
    else bumpStanding(game, -6);
  } else {
    bumpStanding(game, -14);
  }

  const etaitChef = game.position === "chef";
  if (!etaitChef || game.standing >= NOMINATION_THRESHOLD.chef) return false;

  setOffice(game, officeAfterDefeat(game));
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
/**
 * LE GOUVERNEMENT.
 *
 * Le jeu parlait de ministres partout — les événements, les fins, l'échelle
 * de carrière — mais aucune ligne de code n'en nommait jamais un. Le camp au
 * pouvoir gouvernait avec des députés et un chef de parti, et le joueur ne
 * croisait un ministre que dans le miroir.
 *
 * Le camp qui gouverne a donc un Premier ministre et deux ou trois ministres,
 * pris chez ses élus les plus en vue. Quand il perd le pouvoir, ils rendent
 * les clés : on ne retombe pas sur un mandat qu'on n'a pas gagné, ils
 * redeviennent des cadres de leur parti.
 */
const GOVERNMENT_SIZE = 3;

function ensureGovernment() {
  const ruling = rulingParty();

  game.rivals.forEach((r) => {
    if (r.party !== ruling && (r.position === "ministre" || r.position === "premier")) {
      r.position = "cadre";
    }
  });

  if (!ruling) return;

  // LE JOUEUR OCCUPE MATIGNON : PERSONNE D'AUTRE NE L'OCCUPE. On exigeait
  // ici que son camp gouverne, alors qu'un gouvernement d'ouverture met
  // précisément à Matignon quelqu'un qui n'est pas du parti du président.
  // Le moteur nommait donc un second Premier ministre à côté du joueur, et
  // le pays en avait deux.
  const playerIsPM = game.position === "premier";
  const inGov = game.rivals.filter((r) => r.party === ruling &&
    (r.position === "ministre" || r.position === "premier"));

  const pms = inGov.filter((r) => r.position === "premier");
  if (playerIsPM) {
    pms.forEach((r) => { r.position = "ministre"; });
  } else if (pms.length > 1) {
    pms.sort((a, b) => b.popularity - a.popularity).slice(1)
      .forEach((r) => { r.position = "ministre"; });
  } else if (!pms.length) {
    // On nomme le plus en vue qui ne dirige pas déjà le parti : diriger le
    // parti et le gouvernement à la fois, cela existe, mais c'est rare et
    // cela ferait disparaître un nom du paysage.
    const pool = game.rivals
      .filter((r) => r.party === ruling && r.position !== "chef")
      .sort((a, b) => b.popularity - a.popularity);
    if (pool.length) {
      pool[0].position = "premier";
      addLog({
        fr: fillGender(pool[0].name + " est nommé{e} à Matignon.", pool[0]),
        en: pool[0].name + " is appointed prime minister.",
      });
    }
  }

  const ministres = game.rivals.filter((r) => r.party === ruling && r.position === "ministre");
  const manque = GOVERNMENT_SIZE - ministres.length;
  if (manque > 0) {
    game.rivals
      // On pioche large : un gouvernement se compose d'élus, mais aussi de
      // gens qu'on va chercher ailleurs et qu'on présente comme la société
      // civile. Sans cela, un parti aux figures jeunes gouvernait à un
      // ministre.
      .filter((r) => r.party === ruling && r.position !== "chef" && r.position !== "premier")
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, manque)
      .forEach((r) => { r.position = "ministre"; });
  }
}

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

    // L'échelle passe désormais par Strasbourg, comme celle du joueur : un
    // conseiller qui monte va au Parlement européen une fois sur trois, et
    // l'on en revient député.
    if (r.position === "militant" && r.progress >= 3) { r.position = "conseiller"; r.progress = 0; }
    else if (r.position === "conseiller" && r.progress >= 4) {
      r.position = Math.random() < 0.33 ? "euro" : "maire";
      r.progress = 0;
    }
    else if (r.position === "euro" && r.progress >= 5) { r.position = "depute"; r.progress = 0; }
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
        // Perdre la direction ne donne pas un siège : la règle vaut pour les
        // figures comme pour le joueur, et le rapport de force les affiche.
        r.position = "cadre";
        addLog({
          fr: r.name + " cède la direction du parti et reste à l'appareil, sans mandat.",
          en: r.name + " gives up the party leadership and stays at headquarters, with no seat.",
        });
      });
      return;
    }

    if (chefs.length === 1) return;

    if (chefs.length > 1) {
      // Deux chefs, cela n'existe pas : le plus populaire garde la maison.
      chefs.sort((a, b) => b.popularity - a.popularity).slice(1)
        .forEach((r) => { r.position = "cadre"; });
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

  const camp = game.rivals.filter((r) => r.party === game.party);

  let figure = null;
  if (cast === "leader") figure = pickByWeight(others.filter((r) => r.position === "chef"));
  else if (cast === "opponent") figure = pickByWeight(others);
  else if (cast === "camp") figure = pickByWeight(camp);
  // Quelqu'un de son camp qui pèse assez pour disputer une investiture. Sans
  // ce filtre, une militante de vingt-neuf ans « prenait » la direction du
  // parti dans le texte, et restait militante dans le rapport de force.
  else if (cast === "camp_senior") {
    const notables = camp.filter((r) => !["militant", "cadre"].includes(r.position));
    figure = pickByWeight(notables.length ? notables : camp);
  }
  // Il a existé ici un casting "senior", qui prenait quelqu'un qui pèse,
  // d'où qu'il vienne. Une seule scène s'en servait, la guerre interne, et
  // elle se jouait donc contre un député d'en face cinq fois sur six. Le
  // casting est parti avec le bug : une rivalité de parti se caste dans le
  // parti, et il n'existe aucune scène qui veuille « n'importe qui, mais
  // gradé ».

  if (!figure) figure = pickByWeight(others) || anyRival(game);
  // LE SEXE SUIT LA FIGURE. Il était laissé de côté ici, et tous les textes
  // parlaient donc au masculin de tout le monde : les marques d'accord
  // n'avaient aucune information sur laquelle s'appuyer.
  return figure
    ? { name: figure.name, party: figure.party, position: figure.position, sex: figure.sex }
    : null;
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
  // On n'emporte pas la direction en changeant de camp, et on n'arrive pas
  // avec un siège qu'on n'a pas gagné là-bas.
  if (figure.position === "chef") figure.position = "cadre";

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
  partyHistory(s);
  s.alliance = null;

  // La direction ne suit jamais : on arrive avec un bureau et un titre
  // d'appareil, pas avec le parti qu'on vient de quitter.
  if (s.position === "chef") s.position = "cadre";

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

/**
 * LE PARTI VOUS DONNE UN BUREAU.
 *
 * Entre le militant qui colle des affiches et l'élu qui a des électeurs, il y
 * a tous ceux qui font tourner la machine sans jamais passer devant un
 * bulletin. On y entre par la cote au parti, jamais par les urnes, et on en
 * sort quand l'appareil se désintéresse de vous.
 *
 * Cette marche sert deux fois : elle donne un début de carrière à qui
 * travaille l'appareil avant d'affronter le pays, et elle recueille les
 * battus, qui autrement se réveillaient maires d'une ville qu'ils avaient
 * quittée pour se présenter ailleurs.
 */
const CADRE_IN = 35;
const CADRE_OUT = 18;

function promoteWithinParty() {
  if (game.position === "militant" && game.standing >= CADRE_IN) {
    setOffice(game, "cadre");
    addLog({
      fr: "La fédération vous confie un poste. Ce n'est pas un mandat, personne ne vous a élu, et vous avez désormais une clé du siège.",
      en: "The federation hands you a job. It is not a seat, nobody elected you, and you now have a key to party headquarters.",
    });
    return;
  }
  if (game.position === "cadre" && game.standing < CADRE_OUT) {
    setOffice(game, "militant");
    addLog({
      fr: "On ne vous convoque plus aux réunions et votre nom a disparu de l'organigramme. Personne ne vous a rien dit : c'est ainsi qu'on le dit.",
      en: "You stop being called to meetings and your name is off the chart. Nobody told you anything: that is how it gets told.",
    });
  }
}

/* ==========================================================================
   Tour de jeu
   ========================================================================== */

function advanceTurn() {
  // LE SOIR DES LÉGISLATIVES. On recompose l'Assemblée en quittant le tour
  // où elles se tenaient, et pas à l'intérieur du dépouillement : il y a
  // cinq chemins pour traverser une législative — on s'y présente, on la
  // regarde, l'investiture est refusée, on fait dissidence, on part — et
  // c'est le seul point par lequel ils passent tous.
  const sortante = electionAtTurn(game.turn);
  if (sortante && sortante.id === "legislatives") {
    computeAssembly();
    game.dissolution = null;
  }

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
  credibilityDrift(game);
  driftGauges();
  promoteWithinParty();
  evolveRivals();

  // On garde le tableau du tour précédent : c'est lui qui permet d'afficher
  // qui monte et qui descend, la seule information qui rende un paysage
  // lisible d'un coup d'œil.
  game.landscapeBefore = { ...game.landscape };
  driftLandscape();
  driftApproval();
  maybeCensure();
  ensureGovernment();
  maybeDefection();
  applyTraitTurn(game);

  // La mort peut frapper à partir de 60 ans.
  if (Math.random() < deathProbability(game)) {
    game.ended = { type: "death" };
    game.card = { kind: "end" };
    return;
  }

  // Avant la mort, il y a tout ce qui pousse dehors : la santé, la mémoire,
  // un entourage qui décide à votre place. On prévient le joueur, une fois,
  // pour qu'il puisse jouer contre la montre plutôt que la subir.
  warnAboutAge();
  if (Math.random() < withdrawalProbability(game)) {
    game.ended = { type: "withdrawal" };
    game.card = { kind: "end" };
    return;
  }

  // La primaire tombe quelques mois avant la présidentielle, à un moment où
  // aucune autre échéance n'occupe le calendrier.
  if (primaryDue()) {
    game.card = { kind: "primaire", resolved: false };
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
    // L'appareil ferme la porte : on ne propose plus un bouton unique, on
    // joue une scène, et il y a plusieurs façons de forcer la serrure.
    const stake = playerStake(election.id);

    // Trop loin du compte pour avoir jamais été candidat : le scrutin se joue
    // sans vous et on vous le raconte de l'extérieur, au lieu de vous
    // annoncer le refus d'une investiture que vous n'aviez pas demandée.
    // La présidentielle qu'on ne dispute pas se joue quand même : trois
    // temps où l'on porte son camp, ou pas.
    if (election.id === "presidentielle" && !stake) {
      game.card = startSupport(game.nominee);
      return;
    }

    if (!stake || (nominationBlocked(stake) && !inTheRunning(stake))) {
      game.card = startAside(election.id);
      return;
    }

    const refus = stake && nominationBlocked(stake) ? drawNomination() : null;
    // Une investiture refusée à un sortant lui coûte son mandat : on ne
    // figure pas sur un bulletin sans investiture. La carte s'en souvient
    // pour ne le dire qu'une fois la scène jouée.
    if (refus) game.card = {
      kind: "nomination", id: refus.id, resolved: false,
      // Le scrutin et le siège qu'on vous refuse. Sans eux, la carte parlait
      // d'une investiture sans jamais dire laquelle, et le joueur ne pouvait
      // pas savoir s'il venait de perdre une mairie ou la tête du parti.
      election: election.id,
      target: stake.target,
      defends: stake.defense ? stake.target : null,
    };
    else game.card = { kind: "election", id: election.id, resolved: false };
  } else {
    game.card = { kind: "event", id: drawEvent().id, resolved: false };
  }
}

/**
 * Les deux avertissements de la fin de carrière. Chacun ne tombe qu'une fois :
 * ce sont des seuils franchis, pas un bulletin de santé hebdomadaire.
 *
 * Sans eux, le retrait forcé serait un tirage invisible qui coupe la partie
 * sans prévenir. Avec eux, le joueur sait que le temps joue contre lui, et
 * peut décider de forcer maintenant plutôt que d'attendre le mandat suivant.
 */
function warnAboutAge() {
  if (game.age >= 62 && !game.flags.ageWarned) {
    game.flags.ageWarned = true;
    addLog({
      fr: "Un éditorialiste écrit que votre génération a fait son temps. La question de l'âge est posée, et elle ne se refermera plus.",
      en: "A columnist writes that your generation has had its turn. The age question is open now, and it will not close again.",
    });
  }
  if (game.age >= 60 && game.stats.energie <= 3 && !game.flags.exhaustionWarned) {
    game.flags.exhaustionWarned = true;
    addLog({
      fr: "Votre entourage allège l'agenda sans vous demander votre avis. Personne ne dit le mot, tout le monde l'a en tête.",
      en: "Your staff quietly thins out the diary without asking you. Nobody says the word; everyone is thinking it.",
    });
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

/**
 * Une scène laisse-t-elle une trace définitive ? Les paquets d'investiture et
 * de campagne se rejouent forcément, parce qu'une carrière est bloquée
 * plusieurs fois et compte des dizaines d'élections. Une scène qui donne un
 * trait, un écart ou une suite ne doit donc jamais revenir : sinon la marque
 * finit par tomber mécaniquement, et un trait présent dans neuf parties sur
 * dix n'est plus un trait.
 */
function laisseUneTrace(ev) {
  let trace = false;
  const voir = (o) => {
    if (!o || typeof o !== "object") return;
    if (o.trait || o.strike || o.untrait || o.chain) trace = true;
    Object.values(o).forEach(voir);
  };
  ev.choices.forEach(voir);
  return trace;
}

/** Le repli quand tout a été vu : seulement ce qui peut se revivre. */
function sansTrace(list) {
  return list.filter((ev) => !laisseUneTrace(ev));
}

/**
 * Une scène d'investiture refusée. Le paquet est petit, donc on accepte de
 * revoir une scène déjà jouée si tout a été vu : une carrière bloquée l'est
 * souvent plusieurs fois, et toujours par les mêmes gens.
 */
function drawNomination() {
  const eligible = NOMINATION_EVENTS.filter((ev) => eventMatches({ ...ev, id: null }, game));
  if (!eligible.length) return null;

  const fresh = eligible.filter((ev) => !game.seen[ev.id]);
  const repli = sansTrace(eligible);
  const secours = sansTrace(NOMINATION_EVENTS);

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

/** Un temps mort, en évitant celui du tour précédent. */
function quietEvent() {
  const quiet = EVENTS.filter((ev) => ev.repeatable && eventMatches(ev, game));
  const fresh = quiet.filter((ev) => ev.id !== game.lastEventId);
  const pool = fresh.length ? fresh : quiet;
  return pool.length ? pool[randInt(pool.length)] : EVENTS[0];
}

/**
 * Prépare la carte d'un scrutin qui se joue sans vous. Le résultat du vote
 * tombe tout de suite — le pays vote, le paysage bouge, un président sort
 * peut-être des urnes — et la scène raconte ce que vous, vous en faites.
 */
function startAside(electionId) {
  const resultat = backgroundElectionText(electionId);
  addLog(resultat);
  const ev = drawAside();
  return {
    kind: "aside", id: ev.id, election: electionId,
    intro: fillMarks(L(resultat)), resolved: false,
  };
}

function drawAside() {
  const eligible = ASIDE_EVENTS.filter((ev) => eventMatches({ ...ev, id: null }, game));
  let pool = eligible.length ? eligible : ASIDE_EVENTS;
  const autres = pool.filter((ev) => ev.id !== game.lastAsideId);
  if (autres.length) pool = autres;

  const ev = pool[randInt(pool.length)];
  game.lastAsideId = ev.id;
  setScene(ev);
  return ev;
}

function eventById(id) {
  return SUPPORT_EVENTS.find((e) => e.id === id) ||
    ASIDE_EVENTS.find((e) => e.id === id) ||
    EVENTS.find((e) => e.id === id) ||
    NOMINATION_EVENTS.find((e) => e.id === id) ||
    EVENTS[0];
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
/**
 * La forme minuscule est obtenue en abaissant tout le mot, ce qui convient
 * partout sauf quand le libellé contient un nom propre : « Member of the
 * European Parliament » devenait « member of the european parliament ». Un
 * libellé peut donc fournir sa propre minuscule, sous la clé suffixée _low.
 */
function fillMarks(text) {
  return String(text).replace(/\{(party|party_the|party_of|pos|elec)(_low)?:([a-z_]+)\}/g,
    (mark, form, low, key) => {
      const cle = form + "_" + key;
      if (!low) return t(cle);
      const propre = t(cle + "_low");
      return propre === cle + "_low" ? t(cle).toLowerCase() : propre;
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

    // Chemin de secours : le joueur peut y avoir été finaliste, et un second
    // tour compte quel que soit le chemin qui y mène.
    const moi = result.finalists.find((f) => f.isPlayer);

    return {
      won: false,
      beatenBy: result.winner.name,
      lostLeadership: concedeElection(result.winner, moi ? Math.round(moi.share) : undefined),
    };
  }

  // Une défense perdue ne renvoie nulle part : le mandat est perdu et rien ne
  // le remplace. Le reste — ce que la soirée coûte ou rapporte — dépend de la
  // marge, et applyOutcome s'en charge pour les deux chemins.
  const res = applyOutcome(stake, electionScore(electionId, stake) - stake.threshold);
  return { won: res.won, outcome: res };
}

/**
 * NE PAS Y ALLER.
 *
 * Un mandat ne se garde pas en restant chez soi. Le joueur qui décline le
 * scrutin, ou qui préfère travailler l'appareil parce qu'on lui refuse
 * l'investiture, ne figure sur aucun bulletin : son mandat s'arrête à la fin
 * de la mandature, comme celui de n'importe qui.
 *
 * Le prix est plus doux qu'une défaite. On n'a pas été battu, on s'est retiré,
 * et le pays oublie plus vite qu'il ne pardonne.
 */
function standDown(stake) {
  if (!stake || !stake.defense) return null;

  const partant = game.position;
  setOffice(game, officeAfterDefeat(game));
  bumpPop(game, -6);
  bumpStanding(game, -8);

  const texte = {
    fr: "Vous ne figurez sur aucun bulletin. Votre mandat de {pos_low:" + partant + "} s'achève sans avoir été remis en jeu, et votre successeur s'installe dans votre bureau sans vous citer une fois.",
    en: "Your name is on no ballot. Your term as {pos_low:" + partant + "} simply runs out, and your successor moves into your office without mentioning you once.",
  };
  addLog(texte);
  return texte;
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
/**
 * À QUELLE DISTANCE ON EST ENCORE UN CANDIDAT.
 *
 * Le refus d'investiture tombait sur tout le monde, tout le temps : une
 * militante de trente et un ans se voyait annoncer, au deuxième congrès de
 * sa carrière, qu'elle n'aurait pas la direction du parti — qu'elle n'avait
 * jamais demandée. On ne refuse une investiture qu'à quelqu'un qui était dans
 * la course. Au-delà de cet écart, le scrutin se joue sans vous, comme
 * n'importe quelle élection qui ne vous concerne pas.
 */
const NOMINATION_REACH = 18;

function inTheRunning(stake) {
  // Un sortant est toujours dans la course pour son propre siège, si bas
  // soit-il : c'est le sien, et ne pas se représenter le lui coûte.
  if (stake.defense) return true;

  const need = NOMINATION_THRESHOLD[stake.target];
  if (need === undefined) return true;
  return game.standing >= need - NOMINATION_REACH;
}

function nominationBlocked(stake) {
  let need = NOMINATION_THRESHOLD[stake.target];
  if (need === undefined) return false;
  if (stake.defense && MANDATES.includes(stake.target)) need -= INCUMBENT_DISCOUNT;
  return game.standing < need;
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
   La campagne d'une élection ordinaire
   ==========================================================================
   Une législative ne se joue pas en un clic. Depuis que la présidentielle a
   ses six temps, tout le reste paraissait expédié : on cliquait, on avait le
   résultat, et rien ne s'était passé entre les deux.

   Une élection ordinaire dure donc deux ou trois temps. Chacun est une carte
   avec ses choix, qui déplace un avantage cumulé, et le dépouillement vient
   après. Le joueur sait où il en est parce qu'on le lui raconte, jamais parce
   qu'on lui montre un chiffre.
   ========================================================================== */

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

/**
 * LE SONDAGE D'AVANT LA DÉCISION.
 *
 * Le joueur choisissait de se présenter sans rien savoir : le sondage
 * n'apparaissait qu'une fois la campagne engagée, c'est-à-dire une fois qu'il
 * était trop tard pour renoncer. On calcule donc la même chose à partir du
 * seul enjeu, avec un avantage de campagne nul, et on la montre sur la carte
 * du scrutin.
 *
 * Ce n'est pas une promesse : le dé du dépouillement n'est pas tiré. C'est un
 * sondage, avec ce que ça vaut.
 */
function pollFor(electionId, stake, bonus) {
  if (electionId === "congres") return null;

  const marge = electionBase(electionId, stake) + (bonus || 0) + LUCK_MEAN - stake.threshold;
  const moi = Math.max(5, Math.min(58, 31 + marge * 0.85));

  // Les concurrents sérieux : les partis les mieux placés, sans le vôtre.
  const rivaux = sortedLandscape().filter((key) => key !== game.party).slice(0, 3);
  const poids = rivaux.reduce((sum, key) => sum + game.landscape[key], 0) || 1;

  // UNE LISTE, PAS UN CANDIDAT. Sur un scrutin où l'on n'est pas tête de
  // liste, c'est le parti qui figure sur le bulletin : afficher son propre
  // nom laissait croire qu'on briguait la mairie alors qu'on aidait
  // quelqu'un d'autre à l'avoir.
  const teteDeListe = stake.target !== "conseiller";

  const liste = [{
    name: teteDeListe ? (game.character.name || null) : null,
    nameKey: teteDeListe
      ? (game.character.name ? null : "sheet_name_empty")
      : "party_" + game.party,
    // Sans le parti, toutes les barres prenaient la teinte du joueur et les
    // quatre lignes du sondage étaient de la même couleur.
    party: game.party,
    share: moi, isPlayer: true,
  }];
  rivaux.forEach((key) => {
    liste.push({ nameKey: "party_" + key, party: key,
                 share: (100 - moi) * (game.landscape[key] / poids) });
  });
  return liste.sort((a, b) => b.share - a.share);
}

/**
 * Où en est la campagne, en mots. Quatre degrés seulement : au-delà, on
 * donnerait au joueur une précision que personne n'a jamais dans une
 * campagne.
 */
function moodFor(electionId, stake, bonus) {
  const marge = electionBase(electionId, stake) + (bonus || 0) + LUCK_MEAN - stake.threshold;
  if (marge >= 10) return "race_mood_won";
  if (marge >= 2) return "race_mood_ahead";
  if (marge >= -6) return "race_mood_close";
  return "race_mood_lost";
}

function raceMood() {
  return moodFor(game.race.id, game.race.stake, game.race.bonus);
}

/* ==========================================================================
   CE QUE VAUT UN RÉSULTAT
   ==========================================================================
   Une élection ne se lit pas en gagné / perdu. Un député battu de trois cents
   voix dans une circonscription que son camp n'avait jamais gagnée sort
   grandi du scrutin ; le même, écrasé à douze pour cent, sort fini. Le moteur
   appliquait la même sanction aux deux, et la même à tous les perdants :
   moins cinq de popularité, moins huit de cote, quelle que soit la soirée.

   Tout se joue donc sur LA MARGE — l'écart entre ce qu'on a fait et ce qu'il
   fallait faire. Elle décide du texte, des jauges et de ce que le pays
   retient. Une défaite honorable installe un challenger ; une déroute
   n'installe personne.

   Défendre son propre siège reste plus cher : on n'y gagne rien à faire un
   beau score, on y perd un mandat.
   ========================================================================== */

/*
 * LA CRÉDIBILITÉ N'EST PAS ICI. Un beau score perdant fait parler de vous et
 * vous rend sympathique ; il ne fait pas de vous quelqu'un qu'on imagine dans
 * le fauteuil. La stature vient de la fonction qu'on tient et de ce qu'on y
 * fait — voir CREDIBILITY_BY_OFFICE — jamais d'une soirée électorale.
 */
const ELECTION_OUTCOMES = [
  // marge minimale, clé de texte, effets
  { min: 12,   key: "large",     effects: { notoriete: 2, popularity: 7, standing: 9 } },
  { min: 0,    key: "win",       effects: { notoriete: 1, popularity: 5, standing: 7 } },
  // Perdu sur le fil : on devient le prochain, et tout le monde le sait.
  { min: -3,   key: "narrow",    effects: { notoriete: 1, popularity: 4, standing: 2 } },
  // Battu, mais avec un score que personne n'attendait.
  { min: -8,   key: "honorable", effects: { notoriete: 1, popularity: 1, standing: -2 } },
  { min: -18,  key: "loss",      effects: { popularity: -4, standing: -6 } },
  { min: -1e9, key: "rout",      effects: { reputation: -1, popularity: -10, standing: -12 } },
];

function outcomeFor(marge) {
  return ELECTION_OUTCOMES.find((o) => marge >= o.min);
}

/* ==========================================================================
   OÙ L'ON SE PRÉSENTE
   ==========================================================================
   L'appareil place ses candidats, et c'est lui qui décide qui va dans la
   ville imprenable et qui va dans le siège qu'on gagne les yeux fermés. Le
   joueur subissait ce placement sans jamais le voir : le même seuil pour
   tout le monde, la même soirée électorale.

   Il peut désormais peser dessus, MAIS SEULEMENT S'IL PÈSE. En dessous du
   seuil de cote, on prend ce qu'on vous donne et la question ne se pose même
   pas ; au-dessus, on décroche son téléphone et l'on choisit son terrain.
   C'est la seule chose que la cote au parti achète qui ne soit pas une
   investiture, et c'est bien ce qu'elle achète dans la vraie vie.

   TROIS TERRAINS, TROIS PARIS.

   Le bastion se gagne presque à coup sûr et ne prouve rien : on hérite d'un
   siège, on n'en gagne pas un, et les gains sont réduits en conséquence.

   Le siège ordinaire ne change rien : c'est le jeu tel qu'il était.

   La circonscription imprenable est le pari du jeu. On la perd huit fois sur
   dix, mais on ne perd QUE l'élection : l'appareil ne fait pas payer une
   défaite là où il n'attendait rien, et personne ne vous reprochera d'avoir
   échoué où les autres refusaient d'aller. Et si elle tombe, elle rapporte
   presque le double, parce qu'on ne gagne pas ce siège-là sans que le pays
   entier l'apprenne.
   ========================================================================== */

/** La cote au parti à partir de laquelle on choisit son terrain. */
const SEAT_CHOICE_STANDING = 55;

const SEAT_KINDS = {
  bastion:    { threshold: -9,  gain: 0.5, perte: 1 },
  ordinaire:  { threshold: 0,   gain: 1,   perte: 1 },
  imprenable: { threshold: 11,  gain: 1.8, perte: 0 },
};

/**
 * Le choix n'est proposé que pour une conquête, sur un scrutin où l'on est
 * réellement placé quelque part. On ne choisit pas où défendre son propre
 * siège, et un congrès de parti n'a pas de circonscription.
 */
const SEAT_ELECTIONS = ["municipales", "legislatives", "europeennes"];

function seatChoiceAvailable(electionId, stake) {
  return Boolean(stake) && !stake.defense &&
    SEAT_ELECTIONS.includes(electionId) &&
    game.standing >= SEAT_CHOICE_STANDING;
}

/**
 * Applique le résultat et renvoie de quoi le raconter. Le mandat perdu, lui,
 * est traité par l'appelant : c'est la seule chose qui diffère entre une
 * candidature et une défense.
 */
function applyOutcome(stake, marge) {
  const out = outcomeFor(marge);
  const won = marge >= 0;

  // Une défense perdue coûte plus cher à jauges égales : on ne perd pas un
  // siège comme on perd une tentative. Le beau score n'y rapporte rien, il
  // amortit seulement la chute.
  const dur = !won && stake.defense;

  // Le terrain choisi module ce que la soirée rapporte ou coûte. Il ne
  // touche jamais à la fonction obtenue : on est député de la même façon
  // qu'on ait gagné un bastion ou une ville imprenable.
  const terrain = SEAT_KINDS[stake.seat] || SEAT_KINDS.ordinaire;
  // LE FACTEUR SUIT LE RÉSULTAT, PAS LE SIGNE DE L'EFFET. En l'appliquant
  // au signe, une défaite honorable dans une imprenable voyait ses maigres
  // gains multipliés par 1,8 pendant que ses pertes étaient annulées :
  // perdre y rapportait plus que de ne pas se présenter. « Pas de perte »
  // veut dire zéro, pas prime.
  const facteur = won ? terrain.gain : terrain.perte;

  Object.entries(out.effects).forEach(([key, value]) => {
    const module = value * facteur;
    const v = dur ? (value > 0 ? 0 : Math.round(value * 1.4) - 4) : Math.round(module);
    if (!v) return;
    if (key === "popularity") bumpPop(game, v);
    else if (key === "standing") bumpStanding(game, v);
    else bump(game, key, v);
  });

  if (!won && stake.defense) setOffice(game, officeAfterDefeat(game));
  else if (won) setOffice(game, stake.target);

  return { won, key: out.key, defense: Boolean(stake.defense) };
}

/**
 * Ce que dit la soirée électorale. Le mandat éventuellement perdu est nommé
 * par l'appelant : ici on ne raconte que le score.
 */
function outcomeText(res) {
  const poste = "{pos_low:" + game.position + "}";

  if (res.key === "large") return {
    fr: "Large victoire. Vous voici " + poste + ", et le score est assez net pour qu'on vous cite ailleurs que chez vous.",
    en: "A wide win. You are now " + poste + ", and the margin is large enough that people mention you beyond your own patch.",
  };
  if (res.key === "win") return {
    fr: "Victoire. Vous voici " + poste + ".",
    en: "Victory. You are now " + poste + ".",
  };
  if (res.key === "narrow") return res.defense
    ? { fr: "Battu de quelques centaines de voix. Le mandat est perdu, mais un score pareil ne s'oublie pas : vous partez favori du prochain.",
        en: "Beaten by a few hundred votes. The seat is gone, but a score like that is not forgotten: you leave as the favourite for next time." }
    : { fr: "Battu de quelques centaines de voix. Le soir même, on ne parle que de vous, et personne ne se souvient du nom du vainqueur.",
        en: "Beaten by a few hundred votes. That evening nobody talks about anyone else, and nobody remembers the winner's name." };
  if (res.key === "honorable") return res.defense
    ? { fr: "Battu, mais bien plus haut que ce que votre camp valait ici. On vous plaint moins qu'on ne vous respecte.",
        en: "Beaten, but far above what your side was worth here. There is more respect than pity in the room." }
    : { fr: "Défaite, avec un score que personne n'attendait. Une campagne perdue peut valoir mieux qu'une élection gagnée sans effort.",
        en: "Defeat, with a score nobody saw coming. A losing campaign can be worth more than an easy win." };
  if (res.key === "loss") return {
    fr: "Défaite. La politique rend tout, mais jamais tout de suite.",
    en: "Defeat. Politics gives everything back, never right away.",
  };
  return {
    fr: "Déroute. Le score est si bas qu'il faudra des années pour que le chiffre cesse d'être cité.",
    en: "A rout. The number is so low it will be quoted back at you for years.",
  };
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

/** Le dépouillement, une fois les temps de campagne joués. */
function resolveRace() {
  const stake = game.race.stake;
  const sondage = racePoll();
  const score = electionScore(game.race.id, stake) + game.race.bonus;
  const before = snapshot(game);

  const res = applyOutcome(stake, score - stake.threshold);
  const won = res.won;
  let texte = outcomeText(res);

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
    texte = { fr: texte.fr + suite.fr, en: texte.en + suite.en };
  }

  game.race.result = { won, text: texte, poll: sondage, changes: diffSince(before, game) };
  addLog(texte);
  return won;
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
/**
 * Une jauge, avec LE REPÈRE DE SON NIVEAU NATUREL.
 *
 * Les deux jauges glissaient toutes seules vers une cible que le joueur ne
 * voyait nulle part : il constatait une baisse sans jamais pouvoir apprendre
 * d'où elle venait. Le repère est le même que celui du plafond d'énergie, qui
 * existait déjà et qui fonctionnait : un trait sur la barre, et une phrase au
 * survol qui dit ce que c'est.
 */
function renderGauge(key, value, labelKey, target) {
  document.getElementById("gauge-" + key + "-label").textContent = t(labelKey);
  document.getElementById("gauge-" + key + "-fill").style.width = value + "%";
  document.getElementById("gauge-" + key + "-value").textContent = value;

  const bar = document.getElementById("gauge-" + key + "-fill").parentElement;
  if (target === undefined) return;

  bar.classList.add("has-ceiling");
  bar.style.setProperty("--ceiling", clamp100(target) + "%");
  const ligne = bar.closest(".gauge") || bar.parentElement;
  if (ligne) ligne.setAttribute("title", t("gauge_target_title"));
}

function renderStatus() {
  document.getElementById("sheet-name").textContent =
    game.character.name || t("sheet_name_empty");

  // Le nom du camp est détaché du reste pour porter sa couleur. Construit en
  // DOM plutôt qu'en chaîne : cette ligne contient le nom du personnage à un
  // caractère près, et elle n'a jamais eu besoin d'innerHTML.
  const meta = document.getElementById("sheet-meta");
  meta.textContent = fmtAge(game.age) + " · ";
  const camp = document.createElement("span");
  camp.className = "sheet-meta-party";
  camp.textContent = t("party_" + game.party);
  meta.appendChild(camp);

  document.getElementById("sheet-meta-2").textContent = t("pos_" + game.position);

  // Les deux jauges de carrière, en tête de fiche.
  renderGauge("pop", game.popularity, "label_popularity", popularityTarget(game));
  renderGauge("standing", game.standing, "label_standing", standingTarget(game));

  document.querySelectorAll(".stat-row").forEach((row) => {
    const stat = row.getAttribute("data-stat");
    const value = game.stats[stat];
    if (value === undefined) return;

    row.querySelector(".stat-bar-fill").style.width = (value / STAT_MAX) * 100 + "%";
    row.querySelector(".stat-row-value").textContent = value;

    // L'énergie est la seule statistique qui se dépense et se récupère. On
    // pose un repère sur sa barre, là où la récupération s'arrête : sans lui,
    // « récupération +4 » ne veut rien dire pour personne.
    if (stat !== "energie") return;
    const bar = row.querySelector(".stat-bar");
    bar.classList.add("has-ceiling");
    bar.style.setProperty("--ceiling", (energyCeiling(game) / STAT_MAX) * 100 + "%");
    row.setAttribute("title", t("energy_ceiling_title"));
  });

  document.getElementById("sheet-money").textContent = formatMoney(game.money);

  // Le solde annuel, juste sous la fortune : on doit voir tout de suite si
  // la carrière se finance ou si elle mange le capital.
  const solde = annualBalance(game);
  const soldeEl = document.getElementById("sheet-balance");
  soldeEl.textContent = (solde < 0 ? "−" : "+") + formatMoney(Math.abs(solde)) + " " + t("budget_per_year");
  soldeEl.classList.toggle("is-negative", solde < 0);

  // La prochaine échéance a quitté la fiche : elle est en haut de colonne,
  // dans le calendrier, avec les trois suivantes et ce qu'elles engagent.
  // La répéter ici en une ligne muette n'ajoutait rien.

  // Traits : ce que la carrière a laissé sur le personnage, avec ce que
  // chacun change écrit noir sur blanc.
  const traits = traitsOf(game);
  document.getElementById("trait-rows").innerHTML = traits.length
    ? traitRowsHTML(traits)
    : '<p class="trait-empty">' + t("traits_none") + "</p>";
}

/* ---------- Le calendrier, au-dessus de la carte ---------- */

/**
 * La frise. La première échéance porte tout : c'est celle qu'on prépare.
 * Les suivantes s'effacent progressivement, parce qu'à cinq ans on ne
 * prépare rien, on se contente de savoir que ça existe.
 */
function renderCalendar() {
  const host = document.getElementById("election-calendar");
  if (!host) return;

  // Deux moments où le calendrier n'a plus rien à annoncer. Pendant une
  // campagne, on est dedans : le laisser affiché déplaçait l'attention hors
  // de la seule chose qui compte. Et sur l'écran de fin, il ne reste aucune
  // échéance à personne ; on y annonçait encore des européennes à quelqu'un
  // qui venait de mourir.
  const muet = Boolean(game.campaign || game.race || game.support || game.ended ||
    (game.card && game.card.kind === "end"));
  const suite = muet ? [] : electionCalendar();
  if (!suite.length) { host.innerHTML = ""; host.hidden = true; return; }
  host.hidden = false;

  // UNE DATE ET UN NOM, RIEN DE PLUS. Chaque case portait aussi une ligne
  // disant ce que le scrutin engageait pour le joueur, « conseiller
  // municipal à votre portée ». C'était du bruit : trois lignes par case,
  // quatre cases, et l'œil ne trouvait plus la seule chose qu'il cherchait,
  // qui est la date. Ce que vaut une échéance se lit quand elle arrive.
  const cases = suite.map((entry, i) => (
    '<li class="cal-step' + (i === 0 ? " is-next" : "") + '">' +
      '<span class="cal-mark" aria-hidden="true"></span>' +
      '<span class="cal-when">' + horizonLabel(entry.inTurns) + "</span>" +
      '<span class="cal-name">' + t("elec_" + entry.id) + "</span>" +
    "</li>"
  )).join("");

  host.setAttribute("aria-label", t("cal_title"));
  host.innerHTML = '<ol class="cal-track">' + cases + "</ol>";
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

/* --------------------------------------------------------------------------
   L'HÉMICYCLE
   --------------------------------------------------------------------------
   DEUX RAPPORTS DE FORCE, ET IL NE FAUT SURTOUT PAS LES CONFONDRE. Celui de
   l'opinion dit ce que pèse chaque camp dans le pays ; celui de l'Assemblée
   dit combien de sièges il a arrachés. Le scrutin majoritaire fait que les
   deux ne se ressemblent pas du tout : un parti à vingt-huit pour cent des
   voix peut détenir la moitié des sièges, un parti à neuf pour cent n'en a
   presque aucun. Les afficher l'un sous l'autre dans le même panneau les
   faisait lire comme une seule et même chose. Ils ont donc chacun leur
   onglet, leur titre et leur unité.

   Les sièges sont rangés de la gauche vers la droite comme dans un vrai
   hémicycle : ce n'est pas une décoration, c'est la seule disposition qui
   permette de voir d'un coup d'œil s'il existe une majorité quelque part.
   -------------------------------------------------------------------------- */

/** L'ordre de placement, de la gauche de l'hémicycle vers la droite. */
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
            (p.position === "chef" ? " is-leader" : "") + '">' +
            '<span class="force-name">' + p.name +
              // Une petite étoile ne se voyait pas. Le président porte
              // désormais un vrai badge, comme le parti au pouvoir.
              (p.name === presidentName() && !p.isPlayer
                ? ' <span class="force-tag is-president">' + t("force_president") + "</span>"
                : "") + "</span>" +
            '<span class="force-role">' + t("pos_" + p.position) +
              " · " + Math.floor(p.age) + " " + t("age_short") + "</span>" +
            '<span class="force-pop">' + Math.round(p.popularity) + "</span>" +
          "</div>"
        ).join("") +
        "</div>" +
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
  if (fx.kind === "approval") return t("label_approval") + " " + signed(fx.delta) + " " + t("label_points");
  if (fx.kind === "dissolve") return t("fx_dissolve");
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
   pour que ce ne soit pas ridicule.

   CLAQUER LA PORTE — on ne prend pas la direction d'un parti qui n'en veut
   pas, alors on en change. C'est cher, définitif, et parfois c'est la seule
   chose qui reste.
   ========================================================================== */

/** L'écart au seuil en dessous duquel une dissidence n'est pas grotesque. */
const REBEL_REACH = 12;

/**
 * CE QUE COÛTE DE SE PRÉSENTER SANS L'INVESTITURE.
 *
 * Le handicap est la machine qui manque : pas de fichier, pas de colleurs
 * d'affiches, pas un élu du coin pour se montrer à côté de vous. Il pèse sur
 * le scrutin comme pèserait une campagne mal menée.
 *
 * La note, elle, tombe au dépouillement et pas au départ. La présenter avant
 * rendait le bouton inutile : on part déjà sous le seuil d'investiture, lui
 * retirer encore douze points de cote avant le vote rendait le scrutin
 * imperdable pour l'appareil. « La direction fait payer quoi qu'il arrive »
 * veut dire après le résultat, pas à la place du résultat.
 *
 * Et gagner rachète une partie de l'affront, parce qu'on ne discute pas avec
 * quelqu'un qui vient de gagner. Perdre coûte le double : c'est ce qui fait
 * de la dissidence un pari et non une option gratuite.
 *
 * Le handicap a été calé sur la fenêtre, pas choisi à vue. À moins sept, on
 * ne gagnait plus du tout dès neuf points d'écart : la porte s'ouvrait sur
 * une défaite certaine, ce qui est pire que de ne pas l'ouvrir. À moins
 * quatre, le pari se tient d'un bout à l'autre de la fenêtre, mesuré sur
 * cinq cents congrès par point d'écart :
 *
 *   écart au seuil    2     4     6     8    10    12
 *   victoires        76%   63%   49%   35%   22%   12%
 */
const REBEL_HANDICAP = -4;
const REBEL_COST_WON = -6;
const REBEL_COST_LOST = -16;

function rebelGap(card) {
  const need = NOMINATION_THRESHOLD[card.target];
  if (need === undefined) return null;
  return need - game.standing;
}

function rebellionButtons(card) {
  if (!card.target) return "";

  const gap = rebelGap(card);
  let html = "";

  if (gap !== null && gap <= REBEL_REACH) {
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

/** Le camp voisin le mieux placé pour vous accueillir. */
function rebelRefuge() {
  const voisins = Object.keys(PARTIES)
    .filter((k) => k !== game.party && ideologicalDistance(k, game.party) <= NEIGHBOUR_DISTANCE)
    .sort((a, b) => game.landscape[b] - game.landscape[a]);
  return voisins[0] || null;
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

  // Une partie qui n'a ni carte ni fin n'est pas finie : elle est entre deux
  // tours. Le moteur affichait quand même l'écran de fin, qui lit le type de
  // la fin et plantait sur une page blanche. On tire la carte suivante.
  if (!showingResult && !card && !game.ended) {
    advanceTurn();
    saveGame();
    renderCard();
    return;
  }

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

  // LE CHOIX DU TERRAIN. Trois portes, et chacune dit ce qu'elle coûte : le
  // jeu ne donne jamais une probabilité, il dit de quoi on joue.
  if (card.kind === "seat") {
    const stake = playerStake(card.id);
    const poste = stake ? t("pos_low_" + stake.target) || t("pos_" + stake.target).toLowerCase() : "";

    host.innerHTML =
      '<div class="event-card event-card-election">' +
        '<p class="event-tag">' + t("elec_" + card.id) + " · " + t("seat_tag") + " · " + cardHeader() + "</p>" +
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
    return;
  }

  // Une investiture refusée se joue comme un événement ordinaire, avec ses
  // choix, mais sous l'étiquette de l'élection qui l'a provoquée.
  if (card.kind === "nomination") {
    const ev = eventById(card.id);
    // Ce qui se joue, en toutes lettres. La carte disait « investiture
    // refusée » sans jamais nommer le scrutin ni le siège.
    const enjeu = card.target
      ? '<p class="event-text nomination-stake">' +
          fillMarks(L({
            fr: "Le parti désigne son candidat {pos_low:" + card.target + "}. Ce ne sera pas vous.",
            en: "The party is picking its candidate for {pos_low:" + card.target + "}. It will not be you.",
          })) + "</p>"
      : "";

    host.innerHTML =
      '<div class="event-card event-card-election">' +
        '<p class="event-tag">' +
          (card.election ? t("elec_" + card.election) + " · " : "") +
          L(ev.tag) + " · " + cardHeader() + "</p>" +
        (card.resolved
          ? '<p class="event-text event-result">' + card.resultText + "</p>" +
            changesHTML(card.resultChanges) + continueButton("data-continue")
          : enjeu + '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
            '<div class="event-choices">' + choiceButtons(ev, game) +
              rebellionButtons(card) + "</div>") +
      "</div>";
    return;
  }

  // Les temps d'une campagne ordinaire, puis le dépouillement.
  if (card.kind === "race" && game.race) {
    renderRaceCard(host, card);
    return;
  }

  // Une carte qui ne fait que raconter un résultat, sans scène derrière.
  if (card.kind === "info") {
    host.innerHTML =
      '<div class="event-card event-card-election">' +
        '<p class="event-tag">' + t(card.tagKey) + " · " + cardHeader() + "</p>" +
        '<p class="event-text event-result">' + card.resultText + "</p>" +
        changesHTML(card.resultChanges) + continueButton("data-continue") +
      "</div>";
    return;
  }

  // LA PRÉSIDENTIELLE DES AUTRES, en trois temps.
  if (card.kind === "support" && game.support) {
    const ev = eventById(card.id);
    const dernier = game.support.step >= SUPPORT_STEPS - 1;

    host.innerHTML =
      '<div class="event-card event-card-election">' +
        '<p class="event-tag">' + t("elec_presidentielle") + " · " +
          t("step_of").replace("{n}", game.support.step + 1)
                     .replace("{total}", SUPPORT_STEPS) + " · " + cardHeader() + "</p>" +
        (card.resolved
          ? '<p class="event-text event-result">' + card.resultText + "</p>" +
            changesHTML(card.resultChanges) +
            continueButton(dernier ? "data-support-done" : "data-support-next")
          : '<p class="event-text nomination-stake">' + t("support_intro") + "</p>" +
            '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
            '<div class="event-choices">' + choiceButtons(ev, game) + "</div>") +
      "</div>";
    return;
  }

  // LA PRIMAIRE. On y voit qui d'autre y va, et ce que chacun pèse : le
  // joueur décide en connaissance de cause, comme pour les autres scrutins.
  if (card.kind === "primaire") {
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
        '<p class="event-tag">' + t("primaire_tag") + " · " + cardHeader() + "</p>" +
        (card.resolved
          ? '<p class="event-text event-result">' + card.resultText + "</p>" +
            changesHTML(card.resultChanges) + continueButton("data-continue")
          : '<p class="event-text">' + t("primaire_intro") + "</p>" + liste +
            '<div class="event-choices">' + boutons + "</div>") +
      "</div>";
    return;
  }

  // Un scrutin qui se joue sans vous : on annonce le résultat, puis on
  // demande ce que vous avez fait de ces six semaines.
  if (card.kind === "aside") {
    const ev = eventById(card.id);
    host.innerHTML =
      '<div class="event-card event-card-election">' +
        '<p class="event-tag">' + t("elec_" + card.election) + " · " + cardHeader() + "</p>" +
        '<p class="event-text nomination-stake">' + card.intro + "</p>" +
        (card.resolved
          ? '<p class="event-text event-result">' + card.resultText + "</p>" +
            changesHTML(card.resultChanges) + continueButton("data-continue")
          : '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
            '<div class="event-choices">' + choiceButtons(ev, game) + "</div>") +
      "</div>";
    return;
  }

  if (card.kind === "election") {
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
          '<p class="event-tag">' + t("elec_" + card.id) + " · " + cardHeader() + "</p>" +
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
          '<p class="event-tag">' + t("elec_" + card.id) + " · " + cardHeader() + "</p>" +
          '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) +
          continueButton("data-continue") +
        "</div>";
    }
  }
}

/**
 * Un temps de campagne, ou le résultat. L'état de la campagne est raconté,
 * jamais chiffré : on dit « c'est serré », pas « il vous manque quatre points ».
 */
function renderRaceCard(host, card) {
  const race = game.race;

  if (race.result) {
    const dernier = race.result.poll;
    host.innerHTML =
      '<div class="event-card event-card-election">' +
        '<p class="event-tag">' + t("race_result") + " · " + t("elec_" + race.id) + "</p>" +
        (dernier ? pollHTML(dernier, "label_poll") : "") +
        '<p class="event-text event-result">' + logText({ text: race.result.text }) + "</p>" +
        changesHTML(race.result.changes) +
        continueButton("data-race-done") +
      "</div>";
    return;
  }

  const ev = raceEventById(card.id);
  // « Temps 1 sur 1 » ne veut rien dire : quand la campagne tient en une
  // scène, on ne compte pas les scènes.
  const temps = raceSteps(race.id);
  const entete = t("elec_" + race.id) +
    (temps > 1
      ? " · " + t("step_of").replace("{n}", race.step + 1).replace("{total}", temps)
      : "");

  const sondage = racePoll();

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      '<p class="event-tag">' + entete + "</p>" +
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

function renderCampaignCard(host, card) {
  const campaign = game.campaign;
  const step = campaign.step;

  // Dimanche du second tour : le verdict.
  if (campaign.phase === "runoff") {
    const res = campaign.result;
    host.innerHTML =
      '<div class="event-card event-card-campaign">' +
        '<p class="event-tag">' + t("label_round2") + " · " + cardHeader() + "</p>" +
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

  // Les quinze jours du face-à-face. Même carte, mais le sondage affiché
  // n'est plus le premier tour : c'est le duel, et il fait cent pour cent.
  if (campaign.phase === "duel") {
    const scene = campaignEventById(card.id);
    const duel = campaign.duel;
    const dernier = duel.step >= RUNOFF_STEPS - 1;

    host.innerHTML =
      '<div class="event-card event-card-campaign">' +
        '<p class="event-tag">' + t("label_between") + " · " + t("step_of")
          .replace("{n}", duel.step + 1).replace("{total}", RUNOFF_STEPS) + "</p>" +
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
  if (spec.nerve) parts.push(t("budget_fx_nerve") + " " + Math.round(spec.nerve * 100) + " %");
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

  // Le soir du premier tour ouvre l'entre-deux-tours au lieu de trancher.
  if (target.hasAttribute("data-campaign-runoff")) {
    startDuel();
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-duel-next")) {
    game.campaign.duel.step++;
    driftRunoff(game);
    game.card = { kind: "campaign", id: drawRunoffEvent().id, resolved: false };
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-campaign-verdict")) {
    resolveRunoff();
    game.campaign.phase = "runoff";
    saveGame();
    renderAll();
    return;
  }

  // Un temps de campagne ordinaire : le choix déplace l'avantage.
  if (target.hasAttribute("data-choice") && game.card.kind === "race") {
    const ev = raceEventById(game.card.id);
    const choice = ev.choices[Number(target.getAttribute("data-choice"))];
    const outcome = resolveChoice(choice, game);
    markSeen(ev, game);

    game.card.resolved = true;
    game.card.resultText = outcome.text;
    game.card.resultChanges = outcome.changes;
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-race-next")) {
    game.race.step++;
    if (game.race.step >= raceSteps(game.race.id)) resolveRace();
    else game.card = { kind: "race", id: drawRaceEvent().id, resolved: false };
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-race-done")) {
    game.race = null;
    game.card = null;
    if (!game.ended) advanceTurn();
    else game.card = { kind: "end" };
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-choice")) {
    const ev = eventById(game.card.id);
    const choice = ev.choices[Number(target.getAttribute("data-choice"))];
    const avant = game.card.defends ? snapshot(game) : null;
    const outcome = resolveChoice(choice, game);
    markSeen(ev, game);
    // Sans investiture, le sortant n'est sur aucun bulletin : la scène jouée,
    // il apprend qu'il n'est plus rien. La cote regagnée dans la bataille
    // servira au scrutin suivant, pas à celui-ci.
    const rendu = game.card.defends
      ? standDown({ defense: true, target: game.card.defends })
      : null;
    game.card.resolved = true;
    game.card.resultText = fillMarks(outcome.text + (rendu ? " " + L(rendu) : ""));
    game.card.resultChanges = rendu ? diffSince(avant, game) : outcome.changes;
    addLog(outcome.log);
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-run")) {
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
    return;
  }

  /* ---------- Les deux portes d'une investiture refusée ---------- */

  // LA DISSIDENCE. Le scrutin a lieu pour de bon, avec les mêmes temps de
  // campagne que n'importe quel autre, mais on le mène sans la machine : le
  // handicap part avec la campagne et ne se rattrape qu'en la jouant bien.
  if (target.getAttribute("data-rebel") === "run") {
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
  if (target.getAttribute("data-rebel") === "leave") {
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
    return;
  }

  // Le terrain choisi : on l'inscrit dans l'enjeu et la campagne commence.
  if (target.hasAttribute("data-seat")) {
    const choix = target.getAttribute("data-seat");
    const id = game.card.id;
    const stake = playerStake(id);
    if (!stake) return;

    const terrain = SEAT_KINDS[choix] || SEAT_KINDS.ordinaire;
    startRace(id, { ...stake, seat: choix, threshold: stake.threshold + terrain.threshold });
    addLog({
      fr: fillMarks("Vous obtenez d'être placé " + t("seat_log_" + choix) + " pour {elec_low:" + id + "}."),
      en: fillMarks("You get yourself placed " + t("seat_log_" + choix) + " for {elec_low:" + id + "}."),
    });
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-support-next")) {
    game.support.step++;
    game.card = { kind: "support", id: drawSupport().id, resolved: false };
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-support-done")) {
    const before = snapshot(game);
    const texte = resolveSupport();
    addLog(texte);
    game.card = { kind: "info", tagKey: "elec_presidentielle", resolved: true,
                  resultText: fillMarks(L(texte)), resultChanges: diffSince(before, game) };
    saveGame();
    renderAll();
    return;
  }

  if (target.hasAttribute("data-primaire")) {
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
    return;
  }

  if (target.hasAttribute("data-lobby")) {
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
    return;
  }

  if (target.hasAttribute("data-skip")) {
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
  // Toute la couleur de la page découle de cet attribut : le fond, les
  // accents, le nom du camp sur la fiche. Une seule ligne, et le reste est
  // en CSS.
  document.body.dataset.party = game.party;
  buildStatRows();
  renderStatus();
  renderCalendar();
  renderCard();
  renderAssembly();
  renderBudget();
  renderLandscape();
  renderJournal();
}

/*
 * REPÈRE DE VERSION.
 *
 * Le navigateur garde le JavaScript en cache, y compris en rechargeant la
 * page : on a passé trois échanges à chercher des bugs déjà corrigés dans le
 * fichier mais absents de la partie en cours. Cette ligne s'affiche dans la
 * console au démarrage. Si l'heure ne correspond pas à la dernière
 * modification, c'est du cache : Cmd+Shift+R.
 */
const BUILD = "2026-08-21 11:45";

(function init() {
  console.log("President Material — version du " + BUILD);

  const saved = loadGame();
  if (saved) {
    game = saved;
    // Compatibilité avec les parties commencées avant les chaînes et avant
    // les traits : une sauvegarde d'alors n'a pas ces champs.
    if (!game.seen) game.seen = {};
    // Les sauvegardes d'avant le contrôle du patrimoine n'ont pas de point
    // zéro : on le recalcule depuis la fiche plutôt que de les déclarer riches.
    if (game.startMoney === undefined) game.startMoney = computeMoney(game.character);
    // Une sauvegarde d'avant l'historique des partis ne connaît que le camp
    // actuel : on part de là plutôt que de lui inventer un passé.
    if (!game.parties) game.parties = [game.party];
    if (game.presidentialRuns === undefined) game.presidentialRuns = 0;

    // Une sauvegarde d'avant la crédibilité n'en a pas. On ne la met pas à
    // zéro : la carrière déjà jouée a construit une stature, et on la lui
    // rend au niveau de la fonction atteinte, sans jamais descendre sous ce
    // que son profil de départ lui valait.
    if (game.stats.credibilite === undefined) {
      game.stats.credibilite = Math.max(
        computeStats(game.character).credibilite || 0,
        CREDIBILITY_BY_OFFICE[game.position] || 0
      );
    }
    game.rivals.forEach((r) => {
      if (r.stats.credibilite === undefined) r.stats.credibilite = 4 + randInt(4);
    });
    if (!game.traits) game.traits = [];
    if (!game.strikes) game.strikes = {};
    if (game.race === undefined) game.race = null;
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

  // LE PAYS TOURNE DÉJÀ QUAND LA CARRIÈRE COMMENCE. Il a un président, un
  // Premier ministre et une Assemblée. newGame posait le président sans
  // former son gouvernement : Matignon était vacant au premier tour, ce qui
  // n'arrive jamais. Une partie sauvegardée avant tout cela en reçoit
  // autant au chargement.
  if (game.approval === undefined) game.approval = 52;
  ensureGovernment();
  if (!game.assembly) computeAssembly();

  // ON RESAUVEGARDE. Le premier saveGame() a lieu plus haut, avant que le
  // gouvernement soit formé et l'Assemblée répartie : ni l'un ni l'autre
  // n'entrait donc dans la sauvegarde, et chaque rechargement de la page
  // retirait les cinq cent soixante-dix-sept sièges au sort sous les yeux du
  // joueur. Une Assemblée qui change quand on appuie sur F5 n'est pas une
  // Assemblée.
  saveGame();

  // Les onglets du panneau. Un clic, rien à recharger : les deux volets
  // sont rendus à chaque tour, on ne fait que montrer l'un ou l'autre.
  const onglets = document.querySelector(".panel-tabs");
  if (onglets) onglets.addEventListener("click", (event) => {
    const bouton = event.target.closest(".panel-tab");
    if (!bouton) return;
    onglets.querySelectorAll(".panel-tab").forEach((b) => {
      b.classList.toggle("is-active", b === bouton);
    });
    document.getElementById("pane-landscape").hidden = bouton.dataset.tab !== "landscape";
    document.getElementById("pane-assembly").hidden = bouton.dataset.tab !== "assembly";
  });

  // Les figures d'un parti se déplient au clic, une par une.
  const opinion = document.getElementById("pane-landscape");
  if (opinion) opinion.addEventListener("click", (event) => {
    const bouton = event.target.closest(".force-toggle");
    if (!bouton) return;
    bouton.closest(".force-row").classList.toggle("is-open");
  });

  document.getElementById("event-area").addEventListener("click", handleClick);
  document.getElementById("sheet-budget").addEventListener("click", handleBudgetClick);
  document.getElementById("retire-btn").addEventListener("click", retire);

  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("languagechange", renderAll);
  if (document.readyState !== "loading") renderAll();
})();
