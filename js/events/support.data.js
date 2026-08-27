/* Généré — ne pas éditer à la main. */
const EV_support = [

{
  "id": "sup_affiches",
  "when": { "position": ["militant", "cadre", "conseiller"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "La campagne nationale a besoin de bras et vous n'êtes personne dans l'organigramme. Votre section reçoit huit mille affiches, deux escabeaux et aucune consigne."
    ,
    "en": "The national campaign needs hands and you are nobody on the org chart. Your branch receives eight thousand posters, two stepladders and no instructions."
  },
  "choices": [
    { "label": { "fr": "Coller toutes les nuits pendant six semaines", "en": "Fly-post every night for six weeks" },
      "effects": { "score": 3, "standing": 5, "energie": -3, "reseau": 1 },
      "result": { "fr": "Six semaines à monter sur des escabeaux dans le froid. Personne ne le saura sauf les quinze qui étaient là, et ces quinze-là voteront pour vous pendant vingt ans.",
                  "en": "Six weeks up stepladders in the cold. Nobody will know except the fifteen who were there, and those fifteen will vote for you for twenty years." } },
    { "label": { "fr": "Organiser la section et déléguer", "en": "Organise the branch and delegate" },
      "effects": { "score": 2, "standing": 3, "reseau": 2, "energie": -1 },
      "result": { "fr": "Vous montez un planning, quatre équipes et un groupe de discussion. C'est mieux tenu que la campagne nationale, ce qui n'est pas un compliment pour la campagne nationale.",
                  "en": "You set up a rota, four teams and a chat group. It is better run than the national campaign, which is not a compliment to the national campaign." } },
    { "label": { "fr": "Laisser les affiches dans le local", "en": "Leave the posters in the back room" },
      "effects": { "score": -2, "standing": -4, "energie": 2 },
      "result": { "fr": "Elles y sont encore. Quelqu'un les retrouvera dans quatre ans et prendra une photo qui circulera dans toute la fédération.",
                  "en": "They are still there. Somebody will find them in four years and take a photograph that will go round the entire federation." } }
  ]
},

{
  "id": "sup_bilan",
  "when": { "position": ["ministre", "premier"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous êtes au gouvernement pendant que votre camp fait campagne. Chaque plateau vous demande de défendre un bilan que le candidat de votre parti passe ses journées à nuancer."
    ,
    "en": "You are in government while your side campaigns. Every studio asks you to defend a record that your party's candidate spends their days qualifying."
  },
  "choices": [
    { "label": { "fr": "Défendre le bilan sans une nuance", "en": "Defend the record without a single caveat" },
      "effects": { "score": 4, "credibilite": 2, "popularity": -6, "standing": 5, "energie": -2 },
      "result": { "fr": "Vous tenez la ligne partout, y compris là où elle est indéfendable. Le candidat gagne un point de sérieux et vous perdez ce qui vous restait de sympathie.",
                  "en": "You hold the line everywhere, including where it cannot be held. The candidate gains a point of seriousness and you lose what sympathy you had left." } },
    { "label": { "fr": "Prendre vos distances avec le gouvernement", "en": "Put some distance between yourself and the government" },
      "effects": { "score": -4, "popularity": 9, "standing": -9, "reputation": -1 },
      "result": { "fr": "Vous expliquez ce que vous auriez fait autrement. Le pays vous trouve honnête, votre camp vous trouve en campagne pour vous-même, et les deux ont raison.",
                  "en": "You explain what you would have done differently. The country finds you honest, your side finds you campaigning for yourself, and both are right." } },
    { "label": { "fr": "Annoncer trois mesures avant le scrutin", "en": "Announce three measures before the vote" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 5, "popularity": 5, "standing": 4, "credibilite": 1 },
        "result": { "fr": "Trois décrets signés à quinze jours du vote, et personne pour dire que c'est électoraliste puisque tout le monde le pense.",
                    "en": "Three decrees signed a fortnight before the vote, and nobody says it is electioneering because everybody is thinking it." } },
      "failure": { "effects": { "score": -3, "popularity": -8, "credibilite": -2, "standing": -4 },
        "result": { "fr": "Les mesures arrivent trop tard et se voient trop. La séquence devient un cas d'école de ce qu'il ne faut pas faire, cité pendant deux campagnes.",
                    "en": "The measures land too late and show too much. The sequence becomes a textbook case of what not to do, cited for two campaigns." } } }
  ]
},

{
  "id": "sup_meeting",
  "when": { "position": ["maire", "euro", "depute"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Le meeting régional se tient chez vous, et c'est vous qui remplissez la salle. Trois mille places, une heure d'antenne nationale, et un candidat qui arrivera vingt minutes avant de parler."
    ,
    "en": "The regional rally is on your patch, and you are the one filling the hall. Three thousand seats, an hour of national coverage, and a candidate who will arrive twenty minutes before speaking."
  },
  "choices": [
    { "label": { "fr": "Remplir la salle et lui laisser toute la lumière", "en": "Fill the hall and give them all the light" },
      "effects": { "score": 5, "standing": 8, "energie": -2, "popularity": 1 },
      "result": { "fr": "Salle pleine, ambiance excellente, et votre nom prononcé une fois en début de discours. C'est exactement ce qu'on attendait de vous, et on s'en souviendra.",
                  "en": "Full hall, excellent atmosphere, and your name mentioned once at the start of the speech. It is exactly what was expected of you, and it will be remembered." } },
    { "label": { "fr": "Faire un discours qu'on retiendra", "en": "Give a speech people will remember" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 3, "notoriete": 3, "popularity": 10, "standing": -3,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "Douze minutes reprises en boucle sur toutes les chaînes. Le candidat vous félicite avec un sourire qui n'atteint pas ses yeux.",
                    "en": "Twelve minutes replayed on every channel. The candidate congratulates you with a smile that does not reach their eyes." } },
      "failure": { "effects": { "score": -2, "popularity": -6, "standing": -5, "energie": -1 },
        "result": { "fr": "Vous parlez huit minutes de trop devant une salle qui attend quelqu'un d'autre. Le silence de la fin est le vrai sujet de la soirée.",
                    "en": "You speak eight minutes too long to a hall waiting for somebody else. The silence at the end is the real story of the evening." } } },
    { "label": { "fr": "Annuler : la salle ne se remplira pas", "en": "Cancel: the hall will not fill" },
      "effects": { "score": -5, "standing": -8, "energie": 1, "sangfroid": 1 },
      "result": { "fr": "Vous préférez une salle vide annulée à une salle vide filmée. Vous avez raison sur le fond et la direction ne vous le pardonnera pas.",
                  "en": "You prefer an empty hall cancelled to an empty hall on television. You are right on the substance and the leadership will not forgive you." } }
  ]
},

{
  "id": "sup_desistement",
  "when": { "position": ["chef", "premier"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous dirigez le parti sans en être le candidat, ce qui est la position la plus inconfortable de la campagne. Un parti voisin propose un accord de désistement, et son prix est une liste de circonscriptions."
    ,
    "en": "You lead the party without being its candidate, which is the most uncomfortable position of the campaign. A neighbouring party offers a stand-down deal, and its price is a list of constituencies."
  },
  "choices": [
    { "label": { "fr": "Signer l'accord", "en": "Sign the deal" },
      "effects": { "score": 6, "standing": 4, "reputation": -1, "reseau": 1,
                   "landscape": { "self": -0.6, "ally": 0.6 } },
      "result": { "fr": "Vous cédez huit circonscriptions contre un appel à voter. Le candidat gagne des voix, le parti perd des sièges, et c'est vous qui aurez signé.",
                  "en": "You give up eight seats in exchange for an endorsement. The candidate gains votes, the party loses seats, and you are the one who signed." } },
    { "label": { "fr": "Refuser et faire campagne seul", "en": "Refuse and campaign alone" },
      "effects": { "score": -3, "standing": 6, "credibilite": 1, "landscape": { "self": 0.5 } },
      "result": { "fr": "Vous refusez de brader ce qui vous reste. L'appareil vous approuve, le candidat vous en veut, et vous saurez dans quinze jours lequel des deux comptait.",
                  "en": "You refuse to sell off what is left. The machine approves, the candidate resents it, and in a fortnight you will know which of the two mattered." } },
    { "label": { "fr": "Négocier plus dur", "en": "Push for a better deal" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "standing": 0.05, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 5, "standing": 9, "reseau": 2, "credibilite": 1 },
        "result": { "fr": "Trois circonscriptions au lieu de huit, et l'appel à voter quand même. On vous croyait affaibli par la primaire, on découvre que non.",
                    "en": "Three seats instead of eight, and the endorsement anyway. They thought the primary had weakened you; it turns out it had not." } },
      "failure": { "effects": { "score": -6, "standing": -8, "reputation": -1,
                                "landscape": { "self": -0.8 } },
        "result": { "fr": "Ils claquent la porte et appellent à voter pour personne. Vous avez perdu l'accord, les circonscriptions et deux points dans les sondages.",
                    "en": "They walk out and endorse nobody. You have lost the deal, the seats and two points in the polls." } } }
  ]
},

{
  "id": "sup_debat_soutien",
  "when": { "minPopularity": 60 },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous êtes plus populaire que le candidat de votre propre camp, et tout le monde le sait, à commencer par lui. Les rédactions vous réclament pour parler à sa place."
    ,
    "en": "You are more popular than your own side's candidate, and everyone knows it, starting with the candidate. Newsrooms want you to speak in their place."
  },
  "choices": [
    { "label": { "fr": "Y aller et le porter à bout de bras", "en": "Go, and carry them" },
      "effects": { "score": 6, "standing": 7, "popularity": -3, "energie": -2 },
      "result": { "fr": "Vous faites vingt plateaux en trois semaines pour dire du bien de quelqu'un d'autre. C'est le travail le plus ingrat de la campagne et le seul dont on vous saura gré.",
                  "en": "You do twenty studios in three weeks saying good things about somebody else. It is the most thankless job of the campaign and the only one you will be thanked for." } },
    { "label": { "fr": "Y aller et parler surtout de vous", "en": "Go, and mostly talk about yourself" },
      "effects": { "score": -4, "popularity": 8, "notoriete": 2, "standing": -10, "reputation": -1,
                   "landscape": { "self": -0.5 } },
      "result": { "fr": "Chaque réponse revient à votre bilan et à vos idées. Les électeurs adorent, le candidat regarde les émissions, et la campagne devient une audition pour la suivante.",
                  "en": "Every answer comes back to your record and your ideas. Voters love it, the candidate watches the broadcasts, and the campaign becomes an audition for the next one." } },
    { "label": { "fr": "Refuser toutes les demandes", "en": "Turn down every request" },
      "effects": { "score": -2, "standing": -3, "energie": 2, "reputation": 1 },
      "result": { "fr": "Vous laissez le candidat occuper son propre espace. C'est élégant, c'est loyal, et cela ne se voit pas du tout.",
                  "en": "You leave the candidate their own space. It is elegant, it is loyal, and it is completely invisible." } }
  ]
},

{
  "id": "sup_porte_a_porte",
  "moment": 2,
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Dernier week-end avant le premier tour. Le siège demande à chacun de faire du porte-à-porte, et vous connaissez par cœur ce que ça donne : deux portes sur trois qui ne s'ouvrent pas, et la troisième qui parle vingt minutes."
    ,
    "en": "The last weekend before the first round. Headquarters is asking everyone to canvass, and you know exactly how it goes: two doors in three that stay shut, and the third that talks for twenty minutes."
  },
  "choices": [
    { "label": { "fr": "Y aller avec vos équipes", "en": "Go out with your teams" },
      "effects": { "score": 3, "standing": 4, "popularity": 3, "energie": -2 },
      "result": { "fr": "Neuf cents portes en deux jours. Vous en tirez trois enseignements que le siège n'a pas, et personne au siège ne vous les demandera.",
                  "en": "Nine hundred doors in two days. You come back with three insights headquarters does not have, and nobody there will ask you for them." } },
    { "label": { "fr": "Envoyer vos équipes et rester au téléphone", "en": "Send your teams and stay on the phone" },
      "effects": { "score": 1, "reseau": 2, "energie": 1, "standing": -1 },
      "result": { "fr": "Vous passez le week-end à appeler des gens qui comptent plutôt qu'à parler à des gens qui votent. C'est un choix, et il se défend.",
                  "en": "You spend the weekend calling people who matter rather than talking to people who vote. It is a choice, and it can be defended." } },
    { "label": { "fr": "Passer le week-end en famille", "en": "Spend the weekend with your family" },
      "effects": { "score": -2, "energie": 3, "standing": -3, "reputation": 1 },
      "result": { "fr": "Vous ne faites rien et vous dormez. Vous serez le seul reposé du parti lundi matin, ce qui ne se voit sur aucun tableau.",
                  "en": "You do nothing and you sleep. You will be the only rested person in the party on Monday morning, which shows up on no chart." } }
  ]
},

