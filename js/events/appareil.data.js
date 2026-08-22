/* Généré — ne pas éditer à la main. */
const EV_appareil = [


/* ==========================================================================
   4. LE PARTI ET L'APPAREIL
   ========================================================================== */

{
  "id": "mentor",
  "once": true,
  "when": { "position": ["militant", "cadre", "conseiller"] },
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
      "effects": { "reseau": 2, "standing": 12, "sangfroid": 1, "reputation": -2, "popularity": -6, "chain": "mentor_dette" },
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
      "effects": { "standing": 9, "reputation": -2, "popularity": -9, "strike": "appareil", "chain": "mentor_encombrant" },
      "result": { "fr": "Le fils est investi. Tout le monde a compris, personne n'a rien dit.",
                  "en": "The son is nominated. Everyone understood; nobody said a word." } },
    { "label": { "fr": "Refuser et rompre", "en": "Refuse and break with him" },
      "effects": { "landscape": { "self": -1.2 }, "strike": "intrepide", "standing": -11, "reputation": 2, "popularity": 10, "reseau": -1 },
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
      "effects": { "standing": 8, "reseau": 1, "notoriete": -1, "popularity": -4, "chain": ["protege_trahison", "ecole_du_parti"] },
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
      "success": { "effects": { "strike": "intrepide", "reseau": 1, "notoriete": 1, "standing": 9, "popularity": -2 },
        "result": { "fr": "Vous rappelez qui tient la maison. Ça calme, pour un temps.",
                    "en": "You remind everyone who runs the house. It quiets things, for a while." } },
      "failure": { "effects": { "strike": "intrepide", "reseau": -2, "standing": -17 },
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
},


/* ==========================================================================
   4 bis. LA GUERRE INTÉRIEURE
   ==========================================================================
   Un parti n'est pas un décor : c'est l'endroit où l'on passe le plus clair
   de sa carrière, et où la moitié des gens qui vous sourient préféreraient
   votre place. Ces scènes-là donnent enfin de quoi monter — ou de quoi tomber
   — sans passer par les urnes.

   La succession se joue forcément dans votre parti — on ne succède pas à
   quelqu'un d'un autre camp. La rivalité, elle, peut venir des deux côtés :
   celui qui occupe la place que vous visez n'est pas toujours assis à côté
   de vous.

   ON NE CONVOITE PAS UNE PLACE QU'ON OCCUPE DÉJÀ. Ces deux scènes-là n'avaient
   aucune condition de fonction, et elles sortaient donc pour un chef de parti :
   on lui expliquait qu'une députée de son propre camp « occupe exactement la
   place qu'il vise », alors qu'au-dessus de lui, dans son parti, il n'y a rien.
   Elles portent désormais "partyLead": false.

   Le miroir existe maintenant, et c'est le troisième de la série : une fois
   arrivé, ce n'est plus vous qui visez une place, c'est la vôtre qu'on vise.
   Une succession, en revanche, n'a pas de miroir : un chef de parti ne fait
   pas la queue pour une place vacante dans son camp, c'est lui qui l'attribue,
   et cela se joue dans "chef_investitures".
   ========================================================================== */

{
  "id": "rival_interne",
  "weight": 5,
  "cast": "camp_senior",
  "when": { "minTurn": 8, "minStanding": 25, "partyLead": false },
  "tag": { "fr": "Guerre interne", "en": "Internal war" },
  "text": {
    "fr": "{rival} occupe exactement la place que vous visez, et l'occupe bien. Trois personnes vous ont rapporté cette semaine que votre nom revenait dans ses conversations, jamais en bien.",
    "en": "{rival} holds exactly the place you are aiming at, and holds it well. Three people told you this week that your name comes up in their conversations, never kindly."
  },
  "choices": [
    { "label": { "fr": "Prendre les dossiers dont {il} ne veut pas", "en": "Take the files {he} does not want" },
      "effects": { "standing": 9, "energie": -2, "eloquence": 1, "popularity": -2 },
      "result": { "fr": "Vous récupérez trois sujets ingrats et vous les tenez mieux que personne. En dix-huit mois, c'est vous qu'on appelle quand ils sortent, et plus {lui}.",
                  "en": "You pick up three thankless briefs and hold them better than anyone. Within eighteen months you are the one they call when those come up, not {him}." } },

    { "label": { "fr": "Débaucher deux de ses fidèles", "en": "Poach two of {his} loyalists" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "charisme": 0.35, "money": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 12, "reseau": 2, "reputation": -1, "money": -20000 },
        "result": { "fr": "Ils changent de bureau un vendredi soir, sans communiqué. {Il} l'apprend le lundi, et ce jour-là vous cessez d'être un concurrent pour devenir un problème.",
                    "en": "They change offices on a Friday evening, with no announcement. {He} finds out on Monday, and that is the day you stop being a rival and become a problem." } },
      "failure": { "effects": { "standing": -10, "reputation": -2, "strike": "traitre", "money": -20000 },
        "result": { "fr": "Ils écoutent, remercient, et lui répètent tout le soir même. Vous avez montré ce que vous vouliez et prouvé que vous ne saviez pas l'obtenir.",
                    "en": "They listen, thank you, and repeat it all to {him} that evening. You showed what you wanted and proved you did not know how to get it." } } },

    { "label": { "fr": "Proposer une alliance et un partage des rôles", "en": "Offer an alliance and a division of labour" },
      "effects": { "standing": 5, "reseau": 1, "credibilite": -1, "popularity": -1 },
      "result": { "fr": "Vous vous répartissez les sujets autour d'un déjeuner de deux heures. L'accord tiendra jusqu'au jour où l'un des deux pourra s'en passer, et vous savez tous les deux lequel.",
                  "en": "You carve up the subjects over a two-hour lunch. The deal will hold until one of you can do without it, and you both know which one." } },

    { "label": { "fr": "L'attendre : {il} finira par se tromper", "en": "Wait: {he} will slip eventually" },
      "effects": { "standing": -3, "sangfroid": 2, "energie": 1 },
      "result": { "fr": "Vous ne faites rien pendant deux ans. {Il} ne se trompe pas, et vous avez appris la patience, ce qui ne se monnaie nulle part.",
                  "en": "You do nothing for two years. {He} does not slip, and you have learned patience, which is negotiable nowhere." } }
  ]
},


{
  "id": "chef_conteste",
  "weight": 5,
  "cast": "camp_senior",
  "when": { "partyLead": true, "minTurn": 12 },
  "tag": { "fr": "Guerre interne", "en": "Internal war" },
  "text": {
    "fr": "{rival} fait le tour des fédérations depuis six semaines sans jamais prononcer votre nom, ce qui est la façon la plus claire de le prononcer. Une motion circule, elle n'a pas encore de titre, et trois personnes vous ont déjà juré qu'elles ne la signeraient pas.",
    "en": "{rival} has been touring the federations for six weeks without once saying your name, which is the clearest possible way of saying it. A motion is going round, it does not have a title yet, and three people have already sworn to you that they will not sign it."
  },
  "choices": [
    { "label": { "fr": "Écraser tout de suite, avant que la motion ait un titre", "en": "Crush it now, before the motion has a title" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 10, "reseau": 2, "reputation": -2, "energie": -3 },
        "result": { "fr": "Onze coups de téléphone en deux jours et la motion ne trouve plus personne pour la porter. {Il} apprend par un tiers qu'{il} n'a plus de fédérations, et l'on ne saura jamais que vous avez eu peur.",
                    "en": "Eleven phone calls in two days and the motion can no longer find anybody to carry it. {He} learns from a third party that {he} has no federations left, and nobody will ever know you were frightened." } },
      "failure": { "effects": { "standing": -11, "reputation": -2, "popularity": -3, "energie": -3 },
        "result": { "fr": "Vous cognez trop tôt et vous désignez {celui} qu'il fallait ignorer. La motion a maintenant un titre, un porte-parole et deux cents signatures, dont quatre de gens qui vous avaient juré le contraire.",
                    "en": "You hit too early and you point out the very person you should have ignored. The motion now has a title, a spokesperson and two hundred signatures, four of them from people who had sworn otherwise." } } },

    { "label": { "fr": "{Le} faire entrer à la direction", "en": "Bring {him} into the leadership" },
      "effects": { "standing": -6, "reseau": 2, "credibilite": 1, "sangfroid": 1, "landscape": { "self": 0.6 } },
      "result": { "fr": "Numéro deux, un titre inventé pour l'occasion et un bureau au même étage que le vôtre. On n'achète jamais une loyauté, on loue un silence, et le loyer augmente tous les ans.",
                  "en": "Number two, a title invented for the occasion and an office on your own floor. You never buy loyalty, you rent silence, and the rent goes up every year." } },

    { "label": { "fr": "Convoquer un congrès extraordinaire et trancher devant les militants", "en": "Call a special congress and settle it in front of the members" },
      "when": { "minStanding": 55 },
      "roll": { "base": 15, "stat": "charisme", "plus": { "eloquence": 0.45, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 13, "credibilite": 2, "notoriete": 1, "energie": -3, "popularity": 3 },
        "result": { "fr": "Vous allez au-devant du vote au lieu de l'attendre, et vous l'emportez largement dans une salle qui n'attendait que d'être consultée. Une direction qui se fait réélire est plus forte qu'une direction qui dure.",
                    "en": "You go out to meet the vote instead of waiting for it, and you win comfortably in a hall that was only waiting to be asked. A leadership that gets itself re-elected is stronger than a leadership that merely lasts." } },
      "failure": { "effects": { "lead": false, "standing": -9, "popularity": -5, "credibilite": -2, "energie": -3 },
        "result": { "fr": "Vous avez organisé vous-même le vote qui vous emporte. La salle applaudit poliment votre discours de douze minutes, puis {rival} est annoncé{e}, et vous restez élu de votre circonscription, ce qui est tout ce qu'il vous reste.",
                    "en": "You organised the vote that removed you. The hall politely applauds your twelve-minute speech, then {rival} is announced, and you remain the member for your constituency, which is all you have left." } } },

    { "label": { "fr": "Ne rien voir, et travailler", "en": "See nothing, and get on with the work" },
      "effects": { "sangfroid": 2, "credibilite": 1, "standing": -4, "energie": 1 },
      "result": { "fr": "Vous passez six mois à ne pas répondre. La motion existe toujours, elle a cessé de grossir, et personne dans la maison ne sait plus très bien si vous êtes serein ou si vous n'avez rien vu.",
                  "en": "You spend six months not answering. The motion still exists, it has stopped growing, and nobody in the building is quite sure any more whether you are serene or simply did not notice." } }
  ]
},


{
  "id": "fede_a_prendre",
  "weight": 5,
  "when": { "minTurn": 6, "position": ["cadre", "conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Fédération", "en": "The federation" },
  "text": {
    "fr": "La fédération voisine est dirigée depuis vingt ans par un homme qui ne vient plus aux réunions. Six cents adhérents, un congrès dans huit mois, et personne n'a encore osé se déclarer."
    ,
    "en": "The neighbouring federation has been run for twenty years by a man who no longer comes to meetings. Six hundred members, a conference in eight months, and nobody has dared declare yet."
  },
  "choices": [
    { "label": { "fr": "Faire le tour des sections, une par une", "en": "Tour the branches, one at a time" },
      "effects": { "standing": 11, "reseau": 2, "energie": -3, "popularity": -2 },
      "result": { "fr": "Vingt-deux réunions en six mois, dont onze devant moins de dix personnes. Au congrès, vous passez au premier tour et personne ne comprend comment.",
                  "en": "Twenty-two meetings in six months, eleven of them in front of fewer than ten people. At the conference you win in the first round and nobody understands how." } },

    { "label": { "fr": "Négocier son retrait contre un poste honorifique", "en": "Trade his withdrawal for an honorary title" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 15 },
      "success": { "effects": { "standing": 9, "reseau": 1, "energie": -1 },
        "result": { "fr": "Président d'honneur, une photo au mur et un discours par an. Il accepte en quarante minutes, ce qui prouve qu'on aurait pu lui demander plus tôt.",
                    "en": "Honorary president, a photograph on the wall and one speech a year. He agrees in forty minutes, which proves somebody could have asked years ago." } },
      "failure": { "effects": { "standing": -7, "reputation": -1, "energie": -1 },
        "result": { "fr": "Il refuse, se déclare candidat le soir même et raconte partout qu'on a voulu l'acheter. Il n'a pas tort et cela ne l'empêchera pas de perdre dans trois ans.",
                    "en": "He refuses, declares his candidacy that evening and tells everyone he was bought off. He is not wrong, and it will not stop him losing in three years." } } },

    { "label": { "fr": "Y envoyer quelqu'un à vous", "en": "Send somebody of your own" },
      "effects": { "standing": 6, "reseau": 2, "reputation": -1, "energie": -1 },
      "result": { "fr": "Votre candidate gagne et vous devez tout à personne. Elle vous devra tout pendant quatre ans, ce qui est exactement la durée d'un mandat.",
                  "en": "Your candidate wins and you owe nobody anything. She will owe you everything for four years, which is exactly the length of a term." } },

    { "label": { "fr": "Laisser tomber : ce n'est pas votre territoire", "en": "Leave it: it is not your ground" },
      "effects": { "standing": -2, "energie": 2, "reputation": 1 },
      "result": { "fr": "Vous vous en tenez à votre fédération. C'est raisonnable, et dans deux ans quelqu'un d'autre aura six cents adhérents de plus que vous.",
                  "en": "You stick to your own federation. It is reasonable, and in two years somebody else will have six hundred more members than you." } }
  ]
},


{
  "id": "succession_ouverte",
  "once": true,
  "weight": 5,
  "cast": "camp_senior",
  "when": { "minTurn": 14, "minStanding": 35, "partyLead": false },
  "tag": { "fr": "Succession", "en": "Succession" },
  "text": {
    "fr": "{rival} annonce qu'{il} ne se représentera pas. La place est ouverte, quatre personnes la veulent, et les trois autres se connaissent depuis plus longtemps que vous ne les connaissez."
    ,
    "en": "{rival} announces that {he} will not stand again. The seat is open, four people want it, and the other three have known each other far longer than you have known any of them."
  },
  "choices": [
    { "label": { "fr": "Se déclarer le premier", "en": "Declare first" },
      "effects": { "standing": 7, "notoriete": 1, "reputation": -1, "energie": -1 },
      "result": { "fr": "Vous prenez trois jours d'avance et tout le monde doit se positionner par rapport à vous. C'est un avantage réel, et il dure trois jours.",
                  "en": "You gain three days and everybody has to position themselves against you. It is a real advantage, and it lasts three days." } },

    { "label": { "fr": "Obtenir sa bénédiction avant l'annonce", "en": "Get {his} blessing before the announcement" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.05, "charisme": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 14, "reseau": 2, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "{Il} vous cite dans son discours d'adieu, une seule fois, à la fin. Cela vaut deux ans de réunions de section et tout le monde dans la salle le sait.",
                    "en": "{He} mentions you once in the farewell speech, right at the end. It is worth two years of branch meetings and everyone in the room knows it." } },
      "failure": { "effects": { "standing": -8, "reputation": -1, "energie": -1 },
        "result": { "fr": "{Il} vous écoute, ne promet rien, et adoube quelqu'un d'autre huit jours plus tard. Vous avez perdu l'avance ET la surprise.",
                    "en": "{He} listens, promises nothing, and anoints somebody else eight days later. You have lost the head start AND the surprise." } } },

    { "label": { "fr": "Laisser les trois autres s'entretuer", "en": "Let the other three destroy each other" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "minStanding": 55 }, "value": 0.2 },
                                                  { "when": { "trait": ["appareil"] }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 12, "sangfroid": 1, "credibilite": 1, "energie": 1 },
        "result": { "fr": "Ils passent quatre mois à se démolir dans la presse interne. Vous arrivez au congrès comme la seule solution qui ne fâche personne, ce qui est la meilleure façon d'y arriver.",
                    "en": "They spend four months tearing each other apart in the party press. You arrive at the conference as the only option nobody objects to, which is the best way to arrive." } },
      "failure": { "effects": { "standing": -9, "popularity": -2, "credibilite": -1 },
        "result": { "fr": "Ils s'accordent en trois semaines sur le dos du seul absent, qui était vous. On appelle cela une synthèse.",
                    "en": "They agree within three weeks at the expense of the only one absent, who was you. This is called a synthesis." } } }
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
    "fr": "Une chaîne d'information vous met face à {rival}. Une heure de direct, deux équipes qui ont préparé les mêmes phrases et un présentateur qui espère un incident.",
    "en": "A news channel puts you opposite {rival}. One hour live, two teams that have prepared the same lines and a host hoping for an incident."
  },
  "choices": [
    { "label": { "fr": "Aller le chercher sur son terrain", "en": "Take them on their own ground" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "strike": "intrepide", "popularity": 9, "notoriete": 1, "landscape": { "self": 1.6, "scene": -1.6 } },
        "result": { "fr": "Vous connaissez ses chiffres mieux que lui. À la fin de la séquence, il parle de sa famille, ce qui est toujours le signe qu'un débat est perdu.",
                    "en": "You know their figures better than they do. By the end of the segment they are talking about their family, which is always the sign of a debate lost." } },
      "failure": { "effects": { "credibilite": -2, "strike": "intrepide", "popularity": -7, "energie": -1, "landscape": { "self": -1.3, "scene": 1.3 } },
        "result": { "fr": "Vous vous avancez sur un dossier que vous maîtrisez mal. La correction est polie et elle passe en boucle pendant deux jours.",
                    "en": "You venture onto a file you do not really command. The correction is polite and it runs on a loop for two days." } } },
    { "label": { "fr": "Rester courtois et le laisser se découvrir", "en": "Stay courteous and let them expose themselves" },
      "effects": { "credibilite": +2, "reputation": 1, "sangfroid": 1, "popularity": 3, "standing": 3, "landscape": { "self": 0.5 } },
      "result": { "fr": "Personne ne retiendra une réplique, ce qui est exactement ce que votre entourage espérait. Le lendemain, les éditorialistes vous trouvent présidentiable, faute de mieux.",
                  "en": "Nobody will remember a single line, which is exactly what your staff was hoping for. The next day the columnists find you presidential, for want of anything better." } },
    { "label": { "fr": "Transformer le débat en moment de télévision", "en": "Turn the debate into television" },
      "when": { "personality": ["provocative"] },
      "effects": { "credibilite": -2, "notoriete": 2, "popularity": 8, "reputation": -2, "standing": -5,
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
                    "en": "They agree, then attack in the first minute on the very thing you had just ruled out. Nothing signed in a corridor is signed." } } },
    { "label": { "fr": "Se décommander la veille", "en": "Pull out the night before" },
      "when": { "trait": ["lache"] },
      "effects": { "credibilite": -2, "energie": 2, "popularity": -4, "standing": -2, "sangfroid": 1 },
      "result": { "fr": "Une extinction de voix providentielle, un certificat, et une chaise vide en face de lui pendant une heure. Vous n'avez rien perdu ce soir-là, ce qui est déjà mieux que la moitié de ceux qui y sont allés.",
                  "en": "A providential loss of voice, a doctor's note, and an empty chair opposite him for an hour. You lost nothing that evening, which is more than half the people who turned up can say." } }
  ]
},


