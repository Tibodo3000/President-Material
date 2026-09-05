/* Un paquet d'événements. Le schéma est en tête de js/events/_assemble.data.js. */
const EV_argent = [


/* ==========================================================================
   3. ARGENT ET COMPROMISSIONS
   ========================================================================== */

{
  "id": "mecene",
  "once": true,
  "when": { "flag": { "dirtyMoney": false } },
  "tag": { "fr": "Argent", "en": "Money" },
  "text": {
    "fr": "Un homme d'affaires que personne n'ose fréquenter propose de financer vos activités. Il ne demande rien. Pour l'instant.",
    "en": "A businessman nobody dares be seen with offers to fund your work. He asks for nothing. For now."
  },
  "choices": [
    { "label": { "fr": "Accepter discrètement", "en": "Accept quietly" },
      "effects": { "money": 80000, "reseau": 1, "standing": 8, "flags": { "dirtyMoney": true }, "strike": "casserole" },
      "result": { "fr": "Le virement arrive par une société écran. Votre campagne respire enfin.",
                  "en": "The transfer comes through a shell company. Your campaign can breathe." } },
    { "label": { "fr": "Refuser poliment", "en": "Decline politely" },
      "effects": { "reputation": 1, "standing": -3 },
      "result": { "fr": "Il sourit et n'insiste pas. Vous dormez bien, et vous restez pauvre.",
                  "en": "He smiles and does not insist. You sleep well, and stay poor." } },
    { "label": { "fr": "Le dénoncer publiquement", "en": "Expose him publicly" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "self": -1.1, "identitarians": 0.9 }, "strike": "intrepide", "notoriete": 2, "reputation": 3, "popularity": 11, "standing": -9, "trait": "intouchable", "chain": "position_impopulaire" },
      "result": { "fr": "Vous racontez la proposition en détail devant les caméras. L'homme disparaît.",
                  "en": "You describe the offer in detail on camera. The man disappears." } },
    { "label": { "fr": "Monter un financement transparent", "en": "Set up transparent funding" },
      "when": { "background": ["business"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "money": 45000, "reseau": 1, "reputation": 2, "standing": 5 },
        "result": { "fr": "Vous transformez son enveloppe en dons déclarés et plafonnés. Moins d'argent, aucun risque.",
                    "en": "You turn his envelope into declared, capped donations. Less money, no risk." } },
      "failure": { "effects": { "reseau": -1, "standing": -6, "popularity": -3 },
        "result": { "fr": "Il refuse le cadre légal et va financer un rival. Vous n'avez ni l'argent ni la paix.",
                    "en": "He refuses the legal framework and funds a rival instead. You have neither the money nor the peace." } } },
    { "label": { "fr": "Accepter en montant un écran juridique", "en": "Accept behind a legal screen" },
      "when": { "personality": ["calculating"] },
      "effects": { "money": 110000, "reseau": 1, "standing": 9, "reputation": -2, "sangfroid": -1, "flags": { "dirtyMoney": true }, "trait": "caisse_noire" },
      "result": { "fr": "Trois sociétés, deux pays, un cabinet complaisant. Ça tiendra un moment.",
                  "en": "Three companies, two countries, an accommodating law firm. It will hold for a while." } }
  ]
},


{
  "id": "note_de_frais",
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Petits arrangements", "en": "Small arrangements" },
  "text": {
    "fr": "Votre assistant vous montre comment d'autres passent leurs frais personnels sur l'enveloppe parlementaire. Tout le monde le fait.",
    "en": "Your assistant shows you how others put personal expenses on the parliamentary allowance. Everyone does it."
  },
  "choices": [
    { "label": { "fr": "Faire comme tout le monde", "en": "Do what everyone does" },
      "effects": { "money": 45000, "standing": 3, "flags": { "dirtyMoney": true } },
      "result": { "fr": "C'est facile, c'est courant, et ça laisse une trace écrite quelque part.",
                  "en": "It is easy, it is common, and it leaves a paper trail somewhere." } },
    { "label": { "fr": "Tout payer de votre poche", "en": "Pay for everything yourself" },
      "effects": { "money": -20000, "reputation": 2, "popularity": 4 },
      "result": { "fr": "Votre comptable vous trouve absurde. Vous dormez mieux que lui.",
                  "en": "Your accountant thinks you are absurd. You sleep better than he does." } },
    { "label": { "fr": "Faire border le tout par un fiscaliste", "en": "Have a tax lawyer make it airtight" },
      "when": { "background": ["law"], "minMoney": 50000 },
      "effects": { "money": 25000, "sangfroid": 1, "standing": 4, "reputation": -1 },
      "result": { "fr": "Chaque ligne est défendable. Ce n'est pas honnête, c'est inattaquable.",
                  "en": "Every line is defensible. It is not honest; it is unassailable." } },
    { "label": { "fr": "Publier vos comptes de votre propre initiative", "en": "Publish your accounts unprompted" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "self": -1.4, "identitarians": 1.2 }, "reputation": 3, "popularity": 12, "standing": -11 },
      "result": { "fr": "Vos collègues vous détestent immédiatement. Vous venez de créer un précédent.",
                  "en": "Your colleagues hate you instantly. You have just set a precedent." } }
  ]
},


{
  "id": "conference_payee",
  "when": { "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Argent", "en": "Money" },
  "text": {
    "fr": "Une banque vous propose vingt mille euros pour une conférence d'une heure devant ses cadres.",
    "en": "A bank offers you twenty thousand euros for a one-hour talk to its executives."
  },
  "choices": [
    { "label": { "fr": "Accepter, c'est légal", "en": "Accept, it is legal" },
      "effects": { "money": 45000, "reputation": -1, "popularity": -7, "standing": 4 },
      "result": { "fr": "Une heure de votre temps contre un an de salaire médian. La presse fait le calcul.",
                  "en": "One hour of your time for a year of the median wage. The press does the maths." } },
    { "label": { "fr": "Refuser publiquement", "en": "Refuse publicly" },
      "effects": { "landscape": { "self": -0.8, "identitarians": 0.6 }, "reputation": 2, "popularity": 8, "standing": -4 },
      "result": { "fr": "Votre refus fait plus de bruit que la conférence n'en aurait fait.",
                  "en": "Your refusal makes more noise than the talk ever would have." } },
    { "label": { "fr": "Accepter et tout reverser", "en": "Accept and give it all away" },
      "when": { "personality": ["principled"] },
      "effects": { "reputation": 3, "popularity": 9, "standing": -5, "trait": "intouchable" },
      "result": { "fr": "Le chèque part à une association le jour même, avec le reçu publié.",
                  "en": "The cheque goes to a charity the same day, receipt published." } },
    { "label": { "fr": "Négocier le double", "en": "Negotiate double" },
      "when": { "background": ["business"] },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "stat": { "notoriete": { "min": 14 } } }, "value": 0.2 } ] },
      "success": { "effects": { "money": 45000, "reseau": 1, "reputation": -1, "popularity": -6 },
        "result": { "fr": "Ils paient sans discuter. Vous saviez ce que vous valiez pour eux.",
                    "en": "They pay without arguing. You knew what you were worth to them." } },
      "failure": { "effects": { "reseau": -1, "standing": -3 },
        "result": { "fr": "Ils invitent quelqu'un d'autre. Votre gourmandise a fait le tour du milieu.",
                    "en": "They invite someone else. Word of your greed goes round the sector." } } }
  ]
},


/* ==========================================================================
   5 bis. L'ARGENT DE LA FONCTION
   ==========================================================================
   Deux filières, deux fonctions, deux façons de s'enrichir sans jamais rien
   signer d'illégal au premier regard.

   LES CHANTIERS — le maire. Une commune attribue des marchés, et celui qui
   les attribue est courtisé. Rien n'oblige à céder ; céder rapporte
   beaucoup et laisse une trace écrite quelque part.

   BRUXELLES — le député européen. Le mandat est invisible en France, donc
   personne ne regarde, donc tout y est plus facile : cabinets de conseil,
   assistants, missions d'étude. C'est la fonction dont le jeu dit qu'on y
   envoie les gens dont on veut se débarrasser ; c'est aussi celle où l'on
   se refait.

   Les deux mènent au même endroit si l'on force : signalement, enquête,
   procès. C'est là que les avocats servent enfin à quelque chose.
   ========================================================================== */

