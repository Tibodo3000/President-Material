/* Généré — ne pas éditer à la main. */
const EV_chaines = [


/* ==========================================================================
   5. CHAÎNE JUDICIAIRE — se déclenche si de l'argent douteux traîne
   ========================================================================== */

{
  "id": "enquete_ouverte",
  "delay": [6, 18],
  "weight": 3,
  "when": { "flag": { "dirtyMoney": true, "onTrial": false, "investigated": false } },
  "tag": { "fr": "Justice", "en": "Justice" },
  "text": {
    "fr": "Un journaliste d'investigation vous appelle. Il travaille depuis six mois sur le financement de vos débuts et il a des documents.",
    "en": "An investigative journalist calls. He has been working on your early funding for six months, and he has documents."
  },
  "choices": [
    { "label": { "fr": "Le recevoir et tout expliquer", "en": "Meet him and explain everything" },
      "roll": { "stat": "sangfroid", "base": 14, "dice": 16,
                "bonus": [ { "when": { "legal": 1 }, "value": 2 },
                           { "when": { "comms": 2 }, "value": 2 } ] },
      "success": { "effects": { "flags": { "investigated": true }, "reputation": 1, "popularity": -3 },
        "result": { "fr": "L'article sort, mesuré, presque bienveillant. Vous avez gagné du temps.",
                    "en": "The article runs, measured, almost kind. You have bought time." } },
      "failure": { "effects": { "flags": { "investigated": true }, "popularity": -10, "standing": -6, "chain": "perquisition" },
        "result": { "fr": "Vos explications sonnent creux à l'écrit. Le parquet lit l'article.",
                    "en": "Your explanations ring hollow in print. The prosecutor reads the article." } } },
    { "label": { "fr": "Ne pas répondre", "en": "Do not respond" },
      "effects": { "flags": { "investigated": true }, "popularity": -7, "standing": -3, "chain": "perquisition" },
      "result": { "fr": "L'article paraît avec la mention « n'a pas donné suite à nos sollicitations ».",
                  "en": "The article runs with the line “did not respond to our requests”." } },
    { "label": { "fr": "Dénoncer un acharnement politique", "en": "Denounce a political witch hunt" },
      "effects": { "notoriete": 2, "popularity": -9, "standing": 4, "reputation": -2 },
      "result": { "fr": "Vos soutiens reprennent le mot en boucle. Le journaliste, lui, continue son travail exactement comme avant.",
                  "en": "Your supporters repeat the phrase on a loop. The reporter, meanwhile, carries on exactly as before." } }
  ]
},


{
  "id": "perquisition",
  "delay": [4, 12],
  "weight": 0,
  "tag": { "fr": "Justice", "en": "Justice" },
  "text": {
    "fr": "Six heures du matin. La brigade financière est à votre porte avec une commission rogatoire.",
    "en": "Six in the morning. The financial crimes unit is at your door with a warrant."
  },
  "choices": [
    { "label": { "fr": "Prendre le meilleur avocat du pays", "en": "Hire the best lawyer in the country" },
      "roll": { "chance": 0.32,
                "chanceBonus": [ { "when": { "legal": 1 }, "value": 0.16 },
                                 { "when": { "legal": 2 }, "value": 0.14 },
                                 { "when": { "minMoney": 500000 }, "value": 0.12 },
                                 { "when": { "minMoney": 2000000 }, "value": 0.08 },
                                 { "when": { "background": ["law"] }, "value": 0.1 },
                                 { "when": { "minStanding": 65 }, "value": 0.06 } ] },
      "success": { "effects": { "money": -100000, "notoriete": 1, "flags": { "dirtyMoney": false }, "popularity": -6, "standing": -4, "trait": "teflon" },
        "result": { "fr": "Vice de procédure. Le dossier se referme, pas les soupçons.",
                    "en": "A procedural flaw. The case closes; the suspicion does not." } },
      "failure": { "effects": { "money": -100000, "reputation": -1, "popularity": -16, "standing": -14, "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "L'avocat est brillant, le dossier est pire. Vous êtes mis en examen.",
                    "en": "The lawyer is brilliant, the file is worse. You are indicted." } } },
    { "label": { "fr": "Coopérer totalement", "en": "Cooperate fully" },
      "roll": { "chance": 0.4 },
      "success": { "effects": { "notoriete": 1, "reputation": 1, "flags": { "dirtyMoney": false }, "popularity": 3, "standing": -8 },
        "result": { "fr": "Votre transparence désarme le parquet. Classé sans suite.",
                    "en": "Your openness disarms the prosecutor. Case dropped." } },
      "failure": { "effects": { "reputation": -2, "popularity": -14, "standing": -18, "flags": { "onTrial": true }, "chain": "proces" },
        "result": { "fr": "Tout ce que vous dites est versé au dossier. Mise en examen.",
                    "en": "Everything you say goes in the file. You are indicted." } } }
  ]
},


{
  "id": "proces",
  "delay": [12, 28],
  "weight": 0,
  "tag": { "fr": "Procès", "en": "Trial" },
  "text": {
    "fr": "Le procès s'ouvre dans un tribunal bondé. Le parquet requiert une peine d'inéligibilité.",
    "en": "The trial opens in a packed courtroom. The prosecution is seeking a ban from public office."
  },
  "choices": [
    { "label": { "fr": "Se défendre pied à pied", "en": "Fight every inch" },
      "roll": { "base": 19, "stat": "sangfroid",
                "plus": { "eloquence": 0.35, "standing": 0.03 },
                "bonus": [ { "when": { "legal": 1 }, "value": 2.5 },
                           { "when": { "legal": 2 }, "value": 2.5 },
                           { "when": { "background": ["law"] }, "value": 2 },
                           { "when": { "minMoney": 1000000 }, "value": 1.5 },
                           { "when": { "maxPopularity": 41 }, "value": -2 } ], "dice": 16 },
      "success": { "effects": { "flags": { "onTrial": false, "dirtyMoney": false }, "reputation": -1, "notoriete": 1, "popularity": -10, "standing": -10, "strike": "casserole" },
        "result": { "fr": "Relaxe au bénéfice du doute. Vous ressortez libre et abîmé.",
                    "en": "Acquitted on the benefit of the doubt. You walk out free and damaged." } },
      "failure": { "effects": { "end": "conviction" },
        "result": { "fr": "Coupable. Inéligibilité immédiate. Votre carrière s'arrête sur les marches du tribunal.",
                    "en": "Guilty. An immediate ban from office. Your career ends on the courthouse steps." } } },
    { "label": { "fr": "Plaider coupable pour limiter la peine", "en": "Plead guilty to limit the sentence" },
      "roll": { "chance": 0.3,
                "chanceBonus": [ { "when": { "legal": 1 }, "value": 0.14 },
                                 { "when": { "legal": 2 }, "value": 0.16 } ] },
      "success": { "effects": { "flags": { "onTrial": false, "dirtyMoney": false }, "money": -200000, "reputation": -2, "popularity": -18, "standing": -20 },
        "result": { "fr": "Amende lourde, pas d'inéligibilité. Vous survivez politiquement, de justesse.",
                    "en": "A heavy fine, no ban. You survive politically, barely." } },
      "failure": { "effects": { "end": "conviction" },
        "result": { "fr": "Le tribunal ne vous fait aucun cadeau. Inéligibilité et fin de parcours.",
                    "en": "The court shows no mercy. Banned from office, and that is the end." } } }
  ]
},


{
  "id": "patrimoine_declare",
  "delay": [4, 14],
  "weight": 0,
  "tag": { "fr": "Patrimoine", "en": "Assets" },
  "text": {
    "fr": "La Haute Autorité vous écrit. Votre déclaration de patrimoine a doublé depuis votre entrée en politique et personne, chez eux, ne trouve la ligne qui l'explique.",
    "en": "The transparency authority writes to you. Your declared assets have doubled since you entered politics, and nobody there can find the line that explains it."
  },
  "choices": [
    { "label": { "fr": "Fournir chaque justificatif", "en": "Produce every receipt" },
      "roll": { "stat": "sangfroid", "base": 12, "dice": 14,
                "bonus": [ { "when": { "legal": 1 }, "value": 3 },
                           { "when": { "legal": 2 }, "value": 3 },
                           { "when": { "background": ["law", "business"] }, "value": 2 } ] },
      "success": { "effects": { "reputation": 1, "popularity": 2, "standing": -2 },
        "result": { "fr": "Tout se tient, à l'euro près. Le dossier est classé et vous en parlez pendant deux ans.",
                    "en": "It all adds up, to the euro. The file is closed and you mention it for two years." } },
      "failure": { "effects": { "money": -60000, "reputation": -1, "popularity": -8, "standing": -4, "chain": "fisc" },
        "result": { "fr": "Deux lignes ne se justifient pas. Vous les découvrez en même temps qu'eux, ce qui est encore le pire des cas.",
                    "en": "Two lines cannot be justified. You discover them at the same time they do, which is still the worst case." } } },

    { "label": { "fr": "Faire répondre vos avocats", "en": "Let your lawyers answer" },
      "when": { "legal": 1 },
      "effects": { "money": -25000, "standing": 2, "popularity": -3 },
      "result": { "fr": "Onze pages qui ne disent rien et qui sont irréprochables. L'administration passe à un dossier plus simple.",
                  "en": "Eleven pages that say nothing and are beyond reproach. The authority moves on to an easier file." } },

    { "label": { "fr": "Placer le patrimoine hors de vue", "en": "Move the money out of sight" },
      "when": { "minMoney": 300000 },
      "effects": { "money": -40000, "flags": { "dirtyMoney": true }, "standing": 2, "strike": "casserole" },
      "result": { "fr": "Un montage parfaitement légal et parfaitement indéfendable en conférence de presse. Il tiendra tant que personne ne le cherche.",
                  "en": "A perfectly legal arrangement that is perfectly indefensible at a press conference. It will hold as long as nobody goes looking." } },

    { "label": { "fr": "Publier vous-même toute la déclaration", "en": "Publish the whole declaration yourself" },
      "effects": { "reputation": 2, "popularity": 6, "standing": -9, "notoriete": 1 },
      "result": { "fr": "Le pays trouve le geste courageux. Vos collègues, à qui l'on demande maintenant d'en faire autant, trouvent le geste dégueulasse.",
                  "en": "The country finds it brave. Your colleagues, now being asked to do the same, find it disgusting." } }
  ]
},


{
  "id": "fisc",
  "delay": [6, 16],
  "weight": 0,
  "tag": { "fr": "Fisc", "en": "Tax" },
  "text": {
    "fr": "Contrôle fiscal approfondi. L'inspecteur est poli, méthodique, et il a tout son temps.",
    "en": "A full tax audit. The inspector is polite, methodical, and in no hurry at all."
  },
  "choices": [
    { "label": { "fr": "Payer le redressement sans discuter", "en": "Pay the assessment without arguing" },
      "effects": { "money": -180000, "popularity": -4, "standing": -2 },
      "result": { "fr": "La somme part en une fois. C'est cher, c'est fini, et personne n'en parlera plus jamais.",
                  "en": "The money goes in one payment. It is expensive, it is over, and nobody will ever mention it again." } },

    { "label": { "fr": "Contester devant le tribunal administratif", "en": "Challenge it in the courts" },
      "roll": { "stat": "sangfroid", "base": 13, "dice": 15,
                "bonus": [ { "when": { "legal": 1 }, "value": 4 },
                           { "when": { "legal": 2 }, "value": 4 },
                           { "when": { "background": ["law"] }, "value": 2 } ] },
      "success": { "effects": { "money": -30000, "reputation": 1, "standing": 2 },
        "result": { "fr": "Le redressement fond à presque rien. Vos avocats coûtaient moins cher que ce qu'ils vous ont épargné, ce qui n'arrive pas souvent.",
                    "en": "The assessment shrinks to almost nothing. Your lawyers cost less than they saved you, which does not happen often." } },
      "failure": { "effects": { "money": -220000, "reputation": -1, "popularity": -9, "standing": -6, "flags": { "dirtyMoney": true } },
        "result": { "fr": "Vous perdez, avec majoration pour mauvaise foi. Ce sont les deux derniers mots que retiendra la presse.",
                    "en": "You lose, with a penalty for bad faith. Those are the two words the press will keep." } } }
  ]
},


/* ==========================================================================
   6. CHAÎNE SANTÉ
   ========================================================================== */

{
  "id": "epuisement",
  "when": { "stat": { "energie": { "max": 4 } } },
  "tag": { "fr": "Santé", "en": "Health" },
  "text": {
    "fr": "Votre médecin est formel : au rythme actuel, vous ne tiendrez pas l'année.",
    "en": "Your doctor is blunt: at this pace, you will not last the year."
  },
  "choices": [
    { "label": { "fr": "Lever le pied trois mois", "en": "Slow down for three months" },
      "effects": { "energie": 3, "notoriete": -1, "popularity": -8, "standing": -6, "flags": { "carefulHealth": true } },
      "result": { "fr": "Vous disparaissez des radars et revenez reposé. On a pris vos dossiers.",
                  "en": "You drop off the radar and come back rested. Others took your files." } },
    { "label": { "fr": "Tenir coûte que coûte", "en": "Push through" },
      "effects": { "sangfroid": -1, "standing": 6, "flags": { "frailHealth": true }, "trait": "use" },
      "result": { "fr": "Vous tenez. Quelque chose s'est abîmé, sans bruit.",
                  "en": "You hold on. Something has worn down, quietly." } },
    { "label": { "fr": "Tenir à coups de médicaments", "en": "Get through it on medication" },
      "effects": { "energie": 2, "sangfroid": -1, "reputation": -1, "flags": { "frailHealth": true } },
      "result": { "fr": "Un médecin complaisant, une ordonnance longue comme le bras. Vous tenez le rythme, et vous ne dormez plus du tout.",
                  "en": "An accommodating doctor, a prescription as long as your arm. You keep up the pace, and you stop sleeping altogether." } }
  ]
},


{
  "id": "alerte_cardiaque",
  "once": true,
  "when": { "minAge": 55 },
  "tag": { "fr": "Santé", "en": "Health" },
  "text": {
    "fr": "Un malaise en plein meeting. Les examens parlent d'alerte sérieuse, pas encore d'accident.",
    "en": "You collapse mid-rally. The tests call it a serious warning, not yet an event."
  },
  "choices": [
    { "label": { "fr": "Suivre le traitement à la lettre", "en": "Follow the treatment to the letter" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "energie": -2, "popularity": 5, "standing": -7, "flags": { "carefulHealth": true } },
      "result": { "fr": "Vous ralentissez, un peu. Le pays s'attendrit, le parti s'inquiète.",
                  "en": "You slow down, a little. The country softens; the party worries." } },
    { "label": { "fr": "Cacher l'épisode et continuer", "en": "Hide it and carry on" },
      "effects": { "sangfroid": 1, "standing": 4, "flags": { "frailHealth": true }, "strike": "menteur", "chain": "rechute" },
      "result": { "fr": "Personne ne sait. Vous vivez désormais avec un compte à rebours.",
                  "en": "Nobody knows. You now live with a countdown." } },
    { "label": { "fr": "Publier une photo de vous en train de courir", "en": "Publish a photo of yourself out running" },
      "effects": { "notoriete": 1, "popularity": 6, "energie": -1, "reputation": -1, "strike": "menteur" },
      "result": { "fr": "Huit cents mètres, un photographe, un tee-shirt trempé à l'avance. Le doute sur votre santé est levé pour six mois.",
                  "en": "Eight hundred metres, one photographer, a t-shirt soaked in advance. The doubt about your health is settled for six months." } }
  ]
},


{
  "id": "rechute",
  "delay": [6, 16],
  "weight": 0,
  "tag": { "fr": "Santé", "en": "Health" },
  "text": {
    "fr": "Deuxième malaise, cette fois devant les caméras. Impossible de le cacher.",
    "en": "A second collapse, this time on camera. Impossible to hide."
  },
  "choices": [
    { "label": { "fr": "Publier votre dossier médical", "en": "Publish your medical file" },
      "effects": { "reputation": 2, "popularity": 6, "standing": -12, "flags": { "carefulHealth": true, "frailHealth": false } },
      "result": { "fr": "La transparence coupe court aux rumeurs. Le parti, lui, cherche déjà un remplaçant.",
                  "en": "The transparency ends the rumours. The party is already looking for a replacement." } },
    { "label": { "fr": "Parler d'un simple coup de fatigue", "en": "Call it simple exhaustion" },
      "effects": { "popularity": -6, "standing": 9, "reputation": -1, "strike": "menteur" },
      "result": { "fr": "Personne n'y croit. On commence à compter vos apparitions.",
                  "en": "Nobody believes it. People start counting your appearances." } }
  ]
},


/* ==========================================================================
   7. CHAÎNE LÉGISLATIVE — pour les députés
   ========================================================================== */

{
  "id": "projet_loi",
  "once": true,
  "when": { "position": ["depute", "ministre", "chef"] },
  "tag": { "fr": "Assemblée", "en": "The chamber" },
  "text": {
    "fr": "Vous pouvez déposer une proposition de loi à votre nom. Une seule dans une carrière restera dans les mémoires.",
    "en": "You can table a bill in your own name. Only one in a career ever stays in the memory."
  },
  "choices": [
    { "label": { "fr": "Un texte ambitieux et clivant", "en": "An ambitious, divisive bill" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "effects": { "notoriete": 2, "energie": -2, "popularity": 9, "standing": -4, "chain": "bataille_amendements" },
      "result": { "fr": "Le texte fait la une avant même d'être examiné. Les couteaux sortent.",
                  "en": "The bill makes the front page before it is even read. The knives come out." } },
    { "label": { "fr": "Un texte technique et consensuel", "en": "A technical, consensual bill" },
      "effects": { "credibilite": +2, "standing": 8, "reputation": 1, "popularity": -6, "notoriete": -1 },
      "result": { "fr": "Adopté à l'unanimité en huit minutes. Trois personnes s'en souviendront.",
                  "en": "Passed unanimously in eight minutes. Three people will remember it." } },
    { "label": { "fr": "Reprendre le texte d'un collègue discret", "en": "Recycle a quiet colleague's bill" },
      "effects": { "standing": 4, "notoriete": 1, "energie": 1, "reseau": -1, "reputation": -1 },
      "result": { "fr": "Le texte est bon, il attendait depuis trois ans. Vous y mettez votre nom et un titre plus vendeur.",
                  "en": "The text is good; it had been waiting three years. You put your name on it and a better title." } }
  ]
},


{
  "id": "bataille_amendements",
  "delay": [2, 6],
  "weight": 0,
  "tag": { "fr": "Assemblée", "en": "The chamber" },
  "text": {
    "fr": "Deux mille amendements sont déposés pour enterrer votre texte. Les séances durent jusqu'à quatre heures du matin.",
    "en": "Two thousand amendments are tabled to bury your bill. The sittings run until four in the morning."
  },
  "choices": [
    { "label": { "fr": "Tenir l'hémicycle nuit après nuit", "en": "Hold the chamber night after night" },
      "when": { "stat": { "energie": { "min": 8 } } },
      "roll": { "stat": "energie", "base": 13, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "eloquence": 1, "energie": -2, "popularity": 12, "standing": 6, "chain": "vote_final" },
        "result": { "fr": "Vous êtes encore debout au petit matin. Les images tournent en boucle.",
                    "en": "You are still standing at dawn. The footage runs on a loop." } },
      "failure": { "effects": { "energie": -2, "popularity": -8, "standing": -5 },
        "result": { "fr": "Vous craquez en séance. Le texte est retiré dans l'indifférence.",
                    "en": "You crack in the chamber. The bill is withdrawn to general indifference." } } },
    { "label": { "fr": "Négocier une version édulcorée", "en": "Negotiate a watered-down version" },
      "effects": { "standing": 10, "reputation": -1, "popularity": -5, "chain": "vote_final" },
      "result": { "fr": "Il ne reste que le titre. Mais il reste le titre.",
                  "en": "Only the title survives. But the title survives." } }
  ]
},


{
  "id": "vote_final",
  "delay": [2, 6],
  "weight": 0,
  "tag": { "fr": "Vote solennel", "en": "The final vote" },
  "text": {
    "fr": "Le vote solennel a lieu mardi. Il vous manque une quinzaine de voix dans votre propre camp.",
    "en": "The final vote is on Tuesday. You are about fifteen votes short in your own camp."
  },
  "choices": [
    { "label": { "fr": "Aller chercher les voix une par une", "en": "Chase the votes one by one" },
      "roll": { "stat": "reseau", "base": 13, "dice": 16 },
      "success": { "effects": { "notoriete": 1, "reputation": 2, "popularity": 14, "standing": 12 },
        "result": { "fr": "La loi passe à onze voix près. Elle portera votre nom.",
                    "en": "The law passes by eleven votes. It will carry your name." } },
      "failure": { "effects": { "popularity": -9, "standing": -8, "reputation": -1 },
        "result": { "fr": "Rejeté de six voix. Votre propre camp vous a lâché.",
                    "en": "Rejected by six votes. Your own side let you down." } } },
    { "label": { "fr": "Menacer les récalcitrants", "en": "Threaten the holdouts" },
      "roll": { "chance": 0.5 },
      "success": { "effects": { "notoriete": 1, "popularity": 10, "standing": 4, "reputation": -1 },
        "result": { "fr": "La loi passe. On sait maintenant que vous savez faire peur.",
                    "en": "The law passes. People now know you can frighten them." } },
      "failure": { "effects": { "standing": -14, "reputation": -2, "popularity": -6 },
        "result": { "fr": "Les menaces fuitent. Le texte tombe et votre réputation avec.",
                    "en": "The threats leak. The bill falls and your reputation with it." } } }
  ]
}
];
