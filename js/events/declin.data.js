/*
 * President Material — LE CORPS, EN TROIS TEMPS.
 * ============================================================================
 * Syntaxe JSON stricte. Schéma complet dans js/events/_assemble.data.js.
 *
 * Ces scènes ne se tirent jamais au hasard : leur poids est nul et c'est le
 * moteur qui les programme, quand le corps décide de parler (bodyWarning,
 * dans js/game.js). Le champ "decline" dit à quel temps chacune appartient.
 *
 * POURQUOI CE PAQUET EXISTE. Une carrière s'arrêtait net. Mesuré sur trois
 * cents parties : un retrait forcé sur cinq tombait sur le seul critère de
 * l'âge sans qu'aucune carte n'ait rien dit, une mort sur six frappait à
 * soixante-dix-huit ans quelqu'un que rien n'avait jamais fatigué, et les
 * deux seuls avertissements du jeu étaient des lignes de journal, dans un
 * panneau latéral, qui pouvaient précéder la fin de dix ans. Le retrait forcé
 * et la mort par la santé ne sont désormais possibles qu'après au moins une
 * de ces scènes, et leur probabilité monte avec le nombre de scènes déjà
 * jouées. Seul l'accident continue de ne prévenir personne.
 *
 * COMMENT ELLES SONT ÉCRITES. Chaque temps a trois scènes, une par registre —
 * l'âge, l'épuisement, la maladie — pour que la même carrière ne raconte pas
 * deux fois la même chose et que la scène corresponde à ce qui use vraiment
 * ce personnage-là. Chacune a une porte de sortie : lever le pied rend du
 * temps et coûte de la cote, forcer rapporte et abrège. Au troisième temps,
 * on peut partir soi-même, et c'est la seule façon de choisir sa fin.
 *
 * Une scène par temps n'a AUCUNE condition. C'est la garantie que le corps
 * trouve toujours quelque chose à dire : si aucune ne correspondait, le
 * moteur ne programmerait rien et les portes de sortie resteraient fermées
 * pour toujours.
 * ============================================================================
 */
const EV_declin = [


/* ==========================================================================
   PREMIER TEMPS — ON PEUT ENCORE APPELER ÇA DE LA FATIGUE
   ========================================================================== */

{
  "id": "declin_1_analyses",
  "frise": { "fr": "Santé · un bilan que le médecin relit deux fois", "en": "Health · a check-up the doctor reads twice" },
  "decline": 1,
  "weight": 0,
  "delay": [1, 2],
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Bilan de routine, celui qu'on repousse depuis quatre ans. Le médecin regarde deux lignes un peu trop longtemps, puis vous demande, sans lever les yeux, combien d'heures vous dormez.",
    "en": "A routine check-up, the one you have been putting off for four years. The doctor looks at two lines for a little too long, then asks, without looking up, how many hours you sleep."
  },
  "choices": [
    { "label": { "fr": "Faire les examens complémentaires", "en": "Have the follow-up tests" },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "minMoney": 40000 }, "value": 0.15 } ] },
      "success": { "effects": { "flags": { "carefulHealth": true }, "energie": 2, "sangfroid": 1, "standing": -3 },
        "result": { "fr": "Trois rendez-vous en six semaines, tous annulés une fois et tous rattrapés. On vous trouve quelque chose de parfaitement banal et parfaitement suivi, ce qui n'est pas la même chose que rien.",
                    "en": "Three appointments in six weeks, each cancelled once and each rescheduled. They find something perfectly ordinary and perfectly monitored, which is not the same thing as nothing." } },
      "failure": { "effects": { "flags": { "frailHealth": true }, "energie": -1, "popularity": -3, "standing": -4 },
        "result": { "fr": "Le mot que le spécialiste emploie n'est pas grave, c'est le mot qu'il emploie ensuite qui l'est. Vous sortez avec une ordonnance à vie et un rendez-vous tous les six mois.",
                    "en": "The word the specialist uses is not serious; the word he uses next is. You leave with a prescription for life and an appointment every six months." } } },
    { "label": { "fr": "Remettre à après l'échéance", "en": "Put it off until after the next contest" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "stat": { "energie": { "min": 10 } } }, "value": 0.2 } ] },
      "success": { "effects": { "energie": -1, "standing": 3, "reseau": 1 },
        "result": { "fr": "Vous repoussez de six mois et il ne se passe rien, ce qui est la pire chose qui puisse arriver : vous saurez désormais qu'on peut repousser.",
                    "en": "You put it off six months and nothing happens, which is the worst possible outcome: you now know that things can be put off." } },
      "failure": { "effects": { "energie": -3, "flags": { "frailHealth": true }, "sangfroid": -1 },
        "result": { "fr": "Vous y retournez quatre mois plus tard, un dimanche, aux urgences. Le médecin qui vous reçoit a votre bilan sous les yeux et ne fait aucun commentaire, ce qui en est un.",
                    "en": "You go back four months later, on a Sunday, to A&E. The doctor who sees you has your file in front of him and passes no comment, which is a comment." } } },
    { "label": { "fr": "Prendre un mois de vraies vacances", "en": "Take a real month off" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["principled"] }, "value": 0.15 },
                                                { "when": { "minStanding": 60 }, "value": 0.15 } ] },
      "success": { "effects": { "energie": 5, "flags": { "carefulHealth": true }, "standing": -8 },
        "result": { "fr": "Quatre semaines sans téléphone, ce qui ne s'était pas produit depuis dix-neuf ans. Vous revenez en forme et trois dossiers sont partis chez quelqu'un d'autre.",
                    "en": "Four weeks without a phone, which had not happened in nineteen years. You come back in good shape and three files have gone to somebody else." } },
      "failure": { "effects": { "energie": 2, "standing": -11, "popularity": -4, "reputation": -1 },
        "result": { "fr": "Un photographe vous trouve au bord d'une piscine le jour où le pays parle d'autre chose. La photo vaudra tous les discours qu'on fera sur votre disponibilité.",
                    "en": "A photographer finds you beside a pool on the day the country is talking about something else. The picture will outlast every speech ever made about your availability." } } }
  ]
},

