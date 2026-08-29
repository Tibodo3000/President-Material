/*
 * President Material — VOUS OU VOTRE CAMP.
 * ============================================================================
 *
 * Le rapport de force bougeait tout seul : l'usure du pouvoir, les figures
 * populaires, le bruit de l'époque, et quelques scènes qui déplaçaient un
 * point ou deux au passage. Le joueur le REGARDAIT bouger sans jamais avoir
 * la main dessus, ce qui en faisait un décor animé plutôt qu'un enjeu.
 *
 * Ce paquet ne raconte donc qu'une chose, sous neuf formes : LES MOMENTS OÙ
 * L'INTÉRÊT DU JOUEUR ET CELUI DE SON CAMP NE SONT PAS LE MÊME. Ils existent
 * dans la vraie vie politique à peu près toutes les semaines, et ce sont eux
 * qui décident si l'on finit par peser sur un parti ou par en vivre.
 *
 * QUATRE FORMES, ET IL EN FAUT DES QUATRE :
 *   1. Bon pour moi, mauvais pour les miens. Prendre l'antenne à la place du
 *      porte-parole, garder sa liste, refuser la circonscription perdue.
 *   2. Bon pour les miens, mauvais pour moi. Se désister, laisser la place,
 *      accueillir celui qui prendra la vôtre dans trois ans.
 *   3. Bon pour moi ET pour le camp d'en face. La mission que le gouvernement
 *      vous confie, le face-à-face qui vous expose et les installe.
 *   4. Bon pour tout le monde, mais cela se paie ailleurs : en argent, en
 *      énergie, en réputation, ou dans cinq ans.
 *
 * RÈGLE D'ÉCRITURE DU PAQUET. Chaque choix déplace le tableau ("landscape"),
 * et jamais dans le même sens que la carrière : si une option rapporte de la
 * cote et des points de paysage à la fois, elle n'est pas un arbitrage, c'est
 * une récompense, et elle n'a rien à faire ici. Les montants restent entre un
 * demi-point et deux points et demi : au-delà, on ne déplace plus une
 * élection, on la décide.
 *
 * Le schéma complet est en tête de js/events/_assemble.data.js.
 * ============================================================================
 */
const EV_arbitrages = [

{
  "id": "arb_circonscription_perdue",
  "weight": 3,
  "cast": "camp_senior",
  "when": { "position": ["cadre", "conseiller", "maire", "depute"], "minTurn": 12 },
  "tag": { "fr": "Le sacrifice", "en": "The sacrifice" },
  "text": {
    "fr": "Le parti n'a pas gagné cette circonscription depuis trente et un ans et il faut quand même y mettre un nom. {rival} vous explique pendant vingt minutes que ce serait un investissement, que le pays vous verrait, et que personne d'autre n'a votre profil. Personne d'autre n'a surtout envie d'y aller.",
    "en": "The party has not won this constituency in thirty-one years and a name still has to go on the ballot. {rival} spends twenty minutes explaining that it would be an investment, that the country would see you, and that nobody else has your profile. Mostly, nobody else wants to go."
  },
  "choices": [
    { "label": { "fr": "Y aller, et faire la campagne pour de vrai", "en": "Go, and run a real campaign" },
      "effects": { "standing": 11, "energie": -3, "reputation": 2, "appeal": { "self": 5 },
                   "credibilite": -1, "landscape": { "self": 1.2 } },
      "result": { "fr": "Onze semaines de marchés sous la pluie pour un score qui monte de quatre points et perd quand même. Le parti n'oubliera pas qui y est allé, et la fédération sort du scrutin plus nombreuse qu'elle n'y est entrée.",
                  "en": "Eleven weeks of rainy markets for a score that climbs four points and loses anyway. The party will not forget who went, and the local branch comes out of the vote bigger than it went in." } },
    { "label": { "fr": "Refuser : votre place est ailleurs", "en": "Refuse: your seat is elsewhere" },
      "effects": { "standing": -9, "credibilite": 1, "energie": 1, "landscape": { "self": -0.9 } },
      "result": { "fr": "Vous répondez que vous serez plus utile là où vous pouvez gagner, ce qui est vrai et ne se dit pas. La circonscription revient à un militant de vingt-six ans qui fera dix pour cent, et la direction note la date.",
                  "en": "You answer that you will be more use where you can win, which is true and is not said out loud. The seat goes to a twenty-six-year-old activist who will get ten per cent, and head office notes the date." } },
    { "label": { "fr": "Trouver quelqu'un d'autre, et le convaincre vous-même", "en": "Find somebody else, and talk them into it yourself" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "charisme": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "reseau": 2, "energie": -1, "landscape": { "self": 0.7 } },
        "result": { "fr": "Vous passez quatre soirées à convaincre une conseillère régionale que c'est le moment de se faire connaître. Elle y va, elle perd, elle vous doit une campagne, et vous n'avez pas perdu la vôtre.",
                    "en": "You spend four evenings convincing a regional councillor that this is the moment to make her name. She goes, she loses, she owes you a campaign, and you have not lost yours." } },
      "failure": { "effects": { "standing": -7, "reseau": -2, "reputation": -1, "landscape": { "self": -0.8 } },
        "result": { "fr": "Les quatre personnes que vous avez appelées se sont appelées entre elles. Tout le monde sait maintenant que vous cherchiez quelqu'un pour prendre votre place dans une défaite, et la circonscription reste sans candidat jusqu'à la veille du dépôt.",
                    "en": "The four people you called have called each other. Everyone now knows you were looking for somebody to take your place in a defeat, and the seat has no candidate until the day before nominations close." } } },
    { "label": { "fr": "Y aller et payer la campagne de votre poche", "en": "Go, and pay for the campaign yourself" },
      "when": { "minMoney": 120000 },
      "effects": { "money": -70000, "standing": 14, "notoriete": 2, "energie": -3,
                   "landscape": { "self": 1.9 }, "credibilite": -1 },
      "result": { "fr": "Quatre permanences, une équipe payée et une campagne numérique dans un territoire qui n'en avait jamais vu. Vous perdez de six points au lieu de vingt-deux, et le parti découvre qu'il existe là-bas.",
                  "en": "Four offices, a paid team and a digital campaign in a place that had never seen one. You lose by six points instead of twenty-two, and the party discovers that it exists out there." } }
  ]
},

