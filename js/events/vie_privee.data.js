/* Généré — ne pas éditer à la main. */
const EV_vie_privee = [


/* ==========================================================================
   9. VIE PRIVÉE ET USURE
   ========================================================================== */

{
  "id": "famille",
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "À la maison, on ne vous voit plus. La discussion que vous repoussez depuis des mois finit par arriver.",
    "en": "At home, they never see you anymore. The conversation you have been putting off finally arrives."
  },
  "choices": [
    { "label": { "fr": "Sanctuariser les week-ends", "en": "Protect the weekends" },
      "effects": { "energie": 1, "reseau": -1, "standing": -6 },
      "result": { "fr": "Vous ratez quelques dîners qui comptaient. Vous en sauvez d'autres.",
                  "en": "You miss a few dinners that mattered. You save some others." } },
    { "label": { "fr": "Promettre que ça ira mieux après", "en": "Promise it gets better later" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reputation": -1, "energie": -2, "standing": 4, "chain": "rupture" },
      "result": { "fr": "Personne n'y croit, pas même vous. La politique d'abord.",
                  "en": "Nobody believes it, not even you. Politics first." } },
    { "label": { "fr": "Payer de quoi alléger le quotidien", "en": "Pay to lighten the load at home" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -70000, "energie": 1, "reputation": -1, "standing": 3 },
      "result": { "fr": "Une aide à domicile, un chauffeur, des vacances. L'argent règle la logistique, pas le reste.",
                  "en": "Help at home, a driver, a holiday. Money fixes the logistics, not the rest." } },
    { "label": { "fr": "Les associer à la vie publique", "en": "Bring them into public life" },
      "when": { "personality": ["charming"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "popularity": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "energie": 1 },
        "result": { "fr": "Les photos de famille fonctionnent. On vous trouve enfin incarné.",
                    "en": "The family pictures work. People finally find you human." } },
      "failure": { "effects": { "popularity": -6, "reputation": -1 },
        "result": { "fr": "L'exposition se retourne. On vous accuse d'utiliser les vôtres.",
                    "en": "The exposure backfires. You are accused of using your own family." } } }
  ]
},


{
  "id": "rupture",
  "delay": [2, 6],
  "weight": 0,
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "La séparation est actée. Elle sera publique, parce que tout finit par l'être.",
    "en": "The separation is settled. It will be public, because everything ends up being public."
  },
  "choices": [
    { "label": { "fr": "Communiquer avec dignité", "en": "Handle it with dignity" },
      "effects": { "energie": -1, "reputation": 2, "popularity": 8, "sangfroid": 1 },
      "result": { "fr": "Un communiqué de trois lignes. Le pays vous trouve humain.",
                  "en": "A three-line statement. The country finds you human." } },
    { "label": { "fr": "Vous jeter dans le travail", "en": "Throw yourself into work" },
      "effects": { "energie": -2, "reseau": 2, "standing": 12, "popularity": -3 },
      "result": { "fr": "Vous ne rentrez plus du tout. Le parti n'a jamais eu un cadre aussi disponible.",
                  "en": "You stop going home at all. The party has never had such an available operator." } }
  ]
},


{
  "id": "vieil_ami",
  "when": { "minAge": 45 },
  "tag": { "fr": "Loyautés", "en": "Loyalties" },
  "text": {
    "fr": "Un ami de trente ans vous demande une intervention pour son entreprise. Ce n'est pas illégal, c'est juste tout ce que vous dénoncez.",
    "en": "A friend of thirty years asks you to intervene for his company. It is not illegal, it is just everything you denounce."
  },
  "choices": [
    { "label": { "fr": "Passer le coup de fil", "en": "Make the call" },
      "effects": { "reseau": 1, "reputation": -2, "standing": 3, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Cinq minutes de téléphone. Une note de service quelque part porte votre nom.",
                  "en": "Five minutes on the phone. A memo somewhere has your name on it." } },
    { "label": { "fr": "Refuser et perdre l'ami", "en": "Refuse and lose the friend" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "reputation": 2, "reseau": -1, "popularity": 3, "energie": -2 },
      "result": { "fr": "Il raccroche sans rien dire. Trente ans, et vous ne le reverrez pas.",
                  "en": "He hangs up without a word. Thirty years, and you will not see him again." } },
    { "label": { "fr": "L'orienter vers la procédure normale", "en": "Point him to the proper channel" },
      "when": { "background": ["civil"] },
      "effects": { "reputation": 1, "reseau": -1, "standing": 3, "energie": -1 },
      "result": { "fr": "Vous lui expliquez exactement quel dossier déposer, et à qui. Rien d'illégal, tout de légal.",
                  "en": "You tell him exactly which application to file, and to whom. Nothing illegal, everything legal." } },
    { "label": { "fr": "Refuser en lui expliquant pourquoi", "en": "Refuse, and explain why" },
      "when": { "personality": ["principled", "clever"] },
      "effects": { "reputation": 2, "eloquence": 1, "popularity": 4, "energie": -1 },
      "result": { "fr": "Deux heures de conversation difficile. Il comprend sans vous pardonner.",
                  "en": "Two hours of difficult conversation. He understands without forgiving you." } }
  ]
},


{
  "id": "anniversaire_carriere",
  "when": { "minTurn": 30 },
  "tag": { "fr": "Bilan", "en": "Taking stock" },
  "text": {
    "fr": "Quinze ans de vie politique. Un journaliste vous demande si vous referiez tout pareil.",
    "en": "Fifteen years in politics. A journalist asks whether you would do it all again."
  },
  "choices": [
    { "label": { "fr": "Répondre franchement non", "en": "Answer honestly: no" },
      "effects": { "reputation": 2, "popularity": 10, "standing": -7 },
      "result": { "fr": "L'aveu circule partout. On vous redécouvre.",
                  "en": "The admission travels everywhere. People rediscover you." } },
    { "label": { "fr": "Dérouler le bilan", "en": "Run through the record" },
      "effects": { "standing": 6, "popularity": -2, "notoriete": 1 },
      "result": { "fr": "Un entretien correct et parfaitement oubliable.",
                  "en": "A decent, perfectly forgettable interview." } },
    { "label": { "fr": "Publier un livre de souvenirs", "en": "Publish a book of memoirs" },
      "effects": { "money": 40000, "notoriete": 2, "popularity": 4, "energie": -2, "standing": -3 },
      "result": { "fr": "Trois cents pages écrites par quelqu'un d'autre, où vous aviez raison avant tout le monde à chaque chapitre.",
                  "en": "Three hundred pages written by somebody else, in which you were right before everyone else in every chapter." } }
  ]
},