{
  "id": "chantiers_publics",
  "weight": 3,
  "when": { "position": ["maire"], "flag": { "onTrial": false } },
  "tag": { "fr": "Marchés publics", "en": "Public contracts" },
  "text": {
    "fr": "Le marché de la rénovation du centre-ville se décide en commission d'appel d'offres, que vous présidez. Trois dossiers, dont un déposé par une entreprise qui a financé votre campagne et dont le prix est le plus élevé des trois.",
    "en": "The town-centre renovation contract is decided by the tender committee, which you chair. Three bids, one of them from a firm that funded your campaign, and the most expensive of the three."
  },
  "choices": [
    { "label": { "fr": "Attribuer au moins-disant, comme prévu", "en": "Award it to the lowest bid, as required" },
      "effects": { "reputation": 2, "standing": -6, "popularity": 3 },
      "result": { "fr": "Le règlement est le règlement. Votre financeur ne rappelle plus, et vous apprendrez dans deux ans à qui il donne désormais.",
                  "en": "Rules are rules. Your backer stops calling, and in two years you will learn who he gives to now." } },

    { "label": { "fr": "Trouver un critère technique qui les avantage", "en": "Find a technical criterion that favours them" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 14, "plus": { "reseau": 0.3 } },
      "success": { "effects": { "money": 180000, "standing": 8, "reputation": -1, "flags": { "dirtyMoney": true }, "chain": "chantier_suite" },
        "result": { "fr": "Le rapport d'analyse pèse quarante pages et conclut exactement ce qu'il fallait. Le virement, lui, passe par une société de conseil.",
                    "en": "The evaluation report runs to forty pages and concludes exactly what it had to. The payment goes through a consultancy." } },
      "failure": { "effects": { "money": 90000, "standing": 4, "reputation": -2, "popularity": -7, "flags": { "dirtyMoney": true }, "strike": "casserole", "chain": "chantier_suite" },
        "result": { "fr": "Un membre de la commission demande que son désaccord soit porté au procès-verbal. Il le sera, et le procès-verbal se garde dix ans.",
                    "en": "One committee member asks for her dissent to be minuted. It is, and minutes are kept for ten years." } } },

    { "label": { "fr": "Leur promettre le prochain, pas celui-là", "en": "Promise them the next one, not this one" },
      "effects": { "standing": 4, "reseau": 1, "reputation": -1, "money": 20000 },
      "result": { "fr": "Personne n'a rien signé et tout le monde a compris. C'est la formule qui a fait la carrière de la moitié de vos collègues.",
                  "en": "Nobody signed anything and everybody understood. It is the formula that made half your colleagues' careers." } }
  ]
},


{
  "id": "chantier_suite",
  "delay": [8, 22],
  "weight": 0,
  "tag": { "fr": "Marchés publics", "en": "Public contracts" },
  "text": {
    "fr": "L'entreprise revient. Le chantier a pris du retard, elle demande un avenant qui double la facture, et son directeur rappelle au téléphone que vous vous connaissez bien.",
    "en": "The firm is back. The works have fallen behind, they want a rider that doubles the bill, and the director reminds you on the phone that the two of you go back a long way."
  },
  "choices": [
    { "label": { "fr": "Signer l'avenant", "en": "Sign the rider" },
      "effects": { "money": 140000, "standing": 4, "reputation": -2, "popularity": -5, "chain": "signalement_chambre" },
      "result": { "fr": "La commune paiera pendant douze ans. Vous, vous êtes payé tout de suite, ce qui est l'essentiel de la différence entre les deux.",
                  "en": "The town will be paying for twelve years. You get paid immediately, which is most of the difference between the two." } },

    { "label": { "fr": "Refuser et faire jouer les pénalités de retard", "en": "Refuse and enforce the late penalties" },
      "roll": { "stat": "sangfroid", "base": 13, "dice": 14, "plus": { "eloquence": 0.3 },
                "bonus": [ { "when": { "legal": 1 }, "value": 3 } ] },
      "success": { "effects": { "reputation": 2, "popularity": 6, "standing": -4, "flags": { "dirtyMoney": false } },
        "result": { "fr": "Ils encaissent et se taisent : un procès leur coûterait le marché suivant. Vous venez d'acheter votre tranquillité avec la seule monnaie qu'ils respectent.",
                    "en": "They swallow it and keep quiet: a lawsuit would cost them the next contract. You have just bought your peace with the only currency they respect." } },
      "failure": { "effects": { "popularity": -6, "standing": -6, "chain": "signalement_chambre" },
        "result": { "fr": "Le directeur raccroche en disant qu'il a gardé tous les mails. Il a gardé tous les mails.",
                    "en": "The director hangs up saying he kept every email. He kept every email." } } },

    { "label": { "fr": "Faire reprendre le chantier par une autre entreprise", "en": "Hand the site to another firm" },
      "when": { "minMoney": 150000 },
      "effects": { "money": -120000, "reputation": 1, "popularity": -3, "standing": -3, "flags": { "dirtyMoney": false } },
      "result": { "fr": "La commune paie deux fois, vous payez la différence de votre poche pour que cela ne se voie pas, et le dossier meurt là.",
                  "en": "The town pays twice, you cover the gap yourself so it does not show, and the file dies there." } }
  ]
},


{
  "id": "signalement_chambre",
  "delay": [6, 18],
  "weight": 0,
  "tag": { "fr": "Chambre régionale", "en": "Audit office" },
  "text": {
    "fr": "La chambre régionale des comptes publie son rapport sur votre commune. Quatorze pages, un paragraphe qui vous concerne, et une phrase qui contient les mots « transmission au procureur ».",
    "en": "The regional audit office publishes its report on your town. Fourteen pages, one paragraph about you, and a sentence containing the words “referred to the prosecutor”."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point, publiquement", "en": "Answer point by point, in public" },
      "roll": { "stat": "eloquence", "base": 14, "dice": 16,
                "bonus": [ { "when": { "legal": 1 }, "value": 3 },
                           { "when": { "legal": 2 }, "value": 4 },
                           { "when": { "comms": 2 }, "value": 2 } ] },
      "success": { "effects": { "reputation": 1, "notoriete": 1, "popularity": -4, "standing": -3 },
        "result": { "fr": "Vous connaissez le dossier mieux que ceux qui l'ont écrit. Le procureur classe, la phrase reste dans les archives et personne ne la relira.",
                    "en": "You know the file better than the people who wrote it. The prosecutor drops it; the sentence stays in the archive and nobody rereads it." } },
      "failure": { "effects": { "popularity": -11, "standing": -8, "reputation": -1, "chain": "perquisition" },
        "result": { "fr": "Vous vous emmêlez sur une date, en direct. C'est cette minute-là qui sera rediffusée, et c'est elle que le parquet regardera.",
                    "en": "You get a date wrong, live on air. That is the minute they will replay, and the one the prosecutor will watch." } } },

    { "label": { "fr": "Charger votre directeur général des services", "en": "Blame your chief executive" },
      "effects": { "popularity": -3, "standing": 3, "reputation": -2, "strike": "menteur", "chain": "perquisition" },
      "result": { "fr": "Il part avec une indemnité et sans un mot. Il gardera le silence exactement aussi longtemps qu'il y trouvera son intérêt.",
                  "en": "He leaves with a settlement and without a word. He will stay silent for exactly as long as it suits him." } },

    { "label": { "fr": "Rembourser la commune avant que le procureur ne bouge", "en": "Repay the town before the prosecutor moves" },
      "when": { "minMoney": 250000 },
      "effects": { "money": -230000, "reputation": 2, "popularity": 4, "standing": -6, "flags": { "dirtyMoney": false } },
      "result": { "fr": "Un chèque, un communiqué de trois lignes, et une régularisation qui ferme le dossier. Cela ne s'appelle pas un aveu, mais tout le monde sait lire.",
                  "en": "A cheque, a three-line statement, and a correction that closes the file. It is not called a confession, but everyone can read." } }
  ]
},


