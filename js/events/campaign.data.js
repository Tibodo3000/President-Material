/* Généré — ne pas éditer à la main. */
const EV_campaign = [

/* ==========================================================================
   ÉVÉNEMENTS DE CAMPAGNE PRÉSIDENTIELLE
   ==========================================================================
   Même schéma, mais l'effet "poll" déplace directement les intentions de
   vote. Les amplitudes sont plus fortes : c'est le dernier moment où l'on
   peut renverser une élection.
   ========================================================================== */

{
  "id": "c_debat",
  "moment": 3,
  "required": true,
  "weight": 5,
  "tag": { "fr": "Le grand débat", "en": "The big debate" },
  "text": {
    "fr": "Le grand débat du premier tour. Ils sont sept sur le plateau, chacun a droit à onze minutes, et vingt millions de personnes regardent en attendant qu'il se passe quelque chose.",
    "en": "The first-round debate. Seven of them on set, eleven minutes each, and twenty million people watching for something to happen."
  },
  "choices": [
    { "label": { "fr": "Attaquer frontalement", "en": "Go on the attack" },
      "roll": { "stat": "eloquence", "base": 13, "dice": 16 },
      "success": { "effects": { "poll": 7, "notoriete": 1, "popularity": 8 },
        "result": { "fr": "Vous plantez une réplique qui fera les titres de demain. Le débat est plié.",
                    "en": "You land a line that will lead tomorrow's news. The debate is over." } },
      "failure": { "effects": { "credibilite": -2, "poll": -6, "reputation": -1, "popularity": -7 },
        "result": { "fr": "L'agressivité passe mal. On vous trouve nerveux, presque petit.",
                    "en": "The aggression falls flat. You come across as nervous, almost small." } } },
    { "label": { "fr": "Jouer la hauteur présidentielle", "en": "Play presidential" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "credibilite": +3, "poll": 5, "reputation": 1, "popularity": 5 },
        "result": { "fr": "Calme, précis, au-dessus de la mêlée. Vous avez l'air d'être déjà en fonction.",
                    "en": "Calm, precise, above the fray. You already look like the office." } },
      "failure": { "effects": { "credibilite": -1, "poll": -4, "popularity": -4 },
        "result": { "fr": "Trop lisse. Personne ne retient rien de ce que vous avez dit.",
                    "en": "Too smooth. Nobody remembers a word you said." } } },
    { "label": { "fr": "Sortir un dossier sur votre adversaire", "en": "Produce a file on your opponent" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 8, "notoriete": 2, "reputation": -1 },
        "result": { "fr": "Vous sortez une pièce que personne n'attendait. Il ne s'en relève pas ce soir-là.",
                    "en": "You produce a document nobody expected. He does not recover that evening." } },
      "failure": { "effects": { "poll": -7, "reputation": -2 },
        "result": { "fr": "Le document est contesté en direct. Le coup bas vous revient en pleine figure.",
                    "en": "The document is challenged live. The low blow comes straight back at you." } } },
    { "label": { "fr": "Parler technique et chiffres", "en": "Go technical, with numbers" },
      "when": { "background": ["academia", "civil"] },
      "effects": { "credibilite": +2, "poll": 4, "eloquence": 1, "reputation": 2, "popularity": -4 },
      "result": { "fr": "Vous maîtrisez chaque dossier. C'est austère et curieusement convaincant.",
                  "en": "You have command of every file. It is austere and oddly convincing." } }
  ]
},

{
  "id": "c_meeting",
  "tag": { "fr": "Meeting", "en": "Rally" },
  "text": {
    "fr": "Le meeting central de la campagne. La salle est immense et elle n'est pas encore pleine.",
    "en": "The centrepiece rally of the campaign. The hall is huge and not yet full."
  },
  "choices": [
    { "label": { "fr": "Un discours de rupture", "en": "A rupture speech" },
      "effects": { "axis": "self", "poll": 5, "notoriete": 1, "standing": -6, "popularity": 7 },
      "result": { "fr": "La salle est debout. Votre état-major, lui, est assis, très pâle.",
                  "en": "The hall is on its feet. Your campaign team is seated, very pale." } },
    { "label": { "fr": "Un discours de rassemblement", "en": "A unity speech" },
      "effects": { "poll": 2, "standing": 9, "popularity": -4 },
      "result": { "fr": "Tout le parti applaudit. Le pays, lui, avait déjà changé de chaîne.",
                  "en": "The whole party applauds. The country had already changed channel." } },
    { "label": { "fr": "Remplir la salle avec des cars payés", "en": "Fill the hall with bussed-in crowds" },
      "when": { "minMoney": 120000 },
      "effects": { "poll": 4, "money": -90000, "notoriete": 1, "reputation": -1 },
      "result": { "fr": "Les images sont spectaculaires. Un journaliste comptera les cars sur le parking et en fera un papier.",
                  "en": "The pictures are spectacular. A reporter will count the coaches in the car park and write a piece about it." } },
    { "label": { "fr": "Annoncer une mesure que rien ne finance", "en": "Announce a measure nothing pays for" },
      "effects": { "poll": 6, "popularity": 7, "reputation": -2, "standing": -4, "strike": "menteur" },
      "result": { "fr": "La salle explose. Vos économistes apprennent la nouvelle en même temps que la presse, et se taisent.",
                  "en": "The hall erupts. Your economists learn about it at the same time as the press, and say nothing." } }
  ]
},

{
  "id": "c_revelation",
  "weight": 3,
  "tag": { "fr": "Révélation", "en": "Revelation" },
  "text": {
    "fr": "Un hebdomadaire sort une enquête sur vos années de jeunesse. Rien d'illégal, mais tout est présenté au pire.",
    "en": "A weekly runs an investigation into your younger years. Nothing illegal, but everything is framed at its worst."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point", "en": "Answer point by point" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 2, "reputation": 1, "popularity": 3 },
        "result": { "fr": "Votre démonstration est nette. L'enquête se retourne contre son auteur.",
                    "en": "Your rebuttal is clean. The investigation turns on its author." } },
      "failure": { "effects": { "poll": -5, "popularity": -6 },
        "result": { "fr": "Vous vous enferrez dans les détails. On ne retient que votre embarras.",
                    "en": "You get tangled in detail. Only your discomfort survives." } } },
    { "label": { "fr": "Ignorer et continuer la campagne", "en": "Ignore it and campaign on" },
      "effects": { "poll": -3, "sangfroid": 1, "popularity": -2 },
      "result": { "fr": "Le sujet occupe trois jours de plateaux sans vous. Trois jours perdus.",
                  "en": "The story runs for three days without you. Three days lost." } },
    { "label": { "fr": "En rire et raconter le reste vous-même", "en": "Laugh, and tell the rest yourself" },
      "effects": { "poll": 3, "charisme": 1, "popularity": 6, "reputation": -1 },
      "result": { "fr": "Vous ajoutez deux anecdotes pires que celles de l'enquête. On vous trouve humain, ce qui reste le meilleur des démentis.",
                  "en": "You add two anecdotes worse than the ones in the piece. People find you human, which is still the best denial there is." } },
    { "label": { "fr": "Faire sortir une enquête sur l'adversaire", "en": "Have a story published about your opponent" },
      "when": { "personality": ["calculating"] },
      "effects": { "poll": 4, "notoriete": 1, "reputation": -2, "standing": 3, "strike": "casserole" },
      "result": { "fr": "Deux jours plus tard, un autre journal publie autre chose sur quelqu'un d'autre. Personne ne saura jamais qui a commencé.",
                  "en": "Two days later another paper publishes something else about somebody else. Nobody will ever know who started it." } }
  ]
},

{
  "id": "c_financement",
  "moment": 3,
  "tag": { "fr": "Financement", "en": "Funding" },
  "text": {
    "fr": "La campagne coûte plus que prévu. Il manque de quoi tenir les trois dernières semaines d'affichage.",
    "en": "The campaign is costing more than planned. There is not enough to hold the last three weeks of advertising."
  },
  "choices": [
    { "label": { "fr": "Puiser dans votre fortune personnelle", "en": "Dip into your personal fortune" },
      "effects": { "money": -250000, "poll": 5 },
      "result": { "fr": "Vos affiches couvrent le pays jusqu'au dernier jour.",
                  "en": "Your posters cover the country until the final day." } },
    { "label": { "fr": "Lancer un appel aux dons militants", "en": "Call for grassroots donations" },
      "roll": { "stat": "charisme", "base": 12, "dice": 16 },
      "success": { "effects": { "money": 60000, "poll": 3, "standing": 7 },
        "result": { "fr": "Les petits dons affluent. La campagne repart, et elle vous appartient.",
                    "en": "Small donations pour in. The campaign restarts, and it is yours." } },
      "failure": { "effects": { "poll": -3, "standing": -4 },
        "result": { "fr": "L'appel fait un flop. On mesure votre base réelle, et elle est mince.",
                    "en": "The appeal flops. Your real base is measured, and it is thin." } } },
    { "label": { "fr": "Solliciter vos anciens réseaux d'affaires", "en": "Call on your old business network" },
      "when": { "background": ["business"] },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.15 } ] },
      "success": { "effects": { "money": 180000, "poll": 4, "reputation": -1 },
        "result": { "fr": "Cinq chèques en trois jours. On ne vous demandera rien, et ça vous inquiète.",
                    "en": "Five cheques in three days. Nothing is asked of you, which worries you." } },
      "failure": { "effects": { "poll": -2, "reputation": -2 },
        "result": { "fr": "Un donateur parle à la presse. Le financement devient un sujet.",
                    "en": "One donor talks to the press. The funding becomes the story." } } }
  ]
},