/* ==========================================================================
   17. LE CORPS
   ==========================================================================
   La vie politique regarde les corps avant d'écouter les idées, et elle les
   traite mal. C'est elle que ces événements moquent, jamais les corps
   eux-mêmes. Ce sont aussi les seuls événements du jeu qui ne s'ouvrent qu'à
   certains physiques : un personnage passera sa carrière sans en voir la
   moitié, et c'est le but.
   ========================================================================== */

{
  "id": "photo_officielle",
  "once": true,
  "weight": 5,
  "when": { "trait": ["beau"], "position": ["conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Affichage", "en": "The poster" },
  "text": {
    "fr": "La fédération veut votre visage sur toutes les affiches, en très grand, sans slogan. Le directeur de campagne parle d'atout, votre suppléante parle d'autre chose depuis la porte du bureau.",
    "en": "The local party wants your face on every poster, very large, with no slogan. The campaign manager calls it an asset; your deputy, standing in the doorway, calls it something else."
  },
  "choices": [
    { "label": { "fr": "Laisser faire", "en": "Let them" },
      "effects": { "notoriete": 2, "popularity": 7, "standing": -4, "reputation": -1 },
      "result": { "fr": "Le score progresse de quatre points et le mot programme n'a pas été prononcé de la campagne. Personne ne s'en plaint, ce qui est le plus inquiétant.",
                  "en": "The result improves by four points and the word manifesto was not uttered once. Nobody complains, which is the worrying part." } },
    { "label": { "fr": "Exiger une mesure sur chaque affiche", "en": "Insist on a policy line on every poster" },
      "effects": { "reputation": 2, "popularity": -2, "standing": 5, "eloquence": 1 },
      "result": { "fr": "Les affiches sont moches et illisibles de loin. Vos militants les défendent avec une conviction qui vaut tous les sondages.",
                  "en": "The posters are ugly and unreadable from a distance. Your activists defend them with a conviction worth more than any poll." } },
    { "label": { "fr": "Refaire la maquette vous-même, en une nuit", "en": "Redo the artwork yourself, in one night" },
      "when": { "background": ["comms"] },
      "effects": { "popularity": 5, "credibilite": 2, "notoriete": 2, "energie": -2, "money": -8000 },
      "result": { "fr": "Vous reprenez la police, le cadrage et la hiérarchie de l'information parce que la fédération a payé une agence qui n'a rien compris. C'est mieux, et personne ne saura jamais pourquoi.",
                  "en": "You redo the typeface, the crop and the information hierarchy because the federation paid an agency that understood nothing. It is better, and nobody will ever know why." } },
    { "label": { "fr": "En faire une campagne entièrement à l'image", "en": "Make the whole campaign about the image" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 10, "standing": -6, "trait": "bete_scene" },
        "result": { "fr": "Trois plateaux, une couverture de magazine, un mème. Vous êtes désormais quelqu'un qu'on reconnaît dans la rue et qu'on n'écoute pas en réunion.",
                    "en": "Three television shows, a magazine cover, a meme. You are now somebody people recognise in the street and ignore in meetings." } },
      "failure": { "effects": { "popularity": -5, "reputation": -2, "strike": "menteur" },
        "result": { "fr": "L'emballement retombe en dix jours et un portrait cruel paraît, intitulé « le candidat sans phrase ».",
                    "en": "The buzz dies in ten days and a cruel profile appears, headlined “the candidate with nothing to say”." } } }
  ]
},


{
  "id": "candidat_sans_fond",
  "weight": 4,
  "when": { "trait": ["beau"], "minTurn": 10 },
  "tag": { "fr": "Portrait", "en": "The profile" },
  "text": {
    "fr": "Un éditorialiste écrit que vous êtes « le plus beau des seconds couteaux » et que votre ascension ne doit rien à vos idées. L'article est injuste, bien écrit, et il circule dans votre propre parti depuis le matin.",
    "en": "A columnist writes that you are “the best-looking of the second-raters” and that your rise owes nothing to your ideas. The piece is unfair, well written, and it has been circulating inside your own party since morning."
  },
  "choices": [
    { "label": { "fr": "Publier un livre de fond dans l'année", "en": "Publish a serious book within the year" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "energie": 0.4 }, "dice": 16 },
      "success": { "effects": { "reputation": 3, "eloquence": 1, "energie": -2, "standing": 6, "trait": "orateur" },
        "result": { "fr": "Deux cents pages sur un sujet que personne n'attendait de vous. On cesse de parler de votre visage pendant six mois.",
                    "en": "Two hundred pages on a subject nobody expected from you. People stop talking about your face for six months." } },
      "failure": { "effects": { "energie": -2, "reputation": -1, "money": -20000 },
        "result": { "fr": "Le livre sort, il est correct, il ne se vend pas. Le même éditorialiste écrit qu'il l'a lu, ce dont vous doutez.",
                    "en": "The book comes out, it is decent, it does not sell. The same columnist writes that he read it, which you doubt." } } },
    { "label": { "fr": "En rire publiquement", "en": "Laugh it off in public" },
      "effects": { "charisme": 1, "popularity": 6, "sangfroid": 1, "standing": -3 },
      "result": { "fr": "Vous citez la formule vous-même, en ouverture de meeting. La salle rit, l'éditorialiste aussi, et il vous descendra de nouveau au printemps.",
                  "en": "You quote the line yourself, opening a rally. The hall laughs, the columnist laughs, and he will take you apart again in the spring." } },
    { "label": { "fr": "Travailler deux dossiers jusqu'à les connaître mieux que quiconque", "en": "Master two files better than anyone" },
      "effects": { "eloquence": 2, "reputation": 2, "energie": -3, "standing": 7, "popularity": -2 },
      "result": { "fr": "Six mois d'auditions et de notes. En commission, plus personne ne vous coupe la parole, et c'est là que ça se joue.",
                  "en": "Six months of hearings and briefing notes. In committee, nobody interrupts you any more, and that is where it counts." } }
  ]
},


