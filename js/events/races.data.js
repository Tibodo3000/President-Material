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
      "effects": { "score": 6, "money": -18000 },
      "result": { "fr": "Trois cents versions du même message, découpées par quartier et par âge. Vous touchez des gens qui ne vous verront jamais.",
                  "en": "Three hundred versions of the same message, cut by neighbourhood and age. You reach people who will never see you in person." } },
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
      "effects": { "score": 6, "money": -28000, "reputation": -1 },
      "result": { "fr": "Un affichage complet, deux encarts et un envoi postal à tous les électeurs. La déclaration de compte de campagne posera des questions.",
                  "en": "Full billboard coverage, two press inserts and a mailshot to every voter. The campaign accounts will raise questions." } },
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
      "effects": { "score": 5, "standing": -11, "popularity": 4, "strike": "intrepide" },
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
      "effects": { "score": 7, "popularity": -4, "strike": "radical" },
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
      "effects": { "score": 5, "money": -14000, "reputation": -1 },
      "result": { "fr": "Personne ne fera jamais le lien, et tout le monde le fera. Le portrait paraît, aimable, à côté de votre encart.",
                  "en": "Nobody will ever make the connection, and everybody will. The profile appears, friendly, next to your advertisement." } }
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
}

];
