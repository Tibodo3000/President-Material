/* Généré — ne pas éditer à la main. */
const EV_runoff = [

/* ==========================================================================
   L'ENTRE-DEUX-TOURS
   ==========================================================================
   Quinze jours à deux. L'effet "poll" ne déplace plus un champ de sept
   candidats mais un face-à-face qui fait cent pour cent : ce que l'un prend,
   l'autre le perd. Les amplitudes affichées sont donc plus grosses que ce
   qu'elles valent une fois passées dans le moteur, qui divise par deux.

   {rival} désigne le finaliste d'en face. Les scènes qui parlent d'un battu
   du premier tour portent "cast": "eliminated", et {rival} désigne alors le
   plus gros des éliminés, celui dont les voix décident.
   ========================================================================== */

{
  "id": "r_debat",
  "moment": 1,
  "required": true,
  "weight": 5,
  "tag": { "fr": "Le débat d'entre-deux-tours", "en": "The runoff debate" },
  "text": {
    "fr": "Le débat. Deux fauteuils, une table, deux heures trente sans montage et sans public. Personne, depuis que la Cinquième République existe, n'a jamais réussi à faire croire que cette soirée-là ne comptait pas.",
    "en": "The debate. Two chairs, one table, two and a half hours with no editing and no audience. Nobody, in the entire history of the Republic, has ever managed to pretend this evening did not matter."
  },
  "choices": [
    { "label": { "fr": "Attaquer son bilan, dossier par dossier", "en": "Attack the record, file by file" },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "popularity": 3, "energie": -2 },
        "result": { "fr": "Vous sortez quatre chiffres qu'{il} ne peut pas contester et {il} met vingt minutes à s'en remettre. Le lendemain, les éditorialistes comptent les points et vous les donnent.",
                    "en": "You produce four figures {he} cannot contest and {he} takes twenty minutes to recover. The next morning the commentators count the points and give them to you." } },
      "failure": { "effects": { "poll": -6, "popularity": -4, "credibilite": -1, "energie": -2 },
        "result": { "fr": "Vous êtes précis et illisible. Le pays regarde deux personnes se disputer des annexes budgétaires et retient qu'il n'aime ni l'une ni l'autre.",
                    "en": "You are precise and unreadable. The country watches two people argue over budget annexes and concludes it likes neither of them." } } },
    { "label": { "fr": "Tenir la hauteur et ne jamais l'interrompre", "en": "Hold the high ground and never interrupt" },
      "roll": { "base": 13, "stat": "sangfroid", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "credibilite": 3, "reputation": 2, "energie": -1 },
        "result": { "fr": "Deux heures trente sans hausser la voix une seule fois. À la fin, l'un des deux avait l'air d'être déjà en fonction, et ce n'était pas {lui}.",
                    "en": "Two and a half hours without raising your voice once. By the end, one of the two looked like they already held the office, and it was not {him}." } },
      "failure": { "effects": { "poll": -5, "popularity": -3, "energie": -1 },
        "result": { "fr": "La retenue passe pour de l'absence. On vous trouve mou, et la mollesse ne se rattrape pas en cinq jours.",
                    "en": "Restraint reads as absence. You come across as soft, and softness cannot be fixed in five days." } } },
    { "label": { "fr": "Chercher la phrase qui restera", "en": "Go looking for the line that lasts" },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "charisme": 0.4 }, "dice": 18 },
      "success": { "effects": { "poll": 9, "notoriete": 3, "popularity": 7, "energie": -2 },
        "result": { "fr": "Onze mots, à vingt-deux heures quarante. Ils seront dans les manuels et personne ne se souviendra du reste de la soirée.",
                    "en": "Eleven words, at twenty to eleven. They will be in the textbooks and nobody will remember the rest of the evening." } },
      "failure": { "effects": { "poll": -8, "popularity": -6, "reputation": -1, "energie": -2 },
        "result": { "fr": "La formule était préparée et cela s'entend. {Il} la reprend en souriant, et c'est cette reprise-là qu'on repassera en boucle.",
                    "en": "The line was prepared and it shows. {He} throws it back with a smile, and it is that reply which will play on a loop." } } },
    { "label": { "fr": "Lire vos fiches et ne prendre aucun risque", "en": "Read your notes and take no risks" },
      "effects": { "poll": 1, "credibilite": 1, "popularity": -3, "energie": 1 },
      "result": { "fr": "Vous ne perdez pas le débat. Vous ne le gagnez pas non plus, et il ne vous restait plus que celui-là.",
                  "en": "You do not lose the debate. You do not win it either, and it was the last one you had left." } },
    { "label": { "fr": "{Le} pousser à la faute sur ce que vous savez", "en": "Push {him} into a mistake on what you know" },
      "when": { "personality": ["calculating"] },
      "roll": { "base": 15, "stat": "reseau", "plus": { "sangfroid": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 8, "notoriete": 2, "reputation": -1, "energie": -2 },
        "result": { "fr": "Trois questions anodines, puis la quatrième. {Il} hésite une seconde de trop devant vingt millions de personnes qui ont toutes vu la même seconde.",
                    "en": "Three harmless questions, then the fourth. {He} hesitates one second too long in front of twenty million people who all saw the same second." } },
      "failure": { "effects": { "poll": -7, "reputation": -2, "popularity": -4 },
        "result": { "fr": "{Il} avait prévu la question et la réponse. C'est vous qui avez l'air de fouiller les poubelles, en direct, pendant quatre minutes.",
                    "en": "{He} had the question and the answer ready. It is you who looks like you are going through the bins, live, for four minutes." } } },
    { "label": { "fr": "Ne parler que du pays, et jamais de votre adversaire", "en": "Talk only about the country, never about your opponent" },
      "when": { "personality": ["principled"] },
      "effects": { "poll": 3, "credibilite": 2, "reputation": 3, "popularity": 2, "energie": -2 },
      "result": { "fr": "Deux heures trente sans prononcer son nom une seule fois. Ce n'est pas une tactique, ce qui est précisément ce qui la rend efficace.",
                  "en": "Two and a half hours without saying the name once. It is not a tactic, which is exactly what makes it work." } }
  ]
},

