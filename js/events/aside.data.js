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
},

{
  "id": "aside_voisin_qui_gagne",
  "when": { "partyLead": false, "position": ["cadre", "conseiller", "maire", "euro", "depute"] },
  "cast": "neighbour",
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "Le camp voisin monte chez vous. Sur les marchés que vous tenez depuis dix ans, ce sont leurs tracts qu'on prend, et {rival} a tenu une salle pleine à quatre rues de votre permanence.",
    "en": "The neighbouring camp is surging on your own patch. In the markets you have worked for ten years, it is their leaflets people take, and {rival} filled a hall four streets from your office."
  },
  "choices": [
    { "label": { "fr": "Les attaquer frontalement sur leur programme", "en": "Attack them head-on over their programme" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 6, "standing": 6, "landscape": { "self": 0.8, "scene": -0.8 } },
        "result": { "fr": "Vous démontez leur chiffrage ligne à ligne pendant quarante minutes devant deux cents personnes. Ils ne reviendront pas dans cette salle, et le marché redevient le vôtre.",
                    "en": "You take their costings apart line by line for forty minutes in front of two hundred people. They will not come back to that hall, and the market is yours again." } },
      "failure": { "effects": { "popularity": -7, "standing": -4, "landscape": { "self": -0.5, "scene": 0.6 } },
        "result": { "fr": "Vous passez quarante minutes à parler d'eux. Deux cents personnes rentrent chez elles en ayant appris leur nom, leur programme et l'adresse de leur permanence.",
                    "en": "You spend forty minutes talking about them. Two hundred people go home having learned their name, their programme and the address of their office." } } },
    { "label": { "fr": "Leur proposer un accord local", "en": "Offer them a local deal" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 5, "reseau": 2, "landscape": { "self": 0.5, "ally": 0.3 },
                                "reputation": -1 },
        "result": { "fr": "Un café, deux heures, et une répartition des marchés du dimanche qui ne sera jamais écrite nulle part. Les deux appareils apprendront la nouvelle par leurs militants.",
                    "en": "One coffee, two hours, and a division of the Sunday markets that will never be written down anywhere. Both machines will learn of it from their own activists." } },
      "failure": { "effects": { "standing": -9, "reputation": -2, "popularity": -3,
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Ils racontent le café à la presse locale avant vous. Le mot « arrangement » se lit très mal en une du quotidien régional, surtout quand la photo est bonne.",
                    "en": "They tell the local press about the coffee before you do. The word “arrangement” reads very badly on the front of the regional daily, especially when the photograph is good." } } },
    { "label": { "fr": "Ne rien faire et laisser passer la vague", "en": "Do nothing and let the wave pass" },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "trait": ["ancrage_local"] }, "value": 0.25 },
                                                 { "when": { "minPopularity": 58 }, "value": 0.15 } ] },
      "success": { "effects": { "popularity": 3, "energie": 2, "sangfroid": 1, "standing": -1 },
        "result": { "fr": "Six semaines plus tard, la salle pleine est vide et vos marchés sont toujours vos marchés. Une vague nationale ne se combat pas, elle s'attend.",
                    "en": "Six weeks later the full hall is empty and your markets are still your markets. A national wave is not fought, it is waited out." } },
      "failure": { "effects": { "popularity": -6, "standing": -6, "landscape": { "self": -0.7, "scene": 0.7 } },
        "result": { "fr": "La vague ne passe pas, elle s'installe. Ils ouvrent une permanence à l'année dans votre rue, avec une vitrine et deux salariés.",
                    "en": "The wave does not pass, it settles. They open a permanent office in your street, with a shopfront and two staff." } } }
  ]
},

