/* Généré — ne pas éditer à la main. */
const EV_nomination = [

/* ==========================================================================
   QUAND L'APPAREIL REFUSE DE VOUS INVESTIR
   ==========================================================================
   Ces cartes remplacent le bouton unique « travailler l'appareil », qui
   transformait un moment de carrière en formalité. Elles ne se tirent que
   lorsque la cote au parti est trop basse pour concourir, et elles rapportent
   toutes de la cote, mais jamais de la même façon ni au même prix.
   ========================================================================== */

{
  "id": "investiture_barons",
  "election": ["municipales", "legislatives", "europeennes"],
  "weight": 4,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "La commission a tranché sans vous. Restent les quatre secrétaires de fédération qui font et défont les listes, et qui dînent tous les mois au même endroit.",
    "en": "The committee decided without you. What remains are the four federation secretaries who make and unmake the lists, and who dine at the same place every month."
  },
  "choices": [
    { "label": { "fr": "S'inviter à leur dîner mensuel", "en": "Invite yourself to their monthly dinner" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reseau": 0.5 }, "dice": 16 },
      "success": { "effects": { "appeal": { "self": -3 }, "standing": 4, "reseau": 1, "energie": -1 },
        "result": { "fr": "Trois heures à écouter des histoires de 1997 et à rire au bon moment. En repartant, l'un d'eux vous appelle par votre prénom.",
                    "en": "Three hours listening to stories from 1997 and laughing in the right places. On the way out, one of them uses your first name." } },
      "failure": { "effects": { "standing": -3, "energie": -1, "reputation": -1 },
        "result": { "fr": "On vous place en bout de table, on parle devant vous comme si vous n'y étiez pas, et l'addition est partagée en cinq.",
                    "en": "You are seated at the end of the table, they talk across you as if you were not there, and the bill is split five ways." } } },
    { "label": { "fr": "Financer la fédération sur vos deniers", "en": "Fund the federation out of your own pocket" },
      "when": { "minMoney": 60000 },
      "roll": { "chance": 0.62, "chanceBonus": [ { "when": { "stat": { "reseau": { "min": 12 } } }, "value": 0.15 },
                                                 { "when": { "minStanding": 55 }, "value": 0.12 } ] },
      "success": { "effects": { "money": -40000, "appeal": { "self": -3 }, "standing": 5, "reputation": -1 },
        "result": { "fr": "Un local repeint, deux permanents payés six mois, un car pour le congrès. Personne ne dira jamais que la place s'achète, et tout le monde saura ce qu'elle a coûté.",
                    "en": "A repainted office, two staffers paid for six months, a coach to the party conference. Nobody will ever say the seat was bought, and everyone will know what it cost." } },
      "failure": { "effects": { "money": -40000, "appeal": { "self": -3 }, "standing": -4, "reputation": -2 },
        "result": { "fr": "Le local est repeint et la fédération vote pour quelqu'un d'autre. On vous remercie chaleureusement, deux fois, et le mot achat circule dès le lendemain.",
                    "en": "The office is repainted and the federation votes for somebody else. You are warmly thanked, twice, and the word bought is going round by the next morning." } } },
    { "label": { "fr": "Faire le travail que personne ne veut faire", "en": "Do the work nobody wants to do" },
      "effects": { "strike": "appareil", "standing": 3, "energie": -3, "reseau": 1, "appeal": { "self": -1 } },
      "result": { "fr": "Six mois de commissions statutaires, de comptes rendus et de conflits de fédération. C'est long, c'est gris, et ça marche toujours.",
                  "en": "Six months of rules committees, minutes and branch disputes. It is long, it is grey, and it always works." } },
    { "label": { "fr": "Les menacer de partir", "en": "Threaten to leave" },
      "when": { "minPopularity": 63 },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "popularity": 0.07 }, "dice": 16 },
      "success": { "effects": { "appeal": { "self": -3 }, "standing": 6, "notoriete": 1, "reputation": -1 },
        "result": { "fr": "Vous laissez entendre qu'ailleurs on vous attend. Ils vérifient, c'est vrai, et la commission se réunit de nouveau la semaine suivante.",
                    "en": "You let it be understood that others are waiting for you. They check, it is true, and the committee meets again the following week." } },
      "failure": { "effects": { "standing": -10, "strike": "traitre" },
        "result": { "fr": "Ils vous répondent d'y aller. Vous restez, et la phrase circule dans toutes les fédérations avant la fin du mois.",
                    "en": "They tell you to go ahead. You stay, and the line goes round every branch before the month is out." } } }
  ]
},

