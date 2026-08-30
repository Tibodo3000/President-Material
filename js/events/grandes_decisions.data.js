/* Un paquet d'événements. Le schéma est en tête de js/events/_assemble.data.js. */
const EV_grandes_decisions = [


/* ==========================================================================
   12. GRANDES DÉCISIONS — événements à choix multiples
   ==========================================================================
   Ces événements offrent plus de deux voies, et certaines ne s'ouvrent que
   si vous êtes la bonne personne au bon moment. Le losange dans l'interface
   signale une option débloquée par votre situation.
   ========================================================================== */

{
  "id": "crise_nationale",
  "weight": 3,
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Crise nationale", "en": "National crisis" },
  "text": {
    "fr": "Une catastrophe industrielle fait douze morts. Le gouvernement est muet et le pays cherche quelqu'un à écouter.",
    "en": "An industrial disaster kills twelve people. The government is silent and the country is looking for someone to listen to."
  },
  "choices": [
    { "label": { "fr": "Se rendre sur place immédiatement", "en": "Go there immediately" },
      "roll": { "base": 19, "stat": "sangfroid",
                "plus": { "charisme": 0.35, "popularity": 0.03 },
                "bonus": [ { "when": { "stat": { "energie": { "min": 12 } } }, "value": 1.5 },
                           { "when": { "maxStanding": 35 }, "value": -1.5 } ], "dice": 16 },
      "success": { "effects": { "credibilite": +2, "notoriete": 2, "reputation": 2, "energie": -1, "popularity": 17, "standing": 4 },
        "result": { "fr": "Vous êtes sur les lieux avant les ministres. Les images vous installent.",
                    "en": "You are on site before the ministers. The pictures make you." } },
      "failure": { "effects": { "credibilite": -2, "energie": -1, "popularity": -7, "reputation": -1 },
        "result": { "fr": "On vous reproche le déplacement, jugé opportuniste. Vous gênez les secours.",
                    "en": "The visit is called opportunistic. You are in the rescuers' way." } } },
    { "label": { "fr": "Exiger une commission d'enquête", "en": "Demand a commission of inquiry" },
      "effects": { "credibilite": +2, "eloquence": 1, "standing": 9, "popularity": -5, "energie": -1 },
      "result": { "fr": "La procédure est lente et sérieuse. Elle portera votre nom dans deux ans.",
                  "en": "The procedure is slow and serious. It will carry your name in two years." } },
    { "label": { "fr": "Accuser nommément les responsables", "en": "Name and shame those responsible" },
      "roll": { "base": 18, "stat": "notoriete",
                "plus": { "charisme": 0.45 },
                "bonus": [ { "when": { "personality": ["provocative"] }, "value": 2.5 },
                           { "when": { "party": ["radical_left", "identitarians"] }, "value": 1.5 } ], "dice": 16 },
      "success": { "effects": { "axis": {"power": -55, "economy": -50}, "credibilite": -1, "notoriete": 3, "popularity": 14, "standing": -8 },
        "result": { "fr": "Vos accusations font la une. On vous poursuit en diffamation, ça vous grandit.",
                    "en": "Your accusations lead the news. You are sued for libel, which only helps." } },
      "failure": { "effects": { "credibilite": -3, "reputation": -2, "popularity": -9, "standing": -10 },
        "result": { "fr": "Vous visez à côté. L'entreprise mise en cause n'était pas la bonne.",
                    "en": "You aim badly. The company you accused was not the one at fault." } } },
    { "label": { "fr": "Mobiliser votre réseau industriel", "en": "Mobilise your industry contacts" },
      "when": { "background": ["business"] },
      "effects": { "reseau": 1, "reputation": -1, "popularity": 8, "standing": 7 },
      "result": { "fr": "Vous obtenez en trois jours un fonds d'indemnisation que personne n'espérait.",
                  "en": "In three days you secure a compensation fund nobody expected." } },
    { "label": { "fr": "Financer vous-même l'aide aux familles", "en": "Fund support for the families yourself" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -200000, "reputation": 3, "popularity": 15, "standing": -4 },
      "result": { "fr": "Le geste est immense et suspect. Les familles, elles, s'en moquent.",
                  "en": "The gesture is enormous and suspicious. The families do not care." } }
  ]
},


{
  "id": "poste_ministre",
  "once": true,
  "when": { "ruling": false, "position": ["depute", "chef"], "minStanding": 50 },
  "tag": { "fr": "Proposition", "en": "An offer" },
  "text": {
    "fr": "Le gouvernement adverse vous propose un ministère. Votre parti est dans l'opposition et le fera savoir : accepter, c'est entrer au gouvernement contre les vôtres, et ils n'auront pas de mot assez dur. Le poste est réel, le piège aussi.",
    "en": "The opposing government offers you a ministry. Your party is in opposition and will say so loudly: taking it means joining a government against your own side, and they will not be short of words. The job is real; so is the trap."
  },
  "choices": [
    { "label": { "fr": "Accepter, et rompre avec votre camp", "en": "Accept, and break with your own side" },
      "effects": { "office": "ministre", "money": 60000, "reseau": 2, "notoriete": 2, "reputation": -2, "popularity": 9, "standing": -14, "appeal": { "self": -13, "ruling": 6 }, "trait": "renegat" },
      "result": { "fr": "Vous entrez au gouvernement. Votre parti parle de trahison, le pays de courage. Vous tiendrez le poste tant que ce président tiendra le sien, pas un jour de plus.",
                  "en": "You join the government. Your party calls it betrayal; the country calls it courage. You will hold the job for exactly as long as this president holds theirs, and not a day longer." } },
    { "label": { "fr": "Refuser publiquement et bruyamment", "en": "Refuse loudly and publicly" },
      "effects": { "strike": "intrepide", "reputation": 2, "notoriete": 1, "standing": 10, "popularity": -4, "appeal": { "self": 8 }, "money": -20000 },
      "result": { "fr": "Votre refus devient un argument de campagne pour les dix ans à venir.",
                  "en": "Your refusal becomes a campaign line for the next ten years." } },
    { "label": { "fr": "Négocier un soutien sans portefeuille", "en": "Negotiate support without a portfolio" },
      "roll": { "base": 19, "stat": "reseau",
                "plus": { "sangfroid": 0.35, "standing": 0.035 },
                "bonus": [ { "when": { "party": ["centrists", "socdem"] }, "value": 2 },
                           { "when": { "party": ["radical_left", "identitarians"] }, "value": -3 } ], "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 10, "popularity": 5 },
        "result": { "fr": "Vous obtenez trois lois et aucune responsabilité. Le meilleur des marchés.",
                    "en": "You get three laws and no responsibility. The best of deals." } },
      "failure": { "effects": { "standing": -12, "reputation": -1, "popularity": -4 },
        "result": { "fr": "La négociation fuite avant d'aboutir. Vous passez pour vénal et incompétent.",
                    "en": "The talks leak before they conclude. You look venal and incompetent." } } },
    { "label": { "fr": "Exiger l'Intérieur, et rompre avec votre camp", "en": "Demand the Interior Ministry, and break with your own side" },
      "when": { "background": ["civil", "law"] },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "minStanding": 70 }, "value": 0.25 } ] },
      "success": { "effects": { "office": "ministre", "reseau": 3, "notoriete": 2, "money": 60000, "popularity": 7, "standing": -10, "appeal": { "self": -11, "ruling": 5 }, "trait": "renegat" },
        "result": { "fr": "Ils cèdent. Vous héritez du ministère qui fait et défait les carrières.",
                    "en": "They give in. You inherit the ministry that makes and breaks careers." } },
      "failure": { "effects": { "standing": -6, "notoriete": 1 },
        "result": { "fr": "L'exigence les fait rire. Les négociations s'arrêtent là.",
                    "en": "The demand makes them laugh. The talks end there." } } }
  ]
},