{
  "id": "declin_1_escalier",
  "frise": { "fr": "Santé · deux étages qu'on ne monte plus d'une traite", "en": "Health · two flights, no longer in one go" },
  "decline": 1,
  "weight": 0,
  "delay": [1, 2],
  "when": { "minAge": 58 },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Deux étages que vous montez depuis onze ans. En haut, vous vous arrêtez devant la porte le temps de reprendre votre souffle, et votre directeur de cabinet, qui monte derrière vous, s'arrête aussi et fait semblant de lire son téléphone.",
    "en": "Two flights you have climbed for eleven years. At the top you stop outside the door long enough to get your breath back, and your chief of staff, coming up behind you, stops too and pretends to read his phone."
  },
  "choices": [
    { "label": { "fr": "Prendre l'ascenseur, désormais", "en": "Take the lift from now on" },
      "roll": { "chance": 0.75 },
      "success": { "effects": { "energie": 2, "sangfroid": 1, "standing": -2 },
        "result": { "fr": "Personne n'en parlera jamais et tout le monde l'aura remarqué. C'est ainsi que commencent les choses dont on parlera dans quatre ans.",
                    "en": "Nobody will ever mention it and everybody will have noticed. That is how the things people discuss four years later begin." } },
      "failure": { "effects": { "energie": 1, "popularity": -5, "standing": -4, "notoriete": 1 },
        "result": { "fr": "Un journaliste note dans un portrait que vous ne prenez plus l'escalier. Trois lignes sur mille cinq cents, et ce sont les trois que tout le monde retiendra.",
                    "en": "A reporter notes in a profile that you no longer take the stairs. Three lines out of fifteen hundred, and they are the three everybody will remember." } } },
    { "label": { "fr": "Vous y remettre le matin, sérieusement", "en": "Start training again, properly, in the mornings" },
      "roll": { "base": 15, "stat": "energie", "plus": { "sangfroid": 0.3 }, "dice": 16 },
      "success": { "effects": { "energie": 4, "flags": { "carefulHealth": true }, "standing": -2 },
        "result": { "fr": "Six heures du matin, quatre fois par semaine, pendant sept mois. Vous êtes en meilleure forme qu'à cinquante ans et vous êtes le seul à savoir ce que ça a coûté.",
                    "en": "Six in the morning, four times a week, for seven months. You are fitter than you were at fifty and you are the only one who knows what it cost." } },
      "failure": { "effects": { "energie": -2, "standing": -3, "reputation": -1 },
        "result": { "fr": "Trois semaines, puis une semaine de déplacements, puis plus rien. Les chaussures restent dans le coffre de la voiture jusqu'à la fin du mandat.",
                    "en": "Three weeks, then a week of travel, then nothing. The trainers stay in the boot of the car until the end of the term." } } },
    { "label": { "fr": "Continuer exactement comme avant", "en": "Carry on exactly as before" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "stat": { "energie": { "min": 10 } } }, "value": 0.25 },
                                                 { "when": { "trait": ["athletique"] }, "value": 0.2 } ] },
      "success": { "effects": { "standing": 5, "energie": -1, "sangfroid": 1 },
        "result": { "fr": "Vous remontez les deux étages tous les jours et vous ne vous arrêtez plus en haut. On ne saura jamais si c'est le corps qui a cédé ou vous qui avez décidé de ne pas voir.",
                    "en": "You climb the two flights every day and you stop stopping at the top. Nobody will ever know whether the body gave in or you decided not to look." } },
      "failure": { "effects": { "energie": -3, "flags": { "frailHealth": true }, "popularity": -3 },
        "result": { "fr": "Un matin, en haut, vous vous asseyez sur la dernière marche. Il y a quatre personnes dans le couloir et l'une d'elles appelle un médecin sans vous demander votre avis.",
                    "en": "One morning, at the top, you sit down on the last step. There are four people in the corridor and one of them calls a doctor without asking you." } } }
  ]
},