{
  "id": "lobby_bruxelles",
  "weight": 3,
  "when": { "position": ["euro"], "flag": { "onTrial": false } },
  "tag": { "fr": "Bruxelles", "en": "Brussels" },
  "text": {
    "fr": "Un cabinet de conseil vous propose une mission d'expertise : quatre notes par an sur un secteur que vous connaissez, et un montant mensuel qui dépasse votre indemnité. Le secteur est celui dont vous rapportez la directive.",
    "en": "A consultancy offers you an advisory role: four notes a year on a sector you know well, for a monthly fee larger than your salary. The sector is the one whose directive you are drafting."
  },
  "choices": [
    { "label": { "fr": "Refuser et le déclarer au registre", "en": "Refuse it and log it in the register" },
      "effects": { "reputation": 3, "notoriete": 1, "popularity": 4, "standing": -3 },
      "result": { "fr": "Votre refus figure au registre de transparence, où il sera lu par onze personnes. Trois d'entre elles travaillent pour le cabinet.",
                  "en": "Your refusal is logged in the transparency register, where eleven people will read it. Three of them work for the consultancy." } },

    { "label": { "fr": "Accepter, en le déclarant", "en": "Take it, and declare it" },
      "effects": { "money": 120000, "reputation": -1, "popularity": -4, "standing": 3 },
      "result": { "fr": "Tout est légal, tout est public, et personne ne trouve cela normal. C'est très exactement la définition du problème.",
                  "en": "It is all legal, all public, and nobody thinks it is normal. That is precisely the definition of the problem." } },

    { "label": { "fr": "Accepter sans le déclarer", "en": "Take it, and say nothing" },
      "roll": { "stat": "sangfroid", "base": 13, "dice": 15, "plus": { "reseau": 0.25 } },
      "success": { "effects": { "money": 260000, "standing": 5, "reputation": -2, "flags": { "dirtyMoney": true }, "chain": "amendements_dictes" },
        "result": { "fr": "Le virement arrive sur une structure luxembourgeoise au nom de votre belle-sœur. À Bruxelles, personne ne regarde ; c'est bien pour cela qu'on vous y a envoyé.",
                    "en": "The payment lands in a Luxembourg vehicle in your sister-in-law's name. In Brussels, nobody looks; that is rather why they sent you there." } },
      "failure": { "effects": { "money": 200000, "standing": 3, "reputation": -2, "popularity": -6, "flags": { "dirtyMoney": true }, "strike": "casserole", "chain": "amendements_dictes" },
        "result": { "fr": "Une assistante parlementaire voit passer un document qu'elle n'aurait pas dû voir. Elle ne dit rien, et elle en garde une copie.",
                    "en": "A parliamentary assistant sees a document she should not have seen. She says nothing, and she keeps a copy." } } }
  ]
},


{
  "id": "amendements_dictes",
  "delay": [6, 18],
  "weight": 0,
  "tag": { "fr": "Bruxelles", "en": "Brussels" },
  "text": {
    "fr": "Le cabinet vous envoie douze amendements rédigés, à déposer tels quels avant vendredi. Deux d'entre eux vident la directive de ce qu'elle avait d'utile.",
    "en": "The consultancy sends you twelve ready-written amendments to table as they are before Friday. Two of them gut the directive of everything useful in it."
  },
  "choices": [
    { "label": { "fr": "Les déposer tels quels", "en": "Table them as they are" },
      "effects": { "money": 90000, "reputation": -2, "standing": 3, "chain": "fuite_bruxelles" },
      "result": { "fr": "Douze amendements déposés en trois minutes, dont deux qu'aucun élu de votre groupe n'a lus. Le vote a lieu un jeudi soir dans un hémicycle vide.",
                  "en": "Twelve amendments tabled in three minutes, two of which nobody in your group has read. The vote happens on a Thursday evening in an empty chamber." } },

    { "label": { "fr": "N'en déposer que les inoffensifs", "en": "Table only the harmless ones" },
      "roll": { "stat": "eloquence", "base": 12, "dice": 14 },
      "success": { "effects": { "money": 40000, "reputation": 1, "standing": 1 },
        "result": { "fr": "Le cabinet compte les amendements et pas les lignes. Vous gardez l'argent et la directive garde ses dents.",
                    "en": "The consultancy counts amendments, not lines. You keep the money and the directive keeps its teeth." } },
      "failure": { "effects": { "money": -60000, "standing": -5, "reputation": -1, "chain": "fuite_bruxelles" },
        "result": { "fr": "Ils comptent les lignes. Le versement s'arrête, et l'homme qui vous l'annonce précise qu'il a conservé les échanges.",
                    "en": "They count lines. The payments stop, and the man telling you so mentions that he has kept the correspondence." } } },

    { "label": { "fr": "Rompre et rendre l'argent déjà versé", "en": "Break it off and give back what you took" },
      "when": { "minMoney": 200000 },
      "effects": { "money": -190000, "reputation": 3, "standing": -5, "flags": { "dirtyMoney": false } },
      "result": { "fr": "Le virement de retour porte la mention « honoraires non dus ». C'est la phrase la plus chère que vous ayez jamais écrite, et elle vous sauvera.",
                  "en": "The returning transfer is labelled “fees not owed”. It is the most expensive sentence you have ever written, and it will save you." } }
  ]
},


{
  "id": "fuite_bruxelles",
  "delay": [8, 24],
  "weight": 0,
  "tag": { "fr": "Bruxelles", "en": "Brussels" },
  "text": {
    "fr": "Un consortium de journaux publie quarante mille documents internes du cabinet. Votre nom apparaît onze fois, dont une sous un tableau intitulé « élus acquis ».",
    "en": "A consortium of newspapers publishes forty thousand internal documents from the consultancy. Your name appears eleven times, once under a table headed “members secured”."
  },
  "choices": [
    { "label": { "fr": "Tout nier en bloc", "en": "Deny everything" },
      "roll": { "stat": "sangfroid", "base": 15, "dice": 16,
                "bonus": [ { "when": { "comms": 2 }, "value": 3 },
                           { "when": { "legal": 2 }, "value": 2 } ] },
      "success": { "effects": { "popularity": -8, "standing": -4, "reputation": -1, "trait": "teflon" },
        "result": { "fr": "Vous tenez la ligne quatre jours, et le consortium passe au dossier suivant. Il reste onze occurrences de votre nom dans une base de données consultable à vie.",
                    "en": "You hold the line for four days and the consortium moves to the next story. Eleven mentions of your name remain in a database anyone can search, for ever." } },
      "failure": { "effects": { "popularity": -18, "standing": -12, "reputation": -2, "strike": "menteur", "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "Un document porte votre signature manuscrite. Le parquet européen ouvre une information judiciaire le lendemain matin.",
                    "en": "One document carries your handwritten signature. The European prosecutor opens an investigation the next morning." } } },

    { "label": { "fr": "Reconnaître, rembourser, s'excuser", "en": "Admit it, repay it, apologise" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -280000, "reputation": 1, "popularity": -12, "standing": -14, "flags": { "dirtyMoney": false }, "strike": "casserole" },
      "result": { "fr": "L'aveu coupe court à tout. Vous perdez la moitié de ce que vous aviez gagné et la totalité de ce que vous inspiriez.",
                  "en": "The confession ends it all. You lose half of what you made and all of what you inspired." } },

    { "label": { "fr": "Laisser vos avocats gérer et ne rien dire", "en": "Let the lawyers handle it and say nothing" },
      "when": { "legal": 1 },
      "effects": { "money": -70000, "popularity": -13, "standing": -6, "chain": "perquisition" },
      "result": { "fr": "Onze communiqués en trois semaines, aucun mot de vous. La stratégie est bonne juridiquement et désastreuse partout ailleurs.",
                  "en": "Eleven statements in three weeks, not one word from you. The strategy is legally sound and disastrous everywhere else." } }
  ]
},


/* ==========================================================================
   16. LES AFFAIRES
   ==========================================================================
   Trois chaînes inspirées de ce que la vie politique produit régulièrement :
   l'argent qui vient de l'étranger, les emplois qui n'existent pas, les
   dossiers qu'on ouvre sur les autres. Chacune commence par une proposition
   confortable et se termine, si le joueur a de la chance, par un procès.

   La règle d'écriture est la même que partout : rien d'invraisemblable, rien
   qui vise quelqu'un en particulier, et le choix malhonnête doit être le
   plus efficace à court terme. C'est là que se joue la tension morale.
   ========================================================================== */

