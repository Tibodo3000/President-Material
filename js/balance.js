/*
 * President Material — TOUS LES RÉGLAGES DU JEU.
 * ==========================================================================
 *
 * Ce fichier ne contient aucune règle : il contient les CHIFFRES que les règles
 * lisent. Toutes les molettes d'équilibrage du jeu vivent ici, et nulle part
 * ailleurs. Régler la partie, c'est ouvrir ce fichier et rien d'autre.
 *
 * POURQUOI. Ces cent-sept constantes étaient dispersées dans dix fichiers, au
 * milieu du code qui les consomme. Chacune était commentée, chacune était à sa
 * place — mais personne ne pouvait dire, sans une fouille, ce que le jeu offrait
 * comme leviers, et deux réglages qui se contredisent ne se voyaient jamais côte
 * à côte. Le rassemblement ne change aucune valeur : il rend l'équilibrage
 * lisible d'un seul regard.
 *
 * CE QUI EST ICI, ET CE QUI N'Y EST PAS. Une constante est un réglage si elle
 * n'existe que pour être tournée : sa valeur pourrait être autre sans que rien
 * ne casse, seulement la partie serait différente. Restent donc dehors le
 * VOCABULAIRE (LADDER, STAT_KEYS, ELECTIONS, MANDATES — changer un mot y casse
 * le contenu qui le nomme), le CONTENU des pages de création (BASE_STATS,
 * STAT_MODIFIERS, MONEY, PARTIES, FIT_LEVELS, DRAW_MIX, qui restent dans
 * data.js, où le validateur et l'éditeur vont les lire), et tout ce qui relève
 * de la PLOMBERIE (clés de stockage, marques d'accord, familles de pastilles).
 *
 * CHAQUE CHIFFRE GARDE SA JUSTIFICATION. Le commentaire qui explique POURQUOI
 * une valeur vaut ce qu'elle vaut a suivi la constante ; celui qui explique
 * comment le système fonctionne est resté avec le code qui l'implémente. On
 * règle ici, on comprend là-bas.
 *
 * CE FICHIER SE CHARGE EN PREMIER, avant data.js : quatre constantes sont
 * dérivées d'une autre à l'évaluation (YEARS_PER_TURN, ASSEMBLY_MAJORITY,
 * COALITION_DISTANCE, STRAIN_TALKS) et l'ordre à l'intérieur du fichier compte
 * pour elles.
 *
 * DEUX CONSTANTES SONT MARQUÉES « DÉBRANCHÉE » : aucun code ne les lit. Elles
 * l'étaient déjà avant d'arriver ici — les rassembler l'a simplement rendu
 * visible, ce qui est une raison de plus de les avoir rassemblées.
 */

/* ==========================================================================
   L'ÉCHELLE ET LE TEMPS
   ==========================================================================
   Deux décisions dont tout le reste découle : sur quoi se lisent les
   statistiques, et ce que dure un tour.
   ========================================================================== */

const STAT_MIN = 0;

const STAT_MAX = 20;

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

/** Tout le monde entre en politique à trente ans. Un tour = une saison. */
const START_AGE = 30;

/**
 * UN TOUR VAUT UNE SAISON.
 *
 * Il en valait deux : six mois, deux tours par an. Le calendrier électoral
 * français en tombe cinq par quinquennat, et cinq échéances réparties sur dix
 * tours mangeaient un tour sur deux. Mesuré sur soixante carrières entières,
 * 52 % des tours étaient un scrutin — la moitié d'une vie politique passée à
 * voter — et une carrière ne jouait que quarante événements ordinaires sur
 * les deux cent cinquante que le jeu contient. Le reste n'était pas coupé, il
 * était noyé : on ne le voyait jamais parce qu'il n'y avait pas de place
 * entre deux campagnes.
 *
 * Découper l'année en quatre ne change rien au calendrier — on vote toujours
 * autant de fois par décennie — mais cela double le nombre de tours qui
 * séparent deux scrutins. C'est la seule façon de faire exister ce qu'il y a
 * entre les élections, qui est le sujet du jeu.
 */

/** Quatre tours par an : printemps, été, automne, hiver. */
const TURNS_PER_YEAR = 4;

/** Ce qu'un tour vaut en années. Tout ce qui est écrit « par an » passe par là. */
const YEARS_PER_TURN = 1 / TURNS_PER_YEAR;

/** Combien d'échéances on montre. Quatre couvrent trois à cinq ans. */
const CALENDAR_LENGTH = 4;

/** Jusqu'où on cherche. Deux cycles complets suffisent toujours. */
const CALENDAR_HORIZON = 52;

/* ==========================================================================
   LES DEUX JAUGES : POPULARITÉ ET COTE AU PARTI
   ==========================================================================
   Elles ne montent pas et ne redescendent pas à la même vitesse, et la
   fonction qu'on occupe décide du niveau où elles se posent.
   ========================================================================== */