{
  "id": "motion_censure",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 16 },
  "tag": { "fr": "Motion de censure", "en": "Vote of no confidence" },
  "text": {
    "fr": "Une motion de censure est déposée. Elle peut faire tomber le gouvernement, ou ridiculiser ses auteurs.",
    "en": "A no-confidence motion has been tabled. It could bring down the government, or humiliate its authors."
  },
  "choices": [
    { "label": { "fr": "Prendre la tête de la fronde", "en": "Lead the charge" },
      "roll": { "base": 20, "stat": "reseau",
                "plus": { "eloquence": 0.4, "standing": 0.04 },
                "bonus": [ { "when": { "position": ["chef"] }, "value": 2.5 },
                           { "when": { "minPopularity": 67 }, "value": 2 } ], "dice": 16 },
      /* CEUX QU'ON RENVERSE NE VOUS EN SONT PAS RECONNAISSANTS. La réussite
         ne portait qu'un positionnement — un geste anti-pouvoir, que les
         électorats les plus éloignés du pouvoir applaudissent — et le camp
         qui gouvernait n'était nulle part dans le calcul : selon sa place sur
         l'axe, il GAGNAIT jusqu'à dix points d'estime pour le joueur qui
         venait de faire tomber son gouvernement. On vise donc ce qu'on vise :
         "appeal" sur le camp au pouvoir, en plus du positionnement. Et
         "censure" fait ce que le texte raconte depuis toujours : le
         gouvernement tombe pour de bon. */
      "success": { "effects": { "axis": {"power": -50}, "notoriete": 3, "reseau": 1, "popularity": 16,
                                "appeal": { "ruling": -14 }, "standing": 5, "censure": true },
        "result": { "fr": "La motion passe à quatre voix. Vous avez fait tomber un gouvernement, et le camp qui le portait ne l'oubliera pas.",
                    "en": "The motion passes by four votes. You have brought down a government, and the camp that stood behind it will not forget." } },
      "failure": { "effects": { "notoriete": 1, "popularity": -10, "standing": -17 },
        "result": { "fr": "La motion s'effondre. On retiendra que vous l'aviez menée.",
                    "en": "The motion collapses. People will remember you led it." } } },
    { "label": { "fr": "Voter sans faire de bruit", "en": "Vote quietly" },
      "effects": { "standing": 7, "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Une voix parmi d'autres. Personne ne vous cherchera après.",
                  "en": "One vote among many. Nobody will come looking for you afterwards." } },
    { "label": { "fr": "S'abstenir et le justifier", "en": "Abstain, and explain why" },
      "effects": { "eloquence": 1, "reputation": -1, "popularity": -6, "standing": 7 },
      "result": { "fr": "Vous expliquez longuement une abstention que personne ne comprend.",
                  "en": "You explain at length an abstention nobody understands." } },
    { "label": { "fr": "Négocier votre voix contre un texte", "en": "Trade your vote for a bill" },
      "when": { "minStanding": 55 },
      "effects": { "reseau": 2, "standing": 9, "reputation": -2, "popularity": -5 },
      "result": { "fr": "Votre abstention achète une loi. Le marchandage se sait, évidemment.",
                  "en": "Your abstention buys a law. The deal becomes known, of course." } }
  ]
},