{
  "id": "sup_soir_premier_tour",
  "moment": 1,
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "Le premier tour est passé et il reste quinze jours. Le report des voix se joue maintenant, dans des salles de réunion et des studios, et pas devant les électeurs."
    ,
    "en": "The first round is over and a fortnight remains. Where the votes go next is decided now, in meeting rooms and studios, not in front of voters."
  },
  "choices": [
    { "label": { "fr": "Aller chercher les électeurs des éliminés", "en": "Go after the eliminated candidates' voters" },
      "effects": { "score": 5, "standing": 5, "energie": -2, "reputation": -1 },
      "result": { "fr": "Vous passez quinze jours à dire du bien de gens que vous combattez depuis vingt ans. Certains de leurs électeurs suivront, et c'est tout ce qu'on vous demandait.",
                  "en": "You spend a fortnight saying kind things about people you have fought for twenty years. Some of their voters will follow, and that was all anyone asked." } },
    { "label": { "fr": "Faire campagne sur votre propre terrain", "en": "Campaign on your own ground" },
      "effects": { "score": 2, "popularity": 5, "standing": -2, "energie": -1 },
      "result": { "fr": "Vous ne pouvez pas déplacer le pays, alors vous déplacez votre circonscription. Le report y sera meilleur qu'ailleurs et personne ne fera le lien.",
                  "en": "You cannot move the country, so you move your own constituency. The transfer will be better there than anywhere else and nobody will make the connection." } },
    { "label": { "fr": "Préparer l'après, quel que soit le résultat", "en": "Prepare for the aftermath, whatever the result" },
      "effects": { "score": -1, "reseau": 2, "standing": 3, "credibilite": 1 },
      "result": { "fr": "Pendant que les autres tractent, vous appelez ceux qui compteront le 8 au matin. C'est cynique, c'est utile, et cela ne fera gagner personne dimanche.",
                  "en": "While the others hand out leaflets, you call the people who will matter on the Monday morning. It is cynical, it is useful, and it will win nobody anything on Sunday." } }
  ]
},

