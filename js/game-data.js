/*
 * President Material — données de la boucle de jeu (game.html).
 *
 * Ce fichier contient tout ce qui se règle : l'échelle de carrière, le
 * calendrier électoral, les deux jauges de carrière, la fin de carrière
 * (fatigue, retrait forcé, mortalité) et surtout les ÉVÉNEMENTS. Le
 * moteur est dans js/game.js.
 *
 * Les textes des événements vivent ici, à côté de leurs effets : un
 * événement est un tout. Chaque texte est un objet { fr, en } lu par L().
 */

/* ==========================================================================
   Constantes de carrière
   ========================================================================== */

/** Tout le monde entre en politique à trente ans. Un tour = six mois. */
const START_AGE = 30;

/**
 * L'échelle des fonctions, du bas vers le haut. La présidence est la fin.
 *
 * ON N'OCCUPE QU'UNE FONCTION À LA FOIS. Le cumul des mandats n'existe pas
 * ici : un maire élu député quitte la mairie le soir même, et il ne la
 * retrouve pas s'il est battu six ans plus tard. C'est la règle qui donne
 * son prix à chaque marche : monter, c'est lâcher ce qu'on tenait.
 *
 * Trois d'entre elles ne s'obtiennent pas comme les autres :
 *
 *   CADRE     le parti, sans le pays. Un poste d'appareil : secrétaire
 *             national, patron de fédération. Ce n'est pas un mandat, cela
 *             ne s'élit pas devant les électeurs, et c'est là qu'atterrissent
 *             ceux qui ont perdu le leur sans avoir tout perdu.
 *   EURO      le Parlement européen. On y entre par une liste que l'appareil
 *             compose, et l'appareil y met volontiers ceux dont il veut la
 *             place. C'est un vrai mandat, bien payé et très exposé à
 *             Bruxelles, c'est-à-dire nulle part pour un électeur français.
 *   MINISTRE  un ministère ne s'élit pas, il se donne, et seulement quand
 *             votre camp gouverne. Il tombe le jour où le camp perd, ce qui
 *             fait de la meilleure fonction du jeu la plus fragile.
 *   PREMIER   Matignon. La plus haute marche avant l'Élysée, et la seule
 *             qu'on doive à un seul homme : le président nomme, le président
 *             révoque. On y arrive par deux chemins — son propre camp qui
 *             gouverne et qui vous doit quelque chose, ou un camp voisin qui
 *             a besoin de vos voix et vous achète avec Matignon. On en
 *             ressort fusible, ou présidentiable, et parfois les deux.
 *
 * LA DIRECTION DU PARTI N'EST PLUS DANS CETTE LISTE. Elle y était, coincée
 * entre ministre et Premier ministre, et le moteur en tirait la seule
 * conclusion qu'il pouvait : prendre le parti, c'était rendre son mandat. Le
 * joueur élu à la tête de son camp se réveillait donc sans siège, sans mairie
 * et sans ministère, et les scènes de député cessaient de sortir. Or il n'y a
 * pas un chef de parti en France qui ne soit pas aussi député, maire, ou les
 * deux : c'est même l'inverse, la direction se prend PARCE QU'on a une base
 * quelque part. Voir LA DIRECTION DU PARTI, plus bas.
 */
const LADDER = ["militant", "cadre", "conseiller", "maire", "euro", "depute", "ministre", "premier"];

/**
 * OÙ L'ON TOMBE QUAND ON PERD.
 *
 * Nulle part, et c'est tout le problème. Le moteur faisait reculer d'un cran
 * dans l'échelle : un député battu redevenait maire d'une ville qu'il avait
 * quittée pour se présenter, et un chef de parti désavoué se réveillait
 * député sans avoir été élu nulle part. Le jeu inventait des mandats.
 *
 * Un mandat perdu est perdu. Reste ce que le parti veut bien vous garder :
 * un poste d'appareil si vous pesez encore, la carte de militant sinon. On
 * ne reprend une fonction qu'en la regagnant dans les urnes.
 */
const NO_OFFICE_STANDING = 30;

function officeAfterDefeat(s) {
  // Diriger le parti EST un poste d'appareil : on ne redevient pas simple
  // militant d'un parti qu'on préside. Perdre son mandat quand on tient la
  // maison, c'est retomber au siège, jamais plus bas.
  if (leadsParty(s)) return "cadre";
  return s.standing >= NO_OFFICE_STANDING ? "cadre" : "militant";
}

/* ==========================================================================
   LA DIRECTION DU PARTI
   ==========================================================================
   Elle ne s'occupe pas, elle se porte. C'est un TITRE QUI SE CUMULE avec la
   fonction, et c'est la seule chose du jeu qui se cumule — précisément parce
   que c'est la seule qui se cumule dans la vraie vie. On ne quitte pas
   l'Assemblée en prenant son parti ; on prend son parti parce qu'on tient
   l'Assemblée, ou une ville, ou un ministère.

   Elle vit donc dans un champ à part, `game.partyLead`, et le sommet atteint
   dans la carrière la retient dans `game.peakLead` : une carrière qui a
   dirigé un parti l'a dirigé, même si elle s'achève sans mandat.

   CE QU'ELLE APPORTE. Trois choses, et elles s'ajoutent à ce que la fonction
   donne déjà :
     l'EXPOSITION   on parle de vous chaque dimanche matin, quel que soit
                    votre mandat. C'est ce que la fonction seule ne donnait
                    pas à un maire de préfecture.
     le RANG        vous ne demandez plus l'investiture, vous la signez. Mais
                    un chef sans mandat pèse moins qu'un chef qui en a un :
                    le rang s'additionne, il ne remplace rien.
     la STATURE     la direction d'un parti vaut à elle seule ce qu'un
                    ministère vaut : on vous imagine dans le fauteuil.

   Les trois chiffres reprennent ceux que la fonction « chef » avait quand
   elle occupait une marche de l'échelle (22 d'exposition, 7 de rang, 15 de
   stature), diminués de ce qu'un élu ordinaire a déjà : c'est le cumul qui
   comble la différence, et non un cadeau.
   ========================================================================== */

const LEAD_EXPOSURE = 12;
const LEAD_RANK = 4;

/** Le joueur dirige-t-il son parti ? */
function leadsParty(s) {
  return Boolean(s && s.partyLead);
}

/* Les indemnités, le train de vie et les postes de dépense sont dans
   js/budget.data.js. */

/**
 * Calendrier électoral, en tours (2 tours = 1 an).
 * Une élection a lieu quand (tour % cycle) === offset.
 */
/*
 * LE CALENDRIER. Un tour vaut six mois, et le "offset" est le tour du cycle
 * où le scrutin tombe.
 *
 * LES LÉGISLATIVES SUIVENT LA PRÉSIDENTIELLE. Elles tombaient trois ans
 * après, ce qui est le calendrier d'avant 2002. Depuis l'inversion, on vote
 * pour l'Assemblée cinq semaines après avoir élu le président, précisément
 * pour lui donner une majorité, et c'est ce qui fait qu'une présidentielle
 * gagnée vaut deux victoires et qu'une perdue en coûte deux.
 *
 * Le moteur ne tient qu'un scrutin par tour, et cette contrainte-là est
 * voulue : elle interdit d'en télescoper deux. Elle impose en revanche une
 * discipline de parité qu'il faut connaître avant de toucher à ce tableau.
 * Deux scrutins de cycles 10 et 12 se rencontrent si et seulement si leurs
 * offsets ont la même parité ; ceux de cycles 10 et 8 aussi ; ceux de 12 et
 * 8 si leurs offsets sont égaux modulo 4. D'où la règle : les trois scrutins
 * nationaux tombent sur des tours PAIRS, c'est-à-dire au printemps comme en
 * France, et les municipales et le congrès sur des tours IMPAIRS.
 *
 * Présidentielle et législatives partagent donc forcément la même parité, et
 * l'écart le plus court que le moteur autorise entre elles est d'un an. Cinq
 * semaines n'est pas représentable ; un an l'est, et c'est trois fois plus
 * proche de la réalité que les trois ans d'avant.
 *
 * Les européennes suivent la même logique : deux ans après la présidentielle,
 * comme 2022 et 2024, et non quatre. Le cycle est donc chargé au début et
 * calme ensuite, exactement comme le vrai calendrier français, où l'on vote
 * trois fois en deux ans puis presque plus pendant trois. On ne lisse pas un
 * calendrier pour faire joli : c'est cette respiration-là qui fait qu'une
 * carrière se joue par à-coups.
 */
const ELECTIONS = [
  { id: "presidentielle", cycle: 10, offset: 0 },
  { id: "legislatives", cycle: 10, offset: 2 },
  { id: "congres", cycle: 8, offset: 3 },
  { id: "municipales", cycle: 12, offset: 1 },
  { id: "europeennes", cycle: 10, offset: 4 },
];

/* ==========================================================================
   Les deux jauges de carrière (0 à 100)
   ==========================================================================
   Elles n'existent qu'une fois la partie lancée, et ce sont elles qui
   commandent la progression :

     POPULARITÉ    — ce que le pays pense de vous. Elle fait gagner les
                     élections au suffrage universel.
     COTE AU PARTI — ce que l'appareil pense de vous. Sans elle, pas
                     d'investiture : on ne vous laisse pas concourir.

   Deux forces les font bouger. Chaque tour elles glissent lentement vers
   une cible calculée depuis les statistiques : c'est le fond de votre
   dossier, il met du temps à peser. Et chaque choix d'événement leur
   donne un à-coup immédiat, souvent en sens inverse l'une de l'autre :
   plaire à l'appareil coûte au pays, et réciproquement.
   ========================================================================== */

/** Vitesse de convergence vers la cible, par tour. */
const DRIFT = 0.28;

/**
 * ON REDESCEND MOINS VITE QU'ON NE MONTE.
 *
 * Le retour vers la cible se faisait à la même vitesse dans les deux sens :
 * une jauge portée trente points au-dessus de son niveau naturel en perdait
 * huit au tour suivant, sans que rien ne l'annonce ni ne l'explique. Ce
 * qu'on a gagné doit s'user, pas fondre — sinon aucun coup d'éclat ne vaut
 * la peine et le joueur a le sentiment de vider un seau percé.
 */
const DRIFT_DOWN = 0.17;

/**
 * Exposition publique liée à la fonction : un maire est plus vu qu'un
 * militant. Le député européen est l'exception qui dit tout : le mandat est
 * important, la fonction est invisible, et c'est bien pour cela qu'on y
 * envoie les gens dont on veut se débarrasser.
 */
/* La clé "chef" sert encore : les figures du jeu, elles, n'ont qu'une case et
   la direction de leur parti EST leur fonction. Le joueur, lui, passe par
   exposureOf() et rankOf(), qui savent additionner. */
const POSITION_EXPOSURE = {
  militant: 0, cadre: 3, conseiller: 4, maire: 10, euro: 8, depute: 14,
  ministre: 28, chef: 22, premier: 40,
};

/** Poids interne de la fonction dans l'appareil du parti. */
const POSITION_RANK = {
  militant: 0, cadre: 2, conseiller: 1, maire: 3, euro: 2, depute: 4,
  ministre: 5, chef: 7, premier: 6,
};

/** Ce que le joueur expose : sa fonction, plus la direction s'il l'a. */
function exposureOf(s) {
  return (POSITION_EXPOSURE[s.position] || 0) + (leadsParty(s) ? LEAD_EXPOSURE : 0);
}

/** Ce que le joueur pèse dans l'appareil : sa fonction, plus la direction. */
function rankOf(s) {
  return (POSITION_RANK[s.position] || 0) + (leadsParty(s) ? LEAD_RANK : 0);
}