/*
 * ON RÈGLE UNE DÉRIVE PAR AN, JAMAIS PAR TOUR.
 *
 * Elle valait 0,28 quand un tour faisait six mois. Un tour vaut une saison :
 * l'année contient deux fois plus de tours, et une vitesse laissée telle
 * quelle ferait fondre en dix-huit mois ce qui mettait trois ans à s'user.
 * Les deux chiffres sont donc repris pour qu'une année entière fasse
 * exactement le même chemin qu'avant — 1 − √0,72 et 1 − √0,83.
 *
 * CE QUE CELA COÛTE, ET C'EST VOULU. Ce qui fait monter une jauge, ce sont
 * les événements, et il y en a un par tour : leur apport par an a doublé lui
 * aussi, pendant que le rappel par an, lui, n'a pas bougé. Le niveau
 * d'équilibre d'une jauge monte donc. Mesuré sur soixante carrières, la
 * popularité de pointe passe de 63 à 75 et l'Élysée tombe plus souvent. C'est
 * un réglage d'équilibrage à reprendre à part, pas une raison de fausser la
 * durée d'un tour.
 */
const DRIFT = 0.15;

/**
 * ON REDESCEND MOINS VITE QU'ON NE MONTE.
 *
 * Le retour vers la cible se faisait à la même vitesse dans les deux sens :
 * une jauge portée trente points au-dessus de son niveau naturel en perdait
 * huit au tour suivant, sans que rien ne l'annonce ni ne l'explique. Ce
 * qu'on a gagné doit s'user, pas fondre — sinon aucun coup d'éclat ne vaut
 * la peine et le joueur a le sentiment de vider un seau percé.
 *
 * LA DETTE LAISSÉE PAR LA SAISON, ET OÙ ELLE TOMBE VRAIMENT. En passant d'un
 * tour par semestre à un tour par saison, les deux coefficients ont été
 * convertis pour qu'une ANNÉE fasse le même chemin qu'avant : le rappel annuel
 * n'a pas bougé, mais les événements tombent un par tour et leur apport annuel
 * a doublé. Une jauge s'immobilise là où l'apport des scènes égale le rappel,
 * donc à un écart au repos deux fois plus grand, et personne ne l'avait
 * décidé. Le commentaire de DRIFT le signalait comme « un réglage
 * d'équilibrage à reprendre à part ».
 *
 * Repris, et mesuré : la dette ne tombe pas ici. Doubler ce coefficient ne
 * change presque rien à la popularité — écart au repos de 3,9 avant comme
 * après — parce que la popularité n'est plus une jauge mais six électorats,
 * que ce rappel-là ne touche que le sien, et surtout parce que bumpAppeal()
 * freine déjà les gains par des rendements décroissants. Toute la dette était
 * donc sur la COTE AU PARTI, qui n'avait aucun frein : elle est payée dans
 * bumpStanding(). Doubler le rappel en plus faisait tomber la cote médiane
 * d'un joueur qui joue bien de 59 à 46, et l'Élysée de 25 carrières sur 200 à
 * 14 : deux freins pour une seule dette.
 */
const DRIFT_DOWN = 0.09;   // même conversion : 1 − √0,83

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

const LEAD_EXPOSURE = 12;

const LEAD_RANK = 4;

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

/* ==========================================================================
   L'OPINION, ÉLECTORAT PAR ÉLECTORAT
   ==========================================================================
   La popularité n'est pas un nombre mais six. Ces réglages disent comment un
   geste se répartit entre les camps.
   ========================================================================== */

/*
 * LE FILTRE PARTISAN.
 *
 * Un effet sans position touchait les six électorats du montant exact, si bien
 * que la moindre bonne nouvelle affichait six fois le même chiffre dans la
 * déclinaison. Ce n'est pas ainsi qu'une opinion se forme : les vôtres
 * accueillent mieux ce que vous faites de bien et vous pardonnent davantage ce
 * que vous faites de mal, et le camp d'en face fait l'inverse. C'est le
 * mécanisme le mieux établi de l'opinion, et il ne demandait qu'à être écrit.
 *
 * Le penchant est volontairement léger : il ne remplace pas un positionnement,
 * il évite seulement qu'une scène neutre produise six colonnes identiques. À
 * 0,3, un effet de huit points vaut neuf chez vous et six chez celui qui est
 * le plus loin.
 */
const APPEAL_TILT = 0.3;

/*
 * L'ECART STRUCTUREL entre votre camp et les autres, avant tout choix. A 26,
 * les six electorats tenaient dans onze points et la base depassait a peine
 * le camp voisin : apres une carriere entiere on lisait 62 / 59 / 56 / 56 /
 * 54 / 51, c'est-a-dire six fois le meme chiffre. Un parti qui vous a investi
 * vous accorde beaucoup plus que celui d'en face, et cela doit se voir.
 */
const APPEAL_SPREAD = 46;

/*
 * LA FORME S'EFFACE BEAUCOUP PLUS LENTEMENT QUE LE NIVEAU.
 *
 * La derive ramenait chaque electorat vers sa cible au rythme ordinaire des
 * jauges (DRIFT, 0,28 par tour) : ce qu'un choix avait creuse etait comble en
 * trois ou quatre tours, et le positionnement ne laissait aucune trace. Or
 * c'est exactement l'inverse qu'on veut dire — un electorat tient un dossier
 * sur vous, et il s'en souvient.
 *
 * On separe donc les deux mouvements. La MOYENNE suit la cible au rythme
 * habituel, ce qui laisse la popularite d'ensemble se comporter exactement
 * comme avant. Les ECARTS a cette moyenne, eux, ne se resorbent qu'a 0,06 par
 * tour : une reputation de clivage met une quinzaine d'annees a s'effacer, et
 * ne s'efface jamais tout a fait tant qu'on continue.
 *
 * DÉBRANCHÉE. Aucun code ne lit cette constante aujourd'hui. Elle était déjà
 * morte avant le rassemblement, et n'a été gardée que parce que sa
 * justification décrit une intention de jeu qui reste valable. La brancher
 * ou la retirer est une décision à prendre, pas un oubli à reconduire.
 */
