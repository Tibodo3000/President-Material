/* Généré — ne pas éditer à la main. */
const EV_caractere = [


/* ==========================================================================
   12. CE QUE LES TRAITS OUVRENT
   ==========================================================================
   Ces événements ne se déclenchent que pour un personnage marqué. Ils sont
   la contrepartie visible du système : un trait ferme des portes, il doit
   aussi en ouvrir que les autres ne verront jamais.
   ========================================================================== */

{
  "id": "tribune_orateur",
  "weight": 5,
  "when": { "trait": ["orateur"], "position": ["depute", "chef", "maire", "ministre"] },
  "tag": { "fr": "Tribune", "en": "The floor" },
  "text": {
    "fr": "Un débat de censure tourne mal pour votre camp. Le groupe cherche quelqu'un capable de tenir l'hémicycle pendant vingt minutes sans notes.",
    "en": "A censure debate is going badly for your side. The group needs someone who can hold the chamber for twenty minutes without notes."
  },
  "choices": [
    { "label": { "fr": "Monter à la tribune", "en": "Take the floor" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 13, "standing": 6, "energie": -1 },
        "result": { "fr": "Le silence se fait au bout de trois minutes. La séquence tourne en boucle jusqu'au soir.",
                    "en": "The chamber falls silent after three minutes. The clip runs on a loop until nightfall." } },
      "failure": { "effects": { "popularity": -7, "standing": -6, "energie": -1 },
        "result": { "fr": "Vous parlez douze minutes de trop. On retient la fatigue plutôt que les arguments.",
                    "en": "You speak twelve minutes too long. What sticks is the tiredness, not the argument." } } },
    { "label": { "fr": "Laisser quelqu'un d'autre s'y coller", "en": "Let somebody else take it" },
      "effects": { "strike": "lache", "energie": 2, "standing": -5, "popularity": -3, "sangfroid": 1 },
      "result": { "fr": "Un collègue s'en tire honorablement. Le groupe note surtout que vous n'y étiez pas.",
                  "en": "A colleague does a decent job. What the group notices is that you were not there." } },
    { "label": { "fr": "Monter, et transformer ça en meeting", "en": "Take the floor and turn it into a rally" },
      "when": { "personality": ["provocative"] },
      "effects": { "notoriete": 3, "popularity": 9, "standing": -8, "energie": -1, "strike": "radical" },
      "result": { "fr": "Le président de séance vous coupe le micro deux fois. La séquence dépasse le million de vues avant minuit.",
                  "en": "The speaker cuts your microphone twice. The clip passes a million views before midnight." } }
  ]
},


{
  "id": "coup_de_fil_appareil",
  "weight": 5,
  "when": { "trait": ["appareil"], "minTurn": 10 },
  "tag": { "fr": "Fédérations", "en": "The branches" },
  "text": {
    "fr": "Trois fédérations menacent de partir avec leur candidat. Vous connaissez les trois secrétaires par leur prénom, et vous savez ce que chacun veut.",
    "en": "Three local branches are threatening to leave with their own candidate. You know all three secretaries by their first name, and you know what each of them wants."
  },
  "choices": [
    { "label": { "fr": "Passer les trois coups de fil", "en": "Make the three phone calls" },
      "effects": { "standing": 12, "reseau": 1, "energie": -2, "popularity": -3 },
      "result": { "fr": "Deux places sur une liste et une promesse de circonscription. Personne ne part.",
                  "en": "Two places on a ticket and a promise of a seat. Nobody leaves." } },
    { "label": { "fr": "Les laisser partir et le dire au pays", "en": "Let them go, and say so publicly" },
      "effects": { "popularity": 11, "standing": -13, "reputation": 2, "notoriete": 1 },
      "result": { "fr": "Vous en faites une question de clarté. Le pays approuve, l'appareil compte les absents.",
                  "en": "You turn it into a question of clarity. The country approves; the machine counts the empty chairs." } },
    { "label": { "fr": "Acheter la paix sur vos deniers", "en": "Buy the peace out of your own pocket" },
      "when": { "minMoney": 200000 },
      "effects": { "money": -150000, "standing": 9, "reseau": 2, "reputation": -1 },
      "result": { "fr": "Des frais de campagne pris en charge, sans reçu qui remonte à vous. Pour l'instant.",
                  "en": "Campaign costs quietly covered, with no receipt leading back to you. For now." } }
  ]
},


{
  "id": "retour_de_flamme",
  "weight": 5,
  "when": { "trait": ["casserole"], "minPopularity": 45 },
  "tag": { "fr": "Vieux dossier", "en": "Old file" },
  "text": {
    "fr": "Un magazine ressort l'affaire en couverture, au moment précis où les sondages vous étaient favorables. La photo choisie date de dix ans.",
    "en": "A magazine puts the old story back on its cover, at the exact moment the polls had turned your way. The photo they chose is ten years old."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point", "en": "Answer point by point" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "eloquence": 0.4, "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 4, "reputation": 1, "energie": -1, "untrait": "casserole" },
        "result": { "fr": "Vous sortez les pièces une par une. Le sujet meurt en trois jours, cette fois pour de bon.",
                    "en": "You produce the documents one by one. The story dies in three days, this time for good." } },
      "failure": { "effects": { "popularity": -9, "standing": -6, "energie": -1 },
        "result": { "fr": "Répondre, c'est reconnaître qu'il y a une question. Elle tiendra trois semaines.",
                    "en": "Answering means admitting there is a question. It will run for three weeks." } } },
    { "label": { "fr": "Ne rien dire et laisser passer", "en": "Say nothing and let it pass" },
      "effects": { "strike": "lache", "popularity": -6, "sangfroid": 1, "standing": 2 },
      "result": { "fr": "Le silence coûte quelques points et fait gagner du temps. Le dossier reste dans le tiroir.",
                  "en": "Silence costs a few points and buys time. The file stays in the drawer." } },
    { "label": { "fr": "Attaquer le magazine en diffamation", "en": "Sue the magazine for libel" },
      "when": { "minMoney": 120000 },
      "effects": { "money": -80000, "notoriete": 2, "popularity": -3, "standing": 4 },
      "result": { "fr": "La procédure durera des années. Elle envoie surtout un message aux autres rédactions.",
                  "en": "The case will drag on for years. What it really does is send a message to other newsrooms." } }
  ]
},


