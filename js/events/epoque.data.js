/*
 * President Material — L'ÉPOQUE, ET CE QU'ELLE FAIT PASSER.
 * ============================================================================
 *
 * Le jeu était devenu sage. Il racontait très bien les couloirs, les congrès
 * et les investitures, c'est-à-dire la politique vue par ceux qui la font, et
 * presque jamais CE SUR QUOI ELLE PORTE : une nappe phréatique vide au mois
 * de juillet, une cantine devenue un champ de bataille, une forêt échangée
 * contre un entrepôt, une statue à deux cent mille euros.
 *
 * Ce paquet s'occupe de ça. La satire n'y vise jamais les gens qui subissent
 * la scène, et toujours la machine qui la traite : le communiqué qui arrive
 * avant les faits, la dérogation qui existe pour ceux qui savent la demander,
 * la commission dont le calendrier n'est pas précisé, le mot qu'on emploie
 * pour ne pas dire la chose. Le ridicule est du côté du pouvoir, jamais du
 * côté de ceux à qui il arrive quelque chose.
 *
 * TROIS RÈGLES QUI TIENNENT LE TON :
 *   1. On décrit, on ne commente pas. Le chiffre exact, l'horaire exact, le
 *      nom de la procédure. C'est la précision qui fait rire, pas l'adjectif.
 *   2. Aucune option n'est propre. Celle qui a raison sur le fond coûte, celle
 *      qui arrange coûte ailleurs, et celle qui ne fait rien coûte aussi.
 *   3. Le geste qui prend un camp de front se paie chez ce camp-là : ces
 *      scènes portent des positions, donc "axis", et jamais une popularité
 *      nue qui ferait applaudir tout le monde.
 *
 * Le schéma complet est en tête de js/events/_assemble.data.js.
 * ============================================================================
 */
const EV_epoque = [

{
  "id": "ep_baches_ombre",
  "weight": 3,
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 14 },
  "tag": { "fr": "Quarante-trois degrés", "en": "Forty-three degrees" },
  "text": {
    "fr": "Troisième canicule de l'été. Une société installe des bâches tendues au-dessus de quatre places du centre-ville et fait payer l'accès à l'ombre deux euros la demi-heure, gratuit pour les moins de six ans. La ville a signé parce qu'elle n'avait pas les moyens de le faire elle-même, et la file d'attente commence à seize heures.",
    "en": "The third heatwave of the summer. A company has stretched awnings over four squares in the town centre and charges two euros for half an hour of shade, free for the under-sixes. The town signed because it could not afford to do it itself, and the queue starts at four in the afternoon."
  },
  "choices": [
    { "label": { "fr": "Déposer une loi : l'ombre ne se vend pas", "en": "Table a bill: shade is not for sale" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "credibilite": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "axis": { "economy": -70, "power": -30 }, "popularity": 9, "notoriete": 3,
                                "credibilite": 2, "landscape": { "self": 0.9 } },
        "result": { "fr": "Le texte tient en deux articles et il est repris par trois groupes en une semaine. Les bâches restent, elles sont gratuites, et la société explique qu'elle étudie d'autres modèles économiques.",
                    "en": "The bill runs to two clauses and three groups sign up to it within a week. The awnings stay, they are free, and the company explains that it is looking at other business models." } },
      "failure": { "effects": { "popularity": -4, "credibilite": -1, "energie": -2, "standing": -3 },
        "result": { "fr": "On vous répond que la commune est libre de contracter et que votre texte est inapplicable. C'est exact sur les deux points, et la file d'attente est toujours là le lendemain.",
                    "en": "You are told that the town is free to contract as it likes and that your bill is unworkable. Both are true, and the queue is still there the next day." } } },
    { "label": { "fr": "Négocier une tarification sociale avec l'exploitant", "en": "Negotiate a social tariff with the operator" },
      "effects": { "credibilite": 2, "reseau": 2, "reputation": 1, "popularity": 2, "energie": -1 },
      "result": { "fr": "Gratuité pour les plus de soixante-dix ans sur présentation d'un justificatif de domicile, à retirer en mairie du lundi au jeudi. Vous avez obtenu quelque chose de réel et personne, jamais, n'ira le chercher.",
                  "en": "Free entry for the over-seventies on production of proof of address, obtainable at the town hall Monday to Thursday. You have won something real, and nobody, ever, will go and collect it." } },
    { "label": { "fr": "Assumer : la ville n'avait pas d'autre solution", "en": "Own it: the town had no other option" },
      "effects": { "axis": { "economy": 75 }, "popularity": 6, "credibilite": 2, "standing": 4, "reputation": -1 },
      "result": { "fr": "Vous expliquez qu'entre une place vide et une place à l'ombre payante, le choix est vite fait, et que ceux qui s'indignent n'ont jamais eu à équilibrer un budget communal. La moitié du pays trouve ça d'un cynisme reposant.",
                  "en": "You explain that between an empty square and a paying square in the shade the choice is easy, and that the people who are outraged have never had to balance a town budget. Half the country finds that restfully cynical." } },
    { "label": { "fr": "Passer l'après-midi dans la file, avec les autres", "en": "Spend the afternoon in the queue, with everyone else" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "popularity": 8, "notoriete": 2, "energie": -2, "credibilite": -2, "standing": -3 },
      "result": { "fr": "Quatre heures debout à quarante-trois degrés, sans écharpe et sans caméra convoquée. Une passante vous filme quand même, la vidéo fait le tour du pays, et l'on vous reproche à la fois de l'avoir fait et de l'avoir laissé filmer.",
                  "en": "Four hours standing in forty-three degrees, with no sash and no cameras called in. A passer-by films you anyway, the video goes round the country, and you are blamed both for doing it and for letting it be filmed." } }
  ]
},

