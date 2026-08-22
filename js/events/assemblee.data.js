/*
 * President Material — L'ASSEMBLÉE.
 * ============================================================================
 *
 * Syntaxe JSON stricte : tout ce qui suit la première ligne est du JSON
 * valide. Le schéma complet est dans js/events/_assemble.data.js.
 *
 * POURQUOI CE FICHIER EXISTE.
 *
 * Le moteur savait tout de l'Assemblée : cinq cent soixante-dix-sept sièges
 * répartis le soir de chaque législative, un bloc qui soutient le
 * gouvernement, une majorité absolue, relative ou inexistante, une cote du
 * pouvoir qui monte et qui descend. Il en faisait un joli hémicycle dans le
 * panneau de droite, et à peu près rien d'autre : cinq événements sur deux
 * cent onze lisaient l'état de la majorité, et pas un seul ne demandait au
 * joueur ce qu'il comptait en faire.
 *
 * Or c'est là que se joue une carrière française. On ne fait pas la même
 * politique selon qu'on tient l'Assemblée, qu'on la négocie texte par texte,
 * qu'on la regarde d'en face en étant le premier groupe, ou qu'on y compte
 * dix-sept députés. Et surtout : quand une législative ne donne de majorité
 * à personne, quelqu'un doit décider s'il fait alliance, avec qui, et à quel
 * prix. Ce quelqu'un, c'est un chef de parti, et le jeu ne le lui demandait
 * jamais.
 *
 * LA MATRICE. Les scènes couvrent tous les cas de figure, parce que le
 * silence sur l'un d'eux se voit tout de suite :
 *
 *              votre camp a l'Élysée        votre camp ne l'a pas
 *   absolue    on tient tout                on est le premier groupe d'en face
 *   relative   on négocie chaque texte      on est le pivot : on se vend
 *   aucune     on survit par la division    on est un groupe qui compte peu
 *   + allié    l'allié présente sa note     on soutient sans rien recevoir
 *
 * LA CHAÎNE DE L'ALLIANCE. Un pacte ne se signe pas en une carte. Il
 * s'ouvre par une offre, il se paie en programme, il se compte en postes, il
 * se casse sur un texte, et il finit toujours par se casser. Les cinq temps
 * sont réservés aux chaînes ("weight": 0) et tombent avec leurs délais.
 *
 * LE CUMUL. La direction du parti n'est plus une fonction : "chef" dans une
 * liste de positions veut dire « dirige son parti », quel que soit le mandat
 * tenu à côté. Les scènes d'ici en jouent : un chef de parti qui est aussi
 * député a une circonscription à défendre, et c'est très exactement ce qui
 * rend le personnage jouable.
 * ============================================================================
 */
const EV_assemblee = [


/* ==========================================================================
   1. LE CHEF DE PARTI ET SA MAJORITÉ (le camp du joueur gouverne)
   ========================================================================== */

{
  "id": "chef_majorite_absolue",
  "weight": 5,
  "when": { "partyLead": true, "ruling": true, "majority": "absolue" },
  "tag": { "fr": "La majorité", "en": "The majority" },
  "text": {
    "fr": "Votre camp a l'Élysée et la majorité absolue, et c'est vous qui tenez le parti. Le premier conseil de groupe est dans une heure : deux cents personnes qui vous doivent leur circonscription, et qui vont passer cinq ans à se demander si elles vous la doivent vraiment.",
    "en": "Your camp holds the presidency and an absolute majority, and you run the party. The first group meeting is in an hour: two hundred people who owe you their seats, and who will spend five years wondering whether they really do."
  },
  "choices": [
    { "label": { "fr": "Verrouiller le groupe, vote par vote", "en": "Lock the group down, vote by vote" },
      "effects": { "standing": 9, "approval": 5, "reputation": -2, "popularity": -5, "credibilite": 1, "energie": -2 },
      "result": { "fr": "Personne ne s'abstient, personne ne parle à la presse, et personne n'a rien appris. Vous aurez la loi et vous n'aurez pas les gens : au troisième budget, cela commencera à se voir.",
                  "en": "Nobody abstains, nobody talks to the press, and nobody has learned anything. You will get the bills and you will not get the people: by the third budget it will start to show." } },
    { "label": { "fr": "Laisser passer des amendements de l'opposition sur les textes mineurs", "en": "Let opposition amendments through on the minor bills" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "credibilite": 0.45, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "reputation": 2, "credibilite": 2, "standing": -4 },
        "result": { "fr": "Trois amendements adoptés, dont un qui ne change rien et deux qui améliorent le texte. Le pays retient qu'on peut vous parler, votre groupe retient que vous cédez, et les deux ont raison.",
                    "en": "Three amendments carried, one that changes nothing and two that improve the bill. The country concludes that you can be talked to, your group concludes that you give ground, and both are right." } },
      "failure": { "effects": { "standing": -9, "approval": -5, "credibilite": -1 },
        "result": { "fr": "L'opposition prend le geste pour une faiblesse et dépose quatre cents amendements le lendemain. Votre groupe ne dit rien et retient tout.",
                    "en": "The opposition reads the gesture as weakness and tables four hundred amendments the next morning. Your group says nothing and remembers everything." } } },
    { "label": { "fr": "Faire passer tout le programme, tout de suite", "en": "Push the entire platform through, immediately" },
      "effects": { "standing": 7, "credibilite": 2, "landscape": { "self": 1.4 }, "approval": -8, "popularity": -6, "energie": -3 },
      "result": { "fr": "Dix-huit mois de textes en un an. On vous reprochera l'essoufflement, jamais le courage, et une majorité absolue ne se représente pas deux fois dans une vie.",
                  "en": "Eighteen months of legislation in a year. They will blame you for the exhaustion, never for the nerve, and an absolute majority does not come round twice in a lifetime." } }
  ]
},


{
  "id": "chef_majorite_relative",
  "weight": 6,
  "cast": "neighbour",
  "when": { "partyLead": true, "ruling": true, "majority": ["relative", "aucune"], "allied": false },
  "tag": { "fr": "Une majorité à trouver", "en": "A majority to find" },
  "text": {
    "fr": "Le président est du vôtre, l'Assemblée ne l'est pas. Chaque texte se comptera à la voix près pendant cinq ans, et {rival} le sait avant vous : {il} dirige le seul groupe qui puisse vous donner une majorité, et {il} n'a pas encore dit son prix.",
    "en": "The president is one of yours, the Assembly is not. Every bill will be counted vote by vote for five years, and {rival} knows it before you do: {he} runs the only group that can give you a majority, and {he} has not yet named a price."
  },
  "choices": [
    { "label": { "fr": "Négocier un accord de gouvernement", "en": "Negotiate a coalition agreement" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "eloquence": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "alliance": "scene", "standing": 6, "approval": 7, "credibilite": 2,
                                "landscape": { "self": 0.8, "ally": 0.8 }, "chain": "alliance_programme" },
        "result": { "fr": "Quatre nuits de négociation et un texte de onze pages que personne ne lira jamais en entier. Vous avez une majorité et vous avez un associé, ce qui est la même chose vue de deux endroits différents.",
                    "en": "Four nights of negotiation and an eleven-page document nobody will ever read in full. You have a majority and you have a partner, which is the same thing seen from two different places." } },
      "failure": { "effects": { "standing": -7, "approval": -5, "popularity": -3, "energie": -2 },
        "result": { "fr": "{Il} sort de la salle à deux heures du matin en expliquant aux caméras qu'{il} refuse de servir de roue de secours. La phrase est bonne, elle a été écrite avant la réunion.",
                    "en": "{He} leaves the room at two in the morning and tells the cameras {he} refuses to be anybody's spare wheel. It is a good line, and it was written before the meeting." } } },
    { "label": { "fr": "Gouverner texte par texte, sans rien signer", "en": "Govern bill by bill, signing nothing" },
      "effects": { "sangfroid": 1, "credibilite": 1, "reseau": 1, "energie": -3, "approval": -3, "chain": "assemblee_texte_par_texte" },
      "result": { "fr": "Pas d'accord, pas de programme commun, pas de photo. Vous irez chercher les voix une par une, chaque semaine, et personne ne pourra vous reprocher d'avoir vendu quoi que ce soit. Cela s'appelle tenir, et cela s'use.",
                  "en": "No deal, no joint platform, no photograph. You will go and find the votes one at a time, every week, and nobody will be able to accuse you of selling anything. It is called holding on, and it wears out." } },
    { "label": { "fr": "Demander au président de dissoudre", "en": "Ask the president to dissolve" },
      "roll": { "base": 16, "stat": "credibilite", "plus": { "charisme": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "dissolve": true, "notoriete": 2, "popularity": 4, "standing": 5, "energie": -2 },
        "result": { "fr": "Le président vous écoute vingt minutes et annonce la dissolution le soir même. Vous venez de rendre la parole au pays sans savoir ce qu'il en fera, et vous n'avez plus que six semaines pour l'apprendre.",
                    "en": "The president hears you out for twenty minutes and announces the dissolution that evening. You have just handed the country back the floor without knowing what it will do with it, and you have six weeks to find out." } },
      "failure": { "effects": { "standing": -9, "approval": -6, "credibilite": -2, "reputation": -1 },
        "result": { "fr": "Le président vous répond que la dissolution est son domaine réservé et qu'il vous remercie de votre analyse. Le mot analyse est prononcé de la façon dont on prononce le mot bavardage.",
                    "en": "The president replies that dissolution is his own preserve and thanks you for your analysis. The word analysis is delivered the way one delivers the word chatter." } } }
  ]
},