/* ==========================================================================
   14. CE QUE VOTRE PASSÉ VOUS RÉCLAME
   ==========================================================================
   Un événement par parcours : le métier qu'on a quitté ne quitte jamais
   personne. L'avocat retrouve ses clients, la journaliste ses confrères, le
   militant ses camarades, et chacun vient réclamer quelque chose au moment
   où l'on préférerait avoir toujours fait de la politique.

   Ces événements ne sortent que pour le parcours concerné : deux personnages
   différents ne doivent pas vivre la même partie.
   ========================================================================== */

{
  "id": "ancien_client",
  "weight": 5,
  "when": { "background": ["law"], "minTurn": 8 },
  "tag": { "fr": "Barreau", "en": "The bar" },
  "text": {
    "fr": "Un ancien client, que vous aviez fait relaxer, dirige aujourd'hui un groupe de BTP. Il aimerait « juste un rendez-vous » avec quelqu'un de votre majorité, et il rappelle en riant que vous connaissez bien son dossier.",
    "en": "A former client you once got acquitted now runs a construction group. He would like “just a meeting” with someone in your majority, and laughingly reminds you that you know his file rather well."
  },
  "choices": [
    { "label": { "fr": "Organiser le rendez-vous", "en": "Set up the meeting" },
      "effects": { "reseau": 2, "standing": 6, "money": 25000, "reputation": -1 },
      "effectsIf": [
        { "when": { "personality": ["principled"] }, "effects": { "reputation": -2, "popularity": -5 } },
        { "when": { "trait": ["intouchable"] }, "effects": { "untrait": "intouchable", "popularity": -6 } }
      ],
      "result": { "fr": "Le déjeuner dure deux heures. Personne n'a rien promis, tout le monde a compris.",
                  "en": "The lunch runs two hours. Nobody promised anything; everybody understood." } },
    { "label": { "fr": "Refuser en invoquant le secret professionnel", "en": "Refuse, citing professional privilege" },
      "effects": { "reputation": 2, "sangfroid": 1, "reseau": -2 },
      "result": { "fr": "Il comprend très bien, et il ne rappellera plus. Vous perdez un ami que vous n'aviez pas choisi.",
                  "en": "He understands perfectly, and will not call again. You lose a friend you never chose." } },
    { "label": { "fr": "Le recevoir et le renvoyer vers l'administration", "en": "See him, then send him to the civil service" },
      "effects": { "reseau": 1, "standing": 2, "energie": -1 },
      "result": { "fr": "Vous lui donnez le nom d'un bureau et le numéro d'un formulaire. C'est un refus, poliment habillé.",
                  "en": "You give him the name of an office and the number of a form. It is a refusal, politely dressed." } },
    { "label": { "fr": "Raconter la scène dans un entretien", "en": "Tell the story in an interview" },
      "when": { "stat": { "notoriete": { "min": 8 } } },
      "effects": { "notoriete": 1, "popularity": 9, "reseau": -3, "standing": -5 },
      "result": { "fr": "Vous ne le nommez pas, mais tout le barreau reconnaît l'anecdote. On vous appellera moins.",
                  "en": "You do not name him, but the whole bar recognises the story. Fewer people will call you now." } }
  ]
},


{
  "id": "ancienne_boite",
  "weight": 5,
  "when": { "background": ["business"], "minTurn": 10 },
  "tag": { "fr": "Anciens associés", "en": "Former partners" },
  "text": {
    "fr": "L'entreprise que vous avez dirigée annonce trois cents suppressions de postes, sur un site que vous aviez ouvert vous-même en promettant qu'il durerait.",
    "en": "The company you used to run announces three hundred job cuts, at a site you opened yourself while promising it would last."
  },
  "choices": [
    { "label": { "fr": "Défendre la décision de vos anciens associés", "en": "Defend your former partners' decision" },
      "effects": { "axis": {"economy": 65}, "reseau": 2, "standing": 4, "popularity": 7, "reputation": -1 },
      "result": { "fr": "Vous parlez de compétitivité avec des mots justes. Les images de l'usine tournent en boucle derrière vous.",
                  "en": "You talk about competitiveness in all the right words. Footage of the plant loops behind you." } },
    { "label": { "fr": "Aller devant l'usine avec les salariés", "en": "Stand outside the plant with the workers" },
      "effects": { "axis": {"economy": -70}, "popularity": 10, "energie": -2, "reseau": -3, "reputation": 1 },
      "effectsIf": [
        { "when": { "party": ["liberals", "conservatives"] }, "effects": { "standing": -8 } },
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 5 } }
      ],
      "result": { "fr": "On vous rappelle vos anciennes déclarations au mégaphone. Vous restez jusqu'au soir.",
                  "en": "They read your old statements back to you through a megaphone. You stay until dark." } },
    { "label": { "fr": "Négocier discrètement un plan de reprise", "en": "Quietly broker a rescue deal" },
      "roll": { "base": 18, "stat": "reseau", "plus": { "sangfroid": 0.4, "standing": 0.03 }, "dice": 16 },
      "success": { "effects": { "reseau": 2, "popularity": 8, "standing": 6, "energie": -2 },
        "result": { "fr": "Un repreneur sauve la moitié des postes. Vous n'en tirez aucune gloire publique, et c'est mieux ainsi.",
                    "en": "A buyer saves half the jobs. You get no public credit for it, which is just as well." } },
      "failure": { "effects": { "energie": -2, "popularity": -6, "reseau": -1 },
        "result": { "fr": "Les discussions fuitent avant d'aboutir. On vous reproche d'avoir donné de faux espoirs.",
                    "en": "The talks leak before they conclude. You are accused of raising false hopes." } } }
  ]
},