{
  "id": "r_ralliement",
  "cast": "eliminated",
  "moment": [3, 2],
  "weight": 3,
  "tag": { "fr": "Ralliement", "en": "Endorsement" },
  "text": {
    "fr": "Éliminé{e} dimanche, {rival} hésite encore à appeler à voter pour vous. Ses électeurs sont exactement ceux qui vous manquent, et {il} le sait aussi bien que vous.",
    "en": "Knocked out on Sunday, {rival} is still hesitating to endorse you. {His} voters are exactly the ones you are missing, and {he} knows it as well as you do."
  },
  "choices": [
    { "label": { "fr": "Promettre un grand ministère", "en": "Promise a top ministry" },
      "effects": { "poll": 4, "standing": -8, "reputation": -1 },
      "result": { "fr": "Le ralliement est annoncé le soir même. Le marchandage a fuité le lendemain.",
                  "en": "The endorsement is announced that evening. The deal leaked the next day." } },
    { "label": { "fr": "Ne rien promettre", "en": "Promise nothing" },
      "effects": { "poll": -2, "reputation": 2, "popularity": 3 },
      "result": { "fr": "Pas de soutien, mais pas de dette. Vous restez propre, et il vous manque toujours ces voix-là.",
                  "en": "No endorsement, but no debt. You stay clean, and you are still short of those votes." } },
    { "label": { "fr": "Reprendre trois de ses idées dans votre discours", "en": "Take three of {his} ideas into your speech" },
      "effects": { "poll": 3, "eloquence": 1, "reputation": -1, "standing": 2 },
      "result": { "fr": "{Il} n'appelle pas à voter pour vous, mais ses électeurs entendent leurs propres mots dans votre bouche, et une partie suffit.",
                  "en": "{He} does not endorse you, but {his} voters hear their own words coming out of your mouth, and a fraction of them is enough." } },
    { "label": { "fr": "Lui rappeler ce que vous savez sur {lui}", "en": "Remind {him} what you know" },
      "when": { "trait": ["casserole"] },
      "effects": { "poll": 5, "standing": 4, "reputation": -2, "reseau": -1 },
      "result": { "fr": "Le ralliement tombe le lendemain matin, avec un sourire qui ne trompe personne.",
                  "en": "The endorsement comes the next morning, with a smile that fools nobody." } }
  ]
},