{
  "id": "sup_sabotage",
  "when": { "maxStanding": 45 },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Le candidat désigné a fait campagne contre vous à la primaire et ne vous a rien proposé depuis. Un journaliste vous appelle pour un portrait critique et vous demande, en off, ce que vous en pensez vraiment."
    ,
    "en": "The chosen candidate ran against you in the primary and has offered you nothing since. A reporter calls for a critical profile and asks, off the record, what you really think."
  },
  "choices": [
    { "label": { "fr": "Le soutenir quand même, publiquement", "en": "Back them anyway, publicly" },
      "effects": { "score": 4, "standing": 9, "reputation": 2, "credibilite": 1, "popularity": -2 },
      "result": { "fr": "Vous dites du bien de quelqu'un qui vous a démoli. Personne n'est dupe, et c'est exactement pour ça que cela compte.",
                  "en": "You speak well of somebody who tore you down. Nobody is fooled, and that is exactly why it counts." } },
    { "label": { "fr": "Parler en off, sans se découvrir", "en": "Speak off the record, staying covered" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": -5, "standing": 3, "notoriete": 1,
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Le portrait sort, sévère, sourcé « un cadre du parti ». Trois personnes savent que c'est vous et aucune n'a intérêt à le dire.",
                    "en": "The profile runs, harsh, sourced to “a senior party figure”. Three people know it was you and none of them has any interest in saying so." } },
      "failure": { "effects": { "score": -6, "standing": -14, "reputation": -2, "strike": "traitre",
                                "landscape": { "self": -0.9 } },
        "result": { "fr": "Une formule trop reconnaissable vous trahit dès le lendemain. On ne vous pardonnera pas d'avoir tiré pendant la campagne, quoi qu'il arrive ensuite.",
                    "en": "A turn of phrase too recognisable gives you away the next day. Firing during the campaign will not be forgiven, whatever happens afterwards." } } },
    { "label": { "fr": "Ne rien dire et disparaître six semaines", "en": "Say nothing and vanish for six weeks" },
      "effects": { "score": -2, "energie": 3, "standing": -4 },
      "result": { "fr": "Vous éteignez le téléphone et vous vous occupez de votre circonscription. On remarquera votre absence, ce qui est déjà une prise de position.",
                  "en": "You switch off the phone and look after your own patch. Your absence will be noticed, which is already a position." } }
  ]
},
/* ==========================================================================
   MOI OU LE CANDIDAT
   ==========================================================================
   Le paquet ne tenait que huit scènes pour dix-huit tirages par carrière : on
   revoyait deux fois la même porte, le même escabeau, le même plateau. Les
   scènes qui suivent le doublent, et elles tirent toutes sur le même fil,
   parce que c'est celui de la situation : on fait campagne pour quelqu'un
   d'autre. Chaque carte demande donc ce que la campagne demande vraiment —
   ce qu'on donne au candidat, et ce qu'on garde pour la fois d'après.
   ========================================================================== */