{
  "id": "anciens_confreres",
  "weight": 5,
  "when": { "background": ["journalism"], "minTurn": 8 },
  "tag": { "fr": "Rédaction", "en": "The newsroom" },
  "text": {
    "fr": "Votre ancienne rédaction prépare une enquête sur votre parti. Une consœur avec qui vous avez partagé un bureau pendant six ans vous demande un entretien, et elle a déjà les documents.",
    "en": "Your old newsroom is preparing an investigation into your party. A colleague you shared a desk with for six years asks for an interview, and she already has the documents."
  },
  "choices": [
    { "label": { "fr": "Lui parler franchement, en off", "en": "Talk to her honestly, off the record" },
      "effects": { "reputation": 1, "popularity": 4, "standing": -7 },
      "result": { "fr": "L'article sort mesuré et documenté. Votre parti sait d'où vient la nuance, et n'apprécie pas.",
                  "en": "The piece runs measured and documented. Your party knows where the nuance came from, and does not like it." } },
    { "label": { "fr": "Utiliser vos contacts pour retarder l'enquête", "en": "Use your contacts to delay the story" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "standing": 8, "reseau": 1, "reputation": -2, "strike": "menteur" },
        "result": { "fr": "L'enquête sort trois mois plus tard, noyée dans l'actualité. Elle sait que c'est vous.",
                    "en": "The story runs three months later, buried in the news cycle. She knows it was you." } },
      "failure": { "effects": { "popularity": -10, "standing": -4, "reputation": -2, "strike": "casserole" },
        "result": { "fr": "Vos appels deviennent le sujet de l'article. Le métier n'aime pas qu'on lui fasse ça.",
                    "en": "Your phone calls become the story. The trade does not forgive that." } } },
    { "label": { "fr": "Refuser l'entretien et ne rien commenter", "en": "Decline the interview and say nothing" },
      "effects": { "sangfroid": 1, "popularity": -5, "standing": 3 },
      "result": { "fr": "La formule « n'a pas souhaité répondre » figure en gras dans le troisième paragraphe.",
                  "en": "“Did not wish to comment” appears in bold in the third paragraph." } },
    { "label": { "fr": "Lui donner de quoi viser plus haut que vous", "en": "Give her something aimed higher than you" },
      "when": { "personality": ["calculating"] },
      "effects": { "reseau": 1, "standing": -4, "popularity": 6, "notoriete": 1, "reputation": -1 },
      "result": { "fr": "L'enquête change de cible en cours de route. Un rival passe une très mauvaise semaine.",
                  "en": "The investigation changes target along the way. A rival has a very bad week." } }
  ]
},


{
  "id": "camarades_origine",
  "weight": 5,
  "when": { "background": ["activism"], "minTurn": 12 },
  "tag": { "fr": "Camarades", "en": "Comrades" },
  "text": {
    "fr": "Le collectif où vous avez commencé publie une tribune : « Nos anciens sont devenus ce qu'ils combattaient. » Votre nom est cité deux fois, avec une photo de vous en costume.",
    "en": "The group where you started publishes an open letter: “Our old comrades have become what they used to fight.” Your name appears twice, alongside a photo of you in a suit."
  },
  "choices": [
    { "label": { "fr": "Aller vous expliquer à leur assemblée générale", "en": "Go and explain yourself at their meeting" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "reputation": 0.4 }, "dice": 16 },
      "success": { "effects": { "axis": {"economy": -50, "social": -40}, "reputation": 2, "popularity": 7, "energie": -2, "reseau": 1 },
        "result": { "fr": "Trois heures de discussion debout. Vous ne les convainquez pas tous, mais vous êtes venu.",
                    "en": "Three hours of standing debate. You do not convince them all, but you came." } },
      "failure": { "effects": { "popularity": -7, "energie": -2, "reputation": -1 },
        "result": { "fr": "On vous coupe la parole quatre fois. La vidéo du dernier échange fait le tour du militantisme.",
                    "en": "You are cut off four times. The video of the last exchange goes round every activist group." } } },
    { "label": { "fr": "Assumer d'avoir changé", "en": "Own the fact that you changed" },
      "effects": { "sangfroid": 1, "standing": 6, "popularity": -4, "reputation": -1 },
      "effectsIf": [
        { "when": { "party": ["radical_left"] }, "effects": { "standing": -10, "strike": "traitre" } }
      ],
      "result": { "fr": "« On ne gouverne pas avec des slogans. » La phrase est reprise partout, dans les deux sens.",
                  "en": "“You do not govern with slogans.” The line is quoted everywhere, cutting both ways." } },
    { "label": { "fr": "Leur financer une salle et du matériel", "en": "Pay for a venue and equipment for them" },
      "when": { "minMoney": 40000 },
      "effects": { "money": -30000, "reseau": 2, "popularity": 3, "reputation": 1 },
      "result": { "fr": "Ils acceptent l'argent et maintiennent la tribune. C'est très exactement ce que vous auriez fait à leur place.",
                  "en": "They take the money and keep the letter up. It is exactly what you would have done in their place." } }
  ]
},


{
  "id": "note_administration",
  "weight": 5,
  "when": { "background": ["civil"], "position": ["depute", "chef", "maire", "ministre"] },
  "tag": { "fr": "Administration", "en": "The civil service" },
  "text": {
    "fr": "Un ancien collègue de votre direction vous fait passer une note interne accablante pour le gouvernement. Elle n'est pas classifiée, mais elle n'est pas non plus destinée à sortir.",
    "en": "A former colleague from your old department passes you an internal memo that is devastating for the government. It is not classified, but it was not meant to leave the building either."
  },
  "choices": [
    { "label": { "fr": "La sortir en séance", "en": "Read it out in the chamber" },
      "effects": { "notoriete": 2, "popularity": 10, "standing": 4, "reseau": -3 },
      "effectsIf": [
        { "when": { "personality": ["principled"] }, "effects": { "reputation": -1 } }
      ],
      "result": { "fr": "L'effet est considérable. Votre ancienne maison saura d'où vient la fuite, et vous fermera ses portes.",
                  "en": "The effect is considerable. Your old department will know where the leak came from, and will close its doors." } },
    { "label": { "fr": "La garder pour un meilleur moment", "en": "Keep it for a better moment" },
      "effects": { "sangfroid": 2, "reseau": 1, "standing": 3, "popularity": -2 },
      "result": { "fr": "Elle dort dans un tiroir. Vous la ressortirez quand elle fera vraiment mal, si elle est encore vraie.",
                  "en": "It sleeps in a drawer. You will use it when it really hurts, if it is still true by then." } },
    { "label": { "fr": "La renvoyer sans l'avoir lue", "en": "Send it back unread" },
      "effects": { "reputation": 2, "reseau": 2, "popularity": -3, "standing": -3 },
      "result": { "fr": "Votre ancien collègue vous en est reconnaissant. Il vous doit désormais quelque chose de plus utile qu'une note.",
                  "en": "Your former colleague is grateful. He now owes you something more useful than a memo." } }
  ]
},


