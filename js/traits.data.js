/*
 * President Material — LES TRAITS.
 * ============================================================================
 *
 * Un trait est une marque durable laissée par un choix, par le hasard ou par
 * le corps. Contrairement aux statistiques, il ne se dose pas : on l'a ou on
 * ne l'a pas, et il pèse sur toute la suite de la partie.
 *
 * Comme les événements, ce fichier ne contient que des données, en syntaxe
 * JSON stricte, et porte l'extension .js pour que le jeu s'ouvre sans serveur.
 *
 * ----------------------------------------------------------------------------
 * LES CINQ FAMILLES
 * ----------------------------------------------------------------------------
 * Chaque trait appartient à une famille, qui dit d'où il vient et sur quoi il
 * agit. La fiche du personnage les affiche groupés dans cet ordre.
 *
 *   "caractere"   La personnalité choisie à la création. Elle n'est plus un
 *                 simple paquet de modificateurs invisible : c'est un trait,
 *                 il s'affiche sur la fiche avec les autres, et les événements
 *                 peuvent s'y adosser. Un seul par personnage, pour toujours.
 *   "physique"    Le corps. Ce que les gens voient avant de vous écouter.
 *                 Deux traits sont distribués à la naissance et ne se
 *                 choisissent pas ; les autres s'attrapent en cours de
 *                 carrière, parce qu'un métier finit toujours par se voir.
 *   "talent"      Ce que vous savez faire, et que les autres ne savent pas.
 *   "appareil"    Votre rapport à la machine du parti, dans les deux sens.
 *   "reputation"  Ce que le pays croit de vous, vrai ou faux.
 *   "affaires"    L'argent, et ce qu'il traîne derrière lui.
 *
 * ----------------------------------------------------------------------------
 * CE QU'UN TRAIT PEUT FAIRE
 * ----------------------------------------------------------------------------
 *   "family"        L'une des cinq ci-dessus. Obligatoire.
 *   "kind"          "asset" (atout) ou "mark" (marque). Donne la couleur.
 *   "core"          Trait de caractère, choisi à la création : ni tiré, ni
 *                   perdu, ni compté dans le tirage de départ.
 *   "birth"         Poids de tirage à la naissance. Absent = ne se tire jamais.
 *   "axis"          L'axe sur lequel ce tirage se joue. Le jeu tire UNE FOIS
 *                   PAR AXE, indépendamment : on peut très bien être beau et
 *                   zozoter, ou avoir une voix de radio et être lâche. Les
 *                   axes existants : "apparence", "elocution", "identite",
 *                   Chacun a sa part de chance de ne rien donner du tout,
 *                   réglée par BIRTH_NONE dans js/game.js. Le tempérament,
 *                   lui, ne se distribue PAS : il se révèle en jouant, à force
 *                   de choisir la fuite ou l'affrontement.
 *   "strikes"       Nombre de fois qu'il faut recommencer avant que le trait
 *                   soit acquis. C'est ce qui distingue un écart d'une
 *                   réputation : on ne devient pas menteur en se dédisant une
 *                   fois, on le devient en se dédisant trop souvent. Les
 *                   événements marquent le coup avec "strike" au lieu de
 *                   "trait", et le joueur voit venir la marque.
 *   "label"         Nom affiché sur la fiche.
 *   "desc"          Ce que le trait raconte, en une phrase, sans chiffres.
 *
 *   "stats"         LE CŒUR DU SYSTÈME. Modificateurs permanents appliqués aux
 *                   statistiques au moment où le trait est gagné, et repris
 *                   s'il est perdu : { "eloquence": 2 }. Ils se voient
 *                   immédiatement sur les jauges de la fiche et ne s'en vont
 *                   plus. Un trait sans "stats" serait un trait invisible.
 *
 *   "target"        Décale en plus la cible des deux jauges de carrière :
 *                     { "popularity": 4, "standing": -3 }
 *                   La cible est le niveau vers lequel la jauge glisse toute
 *                   seule ; un trait déplace donc le fond du dossier, pas
 *                   seulement l'humeur du moment.
 *   "partyTarget"   Comme "target", mais différent selon le parti du joueur.
 *                   C'est ce qui permet à un trait de ne pas valoir la même
 *                   chose partout : ce que l'appareil d'un camp trouve normal,
 *                   celui d'en face en fait un sujet. Le trait ne juge pas la
 *                   personne, il mesure ce que la vie politique lui fait.
 *   "energy"        Décale le plafond de forme physique.
 *   "rejection"     Part de l'électorat qui refuse de voter pour vous au
 *                   second tour, en plus ou en moins (0,08 = huit points).
 *                   C'est le seul levier du trait sur la présidentielle, et
 *                   il se raconte en une phrase : untel ne votera jamais pour
 *                   vous, untel n'y voit plus d'obstacle.
 *   "soften"        Amortit les mauvaises nouvelles de popularité (0 à 1).
 *   "income"        Revenu occulte par tour, en euros.
 *   "risk"          Risque par tour de déclencher un événement.
 *   "blocks"        Traits incompatibles : les prendre retire ceux-là.
 *   "requiresParty" Le trait n'existe que pour qui est, ou a été, dans l'un
 *                   de ces camps. Les autres ne l'attrapent jamais, et les
 *                   écarts qui y mènent ne sont même pas comptés.
 *
 * ----------------------------------------------------------------------------
 * RÈGLES D'ÉCRITURE
 * ----------------------------------------------------------------------------
 * 1. SOBRIÉTÉ. Un ou deux modificateurs par trait, jamais plus, et pas un
 *    seul qu'on ne sache justifier en une clause. Ne JAMAIS ajouter un malus
 *    « pour équilibrer » : une constitution de fer ne rend pas moins
 *    charismatique, une petite taille n'apporte rien à l'appareil du parti, et
 *    ces inventions-là se voient immédiatement. Un trait peut donc n'avoir que
 *    des effets positifs, ou que des négatifs.
 *
 *    L'équilibre ne se joue pas trait par trait mais AU TIRAGE : une main sur
 *    deux mêle un atout et une marque. Et la contrepartie d'une marque est
 *    souvent ailleurs que dans les chiffres : « Lâche » ne rapporte pas un
 *    point, il ouvre des portes de sortie que les autres ne voient jamais.
 *
 *    Ce qui rend un trait intéressant n'est pas la taille de ses nombres,
 *    c'est le contenu qu'il ouvre. Un trait pauvre en chiffres et riche en
 *    événements est un bon trait ; l'inverse n'existe pas.
 *
 * 2. UN TRAIT DIT CE QUE LE PERSONNAGE EST, PAS OÙ IL EN EST. « Orateur »,
 *    « corpulent », « parole en l'air » décrivent une personne : on peut les
 *    dire de quelqu'un sans rien savoir de sa carrière. « Dauphin d'un ancien »
 *    ou « chef d'école » décrivent une situation dans un réseau, et une
 *    situation se raconte par un événement et sa suite, jamais par une ligne
 *    permanente sur la fiche. Dans le doute : si le mot ne pourrait pas servir
 *    à décrire quelqu'un dans un portrait de presse, ce n'est pas un trait.
 *
 * 3. UN TRAIT DOIT OUVRIR ET FERMER DES PORTES. Un trait qui ne fait que
 *    déplacer des chiffres ne se sent pas. Chacun doit être exigé par des
 *    événements ("when": {"trait": [...]}), en interdire d'autres
 *    ("notTrait"), et surtout débloquer des choix que les autres personnages
 *    ne verront jamais.
 *
 * 4. LES SOURCES DOIVENT S'ÉQUILIBRER. Une marque donnée par quinze
 *    événements finit dans toutes les parties et cesse d'être une marque.
 *    Compter les sources avant d'en ajouter une.
 *
 * 5. TOUT CHIFFRE AFFICHÉ DOIT SE JUSTIFIER EN UNE PHRASE. Si l'on ne sait
 *    pas dire pourquoi un trait donne ce qu'il donne, c'est qu'il ne doit pas
 *    le donner. Pas de bonus décoratif, pas de mécanique interne exposée au
 *    joueur sous forme de nombre qu'il ne peut pas interpréter.
 *
 * 6. LE CORPS EST UN SUJET DE SATIRE, PAS DE MORALE. Ce que le jeu moque,
 *    c'est le traitement que la vie politique et la presse réservent aux
 *    corps, jamais les corps eux-mêmes.
 */