{
  "id": "investiture_concurrent",
  "weight": 4,
  "cast": "camp_senior",
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "L'investiture vous passe sous le nez. Elle va à {rival}, qui n'a rien de plus que vous sinon d'avoir commencé plus tôt à la demander.",
    "en": "The nomination goes past you. It goes to {rival}, who has nothing more than you except having started asking for it earlier."
  },
  "choices": [
    { "label": { "fr": "{Le} soutenir bruyamment", "en": "Back {him} loudly" },
      "effects": { "standing": 4, "reputation": 1, "appeal": { "self": -3 } },
      "result": { "fr": "Vous faites campagne pour {lui}, vous tenez trois réunions à sa place et vous êtes sur toutes les photos. La prochaine fois, ce sera difficile de vous refuser.",
                  "en": "You campaign for {him}, you hold three meetings in {his} place and you are in every photograph. Next time it will be hard to refuse you." } },
    { "label": { "fr": "Faire savoir ce qu'{il} vaut vraiment", "en": "Let people know what {he} is really worth" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "appeal": { "self": -3 }, "standing": 3, "reputation": -2, "landscape": { "self": -0.5 } },
        "result": { "fr": "Deux ou trois conversations dans les bons bureaux, jamais un mot par écrit. Sa candidature s'effrite toute seule et personne ne sait pourquoi.",
                    "en": "Two or three conversations in the right offices, never a word in writing. {His} candidacy crumbles on its own and nobody knows why." } },
      "failure": { "effects": { "standing": -12, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "L'une de vos conversations lui revient mot pour mot. {Il} ne dit rien, {il} attend, et {il} aura toute une carrière pour s'en souvenir.",
                    "en": "One of your conversations gets back to {him} word for word. {He} says nothing, {he} waits, and {he} will have a whole career to remember it." } } },
    { "label": { "fr": "Aller voir ailleurs pendant qu'{il} fait campagne", "en": "Look elsewhere while {he} campaigns" },
      "effects": { "standing": 2, "reseau": 2, "energie": -1, "appeal": { "self": 2 } },
      "result": { "fr": "Vous passez la campagne dans deux autres fédérations, où l'on ne vous doit rien et où l'on vous découvre. {Il} gagne, et vous aussi, ailleurs.",
                  "en": "You spend the campaign in two other federations, where nobody owes you anything and where people discover you. {He} wins, and so do you, elsewhere." } }
  ]
},

{
  "id": "investiture_militants",
  "weight": 4,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "La direction ne veut pas de vous, mais ce sont les adhérents qui votent, et il y en a onze mille dont personne ne s'occupe jamais entre deux congrès.",
    "en": "The leadership does not want you, but it is the members who vote, and there are eleven thousand of them nobody ever bothers with between conferences."
  },
  "choices": [
    { "label": { "fr": "Faire le tour des sections, une par une", "en": "Tour the branches, one by one" },
      "effects": { "strike": "appareil", "standing": 4, "energie": -3, "reseau": 2, "appeal": { "self": -2 } },
      "result": { "fr": "Quarante et une sections en cinq mois, des salles de quinze personnes et beaucoup de café tiède. Vous connaissez le parti mieux que ceux qui le dirigent.",
                  "en": "Forty-one branches in five months, rooms of fifteen people and a great deal of lukewarm coffee. You know the party better than the people running it." } },
    { "label": { "fr": "Monter une plateforme et récolter des signatures", "en": "Set up a platform and collect signatures" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "reseau": 0.4, "energie": 0.3 }, "dice": 16 },
      "success": { "effects": { "appeal": { "self": -3 }, "standing": 5, "notoriete": 1, "reputation": 1 },
        "result": { "fr": "Un texte de deux pages, six cents signatures en trois semaines et un titre dans la presse militante. La direction découvre qu'elle a un problème interne.",
                    "en": "A two-page text, six hundred signatures in three weeks and a headline in the party press. The leadership discovers it has an internal problem." } },
      "failure": { "effects": { "standing": -6, "energie": -2 },
        "result": { "fr": "Cent quatre signatures, dont onze de gens qui ne sont plus à jour de cotisation. Le texte ne sort jamais du site.",
                    "en": "One hundred and four signatures, eleven of them from people who have not paid their dues. The text never leaves the website." } } },
    { "label": { "fr": "Attendre le prochain congrès", "en": "Wait for the next conference" },
      "effects": { "energie": 2, "appeal": { "self": -3 }, "standing": 2, "sangfroid": 1, "strike": "lache" },
      "result": { "fr": "Vous ne faites rien du tout et vous vous en tirez avec une année de repos. Personne ne vous en veut, ce qui est bien le problème.",
                  "en": "You do nothing at all and come away with a year of rest. Nobody holds it against you, which is precisely the problem." } }
  ]
},