{
  "id": "aside_suppleant",
  "when": { "partyLead": false, "position": ["militant", "cadre", "conseiller"] },
  "cast": "camp_senior",
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "{rival} vous propose d'être son suppléant. C'est un titre qui ne sert à rien, sauf le jour où il sert à tout, et cela suppose de faire toute la campagne sans qu'on prononce jamais votre nom.",
    "en": "{rival} offers to make you {his} substitute. It is a title that serves no purpose, except on the day it serves every purpose, and it means running the whole campaign without your name ever being said out loud."
  },
  "choices": [
    { "label": { "fr": "Accepter et faire la campagne à sa place", "en": "Accept, and run the campaign for them" },
      "roll": { "base": 14, "stat": "energie", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 12, "reseau": 2, "energie": -3, "notoriete": 1 },
        "result": { "fr": "Vous tenez les réunions publiques que {rival} n'a pas le temps de tenir, et la circonscription apprend votre visage sans jamais lire votre nom sur un bulletin. C'est ainsi qu'on hérite d'un siège.",
                    "en": "You run the public meetings {he} has no time for, and the constituency learns your face without ever reading your name on a ballot. That is how a seat is inherited." } },
      "failure": { "effects": { "standing": 2, "energie": -3, "popularity": -2, "reputation": -1 },
        "result": { "fr": "Vous faites six semaines de salles des fêtes et {il} gagne de vingt points. On vous remercie par SMS le dimanche soir, et vous ne remettrez pas les pieds dans son bureau.",
                    "en": "You do six weeks of village halls and {he} wins by twenty points. You are thanked by text on the Sunday evening, and you will not set foot in {his} office again." } } },
    { "label": { "fr": "Accepter, et négocier un écrit", "en": "Accept, and get it in writing" },
      "when": { "background": ["law"] },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "standing": 9, "credibilite": 2, "reseau": 1, "reputation": 1 },
        "result": { "fr": "Trois paragraphes signés qui disent ce qui se passe en cas de remaniement, de démission ou de décès. Personne ne signe jamais ça, et {il} a signé.",
                    "en": "Three signed paragraphs saying what happens in the event of a reshuffle, a resignation or a death. Nobody ever signs that, and {he} signed." } },
      "failure": { "effects": { "standing": -8, "reseau": -1, "reputation": -1 },
        "result": { "fr": "{Il} lit les trois paragraphes, sourit, et propose la suppléance à quelqu'un d'autre le soir même. On ne demande pas de garanties à qui vous en offre une.",
                    "en": "{He} reads the three paragraphs, smiles, and offers the substitute's slot to somebody else the same evening. You do not ask for guarantees from the person handing you one." } } },
    { "label": { "fr": "Refuser : vous voulez votre propre circonscription", "en": "Refuse: you want a seat of your own" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "minStanding": 50 }, "value": 0.25 },
                                                { "when": { "personality": ["hardworking"] }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 4, "credibilite": 1 },
        "result": { "fr": "Vous dites que vous serez candidat, un jour, quelque part, et que vous préférez attendre. La commission d'investiture note votre nom pour la première fois.",
                    "en": "You say that you will be a candidate one day, somewhere, and that you would rather wait. The nominations committee writes your name down for the first time." } },
      "failure": { "effects": { "standing": -7, "reseau": -1, "energie": -1 },
        "result": { "fr": "On vous explique gentiment que la file d'attente est longue, qu'elle ne bouge que par le haut, et que vous venez de refuser la seule place qu'elle offrait.",
                    "en": "It is gently explained to you that the queue is long, that it only moves from the top, and that you have just turned down the only place it had." } } }
  ]
},

