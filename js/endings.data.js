/*
 * President Material — LES FINS.
 * ============================================================================
 *
 * Une partie se termine toujours d'une des cinq façons prévues par le
 * moteur : victoire, retraite choisie, retrait forcé, mort, condamnation. Mais la fin AFFICHÉE
 * dépend de l'état dans lequel la carrière s'arrête. Gagner l'Élysée sans
 * s'être sali les mains n'est pas la même histoire que le gagner avec une
 * caisse noire dans le dos, et le jeu doit le dire.
 *
 * Comme les autres fichiers de données, celui-ci est en syntaxe JSON stricte
 * et porte l'extension .js pour que le jeu s'ouvre sans serveur.
 *
 * ----------------------------------------------------------------------------
 * COMMENT C'EST LU
 * ----------------------------------------------------------------------------
 * La liste est parcourue DANS L'ORDRE et la première fin dont les conditions
 * sont remplies gagne. Les fins ordinaires, sans "when", ferment donc chaque
 * famille : mettez toujours les cas particuliers avant.
 *
 *   "from"    la fin du moteur à laquelle celle-ci se substitue
 *   "when"    mêmes conditions que les événements, plus "trait" / "notTrait"
 *   "title"   et "text" : { fr, en }
 *
 * Comme partout, on ne cite aucun chiffre de jauge dans le texte.
 */