{
  "id": "ep_cantine_porc",
  "weight": 3,
  "when": { "position": ["maire", "conseiller"], "minTurn": 8 },
  "tag": { "fr": "La cantine", "en": "The school canteen" },
  "text": {
    "fr": "Les cantines de la ville ont retiré le porc de leurs menus, sans délibération et sans communiqué, parce que la moitié des barquettes revenait pleine. Le syndicat des bouchers annonce qu'il déposera des carcasses devant la mairie jeudi, un collectif de parents parle de reculade, et deux chaînes d'information ont déjà réservé une place de parking.",
    "en": "The town's school canteens have taken pork off the menu, with no vote and no press release, because half the trays were coming back untouched. The butchers' union announces that it will dump carcasses outside the town hall on Thursday, a parents' group is calling it a surrender, and two news channels have already booked a parking space."
  },
  "choices": [
    { "label": { "fr": "Rétablir le porc, et une seule barquette pour tout le monde", "en": "Put pork back, one tray for everybody" },
      "effects": { "axis": { "social": 65, "world": 40 }, "popularity": 8, "standing": 5, "notoriete": 2,
                   "reputation": -1 },
      "result": { "fr": "Vous parlez de règle commune devant quatorze micros. Le taux de fréquentation de la cantine baisse d'un tiers en trois semaines, ce qui n'intéresse plus personne, la séquence étant terminée.",
                  "en": "You talk about one rule for all in front of fourteen microphones. Canteen attendance falls by a third within three weeks, which interests nobody any more, the news cycle having moved on." } },
    { "label": { "fr": "Maintenir la décision et refuser d'en faire un sujet", "en": "Stand by the decision and refuse to make it a story" },
      "effects": { "axis": { "social": -60, "world": -40 }, "popularity": 7, "credibilite": 2, "standing": -6,
                   "energie": -1 },
      "result": { "fr": "Vous répondez que le rôle d'une mairie est de nourrir des enfants, pas d'arbitrer une guerre de civilisation, et vous ne répondez qu'une fois. Les carcasses arrivent quand même, et le parquet ouvre une enquête pour dépôt sauvage.",
                  "en": "You answer that a town hall's job is to feed children, not to arbitrate a clash of civilisations, and you answer only once. The carcasses turn up anyway, and the prosecutor opens a case for illegal dumping." } },
    { "label": { "fr": "Mettre deux menus, et laisser chacun choisir", "en": "Offer two menus and let everyone choose" },
      "effects": { "credibilite": 2, "reputation": 2, "money": -25000, "popularity": 3, "standing": -2,
                   "appeal": { "self": -3 } },
      "result": { "fr": "Deux barquettes, deux chaînes de froid, un marché public à repasser et une hausse du coût du repas que le conseil votera en novembre sans en parler. Personne n'a gagné et les enfants mangent, ce qui était le sujet au départ.",
                  "en": "Two trays, two cold chains, a public contract to redo and a rise in the cost of a meal that the council will approve in November without mentioning it. Nobody has won and the children eat, which was the subject to begin with." } },
    { "label": { "fr": "Recevoir les bouchers, et sortir avec eux devant les caméras", "en": "Receive the butchers, and come out with them in front of the cameras" },
      "when": { "personality": ["charming", "calculating"] },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "popularity": 5, "standing": 6, "credibilite": 1, "notoriete": 1 },
        "result": { "fr": "Une heure quarante dans votre bureau, deux cafés et une commande de la ville pour les repas des aînés. Ils repartent sans carcasses, en expliquant aux caméras qu'ils ont été entendus, ce qui est vrai et n'a rien réglé.",
                    "en": "One hour forty in your office, two coffees and a town order for the elderly meals service. They leave without the carcasses, telling the cameras that they have been heard, which is true and has settled nothing." } },
      "failure": { "effects": { "standing": -5, "popularity": -6, "reputation": -1, "energie": -2 },
        "result": { "fr": "Ils sortent avant vous, devant les caméras, et racontent une réunion qui n'a pas eu lieu. Vous passez le jeudi à démentir un compte rendu au lieu de parler de la cantine.",
                    "en": "They come out before you, in front of the cameras, and describe a meeting that did not happen. You spend Thursday denying an account of it instead of talking about the canteen." } } }
  ]
},

{
  "id": "ep_nappe_seche",
  "weight": 4,
  "when": { "position": ["maire", "conseiller"], "season": ["ete"], "minTurn": 6 },
  "tag": { "fr": "Plus une goutte", "en": "Not a drop" },
  "text": {
    "fr": "La commune est en tension depuis onze jours : coupures de sept heures à midi, citernes sur la place, et une école qui ferme faute de sanitaires. À quatre kilomètres, le golf privé arrose ses dix-huit trous tous les matins, au titre d'une dérogation préfectorale accordée pour « préservation d'un patrimoine paysager ».",
    "en": "The town has been rationed for eleven days: cuts from seven in the morning until noon, water tankers on the square, and a school closed for want of working lavatories. Four kilometres away, the private golf course waters its eighteen holes every morning, under a prefectural exemption granted for the \"preservation of landscape heritage\"."
  },
  "choices": [
    { "label": { "fr": "Prendre un arrêté municipal et couper l'eau du golf", "en": "Issue a municipal order and cut the golf course off" },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.4, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "axis": { "economy": -55, "power": -40 }, "popularity": 12, "notoriete": 3,
                                "credibilite": 1, "standing": 4, "landscape": { "self": 0.8 } },
        "result": { "fr": "L'arrêté est illégal et vous le savez en le signant. Le tribunal administratif le suspendra en octobre, quand il pleuvra, et la photo des vannes fermées aura fait le tour du pays en juillet.",
                    "en": "The order is unlawful and you know it as you sign it. The administrative court will suspend it in October, when it rains, and the photograph of the closed valves will have gone round the country in July." } },
      "failure": { "effects": { "popularity": -5, "credibilite": -2, "reputation": -1, "energie": -2,
                                "money": -15000 },
        "result": { "fr": "Le préfet suspend l'arrêté en quarante-huit heures et la commune paie les frais de justice. On retient que vous avez fait un coup de communication qui n'a pas tenu deux jours.",
                    "en": "The prefect suspends the order within forty-eight hours and the town pays the legal costs. What people remember is a stunt that did not last two days." } } },
    { "label": { "fr": "Attaquer la dérogation devant le tribunal administratif", "en": "Challenge the exemption in the administrative court" },
      "effects": { "credibilite": 3, "reputation": 2, "money": -20000, "popularity": 2, "energie": -1,
                   "chain": "ep_nappe_jugement" },
      "result": { "fr": "Le recours est solide, argumenté, et il sera jugé dans quatorze mois. D'ici là le golf arrose, l'école reste fermée, et vous avez raison sur un calendrier qui n'est pas celui des gens.",
                  "en": "The challenge is solid, well argued, and will be heard in fourteen months. Until then the course is watered, the school stays shut, and you are right on a timetable that is not the one people live on." } },
    { "label": { "fr": "Louer des citernes et se taire sur le golf", "en": "Hire in tankers and say nothing about the golf" },
      "effects": { "money": -45000, "popularity": 4, "credibilite": 1, "reseau": 1, "standing": 2,
                   "energie": -2 },
      "result": { "fr": "Six citernes, un tour de garde des agents et de l'eau à tous les étages avant la fin de la semaine. Personne ne vous demandera pourquoi le golf est vert, et vous ne le direz pas.",
                  "en": "Six tankers, a rota of council staff and water on every floor before the end of the week. Nobody will ask you why the golf course is green, and you will not bring it up." } },
    { "label": { "fr": "Emmener la presse au bord du green, à sept heures", "en": "Take the press to the edge of the green, at seven in the morning" },
      "effects": { "axis": { "economy": -60 }, "popularity": 10, "notoriete": 3, "reseau": -2,
                   "reputation": 1, "standing": -4, "landscape": { "self": 0.6 } },
      "result": { "fr": "Les arroseurs se déclenchent à sept heures deux, en direct, pendant que vous expliquez les horaires de coupure. Le président du golf est un donateur de longue date de plusieurs campagnes, dont aucune n'est la vôtre, et cela se saura la semaine suivante.",
                  "en": "The sprinklers come on at two minutes past seven, live on air, while you are explaining the rationing hours. The chairman of the golf club is a long-standing donor to several campaigns, none of them yours, and that comes out the following week." } }
  ]
},