{
  "id": "debauchage_cadre",
  "weight": 3,
  "cast": "opponent",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 12, "minStanding": 45 },
  "tag": { "fr": "Débauchage", "en": "Poaching" },
  "text": {
    "fr": "{rival} n'a plus d'avenir chez lui et le sait. Un déjeuner est organisé, sans témoin, par quelqu'un qui connaît vos deux numéros.",
    "en": "{rival} has no future left where he is, and knows it. A lunch is arranged, with no witnesses, by somebody who has both your numbers."
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
    "fr": "{rival} vous fait porter un message : chez eux, on vous trouve mal employé. Il ne parle pas d'un poste, il parle d'un avenir, ce qui coûte moins cher.",
    "en": "{rival} sends word: on their side, they think you are being wasted. They do not mention a post, they mention a future, which costs less."
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
   LE POUVOIR ET L'OPPOSITION
   ==========================================================================
   Ces scènes lisent trois choses que le jeu ne savait pas dire avant : si
   votre camp gouverne ("ruling"), ce que le pays pense du gouvernement
   ("minApproval" / "maxApproval"), et si l'exécutif tient l'Assemblée
   ("majority"). Elles font le métier ordinaire d'une législature, celui
   qu'on ne voit jamais dans les campagnes : voter, bloquer, obstruer,
   négocier, et attendre.
   ========================================================================== */

/* ==========================================================================
   CE QUE LA CARRIÈRE FINIT PAR LAISSER SUR QUELQU'UN
   ==========================================================================
   Cinq scènes, cinq traits. Chacune porte des choix que tout le monde ne
   voit pas : le parcours, le parti, un trait déjà acquis ou une statistique
   ouvrent des portes que le personnage d'à côté ne verra jamais. C'est la
   règle du fichier des traits, et c'est ce qui fait qu'on ne joue pas deux
   fois la même scène.
   ========================================================================== */

/* ==========================================================================
   L'ARGENT QUI DÉCIDE
   ==========================================================================
   Le patrimoine médian d'une carrière va de quatre cent quatre-vingt mille
   euros au départ à près de deux millions à l'arrivée, et le paiement médian
   d'un événement valait cinquante mille. Mesuré sur quarante-cinq carrières,
   quatre-vingt-seize pour cent des portes verrouillées par l'argent étaient
   déjà ouvertes : payer n'était pas un choix, c'était une case à cocher.

   Ces scènes-là jouent aux ordres de grandeur du patrimoine, pas à ceux de
   l'argent de poche. Elles proposent des PALIERS : la même décision à cent
   cinquante mille, à cinq cent mille et à un million et demi ne produit pas
   le même résultat, et la fortune d'origine redevient ce qu'elle est dans la
   vraie vie, une avance que les autres passent leur carrière à combler.

   Et l'inverse existe : deux scènes où l'on peut engager gros pour gagner
   beaucoup, avec une vraie chance de tout perdre.
   ========================================================================== */

/* ==========================================================================
   LA POLITIQUE TELLE QU'ELLE SE FAIT MAINTENANT
   ==========================================================================
   Le début de partie se jouait en salles des fêtes et en réunions de section,
   ce qui existe encore et ne suffit plus à décrire le métier. Ces scènes-là
   se passent sur un téléphone, entre deux notifications, avec des délais qui
   se comptent en minutes.

   Le jeu ne moque jamais les faits eux-mêmes ni les gens qui les subissent :
   ce qu'il moque, c'est la machine qui les transforme en contenu avant que
   quiconque sache ce qui s'est passé.
   ========================================================================== */

/* ==========================================================================
   CE QUE CHAQUE CAMP FAIT D'UN MÊME PROBLÈME
   ==========================================================================
   Audit des portes conditionnelles : quatre partis sur six n'ouvraient aucun
   choix qui leur soit propre, et le parcours militant en ouvrait un seul
   contre quatorze pour le droit. Un joueur qui choisit la Gauche radicale ou
   le militantisme associatif voyait donc exactement les mêmes cartes qu'un
   avocat centriste, ce qui vide la création de personnage de la moitié de
   son sens.

   Ces scènes posent le même problème à tout le monde et laissent chaque camp
   y répondre avec ses propres réflexes. La satire ne porte pas sur les idées
   mais sur le fait que le réflexe est toujours prêt avant le dossier.
   ========================================================================== */

{
  "id": "emission_divertissement",
  "weight": 4,
  "when": { "minTurn": 8, "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "Le samedi soir", "en": "Saturday night" },
  "text": {
    "fr": "Une émission de divertissement vous invite. Pas de politique, pas de contradiction, un jeu, un déguisement éventuel et six millions de personnes qui ne regardent jamais les débats. Votre entourage est divisé, ce qui veut dire que la moitié est contre.",
    "en": "An entertainment show wants you. No politics, no cross-examination, a game, possibly a costume, and six million people who never watch debates. Your team is divided, which means half of them are against."
  },
  "choices": [
    { "label": { "fr": "Y aller et jouer le jeu jusqu'au bout", "en": "Go, and play along all the way" },
      "effects": { "popularity": 9, "notoriete": 4, "credibilite": -3, "standing": -4 },
      "result": { "fr": "Vous chantez faux devant six millions de personnes et vous êtes très bon perdant. On vous trouve enfin sympathique, et l'on ne vous écoutera plus jamais sur les retraites.",
                  "en": "You sing badly in front of six million people and lose very gracefully. People finally find you likeable, and nobody will ever listen to you about pensions again." } },
    { "label": { "fr": "Refuser : la fonction ne se prête pas à ça", "en": "Refuse: the office does not lend itself to that" },
      "effects": { "credibilite": 2, "standing": 3, "popularity": -4, "notoriete": -2 },
      "result": { "fr": "Vous déclinez au nom de la dignité de la fonction. Votre concurrent y va le mois suivant, gagne quatre points, et parle des retraites la semaine d'après.",
                  "en": "You decline in the name of the dignity of the office. Your rival goes on the following month, gains four points, and talks about pensions the week after." } },
    { "label": { "fr": "Négocier de placer une séquence de fond", "en": "Negotiate a serious segment into it" },
      "when": { "background": ["comms"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "notoriete": 3, "credibilite": 1, "standing": 1 },
        "result": { "fr": "Quatre-vingt-dix secondes sérieuses obtenues contre trois heures de plateau, et vous savez exactement ce que ça vaut parce que vous avez vendu ce genre d'arrangement pendant dix ans.",
                    "en": "Ninety serious seconds bought with three hours of studio, and you know exactly what that is worth because you sold that kind of arrangement for ten years." } },
      "failure": { "effects": { "popularity": 3, "credibilite": -3, "standing": -3 },
        "result": { "fr": "La séquence est tournée et coupée au montage, ce que vous auriez dû exiger par écrit. Vous connaissiez la règle et vous avez fait confiance.",
                    "en": "The segment is filmed and cut in the edit, which you should have demanded in writing. You knew the rule and you trusted them." } } },
    { "label": { "fr": "Y aller comme chez vous : c'était votre métier", "en": "Go as if it were home: it was your job" },
      "when": { "background": ["celebrity"] },
      "effects": { "popularity": 12, "notoriete": 4, "credibilite": -2, "reseau": 2 },
      "result": { "fr": "Vous connaissez le régisseur, le maquilleur et le producteur, et vous savez où sont les caméras avant qu'on vous le dise. Le public vous retrouve, et la moitié de votre parti se demande ce qu'il a fait.",
                  "en": "You know the floor manager, the make-up artist and the producer, and you know where the cameras are before anyone tells you. The audience gets you back, and half your party wonders what it has done." } },
    { "label": { "fr": "Y aller, et retourner l'émission en interview", "en": "Go, and turn the show into an interview" },
      "when": { "background": ["journalism"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 7, "credibilite": 3, "notoriete": 3, "standing": 2 },
        "result": { "fr": "Vous posez les questions à l'animateur pendant douze minutes et la production laisse tourner parce que c'est bon. C'est le seul divertissement de l'année dont on retiendra quelque chose.",
                    "en": "You interview the host for twelve minutes and the producers let it run because it is good television. It is the only entertainment show of the year anyone will remember something from." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -1, "standing": -3 },
        "result": { "fr": "L'animateur n'est pas là pour ça et le public non plus. Vous passez pour quelqu'un qui ne sait pas s'amuser, ce qui est plus grave à la télévision que d'avoir tort.",
                    "en": "The host is not there for that and neither is the audience. You come across as somebody who cannot have fun, which on television is worse than being wrong." } } }
  ]
},


{
  "id": "tribune_collective",
  "weight": 4,
  "when": { "minTurn": 6 },
  "tag": { "fr": "La tribune", "en": "The open letter" },
  "text": {
    "fr": "On vous propose de cosigner une tribune avec quatre-vingts personnalités. Le texte est bien écrit, la cause est juste, et vous ne connaissez ni son auteur réel ni les onze signataires qui vous précèdent dans la liste.",
    "en": "You are asked to co-sign an open letter with eighty public figures. The text is well written, the cause is right, and you know neither its actual author nor the eleven signatories above you on the list."
  },
  "choices": [
    { "label": { "fr": "Signer sans lire jusqu'au bout", "en": "Sign without reading to the end" },
      "effects": { "notoriete": 2, "popularity": 2, "credibilite": -1, "reputation": -1 },
      "result": { "fr": "Vous signez en douze secondes sur votre téléphone. Le paragraphe sept vous sera opposé pendant quatre ans et vous ne l'aurez jamais lu.",
                  "en": "You sign in twelve seconds on your phone. Paragraph seven will be quoted against you for four years and you will never have read it." } },
    { "label": { "fr": "Refuser de signer un texte collectif", "en": "Refuse to sign a collective text" },
      "effects": { "credibilite": 2, "reputation": 1, "notoriete": -2, "popularity": -2 },
      "result": { "fr": "Vous répondez que vous écrivez vos propres textes. C'est vrai, personne ne les lit, et c'est la contrepartie exacte de cette réponse.",
                  "en": "You reply that you write your own texts. It is true, nobody reads them, and that is the exact price of that answer." } },
    { "label": { "fr": "Demander à voir les autres signataires d'abord", "en": "Ask to see the other signatories first" },
      "effects": { "credibilite": 1, "sangfroid": 1, "notoriete": -1 },
      "result": { "fr": "On vous envoie la liste et vous en retirez deux noms pour vous. Le texte paraît sans vous et sans eux, ce qui ne change rien à rien.",
                  "en": "You are sent the list and remove two names for your own use. The letter appears without you and without them, which changes nothing whatsoever." } },
    { "label": { "fr": "Réécrire trois paragraphes avant de signer", "en": "Rewrite three paragraphs before signing" },
      "when": { "background": ["journalism", "academia"] },
      "effects": { "credibilite": 3, "reputation": 2, "reseau": 2, "energie": -1, "notoriete": 1 },
      "result": { "fr": "Vous corrigez deux erreurs factuelles et une phrase indéfendable, et l'auteur vous remercie sincèrement. Vous êtes le seul des quatre-vingts à l'avoir lu.",
                  "en": "You correct two factual errors and one indefensible sentence, and the author thanks you sincerely. You are the only one of the eighty who read it." } },
    { "label": { "fr": "Signer, et amener trente signatures de plus", "en": "Sign, and bring thirty more signatures" },
      "when": { "background": ["activism"] },
      "effects": { "reseau": 3, "popularity": 4, "notoriete": 2, "standing": 2, "energie": -2 },
      "result": { "fr": "Vous passez deux soirs au téléphone et la tribune sort à cent dix noms au lieu de quatre-vingts. C'est le travail que personne ne veut faire et c'est lui qui fait la une.",
                  "en": "You spend two evenings on the phone and the letter runs with a hundred and ten names instead of eighty. It is the work nobody wants to do and it is what makes the front page." } },
    { "label": { "fr": "Signer et faire porter le texte par votre camp", "en": "Sign, and get your side to carry the text" },
      "when": { "position": ["chef", "depute", "ministre"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "notoriete": 3, "credibilite": 1,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "La tribune devient une proposition de loi en six semaines. Les soixante-dix-neuf autres signataires découvrent qu'ils ont participé à un texte de votre parti.",
                    "en": "The letter becomes a bill in six weeks. The other seventy-nine signatories discover they contributed to a text from your party." } },
      "failure": { "effects": { "standing": -4, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Onze signataires retirent leur nom en dénonçant une récupération partisane. Ils ont raison, et vous ne pouvez évidemment pas le dire.",
                    "en": "Eleven signatories withdraw their names, denouncing a partisan hijack. They are right, and you obviously cannot say so." } } }
  ]
},


{
  "id": "ligne_usine",
  "weight": 5,
  "when": { "position": ["cadre", "conseiller", "maire", "depute", "chef"], "minTurn": 8 },
  "tag": { "fr": "La ligne", "en": "The line" },
  "text": {
    "fr": "Un site de six cents emplois ferme dans un département voisin. La direction invoque la concurrence, les syndicats parlent de dividendes, et les deux ont des chiffres. On vous demande votre position avant treize heures.",
    "en": "A six-hundred-job site is closing in a neighbouring county. Management blames competition, the unions point at dividends, and both have figures. Your position is wanted before one o'clock."
  },
  "choices": [
    { "label": { "fr": "Demander un rendez-vous à la direction et aux syndicats", "en": "Ask to meet both management and the unions" },
      "effects": { "credibilite": 2, "reseau": 1, "popularity": 1, "notoriete": -1 },
      "result": { "fr": "Deux réunions, quatre heures, aucune caméra. Vous en sortez avec une compréhension du dossier que personne ne vous demandera jamais.",
                  "en": "Two meetings, four hours, no cameras. You come out with an understanding of the file nobody will ever ask you for." } },
    { "label": { "fr": "Ne pas se prononcer : ce n'est pas votre territoire", "en": "Say nothing: it is not your patch" },
      "effects": { "energie": 2, "standing": 1, "popularity": -4 },
      "result": { "fr": "Vous laissez le député du coin s'exprimer. C'est la règle non écrite et personne ne vous en félicitera.",
                  "en": "You let the local member speak. It is the unwritten rule and nobody will thank you for it." } },
    { "label": { "fr": "Exiger la réquisition et la nationalisation", "en": "Demand requisition and nationalisation" },
      "when": { "party": ["radical_left"] },
      "effects": { "popularity": 7, "standing": 8, "credibilite": -2, "notoriete": 2,
                   "landscape": { "self": 0.4 } },
      "result": { "fr": "Vous êtes sur place à quinze heures avec une proposition que personne ne votera jamais. Les six cents salariés le savent et vous applaudissent quand même, parce que vous êtes venu.",
                  "en": "You are on site by three with a proposal nobody will ever vote for. The six hundred workers know it and applaud anyway, because you came." } },
    { "label": { "fr": "Convoquer une table ronde avec l'État et la région", "en": "Convene a round table with the state and the region" },
      "when": { "party": ["socdem"] },
      "effects": { "credibilite": 2, "reseau": 3, "standing": 5, "popularity": 3, "energie": -2 },
      "result": { "fr": "Onze jours de négociation et un plan qui sauve deux cent quarante emplois sur six cents. C'est un échec de soixante pour cent qu'on présentera comme une victoire, et ce sera les deux.",
                  "en": "Eleven days of negotiation and a plan that saves two hundred and forty jobs out of six hundred. It is a sixty per cent failure that will be presented as a win, and it will be both." } },
    { "label": { "fr": "Demander une mission d'inspection avant toute chose", "en": "Ask for an inspection report before anything else" },
      "when": { "party": ["centrists"] },
      "effects": { "credibilite": 3, "standing": 4, "popularity": -5, "reputation": 1 },
      "result": { "fr": "Le rapport sortira dans sept mois, quand le site sera fermé depuis cinq. Il sera excellent et il conclura qu'il aurait fallu agir en février.",
                  "en": "The report will come out in seven months, five after the site closes. It will be excellent and will conclude that action was needed in February." } },
    { "label": { "fr": "Expliquer que l'État n'a pas à financer une entreprise qui perd", "en": "Explain that the state should not fund a loss-making firm" },
      "when": { "party": ["liberals"] },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 4, "standing": 6, "popularity": -7, "reputation": 2 },
        "result": { "fr": "Vous dites devant les caméras ce que tout le monde pense en réunion. Le pays vous déteste pendant huit jours et trois éditorialistes écrivent que vous avez raison.",
                    "en": "You say in front of the cameras what everybody thinks in meetings. The country hates you for eight days and three commentators write that you are right." } },
      "failure": { "effects": { "popularity": -13, "standing": -4, "credibilite": -1, "reputation": -1 },
        "result": { "fr": "La phrase est juste et le moment est le pire possible. On la ressortira à chaque fermeture d'usine pendant dix ans, sans jamais la remettre dans son contexte.",
                    "en": "The sentence is right and the timing is the worst possible. It will be replayed at every plant closure for ten years, never once in context." } } },
    { "label": { "fr": "Mettre en cause le laisser-faire de l'État sur la filière", "en": "Blame the state for letting the whole sector go" },
      "when": { "party": ["conservatives"] },
      "effects": { "popularity": 5, "standing": 5, "credibilite": 1, "approval": -5 },
      "result": { "fr": "Vous ne parlez ni de l'entreprise ni des syndicats, seulement de trente ans de décisions publiques. C'est le seul angle qui ne fâche personne dans votre camp.",
                  "en": "You talk about neither the company nor the unions, only thirty years of public decisions. It is the only angle that upsets nobody in your own camp." } },
    { "label": { "fr": "Dénoncer la délocalisation et la concurrence déloyale", "en": "Denounce offshoring and unfair competition" },
      "when": { "party": ["identitarians"] },
      "effects": { "popularity": 9, "standing": 6, "credibilite": -3, "notoriete": 2,
                   "landscape": { "self": 0.5 } },
      "result": { "fr": "Vous nommez le pays où partent les machines avant d'avoir vérifié qu'elles y partent. Elles y partent, et cela ne rend pas la vérification inutile.",
                  "en": "You name the country the machines are going to before checking that they are. They are, and that does not make the checking pointless." } },
    { "label": { "fr": "Organiser la caisse de grève depuis votre réseau", "en": "Organise the strike fund through your own network" },
      "when": { "background": ["activism"] },
      "effects": { "popularity": 6, "reseau": 3, "standing": -3, "energie": -2, "reputation": 2 },
      "result": { "fr": "Quarante mille euros récoltés en neuf jours par des gens que vous connaissez depuis vingt ans. Aucun journal n'en parlera et le piquet tiendra trois semaines de plus.",
                  "en": "Forty thousand euros raised in nine days by people you have known for twenty years. No paper will mention it and the picket will hold three weeks longer." } }
  ]
},


{
  "id": "militant_origine",
  "once": true,
  "weight": 5,
  "when": { "background": ["activism"], "minTurn": 6 },
  "tag": { "fr": "Ceux d'avant", "en": "The old crowd" },
  "text": {
    "fr": "L'association où vous avez tout appris tient son assemblée générale et vous y êtes invité. Trois personnes de l'époque vous attendent avec une question simple : est-ce que vous êtes encore des leurs, ou est-ce que vous venez chercher quelque chose.",
    "en": "The association where you learned everything is holding its general meeting and you are invited. Three people from those days are waiting with one simple question: are you still one of them, or have you come to get something."
  },
  "choices": [
    { "label": { "fr": "Y aller et écouter trois heures sans parler", "en": "Go and listen for three hours without speaking" },
      "effects": { "reputation": 3, "popularity": 3, "reseau": 2, "energie": -2, "standing": -2 },
      "result": { "fr": "Vous restez jusqu'au vote des motions et vous repartez sans avoir pris le micro. C'est la seule chose qu'ils attendaient et personne ne vous le dira.",
                  "en": "You stay until the motions are voted and leave without taking the microphone. It is the one thing they were waiting for and nobody will tell you so." } },
    { "label": { "fr": "Y aller et leur demander leur soutien public", "en": "Go and ask them for a public endorsement" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "reseau": 3, "notoriete": 2, "standing": 2 },
        "result": { "fr": "Ils votent le soutien à main levée, sans enthousiasme et sans réserve. Trois cents bénévoles vaudront plus que n'importe quel encart de campagne.",
                    "en": "They vote the endorsement by a show of hands, without enthusiasm and without reservation. Three hundred volunteers will be worth more than any campaign advert." } },
      "failure": { "effects": { "popularity": -5, "reputation": -3, "reseau": -2 },
        "result": { "fr": "On vous répond que l'association ne soutient personne et que vous le saviez avant d'entrer. Vous le saviez.",
                    "en": "You are told the association endorses nobody and that you knew that before walking in. You knew." } } },
    { "label": { "fr": "Ne pas y aller : ce n'est plus votre place", "en": "Do not go: it is no longer your place" },
      "effects": { "standing": 3, "energie": 1, "popularity": -6, "reputation": -2 },
      "result": { "fr": "Vous envoyez un message d'excuse et un ordre du jour chargé. Ils comprennent parfaitement, et c'est bien cela le problème.",
                  "en": "You send apologies and a heavy diary. They understand perfectly, and that is precisely the problem." } },
    { "label": { "fr": "Leur proposer de porter leur revendication au Parlement", "en": "Offer to take their demand to Parliament" },
      "when": { "position": ["depute", "euro"] },
      "effects": { "popularity": 5, "credibilite": 2, "reseau": 2, "standing": -4, "energie": -2 },
      "result": { "fr": "Vous déposez leur texte tel quel, avec leurs mots, et il ne passera pas. Ils le savent, ils l'ont vu écrit noir sur blanc au Journal officiel, et cela n'a pas de prix pour eux.",
                  "en": "You table their text as it stands, in their words, and it will not pass. They know, they have seen it printed in the official record, and to them that is priceless." } }
  ]
},