{
  "id": "investiture_dette",
  "weight": 3,
  "cast": "camp_senior",
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "{rival} vous propose un arrangement : {il} fait pencher la commission en votre faveur, et vous lui devez une voix au moment où {il} en aura besoin. {Il} ne précise pas laquelle.",
    "en": "{rival} offers you an arrangement: {he} tips the committee your way, and you owe {him} a vote when {he} needs one. {He} does not say which."
  },
  "choices": [
    { "label": { "fr": "Accepter la dette", "en": "Take on the debt" },
      "effects": { "appeal": { "self": -3 }, "standing": 6, "reseau": 1, "reputation": -1, "chain": "mentor_dette" },
      "result": { "fr": "La commission se réunit de nouveau et votre nom passe sans discussion. Vous ne savez pas encore ce que vous venez de vendre.",
                  "en": "The committee meets again and your name goes through without discussion. You do not yet know what you have just sold." } },
    { "label": { "fr": "Refuser, et le dire en face", "en": "Refuse, and say so to {his} face" },
      "effects": { "reputation": 3, "standing": -3, "sangfroid": 1, "strike": "intrepide" },
      "result": { "fr": "Vous lui répondez que vous préférez perdre. {Il} hausse les épaules et vous respecte un peu plus, ce qui ne vaut aucune investiture.",
                  "en": "You tell {him} you would rather lose. {He} shrugs and respects you slightly more, which is worth no nomination at all." } },
    { "label": { "fr": "Accepter, et enregistrer la conversation", "en": "Accept, and record the conversation" },
      "when": { "personality": ["calculating"] },
      "effects": { "appeal": { "self": -3 }, "standing": 5, "reseau": 1, "reputation": -2, "sangfroid": 1 },
      "result": { "fr": "Vous acceptez, et vous gardez trois minutes de son offre dans un téléphone que vous ne changerez jamais. La dette existe des deux côtés maintenant.",
                  "en": "You accept, and you keep three minutes of {his} offer on a phone you will never replace. The debt runs both ways now." } }
  ]
}
,

{
  "id": "investiture_parachute",
  "election": ["municipales", "legislatives", "europeennes"],
  "weight": 4,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "L'investiture est donnée à quelqu'un que personne n'a jamais vu ici, envoyé par le siège pour « incarner le renouvellement ». La fédération est furieuse, et la fédération, c'est vous qui la connaissez.",
    "en": "The nomination goes to somebody nobody here has ever seen, sent down from headquarters to “embody renewal”. The federation is furious, and you are the one who knows the federation."
  },
  "choices": [
    { "label": { "fr": "Organiser la fronde des militants locaux", "en": "Organise the local revolt" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "notoriete": 1, "appeal": { "self": 3 }, "energie": -2 },
        "result": { "fr": "Deux cents signatures en dix jours et un article dans le quotidien régional. Le siège retire discrètement sa candidature et ne vous en reparlera jamais.",
                    "en": "Two hundred signatures in ten days and a piece in the regional paper. Headquarters quietly withdraws the candidacy and never mentions it again." } },
      "failure": { "effects": { "standing": -8, "reputation": -1, "energie": -2 },
        "result": { "fr": "Le siège tient bon et retient les noms. Vous avez appris qui vous suit vraiment : onze personnes, dont deux qui ne voteront pas.",
                    "en": "Headquarters holds firm and takes down names. You have learned who really follows you: eleven people, two of whom will not vote." } } },
    { "label": { "fr": "Servir de guide au parachuté", "en": "Show the newcomer around" },
      "effects": { "standing": 5, "reseau": 2, "reputation": -1, "energie": -1 },
      "result": { "fr": "Trois semaines de marchés et de salles des fêtes, et une reconnaissance qui vaudra ce qu'elle vaudra. Au siège, on note que vous êtes utile.",
                  "en": "Three weeks of markets and village halls, and a gratitude worth whatever it turns out to be worth. At headquarters, they note that you are useful." } },
    { "label": { "fr": "Ne rien faire et laisser le terrain trancher", "en": "Do nothing and let the ground decide" },
      "effects": { "standing": -2, "reputation": 1, "energie": 1 },
      "result": { "fr": "Vous ne dites rien pendant toute la campagne. Le résultat est mauvais, et tout le monde se souvient que vous n'aviez rien promis.",
                  "en": "You say nothing for the whole campaign. The result is poor, and everyone remembers you promised nothing." } }
  ]
},