{
  "id": "declin_1_nuit",
  "frise": { "fr": "Santé · endormi à son bureau entre deux rendez-vous", "en": "Health · asleep at the desk between two meetings" },
  "decline": 1,
  "weight": 0,
  "delay": [1, 2],
  "when": { "stat": { "energie": { "max": 6 } } },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Vous vous endormez à votre bureau entre deux rendez-vous et vous vous réveillez avec la marque du dossier sur la joue. Votre assistante a décalé le rendez-vous suivant de quarante minutes sans rien demander à personne.",
    "en": "You fall asleep at your desk between two meetings and wake with the imprint of a folder on your cheek. Your assistant has pushed the next meeting back forty minutes without asking anybody."
  },
  "choices": [
    { "label": { "fr": "Alléger l'agenda vous-même, tout de suite", "en": "Thin out the diary yourself, straight away" },
      "roll": { "chance": 0.7, "chanceBonus": [ { "when": { "minStanding": 55 }, "value": 0.15 } ] },
      "success": { "effects": { "energie": 4, "flags": { "carefulHealth": true }, "standing": -6, "sangfroid": 1 },
        "result": { "fr": "Vous rendez onze déplacements et deux commissions. On vous remplace partout en une semaine, ce qui règle la question de savoir si vous étiez indispensable.",
                    "en": "You give up eleven trips and two committees. You are replaced everywhere within a week, which settles the question of whether you were indispensable." } },
      "failure": { "effects": { "energie": 2, "standing": -12, "popularity": -3 },
        "result": { "fr": "Le mot circule avant la fin de la semaine, dans la version où c'est la direction qui a allégé, et non vous. Il n'y a pas de version où c'est vous.",
                    "en": "The word goes round before the end of the week, in the version where the leadership did the thinning, not you. There is no version where it was you." } } },
    { "label": { "fr": "Tenir aux stimulants", "en": "Get through it on stimulants" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "trait": ["drogue"] }, "value": 0.2 },
                                                { "when": { "legal": 1 }, "value": 0.1 } ] },
      "success": { "effects": { "energie": 3, "standing": 5, "reputation": -1, "strike": "epuise" },
        "result": { "fr": "Six mois à tenir le rythme de vos trente ans avec l'aide d'un médecin très compréhensif. Le pays voit quelqu'un d'infatigable, et il n'a pas complètement tort.",
                    "en": "Six months keeping the pace of your thirties with the help of a very understanding doctor. The country sees somebody tireless, and it is not entirely wrong." } },
      "failure": { "effects": { "energie": -3, "flags": { "frailHealth": true }, "popularity": -6,
                                "trait": "epuise" },
        "result": { "fr": "Vous tenez onze semaines, puis vous ne tenez plus rien du tout. Le mot « surmenage » apparaît dans un communiqué de quatre lignes que vous n'avez pas relu.",
                    "en": "You hold out eleven weeks, then you hold out nothing at all. The word “exhaustion” appears in a four-line statement you did not proofread." } } },
    { "label": { "fr": "Ne rien changer et n'en parler à personne", "en": "Change nothing and tell nobody" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "personality": ["hardworking"] }, "value": 0.2 } ] },
      "success": { "effects": { "standing": 4, "energie": -2, "sangfroid": 1 },
        "result": { "fr": "Vous continuez et personne ne dit rien, votre assistante comprise, qui continue de décaler les rendez-vous de quarante minutes.",
                    "en": "You carry on and nobody says anything, your assistant included, who goes on pushing meetings back forty minutes." } },
      "failure": { "effects": { "energie": -4, "popularity": -5, "standing": -5, "strike": "epuise" },
        "result": { "fr": "Vous vous endormez une deuxième fois, en réunion cette fois, et il y a onze personnes autour de la table. Deux d'entre elles en parleront le soir même à quelqu'un qui écrit.",
                    "en": "You fall asleep a second time, in a meeting this time, and there are eleven people round the table. Two of them will mention it that evening to somebody who writes." } } }
  ]
},


/* ==========================================================================
   DEUXIÈME TEMPS — ON NE PEUT PLUS APPELER ÇA DE LA FATIGUE
   ========================================================================== */