{
  "id": "c_derapage",
  "tag": { "fr": "Incident", "en": "Incident" },
  "text": {
    "fr": "Un proche conseiller tient des propos indéfendables devant un micro qu'il croyait coupé.",
    "en": "A close adviser says something indefensible into a microphone he thought was off."
  },
  "choices": [
    { "label": { "fr": "L'écarter immédiatement", "en": "Cut him loose immediately" },
      "effects": { "poll": 1, "reseau": -1, "standing": -5, "popularity": 2 },
      "result": { "fr": "L'incident est clos en six heures. Votre entourage vous regarde autrement.",
                  "en": "The incident is closed in six hours. Your inner circle looks at you differently." } },
    { "label": { "fr": "Le défendre par loyauté", "en": "Defend him out of loyalty" },
      "effects": { "poll": -6, "standing": 8, "reputation": -1 },
      "result": { "fr": "La fidélité vous honore en interne et vous coûte cher dehors.",
                  "en": "The loyalty honours you inside and costs you dearly outside." } },
    { "label": { "fr": "Parler d'un montage sorti de son contexte", "en": "Call it an edit, taken out of context" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "background": ["comms"] }, "value": 0.25 } ] },
      "success": { "effects": { "poll": 2, "standing": 4, "strike": "menteur" },
        "result": { "fr": "Le doute suffit. La séquence disparaît des plateaux au bout de deux jours.",
                    "en": "Doubt is enough. The clip vanishes from the studios within two days." } },
      "failure": { "effects": { "poll": -8, "reputation": -2, "popularity": -6 },
        "result": { "fr": "L'enregistrement complet sort le soir même. Il est pire que l'extrait.",
                    "en": "The full recording surfaces that evening. It is worse than the clip." } } },
    { "label": { "fr": "Le remplacer par quelqu'un de pire, mais discret", "en": "Replace him with someone worse, but quieter" },
      "when": { "personality": ["calculating"] },
      "effects": { "poll": 1, "reseau": 1, "standing": 2, "reputation": -1 },
      "result": { "fr": "Le nouveau pense exactement la même chose et sait où sont les micros.",
                  "en": "The new one thinks exactly the same things and knows where the microphones are." } }
  ]
},

{
  "id": "c_terrain",
  "moment": 2,
  "tag": { "fr": "Dernière ligne droite", "en": "Final stretch" },
  "text": {
    "fr": "Dix jours avant le vote. Vos équipes hésitent entre saturer les plateaux et sillonner le pays.",
    "en": "Ten days to go. Your teams are split between saturating the studios and touring the country."
  },
  "choices": [
    { "label": { "fr": "Les plateaux télé", "en": "The TV studios" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "poll": 4, "notoriete": 1, "energie": -2, "popularity": 5 },
      "result": { "fr": "Vous êtes partout à l'écran. Le nom circule, la fatigue aussi.",
                  "en": "You are everywhere on screen. The name spreads, and so does the exhaustion." } },
    { "label": { "fr": "Le terrain, marché après marché", "en": "The ground, market by market" },
      "effects": { "poll": 3, "reputation": 1, "standing": 5, "energie": -1 },
      "result": { "fr": "Des milliers de mains serrées. Les images sont bonnes, l'effet est lent.",
                  "en": "Thousands of hands shaken. The pictures are good, the effect is slow." } },
    { "label": { "fr": "Acheter la campagne en ligne", "en": "Buy the campaign online" },
      "when": { "minMoney": 200000 },
      "effects": { "poll": 5, "money": -180000, "notoriete": 2, "reputation": -1, "energie": 1 },
      "result": { "fr": "Des vidéos ciblées, découpées par âge et par code postal. Vous ne saurez jamais lesquelles ont marché.",
                  "en": "Targeted videos, cut by age group and postcode. You will never know which ones worked." } },
    { "label": { "fr": "Dormir trois jours et préparer le débat", "en": "Sleep for three days and prepare the debate" },
      "effects": { "poll": -2, "energie": 3, "sangfroid": 1, "eloquence": 1 },
      "result": { "fr": "Vos équipes trouvent l'idée absurde. Vous arrivez au dernier débat reposé, ce qui ne s'était jamais vu.",
                  "en": "Your staff think it is absurd. You arrive at the final debate rested, which has never happened before." } }
  ]
},

{
  "id": "c_programme",
  "tag": { "fr": "Programme", "en": "Manifesto" },
  "text": {
    "fr": "Les économistes réclament un chiffrage. Votre programme coûte cher et tout le monde le sait.",
    "en": "The economists want costings. Your manifesto is expensive and everyone knows it."
  },
  "choices": [
    { "label": { "fr": "Assumer le coût", "en": "Own the cost" },
      "effects": { "axis": {"economy": -55}, "poll": 3, "popularity": 6, "standing": -3 },
      "result": { "fr": "« Ça coûte, et alors ? » La franchise plaît plus que la prudence.",
                  "en": "“It costs money, so what?” The bluntness plays better than caution." } },
    { "label": { "fr": "Revoir les promesses à la baisse", "en": "Scale the promises back" },
      "effects": { "poll": -4, "reputation": 1, "standing": 6 },
      "result": { "fr": "Les éditorialistes saluent le sérieux. Vos électeurs, eux, se sentent floués.",
                  "en": "The commentators praise the seriousness. Your voters feel short-changed." } },
    { "label": { "fr": "Publier un chiffrage écrit par un cabinet ami", "en": "Publish costings written by a friendly firm" },
      "when": { "minMoney": 100000 },
      "effects": { "poll": 3, "money": -80000, "eloquence": 1, "reputation": -1 },
      "result": { "fr": "Quatre-vingt-douze pages que personne ne lira, et un tableau que tout le monde citera.",
                  "en": "Ninety-two pages nobody will read, and one table everybody will quote." } },
    { "label": { "fr": "Expliquer qu'on financera par la croissance", "en": "Explain that growth will pay for it" },
      "effects": { "axis": {"economy": 50}, "poll": 2, "popularity": 6, "reputation": -2, "standing": 2 },
      "result": { "fr": "L'argument a servi à tous vos prédécesseurs, dans les deux camps, et il fonctionne encore.",
                  "en": "The argument has served all your predecessors, on both sides, and it still works." } }
  ]
},

{
  "id": "c_sondage_choc",
  "tag": { "fr": "Sondage", "en": "Poll" },
  "text": {
    "fr": "Un sondage bouscule la campagne et concentre soudain tous les regards sur vous.",
    "en": "A poll shakes the campaign and suddenly turns every eye towards you."
  },
  "choices": [
    { "label": { "fr": "Changer de ton, tout risquer", "en": "Change tone, risk everything" },
      "roll": { "stat": "charisme", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 6, "popularity": 6 },
        "result": { "fr": "Le virage surprend et fonctionne. La dynamique change de camp.",
                    "en": "The shift surprises and works. The momentum changes sides." } },
      "failure": { "effects": { "poll": -5, "popularity": -5, "standing": -4 },
        "result": { "fr": "Le revirement se voit trop. On parle de panique.",
                    "en": "The U-turn is too visible. People are calling it panic." } } },
    { "label": { "fr": "Tenir la ligne sans dévier", "en": "Hold the line" },
      "effects": { "poll": 1, "sangfroid": 1, "standing": 4, "popularity": -3 },
      "result": { "fr": "Vous ne bougez pas d'un mot. Le calme finit par se voir.",
                  "en": "You do not move an inch. The steadiness eventually shows." } },
    { "label": { "fr": "Contester la méthode du sondage", "en": "Attack the polling method" },
      "effects": { "poll": -2, "notoriete": 1, "standing": 3, "reputation": -1 },
      "result": { "fr": "Vous expliquez ce qu'est un redressement pendant onze minutes. Les gens retiennent le chiffre.",
                  "en": "You explain sample weighting for eleven minutes. People remember the number." } },
    { "label": { "fr": "Commander votre propre sondage", "en": "Commission your own poll" },
      "when": { "minMoney": 80000 },
      "effects": { "poll": 3, "money": -60000, "reseau": 1, "reputation": -1 },
      "result": { "fr": "Les questions sont formulées avec soin. Votre sondage vous donne gagnant, ce qui étonne peu de monde.",
                  "en": "The questions are carefully worded. Your poll has you winning, which surprises very few people." } }
  ]
},