{
  "id": "vieille_these",
  "weight": 5,
  "when": { "background": ["academia"], "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Archives", "en": "Archives" },
  "text": {
    "fr": "Un doctorant exhume un article que vous avez publié il y a vingt ans. Vous y défendiez exactement le contraire de votre programme actuel, avec quatre-vingts notes de bas de page.",
    "en": "A doctoral student unearths a paper you published twenty years ago. In it you argued the exact opposite of your current platform, with eighty footnotes."
  },
  "choices": [
    { "label": { "fr": "Revendiquer d'avoir changé d'avis", "en": "Claim the right to have changed your mind" },
      "effects": { "eloquence": 1, "reputation": 1, "popularity": 4, "standing": -3 },
      "result": { "fr": "« Un chercheur qui ne change jamais d'avis n'a jamais cherché. » La formule sauve la journée.",
                  "en": "“A researcher who never changes his mind never researched anything.” The line saves the day." } },
    { "label": { "fr": "Expliquer que le contexte était différent", "en": "Explain that the context was different" },
      "effects": { "popularity": -5, "standing": 4, "sangfroid": 1 },
      "effectsIf": [
        { "when": { "trait": ["menteur"] }, "effects": { "popularity": -5 } }
      ],
      "result": { "fr": "Vous parlez douze minutes de méthodologie. Le sujet meurt d'ennui, ce qui était le but.",
                  "en": "You talk methodology for twelve minutes. The story dies of boredom, which was the point." } },
    { "label": { "fr": "Republier l'article avec une préface", "en": "Republish the paper with a new preface" },
      "effects": { "eloquence": 1, "notoriete": 1, "reputation": 2, "energie": -1, "popularity": 2 },
      "result": { "fr": "Vous assumez le texte et vous racontez pourquoi vous en êtes revenu. Trois mille personnes le lisent, dont tous les journalistes.",
                  "en": "You stand by the text and explain how you moved away from it. Three thousand people read it, including every journalist." } }
  ]
},


{
  "id": "archives_reseaux",
  "weight": 5,
  "when": { "background": ["celebrity"], "minTurn": 6 },
  "tag": { "fr": "Archives", "en": "Archives" },
  "text": {
    "fr": "Une chaîne compile vos anciennes vidéos : les partenariats, les défis, la période où vous vendiez des compléments alimentaires. Le montage dure onze minutes et il est très bien fait.",
    "en": "A channel compiles your old videos: the brand deals, the challenges, the period when you were selling food supplements. The edit runs eleven minutes and it is very well made."
  },
  "choices": [
    { "label": { "fr": "En rire et republier la compilation", "en": "Laugh and repost the compilation yourself" },
      "effects": { "charisme": 1, "notoriete": 2, "popularity": 8, "standing": -6 },
      "result": { "fr": "Vous la partagez avec un commentaire moqueur. Le pays trouve ça sain, votre parti trouve ça consternant.",
                  "en": "You share it with a mocking caption. The country finds it healthy; your party finds it appalling." } },
    { "label": { "fr": "Faire retirer les vidéos", "en": "Have the videos taken down" },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "minMoney": 200000 }, "value": 0.25 } ] },
      "success": { "effects": { "money": -60000, "popularity": -3, "standing": 3 },
        "result": { "fr": "Les vidéos disparaissent. Quatre personnes les avaient déjà téléchargées, et elles attendront.",
                    "en": "The videos vanish. Four people had already downloaded them, and they will wait." } },
      "failure": { "effects": { "money": -60000, "popularity": -12, "notoriete": 2, "strike": "casserole" },
        "result": { "fr": "La tentative de retrait devient l'histoire. Le montage est vu dix fois plus qu'avant.",
                    "en": "The takedown attempt becomes the story. The compilation is seen ten times more than before." } } },
    { "label": { "fr": "Raconter ce que ça payait", "en": "Explain what it paid for" },
      "effects": { "reputation": 2, "popularity": 7, "energie": -1 },
      "effectsIf": [
        { "when": { "origin": ["modest"] }, "effects": { "popularity": 5 } },
        { "when": { "origin": ["bourgeois", "dynasty"] }, "effects": { "popularity": -7, "reputation": -1 } }
      ],
      "result": { "fr": "Vous expliquez le loyer, les factures et l'absence de plan B. Selon d'où vous venez, l'histoire touche ou fait rire.",
                  "en": "You explain the rent, the bills and the absence of a plan B. Depending on where you come from, the story lands or it does not." } }
  ]
},


{
  "id": "slogans_adversaire",
  "weight": 5,
  "when": { "background": ["comms"], "minTurn": 10 },
  "tag": { "fr": "Agence", "en": "The agency" },
  "text": {
    "fr": "Un journaliste retrouve les campagnes que vous avez écrites du temps de l'agence. Vous avez signé, il y a douze ans, les affiches de celui que vous combattez aujourd'hui.",
    "en": "A reporter digs up the campaigns you wrote back in your agency days. Twelve years ago you signed off on the posters of the man you now fight."
  },
  "choices": [
    { "label": { "fr": "Assumer : c'était un métier", "en": "Own it: it was a job" },
      "effects": { "sangfroid": 1, "popularity": -4, "standing": 3, "eloquence": 1 },
      "result": { "fr": "« On m'a payé pour vendre, aujourd'hui je suis payé pour décider. » C'est honnête et ça ne rassure personne.",
                  "en": "“I was paid to sell; now I am paid to decide.” It is honest and it reassures nobody." } },
    { "label": { "fr": "Retourner votre connaissance de leurs méthodes", "en": "Turn your knowledge of their methods against them" },
      "effects": { "notoriete": 2, "popularity": 9, "reseau": -2, "standing": -2 },
      "result": { "fr": "Vous racontez comment se fabrique une campagne, exemples à l'appui. Le métier vous déteste, le public adore.",
                  "en": "You explain how a campaign gets manufactured, with examples. The trade hates you; the public loves it." } },
    { "label": { "fr": "Faire venir votre ancienne agence sur votre campagne", "en": "Bring your old agency onto your campaign" },
      "when": { "minMoney": 120000 },
      "effects": { "money": -100000, "standing": 5, "reseau": 2, "reputation": -2, "popularity": -3 },
      "result": { "fr": "Ils sont excellents et ils coûtent cher. Vos militants découvrent le slogan en même temps que le pays.",
                  "en": "They are excellent and they are expensive. Your activists discover the slogan at the same time as the country." } }
  ]
},


/* ==========================================================================
   15. CE QUE VOTRE CARACTÈRE VOUS FAIT FAIRE
   ==========================================================================
   Un événement par personnalité. Le tempérament n'est pas un bonus, c'est
   une manière de se mettre dans des situations que les autres n'auraient
   jamais rencontrées.
   ========================================================================== */

