/*
 * President Material — LA CARRIÈRE.
 *
 * Où l'on en est, ce qu'on a pour tenir, et ce que tout cela vaudra à la fin :
 * l'échelle des fonctions et l'ordre dans lequel on les monte, la direction du
 * parti qui se cumule avec le mandat au lieu d'en tenir lieu, le calendrier
 * des scrutins, les deux jauges — la popularité au pays, la cote dans
 * l'appareil —, l'énergie qu'une saison rend et qu'un choix dépense, et la
 * note de la postérité qui referme la partie.
 *
 * LES CHIFFRES QUE CES RÈGLES LISENT SONT DANS js/balance.js, et nulle part
 * ailleurs. Ce fichier dit comment une jauge dérive ; balance.js dit de
 * combien. Le moteur qui s'en sert est dans js/game.js.
 */
/* ==========================================================================
   TOUT CE QUI SE COMPTE EN TOURS PASSE PAR ICI
   ==========================================================================
   Ce qui se mesure par an — une indemnité, une probabilité de mort, une
   dérive de jauge — est écrit par an et divisé par TURNS_PER_YEAR au moment
   de l'appliquer. Ce qui se compte en délais — un cycle électoral, la suite
   d'une affaire — est écrit en tours, et vaut donc des trimestres.

   Le pourquoi de ce découpage est avec la constante, dans js/balance.js.
   ========================================================================== */



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


/** Le joueur dirige-t-il son parti ? */
function leadsParty(s) {
  return Boolean(s && s.partyLead);
}

/**
 * LE TITRE QU'ON PORTE, EN UNE LIGNE.
 *
 * La direction se cumule avec un mandat — on ne quitte pas l'Assemblée en
 * prenant son parti, et la fiche doit le montrer. Elle ne se cumule pas avec
 * une marche d'APPAREIL : la fiche affichait « Cadre du parti · Chef du
 * parti », soit deux fois la même maison, et aurait affiché « Militant ·
 * Chef du parti », qui n'est pas un cumul mais une contradiction. La
 * direction contient le rang d'appareil ; un chef sans mandat est un chef,
 * et rien d'autre.
 *
 * Rien ne change dans l'état du jeu : la case reste ce qu'elle est, elle
 * continue de peser dans l'exposition, le rang et le budget. Elle cesse
 * seulement de s'écrire derrière un titre qui la dit déjà.
 */
const APPAREIL_RUNGS = ["militant", "cadre", "chef"];

function positionTitle(position, lead) {
  if (!lead) return t("pos_" + position);
  if (!position || APPAREIL_RUNGS.includes(position)) return t("pos_chef");
  return t("pos_" + position) + " · " + t("pos_chef");
}

/* Les indemnités, le train de vie et les postes de dépense sont dans
   js/budget.data.js. */

/**
 * Calendrier électoral, en tours (4 tours = 1 an).
 * Une élection a lieu quand (tour % cycle) === offset.
 */
/*
 * LE CALENDRIER. Un tour vaut une saison, et le "offset" est le tour du cycle
 * où le scrutin tombe. Les cycles disent donc des trimestres : 20 pour un
 * quinquennat, 16 pour les quatre ans d'un congrès, 24 pour les six ans d'un
 * mandat municipal.
 *
 * LES LÉGISLATIVES SUIVENT LA PRÉSIDENTIELLE. Elles tombaient trois ans
 * après, ce qui est le calendrier d'avant 2002. Depuis l'inversion, on vote
 * pour l'Assemblée cinq semaines après avoir élu le président, précisément
 * pour lui donner une majorité, et c'est ce qui fait qu'une présidentielle
 * gagnée vaut deux victoires et qu'une perdue en coûte deux. Le découpage en
 * saisons le rend enfin représentable : un tour d'écart, soit un trimestre,
 * au lieu de l'année entière que le semestre imposait.
 *
 * Le moteur ne tient qu'un scrutin par tour, et cette contrainte-là est
 * voulue : elle interdit d'en télescoper deux. Elle impose en revanche une
 * discipline d'offsets qu'il faut connaître avant de toucher à ce tableau.
 * Deux scrutins de cycles c1 et c2 se rencontrent si et seulement si leurs
 * offsets sont égaux modulo pgcd(c1, c2). Ici : 20 et 16 se croisent modulo
 * 4, 20 et 24 aussi, 16 et 24 modulo 8. D'où la répartition ci-dessous, où
 * chaque scrutin a sa saison et où aucune paire ne partage jamais un tour.
 * La primaire, qui tombe PRIMARY_LEAD tours avant la présidentielle, est
 * comptée dans cette vérification : elle mangeait un congrès sur quatre.
 *
 * Les européennes suivent la même logique : deux ans après la présidentielle,
 * comme 2022 et 2024, et non quatre. Le cycle est donc chargé au début et
 * calme ensuite, exactement comme le vrai calendrier français, où l'on vote
 * trois fois en deux ans puis presque plus pendant trois. On ne lisse pas un
 * calendrier pour faire joli : c'est cette respiration-là qui fait qu'une
 * carrière se joue par à-coups.
 *
 * LES SAISONS SONT CELLES DE FRANCE. On élit un président en avril, une
 * Assemblée et un Parlement européen en juin ; les municipales et les congrès
 * de parti se déplacent, ils tombent ici en automne et en hiver, ce qui laisse
 * chaque saison porter au plus un scrutin.
 */