{
  "id": "c_affaire",
  "moment": 3,
  "weight": 5,
  "when": { "flag": { "dirtyMoney": true } },
  "tag": { "fr": "Affaire", "en": "Scandal" },
  "text": {
    "fr": "À trois semaines du scrutin, le financement de vos débuts ressort en une. Le calendrier n'a rien d'un hasard.",
    "en": "Three weeks from the vote, the funding of your early years is back on the front page. The timing is no accident."
  },
  "choices": [
    { "label": { "fr": "Crier au complot", "en": "Cry conspiracy" },
      "effects": { "poll": -3, "notoriete": 1, "standing": 4 },
      "result": { "fr": "Votre camp se resserre autour de vous. Les indécis, eux, s'éloignent.",
                  "en": "Your camp closes ranks. The undecided drift away." } },
    { "label": { "fr": "Tout publier vous-même", "en": "Publish everything yourself" },
      "effects": { "poll": -6, "reputation": 2, "popularity": -4, "flags": { "dirtyMoney": false } },
      "result": { "fr": "Le geste coupe court à l'affaire. Il coûte des points qu'on ne rattrape pas.",
                  "en": "The move ends the story. It costs points you will not get back." } },
    { "label": { "fr": "Sortir un dossier sur l'adversaire le lendemain", "en": "Drop a file on your opponent the next day" },
      "effects": { "poll": 3, "notoriete": 2, "reputation": -2, "strike": "casserole" },
      "result": { "fr": "La campagne devient un échange de dossiers. Les deux camps y perdent, vous un peu moins.",
                  "en": "The campaign turns into an exchange of files. Both sides lose; you lose slightly less." } },
    { "label": { "fr": "Répondre une fois, puis parler d'autre chose", "en": "Answer once, then talk about something else" },
      "effects": { "poll": -1, "sangfroid": 1, "eloquence": 1, "popularity": -2 },
      "result": { "fr": "Une réponse de deux minutes, puis quatre jours de propositions. C'est la seule méthode qui marche, et personne ne l'applique.",
                  "en": "A two-minute answer, then four days of policy. It is the only method that works, and nobody uses it." } }
  ]
},

{
  "id": "c_veille",
  "moment": 1,
  "weight": 3,
  "tag": { "fr": "Veille du scrutin", "en": "Election eve" },
  "text": {
    "fr": "Dernier soir. Il reste une intervention, et rien ne sera plus dit après elle.",
    "en": "The last evening. One appearance remains, and nothing will be said after it."
  },
  "choices": [
    { "label": { "fr": "Un appel solennel au pays", "en": "A solemn address to the country" },
      "roll": { "stat": "eloquence", "base": 12, "dice": 16 },
      "success": { "effects": { "poll": 5, "popularity": 5 },
        "result": { "fr": "Le ton est juste. Beaucoup se couchent en ayant choisi.",
                    "en": "The tone is right. Many go to bed having made up their minds." } },
      "failure": { "effects": { "poll": -2 },
        "result": { "fr": "L'exercice est convenu. On l'oublie avant la fin.",
                    "en": "The exercise is conventional. It is forgotten before it ends." } } },
    { "label": { "fr": "Un dernier bain de foule", "en": "One last walkabout" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "poll": 3, "energie": -2, "popularity": 3 },
      "result": { "fr": "Les images de foule tournent en boucle toute la nuit.",
                  "en": "The crowd footage runs on a loop all night." } },
    { "label": { "fr": "Un dernier direct sans filtre", "en": "One last unfiltered live" },
      "when": { "personality": ["provocative"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "notoriete": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "notoriete": 2 },
        "result": { "fr": "Deux heures sans script, sans conseiller. Le pays voit quelqu'un de vrai.",
                    "en": "Two hours with no script, no advisers. The country sees someone real." } },
      "failure": { "effects": { "poll": -6, "reputation": -2 },
        "result": { "fr": "Une phrase de trop, la veille du vote. Le pire moment possible.",
                    "en": "One sentence too many, the night before the vote. The worst possible timing." } } }
  ]
},

{
  "id": "c_attaque_perso",
  "tag": { "fr": "Coup bas", "en": "Below the belt" },
  "text": {
    "fr": "Un adversaire attaque votre vie privée en meeting. La salle rit, les caméras tournent.",
    "en": "An opponent attacks your private life at a rally. The room laughs, the cameras roll."
  },
  "choices": [
    { "label": { "fr": "Répondre sur le même terrain", "en": "Answer in kind" },
      "roll": { "chance": 0.45 },
      "success": { "effects": { "poll": 4, "notoriete": 1 },
        "result": { "fr": "Votre riposte est pire que l'attaque. On ne parle que de ça.",
                    "en": "Your counter is worse than the attack. Nobody talks about anything else." } },
      "failure": { "effects": { "poll": -5, "reputation": -2 },
        "result": { "fr": "La surenchère vous rabaisse tous les deux, et vous plus que lui.",
                    "en": "The escalation diminishes you both, and you more than him." } } },
    { "label": { "fr": "Refuser d'entrer là-dedans", "en": "Refuse to go there" },
      "effects": { "poll": 3, "reputation": 2, "popularity": 4, "notoriete": -1, "standing": -3 },
      "result": { "fr": "« Parlons du pays. » La phrase fait le tour des réseaux.",
                  "en": "“Let's talk about the country.” The line travels everywhere." } },
    { "label": { "fr": "Faire répondre votre famille à votre place", "en": "Have your family answer for you" },
      "effects": { "poll": 2, "popularity": 6, "reputation": -1, "energie": -1 },
      "result": { "fr": "Une tribune signée de vos proches, écrite par votre communicant. Elle est très émouvante.",
                  "en": "An open letter signed by your family, written by your press officer. It is very moving." } },
    { "label": { "fr": "Porter plainte en direct", "en": "Announce a lawsuit on air" },
      "effects": { "poll": -1, "notoriete": 2, "standing": 4, "popularity": -3 },
      "result": { "fr": "La procédure durera plus longtemps que le mandat que vous visez.",
                  "en": "The case will outlast the term you are running for." } }
  ]
},

{
  "id": "c_crise",
  "tag": { "fr": "Crise", "en": "Crisis" },
  "text": {
    "fr": "Une catastrophe frappe le pays en pleine campagne. Tout le monde suspend ses meetings.",
    "en": "A disaster strikes the country mid-campaign. Everyone suspends their rallies."
  },
  "choices": [
    { "label": { "fr": "Suspendre et se rendre sur place", "en": "Suspend and go there" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "poll": 4, "reputation": 2, "energie": -2, "popularity": 6 },
      "result": { "fr": "Vous y êtes avant les autres et vous n'y faites pas de discours.",
                  "en": "You get there before the others, and you make no speech." } },
    { "label": { "fr": "Continuer la campagne discrètement", "en": "Quietly keep campaigning" },
      "effects": { "poll": -4, "reputation": -2, "standing": 3 },
      "result": { "fr": "Vous gagnez trois jours d'avance et une réputation de froideur.",
                  "en": "You gain three days of advantage and a reputation for coldness." } },
    { "label": { "fr": "Financer les secours sur vos fonds de campagne", "en": "Fund the relief effort from campaign money" },
      "when": { "minMoney": 150000 },
      "effects": { "poll": 3, "money": -120000, "reputation": 2, "popularity": 5, "standing": -2 },
      "result": { "fr": "Le chèque est réel, la photo aussi. On vous reprochera surtout la photo.",
                  "en": "The cheque is real; so is the photo. What people will hold against you is mostly the photo." } },
    { "label": { "fr": "Accuser le gouvernement d'impréparation", "en": "Blame the government for being unprepared" },
      "effects": { "axis": "self", "poll": 2, "notoriete": 2, "popularity": 6, "reputation": -2, "standing": 4 },
      "result": { "fr": "Vous parlez de responsabilité pendant que les secours travaillent. Une partie du pays trouve que c'est le moment, l'autre non.",
                  "en": "You talk about accountability while the rescue teams work. Half the country thinks it is the moment; the other half does not." } }
  ]
},