{
  "id": "dossier_de_trop",
  "weight": 5,
  "when": { "personality": ["hardworking"], "position": ["depute", "chef", "maire", "ministre"] },
  "tag": { "fr": "Travail", "en": "Work" },
  "text": {
    "fr": "Vous avez passé quatre mois sur un rapport de trois cents pages que personne ne lira. Il est excellent. Pendant ce temps, deux collègues ont fait la une avec trois phrases.",
    "en": "You spent four months on a three-hundred-page report nobody will read. It is excellent. Meanwhile two colleagues made the front page with three sentences."
  },
  "choices": [
    { "label": { "fr": "Le défendre point par point en commission", "en": "Defend it line by line in committee" },
      "effects": { "standing": 8, "eloquence": 1, "energie": -2, "popularity": -3 },
      "result": { "fr": "Les spécialistes vous citeront pendant dix ans. Le pays n'en saura jamais rien.",
                  "en": "Specialists will quote you for a decade. The country will never hear about it." } },
    { "label": { "fr": "En tirer une formule et la marteler", "en": "Boil it down to one line and hammer it" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 10, "standing": -2 },
        "result": { "fr": "Une phrase, tirée de la page 214, tourne pendant une semaine. Le rapport, lui, reste fermé.",
                    "en": "One sentence, from page 214, runs for a week. The report itself stays shut." } },
      "failure": { "effects": { "popularity": -4, "energie": -1, "standing": -2 },
        "result": { "fr": "La formule tombe à plat. On vous trouve technique, ce qui n'est jamais un compliment.",
                    "en": "The line falls flat. People find you technical, which is never a compliment." } } },
    { "label": { "fr": "Le confier à un collègue plus médiatique", "en": "Hand it to a more telegenic colleague" },
      "effects": { "reseau": 2, "standing": 5, "energie": 1, "notoriete": -1, "popularity": -2 },
      "result": { "fr": "Il le présente très bien et vous remercie en privé. Personne d'autre ne saura qui l'a écrit.",
                  "en": "He presents it beautifully and thanks you in private. Nobody else will know who wrote it." } },
    { "label": { "fr": "Prendre enfin trois semaines de vacances", "en": "Finally take three weeks off" },
      "effects": { "energie": 4, "standing": -4, "popularity": -2 },
      "result": { "fr": "Vous dormez, vous lisez autre chose, vous revenez vivant. Votre absence a été remarquée.",
                  "en": "You sleep, you read something else, you come back alive. Your absence was noticed." } }
  ]
},


{
  "id": "rumeur_charme",
  "weight": 5,
  "when": { "personality": ["charming"], "stat": { "notoriete": { "min": 8 } } },
  "tag": { "fr": "Rumeur", "en": "Rumour" },
  "text": {
    "fr": "Une rumeur circule sur votre vie privée. Elle est fausse, elle est invérifiable, et elle repose entièrement sur le fait que vous mettez les gens à l'aise.",
    "en": "A rumour is going round about your private life. It is false, it is unverifiable, and it rests entirely on the fact that you put people at ease."
  },
  "choices": [
    { "label": { "fr": "Démentir fermement, une fois", "en": "Deny it firmly, once" },
      "effects": { "sangfroid": 1, "popularity": -3, "reputation": 1 },
      "result": { "fr": "Un communiqué de quatre lignes, puis plus rien. La rumeur met six mois à mourir.",
                  "en": "A four-line statement, then nothing. The rumour takes six months to die." } },
    { "label": { "fr": "En jouer sans jamais confirmer", "en": "Play with it without ever confirming" },
      "effects": { "charisme": 1, "notoriete": 2, "popularity": 8, "reputation": -2, "standing": -4 },
      "result": { "fr": "Vous répondez par un sourire et un silence. C'est efficace, et cela vous poursuivra longtemps.",
                  "en": "You answer with a smile and a silence. It works, and it will follow you for years." } },
    { "label": { "fr": "Chercher qui l'a lancée", "en": "Find out who started it" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "reseau": 1, "standing": 6, "energie": -1 },
        "result": { "fr": "Vous remontez jusqu'à un collaborateur d'un rival. Vous ne dites rien, vous rangez.",
                    "en": "You trace it back to a rival's staffer. You say nothing; you file it away." } },
      "failure": { "effects": { "energie": -2, "reseau": -1, "popularity": -4 },
        "result": { "fr": "Votre enquête se sait avant d'aboutir. On vous trouve obsédé, ce qui alimente la rumeur.",
                    "en": "Your inquiry becomes known before it concludes. People find you obsessive, which feeds the rumour." } } }
  ]
},


{
  "id": "mot_de_trop",
  "weight": 5,
  "when": { "personality": ["clever"], "minTurn": 6 },
  "tag": { "fr": "Bon mot", "en": "The clever line" },
  "text": {
    "fr": "Vous avez lâché en plateau une formule brillante sur un adversaire. Elle est drôle, elle est juste, et elle donne surtout l'impression que vous vous trouvez très intelligent.",
    "en": "On air you produced a brilliant line about an opponent. It is funny, it is accurate, and above all it makes you look like a man who thinks he is very clever."
  },
  "choices": [
    { "label": { "fr": "Assumer et recommencer", "en": "Own it and do it again" },
      "effects": { "landscape": { "self": -0.8 }, "notoriete": 2, "eloquence": 1, "popularity": 5, "reputation": -2 },
      "effectsIf": [
        { "when": { "origin": ["bourgeois", "dynasty"] }, "effects": { "popularity": -8 } }
      ],
      "result": { "fr": "Votre réputation d'esprit est faite. Selon votre pedigree, on parlera de finesse ou de mépris.",
                  "en": "Your reputation for wit is made. Depending on your pedigree, they will call it sharpness or contempt." } },
    { "label": { "fr": "Vous excuser auprès de l'intéressé", "en": "Apologise to the man himself" },
      "effects": { "reseau": 2, "reputation": 2, "standing": 4, "popularity": -3 },
      "result": { "fr": "Un appel de trois minutes qui vaudra un vote un jour. Personne n'en saura rien.",
                  "en": "A three-minute call that will be worth a vote one day. Nobody will ever know." } },
    { "label": { "fr": "Expliquer la formule", "en": "Explain the joke" },
      "effects": { "eloquence": 1, "popularity": -6, "standing": 2, "energie": -1 },
      "result": { "fr": "Vous passez quatre minutes à démonter votre propre plaisanterie. C'est la pire chose à faire et vous le savez.",
                  "en": "You spend four minutes taking your own joke apart. It is the worst possible move and you know it." } }
  ]
},