{
  "id": "investiture_sondage",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "On vous écarte au nom d'une étude d'opinion commandée par la direction. Vous n'avez jamais vu l'étude, et l'institut qui l'a réalisée travaille pour le parti depuis douze ans.",
    "en": "They set you aside in the name of an opinion study commissioned by the leadership. You have never seen the study, and the polling firm that produced it has worked for the party for twelve years."
  },
  "choices": [
    { "label": { "fr": "Exiger de voir les chiffres", "en": "Demand to see the numbers" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.35 }, "dice": 15 },
      "success": { "effects": { "standing": 5, "reputation": 1, "sangfroid": 1 },
        "result": { "fr": "L'étude porte sur trois cent douze personnes et ne vous mentionne pas une fois. On vous promet de « réexaminer le dossier », ce qui, dans cette maison, est un aveu.",
                    "en": "The study covers three hundred and twelve people and never mentions you once. They promise to “revisit the file”, which in this house is a confession." } },
      "failure": { "effects": { "standing": -6, "appeal": { "self": -2 }, "reputation": -1 },
        "result": { "fr": "On vous lit trois lignes au téléphone et on raccroche. Vous passez pour quelqu'un qui conteste les chiffres, ce qui est pire que d'être mauvais dedans.",
                    "en": "They read you three lines over the phone and hang up. You now look like someone who disputes numbers, which is worse than polling badly in them." } } },
    { "label": { "fr": "Payer votre propre sondage", "en": "Pay for your own poll" },
      "when": { "minMoney": 45000 },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "comms": 2 }, "value": 0.16 },
                                                 { "when": { "background": ["journalism", "comms"] }, "value": 0.12 } ] },
      "success": { "effects": { "money": -35000, "standing": 4, "notoriete": 1, "appeal": { "self": 2 } },
        "result": { "fr": "Vos chiffres sont meilleurs que les leurs, ce qui n'étonne personne puisque c'est vous qui avez écrit les questions. Ils circulent quand même.",
                    "en": "Your numbers are better than theirs, which surprises nobody since you wrote the questions. They circulate all the same." } },
      "failure": { "effects": { "money": -35000, "standing": -3, "reputation": -1 },
        "result": { "fr": "L'institut publie la commande en même temps que les chiffres, comme il le doit. Personne ne discute vos résultats : on discute votre facture.",
                    "en": "The polling firm publishes the commission alongside the numbers, as it must. Nobody argues with your results: they argue with your invoice." } } },
    { "label": { "fr": "Accepter le verdict et travailler la notoriété", "en": "Accept the verdict and work on your name" },
      "effects": { "notoriete": 1, "appeal": { "self": 3 }, "standing": -1, "energie": -1 },
      "result": { "fr": "Six mois de radios locales et de fêtes de village. Au sondage suivant, on ne pourra plus écrire que personne ne vous connaît.",
                  "en": "Six months of local radio and village fairs. At the next poll, nobody will be able to write that nobody knows you." } }
  ]
},

{
  "id": "investiture_quota",
  "election": ["municipales", "legislatives", "europeennes"],
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "La liste doit être équilibrée, et l'équilibre se fait toujours sur les places où l'on ne gagne pas. On vous propose la quatrième position dans une circonscription que le parti n'a jamais remportée.",
    "en": "The list has to be balanced, and balance is always struck in the places nobody wins. They offer you fourth position in a seat the party has never taken."
  },
  "choices": [
    { "label": { "fr": "Accepter la circonscription perdue d'avance", "en": "Take the unwinnable seat" },
      "effects": { "standing": 4, "notoriete": 1, "appeal": { "self": 2 }, "energie": -2, "reputation": 1 },
      "result": { "fr": "Vous perdez de vingt points, ce qui était prévu, et vous en reprenez six, ce qui ne l'était pas. On s'en souviendra la prochaine fois.",
                  "en": "You lose by twenty points, which was expected, and claw back six, which was not. That will be remembered next time." } },
    { "label": { "fr": "Refuser et le faire savoir", "en": "Refuse it, and let it be known" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 3, "notoriete": 2, "appeal": { "self": 4 }, "reputation": 1 },
        "result": { "fr": "Votre refus fait une demi-page. La direction découvre que vous écarter coûte plus cher que vous investir.",
                    "en": "Your refusal fills half a page. The leadership discovers that setting you aside costs more than nominating you." } },
      "failure": { "effects": { "standing": -9, "appeal": { "self": -3 }, "reputation": -1 },
        "result": { "fr": "Personne ne reprend l'information et la place est pourvue le lendemain. Vous avez refusé la seule chose qu'on vous proposait.",
                    "en": "Nobody picks the story up and the slot is filled the next day. You turned down the only thing on offer." } } },
    { "label": { "fr": "Négocier autre chose contre votre retrait", "en": "Trade your withdrawal for something else" },
      "effects": { "standing": 5, "reseau": 1, "reputation": -1 },
      "result": { "fr": "Vous vous retirez proprement, contre une place au bureau national dont personne ne connaît les attributions. Vous les découvrirez, elles sont réelles.",
                  "en": "You withdraw cleanly, in exchange for a seat on the national board whose remit nobody can define. You will find out; it is real." } }
  ]
},

