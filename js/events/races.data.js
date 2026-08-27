/* Généré — ne pas éditer à la main. */
const EV_races = [

/* ==========================================================================
   LES TEMPS D'UNE CAMPAGNE ORDINAIRE
   ==========================================================================
   Deux temps pour une municipale, un congrès ou une européenne, trois pour une
   législative. Chaque carte déplace l'avantage par son effet "score", qui
   n'est jamais montré au joueur en chiffres : il le lit dans la phrase qui
   ouvre la carte. Le champ "race" limite une scène à certains scrutins.
   ========================================================================== */

{
  "id": "race_dissolution",
  "race": ["legislatives"],
  "moment": 3,
  "weight": 5,
  "when": { "dissolved": true },
  "tag": { "fr": "Législatives anticipées", "en": "Snap election" },
  "text": {
    "fr": "Vingt jours de campagne au lieu de cinq semaines, en plein été, avec des électeurs qui ne comprennent pas pourquoi on les rappelle aux urnes et qui vous le disent au portail.",
    "en": "Twenty days of campaigning instead of five weeks, in high summer, with voters who do not understand why they are being called back and who tell you so at the gate."
  },
  "choices": [
    { "label": { "fr": "Faire campagne sur la dissolution elle-même", "en": "Campaign on the dissolution itself" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 5, "popularity": 5, "notoriete": 2 },
        "result": { "fr": "Vous expliquez ce qui s'est passé plutôt que ce que vous proposez. C'est la seule chose que les gens ont en tête, et vous êtes le seul à en parler.",
                    "en": "You explain what happened rather than what you propose. It is the only thing on people's minds, and you are the only one talking about it." } },
      "failure": { "effects": { "score": -4, "popularity": -5, "credibilite": -1 },
        "result": { "fr": "On vous répond qu'on s'en fiche des institutions et qu'on voudrait parler du reste. On a raison, et il est trop tard pour changer de discours.",
                    "en": "You are told nobody cares about the institutions and they would rather talk about something else. They are right, and it is too late to change tack." } } },
    { "label": { "fr": "Ignorer la crise et parler du terrain", "en": "Ignore the crisis and talk about the ground" },
      "effects": { "score": 3, "popularity": 3, "energie": -2, "credibilite": 1 },
      "result": { "fr": "Vingt jours à parler d'écoles et de trains pendant que les plateaux parlent d'arithmétique parlementaire. Vos électeurs vous en sauront gré, les autres ne vous auront pas entendu.",
                  "en": "Twenty days talking about schools and trains while the studios talk parliamentary arithmetic. Your own voters will thank you; the others will not have heard you." } },
    { "label": { "fr": "Se rassembler avec ceux d'à côté, vite et mal", "en": "Form a bloc with the neighbours, fast and badly" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "score": 8, "reseau": 2, "standing": -5, "reputation": -1 },
        "result": { "fr": "Un accord signé en quatre jours avec des gens que vous combattiez le mois dernier. Cela tiendra jusqu'au soir du second tour, ce qui suffit.",
                    "en": "A deal signed in four days with people you were fighting last month. It will hold until runoff night, which is enough." } },
      "failure": { "effects": { "score": -6, "standing": -8, "reputation": -2 },
        "result": { "fr": "Les négociations fuitent avant d'aboutir. On a la photo du marchandage sans avoir l'accord, ce qui est le pire des deux mondes.",
                    "en": "The talks leak before they conclude. You get the photograph of the haggling without the deal, which is the worst of both worlds." } } }
  ]
},

{
  "id": "race_terrain",
  "moment": 3,
  "weight": 3,
  "tag": { "fr": "Terrain", "en": "On the ground" },
  "text": {
    "fr": "Cinq semaines de campagne, un budget qui ne permet pas tout, et une équipe qui attend que vous décidiez où mettre l'énergie.",
    "en": "Five weeks of campaigning, a budget that does not stretch to everything, and a team waiting for you to decide where the energy goes."
  },
  "choices": [
    { "label": { "fr": "Les marchés, tous les matins", "en": "The markets, every morning" },
      "effects": { "score": 4, "energie": -2 },
      "result": { "fr": "Six heures du matin, quatre marchés par semaine, des mains serrées jusqu'à ne plus sentir la vôtre. C'est démodé et ça n'a jamais cessé de marcher.",
                  "en": "Six in the morning, four markets a week, hands shaken until you stop feeling your own. It is old-fashioned and it has never stopped working." } },
    { "label": { "fr": "Une campagne en ligne, ciblée", "en": "A targeted online campaign" },
      "when": { "minMoney": 30000 },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "comms": 2 }, "value": 0.18 },
                                                { "when": { "background": ["comms"] }, "value": 0.14 } ] },
      "success": { "effects": { "score": 6, "money": -18000 },
        "result": { "fr": "Trois cents versions du même message, découpées par quartier et par âge. Vous touchez des gens qui ne vous verront jamais.",
                    "en": "Three hundred versions of the same message, cut by neighbourhood and age. You reach people who will never see you in person." } },
      "failure": { "effects": { "score": -1, "money": -18000, "reputation": -1 },
        "result": { "fr": "Le ciblage déborde de trois communes et la moitié du budget parle à des gens qui ne votent pas ici. On vous le fera remarquer, avec le chiffre.",
                    "en": "The targeting spills over three neighbouring towns and half the budget talks to people who do not vote here. Somebody will point it out, with the figure." } } },
    { "label": { "fr": "Garder vos forces pour la fin", "en": "Save your strength for the end" },
      "effects": { "score": -6, "energie": 2 },
      "result": { "fr": "Vous levez le pied trois semaines. Votre adversaire occupe le terrain, et vous arrivez frais dans une campagne déjà écrite.",
                  "en": "You ease off for three weeks. Your opponent holds the ground, and you arrive fresh in a campaign already written." } }
  ]
},

{
  "id": "race_debat_local",
  "weight": 3,
  "race": ["municipales", "legislatives", "europeennes"],
  "cast": "opponent",
  "tag": { "fr": "Débat", "en": "The debate" },
  "text": {
    "fr": "Le débat organisé par le journal local, dans une salle de deux cents places à moitié pleine. {rival} y sera, et la vidéo fera plus de vues que la salle n'a de sièges.",
    "en": "The debate organised by the local paper, in a two-hundred-seat hall half full. {rival} will be there, and the video will get more views than the hall has seats."
  },
  "choices": [
    { "label": { "fr": "Parler du dossier que vous connaissez par cœur", "en": "Talk about the file you know by heart" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 6 },
        "result": { "fr": "Vous citez trois chiffres justes et une rue précise. Dans la salle, quelqu'un dit à voix haute que vous, au moins, vous savez de quoi vous parlez.",
                    "en": "You quote three accurate figures and one specific street. Somebody in the hall says out loud that you, at least, know what you are talking about." } },
      "failure": { "effects": { "score": -8, "popularity": -3 },
        "result": { "fr": "Vous parlez douze minutes de sous-préfecture et de schéma directeur. La salle décroche à la quatrième.",
                    "en": "You speak for twelve minutes about zoning and strategic plans. The hall gives up at the fourth." } } },
    { "label": { "fr": "Attaquer son bilan", "en": "Attack his record" },
      "effects": { "score": 3, "reputation": -1, "popularity": -1, "strike": "intrepide" },
      "result": { "fr": "Vous sortez ses votes et ses absences, un par un. C'est efficace, c'est désagréable, et la salle vous en veut un peu de lui avoir fait ça.",
                  "en": "You produce his votes and his absences, one by one. It works, it is unpleasant, and the hall holds it against you slightly." } },
    { "label": { "fr": "Promettre ce qui ne dépend pas de vous", "en": "Promise what does not depend on you" },
      "effects": { "score": 7, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "Vous annoncez la réouverture de la ligne et le maintien de l'école. Les deux relèvent de l'État, et la salle applaudit quand même.",
                  "en": "You announce the line reopening and the school staying put. Both are national decisions, and the hall applauds anyway." } }
  ]
},