{
  "id": "c_parrainages",
  "moment": [6, 4],
  "weight": 3,
  "tag": { "fr": "Les signatures", "en": "The signatures" },
  "text": {
    "fr": "Cinq cents signatures de maires, et le compteur affiche quatre cent douze à trois semaines de la date limite. Ceux qui manquent ne vous doivent rien et savent très exactement ce qu'ils valent.",
    "en": "Five hundred mayors' signatures, and the counter says four hundred and twelve with three weeks to the deadline. The ones you are missing owe you nothing and know exactly what they are worth."
  },
  "choices": [
    { "label": { "fr": "Faire le tour des départements un par un", "en": "Tour the counties one by one" },
      "effects": { "poll": 2, "reseau": 2, "credibilite": 1, "energie": -3 },
      "result": { "fr": "Onze jours de routes départementales et de salles des fêtes. Vous rentrez avec vos signatures et trois cents numéros de portable qui serviront pendant vingt ans.",
                  "en": "Eleven days of back roads and village halls. You come home with your signatures and three hundred mobile numbers that will be useful for twenty years." } },
    { "label": { "fr": "Laisser le parti s'en charger", "en": "Let the party handle it" },
      "effects": { "poll": -1, "standing": -4, "energie": 2 },
      "result": { "fr": "Le siège les trouve en huit jours, parce que c'est son métier. On vous fera remarquer pendant cinq ans que vous n'y étiez pour rien.",
                  "en": "Headquarters finds them in eight days, because that is their job. You will be reminded for five years that you had nothing to do with it." } },
    { "label": { "fr": "Dénoncer publiquement le filtre des parrainages", "en": "Denounce the signature filter in public" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "axis": {"power": -55}, "poll": 3, "popularity": 7, "notoriete": 2, "credibilite": -1 },
        "result": { "fr": "Vous transformez une formalité administrative en question démocratique. Les signatures arrivent quand même, apportées par des maires qui n'aiment pas qu'on les prenne pour un guichet.",
                    "en": "You turn an administrative formality into a democratic question. The signatures come anyway, from mayors who dislike being treated as a counter clerk." } },
      "failure": { "effects": { "poll": -4, "popularity": -3, "credibilite": -2 },
        "result": { "fr": "On vous répond que le filtre existait aussi les années où il vous arrangeait. La séquence dure quatre jours et ne parle que de vous.",
                    "en": "You are reminded the filter also existed in the years it suited you. The sequence runs for four days and is about nothing but you." } } },
    { "label": { "fr": "Payer trois équipes pour ratisser le pays", "en": "Pay three teams to comb the country" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -120000, "poll": 3, "energie": 1, "reputation": -1 },
      "result": { "fr": "Quinze salariés, six semaines, et les cinq cents signatures déposées avec quatre jours d'avance. La ligne apparaîtra dans vos comptes de campagne sous un intitulé prudent.",
                  "en": "Fifteen staff, six weeks, and the five hundred signatures filed four days early. The line will appear in your campaign accounts under a careful heading." } }
  ]
},

{
  "id": "c_affiche",
  "moment": [6, 4],
  "tag": { "fr": "L'affiche", "en": "The poster" },
  "text": {
    "fr": "L'affiche officielle et le slogan. Trois agences ont travaillé, il reste trois maquettes sur la table, et tout le monde autour de vous a un avis définitif.",
    "en": "The official poster and the slogan. Three agencies have worked on it, three mock-ups are left on the table, and everybody around you has a final opinion."
  },
  "choices": [
    { "label": { "fr": "Le visage en gros plan, fond uni, un seul mot", "en": "Face in close-up, flat background, one word" },
      "effects": { "poll": 2, "notoriete": 2, "popularity": 2 },
      "result": { "fr": "Cela ne dit rien et cela se retient. C'est exactement ce qu'on demande à une affiche, et personne dans la salle ne l'admettra jamais.",
                  "en": "It says nothing and it sticks. That is exactly what a poster is for, and nobody in the room will ever admit it." } },
    { "label": { "fr": "Une phrase longue, qui dit vraiment ce que vous pensez", "en": "A long sentence that actually says what you think" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 2, "reputation": 1 },
        "result": { "fr": "Douze mots sur fond blanc. On les cite, on les discute, on finit par les retourner contre vous, et c'est le signe qu'ils portent.",
                    "en": "Twelve words on white. They get quoted, argued over, eventually turned against you, which is the proof they land." } },
      "failure": { "effects": { "poll": -3, "popularity": -4, "notoriete": 1 },
        "result": { "fr": "Personne ne la lit en entier. Les caricaturistes, si.",
                    "en": "Nobody reads it to the end. The cartoonists do." } } },
    { "label": { "fr": "Vous au milieu d'une foule, sans slogan", "en": "You in a crowd, no slogan" },
      "effects": { "poll": 1, "appeal": { "self": 6 }, "credibilite": -2 },
      "result": { "fr": "Une image chaleureuse et parfaitement vide. Vos électeurs la trouvent belle, vos adversaires la trouvent commode.",
                  "en": "A warm and perfectly empty image. Your voters find it beautiful; your opponents find it convenient." } },
    { "label": { "fr": "Laisser l'agence choisir la photo qui vous flatte le plus", "en": "Let the agency pick the photo that flatters you most" },
      "when": { "anyTrait": ["beau", "stature", "athletique"] },
      "effects": { "poll": 2, "popularity": 7, "reputation": -1, "credibilite": -1 },
      "result": { "fr": "Deux heures de retouches sur une photo déjà bonne. Elle est partout en quinze jours, et deux personnes seulement remarquent le travail.",
                  "en": "Two hours of retouching on an already good photograph. It is everywhere within a fortnight, and exactly two people notice the work." } }
  ]
},

{
  "id": "c_matinale",
  "weight": 3,
  "tag": { "fr": "La matinale", "en": "The breakfast show" },
  "text": {
    "fr": "Huit heures vingt, la matinale la plus écoutée du pays. Après onze minutes de fond, le journaliste sourit et vous demande le prix d'un ticket de métro.",
    "en": "Twenty past eight, the country's most listened-to breakfast show. After eleven minutes of substance, the interviewer smiles and asks you the price of a metro ticket."
  },
  "choices": [
    { "label": { "fr": "Donner un chiffre et l'assumer", "en": "Give a figure and stand by it" },
      "roll": { "chance": 0.5 },
      "success": { "effects": { "poll": 2, "popularity": 4 },
        "result": { "fr": "Vous tombez juste à dix centimes près. Ce n'est rien du tout et cela vous suit favorablement pendant une semaine.",
                    "en": "You are right to within ten cents. It means nothing at all and it follows you favourably for a week." } },
      "failure": { "effects": { "poll": -5, "popularity": -7, "credibilite": -1 },
        "result": { "fr": "Vous vous trompez de quarante centimes. Le pays en parle jusqu'à jeudi, et personne ne vous demandera plus votre programme d'ici le vote.",
                    "en": "You are off by forty cents. The country talks about it until Thursday, and nobody will ask you about your manifesto again before the vote." } } },
    { "label": { "fr": "Dire que vous ne savez pas, et pourquoi la question est mauvaise", "en": "Say you do not know, and why the question is a poor one" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 15 },
      "success": { "effects": { "poll": 1, "credibilite": 2, "reputation": 2, "popularity": -2 },
        "result": { "fr": "Vous refusez le jeu sans le mépriser, ce qui est plus difficile que d'y répondre. La séquence est reprise comme un moment de franchise.",
                    "en": "You refuse the game without sneering at it, which is harder than answering. The clip goes round as a moment of candour." } },
      "failure": { "effects": { "poll": -3, "popularity": -6 },
        "result": { "fr": "On retient que vous n'avez pas su, et rien de ce que vous avez dit ensuite.",
                    "en": "What sticks is that you did not know, and nothing you said afterwards." } } },
    { "label": { "fr": "Sortir le chiffre exact et enchaîner sur trois autres", "en": "Give the exact figure and add three more" },
      "when": { "anyTrait": ["bosseur", "clairvoyant"] },
      "effects": { "poll": 3, "credibilite": 2, "popularity": 1 },
      "result": { "fr": "Le prix, la hausse depuis cinq ans, et ce que cela représente pour un salaire médian. Le journaliste passe à autre chose plus vite que prévu.",
                  "en": "The price, the rise over five years, and what it means on a median wage. The interviewer moves on faster than planned." } },
    { "label": { "fr": "Retourner la question au journaliste", "en": "Put the question back to the interviewer" },
      "when": { "personality": ["provocative"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 2, "popularity": 8, "notoriete": 2, "reputation": -1 },
        "result": { "fr": "Il ne sait pas non plus. Les huit secondes de silence qui suivent sont vues quatre millions de fois avant midi.",
                    "en": "He does not know either. The eight seconds of silence that follow are watched four million times before lunch." } },
      "failure": { "effects": { "poll": -4, "popularity": -5, "reputation": -1 },
        "result": { "fr": "Il connaît le chiffre, et il le donne. Vous passez le reste de l'entretien à réparer les trente secondes précédentes.",
                    "en": "He knows the figure, and he gives it. You spend the rest of the interview repairing the previous thirty seconds." } } }
  ]
},