{
  "id": "militant_permanent",
  "weight": 4,
  "when": { "background": ["activism"], "position": ["militant", "cadre", "conseiller"], "minTurn": 4 },
  "tag": { "fr": "Le salariat", "en": "Going professional" },
  "text": {
    "fr": "On vous propose un poste de permanent : un salaire, un bureau, et la fin de la question de savoir comment vous vivez. C'est aussi la fin de quelque chose d'autre, et les trois personnes qui vous l'ont proposé le savent parfaitement.",
    "en": "You are offered a paid staff post: a salary, an office, and the end of the question of how you live. It is also the end of something else, and the three people who offered it know that perfectly well."
  },
  "choices": [
    { "label": { "fr": "Accepter et devenir un professionnel", "en": "Accept and turn professional" },
      "effects": { "money": 30000, "standing": 8, "reseau": 2, "popularity": -3, "reputation": -1 },
      "result": { "fr": "Trente-neuf mille euros par an pour faire ce que vous faisiez gratuitement. Vous devenez meilleur, plus disponible, et légèrement moins crédible quand vous parlez de désintéressement.",
                  "en": "Thirty-nine thousand euros a year to do what you were doing for free. You get better, more available, and slightly less credible when you talk about disinterest." } },
    { "label": { "fr": "Refuser et garder votre métier", "en": "Refuse and keep your job" },
      "effects": { "reputation": 3, "credibilite": 1, "energie": -3, "standing": -5 },
      "result": { "fr": "Vous continuez à militer le soir et le week-end, avec un employeur qui commence à compter vos absences. C'est plus dur et personne ne pourra jamais dire que vous en vivez.",
                  "en": "You keep campaigning evenings and weekends, with an employer starting to count your absences. It is harder and nobody will ever be able to say you make a living from it." } },
    { "label": { "fr": "Accepter à mi-temps, et le dire", "en": "Accept half-time, and say so" },
      "when": { "stat": { "energie": { "min": 11 } } },
      "effects": { "money": 15000, "standing": 4, "reputation": 2, "energie": -2, "reseau": 1 },
      "result": { "fr": "Un mi-temps déclaré, affiché, et un métier gardé à côté. C'est la formule la plus honnête et celle qui fatigue le plus, ce qui est souvent la même chose.",
                  "en": "A declared, published half-time post, and a job kept alongside. It is the most honest arrangement and the most exhausting, which is often the same thing." } },
    { "label": { "fr": "Négocier le poste pour quelqu'un d'autre de l'association", "en": "Negotiate the post for somebody else from the association" },
      "effects": { "reseau": 4, "reputation": 3, "standing": 2, "money": -5000 },
      "result": { "fr": "Vous obtenez le poste pour une bénévole qui en a plus besoin que vous. Elle ne l'oubliera pas, et vous venez de vous faire une alliée pour trente ans.",
                  "en": "You get the post for a volunteer who needs it more than you. She will not forget, and you have just made an ally for thirty years." } }
  ]
},


{
  "id": "emploi_familial",
  "once": true,
  "weight": 4,
  "when": { "position": ["depute", "euro"], "minTurn": 8 },
  "tag": { "fr": "L'assistant", "en": "The assistant" },
  "text": {
    "fr": "Votre enveloppe d'assistants n'est pas dépensée et votre conjointe cherche un poste. Elle est compétente, le travail est réel, et l'ensemble est parfaitement légal jusqu'au jour où quelqu'un décide que ce ne l'est plus.",
    "en": "Your staff allowance is not fully spent and your spouse is looking for work. She is competent, the job is real, and the whole thing is perfectly legal until the day somebody decides it is not."
  },
  "choices": [
    { "label": { "fr": "L'embaucher, comme tout le monde", "en": "Hire her, like everybody else" },
      "effects": { "money": 45000, "energie": 1, "strike": "casserole", "reputation": -1 },
      "result": { "fr": "Un contrat, des fiches de paie et un travail effectivement fait. Cela figurera dans votre dossier de presse jusqu'à la fin, avec la mention « légal à l'époque ».",
                  "en": "A contract, payslips and work actually done. It will be in your press file until the end, with the note “legal at the time”." } },
    { "label": { "fr": "Ne pas y toucher", "en": "Do not go near it" },
      "effects": { "reputation": 2, "credibilite": 1, "money": -15000 },
      "result": { "fr": "Vous recrutez quelqu'un que vous ne connaissez pas et vous payez une chambre de bonne à votre conjointe ailleurs. C'est plus cher et cela ne se raconte à personne.",
                  "en": "You hire somebody you do not know and pay for a room for your spouse somewhere else. It costs more and it is told to nobody." } },
    { "label": { "fr": "L'embaucher et publier le contrat", "en": "Hire her and publish the contract" },
      "when": { "stat": { "reputation": { "min": 12 } } },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "money": 45000, "credibilite": 2, "reputation": 2, "notoriete": 1 },
        "result": { "fr": "Contrat, missions, horaires, tout en ligne le premier jour. Personne ne peut plus rien en faire, et deux collègues vous détestent d'avoir montré que c'était possible.",
                    "en": "Contract, duties, hours, all online on day one. Nobody can do anything with it any more, and two colleagues hate you for showing it could be done." } },
      "failure": { "effects": { "money": 45000, "reputation": -3, "popularity": -6, "strike": "casserole" },
        "result": { "fr": "La transparence attire l'attention sur ce que personne n'aurait regardé. Vous avez fourni le dossier de presse vous-même.",
                    "en": "The transparency draws attention to what nobody would have looked at. You supplied the press file yourself." } } },
    { "label": { "fr": "Faire embaucher par un collègue, réciproquement", "en": "Have a colleague hire her, and return the favour" },
      "when": { "personality": ["calculating"], "stat": { "reseau": { "min": 9 } } },
      "effects": { "money": 40000, "reseau": 2, "reputation": -2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Il embauche la vôtre, vous embauchez la sienne, et les deux travaillent vraiment. C'est légal, c'est répandu, et le jour où cela sortira ce sera pour tout le monde en même temps.",
                  "en": "He hires yours, you hire his, and both genuinely work. It is legal, it is widespread, and the day it comes out it will come out for everybody at once." } }
  ]
},


{
  "id": "declaration_patrimoine",
  "once": true,
  "weight": 4,
  "when": { "position": ["depute", "euro", "maire", "ministre", "premier"], "minTurn": 6, "minMoney": 300000 },
  "tag": { "fr": "La déclaration", "en": "The declaration" },
  "text": {
    "fr": "Vous avez trente jours pour déclarer votre patrimoine à l'autorité, au centime. Votre comptable vous signale trois lignes discutables : un bien de famille sous-évalué depuis vingt ans, un compte ouvert à l'étranger pour des raisons oubliées, et une collection dont personne ne connaît la valeur.",
    "en": "You have thirty days to declare your wealth to the authority, to the last cent. Your accountant flags three questionable lines: a family property undervalued for twenty years, an account opened abroad for forgotten reasons, and a collection nobody can put a price on."
  },
  "choices": [
    { "label": { "fr": "Tout déclarer, à la valeur haute", "en": "Declare everything, at the high valuation" },
      "effects": { "reputation": 3, "credibilite": 2, "money": -70000, "popularity": -3 },
      "result": { "fr": "Le chiffre publié est plus élevé que ce que le pays imaginait et vous coûte trois points dans les sondages. Vous ne serez jamais rattrapé sur ce sujet, et c'est la seule chose qui compte.",
                  "en": "The published figure is higher than the country imagined and costs you three points. You will never be caught out on this subject, and that is the only thing that matters." } },
    { "label": { "fr": "Déclarer l'essentiel et oublier la collection", "en": "Declare the main items and forget the collection" },
      "effects": { "strike": "casserole", "money": 20000, "reputation": -1 },
      "result": { "fr": "Une omission de bonne foi, comme il s'en fait des centaines. Elle dormira dans un dossier jusqu'à ce que quelqu'un ait besoin de la réveiller.",
                  "en": "An omission in good faith, of the kind made in their hundreds. It will sleep in a file until somebody needs to wake it up." } },
    { "label": { "fr": "Fermer le compte étranger avant de déclarer", "en": "Close the foreign account before declaring" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "money": -40000, "sangfroid": 1 },
        "result": { "fr": "Le compte n'existe plus au moment où vous signez, ce qui est exact et ne trompe personne d'autre que le formulaire.",
                    "en": "The account no longer exists at the moment you sign, which is accurate and deceives nobody except the form." } },
      "failure": { "effects": { "reputation": -3, "popularity": -8, "flags": { "investigated": true }, "trait": "casserole" },
        "result": { "fr": "La clôture précède la déclaration de onze jours, et c'est cette date-là qui intéresse tout le monde. On ne ferme pas un compte discrètement quand on est déclarant.",
                    "en": "The closure precedes the declaration by eleven days, and that date is what interests everybody. You do not quietly close an account when you are a declarant." } } },
    { "label": { "fr": "Faire réévaluer le bien de famille par un expert", "en": "Have the family property revalued by an expert" },
      "when": { "background": ["law", "business"] },
      "effects": { "money": -25000, "credibilite": 2, "reputation": 1 },
      "result": { "fr": "Un rapport de quarante pages qui justifie chaque chiffre. Cela coûte le prix d'une petite voiture et cela vaut dix ans de tranquillité.",
                  "en": "A forty-page report justifying every figure. It costs the price of a small car and buys ten years of peace." } }
  ]
},


{
  "id": "demission_directe",
  "once": true,
  "weight": 8,
  "when": { "position": ["ministre", "premier"], "minTurn": 10, "maxApproval": 50 },
  "tag": { "fr": "Sept heures cinquante", "en": "Ten to eight" },
  "text": {
    "fr": "Vous êtes en direct à la matinale et l'on vous demande, pour la quatrième fois ce mois-ci, si vous vous reconnaissez encore dans la politique du gouvernement. Vous avez trois secondes pour répondre et vous savez que la réponse honnête est non.",
    "en": "You are live on the breakfast show and being asked, for the fourth time this month, whether you still recognise yourself in the government's policy. You have three seconds to answer and you know the honest answer is no."
  },
  "choices": [
    { "label": { "fr": "Démissionner à l'antenne", "en": "Resign on air" },
      "effects": { "office": "none", "popularity": 14, "notoriete": 4, "reputation": 3, "standing": -16, "approval": -9 },
      "result": { "fr": "Vous l'annoncez avant d'avoir prévenu Matignon, l'Élysée ou votre directeur de cabinet. Le pays trouve cela magnifique et vous ne serez plus jamais ministre de personne.",
                  "en": "You announce it before telling the prime minister, the presidency or your own chief of staff. The country finds it magnificent and you will never be anybody's minister again." } },
    { "label": { "fr": "Tenir la ligne encore une fois", "en": "Hold the line one more time" },
      "effects": { "standing": 6, "popularity": -5, "credibilite": -1, "energie": -2, "approval": 2 },
      "result": { "fr": "Quatre minutes de langue de bois que vous entendez sortir de votre propre bouche. Vous rentrez au ministère et vous ne dites rien à personne.",
                  "en": "Four minutes of boilerplate you hear coming out of your own mouth. You go back to the ministry and say nothing to anybody." } },
    { "label": { "fr": "Dire ce que vous pensez sans démissionner", "en": "Say what you think without resigning" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "credibilite": 2, "standing": -8, "approval": -5 },
        "result": { "fr": "Vous exposez un désaccord précis, sur un dossier précis, sans jamais dire le mot démission. On vous laisse en poste parce qu'on ne sait pas comment vous en sortir.",
                    "en": "You set out a precise disagreement, on a precise file, without ever saying the word resign. You are left in place because nobody knows how to remove you." } },
      "failure": { "effects": { "office": "none", "popularity": 3, "standing": -12, "approval": -6 },
        "result": { "fr": "Le désaccord passe pour une démission qui n'ose pas se dire, et Matignon vous en dispense à midi. Vous avez perdu le poste sans avoir eu le geste.",
                    "en": "The disagreement reads as a resignation that dare not speak, and by noon you are relieved of the trouble. You lost the job without getting the gesture." } } },
    { "label": { "fr": "Retourner la question sur le journaliste", "en": "Turn the question back on the interviewer" },
      "when": { "personality": ["provocative"], "stat": { "charisme": { "min": 11 } } },
      "effects": { "notoriete": 3, "popularity": 4, "credibilite": -2, "standing": 3 },
      "result": { "fr": "Vous lui demandez s'il se reconnaît encore dans son propre journal. La séquence tourne, le fond disparaît, et le gouvernement vous trouve soudain très utile.",
                  "en": "You ask whether he still recognises himself in his own newspaper. The clip travels, the substance vanishes, and the government suddenly finds you very useful." } }
  ]
},


{
  "id": "convention_citoyenne",
  "once": true,
  "weight": 3,
  "when": { "position": ["ministre", "premier", "chef", "depute"], "minTurn": 14 },
  "tag": { "fr": "Cent cinquante citoyens", "en": "A hundred and fifty citizens" },
  "text": {
    "fr": "On installe une convention citoyenne tirée au sort sur un sujet que le Parlement n'arrive pas à trancher. Cent cinquante personnes, neuf week-ends, des experts, et un engagement solennel à reprendre leurs propositions. Vous savez déjà lesquelles ne passeront pas.",
    "en": "A citizens' convention drawn by lot is being set up on a question Parliament cannot settle. A hundred and fifty people, nine weekends, experts, and a solemn commitment to take up their proposals. You already know which ones will not survive."
  },
  "choices": [
    { "label": { "fr": "Promettre de tout reprendre, sans filtre", "en": "Promise to take up everything, unfiltered" },
      "effects": { "popularity": 8, "credibilite": -1, "approval": 4, "standing": -3 },
      "result": { "fr": "La formule est belle et elle sera citée pendant deux ans, à chaque fois qu'une proposition sera écartée. Vous venez de fabriquer votre propre procès.",
                  "en": "The phrase is fine and will be quoted for two years, each time a proposal is dropped. You have just manufactured your own trial." } },
    { "label": { "fr": "Annoncer d'emblée ce qui ne passera pas", "en": "Say up front what will not survive" },
      "effects": { "credibilite": 3, "reputation": 2, "popularity": -5, "approval": -2 },
      "result": { "fr": "Vous expliquez au premier week-end que trois sujets sont hors périmètre. Douze participants claquent la porte, les cent trente-huit autres travaillent en sachant pour quoi.",
                  "en": "You explain on the first weekend that three subjects are out of scope. Twelve participants walk out, the other hundred and thirty-eight work knowing what for." } },
    { "label": { "fr": "S'asseoir avec eux les neuf week-ends", "en": "Sit with them for all nine weekends" },
      "when": { "stat": { "energie": { "min": 12 } } },
      "effects": { "popularity": 6, "credibilite": 2, "reputation": 2, "energie": -4, "reseau": 1 },
      "result": { "fr": "Neuf samedis dans une salle de la République, sans conseiller et sans téléphone. Vous ressortez avec un dossier que vous connaissez mieux que votre administration.",
                  "en": "Nine Saturdays in a state building, no adviser and no phone. You come out knowing the file better than your own civil servants." } },
    { "label": { "fr": "Y placer des experts qui pensent comme vous", "en": "Place experts who think as you do" },
      "when": { "stat": { "reseau": { "min": 11 } }, "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "approval": 5, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "Quatre auditions bien choisies suffisent à orienter neuf week-ends. Les propositions ressemblent à votre programme et personne ne peut dire que vous les avez écrites.",
                    "en": "Four well-chosen hearings are enough to steer nine weekends. The proposals resemble your programme and nobody can say you wrote them." } },
      "failure": { "effects": { "popularity": -9, "reputation": -3, "approval": -7, "credibilite": -2 },
        "result": { "fr": "Deux participants publient la liste des experts entendus et leurs affiliations. La convention se retourne entièrement contre vous en un week-end.",
                    "en": "Two participants publish the list of experts heard and their affiliations. The convention turns entirely against you in a single weekend." } } }
  ]
},


{
  "id": "diplome_cv",
  "once": true,
  "weight": 3,
  "when": { "minTurn": 7, "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "La ligne du CV", "en": "The line on the CV" },
  "text": {
    "fr": "Un journaliste a vérifié votre biographie officielle. La formation que vous mentionnez depuis quinze ans est un certificat de trois mois, pas le diplôme que le mot laisse entendre. Vous ne vous rappelez même pas qui a écrit cette ligne.",
    "en": "A reporter has checked your official biography. The training you have listed for fifteen years is a three-month certificate, not the degree the wording implies. You cannot even remember who wrote that line."
  },
  "choices": [
    { "label": { "fr": "Corriger la fiche et le dire", "en": "Correct the page and say so" },
      "effects": { "reputation": 2, "credibilite": 1, "popularity": -3, "notoriete": 1 },
      "result": { "fr": "Vous corrigez en ligne le jour même avec une phrase d'explication. L'article sort quand même et il est deux fois plus court que prévu.",
                  "en": "You correct it online the same day with a sentence of explanation. The article runs anyway and is half as long as planned." } },
    { "label": { "fr": "Maintenir que c'est équivalent", "en": "Maintain it is equivalent" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "eloquence": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 2, "standing": 2, "reputation": -1 },
        "result": { "fr": "Vous tenez trois jours sur la notion d'équivalence et le sujet s'épuise. Ce n'était pas équivalent, et plus personne n'ira vérifier.",
                    "en": "You hold out for three days on the notion of equivalence and the story runs out. It was not equivalent, and nobody will check again." } },
      "failure": { "effects": { "popularity": -9, "credibilite": -3, "reputation": -2, "strike": "menteur" },
        "result": { "fr": "L'école publie une mise au point de deux lignes. Deux lignes suffisent quand elles sont signées par l'établissement lui-même.",
                    "en": "The school publishes a two-line clarification. Two lines are enough when the institution itself signs them." } } },
    { "label": { "fr": "Raconter pourquoi vous n'avez pas fait ces études", "en": "Explain why you never did those studies" },
      "when": { "origin": ["modest", "middle"] },
      "effects": { "popularity": 8, "reputation": 3, "credibilite": 1, "notoriete": 2 },
      "result": { "fr": "Vous expliquez qu'on ne vous a pas proposé cette école et pourquoi. Le papier change complètement de sujet et devient le meilleur portrait qu'on ait fait de vous.",
                  "en": "You explain that school was never offered to you, and why. The piece changes subject entirely and becomes the best profile ever written about you." } }
  ]
},