{
  "id": "caricature",
  "weight": 4,
  "when": { "trait": ["ingrat"], "minTurn": 8 },
  "tag": { "fr": "Dessin de presse", "en": "The cartoon" },
  "text": {
    "fr": "Un dessinateur vous a trouvé une silhouette et ne vous lâche plus. Le trait est cruel, drôle, et il paraît trois fois par semaine depuis un mois.",
    "en": "A cartoonist has found your silhouette and will not let go. The drawing is cruel, funny, and it has run three times a week for a month."
  },
  "choices": [
    { "label": { "fr": "Lui acheter l'original et l'accrocher dans votre bureau", "en": "Buy the original and hang it in your office" },
      "effects": { "credibilite": +1, "money": -4000, "popularity": 8, "charisme": 1, "sangfroid": 1, "trait": "teflon" },
      "result": { "fr": "La photo du dessin encadré derrière vous fait le tour des rédactions. On ne peut plus se moquer de quelqu'un qui rit le premier.",
                  "en": "The photograph of the framed cartoon behind you goes round every newsroom. You cannot mock somebody who laughs first." } },
    { "label": { "fr": "Demander à votre entourage d'appeler le journal", "en": "Have your staff call the paper" },
      "roll": { "chance": 0.3 },
      "success": { "effects": { "popularity": 2, "reseau": 1 },
        "result": { "fr": "Le dessinateur passe à quelqu'un d'autre le mois suivant. Personne n'a rien su, et c'est déjà une victoire rare.",
                    "en": "The cartoonist moves on to somebody else the following month. Nobody found out, which is already a rare win." } },
      "failure": { "effects": { "credibilite": -2, "popularity": -9, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Le journal publie l'appel en fac-similé, avec le nom de votre collaborateur. Le dessin devient une série et vous, un symbole de susceptibilité.",
                    "en": "The paper publishes the call in facsimile, with your staffer's name on it. The cartoon becomes a series, and you become a symbol of thin skin." } } },
    { "label": { "fr": "Lui commander une série et la publier vous-même", "en": "Commission a series from him and publish it yourself" },
      "when": { "background": ["celebrity"] },
      "effects": { "popularity": 8, "notoriete": 3, "reputation": 2, "money": -12000 },
      "result": { "fr": "Vous savez depuis longtemps qu'on ne se bat pas contre une image, on l'achète. Douze dessins, votre nom dessus, et le trait cruel devient votre affiche de campagne.",
                  "en": "You have long known you do not fight an image, you buy it. Twelve drawings, your name on them, and the cruel line becomes your campaign poster." } },
    { "label": { "fr": "Ne rien faire du tout", "en": "Do nothing at all" },
      "effects": { "credibilite": +1, "sangfroid": 2, "popularity": -2 },
      "result": { "fr": "Vous laissez passer, comme le reste. Au bout de deux ans, la silhouette est devenue votre logo et les militants la portent sur des badges.",
                  "en": "You let it pass, like everything else. Two years on, the silhouette has become your logo and activists wear it on badges." } }
  ]
},


{
  "id": "prise_de_poids",
  "weight": 4,
  "when": { "notTrait": ["obese", "athletique"], "minTurn": 14, "position": ["maire", "euro", "depute", "ministre", "chef"] },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Quatre ans de buffets à vingt-trois heures, de trains et de nuits courtes. Le tailleur vous le dit avant votre médecin, et votre attachée de presse avant les deux.",
    "en": "Four years of buffets at eleven at night, of trains and short nights. Your tailor tells you before your doctor does, and your press officer before either of them."
  },
  "choices": [
    { "label": { "fr": "Continuer, il y a plus urgent", "en": "Carry on, there are bigger problems" },
      "effects": { "trait": "obese", "energie": -1, "standing": 5, "sangfroid": 1 },
      "result": { "fr": "Vous ne changez rien et vous tenez le rythme deux ans de plus. Les photos de vous en 2019 commencent à circuler avec des commentaires.",
                  "en": "You change nothing and hold the pace for two more years. Photographs of you from a few years back start circulating with comments attached." } },
    { "label": { "fr": "Reprendre le sport sérieusement", "en": "Take up sport seriously" },
      "roll": { "base": 20, "stat": "energie", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "trait": "athletique", "energie": 2, "popularity": 3 },
        "result": { "fr": "Cinq heures par semaine arrachées à l'agenda, et un cliché de vous en train de courir qui ne doit rien au hasard.",
                    "en": "Five hours a week torn out of the diary, and a photograph of you running that owes nothing to chance." } },
      "failure": { "effects": { "energie": -2, "standing": -3 },
        "result": { "fr": "Trois semaines tenues, puis une crise politique. Le vélo d'appartement reste dans le bureau, où les visiteurs le remarquent.",
                    "en": "Three weeks of it, then a political crisis. The exercise bike stays in the office, where visitors notice it." } } },
    { "label": { "fr": "Confier le sujet à des professionnels", "en": "Hand the matter to professionals" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -30000, "energie": 1, "popularity": 2, "reputation": -1 },
      "result": { "fr": "Un nutritionniste, un coach, un photographe. Le résultat est net et tout le monde comprend qu'il a été acheté.",
                  "en": "A nutritionist, a coach, a photographer. The result is clear, and everyone understands it was bought." } }
  ]
},


{
  "id": "regime_impose",
  "weight": 5,
  "when": { "trait": ["obese"], "minTurn": 4 },
  "tag": { "fr": "Conseil en image", "en": "Image consultants" },
  "text": {
    "fr": "L'état-major vous fait rencontrer une consultante. Elle ne parle pas de santé, elle parle de « lisibilité à l'écran » et montre des courbes. Elle propose un suivi médiatisé, avec des étapes et des photos.",
    "en": "The leadership sets up a meeting with a consultant. She does not talk about health, she talks about “legibility on screen” and shows charts. She proposes a publicised programme, with milestones and photographs."
  },
  "choices": [
    { "label": { "fr": "Accepter le suivi et le raconter", "en": "Accept the programme and tell the story" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "stat": { "energie": { "min": 10 } } }, "value": 0.2 } ] },
      "success": { "effects": { "untrait": "obese", "popularity": 9, "notoriete": 1, "energie": 2 },
        "result": { "fr": "Dix-huit mois, une couverture de magazine et une phrase que vous répéterez mille fois. Le pays adore les métamorphoses, surtout les vôtres.",
                    "en": "Eighteen months, a magazine cover and a sentence you will repeat a thousand times. The country loves a transformation, especially yours." } },
      "failure": { "effects": { "popularity": -7, "energie": -2, "reputation": -1 },
        "result": { "fr": "Vous reprenez tout, sous les caméras cette fois. L'échec est public parce que vous aviez rendu la tentative publique.",
                    "en": "You put it all back on, on camera this time. The failure is public because you made the attempt public." } } },
    { "label": { "fr": "Refuser et le dire", "en": "Refuse, and say so" },
      "effects": { "reputation": 3, "popularity": 6, "standing": -8, "sangfroid": 1, "chain": "position_impopulaire" },
      "result": { "fr": "Vous expliquez en direct qu'on ne vous a jamais demandé de perdre des idées. La séquence est reprise partout, et l'état-major ne vous le pardonne pas.",
                  "en": "You explain on air that nobody has ever asked you to lose ideas. The clip runs everywhere, and the leadership does not forgive it." } },
    { "label": { "fr": "Accepter en silence", "en": "Accept, quietly" },
      "effects": { "standing": 6, "energie": -1, "popularity": -1 },
      "result": { "fr": "Vous suivez le programme sans en parler à personne. Les résultats sont modestes et l'état-major vous trouve enfin raisonnable.",
                  "en": "You follow the programme without telling anyone. The results are modest and the leadership finally finds you reasonable." } }
  ]
},