{
  "id": "proces_outrance",
  "weight": 5,
  "when": { "personality": ["provocative"], "minTurn": 14, "stat": { "notoriete": { "min": 10 } } },
  "tag": { "fr": "Outrance", "en": "Excess" },
  "text": {
    "fr": "Trois éditorialistes signent le même jour des textes intitulés à peu près « jusqu'où ira-t-il ». Votre entourage vous conseille une séquence de respectabilité.",
    "en": "Three columnists publish pieces on the same day all titled roughly “how far will he go”. Your staff advise a stretch of respectability."
  },
  "choices": [
    { "label": { "fr": "Faire la séquence sérieuse", "en": "Do the serious stretch" },
      "effects": { "reputation": 2, "standing": 6, "appeal": { "self": -7 }, "notoriete": -1 },
      "result": { "fr": "Deux mois de visites d'usines et de discours mesurés. Votre base s'ennuie et vous le fait savoir.",
                  "en": "Two months of factory visits and measured speeches. Your base is bored and lets you know." } },
    { "label": { "fr": "En rajouter dès le lendemain", "en": "Go further the very next day" },
      "effects": { "axis": "self", "notoriete": 3, "popularity": 9, "reputation": -2, "standing": -8, "strike": "radical" },
      "result": { "fr": "La phrase suivante est pire que la précédente. Vous existez, et vous rétrécissez votre horizon.",
                  "en": "The next line is worse than the last. You exist, and your horizon narrows." } },
    { "label": { "fr": "Retourner l'accusation contre la presse", "en": "Turn the accusation back on the press" },
      "roll": { "base": 16, "stat": "charisme", "plus": { "eloquence": 0.4, "popularity": 0.03 }, "dice": 16 },
      "success": { "effects": { "notoriete": 2, "popularity": 8, "standing": -3 },
        "result": { "fr": "Vous parlez de commentateurs coupés du pays. Une partie du pays approuve bruyamment.",
                    "en": "You talk about commentators cut off from the country. A part of the country loudly agrees." } },
      "failure": { "effects": { "popularity": -8, "reputation": -1, "standing": -4 },
        "result": { "fr": "L'attaque tombe mal après une semaine déjà chargée. On vous trouve fatigant.",
                    "en": "The attack lands badly after an already heavy week. People find you tiring." } } }
  ]
},


{
  "id": "arrangement_propose",
  "weight": 5,
  "when": { "personality": ["principled"], "minTurn": 10 },
  "tag": { "fr": "Arrangement", "en": "The arrangement" },
  "text": {
    "fr": "On vous propose un accord très simple : vous retirez un amendement gênant, et une circonscription sûre vous attend aux prochaines élections. Tout le monde autour de la table trouve cela normal.",
    "en": "You are offered a very simple deal: you withdraw an inconvenient amendment, and a safe seat awaits you at the next election. Everyone around the table finds this perfectly normal."
  },
  "choices": [
    { "label": { "fr": "Refuser et le dire à la sortie", "en": "Refuse, and say so on the way out" },
      "effects": { "reputation": 2, "popularity": 9, "standing": -12, "reseau": -2 },
      "result": { "fr": "Votre refus circule dans le bâtiment avant vous. On vous respecte et on cesse de vous inviter.",
                  "en": "Your refusal travels through the building faster than you do. They respect you and stop inviting you." } },
    { "label": { "fr": "Accepter, une fois", "en": "Accept, just this once" },
      "effects": { "standing": 12, "reseau": 2, "popularity": -3 },
      "effectsIf": [
        { "when": { "trait": ["intouchable"] }, "effects": { "untrait": "intouchable", "reputation": -2, "popularity": -8 } }
      ],
      "result": { "fr": "L'amendement disparaît sans un mot. C'est la première fois, et vous savez déjà que ce ne sera pas la dernière.",
                  "en": "The amendment vanishes without a word. It is the first time, and you already know it will not be the last." } },
    { "label": { "fr": "Refuser et faire voter l'amendement", "en": "Refuse, and get the amendment passed" },
      "roll": { "base": 19, "stat": "eloquence", "plus": { "reseau": 0.4, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "reputation": 2, "notoriete": 1, "popularity": 11, "standing": -6 },
        "result": { "fr": "Le texte passe de justesse. Trois collègues qui avaient promis le contraire ont voté avec vous.",
                    "en": "The text scrapes through. Three colleagues who had promised otherwise voted with you." } },
      "failure": { "effects": { "popularity": 3, "standing": -14, "energie": -2 },
        "result": { "fr": "L'amendement est rejeté à une large majorité. Vous avez tout perdu, sauf la face.",
                    "en": "The amendment is rejected by a wide margin. You lost everything except face." } } }
  ]
},


{
  "id": "coup_davance",
  "weight": 5,
  "when": { "personality": ["calculating"], "minTurn": 12 },
  "tag": { "fr": "Manœuvre", "en": "The manoeuvre" },
  "text": {
    "fr": "Votre plan pour la prochaine investiture était bien construit. Un allié vient de comprendre qu'il en faisait partie sans le savoir, et il vous attend dans votre bureau.",
    "en": "Your plan for the next nomination was well built. An ally has just worked out that he was part of it without knowing, and he is waiting in your office."
  },
  "choices": [
    { "label": { "fr": "Tout lui expliquer, et lui offrir sa part", "en": "Explain everything, and offer him his share" },
      "effects": { "reseau": 2, "standing": 5, "sangfroid": 1, "popularity": -2 },
      "result": { "fr": "Il accepte, à contrecœur et pour longtemps. Vous venez de fabriquer un associé, pas un ami.",
                  "en": "He accepts, reluctantly and for a long time. You have just made a partner, not a friend." } },
    { "label": { "fr": "Nier en bloc", "en": "Deny everything" },
      "roll": { "base": 18, "stat": "sangfroid", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "standing": 6, "sangfroid": 1, "strike": "menteur" },
        "result": { "fr": "Il repart en doutant de lui-même. C'est votre meilleur travail de la semaine.",
                    "en": "He leaves doubting himself. It is your best work of the week." } },
      "failure": { "effects": { "standing": -12, "reseau": -3, "reputation": -2, "strike": "traitre" },
        "result": { "fr": "Il avait les messages. Le lendemain, la moitié du parti les a lus.",
                    "en": "He had the messages. By the next morning half the party had read them." } } },
    { "label": { "fr": "Le prendre de vitesse et le griller d'abord", "en": "Move first and burn him" },
      "effects": { "standing": 8, "reseau": -3, "reputation": -2, "popularity": -4, "strike": "traitre" },
      "result": { "fr": "Vous racontez votre version avant la sienne. Elle tient trois semaines, ce qui suffit.",
                  "en": "You tell your version before he can tell his. It holds for three weeks, which is enough." } }
  ]
},