{
  "id": "maire_desobeissance",
  "weight": 4,
  "when": { "position": ["maire"], "minTurn": 8 },
  "tag": { "fr": "L'arrêté", "en": "The by-law" },
  "text": {
    "fr": "Une décision nationale s'applique chez vous et votre conseil municipal la refuse à l'unanimité. Vous pouvez prendre un arrêté qui sera annulé par le tribunal administratif dans six semaines, et tout le monde le sait, à commencer par vous.",
    "en": "A national decision applies in your town and your council rejects it unanimously. You can issue a by-law that the administrative court will strike down in six weeks, and everybody knows it, starting with you."
  },
  "choices": [
    { "label": { "fr": "Prendre l'arrêté et aller jusqu'au tribunal", "en": "Issue the by-law and go to court" },
      "effects": { "popularity": 9, "notoriete": 3, "credibilite": -2, "standing": 2, "approval": -3 },
      "result": { "fr": "Six semaines de tribune nationale pour une décision annulée d'avance. Vos administrés savent que vous vous êtes battu, et c'est très exactement ce que vous vouliez.",
                  "en": "Six weeks of national platform for a decision struck down in advance. Your residents know you fought, and that is very precisely what you wanted." } },
    { "label": { "fr": "Appliquer, et expliquer pourquoi", "en": "Apply it, and explain why" },
      "effects": { "credibilite": 3, "reputation": 2, "popularity": -6, "standing": 3 },
      "result": { "fr": "Vous appliquez une décision que vous désapprouvez et vous passez trois réunions publiques à dire pourquoi vous n'avez pas le choix. Personne n'aime cette réponse et personne ne peut la contredire.",
                  "en": "You apply a decision you disagree with and spend three public meetings explaining why you have no choice. Nobody likes that answer and nobody can contradict it." } },
    { "label": { "fr": "Prendre l'arrêté avec quarante autres maires", "en": "Issue it alongside forty other mayors" },
      "when": { "stat": { "reseau": { "min": 10 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "notoriete": 4, "reseau": 3, "standing": 5,
                                "landscape": { "self": 0.5 } },
        "result": { "fr": "Quarante-trois arrêtés identiques signés le même matin. Ce n'est plus un maire isolé, c'est un mouvement, et le ministère recule sur deux points avant le jugement.",
                    "en": "Forty-three identical by-laws signed the same morning. It is no longer one isolated mayor, it is a movement, and the ministry gives ground on two points before the ruling." } },
      "failure": { "effects": { "popularity": -4, "reseau": -2, "standing": -5 },
        "result": { "fr": "Onze maires signent, les autres se désistent la veille. Vous portez seul une initiative collective, ce qui est la pire des deux positions.",
                    "en": "Eleven mayors sign, the rest pull out the day before. You carry a collective initiative alone, which is the worse of the two positions." } } },
    { "label": { "fr": "Négocier une dérogation au lieu de désobéir", "en": "Negotiate an exemption instead of disobeying" },
      "when": { "background": ["civil", "law"] },
      "effects": { "credibilite": 2, "reseau": 2, "popularity": 3, "notoriete": -1 },
      "result": { "fr": "Trois rendez-vous au ministère et un courrier qui accorde dix-huit mois. Vous obtenez plus que l'arrêté n'aurait donné et personne n'en parlera jamais.",
                  "en": "Three meetings at the ministry and a letter granting eighteen months. You get more than the by-law would have delivered and nobody will ever mention it." } }
  ]
},


{
  "id": "fait_divers_recup",
  "weight": 5,
  "when": { "minTurn": 3 },
  "tag": { "fr": "Dans l'heure", "en": "Within the hour" },
  "text": {
    "fr": "Une agression dans une gare de votre département, trois lignes de dépêche, aucun nom, aucun détail vérifié. Le compte national du parti a déjà publié. On vous demande de relayer avant que le sujet ne redescende, c'est-à-dire avant ce soir.",
    "en": "An assault at a station in your area, three lines of wire copy, no names, nothing verified. The party's national account has already posted. You are asked to share it before the story fades, which means before this evening."
  },
  "choices": [
    { "label": { "fr": "Relayer, avec les mots qu'on vous envoie", "en": "Share it, with the wording you are sent" },
      "effects": { "popularity": 5, "standing": 4, "reputation": -2, "credibilite": -1 },
      "result": { "fr": "Quatorze mille partages en six heures. Le parquet publiera un communiqué dans huit jours qui dira autre chose, et personne ne le relaiera.",
                  "en": "Fourteen thousand shares in six hours. The prosecutor's office will put out a statement in a week saying something else, and nobody will share that." } },
    { "label": { "fr": "Attendre de savoir ce qui s'est passé", "en": "Wait until you know what happened" },
      "effects": { "reputation": 3, "credibilite": 2, "standing": -6, "popularity": -3 },
      "result": { "fr": "Vous ne publiez rien pendant quatre jours. Le siège note votre silence, vos concurrents notent votre absence, et vous êtes le seul à ne rien avoir à retirer.",
                  "en": "You post nothing for four days. Headquarters notes your silence, your rivals note your absence, and you are the only one with nothing to delete." } },
    { "label": { "fr": "Publier votre propre texte, plus prudent", "en": "Post your own text, more careful" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 4, "credibilite": 2, "reputation": 1, "standing": 1 },
        "result": { "fr": "Six phrases qui disent la colère sans dire les faits que personne ne connaît. On vous cite dans les deux camps, ce qui n'arrive presque jamais sur ce genre de sujet.",
                    "en": "Six sentences that name the anger without naming facts nobody knows. You are quoted on both sides, which almost never happens on this kind of subject." } },
      "failure": { "effects": { "popularity": -6, "standing": -4, "reputation": -1 },
        "result": { "fr": "Votre prudence est lue comme une gêne et votre gêne comme un aveu. Vous avez réussi à déplaire à tout le monde en trois cent quatre-vingts signes.",
                    "en": "Your caution reads as embarrassment and your embarrassment as an admission. You have managed to displease everybody in three hundred and eighty characters." } } },
    { "label": { "fr": "En faire un symbole national dès ce soir", "en": "Make it a national symbol tonight" },
      "when": { "party": ["identitarians", "radical_left"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": 10, "notoriete": 3, "standing": 6, "credibilite": -2,
                                "reputation": -2, "landscape": { "self": 0.6 } },
        "result": { "fr": "Trois lignes de dépêche deviennent une thèse sur le pays en une soirée. Votre camp trouve enfin les mots qu'il cherchait, et personne n'ira à la gare vérifier.",
                    "en": "Three lines of wire copy become a thesis about the country in one evening. Your side finally has the words it was looking for, and nobody will go to the station to check." } },
      "failure": { "effects": { "popularity": -10, "reputation": -3, "credibilite": -2, "strike": "radical" },
        "result": { "fr": "Les faits sortent le lendemain et ne ressemblent en rien à ce que vous en avez fait. Le démenti est plus repris que la publication, ce qui n'arrive jamais et vous arrive.",
                    "en": "The facts come out the next day and bear no resemblance to what you made of them. The correction travels further than the post, which never happens and has happened to you." } } },
    { "label": { "fr": "Appeler le procureur avant de dire quoi que ce soit", "en": "Call the prosecutor before saying anything" },
      "when": { "background": ["law", "civil"] },
      "effects": { "credibilite": 3, "reputation": 2, "reseau": 1, "standing": -3, "popularity": -1 },
      "result": { "fr": "Un coup de fil, quarante secondes, et vous savez ce que les autres publieront demain en se trompant. Vous ne pourrez rien en dire, et c'est déjà beaucoup.",
                  "en": "One call, forty seconds, and you know what the others will get wrong tomorrow. You will not be able to say any of it, and that is already a great deal." } }
  ]
},


{
  "id": "community_manager",
  "once": true,
  "weight": 4,
  "when": { "position": ["militant", "cadre", "conseiller", "maire"], "minTurn": 2 },
  "tag": { "fr": "Le stagiaire", "en": "The intern" },
  "text": {
    "fr": "Un bénévole de vingt-deux ans tient vos comptes depuis trois mois et il est bien meilleur que vous. Il vous propose un plan : trois publications par jour, un ton qui n'est pas le vôtre, et l'interdiction absolue de publier vous-même après vingt et une heures.",
    "en": "A twenty-two-year-old volunteer has run your accounts for three months and is far better at it than you. He proposes a plan: three posts a day, a tone that is not yours, and an absolute ban on posting yourself after nine in the evening."
  },
  "choices": [
    { "label": { "fr": "Lui laisser les clés, entièrement", "en": "Hand him the keys completely" },
      "effects": { "notoriete": 3, "popularity": 4, "credibilite": -1, "energie": 2 },
      "result": { "fr": "Votre audience triple en quatre mois. Vous ne reconnaissez plus tout à fait la personne qui parle sous votre nom, et elle a manifestement plus de succès que vous.",
                  "en": "Your following triples in four months. You no longer entirely recognise the person speaking under your name, and she is plainly more successful than you." } },
    { "label": { "fr": "Garder la main, et publier moins", "en": "Keep control, and post less" },
      "effects": { "reputation": 2, "credibilite": 1, "notoriete": -1, "energie": -1 },
      "result": { "fr": "Deux publications par semaine, écrites par vous, sans emoji et sans crochet d'accroche. C'est lent, c'est vous, et une petite communauté s'installe qui ne partira pas.",
                  "en": "Two posts a week, written by you, no emoji and no hook. It is slow, it is you, and a small following settles in that will not leave." } },
    { "label": { "fr": "Le salarier avant qu'un autre le fasse", "en": "Put him on the payroll before somebody else does" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -55000, "notoriete": 3, "popularity": 5, "reseau": 1 },
      "result": { "fr": "Trente-deux mille euros par an pour quelqu'un qui n'a jamais mis les pieds dans une salle de section. Dans quatre ans, deux députés vous le prendront et vous le laisserez partir.",
                  "en": "Thirty-two thousand euros a year for somebody who has never set foot in a branch meeting. In four years two MPs will poach him and you will let him go." } },
    { "label": { "fr": "Lui apprendre le métier plutôt que l'inverse", "en": "Teach him the trade instead of the reverse" },
      "when": { "personality": ["principled", "hardworking"] },
      "effects": { "reseau": 2, "reputation": 2, "notoriete": 1, "energie": -2 },
      "result": { "fr": "Vous l'emmenez en réunion publique et en porte-à-porte pendant six mois. Il tient toujours vos comptes, et il sait maintenant à quoi ressemblent les gens dont il parle.",
                  "en": "You take him to public meetings and canvassing for six months. He still runs your accounts, and he now knows what the people he writes about look like." } }
  ]
},


{
  "id": "boucle_whatsapp",
  "weight": 4,
  "when": { "minTurn": 5 },
  "tag": { "fr": "La capture", "en": "The screenshot" },
  "text": {
    "fr": "Une capture d'écran de la boucle privée du groupe circule chez les journalistes. On y lit ce que vous pensez vraiment de deux collègues, écrit à onze heures du soir, avec la ponctuation de quelqu'un qui ne se relit pas.",
    "en": "A screenshot from the group's private chat is circulating among reporters. It shows what you really think of two colleagues, written at eleven at night, with the punctuation of somebody who does not reread."
  },
  "choices": [
    { "label": { "fr": "Assumer mot pour mot", "en": "Own it word for word" },
      "effects": { "popularity": 6, "standing": -9, "reputation": 1, "credibilite": 1 },
      "result": { "fr": "Vous confirmez tout et vous n'ajoutez rien. Le pays trouve cela reposant, les deux collègues ne vous adresseront plus la parole, et l'un des deux vous sera utile dans six ans.",
                  "en": "You confirm all of it and add nothing. The country finds it restful, the two colleagues will never speak to you again, and one of them will be useful to you in six years." } },
    { "label": { "fr": "Parler de méthode et pas de contenu", "en": "Talk about methods, not content" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.35 }, "dice": 16 },
      "success": { "effects": { "standing": 4, "credibilite": 1, "popularity": -2 },
        "result": { "fr": "Vous passez douze minutes à parler de la violation d'une conversation privée sans jamais dire si elle était exacte. Personne n'est dupe et tout le monde s'en contente.",
                    "en": "You spend twelve minutes on the violation of a private conversation without ever saying whether it was accurate. Nobody is fooled and everybody settles for it." } },
      "failure": { "effects": { "popularity": -7, "standing": -6, "credibilite": -2 },
        "result": { "fr": "On vous demande quatre fois si c'est vrai et vous répondez quatre fois autre chose. La quatrième fois se suffit à elle-même.",
                    "en": "You are asked four times whether it is true and four times you answer something else. The fourth time speaks for itself." } } },
    { "label": { "fr": "Trouver qui a fait la capture", "en": "Find out who took the screenshot" },
      "when": { "stat": { "reseau": { "min": 9 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 6, "reputation": -1 },
        "result": { "fr": "Trois jours et vous avez le nom. Vous ne le direz jamais, et cette personne le saura à la façon dont vous la saluerez désormais.",
                    "en": "Three days and you have the name. You will never say it, and that person will know from the way you greet them from now on." } },
      "failure": { "effects": { "reseau": -2, "standing": -5, "strike": "traitre" },
        "result": { "fr": "Vous cherchez, cela se voit, et le groupe apprend que vous enquêtez sur lui. Une boucle privée ne pardonne pas qu'on la soupçonne.",
                    "en": "You look, it shows, and the group learns you are investigating it. A private chat does not forgive being suspected." } } },
    { "label": { "fr": "Quitter toutes les boucles, définitivement", "en": "Leave every group chat, for good" },
      "effects": { "reseau": -3, "sangfroid": 2, "reputation": 2, "standing": -2 },
      "result": { "fr": "Vous sortez de onze conversations le même soir. Vous perdez la moitié de ce que vous saviez avant les autres, et vous ne serez plus jamais capturé.",
                  "en": "You leave eleven conversations the same evening. You lose half of what you used to know before everybody else, and you will never be screenshotted again." } }
  ]
},


{
  "id": "fact_check",
  "weight": 4,
  "when": { "minTurn": 6, "stat": { "notoriete": { "min": 4 } } },
  "tag": { "fr": "Vérification", "en": "Fact check" },
  "text": {
    "fr": "Une cellule de vérification classe votre chiffre en « trompeur ». Le chiffre vient d'un rapport public, il est exact, et l'usage que vous en faites ne l'est pas tout à fait. L'article fait quatre mille signes et le titre en fait sept.",
    "en": "A fact-checking desk rates your figure “misleading”. The figure comes from a public report, it is accurate, and the use you make of it is not quite. The article runs four thousand characters and the headline seven words."
  },
  "choices": [
    { "label": { "fr": "Corriger publiquement et passer à autre chose", "en": "Correct it publicly and move on" },
      "effects": { "credibilite": 2, "reputation": 2, "popularity": -2, "standing": -2 },
      "result": { "fr": "Une phrase de rectification que trois cents personnes liront. Vous ne referez pas cette erreur, ce qui vous distingue de la plupart de vos collègues.",
                  "en": "One sentence of correction that three hundred people will read. You will not make that mistake again, which sets you apart from most of your colleagues." } },
    { "label": { "fr": "Attaquer la cellule de vérification", "en": "Attack the fact-checkers" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "notoriete": 2, "credibilite": -2, "standing": 3 },
        "result": { "fr": "Vous demandez qui vérifie les vérificateurs et le public trouve la question excellente. Elle l'est, et elle ne répond toujours pas à celle qu'on vous posait.",
                    "en": "You ask who fact-checks the fact-checkers and the public finds it an excellent question. It is, and it still does not answer the one you were asked." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -3, "reputation": -2 },
        "result": { "fr": "La cellule republie l'article avec vos réponses en annexe. C'est la seule façon de perdre deux fois le même débat.",
                    "en": "The desk republishes the piece with your replies in an appendix. It is the only way to lose the same argument twice." } } },
    { "label": { "fr": "Republier le chiffre en le sourçant ligne à ligne", "en": "Repost the figure, sourced line by line" },
      "when": { "background": ["academia", "journalism", "civil"] },
      "effects": { "credibilite": 3, "reputation": 1, "notoriete": 1, "popularity": 1, "energie": -1 },
      "result": { "fr": "Page, tableau, note de bas de page. La cellule ajoute une mise à jour et vous êtes le premier de l'année à obtenir ça.",
                  "en": "Page, table, footnote. The desk adds an update and you are the first this year to get one." } }
  ]
},


{
  "id": "meute",
  "weight": 4,
  "when": { "minTurn": 4, "stat": { "notoriete": { "min": 3 } } },
  "tag": { "fr": "La meute", "en": "The pile-on" },
  "text": {
    "fr": "Vous avez parlé quarante minutes hier soir sur un plateau. Il en reste dix secondes ce matin, coupées juste avant la phrase qui les expliquait. Onze mille messages ont déjà décidé de ce que vous vouliez dire.",
    "en": "You spoke for forty minutes in a studio last night. Ten seconds of it are left this morning, cut just before the sentence that explained them. Eleven thousand messages have already decided what you meant."
  },
  "choices": [
    { "label": { "fr": "Publier la vidéo entière et se taire", "en": "Post the full video and say nothing" },
      "effects": { "credibilite": 2, "reputation": 1, "popularity": -1, "energie": 1 },
      "result": { "fr": "Les quarante minutes en ligne, phrase d'explication comprise, que quatre cents personnes regarderont. La meute passe à autre chose dans la nuit, comme toujours, et vous n'avez rien retiré.",
                  "en": "All forty minutes online, explaining sentence included, watched by four hundred people. The pile-on moves on overnight, as it always does, and you retracted nothing." } },
    { "label": { "fr": "S'excuser pour couper court", "en": "Apologise to end it" },
      "effects": { "popularity": -4, "standing": -5, "reputation": -1, "energie": 2 },
      "result": { "fr": "Vous vous excusez d'une phrase que vous pensiez, et la meute en conclut qu'elle avait raison. Ce sera plus rapide la prochaine fois.",
                  "en": "You apologise for a sentence you meant, and the pile-on concludes it was right. It will be quicker next time." } },
    { "label": { "fr": "Répéter la phrase, sans en retirer un mot", "en": "Say it again, without taking back a word" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "notoriete": 4, "standing": -4, "reputation": -1,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "Vous la répétez plus lentement, en regardant la caméra, et vous ajoutez la phrase qu'on avait coupée. Vous venez de choisir vos ennemis pour dix ans, et ils vous serviront de public.",
                    "en": "You say it again more slowly, looking at the camera, and you add the sentence they cut. You have just chosen your enemies for ten years, and they will serve as your audience." } },
      "failure": { "effects": { "popularity": -11, "standing": -7, "reputation": -2, "strike": "radical" },
        "result": { "fr": "Le deuxième message est pire que le premier et c'est celui-là qui restera. On ne double pas la mise à onze heures du soir.",
                    "en": "The second message is worse than the first and that is the one that will last. You do not double down at eleven at night." } } },
    { "label": { "fr": "Ne rien faire du tout et partir en week-end", "en": "Do nothing at all and go away for the weekend" },
      "when": { "trait": ["teflon"] },
      "effects": { "energie": 3, "popularity": 2, "sangfroid": 1, "notoriete": 1 },
      "result": { "fr": "Vous coupez le téléphone jusqu'à lundi. À votre retour, la meute est passée à quelqu'un d'autre et deux journalistes écrivent que vous avez bien géré.",
                  "en": "You switch the phone off until Monday. By the time you are back the pile-on has moved to somebody else and two reporters write that you handled it well." } },
    { "label": { "fr": "Appeler l'un des onze mille et l'écouter", "en": "Call one of the eleven thousand and listen" },
      "when": { "personality": ["charming", "principled"] },
      "effects": { "popularity": 5, "reputation": 3, "notoriete": 2, "energie": -1 },
      "result": { "fr": "Vingt minutes au téléphone avec quelqu'un qui ne s'y attendait pas et qui le raconte. C'est la seule chose qui marche et c'est la seule qui ne passe pas à l'échelle.",
                  "en": "Twenty minutes on the phone with somebody who was not expecting it and who tells the story. It is the only thing that works and the only thing that does not scale." } }
  ]
},