{
  "id": "chef_sans_majorite",
  "weight": 4,
  "when": { "partyLead": true, "ruling": true, "majority": "aucune", "minTurn": 8 },
  "tag": { "fr": "Le pouvoir sans les voix", "en": "Power without the votes" },
  "text": {
    "fr": "Votre camp gouverne et n'est même pas le premier groupe de l'Assemblée. Le gouvernement tient parce que ceux d'en face ne se supportent pas entre eux, ce qui est une majorité qu'aucun manuel ne décrit et sur laquelle personne ne peut compter deux mois de suite.",
    "en": "Your camp governs and is not even the largest group in the Assembly. The government survives because the people opposite cannot stand each other, which is a majority no textbook describes and nobody can rely on for two months running."
  },
  "choices": [
    { "label": { "fr": "Entretenir la division d'en face, discrètement", "en": "Keep the other side divided, quietly" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 7, "approval": 5, "reputation": -2, "energie": -2 },
        "result": { "fr": "Deux déjeuners, une indiscrétion bien placée, et les deux groupes d'en face passent le mois à s'expliquer entre eux plutôt qu'à vous censurer. Aucune de ces trois choses ne figurera jamais nulle part.",
                    "en": "Two lunches, one well-placed leak, and the two groups opposite spend the month explaining themselves to each other instead of censuring you. None of those three things will ever appear anywhere." } },
      "failure": { "effects": { "standing": -6, "approval": -7, "reputation": -3, "strike": "casserole" },
        "result": { "fr": "L'indiscrétion remonte jusqu'à vous en quarante-huit heures. Ce n'est pas la manœuvre qu'on vous reproche, c'est de l'avoir ratée, et les deux camps d'en face se parlent maintenant très bien.",
                    "en": "The leak is traced back to you within forty-eight hours. It is not the manoeuvre they hold against you, it is having botched it, and the two groups opposite are now getting on splendidly." } } },
    { "label": { "fr": "Proposer un pacte de non-censure, publiquement", "en": "Publicly offer a no-confidence truce" },
      "effects": { "reputation": 3, "credibilite": 2, "approval": 8, "popularity": 3, "standing": -8 },
      "result": { "fr": "Vous proposez d'échanger la stabilité contre des concessions, à la télévision, à vingt heures. Le pays trouve cela raisonnable ; votre propre groupe apprend en même temps que lui qu'il va falloir céder.",
                  "en": "You offer to trade stability for concessions, on television, at eight in the evening. The country finds it reasonable; your own group learns at the same moment as the country that it is going to have to give ground." } },
    { "label": { "fr": "Gouverner comme si vous aviez la majorité", "en": "Govern as if you had a majority" },
      "effects": { "standing": 6, "credibilite": -1, "approval": -9, "popularity": -4, "energie": -2, "landscape": { "self": -0.8 } },
      "result": { "fr": "Vous faites passer les textes par tous les moyens que la Constitution autorise, et il y en a beaucoup. Chacun est un aveu de plus que vous n'avez pas les voix, et le pays sait compter.",
                  "en": "You push the bills through by every means the constitution allows, and there are many. Each one is another admission that you do not have the votes, and the country can count." } }
  ]
},


{
  "id": "chef_allie_exigeant",
  "weight": 4,
  "when": { "partyLead": true, "ruling": true, "allied": true, "minTurn": 10 },
  "tag": { "fr": "L'allié présente sa note", "en": "The ally sends the bill" },
  "text": {
    "fr": "Votre allié a voté tous vos textes depuis deux ans et il vient de s'en apercevoir. Il demande un ministère de plein exercice, trois circonscriptions aux prochaines législatives, et que vous cessiez de parler de votre majorité au singulier.",
    "en": "Your ally has voted for every one of your bills for two years and has just noticed. It wants a full ministry, three constituencies at the next legislative elections, and for you to stop referring to your majority in the singular."
  },
  "choices": [
    { "label": { "fr": "Payer, et payer vite", "en": "Pay, and pay quickly" },
      "effects": { "standing": -6, "approval": 6, "landscape": { "self": -1.2, "ally": 1.4 }, "reseau": 2, "credibilite": 1 },
      "result": { "fr": "Ils ont leur ministère et leurs circonscriptions, et vous avez cinq ans de tranquillité. Ce que vous avez donné ne se reprend pas : à la prochaine législative, trois de vos sortants apprendront qu'ils ne se représentent pas.",
                  "en": "They get their ministry and their constituencies, and you get five years of quiet. What you have given cannot be taken back: at the next election, three of your own members will learn that they are not standing again." } },
    { "label": { "fr": "Rappeler qui a gagné la présidentielle", "en": "Remind them who won the presidential election" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "credibilite": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 9, "credibilite": 2, "landscape": { "ally": -1 }, "approval": -3 },
        "result": { "fr": "Vous leur rappelez que sans vous ils n'auraient ni ministres ni caméras, et ils repartent avec un secrétariat d'État. Votre groupe applaudit ; l'allié compte les mois.",
                    "en": "You remind them that without you they would have neither ministers nor cameras, and they leave with a junior post. Your group applauds; the ally counts the months." } },
      "failure": { "effects": { "alliance": null, "standing": -5, "approval": -10, "landscape": { "self": -1.4 }, "popularity": -3 },
        "result": { "fr": "Ils quittent la coalition dans la nuit et l'annoncent avant vous. La majorité que vous aviez n'existe plus, et vous êtes celui qui l'a perdue en ayant raison.",
                    "en": "They leave the coalition overnight and announce it before you do. The majority you had no longer exists, and you are the one who lost it while being right." } } },
    { "label": { "fr": "Céder sur les postes, jamais sur les circonscriptions", "en": "Give on the posts, never on the seats" },
      "effects": { "reseau": 1, "standing": 3, "approval": 3, "credibilite": 1, "energie": -2, "chain": "alliance_epreuve" },
      "result": { "fr": "Un ministère se rend, une circonscription ne se rend pas : la première est prêtée pour trois ans, la seconde est perdue pour vingt. Ils acceptent en disant qu'ils s'en souviendront, et ils s'en souviendront.",
                  "en": "A ministry can be handed over, a constituency cannot: the first is lent for three years, the second is gone for twenty. They accept, saying they will remember it, and they will." } }
  ]
},


/* ==========================================================================
   2. LE CHEF DE PARTI EN FACE (le camp du joueur ne gouverne pas)
   ========================================================================== */

{
  "id": "chef_pivot_appel",
  "weight": 7,
  "cast": "ruling",
  "when": { "partyLead": true, "ruling": false, "pivot": true, "allied": false },
  "tag": { "fr": "L'appel du dimanche soir", "en": "The Sunday evening call" },
  "text": {
    "fr": "Les législatives n'ont donné de majorité à personne et l'addition est vite faite : sans vos députés, le gouvernement ne fait voter ni un budget, ni une loi, ni l'heure qu'il est. {rival} vous appelle à vingt-deux heures. C'est la première fois.",
    "en": "The legislative elections gave nobody a majority, and the arithmetic is quickly done: without your members the government cannot pass a budget, a bill, or the time of day. {rival} calls you at ten in the evening. It is the first time."
  },
  "choices": [
    { "label": { "fr": "Entrer au gouvernement, et négocier les postes", "en": "Join the government, and negotiate the posts" },
      "roll": { "base": 14, "stat": "reseau", "plus": { "credibilite": 0.5, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "alliance": "ruling", "standing": 8, "credibilite": 2, "popularity": -5,
                                "landscape": { "self": -0.8 }, "chain": "alliance_postes" },
        "result": { "fr": "L'accord est annoncé le mardi, et vos militants l'apprennent par la radio comme tout le monde. Vous entrez dans une majorité que vous combattiez il y a quinze jours ; c'est le prix des places et il se paie d'avance.",
                    "en": "The deal is announced on Tuesday, and your own members hear about it on the radio like everybody else. You are entering a majority you were fighting a fortnight ago; that is the price of office and it is paid up front." } },
      "failure": { "effects": { "standing": -9, "popularity": -5, "reputation": -2, "credibilite": -1 },
        "result": { "fr": "La négociation fuite avant d'aboutir. Vous n'avez ni les postes ni l'honneur d'avoir refusé, ce qui est très exactement la pire des trois issues possibles.",
                    "en": "The negotiation leaks before it concludes. You have neither the posts nor the credit for having refused, which is precisely the worst of the three available outcomes." } } },
    { "label": { "fr": "Soutenir sans participer, texte par texte", "en": "Support without joining, bill by bill" },
      "effects": { "sangfroid": 1, "credibilite": 2, "standing": 4, "approval": 5, "popularity": -1, "chain": "alliance_a_la_carte" },
      "result": { "fr": "Pas de ministres, pas de photo de famille, pas de programme commun. Vous vendrez chaque vote séparément, et le jour où vous cesserez de vendre, tout le monde le saura dans l'heure.",
                  "en": "No ministers, no family photograph, no joint platform. You will sell each vote separately, and the day you stop selling, everybody will know within the hour." } },
    { "label": { "fr": "Refuser, et le dire à la sortie", "en": "Refuse, and say so on the way out" },
      "effects": { "popularity": 10, "notoriete": 2, "reputation": 2, "standing": -5, "credibilite": -1,
                   "landscape": { "self": 1.6, "ruling": -1.2 }, "approval": -5 },
      "result": { "fr": "Vous sortez sur le perron et vous expliquez en quatre phrases qu'on ne vous a pas élu pour sauver les autres. Vos militants pleurent de joie et vous venez de renoncer à des ministères que vous ne reverrez peut-être jamais.",
                  "en": "You come out onto the steps and explain in four sentences that you were not elected to save other people. Your members weep with joy and you have just turned down ministries you may never see again." } },
    { "label": { "fr": "Faire monter les enchères avant de répondre", "en": "Drive the price up before answering" },
      "when": { "minStanding": 55 },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.5, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "alliance": "ruling", "standing": 11, "credibilite": 3, "popularity": -4,
                                "chain": ["alliance_postes", "alliance_epreuve"] },
        "result": { "fr": "Vous laissez passer huit jours sans rien dire. Le huitième, l'offre a doublé et personne d'autre ne pouvait obtenir cela, parce que personne d'autre n'aurait tenu huit jours.",
                    "en": "You let eight days pass without saying anything. On the eighth the offer has doubled, and nobody else could have got that, because nobody else would have lasted eight days." } },
      "failure": { "effects": { "standing": -11, "popularity": -6, "credibilite": -2, "landscape": { "self": -1 } },
        "result": { "fr": "Le gouvernement trouve ses voix ailleurs pendant que vous faites durer. On ne vous rappellera pas, et votre groupe a compris ce qu'il valait exactement.",
                    "en": "The government finds its votes elsewhere while you are drawing it out. They will not call again, and your group has learned exactly what it is worth." } } }
  ]
},


