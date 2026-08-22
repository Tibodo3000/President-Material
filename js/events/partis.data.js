/* Généré — ne pas éditer à la main. */
const EV_partis = [


/* ==========================================================================
   10. PROPRES À CHAQUE PARTI
   ========================================================================== */

{
  "id": "manif_reprimee",
  "weight": 5,
  "when": { "party": ["radical_left"] },
  "tag": { "fr": "Mouvement", "en": "The movement" },
  "text": {
    "fr": "Une manifestation soutenue par le parti dégénère. Des militants sont en garde à vue.",
    "en": "A demonstration backed by the party turns ugly. Activists are in custody."
  },
  "choices": [
    { "label": { "fr": "Aller devant le commissariat", "en": "Stand outside the police station" },
      "effects": { "notoriete": 2, "reseau": 1, "reputation": -1, "standing": 14, "popularity": -6 },
      "result": { "fr": "L'image de vous face aux grilles devient un symbole, adoré et détesté.",
                  "en": "The image of you at the gates becomes a symbol, loved and hated." } },
    { "label": { "fr": "Dénoncer les violences des deux côtés", "en": "Condemn violence on all sides" },
      "effects": { "reputation": 1, "reseau": -2, "standing": -15, "popularity": 10 },
      "result": { "fr": "La base parle de trahison. Les plateaux vous trouvent raisonnable.",
                  "en": "The base calls it betrayal. The talk shows call you reasonable." } },
    { "label": { "fr": "Payer les avocats des interpellés", "en": "Pay for the detainees' lawyers" },
      "when": { "minMoney": 100000 },
      "effects": { "money": -60000, "reseau": 2, "standing": 16, "reputation": 1 },
      "result": { "fr": "Vous ne dites rien publiquement, vous payez. Le parti l'apprend et ne l'oublie pas.",
                  "en": "You say nothing publicly; you pay. The party finds out and never forgets." } },
    { "label": { "fr": "Négocier leur libération avec la préfecture", "en": "Negotiate their release with the prefecture" },
      "when": { "background": ["civil", "law"] },
      "roll": { "base": 14, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "reputation": 2, "standing": 12, "popularity": 6 },
        "result": { "fr": "Tous ressortent avant minuit. Personne ne saura jamais comment.",
                    "en": "They are all out before midnight. Nobody will ever know how." } },
      "failure": { "effects": { "standing": -6, "popularity": -3 },
        "result": { "fr": "On vous éconduit poliment. Les gardes à vue vont au bout.",
                    "en": "You are politely turned away. The detentions run their full course." } } }
  ]
},


{
  "id": "greve_generale",
  "weight": 5,
  "when": { "party": ["radical_left", "socdem"] },
  "tag": { "fr": "Social", "en": "Industrial action" },
  "text": {
    "fr": "Une grève paralyse le pays depuis trois semaines. Les syndicats attendent que vous choisissiez un camp.",
    "en": "A strike has paralysed the country for three weeks. The unions are waiting for you to pick a side."
  },
  "choices": [
    { "label": { "fr": "Rejoindre les piquets de grève", "en": "Join the picket lines" },
      "effects": { "landscape": { "radical_left": 1 }, "reseau": 2, "notoriete": 1, "standing": 12, "popularity": -7 },
      "result": { "fr": "Les images vous installent comme un chef de camp. Le pays fatigué, lui, vous en veut.",
                  "en": "The pictures install you as a leader of a side. The exhausted country resents you." } },
    { "label": { "fr": "Appeler à la négociation", "en": "Call for negotiation" },
      "effects": { "landscape": { "self": 0.7 }, "eloquence": 1, "reputation": 1, "popularity": 9, "standing": -9 },
      "result": { "fr": "Vous jouez les médiateurs. Les deux camps vous soupçonnent de l'autre.",
                  "en": "You play mediator. Each side suspects you of belonging to the other." } },
    { "label": { "fr": "Loger et nourrir les grévistes", "en": "House and feed the strikers" },
      "when": { "minMoney": 120000 },
      "effects": { "landscape": { "radical_left": 0.8 }, "money": -80000, "reseau": 2, "standing": 14, "popularity": -4 },
      "result": { "fr": "Vos caisses de grève tiennent trois semaines de plus. Les syndicats s'en souviendront.",
                  "en": "Your strike fund holds three more weeks. The unions will remember." } },
    { "label": { "fr": "Proposer une médiation technique", "en": "Offer technical mediation" },
      "when": { "background": ["civil", "academia"] },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reseau": 0.3 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 1 }, "reputation": 3, "reseau": 1, "popularity": 14, "standing": 4 },
        "result": { "fr": "Votre proposition débloque le conflit en dix jours. Les deux camps vous doivent quelque chose.",
                    "en": "Your proposal breaks the deadlock in ten days. Both sides owe you something." } },
      "failure": { "effects": { "landscape": { "self": -0.6 }, "popularity": -5, "standing": -4 },
        "result": { "fr": "Votre plan est jugé technocratique par les uns, naïf par les autres.",
                    "en": "Your plan is called technocratic by some, naive by others." } } }
  ]
},