/* ==========================================================================
   19. CE QUE LA VIE POLITIQUE FAIT DE CE QU'ON EST
   ==========================================================================
   Ces événements ne se jouent que pour certains personnages. Ils ne portent
   aucun jugement sur ce qu'ils sont : ils racontent ce que l'appareil, la
   presse et les électeurs en font, ce qui est très différent et beaucoup plus
   drôle. La conséquence d'un même choix change selon le parti, par les
   "effectsIf" : c'est le camp qui juge, pas le jeu.
   ========================================================================== */

{
  "id": "consigne_discretion",
  "once": true,
  "weight": 5,
  "when": { "trait": ["homosexuel"], "minTurn": 6, "position": ["conseiller", "maire", "euro", "depute"] },
  "tag": { "fr": "Avant l'investiture", "en": "Before the nomination" },
  "text": {
    "fr": "Un cadre de la fédération vous prend à part avant la commission d'investiture. Il ne dit rien de désagréable, il parle de « circonscription rurale », de « moment mal choisi » et de « prudence ». Il conclut en disant que lui, personnellement, s'en moque.",
    "en": "A senior figure takes you aside before the nominations committee. He says nothing unpleasant; he mentions the “rural constituency”, the “wrong moment” and “caution”. He finishes by saying that he personally could not care less."
  },
  "choices": [
    { "label": { "fr": "Suivre la consigne", "en": "Follow the advice" },
      "effects": { "standing": 9, "reputation": -2, "popularity": -2, "sangfroid": 1 },
      "result": { "fr": "Vous ne mentez sur rien, vous ne dites simplement rien, et vous découvrez que c'est une occupation à plein temps. L'investiture arrive, et une fatigue avec elle.",
                  "en": "You lie about nothing, you simply say nothing, and you discover it is a full-time occupation. The nomination comes through, and a particular tiredness with it." } },
    { "label": { "fr": "Répondre que la question ne se pose pas", "en": "Answer that the question does not arise" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": -4 },
      "result": { "fr": "Vous le regardez sans répondre jusqu'à ce qu'il change de sujet, ce qui prend onze secondes. Il vous soutiendra quand même, en le racontant autrement.",
                  "en": "You look at him without answering until he changes the subject, which takes eleven seconds. He will back you anyway, and tell the story differently." } },
    { "label": { "fr": "Prendre les devants et en parler publiquement", "en": "Get ahead of it and say it publicly" },
      "effects": { "notoriete": 2, "popularity": 5, "reputation": 3, "standing": -6 },
      "effectsIf": [
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 10, "popularity": 4 } },
        { "when": { "party": ["conservatives"] }, "effects": { "standing": -6 } },
        { "when": { "party": ["identitarians"] }, "effects": { "standing": -14, "popularity": -6 } }
      ],
      "result": { "fr": "Une phrase dans une interview, sans emphase, au milieu d'un paragraphe sur autre chose. Elle fait quatre jours de commentaires et vous ne la répéterez plus jamais.",
                  "en": "One sentence in an interview, no emphasis, in the middle of a paragraph about something else. It runs for four days and you will never repeat it." } }
  ]
},


{
  "id": "menace_outing",
  "weight": 4,
  "when": { "trait": ["homosexuel"], "minTurn": 12, "position": ["depute", "ministre", "chef", "euro"] },
  "tag": { "fr": "Un hebdomadaire", "en": "A weekly" },
  "text": {
    "fr": "Un journal vous prévient qu'il publie jeudi. Ce n'est pas une enquête, il n'y a rien à enquêter : c'est un papier sur votre vie privée, écrit sur le ton de celui qui rend service en disant la vérité.",
    "en": "A paper warns you it publishes on Thursday. It is not an investigation, there is nothing to investigate: it is a piece about your private life, written in the tone of somebody doing you a favour by telling the truth."
  },
  "choices": [
    { "label": { "fr": "Le devancer d'un jour", "en": "Beat them by a day" },
      "effects": { "axis": {"social": -60}, "notoriete": 2, "popularity": 9, "reputation": 2, "energie": -1 },
      "effectsIf": [
        { "when": { "party": ["identitarians", "conservatives"] }, "effects": { "standing": -10 } },
        { "when": { "party": ["radical_left", "socdem"] }, "effects": { "standing": 6 } }
      ],
      "result": { "fr": "Vous publiez mercredi soir, en trois phrases, sans photo et sans confidence. Le papier du jeudi tombe à plat et son auteur explique partout qu'il allait le sortir en bien.",
                  "en": "You publish on Wednesday evening, three sentences, no photograph and no confidences. Thursday's piece falls flat and its author explains everywhere that he was going to be kind about it." } },
    { "label": { "fr": "Attaquer en justice pour vie privée", "en": "Sue over privacy" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "money": 0.5 }, "dice": 16 },
      "success": { "effects": { "money": -25000, "reputation": 2, "standing": 4, "popularity": -2 },
        "result": { "fr": "Le papier ne sort pas. Trois rédactions savent pourquoi, ce qui vous coûtera un jour beaucoup plus cher que l'avocat.",
                    "en": "The piece does not run. Three newsrooms know why, which will one day cost you far more than the lawyer did." } },
      "failure": { "effects": { "money": -25000, "popularity": -6, "notoriete": 2, "standing": -4 },
        "result": { "fr": "Le référé est rejeté et le rejet devient le sujet. On ne parle plus de votre vie privée, on parle de vos avocats.",
                    "en": "The injunction is refused and the refusal becomes the story. Nobody talks about your private life any more, they talk about your lawyers." } } },
    { "label": { "fr": "Ne rien faire et laisser paraître", "en": "Do nothing and let it run" },
      "effects": { "sangfroid": 2, "popularity": 2, "reputation": 1, "energie": -1, "strike": "lache" },
      "result": { "fr": "L'article paraît, il est lu, et il ne se passe rien du tout. Vous avez passé six jours à préparer une tempête qui n'est pas venue, et c'est ça qui vous met en colère.",
                  "en": "The piece runs, it is read, and absolutely nothing happens. You spent six days preparing for a storm that never came, and that is what makes you angry." } }
  ]
},