{
  "id": "sup_note_strategie",
  "moment": 3,
  "when": { "position": ["cadre", "conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous écrivez en trois nuits une note de dix pages qui dit pourquoi la campagne se plante, et comment la redresser. Le directeur de campagne la lit, la trouve excellente, et vous demande de la lui laisser sans en-tête.",
    "en": "In three nights you write a ten-page memo saying why the campaign is failing and how to fix it. The campaign director reads it, finds it excellent, and asks you to leave it with him without a letterhead."
  },
  "choices": [
    { "label": { "fr": "La lui laisser sans votre nom", "en": "Leave it with him, unsigned" },
      "roll": { "base": 13, "stat": "credibilite", "plus": { "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 5, "standing": 8, "reseau": 1, "landscape": { "self": 0.5 } },
        "result": { "fr": "Trois de vos dix pages sont appliquées en huit jours et la campagne repart. Le directeur les présente comme les siennes devant le candidat, et il précise, à la fin, d'où elles viennent.",
                    "en": "Three of your ten pages are applied within a week and the campaign steadies. The director presents them as his own in front of the candidate, then says, at the end, where they came from." } },
      "failure": { "effects": { "score": 1, "standing": -2, "energie": -2 },
        "result": { "fr": "La note disparaît dans un classeur. Vous la retrouverez quatre ans plus tard dans le livre de campagne du directeur, chapitre trois, sans guillemets.",
                    "en": "The memo vanishes into a folder. You will find it four years later in the director's campaign book, chapter three, without quotation marks." } } },
    { "label": { "fr": "La publier sous votre nom dans un journal", "en": "Publish it under your own name in a paper" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": -2, "notoriete": 3, "popularity": 8, "standing": -9, "credibilite": 1 },
        "result": { "fr": "Deux pleines pages signées de vous, et le pays découvre qu'il existe dans ce parti quelqu'un qui sait compter. Le candidat l'apprend par la revue de presse de sept heures.",
                    "en": "Two full pages under your byline, and the country discovers this party contains somebody who can count. The candidate learns of it from the seven o'clock press review." } },
      "failure": { "effects": { "score": -5, "standing": -13, "reputation": -2, "strike": "traitre",
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "On ne lit pas votre analyse, on lit la date. Publier ça à trois semaines du vote s'appelle un règlement de comptes, et il n'y a pas d'autre lecture possible.",
                    "en": "Nobody reads your analysis, they read the date. Publishing this three weeks before the vote is called settling a score, and there is no other available reading." } } },
    { "label": { "fr": "La donner en off à un journaliste", "en": "Hand it to a reporter, off the record" },
      "when": { "personality": ["calculating"] },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.2 },
                                                 { "when": { "background": ["journalism"] }, "value": 0.2 } ] },
      "success": { "effects": { "score": -3, "notoriete": 2, "standing": 2, "reseau": 1 },
        "result": { "fr": "Le papier sort sous la formule « une note qui circule au sommet du parti ». Elle ne circulait nulle part, elle était dans votre tiroir, et maintenant elle est partout.",
                    "en": "The piece runs as “a memo circulating at the top of the party”. It was circulating nowhere; it was in your drawer, and now it is everywhere." } },
      "failure": { "effects": { "score": -4, "standing": -11, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Le journaliste cite la note en entier, y compris la phrase sur le directeur de campagne que vous aviez laissée par mégarde. Trois personnes pouvaient l'avoir écrite.",
                    "en": "The reporter quotes the memo in full, including the line about the campaign director you had left in by accident. Three people could have written it." } } },
    { "label": { "fr": "La brûler et faire ce qu'on vous demande", "en": "Burn it and do as you are told" },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "personality": ["principled"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": 2, "standing": 4, "energie": 2, "sangfroid": 1 },
        "result": { "fr": "Vous collez des affiches pendant que la campagne se plante exactement comme vous l'aviez écrit. Personne ne saura que vous saviez, et vous dormez très bien.",
                    "en": "You put up posters while the campaign fails in exactly the way you wrote it would. Nobody will know that you knew, and you sleep very well." } },
      "failure": { "effects": { "score": -1, "standing": -3, "energie": -2, "reputation": -1 },
        "result": { "fr": "Vous tenez trois semaines, puis vous le dites à quatre personnes dans une salle de restaurant. Une le répète. On retiendra que vous aviez raison et que vous l'avez dit derrière.",
                    "en": "You hold out three weeks, then say it to four people in a restaurant. One repeats it. What will be remembered is that you were right and that you said it behind their back." } } }
  ]
},