{
  "id": "synthese",
  "weight": 5,
  "when": { "party": ["socdem"] },
  "tag": { "fr": "Congrès", "en": "Conference" },
  "text": {
    "fr": "Le parti se déchire entre deux motions. On vous propose d'écrire la synthèse que personne ne veut signer.",
    "en": "The party is split between two motions. You are asked to draft the compromise nobody wants to sign."
  },
  "choices": [
    { "label": { "fr": "Écrire la synthèse", "en": "Draft the compromise" },
      "effects": { "landscape": { "self": 0.5 }, "reseau": 2, "notoriete": -1, "standing": 13, "popularity": -6, "trait": "appareil" },
      "result": { "fr": "Le texte est illisible et tout le monde vous en sait gré.",
                  "en": "The text is unreadable and everyone is grateful." } },
    { "label": { "fr": "Choisir un camp", "en": "Pick a side" },
      "roll": { "stat": "reseau", "base": 13, "dice": 16 },
      "success": { "effects": { "reseau": 1, "notoriete": 1, "standing": 12, "popularity": 5 },
        "result": { "fr": "Votre camp l'emporte. Vous voilà identifié, donc attendu.",
                    "en": "Your side wins. You are now marked, therefore expected." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "reseau": -2, "standing": -16 },
        "result": { "fr": "Votre camp perd. On range votre nom dans les vaincus.",
                    "en": "Your side loses. Your name is filed with the defeated." } } },
    { "label": { "fr": "Écrire une motion à votre nom", "en": "Table a motion in your own name" },
      "when": { "personality": ["provocative", "principled"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "standing": 0.05, "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 0.6 }, "notoriete": 2, "standing": 13, "popularity": 7 },
        "result": { "fr": "Votre motion arrive troisième et devient la ligne du parti deux ans plus tard.",
                    "en": "Your motion comes third and becomes party policy two years later." } },
      "failure": { "effects": { "landscape": { "self": -0.9 }, "standing": -12, "reseau": -1 },
        "result": { "fr": "Onze pour cent. On vous conseille de mûrir encore un peu.",
                    "en": "Eleven per cent. You are advised to mature a little longer." } } },
    { "label": { "fr": "Acheter la paix avec des postes", "en": "Buy peace with jobs" },
      "when": { "minStanding": 55 },
      "effects": { "reseau": 2, "standing": 11, "reputation": -2 },
      "result": { "fr": "Six vice-présidences créées pour l'occasion. Le congrès se termine dans les sourires.",
                  "en": "Six vice-presidencies created for the occasion. The conference ends in smiles." } }
  ]
},


{
  "id": "grande_coalition",
  "weight": 5,
  "when": { "party": ["centrists", "socdem"] },
  "tag": { "fr": "Alliances", "en": "Alliances" },
  "text": {
    "fr": "Le parti négocie un accord avec un voisin encombrant. On vous sonde : faut-il signer ?",
    "en": "The party is negotiating a deal with an awkward neighbour. You are asked: should we sign?"
  },
  "choices": [
    { "label": { "fr": "Pousser à l'accord", "en": "Push for the deal" },
      "effects": { "landscape": { "self": -1, "identitarians": 0.8 }, "reseau": 1, "reputation": -1, "standing": 11, "popularity": -10 },
      "result": { "fr": "L'accord passe. Vous êtes désormais « quelqu'un qui compte ».",
                  "en": "The deal goes through. You are now “someone who matters”." } },
    { "label": { "fr": "Défendre l'indépendance", "en": "Defend independence" },
      "effects": { "landscape": { "self": 1.2 }, "reputation": 2, "reseau": -1, "standing": -9, "popularity": 11 },
      "result": { "fr": "L'accord se fait sans vous. La pureté a un coût.",
                  "en": "The deal happens without you. Purity has a price." } },
    { "label": { "fr": "Négocier en secret et démentir en public", "en": "Negotiate in secret and deny it publicly" },
      "effects": { "landscape": { "self": -0.8, "identitarians": 0.6 }, "standing": 8, "popularity": -3, "reputation": -2, "sangfroid": 1, "strike": "menteur" },
      "result": { "fr": "Vous obtenez les postes et le bénéfice de l'opposition. Cela tiendra jusqu'à la première indiscrétion.",
                  "en": "You get the jobs and the credit for opposing. It will hold until the first indiscretion." } }
  ]
},


{
  "id": "ni_ni",
  "weight": 5,
  "when": { "party": ["centrists"] },
  "tag": { "fr": "Positionnement", "en": "Positioning" },
  "text": {
    "fr": "Un second tour oppose les deux extrêmes. Le pays entier attend votre consigne de vote.",
    "en": "A run-off pits the two extremes against each other. The whole country is waiting for your instruction."
  },
  "choices": [
    { "label": { "fr": "Appeler à faire barrage", "en": "Call for a blocking vote" },
      "effects": { "reputation": 2, "notoriete": 1, "popularity": 11, "standing": -6 },
      "result": { "fr": "Le geste vous grandit. Une partie de votre électorat ne vous le pardonnera pas.",
                  "en": "The gesture makes you look big. Part of your base will never forgive it." } },
    { "label": { "fr": "Renvoyer les deux dos à dos", "en": "Refuse to choose" },
      "effects": { "reputation": -2, "popularity": -9, "standing": 7 },
      "result": { "fr": "« Ni l'un ni l'autre. » La formule vous protège et vous rapetisse.",
                  "en": "“Neither of them.” The line protects you and shrinks you." } },
    { "label": { "fr": "Négocier votre soutien contre des garanties", "en": "Trade your backing for guarantees" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 13, "popularity": 4 },
        "result": { "fr": "Vous obtenez trois engagements écrits avant d'appeler à voter. Personne ne le saura.",
                    "en": "You extract three written commitments before calling for a vote. Nobody will know." } },
      "failure": { "effects": { "reputation": -2, "popularity": -8, "standing": -5 },
        "result": { "fr": "La négociation fuite entre les deux tours. Le marchandage est à la une.",
                    "en": "The talks leak between the rounds. The bargaining is front-page news." } } }
  ]
},