{
  "id": "r_front",
  "weight": 3,
  "tag": { "fr": "Le front", "en": "The wall" },
  "text": {
    "fr": "Des gens qui vous combattent depuis toujours appellent à voter pour vous, en prenant bien soin de préciser que ce n'est pas un soutien. On vous demande, en direct, si vous les remerciez.",
    "en": "People who have fought you all their lives call for a vote for you, taking great care to specify that it is not an endorsement. You are asked, live, whether you thank them."
  },
  "choices": [
    { "label": { "fr": "Remercier, sobrement", "en": "Thank them, soberly" },
      "effects": { "poll": 3, "standing": -5, "reputation": 1 },
      "result": { "fr": "Deux phrases, pas une de plus. Votre base trouve que c'est déjà deux de trop et vous le dira pendant cinq ans.",
                  "en": "Two sentences, not one more. Your base thinks that is two too many and will say so for five years." } },
    { "label": { "fr": "Dire que vous ne devez rien à personne", "en": "Say you owe nobody anything" },
      "effects": { "poll": -4, "standing": 7, "popularity": 2, "credibilite": -1 },
      "result": { "fr": "La salle applaudit debout. Dehors, quelques centaines de milliers de gens qui allaient se déplacer pour vous décident de rester chez eux.",
                  "en": "The hall gives you a standing ovation. Outside, a few hundred thousand people who were going to turn out for you decide to stay home." } },
    { "label": { "fr": "Aller les chercher franchement, et le dire", "en": "Go after them openly, and say so" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "standing": -8 },
        "result": { "fr": "Vous dites tout haut que vous avez besoin de voix qui ne vous aiment pas, et que vous ne leur devrez que le respect. C'est la phrase la plus adulte de la campagne.",
                    "en": "You say out loud that you need votes from people who do not like you, and that you will owe them nothing but respect. It is the most grown-up sentence of the campaign." } },
      "failure": { "effects": { "poll": -5, "standing": -6, "reputation": -1 },
        "result": { "fr": "Cela s'entend comme un aveu de faiblesse et se lit comme une reddition. Les deux camps y trouvent leur compte, et pas vous.",
                    "en": "It sounds like an admission of weakness and reads as a surrender. Both camps get something out of it, and you do not." } } }
  ]
},