{
  "id": "race_soutien_national",
  "weight": 3,
  "race": ["municipales", "legislatives", "europeennes"],
  "cast": "camp",
  "tag": { "fr": "Renfort", "en": "Reinforcements" },
  "text": {
    "fr": "{rival} propose de venir tenir un meeting avec vous. Sa présence remplit une salle et sa signature au bas de vos affiches vaut ce que vaut sa popularité, dans les deux sens.",
    "en": "{rival} offers to come and hold a rally with you. His presence fills a hall, and his name at the bottom of your posters is worth exactly what his popularity is worth, in both directions."
  },
  "choices": [
    { "label": { "fr": "Le faire venir", "en": "Bring him in" },
      "effects": { "score": 4, "popularity": -2 },
      "result": { "fr": "La salle est pleine, les caméras sont là, et la moitié des questions portent sur lui. Vous gagnez des voix et vous perdez la campagne, qui devient la sienne.",
                  "en": "The hall is full, the cameras are there, and half the questions are about him. You gain votes and lose the campaign, which becomes his." } },
    { "label": { "fr": "Faire campagne seul", "en": "Campaign alone" },
      "effects": { "score": -2, "standing": -5 },
      "result": { "fr": "Ni logo, ni parrain, ni affiche nationale. On vous reproche votre distance à la direction, et on vote pour vous à cause d'elle.",
                  "en": "No logo, no patron, no national poster. You are criticised for your distance from the leadership, and voted for because of it." } },
    { "label": { "fr": "Le faire venir et le laisser parler du national", "en": "Bring him in and let him talk national" },
      "effects": { "score": 1, "energie": 1, "popularity": -4 },
      "result": { "fr": "Il fait quarante minutes de politique nationale devant des électeurs venus parler de leur rue. La fédération est ravie.",
                  "en": "He does forty minutes of national politics in front of voters who came to talk about their street. The federation is delighted." } }
  ]
},

{
  "id": "race_incident",
  "moment": 2,
  "weight": 3,
  "tag": { "fr": "Incident de campagne", "en": "Campaign incident" },
  "text": {
    "fr": "À dix jours du scrutin, un tract anonyme circule dans les boîtes aux lettres. Il ne dit rien de faux, il dit tout de travers, et il est très bien fait.",
    "en": "Ten days out, an anonymous leaflet is going round the letterboxes. It says nothing false, it says everything crooked, and it is very well made."
  },
  "choices": [
    { "label": { "fr": "Répondre par un tract de votre côté", "en": "Answer with a leaflet of your own" },
      "effects": { "score": 0, "money": -6000, "energie": -1 },
      "result": { "fr": "Vous répondez point par point sur quatre pages. Ceux qui lisent les quatre pages avaient déjà décidé de voter pour vous.",
                  "en": "You answer point by point over four pages. The people who read all four pages had already decided to vote for you." } },
    { "label": { "fr": "Porter plainte et le faire savoir", "en": "File a complaint and say so" },
      "effects": { "score": -3, "popularity": -2 },
      "result": { "fr": "La plainte fait trois lignes dans le journal, le tract en a fait dix mille dans les boîtes. Mais la prochaine fois, ils hésiteront.",
                  "en": "The complaint gets three lines in the paper; the leaflet got ten thousand copies through letterboxes. But next time they will hesitate." } },
    { "label": { "fr": "Trouver qui l'a payé", "en": "Find out who paid for it" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 6 },
        "result": { "fr": "L'imprimeur est bavard et la facture porte un nom. Vous ne publiez rien, vous passez un coup de fil, et le tract disparaît des boîtes en deux jours.",
                    "en": "The printer is talkative and the invoice carries a name. You publish nothing, you make one telephone call, and the leaflet vanishes from letterboxes in two days." } },
      "failure": { "effects": { "score": -7, "energie": -2 },
        "result": { "fr": "Vous passez la dernière semaine à enquêter au lieu de faire campagne. Vous ne trouvez rien et vous avez perdu six jours.",
                    "en": "You spend the last week investigating instead of campaigning. You find nothing, and you have lost six days." } } }
  ]
},

{
  "id": "race_motion",
  "moment": 2,
  "weight": 4,
  "race": ["congres"],
  "cast": "camp",
  "tag": { "fr": "Motion", "en": "The motion" },
  "text": {
    "fr": "Un congrès ne se gagne pas devant les militants, il se gagne dans le texte de la motion. Trois lignes sur l'Europe et deux sur la fiscalité décideront de qui peut voter pour vous.",
    "en": "A party conference is not won in front of the members, it is won in the wording of the motion. Three lines on Europe and two on tax will decide who is able to vote for you."
  },
  "choices": [
    { "label": { "fr": "Écrire un texte de rassemblement", "en": "Write a text everyone can live with" },
      "effects": { "strike": "appareil", "score": 4, "popularity": -3, "reputation": -1 },
      "result": { "fr": "Quatre pages qui ne fâchent personne et qu'aucun militant ne relira. Deux courants s'y retrouvent, ce qui était tout l'objectif.",
                  "en": "Four pages that upset nobody and that no member will read twice. Two factions can live with it, which was the entire point." } },
    { "label": { "fr": "Écrire ce que vous pensez vraiment", "en": "Write what you actually think" },
      "effects": { "score": -6, "standing": -2 },
      "result": { "fr": "Un texte clair, tranchant, qui fait le tour de la presse et perd deux fédérations en une matinée.",
                  "en": "A clear, sharp text that goes round the press and loses two federations in a morning." } },
    { "label": { "fr": "Reprendre le texte du sortant en changeant trois mots", "en": "Take the incumbent's text and change three words" },
      "when": { "personality": ["calculating"] },
      "effects": { "score": 7, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "Personne ne peut vous reprocher un texte qu'ils ont tous voté l'an dernier. {rival} met trois semaines à comprendre ce qui lui arrive.",
                  "en": "Nobody can attack you over a text they all voted for last year. {rival} takes three weeks to understand what is happening to him." } }
  ]
},