{
  "id": "conflit_interets",
  "weight": 5,
  "when": { "party": ["liberals", "conservatives"], "minMoney": 200000 },
  "tag": { "fr": "Affaires", "en": "Business" },
  "text": {
    "fr": "Un journal révèle que vous siégez toujours au conseil d'une entreprise concernée par un texte que vous défendez.",
    "en": "A paper reveals you still sit on the board of a company affected by a bill you support."
  },
  "choices": [
    { "label": { "fr": "Démissionner du conseil", "en": "Resign from the board" },
      "effects": { "money": -50000, "reputation": 1, "popularity": 7, "standing": -4 },
      "result": { "fr": "Vous partez avec élégance et sans jetons de présence.",
                  "en": "You leave gracefully, and without the fees." } },
    { "label": { "fr": "Ne rien lâcher", "en": "Give up nothing" },
      "effects": { "reputation": -2, "money": 30000, "popularity": -13, "standing": 3 },
      "result": { "fr": "« Tout est légal. » C'est vrai, et ça n'arrange rien.",
                  "en": "“It is all legal.” True, and it helps nothing." } },
    { "label": { "fr": "Placer vos parts dans un aveugle", "en": "Put your holdings in a blind trust" },
      "when": { "background": ["business", "law"] },
      "effects": { "money": -20000, "reputation": 2, "popularity": 8, "standing": 4 },
      "result": { "fr": "Le montage est irréprochable et incompréhensible. Les journalistes abandonnent.",
                  "en": "The arrangement is impeccable and incomprehensible. The journalists give up." } }
  ]
},