const APPEAL_SHAPE_DRIFT = 0.06;

/*
 * CE QUI RAPPELLE LES AUTRES ÉLECTORATS VERS LEUR CIBLE. Volontairement bas :
 * c'est lui qui décide si l'opinion des autres est un acquis de naissance ou
 * une accumulation de vos actes. Balayé sur cent cinquante carrières :
 *
 *   rappel   étendue des six   popularité   victoires
 *    0,08         25,5            37,7         27 %
 *    0,04         28,6            34,2         17 %
 *    0,02         30,4            31,9         11 %
 *
 * 0,04 donne trois points d'étendue de plus que 0,08 et ramène le taux de
 * victoire présidentielle sur sa référence historique, dix-sept pour cent,
 * sans qu'on ait à toucher au coefficient de conversion. La popularité
 * d'ensemble baisse à trente-quatre : c'est sans importance depuis que les
 * élections lisent les six électorats et non plus la moyenne.
 */
const OTHERS_PULL = 0.02;

/**
 * TOUS LES ÉLECTORATS NE COMPTENT PAS PAREIL POUR VOUS.
 *
 * La note affichée était la moyenne des six, pondérée par la TAILLE de chaque
 * électorat et rien d'autre. C'est la bonne façon de mesurer ce que le pays
 * pense de vous ; c'est la mauvaise façon de mesurer ce que vous valez. Un
 * député de la droite identitaire adoré des siens à soixante-dix-sept et
 * refusé des libéraux à vingt-cinq lisait quarante-trois, un nombre dans
 * lequel il ne se reconnaissait pas et qui était surtout composé de gens qui
 * ne voteront jamais pour lui, quoi qu'il fasse.
 *
 * La note pèse donc ce qui vous concerne : LES VÔTRES D'ABORD, et pour les
 * deux tiers — c'est d'eux que viennent les militants, les investitures, les
 * primaires et le socle des voix. Les autres ensuite, à proportion de ce
 * qu'ils pèsent dans le pays ET de ce qui les sépare de vous : le camp voisin
 * est celui qu'on peut convaincre, celui d'en face est un décor.
 *
 * ATTENTION : cette pondération ne sert QU'À LA NOTE. Les élections ne
 * l'utilisent pas — un bulletin ne pèse pas plus parce qu'il vient d'un camp
 * ami, et electionAppeal() continue de doser base et général à la taille (voir
 * nationalPopularity, qui garde l'ancienne lecture pour tout ce qui se compare
 * au pays ou aux rivaux).
 */
const POPULARITY_FOCUS = 0.66;

/* De combien l'attention retombe avec la distance idéologique. À 3, le camp
   voisin pèse environ huit fois celui d'en face, à taille égale. */
const REACH_FALLOFF = 3;

/*
 * Où passe la ligne entre ceux que le geste rapproche et ceux qu'il éloigne.
 * Elle était à 0,42, c'est-à-dire en dessous de toutes les affinités que
 * produisent les six partis du jeu : une position très à gauche faisait
 * gagner un point à l'électorat identitaire, ce qui est le contraire de ce
 * qu'on voulait écrire. Les distances réelles entre camps vont de 0,10 à
 * 0,55, donc les affinités de 0,45 à 0,90 : la ligne passe au milieu.
 */
const AXIS_NEUTRAL = 0.68;

/** Positionnement du camp au pouvoir, qui n'a pas de parti dans le jeu. */
const NEUTRAL_AXES = { social: 5, world: -15, economy: 25, power: 5 };

/* ==========================================================================
   LA CRÉDIBILITÉ
   ==========================================================================
   Ce que la fonction confère à qui l'occupe, et ce qu'il en reste quand on la
   quitte.
   ========================================================================== */

/*
 * OÙ LA CRÉDIBILITÉ EST LUE, pour qui voudra la régler à la main. Neuf
 * endroits, et rien d'autre :
 *
 *   js/data.js        BASE_STATS.credibilite       le niveau de départ
 *                     STAT_MODIFIERS               origine et parcours
 *   js/game/carriere.js   standingTarget()             × 1.1   l'appareil
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

/** Marge au-dessus de la fonction qu'on peut tenir grâce à ses seuls choix. */
const CREDIBILITY_OVERSHOOT = 4;

/* ==========================================================================
   LE PAYS : PAYSAGE, COTE DU GOUVERNEMENT, ASSEMBLÉE
   ==========================================================================
   Le pays vit sa vie indépendamment de la carrière du joueur. C'est ici qu'on
   règle à quelle vitesse.
   ========================================================================== */