{
  "id": "race_couloirs",
  "moment": 1,
  "weight": 4,
  "race": ["congres"],
  "tag": { "fr": "Couloirs", "en": "The corridors" },
  "text": {
    "fr": "Deux jours de congrès, quatre mille militants, et l'essentiel qui se joue dans un couloir entre la salle et la buvette.",
    "en": "Two days of conference, four thousand members, and everything that matters happening in a corridor between the hall and the bar."
  },
  "choices": [
    { "label": { "fr": "Promettre des postes", "en": "Promise posts" },
      "effects": { "strike": "appareil", "score": 7, "reputation": -2 },
      "result": { "fr": "Onze promesses pour sept postes. Vous réglerez ça après, et quatre personnes vous détesteront pour toujours.",
                  "en": "Eleven promises for seven posts. You will sort that out afterwards, and four people will hate you for good." } },
    { "label": { "fr": "Tenir la buvette jusqu'à trois heures du matin", "en": "Hold the bar until three in the morning" },
      "effects": { "score": 3, "energie": -3 },
      "result": { "fr": "Deux nuits, cent conversations, et le sentiment très net que rien de tout cela ne se serait dit à jeun.",
                  "en": "Two nights, a hundred conversations, and the distinct sense that none of it would have been said sober." } },
    { "label": { "fr": "Rester dans la salle et travailler le texte", "en": "Stay in the hall and work on the text" },
      "effects": { "score": -2, "energie": 1 },
      "result": { "fr": "Vous suivez les débats, vous prenez des notes et vous êtes le seul candidat à savoir ce qui a été voté. Ça ne sert à rien ce week-end.",
                  "en": "You follow the debates, you take notes and you are the only candidate who knows what was voted. It is of no use whatsoever this weekend." } }
  ]
},

{
  "id": "race_derniere_semaine",
  "moment": 1,
  "weight": 3,
  "tag": { "fr": "Dernière semaine", "en": "The last week" },
  "text": {
    "fr": "Sept jours, une caisse presque vide et une équipe qui n'en peut plus. Ce qui se décide maintenant ne se rattrapera pas.",
    "en": "Seven days, an almost empty account and a team running on fumes. What gets decided now cannot be undone."
  },
  "choices": [
    { "label": { "fr": "Tout mettre sur les indécis", "en": "Put everything into the undecided" },
      "roll": { "base": 14, "stat": "energie", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 8, "energie": -3 },
        "result": { "fr": "Quatre mille portes en six jours. Les derniers jours d'une campagne appartiennent à ceux qui tiennent debout.",
                    "en": "Four thousand doors in six days. The last days of a campaign belong to whoever is still standing." } },
      "failure": { "effects": { "score": -6, "energie": -4, "trait": "use" },
        "result": { "fr": "Vous finissez la campagne aphone, à deux réunions par jour, et la dernière est un désastre que trois cents personnes ont vu.",
                    "en": "You finish the campaign with no voice, two meetings a day, and the last one is a disaster three hundred people watched." } } },
    { "label": { "fr": "Sortir votre argent personnel", "en": "Put in your own money" },
      "when": { "minMoney": 40000 },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "comms": 2 }, "value": 0.15 },
                                                { "when": { "stat": { "reseau": { "min": 12 } } }, "value": 0.12 } ] },
      "success": { "effects": { "score": 6, "money": -28000, "reputation": -1 },
        "result": { "fr": "Un affichage complet, deux encarts et un envoi postal à tous les électeurs. La déclaration de compte de campagne posera des questions.",
                    "en": "Full billboard coverage, two press inserts and a mailshot to every voter. The campaign accounts will raise questions." } },
      "failure": { "effects": { "score": -2, "money": -28000, "reputation": -2, "popularity": -3 },
        "result": { "fr": "L'affichage sort en même temps que le montant. Votre adversaire n'a plus qu'à laisser faire, et il laisse faire pendant huit jours.",
                    "en": "The billboards go up the same week the figure comes out. Your opponent only has to let it run, and he lets it run for eight days." } } },
    { "label": { "fr": "Laisser courir et préparer la suite", "en": "Let it run and prepare for what comes next" },
      "effects": { "score": -7, "energie": 3, "strike": "lache" },
      "result": { "fr": "Vous levez le pied et vous passez la semaine à préparer l'après, quel qu'il soit. C'est raisonnable, et ça se voit sur les affiches vides.",
                  "en": "You ease off and spend the week preparing for the aftermath, whatever it is. It is sensible, and it shows on the empty billboards." } }
  ]
}
,

{
  "id": "race_liste",
  "moment": 3,
  "weight": 4,
  "race": ["municipales"],
  "tag": { "fr": "La liste", "en": "The slate" },
  "text": {
    "fr": "Trente-cinq noms à trouver, et deux fois plus de gens qui estiment y avoir droit. Une liste municipale est le seul document où l'on voit d'un coup d'œil qui vous devez remercier et qui vous avez décidé de perdre.",
    "en": "Thirty-five names to find, and twice as many people who believe they are owed a place. A municipal slate is the only document where you can see at a glance who you have to thank and who you have decided to lose."
  },
  "choices": [
    { "label": { "fr": "Une liste d'ouverture, avec des visages neufs", "en": "An open slate, with new faces" },
      "effects": { "score": 6, "energie": -2, "standing": -6 },
      "result": { "fr": "Une commerçante, un médecin, deux enseignantes et personne du parti. Les militants l'apprennent par le journal et la fédération met un an à digérer.",
                  "en": "A shopkeeper, a doctor, two teachers and nobody from the party. The members find out from the paper and the federation takes a year to digest it." } },
    { "label": { "fr": "Récompenser ceux qui ont tenu la permanence", "en": "Reward the people who kept the office open" },
      "effects": { "score": -3, "standing": 8 },
      "result": { "fr": "Une liste de fidèles, dont quatre qui ont déjà perdu deux fois. Ils le méritent tous, et c'est bien le problème.",
                  "en": "A slate of loyalists, four of whom have already lost twice. They all deserve it, and that is exactly the problem." } },
    { "label": { "fr": "Aller chercher une figure locale qui vous déteste", "en": "Go and get a local figure who dislikes you" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 9, "energie": -1 },
        "result": { "fr": "Il accepte la troisième place et deux délégations. Son quartier bascule avec lui, et vous savez déjà ce qu'il vous coûtera dans trois ans.",
                    "en": "He takes third place and two portfolios. His neighbourhood swings with him, and you already know what he will cost you in three years." } },
      "failure": { "effects": { "score": -5, "energie": -1, "reputation": -1 },
        "result": { "fr": "Il refuse, puis raconte votre visite en détail sur la radio locale. Vous avez fait sa campagne en une matinée.",
                    "en": "He refuses, then describes your visit in detail on local radio. You made his campaign in a single morning." } } }
  ]
},