{
  "id": "c_salon",
  "weight": 3,
  "tag": { "fr": "Le Salon", "en": "The farm show" },
  "text": {
    "fr": "Le Salon de l'agriculture. Huit heures dans les allées, une vache à tapoter toutes les vingt minutes, et une caméra qui attend patiemment le moment où vous ne saurez plus quoi dire.",
    "en": "The agricultural show. Eight hours in the aisles, a cow to pat every twenty minutes, and a camera waiting patiently for the moment you run out of things to say."
  },
  "choices": [
    { "label": { "fr": "Y passer la journée entière, sans raccourci", "en": "Stay the whole day, no shortcuts" },
      "effects": { "poll": 2, "popularity": 6, "standing": 2, "energie": -3 },
      "result": { "fr": "Neuf heures, quatorze stands, deux verres de trop et pas une phrase de travers. C'est le genre de journée qui ne fait aucun titre et qui se voit dans les urnes.",
                  "en": "Nine hours, fourteen stands, two drinks too many and not one wrong sentence. It is the kind of day that makes no headline and shows up in the ballot boxes." } },
    { "label": { "fr": "Une heure, les photos, et repartir", "en": "One hour, the photographs, and out" },
      "effects": { "poll": -2, "popularity": -4, "energie": 1 },
      "result": { "fr": "Vous repartez à onze heures. La photo est bonne, la vidéo de votre départ l'est encore plus, et elle circule tout l'après-midi.",
                  "en": "You leave at eleven. The photograph is good, the video of your departure is better, and it circulates all afternoon." } },
    { "label": { "fr": "Annoncer une mesure agricole au milieu des allées", "en": "Announce a farm policy in the middle of the aisles" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "credibilite": 1, "popularity": 3, "energie": -2 },
        "result": { "fr": "Chiffrée, datée, et défendue debout devant quarante personnes qui connaissent le dossier. On en parle deux jours, sérieusement.",
                    "en": "Costed, dated, and defended standing up in front of forty people who know the file. It is discussed for two days, seriously." } },
      "failure": { "effects": { "poll": -3, "credibilite": -2, "reputation": -1, "energie": -2 },
        "result": { "fr": "La mesure est démontée en direct par un syndicaliste qui maîtrise le sujet mieux que vous. L'échange dure six minutes et passe en boucle.",
                    "en": "The policy is taken apart live by a union man who knows the subject better than you. The exchange lasts six minutes and plays on a loop." } } },
    { "label": { "fr": "Parler de vos grands-parents, et le penser vraiment", "en": "Talk about your grandparents, and mean it" },
      "when": { "origin": ["modest"] },
      "effects": { "axis": {"economy": -50}, "poll": 2, "popularity": 7, "reputation": 1, "energie": -1 },
      "result": { "fr": "Vous racontez une ferme de dix-huit hectares et ce qu'elle est devenue. Ce n'est pas une séquence de campagne, et c'est pour ça qu'elle marche.",
                  "en": "You describe an eighteen-hectare farm and what became of it. It is not a campaign moment, which is exactly why it works." } }
  ]
},

{
  "id": "c_usine",
  "moment": 3,
  "tag": { "fr": "L'usine", "en": "The factory" },
  "text": {
    "fr": "Une usine de quatre cents personnes annonce sa fermeture à trois semaines du vote. Les salariés vous attendent au portail, et les caméras aussi.",
    "en": "A factory employing four hundred people announces its closure three weeks before the vote. The workers are waiting at the gate, and so are the cameras."
  },
  "choices": [
    { "label": { "fr": "Y aller et monter sur le piquet", "en": "Go, and get up on the picket" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "axis": {"economy": -75}, "poll": 4, "popularity": 8, "credibilite": -1, "energie": -2 },
        "result": { "fr": "Quatre cents personnes, un mégaphone qui grésille, et douze minutes qui font le journal de vingt heures. Personne ne vous demande le financement.",
                    "en": "Four hundred people, a crackling megaphone, and twelve minutes that lead the evening news. Nobody asks you how it would be paid for." } },
      "failure": { "effects": { "poll": -3, "popularity": -5, "reputation": -1, "energie": -2 },
        "result": { "fr": "On vous demande ce que vous ferez, concrètement, lundi. Vous n'avez que des mots et la question reste dans l'air jusqu'au vote.",
                    "en": "You are asked what you would actually do, on Monday. You have only words, and the question hangs there until the vote." } } },
    { "label": { "fr": "Y aller, écouter, et ne rien promettre", "en": "Go, listen, and promise nothing" },
      "effects": { "poll": 1, "popularity": 3, "credibilite": 2, "reputation": 1, "energie": -1 },
      "result": { "fr": "Trois heures sans un mot de trop. Les salariés repartent sans rien, ce qu'ils avaient prévu, et sans mépris, ce qu'ils n'avaient pas prévu.",
                  "en": "Three hours without a single word too many. The workers leave with nothing, which they expected, and without contempt, which they did not." } },
    { "label": { "fr": "Ne pas y aller et recevoir les délégués", "en": "Stay away and receive the shop stewards" },
      "effects": { "poll": -2, "popularity": -4, "credibilite": 1, "standing": 2, "energie": 1 },
      "result": { "fr": "Une heure et quart dans un bureau, sans caméra. C'est plus utile pour eux et beaucoup moins pour vous, et ce déséquilibre-là dit tout du métier.",
                  "en": "An hour and a quarter in an office, no cameras. It is more use to them and far less to you, and that imbalance says everything about the trade." } },
    { "label": { "fr": "Expliquer pourquoi l'usine ferme, vraiment", "en": "Explain why the factory is really closing" },
      "when": { "background": ["business"] },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "axis": {"economy": 60}, "poll": 2, "credibilite": 3, "reputation": 2, "popularity": 5 },
        "result": { "fr": "Vous dites la vérité sur un plateau et on ne vous coupe pas. Une partie du pays vous trouve dur, une autre note que vous ne mentez pas.",
                    "en": "You tell the truth on air and nobody cuts you off. Part of the country finds you hard; another part notes that you are not lying." } },
      "failure": { "effects": { "poll": -5, "popularity": -8, "credibilite": -1 },
        "result": { "fr": "La phrase est juste et sonne comme du mépris. Elle sera reprise sans son contexte jusqu'au dimanche du premier tour.",
                    "en": "The sentence is accurate and sounds like contempt. It will be replayed without its context until first-round Sunday." } } }
  ]
},

{
  "id": "c_outre_mer",
  "tag": { "fr": "Déplacement", "en": "The long trip" },
  "text": {
    "fr": "Trois jours outre-mer : huit mille kilomètres, quatre déplacements, et deux minutes au journal de vingt heures si l'actualité métropolitaine le permet.",
    "en": "Three days overseas: eight thousand kilometres, four visits, and two minutes on the evening news if the mainland allows it."
  },
  "choices": [
    { "label": { "fr": "Faire le déplacement complet", "en": "Do the whole trip" },
      "effects": { "poll": 2, "standing": 3, "reputation": 1, "popularity": 2, "energie": -3 },
      "result": { "fr": "Quatre-vingt-dix pour cent de ce que vous direz là-bas ne sera pas diffusé. Les dix pour cent restants seront entendus par des gens dont personne d'autre ne s'occupe.",
                  "en": "Ninety per cent of what you say there will never be broadcast. The remaining ten will be heard by people nobody else bothers with." } },
    { "label": { "fr": "Envoyer un proche et enregistrer un message", "en": "Send a lieutenant and record a message" },
      "effects": { "poll": -1, "standing": -2, "popularity": -2, "energie": 1 },
      "result": { "fr": "Le message dure quatre minutes et commence par « je regrette de ne pas être parmi vous ». Personne n'est dupe et tout le monde fait comme si.",
                  "en": "The message runs four minutes and opens with “I am sorry not to be with you”. Nobody is fooled and everybody plays along." } },
    { "label": { "fr": "Annuler et rester en métropole", "en": "Cancel and stay on the mainland" },
      "effects": { "poll": 1, "standing": -3, "reputation": -2, "energie": 2 },
      "result": { "fr": "Vous gagnez trois jours de campagne utile et vous perdez un argument que vous ne pourrez plus jamais utiliser.",
                  "en": "You gain three days of useful campaigning and lose an argument you will never be able to use again." } }
  ]
},

{
  "id": "c_pacte",
  "cast": "minor",
  "when": { "allied": false },
  "moment": 4,
  "tag": { "fr": "Le pacte", "en": "The pact" },
  "text": {
    "fr": "{rival} dirige un parti voisin qui plafonne à cinq pour cent et le sait. {Il} vous propose un marché : plus une attaque d'ici dimanche, un appel à voter pour vous au second tour, et vous reprenez trois de ses mesures dans votre programme.",
    "en": "{rival} leads a neighbouring party stuck at five per cent and knows it. {He} offers a deal: no more attacks before Sunday, an endorsement in the runoff, and you take three of {his} policies into your manifesto."
  },
  "choices": [
    { "label": { "fr": "Signer le pacte", "en": "Sign the pact" },
      "effects": { "alliance": "scene", "poll": 3, "standing": -4, "reputation": -1,
                   "landscape": { "self": 0.5 } },
      "result": { "fr": "Deux communiqués à la même heure et une photo de poignée de main que vous regretterez peut-être. Ses électeurs, eux, iront vraiment jusqu'au bout.",
                  "en": "Two statements at the same hour and a handshake photograph you may come to regret. {His} voters, though, will genuinely go the distance." } },
    { "label": { "fr": "Reprendre ses mesures sans rien signer", "en": "Take the policies and sign nothing" },
      "effects": { "poll": 2, "reputation": -2, "reseau": -2 },
      "result": { "fr": "Vous prenez ce qui vous intéresse et vous ne rendez rien. {Il} le dira partout, et {il} aura raison.",
                  "en": "You take what suits you and give nothing back. {He} will say so everywhere, and {he} will be right." } },
    { "label": { "fr": "Refuser : vous ne devrez rien à personne", "en": "Refuse: you will owe nobody anything" },
      "effects": { "poll": -1, "credibilite": 2, "reputation": 2, "standing": 3 },
      "result": { "fr": "Vous expliquez que votre camp n'a besoin de personne. C'est faux, et cela se vérifiera au second tour.",
                  "en": "You explain that your side needs nobody. It is untrue, and it will be demonstrated in the runoff." } }
  ]
},