{
  "id": "ia_contenu",
  "weight": 3,
  "when": { "minTurn": 6 },
  "tag": { "fr": "La machine", "en": "The machine" },
  "text": {
    "fr": "Votre équipe vous montre ce qu'elle a produit en une soirée : douze visuels, quatre discours de circonstance et une lettre de condoléances, tous écrits par une machine et tous parfaitement corrects. Personne ne saura jamais faire la différence.",
    "en": "Your team shows you what it produced in one evening: twelve graphics, four occasional speeches and a letter of condolence, all written by a machine and all perfectly correct. Nobody will ever be able to tell the difference."
  },
  "choices": [
    { "label": { "fr": "Tout utiliser, et gagner le temps", "en": "Use all of it, and save the time" },
      "effects": { "energie": 3, "notoriete": 1, "credibilite": -2, "reputation": -1 },
      "result": { "fr": "Vous récupérez neuf heures par semaine. Six mois plus tard, une lettre de condoléances part avec le nom du défunt mal orthographié, et la famille le fait savoir.",
                  "en": "You get nine hours a week back. Six months later a letter of condolence goes out with the deceased's name misspelled, and the family says so publicly." } },
    { "label": { "fr": "Les visuels oui, les mots non", "en": "The graphics yes, the words no" },
      "effects": { "energie": 1, "credibilite": 1, "notoriete": 1 },
      "result": { "fr": "La ligne est arbitraire et vous la tenez. Ce que vous signez, vous l'avez écrit, et cela finira par se voir dans un débat où l'on vous citera vos propres phrases.",
                  "en": "The line is arbitrary and you hold it. What you sign, you wrote, and it will show one day in a debate where your own sentences are quoted back at you." } },
    { "label": { "fr": "Refuser en bloc et le dire publiquement", "en": "Refuse it all and say so publicly" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "reputation": 3, "popularity": 4, "energie": -2 },
        "result": { "fr": "Vous en faites une position politique et elle tient, parce qu'elle est vérifiable : on peut vous demander vos brouillons. Trois collègues vous imitent et deux abandonnent.",
                    "en": "You turn it into a political position and it holds, because it is checkable: anyone can ask for your drafts. Three colleagues copy you and two give up." } },
      "failure": { "effects": { "credibilite": -1, "popularity": -3, "energie": -3 },
        "result": { "fr": "On retrouve un communiqué de votre équipe, généré, publié le mois dernier sous votre nom. La position était bonne et vous ne pouviez pas la tenir.",
                    "en": "A statement from your own team turns up, generated, published last month under your name. The position was right and you were not able to hold it." } } },
    { "label": { "fr": "L'utiliser pour analyser, jamais pour écrire", "en": "Use it to analyse, never to write" },
      "when": { "stat": { "credibilite": { "min": 11 } } },
      "effects": { "credibilite": 2, "reseau": 1, "energie": 2, "notoriete": 1 },
      "result": { "fr": "Quarante mille amendements dépouillés en une nuit, trois incohérences trouvées dans un texte que personne n'avait lu en entier. Vous êtes le seul en séance à savoir de quoi vous parlez.",
                  "en": "Forty thousand amendments processed overnight, three inconsistencies found in a bill nobody had read in full. You are the only person in the chamber who knows what is in it." } }
  ]
},


{
  "id": "podcast_long",
  "once": true,
  "weight": 3,
  "when": { "minTurn": 8, "stat": { "notoriete": { "min": 5 } } },
  "tag": { "fr": "Trois heures", "en": "Three hours" },
  "text": {
    "fr": "Un podcast vous propose trois heures d'entretien, sans montage, avec quelqu'un qui ne fait pas de politique et qui posera les questions que les journalistes politiques ne posent plus. Son audience est plus jeune que tous vos meetings réunis.",
    "en": "A podcast offers you three hours of interview, unedited, with somebody who does not do politics and who will ask the questions political reporters have stopped asking. Their audience is younger than all your rallies combined."
  },
  "choices": [
    { "label": { "fr": "Y aller sans notes et sans conseiller", "en": "Go with no notes and no adviser" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "notoriete": 4, "credibilite": 1, "energie": -2 },
        "result": { "fr": "Trois heures où l'on vous voit réfléchir, hésiter et rire. Neuf cent mille écoutes, et une génération qui découvre que vous êtes quelqu'un.",
                    "en": "Three hours in which you are seen thinking, hesitating and laughing. Nine hundred thousand listens, and a generation discovering you are a person." } },
      "failure": { "effects": { "popularity": -8, "credibilite": -2, "notoriete": 2, "energie": -2 },
        "result": { "fr": "Trois heures, c'est très long. Vers la cent-dixième minute, vous dites quelque chose que vous n'auriez jamais dit ailleurs, et l'extrait vit sa vie.",
                    "en": "Three hours is very long. Around minute one hundred and ten you say something you would never have said anywhere else, and the clip takes on a life of its own." } } },
    { "label": { "fr": "Y aller préparé, avec les éléments de langage", "en": "Go prepared, with the talking points" },
      "effects": { "notoriete": 2, "popularity": -2, "credibilite": -1, "standing": 2 },
      "result": { "fr": "L'animateur comprend au bout de quarante minutes qu'il n'aura rien, et il le dit à l'antenne. Les commentaires sont plus durs que l'entretien.",
                  "en": "The host works out after forty minutes that he will get nothing, and says so on air. The comments are harsher than the interview." } },
    { "label": { "fr": "Refuser : ce n'est pas un lieu politique", "en": "Refuse: it is not a political venue" },
      "effects": { "standing": 3, "credibilite": 1, "notoriete": -2, "popularity": -3 },
      "result": { "fr": "Vous déclinez poliment. Deux ans plus tard, le même podcast reçoit celui qui vous battra à la primaire, et vous vous souviendrez de ce refus.",
                  "en": "You politely decline. Two years later the same podcast hosts the person who will beat you in the primary, and you will remember saying no." } },
    { "label": { "fr": "Y aller et parler de tout sauf de politique", "en": "Go, and talk about anything but politics" },
      "when": { "trait": ["orateur"] },
      "effects": { "popularity": 13, "notoriete": 5, "credibilite": -1, "standing": -4, "energie": -2 },
      "result": { "fr": "Votre enfance, deux deuils, un livre et une passion que personne ne vous connaissait. Il n'est pas question de politique une seule fois et c'est la meilleure chose que vous ayez faite pour la vôtre.",
                  "en": "Your childhood, two bereavements, a book and an enthusiasm nobody knew you had. Politics does not come up once and it is the best thing you have ever done for yours." } }
  ]
},


{
  "id": "euro_rapporteur",
  "once": true,
  "weight": 6,
  "when": { "position": ["euro"], "minTurn": 6, "notTrait": ["connexions_internationales"] },
  "tag": { "fr": "Le rapport", "en": "The report" },
  "text": {
    "fr": "On vous propose d'être rapporteur sur un texte technique dont personne ne parlera jamais chez vous. Cela veut dire dix-huit mois de négociation avec vingt-six délégations, et un nom qui circulera dans des ministères que vous ne connaissez pas.",
    "en": "You are offered the rapporteurship on a technical file nobody at home will ever mention. That means eighteen months of negotiation with twenty-six delegations, and a name circulating in ministries you have never heard of."
  },
  "choices": [
    { "label": { "fr": "Prendre le rapport et le faire sérieusement", "en": "Take the report and do it properly" },
      "effects": { "trait": "connexions_internationales", "credibilite": 2, "energie": -3, "popularity": -2 },
      "result": { "fr": "Dix-huit mois, quatre cents amendements et un compromis qui tient. Personne dans votre circonscription n'en entendra parler, et trois gouvernements sauront désormais qui vous êtes.",
                  "en": "Eighteen months, four hundred amendments and a compromise that holds. Nobody in your constituency will hear about it, and three governments will now know who you are." } },
    { "label": { "fr": "Refuser et rester visible à la maison", "en": "Turn it down and stay visible at home" },
      "effects": { "popularity": 4, "energie": 2, "credibilite": -1 },
      "result": { "fr": "Vous passez ces dix-huit mois dans vos marchés plutôt que dans des salles de réunion. C'est le calcul que font presque tous vos collègues, et il n'est pas idiot.",
                  "en": "You spend those eighteen months in your own markets rather than in meeting rooms. It is the calculation almost all your colleagues make, and it is not a stupid one." } },
    { "label": { "fr": "Le prendre, et le négocier en anglais dans les couloirs", "en": "Take it, and negotiate it in English in the corridors" },
      "when": { "trait": ["anglais_parfait"] },
      "effects": { "trait": "connexions_internationales", "credibilite": 3, "reseau": 3, "notoriete": 1, "energie": -3 },
      "result": { "fr": "Les compromis ne se font pas en séance, ils se font debout entre deux portes, et vous êtes l'un des rares à pouvoir y être. Le texte sort avec deux de vos idées dedans.",
                  "en": "Compromises are not made in session, they are made standing between two doors, and you are one of the few who can be there. The text comes out with two of your ideas in it." } },
    { "label": { "fr": "Le prendre et le déléguer à vos assistants", "en": "Take it and hand it to your assistants" },
      "when": { "stat": { "reseau": { "min": 10 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "trait": "connexions_internationales", "energie": 1, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "Deux assistants brillants font le travail et vous signez. C'est ainsi que fonctionne la moitié du Parlement, et les délégations retiennent quand même votre nom.",
                    "en": "Two brilliant assistants do the work and you sign it. This is how half the Parliament functions, and the delegations remember your name anyway." } },
      "failure": { "effects": { "credibilite": -3, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Une audition où l'on vous interroge sur votre propre rapport, et huit secondes de silence. La vidéo sort du Parlement européen, ce qui n'arrive jamais.",
                    "en": "A hearing where you are questioned on your own report, and eight seconds of silence. The video escapes the European Parliament, which never happens." } } }
  ]
},


{
  "id": "ministre_conseil",
  "once": true,
  "weight": 7,
  "when": { "position": ["ministre", "premier"], "minTurn": 10, "notTrait": ["connexions_internationales"] },
  "tag": { "fr": "Le Conseil", "en": "The Council" },
  "text": {
    "fr": "Conseil des ministres européens, deux heures du matin, dix-neuvième heure de négociation. Il reste trois pays à convaincre et deux d'entre eux attendent de voir qui cédera le premier. Votre administration vous a préparé une position et vous êtes seul dans la salle.",
    "en": "European Council of ministers, two in the morning, nineteenth hour of negotiation. Three countries remain to be won over and two of them are waiting to see who blinks first. Your civil servants prepared a position and you are alone in the room."
  },
  "choices": [
    { "label": { "fr": "Tenir la position française jusqu'au bout", "en": "Hold the French position to the end" },
      "effects": { "credibilite": 2, "standing": 5, "energie": -3, "popularity": 3 },
      "result": { "fr": "Vous ne cédez rien et le Conseil se sépare sans accord à six heures. Chez vous on appelle cela de la fermeté, et vous ne serez invité à aucun dîner pendant deux ans.",
                  "en": "You concede nothing and the Council breaks up without agreement at six. At home they call it firmness, and you will not be invited to dinner for two years." } },
    { "label": { "fr": "Construire un compromis avec les deux qui hésitent", "en": "Build a compromise with the two who are hesitating" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.4 },
                "bonus": [ { "when": { "trait": ["anglais_parfait"] }, "value": 4 },
                           { "when": { "trait": ["anglais_mediocre"] }, "value": -4 } ], "dice": 16 },
      "success": { "effects": { "trait": "connexions_internationales", "credibilite": 3, "reseau": 2, "energie": -3 },
        "result": { "fr": "Quarante minutes dans un couloir avec deux homologues et un texte réécrit à la main. L'accord passe à sept heures et trois capitales savent désormais qu'on peut travailler avec vous.",
                    "en": "Forty minutes in a corridor with two counterparts and a text rewritten by hand. The deal passes at seven and three capitals now know you can be worked with." } },
      "failure": { "effects": { "credibilite": -2, "standing": -6, "popularity": -4, "energie": -3 },
        "result": { "fr": "Le compromis que vous rapportez ne satisfait personne, et surtout pas votre propre majorité. On vous expliquera pendant six mois que vous avez cédé.",
                    "en": "The compromise you bring home satisfies nobody, least of all your own majority. You will be told for six months that you caved." } } },
    { "label": { "fr": "Appeler l'Élysée et attendre l'arbitrage", "en": "Call the presidency and wait for a decision" },
      "effects": { "standing": 4, "credibilite": -2, "energie": 1, "reputation": -1 },
      "result": { "fr": "Vous réveillez un conseiller à trois heures du matin et vous appliquez ce qu'on vous dit. C'est ce qu'on attend d'un ministre, et c'est ce qui fait qu'on n'en devient jamais autre chose.",
                  "en": "You wake an adviser at three in the morning and do as you are told. It is what is expected of a minister, and it is what stops one ever becoming anything else." } },
    { "label": { "fr": "Faire jouer ce que vous avez négocié dans le privé", "en": "Use what you negotiated in the private sector" },
      "when": { "background": ["business", "civil"] },
      "effects": { "trait": "connexions_internationales", "credibilite": 2, "reseau": 3, "standing": -3, "energie": -2 },
      "result": { "fr": "Vous reconnaissez la méthode parce que vous l'avez pratiquée ailleurs, avec des enjeux plus petits et les mêmes gens. L'accord se fait, et votre administration ne vous le pardonne pas tout à fait.",
                  "en": "You recognise the method because you have used it elsewhere, with smaller stakes and the same people. The deal is done, and your own officials never quite forgive you." } }
  ]
},


{
  "id": "argent_campagne_perso",
  "weight": 4,
  "when": { "position": ["conseiller", "maire", "depute", "euro", "chef"], "minTurn": 10, "minMoney": 120000 },
  "tag": { "fr": "Sur vos deniers", "en": "Out of your own pocket" },
  "text": {
    "fr": "Le parti finance la campagne au minimum légal et vous savez ce que cela vaut : deux permanences, une affiche et personne pour tenir le terrain. Votre directeur de campagne vous a préparé trois budgets et attend que vous en désigniez un.",
    "en": "The party is funding the campaign at the legal minimum and you know what that buys: two offices, one poster and nobody to work the ground. Your campaign manager has drawn up three budgets and is waiting for you to point at one."
  },
  "choices": [
    { "label": { "fr": "Le budget du parti, et rien de plus", "en": "The party budget, and nothing more" },
      "effects": { "standing": 2, "energie": 1 },
      "result": { "fr": "Vous faites la campagne qu'on vous donne. Elle ressemble à celle de tous les autres, ce qui est exactement le problème et exactement ce qu'on attendait de vous.",
                  "en": "You run the campaign you are given. It looks like everybody else's, which is exactly the problem and exactly what was expected of you." } },
    { "label": { "fr": "Ajouter cent cinquante mille de votre poche", "en": "Add a hundred and fifty thousand of your own" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -150000, "popularity": 5, "notoriete": 1, "score": 3 },
      "result": { "fr": "Deux permanences de plus, un attaché de presse et quarante mille tracts. La différence se voit et ne se raconte pas : on ne fait pas campagne sur son propre relevé bancaire.",
                  "en": "Two more offices, a press officer and forty thousand leaflets. The difference shows and cannot be talked about: nobody campaigns on their own bank statement." } },
    { "label": { "fr": "Y mettre cinq cent mille et saturer le terrain", "en": "Put in five hundred thousand and saturate the ground" },
      "when": { "minMoney": 500000 },
      "effects": { "money": -500000, "popularity": 11, "notoriete": 3, "score": 7,
                   "landscape": { "self": 0.5 } },
      "result": { "fr": "Onze salariés, un local par canton, du porte-à-porte payé et une campagne numérique qui ne ressemble à rien de ce qu'on voit ailleurs. Vos adversaires comprennent en trois semaines et n'ont plus le temps.",
                  "en": "Eleven staff, an office per district, paid canvassing and a digital campaign like nothing else around. Your opponents work it out in three weeks and by then it is too late." } },
    { "label": { "fr": "Engager un million et demi, et que cela se sache", "en": "Commit a million and a half, and let it be known" },
      "when": { "minMoney": 1500000 },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "money": -1500000, "popularity": 18, "notoriete": 5, "score": 14,
                                "landscape": { "self": 1.4 } },
        "result": { "fr": "Une campagne qu'aucun parti n'aurait pu payer, assumée en conférence de presse : votre argent, vos idées, aucun donateur à remercier. Le pays trouve cela presque rafraîchissant.",
                    "en": "A campaign no party could have afforded, owned in a press conference: your money, your ideas, no donors to thank. The country finds it almost refreshing." } },
      "failure": { "effects": { "money": -1500000, "popularity": -9, "score": 5, "reputation": -3,
                                "credibilite": -2 },
        "result": { "fr": "La somme sort dans la presse avant votre communiqué. On ne parle plus que d'un candidat qui achète son élection, et l'on en parlera encore dans vingt ans.",
                    "en": "The figure appears in the press before your statement. Nobody talks about anything but a candidate buying an election, and they will still be talking about it in twenty years." } } },
    { "label": { "fr": "Faire financer par des amis qui comprendront", "en": "Have it funded by friends who will understand" },
      "when": { "background": ["business"], "notTrait": ["intouchable"] },
      "effects": { "score": 6, "standing": 3, "flags": { "dirtyMoney": true }, "strike": "casserole" },
      "result": { "fr": "Quatre virements de personnes morales différentes, tous en dessous du plafond, tous du même immeuble. C'est légal si personne ne regarde les adresses.",
                  "en": "Four transfers from four different companies, all under the cap, all from the same building. It is legal as long as nobody checks the addresses." } }
  ]
},


{
  "id": "argent_fondation",
  "once": true,
  "weight": 3,
  "when": { "position": ["depute", "euro", "maire", "ministre", "chef"], "minTurn": 16, "minMoney": 300000 },
  "tag": { "fr": "La fondation", "en": "The foundation" },
  "text": {
    "fr": "Pour exister entre deux campagnes, il faut un lieu qui produise des idées à votre nom. Un club, un institut, une fondation : trois mots pour la même chose, et trois budgets très différents.",
    "en": "To exist between campaigns, you need somewhere that produces ideas under your name. A club, an institute, a foundation: three words for the same thing, and three very different budgets."
  },
  "choices": [
    { "label": { "fr": "Un club de réflexion, deux dîners par an", "en": "A discussion club, two dinners a year" },
      "effects": { "money": -60000, "reseau": 2, "credibilite": 1 },
      "result": { "fr": "Quarante personnes deux fois par an dans une salle louée. Cela ne produit rien et cela entretient un carnet d'adresses, ce qui est déjà le principal.",
                  "en": "Forty people twice a year in a hired room. It produces nothing and it maintains an address book, which is already the main thing." } },
    { "label": { "fr": "Un institut avec trois permanents", "en": "An institute with three full-time staff" },
      "when": { "minMoney": 600000 },
      "effects": { "money": -600000, "credibilite": 4, "reseau": 3, "notoriete": 2, "standing": 4 },
      "result": { "fr": "Trois chercheurs, une note tous les deux mois, et votre nom en couverture de travaux que vous n'avez pas écrits mais que vous savez défendre. C'est ainsi qu'on devient quelqu'un de sérieux.",
                  "en": "Three researchers, a paper every two months, and your name on the cover of work you did not write but can defend. This is how one becomes a serious person." } },
    { "label": { "fr": "Une fondation reconnue, avec un vrai budget", "en": "A recognised foundation, properly funded" },
      "when": { "minMoney": 2000000 },
      "effects": { "money": -2000000, "credibilite": 6, "reseau": 5, "notoriete": 4, "standing": 8,
                   "landscape": { "self": 0.8 } },
      "result": { "fr": "Douze salariés, un colloque annuel où tout le monde vient, et une adresse que l'on cite. Dans dix ans, la moitié des cadres de votre camp y sera passée, et ils le sauront.",
                  "en": "Twelve staff, an annual conference everybody attends, and an address people cite. In ten years half the senior figures of your camp will have passed through it, and they will know it." } },
    { "label": { "fr": "Faire porter le budget par des entreprises", "en": "Have companies carry the budget" },
      "when": { "stat": { "reseau": { "min": 11 } } },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "reseau": 4, "standing": 5, "flags": { "dirtyMoney": true } },
        "result": { "fr": "Neuf mécènes, aucun de plus de quinze pour cent du budget, et une fondation qui ne vous coûte rien. Chacun d'eux vous appellera une fois, et une seule, et vous décrocherez.",
                    "en": "Nine donors, none above fifteen per cent of the budget, and a foundation that costs you nothing. Each of them will call you once, exactly once, and you will pick up." } },
      "failure": { "effects": { "reputation": -3, "credibilite": -2, "standing": -5, "strike": "casserole" },
        "result": { "fr": "Deux mécènes se retirent, un troisième parle à un journaliste. La fondation existe six mois et laisse un article qui ressortira à chaque échéance.",
                    "en": "Two donors pull out, a third talks to a reporter. The foundation lasts six months and leaves an article that will resurface at every election." } } },
    { "label": { "fr": "Écrire vous-même, sans structure", "en": "Write it yourself, with no structure" },
      "when": { "background": ["academia", "journalism"] },
      "effects": { "credibilite": 3, "eloquence": 1, "energie": -2, "reseau": -1 },
      "result": { "fr": "Deux cents pages écrites la nuit, sans nègre et sans budget. C'est plus lent, cela ne se délègue pas, et personne ne pourra jamais dire que ce n'est pas de vous.",
                  "en": "Two hundred pages written at night, no ghostwriter and no budget. It is slower, it cannot be delegated, and nobody will ever be able to say it is not yours." } }
  ]
},


