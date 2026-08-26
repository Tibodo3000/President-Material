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
      "when": { "foeIncumbent": true },
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
    { "label": { "fr": "Lui demander ce qu'{il} ferait, précisément, le premier lundi", "en": "Ask {him} what {he} would do, precisely, on the first Monday" },
      "when": { "foeIncumbent": false },
      "roll": { "base": 14, "stat": "credibilite", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 7, "credibilite": 2, "popularity": 2, "energie": -2 },
        "result": { "fr": "Aucun des deux n'a de bilan, alors vous demandez un calendrier. {Il} répond par des principes pendant six minutes, et six minutes de principes à cette heure-là, cela s'entend.",
                    "en": "Neither of you has a record, so you ask for a timetable. {He} answers with principles for six minutes, and six minutes of principles at that hour is audible." } },
      "failure": { "effects": { "poll": -5, "credibilite": -1, "popularity": -3, "energie": -2 },
        "result": { "fr": "{Il} sort un calendrier, jour par jour, qu'{il} avait manifestement appris. La question devient la sienne et vous passez le reste de la soirée à répondre à la vôtre.",
                    "en": "{He} produces a timetable, day by day, which {he} had plainly learned by heart. The question becomes theirs and you spend the rest of the evening answering your own." } } },

    { "label": { "fr": "Le contre-interrogatoire : une question, une réponse, la suivante", "en": "Cross-examine: one question, one answer, the next" },
      "when": { "background": ["law"] },
      "roll": { "base": 15, "stat": "sangfroid", "plus": { "eloquence": 0.45, "credibilite": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 8, "credibilite": 3, "notoriete": 1, "energie": -2 },
        "result": { "fr": "Vingt ans de barre vous ont appris qu'on ne gagne pas en parlant, mais en faisant parler. {Il} se contredit à la troisième question et personne d'autre que vous ne l'avait vu venir.",
                    "en": "Twenty years in court taught you that you do not win by talking but by making the other talk. {He} contradicts himself on the third question and nobody but you saw it coming." } },
      "failure": { "effects": { "poll": -6, "popularity": -5, "reputation": -1, "energie": -2 },
        "result": { "fr": "Le pays n'est pas un jury et l'émission n'est pas une audience. On vous trouve procédurier, ce qui est le mot poli, et froid, qui est le vrai.",
                    "en": "The country is not a jury and this is not a hearing. They call you procedural, which is the polite word, and cold, which is the real one." } } },

    { "label": { "fr": "Compter ses interruptions à voix haute", "en": "Count his interruptions out loud" },
      "when": { "trait": ["femme"] },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "charisme": 0.4 }, "dice": 16 },
      "success": { "effects": { "poll": 8, "popularity": 7, "notoriete": 2, "reputation": 1, "energie": -1 },
        "result": { "fr": "« Dix-sept fois. » Vous le dites sans hausser la voix, à vingt-deux heures dix, et la moitié du pays refait le compte le lendemain matin. {Il} ne vous interrompra plus de la soirée.",
                    "en": "\"Seventeen times.\" You say it without raising your voice, at ten past ten, and half the country redoes the count the next morning. {He} will not interrupt you again all evening." } },
      "failure": { "effects": { "poll": -5, "popularity": -4, "energie": -1 },
        "result": { "fr": "Vous relevez, {il} s'excuse platement, et le sujet du lendemain devient la façon dont vous l'avez relevé. On appelle cela victimisation, et l'on n'en démord pas.",
                    "en": "You point it out, {he} apologises flatly, and the next day's story becomes the way you pointed it out. They call it playing the victim, and they will not let it go." } } },

    { "label": { "fr": "{Le} renvoyer à ce que son camp a écrit noir sur blanc", "en": "Send {him} back to what {his} own camp put in writing" },
      "when": { "foeFar": true },
      "roll": { "base": 15, "stat": "eloquence", "plus": { "credibilite": 0.4, "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "axis": "self", "poll": 9, "popularity": 5, "credibilite": 2, "landscape": { "scene": -1.5 }, "energie": -2 },
        "result": { "fr": "Vous lisez trois lignes de leur programme, sans commentaire, et vous laissez le silence faire le travail. {Il} explique que la phrase a été sortie de son contexte, ce qui est la seule chose qu'{il} pouvait dire.",
                    "en": "You read three lines of their programme, without comment, and let the silence do the work. {He} explains that the sentence was taken out of context, which is the only thing {he} could say." } },
      "failure": { "effects": { "poll": -6, "popularity": -4, "energie": -2 },
        "result": { "fr": "{Il} vous répond que ce texte a huit ans et que vous en êtes encore là. La soirée devient un procès en archéologie et le pays décroche.",
                    "en": "{He} replies that the text is eight years old and that you are still stuck on it. The evening turns into an exercise in archaeology and the country switches off." } } },

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
      "effects": { "axis": "self", "poll": -4, "standing": 7, "popularity": 5, "credibilite": -1 },
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
      "effects": { "poll": 0, "standing": 7, "appeal": { "self": 7 }, "energie": -2 },
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
},