{
  "id": "declin_2_hopital",
  "frise": { "fr": "Santé · une nuit à l'hôpital, par la porte de service", "en": "Health · a night in hospital, by the service door" },
  "decline": 2,
  "weight": 0,
  "delay": [1, 2],
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Une nuit à l'hôpital, entrée à vingt-trois heures par une porte de service, sortie à six heures par la même. Trois personnes le savent. Le service de presse a préparé deux communiqués : celui qui dit la vérité et celui qui parle de contrôle de routine.",
    "en": "One night in hospital, in at eleven by a service entrance, out at six by the same one. Three people know. The press office has drafted two statements: the one that tells the truth and the one that mentions a routine check."
  },
  "choices": [
    { "label": { "fr": "Publier celui qui dit la vérité", "en": "Publish the one that tells the truth" },
      "roll": { "base": 15, "stat": "reputation", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 9, "flags": { "carefulHealth": true, "frailHealth": true },
                                "standing": -7, "credibilite": 1, "reputation": 2 },
        "result": { "fr": "Vous nommez la chose, vous dites ce que vous allez faire, et vous ne répondez à aucune question ensuite. Le pays trouve cela digne. Votre camp compte les mois.",
                    "en": "You name the thing, you say what you intend to do, and you take no questions afterwards. The country finds it dignified. Your own side starts counting months." } },
      "failure": { "effects": { "popularity": -4, "standing": -13, "flags": { "frailHealth": true },
                                "notoriete": 2 },
        "result": { "fr": "Le communiqué sort à onze heures et à midi la question n'est plus votre santé, c'est votre succession. Vous passerez le reste de l'année à démentir un calendrier que vous avez ouvert vous-même.",
                    "en": "The statement goes out at eleven and by noon the question is no longer your health, it is your succession. You will spend the rest of the year denying a timetable you opened yourself." } } },
    { "label": { "fr": "Publier celui qui parle de contrôle de routine", "en": "Publish the routine-check one" },
      "roll": { "chance": 0.55, "chanceBonus": [ { "when": { "trait": ["teflon"] }, "value": 0.2 },
                                                 { "when": { "comms": 1 }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 6, "flags": { "frailHealth": true }, "reputation": -1,
                                "energie": -1 },
        "result": { "fr": "Quatre lignes, aucun nom de service, aucune durée. Personne ne vérifie et personne n'a envie de vérifier : la santé des puissants est le seul sujet où la presse préfère avoir tort.",
                    "en": "Four lines, no department named, no duration. Nobody checks and nobody wants to check: the health of the powerful is the one subject on which the press would rather be wrong." } },
      "failure": { "effects": { "popularity": -9, "standing": -9, "credibilite": -2,
                                "strike": "menteur", "flags": { "frailHealth": true } },
        "result": { "fr": "Un infirmier de nuit raconte l'entrée par la porte de service à sa belle-sœur, qui travaille dans une rédaction. On ne vous reprochera pas d'être malade, on vous reprochera les quatre lignes.",
                    "en": "A night nurse tells his sister-in-law about the service entrance, and she works in a newsroom. Nobody will hold the illness against you; they will hold the four lines against you." } } },
    { "label": { "fr": "Ne rien publier du tout", "en": "Publish nothing at all" },
      "roll": { "chance": 0.5, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 } ] },
      "success": { "effects": { "energie": 1, "sangfroid": 2, "standing": 2 },
        "result": { "fr": "Il n'y a pas de communiqué, donc il n'y a pas de sujet. Vous reprenez l'agenda le lundi comme si la nuit de jeudi n'avait pas eu lieu, ce qui est votre spécialité depuis trente ans.",
                    "en": "There is no statement, so there is no story. You pick the diary back up on Monday as if Thursday night had not happened, which has been your speciality for thirty years." } },
      "failure": { "effects": { "popularity": -6, "standing": -7, "flags": { "frailHealth": true },
                                "energie": -2 },
        "result": { "fr": "L'absence de communiqué devient le communiqué. Pendant trois semaines, chaque plateau commence par une question sur votre santé, et vous y répondez trois semaines de suite.",
                    "en": "The absence of a statement becomes the statement. For three weeks every programme opens with a question about your health, and for three weeks you answer it." } } }
  ]
},

