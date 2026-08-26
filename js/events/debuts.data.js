/* Généré — ne pas éditer à la main. */
const EV_debuts = [


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
      "effects": { "axis": {"economy": -55}, "landscape": { "self": 0.7 }, "reseau": 1, "notoriete": 1, "energie": -2, "popularity": 12, "standing": 4 },
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
      "success": { "effects": { "axis": {"economy": -55, "power": -35}, "notoriete": 2, "reputation": 2, "popularity": 14 },
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
      "effects": { "axis": {"economy": -40, "social": -30}, "landscape": { "self": 0.6 }, "energie": -2, "reputation": 1, "popularity": 8, "standing": 3, "trait": "bosseur" },
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
  "when": { "position": ["militant", "cadre", "conseiller"], "maxTurn": 24 },
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
  "when": { "position": ["militant", "cadre", "conseiller"], "maxTurn": 32 },
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
  "when": { "position": ["militant", "cadre", "conseiller", "maire"], "maxTurn": 48 },
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
  "when": { "position": ["militant", "cadre", "conseiller"], "maxTurn": 40 },
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
      "effects": { "axis": {"economy": -70}, "notoriete": 2, "popularity": 7, "energie": -1, "standing": -3 },
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
}
];
