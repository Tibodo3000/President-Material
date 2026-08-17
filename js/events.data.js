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
 *   "when": { ... },                    // conditions d'apparition (voir plus bas)
 *   "tag":  { "fr": "...", "en": "..." },
 *   "text": { "fr": "...", "en": "..." },
 *   "choices": [ ... ]
 * }
 *
 * CASTING ("cast") — qui est la figure désignée par {rival} :
 *   "opponent"   une figure d'un autre parti, tirée au poids de son camp
 *   "leader"     le chef d'un autre parti, même pondération
 *   "camp"       une figure de votre propre parti
 *   (absent)     n'importe qui
 * Le nom est tiré au moment où la carte sort et ne change plus : la question,
 * le résultat et les effets visent la même personne.
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
 *   "ruling": true                                votre camp gouverne
 *   "allied": false                               vous avez un pacte en cours
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
 *                  "reseau", "notoriete", "reputation"   (bornées 0-10)
 *   jauges       : "popularity", "standing"              (bornées 0-100)
 *   "money": 80000                                       en euros
 *   "poll": 5                                            campagne uniquement
 *   "flags": { "dirtyMoney": true }                      pose ou retire un drapeau
 *   "strike": "menteur"                                  UN ÉCART DE PLUS.
 *          Certaines marques ne s'attrapent pas du premier coup : il faut
 *          récidiver. L'événement signale l'écart, le moteur compte, et la
 *          marque tombe au énième. Le nombre est dans js/traits.data.js.
 *   "chain": "id_evenement"                              force l'événement suivant
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
 *          sans passer par les urnes (ministre, député européen, retour au
 *          groupe). Le sommet atteint dans la carrière suit tout seul.
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
   1. DÉBUTS DE CARRIÈRE — militant et conseiller
   ========================================================================== */