{
  "id": "investiture_courant",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Votre dossier est bon, et il est mort en commission parce que vous n'appartenez à aucun des trois courants qui se partagent le parti. Les trois vous l'ont dit gentiment, séparément, le même jour."
    ,
    "en": "Your file is good, and it died in committee because you belong to none of the three factions that share the party. All three told you so kindly, separately, on the same day."
  },
  "choices": [
    { "label": { "fr": "Rejoindre le courant le mieux placé", "en": "Join the strongest faction" },
      "effects": { "standing": 6, "reseau": 1, "reputation": -2, "appeal": { "self": -2 } },
      "result": { "fr": "Vous signez leur texte sans en avoir relu le troisième paragraphe. Vous êtes désormais de quelque part, ce qui vaut mieux que d'avoir raison.",
                  "en": "You sign their motion without rereading the third paragraph. You are from somewhere now, which is worth more than being right." } },
    { "label": { "fr": "Monter votre propre courant", "en": "Start a faction of your own" },
      "roll": { "base": 17, "stat": "charisme", "plus": { "eloquence": 0.4, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "notoriete": 1, "energie": -2, "reseau": 2 },
        "result": { "fr": "Onze élus signent, dont deux qui comptent. Les trois courants deviennent quatre, et l'on vient désormais vous demander votre avis avant les commissions.",
                    "en": "Eleven elected members sign, two of whom matter. Three factions become four, and people now ask your view before committees meet." } },
      "failure": { "effects": { "standing": -7, "energie": -2, "reputation": -1 },
        "result": { "fr": "Quatre signatures, dont la vôtre. Le texte circule une semaine et sert surtout à montrer qui ne vous suit pas.",
                    "en": "Four signatures, including your own. The motion circulates for a week and mostly serves to show who is not with you." } } },
    { "label": { "fr": "Rester sans étiquette et attendre l'arbitrage", "en": "Stay unaligned and wait to be the compromise" },
      "effects": { "standing": 2, "reputation": 2, "energie": 1 },
      "result": { "fr": "Vous ne devez rien à personne, ce qui ne sert à rien tant que les trois s'entendent. Ils ne s'entendront pas toujours.",
                  "en": "You owe nobody anything, which is useless for as long as the three agree. They will not always agree." } }
  ]
},

{
  "id": "investiture_attente",
  "weight": 3,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Troisième commission, troisième « pas encore ». On ne vous reproche rien, on ne vous promet rien, et l'on vous répète que votre tour viendra sans jamais dire quand.",
    "en": "Third committee, third “not yet”. Nothing is held against you, nothing is promised to you, and you are told your turn will come without anyone saying when."
  },
  "choices": [
    { "label": { "fr": "Prendre les dossiers dont personne ne veut", "en": "Take the files nobody wants" },
      "effects": { "standing": 4, "energie": -2, "eloquence": 1 },
      "result": { "fr": "Le rapport sur les normes comptables des syndicats intercommunaux vous prend quatre mois. Personne ne le lira, tout le monde saura que vous l'avez fait.",
                  "en": "The report on the accounting rules of inter-municipal boards takes you four months. Nobody will read it; everyone will know you wrote it." } },
    { "label": { "fr": "Poser un ultimatum à la direction", "en": "Give the leadership an ultimatum" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "standing": 0.06 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "sangfroid": 1, "reputation": 1 },
        "result": { "fr": "Vous dites que c'est la dernière fois que vous le demandez. Le silence dans la pièce vous apprend que quelqu'un vous a enfin pris au sérieux.",
                    "en": "You say this is the last time you will ask. The silence in the room tells you somebody has finally taken you seriously." } },
      "failure": { "effects": { "standing": -10, "reputation": -1, "appeal": { "self": -2 } },
        "result": { "fr": "On vous répond « comme vous voudrez » et l'on passe au point suivant de l'ordre du jour. C'était votre dernière carte et elle ne valait rien.",
                    "en": "They answer “as you wish” and move to the next item on the agenda. That was your last card and it was worth nothing." } } },
    { "label": { "fr": "Se faire élire à un poste interne sans intérêt", "en": "Get yourself elected to a dull internal post" },
      "effects": { "standing": 3, "reseau": 1, "energie": -1, "appeal": { "self": -1 } },
      "result": { "fr": "Secrétaire à la vie fédérale. Le titre fait sourire et donne accès à la liste complète des adhérents, avec les numéros de téléphone.",
                  "en": "Secretary for federation affairs. The title raises smiles and gives you the full membership list, phone numbers included." } }
  ]
},