{
  "id": "arb_temps_antenne",
  "weight": 3,
  "cast": "camp",
  "when": { "minTurn": 16, "stat": { "notoriete": { "min": 6 } } },
  "tag": { "fr": "Une place, un nom", "en": "One slot, one name" },
  "text": {
    "fr": "Vingt heures cinq, la seule invitation que la chaîne accordera à votre camp cette semaine. {rival} prépare ce passage depuis trois semaines avec les éléments de langage du parti. La rédaction, elle, a demandé vous.",
    "en": "Five past eight, the only invitation the channel will give your camp this week. {rival} has been preparing for it for three weeks with the party's talking points. The newsroom, however, asked for you."
  },
  "choices": [
    { "label": { "fr": "Y aller vous-même", "en": "Go yourself" },
      "effects": { "popularity": 7, "notoriete": 3, "standing": -8, "landscape": { "self": -0.4 } },
      "result": { "fr": "Dix-huit minutes qui vous vont bien et dont personne au siège ne vous parlera. Le parti a dit trois choses cette semaine et le pays en a retenu une, la vôtre, qui n'était dans aucun des documents.",
                  "en": "Eighteen minutes that suit you and that nobody at head office will ever mention. The party said three things this week and the country remembers one, yours, which was in none of the briefing notes." } },
    { "label": { "fr": "Laisser la place au porte-parole", "en": "Give the slot to the spokesperson" },
      "effects": { "standing": 9, "reseau": 2, "notoriete": -1, "popularity": -2, "landscape": { "self": 1.3 } },
      "result": { "fr": "{rival} fait exactement le passage prévu, avec les trois messages dans l'ordre, et la semaine du parti tient debout. On vous remercie en réunion de groupe, ce qui dure quarante secondes et compte pour six mois.",
                  "en": "{rival} does exactly the planned appearance, with the three messages in order, and the party's week holds together. You are thanked in the group meeting, which lasts forty seconds and counts for six months." } },
    { "label": { "fr": "Y aller, et ne parler que du parti", "en": "Go, and talk about nothing but the party" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 7, "credibilite": 1, "popularity": 2, "landscape": { "self": 1.5 } },
        "result": { "fr": "Vous ramenez chaque question à la ligne du camp sans jamais avoir l'air de réciter, ce qui est le seul exercice difficile de la télévision. Le siège regarde la rediffusion deux fois.",
                    "en": "You bring every question back to the camp's line without ever sounding like you are reciting, which is the only difficult exercise in television. Head office watches the replay twice." } },
      "failure": { "effects": { "popularity": -5, "standing": -3, "credibilite": -1, "landscape": { "self": -0.5 } },
        "result": { "fr": "Vous récitez. Le présentateur vous laisse finir, puis demande si vous croyez vous-même à ce que vous venez de dire, et les quatre secondes suivantes tournent jusqu'au dimanche.",
                    "en": "You recite. The presenter lets you finish, then asks whether you believe what you have just said, and the next four seconds circulate until Sunday." } } }
  ]
},

