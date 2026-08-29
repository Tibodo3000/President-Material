/* Un paquet d'événements. Le schéma est en tête de js/events/_assemble.data.js. */
const EV_divers = [


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
  "when": { "position": ["maire", "euro", "depute", "ministre", "chef", "premier"], "minTurn": 24 },
  "tag": { "fr": "Signalement", "en": "A complaint" },
  "text": {
    "fr": "Une collaboratrice du parti signale des faits graves visant un cadre de votre camp. Le dossier est solide, elle a des témoins, et l'homme visé est celui que tout le monde décrit comme irremplaçable sur les retraites. La direction attend votre position avant de prendre la sienne."
    ,
    "en": "A party staffer reports serious conduct by a senior figure in your camp. The file is solid, she has witnesses, and the man named is the one everybody calls irreplaceable on pensions. The leadership is waiting for your position before taking its own."
  },
  "choices": [
    { "label": { "fr": "Le suspendre immédiatement et le dire publiquement", "en": "Suspend him immediately, and say so publicly" },
      "effects": { "axis": {"social": -60}, "reputation": 3, "popularity": 9, "standing": -12, "credibilite": 2, "notoriete": 1,
                   "landscape": { "self": 0.6 } },
      "result": { "fr": "Il est écarté en quarante-huit heures. Trois cadres vous reprochent d'avoir « cédé à l'émotion », et l'un d'eux vous le redira à chaque commission d'investiture pendant dix ans.",
                  "en": "He is out within forty-eight hours. Three senior figures accuse you of “giving in to emotion”, and one of them will remind you of it at every nomination committee for ten years." } },

    { "label": { "fr": "Créer une cellule interne et attendre ses conclusions", "en": "Set up an internal panel and wait for its findings" },
      "effects": { "reputation": -1, "standing": 5, "popularity": -4, "chain": "vss_presse" },
      "result": { "fr": "La cellule est annoncée le vendredi soir. Elle compte quatre membres, dont deux qui le tutoient, et son calendrier n'est pas précisé.",
                  "en": "The panel is announced on a Friday evening. It has four members, two of whom are on first-name terms with him, and no timetable is given." } },

    { "label": { "fr": "Rappeler qu'il faut laisser la justice faire son travail", "en": "Insist that the courts must be allowed to do their work" },
      "effects": { "axis": {"social": 55}, "reputation": -2, "standing": 8, "popularity": 6, "credibilite": -1,
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
  "delay": [8, 20],
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
  "when": { "minTurn": 12, "notTrait": ["declin"] },
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
  "when": { "minTurn": 28, "stat": { "notoriete": { "min": 8 } } },
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
  "when": { "position": ["ministre", "chef", "premier", "depute", "euro"], "minTurn": 24 },
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
   11. SITUATIONS PARTICULIÈRES
   ========================================================================== */

{
  "id": "chute_libre",
  "weight": 3,
  "when": { "maxPopularity": 45, "position": ["maire", "depute", "ministre", "chef"] },
  "tag": { "fr": "Traversée du désert", "en": "In the wilderness" },
  "text": {
    "fr": "Quatrième sondage de suite dans la même direction. On ne vous propose plus de plateau, on vous propose des duplex, et deux personnes qui vous doivent leur carrière ont trouvé un empêchement pour la photo de famille de samedi.",
    "en": "The fourth poll in a row pointing the same way. Nobody offers you a studio any more, only remote links, and two people who owe you their careers have found a reason not to be in Saturday's group photograph."
  },
  "choices": [
    { "label": { "fr": "Un coup d'éclat, quitte à tout risquer", "en": "A dramatic gesture, whatever the risk" },
      "roll": { "stat": "charisme", "base": 14, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 18, "standing": -5 },
        "result": { "fr": "Vous annoncez quelque chose que personne n'attendait de vous, un lundi matin, sans prévenir votre propre équipe. On reparle de vous le soir même, et cette fois pour ce que vous dites.",
                    "en": "You announce something nobody expected from you, on a Monday morning, without warning your own staff. People are talking about you again by the evening, and this time about what you said." } },
      "failure": { "effects": { "notoriete": 1, "popularity": -8, "standing": -10, "reputation": -1 },
        "result": { "fr": "Trois rédactions envoient un stagiaire, aucune ne le passe au journal, et un éditorialiste écrit le mot désespoir. Un coup d'éclat qui rate ne vous ramène pas au point de départ, il vous met en dessous.",
                    "en": "Three newsrooms send an intern, none of them runs it, and a commentator uses the word desperation. A dramatic gesture that fails does not put you back where you started, it puts you below it." } } },
    { "label": { "fr": "Se faire oublier et travailler", "en": "Go quiet and work" },
      "effects": { "energie": 1, "sangfroid": 1, "standing": 8, "popularity": -3 },
      "result": { "fr": "Six mois sans une déclaration, deux rapports rendus dans les délais et quarante réunions de circonscription. Personne ne vous en félicitera, et c'est la seule chose qui n'a jamais raté personne.",
                  "en": "Six months without a statement, two reports delivered on time and forty constituency meetings. Nobody will congratulate you for it, and it is the only thing that has never failed anybody." } },
    { "label": { "fr": "Changer toute votre communication", "en": "Change your entire communications team" },
      "when": { "minMoney": 80000 },
      "effects": { "money": -60000, "popularity": 6, "notoriete": 1, "reseau": -1, "standing": -2 },
      "result": { "fr": "Nouveau logo, nouvelle police, nouvelles lunettes. Les sondages remontent un peu, ce qui est vexant.",
                  "en": "New logo, new typeface, new glasses. The polls tick up a little, which is humiliating." } }
  ]
},


{
  "id": "favori",
  "when": { "minPopularity": 74 },
  "tag": { "fr": "Favori", "en": "The favourite" },
  "text": {
    "fr": "Tous les instituts vous donnent gagnant, deux magazines préparent une couverture et l'on commence à écrire votre nom sans votre fonction devant. C'est très exactement le moment où le pays se met à chercher ce qui cloche chez vous, et il trouve toujours.",
    "en": "Every polling firm has you winning, two magazines are preparing covers, and people are starting to write your name without your title in front of it. This is precisely the moment when the country starts looking for what is wrong with you, and it always finds something."
  },
  "choices": [
    { "label": { "fr": "Rester humble en public", "en": "Stay humble in public" },
      "effects": { "reputation": 1, "sangfroid": 1, "popularity": 3, "standing": -4 },
      "result": { "fr": "« Rien n'est joué, et je me méfie des sondages. » Vous le dites quatorze fois en trois semaines avec le même air soucieux. La formule est fausse, tout le monde le sait, et l'abandonner coûterait beaucoup plus cher que de la répéter.",
                  "en": "“Nothing is decided, and I distrust polls.” You say it fourteen times in three weeks with the same worried expression. The line is false, everybody knows it, and dropping it would cost far more than repeating it." } },
    { "label": { "fr": "Occuper le terrain comme un vainqueur", "en": "Act like the winner" },
      "effects": { "notoriete": 1, "popularity": -8, "standing": 8 },
      "result": { "fr": "Vous parlez au futur de l'indicatif pendant un mois entier. L'appareil trouve cela rassurant, les électeurs trouvent cela déjà vu, et les deux ont l'expérience pour eux.",
                  "en": "You spend a month speaking in the future tense. The machine finds it reassuring, the voters find it familiar, and both have experience on their side." } },
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
    "fr": "La déclaration de patrimoine est publiée, comme la loi l'exige, et un compte la met en ligne sous forme d'image avec le total en gros caractères. Le chiffre est exact, il est légal, et il circule vingt fois plus vite que n'importe laquelle de vos idées.",
    "en": "The declaration of assets is published, as the law requires, and an account puts it online as an image with the total in large type. The figure is accurate, it is lawful, and it travels twenty times faster than any of your ideas."
  },
  "choices": [
    { "label": { "fr": "Assumer votre réussite", "en": "Own your success" },
      "effects": { "sangfroid": 1, "standing": 8, "popularity": -9 },
      "result": { "fr": "« Je n'ai pas à m'excuser d'avoir réussi. » La phrase est juridiquement irréprochable, moralement défendable, et elle est reprise seule, sans le reste de la réponse, par tout le monde et pour longtemps.",
                  "en": "“I will not apologise for having done well.” The sentence is legally impeccable, morally defensible, and it is quoted on its own, without the rest of the answer, by everybody and for a long time." } },
    { "label": { "fr": "Reverser une part à une fondation", "en": "Give a share to a foundation" },
      "effects": { "money": -350000, "reputation": 2, "popularity": 12, "standing": -5 },
      "result": { "fr": "La fondation existe depuis deux ans, elle finance des internats, et le virement est réel. Les uns trouvent le geste sincère, les autres le trouvent calculé, et les deux ont raison, ce qui n'empêche pas les internats d'exister.",
                  "en": "The foundation has existed for two years, it funds boarding places, and the transfer is real. Some find the gesture sincere, others find it calculated, and both are right, which does not stop the boarding places from existing." } },
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
    "fr": "Le compte de campagne est à sec à onze semaines du scrutin, la banque a refusé le découvert par courrier type, et votre mandataire financier vous demande, très poliment, comment on paie l'imprimeur vendredi.",
    "en": "The campaign account is empty eleven weeks out, the bank has refused an overdraft in a form letter, and your finance agent is asking you, very politely, how the printer gets paid on Friday."
  },
  "choices": [
    { "label": { "fr": "Emprunter à un proche fortuné", "en": "Borrow from a wealthy friend" },
      "effects": { "money": 120000, "standing": 2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Un virement le mardi, une poignée de main le jeudi, aucun écrit nulle part. Le prêt est amical, sans intérêt et sans échéance, ce qui est exactement le problème : une dette sans date ne se rembourse jamais en argent.",
                  "en": "A transfer on the Tuesday, a handshake on the Thursday, nothing in writing anywhere. The loan is friendly, interest-free and open-ended, which is exactly the problem: a debt with no date is never repaid in money." } },
    { "label": { "fr": "Faire campagne sans un sou", "en": "Campaign without a penny" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "energie": -2, "reputation": 2, "popularity": 6, "standing": -4 },
      "result": { "fr": "Tracts photocopiés au format brouillon, salles municipales prêtées et une voiture personnelle qui fait quatre mille kilomètres en six semaines. On vous trouve authentique, ce qui est le mot que le pays emploie pour dire fauché.",
                  "en": "Leaflets photocopied in draft mode, borrowed municipal halls and a private car that does four thousand kilometres in six weeks. People find you authentic, which is the word the country uses for broke." } },
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
    "fr": "Fin de meeting, micro baladeur, et un homme d'une soixantaine d'années vous dit que vous n'avez jamais travaillé de vos mains et que cela s'entend dans tout ce que vous dites. Il n'est ni agressif ni militant, ce qui est le pire des cas, et la salle attend.",
    "en": "The end of the rally, a roving microphone, and a man in his sixties tells you that you have never worked with your hands and that it can be heard in everything you say. He is neither aggressive nor an activist, which is the worst case, and the room waits."
  },
  "choices": [
    { "label": { "fr": "Reconnaître le privilège", "en": "Acknowledge the privilege" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "reputation": 2, "popularity": 12 },
        "result": { "fr": "« Vous avez raison, et je ne vais pas vous raconter le contraire. » Vous ne rattrapez rien derrière, ce qui est le plus difficile. Le silence dure trois secondes, les applaudissements viennent du fond de la salle, et la séquence fait le tour du pays sans montage.",
                    "en": "“You are right, and I am not going to pretend otherwise.” You add nothing to soften it, which is the hard part. The silence lasts three seconds, the applause starts at the back of the hall, and the clip goes round the country unedited." } },
      "failure": { "effects": { "popularity": -8, "reputation": -1 },
        "result": { "fr": "Vous dites que vous avez conscience de votre chance, avec la voix qu'on prend pour dire ce genre de chose. Il répond que ce n'est pas la question, et il a raison, et tout le monde dans la salle le voit.",
                    "en": "You say you are aware of your good fortune, in the voice people use for saying that sort of thing. He answers that this is not the question, and he is right, and everyone in the hall can see it." } } },
    { "label": { "fr": "Défendre votre parcours", "en": "Defend your record" },
      "effects": { "eloquence": 1, "standing": 9, "popularity": -7 },
      "result": { "fr": "Vous listez vos stages, vos mandats et les deux étés passés en usine il y a trente ans. C'est vrai, c'est vérifiable, et personne dans la salle n'avait posé cette question.",
                  "en": "You list your internships, your mandates and the two summers you spent in a factory thirty years ago. It is true, it is checkable, and nobody in the hall had asked that question." } },
    { "label": { "fr": "Passer la soirée au bar avec lui", "en": "Spend the evening at the bar with him" },
      "effects": { "popularity": 3, "energie": -2, "charisme": 1, "standing": -3 },
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
    "fr": "Une crise éclate dans le domaine où vous avez passé quinze ans avant la politique. Sur le plateau, vous êtes le seul à savoir de quoi il s'agit, et le seul à savoir aussi que l'explication honnête prend huit minutes alors que le format en accorde deux.",
    "en": "A crisis erupts in the field where you spent fifteen years before politics. On the panel you are the only one who knows what it is about, and also the only one who knows that the honest explanation takes eight minutes when the format allows two."
  },
  "choices": [
    { "label": { "fr": "Expliquer sérieusement", "en": "Explain it properly" },
      "effects": { "credibilite": +2, "eloquence": 1, "reputation": 2, "popularity": 9, "standing": 6, "energie": -1 },
      "result": { "fr": "Vous prenez les huit minutes, sans schéma et sans mépris, et le présentateur vous laisse aller au bout parce qu'il n'a rien de mieux. La séquence tourne pendant des jours, partagée par des gens qui commencent leur message par « enfin quelqu'un qui explique ».",
                  "en": "You take the eight minutes, with no diagram and no condescension, and the presenter lets you finish because he has nothing better. The clip circulates for days, shared by people whose message begins “at last, somebody who explains”." } },
    { "label": { "fr": "Simplifier à l'extrême", "en": "Simplify brutally" },
      "effects": { "credibilite": -1, "notoriete": 2, "reputation": -1, "popularity": 5 },
      "result": { "fr": "Vous réduisez quinze ans de métier à une comparaison de neuf mots avec une baignoire. Elle est reprise partout, y compris par des gens qui la citent à l'envers, et vous ne pourrez plus jamais la nuancer.",
                  "en": "You reduce fifteen years of expertise to a nine-word comparison involving a bathtub. It is quoted everywhere, including backwards, and you will never be able to qualify it again." } },
    { "label": { "fr": "Publier une note technique détaillée", "en": "Publish a detailed technical note" },
      "when": { "background": ["academia", "civil"] },
      "effects": { "credibilite": +3, "eloquence": 1, "reputation": 2, "standing": 8, "popularity": -3 },
      "result": { "fr": "Quinze pages, onze notes de bas de page et deux graphiques. Le document devient la référence de tout le monde en quarante-huit heures, cité par des journalistes qui en ont lu le résumé et par deux ministères qui n'en citeront pas la source.",
                  "en": "Fifteen pages, eleven footnotes and two charts. Within forty-eight hours it is everybody's reference, quoted by journalists who have read the summary and by two ministries that will not credit it." } },
    { "label": { "fr": "Proposer votre expertise au gouvernement", "en": "Offer your expertise to the government" },
      "when": { "personality": ["clever"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": +2, "reseau": 2, "reputation": 2, "standing": 9, "popularity": 5 },
        "result": { "fr": "Un conseiller vous rappelle à vingt-trois heures et vous êtes en réunion le lendemain à sept heures, sans que rien ne sorte dans la presse. Vous êtes devenu celui qu'on appelle quand c'est grave, ce qui est une position bien plus solide qu'un maroquin.",
                    "en": "An adviser calls you back at eleven at night and you are in a meeting at seven the next morning, with nothing in the press. You have become the person they call when it is serious, which is a far stronger position than a ministry." } },
      "failure": { "effects": { "credibilite": -1, "standing": -7, "popularity": -3 },
        "result": { "fr": "Le cabinet répond en quatre lignes qu'il dispose des compétences nécessaires en interne. Votre propre camp, lui, apprend que vous avez proposé vos services à ceux qu'il combat, et cela circule plus vite que la réponse.",
                    "en": "The minister's office replies in four lines that it has the necessary expertise in house. Your own side, meanwhile, learns that you offered your services to the people it is fighting, and that travels faster than the reply." } } }
  ]
},


{
  "id": "provocation_naturelle",
  "weight": 5,
  "when": { "personality": ["provocative"] },
  "tag": { "fr": "Tempérament", "en": "Temperament" },
  "text": {
    "fr": "Sortie de séance, huit micros tendus, une décision du gouvernement que personne ne défend et une question ouverte comme une porte de grange. La phrase est déjà formée dans votre tête, vous savez exactement ce qu'elle coûtera, et vous savez aussi qu'elle passera au journal de vingt heures.",
    "en": "Coming out of the chamber, eight microphones held up, a government decision nobody is defending and a question as wide open as a barn door. The sentence is already formed in your head, you know exactly what it will cost, and you also know it will lead the evening news."
  },
  "choices": [
    { "label": { "fr": "Lâcher la phrase qui fâche", "en": "Say the line that will hurt" },
      "effects": { "axis": "self", "notoriete": 3, "reputation": -2, "popularity": 14, "standing": -9 },
      "result": { "fr": "Trois jours de polémique, quatre plateaux et une tribune signée par onze personnes qui demandent votre exclusion. Votre nom est dans toutes les bouches, y compris celles qui ne le prononçaient jamais, et c'est très exactement ce que vous étiez venu chercher.",
                  "en": "Three days of outrage, four studio appearances and an open letter signed by eleven people demanding your expulsion. Your name is in every mouth, including the ones that never said it, and that is precisely what you came for." } },
    { "label": { "fr": "Vous retenir, pour une fois", "en": "Hold back, for once" },
      "effects": { "sangfroid": 2, "standing": 8, "popularity": -4, "reputation": 1 },
      "result": { "fr": "Vous répondez trois phrases plates et vous montez en voiture. Votre attachée de presse vous regarde comme si vous étiez malade, et vous mettez deux jours à comprendre que vous n'avez rien perdu du tout.",
                  "en": "You give three flat sentences and get into the car. Your press officer looks at you as though you were ill, and it takes you two days to realise you have lost nothing at all." } },
    { "label": { "fr": "Lâcher la phrase, puis s'excuser à moitié", "en": "Say it, then half-apologise" },
      "effects": { "notoriete": 2, "popularity": 5, "standing": -3, "reputation": -1, "strike": "menteur" },
      "result": { "fr": "Vous regrettez « la forme, pas le fond ». Les deux camps y trouvent leur compte, ce qui est le but.",
                  "en": "You regret “the wording, not the substance”. Both sides get what they want, which is the point." } }
  ]
},


{
  "id": "usure_pouvoir",
  "when": { "position": ["chef"], "minTurn": 48 },
  "tag": { "fr": "Usure", "en": "Wear and tear" },
  "text": {
    "fr": "Douze ans à la tête de la maison. Le bureau politique du mardi se tient dans la même salle avec les mêmes onze personnes, et vous avez commencé à reconnaître vos propres formules dans la bouche de gens qui croient les inventer.",
    "en": "Twelve years at the head of the house. Tuesday's executive meets in the same room with the same eleven people, and you have started to recognise your own phrases in the mouths of people who think they are coining them."
  },
  "choices": [
    { "label": { "fr": "Renouveler tout l'état-major", "en": "Replace the entire leadership team" },
      "roll": { "chance": 0.55 },
      "success": { "effects": { "reseau": 1, "energie": 1, "standing": 10, "appeal": { "self": 5 } },
        "result": { "fr": "Quatre départs annoncés le même matin, avec des remerciements sincères, et quatre arrivées dont trois ont moins de quarante ans. On reparle de la maison au présent, et personne ne dit tout haut que c'est vous qui aviez le plus besoin de ce renouvellement.",
                    "en": "Four departures announced the same morning, with sincere thanks, and four arrivals, three of them under forty. People talk about the house in the present tense again, and nobody says out loud that you were the one who most needed the renewal." } },
      "failure": { "effects": { "reseau": -2, "standing": -16, "popularity": -5 },
        "result": { "fr": "Les quatre évincés déjeunent ensemble le jeudi suivant, ce qu'ils n'avaient pas fait depuis dix ans. Ils ne partent pas, ils ne démentent rien, et une motion circule avant l'été.",
                    "en": "The four who were pushed out have lunch together the following Thursday, something they had not done in ten years. They do not leave, they deny nothing, and a motion is circulating before the summer." } } },
    { "label": { "fr": "Ne rien changer", "en": "Change nothing" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "standing": 7, "popularity": -4, "energie": -1 },
      "result": { "fr": "Le bureau du mardi dure une heure dix, les décisions sont prises, les comptes rendus sont exacts. La maison tourne parfaitement et elle ne produit plus une idée depuis trois ans, ce que personne autour de la table n'a intérêt à remarquer.",
                  "en": "Tuesday's executive lasts an hour and ten minutes, decisions are taken, the minutes are accurate. The house runs perfectly and has not produced an idea in three years, which nobody around the table has any interest in noticing." } },
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
    "fr": "Un institut vous inclut pour la première fois dans son baromètre, en douzième position sur quinze. Le chiffre est meilleur que ce que la maison croyait, il ne veut à peu près rien dire, et il va être lu par onze personnes dont trois décident des investitures.",
    "en": "A polling firm includes you in its tracker for the first time, twelfth out of fifteen. The figure is better than the party thought, it means almost nothing, and it will be read by eleven people, three of whom decide nominations."
  },
  "choices": [
    { "label": { "fr": "Faire circuler le chiffre", "en": "Circulate the number" },
      "effects": { "notoriete": 1, "reseau": 1, "popularity": 3, "standing": -4, "reputation": -1 },
      "result": { "fr": "Vous l'envoyez à quatre personnes en leur demandant de ne pas le diffuser, ce qui est la façon la plus sûre de le diffuser. En dix jours, deux journalistes vous appellent pour un portrait.",
                  "en": "You send it to four people asking them not to pass it on, which is the surest way of passing it on. Within ten days two journalists call about a profile." } },
    { "label": { "fr": "Ne rien commenter", "en": "Say nothing" },
      "effects": { "sangfroid": 1, "standing": 6, "notoriete": -1, "popularity": -3 },
      "result": { "fr": "Vous ne le montrez à personne et vous ne le citez pas une fois. Personne au siège n'apprendra qu'il a existé, ce qui est une décision d'une pureté totale et d'une efficacité nulle.",
                  "en": "You show it to nobody and never quote it once. Nobody at head office will ever learn that it existed, which is a decision of complete purity and no effect whatsoever." } },
    { "label": { "fr": "Faire fuiter un sondage encore meilleur", "en": "Leak an even better poll" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "popularity": 3, "standing": 6 },
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
    "fr": "Un grand quotidien vous offre six mille signes en avant-dernière page, sujet libre, à rendre pour jeudi midi. C'est la place qu'on donne à ceux dont on n'attend rien, et c'est la seule tribune qu'on vous ait proposée cette année.",
    "en": "A national paper offers you six thousand characters on the second-to-last page, any subject, due Thursday noon. It is the slot given to people nothing is expected from, and it is the only op-ed anybody has offered you this year."
  },
  "choices": [
    { "label": { "fr": "Écrire un texte clivant", "en": "Write something divisive" },
      "roll": { "stat": "eloquence", "base": 14, "dice": 16 },
      "success": { "effects": { "axis": "self", "landscape": { "self": -0.8 }, "notoriete": 2, "reseau": -1, "popularity": 10, "standing": -8 },
        "result": { "fr": "Le texte est repris par deux radios avant midi et vaut à son auteur douze appels dont trois de son propre camp, tous mécontents. On vous lit, on vous cite, et l'on ne vous mettra plus jamais en avant-dernière page.",
                    "en": "The piece is picked up by two radio stations before noon and earns its author twelve phone calls, three from his own side, all unhappy. You are read, you are quoted, and you will never be put on the second-to-last page again." } },
      "failure": { "effects": { "notoriete": -1, "popularity": -4, "standing": -4 },
        "result": { "fr": "Le texte paraît le samedi d'un pont de mai. Aucune reprise, aucun appel, et le service abonnements vous adresse un message automatique pour vous remercier de votre contribution.",
                    "en": "The piece runs on the Saturday of a bank holiday weekend. No pickup, no calls, and the subscriptions department sends you an automated message thanking you for your contribution." } } },
    { "label": { "fr": "Rester consensuel", "en": "Play it safe" },
      "effects": { "reputation": 1, "standing": 5, "notoriete": -1, "popularity": -3 },
      "result": { "fr": "Six mille signes sur le lien entre la République et ses territoires, relus par deux personnes du siège qui ont retiré l'adjectif du troisième paragraphe. Personne ne s'en souviendra, et c'était le but recherché par les deux relecteurs.",
                  "en": "Six thousand characters on the bond between the Republic and its regions, checked by two people at head office who removed the adjective in the third paragraph. Nobody will remember it, which is what both readers were aiming for." } },
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
    "fr": "Le texte passe jeudi, votre groupe le soutient, et il ferme un service dont vivent trois cents familles chez vous. La consigne de vote est arrivée par message à sept heures du matin, avec le mot cohésion dedans, et le vote sera public et nominatif.",
    "en": "The bill comes up on Thursday, your group backs it, and it closes a service that three hundred families in your seat depend on. The whip arrived by message at seven in the morning, with the word cohesion in it, and the vote will be public and recorded."
  },
  "choices": [
    { "label": { "fr": "Voter avec le groupe", "en": "Vote with the group" },
      "effects": { "reseau": 1, "reputation": -1, "appeal": { "self": -11 }, "standing": 15 },
      "result": { "fr": "Vous levez la main avec les autres et votre nom figure dans le compte rendu, en ligne, consultable pour toujours. L'appareil s'en souviendra pendant deux ans et votre circonscription pendant six.",
                  "en": "You raise your hand with the rest and your name appears in the record, online, searchable for ever. The machine will remember for two years and your constituency for six." } },
    { "label": { "fr": "Voter contre, en conscience", "en": "Vote your conscience" },
      "effects": { "reputation": 2, "reseau": -2, "popularity": 12, "standing": -18, "appeal": { "self": -7 } },
      "result": { "fr": "Vous votez contre, seul de votre groupe, et le président de séance annonce le résultat sans commenter. On vous appelle dissident à Paris et par votre prénom sur le marché du dimanche, et l'un des deux ne se monnaie nulle part.",
                  "en": "You vote against, alone in your group, and the chair announces the result without comment. In Paris you are called a rebel, at Sunday's market you are called by your first name, and only one of the two can be cashed in anywhere." } },
    { "label": { "fr": "Faire changer la consigne de vote", "en": "Get the whip changed" },
      "when": { "position": ["chef"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05, "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "popularity": 3, "standing": 12 },
        "result": { "fr": "Le groupe recule. Vous n'avez rien renié et vous avez tenu la maison.",
                    "en": "The group backs down. You gave up nothing and you held the house." } },
      "failure": { "effects": { "standing": -13, "reputation": -1 },
        "result": { "fr": "Le groupe vous désavoue. Diriger sans être suivi, c'est le début de la fin.",
                    "en": "The group overrules you. Leading without being followed is the beginning of the end." } } },
    { "label": { "fr": "Voter contre et l'expliquer au groupe", "en": "Vote against and explain it to the group" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "eloquence": 1, "popularity": 12, "standing": -10 },
      "result": { "fr": "Une heure devant le groupe, sans notes, à expliquer ce que ferme ce texte et devant qui vous vous êtes engagé. Trois collègues votent avec vous, les autres vous disent en sortant qu'ils auraient aimé pouvoir, ce qui est la phrase la plus honnête et la plus lâche de la maison.",
                  "en": "An hour in front of the group, without notes, explaining what the bill closes and to whom you gave your word. Three colleagues vote with you, the others tell you on the way out that they wish they could have, which is the most honest and the most cowardly sentence in the building." } }
  ]
},


{
  "id": "livre",
  "when": { "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Notoriété", "en": "Profile" },
  "text": {
    "fr": "Un grand éditeur vous propose un livre pour la rentrée de janvier. Il vous montre la maquette avant le sommaire : votre nom en gros caractères, votre photo en noir et blanc, et un titre en trois mots dont deux sont République et avenir.",
    "en": "A major publisher offers you a book for the January season. He shows you the cover before the contents: your name in large type, your photograph in black and white, and a three-word title, two of the words being Republic and future."
  },
  "choices": [
    { "label": { "fr": "Écrire le livre", "en": "Write the book" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "money": 40000, "notoriete": 1, "energie": -2, "popularity": 8, "standing": 3 },
      "result": { "fr": "Quatre mois de nuits et de week-ends pour onze mille exemplaires, ce qui est correct et ne rembourse pas les nuits. Le livre traîne sur les bonnes tables basses et deux journalistes le citent en ayant lu la quatrième de couverture.",
                  "en": "Four months of nights and weekends for eleven thousand copies, which is respectable and does not pay for the nights. The book sits on the right coffee tables and two journalists quote it having read the back cover." } },
    { "label": { "fr": "Pas le temps", "en": "No time" },
      "effects": { "energie": 1, "popularity": -3 },
      "result": { "fr": "Vous répondez que vous écrirez quand vous aurez quelque chose à dire, ce que l'éditeur note poliment comme un refus. Tout le monde dans ce métier finit par écrire son livre, et c'est presque toujours après une défaite.",
                  "en": "You answer that you will write when you have something to say, which the publisher politely notes down as a refusal. Everyone in this trade writes their book in the end, and it is nearly always after a defeat." } },
    { "label": { "fr": "Écrire un vrai essai", "en": "Write a serious essay" },
      "when": { "background": ["academia", "journalism"] },
      "effects": { "money": 20000, "eloquence": 1, "reputation": 2, "energie": -1, "popularity": 5, "standing": 6 },
      "result": { "fr": "Trois cents pages, quarante pages de notes et pas une anecdote sur vous. Il se vend quatre mille exemplaires, il est cité dans deux thèses et par un ministre en exercice, et l'éditeur ne vous en redemandera pas.",
                  "en": "Three hundred pages, forty pages of notes and not one anecdote about yourself. It sells four thousand copies, it is cited in two doctoral theses and by a serving minister, and the publisher will not ask you for another." } },
    { "label": { "fr": "Le faire écrire par quelqu'un d'autre", "en": "Have someone else write it" },
      "when": { "minMoney": 100000 },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.15 } ] },
      "success": { "effects": { "money": 55000, "notoriete": 2, "popularity": 7 },
        "result": { "fr": "Six entretiens de deux heures, un manuscrit rendu en dix semaines, et un texte qui vous ressemble plus que ce que vous auriez écrit vous-même. Personne ne saura jamais par qui, et c'est bien pour cela que ce métier existe.",
                    "en": "Six two-hour interviews, a manuscript delivered in ten weeks, and a text that sounds more like you than anything you would have written yourself. Nobody will ever know by whom, which is precisely why the job exists." } },
      "failure": { "effects": { "reputation": -3, "popularity": -9, "standing": -6 },
        "result": { "fr": "La prête-plume raconte tout dans un entretien de quatre pages, avec les dates des six rendez-vous et la phrase que vous lui avez dite sur vos propres électeurs. L'humiliation dure une semaine et le livre continue de se vendre.",
                    "en": "The ghostwriter tells the whole story in a four-page interview, with the dates of the six meetings and the sentence you said to her about your own voters. The humiliation lasts a week and the book keeps selling." } } }
  ]
},


{
  "id": "crise_locale",
  "when": { "position": ["maire", "conseiller"] },
  "tag": { "fr": "Terrain", "en": "On the ground" },
  "text": {
    "fr": "Cent dix millimètres en quatre heures. Quarante familles dorment au gymnase, la route départementale est coupée en deux endroits, et la première équipe de télévision est arrivée avant les pompiers du département voisin.",
    "en": "A hundred and ten millimetres in four hours. Forty families are sleeping in the sports hall, the main road is cut in two places, and the first television crew arrived before the fire service from the next department."
  },
  "choices": [
    { "label": { "fr": "Passer trois nuits sur le terrain", "en": "Spend three nights on the ground" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reputation": 2, "notoriete": 1, "energie": -2, "popularity": 16, "standing": 2 },
      "result": { "fr": "Trois nuits au gymnase, des lits de camp portés à deux et des cafés servis à quatre heures du matin. Personne ne l'a filmé et tout le monde l'a vu, ce qui est la seule forme de communication qui ne se retourne jamais contre personne.",
                  "en": "Three nights in the sports hall, camp beds carried two at a time and coffee served at four in the morning. Nobody filmed it and everybody saw it, which is the only kind of communication that never turns against anyone." } },
    { "label": { "fr": "Coordonner depuis la mairie", "en": "Coordinate from the town hall" },
      "effects": { "sangfroid": 1, "reputation": -1, "popularity": -7, "standing": 5 },
      "result": { "fr": "Cellule de crise, tableau blanc, quatre services coordonnés et pas une famille oubliée. Une photo de la salle des fêtes prise depuis le fond, sans vous dedans, circule le lendemain avec la légende « où était le maire ».",
                  "en": "A crisis unit, a whiteboard, four services coordinated and not one family forgotten. A photograph of the hall taken from the back, without you in it, does the rounds the next day captioned “where was the mayor”." } },
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
    "fr": "Trois messages en dix jours, avec votre adresse, les horaires de l'école de vos enfants et une photo de votre portail prise de la rue. Le service compétent qualifie la menace de crédible et propose une protection permanente, très visible, à compter de lundi.",
    "en": "Three messages in ten days, with your address, your children's school hours and a photograph of your gate taken from the street. The relevant service rates the threat credible and offers permanent, highly visible protection from Monday."
  },
  "choices": [
    { "label": { "fr": "Accepter la protection", "en": "Accept the protection" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "sangfroid": 1, "energie": -1, "popularity": 5, "standing": 6 },
      "result": { "fr": "Deux voitures, quatre agents en rotation et un itinéraire communiqué la veille. Vous ne prenez plus un café sans que quelqu'un regarde la salle avant vous, et vos enfants apprennent à dire bonjour à des gens dont ils ne connaissent pas le nom.",
                  "en": "Two cars, four officers on rotation and a route notified the day before. You no longer have a coffee without somebody checking the room first, and your children learn to say hello to people whose names they do not know." } },
    { "label": { "fr": "Refuser et continuer normalement", "en": "Refuse and carry on" },
      "effects": { "strike": "intrepide", "reputation": 1, "notoriete": 1, "popularity": 7, "sangfroid": -2, "energie": -1 },
      "result": { "fr": "Vous répondez qu'on ne fait pas de politique derrière une vitre blindée, et la phrase est reprise partout, parce qu'elle est bonne. Chez vous, on se lève désormais deux fois par nuit pour vérifier le portail.",
                  "en": "You answer that you cannot do politics from behind armoured glass, and the line is quoted everywhere, because it is a good one. At home, somebody now gets up twice a night to check the gate." } },
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
},


/* ==========================================================================
   13. TEMPS MORTS
   ==========================================================================
   Ils peuvent revenir plusieurs fois dans une partie ("repeatable"), ils ne
   sortent jamais au tirage ordinaire ("weight": 0), et ce sont les seuls que
   le moteur joue quand il n'a plus rien de neuf à proposer ("quiet"). Cette
   troisième marque a l'air redondante et ne l'est pas : une suite d'affaire
   peut elle aussi être répétable et de poids nul, et sans "quiet" elle
   tombait dans le repli — une carrière longue voyait alors revenir une carte
   de comptes de campagne tous les cinq tours, sans campagne derrière elle. Une politique, ce sont aussi des
   semestres où il ne se passe rien, et où il faut quand même choisir quoi
   faire de son temps.
   ========================================================================== */

{
  "id": "semestre_calme",
  "weight": 0,
  "repeatable": true,
  "quiet": true,
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
  "quiet": true,
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
      "result": { "fr": "Vos deux collaborateurs répondent mieux et plus vite que vous ne l'auriez fait. Les lettres repartent signées de votre nom, et la dame du deuxième étage explique à tout l'immeuble qu'elle ne vous a jamais vu.",
                  "en": "Your two staffers answer better and faster than you would have. The letters go back out with your name at the bottom, and the woman on the second floor tells the whole building that she has never once seen you." } }
  ]
},


{
  "id": "inauguration",
  "weight": 0,
  "repeatable": true,
  "quiet": true,
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
  "quiet": true,
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
}
];