/* ==========================================================================
   LA QUINZAINE COÛTE CE QU'ON PROMET POUR LA GAGNER
   ==========================================================================
   Huit scènes pour trois temps : deux entre-deux-tours dans une carrière
   suffisaient à faire le tour du paquet. Les quatre qui suivent l'élargissent
   et posent la question de la quinzaine — tout ce qu'on donne pour prendre
   les voix des éliminés se paie cinq semaines plus tard, aux législatives,
   avec l'argent du parti.
   ========================================================================== */

{
  "id": "r_gouvernement",
  "moment": [3, 2],
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "Tout le monde veut savoir qui sera votre Premier ministre. Le nommer maintenant rassure ou effraie, et ne le nommer pas laisse quatre personnes croire que ce sera elles, ce qui les fait travailler.",
    "en": "Everybody wants to know who your prime minister will be. Naming them now either reassures or frightens, and not naming them lets four people believe it will be them, which keeps them working."
  },
  "choices": [
    { "label": { "fr": "Annoncer un nom rassurant venu d'ailleurs", "en": "Announce a reassuring name from outside politics" },
      "roll": { "base": 15, "stat": "credibilite", "plus": { "reseau": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "credibilite": 2, "popularity": 5, "standing": -7 },
        "result": { "fr": "Un préfet de soixante-deux ans que personne n'a jamais entendu prononcer un mot de trop. Les marchés se calment, le pays respire, et votre parti apprend qu'il n'aura pas Matignon.",
                    "en": "A sixty-two-year-old senior official nobody has ever heard say a word too many. The markets settle, the country breathes, and your party learns it will not get the premiership." } },
      "failure": { "effects": { "poll": -5, "standing": -11, "reputation": -1,
                                "landscape": { "self": -0.6 } },
        "result": { "fr": "Le nom sort et deux courants annoncent dans la journée qu'ils ne voteront pas la confiance. On ne présente pas un gouvernement avant d'avoir gagné l'élection.",
                    "en": "The name comes out and two factions announce within the day that they will not vote confidence. You do not present a government before winning the election." } } },
    { "label": { "fr": "Promettre Matignon à votre parti", "en": "Promise the premiership to your own party" },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "minStanding": 60 }, "value": 0.15 } ] },
      "success": { "effects": { "poll": 3, "standing": 13, "reseau": 2, "landscape": { "self": 0.7 },
                                "popularity": -3 },
        "result": { "fr": "Vous dites que le Premier ministre viendra de la majorité et de nulle part ailleurs. La maison entière se met en marche en une nuit : il y a soudain quelque chose à gagner.",
                    "en": "You say the prime minister will come from the majority and nowhere else. The entire house starts moving overnight: there is suddenly something to win." } },
      "failure": { "effects": { "poll": -4, "standing": 4, "credibilite": -2, "popularity": -6 },
        "result": { "fr": "Les quatre candidats à Matignon se mettent à faire campagne l'un contre l'autre pendant que vous faites campagne contre quelqu'un d'autre.",
                    "en": "The four candidates for the premiership start campaigning against each other while you are campaigning against somebody else." } } },
    { "label": { "fr": "Ne rien annoncer du tout", "en": "Announce nothing at all" },
      "roll": { "base": 14, "stat": "sangfroid", "plus": { "eloquence": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 2, "sangfroid": 1, "standing": 3, "credibilite": 1 },
        "result": { "fr": "« On verra dimanche soir. » Vous le dites quatorze fois en quinze jours, avec le même sourire, et personne n'obtient rien. Quatre personnes continuent de travailler pour vous.",
                    "en": "“We shall see on Sunday evening.” You say it fourteen times in a fortnight, with the same smile, and nobody gets anything. Four people keep working for you." } },
      "failure": { "effects": { "poll": -5, "popularity": -6, "credibilite": -2 },
        "result": { "fr": "Le refus de répondre devient le sujet. À la neuvième fois, la question n'est plus qui sera Premier ministre, c'est ce que vous cachez.",
                    "en": "The refusal to answer becomes the story. By the ninth time, the question is no longer who the prime minister will be, it is what you are hiding." } } }
  ]
},