{
  "id": "argent_pari",
  "weight": 3,
  "when": { "minMoney": 400000, "minTurn": 12, "notTrait": ["intouchable"] },
  "tag": { "fr": "L'occasion", "en": "The opportunity" },
  "text": {
    "fr": "Un ami d'avant la politique monte une opération et vous propose d'entrer. Ce n'est pas illégal, c'est seulement le genre de chose qu'on ne peut pas expliquer en trente secondes sur un plateau. Il faut répondre avant vendredi.",
    "en": "A friend from before politics is putting together a deal and offers you a place in it. It is not illegal, it is simply the kind of thing you cannot explain in thirty seconds on television. He needs an answer by Friday."
  },
  "choices": [
    { "label": { "fr": "Ne pas y toucher", "en": "Stay out of it" },
      "effects": { "reputation": 1, "sangfroid": 1 },
      "result": { "fr": "Vous dites non en deux phrases et vous n'y repensez plus. Dans quatre ans, il aura doublé sa mise ou il sera en examen, et dans les deux cas vous aurez eu raison.",
                  "en": "You say no in two sentences and never think about it again. In four years he will have doubled his money or be under investigation, and either way you will have been right." } },
    { "label": { "fr": "Engager quatre cent mille", "en": "Put in four hundred thousand" },
      "roll": { "chance": 0.58, "chanceBonus": [ { "when": { "background": ["business"] }, "value": 0.15 },
                                                 { "when": { "stat": { "reseau": { "min": 12 } } }, "value": 0.08 } ] },
      "success": { "effects": { "money": 700000, "reseau": 1 },
        "result": { "fr": "L'opération sort au bon moment et vous rend le double. Personne ne le saura, parce que vous l'avez déclaré exactement comme il fallait.",
                    "en": "The deal lands at the right moment and returns double. Nobody will know, because you declared it exactly as you were supposed to." } },
      "failure": { "effects": { "money": -400000, "sangfroid": -1 },
        "result": { "fr": "Le montage s'effondre en dix-huit mois et vous ne récupérez rien. C'était de l'argent que vous aviez, ce qui est la seule bonne nouvelle de l'affaire.",
                    "en": "The structure collapses in eighteen months and you get nothing back. It was money you had, which is the only good news in the whole business." } } },
    { "label": { "fr": "Y mettre un million et demi", "en": "Put in a million and a half" },
      "when": { "minMoney": 1500000 },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "background": ["business"] }, "value": 0.15 },
                                                { "when": { "trait": ["clairvoyant"] }, "value": 0.12 } ] },
      "success": { "effects": { "money": 3000000, "reseau": 2, "sangfroid": 1 },
        "result": { "fr": "Trois millions au bout de deux ans. Vous ne serez plus jamais dépendant du calendrier électoral pour vivre, et c'est la seule chose que l'argent achète vraiment en politique.",
                    "en": "Three million after two years. You will never again depend on the electoral calendar to live, and that is the only thing money really buys in politics." } },
      "failure": { "effects": { "money": -1500000, "sangfroid": -2, "reputation": -1, "chain": "fisc" },
        "result": { "fr": "Tout part, et le liquidateur écrit à l'administration fiscale qui écrit à tous les associés. Vous allez passer deux ans à expliquer une opération à laquelle vous n'avez rien compris.",
                    "en": "It all goes, and the liquidator writes to the tax office which writes to every partner. You are going to spend two years explaining a deal you never understood." } } },
    { "label": { "fr": "Entrer, mais au nom de quelqu'un d'autre", "en": "Go in, but under somebody else's name" },
      "when": { "personality": ["calculating"], "notTrait": ["casserole"] },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "money": 600000, "reputation": -1 },
        "result": { "fr": "Une société de votre beau-frère, une convention de portage, et six cent mille euros qui n'apparaissent nulle part à votre nom. Cela tiendra tant qu'il vivra.",
                    "en": "Your brother-in-law's company, a nominee agreement, and six hundred thousand euros that appear nowhere under your name. It will hold as long as he lives." } },
      "failure": { "effects": { "money": -400000, "reputation": -3, "flags": { "investigated": true }, "strike": "casserole" },
        "result": { "fr": "Le portage se voit dès la première déclaration. Ce n'est pas l'argent qui pose problème, c'est d'avoir voulu qu'il ne se voie pas.",
                    "en": "The nominee structure shows up in the very first filing. It is not the money that is the problem, it is having wanted it not to show." } } }
  ]
},


{
  "id": "argent_defense",
  "weight": 5,
  "when": { "flag": { "investigated": true }, "minMoney": 200000 },
  "tag": { "fr": "Les honoraires", "en": "The fees" },
  "text": {
    "fr": "Le cabinet qui vous défend vous remet trois propositions d'honoraires. Elles ne diffèrent pas par la compétence, elles diffèrent par le nombre de gens qui travailleront sur votre dossier et par le temps qu'ils y passeront.",
    "en": "The firm defending you hands over three fee proposals. They do not differ in competence, they differ in how many people will work on your file and how long they will spend on it."
  },
  "choices": [
    { "label": { "fr": "Le forfait, deux cent mille", "en": "The standard package, two hundred thousand" },
      "effects": { "money": -200000, "sangfroid": 1 },
      "result": { "fr": "Un associé, un collaborateur, et les délais légaux. C'est une défense correcte, c'est-à-dire celle que reçoit tout le monde.",
                  "en": "One partner, one associate, and the statutory deadlines. It is a proper defence, which is to say the one everybody gets." } },
    { "label": { "fr": "Huit cent mille, et l'équipe complète", "en": "Eight hundred thousand, and the full team" },
      "when": { "minMoney": 800000 },
      "effects": { "money": -800000, "flags": { "investigated": false }, "reputation": 1, "sangfroid": 2 },
      "result": { "fr": "Six avocats, deux mois de travail sur la seule procédure, et un vice de forme trouvé à la page quatre cents. Le dossier est classé et vous savez très exactement ce que cela a coûté.",
                  "en": "Six lawyers, two months of work on procedure alone, and a technical flaw found on page four hundred. The case is dropped and you know exactly what that cost." } },
    { "label": { "fr": "Ne rien payer et se défendre seul", "en": "Pay nothing and defend yourself" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "credibilite": 0.4 },
                "bonus": [ { "when": { "background": ["law"] }, "value": 6 } ], "dice": 16 },
      "success": { "effects": { "flags": { "investigated": false }, "popularity": 7, "credibilite": 2, "reputation": 2 },
        "result": { "fr": "Vous plaidez vous-même, sans robe, pendant quarante minutes. C'est irrégulier, c'est risqué, et la salle vous écoute jusqu'au bout.",
                    "en": "You argue it yourself, without a gown, for forty minutes. It is irregular, it is risky, and the room listens to the end." } },
      "failure": { "effects": { "popularity": -8, "reputation": -2, "flags": { "onTrial": true } },
        "result": { "fr": "On ne s'improvise pas pénaliste, et le président du tribunal vous le fait comprendre en huit minutes. Le dossier part au fond.",
                    "en": "Nobody improvises criminal defence, and the presiding judge makes that clear in eight minutes. The case goes to full trial." } } },
    { "label": { "fr": "Appeler le cabinet qui vous doit tout", "en": "Call the firm that owes you everything" },
      "when": { "background": ["law"], "stat": { "reseau": { "min": 10 } } },
      "effects": { "money": -80000, "flags": { "investigated": false }, "reseau": -2, "reputation": -1 },
      "result": { "fr": "Votre ancien cabinet prend le dossier au tarif de complaisance. Vous économisez sept cent mille euros et vous perdez le dernier endroit où l'on vous devait quelque chose.",
                  "en": "Your old firm takes the file at a courtesy rate. You save seven hundred thousand euros and lose the last place where anybody owed you anything." } }
  ]
},


{
  "id": "has_been_plateau",
  "once": true,
  "weight": 4,
  "when": { "belowPeak": true, "minAge": 56, "minTurn": 24 },
  "tag": { "fr": "L'invitation", "en": "The invitation" },
  "text": {
    "fr": "Une chaîne d'info vous propose une chronique hebdomadaire : commenter l'actualité politique, sur le plateau, chaque mardi. On vous présentera par la plus haute fonction que vous ayez occupée.",
    "en": "A news channel offers you a weekly slot: commenting on politics, in the studio, every Tuesday. You will be introduced by the highest office you ever held."
  },
  "choices": [
    { "label": { "fr": "Accepter : c'est encore de la politique", "en": "Accept: it is still politics" },
      "effects": { "trait": "has_been", "money": 60000, "notoriete": 2, "energie": 1 },
      "result": { "fr": "Trois mille euros par mardi pour dire ce que vous auriez fait. Au bout de six mois, on ne vous demande plus jamais ce que vous ferez.",
                  "en": "Three thousand euros a Tuesday to say what you would have done. After six months, nobody ever asks what you will do again." } },
    { "label": { "fr": "Refuser et repartir sur le terrain", "en": "Turn it down and go back to the ground" },
      "effects": { "standing": 5, "energie": -3, "popularity": 2, "credibilite": 1 },
      "result": { "fr": "Vous reprenez les réunions de section à quarante personnes, à cinquante-huit ans, sans caméra. C'est la décision la plus dure et la seule qui laisse une suite.",
                  "en": "You go back to branch meetings of forty people, at fifty-eight, with no cameras. It is the hardest decision and the only one that leaves a future." } },
    { "label": { "fr": "Négocier une chronique sur vos dossiers, pas sur les autres", "en": "Negotiate a slot on your own subjects, not on other people" },
      "when": { "stat": { "credibilite": { "min": 12 } } },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "credibilite": 2, "notoriete": 2, "money": 40000, "popularity": 3 },
        "result": { "fr": "Vous obtenez de ne parler que de ce que vous connaissez. C'est plus austère, c'est moins payé, et personne ne dit de vous que vous commentez.",
                    "en": "You get to speak only about what you know. It is drier, it pays less, and nobody says you are a pundit." } },
      "failure": { "effects": { "trait": "has_been", "money": 55000, "notoriete": 1, "credibilite": -1 },
        "result": { "fr": "La chaîne accepte, puis l'antenne fait ce qu'elle veut. Au troisième mardi, on vous interroge sur le divorce d'un ministre.",
                    "en": "The channel agrees, then the studio does as it likes. By the third Tuesday you are being asked about a minister's divorce." } } },
    { "label": { "fr": "Écrire vos mémoires à la place", "en": "Write your memoirs instead" },
      "when": { "background": ["journalism", "academia"] },
      "effects": { "money": 90000, "reputation": 2, "credibilite": 1, "energie": -2, "popularity": -2 },
      "result": { "fr": "Quatre cents pages, onze mille exemplaires et deux comptes réglés. Le livre durera plus longtemps que la chronique et rapportera moins d'invitations.",
                  "en": "Four hundred pages, eleven thousand copies and two scores settled. The book will outlast the slot and bring in fewer invitations." } }
  ]
},


{
  "id": "condamnation_definitive",
  "once": true,
  "weight": 6,
  "when": { "flag": { "onTrial": true } },
  "tag": { "fr": "Le délibéré", "en": "The verdict" },
  "text": {
    "fr": "Le tribunal rend sa décision. Vous êtes condamné, et il vous reste à décider ce que vous faites d'un dossier qui portera votre nom dans tous les moteurs de recherche jusqu'à la fin.",
    "en": "The court delivers its decision. You are convicted, and what remains is to decide what to do with a case that will carry your name in every search engine until the end."
  },
  "choices": [
    { "label": { "fr": "Faire appel et continuer comme si de rien n'était", "en": "Appeal and carry on as if nothing had happened" },
      "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "standing": -4, "sangfroid": 1 },
      "result": { "fr": "L'appel prendra quatre ans et ne changera rien. Vous continuez, et chaque portrait commencera désormais par un paragraphe que vous n'avez pas écrit.",
                  "en": "The appeal will take four years and change nothing. You carry on, and every profile will now open with a paragraph you did not write." } },
    { "label": { "fr": "Reconnaître, s'excuser, et rester", "en": "Admit it, apologise, and stay" },
      "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "reputation": 2, "popularity": 4, "standing": -8 },
      "result": { "fr": "Vous dites que vous avez eu tort, en quatre phrases, sans avocat à côté de vous. Le pays encaisse mieux que l'appareil, comme toujours.",
                  "en": "You say you were wrong, in four sentences, with no lawyer beside you. The country takes it better than the machine does, as always." } },
    { "label": { "fr": "Se retirer de la vie publique le temps de la peine", "en": "Withdraw from public life for the duration" },
      "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "office": "none", "energie": 3, "reputation": 3 },
      "result": { "fr": "Vous rendez tout et vous disparaissez. C'est la seule sortie qui laisse une porte ouverte, et presque personne ne la prend.",
                  "en": "You hand everything back and you vanish. It is the only exit that leaves a door open, and almost nobody takes it." } },
    { "label": { "fr": "Plaider que le dossier était politique", "en": "Argue the case was political" },
      "when": { "party": ["radical_left", "identitarians"] },
      "roll": { "base": 15, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "popularity": 8, "standing": 6, "credibilite": -2 },
        "result": { "fr": "Votre électorat vous croit et vous le dit. La condamnation devient une preuve de plus que le système vous en veut, ce qui est exactement ce qu'il fallait en faire.",
                    "en": "Your voters believe you and say so. The conviction becomes further proof the system is out to get you, which is exactly what it needed to become." } },
      "failure": { "effects": { "trait": "repris_de_justice", "flags": { "onTrial": false }, "popularity": -9, "reputation": -2, "credibilite": -2 },
        "result": { "fr": "L'argument ne prend pas, parce que les faits sont dans le jugement et que le jugement est public. On vous ressortira cette conférence de presse à chaque échéance.",
                    "en": "The argument does not land, because the facts are in the judgment and the judgment is public. That press conference will be replayed at every election." } } }
  ]
},


{
  "id": "poudre_toilettes",
  "once": true,
  "weight": 3,
  "when": { "position": ["depute", "cadre", "ministre", "maire"], "minTurn": 8, "notTrait": ["drogue"] },
  "tag": { "fr": "Deuxième étage", "en": "Second floor" },
  "text": {
    "fr": "Deux heures du matin, session de nuit, quatrième semaine de budget. Un collègue vous fait signe dans les toilettes du deuxième et vous explique, avec la simplicité de l'évidence, comment tout le monde tient.",
    "en": "Two in the morning, night sitting, fourth week of the budget. A colleague waves you into the second-floor toilets and explains, with the simplicity of the obvious, how everybody keeps going."
  },
  "choices": [
    { "label": { "fr": "Essayer, une fois", "en": "Try it, once" },
      "effects": { "trait": "drogue", "energie": 3, "sangfroid": -1 },
      "result": { "fr": "Vous tenez la séance jusqu'à six heures et vous êtes brillant à quatre. Il n'y a jamais qu'une fois, et tout le monde vous l'avait dit.",
                  "en": "You hold the sitting until six and you are brilliant at four. There is never just one time, and everyone told you so." } },
    { "label": { "fr": "Refuser et rentrer dormir", "en": "Say no and go home to sleep" },
      "effects": { "energie": 1, "reputation": 1, "standing": -2 },
      "result": { "fr": "Vous manquez trois votes de nuit et une partie de ce qui s'y décide. C'est le prix, et il est plus bas que l'autre.",
                  "en": "You miss three night votes and part of what gets decided in them. That is the price, and it is lower than the other one." } },
    { "label": { "fr": "Refuser, et prévenir le président de groupe", "en": "Refuse, and warn the group chairman" },
      "when": { "stat": { "reputation": { "min": 12 } } },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 5, "reputation": 2 },
        "result": { "fr": "Le collègue est mis en congé maladie et personne n'a jamais su par qui. Deux personnes vous doivent le silence, ce qui vaut mieux qu'un service.",
                    "en": "The colleague is put on sick leave and nobody ever knew who told. Two people owe you their silence, which is worth more than a favour." } },
      "failure": { "effects": { "standing": -9, "reseau": -2, "strike": "traitre" },
        "result": { "fr": "L'information remonte avec votre nom dessus. Dans un groupe parlementaire, on pardonne la poudre et jamais la dénonciation.",
                    "en": "The information travels back with your name on it. In a parliamentary group, powder is forgiven and informing never is." } } },
    { "label": { "fr": "Refuser, et le raconter en séance", "en": "Refuse, and say it in the chamber" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 3, "popularity": 6, "standing": -14, "reputation": 2 },
      "result": { "fr": "Vous décrivez la scène à la tribune, sans nommer personne. La séance est suspendue, la vidéo tourne pendant huit jours, et plus un député ne vous adresse la parole dans un couloir.",
                  "en": "You describe the scene from the rostrum, naming nobody. The sitting is suspended, the video runs for eight days, and not one member speaks to you in a corridor again." } }
  ]
},


