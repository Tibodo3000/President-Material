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
  "when": { "minPopularity": 74 },
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
      "effects": { "axis": "self", "notoriete": 3, "reputation": -2, "popularity": 14, "standing": -9 },
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
  "when": { "position": ["chef"], "minTurn": 48 },
  "tag": { "fr": "Usure", "en": "Wear and tear" },
  "text": {
    "fr": "Vous dirigez le parti depuis longtemps. Les mêmes réunions, les mêmes visages, les mêmes phrases.",
    "en": "You have led the party for a long time. The same meetings, the same faces, the same sentences."
  },
  "choices": [
    { "label": { "fr": "Renouveler tout l'état-major", "en": "Replace the entire leadership team" },
      "roll": { "chance": 0.55 },
      "success": { "effects": { "reseau": 1, "energie": 1, "standing": 10, "appeal": { "self": 5 } },
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
      "effects": { "notoriete": 1, "reseau": 1, "popularity": 3, "standing": -4, "reputation": -1 },
      "result": { "fr": "Le chiffre arrive aux bonnes oreilles. On commence à parler de vous.",
                  "en": "The number reaches the right ears. People are starting to talk." } },
    { "label": { "fr": "Ne rien commenter", "en": "Say nothing" },
      "effects": { "sangfroid": 1, "standing": 6, "notoriete": -1, "popularity": -3 },
      "result": { "fr": "Les sondages passent. Vous préférez qu'on vous juge sur la durée.",
                  "en": "Polls come and go. You would rather be judged over time." } },
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
    "fr": "Un grand quotidien vous offre une tribune. Le sujet est libre, la place est en dernière page.",
    "en": "A national paper offers you an op-ed. Any subject, back page."
  },
  "choices": [
    { "label": { "fr": "Écrire un texte clivant", "en": "Write something divisive" },
      "roll": { "stat": "eloquence", "base": 14, "dice": 16 },
      "success": { "effects": { "axis": "self", "landscape": { "self": -0.8 }, "notoriete": 2, "reseau": -1, "popularity": 10, "standing": -8 },
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
      "effects": { "reseau": 1, "reputation": -1, "appeal": { "self": -11 }, "standing": 15 },
      "result": { "fr": "L'appareil s'en souviendra. Vos électeurs aussi.",
                  "en": "The machine will remember. So will your voters." } },
    { "label": { "fr": "Voter contre, en conscience", "en": "Vote your conscience" },
      "effects": { "reputation": 2, "reseau": -2, "popularity": 12, "standing": -18, "appeal": { "self": -7 } },
      "result": { "fr": "On vous traite de dissident. Sur les marchés, on vous serre la main.",
                  "en": "They call you a rebel. At the market, people shake your hand." } },
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
      "result": { "fr": "Vos collaborateurs s'en sortent bien. Les gens remarquent que ce n'était pas vous.",
                  "en": "Your staff handle it well. People notice it was not you." } }
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