{
  "id": "financement_etranger",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 28, "notTrait": ["caisse_noire"] },
  "tag": { "fr": "Financement", "en": "Funding" },
  "text": {
    "fr": "Un homme d'affaires très souriant, passeport d'un pays où l'on ne discute pas les résultats électoraux, propose de financer votre campagne « par une fondation culturelle ». Il précise qu'il n'attend rien en retour, ce qui est la seule chose invraisemblable de la conversation.",
    "en": "A very smiling businessman, holding the passport of a country where election results are not debated, offers to fund your campaign “through a cultural foundation”. He specifies that he expects nothing in return, which is the only implausible part of the conversation."
  },
  "choices": [
    { "label": { "fr": "Accepter par la fondation", "en": "Accept through the foundation" },
      "effects": { "money": 260000, "standing": 9, "reseau": 1, "reputation": -1,
                   "flags": { "dirtyMoney": true }, "trait": "caisse_noire", "chain": "argent_etranger" },
      "result": { "fr": "Les virements arrivent en trois fois, avec des libellés qui parlent de colloques. Votre trésorier ne pose aucune question, ce qui est son métier.",
                  "en": "The transfers arrive in three instalments, labelled as conference expenses. Your treasurer asks no questions, which is his job." } },
    { "label": { "fr": "Refuser et ne rien dire", "en": "Decline and say nothing" },
      "effects": { "sangfroid": 1, "reputation": 1, "standing": -3 },
      "result": { "fr": "Vous déclinez poliment. Il ira voir quelqu'un d'autre dans la semaine, et vous saurez qui dans deux ans.",
                  "en": "You decline politely. He will see somebody else within the week, and you will find out who in two years." } },
    { "label": { "fr": "Refuser et le raconter à la presse", "en": "Decline and tell the press" },
      "roll": { "base": 15, "stat": "reputation", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 12, "reputation": 2, "standing": -7 },
        "result": { "fr": "Le récit fait la une trois jours. On vous demande pourquoi vous n'avez pas porté plainte, ce qui est une bonne question.",
                    "en": "The story leads the news for three days. People ask why you did not go to the police, which is a fair question." } },
      "failure": { "effects": { "popularity": -6, "standing": -9, "notoriete": 1 },
        "result": { "fr": "Sans preuve, l'histoire tourne à votre désavantage. L'intéressé dément, son avocat écrit, votre parti soupire.",
                    "en": "With no evidence the story turns against you. The man denies it, his lawyer writes, your party sighs." } } },
    { "label": { "fr": "Accepter, mais tout déclarer à la commission", "en": "Accept, but declare everything" },
      "when": { "background": ["law", "civil"] },
      "effects": { "money": 70000, "reputation": 1, "standing": 3, "popularity": -3, "energie": -1 },
      "result": { "fr": "Déclaré, plafonné, contrôlé : il ne reste presque rien. Vous avez le mérite et le reçu.",
                  "en": "Declared, capped, audited: almost nothing is left. You have the credit and the receipt." } }
  ]
},


{
  "id": "argent_etranger",
  "delay": [8, 20],
  "weight": 0,
  "tag": { "fr": "Douanes", "en": "Customs" },
  "text": {
    "fr": "Un douanier zélé a noté le passage de deux valises en cabine, et un journaliste a récupéré les plans de vol. Il ne vous accuse de rien : il vous demande simplement de confirmer que vous connaissez la fondation.",
    "en": "An overzealous customs officer logged two cabin suitcases, and a reporter has obtained the flight plans. He accuses you of nothing: he simply asks you to confirm that you know the foundation."
  },
  "choices": [
    { "label": { "fr": "Nier connaître la fondation", "en": "Deny knowing the foundation" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.2 },
                                                 { "when": { "stat": { "sangfroid": { "min": 14 } } }, "value": 0.15 } ] },
      "success": { "effects": { "popularity": -4, "standing": 4, "strike": "menteur" },
        "result": { "fr": "Le sujet s'éteint faute de pièces. Il reste dans une note de bas de page, et dans la mémoire du journaliste.",
                    "en": "The story dies for lack of documents. It survives in a footnote, and in the reporter's memory." } },
      "failure": { "effects": { "popularity": -14, "standing": -10, "reputation": -2, "strike": "casserole",
                                "flags": { "investigated": true }, "chain": "commission_enquete" },
        "result": { "fr": "Une photo de vous avec l'intéressé sort le lendemain. Le démenti devient le sujet.",
                    "en": "A photograph of you with the man appears the next day. The denial becomes the story." } } },
    { "label": { "fr": "Rembourser discrètement et vite", "en": "Quietly pay it all back" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -300000, "popularity": -5, "standing": -4, "reputation": 1,
                   "flags": { "dirtyMoney": false }, "untrait": "caisse_noire" },
      "result": { "fr": "L'argent repart d'où il vient, avec des frais. Personne ne vous félicitera jamais pour ça.",
                  "en": "The money goes back where it came from, minus fees. Nobody will ever congratulate you for it." } },
    { "label": { "fr": "Attaquer le journaliste et son journal", "en": "Go after the reporter and his paper" },
      "effects": { "notoriete": 2, "popularity": -13, "standing": 4, "reputation": -2, "chain": "commission_enquete" },
      "result": { "fr": "Votre avocat parle d'atteinte à la présomption d'innocence. Quatre rédactions décident de s'y intéresser de près.",
                  "en": "Your lawyer talks about the presumption of innocence. Four newsrooms decide to take a closer look." } }
  ]
},


{
  "id": "commission_enquete",
  "delay": [6, 16],
  "weight": 0,
  "tag": { "fr": "Commission d'enquête", "en": "Inquiry committee" },
  "text": {
    "fr": "L'Assemblée crée une commission d'enquête. Vous êtes auditionné sous serment, en direct, par des gens qui ont préparé leurs questions et qui savent déjà la moitié des réponses.",
    "en": "Parliament sets up an inquiry committee. You are questioned under oath, live, by people who prepared their questions and already know half the answers."
  },
  "choices": [
    { "label": { "fr": "Mentir sous serment", "en": "Lie under oath" },
      "roll": { "base": 20, "stat": "sangfroid", "plus": { "eloquence": 0.5, "standing": 0.04 },
                "bonus": [ { "when": { "trait": ["teflon"] }, "value": 2 } ], "dice": 16 },
      "success": { "effects": { "popularity": 5, "standing": 6, "strike": "menteur",
                                "flags": { "investigated": false } },
        "result": { "fr": "Trois heures sans une hésitation. La commission conclut à un « manque de clarté » et passe à autre chose.",
                    "en": "Three hours without a stumble. The committee concludes there was “a lack of clarity” and moves on." } },
      "failure": { "effects": { "popularity": -12, "standing": -12, "reputation": -2,
                                "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "Une pièce que vous ne connaissiez pas atterrit sur la table. Le parquet ouvre une information judiciaire le soir même.",
                    "en": "A document you had not seen lands on the table. Prosecutors open a formal investigation that evening." } } },
    { "label": { "fr": "Dire une partie de la vérité", "en": "Tell part of the truth" },
      "effects": { "popularity": -6, "standing": -8, "reputation": 1, "sangfroid": 1,
                   "flags": { "investigated": false, "dirtyMoney": false } },
      "result": { "fr": "Vous reconnaissez l'essentiel en le rendant ennuyeux. C'est la meilleure façon d'éteindre un sujet, et la plus coûteuse.",
                  "en": "You admit the essentials while making them boring. It is the best way to kill a story, and the most expensive." } },
    { "label": { "fr": "Invoquer le secret de l'instruction et se taire", "en": "Cite the ongoing case and say nothing" },
      "effects": { "popularity": -9, "standing": 3, "notoriete": 1, "strike": "casserole" },
      "result": { "fr": "Vous répondez douze fois que vous ne pouvez pas répondre. La séquence tourne en boucle avec une musique de suspense.",
                  "en": "You answer twelve times that you cannot answer. The clip runs on a loop with suspense music underneath." } }
  ]
},


{
  "id": "emploi_fictif",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 16, "notTrait": ["intouchable"] },
  "tag": { "fr": "Collaborateurs", "en": "Staffing" },
  "text": {
    "fr": "Votre enveloppe de collaborateurs est votre affaire, et personne ne vérifie vraiment qui la touche. Votre belle-sœur cherche un poste, et elle est, vous en êtes convaincu, parfaitement compétente pour un travail que vous n'arrivez pas à décrire.",
    "en": "Your staffing budget is your business, and nobody really checks who receives it. Your sister-in-law is looking for a job, and she is, you are convinced, perfectly qualified for work you cannot quite describe."
  },
  "choices": [
    { "label": { "fr": "L'embaucher comme attachée parlementaire", "en": "Hire her as a parliamentary assistant" },
      "effects": { "money": 90000, "energie": 1, "reputation": -2, "flags": { "dirtyMoney": true }, "chain": "emploi_fictif_presse" },
      "result": { "fr": "Le contrat est signé un vendredi soir. Elle passera au bureau deux fois en trois ans, dont une pour un pot de départ.",
                  "en": "The contract is signed on a Friday evening. She will come to the office twice in three years, once for a leaving party." } },
    { "label": { "fr": "Embaucher un vrai collaborateur compétent", "en": "Hire an actual competent staffer" },
      "effects": { "money": -40000, "energie": 2, "eloquence": 1, "standing": 2 },
      "result": { "fr": "Vos dossiers sont mieux préparés que ceux de vos collègues. Personne ne s'en apercevra avant longtemps.",
                  "en": "Your files are better prepared than your colleagues'. Nobody will notice for a long time." } },
    { "label": { "fr": "Refuser net et le faire savoir en famille", "en": "Say no, and let the family know" },
      "effects": { "reputation": 2, "reseau": -1, "energie": -1 },
      "result": { "fr": "Le repas de Noël sera tendu. Vous dormez très bien.",
                  "en": "Christmas dinner will be tense. You sleep very well." } },
    { "label": { "fr": "L'embaucher chez un ami, qui vous doit un service", "en": "Get a friend to hire her instead" },
      "when": { "personality": ["calculating"] },
      "effects": { "reseau": 2, "standing": 4, "reputation": -1, "money": 15000 },
      "result": { "fr": "Elle est salariée d'une société de conseil qui travaille beaucoup pour des collectivités. Le montage est légal, ou personne n'a envie de vérifier.",
                  "en": "She is on the payroll of a consultancy that works a great deal for local authorities. The arrangement is legal, or nobody wants to check." } }
  ]
},


