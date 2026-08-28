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
      "effects": { "axis": {"social": -60, "power": -70}, "notoriete": 2, "reseau": 1, "reputation": -1, "standing": 14, "popularity": 6 },
      "result": { "fr": "L'image de vous face aux grilles devient un symbole, adoré et détesté.",
                  "en": "The image of you at the gates becomes a symbol, loved and hated." } },
    { "label": { "fr": "Dénoncer les violences des deux côtés", "en": "Condemn violence on all sides" },
      "effects": { "reputation": 1, "reseau": -2, "standing": -15, "popularity": 8, "appeal": { "self": -9 } },
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
      "success": { "effects": { "reseau": 1, "reputation": 2, "standing": 12 },
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
      "effects": { "axis": {"economy": -85, "social": -50}, "landscape": { "radical_left": 1 }, "reseau": 2, "notoriete": 1, "standing": 12, "popularity": 7 },
      "result": { "fr": "Les images vous installent comme un chef de camp. Le pays fatigué, lui, vous en veut.",
                  "en": "The pictures install you as a leader of a side. The exhausted country resents you." } },
    { "label": { "fr": "Appeler à la négociation", "en": "Call for negotiation" },
      "effects": { "landscape": { "self": 0.7 }, "eloquence": 1, "reputation": 1, "popularity": 8, "standing": -9, "appeal": { "self": -6 } },
      "result": { "fr": "Vous jouez les médiateurs. Les deux camps vous soupçonnent de l'autre.",
                  "en": "You play mediator. Each side suspects you of belonging to the other." } },
    { "label": { "fr": "Loger et nourrir les grévistes", "en": "House and feed the strikers" },
      "when": { "minMoney": 120000 },
      "effects": { "axis": {"economy": -70}, "landscape": { "radical_left": 0.8 }, "money": -80000, "reseau": 2, "standing": 14, "popularity": 5 },
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
      "success": { "effects": { "reseau": 1, "notoriete": 1, "standing": 12 },
        "result": { "fr": "Votre camp l'emporte. Vous voilà identifié, donc attendu.",
                    "en": "Your side wins. You are now marked, therefore expected." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "reseau": -2, "standing": -16 },
        "result": { "fr": "Votre camp perd. On range votre nom dans les vaincus.",
                    "en": "Your side loses. Your name is filed with the defeated." } } },
    { "label": { "fr": "Écrire une motion à votre nom", "en": "Table a motion in your own name" },
      "when": { "personality": ["provocative", "principled"] },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "standing": 0.05, "reseau": 0.4 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 0.6 }, "notoriete": 2, "standing": 13, "appeal": { "self": 5 } },
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
      "effects": { "landscape": { "self": -1, "identitarians": 0.8 }, "reseau": 1, "reputation": -1, "standing": 11, "popularity": -10, "appeal": { "identitarians": 7 } },
      "result": { "fr": "L'accord passe. Vous êtes désormais « quelqu'un qui compte ».",
                  "en": "The deal goes through. You are now “someone who matters”." } },
    { "label": { "fr": "Défendre l'indépendance", "en": "Defend independence" },
      "effects": { "landscape": { "self": 1.2 }, "reputation": 2, "reseau": -1, "standing": -9, "popularity": 9, "appeal": { "identitarians": -9 } },
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
      "effects": { "axis": {"world": -70, "social": -40}, "reputation": 2, "notoriete": 1, "popularity": 11, "standing": -6 },
      "result": { "fr": "Le geste vous grandit. Une partie de votre électorat ne vous le pardonnera pas.",
                  "en": "The gesture makes you look big. Part of your base will never forgive it." } },
    { "label": { "fr": "Renvoyer les deux dos à dos", "en": "Refuse to choose" },
      "effects": { "axis": {"power": -60}, "reputation": -2, "popularity": 7, "standing": 7 },
      "result": { "fr": "« Ni l'un ni l'autre. » La formule vous protège et vous rapetisse.",
                  "en": "“Neither of them.” The line protects you and shrinks you." } },
    { "label": { "fr": "Négocier votre soutien contre des garanties", "en": "Trade your backing for guarantees" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 13 },
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
      "effects": { "axis": {"economy": 80}, "standing": 12, "popularity": 9, "sangfroid": 1 },
      "result": { "fr": "« Le marché corrige. » Les salariés licenciés apprécient moyennement.",
                  "en": "“The market corrects itself.” The laid-off workers are unimpressed." } },
    { "label": { "fr": "Reconnaître une erreur", "en": "Admit a mistake" },
      "effects": { "reputation": 2, "popularity": 10, "standing": -14, "appeal": { "self": -8 } },
      "result": { "fr": "L'aveu est rare en politique. Il vous coûte tout votre crédit interne.",
                  "en": "Such an admission is rare in politics. It costs you all your internal credit." } },
    { "label": { "fr": "Proposer une régulation ciblée", "en": "Propose targeted regulation" },
      "when": { "personality": ["clever"] },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "axis": {"economy": -35}, "reputation": 2, "popularity": 10, "standing": 4 },
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
      "effects": { "axis": "self", "reseau": 2, "notoriete": 1, "reputation": -1, "standing": 12, "popularity": 9, "strike": "radical" },
      "result": { "fr": "Ovation en interne, éditoriaux au vitriol. Chacun son public.",
                  "en": "A standing ovation inside, scathing editorials outside. Each to their audience." } },
    { "label": { "fr": "Tenir une ligne modérée", "en": "Hold a moderate line" },
      "effects": { "axis": {"social": -10, "world": -60, "economy": 25, "power": 10}, "reputation": 1, "reseau": -2, "standing": -13, "popularity": 11 },
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
      "effects": { "axis": "self", "notoriete": 2, "reputation": -1, "standing": 11, "popularity": 7, "strike": "radical" },
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
      "effects": { "reputation": 2, "popularity": 8, "standing": -13, "reseau": -1, "appeal": { "self": -8 } },
      "result": { "fr": "La fermeté est saluée dehors. Dedans, on parle de purge.",
                  "en": "The firmness is praised outside. Inside, they call it a purge." } },
    { "label": { "fr": "Minimiser l'affaire", "en": "Play it down" },
      "effects": { "axis": "self", "standing": 9, "popularity": 8, "reputation": -1, "strike": "casserole" },
      "result": { "fr": "« Une phrase malheureuse. » Le parti vous remercie, le pays note.",
                  "en": "“An unfortunate turn of phrase.” The party thanks you; the country notices." } },
    { "label": { "fr": "Le convaincre de se retirer lui-même", "en": "Persuade him to step aside himself" },
      "when": { "personality": ["charming", "calculating"] },
      "roll": { "base": 14, "stat": "charisme", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "reputation": 1, "standing": 5 },
        "result": { "fr": "Il annonce son retrait « pour raisons personnelles ». Tout le monde a gagné.",
                    "en": "He announces his withdrawal “for personal reasons”. Everyone wins." } },
      "failure": { "effects": { "standing": -9, "popularity": -6 },
        "result": { "fr": "Il refuse et raconte votre visite. Vous passez pour un manipulateur.",
                    "en": "He refuses and describes your visit. You look like a manipulator." } } }
  ]
}
,