{
  "id": "r_circonscriptions",
  "cast": "eliminated",
  "moment": [3, 2],
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "{rival} ne demande pas de ministère : {il} demande soixante circonscriptions aux législatives, sans concurrent de votre camp. C'est le prix de l'appel à voter, et {il} le fait dire par quelqu'un d'autre.",
    "en": "{rival} is not asking for a ministry: {he} wants sixty constituencies at the legislatives, with no candidate from your camp against {him}. That is the price of {his} endorsement, and {he} has somebody else say it."
  },
  "choices": [
    { "label": { "fr": "Accepter les soixante", "en": "Accept all sixty" },
      "roll": { "chance": 0.7 },
      "success": { "effects": { "poll": 7, "standing": -9, "landscape": { "self": -1.0, "ally": 0.8 },
                                "alliance": "scene" },
        "result": { "fr": "L'appel à voter tombe le mardi et il est chaleureux, ce qui n'était pas prévu. Vous avez acheté dimanche avec soixante sièges que vous n'aurez pas en juin.",
                    "en": "The endorsement lands on the Tuesday and it is warm, which was not expected. You have bought Sunday with sixty seats you will not have in June." } },
      "failure": { "effects": { "poll": 2, "standing": -14, "reputation": -2,
                                "landscape": { "self": -1.2 }, "strike": "traitre" },
        "result": { "fr": "La liste des soixante fuite avant l'appel à voter, et soixante sortants de votre camp découvrent dans la presse qu'ils ne se représenteront pas.",
                    "en": "The list of sixty leaks before the endorsement, and sixty sitting members of your own camp learn from the press that they will not be standing again." } } },
    { "label": { "fr": "En offrir quinze et pas une de plus", "en": "Offer fifteen and not one more" },
      "roll": { "base": 16, "stat": "reseau", "plus": { "sangfroid": 0.35, "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "standing": 4, "reseau": 2, "landscape": { "self": -0.3 } },
        "result": { "fr": "Quinze circonscriptions, dont onze imprenables, et l'appel à voter quand même. {Il} savait qu'{il} n'obtiendrait pas soixante, {il} voulait savoir ce que vous valiez en négociation.",
                    "en": "Fifteen constituencies, eleven of them unwinnable, and the endorsement anyway. {He} knew {he} would not get sixty; {he} wanted to know how you negotiate." } },
      "failure": { "effects": { "poll": -6, "standing": -5, "energie": -2 },
        "result": { "fr": "{Il} appelle à voter « selon sa conscience », ce qui est la formule exacte qu'on emploie quand on veut que ses électeurs restent chez eux.",
                    "en": "{He} calls on {his} voters to “follow their conscience”, which is the exact phrase used when you want them to stay at home." } } },
    { "label": { "fr": "Refuser publiquement et raconter la demande", "en": "Refuse publicly, and describe the demand" },
      "roll": { "base": 16, "stat": "eloquence", "plus": { "reputation": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 5, "popularity": 9, "standing": 8, "credibilite": 2,
                                "landscape": { "self": 0.6 } },
        "result": { "fr": "Vous dites à l'antenne ce qu'on vous a demandé, avec le chiffre. Le pays entend soixante et comprend tout seul, et {rival} passe la fin de la quinzaine à s'expliquer.",
                    "en": "You say on air what you were asked for, with the number. The country hears sixty and works it out on its own, and {rival} spends the rest of the fortnight explaining {him}self." } },
      "failure": { "effects": { "poll": -8, "standing": -6, "reputation": -1,
                                "landscape": { "self": -0.5 } },
        "result": { "fr": "{Il} dément avoir jamais rien demandé, l'émissaire aussi, et il n'existe évidemment aucun écrit. Vous passez pour quelqu'un qui raconte des réunions.",
                    "en": "{He} denies having asked for anything, so does {his} emissary, and of course nothing was ever written down. You come across as somebody who tells tales about meetings." } } }
  ]
},