{
  "id": "declin_2_mot",
  "frise": { "fr": "Santé · un nom qui ne revient pas, en direct", "en": "Health · a name that would not come, live on air" },
  "decline": 2,
  "weight": 0,
  "delay": [1, 2],
  "when": { "minAge": 63 },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "En direct, vous cherchez le nom d'un ministre que vous côtoyez depuis douze ans. Le silence dure trois secondes. Le journaliste enchaîne avec une élégance qui vous humilie plus que la question ne l'aurait fait.",
    "en": "Live on air, you reach for the name of a minister you have worked alongside for twelve years. The silence lasts three seconds. The interviewer moves on with a tact that humiliates you more than the question would have."
  },
  "choices": [
    { "label": { "fr": "En rire tout de suite, à l'antenne", "en": "Laugh it off immediately, on air" },
      "roll": { "base": 14, "stat": "charisme", "plus": { "eloquence": 0.4 }, "dice": 16 },
      "success": { "effects": { "popularity": 7, "standing": 3, "sangfroid": 1 },
        "result": { "fr": "Vous dites que vous oubliez son nom depuis douze ans et que ce n'est pas l'âge, c'est lui. La séquence tourne comme un bon moment de télévision, ce qu'elle est devenue.",
                    "en": "You say you have been forgetting his name for twelve years and that it is not your age, it is him. The clip travels as a good piece of television, which is what it has become." } },
      "failure": { "effects": { "popularity": -8, "standing": -6, "notoriete": 1, "credibilite": -2 },
        "result": { "fr": "Le rire arrive une seconde trop tard et il est seul. Le montage garde les trois secondes de silence, le rire, et rien d'autre.",
                    "en": "The laugh comes a second too late and it is alone. The edit keeps the three seconds of silence, the laugh, and nothing else." } } },
    { "label": { "fr": "Faire vérifier ce que ça veut dire", "en": "Have it looked at properly" },
      "roll": { "chance": 0.65, "chanceBonus": [ { "when": { "flag": { "carefulHealth": true } }, "value": 0.15 } ] },
      "success": { "effects": { "flags": { "carefulHealth": true }, "energie": 2, "sangfroid": 1,
                                "standing": -4 },
        "result": { "fr": "On vous fait passer quatre heures de tests dans un service où personne ne vous reconnaît. Ce n'est rien, on vous le dit, et vous ne le croirez plus jamais complètement.",
                    "en": "They put you through four hours of tests in a department where nobody recognises you. It is nothing, they tell you, and you will never quite believe it again." } },
      "failure": { "effects": { "flags": { "frailHealth": true }, "trait": "declin",
                                "standing": -6, "popularity": -3 },
        "result": { "fr": "Le neurologue emploie deux fois le mot « pour l'instant ». C'est un mot qu'on n'emploie pas quand il n'y a rien, et vous le savez en sortant du parking.",
                    "en": "The neurologist uses the phrase “for now” twice. It is not a phrase used when there is nothing, and you know it before you reach the car park." } } },
    { "label": { "fr": "Ne plus faire de direct", "en": "Stop doing live interviews" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "minStanding": 58 }, "value": 0.15 } ] },
      "success": { "effects": { "energie": 2, "standing": -5, "notoriete": -2, "popularity": -2 },
        "result": { "fr": "Vous ne faites plus que de l'enregistré, avec un montage et un droit de regard. C'est plus sûr, c'est moins vu, et cela dit exactement ce que vous vouliez taire.",
                    "en": "You do nothing but pre-records now, with an edit and a right of review. It is safer, it is less watched, and it says exactly what you were trying not to say." } },
      "failure": { "effects": { "popularity": -7, "standing": -8, "notoriete": -3 },
        "result": { "fr": "Trois refus de direct en quinze jours, et une rédaction en fait un papier. Le titre parle de disponibilité ; l'article parle d'autre chose du premier au dernier paragraphe.",
                    "en": "Three refusals of live slots in a fortnight, and one newsroom writes it up. The headline is about availability; the article is about something else from first paragraph to last." } } }
  ]
},

{
  "id": "declin_2_agenda",
  "frise": { "fr": "Santé · l'entourage divise l'agenda par deux", "en": "Health · the staff halve the diary" },
  "decline": 2,
  "weight": 0,
  "delay": [1, 2],
  "when": { "stat": { "energie": { "max": 7 } } },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Votre entourage a divisé votre agenda par deux sans vous en parler. Vous le découvrez un mardi en cherchant un déplacement qui n'y est plus, et la personne qui l'a annulé travaille pour vous depuis quatorze ans.",
    "en": "Your staff have halved your diary without mentioning it. You find out on a Tuesday looking for a trip that is no longer there, and the person who cancelled it has worked for you for fourteen years."
  },
  "choices": [
    { "label": { "fr": "Tout remettre, et le dire devant tout le monde", "en": "Put it all back, and say so in front of everyone" },
      "roll": { "base": 16, "stat": "energie", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "energie": -2, "standing": 8, "popularity": 3, "sangfroid": 1 },
        "result": { "fr": "Vous refaites l'agenda vous-même en une heure, devant l'équipe, et vous tenez les six semaines qui suivent. Plus personne ne touchera à un déplacement sans demander.",
                    "en": "You rebuild the diary yourself in an hour, in front of the team, and you get through the following six weeks. Nobody will touch a trip again without asking." } },
      "failure": { "effects": { "energie": -5, "standing": -6, "popularity": -4,
                                "flags": { "frailHealth": true } },
        "result": { "fr": "Vous tenez onze jours sur les quarante-deux. C'est la personne qui avait annulé qui vous ramène chez vous, et aucun des deux ne dit un mot pendant le trajet.",
                    "en": "You get through eleven days out of forty-two. It is the person who did the cancelling who drives you home, and neither of you says a word on the way." } } },
    { "label": { "fr": "Accepter, et le mettre au compte de la stratégie", "en": "Accept it, and call it strategy" },
      "roll": { "chance": 0.6, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 } ] },
      "success": { "effects": { "energie": 4, "flags": { "carefulHealth": true }, "standing": -3,
                                "credibilite": 1 },
        "result": { "fr": "Vous expliquez partout que vous choisissez désormais vos combats, ce qui est vrai, et que c'est une décision, ce qui l'est moins. Les deux passent très bien.",
                    "en": "You explain everywhere that you now pick your battles, which is true, and that it is a decision, which is less so. Both go down perfectly well." } },
      "failure": { "effects": { "energie": 3, "standing": -9, "popularity": -5, "notoriete": -2 },
        "result": { "fr": "On vous voit deux fois moins et l'on en tire la seule conclusion possible. « Il choisit ses combats » est une phrase qu'on dit de quelqu'un qui n'en a plus.",
                    "en": "You are seen half as often and people draw the only available conclusion. “He picks his battles” is a thing said about somebody who no longer has any." } } },
    { "label": { "fr": "Remercier celui qui a annulé", "en": "Sack the person who cancelled" },
      "when": { "personality": ["provocative", "calculating"] },
      "roll": { "chance": 0.35, "chanceBonus": [ { "when": { "minStanding": 62 }, "value": 0.25 } ] },
      "success": { "effects": { "standing": 5, "energie": -2, "reseau": -1, "reputation": -1 },
        "result": { "fr": "Il part dans la semaine, sans un mot, avec quatorze ans de choses qu'il ne dira jamais. Plus personne ne décidera à votre place, et plus personne ne vous protégera non plus.",
                    "en": "He leaves within the week, without a word, carrying fourteen years of things he will never say. Nobody will decide for you again, and nobody will protect you either." } },
      "failure": { "effects": { "standing": -14, "reseau": -2, "popularity": -6, "energie": -2 },
        "result": { "fr": "Il part et il parle, à trois personnes seulement, ce qui suffit largement. La phrase qu'on retient est celle où il dit qu'il annulait pour vous éviter de tomber en public.",
                    "en": "He leaves and he talks, to three people only, which is more than enough. The line that sticks is the one where he says he was cancelling to stop you collapsing in public." } } }
  ]
},