/* ==========================================================================
   PLUS POPULAIRE QUE SON PROPRE PRÉSIDENT
   --------------------------------------------------------------------------
   La situation la plus instable d'un camp au pouvoir, et le jeu ne la
   connaissait pas : on pouvait dépasser de vingt points celui qui occupe
   l'Élysée, dans son propre parti, sans qu'une seule scène s'en aperçoive.

   Trois temps, qui ne se commandent pas : le sondage qui l'installe, la
   convocation qu'il provoque, et la fronde qu'on décide ou non de mener. La
   fronde réussie ne vous fait pas président — on ne remplace pas un président
   en exercice — elle le fait renoncer, ce qui ouvre la primaire suivante.
   ========================================================================== */

{
  "id": "plus_populaire_que_lui",
  "weight": 5,
  "when": { "outshinePresident": true, "minTurn": 20, "minPopularity": 60 },
  "tag": { "fr": "Le sondage de trop", "en": "One poll too many" },
  "text": {
    "fr": "Un institut publie la cote des personnalités du camp au pouvoir. Vous êtes premier, le président est quatrième, et c'est la troisième fois d'affilée. À midi, trois rédactions vous demandent si vous êtes candidat à quelque chose.",
    "en": "A polling institute publishes the standing of the governing camp's figures. You are first, the president is fourth, and it is the third time running. By noon, three newsrooms are asking whether you are a candidate for anything."
  },
  "choices": [
    { "label": { "fr": "Démentir, chaleureusement et sans ambiguïté", "en": "Deny it, warmly and without ambiguity" },
      "effects": { "standing": 8, "reputation": 2, "popularity": -5, "credibilite": 1 },
      "result": { "fr": "Vous dites que le président a votre soutien entier et que ces classements ne veulent rien dire. Les deux moitiés de la phrase sont fausses, et tout le monde préfère la première.",
                  "en": "You say the president has your full backing and that these rankings mean nothing. Both halves of the sentence are untrue, and everybody prefers the first." } },

    { "label": { "fr": "Ne rien dire du tout et laisser courir", "en": "Say nothing at all and let it run" },
      "effects": { "popularity": 6, "notoriete": 2, "standing": -6, "sangfroid": 1 },
      "result": { "fr": "Un silence de quarante-huit heures vaut une déclaration, et celle-là est entendue de l'Élysée avant midi. Vous n'avez rien dit, ce qui est précisément ce qu'on vous reprochera.",
                  "en": "Forty-eight hours of silence is a statement, and this one is heard at the palace before noon. You said nothing, which is precisely what will be held against you." } },

    { "label": { "fr": "Répondre que le pays choisira le moment venu", "en": "Answer that the country will choose when the time comes" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "sangfroid": 0.4, "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "credibilite": 2, "notoriete": 2, "standing": -8 },
        "result": { "fr": "Une phrase qui ne dit ni oui ni non et que personne ne peut vous faire retirer. Elle sera citée pendant deux ans, et elle vient de vous coûter le camp sans vous coûter le pays.",
                    "en": "A sentence that says neither yes nor no and that nobody can make you withdraw. It will be quoted for two years, and it has just cost you the camp without costing you the country." } },
      "failure": { "effects": { "popularity": -4, "standing": -11, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "Vous cherchez la formule et vous trouvez l'ambiguïté. Reprise sans ses virgules, elle devient une candidature contre le président de votre propre camp.",
                    "en": "You reach for a formula and find an ambiguity. Quoted without its commas, it becomes a candidacy against the president of your own camp." } } }
  ]
},