/*
 * IL N'Y A PAS DE SOCLE.
 *
 * Il y en avait un : un parti ne descendait jamais sous 1,5 %, « il lui reste
 * ses fidèles ». C'est une jolie phrase et c'est une main sous le tableau. Un
 * camp qui s'effondre doit pouvoir s'effondrer pour de bon — le PS a fait
 * 1,7 % en 2022 — et un plancher, si bas soit-il, dit au joueur que le pays a
 * une mémoire garantie que rien ne peut effacer. Le rapport de force n'a que
 * des causes : ce qu'un camp pèse est la somme de ce qui lui est arrivé.
 *
 * Ce qui reste n'est pas un réglage, c'est de l'arithmétique : une part ne
 * peut pas être négative, sinon la normalisation à cent pour cent produit
 * n'importe quoi. Zéro est donc le seul plancher, et il ne protège personne.
 */

/* --------------------------------------------------------------------------
   CE QUE COÛTE UNE TRAHISON, LE JOUR MÊME
   --------------------------------------------------------------------------
   Changer de camp ne touchait pas un seul électorat. La cote au parti
   s'écroulait, le trait de renégat tombait, le paysage se déplaçait, et les
   gens qui votaient pour vous la veille continuaient de vous aimer autant.
   C'est pourtant le geste que l'électorat pardonne le moins, et c'est celui
   qu'il voit le mieux : il ne demande aucune explication et ne souffre aucune
   nuance.

   La dérive ne suffisait pas à le dire. Elle ramène chaque électorat vers une
   cible calculée depuis le NOUVEAU parti, donc elle finit par y arriver, mais
   au rythme d'une jauge : le camp qu'on venait de quitter mettait des années
   à s'apercevoir qu'on était parti.
   -------------------------------------------------------------------------- */

/** Ce que le camp quitté retire, d'un coup, le jour du départ. */
const DEFECTION_HOME = 22;

/** Ce que le camp qui accueille accorde : on prend la recrue, pas l'homme. */
const DEFECTION_WELCOME = 6;

/** Et ce que les autres retirent, parce qu'une girouette se voit de loin. */
const DEFECTION_OTHERS = 2;

/* --------------------------------------------------------------------------
   ET CE QUE VAUT UN PACTE, CHEZ CEUX QUI LE SIGNENT
   --------------------------------------------------------------------------
   Un accord entre deux camps rend le joueur fréquentable chez l'autre et
   suspect chez les siens : c'est tout l'objet d'un pacte, et le moteur n'en
   savait rien. Trois scènes sur seize le disaient à la main, les treize
   autres ne disaient rien, si bien que la même signature déplaçait ou non
   l'électorat de l'allié selon la carte qui l'avait proposée.
   -------------------------------------------------------------------------- */

/** Ce que l'électorat de l'allié accorde le jour de la signature. */
const ALLIANCE_WARMTH = 7;

/** Ce qu'en retirent les vôtres : il y a toujours des puristes. */
const ALLIANCE_PURISTS = 3;

/** Et ce que la rupture reprend chez celui qu'on lâche. */
const ALLIANCE_BREAK = 7;

/* --------------------------------------------------------------------------
   LE PAYS DANS LEQUEL ON OUVRE LA PARTIE, ET RIEN D'AUTRE
   --------------------------------------------------------------------------
   IL N'Y A PAS DE SOCLE. Un parti n'a pas de niveau naturel vers lequel le
   moteur le ramène : ce qu'il pèse est ce que la partie en a fait, et rien de
   plus. Ce qui suit ne sert donc qu'une fois, au tout premier tour, pour dire
   dans quel pays on entre. Ensuite, le tableau ne connaît plus que des causes
   — gouverner use, une figure populaire tire, le joueur pèse, les événements
   déplacent — et le hasard de l'époque.

   Le tirage lui-même sépare deux choses. L'ANCRE dit ce que la difficulté d'un
   parti penche le jour de l'ouverture : 18 pour les centristes, 9 pour un camp
   de rupture. L'ÉCART dit à quel point le pays peut être ailleurs, et il est
   le même pour tous les camps, en log-normal, parce qu'une époque ne choisit
   pas ses favoris en fonction de leur commodité.
   -------------------------------------------------------------------------- */

/** Le haut de l'ancre d'ouverture, pour un parti de difficulté nulle. */
const OPENING_ANCHOR = 21;

/** Ce que chaque cran de difficulté retire à l'ancre d'ouverture. */
const OPENING_TILT = 3;

/** L'ampleur de l'écart d'une partie à l'autre, en log : 0,55 double environ. */
const OPENING_SPREAD = 0.55;

/**
 * Le mouvement qu'il faut avoir accumulé pour qu'on en parle. Deux points et
 * demi : au-dessus, le tableau bougeait sans que le journal l'explique jamais
 * ; en dessous, on commenterait le bruit.
 */
const LANDSCAPE_STORY = 2.5;

/**
 * En dessous de cette distance, deux partis sont voisins : ils peuvent se
 * détester en public et avoir besoin l'un de l'autre en privé. Calé pour que
 * chaque camp ait un ou deux voisins, jamais quatre.
 */
const NEIGHBOUR_DISTANCE = 0.26;

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
 *
 * DÉBRANCHÉE. Aucun code ne lit cette constante aujourd'hui. Elle était déjà
 * morte avant le rassemblement, et n'a été gardée que parce que sa
 * justification décrit une intention de jeu qui reste valable. La brancher
 * ou la retirer est une décision à prendre, pas un oubli à reconduire.
 */