{
  "id": "sup_tresorerie",
  "when": { "minMoney": 60000, "position": ["conseiller", "maire", "euro", "depute", "ministre", "chef"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "La campagne nationale est à sec à cinq semaines du vote. Le trésorier fait le tour des élus avec un tableau où figurent, en face de chaque nom, un montant suggéré et la mention « déjà versé » ou rien.",
    "en": "The national campaign is broke five weeks out. The treasurer is going round the elected members with a spreadsheet showing, next to each name, a suggested amount and either “already paid” or nothing."
  },
  "choices": [
    { "label": { "fr": "Verser le double du montant suggéré", "en": "Pay double the suggested amount" },
      "roll": { "chance": 0.75, "chanceBonus": [ { "when": { "minStanding": 55 }, "value": 0.15 } ] },
      "success": { "effects": { "score": 4, "money": -70000, "standing": 11, "reseau": 2,
                                "landscape": { "self": 0.4 } },
        "result": { "fr": "Le tableau circule, et votre ligne se voit. On ne vous remerciera jamais publiquement, et pendant dix ans on dira de vous « celui qui a payé en avril » comme on dirait un titre.",
                    "en": "The spreadsheet goes round, and your line stands out. Nobody will ever thank you publicly, and for ten years people will say “the one who paid in April” the way they would say a title." } },
      "failure": { "effects": { "score": 2, "money": -70000, "standing": 3, "reputation": -1 },
        "result": { "fr": "L'argent arrive le jour où la campagne annonce qu'elle a bouclé son budget. Vous avez payé plein tarif pour un sauvetage qui n'aura pas eu lieu.",
                    "en": "The money lands the day the campaign announces its budget is balanced. You paid full price for a rescue that never happened." } } },
    { "label": { "fr": "Verser exactement le montant suggéré", "en": "Pay exactly the suggested amount" },
      "roll": { "chance": 0.85 },
      "success": { "effects": { "score": 2, "money": -30000, "standing": 4 },
        "result": { "fr": "Vous payez ce qu'on vous demande, ni plus ni moins. C'est la case « déjà versé », et c'est tout ce qu'on retiendra, ce qui est exactement ce que vous vouliez.",
                    "en": "You pay what you are asked, no more and no less. It is the “already paid” box, and it is all anyone will remember, which is exactly what you wanted." } },
      "failure": { "effects": { "score": 1, "money": -30000, "standing": -2 },
        "result": { "fr": "Le trésorier note votre montant, puis celui de votre voisin de banc, qui est le triple. Il ne dit rien. Il n'a pas besoin de dire quoi que ce soit.",
                    "en": "The treasurer notes your amount, then that of the member sitting next to you, which is triple. He says nothing. He does not need to say anything." } } },
    { "label": { "fr": "Garder votre argent pour votre propre campagne", "en": "Keep your money for your own campaign" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 },
                                                 { "when": { "background": ["business"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": -3, "standing": -4, "reseau": 1, "credibilite": 1 },
        "result": { "fr": "Vous expliquez au trésorier, chiffres à l'appui, que vos législatives coûteront davantage que sa dernière semaine d'affichage. Il vous donne raison et il ne vous le pardonne pas.",
                    "en": "You explain to the treasurer, figures in hand, that your own legislative race will cost more than his last week of posters. He agrees with you and does not forgive you." } },
      "failure": { "effects": { "score": -4, "standing": -12, "reputation": -2,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "Le tableau finit dans un journal, avec votre ligne vide entourée au feutre. On ne discutera jamais du fond, on discutera de la case.",
                    "en": "The spreadsheet ends up in a newspaper, your empty line circled in marker. Nobody will ever discuss the substance; they will discuss the box." } } },
    { "label": { "fr": "Trouver l'argent ailleurs, et vite", "en": "Find the money elsewhere, and fast" },
      "when": { "background": ["business", "law"] },
      "roll": { "base": 17, "stat": "reseau", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 6, "standing": 12, "reseau": 2, "notoriete": 1,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "Onze coups de téléphone, quatre déjeuners et une garantie bancaire. Vous ne versez pas un euro et vous sauvez la fin de la campagne, ce qui vaut mieux que payer.",
                    "en": "Eleven phone calls, four lunches and a bank guarantee. You do not pay a euro and you save the end of the campaign, which is worth more than paying." } },
      "failure": { "effects": { "score": -2, "standing": -5, "reputation": -2, "energie": -2,
                                "flags": { "dirtyMoney": true } },
        "result": { "fr": "L'un des onze est trop content d'aider et ne demande rien, ce qui est la chose la plus chère qui puisse arriver à une campagne. On vous rappellera.",
                    "en": "One of the eleven is far too happy to help and asks for nothing, which is the most expensive thing that can happen to a campaign. You will be called back." } } }
  ]
},

{
  "id": "sup_fichier",
  "moment": 3,
  "when": { "stat": { "reseau": { "min": 6 } } },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Vous avez mis quinze ans à constituer votre fichier : douze mille noms, des numéros qui répondent encore, et pour chacun une ligne qui dit ce qu'il a donné et ce qu'il a demandé. Le siège vous le réclame pour la campagne.",
    "en": "It took you fifteen years to build your contact file: twelve thousand names, numbers that still answer, and against each one a line saying what they gave and what they asked for. Headquarters wants it for the campaign."
  },
  "choices": [
    { "label": { "fr": "Le donner entier", "en": "Hand it over whole" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "score": 6, "standing": 10, "landscape": { "self": 0.7 }, "reseau": -1 },
        "result": { "fr": "La campagne double son fichier en une après-midi et le sait. Vous venez de donner quinze ans de travail à une maison qui ne rend jamais rien, et la maison s'en souvient parfois.",
                    "en": "The campaign doubles its file in an afternoon and knows it. You have just given fifteen years of work to a house that never gives anything back, and the house does occasionally remember." } },
      "failure": { "effects": { "score": 3, "standing": 2, "reseau": -3, "reputation": -1 },
        "result": { "fr": "Le fichier est versé dans la base nationale, mal fusionné, et vos douze mille noms reçoivent trois courriels par jour pendant six semaines. Deux mille se désabonnent définitivement.",
                    "en": "The file is dumped into the national database, badly merged, and your twelve thousand names get three emails a day for six weeks. Two thousand unsubscribe for good." } } },
    { "label": { "fr": "Le donner amputé de vos meilleurs contacts", "en": "Hand over a version with your best contacts removed" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.25 } ] },
      "success": { "effects": { "score": 2, "standing": 4, "reseau": 1 },
        "result": { "fr": "Vous livrez onze mille noms sur douze mille et personne ne compte. Le millier qui manque est celui qui décroche le dimanche soir, et il reste à vous.",
                    "en": "You deliver eleven thousand names out of twelve and nobody counts. The missing thousand are the ones who pick up on a Sunday evening, and they stay yours." } },
      "failure": { "effects": { "score": -2, "standing": -8, "reseau": 1, "reputation": -1 },
        "result": { "fr": "Un permanent remarque que le fichier ne contient aucun des donateurs que vous avez fait venir au dîner de février. Il ne dit rien tout de suite, ce qui est pire.",
                    "en": "A staffer notices the file contains none of the donors you brought to February's dinner. He says nothing straight away, which is worse." } } },
    { "label": { "fr": "Refuser : c'est votre outil de travail", "en": "Refuse: it is your working tool" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "minStanding": 65 }, "value": 0.25 },
                                                { "when": { "partyLead": true }, "value": 0.2 } ] },
      "success": { "effects": { "score": -3, "standing": -3, "reseau": 2, "credibilite": 1 },
        "result": { "fr": "Vous dites non sans vous justifier, ce qui est la seule façon de dire non. On vous le repropose deux fois, puis on passe à quelqu'un d'autre.",
                    "en": "You say no without justifying it, which is the only way of saying no. They ask twice more, then move on to somebody else." } },
      "failure": { "effects": { "score": -5, "standing": -12, "reputation": -1,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "Le mot « fichier personnel » circule dans les couloirs avec l'intonation qu'on réserve aux mots « caisse personnelle ». Vous n'aviez rien à cacher et vous avez tout l'air d'en avoir.",
                    "en": "The phrase “personal file” goes round the corridors with the intonation reserved for “personal slush fund”. You had nothing to hide and you look exactly like somebody who has." } } }
  ]
},