{
  "id": "r_matignon",
  "moment": 2,
  "weight": 3,
  "tag": { "fr": "Matignon", "en": "The prime minister" },
  "text": {
    "fr": "Votre entourage vous pousse à annoncer qui serait votre Premier ministre. Un nom rassure, un nom engage, et un nom prend la moitié de la lumière qui vous reste.",
    "en": "Your team is pushing you to name who would be your prime minister. A name reassures, a name commits, and a name takes half of what light you have left."
  },
  "choices": [
    { "label": { "fr": "Annoncer une figure de votre camp", "en": "Name a figure from your own side" },
      "effects": { "poll": 2, "standing": 6, "credibilite": 1, "popularity": 1 },
      "result": { "fr": "Le parti respire, l'appareil se met en ordre de bataille, et le pays apprend un nom qu'il connaissait déjà.",
                  "en": "The party breathes out, the machine falls into line, and the country learns a name it already knew." } },
    { "label": { "fr": "Annoncer quelqu'un de l'autre bord", "en": "Name somebody from the other side" },
      "roll": { "base": 15, "stat": "reseau", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "notoriete": 2, "standing": -7 },
        "result": { "fr": "Le nom tombe un mercredi soir et change la nature de la semaine. Une partie du pays se dit qu'après tout, ce ne sera peut-être pas si terrible.",
                    "en": "The name lands on a Wednesday evening and changes the nature of the week. Part of the country decides it might not be so terrible after all." } },
      "failure": { "effects": { "poll": -5, "standing": -9, "reputation": -1 },
        "result": { "fr": "L'intéressé dément dans l'heure. Vous avez perdu un jour, un allié possible et une partie de votre propre camp.",
                    "en": "The person denies it within the hour. You have lost a day, a possible ally, and part of your own side." } } },
    { "label": { "fr": "Ne rien annoncer du tout", "en": "Announce nothing at all" },
      "effects": { "poll": -1, "credibilite": 1, "standing": 2, "energie": 1 },
      "result": { "fr": "Vous répondez qu'on verra dimanche soir. C'est la seule réponse constitutionnellement exacte et la plus décevante des trois.",
                  "en": "You reply that we will see on Sunday evening. It is the only constitutionally accurate answer and the most disappointing of the three." } }
  ]
},

{
  "id": "r_dossier",
  "moment": [3, 2],
  "tag": { "fr": "L'affaire", "en": "The file" },
  "text": {
    "fr": "Quarante-huit heures après le premier tour, un dossier vous concernant refait surface, sorti par des gens qui n'avaient plus rien à perdre. Le calendrier n'a rien d'un hasard, et cela ne change rien à ce qu'il y a dedans.",
    "en": "Forty-eight hours after the first round, a file about you resurfaces, put out by people with nothing left to lose. The timing is no accident, and that changes nothing about what is in it."
  },
  "choices": [
    { "label": { "fr": "Répondre point par point, tout de suite", "en": "Answer point by point, immediately" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "credibilite": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "credibilite": 2, "reputation": 1, "energie": -2 },
        "result": { "fr": "Quarante minutes de conférence de presse et pas une question esquivée. L'affaire meurt le jeudi, ce qui est le mieux qu'on puisse en attendre.",
                    "en": "Forty minutes of press conference and not one question dodged. The story dies on Thursday, which is the best anyone could hope for." } },
      "failure": { "effects": { "poll": -6, "reputation": -2, "credibilite": -1, "energie": -2 },
        "result": { "fr": "Vous répondez à onze accusations et vous en confirmez deux sans le vouloir. Ce sont ces deux-là qu'on retiendra.",
                    "en": "You answer eleven accusations and accidentally confirm two of them. Those two are the ones that will be remembered." } } },
    { "label": { "fr": "Attaquer ceux qui l'ont sorti", "en": "Go after the people who put it out" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "popularity": 5, "reputation": -1 },
        "result": { "fr": "Vous déplacez le sujet du dossier vers ceux qui l'ont sorti, et le pays vous suit. Ce n'est pas de la vérité, c'est de la campagne.",
                    "en": "You move the story from the file to the people who leaked it, and the country follows. This is not truth, it is campaigning." } },
      "failure": { "effects": { "poll": -7, "popularity": -5, "credibilite": -2 },
        "result": { "fr": "S'en prendre au messager quand le message est sourcé ne marche jamais deux fois. Vous venez d'essayer une fois de trop.",
                    "en": "Attacking the messenger when the message is sourced never works twice. You have just tried once too often." } } },
    { "label": { "fr": "Ne rien dire et parler d'autre chose pendant dix jours", "en": "Say nothing and talk about something else for ten days" },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.25 } ] },
      "success": { "effects": { "poll": 1, "energie": -1 },
        "result": { "fr": "Vous ne prononcez pas une fois le mot. Au bout de six jours, les rédactions passent à autre chose parce qu'il n'y a rien à filmer.",
                    "en": "You never once say the word. After six days the newsrooms move on, because there is nothing to film." } },
      "failure": { "effects": { "poll": -5, "reputation": -1, "popularity": -3 },
        "result": { "fr": "Le silence tient quatre jours, puis on ne vous pose plus que cette question-là. Vous finissez par répondre, mal, un vendredi soir.",
                    "en": "The silence holds four days, then it is the only question you are asked. You end up answering, badly, on a Friday evening." } } }
  ]
},

