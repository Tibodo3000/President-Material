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
 */
const LADDER = ["militant", "cadre", "conseiller", "maire", "euro", "depute", "ministre", "chef", "premier"];

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
  return s.standing >= NO_OFFICE_STANDING ? "cadre" : "militant";
}

/* Les indemnités, le train de vie et les postes de dépense sont dans
   js/budget.data.js. */

/**
 * Calendrier électoral, en tours (2 tours = 1 an).
 * Une élection a lieu quand (tour % cycle) === offset.
 */
const ELECTIONS = [
  { id: "presidentielle", cycle: 10, offset: 0 },
  { id: "legislatives", cycle: 10, offset: 6 },
  { id: "congres", cycle: 8, offset: 3 },
  { id: "municipales", cycle: 12, offset: 1 },
  { id: "europeennes", cycle: 10, offset: 8 },
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
 * Exposition publique liée à la fonction : un maire est plus vu qu'un
 * militant. Le député européen est l'exception qui dit tout : le mandat est
 * important, la fonction est invisible, et c'est bien pour cela qu'on y
 * envoie les gens dont on veut se débarrasser.
 */
const POSITION_EXPOSURE = {
  militant: 0, cadre: 3, conseiller: 4, maire: 10, euro: 8, depute: 14,
  ministre: 28, chef: 22, premier: 40,
};

/** Poids interne de la fonction dans l'appareil du parti. */
const POSITION_RANK = {
  militant: 0, cadre: 2, conseiller: 1, maire: 3, euro: 2, depute: 4,
  ministre: 5, chef: 7, premier: 6,
};

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
    POSITION_EXPOSURE[s.position] * 0.7 +
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
    fit * 2.5 + POSITION_RANK[s.position] * 3.2 +
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
function deathProbability(state) {
  if (state.age < 60) return 0;
  let p = (state.age - 60) * 0.003 + 0.002;
  if (state.age >= 92) return 1;
  if (state.flags.carefulHealth) p /= 2;
  if (state.flags.frailHealth) p *= 2;
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
  if (state.stats.energie <= 2) p += 0.02;
  else if (state.stats.energie <= 5) p += 0.008;
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
  let d = delta;
  if (d > 0) d *= Math.max(0.25, 1 - state.popularity / 150);
  else d *= 1 - traitSoften(state);

  state.popularity = clamp100(state.popularity + d);
}

/** Coup immédiat sur la cote au sein du parti. */
function bumpStanding(state, delta) {
  state.standing = clamp100(state.standing + delta);
}

/** Ajoute ou retire de l'argent, plancher à zéro. */
function pay(state, amount) {
  state.money = Math.max(0, state.money + amount);
}

/** Tirage : la statistique (ramenée sur 10 par STAT_SCALE) plus un dé
    contre une difficulté. */
function test(state, stat, difficulty) {
  return state.stats[stat] + Math.random() * 6 >= difficulty;
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
 * décide de la stature qu'une carrière atteint sans rien faire de spécial.
 */
const CREDIBILITY_BY_OFFICE = {
  militant: 3, cadre: 6, conseiller: 6, maire: 10,
  euro: 8, depute: 12, ministre: 16, chef: 15, premier: 19,
};

/** Marge au-dessus de la fonction qu'on peut tenir grâce à ses seuls choix. */
const CREDIBILITY_OVERSHOOT = 4;

function credibilityDrift(s) {
  if (s.turn % 4 !== 0) return;

  const cible = CREDIBILITY_BY_OFFICE[s.position];
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
   Les événements ne vivent plus dans le code mais dans js/events.data.js,
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
  if (w.position && !w.position.includes(s.position)) return false;
  if (w.origin && !w.origin.includes(s.character.origin)) return false;
  if (w.background && !w.background.includes(s.character.background)) return false;
  if (w.personality && !w.personality.includes(s.character.personality)) return false;

  if (w.minAge !== undefined && s.age < w.minAge) return false;
  if (w.maxAge !== undefined && s.age > w.maxAge) return false;
  if (w.minTurn !== undefined && s.turn < w.minTurn) return false;
  if (w.maxTurn !== undefined && s.turn > w.maxTurn) return false;
  if (w.minPopularity !== undefined && s.popularity < w.minPopularity) return false;
  if (w.maxPopularity !== undefined && s.popularity > w.maxPopularity) return false;
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
    if (STAT_KEYS.includes(key)) {
      const before = s.stats[key];
      bump(s, key, value);
      if (s.stats[key] !== before) changes.push({ kind: "stat", key, delta: s.stats[key] - before });
      return;
    }
    if (key === "popularity") {
      const before = s.popularity;
      bumpPop(s, value);
      if (s.popularity !== before) changes.push({ kind: "gauge", key: "popularity", delta: s.popularity - before });
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
    if (key === "score" && s.race) {
      s.race.bonus += value;
      return;
    }
    if (key === "poll" && s.campaign) {
      const me = s.campaign.field.find((c) => c.isPlayer);
      const before = me.share;
      shiftPoll(s, value);
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

/* ---------- Choix disponibles ---------- */

/**
 * Tous les choix ne sont pas toujours offerts. Un choix peut porter son
 * propre "when" : il n'apparaît que si la situation s'y prête (assez
 * d'argent, la bonne fonction, le bon parcours…). On renvoie les choix
 * jouables avec leur index d'origine, pour que les boutons restent liés
 * au bon élément du tableau.
 */
function availableChoices(ev, s) {
  return ev.choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => !choice.when || eventMatches({ when: choice.when }, s));
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
      return allied && f.isPlayer ? base * 2.6 : base;
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