{
  "id": "emploi_fictif_presse",
  "delay": [8, 24],
  "weight": 0,
  "tag": { "fr": "Hebdomadaire", "en": "The weekly" },
  "text": {
    "fr": "Un hebdomadaire satirique demande à voir les contrats, les fiches de paie et « tout élément permettant d'établir la réalité du travail fourni ». Ils publient jeudi, avec ou sans votre réponse.",
    "en": "A satirical weekly asks to see the contracts, the payslips and “any material establishing that the work was actually done”. They publish on Thursday, with or without your answer."
  },
  "choices": [
    { "label": { "fr": "Fabriquer des notes de travail", "en": "Manufacture some work notes" },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "background": ["law", "comms"] }, "value": 0.2 } ] },
      "success": { "effects": { "popularity": -5, "standing": 3, "strike": "menteur" },
        "result": { "fr": "Douze pages antidatées, imprimées sur du vieux papier. Le journal publie quand même, mais sans la certitude qu'il espérait.",
                    "en": "Twelve backdated pages, printed on old paper. The paper publishes anyway, but without the certainty it wanted." } },
      "failure": { "effects": { "popularity": -18, "standing": -14, "reputation": -2, "strike": "casserole",
                                "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "La police scientifique date l'encre. Ce détail vous suivra jusqu'au tribunal.",
                    "en": "Forensics date the ink. That detail will follow you all the way to court." } } },
    { "label": { "fr": "Tout rembourser avant la publication", "en": "Repay everything before publication" },
      "effects": { "money": -120000, "popularity": -7, "standing": -5, "reputation": 1,
                   "flags": { "dirtyMoney": false } },
      "result": { "fr": "Le chèque part le mercredi. L'article sort quand même, avec la mention du remboursement au dernier paragraphe.",
                  "en": "The cheque goes out on Wednesday. The article runs anyway, with the repayment in the final paragraph." } },
    { "label": { "fr": "Assumer : « c'est légal, et je le referais »", "en": "Own it: “it is legal, and I would do it again”" },
      "effects": { "notoriete": 2, "popularity": -12, "standing": 8, "sangfroid": 1, "strike": "casserole" },
      "result": { "fr": "Une partie du milieu vous trouve courageux. Le pays retient surtout le montant, qu'il compare au sien.",
                  "en": "Part of the political world finds you brave. The country mostly remembers the amount, and compares it to its own." } }
  ]
},


