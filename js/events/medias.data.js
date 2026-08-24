/* Généré — ne pas éditer à la main. */
const EV_medias = [


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
      "effects": { "axis": "self", "landscape": { "self": -1.2 }, "notoriete": 3, "reputation": -2, "popularity": 9, "standing": -14, "strike": "radical" },
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
      "effects": { "axis": "self", "landscape": { "self": -1.6 }, "credibilite": -3, "notoriete": 3, "reputation": -2, "popularity": 7, "standing": -12 },
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
}
];