{
  "id": "sup_clip",
  "moment": 3,
  "when": { "position": ["maire", "euro", "depute", "ministre"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Le clip officiel se tourne chez vous : votre marché, votre gymnase, vos habitants. La production vous propose douze secondes à l'image, aux côtés du candidat, et vous laisse décider.",
    "en": "The official campaign film is being shot on your patch: your market, your sports hall, your residents. The production offers you twelve seconds on screen alongside the candidate, and leaves it to you."
  },
  "choices": [
    { "label": { "fr": "Prendre les douze secondes", "en": "Take the twelve seconds" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 3, "notoriete": 2, "popularity": 6, "standing": -3 },
        "result": { "fr": "Douze secondes vues onze millions de fois. Vous n'y dites rien, vous y êtes, et être là suffit : le pays met un visage sur un nom qu'il lisait sans le prononcer.",
                    "en": "Twelve seconds seen eleven million times. You say nothing in them, you are simply there, and being there is enough: the country puts a face to a name it had been reading without pronouncing." } },
      "failure": { "effects": { "score": -2, "popularity": -5, "standing": -5, "reputation": -1 },
        "result": { "fr": "Au montage, il ne reste de vous qu'un plan de trois secondes où vous regardez le candidat parler. Le plan devient un mème avant la fin de la semaine.",
                    "en": "In the edit, all that survives is a three-second shot of you watching the candidate speak. The shot becomes a meme before the end of the week." } } },
    { "label": { "fr": "Les refuser et rester derrière la caméra", "en": "Turn them down and stay behind the camera" },
      "roll": { "chance": 0.75, "chanceBonus": [ { "when": { "personality": ["principled"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": 5, "standing": 8, "reseau": 1, "landscape": { "self": 0.4 } },
        "result": { "fr": "Vous passez trois jours à ouvrir des portes, à trouver la boulangerie qui accepte, à faire venir cent personnes un mardi matin. Le clip est excellent et vous n'y êtes pas.",
                    "en": "You spend three days opening doors, finding the baker who will agree, getting a hundred people out on a Tuesday morning. The film is excellent and you are not in it." } },
      "failure": { "effects": { "score": 2, "standing": 2, "energie": -2 },
        "result": { "fr": "Le clip est tourné, monté, diffusé, et votre ville n'y est pas reconnaissable. Trois jours de votre vie pour un plan de gymnase qui pourrait être n'importe où.",
                    "en": "The film is shot, cut, broadcast, and your town is unrecognisable in it. Three days of your life for a shot of a sports hall that could be anywhere." } } },
    { "label": { "fr": "Exiger un plan sur votre bilan municipal", "en": "Demand a shot of your own record" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "score": 1, "popularity": 7, "notoriete": 2, "standing": -6, "credibilite": 1 },
        "result": { "fr": "La médiathèque que vous avez construite tient huit secondes à l'écran, avec votre nom dessous. Le directeur de campagne accepte parce qu'il n'a pas le temps de discuter.",
                    "en": "The library you built holds eight seconds on screen with your name under it. The campaign director agrees because he has no time to argue." } },
      "failure": { "effects": { "score": -4, "standing": -10, "reputation": -1, "popularity": -2 },
        "result": { "fr": "On tourne ailleurs. Le clip officiel de la campagne présidentielle se passe très bien de votre médiathèque, et tout le monde apprend que vous l'aviez demandée.",
                    "en": "They shoot elsewhere. The official film of a presidential campaign manages perfectly well without your library, and everyone learns that you asked for it." } } }
  ]
},

{
  "id": "sup_militants",
  "moment": 3,
  "when": { "position": ["cadre", "conseiller", "maire", "euro", "depute", "chef"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Le siège réquisitionne vos militants pour trois semaines dans une région qu'il juge décisive, à six cents kilomètres. Ce sont les mêmes quarante personnes qui tiennent vos permanences, vos marchés et votre prochaine campagne.",
    "en": "Headquarters is requisitioning your activists for three weeks in a region it considers decisive, four hundred miles away. They are the same forty people who run your surgeries, your markets and your next campaign."
  },
  "choices": [
    { "label": { "fr": "Les envoyer tous, et y aller avec eux", "en": "Send them all, and go with them" },
      "roll": { "base": 14, "stat": "energie", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 6, "standing": 9, "energie": -3, "reseau": 2,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "Trois semaines de gymnases et d'hôtels d'autoroute. La région bascule d'un point et demi, ce qui ne se verra sur aucune affiche et se saura dans toute la maison.",
                    "en": "Three weeks of sports halls and motorway hotels. The region shifts a point and a half, which will show on no poster and will be known throughout the house." } },
      "failure": { "effects": { "score": 1, "standing": 3, "energie": -4, "popularity": -3 },
        "result": { "fr": "Vous rentrez épuisés et la région n'a pas bougé d'un cheveu. Pendant ce temps, votre permanence a fermé trois semaines et deux cents personnes ont trouvé porte close.",
                    "en": "You come back exhausted and the region has not moved an inch. Meanwhile your own office was shut for three weeks and two hundred people found the door locked." } } },
    { "label": { "fr": "En envoyer la moitié et garder le reste", "en": "Send half and keep the rest" },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": 3, "standing": 3, "energie": -1 },
        "result": { "fr": "Vingt partent, vingt restent, et personne ne compte. C'est la seule décision raisonnable de la campagne et elle ne fera plaisir à aucun des deux groupes.",
                    "en": "Twenty go, twenty stay, and nobody counts. It is the only reasonable decision of the campaign and it will please neither group." } },
      "failure": { "effects": { "score": -1, "standing": -5, "energie": -1, "reputation": -1 },
        "result": { "fr": "Les vingt partis apprennent que vingt sont restés. La discussion dure trois semaines, se poursuit dans le car du retour, et durera encore au congrès.",
                    "en": "The twenty who went learn that twenty stayed. The argument lasts three weeks, continues on the coach home, and will still be going at conference." } } },
    { "label": { "fr": "Refuser : votre terrain d'abord", "en": "Refuse: your own ground first" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "minPopularity": 60 }, "value": 0.2 },
                                                { "when": { "trait": ["ancrage_local"] }, "value": 0.25 } ] },
      "success": { "effects": { "score": -4, "popularity": 8, "standing": -6, "energie": 1 },
        "result": { "fr": "Vos quarante restent chez vous et labourent votre ville pendant que la présidentielle se joue ailleurs. Vous perdrez la présidentielle et vous garderez la ville.",
                    "en": "Your forty stay put and work your town while the presidential is decided elsewhere. You will lose the presidential and keep the town." } },
      "failure": { "effects": { "score": -5, "standing": -13, "reputation": -1,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "Le siège tient la liste des fédérations qui ont envoyé quelqu'un. La vôtre n'y est pas, et cette liste ressortira à chaque investiture pendant dix ans.",
                    "en": "Headquarters keeps the list of federations that sent somebody. Yours is not on it, and that list will resurface at every nomination for ten years." } } }
  ]
},