const ELECTIONS = [
  { id: "presidentielle", cycle: 20, offset: 0 },  // printemps
  { id: "legislatives", cycle: 20, offset: 1 },    // été, un trimestre après
  { id: "europeennes", cycle: 20, offset: 9 },     // été, deux ans après
  { id: "congres", cycle: 16, offset: 7 },         // hiver
  { id: "municipales", cycle: 24, offset: 2 },     // automne
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

/** Vitesse de convergence vers la cible, par an. */


/**
 * Exposition publique liée à la fonction : un maire est plus vu qu'un
 * militant. Le député européen est l'exception qui dit tout : le mandat est
 * important, la fonction est invisible, et c'est bien pour cela qu'on y
 * envoie les gens dont on veut se débarrasser.
 */


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
 * Ce que l'appareil demande VRAIMENT, une fois retirées les deux primes. Tout
 * ce qui parle d'investiture doit passer par ici : le refus, la distance au
 * seuil qu'on raconte au joueur et l'écart qui rend une dissidence possible
 * lisaient encore le tarif de base, si bien qu'un conseiller écarté de deux
 * points s'entendait dire qu'on ne le voyait pas du tout.
 */
function nominationNeed(stake, s) {
  const need = NOMINATION_THRESHOLD[stake.target];
  if (need === undefined) return undefined;

  if (stake.defense && MANDATES.includes(stake.target)) return need - INCUMBENT_DISCOUNT;

  const claim = SEATED_CLAIM[stake.target];
  if (claim && s.position === claim.from) return need - claim.discount;
  return need;
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
  if (s.turn % (TURNS_PER_YEAR * 2) !== 0) return;
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
   LA NOTE DE LA POSTÉRITÉ
   ==========================================================================
   L'écran de fin annonçait trois nombres : des années, un sommet, une
   fortune. Une carrière de quarante ans, quatre cents cartes et une
   quinzaine de scrutins n'y laissait aucune trace, et deux parties très
   différentes s'y ressemblaient exactement.

   Cinq lignes, donc, et elles ne mesurent pas la même chose. Ce qu'on a été,
   ce que les urnes ont dit, ce que le pays a retenu, ce que la maison vous
   doit, ce qu'on laisse derrière soi. Le total n'est pas une performance :
   c'est ce qui restera dans le manuel, et le manuel compte autrement que le
   joueur.

   ON COMPTE LE SOMMET, PAS LA FIN. Une carrière aimée puis oubliée n'est pas
   une carrière qui n'a jamais été aimée. Les jauges entrent donc par leur
   plus haut (peakPopularity, peakStanding), et la dernière ligne, celle des
   marques, est la seule qui juge l'état dans lequel on s'arrête.
   ========================================================================== */

/**
 * Ce que vaut une fonction dans le manuel d'histoire.
 *
 * LE SOMMET DOIT ÉCRASER LE RESTE. La première échelle était trop plate : un
 * joueur élu président de la République à quarante ans, au terme d'une
 * carrière courte et fulgurante, terminait à quatre-vingt-cinq points et se
 * voyait résumé par « une notabilité locale ». C'est le contraire de ce que
 * fait un manuel d'histoire, qui retient d'abord la fonction et ensuite
 * seulement le temps qu'on y a passé. L'Élysée vaut donc à lui seul plus que
 * tout ce qu'une longue carrière d'élu local peut accumuler.
 */
const SCORE_OFFICE = {
  militant: 0, cadre: 3, conseiller: 6, euro: 12, maire: 18, depute: 24,
  ministre: 45, premier: 70, president: 140,
};

/** Diriger son parti n'est pas un mandat, et cela compte quand même. */
const SCORE_LEAD = 20;

/** Une année passée avec un mandat, quel qu'il soit. */
const SCORE_YEAR = 1.2;

/** Ce que rapporte un scrutin gagné, par ce qui se jouait. */
const SCORE_WON = {
  conseiller: 3, euro: 5, maire: 8, depute: 10, ministre: 10, premier: 16,
  chef: 14, president: 40,
};

/** Ce que coûte un scrutin perdu. Défendre et perdre coûte davantage. */
const SCORE_LOST = -2;
const SCORE_LOST_DEFENSE = -4;

/** Ce que valent les marques et les atouts qu'on emporte. */
const SCORE_ASSET = 3;
const SCORE_MARK = -4;

/**
 * Les rangs. Le premier dont le seuil est atteint, en partant du haut.
 * Ce ne sont pas des grades : c'est la phrase par laquelle on sera résumé.
 */
const SCORE_RANKS = [
  // Mesuré sur deux cents carrières : la meilleure atteint 329. Le rang le
  // plus haut doit rester rare, pas inatteignable.
  { min: 320, key: "rank_boulevard" },
  { min: 270, key: "rank_figure" },
  { min: 180, key: "rank_lourd" },
  { min: 115, key: "rank_nationale" },
  { min: 65,  key: "rank_notable" },
  { min: 30,  key: "rank_federation" },
  { min: -1e9, key: "rank_organigramme" },
];

/**
 * LE PLANCHER DE LA FONCTION.
 *
 * Un total ne suffit pas à résumer quelqu'un, et il ne doit pas pouvoir
 * mentir : on n'écrit pas « une notabilité locale » sous le nom d'un
 * président de la République, quel que soit le reste du relevé. La fonction
 * la plus haute atteinte impose donc un rang minimum, que le total peut
 * dépasser mais jamais démentir. C'est aussi ce que fait un manuel : il
 * range d'abord par ce qu'on a été.
 */
const SCORE_FLOOR = {
  president: "rank_figure",
  premier: "rank_lourd",
  ministre: "rank_nationale",
  depute: "rank_nationale",
  maire: "rank_notable",
  euro: "rank_notable",
  conseiller: "rank_federation",
};

function rankFor(total, sommet, lead) {
  const parLeTotal = SCORE_RANKS.findIndex((r) => total >= r.min);
  let plancher = SCORE_FLOOR[sommet];
  // Diriger son parti vaut au moins ce que vaut un ministère : on ne résume
  // pas par sa mairie quelqu'un qui a tenu une des six maisons du pays.
  if (lead && !plancher) plancher = "rank_nationale";
  const parLaFonction = plancher
    ? SCORE_RANKS.findIndex((r) => r.key === plancher)
    : SCORE_RANKS.length - 1;
  return SCORE_RANKS[Math.min(parLeTotal, parLaFonction)].key;
}

/** Les fonctions qui sont un mandat : celles qui font compter les années. */
function heldOffice(position) {
  return MANDATES.includes(position) || position === "president";
}

/**
 * Le relevé de fin de partie. Renvoie les cinq lignes, le total et le rang.
 * Chaque ligne porte de quoi s'expliquer d'elle-même : un total qu'on ne
 * peut pas décomposer ne se lit pas, il se subit.
 */
function careerScore(s) {
  const frise = s.career || [];
  const lines = [];

  /* 1. CE QUE VOUS AVEZ ÉTÉ. Le sommet atteint, la maison si on l'a tenue,
        et les années passées avec un mandat — être élu vingt ans n'est pas
        la même carrière qu'être élu deux fois six mois. */
  const president = s.ended && s.ended.type === "victory";
  const sommet = president ? "president" : s.peakPosition;
  let annees = 0;
  let depuis = null;
  frise.forEach((e) => {
    if (e.kind !== "office") return;
    if (heldOffice(e.position)) { if (depuis === null) depuis = e.turn; }
    else if (depuis !== null) { annees += (e.turn - depuis) / TURNS_PER_YEAR; depuis = null; }
  });
  if (depuis !== null) annees += (s.turn - depuis) / TURNS_PER_YEAR;
  annees = Math.round(annees);

  const fonction = (SCORE_OFFICE[sommet] || 0) + (s.peakLead ? SCORE_LEAD : 0);
  lines.push({ key: "score_office", points: Math.round(fonction + annees * SCORE_YEAR),
               detail: { sommet, lead: Boolean(s.peakLead), annees,
                         partiel: Boolean(s.careerPartial) } });

  /* 2. LES URNES. Ce que les électeurs ont dit, et rien d'autre. */
  // LA PRÉSIDENTIELLE GAGNÉE EST UN SCRUTIN GAGNÉ. Elle ne passe pas par
  // applyOutcome — une campagne présidentielle a son propre dépouillement —
  // et elle n'était donc comptée nulle part : on annonçait « aucun scrutin
  // disputé » à un président de la République.
  const scrutins = frise.filter((e) => e.kind === "election")
    .concat(frise.filter((e) => e.kind === "office" && e.position === "president")
                 .map((e) => ({ kind: "election", id: "presidentielle", won: true,
                                target: "president", defense: false })));
  const gagnes = scrutins.filter((e) => e.won);
  const perdus = scrutins.filter((e) => !e.won);
  const urnes = gagnes.reduce((sum, e) => sum + (SCORE_WON[e.target] || 4), 0) +
    perdus.reduce((sum, e) => sum + (e.defense ? SCORE_LOST_DEFENSE : SCORE_LOST), 0);
  lines.push({ key: "score_ballots", points: Math.round(urnes),
               detail: { gagnes: gagnes.length, perdus: perdus.length,
                         partiel: Boolean(s.careerPartial) } });

  /* 3. CE QUE LE PAYS A RETENU. Le sommet de la popularité, plus ce que la
        notoriété dit d'un nom : on peut être connu sans être aimé, et cela
        compte aussi dans un manuel. */
  const pays = (s.peakPopularity || 0) / 3 + statScore(s, "notoriete");
  lines.push({ key: "score_country", points: Math.round(pays),
               detail: { pic: Math.round(s.peakPopularity || 0) } });

  /* 4. CE QUE LA MAISON VOUS DOIT. Le sommet de la cote, et surtout ce que le
        camp pèse aujourd'hui PAR RAPPORT AU JOUR OÙ VOUS ÊTES ENTRÉ : un
        parti laissé plus grand qu'on ne l'a trouvé est la seule chose qu'un
        appareil n'oublie jamais.
        On comparait au « socle », c'est-à-dire au niveau théorique vers
        lequel le moteur rappelait chaque camp. C'était à la fois du jargon
        interne affiché tel quel au joueur et la mauvaise référence : ce qui
        compte n'est pas l'écart à une valeur d'équilibre, c'est le chemin
        parcouru pendant votre carrière. Le socle n'existe d'ailleurs plus. */
  const depart = (s.startShares && s.startShares[s.party]) ||
    (s.landscape && s.landscape[s.party]) || 0;
  const part = (s.landscape && s.landscape[s.party]) || depart;
  const ecart = part - depart;
  const maison = (s.peakStanding || 0) / 3 + ecart * 2.5;
  lines.push({ key: "score_house", points: Math.round(maison),
               detail: { pic: Math.round(s.peakStanding || 0), ecart: Math.round(ecart * 10) / 10 } });

  /* 5. CE QUE VOUS LAISSEZ. Les marques d'une carrière, et elles seules :
        c'est la ligne qui juge l'état dans lequel on s'arrête. Le caractère
        de départ ne compte pas — on n'a pas choisi d'être né calculateur. */
  const marques = traitsOf(s).filter((id) => TRAIT_DATA[id] && !TRAIT_DATA[id].core);
  const atouts = marques.filter((id) => TRAIT_DATA[id].kind === "asset").length;
  const casseroles = marques.length - atouts;
  const laisse = atouts * SCORE_ASSET + casseroles * SCORE_MARK;
  lines.push({ key: "score_legacy", points: Math.round(laisse),
               detail: { atouts, casseroles } });

  const total = Math.max(0, lines.reduce((sum, l) => sum + l.points, 0));
  return { total, rank: rankFor(total, sommet, Boolean(s.peakLead)), lines };
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