{
  "id": "race_parachute",
  "weight": 4,
  "race": ["municipales", "legislatives"],
  "tag": { "fr": "D'où vous venez", "en": "Where you come from" },
  "text": {
    "fr": "Une affichette circule avec une carte, deux dates et une question : depuis quand habitez-vous vraiment ici ? Le fait est établi, la conclusion est fausse, et tout le monde s'en fiche.",
    "en": "A flyer is going round with a map, two dates and a question: how long have you actually lived here? The fact is established, the conclusion is wrong, and nobody cares either way."
  },
  "choices": [
    { "label": { "fr": "Raconter votre histoire ici, en détail", "en": "Tell your story here, in detail" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 7 },
        "result": { "fr": "Vous citez l'école, la rue et le nom du boulanger d'avant. Ce n'est pas une réponse, c'est une preuve, et elle suffit.",
                    "en": "You name the school, the street and the baker who was there before. It is not an answer, it is a proof, and it does the job." } },
      "failure": { "effects": { "score": -4, "popularity": -3 },
        "result": { "fr": "Vous vous justifiez pendant six minutes. Celui qui se justifie a déjà perdu la question.",
                    "en": "You explain yourself for six minutes. Whoever explains himself has already lost the argument." } } },
    { "label": { "fr": "Assumer et parler d'autre chose", "en": "Own it and talk about something else" },
      "effects": { "score": 2, "sangfroid": 1 },
      "result": { "fr": "Vous dites que vous êtes arrivé il y a onze ans et que vous comptez mourir ici. On passe au dossier suivant.",
                  "en": "You say you arrived eleven years ago and intend to die here. Everyone moves on to the next question." } },
    { "label": { "fr": "Répondre par le passé de votre adversaire", "en": "Answer with your opponent's own record" },
      "effects": { "score": 4, "reputation": -2, "strike": "intrepide" },
      "result": { "fr": "Vous rappelez qu'il a été candidat dans deux autres villes avant celle-ci. C'est vrai, c'est bas, et la campagne devient une affaire de cadastre.",
                  "en": "You point out that he stood in two other towns before this one. It is true, it is cheap, and the campaign becomes an argument about land registry." } }
  ]
},

{
  "id": "race_vague",
  "weight": 4,
  "race": ["legislatives", "europeennes"],
  "tag": { "fr": "La vague", "en": "The wave" },
  "text": {
    "fr": "Ce scrutin ne parle pas de vous. Il parle du gouvernement, d'un mot prononcé à Paris et d'une colère qui n'a rien à voir avec votre circonscription. Vous êtes un bulletin dans un référendum qui n'existe pas.",
    "en": "This election is not about you. It is about the government, about a word said in the capital and about an anger that has nothing to do with your constituency. You are a ballot paper in a referendum that does not exist."
  },
  "choices": [
    { "label": { "fr": "Épouser la vague nationale", "en": "Ride the national wave" },
      "effects": { "score": 6, "standing": 4, "popularity": -3 },
      "result": { "fr": "Vous reprenez mot pour mot les éléments de langage du parti, y compris celui auquel vous ne croyez pas. Ça marche, et vous n'aurez plus jamais l'air d'autre chose.",
                  "en": "You repeat the party's talking points word for word, including the one you do not believe. It works, and you will never look like anything else again." } },
    { "label": { "fr": "Localiser la campagne de force", "en": "Force the campaign back to local ground" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "energie": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 8, "energie": -2, "reputation": 1 },
        "result": { "fr": "Vous ne parlez que de la ligne de bus, du collège et de l'hôpital. À la fin, on vote pour vous en votant contre votre camp.",
                    "en": "You talk about nothing but the bus route, the school and the hospital. In the end, people vote for you while voting against your side." } },
      "failure": { "effects": { "score": -5, "energie": -2 },
        "result": { "fr": "Personne ne veut parler du collège. Toutes les questions portent sur une phrase prononcée à quatre cents kilomètres d'ici.",
                    "en": "Nobody wants to talk about the school. Every question is about a sentence said four hundred kilometres away." } } },
    { "label": { "fr": "Prendre publiquement vos distances avec la direction", "en": "Publicly distance yourself from the leadership" },
      "effects": { "score": 5, "standing": -11, "appeal": { "self": -4,  "others": 5 }, "strike": "intrepide" },
      "result": { "fr": "Vous dites tout haut ce que vos électeurs pensent de votre propre camp. Ils vous réélisent, et la direction vous fait payer pendant cinq ans.",
                  "en": "You say out loud what your voters think of your own side. They re-elect you, and the leadership makes you pay for five years." } }
  ]
},

{
  "id": "race_gaffe_nationale",
  "moment": 2,
  "weight": 3,
  "race": ["legislatives", "europeennes"],
  "cast": "camp",
  "tag": { "fr": "À quatre cents kilomètres", "en": "Four hundred kilometres away" },
  "text": {
    "fr": "À dix jours du scrutin, {rival} lâche une phrase que personne ne pourra rattraper. Elle passe en boucle, elle n'a rien à voir avec votre campagne, et elle vous coûtera des voix ici.",
    "en": "Ten days out, {rival} says something nobody will be able to walk back. It runs on a loop, it has nothing to do with your campaign, and it will cost you votes here."
  },
  "choices": [
    { "label": { "fr": "Le désavouer immédiatement", "en": "Disown him immediately" },
      "effects": { "score": 5, "standing": -9, "reputation": 1 },
      "result": { "fr": "Vous êtes le premier du parti à le dire, et le seul pendant six heures. Ces six heures-là compteront dans les deux sens.",
                  "en": "You are the first in the party to say it, and the only one for six hours. Those six hours will count both ways." } },
    { "label": { "fr": "Faire bloc", "en": "Close ranks" },
      "effects": { "score": -6, "standing": 8 },
      "result": { "fr": "Vous expliquez qu'on a sorti la phrase de son contexte, ce qui est faux et se voit. La direction vous en sera reconnaissante longtemps.",
                  "en": "You explain that the sentence was taken out of context, which is untrue and shows. The leadership will remember it for a long time." } },
    { "label": { "fr": "Ne pas commenter et rester sur le terrain", "en": "No comment, and stay on the ground" },
      "effects": { "score": -1, "energie": -1, "sangfroid": 1, "strike": "lache" },
      "result": { "fr": "Vous passez la journée dans une zone commerciale à ne répondre à aucun journaliste. C'est raisonnable et personne ne s'en souviendra.",
                  "en": "You spend the day in a retail park refusing to answer any journalist. It is sensible and nobody will remember it." } }
  ]
},

{
  "id": "race_abstention",
  "weight": 4,
  "race": ["europeennes"],
  "tag": { "fr": "Personne ne vote", "en": "Nobody votes" },
  "text": {
    "fr": "Les enquêtes annoncent une participation autour de quarante pour cent. La campagne n'intéresse personne, ce qui veut dire que le scrutin se jouera sur ceux qui se déplacent quand même, et on sait très bien qui ils sont.",
    "en": "The surveys forecast a turnout around forty per cent. The campaign interests nobody, which means the result will be decided by the people who turn out anyway, and everybody knows exactly who they are."
  },
  "choices": [
    { "label": { "fr": "Mobiliser votre base et elle seule", "en": "Mobilise your base and nobody else" },
      "effects": { "score": 7, "appeal": { "self": 7,  "others": -2 }, "strike": "radical" },
      "result": { "fr": "Vous parlez cinq semaines à ceux qui votent déjà pour vous, avec les mots qu'ils attendent. C'est efficace et c'est exactement pour ça que ce scrutin est ce qu'il est.",
                  "en": "You spend five weeks talking to people who already vote for you, in the words they expect. It works, and it is exactly why this election is what it is." } },
    { "label": { "fr": "Faire campagne pour la participation elle-même", "en": "Campaign for turnout itself" },
      "effects": { "score": -2, "reputation": 3, "energie": -2 },
      "result": { "fr": "Vous expliquez pendant cinq semaines à quoi sert ce Parlement. Les salles sont vides et deux professeurs vous écrivent pour vous remercier.",
                  "en": "You spend five weeks explaining what this Parliament is for. The halls are empty and two teachers write to thank you." } },
    { "label": { "fr": "Transformer le scrutin en sanction du gouvernement", "en": "Turn the election into a verdict on the government" },
      "effects": { "score": 8, "reputation": -2, "landscape": { "ruling": -1.2 } },
      "result": { "fr": "Vous ne parlez pas une fois de l'Europe en cinq semaines. C'est la meilleure façon de gagner une européenne, et tout le monde le sait depuis quarante ans.",
                  "en": "You do not mention Europe once in five weeks. It is the best way to win a European election, and everybody has known it for forty years." } }
  ]
},