{
  "id": "retouche_visage",
  "weight": 2,
  "when": { "minAge": 56, "minMoney": 90000, "notTrait": ["lifting", "intouchable"] },
  "tag": { "fr": "Miroir", "en": "The mirror" },
  "text": {
    "fr": "Les photos de la dernière campagne vous vieillissent de dix ans. Un praticien discret, recommandé par quelqu'un du parti, vous explique que trois séances suffiraient et que personne ne verrait rien.",
    "en": "The photographs from the last campaign make you look ten years older. A discreet practitioner, recommended by somebody in the party, explains that three sessions would do it and that nobody would notice a thing."
  },
  "choices": [
    { "label": { "fr": "Y aller", "en": "Go ahead" },
      "effects": { "money": -48000, "trait": "lifting", "popularity": 4 },
      "result": { "fr": "Trois séances, deux semaines de discrétion. Personne ne dit rien pendant un mois, puis un journal met deux photos côte à côte.",
                  "en": "Three sessions, two discreet weeks. Nobody says anything for a month, then a paper runs two photographs side by side." } },
    { "label": { "fr": "Assumer le vieillissement", "en": "Own the ageing" },
      "effects": { "reputation": 3, "sangfroid": 1, "popularity": -2 },
      "result": { "fr": "Vous laissez faire le temps, et vous laissez dire. Dans un métier où tout le monde se retouche, ne rien faire finit par se voir aussi.",
                  "en": "You let time do its work, and let people talk. In a trade where everyone has work done, doing nothing eventually shows too." } },
    { "label": { "fr": "En faire un sujet politique", "en": "Turn it into a political subject" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 2, "popularity": 7, "reputation": 1, "standing": -6,
                   "landscape": { "self": 0.8 } },
      "result": { "fr": "Vous publiez les deux photos vous-même, avec le devis, et vous demandez combien de vos collègues ont la même facture. Trois d'entre eux ne vous parlent plus.",
                  "en": "You publish both photographs yourself, with the quote, and ask how many of your colleagues have the same invoice. Three of them stop speaking to you." } }
  ]
},


{
  "id": "moquerie_plateau",
  "weight": 4,
  "cast": "opponent",
  "when": { "minTurn": 12, "position": ["depute", "ministre", "chef", "euro"] },
  "tag": { "fr": "Sur le plateau", "en": "On air" },
  "text": {
    "fr": "En direct, {rival} lâche une pique sur votre physique. Ce n'est pas un argument, ça n'a rien à voir avec le sujet, et le plateau rit avant de se rendre compte.",
    "en": "Live on air, {rival} lands a jibe about your appearance. It is not an argument, it has nothing to do with the subject, and the studio laughs before it catches itself."
  },
  "choices": [
    { "label": { "fr": "Répondre sur le fond, sans relever", "en": "Answer on the substance, without acknowledging it" },
      "effects": { "credibilite": +2, "reputation": 2, "sangfroid": 1, "popularity": 4, "landscape": { "self": 0.6, "scene": -0.6 } },
      "result": { "fr": "Vous enchaînez comme si de rien n'était. Le silence qui suit sa phrase dure une seconde de trop, et c'est cette seconde-là qui tournera.",
                  "en": "You carry on as if nothing had happened. The silence after his line lasts a second too long, and that second is the clip that travels." } },
    { "label": { "fr": "Rendre le coup, plus fort", "en": "Hit back, harder" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "strike": "intrepide", "popularity": 8, "notoriete": 1, "landscape": { "self": 1.2, "scene": -1.2 } },
        "result": { "fr": "Votre réponse est meilleure que sa pique et tout le monde le sait avant la fin de l'émission. Il ne recommencera pas avec vous.",
                    "en": "Your comeback is better than his jibe and everyone knows it before the programme ends. He will not try that with you again." } },
      "failure": { "effects": { "credibilite": -2, "strike": "intrepide", "popularity": -6, "reputation": -2, "landscape": { "scene": 0.8 } },
        "result": { "fr": "Vous descendez à son niveau sans son talent. Le lendemain, les deux séquences passent ensemble et une seule est drôle.",
                    "en": "You go down to his level without his timing. The next day both clips run together, and only one of them is funny." } } },
    { "label": { "fr": "Enchaîner sur une vanne meilleure que la sienne", "en": "Come back with a better joke than his" },
      "when": { "background": ["celebrity"] },
      "effects": { "popularity": 9, "notoriete": 3, "credibilite": -1, "standing": -2 },
      "result": { "fr": "Vous avez fait ça pendant quinze ans devant des salles plus dures qu'un plateau politique. La réplique tombe en une seconde et demie, et c'est la sienne qu'on oublie.",
                  "en": "You did this for fifteen years in rooms harder than any political studio. The line lands in a second and a half, and it is his that gets forgotten." } },
    { "label": { "fr": "Prendre le pays à témoin", "en": "Take it to the country" },
      "when": { "anyTrait": ["ingrat", "obese", "lifting", "use"] },
      "effects": { "popularity": 11, "reputation": 2, "standing": -4, "notoriete": 1,
                   "landscape": { "scene": -1.4 } },
      "result": { "fr": "Vous regardez la caméra et vous demandez combien de gens, chez eux, entendent ça toute leur vie. Le standard de la chaîne sature avant la fin du générique.",
                  "en": "You look into the camera and ask how many people at home hear that their whole lives. The channel's switchboard is jammed before the credits finish." } }
  ]
},