{
  "id": "ep_nappe_jugement",
  "weight": 0,
  "delay": [5, 8],
  "tag": { "fr": "Quatorze mois plus tard", "en": "Fourteen months later" },
  "text": {
    "fr": "Le tribunal administratif annule la dérogation préfectorale. Le jugement fait onze pages, il vous donne raison sur tout, et il tombe un mardi de février où il pleut depuis six jours.",
    "en": "The administrative court quashes the prefectural exemption. The judgment runs to eleven pages, it finds for you on every count, and it lands on a rainy Tuesday in February after six days of rain."
  },
  "choices": [
    { "label": { "fr": "En faire une conférence de presse", "en": "Hold a press conference about it" },
      "effects": { "popularity": 5, "credibilite": 2, "notoriete": 1, "energie": -1 },
      "result": { "fr": "Deux journalistes viennent, dont un stagiaire. La décision fera jurisprudence dans quatre départements et ne fera l'ouverture nulle part.",
                  "en": "Two journalists turn up, one of them an intern. The ruling will set a precedent in four departments and will lead nowhere." } },
    { "label": { "fr": "Le garder pour l'été prochain", "en": "Keep it for next summer" },
      "effects": { "sangfroid": 2, "credibilite": 1, "standing": 2 },
      "result": { "fr": "Vous rangez le jugement et vous attendez la première coupure de juillet pour le sortir. C'est du calcul, c'est efficace, et cela s'appelle savoir lire un calendrier.",
                  "en": "You file the judgment away and wait for July's first water cut to produce it. It is calculating, it works, and it is called knowing how to read a calendar." } }
  ]
},

{
  "id": "ep_entrepot_foret",
  "weight": 4,
  "cast": "camp_senior",
  "when": { "position": ["depute"], "minTurn": 12 },
  "tag": { "fr": "Le vote de jeudi", "en": "Thursday's vote" },
  "text": {
    "fr": "Un géant de la vente en ligne veut quatre-vingts hectares de la dernière forêt de votre circonscription pour un centre logistique, contre onze cents emplois dont quatre cents en intérim. Le vote est à bulletin secret. {rival} passe vous voir pour vous dire, sans le formuler, que le parti vote pour.",
    "en": "An online retail giant wants eighty hectares of the last woodland in your constituency for a logistics hub, in exchange for eleven hundred jobs, four hundred of them agency work. The vote is by secret ballot. {rival} drops by to tell you, without quite saying it, that the party is voting yes."
  },
  "choices": [
    { "label": { "fr": "Voter pour, et l'assumer sur le marché samedi", "en": "Vote yes, and defend it at the market on Saturday" },
      "effects": { "axis": { "economy": 60 }, "popularity": 5, "standing": 8, "reseau": 2,
                   "credibilite": 1, "landscape": { "self": 0.5 } },
      "result": { "fr": "Vous parlez d'emplois devant des gens qui en cherchent, et c'est l'argument le plus solide de toute cette histoire. La forêt sera coupée en mars, et l'entrepôt fermera dans onze ans, ce que personne ne dit à voix haute.",
                  "en": "You talk about jobs in front of people looking for one, and it is the strongest argument in the whole business. The woodland will be cleared in March and the hub will close in eleven years, which nobody says out loud." } },
    { "label": { "fr": "Voter contre, et le faire savoir", "en": "Vote no, and let it be known" },
      "effects": { "axis": { "economy": -55, "social": -35 }, "popularity": 9, "standing": -11,
                   "notoriete": 2, "reputation": 2, "landscape": { "self": -0.6 } },
      "result": { "fr": "Le vote est secret et vous êtes le seul à dire comment vous avez voté, ce qui revient à désigner les autres. Le groupe vous retire la commission des affaires économiques dans la semaine.",
                  "en": "The ballot is secret and you are the only one to say how you voted, which amounts to naming everyone else. The group takes the economic affairs committee off you within the week." } },
    { "label": { "fr": "Voter contre et laisser croire que vous avez voté pour", "en": "Vote no and let them believe you voted yes" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 },
                                                { "when": { "trait": ["teflon"] }, "value": 0.1 } ] },
      "success": { "effects": { "standing": 5, "sangfroid": 1, "reputation": -1, "reseau": 1 },
        "result": { "fr": "C'est exactement à ça que sert un scrutin secret, et tout le monde dans l'hémicycle le sait. Le parti vous remercie, les associations vous remercient, et vous rentrez chez vous avec les deux.",
                    "en": "This is exactly what a secret ballot is for, and everyone in the chamber knows it. The party thanks you, the campaigners thank you, and you go home with both." } },
      "failure": { "effects": { "standing": -13, "reputation": -2, "popularity": -6, "strike": "menteur" },
        "result": { "fr": "Le décompte par groupe ne colle pas et il ne manque qu'une voix. On la trouve en deux jours parce qu'on cherche toujours dans le bon sens, et vous avez menti aux deux camps le même jeudi.",
                    "en": "The tally by group does not add up and only one vote is missing. It is found in two days because people always look in the right place, and you have lied to both sides on the same Thursday." } } },
    { "label": { "fr": "Obtenir la forêt d'à côté en compensation, et voter pour", "en": "Get the neighbouring woodland protected in exchange, and vote yes" },
      "when": { "background": ["civil", "law", "business"] },
      "roll": { "base": 16, "stat": "reseau", "plus": { "credibilite": 0.4, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "standing": 6, "reputation": 1, "popularity": 4,
                                "reseau": 2, "energie": -2 },
        "result": { "fr": "Cent quarante hectares classés en échange de quatre-vingts détruits, signés avant le vote et non après, ce qui est la seule différence qui compte dans ce métier. Les deux camps trouvent que vous avez cédé.",
                    "en": "A hundred and forty hectares protected in exchange for eighty destroyed, signed before the vote and not after, which is the only difference that counts in this trade. Both sides think you gave way." } },
      "failure": { "effects": { "standing": -6, "credibilite": -2, "energie": -2, "popularity": -3 },
        "result": { "fr": "La compensation est annoncée, saluée, puis renvoyée à un décret qui ne sortira jamais. Vous avez voté pour en échange d'une phrase.",
                    "en": "The compensation is announced, welcomed, then left to a decree that will never be issued. You voted yes in exchange for a sentence." } } }
  ]
},