{
  "id": "arb_desistement",
  "weight": 4,
  "cast": "neighbour",
  "when": { "position": ["conseiller", "maire", "depute"], "minTurn": 18 },
  "tag": { "fr": "Triangulaire", "en": "Three-way race" },
  "text": {
    "fr": "Trois candidats se maintiennent au second tour et l'arithmétique est publique : à deux, le siège se gagne, à trois il se perd. {rival} a fait quatre voix de moins que vous dimanche et n'a manifestement pas l'intention d'en tirer la conclusion.",
    "en": "Three candidates are staying in for the second round and the arithmetic is public: two of them win the seat, three of them lose it. {rival} finished four votes behind you on Sunday and clearly has no intention of drawing the obvious conclusion."
  },
  "choices": [
    { "label": { "fr": "Vous désister", "en": "Stand down" },
      "effects": { "popularity": 5, "reputation": 2, "credibilite": 2, "standing": -10,
                   "landscape": { "scene": 1.5, "self": -0.7 } },
      "result": { "fr": "Vous l'annoncez le lundi à onze heures, sans conditions et sans amertume affichée. Le siège gagne un siège qui n'est pas le sien, votre fédération apprend la nouvelle par la presse, et vous n'aurez plus jamais à prouver que vous savez perdre.",
                  "en": "You announce it on Monday at eleven, with no conditions and no visible bitterness. The bloc gains a seat that is not yours, your local branch learns the news from the press, and you will never again have to prove that you know how to lose." } },
    { "label": { "fr": "Vous maintenir", "en": "Stay in" },
      "effects": { "standing": 8, "appeal": { "self": 6 }, "popularity": -5, "reputation": -1,
                   "landscape": { "self": 1.1, "scene": -1.5 } },
      "result": { "fr": "Vous expliquez que vos électeurs ne sont pas une monnaie d'échange, ce qui est la phrase qu'on prononce quand on va faire perdre son camp. Le siège est perdu pour tout le monde et votre fédération vous porte en triomphe.",
                  "en": "You explain that your voters are not small change, which is the sentence people use when they are about to make their side lose. The seat is lost for everyone and your local branch carries you shoulder-high." } },
    { "label": { "fr": "Négocier votre retrait contre la circonscription voisine", "en": "Trade your withdrawal for the seat next door" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.35, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 5, "reseau": 3, "credibilite": 1, "landscape": { "scene": 1.2 } },
        "result": { "fr": "Un accord de quatre lignes, signé un lundi soir dans une salle de permanence, qui vous promet la circonscription d'à côté au prochain coup. Elle est meilleure que la vôtre et deux personnes seulement savent pourquoi vous vous êtes retiré.",
                    "en": "A four-line agreement, signed on a Monday evening in a back room, promising you the seat next door next time. It is a better one than yours, and only two people know why you withdrew." } },
      "failure": { "effects": { "standing": -8, "reputation": -2, "reseau": -1, "landscape": { "self": -0.8 } },
        "result": { "fr": "La négociation fuite avant d'aboutir, avec le nom de la circonscription. Vous vous retirez quand même, et vous le faites désormais sous le regard de gens qui savent exactement ce que vous aviez demandé.",
                    "en": "The negotiation leaks before it concludes, with the name of the seat in it. You withdraw anyway, and you now do it in front of people who know exactly what you had asked for." } } }
  ]
},

