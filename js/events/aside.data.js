/*
 * President Material — LE SCRUTIN QU'ON NE DISPUTE PAS.
 * ============================================================================
 * Syntaxe JSON stricte. Schéma complet dans js/events/_assemble.data.js.
 *
 * UN SOIR D'ÉLECTION NE SE VIT PAS DE LA MÊME PLACE. Ces scènes étaient
 * toutes écrites pour un spectateur : un agenda vide pendant six semaines,
 * une tête de liste qu'on vient chauffer, une direction qu'on laisse
 * s'expliquer, une ligne du parti qu'on peut attaquer le soir même. Rien de
 * tout cela n'existe quand c'est vous qui dirigez la maison : vous avez
 * signé chaque investiture, votre agenda est le plus rempli du pays, et la
 * ligne que l'on attaque est la vôtre. Le joueur chef de parti se voyait donc
 * proposer de laisser parler la direction, c'est-à-dire lui-même.
 *
 * Le paquet est donc en deux moitiés symétriques, "partyLead": false d'un
 * côté, "partyLead": true de l'autre, trois scènes chacune. Les deux moitiés
 * doivent rester peuplées : drawAside() retombe sur le paquet ENTIER quand
 * aucune scène ne correspond, et l'incohérence reviendrait par là.
 * ============================================================================
 */
const EV_aside = [


/* ==========================================================================
   1. ON REGARDE LES AUTRES SE PRÉSENTER
   ========================================================================== */

{
  "id": "aside_campagne_autres",
  "weight": 4,
  "when": { "partyLead": false },
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
  "when": { "partyLead": false },
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
  "when": { "partyLead": false },
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

,

/* ==========================================================================
   2. ON NE SE PRÉSENTE PAS, ET C'EST QUAND MÊME VOTRE SOIRÉE
   --------------------------------------------------------------------------
   Le miroir des trois précédentes, pour un chef de parti. Même soirée, même
   salle, même écran : il n'y a que la place d'où on la regarde qui change,
   et elle change tout.
   ========================================================================== */

{
  "id": "aside_chef_campagne",
  "weight": 4,
  "when": { "partyLead": true },
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "Votre nom n'est sur aucun bulletin, ce qui ne veut pas dire que vous n'êtes pas sur la table : vous avez signé chacune des investitures, et l'on vous demandera des comptes sur chacune. Six semaines, un avion, une voiture, et un directeur de campagne qui vous montre une carte tous les matins.",
    "en": "Your name is on no ballot, which does not mean you are not on the table: you signed every single nomination and you will be asked to account for every single one. Six weeks, a plane, a car, and a campaign director who shows you a map every morning."
  },
  "choices": [
    { "label": { "fr": "Tout donner sur le terrain, quarante déplacements", "en": "Give it everything on the ground, forty visits" },
      "effects": { "standing": 8, "notoriete": 2, "energie": -4, "popularity": 2, "landscape": { "self": 1.2 } },
      "result": { "fr": "Quarante villes en six semaines et deux nuits chez vous. Vos candidats vous ont vu, ce qui compte plus pour eux que tout ce que vous pourrez leur donner ensuite.",
                  "en": "Forty towns in six weeks and two nights at home. Your candidates saw you, which matters more to them than anything you could give them later." } },

    { "label": { "fr": "Concentrer sur les vingt circonscriptions qui basculent", "en": "Concentrate on the twenty seats that swing" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "credibilite": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 10, "credibilite": 2, "energie": -2, "landscape": { "self": 1.8 } },
        "result": { "fr": "Vous mettez tout l'argent et tout votre temps là où quatre cents voix décident, et vous en gagnez quatorze sur vingt. Personne n'écrira jamais que c'était une décision ; c'en était une.",
                    "en": "You put all the money and all your time where four hundred votes decide, and you take fourteen of the twenty. Nobody will ever write that it was a decision; it was one." } },
      "failure": { "effects": { "standing": -8, "energie": -2, "landscape": { "self": -0.8 } },
        "result": { "fr": "Vous vous trompez de vingt circonscriptions et cinquante autres candidats apprennent que vous n'êtes pas venu chez eux. Ils le sauront encore au prochain congrès.",
                    "en": "You pick the wrong twenty, and fifty other candidates learn that you did not come to see them. They will still know it at the next congress." } } },

    { "label": { "fr": "Rester au siège et tenir la ligne dans les médias", "en": "Stay at headquarters and hold the line in the media" },
      "effects": { "notoriete": 3, "eloquence": 1, "popularity": 4, "energie": -1, "standing": -4 },
      "result": { "fr": "Vingt-deux plateaux et pas un seul marché. Le pays vous voit beaucoup, vos candidats pas du tout, et ce sont eux qui voteront au congrès.",
                  "en": "Twenty-two studios and not a single market square. The country sees a great deal of you, your candidates none at all, and it is they who vote at the congress." } }
  ]
},