{
  "id": "nuit_de_trop",
  "weight": 3,
  "when": { "notTrait": ["use"], "minAge": 55, "stat": { "energie": { "max": 7 } } },
  "tag": { "fr": "Trois heures du matin", "en": "Three in the morning" },
  "text": {
    "fr": "Vous vous réveillez dans une voiture de fonction sans savoir dans quelle ville. Votre chauffeur, qui a vu passer quatre ministres, ne dit rien et roule.",
    "en": "You wake up in an official car without knowing which city you are in. Your driver, who has seen four ministers come and go, says nothing and keeps driving."
  },
  "choices": [
    { "label": { "fr": "Lever le pied pour de bon", "en": "Ease off for good" },
      "effects": { "energie": 3, "standing": -7, "popularity": -3, "flags": { "carefulHealth": true } },
      "result": { "fr": "Vous rendez deux délégations et vous rentrez le vendredi soir. Trois personnes notent votre absence et une seule s'en réjouit.",
                  "en": "You hand back two portfolios and go home on Friday evenings. Three people notice your absence and only one of them is pleased." } },
    { "label": { "fr": "Tenir jusqu'à l'échéance", "en": "Hold on until the next election" },
      "effects": { "trait": "use", "standing": 8, "energie": -1 },
      "result": { "fr": "Vous tenez, évidemment. C'est le métier, et c'est ce que le métier fait aux gens qui le font bien.",
                  "en": "You hold on, of course. It is the job, and it is what the job does to the people who are good at it." } },
    { "label": { "fr": "Réorganiser entièrement votre équipe", "en": "Rebuild your team from top to bottom" },
      "when": { "minMoney": 50000 },
      "effects": { "money": -35000, "energie": 2, "reseau": 1, "standing": 3 },
      "result": { "fr": "Un vrai directeur de cabinet, deux conseillers de plus, et le droit de ne pas tout lire. Cela aurait dû être fait dix ans plus tôt.",
                  "en": "A proper chief of staff, two more advisers, and permission not to read everything. It should have been done ten years earlier." } }
  ]
},


{
  "id": "alerte_sante",
  "weight": 0,
  "delay": [2, 6],
  "when": { "flag": { "frailHealth": false } },
  "tag": { "fr": "Le médecin", "en": "The doctor" },
  "text": {
    "fr": "Un malaise en déplacement, quinze minutes d'inquiétude et un communiqué qui parle de fatigue. Le médecin, lui, ne parle pas de fatigue.",
    "en": "A dizzy spell on a visit, fifteen minutes of alarm, and a statement that mentions tiredness. The doctor does not mention tiredness."
  },
  "choices": [
    { "label": { "fr": "Suivre les consignes à la lettre", "en": "Follow the instructions to the letter" },
      "effects": { "flags": { "carefulHealth": true }, "energie": 2, "standing": -6, "popularity": -2 },
      "result": { "fr": "Un agenda allégé, un régime, deux rendez-vous par mois. Vous vivrez plus longtemps et vous pèserez moins.",
                  "en": "A lighter diary, a diet, two appointments a month. You will live longer and count for less." } },
    { "label": { "fr": "Cacher le diagnostic", "en": "Hide the diagnosis" },
      "effects": { "flags": { "frailHealth": true }, "standing": 4, "sangfroid": 1, "strike": "menteur" },
      "result": { "fr": "Le communiqué parle de fatigue et vous vous y tenez. Trois personnes savent, dont une que vous n'avez pas choisie.",
                  "en": "The statement says tiredness and you stick to it. Three people know, one of whom you did not choose." } }
  ]
},

/* ==========================================================================
   18. CE QUE LES ANNÉES CONFIRMENT
   ==========================================================================
   Ces quatre événements couronnent des histoires que le joueur a déjà vécues :
   le parrainage d'un ancien, les protégés qu'on a formés, la position tenue
   contre son camp, la voix qu'on a reçue. Un trait qui tombe ici n'est pas un
   cadeau du hasard, c'est une carrière qui se retourne pour se regarder.
   ========================================================================== */

{
  "id": "position_impopulaire",
  "weight": 0,
  "delay": [6, 14],
  "tag": { "fr": "Le temps a passé", "en": "Time has passed" },
  "text": {
    "fr": "La position que vous aviez tenue seul contre tout le monde revient dans l'actualité. Les archives ressortent, et la séquence où l'on vous coupait la parole tourne de nouveau.",
    "en": "The position you held alone against everyone is back in the news. The archives resurface, and the clip where they cut you off is doing the rounds again."
  },
  "choices": [
    { "label": { "fr": "Rappeler que vous l'aviez dit", "en": "Remind everyone you said it" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "reputation": 0.5 }, "dice": 16 },
      "success": { "effects": { "trait": "clairvoyant", "notoriete": 1, "popularity": 6 },
        "result": { "fr": "Vous laissez les archives parler et vous ajoutez trois mots. On vous présente désormais comme celui qui avait vu venir, ce qui vaut dix ans de communication.",
                    "en": "You let the archive speak and add three words. You are now introduced as the one who saw it coming, which is worth ten years of press work." } },
      "failure": { "effects": { "popularity": -4, "reputation": -1 },
        "result": { "fr": "Vous insistez trop et le triomphe tourne au règlement de comptes. On retient que vous aviez raison et que vous êtes insupportable.",
                    "en": "You press it too hard and the vindication turns into score-settling. What sticks is that you were right and that you are unbearable." } } },
    { "label": { "fr": "Laisser les autres le dire pour vous", "en": "Let others say it for you" },
      "effects": { "standing": 6, "popularity": 3, "reputation": 1 },
      "result": { "fr": "Vous ne dites rien du tout. Deux éditorialistes et un adversaire le disent à votre place, ce qui est infiniment plus efficace.",
                  "en": "You say nothing at all. Two columnists and one opponent say it for you, which is infinitely more effective." } },
    { "label": { "fr": "Monnayer la séquence auprès de l'appareil", "en": "Cash the moment in with the machine" },
      "when": { "personality": ["calculating"] },
      "effects": { "standing": 14, "popularity": -3, "reputation": -1, "reseau": 1 },
      "result": { "fr": "Vous ne parlez pas au pays, vous parlez à douze personnes qui décident des investitures. Elles se souviennent d'avoir eu tort, et vous le leur rappelez à voix basse.",
                  "en": "You do not talk to the country, you talk to the twelve people who hand out nominations. They remember being wrong, and you remind them quietly." } }
  ]
},