{
  "id": "arb_transfuge_encombrant",
  "weight": 3,
  "cast": "opponent",
  "when": { "position": ["depute", "ministre", "chef"], "minStanding": 45, "minTurn": 24 },
  "tag": { "fr": "Le renfort", "en": "The reinforcement" },
  "text": {
    "fr": "{rival} veut traverser, et {il} ne vient pas les mains vides : deux fédérations, un carnet d'adresses et un électorat que votre camp n'a jamais su atteindre. {Il} arrive aussi avec exactement votre âge, exactement votre ambition, et quinze ans de télévision.",
    "en": "{rival} wants to cross the floor, and is not coming empty-handed: two local branches, a contacts book and an electorate your camp has never known how to reach. {He} also arrives with exactly your age, exactly your ambition, and fifteen years of television behind {him}."
  },
  "choices": [
    { "label": { "fr": "{Le} recevoir en grande pompe", "en": "Welcome {him} with the full ceremony" },
      "effects": { "standing": -9, "reseau": 1, "appeal": { "self": 4 },
                   "landscape": { "self": 2.1, "scene": -2.1 } },
      "result": { "fr": "Photo sur le perron, communiqué commun, deux fédérations qui changent d'enseigne dans la semaine. Votre camp pèse plus lourd qu'il n'a jamais pesé, et l'on vient de vous installer un concurrent au même étage.",
                  "en": "A photograph on the steps, a joint statement, two branches changing their sign within the week. Your camp weighs more than it ever has, and a competitor has just been installed on your own floor." } },
    { "label": { "fr": "L'accueillir sans lui donner de place", "en": "Take {him} in without giving {him} anything" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 3, "sangfroid": 1, "landscape": { "self": 1.1, "scene": -0.9 } },
        "result": { "fr": "{Il} entre, {il} ne préside rien, et l'on découvre en six mois qu'{il} apporte surtout les gens qui l'ont suivi. Les fédérations restent, l'ambition attend, et vous avez gagné trois ans.",
                    "en": "{He} joins, {he} chairs nothing, and within six months it turns out that what {he} brought is mostly the people who followed {him}. The branches stay, the ambition waits, and you have bought three years." } },
      "failure": { "effects": { "standing": -7, "reputation": -1, "landscape": { "self": 0.4, "scene": 0.5 } },
        "result": { "fr": "{Il} comprend le premier jour ce qu'on lui propose, c'est-à-dire rien, et reste chez {lui} en le racontant partout. Le camp d'en face garde ses fédérations et vous, la réputation d'avoir fait venir quelqu'un pour l'humilier.",
                    "en": "{He} understands on the first day what is on offer, which is nothing, and stays where {he} is, telling everyone why. The other camp keeps its branches and you keep the reputation of having invited somebody over in order to humiliate {him}." } } },
    { "label": { "fr": "Faire savoir que vous n'en voulez pas", "en": "Let it be known that you do not want {him}" },
      "effects": { "standing": 8, "credibilite": 1, "appeal": { "self": 5 }, "reputation": 1,
                   "landscape": { "self": -0.6, "scene": 0.4 } },
      "result": { "fr": "Vous expliquez qu'on ne se construit pas avec ceux qui n'ont pas tenu ailleurs, et votre camp applaudit une fermeté qui lui coûtera deux fédérations. {rival} reste chez {lui}, où l'on est soudain très content de {le} garder.",
                  "en": "You explain that you do not build with people who did not last elsewhere, and your camp applauds a firmness that will cost it two branches. {rival} stays put, where {he} is suddenly very welcome indeed." } }
  ]
},