{
  "id": "investiture_routine",
  "election": ["municipales", "legislatives", "europeennes"],
  "weight": 3,
  "repeatable": true,
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Encore une commission d'investiture où votre nom n'a servi qu'à équilibrer une liste. Il reste six mois avant la suivante, et l'appareil ne se travaille pas autrement qu'à l'usure.",
    "en": "Another nominations committee where your name only served to balance a list. There are six months until the next one, and the machine is worked by attrition or not at all."
  },
  "choices": [
    { "label": { "fr": "Reprendre les réunions de section", "en": "Go back to the branch meetings" },
      "effects": { "standing": 5, "appeal": { "self": -2 }, "energie": -1 },
      "result": { "fr": "Des mardis soir dans des salles trop grandes, à écouter des motions sur le règlement intérieur. C'est ainsi qu'on se fait un nom là où il compte.",
                  "en": "Tuesday evenings in rooms that are too big, listening to motions about standing orders. That is how you make a name where it counts." } },
    { "label": { "fr": "Rendre service à ceux qui décident", "en": "Do favours for the people who decide" },
      "effects": { "standing": 6, "appeal": { "self": -3 }, "reseau": 1, "reputation": -1 },
      "result": { "fr": "Un rapport rédigé pour quelqu'un d'autre, une intervention annulée pour lui laisser la place, un vote qui ne vous coûtait rien. On note.",
                  "en": "A report written for somebody else, a speech cancelled to leave him the floor, a vote that cost you nothing. It gets noticed." } },
    { "label": { "fr": "Soigner le terrain plutôt que l'appareil", "en": "Work the ground instead of the machine" },
      "effects": { "popularity": 6, "standing": -2, "energie": -1 },
      "result": { "fr": "Vous laissez la commission à ceux qui l'aiment et vous passez six mois dehors. La direction ne vous investira pas plus, et les électeurs vous connaîtront mieux.",
                  "en": "You leave the committee to the people who enjoy it and spend six months outside. The leadership will not nominate you any sooner, and the voters will know you better." } }
  ]
}
,

/* ==========================================================================
   CE QU'ON REFUSE N'EST PAS TOUJOURS UNE CIRCONSCRIPTION
   --------------------------------------------------------------------------
   Les scènes ci-dessus parlent de listes, de commissions et de fédérations :
   elles valent pour un siège. Se voir refuser la DIRECTION DU PARTI ou
   L'INVESTITURE PRÉSIDENTIELLE n'a rien à voir, et le paquet ne le disait
   nulle part. On ne parachute pas un chef de parti, il n'y a pas de quatrième
   place sur une liste quand il n'y a qu'un poste, et à six mois d'une
   présidentielle le mot qu'on emploie n'est pas « commission », c'est
   « rassemblement ».

   Ces quatre scènes portent donc leur scrutin en propre.
   ========================================================================== */

{
  "id": "investiture_signatures",
  "election": ["congres"],
  "weight": 5,
  "tag": { "fr": "Direction refusée", "en": "Leadership denied" },
  "text": {
    "fr": "Pour déposer une motion au congrès, il faut les signatures d'un dixième des secrétaires de fédération. Vous en avez les deux tiers, et les autres attendent de savoir qui va gagner avant de dire qui ils soutiennent.",
    "en": "To table a motion at the congress you need the signatures of a tenth of the federation secretaries. You have two thirds of them, and the rest are waiting to know who will win before saying who they back."
  },
  "choices": [
    { "label": { "fr": "Aller les chercher une par une, en province", "en": "Go and get them one by one, in the provinces" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "energie": 0.4, "charisme": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "reseau": 2, "energie": -3, "appeal": { "self": -2 } },
        "result": { "fr": "Onze départements en trois semaines, et la motion est déposée avec quatre signatures d'avance. Aucune ne vous a été donnée : elles ont toutes été cherchées, et cela se saura.",
                    "en": "Eleven departments in three weeks, and the motion is tabled with four signatures to spare. Not one was given: every one was fetched, and that will get around." } },
      "failure": { "effects": { "standing": -6, "energie": -3, "credibilite": -1 },
        "result": { "fr": "Deux se dérobent au téléphone, un troisième signe la motion d'en face pendant que vous roulez vers lui. Vous rentrez avec une motion morte et une note de péage.",
                    "en": "Two dodge you on the phone, a third signs the rival motion while you are driving to see him. You come home with a dead motion and a toll receipt." } } },

    { "label": { "fr": "Échanger vos signatures contre une place dans la future direction", "en": "Trade your signatures for a seat in the next leadership" },
      "effects": { "standing": 5, "reseau": 2, "credibilite": -1, "appeal": { "self": -2 }, "reputation": -1 },
      "result": { "fr": "Vous retirez votre motion et vous entrez au bureau national. C'est exactement ce qu'on attendait de vous, et c'est exactement pour cela que personne ne vous craindra au congrès suivant.",
                  "en": "You withdraw your motion and join the national executive. It is exactly what was expected of you, and exactly why nobody will fear you at the next congress." } },

    { "label": { "fr": "Déposer quand même, sans le compte", "en": "Table it anyway, short of the count" },
      "effects": { "popularity": 5, "notoriete": 1, "standing": -7, "sangfroid": 1 },
      "result": { "fr": "La motion est déclarée irrecevable en douze secondes par une commission des statuts qui n'a jamais autant travaillé. La presse en parle, ce qui était le seul objectif atteignable.",
                  "en": "The motion is ruled out of order in twelve seconds by a rules committee that has never worked so hard. The press covers it, which was the only achievable objective." } }
  ]
},

