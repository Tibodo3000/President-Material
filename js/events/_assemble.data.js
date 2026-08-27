/*
 * President Material — TOUS LES ÉVÉNEMENTS DU JEU.
 * ============================================================================
 *
 * Ce fichier ne contient que des données, en syntaxe JSON stricte. Vous
 * pouvez le modifier sans toucher au reste du code : ajouter un événement,
 * changer une condition, un effet ou une probabilité.
 *
 * (Il porte l'extension .js et non .json pour une seule raison : un vrai
 * fichier .json exigerait un serveur web, alors qu'ici le jeu s'ouvre en
 * double-cliquant sur index.html. Tout ce qui suit la première ligne est
 * du JSON valide.)
 *
 * ----------------------------------------------------------------------------
 * SCHÉMA D'UN ÉVÉNEMENT
 * ----------------------------------------------------------------------------
 * {
 *   "id": "identifiant_unique",
 *   "weight": 2,                        // poids de tirage (défaut 2)
 *   "weightBonus": [ { "when": { ... }, "value": 4 } ],
 *                                       // ce poids, mais selon la situation
 *   "once": true,                       // ne se produit qu'une fois par partie
 *   "repeatable": true,                 // peut se revivre dans une carrière
 *   "quiet": true,                      // temps mort : le repli quand il n'y
 *                                       // a plus rien de neuf à jouer
 *   "cast": "opponent",                 // qui l'événement met en scène
 *   "moment": 2,                        // sa place dans une campagne (voir plus bas)
 *   "required": true,                   // scène de campagne qui tombe toujours
 *   "when": { ... },                    // conditions d'apparition (voir plus bas)
 *   "tag":  { "fr": "...", "en": "..." },
 *   "text": { "fr": "...", "en": "..." },
 *   "choices": [ ... ]
 * }
 *
 * CHRONOLOGIE ("moment") — pour les scènes de campagne seulement, dans
 * "campaign", "runoff", "support" et "races". Une campagne se joue en quelques
 * temps tirés au hasard, et le hasard ne sait pas lire un calendrier : sans
 * cela, le soir du premier tour peut tomber avant le porte-à-porte de la
 * dernière semaine. Le chiffre dit à combien de temps de la FIN la scène peut
 * tomber au plus tôt :
 *   1   au dernier temps seulement (« dernier soir », « entre les deux tours »)
 *   2   dans les deux derniers (« à dix jours du scrutin »)
 *   3   dans les trois derniers (« à trois semaines du scrutin »)
 * Plus le chiffre est petit, plus la scène est tardive, et une scène datée ne
 * repasse jamais derrière une scène plus tardive déjà jouée. Une scène sans
 * "moment" tombe n'importe quand : un scandale n'a pas de date.
 *
 * Un couple ferme le créneau des deux côtés, pour ce qui n'a de sens qu'au
 * début : "moment": [6, 4] se joue entre six et quatre temps de la fin, et
 * les cinq cents signatures ne se ramassent donc pas la veille du vote.
 *
 * POIDS VARIABLE ("weightBonus") — une scène est rare ou courante, et la
 * plupart le sont pareillement pour tout le monde. Certaines non : les cinq
 * cents signatures sont une formalité pour un camp qui pèse vingt-cinq pour
 * cent et un mur pour celui qui en pèse huit. "weightBonus" s'écrit comme
 * "chanceBonus", une liste de conditions et de valeurs qui s'additionnent au
 * poids de base. C'est fait pour rendre une scène PROBABLE là où elle
 * raconte quelque chose, pas pour la rendre certaine : gardez un poids de
 * base non nul, sinon la condition devient un "when" déguisé, et écrivez-le
 * franchement en "when" si c'est ce que vous voulez.
 *
 * SCÈNE OBLIGATOIRE ("required") — une présidentielle sans grand débat
 * n'existe pas, et on ne va pas confier cela au tirage. Une scène marquée
 * "required" se tire normalement tant qu'il lui reste de la place, personne
 * ne joue devant elle une scène qui lui fermerait son créneau, et le jour où
 * il ne reste plus que le temps qu'il lui faut, elle passe. Réservé aux
 * paquets de campagne, et à une ou deux scènes par paquet : au-delà, la
 * campagne n'est plus tirée, elle est écrite.
 *
 * CASTING ("cast") — qui est la figure désignée par {rival} :
 *   "opponent"     une figure d'un autre parti, tirée au poids de son camp
 *   "leader"       le chef d'un autre parti, même pondération
 *   "ruling"       le chef du camp qui gouverne. C'est lui, et personne
 *                  d'autre, qui vient chercher les voix qui lui manquent :
 *                  une négociation de majorité ne se tire pas au sort.
 *   "neighbour"    le chef du camp le plus proche du vôtre. Une alliance ne
 *                  se signe pas avec n'importe qui, et "leader" tirait au
 *                  poids : un parti de gauche radicale se voyait proposer un
 *                  pacte par les identitaires une fois sur six.
 *   "camp"         une figure de votre propre parti
 *   "camp_senior"  une figure de votre parti qui pèse assez pour vous
 *                  disputer quelque chose : ni militant, ni cadre. C'est le
 *                  casting de TOUTE scène qui se joue dans le parti.
 *   (absent)       une figure d'un autre parti, comme "opponent"
 * Le nom est tiré au moment où la carte sort et ne change plus : la question,
 * le résultat et les effets visent la même personne.
 *
 * Deux castings n'existent que pendant une présidentielle, où le champ de
 * candidats est connu et où l'on ne parle plus de n'importe qui :
 *   "minor"        l'appoint : le plus petit des VOISINS, parmi ceux qui sont
 *                  derrière vous au premier tour. On ne propose pas le même
 *                  marché au favori et à celui qui ne verra pas le second
 *                  tour, et on ne le propose pas à un camp qui ne vous parle
 *                  pas. Peut ne désigner personne : une scène qui en dépend
 *                  porte "when": { "minorClose": true }.
 *   "eliminated"   le plus gros des battus du premier tour, dont les voix
 *                  décident du second. Paquet "runoff" seulement.
 * Sans "cast", une scène de premier tour parle de celui qui est devant dans
 * les sondages, et une scène de second tour parle du finaliste d'en face.
 *
 * CONDITIONS ("when") — toutes doivent être remplies :
 *   "party":       ["radical_left", "socdem"]     le parti du joueur
 *   "position":    ["maire", "depute"]            sa fonction. ATTENTION :
 *                                                 "chef" dans cette liste ne
 *                                                 désigne plus une case mais
 *                                                 un titre, « dirige son
 *                                                 parti », quel que soit le
 *                                                 mandat tenu à côté. La
 *                                                 direction se cumule.
 *   "partyLead": true                             la même chose, écrite en
 *                                                 clair, sans rien exiger du
 *                                                 mandat
 *   "origin":      ["bourgeois"]                  son origine sociale
 *   "background":  ["business"]                   son parcours
 *   "personality": ["provocative"]                son caractère
 *   "minAge": 55,  "maxAge": 70
 *   "minPopularity": 60,  "maxPopularity": 30
 *   "minStanding": 60,    "maxStanding": 30
 *   "minMoney": 200000,   "maxMoney": 5000
 *   "minTurn": 20,        "maxTurn": 80
 *   "stat": { "notoriete": { "min": 6 }, "energie": { "max": 4 } }
 *   "flag": { "dirtyMoney": true, "onTrial": false }
 *   "trait":       ["orateur", "teflon"]           TOUS ces traits
 *   "anyTrait":    ["zozote", "voix"]              AU MOINS UN de ces traits
 *   "notTrait":    ["renegat"]                     aucun de ces traits
 *   "belowPeak": true                             vous occupez aujourd'hui une
 *                                                 fonction plus basse que la
 *                                                 plus haute de votre carrière
 *   "minApproval": 40,    "maxApproval": 30       la cote du gouvernement
 *   "majority": ["relative", "aucune"]            l'état de l'Assemblée :
 *                                                 "absolue", "relative", "aucune"
 *   "dissolved": true                             des législatives anticipées,
 *                                                 après une dissolution
 *   "ruling": true                                votre camp gouverne
 *   "allied": false                               vous avez un pacte en cours
 *   "minShare": 18                                le poids de votre camp dans
 *                                                 le pays, en points
 *   "maxShare": 15                                le même, par le haut : ce
 *                                                 qui n'arrive qu'aux petits
 *   "minCampaignSpend": 250000                    ce que la campagne en cours
 *                                                 a déjà coûté, en euros.
 *                                                 Une campagne se solde après
 *                                                 le vote : voir
 *                                                 auditCampaignAccounts()
 *   "yearEnd": true                               le dernier tour de l'année,
 *                                                 celui où l'on fait ses
 *                                                 comptes
 *   "rulingClose": true                           un camp VOISIN gouverne
 *                                                 (proche idéologiquement, et
 *                                                 ce n'est pas le vôtre)
 *   "minorClose": true                            il existe un appoint : un
 *                                                 candidat plus petit que
 *                                                 vous et assez proche pour
 *                                                 qu'un accord se signe.
 *                                                 Présidentielle seulement,
 *                                                 et elle va avec
 *                                                 "cast": "minor"
 *
 *   OÙ L'ON EST ASSIS DANS L'HÉMICYCLE. "ruling" ne dit que l'Élysée ; ces
 *   quatre-là disent le reste, et elles se combinent.
 *   "inCoalition": true                           votre camp vote les textes
 *                                                 du gouvernement. Avec
 *                                                 "ruling": false, c'est
 *                                                 l'allié du pouvoir, qui le
 *                                                 paie deux fois.
 *   "firstGroup": true                            votre parti est le premier
 *                                                 groupe de l'Assemblée. Ce
 *                                                 n'est pas gouverner, et
 *                                                 c'est de là qu'on renverse.
 *   "pivot": true                                 le gouvernement n'a pas la
 *                                                 majorité, et il l'aurait
 *                                                 avec vous. La place la plus
 *                                                 chère de la République.
 *   "minSeats": 60, "maxSeats": 32                les sièges de votre parti,
 *                                                 sur 577 (289 = la majorité)
 *
 * CHOIX ("choices") — deux formes possibles.
 *
 *   Choix simple, effet certain :
 *     { "label": {...},
 *       "effects": { ... },
 *       "result": { "fr": "...", "en": "..." } }
 *
 *   Choix incertain, avec jet composite :
 *     { "label": {...},
 *       "roll": {
 *         "base": 12,                     // difficulté à battre
 *         "stat": "charisme",            // statistique principale (poids 1)
 *         "plus": { "eloquence": 0.5,    // contributions secondaires :
 *                   "popularity": 0.06,  //   autres stats, popularité,
 *                   "standing": 0.04,    //   cote au parti, ou "money"
 *                   "money": 0.5 },      //   (par tranche de 100 000 €)
 *         "bonus": [                     // bonus conditionnels
 *           { "when": { "position": ["chef"] }, "value": 2 },
 *           { "when": { "flag": { "dirtyMoney": true } }, "value": -3 }
 *         ],
 *         "dice": 6                      // amplitude du hasard (défaut 6)
 *       },
 *       "success": { "effects": {...}, "result": {...} },
 *       "failure": { "effects": {...}, "result": {...} } }
 *
 *   Ou probabilité fixe, ajustable selon la situation :
 *     { "label": {...},
 *       "roll": { "chance": 0.5,
 *                 "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
 *       "success": {...}, "failure": {...} }
 *
 *   CHOIX CONDITIONNEL — n'apparaît que si la situation s'y prête. Il porte
 *   son propre "when", avec la même syntaxe que celui de l'événement, et
 *   s'affiche avec un losange dans l'interface :
 *     { "label": {...}, "when": { "minMoney": 200000 }, "effects": {...} }
 *
 *   Un événement peut compter autant de choix que nécessaire (2, 3, 5…),
 *   mais il doit toujours en rester au moins un sans condition.
 *
 * EFFETS ("effects") — tout est optionnel :
 *   statistiques : "charisme", "eloquence", "energie", "sangfroid",
 *                  "reseau", "notoriete", "reputation",
 *                  "credibilite"                         (bornées 0-20)
 *
 *          Les quatre dernières disent quatre choses différentes, et il vaut
 *          la peine de viser la bonne :
 *            RÉSEAU       qui vous doit quelque chose.
 *            NOTORIÉTÉ    à quel point on vous connaît. Elle monte presque
 *                         toute seule : être connu n'est pas une qualité.
 *            RÉPUTATION   à quel point ce qu'on sait de vous est propre.
 *            CRÉDIBILITÉ  la stature. Est-ce qu'on vous imagine dans le
 *                         fauteuil ? Une scène qui donne de la popularité en
 *                         coûte souvent, et c'est là qu'est l'arbitrage :
 *                         le coup d'éclat fait aimer, il ne fait pas sérieux.
 *   jauges       : "popularity", "standing"              (bornées 0-100)
 *   "money": 80000                                       en euros
 *   "poll": 5                                            campagne uniquement
 *   "flags": { "dirtyMoney": true }                      pose ou retire un drapeau
 *   "strike": "menteur"                                  UN ÉCART DE PLUS.
 *          Certaines marques ne s'attrapent pas du premier coup : il faut
 *          récidiver. L'événement signale l'écart, le moteur compte, et la
 *          marque tombe au énième. Le nombre est dans js/traits.data.js.
 *   "chain": "id_evenement"                              programme une suite
 *   "chain": ["id_un", "id_deux"]                        ou plusieurs
 *   "end": "conviction"                                  termine la partie
 *
 *   "landscape": { "self": 2, "scene": -2 }              LE RAPPORT DE FORCE.
 *          Déplace les intentions de vote entre partis, en points. Les cibles
 *          possibles : "self" (le vôtre), "scene" (celui de la figure mise en
 *          scène), "ruling" (le camp au pouvoir), "ally" (votre allié), ou une
 *          clé de parti écrite en toutes lettres. C'est ce qui fait qu'un
 *          débat ou une trahison compte pour le pays et pas seulement pour
 *          vous : au-delà de deux points, on déplace une élection.
 *
 *   "office": "ministre"                                 donne une fonction
 *          sans passer par les urnes : un ministère, une tête de liste
 *          européenne. Le sommet atteint dans la carrière suit tout seul.
 *   "office": "none"                                     vous fait sortir
 *          sans rien. ON NE RETOMBE JAMAIS SUR UN MANDAT : quitter un poste
 *          ne rend pas celui d'avant, il ne reste que ce que le parti veut
 *          bien vous garder. Le moteur décide entre cadre et militant.
 *   "lead": true                                         vous donne la
 *          DIRECTION DU PARTI, et "lead": false vous la retire. Elle n'est
 *          pas une fonction : LE MANDAT NE BOUGE PAS. C'est la seule chose
 *          du jeu qui se cumule, parce que c'est la seule qui se cumule dans
 *          la vraie vie. La direction se prend normalement au congrès ; cet
 *          effet sert aux scènes qui la donnent ou la reprennent entre deux.
 *   "approval": -8                                       la cote du
 *          gouvernement dans le pays, de 0 à 100.
 *   "dissolve": true                                     le président dissout
 *          l'Assemblée : des législatives au tour suivant, hors calendrier.
 *   "join": "scene"                                      vous changez de parti
 *   "alliance": "scene"                                  signe un pacte
 *   "alliance": null                                     le rompt
 *
 * Dans les textes, {rival} est remplacé par le nom de la figure mise en scène,
 * {rival_party} par le nom de son parti, et {party} par celui du joueur.
 * ============================================================================
 */

/* Assemblé depuis js/events/*.data.js — voir le schéma ci-dessus. */
const EVENT_DATA = {
  events: [].concat(EV_debuts, EV_medias, EV_argent, EV_appareil, EV_chaines, EV_rivaux, EV_vie_privee, EV_partis, EV_caractere, EV_institutions, EV_assemblee, EV_grandes_decisions, EV_divers, EV_declin),
  campaign: EV_campaign,
  runoff: EV_runoff,
  nomination: EV_nomination,
  support: EV_support,
  aside: EV_aside,
  races: EV_races,
};