{
  "id": "chef_premier_groupe",
  "weight": 5,
  "when": { "partyLead": true, "ruling": false, "firstGroup": true, "minTurn": 8 },
  "tag": { "fr": "Le premier groupe", "en": "The largest group" },
  "text": {
    "fr": "Votre parti est le premier groupe de l'Assemblée et ne gouverne pas. C'est la place la plus inconfortable de la Cinquième République : on vous demande des comptes sur un pouvoir que vous n'avez pas, et on ne vous laisse rien décider de ce dont on vous demande des comptes.",
    "en": "Your party is the largest group in the Assembly and does not govern. It is the most uncomfortable place in the Fifth Republic: you are held to account for power you do not hold, and allowed to decide nothing about what you are held to account for."
  },
  "choices": [
    { "label": { "fr": "Gouverner à blanc : sortir un contre-budget complet", "en": "Govern in the abstract: publish a full alternative budget" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "eloquence": 0.4, "energie": 0.3 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "popularity": 7, "standing": 5, "energie": -3, "landscape": { "self": 1.2 } },
        "result": { "fr": "Trois cents pages chiffrées que personne n'attendait de vous. Deux économistes disent que cela tient, ce qui suffit : à partir de ce jour, on vous interroge comme quelqu'un qui pourrait gouverner.",
                    "en": "Three hundred costed pages nobody expected from you. Two economists say the numbers hold, which is enough: from that day on you are interviewed as somebody who might govern." } },
      "failure": { "effects": { "credibilite": -2, "popularity": -5, "standing": -4, "energie": -3 },
        "result": { "fr": "Le chiffrage est démonté en trois jours par un institut dont vous n'aviez jamais entendu parler. On ne retiendra pas le contre-budget, on retiendra l'écart de vingt milliards.",
                    "en": "The costing is dismantled in three days by an institute you had never heard of. Nobody will remember the alternative budget; everybody will remember the twenty-billion gap." } } },
    { "label": { "fr": "Occuper l'hémicycle : obstruction sur tous les textes", "en": "Occupy the chamber: obstruct every bill" },
      "effects": { "notoriete": 3, "standing": 7, "approval": -7, "popularity": -6, "credibilite": -2, "energie": -3 },
      "result": { "fr": "Neuf mille amendements et trois nuits blanches par semaine. Vos militants adorent, le pays trouve que cela ressemble à une cour de récréation, et il a raison des deux côtés à la fois.",
                  "en": "Nine thousand amendments and three all-nighters a week. Your members love it, the country thinks it looks like a playground, and the country is right on both counts." } },
    { "label": { "fr": "Voter les textes que vous approuvez, et le dire", "en": "Vote for the bills you agree with, and say so" },
      "effects": { "reputation": 3, "credibilite": 2, "popularity": 5, "standing": -9, "approval": 4 },
      "result": { "fr": "Vous votez trois textes du gouvernement en six mois. Le pays appelle cela de la responsabilité, votre parti appelle cela autrement, et la deuxième réunion de groupe dure quatre heures.",
                  "en": "You vote for three government bills in six months. The country calls it responsibility, your party calls it something else, and the second group meeting runs to four hours." } }
  ]
},


{
  "id": "chef_petit_groupe",
  "weight": 5,
  "when": { "partyLead": true, "ruling": false, "maxSeats": 32, "minTurn": 6 },
  "tag": { "fr": "Dix-sept députés", "en": "Seventeen members" },
  "text": {
    "fr": "Votre groupe tient dans un autocar. Vous avez deux minutes de temps de parole par séance, une place en fond d'hémicycle, et la certitude qu'aucun de vos amendements ne passera jamais sans l'accord de quelqu'un d'autre.",
    "en": "Your entire group fits in a coach. You get two minutes of speaking time per sitting, a seat at the back of the chamber, and the certainty that none of your amendments will ever pass without somebody else's agreement."
  },
  "choices": [
    { "label": { "fr": "Tout miser sur les deux minutes", "en": "Put everything into the two minutes" },
      "roll": { "base": 13, "stat": "eloquence", "plus": { "charisme": 0.5 }, "dice": 16 },
      "success": { "effects": { "eloquence": 1, "notoriete": 3, "popularity": 9, "landscape": { "self": 1.2 } },
        "result": { "fr": "Une minute quarante reprise en boucle pendant deux jours. C'est ainsi que les petits groupes existent : pas en votant, en étant regardés.",
                    "en": "One minute forty seconds replayed on a loop for two days. That is how small groups exist: not by voting, but by being watched." } },
      "failure": { "effects": { "popularity": -4, "notoriete": 1, "energie": -2 },
        "result": { "fr": "Vous parlez deux minutes devant onze personnes et une caméra fixe. La vidéo fait quatre cents vues, dont une centaine sont les vôtres.",
                    "en": "You speak for two minutes to eleven people and a fixed camera. The clip gets four hundred views, a hundred of them yours." } } },
    { "label": { "fr": "Échanger vos voix contre des amendements, sans état d'âme", "en": "Trade your votes for amendments, without sentiment" },
      "effects": { "reseau": 2, "standing": 6, "credibilite": 1, "popularity": -4, "reputation": -1 },
      "result": { "fr": "Onze amendements adoptés en un an, dont trois qui comptent vraiment. Personne ne saura jamais ce qu'ils ont coûté, et c'est précisément la condition pour qu'ils passent.",
                  "en": "Eleven amendments carried in a year, three of which genuinely matter. Nobody will ever know what they cost, and that is precisely the condition for them passing." } },
    { "label": { "fr": "Chercher à fusionner avec un groupe voisin", "en": "Try to merge with a neighbouring group" },
      "when": { "minStanding": 45 },
      "roll": { "base": 16, "stat": "reseau", "plus": { "charisme": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "alliance": "scene", "standing": 5, "credibilite": 2, "landscape": { "self": 1, "ally": 0.5 } },
        "result": { "fr": "Deux groupes qui n'existaient pas séparément en font un qui pèse. Il faudra six mois pour se mettre d'accord sur le nom, et personne ne se mettra jamais d'accord sur le reste.",
                    "en": "Two groups that did not exist separately make one that counts. It will take six months to agree on a name, and nobody will ever agree on anything else." } },
      "failure": { "effects": { "standing": -6, "popularity": -3, "landscape": { "self": -0.8 } },
        "result": { "fr": "Ils préfèrent rester petits et purs plutôt que moyens et mélangés. Vous ressortez avec la réputation d'avoir voulu vous vendre, et sans acheteur.",
                    "en": "They would rather stay small and pure than middling and mixed. You come out with a reputation for having tried to sell yourself, and no buyer." } } }
  ],
  "cast": "neighbour"
},


{
  "id": "chef_coalition_sans_rien",
  "weight": 4,
  "cast": "ruling",
  "when": { "partyLead": true, "ruling": false, "inCoalition": true, "minTurn": 8 },
  "tag": { "fr": "Le soutien sans contrepartie", "en": "Support without return" },
  "text": {
    "fr": "Votre groupe vote les textes du gouvernement depuis un an et n'a rien obtenu qu'on puisse montrer à un militant. {rival} vous remercie chaleureusement à chaque fois, ce qui commence à ressembler à une méthode.",
    "en": "Your group has been voting for the government's bills for a year and has obtained nothing you could show a party member. {rival} thanks you warmly every time, which is starting to look like a method."
  },
  "choices": [
    { "label": { "fr": "Réclamer un ministère, publiquement", "en": "Demand a ministry, in public" },
      "roll": { "base": 16, "stat": "credibilite", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "office": "ministre", "standing": 9, "credibilite": 2, "popularity": -4, "reputation": -1 },
        "result": { "fr": "On vous donne un ministère pour que vous vous taisiez, et vous vous taisez. Les deux parties savent exactement ce qui vient de se passer et aucune ne le dira jamais.",
                    "en": "They give you a ministry so that you will stop talking, and you stop talking. Both sides know exactly what has just happened and neither will ever say it." } },
      "failure": { "effects": { "standing": -8, "popularity": -4, "credibilite": -2, "approval": -3 },
        "result": { "fr": "Réclamer en public ce qu'on n'a pas obtenu en privé, c'est annoncer qu'on n'a pas obtenu. On vous répond par un communiqué de deux lignes qui vous remercie encore.",
                    "en": "Demanding in public what you failed to get in private is announcing that you failed. They answer with a two-line statement thanking you again." } } },
    { "label": { "fr": "Sortir de la coalition, en plein budget", "en": "Walk out of the coalition, mid-budget" },
      "effects": { "popularity": 8, "standing": -6, "approval": -11, "landscape": { "self": 1.4, "ruling": -1.2 }, "notoriete": 2 },
      "result": { "fr": "Vous partez au pire moment, ce qui est le seul moment où partir se remarque. Le gouvernement tiendra ou ne tiendra pas ; dans les deux cas, on saura que c'était vous.",
                  "en": "You leave at the worst possible moment, which is the only moment at which leaving is noticed. The government will hold or it will not; either way, everyone will know it was you." } },
    { "label": { "fr": "Continuer, et faire les comptes plus tard", "en": "Carry on, and settle up later" },
      "effects": { "sangfroid": 1, "reseau": 2, "credibilite": 1, "standing": 2, "popularity": -3 },
      "result": { "fr": "Vous votez encore, sans rien demander, en notant tout. Les dettes qu'on ne réclame pas sont les seules qui prennent de la valeur, et on ne les réclame qu'une fois.",
                  "en": "You vote again, ask for nothing, and write everything down. Debts you do not call in are the only ones that appreciate, and you call them in once." } }
  ]
},


