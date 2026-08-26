/*
 * President Material — moteur de la boucle de jeu (game.html).
 *
 * Un tour = une saison, quatre tours par an (TURNS_PER_YEAR, dans
 * js/game-data.js). À chaque tour : vieillissement, revenus, risque de
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
    peakPopularity: 0,    // le sommet, pas la fin : l'écran de fin lit les deux
    peakStanding: 0,
    // La direction du parti ne se range pas dans "position" : elle se cumule
    // avec elle. Voir LA DIRECTION DU PARTI dans js/game-data.js.
    partyLead: false,
    peakLead: false,
    flags: {},
    strain: 0,         // énergie dépensée qu'on n'avait pas : la dette de fatigue
    strainStruck: 0,   // avertissements du corps déjà envoyés
    decline: 0,        // combien de fois le corps a parlé : voir LE CORPS PRÉVIENT
    declineTurn: null, // le tour du dernier signe
    career: [],        // la frise : tout ce dont on se souviendra à la fin
    traits: [],        // marques durables laissées par les choix
    strikes: {},       // écarts commis, avant qu'ils ne fassent une réputation
    investments: {},   // niveaux des postes de dépense choisis par le joueur
    seen: {},          // événements déjà joués : ils ne reviendront pas
    pending: [],       // suites programmées, avec le tour où elles tombent
    // La vérité de l'opinion vit dans appeal, six électorats ; popularity en
    // est la moyenne pondérée, recalculée par syncPopularity(). Voir
    // « LA POPULARITÉ N'EST PAS UN NOMBRE, C'EST SIX » dans js/game-data.js.
    appeal: null,
    popularity: 0,
    standing: 0,
    rivals,               // une figure par parti
    baseline: {},         // ce autour de quoi chaque parti se situe, et qui vit
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
  // Le pays dans lequel on entre n'est pas le même d'une partie à l'autre.
  state.baseline = initialBaseline();
  state.landscape = initialLandscape(state);
  // CE QUE LES PARTIS PESAIENT LE JOUR OÙ VOUS ÊTES ENTRÉ. C'est la seule
  // comparaison honnête à faire en fin de partie : ce qu'un camp vaut
  // aujourd'hui par rapport à ce qu'il valait quand vous êtes arrivé.
  state.startShares = { ...state.landscape };

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
  state.appeal = initialAppeal(state);
  syncPopularity(state);
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
/* ==========================================================================
   LE SOCLE N'EST PAS UNE PROPRIÉTÉ DU PARTI, C'EST L'ÉTAT DU PAYS
   ==========================================================================
   Il valait « 28 moins cinq fois la difficulté », c'est-à-dire un nombre
   gravé dans le parti pour l'éternité. Deux conséquences, toutes les deux
   mauvaises.

   TOUTES LES PARTIES COMMENÇAIENT PAREIL. Les parts de départ étaient ce
   socle plus zéro à huit points de hasard : les centristes ouvraient en tête
   dans chaque partie, les camps de rupture fermaient la marche dans chaque
   partie, et l'on entrait toujours dans le même pays.

   ET RIEN NE POUVAIT SE RECOMPOSER. Le rappel ramenait éternellement chacun
   à son chiffre : un camp porté à vingt pour cent pendant dix ans
   redescendait à huit dès qu'on cessait de pousser. Mesurée sur cent vingt
   carrières entières, l'amplitude d'un camp de rupture sur toute une vie
   politique était de cinq points, et ces camps remportaient zéro pour cent
   des présidentielles.

   Le socle est donc tiré au début de partie et VIT ENSUITE. La difficulté
   penche toujours — un camp de rupture part bas la plupart du temps — mais
   elle ne décide plus : de temps en temps, le pays est ailleurs. Puis deux
   ressorts lents se répondent : la part est rappelée vers le socle
   (LANDSCAPE_PULL), et le socle suit lentement ce que le parti fait vraiment
   (BASELINE_FOLLOW). Un pic retombe ; dix ans au sommet réancrent. C'est ce
   qui manquait pour qu'une recomposition existe.
   ========================================================================== */

/** Ce autour de quoi un parti se situe quand une partie s'ouvre. */
function initialBaseline() {
  const base = {};
  Object.keys(PARTIES).forEach((key) => {
    const centre = 28 - PARTIES[key].difficulty * 5;
    base[key] = Math.max(3, centre * (0.5 + Math.random() * 1.2) + (Math.random() - 0.35) * 7);
  });
  return base;
}

/** Le socle du moment. Les vieilles sauvegardes n'en ont pas : on le rend. */
function naturalShare(key) {
  if (!game || !game.baseline) return 28 - PARTIES[key].difficulty * 5;
  return game.baseline[key];
}

/** Vitesse à laquelle le socle suit ce que le parti pèse réellement. */
const BASELINE_FOLLOW = 0.006;

/** Ce que l'air du temps déplace tout seul, par tour. */
const BASELINE_NOISE = 0.07;   // un tour deux fois plus court : bruit ÷ √2

/**
 * LA VIE DU SOCLE. Beaucoup plus lent que la part elle-même : un parti ne se
 * réancre pas sur un bon trimestre, il se réancre sur une décennie. C'est la
 * différence entre une vague et une recomposition.
 */
function driftBaseline() {
  Object.keys(game.baseline).forEach((key) => {
    const part = game.landscape[key] || 0;
    game.baseline[key] = Math.max(3,
      game.baseline[key] +
      (part - game.baseline[key]) * BASELINE_FOLLOW +
      (Math.random() - 0.5) * BASELINE_NOISE);
  });
}

/*
 * TOUT CE QUI SE DÉPLACE PAR TOUR EST DIVISÉ PAR DEUX.
 *
 * Le rappel ci-dessous, l'usure de ceux qui gouvernent, ce qu'une figure
 * populaire tire à son camp, ce qu'un pacte rapporte : ce sont des forces par
 * tour, et l'année en compte désormais quatre. Elles sont toutes reprises de
 * moitié, ce qui laisse le tableau à l'équilibre exactement où il était et
 * lui fait mettre le même nombre d'années à y aller. Le BRUIT, lui, est
 * divisé par √2 et non par 2 : c'est une marche au hasard, et c'est sa
 * variance annuelle qu'il faut conserver.
 */
/**
 * Vitesse du rappel vers le socle, par tour.
 *
 * Elle était deux fois plus forte, et c'est ce qui rendait le tableau
 * illisible : un choc encaissé revenait à son point de départ en une dizaine
 * de tours, si bien que rien de ce qui arrivait dans la partie ne laissait de
 * trace. Le paysage doit garder la mémoire de ce qu'on lui fait, sinon il
 * n'est qu'un décor qui tremble.
 */
const LANDSCAPE_PULL = 0.011;