{
  "id": "dossier_adversaire",
  "when": { "minTurn": 24, "position": ["maire", "depute", "ministre", "chef"] },
  "tag": { "fr": "Le dossier", "en": "The file" },
  "text": {
    "fr": "Un ancien policier reconverti dans « l'intelligence économique » vous propose un dossier sur {rival}. Il l'ouvre devant vous : des relevés bancaires, des adresses, une histoire de famille compliquée. Le prix est raisonnable, ce qui est le plus inquiétant.",
    "en": "A former police officer now in “business intelligence” offers you a file on {rival}. He opens it in front of you: bank records, addresses, a complicated family story. The price is reasonable, which is the most worrying part."
  },
  "choices": [
    { "label": { "fr": "Acheter et le faire sortir dans la presse", "en": "Buy it and get it into the press" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -50000, "notoriete": 2, "popularity": 6, "standing": 5, "reputation": -2,
                   "chain": "dossier_retour_flamme" },
      "result": { "fr": "L'affaire sort trois semaines plus tard sous la signature d'un journaliste que vous ne connaissez pas. Votre rival annule ses déplacements.",
                  "en": "The story runs three weeks later under the byline of a reporter you do not know. Your rival cancels his engagements." } },
    { "label": { "fr": "Acheter et le garder au chaud", "en": "Buy it and keep it in a drawer" },
      "when": { "minMoney": 60000 },
      "effects": { "money": -50000, "standing": 8, "reseau": 1, "sangfroid": 1, "reputation": -1,
                   "chain": "dossier_retour_flamme" },
      "result": { "fr": "Le dossier dort dans un coffre. Votre rival ne sait pas pourquoi vous lui souriez comme ça en réunion.",
                  "en": "The file sleeps in a safe. Your rival cannot work out why you smile at him like that in meetings." } },
    { "label": { "fr": "Refuser et le mettre dehors", "en": "Refuse and show him the door" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": -4 },
      "result": { "fr": "Il repart sans insister. Il ira voir votre rival, qui a peut-être un dossier sur vous.",
                  "en": "He leaves without pushing. He will go and see your rival, who may well have a file on you." } },
    { "label": { "fr": "Prévenir votre rival de ce qui circule", "en": "Warn your rival about what is circulating" },
      "effects": { "reseau": 2, "reputation": 2, "popularity": -3, "standing": -2 },
      "result": { "fr": "Il vous remercie froidement, comme quelqu'un qui vient de comprendre qu'il vous doit quelque chose.",
                  "en": "He thanks you coldly, like a man who has just realised he owes you something." } }
  ]
},


{
  "id": "dossier_retour_flamme",
  "delay": [10, 28],
  "weight": 0,
  "tag": { "fr": "Retour de bâton", "en": "Blowback" },
  "text": {
    "fr": "L'ancien policier a été mis en examen dans une autre affaire, et il parle beaucoup. Votre nom figure sur une facture, à côté du mot « prestation documentaire ».",
    "en": "The former police officer has been charged in another case, and he is talking a great deal. Your name appears on an invoice, next to the words “documentary services”."
  },
  "choices": [
    { "label": { "fr": "Assumer une prestation légale de veille", "en": "Call it a legal monitoring service" },
      "roll": { "base": 17, "stat": "sangfroid", "plus": { "eloquence": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "popularity": -5, "standing": 2, "sangfroid": 1 },
        "result": { "fr": "Vous parlez de veille concurrentielle avec un tel sérieux que le sujet devient technique, donc ennuyeux, donc mort.",
                    "en": "You talk about competitive monitoring so earnestly that the story turns technical, therefore boring, therefore dead." } },
      "failure": { "effects": { "popularity": -13, "standing": -10, "reputation": -2, "strike": "casserole",
                                "flags": { "investigated": true } },
        "result": { "fr": "Le mot « barbouze » apparaît dans un titre. Il ne vous quittera plus.",
                    "en": "The word “spook” appears in a headline. It will never leave you again." } } },
    { "label": { "fr": "Charger un collaborateur qui a agi seul", "en": "Blame a staffer who acted alone" },
      "effects": { "popularity": -6, "standing": 5, "reputation": -3, "reseau": -2, "strike": "traitre" },
      "result": { "fr": "Il assume tout en conférence de presse, la mâchoire serrée. Votre équipe a compris ce qui l'attend si elle se trompe.",
                  "en": "He takes the blame at a press conference, jaw clenched. Your staff have understood what awaits them if they slip." } },
    { "label": { "fr": "Tout reconnaître et présenter des excuses", "en": "Admit everything and apologise" },
      "effects": { "popularity": 3, "standing": -12, "reputation": 2, "notoriete": 1 },
      "result": { "fr": "Vous dites que c'était une faute et que vous en assumez les conséquences. Le pays apprécie, l'appareil note.",
                  "en": "You say it was a mistake and that you accept the consequences. The country appreciates it; the machine takes notes." } }
  ]
},


{
  "id": "cabinet_conseil",
  "when": { "position": ["depute", "ministre", "chef"], "minStanding": 45 },
  "tag": { "fr": "Consultants", "en": "Consultants" },
  "text": {
    "fr": "Un grand cabinet de conseil propose d'écrire votre programme « en méthodologie agile », pour un tarif journalier qui dépasse le salaire mensuel de vos militants. La présentation compte quatre-vingts pages et deux idées.",
    "en": "A large consulting firm offers to write your platform “with an agile methodology”, at a daily rate higher than your activists' monthly wage. The deck runs to eighty slides and two ideas."
  },
  "choices": [
    { "label": { "fr": "Signer : c'est propre et rapide", "en": "Sign: it is clean and fast" },
      "effects": { "money": -140000, "standing": 7, "eloquence": 1, "popularity": -6, "reputation": -1 },
      "result": { "fr": "Le programme est irréprochable et ne ressemble à personne. Vos militants le découvrent en même temps que la presse.",
                  "en": "The platform is flawless and sounds like nobody. Your activists discover it at the same time as the press." } },
    { "label": { "fr": "Le faire écrire par vos militants", "en": "Have your activists write it" },
      "effects": { "energie": -2, "reseau": 2, "popularity": 7, "standing": -3 },
      "result": { "fr": "Six mois d'ateliers, quatre-vingts contributions et deux bagarres. Le texte est bancal et il est de vous.",
                  "en": "Six months of workshops, eighty contributions and two fights. The text is uneven and it is yours." } },
    { "label": { "fr": "Signer, puis dénoncer les cabinets en meeting", "en": "Sign, then attack consultants at a rally" },
      "when": { "personality": ["calculating", "provocative"] },
      "effects": { "money": -140000, "notoriete": 2, "popularity": 11, "standing": 2, "reputation": -2, "strike": "menteur" },
      "result": { "fr": "La formule « l'État n'est pas une start-up » fait un triomphe. La facture, elle, est dans les comptes de campagne.",
                  "en": "The line “the state is not a start-up” brings the house down. The invoice, meanwhile, is in the campaign accounts." } },
    { "label": { "fr": "Refuser et le raconter", "en": "Refuse, and say so publicly" },
      "effects": { "popularity": 8, "reputation": 1, "standing": -6, "notoriete": 1 },
      "result": { "fr": "Vous publiez le devis. Trois de vos collègues, clients du même cabinet, cessent de vous parler.",
                  "en": "You publish the quote. Three colleagues, clients of the same firm, stop speaking to you." } }
  ]
},


{
  "id": "cadeau_encombrant",
  "when": { "stat": { "notoriete": { "min": 8 } }, "minTurn": 12 },
  "tag": { "fr": "Cadeaux", "en": "Gifts" },
  "text": {
    "fr": "Un ami entrepreneur vous fait livrer trois costumes et une montre, « entre amis, sans facture ». Le tout vaut à peu près deux ans de smic, et il vous rappelle en riant que ça ne se déclare pas.",
    "en": "An entrepreneur friend has three suits and a watch delivered to you, “between friends, no invoice”. Together they are worth about two years of minimum wage, and he laughingly reminds you that this does not get declared."
  },
  "choices": [
    { "label": { "fr": "Garder, et les porter", "en": "Keep them, and wear them" },
      "effects": { "money": 25000, "charisme": 1, "reputation": -2, "flags": { "dirtyMoney": true } },
      "result": { "fr": "Vous êtes très bien habillé pendant deux ans. Un photographe finira par s'intéresser à votre poignet.",
                  "en": "You are very well dressed for two years. A photographer will eventually take an interest in your wrist." } },
    { "label": { "fr": "Renvoyer le tout avec un mot sec", "en": "Send it all back with a curt note" },
      "effects": { "reputation": 2, "reseau": -2, "standing": -3 },
      "result": { "fr": "Il le prend très mal et le raconte partout. Votre réputation d'incorruptible vous coûtera d'autres dîners.",
                  "en": "He takes it very badly and tells everyone. Your incorruptible reputation will cost you other dinners." } },
    { "label": { "fr": "Les donner à une association, devant témoins", "en": "Give them to charity, with witnesses" },
      "effects": { "popularity": 7, "reputation": 2, "notoriete": 1, "reseau": -1, "energie": -1 },
      "result": { "fr": "La photo de la remise circule bien. Votre ami comprend qu'il vient de financer votre communication.",
                  "en": "The handover photo travels well. Your friend realises he has just funded your public relations." } },
    { "label": { "fr": "Garder la montre, rendre les costumes", "en": "Keep the watch, return the suits" },
      "effects": { "money": 12000, "sangfroid": 1, "reputation": -1 },
      "result": { "fr": "Le compromis moral le plus courant de la vie politique, et le plus difficile à expliquer.",
                  "en": "The most common moral compromise in politics, and the hardest to explain." } }
  ]
},


{
  "id": "vacances_officielles",
  "when": { "position": ["depute", "ministre", "chef"], "minMoney": 50000 },
  "tag": { "fr": "Vacances", "en": "Holidays" },
  "text": {
    "fr": "Vous êtes invité une semaine dans un pays ami, avion privé et villa avec vue. Le régime en question emprisonne ses journalistes, mais son ambassadeur insiste sur la qualité de la lumière en cette saison.",
    "en": "You are invited for a week to a friendly country, private jet and a villa with a view. The regime in question jails its journalists, but its ambassador insists on the quality of the light at this time of year."
  },
  "choices": [
    { "label": { "fr": "Y aller et se reposer vraiment", "en": "Go, and actually rest" },
      "effects": { "energie": 3, "money": 20000, "reputation": -2, "popularity": -7, "reseau": 1 },
      "result": { "fr": "Vous revenez bronzé et en forme. Une photo du yacht circulera au pire moment, comme toujours.",
                  "en": "You come back tanned and rested. A photo of the yacht will surface at the worst possible moment, as they always do." } },
    { "label": { "fr": "Y aller et parler des prisonniers politiques", "en": "Go, and raise the political prisoners" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 10, "reputation": 2, "reseau": -1, "energie": -1 },
        "result": { "fr": "Deux détenus sont libérés le mois suivant. Personne ne saura jamais si c'est grâce à vous, et vous laisserez dire.",
                    "en": "Two detainees are released the following month. Nobody will ever know whether it was thanks to you, and you will let people assume." } },
      "failure": { "effects": { "popularity": -5, "reseau": -2, "standing": -4, "energie": -1 },
        "result": { "fr": "On vous écoute poliment et on ne vous rappelle plus. Votre ministère des affaires étrangères vous en veut.",
                    "en": "They listen politely and never call again. Your own foreign ministry is furious with you." } } },
    { "label": { "fr": "Refuser publiquement l'invitation", "en": "Turn the invitation down publicly" },
      "effects": { "popularity": 9, "reputation": 2, "reseau": -2, "energie": -1, "standing": -4 },
      "result": { "fr": "Votre lettre de refus est reprise partout. Trois collègues qui y allaient chaque année vous détestent désormais.",
                  "en": "Your refusal letter is quoted everywhere. Three colleagues who went every year now detest you." } },
    { "label": { "fr": "Envoyer un collaborateur à votre place", "en": "Send a staffer instead" },
      "effects": { "reseau": 1, "energie": 1, "reputation": -1, "standing": 2 },
      "result": { "fr": "Il revient enchanté et vous rapporte trois contacts utiles. Techniquement, vous n'y étiez pas.",
                  "en": "He comes back delighted with three useful contacts. Technically, you were not there." } }
  ]
}
,

/* ==========================================================================
   L'ARGENT QUI DORT
   ==========================================================================
   Tout ce paquet racontait comment on gagne de l'argent qu'on n'aurait pas
   dû gagner, et comment on se fait prendre. Rien ne racontait l'autre moitié
   du sujet : ce qu'on fait d'un compte plein. Un héritier de la grande
   bourgeoisie commence la partie avec trois millions et n'avait, pendant
   quarante ans de carrière, aucune raison d'y toucher — l'argent restait une
   clé qui ouvrait des options ailleurs, jamais une décision en soi.

   Ces scènes-là ne sortent que pour ceux qui ont de quoi. Elles proposent
   toutes de convertir de l'argent en autre chose, et aucune ne le fait
   gratuitement : un capital qui devient du réseau, de la réputation ou du
   rendement se voit, et ce qui se voit se paie.
   ========================================================================== */