{
  "id": "president_convoque",
  "weight": 3,
  "when": { "outshinePresident": true },
  "tag": { "fr": "Convoqué", "en": "Summoned" },
  "text": {
    "fr": "Le président vous reçoit seul, sans conseiller et sans note. Il a lu les mêmes sondages que vous, il ne les cite pas une seule fois, et il vous parle pendant quarante minutes de la cohésion du camp comme d'une chose fragile.",
    "en": "The president sees you alone, with no adviser and no notes. He has read the same polls you have, does not mention them once, and talks to you for forty minutes about the cohesion of the camp as a fragile thing."
  },
  "choices": [
    { "label": { "fr": "Le rassurer, et le penser à moitié", "en": "Reassure him, and half mean it" },
      "effects": { "standing": 7, "reseau": 2, "popularity": -3, "credibilite": 1 },
      "result": { "fr": "Vous sortez avec une poignée de main devant les caméras et l'assurance qu'on ne vous oubliera pas. Les deux ont exactement la même valeur.",
                  "en": "You leave with a handshake in front of the cameras and an assurance that you will not be forgotten. Both are worth exactly the same." } },

    { "label": { "fr": "Demander un ministère régalien, tout de suite", "en": "Ask for a great office of state, right now" },
      "when": { "position": ["depute", "maire", "euro"] },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "popularity": 0.06, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "office": "ministre", "standing": 6, "credibilite": 2, "popularity": -3 },
        "result": { "fr": "Il vous nomme dans les dix jours. On appelle cela une promotion ; dans son entourage, on appelle cela mettre quelqu'un là où il devra rendre des comptes.",
                    "en": "He appoints you within ten days. It is called a promotion; in his circle it is called putting somebody where they will have to answer for things." } },
      "failure": { "effects": { "standing": -8, "popularity": -2, "reputation": -1 },
        "result": { "fr": "Il vous écoute jusqu'au bout, vous remercie de votre franchise, et ne rappelle pas. Vous avez montré votre prix sans obtenir l'achat.",
                    "en": "He hears you out, thanks you for your frankness, and does not call back. You showed your price without making the sale." } } },

    { "label": { "fr": "Lui dire la vérité : vous serez candidat", "en": "Tell him the truth: you will run" },
      "effects": { "popularity": 5, "credibilite": 2, "reputation": 2, "standing": -12, "notoriete": 1 },
      "result": { "fr": "Vous le lui dites en face, ce que personne ne fait jamais, et il vous en remercie sincèrement avant de vous couper de tout pendant trois ans. Aucun des deux ne l'oubliera.",
                  "en": "You say it to his face, which nobody ever does, and he thanks you sincerely before cutting you off from everything for three years. Neither of you will forget it." } }
  ]
},

