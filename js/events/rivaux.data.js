/* Un paquet d'événements. Le schéma est en tête de js/events/_assemble.data.js. */
const EV_rivaux = [


/* ==========================================================================
   8. RIVAUX
   ========================================================================== */

{
  "id": "debat_public",
  "tag": { "fr": "Débat", "en": "Debate" },
  "text": {
    "fr": "{rival} vous met publiquement au défi de débattre. Refuser se verra.",
    "en": "{rival} has publicly challenged you to a debate. Declining will be noticed."
  },
  "choices": [
    { "label": { "fr": "Accepter le débat", "en": "Take the debate" },
      "roll": { "base": 18, "stat": "eloquence",
                "plus": { "sangfroid": 0.35, "popularity": 0.03 },
                "bonus": [ { "when": { "background": ["law", "academia"] }, "value": 2 },
                           { "when": { "background": ["celebrity"] }, "value": -1 },
                           { "when": { "maxPopularity": 41 }, "value": -0.5 } ], "dice": 16 },
      "success": { "effects": { "landscape": { "self": 1.2 }, "notoriete": 2, "reputation": 1, "popularity": 14, "standing": 2, "trait": "orateur" },
        "result": { "fr": "Vous dominez l'échange. Les extraits vous donnent le beau rôle.",
                    "en": "You dominate the exchange. The clips flatter you." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "notoriete": 1, "reputation": -1, "popularity": -11, "standing": -5 },
        "result": { "fr": "L'adversaire était préparé. Vous encaissez plus que vous ne rendez.",
                    "en": "Your opponent came prepared. You take more than you give." } } },
    { "label": { "fr": "Décliner avec dédain", "en": "Decline with disdain" },
      "effects": { "landscape": { "self": -0.5 }, "strike": "lache", "notoriete": -1, "sangfroid": 1, "popularity": -5, "standing": 2 },
      "result": { "fr": "« Je ne débats pas avec tout le monde. » La formule amuse, ou agace.",
                  "en": "“I don't debate just anyone.” The line amuses some and grates on others." } },
    { "label": { "fr": "Le préparer comme une plaidoirie", "en": "Prepare it like a court case" },
      "when": { "background": ["law"] },
      "effects": { "landscape": { "self": 0.9 }, "eloquence": 1, "energie": -2, "notoriete": 1, "popularity": 12, "standing": 5 },
      "result": { "fr": "Vous arrivez avec des pièces, des dates et des citations. L'exercice tourne au procès.",
                  "en": "You arrive with documents, dates and quotations. The debate turns into a trial." } },
    { "label": { "fr": "En faire un spectacle", "en": "Turn it into a show" },
      "when": { "background": ["celebrity"] },
      "roll": { "base": 13, "stat": "charisme", "plus": { "notoriete": 0.5 }, "dice": 16 },
      "success": { "effects": { "landscape": { "self": -0.6 }, "notoriete": 3, "popularity": 13, "reputation": -1 },
        "result": { "fr": "Le débat devient un moment de télévision. On ne retient pas les arguments, on retient vous.",
                    "en": "The debate becomes television. Nobody remembers the arguments; they remember you." } },
      "failure": { "effects": { "landscape": { "self": -1 }, "reputation": -2, "popularity": -8, "standing": -6 },
        "result": { "fr": "Le numéro tombe à plat et confirme que vous n'êtes pas sérieux.",
                    "en": "The act falls flat and confirms you are not serious." } } }
  ]
},


{
  "id": "attaque_rival",
  "tag": { "fr": "Rivalité", "en": "Rivalry" },
  "text": {
    "fr": "Dans une interview, {rival} vous décrit comme « une ambition sans colonne vertébrale ».",
    "en": "In an interview, {rival} describes you as “ambition without a spine”."
  },
  "choices": [
    { "label": { "fr": "Répondre par une formule cinglante", "en": "Fire back" },
      "roll": { "stat": "eloquence", "base": 13, "dice": 16 },
      "success": { "effects": { "landscape": { "self": 0.8, "scene": -0.8 }, "notoriete": 2, "popularity": 9, "appeal": { "scene": -8 }, "standing": 3 },
        "result": { "fr": "Votre réplique fait le tour des rédactions. Match gagné.",
                    "en": "Your reply makes the rounds. Point won." } },
      "failure": { "effects": { "landscape": { "self": -0.7, "scene": 0.5 }, "reputation": -1, "popularity": -8, "standing": -3 },
        "result": { "fr": "La réplique tombe à plat. On vous sent piqué.",
                    "en": "The reply falls flat. You sound stung." } } },
    { "label": { "fr": "Laisser dire", "en": "Let it go" },
      "effects": { "strike": "lache", "sangfroid": 1, "notoriete": -1, "popularity": -2, "standing": 6 },
      "result": { "fr": "Pas de réponse, pas de séquence. L'appareil apprécie le calme.",
                  "en": "No reply, no story. The machine appreciates the calm." } },
    { "label": { "fr": "Désarmer par l'humour", "en": "Disarm it with humour" },
      "when": { "personality": ["charming"] },
      "effects": { "landscape": { "self": 0.5 }, "charisme": 1, "popularity": 10, "standing": -5 },
      "result": { "fr": "Votre réponse fait rire jusque dans son camp. L'attaque se retourne toute seule.",
                  "en": "Your answer gets laughs even on his side. The attack turns itself around." } },
    { "label": { "fr": "Ne rien dire et préparer la riposte", "en": "Say nothing and prepare the counter" },
      "when": { "personality": ["calculating"] },
      "effects": { "sangfroid": 1, "reseau": 1, "standing": 8, "popularity": -2 },
      "result": { "fr": "Vous encaissez sans broncher et vous commencez à réunir de quoi le détruire plus tard.",
                  "en": "You take it without flinching and start gathering what will destroy him later." } }
  ]
},


{
  "id": "scandale_rival",
  "tag": { "fr": "Rivalité", "en": "Rivalry" },
  "text": {
    "fr": "La presse révèle une affaire embarrassante visant {rival}. Votre entourage vous presse d'enfoncer le clou.",
    "en": "The press has an embarrassing story about {rival}. Your team urges you to twist the knife."
  },
  "choices": [
    { "label": { "fr": "Attaquer publiquement", "en": "Attack publicly" },
      "effects": { "landscape": { "scene": -1 }, "notoriete": 1, "reputation": -1, "popularity": 4, "appeal": { "scene": -5 }, "standing": -7 },
      "result": { "fr": "Le coup porte. On retiendra aussi que c'est vous qui l'avez porté.",
                  "en": "The blow lands. People will also remember who threw it." } },
    { "label": { "fr": "Rester digne", "en": "Stay above it" },
      "effects": { "reputation": 1, "popularity": -3, "standing": 7 },
      "result": { "fr": "« Je ne commente pas les affaires. » La sobriété paie, parfois.",
                  "en": "“I don't comment on legal matters.” Restraint pays, sometimes." } },
    { "label": { "fr": "Prendre publiquement sa défense", "en": "Publicly defend him" },
      "when": { "personality": ["principled"] },
      "effects": { "landscape": { "scene": 0.6 }, "reputation": 3, "popularity": 9, "standing": -5 },
      "result": { "fr": "Défendre un adversaire surprend tout le monde. On vous regarde autrement.",
                  "en": "Defending an opponent surprises everyone. People see you differently." } },
    { "label": { "fr": "Vérifier les faits avant tout le monde", "en": "Check the facts before anyone else" },
      "when": { "background": ["journalism"] },
      "roll": { "base": 13, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "landscape": { "scene": -0.8, "self": 0.5 }, "notoriete": 2, "reputation": 2, "popularity": 7, "appeal": { "scene": -5 }, "standing": 6 },
        "result": { "fr": "L'affaire est plus grave que la presse ne le croit, et c'est vous qui le révélez.",
                    "en": "The story is worse than the press thinks, and you are the one who reveals it." } },
      "failure": { "effects": { "popularity": -4, "standing": -3 },
        "result": { "fr": "Vos vérifications ne donnent rien. Vous avez perdu trois jours.",
                    "en": "Your checks turn up nothing. You have lost three days." } } }
  ]
},