{
  "id": "drogue_controle",
  "weight": 0,
  "tag": { "fr": "Le contrôle", "en": "The check" },
  "text": {
    "fr": "Contrôle routier à trois heures du matin, à la sortie d'un dîner. Le gendarme reconnaît votre nom avant de reconnaître votre visage, et il applique la procédure, exactement comme il doit le faire.",
    "en": "A roadside check at three in the morning, leaving a dinner. The officer recognises your name before your face, and follows the procedure exactly as he should."
  },
  "choices": [
    { "label": { "fr": "Tout reconnaître immédiatement", "en": "Admit everything immediately" },
      "effects": { "popularity": -8, "reputation": -2, "standing": -6, "credibilite": -1 },
      "result": { "fr": "Vous ne discutez pas, vous ne téléphonez à personne, et vous publiez un communiqué à sept heures. C'est ce qu'il fallait faire et cela coûte quand même.",
                  "en": "You do not argue, you call nobody, and you put out a statement at seven. It was the right thing to do and it costs all the same." } },
    { "label": { "fr": "Faire jouer vos relations", "en": "Pull some strings" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": -2, "reputation": -1, "flags": { "investigated": true } },
        "result": { "fr": "Le procès-verbal existe et n'ira nulle part. Trois personnes le savent, et l'une d'elles vous le rappellera au pire moment.",
                    "en": "The report exists and will go nowhere. Three people know, and one of them will remind you at the worst possible moment." } },
      "failure": { "effects": { "popularity": -14, "reputation": -3, "standing": -10, "flags": { "onTrial": true } },
        "result": { "fr": "L'appel de trop, au mauvais numéro, à trois heures du matin. Ce n'est plus l'affaire de la poudre, c'est l'affaire du coup de fil.",
                    "en": "One call too many, to the wrong number, at three in the morning. It is no longer the powder story, it is the phone call story." } } },
    { "label": { "fr": "Se soigner, et le dire", "en": "Get treatment, and say so" },
      "effects": { "untrait": "drogue", "popularity": -3, "reputation": 3, "energie": -2, "credibilite": 1 },
      "result": { "fr": "Six semaines de retrait annoncées en une phrase. Le pays est meilleur que sa réputation sur ces sujets-là, et l'appareil est pire.",
                  "en": "Six weeks away, announced in a single sentence. The country is better than its reputation on these matters, and the machine is worse." } }
  ]
},


{
  "id": "couple_magazine",
  "once": true,
  "weight": 3,
  "when": { "minPopularity": 45, "minTurn": 10, "notTrait": ["couple_people"] },
  "tag": { "fr": "La double page", "en": "The spread" },
  "text": {
    "fr": "Votre compagne est connue pour autre chose que vous, et un magazine propose de vous photographier ensemble, chez vous, en huit pages. L'attaché de presse dit oui avant que vous ayez répondu.",
    "en": "Your partner is famous for something other than you, and a magazine offers to photograph you together, at home, over eight pages. The press officer says yes before you have answered."
  },
  "choices": [
    { "label": { "fr": "Accepter les huit pages", "en": "Take the eight pages" },
      "effects": { "trait": "couple_people", "popularity": 7, "notoriete": 3, "credibilite": -2 },
      "result": { "fr": "Deux cent mille exemplaires et une notoriété qui n'a plus rien à voir avec la politique. On vous reconnaît dans les gares, on ne vous cite plus dans les débats.",
                  "en": "Two hundred thousand copies and a fame that has nothing to do with politics any more. People recognise you in stations; nobody quotes you in debates." } },
    { "label": { "fr": "Refuser, et protéger ce qui reste", "en": "Refuse, and protect what is left" },
      "effects": { "reputation": 2, "credibilite": 1, "popularity": -3 },
      "result": { "fr": "Vous dites non et vous le tenez, y compris quand le magazine sort le papier sans les photos. Personne ne saura jamais que c'était un choix.",
                  "en": "You say no and you hold to it, including when the magazine runs the piece without the photographs. Nobody will ever know it was a choice." } },
    { "label": { "fr": "Accepter, et en faire une séquence politique", "en": "Accept, and turn it into a political sequence" },
      "when": { "background": ["comms", "celebrity"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "trait": "couple_people", "popularity": 10, "notoriete": 3, "standing": 3 },
        "result": { "fr": "Huit pages, dont trois sur ce que vous défendez, obtenues au forceps contre la rédaction. C'est le seul portrait de vacances de l'histoire dont on ait retenu une idée.",
                    "en": "Eight pages, three of them on what you stand for, wrung out of the editors. It is the only holiday spread in history from which anybody remembered an idea." } },
      "failure": { "effects": { "trait": "couple_people", "popularity": 6, "credibilite": -3, "standing": -4 },
        "result": { "fr": "La rédaction garde les photos et coupe les idées. Vous avez donné votre salon et récupéré une légende de trois lignes.",
                    "en": "The editors keep the photographs and cut the ideas. You gave up your living room and got a three-line caption." } } }
  ]
},


{
  "id": "ancrage_permanence",
  "once": true,
  "weight": 3,
  "when": { "position": ["conseiller", "maire", "depute"], "minTurn": 12, "notTrait": ["ancrage_local"] },
  "tag": { "fr": "La permanence", "en": "The surgery" },
  "text": {
    "fr": "Douze ans que vous tenez la même permanence le samedi matin. Un cabinet parisien vous propose de professionnaliser tout ça : un attaché, des créneaux, un logiciel de rendez-vous, et vos samedis pour vous.",
    "en": "Twelve years holding the same Saturday morning surgery. A Paris consultancy offers to professionalise all of it: a staffer, time slots, appointment software, and your Saturdays back."
  },
  "choices": [
    { "label": { "fr": "Continuer à les recevoir vous-même, tous les samedis", "en": "Keep seeing them yourself, every Saturday" },
      "effects": { "trait": "ancrage_local", "energie": -2, "popularity": 4, "reseau": 1 },
      "result": { "fr": "Quatre cents samedis, deux mille dossiers, et trois cantons où l'on vous appelle par votre prénom. Vous ne serez jamais battu chez vous, et vous ne serez jamais autre chose que de chez vous.",
                  "en": "Four hundred Saturdays, two thousand cases, and three districts where they call you by your first name. You will never be beaten at home, and you will never be anything other than of that home." } },
    { "label": { "fr": "Déléguer et récupérer vos samedis", "en": "Delegate and take your Saturdays back" },
      "effects": { "energie": 3, "notoriete": 1, "popularity": -4, "money": -20000 },
      "result": { "fr": "Le logiciel fonctionne très bien et les gens le remarquent tout de suite. Deux ans plus tard, personne dans la ville ne sait plus à quoi vous ressemblez.",
                  "en": "The software works perfectly and people notice immediately. Two years later, nobody in the town remembers what you look like." } },
    { "label": { "fr": "Garder un samedi sur deux, et monter à Paris l'autre", "en": "Keep every other Saturday, and go up to Paris on the rest" },
      "when": { "stat": { "energie": { "min": 12 } } },
      "effects": { "reseau": 2, "notoriete": 1, "energie": -1, "popularity": 1 },
      "result": { "fr": "Le compromis qui coûte deux fois : on vous trouve moins présent ici et pas encore installé là-bas. C'est pourtant celui que prennent tous ceux qui finissent ministres.",
                  "en": "The compromise that costs twice over: you seem less present here and not yet established there. It is nonetheless the one taken by everybody who ends up a minister." } }
  ]
},


{
  "id": "sommet_anglais",
  "once": true,
  "weight": 3,
  "when": { "position": ["euro", "depute", "ministre", "premier", "chef"], "minTurn": 14 },
  "tag": { "fr": "Le sommet", "en": "The summit" },
  "text": {
    "fr": "Conférence de presse commune à Bruxelles, deux cents journalistes, et une question posée en anglais à laquelle il va falloir répondre en anglais. La cabine d'interprétation est là, et l'utiliser se verra.",
    "en": "A joint press conference in Brussels, two hundred reporters, and a question in English that will have to be answered in English. The interpretation booth is there, and using it will be noticed."
  },
  "choices": [
    { "label": { "fr": "Répondre en anglais, sans filet", "en": "Answer in English, without a net" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "eloquence": 0.35 },
                "bonus": [ { "when": { "trait": ["anglais_parfait"] }, "value": 6 },
                           { "when": { "trait": ["anglais_mediocre"] }, "value": -6 },
                           { "when": { "background": ["business", "academia"] }, "value": 2 } ],
                "dice": 16 },
      "success": { "effects": { "trait": "anglais_parfait", "credibilite": 2, "notoriete": 2, "standing": 3 },
        "result": { "fr": "Quatre minutes sans une hésitation, et une formule qui passe dans la presse britannique le soir même. On vous regarde différemment dans les salles où l'on décide.",
                    "en": "Four minutes without a hesitation, and a phrase that runs in the British press that evening. You are looked at differently in the rooms where things are decided." } },
      "failure": { "effects": { "trait": "anglais_mediocre", "credibilite": -1, "notoriete": 2, "popularity": -4 },
        "result": { "fr": "Vingt secondes deviennent un format, un son, une imitation. Le fond de ce que vous disiez était juste et personne ne l'a jamais su.",
                    "en": "Twenty seconds become a format, a soundbite, an impression. What you were actually saying was right and nobody ever found out." } } },
    { "label": { "fr": "Passer par l'interprète, sans s'excuser", "en": "Use the interpreter, without apologising" },
      "effects": { "credibilite": 1, "reputation": 1, "notoriete": -1 },
      "result": { "fr": "Vous répondez en français, longuement, et vous laissez la cabine faire son travail. C'est ce que font les chefs d'État qui n'ont rien à prouver, et personne ne le remarque.",
                  "en": "You answer in French, at length, and let the booth do its job. It is what heads of state with nothing to prove do, and nobody notices." } },
    { "label": { "fr": "Prendre trois mois de cours avant le prochain", "en": "Take three months of lessons before the next one" },
      "when": { "minMoney": 30000 },
      "effects": { "untrait": "anglais_mediocre", "money": -25000, "credibilite": 1, "energie": -2 },
      "result": { "fr": "Deux heures par semaine pendant trois mois, avec un professeur qui ne sait pas qui vous êtes. C'est humiliant, c'est efficace, et cela ne se raconte à personne.",
                  "en": "Two hours a week for three months, with a teacher who has no idea who you are. It is humiliating, it works, and it is told to nobody." } }
  ]
},


{
  "id": "loi_rue",
  "weight": 4,
  "when": { "position": ["depute", "ministre", "premier"], "minTurn": 10 },
  "tag": { "fr": "La rue", "en": "The street" },
  "text": {
    "fr": "Le texte est passé et le pays ne l'a pas accepté. Quatre cent mille personnes défilent le premier samedi, six cent mille le deuxième, et les préfectures annoncent la moitié.",
    "en": "The bill passed and the country has not accepted it. Four hundred thousand march the first Saturday, six hundred thousand the second, and the police count half that."
  },
  "choices": [
    { "label": { "fr": "Défendre le texte, sans reculer d'un mot", "en": "Defend the bill, without conceding a word" },
      "when": { "ruling": true },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "standing": 8, "popularity": -9, "approval": -4 },
        "result": { "fr": "Vous tenez six semaines sans céder et le mouvement s'épuise en novembre. On appellera cela du courage dans dix ans et de l'entêtement d'ici là.",
                    "en": "You hold for six weeks without giving ground and the movement runs out in November. In ten years they will call it courage; until then, stubbornness." } },
      "failure": { "effects": { "credibilite": -2, "standing": -6, "popularity": -14, "approval": -12 },
        "result": { "fr": "Une phrase de trop devant une caméra, un samedi, et c'est vous qu'on met sur les pancartes la semaine suivante. Le texte passera, votre nom restera dessus.",
                    "en": "One sentence too many in front of a camera, on a Saturday, and it is your face on the placards the week after. The bill will pass; your name will stay on it." } } },
    { "label": { "fr": "Défiler avec eux", "en": "March with them" },
      "when": { "ruling": false },
      "effects": { "popularity": 9, "standing": 4, "notoriete": 2, "approval": -6, "energie": -2 },
      "result": { "fr": "Deux heures dans le cortège, sans tribune et sans service d'ordre. Les images valent tous les communiqués de votre groupe depuis six mois.",
                  "en": "Two hours in the march, no platform and no stewards. The pictures are worth every press release your group has issued in six months." } },
    { "label": { "fr": "Proposer une sortie de crise par la négociation", "en": "Offer a negotiated way out" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "credibilite": 3, "reputation": 2, "popularity": 4, "approval": 4 },
        "result": { "fr": "Trois réunions discrètes et un communiqué commun. Le mouvement s'arrête, personne ne vous en félicite, et deux syndicats vous doivent quelque chose.",
                    "en": "Three discreet meetings and a joint statement. The movement stops, nobody congratulates you, and two unions owe you something." } },
      "failure": { "effects": { "reputation": -2, "standing": -5, "popularity": -4, "energie": -1 },
        "result": { "fr": "Les négociations échouent et fuitent. Chaque camp vous accuse d'avoir parlé à l'autre, ce qui est exactement ce que vous avez fait.",
                    "en": "The talks fail and leak. Each side accuses you of talking to the other, which is precisely what you did." } } },
    { "label": { "fr": "Ne rien faire et attendre l'hiver", "en": "Do nothing and wait for winter" },
      "effects": { "energie": 2, "popularity": -4, "sangfroid": 1, "approval": -2 },
      "result": { "fr": "Vous ne dites rien pendant six semaines. Le froid finit toujours par faire ce que les gouvernements n'osent pas faire.",
                  "en": "You say nothing for six weeks. The cold always ends up doing what governments do not dare to." } }
  ]
},


{
  "id": "assemblee_absences",
  "when": { "position": ["depute", "euro"], "minTurn": 8 },
  "tag": { "fr": "Le décompte", "en": "The attendance record" },
  "text": {
    "fr": "Un site publie le décompte des présences en séance. Le vôtre est mauvais, celui de trois de vos collègues est pire, et un journaliste local vous appelle pour vous demander de vous expliquer.",
    "en": "A website publishes the attendance figures for the chamber. Yours are poor, three of your colleagues' are worse, and a local reporter calls to ask you to explain."
  },
  "choices": [
    { "label": { "fr": "Expliquer le vrai travail, celui qui ne se compte pas", "en": "Explain the real work, the kind that is not counted" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 15 },
      "success": { "effects": { "credibilite": 2, "popularity": 3, "reputation": 1 },
        "result": { "fr": "Vous détaillez les commissions, les permanences et les quatre-vingts rendez-vous du mois. C'est vrai, c'est ennuyeux, et le papier sort en votre faveur.",
                    "en": "You set out the committees, the surgeries and the eighty meetings this month. It is true, it is dull, and the piece comes out in your favour." } },
      "failure": { "effects": { "popularity": -7, "reputation": -2, "credibilite": -1 },
        "result": { "fr": "L'explication passe pour une excuse, parce que c'en est une. Le chiffre restera attaché à votre nom jusqu'à la prochaine élection.",
                    "en": "The explanation reads as an excuse, because it is one. The figure will stay attached to your name until the next election." } } },
    { "label": { "fr": "Aller siéger, tous les jours, pendant six mois", "en": "Sit in the chamber, every day, for six months" },
      "effects": { "credibilite": 2, "reputation": 2, "standing": 3, "energie": -4, "popularity": 2 },
      "result": { "fr": "Six mois de banc, y compris les mardis à vingt-trois heures devant quatorze personnes. Votre décompte devient irréprochable et votre circonscription ne vous voit plus.",
                  "en": "Six months on the bench, including Tuesdays at eleven at night in front of fourteen people. Your record becomes spotless and your constituency stops seeing you." } },
    { "label": { "fr": "Sortir le décompte de ceux d'en face", "en": "Publish the other side's figures" },
      "effects": { "notoriete": 2, "popularity": -3, "reputation": -2, "standing": -4, "approval": -2 },
      "result": { "fr": "Vous montrez que trois ministres siègent encore moins. C'est exact, cela ne vous lave de rien, et l'Assemblée entière en sort un peu plus sale.",
                  "en": "You show that three ministers attend even less. It is accurate, it clears you of nothing, and the whole chamber comes out a little dirtier." } }
  ]
},


{
  "id": "assemblee_engueulade",
  "weight": 3,
  "when": { "position": ["depute", "ministre", "premier"], "minTurn": 6 },
  "tag": { "fr": "Séance suspendue", "en": "Sitting suspended" },
  "text": {
    "fr": "Une phrase de trop en séance, des cris des deux côtés, et le président de séance suspend. Dans le couloir, tout le monde a une caméra et personne n'a encore décidé de quoi il aura l'air.",
    "en": "One sentence too many in the chamber, shouting from both sides, and the speaker suspends the sitting. In the corridor everyone has a camera and nobody has yet decided how they want to look."
  },
  "choices": [
    { "label": { "fr": "En remettre une couche devant les caméras", "en": "Double down in front of the cameras" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 8, "standing": 3, "credibilite": -2, "approval": -3 },
        "result": { "fr": "Quarante secondes qui tournent partout jusqu'au dimanche. On ne se souviendra pas du texte, on se souviendra de vous.",
                    "en": "Forty seconds that go everywhere until Sunday. Nobody will remember the bill; they will remember you." } },
      "failure": { "effects": { "popularity": -8, "reputation": -2, "credibilite": -2, "standing": -3 },
        "result": { "fr": "Vous montez d'un ton et vous perdez le fil au milieu. La séquence sert d'exemple dans toutes les écoles de communication pendant deux ans.",
                    "en": "You raise your voice and lose the thread halfway. The clip is used as a teaching example in every communications school for two years." } } },
    { "label": { "fr": "S'excuser tout de suite, publiquement", "en": "Apologise immediately, in public" },
      "effects": { "reputation": 3, "credibilite": 1, "popularity": -2, "standing": -5 },
      "result": { "fr": "Deux phrases à la reprise de séance, sans conditionnel. C'est rare, cela désarme tout le monde, et votre groupe vous en voudra plus que l'autre camp.",
                  "en": "Two sentences when the sitting resumes, with no qualifiers. It is rare, it disarms everybody, and your own group will hold it against you more than the other side did." } },
    { "label": { "fr": "Ne rien dire et laisser dire", "en": "Say nothing and let it run" },
      "effects": { "sangfroid": 1, "energie": 1, "notoriete": 1, "popularity": -1 },
      "result": { "fr": "Vous rentrez dans l'hémicycle sans un mot pour les caméras. L'affaire dure trente heures au lieu de trois jours.",
                  "en": "You walk back into the chamber without a word for the cameras. The story lasts thirty hours instead of three days." } }
  ]
},


{
  "id": "vote_contre_son_camp",
  "weight": 3,
  "when": { "position": ["depute"], "minTurn": 8 },
  "tag": { "fr": "Consigne de vote", "en": "The party whip" },
  "text": {
    "fr": "Le groupe a arrêté sa position et elle est l'inverse de ce que vous avez promis chez vous. Le vote est nominatif, il sera publié, et votre circonscription le lira.",
    "en": "The group has settled its line and it is the opposite of what you promised at home. The vote is recorded, it will be published, and your constituency will read it."
  },
  "choices": [
    { "label": { "fr": "Voter la consigne", "en": "Follow the whip" },
      "effects": { "standing": 7, "popularity": -6, "reputation": -2 },
      "result": { "fr": "Vous levez la main avec les autres. C'est ce qu'on attend d'un député de groupe, et c'est ce que vos électeurs appellent une trahison.",
                  "en": "You raise your hand with the rest. It is what is expected of a group member, and what your voters call a betrayal." } },
    { "label": { "fr": "Voter contre, et l'assumer chez vous", "en": "Vote against, and own it at home" },
      "effects": { "standing": -12, "popularity": 9, "reputation": 3, "credibilite": 1 },
      "result": { "fr": "Une voix contre dans la liste publiée, la vôtre. Le groupe vous le fera payer à chaque investiture, et votre circonscription vous réélira.",
                  "en": "One vote against in the published list, yours. The group will make you pay at every nomination, and your constituency will re-elect you." } },
    { "label": { "fr": "S'absenter ce jour-là", "en": "Be absent that day" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "standing": -2, "popularity": -1, "sangfroid": 1 },
        "result": { "fr": "Un déplacement opportun, une absence qui ne se remarque pas dans la liste. Vous n'avez rien voté et personne ne vous demandera rien.",
                    "en": "A well-timed trip, an absence nobody notices in the list. You voted for nothing and nobody will ask you anything." } },
      "failure": { "effects": { "standing": -6, "popularity": -7, "reputation": -2 },
        "result": { "fr": "Votre absence est relevée par les deux camps le même jour. Ne pas choisir est un choix, et c'est le seul que tout le monde méprise.",
                    "en": "Your absence is noted by both sides on the same day. Not choosing is a choice, and it is the only one everybody despises." } } },
    { "label": { "fr": "Négocier un aménagement contre votre voix", "en": "Trade your vote for an amendment" },
      "when": { "minStanding": 52 },
      "effects": { "reseau": 2, "standing": 4, "popularity": 3, "credibilite": 1, "reputation": -1 },
      "result": { "fr": "Une ligne ajoutée au texte, qui ne change presque rien mais qui existe. Vous pourrez la montrer chez vous et l'oublier ici.",
                  "en": "One line added to the bill, which changes almost nothing but exists. You can show it at home and forget it here." } }
  ]
},