const COALITION_DISTANCE = NEIGHBOUR_DISTANCE / 2;

/*
 * CE QUE GOUVERNER COÛTE PAR TOUR, ET DE PLUS EN PLUS AU SECOND MANDAT.
 *
 * L'USURE ÉTAIT TROP DOUCE. La cote se stabilise à peu près à sa cible moins
 * APPROVAL_WEAR / APPROVAL_PULL : à 0,65, cela faisait quatorze points sous
 * une cible qui tourne autour de soixante, donc un gouvernement installé à
 * quarante-sept, et un premier mandat qui s'achevait au-dessus de cinquante
 * parce qu'il partait de l'état de grâce. Mesuré sur cinq mille tours : cote
 * médiane 54, premier quartile 49, quatre pour cent des tours sous quarante,
 * zéro sous vingt-six. Aucun pouvoir n'était jamais aux abois, la censure —
 * qui demande vingt-six — ne pouvait littéralement pas se déclencher, et
 * surtout le pays n'avait jamais de raison de changer de président.
 *
 * Une cote de gouvernement de la Ve vit entre vingt-cinq et quarante-cinq,
 * avec des états de grâce au-dessus de soixante et des traversées à quinze.
 *
 * DEUX RÉGLAGES, PAS UN. La cote se stabilise vers APPROVAL_WEAR /
 * APPROVAL_PULL points sous sa cible, et elle met ln2 / APPROVAL_PULL tours à
 * parcourir la moitié du chemin. Avec l'ancien rappel, cette moitié demandait
 * quinze tours, c'est-à-dire presque un quinquennat : l'état de grâce de
 * soixante-deux ne s'épuisait jamais, et le premier mandat s'achevait plus
 * haut qu'il n'aurait dû commencer. Augmenter la seule usure n'y changeait
 * rien — mesuré, la médiane passait de 54 à 52.
 *
 * Le rappel se resserre donc, et l'usure suit pour que le niveau descende au
 * lieu de se contenter d'arriver plus vite : un état de grâce dure deux ans
 * (huit tours pour la moitié du chemin), et le régime de croisière s'établit
 * vingt-cinq points sous la cible, soit autour de trente-cinq pour un camp
 * ordinaire et vingt-huit au second mandat.
 */
const APPROVAL_WEAR = 2.1;

/** Ce que le second mandat coûte en plus, par mandat déjà fait. */
const APPROVAL_WEAR_TERM = 1.0;

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
const APPROVAL_PULL = 0.085;

const APPROVAL_NOISE = 7.5;   // le rappel resserré tasse la bande : on secoue un peu plus

/*
 * CE QUE VAUT D'ÊTRE LE SORTANT — ET ÇA DÉPEND DU BILAN.
 *
 * Le président sortant multipliait son poids par 1,45, quoi qu'il ait fait :
 * la même prime à celui que le pays veut garder et à celui qu'il ne supporte
 * plus. C'est la moitié de la Ve. L'autre moitié est que Giscard et Sarkozy
 * ont été battus, et que Hollande n'a pas osé se représenter.
 *
 * La prime lit donc la cote du gouvernement. Au-dessus du pivot, le sortant
 * est le candidat à battre et le reste ; en dessous, sortir d'un mandat
 * devient ce qu'on lui reproche, et la prime devient un handicap.
 *
 * Le pivot est calé par la mesure, pas par l'intuition : à 40, un sortant qui
 * se présentait ne gagnait plus qu'une fois sur deux, ce qui est trop peu
 * pour la Ve — un président qui y va reste le favori. À 36, avec une pente un
 * peu plus raide, il gagne cinquante-cinq pour cent du temps et la
 * présidentielle se solde comme la vraie : un sortant sur trois se succède à
 * lui-même, tous scrutins confondus.
 */
const INCUMBENT_PULL_PIVOT = 36;

const INCUMBENT_PULL_SLOPE = 0.022;

const INCUMBENT_PULL_MAX = 1.45;

const INCUMBENT_PULL_MIN = 0.75;

/*
 * LA COTE SOUS LAQUELLE UN SORTANT NE SE REPRÉSENTE PAS.
 *
 * Le moteur ne connaissait qu'une façon de ne pas repartir : avoir fait ses
 * deux mandats. Le sortant se représentait donc toujours, quel que soit son
 * bilan — mille deux cents présidentielles mesurées, un seul renoncement, et
 * il venait d'une scène jouée par le joueur. La Ve en compte pourtant deux en
 * vingt ans, et l'un des deux est le plus éloquent de tous : on ne se
 * représente pas à quinze de cote, son propre camp ne le porte pas.
 *
 * En dessous de ce seuil, la probabilité de renoncer monte avec la
 * dégringolade. Le seuil se lit sur l'échelle du jeu et non sur celle des
 * instituts : mesurée au moment où les partis désignent, la cote d'un
 * gouvernement vit ici autour de quarante-deux, et c'est cette médiane-là qui
 * dit ce qu'est un bilan indéfendable. Un tirage, une fois, au moment de la
 * désignation : rien à quarante-quatre, un sur cinq à quarante, deux sur cinq
 * à trente-cinq, deux sur trois à trente.
 */
const RENOUNCE_APPROVAL = 44;

const RENOUNCE_SPREAD = 22;

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

