/*
 * President Material — CE QUE LE PAYS PENSE DE VOUS.
 *
 * La popularité n'est pas un nombre, c'est six : un électorat par parti, et
 * tout ce qu'on en tire — la base, la générale, la nationale, la note. Avec
 * la stature, qui dit ce qu'on vous accorde au-dessus de votre fonction, et
 * la crédibilité qui s'effrite quand on l'a construite trop haut.
 *
 * ON Y TROUVE AUSSI LE VOCABULAIRE PARTAGÉ : bump(), statScore(), pay() et
 * randInt(), appelés soixante-cinq fois depuis le reste du jeu. Ils
 * n'appartiennent pas plus à l'opinion qu'à autre chose ; ils sont ici parce
 * qu'il faut bien qu'ils soient quelque part, et que c'est ici qu'ils servent
 * le plus.
 *
 * Les chiffres sont dans js/balance.js.
 */
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
  if (state.appeal) {
    Object.keys(PARTIES).forEach((key) => {
      const proche = 1 - ideologicalDistance(key, state.party);
      const penchant = (proche - 0.68) * APPEAL_TILT * 2;
      // LE FILTRE JOUE DANS LES DEUX SENS, ET IL S'INVERSE. Les vôtres
      // accueillent mieux la bonne nouvelle ET encaissent mieux la mauvaise ;
      // ceux d'en face font l'exact contraire. Appliquer le même facteur aux
      // deux ferait punir votre propre camp plus fort que les autres, ce qui
      // est le contraire de ce qu'on veut dire.
      bumpAppeal(state, key, delta * (delta >= 0 ? 1 + penchant : 1 - penchant));
    });
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



/**
 * LE NIVEAU NATUREL DE CHAQUE ÉLECTORAT.
 *
 * Il n'y en avait qu'un, commun aux six, et c'était une faute : la dérive
 * tirait donc tout le monde vers la même valeur, l'écart de départ s'effaçait
 * en quelques années, et l'on finissait avec cinq électorats rigoureusement
 * identiques — et une base PLUS BASSE que les autres, parce qu'elle partait
 * plus haut et descendait pendant que les autres montaient. Un candidat de la
 * gauche radicale moins aimé de la gauche radicale que des identitaires.
 *
 * Chaque électorat a donc sa propre cible, calée sur la distance idéologique.
 * L'ensemble est décalé pour que la moyenne pondérée retombe exactement sur
 * popularityTarget() : le profil vaut toujours la même chose au total, il est
 * simplement réparti. Les positionnements écartent de ces cibles, la dérive y
 * ramène, et l'écart structurel ne se perd jamais.
 */
function appealTargets(s) {
  const brut = {};
  Object.keys(PARTIES).forEach((key) => {
    brut[key] = APPEAL_SPREAD * (0.5 - ideologicalDistance(key, s.party));
  });

  const { poids, total } = electorateWeights(s);
  let moyenne = 0;
  Object.keys(PARTIES).forEach((key) => { moyenne += brut[key] * poids[key]; });
  moyenne = total ? moyenne / total : 0;

  const cible = popularityTarget(s);
  const cibles = {};
  Object.keys(PARTIES).forEach((key) => {
    cibles[key] = clamp100(cible + brut[key] - moyenne);
  });
  return cibles;
}

function initialAppeal(s) {
  return appealTargets(s);
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
     popularité générale     la moyenne des AUTRES, pondérée par leur taille
     popularité nationale    la moyenne des SIX, pondérée par leur taille
     game.popularity         la note : les six, pondérés par ce qu'ils vous
                             rapportent — deux tiers pour les vôtres, le reste
                             par taille et par proximité (voir reachWeights)

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



function reachWeights(s) {
  const poids = {};
  let autres = 0;
  Object.keys(PARTIES).forEach((key) => {
    if (key === s.party) return;
    const taille = Math.max(1, (s.landscape && s.landscape[key]) || 1);
    poids[key] = taille * Math.pow(1 - ideologicalDistance(key, s.party), REACH_FALLOFF);
    autres += poids[key];
  });
  Object.keys(poids).forEach((key) => {
    poids[key] = autres ? (poids[key] / autres) * (1 - POPULARITY_FOCUS) : 0;
  });
  poids[s.party] = autres ? POPULARITY_FOCUS : 1;
  return { poids, total: 1 };
}

/** La note : ce que pensent de vous les gens que vous pouvez atteindre. */
function overallPopularity(s) {
  if (!s.appeal) return s.popularity;

  const { poids } = reachWeights(s);
  let somme = 0;
  Object.keys(PARTIES).forEach((key) => { somme += s.appeal[key] * poids[key]; });
  return somme;
}

/**
 * CE QUE LE PAYS PENSE DE VOUS, sans égard pour ce qu'il vous rapporte : la
 * moyenne des six pondérée par leur seule taille. C'est l'ancienne note, et
 * elle reste la bonne partout où l'on se compare au pays ou à quelqu'un
 * d'autre — une figure du jeu n'a qu'un nombre, national, et comparer sa
 * cote nationale à votre note de proximité reviendrait à vous offrir dix
 * points d'avance sur tous vos rivaux à chaque comparaison.
 */
function nationalPopularity(s) {
  if (!s.appeal) return s.popularity;

  const { poids, total } = electorateWeights(s);
  let somme = 0;
  Object.keys(PARTIES).forEach((key) => { somme += s.appeal[key] * poids[key]; });
  return total ? somme / total : s.popularity;
}

/**
 * OÙ LA NOTE VA, LUE SUR L'ÉCHELLE DE LA NOTE. popularityTarget() est le
 * niveau de la mer des six électorats, mesuré à la taille : depuis que la
 * note les pèse à la proximité, ce n'est plus le même nombre, et le repère du
 * curseur traînait une dizaine de points derrière la jauge en permanence.
 */
function noteTarget(s) {
  if (!s.appeal) return popularityTarget(s);
  const cibles = appealTargets(s);
  const { poids } = reachWeights(s);
  let somme = 0;
  Object.keys(PARTIES).forEach((key) => { somme += cibles[key] * poids[key]; });
  return somme;
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

/**
 * « DONNER À LA BASE CE QU'ELLE ATTEND » N'A PAS DE COORDONNÉES FIXES.
 *
 * Certaines scènes proposent de se caler sur son propre camp, et la position
 * dépend alors de qui l'on est : la même phrase n'est pas au même endroit
 * selon qu'on la prononce à la gauche radicale ou chez les identitaires.
 * "axis": "self" prend donc les axes du parti du joueur, "ally" ceux de son
 * allié, "scene" ceux du camp que la carte met en scène : des façons d'écrire
 * « là où je suis », ou « là où il est », sans écrire de chiffres. Prise avec
 * un montant négatif, la dernière dit qu'on prend cette ligne-là de front.
 */
function resolveAxis(position, s) {
  if (typeof position !== "string") return position;
  // Le vocabulaire est celui de "landscape" et de "appeal" : self, ally,
  // scene, ruling, ou une clef de parti. "scene" sert aux gestes qui se
  // situent par rapport à quelqu'un plutôt que dans le vide — on épouse la
  // ligne du camp d'en face, ou on la prend de front avec un montant négatif.
  const party = typeof landscapeTarget === "function"
    ? landscapeTarget(s, position)
    : (position === "self" ? s.party : null);
  return partyAxes(party);
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

/**
 * Coup immédiat sur la cote au sein du parti, AVEC LES MÊMES RENDEMENTS
 * DÉCROISSANTS QUE L'OPINION.
 *
 * La popularité les avait, la cote non : un service rendu à l'appareil valait
 * six points qu'on soit inconnu du siège ou déjà le deuxième homme du parti,
 * et rien ne freinait jamais rien. Mesuré sur quarante carrières menées par un
 * joueur qui prend à chaque fois le meilleur choix offert : la cote vivait
 * quinze points au-dessus de son point de repos — la popularité, quatre —,
 * dépassait soixante dès la dixième année et culminait à quatre-vingt-six.
 * L'appareil se conquérait en une décennie et ne se reperdait plus.
 *
 * MAIS PAS LA MÊME COURBE QUE LA POPULARITÉ. Celle de l'opinion freine dès le
 * premier point : un inconnu qui gagne trente de popularité n'en encaisse que
 * vingt-quatre. Appliquée telle quelle à la cote, elle rendait le milieu de
 * carrière aussi lourd que le sommet, et c'est le sommet qui disparaissait :
 * la direction du parti, qui se prend à soixante et onze, passait de sept
 * carrières sur quarante à deux.
 *
 * Il y a donc une zone franche. Jusqu'à quarante-cinq, l'appareil donne sans
 * compter : on rend des services, on est noté, rien ne freine — c'est la
 * montée ordinaire d'un cadre, et elle ne pose aucun problème. Au-delà, chaque
 * point coûte plus cher que le précédent : les places sont prises, et ceux qui
 * les tiennent vous doivent déjà tout. À soixante-dix, un gain vaut les trois
 * quarts ; à quatre-vingt-dix, la moitié.
 *
 * Les mauvaises nouvelles, elles, se paient plein tarif.
 */
function standingGainRate(standing) {
  if (standing <= 45) return 1;
  return Math.max(0.25, 1 - (standing - 45) / 90);
}

function bumpStanding(state, delta) {
  const d = delta > 0 ? delta * standingGainRate(state.standing) : delta;
  state.standing = clamp100(state.standing + d);
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



function credibilityTarget(s) {
  const office = CREDIBILITY_BY_OFFICE[s.position];
  if (office === undefined) return undefined;
  if (!leadsParty(s)) return office;
  return Math.max(office, CREDIBILITY_LEAD) +
    (office > CREDIBILITY_LEAD ? CREDIBILITY_LEAD_BONUS : 0);
}


function credibilityDrift(s) {
  if (s.turn % (TURNS_PER_YEAR * 2) !== 0) return;

  const cible = credibilityTarget(s);
  if (cible === undefined) return;

  if (s.stats.credibilite < cible) bump(s, "credibilite", +1);
  // Ce qu'on a construit au-dessus de sa fonction s'effrite, sans jamais
  // redescendre au niveau du poste : une stature acquise ne se perd pas
  // entièrement en changeant de bureau.
  else if (s.stats.credibilite > cible + CREDIBILITY_OVERSHOOT) bump(s, "credibilite", -1);
}