{
  "id": "chef_investitures",
  "weight": 5,
  "cast": "camp_senior",
  "when": { "partyLead": true, "minTurn": 10 },
  "tag": { "fr": "Les investitures", "en": "The nominations" },
  "text": {
    "fr": "Les investitures pour les législatives se signent dans votre bureau, une par une, et c'est le seul pouvoir réel qu'on ait jamais dans un parti. {rival} attend dans le couloir avec une circonscription que vous vouliez donner à quelqu'un d'autre.",
    "en": "The nominations for the legislative elections are signed in your office, one by one, and it is the only real power anyone ever holds in a party. {rival} is waiting in the corridor over a constituency you wanted to give to somebody else."
  },
  "choices": [
    { "label": { "fr": "Placer vos fidèles partout où c'est possible", "en": "Place your loyalists wherever you can" },
      "effects": { "standing": 8, "reseau": 3, "reputation": -2, "popularity": -3, "landscape": { "self": -0.6 } },
      "result": { "fr": "Quarante circonscriptions à des gens qui vous doivent tout. C'est ainsi qu'on tient un parti pendant dix ans, et c'est ainsi qu'on perd les quarante circonscriptions au scrutin suivant.",
                  "en": "Forty constituencies to people who owe you everything. That is how you hold a party for ten years, and it is how you lose those forty seats at the next election." } },
    { "label": { "fr": "Investir les mieux placés, y compris vos adversaires internes", "en": "Nominate the strongest candidates, internal rivals included" },
      "effects": { "reputation": 3, "credibilite": 2, "landscape": { "self": 1.4 }, "standing": -5, "popularity": 3 },
      "result": { "fr": "Vous investissez {rival}, qui ne vous en sera pas reconnaissant{e} une seule seconde. Votre groupe sera plus grand et il vous appartiendra moins : les deux vont ensemble et on ne choisit qu'une fois.",
                  "en": "You nominate {rival}, who will not be grateful for a single second. Your group will be larger and it will belong to you less: the two go together and you choose only once." } },
    { "label": { "fr": "Garder trois circonscriptions en réserve pour négocier", "en": "Hold three seats back as bargaining chips" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "reseau": 0.5 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 6, "credibilite": 1, "reputation": -1 },
        "result": { "fr": "Trois circonscriptions non attribuées valent plus que trente attribuées : tant qu'elles sont libres, quinze personnes vous parlent tous les jours.",
                    "en": "Three unallocated constituencies are worth more than thirty allocated ones: while they remain free, fifteen people talk to you every day." } },
      "failure": { "effects": { "standing": -7, "reputation": -2, "landscape": { "self": -1 }, "energie": -1 },
        "result": { "fr": "La presse publie la liste des trois avant que vous ayez décidé. Vous n'avez plus de monnaie d'échange, seulement trois candidats désignés en catastrophe et vexés à vie.",
                    "en": "The press prints the list of three before you have decided. You no longer have bargaining chips, only three candidates picked in a panic and offended for life." } } }
  ]
},


{
  "id": "chef_cumul_circo",
  "weight": 4,
  "when": { "partyLead": true, "position": ["depute", "maire"], "minTurn": 12 },
  "tag": { "fr": "La maison et la circonscription", "en": "The house and the seat" },
  "text": {
    "fr": "Vous dirigez le parti et vous avez une circonscription à tenir, et les deux tombent le même mois. Votre directeur de campagne local vous rappelle que vous n'êtes pas venu depuis onze semaines ; votre directeur de cabinet vous rappelle que le congrès est dans quinze jours.",
    "en": "You run the party and you have a seat to hold, and both fall due in the same month. Your local agent points out that you have not been back for eleven weeks; your chief of staff points out that the congress is in a fortnight."
  },
  "choices": [
    { "label": { "fr": "La circonscription. On ne dirige rien quand on n'est plus élu", "en": "The constituency. You run nothing once you stop being elected" },
      "effects": { "popularity": 6, "reseau": 2, "energie": -2, "standing": -5 },
      "result": { "fr": "Trois semaines de marchés, de comices et de salles des fêtes. Votre base tient, et au siège on note que le patron a passé trois semaines ailleurs.",
                  "en": "Three weeks of markets, county shows and village halls. Your base holds, and at headquarters they note that the boss spent three weeks elsewhere." } },
    { "label": { "fr": "Le parti. La circonscription attendra, comme d'habitude", "en": "The party. The seat can wait, as usual" },
      "effects": { "standing": 8, "credibilite": 1, "popularity": -6, "energie": -2 },
      "result": { "fr": "Vous tenez la maison et vous perdez trois points chez vous. C'est l'arbitrage que fait tout chef de parti, et c'est celui qui les fait battre chez eux un dimanche sur dix.",
                  "en": "You keep the house and drop three points at home. It is the trade every party leader makes, and it is the one that gets them beaten at home one Sunday in ten." } },
    { "label": { "fr": "Les deux, et dormir dans le train", "en": "Both, and sleep on the train" },
      "roll": { "base": 15, "stat": "energie", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 5, "standing": 5, "energie": -4, "notoriete": 1 },
        "result": { "fr": "Onze allers-retours en trois semaines et pas une seule réunion manquée. Vous tenez tout, et vous ne tiendrez pas ce rythme deux ans.",
                    "en": "Eleven round trips in three weeks and not a single meeting missed. You hold everything together, and you will not hold this pace for two years." } },
      "failure": { "effects": { "energie": -5, "popularity": -4, "standing": -4, "sangfroid": -1 },
        "result": { "fr": "Vous arrivez en retard aux deux, et on vous filme en train de dormir dans une réunion publique. Ce n'est pas la fatigue qu'on retient, c'est l'image.",
                    "en": "You arrive late to both, and somebody films you asleep at a public meeting. It is not the exhaustion people remember, it is the picture." } } }
  ]
},


/* ==========================================================================
   3. LA CHAÎNE DE L'ALLIANCE
   --------------------------------------------------------------------------
   Un pacte ne se signe pas en une carte. Il s'écrit, il se paie en postes,
   il se casse sur un texte. Ces scènes sont réservées aux chaînes
   ("weight": 0) : elles ne sortent jamais au hasard.
   ========================================================================== */

{
  "id": "alliance_programme",
  "weight": 0,
  "delay": [1, 2],
  "cast": "neighbour",
  "tag": { "fr": "Le programme commun", "en": "The joint platform" },
  "text": {
    "fr": "Il faut maintenant écrire ce sur quoi vous êtes d'accord, et cela se compte en pages. Les négociateurs sont arrivés à trente-huit points sur quarante-deux ; les quatre qui restent sont exactement ceux pour lesquels les gens votent pour l'un ou pour l'autre.",
    "en": "Now you have to write down what you agree on, and it is measured in pages. The negotiators have settled thirty-eight points out of forty-two; the four that remain are precisely the ones people vote for one of you or the other over."
  },
  "choices": [
    { "label": { "fr": "Céder les quatre points et signer ce soir", "en": "Concede all four and sign tonight" },
      "effects": { "approval": 7, "standing": -7, "credibilite": 1, "popularity": -4, "landscape": { "self": -1.2, "ally": 0.8 } },
      "result": { "fr": "Le texte est signé à minuit et présenté comme un compromis historique. Vos militants lisent les quatre points le lendemain matin et comprennent lesquels ont été vendus.",
                  "en": "The document is signed at midnight and presented as a historic compromise. Your members read the four points the next morning and work out which ones were sold." } },
    { "label": { "fr": "Tenir sur les quatre, quitte à tout faire capoter", "en": "Hold on all four, even if it kills the deal" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "standing": 10, "credibilite": 2, "reputation": 2, "approval": -3 },
        "result": { "fr": "Ils cèdent à quatre heures du matin parce qu'ils ont plus besoin de l'accord que vous. C'est la seule chose qui compte dans une négociation et cela ne se sait qu'après.",
                    "en": "They give way at four in the morning because they need the deal more than you do. It is the only thing that matters in a negotiation and it is only ever known afterwards." } },
      "failure": { "effects": { "alliance": null, "standing": -8, "approval": -9, "popularity": -3, "landscape": { "self": -1 } },
        "result": { "fr": "L'accord tombe sur le quatrième point, qui portait sur une taxe que personne n'aurait jamais votée. Deux camps qui ne peuvent pas gouverner l'un sans l'autre viennent de se le prouver.",
                    "en": "The deal collapses on the fourth point, which concerned a tax neither side would ever have passed. Two camps that cannot govern without each other have just proved it to themselves." } } },
    { "label": { "fr": "Signer les trente-huit et renvoyer les quatre à plus tard", "en": "Sign the thirty-eight and defer the four" },
      "effects": { "reseau": 2, "approval": 5, "credibilite": -1, "standing": 2, "chain": "alliance_epreuve" },
      "result": { "fr": "On appelle cela un désaccord assumé, ce qui veut dire un désaccord daté. Les quatre points reviendront, et ils reviendront au pire moment, parce que c'est à cela qu'ils servent.",
                  "en": "They call it an acknowledged disagreement, which means a dated one. The four points will come back, and they will come back at the worst moment, because that is what they are for." } }
  ]
},