{
  "id": "ep_statue_neutralite",
  "weight": 3,
  "when": { "position": ["conseiller", "maire"], "minTurn": 6 },
  "tag": { "fr": "L'œuvre", "en": "The artwork" },
  "text": {
    "fr": "Deux cent mille euros de crédits d'investissement viennent d'être engagés pour une sculpture de six mètres intitulée « Neutralité carbone », installée sur la place centrale. Elle est en acier corten importé, elle a été livrée par camion, et le dossier de presse précise qu'elle interroge notre rapport au vivant.",
    "en": "Two hundred thousand euros of capital budget have just been committed to a six-metre sculpture entitled \"Carbon Neutrality\", installed on the main square. It is made of imported corten steel, it arrived by lorry, and the press pack explains that it questions our relationship with the living world."
  },
  "choices": [
    { "label": { "fr": "Le dire tout haut, avec le montant", "en": "Say it out loud, with the figure" },
      "effects": { "popularity": 9, "notoriete": 2, "standing": -9, "reputation": 1,
                   "appeal": { "self": -4 } },
      "result": { "fr": "Vous citez le montant, le tonnage d'acier et le nombre de places de crèche que cela représente. La séquence tourne, le maire ne vous adresse plus la parole, et la statue reste.",
                  "en": "You quote the figure, the tonnage of steel and the number of nursery places it represents. The clip goes round, the mayor stops speaking to you, and the statue stays." } },
    { "label": { "fr": "Défendre l'art dans la ville, sans rire", "en": "Defend art in the public realm, with a straight face" },
      "effects": { "standing": 7, "reseau": 2, "popularity": -6, "credibilite": -1 },
      "result": { "fr": "Vous parlez d'audace, de rayonnement et de fierté des habitants pendant quatre minutes trente. Deux adjoints vous trouvent solide, et une personne dans la salle demande le prix, ce à quoi vous répondez que ce n'est pas la question.",
                  "en": "You talk about boldness, standing and local pride for four and a half minutes. Two deputy mayors think you are sound, and one person in the room asks the price, to which you answer that this is not the question." } },
    { "label": { "fr": "Proposer de la revendre et de rendre l'argent", "en": "Propose selling it off and giving the money back" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "popularity": 7, "credibilite": 2, "standing": -4, "notoriete": 1 },
        "result": { "fr": "La délibération passe de deux voix. La sculpture part chez un promoteur pour le tiers de son prix et l'argent finance la réfection de deux préaux, ce qui ne fera l'objet d'aucun dossier de presse.",
                    "en": "The motion passes by two votes. The sculpture goes to a developer for a third of its price and the money pays to re-roof two school playgrounds, which will merit no press pack at all." } },
      "failure": { "effects": { "standing": -7, "popularity": -3, "credibilite": -1 },
        "result": { "fr": "On vous explique que revendre une œuvre publique serait un signal désastreux pour la politique culturelle de la ville. La phrase est prononcée sans ironie, devant la sculpture.",
                    "en": "You are told that selling off a public artwork would send a disastrous signal about the town's cultural policy. The sentence is delivered without irony, in front of the sculpture." } } },
    { "label": { "fr": "L'inaugurer vous-même, très sérieusement", "en": "Unveil it yourself, with total seriousness" },
      "when": { "personality": ["provocative", "clever"] },
      "effects": { "notoriete": 3, "popularity": 6, "standing": -5, "credibilite": -2, "reputation": -1 },
      "result": { "fr": "Vous lisez le dossier de presse mot pour mot, en entier, devant les habitants et une caméra. Le texte se démolit tout seul, personne ne peut vous reprocher une phrase, et la vidéo dépasse le million de vues avant dimanche.",
                  "en": "You read the press pack out word for word, in full, in front of residents and a camera. The text demolishes itself, nobody can hold a single sentence against you, and the video passes a million views before Sunday." } }
  ]
},

{
  "id": "ep_ville_la_plus_triste",
  "weight": 3,
  "when": { "position": ["maire"], "minTurn": 10 },
  "tag": { "fr": "Le palmarès", "en": "The ranking" },
  "text": {
    "fr": "Un hebdomadaire publie son palmarès du bien-être et classe votre commune dernière sur deux cent trente. La méthode tient en un encadré de huit lignes et mélange l'ensoleillement, le nombre de cinémas et le prix du mètre carré. Deux investisseurs ont annulé leur visite dans la matinée et le journal de vingt heures arrive jeudi.",
    "en": "A weekly magazine publishes its well-being ranking and places your town last out of two hundred and thirty. The methodology fits in an eight-line box and mixes hours of sunshine, the number of cinemas and the price per square metre. Two investors cancelled their visit this morning and the evening news is coming on Thursday."
  },
  "choices": [
    { "label": { "fr": "Démonter la méthode, point par point", "en": "Take the methodology apart, point by point" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "popularity": 5, "notoriete": 2, "reputation": 1 },
        "result": { "fr": "Vous montrez que trois des huit critères sont des données de deux mille dix-neuf et que le prix du mètre carré compte double. L'hebdomadaire publie un rectificatif de quatre lignes en page trente-deux et le classement reste.",
                    "en": "You show that three of the eight criteria are from twenty nineteen and that the price per square metre counts double. The magazine prints a four-line correction on page thirty-two and the ranking stands." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -2, "notoriete": 1 },
        "result": { "fr": "Vous passez onze minutes à contester un classement, ce qui est onze minutes de télévision nationale consacrées au fait que votre ville est la plus triste de France.",
                    "en": "You spend eleven minutes contesting a ranking, which is eleven minutes of national television devoted to the fact that your town is the saddest in the country." } } },
    { "label": { "fr": "Commander une campagne d'image", "en": "Commission an image campaign" },
      "when": { "minMoney": 100000 },
      "effects": { "money": -80000, "popularity": 4, "notoriete": 2, "reputation": -1, "credibilite": -1 },
      "result": { "fr": "Une agence, un slogan avec un jeu de mots sur le nom de la commune, et des photos de gens qui rient dans un marché repeint pour l'occasion. Le classement de l'année suivante vous fera remonter de six places, et l'agence enverra la coupure de presse à ses autres clients.",
                  "en": "An agency, a slogan built on a pun on the town's name, and photographs of people laughing in a market repainted for the occasion. Next year's ranking will move you up six places, and the agency will send the cutting to its other clients." } },
    { "label": { "fr": "Assumer, et en faire le nom de la ville", "en": "Own it, and make it the town's name" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "eloquence": 0.45 }, "dice": 16 },
      "success": { "effects": { "popularity": 11, "notoriete": 4, "standing": -3, "credibilite": -1,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "« La ville la plus triste de France, et on vous attend. » Le panneau est repeint le samedi, les tee-shirts sont en vente le lundi, et trois reportages viennent filmer des gens qui rient très fort pour prouver le contraire.",
                    "en": "\"The saddest town in France, and we are expecting you.\" The sign is repainted on the Saturday, the tee-shirts are on sale by the Monday, and three film crews come to record people laughing very loudly to prove the opposite." } },
      "failure": { "effects": { "popularity": -7, "standing": -6, "reputation": -1 },
        "result": { "fr": "L'autodérision tombe à plat devant des gens qui viennent de voir la valeur de leur maison baisser. On vous explique en réunion publique que ce n'est pas drôle, et l'on a raison.",
                    "en": "The self-mockery falls flat in front of people who have just watched the value of their house drop. You are told at a public meeting that it is not funny, and they are right." } } },
    { "label": { "fr": "Inviter la rédaction à passer trois jours sur place", "en": "Invite the newsroom to spend three days in town" },
      "effects": { "money": -12000, "reseau": 2, "credibilite": 2, "popularity": 3, "energie": -2 },
      "result": { "fr": "Trois jours, quatre repas et un article de six pages qui décrit une commune ordinaire, ni triste ni gaie, avec un hôpital fermé et un club de rugby qui tient tout le monde. C'est le meilleur papier écrit sur votre ville et il ne fera aucune différence.",
                  "en": "Three days, four meals and a six-page article describing an ordinary town, neither sad nor cheerful, with a closed hospital and a rugby club that holds the place together. It is the best piece ever written about your town and it will make no difference at all." } }
  ]
},