/* ==========================================================================
   TROISIÈME TEMPS — IL N'Y A PLUS DE DISCUSSION
   --------------------------------------------------------------------------
   Après celles-ci, les portes de sortie sont grandes ouvertes. C'est aussi le
   seul endroit du jeu où l'on peut décider soi-même de s'arrêter en sachant
   pourquoi : partir avant qu'on vous pousse est une fin, et c'en est une
   meilleure que la plupart.
   ========================================================================== */

{
  "id": "declin_3_verdict",
  "frise": { "fr": "Santé · le spécialiste cesse d'employer le conditionnel", "en": "Health · the specialist stops using the conditional" },
  "decline": 3,
  "weight": 0,
  "delay": [1, 2],
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Le spécialiste cesse d'employer le conditionnel. Il vous demande ce que vous comptez faire des dix-huit mois qui viennent, et il pose la question comme quelqu'un qui a déjà entendu toutes les réponses possibles.",
    "en": "The specialist stops using the conditional. He asks what you intend to do with the next eighteen months, and he asks it like a man who has already heard every possible answer."
  },
  "choices": [
    { "label": { "fr": "Annoncer votre retrait vous-même", "en": "Announce your own withdrawal" },
      "roll": { "base": 12, "stat": "reputation", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "end": "retire" },
        "result": { "fr": "Vous l'annoncez un jeudi, en quatre minutes, sans donner de raison médicale et sans que personne n'ose la demander. C'est la dernière fois de votre carrière que vous décidez du calendrier, et vous le savez en montant sur l'estrade.",
                    "en": "You announce it on a Thursday, in four minutes, giving no medical reason and with nobody daring to ask for one. It is the last time in your career that you set the timetable, and you know it as you step up." } },
      "failure": { "effects": { "end": "retire" },
        "result": { "fr": "Vous l'annoncez trop vite et mal, et l'après-midi même votre camp explique aux rédactions que c'était prévu depuis des mois. Vous partez quand même quand vous l'aviez décidé, ce qui est déjà plus que ce qu'obtiennent la plupart.",
                    "en": "You announce it too fast and badly, and by the afternoon your own side is telling newsrooms it had been planned for months. You still leave when you decided to, which is more than most people get." } } },
    { "label": { "fr": "Tenir jusqu'à la prochaine échéance", "en": "Hold on until the next contest" },
      "roll": { "base": 16, "stat": "sangfroid", "plus": { "energie": 0.35 }, "dice": 16 },
      "success": { "effects": { "energie": -2, "standing": 9, "popularity": 5, "credibilite": 2,
                                "flags": { "carefulHealth": true } },
        "result": { "fr": "Vous tenez, avec un protocole, un médecin dans l'avion et personne pour le savoir. Ce que vous ferez de ces mois-là comptera plus que les vingt années d'avant.",
                    "en": "You hold on, with a protocol, a doctor on the plane and nobody any the wiser. What you do with those months will count for more than the twenty years before them." } },
      "failure": { "effects": { "energie": -5, "flags": { "frailHealth": true }, "standing": -8,
                                "popularity": -4, "trait": "use" },
        "result": { "fr": "Vous tenez trois mois et le pays le voit sur votre visage à chaque plateau. On ne parlera plus jamais de ce que vous dites, on parlera de la façon dont vous le dites.",
                    "en": "You hold on for three months and the country reads it on your face at every appearance. Nobody will discuss what you say again; they will discuss the way you say it." } } },
    { "label": { "fr": "Ne rien dire à personne, même chez vous", "en": "Tell nobody, not even at home" },
      "roll": { "chance": 0.4, "chanceBonus": [ { "when": { "personality": ["calculating"] }, "value": 0.2 },
                                                { "when": { "stat": { "sangfroid": { "min": 12 } } }, "value": 0.15 } ] },
      "success": { "effects": { "standing": 6, "sangfroid": 2, "energie": -2, "reputation": -1 },
        "result": { "fr": "Personne ne sait, personne ne ménage rien, et vous travaillez comme avant. C'est la solution la plus solitaire des trois et c'est la seule qui vous laisse exactement la carrière que vous aviez.",
                    "en": "Nobody knows, nobody makes allowances, and you work as before. It is the loneliest of the three and the only one that leaves you exactly the career you had." } },
      "failure": { "effects": { "energie": -4, "popularity": -6, "standing": -10,
                                "flags": { "frailHealth": true } },
        "result": { "fr": "Cela se voit avant que cela se sache, ce qui est le pire ordre. Pendant six mois, tout le monde parle de vous à la troisième personne dans des couloirs où vous êtes encore.",
                    "en": "It shows before it is known, which is the worst order. For six months, everybody talks about you in the third person in corridors where you are still standing." } } }
  ]
},