{
  "id": "race_journal_local",
  "weight": 3,
  "race": ["municipales", "legislatives"],
  "tag": { "fr": "Le journal local", "en": "The local paper" },
  "text": {
    "fr": "Le quotidien régional prépare son portrait de chaque candidat. Deux pages, une photo, et un journaliste qui couvre la ville depuis vingt-deux ans et connaît vos dossiers mieux que vous.",
    "en": "The regional daily is preparing its profile of each candidate. Two pages, a photograph, and a reporter who has covered the town for twenty-two years and knows your files better than you do."
  },
  "choices": [
    { "label": { "fr": "Lui ouvrir vos archives et vos comptes", "en": "Open your files and your accounts to him" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 7, "reputation": 2 },
        "result": { "fr": "Il trouve deux erreurs et beaucoup de travail. Le portrait est honnête, un peu sévère, et il vaut trois pages de publicité.",
                    "en": "He finds two mistakes and a great deal of work. The profile is honest, slightly severe, and it is worth three pages of advertising." } },
      "failure": { "effects": { "score": -6, "reputation": -2 },
        "result": { "fr": "Il trouve exactement ce que vous aviez oublié. Le portrait s'ouvre sur un chiffre et se referme sur une question sans réponse.",
                    "en": "He finds exactly what you had forgotten. The profile opens on a figure and closes on an unanswered question." } } },
    { "label": { "fr": "Ne répondre que par écrit", "en": "Answer only in writing" },
      "effects": { "score": -3, "sangfroid": 1 },
      "result": { "fr": "Vos réponses sont irréprochables et parfaitement mortes. Le journal publie le questionnaire tel quel, ce qui est une façon de vous punir.",
                  "en": "Your answers are impeccable and completely dead. The paper prints the questionnaire as it is, which is its way of punishing you." } },
    { "label": { "fr": "Acheter deux pages de publicité la même semaine", "en": "Buy two pages of advertising the same week" },
      "when": { "minMoney": 25000 },
      "roll": { "chance": 0.58, "chanceBonus": [ { "when": { "stat": { "reseau": { "min": 12 } } }, "value": 0.15 },
                                                 { "when": { "background": ["journalism"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": 5, "money": -14000, "reputation": -1 },
        "result": { "fr": "Personne ne fera jamais le lien, et tout le monde le fera. Le portrait paraît, aimable, à côté de votre encart.",
                    "en": "Nobody will ever make the connection, and everybody will. The profile appears, friendly, next to your advertisement." } },
      "failure": { "effects": { "score": -3, "money": -14000, "reputation": -2 },
        "result": { "fr": "La rédaction n'aime pas qu'on lui explique son métier avec un bon de commande. Le portrait paraît, dur, et l'encart est en page suivante.",
                    "en": "The newsroom dislikes being told its job with a purchase order. The profile runs, hard, and the advertisement is on the following page." } } }
  ]
},

{
  "id": "race_salle_vide",
  "weight": 3,
  "tag": { "fr": "La salle", "en": "The hall" },
  "text": {
    "fr": "Vous avez loué une salle de quatre cents places. Il y a soixante personnes, dont onze de votre équipe, et un photographe du journal qui prend la salle plutôt que la tribune.",
    "en": "You booked a four-hundred-seat hall. Sixty people are there, eleven of them your own team, and a press photographer shooting the room rather than the platform."
  },
  "choices": [
    { "label": { "fr": "Faire le meeting quand même, à fond", "en": "Do the rally anyway, full force" },
      "effects": { "score": 3, "energie": -2 },
      "result": { "fr": "Vous parlez cinquante minutes comme s'ils étaient quatre cents. Les soixante en parleront pendant un mois, chacun à vingt personnes.",
                  "en": "You speak for fifty minutes as if there were four hundred of them. The sixty will talk about it for a month, each to twenty people." } },
    { "label": { "fr": "Descendre de scène et faire un cercle", "en": "Come down from the platform and form a circle" },
      "effects": { "score": 6, "energie": -1, "reputation": 1 },
      "result": { "fr": "Vous renvoyez le pupitre en coulisses et vous vous asseyez au milieu d'eux. La photo du journal change complètement de sens.",
                  "en": "You send the lectern backstage and sit down among them. The photograph in the paper takes on a completely different meaning." } },
    { "label": { "fr": "Annuler et invoquer un contretemps", "en": "Cancel and cite a scheduling problem" },
      "effects": { "score": -5, "energie": 2, "strike": "lache" },
      "result": { "fr": "Vous partez avant le début en laissant votre suppléant lire un texte. Le photographe garde le cliché de la salle vide pour une autre fois.",
                  "en": "You leave before it starts, letting your deputy read out a statement. The photographer keeps the empty-hall shot for another occasion." } }
  ]
},

{
  "id": "race_succession",
  "weight": 4,
  "race": ["congres"],
  "cast": "camp",
  "tag": { "fr": "La succession", "en": "The succession" },
  "text": {
    "fr": "{rival} ne se représentera pas, et il n'a désigné personne. Sa dernière semaine à la tête du parti vaut plus que toutes vos motions : ce qu'il dira de vous en partant décidera d'une partie des voix.",
    "en": "{rival} will not stand again, and has designated nobody. His last week at the head of the party is worth more than all your motions: what he says about you on the way out will decide a share of the votes."
  },
  "choices": [
    { "label": { "fr": "Lui rendre un hommage appuyé au congrès", "en": "Pay him a heavy tribute at the conference" },
      "effects": { "score": 6, "reputation": -1 },
      "result": { "fr": "Douze minutes sur son bilan, dont vous ne pensez pas un mot. Il vous cite le lendemain, sans vous désigner, et tout le monde comprend.",
                  "en": "Twelve minutes on his record, not a word of which you believe. He quotes you the next day, without naming you, and everyone understands." } },
    { "label": { "fr": "Faire campagne contre son bilan", "en": "Campaign against his record" },
      "effects": { "score": -4, "popularity": 5, "reputation": 2, "strike": "intrepide" },
      "result": { "fr": "Vous dites que le parti a perdu dix ans. C'est vrai, la presse le reprend, et les militants qui ont vécu ces dix ans votent contre vous.",
                  "en": "You say the party lost ten years. It is true, the press picks it up, and the members who lived through those ten years vote against you." } },
    { "label": { "fr": "Lui promettre de garder ses équipes", "en": "Promise to keep his people" },
      "effects": { "score": 9, "standing": 3, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "Vous garantissez leurs postes à ses quatre fidèles. Vous en garderez deux, et les deux autres l'apprendront par un communiqué.",
                  "en": "You guarantee the jobs of his four loyalists. You will keep two, and the other two will find out from a press release." } }
  ]
},

/* ==========================================================================
   CE QUE LA CIRCONSCRIPTION DOIT AU PARTI, ET RÉCIPROQUEMENT
   ==========================================================================
   Seize scènes pour près de quatorze tirages par carrière : on rejouait la
   même salle vide et le même journal local trois fois par vie politique. Les
   six qui suivent élargissent le paquet, et elles posent toutes la même
   question que les précédentes évitaient — une campagne locale se gagne
   contre le parti aussi souvent qu'avec lui.
   ========================================================================== */

{
  "id": "race_colistiers",
  "moment": [3, 2],
  "race": ["municipales"],
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Il vous faut trente-neuf colistiers avant vendredi. La fédération vous en impose douze, vous en connaissez quinze qui savent travailler, et les deux listes n'ont que trois noms en commun.",
    "en": "You need thirty-nine running mates by Friday. The federation is imposing twelve, you know fifteen who can actually work, and the two lists have three names in common."
  },
  "choices": [
    { "label": { "fr": "Prendre les douze de la fédération", "en": "Take the federation's twelve" },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "trait": ["appareil"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": 3, "standing": 8, "reseau": 2 },
        "result": { "fr": "La fédération met tout le monde sur le terrain dès le lendemain. Vous aurez un conseil municipal ingérable pendant six ans, ce qui est un problème de gagnant.",
                    "en": "The federation puts everybody on the ground the next day. You will have an ungovernable council for six years, which is a winner's problem." } },
      "failure": { "effects": { "score": -3, "standing": 3, "popularity": -4, "energie": -1 },
        "result": { "fr": "Deux des douze ont une affaire en cours et un troisième habite à quarante kilomètres. Le quotidien régional publie les trois fiches le même jour.",
                    "en": "Two of the twelve have a case pending and a third lives twenty-five miles away. The regional daily runs all three profiles on the same day." } } },
    { "label": { "fr": "Composer votre liste vous-même", "en": "Pick your own list" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 5, "popularity": 6, "standing": -7, "credibilite": 1 },
        "result": { "fr": "Une infirmière, un patron de PME, deux profs et personne de la fédération. La liste est bonne, elle se voit, et le siège apprend les noms par la presse.",
                    "en": "A nurse, a small-business owner, two teachers and nobody from the federation. The list is good, it shows, and headquarters learns the names from the press." } },
      "failure": { "effects": { "score": -5, "standing": -12, "energie": -2,
                                "landscape": { "self": -0.4 } },
        "result": { "fr": "Trois de vos quinze se désistent en quarante-huit heures après un coup de téléphone de la fédération. Vous complétez la liste avec des inconnus, en vingt-quatre heures.",
                    "en": "Three of your fifteen withdraw within forty-eight hours after a phone call from the federation. You fill the list with strangers, in a day." } } },
    { "label": { "fr": "Négocier nom par nom", "en": "Negotiate name by name" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "reseau": 0.35, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "score": 4, "standing": 5, "reseau": 2, "energie": -2 },
        "result": { "fr": "Onze heures de réunion, trois pauses cigarette et un tableau au feutre. Vous sortez avec huit des leurs, douze des vôtres, et personne qui ait envie de recommencer.",
                    "en": "Eleven hours of meetings, three cigarette breaks and a flipchart. You come out with eight of theirs, twelve of yours, and nobody who wants to do it again." } },
      "failure": { "effects": { "score": -4, "standing": -6, "energie": -3, "reputation": -1 },
        "result": { "fr": "Onze heures pour arriver au vendredi sans liste. La préfecture ferme à dix-sept heures et le dépôt se fait dans la panique, avec les douze de la fédération.",
                    "en": "Eleven hours to arrive at Friday with no list. The registry closes at five and the filing is done in a panic, with the federation's twelve." } } }
  ]
},