{
  "id": "investiture_dauphin",
  "election": ["congres"],
  "weight": 5,
  "cast": "camp_senior",
  "tag": { "fr": "Direction refusée", "en": "Leadership denied" },
  "text": {
    "fr": "Le congrès n'aura pas lieu, ou plutôt il aura lieu et ne décidera rien : le sortant a désigné {rival}, et l'on vous fait comprendre qu'un vote serait « un luxe que le parti ne peut pas se payer cette année ».",
    "en": "The congress will not happen, or rather it will happen and decide nothing: the outgoing leader has anointed {rival}, and you are given to understand that a vote would be \"a luxury the party cannot afford this year\"."
  },
  "choices": [
    { "label": { "fr": "Se rallier le premier, et le plus visiblement possible", "en": "Fall in first, and as visibly as possible" },
      "effects": { "standing": 8, "reseau": 1, "appeal": { "self": -4 }, "credibilite": -1 },
      "result": { "fr": "Vous montez sur scène quatre minutes après l'annonce et vous parlez de rassemblement. {Il} sait ce que cela vaut, vous savez ce que cela coûte, et vous serez le premier appelé la prochaine fois.",
                  "en": "You are on stage four minutes after the announcement, talking about unity. {He} knows what that is worth, you know what it costs, and you will be the first one called next time." } },

    { "label": { "fr": "Exiger un vote des adhérents, publiquement", "en": "Demand a members' ballot, in public" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "popularity": 0.05, "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "standing": -4, "notoriete": 2, "reputation": 2, "credibilite": 1 },
        "result": { "fr": "Le vote a lieu. Vous le perdez de dix-huit points, et vous sortez du congrès comme le seul qui ait demandé aux adhérents leur avis. C'est une défaite qui se dépose à la banque.",
                    "en": "The ballot is held. You lose it by eighteen points, and you leave the congress as the only person who asked the members what they thought. That is a defeat you can bank." } },
      "failure": { "effects": { "standing": -9, "appeal": { "self": -3 }, "reputation": -1 },
        "result": { "fr": "On vous répond statuts en main que la procédure ne le permet pas, et l'on a raison. Vous passez pour quelqu'un qui n'a pas lu les statuts de son propre parti.",
                    "en": "They answer, rulebook in hand, that the procedure does not allow it, and they are right. You come across as somebody who has not read his own party's rules." } } },

    { "label": { "fr": "Ne rien dire et préparer le congrès suivant", "en": "Say nothing and prepare the next congress" },
      "effects": { "sangfroid": 2, "reseau": 2, "credibilite": 1, "standing": -2, "energie": -1 },
      "result": { "fr": "Vous applaudissez au bon moment et vous passez l'année dans les fédérations. Un dauphin dure en moyenne un mandat ; les fédérations, elles, restent.",
                  "en": "You applaud at the right moment and spend the year in the federations. An anointed successor lasts about one term; the federations stay." } }
  ]
},