{
  "id": "mentor_encombrant",
  "weight": 0,
  "delay": [8, 18],
  "tag": { "fr": "Votre parrain", "en": "Your patron" },
  "text": {
    "fr": "L'ancien qui vous a fait roi est devenu un poids. Il donne des interviews où il parle de vous au passé, et il rappelle à qui veut l'entendre qu'il vous a tout appris.",
    "en": "The elder who made you has become a burden. He gives interviews where he talks about you in the past tense, and reminds anyone who will listen that he taught you everything."
  },
  "choices": [
    { "label": { "fr": "Le remercier publiquement, une dernière fois", "en": "Thank him publicly, one last time" },
      "effects": { "standing": 6, "popularity": -3, "reputation": 1 },
      "result": { "fr": "Un hommage appuyé, une salle émue, une page tournée que lui seul ne voit pas tourner. Il recommencera dans six mois.",
                  "en": "A heavy tribute, a moved audience, a page turned that only he does not see turning. He will start again in six months." } },
    { "label": { "fr": "Couper les ponts", "en": "Cut him off" },
      "effects": { "standing": -8, "popularity": 6, "sangfroid": 1, "strike": "traitre" },
      "result": { "fr": "Vous cessez de répondre à ses messages et vous le dites à trois journalistes. Vous ne devez plus rien à personne, ce qui coûte exactement ce que ça vaut.",
                  "en": "You stop answering his messages and you tell three journalists so. You owe nobody anything any more, which costs exactly what it is worth." } },
    { "label": { "fr": "Lui trouver une fonction honorifique loin d'ici", "en": "Find him an honorary post a long way away" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "standing": 8, "energie": -1 },
        "result": { "fr": "Une présidence de commission internationale, un bureau avec vue et deux déplacements par mois. Il accepte en croyant avoir gagné.",
                    "en": "The chair of an international commission, an office with a view and two trips a month. He accepts, convinced he has won." } },
      "failure": { "effects": { "standing": -6, "popularity": -2 },
        "result": { "fr": "Il comprend la manœuvre avant la fin du déjeuner et la raconte le soir même. On vous trouve ingrat, ce qui est exact.",
                    "en": "He works out the manoeuvre before lunch is over and tells the story that evening. People find you ungrateful, which is accurate." } } }
  ]
},


{
  "id": "ecole_du_parti",
  "weight": 0,
  "delay": [8, 16],
  "tag": { "fr": "Votre école", "en": "Your school" },
  "text": {
    "fr": "Ceux que vous avez formés se comptent maintenant en dizaines, et ils occupent des postes qui comptent. Un soir, quatre d'entre eux vous proposent de structurer tout ça en courant, avec un nom et des statuts.",
    "en": "The people you trained now number in the dozens, and they hold posts that matter. One evening, four of them propose turning all this into a faction, with a name and a rulebook."
  },
  "choices": [
    { "label": { "fr": "Fonder le courant", "en": "Found the faction" },
      "effects": { "standing": 12, "reseau": 2, "popularity": -4, "reputation": -1,
                   "landscape": { "self": 0.8 } },
      "result": { "fr": "Le courant a un nom, une revue et un dîner annuel. Le parti compte désormais une maison dans la maison, et tout le monde sait qui en a la clé.",
                  "en": "The faction has a name, a journal and an annual dinner. The party now contains a house within the house, and everyone knows who holds the key." } },
    { "label": { "fr": "Refuser de faire écurie", "en": "Refuse to run a stable" },
      "effects": { "reputation": 2, "popularity": 4, "standing": -5 },
      "result": { "fr": "Vous leur dites que vous n'avez pas formé des gens pour qu'ils vous suivent. Deux d'entre eux fondent le courant sans vous le mois suivant.",
                  "en": "You tell them you did not train people so they would follow you. Two of them found the faction without you the following month." } },
    { "label": { "fr": "Les placer un par un, sans rien fonder", "en": "Place them one by one, and found nothing" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "standing": 0.05, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 10, "energie": -2 },
        "result": { "fr": "Pas de courant, pas de revue, pas de dîner : juste vos anciens élèves dans onze commissions et deux fédérations. Personne ne peut le reprocher à personne.",
                    "en": "No faction, no journal, no dinner: just your former students in eleven committees and two federations. Nobody can hold it against anybody." } },
      "failure": { "effects": { "standing": -6, "reseau": -1, "energie": -2 },
        "result": { "fr": "Vous en placez trois et vous vous fâchez avec les autres, qui attendaient leur tour depuis des années.",
                    "en": "You place three of them and fall out with the rest, who had been waiting their turn for years." } } }
  ]
},


{
  "id": "voix_antenne",
  "weight": 4,
  "when": { "trait": ["voix"], "minTurn": 6 },
  "tag": { "fr": "Antenne", "en": "On air" },
  "text": {
    "fr": "Une matinale de radio vous propose une chronique hebdomadaire. Sept minutes, en direct, sur le sujet de votre choix. Le directeur des programmes dit que c'est votre voix qui l'intéresse, pas vos idées, et il le dit gentiment.",
    "en": "A breakfast radio programme offers you a weekly slot. Seven minutes, live, on the subject of your choice. The head of programming says it is your voice he wants, not your ideas, and he says it kindly."
  },
  "choices": [
    { "label": { "fr": "Accepter et y parler du pays", "en": "Accept, and talk about the country" },
      "effects": { "notoriete": 2, "eloquence": 1, "popularity": 8, "energie": -2, "standing": -4 },
      "result": { "fr": "Deux ans de sept minutes hebdomadaires. On vous écoute en voiture, sans vous voir, et c'est le seul endroit où l'on vous laisse finir vos phrases.",
                  "en": "Two years of seven weekly minutes. People listen in the car, without seeing you, and it is the only place where you get to finish your sentences." } },
    { "label": { "fr": "Accepter et régler vos comptes internes", "en": "Accept, and settle your internal scores" },
      "effects": { "notoriete": 2, "popularity": 4, "standing": -12, "reputation": -1,
                   "landscape": { "self": -0.6 } },
      "result": { "fr": "Sept minutes par semaine pour dire tout haut ce qui se dit tout bas au bureau politique. L'audience monte et votre parti apprend à écouter la radio avec angoisse.",
                  "en": "Seven weekly minutes to say out loud what gets muttered in the executive. The ratings climb and your party learns to listen to the radio with dread." } },
    { "label": { "fr": "Refuser, ce n'est pas votre métier", "en": "Refuse, it is not your job" },
      "effects": { "standing": 5, "reputation": 1, "popularity": -3 },
      "result": { "fr": "Vous répondez que vous n'êtes pas un animateur. Le bureau politique approuve, et le créneau va à quelqu'un qui, lui, deviendra ministre.",
                  "en": "You answer that you are not a broadcaster. The executive approves, and the slot goes to somebody who will become a minister." } }
  ]
}
,