{
  "id": "argent_qui_dort",
  "weight": 2,
  "when": { "minMoney": 700000, "yearEnd": true },
  "weightBonus": [ { "when": { "minMoney": 2000000 }, "value": 2 } ],
  "tag": { "fr": "Fin d'année", "en": "Year end" },
  "text": {
    "fr": "Décembre. Votre conseiller vous rappelle, pour la troisième fois cette année, que l'argent qui dort sur un compte courant ne fait rien pour personne, à commencer par vous. Il a préparé trois pages et il attend une réponse avant le 31.",
    "en": "December. Your adviser reminds you, for the third time this year, that money asleep in a current account does nothing for anybody, starting with you. He has prepared three pages and wants an answer before the thirty-first."
  },
  "choices": [
    { "label": { "fr": "Privatiser un restaurant et inviter du beau monde", "en": "Take over a restaurant and invite the right people" },
      "when": { "minMoney": 700000 },
      "roll": { "chance": 0.62, "chanceBonus": [ { "when": { "stat": { "reseau": { "min": 12 } } }, "value": 0.15 },
                                                 { "when": { "stat": { "charisme": { "min": 13 } } }, "value": 0.12 },
                                                 { "when": { "origin": ["bourgeois", "dynasty"] }, "value": 0.1 } ] },
      "success": { "effects": { "money": -45000, "reseau": 2, "standing": 3, "notoriete": 1 },
        "result": { "fr": "Vingt-deux couverts, une salle fermée, aucun téléphone sur les tables. Il ne se décide rien ce soir-là et tout devient possible pendant les six mois qui suivent.",
                    "en": "Twenty-two covers, a closed room, no telephones on the tables. Nothing is decided that evening and everything becomes possible for the next six months." } },
      "failure": { "effects": { "money": -45000, "popularity": -4, "reputation": -2, "standing": 1 },
        "result": { "fr": "Quelqu'un photographie la salle depuis le trottoir et la légende s'écrit toute seule. On comptera les bouteilles à l'image, et le chiffre sera faux, et il circulera quand même.",
                    "en": "Somebody photographs the room from the pavement and the caption writes itself. People will count the bottles in the picture, and the number will be wrong, and it will travel anyway." } } },
    { "label": { "fr": "Placer sur des actions à fort rendement", "en": "Put it into high-yield shares" },
      "when": { "minMoney": 700000 },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "background": ["business"] }, "value": 0.18 },
                                                 { "when": { "minMoney": 3000000 }, "value": 0.1 } ] },
      "success": { "effects": { "money": 190000, "reputation": -1 },
        "result": { "fr": "Le portefeuille rend en un an ce qu'un député gagne en deux, et il le rendra encore l'année prochaine sans que vous ayez à vous lever. C'est la première inégalité et vous êtes du bon côté.",
                    "en": "The portfolio returns in one year what a member of parliament earns in two, and it will do it again next year without you getting out of bed. It is the first inequality and you are on the right side of it." } },
      "failure": { "effects": { "money": -240000, "sangfroid": 1 },
        "result": { "fr": "Le secteur décroche en mars et votre conseiller emploie le mot correction, qui veut dire que l'argent est parti. Vous apprenez à ne plus ouvrir le relevé le matin.",
                    "en": "The sector drops in March and your adviser uses the word correction, which means the money has gone. You learn to stop opening the statement in the morning." } } },
    { "label": { "fr": "Donner à une œuvre, et le faire savoir", "en": "Give to a charity, and make sure it is known" },
      "when": { "minMoney": 700000 },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "comms": 2 }, "value": 0.15 },
                                                { "when": { "personality": ["principled"] }, "value": 0.12 } ] },
      "success": { "effects": { "money": -150000, "reputation": 2, "popularity": 5, "standing": -1 },
        "result": { "fr": "Le don est réel, la maraude aussi, et la photo est prise à hauteur d'homme par quelqu'un qui sait faire. Personne ne vous croit désintéressé et tout le monde trouve que c'est mieux que rien.",
                    "en": "The gift is real, so is the soup run, and the photograph is taken at eye level by somebody who knows how. Nobody thinks you are selfless and everybody agrees it beats nothing." } },
      "failure": { "effects": { "money": -150000, "popularity": -3, "reputation": -1 },
        "result": { "fr": "Le communiqué sort avant le virement, d'une heure. Une heure suffit : c'est le communiqué qu'on retient, et la directrice de l'association passe sa semaine à répondre à des questions qui ne la concernent pas.",
                    "en": "The press release goes out an hour before the transfer. An hour is enough: it is the release that people remember, and the charity's director spends her week answering questions that are none of her business." } } },
    { "label": { "fr": "Ne rien faire, l'argent ne vous a jamais gêné", "en": "Do nothing; the money has never bothered you" },
      "effects": { "energie": 1 },
      "result": { "fr": "Vous refermez les trois pages et vous les rangez. L'argent dort, il rapporte ce que rapporte l'argent qui dort, et il figurera à la ligne près dans votre prochaine déclaration de patrimoine.",
                  "en": "You close the three pages and put them away. The money sleeps, it earns what sleeping money earns, and it will appear to the euro in your next declaration of assets." } }
  ]
},

{
  "id": "permanence_achetee",
  "weight": 2,
  "when": { "minMoney": 500000, "position": ["maire", "depute", "euro"] },
  "tag": { "fr": "La permanence", "en": "The office" },
  "text": {
    "fr": "L'ancienne mercerie de la rue principale est en vente depuis huit mois. Votre équipe vous en parle chaque semaine : vitrine sur la rue, deux étages, et le prix a baissé deux fois.",
    "en": "The old haberdasher's on the main street has been for sale for eight months. Your team raises it every week: a window on the street, two floors, and the price has come down twice."
  },
  "choices": [
    { "label": { "fr": "L'acheter et payer deux permanents", "en": "Buy it and pay two staffers" },
      "when": { "minMoney": 500000 },
      "effects": { "money": -280000, "standing": 6, "reseau": 2, "appeal": { "self": 3 }, "energie": -1 },
      "result": { "fr": "Une adresse, une sonnette, quelqu'un derrière la porte du mardi au samedi. Ce n'est pas de la politique, c'est de l'immobilier, et cela vaut trois campagnes.",
                  "en": "An address, a doorbell, somebody behind the door from Tuesday to Saturday. It is not politics, it is property, and it is worth three campaigns." } },
    { "label": { "fr": "Louer une salle deux soirs par semaine", "en": "Rent a room two evenings a week" },
      "effects": { "money": -35000, "standing": 2, "appeal": { "self": 1 } },
      "result": { "fr": "La salle des fêtes le mardi, l'arrière-salle du café le jeudi. On vous trouve si l'on sait où chercher, ce qui écarte à peu près tout le monde.",
                  "en": "The village hall on Tuesday, the back room of the café on Thursday. People can find you if they know where to look, which rules out very nearly everybody." } },
    { "label": { "fr": "Garder l'argent, le mandat ne dure pas", "en": "Keep the money; the mandate will not last" },
      "effects": { "standing": -3, "reputation": 1 },
      "result": { "fr": "Vous expliquez à votre équipe qu'on n'achète pas un local pour un mandat qui peut s'arrêter dans trois ans. Ils comprennent l'argument et retiennent que vous avez prévu de perdre.",
                  "en": "You explain to your team that one does not buy premises for a mandate that may end in three years. They take the point, and they remember that you have planned to lose." } }
  ]
},

{
  "id": "fondation",
  "weight": 2,
  "when": { "minMoney": 1800000, "minTurn": 12 },
  "tag": { "fr": "La fondation", "en": "The foundation" },
  "text": {
    "fr": "Trois universitaires vous proposent de financer une fondation à votre nom : des notes, des colloques, deux chercheurs à plein temps. Ils ont un budget, un statut juridique et un logo. Il ne manque que l'argent, et il ne manque que le vôtre.",
    "en": "Three academics propose that you fund a foundation in your name: papers, conferences, two full-time researchers. They have a budget, a legal status and a logo. All that is missing is the money, and the only money missing is yours."
  },
  "choices": [
    { "label": { "fr": "Financer la fondation en entier", "en": "Fund the foundation in full" },
      "when": { "minMoney": 1800000 },
      "roll": { "chance": 0.58, "chanceBonus": [ { "when": { "background": ["academia", "civil"] }, "value": 0.18 },
                                                 { "when": { "stat": { "credibilite": { "min": 13 } } }, "value": 0.14 } ] },
      "success": { "effects": { "money": -700000, "credibilite": 2, "notoriete": 2, "reseau": 2, "reputation": 1 },
        "result": { "fr": "La première note sort en avril, la deuxième est citée par un ministre en juin, et la troisième est écrite par quelqu'un qui n'est pas d'accord avec vous. C'est celle-là qui fait la réputation de la maison.",
                    "en": "The first paper comes out in April, the second is quoted by a minister in June, and the third is written by somebody who disagrees with you. That is the one that makes the house's name." } },
      "failure": { "effects": { "money": -700000, "popularity": -4, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "Un hebdomadaire compte les salariés, les compare à ceux de votre cabinet, et emploie le mot antichambre. La fondation publie trois notes en deux ans et n'en dément aucune.",
                    "en": "A weekly counts the staff, compares them with your own office, and uses the word antechamber. The foundation publishes three papers in two years and denies none of it." } } },
    { "label": { "fr": "Financer une chaire, et ne pas y mettre votre nom", "en": "Fund a chair, and keep your name off it" },
      "effects": { "money": -350000, "credibilite": 2, "reseau": 1, "standing": -2 },
      "result": { "fr": "La chaire porte le nom d'une économiste morte en 1991. Personne ne saura jamais que vous l'avez payée, ce qui était l'idée et reste, six mois plus tard, un peu frustrant.",
                  "en": "The chair is named after an economist who died in 1991. Nobody will ever know you paid for it, which was the point and remains, six months later, faintly frustrating." } },
    { "label": { "fr": "Refuser : une fondation, c'est un cabinet noir", "en": "Refuse: a foundation is a shadow office" },
      "effects": { "reputation": 1, "reseau": -1 },
      "result": { "fr": "Vous leur dites que vous savez très bien à quoi cela sert, et que c'est justement le problème. Ils financeront la fondation de quelqu'un d'autre, et vous lirez ses notes.",
                  "en": "You tell them you know perfectly well what it is for, and that this is precisely the problem. They will fund somebody else's foundation, and you will read its papers." } }
  ]
}
,