{
  "id": "conjoint_officiel",
  "once": true,
  "weight": 4,
  "when": { "trait": ["homosexuel"], "minTurn": 16, "position": ["ministre", "chef", "depute"] },
  "tag": { "fr": "Le protocole", "en": "Protocol" },
  "text": {
    "fr": "Un déplacement officiel à l'étranger, avec la photo de famille habituelle sur le perron. Le service du protocole demande, par écrit et très poliment, si votre conjoint « souhaite figurer », formule qu'on n'emploie pour personne d'autre.",
    "en": "An official trip abroad, with the usual family photograph on the steps. The protocol office asks, in writing and very politely, whether your partner “wishes to appear”, a form of words used for nobody else."
  },
  "choices": [
    { "label": { "fr": "Il figure, comme tous les autres", "en": "He appears, like everybody else" },
      "effects": { "popularity": 6, "reputation": 2, "notoriete": 1 },
      "effectsIf": [
        { "when": { "party": ["identitarians", "conservatives"] }, "effects": { "standing": -8, "popularity": -4 } }
      ],
      "result": { "fr": "La photo est banale, ce qui est exactement le but. Deux chaînes la commentent pendant quarante minutes, ce qui prouve qu'elle ne l'était pas encore.",
                  "en": "The photograph is unremarkable, which is exactly the point. Two channels discuss it for forty minutes, which proves it was not unremarkable yet." } },
    { "label": { "fr": "Y aller seul, pour ne pas l'exposer", "en": "Go alone, to keep him out of it" },
      "effects": { "standing": 4, "popularity": -2, "energie": -1 },
      "result": { "fr": "Vous lui expliquez que c'est plus simple, il répond que oui, bien sûr, et vous savez tous les deux que vous venez de choisir votre carrière contre lui.",
                  "en": "You explain that it is simpler, he says of course it is, and you both know you have just chosen your career over him." } },
    { "label": { "fr": "Demander pourquoi la question est posée", "en": "Ask why the question is being asked" },
      "effects": { "reputation": 3, "notoriete": 1, "standing": -5, "popularity": 3 },
      "result": { "fr": "Vous répondez au protocole par une lettre de quatre lignes qui fuite dans la semaine. Le service change son formulaire l'année suivante, sans le dire à personne.",
                  "en": "You answer protocol with a four-line letter that leaks within the week. The office changes its form the following year, without telling anyone." } }
  ]
},


{
  "id": "orthophoniste",
  "once": true,
  "weight": 5,
  "when": { "trait": ["zozote"], "minTurn": 6 },
  "tag": { "fr": "Travail de la voix", "en": "Voice coaching" },
  "text": {
    "fr": "Votre équipe a pris rendez-vous pour vous chez une orthophoniste, sans vous demander. Le devis est déjà signé et le premier créneau est mardi.",
    "en": "Your team has booked you an appointment with a speech therapist, without asking. The estimate is already signed and the first slot is Tuesday."
  },
  "choices": [
    { "label": { "fr": "Y aller sérieusement, pendant deux ans", "en": "Go seriously, for two years" },
      "roll": { "base": 14, "stat": "energie", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "untrait": "zozote", "eloquence": 2, "energie": -1, "money": -9000 },
        "result": { "fr": "Deux séances par semaine pendant deux ans, et un jour vous prononcez un discours entier sans y penser une seule fois. Les imitateurs mettent six mois à s'en apercevoir.",
                    "en": "Two sessions a week for two years, and one day you deliver a whole speech without thinking about it once. It takes the impressionists six months to notice." } },
      "failure": { "effects": { "energie": -2, "money": -9000, "popularity": -2 },
        "result": { "fr": "Vous y allez trois mois, puis les déplacements reprennent. Il vous reste un exercice de respiration que vous faites dans les ascenseurs.",
                    "en": "You go for three months, then the travelling starts again. What remains is a breathing exercise you do in lifts." } } },
    { "label": { "fr": "Annuler le rendez-vous", "en": "Cancel the appointment" },
      "effects": { "reputation": 2, "sangfroid": 1, "standing": -4 },
      "result": { "fr": "Vous expliquez que vous parlez comme ça depuis toujours et que le pays s'en remettra. Votre attachée de presse note la phrase, au cas où elle servirait.",
                  "en": "You explain that you have always talked like this and that the country will cope. Your press officer writes the line down, in case it comes in useful." } },
    { "label": { "fr": "En faire votre marque de fabrique", "en": "Make it your trademark" },
      "effects": { "notoriete": 2, "popularity": 7, "charisme": 1, "standing": -5 },
      "result": { "fr": "Vous ouvrez votre meeting suivant en imitant l'imitateur qui vous imite. La salle hurle, et personne ne se moque plus de la même façon après ça.",
                  "en": "You open your next rally by doing an impression of the impressionist who does you. The hall roars, and nobody mocks you quite the same way afterwards." } }
  ]
},


{
  "id": "imitateur",
  "weight": 4,
  "when": { "anyTrait": ["zozote", "voix"], "minTurn": 14, "stat": { "notoriete": { "min": 9 } } },
  "tag": { "fr": "L'imitateur", "en": "The impressionist" },
  "text": {
    "fr": "Un humoriste a construit un numéro entier sur votre façon de parler. Il passe en deuxième partie de soirée, il est très bon, et son sketch est désormais plus connu que vos propositions.",
    "en": "A comedian has built an entire routine on the way you speak. He is on late in the evening, he is very good, and his sketch is now better known than your policies."
  },
  "choices": [
    { "label": { "fr": "L'inviter à un meeting", "en": "Invite him to a rally" },
      "effects": { "popularity": 9, "charisme": 1, "notoriete": 1, "standing": -4 },
      "result": { "fr": "Il monte sur scène, vous fait devant vous, et vous reprenez le micro derrière lui. La séquence vaut trois mois de campagne et coûte un dîner.",
                  "en": "He comes on stage, does you to your face, and you take the microphone after him. The clip is worth three months of campaigning and costs one dinner." } },
    { "label": { "fr": "Se plaindre à la chaîne", "en": "Complain to the channel" },
      "effects": { "popularity": -8, "reputation": -2, "standing": 3, "strike": "lache" },
      "result": { "fr": "La chaîne ne change rien et le numéro passe désormais en première partie de soirée, avec votre plainte comme introduction.",
                  "en": "The channel changes nothing and the routine now runs in prime time, with your complaint as the introduction." } },
    { "label": { "fr": "Travailler la voix jusqu'à rendre l'imitation fausse", "en": "Work on the voice until the impression stops working" },
      "when": { "trait": ["zozote"] },
      "effects": { "energie": -2, "eloquence": 2, "popularity": 2, "money": -6000 },
      "result": { "fr": "Six mois d'exercices, et son numéro commence à sonner faux sans qu'il comprenne pourquoi. Il en changera, et ce sera sur vos idées.",
                  "en": "Six months of exercises, and his routine starts to ring false without his understanding why. He will change it, and the new one will be about your ideas." } }
  ]
}
];