{
  "id": "alliance_postes",
  "weight": 0,
  "delay": [1, 2],
  "cast": "ruling",
  "tag": { "fr": "Le partage des postes", "en": "Carving up the posts" },
  "text": {
    "fr": "L'accord tient, reste à le peser en ministères. {rival} propose deux secrétariats d'État et un ministère délégué, ce qui est la façon polie de dire trois placards. Le vôtre n'est pas dans la liste.",
    "en": "The deal holds; now it has to be weighed in ministries. {rival} offers two junior posts and one delegated ministry, which is the polite way of saying three sidings. Yours is not on the list."
  },
  "choices": [
    { "label": { "fr": "Exiger un ministère régalien, pour vous", "en": "Demand a great office of state, for yourself" },
      "roll": { "base": 16, "stat": "credibilite", "plus": { "reseau": 0.45, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "office": "ministre", "standing": 8, "credibilite": 3, "notoriete": 2, "popularity": -4 },
        "result": { "fr": "Vous entrez au gouvernement par la grande porte et vous dirigez toujours votre parti, ce qui n'a jamais rendu personne populaire au sein d'une majorité. On vous laisse les deux parce qu'on ne peut pas faire autrement.",
                    "en": "You enter the government by the front door and you still run your party, which has never made anybody popular inside a majority. They let you keep both because they have no choice." } },
      "failure": { "effects": { "standing": -7, "credibilite": -1, "popularity": -3, "approval": -3 },
        "result": { "fr": "On vous explique qu'un chef de parti au gouvernement, cela ne se fait pas. C'est faux, cela s'est fait quatre fois, et la vraie raison est qu'on ne veut pas de vous dans la pièce.",
                    "en": "They explain that a party leader in government simply is not done. It is untrue, it has been done four times, and the real reason is that they do not want you in the room." } } },
    { "label": { "fr": "Prendre les trois postes et y placer vos meilleurs", "en": "Take the three posts and fill them with your best people" },
      "effects": { "reseau": 3, "standing": 6, "credibilite": 1, "popularity": -2, "chain": "alliance_epreuve" },
      "result": { "fr": "Trois placards tenus par trois personnes qui n'ont pas l'intention d'y rester. Dans dix-huit mois, deux d'entre elles seront devenues indispensables et la troisième vous détestera.",
                  "en": "Three sidings held by three people with no intention of staying there. In eighteen months two of them will have become indispensable and the third will hate you." } },
    { "label": { "fr": "Refuser tous les postes et rester au Parlement", "en": "Turn down every post and stay in Parliament" },
      "effects": { "reputation": 3, "credibilite": 2, "popularity": 6, "standing": -6, "sangfroid": 1 },
      "result": { "fr": "Vous soutenez sans entrer, ce qui vous laisse le droit de partir. Vos députés découvrent qu'ils vont voter des textes sans avoir un seul ministre à appeler quand cela tournera mal.",
                  "en": "You support without joining, which leaves you the right to leave. Your members discover that they will be voting for bills without a single minister to call when it goes wrong." } }
  ]
},


{
  "id": "alliance_a_la_carte",
  "weight": 0,
  "delay": [1, 3],
  "cast": "ruling",
  "tag": { "fr": "Texte par texte", "en": "Bill by bill" },
  "text": {
    "fr": "Le premier texte arrive, et il faut décider. Pas d'accord global, pas de programme commun : on vous demande vos voix sur une loi précise, et le prix se fixe cette semaine pour les cinq années qui viennent.",
    "en": "The first bill arrives, and a decision has to be made. No overall deal, no joint platform: they are asking for your votes on one specific law, and the price fixed this week will hold for the next five years."
  },
  "choices": [
    { "label": { "fr": "Vendre cher, et faire savoir que c'était cher", "en": "Sell dear, and let it be known that it was dear" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "standing": 9, "reseau": 2, "credibilite": 1, "approval": -4, "popularity": 2 },
        "result": { "fr": "Quatre amendements, un engagement écrit et une conférence de presse pour le dire. Le gouvernement a sa loi, vous avez la démonstration que rien ne passe sans vous, et c'est vous qui avez fait le meilleur achat.",
                    "en": "Four amendments, one written commitment and a press conference to say so. The government has its bill, you have the demonstration that nothing passes without you, and you got the better deal." } },
      "failure": { "effects": { "standing": -6, "approval": 4, "popularity": -4, "credibilite": -1 },
        "result": { "fr": "Ils trouvent leurs voix ailleurs et votent la loi sans vous, à sept voix près. Un pivot qui n'a pas servi une fois ne sert plus jamais.",
                    "en": "They find their votes elsewhere and pass the bill without you, by seven votes. A pivot that goes unused once is never used again." } } },
    { "label": { "fr": "Voter pour, sans rien demander cette fois", "en": "Vote for it, asking for nothing this time" },
      "effects": { "reputation": 2, "credibilite": 2, "approval": 6, "standing": -4, "popularity": 3, "chain": "alliance_epreuve" },
      "result": { "fr": "Vous votez un texte que vous auriez écrit vous-même, et vous refusez de le monnayer. Personne ne vous croira, et l'on cherchera pendant six mois ce que vous avez obtenu en échange.",
                  "en": "You vote for a bill you would have written yourself, and refuse to trade on it. Nobody will believe you, and for six months they will hunt for what you got in return." } },
    { "label": { "fr": "Voter contre, pour marquer que rien n'est acquis", "en": "Vote against, to show nothing is settled" },
      "effects": { "standing": 5, "popularity": 3, "approval": -8, "landscape": { "self": 0.8 }, "credibilite": -1 },
      "result": { "fr": "La loi passe quand même, de justesse, et tout le monde comprend le message : vous n'êtes l'allié de personne. C'est une position confortable et elle ne rapporte jamais de ministère.",
                  "en": "The bill passes anyway, narrowly, and everybody gets the message: you are nobody's ally. It is a comfortable position and it never yields a ministry." } }
  ]
},


{
  "id": "alliance_epreuve",
  "weight": 0,
  "delay": [3, 6],
  "cast": "ruling",
  "when": { "allied": true },
  "tag": { "fr": "Le texte qui sépare", "en": "The bill that splits" },
  "text": {
    "fr": "Le texte que les deux camps repoussaient depuis le début arrive en séance. Vos militants ont manifesté contre il y a trois ans, vos partenaires en ont fait une promesse de campagne, et personne n'a trouvé de rédaction qui permette de mentir aux deux à la fois.",
    "en": "The bill both camps have been deferring since the start reaches the floor. Your members demonstrated against it three years ago, your partners made it a campaign promise, and nobody has found a wording that lies to both at once."
  },
  "choices": [
    { "label": { "fr": "Faire voter votre groupe, discipline comprise", "en": "Whip your group into voting for it" },
      "effects": { "standing": -10, "approval": 8, "credibilite": 2, "popularity": -5, "landscape": { "self": -1.4 } },
      "result": { "fr": "Le texte passe et onze de vos députés ne vous adressent plus la parole. L'accord tient, et vous venez de découvrir combien il coûte quand on le paie d'un coup.",
                  "en": "The bill passes and eleven of your members stop speaking to you. The deal holds, and you have just found out what it costs when you pay it in one go." } },
    { "label": { "fr": "Laisser la liberté de vote", "en": "Allow a free vote" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": 2, "approval": -5, "credibilite": -2 },
      "result": { "fr": "Vingt-deux pour, dix-neuf contre, six abstentions. Vous avez évité la crise et vous avez montré au pays qu'aucune ligne ne sort plus de votre bureau.",
                  "en": "Twenty-two for, nineteen against, six abstentions. You have avoided the crisis and shown the country that no line comes out of your office any more." } },
    { "label": { "fr": "Rompre l'accord sur ce texte, et l'annoncer avant eux", "en": "Break the deal over this bill, and announce it first" },
      "effects": { "alliance": null, "popularity": 9, "standing": 6, "approval": -12, "credibilite": -2,
                   "landscape": { "self": 1.4, "ruling": -1.4 }, "chain": "alliance_rupture" },
      "result": { "fr": "Vous rompez sur un texte plutôt que sur un poste, ce qui est la seule façon de rompre proprement. Le gouvernement l'apprend par une dépêche, et vos militants vous pardonnent tout le reste.",
                  "en": "You break over a bill rather than over a job, which is the only clean way to break. The government learns of it from a newswire, and your members forgive you everything else." } }
  ]
},


{
  "id": "alliance_rupture",
  "weight": 0,
  "delay": [1, 3],
  "cast": "ruling",
  "tag": { "fr": "Après la rupture", "en": "After the break" },
  "text": {
    "fr": "Trois mois que l'accord est mort et l'on continue de vous appeler l'ancien partenaire. Le gouvernement compte ses voix chaque mardi, votre parti compte les vôtres, et la seule question qui reste est de savoir qui tombe en premier.",
    "en": "Three months since the deal died and they still call you the former partner. The government counts its votes every Tuesday, your party counts yours, and the only remaining question is who falls first."
  },
  "choices": [
    { "label": { "fr": "Achever le gouvernement : voter la censure", "en": "Finish the government off: vote the censure" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "eloquence": 0.35, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "dissolve": true, "notoriete": 3, "popularity": 12, "standing": 7, "approval": -12,
                                "landscape": { "self": 1.4 } },
        "result": { "fr": "La motion passe de six voix, dont les vôtres. On vous reprochera d'avoir renversé un gouvernement dont vous étiez ; on vous le reprochera longtemps et cela n'empêchera rien.",
                    "en": "The motion carries by six votes, yours among them. They will accuse you of bringing down a government you belonged to; they will keep saying it for years and it will change nothing." } },
      "failure": { "effects": { "popularity": -7, "standing": -10, "credibilite": -2, "approval": 6 },
        "result": { "fr": "La motion échoue et l'on garde de vous une seule image : celle de quelqu'un qui a essayé de tuer et qui a manqué. C'est la pire des deux réputations possibles.",
                    "en": "The motion fails and one image of you survives: somebody who tried to kill and missed. It is the worse of the two available reputations." } } },
    { "label": { "fr": "Reprendre langue, sans rien signer cette fois", "en": "Reopen talks, signing nothing this time" },
      "effects": { "reseau": 2, "credibilite": 1, "approval": 5, "standing": -4, "popularity": -3, "chain": "alliance_a_la_carte" },
      "result": { "fr": "On se revoit, on ne signe rien, et l'on recommence à voter ensemble sans le dire. C'est la forme d'alliance la plus durable qui existe, précisément parce qu'elle n'a pas de nom.",
                  "en": "You meet again, sign nothing, and start voting together without saying so. It is the most durable form of alliance there is, precisely because it has no name." } },
    { "label": { "fr": "Tourner la page et préparer les législatives", "en": "Turn the page and prepare for the next election" },
      "effects": { "energie": -2, "standing": 5, "credibilite": 1, "landscape": { "self": 0.8 }, "approval": -3 },
      "result": { "fr": "Vous cessez de commenter le gouvernement et vous passez six mois sur les investitures. C'est moins spectaculaire qu'une censure et cela rapporte davantage de députés.",
                  "en": "You stop commenting on the government and spend six months on nominations. It is less spectacular than a censure motion and it produces more members of parliament." } }
  ]
},