{
  "id": "investiture_candidat_naturel",
  "election": ["presidentielle"],
  "weight": 5,
  "cast": "camp_senior",
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "Il n'y aura pas de primaire. Le siège a tranché pour {rival}, au motif que le parti avait besoin d'« un candidat naturel ». La formule veut dire qu'aucun vote ne viendra vérifier que c'en est un. On vous demande d'être sur la photo du lancement, au deuxième rang.",
    "en": "There will be no primary. Headquarters has settled on {rival}, on the grounds that the party needed \"a natural candidate\". The phrase means no vote will be held to check that this is one. You are asked to be in the launch photograph, in the second row."
  },
  "choices": [
    { "label": { "fr": "Y être, au deuxième rang, et sourire", "en": "Be there, in the second row, smiling" },
      "effects": { "standing": 7, "reseau": 1, "appeal": { "self": -3 }, "credibilite": -1 },
      "result": { "fr": "La photo fait le tour des rédactions et vous y êtes, un peu flou, derrière l'épaule droite. Dans cinq ans on la ressortira pour dire que vous étiez là depuis le début.",
                  "en": "The photograph goes round every newsroom and there you are, slightly out of focus, behind the right shoulder. In five years it will be dug out to prove you were there from the start." } },

    { "label": { "fr": "Dire tout haut qu'un candidat naturel, ça n'existe pas", "en": "Say out loud that there is no such thing as a natural candidate" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "popularity": 0.06, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": 10, "notoriete": 2, "credibilite": 2, "standing": -8 },
        "result": { "fr": "La phrase est reprise partout et personne dans le parti ne peut la démentir sans se ridiculiser. Vous ne serez pas candidat cette fois, et tout le monde a compris que vous le serez.",
                    "en": "The line is quoted everywhere and nobody in the party can deny it without looking absurd. You will not be the candidate this time, and everybody has understood that you will be." } },
      "failure": { "effects": { "popularity": -5, "standing": -11, "reputation": -2 },
        "result": { "fr": "À six mois du scrutin, une phrase pareille s'appelle une division. On vous la ressortira à chaque revers de la campagne, et il y en aura.",
                    "en": "Six months from the vote, a line like that is called a split. It will be quoted back at you after every setback of the campaign, and there will be setbacks." } } },

    { "label": { "fr": "Ne pas venir, sans prévenir", "en": "Not turn up, without warning" },
      "effects": { "standing": -9, "reputation": 1, "sangfroid": 1, "notoriete": 1, "appeal": { "self": 2 } },
      "result": { "fr": "Votre absence au deuxième rang se voit plus que votre présence ne se serait vue. On ne vous demandera rien, on ne vous proposera rien non plus, et pendant six mois vous serez libre.",
                  "en": "Your absence from the second row is more visible than your presence would have been. Nobody will ask you for anything, nobody will offer you anything either, and for six months you will be free." } }
  ]
},

{
  "id": "investiture_matignon_promis",
  "election": ["presidentielle"],
  "weight": 4,
  "cast": "camp_senior",
  "tag": { "fr": "Investiture refusée", "en": "Nomination refused" },
  "text": {
    "fr": "{rival} a l'investiture et pas la campagne : il lui manque une partie du parti, et cette partie-là vous écoute. {Il} vous reçoit un dimanche soir et prononce le mot Matignon avant même de s'asseoir.",
    "en": "{rival} has the nomination and not the campaign: part of the party is missing, and that part listens to you. {He} sees you on a Sunday evening and says the word Matignon before even sitting down."
  },
  "choices": [
    { "label": { "fr": "Accepter, et faire campagne à fond", "en": "Accept, and campaign flat out" },
      "effects": { "standing": 10, "reseau": 2, "energie": -3, "appeal": { "self": -2 }, "credibilite": 1 },
      "result": { "fr": "Vous faites quarante meetings pour quelqu'un d'autre. Si {il} gagne, la promesse vaudra ce que valent les promesses d'avant le premier tour ; si {il} perd, vous serez le seul à en sortir grandi.",
                  "en": "You do forty rallies for somebody else. If {he} wins, the promise will be worth what promises made before a first round are worth; if {he} loses, you will be the only one who comes out of it bigger." } },

    { "label": { "fr": "Exiger que ce soit écrit et contresigné", "en": "Insist it be put in writing and countersigned" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "reseau": 0.4, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 12, "credibilite": 2, "reseau": 1, "reputation": -1 },
        "result": { "fr": "Une feuille, deux signatures, et un témoin qui n'a rien dit de la soirée. Cela n'a aucune valeur juridique et cela en a une autre, qui est de rendre le reniement coûteux.",
                    "en": "One sheet, two signatures, and a witness who said nothing all evening. It has no legal force whatever and it has another kind, which is to make going back on it expensive." } },
      "failure": { "effects": { "standing": -8, "reputation": -2, "appeal": { "self": -2 } },
        "result": { "fr": "{Il} se lève, dit qu'entre gens de parole on ne signe pas, et la soirée s'arrête là. Le lendemain, la promesse est faite à quelqu'un d'autre, oralement.",
                    "en": "{He} stands up, says that people of their word do not sign things, and the evening ends there. The next day the promise is made to somebody else, orally." } } },

    { "label": { "fr": "Refuser : on ne se vend pas avant le premier tour", "en": "Refuse: you do not sell yourself before the first round" },
      "effects": { "reputation": 3, "credibilite": 2, "sangfroid": 1, "standing": -7, "appeal": { "self": 3 } },
      "result": { "fr": "Vous répondez que vous verrez le soir du premier tour, ce qui est la seule réponse honnête et la seule qu'on ne pardonne pas. {Il} n'a plus besoin de vous, et vous n'avez plus rien à lui devoir.",
                  "en": "You answer that you will see on the evening of the first round, which is the only honest answer and the one that is never forgiven. {He} no longer needs you, and you no longer owe him anything." } }
  ]
}
];