{
  "id": "r_soutien_encombrant",
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "Un ancien président de la République, condamné deux fois et toujours écouté par deux millions de personnes, appelle à voter pour vous dans une tribune de quatre mille signes que personne ne lui avait demandée.",
    "en": "A former president of the Republic, twice convicted and still listened to by two million people, endorses you in a four-thousand-word article nobody asked him for."
  },
  "choices": [
    { "label": { "fr": "Remercier chaleureusement", "en": "Thank him warmly" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "party": ["conservatives", "liberals", "identitarians"] }, "value": 0.2 },
                                                { "when": { "trait": ["teflon"] }, "value": 0.15 } ] },
      "success": { "effects": { "poll": 5, "standing": 4, "reputation": -1, "appeal": { "others": -1 } },
        "result": { "fr": "Vous le remerciez en trois phrases sans jamais prononcer le mot « condamné ». Deux millions d'électeurs se souviennent qu'ils ont un candidat, et personne d'autre ne relève.",
                    "en": "You thank him in three sentences without once saying the word “convicted”. Two million voters remember that they have a candidate, and nobody else picks it up." } },
      "failure": { "effects": { "poll": -6, "popularity": -8, "reputation": -2, "credibilite": -1 },
        "result": { "fr": "La photo d'archive ressort dans la minute, et c'est celle du tribunal. On ne vous demandera plus rien d'autre pendant trois jours.",
                    "en": "The archive photograph is up within the minute, and it is the one from the courthouse. Nothing else will be asked of you for three days." } } },
    { "label": { "fr": "Le refuser publiquement", "en": "Refuse the endorsement publicly" },
      "roll": { "base": 16, "stat": "reputation", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "poll": 3, "popularity": 10, "credibilite": 2, "reputation": 2,
                                "standing": -6 },
        "result": { "fr": "Vous dites que vous n'avez pas besoin de ce soutien-là, et vous le dites sans une once de plaisir. La phrase fait l'ouverture des trois journaux du soir.",
                    "en": "You say you do not need that particular endorsement, and you say it without a trace of pleasure. The line leads all three evening bulletins." } },
      "failure": { "effects": { "poll": -7, "standing": -10, "popularity": -3,
                                "appeal": { "self": -5 } },
        "result": { "fr": "Ses deux millions d'électeurs entendent « je ne veux pas de vous ». À quinze jours d'un second tour, on ne renvoie pas deux millions de personnes chez elles.",
                    "en": "His two million voters hear “I do not want you”. A fortnight before a runoff, you do not send two million people home." } } },
    { "label": { "fr": "Ne pas répondre et changer de sujet", "en": "Not respond, and change the subject" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 } ] },
      "success": { "effects": { "poll": 1, "sangfroid": 1, "energie": -1 },
        "result": { "fr": "Vous parlez de logement pendant quatre jours avec une constance qui force l'admiration. Le sujet meurt d'ennui, ce qui est la seule mort propre.",
                    "en": "You talk about housing for four days with admirable consistency. The story dies of boredom, which is the only clean death." } },
      "failure": { "effects": { "poll": -5, "popularity": -6, "credibilite": -2 },
        "result": { "fr": "On vous pose la question à chaque plateau, et à chaque plateau vous ne répondez pas. Au quatrième, le refus de répondre est devenu la réponse.",
                    "en": "You are asked at every broadcast, and at every broadcast you do not answer. By the fourth, the refusal to answer has become the answer." } } }
  ]
},