{
  "id": "race_permanence",
  "moment": [3, 2],
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Il faut une permanence de campagne. Le siège en propose une, gratuite, dans une zone d'activité derrière un magasin de carrelage. L'autre est en centre-ville, avec une vitrine, et il faut la payer.",
    "en": "You need a campaign office. Headquarters offers one, free, in an industrial estate behind a tile showroom. The other is in the town centre, with a shopfront, and you have to pay for it."
  },
  "choices": [
    { "label": { "fr": "Payer la vitrine du centre-ville", "en": "Pay for the town-centre shopfront" },
      "when": { "minMoney": 15000 },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "minPopularity": 55 }, "value": 0.15 } ] },
      "success": { "effects": { "score": 4, "money": -14000, "popularity": 4, "reseau": 1 },
        "result": { "fr": "Quarante personnes poussent la porte le premier samedi, dont onze qui ne vous auraient jamais téléphoné. Une vitrine est le seul outil de campagne qui travaille la nuit.",
                    "en": "Forty people push the door on the first Saturday, eleven of whom would never have phoned. A shopfront is the only campaign tool that works at night." } },
      "failure": { "effects": { "score": -1, "money": -14000, "energie": -1, "standing": -2 },
        "result": { "fr": "La vitrine est belle, et elle est sur la seule rue que la ville a piétonnisée le mois dernier. Personne ne passe plus devant, sauf le samedi matin.",
                    "en": "The shopfront is handsome, and it is on the one street the town pedestrianised last month. Nobody walks past any more, except on a Saturday morning." } } },
    { "label": { "fr": "Prendre le local gratuit du siège", "en": "Take headquarters' free unit" },
      "roll": { "chance": 0.6 },
      "success": { "effects": { "score": 1, "standing": 5, "money": 3000, "reseau": 1 },
        "result": { "fr": "Personne ne vient jamais, ce qui laisse toute la place pour empiler des tracts et tenir des réunions que personne ne voit. C'est plus utile qu'une vitrine et beaucoup plus triste.",
                    "en": "Nobody ever comes, which leaves plenty of room to stack leaflets and hold meetings nobody sees. It is more useful than a shopfront and a great deal sadder." } },
      "failure": { "effects": { "score": -3, "standing": 2, "popularity": -3, "energie": -1 },
        "result": { "fr": "Un journaliste vient faire un portrait et photographie le magasin de carrelage. La légende dit « la campagne d'un candidat qu'on ne voit pas », et elle n'a pas tort.",
                    "en": "A reporter comes to do a profile and photographs the tile showroom. The caption reads “the campaign of a candidate nobody sees”, and it is not wrong." } } },
    { "label": { "fr": "Faire campagne sans permanence du tout", "en": "Campaign with no office at all" },
      "roll": { "base": 15, "stat": "energie", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 3, "popularity": 5, "money": 6000, "energie": -2,
                                "notoriete": 1 },
        "result": { "fr": "Vous tenez la campagne depuis une table de café, un téléphone et le coffre de la voiture. Trois journaux locaux en font un papier, et le papier vaut la vitrine.",
                    "en": "You run the campaign from a café table, a telephone and the boot of the car. Three local papers write it up, and the write-up is worth the shopfront." } },
      "failure": { "effects": { "score": -4, "energie": -3, "standing": -4, "reseau": -1 },
        "result": { "fr": "Les militants n'ont nulle part où se retrouver, alors ils ne se retrouvent pas. On perd trois semaines à s'appeler pour savoir qui a les clés de quoi.",
                    "en": "The activists have nowhere to meet, so they do not meet. Three weeks go on phoning each other to find out who has the keys to what." } } }
  ]
},

