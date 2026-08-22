/* Généré — ne pas éditer à la main. */
const EV_aside = [

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

];
