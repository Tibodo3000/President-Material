/* Un paquet d'événements. Le schéma est en tête de js/events/_assemble.data.js. */
const EV_institutions = [


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
  "when": { "ruling": true, "position": ["depute", "ministre", "chef"], "minStanding": 62, "minTurn": 32 },
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
      "effects": { "credibilite": -2, "standing": -10, "sangfroid": 1, "reputation": 1 },
      "result": { "fr": "Vous expliquez que vous serez plus utile ailleurs. Dans dix-huit mois, quand votre successeur sera brûlé, on se souviendra que vous aviez vu juste, et on ne vous rappellera pas.",
                  "en": "You explain you will be more use elsewhere. In eighteen months, when your successor is burnt out, people will remember you were right, and they will not call you back." } }
  ]
},


{
  "id": "matignon_ouverture",
  "once": true,
  "weight": 6,
  // "pivot" EST LA SCÈNE ELLE-MÊME : le gouvernement n'a pas la majorité, et il
  // l'aurait avec vos députés. Sans cette condition, l'émissaire venait
  // proposer Matignon « en échange de vos voix » à un joueur dont le président
  // disposait d'une majorité absolue, ce qui ne s'échange contre rien.
  "when": { "ruling": false, "rulingClose": true, "pivot": true,
            "position": ["depute", "ministre", "chef"],
            "minPopularity": 63, "minShare": 15, "minTurn": 32 },
  "tag": { "fr": "Matignon", "en": "The top job" },
  "text": {
    "fr": "Le président n'a pas de majorité et vient du camp d'à côté. Un émissaire vous propose Matignon en échange de vos voix à l'Assemblée. Votre parti n'est pas au courant."
    ,
    "en": "The president has no majority and comes from the camp next door. An envoy offers you the top job in exchange for your votes in parliament. Your party has not been told."
  },
  "choices": [
    { "label": { "fr": "Accepter et prévenir votre parti après", "en": "Accept, and tell your party afterwards" },
      "effects": { "office": "premier", "notoriete": 4, "credibilite": 3, "popularity": 6, "standing": -16, "reputation": -2, "appeal": { "self": -10, "ruling": 6 }, "strike": "traitre" },
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
  "delay": [2, 6],
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
      "success": { "effects": { "credibilite": 3, "standing": 5, "energie": -3 },
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
  "when": { "position": ["premier"], "minTurn": 8 },
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
  /* « Le mandat s'achève et il faut dire si vous repartez » se disait à
     n'importe quel tour, et le plus souvent à quelqu'un qui venait d'être élu.
     La scène attend maintenant que le siège occupé soit VRAIMENT sur le point
     d'être remis en jeu : voir "seatUp".

     ET ELLE PARLE PLUS FORT À MESURE QUE LA DATE APPROCHE. Trois tours sur
     vingt-quatre, c'est une scène qu'on ne verrait plus jamais si elle gardait
     le poids ordinaire d'un événement tiré au hasard : la question se pose
     neuf mois avant, elle devient difficile à éviter le trimestre d'avant, et
     les deux primes se cumulent au dernier tour. */
  "weight": 7,
  "weightBonus": [ { "when": { "seatUp": 2 }, "value": 7 },
                   { "when": { "seatUp": 1 }, "value": 7 } ],
  "when": { "minAge": 62, "notTrait": ["declin"], "seatUp": 3 },
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
  // ON NE COMPOSE PAS UNE LISTE EUROPÉENNE TROIS ANS AVANT LES EUROPÉENNES,
  // et surtout ON N'ENTRE PAS À STRASBOURG SANS SCRUTIN. La scène tombait
  // n'importe quand et donnait le siège le jour même, par un effet "office".
  // Elle attend donc que l'échéance soit proche, et elle donne ce qu'une
  // direction de parti peut donner : l'investiture. Le scrutin fait le reste,
  // en position favorable.
  "when": { "position": ["maire", "depute"], "minTurn": 20,
            "nextElection": ["europeennes"], "nextElectionIn": 2 },
  "tag": { "fr": "Tête de liste", "en": "Top of the list" },
  "text": {
    "fr": "La direction cherche une tête de liste aux européennes. On vous parle de dimension internationale, de dossiers d'avenir et de reconnaissance. Le poste est à Bruxelles, et vos électeurs sont ici."
    ,
    "en": "The leadership is looking for someone to top the European list. They talk about an international dimension, about the files of the future, about recognition. The job is in Brussels, and your voters are here."
  },
  "choices": [
    { "label": { "fr": "Accepter la tête de liste", "en": "Take the top spot" },
      "effects": { "nominate": "europeennes", "notoriete": 1, "standing": 6, "popularity": -5, "eloquence": 1 },
      "result": { "fr": "Votre nom est en haut de la liste, à la place qui n'a jamais été battue. Reste le scrutin, dont personne ne suivra la campagne et dont la chaîne parlera quatre minutes le soir des résultats.",
                  "en": "Your name is at the top of the list, in the slot that has never lost. That leaves the vote itself, whose campaign nobody will follow and which the channel will give four minutes on results night." } },
    { "label": { "fr": "Refuser et rester au pays", "en": "Refuse and stay at home" },
      "effects": { "standing": -9, "popularity": 3, "reputation": 1 },
      "result": { "fr": "Vous répondez que votre travail est ici. La direction note votre réponse dans un carnet qu'elle rouvrira au moment des investitures.",
                  "en": "You answer that your work is here. The leadership notes your reply in a book it will open again when nominations come round." } },
    { "label": { "fr": "Accepter en échange d'une place au bureau politique", "en": "Accept in exchange for a seat on the executive" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.06, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "nominate": "europeennes", "standing": 11, "reseau": 1, "popularity": -4 },
        "result": { "fr": "La tête de liste et, en prime, un siège permanent dans l'instance qui décide de tout ici. On voulait vous éloigner de Paris ; on vient de vous en donner la clé, et il reste à gagner le scrutin.",
                    "en": "The top of the list and, thrown in, a permanent seat on the body that decides everything back home. They wanted you away from Paris; they have just handed you the key to it, and the vote is still to be won." } },
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
      "success": { "effects": { "axis": {"world": 60}, "notoriete": 2, "popularity": 7, "reputation": -1, "landscape": { "self": 0.8 } },
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
  "when": { "position": ["euro"], "minTurn": 8 },
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
  "when": { "position": ["euro"], "minTurn": 12 },
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
  "when": { "position": ["euro"], "minTurn": 16 },
  "tag": { "fr": "Consigne de vote", "en": "The whip" },
  "text": {
    "fr": "Votre groupe européen vote pour un texte que votre parti combat à la maison depuis dix ans. Les deux consignes arrivent le même matin, signées de deux personnes qui se sont parlé.",
    "en": "Your European group is voting for a text your party has fought at home for ten years. Both instructions arrive the same morning, signed by two people who have spoken to each other."
  },
  "choices": [
    { "label": { "fr": "Suivre la ligne nationale", "en": "Follow the national line" },
      "effects": { "standing": 6, "reputation": -1, "appeal": { "self": 5 } },
      "result": { "fr": "Vous votez contre votre groupe et vous perdez la vice-présidence d'une commission dont vos électeurs ignorent l'existence. La direction du parti, elle, a compté votre vote.",
                  "en": "You vote against your group and lose the vice-chair of a committee your voters have never heard of. The party leadership, on the other hand, counted your vote." } },
    { "label": { "fr": "Suivre le groupe européen", "en": "Follow the European group" },
      "effects": { "axis": {"world": -70}, "reseau": 2, "reputation": 3, "standing": -5, "eloquence": 1, "popularity": 2 },
      "result": { "fr": "Vous votez avec vos collègues et vous expliquez pourquoi dans une tribune que trois personnes liront à Paris. Deux d'entre elles siègent au bureau politique.",
                  "en": "You vote with your colleagues and explain why in an op-ed three people will read at home. Two of them sit on the executive." } },
    { "label": { "fr": "Ne pas prendre part au vote et le faire savoir", "en": "Abstain, loudly" },
      "effects": { "strike": "lache", "sangfroid": 1, "standing": -3, "popularity": -3, "reputation": -1 },
      "result": { "fr": "Vous publiez un communiqué de quatre paragraphes pour expliquer une abstention. Les deux camps y lisent une lâcheté et se trompent rarement.",
                  "en": "You put out four paragraphs to explain an abstention. Both sides read it as cowardice, and they are rarely wrong." } },
    { "label": { "fr": "Faire du vote une affaire nationale", "en": "Turn the vote into a national story" },
      "when": { "personality": ["provocative"] },
      "effects": { "axis": {"world": 70}, "notoriete": 2, "popularity": 8, "standing": -10, "landscape": { "self": 1.2 } },
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
  /* POIDS ZÉRO : ELLE NE SE TIRE PLUS AU HASARD. C'est maybeGovernmentCall()
     qui la pose, à la seconde où le gouvernement se compose. Tirée dans le
     paquet ordinaire, elle court-circuitait la seule règle qui compte ici et
     qu'un "when" ne sait pas dire : on n'entre au gouvernement que si l'on
     pèse plus que le moins populaire de ceux qui y sont déjà. Un ministère
     tombait donc encore, de temps en temps, comme un billet de loterie. */
  "weight": 0,
  "when": { "ruling": true, "position": ["maire", "euro", "depute"], "minStanding": 50, "minTurn": 24 },
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
      "effects": { "standing": -12, "popularity": 2, "reputation": 2, "sangfroid": 1 },
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
      "success": { "effects": { "credibilite": +3, "standing": 6, "reputation": 2, "energie": -2 },
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
      "effects": { "credibilite": -2, "notoriete": 1, "popularity": 7, "standing": -12, "reputation": -1, "appeal": { "self": -6 },
                   "landscape": { "ruling": -1.2 } },
      "result": { "fr": "Les chiffres sortent le jeudi, attribués à un proche du dossier. Tout le monde sait que c'est vous, personne ne peut le prouver, et le ministère garde son budget.",
                  "en": "The figures come out on Thursday, sourced to someone close to the file. Everyone knows it was you, nobody can prove it, and the department keeps its budget." } },
    { "label": { "fr": "Menacer de démissionner sur-le-champ", "en": "Threaten to resign on the spot" },
      "when": { "trait": ["intrepide"] },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "popularity": 0.06, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": +1, "standing": 12, "notoriete": 1 },
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
  "when": { "position": ["ministre"], "minTurn": 8 },
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
      "effects": { "popularity": 8, "reputation": 2, "standing": -14, "notoriete": 1, "appeal": { "self": -7 }, "chain": "position_impopulaire" },
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
  "when": { "position": ["ministre"], "minTurn": 12 },
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
  "when": { "position": ["ministre"], "minTurn": 16 },
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
  "when": { "position": ["ministre"], "minTurn": 20, "minPopularity": 54 },
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
  "delay": [6, 12],
  "when": { "position": ["ministre"] },
  "tag": { "fr": "Le moment venu", "en": "The moment comes" },
  "text": {
    "fr": "La réforme s'effondre exactement comme vous l'aviez prévu. Vous avez les notes, les dates et le nom de ceux qui ont insisté.",
    "en": "The reform collapses exactly as you predicted. You have the notes, the dates and the names of those who insisted."
  },
  "choices": [
    { "label": { "fr": "Partir en publiant tout", "en": "Walk out and publish everything" },
      "effects": { "office": "none", "popularity": 12, "notoriete": 2, "standing": -16, "reputation": 1, "appeal": { "ruling": -8 },
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
}
];