{
  "id": "aside_chef_tete_de_liste",
  "weight": 4,
  "cast": "camp",
  "when": { "partyLead": true },
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "{rival} mène la campagne de votre camp parce que vous l'avez désigné{e}. La salle de ce soir sera pleine, le discours sera le sien, et l'arithmétique est simple : si cela marche ce sera {lui}, et si cela rate ce sera vous.",
    "en": "{rival} is leading your side's campaign because you picked {him}. Tonight's hall will be full, the speech will be theirs, and the arithmetic is simple: if it works it will have been {him}, and if it fails it will have been you."
  },
  "choices": [
    { "label": { "fr": "{Le} laisser exister et fermer le meeting en trois minutes", "en": "Let {him} have it, and close the rally in three minutes" },
      "effects": { "standing": 6, "credibilite": 2, "reputation": 1, "popularity": -2, "landscape": { "self": 0.6 } },
      "result": { "fr": "Trois minutes, pas une de plus, et vous rendez la salle à {celui} qui l'a remplie. Un chef de parti qui sait se taire un soir se fait plus d'obligés qu'en dix discours.",
                  "en": "Three minutes, not one more, and you hand the hall back to the person who filled it. A party leader who can keep quiet for one evening makes more debtors than in ten speeches." } },

    { "label": { "fr": "Occuper le terrain vous-même, quitte à {le} faire disparaître", "en": "Take the ground yourself, even if it buries {him}" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "eloquence": 0.45, "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 8, "landscape": { "self": 1.4 }, "standing": -6 },
        "result": { "fr": "La soirée devient la vôtre, les titres du lendemain aussi, et la campagne repart de deux points. {Il} vous serre la main devant les caméras et ne vous adressera plus la parole en privé.",
                    "en": "The evening becomes yours, so do the next day's headlines, and the campaign gains two points. {He} shakes your hand in front of the cameras and will never speak to you privately again." } },
      "failure": { "effects": { "popularity": -5, "standing": -9, "credibilite": -2, "landscape": { "self": -0.8 } },
        "result": { "fr": "Vous parlez trente-cinq minutes dans une salle venue pour quelqu'un d'autre. On ne retient ni le discours ni la campagne, seulement qu'un chef de parti n'a pas supporté de n'être pas au centre.",
                    "en": "You speak for thirty-five minutes in a hall that came for somebody else. Nobody remembers the speech or the campaign, only that a party leader could not bear not to be the centre of it." } } },

    { "label": { "fr": "Ne pas venir, et laisser la campagne être la sienne", "en": "Stay away, and let the campaign be theirs" },
      "effects": { "energie": 2, "sangfroid": 1, "standing": -3, "notoriete": -1 },
      "result": { "fr": "Vous n'y allez pas et vous ne dites pas pourquoi. Si la campagne réussit, personne ne vous en créditera ; si elle échoue, personne n'oubliera que vous n'étiez pas dans la salle.",
                  "en": "You do not go and you do not say why. If the campaign succeeds nobody will credit you; if it fails nobody will forget that you were not in the room." } }
  ]
},