{
  "id": "assemblee_texte_par_texte",
  "weight": 0,
  "delay": [2, 4],
  "tag": { "fr": "Le budget sans majorité", "en": "A budget without a majority" },
  "text": {
    "fr": "Le budget arrive et vous n'avez toujours signé avec personne. Quatre cent trente amendements, onze jours de séance, et à la fin il faudra soit trouver les voix, soit passer en force et l'admettre.",
    "en": "The budget arrives and you still have not signed with anybody. Four hundred and thirty amendments, eleven days on the floor, and at the end you will either find the votes or force it through and admit it."
  },
  "choices": [
    { "label": { "fr": "Aller chercher les voix une par une", "en": "Go and find the votes one at a time" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "energie": 0.4, "eloquence": 0.3 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "credibilite": 3, "standing": 8, "approval": 7, "energie": -4 },
        "result": { "fr": "Onze jours de couloirs et le budget passe de quatre voix, réellement exprimées. Cela ne fera pas l'ouverture du journal et cela vaut mieux qu'un passage en force.",
                    "en": "Eleven days of corridors and the budget passes by four votes, actually cast. It will not open the evening news and it is worth more than ramming it through." } },
      "failure": { "effects": { "standing": -7, "approval": -8, "energie": -4, "credibilite": -1 },
        "result": { "fr": "Vous promettez trop à trop de monde et deux promesses se croisent dans un couloir. Le budget tombe et les promesses restent.",
                    "en": "You promise too much to too many people and two promises meet in a corridor. The budget falls and the promises remain." } } },
    { "label": { "fr": "Passer en force et assumer", "en": "Force it through and own it" },
      "effects": { "standing": 4, "approval": -10, "popularity": -7, "credibilite": 1, "notoriete": 2, "landscape": { "self": -1 } },
      "result": { "fr": "Le budget est adopté sans vote, ce qui est légal et ce que personne n'appelle jamais une victoire. Le mot autoritaire entre dans les commentaires et n'en ressortira plus.",
                  "en": "The budget is adopted without a vote, which is legal and which nobody has ever called a victory. The word authoritarian enters the commentary and does not leave." } },
    { "label": { "fr": "Céder sur les recettes pour sauver les dépenses", "en": "Give on the revenue side to save the spending" },
      "effects": { "credibilite": 2, "reputation": 2, "approval": 4, "standing": -5 },
      "result": { "fr": "Vous abandonnez trois mesures fiscales pour garder l'essentiel du reste. Personne ne remerciera, tout le monde notera, et le budget existe.",
                  "en": "You drop three tax measures to keep most of the rest. Nobody will thank you, everybody will make a note, and the budget exists." } }
  ]
},


/* ==========================================================================
   4. LA VIE ORDINAIRE DE L'HÉMICYCLE
   --------------------------------------------------------------------------
   Le jeu comptait deux cent onze événements et savait à peine ce qu'un
   député fait de ses journées. Ce qui suit ne demande pas de diriger un
   parti : c'est le métier, et c'est là qu'on se fait un nom ou qu'on
   disparaît sans que personne s'en aperçoive.
   ========================================================================== */

{
  "id": "depute_president_groupe",
  "weight": 3,
  "cast": "camp_senior",
  "when": { "position": ["depute"], "minStanding": 48, "minTurn": 8 },
  "tag": { "fr": "La présidence du groupe", "en": "The group chair" },
  "text": {
    "fr": "La présidence du groupe se libère. Ce n'est pas un mandat, cela ne se dit pas dans une biographie, et c'est la personne qui distribue les temps de parole, les places en commission et les questions au gouvernement. {rival} la veut aussi.",
    "en": "The group chairmanship is vacant. It is not an office, it does not appear in a biography, and it is the person who hands out speaking time, committee places and questions to the government. {rival} wants it too."
  },
  "choices": [
    { "label": { "fr": "Faire campagne auprès des députés, un par un", "en": "Canvass the members, one by one" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 10, "credibilite": 2, "energie": -3 },
        "result": { "fr": "Quarante-six conversations en trois semaines, et l'élection est pliée avant d'avoir lieu. Vous ne dirigez toujours rien officiellement, et plus rien ne se décide sans vous.",
                    "en": "Forty-six conversations in three weeks, and the election is settled before it happens. You still officially run nothing, and nothing gets decided without you any more." } },
      "failure": { "effects": { "standing": -6, "energie": -3, "reputation": -1 },
        "result": { "fr": "{rival} l'emporte de trois voix et vous savez précisément lesquelles. Vous garderez la liste plus longtemps qu'{il} ne gardera le poste.",
                    "en": "{rival} wins by three votes and you know exactly which three. You will keep the list longer than {he} keeps the job." } } },
    { "label": { "fr": "Soutenir {rival} contre une commission", "en": "Back {rival} in exchange for a committee" },
      "effects": { "reseau": 2, "standing": 4, "credibilite": 1, "popularity": -1 },
      "result": { "fr": "Vous perdez la présidence et vous gagnez une commission des finances, ce qui est le meilleur échange qu'on puisse faire dans cette maison. Personne ne le remarquera avant trois ans.",
                  "en": "You lose the chairmanship and gain a seat on the finance committee, which is the best trade available in this building. Nobody will notice for three years." } },
    { "label": { "fr": "Ne pas se présenter et le faire savoir", "en": "Stand aside, and make sure it is known" },
      "effects": { "reputation": 1, "energie": 2, "popularity": 2, "standing": -3 },
      "result": { "fr": "Vous expliquez que votre circonscription passe avant l'organigramme. C'est vrai, c'est bien reçu chez vous, et cela vous coûtera une place à chaque distribution pendant cinq ans.",
                  "en": "You explain that your constituency comes before the org chart. It is true, it goes down well at home, and it will cost you a place at every carve-up for five years." } }
  ]
},


{
  "id": "depute_commission_enquete",
  "weight": 3,
  "when": { "position": ["depute"], "ruling": false, "minTurn": 8, "maxApproval": 48 },
  "tag": { "fr": "La commission d'enquête", "en": "The committee of inquiry" },
  "text": {
    "fr": "Votre groupe a le droit d'obtenir une commission d'enquête par an, et c'est à vous qu'on propose de la mener. Six mois d'auditions publiques, des pouvoirs de justice, et un rapport que personne ne lira si vous ne trouvez rien.",
    "en": "Your group is entitled to one committee of inquiry a year, and you are being offered the chair. Six months of public hearings, the powers of a court, and a report nobody will read if you find nothing."
  },
  "choices": [
    { "label": { "fr": "Viser un ministre, avec des pièces", "en": "Go after a minister, with documents" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4, "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "notoriete": 3, "popularity": 11, "credibilite": 3, "approval": -9, "energie": -3,
                                "landscape": { "self": 1.2, "ruling": -1 } },
        "result": { "fr": "Deux heures d'audition retransmises en direct et un ministre qui se contredit à la quarante-septième minute. Le rapport ne servira à rien ; les deux heures serviront pendant dix ans.",
                    "en": "Two hours of hearings broadcast live and a minister who contradicts himself in the forty-seventh minute. The report will be useless; the two hours will be useful for a decade." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -2, "reputation": -1, "energie": -3, "approval": 4 },
        "result": { "fr": "Les pièces ne disent pas ce que vous leur faisiez dire. Le ministre répond calmement pendant deux heures et sort de la salle plus fort qu'il n'y était entré.",
                    "en": "The documents do not say what you were making them say. The minister answers calmly for two hours and leaves the room stronger than he entered it." } } },
    { "label": { "fr": "Choisir un sujet technique et faire un vrai travail", "en": "Pick a technical subject and do real work" },
      "effects": { "credibilite": 3, "reputation": 2, "eloquence": 1, "energie": -3, "popularity": -2, "standing": 2 },
      "result": { "fr": "Deux cent quarante pages sur un sujet dont personne ne parle et que tout le monde citera dans quatre ans. C'est la façon la plus lente qui existe de se faire un nom, et la seule qui tienne.",
                  "en": "Two hundred and forty pages on a subject nobody discusses and everybody will be quoting in four years. It is the slowest way there is to make a name, and the only one that lasts." } },
    { "label": { "fr": "Laisser la présidence à quelqu'un d'autre", "en": "Leave the chair to somebody else" },
      "effects": { "energie": 2, "standing": -3, "reseau": 1 },
      "result": { "fr": "Six mois d'auditions, c'est six mois passés à Paris. Vous les passez chez vous, et personne au siège ne retient que vous aviez dit non pour de bonnes raisons.",
                  "en": "Six months of hearings is six months in Paris. You spend them at home, and nobody at headquarters remembers that you said no for good reasons." } }
  ]
},