{
  "id": "alliance_rival",
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Alliance", "en": "Alliance" },
  "text": {
    "fr": "{rival} propose un pacte : vous ne vous attaquez plus publiquement, et vous partagez vos informations.",
    "en": "{rival} proposes a pact: no more public attacks, and you share information."
  },
  "choices": [
    { "label": { "fr": "Sceller le pacte", "en": "Seal the pact" },
      "effects": { "reseau": 2, "standing": 9, "popularity": -8 },
      "result": { "fr": "L'accord tient six mois. C'est déjà beaucoup en politique.",
                  "en": "The deal holds for six months. That is a long time in politics." } },
    { "label": { "fr": "Refuser et le rendre public", "en": "Refuse and make it public" },
      "effects": { "notoriete": 2, "reputation": 1, "popularity": 11, "standing": -6 },
      "result": { "fr": "Révéler la proposition vous grandit et vous fait un ennemi durable.",
                  "en": "Revealing the offer makes you look big and makes you a lasting enemy." } },
    { "label": { "fr": "Signer, puis faire fuiter le pacte", "en": "Sign, then leak the pact" },
      "when": { "personality": ["calculating", "provocative"] },
      "effects": { "notoriete": 2, "popularity": 7, "standing": -4, "reputation": -2, "strike": "traitre" },
      "result": { "fr": "Le document sort trois semaines plus tard, sans votre signature en évidence. Il comprend tout de suite d'où ça vient.",
                  "en": "The document surfaces three weeks later, with your signature conveniently cropped. He knows exactly where it came from." } }
  ]
}
];