{
  "id": "declin_3_succession",
  "frise": { "fr": "Santé · la succession s'organise sans vous", "en": "Health · the succession is organised without you" },
  "decline": 3,
  "weight": 0,
  "delay": [1, 2],
  "when": { "minStanding": 40 },
  "cast": "camp_senior",
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "{rival} organise votre succession sans vous, et {il} le fait mal : trois déjeuners en quinze jours avec les mêmes personnes, dans le même restaurant. On vous l'apprend en vous demandant ce que vous comptez faire, ce qui est une façon polie de vous dire que la question est ouverte.",
    "en": "{rival} is organising your succession without you, and doing it badly: three lunches in a fortnight with the same people, in the same restaurant. You are told about it and asked what you intend to do, which is a polite way of saying the question is now open."
  },
  "choices": [
    { "label": { "fr": "Désigner {le} vous-même et partir", "en": "Name {him} yourself and go" },
      "roll": { "base": 13, "stat": "reseau", "plus": { "standing": 0.04 }, "dice": 16 },
      "success": { "effects": { "end": "retire" },
        "result": { "fr": "Vous montez sur scène avec {lui} et vous dites que c'est vous qui avez choisi. C'est faux, tout le monde le sait, et à partir de cette phrase-là c'est vrai.",
                    "en": "You go on stage with {him} and say that you made the choice. It is untrue, everybody knows it, and from that sentence onwards it is true." } },
      "failure": { "effects": { "end": "retire" },
        "result": { "fr": "Vous {le} désignez et {il} vous remercie chaleureusement pendant quarante secondes avant de parler de renouvellement pendant onze minutes. Vous partez quand même de votre plein gré, sur le papier.",
                    "en": "You name {him} and {he} thanks you warmly for forty seconds before talking about renewal for eleven minutes. You still leave of your own accord, on paper." } } },
    { "label": { "fr": "Casser les trois déjeuners", "en": "Break up the three lunches" },
      "roll": { "base": 17, "stat": "reseau", "plus": { "sangfroid": 0.35, "standing": 0.05 }, "dice": 16 },
      "success": { "effects": { "standing": 11, "energie": -3, "reseau": 2, "credibilite": 1 },
        "result": { "fr": "Vous appelez les onze convives un par un en deux jours, et vous n'évoquez jamais le restaurant. Le quatrième déjeuner n'a pas lieu, et {rival} l'apprend en arrivant.",
                    "en": "You call all eleven guests one by one in two days, and you never mention the restaurant. The fourth lunch does not happen, and {rival} finds out on arrival." } },
      "failure": { "effects": { "standing": -13, "energie": -4, "popularity": -3,
                                "flags": { "frailHealth": true } },
        "result": { "fr": "Vous en retournez quatre sur onze, ce qui prouve exactement ce que les sept autres pensaient. Il faut la santé pour tenir une maison, et c'est précisément ce qui manque.",
                    "en": "You turn four of the eleven, which proves precisely what the other seven were thinking. Holding a house together takes health, and health is exactly what is missing." } } },
    { "label": { "fr": "Faire semblant de n'avoir rien entendu", "en": "Pretend you heard nothing" },
      "roll": { "chance": 0.45, "chanceBonus": [ { "when": { "minPopularity": 60 }, "value": 0.2 } ] },
      "success": { "effects": { "standing": 3, "energie": 1, "sangfroid": 1 },
        "result": { "fr": "Vous continuez comme si de rien n'était et les déjeuners s'espacent tout seuls. Une succession qu'on refuse de reconnaître met beaucoup plus longtemps à s'organiser.",
                    "en": "You carry on as if nothing had happened and the lunches space themselves out. A succession you refuse to acknowledge takes a great deal longer to organise." } },
      "failure": { "effects": { "standing": -9, "popularity": -4, "notoriete": -1, "energie": -2 },
        "result": { "fr": "Les déjeuners deviennent des réunions, puis un courant, puis une motion. À aucun moment on ne vous aura demandé votre avis, et à aucun moment vous ne l'aurez donné.",
                    "en": "The lunches become meetings, then a faction, then a motion. At no point were you asked, and at no point did you say anything." } } }
  ]
},