{
  "id": "aside_soiree_adverse",
  "when": { "partyLead": false, "minPopularity": 45, "position": ["conseiller", "maire", "euro", "depute", "ministre"] },
  "cast": "opponent",
  "tag": { "fr": "Le soir du scrutin", "en": "Election night" },
  "text": {
    "fr": "{rival} vous invite à sa soirée électorale. C'est {un} adversaire, la salle sera pleine de ses militants, et les caméras y seront dès dix-neuf heures trente.",
    "en": "{rival} invites you to {his} election night party. {He} is an opponent, the room will be full of {his} activists, and the cameras will be there from half past seven."
  },
  "choices": [
    { "label": { "fr": "Y aller et rester une heure", "en": "Go, and stay an hour" },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "notoriete": 2, "standing": -5, "reseau": 2,
                                "credibilite": 1 },
        "result": { "fr": "Vous serrez des mains chez l'adversaire pendant une heure, à visage découvert, et vous partez avant les résultats. Le pays trouve ça républicain. Votre fédération trouve ça autre chose.",
                    "en": "You shake hands in the opponent's camp for an hour, in plain sight, and leave before the results. The country finds it statesmanlike. Your federation finds it something else." } },
      "failure": { "effects": { "popularity": -5, "standing": -9, "reputation": -1 },
        "result": { "fr": "Une photo de vous en train de rire avec {rival} tourne avant vingt heures. Le rire était poli, la photo ne l'est pas, et personne ne montrera les deux secondes d'avant.",
                    "en": "A photograph of you laughing with {rival} is circulating before eight. The laugh was polite, the photograph is not, and nobody will show the two seconds before it." } } },
    { "label": { "fr": "Refuser et le faire savoir", "en": "Refuse, and make sure it is known" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["principled"] }, "value": 0.2 },
                                                { "when": { "party": ["radical_left", "identitarians"] }, "value": 0.2 } ] },
      "success": { "effects": { "standing": 8, "appeal": { "self": 6, "others": -2 }, "reputation": 1 },
        "result": { "fr": "Vous publiez la réponse en même temps que l'invitation. Vos militants la partagent quatre mille fois et l'expression « soirée républicaine » prend un coup dont elle ne se remettra pas.",
                    "en": "You publish your reply alongside the invitation. Your activists share it four thousand times, and the phrase “a cordial evening” takes a blow it will not recover from." } },
      "failure": { "effects": { "standing": 2, "popularity": -7, "reputation": -1 },
        "result": { "fr": "La réponse est plus longue que nécessaire et trois phrases de trop sont citées partout. On vous trouve mauvais joueur avant même que les résultats ne tombent.",
                    "en": "The reply is longer than it needed to be and three sentences too many are quoted everywhere. You are called a bad loser before the results are even in." } } },
    { "label": { "fr": "Ne pas répondre du tout", "en": "Not reply at all" },
      "roll": { "chance": 0.7 },
      "success": { "effects": { "energie": 2, "sangfroid": 1, "standing": 1 },
        "result": { "fr": "L'invitation reste sans réponse et personne n'en parle jamais. C'est la seule chose qui ne coûte rien de toute cette soirée.",
                    "en": "The invitation goes unanswered and nobody ever mentions it. It is the only thing that costs nothing all evening." } },
      "failure": { "effects": { "popularity": -4, "standing": -3, "reseau": -1 },
        "result": { "fr": "{Il} raconte en direct qu'{il} vous avait invité et que vous n'avez même pas répondu. La salle rit, et la séquence dure onze secondes de trop.",
                    "en": "{He} says live on air that {he} invited you and that you did not even reply. The room laughs, and the clip runs eleven seconds too long." } } }
  ]
},


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
},
{
  "id": "aside_chef_carte",
  "when": { "partyLead": true },
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "La carte du matin est claire : vous avez de quoi financer quarante campagnes correctes ou douze très bonnes. Les quarante sauvent l'appareil, les douze font des élus, et les deux calculs ne donnent jamais le même résultat.",
    "en": "The morning map is clear: you can fund forty decent campaigns or twelve very good ones. The forty keep the machine alive, the twelve produce elected members, and the two calculations never give the same answer."
  },
  "choices": [
    { "label": { "fr": "Tout concentrer sur les douze gagnables", "en": "Concentrate everything on the twelve winnable seats" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "landscape": { "self": 1.0 }, "credibilite": 2,
                                "reputation": -1 },
        "result": { "fr": "Neuf des douze passent, ce qui est le meilleur rendement de la maison depuis vingt ans. Les vingt-huit autres fédérations ont fait campagne à la photocopieuse et le savent.",
                    "en": "Nine of the twelve get in, the best return the house has had in twenty years. The other twenty-eight federations campaigned on a photocopier and know it." } },
      "failure": { "effects": { "standing": -11, "landscape": { "self": -0.5 }, "reputation": -1 },
        "result": { "fr": "Quatre des douze passent et l'on compte partout ailleurs ce qu'on n'a pas reçu. Un chef de parti qui choisit ses circonscriptions choisit aussi ses ennemis.",
                    "en": "Four of the twelve get in, and everywhere else people are counting what they did not receive. A party leader who picks constituencies is also picking enemies." } } },
    { "label": { "fr": "Répartir également entre les quarante", "en": "Spread it evenly across the forty" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 11, "reseau": 2, "landscape": { "self": 0.3 } },
        "result": { "fr": "Quarante fédérations reçoivent exactement la même somme et pas une ne se plaint. Vous n'aurez pas plus d'élus et vous aurez le congrès, ce qui n'est pas rien.",
                    "en": "Forty federations receive exactly the same sum and not one complains. You will not have more members elected and you will have the conference, which is not nothing." } },
      "failure": { "effects": { "standing": -4, "landscape": { "self": -0.7 }, "credibilite": -1 },
        "result": { "fr": "Chacun reçoit de quoi ne rien faire de bien. Le soir du scrutin, on compte trois élus de moins qu'à la dernière fois et personne ne sait à qui le reprocher.",
                    "en": "Everyone receives enough to do nothing well. On the night, the party is three members down on last time and nobody knows who to blame." } } },
    { "label": { "fr": "Réserver un tiers pour votre propre fédération", "en": "Hold back a third for your own federation" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 },
                                                 { "when": { "trait": ["appareil"] }, "value": 0.2 } ] },
      "success": { "effects": { "appeal": { "self": 3 }, "standing": -3, "reseau": 1, "money": 20000 },
        "result": { "fr": "Votre fédération fait la meilleure campagne du pays, ce qui n'étonnera personne, et personne n'ira vérifier pourquoi. Un tiers ne se voit pas dans une ligne budgétaire.",
                    "en": "Your own federation runs the best campaign in the country, which will surprise nobody, and nobody will check why. A third does not show up in a budget line." } },
      "failure": { "effects": { "standing": -15, "reputation": -2, "strike": "appareil",
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Le trésorier sortant publie le tableau de répartition dans une tribune de deux mille signes. Un tiers, ça se voit très bien dans un tableau.",
                    "en": "The outgoing treasurer publishes the allocation table in a two-thousand-word opinion piece. A third shows up extremely well in a table." } } }
  ]
},