function clamp100(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Cible de popularité : notoriété d'abord, réputation et charisme ensuite.
 * Les coefficients sont calibrés pour qu'un profil parfait plafonne autour de
 * 65 et non à 100. C'est volontaire : les statistiques seules ne mènent jamais
 * au sommet, elles ne font que fixer le niveau de la mer. Les vingt derniers
 * points se prennent événement par événement, et ne tiennent que si l'on
 * continue à les défendre.
 */
function popularityTarget(s) {
  return clamp100(
    2 + statScore(s, "notoriete") * 2.6 + statScore(s, "reputation") * 1.2 +
    statScore(s, "charisme") * 1.0 + statScore(s, "credibilite") * 0.35 +
    exposureOf(s) * 0.7 +
    // Un ministre porte le bilan d'un gouvernement qu'il n'a pas choisi. La
    // fonction fait connaître, elle ne fait pas aimer.
    (s.position === "ministre" ? -8 : 0) +
    // Le Premier ministre est le fusible : il porte tout ce que le pays
    // reproche au gouvernement, et le président garde ce qui marche.
    (s.position === "premier" ? -12 : 0) +
    traitTarget(s, "popularity")
  );
}

/** Cible de cote interne : réseau, compatibilité avec le parti, rang occupé. */
function standingTarget(s) {
  const fit = computeFit(s.party, s.character);
  return clamp100(
    // L'appareil compte ses obligés, mais il regarde aussi s'il peut vous
    // présenter sans avoir honte : une direction n'investit pas quelqu'un
    // dont personne n'imagine le nom sur une affiche nationale.
    9 + statScore(s, "reseau") * 2.2 + statScore(s, "credibilite") * 1.1 +
    fit * 2.5 + rankOf(s) * 3.2 +
    (s.flags.dirtyMoney ? -8 : 0) +
    traitTarget(s, "standing")
  );
}

/**
 * Cote minimale exigée par le parti pour vous investir. En dessous, on ne
 * vous laisse pas concourir : il faut d'abord travailler l'appareil.
 *
 * La direction du parti et l'investiture présidentielle sont les deux verrous
 * qui comptent : on ne devient pas candidat à l'Élysée parce qu'on est aimé
 * du pays, mais parce que l'appareil n'a pas trouvé mieux.
 */
const NOMINATION_THRESHOLD = {
  conseiller: 22,
  maire: 36,
  euro: 30,
  depute: 48,
  chef: 71,
  president: 64,
};

/**
 * LA PRIME AU SORTANT. On ne réinvestit pas un sortant comme on investit un
 * inconnu : il a le fichier, les militants et six ans de photos avec eux, et
 * lui refuser l'investiture c'est reconnaître qu'on s'est trompé la dernière
 * fois. L'appareil ne le fait que lorsqu'il n'a plus le choix.
 *
 * Elle ne vaut que pour les mandats. La direction du parti n'a pas de
 * sortant : c'est justement le poste qu'on prend à quelqu'un.
 */
const INCUMBENT_DISCOUNT = 12;

/**
 * Mortalité : aucune avant 60 ans, puis une probabilité par tour qui
 * grimpe avec l'âge.
 */
/**
 * LE CORPS PRÉVIENT TOUJOURS, SAUF QUAND C'EST UN ACCIDENT.
 *
 * La mort tombait à soixante-trois ans sur un personnage en pleine forme dont
 * rien, nulle part, n'avait annoncé quoi que ce soit. Une carrière ne doit pas
 * s'arrêter sur un tirage muet.
 *
 * Deux morts distinctes, donc. Celle qui vient de la santé n'est possible que
 * si le corps a déjà parlé — santé fragile déclarée, ou l'un des traits qui
 * disent qu'on s'abîme. Et celle qui ne prévient pas, l'accident, reste
 * possible à tout âge parce que c'est ce qu'est un accident : elle est rare,
 * elle ne monte presque pas avec l'âge, et elle a droit à sa propre fin.
 */
const HEALTH_TRAITS = ["fragile", "obese", "use", "declin"];

/** Le corps a-t-il déjà donné signe ? */
function healthWarned(state) {
  if (state.flags.frailHealth) return true;
  return HEALTH_TRAITS.some((id) => hasTrait(state, id));
}

/** L'accident : rare, sourd, et il n'a jamais prévenu personne. */
function accidentProbability(state) {
  return 0.0012 + Math.max(0, state.age - 55) * 0.00012;
}

function deathProbability(state) {
  if (state.age >= 92) return 1;

  let p = accidentProbability(state);

  // La part « santé » ne s'ouvre qu'à ceux dont le corps a déjà parlé.
  if (state.age >= 60 && healthWarned(state)) {
    let sante = (state.age - 60) * 0.004 + 0.003;
    if (state.flags.carefulHealth) sante /= 2;
    if (state.flags.frailHealth) sante *= 1.6;
    p += sante;
  }

  // Passé un certain âge, le corps a parlé pour tout le monde.
  if (state.age >= 78) p += (state.age - 78) * 0.006;

  return p;
}

/**
 * LE RETRAIT FORCÉ.
 *
 * Une carrière ne s'arrête pas toujours sur une victoire, une condamnation ou
 * un cercueil. Elle s'arrête aussi parce qu'un matin le corps ne suit plus,
 * parce qu'un nom ne revient pas devant les caméras, parce que l'entourage
 * organise la sortie avant que le pays ne s'en aperçoive. C'est la fin la
 * plus banale de toutes, et le jeu ne la racontait pas : on jouait jusqu'à
 * quatre-vingt-douze ans en pleine possession de ses moyens.
 *
 * Le risque commence à soixante-deux ans, monte avec l'âge, et l'épuisement
 * l'accélère : une carrière menée à bout de forces se termine plus tôt.
 * Comme pour la mort, la santé surveillée protège et la santé fragile coûte.
 */
function withdrawalProbability(state) {
  if (state.age < 62) return 0;

  let p = (state.age - 62) * 0.003;

  // LA FORME PROTÈGE, ET PAS SEULEMENT L'ÉPUISEMENT QUI ACCABLE.
  //
  // L'énergie n'ajoutait du risque que lorsqu'elle était basse : un homme de
  // soixante-sept ans en pleine forme courait exactement le même risque de
  // base qu'un homme épuisé du même âge, et se voyait pousser dehors sans
  // qu'aucune ligne de sa fiche ne l'explique. On ne pousse pas dehors
  // quelqu'un qui tient debout et que tout le monde voit tenir debout.
  const forme = state.stats.energie;
  if (forme >= 12) p *= 0.3;
  else if (forme >= 8) p *= 0.65;
  else if (forme <= 2) p += 0.02;
  else if (forme <= 5) p += 0.008;

  if (state.flags.carefulHealth) p /= 2;
  if (state.flags.frailHealth) p *= 2;
  return p;
}

/* ==========================================================================
   Traits
   ==========================================================================
   Les statistiques disent ce que vaut le personnage, les traits disent ce
   qu'on lui reproche et ce qu'on lui reconnaît. Ils viennent des choix, ne
   s'usent pas, et pèsent sur toute la suite de la partie : cibles des jauges,
   jets de dés, forme physique, second tour de la présidentielle.

   Leur définition est dans js/traits.data.js.
   ========================================================================== */

function traitsOf(s) {
  return s.traits || (s.traits = []);
}

/**
 * LES ÉCARTS.
 *
 * Une réputation ne se fait pas en une fois. Se dédire une fois est un
 * accident dont personne ne se souvient ; se dédire trois fois est une
 * réputation dont on ne se débarrasse plus. Les événements signalent l'écart,
 * le moteur compte, et la marque tombe quand le compte y est.
 *
 * C'est ce qui empêche une marque donnée par seize événements de finir dans
 * toutes les parties, sans avoir à mentir sur ce que chaque scène raconte.
 */
function strikesOf(s) {
  return s.strikes || (s.strikes = {});
}

function strikesNeeded(id) {
  const def = TRAIT_DATA[id];
  return def && def.strikes ? def.strikes : 1;
}

/**
 * Enregistre un écart. Renvoie ce qu'il faut montrer au joueur : la marque si
 * elle vient de tomber, sinon l'avertissement, pour qu'il la voie venir.
 */
/**
 * CERTAINES MARQUES NE VOUS CONCERNENT PAS.
 *
 * Un trait peut exiger d'appartenir — ou d'avoir appartenu — à certains
 * camps. « Marqué aux extrêmes » n'a aucun sens pour un centriste qui n'a
 * jamais quitté son parti : le pays ne le range pas là, quoi qu'il dise.
 * On regarde le parti actuel ET tous ceux qu'on a traversés, parce qu'une
 * étiquette d'origine ne se décolle jamais tout à fait.
 */
function traitAllowed(s, id) {
  const def = TRAIT_DATA[id];
  if (!def || !def.requiresParty) return true;

  const parcours = partyHistory(s);
  return def.requiresParty.some((key) => parcours.includes(key));
}

/** Tous les partis traversés, le premier compris. */
function partyHistory(s) {
  if (!s.parties) s.parties = [s.party];
  if (!s.parties.includes(s.party)) s.parties.push(s.party);
  return s.parties;
}

function addStrike(s, id) {
  if (hasTrait(s, id)) return null;

  // On ne compte même pas l'écart : la marque ne peut pas tomber, il n'y a
  // donc rien à compter, et le joueur n'a pas à voir un compteur avancer
  // vers un trait qu'il ne prendra jamais.
  if (!traitAllowed(s, id)) return null;

  const count = strikesOf(s)[id] = (strikesOf(s)[id] || 0) + 1;
  const need = strikesNeeded(id);
  if (count < need) return { kind: "strike", key: id, count, need };

  const gained = addTrait(s, id);
  return gained ? { kind: "trait", key: id, gained: true, stats: gained } : null;
}

function hasTrait(s, id) {
  return traitsOf(s).includes(id);
}

/**
 * Ajoute un trait, retire ceux qu'il rend impossibles, et applique ses
 * modificateurs de statistiques. Ces points-là sont acquis : ils se voient
 * sur la fiche et restent jusqu'à la fin de la partie, ou jusqu'à ce que le
 * trait soit levé.
 *
 * Renvoie la liste des statistiques qui ont réellement bougé, pour que
 * l'interface puisse l'afficher au joueur.
 */
function addTrait(s, id) {
  const def = TRAIT_DATA[id];
  if (!def || hasTrait(s, id)) return null;
  if (!traitAllowed(s, id)) return null;

  (def.blocks || []).forEach((other) => removeTrait(s, other));
  traitsOf(s).push(id);
  return applyTraitStats(s, def, 1);
}

/** Retire un trait et reprend ce qu'il avait donné. */
function removeTrait(s, id) {
  const list = traitsOf(s);
  const at = list.indexOf(id);
  if (at < 0) return null;

  list.splice(at, 1);
  return applyTraitStats(s, TRAIT_DATA[id], -1);
}

function applyTraitStats(s, def, sign) {
  const changes = [];
  if (!def || !def.stats) return changes;

  Object.entries(def.stats).forEach(([stat, delta]) => {
    const before = s.stats[stat];
    bump(s, stat, delta * sign);
    if (s.stats[stat] !== before) {
      changes.push({ kind: "stat", key: stat, delta: s.stats[stat] - before });
    }
  });
  return changes;
}

/** Somme d'un champ numérique sur tous les traits portés. */
function traitSum(s, read) {
  return traitsOf(s).reduce((total, id) => {
    const def = TRAIT_DATA[id];
    return def ? total + (read(def) || 0) : total;
  }, 0);
}

/**
 * Ce que les traits ajoutent à la cible d'une jauge. Certains ne valent pas la
 * même chose selon le camp : ce qu'un appareil trouve normal, celui d'en face
 * en fait un sujet. C'est le rôle de "partyTarget".
 */
function traitTarget(s, gauge) {
  return traitSum(s, (d) => {
    const propre = (d.target && d.target[gauge]) || 0;
    const selonParti = d.partyTarget && d.partyTarget[s.party] && d.partyTarget[s.party][gauge];
    return propre + (selonParti || 0);
  });
}

/**
 * Ce que les traits ajoutent au score d'un scrutin. C'est le levier des
 * traits qui aident quelque part et nuisent ailleurs : un ancrage local rend
 * une mairie presque imprenable et ne sert à rien à Strasbourg. La clé "all"
 * couvre les scrutins qu'un trait ne nomme pas.
 */
function traitElections(s, electionId) {
  return traitSum(s, (d) => {
    if (!d.elections) return 0;
    const propre = d.elections[electionId];
    return propre === undefined ? (d.elections.all || 0) : propre;
  });
}

/** Part des mauvaises nouvelles que les traits amortissent, plafonnée. */
function traitSoften(s) {
  return Math.min(0.6, traitSum(s, (d) => d.soften));
}

/* ==========================================================================
   Le budget
   ==========================================================================
   Chaque semestre, l'argent rentre et sort tout seul. Ce qui rentre : une
   indemnité liée à la fonction, le rendement du patrimoine, les revenus
   occultes des traits. Ce qui sort : un train de vie qu'on ne choisit pas,
   et des postes d'investissement qu'on choisit entièrement.

   C'est là que la fortune cesse d'être un chiffre décoratif : elle achète
   de la popularité et de la cote, année après année, à condition de pouvoir
   tenir la dépense. Quand le compte est vide, le moteur coupe lui-même.

   Les montants sont dans js/budget.data.js.
   ========================================================================== */

function investments(s) {
  return s.investments || (s.investments = {});
}

function investLevel(s, key) {
  return investments(s)[key] || 0;
}

/**
 * La définition du palier atteint sur un poste. Le palier zéro compte lui
 * aussi : il faut bien se loger quelque part, même au plus bas de l'échelle.
 */
function investSpec(s, key) {
  const def = BUDGET_DATA.investments[key];
  return def ? def.levels[investLevel(s, key)] : null;
}

function investSum(s, read) {
  return Object.keys(BUDGET_DATA.investments).reduce((total, key) => {
    const spec = investSpec(s, key);
    return spec ? total + (read(spec) || 0) : total;
  }, 0);
}

/**
 * Part de la BAISSE d'une jauge que les dépenses évitent. C'est la façon
 * dont l'argent agit désormais : il n'achète pas de la popularité, il
 * empêche celle qu'on a gagnée de refluer. Sans communication, tout ce
 * qu'un événement vous rapporte finit par redescendre ; avec une agence,
 * cela met beaucoup plus longtemps.
 */
function investHold(s, gauge) {
  return Math.min(0.75, investSum(s, (spec) => spec.hold && spec.hold[gauge]));
}

/** Part du risque judiciaire absorbée par les avocats, plafonnée. */
function investProtect(s) {
  return Math.min(0.7, investSum(s, (spec) => spec.protect));
}

/**
 * CE QUI REND LE RISQUE JOUABLE.
 *
 * Un pari raté coûtait toujours plein tarif, et comme les dés du jeu tournent
 * autour de pile ou face, parier était perdant presque à tous les coups :
 * dix-huit pour cent des choix à dés battaient l'option sûre du même
 * événement. Un joueur rationnel ne prenait donc jamais de risque, ce qui
 * n'est pas une façon de raconter une carrière politique.
 *
 * Ce n'est pas le moteur qui répare ça, c'est le service de presse. Une
 * bourde se paie plein tarif quand personne ne travaille pour vous ; avec une
 * agence derrière soi, elle se paie moins cher. L'audace s'achète, ce qui est
 * exactement ce que le jeu raconte par ailleurs.
 *
 * N'amortit que les jauges d'un pari perdu : ni l'argent, ni les
 * statistiques, ni les marques. Aucun attaché de presse n'a jamais fait
 * disparaître une amende ni un procès-verbal.
 */
function investNerve(s) {
  return Math.min(0.6, investSum(s, (spec) => spec.nerve));
}

/**
 * Change le niveau d'un poste. On ne peut pas monter un niveau qu'on n'a
 * pas les moyens de payer une seule année : la première échéance tombe
 * tout de suite.
 */
function setInvestment(s, key, delta) {
  const def = BUDGET_DATA.investments[key];
  if (!def) return false;

  const level = Math.max(0, Math.min(def.levels.length - 1, investLevel(s, key) + delta));
  if (level === investLevel(s, key)) return false;
  if (delta > 0 && s.money < def.levels[level].cost) return false;

  investments(s)[key] = level;
  return true;
}

/* ---------- Ce qui rentre, ce qui sort ---------- */

function annualIncome(s) {
  return {
    salary: BUDGET_DATA.salaries[s.position] || 0,
    wealth: Math.round(Math.max(0, s.money) * BUDGET_DATA.wealth_yield),
    hidden: traitSum(s, (d) => d.income) * 2, // les traits rapportent par tour
  };
}

/**
 * Ce qui sort. La vie courante et les impôts prennent une part de ce qui
 * rentre plutôt qu'un montant fixe : on ne vit pas de la même façon avec
 * trente mille euros par an et avec deux cent mille. Le milieu d'origine
 * ajoute son multiplicateur, parce qu'on dépense d'abord comme on a été
 * élevé.
 */
function annualExpenses(s) {
  const income = annualIncome(s);
  const base = Math.max(
    BUDGET_DATA.lifestyle_floor,
    (income.salary + income.wealth) * BUDGET_DATA.lifestyle_rate
  );
  const lifestyle = Math.round(base * (BUDGET_DATA.origin_lifestyle[s.character.origin] || 1));

  const posts = {};
  Object.keys(BUDGET_DATA.investments).forEach((key) => {
    const spec = investSpec(s, key);
    if (spec && spec.cost) posts[key] = spec.cost;
  });

  return { lifestyle, posts };
}

function annualBalance(s) {
  const income = annualIncome(s);
  const expenses = annualExpenses(s);
  const out = expenses.lifestyle + Object.values(expenses.posts).reduce((a, b) => a + b, 0);
  return income.salary + income.wealth + income.hidden - out;
}

/**
 * Un semestre de comptabilité. Si le solde vide le compte, on descend le
 * poste le plus cher d'un niveau : personne ne finance une agence de
 * communication avec un découvert.
 */
function applyBudget(s) {
  const before = s.money;
  s.money = Math.max(0, s.money + Math.round(annualBalance(s) / 2));

  if (s.money > 0 || annualBalance(s) >= 0) return null;

  const worst = Object.keys(BUDGET_DATA.investments)
    .filter((key) => investLevel(s, key) > 0)
    .sort((a, b) => investSpec(s, b).cost - investSpec(s, a).cost)[0];

  if (!worst) return before > 0 ? { broke: true } : null;

  setInvestment(s, worst, -1);
  return { broke: true, cut: worst };
}

/* ==========================================================================
   Helpers utilisés par les événements
   ==========================================================================
   La fonction L(), qui choisit la langue d'un texte { fr, en }, vit avec les
   traductions dans js/script.js : les pages de création en ont besoin sans
   charger le moteur.
   ========================================================================== */

/** Modifie une statistique en restant dans les bornes de l'échelle. */
function bump(state, stat, delta) {
  state.stats[stat] = Math.max(STAT_MIN, Math.min(STAT_MAX, state.stats[stat] + delta));
}

/**
 * Les statistiques se lisent sur vingt ; les formules du jeu, les seuils des
 * élections et les difficultés écrites dans les événements ont été calibrés
 * sur dix. On convertit donc à l'entrée de chaque calcul.
 *
 * Le facteur n'est pas exactement un demi, et c'est voulu. Les événements
 * donnent les mêmes points qu'avant sur une échelle deux fois plus grande :
 * une carrière entière ne sature donc plus le plafond, elle s'arrête vers
 * douze ou quinze. Sans correction, le personnage serait deux fois plus
 * faible qu'avant à mi-parcours ; avec elle, il vaut la même chose, et il
 * reste de la place pour ce que les traits apportent.
 */
const STAT_SCALE = 0.58;

function statScore(s, key) {
  return s.stats[key] * STAT_SCALE;
}

/**
 * Coup immédiat sur la popularité auprès de l'électorat.
 *
 * Deux corrections, qui font toute la difficulté du haut de tableau :
 *
 *   1. RENDEMENTS DÉCROISSANTS. Gagner dix points quand on est inconnu est
 *      une bonne journée ; les gagner quand on plafonne déjà est presque
 *      impossible. Plus la popularité est haute, moins les bonnes nouvelles
 *      rapportent. Les mauvaises, elles, coûtent toujours plein tarif.
 *   2. AMORTI. Certains traits (le téflon) encaissent une part des coups.
 */
function bumpPop(state, delta) {
  // UN EFFET SANS POSITION TOUCHE TOUT LE MONDE PAREIL. C'est le sens qu'a
  // toujours eu "popularity", et c'est celui qu'il garde : une scène n'est
  // pas obligée de cliver, et la plupart ne clivent pas.
  if (state.appeal) {
    Object.keys(PARTIES).forEach((key) => bumpAppeal(state, key, delta));
    syncPopularity(state);
    return;
  }

  let d = delta;
  if (d > 0) d *= Math.max(0.25, 1 - state.popularity / 150);
  else d *= 1 - traitSoften(state);

  state.popularity = clamp100(state.popularity + d);
}

/**
 * L'ÉTAT DE DÉPART DE CHAQUE ÉLECTORAT.
 *
 * On n'entre pas en politique avec le même capital partout : le camp qu'on a
 * choisi vous accorde d'emblée ce que les autres vous refusent. L'écart est
 * calé sur la distance idéologique, puis l'ensemble est décalé pour que la
 * moyenne pondérée retombe exactement sur popularityTarget() — le personnage
 * commence donc avec très précisément le crédit qu'il avait avant, réparti
 * au lieu d'être uniforme.
 */
const APPEAL_SPREAD = 26;

function initialAppeal(s) {
  const brut = {};
  Object.keys(PARTIES).forEach((key) => {
    brut[key] = APPEAL_SPREAD * (0.5 - ideologicalDistance(key, s.party));
  });

  const { poids, total } = electorateWeights(s);
  let moyenne = 0;
  Object.keys(PARTIES).forEach((key) => { moyenne += brut[key] * poids[key]; });
  moyenne = total ? moyenne / total : 0;

  const cible = popularityTarget(s);
  const appeal = {};
  Object.keys(PARTIES).forEach((key) => {
    appeal[key] = clamp100(cible + brut[key] - moyenne);
  });
  return appeal;
}

/* ==========================================================================
   LA POPULARITÉ N'EST PAS UN NOMBRE, C'EST SIX
   ==========================================================================
   Il n'y en avait qu'un, `game.popularity`, « ce que le pays pense de vous »,
   écrit par neuf cent quatre-vingt-quatorze effets sur trois cent cinq
   événements. Un seul nombre ne peut pas dire ce que le jeu raconte :
   réprimer une manifestation, lâcher une phrase sur l'immigration, défendre
   une réforme économique, ce sont des gestes qui RENFORCENT UNE BASE ET
   REFROIDISSENT LES AUTRES. Avec une seule jauge, ils produisaient un nombre
   qui montait ou qui descendait, et le joueur ne pouvait pas jouer le seul
   arbitrage qui compte vraiment : plaire aux siens, ou être élu par les
   autres.

   La vérité vit donc dans `game.appeal`, six valeurs de 0 à 100 : ce que
   CHAQUE électorat pense de vous. Tout le reste en dérive.

     popularité de base      appeal[votre parti]
     popularité générale     la moyenne des AUTRES, pondérée par leur poids
     game.popularity         la moyenne de TOUS, pondérée de même

   `game.popularity` reste un champ, recalculé après chaque changement par
   syncPopularity(). Les vingt-quatre lectures du moteur continuent donc de
   fonctionner telles quelles, et les sauvegardes se chargent.
   ========================================================================== */

/** Le poids de chaque électorat, c'est-à-dire ce que son parti pèse. */
function electorateWeights(s) {
  const poids = {};
  let total = 0;
  Object.keys(PARTIES).forEach((key) => {
    const p = Math.max(1, (s.landscape && s.landscape[key]) || 1);
    poids[key] = p;
    total += p;
  });
  return { poids, total };
}

/** Ce que votre propre camp pense de vous. */
function basePopularity(s) {
  return s.appeal ? s.appeal[s.party] : s.popularity;
}

/**
 * Ce que pensent de vous les gens qui ne votent pas pour votre camp. C'est
 * l'écart entre cette valeur et la base qui dit tout : un candidat adoré des
 * siens et refusé partout ailleurs gagne un congrès et perd un second tour.
 */
function generalPopularity(s) {
  if (!s.appeal) return s.popularity;

  const { poids } = electorateWeights(s);
  let somme = 0;
  let total = 0;
  Object.keys(PARTIES).forEach((key) => {
    if (key === s.party) return;
    somme += s.appeal[key] * poids[key];
    total += poids[key];
  });
  return total ? somme / total : s.popularity;
}

/** La moyenne de tous les électorats : c'est elle que le moteur lit encore. */
function overallPopularity(s) {
  if (!s.appeal) return s.popularity;

  const { poids, total } = electorateWeights(s);
  let somme = 0;
  Object.keys(PARTIES).forEach((key) => { somme += s.appeal[key] * poids[key]; });
  return total ? somme / total : s.popularity;
}

/** À rappeler après tout changement d'appeal, et nulle part ailleurs. */
function syncPopularity(s) {
  if (!s.appeal) return;
  s.popularity = clamp100(overallPopularity(s));
}

/**
 * Coup sur un seul électorat, avec les mêmes rendements décroissants que la
 * popularité d'ensemble : gagner dix points là où l'on plafonne déjà est
 * presque impossible, les mauvaises nouvelles coûtent plein tarif.
 */
function bumpAppeal(s, key, delta) {
  if (!s.appeal || s.appeal[key] === undefined) return 0;

  const avant = s.appeal[key];
  let d = delta;
  if (d > 0) d *= Math.max(0.25, 1 - avant / 150);
  else d *= 1 - traitSoften(s);

  s.appeal[key] = clamp100(avant + d);
  return s.appeal[key] - avant;
}

/**
 * OÙ SE SITUE UN CHOIX, ET QUI Y RÉAGIT COMMENT.
 *
 * Un choix peut déclarer une position sur tout ou partie des quatre axes :
 * "axis": { "social": -70 } veut dire « ce geste est très à gauche sur les
 * questions de société ». Le moteur en tire la réaction des six électorats,
 * depuis la distance entre cette position et la leur, SUR LES SEULS AXES
 * DÉCLARÉS — un geste qui ne parle que d'économie ne doit pas être jugé sur
 * la politique étrangère.
 *
 * Le point neutre est à mi-distance : au-delà on gagne, en deçà on perd. Un
 * choix clivant rapporte donc moins en agrégat qu'un choix consensuel de même
 * ampleur, et c'est exactement l'arbitrage qu'on cherche à créer.
 */
/*
 * Où passe la ligne entre ceux que le geste rapproche et ceux qu'il éloigne.
 * Elle était à 0,42, c'est-à-dire en dessous de toutes les affinités que
 * produisent les six partis du jeu : une position très à gauche faisait
 * gagner un point à l'électorat identitaire, ce qui est le contraire de ce
 * qu'on voulait écrire. Les distances réelles entre camps vont de 0,10 à
 * 0,55, donc les affinités de 0,45 à 0,90 : la ligne passe au milieu.
 */
const AXIS_NEUTRAL = 0.68;

/**
 * « DONNER À LA BASE CE QU'ELLE ATTEND » N'A PAS DE COORDONNÉES FIXES.
 *
 * Certaines scènes proposent de se caler sur son propre camp, et la position
 * dépend alors de qui l'on est : la même phrase n'est pas au même endroit
 * selon qu'on la prononce à la gauche radicale ou chez les identitaires.
 * "axis": "self" prend donc les axes du parti du joueur, et "ally" ceux de
 * son allié — deux façons d'écrire « là où je suis » sans écrire de chiffres.
 */
function resolveAxis(position, s) {
  if (position === "self") return partyAxes(s.party);
  if (position === "ally") return partyAxes(allyParty ? allyParty() : null);
  return position;
}

function axisAffinity(position, partyKey) {
  const axes = partyAxes(partyKey);
  const declares = AXES.filter((ax) => position[ax] !== undefined);
  if (!declares.length) return AXIS_NEUTRAL;

  const distance = declares.reduce((sum, ax) =>
    sum + Math.abs(position[ax] - axes[ax]), 0) / (declares.length * 200);
  return 1 - distance;
}

/**
 * Applique une popularité positionnée : une seule ligne écrite, six réactions.
 * Renvoie ce qui a bougé, électorat par électorat.
 */
function applyPositionedPopularity(s, amount, brut) {
  const position = resolveAxis(brut, s);
  const bouge = {};
  Object.keys(PARTIES).forEach((key) => {
    // Ramené sur une pleine amplitude : l'électorat le plus proche prend le
    // montant annoncé, le plus lointain le perd, et le milieu ne bouge pas.
    const ecart = (axisAffinity(position, key) - AXIS_NEUTRAL) / (1 - AXIS_NEUTRAL);
    const delta = amount * ecart;
    if (Math.abs(delta) < 0.05) return;
    const reel = bumpAppeal(s, key, delta);
    if (Math.abs(reel) >= 0.5) bouge[key] = reel;
  });
  syncPopularity(s);
  return bouge;
}

/** Coup immédiat sur la cote au sein du parti. */
function bumpStanding(state, delta) {
  state.standing = clamp100(state.standing + delta);
}

/** Ajoute ou retire de l'argent, plancher à zéro. */
function pay(state, amount) {
  state.money = Math.max(0, state.money + amount);
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

/** Un rival au hasard, pour les événements qui en mettent un en scène. */
function anyRival(state) {
  return state.rivals[randInt(state.rivals.length)];
}


/* ==========================================================================
   L'année présidentielle
   ==========================================================================
   Quand le joueur dirige son parti à l'approche de la présidentielle,
   l'année ne se joue plus en deux tours ordinaires mais en SIX temps de
   campagne, avec un sondage affiché qui bouge à chaque décision.
   ========================================================================== */

const CAMPAIGN_STEPS = 6;

/** Les temps de l'entre-deux-tours : deux scènes, puis le débat. */
const RUNOFF_STEPS = 3;

/**
 * Ce qu'un point d'effet vaut dans un second tour. Moins qu'au premier, et
 * c'est tout le sujet : à ce stade il ne reste plus d'électeurs neufs, rien
 * que des gens qui ont déjà voté pour quelqu'un d'autre. Un débat gagné vaut
 * deux ou trois points, pas dix, et deux ou trois points suffisent.
 *
 * Le premier réglage valait 0,55, et trois temps d'entre-deux-tours joués
 * sans risque rendaient cinq points : on renversait un 47-53 en choisissant
 * systématiquement l'option prudente, ce qui vide la séquence de son sens.
 * À 0,40, la campagne pèse ce qu'elle doit peser : elle décide un second
 * tour serré et n'en sauve aucun qui était perdu.
 */
const RUNOFF_WEIGHT = 0.40;

/**
 * Déplace la part du joueur dans le sondage et redistribue le reste.
 *
 * Une campagne ne se gagne pas en empilant les bonnes journées : plus la
 * part est haute, moins un bon moment rapporte, parce qu'il ne reste plus
 * que des électeurs difficiles à convaincre. Les mauvaises journées, elles,
 * coûtent toujours leur prix.
 */
function shiftPoll(s, delta) {
  const field = s.campaign.field;
  const me = field.find((c) => c.isPlayer);

  const before = me.share;
  const move = delta > 0 ? delta * Math.max(0.18, 1 - me.share / 42) : delta;
  me.share = Math.max(2, Math.min(92, me.share + move));
  const moved = me.share - before;

  const others = field.filter((c) => !c.isPlayer);
  const pool = others.reduce((sum, c) => sum + c.share, 0) || 1;
  others.forEach((c) => {
    c.share = Math.max(1, c.share - moved * (c.share / pool));
  });

  // On renormalise pour que le total fasse toujours cent.
  const total = field.reduce((sum, c) => sum + c.share, 0);
  field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * La même chose, pour la campagne d'un camp que le joueur soutient sans y
 * être candidat. On déplace la ligne de son parti, pas la sienne : il n'en a
 * pas. Les rendements décroissants sont les mêmes, parce que c'est la même
 * campagne vue d'un cran plus loin.
 */
function shiftSupport(s, delta) {
  const field = s.support && s.support.field;
  const mien = field && field.find((c) => c.mine);
  if (!mien) return;

  const before = mien.share;
  const move = delta > 0 ? delta * Math.max(0.18, 1 - mien.share / 42) : delta;
  mien.share = Math.max(1, Math.min(92, mien.share + move));
  const moved = mien.share - before;

  const autres = field.filter((c) => !c.mine);
  const pool = autres.reduce((sum, c) => sum + c.share, 0) || 1;
  autres.forEach((c) => { c.share = Math.max(1, c.share - moved * (c.share / pool)); });

  const total = field.reduce((sum, c) => sum + c.share, 0) || 1;
  field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * La vie du sondage entre deux temps d'une campagne qu'on soutient. Les
 * autres bougent, exactement comme quand c'est vous le candidat : une
 * campagne où seul votre camp remue n'est pas une campagne.
 */
function driftSupport(s) {
  const field = s.support && s.support.field;
  if (!field || !field.length) return;

  const autres = field.filter((c) => !c.mine);
  if (!autres.length) return;
  const best = autres.reduce((top, c) => (c.share > top.share ? c : top), autres[0]);
  autres.forEach((c) => {
    c.share = Math.max(1, c.share + (Math.random() - 0.5) * 2.4 + (c === best ? 0.5 : 0));
  });

  const total = field.reduce((sum, c) => sum + c.share, 0) || 1;
  field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * Le sondage d'un second tour. Deux noms, cent pour cent à partager : ce que
 * l'un prend, l'autre le perd, exactement, et c'est ce qui rend ces quinze
 * jours si durs. Plus on est haut, plus chaque point coûte cher, parce qu'en
 * face il ne reste que des électeurs qui ont déjà choisi contre vous.
 */
function shiftRunoff(s, delta) {
  const field = s.campaign.duel.field;
  const me = field.find((c) => c.isPlayer);
  const other = field.find((c) => !c.isPlayer);
  if (!me || !other) return;

  const reste = delta > 0 ? (100 - me.share) : me.share;
  const move = delta * RUNOFF_WEIGHT * Math.max(0.3, reste / 55);

  me.share = Math.max(15, Math.min(85, me.share + move));
  other.share = 100 - me.share;
}


/* ==========================================================================
   Énergie
   ==========================================================================
   L'énergie n'est pas une statistique comme les autres : elle se dépense et
   se récupère. Sans récupération, une carrière entière de choix exigeants la
   ramenait à zéro et l'y laissait.

   Elle remonte lentement vers un plafond qui décroît avec l'âge : à trente
   ans on encaisse tout, à soixante-dix beaucoup moins. Et quand elle est
   basse, certaines réponses deviennent tout simplement inaccessibles.
   ========================================================================== */

/**
 * Le seuil de récupération, qui s'érode avec les années. C'est là que
 * l'énergie s'arrête de remonter, jamais le maximum de la statistique.
 *
 * On ne vieillit pas dès trente ans. Le seuil tient bon jusqu'à la
 * cinquantaine, l'âge où les carrières se jouent vraiment, puis descend d'un
 * point tous les trois ans. La fatigue arrive donc là où elle se voit en
 * politique : autour de soixante-cinq ans, quand les jets commencent à
 * manquer et que les journées longues ne sont plus une option.
 *
 * La version précédente touchait son plancher à cinquante-quatre ans, très
 * en dessous du seuil que réclament les choix exigeants : la seconde moitié
 * de toutes les carrières se jouait épuisée, sans que le joueur y puisse
 * quoi que ce soit.
 */
function energyCeiling(s) {
  let ceiling = 14 - Math.max(0, Math.floor((s.age - 50) / 3));
  if (s.flags.carefulHealth) ceiling += 2;
  if (s.flags.frailHealth) ceiling -= 2;
  ceiling += traitSum(s, (d) => d.energy) * 2;
  return Math.max(2, Math.min(18, ceiling));
}

/**
 * Récupération : deux points tous les deux ans, et jamais au-dessus du
 * seuil. C'est volontairement lent. Tant qu'on récupérait plus vite qu'on ne
 * dépensait, l'énergie n'était pas une ressource : c'était une formalité, et
 * dépenser était toujours rentable puisque le compte se remplissait tout
 * seul.
 *
 * Deux ans, et non trois : une carrière qui se ménage doit pouvoir se tenir
 * à son seuil, une carrière qui force doit le payer. À trois ans, même la
 * prudence perdait du terrain à chaque tour.
 */
function recoverEnergy(s) {
  if (s.turn % 4 !== 0) return;
  if (s.stats.energie < energyCeiling(s)) bump(s, "energie", +2);
}

/* --------------------------------------------------------------------------
   LE DÉCOUVERT RÉSIDUEL.
   --------------------------------------------------------------------------
   Un choix trop cher n'est plus proposé (voir availableChoices), et c'est là
   que se joue l'essentiel. Mais tout ce qui coûte de l'énergie ne passe pas
   par un bouton : un risque de trait, une conséquence conditionnelle qui
   s'ajoute à un coût déjà payé, un temps de campagne. Ce qui reste à payer
   quand la caisse est vide se prend sur les nerfs, parce que c'est ce qui
   lâche en premier quand on ne dort pas, et s'inscrit dans la dette de
   fatigue que tient wearOut().
   -------------------------------------------------------------------------- */

function payEnergy(s, cost) {
  const changes = [];
  const paye = Math.min(s.stats.energie, cost);

  if (paye > 0) {
    bump(s, "energie", -paye);
    changes.push({ kind: "stat", key: "energie", delta: -paye });
  }

  const manque = cost - paye;
  if (manque <= 0) return changes;

  s.strain = (s.strain || 0) + manque;

  const avant = s.stats.sangfroid;
  bump(s, "sangfroid", -Math.max(1, Math.round(manque / 2)));
  if (s.stats.sangfroid !== avant) {
    changes.push({ kind: "stat", key: "sangfroid", delta: s.stats.sangfroid - avant });
  }

  return changes;
}

/* ==========================================================================
   La stature
   ==========================================================================
   La crédibilité ne se décrète pas et ne se gagne pas seulement dans les
   scènes : elle vient d'abord de la fonction. On prend au sérieux quelqu'un
   qu'on a vu tenir un poste, et on cesse de prendre au sérieux quelqu'un
   qu'on n'a plus vu nulle part depuis dix ans.

   Chaque fonction a donc un niveau vers lequel la stature glisse lentement.
   Les événements font le reste : ils poussent au-dessus, ou ils cassent. Un
   ministère bien tenu vous installe ; deux mandats de conseiller municipal
   ne feront jamais de vous un présidentiable, quoi que vous répondiez aux
   cartes.
   ========================================================================== */

/*
 * OÙ LA CRÉDIBILITÉ EST LUE, pour qui voudra la régler à la main. Neuf
 * endroits, et rien d'autre :
 *
 *   js/data.js        BASE_STATS.credibilite       le niveau de départ
 *                     STAT_MODIFIERS               origine et parcours
 *   js/game-data.js   standingTarget()             × 1.1   l'appareil
 *                     popularityTarget()           × 0.35  le pays
 *                     rejectionRate()              × 0.014 le second tour
 *   js/game.js        electionBase() législatives  × 0.7
 *                     electionBase() congrès       × 0.9
 *                     playerPull()                 ÷ 42    le premier tour
 *                     figurePull()                 ÷ 24    celle des rivaux
 *                     makeFigure()                 la stature des rivaux
 *
 * Plus la table ci-dessous, qui fait l'essentiel du travail : c'est elle qui
 * décide de la stature qu'une carrière atteint sans rien faire de spécial,
 * et credibilityTarget() juste en dessous, qui y ajoute la direction du parti.
 */
const CREDIBILITY_BY_OFFICE = {
  militant: 3, cadre: 6, conseiller: 6, maire: 10,
  euro: 8, depute: 12, ministre: 16, chef: 15, premier: 19,
};

/**
 * CE QUE LA DIRECTION DU PARTI VAUT EN STATURE. Elle vaut à elle seule ce
 * qu'elle valait quand elle était une marche de l'échelle : quinze. On ne
 * l'additionne pas à la fonction — un député qui prend son parti ne devient
 * pas plus présidentiable qu'un chef de parti ordinaire — on prend le plus
 * haut des deux. Au-dessus, seuls un ministère ou Matignon ajoutent quelque
 * chose, parce que c'est là qu'on est vu en train de gouverner.
 */
const CREDIBILITY_LEAD = 15;
const CREDIBILITY_LEAD_BONUS = 3;

function credibilityTarget(s) {
  const office = CREDIBILITY_BY_OFFICE[s.position];
  if (office === undefined) return undefined;
  if (!leadsParty(s)) return office;
  return Math.max(office, CREDIBILITY_LEAD) +
    (office > CREDIBILITY_LEAD ? CREDIBILITY_LEAD_BONUS : 0);
}

/** Marge au-dessus de la fonction qu'on peut tenir grâce à ses seuls choix. */
const CREDIBILITY_OVERSHOOT = 4;

function credibilityDrift(s) {
  if (s.turn % 4 !== 0) return;

  const cible = credibilityTarget(s);
  if (cible === undefined) return;

  if (s.stats.credibilite < cible) bump(s, "credibilite", +1);
  // Ce qu'on a construit au-dessus de sa fonction s'effrite, sans jamais
  // redescendre au niveau du poste : une stature acquise ne se perd pas
  // entièrement en changeant de bureau.
  else if (s.stats.credibilite > cible + CREDIBILITY_OVERSHOOT) bump(s, "credibilite", -1);
}

/* ==========================================================================
   Interpréteur d'événements
   ==========================================================================
   Les événements ne vivent plus dans le code mais dans js/events/*.data.js,
   éclatés par thème et assemblés dans EVENT_DATA par js/events/_assemble.data.js,
   sous forme de données pures. Ce qui suit sait les lire : évaluer une
   condition, tirer un dé, appliquer des effets.

   Ajouter un événement ne demande donc aucune ligne de code.
   ========================================================================== */

const EVENTS = EVENT_DATA.events;
const CAMPAIGN_EVENTS = EVENT_DATA.campaign;

/**
 * Deux paquets à part, tirés seulement au moment d'une élection.
 *
 *   NOMINATION_EVENTS  quand l'appareil refuse de vous investir. Le jeu
 *                      proposait toujours le même bouton, ce qui transformait
 *                      un moment de carrière en formalité.
 *   RACE_EVENTS        les deux ou trois temps d'une campagne locale. Une
 *                      élection ne se joue plus en un clic : on fait campagne,
 *                      puis on dépouille.
 */
const NOMINATION_EVENTS = EVENT_DATA.nomination || [];
const RACE_EVENTS = EVENT_DATA.races || [];

/**
 * Les scrutins où l'on n'est pas candidat. Ils mangeaient un semestre entier
 * pour une phrase et un bouton « Continuer » : on traverse désormais la
 * campagne des autres en décidant quoi en faire.
 */
const ASIDE_EVENTS = EVENT_DATA.aside || [];

/**
 * La présidentielle qu'on ne dispute pas soi-même. Elle se réglait en un
 * clic : on y joue désormais trois temps, et ce qu'on y fait pèse un peu.
 */
const SUPPORT_EVENTS = EVENT_DATA.support || [];

/**
 * L'entre-deux-tours. Le joueur qualifié passait du dimanche soir au verdict
 * sans qu'on lui demande rien : quinze jours, le moment le plus regardé de la
 * vie politique française, et pas une seule décision à prendre. Il s'y joue
 * désormais trois temps, dont le grand débat, qui tombe toujours.
 */
const RUNOFF_EVENTS = EVENT_DATA.runoff || [];

/** Les sept statistiques, pour distinguer un effet de stat d'un autre effet. */
const STAT_KEYS = ["charisme", "eloquence", "energie", "sangfroid", "reseau", "notoriete", "reputation", "credibilite"];

/* ---------- Conditions ---------- */

/** Un événement est-il jouable dans l'état actuel de la partie ? */
function eventMatches(ev, s) {
  const w = ev.when;

  // Un événement ne se joue qu'une fois par partie. Une carrière ne repasse
  // pas deux fois par la même scène, et revoir un texte déjà lu casse tout.
  // Seuls les temps morts, marqués "repeatable", peuvent revenir.
  if (!ev.repeatable && ev.id && s.seen && s.seen[ev.id]) return false;

  if (!w) return true;

  if (w.party && !w.party.includes(s.party)) return false;

  // LA POSITION, ET LE CAS PARTICULIER DE « CHEF ». La direction du parti
  // n'est plus une fonction mais un titre qu'on cumule : dans une liste de
  // positions, "chef" ne veut donc plus dire « votre case vaut chef » mais
  // « vous dirigez votre parti », quel que soit le mandat que vous tenez à
  // côté. Les quarante-trois événements écrits avant le cumul continuent de
  // sortir, et ils sortent pour la bonne personne.
  if (w.position && !w.position.some((p) => (p === "chef" ? leadsParty(s) : p === s.position))) return false;

  // La même chose, écrite en clair, pour une scène qui parle de la direction
  // sans rien exiger du mandat.
  if (w.partyLead !== undefined && leadsParty(s) !== w.partyLead) return false;
  if (w.origin && !w.origin.includes(s.character.origin)) return false;
  if (w.background && !w.background.includes(s.character.background)) return false;
  if (w.personality && !w.personality.includes(s.character.personality)) return false;

  if (w.minAge !== undefined && s.age < w.minAge) return false;
  if (w.maxAge !== undefined && s.age > w.maxAge) return false;
  if (w.minTurn !== undefined && s.turn < w.minTurn) return false;
  if (w.maxTurn !== undefined && s.turn > w.maxTurn) return false;
  if (w.minPopularity !== undefined && s.popularity < w.minPopularity) return false;
  if (w.maxPopularity !== undefined && s.popularity > w.maxPopularity) return false;

  // Ce que pense votre camp, et ce que pensent les autres. Une scène peut
  // exiger l'un sans l'autre, et c'est tout l'intérêt : on écrit enfin la
  // situation du candidat adoré des siens que le pays refuse.
  if (w.minBase !== undefined && basePopularity(s) < w.minBase) return false;
  if (w.maxBase !== undefined && basePopularity(s) > w.maxBase) return false;
  if (w.minGeneral !== undefined && generalPopularity(s) < w.minGeneral) return false;
  if (w.maxGeneral !== undefined && generalPopularity(s) > w.maxGeneral) return false;
  if (w.minStanding !== undefined && s.standing < w.minStanding) return false;
  if (w.maxStanding !== undefined && s.standing > w.maxStanding) return false;
  if (w.minMoney !== undefined && s.money < w.minMoney) return false;
  if (w.maxMoney !== undefined && s.money > w.maxMoney) return false;

  if (w.stat) {
    for (const [key, range] of Object.entries(w.stat)) {
      const value = s.stats[key];
      if (range.min !== undefined && value < range.min) return false;
      if (range.max !== undefined && value > range.max) return false;
    }
  }

  // CE QU'ON A PAYÉ EST UNE CONDITION COMME UNE AUTRE. Un choix peut exiger
  // un niveau de conseil juridique ou de communication : c'est ainsi qu'un
  // budget devient jouable au lieu d'être une ligne comptable.
  if (w.legal !== undefined && investLevel(s, "juridique") < w.legal) return false;
  if (w.comms !== undefined && investLevel(s, "communication") < w.comms) return false;

  if (w.flag) {
    for (const [key, expected] of Object.entries(w.flag)) {
      if (Boolean(s.flags[key]) !== expected) return false;
    }
  }

  // Votre camp gouverne-t-il ? C'est ce qui ouvre les portes d'un ministère,
  // et ce qui ferme celles de l'opposition.
  if (w.ruling !== undefined) {
    const inPower = Boolean(s.president) &&
      (Boolean(s.president.isPlayer) || s.president.party === s.party);
    if (inPower !== w.ruling) return false;
  }

  // Un pacte en cours, ou pas de pacte du tout.
  if (w.allied !== undefined && Boolean(s.alliance) !== w.allied) return false;

  // DES LÉGISLATIVES ANTICIPÉES. Une campagne de vingt jours après une
  // dissolution ne ressemble à aucune autre, et ses scènes ne doivent pas
  // sortir dans une législative ordinaire.
  if (w.dissolved !== undefined) {
    const anticipee = Boolean(s.dissolution) && s.dissolution === s.turn;
    if (anticipee !== w.dissolved) return false;
  }

  // REDESCENDU D'UN CRAN. Vrai quand la fonction actuelle est en dessous du
  // sommet atteint dans la carrière : c'est la définition même d'un homme
  // qu'on présente encore par ce qu'il a été.
  if (w.belowPeak !== undefined) {
    const descendu = LADDER.indexOf(s.position) < LADDER.indexOf(s.peakPosition || "militant");
    if (descendu !== w.belowPeak) return false;
  }

  // LA COTE DU GOUVERNEMENT. C'est elle qui sépare une opposition qui
  // attend son tour d'une opposition qui sent le pouvoir à portée, et un
  // pouvoir tranquille d'un pouvoir aux abois.
  if (w.minApproval !== undefined && (s.approval || 0) < w.minApproval) return false;
  if (w.maxApproval !== undefined && (s.approval || 0) > w.maxApproval) return false;

  // L'ÉTAT DE L'ASSEMBLÉE : "absolue", "relative" ou "aucune". Une liste
  // accepte plusieurs états.
  if (w.majority !== undefined) {
    const etat = typeof majorityState === "function" ? majorityState() : "relative";
    const voulu = Array.isArray(w.majority) ? w.majority : [w.majority];
    if (!voulu.includes(etat)) return false;
  }

  /* ------------------------------------------------------------------------
     OÙ L'ON EST ASSIS DANS L'HÉMICYCLE.
     ------------------------------------------------------------------------
     "ruling" disait si l'on avait l'Élysée, et c'était tout : entre un camp
     qui gouverne avec deux cent quatre-vingt-quinze députés et le même camp
     qui négocie chaque texte, entre une opposition qui est le premier groupe
     et un groupe de dix-sept qui compte ses voix, le jeu ne faisait aucune
     différence. Quatre conditions le disent maintenant, et elles se
     combinent : c'est ce qui rend la carte d'Assemblée écrivable.

       inCoalition   votre camp vote les textes du gouvernement. Avec
                     "ruling": false, c'est l'allié du pouvoir — celui qui
                     soutient sans avoir l'Élysée, et qui le paie deux fois.
       firstGroup    votre parti est le premier groupe de l'Assemblée. Ce
                     n'est pas la même chose que gouverner, et c'est
                     exactement de là qu'on renverse un gouvernement.
       pivot         le gouvernement n'a pas la majorité, et il l'aurait avec
                     vous. C'est la position la plus chère de la République :
                     on ne vous demande rien, on vous achète.
       minSeats /    les sièges de votre parti. Cinq cent soixante-dix-sept
       maxSeats      en tout, deux cent quatre-vingt-neuf font la majorité.
     ---------------------------------------------------------------------- */
  if (w.inCoalition !== undefined) {
    const bloc = typeof governmentBloc === "function" ? governmentBloc() : [];
    if (bloc.includes(s.party) !== w.inCoalition) return false;
  }
  if (w.firstGroup !== undefined) {
    if (partyIsFirstGroup(s) !== w.firstGroup) return false;
  }
  if (w.pivot !== undefined) {
    if (partyIsPivot(s) !== w.pivot) return false;
  }
  if (w.minSeats !== undefined && partySeats(s) < w.minSeats) return false;
  if (w.maxSeats !== undefined && partySeats(s) > w.maxSeats) return false;

  // VOUS ÊTES PLUS AIMÉ QUE VOTRE PROPRE PRÉSIDENT. La situation la plus
  // instable d'un camp au pouvoir, et le jeu ne la connaissait pas : on
  // pouvait dépasser de vingt points celui qui occupe l'Élysée sans qu'une
  // seule scène ne s'en aperçoive.
  if (w.outshinePresident !== undefined) {
    if (outshinesPresident(s) !== w.outshinePresident) return false;
  }

  /* ------------------------------------------------------------------------
     QUI EST EN FACE, AU SECOND TOUR.
     ------------------------------------------------------------------------
     Toutes les conditions du jeu décrivent le joueur. Aucune ne décrivait
     l'adversaire, si bien qu'on pouvait proposer « attaquer son bilan » à
     quelqu'un qui affrontait un candidat n'ayant jamais rien gouverné : il
     n'y a pas de bilan à attaquer, et la scène disait le contraire.

       foeIncumbent  l'adversaire porte un bilan : il est à l'Élysée ou à
                     Matignon au moment du débat.
       foeParty      son camp, en toutes lettres.
       foeFar        son camp est loin du vôtre, au-delà du voisinage
                     idéologique. C'est ce qui ouvre le registre du front
                     républicain, et le ferme entre voisins.
     Elles ne valent que pendant l'entre-deux-tours, où le champ est connu.
     ---------------------------------------------------------------------- */
  if (w.foeIncumbent !== undefined || w.foeParty || w.foeFar !== undefined) {
    const foe = typeof runoffFoe === "function" ? runoffFoe() : null;
    if (!foe) return false;

    if (w.foeIncumbent !== undefined && foeHoldsOffice(foe) !== w.foeIncumbent) return false;
    if (w.foeParty && !w.foeParty.includes(foe.party)) return false;
    if (w.foeFar !== undefined) {
      const loin = ideologicalDistance(foe.party, s.party) > NEIGHBOUR_DISTANCE;
      if (loin !== w.foeFar) return false;
    }
  }

  // Le poids de votre camp dans le pays, en points d'intentions de vote.
  if (w.minShare !== undefined && (s.landscape[s.party] || 0) < w.minShare) return false;

  // LE CAMP D'À CÔTÉ GOUVERNE. C'est la situation qui ouvre Matignon à
  // quelqu'un qui n'est pas du camp du président : un gouvernement qui n'a
  // pas la majorité tout seul va la chercher chez son voisin le moins
  // éloigné, et il la paie avec un poste.
  if (w.rulingClose !== undefined) {
    const gouverne = s.president && !s.president.isPlayer ? s.president.party : null;
    const voisin = Boolean(gouverne) && gouverne !== s.party &&
      ideologicalDistance(gouverne, s.party) <= NEIGHBOUR_DISTANCE;
    if (voisin !== w.rulingClose) return false;
  }

  // Traits exigés, et traits rédhibitoires : c'est ce qui rend une carrière
  // irréversible. Un renégat ne se verra plus jamais proposer certaines portes.
  if (w.trait && !w.trait.every((id) => hasTrait(s, id))) return false;
  if (w.anyTrait && !w.anyTrait.some((id) => hasTrait(s, id))) return false;
  if (w.notTrait && w.notTrait.some((id) => hasTrait(s, id))) return false;

  return true;
}

/* ---------- Textes ---------- */

/**
 * Remplace les marques d'un texte localisé.
 *
 *   {rival}         le nom de la figure mise en scène par la carte
 *   {rival_party}   le nom de son parti
 *   {party}         le nom du vôtre
 *
 * La figure est tirée au moment où la carte sort et conservée dans la partie :
 * le nom ne change donc plus entre la question et le résultat, ni quand on
 * change de langue en cours de lecture.
 */
/**
 * Un nom propre ne dit rien tout seul. La première fois qu'une figure est
 * nommée dans une carte, on la présente comme le ferait un journal : son nom,
 * son parti, sa fonction. Les mentions suivantes s'en tiennent au nom, sinon
 * la phrase devient une notice.
 */
function scenePresentation(scene) {
  const parti = t("party_" + scene.party);
  const fonction = scene.position ? t("pos_" + scene.position).toLowerCase() : null;
  return scene.name + " (" + parti + (fonction ? ", " + fonction : "") + ")";
}

/* ==========================================================================
   L'ACCORD EN GENRE
   ==========================================================================
   Les figures du jeu sont tirées à pile ou face, femme ou homme, et les
   textes leur appliquaient un masculin dans les deux langues : « vous faites
   campagne pour lui » à propos d'Agathe Hernandez, « his candidacy » à propos
   de la même. Une figure sur deux était donc mal désignée.

   Chaque langue porte ses propres marques, puisque chaque langue accorde à sa
   façon : le français doit accorder l'article, le pronom et le participe, là
   où l'anglais n'a que le pronom. Une marque écrite avec une majuscule sort
   avec une majuscule, pour les débuts de phrase.

   Le possessif français est laissé de côté volontairement : « sa candidature »
   s'accorde avec la candidature, jamais avec la personne. Il n'y a rien à y
   marquer.
   ========================================================================== */

const GENDER_MARKS = {
  /* Français */
  il:    ["il", "elle"],
  le:    ["le", "la"],
  lui:   ["lui", "elle"],
  celui: ["celui", "celle"],
  un:    ["un", "une"],
  e:     ["", "e"],
  // « Première ministre » ne s'obtient pas en collant un e : la marque
  // porte le mot entier.
  premier: ["premier", "première"],
  /* Anglais */
  he:    ["he", "she"],
  him:   ["him", "her"],
  his:   ["his", "her"],
};

/**
 * Résout les marques d'accord d'un texte selon la figure mise en scène.
 * Employée à l'affichage comme au journal, pour que les deux disent la même
 * chose de la même personne.
 */
function fillGender(text, scene) {
  const femme = scene && scene.sex === "female";
  return String(text).replace(/\{([A-Za-zÀ-ÿ]+)\}/g, (mark, mot) => {
    const clé = mot.charAt(0).toLowerCase() + mot.slice(1);
    const paire = GENDER_MARKS[clé];
    if (!paire) return mark;
    const forme = paire[femme ? 1 : 0];
    return mot.charAt(0) === clé.charAt(0)
      ? forme
      : forme.charAt(0).toUpperCase() + forme.slice(1);
  });
}

function fillText(obj, s) {
  let text = L(obj);
  const scene = s.scene || anyRival(s);

  text = fillGender(text, scene);

  if (text.includes("{rival}")) {
    let premiere = true;
    text = text.replace(/\{rival\}/g, () => {
      if (!premiere) return scene.name;
      premiere = false;
      return scenePresentation(scene);
    });
  }
  if (text.includes("{rival_party}")) {
    text = text.replace(/\{rival_party\}/g, t("party_" + scene.party));
  }
  if (text.includes("{party}")) text = text.replace(/\{party\}/g, t("party_" + s.party));
  return text;
}

/**
 * Le même texte, mais dans les deux langues et destiné au journal.
 *
 * Les noms propres sont posés tout de suite, puisqu'un nom ne se traduit pas ;
 * les noms de partis restent des marques que le journal résoudra à
 * l'affichage. Une ligne écrite pendant une partie en français se relit donc
 * en anglais si le joueur change de langue.
 */
function fillBoth(obj, s) {
  const scene = s.scene || anyRival(s);

  const presentation = scene.name + " ({party:" + scene.party + "}" +
    (scene.position ? ", {pos_low:" + scene.position + "}" : "") + ")";

  const fill = (text) => {
    let premiere = true;
    return String(text)
      .replace(/\{rival\}/g, () => {
        if (!premiere) return scene.name;
        premiere = false;
        return presentation;
      })
      .replace(/\{rival_party\}/g, "{party:" + scene.party + "}")
      .replace(/\{party\}/g, "{party:" + s.party + "}");
  };

  // L'accord est posé tout de suite, comme les noms propres : le journal se
  // relit dans l'autre langue, mais la personne dont il parle ne change pas.
  const fillFr = (t2) => fill(fillGender(t2, scene));

  return { fr: fillFr(obj.fr), en: fillFr(obj.en || obj.fr) };
}

/* ---------- Effets ---------- */

/**
 * Applique un bloc d'effets et renvoie la liste de ce qui a réellement bougé.
 *
 * On mesure les écarts après coup plutôt que de recopier les valeurs
 * déclarées : une statistique déjà au plafond ne bouge pas, un gain de
 * popularité est raboté par les rendements décroissants, un trait déjà porté
 * ne se reprend pas. Le joueur doit voir ce qui s'est passé, pas ce qui était
 * prévu.
 */
function applyEffects(effects, s, soften) {
  const changes = [];
  if (!effects) return changes;

  // L'amorti d'un pari perdu ne touche que les deux jauges : c'est du
  // rattrapage d'image, pas une machine à annuler les conséquences.
  const amorti = (key, value) =>
    soften && value < 0 && (key === "popularity" || key === "standing")
      ? value * (1 - soften)
      : value;

  Object.entries(effects).forEach(([key, raw]) => {
    const value = amorti(key, raw);
    // Dépenser de l'énergie n'est pas modifier une statistique : on peut
    // dépenser ce qu'on n'a pas, et cela se paie autrement. Voir payEnergy.
    if (key === "energie" && value < 0) {
      payEnergy(s, -value).forEach((c) => changes.push(c));
      return;
    }
    if (STAT_KEYS.includes(key)) {
      const before = s.stats[key];
      bump(s, key, value);
      if (s.stats[key] !== before) changes.push({ kind: "stat", key, delta: s.stats[key] - before });
      return;
    }
    if (key === "popularity") {
      const before = s.popularity;
      const avant = s.appeal ? { ...s.appeal } : null;

      // Positionnée, elle se répartit ; nue, elle touche tout le monde pareil.
      if (effects.axis && s.appeal) applyPositionedPopularity(s, value, effects.axis);
      else bumpPop(s, value);

      pushAppealChanges(changes, avant, s, before);
      return;
    }
    // Le positionnement se lit avec "popularity" : seul, il ne fait rien.
    if (key === "axis") return;
    // ÉCRIT À LA MAIN. La formule des axes couvre l'immense majorité des cas ;
    // il reste les scènes où une réaction n'a rien d'idéologique — un scandale
    // qui ne fâche que les siens, un ralliement qui ne parle qu'à un camp.
    if (key === "appeal") {
      if (!s.appeal) return;
      const before = s.popularity;
      const avant = { ...s.appeal };
      Object.entries(value).forEach(([party, delta]) => bumpAppeal(s, party, delta));
      syncPopularity(s);
      pushAppealChanges(changes, avant, s, before);
      return;
    }
    if (key === "standing") {
      const before = s.standing;
      bumpStanding(s, value);
      if (s.standing !== before) changes.push({ kind: "gauge", key: "standing", delta: s.standing - before });
      return;
    }
    if (key === "money") {
      const before = s.money;
      pay(s, value);
      if (s.money !== before) changes.push({ kind: "money", delta: s.money - before });
      return;
    }
    // L'avantage pris ou perdu dans une campagne ordinaire. On ne l'affiche
    // pas en points : le joueur le lit dans la phrase qui décrit la campagne.
    // L'avantage pris dans une campagne, la sienne ou celle qu'on soutient.
    if (key === "score") {
      if (s.race) s.race.bonus += value;
      // La présidentielle qu'on ne dispute pas a désormais un sondage, et
      // c'est lui qu'on déplace : le compteur invisible d'avant ne se voyait
      // nulle part et ne se recoupait avec rien.
      else if (s.support) shiftSupport(s, value * SUPPORT_WEIGHT);
      return;
    }
    // Ce qu'un choix fait à la cote du gouvernement. Un député d'opposition
    // qui démolit un ministre en séance abîme le pouvoir ; un ministre qui
    // tient sa réforme le renforce.
    // LA DISSOLUTION. Le président rend la parole au pays : des législatives
    // anticipées au tour suivant, hors calendrier, sans décaler le cycle
    // ordinaire. C'est le geste le plus risqué de la Cinquième République et
    // il est réservé aux événements qui le méritent.
    if (key === "dissolve") {
      if (!value) return;
      s.dissolution = s.turn + 1;
      changes.push({ kind: "dissolve" });
      return;
    }
    if (key === "approval") {
      const before = s.approval || 0;
      s.approval = clamp100(before + value);
      const delta = Math.round(s.approval - before);
      if (delta) changes.push({ kind: "approval", delta });
      return;
    }
    if (key === "poll" && s.campaign) {
      // Entre les deux tours, le sondage qui compte n'est plus celui du
      // premier : c'est le face-à-face, et c'est lui qu'on déplace.
      const duel = s.campaign.duel;
      const field = duel ? duel.field : s.campaign.field;
      const me = field.find((c) => c.isPlayer);
      if (!me) return;

      const before = me.share;
      if (duel) shiftRunoff(s, value);
      else shiftPoll(s, value);
      const delta = Math.round(me.share - before);
      if (delta) changes.push({ kind: "poll", delta });
      return;
    }
    // Un trait s'affiche comme un tout : le nom, puis les points de
    // statistiques qu'il apporte ou qu'il coûte.
    if (key === "trait") {
      const gained = addTrait(s, value);
      if (gained) {
        changes.push({ kind: "trait", key: value, gained: true });
        gained.forEach((c) => changes.push(c));
      }
      return;
    }
    // Un écart de plus. La marque ne tombe qu'à la récidive.
    if (key === "strike") {
      const marque = addStrike(s, value);
      if (marque) {
        changes.push(marque.kind === "trait" ? { kind: "trait", key: value, gained: true } : marque);
        (marque.stats || []).forEach((c) => changes.push(c));
      }
      return;
    }
    if (key === "untrait") {
      const lost = removeTrait(s, value);
      if (lost) {
        changes.push({ kind: "trait", key: value, gained: false });
        lost.forEach((c) => changes.push(c));
      }
      return;
    }
    if (key === "flags") {
      Object.entries(value).forEach(([flag, on]) => {
        if (Boolean(s.flags[flag]) !== Boolean(on)) changes.push({ kind: "flag", key: flag, on: Boolean(on) });
      });
      Object.assign(s.flags, value);
      return;
    }
    // Le rapport de force entre les partis. On mesure le déplacement réel
    // après normalisation : deux points donnés à un camp ne sont jamais tout
    // à fait deux points une fois le tableau ramené à cent.
    if (key === "landscape") {
      Object.entries(value).forEach(([token, amount]) => {
        const party = landscapeTarget(s, token);
        if (!party) return;
        const moved = moveShare(s, party, amount);
        if (Math.abs(moved) >= 0.05) {
          changes.push({ kind: "landscape", key: party, delta: Math.round(moved * 10) / 10 });
        }
      });
      return;
    }
    // Une fonction qui ne s'élit pas : un ministère qu'on vous propose, une
    // tête de liste européenne dont on veut vous voir occupé, un retour au
    // groupe après une sortie de route.
    if (key === "office") {
      const before = s.position;
      // ON NE RETOMBE JAMAIS. Une fonction se gagne ; elle ne se reçoit pas
      // en consolation. Un événement qui vous fait quitter un poste écrit
      // "none" et le moteur applique la règle commune : le parti vous garde
      // si vous pesez encore, sinon vous n'êtes plus rien. Sept sorties de
      // ministère rendaient leur titulaire député, y compris ceux qui ne
      // l'avaient jamais été.
      const cible = value === "none" ? officeAfterDefeat(s) : value;
      if (setOffice(s, cible)) {
        changes.push({ kind: "office", key: cible, up: LADDER.indexOf(cible) > LADDER.indexOf(before) });
      }
      // ON REFORME LE GOUVERNEMENT TOUT DE SUITE. ensureGovernment ne
      // tournait qu'au tour suivant : entre l'événement qui vous donne
      // Matignon et le tour d'après, le pays avait deux Premiers ministres,
      // et le panneau du pouvoir les affichait tous les deux.
      if ((cible === "premier" || cible === "ministre" || before === "premier" ||
           before === "ministre") && typeof ensureGovernment === "function") {
        ensureGovernment();
      }
      return;
    }
    // LA DIRECTION DU PARTI, DONNÉE OU RENDUE HORS CONGRÈS. Une direction se
    // prend au congrès, mais elle se perd aussi entre deux congrès : une
    // direction collégiale qu'on accepte, une démission après une déroute,
    // un intérim qu'on vous confie parce que personne d'autre n'en veut. Le
    // mandat, lui, ne bouge pas : c'est tout l'objet du cumul.
    if (key === "lead") {
      if (typeof setPartyLead === "function" && setPartyLead(s, Boolean(value))) {
        changes.push({ kind: "lead", on: Boolean(value) });
      }
      return;
    }
    if (key === "join") {
      const party = landscapeTarget(s, value);
      if (party && switchParty(s, party)) changes.push({ kind: "party", key: party });
      return;
    }
    if (key === "alliance") {
      const party = value === null ? null : landscapeTarget(s, value);
      const had = s.alliance ? s.alliance.party : null;
      if (party === had) return;
      setAlliance(s, party);
      changes.push({ kind: "alliance", key: party || had, on: Boolean(party) });
      return;
    }
    if (key === "chain") {
      (Array.isArray(value) ? value : [value]).forEach((id) => scheduleChain(s, id));
      return;
    }
    if (key === "end") { s.ended = { type: value }; return; }
  });

  return changes;
}

/**
 * Ce qu'un mouvement d'opinion a réellement déplacé. On rapporte la base et
 * la générale séparément, plus le détail par électorat quand il est parlant :
 * c'est ce que la carte de résultat doit pouvoir montrer.
 */
function pushAppealChanges(changes, avant, s, popAvant) {
  if (!avant) {
    if (s.popularity !== popAvant) {
      changes.push({ kind: "gauge", key: "popularity", delta: s.popularity - popAvant });
    }
    return;
  }
  appealChanges(avant, s).forEach((c) => changes.push(c));
}

/**
 * CE QU'UN MOUVEMENT D'OPINION A DÉPLACÉ, DIT LE PLUS BRIÈVEMENT POSSIBLE.
 *
 * Un effet qui ne clive pas touche les six électorats du même montant : les
 * détailler produisait six pastilles disant six fois la même chose. Quand
 * les autres électorats bougent ensemble, on n'écrit donc qu'une ligne,
 * « popularité générale ». Le détail n'apparaît que lorsqu'il apprend
 * quelque chose, c'est-à-dire quand le choix a divisé le pays.
 */
function appealChanges(avant, s) {
  const out = [];

  const base = Math.round(s.appeal[s.party] - avant[s.party]);
  if (base) out.push({ kind: "appeal", key: s.party, delta: base, base: true });

  const autres = Object.keys(PARTIES)
    .filter((key) => key !== s.party)
    .map((key) => ({ kind: "appeal", key, delta: Math.round(s.appeal[key] - avant[key]) }))
    .filter((c) => c.delta);

  if (!autres.length) return out;

  const min = Math.min(...autres.map((c) => c.delta));
  const max = Math.max(...autres.map((c) => c.delta));
  const ensemble = autres.length === Object.keys(PARTIES).length - 1 && max - min <= 1;

  if (ensemble) out.push({ kind: "appeal", general: true, delta: Math.round((min + max) / 2) });
  else autres.forEach((c) => out.push(c));

  return out;
}

/* ---------- Choix disponibles ---------- */

/**
 * Tous les choix ne sont pas toujours offerts. Un choix peut porter son
 * propre "when" : il n'apparaît que si la situation s'y prête (assez
 * d'argent, la bonne fonction, le bon parcours…). On renvoie les choix
 * jouables avec leur index d'origine, pour que les boutons restent liés
 * au bon élément du tableau.
 */
function availableChoices(ev, s) {
  const ouverts = ev.choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => !choice.when || eventMatches({ when: choice.when }, s));

  // ON NE DÉPENSE PAS CE QU'ON N'A PAS.
  //
  // L'énergie est bornée à zéro : un choix qui coûtait trois points ne
  // coûtait donc plus rien à qui n'en avait plus. Arrivé à sec, on répondait
  // oui à tout gratuitement, et la seule ressource que le jeu demande de
  // gérer devenait un plafond de dépenses illimité. Le zéro était la
  // meilleure position du jeu, ce qui est l'exact contraire de ce qu'il
  // raconte.
  //
  // Une option qui demande trois jours de vie n'est plus proposée à qui n'en
  // a plus trois. On retient le coût le PLUS ÉLEVÉ des branches d'un jet :
  // au moment de choisir, on ne sait pas si l'on va réussir, et un choix ne
  // doit jamais pouvoir se solder par un découvert.
  const reste = s.stats.energie;
  const abordables = ouverts.filter(({ choice }) => energyCost(choice) <= reste);
  if (abordables.length) return abordables;

  // FILET. Une carte sans aucun choix jouable n'est pas une carte. Si tout
  // est trop cher, on laisse les moins chers : à ce stade le personnage
  // n'a plus le luxe de choisir, il a celui de faire le minimum.
  const minimum = Math.min(...ouverts.map(({ choice }) => energyCost(choice)));
  return ouverts.filter(({ choice }) => energyCost(choice) === minimum);
}

/**
 * Ce qu'un choix coûte en énergie, au pire. Un jet coûte ce que coûte sa
 * branche la plus chère : on choisit avant de savoir laquelle sortira.
 */
function energyCost(choice) {
  const cout = (branche) => {
    const e = branche && branche.effects && branche.effects.energie;
    return e < 0 ? -e : 0;
  };
  return Math.max(cout(choice), cout(choice.success), cout(choice.failure));
}

/* ---------- Jets de dés ---------- */

/**
 * Calcule les chances de réussite d'un choix. Trois formes possibles :
 *
 *   1. Aucun "roll"          → le choix réussit toujours.
 *   2. "chance": 0.6         → probabilité fixe, ajustable par "chanceBonus".
 *   3. "base" + "stat"       → score composite comparé à une difficulté.
 *
 * Dans le troisième cas le score additionne :
 *     la statistique principale ("stat", poids 1)
 *   + les contributions secondaires ("plus" : autres stats, popularité, cote)
 *   + les bonus conditionnels ("bonus" : un "when" et une valeur)
 *   + un dé de 0 à "dice" (6 par défaut)
 *
 * C'est ce qui permet à un même choix d'être facile pour un chef de parti
 * charismatique et périlleux pour un militant inconnu.
 */
function rollScore(roll, s) {
  return rollBase(roll, s) + Math.random() * rollDice(roll);
}

function rollDice(roll) {
  return roll.dice === undefined ? 6 : roll.dice;
}

/** La part certaine du score, celle qui ne doit rien au dé. */
/**
 * CE QUE LA FATIGUE COÛTE.
 *
 * Elle ne rend pas moins aimé : elle fait rater. En dessous de huit, on
 * prépare mal, on répond à côté, on laisse passer la question qu'il fallait
 * poser. Le malus s'applique à tous les jets, et le joueur le voit venir,
 * puisque l'interface prévient quand un choix devient très risqué.
 */
function fatigueMalus(s) {
  return Math.min(0, (s.stats.energie - 8) * 0.4);
}

function rollBase(roll, s) {
  let score = (roll.stat ? statScore(s, roll.stat) : 0) + fatigueMalus(s);

  if (roll.plus) {
    Object.entries(roll.plus).forEach(([key, weight]) => {
      if (key === "popularity") score += s.popularity * weight;
      else if (key === "standing") score += s.standing * weight;
      else if (key === "money") score += (s.money / 100000) * weight;
      else if (STAT_KEYS.includes(key)) score += statScore(s, key) * weight;
    });
  }

  if (roll.bonus) {
    roll.bonus.forEach((b) => {
      if (!b.when || eventMatches({ when: b.when }, s)) score += b.value;
    });
  }

  return score;
}

/** Le seuil à franchir. */
function rollTarget(roll) {
  return roll.base !== undefined ? roll.base : roll.difficulty;
}

/**
 * Les chances de réussite, calculées et non tirées. Le joueur les voit avant
 * de choisir : le hasard doit être un risque assumé, pas une surprise.
 * Le dé étant uniforme, la probabilité se lit directement sur l'écart entre
 * la part certaine du score et le seuil.
 */
function rollChance(roll, s) {
  if (!roll) return 1;

  if (roll.chance !== undefined) {
    let chance = roll.chance;
    if (roll.chanceBonus) {
      roll.chanceBonus.forEach((b) => {
        if (!b.when || eventMatches({ when: b.when }, s)) chance += b.value;
      });
    }
    return Math.max(0.02, Math.min(0.98, chance));
  }

  const dice = rollDice(roll);
  const margin = rollBase(roll, s) + dice - rollTarget(roll);
  return Math.max(0, Math.min(1, margin / dice));
}

/** Le choix réussit-il ? */
function rollSucceeds(roll, s) {
  if (roll.chance !== undefined) return Math.random() < rollChance(roll, s);
  return rollScore(roll, s) >= rollTarget(roll);
}

/**
 * Regroupe les variations d'une même chose, pour n'afficher qu'une pastille
 * par statistique même quand plusieurs blocs d'effets s'additionnent.
 */
function mergeChanges(changes) {
  const merged = [];

  changes.forEach((change) => {
    const twin = merged.find((m) =>
      m.kind === change.kind && m.key === change.key && typeof m.delta === "number");
    if (twin && typeof change.delta === "number") twin.delta += change.delta;
    else merged.push({ ...change });
  });

  return merged.filter((change) => change.delta === undefined || change.delta !== 0);
}

/**
 * Joue un choix : résout le jet s'il y en a un, applique les effets de la
 * branche retenue, et renvoie son texte de résultat avec la liste de ce qui
 * a changé.
 *
 * Une branche peut porter des effets CONDITIONNELS ("effectsIf") : le même
 * geste ne coûte pas la même chose à tout le monde. Un arrangement passe
 * inaperçu chez un calculateur et démolit quelqu'un qui s'était fait une
 * réputation d'intégrité ; une provocation qui ravit une base radicale
 * effraie un électorat centriste. C'est là que le profil du personnage cesse
 * d'être décoratif.
 */
function resolveChoice(choice, s) {
  const branch = !choice.roll
    ? choice
    : (rollSucceeds(choice.roll, s) ? choice.success : choice.failure);

  // Seul un pari perdu s'amortit. Un choix sûr assumé n'a rien à amortir :
  // on savait ce qu'on faisait.
  const soften = choice.roll && branch === choice.failure ? investNerve(s) : 0;

  let changes = applyEffects(branch.effects, s, soften);

  (branch.effectsIf || []).forEach((rule) => {
    if (!rule.when || eventMatches({ when: rule.when }, s)) {
      changes = changes.concat(applyEffects(rule.effects, s, soften));
    }
  });

  return {
    text: fillText(branch.result, s),
    log: fillBoth(branch.result, s),
    changes: mergeChanges(changes),
    won: choice.roll ? branch === choice.success : null,
  };
}

/** Marque un événement comme vu, pour les "once". */
function markSeen(ev, s) {
  if (!s.seen) s.seen = {};
  s.seen[ev.id] = true;
}

/* ==========================================================================
   Les suites, et le temps qu'elles mettent
   ==========================================================================
   Une affaire ne sort pas six mois après les faits, une dette d'appareil ne
   se rappelle pas au tour suivant, un procès met des années à s'ouvrir. Un
   maillon de chaîne annonce donc lui-même son délai, en tours, dans son
   champ "delay" : le moteur le programme et l'oublie jusqu'à l'échéance.

   C'est ce décalage qui fait qu'on ne relie pas immédiatement la
   conséquence à la décision, et c'est exactement ce qu'on cherche.
   ========================================================================== */

/** Délai par défaut quand un maillon n'en déclare pas : de six mois à un an. */
const DEFAULT_CHAIN_DELAY = [1, 2];

/** Au-delà, une suite dont les conditions ne sont jamais réunies est oubliée. */
const CHAIN_PATIENCE = 14;

function pendingChains(s) {
  return s.pending || (s.pending = []);
}

/** Programme une suite pour dans quelques tours. */
function scheduleChain(s, id) {
  const ev = EVENTS.find((e) => e.id === id);
  if (!ev) return;

  const range = Array.isArray(ev.delay) ? ev.delay : DEFAULT_CHAIN_DELAY;
  const delay = range[0] + randInt(Math.max(1, range[1] - range[0] + 1));

  pendingChains(s).push({ id, turn: s.turn + delay, expires: s.turn + delay + CHAIN_PATIENCE });
}

/**
 * La suite arrivée à échéance, s'il y en a une de jouable. Une suite dont les
 * conditions ne sont pas réunies attend son heure, puis finit par tomber :
 * toutes les affaires ne sortent pas.
 */
function dueChain(s) {
  const pending = pendingChains(s);

  for (let i = 0; i < pending.length; i++) {
    const entry = pending[i];
    if (entry.turn > s.turn) continue;

    const ev = EVENTS.find((e) => e.id === entry.id);
    if (ev && eventMatches(ev, s)) {
      pending.splice(i, 1);
      return ev;
    }
    if (entry.expires <= s.turn) { pending.splice(i, 1); i--; }
  }
  return null;
}

/* ==========================================================================
   Ce que les traits font à chaque tour
   ========================================================================== */

/**
 * Revenus discrets et risques qui vont avec. Un trait qui rapporte de
 * l'argent finit toujours par coûter autre chose.
 */
function applyTraitTurn(s) {
  const income = traitSum(s, (d) => d.income);
  if (income) pay(s, income);

  traitsOf(s).forEach((id) => {
    const risk = TRAIT_DATA[id] && TRAIT_DATA[id].risk;
    if (!risk || s.seen[risk.chain]) return;
    if (pendingChains(s).some((entry) => entry.id === risk.chain)) return;
    if (Math.random() < risk.p * (1 - investProtect(s))) scheduleChain(s, risk.chain);
  });

  wealthAttention(s);
}

/* ==========================================================================
   La fortune qui dort
   ==========================================================================
   L'argent ne coûtait rien à garder. Une carrière qui n'achetait rien
   terminait avec près d'un million d'euros dormant sur un compte, sans
   qu'aucun événement, aucun journaliste et aucun juge ne s'en aperçoive.
   Comme rien ne pressait de le dépenser, le dépenser était toujours gratuit :
   c'est la vraie raison pour laquelle il fallait toujours payer, dans tous
   les événements.

   Un patrimoine ne se cache pas éternellement. Passé le niveau où un élu
   peut expliquer sa fortune par son indemnité, quelqu'un finit par poser la
   question — la presse, la Haute Autorité, un adversaire qui sait compter.
   L'argent propre attire un contrôle qu'on passe ; l'argent sale attire une
   enquête qu'on ne passe pas toujours.
   ========================================================================== */

/** Ce qu'une carrière d'élu explique sans faire sourire personne. */
const WEALTH_EXPLAINABLE = 400000;

/**
 * Probabilité par tour qu'on regarde vos comptes de près.
 *
 * On ne compte pas la fortune, on compte L'ENRICHISSEMENT. Personne n'a
 * jamais reproché à un héritier d'avoir hérité : ce qu'on lui demande, c'est
 * d'où vient ce qu'il n'avait pas avant. Sans cette distinction, un candidat
 * né riche était soupçonné dès le premier tour pour de l'argent gagné avant
 * son entrée en politique, ce qui n'a aucun sens.
 *
 * L'argent propre attire un contrôle, qu'on passe et dont on se vante ;
 * l'argent sale attire un juge. Les avocats à l'année valent dans les deux
 * cas : c'est très exactement à cela qu'ils servent.
 */
function wealthRisk(s) {
  const gagné = Math.max(0, s.money - (s.startMoney || 0) - WEALTH_EXPLAINABLE);
  if (!gagné && !s.flags.dirtyMoney) return 0;

  let p = (gagné / 1000000) * 0.02;
  if (s.flags.dirtyMoney) p = p * 3 + 0.012;
  return Math.min(0.05, p) * (1 - investProtect(s));
}

function wealthAttention(s) {
  const chain = s.flags.dirtyMoney ? "enquete_ouverte" : "patrimoine_declare";
  if (s.seen[chain]) return;
  if (pendingChains(s).some((entry) => entry.id === chain)) return;
  if (Math.random() < wealthRisk(s)) scheduleChain(s, chain);
}

/* ==========================================================================
   Le second tour
   ==========================================================================
   Une présidentielle ne se gagne pas avec le premier tour. Il faut d'abord
   être dans les deux premiers, puis récupérer les voix des éliminés, et
   celles-là ne se commandent pas : elles vont au moins éloigné.

   C'est là que le positionnement se paie. Un candidat qui a passionné sa
   base et effrayé tout le monde arrive en tête le dimanche du premier tour
   et perd le second, ce qui est exactement ce qui doit pouvoir arriver.
   ========================================================================== */

/** Positionnement du camp au pouvoir, qui n'a pas de parti dans le jeu. */
const NEUTRAL_AXES = { social: 5, world: -15, economy: 25, power: 5 };

function partyAxes(key) {
  return key && PARTIES[key] ? PARTIES[key].axes : NEUTRAL_AXES;
}

/** Distance idéologique entre deux partis, de 0 (identiques) à 1 (opposés). */
/**
 * En dessous de cette distance, deux partis sont voisins : ils peuvent se
 * détester en public et avoir besoin l'un de l'autre en privé. Calé pour que
 * chaque camp ait un ou deux voisins, jamais quatre.
 */
const NEIGHBOUR_DISTANCE = 0.26;

function ideologicalDistance(a, b) {
  const A = partyAxes(a);
  const B = partyAxes(b);
  return AXES.reduce((sum, ax) => sum + Math.abs(A[ax] - B[ax]), 0) / (AXES.length * 200);
}

/**
 * La part de l'électorat qui refuse de se reporter sur un candidat, quelle
 * que soit sa proximité. C'est le prix des choix qui font gagner le premier
 * tour : la radicalité, les affaires, la parole reniée.
 */
function rejectionRate(candidate, s) {
  if (!candidate.isPlayer) return 0.14;

  let rate = 0.14;
  // On hérite de ce que le pays reproche à son allié. S'allier à un parti
  // que la moitié du pays refuse, c'est acheter des voix au premier tour et
  // en perdre au second.
  if (s.alliance && PARTIES[s.alliance.party]) {
    rate += (PARTIES[s.alliance.party].difficulty - 2) * 0.045;
  }
  // Ce que vos traits ajoutent ou retirent est écrit dans js/traits.data.js :
  // le moteur ne connaît aucun trait par son nom.
  rate += traitSum(s, (d) => d.rejection);
  if (s.flags.onTrial) rate += 0.16;

  // LA STATURE, AU SECOND TOUR. C'est le moment où le pays doit se dire qu'il
  // vous voit à l'Élysée. Un candidat sans crédibilité perd là des électeurs
  // qui, au premier tour, l'avaient trouvé sympathique.
  rate += (11 - statScore(s, "credibilite")) * 0.014;

  return Math.max(0, Math.min(0.75, rate));
}

/**
 * Reporte les voix des éliminés sur les deux finalistes et renvoie le
 * second tour. Une part des électeurs ne se reporte sur personne : c'est
 * l'abstention du dimanche suivant.
 */
function runoff(field, s) {
  const sorted = [...field].sort((a, b) => b.share - a.share);
  const finalists = sorted.slice(0, 2).map((c) => ({ ...c, first: c.share }));
  const eliminated = sorted.slice(2);

  const ally = s.alliance ? s.alliance.party : null;

  eliminated.forEach((out) => {
    // La proximité commande le report, mais jamais entièrement : dans un
    // second tour, une part de l'électorat vote contre plutôt que pour, et
    // aucun finaliste ne se retrouve à zéro. Sans ce socle, un candidat de
    // rupture ne pourrait jamais gagner, ce qui n'est pas ce que le jeu
    // raconte : il doit pouvoir gagner, mais rarement.
    //
    // C'est ici que se paie une alliance : un allié éliminé appelle à voter
    // pour vous, et ses électeurs suivent presque tous. Personne d'autre ne
    // vous rendra ce service.
    const allied = Boolean(ally) && out.party === ally;

    const weights = finalists.map((f) => {
      const proximity = 1 - ideologicalDistance(out.party, f.party);
      const base = (0.38 + Math.pow(Math.max(0.05, proximity), 2)) * (1 - rejectionRate(f, s));
      // Le pacte vaut pour votre camp, que vous soyez le candidat ou non :
      // c'est un accord entre partis, pas entre personnes.
      return allied && (f.isPlayer || f.mine) ? base * 2.6 : base;
    });

    const total = weights[0] + weights[1] || 1;
    const transferred = out.share * (allied ? 0.88 : 0.72);
    finalists[0].share += transferred * (weights[0] / total);
    finalists[1].share += transferred * (weights[1] / total);
  });

  // Le second tour n'est pas qu'une addition de premiers tours : quinze jours
  // de face-à-face, et celui que le pays aime le mieux prend l'avantage.
  finalists.forEach((f) => {
    const standing = f.pop === undefined ? 45 : f.pop;
    f.share *= 1 + (standing - 50) * 0.008;
  });

  const total = finalists.reduce((sum, f) => sum + f.share, 0) || 1;
  finalists.forEach((f) => { f.share = (f.share / total) * 100; });
  finalists.sort((a, b) => b.share - a.share);

  return { finalists, winner: finalists[0] };
}

/**
 * La vie du sondage entre deux temps de campagne. Les adversaires ne
 * regardent pas le joueur monter sans rien faire : eux aussi ont des bons
 * jours, et le mieux placé d'entre eux profite de la dynamique.
 */
function driftCampaign(s) {
  const others = s.campaign.field.filter((c) => !c.isPlayer);
  if (!others.length) return;

  const best = others.reduce((top, c) => (c.share > top.share ? c : top), others[0]);
  others.forEach((c) => {
    c.share = Math.max(1, c.share + (Math.random() - 0.5) * 2.4 + (c === best ? 0.5 : 0));
  });

  const total = s.campaign.field.reduce((sum, c) => sum + c.share, 0) || 1;
  s.campaign.field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * La vie du face-à-face entre deux temps d'entre-deux-tours. On bouge moins
 * qu'au premier tour : à ce stade, un sondage qui varie de trois points en
 * deux jours n'est pas un sondage, c'est une erreur d'échantillon.
 */
function driftRunoff(s) {
  const field = s.campaign.duel.field;
  const me = field.find((c) => c.isPlayer);
  const other = field.find((c) => !c.isPlayer);
  if (!me || !other) return;

  me.share = Math.max(15, Math.min(85, me.share + (Math.random() - 0.5) * 1.2));
  other.share = 100 - me.share;
}

/* ==========================================================================
   Fins de partie
   ==========================================================================
   Le moteur ne connaît que quatre façons de s'arrêter. La fin racontée, elle,
   dépend de l'état exact de la carrière : c'est dans js/endings.data.js.
   ========================================================================== */

/** La fin correspondant à l'état final, la première qui colle l'emportant. */
function resolveEnding(s) {
  const type = s.ended && s.ended.type;
  return (
    ENDING_DATA.find((e) => e.from === type && (!e.when || eventMatches({ when: e.when }, s))) ||
    ENDING_DATA.find((e) => e.from === type) ||
    null
  );
}