{
  "id": "c_famille",
  "tag": { "fr": "Vie privée", "en": "Private life" },
  "text": {
    "fr": "Un magazine propose une double page sur votre vie privée. Votre entourage y est très favorable, les gens qui figureraient sur les photos un peu moins.",
    "en": "A magazine offers a double-page spread on your private life. Your team is strongly in favour; the people who would be in the photographs rather less so."
  },
  "choices": [
    { "label": { "fr": "Accepter et poser en famille", "en": "Accept and pose with the family" },
      "effects": { "poll": 3, "popularity": 7, "credibilite": -2, "reputation": -1 },
      "result": { "fr": "Les photos sont belles et tout le monde y est consentant, à peu près. Elles ressortiront à chaque mauvaise semaine des dix prochaines années.",
                  "en": "The photographs are lovely and everybody consented, more or less. They will resurface in every bad week of the next ten years." } },
    { "label": { "fr": "Refuser catégoriquement", "en": "Refuse outright" },
      "effects": { "poll": -1, "popularity": -2, "reputation": 2, "credibilite": 1 },
      "result": { "fr": "Vous dites non une fois et vous vous y tenez. Le magazine sortira le papier quand même, sans les photos et avec plus de méchanceté.",
                  "en": "You say no once and you hold to it. The magazine will run the piece anyway, without the photographs and with more malice." } },
    { "label": { "fr": "Y aller seul, sans personne d'autre", "en": "Do it alone, with nobody else" },
      "effects": { "poll": 1, "popularity": 2, "credibilite": 1, "energie": -1 },
      "result": { "fr": "Six pages sur votre enfance et pas un visage qui n'ait choisi d'être là. C'est le compromis le plus cher et le seul qui se défende.",
                  "en": "Six pages on your childhood and not one face that did not choose to be there. It is the most expensive compromise and the only defensible one." } }
  ]
},

/* ==========================================================================
   CE QU'ON DONNE AU PARTI, ET CE QU'ON GARDE POUR SOI
   ==========================================================================
   Six temps tirés dans vingt scènes : une carrière voyait donc à peu près
   tout le paquet, et une deuxième candidature rejouait la première. Les six
   scènes qui suivent l'élargissent, et elles tirent toutes sur le seul
   arbitrage qu'une campagne présidentielle pose vraiment à celui qui la
   mène — le point de sondage de dimanche contre la maison qu'il faudra
   diriger lundi.
   ========================================================================== */

{
  "id": "c_investitures_legislatives",
  "moment": [5, 2],
  "weight": 3,
  "tag": { "fr": "L'appareil", "en": "The machine" },
  "text": {
    "fr": "Les législatives suivent la présidentielle de cinq semaines et tout le monde y pense déjà. Quatre barons vous font savoir, séparément et exactement dans les mêmes termes, que leur mobilisation dépend de la liste des investitures.",
    "en": "The legislatives follow the presidential by five weeks and everybody is already thinking about them. Four party barons let you know, separately and in exactly the same words, that their level of effort depends on the nominations list."
  },
  "choices": [
    { "label": { "fr": "Promettre les quatre circonscriptions", "en": "Promise all four constituencies" },
      "roll": { "chance": 0.75, "chanceBonus": [ { "when": { "trait": ["appareil"] }, "value": 0.15 } ] },
      "success": { "effects": { "poll": 5, "standing": 6, "reseau": 1, "landscape": { "self": -0.4 },
                                "reputation": -1 },
        "result": { "fr": "L'appareil se met en marche en quarante-huit heures : les fédérations rouvrent, les tracts partent, les cars sont réservés. Vous venez d'hypothéquer quatre sièges pour une semaine de campagne, et vous le savez.",
                    "en": "The machine starts up within forty-eight hours: federations reopen, leaflets go out, coaches are booked. You have just mortgaged four seats for a week of campaigning, and you know it." } },
      "failure": { "effects": { "poll": 2, "standing": -6, "reputation": -2, "strike": "appareil",
                                "landscape": { "self": -0.7 } },
        "result": { "fr": "Les quatre listes ne se recoupent pas et deux des barons voulaient la même ville. Ils l'apprennent le même soir, par le même permanent, qui aurait dû se taire.",
                    "en": "The four lists do not match up and two of the barons wanted the same town. They find out the same evening, from the same staffer, who should have kept quiet." } } },
    { "label": { "fr": "N'en promettre aucune, et le dire", "en": "Promise none of them, and say so" },
      "roll": { "base": 16, "stat": "credibilite", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 2, "popularity": 7, "standing": -5, "credibilite": 2,
                                "landscape": { "self": 0.6 }, "reputation": 2 },
        "result": { "fr": "Vous annoncez que les investitures seront décidées après le second tour, par une commission, sur dossier. C'est la première fois que quelqu'un dit cette phrase et la tient.",
                    "en": "You announce that nominations will be decided after the runoff, by a committee, on the merits. It is the first time anybody has said that sentence and meant it." } },
      "failure": { "effects": { "poll": -5, "standing": -10, "energie": -2,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "Les quatre fédérations font la campagne au ralenti sans jamais rien dire. On appelle ça une grève du zèle, et elle ne se photographie pas.",
                    "en": "The four federations run the campaign at half speed without ever saying a word. It is called working to rule, and it does not photograph." } } },
    { "label": { "fr": "En promettre deux et faire attendre les deux autres", "en": "Promise two and keep the other two waiting" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "standing": 3, "reseau": 2, "landscape": { "self": -0.2 } },
        "result": { "fr": "Deux barons travaillent parce qu'ils ont eu leur ville, deux parce qu'ils espèrent l'avoir. Le second groupe travaille mieux, ce qui est la seule leçon utile de cette campagne.",
                    "en": "Two barons work because they got their town, two because they hope to. The second pair works harder, which is the only useful lesson of this campaign." } },
      "failure": { "effects": { "poll": -4, "standing": -9, "reputation": -1, "strike": "menteur" },
        "result": { "fr": "Les quatre se parlent le jeudi soir, comparent, et comprennent en douze minutes. Il n'existe pas de secret entre quatre personnes qui veulent la même chose.",
                    "en": "The four of them talk on the Thursday evening, compare notes, and work it out in twelve minutes. There is no such thing as a secret between four people who want the same thing." } } },
    { "label": { "fr": "Promettre la vôtre à quelqu'un d'autre", "en": "Promise your own seat to somebody else" },
      "when": { "position": ["depute", "maire"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "standing": 9, "popularity": 5,
                                "landscape": { "self": 0.5 } },
        "result": { "fr": "Vous annoncez que vous ne vous représenterez nulle part, quel que soit le résultat. La salle met quatre secondes à comprendre, et applaudit debout pendant deux minutes.",
                    "en": "You announce that you will not stand anywhere again, whatever the result. The hall takes four seconds to understand, then applauds standing for two minutes." } },
      "failure": { "effects": { "poll": -3, "standing": -4, "popularity": -6, "credibilite": -2 },
        "result": { "fr": "On y lit ce qu'il faut y lire : quelqu'un qui n'a pas de plan B ne renonce pas à son plan B. La phrase « il sait qu'il a perdu » sort dans les trois heures.",
                    "en": "It is read exactly as it should be: somebody with no fallback does not give up their fallback. The line “he knows he has lost” appears within three hours." } } }
  ]
},

