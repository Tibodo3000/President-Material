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
 *   "once": true,                       // ne se produit qu'une fois par partie
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
 *   "minor"        le plus petit du premier tour. On ne propose pas le même
 *                  marché au favori et à celui qui plafonne à cinq pour cent.
 *   "eliminated"   le plus gros des battus du premier tour, dont les voix
 *                  décident du second. Paquet "runoff" seulement.
 * Sans "cast", une scène de premier tour parle de celui qui est devant dans
 * les sondages, et une scène de second tour parle du finaliste d'en face.
 *
 * CONDITIONS ("when") — toutes doivent être remplies :
 *   "party":       ["radical_left", "socdem"]     le parti du joueur
 *   "position":    ["maire", "depute"]            sa fonction
 *   "origin":      ["bourgeois"]                  son origine sociale
 *   "background":  ["business"]                   son parcours
 *   "personality": ["provocative"]                son caractère
 *   "minAge": 55,  "maxAge": 70
 *   "minPopularity": 60,  "maxPopularity": 30
 *   "minStanding": 60,    "maxStanding": 30
 *   "minMoney": 200000,   "maxMoney": 5000
 *   "minTurn": 10,        "maxTurn": 40
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
 *   "rulingClose": true                           un camp VOISIN gouverne
 *                                                 (proche idéologiquement, et
 *                                                 ce n'est pas le vôtre)
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
 *   "join": "scene"                                      vous changez de parti
 *   "alliance": "scene"                                  signe un pacte
 *   "alliance": null                                     le rompt
 *
 * Dans les textes, {rival} est remplacé par le nom de la figure mise en scène,
 * {rival_party} par le nom de son parti, et {party} par celui du joueur.
 * ============================================================================
 */

const EVENT_DATA = {

"events": [

/* ==========================================================================
   1. DÉBUTS DE CARRIÈRE — militant, cadre du parti et conseiller
   ========================================================================== */

{
  "id": "cause_locale",
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Terrain", "en": "On the ground" },
  "text": {
    "fr": "Un collectif se bat contre la fermeture de la maternité. Ils cherchent un visage pour porter la pétition.",
    "en": "A local group is fighting the maternity ward closure. They need a face for the petition."
  },
  "choices": [
    { "label": { "fr": "Devenir ce visage", "en": "Become that face" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "landscape": { "self": 0.7 }, "reseau": 1, "notoriete": 1, "energie": -2, "popularity": 12, "standing": 4 },
      "result": { "fr": "Des mois de réunions. Des centaines de gens connaissent votre prénom.",
                  "en": "Months of meetings. Hundreds of people know your first name now." } },
    { "label": { "fr": "Soutenir de loin", "en": "Support from a distance" },
      "effects": { "energie": 1, "popularity": -4 },
      "result": { "fr": "Une signature, une photo. Le collectif ne vous doit rien.",
                  "en": "A signature, a photo. The group owes you nothing." } },
    { "label": { "fr": "Structurer le collectif", "en": "Organise the group properly" },
      "when": { "background": ["activism"] },
      "effects": { "reseau": 2, "energie": -1, "popularity": 9, "standing": 6 },
      "result": { "fr": "Vous savez faire : commissions, calendrier, porte-parole. En six mois ils pèsent.",
                  "en": "You know how: committees, a calendar, a spokesperson. In six months they matter." } },
    { "label": { "fr": "Attaquer la fermeture en justice", "en": "Challenge the closure in court" },
      "when": { "background": ["law"] },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "reputation": 2, "popularity": 14 },
        "result": { "fr": "Le tribunal suspend la fermeture. Votre nom est sur la décision.",
                    "en": "The court suspends the closure. Your name is on the ruling." } },
      "failure": { "effects": { "popularity": -3, "energie": -1 },
        "result": { "fr": "Le recours est rejeté sur la forme. Deux ans de procédure pour rien.",
                    "en": "The appeal is dismissed on procedure. Two years of litigation for nothing." } } }
  ]
},

{
  "id": "porte_a_porte",
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Militantisme", "en": "Canvassing" },
  "text": {
    "fr": "La fédération organise une campagne de porte-à-porte. Personne ne se bat pour prendre les quartiers difficiles.",
    "en": "The local party is organising a canvassing drive. Nobody is fighting to take the hard neighbourhoods."
  },
  "choices": [
    { "label": { "fr": "Prendre les quartiers que personne ne veut", "en": "Take the ones nobody wants" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "landscape": { "self": 0.6 }, "energie": -2, "reputation": 1, "popularity": 8, "standing": 3, "trait": "bosseur" },
      "result": { "fr": "Trois cents portes, beaucoup fermées. Ceux qui ont ouvert se souviennent de vous.",
                  "en": "Three hundred doors, many shut. The ones that opened remember you." } },
    { "label": { "fr": "Rester au local à organiser", "en": "Stay at HQ and organise" },
      "effects": { "reseau": 1, "standing": 6, "popularity": -2 },
      "result": { "fr": "Vous tenez les tableaux et les listes. Utile, invisible.",
                  "en": "You run the boards and the lists. Useful, invisible." } },
    { "label": { "fr": "Y aller seul, sans tract", "en": "Go alone, without leaflets" },
      "when": { "personality": ["charming"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "energie": 0.4 }, "dice": 16 },
      "success": { "effects": { "charisme": 1, "popularity": 12, "standing": 3 },
        "result": { "fr": "Vous parlez, vous écoutez, vous ne vendez rien. Les gens en parlent entre eux le soir.",
                    "en": "You talk, you listen, you sell nothing. People mention it to each other that evening." } },
      "failure": { "effects": { "energie": -1, "popularity": -3 },
        "result": { "fr": "Sans support, la conversation tourne court sur le pas de la porte.",
                    "en": "With nothing in hand, the conversation dies on the doorstep." } } },
    { "label": { "fr": "Financer un vrai matériel de campagne", "en": "Pay for proper campaign material" },
      "when": { "minMoney": 80000 },
      "effects": { "money": -35000, "notoriete": 1, "popularity": 8, "standing": 3 },
      "result": { "fr": "Affiches, tracts en couleur, une petite équipe payée. La fédération n'a jamais vu ça.",
                  "en": "Posters, colour leaflets, a small paid team. The local party has never seen anything like it." } }
  ]
},

{
  "id": "premier_discours",
  "once": true,
  "when": { "position": ["militant", "cadre", "conseiller"], "maxTurn": 12 },
  "tag": { "fr": "Première fois", "en": "First time" },
  "text": {
    "fr": "On vous demande de parler cinq minutes devant deux cents personnes. Vous n'avez jamais fait ça.",
    "en": "You are asked to speak for five minutes in front of two hundred people. You have never done this."
  },
  "choices": [
    { "label": { "fr": "Parler sans notes", "en": "Speak without notes" },
      "roll": { "stat": "charisme", "base": 13, "dice": 16 },
      "success": { "effects": { "eloquence": 1, "notoriete": 1, "popularity": 8, "standing": 2, "trait": "orateur" },
        "result": { "fr": "La salle vous écoute vraiment. Quelque chose vient de commencer.",
                    "en": "The room actually listens. Something has just started." } },
      "failure": { "effects": { "eloquence": 1, "popularity": -8, "standing": -5 },
        "result": { "fr": "Vous perdez le fil au milieu. On applaudit poliment, c'est pire.",
                    "en": "You lose your thread halfway. The polite applause is worse than silence." } } },
    { "label": { "fr": "Lire un texte préparé", "en": "Read a prepared text" },
      "effects": { "eloquence": 1, "standing": 6, "popularity": -3, "notoriete": -1 },
      "result": { "fr": "C'est propre et sans risque. Personne ne s'en souviendra.",
                  "en": "Clean and safe. Nobody will remember it." } },
    { "label": { "fr": "Faire venir vos amis pour applaudir", "en": "Bring friends along to applaud" },
      "effects": { "notoriete": 1, "popularity": 2, "reseau": 1, "reputation": -1, "standing": -2 },
      "result": { "fr": "Douze personnes applaudissent très fort aux bons moments. La vidéo donne l'impression d'une salle conquise.",
                  "en": "Twelve people applaud very loudly at the right moments. The video gives the impression of a room won over." } }
  ]
},

{
  "id": "permanence",
  "when": { "position": ["conseiller", "maire"] },
  "tag": { "fr": "Permanence", "en": "Surgery" },
  "text": {
    "fr": "Le samedi matin, votre permanence est pleine de gens avec des problèmes que vous ne pouvez pas résoudre.",
    "en": "On Saturday mornings your surgery is full of people with problems you cannot solve."
  },
  "choices": [
    { "label": { "fr": "Recevoir tout le monde, quitte à finir tard", "en": "See everyone, however late it runs" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "energie": -2, "reputation": 1, "popularity": 9 },
      "result": { "fr": "Vous rentrez à vingt heures. On raconte en ville que vous écoutez.",
                  "en": "You get home at eight. Word goes round the town that you listen." } },
    { "label": { "fr": "Déléguer à votre équipe", "en": "Delegate to your team" },
      "effects": { "landscape": { "self": 0.5 }, "energie": 1, "reseau": 1, "popularity": -5 },
      "result": { "fr": "Le travail est fait. Ce n'est pas vous qu'ils ont vu.",
                  "en": "The work gets done. It is not you they saw." } },
    { "label": { "fr": "Traiter les dossiers administratifs vous-même", "en": "Handle the paperwork yourself" },
      "when": { "background": ["civil", "law"] },
      "effects": { "reputation": 2, "energie": -1, "popularity": 12, "standing": 3 },
      "result": { "fr": "Vous savez quel formulaire débloque quoi. Six dossiers résolus en une matinée.",
                  "en": "You know which form unlocks what. Six cases solved in one morning." } },
    { "label": { "fr": "Filmer et diffuser les permanences", "en": "Film the surgeries and post them" },
      "when": { "background": ["celebrity", "comms"] },
      "roll": { "base": 13, "stat": "notoriete", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 10 },
        "result": { "fr": "Les vidéos dépassent votre circonscription. On découvre le travail réel d'un élu.",
                    "en": "The videos travel far beyond your constituency. People discover what the job really is." } },
      "failure": { "effects": { "reputation": -2, "popularity": -6 },
        "result": { "fr": "On vous accuse d'exposer la misère des gens pour vous faire mousser.",
                    "en": "You are accused of parading people's hardship to promote yourself." } } }
  ]
},

/* ==========================================================================
   2. MÉDIAS ET IMAGE
   ========================================================================== */

{
  "id": "matinale",
  "when": { "position": ["conseiller", "maire", "euro", "depute", "ministre", "chef"] },
  "tag": { "fr": "Médias", "en": "Media" },
  "text": {
    "fr": "Une matinale de grande écoute vous invite demain. Le journaliste est réputé pour ne rien laisser passer.",
    "en": "A prime-time morning show wants you on tomorrow. The host is famous for letting nothing slide."
  },
  "choices": [
    { "label": { "fr": "Préparer l'entretien toute la nuit", "en": "Prepare all night" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "eloquence": 1, "energie": -2, "notoriete": 1, "popularity": 7, "standing": 3 },
      "result": { "fr": "Prestation solide. Vous sortez du studio épuisé mais crédible.",
                  "en": "A solid performance. You leave the studio exhausted but credible." } },
    { "label": { "fr": "Y aller à l'instinct", "en": "Wing it" },
      "roll": { "base": 19, "stat": "charisme",
                "plus": { "eloquence": 0.4, "popularity": 0.035 },
                "bonus": [ { "when": { "position": ["chef", "depute", "ministre"] }, "value": 1.5 },
                           { "when": { "stat": { "energie": { "max": 6 } } }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "landscape": { "self": -0.7 }, "notoriete": 2, "popularity": 12, "standing": 2 },
        "result": { "fr": "Votre naturel fait mouche. La séquence tourne toute la journée.",
                    "en": "Your ease lands. The clip runs all day." } },
      "failure": { "effects": { "reputation": -1, "popularity": -9, "standing": -4 },
        "result": { "fr": "Une hésitation de trop. Le montage ne vous épargne pas.",
                    "en": "One hesitation too many. The edit is not kind." } } },
    { "label": { "fr": "Faire briefer par votre communicant", "en": "Get briefed by your spin doctor" },
      "when": { "background": ["comms"] },
      "effects": { "eloquence": 1, "popularity": 9, "standing": 5, "reputation": -1 },
      "result": { "fr": "Vous connaissez le métier de l'autre côté. Chaque réponse tombe juste.",
                  "en": "You know the trade from the other side. Every answer lands." } },
    { "label": { "fr": "Payer une préparation médias", "en": "Pay for media training" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -25000, "eloquence": 1, "popularity": 8, "standing": 3 },
      "result": { "fr": "Deux jours de simulation face caméra. L'entretien se passe sans accroc.",
                  "en": "Two days of mock interviews. The real one goes without a hitch." } }
  ]
},

{
  "id": "vieux_tweet",
  "when": { "stat": { "notoriete": { "min": 6 } } },
  "tag": { "fr": "Réseaux", "en": "Social media" },
  "text": {
    "fr": "Un message que vous aviez publié il y a des années refait surface. Sorti de son contexte, il est du plus mauvais effet.",
    "en": "Something you posted years ago has resurfaced. Out of context, it looks terrible."
  },
  "choices": [
    { "label": { "fr": "Présenter des excuses", "en": "Apologise" },
      "effects": { "reputation": 1, "notoriete": -1, "popularity": -3, "standing": 5 },
      "result": { "fr": "L'orage passe. L'appareil apprécie qu'on sache éteindre un feu.",
                  "en": "The storm passes. The machine likes someone who can put a fire out." } },
    { "label": { "fr": "Assumer sans trembler", "en": "Stand by it" },
      "effects": { "notoriete": 2, "reputation": -1, "popularity": 6, "standing": -9 },
      "result": { "fr": "La polémique enfle, votre nom circule. Le parti, lui, ne vous remercie pas.",
                  "en": "The row grows and so does your name. The party is not grateful." } },
    { "label": { "fr": "En remettre une couche", "en": "Double down, harder" },
      "when": { "personality": ["provocative"] },
      "effects": { "landscape": { "self": -1.2 }, "notoriete": 3, "reputation": -2, "popularity": 9, "standing": -14, "strike": "radical" },
      "result": { "fr": "Vous republiez le message avec un commentaire pire. Le pays ne parle que de vous.",
                  "en": "You repost it with a worse comment. The country talks about nothing else." } },
    { "label": { "fr": "Noyer l'affaire sous une contre-campagne", "en": "Bury it under a counter-campaign" },
      "when": { "background": ["comms"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 4, "standing": 6, "strike": "menteur" },
        "result": { "fr": "Trois autres sujets sortent le même jour. Le vôtre disparaît du fil.",
                    "en": "Three other stories break the same day. Yours vanishes from the feed." } },
      "failure": { "effects": { "popularity": -7, "reputation": -1 },
        "result": { "fr": "La manœuvre se voit. On écrit un article sur votre article.",
                    "en": "The manoeuvre is spotted. Someone writes a piece about your piece." } } }
  ]
},

{
  "id": "gaffe",
  "tag": { "fr": "Meeting", "en": "Rally" },
  "text": {
    "fr": "En meeting, une phrase sort de travers. Isolée, elle est indéfendable, et elle est déjà en ligne.",
    "en": "At a rally, a sentence comes out wrong. On its own it is indefensible, and it is already online."
  },
  "choices": [
    { "label": { "fr": "En rire vous-même", "en": "Laugh at yourself" },
      "roll": { "stat": "charisme", "base": 13, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "popularity": 9 },
        "result": { "fr": "Votre autodérision désamorce tout. On ne retient que la vanne.",
                    "en": "Your self-mockery defuses it. Only the joke survives." } },
      "failure": { "effects": { "credibilite": -3, "reputation": -1, "popularity": -13, "standing": -6 },
        "result": { "fr": "Le rire sonne faux. La séquence vit sa vie.",
                    "en": "The laugh rings false. The clip lives its own life." } } },
    { "label": { "fr": "Communiqué de clarification", "en": "Issue a clarification" },
      "effects": { "credibilite": +1, "notoriete": -1, "popularity": -5, "standing": 4 },
      "result": { "fr": "Le communiqué éteint l'incendie et tout intérêt pour vous.",
                  "en": "The statement kills the fire, and any interest in you." } },
    { "label": { "fr": "Assumer et répéter la phrase", "en": "Own it and say it again" },
      "when": { "personality": ["provocative"] },
      "effects": { "landscape": { "self": -1.6 }, "credibilite": -3, "notoriete": 3, "reputation": -2, "popularity": 7, "standing": -12 },
      "result": { "fr": "Vous la redites, plus fort. Une moitié du pays vous adore pour ça.",
                  "en": "You say it again, louder. Half the country loves you for it." } },
    { "label": { "fr": "Exiger un droit de réponse", "en": "Demand a right of reply" },
      "when": { "background": ["law"] },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": -4, "standing": 4, "notoriete": -1 },
      "result": { "fr": "Vous connaissez la procédure par cœur. Les rédactions rectifient sans discuter.",
                  "en": "You know the procedure by heart. The newsrooms correct it without argument." } }
  ]
},

{
  "id": "documentaire",
  "when": { "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Portrait", "en": "Profile" },
  "text": {
    "fr": "Une équipe veut vous suivre six mois pour un documentaire. Caméra partout, y compris là où vous ne contrôlez rien.",
    "en": "A film crew wants to follow you for six months. Cameras everywhere, including where you control nothing."
  },
  "choices": [
    { "label": { "fr": "Accepter l'accès total", "en": "Grant total access" },
      "roll": { "chance": 0.55 },
      "success": { "effects": { "landscape": { "self": -0.9 }, "notoriete": 2, "popularity": 12, "standing": -5, "trait": "bete_scene" },
        "result": { "fr": "Le film vous montre humain et travailleur. Il fait deux millions d'entrées.",
                    "en": "The film shows you human and hard-working. Two million people watch it." } },
      "failure": { "effects": { "notoriete": 2, "reputation": -2, "popularity": -12, "standing": -8 },
        "result": { "fr": "Le montage garde vos colères et vos silences. Le film fait mal.",
                    "en": "The edit keeps your tempers and your silences. The film hurts." } } },
    { "label": { "fr": "Refuser poliment", "en": "Decline politely" },
      "effects": { "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Pas de caméra, pas de risque, pas d'histoire.",
                  "en": "No camera, no risk, no story." } },
    { "label": { "fr": "Exiger un droit de regard au montage", "en": "Demand editorial control" },
      "when": { "background": ["journalism", "comms"] },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "notoriete": 2, "popularity": 9, "standing": 4 },
        "result": { "fr": "Vous obtenez le final cut. Le film est flatteur et personne ne le saura.",
                    "en": "You get final cut. The film is flattering and nobody will know." } },
      "failure": { "effects": { "notoriete": 1, "reputation": -1, "popularity": -5 },
        "result": { "fr": "L'équipe refuse et le raconte. On parle de votre goût du contrôle.",
                    "en": "The crew refuses and says so publicly. People talk about your need for control." } } }
  ]
},

{
  "id": "photo_volee",
  "when": { "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "Un magazine publie des photos de vos vacances. Rien de scandaleux, mais l'hôtel est très cher.",
    "en": "A magazine publishes holiday photos of you. Nothing scandalous, but the hotel is very expensive."
  },
  "choices": [
    { "label": { "fr": "Attaquer en justice", "en": "Sue" },
      "effects": { "money": -30000, "notoriete": 1, "popularity": -6, "standing": 2 },
      "result": { "fr": "Le procès dure deux ans et rappelle l'affaire à chaque audience.",
                  "en": "The case drags on for two years, reviving the story at every hearing." } },
    { "label": { "fr": "Ne pas relever", "en": "Let it pass" },
      "effects": { "sangfroid": 1, "popularity": -3 },
      "result": { "fr": "L'histoire meurt en dix jours, comme toutes les autres.",
                  "en": "The story dies in ten days, like all the others." } },
    { "label": { "fr": "Publier vous-même l'album complet", "en": "Publish the whole album yourself" },
      "when": { "personality": ["provocative", "charming"] },
      "effects": { "notoriete": 2, "popularity": 8, "reputation": -1 },
      "result": { "fr": "Vous mettez tout en ligne avec des légendes moqueuses. Le magazine est ridicule.",
                  "en": "You post everything with mocking captions. The magazine looks ridiculous." } },
    { "label": { "fr": "Racheter les droits des photos restantes", "en": "Buy the rights to the remaining photos" },
      "when": { "minMoney": 250000 },
      "effects": { "money": -140000, "popularity": 2, "sangfroid": 1 },
      "result": { "fr": "Ce qui n'est pas sorti ne sortira jamais. C'est très cher et ça vaut le prix.",
                  "en": "What has not come out never will. It is very expensive and worth every euro." } }
  ]
},

/* ==========================================================================
   3. ARGENT ET COMPROMISSIONS
   ========================================================================== */

{
  "id": "mecene",
  "once": true,
  "when": { "flag": { "dirtyMoney": false } },
  "tag": { "fr": "Argent", "en": "Money" },
  "text": {
    "fr": "Un homme d'affaires que personne n'ose fréquenter propose de financer vos activités. Il ne demande rien. Pour l'instant.",
    "en": "A businessman nobody dares be seen with offers to fund your work. He asks for nothing. For now."
  },
  "choices": [
    { "label": { "fr": "Accepter discrètement", "en": "Accept quietly" },
      "effects": { "money": 80000, "reseau": 1, "standing": 8, "flags": { "dirtyMoney": true }, "strike": "casserole" },
      "result": { "fr": "Le virement arrive par une société écran. Votre campagne respire enfin.",
                  "en": "The transfer comes through a shell company. Your campaign can breathe." } },
    { "label": { "fr": "Refuser poliment", "en": "Decline politely" },
      "effects": { "reputation": 1, "popularity": 3, "standing": -3 },
      "result": { "fr": "Il sourit et n'insiste pas. Vous dormez bien, et vous restez pauvre.",
                  "en": "He smiles and does not insist. You sleep well, and stay poor." } },
    { "label": { "fr": "Le dénoncer publiquement", "en": "Expose him publicly" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "self": -1.1, "identitarians": 0.9 }, "strike": "intrepide", "notoriete": 2, "reputation": 3, "popularity": 11, "standing": -9, "trait": "intouchable", "chain": "position_impopulaire" },
      "result": { "fr": "Vous racontez la proposition en détail devant les caméras. L'homme disparaît.",
                  "en": "You describe the offer in detail on camera. The man disappears." } },
    { "label": { "fr": "Monter un financement transparent", "en": "Set up transparent funding" },
      "when": { "background": ["business"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "money": 45000, "reseau": 1, "reputation": 2, "standing": 5 },
        "result": { "fr": "Vous transformez son enveloppe en dons déclarés et plafonnés. Moins d'argent, aucun risque.",
                    "en": "You turn his envelope into declared, capped donations. Less money, no risk." } },
      "failure": { "effects": { "reseau": -1, "standing": -6, "popularity": -3 },
        "result": { "fr": "Il refuse le cadre légal et va financer un rival. Vous n'avez ni l'argent ni la paix.",
                    "en": "He refuses the legal framework and funds a rival instead. You have neither the money nor the peace." } } },
    { "label": { "fr": "Accepter en montant un écran juridique", "en": "Accept behind a legal screen" },
      "when": { "personality": ["calculating"] },
      "effects": { "money": 110000, "reseau": 1, "standing": 9, "reputation": -2, "sangfroid": -1, "flags": { "dirtyMoney": true }, "trait": "caisse_noire" },
      "result": { "fr": "Trois sociétés, deux pays, un cabinet complaisant. Ça tiendra un moment.",
                  "en": "Three companies, two countries, an accommodating law firm. It will hold for a while." } }
  ]
},

{
  "id": "note_de_frais",
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Petits arrangements", "en": "Small arrangements" },
  "text": {
    "fr": "Votre assistant vous montre comment d'autres passent leurs frais personnels sur l'enveloppe parlementaire. Tout le monde le fait.",
    "en": "Your assistant shows you how others put personal expenses on the parliamentary allowance. Everyone does it."
  },
  "choices": [
    { "label": { "fr": "Faire comme tout le monde", "en": "Do what everyone does" },
      "effects": { "money": 45000, "standing": 3, "flags": { "dirtyMoney": true } },
      "result": { "fr": "C'est facile, c'est courant, et ça laisse une trace écrite quelque part.",
                  "en": "It is easy, it is common, and it leaves a paper trail somewhere." } },
    { "label": { "fr": "Tout payer de votre poche", "en": "Pay for everything yourself" },
      "effects": { "money": -20000, "reputation": 2, "popularity": 4 },
      "result": { "fr": "Votre comptable vous trouve absurde. Vous dormez mieux que lui.",
                  "en": "Your accountant thinks you are absurd. You sleep better than he does." } },
    { "label": { "fr": "Faire border le tout par un fiscaliste", "en": "Have a tax lawyer make it airtight" },
      "when": { "background": ["law"], "minMoney": 50000 },
      "effects": { "money": 25000, "sangfroid": 1, "standing": 4, "reputation": -1 },
      "result": { "fr": "Chaque ligne est défendable. Ce n'est pas honnête, c'est inattaquable.",
                  "en": "Every line is defensible. It is not honest; it is unassailable." } },
    { "label": { "fr": "Publier vos comptes de votre propre initiative", "en": "Publish your accounts unprompted" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "self": -1.4, "identitarians": 1.2 }, "reputation": 3, "popularity": 12, "standing": -11 },
      "result": { "fr": "Vos collègues vous détestent immédiatement. Vous venez de créer un précédent.",
                  "en": "Your colleagues hate you instantly. You have just set a precedent." } }
  ]
},

{
  "id": "conference_payee",
  "when": { "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Argent", "en": "Money" },
  "text": {
    "fr": "Une banque vous propose vingt mille euros pour une conférence d'une heure devant ses cadres.",
    "en": "A bank offers you twenty thousand euros for a one-hour talk to its executives."
  },
  "choices": [
    { "label": { "fr": "Accepter, c'est légal", "en": "Accept, it is legal" },
      "effects": { "money": 45000, "reputation": -1, "popularity": -7, "standing": 4 },
      "result": { "fr": "Une heure de votre temps contre un an de salaire médian. La presse fait le calcul.",
                  "en": "One hour of your time for a year of the median wage. The press does the maths." } },
    { "label": { "fr": "Refuser publiquement", "en": "Refuse publicly" },
      "effects": { "landscape": { "self": -0.8, "identitarians": 0.6 }, "reputation": 2, "popularity": 8, "standing": -4 },
      "result": { "fr": "Votre refus fait plus de bruit que la conférence n'en aurait fait.",
                  "en": "Your refusal makes more noise than the talk ever would have." } },
    { "label": { "fr": "Accepter et tout reverser", "en": "Accept and give it all away" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "popularity": 9, "standing": -5, "trait": "intouchable" },
      "result": { "fr": "Le chèque part à une association le jour même, avec le reçu publié.",
                  "en": "The cheque goes to a charity the same day, receipt published." } },
    { "label": { "fr": "Négocier le double", "en": "Negotiate double" },
      "when": { "background": ["business"] },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "stat": { "notoriete": { "min": 14 } } }, "value": 0.2 } ] },
      "success": { "effects": { "money": 45000, "reseau": 1, "reputation": -1, "popularity": -6 },
        "result": { "fr": "Ils paient sans discuter. Vous saviez ce que vous valiez pour eux.",
                    "en": "They pay without arguing. You knew what you were worth to them." } },
      "failure": { "effects": { "reseau": -1, "standing": -3 },
        "result": { "fr": "Ils invitent quelqu'un d'autre. Votre gourmandise a fait le tour du milieu.",
                    "en": "They invite someone else. Word of your greed goes round the sector." } } }
  ]
},

/* ==========================================================================
   4. LE PARTI ET L'APPAREIL
   ========================================================================== */

{
  "id": "mentor",
  "once": true,
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Parti", "en": "Party" },
  "text": {
    "fr": "Une figure historique du parti vous observe depuis quelque temps. Elle propose de vous ouvrir son carnet d'adresses.",
    "en": "A veteran of the party has been watching you. They offer to open their contact book."
  },
  "choices": [
    { "label": { "fr": "Accepter son parrainage", "en": "Accept the patronage" },
      "effects": { "reseau": 2, "standing": 11, "reputation": -1, "popularity": -8, "chain": "mentor_dette" },
      "result": { "fr": "Les portes s'ouvrent. Vous lui devez quelque chose, désormais.",
                  "en": "Doors open. You owe them something now." } },
    { "label": { "fr": "Faire votre chemin seul", "en": "Make your own way" },
      "effects": { "reputation": 1, "popularity": 10, "standing": -6 },
      "result": { "fr": "On note votre indépendance. Elle plaît dehors et agace dedans.",
                  "en": "Your independence is noted. It plays well outside and grates inside." } },
    { "label": { "fr": "Accepter, en comptant bien s'en affranchir", "en": "Accept, fully intending to shake him off later" },
      "when": { "personality": ["calculating"] },
      "effects": { "reseau": 2, "standing": 12, "sangfroid": 1, "reputation": -2, "popularity": -6, "chain": "mentor_dette" },
      "result": { "fr": "Vous prenez le carnet d'adresses et vous notez déjà, quelque part, la date à laquelle il deviendra encombrant.",
                  "en": "You take the contacts book, already noting somewhere the date on which he will become inconvenient." } }
  ]
},

{
  "id": "mentor_dette",
  "delay": [6, 16],
  "weight": 0,
  "tag": { "fr": "Renvoi d'ascenseur", "en": "The favour returned" },
  "text": {
    "fr": "Votre mentor vous demande de soutenir publiquement son fils pour une investiture qu'il ne mérite pas.",
    "en": "Your mentor asks you to publicly back his son for a nomination he does not deserve."
  },
  "choices": [
    { "label": { "fr": "Payer votre dette", "en": "Pay your debt" },
      "effects": { "standing": 9, "reputation": -2, "popularity": -9, "strike": "appareil", "chain": "mentor_encombrant" },
      "result": { "fr": "Le fils est investi. Tout le monde a compris, personne n'a rien dit.",
                  "en": "The son is nominated. Everyone understood; nobody said a word." } },
    { "label": { "fr": "Refuser et rompre", "en": "Refuse and break with him" },
      "effects": { "landscape": { "self": -1.2 }, "strike": "intrepide", "standing": -11, "reputation": 2, "popularity": 10, "reseau": -1 },
      "result": { "fr": "Il ne vous adressera plus la parole. Vous vous découvrez libre et seul.",
                  "en": "He will never speak to you again. You find yourself free and alone." } }
  ]
},

{
  "id": "reseautage",
  "weight": 3,
  "when": { "maxStanding": 45 },
  "tag": { "fr": "Appareil", "en": "The machine" },
  "text": {
    "fr": "Votre nom ne circule pas dans les instances. Un congrès de fédération se tient le mois prochain : trois jours de couloirs et de mauvais café.",
    "en": "Your name is not circulating in the party bodies. A federation conference is coming: three days of corridors and bad coffee."
  },
  "choices": [
    { "label": { "fr": "Y passer les trois jours", "en": "Spend all three days there" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reseau": 1, "energie": -2, "standing": 10, "popularity": -4, "trait": "reseauteur" },
      "result": { "fr": "Vous serrez trois cents mains. Trois cents personnes savent qui vous êtes.",
                  "en": "You shake three hundred hands. Three hundred people now know your name." } },
    { "label": { "fr": "Passer pour la photo", "en": "Show up for the photo" },
      "effects": { "energie": 1, "standing": 5, "reseau": -1, "popularity": -2 },
      "result": { "fr": "Une poignée de main, un discours écouté d'une oreille. Vous rentrez tôt.",
                  "en": "One handshake, a speech half-heard. You are home early." } },
    { "label": { "fr": "Payer le bar de la fédération pendant trois jours", "en": "Pick up the bar tab for three days" },
      "when": { "minMoney": 40000 },
      "effects": { "money": -25000, "reseau": 2, "standing": 8, "energie": -1, "reputation": -1 },
      "result": { "fr": "Personne ne se souviendra de vos idées. Tout le monde se souviendra que c'était vous qui régliez.",
                  "en": "Nobody will remember your ideas. Everybody will remember who was paying." } }
  ]
},

{
  "id": "protege",
  "once": true,
  "when": { "position": ["maire", "depute", "ministre", "chef"], "minStanding": 45 },
  "tag": { "fr": "Relève", "en": "The next generation" },
  "text": {
    "fr": "Un jeune militant brillant vous demande de le prendre sous votre aile. Il est doué, ambitieux, et il le sait.",
    "en": "A brilliant young activist asks you to take him under your wing. He is talented, ambitious, and he knows it."
  },
  "choices": [
    { "label": { "fr": "En faire votre protégé", "en": "Make him your protégé" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reseau": 2, "energie": -2, "standing": 6, "chain": "protege_perce" },
      "result": { "fr": "Il apprend vite. Trop vite, diront certains plus tard.",
                  "en": "He learns fast. Too fast, some will say later." } },
    { "label": { "fr": "L'envoyer se former ailleurs", "en": "Send him to learn elsewhere" },
      "effects": { "standing": -3, "energie": 1 },
      "result": { "fr": "Il ira grandir chez un autre. Vous le recroiserez.",
                  "en": "He will grow under someone else. You will meet him again." } },
    { "label": { "fr": "L'embaucher comme collaborateur, payé par l'Assemblée", "en": "Hire him as staff, paid by parliament" },
      "effects": { "reseau": 1, "energie": 1, "standing": 3, "reputation": -1, "popularity": -4 },
      "result": { "fr": "Il travaille deux fois plus que vos autres collaborateurs, pour le même salaire public. Vous appelez ça une chance qu'on lui donne.",
                  "en": "He works twice as hard as your other staff, on the same public salary. You call it giving him a chance." } }
  ]
},

{
  "id": "protege_perce",
  "delay": [5, 12],
  "weight": 0,
  "tag": { "fr": "Relève", "en": "The next generation" },
  "text": {
    "fr": "Votre protégé perce. Les journalistes commencent à l'appeler pour commenter vos décisions.",
    "en": "Your protégé is breaking through. Journalists are starting to call him to comment on your decisions."
  },
  "choices": [
    { "label": { "fr": "Le pousser encore plus haut", "en": "Push him even higher" },
      "effects": { "standing": 8, "reseau": 1, "notoriete": -1, "popularity": -4, "chain": ["protege_trahison", "ecole_du_parti"] },
      "result": { "fr": "Vous en faites votre bras droit officiel. Le tandem impressionne.",
                  "en": "You make him your official right hand. The pairing impresses." } },
    { "label": { "fr": "Le remettre à sa place", "en": "Put him back in his place" },
      "effects": { "standing": -4, "sangfroid": 1, "energie": 1, "popularity": 3 },
      "result": { "fr": "Il encaisse en silence. On remarque surtout votre nervosité.",
                  "en": "He takes it silently. What people notice is your nervousness." } }
  ]
},

{
  "id": "protege_trahison",
  "delay": [4, 10],
  "weight": 0,
  "tag": { "fr": "Trahison", "en": "Betrayal" },
  "text": {
    "fr": "Votre protégé annonce qu'il se présente contre vous. Il connaît vos dossiers, vos alliances et vos faiblesses.",
    "en": "Your protégé announces he is running against you. He knows your files, your alliances and your weaknesses."
  },
  "choices": [
    { "label": { "fr": "L'écraser sans pitié", "en": "Crush him without mercy" },
      "roll": { "stat": "reseau", "base": 13, "dice": 16 },
      "success": { "effects": { "standing": 10, "reputation": -2, "notoriete": 1, "popularity": -6, "strike": "traitre" },
        "result": { "fr": "Il est éliminé au premier tour. Le message est reçu dans tout le parti.",
                    "en": "He is knocked out in the first round. The message lands across the party." } },
      "failure": { "effects": { "standing": -16, "reputation": -1, "popularity": -6 },
        "result": { "fr": "La guerre ouverte tourne à votre désavantage. On vous trouve vieux.",
                    "en": "The open war turns against you. People are calling you old." } } },
    { "label": { "fr": "Lui laisser sa chance", "en": "Let him have his shot" },
      "effects": { "reputation": 2, "popularity": 10, "standing": -8 },
      "result": { "fr": "Votre élégance impressionne le pays et désole vos lieutenants.",
                  "en": "Your grace impresses the country and dismays your lieutenants." } }
  ]
},

{
  "id": "jeunes_loups",
  "when": { "minAge": 50, "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Parti", "en": "Party" },
  "text": {
    "fr": "Une génération montante s'impatiente. En privé, certains parlent de « passer à autre chose ».",
    "en": "A rising generation is getting impatient. In private, some talk about “moving on”."
  },
  "choices": [
    { "label": { "fr": "Promouvoir les plus loyaux", "en": "Promote the loyal ones" },
      "effects": { "reseau": 1, "reputation": -1, "standing": 11, "popularity": -6 },
      "result": { "fr": "Vous achetez du temps avec des postes. Méthode classique.",
                  "en": "You buy time with jobs. The classic method." } },
    { "label": { "fr": "Les affronter en face", "en": "Face them down" },
      "roll": { "stat": "sangfroid", "base": 14, "dice": 16 },
      "success": { "effects": { "strike": "intrepide", "reseau": 1, "notoriete": 1, "standing": 9, "popularity": -2 },
        "result": { "fr": "Vous rappelez qui tient la maison. Ça calme, pour un temps.",
                    "en": "You remind everyone who runs the house. It quiets things, for a while." } },
      "failure": { "effects": { "strike": "intrepide", "reseau": -2, "standing": -17 },
        "result": { "fr": "L'algarade tourne mal. Les départs commencent.",
                    "en": "The confrontation goes badly. The departures begin." } } },
    { "label": { "fr": "Les séduire un par un", "en": "Win them over one by one" },
      "when": { "personality": ["charming"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reseau": 0.5 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 14 },
        "result": { "fr": "Douze déjeuners en trois semaines. La fronde se dissout sans un mot public.",
                    "en": "Twelve lunches in three weeks. The revolt dissolves without a public word." } },
      "failure": { "effects": { "energie": -1, "standing": -9 },
        "result": { "fr": "Ils prennent les déjeuners et gardent leurs positions.",
                    "en": "They take the lunches and keep their positions." } } },
    { "label": { "fr": "Annoncer votre départ à terme", "en": "Announce you will step down eventually" },
      "effects": { "reputation": 2, "popularity": 7, "standing": -6, "sangfroid": 1 },
      "result": { "fr": "Vous fixez vous-même la date. Personne ne vous pousse plus, tout le monde compte.",
                  "en": "You set the date yourself. Nobody pushes you anymore; everyone is counting." } }
  ]
},

{
  "id": "transfuge",
  "when": { "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Manœuvre", "en": "Manoeuvre" },
  "text": {
    "fr": "Un parti concurrent vous fait discrètement savoir qu'une place vous attend, avec une investiture en or.",
    "en": "A rival party quietly lets you know a seat is waiting, with a golden nomination attached."
  },
  "choices": [
    { "label": { "fr": "Refuser et le faire savoir", "en": "Refuse, loudly" },
      "effects": { "reputation": 1, "reseau": 1, "standing": 12, "popularity": -4 },
      "result": { "fr": "La fidélité affichée vaut de l'or en interne.",
                  "en": "Public loyalty is worth gold inside the party." } },
    { "label": { "fr": "Laisser la porte entrouverte", "en": "Leave the door ajar" },
      "effects": { "sangfroid": 1, "reputation": -1, "standing": -12, "chain": "transfuge_fuite" },
      "result": { "fr": "Rien ne fuite, mais les rumeurs vous précèdent désormais.",
                  "en": "Nothing leaks, but the rumours now precede you." } },
    { "label": { "fr": "S'en servir pour négocier chez vous", "en": "Use it to bargain at home" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "standing": 13, "notoriete": 1, "popularity": -5, "strike": "traitre" },
        "result": { "fr": "Vous laissez filtrer l'offre juste ce qu'il faut. Votre parti double la mise.",
                    "en": "You let the offer leak just enough. Your own party doubles its bid." } },
      "failure": { "effects": { "standing": -15, "reputation": -2 },
        "result": { "fr": "Le chantage se retourne. On vous répond qu'on ne retient personne.",
                    "en": "The blackmail backfires. You are told nobody is being held back." } } },
    { "label": { "fr": "Refuser au nom de vos convictions", "en": "Refuse on principle" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "popularity": 8, "standing": 12, "reseau": -1, "money": -30000 },
      "result": { "fr": "« Je ne change pas de camp selon les places. » La phrase vous suivra longtemps.",
                  "en": "“I do not change sides for a seat.” The line will follow you for years." } }
  ]
},

{
  "id": "transfuge_fuite",
  "delay": [1, 2],
  "weight": 0,
  "tag": { "fr": "Fuite", "en": "The leak" },
  "text": {
    "fr": "Vos échanges avec le parti concurrent sont publiés. Votre camp découvre que vous discutiez.",
    "en": "Your exchanges with the rival party are published. Your camp discovers you were talking."
  },
  "choices": [
    { "label": { "fr": "Nier en bloc", "en": "Deny everything" },
      "roll": { "chance": 0.4 },
      "success": { "effects": { "standing": 4, "sangfroid": 1 },
        "result": { "fr": "Le démenti tient. Personne n'a envie de creuser davantage.",
                    "en": "The denial holds. Nobody has the appetite to dig further." } },
      "failure": { "effects": { "standing": -18, "reputation": -2, "popularity": -8 },
        "result": { "fr": "Un second document sort. Le mensonge coûte plus cher que le fait.",
                    "en": "A second document surfaces. The lie costs more than the deed." } } },
    { "label": { "fr": "Tout assumer publiquement", "en": "Own it publicly" },
      "effects": { "standing": -8, "reputation": 1, "notoriete": 2, "popularity": 5 },
      "result": { "fr": "« J'écoute tout le monde. » La franchise passe mieux que prévu.",
                  "en": "“I listen to everyone.” The bluntness plays better than expected." } }
  ]
}

,

/* ==========================================================================
   5. CHAÎNE JUDICIAIRE — se déclenche si de l'argent douteux traîne
   ========================================================================== */

{
  "id": "enquete_ouverte",
  "delay": [3, 9],
  "weight": 3,
  "when": { "flag": { "dirtyMoney": true, "onTrial": false, "investigated": false } },
  "tag": { "fr": "Justice", "en": "Justice" },
  "text": {
    "fr": "Un journaliste d'investigation vous appelle. Il travaille depuis six mois sur le financement de vos débuts et il a des documents.",
    "en": "An investigative journalist calls. He has been working on your early funding for six months, and he has documents."
  },
  "choices": [
    { "label": { "fr": "Le recevoir et tout expliquer", "en": "Meet him and explain everything" },
      "roll": { "stat": "sangfroid", "base": 14, "dice": 16,
                "bonus": [ { "when": { "legal": 1 }, "value": 2 },
                           { "when": { "comms": 2 }, "value": 2 } ] },
      "success": { "effects": { "flags": { "investigated": true }, "reputation": 1, "popularity": -3 },
        "result": { "fr": "L'article sort, mesuré, presque bienveillant. Vous avez gagné du temps.",
                    "en": "The article runs, measured, almost kind. You have bought time." } },
      "failure": { "effects": { "flags": { "investigated": true }, "popularity": -10, "standing": -6, "chain": "perquisition" },
        "result": { "fr": "Vos explications sonnent creux à l'écrit. Le parquet lit l'article.",
                    "en": "Your explanations ring hollow in print. The prosecutor reads the article." } } },
    { "label": { "fr": "Ne pas répondre", "en": "Do not respond" },
      "effects": { "flags": { "investigated": true }, "popularity": -7, "standing": -3, "chain": "perquisition" },
      "result": { "fr": "L'article paraît avec la mention « n'a pas donné suite à nos sollicitations ».",
                  "en": "The article runs with the line “did not respond to our requests”." } },
    { "label": { "fr": "Dénoncer un acharnement politique", "en": "Denounce a political witch hunt" },
      "effects": { "notoriete": 2, "popularity": -9, "standing": 4, "reputation": -2 },
      "result": { "fr": "Vos soutiens reprennent le mot en boucle. Le journaliste, lui, continue son travail exactement comme avant.",
                  "en": "Your supporters repeat the phrase on a loop. The reporter, meanwhile, carries on exactly as before." } }
  ]
},

{
  "id": "perquisition",
  "delay": [2, 6],
  "weight": 0,
  "tag": { "fr": "Justice", "en": "Justice" },
  "text": {
    "fr": "Six heures du matin. La brigade financière est à votre porte avec une commission rogatoire.",
    "en": "Six in the morning. The financial crimes unit is at your door with a warrant."
  },
  "choices": [
    { "label": { "fr": "Prendre le meilleur avocat du pays", "en": "Hire the best lawyer in the country" },
      "roll": { "chance": 0.32,
                "chanceBonus": [ { "when": { "legal": 1 }, "value": 0.16 },
                                 { "when": { "legal": 2 }, "value": 0.14 },
                                 { "when": { "minMoney": 500000 }, "value": 0.12 },
                                 { "when": { "minMoney": 2000000 }, "value": 0.08 },
                                 { "when": { "background": ["law"] }, "value": 0.1 },
                                 { "when": { "minStanding": 65 }, "value": 0.06 } ] },
      "success": { "effects": { "money": -100000, "notoriete": 1, "flags": { "dirtyMoney": false }, "popularity": -6, "standing": -4, "trait": "teflon" },
        "result": { "fr": "Vice de procédure. Le dossier se referme, pas les soupçons.",
                    "en": "A procedural flaw. The case closes; the suspicion does not." } },
      "failure": { "effects": { "money": -100000, "reputation": -1, "popularity": -16, "standing": -14, "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "L'avocat est brillant, le dossier est pire. Vous êtes mis en examen.",
                    "en": "The lawyer is brilliant, the file is worse. You are indicted." } } },
    { "label": { "fr": "Coopérer totalement", "en": "Cooperate fully" },
      "roll": { "chance": 0.4 },
      "success": { "effects": { "notoriete": 1, "reputation": 1, "flags": { "dirtyMoney": false }, "popularity": 3, "standing": -8 },
        "result": { "fr": "Votre transparence désarme le parquet. Classé sans suite.",
                    "en": "Your openness disarms the prosecutor. Case dropped." } },
      "failure": { "effects": { "reputation": -2, "popularity": -14, "standing": -18, "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "Tout ce que vous dites est versé au dossier. Mise en examen.",
                    "en": "Everything you say goes in the file. You are indicted." } } }
  ]
},

{
  "id": "proces",
  "delay": [6, 14],
  "weight": 0,
  "tag": { "fr": "Procès", "en": "Trial" },
  "text": {
    "fr": "Le procès s'ouvre dans un tribunal bondé. Le parquet requiert une peine d'inéligibilité.",
    "en": "The trial opens in a packed courtroom. The prosecution is seeking a ban from public office."
  },
  "choices": [
    { "label": { "fr": "Se défendre pied à pied", "en": "Fight every inch" },
      "roll": { "base": 19, "stat": "sangfroid",
                "plus": { "eloquence": 0.35, "standing": 0.03 },
                "bonus": [ { "when": { "legal": 1 }, "value": 2.5 },
                           { "when": { "legal": 2 }, "value": 2.5 },
                           { "when": { "background": ["law"] }, "value": 2 },
                           { "when": { "minMoney": 1000000 }, "value": 1.5 },
                           { "when": { "maxPopularity": 30 }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "flags": { "onTrial": false, "dirtyMoney": false }, "reputation": -1, "notoriete": 1, "popularity": -10, "standing": -10, "strike": "casserole" },
        "result": { "fr": "Relaxe au bénéfice du doute. Vous ressortez libre et abîmé.",
                    "en": "Acquitted on the benefit of the doubt. You walk out free and damaged." } },
      "failure": { "effects": { "end": "conviction" },
        "result": { "fr": "Coupable. Inéligibilité immédiate. Votre carrière s'arrête sur les marches du tribunal.",
                    "en": "Guilty. An immediate ban from office. Your career ends on the courthouse steps." } } },
    { "label": { "fr": "Plaider coupable pour limiter la peine", "en": "Plead guilty to limit the sentence" },
      "roll": { "chance": 0.3,
                "chanceBonus": [ { "when": { "legal": 1 }, "value": 0.14 },
                                 { "when": { "legal": 2 }, "value": 0.16 } ] },
      "success": { "effects": { "flags": { "onTrial": false, "dirtyMoney": false }, "money": -200000, "reputation": -2, "popularity": -18, "standing": -20 },
        "result": { "fr": "Amende lourde, pas d'inéligibilité. Vous survivez politiquement, de justesse.",
                    "en": "A heavy fine, no ban. You survive politically, barely." } },
      "failure": { "effects": { "end": "conviction" },
        "result": { "fr": "Le tribunal ne vous fait aucun cadeau. Inéligibilité et fin de parcours.",
                    "en": "The court shows no mercy. Banned from office, and that is the end." } } }
  ]
},

{
  "id": "patrimoine_declare",
  "delay": [2, 7],
  "weight": 0,
  "tag": { "fr": "Patrimoine", "en": "Assets" },
  "text": {
    "fr": "La Haute Autorité vous écrit. Votre déclaration de patrimoine a doublé depuis votre entrée en politique et personne, chez eux, ne trouve la ligne qui l'explique.",
    "en": "The transparency authority writes to you. Your declared assets have doubled since you entered politics, and nobody there can find the line that explains it."
  },
  "choices": [
    { "label": { "fr": "Fournir chaque justificatif", "en": "Produce every receipt" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 14,
                "bonus": [ { "when": { "legal": 1 }, "value": 3 },
                           { "when": { "legal": 2 }, "value": 3 },
                           { "when": { "background": ["law", "business"] }, "value": 2 } ] },
      "success": { "effects": { "reputation": 1, "popularity": 2, "standing": -2 },
        "result": { "fr": "Tout se tient, à l'euro près. Le dossier est classé et vous en parlez pendant deux ans.",
                    "en": "It all adds up, to the euro. The file is closed and you mention it for two years." } },
      "failure": { "effects": { "money": -60000, "reputation": -1, "popularity": -8, "standing": -4, "chain": "fisc" },
        "result": { "fr": "Deux lignes ne se justifient pas. Vous les découvrez en même temps qu'eux, ce qui est encore le pire des cas.",
                    "en": "Two lines cannot be justified. You discover them at the same time they do, which is still the worst case." } } },

    { "label": { "fr": "Faire répondre vos avocats", "en": "Let your lawyers answer" },
      "when": { "legal": 1 },
      "effects": { "money": -25000, "standing": 2, "popularity": -3 },
      "result": { "fr": "Onze pages qui ne disent rien et qui sont irréprochables. L'administration passe à un dossier plus simple.",
                  "en": "Eleven pages that say nothing and are beyond reproach. The authority moves on to an easier file." } },

    { "label": { "fr": "Placer le patrimoine hors de vue", "en": "Move the money out of sight" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -40000, "flags": { "dirtyMoney": true }, "standing": 2, "strike": "casserole" },
      "result": { "fr": "Un montage parfaitement légal et parfaitement indéfendable en conférence de presse. Il tiendra tant que personne ne le cherche.",
                  "en": "A perfectly legal arrangement that is perfectly indefensible at a press conference. It will hold as long as nobody goes looking." } },

    { "label": { "fr": "Publier vous-même toute la déclaration", "en": "Publish the whole declaration yourself" },
      "effects": { "reputation": 2, "popularity": 6, "standing": -9, "notoriete": 1 },
      "result": { "fr": "Le pays trouve le geste courageux. Vos collègues, à qui l'on demande maintenant d'en faire autant, trouvent le geste dégueulasse.",
                  "en": "The country finds it brave. Your colleagues, now being asked to do the same, find it disgusting." } }
  ]
},

{
  "id": "fisc",
  "delay": [3, 8],
  "weight": 0,
  "tag": { "fr": "Fisc", "en": "Tax" },
  "text": {
    "fr": "Contrôle fiscal approfondi. L'inspecteur est poli, méthodique, et il a tout son temps.",
    "en": "A full tax audit. The inspector is polite, methodical, and in no hurry at all."
  },
  "choices": [
    { "label": { "fr": "Payer le redressement sans discuter", "en": "Pay the assessment without arguing" },
      "effects": { "money": -180000, "popularity": -4, "standing": -2 },
      "result": { "fr": "La somme part en une fois. C'est cher, c'est fini, et personne n'en parlera plus jamais.",
                  "en": "The money goes in one payment. It is expensive, it is over, and nobody will ever mention it again." } },

    { "label": { "fr": "Contester devant le tribunal administratif", "en": "Challenge it in the courts" },
      "roll": { "stat": "sangfroid", "base": 13, "dice": 15,
                "bonus": [ { "when": { "legal": 1 }, "value": 4 },
                           { "when": { "legal": 2 }, "value": 4 },
                           { "when": { "background": ["law"] }, "value": 2 } ] },
      "success": { "effects": { "money": -30000, "reputation": 1, "standing": 2 },
        "result": { "fr": "Le redressement fond à presque rien. Vos avocats coûtaient moins cher que ce qu'ils vous ont épargné, ce qui n'arrive pas souvent.",
                    "en": "The assessment shrinks to almost nothing. Your lawyers cost less than they saved you, which does not happen often." } },
      "failure": { "effects": { "money": -220000, "reputation": -1, "popularity": -9, "standing": -6, "flags": { "dirtyMoney": true } },
        "result": { "fr": "Vous perdez, avec majoration pour mauvaise foi. Ce sont les deux derniers mots que retiendra la presse.",
                    "en": "You lose, with a penalty for bad faith. Those are the two words the press will keep." } } }
  ]
},

/* ==========================================================================
   5 bis. L'ARGENT DE LA FONCTION
   ==========================================================================
   Deux filières, deux fonctions, deux façons de s'enrichir sans jamais rien
   signer d'illégal au premier regard.

   LES CHANTIERS — le maire. Une commune attribue des marchés, et celui qui
   les attribue est courtisé. Rien n'oblige à céder ; céder rapporte
   beaucoup et laisse une trace écrite quelque part.

   BRUXELLES — le député européen. Le mandat est invisible en France, donc
   personne ne regarde, donc tout y est plus facile : cabinets de conseil,
   assistants, missions d'étude. C'est la fonction dont le jeu dit qu'on y
   envoie les gens dont on veut se débarrasser ; c'est aussi celle où l'on
   se refait.

   Les deux mènent au même endroit si l'on force : signalement, enquête,
   procès. C'est là que les avocats servent enfin à quelque chose.
   ========================================================================== */

{
  "id": "chantiers_publics",
  "weight": 3,
  "when": { "position": ["maire"], "flag": { "onTrial": false } },
  "tag": { "fr": "Marchés publics", "en": "Public contracts" },
  "text": {
    "fr": "Le marché de la rénovation du centre-ville se décide en commission d'appel d'offres, que vous présidez. Trois dossiers, dont un déposé par une entreprise qui a financé votre campagne et dont le prix est le plus élevé des trois.",
    "en": "The town-centre renovation contract is decided by the tender committee, which you chair. Three bids, one of them from a firm that funded your campaign, and the most expensive of the three."
  },
  "choices": [
    { "label": { "fr": "Attribuer au moins-disant, comme prévu", "en": "Award it to the lowest bid, as required" },
      "effects": { "reputation": 2, "standing": -6, "popularity": 3 },
      "result": { "fr": "Le règlement est le règlement. Votre financeur ne rappelle plus, et vous apprendrez dans deux ans à qui il donne désormais.",
                  "en": "Rules are rules. Your backer stops calling, and in two years you will learn who he gives to now." } },

    { "label": { "fr": "Trouver un critère technique qui les avantage", "en": "Find a technical criterion that favours them" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 14, "plus": { "reseau": 0.3 } },
      "success": { "effects": { "money": 180000, "standing": 8, "reputation": -1, "flags": { "dirtyMoney": true }, "chain": "chantier_suite" },
        "result": { "fr": "Le rapport d'analyse pèse quarante pages et conclut exactement ce qu'il fallait. Le virement, lui, passe par une société de conseil.",
                    "en": "The evaluation report runs to forty pages and concludes exactly what it had to. The payment goes through a consultancy." } },
      "failure": { "effects": { "money": 90000, "standing": 4, "reputation": -2, "popularity": -7, "flags": { "dirtyMoney": true }, "strike": "casserole", "chain": "chantier_suite" },
        "result": { "fr": "Un membre de la commission demande que son désaccord soit porté au procès-verbal. Il le sera, et le procès-verbal se garde dix ans.",
                    "en": "One committee member asks for her dissent to be minuted. It is, and minutes are kept for ten years." } } },

    { "label": { "fr": "Leur promettre le prochain, pas celui-là", "en": "Promise them the next one, not this one" },
      "effects": { "standing": 4, "reseau": 1, "reputation": -1, "money": 20000 },
      "result": { "fr": "Personne n'a rien signé et tout le monde a compris. C'est la formule qui a fait la carrière de la moitié de vos collègues.",
                  "en": "Nobody signed anything and everybody understood. It is the formula that made half your colleagues' careers." } }
  ]
},

{
  "id": "chantier_suite",
  "delay": [4, 11],
  "weight": 0,
  "tag": { "fr": "Marchés publics", "en": "Public contracts" },
  "text": {
    "fr": "L'entreprise revient. Le chantier a pris du retard, elle demande un avenant qui double la facture, et son directeur rappelle au téléphone que vous vous connaissez bien.",
    "en": "The firm is back. The works have fallen behind, they want a rider that doubles the bill, and the director reminds you on the phone that the two of you go back a long way."
  },
  "choices": [
    { "label": { "fr": "Signer l'avenant", "en": "Sign the rider" },
      "effects": { "money": 140000, "standing": 4, "reputation": -2, "popularity": -5, "chain": "signalement_chambre" },
      "result": { "fr": "La commune paiera pendant douze ans. Vous, vous êtes payé tout de suite, ce qui est l'essentiel de la différence entre les deux.",
                  "en": "The town will be paying for twelve years. You get paid immediately, which is most of the difference between the two." } },

    { "label": { "fr": "Refuser et faire jouer les pénalités de retard", "en": "Refuse and enforce the late penalties" },
      "roll": { "stat": "sangfroid", "base": 13, "dice": 14, "plus": { "eloquence": 0.3 },
                "bonus": [ { "when": { "legal": 1 }, "value": 3 } ] },
      "success": { "effects": { "reputation": 2, "popularity": 6, "standing": -4, "flags": { "dirtyMoney": false } },
        "result": { "fr": "Ils encaissent et se taisent : un procès leur coûterait le marché suivant. Vous venez d'acheter votre tranquillité avec la seule monnaie qu'ils respectent.",
                    "en": "They swallow it and keep quiet: a lawsuit would cost them the next contract. You have just bought your peace with the only currency they respect." } },
      "failure": { "effects": { "popularity": -6, "standing": -6, "chain": "signalement_chambre" },
        "result": { "fr": "Le directeur raccroche en disant qu'il a gardé tous les mails. Il a gardé tous les mails.",
                    "en": "The director hangs up saying he kept every email. He kept every email." } } },

    { "label": { "fr": "Faire reprendre le chantier par une autre entreprise", "en": "Hand the site to another firm" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -120000, "reputation": 1, "popularity": -3, "standing": -3, "flags": { "dirtyMoney": false } },
      "result": { "fr": "La commune paie deux fois, vous payez la différence de votre poche pour que cela ne se voie pas, et le dossier meurt là.",
                  "en": "The town pays twice, you cover the gap yourself so it does not show, and the file dies there." } }
  ]
},

{
  "id": "signalement_chambre",
  "delay": [3, 9],
  "weight": 0,
  "tag": { "fr": "Chambre régionale", "en": "Audit office" },
  "text": {
    "fr": "La chambre régionale des comptes publie son rapport sur votre commune. Quatorze pages, un paragraphe qui vous concerne, et une phrase qui contient les mots « transmission au procureur ».",
    "en": "The regional audit office publishes its report on your town. Fourteen pages, one paragraph about you, and a sentence containing the words “referred to the prosecutor”."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point, publiquement", "en": "Answer point by point, in public" },
      "roll": { "stat": "eloquence", "base": 14, "dice": 16,
                "bonus": [ { "when": { "legal": 1 }, "value": 3 },
                           { "when": { "legal": 2 }, "value": 4 },
                           { "when": { "comms": 2 }, "value": 2 } ] },
      "success": { "effects": { "reputation": 1, "notoriete": 1, "popularity": -4, "standing": -3 },
        "result": { "fr": "Vous connaissez le dossier mieux que ceux qui l'ont écrit. Le procureur classe, la phrase reste dans les archives et personne ne la relira.",
                    "en": "You know the file better than the people who wrote it. The prosecutor drops it; the sentence stays in the archive and nobody rereads it." } },
      "failure": { "effects": { "popularity": -11, "standing": -8, "reputation": -1, "chain": "perquisition" },
        "result": { "fr": "Vous vous emmêlez sur une date, en direct. C'est cette minute-là qui sera rediffusée, et c'est elle que le parquet regardera.",
                    "en": "You get a date wrong, live on air. That is the minute they will replay, and the one the prosecutor will watch." } } },

    { "label": { "fr": "Charger votre directeur général des services", "en": "Blame your chief executive" },
      "effects": { "popularity": -3, "standing": 3, "reputation": -2, "strike": "menteur", "chain": "perquisition" },
      "result": { "fr": "Il part avec une indemnité et sans un mot. Il gardera le silence exactement aussi longtemps qu'il y trouvera son intérêt.",
                  "en": "He leaves with a settlement and without a word. He will stay silent for exactly as long as it suits him." } },

    { "label": { "fr": "Rembourser la commune avant que le procureur ne bouge", "en": "Repay the town before the prosecutor moves" },
      "when": { "minMoney": 250000 },
      "effects": { "money": -230000, "reputation": 2, "popularity": 4, "standing": -6, "flags": { "dirtyMoney": false } },
      "result": { "fr": "Un chèque, un communiqué de trois lignes, et une régularisation qui ferme le dossier. Cela ne s'appelle pas un aveu, mais tout le monde sait lire.",
                  "en": "A cheque, a three-line statement, and a correction that closes the file. It is not called a confession, but everyone can read." } }
  ]
},

{
  "id": "lobby_bruxelles",
  "weight": 3,
  "when": { "position": ["euro"], "flag": { "onTrial": false } },
  "tag": { "fr": "Bruxelles", "en": "Brussels" },
  "text": {
    "fr": "Un cabinet de conseil vous propose une mission d'expertise : quatre notes par an sur un secteur que vous connaissez, et un montant mensuel qui dépasse votre indemnité. Le secteur est celui dont vous rapportez la directive.",
    "en": "A consultancy offers you an advisory role: four notes a year on a sector you know well, for a monthly fee larger than your salary. The sector is the one whose directive you are drafting."
  },
  "choices": [
    { "label": { "fr": "Refuser et le déclarer au registre", "en": "Refuse it and log it in the register" },
      "effects": { "reputation": 3, "notoriete": 1, "popularity": 4, "standing": -3 },
      "result": { "fr": "Votre refus figure au registre de transparence, où il sera lu par onze personnes. Trois d'entre elles travaillent pour le cabinet.",
                  "en": "Your refusal is logged in the transparency register, where eleven people will read it. Three of them work for the consultancy." } },

    { "label": { "fr": "Accepter, en le déclarant", "en": "Take it, and declare it" },
      "effects": { "money": 120000, "reputation": -1, "popularity": -4, "standing": 3 },
      "result": { "fr": "Tout est légal, tout est public, et personne ne trouve cela normal. C'est très exactement la définition du problème.",
                  "en": "It is all legal, all public, and nobody thinks it is normal. That is precisely the definition of the problem." } },

    { "label": { "fr": "Accepter sans le déclarer", "en": "Take it, and say nothing" },
      "roll": { "stat": "sangfroid", "base": 13, "dice": 15, "plus": { "reseau": 0.25 } },
      "success": { "effects": { "money": 260000, "standing": 5, "reputation": -2, "flags": { "dirtyMoney": true }, "chain": "amendements_dictes" },
        "result": { "fr": "Le virement arrive sur une structure luxembourgeoise au nom de votre belle-sœur. À Bruxelles, personne ne regarde ; c'est bien pour cela qu'on vous y a envoyé.",
                    "en": "The payment lands in a Luxembourg vehicle in your sister-in-law's name. In Brussels, nobody looks; that is rather why they sent you there." } },
      "failure": { "effects": { "money": 200000, "standing": 3, "reputation": -2, "popularity": -6, "flags": { "dirtyMoney": true }, "strike": "casserole", "chain": "amendements_dictes" },
        "result": { "fr": "Une assistante parlementaire voit passer un document qu'elle n'aurait pas dû voir. Elle ne dit rien, et elle en garde une copie.",
                    "en": "A parliamentary assistant sees a document she should not have seen. She says nothing, and she keeps a copy." } } }
  ]
},

{
  "id": "amendements_dictes",
  "delay": [3, 9],
  "weight": 0,
  "tag": { "fr": "Bruxelles", "en": "Brussels" },
  "text": {
    "fr": "Le cabinet vous envoie douze amendements rédigés, à déposer tels quels avant vendredi. Deux d'entre eux vident la directive de ce qu'elle avait d'utile.",
    "en": "The consultancy sends you twelve ready-written amendments to table as they are before Friday. Two of them gut the directive of everything useful in it."
  },
  "choices": [
    { "label": { "fr": "Les déposer tels quels", "en": "Table them as they are" },
      "effects": { "money": 90000, "reputation": -2, "standing": 3, "chain": "fuite_bruxelles" },
      "result": { "fr": "Douze amendements déposés en trois minutes, dont deux qu'aucun élu de votre groupe n'a lus. Le vote a lieu un jeudi soir dans un hémicycle vide.",
                  "en": "Twelve amendments tabled in three minutes, two of which nobody in your group has read. The vote happens on a Thursday evening in an empty chamber." } },

    { "label": { "fr": "N'en déposer que les inoffensifs", "en": "Table only the harmless ones" },
      "roll": { "stat": "eloquence", "base": 12, "dice": 14 },
      "success": { "effects": { "money": 40000, "reputation": 1, "standing": 1 },
        "result": { "fr": "Le cabinet compte les amendements et pas les lignes. Vous gardez l'argent et la directive garde ses dents.",
                    "en": "The consultancy counts amendments, not lines. You keep the money and the directive keeps its teeth." } },
      "failure": { "effects": { "money": -60000, "standing": -5, "reputation": -1, "chain": "fuite_bruxelles" },
        "result": { "fr": "Ils comptent les lignes. Le versement s'arrête, et l'homme qui vous l'annonce précise qu'il a conservé les échanges.",
                    "en": "They count lines. The payments stop, and the man telling you so mentions that he has kept the correspondence." } } },

    { "label": { "fr": "Rompre et rendre l'argent déjà versé", "en": "Break it off and give back what you took" },
      "when": { "minMoney": 200000 },
      "effects": { "money": -190000, "reputation": 3, "standing": -5, "flags": { "dirtyMoney": false } },
      "result": { "fr": "Le virement de retour porte la mention « honoraires non dus ». C'est la phrase la plus chère que vous ayez jamais écrite, et elle vous sauvera.",
                  "en": "The returning transfer is labelled “fees not owed”. It is the most expensive sentence you have ever written, and it will save you." } }
  ]
},

{
  "id": "fuite_bruxelles",
  "delay": [4, 12],
  "weight": 0,
  "tag": { "fr": "Bruxelles", "en": "Brussels" },
  "text": {
    "fr": "Un consortium de journaux publie quarante mille documents internes du cabinet. Votre nom apparaît onze fois, dont une sous un tableau intitulé « élus acquis ».",
    "en": "A consortium of newspapers publishes forty thousand internal documents from the consultancy. Your name appears eleven times, once under a table headed “members secured”."
  },
  "choices": [
    { "label": { "fr": "Tout nier en bloc", "en": "Deny everything" },
      "roll": { "stat": "sangfroid", "base": 15, "dice": 16,
                "bonus": [ { "when": { "comms": 2 }, "value": 3 },
                           { "when": { "legal": 2 }, "value": 2 } ] },
      "success": { "effects": { "popularity": -8, "standing": -4, "reputation": -1, "trait": "teflon" },
        "result": { "fr": "Vous tenez la ligne quatre jours, et le consortium passe au dossier suivant. Il reste onze occurrences de votre nom dans une base de données consultable à vie.",
                    "en": "You hold the line for four days and the consortium moves to the next story. Eleven mentions of your name remain in a database anyone can search, for ever." } },
      "failure": { "effects": { "popularity": -18, "standing": -12, "reputation": -2, "strike": "menteur", "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "Un document porte votre signature manuscrite. Le parquet européen ouvre une information judiciaire le lendemain matin.",
                    "en": "One document carries your handwritten signature. The European prosecutor opens an investigation the next morning." } } },

    { "label": { "fr": "Reconnaître, rembourser, s'excuser", "en": "Admit it, repay it, apologise" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -280000, "reputation": 1, "popularity": -12, "standing": -14, "flags": { "dirtyMoney": false }, "strike": "casserole" },
      "result": { "fr": "L'aveu coupe court à tout. Vous perdez la moitié de ce que vous aviez gagné et la totalité de ce que vous inspiriez.",
                  "en": "The confession ends it all. You lose half of what you made and all of what you inspired." } },

    { "label": { "fr": "Laisser vos avocats gérer et ne rien dire", "en": "Let the lawyers handle it and say nothing" },
      "when": { "legal": 1 },
      "effects": { "money": -70000, "popularity": -13, "standing": -6, "chain": "perquisition" },
      "result": { "fr": "Onze communiqués en trois semaines, aucun mot de vous. La stratégie est bonne juridiquement et désastreuse partout ailleurs.",
                  "en": "Eleven statements in three weeks, not one word from you. The strategy is legally sound and disastrous everywhere else." } }
  ]
},

/* ==========================================================================
   5 ter. MATIGNON
   ==========================================================================
   Deux chemins, et ils ne racontent pas la même histoire.

   PAR SON CAMP — le président est des vôtres et vous avez travaillé
   l'appareil assez longtemps pour qu'on ne puisse plus vous ignorer. C'est
   la voie noble, et la plus exposée : vous devrez tout à quelqu'un.

   PAR L'OUVERTURE — le président vient du camp d'à côté, il n'a pas de
   majorité tout seul, et il achète la vôtre avec Matignon. C'est la voie
   des tacticiens : elle rapporte le poste et coûte le parti.

   Puis le mandat, qui est court par nature : on est le fusible, et le fusible
   finit toujours par fondre.
   ========================================================================== */

{
  "id": "matignon_camp",
  "once": true,
  "weight": 6,
  "when": { "ruling": true, "position": ["depute", "ministre", "chef"], "minStanding": 62, "minTurn": 16 },
  "tag": { "fr": "Matignon", "en": "The top job" },
  "text": {
    "fr": "Le président cherche un Premier ministre dans son propre camp. Trois noms circulent, dont le vôtre, et l'entretien dure quarante minutes sans qu'aucune des deux personnes présentes ne prononce le mot « Matignon »."
    ,
    "en": "The president is looking for a prime minister within his own camp. Three names are circulating, yours among them, and the meeting lasts forty minutes without either person in the room saying the word."
  },
  "choices": [
    { "label": { "fr": "Accepter sans condition", "en": "Accept, no conditions" },
      "effects": { "office": "premier", "notoriete": 3, "credibilite": 3, "standing": 6, "energie": -2, "popularity": 4 },
      "result": { "fr": "Passation dans la cour, quatre-vingts caméras et un discours de six minutes. Vous êtes le chef du gouvernement et l'employé d'un seul homme.",
                  "en": "A handover in the courtyard, eighty cameras and a six-minute speech. You are head of the government and one man's employee." } },

    { "label": { "fr": "Négocier trois ministères pour vos fidèles", "en": "Negotiate three ministries for your own people" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "office": "premier", "notoriete": 3, "credibilite": 3, "reseau": 2, "standing": 10, "energie": -2 },
        "result": { "fr": "Vous entrez à Matignon avec votre propre équipe dans le dos. Le président l'a accepté, ce qui veut dire qu'il a besoin de vous plus qu'il ne le dit.",
                    "en": "You arrive with your own team behind you. The president agreed, which means he needs you more than he lets on." } },
      "failure": { "effects": { "office": "premier", "credibilite": 2, "notoriete": 3, "standing": -4, "energie": -2, "reputation": -1 },
        "result": { "fr": "On vous fait comprendre que le poste ne se marchande pas. Vous acceptez quand même, et tout le monde a vu que vous aviez essayé.",
                    "en": "You are told the job is not up for negotiation. You take it anyway, and everyone saw that you tried." } } },

    { "label": { "fr": "Refuser : le fusible, ce sera un autre", "en": "Refuse: let somebody else be the fuse" },
      "effects": { "credibilite": -2, "standing": -10, "popularity": 3, "sangfroid": 1, "reputation": 1 },
      "result": { "fr": "Vous expliquez que vous serez plus utile ailleurs. Dans dix-huit mois, quand votre successeur sera brûlé, on se souviendra que vous aviez vu juste, et on ne vous rappellera pas.",
                  "en": "You explain you will be more use elsewhere. In eighteen months, when your successor is burnt out, people will remember you were right, and they will not call you back." } }
  ]
},

{
  "id": "matignon_ouverture",
  "once": true,
  "weight": 6,
  "when": { "ruling": false, "rulingClose": true, "position": ["depute", "ministre", "chef"],
            "minPopularity": 55, "minShare": 15, "minTurn": 16 },
  "tag": { "fr": "Matignon", "en": "The top job" },
  "text": {
    "fr": "Le président n'a pas de majorité et vient du camp d'à côté. Un émissaire vous propose Matignon en échange de vos voix à l'Assemblée. Votre parti n'est pas au courant."
    ,
    "en": "The president has no majority and comes from the camp next door. An envoy offers you the top job in exchange for your votes in parliament. Your party has not been told."
  },
  "choices": [
    { "label": { "fr": "Accepter et prévenir votre parti après", "en": "Accept, and tell your party afterwards" },
      "effects": { "office": "premier", "notoriete": 4, "credibilite": 3, "popularity": 6, "standing": -16, "reputation": -2, "strike": "traitre" },
      "result": { "fr": "Le pays applaudit le sens de l'État, votre fédération parle de vente à la découpe. Les deux ont raison, et une seule des deux votera pour vous ensuite.",
                  "en": "The country applauds your sense of duty, your own federation calls it a sell-off. Both are right, and only one of them will vote for you afterwards." } },

    { "label": { "fr": "Exiger l'accord du parti avant de dire oui", "en": "Demand your party's blessing first" },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "standing": 0.06, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "office": "premier", "notoriete": 3, "credibilite": 4, "standing": 4, "popularity": 4, "energie": -2 },
        "result": { "fr": "Deux nuits de réunion et un vote à main levée. Vous partez à Matignon avec un mandat, ce qui est rarissime et ne vous protégera qu'un temps.",
                    "en": "Two nights of meetings and a show of hands. You leave for the top job with a mandate, which is exceptionally rare and will only protect you for a while." } },
      "failure": { "effects": { "credibilite": -1, "standing": -8, "popularity": -3, "energie": -2 },
        "result": { "fr": "Le parti dit non, l'émissaire ne rappelle pas, et le poste va à quelqu'un de moins regardant. Vous avez eu raison sur la forme et perdu sur tout le reste.",
                    "en": "The party says no, the envoy does not call back, and the job goes to somebody less scrupulous. You were right on procedure and lost on everything else." } } },

    { "label": { "fr": "Refuser et rendre la proposition publique", "en": "Refuse, and make the offer public" },
      "effects": { "notoriete": 2, "credibilite": 1, "popularity": 9, "standing": 8, "reputation": 2 },
      "result": { "fr": "Vous lisez le message devant les caméras. L'Élysée dément, personne ne le croit, et votre parti découvre que vous valez qu'on vous achète.",
                  "en": "You read the message out on camera. The presidency denies it, nobody believes them, and your party discovers that you were worth buying." } }
  ]
},

{
  "id": "matignon_49_3",
  "weight": 4,
  "when": { "position": ["premier"] },
  "tag": { "fr": "Matignon", "en": "The top job" },
  "text": {
    "fr": "Le texte n'a pas la majorité et le vote est dans deux jours. Il vous reste l'article qui permet de faire adopter une loi sans vote, et qui coûte exactement ce qu'il rapporte."
    ,
    "en": "The bill does not have the votes and the ballot is in two days. You still have the article that lets a law pass without a vote, and it costs precisely what it earns."
  },
  "choices": [
    { "label": { "fr": "Passer en force", "en": "Force it through" },
      "effects": { "credibilite": 2, "standing": 6, "popularity": -12, "notoriete": 2, "reputation": -1, "chain": "matignon_censure" },
      "result": { "fr": "La loi est adoptée en quarante secondes et sans un vote. L'opposition dépose une motion dans l'heure, et le pays retient le mot plutôt que le texte.",
                  "en": "The law passes in forty seconds without a vote. The opposition tables a censure motion within the hour, and the country remembers the procedure, not the bill." } },

    { "label": { "fr": "Retirer le texte", "en": "Withdraw the bill" },
      "effects": { "credibilite": -3, "standing": -8, "popularity": 5, "reputation": 1 },
      "result": { "fr": "Vous annoncez que le texte sera « retravaillé ». Il ne le sera pas. Vous venez d'apprendre à l'Assemblée qu'elle peut vous dire non.",
                  "en": "You announce the bill will be “reworked”. It will not be. You have just taught parliament that it can say no to you." } },

    { "label": { "fr": "Aller chercher les voix une par une", "en": "Go and find the votes one by one" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": 4, "standing": 4, "popularity": 6, "energie": -3, "reseau": 2 },
        "result": { "fr": "Onze députés retournés en trois jours, dont quatre de l'opposition. Le texte passe de six voix et personne ne parle plus de procédure.",
                    "en": "Eleven members turned in three days, four of them from the opposition. The bill passes by six votes and nobody mentions procedure again." } },
      "failure": { "effects": { "credibilite": -3, "standing": -10, "popularity": -6, "energie": -3, "chain": "matignon_censure" },
        "result": { "fr": "Vous en retournez sept, il en fallait douze. Le vote est perdu en direct, et l'opposition dépose sa motion le soir même.",
                    "en": "You turn seven; you needed twelve. The vote is lost live on air, and the opposition tables its motion that evening." } } }
  ]
},

{
  "id": "matignon_censure",
  "delay": [1, 3],
  "weight": 0,
  "tag": { "fr": "Motion de censure", "en": "Censure motion" },
  "text": {
    "fr": "La motion de censure est déposée. Il manque neuf voix à l'opposition, et neuf députés de votre camp n'ont pas répondu au téléphone depuis mardi."
    ,
    "en": "The censure motion is tabled. The opposition is nine votes short, and nine members of your own side have not answered the phone since Tuesday."
  },
  "choices": [
    { "label": { "fr": "Les recevoir un par un à Matignon", "en": "See them one by one" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05, "charisme": 0.3 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "standing": 5, "energie": -3, "popularity": 2 },
        "result": { "fr": "Sept viennent, six repartent convaincus, et le septième obtient une sous-préfecture pour sa circonscription. La motion tombe de quatre voix.",
                    "en": "Seven come, six leave convinced, and the seventh gets a public office moved to his constituency. The motion falls by four votes." } },
      "failure": { "effects": { "credibilite": -4, "energie": -3, "popularity": -8, "standing": -12, "office": "none", "trait": "ancien_premier" },
        "result": { "fr": "Trois viennent, aucun ne cède. La motion passe de deux voix et le gouvernement tombe le soir même, avec vous dedans.",
                    "en": "Three come, none of them budge. The motion passes by two votes and the government falls that evening, with you inside it." } } },

    { "label": { "fr": "Poser la question de confiance vous-même", "en": "Call the confidence vote yourself" },
      "roll": { "base": 18, "stat": "sangfroid", "plus": { "eloquence": 0.45 }, "dice": 16 },
      "success": { "effects": { "credibilite": 5, "notoriete": 2, "standing": 8, "popularity": 7, "sangfroid": 1 },
        "result": { "fr": "Vous allez au-devant du coup et vous le gagnez de vingt voix. On vous découvre une autorité que personne ne vous prêtait, à commencer par le président.",
                    "en": "You meet the blow head-on and win by twenty. People discover an authority nobody credited you with, starting with the president." } },
      "failure": { "effects": { "credibilite": -3, "popularity": -6, "standing": -14, "office": "none", "trait": "ancien_premier" },
        "result": { "fr": "Vous avez transformé une motion incertaine en défaite certaine. C'est la définition exacte du courage mal placé.",
                    "en": "You turned an uncertain motion into a certain defeat. That is the precise definition of misplaced courage." } } },

    { "label": { "fr": "Laisser le président arbitrer", "en": "Let the president handle it" },
      "effects": { "credibilite": -2, "standing": -6, "popularity": -4, "reputation": -1 },
      "result": { "fr": "L'Élysée passe les coups de fil à votre place et la motion tombe. Tout le monde a compris qui gouvernait, et ce n'était pas vous.",
                  "en": "The presidency makes the calls in your place and the motion falls. Everyone understood who was governing, and it was not you." } }
  ]
},

{
  "id": "matignon_fusible",
  "weight": 4,
  "when": { "position": ["premier"], "minTurn": 4 },
  "tag": { "fr": "Matignon", "en": "The top job" },
  "text": {
    "fr": "Les chiffres sont mauvais et l'Élysée a besoin d'un responsable. Un conseiller du président explique dans un dîner que « le Premier ministre n'a pas su expliquer la réforme ». Le dîner était off, la phrase est en une le lendemain."
    ,
    "en": "The numbers are bad and the presidency needs someone to blame. A presidential adviser explains over dinner that “the prime minister failed to explain the reform”. The dinner was off the record; the line is on the front page next morning."
  },
  "choices": [
    { "label": { "fr": "Encaisser sans rien dire", "en": "Take it without a word" },
      "effects": { "credibilite": -2, "popularity": -5, "standing": 4, "sangfroid": 1 },
      "result": { "fr": "Vous ne répondez pas et vous continuez. C'est ce qu'on attend d'un Premier ministre, et c'est aussi ce qui permet de recommencer le mois suivant.",
                  "en": "You do not answer and you carry on. That is what is expected of a prime minister, and it is also what makes it possible to do it again next month." } },

    { "label": { "fr": "Répondre publiquement au président", "en": "Answer the president in public" },
      "roll": { "base": 18, "stat": "sangfroid", "plus": { "popularity": 0.06 }, "dice": 16 },
      "success": { "effects": { "credibilite": 4, "notoriete": 2, "popularity": 11, "standing": -6, "strike": "intrepide" },
        "result": { "fr": "Deux phrases, sur le perron, qui rappellent qui signe les décrets. L'Élysée se tait pendant trois semaines et le pays vous découvre une colonne vertébrale.",
                    "en": "Two sentences on the steps, reminding everyone who signs the decrees. The presidency goes quiet for three weeks and the country discovers you have a spine." } },
      "failure": { "effects": { "credibilite": -2, "popularity": -7, "standing": -10, "office": "none", "trait": "ancien_premier" },
        "result": { "fr": "On ne répond pas au président. Votre démission est acceptée avant que vous ne l'ayez proposée, et le communiqué vous remercie chaleureusement.",
                    "en": "One does not answer the president. Your resignation is accepted before you offer it, and the statement thanks you warmly." } } },

    { "label": { "fr": "Démissionner en choisissant le moment", "en": "Resign, on your own timing" },
      "effects": { "office": "none", "trait": "ancien_premier", "credibilite": 2, "popularity": 8, "reputation": 2, "standing": -4, "notoriete": 1 },
      "result": { "fr": "Vous partez avant qu'on ne vous pousse, avec une lettre de quatre lignes que la presse trouvera digne. C'est la seule façon de sortir de Matignon en gardant quelque chose.",
                  "en": "You leave before you are pushed, with a four-line letter the press will call dignified. It is the only way to leave that building with anything left." } }
  ]
},

{
  "id": "coup_de_vieux",
  "weight": 7,
  "when": { "minAge": 62, "notTrait": ["declin"] },
  "tag": { "fr": "Fin de mandat", "en": "End of term" },
  "text": {
    "fr": "Le mandat s'achève et il faut dire si vous repartez. Vous vous êtes surpris trois fois ce mois-ci à chercher le nom d'un dossier que vous connaissez par cœur, et votre directeur de cabinet a commencé à finir vos phrases. Personne ne vous a rien demandé. Personne n'aura le courage de vous le demander."
    ,
    "en": "The term is ending and you have to say whether you are running again. Three times this month you caught yourself reaching for the name of a file you know by heart, and your chief of staff has started finishing your sentences. Nobody has asked you anything. Nobody will have the courage to."
  },
  "choices": [
    { "label": { "fr": "S'arrêter maintenant, pendant qu'on vous le demande encore", "en": "Stop now, while they are still asking you to stay" },
      "effects": { "end": "retire" },
      "result": { "fr": "Vous annoncez que vous ne repartez pas. La salle se lève, et vous savez très bien que la moitié applaudit la décision plutôt que la carrière.",
                  "en": "You announce you are not running again. The room stands up, and you know perfectly well that half of them are applauding the decision rather than the career." } },

    { "label": { "fr": "Repartir pour un mandat", "en": "Go round one more time" },
      "effects": { "trait": "declin", "notoriete": 1, "standing": 4 },
      "result": { "fr": "Vous repartez, et l'appareil est soulagé de ne pas avoir à trancher. Le mandat sera plus long que les précédents, et pas parce qu'il dure davantage.",
                  "en": "You run again, and the machine is relieved not to have to decide. This term will feel longer than the others, and not because it lasts longer." } },

    { "label": { "fr": "Repartir, mais en se faisant suivre sérieusement", "en": "Run again, but get yourself properly looked after" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -45000, "trait": "declin", "flags": { "carefulHealth": true }, "energie": 2, "standing": 2 },
      "result": { "fr": "Bilan complet, deux spécialistes et un agenda qu'on vous impose. Vous tiendrez plus longtemps que ceux qui ont fait semblant de ne rien voir, et cela se paie tous les mardis matin.",
                  "en": "A full check-up, two specialists and a diary somebody else now controls. You will last longer than those who pretended not to notice, and it costs you every Tuesday morning." } },

    { "label": { "fr": "Repartir et faire taire la rumeur par un coup d'éclat", "en": "Run again and kill the rumour with a stunt" },
      "roll": { "base": 16, "stat": "energie", "plus": { "charisme": 0.4 }, "dice": 16,
                "bonus": [ { "when": { "comms": 2 }, "value": 3 } ] },
      "success": { "effects": { "notoriete": 2, "popularity": 9, "standing": 3, "energie": -2,
                                "landscape": { "self": 0.8 } },
        "result": { "fr": "Quatre déplacements en cinq jours et une prise de parole qu'on repasse en boucle. Pendant six mois, plus personne n'écrira que vous êtes fatigué.",
                    "en": "Four trips in five days and a speech they replay on a loop. For six months nobody will write that you are tired." } },
      "failure": { "effects": { "trait": "declin", "popularity": -8, "energie": -3, "standing": -4,
                                "landscape": { "self": -0.7 } },
        "result": { "fr": "Vous vous essoufflez en direct, à la quatrième question. C'est cette image-là qui servira d'illustration à tous les papiers sur votre succession.",
                    "en": "You run out of breath live on air, on the fourth question. That is the picture they will use to illustrate every article about your succession." } } }
  ]
},

/* ==========================================================================
   4 bis. LA GUERRE INTÉRIEURE
   ==========================================================================
   Un parti n'est pas un décor : c'est l'endroit où l'on passe le plus clair
   de sa carrière, et où la moitié des gens qui vous sourient préféreraient
   votre place. Ces scènes-là donnent enfin de quoi monter — ou de quoi tomber
   — sans passer par les urnes.

   La succession se joue forcément dans votre parti — on ne succède pas à
   quelqu'un d'un autre camp. La rivalité, elle, peut venir des deux côtés :
   celui qui occupe la place que vous visez n'est pas toujours assis à côté
   de vous.
   ========================================================================== */

{
  "id": "rival_interne",
  "weight": 5,
  "cast": "camp_senior",
  "when": { "minTurn": 8, "minStanding": 25 },
  "tag": { "fr": "Guerre interne", "en": "Internal war" },
  "text": {
    "fr": "{rival} occupe exactement la place que vous visez, et l'occupe bien. Trois personnes vous ont rapporté cette semaine que votre nom revenait dans ses conversations, jamais en bien.",
    "en": "{rival} holds exactly the place you are aiming at, and holds it well. Three people told you this week that your name comes up in their conversations, never kindly."
  },
  "choices": [
    { "label": { "fr": "Prendre les dossiers dont {il} ne veut pas", "en": "Take the files {he} does not want" },
      "effects": { "standing": 9, "energie": -2, "eloquence": 1, "popularity": -2 },
      "result": { "fr": "Vous récupérez trois sujets ingrats et vous les tenez mieux que personne. En dix-huit mois, c'est vous qu'on appelle quand ils sortent, et plus {lui}.",
                  "en": "You pick up three thankless briefs and hold them better than anyone. Within eighteen months you are the one they call when those come up, not {him}." } },

    { "label": { "fr": "Débaucher deux de ses fidèles", "en": "Poach two of {his} loyalists" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "charisme": 0.35, "money": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 12, "reseau": 2, "reputation": -1, "money": -20000 },
        "result": { "fr": "Ils changent de bureau un vendredi soir, sans communiqué. {Il} l'apprend le lundi, et ce jour-là vous cessez d'être un concurrent pour devenir un problème.",
                    "en": "They change offices on a Friday evening, with no announcement. {He} finds out on Monday, and that is the day you stop being a rival and become a problem." } },
      "failure": { "effects": { "standing": -10, "reputation": -2, "strike": "traitre", "money": -20000 },
        "result": { "fr": "Ils écoutent, remercient, et lui répètent tout le soir même. Vous avez montré ce que vous vouliez et prouvé que vous ne saviez pas l'obtenir.",
                    "en": "They listen, thank you, and repeat it all to {him} that evening. You showed what you wanted and proved you did not know how to get it." } } },

    { "label": { "fr": "Proposer une alliance et un partage des rôles", "en": "Offer an alliance and a division of labour" },
      "effects": { "standing": 5, "reseau": 1, "credibilite": -1, "popularity": -1 },
      "result": { "fr": "Vous vous répartissez les sujets autour d'un déjeuner de deux heures. L'accord tiendra jusqu'au jour où l'un des deux pourra s'en passer, et vous savez tous les deux lequel.",
                  "en": "You carve up the subjects over a two-hour lunch. The deal will hold until one of you can do without it, and you both know which one." } },

    { "label": { "fr": "L'attendre : {il} finira par se tromper", "en": "Wait: {he} will slip eventually" },
      "effects": { "standing": -3, "sangfroid": 2, "energie": 1 },
      "result": { "fr": "Vous ne faites rien pendant deux ans. {Il} ne se trompe pas, et vous avez appris la patience, ce qui ne se monnaie nulle part.",
                  "en": "You do nothing for two years. {He} does not slip, and you have learned patience, which is negotiable nowhere." } }
  ]
},

{
  "id": "fede_a_prendre",
  "weight": 5,
  "when": { "minTurn": 6, "position": ["cadre", "conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Fédération", "en": "The federation" },
  "text": {
    "fr": "La fédération voisine est dirigée depuis vingt ans par un homme qui ne vient plus aux réunions. Six cents adhérents, un congrès dans huit mois, et personne n'a encore osé se déclarer."
    ,
    "en": "The neighbouring federation has been run for twenty years by a man who no longer comes to meetings. Six hundred members, a conference in eight months, and nobody has dared declare yet."
  },
  "choices": [
    { "label": { "fr": "Faire le tour des sections, une par une", "en": "Tour the branches, one at a time" },
      "effects": { "standing": 11, "reseau": 2, "energie": -3, "popularity": -2 },
      "result": { "fr": "Vingt-deux réunions en six mois, dont onze devant moins de dix personnes. Au congrès, vous passez au premier tour et personne ne comprend comment.",
                  "en": "Twenty-two meetings in six months, eleven of them in front of fewer than ten people. At the conference you win in the first round and nobody understands how." } },

    { "label": { "fr": "Négocier son retrait contre un poste honorifique", "en": "Trade his withdrawal for an honorary title" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 15 },
      "success": { "effects": { "standing": 9, "reseau": 1, "energie": -1 },
        "result": { "fr": "Président d'honneur, une photo au mur et un discours par an. Il accepte en quarante minutes, ce qui prouve qu'on aurait pu lui demander plus tôt.",
                    "en": "Honorary president, a photograph on the wall and one speech a year. He agrees in forty minutes, which proves somebody could have asked years ago." } },
      "failure": { "effects": { "standing": -7, "reputation": -1, "energie": -1 },
        "result": { "fr": "Il refuse, se déclare candidat le soir même et raconte partout qu'on a voulu l'acheter. Il n'a pas tort et cela ne l'empêchera pas de perdre dans trois ans.",
                    "en": "He refuses, declares his candidacy that evening and tells everyone he was bought off. He is not wrong, and it will not stop him losing in three years." } } },

    { "label": { "fr": "Y envoyer quelqu'un à vous", "en": "Send somebody of your own" },
      "effects": { "standing": 6, "reseau": 2, "reputation": -1, "energie": -1 },
      "result": { "fr": "Votre candidate gagne et vous devez tout à personne. Elle vous devra tout pendant quatre ans, ce qui est exactement la durée d'un mandat.",
                  "en": "Your candidate wins and you owe nobody anything. She will owe you everything for four years, which is exactly the length of a term." } },

    { "label": { "fr": "Laisser tomber : ce n'est pas votre territoire", "en": "Leave it: it is not your ground" },
      "effects": { "standing": -2, "energie": 2, "reputation": 1 },
      "result": { "fr": "Vous vous en tenez à votre fédération. C'est raisonnable, et dans deux ans quelqu'un d'autre aura six cents adhérents de plus que vous.",
                  "en": "You stick to your own federation. It is reasonable, and in two years somebody else will have six hundred more members than you." } }
  ]
},

{
  "id": "succession_ouverte",
  "once": true,
  "weight": 5,
  "cast": "camp_senior",
  "when": { "minTurn": 14, "minStanding": 35 },
  "tag": { "fr": "Succession", "en": "Succession" },
  "text": {
    "fr": "{rival} annonce qu'{il} ne se représentera pas. La place est ouverte, quatre personnes la veulent, et les trois autres se connaissent depuis plus longtemps que vous ne les connaissez."
    ,
    "en": "{rival} announces that {he} will not stand again. The seat is open, four people want it, and the other three have known each other far longer than you have known any of them."
  },
  "choices": [
    { "label": { "fr": "Se déclarer le premier", "en": "Declare first" },
      "effects": { "standing": 7, "notoriete": 1, "reputation": -1, "energie": -1 },
      "result": { "fr": "Vous prenez trois jours d'avance et tout le monde doit se positionner par rapport à vous. C'est un avantage réel, et il dure trois jours.",
                  "en": "You gain three days and everybody has to position themselves against you. It is a real advantage, and it lasts three days." } },

    { "label": { "fr": "Obtenir sa bénédiction avant l'annonce", "en": "Get {his} blessing before the announcement" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.05, "charisme": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 14, "reseau": 2, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "{Il} vous cite dans son discours d'adieu, une seule fois, à la fin. Cela vaut deux ans de réunions de section et tout le monde dans la salle le sait.",
                    "en": "{He} mentions you once in the farewell speech, right at the end. It is worth two years of branch meetings and everyone in the room knows it." } },
      "failure": { "effects": { "standing": -8, "reputation": -1, "energie": -1 },
        "result": { "fr": "{Il} vous écoute, ne promet rien, et adoube quelqu'un d'autre huit jours plus tard. Vous avez perdu l'avance ET la surprise.",
                    "en": "{He} listens, promises nothing, and anoints somebody else eight days later. You have lost the head start AND the surprise." } } },

    { "label": { "fr": "Laisser les trois autres s'entretuer", "en": "Let the other three destroy each other" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "minStanding": 55 }, "value": 0.2 },
                                                  { "when": { "trait": ["appareil"] }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 12, "sangfroid": 1, "credibilite": 1, "energie": 1 },
        "result": { "fr": "Ils passent quatre mois à se démolir dans la presse interne. Vous arrivez au congrès comme la seule solution qui ne fâche personne, ce qui est la meilleure façon d'y arriver.",
                    "en": "They spend four months tearing each other apart in the party press. You arrive at the conference as the only option nobody objects to, which is the best way to arrive." } },
      "failure": { "effects": { "standing": -9, "popularity": -2, "credibilite": -1 },
        "result": { "fr": "Ils s'accordent en trois semaines sur le dos du seul absent, qui était vous. On appelle cela une synthèse.",
                    "en": "They agree within three weeks at the expense of the only one absent, who was you. This is called a synthesis." } } }
  ]
},

/* ==========================================================================
   5 quater. L'ÉPOQUE
   ==========================================================================
   Des scènes qui ne pouvaient pas exister il y a vingt ans, et qui sont
   aujourd'hui le quotidien d'une carrière.

   Sur le signalement : ce que le jeu met en scène, c'est le réflexe de
   l'appareil — la cellule créée après coup, la présomption d'innocence
   invoquée dans un seul sens, l'homme qu'on garde parce qu'il est bon sur
   les retraites. Jamais la personne qui signale, jamais ce qu'elle a subi.
   La satire vise ceux qui décident, pas celles qui parlent.
   ========================================================================== */

{
  "id": "signalement_vss",
  "once": true,
  "weight": 5,
  "when": { "position": ["maire", "euro", "depute", "ministre", "chef", "premier"], "minTurn": 12 },
  "tag": { "fr": "Signalement", "en": "A complaint" },
  "text": {
    "fr": "Une collaboratrice du parti signale des faits graves visant un cadre de votre camp. Le dossier est solide, elle a des témoins, et l'homme visé est celui que tout le monde décrit comme irremplaçable sur les retraites. La direction attend votre position avant de prendre la sienne."
    ,
    "en": "A party staffer reports serious conduct by a senior figure in your camp. The file is solid, she has witnesses, and the man named is the one everybody calls irreplaceable on pensions. The leadership is waiting for your position before taking its own."
  },
  "choices": [
    { "label": { "fr": "Le suspendre immédiatement et le dire publiquement", "en": "Suspend him immediately, and say so publicly" },
      "effects": { "reputation": 3, "popularity": 9, "standing": -12, "credibilite": 2, "notoriete": 1,
                   "landscape": { "self": 0.6 } },
      "result": { "fr": "Il est écarté en quarante-huit heures. Trois cadres vous reprochent d'avoir « cédé à l'émotion », et l'un d'eux vous le redira à chaque commission d'investiture pendant dix ans.",
                  "en": "He is out within forty-eight hours. Three senior figures accuse you of “giving in to emotion”, and one of them will remind you of it at every nomination committee for ten years." } },

    { "label": { "fr": "Créer une cellule interne et attendre ses conclusions", "en": "Set up an internal panel and wait for its findings" },
      "effects": { "reputation": -1, "standing": 5, "popularity": -4, "chain": "vss_presse" },
      "result": { "fr": "La cellule est annoncée le vendredi soir. Elle compte quatre membres, dont deux qui le tutoient, et son calendrier n'est pas précisé.",
                  "en": "The panel is announced on a Friday evening. It has four members, two of whom are on first-name terms with him, and no timetable is given." } },

    { "label": { "fr": "Rappeler qu'il faut laisser la justice faire son travail", "en": "Insist that the courts must be allowed to do their work" },
      "effects": { "reputation": -2, "standing": 8, "popularity": -7, "credibilite": -1,
                   "strike": "lache", "chain": "vss_presse",
                   "landscape": { "self": -0.8 } },
      "result": { "fr": "La formule est irréprochable et tout le monde comprend ce qu'elle veut dire. Il garde ses fonctions, elle change de service, et c'est elle qui déménage.",
                  "en": "The line is impeccable and everyone understands what it means. He keeps his job, she is moved to another department, and she is the one who packs a box." } },

    { "label": { "fr": "Aller la voir, l'écouter, et l'accompagner jusqu'au bout", "en": "Go and see her, listen, and stay with it to the end" },
      "when": { "minStanding": 40 },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "reputation": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reputation": 4, "credibilite": 3, "popularity": 7, "standing": -6, "energie": -2,
                                "landscape": { "self": 1 } },
        "result": { "fr": "Vous l'accompagnez à chaque étape, sans une déclaration. Il part de lui-même trois mois plus tard, et le parti passe pour avoir su faire ce que les autres n'ont pas su faire.",
                    "en": "You are there at every stage, without a single statement. He goes of his own accord three months later, and the party is credited with doing what the others could not." } },
      "failure": { "effects": { "reputation": 2, "standing": -14, "popularity": -3, "energie": -2, "chain": "vss_presse" },
        "result": { "fr": "Vous tenez votre ligne et la direction tient la sienne. Il reste, elle part, et on vous fait payer d'avoir eu raison trop tôt et trop fort.",
                    "en": "You hold your line and the leadership holds its own. He stays, she leaves, and you are made to pay for having been right too early and too loudly." } } }
  ]
},

{
  "id": "vss_presse",
  "delay": [4, 10],
  "weight": 0,
  "tag": { "fr": "Signalement", "en": "A complaint" },
  "text": {
    "fr": "Trois journalistes publient l'enquête. Sept témoignages, des messages, et la chronologie exacte de ce que le parti savait et depuis quand. Votre nom figure dans le paragraphe consacré à la direction."
    ,
    "en": "Three reporters publish the investigation. Seven accounts, messages, and the exact timeline of what the party knew and since when. Your name appears in the paragraph about the leadership."
  },
  "choices": [
    { "label": { "fr": "Reconnaître qu'on n'a pas su faire", "en": "Admit that you failed" },
      "effects": { "reputation": 2, "credibilite": 1, "popularity": -5, "standing": -8 },
      "result": { "fr": "Vous dites que le parti n'a pas été à la hauteur, sans chercher à répartir la faute. C'est la seule phrase de la semaine que personne ne retournera contre vous.",
                  "en": "You say the party fell short, without trying to spread the blame. It is the only sentence of the week that nobody will turn against you." } },

    { "label": { "fr": "Défendre la procédure suivie", "en": "Defend the process that was followed" },
      "effects": { "reputation": -2, "popularity": -13, "standing": 3, "credibilite": -2,
                   "strike": "menteur", "landscape": { "self": -1.2, "identitarians": 0.5 } },
      "result": { "fr": "Vous expliquez que les règles ont été respectées. C'est exact, et c'est précisément ce que l'enquête reproche aux règles.",
                  "en": "You explain that the rules were followed. That is true, and it is precisely what the investigation says about the rules." } },

    { "label": { "fr": "Faire porter la responsabilité à la direction sortante", "en": "Pin it on the outgoing leadership" },
      "effects": { "popularity": 4, "standing": -10, "reputation": -2, "strike": "traitre",
                   "landscape": { "self": -0.6 } },
      "result": { "fr": "Vous rappelez que vous n'étiez pas décisionnaire à l'époque. C'est vrai, cela vous sauve la semaine, et plus personne dans la maison ne vous confiera un dossier sensible.",
                  "en": "You point out that you were not the decision-maker at the time. It is true, it saves your week, and nobody in the building will ever hand you a sensitive file again." } }
  ]
},

{
  "id": "tiktok",
  "once": true,
  "weight": 5,
  "when": { "minTurn": 6, "notTrait": ["declin"] },
  "tag": { "fr": "Vidéo courte", "en": "Short video" },
  "text": {
    "fr": "Votre équipe veut ouvrir un compte sur l'application où se trouvent les électeurs que vous ne croisez jamais. La stagiaire qui gérerait ça a vingt-trois ans et vous explique, très gentiment, que personne ne regardera une vidéo de plus de quarante secondes."
    ,
    "en": "Your team wants an account on the app where the voters you never meet actually are. The intern who would run it is twenty-three and explains, very kindly, that nobody will watch a video longer than forty seconds."
  },
  "choices": [
    { "label": { "fr": "Refuser : ce n'est pas là qu'on fait de la politique", "en": "Refuse: that is not where politics happens" },
      "effects": { "credibilite": 1, "standing": 3, "notoriete": -2, "popularity": -5 },
      "result": { "fr": "Vous tenez la ligne et vous la tiendrez encore quatre ans. Pendant ce temps, deux de vos concurrents y font l'audience d'une matinale, et une génération entière apprend leur nom et pas le vôtre.",
                  "en": "You hold the line and you will hold it for another four years. Meanwhile two of your rivals pull morning-show audiences there, and a whole generation learns their names and not yours." } },

    { "label": { "fr": "Laisser l'équipe s'en occuper à votre place", "en": "Let the team run it for you" },
      "effects": { "notoriete": 3, "popularity": 4, "reputation": -1, "credibilite": -1 },
      "result": { "fr": "Le compte marche correctement et ne vous ressemble pas. On vous félicite pour un humour qui n'est pas le vôtre, écrit par quelqu'un que vous croisez deux fois par mois.",
                  "en": "The account does decently and sounds nothing like you. People compliment you on a sense of humour that is not yours, written by somebody you see twice a month." } },

    { "label": { "fr": "S'y mettre soi-même, sans filet", "en": "Do it yourself, with no safety net" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "eloquence": 0.3, "energie": 0.3 }, "dice": 16,
                "bonus": [ { "when": { "maxAge": 45 }, "value": 3 },
                           { "when": { "minAge": 60 }, "value": -3 } ] },
      "success": { "effects": { "notoriete": 5, "popularity": 12, "credibilite": -1, "energie": -1,
                                "landscape": { "self": 1.1 } },
        "result": { "fr": "Une vidéo de vous expliquant un article de loi dans votre cuisine fait quatre millions de vues. Des gens qui ne voteront jamais pour vous la partagent en disant qu'au moins celui-là parle normalement.",
                    "en": "A video of you explaining a clause of a bill in your kitchen gets four million views. People who will never vote for you share it saying that at least this one talks like a person." } },
      "failure": { "effects": { "notoriete": 3, "popularity": -9, "credibilite": -3, "reputation": -1,
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Vous tentez un format que vous ne comprenez pas. Le montage devient un objet de moquerie autonome, republié pendant des mois par des gens qui ignorent qui vous êtes.",
                    "en": "You attempt a format you do not understand. The clip becomes a joke with a life of its own, reposted for months by people who have no idea who you are." } } },

    { "label": { "fr": "Payer une agence spécialisée", "en": "Pay a specialist agency" },
      "when": { "minMoney": 70000 },
      "effects": { "money": -55000, "notoriete": 4, "popularity": 6, "reputation": -2, "credibilite": -1 },
      "result": { "fr": "Quarante vidéos par mois, un ton calibré au dixième et trois consultants qui vous appellent « la marque ». C'est efficace, et vous ne vous relisez jamais.",
                  "en": "Forty videos a month, a tone calibrated to a tenth of a point and three consultants who call you “the brand”. It works, and you never watch them back." } }
  ]
},

{
  "id": "deepfake",
  "once": true,
  "weight": 4,
  "when": { "minTurn": 14, "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Vidéo truquée", "en": "A faked video" },
  "text": {
    "fr": "Une vidéo circule où vous tenez, avec votre voix et votre visage, des propos que vous n'avez jamais tenus. Elle est fabriquée, c'est démontrable, et elle a déjà été vue plus de fois que votre dernière intervention à l'Assemblée."
    ,
    "en": "A video is circulating in which you say, in your own voice and with your own face, things you never said. It is fabricated, that is demonstrable, and it has already been watched more times than your last speech in parliament."
  },
  "choices": [
    { "label": { "fr": "Porter plainte et faire expertiser", "en": "File a complaint and get it examined" },
      "effects": { "reputation": 2, "credibilite": 1, "popularity": -3, "energie": -1, "money": -15000 },
      "result": { "fr": "L'expertise conclut en six semaines, la plainte suivra son cours pendant trois ans. Ceux qui ont cru la vidéo n'ont lu ni l'une ni l'autre.",
                  "en": "The forensic report lands in six weeks; the complaint will run for three years. The people who believed the video have read neither." } },

    { "label": { "fr": "En rire et republier la vidéo vous-même", "en": "Laugh, and repost the video yourself" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "sangfroid": 0.4 }, "dice": 16,
                "bonus": [ { "when": { "comms": 2 }, "value": 3 } ] },
      "success": { "effects": { "notoriete": 3, "popularity": 11, "credibilite": 1, "trait": "teflon",
                                "landscape": { "self": 0.7 } },
        "result": { "fr": "Vous la republiez avec une légende de six mots. Le montage meurt en deux jours, et la légende, elle, entre dans les dictionnaires de citations politiques.",
                    "en": "You repost it with a six-word caption. The clip dies in two days; the caption ends up in the books of political quotations." } },
      "failure": { "effects": { "notoriete": 2, "popularity": -8, "credibilite": -2,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "En la republiant vous la montrez à ceux qui ne l'avaient pas vue. Elle repart pour trois semaines, et cette fois avec votre propre compte comme source.",
                    "en": "By reposting it you show it to everyone who had missed it. It runs for another three weeks, this time with your own account as the source." } } },

    { "label": { "fr": "Exiger le retrait auprès de la plateforme", "en": "Demand the platform take it down" },
      "effects": { "popularity": -6, "standing": 2, "notoriete": 1, "credibilite": -1 },
      "result": { "fr": "La plateforme répond en onze jours par un lien vers ses conditions d'utilisation. Le mot « censure » est prononcé par des gens qui n'avaient jamais entendu parler de vous.",
                  "en": "The platform replies in eleven days with a link to its terms of service. The word “censorship” is used by people who had never heard of you." } }
  ]
},

{
  "id": "jet_prive",
  "once": true,
  "weight": 4,
  "when": { "position": ["ministre", "chef", "premier", "depute", "euro"], "minTurn": 12 },
  "tag": { "fr": "Déplacements", "en": "Travel" },
  "text": {
    "fr": "Un compte automatique publie les trajets des avions d'affaires. Le vôtre y figure quatre fois ce trimestre, dont un Paris-Lyon. Le trajet en train dure deux heures et vous le savez, parce qu'on vous l'a demandé en direct hier soir."
    ,
    "en": "An automated account publishes private jet movements. Yours appears four times this quarter, including one flight that a train covers in two hours. You know it does, because you were asked about it live on air last night."
  },
  "choices": [
    { "label": { "fr": "Renoncer publiquement à l'avion", "en": "Publicly give up the plane" },
      "effects": { "reputation": 3, "popularity": 10, "energie": -2, "credibilite": 1,
                   "landscape": { "self": 0.6 } },
      "result": { "fr": "Vous annoncez que vous prendrez le train. Vous le prendrez vraiment, vous perdrez deux heures par déplacement, et vous découvrirez qu'on vous parle dans les voitures-bar.",
                  "en": "You announce you will take the train. You actually will, you will lose two hours a trip, and you will discover that people talk to you in the buffet car." } },

    { "label": { "fr": "Expliquer les contraintes d'agenda", "en": "Explain the diary constraints" },
      "effects": { "popularity": -9, "standing": 2, "reputation": -1, "credibilite": -1,
                   "landscape": { "self": -0.7, "identitarians": 0.5 } },
      "result": { "fr": "Vous détaillez trois rendez-vous et un impératif de sécurité. Tout est vrai, tout est vérifiable, et la phrase retenue sera « il a expliqué qu'il n'avait pas le choix ».",
                  "en": "You lay out three appointments and a security requirement. It is all true, all verifiable, and the sentence people keep is “he explained he had no choice”." } },

    { "label": { "fr": "Compenser et le faire savoir", "en": "Offset it, and make sure people know" },
      "when": { "minMoney": 40000 },
      "effects": { "money": -30000, "popularity": 2, "reputation": -1, "notoriete": 1 },
      "result": { "fr": "Vous financez une plantation d'arbres dont le communiqué est plus long que la liste des arbres. Personne n'est dupe et tout le monde passe à autre chose, ce qui était le but.",
                  "en": "You fund a tree-planting scheme whose press release is longer than the list of trees. Nobody is fooled and everybody moves on, which was the point." } },

    { "label": { "fr": "Retourner l'attaque contre ceux qui la portent", "en": "Turn the attack back on those making it" },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 6, "standing": 4, "credibilite": -1 },
        "result": { "fr": "Vous sortez les déplacements de trois de vos accusateurs. Le sujet devient leur hypocrisie, ce qui ne répond à rien et fonctionne parfaitement.",
                    "en": "You produce the travel records of three of your accusers. The story becomes their hypocrisy, which answers nothing and works perfectly." } },
      "failure": { "effects": { "popularity": -11, "reputation": -2, "credibilite": -2,
                                "landscape": { "self": -0.8 } },
        "result": { "fr": "Vous accusez, on vérifie, et deux de vos trois exemples sont faux. Vous venez d'ajouter un mensonge à un aller-retour.",
                    "en": "You accuse, they check, and two of your three examples are wrong. You have just added a lie to a round trip." } } }
  ]
},

/* ==========================================================================
   6. CHAÎNE SANTÉ
   ========================================================================== */

{
  "id": "epuisement",
  "when": { "stat": { "energie": { "max": 4 } } },
  "tag": { "fr": "Santé", "en": "Health" },
  "text": {
    "fr": "Votre médecin est formel : au rythme actuel, vous ne tiendrez pas l'année.",
    "en": "Your doctor is blunt: at this pace, you will not last the year."
  },
  "choices": [
    { "label": { "fr": "Lever le pied trois mois", "en": "Slow down for three months" },
      "effects": { "energie": 3, "notoriete": -1, "popularity": -8, "standing": -6, "flags": { "carefulHealth": true } },
      "result": { "fr": "Vous disparaissez des radars et revenez reposé. On a pris vos dossiers.",
                  "en": "You drop off the radar and come back rested. Others took your files." } },
    { "label": { "fr": "Tenir coûte que coûte", "en": "Push through" },
      "effects": { "sangfroid": -1, "standing": 6, "flags": { "frailHealth": true }, "trait": "use" },
      "result": { "fr": "Vous tenez. Quelque chose s'est abîmé, sans bruit.",
                  "en": "You hold on. Something has worn down, quietly." } },
    { "label": { "fr": "Tenir à coups de médicaments", "en": "Get through it on medication" },
      "effects": { "energie": 2, "sangfroid": -1, "reputation": -1, "flags": { "frailHealth": true } },
      "result": { "fr": "Un médecin complaisant, une ordonnance longue comme le bras. Vous tenez le rythme, et vous ne dormez plus du tout.",
                  "en": "An accommodating doctor, a prescription as long as your arm. You keep up the pace, and you stop sleeping altogether." } }
  ]
},

{
  "id": "alerte_cardiaque",
  "once": true,
  "when": { "minAge": 55 },
  "tag": { "fr": "Santé", "en": "Health" },
  "text": {
    "fr": "Un malaise en plein meeting. Les examens parlent d'alerte sérieuse, pas encore d'accident.",
    "en": "You collapse mid-rally. The tests call it a serious warning, not yet an event."
  },
  "choices": [
    { "label": { "fr": "Suivre le traitement à la lettre", "en": "Follow the treatment to the letter" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "energie": -2, "popularity": 5, "standing": -7, "flags": { "carefulHealth": true } },
      "result": { "fr": "Vous ralentissez, un peu. Le pays s'attendrit, le parti s'inquiète.",
                  "en": "You slow down, a little. The country softens; the party worries." } },
    { "label": { "fr": "Cacher l'épisode et continuer", "en": "Hide it and carry on" },
      "effects": { "sangfroid": 1, "standing": 4, "flags": { "frailHealth": true }, "strike": "menteur", "chain": "rechute" },
      "result": { "fr": "Personne ne sait. Vous vivez désormais avec un compte à rebours.",
                  "en": "Nobody knows. You now live with a countdown." } },
    { "label": { "fr": "Publier une photo de vous en train de courir", "en": "Publish a photo of yourself out running" },
      "effects": { "notoriete": 1, "popularity": 6, "energie": -1, "reputation": -1, "strike": "menteur" },
      "result": { "fr": "Huit cents mètres, un photographe, un tee-shirt trempé à l'avance. Le doute sur votre santé est levé pour six mois.",
                  "en": "Eight hundred metres, one photographer, a t-shirt soaked in advance. The doubt about your health is settled for six months." } }
  ]
},

{
  "id": "rechute",
  "delay": [3, 8],
  "weight": 0,
  "tag": { "fr": "Santé", "en": "Health" },
  "text": {
    "fr": "Deuxième malaise, cette fois devant les caméras. Impossible de le cacher.",
    "en": "A second collapse, this time on camera. Impossible to hide."
  },
  "choices": [
    { "label": { "fr": "Publier votre dossier médical", "en": "Publish your medical file" },
      "effects": { "reputation": 2, "popularity": 6, "standing": -12, "flags": { "carefulHealth": true, "frailHealth": false } },
      "result": { "fr": "La transparence coupe court aux rumeurs. Le parti, lui, cherche déjà un remplaçant.",
                  "en": "The transparency ends the rumours. The party is already looking for a replacement." } },
    { "label": { "fr": "Parler d'un simple coup de fatigue", "en": "Call it simple exhaustion" },
      "effects": { "popularity": -6, "standing": 9, "reputation": -1, "strike": "menteur" },
      "result": { "fr": "Personne n'y croit. On commence à compter vos apparitions.",
                  "en": "Nobody believes it. People start counting your appearances." } }
  ]
},

/* ==========================================================================
   7. CHAÎNE LÉGISLATIVE — pour les députés
   ========================================================================== */

{
  "id": "projet_loi",
  "once": true,
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Assemblée", "en": "The chamber" },
  "text": {
    "fr": "Vous pouvez déposer une proposition de loi à votre nom. Une seule dans une carrière restera dans les mémoires.",
    "en": "You can table a bill in your own name. Only one in a career ever stays in the memory."
  },
  "choices": [
    { "label": { "fr": "Un texte ambitieux et clivant", "en": "An ambitious, divisive bill" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "notoriete": 2, "energie": -2, "popularity": 9, "standing": -4, "chain": "bataille_amendements" },
      "result": { "fr": "Le texte fait la une avant même d'être examiné. Les couteaux sortent.",
                  "en": "The bill makes the front page before it is even read. The knives come out." } },
    { "label": { "fr": "Un texte technique et consensuel", "en": "A technical, consensual bill" },
      "effects": { "credibilite": +2, "standing": 8, "reputation": 1, "popularity": -6, "notoriete": -1 },
      "result": { "fr": "Adopté à l'unanimité en huit minutes. Trois personnes s'en souviendront.",
                  "en": "Passed unanimously in eight minutes. Three people will remember it." } },
    { "label": { "fr": "Reprendre le texte d'un collègue discret", "en": "Recycle a quiet colleague's bill" },
      "effects": { "standing": 4, "notoriete": 1, "energie": 1, "reseau": -1, "reputation": -1 },
      "result": { "fr": "Le texte est bon, il attendait depuis trois ans. Vous y mettez votre nom et un titre plus vendeur.",
                  "en": "The text is good; it had been waiting three years. You put your name on it and a better title." } }
  ]
},

{
  "id": "bataille_amendements",
  "delay": [1, 3],
  "weight": 0,
  "tag": { "fr": "Assemblée", "en": "The chamber" },
  "text": {
    "fr": "Deux mille amendements sont déposés pour enterrer votre texte. Les séances durent jusqu'à quatre heures du matin.",
    "en": "Two thousand amendments are tabled to bury your bill. The sittings run until four in the morning."
  },
  "choices": [
    { "label": { "fr": "Tenir l'hémicycle nuit après nuit", "en": "Hold the chamber night after night" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "roll": { "stat": "energie", "base": 13, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "eloquence": 1, "energie": -2, "popularity": 12, "standing": 6, "chain": "vote_final" },
        "result": { "fr": "Vous êtes encore debout au petit matin. Les images tournent en boucle.",
                    "en": "You are still standing at dawn. The footage runs on a loop." } },
      "failure": { "effects": { "energie": -2, "popularity": -8, "standing": -5 },
        "result": { "fr": "Vous craquez en séance. Le texte est retiré dans l'indifférence.",
                    "en": "You crack in the chamber. The bill is withdrawn to general indifference." } } },
    { "label": { "fr": "Négocier une version édulcorée", "en": "Negotiate a watered-down version" },
      "effects": { "standing": 10, "reputation": -1, "popularity": -5, "chain": "vote_final" },
      "result": { "fr": "Il ne reste que le titre. Mais il reste le titre.",
                  "en": "Only the title survives. But the title survives." } }
  ]
},

{
  "id": "vote_final",
  "delay": [1, 3],
  "weight": 0,
  "tag": { "fr": "Vote solennel", "en": "The final vote" },
  "text": {
    "fr": "Le vote solennel a lieu mardi. Il vous manque une quinzaine de voix dans votre propre camp.",
    "en": "The final vote is on Tuesday. You are about fifteen votes short in your own camp."
  },
  "choices": [
    { "label": { "fr": "Aller chercher les voix une par une", "en": "Chase the votes one by one" },
      "roll": { "stat": "reseau", "base": 13, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "reputation": 2, "popularity": 14, "standing": 12 },
        "result": { "fr": "La loi passe à onze voix près. Elle portera votre nom.",
                    "en": "The law passes by eleven votes. It will carry your name." } },
      "failure": { "effects": { "popularity": -9, "standing": -8, "reputation": -1 },
        "result": { "fr": "Rejeté de six voix. Votre propre camp vous a lâché.",
                    "en": "Rejected by six votes. Your own side let you down." } } },
    { "label": { "fr": "Menacer les récalcitrants", "en": "Threaten the holdouts" },
      "roll": { "chance": 0.5 },
      "success": { "effects": { "notoriete": 1, "popularity": 10, "standing": 4, "reputation": -1 },
        "result": { "fr": "La loi passe. On sait maintenant que vous savez faire peur.",
                    "en": "The law passes. People now know you can frighten them." } },
      "failure": { "effects": { "standing": -14, "reputation": -2, "popularity": -6 },
        "result": { "fr": "Les menaces fuitent. Le texte tombe et votre réputation avec.",
                    "en": "The threats leak. The bill falls and your reputation with it." } } }
  ]
},

/* ==========================================================================
   8. RIVAUX
   ========================================================================== */

{
  "id": "debat_public",
  "tag": { "fr": "Débat", "en": "Debate" },
  "text": {
    "fr": "{rival} vous met publiquement au défi de débattre. Refuser se verra.",
    "en": "{rival} has publicly challenged you to a debate. Declining will be noticed."
  },
  "choices": [
    { "label": { "fr": "Accepter le débat", "en": "Take the debate" },
      "roll": { "base": 18, "stat": "eloquence",
                "plus": { "sangfroid": 0.35, "popularity": 0.03 },
                "bonus": [ { "when": { "background": ["law", "academia"] }, "value": 2 },
                           { "when": { "background": ["celebrity"] }, "value": -1 },
                           { "when": { "maxPopularity": 30 }, "value": -0.5 } ], "dice": 16 },
      "success": { "effects": { "landscape": { "self": 1.2 }, "notoriete": 2, "reputation": 1, "popularity": 14, "standing": 2, "trait": "orateur" },
        "result": { "fr": "Vous dominez l'échange. Les extraits vous donnent le beau rôle.",
                    "en": "You dominate the exchange. The clips flatter you." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "notoriete": 1, "reputation": -1, "popularity": -11, "standing": -5 },
        "result": { "fr": "L'adversaire était préparé. Vous encaissez plus que vous ne rendez.",
                    "en": "Your opponent came prepared. You take more than you give." } } },
    { "label": { "fr": "Décliner avec dédain", "en": "Decline with disdain" },
      "effects": { "landscape": { "self": -0.5 }, "strike": "lache", "notoriete": -1, "sangfroid": 1, "popularity": -5, "standing": 2 },
      "result": { "fr": "« Je ne débats pas avec tout le monde. » La formule amuse, ou agace.",
                  "en": "“I don't debate just anyone.” The line amuses some and grates on others." } },
    { "label": { "fr": "Le préparer comme une plaidoirie", "en": "Prepare it like a court case" },
      "when": { "background": ["law"] },
      "effects": { "landscape": { "self": 0.9 }, "eloquence": 1, "energie": -2, "notoriete": 1, "popularity": 12, "standing": 5 },
      "result": { "fr": "Vous arrivez avec des pièces, des dates et des citations. L'exercice tourne au procès.",
                  "en": "You arrive with documents, dates and quotations. The debate turns into a trial." } },
    { "label": { "fr": "En faire un spectacle", "en": "Turn it into a show" },
      "when": { "background": ["celebrity"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": -0.6 }, "notoriete": 3, "popularity": 13, "reputation": -1 },
        "result": { "fr": "Le débat devient un moment de télévision. On ne retient pas les arguments, on retient vous.",
                    "en": "The debate becomes television. Nobody remembers the arguments; they remember you." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "reputation": -2, "popularity": -8, "standing": -6 },
        "result": { "fr": "Le numéro tombe à plat et confirme que vous n'êtes pas sérieux.",
                    "en": "The act falls flat and confirms you are not serious." } } }
  ]
},

{
  "id": "attaque_rival",
  "tag": { "fr": "Rivalité", "en": "Rivalry" },
  "text": {
    "fr": "Dans une interview, {rival} vous décrit comme « une ambition sans colonne vertébrale ».",
    "en": "In an interview, {rival} describes you as “ambition without a spine”."
  },
  "choices": [
    { "label": { "fr": "Répondre par une formule cinglante", "en": "Fire back" },
      "roll": { "stat": "eloquence", "base": 13, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 0.8, "scene": -0.8 }, "notoriete": 2, "popularity": 11, "standing": 3 },
        "result": { "fr": "Votre réplique fait le tour des rédactions. Match gagné.",
                    "en": "Your reply makes the rounds. Point won." } },
      "failure": { "effects": { "landscape": { "self": -0.7, "scene": 0.5 }, "reputation": -1, "popularity": -8, "standing": -3 },
        "result": { "fr": "La réplique tombe à plat. On vous sent piqué.",
                    "en": "The reply falls flat. You sound stung." } } },
    { "label": { "fr": "Laisser dire", "en": "Let it go" },
      "effects": { "strike": "lache", "sangfroid": 1, "notoriete": -1, "popularity": -2, "standing": 6 },
      "result": { "fr": "Pas de réponse, pas de séquence. L'appareil apprécie le calme.",
                  "en": "No reply, no story. The machine appreciates the calm." } },
    { "label": { "fr": "Désarmer par l'humour", "en": "Disarm it with humour" },
      "when": { "personality": ["charming"] },
      "effects": { "landscape": { "self": 0.5 }, "charisme": 1, "popularity": 10, "standing": -5 },
      "result": { "fr": "Votre réponse fait rire jusque dans son camp. L'attaque se retourne toute seule.",
                  "en": "Your answer gets laughs even on his side. The attack turns itself around." } },
    { "label": { "fr": "Ne rien dire et préparer la riposte", "en": "Say nothing and prepare the counter" },
      "when": { "personality": ["calculating"] },
      "effects": { "sangfroid": 1, "reseau": 1, "standing": 8, "popularity": -2 },
      "result": { "fr": "Vous encaissez sans broncher et vous commencez à réunir de quoi le détruire plus tard.",
                  "en": "You take it without flinching and start gathering what will destroy him later." } }
  ]
},

{
  "id": "scandale_rival",
  "tag": { "fr": "Rivalité", "en": "Rivalry" },
  "text": {
    "fr": "La presse révèle une affaire embarrassante visant {rival}. Votre entourage vous presse d'enfoncer le clou.",
    "en": "The press has an embarrassing story about {rival}. Your team urges you to twist the knife."
  },
  "choices": [
    { "label": { "fr": "Attaquer publiquement", "en": "Attack publicly" },
      "effects": { "landscape": { "scene": -1 }, "notoriete": 1, "reputation": -1, "popularity": 4, "standing": -7 },
      "result": { "fr": "Le coup porte. On retiendra aussi que c'est vous qui l'avez porté.",
                  "en": "The blow lands. People will also remember who threw it." } },
    { "label": { "fr": "Rester digne", "en": "Stay above it" },
      "effects": { "reputation": 1, "popularity": -3, "standing": 7 },
      "result": { "fr": "« Je ne commente pas les affaires. » La sobriété paie, parfois.",
                  "en": "“I don't comment on legal matters.” Restraint pays, sometimes." } },
    { "label": { "fr": "Prendre publiquement sa défense", "en": "Publicly defend him" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "scene": 0.6 }, "reputation": 3, "popularity": 9, "standing": -5 },
      "result": { "fr": "Défendre un adversaire surprend tout le monde. On vous regarde autrement.",
                  "en": "Defending an opponent surprises everyone. People see you differently." } },
    { "label": { "fr": "Vérifier les faits avant tout le monde", "en": "Check the facts before anyone else" },
      "when": { "background": ["journalism"] },
      "roll": { "base": 13, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "landscape": { "scene": -0.8, "self": 0.5 }, "notoriete": 2, "reputation": 2, "popularity": 8, "standing": 6 },
        "result": { "fr": "L'affaire est plus grave que la presse ne le croit, et c'est vous qui le révélez.",
                    "en": "The story is worse than the press thinks, and you are the one who reveals it." } },
      "failure": { "effects": { "popularity": -4, "standing": -3 },
        "result": { "fr": "Vos vérifications ne donnent rien. Vous avez perdu trois jours.",
                    "en": "Your checks turn up nothing. You have lost three days." } } }
  ]
},

{
  "id": "alliance_rival",
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Alliance", "en": "Alliance" },
  "text": {
    "fr": "{rival} propose un pacte : vous ne vous attaquez plus publiquement, et vous partagez vos informations.",
    "en": "{rival} proposes a pact: no more public attacks, and you share information."
  },
  "choices": [
    { "label": { "fr": "Sceller le pacte", "en": "Seal the pact" },
      "effects": { "reseau": 2, "standing": 9, "popularity": -8 },
      "result": { "fr": "L'accord tient six mois. C'est déjà beaucoup en politique.",
                  "en": "The deal holds for six months. That is a long time in politics." } },
    { "label": { "fr": "Refuser et le rendre public", "en": "Refuse and make it public" },
      "effects": { "notoriete": 2, "reputation": 1, "popularity": 11, "standing": -6 },
      "result": { "fr": "Révéler la proposition vous grandit et vous fait un ennemi durable.",
                  "en": "Revealing the offer makes you look big and makes you a lasting enemy." } },
    { "label": { "fr": "Signer, puis faire fuiter le pacte", "en": "Sign, then leak the pact" },
      "when": { "personality": ["calculating", "provocative"] },
      "effects": { "notoriete": 2, "popularity": 7, "standing": -4, "reputation": -2, "strike": "traitre" },
      "result": { "fr": "Le document sort trois semaines plus tard, sans votre signature en évidence. Il comprend tout de suite d'où ça vient.",
                  "en": "The document surfaces three weeks later, with your signature conveniently cropped. He knows exactly where it came from." } }
  ]
},

/* ==========================================================================
   9. VIE PRIVÉE ET USURE
   ========================================================================== */

{
  "id": "famille",
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "À la maison, on ne vous voit plus. La discussion que vous repoussez depuis des mois finit par arriver.",
    "en": "At home, they never see you anymore. The conversation you have been putting off finally arrives."
  },
  "choices": [
    { "label": { "fr": "Sanctuariser les week-ends", "en": "Protect the weekends" },
      "effects": { "energie": 1, "reseau": -1, "standing": -6 },
      "result": { "fr": "Vous ratez quelques dîners qui comptaient. Vous en sauvez d'autres.",
                  "en": "You miss a few dinners that mattered. You save some others." } },
    { "label": { "fr": "Promettre que ça ira mieux après", "en": "Promise it gets better later" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reputation": -1, "energie": -2, "standing": 4, "chain": "rupture" },
      "result": { "fr": "Personne n'y croit, pas même vous. La politique d'abord.",
                  "en": "Nobody believes it, not even you. Politics first." } },
    { "label": { "fr": "Payer de quoi alléger le quotidien", "en": "Pay to lighten the load at home" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -70000, "energie": 1, "reputation": -1, "standing": 3 },
      "result": { "fr": "Une aide à domicile, un chauffeur, des vacances. L'argent règle la logistique, pas le reste.",
                  "en": "Help at home, a driver, a holiday. Money fixes the logistics, not the rest." } },
    { "label": { "fr": "Les associer à la vie publique", "en": "Bring them into public life" },
      "when": { "personality": ["charming"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "popularity": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "energie": 1 },
        "result": { "fr": "Les photos de famille fonctionnent. On vous trouve enfin incarné.",
                    "en": "The family pictures work. People finally find you human." } },
      "failure": { "effects": { "popularity": -6, "reputation": -1 },
        "result": { "fr": "L'exposition se retourne. On vous accuse d'utiliser les vôtres.",
                    "en": "The exposure backfires. You are accused of using your own family." } } }
  ]
},

{
  "id": "rupture",
  "delay": [2, 6],
  "weight": 0,
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "La séparation est actée. Elle sera publique, parce que tout finit par l'être.",
    "en": "The separation is settled. It will be public, because everything ends up being public."
  },
  "choices": [
    { "label": { "fr": "Communiquer avec dignité", "en": "Handle it with dignity" },
      "effects": { "energie": -1, "reputation": 2, "popularity": 8, "sangfroid": 1 },
      "result": { "fr": "Un communiqué de trois lignes. Le pays vous trouve humain.",
                  "en": "A three-line statement. The country finds you human." } },
    { "label": { "fr": "Vous jeter dans le travail", "en": "Throw yourself into work" },
      "effects": { "energie": -2, "reseau": 2, "standing": 12, "popularity": -3 },
      "result": { "fr": "Vous ne rentrez plus du tout. Le parti n'a jamais eu un cadre aussi disponible.",
                  "en": "You stop going home at all. The party has never had such an available operator." } }
  ]
},

{
  "id": "vieil_ami",
  "when": { "minAge": 45 },
  "tag": { "fr": "Loyautés", "en": "Loyalties" },
  "text": {
    "fr": "Un ami de trente ans vous demande une intervention pour son entreprise. Ce n'est pas illégal, c'est juste tout ce que vous dénoncez.",
    "en": "A friend of thirty years asks you to intervene for his company. It is not illegal, it is just everything you denounce."
  },
  "choices": [
    { "label": { "fr": "Passer le coup de fil", "en": "Make the call" },
      "effects": { "reseau": 1, "reputation": -2, "standing": 3, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Cinq minutes de téléphone. Une note de service quelque part porte votre nom.",
                  "en": "Five minutes on the phone. A memo somewhere has your name on it." } },
    { "label": { "fr": "Refuser et perdre l'ami", "en": "Refuse and lose the friend" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reputation": 2, "reseau": -1, "popularity": 3, "energie": -2 },
      "result": { "fr": "Il raccroche sans rien dire. Trente ans, et vous ne le reverrez pas.",
                  "en": "He hangs up without a word. Thirty years, and you will not see him again." } },
    { "label": { "fr": "L'orienter vers la procédure normale", "en": "Point him to the proper channel" },
      "when": { "background": ["civil"] },
      "effects": { "reputation": 1, "reseau": -1, "standing": 3, "energie": -1 },
      "result": { "fr": "Vous lui expliquez exactement quel dossier déposer, et à qui. Rien d'illégal, tout de légal.",
                  "en": "You tell him exactly which application to file, and to whom. Nothing illegal, everything legal." } },
    { "label": { "fr": "Refuser en lui expliquant pourquoi", "en": "Refuse, and explain why" },
      "when": { "personality": ["principled", "clever"] },
      "effects": { "reputation": 2, "eloquence": 1, "popularity": 4, "energie": -1 },
      "result": { "fr": "Deux heures de conversation difficile. Il comprend sans vous pardonner.",
                  "en": "Two hours of difficult conversation. He understands without forgiving you." } }
  ]
},

{
  "id": "anniversaire_carriere",
  "when": { "minTurn": 30 },
  "tag": { "fr": "Bilan", "en": "Taking stock" },
  "text": {
    "fr": "Quinze ans de vie politique. Un journaliste vous demande si vous referiez tout pareil.",
    "en": "Fifteen years in politics. A journalist asks whether you would do it all again."
  },
  "choices": [
    { "label": { "fr": "Répondre franchement non", "en": "Answer honestly: no" },
      "effects": { "reputation": 2, "popularity": 10, "standing": -7 },
      "result": { "fr": "L'aveu circule partout. On vous redécouvre.",
                  "en": "The admission travels everywhere. People rediscover you." } },
    { "label": { "fr": "Dérouler le bilan", "en": "Run through the record" },
      "effects": { "standing": 6, "popularity": -2, "notoriete": 1 },
      "result": { "fr": "Un entretien correct et parfaitement oubliable.",
                  "en": "A decent, perfectly forgettable interview." } },
    { "label": { "fr": "Publier un livre de souvenirs", "en": "Publish a book of memoirs" },
      "effects": { "money": 40000, "notoriete": 2, "popularity": 4, "energie": -2, "standing": -3 },
      "result": { "fr": "Trois cents pages écrites par quelqu'un d'autre, où vous aviez raison avant tout le monde à chaque chapitre.",
                  "en": "Three hundred pages written by somebody else, in which you were right before everyone else in every chapter." } }
  ]
}

,

/* ==========================================================================
   10. PROPRES À CHAQUE PARTI
   ========================================================================== */

{
  "id": "manif_reprimee",
  "weight": 5,
  "when": { "party": ["radical_left"] },
  "tag": { "fr": "Mouvement", "en": "The movement" },
  "text": {
    "fr": "Une manifestation soutenue par le parti dégénère. Des militants sont en garde à vue.",
    "en": "A demonstration backed by the party turns ugly. Activists are in custody."
  },
  "choices": [
    { "label": { "fr": "Aller devant le commissariat", "en": "Stand outside the police station" },
      "effects": { "notoriete": 2, "reseau": 1, "reputation": -1, "standing": 14, "popularity": -6 },
      "result": { "fr": "L'image de vous face aux grilles devient un symbole, adoré et détesté.",
                  "en": "The image of you at the gates becomes a symbol, loved and hated." } },
    { "label": { "fr": "Dénoncer les violences des deux côtés", "en": "Condemn violence on all sides" },
      "effects": { "reputation": 1, "reseau": -2, "standing": -15, "popularity": 10 },
      "result": { "fr": "La base parle de trahison. Les plateaux vous trouvent raisonnable.",
                  "en": "The base calls it betrayal. The talk shows call you reasonable." } },
    { "label": { "fr": "Payer les avocats des interpellés", "en": "Pay for the detainees' lawyers" },
      "when": { "minMoney": 100000 },
      "effects": { "money": -60000, "reseau": 2, "standing": 16, "reputation": 1 },
      "result": { "fr": "Vous ne dites rien publiquement, vous payez. Le parti l'apprend et ne l'oublie pas.",
                  "en": "You say nothing publicly; you pay. The party finds out and never forgets." } },
    { "label": { "fr": "Négocier leur libération avec la préfecture", "en": "Negotiate their release with the prefecture" },
      "when": { "background": ["civil", "law"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "reputation": 2, "standing": 12, "popularity": 6 },
        "result": { "fr": "Tous ressortent avant minuit. Personne ne saura jamais comment.",
                    "en": "They are all out before midnight. Nobody will ever know how." } },
      "failure": { "effects": { "standing": -6, "popularity": -3 },
        "result": { "fr": "On vous éconduit poliment. Les gardes à vue vont au bout.",
                    "en": "You are politely turned away. The detentions run their full course." } } }
  ]
},

{
  "id": "greve_generale",
  "weight": 5,
  "when": { "party": ["radical_left", "socdem"] },
  "tag": { "fr": "Social", "en": "Industrial action" },
  "text": {
    "fr": "Une grève paralyse le pays depuis trois semaines. Les syndicats attendent que vous choisissiez un camp.",
    "en": "A strike has paralysed the country for three weeks. The unions are waiting for you to pick a side."
  },
  "choices": [
    { "label": { "fr": "Rejoindre les piquets de grève", "en": "Join the picket lines" },
      "effects": { "landscape": { "radical_left": 1 }, "reseau": 2, "notoriete": 1, "standing": 12, "popularity": -7 },
      "result": { "fr": "Les images vous installent comme un chef de camp. Le pays fatigué, lui, vous en veut.",
                  "en": "The pictures install you as a leader of a side. The exhausted country resents you." } },
    { "label": { "fr": "Appeler à la négociation", "en": "Call for negotiation" },
      "effects": { "landscape": { "self": 0.7 }, "eloquence": 1, "reputation": 1, "popularity": 9, "standing": -9 },
      "result": { "fr": "Vous jouez les médiateurs. Les deux camps vous soupçonnent de l'autre.",
                  "en": "You play mediator. Each side suspects you of belonging to the other." } },
    { "label": { "fr": "Loger et nourrir les grévistes", "en": "House and feed the strikers" },
      "when": { "minMoney": 120000 },
      "effects": { "landscape": { "radical_left": 0.8 }, "money": -80000, "reseau": 2, "standing": 14, "popularity": -4 },
      "result": { "fr": "Vos caisses de grève tiennent trois semaines de plus. Les syndicats s'en souviendront.",
                  "en": "Your strike fund holds three more weeks. The unions will remember." } },
    { "label": { "fr": "Proposer une médiation technique", "en": "Offer technical mediation" },
      "when": { "background": ["civil", "academia"] },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 1 }, "reputation": 3, "reseau": 1, "popularity": 14, "standing": 4 },
        "result": { "fr": "Votre proposition débloque le conflit en dix jours. Les deux camps vous doivent quelque chose.",
                    "en": "Your proposal breaks the deadlock in ten days. Both sides owe you something." } },
      "failure": { "effects": { "landscape": { "self": -0.6 }, "popularity": -5, "standing": -4 },
        "result": { "fr": "Votre plan est jugé technocratique par les uns, naïf par les autres.",
                    "en": "Your plan is called technocratic by some, naive by others." } } }
  ]
},

{
  "id": "synthese",
  "weight": 5,
  "when": { "party": ["socdem"] },
  "tag": { "fr": "Congrès", "en": "Conference" },
  "text": {
    "fr": "Le parti se déchire entre deux motions. On vous propose d'écrire la synthèse que personne ne veut signer.",
    "en": "The party is split between two motions. You are asked to draft the compromise nobody wants to sign."
  },
  "choices": [
    { "label": { "fr": "Écrire la synthèse", "en": "Draft the compromise" },
      "effects": { "landscape": { "self": 0.5 }, "reseau": 2, "notoriete": -1, "standing": 13, "popularity": -6, "trait": "appareil" },
      "result": { "fr": "Le texte est illisible et tout le monde vous en sait gré.",
                  "en": "The text is unreadable and everyone is grateful." } },
    { "label": { "fr": "Choisir un camp", "en": "Pick a side" },
      "roll": { "stat": "reseau", "base": 13, "dice": 16 },
      "success": { "effects": { "reseau": 1, "notoriete": 1, "standing": 12, "popularity": 5 },
        "result": { "fr": "Votre camp l'emporte. Vous voilà identifié, donc attendu.",
                    "en": "Your side wins. You are now marked, therefore expected." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "reseau": -2, "standing": -16 },
        "result": { "fr": "Votre camp perd. On range votre nom dans les vaincus.",
                    "en": "Your side loses. Your name is filed with the defeated." } } },
    { "label": { "fr": "Écrire une motion à votre nom", "en": "Table a motion in your own name" },
      "when": { "personality": ["provocative", "principled"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "standing": 0.05, "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 0.6 }, "notoriete": 2, "standing": 13, "popularity": 7 },
        "result": { "fr": "Votre motion arrive troisième et devient la ligne du parti deux ans plus tard.",
                    "en": "Your motion comes third and becomes party policy two years later." } },
      "failure": { "effects": { "landscape": { "self": -0.9 }, "standing": -12, "reseau": -1 },
        "result": { "fr": "Onze pour cent. On vous conseille de mûrir encore un peu.",
                    "en": "Eleven per cent. You are advised to mature a little longer." } } },
    { "label": { "fr": "Acheter la paix avec des postes", "en": "Buy peace with jobs" },
      "when": { "minStanding": 55 },
      "effects": { "reseau": 2, "standing": 11, "reputation": -2 },
      "result": { "fr": "Six vice-présidences créées pour l'occasion. Le congrès se termine dans les sourires.",
                  "en": "Six vice-presidencies created for the occasion. The conference ends in smiles." } }
  ]
},

{
  "id": "grande_coalition",
  "weight": 5,
  "when": { "party": ["centrists", "socdem"] },
  "tag": { "fr": "Alliances", "en": "Alliances" },
  "text": {
    "fr": "Le parti négocie un accord avec un voisin encombrant. On vous sonde : faut-il signer ?",
    "en": "The party is negotiating a deal with an awkward neighbour. You are asked: should we sign?"
  },
  "choices": [
    { "label": { "fr": "Pousser à l'accord", "en": "Push for the deal" },
      "effects": { "landscape": { "self": -1, "identitarians": 0.8 }, "reseau": 1, "reputation": -1, "standing": 11, "popularity": -10 },
      "result": { "fr": "L'accord passe. Vous êtes désormais « quelqu'un qui compte ».",
                  "en": "The deal goes through. You are now “someone who matters”." } },
    { "label": { "fr": "Défendre l'indépendance", "en": "Defend independence" },
      "effects": { "landscape": { "self": 1.2 }, "reputation": 2, "reseau": -1, "standing": -9, "popularity": 11 },
      "result": { "fr": "L'accord se fait sans vous. La pureté a un coût.",
                  "en": "The deal happens without you. Purity has a price." } },
    { "label": { "fr": "Négocier en secret et démentir en public", "en": "Negotiate in secret and deny it publicly" },
      "effects": { "landscape": { "self": -0.8, "identitarians": 0.6 }, "standing": 8, "popularity": -3, "reputation": -2, "sangfroid": 1, "strike": "menteur" },
      "result": { "fr": "Vous obtenez les postes et le bénéfice de l'opposition. Cela tiendra jusqu'à la première indiscrétion.",
                  "en": "You get the jobs and the credit for opposing. It will hold until the first indiscretion." } }
  ]
},

{
  "id": "ni_ni",
  "weight": 5,
  "when": { "party": ["centrists"] },
  "tag": { "fr": "Positionnement", "en": "Positioning" },
  "text": {
    "fr": "Un second tour oppose les deux extrêmes. Le pays entier attend votre consigne de vote.",
    "en": "A run-off pits the two extremes against each other. The whole country is waiting for your instruction."
  },
  "choices": [
    { "label": { "fr": "Appeler à faire barrage", "en": "Call for a blocking vote" },
      "effects": { "reputation": 2, "notoriete": 1, "popularity": 11, "standing": -6 },
      "result": { "fr": "Le geste vous grandit. Une partie de votre électorat ne vous le pardonnera pas.",
                  "en": "The gesture makes you look big. Part of your base will never forgive it." } },
    { "label": { "fr": "Renvoyer les deux dos à dos", "en": "Refuse to choose" },
      "effects": { "reputation": -2, "popularity": -9, "standing": 7 },
      "result": { "fr": "« Ni l'un ni l'autre. » La formule vous protège et vous rapetisse.",
                  "en": "“Neither of them.” The line protects you and shrinks you." } },
    { "label": { "fr": "Négocier votre soutien contre des garanties", "en": "Trade your backing for guarantees" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 13, "popularity": 4 },
        "result": { "fr": "Vous obtenez trois engagements écrits avant d'appeler à voter. Personne ne le saura.",
                    "en": "You extract three written commitments before calling for a vote. Nobody will know." } },
      "failure": { "effects": { "reputation": -2, "popularity": -8, "standing": -5 },
        "result": { "fr": "La négociation fuite entre les deux tours. Le marchandage est à la une.",
                    "en": "The talks leak between the rounds. The bargaining is front-page news." } } }
  ]
},

{
  "id": "conflit_interets",
  "weight": 5,
  "when": { "party": ["liberals", "conservatives"], "minMoney": 200000 },
  "tag": { "fr": "Affaires", "en": "Business" },
  "text": {
    "fr": "Un journal révèle que vous siégez toujours au conseil d'une entreprise concernée par un texte que vous défendez.",
    "en": "A paper reveals you still sit on the board of a company affected by a bill you support."
  },
  "choices": [
    { "label": { "fr": "Démissionner du conseil", "en": "Resign from the board" },
      "effects": { "money": -50000, "reputation": 1, "popularity": 7, "standing": -4 },
      "result": { "fr": "Vous partez avec élégance et sans jetons de présence.",
                  "en": "You leave gracefully, and without the fees." } },
    { "label": { "fr": "Ne rien lâcher", "en": "Give up nothing" },
      "effects": { "reputation": -2, "money": 30000, "popularity": -13, "standing": 3 },
      "result": { "fr": "« Tout est légal. » C'est vrai, et ça n'arrange rien.",
                  "en": "“It is all legal.” True, and it helps nothing." } },
    { "label": { "fr": "Placer vos parts dans un aveugle", "en": "Put your holdings in a blind trust" },
      "when": { "background": ["business", "law"] },
      "effects": { "money": -20000, "reputation": 2, "popularity": 8, "standing": 4 },
      "result": { "fr": "Le montage est irréprochable et incompréhensible. Les journalistes abandonnent.",
                  "en": "The arrangement is impeccable and incomprehensible. The journalists give up." } }
  ]
},

{
  "id": "deregulation",
  "weight": 5,
  "when": { "party": ["liberals"] },
  "tag": { "fr": "Doctrine", "en": "Doctrine" },
  "text": {
    "fr": "Une faillite retentissante suit une dérégulation que votre parti a portée. On vous demande si vous regrettez.",
    "en": "A spectacular bankruptcy follows a deregulation your party championed. You are asked whether you regret it."
  },
  "choices": [
    { "label": { "fr": "Assumer la doctrine", "en": "Stand by the doctrine" },
      "effects": { "standing": 12, "popularity": -11, "sangfroid": 1 },
      "result": { "fr": "« Le marché corrige. » Les salariés licenciés apprécient moyennement.",
                  "en": "“The market corrects itself.” The laid-off workers are unimpressed." } },
    { "label": { "fr": "Reconnaître une erreur", "en": "Admit a mistake" },
      "effects": { "reputation": 2, "popularity": 12, "standing": -14 },
      "result": { "fr": "L'aveu est rare en politique. Il vous coûte tout votre crédit interne.",
                  "en": "Such an admission is rare in politics. It costs you all your internal credit." } },
    { "label": { "fr": "Proposer une régulation ciblée", "en": "Propose targeted regulation" },
      "when": { "personality": ["clever"] },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reputation": 2, "popularity": 10, "standing": 4 },
        "result": { "fr": "Vous corrigez sans renier. C'est l'exercice le plus difficile en politique.",
                    "en": "You correct without recanting. The hardest exercise in politics." } },
      "failure": { "effects": { "popularity": -5, "standing": -8 },
        "result": { "fr": "Ni les libéraux ni les autres ne vous suivent. Le texte meurt seul.",
                    "en": "Neither the liberals nor anyone else follows. The text dies alone." } } }
  ]
},

{
  "id": "polemique_valeurs",
  "weight": 5,
  "when": { "party": ["conservatives"] },
  "tag": { "fr": "Valeurs", "en": "Values" },
  "text": {
    "fr": "Un débat de société enflamme le pays. Votre base attend une position tranchée, le centre vous regarde.",
    "en": "A culture-war debate is tearing through the country. Your base wants a hard line; the centre is watching."
  },
  "choices": [
    { "label": { "fr": "Donner à la base ce qu'elle attend", "en": "Give the base what it wants" },
      "effects": { "reseau": 2, "notoriete": 1, "reputation": -1, "standing": 12, "popularity": -8, "strike": "radical" },
      "result": { "fr": "Ovation en interne, éditoriaux au vitriol. Chacun son public.",
                  "en": "A standing ovation inside, scathing editorials outside. Each to their audience." } },
    { "label": { "fr": "Tenir une ligne modérée", "en": "Hold a moderate line" },
      "effects": { "reputation": 1, "reseau": -2, "standing": -13, "popularity": 11 },
      "result": { "fr": "Les électeurs du centre notent votre nom. Votre base aussi.",
                  "en": "Centrist voters note your name. So does your base." } },
    { "label": { "fr": "Déplacer le débat sur l'économie", "en": "Shift the debate to the economy" },
      "when": { "personality": ["calculating", "clever"] },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "eloquence": 1, "popularity": 8, "standing": 5 },
        "result": { "fr": "Vous refusez le terrain qu'on vous impose et vous imposez le vôtre.",
                    "en": "You refuse the ground you are handed and impose your own." } },
      "failure": { "effects": { "popularity": -7, "standing": -6 },
        "result": { "fr": "L'esquive se voit. Les deux camps vous accusent de fuir.",
                    "en": "The dodge is obvious. Both camps accuse you of running away." } } }
  ]
},

{
  "id": "cordon_sanitaire",
  "weight": 5,
  "when": { "party": ["identitarians"] },
  "tag": { "fr": "Médias", "en": "Media" },
  "text": {
    "fr": "Une chaîne annule votre invitation sous la pression. Le mot « censure » est déjà dans toutes les bouches de votre camp.",
    "en": "A channel cancels your appearance under pressure. The word “censorship” is already on every lip in your camp."
  },
  "choices": [
    { "label": { "fr": "Faire de l'annulation un étendard", "en": "Turn the cancellation into a banner" },
      "effects": { "notoriete": 2, "reputation": -1, "standing": 11, "popularity": -3, "strike": "radical" },
      "result": { "fr": "La vidéo de votre réaction dépasse l'audience de l'émission.",
                  "en": "The video of your reaction outdraws the show itself." } },
    { "label": { "fr": "Répondre par une longue interview écrite", "en": "Answer with a long written interview" },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": 9, "standing": -5 },
      "result": { "fr": "Le texte est repris, discuté, découpé. Moins fort, plus durable.",
                  "en": "The piece is quoted, debated, dissected. Quieter, but it lasts." } },
    { "label": { "fr": "Créer votre propre média", "en": "Launch your own outlet" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -220000, "notoriete": 3, "standing": 12, "popularity": -2 },
      "result": { "fr": "Studio, plateau, équipe. Vous n'aurez plus jamais besoin qu'on vous invite.",
                  "en": "A studio, a set, a team. You will never need an invitation again." } },
    { "label": { "fr": "Saisir le régulateur", "en": "Take it to the broadcasting regulator" },
      "when": { "background": ["law"] },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "stat": { "notoriete": { "min": 12 } } }, "value": 0.2 } ] },
      "success": { "effects": { "reputation": 2, "notoriete": 1, "popularity": 7, "standing": 8 },
        "result": { "fr": "Le régulateur vous donne raison. La chaîne doit vous réinviter.",
                    "en": "The regulator rules in your favour. The channel has to invite you back." } },
      "failure": { "effects": { "popularity": -3, "standing": 3 },
        "result": { "fr": "Le recours est rejeté. Votre camp y voit une preuve de plus.",
                    "en": "The complaint is dismissed. Your camp sees it as further proof." } } }
  ]
},

{
  "id": "militant_encombrant",
  "weight": 5,
  "when": { "party": ["identitarians", "radical_left"] },
  "tag": { "fr": "Encombrant", "en": "An awkward member" },
  "text": {
    "fr": "Un cadre de votre fédération tient des propos qui feront la une demain. Il a beaucoup d'amis dans le parti.",
    "en": "A regional official says something that will be front-page news tomorrow. He has many friends in the party."
  },
  "choices": [
    { "label": { "fr": "L'exclure immédiatement", "en": "Expel him immediately" },
      "effects": { "reputation": 2, "popularity": 10, "standing": -13, "reseau": -1 },
      "result": { "fr": "La fermeté est saluée dehors. Dedans, on parle de purge.",
                  "en": "The firmness is praised outside. Inside, they call it a purge." } },
    { "label": { "fr": "Minimiser l'affaire", "en": "Play it down" },
      "effects": { "standing": 9, "popularity": -12, "reputation": -1, "strike": "casserole" },
      "result": { "fr": "« Une phrase malheureuse. » Le parti vous remercie, le pays note.",
                  "en": "“An unfortunate turn of phrase.” The party thanks you; the country notices." } },
    { "label": { "fr": "Le convaincre de se retirer lui-même", "en": "Persuade him to step aside himself" },
      "when": { "personality": ["charming", "calculating"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "reputation": 1, "popularity": 6, "standing": 5 },
        "result": { "fr": "Il annonce son retrait « pour raisons personnelles ». Tout le monde a gagné.",
                    "en": "He announces his withdrawal “for personal reasons”. Everyone wins." } },
      "failure": { "effects": { "standing": -9, "popularity": -6 },
        "result": { "fr": "Il refuse et raconte votre visite. Vous passez pour un manipulateur.",
                    "en": "He refuses and describes your visit. You look like a manipulator." } } }
  ]
},

/* ==========================================================================
   11. SITUATIONS PARTICULIÈRES
   ========================================================================== */

{
  "id": "chute_libre",
  "weight": 3,
  "when": { "maxPopularity": 34, "position": ["maire", "depute", "ministre", "chef"] },
  "tag": { "fr": "Traversée du désert", "en": "In the wilderness" },
  "text": {
    "fr": "Les sondages sont catastrophiques. Vos propres amis évitent de se faire photographier avec vous.",
    "en": "The polls are catastrophic. Your own friends avoid being photographed with you."
  },
  "choices": [
    { "label": { "fr": "Un coup d'éclat, quitte à tout risquer", "en": "A dramatic gesture, whatever the risk" },
      "roll": { "stat": "charisme", "base": 14, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 18, "standing": -5 },
        "result": { "fr": "Le pari fonctionne. On reparle de vous, autrement.",
                    "en": "The gamble works. People talk about you again, differently." } },
      "failure": { "effects": { "notoriete": 1, "popularity": -8, "standing": -10, "reputation": -1 },
        "result": { "fr": "Le coup tombe à plat et confirme ce que tout le monde pensait.",
                    "en": "The gesture falls flat and confirms what everyone already thought." } } },
    { "label": { "fr": "Se faire oublier et travailler", "en": "Go quiet and work" },
      "effects": { "energie": 1, "sangfroid": 1, "standing": 8, "popularity": -3 },
      "result": { "fr": "Six mois de silence et de dossiers. Les tempêtes finissent par passer.",
                  "en": "Six months of silence and paperwork. Storms do pass." } },
    { "label": { "fr": "Changer toute votre communication", "en": "Change your entire communications team" },
      "when": { "minMoney": 80000 },
      "effects": { "money": -60000, "popularity": 6, "notoriete": 1, "reseau": -1, "standing": -2 },
      "result": { "fr": "Nouveau logo, nouvelle police, nouvelles lunettes. Les sondages remontent un peu, ce qui est vexant.",
                  "en": "New logo, new typeface, new glasses. The polls tick up a little, which is humiliating." } }
  ]
},

{
  "id": "favori",
  "when": { "minPopularity": 70 },
  "tag": { "fr": "Favori", "en": "The favourite" },
  "text": {
    "fr": "Tous les sondages vous donnent gagnant. C'est le moment où l'on commence à vous détester.",
    "en": "Every poll has you winning. This is the moment when people start to dislike you."
  },
  "choices": [
    { "label": { "fr": "Rester humble en public", "en": "Stay humble in public" },
      "effects": { "reputation": 1, "sangfroid": 1, "popularity": 3, "standing": -4 },
      "result": { "fr": "« Rien n'est joué. » La formule est fausse et indispensable.",
                  "en": "“Nothing is decided yet.” The line is false and indispensable." } },
    { "label": { "fr": "Occuper le terrain comme un vainqueur", "en": "Act like the winner" },
      "effects": { "notoriete": 1, "popularity": -8, "standing": 8 },
      "result": { "fr": "L'assurance impressionne les cadres et exaspère les électeurs.",
                  "en": "The confidence impresses the officials and irritates the voters." } },
    { "label": { "fr": "Composer votre gouvernement à l'avance", "en": "Draw up your government in advance" },
      "effects": { "reseau": 2, "standing": 9, "popularity": -7, "reputation": -1 },
      "result": { "fr": "La liste circule avant le vote. Ceux qui n'y sont pas s'en souviendront plus longtemps que ceux qui y sont.",
                  "en": "The list circulates before the vote. Those left off it will remember longer than those on it." } }
  ]
},

{
  "id": "fortune_visible",
  "when": { "minMoney": 1500000 },
  "tag": { "fr": "Fortune", "en": "Wealth" },
  "text": {
    "fr": "Votre déclaration de patrimoine est publiée. Le chiffre circule plus vite que n'importe laquelle de vos idées.",
    "en": "Your declaration of assets is published. The number travels faster than any of your ideas."
  },
  "choices": [
    { "label": { "fr": "Assumer votre réussite", "en": "Own your success" },
      "effects": { "sangfroid": 1, "standing": 8, "popularity": -9 },
      "result": { "fr": "« Je n'ai pas à m'excuser. » C'est vrai, et ça ne s'entend pas bien.",
                  "en": "“I have nothing to apologise for.” True, and it does not sound good." } },
    { "label": { "fr": "Reverser une part à une fondation", "en": "Give a share to a foundation" },
      "effects": { "money": -350000, "reputation": 2, "popularity": 12, "standing": -5 },
      "result": { "fr": "Le geste est jugé sincère par les uns, calculé par les autres. Il marche.",
                  "en": "Some call the gesture sincere, others calculated. It works." } },
    { "label": { "fr": "Expliquer que vous avez travaillé pour ça", "en": "Explain that you worked for it" },
      "effects": { "popularity": -4, "standing": 4, "charisme": 1, "reputation": -1 },
      "result": { "fr": "La phrase « je ne me suis pas levé tôt pour rien » restera. On vous la ressortira à chaque déclaration de patrimoine.",
                  "en": "The line “I did not get up early for nothing” will stick. It will come back at every asset declaration." } }
  ]
},

{
  "id": "ruine",
  "when": { "maxMoney": 25000 },
  "tag": { "fr": "Argent", "en": "Money" },
  "text": {
    "fr": "Votre compte est vide et la campagne coûte. Votre banquier a cessé de rappeler.",
    "en": "Your account is empty and campaigning costs money. Your bank manager has stopped calling back."
  },
  "choices": [
    { "label": { "fr": "Emprunter à un proche fortuné", "en": "Borrow from a wealthy friend" },
      "effects": { "money": 120000, "standing": 2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Le prêt est amical, sans papier et sans intérêt. C'est exactement le problème.",
                  "en": "The loan is friendly, undocumented and interest-free. That is exactly the problem." } },
    { "label": { "fr": "Faire campagne sans un sou", "en": "Campaign without a penny" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "energie": -2, "reputation": 2, "popularity": 6, "standing": -4 },
      "result": { "fr": "Tracts photocopiés et salles municipales. On vous trouve authentique, et fauché.",
                  "en": "Photocopied leaflets and municipal halls. People find you authentic, and broke." } },
    { "label": { "fr": "Prendre une place dans un conseil d'administration", "en": "Take a seat on a company board" },
      "effects": { "money": 90000, "reseau": 2, "reputation": -2, "popularity": -6, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Quatre réunions par an, un jeton de présence confortable et un conflit d'intérêts que personne ne relèvera avant longtemps.",
                  "en": "Four meetings a year, a comfortable attendance fee and a conflict of interest nobody will notice for a long time." } }
  ]
},

{
  "id": "origine_reprochee",
  "weight": 5,
  "when": { "origin": ["bourgeois", "dynasty"], "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Origines", "en": "Origins" },
  "text": {
    "fr": "En meeting, un homme vous lance que vous n'avez jamais travaillé de vos mains. La salle attend votre réponse.",
    "en": "At a rally, a man tells you that you have never worked with your hands. The room waits for your answer."
  },
  "choices": [
    { "label": { "fr": "Reconnaître le privilège", "en": "Acknowledge the privilege" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "reputation": 2, "popularity": 12 },
        "result": { "fr": "« Vous avez raison. » Le silence puis les applaudissements font le tour du pays.",
                    "en": "“You are right.” The silence, then the applause, travels the country." } },
      "failure": { "effects": { "popularity": -8, "reputation": -1 },
        "result": { "fr": "Votre humilité sonne apprise. On vous trouve encore plus loin.",
                    "en": "Your humility sounds rehearsed. You seem even further away." } } },
    { "label": { "fr": "Défendre votre parcours", "en": "Defend your record" },
      "effects": { "eloquence": 1, "standing": 9, "popularity": -7 },
      "result": { "fr": "Vous récitez votre CV. Personne n'avait posé cette question.",
                  "en": "You recite your CV. Nobody had asked that question." } },
    { "label": { "fr": "Passer la soirée au bar avec lui", "en": "Spend the evening at the bar with him" },
      "effects": { "popularity": 8, "energie": -2, "charisme": 1, "standing": -3 },
      "result": { "fr": "Deux heures de discussion et trois tournées. Il ne votera pas pour vous, mais il le dira à trente personnes.",
                  "en": "Two hours of talking and three rounds. He will not vote for you, but he will tell thirty people about it." } }
  ]
},

{
  "id": "expertise_metier",
  "weight": 5,
  "when": { "background": ["academia", "civil", "law"], "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Expertise", "en": "Expertise" },
  "text": {
    "fr": "Une crise technique éclate dans votre domaine d'origine. Vous êtes le seul du plateau à comprendre le dossier.",
    "en": "A technical crisis erupts in your original field. You are the only one on the panel who understands the file."
  },
  "choices": [
    { "label": { "fr": "Expliquer sérieusement", "en": "Explain it properly" },
      "effects": { "credibilite": +2, "eloquence": 1, "reputation": 2, "popularity": 9, "standing": 6, "energie": -1 },
      "result": { "fr": "Dix minutes de pédagogie. La séquence tourne pendant des jours.",
                  "en": "Ten minutes of real explanation. The clip circulates for days." } },
    { "label": { "fr": "Simplifier à l'extrême", "en": "Simplify brutally" },
      "effects": { "credibilite": -1, "notoriete": 2, "reputation": -1, "popularity": 5 },
      "result": { "fr": "La formule choc est reprise partout, y compris par ceux qui vous citent mal.",
                  "en": "The soundbite is repeated everywhere, including by those who misquote you." } },
    { "label": { "fr": "Publier une note technique détaillée", "en": "Publish a detailed technical note" },
      "when": { "background": ["academia", "civil"] },
      "effects": { "credibilite": +3, "eloquence": 1, "reputation": 2, "standing": 8, "popularity": -3 },
      "result": { "fr": "Quinze pages que tous les journalistes citent sans les avoir lues.",
                  "en": "Fifteen pages every journalist quotes without having read them." } },
    { "label": { "fr": "Proposer votre expertise au gouvernement", "en": "Offer your expertise to the government" },
      "when": { "personality": ["clever"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": +2, "reseau": 2, "reputation": 2, "standing": 9, "popularity": 5 },
        "result": { "fr": "Ils acceptent. Vous êtes désormais celui qu'on appelle quand c'est grave.",
                    "en": "They accept. You are now the person they call when it is serious." } },
      "failure": { "effects": { "credibilite": -1, "standing": -7, "popularity": -3 },
        "result": { "fr": "Ils refusent poliment et votre camp vous reproche d'avoir proposé.",
                    "en": "They decline politely and your own side resents you for offering." } } }
  ]
},

{
  "id": "provocation_naturelle",
  "weight": 5,
  "when": { "personality": ["provocative"] },
  "tag": { "fr": "Tempérament", "en": "Temperament" },
  "text": {
    "fr": "On vous tend un micro après une décision impopulaire du gouvernement. Vous savez déjà ce que vous allez dire.",
    "en": "A microphone is pushed at you after an unpopular government decision. You already know what you will say."
  },
  "choices": [
    { "label": { "fr": "Lâcher la phrase qui fâche", "en": "Say the line that will hurt" },
      "effects": { "notoriete": 3, "reputation": -2, "popularity": 13, "standing": -9 },
      "result": { "fr": "Trois jours de polémique et votre nom dans toutes les bouches.",
                  "en": "Three days of outrage and your name in every mouth." } },
    { "label": { "fr": "Vous retenir, pour une fois", "en": "Hold back, for once" },
      "effects": { "sangfroid": 2, "standing": 8, "popularity": -4, "reputation": 1 },
      "result": { "fr": "Vous vous surprenez vous-même. Vos conseillers respirent.",
                  "en": "You surprise yourself. Your advisers breathe out." } },
    { "label": { "fr": "Lâcher la phrase, puis s'excuser à moitié", "en": "Say it, then half-apologise" },
      "effects": { "notoriete": 2, "popularity": 5, "standing": -3, "reputation": -1, "strike": "menteur" },
      "result": { "fr": "Vous regrettez « la forme, pas le fond ». Les deux camps y trouvent leur compte, ce qui est le but.",
                  "en": "You regret “the wording, not the substance”. Both sides get what they want, which is the point." } }
  ]
},

{
  "id": "usure_pouvoir",
  "when": { "position": ["chef"], "minTurn": 24 },
  "tag": { "fr": "Usure", "en": "Wear and tear" },
  "text": {
    "fr": "Vous dirigez le parti depuis longtemps. Les mêmes réunions, les mêmes visages, les mêmes phrases.",
    "en": "You have led the party for a long time. The same meetings, the same faces, the same sentences."
  },
  "choices": [
    { "label": { "fr": "Renouveler tout l'état-major", "en": "Replace the entire leadership team" },
      "roll": { "chance": 0.55 },
      "success": { "effects": { "reseau": 1, "energie": 1, "standing": 10, "popularity": 7 },
        "result": { "fr": "Le sang neuf redonne un souffle. On reparle de vous au présent.",
                    "en": "The new blood gives you air. People talk about you in the present tense again." } },
      "failure": { "effects": { "reseau": -2, "standing": -16, "popularity": -5 },
        "result": { "fr": "Les évincés ne partent pas. Ils s'organisent.",
                    "en": "Those pushed out do not leave. They organise." } } },
    { "label": { "fr": "Ne rien changer", "en": "Change nothing" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "standing": 7, "popularity": -4, "energie": -1 },
      "result": { "fr": "La maison tourne. Elle tourne un peu à vide.",
                  "en": "The machine runs. It runs a little empty." } },
    { "label": { "fr": "Un remaniement cosmétique", "en": "A cosmetic reshuffle" },
      "effects": { "standing": 4, "popularity": -3, "reseau": 1, "reputation": -1, "energie": -1 },
      "result": { "fr": "Trois postes échangés, deux communiqués et un séminaire. Rien n'a changé, tout le monde a l'air occupé.",
                  "en": "Three jobs swapped, two press releases and an away day. Nothing has changed and everyone looks busy." } }
  ]
},

{
  "id": "sondage",
  "when": { "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "Sondage", "en": "Polling" },
  "text": {
    "fr": "Un institut vous teste pour la première fois. Votre cote de confiance est meilleure que prévu.",
    "en": "A pollster tests your name for the first time. Your approval is better than expected."
  },
  "choices": [
    { "label": { "fr": "Faire circuler le chiffre", "en": "Circulate the number" },
      "effects": { "notoriete": 1, "reseau": 1, "popularity": 8, "standing": -4, "reputation": -1 },
      "result": { "fr": "Le chiffre arrive aux bonnes oreilles. On commence à parler de vous.",
                  "en": "The number reaches the right ears. People are starting to talk." } },
    { "label": { "fr": "Ne rien commenter", "en": "Say nothing" },
      "effects": { "sangfroid": 1, "standing": 6, "notoriete": -1, "popularity": -3 },
      "result": { "fr": "Les sondages passent. Vous préférez qu'on vous juge sur la durée.",
                  "en": "Polls come and go. You would rather be judged over time." } },
    { "label": { "fr": "Faire fuiter un sondage encore meilleur", "en": "Leak an even better poll" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "popularity": 7, "standing": 6 },
        "result": { "fr": "Le second chiffre écrase le premier. Personne ne demande d'où il sort.",
                    "en": "The second number buries the first. Nobody asks where it came from." } },
      "failure": { "effects": { "reputation": -2, "standing": -8 },
        "result": { "fr": "L'institut dément l'avoir produit. La manipulation vous colle à la peau.",
                    "en": "The pollster denies producing it. The manipulation sticks to you." } } },
    { "label": { "fr": "Décortiquer les sous-jacents", "en": "Dig into the internals" },
      "when": { "personality": ["clever"] },
      "effects": { "eloquence": 1, "reseau": 1, "standing": 7, "energie": -1, "popularity": -2 },
      "result": { "fr": "Vous voyez ce que le chiffre cache et vous réorientez votre stratégie en silence.",
                  "en": "You see what the number hides and quietly redirect your strategy." } }
  ]
},

{
  "id": "tribune",
  "tag": { "fr": "Idées", "en": "Ideas" },
  "text": {
    "fr": "Un grand quotidien vous offre une tribune. Le sujet est libre, la place est en dernière page.",
    "en": "A national paper offers you an op-ed. Any subject, back page."
  },
  "choices": [
    { "label": { "fr": "Écrire un texte clivant", "en": "Write something divisive" },
      "roll": { "stat": "eloquence", "base": 14, "dice": 16 },
      "success": { "effects": { "landscape": { "self": -0.8 }, "notoriete": 2, "reseau": -1, "popularity": 10, "standing": -8 },
        "result": { "fr": "Le texte fait réagir jusque dans votre camp. On vous lit, c'est déjà ça.",
                    "en": "The piece angers people, including on your side. At least they read it." } },
      "failure": { "effects": { "notoriete": -1, "popularity": -4, "standing": -4 },
        "result": { "fr": "Le texte tombe dans le vide. Douloureux pour l'ego.",
                    "en": "The piece lands in silence. Hard on the ego." } } },
    { "label": { "fr": "Rester consensuel", "en": "Play it safe" },
      "effects": { "reputation": 1, "standing": 5, "notoriete": -1, "popularity": -3 },
      "result": { "fr": "Personne ne s'en souviendra, mais personne ne vous en voudra.",
                  "en": "Nobody will remember it, and nobody will hold it against you." } },
    { "label": { "fr": "Une tribune cosignée par des chercheurs", "en": "An op-ed co-signed by academics" },
      "when": { "background": ["academia"] },
      "effects": { "landscape": { "self": 0.6 }, "eloquence": 1, "reputation": 2, "popularity": 6, "standing": 5, "energie": -1 },
      "result": { "fr": "Quarante signatures universitaires. Le texte devient une référence citée pendant des années.",
                  "en": "Forty academic signatures. The piece becomes a reference cited for years." } },
    { "label": { "fr": "Écrire sur votre parti lui-même", "en": "Write about your own party" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "self": -1.5 }, "reputation": 2, "notoriete": 1, "popularity": 8, "standing": -13 },
      "result": { "fr": "Vous décrivez ses renoncements sans ménagement. Le pays applaudit, la direction non.",
                  "en": "You describe its retreats without mercy. The country applauds; the leadership does not." } }
  ]
},

{
  "id": "vote_difficile",
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Assemblée", "en": "The chamber" },
  "text": {
    "fr": "Votre groupe soutient un texte que votre circonscription déteste. La consigne de vote est claire.",
    "en": "Your group backs a bill your constituents hate. The whip is clear."
  },
  "choices": [
    { "label": { "fr": "Voter avec le groupe", "en": "Vote with the group" },
      "effects": { "reseau": 1, "reputation": -1, "popularity": -12, "standing": 15 },
      "result": { "fr": "L'appareil s'en souviendra. Vos électeurs aussi.",
                  "en": "The machine will remember. So will your voters." } },
    { "label": { "fr": "Voter contre, en conscience", "en": "Vote your conscience" },
      "effects": { "reputation": 2, "reseau": -2, "popularity": 14, "standing": -18 },
      "result": { "fr": "On vous traite de dissident. Sur les marchés, on vous serre la main.",
                  "en": "They call you a rebel. At the market, people shake your hand." } },
    { "label": { "fr": "Faire changer la consigne de vote", "en": "Get the whip changed" },
      "when": { "position": ["chef"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05, "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "popularity": 9, "standing": 12 },
        "result": { "fr": "Le groupe recule. Vous n'avez rien renié et vous avez tenu la maison.",
                    "en": "The group backs down. You gave up nothing and you held the house." } },
      "failure": { "effects": { "standing": -13, "reputation": -1 },
        "result": { "fr": "Le groupe vous désavoue. Diriger sans être suivi, c'est le début de la fin.",
                    "en": "The group overrules you. Leading without being followed is the beginning of the end." } } },
    { "label": { "fr": "Voter contre et l'expliquer au groupe", "en": "Vote against and explain it to the group" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "eloquence": 1, "popularity": 12, "standing": -10 },
      "result": { "fr": "Vous parlez une heure devant vos collègues. Trois vous suivent, les autres vous respectent.",
                  "en": "You speak for an hour to your colleagues. Three follow you; the rest respect you." } }
  ]
},

{
  "id": "livre",
  "when": { "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Notoriété", "en": "Profile" },
  "text": {
    "fr": "Un grand éditeur vous propose d'écrire un livre. Titre suggéré : votre nom, en gros caractères.",
    "en": "A major publisher wants you to write a book. Suggested title: your name, in large print."
  },
  "choices": [
    { "label": { "fr": "Écrire le livre", "en": "Write the book" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "money": 40000, "notoriete": 1, "energie": -2, "popularity": 8, "standing": 3 },
      "result": { "fr": "Le livre se vend correctement. Il traîne sur les bonnes tables basses.",
                  "en": "The book sells decently. It sits on the right coffee tables." } },
    { "label": { "fr": "Pas le temps", "en": "No time" },
      "effects": { "energie": 1, "popularity": -3 },
      "result": { "fr": "Vous gardez vos soirées. Le livre attendra une défaite.",
                  "en": "You keep your evenings. The book can wait for a defeat." } },
    { "label": { "fr": "Écrire un vrai essai", "en": "Write a serious essay" },
      "when": { "background": ["academia", "journalism"] },
      "effects": { "money": 20000, "eloquence": 1, "reputation": 2, "energie": -1, "popularity": 5, "standing": 6 },
      "result": { "fr": "Trois cents pages qui tiennent debout. Il se vend peu et se cite beaucoup.",
                  "en": "Three hundred pages that hold together. It sells little and is quoted a lot." } },
    { "label": { "fr": "Le faire écrire par quelqu'un d'autre", "en": "Have someone else write it" },
      "when": { "minMoney": 100000 },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.15 } ] },
      "success": { "effects": { "money": 55000, "notoriete": 2, "popularity": 7 },
        "result": { "fr": "Le livre sort à temps, bien écrit, et personne ne sait par qui.",
                    "en": "The book comes out on time, well written, and nobody knows by whom." } },
      "failure": { "effects": { "reputation": -3, "popularity": -9, "standing": -6 },
        "result": { "fr": "Le nègre parle à la presse. L'humiliation dure une semaine entière.",
                    "en": "The ghostwriter talks to the press. The humiliation lasts a full week." } } }
  ]
},

{
  "id": "crise_locale",
  "when": { "position": ["maire", "conseiller"] },
  "tag": { "fr": "Terrain", "en": "On the ground" },
  "text": {
    "fr": "Une crue soudaine touche la commune. Des familles sont relogées dans un gymnase et les caméras arrivent.",
    "en": "A flash flood hits the town. Families are sheltering in a gym and the cameras are on their way."
  },
  "choices": [
    { "label": { "fr": "Passer trois nuits sur le terrain", "en": "Spend three nights on the ground" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reputation": 2, "notoriete": 1, "energie": -2, "popularity": 16, "standing": 2 },
      "result": { "fr": "On vous a vu porter des lits de camp. Ça ne s'oublie pas ici.",
                  "en": "People saw you carrying camp beds. That is not forgotten around here." } },
    { "label": { "fr": "Coordonner depuis la mairie", "en": "Coordinate from the town hall" },
      "effects": { "sangfroid": 1, "reputation": -1, "popularity": -7, "standing": 5 },
      "result": { "fr": "La gestion est propre, mais une photo de votre bureau vide circule.",
                  "en": "The response is clean, but a photo of your empty office is doing the rounds." } },
    { "label": { "fr": "Actionner vos contacts en préfecture", "en": "Call in your contacts at the prefecture" },
      "when": { "background": ["civil"] },
      "effects": { "reseau": -1, "reputation": 1, "popularity": 11, "standing": 8 },
      "result": { "fr": "Les moyens de l'État arrivent en douze heures au lieu de trois jours.",
                  "en": "State resources arrive in twelve hours instead of three days." } },
    { "label": { "fr": "Débloquer un fonds sur vos deniers", "en": "Open a fund from your own money" },
      "when": { "minMoney": 200000 },
      "effects": { "money": -120000, "reputation": 2, "popularity": 15, "standing": -3 },
      "result": { "fr": "Les premiers chèques partent avant même les assurances. On s'en souviendra longtemps.",
                  "en": "The first cheques go out before the insurers move. It will be remembered." } }
  ]
},

{
  "id": "menace",
  "when": { "stat": { "notoriete": { "min": 12 } } },
  "tag": { "fr": "Sécurité", "en": "Security" },
  "text": {
    "fr": "Des menaces précises visent votre domicile. La police propose une protection permanente, très visible.",
    "en": "Specific threats have been made against your home. The police offer permanent, highly visible protection."
  },
  "choices": [
    { "label": { "fr": "Accepter la protection", "en": "Accept the protection" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "sangfroid": 1, "energie": -1, "popularity": 5, "standing": 6 },
      "result": { "fr": "Deux voitures vous suivent partout. Votre vie devient un dispositif.",
                  "en": "Two cars follow you everywhere. Your life becomes a security operation." } },
    { "label": { "fr": "Refuser et continuer normalement", "en": "Refuse and carry on" },
      "effects": { "strike": "intrepide", "reputation": 1, "notoriete": 1, "popularity": 7, "sangfroid": -2, "energie": -1 },
      "result": { "fr": "Le courage est remarqué. Votre famille, elle, ne dort plus.",
                  "en": "The courage is noticed. Your family stops sleeping." } },
    { "label": { "fr": "En faire un sujet politique", "en": "Make it a political subject" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 3, "popularity": 7, "standing": -6, "sangfroid": -1 },
      "result": { "fr": "Vous lisez les menaces en direct à la télévision. Le pays est partagé.",
                  "en": "You read the threats out live on television. The country is split." } },
    { "label": { "fr": "Payer une protection privée discrète", "en": "Pay for discreet private security" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -90000, "sangfroid": 1, "energie": 1 },
      "result": { "fr": "Deux hommes que personne ne remarque. Votre famille dort, le pays ne sait rien.",
                  "en": "Two men nobody notices. Your family sleeps; the country knows nothing." } }
  ]
}

,

/* ==========================================================================
   12. GRANDES DÉCISIONS — événements à choix multiples
   ==========================================================================
   Ces événements offrent plus de deux voies, et certaines ne s'ouvrent que
   si vous êtes la bonne personne au bon moment. Le losange dans l'interface
   signale une option débloquée par votre situation.
   ========================================================================== */

{
  "id": "crise_nationale",
  "weight": 3,
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Crise nationale", "en": "National crisis" },
  "text": {
    "fr": "Une catastrophe industrielle fait douze morts. Le gouvernement est muet et le pays cherche quelqu'un à écouter.",
    "en": "An industrial disaster kills twelve people. The government is silent and the country is looking for someone to listen to."
  },
  "choices": [
    { "label": { "fr": "Se rendre sur place immédiatement", "en": "Go there immediately" },
      "roll": { "base": 19, "stat": "sangfroid",
                "plus": { "charisme": 0.35, "popularity": 0.03 },
                "bonus": [ { "when": { "stat": { "energie": { "min": 12 } } }, "value": 1.5 },
                           { "when": { "maxStanding": 35 }, "value": -1.5 } ], "dice": 16 },
      "success": { "effects": { "credibilite": +2, "notoriete": 2, "reputation": 2, "energie": -1, "popularity": 17, "standing": 4 },
        "result": { "fr": "Vous êtes sur les lieux avant les ministres. Les images vous installent.",
                    "en": "You are on site before the ministers. The pictures make you." } },
      "failure": { "effects": { "credibilite": -2, "energie": -1, "popularity": -7, "reputation": -1 },
        "result": { "fr": "On vous reproche le déplacement, jugé opportuniste. Vous gênez les secours.",
                    "en": "The visit is called opportunistic. You are in the rescuers' way." } } },
    { "label": { "fr": "Exiger une commission d'enquête", "en": "Demand a commission of inquiry" },
      "effects": { "credibilite": +2, "eloquence": 1, "standing": 9, "popularity": -5, "energie": -1 },
      "result": { "fr": "La procédure est lente et sérieuse. Elle portera votre nom dans deux ans.",
                  "en": "The procedure is slow and serious. It will carry your name in two years." } },
    { "label": { "fr": "Accuser nommément les responsables", "en": "Name and shame those responsible" },
      "roll": { "base": 18, "stat": "notoriete",
                "plus": { "charisme": 0.45 },
                "bonus": [ { "when": { "personality": ["provocative"] }, "value": 2.5 },
                           { "when": { "party": ["radical_left", "identitarians"] }, "value": 1.5 } ], "dice": 16 },
      "success": { "effects": { "credibilite": -1, "notoriete": 3, "popularity": 14, "standing": -8 },
        "result": { "fr": "Vos accusations font la une. On vous poursuit en diffamation, ça vous grandit.",
                    "en": "Your accusations lead the news. You are sued for libel, which only helps." } },
      "failure": { "effects": { "credibilite": -3, "reputation": -2, "popularity": -9, "standing": -10 },
        "result": { "fr": "Vous visez à côté. L'entreprise mise en cause n'était pas la bonne.",
                    "en": "You aim badly. The company you accused was not the one at fault." } } },
    { "label": { "fr": "Mobiliser votre réseau industriel", "en": "Mobilise your industry contacts" },
      "when": { "background": ["business"] },
      "effects": { "reseau": 1, "reputation": -1, "popularity": 8, "standing": 7 },
      "result": { "fr": "Vous obtenez en trois jours un fonds d'indemnisation que personne n'espérait.",
                  "en": "In three days you secure a compensation fund nobody expected." } },
    { "label": { "fr": "Financer vous-même l'aide aux familles", "en": "Fund support for the families yourself" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -200000, "reputation": 3, "popularity": 15, "standing": -4 },
      "result": { "fr": "Le geste est immense et suspect. Les familles, elles, s'en moquent.",
                  "en": "The gesture is enormous and suspicious. The families do not care." } }
  ]
},

{
  "id": "poste_ministre",
  "once": true,
  "when": { "ruling": false, "position": ["depute", "chef"], "minStanding": 50 },
  "tag": { "fr": "Proposition", "en": "An offer" },
  "text": {
    "fr": "Le gouvernement adverse vous propose un ministère. Votre parti est dans l'opposition et le fera savoir : accepter, c'est entrer au gouvernement contre les vôtres, et ils n'auront pas de mot assez dur. Le poste est réel, le piège aussi.",
    "en": "The opposing government offers you a ministry. Your party is in opposition and will say so loudly: taking it means joining a government against your own side, and they will not be short of words. The job is real; so is the trap."
  },
  "choices": [
    { "label": { "fr": "Accepter, et rompre avec votre camp", "en": "Accept, and break with your own side" },
      "effects": { "office": "ministre", "money": 60000, "reseau": 2, "notoriete": 2, "reputation": -2, "popularity": 11, "standing": -14, "trait": "renegat" },
      "result": { "fr": "Vous entrez au gouvernement. Votre parti parle de trahison, le pays de courage. Vous tiendrez le poste tant que ce président tiendra le sien, pas un jour de plus.",
                  "en": "You join the government. Your party calls it betrayal; the country calls it courage. You will hold the job for exactly as long as this president holds theirs, and not a day longer." } },
    { "label": { "fr": "Refuser publiquement et bruyamment", "en": "Refuse loudly and publicly" },
      "effects": { "strike": "intrepide", "reputation": 2, "notoriete": 1, "standing": 10, "popularity": -5, "money": -20000 },
      "result": { "fr": "Votre refus devient un argument de campagne pour les dix ans à venir.",
                  "en": "Your refusal becomes a campaign line for the next ten years." } },
    { "label": { "fr": "Négocier un soutien sans portefeuille", "en": "Negotiate support without a portfolio" },
      "roll": { "base": 19, "stat": "reseau",
                "plus": { "sangfroid": 0.35, "standing": 0.035 },
                "bonus": [ { "when": { "party": ["centrists", "socdem"] }, "value": 2 },
                           { "when": { "party": ["radical_left", "identitarians"] }, "value": -3 } ], "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 10, "popularity": 5 },
        "result": { "fr": "Vous obtenez trois lois et aucune responsabilité. Le meilleur des marchés.",
                    "en": "You get three laws and no responsibility. The best of deals." } },
      "failure": { "effects": { "standing": -12, "reputation": -1, "popularity": -4 },
        "result": { "fr": "La négociation fuite avant d'aboutir. Vous passez pour vénal et incompétent.",
                    "en": "The talks leak before they conclude. You look venal and incompetent." } } },
    { "label": { "fr": "Exiger l'Intérieur, et rompre avec votre camp", "en": "Demand the Interior Ministry, and break with your own side" },
      "when": { "background": ["civil", "law"] },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "minStanding": 70 }, "value": 0.25 } ] },
      "success": { "effects": { "office": "ministre", "reseau": 3, "notoriete": 2, "money": 60000, "popularity": 8, "standing": -10, "trait": "renegat" },
        "result": { "fr": "Ils cèdent. Vous héritez du ministère qui fait et défait les carrières.",
                    "en": "They give in. You inherit the ministry that makes and breaks careers." } },
      "failure": { "effects": { "standing": -6, "notoriete": 1 },
        "result": { "fr": "L'exigence les fait rire. Les négociations s'arrêtent là.",
                    "en": "The demand makes them laugh. The talks end there." } } }
  ]
},

{
  "id": "motion_censure",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 8 },
  "tag": { "fr": "Motion de censure", "en": "Vote of no confidence" },
  "text": {
    "fr": "Une motion de censure est déposée. Elle peut faire tomber le gouvernement, ou ridiculiser ses auteurs.",
    "en": "A no-confidence motion has been tabled. It could bring down the government, or humiliate its authors."
  },
  "choices": [
    { "label": { "fr": "Prendre la tête de la fronde", "en": "Lead the charge" },
      "roll": { "base": 20, "stat": "reseau",
                "plus": { "eloquence": 0.4, "standing": 0.04 },
                "bonus": [ { "when": { "position": ["chef"] }, "value": 2.5 },
                           { "when": { "minPopularity": 60 }, "value": 2 } ], "dice": 16 },
      "success": { "effects": { "notoriete": 3, "reseau": 1, "popularity": 16, "standing": 5 },
        "result": { "fr": "La motion passe à quatre voix. Vous avez fait tomber un gouvernement.",
                    "en": "The motion passes by four votes. You have brought down a government." } },
      "failure": { "effects": { "notoriete": 1, "popularity": -10, "standing": -17 },
        "result": { "fr": "La motion s'effondre. On retiendra que vous l'aviez menée.",
                    "en": "The motion collapses. People will remember you led it." } } },
    { "label": { "fr": "Voter sans faire de bruit", "en": "Vote quietly" },
      "effects": { "standing": 7, "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Une voix parmi d'autres. Personne ne vous cherchera après.",
                  "en": "One vote among many. Nobody will come looking for you afterwards." } },
    { "label": { "fr": "S'abstenir et le justifier", "en": "Abstain, and explain why" },
      "effects": { "eloquence": 1, "reputation": -1, "popularity": -6, "standing": 7 },
      "result": { "fr": "Vous expliquez longuement une abstention que personne ne comprend.",
                  "en": "You explain at length an abstention nobody understands." } },
    { "label": { "fr": "Négocier votre voix contre un texte", "en": "Trade your vote for a bill" },
      "when": { "minStanding": 55 },
      "effects": { "reseau": 2, "standing": 9, "reputation": -2, "popularity": -5 },
      "result": { "fr": "Votre abstention achète une loi. Le marchandage se sait, évidemment.",
                  "en": "Your abstention buys a law. The deal becomes known, of course." } }
  ]
},

{
  "id": "primaire_interne",
  "when": { "position": ["depute", "maire", "euro"], "minStanding": 40 },
  "tag": { "fr": "Primaire", "en": "Primary" },
  "text": {
    "fr": "Le parti organise une primaire pour désigner sa tête d'affiche. Quatre candidats sont déjà déclarés.",
    "en": "The party is holding a primary to choose its figurehead. Four candidates have already declared."
  },
  "choices": [
    { "label": { "fr": "Se lancer et faire campagne", "en": "Run and campaign" },
      "roll": { "base": 21, "stat": "reseau",
                "plus": { "charisme": 0.4, "standing": 0.05, "popularity": 0.03 },
                "bonus": [ { "when": { "personality": ["charming", "calculating"] }, "value": 1.5 },
                           { "when": { "flag": { "dirtyMoney": true } }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "notoriete": 2, "standing": 16, "popularity": 10, "energie": -1 },
        "result": { "fr": "Vous l'emportez au second tour. Le parti a désormais un visage : le vôtre.",
                    "en": "You win in the second round. The party now has a face: yours." } },
      "failure": { "effects": { "notoriete": 1, "standing": -10, "energie": -1, "popularity": -4 },
        "result": { "fr": "Éliminé au premier tour. Trois mois de campagne pour finir quatrième.",
                    "en": "Knocked out in the first round. Three months of campaigning to finish fourth." } } },
    { "label": { "fr": "Soutenir le favori", "en": "Back the front-runner" },
      "effects": { "reseau": 1, "standing": 11, "popularity": -2 },
      "result": { "fr": "Vous misez juste et vous encaissez la reconnaissance du vainqueur.",
                  "en": "You back the right horse and collect the winner's gratitude." } },
    { "label": { "fr": "Soutenir l'outsider", "en": "Back the outsider" },
      "roll": { "chance": 0.3, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.15 } ] },
      "success": { "effects": { "reseau": 2, "standing": 18, "reputation": 1 },
        "result": { "fr": "L'outsider gagne contre toute attente. Vous êtes son premier fidèle.",
                    "en": "The outsider wins against all odds. You are his first loyalist." } },
      "failure": { "effects": { "standing": -9, "reseau": -1 },
        "result": { "fr": "Votre poulain fait sept pour cent. On note votre mauvais flair.",
                    "en": "Your candidate gets seven per cent. Your poor instincts are noted." } } },
    { "label": { "fr": "Rester neutre et attendre", "en": "Stay neutral and wait" },
      "effects": { "sangfroid": 1, "standing": -2 },
      "result": { "fr": "Vous ne froissez personne et n'obligez personne. C'est un choix.",
                  "en": "You upset nobody and oblige nobody. It is a choice." } },
    { "label": { "fr": "Financer discrètement deux candidats", "en": "Quietly fund two candidates" },
      "when": { "minMoney": 400000 },
      "effects": { "money": -180000, "reseau": 2, "standing": 13, "reputation": -2 },
      "result": { "fr": "Quel que soit le vainqueur, il vous devra quelque chose. Cynique et efficace.",
                  "en": "Whoever wins will owe you. Cynical and effective." } }
  ]
},

{
  "id": "interview_fleuve",
  "when": { "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Grand entretien", "en": "The long interview" },
  "text": {
    "fr": "Deux heures d'entretien sans montage, en direct. Le format ne pardonne rien.",
    "en": "Two hours of unedited live interview. The format forgives nothing."
  },
  "choices": [
    { "label": { "fr": "Parler du fond, longuement", "en": "Talk substance, at length" },
      "roll": { "base": 18, "stat": "eloquence",
                "plus": { "sangfroid": 0.4 },
                "bonus": [ { "when": { "background": ["academia", "civil"] }, "value": 2.5 },
                           { "when": { "background": ["celebrity"] }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "eloquence": 1, "reputation": 2, "popularity": 12, "standing": 6 },
        "result": { "fr": "Deux heures qui font autorité. On en reparlera pendant des années.",
                    "en": "Two hours that carry authority. People will refer to it for years." } },
      "failure": { "effects": { "popularity": -8, "notoriete": -1 },
        "result": { "fr": "Vous perdez l'audience au bout de vingt minutes. Et le fil au bout d'une heure.",
                    "en": "You lose the audience after twenty minutes. And your thread after an hour." } } },
    { "label": { "fr": "Raconter votre parcours personnel", "en": "Tell your personal story" },
      "effects": { "reputation": 1, "popularity": 9, "standing": -2 },
      "result": { "fr": "L'émotion passe mieux que les idées. C'est ainsi.",
                  "en": "Emotion travels better than ideas. That is how it is." } },
    { "label": { "fr": "Attaquer le gouvernement pendant deux heures", "en": "Attack the government for two hours" },
      "effects": { "notoriete": 2, "reputation": -1, "popularity": 4, "standing": 6 },
      "result": { "fr": "Efficace et fatigant. Votre camp adore, les autres zappent.",
                  "en": "Effective and exhausting. Your camp loves it; everyone else switches over." } },
    { "label": { "fr": "Raconter votre milieu d'origine", "en": "Talk about where you come from" },
      "when": { "origin": ["modest"] },
      "effects": { "reputation": 2, "popularity": 14, "standing": -6 },
      "result": { "fr": "Vous parlez des fins de mois sans pathos. Le pays entend quelque chose de vrai.",
                  "en": "You talk about tight months without self-pity. The country hears something true." } }
  ]
},

{
  "id": "trahison_proche",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 14 },
  "tag": { "fr": "Trahison", "en": "Betrayal" },
  "text": {
    "fr": "Votre directeur de cabinet a transmis vos notes internes à un journal. Il attend votre décision.",
    "en": "Your chief of staff has passed your internal notes to a newspaper. He is waiting for your decision."
  },
  "choices": [
    { "label": { "fr": "Le licencier publiquement", "en": "Fire him publicly" },
      "effects": { "reseau": -1, "sangfroid": 1, "standing": 6, "popularity": 2 },
      "result": { "fr": "L'exemple est fait. Votre équipe travaille désormais la peur au ventre.",
                  "en": "The example is set. Your team now works with fear in their stomachs." } },
    { "label": { "fr": "Le garder et ne rien dire", "en": "Keep him and say nothing" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "stat": { "sangfroid": { "min": 14 } } }, "value": 0.25 } ] },
      "success": { "effects": { "reseau": 2, "standing": 8 },
        "result": { "fr": "Il comprend qu'il vous doit tout. Il ne recommencera jamais.",
                    "en": "He understands he owes you everything. He will never do it again." } },
      "failure": { "effects": { "reseau": -2, "standing": -14, "popularity": -6 },
        "result": { "fr": "Il recommence trois mois plus tard, avec des documents pires.",
                    "en": "He does it again three months later, with worse documents." } } },
    { "label": { "fr": "Le muter dans un placard doré", "en": "Move him to a well-paid nowhere job" },
      "effects": { "reseau": 1, "money": -30000, "standing": 3, "reputation": -1 },
      "result": { "fr": "La solution classique. Elle coûte cher et ne règle rien.",
                  "en": "The classic solution. Expensive, and it settles nothing." } },
    { "label": { "fr": "Retourner la fuite contre son commanditaire", "en": "Turn the leak against whoever ordered it" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 19, "stat": "reseau", "plus": { "sangfroid": 0.35, "standing": 0.035 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 15, "notoriete": 1 },
        "result": { "fr": "Vous remontez la chaîne jusqu'à un rival, et vous le faites savoir.",
                    "en": "You trace the chain back to a rival, and you make sure everyone knows." } },
      "failure": { "effects": { "standing": -8, "reputation": -1 },
        "result": { "fr": "L'enquête interne tourne court et donne le sentiment d'une paranoïa.",
                    "en": "The internal inquiry goes nowhere and looks like paranoia." } } },
    { "label": { "fr": "Le convoquer et lui dire les choses en face", "en": "Call him in and say it to his face" },
      "when": { "trait": ["intrepide"] },
      "effects": { "sangfroid": 2, "reseau": 1, "standing": 9, "reputation": 1, "energie": -1 },
      "result": { "fr": "Vingt minutes seul à seul, sans témoin et sans avocat. Il part de lui-même le lendemain et ne dira jamais un mot de ce qui s'est dit dans ce bureau.",
                  "en": "Twenty minutes alone, no witnesses and no lawyers. He resigns the next morning and will never say a word about what was said in that office." } }
  ]
},

/* ==========================================================================
   12. CE QUE LES TRAITS OUVRENT
   ==========================================================================
   Ces événements ne se déclenchent que pour un personnage marqué. Ils sont
   la contrepartie visible du système : un trait ferme des portes, il doit
   aussi en ouvrir que les autres ne verront jamais.
   ========================================================================== */

{
  "id": "tribune_orateur",
  "weight": 5,
  "when": { "trait": ["orateur"], "position": ["depute", "chef", "maire", "ministre"] },
  "tag": { "fr": "Tribune", "en": "The floor" },
  "text": {
    "fr": "Un débat de censure tourne mal pour votre camp. Le groupe cherche quelqu'un capable de tenir l'hémicycle pendant vingt minutes sans notes.",
    "en": "A censure debate is going badly for your side. The group needs someone who can hold the chamber for twenty minutes without notes."
  },
  "choices": [
    { "label": { "fr": "Monter à la tribune", "en": "Take the floor" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 13, "standing": 6, "energie": -1 },
        "result": { "fr": "Le silence se fait au bout de trois minutes. La séquence tourne en boucle jusqu'au soir.",
                    "en": "The chamber falls silent after three minutes. The clip runs on a loop until nightfall." } },
      "failure": { "effects": { "popularity": -7, "standing": -6, "energie": -1 },
        "result": { "fr": "Vous parlez douze minutes de trop. On retient la fatigue plutôt que les arguments.",
                    "en": "You speak twelve minutes too long. What sticks is the tiredness, not the argument." } } },
    { "label": { "fr": "Laisser quelqu'un d'autre s'y coller", "en": "Let somebody else take it" },
      "effects": { "strike": "lache", "energie": 2, "standing": -5, "popularity": -3, "sangfroid": 1 },
      "result": { "fr": "Un collègue s'en tire honorablement. Le groupe note surtout que vous n'y étiez pas.",
                  "en": "A colleague does a decent job. What the group notices is that you were not there." } },
    { "label": { "fr": "Monter, et transformer ça en meeting", "en": "Take the floor and turn it into a rally" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 3, "popularity": 9, "standing": -8, "energie": -1, "strike": "radical" },
      "result": { "fr": "Le président de séance vous coupe le micro deux fois. La séquence dépasse le million de vues avant minuit.",
                  "en": "The speaker cuts your microphone twice. The clip passes a million views before midnight." } }
  ]
},

{
  "id": "coup_de_fil_appareil",
  "weight": 5,
  "when": { "trait": ["appareil"], "minTurn": 10 },
  "tag": { "fr": "Fédérations", "en": "The branches" },
  "text": {
    "fr": "Trois fédérations menacent de partir avec leur candidat. Vous connaissez les trois secrétaires par leur prénom, et vous savez ce que chacun veut.",
    "en": "Three local branches are threatening to leave with their own candidate. You know all three secretaries by their first name, and you know what each of them wants."
  },
  "choices": [
    { "label": { "fr": "Passer les trois coups de fil", "en": "Make the three phone calls" },
      "effects": { "standing": 12, "reseau": 1, "energie": -2, "popularity": -3 },
      "result": { "fr": "Deux places sur une liste et une promesse de circonscription. Personne ne part.",
                  "en": "Two places on a ticket and a promise of a seat. Nobody leaves." } },
    { "label": { "fr": "Les laisser partir et le dire au pays", "en": "Let them go, and say so publicly" },
      "effects": { "popularity": 11, "standing": -13, "reputation": 2, "notoriete": 1 },
      "result": { "fr": "Vous en faites une question de clarté. Le pays approuve, l'appareil compte les absents.",
                  "en": "You turn it into a question of clarity. The country approves; the machine counts the empty chairs." } },
    { "label": { "fr": "Acheter la paix sur vos deniers", "en": "Buy the peace out of your own pocket" },
      "when": { "minMoney": 200000 },
      "effects": { "money": -150000, "standing": 9, "reseau": 2, "reputation": -1 },
      "result": { "fr": "Des frais de campagne pris en charge, sans reçu qui remonte à vous. Pour l'instant.",
                  "en": "Campaign costs quietly covered, with no receipt leading back to you. For now." } }
  ]
},

{
  "id": "retour_de_flamme",
  "weight": 5,
  "when": { "trait": ["casserole"], "minPopularity": 45 },
  "tag": { "fr": "Vieux dossier", "en": "Old file" },
  "text": {
    "fr": "Un magazine ressort l'affaire en couverture, au moment précis où les sondages vous étaient favorables. La photo choisie date de dix ans.",
    "en": "A magazine puts the old story back on its cover, at the exact moment the polls had turned your way. The photo they chose is ten years old."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point", "en": "Answer point by point" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 4, "reputation": 1, "energie": -1, "untrait": "casserole" },
        "result": { "fr": "Vous sortez les pièces une par une. Le sujet meurt en trois jours, cette fois pour de bon.",
                    "en": "You produce the documents one by one. The story dies in three days, this time for good." } },
      "failure": { "effects": { "popularity": -9, "standing": -6, "energie": -1 },
        "result": { "fr": "Répondre, c'est reconnaître qu'il y a une question. Elle tiendra trois semaines.",
                    "en": "Answering means admitting there is a question. It will run for three weeks." } } },
    { "label": { "fr": "Ne rien dire et laisser passer", "en": "Say nothing and let it pass" },
      "effects": { "strike": "lache", "popularity": -6, "sangfroid": 1, "standing": 2 },
      "result": { "fr": "Le silence coûte quelques points et fait gagner du temps. Le dossier reste dans le tiroir.",
                  "en": "Silence costs a few points and buys time. The file stays in the drawer." } },
    { "label": { "fr": "Attaquer le magazine en diffamation", "en": "Sue the magazine for libel" },
      "when": { "minMoney": 120000 },
      "effects": { "money": -80000, "notoriete": 2, "popularity": -3, "standing": 4 },
      "result": { "fr": "La procédure durera des années. Elle envoie surtout un message aux autres rédactions.",
                  "en": "The case will drag on for years. What it really does is send a message to other newsrooms." } }
  ]
},

/* ==========================================================================
   13. TEMPS MORTS
   ==========================================================================
   Ce sont les seuls événements qui peuvent revenir plusieurs fois dans une
   partie ("repeatable"), et ils ne sortent jamais au tirage ordinaire
   ("weight": 0). Le moteur ne les joue que lorsqu'il n'a plus rien de neuf
   à proposer, en fin de carrière longue. Une politique, ce sont aussi des
   semestres où il ne se passe rien, et où il faut quand même choisir quoi
   faire de son temps.
   ========================================================================== */

{
  "id": "semestre_calme",
  "weight": 0,
  "repeatable": true,
  "tag": { "fr": "Entre deux", "en": "In between" },
  "text": {
    "fr": "Six mois sans échéance, sans crise et sans caméra. Le genre de période où les carrières se préparent ou s'endorment.",
    "en": "Six months with no election, no crisis and no cameras. The kind of stretch where careers get built, or quietly go to sleep."
  },
  "choices": [
    { "label": { "fr": "Tourner les fédérations", "en": "Tour the local branches" },
      "effects": { "standing": 7, "reseau": 1, "energie": -1, "popularity": -4 },
      "result": { "fr": "Des salles de quarante personnes et des dîners qui finissent tard. On vous voit.",
                  "en": "Rooms of forty people and dinners that end late. You are being seen." } },
    { "label": { "fr": "Occuper le terrain médiatique", "en": "Keep the media busy" },
      "effects": { "popularity": 8, "notoriete": 1, "energie": -1, "standing": -5 },
      "result": { "fr": "Trois plateaux, deux matinales. Le pays vous connaît un peu mieux, le parti vous trouve envahissant.",
                  "en": "Three panels, two breakfast shows. The country knows you slightly better; the party finds you everywhere." } },
    { "label": { "fr": "Souffler pour de bon", "en": "Actually rest" },
      "effects": { "energie": 2, "popularity": -4, "standing": -3 },
      "result": { "fr": "Deux semaines sans téléphone. Vous revenez frais dans un paysage qui a bougé sans vous.",
                  "en": "Two weeks without a phone. You come back rested to a landscape that moved on without you." } }
  ]
},

{
  "id": "courrier_permanence",
  "weight": 0,
  "repeatable": true,
  "tag": { "fr": "Permanence", "en": "Constituency office" },
  "text": {
    "fr": "La pile de courrier a doublé depuis le mois dernier. Des dossiers de logement, des pensions bloquées, une école qui ferme.",
    "en": "The pile of letters has doubled since last month. Housing files, blocked pensions, a school closing down."
  },
  "choices": [
    { "label": { "fr": "Traiter les dossiers un par un", "en": "Work through them one by one" },
      "effects": { "reputation": 1, "popularity": 5, "energie": -2 },
      "result": { "fr": "Quatre familles relogées et beaucoup de lettres sans réponse. Le bouche-à-oreille fait le reste.",
                  "en": "Four families rehoused and a lot of letters left unanswered. Word of mouth does the rest." } },
    { "label": { "fr": "Confier la permanence à votre équipe", "en": "Hand the office to your staff" },
      "effects": { "energie": 1, "reseau": 1, "popularity": -3 },
      "result": { "fr": "Vos collaborateurs s'en sortent bien. Les gens remarquent que ce n'était pas vous.",
                  "en": "Your staff handle it well. People notice it was not you." } }
  ]
},

{
  "id": "inauguration",
  "weight": 0,
  "repeatable": true,
  "tag": { "fr": "Agenda", "en": "Diary" },
  "text": {
    "fr": "Une salle des fêtes, un ruban, deux cents personnes et un buffet. Votre attachée de presse vous jure que ce genre de choses finit par compter.",
    "en": "A village hall, a ribbon, two hundred people and a buffet. Your press officer swears this kind of thing adds up in the end."
  },
  "choices": [
    { "label": { "fr": "Rester jusqu'au dernier verre", "en": "Stay until the last glass" },
      "effects": { "popularity": 5, "reseau": 1, "energie": -1 },
      "result": { "fr": "Cent quarante poignées de main et trois dossiers glissés dans votre poche.",
                  "en": "A hundred and forty handshakes and three files slipped into your pocket." } },
    { "label": { "fr": "Couper le ruban et repartir", "en": "Cut the ribbon and leave" },
      "effects": { "energie": 1, "popularity": -3, "standing": 2 },
      "result": { "fr": "Vous êtes ailleurs avant le discours du maire. Cela se remarque, dans un sens comme dans l'autre.",
                  "en": "You are gone before the mayor's speech. People notice, one way or the other." } }
  ]
},

{
  "id": "note_interne",
  "weight": 0,
  "repeatable": true,
  "tag": { "fr": "Appareil", "en": "The machine" },
  "text": {
    "fr": "Une note de six pages circule dans les instances. Elle ne dit rien de précis mais tout le monde y cherche son nom.",
    "en": "A six-page memo is going round the party bodies. It says nothing precise, but everyone is looking for their own name in it."
  },
  "choices": [
    { "label": { "fr": "Y répondre point par point", "en": "Answer it point by point" },
      "effects": { "standing": 5, "eloquence": 1, "energie": -1, "popularity": -5 },
      "result": { "fr": "Votre réponse circule à son tour. On vous trouve pénible et sérieux, dans cet ordre.",
                  "en": "Your reply goes round in turn. They find you tiresome and serious, in that order." } },
    { "label": { "fr": "La laisser mourir toute seule", "en": "Let it die on its own" },
      "effects": { "sangfroid": 1, "energie": 1, "standing": -2 },
      "result": { "fr": "Trois semaines plus tard, personne ne s'en souvient. Sauf ceux qui l'ont écrite.",
                  "en": "Three weeks later nobody remembers it. Except the people who wrote it." } }
  ]
},

/* ==========================================================================
   14. CE QUE VOTRE PASSÉ VOUS RÉCLAME
   ==========================================================================
   Un événement par parcours : le métier qu'on a quitté ne quitte jamais
   personne. L'avocat retrouve ses clients, la journaliste ses confrères, le
   militant ses camarades, et chacun vient réclamer quelque chose au moment
   où l'on préférerait avoir toujours fait de la politique.

   Ces événements ne sortent que pour le parcours concerné : deux personnages
   différents ne doivent pas vivre la même partie.
   ========================================================================== */

{
  "id": "ancien_client",
  "weight": 5,
  "when": { "background": ["law"], "minTurn": 8 },
  "tag": { "fr": "Barreau", "en": "The bar" },
  "text": {
    "fr": "Un ancien client, que vous aviez fait relaxer, dirige aujourd'hui un groupe de BTP. Il aimerait « juste un rendez-vous » avec quelqu'un de votre majorité, et il rappelle en riant que vous connaissez bien son dossier.",
    "en": "A former client you once got acquitted now runs a construction group. He would like “just a meeting” with someone in your majority, and laughingly reminds you that you know his file rather well."
  },
  "choices": [
    { "label": { "fr": "Organiser le rendez-vous", "en": "Set up the meeting" },
      "effects": { "reseau": 2, "standing": 6, "money": 25000, "reputation": -1 },
      "effectsIf": [
        { "when": { "personality": ["principled"] }, "effects": { "reputation": -2, "popularity": -5 } },
        { "when": { "trait": ["intouchable"] }, "effects": { "untrait": "intouchable", "popularity": -6 } }
      ],
      "result": { "fr": "Le déjeuner dure deux heures. Personne n'a rien promis, tout le monde a compris.",
                  "en": "The lunch runs two hours. Nobody promised anything; everybody understood." } },
    { "label": { "fr": "Refuser en invoquant le secret professionnel", "en": "Refuse, citing professional privilege" },
      "effects": { "reputation": 2, "sangfroid": 1, "reseau": -2 },
      "result": { "fr": "Il comprend très bien, et il ne rappellera plus. Vous perdez un ami que vous n'aviez pas choisi.",
                  "en": "He understands perfectly, and will not call again. You lose a friend you never chose." } },
    { "label": { "fr": "Le recevoir et le renvoyer vers l'administration", "en": "See him, then send him to the civil service" },
      "effects": { "reseau": 1, "standing": 2, "energie": -1 },
      "result": { "fr": "Vous lui donnez le nom d'un bureau et le numéro d'un formulaire. C'est un refus, poliment habillé.",
                  "en": "You give him the name of an office and the number of a form. It is a refusal, politely dressed." } },
    { "label": { "fr": "Raconter la scène dans un entretien", "en": "Tell the story in an interview" },
      "when": { "stat": { "notoriete": { "min": 8 } } },
      "effects": { "notoriete": 1, "popularity": 9, "reseau": -3, "standing": -5 },
      "result": { "fr": "Vous ne le nommez pas, mais tout le barreau reconnaît l'anecdote. On vous appellera moins.",
                  "en": "You do not name him, but the whole bar recognises the story. Fewer people will call you now." } }
  ]
},

{
  "id": "ancienne_boite",
  "weight": 5,
  "when": { "background": ["business"], "minTurn": 10 },
  "tag": { "fr": "Anciens associés", "en": "Former partners" },
  "text": {
    "fr": "L'entreprise que vous avez dirigée annonce trois cents suppressions de postes, sur un site que vous aviez ouvert vous-même en promettant qu'il durerait.",
    "en": "The company you used to run announces three hundred job cuts, at a site you opened yourself while promising it would last."
  },
  "choices": [
    { "label": { "fr": "Défendre la décision de vos anciens associés", "en": "Defend your former partners' decision" },
      "effects": { "reseau": 2, "standing": 4, "popularity": -11, "reputation": -1 },
      "result": { "fr": "Vous parlez de compétitivité avec des mots justes. Les images de l'usine tournent en boucle derrière vous.",
                  "en": "You talk about competitiveness in all the right words. Footage of the plant loops behind you." } },
    { "label": { "fr": "Aller devant l'usine avec les salariés", "en": "Stand outside the plant with the workers" },
      "effects": { "popularity": 10, "energie": -2, "reseau": -3, "reputation": 1 },
      "effectsIf": [
        { "when": { "party": ["liberals", "conservatives"] }, "effects": { "standing": -8 } },
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 5 } }
      ],
      "result": { "fr": "On vous rappelle vos anciennes déclarations au mégaphone. Vous restez jusqu'au soir.",
                  "en": "They read your old statements back to you through a megaphone. You stay until dark." } },
    { "label": { "fr": "Négocier discrètement un plan de reprise", "en": "Quietly broker a rescue deal" },
      "roll": { "base": 18, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "popularity": 8, "standing": 6, "energie": -2 },
        "result": { "fr": "Un repreneur sauve la moitié des postes. Vous n'en tirez aucune gloire publique, et c'est mieux ainsi.",
                    "en": "A buyer saves half the jobs. You get no public credit for it, which is just as well." } },
      "failure": { "effects": { "energie": -2, "popularity": -6, "reseau": -1 },
        "result": { "fr": "Les discussions fuitent avant d'aboutir. On vous reproche d'avoir donné de faux espoirs.",
                    "en": "The talks leak before they conclude. You are accused of raising false hopes." } } }
  ]
},

{
  "id": "anciens_confreres",
  "weight": 5,
  "when": { "background": ["journalism"], "minTurn": 8 },
  "tag": { "fr": "Rédaction", "en": "The newsroom" },
  "text": {
    "fr": "Votre ancienne rédaction prépare une enquête sur votre parti. Une consœur avec qui vous avez partagé un bureau pendant six ans vous demande un entretien, et elle a déjà les documents.",
    "en": "Your old newsroom is preparing an investigation into your party. A colleague you shared a desk with for six years asks for an interview, and she already has the documents."
  },
  "choices": [
    { "label": { "fr": "Lui parler franchement, en off", "en": "Talk to her honestly, off the record" },
      "effects": { "reputation": 1, "popularity": 4, "standing": -7 },
      "result": { "fr": "L'article sort mesuré et documenté. Votre parti sait d'où vient la nuance, et n'apprécie pas.",
                  "en": "The piece runs measured and documented. Your party knows where the nuance came from, and does not like it." } },
    { "label": { "fr": "Utiliser vos contacts pour retarder l'enquête", "en": "Use your contacts to delay the story" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "reseau": 1, "reputation": -2, "strike": "menteur" },
        "result": { "fr": "L'enquête sort trois mois plus tard, noyée dans l'actualité. Elle sait que c'est vous.",
                    "en": "The story runs three months later, buried in the news cycle. She knows it was you." } },
      "failure": { "effects": { "popularity": -10, "standing": -4, "reputation": -2, "strike": "casserole" },
        "result": { "fr": "Vos appels deviennent le sujet de l'article. Le métier n'aime pas qu'on lui fasse ça.",
                    "en": "Your phone calls become the story. The trade does not forgive that." } } },
    { "label": { "fr": "Refuser l'entretien et ne rien commenter", "en": "Decline the interview and say nothing" },
      "effects": { "sangfroid": 1, "popularity": -5, "standing": 3 },
      "result": { "fr": "La formule « n'a pas souhaité répondre » figure en gras dans le troisième paragraphe.",
                  "en": "“Did not wish to comment” appears in bold in the third paragraph." } },
    { "label": { "fr": "Lui donner de quoi viser plus haut que vous", "en": "Give her something aimed higher than you" },
      "when": { "personality": ["calculating"] },
      "effects": { "reseau": 1, "standing": -4, "popularity": 6, "notoriete": 1, "reputation": -1 },
      "result": { "fr": "L'enquête change de cible en cours de route. Un rival passe une très mauvaise semaine.",
                  "en": "The investigation changes target along the way. A rival has a very bad week." } }
  ]
},

{
  "id": "camarades_origine",
  "weight": 5,
  "when": { "background": ["activism"], "minTurn": 12 },
  "tag": { "fr": "Camarades", "en": "Comrades" },
  "text": {
    "fr": "Le collectif où vous avez commencé publie une tribune : « Nos anciens sont devenus ce qu'ils combattaient. » Votre nom est cité deux fois, avec une photo de vous en costume.",
    "en": "The group where you started publishes an open letter: “Our old comrades have become what they used to fight.” Your name appears twice, alongside a photo of you in a suit."
  },
  "choices": [
    { "label": { "fr": "Aller vous expliquer à leur assemblée générale", "en": "Go and explain yourself at their meeting" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "reputation": 2, "popularity": 7, "energie": -2, "reseau": 1 },
        "result": { "fr": "Trois heures de discussion debout. Vous ne les convainquez pas tous, mais vous êtes venu.",
                    "en": "Three hours of standing debate. You do not convince them all, but you came." } },
      "failure": { "effects": { "popularity": -7, "energie": -2, "reputation": -1 },
        "result": { "fr": "On vous coupe la parole quatre fois. La vidéo du dernier échange fait le tour du militantisme.",
                    "en": "You are cut off four times. The video of the last exchange goes round every activist group." } } },
    { "label": { "fr": "Assumer d'avoir changé", "en": "Own the fact that you changed" },
      "effects": { "sangfroid": 1, "standing": 6, "popularity": -4, "reputation": -1 },
      "effectsIf": [
        { "when": { "party": ["radical_left"] }, "effects": { "standing": -10, "strike": "traitre" } }
      ],
      "result": { "fr": "« On ne gouverne pas avec des slogans. » La phrase est reprise partout, dans les deux sens.",
                  "en": "“You do not govern with slogans.” The line is quoted everywhere, cutting both ways." } },
    { "label": { "fr": "Leur financer une salle et du matériel", "en": "Pay for a venue and equipment for them" },
      "when": { "minMoney": 40000 },
      "effects": { "money": -30000, "reseau": 2, "popularity": 3, "reputation": 1 },
      "result": { "fr": "Ils acceptent l'argent et maintiennent la tribune. C'est très exactement ce que vous auriez fait à leur place.",
                  "en": "They take the money and keep the letter up. It is exactly what you would have done in their place." } }
  ]
},

{
  "id": "note_administration",
  "weight": 5,
  "when": { "background": ["civil"], "position": ["depute", "chef", "maire", "ministre"] },
  "tag": { "fr": "Administration", "en": "The civil service" },
  "text": {
    "fr": "Un ancien collègue de votre direction vous fait passer une note interne accablante pour le gouvernement. Elle n'est pas classifiée, mais elle n'est pas non plus destinée à sortir.",
    "en": "A former colleague from your old department passes you an internal memo that is devastating for the government. It is not classified, but it was not meant to leave the building either."
  },
  "choices": [
    { "label": { "fr": "La sortir en séance", "en": "Read it out in the chamber" },
      "effects": { "notoriete": 2, "popularity": 10, "standing": 4, "reseau": -3 },
      "effectsIf": [
        { "when": { "personality": ["principled"] }, "effects": { "reputation": -1 } }
      ],
      "result": { "fr": "L'effet est considérable. Votre ancienne maison saura d'où vient la fuite, et vous fermera ses portes.",
                  "en": "The effect is considerable. Your old department will know where the leak came from, and will close its doors." } },
    { "label": { "fr": "La garder pour un meilleur moment", "en": "Keep it for a better moment" },
      "effects": { "sangfroid": 2, "reseau": 1, "standing": 3, "popularity": -2 },
      "result": { "fr": "Elle dort dans un tiroir. Vous la ressortirez quand elle fera vraiment mal, si elle est encore vraie.",
                  "en": "It sleeps in a drawer. You will use it when it really hurts, if it is still true by then." } },
    { "label": { "fr": "La renvoyer sans l'avoir lue", "en": "Send it back unread" },
      "effects": { "reputation": 2, "reseau": 2, "popularity": -3, "standing": -3 },
      "result": { "fr": "Votre ancien collègue vous en est reconnaissant. Il vous doit désormais quelque chose de plus utile qu'une note.",
                  "en": "Your former colleague is grateful. He now owes you something more useful than a memo." } }
  ]
},

{
  "id": "vieille_these",
  "weight": 5,
  "when": { "background": ["academia"], "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Archives", "en": "Archives" },
  "text": {
    "fr": "Un doctorant exhume un article que vous avez publié il y a vingt ans. Vous y défendiez exactement le contraire de votre programme actuel, avec quatre-vingts notes de bas de page.",
    "en": "A doctoral student unearths a paper you published twenty years ago. In it you argued the exact opposite of your current platform, with eighty footnotes."
  },
  "choices": [
    { "label": { "fr": "Revendiquer d'avoir changé d'avis", "en": "Claim the right to have changed your mind" },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": 4, "standing": -3 },
      "result": { "fr": "« Un chercheur qui ne change jamais d'avis n'a jamais cherché. » La formule sauve la journée.",
                  "en": "“A researcher who never changes his mind never researched anything.” The line saves the day." } },
    { "label": { "fr": "Expliquer que le contexte était différent", "en": "Explain that the context was different" },
      "effects": { "popularity": -5, "standing": 4, "sangfroid": 1 },
      "effectsIf": [
        { "when": { "trait": ["menteur"] }, "effects": { "popularity": -5 } }
      ],
      "result": { "fr": "Vous parlez douze minutes de méthodologie. Le sujet meurt d'ennui, ce qui était le but.",
                  "en": "You talk methodology for twelve minutes. The story dies of boredom, which was the point." } },
    { "label": { "fr": "Republier l'article avec une préface", "en": "Republish the paper with a new preface" },
      "effects": { "eloquence": 1, "notoriete": 1, "reputation": 2, "energie": -1, "popularity": 2 },
      "result": { "fr": "Vous assumez le texte et vous racontez pourquoi vous en êtes revenu. Trois mille personnes le lisent, dont tous les journalistes.",
                  "en": "You stand by the text and explain how you moved away from it. Three thousand people read it, including every journalist." } }
  ]
},

{
  "id": "archives_reseaux",
  "weight": 5,
  "when": { "background": ["celebrity"], "minTurn": 6 },
  "tag": { "fr": "Archives", "en": "Archives" },
  "text": {
    "fr": "Une chaîne compile vos anciennes vidéos : les partenariats, les défis, la période où vous vendiez des compléments alimentaires. Le montage dure onze minutes et il est très bien fait.",
    "en": "A channel compiles your old videos: the brand deals, the challenges, the period when you were selling food supplements. The edit runs eleven minutes and it is very well made."
  },
  "choices": [
    { "label": { "fr": "En rire et republier la compilation", "en": "Laugh and repost the compilation yourself" },
      "effects": { "charisme": 1, "notoriete": 2, "popularity": 8, "standing": -6 },
      "result": { "fr": "Vous la partagez avec un commentaire moqueur. Le pays trouve ça sain, votre parti trouve ça consternant.",
                  "en": "You share it with a mocking caption. The country finds it healthy; your party finds it appalling." } },
    { "label": { "fr": "Faire retirer les vidéos", "en": "Have the videos taken down" },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "minMoney": 200000 }, "value": 0.25 } ] },
      "success": { "effects": { "money": -60000, "popularity": -3, "standing": 3 },
        "result": { "fr": "Les vidéos disparaissent. Quatre personnes les avaient déjà téléchargées, et elles attendront.",
                    "en": "The videos vanish. Four people had already downloaded them, and they will wait." } },
      "failure": { "effects": { "money": -60000, "popularity": -12, "notoriete": 2, "strike": "casserole" },
        "result": { "fr": "La tentative de retrait devient l'histoire. Le montage est vu dix fois plus qu'avant.",
                    "en": "The takedown attempt becomes the story. The compilation is seen ten times more than before." } } },
    { "label": { "fr": "Raconter ce que ça payait", "en": "Explain what it paid for" },
      "effects": { "reputation": 2, "popularity": 7, "energie": -1 },
      "effectsIf": [
        { "when": { "origin": ["modest"] }, "effects": { "popularity": 5 } },
        { "when": { "origin": ["bourgeois", "dynasty"] }, "effects": { "popularity": -7, "reputation": -1 } }
      ],
      "result": { "fr": "Vous expliquez le loyer, les factures et l'absence de plan B. Selon d'où vous venez, l'histoire touche ou fait rire.",
                  "en": "You explain the rent, the bills and the absence of a plan B. Depending on where you come from, the story lands or it does not." } }
  ]
},

{
  "id": "slogans_adversaire",
  "weight": 5,
  "when": { "background": ["comms"], "minTurn": 10 },
  "tag": { "fr": "Agence", "en": "The agency" },
  "text": {
    "fr": "Un journaliste retrouve les campagnes que vous avez écrites du temps de l'agence. Vous avez signé, il y a douze ans, les affiches de celui que vous combattez aujourd'hui.",
    "en": "A reporter digs up the campaigns you wrote back in your agency days. Twelve years ago you signed off on the posters of the man you now fight."
  },
  "choices": [
    { "label": { "fr": "Assumer : c'était un métier", "en": "Own it: it was a job" },
      "effects": { "sangfroid": 1, "popularity": -4, "standing": 3, "eloquence": 1 },
      "result": { "fr": "« On m'a payé pour vendre, aujourd'hui je suis payé pour décider. » C'est honnête et ça ne rassure personne.",
                  "en": "“I was paid to sell; now I am paid to decide.” It is honest and it reassures nobody." } },
    { "label": { "fr": "Retourner votre connaissance de leurs méthodes", "en": "Turn your knowledge of their methods against them" },
      "effects": { "notoriete": 2, "popularity": 9, "reseau": -2, "standing": -2 },
      "result": { "fr": "Vous racontez comment se fabrique une campagne, exemples à l'appui. Le métier vous déteste, le public adore.",
                  "en": "You explain how a campaign gets manufactured, with examples. The trade hates you; the public loves it." } },
    { "label": { "fr": "Faire venir votre ancienne agence sur votre campagne", "en": "Bring your old agency onto your campaign" },
      "when": { "minMoney": 120000 },
      "effects": { "money": -100000, "standing": 5, "reseau": 2, "reputation": -2, "popularity": -3 },
      "result": { "fr": "Ils sont excellents et ils coûtent cher. Vos militants découvrent le slogan en même temps que le pays.",
                  "en": "They are excellent and they are expensive. Your activists discover the slogan at the same time as the country." } }
  ]
},

/* ==========================================================================
   15. CE QUE VOTRE CARACTÈRE VOUS FAIT FAIRE
   ==========================================================================
   Un événement par personnalité. Le tempérament n'est pas un bonus, c'est
   une manière de se mettre dans des situations que les autres n'auraient
   jamais rencontrées.
   ========================================================================== */

{
  "id": "dossier_de_trop",
  "weight": 5,
  "when": { "personality": ["hardworking"], "position": ["depute", "chef", "maire", "ministre"] },
  "tag": { "fr": "Travail", "en": "Work" },
  "text": {
    "fr": "Vous avez passé quatre mois sur un rapport de trois cents pages que personne ne lira. Il est excellent. Pendant ce temps, deux collègues ont fait la une avec trois phrases.",
    "en": "You spent four months on a three-hundred-page report nobody will read. It is excellent. Meanwhile two colleagues made the front page with three sentences."
  },
  "choices": [
    { "label": { "fr": "Le défendre point par point en commission", "en": "Defend it line by line in committee" },
      "effects": { "standing": 8, "eloquence": 1, "energie": -2, "popularity": -3 },
      "result": { "fr": "Les spécialistes vous citeront pendant dix ans. Le pays n'en saura jamais rien.",
                  "en": "Specialists will quote you for a decade. The country will never hear about it." } },
    { "label": { "fr": "En tirer une formule et la marteler", "en": "Boil it down to one line and hammer it" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 10, "standing": -2 },
        "result": { "fr": "Une phrase, tirée de la page 214, tourne pendant une semaine. Le rapport, lui, reste fermé.",
                    "en": "One sentence, from page 214, runs for a week. The report itself stays shut." } },
      "failure": { "effects": { "popularity": -4, "energie": -1, "standing": -2 },
        "result": { "fr": "La formule tombe à plat. On vous trouve technique, ce qui n'est jamais un compliment.",
                    "en": "The line falls flat. People find you technical, which is never a compliment." } } },
    { "label": { "fr": "Le confier à un collègue plus médiatique", "en": "Hand it to a more telegenic colleague" },
      "effects": { "reseau": 2, "standing": 5, "energie": 1, "notoriete": -1, "popularity": -2 },
      "result": { "fr": "Il le présente très bien et vous remercie en privé. Personne d'autre ne saura qui l'a écrit.",
                  "en": "He presents it beautifully and thanks you in private. Nobody else will know who wrote it." } },
    { "label": { "fr": "Prendre enfin trois semaines de vacances", "en": "Finally take three weeks off" },
      "effects": { "energie": 4, "standing": -4, "popularity": -2 },
      "result": { "fr": "Vous dormez, vous lisez autre chose, vous revenez vivant. Votre absence a été remarquée.",
                  "en": "You sleep, you read something else, you come back alive. Your absence was noticed." } }
  ]
},

{
  "id": "rumeur_charme",
  "weight": 5,
  "when": { "personality": ["charming"], "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Rumeur", "en": "Rumour" },
  "text": {
    "fr": "Une rumeur circule sur votre vie privée. Elle est fausse, elle est invérifiable, et elle repose entièrement sur le fait que vous mettez les gens à l'aise.",
    "en": "A rumour is going round about your private life. It is false, it is unverifiable, and it rests entirely on the fact that you put people at ease."
  },
  "choices": [
    { "label": { "fr": "Démentir fermement, une fois", "en": "Deny it firmly, once" },
      "effects": { "sangfroid": 1, "popularity": -3, "reputation": 1 },
      "result": { "fr": "Un communiqué de quatre lignes, puis plus rien. La rumeur met six mois à mourir.",
                  "en": "A four-line statement, then nothing. The rumour takes six months to die." } },
    { "label": { "fr": "En jouer sans jamais confirmer", "en": "Play with it without ever confirming" },
      "effects": { "charisme": 1, "notoriete": 2, "popularity": 8, "reputation": -2, "standing": -4 },
      "result": { "fr": "Vous répondez par un sourire et un silence. C'est efficace, et cela vous poursuivra longtemps.",
                  "en": "You answer with a smile and a silence. It works, and it will follow you for years." } },
    { "label": { "fr": "Chercher qui l'a lancée", "en": "Find out who started it" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "standing": 6, "energie": -1 },
        "result": { "fr": "Vous remontez jusqu'à un collaborateur d'un rival. Vous ne dites rien, vous rangez.",
                    "en": "You trace it back to a rival's staffer. You say nothing; you file it away." } },
      "failure": { "effects": { "energie": -2, "reseau": -1, "popularity": -4 },
        "result": { "fr": "Votre enquête se sait avant d'aboutir. On vous trouve obsédé, ce qui alimente la rumeur.",
                    "en": "Your inquiry becomes known before it concludes. People find you obsessive, which feeds the rumour." } } }
  ]
},

{
  "id": "mot_de_trop",
  "weight": 5,
  "when": { "personality": ["clever"], "minTurn": 6 },
  "tag": { "fr": "Bon mot", "en": "The clever line" },
  "text": {
    "fr": "Vous avez lâché en plateau une formule brillante sur un adversaire. Elle est drôle, elle est juste, et elle donne surtout l'impression que vous vous trouvez très intelligent.",
    "en": "On air you produced a brilliant line about an opponent. It is funny, it is accurate, and above all it makes you look like a man who thinks he is very clever."
  },
  "choices": [
    { "label": { "fr": "Assumer et recommencer", "en": "Own it and do it again" },
      "effects": { "landscape": { "self": -0.8 }, "notoriete": 2, "eloquence": 1, "popularity": 5, "reputation": -2 },
      "effectsIf": [
        { "when": { "origin": ["bourgeois", "dynasty"] }, "effects": { "popularity": -8 } }
      ],
      "result": { "fr": "Votre réputation d'esprit est faite. Selon votre pedigree, on parlera de finesse ou de mépris.",
                  "en": "Your reputation for wit is made. Depending on your pedigree, they will call it sharpness or contempt." } },
    { "label": { "fr": "Vous excuser auprès de l'intéressé", "en": "Apologise to the man himself" },
      "effects": { "reseau": 2, "reputation": 2, "standing": 4, "popularity": -3 },
      "result": { "fr": "Un appel de trois minutes qui vaudra un vote un jour. Personne n'en saura rien.",
                  "en": "A three-minute call that will be worth a vote one day. Nobody will ever know." } },
    { "label": { "fr": "Expliquer la formule", "en": "Explain the joke" },
      "effects": { "eloquence": 1, "popularity": -6, "standing": 2, "energie": -1 },
      "result": { "fr": "Vous passez quatre minutes à démonter votre propre plaisanterie. C'est la pire chose à faire et vous le savez.",
                  "en": "You spend four minutes taking your own joke apart. It is the worst possible move and you know it." } }
  ]
},

{
  "id": "proces_outrance",
  "weight": 5,
  "when": { "personality": ["provocative"], "minTurn": 14, "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Outrance", "en": "Excess" },
  "text": {
    "fr": "Trois éditorialistes signent le même jour des textes intitulés à peu près « jusqu'où ira-t-il ». Votre entourage vous conseille une séquence de respectabilité.",
    "en": "Three columnists publish pieces on the same day all titled roughly “how far will he go”. Your staff advise a stretch of respectability."
  },
  "choices": [
    { "label": { "fr": "Faire la séquence sérieuse", "en": "Do the serious stretch" },
      "effects": { "reputation": 2, "standing": 6, "popularity": -6, "notoriete": -1 },
      "result": { "fr": "Deux mois de visites d'usines et de discours mesurés. Votre base s'ennuie et vous le fait savoir.",
                  "en": "Two months of factory visits and measured speeches. Your base is bored and lets you know." } },
    { "label": { "fr": "En rajouter dès le lendemain", "en": "Go further the very next day" },
      "effects": { "notoriete": 3, "popularity": 9, "reputation": -2, "standing": -8, "strike": "radical" },
      "result": { "fr": "La phrase suivante est pire que la précédente. Vous existez, et vous rétrécissez votre horizon.",
                  "en": "The next line is worse than the last. You exist, and your horizon narrows." } },
    { "label": { "fr": "Retourner l'accusation contre la presse", "en": "Turn the accusation back on the press" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "eloquence": 0.4, "popularity": 0.03 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 8, "standing": -3 },
        "result": { "fr": "Vous parlez de commentateurs coupés du pays. Une partie du pays approuve bruyamment.",
                    "en": "You talk about commentators cut off from the country. A part of the country loudly agrees." } },
      "failure": { "effects": { "popularity": -8, "reputation": -1, "standing": -4 },
        "result": { "fr": "L'attaque tombe mal après une semaine déjà chargée. On vous trouve fatigant.",
                    "en": "The attack lands badly after an already heavy week. People find you tiring." } } }
  ]
},

{
  "id": "arrangement_propose",
  "weight": 5,
  "when": { "personality": ["principled"], "minTurn": 10 },
  "tag": { "fr": "Arrangement", "en": "The arrangement" },
  "text": {
    "fr": "On vous propose un accord très simple : vous retirez un amendement gênant, et une circonscription sûre vous attend aux prochaines élections. Tout le monde autour de la table trouve cela normal.",
    "en": "You are offered a very simple deal: you withdraw an inconvenient amendment, and a safe seat awaits you at the next election. Everyone around the table finds this perfectly normal."
  },
  "choices": [
    { "label": { "fr": "Refuser et le dire à la sortie", "en": "Refuse, and say so on the way out" },
      "effects": { "reputation": 2, "popularity": 9, "standing": -12, "reseau": -2 },
      "result": { "fr": "Votre refus circule dans le bâtiment avant vous. On vous respecte et on cesse de vous inviter.",
                  "en": "Your refusal travels through the building faster than you do. They respect you and stop inviting you." } },
    { "label": { "fr": "Accepter, une fois", "en": "Accept, just this once" },
      "effects": { "standing": 12, "reseau": 2, "popularity": -3 },
      "effectsIf": [
        { "when": { "trait": ["intouchable"] }, "effects": { "untrait": "intouchable", "reputation": -2, "popularity": -8 } }
      ],
      "result": { "fr": "L'amendement disparaît sans un mot. C'est la première fois, et vous savez déjà que ce ne sera pas la dernière.",
                  "en": "The amendment vanishes without a word. It is the first time, and you already know it will not be the last." } },
    { "label": { "fr": "Refuser et faire voter l'amendement", "en": "Refuse, and get the amendment passed" },
      "roll": { "base": 19, "stat": "eloquence", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reputation": 2, "notoriete": 1, "popularity": 11, "standing": -6 },
        "result": { "fr": "Le texte passe de justesse. Trois collègues qui avaient promis le contraire ont voté avec vous.",
                    "en": "The text scrapes through. Three colleagues who had promised otherwise voted with you." } },
      "failure": { "effects": { "popularity": 3, "standing": -14, "energie": -2 },
        "result": { "fr": "L'amendement est rejeté à une large majorité. Vous avez tout perdu, sauf la face.",
                    "en": "The amendment is rejected by a wide margin. You lost everything except face." } } }
  ]
},

{
  "id": "coup_davance",
  "weight": 5,
  "when": { "personality": ["calculating"], "minTurn": 12 },
  "tag": { "fr": "Manœuvre", "en": "The manoeuvre" },
  "text": {
    "fr": "Votre plan pour la prochaine investiture était bien construit. Un allié vient de comprendre qu'il en faisait partie sans le savoir, et il vous attend dans votre bureau.",
    "en": "Your plan for the next nomination was well built. An ally has just worked out that he was part of it without knowing, and he is waiting in your office."
  },
  "choices": [
    { "label": { "fr": "Tout lui expliquer, et lui offrir sa part", "en": "Explain everything, and offer him his share" },
      "effects": { "reseau": 2, "standing": 5, "sangfroid": 1, "popularity": -2 },
      "result": { "fr": "Il accepte, à contrecœur et pour longtemps. Vous venez de fabriquer un associé, pas un ami.",
                  "en": "He accepts, reluctantly and for a long time. You have just made a partner, not a friend." } },
    { "label": { "fr": "Nier en bloc", "en": "Deny everything" },
      "roll": { "base": 18, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "sangfroid": 1, "strike": "menteur" },
        "result": { "fr": "Il repart en doutant de lui-même. C'est votre meilleur travail de la semaine.",
                    "en": "He leaves doubting himself. It is your best work of the week." } },
      "failure": { "effects": { "standing": -12, "reseau": -3, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "Il avait les messages. Le lendemain, la moitié du parti les a lus.",
                    "en": "He had the messages. By the next morning half the party had read them." } } },
    { "label": { "fr": "Le prendre de vitesse et le griller d'abord", "en": "Move first and burn him" },
      "effects": { "standing": 8, "reseau": -3, "reputation": -2, "popularity": -4, "strike": "traitre" },
      "result": { "fr": "Vous racontez votre version avant la sienne. Elle tient trois semaines, ce qui suffit.",
                  "en": "You tell your version before he can tell his. It holds for three weeks, which is enough." } }
  ]
},

/* ==========================================================================
   16. LES AFFAIRES
   ==========================================================================
   Trois chaînes inspirées de ce que la vie politique produit régulièrement :
   l'argent qui vient de l'étranger, les emplois qui n'existent pas, les
   dossiers qu'on ouvre sur les autres. Chacune commence par une proposition
   confortable et se termine, si le joueur a de la chance, par un procès.

   La règle d'écriture est la même que partout : rien d'invraisemblable, rien
   qui vise quelqu'un en particulier, et le choix malhonnête doit être le
   plus efficace à court terme. C'est là que se joue la tension morale.
   ========================================================================== */

{
  "id": "financement_etranger",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 14, "notTrait": ["caisse_noire"] },
  "tag": { "fr": "Financement", "en": "Funding" },
  "text": {
    "fr": "Un homme d'affaires très souriant, passeport d'un pays où l'on ne discute pas les résultats électoraux, propose de financer votre campagne « par une fondation culturelle ». Il précise qu'il n'attend rien en retour, ce qui est la seule chose invraisemblable de la conversation.",
    "en": "A very smiling businessman, holding the passport of a country where election results are not debated, offers to fund your campaign “through a cultural foundation”. He specifies that he expects nothing in return, which is the only implausible part of the conversation."
  },
  "choices": [
    { "label": { "fr": "Accepter par la fondation", "en": "Accept through the foundation" },
      "effects": { "money": 260000, "standing": 9, "reseau": 1, "reputation": -1,
                   "flags": { "dirtyMoney": true }, "trait": "caisse_noire", "chain": "argent_etranger" },
      "result": { "fr": "Les virements arrivent en trois fois, avec des libellés qui parlent de colloques. Votre trésorier ne pose aucune question, ce qui est son métier.",
                  "en": "The transfers arrive in three instalments, labelled as conference expenses. Your treasurer asks no questions, which is his job." } },
    { "label": { "fr": "Refuser et ne rien dire", "en": "Decline and say nothing" },
      "effects": { "sangfroid": 1, "reputation": 1, "standing": -3 },
      "result": { "fr": "Vous déclinez poliment. Il ira voir quelqu'un d'autre dans la semaine, et vous saurez qui dans deux ans.",
                  "en": "You decline politely. He will see somebody else within the week, and you will find out who in two years." } },
    { "label": { "fr": "Refuser et le raconter à la presse", "en": "Decline and tell the press" },
      "roll": { "base": 15, "stat": "reputation", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 12, "reputation": 2, "standing": -7 },
        "result": { "fr": "Le récit fait la une trois jours. On vous demande pourquoi vous n'avez pas porté plainte, ce qui est une bonne question.",
                    "en": "The story leads the news for three days. People ask why you did not go to the police, which is a fair question." } },
      "failure": { "effects": { "popularity": -6, "standing": -9, "notoriete": 1 },
        "result": { "fr": "Sans preuve, l'histoire tourne à votre désavantage. L'intéressé dément, son avocat écrit, votre parti soupire.",
                    "en": "With no evidence the story turns against you. The man denies it, his lawyer writes, your party sighs." } } },
    { "label": { "fr": "Accepter, mais tout déclarer à la commission", "en": "Accept, but declare everything" },
      "when": { "background": ["law", "civil"] },
      "effects": { "money": 70000, "reputation": 1, "standing": 3, "popularity": -3, "energie": -1 },
      "result": { "fr": "Déclaré, plafonné, contrôlé : il ne reste presque rien. Vous avez le mérite et le reçu.",
                  "en": "Declared, capped, audited: almost nothing is left. You have the credit and the receipt." } }
  ]
},

{
  "id": "argent_etranger",
  "delay": [4, 10],
  "weight": 0,
  "tag": { "fr": "Douanes", "en": "Customs" },
  "text": {
    "fr": "Un douanier zélé a noté le passage de deux valises en cabine, et un journaliste a récupéré les plans de vol. Il ne vous accuse de rien : il vous demande simplement de confirmer que vous connaissez la fondation.",
    "en": "An overzealous customs officer logged two cabin suitcases, and a reporter has obtained the flight plans. He accuses you of nothing: he simply asks you to confirm that you know the foundation."
  },
  "choices": [
    { "label": { "fr": "Nier connaître la fondation", "en": "Deny knowing the foundation" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.2 },
                                                 { "when": { "stat": { "sangfroid": { "min": 14 } } }, "value": 0.15 } ] },
      "success": { "effects": { "popularity": -4, "standing": 4, "strike": "menteur" },
        "result": { "fr": "Le sujet s'éteint faute de pièces. Il reste dans une note de bas de page, et dans la mémoire du journaliste.",
                    "en": "The story dies for lack of documents. It survives in a footnote, and in the reporter's memory." } },
      "failure": { "effects": { "popularity": -14, "standing": -10, "reputation": -2, "strike": "casserole",
                                "flags": { "investigated": true }, "chain": "commission_enquete" },
        "result": { "fr": "Une photo de vous avec l'intéressé sort le lendemain. Le démenti devient le sujet.",
                    "en": "A photograph of you with the man appears the next day. The denial becomes the story." } } },
    { "label": { "fr": "Rembourser discrètement et vite", "en": "Quietly pay it all back" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -300000, "popularity": -5, "standing": -4, "reputation": 1,
                   "flags": { "dirtyMoney": false }, "untrait": "caisse_noire" },
      "result": { "fr": "L'argent repart d'où il vient, avec des frais. Personne ne vous félicitera jamais pour ça.",
                  "en": "The money goes back where it came from, minus fees. Nobody will ever congratulate you for it." } },
    { "label": { "fr": "Attaquer le journaliste et son journal", "en": "Go after the reporter and his paper" },
      "effects": { "notoriete": 2, "popularity": -13, "standing": 4, "reputation": -2, "chain": "commission_enquete" },
      "result": { "fr": "Votre avocat parle d'atteinte à la présomption d'innocence. Quatre rédactions décident de s'y intéresser de près.",
                  "en": "Your lawyer talks about the presumption of innocence. Four newsrooms decide to take a closer look." } }
  ]
},

{
  "id": "commission_enquete",
  "delay": [3, 8],
  "weight": 0,
  "tag": { "fr": "Commission d'enquête", "en": "Inquiry committee" },
  "text": {
    "fr": "L'Assemblée crée une commission d'enquête. Vous êtes auditionné sous serment, en direct, par des gens qui ont préparé leurs questions et qui savent déjà la moitié des réponses.",
    "en": "Parliament sets up an inquiry committee. You are questioned under oath, live, by people who prepared their questions and already know half the answers."
  },
  "choices": [
    { "label": { "fr": "Mentir sous serment", "en": "Lie under oath" },
      "roll": { "base": 20, "stat": "sangfroid", "plus": { "eloquence": 0.5, "standing": 0.04 },
                "bonus": [ { "when": { "trait": ["teflon"] }, "value": 2 } ], "dice": 16 },
      "success": { "effects": { "popularity": 5, "standing": 6, "strike": "menteur",
                                "flags": { "investigated": false } },
        "result": { "fr": "Trois heures sans une hésitation. La commission conclut à un « manque de clarté » et passe à autre chose.",
                    "en": "Three hours without a stumble. The committee concludes there was “a lack of clarity” and moves on." } },
      "failure": { "effects": { "popularity": -12, "standing": -12, "reputation": -2,
                                "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "Une pièce que vous ne connaissiez pas atterrit sur la table. Le parquet ouvre une information judiciaire le soir même.",
                    "en": "A document you had not seen lands on the table. Prosecutors open a formal investigation that evening." } } },
    { "label": { "fr": "Dire une partie de la vérité", "en": "Tell part of the truth" },
      "effects": { "popularity": -6, "standing": -8, "reputation": 1, "sangfroid": 1,
                   "flags": { "investigated": false, "dirtyMoney": false } },
      "result": { "fr": "Vous reconnaissez l'essentiel en le rendant ennuyeux. C'est la meilleure façon d'éteindre un sujet, et la plus coûteuse.",
                  "en": "You admit the essentials while making them boring. It is the best way to kill a story, and the most expensive." } },
    { "label": { "fr": "Invoquer le secret de l'instruction et se taire", "en": "Cite the ongoing case and say nothing" },
      "effects": { "popularity": -9, "standing": 3, "notoriete": 1, "strike": "casserole" },
      "result": { "fr": "Vous répondez douze fois que vous ne pouvez pas répondre. La séquence tourne en boucle avec une musique de suspense.",
                  "en": "You answer twelve times that you cannot answer. The clip runs on a loop with suspense music underneath." } }
  ]
},

{
  "id": "emploi_fictif",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 8, "notTrait": ["intouchable"] },
  "tag": { "fr": "Collaborateurs", "en": "Staffing" },
  "text": {
    "fr": "Votre enveloppe de collaborateurs est votre affaire, et personne ne vérifie vraiment qui la touche. Votre belle-sœur cherche un poste, et elle est, vous en êtes convaincu, parfaitement compétente pour un travail que vous n'arrivez pas à décrire.",
    "en": "Your staffing budget is your business, and nobody really checks who receives it. Your sister-in-law is looking for a job, and she is, you are convinced, perfectly qualified for work you cannot quite describe."
  },
  "choices": [
    { "label": { "fr": "L'embaucher comme attachée parlementaire", "en": "Hire her as a parliamentary assistant" },
      "effects": { "money": 90000, "energie": 1, "reputation": -2, "flags": { "dirtyMoney": true }, "chain": "emploi_fictif_presse" },
      "result": { "fr": "Le contrat est signé un vendredi soir. Elle passera au bureau deux fois en trois ans, dont une pour un pot de départ.",
                  "en": "The contract is signed on a Friday evening. She will come to the office twice in three years, once for a leaving party." } },
    { "label": { "fr": "Embaucher un vrai collaborateur compétent", "en": "Hire an actual competent staffer" },
      "effects": { "money": -40000, "energie": 2, "eloquence": 1, "standing": 2 },
      "result": { "fr": "Vos dossiers sont mieux préparés que ceux de vos collègues. Personne ne s'en apercevra avant longtemps.",
                  "en": "Your files are better prepared than your colleagues'. Nobody will notice for a long time." } },
    { "label": { "fr": "Refuser net et le faire savoir en famille", "en": "Say no, and let the family know" },
      "effects": { "reputation": 2, "popularity": 4, "reseau": -1, "energie": -1 },
      "result": { "fr": "Le repas de Noël sera tendu. Vous dormez très bien.",
                  "en": "Christmas dinner will be tense. You sleep very well." } },
    { "label": { "fr": "L'embaucher chez un ami, qui vous doit un service", "en": "Get a friend to hire her instead" },
      "when": { "personality": ["calculating"] },
      "effects": { "reseau": 2, "standing": 4, "reputation": -1, "money": 15000 },
      "result": { "fr": "Elle est salariée d'une société de conseil qui travaille beaucoup pour des collectivités. Le montage est légal, ou personne n'a envie de vérifier.",
                  "en": "She is on the payroll of a consultancy that works a great deal for local authorities. The arrangement is legal, or nobody wants to check." } }
  ]
},

{
  "id": "emploi_fictif_presse",
  "delay": [4, 12],
  "weight": 0,
  "tag": { "fr": "Hebdomadaire", "en": "The weekly" },
  "text": {
    "fr": "Un hebdomadaire satirique demande à voir les contrats, les fiches de paie et « tout élément permettant d'établir la réalité du travail fourni ». Ils publient jeudi, avec ou sans votre réponse.",
    "en": "A satirical weekly asks to see the contracts, the payslips and “any material establishing that the work was actually done”. They publish on Thursday, with or without your answer."
  },
  "choices": [
    { "label": { "fr": "Fabriquer des notes de travail", "en": "Manufacture some work notes" },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "background": ["law", "comms"] }, "value": 0.2 } ] },
      "success": { "effects": { "popularity": -5, "standing": 3, "strike": "menteur" },
        "result": { "fr": "Douze pages antidatées, imprimées sur du vieux papier. Le journal publie quand même, mais sans la certitude qu'il espérait.",
                    "en": "Twelve backdated pages, printed on old paper. The paper publishes anyway, but without the certainty it wanted." } },
      "failure": { "effects": { "popularity": -18, "standing": -14, "reputation": -2, "strike": "casserole",
                                "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "La police scientifique date l'encre. Ce détail vous suivra jusqu'au tribunal.",
                    "en": "Forensics date the ink. That detail will follow you all the way to court." } } },
    { "label": { "fr": "Tout rembourser avant la publication", "en": "Repay everything before publication" },
      "effects": { "money": -120000, "popularity": -7, "standing": -5, "reputation": 1,
                   "flags": { "dirtyMoney": false } },
      "result": { "fr": "Le chèque part le mercredi. L'article sort quand même, avec la mention du remboursement au dernier paragraphe.",
                  "en": "The cheque goes out on Wednesday. The article runs anyway, with the repayment in the final paragraph." } },
    { "label": { "fr": "Assumer : « c'est légal, et je le referais »", "en": "Own it: “it is legal, and I would do it again”" },
      "effects": { "notoriete": 2, "popularity": -12, "standing": 8, "sangfroid": 1, "strike": "casserole" },
      "result": { "fr": "Une partie du milieu vous trouve courageux. Le pays retient surtout le montant, qu'il compare au sien.",
                  "en": "Part of the political world finds you brave. The country mostly remembers the amount, and compares it to its own." } }
  ]
},

{
  "id": "dossier_adversaire",
  "when": { "minTurn": 12, "position": ["maire", "depute", "ministre", "chef"] },
  "tag": { "fr": "Le dossier", "en": "The file" },
  "text": {
    "fr": "Un ancien policier reconverti dans « l'intelligence économique » vous propose un dossier sur {rival}. Il l'ouvre devant vous : des relevés bancaires, des adresses, une histoire de famille compliquée. Le prix est raisonnable, ce qui est le plus inquiétant.",
    "en": "A former police officer now in “business intelligence” offers you a file on {rival}. He opens it in front of you: bank records, addresses, a complicated family story. The price is reasonable, which is the most worrying part."
  },
  "choices": [
    { "label": { "fr": "Acheter et le faire sortir dans la presse", "en": "Buy it and get it into the press" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -50000, "notoriete": 2, "popularity": 6, "standing": 5, "reputation": -2,
                   "chain": "dossier_retour_flamme" },
      "result": { "fr": "L'affaire sort trois semaines plus tard sous la signature d'un journaliste que vous ne connaissez pas. Votre rival annule ses déplacements.",
                  "en": "The story runs three weeks later under the byline of a reporter you do not know. Your rival cancels his engagements." } },
    { "label": { "fr": "Acheter et le garder au chaud", "en": "Buy it and keep it in a drawer" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -50000, "standing": 8, "reseau": 1, "sangfroid": 1, "reputation": -1,
                   "chain": "dossier_retour_flamme" },
      "result": { "fr": "Le dossier dort dans un coffre. Votre rival ne sait pas pourquoi vous lui souriez comme ça en réunion.",
                  "en": "The file sleeps in a safe. Your rival cannot work out why you smile at him like that in meetings." } },
    { "label": { "fr": "Refuser et le mettre dehors", "en": "Refuse and show him the door" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": -4 },
      "result": { "fr": "Il repart sans insister. Il ira voir votre rival, qui a peut-être un dossier sur vous.",
                  "en": "He leaves without pushing. He will go and see your rival, who may well have a file on you." } },
    { "label": { "fr": "Prévenir votre rival de ce qui circule", "en": "Warn your rival about what is circulating" },
      "effects": { "reseau": 2, "reputation": 2, "popularity": -3, "standing": -2 },
      "result": { "fr": "Il vous remercie froidement, comme quelqu'un qui vient de comprendre qu'il vous doit quelque chose.",
                  "en": "He thanks you coldly, like a man who has just realised he owes you something." } }
  ]
},

{
  "id": "dossier_retour_flamme",
  "delay": [5, 14],
  "weight": 0,
  "tag": { "fr": "Retour de bâton", "en": "Blowback" },
  "text": {
    "fr": "L'ancien policier a été mis en examen dans une autre affaire, et il parle beaucoup. Votre nom figure sur une facture, à côté du mot « prestation documentaire ».",
    "en": "The former police officer has been charged in another case, and he is talking a great deal. Your name appears on an invoice, next to the words “documentary services”."
  },
  "choices": [
    { "label": { "fr": "Assumer une prestation légale de veille", "en": "Call it a legal monitoring service" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "eloquence": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": -5, "standing": 2, "sangfroid": 1 },
        "result": { "fr": "Vous parlez de veille concurrentielle avec un tel sérieux que le sujet devient technique, donc ennuyeux, donc mort.",
                    "en": "You talk about competitive monitoring so earnestly that the story turns technical, therefore boring, therefore dead." } },
      "failure": { "effects": { "popularity": -13, "standing": -10, "reputation": -2, "strike": "casserole",
                                "flags": { "investigated": true } },
        "result": { "fr": "Le mot « barbouze » apparaît dans un titre. Il ne vous quittera plus.",
                    "en": "The word “spook” appears in a headline. It will never leave you again." } } },
    { "label": { "fr": "Charger un collaborateur qui a agi seul", "en": "Blame a staffer who acted alone" },
      "effects": { "popularity": -6, "standing": 5, "reputation": -3, "reseau": -2, "strike": "traitre" },
      "result": { "fr": "Il assume tout en conférence de presse, la mâchoire serrée. Votre équipe a compris ce qui l'attend si elle se trompe.",
                  "en": "He takes the blame at a press conference, jaw clenched. Your staff have understood what awaits them if they slip." } },
    { "label": { "fr": "Tout reconnaître et présenter des excuses", "en": "Admit everything and apologise" },
      "effects": { "popularity": 3, "standing": -12, "reputation": 2, "notoriete": 1 },
      "result": { "fr": "Vous dites que c'était une faute et que vous en assumez les conséquences. Le pays apprécie, l'appareil note.",
                  "en": "You say it was a mistake and that you accept the consequences. The country appreciates it; the machine takes notes." } }
  ]
},

{
  "id": "cabinet_conseil",
  "when": { "position": ["depute", "ministre", "chef"], "minStanding": 45 },
  "tag": { "fr": "Consultants", "en": "Consultants" },
  "text": {
    "fr": "Un grand cabinet de conseil propose d'écrire votre programme « en méthodologie agile », pour un tarif journalier qui dépasse le salaire mensuel de vos militants. La présentation compte quatre-vingts pages et deux idées.",
    "en": "A large consulting firm offers to write your platform “with an agile methodology”, at a daily rate higher than your activists' monthly wage. The deck runs to eighty slides and two ideas."
  },
  "choices": [
    { "label": { "fr": "Signer : c'est propre et rapide", "en": "Sign: it is clean and fast" },
      "effects": { "money": -140000, "standing": 7, "eloquence": 1, "popularity": -6, "reputation": -1 },
      "result": { "fr": "Le programme est irréprochable et ne ressemble à personne. Vos militants le découvrent en même temps que la presse.",
                  "en": "The platform is flawless and sounds like nobody. Your activists discover it at the same time as the press." } },
    { "label": { "fr": "Le faire écrire par vos militants", "en": "Have your activists write it" },
      "effects": { "energie": -2, "reseau": 2, "popularity": 7, "standing": -3 },
      "result": { "fr": "Six mois d'ateliers, quatre-vingts contributions et deux bagarres. Le texte est bancal et il est de vous.",
                  "en": "Six months of workshops, eighty contributions and two fights. The text is uneven and it is yours." } },
    { "label": { "fr": "Signer, puis dénoncer les cabinets en meeting", "en": "Sign, then attack consultants at a rally" },
      "when": { "personality": ["calculating", "provocative"] },
      "effects": { "money": -140000, "notoriete": 2, "popularity": 11, "standing": 2, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "La formule « l'État n'est pas une start-up » fait un triomphe. La facture, elle, est dans les comptes de campagne.",
                  "en": "The line “the state is not a start-up” brings the house down. The invoice, meanwhile, is in the campaign accounts." } },
    { "label": { "fr": "Refuser et le raconter", "en": "Refuse, and say so publicly" },
      "effects": { "popularity": 8, "reputation": 1, "standing": -6, "notoriete": 1 },
      "result": { "fr": "Vous publiez le devis. Trois de vos collègues, clients du même cabinet, cessent de vous parler.",
                  "en": "You publish the quote. Three colleagues, clients of the same firm, stop speaking to you." } }
  ]
},

{
  "id": "cadeau_encombrant",
  "when": { "stat": { "notoriete": { "min": 8 } }, "minTurn": 6 },
  "tag": { "fr": "Cadeaux", "en": "Gifts" },
  "text": {
    "fr": "Un ami entrepreneur vous fait livrer trois costumes et une montre, « entre amis, sans facture ». Le tout vaut à peu près deux ans de smic, et il vous rappelle en riant que ça ne se déclare pas.",
    "en": "An entrepreneur friend has three suits and a watch delivered to you, “between friends, no invoice”. Together they are worth about two years of minimum wage, and he laughingly reminds you that this does not get declared."
  },
  "choices": [
    { "label": { "fr": "Garder, et les porter", "en": "Keep them, and wear them" },
      "effects": { "money": 25000, "charisme": 1, "reputation": -2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Vous êtes très bien habillé pendant deux ans. Un photographe finira par s'intéresser à votre poignet.",
                  "en": "You are very well dressed for two years. A photographer will eventually take an interest in your wrist." } },
    { "label": { "fr": "Renvoyer le tout avec un mot sec", "en": "Send it all back with a curt note" },
      "effects": { "reputation": 2, "reseau": -2, "standing": -3 },
      "result": { "fr": "Il le prend très mal et le raconte partout. Votre réputation d'incorruptible vous coûtera d'autres dîners.",
                  "en": "He takes it very badly and tells everyone. Your incorruptible reputation will cost you other dinners." } },
    { "label": { "fr": "Les donner à une association, devant témoins", "en": "Give them to charity, with witnesses" },
      "effects": { "popularity": 7, "reputation": 2, "notoriete": 1, "reseau": -1, "energie": -1 },
      "result": { "fr": "La photo de la remise circule bien. Votre ami comprend qu'il vient de financer votre communication.",
                  "en": "The handover photo travels well. Your friend realises he has just funded your public relations." } },
    { "label": { "fr": "Garder la montre, rendre les costumes", "en": "Keep the watch, return the suits" },
      "effects": { "money": 12000, "sangfroid": 1, "reputation": -1 },
      "result": { "fr": "Le compromis moral le plus courant de la vie politique, et le plus difficile à expliquer.",
                  "en": "The most common moral compromise in politics, and the hardest to explain." } }
  ]
},

{
  "id": "vacances_officielles",
  "when": { "position": ["depute", "ministre", "chef"], "minMoney": 50000 },
  "tag": { "fr": "Vacances", "en": "Holidays" },
  "text": {
    "fr": "Vous êtes invité une semaine dans un pays ami, avion privé et villa avec vue. Le régime en question emprisonne ses journalistes, mais son ambassadeur insiste sur la qualité de la lumière en cette saison.",
    "en": "You are invited for a week to a friendly country, private jet and a villa with a view. The regime in question jails its journalists, but its ambassador insists on the quality of the light at this time of year."
  },
  "choices": [
    { "label": { "fr": "Y aller et se reposer vraiment", "en": "Go, and actually rest" },
      "effects": { "energie": 3, "money": 20000, "reputation": -2, "popularity": -7, "reseau": 1 },
      "result": { "fr": "Vous revenez bronzé et en forme. Une photo du yacht circulera au pire moment, comme toujours.",
                  "en": "You come back tanned and rested. A photo of the yacht will surface at the worst possible moment, as they always do." } },
    { "label": { "fr": "Y aller et parler des prisonniers politiques", "en": "Go, and raise the political prisoners" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 10, "reputation": 2, "reseau": -1, "energie": -1 },
        "result": { "fr": "Deux détenus sont libérés le mois suivant. Personne ne saura jamais si c'est grâce à vous, et vous laisserez dire.",
                    "en": "Two detainees are released the following month. Nobody will ever know whether it was thanks to you, and you will let people assume." } },
      "failure": { "effects": { "popularity": -5, "reseau": -2, "standing": -4, "energie": -1 },
        "result": { "fr": "On vous écoute poliment et on ne vous rappelle plus. Votre ministère des affaires étrangères vous en veut.",
                    "en": "They listen politely and never call again. Your own foreign ministry is furious with you." } } },
    { "label": { "fr": "Refuser publiquement l'invitation", "en": "Turn the invitation down publicly" },
      "effects": { "popularity": 9, "reputation": 2, "reseau": -2, "energie": -1, "standing": -4 },
      "result": { "fr": "Votre lettre de refus est reprise partout. Trois collègues qui y allaient chaque année vous détestent désormais.",
                  "en": "Your refusal letter is quoted everywhere. Three colleagues who went every year now detest you." } },
    { "label": { "fr": "Envoyer un collaborateur à votre place", "en": "Send a staffer instead" },
      "effects": { "reseau": 1, "energie": 1, "reputation": -1, "standing": 2 },
      "result": { "fr": "Il revient enchanté et vous rapporte trois contacts utiles. Techniquement, vous n'y étiez pas.",
                  "en": "He comes back delighted with three useful contacts. Technically, you were not there." } }
  ]
},

/* ==========================================================================
   14. LE RAPPORT DE FORCE
   ==========================================================================
   Ces événements ne déplacent pas seulement vos jauges : ils déplacent les
   intentions de vote entre les partis. Un débat gagné, un cadre débauché, une
   scission, un pacte, tout cela finit dans le tableau du paysage politique, et
   le tableau finit dans les urnes. C'est ici que la partie cesse d'être une
   carrière personnelle pour devenir une bataille entre camps.
   ========================================================================== */

{
  "id": "debat_televise",
  "weight": 4,
  "cast": "leader",
  "when": { "position": ["maire", "euro", "depute", "ministre", "chef"], "minTurn": 8 },
  "tag": { "fr": "Face-à-face", "en": "Head to head" },
  "text": {
    "fr": "Une chaîne d'information vous met face à {rival}. Une heure de direct, deux équipes qui ont préparé les mêmes phrases et un présentateur qui espère un incident.",
    "en": "A news channel puts you opposite {rival}. One hour live, two teams that have prepared the same lines and a host hoping for an incident."
  },
  "choices": [
    { "label": { "fr": "Aller le chercher sur son terrain", "en": "Take them on their own ground" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "strike": "intrepide", "popularity": 9, "notoriete": 1, "landscape": { "self": 1.6, "scene": -1.6 } },
        "result": { "fr": "Vous connaissez ses chiffres mieux que lui. À la fin de la séquence, il parle de sa famille, ce qui est toujours le signe qu'un débat est perdu.",
                    "en": "You know their figures better than they do. By the end of the segment they are talking about their family, which is always the sign of a debate lost." } },
      "failure": { "effects": { "credibilite": -2, "strike": "intrepide", "popularity": -7, "energie": -1, "landscape": { "self": -1.3, "scene": 1.3 } },
        "result": { "fr": "Vous vous avancez sur un dossier que vous maîtrisez mal. La correction est polie et elle passe en boucle pendant deux jours.",
                    "en": "You venture onto a file you do not really command. The correction is polite and it runs on a loop for two days." } } },
    { "label": { "fr": "Rester courtois et le laisser se découvrir", "en": "Stay courteous and let them expose themselves" },
      "effects": { "credibilite": +2, "reputation": 1, "sangfroid": 1, "popularity": 3, "standing": 3, "landscape": { "self": 0.5 } },
      "result": { "fr": "Personne ne retiendra une réplique, ce qui est exactement ce que votre entourage espérait. Le lendemain, les éditorialistes vous trouvent présidentiable, faute de mieux.",
                  "en": "Nobody will remember a single line, which is exactly what your staff was hoping for. The next day the columnists find you presidential, for want of anything better." } },
    { "label": { "fr": "Transformer le débat en moment de télévision", "en": "Turn the debate into television" },
      "when": { "personality": ["provocative"] },
      "effects": { "credibilite": -2, "notoriete": 2, "popularity": 8, "reputation": -2, "standing": -5,
                   "landscape": { "self": 2.2, "scene": -1.4 } },
      "result": { "fr": "Vous coupez, vous riez, vous refusez de répondre. La séquence dépasse le million de vues avant la fin de la nuit et votre parti met une journée à décider s'il doit s'en réjouir.",
                  "en": "You cut in, you laugh, you refuse to answer. The clip passes a million views before the night is out and your party takes a day to decide whether to be pleased." } },
    { "label": { "fr": "Lui proposer un accord en coulisses avant l'antenne", "en": "Offer a backstage deal before you go on air" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "standing": 8, "popularity": -2, "landscape": { "self": 0.8, "scene": 0.6 } },
        "result": { "fr": "Vous convenez des sujets à éviter. Le débat est terne, les deux appareils sont ravis, et le pays a passé une heure devant deux personnes qui s'épargnaient.",
                    "en": "You agree on the subjects to avoid. The debate is dull, both machines are delighted, and the country has spent an hour watching two people spare each other." } },
      "failure": { "effects": { "reputation": -2, "popularity": -5, "landscape": { "scene": 1.5 } },
        "result": { "fr": "Il accepte, puis attaque dès la première minute sur ce que vous veniez d'exclure. On ne signe rien dans un couloir.",
                    "en": "They agree, then attack in the first minute on the very thing you had just ruled out. Nothing signed in a corridor is signed." } } },
    { "label": { "fr": "Se décommander la veille", "en": "Pull out the night before" },
      "when": { "trait": ["lache"] },
      "effects": { "credibilite": -2, "energie": 2, "popularity": -4, "standing": -2, "sangfroid": 1 },
      "result": { "fr": "Une extinction de voix providentielle, un certificat, et une chaise vide en face de lui pendant une heure. Vous n'avez rien perdu ce soir-là, ce qui est déjà mieux que la moitié de ceux qui y sont allés.",
                  "en": "A providential loss of voice, a doctor's note, and an empty chair opposite him for an hour. You lost nothing that evening, which is more than half the people who turned up can say." } }
  ]
},

{
  "id": "debauchage_cadre",
  "weight": 3,
  "cast": "opponent",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 12, "minStanding": 45 },
  "tag": { "fr": "Débauchage", "en": "Poaching" },
  "text": {
    "fr": "{rival} n'a plus d'avenir chez lui et le sait. Un déjeuner est organisé, sans témoin, par quelqu'un qui connaît vos deux numéros.",
    "en": "{rival} has no future left where he is, and knows it. A lunch is arranged, with no witnesses, by somebody who has both your numbers."
  },
  "choices": [
    { "label": { "fr": "Lui offrir une circonscription gagnable", "en": "Offer them a winnable seat" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.4, "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "reseau": 1, "standing": -2, "landscape": { "self": 2.1, "scene": -2.1 } },
        "result": { "fr": "Il annonce son ralliement un mardi matin, devant les caméras que vous aviez prévenues. Dans votre parti, celui à qui la circonscription était promise apprend la nouvelle à la radio.",
                    "en": "They announce the switch on a Tuesday morning, in front of cameras you had tipped off. In your own party, the person the seat had been promised to hears it on the radio." } },
      "failure": { "effects": { "standing": -6, "reputation": -1, "landscape": { "scene": 0.8 } },
        "result": { "fr": "Il fait monter les enchères chez lui avec votre offre en poche, obtient ce qu'il voulait et reste. Vous avez négocié sa promotion dans le camp d'en face.",
                    "en": "They use your offer to raise the stakes at home, get what they wanted and stay. You have negotiated a promotion for somebody on the other side." } } },
    { "label": { "fr": "Refuser de mélanger les familles", "en": "Refuse to mix the families" },
      "effects": { "reputation": 2, "standing": 5, "popularity": -2 },
      "result": { "fr": "Vous expliquez qu'on ne se construit pas avec les déçus des autres. La formule est belle et vous coûtera un siège dans quatre ans.",
                  "en": "You explain that you do not build anything with other people's rejects. The line is a good one and it will cost you a seat in four years." } },
    { "label": { "fr": "Lui promettre plus que ce que vous pouvez tenir", "en": "Promise more than you can deliver" },
      "effects": { "notoriete": 1, "popularity": 3, "reputation": -2, "strike": "menteur",
                   "landscape": { "self": 1.8, "scene": -1.6 } },
      "result": { "fr": "Un ministère, dites-vous, si tout se passe bien. Il vient, il le répète autour de lui, et il commence à compter les mois.",
                  "en": "A ministry, you say, if all goes well. They come over, they repeat it to everyone, and they start counting the months." } }
  ]
},

{
  "id": "debauchage_joueur",
  "weight": 3,
  "cast": "leader",
  "when": { "position": ["maire", "euro", "depute", "ministre"], "minTurn": 14, "maxStanding": 62, "notTrait": ["renegat"] },
  "tag": { "fr": "On vous fait signe", "en": "A hand is extended" },
  "text": {
    "fr": "{rival} vous fait porter un message : chez eux, on vous trouve mal employé. Il ne parle pas d'un poste, il parle d'un avenir, ce qui coûte moins cher.",
    "en": "{rival} sends word: on their side, they think you are being wasted. They do not mention a post, they mention a future, which costs less."
  },
  "choices": [
    { "label": { "fr": "Refuser, et le raconter à votre parti", "en": "Refuse, and tell your own party" },
      "effects": { "standing": 10, "popularity": -2, "reputation": 1, "landscape": { "scene": -0.7 } },
      "result": { "fr": "Votre fidélité est citée en réunion de groupe pendant un mois. Vous savez maintenant ce qu'elle vaut, et eux aussi.",
                  "en": "Your loyalty is quoted in group meetings for a month. You now know what it is worth, and so do they." } },
    { "label": { "fr": "Refuser sans rien dire à personne", "en": "Refuse and tell nobody" },
      "effects": { "sangfroid": 1, "reseau": 1, "standing": 2 },
      "result": { "fr": "Vous déclinez poliment et vous gardez le numéro. Une porte qu'on n'a pas claquée reste une porte.",
                  "en": "You decline politely and you keep the number. A door you did not slam is still a door." } },
    { "label": { "fr": "Traverser", "en": "Cross the floor" },
      "effects": { "join": "scene", "notoriete": 2, "popularity": 6 },
      "result": { "fr": "L'annonce est faite un jeudi, dans une salle louée pour l'occasion. Ceux qui vous ont formé regardent la retransmission sans un mot, et se souviendront de la date jusqu'à la fin.",
                  "en": "The announcement comes on a Thursday, in a room hired for the occasion. The people who trained you watch the feed in silence, and will remember the date for good." } },
    { "label": { "fr": "Faire monter les enchères des deux côtés", "en": "Run an auction between the two" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 17, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 11, "money": 30000, "reputation": -1, "reseau": 1 },
        "result": { "fr": "Vous restez, avec une place au bureau politique et une chronique mensuelle dans le journal du parti. Personne ne saura jamais que vous étiez à deux doigts de partir.",
                    "en": "You stay, with a seat on the executive and a monthly column in the party paper. Nobody will ever know how close you came to leaving." } },
      "failure": { "effects": { "standing": -16, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "Les deux directions se parlent plus souvent que vous ne le croyiez. Vous restez, et vous êtes désormais celui qui avait déjà un pied dehors.",
                    "en": "The two leaderships talk to each other more than you thought. You stay, and you are now the one who already had a foot outside." } } }
  ]
},

{
  "id": "pacte_electoral",
  "weight": 3,
  "cast": "leader",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 16, "minStanding": 48, "allied": false },
  "tag": { "fr": "Accord", "en": "The deal" },
  "text": {
    "fr": "{rival} propose un accord entre {party} et {rival_party} : des désistements, un programme commun de deux pages et une photo. Les deux appareils y voient chacun le moyen d'absorber l'autre.",
    "en": "{rival} proposes a deal between {party} and {rival_party}: mutual withdrawals, a two-page joint platform and a photograph. Each machine sees it as a way of absorbing the other."
  },
  "choices": [
    { "label": { "fr": "Signer", "en": "Sign" },
      "effects": { "alliance": "scene", "standing": 5, "reputation": -1, "landscape": { "self": 1.2, "ally": 0.6 } },
      "result": { "fr": "La photo est prise sur un perron, à distance réglementaire. Vos militants applaudissent, vos militants les plus anciens applaudissent moins.",
                  "en": "The photograph is taken on a doorstep, at a carefully measured distance. Your members applaud; your oldest members applaud less." } },
    { "label": { "fr": "Refuser et rester seul", "en": "Refuse and stand alone" },
      "effects": { "reputation": 2, "popularity": 3, "standing": -4 },
      "result": { "fr": "Vous expliquez que votre camp n'a besoin de personne, ce qui est faux et se vérifiera au second tour.",
                  "en": "You explain that your side needs nobody, which is untrue and will be checked at the runoff." } },
    { "label": { "fr": "Signer, mais aux conditions les plus dures", "en": "Sign, but on the hardest terms" },
      "roll": { "base": 20, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "alliance": "scene", "standing": 7, "landscape": { "self": 2.4, "scene": -1 } },
        "result": { "fr": "Ils cèdent sur les circonscriptions, sur le calendrier et sur le titre du document. Un accord entre égaux, disent les communiqués, et tout le monde a compris qui était l'égal.",
                    "en": "They give way on the seats, on the timetable and on the title of the document. A deal between equals, say the statements, and everyone has understood who the equal was." } },
      "failure": { "effects": { "standing": -10, "popularity": -5, "landscape": { "self": -1.2, "scene": 1.2 } },
        "result": { "fr": "La négociation s'enlise puis fuite dans la presse, avec vos exigences en gras. On retient que vous avez fait échouer l'union.",
                    "en": "The talks bog down and then leak, your demands in bold. What sticks is that you were the one who broke up the alliance." } } }
  ]
},

{
  "id": "pacte_rupture",
  "weight": 4,
  "when": { "allied": true, "minTurn": 20 },
  "tag": { "fr": "L'accord craque", "en": "The deal cracks" },
  "text": {
    "fr": "Votre allié vote contre vous sur un texte auquel personne ne comprend rien, puis explique en plateau que l'accord ne l'engageait pas sur ce point. Vos équipes demandent une réponse avant ce soir.",
    "en": "Your ally votes against you on a bill nobody understands, then explains on air that the deal did not commit them on that point. Your staff want an answer before the evening."
  },
  "choices": [
    { "label": { "fr": "Rompre publiquement", "en": "Break it off publicly" },
      "effects": { "alliance": null, "popularity": 5, "standing": -3, "landscape": { "self": -0.8 } },
      "result": { "fr": "Vous reprenez votre liberté devant les caméras, ce qui est une belle façon de dire que vous n'avez plus personne derrière vous.",
                  "en": "You take back your freedom in front of the cameras, which is a fine way of saying there is nobody behind you any more." } },
    { "label": { "fr": "Encaisser et tenir l'accord", "en": "Take it and hold the deal together" },
      "effects": { "sangfroid": 1, "popularity": -4, "standing": 4 },
      "result": { "fr": "Vous parlez de désaccord ponctuel entre partenaires. La formule ne trompe personne, et surtout pas votre allié, qui recommencera.",
                  "en": "You call it a one-off disagreement between partners. The phrase fools nobody, least of all your ally, who will do it again." } },
    { "label": { "fr": "Retourner l'incident et absorber leur électorat", "en": "Turn it around and absorb their voters" },
      "roll": { "base": 18, "stat": "charisme", "plus": { "eloquence": 0.5, "popularity": 0.06 }, "dice": 16 },
      "success": { "effects": { "popularity": 6, "landscape": { "self": 2.6, "ally": -2.6 } },
        "result": { "fr": "Vous vous adressez directement à leurs électeurs par-dessus leur direction. Une partie d'entre eux ne repartira pas.",
                    "en": "You speak directly to their voters over the heads of their leadership. Some of them are not going back." } },
      "failure": { "effects": { "alliance": null, "popularity": -5, "standing": -6, "landscape": { "self": -1.2 } },
        "result": { "fr": "La manœuvre est trop visible. L'accord saute le soir même et vous êtes celui par qui c'est arrivé.",
                    "en": "The manoeuvre is too obvious. The deal collapses that evening and you are the reason it did." } } }
  ]
},

{
  "id": "scission",
  "weight": 3,
  "cast": "leader",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 18 },
  "tag": { "fr": "Scission", "en": "The split" },
  "text": {
    "fr": "Une aile de {party} claque la porte et annonce qu'elle rejoint {rival_party}. Ils sont une quinzaine, ils ont des fédérations entières derrière eux et ils tiennent une conférence de presse à l'heure du déjeuner.",
    "en": "A wing of {party} walks out and announces it is joining {rival_party}. There are about fifteen of them, they have whole local branches behind them, and they hold a press conference at lunchtime."
  },
  "choices": [
    { "label": { "fr": "Les laisser partir et resserrer les rangs", "en": "Let them go and close ranks" },
      "effects": { "standing": 6, "popularity": -3, "landscape": { "self": -2.4, "scene": 1.6 } },
      "result": { "fr": "Un parti plus petit et plus obéissant, dites-vous à la tribune. Ceux qui restent applaudissent, personne ne compte les chaises vides.",
                  "en": "A smaller and more obedient party, you tell the hall. Those who stayed applaud, and nobody counts the empty chairs." } },
    { "label": { "fr": "Aller les rechercher un par un", "en": "Go and get them back one by one" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "charisme": 0.4, "energie": 0.3 }, "dice": 16 },
      "success": { "effects": { "energie": -2, "reseau": 1, "standing": 6, "landscape": { "self": -0.6, "scene": 0.4 } },
        "result": { "fr": "Trois semaines de coups de téléphone et de dîners. La moitié revient, la moitié de celle-là avec une promesse écrite.",
                    "en": "Three weeks of phone calls and dinners. Half of them come back, and half of those with something in writing." } },
      "failure": { "effects": { "energie": -2, "popularity": -4, "landscape": { "self": -3, "scene": 2.2 } },
        "result": { "fr": "Vos appels sont racontés dans la presse le lendemain, avec vos arguments et le ton de votre voix. Deux autres partent en apprenant que vous suppliez.",
                    "en": "Your calls are in the papers the next day, with your arguments and the tone of your voice. Two more leave on learning that you beg." } } },
    { "label": { "fr": "Les accuser d'avoir été achetés", "en": "Accuse them of having been bought" },
      "effects": { "notoriete": 1, "popularity": 4, "reputation": -2, "landscape": { "self": -1.4, "scene": -0.8 } },
      "result": { "fr": "Vous parlez de postes promis et de dîners en ville, sans citer de noms parce que vous n'en avez pas. Le camp d'en face passe la semaine à se défendre au lieu de fêter ses recrues.",
                  "en": "You talk about promised jobs and dinners in town, without naming anyone because you have no names. The other side spends the week defending itself instead of celebrating its recruits." } }
  ]
},

/* ==========================================================================
   15. BRUXELLES
   ==========================================================================
   Le Parlement européen est le meilleur endroit du monde pour ranger
   quelqu'un : le mandat est important, l'indemnité est confortable, le travail
   est réel, et personne dans le pays ne saura jamais ce que vous y avez fait.
   ========================================================================== */

{
  "id": "liste_europeenne",
  "once": true,
  "weight": 4,
  "when": { "position": ["maire", "depute"], "minTurn": 10 },
  "tag": { "fr": "Tête de liste", "en": "Top of the list" },
  "text": {
    "fr": "La direction cherche une tête de liste aux européennes. On vous parle de dimension internationale, de dossiers d'avenir et de reconnaissance. Le poste est à Bruxelles, et vos électeurs sont ici."
    ,
    "en": "The leadership is looking for someone to top the European list. They talk about an international dimension, about the files of the future, about recognition. The job is in Brussels, and your voters are here."
  },
  "choices": [
    { "label": { "fr": "Accepter la tête de liste", "en": "Take the top spot" },
      "effects": { "office": "euro", "notoriete": 1, "standing": 6, "popularity": -5, "eloquence": 1 },
      "result": { "fr": "Vous êtes élu confortablement, sur un scrutin dont personne n'a suivi la campagne. Le soir des résultats, la chaîne consacre quatre minutes au sujet.",
                  "en": "You are comfortably elected, in a contest whose campaign nobody followed. On results night the channel gives the subject four minutes." } },
    { "label": { "fr": "Refuser et rester au pays", "en": "Refuse and stay at home" },
      "effects": { "standing": -9, "popularity": 3, "reputation": 1 },
      "result": { "fr": "Vous répondez que votre travail est ici. La direction note votre réponse dans un carnet qu'elle rouvrira au moment des investitures.",
                  "en": "You answer that your work is here. The leadership notes your reply in a book it will open again when nominations come round." } },
    { "label": { "fr": "Accepter en échange d'une place au bureau politique", "en": "Accept in exchange for a seat on the executive" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.06, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "office": "euro", "standing": 11, "reseau": 1, "popularity": -4 },
        "result": { "fr": "Vous partez à Bruxelles avec un siège permanent dans l'instance qui décide de tout ici. On voulait vous éloigner, on vous a donné une clé.",
                    "en": "You leave for Brussels with a permanent seat in the body that decides everything back home. They wanted you out of the way; they gave you a key." } },
      "failure": { "effects": { "standing": -12, "reputation": -1 },
        "result": { "fr": "On vous répond que la tête de liste est déjà un cadeau. Elle est attribuée le lendemain à quelqu'un qui n'avait rien demandé.",
                    "en": "You are told that the top of the list is already a gift. It goes the next day to somebody who had asked for nothing." } } }
  ]
},

{
  "id": "bruxelles_arrivee",
  "once": true,
  "weight": 5,
  "when": { "position": ["euro"] },
  "tag": { "fr": "Première session", "en": "First session" },
  "text": {
    "fr": "Première session à Strasbourg. Sept cent trente collègues, vingt-quatre langues, un vote toutes les quarante secondes sur des amendements que personne autour de vous n'a lus en entier.",
    "en": "First session in Strasbourg. Seven hundred and thirty colleagues, twenty-four languages, a vote every forty seconds on amendments nobody around you has read in full."
  },
  "choices": [
    { "label": { "fr": "Apprendre le métier pour de bon", "en": "Learn the job properly" },
      "effects": { "eloquence": 1, "sangfroid": 1, "reputation": 2, "energie": -2, "popularity": -2, "standing": 3 },
      "result": { "fr": "Six mois de commissions et de textes techniques. Vous devenez l'une des rares personnes du pays à comprendre ce qui se décide ici, ce qui n'intéresse strictement personne chez vous.",
                  "en": "Six months of committees and technical texts. You become one of the few people in the country who understands what is decided here, which interests absolutely nobody back home." } },
    { "label": { "fr": "Faire du Parlement une tribune nationale", "en": "Use the Parliament as a national platform" },
      "roll": { "base": 14, "stat": "notoriete", "plus": { "eloquence": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 7, "reputation": -1, "landscape": { "self": 0.8 } },
        "result": { "fr": "Vos interventions sont filmées pour être vues à la maison, pas dans l'hémicycle. Une d'entre elles tourne pendant trois jours et vous rappelle à l'existence.",
                    "en": "Your speeches are filmed to be watched at home, not in the chamber. One of them runs for three days and reminds people you exist." } },
      "failure": { "effects": { "popularity": -3, "reputation": -1, "energie": -1 },
        "result": { "fr": "Vous parlez trois minutes dans un hémicycle vide, à onze heures du soir, devant une interprète qui fait son travail consciencieusement.",
                    "en": "You speak for three minutes in an empty chamber, at eleven at night, to an interpreter doing her job conscientiously." } } },
    { "label": { "fr": "Rentrer tous les jeudis soir et tenir la circonscription", "en": "Fly home every Thursday and hold the constituency" },
      "effects": { "energie": -2, "reseau": 1, "popularity": 4, "standing": -3 },
      "result": { "fr": "Deux vies, deux valises, deux permanences. Vous dormez dans le train et vous êtes le seul de votre promotion à savoir encore le nom du boulanger.",
                  "en": "Two lives, two suitcases, two offices. You sleep on the train and you are the only one of your intake who still knows the baker's name." } }
  ]
},

{
  "id": "directive_lobby",
  "weight": 4,
  "when": { "position": ["euro"], "minTurn": 4 },
  "tag": { "fr": "Amendement", "en": "The amendment" },
  "text": {
    "fr": "Un cabinet de conseil vous propose un amendement tout rédigé sur une directive dont personne ne parlera jamais. Il tient en quatre lignes, il change une définition, et il vaut des centaines de millions à quelqu'un.",
    "en": "A consultancy hands you a pre-drafted amendment to a directive nobody will ever discuss. It runs to four lines, it changes one definition, and it is worth hundreds of millions to somebody."
  },
  "choices": [
    { "label": { "fr": "Le déposer tel quel", "en": "Table it as written" },
      "effects": { "money": 60000, "reseau": 1, "reputation": -2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "L'amendement passe en commission un mardi matin, sans débat. Vous êtes invité à un colloque à Lisbonne, tous frais payés, sur un sujet voisin.",
                  "en": "The amendment goes through committee on a Tuesday morning, without debate. You are invited to a conference in Lisbon, expenses paid, on a related subject." } },
    { "label": { "fr": "Le réécrire dans l'intérêt général", "en": "Rewrite it in the public interest" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "reputation": 3, "eloquence": 1, "standing": -3, "popularity": 4 },
        "result": { "fr": "Votre version protège ce que la leur vidait. Elle passe de justesse, et le cabinet de conseil cesse de répondre à vos messages.",
                    "en": "Your version protects what theirs quietly emptied. It passes narrowly, and the consultancy stops answering your messages." } },
      "failure": { "effects": { "reputation": 1, "energie": -1, "standing": -4 },
        "result": { "fr": "Votre rédaction est jugée irrecevable pour un motif de procédure. Celle du cabinet est adoptée la semaine suivante par quelqu'un d'autre.",
                    "en": "Your drafting is ruled inadmissible on procedure. The consultancy's version is adopted the following week by somebody else." } } },
    { "label": { "fr": "Le rendre public", "en": "Make it public" },
      "effects": { "notoriete": 2, "popularity": 9, "reputation": 2, "standing": -8, "reseau": -1, "chain": "position_impopulaire" },
      "result": { "fr": "Vous publiez le document et le nom du cabinet. Deux journaux en font leur titre, quatre collègues cessent de vous parler et votre groupe vous retire un rapport.",
                  "en": "You publish the document and the name of the firm. Two papers lead on it, four colleagues stop speaking to you and your group takes a report away from you." } }
  ]
},

{
  "id": "absent_circonscription",
  "weight": 4,
  "when": { "position": ["euro"], "minTurn": 6 },
  "tag": { "fr": "Au pays", "en": "Back home" },
  "text": {
    "fr": "Un journal local publie le décompte de vos apparitions dans la région depuis votre élection. Le chiffre est exact, le titre est cruel, et la photo est celle d'une salle vide.",
    "en": "A local paper publishes a count of your appearances in the region since you were elected. The number is accurate, the headline is cruel, and the photograph is of an empty room."
  },
  "choices": [
    { "label": { "fr": "Passer trois mois sur le terrain", "en": "Spend three months on the ground" },
      "effects": { "energie": -3, "popularity": 8, "reseau": 1, "standing": -2 },
      "result": { "fr": "Marchés, comices, remises de médailles. Vous manquez la moitié des votes en commission, ce dont personne ici ne vous parlera jamais.",
                  "en": "Markets, county shows, medal ceremonies. You miss half your committee votes, which nobody here will ever mention to you." } },
    { "label": { "fr": "Répondre par votre bilan européen", "en": "Answer with your European record" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "reputation": 2, "popularity": 3, "notoriete": 1 },
        "result": { "fr": "Vous racontez un dossier concret et une usine sauvée. Le journal publie la réponse en page cinq, ce qui est déjà une victoire.",
                    "en": "You tell the story of a real file and a factory saved. The paper runs your answer on page five, which is already a win." } },
      "failure": { "effects": { "popularity": -6, "reputation": -1 },
        "result": { "fr": "Vous citez trois directives et un règlement. Le lecteur retient que vous n'étiez pas là et que vous parlez comme un document.",
                    "en": "You cite three directives and a regulation. The reader takes away that you were not there and that you talk like a document." } } },
    { "label": { "fr": "Payer une agence pour occuper le terrain à votre place", "en": "Pay an agency to hold the ground for you" },
      "when": { "minMoney": 90000 },
      "effects": { "money": -55000, "popularity": 5, "reputation": -1 },
      "result": { "fr": "Une permanence rouvre, un compte local publie tous les jours, deux jeunes tiennent les réunions. On vous voit partout et vous n'y êtes jamais.",
                  "en": "An office reopens, a local account posts every day, two young staffers run the meetings. You are seen everywhere and you are never there." } }
  ]
},

{
  "id": "vote_strasbourg",
  "weight": 3,
  "when": { "position": ["euro"], "minTurn": 8 },
  "tag": { "fr": "Consigne de vote", "en": "The whip" },
  "text": {
    "fr": "Votre groupe européen vote pour un texte que votre parti combat à la maison depuis dix ans. Les deux consignes arrivent le même matin, signées de deux personnes qui se sont parlé.",
    "en": "Your European group is voting for a text your party has fought at home for ten years. Both instructions arrive the same morning, signed by two people who have spoken to each other."
  },
  "choices": [
    { "label": { "fr": "Suivre la ligne nationale", "en": "Follow the national line" },
      "effects": { "standing": 6, "reputation": -1, "popularity": -3 },
      "result": { "fr": "Vous votez contre votre groupe et vous perdez la vice-présidence d'une commission dont vos électeurs ignorent l'existence. La direction du parti, elle, a compté votre vote.",
                  "en": "You vote against your group and lose the vice-chair of a committee your voters have never heard of. The party leadership, on the other hand, counted your vote." } },
    { "label": { "fr": "Suivre le groupe européen", "en": "Follow the European group" },
      "effects": { "reseau": 2, "reputation": 3, "standing": -5, "eloquence": 1, "popularity": 3 },
      "result": { "fr": "Vous votez avec vos collègues et vous expliquez pourquoi dans une tribune que trois personnes liront à Paris. Deux d'entre elles siègent au bureau politique.",
                  "en": "You vote with your colleagues and explain why in an op-ed three people will read at home. Two of them sit on the executive." } },
    { "label": { "fr": "Ne pas prendre part au vote et le faire savoir", "en": "Abstain, loudly" },
      "effects": { "strike": "lache", "sangfroid": 1, "standing": -3, "popularity": -3, "reputation": -1 },
      "result": { "fr": "Vous publiez un communiqué de quatre paragraphes pour expliquer une abstention. Les deux camps y lisent une lâcheté et se trompent rarement.",
                  "en": "You put out four paragraphs to explain an abstention. Both sides read it as cowardice, and they are rarely wrong." } },
    { "label": { "fr": "Faire du vote une affaire nationale", "en": "Turn the vote into a national story" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 2, "popularity": 8, "standing": -10, "landscape": { "self": 1.2 } },
      "result": { "fr": "Vous quittez l'hémicycle en direct avec une pancarte. La séquence passe au journal de vingt heures chez vous, ce qui n'était jamais arrivé pour un vote européen.",
                  "en": "You walk out live, holding a placard. The clip runs on the evening news back home, which had never happened for a European vote." } }
  ]
},

/* ==========================================================================
   16. LE GOUVERNEMENT
   ==========================================================================
   Un ministère ne s'élit pas : il se donne, et seulement quand votre camp
   gouverne. C'est la meilleure fonction du jeu et la plus fragile, parce
   qu'elle tombe le jour où le camp perd, et parce qu'on y porte le bilan de
   décisions qu'on n'a pas prises.
   ========================================================================== */

{
  "id": "entree_gouvernement",
  "once": true,
  "weight": 6,
  "when": { "ruling": true, "position": ["maire", "euro", "depute"], "minStanding": 50, "minTurn": 12 },
  "tag": { "fr": "Le téléphone sonne", "en": "The phone rings" },
  "text": {
    "fr": "Le secrétaire général de l'Élysée vous appelle un dimanche soir. On vous propose d'entrer au gouvernement, et on vous laisse le choix entre un grand ministère très exposé et un portefeuille technique dont personne n'a jamais fait tomber personne.",
    "en": "The president's chief secretary calls on a Sunday evening. You are offered a place in government, and given the choice between a big, exposed department and a technical brief that has never brought anyone down."
  },
  "choices": [
    { "label": { "fr": "Prendre le grand ministère", "en": "Take the big department" },
      "effects": { "credibilite": +2, "office": "ministre", "notoriete": 2, "standing": 6, "energie": -2, "popularity": 4 },
      "result": { "fr": "Passation de pouvoirs, discours de dix minutes, cinq cents fonctionnaires qui vous regardent en se demandant combien de temps vous resterez. La moyenne est de dix-neuf mois.",
                  "en": "A handover ceremony, a ten-minute speech, five hundred civil servants wondering how long you will last. The average is nineteen months." } },
    { "label": { "fr": "Prendre le portefeuille technique", "en": "Take the technical brief" },
      "effects": { "credibilite": +3, "office": "ministre", "reputation": 2, "sangfroid": 1, "standing": 4, "notoriete": 1 },
      "result": { "fr": "Un ministère sans caméras, avec un vrai budget et des décrets qui changent la vie de gens qui ne sauront jamais votre nom. Vous y survivrez à trois remaniements.",
                  "en": "A department with no cameras, a real budget and decrees that change the lives of people who will never learn your name. You will survive three reshuffles there." } },
    { "label": { "fr": "Refuser pour rester libre", "en": "Refuse, and stay free" },
      "effects": { "standing": -12, "popularity": 6, "reputation": 2, "sangfroid": 1 },
      "result": { "fr": "Vous répondez que vous serez plus utile dehors. C'est ce que disent tous ceux qui n'ont pas été appelés, à ceci près que vous l'avez été.",
                  "en": "You answer that you will be more use outside. That is what everyone says when they have not been called, except that you were." } }
  ]
},

{
  "id": "arbitrage_budgetaire",
  "weight": 4,
  "when": { "position": ["ministre"] },
  "tag": { "fr": "Arbitrage", "en": "The arbitration" },
  "text": {
    "fr": "Bercy vous demande de rendre une partie de votre budget. La réunion est prévue à dix-neuf heures, elle durera quarante minutes et ce qui s'y dira ne sortira jamais.",
    "en": "The Treasury wants part of your budget back. The meeting is set for seven in the evening, it will last forty minutes, and nothing said in it will ever come out."
  },
  "choices": [
    { "label": { "fr": "Défendre chaque ligne", "en": "Defend every line" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.5, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": +3, "standing": 6, "reputation": 2, "energie": -2, "popularity": 3 },
        "result": { "fr": "Vous sortez avec l'essentiel. Vos services l'apprennent à minuit et vous trouvent, pour la première fois, un vrai ministre.",
                    "en": "You come out with the essentials intact. Your officials hear about it at midnight and decide, for the first time, that you are a real minister." } },
      "failure": { "effects": { "credibilite": -2, "standing": -6, "energie": -2, "popularity": -4 },
        "result": { "fr": "On vous laisse parler vingt minutes puis on vous annonce le chiffre décidé la veille. Vous signez la lettre plafond le lendemain matin.",
                    "en": "You are allowed to talk for twenty minutes, then given the number that was decided the day before. You sign the ceiling letter the next morning." } } },
    { "label": { "fr": "Céder et négocier autre chose en échange", "en": "Give way and trade it for something else" },
      "effects": { "reseau": 2, "standing": 6, "reputation": -1, "popularity": -3 },
      "result": { "fr": "Vous rendez l'argent contre une promesse de nomination et un déplacement présidentiel dans votre ancienne circonscription. Personne n'a rien vu passer.",
                  "en": "You hand back the money in exchange for a promised appointment and a presidential visit to your old constituency. Nothing was visible from outside." } },
    { "label": { "fr": "Faire fuiter les coupes dans la presse", "en": "Leak the cuts to the press" },
      "effects": { "credibilite": -2, "notoriete": 1, "popularity": 7, "standing": -12, "reputation": -1,
                   "landscape": { "ruling": -1.2 } },
      "result": { "fr": "Les chiffres sortent le jeudi, attribués à un proche du dossier. Tout le monde sait que c'est vous, personne ne peut le prouver, et le ministère garde son budget.",
                  "en": "The figures come out on Thursday, sourced to someone close to the file. Everyone knows it was you, nobody can prove it, and the department keeps its budget." } },
    { "label": { "fr": "Menacer de démissionner sur-le-champ", "en": "Threaten to resign on the spot" },
      "when": { "trait": ["intrepide"] },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "popularity": 0.06, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": +1, "standing": 12, "notoriete": 1, "popularity": 4 },
        "result": { "fr": "Vous posez votre lettre sur la table et vous vous levez. On vous rattrape avant la porte, et votre budget avec vous.",
                    "en": "You put your letter on the table and stand up. They catch you before the door, and your budget with you." } },
      "failure": { "effects": { "credibilite": -2, "office": "none", "standing": -10, "popularity": 3 },
        "result": { "fr": "Vous posez votre lettre sur la table et vous vous levez. Personne ne vous rattrape, et la lettre est publiée à dix-huit heures.",
                    "en": "You put your letter on the table and stand up. Nobody catches you, and the letter is published at six." } } }
  ]
},

{
  "id": "couac_gouvernemental",
  "weight": 4,
  "when": { "position": ["ministre"], "minTurn": 4 },
  "tag": { "fr": "Solidarité gouvernementale", "en": "Collective responsibility" },
  "text": {
    "fr": "Le gouvernement annonce une mesure que vous combattez depuis toujours. On vous demande de la défendre à la matinale de huit heures vingt, en direct, demain.",
    "en": "The government announces a measure you have opposed your whole life. You are asked to defend it on the eight-twenty breakfast show, live, tomorrow."
  },
  "choices": [
    { "label": { "fr": "La défendre point par point", "en": "Defend it point by point" },
      "effects": { "standing": 6, "reputation": -2, "popularity": -5, "eloquence": 1 },
      "result": { "fr": "Vous êtes bon, ce qui est le pire. La séquence servira d'archive contre vous pendant quinze ans.",
                  "en": "You are good, which is the worst part. The clip will be used against you as archive footage for fifteen years." } },
    { "label": { "fr": "Prendre vos distances en direct", "en": "Distance yourself on air" },
      "effects": { "popularity": 8, "reputation": 2, "standing": -14, "notoriete": 1, "chain": "position_impopulaire" },
      "result": { "fr": "Vous dites que ce n'est pas votre choix. Matignon apprend la nouvelle en même temps que les auditeurs et le fait savoir avant midi.",
                  "en": "You say it was not your choice. The prime minister's office learns about it at the same time as the listeners and lets it be known before noon." } },
    { "label": { "fr": "Annuler et vous faire porter pâle", "en": "Cancel and call in sick" },
      "effects": { "strike": "lache", "sangfroid": -1, "popularity": -2, "standing": -3, "energie": 1 },
      "result": { "fr": "Votre cabinet invoque un déplacement imprévu. Le présentateur laisse la chaise vide à l'écran pendant toute l'émission.",
                  "en": "Your office cites an unexpected trip. The presenter leaves the empty chair on screen for the whole programme." } },
    { "label": { "fr": "La défendre en la vidant de son contenu", "en": "Defend it while emptying it out" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "sangfroid": 0.5 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "popularity": 4, "sangfroid": 1 },
        "result": { "fr": "Vous soutenez la mesure et vous annoncez tant d'exceptions qu'il n'en reste rien. Les deux camps vous remercient, ce qui n'arrive jamais.",
                    "en": "You back the measure and announce so many exemptions that nothing survives. Both sides thank you, which never happens." } },
      "failure": { "effects": { "standing": -8, "popularity": -4, "strike": "menteur" },
        "result": { "fr": "L'exercice est trop visible. On vous demande en fin d'entretien si vous êtes pour ou contre, et vous mettez quatre secondes à répondre.",
                    "en": "The exercise is too visible. You are asked at the end whether you are for or against, and you take four seconds to answer." } } }
  ]
},

{
  "id": "scandale_ministere",
  "weight": 3,
  "when": { "position": ["ministre"], "minTurn": 6 },
  "tag": { "fr": "Votre administration", "en": "Your department" },
  "text": {
    "fr": "Un marché public passé par votre ministère est attribué à une société dirigée par l'ancien collaborateur de votre prédécesseur. Vous découvrez le dossier en même temps que la presse, ce que personne ne croira.",
    "en": "A contract awarded by your department has gone to a company run by your predecessor's former adviser. You discover the file at the same time as the press, which nobody will believe."
  },
  "choices": [
    { "label": { "fr": "Saisir la justice vous-même", "en": "Refer it to the prosecutors yourself" },
      "effects": { "reputation": 3, "popularity": 5, "standing": -8, "energie": -1, "chain": "position_impopulaire" },
      "result": { "fr": "Vous transmettez le dossier au procureur avant la fin de la journée. Trois personnes de votre administration cessent de vous adresser la parole, et l'affaire s'arrête là.",
                  "en": "You send the file to the prosecutor before the end of the day. Three people in your department stop speaking to you, and the story dies there." } },
    { "label": { "fr": "Couvrir le service et gagner du temps", "en": "Cover the department and buy time" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.2 } ] },
      "success": { "effects": { "standing": 8, "reseau": 1, "reputation": -1 },
        "result": { "fr": "Une note interne, une inspection commandée à un ami, un rapport rendu dans onze mois. Le sujet meurt de sa belle mort.",
                    "en": "An internal note, an inspection commissioned from a friend, a report due in eleven months. The story dies of natural causes." } },
      "failure": { "effects": { "popularity": -10, "reputation": -2, "flags": { "dirtyMoney": true }, "chain": "enquete_ouverte" },
        "result": { "fr": "Le rapport fuite avant d'être rendu, avec vos annotations dans la marge. On ne vous reproche plus le marché, on vous reproche la marge.",
                    "en": "The report leaks before it is delivered, with your notes in the margin. Nobody blames you for the contract any more; they blame you for the margin." } } },
    { "label": { "fr": "Sacrifier votre directeur de cabinet", "en": "Sacrifice your chief of staff" },
      "effects": { "standing": 4, "reseau": -2, "popularity": 2, "reputation": -1, "sangfroid": 1 },
      "result": { "fr": "Il part le vendredi soir dans un communiqué de deux lignes, après onze ans de fidélité. Il connaît tout de vous et il vient d'avoir beaucoup de temps libre.",
                  "en": "He goes on Friday evening in a two-line statement, after eleven years of loyalty. He knows everything about you and he has just been given a great deal of free time." } },
    { "label": { "fr": "Partir en déplacement à l'étranger", "en": "Leave on a foreign trip" },
      "when": { "trait": ["lache"] },
      "effects": { "energie": -1, "popularity": -3, "standing": 5, "reputation": -1 },
      "result": { "fr": "Le dossier sort pendant que vous signez un accord à quatre mille kilomètres. Votre directeur de cabinet encaisse seul, et vous rentrez quand c'est fini.",
                  "en": "The story breaks while you are signing an agreement four thousand kilometres away. Your chief of staff takes it alone, and you come home when it is over." } }
  ]
},

{
  "id": "remaniement",
  "weight": 4,
  "when": { "position": ["ministre"], "minTurn": 8 },
  "tag": { "fr": "Remaniement", "en": "Reshuffle" },
  "text": {
    "fr": "Un remaniement se prépare. Votre nom circule dans les deux colonnes de la liste que tout le monde prétend ne pas avoir vue.",
    "en": "A reshuffle is coming. Your name is circulating in both columns of the list everybody claims not to have seen."
  },
  "choices": [
    { "label": { "fr": "Faire campagne dans les couloirs pour rester", "en": "Campaign in the corridors to stay" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.06 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "reseau": 1, "energie": -1 },
        "result": { "fr": "Vous restez, avec deux directions de plus dans votre périmètre. Trois collègues apprennent leur départ par un message d'un journaliste.",
                    "en": "You stay, with two more directorates in your brief. Three colleagues learn they are out from a journalist's text message." } },
      "failure": { "effects": { "office": "none", "standing": -8, "popularity": -4 },
        "result": { "fr": "Vous n'êtes pas sur la photo. Le chauffeur vient chercher la voiture à sept heures et le badge se désactive à midi.",
                    "en": "You are not in the photograph. The driver comes for the car at seven and the pass stops working at noon." } } },
    { "label": { "fr": "Demander un ministère plus lourd", "en": "Ask for a heavier portfolio" },
      "roll": { "base": 19, "stat": "sangfroid", "plus": { "standing": 0.07, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "standing": 9, "popularity": 5, "energie": -2 },
        "result": { "fr": "Vous obtenez un des trois ministères qui comptent. À partir de ce jour, tout ce qui ira mal dans le pays portera votre nom.",
                    "en": "You get one of the three departments that matter. From this day on, everything that goes wrong in the country will carry your name." } },
      "failure": { "effects": { "office": "none", "standing": -14, "reputation": -1 },
        "result": { "fr": "On vous répond que l'ambition est une qualité. Vous n'êtes dans aucune des deux colonnes le lendemain.",
                    "en": "You are told that ambition is a fine quality. The next day you are in neither column." } } },
    { "label": { "fr": "Partir avant d'être remercié", "en": "Leave before you are thanked" },
      "effects": { "office": "none", "reputation": 2, "popularity": 6, "standing": -4, "sangfroid": 1 },
      "result": { "fr": "Vous démissionnez le matin, avant la liste. La formule est reprise partout, et vous redevenez quelqu'un dont on se demande ce qu'il prépare.",
                  "en": "You resign in the morning, before the list. The phrase is quoted everywhere, and you become somebody people wonder about again." } }
  ]
},

{
  "id": "demission_fracassante",
  "weight": 3,
  "when": { "position": ["ministre"], "minTurn": 10, "minPopularity": 45 },
  "tag": { "fr": "La porte", "en": "The door" },
  "text": {
    "fr": "Le gouvernement s'engage dans une réforme dont vous savez qu'elle finira mal. Vous pouvez la porter, ou vous en aller avec fracas et laisser les autres l'expliquer.",
    "en": "The government is embarking on a reform you know will end badly. You can carry it, or walk out loudly and leave the others to explain it."
  },
  "choices": [
    { "label": { "fr": "Démissionner et dire pourquoi", "en": "Resign and say why" },
      "effects": { "office": "none", "popularity": 12, "reputation": 3, "standing": -10, "notoriete": 2,
                   "landscape": { "self": 1.4 } },
      "result": { "fr": "Votre lettre de démission est publiée intégralement et lue à la radio. Vous n'avez plus de ministère, plus de voiture et plus de contradicteur.",
                  "en": "Your resignation letter is published in full and read out on the radio. You no longer have a department, a car, or anyone contradicting you." } },
    { "label": { "fr": "Rester et porter la réforme", "en": "Stay and carry the reform" },
      "effects": { "standing": 9, "popularity": -8, "energie": -2, "sangfroid": 1 },
      "result": { "fr": "Vous montez au front pendant six mois. La réforme passe, abîmée, et votre nom reste collé dessus des deux côtés.",
                  "en": "You are out in front for six months. The reform passes, damaged, and your name stays attached to it on both sides." } },
    { "label": { "fr": "Rester en préparant votre départ", "en": "Stay, and prepare your exit" },
      "when": { "personality": ["calculating"] },
      "effects": { "reseau": 2, "sangfroid": 1, "standing": 4, "reputation": -1, "chain": "demission_preparee" },
      "result": { "fr": "Vous soutenez la réforme en public et vous constituez un dossier en privé. Le jour venu, vous saurez exactement quoi dire et à qui.",
                  "en": "You back the reform in public and build a file in private. When the day comes, you will know exactly what to say and to whom." } }
  ]
},

{
  "id": "demission_preparee",
  "weight": 0,
  "delay": [3, 6],
  "when": { "position": ["ministre"] },
  "tag": { "fr": "Le moment venu", "en": "The moment comes" },
  "text": {
    "fr": "La réforme s'effondre exactement comme vous l'aviez prévu. Vous avez les notes, les dates et le nom de ceux qui ont insisté.",
    "en": "The reform collapses exactly as you predicted. You have the notes, the dates and the names of those who insisted."
  },
  "choices": [
    { "label": { "fr": "Partir en publiant tout", "en": "Walk out and publish everything" },
      "effects": { "office": "none", "popularity": 14, "notoriete": 2, "standing": -16, "reputation": 1,
                   "landscape": { "self": 2, "ruling": -1.6 } },
      "result": { "fr": "Votre démission occupe trois jours de plateaux et vos notes deux semaines de presse. Vous ne remettrez plus jamais les pieds dans un gouvernement dirigé par ces gens-là.",
                  "en": "Your resignation fills three days of television and your notes two weeks of newsprint. You will never sit in a government run by these people again." } },
    { "label": { "fr": "Utiliser le dossier pour monter, pas pour partir", "en": "Use the file to climb, not to leave" },
      "roll": { "base": 18, "stat": "reseau", "plus": { "sangfroid": 0.5, "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 13, "reseau": 1, "reputation": -2 },
        "result": { "fr": "Vous montrez le dossier à trois personnes et à personne d'autre. Deux d'entre elles quittent le gouvernement le mois suivant, vous non.",
                    "en": "You show the file to three people and to nobody else. Two of them leave the government the following month; you do not." } },
      "failure": { "effects": { "office": "none", "standing": -12, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "Le dossier remonte jusqu'à celui qu'il visait, avec votre nom dessus. Vous quittez le gouvernement le vendredi, sans communiqué.",
                    "en": "The file makes its way to its target, with your name on it. You leave the government on Friday, with no statement." } } }
  ]
},
/* ==========================================================================
   17. LE CORPS
   ==========================================================================
   La vie politique regarde les corps avant d'écouter les idées, et elle les
   traite mal. C'est elle que ces événements moquent, jamais les corps
   eux-mêmes. Ce sont aussi les seuls événements du jeu qui ne s'ouvrent qu'à
   certains physiques : un personnage passera sa carrière sans en voir la
   moitié, et c'est le but.
   ========================================================================== */

{
  "id": "photo_officielle",
  "once": true,
  "weight": 5,
  "when": { "trait": ["beau"], "position": ["conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Affichage", "en": "The poster" },
  "text": {
    "fr": "La fédération veut votre visage sur toutes les affiches, en très grand, sans slogan. Le directeur de campagne parle d'atout, votre suppléante parle d'autre chose depuis la porte du bureau.",
    "en": "The local party wants your face on every poster, very large, with no slogan. The campaign manager calls it an asset; your deputy, standing in the doorway, calls it something else."
  },
  "choices": [
    { "label": { "fr": "Laisser faire", "en": "Let them" },
      "effects": { "notoriete": 2, "popularity": 7, "standing": -4, "reputation": -1 },
      "result": { "fr": "Le score progresse de quatre points et le mot programme n'a pas été prononcé de la campagne. Personne ne s'en plaint, ce qui est le plus inquiétant.",
                  "en": "The result improves by four points and the word manifesto was not uttered once. Nobody complains, which is the worrying part." } },
    { "label": { "fr": "Exiger une mesure sur chaque affiche", "en": "Insist on a policy line on every poster" },
      "effects": { "reputation": 2, "popularity": -2, "standing": 5, "eloquence": 1 },
      "result": { "fr": "Les affiches sont moches et illisibles de loin. Vos militants les défendent avec une conviction qui vaut tous les sondages.",
                  "en": "The posters are ugly and unreadable from a distance. Your activists defend them with a conviction worth more than any poll." } },
    { "label": { "fr": "Refaire la maquette vous-même, en une nuit", "en": "Redo the artwork yourself, in one night" },
      "when": { "background": ["comms"] },
      "effects": { "popularity": 5, "credibilite": 2, "notoriete": 2, "energie": -2, "money": -8000 },
      "result": { "fr": "Vous reprenez la police, le cadrage et la hiérarchie de l'information parce que la fédération a payé une agence qui n'a rien compris. C'est mieux, et personne ne saura jamais pourquoi.",
                  "en": "You redo the typeface, the crop and the information hierarchy because the federation paid an agency that understood nothing. It is better, and nobody will ever know why." } },
    { "label": { "fr": "En faire une campagne entièrement à l'image", "en": "Make the whole campaign about the image" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 10, "standing": -6, "trait": "bete_scene" },
        "result": { "fr": "Trois plateaux, une couverture de magazine, un mème. Vous êtes désormais quelqu'un qu'on reconnaît dans la rue et qu'on n'écoute pas en réunion.",
                    "en": "Three television shows, a magazine cover, a meme. You are now somebody people recognise in the street and ignore in meetings." } },
      "failure": { "effects": { "popularity": -5, "reputation": -2, "strike": "menteur" },
        "result": { "fr": "L'emballement retombe en dix jours et un portrait cruel paraît, intitulé « le candidat sans phrase ».",
                    "en": "The buzz dies in ten days and a cruel profile appears, headlined “the candidate with nothing to say”." } } }
  ]
},

{
  "id": "candidat_sans_fond",
  "weight": 4,
  "when": { "trait": ["beau"], "minTurn": 10 },
  "tag": { "fr": "Portrait", "en": "The profile" },
  "text": {
    "fr": "Un éditorialiste écrit que vous êtes « le plus beau des seconds couteaux » et que votre ascension ne doit rien à vos idées. L'article est injuste, bien écrit, et il circule dans votre propre parti depuis le matin.",
    "en": "A columnist writes that you are “the best-looking of the second-raters” and that your rise owes nothing to your ideas. The piece is unfair, well written, and it has been circulating inside your own party since morning."
  },
  "choices": [
    { "label": { "fr": "Publier un livre de fond dans l'année", "en": "Publish a serious book within the year" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "energie": 0.4 }, "dice": 16 },
      "success": { "effects": { "reputation": 3, "eloquence": 1, "energie": -2, "standing": 6, "trait": "orateur" },
        "result": { "fr": "Deux cents pages sur un sujet que personne n'attendait de vous. On cesse de parler de votre visage pendant six mois.",
                    "en": "Two hundred pages on a subject nobody expected from you. People stop talking about your face for six months." } },
      "failure": { "effects": { "energie": -2, "reputation": -1, "money": -20000 },
        "result": { "fr": "Le livre sort, il est correct, il ne se vend pas. Le même éditorialiste écrit qu'il l'a lu, ce dont vous doutez.",
                    "en": "The book comes out, it is decent, it does not sell. The same columnist writes that he read it, which you doubt." } } },
    { "label": { "fr": "En rire publiquement", "en": "Laugh it off in public" },
      "effects": { "charisme": 1, "popularity": 6, "sangfroid": 1, "standing": -3 },
      "result": { "fr": "Vous citez la formule vous-même, en ouverture de meeting. La salle rit, l'éditorialiste aussi, et il vous descendra de nouveau au printemps.",
                  "en": "You quote the line yourself, opening a rally. The hall laughs, the columnist laughs, and he will take you apart again in the spring." } },
    { "label": { "fr": "Travailler deux dossiers jusqu'à les connaître mieux que quiconque", "en": "Master two files better than anyone" },
      "effects": { "eloquence": 2, "reputation": 2, "energie": -3, "standing": 7, "popularity": -2 },
      "result": { "fr": "Six mois d'auditions et de notes. En commission, plus personne ne vous coupe la parole, et c'est là que ça se joue.",
                  "en": "Six months of hearings and briefing notes. In committee, nobody interrupts you any more, and that is where it counts." } }
  ]
},

{
  "id": "caricature",
  "weight": 4,
  "when": { "trait": ["ingrat"], "minTurn": 8 },
  "tag": { "fr": "Dessin de presse", "en": "The cartoon" },
  "text": {
    "fr": "Un dessinateur vous a trouvé une silhouette et ne vous lâche plus. Le trait est cruel, drôle, et il paraît trois fois par semaine depuis un mois.",
    "en": "A cartoonist has found your silhouette and will not let go. The drawing is cruel, funny, and it has run three times a week for a month."
  },
  "choices": [
    { "label": { "fr": "Lui acheter l'original et l'accrocher dans votre bureau", "en": "Buy the original and hang it in your office" },
      "effects": { "credibilite": +1, "money": -4000, "popularity": 8, "charisme": 1, "sangfroid": 1, "trait": "teflon" },
      "result": { "fr": "La photo du dessin encadré derrière vous fait le tour des rédactions. On ne peut plus se moquer de quelqu'un qui rit le premier.",
                  "en": "The photograph of the framed cartoon behind you goes round every newsroom. You cannot mock somebody who laughs first." } },
    { "label": { "fr": "Demander à votre entourage d'appeler le journal", "en": "Have your staff call the paper" },
      "roll": { "chance": 0.3 },
      "success": { "effects": { "popularity": 2, "reseau": 1 },
        "result": { "fr": "Le dessinateur passe à quelqu'un d'autre le mois suivant. Personne n'a rien su, et c'est déjà une victoire rare.",
                    "en": "The cartoonist moves on to somebody else the following month. Nobody found out, which is already a rare win." } },
      "failure": { "effects": { "credibilite": -2, "popularity": -9, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Le journal publie l'appel en fac-similé, avec le nom de votre collaborateur. Le dessin devient une série et vous, un symbole de susceptibilité.",
                    "en": "The paper publishes the call in facsimile, with your staffer's name on it. The cartoon becomes a series, and you become a symbol of thin skin." } } },
    { "label": { "fr": "Lui commander une série et la publier vous-même", "en": "Commission a series from him and publish it yourself" },
      "when": { "background": ["celebrity"] },
      "effects": { "popularity": 8, "notoriete": 3, "reputation": 2, "money": -12000 },
      "result": { "fr": "Vous savez depuis longtemps qu'on ne se bat pas contre une image, on l'achète. Douze dessins, votre nom dessus, et le trait cruel devient votre affiche de campagne.",
                  "en": "You have long known you do not fight an image, you buy it. Twelve drawings, your name on them, and the cruel line becomes your campaign poster." } },
    { "label": { "fr": "Ne rien faire du tout", "en": "Do nothing at all" },
      "effects": { "credibilite": +1, "sangfroid": 2, "popularity": -2 },
      "result": { "fr": "Vous laissez passer, comme le reste. Au bout de deux ans, la silhouette est devenue votre logo et les militants la portent sur des badges.",
                  "en": "You let it pass, like everything else. Two years on, the silhouette has become your logo and activists wear it on badges." } }
  ]
},

{
  "id": "prise_de_poids",
  "weight": 4,
  "when": { "notTrait": ["obese", "athletique"], "minTurn": 14, "position": ["maire", "euro", "depute", "ministre", "chef"] },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Quatre ans de buffets à vingt-trois heures, de trains et de nuits courtes. Le tailleur vous le dit avant votre médecin, et votre attachée de presse avant les deux.",
    "en": "Four years of buffets at eleven at night, of trains and short nights. Your tailor tells you before your doctor does, and your press officer before either of them."
  },
  "choices": [
    { "label": { "fr": "Continuer, il y a plus urgent", "en": "Carry on, there are bigger problems" },
      "effects": { "trait": "obese", "energie": -1, "standing": 5, "sangfroid": 1 },
      "result": { "fr": "Vous ne changez rien et vous tenez le rythme deux ans de plus. Les photos de vous en 2019 commencent à circuler avec des commentaires.",
                  "en": "You change nothing and hold the pace for two more years. Photographs of you from a few years back start circulating with comments attached." } },
    { "label": { "fr": "Reprendre le sport sérieusement", "en": "Take up sport seriously" },
      "roll": { "base": 20, "stat": "energie", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "trait": "athletique", "energie": 2, "popularity": 3 },
        "result": { "fr": "Cinq heures par semaine arrachées à l'agenda, et un cliché de vous en train de courir qui ne doit rien au hasard.",
                    "en": "Five hours a week torn out of the diary, and a photograph of you running that owes nothing to chance." } },
      "failure": { "effects": { "energie": -2, "standing": -3 },
        "result": { "fr": "Trois semaines tenues, puis une crise politique. Le vélo d'appartement reste dans le bureau, où les visiteurs le remarquent.",
                    "en": "Three weeks of it, then a political crisis. The exercise bike stays in the office, where visitors notice it." } } },
    { "label": { "fr": "Confier le sujet à des professionnels", "en": "Hand the matter to professionals" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -30000, "energie": 1, "popularity": 2, "reputation": -1 },
      "result": { "fr": "Un nutritionniste, un coach, un photographe. Le résultat est net et tout le monde comprend qu'il a été acheté.",
                  "en": "A nutritionist, a coach, a photographer. The result is clear, and everyone understands it was bought." } }
  ]
},

{
  "id": "regime_impose",
  "weight": 5,
  "when": { "trait": ["obese"], "minTurn": 4 },
  "tag": { "fr": "Conseil en image", "en": "Image consultants" },
  "text": {
    "fr": "L'état-major vous fait rencontrer une consultante. Elle ne parle pas de santé, elle parle de « lisibilité à l'écran » et montre des courbes. Elle propose un suivi médiatisé, avec des étapes et des photos.",
    "en": "The leadership sets up a meeting with a consultant. She does not talk about health, she talks about “legibility on screen” and shows charts. She proposes a publicised programme, with milestones and photographs."
  },
  "choices": [
    { "label": { "fr": "Accepter le suivi et le raconter", "en": "Accept the programme and tell the story" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "stat": { "energie": { "min": 10 } } }, "value": 0.2 } ] },
      "success": { "effects": { "untrait": "obese", "popularity": 9, "notoriete": 1, "energie": 2 },
        "result": { "fr": "Dix-huit mois, une couverture de magazine et une phrase que vous répéterez mille fois. Le pays adore les métamorphoses, surtout les vôtres.",
                    "en": "Eighteen months, a magazine cover and a sentence you will repeat a thousand times. The country loves a transformation, especially yours." } },
      "failure": { "effects": { "popularity": -7, "energie": -2, "reputation": -1 },
        "result": { "fr": "Vous reprenez tout, sous les caméras cette fois. L'échec est public parce que vous aviez rendu la tentative publique.",
                    "en": "You put it all back on, on camera this time. The failure is public because you made the attempt public." } } },
    { "label": { "fr": "Refuser et le dire", "en": "Refuse, and say so" },
      "effects": { "reputation": 3, "popularity": 6, "standing": -8, "sangfroid": 1, "chain": "position_impopulaire" },
      "result": { "fr": "Vous expliquez en direct qu'on ne vous a jamais demandé de perdre des idées. La séquence est reprise partout, et l'état-major ne vous le pardonne pas.",
                  "en": "You explain on air that nobody has ever asked you to lose ideas. The clip runs everywhere, and the leadership does not forgive it." } },
    { "label": { "fr": "Accepter en silence", "en": "Accept, quietly" },
      "effects": { "standing": 6, "energie": -1, "popularity": -1 },
      "result": { "fr": "Vous suivez le programme sans en parler à personne. Les résultats sont modestes et l'état-major vous trouve enfin raisonnable.",
                  "en": "You follow the programme without telling anyone. The results are modest and the leadership finally finds you reasonable." } }
  ]
},

{
  "id": "retouche_visage",
  "weight": 2,
  "when": { "minAge": 56, "minMoney": 90000, "notTrait": ["lifting", "intouchable"] },
  "tag": { "fr": "Miroir", "en": "The mirror" },
  "text": {
    "fr": "Les photos de la dernière campagne vous vieillissent de dix ans. Un praticien discret, recommandé par quelqu'un du parti, vous explique que trois séances suffiraient et que personne ne verrait rien.",
    "en": "The photographs from the last campaign make you look ten years older. A discreet practitioner, recommended by somebody in the party, explains that three sessions would do it and that nobody would notice a thing."
  },
  "choices": [
    { "label": { "fr": "Y aller", "en": "Go ahead" },
      "effects": { "money": -48000, "trait": "lifting", "popularity": 4 },
      "result": { "fr": "Trois séances, deux semaines de discrétion. Personne ne dit rien pendant un mois, puis un journal met deux photos côte à côte.",
                  "en": "Three sessions, two discreet weeks. Nobody says anything for a month, then a paper runs two photographs side by side." } },
    { "label": { "fr": "Assumer le vieillissement", "en": "Own the ageing" },
      "effects": { "reputation": 3, "sangfroid": 1, "popularity": -2 },
      "result": { "fr": "Vous laissez faire le temps, et vous laissez dire. Dans un métier où tout le monde se retouche, ne rien faire finit par se voir aussi.",
                  "en": "You let time do its work, and let people talk. In a trade where everyone has work done, doing nothing eventually shows too." } },
    { "label": { "fr": "En faire un sujet politique", "en": "Turn it into a political subject" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 2, "popularity": 7, "reputation": 1, "standing": -6,
                   "landscape": { "self": 0.8 } },
      "result": { "fr": "Vous publiez les deux photos vous-même, avec le devis, et vous demandez combien de vos collègues ont la même facture. Trois d'entre eux ne vous parlent plus.",
                  "en": "You publish both photographs yourself, with the quote, and ask how many of your colleagues have the same invoice. Three of them stop speaking to you." } }
  ]
},

{
  "id": "moquerie_plateau",
  "weight": 4,
  "cast": "opponent",
  "when": { "minTurn": 12, "position": ["depute", "ministre", "chef", "euro"] },
  "tag": { "fr": "Sur le plateau", "en": "On air" },
  "text": {
    "fr": "En direct, {rival} lâche une pique sur votre physique. Ce n'est pas un argument, ça n'a rien à voir avec le sujet, et le plateau rit avant de se rendre compte.",
    "en": "Live on air, {rival} lands a jibe about your appearance. It is not an argument, it has nothing to do with the subject, and the studio laughs before it catches itself."
  },
  "choices": [
    { "label": { "fr": "Répondre sur le fond, sans relever", "en": "Answer on the substance, without acknowledging it" },
      "effects": { "credibilite": +2, "reputation": 2, "sangfroid": 1, "popularity": 4, "landscape": { "self": 0.6, "scene": -0.6 } },
      "result": { "fr": "Vous enchaînez comme si de rien n'était. Le silence qui suit sa phrase dure une seconde de trop, et c'est cette seconde-là qui tournera.",
                  "en": "You carry on as if nothing had happened. The silence after his line lasts a second too long, and that second is the clip that travels." } },
    { "label": { "fr": "Rendre le coup, plus fort", "en": "Hit back, harder" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "strike": "intrepide", "popularity": 8, "notoriete": 1, "landscape": { "self": 1.2, "scene": -1.2 } },
        "result": { "fr": "Votre réponse est meilleure que sa pique et tout le monde le sait avant la fin de l'émission. Il ne recommencera pas avec vous.",
                    "en": "Your comeback is better than his jibe and everyone knows it before the programme ends. He will not try that with you again." } },
      "failure": { "effects": { "credibilite": -2, "strike": "intrepide", "popularity": -6, "reputation": -2, "landscape": { "scene": 0.8 } },
        "result": { "fr": "Vous descendez à son niveau sans son talent. Le lendemain, les deux séquences passent ensemble et une seule est drôle.",
                    "en": "You go down to his level without his timing. The next day both clips run together, and only one of them is funny." } } },
    { "label": { "fr": "Enchaîner sur une vanne meilleure que la sienne", "en": "Come back with a better joke than his" },
      "when": { "background": ["celebrity"] },
      "effects": { "popularity": 9, "notoriete": 3, "credibilite": -1, "standing": -2 },
      "result": { "fr": "Vous avez fait ça pendant quinze ans devant des salles plus dures qu'un plateau politique. La réplique tombe en une seconde et demie, et c'est la sienne qu'on oublie.",
                  "en": "You did this for fifteen years in rooms harder than any political studio. The line lands in a second and a half, and it is his that gets forgotten." } },
    { "label": { "fr": "Prendre le pays à témoin", "en": "Take it to the country" },
      "when": { "anyTrait": ["ingrat", "obese", "lifting", "use"] },
      "effects": { "popularity": 11, "reputation": 2, "standing": -4, "notoriete": 1,
                   "landscape": { "scene": -1.4 } },
      "result": { "fr": "Vous regardez la caméra et vous demandez combien de gens, chez eux, entendent ça toute leur vie. Le standard de la chaîne sature avant la fin du générique.",
                  "en": "You look into the camera and ask how many people at home hear that their whole lives. The channel's switchboard is jammed before the credits finish." } }
  ]
},

{
  "id": "nuit_de_trop",
  "weight": 3,
  "when": { "notTrait": ["use"], "minAge": 55, "stat": { "energie": { "max": 7 } } },
  "tag": { "fr": "Trois heures du matin", "en": "Three in the morning" },
  "text": {
    "fr": "Vous vous réveillez dans une voiture de fonction sans savoir dans quelle ville. Votre chauffeur, qui a vu passer quatre ministres, ne dit rien et roule.",
    "en": "You wake up in an official car without knowing which city you are in. Your driver, who has seen four ministers come and go, says nothing and keeps driving."
  },
  "choices": [
    { "label": { "fr": "Lever le pied pour de bon", "en": "Ease off for good" },
      "effects": { "energie": 3, "standing": -7, "popularity": -3, "flags": { "carefulHealth": true } },
      "result": { "fr": "Vous rendez deux délégations et vous rentrez le vendredi soir. Trois personnes notent votre absence et une seule s'en réjouit.",
                  "en": "You hand back two portfolios and go home on Friday evenings. Three people notice your absence and only one of them is pleased." } },
    { "label": { "fr": "Tenir jusqu'à l'échéance", "en": "Hold on until the next election" },
      "effects": { "trait": "use", "standing": 8, "energie": -1 },
      "result": { "fr": "Vous tenez, évidemment. C'est le métier, et c'est ce que le métier fait aux gens qui le font bien.",
                  "en": "You hold on, of course. It is the job, and it is what the job does to the people who are good at it." } },
    { "label": { "fr": "Réorganiser entièrement votre équipe", "en": "Rebuild your team from top to bottom" },
      "when": { "minMoney": 50000 },
      "effects": { "money": -35000, "energie": 2, "reseau": 1, "standing": 3 },
      "result": { "fr": "Un vrai directeur de cabinet, deux conseillers de plus, et le droit de ne pas tout lire. Cela aurait dû être fait dix ans plus tôt.",
                  "en": "A proper chief of staff, two more advisers, and permission not to read everything. It should have been done ten years earlier." } }
  ]
},

{
  "id": "alerte_sante",
  "weight": 0,
  "delay": [2, 6],
  "when": { "flag": { "frailHealth": false } },
  "tag": { "fr": "Le médecin", "en": "The doctor" },
  "text": {
    "fr": "Un malaise en déplacement, quinze minutes d'inquiétude et un communiqué qui parle de fatigue. Le médecin, lui, ne parle pas de fatigue.",
    "en": "A dizzy spell on a visit, fifteen minutes of alarm, and a statement that mentions tiredness. The doctor does not mention tiredness."
  },
  "choices": [
    { "label": { "fr": "Suivre les consignes à la lettre", "en": "Follow the instructions to the letter" },
      "effects": { "flags": { "carefulHealth": true }, "energie": 2, "standing": -6, "popularity": -2 },
      "result": { "fr": "Un agenda allégé, un régime, deux rendez-vous par mois. Vous vivrez plus longtemps et vous pèserez moins.",
                  "en": "A lighter diary, a diet, two appointments a month. You will live longer and count for less." } },
    { "label": { "fr": "Cacher le diagnostic", "en": "Hide the diagnosis" },
      "effects": { "flags": { "frailHealth": true }, "standing": 4, "sangfroid": 1, "strike": "menteur" },
      "result": { "fr": "Le communiqué parle de fatigue et vous vous y tenez. Trois personnes savent, dont une que vous n'avez pas choisie.",
                  "en": "The statement says tiredness and you stick to it. Three people know, one of whom you did not choose." } }
  ]
},
/* ==========================================================================
   18. CE QUE LES ANNÉES CONFIRMENT
   ==========================================================================
   Ces quatre événements couronnent des histoires que le joueur a déjà vécues :
   le parrainage d'un ancien, les protégés qu'on a formés, la position tenue
   contre son camp, la voix qu'on a reçue. Un trait qui tombe ici n'est pas un
   cadeau du hasard, c'est une carrière qui se retourne pour se regarder.
   ========================================================================== */

{
  "id": "position_impopulaire",
  "weight": 0,
  "delay": [6, 14],
  "tag": { "fr": "Le temps a passé", "en": "Time has passed" },
  "text": {
    "fr": "La position que vous aviez tenue seul contre tout le monde revient dans l'actualité. Les archives ressortent, et la séquence où l'on vous coupait la parole tourne de nouveau.",
    "en": "The position you held alone against everyone is back in the news. The archives resurface, and the clip where they cut you off is doing the rounds again."
  },
  "choices": [
    { "label": { "fr": "Rappeler que vous l'aviez dit", "en": "Remind everyone you said it" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "reputation": 0.5 }, "dice": 16 },
      "success": { "effects": { "trait": "clairvoyant", "notoriete": 1, "popularity": 6 },
        "result": { "fr": "Vous laissez les archives parler et vous ajoutez trois mots. On vous présente désormais comme celui qui avait vu venir, ce qui vaut dix ans de communication.",
                    "en": "You let the archive speak and add three words. You are now introduced as the one who saw it coming, which is worth ten years of press work." } },
      "failure": { "effects": { "popularity": -4, "reputation": -1 },
        "result": { "fr": "Vous insistez trop et le triomphe tourne au règlement de comptes. On retient que vous aviez raison et que vous êtes insupportable.",
                    "en": "You press it too hard and the vindication turns into score-settling. What sticks is that you were right and that you are unbearable." } } },
    { "label": { "fr": "Laisser les autres le dire pour vous", "en": "Let others say it for you" },
      "effects": { "standing": 6, "popularity": 3, "reputation": 1 },
      "result": { "fr": "Vous ne dites rien du tout. Deux éditorialistes et un adversaire le disent à votre place, ce qui est infiniment plus efficace.",
                  "en": "You say nothing at all. Two columnists and one opponent say it for you, which is infinitely more effective." } },
    { "label": { "fr": "Monnayer la séquence auprès de l'appareil", "en": "Cash the moment in with the machine" },
      "when": { "personality": ["calculating"] },
      "effects": { "standing": 14, "popularity": -3, "reputation": -1, "reseau": 1 },
      "result": { "fr": "Vous ne parlez pas au pays, vous parlez à douze personnes qui décident des investitures. Elles se souviennent d'avoir eu tort, et vous le leur rappelez à voix basse.",
                  "en": "You do not talk to the country, you talk to the twelve people who hand out nominations. They remember being wrong, and you remind them quietly." } }
  ]
},

{
  "id": "mentor_encombrant",
  "weight": 0,
  "delay": [8, 18],
  "tag": { "fr": "Votre parrain", "en": "Your patron" },
  "text": {
    "fr": "L'ancien qui vous a fait roi est devenu un poids. Il donne des interviews où il parle de vous au passé, et il rappelle à qui veut l'entendre qu'il vous a tout appris.",
    "en": "The elder who made you has become a burden. He gives interviews where he talks about you in the past tense, and reminds anyone who will listen that he taught you everything."
  },
  "choices": [
    { "label": { "fr": "Le remercier publiquement, une dernière fois", "en": "Thank him publicly, one last time" },
      "effects": { "standing": 6, "popularity": -3, "reputation": 1 },
      "result": { "fr": "Un hommage appuyé, une salle émue, une page tournée que lui seul ne voit pas tourner. Il recommencera dans six mois.",
                  "en": "A heavy tribute, a moved audience, a page turned that only he does not see turning. He will start again in six months." } },
    { "label": { "fr": "Couper les ponts", "en": "Cut him off" },
      "effects": { "standing": -8, "popularity": 6, "sangfroid": 1, "strike": "traitre" },
      "result": { "fr": "Vous cessez de répondre à ses messages et vous le dites à trois journalistes. Vous ne devez plus rien à personne, ce qui coûte exactement ce que ça vaut.",
                  "en": "You stop answering his messages and you tell three journalists so. You owe nobody anything any more, which costs exactly what it is worth." } },
    { "label": { "fr": "Lui trouver une fonction honorifique loin d'ici", "en": "Find him an honorary post a long way away" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "standing": 8, "energie": -1 },
        "result": { "fr": "Une présidence de commission internationale, un bureau avec vue et deux déplacements par mois. Il accepte en croyant avoir gagné.",
                    "en": "The chair of an international commission, an office with a view and two trips a month. He accepts, convinced he has won." } },
      "failure": { "effects": { "standing": -6, "popularity": -2 },
        "result": { "fr": "Il comprend la manœuvre avant la fin du déjeuner et la raconte le soir même. On vous trouve ingrat, ce qui est exact.",
                    "en": "He works out the manoeuvre before lunch is over and tells the story that evening. People find you ungrateful, which is accurate." } } }
  ]
},

{
  "id": "ecole_du_parti",
  "weight": 0,
  "delay": [8, 16],
  "tag": { "fr": "Votre école", "en": "Your school" },
  "text": {
    "fr": "Ceux que vous avez formés se comptent maintenant en dizaines, et ils occupent des postes qui comptent. Un soir, quatre d'entre eux vous proposent de structurer tout ça en courant, avec un nom et des statuts.",
    "en": "The people you trained now number in the dozens, and they hold posts that matter. One evening, four of them propose turning all this into a faction, with a name and a rulebook."
  },
  "choices": [
    { "label": { "fr": "Fonder le courant", "en": "Found the faction" },
      "effects": { "standing": 12, "reseau": 2, "popularity": -4, "reputation": -1,
                   "landscape": { "self": 0.8 } },
      "result": { "fr": "Le courant a un nom, une revue et un dîner annuel. Le parti compte désormais une maison dans la maison, et tout le monde sait qui en a la clé.",
                  "en": "The faction has a name, a journal and an annual dinner. The party now contains a house within the house, and everyone knows who holds the key." } },
    { "label": { "fr": "Refuser de faire écurie", "en": "Refuse to run a stable" },
      "effects": { "reputation": 2, "popularity": 4, "standing": -5 },
      "result": { "fr": "Vous leur dites que vous n'avez pas formé des gens pour qu'ils vous suivent. Deux d'entre eux fondent le courant sans vous le mois suivant.",
                  "en": "You tell them you did not train people so they would follow you. Two of them found the faction without you the following month." } },
    { "label": { "fr": "Les placer un par un, sans rien fonder", "en": "Place them one by one, and found nothing" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.05, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 10, "energie": -2 },
        "result": { "fr": "Pas de courant, pas de revue, pas de dîner : juste vos anciens élèves dans onze commissions et deux fédérations. Personne ne peut le reprocher à personne.",
                    "en": "No faction, no journal, no dinner: just your former students in eleven committees and two federations. Nobody can hold it against anybody." } },
      "failure": { "effects": { "standing": -6, "reseau": -1, "energie": -2 },
        "result": { "fr": "Vous en placez trois et vous vous fâchez avec les autres, qui attendaient leur tour depuis des années.",
                    "en": "You place three of them and fall out with the rest, who had been waiting their turn for years." } } }
  ]
},

{
  "id": "voix_antenne",
  "weight": 4,
  "when": { "trait": ["voix"], "minTurn": 6 },
  "tag": { "fr": "Antenne", "en": "On air" },
  "text": {
    "fr": "Une matinale de radio vous propose une chronique hebdomadaire. Sept minutes, en direct, sur le sujet de votre choix. Le directeur des programmes dit que c'est votre voix qui l'intéresse, pas vos idées, et il le dit gentiment.",
    "en": "A breakfast radio programme offers you a weekly slot. Seven minutes, live, on the subject of your choice. The head of programming says it is your voice he wants, not your ideas, and he says it kindly."
  },
  "choices": [
    { "label": { "fr": "Accepter et y parler du pays", "en": "Accept, and talk about the country" },
      "effects": { "notoriete": 2, "eloquence": 1, "popularity": 8, "energie": -2, "standing": -4 },
      "result": { "fr": "Deux ans de sept minutes hebdomadaires. On vous écoute en voiture, sans vous voir, et c'est le seul endroit où l'on vous laisse finir vos phrases.",
                  "en": "Two years of seven weekly minutes. People listen in the car, without seeing you, and it is the only place where you get to finish your sentences." } },
    { "label": { "fr": "Accepter et régler vos comptes internes", "en": "Accept, and settle your internal scores" },
      "effects": { "notoriete": 2, "popularity": 4, "standing": -12, "reputation": -1,
                   "landscape": { "self": -0.6 } },
      "result": { "fr": "Sept minutes par semaine pour dire tout haut ce qui se dit tout bas au bureau politique. L'audience monte et votre parti apprend à écouter la radio avec angoisse.",
                  "en": "Seven weekly minutes to say out loud what gets muttered in the executive. The ratings climb and your party learns to listen to the radio with dread." } },
    { "label": { "fr": "Refuser, ce n'est pas votre métier", "en": "Refuse, it is not your job" },
      "effects": { "standing": 5, "reputation": 1, "popularity": -3 },
      "result": { "fr": "Vous répondez que vous n'êtes pas un animateur. La direction du parti approuve, et le créneau va à quelqu'un qui, lui, deviendra ministre.",
                  "en": "You answer that you are not a broadcaster. The leadership approves, and the slot goes to somebody who will become a minister." } }
  ]
},
/* ==========================================================================
   19. CE QUE LA VIE POLITIQUE FAIT DE CE QU'ON EST
   ==========================================================================
   Ces événements ne se jouent que pour certains personnages. Ils ne portent
   aucun jugement sur ce qu'ils sont : ils racontent ce que l'appareil, la
   presse et les électeurs en font, ce qui est très différent et beaucoup plus
   drôle. La conséquence d'un même choix change selon le parti, par les
   "effectsIf" : c'est le camp qui juge, pas le jeu.
   ========================================================================== */

{
  "id": "consigne_discretion",
  "once": true,
  "weight": 5,
  "when": { "trait": ["homosexuel"], "minTurn": 6, "position": ["conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Avant l'investiture", "en": "Before the nomination" },
  "text": {
    "fr": "Un cadre de la fédération vous prend à part avant la commission d'investiture. Il ne dit rien de désagréable, il parle de « circonscription rurale », de « moment mal choisi » et de « prudence ». Il conclut en disant que lui, personnellement, s'en moque.",
    "en": "A senior figure takes you aside before the nominations committee. He says nothing unpleasant; he mentions the “rural constituency”, the “wrong moment” and “caution”. He finishes by saying that he personally could not care less."
  },
  "choices": [
    { "label": { "fr": "Suivre la consigne", "en": "Follow the advice" },
      "effects": { "standing": 9, "reputation": -2, "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Vous ne mentez sur rien, vous ne dites simplement rien, et vous découvrez que c'est une occupation à plein temps. L'investiture arrive, et une fatigue avec elle.",
                  "en": "You lie about nothing, you simply say nothing, and you discover it is a full-time occupation. The nomination comes through, and a particular tiredness with it." } },
    { "label": { "fr": "Répondre que la question ne se pose pas", "en": "Answer that the question does not arise" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": -4 },
      "result": { "fr": "Vous le regardez sans répondre jusqu'à ce qu'il change de sujet, ce qui prend onze secondes. Il vous soutiendra quand même, en le racontant autrement.",
                  "en": "You look at him without answering until he changes the subject, which takes eleven seconds. He will back you anyway, and tell the story differently." } },
    { "label": { "fr": "Prendre les devants et en parler publiquement", "en": "Get ahead of it and say it publicly" },
      "effects": { "notoriete": 2, "popularity": 5, "reputation": 3, "standing": -6 },
      "effectsIf": [
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 10, "popularity": 4 } },
        { "when": { "party": ["conservatives"] }, "effects": { "standing": -6 } },
        { "when": { "party": ["identitarians"] }, "effects": { "standing": -14, "popularity": -6 } }
      ],
      "result": { "fr": "Une phrase dans une interview, sans emphase, au milieu d'un paragraphe sur autre chose. Elle fait quatre jours de commentaires et vous ne la répéterez plus jamais.",
                  "en": "One sentence in an interview, no emphasis, in the middle of a paragraph about something else. It runs for four days and you will never repeat it." } }
  ]
},

{
  "id": "menace_outing",
  "weight": 4,
  "when": { "trait": ["homosexuel"], "minTurn": 12, "position": ["depute", "ministre", "chef", "euro"] },
  "tag": { "fr": "Un hebdomadaire", "en": "A weekly" },
  "text": {
    "fr": "Un journal vous prévient qu'il publie jeudi. Ce n'est pas une enquête, il n'y a rien à enquêter : c'est un papier sur votre vie privée, écrit sur le ton de celui qui rend service en disant la vérité.",
    "en": "A paper warns you it publishes on Thursday. It is not an investigation, there is nothing to investigate: it is a piece about your private life, written in the tone of somebody doing you a favour by telling the truth."
  },
  "choices": [
    { "label": { "fr": "Le devancer d'un jour", "en": "Beat them by a day" },
      "effects": { "notoriete": 2, "popularity": 9, "reputation": 2, "energie": -1 },
      "effectsIf": [
        { "when": { "party": ["identitarians", "conservatives"] }, "effects": { "standing": -10 } },
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 6 } }
      ],
      "result": { "fr": "Vous publiez mercredi soir, en trois phrases, sans photo et sans confidence. Le papier du jeudi tombe à plat et son auteur explique partout qu'il allait le sortir en bien.",
                  "en": "You publish on Wednesday evening, three sentences, no photograph and no confidences. Thursday's piece falls flat and its author explains everywhere that he was going to be kind about it." } },
    { "label": { "fr": "Attaquer en justice pour vie privée", "en": "Sue over privacy" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "money": 0.5 }, "dice": 16 },
      "success": { "effects": { "money": -25000, "reputation": 2, "standing": 4, "popularity": -2 },
        "result": { "fr": "Le papier ne sort pas. Trois rédactions savent pourquoi, ce qui vous coûtera un jour beaucoup plus cher que l'avocat.",
                    "en": "The piece does not run. Three newsrooms know why, which will one day cost you far more than the lawyer did." } },
      "failure": { "effects": { "money": -25000, "popularity": -6, "notoriete": 2, "standing": -4 },
        "result": { "fr": "Le référé est rejeté et le rejet devient le sujet. On ne parle plus de votre vie privée, on parle de vos avocats.",
                    "en": "The injunction is refused and the refusal becomes the story. Nobody talks about your private life any more, they talk about your lawyers." } } },
    { "label": { "fr": "Ne rien faire et laisser paraître", "en": "Do nothing and let it run" },
      "effects": { "sangfroid": 2, "popularity": 2, "reputation": 1, "energie": -1, "strike": "lache" },
      "result": { "fr": "L'article paraît, il est lu, et il ne se passe rien du tout. Vous avez passé six jours à préparer une tempête qui n'est pas venue, et c'est ça qui vous met en colère.",
                  "en": "The piece runs, it is read, and absolutely nothing happens. You spent six days preparing for a storm that never came, and that is what makes you angry." } }
  ]
},

{
  "id": "conjoint_officiel",
  "once": true,
  "weight": 4,
  "when": { "trait": ["homosexuel"], "minTurn": 16, "position": ["ministre", "chef", "depute"] },
  "tag": { "fr": "Le protocole", "en": "Protocol" },
  "text": {
    "fr": "Un déplacement officiel à l'étranger, avec la photo de famille habituelle sur le perron. Le service du protocole demande, par écrit et très poliment, si votre conjoint « souhaite figurer », formule qu'on n'emploie pour personne d'autre.",
    "en": "An official trip abroad, with the usual family photograph on the steps. The protocol office asks, in writing and very politely, whether your partner “wishes to appear”, a form of words used for nobody else."
  },
  "choices": [
    { "label": { "fr": "Il figure, comme tous les autres", "en": "He appears, like everybody else" },
      "effects": { "popularity": 6, "reputation": 2, "notoriete": 1 },
      "effectsIf": [
        { "when": { "party": ["identitarians", "conservatives"] }, "effects": { "standing": -8, "popularity": -4 } }
      ],
      "result": { "fr": "La photo est banale, ce qui est exactement le but. Deux chaînes la commentent pendant quarante minutes, ce qui prouve qu'elle ne l'était pas encore.",
                  "en": "The photograph is unremarkable, which is exactly the point. Two channels discuss it for forty minutes, which proves it was not unremarkable yet." } },
    { "label": { "fr": "Y aller seul, pour ne pas l'exposer", "en": "Go alone, to keep him out of it" },
      "effects": { "standing": 4, "popularity": -2, "energie": -1 },
      "result": { "fr": "Vous lui expliquez que c'est plus simple, il répond que oui, bien sûr, et vous savez tous les deux que vous venez de choisir votre carrière contre lui.",
                  "en": "You explain that it is simpler, he says of course it is, and you both know you have just chosen your career over him." } },
    { "label": { "fr": "Demander pourquoi la question est posée", "en": "Ask why the question is being asked" },
      "effects": { "reputation": 3, "notoriete": 1, "standing": -5, "popularity": 3 },
      "result": { "fr": "Vous répondez au protocole par une lettre de quatre lignes qui fuite dans la semaine. Le service change son formulaire l'année suivante, sans le dire à personne.",
                  "en": "You answer protocol with a four-line letter that leaks within the week. The office changes its form the following year, without telling anyone." } }
  ]
},

{
  "id": "orthophoniste",
  "once": true,
  "weight": 5,
  "when": { "trait": ["zozote"], "minTurn": 6 },
  "tag": { "fr": "Travail de la voix", "en": "Voice coaching" },
  "text": {
    "fr": "Votre équipe a pris rendez-vous pour vous chez une orthophoniste, sans vous demander. Le devis est déjà signé et le premier créneau est mardi.",
    "en": "Your team has booked you an appointment with a speech therapist, without asking. The estimate is already signed and the first slot is Tuesday."
  },
  "choices": [
    { "label": { "fr": "Y aller sérieusement, pendant deux ans", "en": "Go seriously, for two years" },
      "roll": { "base": 14, "stat": "energie", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "untrait": "zozote", "eloquence": 2, "energie": -1, "money": -9000 },
        "result": { "fr": "Deux séances par semaine pendant deux ans, et un jour vous prononcez un discours entier sans y penser une seule fois. Les imitateurs mettent six mois à s'en apercevoir.",
                    "en": "Two sessions a week for two years, and one day you deliver a whole speech without thinking about it once. It takes the impressionists six months to notice." } },
      "failure": { "effects": { "energie": -2, "money": -9000, "popularity": -2 },
        "result": { "fr": "Vous y allez trois mois, puis les déplacements reprennent. Il vous reste un exercice de respiration que vous faites dans les ascenseurs.",
                    "en": "You go for three months, then the travelling starts again. What remains is a breathing exercise you do in lifts." } } },
    { "label": { "fr": "Annuler le rendez-vous", "en": "Cancel the appointment" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": -4 },
      "result": { "fr": "Vous expliquez que vous parlez comme ça depuis toujours et que le pays s'en remettra. Votre attachée de presse note la phrase, au cas où elle servirait.",
                  "en": "You explain that you have always talked like this and that the country will cope. Your press officer writes the line down, in case it comes in useful." } },
    { "label": { "fr": "En faire votre marque de fabrique", "en": "Make it your trademark" },
      "effects": { "notoriete": 2, "popularity": 7, "charisme": 1, "standing": -5 },
      "result": { "fr": "Vous ouvrez votre meeting suivant en imitant l'imitateur qui vous imite. La salle hurle, et personne ne se moque plus de la même façon après ça.",
                  "en": "You open your next rally by doing an impression of the impressionist who does you. The hall roars, and nobody mocks you quite the same way afterwards." } }
  ]
},

{
  "id": "imitateur",
  "weight": 4,
  "when": { "anyTrait": ["zozote", "voix"], "minTurn": 14, "stat": { "notoriete": { "min": 9 } } },
  "tag": { "fr": "L'imitateur", "en": "The impressionist" },
  "text": {
    "fr": "Un humoriste a construit un numéro entier sur votre façon de parler. Il passe en deuxième partie de soirée, il est très bon, et son sketch est désormais plus connu que vos propositions.",
    "en": "A comedian has built an entire routine on the way you speak. He is on late in the evening, he is very good, and his sketch is now better known than your policies."
  },
  "choices": [
    { "label": { "fr": "L'inviter à un meeting", "en": "Invite him to a rally" },
      "effects": { "popularity": 9, "charisme": 1, "notoriete": 1, "standing": -4 },
      "result": { "fr": "Il monte sur scène, vous fait devant vous, et vous reprenez le micro derrière lui. La séquence vaut trois mois de campagne et coûte un dîner.",
                  "en": "He comes on stage, does you to your face, and you take the microphone after him. The clip is worth three months of campaigning and costs one dinner." } },
    { "label": { "fr": "Se plaindre à la chaîne", "en": "Complain to the channel" },
      "effects": { "popularity": -8, "reputation": -2, "standing": 3, "strike": "lache" },
      "result": { "fr": "La chaîne ne change rien et le numéro passe désormais en première partie de soirée, avec votre plainte comme introduction.",
                  "en": "The channel changes nothing and the routine now runs in prime time, with your complaint as the introduction." } },
    { "label": { "fr": "Travailler la voix jusqu'à rendre l'imitation fausse", "en": "Work on the voice until the impression stops working" },
      "when": { "trait": ["zozote"] },
      "effects": { "energie": -2, "eloquence": 2, "popularity": 2, "money": -6000 },
      "result": { "fr": "Six mois d'exercices, et son numéro commence à sonner faux sans qu'il comprenne pourquoi. Il en changera, et ce sera sur vos idées.",
                  "en": "Six months of exercises, and his routine starts to ring false without his understanding why. He will change it, and the new one will be about your ideas." } }
  ]
},

/* ==========================================================================
   20. LES PREMIÈRES ANNÉES
   ==========================================================================
   Le début d'une carrière était le moment le plus pauvre du jeu : quinze
   cartes jouables contre quarante pour un ministre, alors qu'on y passe des
   dizaines de tours. Ces scènes-là racontent ce que personne ne raconte
   jamais, parce que ce n'est pas glorieux : les colleurs d'affiches, les
   trésoriers approximatifs, le travail qu'on garde en attendant, et la
   famille qui ne comprend pas.
   ========================================================================== */

{
  "id": "collage_nuit",
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Deux heures du matin", "en": "Two in the morning" },
  "text": {
    "fr": "Vous collez des affiches sous la pluie avec trois autres. En face, l'équipe adverse fait la même chose, avec la même colle et le même seau. Quelqu'un propose de recouvrir les leurs.",
    "en": "You are pasting up posters in the rain with three others. Across the street the other side is doing the same, with the same paste and the same bucket. Somebody suggests covering theirs."
  },
  "choices": [
    { "label": { "fr": "Recouvrir les leurs", "en": "Cover theirs" },
      "effects": { "energie": -1, "standing": 5, "reputation": -1, "popularity": -2 },
      "result": { "fr": "Trois cents affiches par-dessus les leurs, et les leurs par-dessus les vôtres le lendemain. La fédération vous trouve enfin sérieux.",
                  "en": "Three hundred posters over theirs, and theirs over yours the next night. The federation finally finds you serious." } },
    { "label": { "fr": "Aller leur parler", "en": "Go and talk to them" },
      "effects": { "reseau": 1, "charisme": 1, "energie": -1, "standing": -2 },
      "result": { "fr": "Vous finissez à quatre dans un bar de nuit à parler de tout sauf de politique. Vous recroiserez ces trois-là pendant vingt ans.",
                  "en": "The four of you end up in a late bar talking about everything except politics. You will run into those three for the next twenty years." } },
    { "label": { "fr": "Coller les deux côtés de la rue et laisser les leurs", "en": "Do both sides of the street and leave theirs alone" },
      "when": { "background": ["activism"] },
      "effects": { "reseau": 2, "reputation": 2, "energie": -2, "standing": 1 },
      "result": { "fr": "Vous avez collé pour trois causes avant celle-là et vous connaissez deux des trois d'en face par leur prénom. On se salue à quatre heures du matin, et personne dans aucun des deux partis ne le croira jamais.",
                  "en": "You flyposted for three causes before this one and you know two of the three opposite by their first names. You nod to each other at four in the morning, and nobody in either party will ever believe it." } },
    { "label": { "fr": "Rentrer, il y a mieux à faire", "en": "Go home, there are better things to do" },
      "effects": { "energie": 2, "standing": -5, "strike": "lache" },
      "result": { "fr": "Vous rentrez vous coucher. Le lendemain, on remarque surtout ceux qui étaient là à deux heures du matin, et c'est toujours ainsi que ça marche.",
                  "en": "You go home to bed. The next day, what gets noticed is who was there at two in the morning, and that is always how it works." } }
  ]
},

{
  "id": "double_vie",
  "once": true,
  "weight": 5,
  "when": { "position": ["militant", "cadre", "conseiller"], "maxTurn": 16 },
  "tag": { "fr": "Le métier", "en": "The day job" },
  "text": {
    "fr": "Vous avez encore un travail, un vrai, avec un supérieur qui commence à compter vos absences. Il ne dit rien de la politique, il parle de disponibilité, ce qui revient au même.",
    "en": "You still have a job, a real one, with a manager who has started counting your absences. He says nothing about politics, he talks about availability, which comes to the same thing."
  },
  "choices": [
    { "label": { "fr": "Passer à temps partiel", "en": "Go part-time" },
      "effects": { "money": -18000, "energie": 2, "standing": 6, "popularity": 3 },
      "result": { "fr": "Trois jours par semaine pour vivre, deux pour militer, et un compte en banque qui s'en aperçoit tout de suite.",
                  "en": "Three days a week to live on, two to campaign, and a bank account that notices immediately." } },
    { "label": { "fr": "Tenir les deux de front", "en": "Hold both at once" },
      "effects": { "energie": -3, "standing": 3, "sangfroid": 1 },
      "result": { "fr": "Vous dormez cinq heures pendant deux ans. Personne ne vous demandera jamais comment vous avez fait, et c'est aussi bien.",
                  "en": "You sleep five hours a night for two years. Nobody will ever ask how you managed, which is just as well." } },
    { "label": { "fr": "Tout lâcher pour la politique", "en": "Drop everything for politics" },
      "when": { "minMoney": 40000 },
      "effects": { "money": -30000, "energie": 1, "standing": 9, "reseau": 1, "popularity": 4 },
      "result": { "fr": "Vous démissionnez un vendredi. Vous n'avez plus de filet, ce qui rend les réunions du samedi beaucoup plus importantes.",
                  "en": "You resign on a Friday. You have no safety net any more, which makes Saturday meetings a great deal more important." } },
    { "label": { "fr": "Faire financer vos absences par le parti", "en": "Get the party to cover your absences" },
      "roll": { "base": 14, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "money": 9000, "standing": 4, "reseau": 1 },
        "result": { "fr": "Un contrat de chargé de mission à mi-temps, financé par la fédération. Le travail existe, presque.",
                    "en": "A half-time project officer contract, paid by the federation. The job exists, more or less." } },
      "failure": { "effects": { "standing": -4, "energie": -1 },
        "result": { "fr": "On vous répond que la fédération n'est pas une agence d'intérim. Vous poserez des jours de congé, comme tout le monde.",
                    "en": "You are told the federation is not a temp agency. You will take annual leave, like everybody else." } } }
  ]
},

{
  "id": "tresorier_section",
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Les comptes", "en": "The accounts" },
  "text": {
    "fr": "Le trésorier de la section tient ses comptes sur un cahier. Il y a mille deux cents euros d'écart depuis trois ans, et tout le monde le sait sans en parler. Il a soixante-douze ans et il colle des affiches depuis 1974.",
    "en": "The branch treasurer keeps the accounts in a notebook. There has been a twelve-hundred-euro gap for three years, and everybody knows without saying so. He is seventy-two and has been putting up posters since 1974."
  },
  "choices": [
    { "label": { "fr": "Reprendre les comptes vous-même", "en": "Take over the accounts yourself" },
      "effects": { "standing": 7, "energie": -2, "reseau": -1, "reputation": 1 },
      "result": { "fr": "Vous mettez trois mois à tout remettre à plat, sans jamais prononcer son nom. Il vous en veut quand même et ne vous parlera plus.",
                  "en": "It takes you three months to sort it all out, without ever mentioning his name. He resents it anyway and will not speak to you again." } },
    { "label": { "fr": "Ne rien dire", "en": "Say nothing" },
      "effects": { "reseau": 1, "standing": 2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Mille deux cents euros ne valent pas quarante ans de fidélité. Vous avez raison, et vous venez d'apprendre exactement comment ces choses-là commencent.",
                  "en": "Twelve hundred euros are not worth forty years of loyalty. You are right, and you have just learned exactly how these things start." } },
    { "label": { "fr": "Lui apprendre le tableur, un samedi sur deux", "en": "Teach him spreadsheets, every other Saturday" },
      "when": { "background": ["activism"] },
      "effects": { "reseau": 2, "reputation": 3, "energie": -2, "standing": 2 },
      "result": { "fr": "Onze samedis pour reprendre trois ans de cahier avec un homme de soixante-douze ans qui n'a jamais rien volé. L'écart venait des timbres, et il pleure quand on le trouve.",
                  "en": "Eleven Saturdays reconstructing three years of ledger with a man of seventy-two who never stole anything. The gap came from postage stamps, and he cries when they find it." } },
    { "label": { "fr": "Le signaler à la fédération", "en": "Report it to the federation" },
      "effects": { "reputation": 3, "standing": -8, "reseau": -2, "popularity": 1 },
      "result": { "fr": "Une commission, un audit, une lettre. Il rend son écharpe et sa carte le même jour, et la section met six ans à s'en remettre.",
                  "en": "A committee, an audit, a letter. He hands back his sash and his membership card on the same day, and the branch takes six years to recover." } }
  ]
},

{
  "id": "premier_conseil",
  "once": true,
  "weight": 5,
  "when": { "position": ["conseiller"] },
  "tag": { "fr": "Premier conseil", "en": "First council meeting" },
  "text": {
    "fr": "Votre premier conseil municipal dans l'opposition. Vingt-huit points à l'ordre du jour, une majorité qui vote tout en bloc, et six heures devant vous. On vous a laissé la parole sur le point douze, la voirie.",
    "en": "Your first council meeting in opposition. Twenty-eight items on the agenda, a majority that votes everything through in a block, and six hours ahead of you. They have given you the floor on item twelve, road maintenance."
  },
  "choices": [
    { "label": { "fr": "Préparer le point douze mieux que quiconque", "en": "Prepare item twelve better than anyone" },
      "effects": { "eloquence": 1, "reputation": 2, "standing": 4, "energie": -1 },
      "result": { "fr": "Vous connaissez le coût au mètre linéaire et la date du dernier appel d'offres. Le maire vous répond sérieusement, ce qui est une victoire dont personne ne saura rien.",
                  "en": "You know the cost per metre and the date of the last tender. The mayor answers you seriously, which is a victory nobody will ever hear about." } },
    { "label": { "fr": "Faire une sortie sur un tout autre sujet", "en": "Make a scene about something else entirely" },
      "effects": { "notoriete": 2, "popularity": 5, "standing": -6, "reputation": -1 },
      "result": { "fr": "Vous parlez trois minutes de la voirie et douze du reste. Le journal local titre dessus et vos collègues vous appellent le tribun, ce qui n'est pas un compliment.",
                  "en": "You talk for three minutes about roads and twelve about everything else. The local paper leads on it and your colleagues call you the orator, which is not a compliment." } },
    { "label": { "fr": "Voter avec la majorité sur ce point-là", "en": "Vote with the majority on this one" },
      "effects": { "reseau": 2, "standing": 3, "popularity": -3 },
      "result": { "fr": "Le projet est bon, vous le dites, et vous le votez. Votre groupe vous le reproche pendant deux ans et le maire s'en souviendra plus longtemps.",
                  "en": "The scheme is a good one, you say so, and you vote for it. Your group holds it against you for two years and the mayor will remember it for longer." } }
  ]
},

{
  "id": "famille_politique",
  "once": true,
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller", "maire"], "maxTurn": 24 },
  "tag": { "fr": "À table", "en": "At the table" },
  "text": {
    "fr": "Un dimanche en famille, quelqu'un demande quand vous allez arrêter. Ce n'est pas méchant, c'est sincère, et personne autour de la table ne comprend pourquoi vous passez vos samedis dans une salle municipale.",
    "en": "A Sunday family lunch, somebody asks when you are going to stop. It is not unkind, it is sincere, and nobody around the table understands why you spend your Saturdays in a municipal hall."
  },
  "choices": [
    { "label": { "fr": "Leur expliquer, encore", "en": "Explain it to them, again" },
      "effects": { "eloquence": 1, "energie": -1, "reputation": 1 },
      "result": { "fr": "Vous faites votre meilleur discours de l'année devant onze personnes qui vous connaissent depuis toujours. Deux d'entre elles s'inscriront au parti dans l'année.",
                  "en": "You give your best speech of the year to eleven people who have known you all your life. Two of them will join the party within the year." } },
    { "label": { "fr": "Changer de sujet", "en": "Change the subject" },
      "effects": { "sangfroid": 1, "energie": 1 },
      "result": { "fr": "Vous parlez du temps et de la voiture de votre beau-frère. C'est la centième fois et ce sera la dernière fois qu'on vous pose la question.",
                  "en": "You talk about the weather and your brother-in-law's car. It is the hundredth time and the last time anyone will ask you." } },
    { "label": { "fr": "Les mettre à contribution", "en": "Put them to work" },
      "effects": { "reseau": 2, "energie": -1, "reputation": -1, "standing": 3 },
      "result": { "fr": "Votre cousin tient une permanence, votre mère fait les enveloppes, votre beau-frère prête la camionnette. Une famille est un premier réseau, et c'est comme ça que certaines dynasties commencent.",
                  "en": "Your cousin staffs the office, your mother stuffs envelopes, your brother-in-law lends the van. A family is a first network, and that is how certain dynasties begin." } }
  ]
},

{
  "id": "jeunesse_parti",
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller"], "maxAge": 42 },
  "tag": { "fr": "Les jeunes", "en": "The youth wing" },
  "text": {
    "fr": "Le mouvement des jeunes du parti cherche un responsable pour le département. C'est un titre sans pouvoir, avec deux cents adhérents dont trente actifs, et un accès direct au congrès national.",
    "en": "The party's youth movement is looking for a county organiser. It is a title without power, with two hundred members of whom thirty are active, and direct access to the national conference."
  },
  "choices": [
    { "label": { "fr": "Prendre le poste et le faire vivre", "en": "Take the post and make it live" },
      "effects": { "reseau": 3, "energie": -2, "standing": 6, "popularity": -1 },
      "result": { "fr": "Deux week-ends par mois, des formations, un journal ronéotypé. Dans quinze ans, quatre de ces trente-là seront députés et vous les aurez tous connus à vingt-deux ans.",
                  "en": "Two weekends a month, training days, a photocopied newsletter. In fifteen years, four of those thirty will be members of parliament, and you will have known all of them at twenty-two." } },
    { "label": { "fr": "Le prendre pour la carte de visite", "en": "Take it for the business card" },
      "effects": { "standing": 3, "notoriete": 1, "reputation": -1 },
      "result": { "fr": "Vous signez trois communiqués par an et vous laissez faire les autres. Le titre figure sur votre profil, ce qui était le but.",
                  "en": "You sign three statements a year and let others do the work. The title appears on your profile, which was the point." } },
    { "label": { "fr": "Refuser, ce n'est pas votre âge", "en": "Refuse, you are past that" },
      "effects": { "energie": 1, "reputation": 1, "standing": -3 },
      "result": { "fr": "Vous répondez que la place revient à plus jeune que vous. C'est juste, c'est élégant, et celui qui la prend vous doublera dans huit ans.",
                  "en": "You answer that the place should go to somebody younger. It is fair, it is elegant, and the person who takes it will overtake you in eight years." } }
  ]
},

{
  "id": "petite_enveloppe",
  "weight": 3,
  "when": { "position": ["conseiller", "maire"], "flag": { "dirtyMoney": false } },
  "tag": { "fr": "Petit arrangement", "en": "A small arrangement" },
  "text": {
    "fr": "Un artisan qui travaille pour la commune vous propose de refaire votre cuisine à prix coûtant. Ce n'est pas un pot-de-vin, c'est un geste, et il n'y aura jamais rien d'écrit.",
    "en": "A tradesman who works for the council offers to redo your kitchen at cost price. It is not a bribe, it is a gesture, and nothing will ever be written down."
  },
  "choices": [
    { "label": { "fr": "Accepter, ce n'est qu'une cuisine", "en": "Accept, it is only a kitchen" },
      "effects": { "money": 12000, "reseau": 1, "flags": { "dirtyMoney": true }, "strike": "casserole" },
      "result": { "fr": "Une belle cuisine et une facture qui ne correspond à rien. Dans onze ans, un journaliste retrouvera le devis et vous aurez oublié jusqu'à son nom.",
                  "en": "A fine kitchen and an invoice that matches nothing. In eleven years a journalist will find the estimate, and you will have forgotten the man's name." } },
    { "label": { "fr": "Refuser et payer le prix normal", "en": "Refuse and pay the going rate" },
      "effects": { "money": -9000, "reputation": 2, "reseau": -1 },
      "result": { "fr": "Vous payez plein tarif et vous demandez une facture en bonne et due forme. Il la fait, un peu vexé, et il en parlera comme d'une bizarrerie.",
                  "en": "You pay full price and ask for a proper invoice. He writes one, slightly offended, and will describe it as an oddity." } },
    { "label": { "fr": "Refuser et cesser de le voir", "en": "Refuse, and stop seeing him" },
      "effects": { "reputation": 3, "reseau": -2, "standing": -2 },
      "result": { "fr": "Vous coupez court et vous vous retirez de la commission d'appel d'offres. Deux collègues trouvent ça excessif, et ils ont peut-être raison.",
                  "en": "You cut it short and step down from the tendering committee. Two colleagues find it excessive, and they may be right." } }
  ]
},

{
  "id": "vieux_militant",
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller", "maire"] },
  "tag": { "fr": "Une carte de 1971", "en": "A membership card from 1971" },
  "text": {
    "fr": "Un adhérent de toujours meurt. Il n'a jamais rien été, il a tenu la permanence pendant quarante ans, et sa famille demande si quelqu'un du parti dira un mot à l'enterrement. C'est un jeudi, à deux heures de route.",
    "en": "A lifelong member dies. He was never anything, he kept the office running for forty years, and his family asks whether somebody from the party will say a word at the funeral. It is a Thursday, two hours' drive away."
  },
  "choices": [
    { "label": { "fr": "Y aller et parler", "en": "Go, and speak" },
      "effects": { "energie": -1, "standing": 8, "reputation": 2, "popularity": 2 },
      "result": { "fr": "Quarante personnes dans une église froide, et vous qui racontez une histoire de 1978 qu'on vous avait rapportée. Toute la fédération l'apprend avant le week-end.",
                  "en": "Forty people in a cold church, and you telling a story from 1978 that somebody had passed on to you. The whole federation knows before the weekend." } },
    { "label": { "fr": "Envoyer une gerbe et un mot", "en": "Send flowers and a note" },
      "effects": { "money": -300, "standing": -2 },
      "result": { "fr": "La gerbe est belle et le mot est juste. On note surtout que vous n'y étiez pas, parce que c'est ce qu'on note toujours.",
                  "en": "The flowers are handsome and the note is right. What gets noticed is that you were not there, because that is what always gets noticed." } },
    { "label": { "fr": "Y aller sans parler", "en": "Go, and say nothing" },
      "effects": { "energie": -1, "standing": 4, "reputation": 1, "sangfroid": 1 },
      "result": { "fr": "Vous restez au fond, vous serrez trois mains et vous repartez. C'est exactement ce qu'il fallait faire et personne ne vous en félicitera.",
                  "en": "You stand at the back, shake three hands and leave. It is exactly the right thing to do, and nobody will congratulate you for it." } }
  ]
},

{
  "id": "premiere_interview",
  "once": true,
  "weight": 5,
  "when": { "position": ["militant", "cadre", "conseiller"], "maxTurn": 20 },
  "tag": { "fr": "Trois questions", "en": "Three questions" },
  "text": {
    "fr": "Le journal local vous accorde trois questions dans son édition du samedi. C'est la première fois qu'on vous demande votre avis par écrit, et la journaliste a vingt-trois ans et un magnétophone.",
    "en": "The local paper gives you three questions in its Saturday edition. It is the first time anyone has asked for your opinion in print, and the reporter is twenty-three years old with a tape recorder."
  },
  "choices": [
    { "label": { "fr": "Répondre avec des éléments de langage", "en": "Answer with the approved lines" },
      "effects": { "standing": 5, "popularity": -2, "reputation": -1 },
      "result": { "fr": "Trois réponses irréprochables et parfaitement interchangeables. La fédération découpe l'article et l'affiche au local.",
                  "en": "Three impeccable and entirely interchangeable answers. The federation cuts out the article and pins it up at the office." } },
    { "label": { "fr": "Dire une chose vraie et risquée", "en": "Say one true and risky thing" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 8, "standing": -4, "reputation": 2 },
        "result": { "fr": "Une phrase que personne dans votre camp n'aurait osé écrire. Elle est reprise le lundi par la radio régionale et vous existez.",
                    "en": "A sentence nobody on your side would have dared write. It is picked up on Monday by regional radio, and you exist." } },
      "failure": { "effects": { "popularity": -4, "standing": -6, "strike": "menteur" },
        "result": { "fr": "La phrase sort mal, sans le contexte, en titre. Vous passez la semaine à expliquer que vous n'avez pas dit ça, ce qui est faux.",
                    "en": "The line comes out badly, without context, as the headline. You spend the week explaining that you did not say that, which is untrue." } } },
    { "label": { "fr": "Relire et corriger avant publication", "en": "Ask to check the copy before it runs" },
      "effects": { "sangfroid": 1, "reputation": -1, "reseau": -1, "standing": 2 },
      "result": { "fr": "Vous obtenez la relecture et vous coupez ce qui dépassait. La journaliste le note dans un coin de sa tête pour les dix prochaines années.",
                  "en": "You get to check it and cut whatever stuck out. The reporter files it away in a corner of her mind for the next ten years." } }
  ]
},

{
  "id": "permanence_quartier",
  "weight": 3,
  "when": { "position": ["conseiller", "maire"] },
  "tag": { "fr": "Permanence", "en": "The surgery" },
  "text": {
    "fr": "Trois heures de permanence le samedi matin. Une dame vient pour un problème de logement qui relève de l'État, un homme pour un voisin bruyant, et un troisième pour vous expliquer le monde pendant quarante minutes.",
    "en": "Three hours of constituency surgery on a Saturday morning. A woman comes about a housing problem that is a national matter, a man about a noisy neighbour, and a third to explain the world to you for forty minutes."
  },
  "choices": [
    { "label": { "fr": "Traiter le dossier de logement jusqu'au bout", "en": "See the housing case through to the end" },
      "effects": { "energie": -2, "popularity": 6, "reseau": 1, "standing": -1 },
      "result": { "fr": "Onze courriers, deux rendez-vous en préfecture et neuf mois. Elle obtient son logement et raconte l'histoire à tout l'immeuble pendant vingt ans.",
                  "en": "Eleven letters, two appointments at the prefecture and nine months. She gets her flat and tells the story to the whole block for twenty years." } },
    { "label": { "fr": "Rediriger tout le monde vers les bons services", "en": "Redirect everyone to the right department" },
      "effects": { "energie": 1, "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Vous êtes efficace, exact et parfaitement inutile. Aucun des trois ne reviendra, et aucun des trois ne votera pour vous.",
                  "en": "You are efficient, accurate and perfectly useless. None of the three will come back, and none of the three will vote for you." } },
    { "label": { "fr": "Écouter le troisième jusqu'au bout", "en": "Hear the third one out" },
      "effects": { "energie": -1, "popularity": 3, "sangfroid": 2 },
      "result": { "fr": "Quarante minutes sur l'état du pays, dont vous ne partagez pas un mot. En partant, il dit que c'est la première fois qu'on l'écoute, et ce n'est probablement pas faux.",
                  "en": "Forty minutes on the state of the country, not a word of which you share. On the way out he says it is the first time anyone has listened to him, and that is probably true." } }
  ]
},

{
  "id": "reseaux_debut",
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "En ligne", "en": "Online" },
  "text": {
    "fr": "Votre compte compte quatre cents abonnés, dont la moitié de votre section. Un ami vous explique que ce qui marche, c'est de publier trois fois par jour et de ne jamais s'excuser.",
    "en": "Your account has four hundred followers, half of them from your own branch. A friend explains that what works is posting three times a day and never apologising."
  },
  "choices": [
    { "label": { "fr": "Publier du contenu de terrain", "en": "Post from the ground" },
      "effects": { "notoriete": 2, "energie": -1, "popularity": 3 },
      "result": { "fr": "Des photos de réunions, des chiffres de budget municipal, un chantier de trottoir. Trois mille abonnés en deux ans, tous du département.",
                  "en": "Photographs of meetings, municipal budget figures, a pavement being relaid. Three thousand followers in two years, all from the county." } },
    { "label": { "fr": "Chercher le clash", "en": "Go looking for a fight" },
      "effects": { "notoriete": 4, "popularity": 4, "reputation": -3, "standing": -5, "strike": "radical" },
      "result": { "fr": "Deux disputes par semaine avec des inconnus, et une audience qui décuple. Votre fédération apprend votre existence par une capture d'écran.",
                  "en": "Two arguments a week with strangers, and an audience that grows tenfold. Your federation learns you exist from a screenshot." } },
    { "label": { "fr": "Laisser tomber, ce n'est pas votre monde", "en": "Leave it, it is not your world" },
      "effects": { "energie": 2, "notoriete": -1, "reputation": 1 },
      "result": { "fr": "Vous fermez le compte et vous retournez aux réunions. Cela vous coûtera exactement une génération d'électeurs.",
                  "en": "You close the account and go back to the meetings. It will cost you exactly one generation of voters." } }
  ]
},

{
  "id": "manif_locale",
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller", "maire"] },
  "tag": { "fr": "Dans la rue", "en": "In the street" },
  "text": {
    "fr": "Une usine du département annonce trois cents suppressions de postes. Un rassemblement est prévu devant les grilles, samedi, et l'on vous demande si vous serez là.",
    "en": "A factory in the county announces three hundred job cuts. A rally is planned outside the gates on Saturday, and you are being asked whether you will be there."
  },
  "choices": [
    { "label": { "fr": "Y aller et prendre le mégaphone", "en": "Go, and take the megaphone" },
      "effects": { "notoriete": 2, "popularity": 7, "energie": -1, "standing": -3 },
      "effectsIf": [
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 7 } },
        { "when": { "party": ["liberals"] }, "effects": { "standing": -6, "reputation": -1 } }
      ],
      "result": { "fr": "Vous parlez debout sur une palette, sans notes, devant deux cents personnes qui ne sont pas venues pour vous. On vous écoute quand même.",
                  "en": "You speak standing on a pallet, without notes, in front of two hundred people who did not come for you. They listen anyway." } },
    { "label": { "fr": "Y aller sans prendre la parole", "en": "Go, without speaking" },
      "effects": { "popularity": 3, "reputation": 2, "energie": -1 },
      "result": { "fr": "Vous restez deux heures dans le froid, au milieu du cortège, sans écharpe ni caméra. Trois personnes vous reconnaissent et s'en souviendront.",
                  "en": "You stand in the cold for two hours, in the middle of the march, with no sash and no camera. Three people recognise you and will remember." } },
    { "label": { "fr": "Recevoir la direction de l'usine à la place", "en": "Meet the plant's management instead" },
      "effects": { "reseau": 2, "standing": 4, "popularity": -5, "sangfroid": 1 },
      "result": { "fr": "Deux heures de réunion, un plan de reprise qui n'existera jamais, et une photo devant l'entrée qui circulera longtemps.",
                  "en": "A two-hour meeting, a rescue plan that will never exist, and a photograph outside the entrance that will circulate for a long time." } }
  ]
},

/* ==========================================================================
   LE POUVOIR ET L'OPPOSITION
   ==========================================================================
   Ces scènes lisent trois choses que le jeu ne savait pas dire avant : si
   votre camp gouverne ("ruling"), ce que le pays pense du gouvernement
   ("minApproval" / "maxApproval"), et si l'exécutif tient l'Assemblée
   ("majority"). Elles font le métier ordinaire d'une législature, celui
   qu'on ne voit jamais dans les campagnes : voter, bloquer, obstruer,
   négocier, et attendre.
   ========================================================================== */

/* ==========================================================================
   CE QUE LA CARRIÈRE FINIT PAR LAISSER SUR QUELQU'UN
   ==========================================================================
   Cinq scènes, cinq traits. Chacune porte des choix que tout le monde ne
   voit pas : le parcours, le parti, un trait déjà acquis ou une statistique
   ouvrent des portes que le personnage d'à côté ne verra jamais. C'est la
   règle du fichier des traits, et c'est ce qui fait qu'on ne joue pas deux
   fois la même scène.
   ========================================================================== */

/* ==========================================================================
   L'ARGENT QUI DÉCIDE
   ==========================================================================
   Le patrimoine médian d'une carrière va de quatre cent quatre-vingt mille
   euros au départ à près de deux millions à l'arrivée, et le paiement médian
   d'un événement valait cinquante mille. Mesuré sur quarante-cinq carrières,
   quatre-vingt-seize pour cent des portes verrouillées par l'argent étaient
   déjà ouvertes : payer n'était pas un choix, c'était une case à cocher.

   Ces scènes-là jouent aux ordres de grandeur du patrimoine, pas à ceux de
   l'argent de poche. Elles proposent des PALIERS : la même décision à cent
   cinquante mille, à cinq cent mille et à un million et demi ne produit pas
   le même résultat, et la fortune d'origine redevient ce qu'elle est dans la
   vraie vie, une avance que les autres passent leur carrière à combler.

   Et l'inverse existe : deux scènes où l'on peut engager gros pour gagner
   beaucoup, avec une vraie chance de tout perdre.
   ========================================================================== */

/* ==========================================================================
   LA POLITIQUE TELLE QU'ELLE SE FAIT MAINTENANT
   ==========================================================================
   Le début de partie se jouait en salles des fêtes et en réunions de section,
   ce qui existe encore et ne suffit plus à décrire le métier. Ces scènes-là
   se passent sur un téléphone, entre deux notifications, avec des délais qui
   se comptent en minutes.

   Le jeu ne moque jamais les faits eux-mêmes ni les gens qui les subissent :
   ce qu'il moque, c'est la machine qui les transforme en contenu avant que
   quiconque sache ce qui s'est passé.
   ========================================================================== */

/* ==========================================================================
   CE QUE CHAQUE CAMP FAIT D'UN MÊME PROBLÈME
   ==========================================================================
   Audit des portes conditionnelles : quatre partis sur six n'ouvraient aucun
   choix qui leur soit propre, et le parcours militant en ouvrait un seul
   contre quatorze pour le droit. Un joueur qui choisit la Gauche radicale ou
   le militantisme associatif voyait donc exactement les mêmes cartes qu'un
   avocat centriste, ce qui vide la création de personnage de la moitié de
   son sens.

   Ces scènes posent le même problème à tout le monde et laissent chaque camp
   y répondre avec ses propres réflexes. La satire ne porte pas sur les idées
   mais sur le fait que le réflexe est toujours prêt avant le dossier.
   ========================================================================== */

{
  "id": "emission_divertissement",
  "weight": 4,
  "when": { "minTurn": 8, "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "Le samedi soir", "en": "Saturday night" },
  "text": {
    "fr": "Une émission de divertissement vous invite. Pas de politique, pas de contradiction, un jeu, un déguisement éventuel et six millions de personnes qui ne regardent jamais les débats. Votre entourage est divisé, ce qui veut dire que la moitié est contre.",
    "en": "An entertainment show wants you. No politics, no cross-examination, a game, possibly a costume, and six million people who never watch debates. Your team is divided, which means half of them are against."
  },
  "choices": [
    { "label": { "fr": "Y aller et jouer le jeu jusqu'au bout", "en": "Go, and play along all the way" },
      "effects": { "popularity": 9, "notoriete": 4, "credibilite": -3, "standing": -4 },
      "result": { "fr": "Vous chantez faux devant six millions de personnes et vous êtes très bon perdant. On vous trouve enfin sympathique, et l'on ne vous écoutera plus jamais sur les retraites.",
                  "en": "You sing badly in front of six million people and lose very gracefully. People finally find you likeable, and nobody will ever listen to you about pensions again." } },
    { "label": { "fr": "Refuser : la fonction ne se prête pas à ça", "en": "Refuse: the office does not lend itself to that" },
      "effects": { "credibilite": 2, "standing": 3, "popularity": -4, "notoriete": -2 },
      "result": { "fr": "Vous déclinez au nom de la dignité de la fonction. Votre concurrent y va le mois suivant, gagne quatre points, et parle des retraites la semaine d'après.",
                  "en": "You decline in the name of the dignity of the office. Your rival goes on the following month, gains four points, and talks about pensions the week after." } },
    { "label": { "fr": "Négocier de placer une séquence de fond", "en": "Negotiate a serious segment into it" },
      "when": { "background": ["comms"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "notoriete": 3, "credibilite": 1, "standing": 1 },
        "result": { "fr": "Quatre-vingt-dix secondes sérieuses obtenues contre trois heures de plateau, et vous savez exactement ce que ça vaut parce que vous avez vendu ce genre d'arrangement pendant dix ans.",
                    "en": "Ninety serious seconds bought with three hours of studio, and you know exactly what that is worth because you sold that kind of arrangement for ten years." } },
      "failure": { "effects": { "popularity": 3, "credibilite": -3, "standing": -3 },
        "result": { "fr": "La séquence est tournée et coupée au montage, ce que vous auriez dû exiger par écrit. Vous connaissiez la règle et vous avez fait confiance.",
                    "en": "The segment is filmed and cut in the edit, which you should have demanded in writing. You knew the rule and you trusted them." } } },
    { "label": { "fr": "Y aller comme chez vous : c'était votre métier", "en": "Go as if it were home: it was your job" },
      "when": { "background": ["celebrity"] },
      "effects": { "popularity": 12, "notoriete": 4, "credibilite": -2, "reseau": 2 },
      "result": { "fr": "Vous connaissez le régisseur, le maquilleur et le producteur, et vous savez où sont les caméras avant qu'on vous le dise. Le public vous retrouve, et la moitié de votre parti se demande ce qu'il a fait.",
                  "en": "You know the floor manager, the make-up artist and the producer, and you know where the cameras are before anyone tells you. The audience gets you back, and half your party wonders what it has done." } },
    { "label": { "fr": "Y aller, et retourner l'émission en interview", "en": "Go, and turn the show into an interview" },
      "when": { "background": ["journalism"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 7, "credibilite": 3, "notoriete": 3, "standing": 2 },
        "result": { "fr": "Vous posez les questions à l'animateur pendant douze minutes et la production laisse tourner parce que c'est bon. C'est le seul divertissement de l'année dont on retiendra quelque chose.",
                    "en": "You interview the host for twelve minutes and the producers let it run because it is good television. It is the only entertainment show of the year anyone will remember something from." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -1, "standing": -3 },
        "result": { "fr": "L'animateur n'est pas là pour ça et le public non plus. Vous passez pour quelqu'un qui ne sait pas s'amuser, ce qui est plus grave à la télévision que d'avoir tort.",
                    "en": "The host is not there for that and neither is the audience. You come across as somebody who cannot have fun, which on television is worse than being wrong." } } }
  ]
},

{
  "id": "tribune_collective",
  "weight": 4,
  "when": { "minTurn": 6 },
  "tag": { "fr": "La tribune", "en": "The open letter" },
  "text": {
    "fr": "On vous propose de cosigner une tribune avec quatre-vingts personnalités. Le texte est bien écrit, la cause est juste, et vous ne connaissez ni son auteur réel ni les onze signataires qui vous précèdent dans la liste.",
    "en": "You are asked to co-sign an open letter with eighty public figures. The text is well written, the cause is right, and you know neither its actual author nor the eleven signatories above you on the list."
  },
  "choices": [
    { "label": { "fr": "Signer sans lire jusqu'au bout", "en": "Sign without reading to the end" },
      "effects": { "notoriete": 2, "popularity": 2, "credibilite": -1, "reputation": -1 },
      "result": { "fr": "Vous signez en douze secondes sur votre téléphone. Le paragraphe sept vous sera opposé pendant quatre ans et vous ne l'aurez jamais lu.",
                  "en": "You sign in twelve seconds on your phone. Paragraph seven will be quoted against you for four years and you will never have read it." } },
    { "label": { "fr": "Refuser de signer un texte collectif", "en": "Refuse to sign a collective text" },
      "effects": { "credibilite": 2, "reputation": 1, "notoriete": -2, "popularity": -2 },
      "result": { "fr": "Vous répondez que vous écrivez vos propres textes. C'est vrai, personne ne les lit, et c'est la contrepartie exacte de cette réponse.",
                  "en": "You reply that you write your own texts. It is true, nobody reads them, and that is the exact price of that answer." } },
    { "label": { "fr": "Demander à voir les autres signataires d'abord", "en": "Ask to see the other signatories first" },
      "effects": { "credibilite": 1, "sangfroid": 1, "notoriete": -1 },
      "result": { "fr": "On vous envoie la liste et vous en retirez deux noms pour vous. Le texte paraît sans vous et sans eux, ce qui ne change rien à rien.",
                  "en": "You are sent the list and remove two names for your own use. The letter appears without you and without them, which changes nothing whatsoever." } },
    { "label": { "fr": "Réécrire trois paragraphes avant de signer", "en": "Rewrite three paragraphs before signing" },
      "when": { "background": ["journalism", "academia"] },
      "effects": { "credibilite": 3, "reputation": 2, "reseau": 2, "energie": -1, "notoriete": 1 },
      "result": { "fr": "Vous corrigez deux erreurs factuelles et une phrase indéfendable, et l'auteur vous remercie sincèrement. Vous êtes le seul des quatre-vingts à l'avoir lu.",
                  "en": "You correct two factual errors and one indefensible sentence, and the author thanks you sincerely. You are the only one of the eighty who read it." } },
    { "label": { "fr": "Signer, et amener trente signatures de plus", "en": "Sign, and bring thirty more signatures" },
      "when": { "background": ["activism"] },
      "effects": { "reseau": 3, "popularity": 4, "notoriete": 2, "standing": 2, "energie": -2 },
      "result": { "fr": "Vous passez deux soirs au téléphone et la tribune sort à cent dix noms au lieu de quatre-vingts. C'est le travail que personne ne veut faire et c'est lui qui fait la une.",
                  "en": "You spend two evenings on the phone and the letter runs with a hundred and ten names instead of eighty. It is the work nobody wants to do and it is what makes the front page." } },
    { "label": { "fr": "Signer et faire porter le texte par votre camp", "en": "Sign, and get your side to carry the text" },
      "when": { "position": ["chef", "depute", "ministre"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "notoriete": 3, "credibilite": 1,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "La tribune devient une proposition de loi en six semaines. Les soixante-dix-neuf autres signataires découvrent qu'ils ont participé à un texte de votre parti.",
                    "en": "The letter becomes a bill in six weeks. The other seventy-nine signatories discover they contributed to a text from your party." } },
      "failure": { "effects": { "standing": -4, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Onze signataires retirent leur nom en dénonçant une récupération partisane. Ils ont raison, et vous ne pouvez évidemment pas le dire.",
                    "en": "Eleven signatories withdraw their names, denouncing a partisan hijack. They are right, and you obviously cannot say so." } } }
  ]
},

{
  "id": "ligne_usine",
  "weight": 5,
  "when": { "position": ["cadre", "conseiller", "maire", "depute", "chef"], "minTurn": 8 },
  "tag": { "fr": "La ligne", "en": "The line" },
  "text": {
    "fr": "Un site de six cents emplois ferme dans un département voisin. La direction invoque la concurrence, les syndicats parlent de dividendes, et les deux ont des chiffres. On vous demande votre position avant treize heures.",
    "en": "A six-hundred-job site is closing in a neighbouring county. Management blames competition, the unions point at dividends, and both have figures. Your position is wanted before one o'clock."
  },
  "choices": [
    { "label": { "fr": "Demander un rendez-vous à la direction et aux syndicats", "en": "Ask to meet both management and the unions" },
      "effects": { "credibilite": 2, "reseau": 1, "popularity": 1, "notoriete": -1 },
      "result": { "fr": "Deux réunions, quatre heures, aucune caméra. Vous en sortez avec une compréhension du dossier que personne ne vous demandera jamais.",
                  "en": "Two meetings, four hours, no cameras. You come out with an understanding of the file nobody will ever ask you for." } },
    { "label": { "fr": "Ne pas se prononcer : ce n'est pas votre territoire", "en": "Say nothing: it is not your patch" },
      "effects": { "energie": 2, "standing": 1, "popularity": -4 },
      "result": { "fr": "Vous laissez le député du coin s'exprimer. C'est la règle non écrite et personne ne vous en félicitera.",
                  "en": "You let the local member speak. It is the unwritten rule and nobody will thank you for it." } },
    { "label": { "fr": "Exiger la réquisition et la nationalisation", "en": "Demand requisition and nationalisation" },
      "when": { "party": ["radical_left"] },
      "effects": { "popularity": 7, "standing": 8, "credibilite": -2, "notoriete": 2,
                   "landscape": { "self": 0.4 } },
      "result": { "fr": "Vous êtes sur place à quinze heures avec une proposition que personne ne votera jamais. Les six cents salariés le savent et vous applaudissent quand même, parce que vous êtes venu.",
                  "en": "You are on site by three with a proposal nobody will ever vote for. The six hundred workers know it and applaud anyway, because you came." } },
    { "label": { "fr": "Convoquer une table ronde avec l'État et la région", "en": "Convene a round table with the state and the region" },
      "when": { "party": ["socdem"] },
      "effects": { "credibilite": 2, "reseau": 3, "standing": 5, "popularity": 3, "energie": -2 },
      "result": { "fr": "Onze jours de négociation et un plan qui sauve deux cent quarante emplois sur six cents. C'est un échec de soixante pour cent qu'on présentera comme une victoire, et ce sera les deux.",
                  "en": "Eleven days of negotiation and a plan that saves two hundred and forty jobs out of six hundred. It is a sixty per cent failure that will be presented as a win, and it will be both." } },
    { "label": { "fr": "Demander une mission d'inspection avant toute chose", "en": "Ask for an inspection report before anything else" },
      "when": { "party": ["centrists"] },
      "effects": { "credibilite": 3, "standing": 4, "popularity": -5, "reputation": 1 },
      "result": { "fr": "Le rapport sortira dans sept mois, quand le site sera fermé depuis cinq. Il sera excellent et il conclura qu'il aurait fallu agir en février.",
                  "en": "The report will come out in seven months, five after the site closes. It will be excellent and will conclude that action was needed in February." } },
    { "label": { "fr": "Expliquer que l'État n'a pas à financer une entreprise qui perd", "en": "Explain that the state should not fund a loss-making firm" },
      "when": { "party": ["liberals"] },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 4, "standing": 6, "popularity": -7, "reputation": 2 },
        "result": { "fr": "Vous dites devant les caméras ce que tout le monde pense en réunion. Le pays vous déteste pendant huit jours et trois éditorialistes écrivent que vous avez raison.",
                    "en": "You say in front of the cameras what everybody thinks in meetings. The country hates you for eight days and three commentators write that you are right." } },
      "failure": { "effects": { "popularity": -13, "standing": -4, "credibilite": -1, "reputation": -1 },
        "result": { "fr": "La phrase est juste et le moment est le pire possible. On la ressortira à chaque fermeture d'usine pendant dix ans, sans jamais la remettre dans son contexte.",
                    "en": "The sentence is right and the timing is the worst possible. It will be replayed at every plant closure for ten years, never once in context." } } },
    { "label": { "fr": "Mettre en cause le laisser-faire de l'État sur la filière", "en": "Blame the state for letting the whole sector go" },
      "when": { "party": ["conservatives"] },
      "effects": { "popularity": 5, "standing": 5, "credibilite": 1, "approval": -5 },
      "result": { "fr": "Vous ne parlez ni de l'entreprise ni des syndicats, seulement de trente ans de décisions publiques. C'est le seul angle qui ne fâche personne dans votre camp.",
                  "en": "You talk about neither the company nor the unions, only thirty years of public decisions. It is the only angle that upsets nobody in your own camp." } },
    { "label": { "fr": "Dénoncer la délocalisation et la concurrence déloyale", "en": "Denounce offshoring and unfair competition" },
      "when": { "party": ["identitarians"] },
      "effects": { "popularity": 9, "standing": 6, "credibilite": -3, "notoriete": 2,
                   "landscape": { "self": 0.5 } },
      "result": { "fr": "Vous nommez le pays où partent les machines avant d'avoir vérifié qu'elles y partent. Elles y partent, et cela ne rend pas la vérification inutile.",
                  "en": "You name the country the machines are going to before checking that they are. They are, and that does not make the checking pointless." } },
    { "label": { "fr": "Organiser la caisse de grève depuis votre réseau", "en": "Organise the strike fund through your own network" },
      "when": { "background": ["activism"] },
      "effects": { "popularity": 6, "reseau": 3, "standing": -3, "energie": -2, "reputation": 2 },
      "result": { "fr": "Quarante mille euros récoltés en neuf jours par des gens que vous connaissez depuis vingt ans. Aucun journal n'en parlera et le piquet tiendra trois semaines de plus.",
                  "en": "Forty thousand euros raised in nine days by people you have known for twenty years. No paper will mention it and the picket will hold three weeks longer." } }
  ]
},

{
  "id": "militant_origine",
  "once": true,
  "weight": 5,
  "when": { "background": ["activism"], "minTurn": 6 },
  "tag": { "fr": "Ceux d'avant", "en": "The old crowd" },
  "text": {
    "fr": "L'association où vous avez tout appris tient son assemblée générale et vous y êtes invité. Trois personnes de l'époque vous attendent avec une question simple : est-ce que vous êtes encore des leurs, ou est-ce que vous venez chercher quelque chose.",
    "en": "The association where you learned everything is holding its general meeting and you are invited. Three people from those days are waiting with one simple question: are you still one of them, or have you come to get something."
  },
  "choices": [
    { "label": { "fr": "Y aller et écouter trois heures sans parler", "en": "Go and listen for three hours without speaking" },
      "effects": { "reputation": 3, "popularity": 3, "reseau": 2, "energie": -2, "standing": -2 },
      "result": { "fr": "Vous restez jusqu'au vote des motions et vous repartez sans avoir pris le micro. C'est la seule chose qu'ils attendaient et personne ne vous le dira.",
                  "en": "You stay until the motions are voted and leave without taking the microphone. It is the one thing they were waiting for and nobody will tell you so." } },
    { "label": { "fr": "Y aller et leur demander leur soutien public", "en": "Go and ask them for a public endorsement" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "reseau": 3, "notoriete": 2, "standing": 2 },
        "result": { "fr": "Ils votent le soutien à main levée, sans enthousiasme et sans réserve. Trois cents bénévoles vaudront plus que n'importe quel encart de campagne.",
                    "en": "They vote the endorsement by a show of hands, without enthusiasm and without reservation. Three hundred volunteers will be worth more than any campaign advert." } },
      "failure": { "effects": { "popularity": -5, "reputation": -3, "reseau": -2 },
        "result": { "fr": "On vous répond que l'association ne soutient personne et que vous le saviez avant d'entrer. Vous le saviez.",
                    "en": "You are told the association endorses nobody and that you knew that before walking in. You knew." } } },
    { "label": { "fr": "Ne pas y aller : ce n'est plus votre place", "en": "Do not go: it is no longer your place" },
      "effects": { "standing": 3, "energie": 1, "popularity": -6, "reputation": -2 },
      "result": { "fr": "Vous envoyez un message d'excuse et un ordre du jour chargé. Ils comprennent parfaitement, et c'est bien cela le problème.",
                  "en": "You send apologies and a heavy diary. They understand perfectly, and that is precisely the problem." } },
    { "label": { "fr": "Leur proposer de porter leur revendication au Parlement", "en": "Offer to take their demand to Parliament" },
      "when": { "position": ["depute", "euro"] },
      "effects": { "popularity": 5, "credibilite": 2, "reseau": 2, "standing": -4, "energie": -2 },
      "result": { "fr": "Vous déposez leur texte tel quel, avec leurs mots, et il ne passera pas. Ils le savent, ils l'ont vu écrit noir sur blanc au Journal officiel, et cela n'a pas de prix pour eux.",
                  "en": "You table their text as it stands, in their words, and it will not pass. They know, they have seen it printed in the official record, and to them that is priceless." } }
  ]
},

{
  "id": "militant_permanent",
  "weight": 4,
  "when": { "background": ["activism"], "position": ["militant", "cadre", "conseiller"], "minTurn": 4 },
  "tag": { "fr": "Le salariat", "en": "Going professional" },
  "text": {
    "fr": "On vous propose un poste de permanent : un salaire, un bureau, et la fin de la question de savoir comment vous vivez. C'est aussi la fin de quelque chose d'autre, et les trois personnes qui vous l'ont proposé le savent parfaitement.",
    "en": "You are offered a paid staff post: a salary, an office, and the end of the question of how you live. It is also the end of something else, and the three people who offered it know that perfectly well."
  },
  "choices": [
    { "label": { "fr": "Accepter et devenir un professionnel", "en": "Accept and turn professional" },
      "effects": { "money": 30000, "standing": 8, "reseau": 2, "popularity": -3, "reputation": -1 },
      "result": { "fr": "Trente-neuf mille euros par an pour faire ce que vous faisiez gratuitement. Vous devenez meilleur, plus disponible, et légèrement moins crédible quand vous parlez de désintéressement.",
                  "en": "Thirty-nine thousand euros a year to do what you were doing for free. You get better, more available, and slightly less credible when you talk about disinterest." } },
    { "label": { "fr": "Refuser et garder votre métier", "en": "Refuse and keep your job" },
      "effects": { "reputation": 3, "credibilite": 1, "energie": -3, "standing": -5 },
      "result": { "fr": "Vous continuez à militer le soir et le week-end, avec un employeur qui commence à compter vos absences. C'est plus dur et personne ne pourra jamais dire que vous en vivez.",
                  "en": "You keep campaigning evenings and weekends, with an employer starting to count your absences. It is harder and nobody will ever be able to say you make a living from it." } },
    { "label": { "fr": "Accepter à mi-temps, et le dire", "en": "Accept half-time, and say so" },
      "when": { "stat": { "energie": { "min": 11 } } },
      "effects": { "money": 15000, "standing": 4, "reputation": 2, "energie": -2, "reseau": 1 },
      "result": { "fr": "Un mi-temps déclaré, affiché, et un métier gardé à côté. C'est la formule la plus honnête et celle qui fatigue le plus, ce qui est souvent la même chose.",
                  "en": "A declared, published half-time post, and a job kept alongside. It is the most honest arrangement and the most exhausting, which is often the same thing." } },
    { "label": { "fr": "Négocier le poste pour quelqu'un d'autre de l'association", "en": "Negotiate the post for somebody else from the association" },
      "effects": { "reseau": 4, "reputation": 3, "standing": 2, "money": -5000 },
      "result": { "fr": "Vous obtenez le poste pour une bénévole qui en a plus besoin que vous. Elle ne l'oubliera pas, et vous venez de vous faire une alliée pour trente ans.",
                  "en": "You get the post for a volunteer who needs it more than you. She will not forget, and you have just made an ally for thirty years." } }
  ]
},

{
  "id": "emploi_familial",
  "once": true,
  "weight": 4,
  "when": { "position": ["depute", "euro"], "minTurn": 8 },
  "tag": { "fr": "L'assistant", "en": "The assistant" },
  "text": {
    "fr": "Votre enveloppe d'assistants n'est pas dépensée et votre conjointe cherche un poste. Elle est compétente, le travail est réel, et l'ensemble est parfaitement légal jusqu'au jour où quelqu'un décide que ce ne l'est plus.",
    "en": "Your staff allowance is not fully spent and your spouse is looking for work. She is competent, the job is real, and the whole thing is perfectly legal until the day somebody decides it is not."
  },
  "choices": [
    { "label": { "fr": "L'embaucher, comme tout le monde", "en": "Hire her, like everybody else" },
      "effects": { "money": 45000, "energie": 1, "strike": "casserole", "reputation": -1 },
      "result": { "fr": "Un contrat, des fiches de paie et un travail effectivement fait. Cela figurera dans votre dossier de presse jusqu'à la fin, avec la mention « légal à l'époque ».",
                  "en": "A contract, payslips and work actually done. It will be in your press file until the end, with the note “legal at the time”." } },
    { "label": { "fr": "Ne pas y toucher", "en": "Do not go near it" },
      "effects": { "reputation": 2, "credibilite": 1, "money": -15000 },
      "result": { "fr": "Vous recrutez quelqu'un que vous ne connaissez pas et vous payez une chambre de bonne à votre conjointe ailleurs. C'est plus cher et cela ne se raconte à personne.",
                  "en": "You hire somebody you do not know and pay for a room for your spouse somewhere else. It costs more and it is told to nobody." } },
    { "label": { "fr": "L'embaucher et publier le contrat", "en": "Hire her and publish the contract" },
      "when": { "stat": { "reputation": { "min": 12 } } },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "money": 45000, "credibilite": 2, "reputation": 2, "notoriete": 1 },
        "result": { "fr": "Contrat, missions, horaires, tout en ligne le premier jour. Personne ne peut plus rien en faire, et deux collègues vous détestent d'avoir montré que c'était possible.",
                    "en": "Contract, duties, hours, all online on day one. Nobody can do anything with it any more, and two colleagues hate you for showing it could be done." } },
      "failure": { "effects": { "money": 45000, "reputation": -3, "popularity": -6, "strike": "casserole" },
        "result": { "fr": "La transparence attire l'attention sur ce que personne n'aurait regardé. Vous avez fourni le dossier de presse vous-même.",
                    "en": "The transparency draws attention to what nobody would have looked at. You supplied the press file yourself." } } },
    { "label": { "fr": "Faire embaucher par un collègue, réciproquement", "en": "Have a colleague hire her, and return the favour" },
      "when": { "personality": ["calculating"], "stat": { "reseau": { "min": 9 } } },
      "effects": { "money": 40000, "reseau": 2, "reputation": -2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Il embauche la vôtre, vous embauchez la sienne, et les deux travaillent vraiment. C'est légal, c'est répandu, et le jour où cela sortira ce sera pour tout le monde en même temps.",
                  "en": "He hires yours, you hire his, and both genuinely work. It is legal, it is widespread, and the day it comes out it will come out for everybody at once." } }
  ]
},

{
  "id": "declaration_patrimoine",
  "once": true,
  "weight": 4,
  "when": { "position": ["depute", "euro", "maire", "ministre", "premier"], "minTurn": 6, "minMoney": 300000 },
  "tag": { "fr": "La déclaration", "en": "The declaration" },
  "text": {
    "fr": "Vous avez trente jours pour déclarer votre patrimoine à l'autorité, au centime. Votre comptable vous signale trois lignes discutables : un bien de famille sous-évalué depuis vingt ans, un compte ouvert à l'étranger pour des raisons oubliées, et une collection dont personne ne connaît la valeur.",
    "en": "You have thirty days to declare your wealth to the authority, to the last cent. Your accountant flags three questionable lines: a family property undervalued for twenty years, an account opened abroad for forgotten reasons, and a collection nobody can put a price on."
  },
  "choices": [
    { "label": { "fr": "Tout déclarer, à la valeur haute", "en": "Declare everything, at the high valuation" },
      "effects": { "reputation": 3, "credibilite": 2, "money": -70000, "popularity": -3 },
      "result": { "fr": "Le chiffre publié est plus élevé que ce que le pays imaginait et vous coûte trois points dans les sondages. Vous ne serez jamais rattrapé sur ce sujet, et c'est la seule chose qui compte.",
                  "en": "The published figure is higher than the country imagined and costs you three points. You will never be caught out on this subject, and that is the only thing that matters." } },
    { "label": { "fr": "Déclarer l'essentiel et oublier la collection", "en": "Declare the main items and forget the collection" },
      "effects": { "strike": "casserole", "money": 20000, "reputation": -1 },
      "result": { "fr": "Une omission de bonne foi, comme il s'en fait des centaines. Elle dormira dans un dossier jusqu'à ce que quelqu'un ait besoin de la réveiller.",
                  "en": "An omission in good faith, of the kind made in their hundreds. It will sleep in a file until somebody needs to wake it up." } },
    { "label": { "fr": "Fermer le compte étranger avant de déclarer", "en": "Close the foreign account before declaring" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "money": -40000, "sangfroid": 1 },
        "result": { "fr": "Le compte n'existe plus au moment où vous signez, ce qui est exact et ne trompe personne d'autre que le formulaire.",
                    "en": "The account no longer exists at the moment you sign, which is accurate and deceives nobody except the form." } },
      "failure": { "effects": { "reputation": -3, "popularity": -8, "flags": { "investigated": true }, "trait": "casserole" },
        "result": { "fr": "La clôture précède la déclaration de onze jours, et c'est cette date-là qui intéresse tout le monde. On ne ferme pas un compte discrètement quand on est déclarant.",
                    "en": "The closure precedes the declaration by eleven days, and that date is what interests everybody. You do not quietly close an account when you are a declarant." } } },
    { "label": { "fr": "Faire réévaluer le bien de famille par un expert", "en": "Have the family property revalued by an expert" },
      "when": { "background": ["law", "business"] },
      "effects": { "money": -25000, "credibilite": 2, "reputation": 1 },
      "result": { "fr": "Un rapport de quarante pages qui justifie chaque chiffre. Cela coûte le prix d'une petite voiture et cela vaut dix ans de tranquillité.",
                  "en": "A forty-page report justifying every figure. It costs the price of a small car and buys ten years of peace." } }
  ]
},

{
  "id": "demission_directe",
  "once": true,
  "weight": 8,
  "when": { "position": ["ministre", "premier"], "minTurn": 10, "maxApproval": 50 },
  "tag": { "fr": "Sept heures cinquante", "en": "Ten to eight" },
  "text": {
    "fr": "Vous êtes en direct à la matinale et l'on vous demande, pour la quatrième fois ce mois-ci, si vous vous reconnaissez encore dans la politique du gouvernement. Vous avez trois secondes pour répondre et vous savez que la réponse honnête est non.",
    "en": "You are live on the breakfast show and being asked, for the fourth time this month, whether you still recognise yourself in the government's policy. You have three seconds to answer and you know the honest answer is no."
  },
  "choices": [
    { "label": { "fr": "Démissionner à l'antenne", "en": "Resign on air" },
      "effects": { "office": "none", "popularity": 14, "notoriete": 4, "reputation": 3, "standing": -16, "approval": -9 },
      "result": { "fr": "Vous l'annoncez avant d'avoir prévenu Matignon, l'Élysée ou votre directeur de cabinet. Le pays trouve cela magnifique et vous ne serez plus jamais ministre de personne.",
                  "en": "You announce it before telling the prime minister, the presidency or your own chief of staff. The country finds it magnificent and you will never be anybody's minister again." } },
    { "label": { "fr": "Tenir la ligne encore une fois", "en": "Hold the line one more time" },
      "effects": { "standing": 6, "popularity": -5, "credibilite": -1, "energie": -2, "approval": 2 },
      "result": { "fr": "Quatre minutes de langue de bois que vous entendez sortir de votre propre bouche. Vous rentrez au ministère et vous ne dites rien à personne.",
                  "en": "Four minutes of boilerplate you hear coming out of your own mouth. You go back to the ministry and say nothing to anybody." } },
    { "label": { "fr": "Dire ce que vous pensez sans démissionner", "en": "Say what you think without resigning" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "credibilite": 2, "standing": -8, "approval": -5 },
        "result": { "fr": "Vous exposez un désaccord précis, sur un dossier précis, sans jamais dire le mot démission. On vous laisse en poste parce qu'on ne sait pas comment vous en sortir.",
                    "en": "You set out a precise disagreement, on a precise file, without ever saying the word resign. You are left in place because nobody knows how to remove you." } },
      "failure": { "effects": { "office": "none", "popularity": 3, "standing": -12, "approval": -6 },
        "result": { "fr": "Le désaccord passe pour une démission qui n'ose pas se dire, et Matignon vous en dispense à midi. Vous avez perdu le poste sans avoir eu le geste.",
                    "en": "The disagreement reads as a resignation that dare not speak, and by noon you are relieved of the trouble. You lost the job without getting the gesture." } } },
    { "label": { "fr": "Retourner la question sur le journaliste", "en": "Turn the question back on the interviewer" },
      "when": { "personality": ["provocative"], "stat": { "charisme": { "min": 11 } } },
      "effects": { "notoriete": 3, "popularity": 4, "credibilite": -2, "standing": 3 },
      "result": { "fr": "Vous lui demandez s'il se reconnaît encore dans son propre journal. La séquence tourne, le fond disparaît, et le gouvernement vous trouve soudain très utile.",
                  "en": "You ask whether he still recognises himself in his own newspaper. The clip travels, the substance vanishes, and the government suddenly finds you very useful." } }
  ]
},

{
  "id": "convention_citoyenne",
  "once": true,
  "weight": 3,
  "when": { "position": ["ministre", "premier", "chef", "depute"], "minTurn": 14 },
  "tag": { "fr": "Cent cinquante citoyens", "en": "A hundred and fifty citizens" },
  "text": {
    "fr": "On installe une convention citoyenne tirée au sort sur un sujet que le Parlement n'arrive pas à trancher. Cent cinquante personnes, neuf week-ends, des experts, et un engagement solennel à reprendre leurs propositions. Vous savez déjà lesquelles ne passeront pas.",
    "en": "A citizens' convention drawn by lot is being set up on a question Parliament cannot settle. A hundred and fifty people, nine weekends, experts, and a solemn commitment to take up their proposals. You already know which ones will not survive."
  },
  "choices": [
    { "label": { "fr": "Promettre de tout reprendre, sans filtre", "en": "Promise to take up everything, unfiltered" },
      "effects": { "popularity": 8, "credibilite": -1, "approval": 4, "standing": -3 },
      "result": { "fr": "La formule est belle et elle sera citée pendant deux ans, à chaque fois qu'une proposition sera écartée. Vous venez de fabriquer votre propre procès.",
                  "en": "The phrase is fine and will be quoted for two years, each time a proposal is dropped. You have just manufactured your own trial." } },
    { "label": { "fr": "Annoncer d'emblée ce qui ne passera pas", "en": "Say up front what will not survive" },
      "effects": { "credibilite": 3, "reputation": 2, "popularity": -5, "approval": -2 },
      "result": { "fr": "Vous expliquez au premier week-end que trois sujets sont hors périmètre. Douze participants claquent la porte, les cent trente-huit autres travaillent en sachant pour quoi.",
                  "en": "You explain on the first weekend that three subjects are out of scope. Twelve participants walk out, the other hundred and thirty-eight work knowing what for." } },
    { "label": { "fr": "S'asseoir avec eux les neuf week-ends", "en": "Sit with them for all nine weekends" },
      "when": { "stat": { "energie": { "min": 12 } } },
      "effects": { "popularity": 6, "credibilite": 2, "reputation": 2, "energie": -4, "reseau": 1 },
      "result": { "fr": "Neuf samedis dans une salle de la République, sans conseiller et sans téléphone. Vous ressortez avec un dossier que vous connaissez mieux que votre administration.",
                  "en": "Nine Saturdays in a state building, no adviser and no phone. You come out knowing the file better than your own civil servants." } },
    { "label": { "fr": "Y placer des experts qui pensent comme vous", "en": "Place experts who think as you do" },
      "when": { "stat": { "reseau": { "min": 11 } }, "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "approval": 5, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "Quatre auditions bien choisies suffisent à orienter neuf week-ends. Les propositions ressemblent à votre programme et personne ne peut dire que vous les avez écrites.",
                    "en": "Four well-chosen hearings are enough to steer nine weekends. The proposals resemble your programme and nobody can say you wrote them." } },
      "failure": { "effects": { "popularity": -9, "reputation": -3, "approval": -7, "credibilite": -2 },
        "result": { "fr": "Deux participants publient la liste des experts entendus et leurs affiliations. La convention se retourne entièrement contre vous en un week-end.",
                    "en": "Two participants publish the list of experts heard and their affiliations. The convention turns entirely against you in a single weekend." } } }
  ]
},

{
  "id": "diplome_cv",
  "once": true,
  "weight": 3,
  "when": { "minTurn": 7, "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "La ligne du CV", "en": "The line on the CV" },
  "text": {
    "fr": "Un journaliste a vérifié votre biographie officielle. La formation que vous mentionnez depuis quinze ans est un certificat de trois mois, pas le diplôme que le mot laisse entendre. Vous ne vous rappelez même pas qui a écrit cette ligne.",
    "en": "A reporter has checked your official biography. The training you have listed for fifteen years is a three-month certificate, not the degree the wording implies. You cannot even remember who wrote that line."
  },
  "choices": [
    { "label": { "fr": "Corriger la fiche et le dire", "en": "Correct the page and say so" },
      "effects": { "reputation": 2, "credibilite": 1, "popularity": -3, "notoriete": 1 },
      "result": { "fr": "Vous corrigez en ligne le jour même avec une phrase d'explication. L'article sort quand même et il est deux fois plus court que prévu.",
                  "en": "You correct it online the same day with a sentence of explanation. The article runs anyway and is half as long as planned." } },
    { "label": { "fr": "Maintenir que c'est équivalent", "en": "Maintain it is equivalent" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "eloquence": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 2, "standing": 2, "reputation": -1 },
        "result": { "fr": "Vous tenez trois jours sur la notion d'équivalence et le sujet s'épuise. Ce n'était pas équivalent, et plus personne n'ira vérifier.",
                    "en": "You hold out for three days on the notion of equivalence and the story runs out. It was not equivalent, and nobody will check again." } },
      "failure": { "effects": { "popularity": -9, "credibilite": -3, "reputation": -2, "strike": "menteur" },
        "result": { "fr": "L'école publie une mise au point de deux lignes. Deux lignes suffisent quand elles sont signées par l'établissement lui-même.",
                    "en": "The school publishes a two-line clarification. Two lines are enough when the institution itself signs them." } } },
    { "label": { "fr": "Raconter pourquoi vous n'avez pas fait ces études", "en": "Explain why you never did those studies" },
      "when": { "origin": ["modest", "middle"] },
      "effects": { "popularity": 8, "reputation": 3, "credibilite": 1, "notoriete": 2 },
      "result": { "fr": "Vous expliquez qu'on ne vous a pas proposé cette école et pourquoi. Le papier change complètement de sujet et devient le meilleur portrait qu'on ait fait de vous.",
                  "en": "You explain that school was never offered to you, and why. The piece changes subject entirely and becomes the best profile ever written about you." } }
  ]
},

{
  "id": "maire_desobeissance",
  "weight": 4,
  "when": { "position": ["maire"], "minTurn": 8 },
  "tag": { "fr": "L'arrêté", "en": "The by-law" },
  "text": {
    "fr": "Une décision nationale s'applique chez vous et votre conseil municipal la refuse à l'unanimité. Vous pouvez prendre un arrêté qui sera annulé par le tribunal administratif dans six semaines, et tout le monde le sait, à commencer par vous.",
    "en": "A national decision applies in your town and your council rejects it unanimously. You can issue a by-law that the administrative court will strike down in six weeks, and everybody knows it, starting with you."
  },
  "choices": [
    { "label": { "fr": "Prendre l'arrêté et aller jusqu'au tribunal", "en": "Issue the by-law and go to court" },
      "effects": { "popularity": 9, "notoriete": 3, "credibilite": -2, "standing": 2, "approval": -3 },
      "result": { "fr": "Six semaines de tribune nationale pour une décision annulée d'avance. Vos administrés savent que vous vous êtes battu, et c'est très exactement ce que vous vouliez.",
                  "en": "Six weeks of national platform for a decision struck down in advance. Your residents know you fought, and that is very precisely what you wanted." } },
    { "label": { "fr": "Appliquer, et expliquer pourquoi", "en": "Apply it, and explain why" },
      "effects": { "credibilite": 3, "reputation": 2, "popularity": -6, "standing": 3 },
      "result": { "fr": "Vous appliquez une décision que vous désapprouvez et vous passez trois réunions publiques à dire pourquoi vous n'avez pas le choix. Personne n'aime cette réponse et personne ne peut la contredire.",
                  "en": "You apply a decision you disagree with and spend three public meetings explaining why you have no choice. Nobody likes that answer and nobody can contradict it." } },
    { "label": { "fr": "Prendre l'arrêté avec quarante autres maires", "en": "Issue it alongside forty other mayors" },
      "when": { "stat": { "reseau": { "min": 10 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "notoriete": 4, "reseau": 3, "standing": 5,
                                "landscape": { "self": 0.5 } },
        "result": { "fr": "Quarante-trois arrêtés identiques signés le même matin. Ce n'est plus un maire isolé, c'est un mouvement, et le ministère recule sur deux points avant le jugement.",
                    "en": "Forty-three identical by-laws signed the same morning. It is no longer one isolated mayor, it is a movement, and the ministry gives ground on two points before the ruling." } },
      "failure": { "effects": { "popularity": -4, "reseau": -2, "standing": -5 },
        "result": { "fr": "Onze maires signent, les autres se désistent la veille. Vous portez seul une initiative collective, ce qui est la pire des deux positions.",
                    "en": "Eleven mayors sign, the rest pull out the day before. You carry a collective initiative alone, which is the worse of the two positions." } } },
    { "label": { "fr": "Négocier une dérogation au lieu de désobéir", "en": "Negotiate an exemption instead of disobeying" },
      "when": { "background": ["civil", "law"] },
      "effects": { "credibilite": 2, "reseau": 2, "popularity": 3, "notoriete": -1 },
      "result": { "fr": "Trois rendez-vous au ministère et un courrier qui accorde dix-huit mois. Vous obtenez plus que l'arrêté n'aurait donné et personne n'en parlera jamais.",
                  "en": "Three meetings at the ministry and a letter granting eighteen months. You get more than the by-law would have delivered and nobody will ever mention it." } }
  ]
},

{
  "id": "fait_divers_recup",
  "weight": 5,
  "when": { "minTurn": 3 },
  "tag": { "fr": "Dans l'heure", "en": "Within the hour" },
  "text": {
    "fr": "Une agression dans une gare de votre département, trois lignes de dépêche, aucun nom, aucun détail vérifié. Le compte national du parti a déjà publié. On vous demande de relayer avant que le sujet ne redescende, c'est-à-dire avant ce soir.",
    "en": "An assault at a station in your area, three lines of wire copy, no names, nothing verified. The party's national account has already posted. You are asked to share it before the story fades, which means before this evening."
  },
  "choices": [
    { "label": { "fr": "Relayer, avec les mots qu'on vous envoie", "en": "Share it, with the wording you are sent" },
      "effects": { "popularity": 5, "standing": 4, "reputation": -2, "credibilite": -1 },
      "result": { "fr": "Quatorze mille partages en six heures. Le parquet publiera un communiqué dans huit jours qui dira autre chose, et personne ne le relaiera.",
                  "en": "Fourteen thousand shares in six hours. The prosecutor's office will put out a statement in a week saying something else, and nobody will share that." } },
    { "label": { "fr": "Attendre de savoir ce qui s'est passé", "en": "Wait until you know what happened" },
      "effects": { "reputation": 3, "credibilite": 2, "standing": -6, "popularity": -3 },
      "result": { "fr": "Vous ne publiez rien pendant quatre jours. Le siège note votre silence, vos concurrents notent votre absence, et vous êtes le seul à ne rien avoir à retirer.",
                  "en": "You post nothing for four days. Headquarters notes your silence, your rivals note your absence, and you are the only one with nothing to delete." } },
    { "label": { "fr": "Publier votre propre texte, plus prudent", "en": "Post your own text, more careful" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 4, "credibilite": 2, "reputation": 1, "standing": 1 },
        "result": { "fr": "Six phrases qui disent la colère sans dire les faits que personne ne connaît. On vous cite dans les deux camps, ce qui n'arrive presque jamais sur ce genre de sujet.",
                    "en": "Six sentences that name the anger without naming facts nobody knows. You are quoted on both sides, which almost never happens on this kind of subject." } },
      "failure": { "effects": { "popularity": -6, "standing": -4, "reputation": -1 },
        "result": { "fr": "Votre prudence est lue comme une gêne et votre gêne comme un aveu. Vous avez réussi à déplaire à tout le monde en trois cent quatre-vingts signes.",
                    "en": "Your caution reads as embarrassment and your embarrassment as an admission. You have managed to displease everybody in three hundred and eighty characters." } } },
    { "label": { "fr": "En faire un symbole national dès ce soir", "en": "Make it a national symbol tonight" },
      "when": { "party": ["identitarians", "radical_left"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": 10, "notoriete": 3, "standing": 6, "credibilite": -2,
                                "reputation": -2, "landscape": { "self": 0.6 } },
        "result": { "fr": "Trois lignes de dépêche deviennent une thèse sur le pays en une soirée. Votre camp trouve enfin les mots qu'il cherchait, et personne n'ira à la gare vérifier.",
                    "en": "Three lines of wire copy become a thesis about the country in one evening. Your side finally has the words it was looking for, and nobody will go to the station to check." } },
      "failure": { "effects": { "popularity": -10, "reputation": -3, "credibilite": -2, "strike": "radical" },
        "result": { "fr": "Les faits sortent le lendemain et ne ressemblent en rien à ce que vous en avez fait. Le démenti est plus repris que la publication, ce qui n'arrive jamais et vous arrive.",
                    "en": "The facts come out the next day and bear no resemblance to what you made of them. The correction travels further than the post, which never happens and has happened to you." } } },
    { "label": { "fr": "Appeler le procureur avant de dire quoi que ce soit", "en": "Call the prosecutor before saying anything" },
      "when": { "background": ["law", "civil"] },
      "effects": { "credibilite": 3, "reputation": 2, "reseau": 1, "standing": -3, "popularity": -1 },
      "result": { "fr": "Un coup de fil, quarante secondes, et vous savez ce que les autres publieront demain en se trompant. Vous ne pourrez rien en dire, et c'est déjà beaucoup.",
                  "en": "One call, forty seconds, and you know what the others will get wrong tomorrow. You will not be able to say any of it, and that is already a great deal." } }
  ]
},

{
  "id": "community_manager",
  "once": true,
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller", "maire"], "minTurn": 2 },
  "tag": { "fr": "Le stagiaire", "en": "The intern" },
  "text": {
    "fr": "Un bénévole de vingt-deux ans tient vos comptes depuis trois mois et il est bien meilleur que vous. Il vous propose un plan : trois publications par jour, un ton qui n'est pas le vôtre, et l'interdiction absolue de publier vous-même après vingt et une heures.",
    "en": "A twenty-two-year-old volunteer has run your accounts for three months and is far better at it than you. He proposes a plan: three posts a day, a tone that is not yours, and an absolute ban on posting yourself after nine in the evening."
  },
  "choices": [
    { "label": { "fr": "Lui laisser les clés, entièrement", "en": "Hand him the keys completely" },
      "effects": { "notoriete": 3, "popularity": 4, "credibilite": -1, "energie": 2 },
      "result": { "fr": "Votre audience triple en quatre mois. Vous ne reconnaissez plus tout à fait la personne qui parle sous votre nom, et elle a manifestement plus de succès que vous.",
                  "en": "Your following triples in four months. You no longer entirely recognise the person speaking under your name, and she is plainly more successful than you." } },
    { "label": { "fr": "Garder la main, et publier moins", "en": "Keep control, and post less" },
      "effects": { "reputation": 2, "credibilite": 1, "notoriete": -1, "energie": -1 },
      "result": { "fr": "Deux publications par semaine, écrites par vous, sans emoji et sans crochet d'accroche. C'est lent, c'est vous, et une petite communauté s'installe qui ne partira pas.",
                  "en": "Two posts a week, written by you, no emoji and no hook. It is slow, it is you, and a small following settles in that will not leave." } },
    { "label": { "fr": "Le salarier avant qu'un autre le fasse", "en": "Put him on the payroll before somebody else does" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -55000, "notoriete": 3, "popularity": 5, "reseau": 1 },
      "result": { "fr": "Trente-deux mille euros par an pour quelqu'un qui n'a jamais mis les pieds dans une salle de section. Dans quatre ans, deux députés vous le prendront et vous le laisserez partir.",
                  "en": "Thirty-two thousand euros a year for somebody who has never set foot in a branch meeting. In four years two MPs will poach him and you will let him go." } },
    { "label": { "fr": "Lui apprendre le métier plutôt que l'inverse", "en": "Teach him the trade instead of the reverse" },
      "when": { "personality": ["principled", "hardworking"] },
      "effects": { "reseau": 2, "reputation": 2, "notoriete": 1, "energie": -2 },
      "result": { "fr": "Vous l'emmenez en réunion publique et en porte-à-porte pendant six mois. Il tient toujours vos comptes, et il sait maintenant à quoi ressemblent les gens dont il parle.",
                  "en": "You take him to public meetings and canvassing for six months. He still runs your accounts, and he now knows what the people he writes about look like." } }
  ]
},

{
  "id": "boucle_whatsapp",
  "weight": 4,
  "when": { "minTurn": 5 },
  "tag": { "fr": "La capture", "en": "The screenshot" },
  "text": {
    "fr": "Une capture d'écran de la boucle privée du groupe circule chez les journalistes. On y lit ce que vous pensez vraiment de deux collègues, écrit à onze heures du soir, avec la ponctuation de quelqu'un qui ne se relit pas.",
    "en": "A screenshot from the group's private chat is circulating among reporters. It shows what you really think of two colleagues, written at eleven at night, with the punctuation of somebody who does not reread."
  },
  "choices": [
    { "label": { "fr": "Assumer mot pour mot", "en": "Own it word for word" },
      "effects": { "popularity": 6, "standing": -9, "reputation": 1, "credibilite": 1 },
      "result": { "fr": "Vous confirmez tout et vous n'ajoutez rien. Le pays trouve cela reposant, les deux collègues ne vous adresseront plus la parole, et l'un des deux vous sera utile dans six ans.",
                  "en": "You confirm all of it and add nothing. The country finds it restful, the two colleagues will never speak to you again, and one of them will be useful to you in six years." } },
    { "label": { "fr": "Parler de méthode et pas de contenu", "en": "Talk about methods, not content" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.35 }, "dice": 16 },
      "success": { "effects": { "standing": 4, "credibilite": 1, "popularity": -2 },
        "result": { "fr": "Vous passez douze minutes à parler de la violation d'une conversation privée sans jamais dire si elle était exacte. Personne n'est dupe et tout le monde s'en contente.",
                    "en": "You spend twelve minutes on the violation of a private conversation without ever saying whether it was accurate. Nobody is fooled and everybody settles for it." } },
      "failure": { "effects": { "popularity": -7, "standing": -6, "credibilite": -2 },
        "result": { "fr": "On vous demande quatre fois si c'est vrai et vous répondez quatre fois autre chose. La quatrième fois se suffit à elle-même.",
                    "en": "You are asked four times whether it is true and four times you answer something else. The fourth time speaks for itself." } } },
    { "label": { "fr": "Trouver qui a fait la capture", "en": "Find out who took the screenshot" },
      "when": { "stat": { "reseau": { "min": 9 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 6, "reputation": -1 },
        "result": { "fr": "Trois jours et vous avez le nom. Vous ne le direz jamais, et cette personne le saura à la façon dont vous la saluerez désormais.",
                    "en": "Three days and you have the name. You will never say it, and that person will know from the way you greet them from now on." } },
      "failure": { "effects": { "reseau": -2, "standing": -5, "strike": "traitre" },
        "result": { "fr": "Vous cherchez, cela se voit, et le groupe apprend que vous enquêtez sur lui. Une boucle privée ne pardonne pas qu'on la soupçonne.",
                    "en": "You look, it shows, and the group learns you are investigating it. A private chat does not forgive being suspected." } } },
    { "label": { "fr": "Quitter toutes les boucles, définitivement", "en": "Leave every group chat, for good" },
      "effects": { "reseau": -3, "sangfroid": 2, "reputation": 2, "standing": -2 },
      "result": { "fr": "Vous sortez de onze conversations le même soir. Vous perdez la moitié de ce que vous saviez avant les autres, et vous ne serez plus jamais capturé.",
                  "en": "You leave eleven conversations the same evening. You lose half of what you used to know before everybody else, and you will never be screenshotted again." } }
  ]
},

{
  "id": "fact_check",
  "weight": 4,
  "when": { "minTurn": 6, "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "Vérification", "en": "Fact check" },
  "text": {
    "fr": "Une cellule de vérification classe votre chiffre en « trompeur ». Le chiffre vient d'un rapport public, il est exact, et l'usage que vous en faites ne l'est pas tout à fait. L'article fait quatre mille signes et le titre en fait sept.",
    "en": "A fact-checking desk rates your figure “misleading”. The figure comes from a public report, it is accurate, and the use you make of it is not quite. The article runs four thousand characters and the headline seven words."
  },
  "choices": [
    { "label": { "fr": "Corriger publiquement et passer à autre chose", "en": "Correct it publicly and move on" },
      "effects": { "credibilite": 2, "reputation": 2, "popularity": -2, "standing": -2 },
      "result": { "fr": "Une phrase de rectification que trois cents personnes liront. Vous ne referez pas cette erreur, ce qui vous distingue de la plupart de vos collègues.",
                  "en": "One sentence of correction that three hundred people will read. You will not make that mistake again, which sets you apart from most of your colleagues." } },
    { "label": { "fr": "Attaquer la cellule de vérification", "en": "Attack the fact-checkers" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "notoriete": 2, "credibilite": -2, "standing": 3 },
        "result": { "fr": "Vous demandez qui vérifie les vérificateurs et le public trouve la question excellente. Elle l'est, et elle ne répond toujours pas à celle qu'on vous posait.",
                    "en": "You ask who fact-checks the fact-checkers and the public finds it an excellent question. It is, and it still does not answer the one you were asked." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -3, "reputation": -2 },
        "result": { "fr": "La cellule republie l'article avec vos réponses en annexe. C'est la seule façon de perdre deux fois le même débat.",
                    "en": "The desk republishes the piece with your replies in an appendix. It is the only way to lose the same argument twice." } } },
    { "label": { "fr": "Republier le chiffre en le sourçant ligne à ligne", "en": "Repost the figure, sourced line by line" },
      "when": { "background": ["academia", "journalism", "civil"] },
      "effects": { "credibilite": 3, "reputation": 1, "notoriete": 1, "popularity": 1, "energie": -1 },
      "result": { "fr": "Page, tableau, note de bas de page. La cellule ajoute une mise à jour et vous êtes le premier de l'année à obtenir ça.",
                  "en": "Page, table, footnote. The desk adds an update and you are the first this year to get one." } }
  ]
},

{
  "id": "meute",
  "weight": 4,
  "when": { "minTurn": 4, "stat": { "notoriete": { "min": 3 } } },
  "tag": { "fr": "La meute", "en": "The pile-on" },
  "text": {
    "fr": "Trois mots d'une intervention de quarante minutes tournent seuls depuis ce matin. Onze mille messages, dont neuf mille de gens qui n'ont pas vu les quarante minutes, et le sujet a désormais un nom, une couleur et un camp.",
    "en": "Three words from a forty-minute appearance have been circulating on their own since this morning. Eleven thousand messages, nine thousand of them from people who did not watch the forty minutes, and the story now has a name, a colour and a side."
  },
  "choices": [
    { "label": { "fr": "Publier la vidéo entière et se taire", "en": "Post the full video and say nothing" },
      "effects": { "credibilite": 2, "reputation": 1, "popularity": -1, "energie": 1 },
      "result": { "fr": "Quarante minutes en ligne que quatre cents personnes regarderont. La meute passe à autre chose dans la nuit, comme toujours, et vous n'avez rien retiré.",
                  "en": "Forty minutes online that four hundred people will watch. The pile-on moves on overnight, as it always does, and you retracted nothing." } },
    { "label": { "fr": "S'excuser pour couper court", "en": "Apologise to end it" },
      "effects": { "popularity": -4, "standing": -5, "reputation": -1, "energie": 2 },
      "result": { "fr": "Vous vous excusez de trois mots que vous pensiez, et la meute comprend qu'elle avait raison. Ce sera plus rapide la prochaine fois.",
                  "en": "You apologise for three words you meant, and the pile-on concludes it was right. It will be quicker next time." } },
    { "label": { "fr": "En remettre une couche et assumer le camp", "en": "Double down and pick the side" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "notoriete": 4, "standing": -4, "reputation": -1,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "Vous répétez les trois mots, plus lentement, en regardant la caméra. Vous venez de choisir vos ennemis pour dix ans, et ils vous serviront de public.",
                    "en": "You repeat the three words, more slowly, looking at the camera. You have just chosen your enemies for ten years, and they will serve as your audience." } },
      "failure": { "effects": { "popularity": -11, "standing": -7, "reputation": -2, "strike": "radical" },
        "result": { "fr": "Le deuxième message est pire que le premier et c'est celui-là qui restera. On ne double pas la mise à onze heures du soir.",
                    "en": "The second message is worse than the first and that is the one that will last. You do not double down at eleven at night." } } },
    { "label": { "fr": "Ne rien faire du tout et partir en week-end", "en": "Do nothing at all and go away for the weekend" },
      "when": { "trait": ["teflon"] },
      "effects": { "energie": 3, "popularity": 2, "sangfroid": 1, "notoriete": 1 },
      "result": { "fr": "Vous coupez le téléphone jusqu'à lundi. À votre retour, la meute est passée à quelqu'un d'autre et deux journalistes écrivent que vous avez bien géré.",
                  "en": "You switch the phone off until Monday. By the time you are back the pile-on has moved to somebody else and two reporters write that you handled it well." } },
    { "label": { "fr": "Appeler l'un des onze mille et l'écouter", "en": "Call one of the eleven thousand and listen" },
      "when": { "personality": ["charming", "principled"] },
      "effects": { "popularity": 5, "reputation": 3, "notoriete": 2, "energie": -1 },
      "result": { "fr": "Vingt minutes au téléphone avec quelqu'un qui ne s'y attendait pas et qui le raconte. C'est la seule chose qui marche et c'est la seule qui ne passe pas à l'échelle.",
                  "en": "Twenty minutes on the phone with somebody who was not expecting it and who tells the story. It is the only thing that works and the only thing that does not scale." } }
  ]
},

{
  "id": "ia_contenu",
  "weight": 3,
  "when": { "minTurn": 6 },
  "tag": { "fr": "La machine", "en": "The machine" },
  "text": {
    "fr": "Votre équipe vous montre ce qu'elle a produit en une soirée : douze visuels, quatre discours de circonstance et une lettre de condoléances, tous écrits par une machine et tous parfaitement corrects. Personne ne saura jamais faire la différence.",
    "en": "Your team shows you what it produced in one evening: twelve graphics, four occasional speeches and a letter of condolence, all written by a machine and all perfectly correct. Nobody will ever be able to tell the difference."
  },
  "choices": [
    { "label": { "fr": "Tout utiliser, et gagner le temps", "en": "Use all of it, and save the time" },
      "effects": { "energie": 3, "notoriete": 1, "credibilite": -2, "reputation": -1 },
      "result": { "fr": "Vous récupérez neuf heures par semaine. Six mois plus tard, une lettre de condoléances part avec le nom du défunt mal orthographié, et la famille le fait savoir.",
                  "en": "You get nine hours a week back. Six months later a letter of condolence goes out with the deceased's name misspelled, and the family says so publicly." } },
    { "label": { "fr": "Les visuels oui, les mots non", "en": "The graphics yes, the words no" },
      "effects": { "energie": 1, "credibilite": 1, "notoriete": 1 },
      "result": { "fr": "La ligne est arbitraire et vous la tenez. Ce que vous signez, vous l'avez écrit, et cela finira par se voir dans un débat où l'on vous citera vos propres phrases.",
                  "en": "The line is arbitrary and you hold it. What you sign, you wrote, and it will show one day in a debate where your own sentences are quoted back at you." } },
    { "label": { "fr": "Refuser en bloc et le dire publiquement", "en": "Refuse it all and say so publicly" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "reputation": 3, "popularity": 4, "energie": -2 },
        "result": { "fr": "Vous en faites une position politique et elle tient, parce qu'elle est vérifiable : on peut vous demander vos brouillons. Trois collègues vous imitent et deux abandonnent.",
                    "en": "You turn it into a political position and it holds, because it is checkable: anyone can ask for your drafts. Three colleagues copy you and two give up." } },
      "failure": { "effects": { "credibilite": -1, "popularity": -3, "energie": -3 },
        "result": { "fr": "On retrouve un communiqué de votre équipe, généré, publié le mois dernier sous votre nom. La position était bonne et vous ne pouviez pas la tenir.",
                    "en": "A statement from your own team turns up, generated, published last month under your name. The position was right and you were not able to hold it." } } },
    { "label": { "fr": "L'utiliser pour analyser, jamais pour écrire", "en": "Use it to analyse, never to write" },
      "when": { "stat": { "credibilite": { "min": 11 } } },
      "effects": { "credibilite": 2, "reseau": 1, "energie": 2, "notoriete": 1 },
      "result": { "fr": "Quarante mille amendements dépouillés en une nuit, trois incohérences trouvées dans un texte que personne n'avait lu en entier. Vous êtes le seul en séance à savoir de quoi vous parlez.",
                  "en": "Forty thousand amendments processed overnight, three inconsistencies found in a bill nobody had read in full. You are the only person in the chamber who knows what is in it." } }
  ]
},

{
  "id": "podcast_long",
  "once": true,
  "weight": 3,
  "when": { "minTurn": 8, "stat": { "notoriete": { "min": 5 } } },
  "tag": { "fr": "Trois heures", "en": "Three hours" },
  "text": {
    "fr": "Un podcast vous propose trois heures d'entretien, sans montage, avec quelqu'un qui ne fait pas de politique et qui posera les questions que les journalistes politiques ne posent plus. Son audience est plus jeune que tous vos meetings réunis.",
    "en": "A podcast offers you three hours of interview, unedited, with somebody who does not do politics and who will ask the questions political reporters have stopped asking. Their audience is younger than all your rallies combined."
  },
  "choices": [
    { "label": { "fr": "Y aller sans notes et sans conseiller", "en": "Go with no notes and no adviser" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "notoriete": 4, "credibilite": 1, "energie": -2 },
        "result": { "fr": "Trois heures où l'on vous voit réfléchir, hésiter et rire. Neuf cent mille écoutes, et une génération qui découvre que vous êtes quelqu'un.",
                    "en": "Three hours in which you are seen thinking, hesitating and laughing. Nine hundred thousand listens, and a generation discovering you are a person." } },
      "failure": { "effects": { "popularity": -8, "credibilite": -2, "notoriete": 2, "energie": -2 },
        "result": { "fr": "Trois heures, c'est très long. Vers la cent-dixième minute, vous dites quelque chose que vous n'auriez jamais dit ailleurs, et l'extrait vit sa vie.",
                    "en": "Three hours is very long. Around minute one hundred and ten you say something you would never have said anywhere else, and the clip takes on a life of its own." } } },
    { "label": { "fr": "Y aller préparé, avec les éléments de langage", "en": "Go prepared, with the talking points" },
      "effects": { "notoriete": 2, "popularity": -2, "credibilite": -1, "standing": 2 },
      "result": { "fr": "L'animateur comprend au bout de quarante minutes qu'il n'aura rien, et il le dit à l'antenne. Les commentaires sont plus durs que l'entretien.",
                  "en": "The host works out after forty minutes that he will get nothing, and says so on air. The comments are harsher than the interview." } },
    { "label": { "fr": "Refuser : ce n'est pas un lieu politique", "en": "Refuse: it is not a political venue" },
      "effects": { "standing": 3, "credibilite": 1, "notoriete": -2, "popularity": -3 },
      "result": { "fr": "Vous déclinez poliment. Deux ans plus tard, le même podcast reçoit celui qui vous battra à la primaire, et vous vous souviendrez de ce refus.",
                  "en": "You politely decline. Two years later the same podcast hosts the person who will beat you in the primary, and you will remember saying no." } },
    { "label": { "fr": "Y aller et parler de tout sauf de politique", "en": "Go, and talk about anything but politics" },
      "when": { "trait": ["orateur"] },
      "effects": { "popularity": 13, "notoriete": 5, "credibilite": -1, "standing": -4, "energie": -2 },
      "result": { "fr": "Votre enfance, deux deuils, un livre et une passion que personne ne vous connaissait. Il n'est pas question de politique une seule fois et c'est la meilleure chose que vous ayez faite pour la vôtre.",
                  "en": "Your childhood, two bereavements, a book and an enthusiasm nobody knew you had. Politics does not come up once and it is the best thing you have ever done for yours." } }
  ]
},

{
  "id": "euro_rapporteur",
  "once": true,
  "weight": 6,
  "when": { "position": ["euro"], "minTurn": 6, "notTrait": ["connexions_internationales"] },
  "tag": { "fr": "Le rapport", "en": "The report" },
  "text": {
    "fr": "On vous propose d'être rapporteur sur un texte technique dont personne ne parlera jamais chez vous. Cela veut dire dix-huit mois de négociation avec vingt-six délégations, et un nom qui circulera dans des ministères que vous ne connaissez pas.",
    "en": "You are offered the rapporteurship on a technical file nobody at home will ever mention. That means eighteen months of negotiation with twenty-six delegations, and a name circulating in ministries you have never heard of."
  },
  "choices": [
    { "label": { "fr": "Prendre le rapport et le faire sérieusement", "en": "Take the report and do it properly" },
      "effects": { "trait": "connexions_internationales", "credibilite": 2, "energie": -3, "popularity": -2 },
      "result": { "fr": "Dix-huit mois, quatre cents amendements et un compromis qui tient. Personne dans votre circonscription n'en entendra parler, et trois gouvernements sauront désormais qui vous êtes.",
                  "en": "Eighteen months, four hundred amendments and a compromise that holds. Nobody in your constituency will hear about it, and three governments will now know who you are." } },
    { "label": { "fr": "Refuser et rester visible à la maison", "en": "Turn it down and stay visible at home" },
      "effects": { "popularity": 4, "energie": 2, "credibilite": -1 },
      "result": { "fr": "Vous passez ces dix-huit mois dans vos marchés plutôt que dans des salles de réunion. C'est le calcul que font presque tous vos collègues, et il n'est pas idiot.",
                  "en": "You spend those eighteen months in your own markets rather than in meeting rooms. It is the calculation almost all your colleagues make, and it is not a stupid one." } },
    { "label": { "fr": "Le prendre, et le négocier en anglais dans les couloirs", "en": "Take it, and negotiate it in English in the corridors" },
      "when": { "trait": ["anglais_parfait"] },
      "effects": { "trait": "connexions_internationales", "credibilite": 3, "reseau": 3, "notoriete": 1, "energie": -3 },
      "result": { "fr": "Les compromis ne se font pas en séance, ils se font debout entre deux portes, et vous êtes l'un des rares à pouvoir y être. Le texte sort avec deux de vos idées dedans.",
                  "en": "Compromises are not made in session, they are made standing between two doors, and you are one of the few who can be there. The text comes out with two of your ideas in it." } },
    { "label": { "fr": "Le prendre et le déléguer à vos assistants", "en": "Take it and hand it to your assistants" },
      "when": { "stat": { "reseau": { "min": 10 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "trait": "connexions_internationales", "energie": 1, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "Deux assistants brillants font le travail et vous signez. C'est ainsi que fonctionne la moitié du Parlement, et les délégations retiennent quand même votre nom.",
                    "en": "Two brilliant assistants do the work and you sign it. This is how half the Parliament functions, and the delegations remember your name anyway." } },
      "failure": { "effects": { "credibilite": -3, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Une audition où l'on vous interroge sur votre propre rapport, et huit secondes de silence. La vidéo sort du Parlement européen, ce qui n'arrive jamais.",
                    "en": "A hearing where you are questioned on your own report, and eight seconds of silence. The video escapes the European Parliament, which never happens." } } }
  ]
},

{
  "id": "ministre_conseil",
  "once": true,
  "weight": 7,
  "when": { "position": ["ministre", "premier"], "minTurn": 10, "notTrait": ["connexions_internationales"] },
  "tag": { "fr": "Le Conseil", "en": "The Council" },
  "text": {
    "fr": "Conseil des ministres européens, deux heures du matin, dix-neuvième heure de négociation. Il reste trois pays à convaincre et deux d'entre eux attendent de voir qui cédera le premier. Votre administration vous a préparé une position et vous êtes seul dans la salle.",
    "en": "European Council of ministers, two in the morning, nineteenth hour of negotiation. Three countries remain to be won over and two of them are waiting to see who blinks first. Your civil servants prepared a position and you are alone in the room."
  },
  "choices": [
    { "label": { "fr": "Tenir la position française jusqu'au bout", "en": "Hold the French position to the end" },
      "effects": { "credibilite": 2, "standing": 5, "energie": -3, "popularity": 3 },
      "result": { "fr": "Vous ne cédez rien et le Conseil se sépare sans accord à six heures. Chez vous on appelle cela de la fermeté, et vous ne serez invité à aucun dîner pendant deux ans.",
                  "en": "You concede nothing and the Council breaks up without agreement at six. At home they call it firmness, and you will not be invited to dinner for two years." } },
    { "label": { "fr": "Construire un compromis avec les deux qui hésitent", "en": "Build a compromise with the two who are hesitating" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.4 },
                "bonus": [ { "when": { "trait": ["anglais_parfait"] }, "value": 4 },
                           { "when": { "trait": ["anglais_mediocre"] }, "value": -4 } ], "dice": 16 },
      "success": { "effects": { "trait": "connexions_internationales", "credibilite": 3, "reseau": 2, "energie": -3 },
        "result": { "fr": "Quarante minutes dans un couloir avec deux homologues et un texte réécrit à la main. L'accord passe à sept heures et trois capitales savent désormais qu'on peut travailler avec vous.",
                    "en": "Forty minutes in a corridor with two counterparts and a text rewritten by hand. The deal passes at seven and three capitals now know you can be worked with." } },
      "failure": { "effects": { "credibilite": -2, "standing": -6, "popularity": -4, "energie": -3 },
        "result": { "fr": "Le compromis que vous rapportez ne satisfait personne, et surtout pas votre propre majorité. On vous expliquera pendant six mois que vous avez cédé.",
                    "en": "The compromise you bring home satisfies nobody, least of all your own majority. You will be told for six months that you caved." } } },
    { "label": { "fr": "Appeler l'Élysée et attendre l'arbitrage", "en": "Call the presidency and wait for a decision" },
      "effects": { "standing": 4, "credibilite": -2, "energie": 1, "reputation": -1 },
      "result": { "fr": "Vous réveillez un conseiller à trois heures du matin et vous appliquez ce qu'on vous dit. C'est ce qu'on attend d'un ministre, et c'est ce qui fait qu'on n'en devient jamais autre chose.",
                  "en": "You wake an adviser at three in the morning and do as you are told. It is what is expected of a minister, and it is what stops one ever becoming anything else." } },
    { "label": { "fr": "Faire jouer ce que vous avez négocié dans le privé", "en": "Use what you negotiated in the private sector" },
      "when": { "background": ["business", "civil"] },
      "effects": { "trait": "connexions_internationales", "credibilite": 2, "reseau": 3, "standing": -3, "energie": -2 },
      "result": { "fr": "Vous reconnaissez la méthode parce que vous l'avez pratiquée ailleurs, avec des enjeux plus petits et les mêmes gens. L'accord se fait, et votre administration ne vous le pardonne pas tout à fait.",
                  "en": "You recognise the method because you have used it elsewhere, with smaller stakes and the same people. The deal is done, and your own officials never quite forgive you." } }
  ]
},

{
  "id": "argent_campagne_perso",
  "weight": 4,
  "when": { "position": ["conseiller", "maire", "depute", "euro", "chef"], "minTurn": 10, "minMoney": 120000 },
  "tag": { "fr": "Sur vos deniers", "en": "Out of your own pocket" },
  "text": {
    "fr": "Le parti finance la campagne au minimum légal et vous savez ce que cela vaut : deux permanences, une affiche et personne pour tenir le terrain. Votre directeur de campagne vous a préparé trois budgets et attend que vous en désigniez un.",
    "en": "The party is funding the campaign at the legal minimum and you know what that buys: two offices, one poster and nobody to work the ground. Your campaign manager has drawn up three budgets and is waiting for you to point at one."
  },
  "choices": [
    { "label": { "fr": "Le budget du parti, et rien de plus", "en": "The party budget, and nothing more" },
      "effects": { "standing": 2, "energie": 1 },
      "result": { "fr": "Vous faites la campagne qu'on vous donne. Elle ressemble à celle de tous les autres, ce qui est exactement le problème et exactement ce qu'on attendait de vous.",
                  "en": "You run the campaign you are given. It looks like everybody else's, which is exactly the problem and exactly what was expected of you." } },
    { "label": { "fr": "Ajouter cent cinquante mille de votre poche", "en": "Add a hundred and fifty thousand of your own" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -150000, "popularity": 5, "notoriete": 1, "score": 3 },
      "result": { "fr": "Deux permanences de plus, un attaché de presse et quarante mille tracts. La différence se voit et ne se raconte pas : on ne fait pas campagne sur son propre relevé bancaire.",
                  "en": "Two more offices, a press officer and forty thousand leaflets. The difference shows and cannot be talked about: nobody campaigns on their own bank statement." } },
    { "label": { "fr": "Y mettre cinq cent mille et saturer le terrain", "en": "Put in five hundred thousand and saturate the ground" },
      "when": { "minMoney": 500000 },
      "effects": { "money": -500000, "popularity": 11, "notoriete": 3, "score": 7,
                   "landscape": { "self": 0.5 } },
      "result": { "fr": "Onze salariés, un local par canton, du porte-à-porte payé et une campagne numérique qui ne ressemble à rien de ce qu'on voit ailleurs. Vos adversaires comprennent en trois semaines et n'ont plus le temps.",
                  "en": "Eleven staff, an office per district, paid canvassing and a digital campaign like nothing else around. Your opponents work it out in three weeks and by then it is too late." } },
    { "label": { "fr": "Engager un million et demi, et que cela se sache", "en": "Commit a million and a half, and let it be known" },
      "when": { "minMoney": 1500000 },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "money": -1500000, "popularity": 18, "notoriete": 5, "score": 14,
                                "landscape": { "self": 1.4 } },
        "result": { "fr": "Une campagne qu'aucun parti n'aurait pu payer, assumée en conférence de presse : votre argent, vos idées, aucun donateur à remercier. Le pays trouve cela presque rafraîchissant.",
                    "en": "A campaign no party could have afforded, owned in a press conference: your money, your ideas, no donors to thank. The country finds it almost refreshing." } },
      "failure": { "effects": { "money": -1500000, "popularity": -9, "score": 5, "reputation": -3,
                                "credibilite": -2 },
        "result": { "fr": "La somme sort dans la presse avant votre communiqué. On ne parle plus que d'un candidat qui achète son élection, et l'on en parlera encore dans vingt ans.",
                    "en": "The figure appears in the press before your statement. Nobody talks about anything but a candidate buying an election, and they will still be talking about it in twenty years." } } },
    { "label": { "fr": "Faire financer par des amis qui comprendront", "en": "Have it funded by friends who will understand" },
      "when": { "background": ["business"], "notTrait": ["intouchable"] },
      "effects": { "score": 6, "standing": 3, "flags": { "dirtyMoney": true }, "strike": "casserole" },
      "result": { "fr": "Quatre virements de personnes morales différentes, tous en dessous du plafond, tous du même immeuble. C'est légal si personne ne regarde les adresses.",
                  "en": "Four transfers from four different companies, all under the cap, all from the same building. It is legal as long as nobody checks the addresses." } }
  ]
},

{
  "id": "argent_fondation",
  "once": true,
  "weight": 3,
  "when": { "position": ["depute", "euro", "maire", "ministre", "chef"], "minTurn": 16, "minMoney": 300000 },
  "tag": { "fr": "La fondation", "en": "The foundation" },
  "text": {
    "fr": "Pour exister entre deux campagnes, il faut un lieu qui produise des idées à votre nom. Un club, un institut, une fondation : trois mots pour la même chose, et trois budgets très différents.",
    "en": "To exist between campaigns, you need somewhere that produces ideas under your name. A club, an institute, a foundation: three words for the same thing, and three very different budgets."
  },
  "choices": [
    { "label": { "fr": "Un club de réflexion, deux dîners par an", "en": "A discussion club, two dinners a year" },
      "effects": { "money": -60000, "reseau": 2, "credibilite": 1 },
      "result": { "fr": "Quarante personnes deux fois par an dans une salle louée. Cela ne produit rien et cela entretient un carnet d'adresses, ce qui est déjà le principal.",
                  "en": "Forty people twice a year in a hired room. It produces nothing and it maintains an address book, which is already the main thing." } },
    { "label": { "fr": "Un institut avec trois permanents", "en": "An institute with three full-time staff" },
      "when": { "minMoney": 600000 },
      "effects": { "money": -600000, "credibilite": 4, "reseau": 3, "notoriete": 2, "standing": 4 },
      "result": { "fr": "Trois chercheurs, une note tous les deux mois, et votre nom en couverture de travaux que vous n'avez pas écrits mais que vous savez défendre. C'est ainsi qu'on devient quelqu'un de sérieux.",
                  "en": "Three researchers, a paper every two months, and your name on the cover of work you did not write but can defend. This is how one becomes a serious person." } },
    { "label": { "fr": "Une fondation reconnue, avec un vrai budget", "en": "A recognised foundation, properly funded" },
      "when": { "minMoney": 2000000 },
      "effects": { "money": -2000000, "credibilite": 6, "reseau": 5, "notoriete": 4, "standing": 8,
                   "landscape": { "self": 0.8 } },
      "result": { "fr": "Douze salariés, un colloque annuel où tout le monde vient, et une adresse que l'on cite. Dans dix ans, la moitié des cadres de votre camp y sera passée, et ils le sauront.",
                  "en": "Twelve staff, an annual conference everybody attends, and an address people cite. In ten years half the senior figures of your camp will have passed through it, and they will know it." } },
    { "label": { "fr": "Faire porter le budget par des entreprises", "en": "Have companies carry the budget" },
      "when": { "stat": { "reseau": { "min": 11 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "reseau": 4, "standing": 5, "flags": { "dirtyMoney": true } },
        "result": { "fr": "Neuf mécènes, aucun de plus de quinze pour cent du budget, et une fondation qui ne vous coûte rien. Chacun d'eux vous appellera une fois, et une seule, et vous décrocherez.",
                    "en": "Nine donors, none above fifteen per cent of the budget, and a foundation that costs you nothing. Each of them will call you once, exactly once, and you will pick up." } },
      "failure": { "effects": { "reputation": -3, "credibilite": -2, "standing": -5, "strike": "casserole" },
        "result": { "fr": "Deux mécènes se retirent, un troisième parle à un journaliste. La fondation existe six mois et laisse un article qui ressortira à chaque échéance.",
                    "en": "Two donors pull out, a third talks to a reporter. The foundation lasts six months and leaves an article that will resurface at every election." } } },
    { "label": { "fr": "Écrire vous-même, sans structure", "en": "Write it yourself, with no structure" },
      "when": { "background": ["academia", "journalism"] },
      "effects": { "credibilite": 3, "eloquence": 1, "energie": -2, "reseau": -1 },
      "result": { "fr": "Deux cents pages écrites la nuit, sans nègre et sans budget. C'est plus lent, cela ne se délègue pas, et personne ne pourra jamais dire que ce n'est pas de vous.",
                  "en": "Two hundred pages written at night, no ghostwriter and no budget. It is slower, it cannot be delegated, and nobody will ever be able to say it is not yours." } }
  ]
},

{
  "id": "argent_pari",
  "weight": 3,
  "when": { "minMoney": 400000, "minTurn": 12, "notTrait": ["intouchable"] },
  "tag": { "fr": "L'occasion", "en": "The opportunity" },
  "text": {
    "fr": "Un ami d'avant la politique monte une opération et vous propose d'entrer. Ce n'est pas illégal, c'est seulement le genre de chose qu'on ne peut pas expliquer en trente secondes sur un plateau. Il faut répondre avant vendredi.",
    "en": "A friend from before politics is putting together a deal and offers you a place in it. It is not illegal, it is simply the kind of thing you cannot explain in thirty seconds on television. He needs an answer by Friday."
  },
  "choices": [
    { "label": { "fr": "Ne pas y toucher", "en": "Stay out of it" },
      "effects": { "reputation": 1, "sangfroid": 1 },
      "result": { "fr": "Vous dites non en deux phrases et vous n'y repensez plus. Dans quatre ans, il aura doublé sa mise ou il sera en examen, et dans les deux cas vous aurez eu raison.",
                  "en": "You say no in two sentences and never think about it again. In four years he will have doubled his money or be under investigation, and either way you will have been right." } },
    { "label": { "fr": "Engager quatre cent mille", "en": "Put in four hundred thousand" },
      "roll": { "chance": 0.58, "chanceBonus": [ { "when": { "background": ["business"] }, "value": 0.15 },
                                                 { "when": { "stat": { "reseau": { "min": 12 } } }, "value": 0.08 } ] },
      "success": { "effects": { "money": 700000, "reseau": 1 },
        "result": { "fr": "L'opération sort au bon moment et vous rend le double. Personne ne le saura, parce que vous l'avez déclaré exactement comme il fallait.",
                    "en": "The deal lands at the right moment and returns double. Nobody will know, because you declared it exactly as you were supposed to." } },
      "failure": { "effects": { "money": -400000, "sangfroid": -1 },
        "result": { "fr": "Le montage s'effondre en dix-huit mois et vous ne récupérez rien. C'était de l'argent que vous aviez, ce qui est la seule bonne nouvelle de l'affaire.",
                    "en": "The structure collapses in eighteen months and you get nothing back. It was money you had, which is the only good news in the whole business." } } },
    { "label": { "fr": "Y mettre un million et demi", "en": "Put in a million and a half" },
      "when": { "minMoney": 1500000 },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "background": ["business"] }, "value": 0.15 },
                                                { "when": { "trait": ["clairvoyant"] }, "value": 0.12 } ] },
      "success": { "effects": { "money": 3000000, "reseau": 2, "sangfroid": 1 },
        "result": { "fr": "Trois millions au bout de deux ans. Vous ne serez plus jamais dépendant du calendrier électoral pour vivre, et c'est la seule chose que l'argent achète vraiment en politique.",
                    "en": "Three million after two years. You will never again depend on the electoral calendar to live, and that is the only thing money really buys in politics." } },
      "failure": { "effects": { "money": -1500000, "sangfroid": -2, "reputation": -1, "chain": "fisc" },
        "result": { "fr": "Tout part, et le liquidateur écrit à l'administration fiscale qui écrit à tous les associés. Vous allez passer deux ans à expliquer une opération à laquelle vous n'avez rien compris.",
                    "en": "It all goes, and the liquidator writes to the tax office which writes to every partner. You are going to spend two years explaining a deal you never understood." } } },
    { "label": { "fr": "Entrer, mais au nom de quelqu'un d'autre", "en": "Go in, but under somebody else's name" },
      "when": { "personality": ["calculating"], "notTrait": ["casserole"] },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "money": 600000, "reputation": -1 },
        "result": { "fr": "Une société de votre beau-frère, une convention de portage, et six cent mille euros qui n'apparaissent nulle part à votre nom. Cela tiendra tant qu'il vivra.",
                    "en": "Your brother-in-law's company, a nominee agreement, and six hundred thousand euros that appear nowhere under your name. It will hold as long as he lives." } },
      "failure": { "effects": { "money": -400000, "reputation": -3, "flags": { "investigated": true }, "strike": "casserole" },
        "result": { "fr": "Le portage se voit dès la première déclaration. Ce n'est pas l'argent qui pose problème, c'est d'avoir voulu qu'il ne se voie pas.",
                    "en": "The nominee structure shows up in the very first filing. It is not the money that is the problem, it is having wanted it not to show." } } }
  ]
},

{
  "id": "argent_defense",
  "weight": 5,
  "when": { "flag": { "investigated": true }, "minMoney": 200000 },
  "tag": { "fr": "Les honoraires", "en": "The fees" },
  "text": {
    "fr": "Le cabinet qui vous défend vous remet trois propositions d'honoraires. Elles ne diffèrent pas par la compétence, elles diffèrent par le nombre de gens qui travailleront sur votre dossier et par le temps qu'ils y passeront.",
    "en": "The firm defending you hands over three fee proposals. They do not differ in competence, they differ in how many people will work on your file and how long they will spend on it."
  },
  "choices": [
    { "label": { "fr": "Le forfait, deux cent mille", "en": "The standard package, two hundred thousand" },
      "effects": { "money": -200000, "sangfroid": 1 },
      "result": { "fr": "Un associé, un collaborateur, et les délais légaux. C'est une défense correcte, c'est-à-dire celle que reçoit tout le monde.",
                  "en": "One partner, one associate, and the statutory deadlines. It is a proper defence, which is to say the one everybody gets." } },
    { "label": { "fr": "Huit cent mille, et l'équipe complète", "en": "Eight hundred thousand, and the full team" },
      "when": { "minMoney": 800000 },
      "effects": { "money": -800000, "flags": { "investigated": false }, "reputation": 1, "sangfroid": 2 },
      "result": { "fr": "Six avocats, deux mois de travail sur la seule procédure, et un vice de forme trouvé à la page quatre cents. Le dossier est classé et vous savez très exactement ce que cela a coûté.",
                  "en": "Six lawyers, two months of work on procedure alone, and a technical flaw found on page four hundred. The case is dropped and you know exactly what that cost." } },
    { "label": { "fr": "Ne rien payer et se défendre seul", "en": "Pay nothing and defend yourself" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "credibilite": 0.4 },
                "bonus": [ { "when": { "background": ["law"] }, "value": 6 } ], "dice": 16 },
      "success": { "effects": { "flags": { "investigated": false }, "popularity": 7, "credibilite": 2, "reputation": 2 },
        "result": { "fr": "Vous plaidez vous-même, sans robe, pendant quarante minutes. C'est irrégulier, c'est risqué, et la salle vous écoute jusqu'au bout.",
                    "en": "You argue it yourself, without a gown, for forty minutes. It is irregular, it is risky, and the room listens to the end." } },
      "failure": { "effects": { "popularity": -8, "reputation": -2, "flags": { "onTrial": true } },
        "result": { "fr": "On ne s'improvise pas pénaliste, et le président du tribunal vous le fait comprendre en huit minutes. Le dossier part au fond.",
                    "en": "Nobody improvises criminal defence, and the presiding judge makes that clear in eight minutes. The case goes to full trial." } } },
    { "label": { "fr": "Appeler le cabinet qui vous doit tout", "en": "Call the firm that owes you everything" },
      "when": { "background": ["law"], "stat": { "reseau": { "min": 10 } } },
      "effects": { "money": -80000, "flags": { "investigated": false }, "reseau": -2, "reputation": -1 },
      "result": { "fr": "Votre ancien cabinet prend le dossier au tarif de complaisance. Vous économisez sept cent mille euros et vous perdez le dernier endroit où l'on vous devait quelque chose.",
                  "en": "Your old firm takes the file at a courtesy rate. You save seven hundred thousand euros and lose the last place where anybody owed you anything." } }
  ]
},

{
  "id": "has_been_plateau",
  "once": true,
  "weight": 4,
  "when": { "belowPeak": true, "minAge": 56, "minTurn": 24 },
  "tag": { "fr": "L'invitation", "en": "The invitation" },
  "text": {
    "fr": "Une chaîne d'info vous propose une chronique hebdomadaire : commenter l'actualité politique, sur le plateau, chaque mardi. On vous présentera par la plus haute fonction que vous ayez occupée.",
    "en": "A news channel offers you a weekly slot: commenting on politics, in the studio, every Tuesday. You will be introduced by the highest office you ever held."
  },
  "choices": [
    { "label": { "fr": "Accepter : c'est encore de la politique", "en": "Accept: it is still politics" },
      "effects": { "trait": "has_been", "money": 60000, "notoriete": 2, "energie": 1 },
      "result": { "fr": "Trois mille euros par mardi pour dire ce que vous auriez fait. Au bout de six mois, on ne vous demande plus jamais ce que vous ferez.",
                  "en": "Three thousand euros a Tuesday to say what you would have done. After six months, nobody ever asks what you will do again." } },
    { "label": { "fr": "Refuser et repartir sur le terrain", "en": "Turn it down and go back to the ground" },
      "effects": { "standing": 5, "energie": -3, "popularity": 2, "credibilite": 1 },
      "result": { "fr": "Vous reprenez les réunions de section à quarante personnes, à cinquante-huit ans, sans caméra. C'est la décision la plus dure et la seule qui laisse une suite.",
                  "en": "You go back to branch meetings of forty people, at fifty-eight, with no cameras. It is the hardest decision and the only one that leaves a future." } },
    { "label": { "fr": "Négocier une chronique sur vos dossiers, pas sur les autres", "en": "Negotiate a slot on your own subjects, not on other people" },
      "when": { "stat": { "credibilite": { "min": 12 } } },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "credibilite": 2, "notoriete": 2, "money": 40000, "popularity": 3 },
        "result": { "fr": "Vous obtenez de ne parler que de ce que vous connaissez. C'est plus austère, c'est moins payé, et personne ne dit de vous que vous commentez.",
                    "en": "You get to speak only about what you know. It is drier, it pays less, and nobody says you are a pundit." } },
      "failure": { "effects": { "trait": "has_been", "money": 55000, "notoriete": 1, "credibilite": -1 },
        "result": { "fr": "La chaîne accepte, puis l'antenne fait ce qu'elle veut. Au troisième mardi, on vous interroge sur le divorce d'un ministre.",
                    "en": "The channel agrees, then the studio does as it likes. By the third Tuesday you are being asked about a minister's divorce." } } },
    { "label": { "fr": "Écrire vos mémoires à la place", "en": "Write your memoirs instead" },
      "when": { "background": ["journalism", "academia"] },
      "effects": { "money": 90000, "reputation": 2, "credibilite": 1, "energie": -2, "popularity": -2 },
      "result": { "fr": "Quatre cents pages, onze mille exemplaires et deux comptes réglés. Le livre durera plus longtemps que la chronique et rapportera moins d'invitations.",
                  "en": "Four hundred pages, eleven thousand copies and two scores settled. The book will outlast the slot and bring in fewer invitations." } }
  ]
},

{
  "id": "condamnation_definitive",
  "once": true,
  "weight": 6,
  "when": { "flag": { "onTrial": true } },
  "tag": { "fr": "Le délibéré", "en": "The verdict" },
  "text": {
    "fr": "Le tribunal rend sa décision. Vous êtes condamné, et il vous reste à décider ce que vous faites d'un dossier qui portera votre nom dans tous les moteurs de recherche jusqu'à la fin.",
    "en": "The court delivers its decision. You are convicted, and what remains is to decide what to do with a case that will carry your name in every search engine until the end."
  },
  "choices": [
    { "label": { "fr": "Faire appel et continuer comme si de rien n'était", "en": "Appeal and carry on as if nothing had happened" },
      "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "standing": -4, "sangfroid": 1 },
      "result": { "fr": "L'appel prendra quatre ans et ne changera rien. Vous continuez, et chaque portrait commencera désormais par un paragraphe que vous n'avez pas écrit.",
                  "en": "The appeal will take four years and change nothing. You carry on, and every profile will now open with a paragraph you did not write." } },
    { "label": { "fr": "Reconnaître, s'excuser, et rester", "en": "Admit it, apologise, and stay" },
      "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "reputation": 2, "popularity": 4, "standing": -8 },
      "result": { "fr": "Vous dites que vous avez eu tort, en quatre phrases, sans avocat à côté de vous. Le pays encaisse mieux que l'appareil, comme toujours.",
                  "en": "You say you were wrong, in four sentences, with no lawyer beside you. The country takes it better than the machine does, as always." } },
    { "label": { "fr": "Se retirer de la vie publique le temps de la peine", "en": "Withdraw from public life for the duration" },
      "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "office": "none", "energie": 3, "reputation": 3 },
      "result": { "fr": "Vous rendez tout et vous disparaissez. C'est la seule sortie qui laisse une porte ouverte, et presque personne ne la prend.",
                  "en": "You hand everything back and you vanish. It is the only exit that leaves a door open, and almost nobody takes it." } },
    { "label": { "fr": "Plaider que le dossier était politique", "en": "Argue the case was political" },
      "when": { "party": ["radical_left", "identitarians"] },
      "roll": { "base": 15, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "popularity": 8, "standing": 6, "credibilite": -2 },
        "result": { "fr": "Votre électorat vous croit et vous le dit. La condamnation devient une preuve de plus que le système vous en veut, ce qui est exactement ce qu'il fallait en faire.",
                    "en": "Your voters believe you and say so. The conviction becomes further proof the system is out to get you, which is exactly what it needed to become." } },
      "failure": { "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "popularity": -9, "reputation": -2, "credibilite": -2 },
        "result": { "fr": "L'argument ne prend pas, parce que les faits sont dans le jugement et que le jugement est public. On vous ressortira cette conférence de presse à chaque échéance.",
                    "en": "The argument does not land, because the facts are in the judgment and the judgment is public. That press conference will be replayed at every election." } } }
  ]
},

{
  "id": "poudre_toilettes",
  "once": true,
  "weight": 3,
  "when": { "position": ["depute", "cadre", "ministre", "maire"], "minTurn": 8, "notTrait": ["drogue"] },
  "tag": { "fr": "Deuxième étage", "en": "Second floor" },
  "text": {
    "fr": "Deux heures du matin, session de nuit, quatrième semaine de budget. Un collègue vous fait signe dans les toilettes du deuxième et vous explique, avec la simplicité de l'évidence, comment tout le monde tient.",
    "en": "Two in the morning, night sitting, fourth week of the budget. A colleague waves you into the second-floor toilets and explains, with the simplicity of the obvious, how everybody keeps going."
  },
  "choices": [
    { "label": { "fr": "Essayer, une fois", "en": "Try it, once" },
      "effects": { "trait": "drogue", "energie": 3, "sangfroid": -1 },
      "result": { "fr": "Vous tenez la séance jusqu'à six heures et vous êtes brillant à quatre. Il n'y a jamais qu'une fois, et tout le monde vous l'avait dit.",
                  "en": "You hold the sitting until six and you are brilliant at four. There is never just one time, and everyone told you so." } },
    { "label": { "fr": "Refuser et rentrer dormir", "en": "Say no and go home to sleep" },
      "effects": { "energie": 1, "reputation": 1, "standing": -2 },
      "result": { "fr": "Vous manquez trois votes de nuit et une partie de ce qui s'y décide. C'est le prix, et il est plus bas que l'autre.",
                  "en": "You miss three night votes and part of what gets decided in them. That is the price, and it is lower than the other one." } },
    { "label": { "fr": "Refuser, et prévenir le président de groupe", "en": "Refuse, and warn the group chairman" },
      "when": { "stat": { "reputation": { "min": 12 } } },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 5, "reputation": 2 },
        "result": { "fr": "Le collègue est mis en congé maladie et personne n'a jamais su par qui. Deux personnes vous doivent le silence, ce qui vaut mieux qu'un service.",
                    "en": "The colleague is put on sick leave and nobody ever knew who told. Two people owe you their silence, which is worth more than a favour." } },
      "failure": { "effects": { "standing": -9, "reseau": -2, "strike": "traitre" },
        "result": { "fr": "L'information remonte avec votre nom dessus. Dans un groupe parlementaire, on pardonne la poudre et jamais la dénonciation.",
                    "en": "The information travels back with your name on it. In a parliamentary group, powder is forgiven and informing never is." } } },
    { "label": { "fr": "Refuser, et le raconter en séance", "en": "Refuse, and say it in the chamber" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 3, "popularity": 6, "standing": -14, "reputation": 2 },
      "result": { "fr": "Vous décrivez la scène à la tribune, sans nommer personne. La séance est suspendue, la vidéo tourne pendant huit jours, et plus un député ne vous adresse la parole dans un couloir.",
                  "en": "You describe the scene from the rostrum, naming nobody. The sitting is suspended, the video runs for eight days, and not one member speaks to you in a corridor again." } }
  ]
},

{
  "id": "drogue_controle",
  "weight": 0,
  "tag": { "fr": "Le contrôle", "en": "The check" },
  "text": {
    "fr": "Contrôle routier à trois heures du matin, à la sortie d'un dîner. Le gendarme reconnaît votre nom avant de reconnaître votre visage, et il applique la procédure, exactement comme il doit le faire.",
    "en": "A roadside check at three in the morning, leaving a dinner. The officer recognises your name before your face, and follows the procedure exactly as he should."
  },
  "choices": [
    { "label": { "fr": "Tout reconnaître immédiatement", "en": "Admit everything immediately" },
      "effects": { "popularity": -8, "reputation": -2, "standing": -6, "credibilite": -1 },
      "result": { "fr": "Vous ne discutez pas, vous ne téléphonez à personne, et vous publiez un communiqué à sept heures. C'est ce qu'il fallait faire et cela coûte quand même.",
                  "en": "You do not argue, you call nobody, and you put out a statement at seven. It was the right thing to do and it costs all the same." } },
    { "label": { "fr": "Faire jouer vos relations", "en": "Pull some strings" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": -2, "reputation": -1, "flags": { "investigated": true } },
        "result": { "fr": "Le procès-verbal existe et n'ira nulle part. Trois personnes le savent, et l'une d'elles vous le rappellera au pire moment.",
                    "en": "The report exists and will go nowhere. Three people know, and one of them will remind you at the worst possible moment." } },
      "failure": { "effects": { "popularity": -14, "reputation": -3, "standing": -10, "flags": { "onTrial": true } },
        "result": { "fr": "L'appel de trop, au mauvais numéro, à trois heures du matin. Ce n'est plus l'affaire de la poudre, c'est l'affaire du coup de fil.",
                    "en": "One call too many, to the wrong number, at three in the morning. It is no longer the powder story, it is the phone call story." } } },
    { "label": { "fr": "Se soigner, et le dire", "en": "Get treatment, and say so" },
      "effects": { "untrait": "drogue", "popularity": -3, "reputation": 3, "energie": -2, "credibilite": 1 },
      "result": { "fr": "Six semaines de retrait annoncées en une phrase. Le pays est meilleur que sa réputation sur ces sujets-là, et l'appareil est pire.",
                  "en": "Six weeks away, announced in a single sentence. The country is better than its reputation on these matters, and the machine is worse." } }
  ]
},

{
  "id": "couple_magazine",
  "once": true,
  "weight": 3,
  "when": { "minPopularity": 45, "minTurn": 10, "notTrait": ["couple_people"] },
  "tag": { "fr": "La double page", "en": "The spread" },
  "text": {
    "fr": "Votre compagne est connue pour autre chose que vous, et un magazine propose de vous photographier ensemble, chez vous, en huit pages. L'attaché de presse dit oui avant que vous ayez répondu.",
    "en": "Your partner is famous for something other than you, and a magazine offers to photograph you together, at home, over eight pages. The press officer says yes before you have answered."
  },
  "choices": [
    { "label": { "fr": "Accepter les huit pages", "en": "Take the eight pages" },
      "effects": { "trait": "couple_people", "popularity": 7, "notoriete": 3, "credibilite": -2 },
      "result": { "fr": "Deux cent mille exemplaires et une notoriété qui n'a plus rien à voir avec la politique. On vous reconnaît dans les gares, on ne vous cite plus dans les débats.",
                  "en": "Two hundred thousand copies and a fame that has nothing to do with politics any more. People recognise you in stations; nobody quotes you in debates." } },
    { "label": { "fr": "Refuser, et protéger ce qui reste", "en": "Refuse, and protect what is left" },
      "effects": { "reputation": 2, "credibilite": 1, "popularity": -3 },
      "result": { "fr": "Vous dites non et vous le tenez, y compris quand le magazine sort le papier sans les photos. Personne ne saura jamais que c'était un choix.",
                  "en": "You say no and you hold to it, including when the magazine runs the piece without the photographs. Nobody will ever know it was a choice." } },
    { "label": { "fr": "Accepter, et en faire une séquence politique", "en": "Accept, and turn it into a political sequence" },
      "when": { "background": ["comms", "celebrity"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "trait": "couple_people", "popularity": 10, "notoriete": 3, "standing": 3 },
        "result": { "fr": "Huit pages, dont trois sur ce que vous défendez, obtenues au forceps contre la rédaction. C'est le seul portrait de vacances de l'histoire dont on ait retenu une idée.",
                    "en": "Eight pages, three of them on what you stand for, wrung out of the editors. It is the only holiday spread in history from which anybody remembered an idea." } },
      "failure": { "effects": { "trait": "couple_people", "popularity": 6, "credibilite": -3, "standing": -4 },
        "result": { "fr": "La rédaction garde les photos et coupe les idées. Vous avez donné votre salon et récupéré une légende de trois lignes.",
                    "en": "The editors keep the photographs and cut the ideas. You gave up your living room and got a three-line caption." } } }
  ]
},

{
  "id": "ancrage_permanence",
  "once": true,
  "weight": 3,
  "when": { "position": ["conseiller", "maire", "depute"], "minTurn": 12, "notTrait": ["ancrage_local"] },
  "tag": { "fr": "La permanence", "en": "The surgery" },
  "text": {
    "fr": "Douze ans que vous tenez la même permanence le samedi matin. Un cabinet parisien vous propose de professionnaliser tout ça : un attaché, des créneaux, un logiciel de rendez-vous, et vos samedis pour vous.",
    "en": "Twelve years holding the same Saturday morning surgery. A Paris consultancy offers to professionalise all of it: a staffer, time slots, appointment software, and your Saturdays back."
  },
  "choices": [
    { "label": { "fr": "Continuer à les recevoir vous-même, tous les samedis", "en": "Keep seeing them yourself, every Saturday" },
      "effects": { "trait": "ancrage_local", "energie": -2, "popularity": 4, "reseau": 1 },
      "result": { "fr": "Quatre cents samedis, deux mille dossiers, et trois cantons où l'on vous appelle par votre prénom. Vous ne serez jamais battu chez vous, et vous ne serez jamais autre chose que de chez vous.",
                  "en": "Four hundred Saturdays, two thousand cases, and three districts where they call you by your first name. You will never be beaten at home, and you will never be anything other than of that home." } },
    { "label": { "fr": "Déléguer et récupérer vos samedis", "en": "Delegate and take your Saturdays back" },
      "effects": { "energie": 3, "notoriete": 1, "popularity": -4, "money": -20000 },
      "result": { "fr": "Le logiciel fonctionne très bien et les gens le remarquent tout de suite. Deux ans plus tard, personne dans la ville ne sait plus à quoi vous ressemblez.",
                  "en": "The software works perfectly and people notice immediately. Two years later, nobody in the town remembers what you look like." } },
    { "label": { "fr": "Garder un samedi sur deux, et monter à Paris l'autre", "en": "Keep every other Saturday, and go up to Paris on the rest" },
      "when": { "stat": { "energie": { "min": 12 } } },
      "effects": { "reseau": 2, "notoriete": 1, "energie": -1, "popularity": 1 },
      "result": { "fr": "Le compromis qui coûte deux fois : on vous trouve moins présent ici et pas encore installé là-bas. C'est pourtant celui que prennent tous ceux qui finissent ministres.",
                  "en": "The compromise that costs twice over: you seem less present here and not yet established there. It is nonetheless the one taken by everybody who ends up a minister." } }
  ]
},

{
  "id": "sommet_anglais",
  "once": true,
  "weight": 3,
  "when": { "position": ["euro", "depute", "ministre", "premier", "chef"], "minTurn": 14 },
  "tag": { "fr": "Le sommet", "en": "The summit" },
  "text": {
    "fr": "Conférence de presse commune à Bruxelles, deux cents journalistes, et une question posée en anglais à laquelle il va falloir répondre en anglais. La cabine d'interprétation est là, et l'utiliser se verra.",
    "en": "A joint press conference in Brussels, two hundred reporters, and a question in English that will have to be answered in English. The interpretation booth is there, and using it will be noticed."
  },
  "choices": [
    { "label": { "fr": "Répondre en anglais, sans filet", "en": "Answer in English, without a net" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "eloquence": 0.35 },
                "bonus": [ { "when": { "trait": ["anglais_parfait"] }, "value": 6 },
                           { "when": { "trait": ["anglais_mediocre"] }, "value": -6 },
                           { "when": { "background": ["business", "academia"] }, "value": 2 } ],
                "dice": 16 },
      "success": { "effects": { "trait": "anglais_parfait", "credibilite": 2, "notoriete": 2, "standing": 3 },
        "result": { "fr": "Quatre minutes sans une hésitation, et une formule qui passe dans la presse britannique le soir même. On vous regarde différemment dans les salles où l'on décide.",
                    "en": "Four minutes without a hesitation, and a phrase that runs in the British press that evening. You are looked at differently in the rooms where things are decided." } },
      "failure": { "effects": { "trait": "anglais_mediocre", "credibilite": -1, "notoriete": 2, "popularity": -4 },
        "result": { "fr": "Vingt secondes deviennent un format, un son, une imitation. Le fond de ce que vous disiez était juste et personne ne l'a jamais su.",
                    "en": "Twenty seconds become a format, a soundbite, an impression. What you were actually saying was right and nobody ever found out." } } },
    { "label": { "fr": "Passer par l'interprète, sans s'excuser", "en": "Use the interpreter, without apologising" },
      "effects": { "credibilite": 1, "reputation": 1, "notoriete": -1 },
      "result": { "fr": "Vous répondez en français, longuement, et vous laissez la cabine faire son travail. C'est ce que font les chefs d'État qui n'ont rien à prouver, et personne ne le remarque.",
                  "en": "You answer in French, at length, and let the booth do its job. It is what heads of state with nothing to prove do, and nobody notices." } },
    { "label": { "fr": "Prendre trois mois de cours avant le prochain", "en": "Take three months of lessons before the next one" },
      "when": { "minMoney": 30000 },
      "effects": { "untrait": "anglais_mediocre", "money": -25000, "credibilite": 1, "energie": -2 },
      "result": { "fr": "Deux heures par semaine pendant trois mois, avec un professeur qui ne sait pas qui vous êtes. C'est humiliant, c'est efficace, et cela ne se raconte à personne.",
                  "en": "Two hours a week for three months, with a teacher who has no idea who you are. It is humiliating, it works, and it is told to nobody." } }
  ]
},

{
  "id": "loi_rue",
  "weight": 4,
  "when": { "position": ["depute", "ministre", "premier"], "minTurn": 10 },
  "tag": { "fr": "La rue", "en": "The street" },
  "text": {
    "fr": "Le texte est passé et le pays ne l'a pas accepté. Quatre cent mille personnes défilent le premier samedi, six cent mille le deuxième, et les préfectures annoncent la moitié.",
    "en": "The bill passed and the country has not accepted it. Four hundred thousand march the first Saturday, six hundred thousand the second, and the police count half that."
  },
  "choices": [
    { "label": { "fr": "Défendre le texte, sans reculer d'un mot", "en": "Defend the bill, without conceding a word" },
      "when": { "ruling": true },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "standing": 8, "popularity": -9, "approval": -4 },
        "result": { "fr": "Vous tenez six semaines sans céder et le mouvement s'épuise en novembre. On appellera cela du courage dans dix ans et de l'entêtement d'ici là.",
                    "en": "You hold for six weeks without giving ground and the movement runs out in November. In ten years they will call it courage; until then, stubbornness." } },
      "failure": { "effects": { "credibilite": -2, "standing": -6, "popularity": -14, "approval": -12 },
        "result": { "fr": "Une phrase de trop devant une caméra, un samedi, et c'est vous qu'on met sur les pancartes la semaine suivante. Le texte passera, votre nom restera dessus.",
                    "en": "One sentence too many in front of a camera, on a Saturday, and it is your face on the placards the week after. The bill will pass; your name will stay on it." } } },
    { "label": { "fr": "Défiler avec eux", "en": "March with them" },
      "when": { "ruling": false },
      "effects": { "popularity": 9, "standing": 4, "notoriete": 2, "approval": -6, "energie": -2 },
      "result": { "fr": "Deux heures dans le cortège, sans tribune et sans service d'ordre. Les images valent tous les communiqués de votre groupe depuis six mois.",
                  "en": "Two hours in the march, no platform and no stewards. The pictures are worth every press release your group has issued in six months." } },
    { "label": { "fr": "Proposer une sortie de crise par la négociation", "en": "Offer a negotiated way out" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "credibilite": 3, "reputation": 2, "popularity": 4, "approval": 4 },
        "result": { "fr": "Trois réunions discrètes et un communiqué commun. Le mouvement s'arrête, personne ne vous en félicite, et deux syndicats vous doivent quelque chose.",
                    "en": "Three discreet meetings and a joint statement. The movement stops, nobody congratulates you, and two unions owe you something." } },
      "failure": { "effects": { "reputation": -2, "standing": -5, "popularity": -4, "energie": -1 },
        "result": { "fr": "Les négociations échouent et fuitent. Chaque camp vous accuse d'avoir parlé à l'autre, ce qui est exactement ce que vous avez fait.",
                    "en": "The talks fail and leak. Each side accuses you of talking to the other, which is precisely what you did." } } },
    { "label": { "fr": "Ne rien faire et attendre l'hiver", "en": "Do nothing and wait for winter" },
      "effects": { "energie": 2, "popularity": -4, "sangfroid": 1, "approval": -2 },
      "result": { "fr": "Vous ne dites rien pendant six semaines. Le froid finit toujours par faire ce que les gouvernements n'osent pas faire.",
                  "en": "You say nothing for six weeks. The cold always ends up doing what governments do not dare to." } }
  ]
},

{
  "id": "assemblee_absences",
  "when": { "position": ["depute", "euro"], "minTurn": 8 },
  "tag": { "fr": "Le décompte", "en": "The attendance record" },
  "text": {
    "fr": "Un site publie le décompte des présences en séance. Le vôtre est mauvais, celui de trois de vos collègues est pire, et un journaliste local vous appelle pour vous demander de vous expliquer.",
    "en": "A website publishes the attendance figures for the chamber. Yours are poor, three of your colleagues' are worse, and a local reporter calls to ask you to explain."
  },
  "choices": [
    { "label": { "fr": "Expliquer le vrai travail, celui qui ne se compte pas", "en": "Explain the real work, the kind that is not counted" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 15 },
      "success": { "effects": { "credibilite": 2, "popularity": 3, "reputation": 1 },
        "result": { "fr": "Vous détaillez les commissions, les permanences et les quatre-vingts rendez-vous du mois. C'est vrai, c'est ennuyeux, et le papier sort en votre faveur.",
                    "en": "You set out the committees, the surgeries and the eighty meetings this month. It is true, it is dull, and the piece comes out in your favour." } },
      "failure": { "effects": { "popularity": -7, "reputation": -2, "credibilite": -1 },
        "result": { "fr": "L'explication passe pour une excuse, parce que c'en est une. Le chiffre restera attaché à votre nom jusqu'à la prochaine élection.",
                    "en": "The explanation reads as an excuse, because it is one. The figure will stay attached to your name until the next election." } } },
    { "label": { "fr": "Aller siéger, tous les jours, pendant six mois", "en": "Sit in the chamber, every day, for six months" },
      "effects": { "credibilite": 2, "reputation": 2, "standing": 3, "energie": -4, "popularity": 2 },
      "result": { "fr": "Six mois de banc, y compris les mardis à vingt-trois heures devant quatorze personnes. Votre décompte devient irréprochable et votre circonscription ne vous voit plus.",
                  "en": "Six months on the bench, including Tuesdays at eleven at night in front of fourteen people. Your record becomes spotless and your constituency stops seeing you." } },
    { "label": { "fr": "Sortir le décompte de ceux d'en face", "en": "Publish the other side's figures" },
      "effects": { "notoriete": 2, "popularity": -3, "reputation": -2, "standing": -4, "approval": -2 },
      "result": { "fr": "Vous montrez que trois ministres siègent encore moins. C'est exact, cela ne vous lave de rien, et l'Assemblée entière en sort un peu plus sale.",
                  "en": "You show that three ministers attend even less. It is accurate, it clears you of nothing, and the whole chamber comes out a little dirtier." } }
  ]
},

{
  "id": "assemblee_engueulade",
  "weight": 3,
  "when": { "position": ["depute", "ministre", "premier"], "minTurn": 6 },
  "tag": { "fr": "Séance suspendue", "en": "Sitting suspended" },
  "text": {
    "fr": "Une phrase de trop en séance, des cris des deux côtés, et le président de séance suspend. Dans le couloir, tout le monde a une caméra et personne n'a encore décidé de quoi il aura l'air.",
    "en": "One sentence too many in the chamber, shouting from both sides, and the speaker suspends the sitting. In the corridor everyone has a camera and nobody has yet decided how they want to look."
  },
  "choices": [
    { "label": { "fr": "En remettre une couche devant les caméras", "en": "Double down in front of the cameras" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 8, "standing": 3, "credibilite": -2, "approval": -3 },
        "result": { "fr": "Quarante secondes qui tournent partout jusqu'au dimanche. On ne se souviendra pas du texte, on se souviendra de vous.",
                    "en": "Forty seconds that go everywhere until Sunday. Nobody will remember the bill; they will remember you." } },
      "failure": { "effects": { "popularity": -8, "reputation": -2, "credibilite": -2, "standing": -3 },
        "result": { "fr": "Vous montez d'un ton et vous perdez le fil au milieu. La séquence sert d'exemple dans toutes les écoles de communication pendant deux ans.",
                    "en": "You raise your voice and lose the thread halfway. The clip is used as a teaching example in every communications school for two years." } } },
    { "label": { "fr": "S'excuser tout de suite, publiquement", "en": "Apologise immediately, in public" },
      "effects": { "reputation": 3, "credibilite": 1, "popularity": -2, "standing": -5 },
      "result": { "fr": "Deux phrases à la reprise de séance, sans conditionnel. C'est rare, cela désarme tout le monde, et votre groupe vous en voudra plus que l'autre camp.",
                  "en": "Two sentences when the sitting resumes, with no qualifiers. It is rare, it disarms everybody, and your own group will hold it against you more than the other side did." } },
    { "label": { "fr": "Ne rien dire et laisser dire", "en": "Say nothing and let it run" },
      "effects": { "sangfroid": 1, "energie": 1, "notoriete": 1, "popularity": -1 },
      "result": { "fr": "Vous rentrez dans l'hémicycle sans un mot pour les caméras. L'affaire dure trente heures au lieu de trois jours.",
                  "en": "You walk back into the chamber without a word for the cameras. The story lasts thirty hours instead of three days." } }
  ]
},

{
  "id": "vote_contre_son_camp",
  "weight": 3,
  "when": { "position": ["depute"], "minTurn": 8 },
  "tag": { "fr": "Consigne de vote", "en": "The party whip" },
  "text": {
    "fr": "Le groupe a arrêté sa position et elle est l'inverse de ce que vous avez promis chez vous. Le vote est nominatif, il sera publié, et votre circonscription le lira.",
    "en": "The group has settled its line and it is the opposite of what you promised at home. The vote is recorded, it will be published, and your constituency will read it."
  },
  "choices": [
    { "label": { "fr": "Voter la consigne", "en": "Follow the whip" },
      "effects": { "standing": 7, "popularity": -6, "reputation": -2 },
      "result": { "fr": "Vous levez la main avec les autres. C'est ce qu'on attend d'un député de groupe, et c'est ce que vos électeurs appellent une trahison.",
                  "en": "You raise your hand with the rest. It is what is expected of a group member, and what your voters call a betrayal." } },
    { "label": { "fr": "Voter contre, et l'assumer chez vous", "en": "Vote against, and own it at home" },
      "effects": { "standing": -12, "popularity": 9, "reputation": 3, "credibilite": 1 },
      "result": { "fr": "Une voix contre dans la liste publiée, la vôtre. Le groupe vous le fera payer à chaque investiture, et votre circonscription vous réélira.",
                  "en": "One vote against in the published list, yours. The group will make you pay at every nomination, and your constituency will re-elect you." } },
    { "label": { "fr": "S'absenter ce jour-là", "en": "Be absent that day" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "standing": -2, "popularity": -1, "sangfroid": 1 },
        "result": { "fr": "Un déplacement opportun, une absence qui ne se remarque pas dans la liste. Vous n'avez rien voté et personne ne vous demandera rien.",
                    "en": "A well-timed trip, an absence nobody notices in the list. You voted for nothing and nobody will ask you anything." } },
      "failure": { "effects": { "standing": -6, "popularity": -7, "reputation": -2 },
        "result": { "fr": "Votre absence est relevée par les deux camps le même jour. Ne pas choisir est un choix, et c'est le seul que tout le monde méprise.",
                    "en": "Your absence is noted by both sides on the same day. Not choosing is a choice, and it is the only one everybody despises." } } },
    { "label": { "fr": "Négocier un aménagement contre votre voix", "en": "Trade your vote for an amendment" },
      "when": { "minStanding": 52 },
      "effects": { "reseau": 2, "standing": 4, "popularity": 3, "credibilite": 1, "reputation": -1 },
      "result": { "fr": "Une ligne ajoutée au texte, qui ne change presque rien mais qui existe. Vous pourrez la montrer chez vous et l'oublier ici.",
                  "en": "One line added to the bill, which changes almost nothing but exists. You can show it at home and forget it here." } }
  ]
},

{
  "id": "pouvoir_greve",
  "weight": 3,
  "when": { "ruling": true, "position": ["ministre", "premier"], "maxApproval": 45, "minTurn": 10 },
  "tag": { "fr": "Le blocage", "en": "The shutdown" },
  "text": {
    "fr": "Trois fédérations appellent à la reconductible et le pays s'arrête un jour sur deux. Votre ministère est en première ligne et l'Élysée attend de voir qui craquera le premier.",
    "en": "Three federations call an open-ended strike and the country stops every other day. Your ministry is on the front line and the presidency is waiting to see who breaks first."
  },
  "choices": [
    { "label": { "fr": "Recevoir les syndicats et lâcher quelque chose", "en": "Receive the unions and give something up" },
      "effects": { "approval": 7, "reseau": 2, "reputation": 2, "standing": -8, "credibilite": -1 },
      "result": { "fr": "Deux concessions en quatre heures et la reprise le lundi. Le pays respire, l'Élysée vous trouve faible, et c'était la seule sortie.",
                  "en": "Two concessions in four hours and the country back to work on Monday. The public breathes, the presidency finds you weak, and it was the only way out." } },
    { "label": { "fr": "Tenir, réquisitionner, et attendre", "en": "Hold, requisition, and wait" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "approval": 5, "standing": 10, "credibilite": 2, "popularity": -7, "energie": -3 },
        "result": { "fr": "Onze jours, puis la reprise sans rien avoir cédé. Vous devenez le ministre qui tient, ce qui est une réputation utile et coûteuse.",
                    "en": "Eleven days, then a return to work without a single concession. You become the minister who holds, which is a useful and expensive reputation." } },
      "failure": { "effects": { "approval": -14, "standing": -10, "popularity": -11, "energie": -3, "office": "none" },
        "result": { "fr": "Trois semaines de blocage, une pénurie, et un arbitrage rendu au-dessus de vous. On vous remercie un vendredi soir, par communiqué.",
                    "en": "Three weeks of shutdown, shortages, and a decision taken over your head. You are thanked on a Friday evening, by press release." } } },
    { "label": { "fr": "Faire porter le sujet par quelqu'un d'autre", "en": "Let somebody else carry it" },
      "effects": { "energie": 2, "standing": -5, "reputation": -2, "approval": -3, "credibilite": -1 },
      "result": { "fr": "Vous laissez un collègue prendre les plateaux et les coups. Il s'en souviendra, et il aura raison de s'en souvenir.",
                  "en": "You let a colleague take the studios and the blows. He will remember, and he will be right to." } }
  ]
},

{
  "id": "opp_niche",
  "when": { "ruling": false, "position": ["depute"], "minTurn": 6 },
  "tag": { "fr": "Niche parlementaire", "en": "Opposition day" },
  "text": {
    "fr": "Votre groupe a sa journée réservée : une seule, dans l'année, où c'est l'opposition qui écrit l'ordre du jour. Trois textes se disputent le créneau et un seul ira au vote.",
    "en": "Your group has its reserved day: one a year, when the opposition writes the order paper. Three bills are competing for the slot and only one will reach a vote."
  },
  "choices": [
    { "label": { "fr": "Un texte que la majorité ne peut pas refuser", "en": "A bill the majority cannot refuse" },
      "effects": { "credibilite": 2, "reputation": 2, "standing": 3, "approval": -3, "popularity": 2 },
      "result": { "fr": "Il passe à l'unanimité moins six voix. Vous avez fait voter une loi depuis l'opposition, ce qui n'arrive presque jamais, et personne ne s'en souviendra.",
                  "en": "It passes unanimously bar six votes. You got a law through from opposition, which almost never happens, and nobody will remember it." } },
    { "label": { "fr": "Un texte qui met la majorité en difficulté", "en": "A bill that puts the majority in trouble" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 6, "standing": 5, "approval": -7 },
        "result": { "fr": "Onze députés de la majorité votent avec vous et le gouvernement doit s'expliquer pendant trois jours. Le texte ne passe pas, ce n'était pas le but.",
                    "en": "Eleven government MPs vote with you and the government spends three days explaining itself. The bill fails, which was never the point." } },
      "failure": { "effects": { "popularity": -4, "standing": -5, "reputation": -1 },
        "result": { "fr": "La majorité tient, le texte tombe, et l'on retient que vous avez gâché la seule journée que votre groupe avait dans l'année.",
                    "en": "The majority holds, the bill falls, and what sticks is that you wasted the one day your group had all year." } } },
    { "label": { "fr": "Laisser la place à un collègue qui y tient", "en": "Give the slot to a colleague who wants it" },
      "effects": { "reseau": 3, "standing": 4, "popularity": -2, "energie": 1 },
      "result": { "fr": "Vous cédez le créneau sans le monnayer. Trois personnes du groupe s'en souviendront le jour où l'on comptera les voix.",
                  "en": "You give up the slot without selling it. Three people in the group will remember on the day the votes are counted." } }
  ]
},

{
  "id": "opp_obstruction",
  "when": { "ruling": false, "position": ["depute"], "majority": ["absolue"], "minTurn": 8 },
  "tag": { "fr": "Obstruction", "en": "Filibuster" },
  "text": {
    "fr": "Le gouvernement a la majorité absolue et fait passer ce qu'il veut. Il reste une arme : déposer trois mille amendements et tenir l'hémicycle jusqu'à quatre heures du matin pendant trois semaines.",
    "en": "The government has an absolute majority and passes what it likes. One weapon is left: table three thousand amendments and hold the chamber until four in the morning for three weeks."
  },
  "choices": [
    { "label": { "fr": "Y aller, nuit après nuit", "en": "Do it, night after night" },
      "effects": { "notoriete": 2, "standing": 6, "energie": -4, "popularity": -3, "approval": -4 },
      "result": { "fr": "Le texte passe quand même, avec trois semaines de retard. Votre camp vous trouve héroïque, le pays vous trouve fatigant, et les deux ont raison.",
                  "en": "The bill passes anyway, three weeks late. Your side finds you heroic, the country finds you exhausting, and both are right." } },
    { "label": { "fr": "Choisir trois amendements et les défendre vraiment", "en": "Pick three amendments and actually defend them" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "reputation": 2, "popularity": 5, "standing": -2, "approval": -3 },
        "result": { "fr": "Deux sont adoptés, ce qui n'était pas prévu, et le troisième revient dans le débat public six mois plus tard sous un autre nom.",
                    "en": "Two are adopted, which nobody planned, and the third comes back into public debate six months later under another name." } },
      "failure": { "effects": { "popularity": -2, "standing": -4, "energie": -1 },
        "result": { "fr": "Les trois tombent en douze minutes. Vous aviez raison sur le fond et vous étiez seul, ce qui, à l'Assemblée, revient à avoir tort.",
                    "en": "All three fall in twelve minutes. You were right on the substance and you were alone, which in that chamber amounts to being wrong." } } },
    { "label": { "fr": "Ne pas participer et travailler ailleurs", "en": "Skip it and work elsewhere" },
      "effects": { "energie": 3, "standing": -6, "credibilite": 1 },
      "result": { "fr": "Vous passez trois semaines dans votre circonscription pendant que les autres dorment sur les bancs. Le groupe compte les absents, et vous en êtes.",
                  "en": "You spend three weeks in your constituency while the others sleep on the benches. The group counts who was missing, and you were." } }
  ]
},

{
  "id": "pouvoir_49_3",
  "when": { "ruling": true, "position": ["ministre", "premier"], "majority": ["relative", "aucune"] },
  "tag": { "fr": "Le passage en force", "en": "Ramming it through" },
  "text": {
    "fr": "Le texte n'a pas la majorité et le compte des voix ne bougera plus. Il reste l'article qui permet de l'adopter sans vote, en échange d'une motion de censure que l'opposition déposera dans l'heure.",
    "en": "The bill does not have the votes and the count will not move. There remains the article that lets you adopt it without a vote, in exchange for a no-confidence motion the opposition will table within the hour."
  },
  "choices": [
    { "label": { "fr": "Engager la responsabilité du gouvernement", "en": "Put the government's survival on the line" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 2, "standing": 6, "approval": -8, "popularity": -6, "reputation": -1 },
        "result": { "fr": "La motion tombe à neuf voix près et le texte est adopté sans avoir été voté. Vous avez gagné, et le mot « démocratie » reviendra dans chaque tribune pendant six semaines.",
                    "en": "The motion fails by nine votes and the bill is adopted without ever being voted on. You won, and the word “democracy” will be in every op-ed for six weeks." } },
      "failure": { "effects": { "credibilite": -2, "standing": -12, "approval": -14, "popularity": -8, "office": "none" },
        "result": { "fr": "La motion passe. Le gouvernement tombe, vous rendez votre portefeuille, et c'est vous qui aurez conseillé le passage en force.",
                    "en": "The motion passes. The government falls, you hand back your portfolio, and it was you who advised ramming it through." } } },
    { "label": { "fr": "Retirer le texte et le réécrire", "en": "Withdraw the bill and rewrite it" },
      "effects": { "credibilite": 1, "reputation": 2, "standing": -7, "approval": 3, "energie": -2 },
      "result": { "fr": "Six semaines de plus, quatre concessions, et un texte qui ne ressemble plus à ce que vous vouliez. Il passera, et personne ne saura qu'il a existé autrement.",
                  "en": "Six more weeks, four concessions, and a bill that no longer resembles what you wanted. It will pass, and nobody will know it once looked different." } },
    { "label": { "fr": "Aller chercher les voix une par une", "en": "Go and get the votes one by one" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "charisme": 0.35, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 8, "approval": 5, "credibilite": 2, "energie": -3 },
        "result": { "fr": "Onze jours de bureau en bureau, et le texte passe de quatre voix, votées. Cela ne se raconte pas au journal de vingt heures et cela vaut mieux qu'un passage en force.",
                    "en": "Eleven days of office-to-office, and the bill passes by four votes, actually cast. It does not make the evening news and it is worth more than ramming it through." } },
      "failure": { "effects": { "standing": -6, "approval": -6, "energie": -3, "reputation": -1 },
        "result": { "fr": "Vous promettez trop à trop de monde et deux de vos promesses se croisent dans un couloir. Le texte tombe et les promesses restent.",
                    "en": "You promise too much to too many people and two of your promises meet in a corridor. The bill falls and the promises remain." } } }
  ]
},

{
  "id": "pouvoir_remaniement_cote",
  "when": { "ruling": true, "position": ["depute", "ministre", "chef"], "maxApproval": 36, "minTurn": 10 },
  "tag": { "fr": "Le pouvoir s'enfonce", "en": "The government is sinking" },
  "text": {
    "fr": "Le gouvernement est à un niveau de rejet qu'on n'avait pas vu depuis longtemps. Dans votre camp, deux écoles s'affrontent : ceux qui veulent tenir jusqu'au bout et ceux qui préparent déjà l'après.",
    "en": "The government has reached a level of rejection nobody has seen in a long time. In your own camp, two schools are fighting: those who want to hold to the end, and those already preparing for what comes next."
  },
  "choices": [
    { "label": { "fr": "Tenir la ligne publiquement", "en": "Hold the line in public" },
      "effects": { "standing": 8, "reputation": 2, "popularity": -7, "approval": 4 },
      "result": { "fr": "Vous défendez l'indéfendable avec application. Le camp vous en saura gré longtemps après que le pays vous en aura tenu rigueur.",
                  "en": "You defend the indefensible diligently. Your camp will thank you long after the country has stopped holding it against you." } },
    { "label": { "fr": "Prendre vos distances, en termes choisis", "en": "Step back, in carefully chosen terms" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "notoriete": 2, "standing": -6, "approval": -4 },
        "result": { "fr": "Trois phrases, pas une de plus, et vous voilà le seul de votre camp que le pays écoute encore. Le siège a compris et ne dira rien tant que vous monterez.",
                    "en": "Three sentences, not one more, and you are suddenly the only one in your camp the country still listens to. Headquarters understood and will say nothing while you keep rising." } },
      "failure": { "effects": { "popularity": -3, "standing": -11, "reputation": -2, "approval": -5 },
        "result": { "fr": "La phrase est reprise sans ses nuances et devient une trahison. Vous perdez le camp sans gagner le pays, ce qui est la pire des deux places.",
                    "en": "The sentence is quoted without its qualifiers and becomes a betrayal. You lose the camp without winning the country, which is the worst of the two places to stand." } } },
    { "label": { "fr": "Ne rien dire et travailler vos dossiers", "en": "Say nothing and work your files" },
      "effects": { "credibilite": 2, "energie": 1, "standing": -2, "popularity": -1 },
      "result": { "fr": "Vous traversez la séquence sans une déclaration. C'est la seule chose qui ne se retournera contre vous ni maintenant ni dans dix ans.",
                  "en": "You cross the whole sequence without a single statement. It is the one thing that will be used against you neither now nor in ten years." } }
  ]
},

{
  "id": "opp_pouvoir_a_portee",
  "when": { "ruling": false, "position": ["depute", "maire", "chef"], "maxApproval": 33, "minStanding": 45, "minTurn": 12 },
  "tag": { "fr": "Ça sent la fin", "en": "The end is in the air" },
  "text": {
    "fr": "Le pouvoir est au plus bas et tout le monde le sait, à commencer par ceux qui l'exercent. Dans l'opposition, on ne parle plus de combattre le gouvernement mais de savoir qui prendra sa place.",
    "en": "The government is at rock bottom and everyone knows it, starting with the people running it. In opposition, nobody talks about fighting the government any more, only about who will replace it."
  },
  "choices": [
    { "label": { "fr": "Se poser en recours, dès maintenant", "en": "Present yourself as the alternative, now" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "charisme": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": 10, "credibilite": 2, "notoriete": 2, "standing": 5,
                                "landscape": { "self": 1.2 } },
        "result": { "fr": "Vous parlez comme quelqu'un qui gouvernera, et pas comme quelqu'un qui critique. Le pays fait la différence tout de suite, votre camp met six mois.",
                    "en": "You speak like somebody who will govern, not somebody who criticises. The country tells the difference immediately; your own camp takes six months." } },
      "failure": { "effects": { "popularity": -6, "standing": -8, "credibilite": -2 },
        "result": { "fr": "Se déclarer trop tôt, c'est se désigner à ceux de son propre camp. Ils ont dix-huit mois pour vous abîmer, et ils s'y mettent le soir même.",
                    "en": "Declaring too early means pointing yourself out to your own side. They have eighteen months to damage you, and they start that same evening." } } },
    { "label": { "fr": "Laisser le pouvoir se défaire tout seul", "en": "Let the government fall apart on its own" },
      "effects": { "sangfroid": 1, "standing": 3, "credibilite": 1, "energie": 2, "popularity": -2 },
      "result": { "fr": "Vous ne dites rien pendant six mois. C'est la stratégie la plus efficace de la vie politique et la seule que personne ne raconte dans ses mémoires.",
                  "en": "You say nothing for six months. It is the most effective strategy in politics and the only one nobody puts in their memoirs." } },
    { "label": { "fr": "Tendre la main : proposer une sortie de crise", "en": "Extend a hand: offer a way out of the crisis" },
      "effects": { "reputation": 3, "credibilite": 2, "popularity": 4, "standing": -9, "approval": 6 },
      "result": { "fr": "Vous proposez au pouvoir une porte de sortie honorable. Le pays trouve cela adulte, votre camp trouve cela incompréhensible, et le gouvernement respire deux mois de plus.",
                  "en": "You offer the government an honourable way out. The country finds it grown-up, your camp finds it incomprehensible, and the government breathes for two more months." } }
  ]
},

{
  "id": "censure_grande",
  "weight": 4,
  "when": { "position": ["depute", "ministre", "chef"], "maxApproval": 34,
            "majority": ["relative", "aucune"], "minTurn": 12 },
  "tag": { "fr": "La censure", "en": "The censure" },
  "text": {
    "fr": "Une motion de censure est déposée, et pour la première fois elle peut passer : le gouvernement n'a pas la majorité, le pays ne le soutient plus, et deux groupes qui ne se parlent jamais viennent de se parler.",
    "en": "A no-confidence motion is tabled, and for the first time it can pass: the government has no majority, the country has stopped backing it, and two groups that never speak to each other have just spoken."
  },
  "choices": [
    { "label": { "fr": "Faire tomber le gouvernement", "en": "Bring the government down" },
      "when": { "ruling": false },
      "roll": { "base": 15, "stat": "reseau", "plus": { "eloquence": 0.35, "standing": 0.04 },
                "bonus": [ { "when": { "position": ["chef"] }, "value": 2.5 },
                           { "when": { "maxApproval": 20 }, "value": 3 } ], "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 14, "standing": 8, "approval": -12,
                                "dissolve": true, "landscape": { "self": 1 } },
        "result": { "fr": "La motion passe. Le gouvernement tombe dans la nuit, le président dissout l'Assemblée le lendemain matin, et le pays revote dans six semaines. Vous avez déclenché tout cela.",
                    "en": "The motion passes. The government falls overnight, the president dissolves the Assembly the next morning, and the country votes again in six weeks. You set all of it in motion." } },
      "failure": { "effects": { "notoriete": 2, "popularity": -8, "standing": -14, "approval": 5 },
        "result": { "fr": "Il manque sept voix. Un gouvernement qui survit à une censure en sort plus fort qu'avant, et l'on retiendra que vous l'aviez menée.",
                    "en": "Seven votes short. A government that survives a censure comes out stronger than before, and people will remember you led it." } } },
    { "label": { "fr": "Sauver le gouvernement, voix par voix", "en": "Save the government, vote by vote" },
      "when": { "ruling": true },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 12, "approval": 6, "energie": -3, "popularity": -4 },
        "result": { "fr": "Vous passez trois nuits au téléphone et la motion tombe à quatre voix. Personne ne saura jamais lesquelles, et c'est très bien ainsi.",
                    "en": "You spend three nights on the phone and the motion fails by four votes. Nobody will ever know which four, and that is exactly as it should be." } },
      "failure": { "effects": { "standing": -10, "approval": -12, "popularity": -5, "dissolve": true },
        "result": { "fr": "La motion passe malgré vous. Le gouvernement tombe, le président dissout, et vous aurez été celui qui a compté les voix de travers.",
                    "en": "The motion passes despite you. The government falls, the president dissolves, and you will be the one who miscounted." } } },
    { "label": { "fr": "Voter la censure sans la revendiquer", "en": "Vote for it without claiming it" },
      "when": { "ruling": false },
      "effects": { "standing": 5, "popularity": 2, "approval": -4, "sangfroid": 1 },
      "result": { "fr": "Votre nom est dans la liste et nulle part ailleurs. C'est ce qu'on fait quand on ne sait pas encore si l'on veut être du côté des vainqueurs.",
                  "en": "Your name is on the list and nowhere else. It is what you do when you do not yet know whether you want to be on the winning side." } },
    { "label": { "fr": "S'abstenir, et le dire", "en": "Abstain, and say so" },
      "effects": { "credibilite": 1, "reputation": 1, "standing": -4, "popularity": -3 },
      "result": { "fr": "Vous expliquez qu'on ne renverse pas un gouvernement sans savoir par quoi le remplacer. C'est exact, c'est raisonnable, et cela ne convainc personne.",
                  "en": "You explain that you do not bring down a government without knowing what replaces it. It is accurate, it is reasonable, and it convinces nobody." } }
  ]
}
],

"campaign": [

/* ==========================================================================
   ÉVÉNEMENTS DE CAMPAGNE PRÉSIDENTIELLE
   ==========================================================================
   Même schéma, mais l'effet "poll" déplace directement les intentions de
   vote. Les amplitudes sont plus fortes : c'est le dernier moment où l'on
   peut renverser une élection.
   ========================================================================== */

{
  "id": "c_debat",
  "moment": 3,
  "required": true,
  "weight": 5,
  "tag": { "fr": "Le grand débat", "en": "The big debate" },
  "text": {
    "fr": "Le grand débat du premier tour. Ils sont sept sur le plateau, chacun a droit à onze minutes, et vingt millions de personnes regardent en attendant qu'il se passe quelque chose.",
    "en": "The first-round debate. Seven of them on set, eleven minutes each, and twenty million people watching for something to happen."
  },
  "choices": [
    { "label": { "fr": "Attaquer frontalement", "en": "Go on the attack" },
      "roll": { "stat": "eloquence", "base": 13, "dice": 16 },
      "success": { "effects": { "poll": 7, "notoriete": 1, "popularity": 8 },
        "result": { "fr": "Vous plantez une réplique qui fera les titres de demain. Le débat est plié.",
                    "en": "You land a line that will lead tomorrow's news. The debate is over." } },
      "failure": { "effects": { "credibilite": -2, "poll": -6, "reputation": -1, "popularity": -7 },
        "result": { "fr": "L'agressivité passe mal. On vous trouve nerveux, presque petit.",
                    "en": "The aggression falls flat. You come across as nervous, almost small." } } },
    { "label": { "fr": "Jouer la hauteur présidentielle", "en": "Play presidential" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "credibilite": +3, "poll": 5, "reputation": 1, "popularity": 5 },
        "result": { "fr": "Calme, précis, au-dessus de la mêlée. Vous avez l'air d'être déjà en fonction.",
                    "en": "Calm, precise, above the fray. You already look like the office." } },
      "failure": { "effects": { "credibilite": -1, "poll": -4, "popularity": -4 },
        "result": { "fr": "Trop lisse. Personne ne retient rien de ce que vous avez dit.",
                    "en": "Too smooth. Nobody remembers a word you said." } } },
    { "label": { "fr": "Sortir un dossier sur votre adversaire", "en": "Produce a file on your opponent" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 8, "notoriete": 2, "reputation": -1 },
        "result": { "fr": "Vous sortez une pièce que personne n'attendait. Il ne s'en relève pas ce soir-là.",
                    "en": "You produce a document nobody expected. He does not recover that evening." } },
      "failure": { "effects": { "poll": -7, "reputation": -2 },
        "result": { "fr": "Le document est contesté en direct. Le coup bas vous revient en pleine figure.",
                    "en": "The document is challenged live. The low blow comes straight back at you." } } },
    { "label": { "fr": "Parler technique et chiffres", "en": "Go technical, with numbers" },
      "when": { "background": ["academia", "civil"] },
      "effects": { "credibilite": +2, "poll": 4, "eloquence": 1, "reputation": 2, "popularity": -4 },
      "result": { "fr": "Vous maîtrisez chaque dossier. C'est austère et curieusement convaincant.",
                  "en": "You have command of every file. It is austere and oddly convincing." } }
  ]
},

{
  "id": "c_meeting",
  "tag": { "fr": "Meeting", "en": "Rally" },
  "text": {
    "fr": "Le meeting central de la campagne. La salle est immense et elle n'est pas encore pleine.",
    "en": "The centrepiece rally of the campaign. The hall is huge and not yet full."
  },
  "choices": [
    { "label": { "fr": "Un discours de rupture", "en": "A rupture speech" },
      "effects": { "poll": 5, "notoriete": 1, "standing": -6, "popularity": 4 },
      "result": { "fr": "La salle est debout. Votre état-major, lui, est assis, très pâle.",
                  "en": "The hall is on its feet. Your campaign team is seated, very pale." } },
    { "label": { "fr": "Un discours de rassemblement", "en": "A unity speech" },
      "effects": { "poll": 2, "standing": 9, "popularity": -4 },
      "result": { "fr": "Tout le parti applaudit. Le pays, lui, avait déjà changé de chaîne.",
                  "en": "The whole party applauds. The country had already changed channel." } },
    { "label": { "fr": "Remplir la salle avec des cars payés", "en": "Fill the hall with bussed-in crowds" },
      "when": { "minMoney": 120000 },
      "effects": { "poll": 4, "money": -90000, "notoriete": 1, "reputation": -1 },
      "result": { "fr": "Les images sont spectaculaires. Un journaliste comptera les cars sur le parking et en fera un papier.",
                  "en": "The pictures are spectacular. A reporter will count the coaches in the car park and write a piece about it." } },
    { "label": { "fr": "Annoncer une mesure que rien ne finance", "en": "Announce a measure nothing pays for" },
      "effects": { "poll": 6, "popularity": 7, "reputation": -2, "standing": -4, "strike": "menteur" },
      "result": { "fr": "La salle explose. Vos économistes apprennent la nouvelle en même temps que la presse, et se taisent.",
                  "en": "The hall erupts. Your economists learn about it at the same time as the press, and say nothing." } }
  ]
},

{
  "id": "c_revelation",
  "weight": 3,
  "tag": { "fr": "Révélation", "en": "Revelation" },
  "text": {
    "fr": "Un hebdomadaire sort une enquête sur vos années de jeunesse. Rien d'illégal, mais tout est présenté au pire.",
    "en": "A weekly runs an investigation into your younger years. Nothing illegal, but everything is framed at its worst."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point", "en": "Answer point by point" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 2, "reputation": 1, "popularity": 3 },
        "result": { "fr": "Votre démonstration est nette. L'enquête se retourne contre son auteur.",
                    "en": "Your rebuttal is clean. The investigation turns on its author." } },
      "failure": { "effects": { "poll": -5, "popularity": -6 },
        "result": { "fr": "Vous vous enferrez dans les détails. On ne retient que votre embarras.",
                    "en": "You get tangled in detail. Only your discomfort survives." } } },
    { "label": { "fr": "Ignorer et continuer la campagne", "en": "Ignore it and campaign on" },
      "effects": { "poll": -3, "sangfroid": 1, "popularity": -2 },
      "result": { "fr": "Le sujet occupe trois jours de plateaux sans vous. Trois jours perdus.",
                  "en": "The story runs for three days without you. Three days lost." } },
    { "label": { "fr": "En rire et raconter le reste vous-même", "en": "Laugh, and tell the rest yourself" },
      "effects": { "poll": 3, "charisme": 1, "popularity": 6, "reputation": -1 },
      "result": { "fr": "Vous ajoutez deux anecdotes pires que celles de l'enquête. On vous trouve humain, ce qui reste le meilleur des démentis.",
                  "en": "You add two anecdotes worse than the ones in the piece. People find you human, which is still the best denial there is." } },
    { "label": { "fr": "Faire sortir une enquête sur l'adversaire", "en": "Have a story published about your opponent" },
      "when": { "personality": ["calculating"] },
      "effects": { "poll": 4, "notoriete": 1, "reputation": -2, "standing": 3, "strike": "casserole" },
      "result": { "fr": "Deux jours plus tard, un autre journal publie autre chose sur quelqu'un d'autre. Personne ne saura jamais qui a commencé.",
                  "en": "Two days later another paper publishes something else about somebody else. Nobody will ever know who started it." } }
  ]
},

{
  "id": "c_financement",
  "moment": 3,
  "tag": { "fr": "Financement", "en": "Funding" },
  "text": {
    "fr": "La campagne coûte plus que prévu. Il manque de quoi tenir les trois dernières semaines d'affichage.",
    "en": "The campaign is costing more than planned. There is not enough to hold the last three weeks of advertising."
  },
  "choices": [
    { "label": { "fr": "Puiser dans votre fortune personnelle", "en": "Dip into your personal fortune" },
      "effects": { "money": -250000, "poll": 5 },
      "result": { "fr": "Vos affiches couvrent le pays jusqu'au dernier jour.",
                  "en": "Your posters cover the country until the final day." } },
    { "label": { "fr": "Lancer un appel aux dons militants", "en": "Call for grassroots donations" },
      "roll": { "stat": "charisme", "base": 12, "dice": 16 },
      "success": { "effects": { "money": 60000, "poll": 3, "standing": 7 },
        "result": { "fr": "Les petits dons affluent. La campagne repart, et elle vous appartient.",
                    "en": "Small donations pour in. The campaign restarts, and it is yours." } },
      "failure": { "effects": { "poll": -3, "standing": -4 },
        "result": { "fr": "L'appel fait un flop. On mesure votre base réelle, et elle est mince.",
                    "en": "The appeal flops. Your real base is measured, and it is thin." } } },
    { "label": { "fr": "Solliciter vos anciens réseaux d'affaires", "en": "Call on your old business network" },
      "when": { "background": ["business"] },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.15 } ] },
      "success": { "effects": { "money": 180000, "poll": 4, "reputation": -1 },
        "result": { "fr": "Cinq chèques en trois jours. On ne vous demandera rien, et ça vous inquiète.",
                    "en": "Five cheques in three days. Nothing is asked of you, which worries you." } },
      "failure": { "effects": { "poll": -2, "reputation": -2 },
        "result": { "fr": "Un donateur parle à la presse. Le financement devient un sujet.",
                    "en": "One donor talks to the press. The funding becomes the story." } } }
  ]
},

{
  "id": "c_derapage",
  "tag": { "fr": "Incident", "en": "Incident" },
  "text": {
    "fr": "Un proche conseiller tient des propos indéfendables devant un micro qu'il croyait coupé.",
    "en": "A close adviser says something indefensible into a microphone he thought was off."
  },
  "choices": [
    { "label": { "fr": "L'écarter immédiatement", "en": "Cut him loose immediately" },
      "effects": { "poll": 1, "reseau": -1, "standing": -5, "popularity": 2 },
      "result": { "fr": "L'incident est clos en six heures. Votre entourage vous regarde autrement.",
                  "en": "The incident is closed in six hours. Your inner circle looks at you differently." } },
    { "label": { "fr": "Le défendre par loyauté", "en": "Defend him out of loyalty" },
      "effects": { "poll": -6, "standing": 8, "reputation": -1 },
      "result": { "fr": "La fidélité vous honore en interne et vous coûte cher dehors.",
                  "en": "The loyalty honours you inside and costs you dearly outside." } },
    { "label": { "fr": "Parler d'un montage sorti de son contexte", "en": "Call it an edit, taken out of context" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "background": ["comms"] }, "value": 0.25 } ] },
      "success": { "effects": { "poll": 2, "standing": 4, "strike": "menteur" },
        "result": { "fr": "Le doute suffit. La séquence disparaît des plateaux au bout de deux jours.",
                    "en": "Doubt is enough. The clip vanishes from the studios within two days." } },
      "failure": { "effects": { "poll": -8, "reputation": -2, "popularity": -6 },
        "result": { "fr": "L'enregistrement complet sort le soir même. Il est pire que l'extrait.",
                    "en": "The full recording surfaces that evening. It is worse than the clip." } } },
    { "label": { "fr": "Le remplacer par quelqu'un de pire, mais discret", "en": "Replace him with someone worse, but quieter" },
      "when": { "personality": ["calculating"] },
      "effects": { "poll": 1, "reseau": 1, "standing": 2, "reputation": -1 },
      "result": { "fr": "Le nouveau pense exactement la même chose et sait où sont les micros.",
                  "en": "The new one thinks exactly the same things and knows where the microphones are." } }
  ]
},

{
  "id": "c_terrain",
  "moment": 2,
  "tag": { "fr": "Dernière ligne droite", "en": "Final stretch" },
  "text": {
    "fr": "Dix jours avant le vote. Vos équipes hésitent entre saturer les plateaux et sillonner le pays.",
    "en": "Ten days to go. Your teams are split between saturating the studios and touring the country."
  },
  "choices": [
    { "label": { "fr": "Les plateaux télé", "en": "The TV studios" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "poll": 4, "notoriete": 1, "energie": -2, "popularity": 5 },
      "result": { "fr": "Vous êtes partout à l'écran. Le nom circule, la fatigue aussi.",
                  "en": "You are everywhere on screen. The name spreads, and so does the exhaustion." } },
    { "label": { "fr": "Le terrain, marché après marché", "en": "The ground, market by market" },
      "effects": { "poll": 3, "reputation": 1, "standing": 5, "energie": -1 },
      "result": { "fr": "Des milliers de mains serrées. Les images sont bonnes, l'effet est lent.",
                  "en": "Thousands of hands shaken. The pictures are good, the effect is slow." } },
    { "label": { "fr": "Acheter la campagne en ligne", "en": "Buy the campaign online" },
      "when": { "minMoney": 200000 },
      "effects": { "poll": 5, "money": -180000, "notoriete": 2, "reputation": -1, "energie": 1 },
      "result": { "fr": "Des vidéos ciblées, découpées par âge et par code postal. Vous ne saurez jamais lesquelles ont marché.",
                  "en": "Targeted videos, cut by age group and postcode. You will never know which ones worked." } },
    { "label": { "fr": "Dormir trois jours et préparer le débat", "en": "Sleep for three days and prepare the debate" },
      "effects": { "poll": -2, "energie": 3, "sangfroid": 1, "eloquence": 1 },
      "result": { "fr": "Vos équipes trouvent l'idée absurde. Vous arrivez au dernier débat reposé, ce qui ne s'était jamais vu.",
                  "en": "Your staff think it is absurd. You arrive at the final debate rested, which has never happened before." } }
  ]
},

{
  "id": "c_programme",
  "tag": { "fr": "Programme", "en": "Manifesto" },
  "text": {
    "fr": "Les économistes réclament un chiffrage. Votre programme coûte cher et tout le monde le sait.",
    "en": "The economists want costings. Your manifesto is expensive and everyone knows it."
  },
  "choices": [
    { "label": { "fr": "Assumer le coût", "en": "Own the cost" },
      "effects": { "poll": 3, "popularity": 4, "standing": -3 },
      "result": { "fr": "« Ça coûte, et alors ? » La franchise plaît plus que la prudence.",
                  "en": "“It costs money, so what?” The bluntness plays better than caution." } },
    { "label": { "fr": "Revoir les promesses à la baisse", "en": "Scale the promises back" },
      "effects": { "poll": -4, "reputation": 1, "standing": 6 },
      "result": { "fr": "Les éditorialistes saluent le sérieux. Vos électeurs, eux, se sentent floués.",
                  "en": "The commentators praise the seriousness. Your voters feel short-changed." } },
    { "label": { "fr": "Publier un chiffrage écrit par un cabinet ami", "en": "Publish costings written by a friendly firm" },
      "when": { "minMoney": 100000 },
      "effects": { "poll": 3, "money": -80000, "eloquence": 1, "reputation": -1 },
      "result": { "fr": "Quatre-vingt-douze pages que personne ne lira, et un tableau que tout le monde citera.",
                  "en": "Ninety-two pages nobody will read, and one table everybody will quote." } },
    { "label": { "fr": "Expliquer qu'on financera par la croissance", "en": "Explain that growth will pay for it" },
      "effects": { "poll": 2, "popularity": 5, "reputation": -2, "standing": 2 },
      "result": { "fr": "L'argument a servi à tous vos prédécesseurs, dans les deux camps, et il fonctionne encore.",
                  "en": "The argument has served all your predecessors, on both sides, and it still works." } }
  ]
},

{
  "id": "c_sondage_choc",
  "tag": { "fr": "Sondage", "en": "Poll" },
  "text": {
    "fr": "Un sondage bouscule la campagne et concentre soudain tous les regards sur vous.",
    "en": "A poll shakes the campaign and suddenly turns every eye towards you."
  },
  "choices": [
    { "label": { "fr": "Changer de ton, tout risquer", "en": "Change tone, risk everything" },
      "roll": { "stat": "charisme", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 6, "popularity": 6 },
        "result": { "fr": "Le virage surprend et fonctionne. La dynamique change de camp.",
                    "en": "The shift surprises and works. The momentum changes sides." } },
      "failure": { "effects": { "poll": -5, "popularity": -5, "standing": -4 },
        "result": { "fr": "Le revirement se voit trop. On parle de panique.",
                    "en": "The U-turn is too visible. People are calling it panic." } } },
    { "label": { "fr": "Tenir la ligne sans dévier", "en": "Hold the line" },
      "effects": { "poll": 1, "sangfroid": 1, "standing": 4, "popularity": -3 },
      "result": { "fr": "Vous ne bougez pas d'un mot. Le calme finit par se voir.",
                  "en": "You do not move an inch. The steadiness eventually shows." } },
    { "label": { "fr": "Contester la méthode du sondage", "en": "Attack the polling method" },
      "effects": { "poll": -2, "notoriete": 1, "standing": 3, "reputation": -1 },
      "result": { "fr": "Vous expliquez ce qu'est un redressement pendant onze minutes. Les gens retiennent le chiffre.",
                  "en": "You explain sample weighting for eleven minutes. People remember the number." } },
    { "label": { "fr": "Commander votre propre sondage", "en": "Commission your own poll" },
      "when": { "minMoney": 80000 },
      "effects": { "poll": 3, "money": -60000, "reseau": 1, "reputation": -1 },
      "result": { "fr": "Les questions sont formulées avec soin. Votre sondage vous donne gagnant, ce qui étonne peu de monde.",
                  "en": "The questions are carefully worded. Your poll has you winning, which surprises very few people." } }
  ]
},

{
  "id": "c_affaire",
  "moment": 3,
  "weight": 5,
  "when": { "flag": { "dirtyMoney": true } },
  "tag": { "fr": "Affaire", "en": "Scandal" },
  "text": {
    "fr": "À trois semaines du scrutin, le financement de vos débuts ressort en une. Le calendrier n'a rien d'un hasard.",
    "en": "Three weeks from the vote, the funding of your early years is back on the front page. The timing is no accident."
  },
  "choices": [
    { "label": { "fr": "Crier au complot", "en": "Cry conspiracy" },
      "effects": { "poll": -3, "notoriete": 1, "standing": 4 },
      "result": { "fr": "Votre camp se resserre autour de vous. Les indécis, eux, s'éloignent.",
                  "en": "Your camp closes ranks. The undecided drift away." } },
    { "label": { "fr": "Tout publier vous-même", "en": "Publish everything yourself" },
      "effects": { "poll": -6, "reputation": 2, "popularity": -4, "flags": { "dirtyMoney": false } },
      "result": { "fr": "Le geste coupe court à l'affaire. Il coûte des points qu'on ne rattrape pas.",
                  "en": "The move ends the story. It costs points you will not get back." } },
    { "label": { "fr": "Sortir un dossier sur l'adversaire le lendemain", "en": "Drop a file on your opponent the next day" },
      "effects": { "poll": 3, "notoriete": 2, "reputation": -2, "strike": "casserole" },
      "result": { "fr": "La campagne devient un échange de dossiers. Les deux camps y perdent, vous un peu moins.",
                  "en": "The campaign turns into an exchange of files. Both sides lose; you lose slightly less." } },
    { "label": { "fr": "Répondre une fois, puis parler d'autre chose", "en": "Answer once, then talk about something else" },
      "effects": { "poll": -1, "sangfroid": 1, "eloquence": 1, "popularity": -2 },
      "result": { "fr": "Une réponse de deux minutes, puis quatre jours de propositions. C'est la seule méthode qui marche, et personne ne l'applique.",
                  "en": "A two-minute answer, then four days of policy. It is the only method that works, and nobody uses it." } }
  ]
},

{
  "id": "c_veille",
  "moment": 1,
  "weight": 3,
  "tag": { "fr": "Veille du scrutin", "en": "Election eve" },
  "text": {
    "fr": "Dernier soir. Il reste une intervention, et rien ne sera plus dit après elle.",
    "en": "The last evening. One appearance remains, and nothing will be said after it."
  },
  "choices": [
    { "label": { "fr": "Un appel solennel au pays", "en": "A solemn address to the country" },
      "roll": { "stat": "eloquence", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 5, "popularity": 5 },
        "result": { "fr": "Le ton est juste. Beaucoup se couchent en ayant choisi.",
                    "en": "The tone is right. Many go to bed having made up their minds." } },
      "failure": { "effects": { "poll": -2 },
        "result": { "fr": "L'exercice est convenu. On l'oublie avant la fin.",
                    "en": "The exercise is conventional. It is forgotten before it ends." } } },
    { "label": { "fr": "Un dernier bain de foule", "en": "One last walkabout" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "poll": 3, "energie": -2, "popularity": 3 },
      "result": { "fr": "Les images de foule tournent en boucle toute la nuit.",
                  "en": "The crowd footage runs on a loop all night." } },
    { "label": { "fr": "Un dernier direct sans filtre", "en": "One last unfiltered live" },
      "when": { "personality": ["provocative"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "notoriete": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "notoriete": 2 },
        "result": { "fr": "Deux heures sans script, sans conseiller. Le pays voit quelqu'un de vrai.",
                    "en": "Two hours with no script, no advisers. The country sees someone real." } },
      "failure": { "effects": { "poll": -6, "reputation": -2 },
        "result": { "fr": "Une phrase de trop, la veille du vote. Le pire moment possible.",
                    "en": "One sentence too many, the night before the vote. The worst possible timing." } } }
  ]
},

{
  "id": "c_attaque_perso",
  "tag": { "fr": "Coup bas", "en": "Below the belt" },
  "text": {
    "fr": "Un adversaire attaque votre vie privée en meeting. La salle rit, les caméras tournent.",
    "en": "An opponent attacks your private life at a rally. The room laughs, the cameras roll."
  },
  "choices": [
    { "label": { "fr": "Répondre sur le même terrain", "en": "Answer in kind" },
      "roll": { "chance": 0.45 },
      "success": { "effects": { "poll": 4, "notoriete": 1 },
        "result": { "fr": "Votre riposte est pire que l'attaque. On ne parle que de ça.",
                    "en": "Your counter is worse than the attack. Nobody talks about anything else." } },
      "failure": { "effects": { "poll": -5, "reputation": -2 },
        "result": { "fr": "La surenchère vous rabaisse tous les deux, et vous plus que lui.",
                    "en": "The escalation diminishes you both, and you more than him." } } },
    { "label": { "fr": "Refuser d'entrer là-dedans", "en": "Refuse to go there" },
      "effects": { "poll": 3, "reputation": 2, "popularity": 4, "notoriete": -1, "standing": -3 },
      "result": { "fr": "« Parlons du pays. » La phrase fait le tour des réseaux.",
                  "en": "“Let's talk about the country.” The line travels everywhere." } },
    { "label": { "fr": "Faire répondre votre famille à votre place", "en": "Have your family answer for you" },
      "effects": { "poll": 2, "popularity": 6, "reputation": -1, "energie": -1 },
      "result": { "fr": "Une tribune signée de vos proches, écrite par votre communicant. Elle est très émouvante.",
                  "en": "An open letter signed by your family, written by your press officer. It is very moving." } },
    { "label": { "fr": "Porter plainte en direct", "en": "Announce a lawsuit on air" },
      "effects": { "poll": -1, "notoriete": 2, "standing": 4, "popularity": -3 },
      "result": { "fr": "La procédure durera plus longtemps que le mandat que vous visez.",
                  "en": "The case will outlast the term you are running for." } }
  ]
},

{
  "id": "c_crise",
  "tag": { "fr": "Crise", "en": "Crisis" },
  "text": {
    "fr": "Une catastrophe frappe le pays en pleine campagne. Tout le monde suspend ses meetings.",
    "en": "A disaster strikes the country mid-campaign. Everyone suspends their rallies."
  },
  "choices": [
    { "label": { "fr": "Suspendre et se rendre sur place", "en": "Suspend and go there" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "poll": 4, "reputation": 2, "energie": -2, "popularity": 6 },
      "result": { "fr": "Vous y êtes avant les autres et vous n'y faites pas de discours.",
                  "en": "You get there before the others, and you make no speech." } },
    { "label": { "fr": "Continuer la campagne discrètement", "en": "Quietly keep campaigning" },
      "effects": { "poll": -4, "reputation": -2, "standing": 3 },
      "result": { "fr": "Vous gagnez trois jours d'avance et une réputation de froideur.",
                  "en": "You gain three days of advantage and a reputation for coldness." } },
    { "label": { "fr": "Financer les secours sur vos fonds de campagne", "en": "Fund the relief effort from campaign money" },
      "when": { "minMoney": 150000 },
      "effects": { "poll": 3, "money": -120000, "reputation": 2, "popularity": 5, "standing": -2 },
      "result": { "fr": "Le chèque est réel, la photo aussi. On vous reprochera surtout la photo.",
                  "en": "The cheque is real; so is the photo. What people will hold against you is mostly the photo." } },
    { "label": { "fr": "Accuser le gouvernement d'impréparation", "en": "Blame the government for being unprepared" },
      "effects": { "poll": 2, "notoriete": 2, "popularity": -4, "reputation": -2, "standing": 4 },
      "result": { "fr": "Vous parlez de responsabilité pendant que les secours travaillent. Une partie du pays trouve que c'est le moment, l'autre non.",
                  "en": "You talk about accountability while the rescue teams work. Half the country thinks it is the moment; the other half does not." } }
  ]
},

{
  "id": "c_parrainages",
  "moment": [6, 4],
  "weight": 3,
  "tag": { "fr": "Les signatures", "en": "The signatures" },
  "text": {
    "fr": "Cinq cents signatures de maires, et le compteur affiche quatre cent douze à trois semaines de la date limite. Ceux qui manquent ne vous doivent rien et savent très exactement ce qu'ils valent.",
    "en": "Five hundred mayors' signatures, and the counter says four hundred and twelve with three weeks to the deadline. The ones you are missing owe you nothing and know exactly what they are worth."
  },
  "choices": [
    { "label": { "fr": "Faire le tour des départements un par un", "en": "Tour the counties one by one" },
      "effects": { "poll": 2, "reseau": 2, "credibilite": 1, "energie": -3 },
      "result": { "fr": "Onze jours de routes départementales et de salles des fêtes. Vous rentrez avec vos signatures et trois cents numéros de portable qui serviront pendant vingt ans.",
                  "en": "Eleven days of back roads and village halls. You come home with your signatures and three hundred mobile numbers that will be useful for twenty years." } },
    { "label": { "fr": "Laisser le parti s'en charger", "en": "Let the party handle it" },
      "effects": { "poll": -1, "standing": -4, "energie": 2 },
      "result": { "fr": "Le siège les trouve en huit jours, parce que c'est son métier. On vous fera remarquer pendant cinq ans que vous n'y étiez pour rien.",
                  "en": "Headquarters finds them in eight days, because that is their job. You will be reminded for five years that you had nothing to do with it." } },
    { "label": { "fr": "Dénoncer publiquement le filtre des parrainages", "en": "Denounce the signature filter in public" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "popularity": 7, "notoriete": 2, "credibilite": -1 },
        "result": { "fr": "Vous transformez une formalité administrative en question démocratique. Les signatures arrivent quand même, apportées par des maires qui n'aiment pas qu'on les prenne pour un guichet.",
                    "en": "You turn an administrative formality into a democratic question. The signatures come anyway, from mayors who dislike being treated as a counter clerk." } },
      "failure": { "effects": { "poll": -4, "popularity": -3, "credibilite": -2 },
        "result": { "fr": "On vous répond que le filtre existait aussi les années où il vous arrangeait. La séquence dure quatre jours et ne parle que de vous.",
                    "en": "You are reminded the filter also existed in the years it suited you. The sequence runs for four days and is about nothing but you." } } },
    { "label": { "fr": "Payer trois équipes pour ratisser le pays", "en": "Pay three teams to comb the country" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -120000, "poll": 3, "energie": 1, "reputation": -1 },
      "result": { "fr": "Quinze salariés, six semaines, et les cinq cents signatures déposées avec quatre jours d'avance. La ligne apparaîtra dans vos comptes de campagne sous un intitulé prudent.",
                  "en": "Fifteen staff, six weeks, and the five hundred signatures filed four days early. The line will appear in your campaign accounts under a careful heading." } }
  ]
},

{
  "id": "c_affiche",
  "moment": [6, 4],
  "tag": { "fr": "L'affiche", "en": "The poster" },
  "text": {
    "fr": "L'affiche officielle et le slogan. Trois agences ont travaillé, il reste trois maquettes sur la table, et tout le monde autour de vous a un avis définitif.",
    "en": "The official poster and the slogan. Three agencies have worked on it, three mock-ups are left on the table, and everybody around you has a final opinion."
  },
  "choices": [
    { "label": { "fr": "Le visage en gros plan, fond uni, un seul mot", "en": "Face in close-up, flat background, one word" },
      "effects": { "poll": 2, "notoriete": 2, "popularity": 2 },
      "result": { "fr": "Cela ne dit rien et cela se retient. C'est exactement ce qu'on demande à une affiche, et personne dans la salle ne l'admettra jamais.",
                  "en": "It says nothing and it sticks. That is exactly what a poster is for, and nobody in the room will ever admit it." } },
    { "label": { "fr": "Une phrase longue, qui dit vraiment ce que vous pensez", "en": "A long sentence that actually says what you think" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 2, "reputation": 1 },
        "result": { "fr": "Douze mots sur fond blanc. On les cite, on les discute, on finit par les retourner contre vous, et c'est le signe qu'ils portent.",
                    "en": "Twelve words on white. They get quoted, argued over, eventually turned against you, which is the proof they land." } },
      "failure": { "effects": { "poll": -3, "popularity": -4, "notoriete": 1 },
        "result": { "fr": "Personne ne la lit en entier. Les caricaturistes, si.",
                    "en": "Nobody reads it to the end. The cartoonists do." } } },
    { "label": { "fr": "Vous au milieu d'une foule, sans slogan", "en": "You in a crowd, no slogan" },
      "effects": { "poll": 1, "popularity": 5, "credibilite": -2 },
      "result": { "fr": "Une image chaleureuse et parfaitement vide. Vos électeurs la trouvent belle, vos adversaires la trouvent commode.",
                  "en": "A warm and perfectly empty image. Your voters find it beautiful; your opponents find it convenient." } },
    { "label": { "fr": "Laisser l'agence choisir la photo qui vous flatte le plus", "en": "Let the agency pick the photo that flatters you most" },
      "when": { "anyTrait": ["beau", "stature", "athletique"] },
      "effects": { "poll": 2, "popularity": 7, "reputation": -1, "credibilite": -1 },
      "result": { "fr": "Deux heures de retouches sur une photo déjà bonne. Elle est partout en quinze jours, et deux personnes seulement remarquent le travail.",
                  "en": "Two hours of retouching on an already good photograph. It is everywhere within a fortnight, and exactly two people notice the work." } }
  ]
},

{
  "id": "c_matinale",
  "weight": 3,
  "tag": { "fr": "La matinale", "en": "The breakfast show" },
  "text": {
    "fr": "Huit heures vingt, la matinale la plus écoutée du pays. Après onze minutes de fond, le journaliste sourit et vous demande le prix d'un ticket de métro.",
    "en": "Twenty past eight, the country's most listened-to breakfast show. After eleven minutes of substance, the interviewer smiles and asks you the price of a metro ticket."
  },
  "choices": [
    { "label": { "fr": "Donner un chiffre et l'assumer", "en": "Give a figure and stand by it" },
      "roll": { "chance": 0.5 },
      "success": { "effects": { "poll": 2, "popularity": 4 },
        "result": { "fr": "Vous tombez juste à dix centimes près. Ce n'est rien du tout et cela vous suit favorablement pendant une semaine.",
                    "en": "You are right to within ten cents. It means nothing at all and it follows you favourably for a week." } },
      "failure": { "effects": { "poll": -5, "popularity": -7, "credibilite": -1 },
        "result": { "fr": "Vous vous trompez de quarante centimes. Le pays en parle jusqu'à jeudi, et personne ne vous demandera plus votre programme d'ici le vote.",
                    "en": "You are off by forty cents. The country talks about it until Thursday, and nobody will ask you about your manifesto again before the vote." } } },
    { "label": { "fr": "Dire que vous ne savez pas, et pourquoi la question est mauvaise", "en": "Say you do not know, and why the question is a poor one" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 15 },
      "success": { "effects": { "poll": 1, "credibilite": 2, "reputation": 2, "popularity": -2 },
        "result": { "fr": "Vous refusez le jeu sans le mépriser, ce qui est plus difficile que d'y répondre. La séquence est reprise comme un moment de franchise.",
                    "en": "You refuse the game without sneering at it, which is harder than answering. The clip goes round as a moment of candour." } },
      "failure": { "effects": { "poll": -3, "popularity": -6 },
        "result": { "fr": "On retient que vous n'avez pas su, et rien de ce que vous avez dit ensuite.",
                    "en": "What sticks is that you did not know, and nothing you said afterwards." } } },
    { "label": { "fr": "Sortir le chiffre exact et enchaîner sur trois autres", "en": "Give the exact figure and add three more" },
      "when": { "anyTrait": ["bosseur", "clairvoyant"] },
      "effects": { "poll": 3, "credibilite": 2, "popularity": 1 },
      "result": { "fr": "Le prix, la hausse depuis cinq ans, et ce que cela représente pour un salaire médian. Le journaliste passe à autre chose plus vite que prévu.",
                  "en": "The price, the rise over five years, and what it means on a median wage. The interviewer moves on faster than planned." } },
    { "label": { "fr": "Retourner la question au journaliste", "en": "Put the question back to the interviewer" },
      "when": { "personality": ["provocative"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 2, "popularity": 8, "notoriete": 2, "reputation": -1 },
        "result": { "fr": "Il ne sait pas non plus. Les huit secondes de silence qui suivent sont vues quatre millions de fois avant midi.",
                    "en": "He does not know either. The eight seconds of silence that follow are watched four million times before lunch." } },
      "failure": { "effects": { "poll": -4, "popularity": -5, "reputation": -1 },
        "result": { "fr": "Il connaît le chiffre, et il le donne. Vous passez le reste de l'entretien à réparer les trente secondes précédentes.",
                    "en": "He knows the figure, and he gives it. You spend the rest of the interview repairing the previous thirty seconds." } } }
  ]
},

{
  "id": "c_salon",
  "weight": 3,
  "tag": { "fr": "Le Salon", "en": "The farm show" },
  "text": {
    "fr": "Le Salon de l'agriculture. Huit heures dans les allées, une vache à tapoter toutes les vingt minutes, et une caméra qui attend patiemment le moment où vous ne saurez plus quoi dire.",
    "en": "The agricultural show. Eight hours in the aisles, a cow to pat every twenty minutes, and a camera waiting patiently for the moment you run out of things to say."
  },
  "choices": [
    { "label": { "fr": "Y passer la journée entière, sans raccourci", "en": "Stay the whole day, no shortcuts" },
      "effects": { "poll": 2, "popularity": 6, "standing": 2, "energie": -3 },
      "result": { "fr": "Neuf heures, quatorze stands, deux verres de trop et pas une phrase de travers. C'est le genre de journée qui ne fait aucun titre et qui se voit dans les urnes.",
                  "en": "Nine hours, fourteen stands, two drinks too many and not one wrong sentence. It is the kind of day that makes no headline and shows up in the ballot boxes." } },
    { "label": { "fr": "Une heure, les photos, et repartir", "en": "One hour, the photographs, and out" },
      "effects": { "poll": -2, "popularity": -4, "energie": 1 },
      "result": { "fr": "Vous repartez à onze heures. La photo est bonne, la vidéo de votre départ l'est encore plus, et elle circule tout l'après-midi.",
                  "en": "You leave at eleven. The photograph is good, the video of your departure is better, and it circulates all afternoon." } },
    { "label": { "fr": "Annoncer une mesure agricole au milieu des allées", "en": "Announce a farm policy in the middle of the aisles" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "credibilite": 1, "popularity": 3, "energie": -2 },
        "result": { "fr": "Chiffrée, datée, et défendue debout devant quarante personnes qui connaissent le dossier. On en parle deux jours, sérieusement.",
                    "en": "Costed, dated, and defended standing up in front of forty people who know the file. It is discussed for two days, seriously." } },
      "failure": { "effects": { "poll": -3, "credibilite": -2, "reputation": -1, "energie": -2 },
        "result": { "fr": "La mesure est démontée en direct par un syndicaliste qui maîtrise le sujet mieux que vous. L'échange dure six minutes et passe en boucle.",
                    "en": "The policy is taken apart live by a union man who knows the subject better than you. The exchange lasts six minutes and plays on a loop." } } },
    { "label": { "fr": "Parler de vos grands-parents, et le penser vraiment", "en": "Talk about your grandparents, and mean it" },
      "when": { "origin": ["modest"] },
      "effects": { "poll": 2, "popularity": 7, "reputation": 1, "energie": -1 },
      "result": { "fr": "Vous racontez une ferme de dix-huit hectares et ce qu'elle est devenue. Ce n'est pas une séquence de campagne, et c'est pour ça qu'elle marche.",
                  "en": "You describe an eighteen-hectare farm and what became of it. It is not a campaign moment, which is exactly why it works." } }
  ]
},

{
  "id": "c_usine",
  "moment": 3,
  "tag": { "fr": "L'usine", "en": "The factory" },
  "text": {
    "fr": "Une usine de quatre cents personnes annonce sa fermeture à trois semaines du vote. Les salariés vous attendent au portail, et les caméras aussi.",
    "en": "A factory employing four hundred people announces its closure three weeks before the vote. The workers are waiting at the gate, and so are the cameras."
  },
  "choices": [
    { "label": { "fr": "Y aller et monter sur le piquet", "en": "Go, and get up on the picket" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "popularity": 8, "credibilite": -1, "energie": -2 },
        "result": { "fr": "Quatre cents personnes, un mégaphone qui grésille, et douze minutes qui font le journal de vingt heures. Personne ne vous demande le financement.",
                    "en": "Four hundred people, a crackling megaphone, and twelve minutes that lead the evening news. Nobody asks you how it would be paid for." } },
      "failure": { "effects": { "poll": -3, "popularity": -5, "reputation": -1, "energie": -2 },
        "result": { "fr": "On vous demande ce que vous ferez, concrètement, lundi. Vous n'avez que des mots et la question reste dans l'air jusqu'au vote.",
                    "en": "You are asked what you would actually do, on Monday. You have only words, and the question hangs there until the vote." } } },
    { "label": { "fr": "Y aller, écouter, et ne rien promettre", "en": "Go, listen, and promise nothing" },
      "effects": { "poll": 1, "popularity": 3, "credibilite": 2, "reputation": 1, "energie": -1 },
      "result": { "fr": "Trois heures sans un mot de trop. Les salariés repartent sans rien, ce qu'ils avaient prévu, et sans mépris, ce qu'ils n'avaient pas prévu.",
                  "en": "Three hours without a single word too many. The workers leave with nothing, which they expected, and without contempt, which they did not." } },
    { "label": { "fr": "Ne pas y aller et recevoir les délégués", "en": "Stay away and receive the shop stewards" },
      "effects": { "poll": -2, "popularity": -4, "credibilite": 1, "standing": 2, "energie": 1 },
      "result": { "fr": "Une heure et quart dans un bureau, sans caméra. C'est plus utile pour eux et beaucoup moins pour vous, et ce déséquilibre-là dit tout du métier.",
                  "en": "An hour and a quarter in an office, no cameras. It is more use to them and far less to you, and that imbalance says everything about the trade." } },
    { "label": { "fr": "Expliquer pourquoi l'usine ferme, vraiment", "en": "Explain why the factory is really closing" },
      "when": { "background": ["business"] },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 2, "credibilite": 3, "reputation": 2, "popularity": -3 },
        "result": { "fr": "Vous dites la vérité sur un plateau et on ne vous coupe pas. Une partie du pays vous trouve dur, une autre note que vous ne mentez pas.",
                    "en": "You tell the truth on air and nobody cuts you off. Part of the country finds you hard; another part notes that you are not lying." } },
      "failure": { "effects": { "poll": -5, "popularity": -8, "credibilite": -1 },
        "result": { "fr": "La phrase est juste et sonne comme du mépris. Elle sera reprise sans son contexte jusqu'au dimanche du premier tour.",
                    "en": "The sentence is accurate and sounds like contempt. It will be replayed without its context until first-round Sunday." } } }
  ]
},

{
  "id": "c_outre_mer",
  "tag": { "fr": "Déplacement", "en": "The long trip" },
  "text": {
    "fr": "Trois jours outre-mer : huit mille kilomètres, quatre déplacements, et deux minutes au journal de vingt heures si l'actualité métropolitaine le permet.",
    "en": "Three days overseas: eight thousand kilometres, four visits, and two minutes on the evening news if the mainland allows it."
  },
  "choices": [
    { "label": { "fr": "Faire le déplacement complet", "en": "Do the whole trip" },
      "effects": { "poll": 2, "standing": 3, "reputation": 1, "popularity": 2, "energie": -3 },
      "result": { "fr": "Quatre-vingt-dix pour cent de ce que vous direz là-bas ne sera pas diffusé. Les dix pour cent restants seront entendus par des gens dont personne d'autre ne s'occupe.",
                  "en": "Ninety per cent of what you say there will never be broadcast. The remaining ten will be heard by people nobody else bothers with." } },
    { "label": { "fr": "Envoyer un proche et enregistrer un message", "en": "Send a lieutenant and record a message" },
      "effects": { "poll": -1, "standing": -2, "popularity": -2, "energie": 1 },
      "result": { "fr": "Le message dure quatre minutes et commence par « je regrette de ne pas être parmi vous ». Personne n'est dupe et tout le monde fait comme si.",
                  "en": "The message runs four minutes and opens with “I am sorry not to be with you”. Nobody is fooled and everybody plays along." } },
    { "label": { "fr": "Annuler et rester en métropole", "en": "Cancel and stay on the mainland" },
      "effects": { "poll": 1, "standing": -3, "reputation": -2, "energie": 2 },
      "result": { "fr": "Vous gagnez trois jours de campagne utile et vous perdez un argument que vous ne pourrez plus jamais utiliser.",
                  "en": "You gain three days of useful campaigning and lose an argument you will never be able to use again." } }
  ]
},

{
  "id": "c_pacte",
  "cast": "minor",
  "when": { "allied": false },
  "moment": 4,
  "tag": { "fr": "Le pacte", "en": "The pact" },
  "text": {
    "fr": "{rival} dirige un parti voisin qui plafonne à cinq pour cent et le sait. {Il} vous propose un marché : plus une attaque d'ici dimanche, un appel à voter pour vous au second tour, et vous reprenez trois de ses mesures dans votre programme.",
    "en": "{rival} leads a neighbouring party stuck at five per cent and knows it. {He} offers a deal: no more attacks before Sunday, an endorsement in the runoff, and you take three of {his} policies into your manifesto."
  },
  "choices": [
    { "label": { "fr": "Signer le pacte", "en": "Sign the pact" },
      "effects": { "alliance": "scene", "poll": 3, "standing": -4, "reputation": -1,
                   "landscape": { "self": 0.5 } },
      "result": { "fr": "Deux communiqués à la même heure et une photo de poignée de main que vous regretterez peut-être. Ses électeurs, eux, iront vraiment jusqu'au bout.",
                  "en": "Two statements at the same hour and a handshake photograph you may come to regret. {His} voters, though, will genuinely go the distance." } },
    { "label": { "fr": "Reprendre ses mesures sans rien signer", "en": "Take the policies and sign nothing" },
      "effects": { "poll": 2, "reputation": -2, "reseau": -2 },
      "result": { "fr": "Vous prenez ce qui vous intéresse et vous ne rendez rien. {Il} le dira partout, et {il} aura raison.",
                  "en": "You take what suits you and give nothing back. {He} will say so everywhere, and {he} will be right." } },
    { "label": { "fr": "Refuser : vous ne devrez rien à personne", "en": "Refuse: you will owe nobody anything" },
      "effects": { "poll": -1, "credibilite": 2, "reputation": 2, "standing": 3 },
      "result": { "fr": "Vous expliquez que votre camp n'a besoin de personne. C'est faux, et cela se vérifiera au second tour.",
                  "en": "You explain that your side needs nobody. It is untrue, and it will be demonstrated in the runoff." } }
  ]
},

{
  "id": "c_famille",
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "Un magazine propose une double page sur votre vie privée. Votre entourage y est très favorable, les gens qui figureraient sur les photos un peu moins.",
    "en": "A magazine offers a double-page spread on your private life. Your team is strongly in favour; the people who would be in the photographs rather less so."
  },
  "choices": [
    { "label": { "fr": "Accepter et poser en famille", "en": "Accept and pose with the family" },
      "effects": { "poll": 3, "popularity": 7, "credibilite": -2, "reputation": -1 },
      "result": { "fr": "Les photos sont belles et tout le monde y est consentant, à peu près. Elles ressortiront à chaque mauvaise semaine des dix prochaines années.",
                  "en": "The photographs are lovely and everybody consented, more or less. They will resurface in every bad week of the next ten years." } },
    { "label": { "fr": "Refuser catégoriquement", "en": "Refuse outright" },
      "effects": { "poll": -1, "popularity": -2, "reputation": 2, "credibilite": 1 },
      "result": { "fr": "Vous dites non une fois et vous vous y tenez. Le magazine sortira le papier quand même, sans les photos et avec plus de méchanceté.",
                  "en": "You say no once and you hold to it. The magazine will run the piece anyway, without the photographs and with more malice." } },
    { "label": { "fr": "Y aller seul, sans personne d'autre", "en": "Do it alone, with nobody else" },
      "effects": { "poll": 1, "popularity": 2, "credibilite": 1, "energie": -1 },
      "result": { "fr": "Six pages sur votre enfance et pas un visage qui n'ait choisi d'être là. C'est le compromis le plus cher et le seul qui se défende.",
                  "en": "Six pages on your childhood and not one face that did not choose to be there. It is the most expensive compromise and the only defensible one." } }
  ]
}

],

"runoff": [

/* ==========================================================================
   L'ENTRE-DEUX-TOURS
   ==========================================================================
   Quinze jours à deux. L'effet "poll" ne déplace plus un champ de sept
   candidats mais un face-à-face qui fait cent pour cent : ce que l'un prend,
   l'autre le perd. Les amplitudes affichées sont donc plus grosses que ce
   qu'elles valent une fois passées dans le moteur, qui divise par deux.

   {rival} désigne le finaliste d'en face. Les scènes qui parlent d'un battu
   du premier tour portent "cast": "eliminated", et {rival} désigne alors le
   plus gros des éliminés, celui dont les voix décident.
   ========================================================================== */

{
  "id": "r_debat",
  "moment": 1,
  "required": true,
  "weight": 5,
  "tag": { "fr": "Le débat d'entre-deux-tours", "en": "The runoff debate" },
  "text": {
    "fr": "Le débat. Deux fauteuils, une table, deux heures trente sans montage et sans public. Personne, depuis que la Cinquième République existe, n'a jamais réussi à faire croire que cette soirée-là ne comptait pas.",
    "en": "The debate. Two chairs, one table, two and a half hours with no editing and no audience. Nobody, in the entire history of the Republic, has ever managed to pretend this evening did not matter."
  },
  "choices": [
    { "label": { "fr": "Attaquer son bilan, dossier par dossier", "en": "Attack the record, file by file" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "popularity": 3, "energie": -2 },
        "result": { "fr": "Vous sortez quatre chiffres qu'{il} ne peut pas contester et {il} met vingt minutes à s'en remettre. Le lendemain, les éditorialistes comptent les points et vous les donnent.",
                    "en": "You produce four figures {he} cannot contest and {he} takes twenty minutes to recover. The next morning the commentators count the points and give them to you." } },
      "failure": { "effects": { "poll": -6, "popularity": -4, "credibilite": -1, "energie": -2 },
        "result": { "fr": "Vous êtes précis et illisible. Le pays regarde deux personnes se disputer des annexes budgétaires et retient qu'il n'aime ni l'une ni l'autre.",
                    "en": "You are precise and unreadable. The country watches two people argue over budget annexes and concludes it likes neither of them." } } },
    { "label": { "fr": "Tenir la hauteur et ne jamais l'interrompre", "en": "Hold the high ground and never interrupt" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "credibilite": 3, "reputation": 2, "energie": -1 },
        "result": { "fr": "Deux heures trente sans hausser la voix une seule fois. À la fin, l'un des deux avait l'air d'être déjà en fonction, et ce n'était pas {lui}.",
                    "en": "Two and a half hours without raising your voice once. By the end, one of the two looked like they already held the office, and it was not {him}." } },
      "failure": { "effects": { "poll": -5, "popularity": -3, "energie": -1 },
        "result": { "fr": "La retenue passe pour de l'absence. On vous trouve mou, et la mollesse ne se rattrape pas en cinq jours.",
                    "en": "Restraint reads as absence. You come across as soft, and softness cannot be fixed in five days." } } },
    { "label": { "fr": "Chercher la phrase qui restera", "en": "Go looking for the line that lasts" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 18 },
      "success": { "effects": { "poll": 9, "notoriete": 3, "popularity": 7, "energie": -2 },
        "result": { "fr": "Onze mots, à vingt-deux heures quarante. Ils seront dans les manuels et personne ne se souviendra du reste de la soirée.",
                    "en": "Eleven words, at twenty to eleven. They will be in the textbooks and nobody will remember the rest of the evening." } },
      "failure": { "effects": { "poll": -8, "popularity": -6, "reputation": -1, "energie": -2 },
        "result": { "fr": "La formule était préparée et cela s'entend. {Il} la reprend en souriant, et c'est cette reprise-là qu'on repassera en boucle.",
                    "en": "The line was prepared and it shows. {He} throws it back with a smile, and it is that reply which will play on a loop." } } },
    { "label": { "fr": "Lire vos fiches et ne prendre aucun risque", "en": "Read your notes and take no risks" },
      "effects": { "poll": 1, "credibilite": 1, "popularity": -3, "energie": 1 },
      "result": { "fr": "Vous ne perdez pas le débat. Vous ne le gagnez pas non plus, et il ne vous restait plus que celui-là.",
                  "en": "You do not lose the debate. You do not win it either, and it was the last one you had left." } },
    { "label": { "fr": "{Le} pousser à la faute sur ce que vous savez", "en": "Push {him} into a mistake on what you know" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 8, "notoriete": 2, "reputation": -1, "energie": -2 },
        "result": { "fr": "Trois questions anodines, puis la quatrième. {Il} hésite une seconde de trop devant vingt millions de personnes qui ont toutes vu la même seconde.",
                    "en": "Three harmless questions, then the fourth. {He} hesitates one second too long in front of twenty million people who all saw the same second." } },
      "failure": { "effects": { "poll": -7, "reputation": -2, "popularity": -4 },
        "result": { "fr": "{Il} avait prévu la question et la réponse. C'est vous qui avez l'air de fouiller les poubelles, en direct, pendant quatre minutes.",
                    "en": "{He} had the question and the answer ready. It is you who looks like you are going through the bins, live, for four minutes." } } },
    { "label": { "fr": "Ne parler que du pays, et jamais de votre adversaire", "en": "Talk only about the country, never about your opponent" },
      "when": { "personality": ["principled"] },
      "effects": { "poll": 3, "credibilite": 2, "reputation": 3, "popularity": 2, "energie": -2 },
      "result": { "fr": "Deux heures trente sans prononcer son nom une seule fois. Ce n'est pas une tactique, ce qui est précisément ce qui la rend efficace.",
                  "en": "Two and a half hours without saying the name once. It is not a tactic, which is exactly what makes it work." } }
  ]
},

{
  "id": "r_ralliement",
  "cast": "eliminated",
  "moment": [3, 2],
  "weight": 3,
  "tag": { "fr": "Ralliement", "en": "Endorsement" },
  "text": {
    "fr": "Éliminé{e} dimanche, {rival} hésite encore à appeler à voter pour vous. Ses électeurs sont exactement ceux qui vous manquent, et {il} le sait aussi bien que vous.",
    "en": "Knocked out on Sunday, {rival} is still hesitating to endorse you. {His} voters are exactly the ones you are missing, and {he} knows it as well as you do."
  },
  "choices": [
    { "label": { "fr": "Promettre un grand ministère", "en": "Promise a top ministry" },
      "effects": { "poll": 4, "standing": -8, "reputation": -1 },
      "result": { "fr": "Le ralliement est annoncé le soir même. Le marchandage a fuité le lendemain.",
                  "en": "The endorsement is announced that evening. The deal leaked the next day." } },
    { "label": { "fr": "Ne rien promettre", "en": "Promise nothing" },
      "effects": { "poll": -2, "reputation": 2, "popularity": 3 },
      "result": { "fr": "Pas de soutien, mais pas de dette. Vous restez propre, et il vous manque toujours ces voix-là.",
                  "en": "No endorsement, but no debt. You stay clean, and you are still short of those votes." } },
    { "label": { "fr": "Reprendre trois de ses idées dans votre discours", "en": "Take three of {his} ideas into your speech" },
      "effects": { "poll": 3, "eloquence": 1, "reputation": -1, "standing": 2 },
      "result": { "fr": "{Il} n'appelle pas à voter pour vous, mais ses électeurs entendent leurs propres mots dans votre bouche, et une partie suffit.",
                  "en": "{He} does not endorse you, but {his} voters hear their own words coming out of your mouth, and a fraction of them is enough." } },
    { "label": { "fr": "Lui rappeler ce que vous savez sur {lui}", "en": "Remind {him} what you know" },
      "when": { "trait": ["casserole"] },
      "effects": { "poll": 5, "standing": 4, "reputation": -2, "reseau": -1 },
      "result": { "fr": "Le ralliement tombe le lendemain matin, avec un sourire qui ne trompe personne.",
                  "en": "The endorsement comes the next morning, with a smile that fools nobody." } }
  ]
},

{
  "id": "r_front",
  "weight": 3,
  "tag": { "fr": "Le front", "en": "The wall" },
  "text": {
    "fr": "Des gens qui vous combattent depuis toujours appellent à voter pour vous, en prenant bien soin de préciser que ce n'est pas un soutien. On vous demande, en direct, si vous les remerciez.",
    "en": "People who have fought you all their lives call for a vote for you, taking great care to specify that it is not an endorsement. You are asked, live, whether you thank them."
  },
  "choices": [
    { "label": { "fr": "Remercier, sobrement", "en": "Thank them, soberly" },
      "effects": { "poll": 3, "standing": -5, "reputation": 1 },
      "result": { "fr": "Deux phrases, pas une de plus. Votre base trouve que c'est déjà deux de trop et vous le dira pendant cinq ans.",
                  "en": "Two sentences, not one more. Your base thinks that is two too many and will say so for five years." } },
    { "label": { "fr": "Dire que vous ne devez rien à personne", "en": "Say you owe nobody anything" },
      "effects": { "poll": -4, "standing": 7, "popularity": 2, "credibilite": -1 },
      "result": { "fr": "La salle applaudit debout. Dehors, quelques centaines de milliers de gens qui allaient se déplacer pour vous décident de rester chez eux.",
                  "en": "The hall gives you a standing ovation. Outside, a few hundred thousand people who were going to turn out for you decide to stay home." } },
    { "label": { "fr": "Aller les chercher franchement, et le dire", "en": "Go after them openly, and say so" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "standing": -8 },
        "result": { "fr": "Vous dites tout haut que vous avez besoin de voix qui ne vous aiment pas, et que vous ne leur devrez que le respect. C'est la phrase la plus adulte de la campagne.",
                    "en": "You say out loud that you need votes from people who do not like you, and that you will owe them nothing but respect. It is the most grown-up sentence of the campaign." } },
      "failure": { "effects": { "poll": -5, "standing": -6, "reputation": -1 },
        "result": { "fr": "Cela s'entend comme un aveu de faiblesse et se lit comme une reddition. Les deux camps y trouvent leur compte, et pas vous.",
                    "en": "It sounds like an admission of weakness and reads as a surrender. Both camps get something out of it, and you do not." } } }
  ]
},

{
  "id": "r_matignon",
  "moment": 2,
  "weight": 3,
  "tag": { "fr": "Matignon", "en": "The prime minister" },
  "text": {
    "fr": "Votre entourage vous pousse à annoncer qui serait votre Premier ministre. Un nom rassure, un nom engage, et un nom prend la moitié de la lumière qui vous reste.",
    "en": "Your team is pushing you to name who would be your prime minister. A name reassures, a name commits, and a name takes half of what light you have left."
  },
  "choices": [
    { "label": { "fr": "Annoncer une figure de votre camp", "en": "Name a figure from your own side" },
      "effects": { "poll": 2, "standing": 6, "credibilite": 1, "popularity": 1 },
      "result": { "fr": "Le parti respire, l'appareil se met en ordre de bataille, et le pays apprend un nom qu'il connaissait déjà.",
                  "en": "The party breathes out, the machine falls into line, and the country learns a name it already knew." } },
    { "label": { "fr": "Annoncer quelqu'un de l'autre bord", "en": "Name somebody from the other side" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "notoriete": 2, "standing": -7 },
        "result": { "fr": "Le nom tombe un mercredi soir et change la nature de la semaine. Une partie du pays se dit qu'après tout, ce ne sera peut-être pas si terrible.",
                    "en": "The name lands on a Wednesday evening and changes the nature of the week. Part of the country decides it might not be so terrible after all." } },
      "failure": { "effects": { "poll": -5, "standing": -9, "reputation": -1 },
        "result": { "fr": "L'intéressé dément dans l'heure. Vous avez perdu un jour, un allié possible et une partie de votre propre camp.",
                    "en": "The person denies it within the hour. You have lost a day, a possible ally, and part of your own side." } } },
    { "label": { "fr": "Ne rien annoncer du tout", "en": "Announce nothing at all" },
      "effects": { "poll": -1, "credibilite": 1, "standing": 2, "energie": 1 },
      "result": { "fr": "Vous répondez qu'on verra dimanche soir. C'est la seule réponse constitutionnellement exacte et la plus décevante des trois.",
                  "en": "You reply that we will see on Sunday evening. It is the only constitutionally accurate answer and the most disappointing of the three." } }
  ]
},

{
  "id": "r_dossier",
  "moment": [3, 2],
  "tag": { "fr": "L'affaire", "en": "The file" },
  "text": {
    "fr": "Quarante-huit heures après le premier tour, un dossier vous concernant refait surface, sorti par des gens qui n'avaient plus rien à perdre. Le calendrier n'a rien d'un hasard, et cela ne change rien à ce qu'il y a dedans.",
    "en": "Forty-eight hours after the first round, a file about you resurfaces, put out by people with nothing left to lose. The timing is no accident, and that changes nothing about what is in it."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point, tout de suite", "en": "Answer point by point, immediately" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 2, "reputation": 1, "energie": -2 },
        "result": { "fr": "Quarante minutes de conférence de presse et pas une question esquivée. L'affaire meurt le jeudi, ce qui est le mieux qu'on puisse en attendre.",
                    "en": "Forty minutes of press conference and not one question dodged. The story dies on Thursday, which is the best anyone could hope for." } },
      "failure": { "effects": { "poll": -6, "reputation": -2, "credibilite": -1, "energie": -2 },
        "result": { "fr": "Vous répondez à onze accusations et vous en confirmez deux sans le vouloir. Ce sont ces deux-là qu'on retiendra.",
                    "en": "You answer eleven accusations and accidentally confirm two of them. Those two are the ones that will be remembered." } } },
    { "label": { "fr": "Attaquer ceux qui l'ont sorti", "en": "Go after the people who put it out" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "popularity": 5, "reputation": -1 },
        "result": { "fr": "Vous déplacez le sujet du dossier vers ceux qui l'ont sorti, et le pays vous suit. Ce n'est pas de la vérité, c'est de la campagne.",
                    "en": "You move the story from the file to the people who leaked it, and the country follows. This is not truth, it is campaigning." } },
      "failure": { "effects": { "poll": -7, "popularity": -5, "credibilite": -2 },
        "result": { "fr": "S'en prendre au messager quand le message est sourcé ne marche jamais deux fois. Vous venez d'essayer une fois de trop.",
                    "en": "Attacking the messenger when the message is sourced never works twice. You have just tried once too often." } } },
    { "label": { "fr": "Ne rien dire et parler d'autre chose pendant dix jours", "en": "Say nothing and talk about something else for ten days" },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.25 } ] },
      "success": { "effects": { "poll": 1, "energie": -1 },
        "result": { "fr": "Vous ne prononcez pas une fois le mot. Au bout de six jours, les rédactions passent à autre chose parce qu'il n'y a rien à filmer.",
                    "en": "You never once say the word. After six days the newsrooms move on, because there is nothing to film." } },
      "failure": { "effects": { "poll": -5, "reputation": -1, "popularity": -3 },
        "result": { "fr": "Le silence tient quatre jours, puis on ne vous pose plus que cette question-là. Vous finissez par répondre, mal, un vendredi soir.",
                    "en": "The silence holds four days, then it is the only question you are asked. You end up answering, badly, on a Friday evening." } } }
  ]
},

{
  "id": "r_meeting_final",
  "moment": 2,
  "weight": 3,
  "tag": { "fr": "Le dernier meeting", "en": "The final rally" },
  "text": {
    "fr": "Le dernier meeting. Vingt mille places, une captation nationale, et la dernière fois que vous parlerez devant un public avant que le pays ne décide.",
    "en": "The final rally. Twenty thousand seats, a national broadcast, and the last time you will speak to a crowd before the country decides."
  },
  "choices": [
    { "label": { "fr": "Un discours tourné vers ceux qui n'ont pas voté pour vous", "en": "A speech aimed at the people who did not vote for you" },
      "effects": { "poll": 3, "credibilite": 2, "standing": -3, "energie": -2 },
      "result": { "fr": "Quarante minutes à parler à des gens qui ne sont pas dans la salle. Ceux qui y sont applaudissent moins fort, et ce sont les autres qui votent dimanche.",
                  "en": "Forty minutes addressing people who are not in the room. The ones who are clap less loudly, and it is the others who vote on Sunday." } },
    { "label": { "fr": "Un discours pour les vôtres, qui en ont besoin", "en": "A speech for your own, who need one" },
      "effects": { "poll": 0, "standing": 7, "popularity": 2, "energie": -2 },
      "result": { "fr": "La salle est debout pendant les onze dernières minutes. Ils tiendront jusqu'à dimanche et ils iront chercher leurs voisins, ce qui n'est pas rien.",
                  "en": "The hall is on its feet for the last eleven minutes. They will hold out until Sunday and go and fetch their neighbours, which is not nothing." } },
    { "label": { "fr": "Un discours court, et sortir sous les applaudissements", "en": "A short speech, and leave on the applause" },
      "roll": { "base": 13, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "popularity": 6, "notoriete": 1, "energie": -1 },
        "result": { "fr": "Dix-huit minutes, pas une de plus, et une sortie que les chaînes repassent en boucle parce qu'elle est courte et qu'elle est belle.",
                    "en": "Eighteen minutes, not one more, and an exit the channels replay on a loop because it is short and it is beautiful." } },
      "failure": { "effects": { "poll": -4, "popularity": -3, "standing": -3, "energie": -1 },
        "result": { "fr": "Vingt mille personnes ont fait deux heures de route pour dix-huit minutes. Elles le disent aux journalistes en sortant.",
                    "en": "Twenty thousand people drove two hours for eighteen minutes. They tell the reporters so on the way out." } } }
  ]
},

{
  "id": "r_terrain",
  "tag": { "fr": "Quinze jours", "en": "A fortnight" },
  "text": {
    "fr": "Quinze jours, et deux façons de les dépenser : les plateaux, où l'on parle à ceux qui écoutent déjà, ou les marchés d'un département que vous avez perdu de douze points dimanche.",
    "en": "A fortnight, and two ways to spend it: the studios, where you talk to people already listening, or the markets of a county you lost by twelve points on Sunday."
  },
  "choices": [
    { "label": { "fr": "Les plateaux, tous les jours", "en": "The studios, every day" },
      "effects": { "poll": 1, "notoriete": 2, "popularity": -1, "energie": -2 },
      "result": { "fr": "Vingt-deux interventions en douze jours. Vous saturez l'espace et vous ne convainquez à peu près personne de nouveau.",
                  "en": "Twenty-two appearances in twelve days. You saturate the space and convert almost nobody new." } },
    { "label": { "fr": "Le terrain, là où vous avez perdu", "en": "The ground, where you lost" },
      "effects": { "poll": 3, "popularity": 4, "credibilite": 1, "energie": -3 },
      "result": { "fr": "Onze marchés, quatre gares, et beaucoup de gens qui vous disent en face pourquoi ils ont voté ailleurs. Une partie viendra quand même dimanche.",
                  "en": "Eleven markets, four stations, and a lot of people telling you to your face why they voted elsewhere. Some of them will turn out on Sunday anyway." } },
    { "label": { "fr": "Ni l'un ni l'autre : préparer le débat", "en": "Neither: prepare for the debate" },
      "effects": { "poll": -1, "sangfroid": 1, "credibilite": 1, "energie": 2 },
      "result": { "fr": "Six jours enfermé avec quatre personnes et deux mille pages. Vous perdez du terrain cette semaine pour en gagner une soirée, ce qui est un pari raisonnable.",
                  "en": "Six days locked away with four people and two thousand pages. You lose ground this week to gain one evening, which is a reasonable bet." } }
  ]
},

{
  "id": "r_abstention",
  "tag": { "fr": "Ceux qui ne viendront pas", "en": "The ones who will not come" },
  "text": {
    "fr": "Les instituts annoncent une abstention record pour un second tour. Ce ne sont pas vos électeurs qui hésitent à se déplacer, ce sont ceux qui devraient vous rejoindre et n'en ont aucune envie.",
    "en": "The pollsters forecast record abstention for a runoff. It is not your own voters hesitating to turn out, it is the ones who ought to join you and cannot face it."
  },
  "choices": [
    { "label": { "fr": "Faire peur : dire ce qui arrive si vous perdez", "en": "Frighten them: say what happens if you lose" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 5, "popularity": -2, "reputation": -1 },
        "result": { "fr": "Trois minutes très noires, très efficaces, reprises partout. Vous gagnez des voix que vous n'aurez jamais le droit de revendiquer.",
                    "en": "Three very dark, very effective minutes, replayed everywhere. You gain votes you will never have the right to claim as your own." } },
      "failure": { "effects": { "poll": -5, "popularity": -5, "credibilite": -2 },
        "result": { "fr": "On vous répond qu'on vous entend dire la même chose depuis vingt ans. C'est faux et cela marche, et ce sont les deux à la fois qui font mal.",
                    "en": "You are told you have been saying the same thing for twenty years. It is untrue and it works, and it is both at once that hurts." } } },
    { "label": { "fr": "Donner une raison de voter pour vous, pas contre {lui}", "en": "Give them a reason to vote for you, not against {him}" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "reputation": 2, "energie": -2 },
        "result": { "fr": "Vous passez dix jours à parler de ce que vous ferez plutôt que de ce qu'{il} ferait. C'est plus difficile, plus lent, et cela tient jusqu'au bout.",
                    "en": "You spend ten days talking about what you would do rather than what {he} would do. It is harder, slower, and it holds all the way." } },
      "failure": { "effects": { "poll": -3, "popularity": -3, "energie": -2 },
        "result": { "fr": "Le programme est bon et personne ne l'écoute. À ce stade, le pays ne veut plus qu'on lui explique, il veut qu'on lui parle.",
                    "en": "The manifesto is good and nobody is listening. At this stage the country no longer wants explaining to; it wants speaking to." } } },
    { "label": { "fr": "Mettre toute la machine sur le porte-à-porte", "en": "Put the whole machine on the doorsteps" },
      "effects": { "poll": 2, "standing": 4, "reseau": 1, "energie": -3 },
      "result": { "fr": "Quatre-vingt mille portes en dix jours. Ce n'est pas spectaculaire, cela ne passe à aucun journal, et c'est la seule chose ici qui se mesure.",
                  "en": "Eighty thousand doors in ten days. It is not spectacular, it leads no bulletin, and it is the only thing here that can actually be measured." } }
  ]
}

],

"nomination": [

/* ==========================================================================
   QUAND L'APPAREIL REFUSE DE VOUS INVESTIR
   ==========================================================================
   Ces cartes remplacent le bouton unique « travailler l'appareil », qui
   transformait un moment de carrière en formalité. Elles ne se tirent que
   lorsque la cote au parti est trop basse pour concourir, et elles rapportent
   toutes de la cote, mais jamais de la même façon ni au même prix.
   ========================================================================== */

{
  "id": "investiture_barons",
  "weight": 4,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "La commission a tranché sans vous. Restent les quatre secrétaires de fédération qui font et défont les listes, et qui dînent tous les mois au même endroit.",
    "en": "The committee decided without you. What remains are the four federation secretaries who make and unmake the lists, and who dine at the same place every month."
  },
  "choices": [
    { "label": { "fr": "S'inviter à leur dîner mensuel", "en": "Invite yourself to their monthly dinner" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reseau": 0.5 }, "dice": 16 },
      "success": { "effects": { "popularity": -3, "standing": 4, "reseau": 1, "energie": -1 },
        "result": { "fr": "Trois heures à écouter des histoires de 1997 et à rire au bon moment. En repartant, l'un d'eux vous appelle par votre prénom.",
                    "en": "Three hours listening to stories from 1997 and laughing in the right places. On the way out, one of them uses your first name." } },
      "failure": { "effects": { "standing": -3, "energie": -1, "reputation": -1 },
        "result": { "fr": "On vous place en bout de table, on parle devant vous comme si vous n'y étiez pas, et l'addition est partagée en cinq.",
                    "en": "You are seated at the end of the table, they talk across you as if you were not there, and the bill is split five ways." } } },
    { "label": { "fr": "Financer la fédération sur vos deniers", "en": "Fund the federation out of your own pocket" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -40000, "popularity": -3, "standing": 5, "reputation": -1 },
      "result": { "fr": "Un local repeint, deux permanents payés six mois, un car pour le congrès. Personne ne dira jamais que la place s'achète, et tout le monde saura ce qu'elle a coûté.",
                  "en": "A repainted office, two staffers paid for six months, a coach to the party conference. Nobody will ever say the seat was bought, and everyone will know what it cost." } },
    { "label": { "fr": "Faire le travail que personne ne veut faire", "en": "Do the work nobody wants to do" },
      "effects": { "strike": "appareil", "standing": 3, "energie": -3, "reseau": 1, "popularity": -1 },
      "result": { "fr": "Six mois de commissions statutaires, de comptes rendus et de conflits de fédération. C'est long, c'est gris, et ça marche toujours.",
                  "en": "Six months of rules committees, minutes and branch disputes. It is long, it is grey, and it always works." } },
    { "label": { "fr": "Les menacer de partir", "en": "Threaten to leave" },
      "when": { "minPopularity": 55 },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "popularity": 0.07 }, "dice": 16 },
      "success": { "effects": { "popularity": -3, "standing": 6, "notoriete": 1, "reputation": -1 },
        "result": { "fr": "Vous laissez entendre qu'ailleurs on vous attend. Ils vérifient, c'est vrai, et la commission se réunit de nouveau la semaine suivante.",
                    "en": "You let it be understood that others are waiting for you. They check, it is true, and the committee meets again the following week." } },
      "failure": { "effects": { "standing": -10, "strike": "traitre" },
        "result": { "fr": "Ils vous répondent d'y aller. Vous restez, et la phrase circule dans toutes les fédérations avant la fin du mois.",
                    "en": "They tell you to go ahead. You stay, and the line goes round every branch before the month is out." } } }
  ]
},

{
  "id": "investiture_concurrent",
  "weight": 4,
  "cast": "camp_senior",
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "L'investiture vous passe sous le nez. Elle va à {rival}, qui n'a rien de plus que vous sinon d'avoir commencé plus tôt à la demander.",
    "en": "The nomination goes past you. It goes to {rival}, who has nothing more than you except having started asking for it earlier."
  },
  "choices": [
    { "label": { "fr": "{Le} soutenir bruyamment", "en": "Back {him} loudly" },
      "effects": { "standing": 4, "reputation": 1, "popularity": -3 },
      "result": { "fr": "Vous faites campagne pour {lui}, vous tenez trois réunions à sa place et vous êtes sur toutes les photos. La prochaine fois, ce sera difficile de vous refuser.",
                  "en": "You campaign for {him}, you hold three meetings in {his} place and you are in every photograph. Next time it will be hard to refuse you." } },
    { "label": { "fr": "Faire savoir ce qu'{il} vaut vraiment", "en": "Let people know what {he} is really worth" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": -3, "standing": 3, "reputation": -2, "landscape": { "self": -0.5 } },
        "result": { "fr": "Deux ou trois conversations dans les bons bureaux, jamais un mot par écrit. Sa candidature s'effrite toute seule et personne ne sait pourquoi.",
                    "en": "Two or three conversations in the right offices, never a word in writing. {His} candidacy crumbles on its own and nobody knows why." } },
      "failure": { "effects": { "standing": -12, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "L'une de vos conversations lui revient mot pour mot. {Il} ne dit rien, {il} attend, et {il} aura toute une carrière pour s'en souvenir.",
                    "en": "One of your conversations gets back to {him} word for word. {He} says nothing, {he} waits, and {he} will have a whole career to remember it." } } },
    { "label": { "fr": "Aller voir ailleurs pendant qu'{il} fait campagne", "en": "Look elsewhere while {he} campaigns" },
      "effects": { "standing": 2, "reseau": 2, "energie": -1, "popularity": 2 },
      "result": { "fr": "Vous passez la campagne dans deux autres fédérations, où l'on ne vous doit rien et où l'on vous découvre. {Il} gagne, et vous aussi, ailleurs.",
                  "en": "You spend the campaign in two other federations, where nobody owes you anything and where people discover you. {He} wins, and so do you, elsewhere." } }
  ]
},

{
  "id": "investiture_militants",
  "weight": 4,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "La direction ne veut pas de vous, mais ce sont les adhérents qui votent, et il y en a onze mille dont personne ne s'occupe jamais entre deux congrès.",
    "en": "The leadership does not want you, but it is the members who vote, and there are eleven thousand of them nobody ever bothers with between conferences."
  },
  "choices": [
    { "label": { "fr": "Faire le tour des sections, une par une", "en": "Tour the branches, one by one" },
      "effects": { "strike": "appareil", "standing": 4, "energie": -3, "reseau": 2, "popularity": -2 },
      "result": { "fr": "Quarante et une sections en cinq mois, des salles de quinze personnes et beaucoup de café tiède. Vous connaissez le parti mieux que ceux qui le dirigent.",
                  "en": "Forty-one branches in five months, rooms of fifteen people and a great deal of lukewarm coffee. You know the party better than the people running it." } },
    { "label": { "fr": "Monter une plateforme et récolter des signatures", "en": "Set up a platform and collect signatures" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "reseau": 0.4, "energie": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": -3, "standing": 5, "notoriete": 1, "reputation": 1 },
        "result": { "fr": "Un texte de deux pages, six cents signatures en trois semaines et un titre dans la presse militante. La direction découvre qu'elle a un problème interne.",
                    "en": "A two-page text, six hundred signatures in three weeks and a headline in the party press. The leadership discovers it has an internal problem." } },
      "failure": { "effects": { "standing": -6, "energie": -2 },
        "result": { "fr": "Cent quatre signatures, dont onze de gens qui ne sont plus à jour de cotisation. Le texte ne sort jamais du site.",
                    "en": "One hundred and four signatures, eleven of them from people who have not paid their dues. The text never leaves the website." } } },
    { "label": { "fr": "Attendre le prochain congrès", "en": "Wait for the next conference" },
      "effects": { "energie": 2, "popularity": -3, "standing": 2, "sangfroid": 1, "strike": "lache" },
      "result": { "fr": "Vous ne faites rien du tout et vous vous en tirez avec une année de repos. Personne ne vous en veut, ce qui est bien le problème.",
                  "en": "You do nothing at all and come away with a year of rest. Nobody holds it against you, which is precisely the problem." } }
  ]
},

{
  "id": "investiture_dette",
  "weight": 3,
  "cast": "camp_senior",
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "{rival} vous propose un arrangement : {il} fait pencher la commission en votre faveur, et vous lui devez une voix au moment où {il} en aura besoin. {Il} ne précise pas laquelle.",
    "en": "{rival} offers you an arrangement: {he} tips the committee your way, and you owe {him} a vote when {he} needs one. {He} does not say which."
  },
  "choices": [
    { "label": { "fr": "Accepter la dette", "en": "Take on the debt" },
      "effects": { "popularity": -3, "standing": 6, "reseau": 1, "reputation": -1, "chain": "mentor_dette" },
      "result": { "fr": "La commission se réunit de nouveau et votre nom passe sans discussion. Vous ne savez pas encore ce que vous venez de vendre.",
                  "en": "The committee meets again and your name goes through without discussion. You do not yet know what you have just sold." } },
    { "label": { "fr": "Refuser, et le dire en face", "en": "Refuse, and say so to {his} face" },
      "effects": { "reputation": 3, "standing": -3, "sangfroid": 1, "strike": "intrepide" },
      "result": { "fr": "Vous lui répondez que vous préférez perdre. {Il} hausse les épaules et vous respecte un peu plus, ce qui ne vaut aucune investiture.",
                  "en": "You tell {him} you would rather lose. {He} shrugs and respects you slightly more, which is worth no nomination at all." } },
    { "label": { "fr": "Accepter, et enregistrer la conversation", "en": "Accept, and record the conversation" },
      "when": { "personality": ["calculating"] },
      "effects": { "popularity": -3, "standing": 5, "reseau": 1, "reputation": -2, "sangfroid": 1 },
      "result": { "fr": "Vous acceptez, et vous gardez trois minutes de son offre dans un téléphone que vous ne changerez jamais. La dette existe des deux côtés maintenant.",
                  "en": "You accept, and you keep three minutes of {his} offer on a phone you will never replace. The debt runs both ways now." } }
  ]
}
,

{
  "id": "investiture_parachute",
  "weight": 4,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "L'investiture est donnée à quelqu'un que personne n'a jamais vu ici, envoyé par le siège pour « incarner le renouvellement ». La fédération est furieuse, et la fédération, c'est vous qui la connaissez.",
    "en": "The nomination goes to somebody nobody here has ever seen, sent down from headquarters to “embody renewal”. The federation is furious, and you are the one who knows the federation."
  },
  "choices": [
    { "label": { "fr": "Organiser la fronde des militants locaux", "en": "Organise the local revolt" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "notoriete": 1, "popularity": 3, "energie": -2 },
        "result": { "fr": "Deux cents signatures en dix jours et un article dans le quotidien régional. Le siège retire discrètement sa candidature et ne vous en reparlera jamais.",
                    "en": "Two hundred signatures in ten days and a piece in the regional paper. Headquarters quietly withdraws the candidacy and never mentions it again." } },
      "failure": { "effects": { "standing": -8, "reputation": -1, "energie": -2 },
        "result": { "fr": "Le siège tient bon et retient les noms. Vous avez appris qui vous suit vraiment : onze personnes, dont deux qui ne voteront pas.",
                    "en": "Headquarters holds firm and takes down names. You have learned who really follows you: eleven people, two of whom will not vote." } } },
    { "label": { "fr": "Servir de guide au parachuté", "en": "Show the newcomer around" },
      "effects": { "standing": 5, "reseau": 2, "reputation": -1, "energie": -1 },
      "result": { "fr": "Trois semaines de marchés et de salles des fêtes, et une reconnaissance qui vaudra ce qu'elle vaudra. Au siège, on note que vous êtes utile.",
                  "en": "Three weeks of markets and village halls, and a gratitude worth whatever it turns out to be worth. At headquarters, they note that you are useful." } },
    { "label": { "fr": "Ne rien faire et laisser le terrain trancher", "en": "Do nothing and let the ground decide" },
      "effects": { "standing": -2, "reputation": 1, "energie": 1 },
      "result": { "fr": "Vous ne dites rien pendant toute la campagne. Le résultat est mauvais, et tout le monde se souvient que vous n'aviez rien promis.",
                  "en": "You say nothing for the whole campaign. The result is poor, and everyone remembers you promised nothing." } }
  ]
},

{
  "id": "investiture_sondage",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "On vous écarte au nom d'une étude d'opinion commandée par la direction. Vous n'avez jamais vu l'étude, et l'institut qui l'a réalisée travaille pour le parti depuis douze ans.",
    "en": "They set you aside in the name of an opinion study commissioned by the leadership. You have never seen the study, and the polling firm that produced it has worked for the party for twelve years."
  },
  "choices": [
    { "label": { "fr": "Exiger de voir les chiffres", "en": "Demand to see the numbers" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.35 }, "dice": 15 },
      "success": { "effects": { "standing": 5, "reputation": 1, "sangfroid": 1 },
        "result": { "fr": "L'étude porte sur trois cent douze personnes et ne vous mentionne pas une fois. On vous promet de « réexaminer le dossier », ce qui, dans cette maison, est un aveu.",
                    "en": "The study covers three hundred and twelve people and never mentions you once. They promise to “revisit the file”, which in this house is a confession." } },
      "failure": { "effects": { "standing": -6, "popularity": -2, "reputation": -1 },
        "result": { "fr": "On vous lit trois lignes au téléphone et on raccroche. Vous passez pour quelqu'un qui conteste les chiffres, ce qui est pire que d'être mauvais dedans.",
                    "en": "They read you three lines over the phone and hang up. You now look like someone who disputes numbers, which is worse than polling badly in them." } } },
    { "label": { "fr": "Payer votre propre sondage", "en": "Pay for your own poll" },
      "when": { "minMoney": 45000 },
      "effects": { "money": -35000, "standing": 4, "notoriete": 1, "popularity": 2 },
      "result": { "fr": "Vos chiffres sont meilleurs que les leurs, ce qui n'étonne personne puisque c'est vous qui avez écrit les questions. Ils circulent quand même.",
                  "en": "Your numbers are better than theirs, which surprises nobody since you wrote the questions. They circulate all the same." } },
    { "label": { "fr": "Accepter le verdict et travailler la notoriété", "en": "Accept the verdict and work on your name" },
      "effects": { "notoriete": 1, "popularity": 3, "standing": -1, "energie": -1 },
      "result": { "fr": "Six mois de radios locales et de fêtes de village. Au sondage suivant, on ne pourra plus écrire que personne ne vous connaît.",
                  "en": "Six months of local radio and village fairs. At the next poll, nobody will be able to write that nobody knows you." } }
  ]
},

{
  "id": "investiture_quota",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "La liste doit être équilibrée, et l'équilibre se fait toujours sur les places où l'on ne gagne pas. On vous propose la quatrième position dans une circonscription que le parti n'a jamais remportée.",
    "en": "The list has to be balanced, and balance is always struck in the places nobody wins. They offer you fourth position in a seat the party has never taken."
  },
  "choices": [
    { "label": { "fr": "Accepter la circonscription perdue d'avance", "en": "Take the unwinnable seat" },
      "effects": { "standing": 4, "notoriete": 1, "popularity": 2, "energie": -2, "reputation": 1 },
      "result": { "fr": "Vous perdez de vingt points, ce qui était prévu, et vous en reprenez six, ce qui ne l'était pas. On s'en souviendra la prochaine fois.",
                  "en": "You lose by twenty points, which was expected, and claw back six, which was not. That will be remembered next time." } },
    { "label": { "fr": "Refuser et le faire savoir", "en": "Refuse it, and let it be known" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 3, "notoriete": 2, "popularity": 4, "reputation": 1 },
        "result": { "fr": "Votre refus fait une demi-page. La direction découvre que vous écarter coûte plus cher que vous investir.",
                    "en": "Your refusal fills half a page. The leadership discovers that setting you aside costs more than nominating you." } },
      "failure": { "effects": { "standing": -9, "popularity": -3, "reputation": -1 },
        "result": { "fr": "Personne ne reprend l'information et la place est pourvue le lendemain. Vous avez refusé la seule chose qu'on vous proposait.",
                    "en": "Nobody picks the story up and the slot is filled the next day. You turned down the only thing on offer." } } },
    { "label": { "fr": "Négocier autre chose contre votre retrait", "en": "Trade your withdrawal for something else" },
      "effects": { "standing": 5, "reseau": 1, "reputation": -1 },
      "result": { "fr": "Vous vous retirez proprement, contre une place au bureau national dont personne ne connaît les attributions. Vous les découvrirez, elles sont réelles.",
                  "en": "You withdraw cleanly, in exchange for a seat on the national board whose remit nobody can define. You will find out; it is real." } }
  ]
},

{
  "id": "investiture_courant",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Votre dossier est bon, et il est mort en commission parce que vous n'appartenez à aucun des trois courants qui se partagent le parti. Les trois vous l'ont dit gentiment, séparément, le même jour."
    ,
    "en": "Your file is good, and it died in committee because you belong to none of the three factions that share the party. All three told you so kindly, separately, on the same day."
  },
  "choices": [
    { "label": { "fr": "Rejoindre le courant le mieux placé", "en": "Join the strongest faction" },
      "effects": { "standing": 6, "reseau": 1, "reputation": -2, "popularity": -2 },
      "result": { "fr": "Vous signez leur texte sans en avoir relu le troisième paragraphe. Vous êtes désormais de quelque part, ce qui vaut mieux que d'avoir raison.",
                  "en": "You sign their motion without rereading the third paragraph. You are from somewhere now, which is worth more than being right." } },
    { "label": { "fr": "Monter votre propre courant", "en": "Start a faction of your own" },
      "roll": { "base": 17, "stat": "charisme", "plus": { "eloquence": 0.4, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "notoriete": 1, "energie": -2, "reseau": 2 },
        "result": { "fr": "Onze élus signent, dont deux qui comptent. Les trois courants deviennent quatre, et l'on vient désormais vous demander votre avis avant les commissions.",
                    "en": "Eleven elected members sign, two of whom matter. Three factions become four, and people now ask your view before committees meet." } },
      "failure": { "effects": { "standing": -7, "energie": -2, "reputation": -1 },
        "result": { "fr": "Quatre signatures, dont la vôtre. Le texte circule une semaine et sert surtout à montrer qui ne vous suit pas.",
                    "en": "Four signatures, including your own. The motion circulates for a week and mostly serves to show who is not with you." } } },
    { "label": { "fr": "Rester sans étiquette et attendre l'arbitrage", "en": "Stay unaligned and wait to be the compromise" },
      "effects": { "standing": 2, "reputation": 2, "energie": 1 },
      "result": { "fr": "Vous ne devez rien à personne, ce qui ne sert à rien tant que les trois s'entendent. Ils ne s'entendront pas toujours.",
                  "en": "You owe nobody anything, which is useless for as long as the three agree. They will not always agree." } }
  ]
},

{
  "id": "investiture_attente",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Troisième commission, troisième « pas encore ». On ne vous reproche rien, on ne vous promet rien, et l'on vous répète que votre tour viendra sans jamais dire quand.",
    "en": "Third committee, third “not yet”. Nothing is held against you, nothing is promised to you, and you are told your turn will come without anyone saying when."
  },
  "choices": [
    { "label": { "fr": "Prendre les dossiers dont personne ne veut", "en": "Take the files nobody wants" },
      "effects": { "standing": 4, "energie": -2, "eloquence": 1 },
      "result": { "fr": "Le rapport sur les normes comptables des syndicats intercommunaux vous prend quatre mois. Personne ne le lira, tout le monde saura que vous l'avez fait.",
                  "en": "The report on the accounting rules of inter-municipal boards takes you four months. Nobody will read it; everyone will know you wrote it." } },
    { "label": { "fr": "Poser un ultimatum à la direction", "en": "Give the leadership an ultimatum" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "standing": 0.06 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "sangfroid": 1, "reputation": 1 },
        "result": { "fr": "Vous dites que c'est la dernière fois que vous le demandez. Le silence dans la pièce vous apprend que quelqu'un vous a enfin pris au sérieux.",
                    "en": "You say this is the last time you will ask. The silence in the room tells you somebody has finally taken you seriously." } },
      "failure": { "effects": { "standing": -10, "reputation": -1, "popularity": -2 },
        "result": { "fr": "On vous répond « comme vous voudrez » et l'on passe au point suivant de l'ordre du jour. C'était votre dernière carte et elle ne valait rien.",
                    "en": "They answer “as you wish” and move to the next item on the agenda. That was your last card and it was worth nothing." } } },
    { "label": { "fr": "Se faire élire à un poste interne sans intérêt", "en": "Get yourself elected to a dull internal post" },
      "effects": { "standing": 3, "reseau": 1, "energie": -1, "popularity": -1 },
      "result": { "fr": "Secrétaire à la vie fédérale. Le titre fait sourire et donne accès à la liste complète des adhérents, avec les numéros de téléphone.",
                  "en": "Secretary for federation affairs. The title raises smiles and gives you the full membership list, phone numbers included." } }
  ]
},

{
  "id": "investiture_routine",
  "weight": 3,
  "repeatable": true,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Encore une commission d'investiture où votre nom n'a servi qu'à équilibrer une liste. Il reste six mois avant la suivante, et l'appareil ne se travaille pas autrement qu'à l'usure.",
    "en": "Another nominations committee where your name only served to balance a list. There are six months until the next one, and the machine is worked by attrition or not at all."
  },
  "choices": [
    { "label": { "fr": "Reprendre les réunions de section", "en": "Go back to the branch meetings" },
      "effects": { "standing": 5, "popularity": -2, "energie": -1 },
      "result": { "fr": "Des mardis soir dans des salles trop grandes, à écouter des motions sur le règlement intérieur. C'est ainsi qu'on se fait un nom là où il compte.",
                  "en": "Tuesday evenings in rooms that are too big, listening to motions about standing orders. That is how you make a name where it counts." } },
    { "label": { "fr": "Rendre service à ceux qui décident", "en": "Do favours for the people who decide" },
      "effects": { "standing": 6, "popularity": -3, "reseau": 1, "reputation": -1 },
      "result": { "fr": "Un rapport rédigé pour quelqu'un d'autre, une intervention annulée pour lui laisser la place, un vote qui ne vous coûtait rien. On note.",
                  "en": "A report written for somebody else, a speech cancelled to leave him the floor, a vote that cost you nothing. It gets noticed." } },
    { "label": { "fr": "Soigner le terrain plutôt que l'appareil", "en": "Work the ground instead of the machine" },
      "effects": { "popularity": 6, "standing": -2, "energie": -1 },
      "result": { "fr": "Vous laissez la commission à ceux qui l'aiment et vous passez six mois dehors. La direction ne vous investira pas plus, et les électeurs vous connaîtront mieux.",
                  "en": "You leave the committee to the people who enjoy it and spend six months outside. The leadership will not nominate you any sooner, and the voters will know you better." } }
  ]
}
],

/* ==========================================================================
   LES SCRUTINS QUI SE JOUENT SANS VOUS
   ==========================================================================
   Une élection où l'on n'est pas candidat mangeait un semestre entier : une
   phrase, un bouton « Continuer », et une perte de jauges sur laquelle on ne
   pouvait rien. Un scrutin auquel on ne se présente pas reste pourtant une
   campagne qu'il faut traverser, et la façon de la traverser se choisit.

   Ces scènes se rejouent : une carrière en croise une dizaine.
   ========================================================================== */
/* ==========================================================================
   LA PRÉSIDENTIELLE DES AUTRES
   ==========================================================================
   La plus grande élection du jeu se réglait en un clic quand le joueur
   n'était pas candidat : une phrase, un vainqueur tiré au sort, cinq ans
   qui basculent sans qu'on ait rien à en dire.

   On y joue désormais trois temps. Ce qu'on peut y faire dépend d'où l'on
   est : un militant colle des affiches, un ministre défend un bilan, un chef
   de parti négocie un désistement. Et l'on peut aussi bien porter son camp
   que le saborder, ce qui est une spécialité française.

   Le champ "weight" ne sert pas ici : les scènes sont filtrées par "when",
   puis tirées au hasard parmi celles qui restent.
   ========================================================================== */
"support": [

{
  "id": "sup_affiches",
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "La campagne nationale a besoin de bras et vous n'êtes personne dans l'organigramme. Votre section reçoit huit mille affiches, deux escabeaux et aucune consigne."
    ,
    "en": "The national campaign needs hands and you are nobody on the org chart. Your branch receives eight thousand posters, two stepladders and no instructions."
  },
  "choices": [
    { "label": { "fr": "Coller toutes les nuits pendant six semaines", "en": "Fly-post every night for six weeks" },
      "effects": { "score": 3, "standing": 5, "energie": -3, "reseau": 1 },
      "result": { "fr": "Six semaines à monter sur des escabeaux dans le froid. Personne ne le saura sauf les quinze qui étaient là, et ces quinze-là voteront pour vous pendant vingt ans.",
                  "en": "Six weeks up stepladders in the cold. Nobody will know except the fifteen who were there, and those fifteen will vote for you for twenty years." } },
    { "label": { "fr": "Organiser la section et déléguer", "en": "Organise the branch and delegate" },
      "effects": { "score": 2, "standing": 3, "reseau": 2, "energie": -1 },
      "result": { "fr": "Vous montez un planning, quatre équipes et un groupe de discussion. C'est mieux tenu que la campagne nationale, ce qui n'est pas un compliment pour la campagne nationale.",
                  "en": "You set up a rota, four teams and a chat group. It is better run than the national campaign, which is not a compliment to the national campaign." } },
    { "label": { "fr": "Laisser les affiches dans le local", "en": "Leave the posters in the back room" },
      "effects": { "score": -2, "standing": -4, "energie": 2 },
      "result": { "fr": "Elles y sont encore. Quelqu'un les retrouvera dans quatre ans et prendra une photo qui circulera dans toute la fédération.",
                  "en": "They are still there. Somebody will find them in four years and take a photograph that will go round the entire federation." } }
  ]
},

{
  "id": "sup_bilan",
  "when": { "position": ["ministre", "premier"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous êtes au gouvernement pendant que votre camp fait campagne. Chaque plateau vous demande de défendre un bilan que le candidat de votre parti passe ses journées à nuancer."
    ,
    "en": "You are in government while your side campaigns. Every studio asks you to defend a record that your party's candidate spends their days qualifying."
  },
  "choices": [
    { "label": { "fr": "Défendre le bilan sans une nuance", "en": "Defend the record without a single caveat" },
      "effects": { "score": 4, "credibilite": 2, "popularity": -6, "standing": 5, "energie": -2 },
      "result": { "fr": "Vous tenez la ligne partout, y compris là où elle est indéfendable. Le candidat gagne un point de sérieux et vous perdez ce qui vous restait de sympathie.",
                  "en": "You hold the line everywhere, including where it cannot be held. The candidate gains a point of seriousness and you lose what sympathy you had left." } },
    { "label": { "fr": "Prendre vos distances avec le gouvernement", "en": "Put some distance between yourself and the government" },
      "effects": { "score": -4, "popularity": 9, "standing": -9, "reputation": -1 },
      "result": { "fr": "Vous expliquez ce que vous auriez fait autrement. Le pays vous trouve honnête, votre camp vous trouve en campagne pour vous-même, et les deux ont raison.",
                  "en": "You explain what you would have done differently. The country finds you honest, your side finds you campaigning for yourself, and both are right." } },
    { "label": { "fr": "Annoncer trois mesures avant le scrutin", "en": "Announce three measures before the vote" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 5, "popularity": 5, "standing": 4, "credibilite": 1 },
        "result": { "fr": "Trois décrets signés à quinze jours du vote, et personne pour dire que c'est électoraliste puisque tout le monde le pense.",
                    "en": "Three decrees signed a fortnight before the vote, and nobody says it is electioneering because everybody is thinking it." } },
      "failure": { "effects": { "score": -3, "popularity": -8, "credibilite": -2, "standing": -4 },
        "result": { "fr": "Les mesures arrivent trop tard et se voient trop. La séquence devient un cas d'école de ce qu'il ne faut pas faire, cité pendant deux campagnes.",
                    "en": "The measures land too late and show too much. The sequence becomes a textbook case of what not to do, cited for two campaigns." } } }
  ]
},

{
  "id": "sup_meeting",
  "when": { "position": ["maire", "euro", "depute"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Le meeting régional se tient chez vous, et c'est vous qui remplissez la salle. Trois mille places, une heure d'antenne nationale, et un candidat qui arrivera vingt minutes avant de parler."
    ,
    "en": "The regional rally is on your patch, and you are the one filling the hall. Three thousand seats, an hour of national coverage, and a candidate who will arrive twenty minutes before speaking."
  },
  "choices": [
    { "label": { "fr": "Remplir la salle et lui laisser toute la lumière", "en": "Fill the hall and give them all the light" },
      "effects": { "score": 5, "standing": 8, "energie": -2, "popularity": 1 },
      "result": { "fr": "Salle pleine, ambiance excellente, et votre nom prononcé une fois en début de discours. C'est exactement ce qu'on attendait de vous, et on s'en souviendra.",
                  "en": "Full hall, excellent atmosphere, and your name mentioned once at the start of the speech. It is exactly what was expected of you, and it will be remembered." } },
    { "label": { "fr": "Faire un discours qu'on retiendra", "en": "Give a speech people will remember" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 3, "notoriete": 3, "popularity": 10, "standing": -3,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "Douze minutes reprises en boucle sur toutes les chaînes. Le candidat vous félicite avec un sourire qui n'atteint pas ses yeux.",
                    "en": "Twelve minutes replayed on every channel. The candidate congratulates you with a smile that does not reach their eyes." } },
      "failure": { "effects": { "score": -2, "popularity": -6, "standing": -5, "energie": -1 },
        "result": { "fr": "Vous parlez huit minutes de trop devant une salle qui attend quelqu'un d'autre. Le silence de la fin est le vrai sujet de la soirée.",
                    "en": "You speak eight minutes too long to a hall waiting for somebody else. The silence at the end is the real story of the evening." } } },
    { "label": { "fr": "Annuler : la salle ne se remplira pas", "en": "Cancel: the hall will not fill" },
      "effects": { "score": -5, "standing": -8, "energie": 1, "sangfroid": 1 },
      "result": { "fr": "Vous préférez une salle vide annulée à une salle vide filmée. Vous avez raison sur le fond et la direction ne vous le pardonnera pas.",
                  "en": "You prefer an empty hall cancelled to an empty hall on television. You are right on the substance and the leadership will not forgive you." } }
  ]
},

{
  "id": "sup_desistement",
  "when": { "position": ["chef", "premier"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous dirigez le parti sans en être le candidat, ce qui est la position la plus inconfortable de la campagne. Un parti voisin propose un accord de désistement, et son prix est une liste de circonscriptions."
    ,
    "en": "You lead the party without being its candidate, which is the most uncomfortable position of the campaign. A neighbouring party offers a stand-down deal, and its price is a list of constituencies."
  },
  "choices": [
    { "label": { "fr": "Signer l'accord", "en": "Sign the deal" },
      "effects": { "score": 6, "standing": 4, "reputation": -1, "reseau": 1,
                   "landscape": { "self": -0.6, "ally": 0.6 } },
      "result": { "fr": "Vous cédez huit circonscriptions contre un appel à voter. Le candidat gagne des voix, le parti perd des sièges, et c'est vous qui aurez signé.",
                  "en": "You give up eight seats in exchange for an endorsement. The candidate gains votes, the party loses seats, and you are the one who signed." } },
    { "label": { "fr": "Refuser et faire campagne seul", "en": "Refuse and campaign alone" },
      "effects": { "score": -3, "standing": 6, "credibilite": 1, "landscape": { "self": 0.5 } },
      "result": { "fr": "Vous refusez de brader ce qui vous reste. L'appareil vous approuve, le candidat vous en veut, et vous saurez dans quinze jours lequel des deux comptait.",
                  "en": "You refuse to sell off what is left. The machine approves, the candidate resents it, and in a fortnight you will know which of the two mattered." } },
    { "label": { "fr": "Négocier plus dur", "en": "Push for a better deal" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "standing": 0.05, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 5, "standing": 9, "reseau": 2, "credibilite": 1 },
        "result": { "fr": "Trois circonscriptions au lieu de huit, et l'appel à voter quand même. On vous croyait affaibli par la primaire, on découvre que non.",
                    "en": "Three seats instead of eight, and the endorsement anyway. They thought the primary had weakened you; it turns out it had not." } },
      "failure": { "effects": { "score": -6, "standing": -8, "reputation": -1,
                                "landscape": { "self": -0.8 } },
        "result": { "fr": "Ils claquent la porte et appellent à voter pour personne. Vous avez perdu l'accord, les circonscriptions et deux points dans les sondages.",
                    "en": "They walk out and endorse nobody. You have lost the deal, the seats and two points in the polls." } } }
  ]
},

{
  "id": "sup_debat_soutien",
  "when": { "minPopularity": 52 },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous êtes plus populaire que le candidat de votre propre camp, et tout le monde le sait, à commencer par lui. Les rédactions vous réclament pour parler à sa place."
    ,
    "en": "You are more popular than your own side's candidate, and everyone knows it, starting with the candidate. Newsrooms want you to speak in their place."
  },
  "choices": [
    { "label": { "fr": "Y aller et le porter à bout de bras", "en": "Go, and carry them" },
      "effects": { "score": 6, "standing": 7, "popularity": -3, "energie": -2 },
      "result": { "fr": "Vous faites vingt plateaux en trois semaines pour dire du bien de quelqu'un d'autre. C'est le travail le plus ingrat de la campagne et le seul dont on vous saura gré.",
                  "en": "You do twenty studios in three weeks saying good things about somebody else. It is the most thankless job of the campaign and the only one you will be thanked for." } },
    { "label": { "fr": "Y aller et parler surtout de vous", "en": "Go, and mostly talk about yourself" },
      "effects": { "score": -4, "popularity": 8, "notoriete": 2, "standing": -10, "reputation": -1,
                   "landscape": { "self": -0.5 } },
      "result": { "fr": "Chaque réponse revient à votre bilan et à vos idées. Les électeurs adorent, le candidat regarde les émissions, et la campagne devient une audition pour la suivante.",
                  "en": "Every answer comes back to your record and your ideas. Voters love it, the candidate watches the broadcasts, and the campaign becomes an audition for the next one." } },
    { "label": { "fr": "Refuser toutes les demandes", "en": "Turn down every request" },
      "effects": { "score": -2, "standing": -3, "energie": 2, "reputation": 1 },
      "result": { "fr": "Vous laissez le candidat occuper son propre espace. C'est élégant, c'est loyal, et cela ne se voit pas du tout.",
                  "en": "You leave the candidate their own space. It is elegant, it is loyal, and it is completely invisible." } }
  ]
},

{
  "id": "sup_porte_a_porte",
  "moment": 2,
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Dernier week-end avant le premier tour. Le siège demande à chacun de faire du porte-à-porte, et vous connaissez par cœur ce que ça donne : deux portes sur trois qui ne s'ouvrent pas, et la troisième qui parle vingt minutes."
    ,
    "en": "The last weekend before the first round. Headquarters is asking everyone to canvass, and you know exactly how it goes: two doors in three that stay shut, and the third that talks for twenty minutes."
  },
  "choices": [
    { "label": { "fr": "Y aller avec vos équipes", "en": "Go out with your teams" },
      "effects": { "score": 3, "standing": 4, "popularity": 3, "energie": -2 },
      "result": { "fr": "Neuf cents portes en deux jours. Vous en tirez trois enseignements que le siège n'a pas, et personne au siège ne vous les demandera.",
                  "en": "Nine hundred doors in two days. You come back with three insights headquarters does not have, and nobody there will ask you for them." } },
    { "label": { "fr": "Envoyer vos équipes et rester au téléphone", "en": "Send your teams and stay on the phone" },
      "effects": { "score": 1, "reseau": 2, "energie": 1, "standing": -1 },
      "result": { "fr": "Vous passez le week-end à appeler des gens qui comptent plutôt qu'à parler à des gens qui votent. C'est un choix, et il se défend.",
                  "en": "You spend the weekend calling people who matter rather than talking to people who vote. It is a choice, and it can be defended." } },
    { "label": { "fr": "Passer le week-end en famille", "en": "Spend the weekend with your family" },
      "effects": { "score": -2, "energie": 3, "standing": -3, "reputation": 1 },
      "result": { "fr": "Vous ne faites rien et vous dormez. Vous serez le seul reposé du parti lundi matin, ce qui ne se voit sur aucun tableau.",
                  "en": "You do nothing and you sleep. You will be the only rested person in the party on Monday morning, which shows up on no chart." } }
  ]
},

{
  "id": "sup_soir_premier_tour",
  "moment": 1,
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "Le premier tour est passé et il reste quinze jours. Le report des voix se joue maintenant, dans des salles de réunion et des studios, et pas devant les électeurs."
    ,
    "en": "The first round is over and a fortnight remains. Where the votes go next is decided now, in meeting rooms and studios, not in front of voters."
  },
  "choices": [
    { "label": { "fr": "Aller chercher les électeurs des éliminés", "en": "Go after the eliminated candidates' voters" },
      "effects": { "score": 5, "standing": 5, "energie": -2, "reputation": -1 },
      "result": { "fr": "Vous passez quinze jours à dire du bien de gens que vous combattez depuis vingt ans. Certains de leurs électeurs suivront, et c'est tout ce qu'on vous demandait.",
                  "en": "You spend a fortnight saying kind things about people you have fought for twenty years. Some of their voters will follow, and that was all anyone asked." } },
    { "label": { "fr": "Faire campagne sur votre propre terrain", "en": "Campaign on your own ground" },
      "effects": { "score": 2, "popularity": 5, "standing": -2, "energie": -1 },
      "result": { "fr": "Vous ne pouvez pas déplacer le pays, alors vous déplacez votre circonscription. Le report y sera meilleur qu'ailleurs et personne ne fera le lien.",
                  "en": "You cannot move the country, so you move your own constituency. The transfer will be better there than anywhere else and nobody will make the connection." } },
    { "label": { "fr": "Préparer l'après, quel que soit le résultat", "en": "Prepare for the aftermath, whatever the result" },
      "effects": { "score": -1, "reseau": 2, "standing": 3, "credibilite": 1 },
      "result": { "fr": "Pendant que les autres tractent, vous appelez ceux qui compteront le 8 au matin. C'est cynique, c'est utile, et cela ne fera gagner personne dimanche.",
                  "en": "While the others hand out leaflets, you call the people who will matter on the Monday morning. It is cynical, it is useful, and it will win nobody anything on Sunday." } }
  ]
},

{
  "id": "sup_sabotage",
  "when": { "maxStanding": 45 },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Le candidat désigné a fait campagne contre vous à la primaire et ne vous a rien proposé depuis. Un journaliste vous appelle pour un portrait critique et vous demande, en off, ce que vous en pensez vraiment."
    ,
    "en": "The chosen candidate ran against you in the primary and has offered you nothing since. A reporter calls for a critical profile and asks, off the record, what you really think."
  },
  "choices": [
    { "label": { "fr": "Le soutenir quand même, publiquement", "en": "Back them anyway, publicly" },
      "effects": { "score": 4, "standing": 9, "reputation": 2, "credibilite": 1, "popularity": -2 },
      "result": { "fr": "Vous dites du bien de quelqu'un qui vous a démoli. Personne n'est dupe, et c'est exactement pour ça que cela compte.",
                  "en": "You speak well of somebody who tore you down. Nobody is fooled, and that is exactly why it counts." } },
    { "label": { "fr": "Parler en off, sans se découvrir", "en": "Speak off the record, staying covered" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": -5, "standing": 3, "notoriete": 1,
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Le portrait sort, sévère, sourcé « un cadre du parti ». Trois personnes savent que c'est vous et aucune n'a intérêt à le dire.",
                    "en": "The profile runs, harsh, sourced to “a senior party figure”. Three people know it was you and none of them has any interest in saying so." } },
      "failure": { "effects": { "score": -6, "standing": -14, "reputation": -2, "strike": "traitre",
                                "landscape": { "self": -0.9 } },
        "result": { "fr": "Une formule trop reconnaissable vous trahit dès le lendemain. On ne vous pardonnera pas d'avoir tiré pendant la campagne, quoi qu'il arrive ensuite.",
                    "en": "A turn of phrase too recognisable gives you away the next day. Firing during the campaign will not be forgiven, whatever happens afterwards." } } },
    { "label": { "fr": "Ne rien dire et disparaître six semaines", "en": "Say nothing and vanish for six weeks" },
      "effects": { "score": -2, "energie": 3, "standing": -4 },
      "result": { "fr": "Vous éteignez le téléphone et vous vous occupez de votre circonscription. On remarquera votre absence, ce qui est déjà une prise de position.",
                  "en": "You switch off the phone and look after your own patch. Your absence will be noticed, which is already a position." } }
  ]
}

],

"aside": [

{
  "id": "aside_campagne_autres",
  "weight": 4,
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "Six semaines de campagne où votre nom n'est sur aucun bulletin. Votre agenda est vide pour la première fois depuis des années, et trois personnes vous ont déjà demandé ce que vous comptiez en faire.",
    "en": "Six weeks of campaigning with your name on no ballot. Your diary is empty for the first time in years, and three people have already asked what you intend to do with it."
  },
  "choices": [
    { "label": { "fr": "Faire campagne pour les candidats de votre camp", "en": "Campaign for your own side's candidates" },
      "effects": { "standing": 7, "reseau": 1, "energie": -2, "popularity": 1 },
      "result": { "fr": "Onze déplacements pour des gens qui ne vous devaient rien. Ils vous devront quelque chose, et vous saurez exactement quoi le jour venu.",
                  "en": "Eleven trips for people who owed you nothing. They will owe you something, and you will know exactly what when the day comes." } },

    { "label": { "fr": "Travailler votre propre terrain pendant que les autres courent", "en": "Work your own patch while the others run around" },
      "effects": { "popularity": 6, "energie": -1, "standing": -2 },
      "result": { "fr": "Vous passez six semaines dans vos marchés à vous. Personne au siège ne le remarque, et vos électeurs, si.",
                  "en": "You spend six weeks in your own markets. Nobody at headquarters notices; your own voters do." } },

    { "label": { "fr": "Commenter le scrutin sur les plateaux", "en": "Comment on the race from the studios" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "notoriete": 0.35 }, "dice": 15 },
      "success": { "effects": { "notoriete": 3, "popularity": 5, "standing": -2 },
        "result": { "fr": "Vous devenez l'invité qu'on rappelle. Six semaines d'antenne gratuite pendant que vos concurrents collent des affiches.",
                    "en": "You become the guest they call back. Six weeks of free airtime while your rivals put up posters." } },
      "failure": { "effects": { "notoriete": 2, "popularity": -6, "standing": -4, "reputation": -1 },
        "result": { "fr": "Vous commentez la campagne des autres avec un peu trop d'aisance. Le mot « donneur de leçons » sort dès la troisième émission.",
                    "en": "You comment on other people's campaigns a little too comfortably. The phrase “lecturing from the sidelines” appears by the third broadcast." } } },

    { "label": { "fr": "Ne rien faire et souffler", "en": "Do nothing, and breathe" },
      "effects": { "energie": 3, "standing": -3, "popularity": -2 },
      "result": { "fr": "Vous dormez, vous lisez, vous voyez vos enfants. C'est la meilleure décision de l'année et elle ne rapportera jamais une voix.",
                  "en": "You sleep, you read, you see your children. It is the best decision of the year and it will never win you a single vote." } }
  ]
},

{
  "id": "aside_tete_de_liste",
  "weight": 4,
  "cast": "camp",
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "{rival} mène la campagne de votre camp et vous demande de venir en meeting. La salle sera pleine, le discours sera le sien, et la photo sera pour tout le monde.",
    "en": "{rival} is leading your side's campaign and wants you at a rally. The hall will be full, the speech will be theirs, and the photograph will be for everyone."
  },
  "choices": [
    { "label": { "fr": "Y aller et faire le discours de chauffe", "en": "Go, and do the warm-up speech" },
      "effects": { "standing": 6, "notoriete": 1, "energie": -1, "popularity": 2 },
      "result": { "fr": "Vous chauffez la salle pendant douze minutes et vous la laissez à point. Trois journalistes écrivent que le meilleur discours de la soirée était le premier.",
                  "en": "You warm the hall for twelve minutes and hand it over at exactly the right moment. Three reporters write that the best speech of the evening was the first one." } },

    { "label": { "fr": "Décliner poliment", "en": "Decline politely" },
      "effects": { "standing": -6, "energie": 1, "reputation": -1 },
      "result": { "fr": "Vous invoquez un agenda que personne ne vérifie et que tout le monde comprend. On ne vous le dira pas, on s'en souviendra.",
                  "en": "You cite a diary nobody checks and everybody understands. Nobody will mention it; everybody will remember." } },

    { "label": { "fr": "Y aller et faire un discours meilleur que le sien", "en": "Go, and give a better speech than theirs" },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 9, "standing": -5, "landscape": { "self": 0.7 } },
        "result": { "fr": "La salle se lève pour vous et se rassoit pour {lui}. C'est la meilleure et la pire chose qui pouvait vous arriver ce soir-là.",
                    "en": "The hall stands for you and sits back down for {him}. It is the best and the worst thing that could have happened to you that evening." } },
      "failure": { "effects": { "popularity": -5, "standing": -7, "energie": -1 },
        "result": { "fr": "Vous en faites trop, dans une salle qui n'était pas venue pour vous. On retient que vous avez essayé.",
                    "en": "You overdo it, in a hall that had not come for you. What people remember is that you tried." } } }
  ]
},

{
  "id": "aside_soir_de_resultats",
  "weight": 3,
  "tag": { "fr": "Soir de résultats", "en": "Results night" },
  "text": {
    "fr": "Vingt heures, le siège du parti, une salle avec un écran et deux cents personnes. Le résultat n'est pas bon et les caméras cherchent quelqu'un pour le commenter à chaud.",
    "en": "Eight in the evening, party headquarters, a room with a screen and two hundred people. The result is poor and the cameras are looking for somebody to react on the spot."
  },
  "choices": [
    { "label": { "fr": "Y aller et assumer le résultat devant tout le monde", "en": "Step up and own the result in front of everyone" },
      "effects": { "standing": 8, "credibilite": 2, "popularity": -3, "energie": -1 },
      "result": { "fr": "Vous prenez le micro que personne ne voulait. Ce n'est pas votre défaite et vous la portez quand même, ce dont la maison se souviendra plus longtemps que du score.",
                  "en": "You take the microphone nobody wanted. It is not your defeat and you carry it anyway, which the building will remember far longer than the number." } },

    { "label": { "fr": "Laisser la direction s'expliquer", "en": "Let the leadership explain itself" },
      "effects": { "standing": -4, "energie": 1 },
      "result": { "fr": "Vous restez au fond de la salle, un verre à la main. C'est prudent, c'est confortable, et deux cents personnes ont vu où vous étiez.",
                  "en": "You stay at the back of the room with a drink. It is careful, it is comfortable, and two hundred people saw where you were standing." } },

    { "label": { "fr": "Attaquer la ligne du parti dès ce soir", "en": "Attack the party line that very evening" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 11, "notoriete": 2, "popularity": 4, "reputation": -1 },
        "result": { "fr": "Vous dites à vingt heures trente ce que tout le monde dira dans quinze jours. Quand ils le diront, on se souviendra que vous étiez le premier.",
                    "en": "At half past eight you say what everyone will be saying in a fortnight. When they say it, people will remember you said it first." } },
      "failure": { "effects": { "standing": -13, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "Vous tirez sur la direction pendant que les militants pleurent. La séquence est mauvaise et elle vous colle à la peau pendant deux congrès.",
                    "en": "You shoot at the leadership while the activists are still crying. It plays badly and it sticks to you for two conferences." } } }
  ]
}

],

"races": [

/* ==========================================================================
   LES TEMPS D'UNE CAMPAGNE ORDINAIRE
   ==========================================================================
   Deux temps pour une municipale, un congrès ou une européenne, trois pour une
   législative. Chaque carte déplace l'avantage par son effet "score", qui
   n'est jamais montré au joueur en chiffres : il le lit dans la phrase qui
   ouvre la carte. Le champ "race" limite une scène à certains scrutins.
   ========================================================================== */

{
  "id": "race_dissolution",
  "race": ["legislatives"],
  "moment": 3,
  "weight": 5,
  "when": { "dissolved": true },
  "tag": { "fr": "Législatives anticipées", "en": "Snap election" },
  "text": {
    "fr": "Vingt jours de campagne au lieu de cinq semaines, en plein été, avec des électeurs qui ne comprennent pas pourquoi on les rappelle aux urnes et qui vous le disent au portail.",
    "en": "Twenty days of campaigning instead of five weeks, in high summer, with voters who do not understand why they are being called back and who tell you so at the gate."
  },
  "choices": [
    { "label": { "fr": "Faire campagne sur la dissolution elle-même", "en": "Campaign on the dissolution itself" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 5, "popularity": 5, "notoriete": 2 },
        "result": { "fr": "Vous expliquez ce qui s'est passé plutôt que ce que vous proposez. C'est la seule chose que les gens ont en tête, et vous êtes le seul à en parler.",
                    "en": "You explain what happened rather than what you propose. It is the only thing on people's minds, and you are the only one talking about it." } },
      "failure": { "effects": { "score": -4, "popularity": -5, "credibilite": -1 },
        "result": { "fr": "On vous répond qu'on s'en fiche des institutions et qu'on voudrait parler du reste. On a raison, et il est trop tard pour changer de discours.",
                    "en": "You are told nobody cares about the institutions and they would rather talk about something else. They are right, and it is too late to change tack." } } },
    { "label": { "fr": "Ignorer la crise et parler du terrain", "en": "Ignore the crisis and talk about the ground" },
      "effects": { "score": 3, "popularity": 3, "energie": -2, "credibilite": 1 },
      "result": { "fr": "Vingt jours à parler d'écoles et de trains pendant que les plateaux parlent d'arithmétique parlementaire. Vos électeurs vous en sauront gré, les autres ne vous auront pas entendu.",
                  "en": "Twenty days talking about schools and trains while the studios talk parliamentary arithmetic. Your own voters will thank you; the others will not have heard you." } },
    { "label": { "fr": "Se rassembler avec ceux d'à côté, vite et mal", "en": "Form a bloc with the neighbours, fast and badly" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "score": 8, "reseau": 2, "standing": -5, "reputation": -1 },
        "result": { "fr": "Un accord signé en quatre jours avec des gens que vous combattiez le mois dernier. Cela tiendra jusqu'au soir du second tour, ce qui suffit.",
                    "en": "A deal signed in four days with people you were fighting last month. It will hold until runoff night, which is enough." } },
      "failure": { "effects": { "score": -6, "standing": -8, "reputation": -2 },
        "result": { "fr": "Les négociations fuitent avant d'aboutir. On a la photo du marchandage sans avoir l'accord, ce qui est le pire des deux mondes.",
                    "en": "The talks leak before they conclude. You get the photograph of the haggling without the deal, which is the worst of both worlds." } } }
  ]
},

{
  "id": "race_terrain",
  "moment": 3,
  "weight": 3,
  "tag": { "fr": "Terrain", "en": "On the ground" },
  "text": {
    "fr": "Cinq semaines de campagne, un budget qui ne permet pas tout, et une équipe qui attend que vous décidiez où mettre l'énergie.",
    "en": "Five weeks of campaigning, a budget that does not stretch to everything, and a team waiting for you to decide where the energy goes."
  },
  "choices": [
    { "label": { "fr": "Les marchés, tous les matins", "en": "The markets, every morning" },
      "effects": { "score": 4, "energie": -2 },
      "result": { "fr": "Six heures du matin, quatre marchés par semaine, des mains serrées jusqu'à ne plus sentir la vôtre. C'est démodé et ça n'a jamais cessé de marcher.",
                  "en": "Six in the morning, four markets a week, hands shaken until you stop feeling your own. It is old-fashioned and it has never stopped working." } },
    { "label": { "fr": "Une campagne en ligne, ciblée", "en": "A targeted online campaign" },
      "when": { "minMoney": 30000 },
      "effects": { "score": 6, "money": -18000 },
      "result": { "fr": "Trois cents versions du même message, découpées par quartier et par âge. Vous touchez des gens qui ne vous verront jamais.",
                  "en": "Three hundred versions of the same message, cut by neighbourhood and age. You reach people who will never see you in person." } },
    { "label": { "fr": "Garder vos forces pour la fin", "en": "Save your strength for the end" },
      "effects": { "score": -6, "energie": 2 },
      "result": { "fr": "Vous levez le pied trois semaines. Votre adversaire occupe le terrain, et vous arrivez frais dans une campagne déjà écrite.",
                  "en": "You ease off for three weeks. Your opponent holds the ground, and you arrive fresh in a campaign already written." } }
  ]
},

{
  "id": "race_debat_local",
  "weight": 3,
  "race": ["municipales", "legislatives", "europeennes"],
  "cast": "opponent",
  "tag": { "fr": "Débat", "en": "The debate" },
  "text": {
    "fr": "Le débat organisé par le journal local, dans une salle de deux cents places à moitié pleine. {rival} y sera, et la vidéo fera plus de vues que la salle n'a de sièges.",
    "en": "The debate organised by the local paper, in a two-hundred-seat hall half full. {rival} will be there, and the video will get more views than the hall has seats."
  },
  "choices": [
    { "label": { "fr": "Parler du dossier que vous connaissez par cœur", "en": "Talk about the file you know by heart" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 6 },
        "result": { "fr": "Vous citez trois chiffres justes et une rue précise. Dans la salle, quelqu'un dit à voix haute que vous, au moins, vous savez de quoi vous parlez.",
                    "en": "You quote three accurate figures and one specific street. Somebody in the hall says out loud that you, at least, know what you are talking about." } },
      "failure": { "effects": { "score": -8, "popularity": -3 },
        "result": { "fr": "Vous parlez douze minutes de sous-préfecture et de schéma directeur. La salle décroche à la quatrième.",
                    "en": "You speak for twelve minutes about zoning and strategic plans. The hall gives up at the fourth." } } },
    { "label": { "fr": "Attaquer son bilan", "en": "Attack his record" },
      "effects": { "score": 3, "reputation": -1, "popularity": -1, "strike": "intrepide" },
      "result": { "fr": "Vous sortez ses votes et ses absences, un par un. C'est efficace, c'est désagréable, et la salle vous en veut un peu de lui avoir fait ça.",
                  "en": "You produce his votes and his absences, one by one. It works, it is unpleasant, and the hall holds it against you slightly." } },
    { "label": { "fr": "Promettre ce qui ne dépend pas de vous", "en": "Promise what does not depend on you" },
      "effects": { "score": 7, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "Vous annoncez la réouverture de la ligne et le maintien de l'école. Les deux relèvent de l'État, et la salle applaudit quand même.",
                  "en": "You announce the line reopening and the school staying put. Both are national decisions, and the hall applauds anyway." } }
  ]
},

{
  "id": "race_soutien_national",
  "weight": 3,
  "race": ["municipales", "legislatives", "europeennes"],
  "cast": "camp",
  "tag": { "fr": "Renfort", "en": "Reinforcements" },
  "text": {
    "fr": "{rival} propose de venir tenir un meeting avec vous. Sa présence remplit une salle et sa signature au bas de vos affiches vaut ce que vaut sa popularité, dans les deux sens.",
    "en": "{rival} offers to come and hold a rally with you. His presence fills a hall, and his name at the bottom of your posters is worth exactly what his popularity is worth, in both directions."
  },
  "choices": [
    { "label": { "fr": "Le faire venir", "en": "Bring him in" },
      "effects": { "score": 4, "popularity": -2 },
      "result": { "fr": "La salle est pleine, les caméras sont là, et la moitié des questions portent sur lui. Vous gagnez des voix et vous perdez la campagne, qui devient la sienne.",
                  "en": "The hall is full, the cameras are there, and half the questions are about him. You gain votes and lose the campaign, which becomes his." } },
    { "label": { "fr": "Faire campagne seul", "en": "Campaign alone" },
      "effects": { "score": -2, "standing": -5 },
      "result": { "fr": "Ni logo, ni parrain, ni affiche nationale. On vous reproche votre distance à la direction, et on vote pour vous à cause d'elle.",
                  "en": "No logo, no patron, no national poster. You are criticised for your distance from the leadership, and voted for because of it." } },
    { "label": { "fr": "Le faire venir et le laisser parler du national", "en": "Bring him in and let him talk national" },
      "effects": { "score": 1, "energie": 1, "popularity": -4 },
      "result": { "fr": "Il fait quarante minutes de politique nationale devant des électeurs venus parler de leur rue. La fédération est ravie.",
                  "en": "He does forty minutes of national politics in front of voters who came to talk about their street. The federation is delighted." } }
  ]
},

{
  "id": "race_incident",
  "moment": 2,
  "weight": 3,
  "tag": { "fr": "Incident de campagne", "en": "Campaign incident" },
  "text": {
    "fr": "À dix jours du scrutin, un tract anonyme circule dans les boîtes aux lettres. Il ne dit rien de faux, il dit tout de travers, et il est très bien fait.",
    "en": "Ten days out, an anonymous leaflet is going round the letterboxes. It says nothing false, it says everything crooked, and it is very well made."
  },
  "choices": [
    { "label": { "fr": "Répondre par un tract de votre côté", "en": "Answer with a leaflet of your own" },
      "effects": { "score": 0, "money": -6000, "energie": -1 },
      "result": { "fr": "Vous répondez point par point sur quatre pages. Ceux qui lisent les quatre pages avaient déjà décidé de voter pour vous.",
                  "en": "You answer point by point over four pages. The people who read all four pages had already decided to vote for you." } },
    { "label": { "fr": "Porter plainte et le faire savoir", "en": "File a complaint and say so" },
      "effects": { "score": -3, "popularity": -2 },
      "result": { "fr": "La plainte fait trois lignes dans le journal, le tract en a fait dix mille dans les boîtes. Mais la prochaine fois, ils hésiteront.",
                  "en": "The complaint gets three lines in the paper; the leaflet got ten thousand copies through letterboxes. But next time they will hesitate." } },
    { "label": { "fr": "Trouver qui l'a payé", "en": "Find out who paid for it" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 6 },
        "result": { "fr": "L'imprimeur est bavard et la facture porte un nom. Vous ne publiez rien, vous passez un coup de fil, et le tract disparaît des boîtes en deux jours.",
                    "en": "The printer is talkative and the invoice carries a name. You publish nothing, you make one telephone call, and the leaflet vanishes from letterboxes in two days." } },
      "failure": { "effects": { "score": -7, "energie": -2 },
        "result": { "fr": "Vous passez la dernière semaine à enquêter au lieu de faire campagne. Vous ne trouvez rien et vous avez perdu six jours.",
                    "en": "You spend the last week investigating instead of campaigning. You find nothing, and you have lost six days." } } }
  ]
},

{
  "id": "race_motion",
  "moment": 2,
  "weight": 4,
  "race": ["congres"],
  "cast": "camp",
  "tag": { "fr": "Motion", "en": "The motion" },
  "text": {
    "fr": "Un congrès ne se gagne pas devant les militants, il se gagne dans le texte de la motion. Trois lignes sur l'Europe et deux sur la fiscalité décideront de qui peut voter pour vous.",
    "en": "A party conference is not won in front of the members, it is won in the wording of the motion. Three lines on Europe and two on tax will decide who is able to vote for you."
  },
  "choices": [
    { "label": { "fr": "Écrire un texte de rassemblement", "en": "Write a text everyone can live with" },
      "effects": { "strike": "appareil", "score": 4, "popularity": -3, "reputation": -1 },
      "result": { "fr": "Quatre pages qui ne fâchent personne et qu'aucun militant ne relira. Deux courants s'y retrouvent, ce qui était tout l'objectif.",
                  "en": "Four pages that upset nobody and that no member will read twice. Two factions can live with it, which was the entire point." } },
    { "label": { "fr": "Écrire ce que vous pensez vraiment", "en": "Write what you actually think" },
      "effects": { "score": -6, "standing": -2 },
      "result": { "fr": "Un texte clair, tranchant, qui fait le tour de la presse et perd deux fédérations en une matinée.",
                  "en": "A clear, sharp text that goes round the press and loses two federations in a morning." } },
    { "label": { "fr": "Reprendre le texte du sortant en changeant trois mots", "en": "Take the incumbent's text and change three words" },
      "when": { "personality": ["calculating"] },
      "effects": { "score": 7, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "Personne ne peut vous reprocher un texte qu'ils ont tous voté l'an dernier. {rival} met trois semaines à comprendre ce qui lui arrive.",
                  "en": "Nobody can attack you over a text they all voted for last year. {rival} takes three weeks to understand what is happening to him." } }
  ]
},

{
  "id": "race_couloirs",
  "moment": 1,
  "weight": 4,
  "race": ["congres"],
  "tag": { "fr": "Couloirs", "en": "The corridors" },
  "text": {
    "fr": "Deux jours de congrès, quatre mille militants, et l'essentiel qui se joue dans un couloir entre la salle et la buvette.",
    "en": "Two days of conference, four thousand members, and everything that matters happening in a corridor between the hall and the bar."
  },
  "choices": [
    { "label": { "fr": "Promettre des postes", "en": "Promise posts" },
      "effects": { "strike": "appareil", "score": 7, "reputation": -2 },
      "result": { "fr": "Onze promesses pour sept postes. Vous réglerez ça après, et quatre personnes vous détesteront pour toujours.",
                  "en": "Eleven promises for seven posts. You will sort that out afterwards, and four people will hate you for good." } },
    { "label": { "fr": "Tenir la buvette jusqu'à trois heures du matin", "en": "Hold the bar until three in the morning" },
      "effects": { "score": 3, "energie": -3 },
      "result": { "fr": "Deux nuits, cent conversations, et le sentiment très net que rien de tout cela ne se serait dit à jeun.",
                  "en": "Two nights, a hundred conversations, and the distinct sense that none of it would have been said sober." } },
    { "label": { "fr": "Rester dans la salle et travailler le texte", "en": "Stay in the hall and work on the text" },
      "effects": { "score": -2, "energie": 1 },
      "result": { "fr": "Vous suivez les débats, vous prenez des notes et vous êtes le seul candidat à savoir ce qui a été voté. Ça ne sert à rien ce week-end.",
                  "en": "You follow the debates, you take notes and you are the only candidate who knows what was voted. It is of no use whatsoever this weekend." } }
  ]
},

{
  "id": "race_derniere_semaine",
  "moment": 1,
  "weight": 3,
  "tag": { "fr": "Dernière semaine", "en": "The last week" },
  "text": {
    "fr": "Sept jours, une caisse presque vide et une équipe qui n'en peut plus. Ce qui se décide maintenant ne se rattrapera pas.",
    "en": "Seven days, an almost empty account and a team running on fumes. What gets decided now cannot be undone."
  },
  "choices": [
    { "label": { "fr": "Tout mettre sur les indécis", "en": "Put everything into the undecided" },
      "roll": { "base": 14, "stat": "energie", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 8, "energie": -3 },
        "result": { "fr": "Quatre mille portes en six jours. Les derniers jours d'une campagne appartiennent à ceux qui tiennent debout.",
                    "en": "Four thousand doors in six days. The last days of a campaign belong to whoever is still standing." } },
      "failure": { "effects": { "score": -6, "energie": -4, "trait": "use" },
        "result": { "fr": "Vous finissez la campagne aphone, à deux réunions par jour, et la dernière est un désastre que trois cents personnes ont vu.",
                    "en": "You finish the campaign with no voice, two meetings a day, and the last one is a disaster three hundred people watched." } } },
    { "label": { "fr": "Sortir votre argent personnel", "en": "Put in your own money" },
      "when": { "minMoney": 40000 },
      "effects": { "score": 6, "money": -28000, "reputation": -1 },
      "result": { "fr": "Un affichage complet, deux encarts et un envoi postal à tous les électeurs. La déclaration de compte de campagne posera des questions.",
                  "en": "Full billboard coverage, two press inserts and a mailshot to every voter. The campaign accounts will raise questions." } },
    { "label": { "fr": "Laisser courir et préparer la suite", "en": "Let it run and prepare for what comes next" },
      "effects": { "score": -7, "energie": 3, "strike": "lache" },
      "result": { "fr": "Vous levez le pied et vous passez la semaine à préparer l'après, quel qu'il soit. C'est raisonnable, et ça se voit sur les affiches vides.",
                  "en": "You ease off and spend the week preparing for the aftermath, whatever it is. It is sensible, and it shows on the empty billboards." } }
  ]
}
,

{
  "id": "race_liste",
  "moment": 3,
  "weight": 4,
  "race": ["municipales"],
  "tag": { "fr": "La liste", "en": "The slate" },
  "text": {
    "fr": "Trente-cinq noms à trouver, et deux fois plus de gens qui estiment y avoir droit. Une liste municipale est le seul document où l'on voit d'un coup d'œil qui vous devez remercier et qui vous avez décidé de perdre.",
    "en": "Thirty-five names to find, and twice as many people who believe they are owed a place. A municipal slate is the only document where you can see at a glance who you have to thank and who you have decided to lose."
  },
  "choices": [
    { "label": { "fr": "Une liste d'ouverture, avec des visages neufs", "en": "An open slate, with new faces" },
      "effects": { "score": 6, "energie": -2, "standing": -6 },
      "result": { "fr": "Une commerçante, un médecin, deux enseignantes et personne du parti. Les militants l'apprennent par le journal et la fédération met un an à digérer.",
                  "en": "A shopkeeper, a doctor, two teachers and nobody from the party. The members find out from the paper and the federation takes a year to digest it." } },
    { "label": { "fr": "Récompenser ceux qui ont tenu la permanence", "en": "Reward the people who kept the office open" },
      "effects": { "score": -3, "standing": 8 },
      "result": { "fr": "Une liste de fidèles, dont quatre qui ont déjà perdu deux fois. Ils le méritent tous, et c'est bien le problème.",
                  "en": "A slate of loyalists, four of whom have already lost twice. They all deserve it, and that is exactly the problem." } },
    { "label": { "fr": "Aller chercher une figure locale qui vous déteste", "en": "Go and get a local figure who dislikes you" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 9, "energie": -1 },
        "result": { "fr": "Il accepte la troisième place et deux délégations. Son quartier bascule avec lui, et vous savez déjà ce qu'il vous coûtera dans trois ans.",
                    "en": "He takes third place and two portfolios. His neighbourhood swings with him, and you already know what he will cost you in three years." } },
      "failure": { "effects": { "score": -5, "energie": -1, "reputation": -1 },
        "result": { "fr": "Il refuse, puis raconte votre visite en détail sur la radio locale. Vous avez fait sa campagne en une matinée.",
                    "en": "He refuses, then describes your visit in detail on local radio. You made his campaign in a single morning." } } }
  ]
},

{
  "id": "race_parachute",
  "weight": 4,
  "race": ["municipales", "legislatives"],
  "tag": { "fr": "D'où vous venez", "en": "Where you come from" },
  "text": {
    "fr": "Une affichette circule avec une carte, deux dates et une question : depuis quand habitez-vous vraiment ici ? Le fait est établi, la conclusion est fausse, et tout le monde s'en fiche.",
    "en": "A flyer is going round with a map, two dates and a question: how long have you actually lived here? The fact is established, the conclusion is wrong, and nobody cares either way."
  },
  "choices": [
    { "label": { "fr": "Raconter votre histoire ici, en détail", "en": "Tell your story here, in detail" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 7 },
        "result": { "fr": "Vous citez l'école, la rue et le nom du boulanger d'avant. Ce n'est pas une réponse, c'est une preuve, et elle suffit.",
                    "en": "You name the school, the street and the baker who was there before. It is not an answer, it is a proof, and it does the job." } },
      "failure": { "effects": { "score": -4, "popularity": -3 },
        "result": { "fr": "Vous vous justifiez pendant six minutes. Celui qui se justifie a déjà perdu la question.",
                    "en": "You explain yourself for six minutes. Whoever explains himself has already lost the argument." } } },
    { "label": { "fr": "Assumer et parler d'autre chose", "en": "Own it and talk about something else" },
      "effects": { "score": 2, "sangfroid": 1 },
      "result": { "fr": "Vous dites que vous êtes arrivé il y a onze ans et que vous comptez mourir ici. On passe au dossier suivant.",
                  "en": "You say you arrived eleven years ago and intend to die here. Everyone moves on to the next question." } },
    { "label": { "fr": "Répondre par le passé de votre adversaire", "en": "Answer with your opponent's own record" },
      "effects": { "score": 4, "reputation": -2, "strike": "intrepide" },
      "result": { "fr": "Vous rappelez qu'il a été candidat dans deux autres villes avant celle-ci. C'est vrai, c'est bas, et la campagne devient une affaire de cadastre.",
                  "en": "You point out that he stood in two other towns before this one. It is true, it is cheap, and the campaign becomes an argument about land registry." } }
  ]
},

{
  "id": "race_vague",
  "weight": 4,
  "race": ["legislatives", "europeennes"],
  "tag": { "fr": "La vague", "en": "The wave" },
  "text": {
    "fr": "Ce scrutin ne parle pas de vous. Il parle du gouvernement, d'un mot prononcé à Paris et d'une colère qui n'a rien à voir avec votre circonscription. Vous êtes un bulletin dans un référendum qui n'existe pas.",
    "en": "This election is not about you. It is about the government, about a word said in the capital and about an anger that has nothing to do with your constituency. You are a ballot paper in a referendum that does not exist."
  },
  "choices": [
    { "label": { "fr": "Épouser la vague nationale", "en": "Ride the national wave" },
      "effects": { "score": 6, "standing": 4, "popularity": -3 },
      "result": { "fr": "Vous reprenez mot pour mot les éléments de langage du parti, y compris celui auquel vous ne croyez pas. Ça marche, et vous n'aurez plus jamais l'air d'autre chose.",
                  "en": "You repeat the party's talking points word for word, including the one you do not believe. It works, and you will never look like anything else again." } },
    { "label": { "fr": "Localiser la campagne de force", "en": "Force the campaign back to local ground" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "energie": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 8, "energie": -2, "reputation": 1 },
        "result": { "fr": "Vous ne parlez que de la ligne de bus, du collège et de l'hôpital. À la fin, on vote pour vous en votant contre votre camp.",
                    "en": "You talk about nothing but the bus route, the school and the hospital. In the end, people vote for you while voting against your side." } },
      "failure": { "effects": { "score": -5, "energie": -2 },
        "result": { "fr": "Personne ne veut parler du collège. Toutes les questions portent sur une phrase prononcée à quatre cents kilomètres d'ici.",
                    "en": "Nobody wants to talk about the school. Every question is about a sentence said four hundred kilometres away." } } },
    { "label": { "fr": "Prendre publiquement vos distances avec la direction", "en": "Publicly distance yourself from the leadership" },
      "effects": { "score": 5, "standing": -11, "popularity": 4, "strike": "intrepide" },
      "result": { "fr": "Vous dites tout haut ce que vos électeurs pensent de votre propre camp. Ils vous réélisent, et la direction vous fait payer pendant cinq ans.",
                  "en": "You say out loud what your voters think of your own side. They re-elect you, and the leadership makes you pay for five years." } }
  ]
},

{
  "id": "race_gaffe_nationale",
  "moment": 2,
  "weight": 3,
  "race": ["legislatives", "europeennes"],
  "cast": "camp",
  "tag": { "fr": "À quatre cents kilomètres", "en": "Four hundred kilometres away" },
  "text": {
    "fr": "À dix jours du scrutin, {rival} lâche une phrase que personne ne pourra rattraper. Elle passe en boucle, elle n'a rien à voir avec votre campagne, et elle vous coûtera des voix ici.",
    "en": "Ten days out, {rival} says something nobody will be able to walk back. It runs on a loop, it has nothing to do with your campaign, and it will cost you votes here."
  },
  "choices": [
    { "label": { "fr": "Le désavouer immédiatement", "en": "Disown him immediately" },
      "effects": { "score": 5, "standing": -9, "reputation": 1 },
      "result": { "fr": "Vous êtes le premier du parti à le dire, et le seul pendant six heures. Ces six heures-là compteront dans les deux sens.",
                  "en": "You are the first in the party to say it, and the only one for six hours. Those six hours will count both ways." } },
    { "label": { "fr": "Faire bloc", "en": "Close ranks" },
      "effects": { "score": -6, "standing": 8 },
      "result": { "fr": "Vous expliquez qu'on a sorti la phrase de son contexte, ce qui est faux et se voit. La direction vous en sera reconnaissante longtemps.",
                  "en": "You explain that the sentence was taken out of context, which is untrue and shows. The leadership will remember it for a long time." } },
    { "label": { "fr": "Ne pas commenter et rester sur le terrain", "en": "No comment, and stay on the ground" },
      "effects": { "score": -1, "energie": -1, "sangfroid": 1, "strike": "lache" },
      "result": { "fr": "Vous passez la journée dans une zone commerciale à ne répondre à aucun journaliste. C'est raisonnable et personne ne s'en souviendra.",
                  "en": "You spend the day in a retail park refusing to answer any journalist. It is sensible and nobody will remember it." } }
  ]
},

{
  "id": "race_abstention",
  "weight": 4,
  "race": ["europeennes"],
  "tag": { "fr": "Personne ne vote", "en": "Nobody votes" },
  "text": {
    "fr": "Les enquêtes annoncent une participation autour de quarante pour cent. La campagne n'intéresse personne, ce qui veut dire que le scrutin se jouera sur ceux qui se déplacent quand même, et on sait très bien qui ils sont.",
    "en": "The surveys forecast a turnout around forty per cent. The campaign interests nobody, which means the result will be decided by the people who turn out anyway, and everybody knows exactly who they are."
  },
  "choices": [
    { "label": { "fr": "Mobiliser votre base et elle seule", "en": "Mobilise your base and nobody else" },
      "effects": { "score": 7, "popularity": -4, "strike": "radical" },
      "result": { "fr": "Vous parlez cinq semaines à ceux qui votent déjà pour vous, avec les mots qu'ils attendent. C'est efficace et c'est exactement pour ça que ce scrutin est ce qu'il est.",
                  "en": "You spend five weeks talking to people who already vote for you, in the words they expect. It works, and it is exactly why this election is what it is." } },
    { "label": { "fr": "Faire campagne pour la participation elle-même", "en": "Campaign for turnout itself" },
      "effects": { "score": -2, "reputation": 3, "energie": -2 },
      "result": { "fr": "Vous expliquez pendant cinq semaines à quoi sert ce Parlement. Les salles sont vides et deux professeurs vous écrivent pour vous remercier.",
                  "en": "You spend five weeks explaining what this Parliament is for. The halls are empty and two teachers write to thank you." } },
    { "label": { "fr": "Transformer le scrutin en sanction du gouvernement", "en": "Turn the election into a verdict on the government" },
      "effects": { "score": 8, "reputation": -2, "landscape": { "ruling": -1.2 } },
      "result": { "fr": "Vous ne parlez pas une fois de l'Europe en cinq semaines. C'est la meilleure façon de gagner une européenne, et tout le monde le sait depuis quarante ans.",
                  "en": "You do not mention Europe once in five weeks. It is the best way to win a European election, and everybody has known it for forty years." } }
  ]
},

{
  "id": "race_journal_local",
  "weight": 3,
  "race": ["municipales", "legislatives"],
  "tag": { "fr": "Le journal local", "en": "The local paper" },
  "text": {
    "fr": "Le quotidien régional prépare son portrait de chaque candidat. Deux pages, une photo, et un journaliste qui couvre la ville depuis vingt-deux ans et connaît vos dossiers mieux que vous.",
    "en": "The regional daily is preparing its profile of each candidate. Two pages, a photograph, and a reporter who has covered the town for twenty-two years and knows your files better than you do."
  },
  "choices": [
    { "label": { "fr": "Lui ouvrir vos archives et vos comptes", "en": "Open your files and your accounts to him" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 7, "reputation": 2 },
        "result": { "fr": "Il trouve deux erreurs et beaucoup de travail. Le portrait est honnête, un peu sévère, et il vaut trois pages de publicité.",
                    "en": "He finds two mistakes and a great deal of work. The profile is honest, slightly severe, and it is worth three pages of advertising." } },
      "failure": { "effects": { "score": -6, "reputation": -2 },
        "result": { "fr": "Il trouve exactement ce que vous aviez oublié. Le portrait s'ouvre sur un chiffre et se referme sur une question sans réponse.",
                    "en": "He finds exactly what you had forgotten. The profile opens on a figure and closes on an unanswered question." } } },
    { "label": { "fr": "Ne répondre que par écrit", "en": "Answer only in writing" },
      "effects": { "score": -3, "sangfroid": 1 },
      "result": { "fr": "Vos réponses sont irréprochables et parfaitement mortes. Le journal publie le questionnaire tel quel, ce qui est une façon de vous punir.",
                  "en": "Your answers are impeccable and completely dead. The paper prints the questionnaire as it is, which is its way of punishing you." } },
    { "label": { "fr": "Acheter deux pages de publicité la même semaine", "en": "Buy two pages of advertising the same week" },
      "when": { "minMoney": 25000 },
      "effects": { "score": 5, "money": -14000, "reputation": -1 },
      "result": { "fr": "Personne ne fera jamais le lien, et tout le monde le fera. Le portrait paraît, aimable, à côté de votre encart.",
                  "en": "Nobody will ever make the connection, and everybody will. The profile appears, friendly, next to your advertisement." } }
  ]
},

{
  "id": "race_salle_vide",
  "weight": 3,
  "tag": { "fr": "La salle", "en": "The hall" },
  "text": {
    "fr": "Vous avez loué une salle de quatre cents places. Il y a soixante personnes, dont onze de votre équipe, et un photographe du journal qui prend la salle plutôt que la tribune.",
    "en": "You booked a four-hundred-seat hall. Sixty people are there, eleven of them your own team, and a press photographer shooting the room rather than the platform."
  },
  "choices": [
    { "label": { "fr": "Faire le meeting quand même, à fond", "en": "Do the rally anyway, full force" },
      "effects": { "score": 3, "energie": -2 },
      "result": { "fr": "Vous parlez cinquante minutes comme s'ils étaient quatre cents. Les soixante en parleront pendant un mois, chacun à vingt personnes.",
                  "en": "You speak for fifty minutes as if there were four hundred of them. The sixty will talk about it for a month, each to twenty people." } },
    { "label": { "fr": "Descendre de scène et faire un cercle", "en": "Come down from the platform and form a circle" },
      "effects": { "score": 6, "energie": -1, "reputation": 1 },
      "result": { "fr": "Vous renvoyez le pupitre en coulisses et vous vous asseyez au milieu d'eux. La photo du journal change complètement de sens.",
                  "en": "You send the lectern backstage and sit down among them. The photograph in the paper takes on a completely different meaning." } },
    { "label": { "fr": "Annuler et invoquer un contretemps", "en": "Cancel and cite a scheduling problem" },
      "effects": { "score": -5, "energie": 2, "strike": "lache" },
      "result": { "fr": "Vous partez avant le début en laissant votre suppléant lire un texte. Le photographe garde le cliché de la salle vide pour une autre fois.",
                  "en": "You leave before it starts, letting your deputy read out a statement. The photographer keeps the empty-hall shot for another occasion." } }
  ]
},

{
  "id": "race_succession",
  "weight": 4,
  "race": ["congres"],
  "cast": "camp",
  "tag": { "fr": "La succession", "en": "The succession" },
  "text": {
    "fr": "{rival} ne se représentera pas, et il n'a désigné personne. Sa dernière semaine à la tête du parti vaut plus que toutes vos motions : ce qu'il dira de vous en partant décidera d'une partie des voix.",
    "en": "{rival} will not stand again, and has designated nobody. His last week at the head of the party is worth more than all your motions: what he says about you on the way out will decide a share of the votes."
  },
  "choices": [
    { "label": { "fr": "Lui rendre un hommage appuyé au congrès", "en": "Pay him a heavy tribute at the conference" },
      "effects": { "score": 6, "reputation": -1 },
      "result": { "fr": "Douze minutes sur son bilan, dont vous ne pensez pas un mot. Il vous cite le lendemain, sans vous désigner, et tout le monde comprend.",
                  "en": "Twelve minutes on his record, not a word of which you believe. He quotes you the next day, without naming you, and everyone understands." } },
    { "label": { "fr": "Faire campagne contre son bilan", "en": "Campaign against his record" },
      "effects": { "score": -4, "popularity": 5, "reputation": 2, "strike": "intrepide" },
      "result": { "fr": "Vous dites que le parti a perdu dix ans. C'est vrai, la presse le reprend, et les militants qui ont vécu ces dix ans votent contre vous.",
                  "en": "You say the party lost ten years. It is true, the press picks it up, and the members who lived through those ten years vote against you." } },
    { "label": { "fr": "Lui promettre de garder ses équipes", "en": "Promise to keep his people" },
      "effects": { "score": 9, "standing": 3, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "Vous garantissez leurs postes à ses quatre fidèles. Vous en garderez deux, et les deux autres l'apprendront par un communiqué.",
                  "en": "You guarantee the jobs of his four loyalists. You will keep two, and the other two will find out from a press release." } }
  ]
}

]

};