{
  "id": "depute_niche_parlementaire",
  "weight": 3,
  "when": { "position": ["depute"], "minTurn": 6 },
  "tag": { "fr": "La niche parlementaire", "en": "The private member's day" },
  "text": {
    "fr": "Votre groupe a une journée par an où il décide de l'ordre du jour, et l'on vous propose d'y inscrire un texte. Une seule journée : ce qui n'est pas voté avant minuit tombe, et l'obstruction d'en face le sait aussi bien que vous.",
    "en": "Your group gets one day a year when it sets the agenda, and you are offered a slot. One day only: whatever is not voted by midnight falls, and the obstruction opposite knows that as well as you do."
  },
  "choices": [
    { "label": { "fr": "Un texte symbolique, sûr d'être voté", "en": "A symbolic bill, certain to pass" },
      "effects": { "popularity": 5, "notoriete": 1, "credibilite": -1, "standing": 2 },
      "result": { "fr": "La loi est votée à l'unanimité et ne change rien à rien, ce qui est la raison pour laquelle elle a été votée à l'unanimité. Vous aurez une photo et une date.",
                  "en": "The bill passes unanimously and changes nothing whatever, which is why it passed unanimously. You get a photograph and a date." } },
    { "label": { "fr": "Un texte qui gêne vraiment le gouvernement", "en": "A bill that genuinely embarrasses the government" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "reseau": 0.4, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "credibilite": 2, "notoriete": 2, "approval": -6, "standing": 4 },
        "result": { "fr": "Onze députés de la majorité votent avec vous et le gouvernement passe la soirée à expliquer pourquoi il est contre. La loi ne survivra pas au Sénat ; la soirée, si.",
                    "en": "Eleven government members vote with you and the government spends the evening explaining why it is against. The bill will not survive the Senate; the evening will." } },
      "failure": { "effects": { "popularity": -4, "standing": -4, "energie": -2, "approval": 3 },
        "result": { "fr": "Six cents amendements d'obstruction et minuit arrive avant le vote. Vous avez consommé votre journée annuelle pour un débat que personne n'a suivi.",
                    "en": "Six hundred wrecking amendments and midnight arrives before the vote. You have spent your one day of the year on a debate nobody followed." } } },
    { "label": { "fr": "Céder votre place à un collègue en difficulté", "en": "Give your slot to a colleague in trouble" },
      "effects": { "reseau": 3, "standing": 5, "reputation": 1, "popularity": -2 },
      "result": { "fr": "Vous donnez votre journée à quelqu'un qui sera battu si rien ne se passe chez lui. Il le sait, tout le groupe le sait, et cela vaut plus qu'une loi.",
                  "en": "You give your day to somebody who will be beaten unless something happens in their patch. They know it, the whole group knows it, and it is worth more than a law." } }
  ]
},


{
  "id": "depute_question_gouvernement",
  "weight": 3,
  "cast": "opponent",
  "when": { "position": ["depute"], "ruling": false },
  "tag": { "fr": "Questions au gouvernement", "en": "Questions to the government" },
  "text": {
    "fr": "Deux minutes, mercredi, en direct, et c'est la seule séance que quelqu'un regarde. Votre groupe vous donne la question, et vous savez déjà que le ministre a la réponse écrite depuis lundi.",
    "en": "Two minutes, Wednesday, live, and it is the only sitting anybody watches. Your group hands you the question, and you already know the minister has had the written answer since Monday."
  },
  "choices": [
    { "label": { "fr": "La question qu'on ne peut pas préparer", "en": "The question nobody can prepare for" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.45, "charisme": 0.3 }, "dice": 16 },
      "success": { "effects": { "eloquence": 1, "notoriete": 3, "popularity": 10, "approval": -5, "standing": 3 },
        "result": { "fr": "Vous posez une question précise sur un chiffre précis et le ministre lit une fiche qui parle d'autre chose. Le silence de quatre secondes qui suit fera le tour des réseaux avant la fin de la séance.",
                    "en": "You ask a precise question about a precise figure and the minister reads out a briefing about something else. The four seconds of silence that follow will be everywhere before the sitting ends." } },
      "failure": { "effects": { "popularity": -5, "credibilite": -2, "notoriete": 1 },
        "result": { "fr": "Le chiffre était faux de deux ans. Le ministre le corrige avec une courtoisie assassine et vous regardez le reste de la séance en pensant à autre chose.",
                    "en": "Your figure was two years out of date. The minister corrects it with murderous courtesy and you watch the rest of the sitting thinking about something else." } } },
    { "label": { "fr": "Céder votre question à un dossier de circonscription", "en": "Use your question on a constituency issue" },
      "effects": { "popularity": 4, "reseau": 2, "notoriete": -1, "standing": 1 },
      "result": { "fr": "Vous parlez d'une ligne ferroviaire que huit millions de téléspectateurs n'emprunteront jamais. Dans votre circonscription, on ne parle que de cela pendant une semaine.",
                  "en": "You talk about a railway line eight million viewers will never use. In your constituency, nothing else is discussed for a week." } },
    { "label": { "fr": "Faire un numéro : la formule qui tourne", "en": "Do a turn: the line that travels" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 4, "popularity": 8, "credibilite": -2, "standing": -2 },
        "result": { "fr": "Onze mots, repris partout, et personne ne se souvient de la question. C'est exactement ce que vous vouliez, et cela se paiera le jour où l'on vous demandera d'être sérieux.",
                    "en": "Eleven words, quoted everywhere, and nobody remembers the question. It is exactly what you wanted, and it will cost you the day somebody asks you to be serious." } },
      "failure": { "effects": { "popularity": -6, "credibilite": -2, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "La formule tombe à plat dans un hémicycle à moitié vide et le président de séance vous rappelle à l'ordre. On repassera l'image, mais pas pour les raisons prévues.",
                    "en": "The line dies in a half-empty chamber and the chair calls you to order. The clip will be replayed, though not for the intended reasons." } } }
  ]
},


{
  "id": "depute_discipline_groupe",
  "weight": 3,
  "when": { "position": ["depute"], "ruling": true, "majority": ["relative", "aucune"], "minTurn": 6 },
  "tag": { "fr": "La discipline de vote", "en": "The whip" },
  "text": {
    "fr": "Le texte passe à trois voix près et le vôtre en fait partie. Vous êtes contre depuis toujours, vous l'avez écrit dans votre profession de foi, et le président du groupe vient de s'asseoir à côté de vous sans rien dire.",
    "en": "The bill passes by three votes and yours is one of them. You have always been against it, you wrote so in your election address, and the group chair has just sat down beside you without saying anything."
  },
  "choices": [
    { "label": { "fr": "Voter avec le groupe", "en": "Vote with the group" },
      "effects": { "standing": 7, "approval": 4, "reputation": -2, "popularity": -5, "strike": "menteur" },
      "result": { "fr": "Vous levez la main et vous regardez ailleurs. Un journaliste local ressortira votre profession de foi dans quatre jours, et vous n'aurez rien à lui répondre qui tienne en une phrase.",
                  "en": "You raise your hand and look elsewhere. A local reporter will dig out your election address within four days, and you will have no answer that fits in one sentence." } },
    { "label": { "fr": "Voter contre, et l'assumer devant le groupe", "en": "Vote against, and own it in front of the group" },
      "effects": { "reputation": 3, "credibilite": 2, "popularity": 7, "standing": -11, "approval": -5 },
      "result": { "fr": "Le texte tombe de deux voix et tout le monde sait laquelle a manqué. On ne vous le dira jamais en face et on ne vous investira plus jamais nulle part sans y réfléchir.",
                  "en": "The bill falls by two votes and everybody knows which one was missing. Nobody will ever say it to your face and nobody will ever nominate you anywhere again without thinking twice." } },
    { "label": { "fr": "S'absenter de l'hémicycle ce jour-là", "en": "Be absent from the chamber that day" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "sangfroid": 1, "standing": -2, "reputation": -1 },
        "result": { "fr": "Un rendez-vous en circonscription impossible à déplacer, agendé le matin même. Personne n'est dupe et personne ne peut rien prouver, ce qui suffit largement.",
                    "en": "An unmovable constituency engagement, entered in the diary that morning. Nobody is fooled and nobody can prove anything, which is more than enough." } },
      "failure": { "effects": { "standing": -7, "reputation": -2, "popularity": -3, "strike": "lache" },
        "result": { "fr": "Votre absence est relevée nommément à la tribune par l'opposition. Il n'existe pas de pire façon de ne pas prendre position que de se faire remarquer en ne la prenant pas.",
                    "en": "Your absence is named from the podium by the opposition. There is no worse way of not taking a position than being noticed failing to take one." } } }
  ]
},


{
  "id": "depute_amendement_marchande",
  "weight": 3,
  "cast": "ruling",
  "when": { "position": ["depute"], "ruling": false, "inCoalition": true },
  "tag": { "fr": "Un amendement contre une voix", "en": "An amendment for a vote" },
  "text": {
    "fr": "Votre groupe soutient le gouvernement sans en être, ce qui vous met dans la position exacte de celui à qui l'on vient demander quelque chose. Un conseiller de {rival} vous propose de faire passer votre amendement en échange de votre voix sur l'article 4.",
    "en": "Your group supports the government without belonging to it, which puts you in precisely the position of somebody who gets asked for things. An adviser to {rival} offers to carry your amendment in exchange for your vote on article 4."
  },
  "choices": [
    { "label": { "fr": "Accepter, et prendre l'amendement", "en": "Accept, and take the amendment" },
      "effects": { "reseau": 2, "standing": 5, "popularity": 3, "reputation": -1, "approval": 4 },
      "result": { "fr": "Votre amendement est adopté et il fera une différence réelle pour trois mille personnes. L'article 4 passe aussi, et il en fera une autre pour beaucoup plus de monde.",
                  "en": "Your amendment passes and it will make a real difference to three thousand people. Article 4 passes too, and it will make another one to a great many more." } },
    { "label": { "fr": "Refuser, et voter selon le texte", "en": "Refuse, and vote on the merits" },
      "effects": { "reputation": 3, "credibilite": 2, "standing": -5, "popularity": 2, "energie": -1 },
      "result": { "fr": "Vous votez contre l'article 4 et votre amendement tombe le lendemain. Vous aviez raison, cela ne se verra nulle part, et l'amendement ne reviendra pas avant huit ans.",
                  "en": "You vote against article 4 and your amendment falls the next day. You were right, it will show nowhere, and the amendment will not come back for eight years." } },
    { "label": { "fr": "Accepter, puis voter contre quand même", "en": "Accept, then vote against anyway" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "standing": 4, "popularity": 5, "reputation": -2, "reseau": 1 },
        "result": { "fr": "Vous avez l'amendement et vous avez le vote contre, et il faudra trois semaines avant que quiconque reconstitue l'ordre des choses. Cela se fait une fois dans une carrière.",
                    "en": "You have the amendment and you have the vote against, and it will take three weeks before anybody reconstructs the order of events. This works once in a career." } },
      "failure": { "effects": { "standing": -10, "reputation": -3, "credibilite": -2, "strike": "menteur" },
        "result": { "fr": "L'amendement est retiré en séance à la demande du gouvernement, avec une phrase qui explique pourquoi. En trois minutes, tout le monde a compris et personne ne vous parlera plus de la même façon.",
                    "en": "The amendment is withdrawn on the floor at the government's request, with one sentence explaining why. In three minutes everybody has understood and nobody will ever speak to you the same way." } } }
  ]
},