{
  "id": "c_porte_parole",
  "moment": [6, 3],
  "cast": "camp_senior",
  "tag": { "fr": "L'équipe", "en": "The team" },
  "text": {
    "fr": "{rival} veut être votre porte-parole. {Il} est excellent{e} en plateau, {il} a fait campagne contre vous à la primaire, et {il} n'a jamais caché qu'{il} pensait à la fois d'après.",
    "en": "{rival} wants to be your campaign spokesperson. {He} is excellent on television, {he} ran against you in the primary, and {he} has never hidden that {he} is thinking about the next time."
  },
  "choices": [
    { "label": { "fr": "{Le} nommer et {le} laisser occuper l'antenne", "en": "Appoint {him} and let {him} take the airtime" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "standing": 7, "energie": 2, "landscape": { "self": 0.5 },
                                "notoriete": -1 },
        "result": { "fr": "{Il} fait quarante plateaux en six semaines et {il} les fait bien. Le camp parle d'une seule voix pour la première fois depuis dix ans, et ce n'est pas la vôtre.",
                    "en": "{He} does forty broadcasts in six weeks and does them well. The camp speaks with one voice for the first time in ten years, and it is not yours." } },
      "failure": { "effects": { "poll": -3, "standing": -4, "popularity": -5, "notoriete": -2 },
        "result": { "fr": "{Il} répond à côté de la ligne trois fois en dix jours, toujours dans le même sens, et jamais tout à fait assez pour qu'on puisse {le} démentir.",
                    "en": "{He} strays from the line three times in ten days, always in the same direction, and never quite enough for anyone to be able to correct {him}." } } },
    { "label": { "fr": "{Le} nommer et {le} tenir en laisse courte", "en": "Appoint {him} and keep {him} on a short leash" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "standing": 4, "credibilite": 1, "energie": -2 },
        "result": { "fr": "Éléments de langage tous les matins à sept heures, débrief tous les soirs. {Il} tient six semaines, {il} déteste chaque minute, et rien ne fuit.",
                    "en": "Talking points every morning at seven, debrief every evening. {He} lasts six weeks, {he} hates every minute, and nothing leaks." } },
      "failure": { "effects": { "poll": -4, "standing": -7, "energie": -3, "reputation": -1 },
        "result": { "fr": "{Il} raconte la laisse avant la fin de la campagne, avec l'horaire des réunions et le nom du document. On ne retiendra rien d'autre de votre organisation.",
                    "en": "{He} describes the leash before the campaign is over, with the times of the meetings and the name of the document. Nothing else about your organisation will be remembered." } } },
    { "label": { "fr": "Refuser et parler vous-même", "en": "Refuse, and speak for yourself" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "energie": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "notoriete": 2, "popularity": 5, "standing": -6,
                                "energie": -3 },
        "result": { "fr": "Vous prenez tous les plateaux, y compris ceux de sept heures du matin. Le pays finit par ne connaître qu'un visage de cette campagne, et c'est le vôtre.",
                    "en": "You take every broadcast, including the seven in the morning ones. The country ends up knowing one face from this campaign, and it is yours." } },
      "failure": { "effects": { "poll": -5, "energie": -4, "standing": -8, "popularity": -3 },
        "result": { "fr": "Six semaines à dormir quatre heures. La huitième interview de la semaine est celle de trop, et c'est celle-là que tout le monde regardera.",
                    "en": "Six weeks on four hours' sleep. The eighth interview of the week is the one too many, and it is the one everybody watches." } } }
  ]
},

{
  "id": "c_micro_ouvert",
  "weight": 3,
  "tag": { "fr": "Micro ouvert", "en": "Hot mic" },
  "text": {
    "fr": "Entre deux plateaux, vous dites à votre directeur de cabinet ce que vous pensez vraiment des électeurs d'une certaine ville. Le micro-cravate est resté branché et l'ingénieur du son a tout entendu.",
    "en": "Between two studios, you tell your chief of staff what you really think of the voters of a certain town. The lapel mic is still live and the sound engineer heard all of it."
  },
  "choices": [
    { "label": { "fr": "Aller le voir avant qu'il ne sorte", "en": "Go and see him before it gets out" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 0, "reseau": 1, "sangfroid": 1, "energie": -1 },
        "result": { "fr": "Vous allez lui parler cinq minutes en régie, sans témoin et sans rien promettre. Il efface le fichier devant vous, parce que personne ne le lui avait jamais demandé comme ça.",
                    "en": "You talk to him for five minutes in the gallery, no witnesses, no promises. He deletes the file in front of you, because nobody had ever asked him like that." } },
      "failure": { "effects": { "poll": -6, "popularity": -9, "reputation": -2,
                                "appeal": { "others": -3 } },
        "result": { "fr": "Il enregistre aussi la conversation où vous lui demandez d'effacer la première. Les deux sortent ensemble, et c'est la seconde qui fait le plus de mal.",
                    "en": "He also records the conversation in which you ask him to delete the first one. Both come out together, and it is the second that does the damage." } } },
    { "label": { "fr": "Prendre les devants et publier la phrase", "en": "Get ahead of it and publish the line yourself" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "notoriete": 2, "popularity": 6, "credibilite": 1,
                                "reputation": 1 },
        "result": { "fr": "Vous la citez vous-même en ouverture du meeting du soir, en expliquant pourquoi vous l'avez dite. La salle rit, le pays trouve ça humain, et il n'y a plus rien à révéler.",
                    "en": "You quote it yourself at the top of the evening rally, explaining why you said it. The hall laughs, the country finds it human, and there is nothing left to reveal." } },
      "failure": { "effects": { "poll": -7, "popularity": -11, "standing": -5,
                                "appeal": { "others": -6 } },
        "result": { "fr": "Vous la citez et vous l'expliquez, ce qui la fait entendre deux fois. La ville concernée fait le reste, et elle a vingt-deux mille électeurs.",
                    "en": "You quote it and you explain it, which means it is heard twice. The town in question does the rest, and it has twenty-two thousand voters." } } },
    { "label": { "fr": "Nier en bloc", "en": "Deny everything" },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.3 },
                                                 { "when": { "background": ["comms"] }, "value": 0.2 } ] },
      "success": { "effects": { "poll": -1, "reputation": -1, "sangfroid": 1 },
        "result": { "fr": "Il n'y a pas de bande, il n'y a qu'un témoin, et un témoin sans bande n'existe pas dans une campagne. Le sujet meurt en trente-six heures.",
                    "en": "There is no tape, there is only a witness, and a witness without a tape does not exist in a campaign. The story dies in thirty-six hours." } },
      "failure": { "effects": { "poll": -8, "popularity": -10, "credibilite": -3,
                                "strike": "menteur", "appeal": { "others": -3 } },
        "result": { "fr": "La bande sort quarante minutes après votre démenti, et c'est le démenti qui passe en boucle. On ne meurt pas de la phrase, on meurt de l'avoir niée.",
                    "en": "The tape comes out forty minutes after your denial, and it is the denial that runs on a loop. Nobody dies of the sentence, they die of having denied it." } } }
  ]
},

{
  "id": "c_livre",
  "moment": [6, 4],
  "tag": { "fr": "Le livre", "en": "The book" },
  "text": {
    "fr": "Votre livre de campagne sort dans trois semaines. L'éditeur veut un chapitre personnel, votre directeur de campagne veut un programme, et votre parti veut savoir qui figure dans les remerciements.",
    "en": "Your campaign book comes out in three weeks. The publisher wants a personal chapter, your campaign director wants a programme, and your party wants to know who is in the acknowledgements."
  },
  "choices": [
    { "label": { "fr": "Écrire le chapitre personnel", "en": "Write the personal chapter" },
      "roll": { "base": 15, "stat": "reputation", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 5, "popularity": 8, "notoriete": 2, "standing": -4 },
        "result": { "fr": "Quarante pages sur votre père, votre ville et l'année où tout a failli s'arrêter. Deux cent mille exemplaires, et les gens vous parlent de ce chapitre-là sur les marchés pendant six ans.",
                    "en": "Forty pages about your father, your town and the year it nearly all stopped. Two hundred thousand copies, and people talk to you about that chapter in markets for six years." } },
      "failure": { "effects": { "poll": -4, "popularity": -6, "reputation": -2, "money": -20000 },
        "result": { "fr": "Le chapitre est sincère et il est mal écrit, ce qui est la pire combinaison. Trois critiques en font des extraits, toujours les mêmes quatre lignes.",
                    "en": "The chapter is sincere and badly written, which is the worst combination. Three reviewers quote extracts, always the same four lines." } } },
    { "label": { "fr": "En faire un programme et rien d'autre", "en": "Make it a programme and nothing else" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "eloquence": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 3, "standing": 6, "popularity": -2,
                                "landscape": { "self": 0.5 } },
        "result": { "fr": "Cent quatre-vingts pages chiffrées que personne ne lira en entier et que tout le monde citera. C'est le document dont votre parti vivra pendant cinq ans.",
                    "en": "A hundred and eighty costed pages nobody will read in full and everybody will quote. It is the document your party will live off for five years." } },
      "failure": { "effects": { "poll": -3, "popularity": -5, "money": -25000, "energie": -2 },
        "result": { "fr": "Onze mille exemplaires vendus, dont quatre mille achetés par les fédérations. Le livre le plus sérieux de la campagne est aussi celui qu'on retrouvera en pilon.",
                    "en": "Eleven thousand copies sold, four thousand of them bought by the federations. The most serious book of the campaign is also the one that ends up pulped." } } },
    { "label": { "fr": "Régler vos comptes avec votre propre camp", "en": "Settle scores with your own side" },
      "when": { "personality": ["provocative"] },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "popularity": 10, "notoriete": 3, "standing": -14,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "Trois chapitres sur ceux qui vous ont barré la route, avec les dates et les salles. Le livre se vend comme un roman policier et personne dans la maison ne vous adressera plus la parole.",
                    "en": "Three chapters on the people who blocked your path, with the dates and the rooms. The book sells like a thriller and nobody in the house will speak to you again." } },
      "failure": { "effects": { "poll": -7, "standing": -18, "reputation": -2, "strike": "traitre",
                                "landscape": { "self": -1.0 } },
        "result": { "fr": "On répond, tous ensemble, avec leurs propres dates et leurs propres salles. Une guerre interne pendant une campagne présidentielle ne s'arbitre pas, elle se perd.",
                    "en": "They answer, all together, with their own dates and their own rooms. A civil war during a presidential campaign is not arbitrated, it is lost." } } }
  ]
},