{
  "id": "fronde_president",
  "weight": 4,
  "cast": "camp_senior",
  "when": { "outshinePresident": true, "minTurn": 28, "minStanding": 45, "maxApproval": 44 },
  "tag": { "fr": "La fronde", "en": "The revolt" },
  "text": {
    "fr": "{rival} vient vous voir avec une idée qui n'est pas de {lui} : le camp ne repartira pas avec le président sortant, et il faut qu'on le lui dise avant qu'il annonce. Ils sont onze à le penser et zéro à vouloir le dire.",
    "en": "{rival} comes to see you with an idea that is not {his} own: the camp will not go again with the sitting president, and somebody has to tell him before he announces. Eleven of them think so and none of them wants to say it."
  },
  "choices": [
    { "label": { "fr": "Mener la fronde, et signer de votre nom", "en": "Lead the revolt, and sign your name to it" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "popularity": 0.06, "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "flags": { "presidentRenonce": true }, "standing": 9, "credibilite": 2,
                                "notoriete": 2, "popularity": 4, "reputation": -2, "approval": -6 },
        "result": { "fr": "Il annonce trois semaines plus tard qu'il ne sollicitera pas un nouveau mandat, pour des raisons personnelles que personne ne croit. L'investiture est libre, et tout le monde sait à qui l'on doit ça.",
                    "en": "Three weeks later he announces he will not seek another term, for personal reasons nobody believes. The nomination is open, and everybody knows who to thank." } },
      "failure": { "effects": { "standing": -15, "popularity": -3, "trait": "traitre", "approval": 4 },
        "result": { "fr": "Sur les onze, quatre se souviennent soudain qu'ils n'avaient rien dit. Le président tient, la liste des signataires existe, et vous êtes le premier nom dessus.",
                    "en": "Of the eleven, four suddenly remember they had said nothing. The president holds on, the list of signatories exists, and yours is the first name on it." } } },

    { "label": { "fr": "Les laisser la mener et rester en dehors", "en": "Let them lead it and stay out of it" },
      "effects": { "sangfroid": 2, "credibilite": 1, "standing": -3, "popularity": 1 },
      "result": { "fr": "Vous écoutez, vous ne promettez rien, et vous ne signez pas. Si elle réussit vous serez là ; si elle échoue vous n'y étiez pas. C'est lâche, c'est efficace, et cela s'apprend tard.",
                  "en": "You listen, promise nothing and sign nothing. If it succeeds you will be there; if it fails you were not. It is cowardly, it is effective, and it takes years to learn." } },

    { "label": { "fr": "Prévenir le président", "en": "Warn the president" },
      "effects": { "standing": 11, "reseau": 2, "reputation": -2, "popularity": -6, "approval": 3, "strike": "traitre" },
      "result": { "fr": "Vous lui donnez les onze noms un dimanche soir. Il vous devra quelque chose et ne vous fera plus jamais confiance, ce qui est le tarif habituel de ce genre de service.",
                  "en": "You give him the eleven names on a Sunday evening. He will owe you something and will never trust you again, which is the going rate for that kind of favour." } }
  ]
}
];