{
  "id": "cause_locale",
  "when": { "position": ["militant", "conseiller"] },
  "tag": { "fr": "Terrain", "en": "On the ground" },
  "text": {
    "fr": "Un collectif se bat contre la fermeture de la maternité. Ils cherchent un visage pour porter la pétition.",
    "en": "A local group is fighting the maternity ward closure. They need a face for the petition."
  },
  "choices": [
    { "label": { "fr": "Devenir ce visage", "en": "Become that face" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reseau": 1, "notoriete": 1, "energie": -2, "popularity": 12, "standing": 4 },
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
  "when": { "position": ["militant", "conseiller"] },
  "tag": { "fr": "Militantisme", "en": "Canvassing" },
  "text": {
    "fr": "La fédération organise une campagne de porte-à-porte. Personne ne se bat pour prendre les quartiers difficiles.",
    "en": "The local party is organising a canvassing drive. Nobody is fighting to take the hard neighbourhoods."
  },
  "choices": [
    { "label": { "fr": "Prendre les quartiers que personne ne veut", "en": "Take the ones nobody wants" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "energie": -2, "reputation": 1, "popularity": 8, "standing": 3, "trait": "bosseur" },
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
  "when": { "position": ["militant", "conseiller"], "maxTurn": 12 },
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
      "effects": { "energie": 1, "reseau": 1, "popularity": -5 },
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
      "success": { "effects": { "notoriete": 2, "popularity": 12, "standing": 2 },
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
      "effects": { "notoriete": 3, "reputation": -2, "popularity": 9, "standing": -14, "strike": "radical" },
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
      "failure": { "effects": { "reputation": -1, "popularity": -13, "standing": -6 },
        "result": { "fr": "Le rire sonne faux. La séquence vit sa vie.",
                    "en": "The laugh rings false. The clip lives its own life." } } },
    { "label": { "fr": "Communiqué de clarification", "en": "Issue a clarification" },
      "effects": { "notoriete": -1, "popularity": -5, "standing": 4 },
      "result": { "fr": "Le communiqué éteint l'incendie et tout intérêt pour vous.",
                  "en": "The statement kills the fire, and any interest in you." } },
    { "label": { "fr": "Assumer et répéter la phrase", "en": "Own it and say it again" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 3, "reputation": -2, "popularity": 7, "standing": -12 },
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
      "success": { "effects": { "notoriete": 2, "popularity": 12, "standing": -5, "trait": "bete_scene" },
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
      "effects": { "notoriete": 2, "reputation": 3, "popularity": 11, "standing": -9, "trait": "intouchable" },
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
      "effects": { "reputation": 3, "popularity": 12, "standing": -11 },
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
      "effects": { "reputation": 2, "popularity": 8, "standing": -4 },
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
  "when": { "position": ["militant", "conseiller"] },
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
      "effects": { "reseau": 2, "standing": 12, "sangfroid": 1, "reputation": -2, "popularity": -6 },
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
      "effects": { "standing": 9, "reputation": -2, "popularity": -9, "trait": "appareil" },
      "result": { "fr": "Le fils est investi. Tout le monde a compris, personne n'a rien dit.",
                  "en": "The son is nominated. Everyone understood; nobody said a word." } },
    { "label": { "fr": "Refuser et rompre", "en": "Refuse and break with him" },
      "effects": { "standing": -11, "reputation": 2, "popularity": 10, "reseau": -1 },
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
      "effects": { "standing": 8, "reseau": 1, "notoriete": -1, "popularity": -4, "chain": "protege_trahison" },
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
      "success": { "effects": { "reseau": 1, "notoriete": 1, "standing": 9, "popularity": -2 },
        "result": { "fr": "Vous rappelez qui tient la maison. Ça calme, pour un temps.",
                    "en": "You remind everyone who runs the house. It quiets things, for a while." } },
      "failure": { "effects": { "reseau": -2, "standing": -17 },
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
      "roll": { "stat": "sangfroid", "base": 14, "dice": 16 },
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
      "roll": { "chance": 0.45,
                "chanceBonus": [ { "when": { "minMoney": 500000 }, "value": 0.2 },
                                 { "when": { "minMoney": 2000000 }, "value": 0.12 },
                                 { "when": { "background": ["law"] }, "value": 0.12 },
                                 { "when": { "minStanding": 65 }, "value": 0.08 } ] },
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
                "bonus": [ { "when": { "background": ["law"] }, "value": 2 },
                           { "when": { "minMoney": 1000000 }, "value": 1.5 },
                           { "when": { "maxPopularity": 30 }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "flags": { "onTrial": false, "dirtyMoney": false }, "reputation": -1, "notoriete": 1, "popularity": -10, "standing": -10, "strike": "casserole" },
        "result": { "fr": "Relaxe au bénéfice du doute. Vous ressortez libre et abîmé.",
                    "en": "Acquitted on the benefit of the doubt. You walk out free and damaged." } },
      "failure": { "effects": { "end": "conviction" },
        "result": { "fr": "Coupable. Inéligibilité immédiate. Votre carrière s'arrête sur les marches du tribunal.",
                    "en": "Guilty. An immediate ban from office. Your career ends on the courthouse steps." } } },
    { "label": { "fr": "Plaider coupable pour limiter la peine", "en": "Plead guilty to limit the sentence" },
      "roll": { "chance": 0.35 },
      "success": { "effects": { "flags": { "onTrial": false, "dirtyMoney": false }, "money": -200000, "reputation": -2, "popularity": -18, "standing": -20 },
        "result": { "fr": "Amende lourde, pas d'inéligibilité. Vous survivez politiquement, de justesse.",
                    "en": "A heavy fine, no ban. You survive politically, barely." } },
      "failure": { "effects": { "end": "conviction" },
        "result": { "fr": "Le tribunal ne vous fait aucun cadeau. Inéligibilité et fin de parcours.",
                    "en": "The court shows no mercy. Banned from office, and that is the end." } } }
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
      "effects": { "standing": 8, "reputation": 1, "popularity": -6, "notoriete": -1 },
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
      "success": { "effects": { "notoriete": 2, "reputation": 1, "popularity": 14, "standing": 2, "trait": "orateur" },
        "result": { "fr": "Vous dominez l'échange. Les extraits vous donnent le beau rôle.",
                    "en": "You dominate the exchange. The clips flatter you." } },
      "failure": { "effects": { "notoriete": 1, "reputation": -1, "popularity": -11, "standing": -5 },
        "result": { "fr": "L'adversaire était préparé. Vous encaissez plus que vous ne rendez.",
                    "en": "Your opponent came prepared. You take more than you give." } } },
    { "label": { "fr": "Décliner avec dédain", "en": "Decline with disdain" },
      "effects": { "notoriete": -1, "sangfroid": 1, "popularity": -5, "standing": 2 },
      "result": { "fr": "« Je ne débats pas avec tout le monde. » La formule amuse, ou agace.",
                  "en": "“I don't debate just anyone.” The line amuses some and grates on others." } },
    { "label": { "fr": "Le préparer comme une plaidoirie", "en": "Prepare it like a court case" },
      "when": { "background": ["law"] },
      "effects": { "eloquence": 1, "energie": -2, "notoriete": 1, "popularity": 12, "standing": 5 },
      "result": { "fr": "Vous arrivez avec des pièces, des dates et des citations. L'exercice tourne au procès.",
                  "en": "You arrive with documents, dates and quotations. The debate turns into a trial." } },
    { "label": { "fr": "En faire un spectacle", "en": "Turn it into a show" },
      "when": { "background": ["celebrity"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 13, "reputation": -1 },
        "result": { "fr": "Le débat devient un moment de télévision. On ne retient pas les arguments, on retient vous.",
                    "en": "The debate becomes television. Nobody remembers the arguments; they remember you." } },
      "failure": { "effects": { "reputation": -2, "popularity": -8, "standing": -6 },
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
      "success": { "effects": { "notoriete": 2, "popularity": 11, "standing": 3 },
        "result": { "fr": "Votre réplique fait le tour des rédactions. Match gagné.",
                    "en": "Your reply makes the rounds. Point won." } },
      "failure": { "effects": { "reputation": -1, "popularity": -8, "standing": -3 },
        "result": { "fr": "La réplique tombe à plat. On vous sent piqué.",
                    "en": "The reply falls flat. You sound stung." } } },
    { "label": { "fr": "Laisser dire", "en": "Let it go" },
      "effects": { "sangfroid": 1, "notoriete": -1, "popularity": -2, "standing": 6 },
      "result": { "fr": "Pas de réponse, pas de séquence. L'appareil apprécie le calme.",
                  "en": "No reply, no story. The machine appreciates the calm." } },
    { "label": { "fr": "Désarmer par l'humour", "en": "Disarm it with humour" },
      "when": { "personality": ["charming"] },
      "effects": { "charisme": 1, "popularity": 10, "standing": -5 },
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
      "effects": { "notoriete": 1, "reputation": -1, "popularity": 4, "standing": -7 },
      "result": { "fr": "Le coup porte. On retiendra aussi que c'est vous qui l'avez porté.",
                  "en": "The blow lands. People will also remember who threw it." } },
    { "label": { "fr": "Rester digne", "en": "Stay above it" },
      "effects": { "reputation": 1, "popularity": -3, "standing": 7 },
      "result": { "fr": "« Je ne commente pas les affaires. » La sobriété paie, parfois.",
                  "en": "“I don't comment on legal matters.” Restraint pays, sometimes." } },
    { "label": { "fr": "Prendre publiquement sa défense", "en": "Publicly defend him" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "popularity": 9, "standing": -5 },
      "result": { "fr": "Défendre un adversaire surprend tout le monde. On vous regarde autrement.",
                  "en": "Defending an opponent surprises everyone. People see you differently." } },
    { "label": { "fr": "Vérifier les faits avant tout le monde", "en": "Check the facts before anyone else" },
      "when": { "background": ["journalism"] },
      "roll": { "base": 13, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "reputation": 2, "popularity": 8, "standing": 6 },
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
      "effects": { "reseau": 2, "notoriete": 1, "standing": 12, "popularity": -7 },
      "result": { "fr": "Les images vous installent comme un chef de camp. Le pays fatigué, lui, vous en veut.",
                  "en": "The pictures install you as a leader of a side. The exhausted country resents you." } },
    { "label": { "fr": "Appeler à la négociation", "en": "Call for negotiation" },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": 9, "standing": -9 },
      "result": { "fr": "Vous jouez les médiateurs. Les deux camps vous soupçonnent de l'autre.",
                  "en": "You play mediator. Each side suspects you of belonging to the other." } },
    { "label": { "fr": "Loger et nourrir les grévistes", "en": "House and feed the strikers" },
      "when": { "minMoney": 120000 },
      "effects": { "money": -80000, "reseau": 2, "standing": 14, "popularity": -4 },
      "result": { "fr": "Vos caisses de grève tiennent trois semaines de plus. Les syndicats s'en souviendront.",
                  "en": "Your strike fund holds three more weeks. The unions will remember." } },
    { "label": { "fr": "Proposer une médiation technique", "en": "Offer technical mediation" },
      "when": { "background": ["civil", "academia"] },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "reputation": 3, "reseau": 1, "popularity": 14, "standing": 4 },
        "result": { "fr": "Votre proposition débloque le conflit en dix jours. Les deux camps vous doivent quelque chose.",
                    "en": "Your proposal breaks the deadlock in ten days. Both sides owe you something." } },
      "failure": { "effects": { "popularity": -5, "standing": -4 },
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
      "effects": { "reseau": 2, "notoriete": -1, "standing": 13, "popularity": -6, "trait": "appareil" },
      "result": { "fr": "Le texte est illisible et tout le monde vous en sait gré.",
                  "en": "The text is unreadable and everyone is grateful." } },
    { "label": { "fr": "Choisir un camp", "en": "Pick a side" },
      "roll": { "stat": "reseau", "base": 13, "dice": 16 },
      "success": { "effects": { "reseau": 1, "notoriete": 1, "standing": 12, "popularity": 5 },
        "result": { "fr": "Votre camp l'emporte. Vous voilà identifié, donc attendu.",
                    "en": "Your side wins. You are now marked, therefore expected." } },
      "failure": { "effects": { "reseau": -2, "standing": -16 },
        "result": { "fr": "Votre camp perd. On range votre nom dans les vaincus.",
                    "en": "Your side loses. Your name is filed with the defeated." } } },
    { "label": { "fr": "Écrire une motion à votre nom", "en": "Table a motion in your own name" },
      "when": { "personality": ["provocative", "principled"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "standing": 0.05, "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "standing": 13, "popularity": 7 },
        "result": { "fr": "Votre motion arrive troisième et devient la ligne du parti deux ans plus tard.",
                    "en": "Your motion comes third and becomes party policy two years later." } },
      "failure": { "effects": { "standing": -12, "reseau": -1 },
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
      "effects": { "reseau": 1, "reputation": -1, "standing": 11, "popularity": -10 },
      "result": { "fr": "L'accord passe. Vous êtes désormais « quelqu'un qui compte ».",
                  "en": "The deal goes through. You are now “someone who matters”." } },
    { "label": { "fr": "Défendre l'indépendance", "en": "Defend independence" },
      "effects": { "reputation": 2, "reseau": -1, "standing": -9, "popularity": 11 },
      "result": { "fr": "L'accord se fait sans vous. La pureté a un coût.",
                  "en": "The deal happens without you. Purity has a price." } },
    { "label": { "fr": "Négocier en secret et démentir en public", "en": "Negotiate in secret and deny it publicly" },
      "effects": { "standing": 8, "popularity": -3, "reputation": -2, "sangfroid": 1, "strike": "menteur" },
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
      "effects": { "eloquence": 1, "reputation": 2, "popularity": 9, "standing": 6, "energie": -1 },
      "result": { "fr": "Dix minutes de pédagogie. La séquence tourne pendant des jours.",
                  "en": "Ten minutes of real explanation. The clip circulates for days." } },
    { "label": { "fr": "Simplifier à l'extrême", "en": "Simplify brutally" },
      "effects": { "notoriete": 2, "reputation": -1, "popularity": 5 },
      "result": { "fr": "La formule choc est reprise partout, y compris par ceux qui vous citent mal.",
                  "en": "The soundbite is repeated everywhere, including by those who misquote you." } },
    { "label": { "fr": "Publier une note technique détaillée", "en": "Publish a detailed technical note" },
      "when": { "background": ["academia", "civil"] },
      "effects": { "eloquence": 1, "reputation": 2, "standing": 8, "popularity": -3 },
      "result": { "fr": "Quinze pages que tous les journalistes citent sans les avoir lues.",
                  "en": "Fifteen pages every journalist quotes without having read them." } },
    { "label": { "fr": "Proposer votre expertise au gouvernement", "en": "Offer your expertise to the government" },
      "when": { "personality": ["clever"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "reputation": 2, "standing": 9, "popularity": 5 },
        "result": { "fr": "Ils acceptent. Vous êtes désormais celui qu'on appelle quand c'est grave.",
                    "en": "They accept. You are now the person they call when it is serious." } },
      "failure": { "effects": { "standing": -7, "popularity": -3 },
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
      "success": { "effects": { "notoriete": 2, "reseau": -1, "popularity": 10, "standing": -8 },
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
      "effects": { "eloquence": 1, "reputation": 2, "popularity": 6, "standing": 5, "energie": -1 },
      "result": { "fr": "Quarante signatures universitaires. Le texte devient une référence citée pendant des années.",
                  "en": "Forty academic signatures. The piece becomes a reference cited for years." } },
    { "label": { "fr": "Écrire sur votre parti lui-même", "en": "Write about your own party" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 2, "notoriete": 1, "popularity": 8, "standing": -13 },
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
      "effects": { "reputation": 1, "notoriete": 1, "popularity": 7, "sangfroid": -2, "energie": -1 },
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
      "success": { "effects": { "notoriete": 2, "reputation": 2, "energie": -1, "popularity": 17, "standing": 4 },
        "result": { "fr": "Vous êtes sur les lieux avant les ministres. Les images vous installent.",
                    "en": "You are on site before the ministers. The pictures make you." } },
      "failure": { "effects": { "energie": -1, "popularity": -7, "reputation": -1 },
        "result": { "fr": "On vous reproche le déplacement, jugé opportuniste. Vous gênez les secours.",
                    "en": "The visit is called opportunistic. You are in the rescuers' way." } } },
    { "label": { "fr": "Exiger une commission d'enquête", "en": "Demand a commission of inquiry" },
      "effects": { "eloquence": 1, "standing": 9, "popularity": -5, "energie": -1 },
      "result": { "fr": "La procédure est lente et sérieuse. Elle portera votre nom dans deux ans.",
                  "en": "The procedure is slow and serious. It will carry your name in two years." } },
    { "label": { "fr": "Accuser nommément les responsables", "en": "Name and shame those responsible" },
      "roll": { "base": 18, "stat": "notoriete",
                "plus": { "charisme": 0.45 },
                "bonus": [ { "when": { "personality": ["provocative"] }, "value": 2.5 },
                           { "when": { "party": ["radical_left", "identitarians"] }, "value": 1.5 } ], "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 14, "standing": -8 },
        "result": { "fr": "Vos accusations font la une. On vous poursuit en diffamation, ça vous grandit.",
                    "en": "Your accusations lead the news. You are sued for libel, which only helps." } },
      "failure": { "effects": { "reputation": -2, "popularity": -9, "standing": -10 },
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
  "when": { "position": ["depute", "ministre", "chef"], "minStanding": 50 },
  "tag": { "fr": "Proposition", "en": "An offer" },
  "text": {
    "fr": "Le gouvernement adverse vous propose un ministère. Le poste est réel, le piège aussi.",
    "en": "The opposing government offers you a ministry. The job is real; so is the trap."
  },
  "choices": [
    { "label": { "fr": "Accepter et gouverner", "en": "Accept and govern" },
      "effects": { "money": 60000, "reseau": 2, "notoriete": 2, "reputation": -2, "popularity": 11, "standing": -14, "trait": "renegat" },
      "result": { "fr": "Vous entrez au gouvernement. Votre parti parle de trahison, le pays de courage.",
                  "en": "You join the government. Your party calls it betrayal; the country calls it courage." } },
    { "label": { "fr": "Refuser publiquement et bruyamment", "en": "Refuse loudly and publicly" },
      "effects": { "reputation": 2, "notoriete": 1, "standing": 10, "popularity": -5, "money": -20000 },
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
    { "label": { "fr": "Exiger le ministère de l'Intérieur", "en": "Demand the Interior Ministry" },
      "when": { "background": ["civil", "law"] },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "minStanding": 70 }, "value": 0.25 } ] },
      "success": { "effects": { "reseau": 3, "notoriete": 2, "money": 60000, "popularity": 8, "standing": -10 },
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
                    "en": "The internal inquiry goes nowhere and looks like paranoia." } } }
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
      "effects": { "energie": 2, "standing": -5, "popularity": -3, "sangfroid": 1 },
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
      "effects": { "popularity": -6, "sangfroid": 1, "standing": 2 },
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
      "effects": { "notoriete": 2, "eloquence": 1, "popularity": 5, "reputation": -2 },
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
    "fr": "Une chaîne d'information vous met face à {rival}, qui dirige {rival_party}. Une heure de direct, deux équipes qui ont préparé les mêmes phrases et un présentateur qui espère un incident.",
    "en": "A news channel puts you opposite {rival}, who leads {rival_party}. One hour live, two teams that have prepared the same lines and a host hoping for an incident."
  },
  "choices": [
    { "label": { "fr": "Aller le chercher sur son terrain", "en": "Take them on their own ground" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "notoriete": 1, "landscape": { "self": 1.6, "scene": -1.6 } },
        "result": { "fr": "Vous connaissez ses chiffres mieux que lui. À la fin de la séquence, il parle de sa famille, ce qui est toujours le signe qu'un débat est perdu.",
                    "en": "You know their figures better than they do. By the end of the segment they are talking about their family, which is always the sign of a debate lost." } },
      "failure": { "effects": { "popularity": -7, "energie": -1, "landscape": { "self": -1.3, "scene": 1.3 } },
        "result": { "fr": "Vous vous avancez sur un dossier que vous maîtrisez mal. La correction est polie et elle passe en boucle pendant deux jours.",
                    "en": "You venture onto a file you do not really command. The correction is polite and it runs on a loop for two days." } } },
    { "label": { "fr": "Rester courtois et le laisser se découvrir", "en": "Stay courteous and let them expose themselves" },
      "effects": { "reputation": 1, "sangfroid": 1, "popularity": 3, "standing": 3, "landscape": { "self": 0.5 } },
      "result": { "fr": "Personne ne retiendra une réplique, ce qui est exactement ce que votre entourage espérait. Le lendemain, les éditorialistes vous trouvent présidentiable, faute de mieux.",
                  "en": "Nobody will remember a single line, which is exactly what your staff was hoping for. The next day the columnists find you presidential, for want of anything better." } },
    { "label": { "fr": "Transformer le débat en moment de télévision", "en": "Turn the debate into television" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 2, "popularity": 8, "reputation": -2, "standing": -5,
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
                    "en": "They agree, then attack in the first minute on the very thing you had just ruled out. Nothing signed in a corridor is signed." } } }
  ]
},

{
  "id": "debauchage_cadre",
  "weight": 3,
  "cast": "opponent",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 12, "minStanding": 45 },
  "tag": { "fr": "Débauchage", "en": "Poaching" },
  "text": {
    "fr": "{rival} n'a plus d'avenir chez {rival_party} et le sait. Un déjeuner est organisé, sans témoin, par quelqu'un qui connaît vos deux numéros.",
    "en": "{rival} has no future left at {rival_party} and knows it. A lunch is arranged, with no witnesses, by somebody who has both your numbers."
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
    "fr": "{rival} vous fait porter un message : chez {rival_party}, on vous trouve mal employé. Il ne parle pas d'un poste, il parle d'un avenir, ce qui coûte moins cher.",
    "en": "{rival} sends word: at {rival_party}, they think you are being wasted. They do not mention a post, they mention a future, which costs less."
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
      "effects": { "notoriete": 2, "popularity": 9, "reputation": 2, "standing": -8, "reseau": -1 },
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
      "effects": { "sangfroid": 1, "standing": -3, "popularity": -3, "reputation": -1 },
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
      "effects": { "office": "ministre", "notoriete": 2, "standing": 6, "energie": -2, "popularity": 4 },
      "result": { "fr": "Passation de pouvoirs, discours de dix minutes, cinq cents fonctionnaires qui vous regardent en se demandant combien de temps vous resterez. La moyenne est de dix-neuf mois.",
                  "en": "A handover ceremony, a ten-minute speech, five hundred civil servants wondering how long you will last. The average is nineteen months." } },
    { "label": { "fr": "Prendre le portefeuille technique", "en": "Take the technical brief" },
      "effects": { "office": "ministre", "reputation": 2, "sangfroid": 1, "standing": 4, "notoriete": 1 },
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
      "success": { "effects": { "standing": 6, "reputation": 2, "energie": -2, "popularity": 3 },
        "result": { "fr": "Vous sortez avec l'essentiel. Vos services l'apprennent à minuit et vous trouvent, pour la première fois, un vrai ministre.",
                    "en": "You come out with the essentials intact. Your officials hear about it at midnight and decide, for the first time, that you are a real minister." } },
      "failure": { "effects": { "standing": -6, "energie": -2, "popularity": -4 },
        "result": { "fr": "On vous laisse parler vingt minutes puis on vous annonce le chiffre décidé la veille. Vous signez la lettre plafond le lendemain matin.",
                    "en": "You are allowed to talk for twenty minutes, then given the number that was decided the day before. You sign the ceiling letter the next morning." } } },
    { "label": { "fr": "Céder et négocier autre chose en échange", "en": "Give way and trade it for something else" },
      "effects": { "reseau": 2, "standing": 6, "reputation": -1, "popularity": -3 },
      "result": { "fr": "Vous rendez l'argent contre une promesse de nomination et un déplacement présidentiel dans votre ancienne circonscription. Personne n'a rien vu passer.",
                  "en": "You hand back the money in exchange for a promised appointment and a presidential visit to your old constituency. Nothing was visible from outside." } },
    { "label": { "fr": "Faire fuiter les coupes dans la presse", "en": "Leak the cuts to the press" },
      "effects": { "notoriete": 1, "popularity": 7, "standing": -12, "reputation": -1,
                   "landscape": { "ruling": -1.2 } },
      "result": { "fr": "Les chiffres sortent le jeudi, attribués à un proche du dossier. Tout le monde sait que c'est vous, personne ne peut le prouver, et le ministère garde son budget.",
                  "en": "The figures come out on Thursday, sourced to someone close to the file. Everyone knows it was you, nobody can prove it, and the department keeps its budget." } }
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
      "effects": { "popularity": 8, "reputation": 2, "standing": -14, "notoriete": 1 },
      "result": { "fr": "Vous dites que ce n'est pas votre choix. Matignon apprend la nouvelle en même temps que les auditeurs et le fait savoir avant midi.",
                  "en": "You say it was not your choice. The prime minister's office learns about it at the same time as the listeners and lets it be known before noon." } },
    { "label": { "fr": "Annuler et vous faire porter pâle", "en": "Cancel and call in sick" },
      "effects": { "sangfroid": -1, "popularity": -2, "standing": -3, "energie": 1 },
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
      "effects": { "reputation": 3, "popularity": 5, "standing": -8, "energie": -1 },
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
                  "en": "He goes on Friday evening in a two-line statement, after eleven years of loyalty. He knows everything about you and he has just been given a great deal of free time." } }
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
      "failure": { "effects": { "office": "depute", "standing": -8, "popularity": -4 },
        "result": { "fr": "Vous n'êtes pas sur la photo. Le chauffeur vient chercher la voiture à sept heures et le badge se désactive à midi.",
                    "en": "You are not in the photograph. The driver comes for the car at seven and the pass stops working at noon." } } },
    { "label": { "fr": "Demander un ministère plus lourd", "en": "Ask for a heavier portfolio" },
      "roll": { "base": 19, "stat": "sangfroid", "plus": { "standing": 0.07, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "standing": 9, "popularity": 5, "energie": -2 },
        "result": { "fr": "Vous obtenez un des trois ministères qui comptent. À partir de ce jour, tout ce qui ira mal dans le pays portera votre nom.",
                    "en": "You get one of the three departments that matter. From this day on, everything that goes wrong in the country will carry your name." } },
      "failure": { "effects": { "office": "depute", "standing": -14, "reputation": -1 },
        "result": { "fr": "On vous répond que l'ambition est une qualité. Vous n'êtes dans aucune des deux colonnes le lendemain.",
                    "en": "You are told that ambition is a fine quality. The next day you are in neither column." } } },
    { "label": { "fr": "Partir avant d'être remercié", "en": "Leave before you are thanked" },
      "effects": { "office": "depute", "reputation": 2, "popularity": 6, "standing": -4, "sangfroid": 1 },
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
      "effects": { "office": "depute", "popularity": 12, "reputation": 3, "standing": -10, "notoriete": 2,
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
      "effects": { "office": "depute", "popularity": 14, "notoriete": 2, "standing": -16, "reputation": 1,
                   "landscape": { "self": 2, "ruling": -1.6 } },
      "result": { "fr": "Votre démission occupe trois jours de plateaux et vos notes deux semaines de presse. Vous ne remettrez plus jamais les pieds dans un gouvernement dirigé par ces gens-là.",
                  "en": "Your resignation fills three days of television and your notes two weeks of newsprint. You will never sit in a government run by these people again." } },
    { "label": { "fr": "Utiliser le dossier pour monter, pas pour partir", "en": "Use the file to climb, not to leave" },
      "roll": { "base": 18, "stat": "reseau", "plus": { "sangfroid": 0.5, "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 13, "reseau": 1, "reputation": -2 },
        "result": { "fr": "Vous montrez le dossier à trois personnes et à personne d'autre. Deux d'entre elles quittent le gouvernement le mois suivant, vous non.",
                    "en": "You show the file to three people and to nobody else. Two of them leave the government the following month; you do not." } },
      "failure": { "effects": { "office": "depute", "standing": -12, "reputation": -2, "strike": "traitre" },
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
      "effects": { "money": -4000, "popularity": 8, "charisme": 1, "sangfroid": 1, "trait": "teflon" },
      "result": { "fr": "La photo du dessin encadré derrière vous fait le tour des rédactions. On ne peut plus se moquer de quelqu'un qui rit le premier.",
                  "en": "The photograph of the framed cartoon behind you goes round every newsroom. You cannot mock somebody who laughs first." } },
    { "label": { "fr": "Demander à votre entourage d'appeler le journal", "en": "Have your staff call the paper" },
      "roll": { "chance": 0.3 },
      "success": { "effects": { "popularity": 2, "reseau": 1 },
        "result": { "fr": "Le dessinateur passe à quelqu'un d'autre le mois suivant. Personne n'a rien su, et c'est déjà une victoire rare.",
                    "en": "The cartoonist moves on to somebody else the following month. Nobody found out, which is already a rare win." } },
      "failure": { "effects": { "popularity": -9, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Le journal publie l'appel en fac-similé, avec le nom de votre collaborateur. Le dessin devient une série et vous, un symbole de susceptibilité.",
                    "en": "The paper publishes the call in facsimile, with your staffer's name on it. The cartoon becomes a series, and you become a symbol of thin skin." } } },
    { "label": { "fr": "Ne rien faire du tout", "en": "Do nothing at all" },
      "effects": { "sangfroid": 2, "popularity": -2 },
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
      "roll": { "base": 17, "stat": "energie", "plus": { "sangfroid": 0.4 }, "dice": 16 },
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
      "effects": { "reputation": 3, "popularity": 6, "standing": -8, "sangfroid": 1 },
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
      "effects": { "reputation": 2, "sangfroid": 1, "popularity": 4, "landscape": { "self": 0.6, "scene": -0.6 } },
      "result": { "fr": "Vous enchaînez comme si de rien n'était. Le silence qui suit sa phrase dure une seconde de trop, et c'est cette seconde-là qui tournera.",
                  "en": "You carry on as if nothing had happened. The silence after his line lasts a second too long, and that second is the clip that travels." } },
    { "label": { "fr": "Rendre le coup, plus fort", "en": "Hit back, harder" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "notoriete": 1, "landscape": { "self": 1.2, "scene": -1.2 } },
        "result": { "fr": "Votre réponse est meilleure que sa pique et tout le monde le sait avant la fin de l'émission. Il ne recommencera pas avec vous.",
                    "en": "Your comeback is better than his jibe and everyone knows it before the programme ends. He will not try that with you again." } },
      "failure": { "effects": { "popularity": -6, "reputation": -2, "landscape": { "scene": 0.8 } },
        "result": { "fr": "Vous descendez à son niveau sans son talent. Le lendemain, les deux séquences passent ensemble et une seule est drôle.",
                    "en": "You go down to his level without his timing. The next day both clips run together, and only one of them is funny." } } },
    { "label": { "fr": "Prendre le pays à témoin", "en": "Take it to the country" },
      "when": { "trait": ["ingrat", "obese", "lifting", "use"] },
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
  "weight": 4,
  "tag": { "fr": "Débat décisif", "en": "The big debate" },
  "text": {
    "fr": "Le grand débat télévisé. Vingt millions de personnes regardent, et l'on sait que ces soirées font basculer des élections.",
    "en": "The televised debate. Twenty million people are watching, and these nights are known to swing elections."
  },
  "choices": [
    { "label": { "fr": "Attaquer frontalement", "en": "Go on the attack" },
      "roll": { "stat": "eloquence", "base": 13, "dice": 16 },
      "success": { "effects": { "poll": 7, "notoriete": 1, "popularity": 8 },
        "result": { "fr": "Vous plantez une réplique qui fera les titres de demain. Le débat est plié.",
                    "en": "You land a line that will lead tomorrow's news. The debate is over." } },
      "failure": { "effects": { "poll": -6, "reputation": -1, "popularity": -7 },
        "result": { "fr": "L'agressivité passe mal. On vous trouve nerveux, presque petit.",
                    "en": "The aggression falls flat. You come across as nervous, almost small." } } },
    { "label": { "fr": "Jouer la hauteur présidentielle", "en": "Play presidential" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 5, "reputation": 1, "popularity": 5 },
        "result": { "fr": "Calme, précis, au-dessus de la mêlée. Vous avez l'air d'être déjà en fonction.",
                    "en": "Calm, precise, above the fray. You already look like the office." } },
      "failure": { "effects": { "poll": -4, "popularity": -4 },
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
      "effects": { "poll": 4, "eloquence": 1, "reputation": 2, "popularity": -4 },
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
  "id": "c_ralliement",
  "tag": { "fr": "Ralliement", "en": "Endorsement" },
  "text": {
    "fr": "Éliminé de la course, {rival} hésite encore à appeler à voter pour vous. Son soutien vaut des points, son prix aussi.",
    "en": "Knocked out of the race, {rival} is still hesitating to endorse you. The support is worth points; so is the price."
  },
  "choices": [
    { "label": { "fr": "Promettre un grand ministère", "en": "Promise a top ministry" },
      "effects": { "poll": 6, "standing": -8, "reputation": -1 },
      "result": { "fr": "Le ralliement est annoncé le soir même. Le marchandage a fuité le lendemain.",
                  "en": "The endorsement is announced that evening. The deal leaked the next day." } },
    { "label": { "fr": "Ne rien promettre", "en": "Promise nothing" },
      "effects": { "poll": -2, "reputation": 2, "popularity": 3 },
      "result": { "fr": "Pas de soutien, mais pas de dette. Vous restez propre.",
                  "en": "No endorsement, but no debt. You stay clean." } },
    { "label": { "fr": "Reprendre trois de ses idées dans votre discours", "en": "Take three of his ideas into your speech" },
      "effects": { "poll": 3, "eloquence": 1, "reputation": -1, "standing": 2 },
      "result": { "fr": "Il n'appelle pas à voter pour vous, mais ses électeurs entendent leurs mots dans votre bouche.",
                  "en": "He does not endorse you, but his voters hear their own words coming out of your mouth." } },
    { "label": { "fr": "Lui rappeler ce que vous savez sur lui", "en": "Remind him what you know about him" },
      "when": { "trait": ["casserole"] },
      "effects": { "poll": 5, "standing": 4, "reputation": -2, "reseau": -1 },
      "result": { "fr": "Le ralliement est annoncé le lendemain matin, avec un sourire qui ne trompe personne.",
                  "en": "The endorsement comes the next morning, with a smile that fools nobody." } }
  ]
},

{
  "id": "c_financement",
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
}

]

};
