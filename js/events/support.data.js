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
  "when": { "minPopularity": 52 },
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
}

];