{
  "id": "arb_mission_gouvernement",
  "weight": 3,
  "cast": "ruling",
  "when": { "ruling": false, "position": ["depute", "euro", "maire", "chef"], "minTurn": 20 },
  "tag": { "fr": "La mission", "en": "The commission" },
  "text": {
    "fr": "{rival} vous propose une mission de six mois sur le seul sujet que vous connaissiez mieux que tout le monde. C'est un vrai travail, avec de vrais moyens, et c'est aussi une photo : un gouvernement qui va chercher une compétence dans l'opposition passe pour un gouvernement qui écoute.",
    "en": "{rival} offers you a six-month commission on the one subject you know better than anyone. It is real work, with real resources, and it is also a photograph: a government that reaches into the opposition for expertise looks like a government that listens."
  },
  "choices": [
    { "label": { "fr": "Accepter la mission", "en": "Accept the commission" },
      "effects": { "credibilite": 3, "notoriete": 1, "energie": -2, "approval": 5, "standing": -8,
                   "appeal": { "self": -6 }, "landscape": { "ruling": 1.0, "self": -0.6 } },
      "result": { "fr": "Quatre-vingt-dix pages remises un mardi, saluées par tout le monde et appliquées par personne. Vous êtes devenu quelqu'un de sérieux, et le gouvernement a passé six mois à montrer qu'il travaillait avec l'opposition.",
                  "en": "Ninety pages handed over on a Tuesday, praised by everyone and implemented by nobody. You have become a serious person, and the government has spent six months showing that it works with the opposition." } },
    { "label": { "fr": "Refuser, et le dire", "en": "Refuse, and say so" },
      "effects": { "appeal": { "self": 7 }, "standing": 7, "credibilite": -1, "popularity": -2,
                   "landscape": { "self": 0.7, "ruling": -0.5 } },
      "result": { "fr": "Vous répondez qu'on ne prête pas sa signature à un bilan qu'on combat, et la phrase fait le tour des fédérations avant celui des rédactions. Le sujet, lui, restera traité par quelqu'un d'autre, moins bien.",
                  "en": "You answer that you do not lend your name to a record you are fighting, and the line goes round the branches before it goes round the newsrooms. The subject itself will be handled by somebody else, less well." } },
    { "label": { "fr": "Accepter, et rendre un rapport qui les gêne", "en": "Accept, and hand in a report that embarrasses them" },
      "roll": { "base": 17, "stat": "credibilite", "plus": { "sangfroid": 0.4, "eloquence": 0.3 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "popularity": 5, "notoriete": 2, "approval": -7, "standing": 3,
                                "appeal": { "ruling": -6 }, "landscape": { "ruling": -1.1, "self": 0.8 } },
        "result": { "fr": "Le rapport est irréprochable, chiffré, et conclut exactement ce que le gouvernement ne voulait pas lire. Il ne peut ni le refuser ni le publier tranquillement, et c'est vous qui en faites la tournée des plateaux.",
                    "en": "The report is impeccable, costed, and concludes precisely what the government did not want to read. It can neither reject it nor publish it quietly, and it is you who take it round the studios." } },
      "failure": { "effects": { "credibilite": -2, "energie": -2, "approval": 4, "standing": -7,
                                "appeal": { "self": -7 }, "landscape": { "ruling": 0.9 } },
        "result": { "fr": "Le cabinet réécrit deux chapitres et vous signez quand même, parce qu'il est trop tard pour ne pas signer. Le rapport sort avec votre nom dessus et les conclusions des autres dedans.",
                    "en": "The minister's office rewrites two chapters and you sign anyway, because it is too late not to sign. The report comes out with your name on it and somebody else's conclusions inside." } } }
  ]
},

{
  "id": "arb_face_a_face",
  "weight": 3,
  "cast": "leader",
  "when": { "minTurn": 20, "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Le duel", "en": "The duel" },
  "text": {
    "fr": "Une chaîne veut un face-à-face de quatre-vingt-dix minutes avec {rival}. L'audience est garantie, votre entourage est pour, et la seule question que personne ne pose tout haut est celle de savoir ce qu'un camp gagne à être traité en égal.",
    "en": "A channel wants a ninety-minute head-to-head with {rival}. The ratings are guaranteed, your staff are in favour, and the only question nobody asks out loud is what a camp gains from being treated as an equal."
  },
  "choices": [
    { "label": { "fr": "Accepter le face-à-face", "en": "Take the head-to-head" },
      "effects": { "notoriete": 3, "popularity": 6, "credibilite": 1, "energie": -2,
                   "landscape": { "scene": 1.3, "self": 0.3 } },
      "result": { "fr": "Quatre millions de personnes, deux fauteuils, et un débat que les éditorialistes vous donnent gagné d'une courte tête. {rival} passe la soirée à côté de vous, à la même hauteur, sur la même affiche, et son camp gagne un point dans les jours qui suivent.",
                  "en": "Four million viewers, two armchairs, and a debate the commentators score narrowly in your favour. {rival} spends the evening beside you, at the same height, on the same poster, and that camp gains a point in the days that follow." } },
    { "label": { "fr": "Refuser : on ne leur offre pas ce plateau", "en": "Refuse: you do not hand them that stage" },
      "effects": { "appeal": { "self": 6 }, "standing": 5, "notoriete": -1, "popularity": -3,
                   "credibilite": -1, "landscape": { "scene": -0.5 } },
      "result": { "fr": "Vous expliquez qu'il y a des tables auxquelles on ne s'assied pas, et vos militants trouvent la phrase magnifique. La chaîne annonce le lendemain que la chaise restera vide, ce qui fait une image, et ce n'est pas la vôtre.",
                  "en": "You explain that there are tables one does not sit at, and your activists find the line magnificent. The next day the channel announces that the chair will stay empty, which makes a picture, and it is not yours." } },
    { "label": { "fr": "Accepter, à condition qu'ils soient quatre sur le plateau", "en": "Accept, on condition that four of them are on set" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 3, "credibilite": 2, "standing": 2,
                                "landscape": { "scene": 0.3 } },
        "result": { "fr": "La chaîne cède et invite quatre camps au lieu de deux. L'émission est moins spectaculaire, personne n'en sort grandi, et c'est exactement le résultat que vous étiez venu chercher.",
                    "en": "The channel gives way and invites four camps instead of two. The programme is less spectacular, nobody comes out of it enlarged, and that is exactly the result you came for." } },
      "failure": { "effects": { "notoriete": -1, "popularity": -4, "energie": -1,
                                "landscape": { "scene": 0.8 } },
        "result": { "fr": "La chaîne refuse, le face-à-face a lieu sans vous, et {rival} y débat avec un fauteuil vide et beaucoup d'aisance. On explique pendant trois jours que vous avez eu peur.",
                    "en": "The channel refuses, the head-to-head happens without you, and {rival} debates an empty chair with a great deal of ease. For three days the story is that you were afraid." } } }
  ]
},