{
  "id": "deregulation",
  "weight": 5,
  "when": { "party": ["liberals"] },
  "tag": { "fr": "Doctrine", "en": "Doctrine" },
  "text": {
    "fr": "Une faillite retentissante suit une dérégulation que votre parti a portée. On vous demande si vous regrettez.",
    "en": "A spectacular bankruptcy follows a deregulation your party championed. You are asked whether you regret it."
  },
  "choices": [
    { "label": { "fr": "Assumer la doctrine", "en": "Stand by the doctrine" },
      "effects": { "standing": 12, "popularity": -11, "sangfroid": 1 },
      "result": { "fr": "« Le marché corrige. » Les salariés licenciés apprécient moyennement.",
                  "en": "“The market corrects itself.” The laid-off workers are unimpressed." } },
    { "label": { "fr": "Reconnaître une erreur", "en": "Admit a mistake" },
      "effects": { "reputation": 2, "popularity": 12, "standing": -14 },
      "result": { "fr": "L'aveu est rare en politique. Il vous coûte tout votre crédit interne.",
                  "en": "Such an admission is rare in politics. It costs you all your internal credit." } },
    { "label": { "fr": "Proposer une régulation ciblée", "en": "Propose targeted regulation" },
      "when": { "personality": ["clever"] },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reputation": 2, "popularity": 10, "standing": 4 },
        "result": { "fr": "Vous corrigez sans renier. C'est l'exercice le plus difficile en politique.",
                    "en": "You correct without recanting. The hardest exercise in politics." } },
      "failure": { "effects": { "popularity": -5, "standing": -8 },
        "result": { "fr": "Ni les libéraux ni les autres ne vous suivent. Le texte meurt seul.",
                    "en": "Neither the liberals nor anyone else follows. The text dies alone." } } }
  ]
},


{
  "id": "polemique_valeurs",
  "weight": 5,
  "when": { "party": ["conservatives"] },
  "tag": { "fr": "Valeurs", "en": "Values" },
  "text": {
    "fr": "Un débat de société enflamme le pays. Votre base attend une position tranchée, le centre vous regarde.",
    "en": "A culture-war debate is tearing through the country. Your base wants a hard line; the centre is watching."
  },
  "choices": [
    { "label": { "fr": "Donner à la base ce qu'elle attend", "en": "Give the base what it wants" },
      "effects": { "reseau": 2, "notoriete": 1, "reputation": -1, "standing": 12, "popularity": -8, "strike": "radical" },
      "result": { "fr": "Ovation en interne, éditoriaux au vitriol. Chacun son public.",
                  "en": "A standing ovation inside, scathing editorials outside. Each to their audience." } },
    { "label": { "fr": "Tenir une ligne modérée", "en": "Hold a moderate line" },
      "effects": { "reputation": 1, "reseau": -2, "standing": -13, "popularity": 11 },
      "result": { "fr": "Les électeurs du centre notent votre nom. Votre base aussi.",
                  "en": "Centrist voters note your name. So does your base." } },
    { "label": { "fr": "Déplacer le débat sur l'économie", "en": "Shift the debate to the economy" },
      "when": { "personality": ["calculating", "clever"] },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "eloquence": 1, "popularity": 8, "standing": 5 },
        "result": { "fr": "Vous refusez le terrain qu'on vous impose et vous imposez le vôtre.",
                    "en": "You refuse the ground you are handed and impose your own." } },
      "failure": { "effects": { "popularity": -7, "standing": -6 },
        "result": { "fr": "L'esquive se voit. Les deux camps vous accusent de fuir.",
                    "en": "The dodge is obvious. Both camps accuse you of running away." } } }
  ]
},


