/* Un paquet d'événements. Le schéma est en tête de js/events/_assemble.data.js. */
const EV_medias = [


/* ==========================================================================
   2. MÉDIAS ET IMAGE
   ========================================================================== */

{
  "id": "matinale",
  "when": { "position": ["conseiller", "maire", "euro", "depute", "ministre", "chef"] },
  "tag": { "fr": "Médias", "en": "Media" },
  "text": {
    "fr": "Huit heures vingt demain, la matinale que le pays écoute dans sa voiture. Le journaliste prépare ses entretiens avec deux documentalistes et n'a jamais laissé passer un chiffre faux en onze ans. Votre attachée de presse a dit oui avant de vous demander.",
    "en": "Twenty past eight tomorrow, the morning show the country listens to in the car. The host prepares with two researchers and has not let a wrong figure through in eleven years. Your press officer said yes before asking you."
  },
  "choices": [
    { "label": { "fr": "Préparer l'entretien toute la nuit", "en": "Prepare all night" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "eloquence": 1, "energie": -2, "notoriete": 1, "popularity": 7, "standing": 3 },
      "result": { "fr": "Quatre heures de fiches, deux cafés et pas une hésitation à l'antenne. Vous sortez du studio à neuf heures avec l'impression d'avoir passé un examen, ce qui est exactement ce qui vient de se produire.",
                  "en": "Four hours of briefing notes, two coffees and not one hesitation on air. You leave the studio at nine feeling as though you have sat an examination, which is exactly what has happened." } },
    { "label": { "fr": "Y aller à l'instinct", "en": "Wing it" },
      "roll": { "base": 19, "stat": "charisme",
                "plus": { "eloquence": 0.4, "popularity": 0.035 },
                "bonus": [ { "when": { "position": ["chef", "depute", "ministre"] }, "value": 1.5 },
                           { "when": { "stat": { "energie": { "max": 6 } } }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "landscape": { "self": -0.7 }, "notoriete": 2, "popularity": 12, "standing": 2 },
        "result": { "fr": "Vous répondez à côté de la question et mieux qu'elle. La séquence est découpée avant la fin de l'émission et tourne jusqu'au soir, sans que personne se souvienne du sujet de départ.",
                    "en": "You answer beside the question and better than it. The clip is cut before the show is over and runs until the evening, with nobody remembering what the question was." } },
      "failure": { "effects": { "reputation": -1, "popularity": -9, "standing": -4 },
        "result": { "fr": "Il vous demande le montant du budget dont vous parlez depuis trois minutes. Le blanc dure quatre secondes, l'émission continue une heure, et c'est le blanc qui est en ligne à neuf heures dix.",
                    "en": "He asks you the size of the budget you have been discussing for three minutes. The silence lasts four seconds, the programme runs another hour, and it is the silence that is online by ten past nine." } },
      "triumph": { "effects": { "landscape": { "self": -0.9 }, "notoriete": 2, "popularity": 15, "standing": 2, "trait": "bete_scene" },
        "result": { "fr": "Vous répondez à une question par une phrase que personne n'avait préparée, et le plateau comprend avant vous que la matinale vient de basculer. À midi elle est partout. Le soir, on vous invite ailleurs pour la redire.",
                    "en": "You answer a question with a line nobody had prepared, and the studio understands before you do that the morning show has just turned. By noon it is everywhere. By evening you are invited elsewhere to say it again." } },
      "debacle": { "effects": { "reputation": -1, "popularity": -12, "standing": -5, "strike": "menteur" },
        "result": { "fr": "Acculé, vous promettez quelque chose que vous ne pourrez pas tenir. Le journaliste le répète lentement pour être bien sûr, vous confirmez, et ces trente secondes vous suivront plus longtemps que l'émission.",
                    "en": "Cornered, you promise something you will not be able to deliver. The host repeats it slowly to be sure, you confirm, and those thirty seconds will follow you longer than the show ever could." } } },
    { "label": { "fr": "Faire briefer par votre communicant", "en": "Get briefed by your spin doctor" },
      "when": { "background": ["comms"] },
      "effects": { "eloquence": 1, "popularity": 9, "standing": 5, "reputation": -1 },
      "result": { "fr": "Vous avez écrit ces questions pendant dix ans pour d'autres, et vous connaissez les trois auxquelles il tient. Chaque réponse tombe juste, et vous savez précisément à quel moment vous mentez bien.",
                  "en": "You wrote these questions for other people for ten years, and you know the three he cares about. Every answer lands, and you know exactly at which moment you are lying well." } },
    { "label": { "fr": "Payer une préparation médias", "en": "Pay for media training" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -25000, "eloquence": 1, "popularity": 8, "standing": 3 },
      "result": { "fr": "Deux jours en studio loué face à un ancien présentateur payé pour être plus dur que le vrai. L'entretien se passe sans accroc et vous ne direz jamais à personne ce qu'il a coûté.",
                  "en": "Two days in a hired studio facing a retired presenter paid to be harder than the real one. The interview goes without a hitch and you will never tell anyone what it cost." } }
  ]
},


{
  "id": "vieux_tweet",
  "when": { "stat": { "notoriete": { "min": 6 } } },
  "tag": { "fr": "Réseaux", "en": "Social media" },
  "text": {
    "fr": "Un compte qui archive tout et publie par lots ressort un message de vous vieux de onze ans. Il fait deux lignes, il n'était déjà pas drôle à l'époque, et il est en train de devenir le sujet de la journée pendant qu'un budget se vote ailleurs.",
    "en": "An account that archives everything and posts in batches has dug up a message of yours from eleven years ago. It runs to two lines, it was not funny then either, and it is becoming the story of the day while a budget is voted somewhere else."
  },
  "choices": [
    { "label": { "fr": "Présenter des excuses", "en": "Apologise" },
      "effects": { "reputation": 1, "notoriete": -1, "popularity": -3, "standing": 5 },
      "result": { "fr": "Trois phrases publiées à onze heures, sans conditionnel et sans expliquer le contexte, ce qui est la seule façon que cela s'arrête. L'affaire meurt avant le déjeuner et le siège note que vous savez éteindre un feu.",
                  "en": "Three sentences posted at eleven, with no conditional and no explanation of the context, which is the only way these things stop. It is dead before lunch and head office notes that you know how to put a fire out." } },
    { "label": { "fr": "Assumer sans trembler", "en": "Stand by it" },
      "effects": { "axis": "self", "notoriete": 2, "reputation": -1, "popularity": 7, "standing": -9 },
      "result": { "fr": "Vous répondez que vous pensiez cela à l'époque et que vous ne réécrirez pas votre vie à la demande d'un compte anonyme. Le message dépasse les quatre millions de vues, et le service de presse du parti cesse de répondre au téléphone pendant deux jours.",
                  "en": "You answer that you thought so at the time and that you will not rewrite your life at the request of an anonymous account. The post passes four million views, and the party press office stops answering the phone for two days." } },
    { "label": { "fr": "En remettre une couche", "en": "Double down, harder" },
      "when": { "personality": ["provocative"] },
      "effects": { "axis": "self", "landscape": { "self": -1.2 }, "notoriete": 3, "reputation": -2, "popularity": 9, "standing": -14, "strike": "radical" },
      "result": { "fr": "Vous republiez le message avec un commentaire pire, à vingt-trois heures, sans consulter personne. Le pays ne parle que de vous pendant trois jours, deux fédérations demandent une clarification, et quatre mille personnes adhèrent au parti dans la semaine.",
                  "en": "You repost the message with a worse comment, at eleven at night, without consulting anyone. The country talks about nothing else for three days, two branches ask for clarification, and four thousand people join the party that week." } },
    { "label": { "fr": "Noyer l'affaire sous une contre-campagne", "en": "Bury it under a counter-campaign" },
      "when": { "background": ["comms"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 4, "standing": 6, "strike": "menteur" },
        "result": { "fr": "Trois sujets sortent le même après-midi, dont deux vrais, et le fil se remplit d'autre chose avant dix-sept heures. Vous savez lesquels vous avez placés et vous ne l'écrirez nulle part.",
                    "en": "Three stories break the same afternoon, two of them real, and the feed fills up with something else before five. You know which ones you placed and you will write it down nowhere." } },
      "failure": { "effects": { "popularity": -7, "reputation": -1 },
        "result": { "fr": "Les trois sujets sortent à quatre minutes d'intervalle et une journaliste le remarque. L'article du lendemain ne parle plus du message de deux mille quatorze, il parle de la façon dont on enterre un message de deux mille quatorze.",
                    "en": "The three stories break four minutes apart and a journalist notices. The next day's article is no longer about the message from twenty fourteen, it is about how a message from twenty fourteen gets buried." } } }
  ]
},


{
  "id": "gaffe",
  "tag": { "fr": "Meeting", "en": "Rally" },
  "text": {
    "fr": "Onzième meeting en dix-sept jours, fin d'un paragraphe que vous avez dit cent fois, et la phrase sort à l'envers. Elle dure trois secondes, elle est indéfendable une fois isolée, et elle est isolée depuis quatre minutes.",
    "en": "Eleventh rally in seventeen days, the end of a paragraph you have delivered a hundred times, and the sentence comes out backwards. It lasts three seconds, it is indefensible once cut out, and it has been cut out for four minutes."
  },
  "choices": [
    { "label": { "fr": "En rire vous-même", "en": "Laugh at yourself" },
      "roll": { "stat": "charisme", "base": 13, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "popularity": 9 },
        "result": { "fr": "Vous ouvrez le meeting suivant en la redisant volontairement de travers, et la salle rit avant vous. Les rédactions préfèrent toujours une histoire drôle à une histoire grave, et vous venez de leur en fournir une.",
                    "en": "You open the next rally by deliberately saying it wrong again, and the hall laughs before you do. Newsrooms always prefer a funny story to a serious one, and you have just handed them one." } },
      "failure": { "effects": { "credibilite": -3, "reputation": -1, "popularity": -13, "standing": -6 },
        "result": { "fr": "Le rire arrive une seconde trop tard et ne trompe personne. On passe désormais les deux séquences à la suite, la phrase puis le rire, et c'est la seconde qui est la pire.",
                    "en": "The laugh comes a second too late and fools nobody. The two clips are now played back to back, the sentence then the laugh, and it is the second one that does the damage." } } },
    { "label": { "fr": "Communiqué de clarification", "en": "Issue a clarification" },
      "effects": { "credibilite": +1, "notoriete": -1, "popularity": -5, "standing": 4 },
      "result": { "fr": "Quatre paragraphes envoyés à vingt-deux heures, dont trois expliquent le contexte et un regrette une interprétation. Le sujet meurt le lendemain matin, en même temps que l'idée que vous étiez quelqu'un d'intéressant à inviter.",
                  "en": "Four paragraphs sent out at ten at night, three of them explaining the context and one regretting an interpretation. The story dies the next morning, along with the idea that you were somebody interesting to book." } },
    { "label": { "fr": "Assumer et répéter la phrase", "en": "Own it and say it again" },
      "when": { "personality": ["provocative"] },
      "effects": { "axis": "self", "landscape": { "self": -1.6 }, "credibilite": -3, "notoriete": 3, "reputation": -2, "popularity": 7, "standing": -12 },
      "result": { "fr": "Vous la redites le soir même, plus lentement, pour qu'on ne puisse pas parler de dérapage. Une moitié du pays vous adore pour ça, l'autre vous cite pendant six ans, et le bureau politique apprend la nouvelle par une alerte téléphone.",
                  "en": "You say it again the same evening, more slowly, so that nobody can call it a slip. Half the country loves you for it, the other half quotes it back at you for six years, and the party executive learns of it from a phone alert." } },
    { "label": { "fr": "Exiger un droit de réponse", "en": "Demand a right of reply" },
      "when": { "background": ["law"] },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": -4, "standing": 4, "notoriete": -1 },
      "result": { "fr": "Vous citez l'article et le délai de réponse au téléphone, sans hausser la voix. Les rédactions rectifient en trois lignes, en bas de page, et retiennent surtout que vous êtes du genre à connaître la loi sur la presse par cœur.",
                  "en": "You quote the article and the deadline down the phone, without raising your voice. The newsrooms correct it in three lines at the bottom of the page, and mostly note that you are the sort who knows press law by heart." } }
  ]
},


{
  "id": "documentaire",
  "when": { "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Portrait", "en": "Profile" },
  "text": {
    "fr": "Une société de production demande six mois d'accès : les réunions, la voiture, les coups de téléphone et les soirs de résultats. Elle a fait le même film sur deux de vos prédécesseurs. L'un en est sorti grandi, l'autre a quitté la politique dans l'année.",
    "en": "A production company is asking for six months of access: the meetings, the car, the phone calls and the election nights. It made the same film about two of your predecessors. One came out of it enlarged, the other left politics within the year."
  },
  "choices": [
    { "label": { "fr": "Accepter l'accès total", "en": "Grant total access" },
      "roll": { "chance": 0.55 },
      "success": { "effects": { "landscape": { "self": -0.9 }, "notoriete": 2, "popularity": 12, "standing": -5, "trait": "bete_scene" },
        "result": { "fr": "Le film garde la scène où vous refaites un discours à deux heures du matin et celle où vous appelez votre mère depuis un parking. Deux millions de personnes le regardent et vous n'êtes plus tout à fait un dossier pour elles.",
                    "en": "The film keeps the scene where you rewrite a speech at two in the morning and the one where you call your mother from a car park. Two million people watch it and you are no longer quite a file to them." } },
      "failure": { "effects": { "notoriete": 2, "reputation": -2, "popularity": -12, "standing": -8 },
        "result": { "fr": "Le montage garde les onze secondes où vous parlez de vos militants comme d'un problème logistique. Elles sont exactes, elles ne sont pas coupées de leur contexte, et c'est ce qui les rend impossibles à démentir.",
                    "en": "The edit keeps the eleven seconds in which you talk about your activists as a logistics problem. They are accurate, they are not taken out of context, and that is what makes them impossible to deny." } } },
    { "label": { "fr": "Refuser poliment", "en": "Decline politely" },
      "effects": { "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Vous répondez que votre travail se juge sur des textes, pas sur des images, ce que personne n'a jamais cru. Le film se fera sur quelqu'un d'autre, et ce sera lui qu'on trouvera humain.",
                  "en": "You answer that your work should be judged on texts, not pictures, which nobody has ever believed. The film will be made about somebody else, and it is that person who will be found human." } },
    { "label": { "fr": "Exiger un droit de regard au montage", "en": "Demand editorial control" },
      "when": { "background": ["journalism", "comms"] },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "notoriete": 2, "popularity": 9, "standing": 4 },
        "result": { "fr": "Vous obtenez un visionnage préalable qui ne s'appelle pas un droit de regard, et deux scènes disparaissent sans que le mot coupe soit prononcé. Le film est bon, il est flatteur, et la mention au générique dit que la production a gardé son indépendance.",
                    "en": "You get a preview screening that is not called editorial control, and two scenes disappear without the word cut ever being said. The film is good, it is flattering, and the closing credits state that the production kept its independence." } },
      "failure": { "effects": { "notoriete": 1, "reputation": -1, "popularity": -5 },
        "result": { "fr": "La production refuse par écrit, publie votre courrier et tourne le film sans vous. Il commence par la phrase de votre demande, lue à voix haute sur un fond noir.",
                    "en": "The company refuses in writing, publishes your letter and makes the film without you. It opens with the sentence from your request, read aloud over a black screen." } } }
  ]
},