/* ==========================================================================
   LES FIGURES
   ==========================================================================
   Qui peuple les partis, qui les quitte, et qui décroche un gouvernement.
   ========================================================================== */

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

/*
 * CE QUE VAUT UNE BARRE PLEINE dans le rapport de force : la moitié du pays.
 * L'échelle est fixe pour qu'une longueur veuille dire la même chose d'un
 * tour à l'autre et d'une partie à l'autre. Elle laisse de la marge au-dessus
 * des percées mesurées, un camp culminant autour de trente-cinq pour cent.
 */
const LANDSCAPE_SCALE = 50;

/* ==========================================================================
   LA DYNAMIQUE D'UN PARTI
   ==========================================================================
   MESURE D'ABORD. Sur quarante parties, la part de chaque camp à l'an 0, 10,
   20 et 30 : chacun finit à un ou deux points de là où il a commencé,
   quarante ans plus tard, et l'ÉCART ENTRE PARTIES RÉTRÉCIT avec le temps
   (centristes 10,3 → 6,4 ; identitaires 7,1 → 4,7). Toute la variété venait
   du tirage initial, et le jeu la mangeait en marchant. Amplitude d'un camp
   sur une carrière entière : sept à douze points. Jamais une percée, jamais
   un effondrement, et deux parties racontaient la même histoire.

   La cause est que le paysage était tiré à neuf chaque tour : du bruit sans
   mémoire, plus une part tirée par le chef du parti, dont la popularité
   revient elle-même vers ses statistiques. Un bruit sans mémoire ne fait pas
   d'histoire — il fait du grésillement autour d'un niveau.

   Un parti porte donc une DYNAMIQUE : une valeur qui persiste d'un tour à
   l'autre. Ce qui monte continue de monter un moment, ce qui coule continue
   de couler, et une série finit par se retourner. C'est ce qui produit des
   percées et des effondrements, donc des parties qui ne se ressemblent pas.
   ========================================================================== */

/*
 * CE QU'IL RESTE D'UNE DYNAMIQUE AU TOUR SUIVANT. C'est le seul chiffre qui
 * compte vraiment : il fixe la durée des séries. À 0,93, une dynamique met
 * une quinzaine de tours à s'épuiser, soit près de quatre ans — le temps
 * qu'on met à dire d'un camp qu'il est « en train de prendre ».
 */
const MOMENTUM_KEEP = 0.93;

/*
 * Ce que les semaines ajoutent au hasard, en amplitude. Mesuré : à 0,42, un
 * camp dépassait 28 % dans trente-neuf parties sur quarante et un autre
 * tombait sous 6 % dans trente-six. Des percées partout, donc des percées
 * nulle part : elles doivent rester l'histoire de CERTAINES parties.
 */
const MOMENTUM_NOISE = 0.28;

/** Ce que gouverner casse de dynamique, par tour. */
const MOMENTUM_POWER = 0.035;

/** Ce qu'une dynamique déplace dans le paysage, par tour et à plein régime. */
const MOMENTUM_PUSH = 0.62;

/*
 * CE QU'UN MOUVEMENT RÉEL LANCE COMME DYNAMIQUE. Une présidentielle gagnée
 * déplace le paysage de six points : elle ouvre donc une série de 0,3, qui
 * durera des années. Une scène qui vaut deux points en lance une petite. Sans
 * ce lien, la dynamique ne serait qu'un bruit avec de la mémoire ; avec lui,
 * elle a des causes qu'on peut voir venir et provoquer.
 */
const MOMENTUM_FROM_SHIFT = 0.05;

/*
 * Au-delà, on parle d'un camp qui perce ou qui s'effondre, et le journal le
 * dit. En dessous de MOMENTUM_QUIET, la série est retombée et l'on pourra en
 * reparler : sans cette bande morte, une dynamique qui oscille autour du
 * seuil faisait annoncer une percée tous les quatre tours.
 */
const MOMENTUM_LOUD = 0.6;

const MOMENTUM_QUIET = 0.25;

/** Chance, à chaque tour, qu'un ralliement se produise quelque part. */
const DEFECTION_CHANCE = 0.055;

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

/* La cote minimale en dessous de laquelle l'Élysée ne pense pas à vous vivait
   ici, en double de celle que la scène "entree_gouvernement" déclare déjà
   dans son "when". Deux fois le même nombre à deux endroits, c'est un nombre
   qui finira par ne plus être le même : maybeGovernmentCall() interroge
   désormais la scène, et le seuil n'est plus écrit qu'une fois, avec elle. */

/* ==========================================================================
   LES SCRUTINS : CE QUI PÈSE DANS UN RÉSULTAT
   ==========================================================================
   Le hasard d'un soir, ce que pèse un camp, ce qu'un sortant garde, et le
   seuil qu'il faut franchir pour chaque fonction.
   ========================================================================== */

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