{
  "id": "sup_sondage_teste",
  "when": { "minPopularity": 48 },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "Un institut a testé votre nom à la place de celui du candidat, à la demande de quelqu'un qui n'est pas vous. Vous êtes devant de quatre points. Le chiffre n'est pas publié, il circule, et trois personnes vous ont appelé pour vous le lire.",
    "en": "A polling firm has tested your name in place of the candidate's, at the request of somebody who is not you. You are four points ahead. The number is unpublished, it is circulating, and three people have called to read it out to you."
  },
  "choices": [
    { "label": { "fr": "Le faire fuiter", "en": "Leak it" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 },
                                                 { "when": { "trait": ["teflon"] }, "value": 0.15 } ] },
      "success": { "effects": { "score": -5, "notoriete": 3, "popularity": 7, "standing": -7,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "Le chiffre sort un mardi et occupe deux jours d'antenne. Vous n'avez rien dit, rien démenti, rien confirmé, et tout le monde a compris que la question existait.",
                    "en": "The number comes out on a Tuesday and fills two days of airtime. You said nothing, denied nothing, confirmed nothing, and everybody understood that the question existed." } },
      "failure": { "effects": { "score": -7, "standing": -16, "reputation": -2, "strike": "traitre",
                                "landscape": { "self": -0.9 } },
        "result": { "fr": "L'institut précise qui a commandé le test. Ce n'était pas vous, mais c'était votre directeur de cabinet, ce qui, dans ce métier, est la même phrase.",
                    "en": "The polling firm names who commissioned the test. It was not you, it was your chief of staff, which in this trade is the same sentence." } } },
    { "label": { "fr": "L'apporter vous-même au candidat", "en": "Take it to the candidate yourself" },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "score": 5, "standing": 13, "credibilite": 1, "reseau": 1 },
        "result": { "fr": "Vous posez la feuille sur son bureau et vous dites que vous ne l'avez pas demandée. Il vous croit, ce qui est déjà rare, et il s'en souviendra, ce qui l'est davantage.",
                    "en": "You put the sheet on his desk and say you did not ask for it. He believes you, which is already rare, and he will remember it, which is rarer still." } },
      "failure": { "effects": { "score": 2, "standing": -4, "popularity": -2 },
        "result": { "fr": "Il regarde la feuille, puis vous, puis la feuille. Il vous remercie d'être venu, et vous comprenez en sortant que vous venez de lui apprendre quelque chose qu'il ignorait.",
                    "en": "He looks at the sheet, then at you, then at the sheet. He thanks you for coming, and on the way out you realise you have just told him something he did not know." } } },
    { "label": { "fr": "Ne rien faire du tout", "en": "Do nothing at all" },
      "roll": { "chance": 0.65, "chanceBonus": [ { "when": { "personality": ["principled"] }, "value": 0.2 } ] },
      "success": { "effects": { "score": 3, "standing": 5, "sangfroid": 1 },
        "result": { "fr": "Le chiffre meurt de sa belle mort en dix jours, comme la plupart des chiffres. Vous êtes le seul de cette campagne à ne pas avoir téléphoné à un journaliste.",
                    "en": "The number dies of natural causes within ten days, like most numbers. You are the only person in this campaign who did not ring a reporter." } },
      "failure": { "effects": { "score": -2, "standing": -5, "popularity": -3 },
        "result": { "fr": "Quelqu'un d'autre le fait fuiter, et l'entourage du candidat décide que c'était vous parce que c'est plus simple. On ne vous demandera pas votre version.",
                    "en": "Somebody else leaks it, and the candidate's people decide it was you because that is simpler. Nobody will ask for your version." } } }
  ]
},