/* ==========================================================================
   19. TENIR À VIDE
   --------------------------------------------------------------------------
   L'énergie se dépensait sans jamais rien dire. On la voyait descendre, on
   la voyait toucher le fond, et rien dans le jeu ne s'en apercevait : pas
   une scène ne parlait de la fatigue, et l'on traversait dix ans à sec sans
   qu'un seul personnage vous demande comment vous alliez.

   Ces scènes sortent quand la réserve est basse. Elles proposent toujours la
   même chose sous des formes différentes : lever le pied, ou tenir. Lever le
   pied coûte à l'appareil et rend de la marge ; tenir ne coûte rien tout de
   suite, et c'est exactement ce qui le rend dangereux. La dette de fatigue
   fait le reste (voir wearOut dans js/game.js).
   ========================================================================== */

{
  "id": "fatigue_agenda",
  "weight": 4,
  "when": { "stat": { "energie": { "max": 5 } }, "minTurn": 6 },
  "tag": { "fr": "L'agenda", "en": "The diary" },
  "text": {
    "fr": "Votre directrice de cabinet vous présente la semaine : vingt-huit rendez-vous, quatre déplacements, deux nuits chez vous. Elle ne vous demande plus si cela vous va, elle vous montre l'écran et attend.",
    "en": "Your chief of staff runs you through the week: twenty-eight meetings, four trips, two nights at home. She has stopped asking whether it suits you; she just turns the screen round and waits."
  },
  "choices": [
    { "label": { "fr": "Faire couper la moitié", "en": "Have half of it cut" },
      "effects": { "energie": 4, "sangfroid": 1, "standing": -7, "notoriete": -1 },
      "result": { "fr": "Quatorze annulations en une matinée, dont trois qu'on ne vous reproposera pas. Vous dormez, et le siège apprend le même jour que vous avez commencé à choisir.",
                  "en": "Fourteen cancellations in one morning, three of which will not be offered again. You sleep, and headquarters learns the same day that you have started picking and choosing." } },

    { "label": { "fr": "Tout garder, comme d'habitude", "en": "Keep the lot, as usual" },
      "effects": { "standing": 6, "reseau": 1, "energie": -2, "popularity": 1 },
      "result": { "fr": "Vous faites les vingt-huit. Personne ne vous en remerciera parce que personne n'a vu la semaine, seulement les vingt-huit personnes qui vous ont vu dix minutes chacune.",
                  "en": "You do all twenty-eight. Nobody will thank you because nobody saw the week, only the twenty-eight people who each saw you for ten minutes." } },

    { "label": { "fr": "Envoyer votre suppléant partout où c'est possible", "en": "Send your deputy wherever you can" },
      "roll": { "base": 14, "stat": "reseau", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "energie": 3, "reseau": 2, "standing": -2 },
        "result": { "fr": "Il fait le travail et il le fait bien, ce qui est une bonne et une mauvaise nouvelle. Vous récupérez trois soirées et une question que vous vous poserez encore dans cinq ans.",
                    "en": "He does the job and does it well, which is good news and bad news. You get back three evenings and a question you will still be asking yourself in five years." } },
      "failure": { "effects": { "standing": -8, "popularity": -4, "energie": 1 },
        "result": { "fr": "Deux organisateurs sur trois annulent en apprenant que ce ne sera pas vous. On ne vous invitait pas pour un discours, on vous invitait pour une photo.",
                    "en": "Two organisers out of three cancel on learning it will not be you. They were not inviting you for a speech, they were inviting you for a photograph." } } }
  ]
},

{
  "id": "fatigue_stimulants",
  "weight": 4,
  "cast": "camp",
  "when": { "stat": { "energie": { "max": 3 } }, "notTrait": ["drogue"], "minTurn": 8 },
  "tag": { "fr": "Ce qui fait tenir", "en": "What gets you through" },
  "text": {
    "fr": "{rival} vous voit lutter contre le sommeil à quinze heures et vous glisse une boîte sans étiquette dans la poche, avec un nom de médecin. {Il} ne fait pas de commentaire, ce qui est la façon la plus efficace d'en faire un.",
    "en": "{rival} watches you fight off sleep at three in the afternoon and slips an unlabelled box into your pocket, with a doctor's name. {He} makes no comment, which is the most effective comment available."
  },
  "choices": [
    { "label": { "fr": "Appeler le médecin", "en": "Call the doctor" },
      "effects": { "trait": "drogue", "energie": 4, "money": -3000 },
      "result": { "fr": "Trois semaines plus tard vous tenez les journées de dix-huit heures sans y penser. C'est exactement ce qu'on vous avait promis, et personne ne vous a promis la suite.",
                  "en": "Three weeks later you are getting through eighteen-hour days without thinking about it. That is exactly what was promised, and nobody promised you what comes after." } },

    { "label": { "fr": "Rendre la boîte, sans commentaire non plus", "en": "Hand the box back, without comment either" },
      "effects": { "sangfroid": 2, "reputation": 1, "energie": -1 },
      "result": { "fr": "Vous la reposez sur son bureau le lendemain matin. Rien n'est dit, et vous savez maintenant une chose sur {lui} qu'{il} sait que vous savez.",
                  "en": "You leave it on their desk the next morning. Nothing is said, and you now know something about {him} that {he} knows you know." } },

    { "label": { "fr": "Prendre un vrai rendez-vous médical", "en": "Book a real medical appointment" },
      "effects": { "energie": 3, "flags": { "carefulHealth": true }, "money": -1500, "standing": -3 },
      "result": { "fr": "Analyses, tension, deux ordonnances et une phrase sur le sommeil que vous n'écoutez qu'à moitié. Vous en ressortez avec un cadre, ce qui vaut mieux qu'une boîte.",
                  "en": "Blood work, blood pressure, two prescriptions and a sentence about sleep you only half hear. You come out with a framework, which is worth more than a box." } }
  ]
},