/** Le scrutin d'où vient un poste, quand on n'a que le poste sous la main. */
const TARGET_ELECTION = {
  conseiller: "municipales", maire: "municipales", euro: "europeennes",
  depute: "legislatives", chef: "congres",
};

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
 * LA PRIME AU SIÈGE QU'ON OCCUPE DÉJÀ.
 *
 * L'appareil n'écoute pas de la même façon celui qui demande à entrer et
 * celui qui est déjà dans la pièce. Un conseiller municipal qui veut la tête
 * de liste ne quémande pas une faveur : il siège, il a le fichier de la
 * fédération, et le lui refuser oblige à expliquer pourquoi devant les mêmes
 * militants qui l'ont élu six ans plus tôt.
 *
 * Le moteur ne connaissait que la prime au SORTANT, qui ne joue que pour son
 * propre siège. Mesuré sur cent cinquante carrières, cela donnait ceci : un
 * cadre du parti SANS AUCUN MANDAT obtenait la tête de liste municipale sans
 * qu'un seul militant ait à se prononcer (cent cinq offres, zéro refus),
 * pendant que le conseiller sortant de la même ville se la voyait refuser une
 * fois sur deux — sa cote médiane au moment du scrutin valait très exactement
 * le seuil, trente-six contre trente-six.
 *
 * Et une municipale revient tous les six ans. Un refus ne coûte pas un tour,
 * il coûte un mandat entier : c'est le scrutin du jeu où le mur fait le plus
 * mal, et c'était celui où il était le plus haut.
 *
 * La prime vaut moins que celle du sortant : défendre son siège reste plus
 * facile que d'en prendre un, même celui d'à côté.
 */
const SEATED_CLAIM = {
  maire: { from: "conseiller", discount: 9 },
};

/**
 * La cote au parti à partir de laquelle un cadre prend une tête de liste
 * municipale plutôt qu'une place sur celle d'un autre. En dessous, on fait
 * le nombre ; au-dessus, on porte la ville.
 */
const CADRE_MAYOR_STANDING = 50;

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

const MAX_TERMS = 2;

/* ==========================================================================
   CE QU'UNE SOIRÉE ÉLECTORALE LAISSE
   ==========================================================================
   Le vocabulaire d'un résultat, et les deux courbes qui disent ce qu'il coûte
   ou rapporte.
   ========================================================================== */

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

/* ==========================================================================
   LES TEMPS FORTS
   ==========================================================================
   Combien de scènes dure chaque temps fort, et ce que chacune y déplace.
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
 * L'ADHÉSION N'EST PAS UN BULLETIN. On ne convertit jamais en voix tout ce
 * qu'un électorat pense de bien de vous : il a son propre candidat, ses
 * habitudes et son abstention. Le coefficient ramène la somme des adhésions
 * sur l'échelle d'un premier tour, où l'on gagne à vingt-cinq pour cent.
 */
const PRESIDENTIAL_CONVERSION = 0.45;

const SUPPORT_STEPS = 3;

/** Ce qu'un point de soutien vaut en points d'intentions de vote. */
const SUPPORT_WEIGHT = 0.55;

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

/** La cote au parti à partir de laquelle on choisit son terrain. */
const SEAT_CHOICE_STANDING = 55;

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

/*
 * ON NE PART PAS EN DISSIDENCE PARCE QU'ON EST VEXÉ.
 *
 * La porte n'était gardée que par l'écart de cote au parti : n'importe quel
 * élu à peu près bien noté pouvait affronter sa propre machine, ce qui est le
 * geste le plus rare et le plus coûteux de la vie politique. On ne le tente
 * que dans un cas : quand le pays est avec vous et que le parti ne l'est pas.
 *
 * Le seuil est haut à dessein. Mesurée sur huit mille tours, la note médiane
 * d'une carrière est de quarante-trois, et soixante-huit n'est dépassé que
 * dans les six pour cent de tours les plus favorables. (Le seuil valait
 * soixante-deux sur l'ancienne lecture, nationale : c'est le même percentile,
 * pas un durcissement — voir reachWeights.)
 */
const REBEL_POPULARITY = 68;

const REBEL_COST_WON = -6;

const REBEL_COST_LOST = -16;

/*
 * Trois tours, soit neuf mois avant le scrutin : c'est l'ordre de grandeur
 * réel (octobre 2011 pour avril 2012, novembre 2016 pour avril 2017), et
 * c'est surtout le seul décalage qui ne tombe sur aucune autre échéance —
 * voir la discipline d'offsets dans ELECTIONS. À deux tours, la primaire
 * mangeait une municipale de temps en temps.
 */
const PRIMARY_LEAD = 3;

/*
 * Elle était à 42, à la portée de presque toutes les carrières : le joueur
 * disputait trois à quatre présidentielles par partie et finissait par en
 * gagner une. L'Élysée tombait dans plus d'un quart des parties, contre trois
 * pour cent avant que la primaire n'existe. Une candidature à la présidence
 * doit rester le sommet d'une carrière, pas un rendez-vous quinquennal.
 */
const PRIMARY_FLOOR = 58;

/* ==========================================================================
   L'AUTRE PORTE : LA BASE
   ==========================================================================
   Une investiture présidentielle se donnait d'une seule façon : l'appareil
   comptait ses obligés, et qui ne pesait pas assez à l'appareil ne concourait
   jamais. C'est la moitié de la vérité. L'autre moitié est qu'un parti qui
   n'a pas de patron évident, ou qu'on pousse à le faire, ouvre une primaire —
   et une primaire ne compte pas les mêmes gens. Les militants ne votent pas
   pour celui à qui le siège doit quelque chose, ils votent pour celui qu'ils
   aiment.

   D'où deux routes vers la même investiture, et deux façons de peser : la
   cote au parti d'un côté, la base de l'autre. Voir js/game/modes/primaire.js.
   ========================================================================== */