const TRAIT_DATA = {

  /* ==========================================================================
     CARACTÈRE — ce que le joueur a choisi à la création
     ==========================================================================
     Ces six traits reprennent exactement les modificateurs qui étaient
     autrefois cachés dans STAT_MODIFIERS : rien n'a changé dans les chiffres,
     mais le joueur voit enfin d'où ils viennent. Ils portent tous le champ
     "core" : ils ne se tirent pas, ne se perdent pas, et ne comptent pas dans
     le tirage de départ.
     ========================================================================== */

  "hardworking": {
    "family": "caractere", "kind": "asset", "core": true,
    "label": { "fr": "Acharné", "en": "Hardworking" },
    "desc": {
      "fr": "Vous commencez vos journées avant tout le monde et vous les finissez après. Le travail vous tient lieu de méthode.",
      "en": "You start your days before everyone else and finish them long after. Work serves as your method."
    },
    "stats": { "energie": 6, "sangfroid": 2, "charisme": -2 }
  },

  "charming": {
    "family": "caractere", "kind": "asset", "core": true,
    "label": { "fr": "Charmeur", "en": "Charming" },
    "desc": {
      "fr": "Vous mettez les gens à l'aise en quelques minutes. Vos adversaires y voient une technique, vos proches une qualité.",
      "en": "You put people at ease within minutes. Your opponents call it a technique, those close to you call it a quality."
    },
    "stats": { "charisme": 6, "reseau": 2, "reputation": -2 }
  },

  "clever": {
    "family": "caractere", "kind": "asset", "core": true,
    "label": { "fr": "Brillant", "en": "Clever" },
    "desc": {
      "fr": "Vous comprenez vite et vous formulez mieux encore. Les dossiers les plus techniques ne vous effraient pas.",
      "en": "You understand quickly and you put it better still. The most technical files do not frighten you."
    },
    "stats": { "eloquence": 6, "sangfroid": 2, "charisme": -2 }
  },

  "provocative": {
    "family": "caractere", "kind": "asset", "core": true,
    "label": { "fr": "Provocateur", "en": "Provocative" },
    "desc": {
      "fr": "Vous dites ce que les autres évitent de dire. Les caméras vous suivent et les états majors s'en inquiètent.",
      "en": "You say what others avoid saying. The cameras follow you and the party leadership worries."
    },
    "stats": { "notoriete": 8, "charisme": 2, "reputation": -4 }
  },

  "principled": {
    "family": "caractere", "kind": "asset", "core": true,
    "label": { "fr": "Intègre", "en": "Principled" },
    "desc": {
      "fr": "Vous refusez les arrangements qui font gagner du temps. Cette réputation vous précède, pour le meilleur et pour le pire.",
      "en": "You refuse the arrangements that save time. That reputation precedes you, for better and for worse."
    },
    "stats": { "reputation": 6, "sangfroid": 2, "reseau": -2 }
  },

  "calculating": {
    "family": "caractere", "kind": "asset", "core": true,
    "label": { "fr": "Calculateur", "en": "Calculating" },
    "desc": {
      "fr": "Vous pensez toujours au coup d'après. Peu de gens savent ce que vous préparez, y compris dans votre camp.",
      "en": "You are always thinking one move ahead. Few people know what you are preparing, including on your own side."
    },
    "stats": { "sangfroid": 4, "reseau": 6, "reputation": -4 }
  },

  /* ==========================================================================
     PHYSIQUE — ce qu'on voit avant de vous écouter
     ==========================================================================
     Les deux premiers sont distribués à la naissance du personnage, sans que
     le joueur les choisisse : c'est la main qu'on reçoit. Ils se compensent,
     chacun à sa façon. Les suivants s'attrapent en cours de carrière.
     ========================================================================== */

  "beau": {
    "family": "physique",
    "kind": "asset",
    "birth": 5,
    "axis": "apparence",
    "label": { "fr": "Physique avantageux", "en": "Good-looking" },
    "desc": {
      "fr": "Les caméras vous aiment et les salles se retournent. Reste à convaincre qu'il y a autre chose.",
      "en": "The cameras like you and rooms turn around. Convincing people there is something else takes longer."
    },
    "stats": { "charisme": 3, "reputation": -1 },
    "blocks": ["ingrat"]
  },

  "ingrat": {
    "family": "physique",
    "kind": "mark",
    "birth": 5,
    "axis": "apparence",
    "label": { "fr": "Physique ingrat", "en": "Plain-faced" },
    "desc": {
      "fr": "La télévision ne vous fait aucun cadeau. En revanche, personne ne vous soupçonne de vendre quoi que ce soit.",
      "en": "Television gives you nothing. On the other hand, nobody suspects you of selling anything."
    },
    "stats": { "charisme": -3, "reputation": 2 },
    "blocks": ["beau"]
  },

  "voix": {
    "family": "physique",
    "kind": "asset",
    "birth": 4,
    "axis": "elocution",
    "label": { "fr": "Voix de radio", "en": "A voice for radio" },
    "desc": {
      "fr": "Un grain que les micros adorent. On vous écoute jusqu'au bout de vos phrases, même quand elles ne mènent nulle part.",
      "en": "A grain the microphones love. People listen to the end of your sentences, even the ones going nowhere."
    },
    "stats": { "eloquence": 2 }
  },

  "zozote": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "elocution",
    "label": { "fr": "Cheveux sur la langue", "en": "A lisp" },
    "desc": {
      "fr": "Un défaut d'élocution que les imitateurs ont repéré avant vous. On retient la façon dont vous le dites plutôt que ce que vous dites, mais personne ne vous soupçonnera jamais d'être un communicant.",
      "en": "A speech impediment the impressionists spotted before you did. People remember how you say it, never what you said."
    },
    "stats": { "eloquence": -2 }
  },

  /*
   * Ce trait n'est pas tiré : il est porté par toutes les joueuses, et par
   * elles seules. Il ne touche ni les statistiques ni les jauges, parce que
   * le jeu ne dit pas qu'une femme est un moins bon candidat. Il ne touche
   * que le second tour de la présidentielle, parce que c'est là que se lit
   * ce que le jeu raconte : une part de l'électorat ne franchira pas le pas,
   * et elle suffit à rendre la dernière marche plus haute.
   *
   * Cinq points, soit un peu moins que ce que coûte une réputation de
   * traître. C'est le seul chiffre du jeu qui ne se gagne ni ne se perd.
   */
  "femme": {
    "family": "physique",
    "kind": "mark",
    "core": true,
    "label": { "fr": "Femme", "en": "Woman" },
    "desc": {
      "fr": "Tous les commentateurs jurent que cela ne compte plus. Ils le jurent à chaque élection, et ils le jurent surtout le dimanche du second tour.",
      "en": "Every commentator swears it no longer counts. They swear it at every election, and above all on the evening of the runoff."
    },
    "rejection": 0.05
  },

  "homosexuel": {
    "family": "physique",
    "kind": "asset",
    "birth": 1,
    "axis": "identite",
    "label": { "fr": "Homosexuel", "en": "Gay" },
    "desc": {
      "fr": "Une part de votre vie que la vie politique traite tour à tour comme un détail, un argument et un problème, selon qui parle et selon l'année.",
      "en": "A part of your life that politics treats in turn as a detail, an argument and a problem, depending who is talking and what year it is."
    },
    "stats": { "sangfroid": 1 },
    "partyTarget": {
      "radical_left": { "standing": 4 },
      "socdem": { "standing": 2 },
      "centrists": {},
      "liberals": {},
      "conservatives": { "standing": -6, "popularity": -2 },
      "identitarians": { "standing": -12, "popularity": -5 }
    }
  },

  "intrepide": {
    "family": "physique",
    "kind": "asset",
    "strikes": 3,
    "label": { "fr": "Intrépide", "en": "Fearless" },
    "desc": {
      "fr": "Le conflit ne vous coûte rien, il vous réveille. Vos équipes vous suivent en serrant les dents et votre direction vous regarde partir au front avec inquiétude.",
      "en": "Conflict costs you nothing, it wakes you up. Your staff follow with their teeth clenched and your leadership watches you charge with some concern."
    },
    "stats": { "sangfroid": 3 }
  },

  "lache": {
    "family": "physique",
    "kind": "mark",
    "strikes": 3,
    "label": { "fr": "Lâche", "en": "Coward" },
    "desc": {
      "fr": "Devant un conflit, quelque chose en vous cherche la sortie. Vous avez fait une carrière entière sans jamais vous exposer, ce qui est une forme de longévité.",
      "en": "Faced with a fight, something in you looks for the exit. You have built a whole career without ever sticking your neck out, which is its own kind of longevity."
    },
    "stats": { "sangfroid": -3, "reputation": -1 }
  },

  "stature": {
    "family": "physique",
    "kind": "asset",
    "birth": 4,
    "axis": "stature",
    "label": { "fr": "Grande taille", "en": "Tall" },
    "desc": {
      "fr": "On vous voit arriver de loin et l'on vous cède le micro sans savoir pourquoi. Aucune étude sérieuse n'explique cet avantage, toutes le constatent, et vos collègues de réunion vous trouvent un peu écrasant.",
      "en": "People see you coming and hand you the microphone without knowing why. No serious study explains the advantage; every study finds it."
    },
    "stats": { "charisme": 1, "notoriete": 1 },
    "blocks": ["petite_taille"]
  },

  "petite_taille": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "stature",
    "label": { "fr": "Petite taille", "en": "Short" },
    "desc": {
      "fr": "Les photos officielles se prennent avec vous au premier rang, et les caricaturistes ont trouvé leur angle. En revanche, on vous sous-estime en réunion, ce qui a toujours été une bonne nouvelle.",
      "en": "Official photographs put you in the front row, and the cartoonists have found their angle. On the other hand, people underestimate you in meetings, which has always been good news."
    },
    "stats": { "charisme": -1, "notoriete": -1 },
    "blocks": ["stature"]
  },

  "robuste": {
    "family": "physique",
    "kind": "asset",
    "birth": 4,
    "axis": "sante",
    "label": { "fr": "Constitution de fer", "en": "Iron constitution" },
    "desc": {
      "fr": "Vous n'êtes jamais malade et vous ne comprenez pas ceux qui le sont. Trois campagnes d'affilée ne vous ont jamais couché.",
      "en": "You are never ill and you do not understand people who are. Three campaigns back to back have never put you in bed."
    },
    "stats": { "energie": 2 },
    "energy": 2,
    "blocks": ["fragile"]
  },

  "fragile": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "sante",
    "label": { "fr": "Santé fragile", "en": "Frail health" },
    "desc": {
      "fr": "Quelque chose lâche toujours au mauvais moment. Vous avez appris à doser vos forces bien avant les autres, ce qui vous rend étrangement lucide sur les vôtres.",
      "en": "Something always gives way at the wrong moment. You learned to ration your strength long before the others did, which makes you oddly clear-sighted about your own."
    },
    "stats": { "energie": -2 },
    "energy": -1,
    "risk": { "p": 0.02, "chain": "alerte_sante" },
    "blocks": ["robuste"]
  },

  "memoire_des_noms": {
    "family": "physique",
    "kind": "asset",
    "birth": 4,
    "axis": "memoire",
    "label": { "fr": "Mémoire des noms", "en": "A memory for names" },
    "desc": {
      "fr": "Vous retenez un prénom, un métier et le nom d'un chien après une seule poignée de main. C'est le seul talent de ce métier qui ne s'apprend pas.",
      "en": "You remember a first name, a job and a dog's name after a single handshake. It is the one talent in this trade that cannot be learned."
    },
    "stats": { "reseau": 2 },
    "blocks": ["tete_en_lair"]
  },

  "tete_en_lair": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "memoire",
    "label": { "fr": "Tête en l'air", "en": "Absent-minded" },
    "desc": {
      "fr": "Vous confondez les prénoms, les villes et parfois les dossiers. Vos bourdes font le tour des rédactions et, curieusement, elles vous rendent humain.",
      "en": "You mix up names, towns and occasionally files. Your slips go round the newsrooms and, oddly, they make you human."
    },
    "stats": { "reseau": -2 },
    "blocks": ["memoire_des_noms"]
  },

  "accent": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "origine_geo",
    "label": { "fr": "Accent régional", "en": "A regional accent" },
    "desc": {
      "fr": "Chez vous, c'est une carte d'identité et personne ne l'entend. À la télévision nationale, c'est la première chose qu'on retient de vous, et pas toujours en bien.",
      "en": "At home it is an identity card and nobody hears it. On national television it is the first thing people take away from you, and not always kindly."
    },
    "stats": { "eloquence": -1, "charisme": 1 }
  },

  "athletique": {
    "family": "physique",
    "kind": "asset",
    "label": { "fr": "Sportif", "en": "Athletic" },
    "desc": {
      "fr": "Vous courez le matin et vous le faites savoir. Les journées de quinze heures vous coûtent moins qu'aux autres.",
      "en": "You run in the morning and you make sure people know. Fifteen-hour days cost you less than they cost the others."
    },
    "stats": { "energie": 2 },
    "energy": 1,
    "blocks": ["obese"]
  },

  "obese": {
    "family": "physique",
    "kind": "mark",
    "label": { "fr": "Corpulent", "en": "Heavyset" },
    "desc": {
      "fr": "Les buffets de campagne et les nuits de négociation ont laissé des traces. Les dessinateurs de presse ne parlent plus que de ça.",
      "en": "Campaign buffets and nights of negotiation have left their mark. Cartoonists have stopped drawing anything else."
    },
    "stats": { "energie": -2, "sangfroid": 1 },
    "energy": -1,
    "risk": { "p": 0.02, "chain": "alerte_sante" },
    "blocks": ["athletique"]
  },

  "lifting": {
    "family": "physique",
    "kind": "mark",
    "label": { "fr": "Retouché", "en": "Had work done" },
    "desc": {
      "fr": "Quelque chose a changé sur votre visage entre deux campagnes, et tout le monde l'a remarqué sans oser le dire.",
      "en": "Something changed in your face between two campaigns, and everyone noticed without quite daring to say so."
    },
    "stats": { "charisme": 2, "reputation": -2 }
  },

  "use": {
    "family": "physique",
    "kind": "mark",
    "label": { "fr": "Usé", "en": "Worn down" },
    "desc": {
      "fr": "Les nuits blanches ne se rattrapent plus. Votre corps tient les comptes.",
      "en": "The sleepless nights no longer wash out. Your body keeps the ledger."
    },
    "stats": { "energie": -3 },
    "energy": -2
  },

  /* ==========================================================================
     TALENT — ce que vous savez faire
     ========================================================================== */

  "orateur": {
    "family": "talent",
    "kind": "asset",
    "label": { "fr": "Orateur", "en": "Orator" },
    "desc": {
      "fr": "Vous tenez une salle. Les mots vous viennent quand les autres cherchent les leurs.",
      "en": "You can hold a room. The words come to you while others are still looking for theirs."
    },
    "stats": { "eloquence": 3 }
  },

  "bete_scene": {
    "family": "talent",
    "kind": "asset",
    "label": { "fr": "Bête de plateau", "en": "Made for television" },
    "desc": {
      "fr": "Le pays vous adore à l'écran, l'appareil vous trouve encombrant.",
      "en": "The country loves you on screen; the party finds you cumbersome."
    },
    "stats": { "notoriete": 3, "reputation": -2 },
    "target": { "popularity": 2, "standing": -6 }
  },

  "reseauteur": {
    "family": "talent",
    "kind": "asset",
    "label": { "fr": "Carnet d'adresses", "en": "Well connected" },
    "desc": {
      "fr": "Vous décrochez votre téléphone et quelqu'un décroche en face.",
      "en": "You pick up the phone and someone always picks up on the other end."
    },
    "stats": { "reseau": 3 }
  },

  "bosseur": {
    "family": "talent",
    "kind": "asset",
    "label": { "fr": "Bourreau de travail", "en": "Workhorse" },
    "desc": {
      "fr": "Vous tenez des rythmes qui usent vos équipes avant vous.",
      "en": "You keep hours that wear out your staff long before they wear out you."
    },
    "stats": { "energie": 3 },
    "energy": 2
  },

  /* ==========================================================================
     APPAREIL — votre rapport à la machine
     ========================================================================== */

  "appareil": {
    "strikes": 2,
    "family": "appareil",
    "kind": "asset",
    "label": { "fr": "Homme d'appareil", "en": "Party operator" },
    "desc": {
      "fr": "Vous connaissez les statuts par cœur et les fédérations une par une.",
      "en": "You know the party rulebook by heart and the local branches one by one."
    },
    "stats": { "reseau": 2, "notoriete": -2 },
    "target": { "standing": 5, "popularity": -3 }
  },



  "traitre": {
    "family": "appareil",
    "kind": "mark",
    "label": { "fr": "Réputation de traître", "en": "Marked as a traitor" },
    "desc": {
      "fr": "L'appareil n'oublie jamais un coup de couteau. Vous avez obtenu ce que vous vouliez ce jour-là, et vous le payez depuis.",
      "en": "The machine never forgets a knife in the back. You got what you wanted that day, and you have been paying for it since."
    },
    "stats": { "reputation": -3, "sangfroid": 3 },
    "target": { "standing": -10 },
    "rejection": 0.06
  },

  "renegat": {
    "family": "appareil",
    "kind": "mark",
    "label": { "fr": "Renégat", "en": "Renegade" },
    "desc": {
      "fr": "Vous avez quitté votre camp. Les deux rives vous regardent depuis l'autre bord.",
      "en": "You left your own side. Both banks now watch you from across the water."
    },
    "stats": { "sangfroid": 2, "reseau": -2 },
    "target": { "standing": -6 },
    "rejection": -0.06
  },

  /* ==========================================================================
     RÉPUTATION — ce que le pays croit de vous
     ========================================================================== */

  /*
   * CE QU'ON A ÉTÉ RESTE. Deux marques qui ne s'attrapent qu'en quittant une
   * fonction, et qui ne se perdent jamais : on est ancien ministre pour la
   * vie, et les plateaux vous présentent ainsi vingt ans plus tard. Elles ne
   * donnent aucune popularité — le pays ne vous aime pas davantage — mais
   * elles donnent le nom et la stature, qui sont exactement ce qu'on garde
   * d'un passage au gouvernement.
   */
  "ancien_ministre": {
    "family": "appareil",
    "kind": "asset",
    "label": { "fr": "Ancien ministre", "en": "Former minister" },
    "desc": {
      "fr": "Vous avez tenu un ministère. On vous présentera ainsi jusqu'à la fin, y compris les jours où vous n'aurez plus rien d'autre à faire valoir.",
      "en": "You held a ministry. That is how you will be introduced for ever, including on the days you have nothing else left to show."
    },
    "stats": { "notoriete": 3, "credibilite": 3 }
  },

  "ancien_premier": {
    "family": "appareil",
    "kind": "asset",
    "blocks": ["ancien_ministre"],
    "label": { "fr": "Ancien Premier ministre", "en": "Former prime minister" },
    "desc": {
      "fr": "Vous avez eu Matignon. Le pays retient rarement ce que vous y avez fait, et n'oublie jamais que vous y avez été.",
      "en": "You had the top job under the president. The country rarely remembers what you did there, and never forgets that you were there."
    },
    "stats": { "notoriete": 5, "credibilite": 5 },
    "target": { "standing": 6 }
  },

  "intouchable": {
    "family": "reputation",
    "kind": "asset",
    "label": { "fr": "Réputation d'intégrité", "en": "Reputation for integrity" },
    "desc": {
      "fr": "On vous cite en exemple, ce qui est flatteur jusqu'au jour où l'on cherche la faille.",
      "en": "You get held up as an example, which is flattering until someone goes looking for the flaw."
    },
    "stats": { "reputation": 3, "reseau": -2 },
    "target": { "popularity": 2 },
    "rejection": -0.12,
    "blocks": ["caisse_noire"]
  },

  "teflon": {
    "family": "reputation",
    "kind": "asset",
    "label": { "fr": "Téflon", "en": "Teflon" },
    "desc": {
      "fr": "Les affaires glissent sur vous. Personne ne comprend pourquoi, vous non plus.",
      "en": "Scandals slide off you. Nobody understands why, including you."
    },
    "stats": { "sangfroid": 2 },
    "soften": 0.45,
    "rejection": -0.05
  },

  "clairvoyant": {
    "family": "reputation",
    "kind": "asset",
    "label": { "fr": "Clairvoyant", "en": "Vindicated" },
    "desc": {
      "fr": "Vous avez tenu une position que personne ne voulait défendre, et le temps vous a donné raison devant témoins. On vous ressort à chaque crise.",
      "en": "You held a position nobody else would defend, and time proved you right in front of witnesses. You get wheeled out at every crisis."
    },
    "stats": { "reputation": 3 },
    "rejection": -0.08
  },

  "casserole": {
    "strikes": 2,
    "family": "reputation",
    "kind": "mark",
    "label": { "fr": "Casserole", "en": "Baggage" },
    "desc": {
      "fr": "Une vieille affaire revient dans chaque portrait qu'on écrit sur vous.",
      "en": "An old story comes back in every profile ever written about you."
    },
    "stats": { "reputation": -3 },
    "target": { "popularity": -5 },
    "rejection": 0.1,
    "risk": { "p": 0.03, "chain": "enquete_ouverte" }
  },

  "menteur": {
    "strikes": 3,
    "family": "reputation",
    "kind": "mark",
    "label": { "fr": "Parole en l'air", "en": "Known to say anything" },
    "desc": {
      "fr": "On vous a trop vu vous dédire. Vos promesses ne valent plus grand-chose, vos démentis non plus.",
      "en": "You have gone back on your word once too often. Your promises are cheap now, and so are your denials."
    },
    "stats": { "reputation": -3, "sangfroid": 2 },
    "target": { "popularity": -4 },
    "rejection": 0.08
  },

  "radical": {
    "family": "reputation",
    "kind": "mark",
    // On ne se fait pas ranger aux extrêmes parce qu'on a haussé le ton : il
    // faut en venir. Un centriste peut dire ce qu'il veut, le pays continuera
    // de le lire comme un centriste qui s'énerve.
    "requiresParty": ["radical_left", "identitarians"],
    "label": { "fr": "Marqué aux extrêmes", "en": "Branded an extremist" },
    "desc": {
      "fr": "Votre base vous suivrait n'importe où. C'est le reste du pays qui pose problème.",
      "en": "Your base would follow you anywhere. The rest of the country is the problem."
    },
    "stats": { "notoriete": 2, "reputation": -2 },
    "target": { "popularity": 3 },
    "rejection": 0.28
  },

  /* ==========================================================================
     AFFAIRES — l'argent et ce qu'il traîne
     ========================================================================== */

  "caisse_noire": {
    "family": "affaires",
    "kind": "mark",
    "label": { "fr": "Caisse noire", "en": "Slush fund" },
    "desc": {
      "fr": "Un financement que personne ne déclare et dont tout le monde profite, jusqu'au jour où.",
      "en": "Funding nobody declares and everybody enjoys, right up until the day it surfaces."
    },
    "stats": { "reseau": 2, "reputation": -2 },
    "target": { "standing": 4 },
    "income": 14000,
    "risk": { "p": 0.05, "chain": "enquete_ouverte" },
    "blocks": ["intouchable"]
  }
};

/** Ordre d'affichage des familles sur la fiche du personnage. */
const TRAIT_FAMILIES = ["caractere", "physique", "talent", "appareil", "reputation", "affaires"];