{
  "id": "depute_bascule_censure",
  "weight": 5,
  "cast": "ruling",
  "when": { "position": ["depute"], "pivot": true, "maxApproval": 42 },
  "tag": { "fr": "Les voix qui manquent", "en": "The missing votes" },
  "text": {
    "fr": "Une motion de censure est déposée et l'arithmétique est publique : elle passe si votre groupe la vote, elle tombe sinon. Vous n'avez rien décidé de tout cela et vous allez pourtant passer trois jours à recevoir des appels de gens qui ne vous ont jamais appelé.",
    "en": "A no-confidence motion is tabled and the arithmetic is public: it passes if your group votes for it, it falls if not. You decided none of this and you are nevertheless about to spend three days taking calls from people who have never called you."
  },
  "choices": [
    { "label": { "fr": "Voter la censure et faire tomber le gouvernement", "en": "Vote the censure and bring the government down" },
      "effects": { "notoriete": 3, "popularity": 11, "standing": 6, "approval": -12, "dissolve": true,
                   "landscape": { "self": 1.2, "ruling": -1.2 } },
      "result": { "fr": "Le gouvernement tombe dans la nuit et le président dissout au matin. Vous revoterez dans six semaines, et vous découvrirez alors si le pays vous savait gré de quelque chose.",
                  "en": "The government falls overnight and the president dissolves in the morning. You will vote again in six weeks, and you will find out then whether the country was grateful for anything." } },
    { "label": { "fr": "Négocier votre abstention, et facturer", "en": "Negotiate your abstention, and invoice" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.45, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "reseau": 3, "standing": 9, "credibilite": 2, "approval": 5, "popularity": -3 },
        "result": { "fr": "Vous vous abstenez et vous obtenez trois engagements écrits que personne ne connaîtra jamais. Le gouvernement survit et vous savez exactement ce que vaut votre groupe.",
                    "en": "You abstain and you obtain three written commitments nobody will ever hear about. The government survives and you know exactly what your group is worth." } },
      "failure": { "effects": { "standing": -8, "popularity": -6, "reputation": -2, "approval": 3 },
        "result": { "fr": "L'abstention est annoncée avant que les engagements soient signés. Vous avez sauvé un gouvernement gratuitement, ce qui est la seule faute qu'on ne pardonne pas dans cette maison.",
                    "en": "The abstention is announced before the commitments are signed. You saved a government for free, which is the one mistake this building does not forgive." } } },
    { "label": { "fr": "Voter contre la censure, et dire pourquoi", "en": "Vote against the censure, and say why" },
      "effects": { "reputation": 3, "credibilite": 2, "approval": 8, "standing": -6, "popularity": -4 },
      "result": { "fr": "Vous expliquez qu'on ne renverse pas un gouvernement sans savoir par quoi le remplacer. C'est exact, c'est raisonnable, et vos militants passeront l'été à vous le reprocher.",
                  "en": "You explain that you do not bring down a government without knowing what replaces it. It is accurate, it is reasonable, and your members will spend the summer holding it against you." } }
  ]
},


{
  "id": "depute_hemicycle_absent",
  "weight": 3,
  "when": { "position": ["depute"], "minTurn": 10 },
  "tag": { "fr": "Le classement des absences", "en": "The attendance league" },
  "text": {
    "fr": "Une association publie le classement de présence en séance et vous figurez dans le dernier tiers. Le calcul est discutable, il ne compte ni les commissions ni la circonscription, et il sera repris tel quel par tout le monde pendant trois jours.",
    "en": "A campaign group publishes the attendance league table and you are in the bottom third. The method is arguable, it counts neither committees nor constituency work, and it will be reproduced exactly as it stands by everybody for three days."
  },
  "choices": [
    { "label": { "fr": "Expliquer la méthode, chiffres à l'appui", "en": "Explain the methodology, with figures" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "credibilite": 2, "popularity": 3, "reputation": 1, "energie": -1 },
        "result": { "fr": "Vous publiez votre agenda de l'année, heure par heure. Deux journalistes vérifient, un seul écrit un rectificatif, et cela suffit à ce que le chiffre cesse d'être cité chez vous.",
                    "en": "You publish your diary for the year, hour by hour. Two journalists check it, one prints a correction, and that is enough for the number to stop being quoted locally." } },
      "failure": { "effects": { "popularity": -6, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Expliquer un classement, c'est le rappeler. La deuxième journée du sujet est consacrée à votre explication et la troisième à votre agenda de l'été dernier.",
                    "en": "Explaining a league table is repeating it. The second day of coverage is devoted to your explanation and the third to last summer's diary." } } },
    { "label": { "fr": "Passer six mois à l'Assemblée, du lundi au vendredi", "en": "Spend six months in the chamber, Monday to Friday" },
      "effects": { "credibilite": 2, "reputation": 2, "standing": 4, "energie": -3, "popularity": -3 },
      "result": { "fr": "Vous êtes en séance tous les jours et vous n'êtes plus chez vous un seul week-end. Le classement suivant vous sera favorable et votre suppléant commence à être connu à votre place.",
                  "en": "You are in the chamber every day and home not a single weekend. The next league table will be kind to you and your deputy is starting to be known instead of you." } },
    { "label": { "fr": "Ne rien dire du tout", "en": "Say nothing at all" },
      "effects": { "sangfroid": 1, "energie": 1, "popularity": -2 },
      "result": { "fr": "Le sujet meurt le quatrième jour, comme tous les sujets. Il ressortira une seule fois, dans six ans, sur une affiche de votre adversaire.",
                  "en": "The story dies on the fourth day, as all stories do. It will surface once more, in six years, on an opponent's poster." } }
  ]
},


{
  "id": "assemblee_soir_resultats",
  "weight": 3,
  "when": { "position": ["depute", "maire", "ministre", "cadre", "euro"], "minTurn": 8, "majority": ["relative", "aucune"] },
  "tag": { "fr": "Le soir des législatives", "en": "Legislative election night" },
  "text": {
    "fr": "Vingt heures, et l'hémicycle projeté à l'écran ne ressemble à rien de connu : trois blocs, aucune majorité, et des commentateurs qui répètent le mot ingouvernable en attendant d'avoir une idée. Une chaîne vous demande de venir en parler dans quarante minutes.",
    "en": "Eight in the evening, and the projected chamber on screen resembles nothing anybody recognises: three blocs, no majority, and commentators repeating the word ungovernable while they wait to have an idea. A channel asks you on air in forty minutes."
  },
  "choices": [
    { "label": { "fr": "Y aller et dire que le pays a été clair", "en": "Go on and say the country has been clear" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 8, "credibilite": 2, "standing": 3 },
        "result": { "fr": "Vous êtes le seul de la soirée à dire quelque chose qui ressemble à une lecture plutôt qu'à une plainte. On vous rappellera tous les dimanches pendant six mois.",
                    "en": "You are the only person all evening to say something that sounds like a reading rather than a complaint. They will call you back every Sunday for six months." } },
      "failure": { "effects": { "popularity": -5, "credibilite": -2, "notoriete": 1 },
        "result": { "fr": "Vous expliquez pendant onze minutes que le pays a été clair sans jamais dire en quoi. La séquence sera remontée par tout le monde et vous n'aimerez aucun des montages.",
                    "en": "You spend eleven minutes explaining that the country has been clear without once saying how. The clip will be recut by everybody and you will like none of the versions." } } },
    { "label": { "fr": "Rester au siège et compter les circonscriptions", "en": "Stay at headquarters and count the seats" },
      "effects": { "reseau": 2, "standing": 6, "credibilite": 1, "popularity": -2, "energie": -2 },
      "result": { "fr": "Vous passez la nuit au téléphone avec quarante candidats, dont onze qui viennent de gagner et vingt-neuf qui viennent de perdre. Les vingt-neuf s'en souviendront plus longtemps.",
                  "en": "You spend the night on the phone with forty candidates, eleven who have just won and twenty-nine who have just lost. The twenty-nine will remember it longer." } },
    { "label": { "fr": "Rentrer se coucher", "en": "Go home to bed" },
      "effects": { "energie": 3, "sangfroid": 1, "notoriete": -1, "standing": -2 },
      "result": { "fr": "Vous éteignez à vingt et une heures. Vous serez le seul du pays politique à être reposé lundi matin, et cela vaut plus que les onze minutes d'antenne.",
                  "en": "You switch off at nine. You will be the only person in politics who is rested on Monday morning, and that is worth more than eleven minutes of airtime." } }
  ]
}
];