{
  "id": "sup_promesse_poste",
  "moment": 2,
  "when": { "minStanding": 45, "position": ["maire", "euro", "depute", "ministre", "chef"] },
  "tag": { "fr": "Campagne", "en": "The campaign" },
  "text": {
    "fr": "L'entourage du candidat vous fait venir un dimanche soir. On vous décrit un ministère, on ne le nomme pas, et on vous demande en échange d'avaler publiquement une mesure que vous combattez depuis douze ans.",
    "en": "The candidate's people call you in on a Sunday evening. A ministry is described but not named, and in exchange you are asked to swallow, publicly, a policy you have opposed for twelve years."
  },
  "choices": [
    { "label": { "fr": "Accepter et l'avaler proprement", "en": "Accept, and swallow it cleanly" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "score": 5, "standing": 9, "reseau": 2, "popularity": -4, "reputation": -1 },
        "result": { "fr": "Vous expliquez en trois minutes que la mesure a évolué, que le contexte n'est plus le même, et que vous n'avez jamais dit le contraire. Personne n'y croit et tout le monde note que c'est bien fait.",
                    "en": "You explain in three minutes that the policy has evolved, that the context has changed, and that you never said otherwise. Nobody believes it and everybody notes that it was well done." } },
      "failure": { "effects": { "score": -3, "standing": 3, "popularity": -10, "credibilite": -2,
                                "strike": "menteur" },
        "result": { "fr": "On ressort la vidéo de 2019 en split-screen dès le lendemain matin. Vous y dites exactement le contraire, avec le même costume et beaucoup plus de conviction.",
                    "en": "The 2019 clip is up in split-screen by the next morning. In it you say exactly the opposite, in the same suit and with a great deal more conviction." } } },
    { "label": { "fr": "Accepter, et ne rien dire du tout", "en": "Accept, and say nothing at all" },
      "when": { "personality": ["calculating"] },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "score": 2, "standing": 7, "reseau": 2, "credibilite": 1 },
        "result": { "fr": "Vous serrez la main, vous ne montez sur aucun plateau, et vous laissez le silence faire le travail. Un engagement qu'on ne prononce pas ne se rejoue jamais en boucle.",
                    "en": "You shake hands, you go on no programme, and you let the silence do the work. A commitment you never say out loud is never replayed on a loop." } },
      "failure": { "effects": { "score": -2, "standing": -6, "reputation": -1 },
        "result": { "fr": "Votre silence est lu comme un désaccord par les uns et comme un accord par les autres, et vous vous retrouvez à devoir démentir les deux.",
                    "en": "Your silence is read as disagreement by one side and agreement by the other, and you end up having to deny both." } } },
    { "label": { "fr": "Refuser et le dire à la sortie", "en": "Refuse, and say so on the way out" },
      "roll": { "base": 15, "stat": "reputation", "plus": { "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "score": -2, "popularity": 11, "standing": -8, "credibilite": 2,
                                "reputation": 2 },
        "result": { "fr": "Vous dites devant deux caméras qu'on vous a proposé quelque chose et que vous avez dit non, sans préciser quoi. C'est la phrase la plus rentable de votre campagne, et ce n'est même pas la vôtre.",
                    "en": "You say in front of two cameras that you were offered something and said no, without saying what. It is the most profitable sentence of your campaign, and it is not even your campaign." } },
      "failure": { "effects": { "score": -4, "standing": -11, "popularity": -2, "reputation": 1,
                                "landscape": { "self": -0.4 } },
        "result": { "fr": "L'entourage dément avoir proposé quoi que ce soit, et il le dément mieux que vous ne l'affirmez. Vous passez pour quelqu'un qui invente des ministères.",
                    "en": "The candidate's people deny having offered anything, and they deny it better than you assert it. You come across as somebody who invents ministries." } } },
    { "label": { "fr": "Demander le nom du ministère avant de répondre", "en": "Ask which ministry, before answering" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "standing": 0.05, "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 4, "standing": 12, "reseau": 2, "notoriete": 1 },
        "result": { "fr": "On vous le nomme, ce qui n'arrive presque jamais, et cela veut dire qu'on a besoin de vous davantage qu'on ne le disait. Le reste de la conversation se passe autrement.",
                    "en": "They name it, which almost never happens, and it means they need you more than they were letting on. The rest of the conversation goes differently." } },
      "failure": { "effects": { "score": -1, "standing": -7, "reputation": -1, "energie": -1 },
        "result": { "fr": "On ne vous le nomme pas, on vous raccompagne, et on prévient trois personnes le soir même que vous marchandiez. Dans ce métier, marchander est une réputation.",
                    "en": "They do not name it, they show you out, and by the evening three people have been told you were haggling. In this trade, haggling is a reputation." } } }
  ]
},

{
  "id": "sup_naufrage",
  "moment": 1,
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "Les derniers sondages sont mauvais et tout le monde le sait, à commencer par les journalistes qui vous appellent pour préparer les papiers de lundi. On ne vous demande plus ce que vous ferez si vous gagnez.",
    "en": "The final polls are bad and everyone knows it, starting with the reporters ringing to prepare Monday's pieces. Nobody asks any more what you will do if you win."
  },
  "choices": [
    { "label": { "fr": "Tenir jusqu'au bout comme si de rien n'était", "en": "Hold the line to the end as if nothing were happening" },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "energie": 0.3 }, "dice": 16 },
      "success": { "effects": { "score": 4, "standing": 10, "credibilite": 2, "energie": -2,
                                "landscape": { "self": 0.5 } },
        "result": { "fr": "Vous faites les dix derniers déplacements, avec le même discours et la même énergie devant des salles qui savent. Le score sera meilleur que prévu et personne ne saura pourquoi.",
                    "en": "You do the last ten stops, same speech, same energy, in front of halls that already know. The score will be better than forecast and nobody will know why." } },
      "failure": { "effects": { "score": 1, "standing": 3, "energie": -4, "popularity": -3 },
        "result": { "fr": "Vous tenez, mais cela se voit que vous tenez. Une photo de vous seul dans une salle des fêtes à moitié vide fera la une de trois quotidiens.",
                    "en": "You hold, but it shows that you are holding. A photograph of you alone in a half-empty village hall makes the front page of three papers." } } },
    { "label": { "fr": "Commencer à préparer l'après", "en": "Start preparing for the aftermath" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 },
                                                { "when": { "minStanding": 60 }, "value": 0.15 } ] },
      "success": { "effects": { "score": -3, "standing": 9, "reseau": 3, "credibilite": 1 },
        "result": { "fr": "Pendant que les autres finissent la campagne, vous appelez les quinze personnes qui compteront le lundi matin. Le congrès d'après se joue exactement cette semaine-là.",
                    "en": "While the others finish the campaign, you ring the fifteen people who will matter on Monday morning. The next party conference is decided precisely that week." } },
      "failure": { "effects": { "score": -5, "standing": -12, "reputation": -2,
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Deux de vos quinze appels sont racontés au candidat avant le vote. Organiser sa succession pendant qu'il fait campagne est le seul crime que le parti punit vraiment.",
                    "en": "Two of your fifteen calls are reported to the candidate before the vote. Organising his succession while he is still campaigning is the one crime the party actually punishes." } } },
    { "label": { "fr": "Dire tout haut que c'est perdu", "en": "Say out loud that it is lost" },
      "when": { "personality": ["principled", "provocative"] },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "minPopularity": 62 }, "value": 0.25 } ] },
      "success": { "effects": { "score": -4, "popularity": 12, "notoriete": 2, "standing": -10,
                                "reputation": 2 },
        "result": { "fr": "Vous dites en direct ce que quinze millions de personnes pensent depuis huit jours. Le pays appelle cela de la franchise, votre parti appelle cela autrement, et le mot restera attaché à vous.",
                    "en": "You say live what fifteen million people have been thinking for a week. The country calls it honesty, your party calls it something else, and the word will stick to you." } },
      "failure": { "effects": { "score": -7, "standing": -17, "popularity": -4, "strike": "traitre",
                                "landscape": { "self": -1.0 } },
        "result": { "fr": "Votre phrase devient l'explication officielle de la défaite avant même qu'elle ait lieu. On vous la citera à chaque bilan, à chaque congrès, à chaque investiture.",
                    "en": "Your sentence becomes the official explanation of the defeat before the defeat has even happened. It will be quoted at every post-mortem, every conference, every nomination." } } }
  ]
}

];