/*
 * CE QU'IL FAUT AVOIR DERRIÈRE SOI POUR RÉCLAMER UNE PRIMAIRE.
 *
 * On ne demande pas un vote des militants pour savoir s'ils vous aiment : on
 * le demande parce qu'on sait déjà qu'ils vous aiment. En dessous, la demande
 * ne se plaide pas, elle se moque, et le jeu ne propose donc pas le bouton.
 */
const PRIMARY_CALL_BASE = 66;

/* Et il faut que le parti connaisse votre nom : une cote de rien du tout ne
   trouve personne pour porter la motion, si aimé qu'on soit dehors. */
const PRIMARY_CALL_FLOOR = 34;

/* Ce que la demande coûte, gagnée ou perdue. On force la main de l'appareil
   une fois ; il s'en souvient à chaque investiture suivante. */
const PRIMARY_CALL_COST = -9;

/*
 * ET CE QU'ELLE COÛTE DANS L'URNE. Une primaire qu'on a arrachée ne se
 * dispute pas comme une primaire qu'on vous offre : la machine se range
 * derrière l'autre, appelle les fédérations une par une et fait voter les
 * siens. Sans ce handicap, réclamer serait une seconde chance gratuite pour
 * qui a raté la première, et les deux routes cesseraient d'être un choix.
 * C'est le REBEL_HANDICAP de la dissidence, pour exactement la même raison.
 */
const PRIMARY_CALL_HANDICAP = -5;

/*
 * QUAND LE PARTI OUVRE UNE PRIMAIRE TOUT SEUL.
 *
 * Deux cas, et ce sont les vrais. D'abord l'absence de patron : quand les
 * deux premiers prétendants se tiennent dans un mouchoir, la direction n'a
 * personne à imposer et se décharge sur les militants. Ensuite l'époque : un
 * parti ouvre parfois une primaire parce que le précédent l'a fait et que ne
 * pas le faire se verrait.
 */
const PRIMARY_OPEN_GAP = 5;

const PRIMARY_OPEN_CHANCE = 0.22;

/* ==========================================================================
   LE CORPS : FATIGUE, DÉCLIN, SORTIES
   ==========================================================================
   Ce que l'épuisement coûte, quand le corps prévient, et à quelles conditions
   une carrière s'arrête.
   ========================================================================== */

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

/* La dette se compte en tours, et un tour vaut désormais une saison : les
   deux seuils sont doublés pour que ce soit toujours le même nombre d'années
   à sec qui casse quelqu'un. La probabilité, elle, est divisée. */
const BURNOUT_STRAIN = 28;

/** À partir de ce niveau de dette de fatigue, le corps commence à parler. */
const STRAIN_TALKS = BURNOUT_STRAIN / 2;

const BURNOUT_ENERGY = 2;

const BURNOUT_CHANCE = 0.07;

/** Au-delà, le corps n'a plus rien à ajouter. */
const DECLINE_MAX = 3;

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

/**
 * Ce que pèse ce qui a déjà été dit. Un premier signe entrouvre la porte, le
 * troisième la tient grande ouverte : on ne meurt pas d'un avertissement, on
 * meurt de les avoir tous ignorés.
 *
 * Le deuxième temps vaut à peu près ce que valait le risque avant que cet
 * arc n'existe. C'est le point de calage : une carrière qui va au bout de ce
 * que le corps a à lui dire se termine à peu près quand elle se terminait,
 * et une carrière qui s'arrête au premier signe gagne des années.
 */
const DECLINE_WEIGHT = [0, 0.5, 1.2, 2.0];

/* Une carrière politique finit toujours par s'arrêter : l'âge, ou les sondages. */
const RETIRE_AGE = 73;

const RETIRE_POPULARITY = 15;

/* ==========================================================================
   LES ÉVÉNEMENTS
   ==========================================================================
   Les jets, leurs extrêmes, et le temps que met une suite à revenir.
   ========================================================================== */

/** Part maximale des réussites (ou des échecs) qui bascule dans l'extrême. */
const CRIT_MAX = 0.15;

/** En dessous d'une chance sur quatre, on prévient. */
const RISKY_CHANCE = 0.25;

/** Délai par défaut quand un maillon n'en déclare pas : de six mois à un an. */
const DEFAULT_CHAIN_DELAY = [2, 4];

/** Au-delà (sept ans), une suite dont les conditions ne sont jamais réunies
    est oubliée. */
const CHAIN_PATIENCE = 28;

/** Ce qu'une carrière d'élu explique sans faire sourire personne. */
const WEALTH_EXPLAINABLE = 400000;

/* ==========================================================================
   LES PAGES DE CRÉATION
   ==========================================================================
   Le seul réglage qui vive hors de la partie.
   ========================================================================== */

/**
 * Positionnement sur la carte, en étiquettes plutôt qu'en graphique.
 *
 * Chaque pôle marqué donne une étiquette avec son icône. Un axe sur lequel
 * le parti n'a pas de position n'apparaît pas du tout : l'absence est
 * l'information. On lit ainsi un parti comme une liste de positions
 * tenues, et la fiche de droite garde les jauges précises.
 */
const NEUTRAL_THRESHOLD = 12;