{
  "id": "ep_billets_bots",
  "weight": 3,
  "when": { "position": ["maire", "conseiller"], "minTurn": 8 },
  "tag": { "fr": "Douze secondes", "en": "Twelve seconds" },
  "text": {
    "fr": "Les six mille places du festival municipal, financé aux deux tiers par la ville, sont parties en douze secondes. Elles réapparaissent l'après-midi même sur deux plateformes de revente, entre quatre et cinq fois leur prix. Le service culturel explique qu'il n'a rien vu passer et que le prestataire était le moins-disant.",
    "en": "All six thousand tickets for the municipal festival, two thirds funded by the town, went in twelve seconds. They reappear the same afternoon on two resale platforms at four to five times face value. The culture department explains that it saw nothing and that the contractor was the cheapest bid."
  },
  "choices": [
    { "label": { "fr": "Tout annuler et refaire la billetterie au nom", "en": "Void everything and reissue named tickets" },
      "effects": { "popularity": 8, "credibilite": 2, "energie": -3, "money": -18000, "reseau": -1,
                   "standing": -2 },
      "result": { "fr": "Six mille remboursements, une billetterie nominative bricolée en neuf jours par deux agents et un stagiaire, et trois cents personnes qui hurlent parce qu'elles avaient acheté de bonne foi sur la revente. Le festival aura lieu et il sera plein de gens de la ville.",
                  "en": "Six thousand refunds, a named-ticket system cobbled together in nine days by two staff and an intern, and three hundred people howling because they had bought in good faith on the resale market. The festival will happen and it will be full of local people." } },
    { "label": { "fr": "Racheter des places sur la revente pour les jeunes de la ville", "en": "Buy tickets back off the resale sites for local young people" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -40000, "popularity": 6, "notoriete": 1, "credibilite": -3, "reputation": -1 },
      "result": { "fr": "La ville rachète quatre cents places à cinq fois le prix auquel elle les avait vendues, avec l'argent des mêmes habitants. La distribution se fait au centre social, en musique, et personne sur la photo ne sait combien elle a coûté.",
                  "en": "The town buys back four hundred tickets at five times the price it sold them for, with the same residents' money. They are handed out at the community centre, with music, and nobody in the photograph knows what it cost." } },
    { "label": { "fr": "Renvoyer la balle : c'est au législateur d'agir", "en": "Pass it upwards: this is for the legislator" },
      "effects": { "credibilite": 1, "energie": 1, "popularity": -5, "standing": 2 },
      "result": { "fr": "Vous écrivez au ministère et vous le faites savoir. La réponse arrive en janvier, elle rappelle la loi de deux mille douze, et la même chose se reproduira au festival suivant avec le même prestataire.",
                  "en": "You write to the ministry and let it be known. The answer comes in January, recalls the law of twenty twelve, and the same thing will happen at the next festival with the same contractor." } },
    { "label": { "fr": "Trouver qui a vendu les six mille places en douze secondes", "en": "Find out who sold six thousand tickets in twelve seconds" },
      "when": { "background": ["comms", "business", "law"] },
      "roll": { "base": 17, "stat": "reseau", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "popularity": 9, "notoriete": 2, "reputation": 2,
                                "standing": -3, "energie": -2 },
        "result": { "fr": "Le prestataire vendait un accès prioritaire à l'ouverture de la billetterie, ce que le marché public n'interdisait pas parce que personne n'avait pensé à l'écrire. Le contrat est résilié et la clause figure désormais dans tous les marchés culturels du département.",
                    "en": "The contractor was selling priority access at the moment the sale opened, which the public contract did not forbid because nobody had thought to write it down. The contract is terminated and the clause now appears in every cultural contract in the department." } },
      "failure": { "effects": { "energie": -2, "popularity": -3, "reseau": -1, "credibilite": -1 },
        "result": { "fr": "Trois semaines de courriers et de captures d'écran pour aboutir à une société immatriculée à Chypre. Le festival est passé, les places aussi, et vous avez appris ce qu'est un intermédiaire.",
                    "en": "Three weeks of letters and screenshots leading to a company registered in Cyprus. The festival is over, so are the tickets, and you have learned what a middleman is." } } }
  ]
},