{
  "id": "r_meeting_final",
  "moment": 2,
  "weight": 3,
  "tag": { "fr": "Le dernier meeting", "en": "The final rally" },
  "text": {
    "fr": "Le dernier meeting. Vingt mille places, une captation nationale, et la dernière fois que vous parlerez devant un public avant que le pays ne décide.",
    "en": "The final rally. Twenty thousand seats, a national broadcast, and the last time you will speak to a crowd before the country decides."
  },
  "choices": [
    { "label": { "fr": "Un discours tourné vers ceux qui n'ont pas voté pour vous", "en": "A speech aimed at the people who did not vote for you" },
      "effects": { "poll": 3, "credibilite": 2, "standing": -3, "energie": -2 },
      "result": { "fr": "Quarante minutes à parler à des gens qui ne sont pas dans la salle. Ceux qui y sont applaudissent moins fort, et ce sont les autres qui votent dimanche.",
                  "en": "Forty minutes addressing people who are not in the room. The ones who are clap less loudly, and it is the others who vote on Sunday." } },
    { "label": { "fr": "Un discours pour les vôtres, qui en ont besoin", "en": "A speech for your own, who need one" },
      "effects": { "poll": 0, "standing": 7, "popularity": 2, "energie": -2 },
      "result": { "fr": "La salle est debout pendant les onze dernières minutes. Ils tiendront jusqu'à dimanche et ils iront chercher leurs voisins, ce qui n'est pas rien.",
                  "en": "The hall is on its feet for the last eleven minutes. They will hold out until Sunday and go and fetch their neighbours, which is not nothing." } },
    { "label": { "fr": "Un discours court, et sortir sous les applaudissements", "en": "A short speech, and leave on the applause" },
      "roll": { "base": 13, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "popularity": 6, "notoriete": 1, "energie": -1 },
        "result": { "fr": "Dix-huit minutes, pas une de plus, et une sortie que les chaînes repassent en boucle parce qu'elle est courte et qu'elle est belle.",
                    "en": "Eighteen minutes, not one more, and an exit the channels replay on a loop because it is short and it is beautiful." } },
      "failure": { "effects": { "poll": -4, "popularity": -3, "standing": -3, "energie": -1 },
        "result": { "fr": "Vingt mille personnes ont fait deux heures de route pour dix-huit minutes. Elles le disent aux journalistes en sortant.",
                    "en": "Twenty thousand people drove two hours for eighteen minutes. They tell the reporters so on the way out." } } }
  ]
},