{
  "id": "arb_ligne_dure",
  "weight": 3,
  "cast": "camp_senior",
  "when": { "position": ["cadre", "conseiller", "maire", "depute", "chef"], "minTurn": 16 },
  "tag": { "fr": "La ligne", "en": "The line" },
  "text": {
    "fr": "Un sujet monte dans le pays et le bureau politique doit trancher avant jeudi. {rival} défend une ligne dure qui remplirait les salles, la direction préfère une formule que personne ne pourra reprendre contre elle, et l'on vous demande de départager.",
    "en": "A subject is rising in the country and the executive has to settle it before Thursday. {rival} is defending a hard line that would fill halls, the leadership prefers a form of words nobody can quote back at it, and you are asked to decide."
  },
  "choices": [
    { "label": { "fr": "Porter la ligne dure, et la porter vous-même", "en": "Take the hard line, and carry it yourself" },
      "effects": { "axis": "self", "popularity": 9, "standing": 9, "notoriete": 2, "credibilite": -2,
                   "strike": "radical", "landscape": { "self": 1.6 } },
      "result": { "fr": "Trois meetings pleins en dix jours et deux mille adhésions. Le camp existe de nouveau, il existe très fort, et il vient de se fermer une porte dont il aura besoin au second tour.",
                  "en": "Three full halls in ten days and two thousand new members. The camp exists again, it exists loudly, and it has just closed a door it will need in a runoff." } },
    { "label": { "fr": "Tenir la ligne modérée et l'assumer devant les militants", "en": "Hold the moderate line and defend it to the members" },
      "effects": { "credibilite": 3, "reputation": 2, "popularity": 4, "standing": -7,
                   "appeal": { "self": -7 }, "landscape": { "self": -0.5 } },
      "result": { "fr": "Vous passez deux heures dans une salle qui vous siffle poliment et vous ne cédez pas une virgule. Les éditorialistes vous découvrent une stature, la fédération vous découvre autre chose.",
                  "en": "You spend two hours in a room that whistles at you politely and you do not give up a comma. The commentators discover that you have stature; the branch discovers something else." } },
    { "label": { "fr": "Laisser le bureau politique se déchirer sans vous", "en": "Let the executive tear itself apart without you" },
      "effects": { "sangfroid": 2, "energie": 1, "standing": -4, "credibilite": -1,
                   "landscape": { "self": -0.9 } },
      "result": { "fr": "Vous ne prenez pas la parole une seule fois en quatre heures. La motion sort à onze contre neuf, illisible, et le camp passe le mois suivant à expliquer ce qu'il pense au lieu de le dire.",
                  "en": "You do not speak once in four hours. The motion passes eleven to nine, unreadable, and the camp spends the following month explaining what it thinks instead of saying it." } },
    { "label": { "fr": "Écrire vous-même une troisième ligne, et la faire voter", "en": "Write a third line yourself, and get it voted through" },
      "when": { "minStanding": 55 },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "reseau": 0.4, "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "credibilite": 3, "standing": 8, "eloquence": 1, "popularity": 3,
                                "landscape": { "self": 1.2 } },
        "result": { "fr": "Quatre paragraphes écrits dans la nuit, votés à l'unanimité moins deux voix, et repris tels quels par trois quotidiens le lendemain. Ce genre de texte se retrouve dans un programme cinq ans plus tard, avec votre nom en dessous.",
                    "en": "Four paragraphs written overnight, carried with two votes against, and quoted verbatim by three newspapers the next morning. Texts like that turn up in a manifesto five years later, with your name under them." } },
      "failure": { "effects": { "standing": -9, "credibilite": -2, "energie": -2,
                                "landscape": { "self": -1.1 } },
        "result": { "fr": "Votre texte arrive troisième sur trois et personne ne se souvient de l'avoir lu. Le camp sort du bureau politique avec deux lignes, une motion et aucune position.",
                    "en": "Your text comes third out of three and nobody remembers reading it. The camp comes out of the meeting with two lines, one motion and no position at all." } } }
  ]
},