{
  "id": "race_sortant",
  "moment": [3, 2],
  "race": ["municipales", "legislatives"],
  "cast": "camp_senior",
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "{rival} occupe le siège depuis vingt-deux ans et la commission vous a investi à sa place. {Il} ne l'a pas contesté, {il} n'a rien dit du tout, et {il} n'a pas rendu le fichier ni les clés de la permanence.",
    "en": "{rival} has held the seat for twenty-two years and the committee nominated you instead. {He} did not contest it, {he} said nothing at all, and {he} has not handed over the contact file or the keys to the office."
  },
  "choices": [
    { "label": { "fr": "Aller {le} chercher chez {lui}", "en": "Go and see {him} at home" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reputation": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 6, "standing": 6, "reseau": 2 },
        "result": { "fr": "Deux heures dans une cuisine, sans témoin. {Il} vous donne les clés, le fichier, et le nom des quatre personnes qu'il faut voir avant les autres. {Il} ne fera pas campagne, et {il} ne fera pas campagne contre vous.",
                    "en": "Two hours in a kitchen, no witnesses. {He} hands over the keys, the file, and the names of the four people to see before anyone else. {He} will not campaign, and {he} will not campaign against you." } },
      "failure": { "effects": { "score": -3, "standing": -4, "energie": -1, "reputation": -1 },
        "result": { "fr": "{Il} vous reçoit debout dans l'entrée, poliment, pendant quatre minutes. Vous repartez sans les clés et avec la certitude que la circonscription le saura avant vous.",
                    "en": "{He} receives you standing in the hallway, politely, for four minutes. You leave without the keys and certain that the constituency will know before you do." } } },
    { "label": { "fr": "{Le} mettre en tête d'affiche de votre campagne", "en": "Put {him} at the top of your campaign posters" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 } ] },
      "success": { "effects": { "score": 5, "popularity": -3, "standing": 7,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "Son nom en gros au-dessus du vôtre sur douze mille tracts. Vingt-deux ans d'électeurs suivent une photo, et cela ne s'achète pas autrement.",
                    "en": "{His} name larger than yours on twelve thousand leaflets. Twenty-two years of voters follow a photograph, and there is no other way to buy that." } },
      "failure": { "effects": { "score": -4, "popularity": -6, "notoriete": -2, "standing": -3 },
        "result": { "fr": "Les électeurs lisent son nom, retiennent son nom, et beaucoup d'entre eux croiront jusqu'au dimanche que c'est {lui} le candidat.",
                    "en": "Voters read {his} name, remember {his} name, and many of them will believe until Sunday that {he} is the candidate." } } },
    { "label": { "fr": "Faire campagne contre vingt-deux ans d'immobilisme", "en": "Campaign against twenty-two years of standing still" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 4, "popularity": 8, "standing": -10, "notoriete": 2 },
        "result": { "fr": "Vous faites toute la campagne sur le renouvellement sans jamais prononcer son nom, ce qui est plus efficace que de le prononcer. La circonscription comprend très bien.",
                    "en": "You run the whole campaign on renewal without ever saying {his} name, which is more effective than saying it. The constituency understands perfectly." } },
      "failure": { "effects": { "score": -6, "standing": -13, "popularity": -4,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "{Il} sort de son silence le mercredi pour dire du mal de vous pendant six minutes sur la radio locale, et six minutes suffisent largement.",
                    "en": "{He} breaks {his} silence on the Wednesday to speak against you for six minutes on local radio, and six minutes is more than enough." } } }
  ]
},

{
  "id": "race_reseaux",
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Une vidéo de vous, tournée par un militant de vingt ans avec un téléphone, fait cent quatre-vingt mille vues en deux jours. Vous y êtes drôle, mal cadré, et vous dites une phrase que votre parti n'a jamais validée.",
    "en": "A video of you, shot by a twenty-year-old activist on a phone, gets a hundred and eighty thousand views in two days. In it you are funny, badly framed, and you say a line your party has never signed off."
  },
  "choices": [
    { "label": { "fr": "En faire toute votre campagne", "en": "Build the whole campaign on it" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 5, "notoriete": 3, "popularity": 7, "standing": -6 },
        "result": { "fr": "Quatorze vidéos en trois semaines, toujours mal cadrées, toujours drôles. Vous touchez plus de gens que six mois de tractage et le siège apprend le mot « format ».",
                    "en": "Fourteen videos in three weeks, always badly framed, always funny. You reach more people than six months of leafleting and headquarters learns the word “format”." } },
      "failure": { "effects": { "score": -4, "popularity": -7, "credibilite": -2, "standing": -4 },
        "result": { "fr": "La quatrième vidéo est de trop, et la sixième est reprise par un compte adverse qui n'a rien eu à monter. On ne fait pas quatorze fois la même blague.",
                    "en": "The fourth video is one too many, and the sixth is picked up by an opposing account that had nothing to edit. You cannot make the same joke fourteen times." } } },
    { "label": { "fr": "La faire retirer et publier la version validée", "en": "Take it down and publish the approved version" },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "background": ["comms"] }, "value": 0.2 } ] },
      "success": { "effects": { "score": 1, "standing": 6, "credibilite": 1, "popularity": -2 },
        "result": { "fr": "La version validée fait onze mille vues, ce qui est un désastre et ce dont personne au siège ne se plaindra jamais. La ligne est tenue.",
                    "en": "The approved version gets eleven thousand views, which is a disaster and which nobody at headquarters will ever complain about. The line has held." } },
      "failure": { "effects": { "score": -5, "popularity": -8, "notoriete": 1, "standing": -3 },
        "result": { "fr": "Internet n'oublie rien et la suppression fait trois fois plus de vues que la vidéo. Le militant de vingt ans, lui, ne recollera plus jamais une affiche.",
                    "en": "The internet forgets nothing and the deletion gets three times the views of the video. The twenty-year-old activist, for his part, will never put up another poster." } } },
    { "label": { "fr": "Ne rien faire et laisser courir", "en": "Do nothing and let it run" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.2 } ] },
      "success": { "effects": { "score": 3, "notoriete": 2, "popularity": 3, "energie": 1 },
        "result": { "fr": "La vidéo vit sa vie et meurt en dix jours, comme toutes les vidéos. Elle aura laissé cent quatre-vingt mille personnes avec votre visage et aucune polémique.",
                    "en": "The video lives its life and dies in ten days, like all videos. It leaves a hundred and eighty thousand people with your face and no row." } },
      "failure": { "effects": { "score": -3, "standing": -8, "credibilite": -1 },
        "result": { "fr": "Un porte-parole national doit s'expliquer sur votre phrase à l'antenne, mal, un mardi matin. On vous appellera le soir même et ce ne sera pas pour vous féliciter.",
                    "en": "A national spokesperson has to account for your line on air, badly, on a Tuesday morning. You will get a call that evening and it will not be congratulations." } } }
  ]
},