/** Répartition de départ, adossée à la difficulté des partis. */
function initialLandscape(state) {
  const base = (state && state.baseline) || initialBaseline();
  const shares = {};
  Object.keys(PARTIES).forEach((key) => {
    shares[key] = Math.max(3, base[key] * (0.8 + Math.random() * 0.5));
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
const APPROVAL_WEAR = 0.65;

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
const APPROVAL_PULL = 0.046;
const APPROVAL_NOISE = 6.4;   // un tour deux fois plus court : bruit ÷ √2

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
  move -= APPROVAL_WEAR + (game.presidentTerms - 1) * 0.55;
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

/**
 * LA VAGUE.
 *
 * Une législative qui suit une présidentielle n'est pas une élection, c'est
 * une confirmation : le pays vient de choisir quelqu'un et lui donne de quoi
 * gouverner. Le moteur n'en savait rien. Le seul avantage du camp élu était
 * sa cote de sortie d'élection, qui vaut sept pour cent de poids en plus :
 * autant dire rien une fois les parts élevées à la puissance 2,1. Un camp
 * qui gagnait l'Élysée avec dix-huit pour cent des voix se retrouvait donc
 * avec quatre-vingts députés et gouvernait cinq ans sans jamais rien voter,
 * ce qui n'est arrivé à personne.
 *
 * La vague ne vaut que dans la fenêtre où la confirmation a un sens. Passé
 * six mois, une législative redevient une élection ordinaire, et c'est
 * exactement ce qui distingue 2017 de 1997. La fenêtre valait trois tours
 * quand un tour faisait six mois ; elle en vaut deux depuis que la
 * législative tombe un trimestre après la présidentielle, et elle couvre donc
 * la même chose : celle-là, et aucune dissolution ultérieure.
 */
/*
 * Calibré en fabriquant deux cents législatives de confirmation par palier.
 * À 1,35, un camp de rupture à douze pour cent passe de cent sept à cent
 * trente-quatre sièges — un vrai groupe, pas une majorité ; à dix-huit, il
 * obtient la majorité absolue une fois sur sept ; à vingt-quatre, il l'a,
 * comme l'ont eue tous les présidents élus avec un camp large. Au-delà de
 * 1,7 la majorité absolue devenait automatique pour tout le monde, ce qui
 * n'est pas la Cinquième République, c'est un plébiscite.
 */
const COATTAIL = 1.35;
const COATTAIL_WINDOW = 2;

/** Depuis combien de tours le président en exercice est en place. */
function turnsSinceElection() {
  if (game.presidentSince === undefined) return Infinity;
  return game.turn - game.presidentSince;
}

/** Répartit les sièges. Appelé le soir de chaque législative, et seulement là. */
function computeAssembly() {
  const ruling = rulingParty();

  const poids = {};
  Object.keys(PARTIES).forEach((key) => {
    const part = Math.max(0.5, game.landscape[key] || 0);
    // La prime au camp du président, ou la note qu'il paie : dans la foulée
    // de son élection, on lui donne une majorité ou on la lui refuse.
    // La prime au camp du président : sa cote du moment, et la vague quand le
    // scrutin suit de près son élection.
    const vague = turnsSinceElection() <= COATTAIL_WINDOW ? COATTAIL : 1;
    const souffle = key === ruling ? (1 + (game.approval - 50) / 160) * vague : 1;
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

/* --------------------------------------------------------------------------
   OÙ LE JOUEUR EST ASSIS.
   --------------------------------------------------------------------------
   L'Assemblée existait, elle était même dessinée dans le panneau, mais rien
   n'en tirait la seule chose qui intéresse une carrière : ce que VOTRE camp y
   pèse. Les trois fonctions ci-dessous sont lues par les conditions
   d'événement "minSeats"/"maxSeats", "firstGroup" et "pivot".
   -------------------------------------------------------------------------- */

/** Les sièges du parti du joueur. */
function partySeats(s) {
  const state = s || game;
  return game.assembly ? game.assembly[state.party] || 0 : 0;
}

/**
 * Premier groupe de l'Assemblée. On peut l'être sans gouverner, et c'est même
 * la position la plus incommode de la Cinquième : tout le monde vous demande
 * des comptes sur un pouvoir que vous n'avez pas.
 */
function partyIsFirstGroup(s) {
  const state = s || game;
  if (!game.assembly) return false;
  const plusGros = Math.max(...Object.values(game.assembly));
  return (game.assembly[state.party] || 0) >= plusGros;
}

/**
 * LE PIVOT. Le gouvernement n'a pas la majorité, et il l'aurait avec vos
 * voix. Rien dans la Constitution ne décrit cette place et c'est la plus
 * chère de la République : on ne vous demande pas de soutenir, on vous
 * achète, et le prix se compte en ministères.
 */
function partyIsPivot(s) {
  const state = s || game;
  if (!game.assembly) return false;

  const bloc = governmentBloc();
  if (!bloc.length || bloc.includes(state.party)) return false;

  const sieges = governmentSeats();
  if (sieges >= ASSEMBLY_MAJORITY) return false;
  return sieges + (game.assembly[state.party] || 0) >= ASSEMBLY_MAJORITY;
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
const CENSURE_CHANCE = 0.055;

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
    // L'AIR DU TEMPS. Il valait 0,9, et le tableau ne bougeait plus : mesurée
    // sur cent vingt carrières entières, l'amplitude d'un parti sur toute une
    // vie politique était de cinq points pour les camps de rupture. Un
    // paysage qui ne se recompose jamais n'est pas un paysage, c'est un
    // décor. Le bruit reste inférieur à ce que déplacent les événements : le
    // mouvement doit rester causé, il ne doit pas être impossible.
    let move = (Math.random() - 0.5) * 1.15;

    // Le rappel vers ce que le parti pèse naturellement dans le pays.
    move += (naturalShare(key) / floor - game.landscape[key]) * LANDSCAPE_PULL;

    // GOUVERNER USE, ET DE PLUS EN PLUS. Un premier mandat s'entame
    // doucement, un second se paie plein tarif : c'est ce qui fait respirer
    // le tableau au lieu de le laisser figé sur ses socles.
    if (key === ruling) move -= 0.22 + (game.presidentTerms - 1) * 0.25;

    // Une figure populaire tire son parti vers le haut.
    const figure = figureOf(key);
    if (figure) move += (figure.popularity - 45) / 180;

    // Le joueur pèse sur son propre camp, d'autant plus qu'il est haut placé.
    // Un militant aimé de son quartier ne déplace pas les intentions de vote
    // nationales ; un chef de parti, oui. Le coefficient reste volontairement
    // bas : être populaire aide son camp, cela ne le porte pas à bout de bras.
    // Ce sont les événements qui doivent faire le gros du travail.
    if (key === game.party) {
      // La lecture nationale, et pas la note : on ne tire pas les intentions
      // de vote d'un pays avec l'affection des siens.
      move += ((nationalPopularity(game) - 50) / 190) * (0.4 + exposureOf(game) / 28);
    }

    // Deux partis alliés finissent par ressembler à une offre de gouvernement,
    // ce qui profite un peu aux deux.
    if (ally && (key === ally || key === game.party)) move += 0.075;

    game.landscape[key] = Math.max(LANDSCAPE_FLOOR, game.landscape[key] + move);
  });

  normalizeLandscape(game.landscape);
  driftBaseline();
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
/**
 * QUI UN PARTI PRÉSENTE À L'ÉLYSÉE.
 *
 * Sa figure la plus en vue, sauf si c'est le président sortant et qu'il a
 * fait ses deux mandats : celui-là ne se représente pas, et c'est la seule
 * limite de candidature qui existe pour de bon.
 *
 * Le moteur ne lui retirait que la prime au bilan et le laissait concourir :
 * on voyait donc un président entamer un troisième mandat, annoncé « réélu
 * pour un second ». Un camp qui n'a personne d'autre fait monter quelqu'un,
 * ce qui est exactement ce qui se passe, et ce qui surprend toujours.
 */
function presidentialCandidate(partyKey) {
  const figures = figuresOf(partyKey);
  if (!incumbentTermLimited()) return figures[0] || null;

  const autre = figures.find((f) => !isPresident(f));
  if (autre) return autre;

  const heir = spawnFigure(partyKey, "cadre");
  game.rivals.push(heir);
  return heir;
}

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

/**
 * LA DÉRIVE PORTE SUR LES SIX ÉLECTORATS, PAS SUR LA MOYENNE.
 *
 * popularity est désormais dérivée : l'écrire directement serait effacé au
 * prochain syncPopularity(). Chaque électorat glisse donc vers la cible du
 * profil, en gardant l'écart que les positionnements ont creusé — c'est ce
 * qui fait qu'une réputation de clivage s'use lentement au lieu de
 * disparaître au tour suivant.
 */
function driftGauges() {
  const frein = investHold(game, "popularity");

  if (game.appeal) {
    /* LE NIVEAU DÉRIVE VITE, LA FORME TRÈS LENTEMENT.
       Chacun vers sa propre cible ne suffisait pas : au rythme ordinaire des
       jauges, ce qu'un choix avait creusé entre deux électorats était comblé
       en trois ou quatre tours, et positionner ne laissait aucune trace. On
       fait donc glisser la MOYENNE au rythme habituel — la popularité
       d'ensemble se comporte exactement comme avant — et les ÉCARTS à cette
       moyenne beaucoup plus lentement. C'est le dossier que chaque électorat
       tient sur vous, et il s'en souvient. */
    const cibles = appealTargets(game);
    const { poids, total } = electorateWeights(game);
    const moyenne = (map) => {
      let somme = 0;
      Object.keys(PARTIES).forEach((k) => { somme += map[k] * poids[k]; });
      return total ? somme / total : 0;
    };

    /* SEULE VOTRE BASE DÉRIVE.
       Votre camp vous connaît : il sait ce que vous valez, et son opinion
       revient vers ce que votre dossier dit de vous. Les autres électorats ne
       vous connaissent que par vos actes, et il n'y a aucune raison qu'ils
       reviennent tout seuls vers quoi que ce soit — ce qu'ils pensent de vous
       est la somme de ce que vous avez fait devant eux.

       C'est ce qui rendait les six valeurs si proches : elles étaient toutes
       ramenées vers une cible calculée depuis les statistiques, si bien que
       les choix n'étaient que des perturbations autour d'un chiffre décidé à
       la création du personnage. */
    game.appeal[game.party] = driftToward(game.appeal[game.party], cibles[game.party], frein);

    // Les autres ne reviennent pas vers leur cible, ils s'en approchent de
    // très loin. Sans aucun rappel, ce qu'ils pensent de vous ne fait que
    // descendre — le contenu du jeu a été écrit contre un rappel fort — et la
    // popularité d'ensemble s'effondrait de quarante-trois à trente. Le
    // coefficient est assez faible pour qu'un choix tienne des années, assez
    // present pour qu'une carriere ne parte pas au fond.
    Object.keys(PARTIES).forEach((key) => {
      if (key === game.party) return;
      game.appeal[key] = clamp100(
        game.appeal[key] + (cibles[key] - game.appeal[key]) * OTHERS_PULL);
    });
    syncPopularity(game);
  } else {
    game.popularity = driftToward(game.popularity, popularityTarget(game), frein);
  }

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
  for (let ahead = 1; ahead <= 24; ahead++) {
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
const CALENDAR_HORIZON = 52;

function electionCalendar() {
  const suite = [];
  for (let ahead = 1; ahead <= CALENDAR_HORIZON && suite.length < CALENDAR_LENGTH; ahead++) {
    const e = electionAtTurn(game.turn + ahead);
    if (e) suite.push({ id: e.id, inTurns: ahead, stake: playerStake(e.id) });
  }
  return suite;
}

/**
 * Dans combien de temps, en toutes lettres. Un tour vaut un trimestre, et
 * « dans 2.25 ans » ne se dit pas.
 *
 * Sous deux ans on compte en mois, parce que c'est ainsi qu'on parle d'une
 * échéance qu'on prépare. Au-delà, on compte en années et en demies : les
 * trimestres restants s'arrondissent au demi-an le plus proche, personne
 * n'ayant jamais annoncé une élection « dans trois ans et neuf mois ».
 */
function horizonLabel(turns) {
  const mois = turns * (12 / TURNS_PER_YEAR);

  if (mois < 12) return t("cal_months").replace("{n}", mois);
  if (mois === 12) return t("cal_one_year");
  if (mois === 18) return t("cal_one_year_half");
  if (mois < 24) return t("cal_year_months").replace("{n}", mois - 12);

  const ans = Math.floor(mois / 12);
  const demi = mois % 12 >= 6;
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
    // LE SORTANT EST CELUI QUI TIENT LA MAISON, pas celui qui tient un
    // mandat : on défend la direction avec le siège qu'on a, et le siège
    // n'est pas dans la balance. Un congrès perdu ne prend pas une
    // circonscription, il prend un titre.
    if (game.partyLead) return { target: "chef", threshold: 69, defense: true };
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
    // ON SE PRÉSENTE AUTANT DE FOIS QUE LE PARTI VEUT BIEN VOUS PRÉSENTER.
    // Un plafond de deux candidatures par carrière fermait la porte sans rien
    // expliquer, alors qu'une carrière réelle en compte trois, quatre, cinq.
    // Ce qui freine est la cote au parti, que la défaite précédente a déjà
    // déplacée selon ce qu'elle valait (voir concedeElection).

    // C'EST LA PRIMAIRE QUI DÉSIGNE, PAS LA FONCTION. Le jeu réservait la
    // présidentielle au chef du parti : un ministre brillant, très bien coté
    // et connu du pays voyait passer chaque échéance sans qu'on lui propose
    // jamais rien. On concourt désormais parce qu'on a gagné l'investiture.
    if (game.nominee === "player") return { target: "president", threshold: 0 };
    if (game.nominee) return null;

    // Filet de sécurité : si aucune primaire n'a eu lieu, la direction du
    // parti reste la porte d'entrée qu'elle a toujours été.
    if (game.partyLead || pos === "premier") return { target: "president", threshold: 0 };
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
/* ==========================================================================
   LA FRISE D'UNE CARRIÈRE
   ==========================================================================
   Le jeu ne gardait aucune trace de ce qu'il avait raconté. Le journal tient
   huit lignes et se vide, `seen` dit quelles scènes ont été jouées mais pas
   ce qu'elles ont produit, et l'écran de fin ne pouvait donc annoncer qu'un
   sommet et une fortune. Une carrière de quarante ans se résumait à trois
   nombres.

   On enregistre donc, au fil de la partie, les seuls moments dont on se
   souvient d'une vie politique : les fonctions prises et rendues, la maison
   qu'on dirige, les camps qu'on quitte, les soirs d'élection, et les fois où
   le corps a parlé. C'est de cette liste que l'écran de fin tire la frise et
   le relevé — et elle ne se tronque jamais, contrairement au journal.
   ========================================================================== */

function recordCareer(s, entry) {
  if (!s.career) s.career = [];
  s.career.push({ turn: s.turn, age: Math.floor(s.age), ...entry });
}

function setOffice(s, position) {
  if (!position || !LADDER.includes(position) || s.position === position) return false;

  const quitte = s.position;
  const monte = LADDER.indexOf(position) > LADDER.indexOf(quitte);


  s.position = position;
  if (LADDER.indexOf(position) > LADDER.indexOf(s.peakPosition)) s.peakPosition = position;
  recordCareer(s, { kind: "office", position, party: s.party });

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
 * PRENDRE OU RENDRE LA DIRECTION DU PARTI.
 *
 * Elle ne passe pas par setOffice, et c'est tout le sujet : LE MANDAT NE
 * BOUGE PAS. On prend la maison au congrès, on la rend au congrès suivant, à
 * une présidentielle perdue de trop, ou en changeant de camp — jamais parce
 * qu'on a été élu ailleurs.
 *
 * Renvoie true si quelque chose a changé, pour que l'affichage des
 * conséquences ait quelque chose à montrer.
 */
function setPartyLead(s, on) {
  const veut = Boolean(on);
  if (Boolean(s.partyLead) === veut) return false;

  s.partyLead = veut;
  if (veut) s.peakLead = true;
  recordCareer(s, { kind: "lead", on: veut, party: s.party });

  // Un parti a un chef et un seul : celui qui portait le titre le rend, ou
  // le reprend. La ligne de journal est écrite là-bas, avec les autres.
  ensureLeaders();

  // On ne dirige pas un parti depuis la liste des militants. Prendre la
  // maison, c'est au minimum avoir un bureau dedans.
  if (veut && s.position === "militant") setOffice(s, "cadre");

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
/* CHAQUE SCRUTIN NE LIT PAS LE MÊME PAYS.
   Les trois formules multipliaient game.popularity, c'est-à-dire la moyenne
   des six électorats. Deux conséquences. On ne faisait aucune différence
   entre une municipale, qui se gagne en mobilisant les siens dans une ville
   qu'on connaît, et une européenne, où l'on vote pour une étiquette : le même
   nombre servait aux deux. Et depuis que l'opinion des autres électorats
   s'accumule au lieu d'être rappelée, cette moyenne a baissé de neuf points —
   les scrutins ordinaires sont donc devenus plus durs sans que personne ne
   l'ait décidé, de cinquante-deux à quarante et un pour cent de victoires.

   On dose donc, scrutin par scrutin, la part de ce que pense votre camp et la
   part de ce que pensent les autres. Plus le scrutin est local et incarné,
   plus votre base pèse ; plus il est national et anonyme, plus ce sont les
   autres qui décident. */
const ELECTION_BASE_WEIGHT = {
  municipales: 0.62,   // on y vote pour quelqu'un qu'on croise au marché
  legislatives: 0.50,  // une étiquette, mais dans une circonscription
  europeennes: 0.28,   // une étiquette, et rien d'autre
};

function electionAppeal(electionId) {
  const w = ELECTION_BASE_WEIGHT[electionId];
  if (w === undefined || !game.appeal) return game.popularity;
  return basePopularity(game) * w + generalPopularity(game) * (1 - w);
}

/**
 * CE QU'UN TERRAIN DOIT AU VENT NATIONAL. Un bastion tient quand le camp
 * s'effondre — c'est sa définition, pas un bonus — et il ne profite pas
 * davantage des bonnes années : c'est le prix de l'abri. Une imprenable, elle,
 * prend le vent en pleine figure dans les deux sens, ce qui est précisément ce
 * qui la rend jouable les années de vague.
 */
function seatShelter(stake) {
  const terrain = stake && SEAT_KINDS[stake.seat];
  return terrain && terrain.wind !== undefined ? terrain.wind : 1;
}

function electionBase(electionId, stake) {
  const vent = partyWind() * (PARTY_WEIGHT[electionId] || 0) * seatShelter(stake);
  // Le sortant, plus ce que les traits font gagner ou perdre ICI : un ancrage
  // local vaut sept points dans sa ville et rien du tout à Strasbourg.
  const dice = (stake && stake.defense ? INCUMBENT_EDGE[electionId] || 0 : 0) +
    traitElections(game, electionId);

  if (electionId === "municipales") {
    // UN SCRUTIN DE PERSONNES. On vote pour quelqu'un qu'on croise au marché,
    // et l'étiquette ne pèse presque rien : un maire sortant peut survivre à
    // l'effondrement national de son parti, et cela arrive tout le temps.
    return electionAppeal(electionId) * 0.75 + statScore(game, "reseau") * 2.4 +
      statScore(game, "energie") + vent + dice;
  }
  if (electionId === "europeennes") {
    // LE SCRUTIN LE PLUS NATIONAL DE TOUS. Personne ne connaît les candidats,
    // on vote pour une étiquette et pour sanctionner le gouvernement. La
    // personne du candidat ne fait presque rien, ce qui est bien le problème
    // des européennes.
    return electionAppeal(electionId) * 0.35 + statScore(game, "notoriete") * 0.8 +
      vent + dice;
  }
  if (electionId === "legislatives") {
    // Un scrutin national mais incarné : on est élu sous une couleur, dans une
    // circonscription où l'on a un nom. Un parti qui s'effondre emporte ses
    // députés avec lui, y compris les bons.
    // On envoie à l'Assemblée quelqu'un dont on peut dire qu'il y a sa place.
    return electionAppeal(electionId) * 0.6 + statScore(game, "eloquence") + statScore(game, "reseau") +
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

  // Un président neuf n'a renoncé à rien : le drapeau que pose une fronde
  // réussie ne vaut que pour celui qu'elle visait.
  if (!same) delete game.flags.presidentRenonce;

  // Le tour de l'élection : c'est lui qui dit si la législative qui vient est
  // une confirmation ou une élection ordinaire.
  game.presidentSince = game.turn;

  game.presidentTerms = same ? game.presidentTerms + 1 : 1;
  game.president = who;
  if (who && who.isPlayer) recordCareer(game, { kind: "office", position: "president", party: game.party });

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
    /* ON NE PERD PAS SA COTE PARCE QUE SON CAMP A PERDU LE PAYS. Le moteur
       retirait six points à un ministre dont le gouvernement tombe : il n'a
       rien fait, il n'était même pas candidat, et il vient déjà de rendre son
       ministère avec tout ce qui allait avec. La perte du poste EST la
       sanction ; ce qui reste ne mesure que le fait d'avoir été du dernier
       gouvernement, ce dont l'appareil se souvient un peu et pas plus. */
    bumpStanding(game, -2);
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
    // Une présidentielle se gagne dans le pays : c'est la lecture nationale
    // qui pèse ici, jamais la note de proximité.
    (nationalPopularity(game) - 50) / 55 +
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

/* --------------------------------------------------------------------------
   LE GOUVERNEMENT NE VOUS VOYAIT PAS.
   --------------------------------------------------------------------------
   ensureGovernment() compose le gouvernement dans la liste des figures, et
   le joueur n'y figure pas : on pouvait donc être député du camp au pouvoir,
   le plus populaire du parti, bien coté, et regarder six personnes moins
   connues que soi entrer au gouvernement sans qu'on vous appelle jamais.

   Une seule scène du jeu propose un ministère, et elle était tirée au hasard
   parmi cent vingt autres. Mesuré sur cent cinquante carrières : elle était
   jouable trois cent un tours et n'est sortie que douze fois, et neuf pour
   cent des carrières seulement passaient par un ministère. Ce n'était pas un
   arbitrage de carrière, c'était un ticket de loterie.

   On ne donne pas le poste pour autant : on décroche le téléphone. La scène
   existante est programmée comme une suite, elle arrive donc à coup sûr et
   dans les deux tours, et le joueur garde le droit de refuser.
   -------------------------------------------------------------------------- */

/** La cote minimale en dessous de laquelle l'Élysée ne pense pas à vous. */
const GOVERNMENT_CALL_STANDING = 50;

/**
 * Le joueur est-il plus populaire que le président de son propre camp ?
 * Il faut que ce soit son camp : dépasser le président d'en face n'a rien
 * d'instable, c'est le métier.
 */
function outshinesPresident(s) {
  const state = s || game;
  if (!game.president || game.president.isPlayer) return false;
  if (game.president.party !== state.party) return false;

  // Une figure n'a qu'une popularité, nationale : on la compare à la nôtre
  // lue de la même façon, sinon le joueur double tout le monde d'office.
  const figure = game.rivals.find((r) => r.name === game.president.name);
  return Boolean(figure) && nationalPopularity(state) > figure.popularity;
}

function maybeGovernmentCall() {
  if (rulingParty() !== game.party) return;
  if (!MANDATES.includes(game.position)) return;
  if (game.standing < GOVERNMENT_CALL_STANDING) return;

  // L'offre ne se refait pas : on la refuse une fois pour toutes.
  if (game.seen.entree_gouvernement) return;
  if (pendingChains(game).some((c) => c.id === "entree_gouvernement")) return;

  // ON N'ENTRE PAS AU GOUVERNEMENT PARCE QU'ON EST BON, mais parce qu'on pèse
  // plus que celui qu'on remplacerait. Tant qu'un seul ministre du camp est
  // plus populaire que vous, l'Élysée a de meilleures raisons de ne pas vous
  // appeler ; le jour où vous les dépassez tous, ne pas vous appeler devient
  // la nouvelle qui se commente.
  const gouvernement = game.rivals.filter((r) => r.party === game.party &&
    (r.position === "ministre" || r.position === "premier"));
  if (!gouvernement.length) return;
  if (nationalPopularity(game) <= Math.min(...gouvernement.map((r) => r.popularity))) return;

  scheduleChain(game, "entree_gouvernement");
}

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

    r.age += YEARS_PER_TURN;

    if (Math.random() < 0.125) {
      const keys = Object.keys(r.stats);
      const k = keys[randInt(keys.length)];
      r.stats[k] = Math.max(1, Math.min(9, r.stats[k] + (Math.random() < 0.5 ? -1 : 1)));
    }

    if (Math.random() < 0.15) r.progress++;

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
    r.popularity = clamp100(r.popularity + (target - r.popularity) * 0.105 + (Math.random() - 0.5) * 2.1);

    // Le président en exercice ne quitte pas la scène tant qu'il est en poste.
    if (isPresident(r)) return;

    if (r.age >= RETIRE_AGE && Math.random() < 0.09) return retireFigure(r, "age");
    if (r.popularity <= RETIRE_POPULARITY && Math.random() < 0.06) return retireFigure(r, "popularity");
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
    const playerLeads = key === game.party && leadsParty(game);

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
     "ruling"    le chef du camp qui gouverne — celui avec qui l'on négocie
                 quand on tient les voix qui lui manquent
     "neighbour" le chef du camp le plus proche du vôtre. Une alliance ne se
                 signe pas avec n'importe qui : "leader" tirait au poids, si
                 bien qu'un parti de gauche radicale se voyait proposer un
                 pacte par les identitaires une fois sur six
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
  // LE CHEF DU CAMP QUI GOUVERNE. C'est lui, et personne d'autre, qui vient
  // chercher les voix qui lui manquent : une négociation de majorité ne se
  // tire pas au sort.
  else if (cast === "ruling") {
    const gouverne = rulingParty();
    figure = gouverne && gouverne !== game.party ? leaderOf(gouverne) : null;
    if (!figure) figure = pickByWeight(others.filter((r) => r.position === "chef"));
  }
  // LE VOISIN. Le camp le moins éloigné du vôtre, celui avec qui un accord
  // se raconte sans faire rire personne.
  else if (cast === "neighbour") {
    const voisins = Object.keys(PARTIES)
      .filter((key) => key !== game.party)
      .sort((a, b) => ideologicalDistance(a, game.party) - ideologicalDistance(b, game.party));
    for (const key of voisins) {
      figure = leaderOf(key);
      if (figure) break;
    }
  }
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
const DEFECTION_CHANCE = 0.055;

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
  recordCareer(s, { kind: "party", from, to: key });

  // La direction ne suit jamais : on arrive avec un bureau et un titre
  // d'appareil, pas avec le parti qu'on vient de quitter. Le mandat, lui,
  // suit — on ne démissionne pas de l'Assemblée en changeant de groupe.
  s.partyLead = false;

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
  // Sauf si l'on dirige le parti : on ne raye pas de l'organigramme celui
  // qui préside la maison, si bas soit-il tombé.
  if (game.position === "cadre" && game.standing < CADRE_OUT && !leadsParty(game)) {
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
  game.age += YEARS_PER_TURN;
  const compte = applyBudget(game);
  if (compte && compte.cut) {
    addLog({
      fr: "Faute de trésorerie, vous coupez dans le budget : " + L(BUDGET_DATA.investments[compte.cut].label).toLowerCase() + ".",
      en: "Out of cash, you cut the budget: " + L(BUDGET_DATA.investments[compte.cut].label).toLowerCase() + ".",
    });
  }
  recoverEnergy(game);
  wearOut();
  credibilityDrift(game);
  driftGauges();

  // LE SOMMET, ET PAS SEULEMENT LA FIN. Une carrière qui a été aimée puis
  // oubliée n'a pas été la même qu'une carrière qui n'a jamais été aimée, et
  // l'écran de fin ne pouvait pas faire la différence : il ne lisait que
  // l'état du dernier tour.
  game.peakPopularity = Math.max(game.peakPopularity || 0, Math.round(game.popularity));
  game.peakStanding = Math.max(game.peakStanding || 0, Math.round(game.standing));
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
  maybeGovernmentCall();
  maybeDefection();
  applyTraitTurn(game);

  // LE CORPS PARLE AVANT DE S'ARRÊTER. Il ne termine rien ici : il programme
  // une carte, et ce sont ces cartes-là qui ouvrent les portes de sortie
  // ci-dessous. Voir « LE CORPS PRÉVIENT, ET IL PRÉVIENT SUR UNE CARTE ».
  bodyWarning();

  // LE CORPS DÉCIDE À VOTRE PLACE. Le retrait forcé n'existait qu'à partir de
  // soixante-deux ans : on pouvait donc mener une carrière entière à zéro
  // d'énergie sans que rien n'arrive jamais. L'épuisement a maintenant sa
  // sortie, à tout âge, et il prévient avant.
  if (burnout()) {
    game.ended = { type: "withdrawal" };
    game.card = { kind: "end" };
    return;
  }

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

  // UN SCRUTIN S'ANNONCE. On tombait jusqu'ici directement dans la carte
  // d'élection, avec le nom du scrutin glissé dans la même ligne que le titre
  // d'une scène ordinaire : rien ne disait au joueur qu'il venait de changer
  // de régime, et « Législatives » se lisait comme « Guerre interne ». Une
  // campagne commence donc par une carte d'ouverture qui pose le scrutin, le
  // rapport de force et ce qui se joue pour lui. Elle ne coûte pas un tour :
  // c'est la même saison, en deux temps.
  //
  // SAUF LE CONGRÈS. Il n'a pas de forces en présence à montrer : on n'y
  // interroge pas le pays, et sa propre carte dit déjà tout ce qu'une
  // ouverture dirait. Une fenêtre de présentation tous les quatre ans pour
  // annoncer une réunion de militants, c'est un clic pour rien.
  if (election) {
    if (election.id === "congres") { enterElection(election.id); return; }
    game.card = { kind: "scrutin", id: election.id, resolved: false };
    return;
  }

  game.card = { kind: "event", id: drawEvent().id, resolved: false };
}

/**
 * Le scrutin commence pour de bon. Tout ce qui suit vivait à la fin
 * d'advanceTurn ; c'est le second temps de la même échéance, joué au clic
 * depuis la carte d'ouverture, et le tour n'a pas bougé entre les deux.
 */
function enterElection(electionId) {
  const election = ELECTIONS.find((e) => e.id === electionId) || electionAtTurn(game.turn);
  if (!election) { game.card = { kind: "event", id: drawEvent().id, resolved: false }; return; }

  // La présidentielle où le joueur est candidat devient une campagne de six
  // temps ; toutes les autres échéances restent une carte unique.
  if (election.id === "presidentielle" && playerStake("presidentielle")) {
    startCampaign();
    return;
  }

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

  const refus = stake && nominationBlocked(stake) ? drawNomination(election.id) : null;
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
}

/**
 * Les deux avertissements de la fin de carrière. Chacun ne tombe qu'une fois :
 * ce sont des seuils franchis, pas un bulletin de santé hebdomadaire.
 *
 * Sans eux, le retrait forcé serait un tirage invisible qui coupe la partie
 * sans prévenir. Avec eux, le joueur sait que le temps joue contre lui, et
 * peut décider de forcer maintenant plutôt que d'attendre le mandat suivant.
 */
/* --------------------------------------------------------------------------
   L'ÉPUISEMENT COMME FIN DE CARRIÈRE.
   --------------------------------------------------------------------------
   Une carrière pouvait se jouer entière à zéro d'énergie sans conséquence :
   la statistique était bornée, le retrait forcé ne commençait qu'à
   soixante-deux ans, et forcer ne coûtait donc rien à qui avait le temps.

   La dette de fatigue (voir payEnergy dans js/game-data.js) a désormais un
   terme. Passé un certain seuil, et seulement si l'on est encore à sec, le
   corps s'arrête. Il prévient une fois : on a une saison pour lever le pied,
   et lever le pied suffit vraiment, puisque la dette se résorbe dès qu'on a
   de la marge. Une fin de partie qui tombe sans avertissement est une fin de
   partie qu'on n'a pas jouée.
   -------------------------------------------------------------------------- */

/**
 * LA DETTE DE FATIGUE.
 *
 * On ne s'épuise pas sur une nuit blanche, on s'épuise en enchaînant des
 * années sans marge. Elle monte à chaque saison passée à sec, elle
 * redescend dès qu'on a de quoi souffler, et c'est elle qui fait tomber la
 * marque puis, à la fin, le retrait. Se ménager la fait disparaître : il n'y
 * a rien d'irréversible tant qu'on s'arrête à temps.
 */
const STRAIN_LOW = 3;      // à ce niveau ou en dessous, on creuse
const STRAIN_REST = 7;     // à ce niveau ou au-dessus, on se refait
const STRAIN_STRIKE = 10;  // tous les dix points, le corps envoie un signe

function wearOut() {
  if (game.stats.energie <= STRAIN_LOW) game.strain = (game.strain || 0) + 1;
  else if (game.stats.energie >= STRAIN_REST && game.strain > 0) game.strain -= 1;
  else return;

  const dus = Math.floor(game.strain / STRAIN_STRIKE);
  if (dus <= (game.strainStruck || 0)) {
    game.strainStruck = Math.min(game.strainStruck || 0, dus);
    return;
  }

  game.strainStruck = dus;
  const marque = addStrike(game, "epuise");
  if (!marque) return;

  addLog(marque.kind === "trait"
    ? {
        fr: "Vous vous endormez dans une voiture entre deux rendez-vous et vous ne vous en apercevez qu'en arrivant. Ce n'est pas la première fois, et c'est la première fois que quelqu'un vous le dit.",
        en: "You fall asleep in a car between two meetings and only notice on arrival. It is not the first time, and it is the first time somebody tells you so.",
      }
    : {
        fr: "Vous relisez trois fois la même note sans la comprendre. Vous mettez cela sur le compte de la semaine, comme la semaine dernière.",
        en: "You read the same briefing three times without taking it in. You blame the week, as you did last week.",
      });
}

/* La dette se compte en tours, et un tour vaut désormais une saison : les
   deux seuils sont doublés pour que ce soit toujours le même nombre d'années
   à sec qui casse quelqu'un. La probabilité, elle, est divisée. */
const BURNOUT_STRAIN = 28;
const BURNOUT_ENERGY = 2;
const BURNOUT_CHANCE = 0.07;

/* ==========================================================================
   LE CORPS PRÉVIENT, ET IL PRÉVIENT SUR UNE CARTE
   ==========================================================================
   Une carrière s'arrêtait net. Mesuré sur trois cents parties : un retrait
   forcé sur cinq tombait sans qu'aucune carte n'ait rien annoncé, une mort
   sur six frappait à soixante-dix-huit ans sur quelqu'un que rien n'avait
   jamais fatigué, et le seul avertissement du jeu — deux lignes de journal à
   soixante-deux ans, dans un panneau latéral — pouvait précéder la fin de
   dix ans. Un joueur qui ne peut pas voir venir une fin ne la joue pas, il
   la subit, et une fin qu'on subit sans l'avoir vue venir se lit comme un
   bug même quand elle est juste.

   Le corps parle donc AVANT, et il parle sur une carte, avec des choix. Trois
   fois au plus : un premier signe qu'on peut prendre pour de la fatigue, un
   deuxième qu'on ne peut plus, un troisième après lequel il n'y a plus de
   discussion. Chaque signe est une scène ordinaire — même carte, mêmes
   boutons, même paquet — programmée par le moteur et tirée par dueChain().
   Le joueur peut lever le pied, ce qui coûte de la cote et rend du temps, ou
   forcer, ce qui rapporte et abrège.

   ET LES FINS N'EXISTENT QU'APRÈS. Le retrait forcé et la mort par la santé
   ne sont plus possibles tant que le corps n'a rien dit (voir
   deathProbability et withdrawalProbability dans js/game-data.js), et leur
   probabilité monte avec le nombre de signes déjà donnés.

   UNE SEULE EXCEPTION, ET ELLE EST VOULUE : l'accident. Il ne prévient
   jamais, il est rare, il ne monte presque pas avec l'âge, et il a sa propre
   fin dans js/endings.data.js. C'est ce qui reste d'imprévisible quand tout
   le reste est annoncé.
   ========================================================================== */

/** Au-delà, le corps n'a plus rien à ajouter. */
const DECLINE_MAX = 3;

/** À partir de ce niveau de dette de fatigue, le corps commence à parler. */
const STRAIN_TALKS = BURNOUT_STRAIN / 2;

/**
 * La probabilité, PAR AN, qu'un signe tombe. Elle vaut à peu près trois fois
 * ce que vaut la fin correspondante : c'est ce rapport-là qui fait qu'on est
 * prévenu avant, et il n'y a pas d'autre réglage derrière.
 */
function declineRate(s) {
  let p = 0;

  // L'âge, à partir de cinquante-cinq ans.
  if (s.age >= 55) p += (s.age - 55) * 0.022;

  // Le corps qui s'abîme, déclaré ou visible.
  p += HEALTH_TRAITS.filter((id) => hasTrait(s, id)).length * 0.10;
  if (s.flags.frailHealth) p += 0.12;

  // L'épuisement, seul chemin ouvert avant l'âge : c'est ainsi qu'une
  // carrière menée à vide s'annonce, et à trente-cinq ans si nécessaire.
  if (s.stats.energie <= 3) p += 0.16;
  else if (s.stats.energie <= 5) p += 0.06;
  if ((s.strain || 0) >= STRAIN_TALKS) p += 0.12;

  // Une fois qu'il a parlé, il parle plus souvent.
  p *= 1 + (s.decline || 0) * 0.5;

  // Se ménager ne supprime rien, cela espace.
  if (s.flags.carefulHealth) p *= 0.6;

  return p;
}

/**
 * L'ÂGE OÙ LE COMPTE À REBOURS PEUT COMMENCER.
 *
 * Le premier signe est ouvert à tout le monde : une carrière menée à vide
 * s'annonce à trente-cinq ans comme à soixante-dix, et c'est très bien. Les
 * deux suivants, non. Mesuré sur trois cents carrières, le premier réglage
 * faisait parler le corps à cinquante-trois ans en médiane et à trente-trois
 * pour le dixième le plus pressé, si bien qu'un joueur atteignait le dernier
 * temps avant même d'avoir une fonction — et les portes de sortie s'ouvraient
 * avec lui.
 *
 * Passé le premier signe, il faut donc l'âge, ou la rupture. Quelqu'un de
 * jeune qui s'épuise est prévenu ; il ne descend l'escalier que s'il continue
 * jusqu'à ce que la dette de fatigue atteigne le point de rupture, ce qui est
 * exactement ce que raconte le burnout et ce qui doit rester possible.
 */
const DECLINE_AGE = 58;

function declineAllowed(etage) {
  if (etage <= 1) return true;
  return game.age >= DECLINE_AGE || (game.strain || 0) >= BURNOUT_STRAIN;
}

/**
 * Programme le prochain signe. Les scènes vivent dans js/events/declin.data.js
 * comme n'importe quel événement : elles portent un champ "decline" qui dit à
 * quel temps du corps elles appartiennent, un poids nul pour n'être jamais
 * tirées au hasard, et leurs propres conditions — on ne raconte pas la même
 * chose à un homme de quarante ans à bout de forces et à une femme de
 * soixante-quinze qui cherche ses mots.
 */
function scheduleDecline() {
  const etage = (game.decline || 0) + 1;
  if (!declineAllowed(etage)) return false;

  const candidates = EVENTS.filter((ev) =>
    ev.decline === etage && !game.seen[ev.id] &&
    !pendingChains(game).some((entry) => entry.id === ev.id) &&
    eventMatches({ ...ev, id: null }, game));

  if (!candidates.length) return false;

  scheduleChain(game, candidates[randInt(candidates.length)].id);
  return true;
}

/**
 * Le corps parle-t-il ce tour-ci ? Appelée une fois par tour, avant les
 * portes de sortie. Elle ne termine jamais rien : elle programme une carte.
 */
function bodyWarning() {
  if ((game.decline || 0) >= DECLINE_MAX) return;

  // Un signe déjà programmé et pas encore joué : on n'en empile pas deux.
  if (pendingChains(game).some((entry) => EVENTS.some((ev) => ev.id === entry.id && ev.decline))) return;

  // LA DETTE DE FATIGUE PARLE TOUT DE SUITE. Quand elle atteint le seuil de
  // rupture, on ne tire pas : le corps a déjà donné tous les signes qu'il
  // pouvait donner, et le suivant est le dernier.
  const rupture = (game.strain || 0) >= BURNOUT_STRAIN && game.stats.energie <= BURNOUT_ENERGY;

  if (rupture || Math.random() < declineRate(game) * YEARS_PER_TURN) scheduleDecline();
}

/**
 * L'épuisement va-t-il jusqu'au bout ? Il ne le peut plus tant que le corps
 * n'a pas parlé au moins deux fois : on ne s'arrête pas d'un coup, on
 * s'arrête après avoir ignoré ce qu'on avait déjà entendu.
 */
function burnout() {
  if ((game.strain || 0) < BURNOUT_STRAIN) return false;
  if (game.stats.energie > BURNOUT_ENERGY) return false;
  if ((game.decline || 0) < 2) return false;

  return Math.random() < BURNOUT_CHANCE * (game.decline - 1);
}

/**
 * La question de l'âge, qui n'est pas celle du corps : un éditorialiste ne
 * regarde pas un bilan de santé, il compte les années. Elle reste une ligne
 * de journal parce qu'elle ne décide de rien — ce sont les cartes du corps
 * qui ouvrent les portes de sortie.
 */
function warnAboutAge() {
  if (game.age >= 62 && !game.flags.ageWarned) {
    game.flags.ageWarned = true;
    addLog({
      fr: "Un éditorialiste écrit que votre génération a fait son temps. La question de l'âge est posée, et elle ne se refermera plus.",
      en: "A columnist writes that your generation has had its turn. The age question is open now, and it will not close again.",
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
    // Le signe ne compte que quand le joueur le VOIT. Entre le moment où le
    // moteur le programme et celui où la carte tombe, les portes de sortie
    // restent fermées : on n'est pas prévenu par une scène qu'on n'a pas lue.
    if (suite.decline) {
      game.decline = Math.max(game.decline || 0, suite.decline);
      game.declineTurn = game.turn;
      recordCareer(game, { kind: "decline", stage: suite.decline });
    }
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

  // Plus rien de neuf à jouer : la carrière traverse une saison sans
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
  // Sans campagne, l'attente est celle du sondage de la carte de scrutin :
  // le joueur l'a vue, elle l'engage comme si la campagne avait eu lieu.
  const attendu = electionBase(electionId, stake) + LUCK_MEAN - stake.threshold;
  const res = applyOutcome(electionId, stake,
    electionScore(electionId, stake) - stake.threshold, attendu);
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

  // ON NE SE REPRÉSENTE PAS AU CONGRÈS. Ce n'est pas un mandat qui s'achève
  // faute de candidat, c'est une maison qu'on rend à quelqu'un qui était dans
  // la pièce. Le mandat, lui, ne bouge pas : c'est tout l'objet du cumul.
  const scrutin = TARGET_ELECTION[stake.target] || "legislatives";

  if (stake.target === "chef") {
    setPartyLead(game, false);
    spreadElectionImage(scrutin, -3);
    bumpStanding(game, -10);
    const rendue = {
      fr: "Vous ne déposez pas de motion. La direction du parti passe à quelqu'un d'autre sans qu'un seul mandat ait été compté contre vous, ce qui est la façon la plus douce et la plus définitive de perdre une maison.",
      en: "You table no motion. The party leadership goes to somebody else without a single delegate being counted against you, which is the gentlest and most final way to lose a house.",
    };
    addLog(rendue);
    return rendue;
  }

  const partant = game.position;
  setOffice(game, officeAfterDefeat(game));
  // Le pays ne suit pas un retrait : il constate un nom qui manque sur une
  // affiche. Les siens, eux, le remarquent tout de suite.
  spreadElectionImage(scrutin, -6);
  bumpStanding(game, -8);

  const texte = {
    fr: "Vous ne figurez sur aucun bulletin. Votre mandat de {pos_low:" + partant + "} s'achève sans avoir été remis en jeu, et votre successeur s'installe dans votre bureau sans vous citer une fois.",
    en: "Your name is on no ballot. Your term as {pos_low:" + partant + "} simply runs out, and your successor moves into your office without mentioning you once.",
  };
  addLog(texte);
  return texte;
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
  // Le camp du sortant peut gagner sans le sortant : s'il a fait ses deux
  // mandats, c'est quelqu'un d'autre qui prend l'Élysée pour lui.
  const winner = presidentialCandidate(winnerParty);
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
   LE SONDAGE D'UN SCRUTIN
   ==========================================================================
   De quoi la campagne se sert pour montrer où l'on en est, et la carte
   d'élection pour montrer où l'on en serait. Le sondage EST la marge traduite
   en pourcentages : il ne peut donc pas mentir sans que le résultat mente
   aussi. Le déroulé de la campagne, lui, est dans js/game/modes/race.js.
   ========================================================================== */

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
/* `reel` : la marge effectivement sortie des urnes. Sans elle on affiche le
   pronostic, ce qui est exactement ce qu'on veut AVANT le dépouillement et
   exactement ce qu'il ne faut pas après — la carte de résultat montrait le
   sondage de la veille à côté du verdict du soir, si bien qu'on lisait
   « 25 contre 31 » sous le mot « déroute ». Deux tirages, un seul écran. */
function pollFor(electionId, stake, bonus, reel) {
  if (electionId === "congres") return null;

  const marge = reel === undefined
    ? electionBase(electionId, stake) + (bonus || 0) + LUCK_MEAN - stake.threshold
    : reel;

  // Les concurrents sérieux : les partis les mieux placés, sans le vôtre.
  const rivaux = sortedLandscape().filter((key) => key !== game.party).slice(0, 3);
  const poids = rivaux.reduce((sum, key) => sum + game.landscape[key], 0) || 1;

  /* UNE COURSE À ÉGALITÉ DOIT S'AFFICHER À ÉGALITÉ.
     La part du joueur était une fonction absolue de la marge — 31 % pour une
     marge nulle — pendant que les trois rivaux se partageaient le reste. Un
     scrutin joué à pile ou face s'affichait donc 31 contre 28, et une marge
     qui perd une fois sur six s'affichait 36 contre 26 : le joueur lisait une
     avance confortable et perdait sans comprendre, ce qui ressemble à un bug
     parce que c'en était un.
     On fixe donc la part du joueur pour que son AVANCE SUR LE MIEUX PLACÉ
     vaille exactement la marge : à marge nulle, les deux barres sont à la
     même hauteur, et onze points d'avance affichés sont onze points de marge,
     c'est-à-dire une défaite à un peu plus d'un pour cent. Le dé du
     dépouillement n'est pas touché : c'est l'affichage qui mentait. */
  const tete = (game.landscape[rivaux[0]] || 0) / poids;
  const moi = Math.max(5, Math.min(62, (marge * 0.85 + 100 * tete) / (1 + tete)));

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
  // Les seuils suivent le sondage corrigé : « donné gagnant » vaut pour une
  // défaite à deux pour cent, « en avance » pour une sur cinq. Ils étaient
  // calés sur l'ancien affichage, où « en avance » se disait encore pour un
  // scrutin perdu deux fois sur cinq.
  const marge = electionBase(electionId, stake) + (bonus || 0) + LUCK_MEAN - stake.threshold;
  if (marge >= 12) return "race_mood_won";
  if (marge >= 5) return "race_mood_ahead";
  if (marge >= -6) return "race_mood_close";
  return "race_mood_lost";
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

/**
 * LES SIX FAÇONS DE RACONTER UNE SOIRÉE, ET RIEN D'AUTRE.
 *
 * Les paliers ne portent plus que le TEXTE. Ils portaient aussi les chiffres,
 * et cela produisait des marches que rien ne justifiait : un point de marge
 * de plus faisait passer la cote de moins deux à moins six, deux soirées que
 * le joueur lisait à l'identique ne coûtaient pas la même chose, et le palier
 * franchi d'un cheveu décidait de tout.
 */
const ELECTION_OUTCOMES = [
  { min: 12,   key: "large" },
  { min: 0,    key: "win" },
  // Perdu sur le fil : on devient le prochain, et tout le monde le sait.
  { min: -3,   key: "narrow" },
  // Battu, mais avec un score que personne n'attendait.
  { min: -8,   key: "honorable" },
  { min: -18,  key: "loss" },
  { min: -1e9, key: "rout" },
];

function outcomeFor(marge) {
  return ELECTION_OUTCOMES.find((o) => marge >= o.min);
}

/* ==========================================================================
   CE QU'UNE SOIRÉE ÉLECTORALE LAISSE
   ==========================================================================
   Deux colonnes, et elles ne mesurent pas la même chose.

   LA COTE — ce que l'appareil retient. Il compte des sièges et il compare au
   nombre qu'il avait dans la tête. C'est la colonne raide : entre gagner de
   peu et perdre de peu il y a un mandat, et le parti ne fait pas semblant de
   l'ignorer.

   L'IMAGE — ce que la soirée fait à l'opinion qu'on a de vous. Beaucoup plus
   plate, parce qu'un scrutin ordinaire ne fabrique pas une opinion : il la
   confirme.

   Les points d'ancrage sont ceux de l'ancienne table de paliers, pour ne pas
   refaire un équilibrage qui tenait. Ce qui change est qu'on interpole entre
   eux, et qu'on le fait sur DEUX courbes et non une seule : la ligne qui
   sépare la victoire de la défaite est une falaise, pas une pente. Une seule
   table continue aurait rendu six points de cote à une défaite d'un dixième
   de point.
   ========================================================================== */
const OUTCOME_WON = [
  { marge: 30, standing: 10, image: 8 },
  { marge: 12, standing:  9, image: 7 },
  { marge:  0, standing:  7, image: 5 },
];

const OUTCOME_LOST = [
  { marge:  -3, standing:   2, image:   4 },
  { marge:  -8, standing:  -2, image:   1 },
  { marge: -18, standing:  -6, image:  -4 },
  { marge: -35, standing: -12, image: -10 },
];

function interpolateCurve(courbe, x) {
  if (x >= courbe[0].marge) return courbe[0];
  const bas = courbe[courbe.length - 1];
  if (x <= bas.marge) return bas;
  for (let i = 1; i < courbe.length; i++) {
    if (x >= courbe[i].marge) {
      const haut = courbe[i - 1];
      const pied = courbe[i];
      const t = (x - pied.marge) / (haut.marge - pied.marge);
      return {
        standing: pied.standing + (haut.standing - pied.standing) * t,
        image: pied.image + (haut.image - pied.image) * t,
      };
    }
  }
  return bas;
}

/**
 * CE QUE LE SCRUTIN PÈSE, ET QUI LE REGARDE.
 *
 *   image — combien la soirée déplace ce que le pays pense de vous. Un
 *           congrès de parti ne déplace presque rien : personne ne le
 *           regarde, et la direction qu'on y prend se voit toute seule.
 *
 *   echo  — jusqu'où la nouvelle sort de votre camp, et c'est la correction
 *           la plus importante du lot. Le moteur appliquait le résultat aux
 *           six électorats du même montant : un siège européen perdu coûtait
 *           dix-huit points d'opinion À LA GAUCHE RADICALE, qui n'en a rien
 *           su et qui, l'aurait-elle su, ne vous en aurait pas voulu. Une
 *           soirée électorale se joue devant les siens ; les autres
 *           l'apprennent au mieux par le titre du lendemain, et d'autant
 *           moins qu'ils sont loin de vous.
 */
const ELECTION_WEIGHT = {
  municipales:  { image: 1,   echo: 0.15 },  // une ville, et le pays n'en saura rien
  legislatives: { image: 1,   echo: 0.4  },  // une circonscription, un soir national
  europeennes:  { image: 0.8, echo: 0.3  },  // national, et personne ne regarde
  congres:      { image: 0.3, echo: 0.1  },  // une affaire de famille
};

function electionWeight(electionId) {
  return ELECTION_WEIGHT[electionId] || ELECTION_WEIGHT.legislatives;
}

/** Le scrutin d'où vient un poste, quand on n'a que le poste sous la main. */
const TARGET_ELECTION = {
  conseiller: "municipales", maire: "municipales", euro: "europeennes",
  depute: "legislatives", chef: "congres",
};

/**
 * CE QU'UN POSTE PÈSE, LE SOIR OÙ IL SE GAGNE OU SE PERD. Un siège de
 * conseiller municipal se donne à qui le demande ; la direction du parti se
 * compte au mandat près et se raconte pendant vingt ans. Le moteur facturait
 * les deux au même tarif.
 */
const OUTCOME_STAKE = {
  conseiller: 0.5, euro: 0.8, maire: 1, depute: 1.15, chef: 1.2,
};

/**
 * UNE SOIRÉE NE FAIT PAS UNE CARRIÈRE. Trois facteurs qui se multiplient
 * finissent par se rencontrer tous ensemble : un congrès pris à
 * contre-pronostic valait dix-sept points de cote d'un coup, une déroute
 * annoncée gagnante en coûtait vingt-deux. Le garde-fou est asymétrique
 * parce que la politique l'est : on tombe plus vite qu'on ne monte.
 */
const OUTCOME_CAP = { gain: 13, perte: -15 };

/**
 * L'ÉCART ENTRE CE QU'ON VOUS PROMETTAIT ET CE QUE VOUS AVEZ FAIT.
 *
 * C'est la pièce qui manquait, et c'est elle qui rend le reste juste. Le
 * moteur ne jugeait que le score, or personne en politique n'est jugé sur son
 * score : on est jugé sur l'écart entre son score et celui qu'on vous avait
 * annoncé.
 *
 * Perdre la circonscription qu'on vous donnait gagnante est une faute
 * personnelle. Perdre celle que votre camp n'a jamais tenue, un soir où le
 * parti s'effondre partout, n'est pas une faute : c'est une soirée. Le moteur
 * facturait les deux au même tarif, et c'est ainsi qu'un joueur donné perdant
 * dans un rapport de force mauvais sortait d'une défaite avec vingt et un
 * points de cote en moins.
 *
 * ON N'A RIEN À RECALCULER pour cela : le vent du camp, la difficulté du
 * terrain, le sortant d'en face et tout ce qu'on a fait pendant la campagne
 * sont DÉJÀ dans l'attente, puisqu'elle est la marge que le sondage affichait
 * la veille.
 */
function expectationFactor(attendu, won) {
  const promesse = Math.max(-1, Math.min(1, (attendu || 0) / 14));
  return won ? 1 - promesse * 0.25 : 1 + promesse * 0.35;
}

/**
 * LE SCORE QU'ON VOUS COMPTE, À MI-CHEMIN ENTRE CELUI QUE VOUS AVEZ FAIT ET
 * CELUI QU'IL FALLAIT FAIRE.
 *
 * Ni l'un ni l'autre seul ne convient. Le score brut punit celui qu'on a
 * envoyé se battre dans un désert et récompense celui à qui l'on a donné une
 * ville acquise. L'écart brut, lui, rend une déroute à quatre pour cent
 * entièrement gratuite dès lors que personne n'y croyait, ce qui n'est pas
 * vrai non plus : un chiffre pareil se cite pendant des années.
 *
 * On coupe la poire en deux, et le facteur d'attente fait le reste.
 */
const DECEPTION_MIX = 0.5;

function outcomeGap(marge, attendu) {
  return marge - (attendu === undefined ? 0 : attendu) * DECEPTION_MIX;
}

/**
 * L'ATTENTE NE JOUE PAS DANS LE MÊME SENS SUR LES DEUX SIGNES. Une défaite
 * qu'on ne vous pardonne pas doit coûter PLUS et consoler MOINS ; une défaite
 * qu'on attendait doit coûter moins et consoler davantage — c'est le beau
 * score dans le siège où l'on vous avait envoyé mourir. Multiplier
 * bêtement aurait fait d'une défaite honorable en terrain gagné d'avance la
 * meilleure soirée du jeu.
 */
function bySeverity(valeur, attente, won) {
  if (won) return valeur * attente;
  return valeur >= 0 ? valeur / attente : valeur * attente;
}

/**
 * OÙ LA NOUVELLE SE PROPAGE. Les vôtres d'abord et beaucoup, les autres
 * ensuite et d'autant moins qu'ils sont loin de vous.
 */
function spreadElectionImage(electionId, montant) {
  const vu = electionWeight(electionId);
  const total = montant * vu.image;
  if (Math.abs(total) < 0.05) return;
  if (!game.appeal) { bumpPop(game, total); return; }

  Object.keys(PARTIES).forEach((key) => {
    if (key === game.party) {
      // Les vôtres fêtent mieux la bonne nouvelle et encaissent mieux la
      // mauvaise : c'est le filtre partisan, et il joue ici comme ailleurs.
      bumpAppeal(game, key, total * (total >= 0 ? 1.15 : 0.85));
      return;
    }
    bumpAppeal(game, key, total * vu.echo * (1 - ideologicalDistance(key, game.party)));
  });
  syncPopularity(game);
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
   siège, on n'en gagne pas un.

   Le siège ordinaire ne change rien : c'est le jeu tel qu'il était.

   La circonscription imprenable est le pari du jeu. On la perd neuf fois sur
   dix, mais on ne perd QUE l'élection : l'appareil ne fait pas payer une
   défaite là où il n'attendait rien, et personne ne vous reprochera d'avoir
   échoué où les autres refusaient d'aller. Et si elle tombe, elle rapporte
   gros, parce qu'on ne gagne pas ce siège-là sans que le pays l'apprenne.

   LE TERRAIN NE MULTIPLIE RIEN : IL DÉPLACE LE SEUIL, ET IL DÉCIDE DE CE QUE
   LA CIRCONSCRIPTION DOIT AU VENT NATIONAL (voir SEAT_KINDS). Le second
   nombre est le plus important des deux, et il manquait : un terrain qui ne
   pesait que neuf ou onze points sur une marge que le rapport de force et le
   dé déplacent de trente ne changeait pas la nature du pari, il l'inclinait à
   peine. Un bastion se gagnait cinquante-quatre fois sur cent quand la carte
   promettait « gagné d'avance ».

   Il n'a en revanche jamais eu besoin de coefficients sur le résultat. Il en
   portait deux (gain, perte) : depuis que la soirée se facture à l'écart au
   pronostic, ils disaient la même chose deux fois — un bastion abaisse le
   seuil, donc le sondage vous donne gagnant, donc la victoire vaut moins,
   sans qu'on ait à l'écrire — et ils ne faisaient plus que doubler la mise,
   jusqu'à rendre une victoire en bastion moins rentable que de rester chez
   soi.
   ========================================================================== */

/**
 * Applique le résultat et renvoie de quoi le raconter. Le mandat perdu, lui,
 * est traité par l'appelant : c'est la seule chose qui diffère entre une
 * candidature et une défense.
 *
 * `attendu` est la marge que le sondage affichait la veille. Les deux chemins
 * qui mènent ici la connaissent — avec campagne ou sans — et c'est elle qui
 * décide de la sévérité. LE TEXTE, LUI, SUIT LE SCORE : on ne raconte pas une
 * déroute comme une défaite honorable sous prétexte que personne n'y croyait,
 * on la raconte comme une déroute et on ne la facture pas.
 */
function applyOutcome(electionId, stake, marge, attendu) {
  const out = outcomeFor(marge);
  const won = marge >= 0;

  const attente = expectationFactor(attendu, won);
  const courbe = interpolateCurve(won ? OUTCOME_WON : OUTCOME_LOST,
                                  outcomeGap(marge, attendu));

  /* UNE DÉFENSE PERDUE COÛTE LE MANDAT, ET C'EST DÉJÀ L'ESSENTIEL.
     Le moteur y ajoutait un forfait : chaque effet négatif multiplié par 1,4
     PUIS diminué de quatre points, jauge par jauge. Une déroute en défense
     valait donc moins vingt et un de cote, moins dix-huit d'opinion et moins
     cinq de réputation — pour une réputation dont l'effet nominal était moins
     un. Et les consolations d'une défaite honorable étaient mises à zéro : le
     texte promettait au battu de trois cents voix qu'il partait favori du
     prochain pendant que les chiffres ne lui laissaient rien.
     L'appareil en veut un peu plus à qui perd ce qu'il avait ; il ne le
     fusille pas, et il n'a pas besoin de le faire, puisque le siège est
     perdu et que tout ce qui en découlait l'est avec. */
  const dur = !won && stake.defense;
  const defense = (valeur) => valeur * (valeur >= 0 ? (dur ? 0.5 : 1) : (dur ? 1.15 : 1));

  const enjeu = OUTCOME_STAKE[stake.target] || 1;
  const cote = defense(bySeverity(courbe.standing, attente, won)) * enjeu;
  // L'enjeu pèse moins sur l'image que sur la cote : le pays ne distingue pas
  // un siège de conseiller d'une tête de liste aussi bien que l'appareil.
  const image = defense(bySeverity(courbe.image, attente, won)) * ((1 + enjeu) / 2);

  const dCote = Math.round(Math.max(OUTCOME_CAP.perte, Math.min(OUTCOME_CAP.gain, cote)));
  if (dCote) bumpStanding(game, dCote);
  spreadElectionImage(electionId, image);

  // LA NOTORIÉTÉ SE GAGNE À ÊTRE VU, PAS À GAGNER. Une belle défaite fait
  // parler autant qu'une victoire courte, une déroute ne fait parler de rien,
  // et un congrès ne fait connaître personne : la direction qu'on y prend
  // s'en charge toute seule (LEAD_EXPOSURE).
  const vu = electionWeight(electionId);
  if (vu.image >= 0.5) {
    const nom = marge >= 12 ? 2 : marge >= -8 ? 1 : 0;
    if (nom) bump(game, "notoriete", nom);
  }

  // On ne perd pas sa réputation en perdant une élection. On la perd en
  // faisant un score dont on se souviendra, et seulement là où le pays
  // regardait.
  if (out.key === "rout" && vu.image >= 0.8) bump(game, "reputation", -1);

  // LE CONGRÈS NE DONNE PAS UNE FONCTION, IL DONNE UNE MAISON. Gagner ne
  // prend pas votre siège, perdre ne vous en rend pas un : seul le titre
  // change de main, et le mandat continue comme si de rien n'était.
  if (stake.target === "chef") setPartyLead(game, won);
  else if (!won && stake.defense) setOffice(game, officeAfterDefeat(game));
  else if (won) setOffice(game, stake.target);

  recordCareer(game, { kind: "election", id: electionId, key: out.key, won,
                       target: stake.target, defense: Boolean(stake.defense) });

  return { won, key: out.key, defense: Boolean(stake.defense), target: stake.target,
           marge, attendu: attendu === undefined ? 0 : attendu };
}

/**
 * Ce que dit la soirée électorale. Le mandat éventuellement perdu est nommé
 * par l'appelant : ici on ne raconte que le score.
 */
function outcomeText(res) {
  // Un congrès ne se raconte pas comme une élection : on n'y devient pas
  // « député », on y prend une maison, et l'on garde par ailleurs ce qu'on
  // avait déjà.
  if (res.target === "chef") return leadershipText(res);

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
 * LA SOIRÉE D'UN CONGRÈS.
 *
 * Elle ne ressemble à aucune élection du jeu : le pays n'y est pas, on y
 * compte des mandats de fédération dans une salle où tout le monde se
 * connaît, et le perdant reste dans la pièce. On dit donc aussi, chaque
 * fois, ce que le mandat devient — c'est-à-dire rien, et c'est précisément
 * l'information qui manquait.
 */
function leadershipText(res) {
  const mandat = MANDATES.includes(game.position) ? "{pos_low:" + game.position + "}" : null;
  const garde = mandat
    ? { fr: " Vous restez " + mandat + " : on ne rend pas une circonscription pour un bureau au siège.",
        en: " You remain " + mandat + ": nobody gives up a constituency for a desk at headquarters." }
    : { fr: "", en: "" };

  if (res.won) {
    const base = res.key === "large"
      ? { fr: "Vous prenez la direction du parti dès le premier tour, et le score est tel que personne ne réclamera de second congrès.",
          en: "You take the party leadership in the first round, by a margin wide enough that nobody will call for a second congress." }
      : res.defense
        ? { fr: "Vous gardez la maison. On vous a compté, on vous a pesé, et vous êtes toujours là le lundi matin.",
            en: "You keep the house. They counted you, they weighed you, and you are still there on Monday morning." }
        : { fr: "Vous prenez la direction du parti. Les mêmes qui vous combattaient vendredi vous applaudissent dimanche, et vous vous en souviendrez.",
            en: "You take over the party. The people who fought you on Friday applaud you on Sunday, and you will remember it." };
    return { fr: base.fr + garde.fr, en: base.en + garde.en };
  }

  const base = res.key === "narrow"
    ? (res.defense
        ? { fr: "Vous perdez la maison de quelques dizaines de mandats. Un écart pareil ne se referme pas : il fait de vous un recours permanent, ce qui est une place inconfortable et une place tout de même.",
            en: "You lose the house by a few dozen delegates. A gap like that does not close: it makes you a permanent alternative, which is an uncomfortable place and a place all the same." }
        : { fr: "Il vous manque quelques dizaines de mandats. Le soir même, tout le monde sait que vous reviendrez, à commencer par celui qui vient de vous battre.",
            en: "You are a few dozen delegates short. That evening everyone knows you will be back, starting with the person who just beat you." })
    : res.key === "honorable"
      ? { fr: "Vous n'avez pas la maison, mais vous avez un courant, un nom sur une motion et des gens qui vous doivent quelque chose. C'est avec cela qu'on revient.",
          en: "You do not have the house, but you have a faction, a name on a motion and people who owe you something. That is what you come back with." }
      : res.defense
        ? { fr: "Le congrès vous désavoue. On vous laisse parler douze minutes, on applaudit poliment, et quelqu'un d'autre est annoncé.",
            en: "The congress disowns you. They let you speak for twelve minutes, applaud politely, and announce somebody else." }
        : { fr: "Le congrès ne veut pas de vous. Ce n'est pas le pays qui vous a dit non, c'est votre propre camp, et cela se répare beaucoup moins vite.",
            en: "The congress does not want you. It is not the country that said no, it is your own side, and that takes far longer to repair." };
  return { fr: base.fr + garde.fr, en: base.en + garde.en };
}

/* ---------- Le calendrier, au-dessus de la carte ---------- */

/* ==========================================================================
   Rendu — carte de droite
   ========================================================================== */

/* ---------- Les traits, en clair ---------- */

/*
 * Les élections ne passent pas par applyEffects : elles bougent les jauges
 * elles-mêmes. On photographie donc l'état avant, et on compare après, pour
 * que le joueur lise les conséquences d'un scrutin comme celles d'un choix.
 */
function snapshot(s) {
  return { popularity: s.popularity, standing: s.standing, money: s.money,
           partyLead: Boolean(s.partyLead),
           appeal: s.appeal ? { ...s.appeal } : null,
           stats: { ...s.stats } };
}

/* ---------- Pourquoi une option est ouverte, et ce qu'elle risque ---------- */

function renderCard() {
  // La page prend la couleur du moment qu'elle affiche, ou la reprend à son
  // camp. Voir « LES TEMPS FORTS NE SONT PAS DES CARTES » (carte.js).
  renderCardBody();
  syncMomentTone(document.getElementById("event-area"));
}

function renderCardBody() {
  const host = document.getElementById("event-area");
  const card = game.card;

  // Les temps forts qui s'affichent MÊME PARTIE FINIE : le dépouillement
  // d'une présidentielle gagnée arrive après que game.ended a été posé, et on
  // veut voir le résultat du vote avant l'écran de fin.
  const fini = modeFor(card);
  if (fini && fini.renderWhenEnded) { fini.render(host, card); return; }

  // Une carte déjà résolue s'affiche même si la partie vient de se
  // terminer : on veut lire ce qui s'est passé avant l'écran de fin.
  const showingResult = card && card.resolved && card.resultText;

  // Une partie qui n'a ni carte ni fin n'est pas finie : elle est entre deux
  // tours. Le moteur affichait quand même l'écran de fin, qui lit le type de
  // la fin et plantait sur une page blanche. On tire la carte suivante.
  if (!showingResult && !card && !game.ended) {
    advanceTurn();
    saveGame();
    renderCardBody();
    return;
  }

  if (!showingResult && (!card || game.ended)) { renderEnd(host); return; }

  // LE REGISTRE DES TEMPS FORTS (js/game/registry.js). Un mode inscrit pour
  // ce type de carte la dessine lui-même ; sinon on retombe sur les branches
  // du moteur, ci-dessous.
  const mode = modeFor(card);
  if (mode) { mode.render(host, card); return; }

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

  // Une investiture refusée se joue comme un événement ordinaire, avec ses
  // choix, mais sous l'étiquette de l'élection qui l'a provoquée.
  // Les temps d'une campagne ordinaire, puis le dépouillement.
  // Une carte qui ne fait que raconter un résultat, sans scène derrière.
  if (card.kind === "info") {
    host.innerHTML =
      '<div class="event-card event-card-election">' +
        (card.tagKey === "elec_presidentielle"
          ? electionBanner("presidentielle") + '<p class="event-tag">' + cardHeader() + "</p>"
          : '<p class="event-tag">' + t(card.tagKey) + " · " + cardHeader() + "</p>") +
        '<p class="event-text event-result">' + card.resultText + "</p>" +
        changesHTML(card.resultChanges) + continueButton("data-continue") +
      "</div>";
    return;
  }

}

/* ---------- Rendu de la campagne ---------- */

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

  // Les boutons qui répondent ENCORE une fois la partie terminée. Ils
  // passent donc avant la garde ci-dessous, qui gèle tout le reste.
  const apres = modeClick(game.card, target, true);
  if (apres) { apres(target); return; }

  if (game.ended && !target.hasAttribute("data-continue")) return;

  // Ce que le mode affiché sait faire de ce bouton. S'il ne le connaît pas,
  // le clic redescend vers les branches génériques du moteur.
  const action = modeClick(game.card, target, false);
  if (action) { action(target); return; }

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
    // Une sauvegarde d'avant la dette de fatigue part sans dette : on ne
    // facture pas rétroactivement ce qui était gratuit quand ça a été joué.
    // Une sauvegarde d'avant les six électorats n'a qu'un nombre : on le
    // répartit tel quel, uniformément. On ne lui invente pas un passé de
    // clivages qu'elle n'a pas vécus.
    if (!game.appeal) {
      game.appeal = {};
      Object.keys(PARTIES).forEach((key) => { game.appeal[key] = game.popularity; });
    }
    if (game.strain === undefined) game.strain = 0;
    if (game.strainStruck === undefined) game.strainStruck = 0;

    // LE CUMUL. Les parties commencées quand la direction du parti était une
    // marche de l'échelle ont un joueur dont la fonction VAUT « chef » et qui
    // n'a donc plus de mandat du tout. On leur rend le titre dans son champ à
    // part et on les repose au siège, qui est l'endroit d'où ils dirigeaient
    // en réalité : on ne leur invente pas une circonscription qu'ils n'ont
    // jamais gagnée.
    if (game.partyLead === undefined) game.partyLead = false;
    if (game.position === "chef") { game.partyLead = true; game.position = "cadre"; }
    if (game.peakLead === undefined) game.peakLead = Boolean(game.partyLead);
    if (!LADDER.includes(game.peakPosition)) {
      game.peakLead = true;
      game.peakPosition =
        LADDER.indexOf(game.position) > LADDER.indexOf("cadre") ? game.position : "cadre";
    }

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
        game.pending.push({ id: game.pendingChain, turn: game.turn, expires: game.turn + CHAIN_PATIENCE });
      }
      delete game.pendingChain;
    }
    if (game.campaign && !game.campaign.used) game.campaign.used = [];
    // Une sauvegarde prise au milieu d'une présidentielle qu'on ne dispute
    // pas n'a pas de sondage : elle en avait un invisible, qui ne se
    // rattachait à rien. On lui en compose un depuis le paysage du moment
    // plutôt que de la faire planter, et le compteur d'avant est perdu.
    if (game.support && !game.support.field) {
      game.support.field = supportField();
      game.support.result = game.support.result || null;
      delete game.support.bonus;
    }
    // La part de départ du camp est arrivée avec le jugement à l'écart : une
    // campagne sauvegardée avant elle repart de la part du jour, ce qui vaut
    // progression nulle plutôt qu'un écart inventé.
    if (game.support && game.support.baseShare === undefined) {
      const sien = (game.support.field || []).find((c) => c.mine);
      game.support.baseShare = sien ? sien.share : game.landscape[game.party];
    }

    // Le paysage politique et les figures nommées sont arrivés après : une
    // partie plus ancienne se les voit reconstruire au chargement.
    // Une sauvegarde d'avant le socle vivant n'en a pas : on le pose sur ce
    // que les partis valent aujourd'hui, pas sur ce qu'ils valaient en
    // théorie. Le pays de cette partie-là est déjà ce qu'il est.
    if (!game.baseline) {
      game.baseline = {};
      Object.keys(PARTIES).forEach((key) => {
        game.baseline[key] = Math.max(3, (game.landscape && game.landscape[key]) || (28 - PARTIES[key].difficulty * 5));
      });
    }
    if (!game.landscape) game.landscape = initialLandscape(game);
    if (!game.landscapeBefore) game.landscapeBefore = { ...game.landscape };
    if (game.alliance === undefined) game.alliance = null;
    if (game.scene === undefined) game.scene = null;
    // Une sauvegarde d'avant l'arc de fin de carrière n'a pas de compteur.
    // On ne le devine pas : une santé déjà déclarée fragile vaut un signe,
    // le reste part de zéro et le corps parlera quand il parlera.
    if (game.decline === undefined) {
      game.decline = game.flags && game.flags.frailHealth ? 1 : 0;
      game.declineTurn = game.decline ? game.turn : null;
    }
    // Une sauvegarde d'avant la frise n'a rien à raconter : on ne reconstruit
    // pas un passé qu'on n'a pas vécu, on ouvre la frise sur la fonction du
    // moment et la suite s'écrira.
    if (!game.startShares) game.startShares = { ...game.landscape };
    if (!game.career) {
      game.career = [{ turn: game.turn, age: Math.floor(game.age), kind: "office",
                       position: game.position, party: game.party }];
    }
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