const ENDING_DATA = [

  /* ---------- Victoires ---------- */

  {
    "id": "irreprochable",
    "from": "victory",
    "when": {
      "notTrait": ["caisse_noire", "casserole", "menteur", "traitre"],
      "stat": { "reputation": { "min": 14 } },
      "flag": { "dirtyMoney": false }
    },
    "title": { "fr": "Président irréprochable", "en": "The clean president" },
    "text": {
      "fr": "Vous arrivez au sommet sans dossier, sans dette et sans casserole. Les journalistes qui ont fouillé votre passé pendant la campagne en sont revenus les mains vides, et cela restera votre plus belle victoire.",
      "en": "You reach the top with no file, no debt and no baggage. The reporters who dug through your past during the campaign came back empty-handed, and that will remain your finest victory."
    }
  },

  {
    "id": "sous_influence",
    "from": "victory",
    "when": { "trait": ["caisse_noire"] },
    "title": { "fr": "Président sous influence", "en": "The president they own" },
    "text": {
      "fr": "Vous entrez à l'Élysée avec une comptabilité que personne ne doit ouvrir. Les gens qui l'ont tenue pour vous connaissent le chemin de votre bureau, et ils prendront rendez-vous.",
      "en": "You enter office with a set of books nobody must ever open. The people who kept them for you know the way to your desk, and they will make appointments."
    }
  },

  {
    "id": "irruption",
    "from": "victory",
    "when": { "party": ["radical_left", "identitarians"] },
    "title": { "fr": "L'irruption", "en": "The breakthrough" },
    "text": {
      "fr": "On vous promettait une carrière de témoin. Le pays a préféré vous confier les clés, et la moitié des éditorialistes qui commentent votre victoire écrivaient il y a six mois qu'elle était impossible.",
      "en": "They promised you a career as a witness to history. The country handed you the keys instead, and half the columnists explaining your win were writing six months ago that it could not happen."
    }
  },

  {
    "id": "dernier_train",
    "from": "victory",
    "when": { "minAge": 64 },
    "title": { "fr": "Le dernier train", "en": "The last train" },
    "text": {
      "fr": "Vous avez commencé jeune et fini vieux, et tous ceux qui vous avaient enterré en cours de route sont venus vous féliciter. Le mandat sera court, la revanche est complète.",
      "en": "You started young and finished old, and everyone who buried you along the way turned up to congratulate you. The term will be short; the vindication is total."
    }
  },

  {
    "id": "victory",
    "from": "victory",
    "title": { "fr": "Président de la République", "en": "President of the Republic" },
    "text": {
      "fr": "Le pays vous a choisi. L'ascension s'achève au sommet de l'État : tout ce qui suit s'appelle l'Histoire.",
      "en": "The country has chosen you. The climb ends at the top of the state: everything that follows is called history."
    }
  },

  /* ---------- Retraites ---------- */

  {
    "id": "faiseur_rois",
    "from": "retire",
    "when": { "position": ["chef"], "minStanding": 62 },
    "title": { "fr": "Faiseur de rois", "en": "Kingmaker" },
    "text": {
      "fr": "Vous quittez la scène sans avoir été élu et sans avoir été battu. Ceux qui gouvernent vous doivent leur investiture, et vous savez très bien ce que cela vaut.",
      "en": "You leave the stage having never been elected and never been beaten. The people in power owe you their nomination, and you know exactly what that is worth."
    }
  },

  {
    "id": "eminence",
    "from": "retire",
    "when": { "minStanding": 58, "maxPopularity": 48 },
    "title": { "fr": "Éminence grise", "en": "The grey eminence" },
    "text": {
      "fr": "Le pays n'a jamais vraiment su qui vous étiez, l'appareil ne s'est jamais posé la question. On vous consultera encore longtemps, dans des pièces sans caméra.",
      "en": "The country never quite worked out who you were; the party never had to ask. They will keep consulting you for years, in rooms without cameras."
    }
  },

  {
    "id": "retire",
    "from": "retire",
    "title": { "fr": "Retraite politique", "en": "Political retirement" },
    "text": {
      "fr": "Vous quittez la vie publique de votre plein gré. Peu de gens peuvent en dire autant.",
      "en": "You leave public life of your own accord. Not many people can say the same."
    }
  },

  /* ---------- Morts ---------- */

  /*
   * QUAND LE CORPS N'AVAIT RIEN DIT. Ces fins ne se déclenchent que si rien
   * dans la partie n'annonçait quoi que ce soit : ni santé fragile, ni trait
   * qui abîme. Une mort qui n'a pas prévenu doit avoir une cause qu'on ne
   * pouvait pas voir venir, et la vie politique en fournit d'assez bêtes.
   */
  {
    "id": "accident_route",
    "from": "death",
    "when": {
      "flag": { "frailHealth": false },
      "notTrait": ["fragile", "obese", "use", "declin"],
      "position": ["maire", "euro", "depute", "ministre", "chef", "premier"],
      "maxAge": 74
    },
    "title": { "fr": "Sur la départementale", "en": "On a country road" },
    "text": {
      "fr": "Un retour de réunion publique, une départementale mouillée, un chauffeur qui n'avait pas dormi davantage que vous. Il y aura une minute de silence, un rond-point à votre nom, et un rapport que personne ne lira.",
      "en": "Driving back from a public meeting, a wet country road, a driver who had slept no more than you had. There will be a minute's silence, a roundabout named after you, and a report nobody reads."
    }
  },

  {
    "id": "accident_betise",
    "from": "death",
    "when": {
      "flag": { "frailHealth": false },
      "notTrait": ["fragile", "obese", "use", "declin"],
      "maxAge": 74
    },
    "title": { "fr": "Une fin sans grandeur", "en": "An end without grandeur" },
    "text": {
      "fr": "Vous mourez comme on meurt vraiment : d'une chose bête, un dimanche, loin de toute caméra. Les hommages parleront de destin et de service de l'État, et aucun ne dira ce qui s'est réellement passé, parce que ce serait ridicule.",
      "en": "You die the way people actually die: of something stupid, on a Sunday, far from any camera. The tributes will speak of destiny and public service, and none will say what actually happened, because it would sound ridiculous."
    }
  },

  /*
   * ON VOUS L'AVAIT DIT TROIS FOIS. Ces deux fins-là ne sont possibles que
   * depuis que le corps prévient sur des cartes : elles lisent le nombre de
   * scènes de fin de carrière que le joueur a effectivement jouées, et elles
   * disent ce qu'il en a fait. Une sortie qu'on a refusé de voir venir n'est
   * pas la même histoire qu'une sortie qui tombe du ciel.
   */
  {
    "id": "prevenu_trois_fois",
    "from": "death",
    "when": { "minDecline": 3 },
    "title": { "fr": "On vous avait prévenu", "en": "You had been told" },
    "text": {
      "fr": "Il n'y aura pas de surprise, et c'est bien ce qu'on vous reprochera : trois médecins, un entourage entier et votre propre miroir vous avaient dit la même chose, et vous aviez chaque fois trouvé une échéance à tenir d'abord. Les hommages diront que vous êtes mort au travail. C'est exact, et cela ne veut pas dire ce qu'ils croient.",
      "en": "There will be no surprise, and that is exactly what will be held against you: three doctors, an entire staff and your own mirror had told you the same thing, and each time you found one more deadline to get past first. The tributes will say you died in harness. That is accurate, and it does not mean what they think it means."
    }
  },

  {
    "id": "en_pleine_gloire",
    "from": "death",
    "when": { "minPopularity": 76 },
    "title": { "fr": "Mort en pleine gloire", "en": "Died at the summit" },
    "text": {
      "fr": "Vous partez au moment où le pays vous aimait le plus. Les hommages seront sincères, les biographies élogieuses, et personne ne saura jamais ce que vous auriez fait du pouvoir.",
      "en": "You go at the moment the country loved you most. The tributes will be sincere, the biographies kind, and nobody will ever know what you would have done with power."
    }
  },

  {
    "id": "death",
    "from": "death",
    "title": { "fr": "Fin de parcours", "en": "End of the road" },
    "text": {
      "fr": "La mort vous rattrape avant l'Élysée. Les hommages sont unanimes, comme toujours quand il est trop tard.",
      "en": "Death catches you before the palace does. The tributes are unanimous, as they always are once it is too late."
    }
  },

  /* ---------- Retraits forcés ---------- */
  /*
   * On ne part pas toujours quand on veut. Ces fins sont celles qu'on subit :
   * le corps, la mémoire, ou un entourage qui a décidé pour vous. Les cas
   * particuliers d'abord, la sortie ordinaire en dernier.
   */

  /* LE BURNOUT. Le retrait forcé n'existait qu'à partir de soixante-deux ans :
     une carrière menée à vide pendant vingt ans ne s'arrêtait jamais pour
     cela, elle s'arrêtait de vieillesse. L'épuisement a maintenant sa sortie
     à tout âge, et celle-ci est réservée à ceux qu'il prend avant l'heure :
     « l'appareil parle de transition » ne veut rien dire à quarante-trois ans. */
  {
    "id": "burnout",
    "from": "withdrawal",
    "when": { "maxAge": 58, "trait": ["epuise"] },
    "title": { "fr": "Arrêt de travail", "en": "Signed off" },
    "text": {
      "fr": "Vous n'êtes pas tombé de haut, vous vous êtes arrêté net, un mardi, dans un couloir que vous empruntiez depuis douze ans. Le mot qu'on emploie tient en deux syllabes et personne ne l'écrira dans un communiqué. Vous aviez l'âge où l'on commence, et vous avez déjà tout donné.",
      "en": "You did not fall from a height, you simply stopped, on a Tuesday, in a corridor you had walked for twelve years. The word people use has two syllables and nobody will put it in a statement. You were the age at which careers begin, and you had already given everything."
    }
  },

  {
    "id": "retrait_prevenu",
    "from": "withdrawal",
    "when": { "minDecline": 3, "minAge": 60 },
    "title": { "fr": "La dernière réunion", "en": "The last meeting" },
    "text": {
      "fr": "On ne vous pousse pas dehors : on vous rappelle, poliment, ce que vous saviez déjà. Vous êtes le seul dans la pièce à découvrir la nouvelle, et vous ne la découvrez pas. Le communiqué parle d'une décision personnelle, ce qu'elle aurait pu être si vous l'aviez prise deux ans plus tôt.",
      "en": "Nobody pushes you out: they remind you, politely, of what you already knew. You are the only person in the room hearing the news, and you are not hearing it. The statement calls it a personal decision, which is what it could have been had you taken it two years earlier."
    }
  },

  {
    "id": "senilite",
    "from": "withdrawal",
    "when": { "minAge": 76 },
    "title": { "fr": "Le nom qui ne revient pas", "en": "The name that will not come" },
    "text": {
      "fr": "En direct, vous cherchez un mot que vous avez prononcé mille fois. Le silence dure trois secondes de trop. Le soir même, votre camp explique que vous alliez de toute façon passer la main.",
      "en": "On live television you reach for a word you have said a thousand times. The silence runs three seconds too long. By evening your own side is explaining that you were stepping back anyway."
    }
  },

  {
    "id": "usure",
    "from": "withdrawal",
    "when": { "stat": { "energie": { "max": 3 } } },
    "title": { "fr": "À bout de forces", "en": "Running on empty" },
    "text": {
      "fr": "Vous avez tenu le rythme jusqu'au jour où le corps a refusé de se lever. Les médecins parlent de repos, l'appareil parle de transition, et les deux mots veulent dire la même chose.",
      "en": "You kept the pace until the morning your body refused to get up. The doctors call it rest, the party calls it a transition, and both words mean the same thing."
    }
  },

  {
    "id": "sante_fragile",
    "from": "withdrawal",
    "when": { "flag": { "frailHealth": true } },
    "title": { "fr": "Sur avis médical", "en": "On doctor's orders" },
    "text": {
      "fr": "Le communiqué tient en quatre lignes et ne dit pas la maladie. Il n'aura fallu qu'une nuit d'hôpital pour que tout le monde, y compris vous, comprenne que c'était fini.",
      "en": "The statement runs to four lines and never names the illness. One night in hospital was enough for everyone, yourself included, to understand it was over."
    }
  },

  {
    "id": "poussee_dehors",
    "from": "withdrawal",
    "when": { "minStanding": 55 },
    "title": { "fr": "La sortie organisée", "en": "The managed exit" },
    "text": {
      "fr": "On vous laisse annoncer vous-même ce qui avait été décidé sans vous. Les hommages commencent avant la fin de votre phrase, ce qui prouve qu'ils étaient écrits.",
      "en": "They let you announce yourself what had already been decided without you. The tributes start before your sentence ends, which proves they were written in advance."
    }
  },

  {
    "id": "encore_vaillant",
    "from": "withdrawal",
    "when": { "stat": { "energie": { "min": 8 } } },
    "title": { "fr": "Trop tôt, et personne pour le dire", "en": "Too soon, and nobody to say it" },
    "text": {
      "fr": "Vous n'êtes ni malade ni fatigué, et c'est bien ce qui rend la chose humiliante : on ne vous remplace pas parce que vous n'en pouvez plus, on vous remplace parce qu'il fallait la place. Vous mettrez des années à cesser de refaire la conversation dans votre tête.",
      "en": "You are neither ill nor tired, and that is exactly what makes it humiliating: they are not replacing you because you are spent, they are replacing you because the seat was needed. It will take years to stop replaying the conversation in your head."
    }
  },

  {
    "id": "withdrawal",
    "from": "withdrawal",
    "title": { "fr": "Retrait de la vie publique", "en": "Withdrawal from public life" },
    "text": {
      "fr": "Vous ne renoncez pas, on renonce pour vous. La carrière s'arrête au milieu d'une phrase, et le pays passe à autre chose avant la fin de la semaine.",
      "en": "You do not give up; it is given up for you. The career stops mid-sentence, and the country has moved on before the week is out."
    }
  },

  /* ---------- Condamnations ---------- */

  {
    "id": "bouc_emissaire",
    "from": "conviction",
    "when": { "maxStanding": 30 },
    "title": { "fr": "Bouc émissaire", "en": "The fall guy" },
    "text": {
      "fr": "Vous tombez seul pour un système qui vous survivra. Ceux qui ont signé les mêmes papiers que vous se sont trouvé des avocats plus tôt, et un parti pour les défendre.",
      "en": "You go down alone for a system that will outlive you. The people who signed the same papers found lawyers earlier, and a party willing to defend them."
    }
  },

  {
    "id": "conviction",
    "from": "conviction",
    "title": { "fr": "Condamnation", "en": "Conviction" },
    "text": {
      "fr": "La justice met un terme à votre carrière. En politique, tout se paie, parfois avec intérêts.",
      "en": "The courts end your career. In politics everything gets paid for, sometimes with interest."
    }
  }
];