{
  "id": "fatigue_derapage",
  "weight": 4,
  "when": { "stat": { "energie": { "max": 4 } }, "minTurn": 8 },
  "tag": { "fr": "Une phrase de trop", "en": "One sentence too many" },
  "text": {
    "fr": "Quatrième interview de la journée, la même question qu'aux trois premières, et une journaliste qui ne peut pas savoir que c'est la quatrième. Vous sentez très bien ce qui est en train de monter.",
    "en": "The fourth interview of the day, the same question as the first three, and a reporter who has no way of knowing it is the fourth. You can feel exactly what is rising."
  },
  "choices": [
    { "label": { "fr": "Répondre calmement, une fois de plus", "en": "Answer calmly, one more time" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "sangfroid": 1, "reputation": 1, "energie": -1 },
        "result": { "fr": "Vous refaites la réponse pour la quatrième fois avec la même patience qu'à la première. Personne ne saura jamais ce que ces quarante secondes vous ont coûté.",
                    "en": "You give the answer a fourth time with the same patience as the first. Nobody will ever know what those forty seconds cost you." } },
      "failure": { "effects": { "popularity": -8, "reputation": -2, "notoriete": 2, "strike": "menteur", "energie": -1 },
        "result": { "fr": "Vous lâchez six mots sur le niveau des questions qu'on vous pose. La séquence tourne le soir même, et personne ne dira que vous n'aviez pas dormi depuis trois jours.",
                    "en": "You let slip six words about the standard of the questions you get asked. The clip is everywhere by evening, and nobody will mention that you had not slept for three days." } } },

    { "label": { "fr": "Écourter l'entretien poliment", "en": "Cut the interview short, politely" },
      "effects": { "energie": 1, "notoriete": -1, "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Vous invoquez l'horaire, ce que personne ne croit et que tout le monde accepte. La journaliste écrira que vous aviez l'air fatigué, ce qui est le mot qu'on emploie quand on en pense un autre.",
                  "en": "You cite the schedule, which nobody believes and everybody accepts. The reporter will write that you looked tired, which is the word people use when they mean another one." } }
  ]
},

{
  "id": "fatigue_proche",
  "weight": 3,
  "when": { "stat": { "energie": { "max": 4 } }, "minTurn": 12 },
  "tag": { "fr": "Ce qu'on vous dit chez vous", "en": "What they tell you at home" },
  "text": {
    "fr": "Quelqu'un qui vous connaît depuis toujours vous dit, sans élever la voix, que vous n'êtes plus la même personne depuis deux ans. Pas pire : plus la même. C'est la formulation qui vous empêche de répondre.",
    "en": "Someone who has known you forever tells you, without raising their voice, that you have not been the same person for two years. Not worse: not the same. It is the phrasing that stops you answering."
  },
  "choices": [
    { "label": { "fr": "Entendre, et lever le pied pour de bon", "en": "Take it in, and genuinely ease off" },
      "effects": { "energie": 5, "sangfroid": 2, "reputation": 1, "standing": -9, "popularity": -3 },
      "result": { "fr": "Six mois sans un déplacement le week-end. Votre cote au parti le sent passer et vous retrouvez la capacité de finir une phrase, ce qui n'a pas de prix et n'a aucune valeur au siège.",
                  "en": "Six months without a single weekend trip. Your standing in the party feels it, and you get back the ability to finish a sentence, which is priceless and worth nothing at headquarters." } },

    { "label": { "fr": "Promettre que c'est bientôt fini", "en": "Promise it is nearly over" },
      "effects": { "energie": -1, "standing": 2, "reputation": -1 },
      "result": { "fr": "Vous donnez une date, et vous savez en la donnant qu'il y en aura une autre après. C'est la promesse la plus fréquente de la vie politique et la moins souvent tenue.",
                  "en": "You give a date, and you know as you give it that there will be another after it. It is the most common promise in politics and the least often kept." } },

    { "label": { "fr": "Répondre que c'est le métier", "en": "Answer that this is the job" },
      "effects": { "sangfroid": -1, "energie": -1, "standing": 3, "popularity": -1 },
      "result": { "fr": "C'est vrai, et c'est la pire chose à dire. La conversation s'arrête là, et elle ne reprendra pas : on ne discute pas deux fois avec quelqu'un qui a raison.",
                  "en": "It is true, and it is the worst thing to say. The conversation ends there and will not resume: nobody argues twice with somebody who is right." } }
  ]
},

{
  "id": "fatigue_arret",
  "weight": 6,
  "when": { "trait": ["epuise"], "minTurn": 10 },
  "tag": { "fr": "L'arrêt", "en": "The stop" },
  "text": {
    "fr": "Le médecin ne discute pas et ne propose rien : il vous dit ce qui arrivera si vous continuez, avec des mots que vous n'aviez jamais entendus appliqués à vous. Trois mois, dit-il. Vous pensez immédiatement au calendrier.",
    "en": "The doctor does not argue and does not offer options: he tells you what will happen if you carry on, in words you had never heard applied to yourself. Three months, he says. Your first thought is the calendar."
  },
  "choices": [
    { "label": { "fr": "Prendre les trois mois", "en": "Take the three months" },
      "effects": { "untrait": "epuise", "energie": 6, "sangfroid": 2, "standing": -12, "popularity": -5,
                   "flags": { "carefulHealth": true } },
      "result": { "fr": "Un communiqué de six lignes, trois mois de silence, et un retour où l'on vous demande surtout comment vous allez. Vous avez perdu une place dans l'ordre des choses et vous avez récupéré votre corps.",
                  "en": "A six-line statement, three months of silence, and a return where the first thing anyone asks is how you are. You have lost a place in the order of things and got your body back." } },

    { "label": { "fr": "Prendre trois semaines et appeler ça trois mois", "en": "Take three weeks and call it three months" },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "energie": 3, "standing": -4, "reputation": -1 },
        "result": { "fr": "Vingt jours, et vous revenez avant qu'on ait eu le temps de vous remplacer. Vous n'êtes pas guéri, vous êtes reposé, et vous savez très bien que ce n'est pas la même chose.",
                    "en": "Twenty days, and you are back before anyone has had time to replace you. You are not better, you are rested, and you know perfectly well those are not the same thing." } },
      "failure": { "effects": { "energie": -2, "sangfroid": -2, "popularity": -4, "standing": -5 },
        "result": { "fr": "Vous rentrez au bout de neuf jours parce qu'un dossier ne pouvait pas attendre. Il pouvait attendre. Vous le comprendrez plus tard, et pas de vous-même.",
                    "en": "You come back after nine days because a file could not wait. It could have waited. You will realise that later, and not by yourself." } } },

    { "label": { "fr": "Ne rien arrêter du tout", "en": "Stop nothing at all" },
      "effects": { "energie": -2, "sangfroid": -1, "standing": 5, "credibilite": 1 },
      "result": { "fr": "Vous ne prenez pas un jour et personne, dans tout l'appareil, ne vous dit que c'est une erreur. C'est même le contraire : on vous le fait remarquer avec admiration, et c'est ainsi que ces choses finissent.",
                  "en": "You take not one day off, and nobody in the entire machine tells you it is a mistake. Quite the opposite: they point it out admiringly, and that is how these things end." } }
  ]
}
];