{
  "id": "chef_perquisition",
  "weight": 4,
  "when": { "partyLead": true, "ruling": false, "minTurn": 24, "flag": { "onTrial": false } },
  "tag": { "fr": "Sept heures dix", "en": "Ten past seven" },
  "text": {
    "fr": "Deux équipes, deux adresses : le siège du parti et votre appartement. L'enquête porte sur les comptes de la dernière campagne et sur les contrats de six salariés. Les scellés sont posés sur trois bureaux, les ordinateurs partent dans des cartons numérotés, et une caméra est devant la porte du siège avant les enquêteurs. Le parquet précise que le signalement date de onze mois. Le ministre de l'intérieur déclare qu'il l'a appris par la presse.",
    "en": "Two teams, two addresses: party headquarters and your flat. The investigation covers the accounts of the last campaign and the contracts of six staff members. Seals go on three offices, the computers leave in numbered boxes, and a television camera is outside the headquarters door before the investigators are. The prosecutor points out that the referral is eleven months old. The interior minister says he learned of it from the press."
  },
  "choices": [
    { "label": { "fr": "Forcer le cordon et hurler devant les caméras", "en": "Push through the cordon and shout in front of the cameras" },
      "when": { "personality": ["provocative"] },
      "roll": { "base": 19, "stat": "charisme", "plus": { "notoriete": 0.4, "eloquence": 0.3 }, "dice": 16 },
      "success": { "effects": { "appeal": { "self": 15, "others": -6 }, "notoriete": 4, "credibilite": -2,
                                "reputation": -1, "energie": -2, "landscape": { "self": 0.7 } },
        "result": { "fr": "Onze secondes de cri devant une porte, reprises en boucle pendant quatre jours. Votre base n'a pas été aussi mobilisée depuis six ans et le reste du pays regarde la même vidéo en tirant la conclusion inverse. Les deux camps la partagent, avec le même montage.",
                    "en": "Eleven seconds of shouting in a doorway, looped for four days. Your base has not been this mobilised in six years and the rest of the country watches the same video and draws the opposite conclusion. Both sides share it, in the same edit." } },
      "failure": { "effects": { "popularity": -13, "credibilite": -3, "reputation": -2, "notoriete": 3,
                                "standing": -5, "energie": -2, "appeal": { "self": 4 } },
        "result": { "fr": "La séquence dure quatre minutes et l'on n'en retient pas une phrase, seulement une main sur un torse et un bras qu'on écarte. Vos propres cadres regardent leurs chaussures dans le hall pendant que vous parlez.",
                    "en": "The sequence lasts four minutes and not one sentence of it survives, only a hand on a chest and an arm pushed aside. Your own senior figures study their shoes in the lobby while you are speaking." } },
      "debacle": { "effects": { "popularity": -16, "credibilite": -4, "reputation": -2, "notoriete": 4,
                                "standing": -6, "energie": -2, "strike": "casserole" },
        "result": { "fr": "Un procès-verbal est dressé le soir même pour le poignet d'un enquêteur et pour la porte. Vous êtes convoqué pour ça, et non pour les comptes, et c'est désormais la seule chose que les portraits raconteront de cette matinée.",
                     "en": "A report is filed that same evening over an investigator's wrist and over the door. You are summoned for that, and not for the accounts, and it is now the only thing any profile will tell of that morning." } } },

    { "label": { "fr": "Tout ouvrir, et publier les comptes vous-même le soir même", "en": "Open everything, and publish the accounts yourself that evening" },
      "effects": { "credibilite": 3, "reputation": 2, "popularity": 6, "standing": -2, "energie": -2,
                   "appeal": { "self": -7 } },
      "effectsIf": [
        { "when": { "flag": { "dirtyMoney": true } },
          "effects": { "flags": { "onTrial": true }, "chain": "proces", "popularity": -15,
                       "standing": -12, "reputation": -2, "credibilite": -3 } }
      ],
      "result": { "fr": "Vous ouvrez les trois bureaux, y compris celui que personne n'avait demandé, et les comptes sont en ligne à vingt-deux heures avec les annexes. Ce que contiennent les cartons, vous le savez mieux que quiconque, et il n'y a plus qu'à attendre qu'ils soient lus. Vos militants, eux, voulaient qu'on se batte.",
                  "en": "You open all three offices, including the one nobody had asked for, and the accounts are online by ten at night with the annexes. What the boxes contain, you know better than anyone, and there is nothing left to do but wait for them to be read. Your activists, for their part, wanted a fight." } },

    { "label": { "fr": "Attaquer sur la date : onze mois de signalement, et une descente maintenant", "en": "Go after the timing: eleven months on the referral, and a raid now" },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "credibilite": 0.4, "notoriete": 0.25 }, "dice": 16 },
      "success": { "effects": { "axis": { "power": -60 }, "popularity": 10, "notoriete": 2, "credibilite": 1,
                                "standing": 4, "landscape": { "self": 0.8 } },
        "result": { "fr": "Vous ne contestez rien du fond et vous ne parlez que du calendrier : la date du signalement, la date de la saisine, la date de la caméra. Personne ne vous répond sur la caméra, et c'est la seule des trois dates que le pays retient.",
                    "en": "You dispute none of the substance and talk only about the calendar: the date of the referral, the date of the case being opened, the date of the camera. Nobody answers you on the camera, and it is the only one of the three dates the country remembers." } },
      "failure": { "effects": { "popularity": -7, "credibilite": -2, "standing": -3, "energie": -1 },
        "result": { "fr": "Le parquet publie une chronologie de deux pages le lendemain matin, avec les numéros de procédure. Elle est ennuyeuse, vérifiable, et elle tient. On retient que vous avez parlé du calendrier pendant huit minutes sans dire un mot des six contrats.",
                    "en": "The prosecutor publishes a two-page chronology the next morning, with the case numbers. It is dull, checkable, and it holds. What is remembered is that you talked about the calendar for eight minutes without saying a word about the six contracts." } } },

    { "label": { "fr": "Laisser l'avocat parler et ne rien dire pendant quinze jours", "en": "Let the lawyer speak and say nothing for a fortnight" },
      "effects": { "credibilite": 2, "standing": 2, "energie": 1, "notoriete": -2, "popularity": -5,
                   "appeal": { "self": -6 } },
      "result": { "fr": "Trois communiqués en quinze jours, tous exacts, tous illisibles. Le dossier sort du fil d'actualité en huit jours, ce qui est exactement l'objectif, et vos fédérations passent ces huit jours à demander pourquoi personne ne défend le parti.",
                  "en": "Three statements in a fortnight, all accurate, all unreadable. The story drops out of the news feed within eight days, which is precisely the aim, and your federations spend those eight days asking why nobody is defending the party." } },

    { "label": { "fr": "Prendre le cabinet qui a fait tomber la dernière commission d'enquête", "en": "Hire the firm that took down the last inquiry" },
      "when": { "minMoney": 250000 },
      "effects": { "money": -180000, "credibilite": 2, "standing": 4, "reputation": -1, "popularity": -3,
                   "reseau": 1 },
      "result": { "fr": "Quatre associés, une note de procédure en soixante-douze heures et trois scellés contestés sur onze. Deux d'entre eux tomberont, ce qui ne change rien au fond et repousse tout de quatorze mois. La facture est réglée par le parti, en trois fois, et figure au compte de l'exercice suivant.",
                  "en": "Four partners, a procedural opinion within seventy-two hours and three of the eleven seals challenged. Two of them will be quashed, which changes nothing on the substance and pushes everything back by fourteen months. The bill is paid by the party, in three instalments, and appears in the following year's accounts." } }
  ]
}
];