{
  "id": "photo_volee",
  "when": { "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "Sept pages de vos vacances dans un magazine. Il n'y a rien dedans : vous marchez, vous portez un sac, vous entrez dans un hôtel dont le prix de la nuit est en légende. Ce prix est le seul travail de recherche du dossier et c'est le seul chiffre que le pays retiendra.",
    "en": "Seven pages of your holiday in a magazine. There is nothing in it: you walk, you carry a bag, you go into a hotel whose nightly rate appears in the caption. That rate is the only research in the piece and it is the only figure the country will remember."
  },
  "choices": [
    { "label": { "fr": "Attaquer en justice", "en": "Sue" },
      "effects": { "money": -30000, "notoriete": 1, "popularity": -6, "standing": 2 },
      "result": { "fr": "Deux ans de procédure pour obtenir un euro symbolique et la publication du jugement en page trente et un. Chaque audience remet les sept pages en ligne, avec le prix de la nuit dans le premier paragraphe de la dépêche.",
                  "en": "Two years of proceedings for a symbolic euro and publication of the judgment on page thirty-one. Every hearing puts the seven pages back online, with the nightly rate in the first paragraph of the wire copy." } },
    { "label": { "fr": "Ne pas relever", "en": "Let it pass" },
      "effects": { "sangfroid": 1, "popularity": -3 },
      "result": { "fr": "Vous ne dites rien et vous ne changez rien à votre agenda, ce qui demande plus de sang-froid qu'un communiqué. L'histoire meurt en dix jours, comme toutes les autres, et elle ressortira le jour où vous parlerez de pouvoir d'achat.",
                  "en": "You say nothing and change nothing in your diary, which takes more nerve than a statement. The story dies in ten days, like all the others, and it will come back the day you talk about the cost of living." } },
    { "label": { "fr": "Publier vous-même l'album complet", "en": "Publish the whole album yourself" },
      "when": { "personality": ["provocative", "charming"] },
      "effects": { "notoriete": 2, "popularity": 8, "reputation": -1 },
      "result": { "fr": "Vous publiez les quatre cents photos du séjour, y compris celles où vous êtes mal cadré, avec les légendes que le magazine n'a pas osé mettre. Il ne reste plus rien à vendre à personne, et c'est la seule chose que craint vraiment un magazine.",
                  "en": "You publish all four hundred photographs from the trip, including the badly framed ones, with the captions the magazine did not dare use. There is nothing left to sell to anybody, which is the only thing a magazine is really afraid of." } },
    { "label": { "fr": "Racheter les droits des photos restantes", "en": "Buy the rights to the remaining photos" },
      "when": { "minMoney": 250000 },
      "effects": { "money": -140000, "popularity": 2, "sangfroid": 1 },
      "result": { "fr": "L'agence vend les droits restants sans poser de question, par un contrat de deux pages qui parle d'exclusivité éditoriale. Ce qui n'est pas sorti ne sortira jamais, et vous venez d'apprendre le tarif exact de votre tranquillité.",
                  "en": "The agency sells the remaining rights without asking a question, in a two-page contract about editorial exclusivity. What has not come out never will, and you have just learned the exact price of your peace and quiet." } }
  ]
}
];