{
  "id": "aside_chef_dissident",
  "when": { "partyLead": true },
  "cast": "camp_senior",
  "tag": { "fr": "Pendant ce temps", "en": "Meanwhile" },
  "text": {
    "fr": "{rival}, à qui vous avez refusé l'investiture, se présente quand même. {Il} a vingt ans de maison, trois cents militants derrière {lui}, et {il} tient une conférence de presse à onze heures.",
    "en": "{rival}, whose nomination you refused, is standing anyway. {He} has twenty years in the house, three hundred activists behind {him}, and a press conference at eleven."
  },
  "choices": [
    { "label": { "fr": "L'exclure le jour même", "en": "Expel {him} the same day" },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 9, "credibilite": 2, "landscape": { "self": 0.4 },
                                "popularity": -3 },
        "result": { "fr": "Bureau politique convoqué à quinze heures, exclusion votée à seize. La maison comprend que la règle existe, ce qu'elle avait cessé de croire.",
                    "en": "Executive convened at three, expulsion voted at four. The house understands that the rule exists, which it had stopped believing." } },
      "failure": { "effects": { "standing": -12, "landscape": { "self": -0.9 }, "reputation": -1 },
        "result": { "fr": "Trois cents militants partent avec {lui} dans la semaine, dont deux membres du bureau politique. On ne compte pas ses ennemis avant de sortir le règlement.",
                    "en": "Three hundred activists leave with {him} within the week, including two members of the executive. You do not count your enemies after reaching for the rulebook." } } },
    { "label": { "fr": "Laisser faire et ne pas commenter", "en": "Let it happen and refuse to comment" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "minStanding": 62 }, "value": 0.2 },
                                                { "when": { "personality": ["calculating"] }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 4, "sangfroid": 1, "landscape": { "self": 0.2 } },
        "result": { "fr": "{Il} fait quatre pour cent et rentre à la maison en novembre. Vous n'avez pas prononcé son nom une seule fois, et c'est la seule chose qu'{il} ne vous pardonnera pas.",
                    "en": "{He} takes four per cent and comes home in November. You did not say {his} name once, and it is the only thing {he} will not forgive you." } },
      "failure": { "effects": { "standing": -8, "landscape": { "self": -0.8 }, "credibilite": -2 },
        "result": { "fr": "{Il} fait onze pour cent, prend la circonscription et fonde son mouvement en janvier. Une dissidence qu'on ne combat pas s'appelle un parti six mois plus tard.",
                    "en": "{He} takes eleven per cent, wins the seat and founds a movement in January. A rebellion nobody fights is called a party six months later." } } },
    { "label": { "fr": "Lui proposer autre chose, tout de suite", "en": "Offer {him} something else, immediately" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "eloquence": 0.35 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "reseau": 2, "landscape": { "self": 0.5 },
                                "reputation": -1 },
        "result": { "fr": "Vous lui offrez la tête de liste aux européennes avant onze heures. La conférence de presse devient une déclaration de soutien, et deux journalistes repartent sans papier.",
                    "en": "You offer {him} the top of the European list before eleven o'clock. The press conference becomes an endorsement, and two reporters leave without a story." } },
      "failure": { "effects": { "standing": -6, "reputation": -2, "landscape": { "self": -0.5 },
                                "strike": "appareil" },
        "result": { "fr": "{Il} lit votre proposition à haute voix devant les caméras, à onze heures deux. Le mot « marchandage » est prononcé par {lui}, ce qui est bien pire que par la presse.",
                    "en": "{He} reads your offer out loud in front of the cameras at two minutes past eleven. The word “horse-trading” is said by {him}, which is far worse than by the press." } } }
  ]
},