{
  "id": "ep_ecrans_enfants",
  "weight": 4,
  "when": { "position": ["euro"], "minTurn": 10 },
  "tag": { "fr": "Le bannissement", "en": "The ban" },
  "text": {
    "fr": "Une étude de trois cohortes établit qu'un algorithme de recommandation très employé produit chez les moins de douze ans des troubles durables de l'attention et du langage. Les sociétés de pédiatrie réclament l'interdiction dans toute l'Union. L'entreprise fait savoir, poliment, qu'une interdiction entraînerait la fermeture de ses trois centres de données européens, dont un dans votre région, et quinze mille emplois avec.",
    "en": "A three-cohort study establishes that a widely used recommendation algorithm produces lasting attention and language disorders in the under-twelves. The paediatric societies are demanding a Union-wide ban. The company lets it be known, politely, that a ban would mean closing its three European data centres, one of them in your region, and fifteen thousand jobs with them."
  },
  "choices": [
    { "label": { "fr": "Porter l'interdiction, et la porter en votre nom", "en": "Carry the ban, and carry it in your own name" },
      "roll": { "base": 17, "stat": "credibilite", "plus": { "eloquence": 0.4, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "axis": { "power": -45, "economy": -40 }, "popularity": 12, "notoriete": 4,
                                "credibilite": 3, "reputation": 2, "landscape": { "self": 1.2 } },
        "result": { "fr": "Le texte passe en séance plénière avec cent quarante voix d'avance. L'entreprise ne ferme rien du tout, parce qu'elle ne l'avait jamais envisagé, et votre nom reste attaché à la première interdiction de ce genre.",
                    "en": "The text passes in plenary with a hundred and forty votes to spare. The company closes nothing at all, because it never intended to, and your name stays attached to the first ban of its kind." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -2, "energie": -3, "standing": -5,
                                "appeal": { "self": -4 } },
        "result": { "fr": "Le texte est vidé en commission par des amendements que personne ne revendique, puis reporté. Il reste de vous une tribune, deux auditions et une région qui a passé six mois à croire qu'elle allait perdre son centre de données.",
                    "en": "The text is gutted in committee by amendments nobody claims, then postponed. What remains of you is an op-ed, two hearings and a region that spent six months believing it was about to lose its data centre." } } },
    { "label": { "fr": "Négocier une vérification d'âge et un algorithme bridé", "en": "Negotiate age verification and a throttled algorithm" },
      "effects": { "credibilite": 3, "reseau": 3, "reputation": 1, "popularity": 3, "energie": -2,
                   "trait": "connexions_internationales" },
      "result": { "fr": "Dix-huit mois de trilogues pour un texte qui oblige à vérifier l'âge et à couper la recommandation automatique pour les comptes mineurs. L'entreprise se conforme en douze semaines, ce qui prouve qu'elle le pouvait depuis le début.",
                  "en": "Eighteen months of trilogues for a text requiring age checks and switching off automated recommendation for minors' accounts. The company complies within twelve weeks, which proves it could have done so all along." } },
    { "label": { "fr": "Défendre les quinze mille emplois de la région", "en": "Defend the region's fifteen thousand jobs" },
      "effects": { "axis": { "economy": 65 }, "popularity": 5, "standing": 6, "reseau": 2,
                   "credibilite": -2, "reputation": -1, "chain": "ep_ecrans_retour" },
      "result": { "fr": "Vous expliquez qu'on ne légifère pas sur une seule étude et qu'un territoire ne se sacrifie pas à un principe de précaution. Les deux phrases sont défendables et l'une d'elles vous a été fournie par écrit.",
                  "en": "You explain that you do not legislate on the strength of a single study and that a region is not sacrificed to a precautionary principle. Both sentences are defensible and one of them was supplied to you in writing." } },
    { "label": { "fr": "Demander une étude d'impact avant toute décision", "en": "Ask for an impact assessment before deciding anything" },
      "effects": { "credibilite": 1, "energie": 1, "standing": 3, "popularity": -4, "reputation": -1 },
      "result": { "fr": "L'étude est commandée, son cahier des charges est écrit par la direction générale compétente, et elle sera rendue dans vingt-deux mois. Les enfants concernés en auront quatorze.",
                  "en": "The assessment is commissioned, its terms of reference written by the relevant directorate-general, and it will be delivered in twenty-two months. The children concerned will be fourteen by then." } }
  ]
},

{
  "id": "ep_ecrans_retour",
  "weight": 0,
  "delay": [4, 7],
  "tag": { "fr": "Le centre de données", "en": "The data centre" },
  "text": {
    "fr": "L'entreprise annonce la fermeture de son centre de données de votre région. Le communiqué évoque une optimisation du maillage européen et ne mentionne ni l'étude, ni le vote, ni vous. Le préfet apprend la nouvelle par la presse.",
    "en": "The company announces the closure of the data centre in your region. The statement refers to an optimisation of its European footprint and mentions neither the study, nor the vote, nor you. The prefect learns of it from the press."
  },
  "choices": [
    { "label": { "fr": "Rappeler ce qu'ils avaient promis, avec les dates", "en": "Recall what they promised, with the dates" },
      "effects": { "popularity": 6, "credibilite": 2, "notoriete": 2, "reputation": 1, "standing": -2 },
      "result": { "fr": "Vous ressortez le courrier, le communiqué et la date de votre vote. On vous répond que le contexte a changé, ce qui est la formule par laquelle une entreprise annonce qu'elle n'a jamais rien promis.",
                  "en": "You produce the letter, the statement and the date of your vote. You are told that the context has changed, which is the phrase a company uses to announce that it never promised anything." } },
    { "label": { "fr": "Ne pas revenir dessus et travailler la reconversion", "en": "Let it go and work on redeployment" },
      "effects": { "reseau": 3, "credibilite": 2, "energie": -2, "standing": 3, "popularity": -2 },
      "result": { "fr": "Quatorze mois de réunions avec la région, l'État et deux repreneurs possibles. Un seul viendra, pour un tiers des emplois, et personne ne fera le lien avec le vote de l'an dernier.",
                  "en": "Fourteen months of meetings with the region, the state and two possible buyers. Only one will come, for a third of the jobs, and nobody will connect it to last year's vote." } }
  ]
},

{
  "id": "ep_fuite_chirurgie",
  "weight": 3,
  "cast": "camp_senior",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 16 },
  "tag": { "fr": "La fuite", "en": "The leak" },
  "text": {
    "fr": "Un collectif publie l'intégralité des remboursements passés par les parlementaires sur l'enveloppe de représentation. On y trouve des costumes, des coiffeurs, une piscine, et une colonne d'interventions esthétiques. {rival}, qui préside votre groupe, y figure pour des implants capillaires et pour un blanchiment anal facturé douze mille euros.",
    "en": "A collective publishes every expense claimed by members of parliament against the public representation allowance. It contains suits, hairdressers, a swimming pool, and a column of cosmetic procedures. {rival}, who chairs your group, appears in it for hair implants and for an anal bleaching billed at twelve thousand euros."
  },
  "choices": [
    { "label": { "fr": "Publier vos propres notes le jour même", "en": "Publish your own claims the same day" },
      "effects": { "reputation": 3, "credibilite": 2, "popularity": 9, "standing": -10,
                   "appeal": { "self": -4 }, "notoriete": 2 },
      "result": { "fr": "Quatre ans de notes en ligne à midi, avec les libellés d'origine et sans commentaire. Vos collègues comprennent avant le pays que vous venez de rendre le silence impossible, et deux d'entre eux publient les leurs le soir.",
                  "en": "Four years of expenses online by midday, with the original wordings and no commentary. Your colleagues understand before the country that you have just made silence impossible, and two of them publish theirs that evening." } },
    { "label": { "fr": "Invoquer la vie privée, et fermer le sujet", "en": "Invoke privacy, and close the subject" },
      "effects": { "standing": 9, "reseau": 2, "popularity": -8, "credibilite": -1, "reputation": -2 },
      "result": { "fr": "Vous parlez du secret médical et de la dignité des personnes devant six caméras, et vous n'avez pas tort une seule seconde. Le pays retient qu'on a payé douze mille euros et que vous avez trouvé une phrase pour l'expliquer.",
                  "en": "You talk about medical confidentiality and personal dignity in front of six cameras, and you are not wrong for a single second. What the country hears is that twelve thousand euros were paid and that you found a form of words for it." } },
    { "label": { "fr": "Demander sa démission de la présidence du groupe", "en": "Demand that {he} stand down as chair of the group" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "standing": 0.05, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "standing": 6, "credibilite": 2, "reputation": 1,
                                "appeal": { "self": -5 }, "landscape": { "self": 0.5 } },
        "result": { "fr": "{Il} part le vendredi, dans un communiqué qui parle de sérénité du groupe. Vous avez la place de {celui} que vous venez de faire tomber, ce que personne n'oubliera, et le groupe vous doit d'avoir arrêté l'hémorragie.",
                    "en": "{He} goes on the Friday, in a statement about the group's serenity. You have the job of the person you have just brought down, which nobody will forget, and the group owes you for having stopped the bleeding." } },
      "failure": { "effects": { "standing": -14, "reputation": -1, "popularity": -3, "strike": "traitre" },
        "result": { "fr": "{Il} reste, réélu{e} par vingt-neuf voix contre onze, dont les quatre qui vous avaient promis les leurs. Le mot carriériste est prononcé en réunion de groupe, sans qu'on vous regarde.",
                    "en": "{He} stays, re-elected twenty-nine votes to eleven, four of which had been promised to you. The word careerist is used in the group meeting, without anyone looking at you." } } },
    { "label": { "fr": "Proposer que l'enveloppe soit contrôlée et publiée", "en": "Propose that the allowance be audited and published" },
      "effects": { "axis": { "power": -50 }, "popularity": 10, "credibilite": 3, "standing": -12,
                   "reputation": 2, "chain": "position_impopulaire" },
      "result": { "fr": "Vous déposez la proposition le mardi, avec un contrôle annuel et une publication en ligne. Cinq cent soixante-dix-sept personnes découvrent le même jour qu'elles ont un adversaire de plus, et aucune d'elles n'est dans un autre parti que le vôtre ou le leur.",
                  "en": "You table the proposal on the Tuesday, with an annual audit and online publication. Five hundred and seventy-seven people discover on the same day that they have one more opponent, and none of them is in any party other than yours or theirs." } }
  ]
}
,