{
  "id": "cordon_sanitaire",
  "weight": 5,
  "when": { "party": ["identitarians"] },
  "tag": { "fr": "Médias", "en": "Media" },
  "text": {
    "fr": "Une chaîne annule votre invitation sous la pression. Le mot « censure » est déjà dans toutes les bouches de votre camp.",
    "en": "A channel cancels your appearance under pressure. The word “censorship” is already on every lip in your camp."
  },
  "choices": [
    { "label": { "fr": "Faire de l'annulation un étendard", "en": "Turn the cancellation into a banner" },
      "effects": { "notoriete": 2, "reputation": -1, "standing": 11, "popularity": -3, "strike": "radical" },
      "result": { "fr": "La vidéo de votre réaction dépasse l'audience de l'émission.",
                  "en": "The video of your reaction outdraws the show itself." } },
    { "label": { "fr": "Répondre par une longue interview écrite", "en": "Answer with a long written interview" },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": 9, "standing": -5 },
      "result": { "fr": "Le texte est repris, discuté, découpé. Moins fort, plus durable.",
                  "en": "The piece is quoted, debated, dissected. Quieter, but it lasts." } },
    { "label": { "fr": "Créer votre propre média", "en": "Launch your own outlet" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -220000, "notoriete": 3, "standing": 12, "popularity": -2 },
      "result": { "fr": "Studio, plateau, équipe. Vous n'aurez plus jamais besoin qu'on vous invite.",
                  "en": "A studio, a set, a team. You will never need an invitation again." } },
    { "label": { "fr": "Saisir le régulateur", "en": "Take it to the broadcasting regulator" },
      "when": { "background": ["law"] },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "stat": { "notoriete": { "min": 12 } } }, "value": 0.2 } ] },
      "success": { "effects": { "reputation": 2, "notoriete": 1, "popularity": 7, "standing": 8 },
        "result": { "fr": "Le régulateur vous donne raison. La chaîne doit vous réinviter.",
                    "en": "The regulator rules in your favour. The channel has to invite you back." } },
      "failure": { "effects": { "popularity": -3, "standing": 3 },
        "result": { "fr": "Le recours est rejeté. Votre camp y voit une preuve de plus.",
                    "en": "The complaint is dismissed. Your camp sees it as further proof." } } }
  ]
},


{
  "id": "militant_encombrant",
  "weight": 5,
  "when": { "party": ["identitarians", "radical_left"] },
  "tag": { "fr": "Encombrant", "en": "An awkward member" },
  "text": {
    "fr": "Un cadre de votre fédération tient des propos qui feront la une demain. Il a beaucoup d'amis dans le parti.",
    "en": "A regional official says something that will be front-page news tomorrow. He has many friends in the party."
  },
  "choices": [
    { "label": { "fr": "L'exclure immédiatement", "en": "Expel him immediately" },
      "effects": { "reputation": 2, "popularity": 10, "standing": -13, "reseau": -1 },
      "result": { "fr": "La fermeté est saluée dehors. Dedans, on parle de purge.",
                  "en": "The firmness is praised outside. Inside, they call it a purge." } },
    { "label": { "fr": "Minimiser l'affaire", "en": "Play it down" },
      "effects": { "standing": 9, "popularity": -12, "reputation": -1, "strike": "casserole" },
      "result": { "fr": "« Une phrase malheureuse. » Le parti vous remercie, le pays note.",
                  "en": "“An unfortunate turn of phrase.” The party thanks you; the country notices." } },
    { "label": { "fr": "Le convaincre de se retirer lui-même", "en": "Persuade him to step aside himself" },
      "when": { "personality": ["charming", "calculating"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "reputation": 1, "popularity": 6, "standing": 5 },
        "result": { "fr": "Il annonce son retrait « pour raisons personnelles ». Tout le monde a gagné.",
                    "en": "He announces his withdrawal “for personal reasons”. Everyone wins." } },
      "failure": { "effects": { "standing": -9, "popularity": -6 },
        "result": { "fr": "Il refuse et raconte votre visite. Vous passez pour un manipulateur.",
                    "en": "He refuses and describes your visit. You look like a manipulator." } } }
  ]
}
];