{
  "id": "aside_chef_bilan_national",
  "when": { "partyLead": true },
  "tag": { "fr": "Le soir du scrutin", "en": "Election night" },
  "text": {
    "fr": "Vingt heures. Le score national du parti s'affiche, et c'est le vôtre : vous n'étiez sur aucun bulletin et c'est votre nom que trois éditorialistes prononcent dans la minute qui suit.",
    "en": "Eight o'clock. The party's national score comes up, and it is yours: you were on no ballot and it is your name three commentators say within the minute."
  },
  "choices": [
    { "label": { "fr": "Assumer le résultat au micro, seul", "en": "Own the result at the microphone, alone" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 10, "credibilite": 2, "popularity": 4, "reputation": 1 },
        "result": { "fr": "Vous descendez à vingt heures dix, sans notes, et vous prenez tout : les circonscriptions perdues, les investitures ratées, la ligne. Personne dans la salle n'attendait ça et tout le monde s'en souviendra.",
                    "en": "You come down at ten past eight, without notes, and you take all of it: the seats lost, the nominations botched, the line. Nobody in the room expected it and everybody will remember it." } },
      "failure": { "effects": { "standing": -9, "popularity": -5, "credibilite": -1 },
        "result": { "fr": "Vous parlez sept minutes de contexte national avant d'arriver au résultat. La chaîne coupe au bout de quatre, et le montage garde les quatre.",
                    "en": "You speak for seven minutes about the national context before reaching the result. The channel cuts after four, and the edit keeps the four." } } },
    { "label": { "fr": "Faire monter les gagnants et rester en coulisses", "en": "Put the winners on stage and stay in the wings" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 58 }, "value": 0.2 } ] },
      "success": { "effects": { "standing": 8, "reseau": 3, "landscape": { "self": 0.4 },
                                "popularity": -2 },
        "result": { "fr": "Six nouveaux élus au micro, et vous au fond de la salle avec un verre en plastique. Ces six-là voteront pour vous au prochain congrès sans qu'on ait besoin de le leur demander.",
                    "en": "Six newly elected members at the microphone, and you at the back of the room with a plastic cup. Those six will vote for you at the next conference without anyone having to ask." } },
      "failure": { "effects": { "standing": -5, "notoriete": -1, "popularity": -4 },
        "result": { "fr": "Les six parlent, aucun ne vous cite, et la chaîne conclut en s'interrogeant sur votre absence. Rester en coulisses un soir de défaite s'appelle se cacher.",
                    "en": "The six speak, none of them mentions you, and the channel signs off wondering where you were. Staying in the wings on the night of a defeat is called hiding." } } },
    { "label": { "fr": "Désigner un responsable, et ce ne sera pas vous", "en": "Name someone responsible, and it will not be you" },
      "when": { "personality": ["calculating"] },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "minStanding": 65 }, "value": 0.25 },
                                                { "when": { "trait": ["appareil"] }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 6, "reseau": -1, "reputation": -2, "credibilite": 1 },
        "result": { "fr": "Le directeur des élections démissionne à vingt-deux heures pour raisons personnelles. Tout le monde sait, personne ne dit, et la maison retient que le sommet ne tombe pas.",
                    "en": "The elections director resigns at ten for personal reasons. Everyone knows, nobody says, and the house registers that the top does not fall." } },
      "failure": { "effects": { "standing": -14, "reputation": -2, "popularity": -4,
                                "strike": "traitre", "landscape": { "self": -0.5 } },
        "result": { "fr": "Il refuse de tomber et donne trois interviews en quarante-huit heures avec des dates, des courriels et un plan de campagne signé de votre main.",
                    "en": "He refuses to fall and gives three interviews in forty-eight hours, with dates, emails and a campaign plan signed in your own hand." } } }
  ]
}

];