{
  "id": "interview_fleuve",
  "when": { "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Grand entretien", "en": "The long interview" },
  "text": {
    "fr": "Deux heures d'entretien sans montage, en direct. Le format ne pardonne rien.",
    "en": "Two hours of unedited live interview. The format forgives nothing."
  },
  "choices": [
    { "label": { "fr": "Parler du fond, longuement", "en": "Talk substance, at length" },
      "roll": { "base": 18, "stat": "eloquence",
                "plus": { "sangfroid": 0.4 },
                "bonus": [ { "when": { "background": ["academia", "civil"] }, "value": 2.5 },
                           { "when": { "background": ["celebrity"] }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "eloquence": 1, "reputation": 2, "popularity": 12, "standing": 6 },
        "result": { "fr": "Deux heures qui font autorité. On en reparlera pendant des années.",
                    "en": "Two hours that carry authority. People will refer to it for years." } },
      "failure": { "effects": { "popularity": -8, "notoriete": -1 },
        "result": { "fr": "Vous perdez l'audience au bout de vingt minutes. Et le fil au bout d'une heure.",
                    "en": "You lose the audience after twenty minutes. And your thread after an hour." } } },
    { "label": { "fr": "Raconter votre parcours personnel", "en": "Tell your personal story" },
      "effects": { "reputation": 1, "popularity": 9, "standing": -2 },
      "result": { "fr": "L'émotion passe mieux que les idées. C'est ainsi.",
                  "en": "Emotion travels better than ideas. That is how it is." } },
    { "label": { "fr": "Attaquer le gouvernement pendant deux heures", "en": "Attack the government for two hours" },
      "effects": { "notoriete": 2, "reputation": -1, "appeal": { "self": 9 }, "standing": 6 },
      "result": { "fr": "Efficace et fatigant. Votre camp adore, les autres zappent.",
                  "en": "Effective and exhausting. Your camp loves it; everyone else switches over." } },
    { "label": { "fr": "Raconter votre milieu d'origine", "en": "Talk about where you come from" },
      "when": { "origin": ["modest"] },
      "effects": { "axis": {"economy": -50}, "reputation": 2, "popularity": 10, "standing": -6 },
      "result": { "fr": "Vous parlez des fins de mois sans pathos. Le pays entend quelque chose de vrai.",
                  "en": "You talk about tight months without self-pity. The country hears something true." } }
  ]
},


{
  "id": "trahison_proche",
  "when": { "position": ["depute", "ministre", "chef"], "minTurn": 28 },
  "tag": { "fr": "Trahison", "en": "Betrayal" },
  "text": {
    "fr": "Votre directeur de cabinet a transmis vos notes internes à un journal. Il attend votre décision.",
    "en": "Your chief of staff has passed your internal notes to a newspaper. He is waiting for your decision."
  },
  "choices": [
    { "label": { "fr": "Le licencier publiquement", "en": "Fire him publicly" },
      "effects": { "reseau": -1, "sangfroid": 1, "standing": 6, "popularity": 2 },
      "result": { "fr": "L'exemple est fait. Votre équipe travaille désormais la peur au ventre.",
                  "en": "The example is set. Your team now works with fear in their stomachs." } },
    { "label": { "fr": "Le garder et ne rien dire", "en": "Keep him and say nothing" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "stat": { "sangfroid": { "min": 14 } } }, "value": 0.25 } ] },
      "success": { "effects": { "reseau": 2, "standing": 8 },
        "result": { "fr": "Il comprend qu'il vous doit tout. Il ne recommencera jamais.",
                    "en": "He understands he owes you everything. He will never do it again." } },
      "failure": { "effects": { "reseau": -2, "standing": -14, "popularity": -6 },
        "result": { "fr": "Il recommence trois mois plus tard, avec des documents pires.",
                    "en": "He does it again three months later, with worse documents." } } },
    { "label": { "fr": "Le muter dans un placard doré", "en": "Move him to a well-paid nowhere job" },
      "effects": { "reseau": 1, "money": -30000, "standing": 3, "reputation": -1 },
      "result": { "fr": "La solution classique. Elle coûte cher et ne règle rien.",
                  "en": "The classic solution. Expensive, and it settles nothing." } },
    { "label": { "fr": "Retourner la fuite contre son commanditaire", "en": "Turn the leak against whoever ordered it" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 19, "stat": "reseau", "plus": { "sangfroid": 0.35, "standing": 0.035 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "standing": 15, "notoriete": 1 },
        "result": { "fr": "Vous remontez la chaîne jusqu'à un rival, et vous le faites savoir.",
                    "en": "You trace the chain back to a rival, and you make sure everyone knows." } },
      "failure": { "effects": { "standing": -8, "reputation": -1 },
        "result": { "fr": "L'enquête interne tourne court et donne le sentiment d'une paranoïa.",
                    "en": "The internal inquiry goes nowhere and looks like paranoia." } } },
    { "label": { "fr": "Le convoquer et lui dire les choses en face", "en": "Call him in and say it to his face" },
      "when": { "trait": ["intrepide"] },
      "effects": { "sangfroid": 2, "reseau": 1, "standing": 9, "reputation": 1, "energie": -1 },
      "result": { "fr": "Vingt minutes seul à seul, sans témoin et sans avocat. Il part de lui-même le lendemain et ne dira jamais un mot de ce qui s'est dit dans ce bureau.",
                  "en": "Twenty minutes alone, no witnesses and no lawyers. He resigns the next morning and will never say a word about what was said in that office." } }
  ]
}
];