{
  "id": "arb_dossier_adverse",
  "weight": 3,
  "cast": "opponent",
  "when": { "minTurn": 20, "stat": { "reseau": { "min": 8 } } },
  "tag": { "fr": "Ce que vous savez", "en": "What you know" },
  "text": {
    "fr": "Un dossier arrive sur votre bureau, apporté par quelqu'un qui ne veut pas y être mêlé. Il concerne {rival}, il est solide, et il vaut deux points dans les sondages à qui saura s'en servir. Il vaut aussi une semaine entière de commentaires sur les mœurs politiques.",
    "en": "A file lands on your desk, brought by somebody who does not want their name near it. It concerns {rival}, it is solid, and it is worth two points in the polls to whoever knows how to use it. It is also worth a full week of commentary about the state of politics."
  },
  "choices": [
    { "label": { "fr": "Tout publier, vous-même et sous votre nom", "en": "Publish it all, yourself and under your own name" },
      "effects": { "notoriete": 3, "popularity": -4, "reputation": -2, "standing": 6,
                   "appeal": { "scene": -7 }, "landscape": { "scene": -2.2, "self": 0.6 } },
      "result": { "fr": "Vous tenez la conférence de presse un mercredi matin et l'affaire occupe huit jours. Le camp d'en face plonge, votre camp remonte de la moitié de ce qu'il a perdu, et le pays retient surtout qu'un homme politique a sorti un dossier sur un autre.",
                  "en": "You hold the press conference on a Wednesday morning and the story runs for eight days. The other camp drops, yours recovers half of what it lost, and what the country mostly remembers is one politician producing a file on another." } },
    { "label": { "fr": "Le garder, et le faire savoir à l'intéressé", "en": "Keep it, and let the subject know you have it" },
      "effects": { "reseau": 3, "standing": 7, "reputation": -1, "sangfroid": 1 },
      "result": { "fr": "Un déjeuner, quarante minutes, et pas une phrase qui puisse se répéter. {rival} sait ce que vous avez, vous savez qu'{il} le sait, et le rapport de force entre vous deux vient de changer sans qu'une seule intention de vote ait bougé.",
                  "en": "One lunch, forty minutes, and not one sentence that could be repeated. {rival} knows what you have, you know that {he} knows, and the balance of power between the two of you has just changed without a single voting intention moving." } },
    { "label": { "fr": "Le donner à un journal et n'y être pour rien", "en": "Give it to a newspaper and have nothing to do with it" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "reseau": 0.45 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "landscape": { "scene": -1.7, "self": 0.5 },
                                "appeal": { "scene": -4 } },
        "result": { "fr": "Trois pages un samedi, signées d'un journaliste que vous n'avez jamais rencontré officiellement. Le camp d'en face passe quinze jours à démentir et personne, nulle part, ne prononce votre nom.",
                    "en": "Three pages on a Saturday, by a journalist you have officially never met. The other camp spends a fortnight issuing denials and nobody, anywhere, says your name." } },
      "failure": { "effects": { "reputation": -3, "popularity": -8, "standing": -6, "strike": "menteur",
                                "landscape": { "self": -1.2, "scene": 0.6 } },
        "result": { "fr": "Le journal protège sa source et l'entourage de {rival} la trouve en trois jours, parce qu'il n'y avait que quatre personnes possibles. L'affaire devient la vôtre, et elle ne parle plus du dossier.",
                    "en": "The paper protects its source and {rival}'s staff find it in three days, because there were only four possible people. The story becomes yours, and it is no longer about the file." } } },
    { "label": { "fr": "Le rendre à celui qui vous l'a apporté", "en": "Hand it back to whoever brought it" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "credibilite": 2, "standing": -5, "reseau": -1 },
      "result": { "fr": "Vous le rendez sans l'avoir photocopié, ce que personne ne croira jamais. Le dossier sortira dans dix-huit mois par quelqu'un d'autre, et vous aurez perdu les deux points sans avoir gagné le mérite, sauf le vôtre.",
                  "en": "You hand it back without having copied it, which nobody will ever believe. The file will come out in eighteen months through somebody else, and you will have lost the two points without gaining the credit, except your own." } }
  ]
},