{
  "id": "race_promesse_locale",
  "moment": 2,
  "race": ["municipales", "legislatives", "europeennes"],
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "L'usine de la ville ferme dans huit mois et huit cents personnes le savent. Le programme national de votre parti dit exactement le contraire de ce qu'il faudrait promettre ici, et il le dit page onze.",
    "en": "The town's factory closes in eight months and eight hundred people know it. Your party's national programme says exactly the opposite of what would need to be promised here, and it says it on page eleven."
  },
  "choices": [
    { "label": { "fr": "Promettre de la sauver, quoi qu'il en coûte", "en": "Promise to save it, whatever it takes" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "charisme": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 6, "popularity": 8, "standing": -9, "credibilite": -1,
                                "strike": "menteur" },
        "result": { "fr": "Vous le dites devant la grille à six heures du matin, et huit cents personnes vous croient parce qu'elles ont besoin de croire quelqu'un. Vous savez déjà que vous ne pourrez pas.",
                    "en": "You say it at the factory gate at six in the morning, and eight hundred people believe you because they need to believe somebody. You already know you will not be able to." } },
      "failure": { "effects": { "score": -3, "popularity": -5, "credibilite": -3, "standing": -6 },
        "result": { "fr": "Un délégué syndical vous demande, devant tout le monde, comment. Vous n'avez pas de réponse et le silence dure onze secondes de trop.",
                    "en": "A union rep asks you, in front of everybody, how. You have no answer and the silence lasts eleven seconds too long." } } },
    { "label": { "fr": "Dire la vérité et parler de l'après", "en": "Tell the truth and talk about what comes next" },
      "roll": { "base": 16, "stat": "credibilite", "plus": { "reputation": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 3, "credibilite": 3, "popularity": 5, "standing": 5,
                                "reputation": 2, "landscape": { "self": 0.4 } },
        "result": { "fr": "Vous dites qu'elle fermera, et vous restez deux heures de plus pour parler du terrain, des formations et de qui paie. Personne ne vous applaudit et tout le monde vous écoute.",
                    "en": "You say it will close, and you stay two hours longer to talk about the site, retraining and who pays. Nobody applauds you and everybody listens." } },
      "failure": { "effects": { "score": -6, "popularity": -9, "standing": -3, "energie": -2 },
        "result": { "fr": "On vous entend dire « elle fermera » et on n'entend rien d'autre. La phrase fait le tour de la ville en une journée, amputée de tout ce qui suivait.",
                    "en": "People hear you say “it will close” and hear nothing else. The sentence goes round the town in a day, stripped of everything that followed it." } } },
    { "label": { "fr": "Éviter le sujet pendant toute la campagne", "en": "Avoid the subject for the whole campaign" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 } ] },
      "success": { "effects": { "score": -1, "standing": 3, "energie": 1 },
        "result": { "fr": "Vous parlez de sécurité, de transports et de sport scolaire pendant trois semaines. Personne ne vous pose la question, parce que personne n'attend plus rien.",
                    "en": "You talk about policing, transport and school sport for three weeks. Nobody asks you the question, because nobody expects anything any more." } },
      "failure": { "effects": { "score": -5, "popularity": -8, "reputation": -2, "standing": -3 },
        "result": { "fr": "On vous la pose au débat, en dernière question, et votre hésitation dure exactement le temps qu'il faut pour faire un extrait de quinze secondes.",
                    "en": "You are asked at the debate, as the last question, and your hesitation lasts exactly as long as it takes to make a fifteen-second clip." } } }
  ]
},

{
  "id": "race_strasbourg",
  "race": ["europeennes"],
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "On vous demande, dans quatre réunions publiques d'affilée, ce que fait exactement un député européen. La réponse honnête prend huit minutes, la réponse utile en prend quinze secondes, et ce ne sont pas les mêmes.",
    "en": "At four public meetings in a row, you are asked what a Member of the European Parliament actually does. The honest answer takes eight minutes, the useful answer takes fifteen seconds, and they are not the same answer."
  },
  "choices": [
    { "label": { "fr": "Expliquer vraiment, pendant huit minutes", "en": "Actually explain it, for eight minutes" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 4, "credibilite": 2, "popularity": 5, "reputation": 1 },
        "result": { "fr": "Vous expliquez les commissions, les trilogues et pourquoi votre voix compte sur les emballages. Quarante personnes comprennent, et trente-huit voteront.",
                    "en": "You explain committees, trilogues and why your vote matters on packaging. Forty people understand, and thirty-eight of them will vote." } },
      "failure": { "effects": { "score": -4, "popularity": -5, "energie": -2 },
        "result": { "fr": "Au bout de quatre minutes, six personnes regardent leur téléphone et l'organisateur cherche votre regard. La deuxième moitié de l'explication ne sera jamais donnée.",
                    "en": "After four minutes, six people are looking at their phones and the organiser is trying to catch your eye. The second half of the explanation will never be given." } } },
    { "label": { "fr": "Répondre en parlant de tout autre chose", "en": "Answer by talking about something else entirely" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 5, "popularity": 6, "notoriete": 1, "credibilite": -1 },
        "result": { "fr": "Vous parlez de la ferme d'à côté, du prix du gazole et de Bruxelles comme d'un adversaire. C'est une campagne nationale déguisée en campagne européenne, et c'est ce que sont toutes les européennes.",
                    "en": "You talk about the farm down the road, the price of diesel and Brussels as an opponent. It is a national campaign dressed as a European one, and that is what every European election is." } },
      "failure": { "effects": { "score": -3, "credibilite": -2, "popularity": -4, "standing": -2 },
        "result": { "fr": "Quelqu'un vous fait remarquer que vous n'avez pas répondu, et vous ne répondez pas non plus à cette remarque-là. La salle en tire ses conclusions.",
                    "en": "Somebody points out that you did not answer, and you do not answer that either. The room draws its conclusions." } } },
    { "label": { "fr": "Dire que c'est une élection nationale, et l'assumer", "en": "Say it is a national election, and own it" },
      "when": { "personality": ["provocative", "principled"] },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reputation": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 4, "popularity": 7, "notoriete": 2, "reputation": 1,
                                "landscape": { "self": 0.5 } },
        "result": { "fr": "Vous dites que personne ne vote pour un député européen, que tout le monde vote contre un gouvernement, et que vous ne ferez pas semblant. La salle applaudit d'un coup.",
                    "en": "You say that nobody votes for an MEP, that everybody votes against a government, and that you will not pretend otherwise. The room applauds all at once." } },
      "failure": { "effects": { "score": -5, "credibilite": -3, "standing": -6, "popularity": -3 },
        "result": { "fr": "Vous venez d'expliquer devant deux cents personnes que le mandat que vous briguez ne sert à rien. C'est vrai, c'est courageux, et c'est un argument de campagne pour quelqu'un d'autre.",
                    "en": "You have just explained to two hundred people that the office you are seeking is pointless. It is true, it is brave, and it is a campaign argument for somebody else." } } }
  ]
}

];