{
  "id": "ep_poulet_quartier",
  "weight": 3,
  "when": { "position": ["maire"] },
  "tag": { "fr": "Trois cent quarante signatures", "en": "Three hundred and forty signatures" },
  "text": {
    "fr": "Un franchisé de Mister Chicken a ouvert au rez-de-chaussée d'un immeuble de la rue des Peupliers sans avoir déposé la déclaration de changement de destination. Il a vingt-six ans, quatre salariés, une autorisation préfectorale pour la hotte et une fermeture à deux heures du matin. La pétition des riverains a recueilli trois cent quarante signatures et réclame la fermeture d'un commerce qui attirerait « un public qui n'est pas celui du quartier ». Le mot n'est précisé nulle part, deux chaînes d'information ont demandé si vous étiez disponible jeudi, et la commission de sécurité passe le mois prochain.",
    "en": "A Mister Chicken franchisee has opened on the ground floor of a block on Rue des Peupliers without filing the change-of-use declaration. He is twenty-six, has four employees, a prefectural permit for the extractor and a two-in-the-morning closing time. The residents' petition has gathered three hundred and forty signatures and demands the closure of a business said to attract \"a clientele that is not the neighbourhood's\". The word is spelled out nowhere, two news channels have asked whether you are free on Thursday, and the safety commission is due next month."
  },
  "choices": [
    { "label": { "fr": "En faire une affaire nationale", "en": "Make it a national story" },
      "when": { "stat": { "notoriete": { "min": 9 } } },
      "roll": { "base": 22, "stat": "charisme", "plus": { "sangfroid": 0.6, "notoriete": 0.25 }, "dice": 16 },
      "success": { "effects": { "notoriete": 4, "popularity": 10, "standing": 4, "credibilite": 1,
                                "energie": -2, "landscape": { "self": 0.6 } },
        "result": { "fr": "Vous tenez la séquence six jours. Un plateau, deux matinales, et la question du changement de destination posée à un ministre qui demande à son conseiller ce que c'est, micro ouvert. L'enseigne annonce un moratoire sur les ouvertures en pied d'immeuble, la rue des Peupliers n'est plus citée nulle part, et le franchisé apprend la nouvelle par la presse.",
                    "en": "You hold the news cycle for six days. A studio, two breakfast shows, and the change-of-use question put to a minister who asks his adviser what that is, with the microphone open. The chain announces a moratorium on ground-floor openings, Rue des Peupliers is no longer mentioned anywhere, and the franchisee learns the news from the press." } },
      "failure": { "effects": { "reputation": -2, "popularity": -8, "credibilite": -1, "standing": -3,
                                "energie": -2 },
        "result": { "fr": "On vous demande huit fois en onze minutes si un maire n'a pas mieux à faire qu'un restaurant de poulet. Le franchisé passe après vous, explique qu'il a mis ses économies dedans et qu'il embauche quatre personnes du quartier, et il le dit mieux que vous.",
                    "en": "You are asked eight times in eleven minutes whether a mayor has nothing better to do than a chicken shop. The franchisee is on after you, explains that he has put his savings into it and employs four people from the neighbourhood, and he says it better than you do." } },
      "triumph": { "effects": { "notoriete": 5, "popularity": 13, "standing": 5, "credibilite": 1,
                                "energie": -2, "landscape": { "self": 0.8 }, "trait": "bete_scene" },
        "result": { "fr": "Le moratoire devient une proposition de loi, déposée par un groupe qui n'est pas le vôtre et qui vous invite quand même. Trois rédactions ont désormais votre numéro pour tout ce qui touche au commerce de proximité, et l'une d'elles vous appelle un dimanche.",
                    "en": "The moratorium becomes a bill, tabled by a group that is not yours and which invites you anyway. Three newsrooms now have your number for anything touching local retail, and one of them calls you on a Sunday." } },
      "debacle": { "effects": { "reputation": -3, "notoriete": 2, "popularity": -11, "credibilite": -2,
                                "standing": -4, "energie": -2 },
        "result": { "fr": "Le montage de vos onze minutes tourne tout le week-end avec le mot mépris en surimpression. Vous êtes désormais connu bien au-delà de votre commune, ce qui est exactement ce que vous cherchiez, et pour une phrase que vous n'aviez pas préparée.",
                    "en": "The cut-down of your eleven minutes goes round all weekend with the word contempt captioned over it. You are now known well beyond your own town, which is exactly what you were after, and for a sentence you had not prepared." } } },

    { "label": { "fr": "Multiplier les contrôles jusqu'à ce qu'il renonce", "en": "Send in the inspectors until he gives up" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "reseau": 0.5 }, "dice": 16 },
      "success": { "effects": { "popularity": 5, "credibilite": 1, "reseau": 1, "standing": 3,
                                "reputation": -1, "energie": -1 },
        "result": { "fr": "Hygiène, accessibilité, affichage des allergènes, conformité de la hotte, occupation du trottoir. Cinq passages en dix-huit jours, tous réguliers, aucun coordonné sur le papier. Il vend le fonds en mars à un opticien, et vous n'avez jamais fait de déclaration publique sur ce dossier.",
                    "en": "Hygiene, accessibility, allergen labelling, extractor compliance, pavement use. Five visits in eighteen days, every one of them lawful, none of them coordinated on paper. He sells the lease in March to an optician, and you never made a public statement about the matter." } },
      "failure": { "effects": { "credibilite": -3, "popularity": -6, "reputation": -1, "standing": -2,
                                "energie": -2 },
        "result": { "fr": "Son avocat range les cinq avis dans le même mémoire et le tribunal administratif emploie les mots détournement de pouvoir. Le jugement fait quatre pages, dont trois décrivent le calendrier des passages, et un site local le met en ligne intégralement.",
                    "en": "His lawyer files all five notices in one submission and the administrative court uses the words abuse of power. The ruling runs to four pages, three of which set out the timetable of the visits, and a local site puts it online in full." } },
      "debacle": { "effects": { "credibilite": -4, "popularity": -9, "reputation": -2, "standing": -3,
                                "energie": -2, "strike": "casserole" },
        "result": { "fr": "Un agent des services techniques, muté depuis, raconte la réunion où l'on a réparti les contrôles. Il donne la date, l'heure et le nombre de personnes présentes, et il n'invente rien. Le dossier ressortira à chaque portrait qu'on écrira sur vous.",
                    "en": "A council technical officer, since transferred, describes the meeting where the visits were shared out. He gives the date, the time and the number of people in the room, and he invents nothing. The file will come back in every profile written about you." } } },

    { "label": { "fr": "Laisser le dossier suivre son cours", "en": "Let the file take its course" },
      "roll": { "base": 8, "stat": "sangfroid", "dice": 12 },
      "success": { "effects": { "sangfroid": 1, "energie": 1, "standing": 1, "credibilite": 1 },
        "result": { "fr": "Le franchisé régularise sa déclaration en six semaines, la commission de sécurité ne relève rien, et la pétition atteint trois cent soixante et une signatures avant de s'arrêter. Les chaînes n'ont pas rappelé.",
                    "en": "The franchisee regularises his declaration within six weeks, the safety commission finds nothing, and the petition reaches three hundred and sixty-one signatures before stopping. The channels never called back." } },
      "failure": { "effects": { "popularity": -3, "credibilite": -2, "standing": -2,
                                "appeal": { "conservatives": -8, "identitarians": -7 } },
        "result": { "fr": "Une rixe à une heure vingt devant le rideau baissé, deux blessés légers, et la vidéo tournée d'un balcon. Le collectif des riverains rappelle qu'il vous a écrit trois fois, produit les accusés de réception, et personne ne lui demande si le restaurant y était pour quelque chose.",
                    "en": "A brawl at twenty past one outside the shuttered front, two people lightly hurt, and the video filmed from a balcony. The residents' group points out that it wrote to you three times, produces the delivery receipts, and nobody asks whether the shop had anything to do with it." } } },

    { "label": { "fr": "Attaquer l'ouverture sur le changement de destination", "en": "Challenge the opening on the change of use" },
      "when": { "background": ["law"] },
      "roll": { "chance": 0.9,
                "chanceBonus": [ { "when": { "stat": { "credibilite": { "min": 12 } } }, "value": 0.05 } ] },
      "success": { "effects": { "money": -12000, "credibilite": 2, "reputation": 1, "popularity": 4,
                                "standing": 2 },
        "result": { "fr": "Le mémoire tient en neuf pages et il est imparable : le local était un cabinet dentaire, la déclaration n'a jamais été déposée, la commune est fondée à agir. Fermeture administrative en février, réouverture en avril avec le dossier complet et les mêmes horaires. Vous aviez raison sur toute la ligne et la rue des Peupliers a gagné deux mois.",
                    "en": "The submission runs to nine pages and is unanswerable: the premises were a dental surgery, the declaration was never filed, the town is entitled to act. Administrative closure in February, reopening in April with the paperwork complete and the same hours. You were right on every point and Rue des Peupliers has gained two months." } },
      "failure": { "effects": { "money": -12000, "credibilite": -1, "popularity": -3, "energie": -1 },
        "result": { "fr": "La déclaration avait été déposée, en retard et au mauvais guichet, mais déposée. Le tribunal vous le fait remarquer en trois lignes, et la commune règle les frais de la partie adverse.",
                    "en": "The declaration had been filed, late and at the wrong counter, but filed. The court points this out in three lines, and the town pays the other side's costs." } } },

    { "label": { "fr": "Le défendre publiquement : c'est un commerce qui embauche", "en": "Defend him publicly: it is a business that hires" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "axis": { "economy": -60, "social": -25 }, "popularity": 10, "notoriete": 2,
                                "standing": 2, "reputation": 1, "landscape": { "self": 0.5 } },
        "result": { "fr": "Vous rappelez qu'un menu à sept euros cinquante est la seule chose qui ait baissé dans le quartier depuis trois ans, et vous le rappelez devant la boutique, à midi. Le franchisé embauche un cinquième salarié en juin. Quatre signataires de la pétition retirent leur nom, et les autres ne vous parlent plus.",
                    "en": "You point out that a seven-fifty menu is the only thing in the neighbourhood that has come down in three years, and you point it out outside the shop, at midday. The franchisee takes on a fifth employee in June. Four signatories withdraw their names from the petition, and the rest stop speaking to you." } },
      "failure": { "effects": { "axis": { "economy": -50 }, "popularity": 3, "credibilite": -2,
                                "standing": -3, "reputation": -1 },
        "result": { "fr": "La phrase sur le pouvoir d'achat est juste et elle sort le jour où la vidéo de la rixe circule. On vous demande si vous avez lu la pétition, vous répondez que oui, et l'on vous demande alors si vous avez lu la phrase sur le public du quartier. Vous répondez que non.",
                    "en": "The line about purchasing power is right and it lands on the day the brawl video is going round. You are asked whether you have read the petition, you say yes, and are then asked whether you have read the line about the neighbourhood's clientele. You say no." } } },

    { "label": { "fr": "Réunir le franchisé et les riverains dans votre bureau", "en": "Get the franchisee and the residents into your office" },
      "roll": { "base": 18, "stat": "charisme", "plus": { "eloquence": 0.55 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "credibilite": 3, "reseau": 1, "standing": 2,
                                "reputation": 1, "energie": -1 },
        "result": { "fr": "Deux heures dix, onze personnes, et une sortie à minuit trente au lieu de deux heures, un sas contre le bruit, un agent de sécurité le vendredi et le samedi. Le protocole tient en une page, tout le monde le signe, et personne ne s'en vante.",
                    "en": "Two hours ten, eleven people, and a half-past-midnight closing time instead of two, a sound lobby, a door supervisor on Fridays and Saturdays. The agreement fits on one page, everybody signs it, and nobody boasts about it." } },
      "failure": { "effects": { "popularity": -5, "credibilite": -1, "standing": -2, "energie": -2 },
        "result": { "fr": "La réunion s'arrête à la quarantième minute, quand un riverain reprend la phrase de la pétition et la précise enfin. Le franchisé sort, deux personnes le suivent pour s'excuser, et la mairie n'a plus rien à proposer à personne.",
                    "en": "The meeting stops at the fortieth minute, when a resident repeats the line from the petition and finally spells it out. The franchisee walks out, two people follow him to apologise, and the town hall has nothing left to offer anybody." } } }
  ]
}
];