{
  "id": "declin_3_question",
  "frise": { "fr": "Santé · « êtes-vous en état d'exercer ? », en direct", "en": "Health · \"are you fit to serve?\", live on air" },
  "decline": 3,
  "weight": 0,
  "delay": [1, 2],
  "when": { "minPopularity": 40 },
  "tag": { "fr": "Le corps", "en": "The body" },
  "text": {
    "fr": "Une journaliste vous demande en direct si vous êtes en état d'exercer. La question n'est pas malveillante, elle est même posée avec précaution, et c'est bien ce qui la rend impossible : on ne la pose qu'à ceux dont la réponse ne va plus de soi.",
    "en": "A reporter asks you live whether you are fit to serve. The question is not hostile — it is asked with care, in fact — and that is what makes it impossible: it is only asked of people whose answer no longer goes without saying."
  },
  "choices": [
    { "label": { "fr": "Répondre oui, et détailler", "en": "Answer yes, and give the detail" },
      "roll": { "base": 16, "stat": "credibilite", "plus": { "energie": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 8, "standing": 6, "credibilite": 2, "energie": -2 },
        "result": { "fr": "Vous donnez votre semaine, heure par heure, sans note. Personne dans le studio n'aurait tenu ce rythme et tout le monde vient de le comprendre en même temps.",
                    "en": "You give your week, hour by hour, without notes. Nobody in that studio could have kept that pace and everybody has just understood it at the same moment." } },
      "failure": { "effects": { "popularity": -10, "standing": -8, "credibilite": -2,
                                "flags": { "frailHealth": true } },
        "result": { "fr": "Vous détaillez trop, et l'on retient une seule chose : que vous avez éprouvé le besoin de détailler. Le doute ne se dissipe jamais par la précision, il s'en nourrit.",
                    "en": "You give too much detail, and one thing sticks: that you felt the need to. Doubt is never dispelled by precision, it feeds on it." } } },
    { "label": { "fr": "Répondre que non, et annoncer la suite", "en": "Answer no, and announce what follows" },
      "roll": { "base": 12, "stat": "reputation", "plus": { "popularity": 0.05 }, "dice": 16 },
      "success": { "effects": { "end": "retire" },
        "result": { "fr": "Vous dites non, en direct, sans avoir prévenu personne, pas même chez vous. Le studio est silencieux pendant quatre secondes et c'est le moment le plus honnête de toute votre carrière.",
                    "en": "You say no, live, having warned nobody, not even at home. The studio is silent for four seconds and it is the most honest moment of your entire career." } },
      "failure": { "effects": { "end": "retire" },
        "result": { "fr": "Vous dites non et vous ajoutez trois phrases de trop sur ceux qui vous ont poussé. On ne retiendra pas votre départ, on retiendra les trois phrases.",
                    "en": "You say no and you add three sentences too many about the people who pushed you. Your departure will not be what is remembered; the three sentences will." } } },
    { "label": { "fr": "Retourner la question contre elle", "en": "Turn the question back on her" },
      "when": { "personality": ["provocative", "clever"] },
      "roll": { "base": 17, "stat": "eloquence", "plus": { "sangfroid": 0.35 }, "dice": 16 },
      "success": { "effects": { "popularity": 6, "notoriete": 2, "standing": 4, "reputation": -1 },
        "result": { "fr": "Vous lui demandez à partir de quel âge elle estime qu'un citoyen cesse d'être en état de servir, et vous attendez la réponse. Elle n'en a pas, et la séquence tourne quatre jours.",
                    "en": "You ask her at what age she considers a citizen ceases to be fit to serve, and you wait for the answer. She does not have one, and the clip runs for four days." } },
      "failure": { "effects": { "popularity": -9, "standing": -5, "reputation": -2, "notoriete": 1 },
        "result": { "fr": "L'agressivité répond à la question mieux que n'importe quel aveu. On ne se met pas en colère contre une question dont la réponse est évidemment oui.",
                    "en": "The aggression answers the question better than any admission could. Nobody loses their temper over a question whose answer is obviously yes." } } }
  ]
}

];