{
  "id": "r_terrain",
  "tag": { "fr": "Quinze jours", "en": "A fortnight" },
  "text": {
    "fr": "Quinze jours, et deux façons de les dépenser : les plateaux, où l'on parle à ceux qui écoutent déjà, ou les marchés d'un département que vous avez perdu de douze points dimanche.",
    "en": "A fortnight, and two ways to spend it: the studios, where you talk to people already listening, or the markets of a county you lost by twelve points on Sunday."
  },
  "choices": [
    { "label": { "fr": "Les plateaux, tous les jours", "en": "The studios, every day" },
      "effects": { "poll": 1, "notoriete": 2, "popularity": -1, "energie": -2 },
      "result": { "fr": "Vingt-deux interventions en douze jours. Vous saturez l'espace et vous ne convainquez à peu près personne de nouveau.",
                  "en": "Twenty-two appearances in twelve days. You saturate the space and convert almost nobody new." } },
    { "label": { "fr": "Le terrain, là où vous avez perdu", "en": "The ground, where you lost" },
      "effects": { "poll": 3, "popularity": 4, "credibilite": 1, "energie": -3 },
      "result": { "fr": "Onze marchés, quatre gares, et beaucoup de gens qui vous disent en face pourquoi ils ont voté ailleurs. Une partie viendra quand même dimanche.",
                  "en": "Eleven markets, four stations, and a lot of people telling you to your face why they voted elsewhere. Some of them will turn out on Sunday anyway." } },
    { "label": { "fr": "Ni l'un ni l'autre : préparer le débat", "en": "Neither: prepare for the debate" },
      "effects": { "poll": -1, "sangfroid": 1, "credibilite": 1, "energie": 2 },
      "result": { "fr": "Six jours enfermé avec quatre personnes et deux mille pages. Vous perdez du terrain cette semaine pour en gagner une soirée, ce qui est un pari raisonnable.",
                  "en": "Six days locked away with four people and two thousand pages. You lose ground this week to gain one evening, which is a reasonable bet." } }
  ]
},

{
  "id": "r_abstention",
  "tag": { "fr": "Ceux qui ne viendront pas", "en": "The ones who will not come" },
  "text": {
    "fr": "Les instituts annoncent une abstention record pour un second tour. Ce ne sont pas vos électeurs qui hésitent à se déplacer, ce sont ceux qui devraient vous rejoindre et n'en ont aucune envie.",
    "en": "The pollsters forecast record abstention for a runoff. It is not your own voters hesitating to turn out, it is the ones who ought to join you and cannot face it."
  },
  "choices": [
    { "label": { "fr": "Faire peur : dire ce qui arrive si vous perdez", "en": "Frighten them: say what happens if you lose" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "notoriete": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 5, "popularity": -2, "reputation": -1 },
        "result": { "fr": "Trois minutes très noires, très efficaces, reprises partout. Vous gagnez des voix que vous n'aurez jamais le droit de revendiquer.",
                    "en": "Three very dark, very effective minutes, replayed everywhere. You gain votes you will never have the right to claim as your own." } },
      "failure": { "effects": { "poll": -5, "popularity": -5, "credibilite": -2 },
        "result": { "fr": "On vous répond qu'on vous entend dire la même chose depuis vingt ans. C'est faux et cela marche, et ce sont les deux à la fois qui font mal.",
                    "en": "You are told you have been saying the same thing for twenty years. It is untrue and it works, and it is both at once that hurts." } } },
    { "label": { "fr": "Donner une raison de voter pour vous, pas contre {lui}", "en": "Give them a reason to vote for you, not against {him}" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "reputation": 2, "energie": -2 },
        "result": { "fr": "Vous passez dix jours à parler de ce que vous ferez plutôt que de ce qu'{il} ferait. C'est plus difficile, plus lent, et cela tient jusqu'au bout.",
                    "en": "You spend ten days talking about what you would do rather than what {he} would do. It is harder, slower, and it holds all the way." } },
      "failure": { "effects": { "poll": -3, "popularity": -3, "energie": -2 },
        "result": { "fr": "Le programme est bon et personne ne l'écoute. À ce stade, le pays ne veut plus qu'on lui explique, il veut qu'on lui parle.",
                    "en": "The manifesto is good and nobody is listening. At this stage the country no longer wants explaining to; it wants speaking to." } } },
    { "label": { "fr": "Mettre toute la machine sur le porte-à-porte", "en": "Put the whole machine on the doorsteps" },
      "effects": { "poll": 2, "standing": 4, "reseau": 1, "energie": -3 },
      "result": { "fr": "Quatre-vingt mille portes en dix jours. Ce n'est pas spectaculaire, cela ne passe à aucun journal, et c'est la seule chose ici qui se mesure.",
                  "en": "Eighty thousand doors in ten days. It is not spectacular, it leads no bulletin, and it is the only thing here that can actually be measured." } }
  ]
}

];