{
  "id": "aside_chef_soir_de_resultats",
  "weight": 5,
  "when": { "partyLead": true },
  "tag": { "fr": "Soir de résultats", "en": "Results night" },
  "text": {
    "fr": "Vingt heures, le siège du parti, une salle avec un écran et deux cents personnes qui regardent l'écran puis vous, puis l'écran. Le résultat n'est pas bon. Vous avez signé chaque investiture, écrit la ligne et choisi l'affiche, et il n'y a personne d'autre à qui les caméras puissent le demander.",
    "en": "Eight in the evening, party headquarters, a room with a screen and two hundred people looking at the screen, then at you, then at the screen. The result is poor. You signed every nomination, wrote the line and chose the poster, and there is nobody else the cameras can ask."
  },
  "choices": [
    { "label": { "fr": "Prendre le micro et tout assumer, sans une réserve", "en": "Take the microphone and own all of it, without a qualifier" },
      "effects": { "credibilite": 3, "reputation": 3, "standing": 6, "popularity": -2, "energie": -1 },
      "result": { "fr": "Quatre minutes sans un « mais ». C'est le seul soir où assumer coûte quelque chose et c'est le seul soir où cela s'achète : dans dix ans, on se souviendra de ces quatre minutes et pas du score.",
                  "en": "Four minutes without a single qualification. It is the one evening when owning it costs something and the one evening it can be bought: in ten years they will remember those four minutes and not the number." } },

    { "label": { "fr": "Mettre en cause la campagne, jamais la ligne", "en": "Blame the campaign, never the line" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "credibilite": 1, "reputation": -2, "popularity": -3 },
        "result": { "fr": "Vous expliquez que le fond était juste et que l'exécution ne l'était pas. Votre directeur de campagne comprend en direct qu'il a fini, et vous avez gagné deux ans.",
                    "en": "You explain that the substance was right and the execution was not. Your campaign director works out live on air that he is finished, and you have bought yourself two years." } },
      "failure": { "effects": { "standing": -11, "reputation": -3, "credibilite": -2, "popularity": -4, "strike": "menteur" },
        "result": { "fr": "Personne ne croit une seconde que la ligne n'y est pour rien, parce que la ligne, c'est vous. On a vu un chef de parti chercher un coupable dans sa propre équipe, en direct, à vingt heures trente.",
                    "en": "Nobody believes for a second that the line had nothing to do with it, because the line is you. Two hundred people watched a party leader look for a culprit inside his own team, live, at half past eight." } } },

    { "label": { "fr": "Annoncer une refondation dès ce soir", "en": "Announce a rebuild that very evening" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "credibilite": 0.45, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 9, "notoriete": 2, "popularity": 6, "credibilite": 2, "energie": -3,
                                "landscape": { "self": 1.2 } },
        "result": { "fr": "Vous transformez une défaite en calendrier : un congrès, une date, trois chantiers. La salle se lève, et une salle qui se lève un soir de défaite ne se lève pas pour le score.",
                    "en": "You turn a defeat into a timetable: a congress, a date, three projects. The hall rises, and a hall that rises on the night of a defeat is not rising for the number." } },
      "failure": { "effects": { "standing": -9, "credibilite": -2, "popularity": -3, "energie": -3 },
        "result": { "fr": "Refonder, à vingt heures trente, sans avoir rien préparé, cela s'entend. Vous venez d'annoncer un congrès que vos adversaires internes prépareront mieux que vous.",
                    "en": "Rebuilding, at half past eight, with nothing prepared, is audible. You have just announced a congress that your internal rivals will prepare better than you." } } },

    { "label": { "fr": "Sortir par la porte de derrière et ne parler à personne", "en": "Leave by the back door and speak to nobody" },
      "effects": { "energie": 2, "standing": -10, "popularity": -5, "reputation": -2, "strike": "lache" },
      "result": { "fr": "Deux cents personnes cherchent leur chef pendant une heure et une caméra filme une porte de service. C'est la seule image de la soirée qui sera encore diffusée dans cinq ans.",
                  "en": "Two hundred people spend an hour looking for their leader while a camera films a service door. It is the only image of the evening that will still be broadcast in five years." } }
  ]
}

];