{
  "id": "arb_fusion_liste",
  "weight": 3,
  "cast": "neighbour",
  "when": { "position": ["conseiller", "maire", "cadre"], "minTurn": 12 },
  "tag": { "fr": "Fusion", "en": "Merger" },
  "text": {
    "fr": "Dimanche soir, vous êtes en tête de votre camp et derrière la liste de {rival}. La fusion se décide avant mardi midi : ensemble la ville se gagne, séparément elle est perdue, et la place de troisième adjoint est celle qu'on vous propose.",
    "en": "On Sunday evening you are ahead within your own camp and behind {rival}'s list. The merger has to be settled by Tuesday noon: together the town is winnable, separately it is lost, and third deputy is the job on offer."
  },
  "choices": [
    { "label": { "fr": "Fusionner et prendre la troisième place", "en": "Merge and take third place" },
      "effects": { "reseau": 2, "standing": 6, "credibilite": 1, "notoriete": -1,
                   "landscape": { "self": 0.7, "scene": 0.7 } },
      "result": { "fr": "La ville bascule le dimanche suivant et vous héritez de la voirie et des marchés. Ce sont les deux délégations dont personne ne veut et les deux seules que les habitants remarquent.",
                  "en": "The town changes hands the following Sunday and you inherit roads and markets. They are the two portfolios nobody wants and the only two the residents ever notice." } },
    { "label": { "fr": "Maintenir votre liste jusqu'au bout", "en": "Keep your list in to the end" },
      "effects": { "appeal": { "self": 7 }, "notoriete": 2, "standing": -6, "credibilite": -1,
                   "landscape": { "self": -1.0, "scene": -0.5 } },
      "result": { "fr": "Vous faites onze pour cent et vous faites perdre la ville, ce qui se dit de deux façons selon l'endroit où l'on se trouve. Votre nom, lui, est resté en haut de l'affiche, et il y sera encore dans six ans.",
                  "en": "You get eleven per cent and you cost your side the town, which can be phrased two ways depending on where you are standing. Your name, though, stayed at the top of the poster, and it will still be there in six years." } },
    { "label": { "fr": "Fusionner, mais en exigeant la tête de liste", "en": "Merge, but demand the top of the list" },
      "roll": { "base": 17, "stat": "charisme", "plus": { "reseau": 0.4, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 9, "notoriete": 2, "credibilite": 2,
                                "landscape": { "self": 1.5, "scene": -0.4 } },
        "result": { "fr": "Vous obtenez la tête de liste à trente-six heures du dépôt, parce que l'autre camp avait encore plus à perdre que vous. La ville est gagnée sous votre nom et l'on ne vous reparlera plus jamais de vos onze pour cent.",
                    "en": "You get the top of the list thirty-six hours before nominations close, because the other camp had even more to lose than you. The town is won under your name and nobody will ever mention your eleven per cent again." } },
      "failure": { "effects": { "standing": -9, "reputation": -1, "reseau": -1,
                                "landscape": { "self": -1.3, "scene": -0.6 } },
        "result": { "fr": "Personne ne fusionne, la liste sortante est réélue au premier tour du second, et les deux camps passent six ans à expliquer que c'était la faute de l'autre. Ils ont raison tous les deux.",
                    "en": "Nobody merges, the sitting list is re-elected in a canter, and the two camps spend six years explaining that it was the other one's fault. They are both right." } } }
  ]
}
];