{
  "id": "r_manifestation",
  "when": { "foeFar": true },
  "tag": { "fr": "Entre les deux tours", "en": "Between the rounds" },
  "text": {
    "fr": "Deux cent mille personnes défilent contre votre adversaire dans quarante villes, sans vous avoir prévenu et en vous citant partout. En fin de cortège, à Paris, quelques dizaines de vitrines y passent.",
    "en": "Two hundred thousand people march against your opponent in forty cities, without warning you and quoting you everywhere. At the back of the Paris march, a few dozen shopfronts go in."
  },
  "choices": [
    { "label": { "fr": "Vous en réclamer sans réserve", "en": "Claim it without reservation" },
      "roll": { "base": 15, "stat": "charisme", "plus": { "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "poll": 6, "appeal": { "self": 8, "others": -2 }, "notoriete": 2,
                                "landscape": { "self": 0.7 } },
        "result": { "fr": "Vous parlez de deux cent mille personnes et jamais des vitrines. Le lendemain, les inscriptions en mairie explosent chez les moins de trente ans.",
                    "en": "You talk about two hundred thousand people and never about the shopfronts. The next day, voter registrations among the under-thirties go through the roof." } },
      "failure": { "effects": { "poll": -7, "popularity": -8, "credibilite": -2,
                                "appeal": { "others": -4 } },
        "result": { "fr": "Les vitrines tournent en boucle sur trois chaînes pendant que vous remerciez le cortège. Le montage se fait tout seul, et il est imparable.",
                    "en": "The shopfronts run on a loop on three channels while you thank the marchers. The edit assembles itself, and it is unanswerable." } } },
    { "label": { "fr": "Saluer le cortège et condamner les casseurs", "en": "Salute the march and condemn the rioters" },
      "roll": { "base": 14, "stat": "eloquence", "plus": { "credibilite": 0.35 }, "dice": 16 },
      "success": { "effects": { "poll": 4, "popularity": 6, "credibilite": 2, "standing": 2 },
        "result": { "fr": "Deux phrases, une pour chaque chose, et dans le bon ordre. C'est l'exercice le plus banal de la vie politique et presque personne ne le réussit.",
                    "en": "Two sentences, one for each, and in the right order. It is the most ordinary exercise in political life and almost nobody gets it right." } },
      "failure": { "effects": { "poll": -4, "appeal": { "self": -5 }, "popularity": -3 },
        "result": { "fr": "Vous condamnez d'abord et vous saluez ensuite, ce qui inverse tout. Le cortège retient l'ordre des phrases, et il a raison de le retenir.",
                    "en": "You condemn first and salute second, which reverses everything. The march remembers the order of the sentences, and it is right to remember it." } } },
    { "label": { "fr": "Ne rien dire : ce n'est pas votre manifestation", "en": "Say nothing: it is not your march" },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "personality": ["principled"] }, "value": 0.2 } ] },
      "success": { "effects": { "poll": 2, "credibilite": 1, "sangfroid": 1 },
        "result": { "fr": "Vous laissez deux cent mille personnes défiler sans essayer de vous mettre devant. Elles voteront quand même, et elles voteront moins mal.",
                    "en": "You let two hundred thousand people march without trying to get in front of them. They will vote anyway, and they will vote less grudgingly." } },
      "failure": { "effects": { "poll": -5, "appeal": { "self": -6 }, "standing": -4 },
        "result": { "fr": "Votre silence est lu comme une distance, y compris par ceux qui défilaient avec votre nom sur leurs pancartes. On ne se tait pas devant deux cent mille personnes.",
                    "en": "Your silence is read as distance, including by the people marching with your name on their placards. You do not stay quiet in front of two hundred thousand people." } } }
  ]
}

];