{
  "id": "c_greve",
  "moment": [5, 2],
  "tag": { "fr": "Le pays", "en": "The country" },
  "text": {
    "fr": "Le pays s'arrête au milieu de votre campagne : plus de trains, plus de raffineries, et une intersyndicale qui donne rendez-vous à onze heures place de la République. Toutes les caméras y seront, et toutes attendent de voir qui y va.",
    "en": "The country stops in the middle of your campaign: no trains, no refineries, and a joint union platform calling a rally for eleven o'clock. Every camera will be there, and every camera is waiting to see who turns up."
  },
  "choices": [
    { "label": { "fr": "Y aller et marcher dans le cortège", "en": "Turn up and walk in the march" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "axis": "self", "poll": 5, "popularity": 8, "notoriete": 2,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "Vous marchez deux heures sans service d'ordre et sans discours. La photo du soir vaut trois meetings, et elle n'a rien coûté que deux heures de marche.",
                    "en": "You walk for two hours with no security detail and no speech. The evening's photograph is worth three rallies, and it cost nothing but two hours of walking." } },
      "failure": { "effects": { "poll": -6, "popularity": -7, "reputation": -1,
                                "appeal": { "others": -3 } },
        "result": { "fr": "Le cortège vous siffle sur trois cents mètres, et ces trois cents mètres-là sont les seuls qui passeront au journal. On n'entre pas dans une manifestation qui ne vous a pas invité.",
                    "en": "The march whistles at you for three hundred yards, and those three hundred yards are the only ones that make the news. You do not walk into a demonstration that did not invite you." } } },
    { "label": { "fr": "Recevoir les syndicats et personne d'autre", "en": "Receive the unions and nobody else" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 2, "standing": 5, "reseau": 2,
                                "popularity": 2 },
        "result": { "fr": "Trois heures de réunion sans communiqué et sans photo. Vous n'obtenez rien, ils n'obtiennent rien, et vous êtes le seul candidat à qui ils décrochent encore.",
                    "en": "Three hours of talks, no statement, no photograph. You get nothing, they get nothing, and you are the only candidate whose calls they still take." } },
      "failure": { "effects": { "poll": -4, "popularity": -5, "standing": -3, "energie": -2 },
        "result": { "fr": "La réunion fuite avant la fin, résumée en une ligne fausse. Vous passez la journée à démentir une phrase que vous n'avez pas dite dans une réunion qui n'existait pas.",
                    "en": "The meeting leaks before it ends, summed up in one false line. You spend the day denying a sentence you did not say in a meeting that did not exist." } } },
    { "label": { "fr": "Appeler au retour à l'ordre", "en": "Call for a return to order" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "axis": { "social": 45, "economy": 50 }, "poll": 4, "popularity": 6,
                                "credibilite": 2 },
        "result": { "fr": "Vous parlez des huit millions de gens qui n'ont pas pu aller travailler, et vous en nommez trois. La séquence tourne dans un électorat qui ne vous écoutait pas.",
                    "en": "You talk about the eight million people who could not get to work, and you name three of them. The clip travels in an electorate that was not listening to you." } },
      "failure": { "effects": { "poll": -5, "popularity": -8, "appeal": { "self": -6 },
                                "standing": -5 },
        "result": { "fr": "Votre propre base entend la phrase avant le pays, et elle l'entend très bien. Deux fédérations demandent une clarification, ce qui est le mot poli pour autre chose.",
                    "en": "Your own base hears the sentence before the country does, and hears it very clearly. Two federations request a clarification, which is the polite word for something else." } } },
    { "label": { "fr": "Ne rien dire pendant trois jours", "en": "Say nothing for three days" },
      "when": { "personality": ["calculating"] },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "minPopularity": 55 }, "value": 0.2 } ] },
      "success": { "effects": { "poll": 2, "sangfroid": 2, "energie": 1 },
        "result": { "fr": "Trois jours sans une déclaration pendant que les autres se répartissent les torts. Le mouvement s'essouffle tout seul, et vous êtes le seul à n'avoir rien à retirer.",
                    "en": "Three days without a statement while the others divide the blame. The movement runs out of steam on its own, and you are the only one with nothing to withdraw." } },
      "failure": { "effects": { "poll": -4, "popularity": -6, "notoriete": -1, "credibilite": -1 },
        "result": { "fr": "Trois jours de silence pendant que le pays est à l'arrêt s'appellent une absence. La question « où était-il ? » est posée à l'antenne avant même que vous ne répondiez.",
                    "en": "Three days of silence while the country is at a standstill is called an absence. The question “where was he?” is asked on air before you have even answered." } } }
  ]
},

{
  "id": "c_maire_promesse",
  "moment": [5, 2],
  "cast": "camp",
  "tag": { "fr": "L'appareil", "en": "The machine" },
  "text": {
    "fr": "{rival} tient une ville de quatre-vingt mille habitants et une fédération qui pèse au congrès. {Il} vous propose de venir, avec les caméras, si vous annoncez sur place le contournement routier que votre programme entend supprimer.",
    "en": "{rival} runs a town of eighty thousand and a federation that counts at conference. {He} offers you a visit, cameras and all, provided you announce on the spot the bypass your programme intends to scrap."
  },
  "choices": [
    { "label": { "fr": "Annoncer le contournement", "en": "Announce the bypass" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 } ] },
      "success": { "effects": { "poll": 4, "standing": 7, "reseau": 1, "credibilite": -1,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "Vous l'annoncez devant deux cents personnes et une chaîne régionale, et personne au national ne relève. La fédération vous doit une campagne, et une fédération qui doit paie.",
                    "en": "You announce it in front of two hundred people and one regional channel, and nobody national picks it up. The federation owes you a campaign, and a federation that owes, pays." } },
      "failure": { "effects": { "poll": -6, "credibilite": -3, "popularity": -7, "strike": "menteur",
                                "reputation": -1 },
        "result": { "fr": "Un journaliste national avait fait le déplacement et connaît votre programme page quarante-deux. Le split-screen est prêt avant que vous ne remontiez en voiture.",
                    "en": "One national reporter had made the trip and knows page forty-two of your programme. The split-screen is ready before you get back in the car." } } },
    { "label": { "fr": "Y aller et refuser de l'annoncer", "en": "Go, and refuse to announce it" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 2, "popularity": 6, "standing": -6,
                                "reputation": 2 },
        "result": { "fr": "Vous expliquez devant la salle, {rival} au premier rang, pourquoi ce contournement ne se fera pas. Deux cents personnes n'applaudissent pas et trois millions regardent la vidéo.",
                    "en": "You explain to the hall, with {rival} in the front row, why the bypass will not happen. Two hundred people do not applaud and three million watch the video." } },
      "failure": { "effects": { "poll": -4, "standing": -9, "popularity": -3, "energie": -1,
                                "landscape": { "self": -0.4 } },
        "result": { "fr": "{Il} quitte la salle avant la fin, devant les caméras, ce qui était le seul plan possible pour {lui} à partir du moment où vous aviez dit non.",
                    "en": "{He} leaves the hall before the end, in front of the cameras, which was the only available plan for {him} the moment you said no." } } },
    { "label": { "fr": "Ne pas y aller du tout", "en": "Not go at all" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "poll": 1, "standing": -2, "energie": 2, "credibilite": 1 },
        "result": { "fr": "Vous faites dire que l'agenda ne le permet pas, ce qui est faux et ce que tout le monde accepte. Une campagne se gagne aussi sur les déplacements qu'on ne fait pas.",
                    "en": "You have it put about that the diary does not allow it, which is untrue and which everybody accepts. A campaign is also won on the trips you do not make." } },
      "failure": { "effects": { "poll": -3, "standing": -8, "reseau": -1,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "{Il} reçoit un autre candidat trois semaines plus tard, dans la même salle, devant les mêmes caméras. Le contournement figure dans le programme de quelqu'un d'autre.",
                    "en": "{He} receives another candidate three weeks later, in the same hall, in front of the same cameras. The bypass appears in somebody else's programme." } } }
  ]
}

];