{
  "id": "pouvoir_greve",
  "weight": 3,
  "when": { "ruling": true, "position": ["ministre", "premier"], "maxApproval": 45, "minTurn": 10 },
  "tag": { "fr": "Le blocage", "en": "The shutdown" },
  "text": {
    "fr": "Trois fédérations appellent à la reconductible et le pays s'arrête un jour sur deux. Votre ministère est en première ligne et l'Élysée attend de voir qui craquera le premier.",
    "en": "Three federations call an open-ended strike and the country stops every other day. Your ministry is on the front line and the presidency is waiting to see who breaks first."
  },
  "choices": [
    { "label": { "fr": "Recevoir les syndicats et lâcher quelque chose", "en": "Receive the unions and give something up" },
      "effects": { "approval": 7, "reseau": 2, "reputation": 2, "standing": -8, "credibilite": -1 },
      "result": { "fr": "Deux concessions en quatre heures et la reprise le lundi. Le pays respire, l'Élysée vous trouve faible, et c'était la seule sortie.",
                  "en": "Two concessions in four hours and the country back to work on Monday. The public breathes, the presidency finds you weak, and it was the only way out." } },
    { "label": { "fr": "Tenir, réquisitionner, et attendre", "en": "Hold, requisition, and wait" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "approval": 5, "standing": 10, "credibilite": 2, "popularity": -7, "energie": -3 },
        "result": { "fr": "Onze jours, puis la reprise sans rien avoir cédé. Vous devenez le ministre qui tient, ce qui est une réputation utile et coûteuse.",
                    "en": "Eleven days, then a return to work without a single concession. You become the minister who holds, which is a useful and expensive reputation." } },
      "failure": { "effects": { "approval": -14, "standing": -10, "popularity": -11, "energie": -3, "office": "none" },
        "result": { "fr": "Trois semaines de blocage, une pénurie, et un arbitrage rendu au-dessus de vous. On vous remercie un vendredi soir, par communiqué.",
                    "en": "Three weeks of shutdown, shortages, and a decision taken over your head. You are thanked on a Friday evening, by press release." } } },
    { "label": { "fr": "Faire porter le sujet par quelqu'un d'autre", "en": "Let somebody else carry it" },
      "effects": { "energie": 2, "standing": -5, "reputation": -2, "approval": -3, "credibilite": -1 },
      "result": { "fr": "Vous laissez un collègue prendre les plateaux et les coups. Il s'en souviendra, et il aura raison de s'en souvenir.",
                  "en": "You let a colleague take the studios and the blows. He will remember, and he will be right to." } }
  ]
},


{
  "id": "opp_niche",
  "when": { "ruling": false, "position": ["depute"], "minTurn": 6 },
  "tag": { "fr": "Niche parlementaire", "en": "Opposition day" },
  "text": {
    "fr": "Votre groupe a sa journée réservée : une seule, dans l'année, où c'est l'opposition qui écrit l'ordre du jour. Trois textes se disputent le créneau et un seul ira au vote.",
    "en": "Your group has its reserved day: one a year, when the opposition writes the order paper. Three bills are competing for the slot and only one will reach a vote."
  },
  "choices": [
    { "label": { "fr": "Un texte que la majorité ne peut pas refuser", "en": "A bill the majority cannot refuse" },
      "effects": { "credibilite": 2, "reputation": 2, "standing": 3, "approval": -3, "popularity": 2 },
      "result": { "fr": "Il passe à l'unanimité moins six voix. Vous avez fait voter une loi depuis l'opposition, ce qui n'arrive presque jamais, et personne ne s'en souviendra.",
                  "en": "It passes unanimously bar six votes. You got a law through from opposition, which almost never happens, and nobody will remember it." } },
    { "label": { "fr": "Un texte qui met la majorité en difficulté", "en": "A bill that puts the majority in trouble" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 6, "standing": 5, "approval": -7 },
        "result": { "fr": "Onze députés de la majorité votent avec vous et le gouvernement doit s'expliquer pendant trois jours. Le texte ne passe pas, ce n'était pas le but.",
                    "en": "Eleven government MPs vote with you and the government spends three days explaining itself. The bill fails, which was never the point." } },
      "failure": { "effects": { "popularity": -4, "standing": -5, "reputation": -1 },
        "result": { "fr": "La majorité tient, le texte tombe, et l'on retient que vous avez gâché la seule journée que votre groupe avait dans l'année.",
                    "en": "The majority holds, the bill falls, and what sticks is that you wasted the one day your group had all year." } } },
    { "label": { "fr": "Laisser la place à un collègue qui y tient", "en": "Give the slot to a colleague who wants it" },
      "effects": { "reseau": 3, "standing": 4, "popularity": -2, "energie": 1 },
      "result": { "fr": "Vous cédez le créneau sans le monnayer. Trois personnes du groupe s'en souviendront le jour où l'on comptera les voix.",
                  "en": "You give up the slot without selling it. Three people in the group will remember on the day the votes are counted." } }
  ]
},


{
  "id": "opp_obstruction",
  "when": { "ruling": false, "position": ["depute"], "majority": ["absolue"], "minTurn": 8 },
  "tag": { "fr": "Obstruction", "en": "Filibuster" },
  "text": {
    "fr": "Le gouvernement a la majorité absolue et fait passer ce qu'il veut. Il reste une arme : déposer trois mille amendements et tenir l'hémicycle jusqu'à quatre heures du matin pendant trois semaines.",
    "en": "The government has an absolute majority and passes what it likes. One weapon is left: table three thousand amendments and hold the chamber until four in the morning for three weeks."
  },
  "choices": [
    { "label": { "fr": "Y aller, nuit après nuit", "en": "Do it, night after night" },
      "effects": { "notoriete": 2, "standing": 6, "energie": -4, "popularity": -3, "approval": -4 },
      "result": { "fr": "Le texte passe quand même, avec trois semaines de retard. Votre camp vous trouve héroïque, le pays vous trouve fatigant, et les deux ont raison.",
                  "en": "The bill passes anyway, three weeks late. Your side finds you heroic, the country finds you exhausting, and both are right." } },
    { "label": { "fr": "Choisir trois amendements et les défendre vraiment", "en": "Pick three amendments and actually defend them" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "reputation": 2, "popularity": 5, "standing": -2, "approval": -3 },
        "result": { "fr": "Deux sont adoptés, ce qui n'était pas prévu, et le troisième revient dans le débat public six mois plus tard sous un autre nom.",
                    "en": "Two are adopted, which nobody planned, and the third comes back into public debate six months later under another name." } },
      "failure": { "effects": { "popularity": -2, "standing": -4, "energie": -1 },
        "result": { "fr": "Les trois tombent en douze minutes. Vous aviez raison sur le fond et vous étiez seul, ce qui, à l'Assemblée, revient à avoir tort.",
                    "en": "All three fall in twelve minutes. You were right on the substance and you were alone, which in that chamber amounts to being wrong." } } },
    { "label": { "fr": "Ne pas participer et travailler ailleurs", "en": "Skip it and work elsewhere" },
      "effects": { "energie": 3, "standing": -6, "credibilite": 1 },
      "result": { "fr": "Vous passez trois semaines dans votre circonscription pendant que les autres dorment sur les bancs. Le groupe compte les absents, et vous en êtes.",
                  "en": "You spend three weeks in your constituency while the others sleep on the benches. The group counts who was missing, and you were." } }
  ]
},


{
  "id": "pouvoir_49_3",
  "when": { "ruling": true, "position": ["ministre", "premier"], "majority": ["relative", "aucune"] },
  "tag": { "fr": "Le passage en force", "en": "Ramming it through" },
  "text": {
    "fr": "Le texte n'a pas la majorité et le compte des voix ne bougera plus. Il reste l'article qui permet de l'adopter sans vote, en échange d'une motion de censure que l'opposition déposera dans l'heure.",
    "en": "The bill does not have the votes and the count will not move. There remains the article that lets you adopt it without a vote, in exchange for a no-confidence motion the opposition will table within the hour."
  },
  "choices": [
    { "label": { "fr": "Engager la responsabilité du gouvernement", "en": "Put the government's survival on the line" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 2, "standing": 6, "approval": -8, "popularity": -6, "reputation": -1 },
        "result": { "fr": "La motion tombe à neuf voix près et le texte est adopté sans avoir été voté. Vous avez gagné, et le mot « démocratie » reviendra dans chaque tribune pendant six semaines.",
                    "en": "The motion fails by nine votes and the bill is adopted without ever being voted on. You won, and the word “democracy” will be in every op-ed for six weeks." } },
      "failure": { "effects": { "credibilite": -2, "standing": -12, "approval": -14, "popularity": -8, "office": "none" },
        "result": { "fr": "La motion passe. Le gouvernement tombe, vous rendez votre portefeuille, et c'est vous qui aurez conseillé le passage en force.",
                    "en": "The motion passes. The government falls, you hand back your portfolio, and it was you who advised ramming it through." } } },
    { "label": { "fr": "Retirer le texte et le réécrire", "en": "Withdraw the bill and rewrite it" },
      "effects": { "credibilite": 1, "reputation": 2, "standing": -7, "approval": 3, "energie": -2 },
      "result": { "fr": "Six semaines de plus, quatre concessions, et un texte qui ne ressemble plus à ce que vous vouliez. Il passera, et personne ne saura qu'il a existé autrement.",
                  "en": "Six more weeks, four concessions, and a bill that no longer resembles what you wanted. It will pass, and nobody will know it once looked different." } },
    { "label": { "fr": "Aller chercher les voix une par une", "en": "Go and get the votes one by one" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "charisme": 0.35, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 8, "approval": 5, "credibilite": 2, "energie": -3 },
        "result": { "fr": "Onze jours de bureau en bureau, et le texte passe de quatre voix, votées. Cela ne se raconte pas au journal de vingt heures et cela vaut mieux qu'un passage en force.",
                    "en": "Eleven days of office-to-office, and the bill passes by four votes, actually cast. It does not make the evening news and it is worth more than ramming it through." } },
      "failure": { "effects": { "standing": -6, "approval": -6, "energie": -3, "reputation": -1 },
        "result": { "fr": "Vous promettez trop à trop de monde et deux de vos promesses se croisent dans un couloir. Le texte tombe et les promesses restent.",
                    "en": "You promise too much to too many people and two of your promises meet in a corridor. The bill falls and the promises remain." } } }
  ]
},


{
  "id": "pouvoir_remaniement_cote",
  "when": { "ruling": true, "position": ["depute", "ministre", "chef"], "maxApproval": 36, "minTurn": 10 },
  "tag": { "fr": "Le pouvoir s'enfonce", "en": "The government is sinking" },
  "text": {
    "fr": "Le gouvernement est à un niveau de rejet qu'on n'avait pas vu depuis longtemps. Dans votre camp, deux écoles s'affrontent : ceux qui veulent tenir jusqu'au bout et ceux qui préparent déjà l'après.",
    "en": "The government has reached a level of rejection nobody has seen in a long time. In your own camp, two schools are fighting: those who want to hold to the end, and those already preparing for what comes next."
  },
  "choices": [
    { "label": { "fr": "Tenir la ligne publiquement", "en": "Hold the line in public" },
      "effects": { "standing": 8, "reputation": 2, "popularity": -7, "approval": 4 },
      "result": { "fr": "Vous défendez l'indéfendable avec application. Le camp vous en saura gré longtemps après que le pays vous en aura tenu rigueur.",
                  "en": "You defend the indefensible diligently. Your camp will thank you long after the country has stopped holding it against you." } },
    { "label": { "fr": "Prendre vos distances, en termes choisis", "en": "Step back, in carefully chosen terms" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "notoriete": 2, "standing": -6, "approval": -4 },
        "result": { "fr": "Trois phrases, pas une de plus, et vous voilà le seul de votre camp que le pays écoute encore. Le siège a compris et ne dira rien tant que vous monterez.",
                    "en": "Three sentences, not one more, and you are suddenly the only one in your camp the country still listens to. Headquarters understood and will say nothing while you keep rising." } },
      "failure": { "effects": { "popularity": -3, "standing": -11, "reputation": -2, "approval": -5 },
        "result": { "fr": "La phrase est reprise sans ses nuances et devient une trahison. Vous perdez le camp sans gagner le pays, ce qui est la pire des deux places.",
                    "en": "The sentence is quoted without its qualifiers and becomes a betrayal. You lose the camp without winning the country, which is the worst of the two places to stand." } } },
    { "label": { "fr": "Ne rien dire et travailler vos dossiers", "en": "Say nothing and work your files" },
      "effects": { "credibilite": 2, "energie": 1, "standing": -2, "popularity": -1 },
      "result": { "fr": "Vous traversez la séquence sans une déclaration. C'est la seule chose qui ne se retournera contre vous ni maintenant ni dans dix ans.",
                  "en": "You cross the whole sequence without a single statement. It is the one thing that will be used against you neither now nor in ten years." } }
  ]
},


{
  "id": "opp_pouvoir_a_portee",
  "when": { "ruling": false, "position": ["depute", "maire", "chef"], "maxApproval": 33, "minStanding": 45, "minTurn": 12 },
  "tag": { "fr": "Ça sent la fin", "en": "The end is in the air" },
  "text": {
    "fr": "Le pouvoir est au plus bas et tout le monde le sait, à commencer par ceux qui l'exercent. Dans l'opposition, on ne parle plus de combattre le gouvernement mais de savoir qui prendra sa place.",
    "en": "The government is at rock bottom and everyone knows it, starting with the people running it. In opposition, nobody talks about fighting the government any more, only about who will replace it."
  },
  "choices": [
    { "label": { "fr": "Se poser en recours, dès maintenant", "en": "Present yourself as the alternative, now" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "charisme": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": 10, "credibilite": 2, "notoriete": 2, "standing": 5,
                                "landscape": { "self": 1.2 } },
        "result": { "fr": "Vous parlez comme quelqu'un qui gouvernera, et pas comme quelqu'un qui critique. Le pays fait la différence tout de suite, votre camp met six mois.",
                    "en": "You speak like somebody who will govern, not somebody who criticises. The country tells the difference immediately; your own camp takes six months." } },
      "failure": { "effects": { "popularity": -6, "standing": -8, "credibilite": -2 },
        "result": { "fr": "Se déclarer trop tôt, c'est se désigner à ceux de son propre camp. Ils ont dix-huit mois pour vous abîmer, et ils s'y mettent le soir même.",
                    "en": "Declaring too early means pointing yourself out to your own side. They have eighteen months to damage you, and they start that same evening." } } },
    { "label": { "fr": "Laisser le pouvoir se défaire tout seul", "en": "Let the government fall apart on its own" },
      "effects": { "sangfroid": 1, "standing": 3, "credibilite": 1, "energie": 2, "popularity": -2 },
      "result": { "fr": "Vous ne dites rien pendant six mois. C'est la stratégie la plus efficace de la vie politique et la seule que personne ne raconte dans ses mémoires.",
                  "en": "You say nothing for six months. It is the most effective strategy in politics and the only one nobody puts in their memoirs." } },
    { "label": { "fr": "Tendre la main : proposer une sortie de crise", "en": "Extend a hand: offer a way out of the crisis" },
      "effects": { "reputation": 3, "credibilite": 2, "popularity": 4, "standing": -9, "approval": 6 },
      "result": { "fr": "Vous proposez au pouvoir une porte de sortie honorable. Le pays trouve cela adulte, votre camp trouve cela incompréhensible, et le gouvernement respire deux mois de plus.",
                  "en": "You offer the government an honourable way out. The country finds it grown-up, your camp finds it incomprehensible, and the government breathes for two more months." } }
  ]
},


{
  "id": "censure_grande",
  "weight": 4,
  "when": { "position": ["depute", "ministre", "chef"], "maxApproval": 34,
            "majority": ["relative", "aucune"], "minTurn": 12 },
  "tag": { "fr": "La censure", "en": "The censure" },
  "text": {
    "fr": "Une motion de censure est déposée, et pour la première fois elle peut passer : le gouvernement n'a pas la majorité, le pays ne le soutient plus, et deux groupes qui ne se parlent jamais viennent de se parler.",
    "en": "A no-confidence motion is tabled, and for the first time it can pass: the government has no majority, the country has stopped backing it, and two groups that never speak to each other have just spoken."
  },
  "choices": [
    { "label": { "fr": "Faire tomber le gouvernement", "en": "Bring the government down" },
      "when": { "ruling": false },
      "roll": { "base": 15, "stat": "reseau", "plus": { "eloquence": 0.35, "standing": 0.04 },
                "bonus": [ { "when": { "position": ["chef"] }, "value": 2.5 },
                           { "when": { "maxApproval": 20 }, "value": 3 } ], "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 14, "standing": 8, "approval": -12,
                                "dissolve": true, "landscape": { "self": 1 } },
        "result": { "fr": "La motion passe. Le gouvernement tombe dans la nuit, le président dissout l'Assemblée le lendemain matin, et le pays revote dans six semaines. Vous avez déclenché tout cela.",
                    "en": "The motion passes. The government falls overnight, the president dissolves the Assembly the next morning, and the country votes again in six weeks. You set all of it in motion." } },
      "failure": { "effects": { "notoriete": 2, "popularity": -8, "standing": -14, "approval": 5 },
        "result": { "fr": "Il manque sept voix. Un gouvernement qui survit à une censure en sort plus fort qu'avant, et l'on retiendra que vous l'aviez menée.",
                    "en": "Seven votes short. A government that survives a censure comes out stronger than before, and people will remember you led it." } } },
    { "label": { "fr": "Sauver le gouvernement, voix par voix", "en": "Save the government, vote by vote" },
      "when": { "ruling": true },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 12, "approval": 6, "energie": -3, "popularity": -4 },
        "result": { "fr": "Vous passez trois nuits au téléphone et la motion tombe à quatre voix. Personne ne saura jamais lesquelles, et c'est très bien ainsi.",
                    "en": "You spend three nights on the phone and the motion fails by four votes. Nobody will ever know which four, and that is exactly as it should be." } },
      "failure": { "effects": { "standing": -10, "approval": -12, "popularity": -5, "dissolve": true },
        "result": { "fr": "La motion passe malgré vous. Le gouvernement tombe, le président dissout, et vous aurez été celui qui a compté les voix de travers.",
                    "en": "The motion passes despite you. The government falls, the president dissolves, and you will be the one who miscounted." } } },
    { "label": { "fr": "Voter la censure sans la revendiquer", "en": "Vote for it without claiming it" },
      "when": { "ruling": false },
      "effects": { "standing": 5, "popularity": 2, "approval": -4, "sangfroid": 1 },
      "result": { "fr": "Votre nom est dans la liste et nulle part ailleurs. C'est ce qu'on fait quand on ne sait pas encore si l'on veut être du côté des vainqueurs.",
                  "en": "Your name is on the list and nowhere else. It is what you do when you do not yet know whether you want to be on the winning side." } },
    { "label": { "fr": "S'abstenir, et le dire", "en": "Abstain, and say so" },
      "effects": { "credibilite": 1, "reputation": 1, "standing": -4, "popularity": -3 },
      "result": { "fr": "Vous expliquez qu'on ne renverse pas un gouvernement sans savoir par quoi le remplacer. C'est exact, c'est raisonnable, et cela ne convainc personne.",
                  "en": "You explain that you do not bring down a government without knowing what replaces it. It is accurate, it is reasonable, and it convinces nobody." } }
  ]
}
];
