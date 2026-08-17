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
 *   "birth"         Poids de tirage à la naissance. Absent = ne se tire jamais.
 *   "axis"          L'axe sur lequel ce tirage se joue. Le jeu tire UNE FOIS
 *                   PAR AXE, indépendamment : on peut très bien être beau et
 *                   zozoter, ou avoir une voix de radio et être lâche. Les
 *                   axes existants : "apparence", "elocution", "identite",
 *                   "temperament". Chacun a sa part de chance de ne rien
 *                   donner du tout, réglée par BIRTH_NONE dans js/game.js.
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
 *
 * ----------------------------------------------------------------------------
 * RÈGLES D'ÉCRITURE
 * ----------------------------------------------------------------------------
 * 1. AUCUN TRAIT N'EST PUREMENT BON, ET AUCUN N'EST PUREMENT MAUVAIS. Les
 *    atouts les plus forts se paient dans une statistique ou dans l'autre
 *    jauge, et les marques les plus lourdes rapportent quelque chose : c'est
 *    ce qui fait qu'un joueur peut vouloir se salir les mains. Un trait
 *    physique subi doit toujours donner quelque chose en retour, sinon le
 *    tirage de naissance n'est qu'une punition.
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
    "stats": { "charisme": 5, "reputation": -2 },
    "target": { "popularity": 4, "standing": -3 },
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
    "stats": { "charisme": -4, "reputation": 3 },
    "target": { "popularity": -3, "standing": 3 },
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
    "stats": { "eloquence": 3, "charisme": 1 },
    "target": { "popularity": 2 }
  },

  "zozote": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "elocution",
    "label": { "fr": "Cheveux sur la langue", "en": "A lisp" },
    "desc": {
      "fr": "Un défaut d'élocution que les imitateurs ont repéré avant vous. On retient la façon dont vous le dites, jamais ce que vous dites.",
      "en": "A speech impediment the impressionists spotted before you did. People remember how you say it, never what you said."
    },
    "stats": { "eloquence": -3, "reputation": 2 },
    "target": { "popularity": -2 }
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
    "stats": { "sangfroid": 2 },
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
    "birth": 4,
    "axis": "temperament",
    "label": { "fr": "Intrépide", "en": "Fearless" },
    "desc": {
      "fr": "Le conflit ne vous coûte rien, il vous réveille. Vos équipes vous suivent en serrant les dents et votre direction vous regarde partir au front avec inquiétude.",
      "en": "Conflict costs you nothing, it wakes you up. Your staff follow with their teeth clenched and your leadership watches you charge with some concern."
    },
    "stats": { "sangfroid": 4, "reputation": 1 },
    "target": { "popularity": 3, "standing": -3 }
  },

  "lache": {
    "family": "physique",
    "kind": "mark",
    "birth": 4,
    "axis": "temperament",
    "label": { "fr": "Lâche", "en": "Coward" },
    "desc": {
      "fr": "Devant un conflit, quelque chose en vous cherche la sortie. Vous avez fait une carrière entière sans jamais vous exposer, ce qui est une forme de longévité.",
      "en": "Faced with a fight, something in you looks for the exit. You have built a whole career without ever sticking your neck out, which is its own kind of longevity."
    },
    "stats": { "sangfroid": -4, "reputation": -2 },
    "target": { "standing": 4, "popularity": -3 },
    "soften": 0.25
  },

  "athletique": {
    "family": "physique",
    "kind": "asset",
    "label": { "fr": "Sportif", "en": "Athletic" },
    "desc": {
      "fr": "Vous courez le matin et vous le faites savoir. Les journées de quinze heures vous coûtent moins qu'aux autres.",
      "en": "You run in the morning and you make sure people know. Fifteen-hour days cost you less than they cost the others."
    },
    "stats": { "energie": 4, "notoriete": 1 },
    "target": { "popularity": 2, "standing": -2 },
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
    "stats": { "energie": -3, "sangfroid": 3 },
    "target": { "popularity": -4 },
    "energy": -1,
    "soften": 0.2,
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
    "stats": { "charisme": 3, "reputation": -3 },
    "target": { "popularity": 2 }
  },

  "use": {
    "family": "physique",
    "kind": "mark",
    "label": { "fr": "Usé", "en": "Worn down" },
    "desc": {
      "fr": "Les nuits blanches ne se rattrapent plus. Votre corps tient les comptes.",
      "en": "The sleepless nights no longer wash out. Your body keeps the ledger."
    },
    "stats": { "energie": -4, "sangfroid": 2 },
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
    "stats": { "eloquence": 4 },
    "target": { "popularity": 3 }
  },

  "bete_scene": {
    "family": "talent",
    "kind": "asset",
    "label": { "fr": "Bête de plateau", "en": "Made for television" },
    "desc": {
      "fr": "Le pays vous adore à l'écran, l'appareil vous trouve encombrant.",
      "en": "The country loves you on screen; the party finds you cumbersome."
    },
    "stats": { "notoriete": 4, "reputation": -2 },
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
    "stats": { "reseau": 6, "notoriete": -1 },
  },

  "bosseur": {
    "family": "talent",
    "kind": "asset",
    "label": { "fr": "Bourreau de travail", "en": "Workhorse" },
    "desc": {
      "fr": "Vous tenez des rythmes qui usent vos équipes avant vous.",
      "en": "You keep hours that wear out your staff long before they wear out you."
    },
    "stats": { "energie": 4 },
    "energy": 2
  },

  /* ==========================================================================
     APPAREIL — votre rapport à la machine
     ========================================================================== */

  "appareil": {
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

  "intouchable": {
    "family": "reputation",
    "kind": "asset",
    "label": { "fr": "Réputation d'intégrité", "en": "Reputation for integrity" },
    "desc": {
      "fr": "On vous cite en exemple, ce qui est flatteur jusqu'au jour où l'on cherche la faille.",
      "en": "You get held up as an example, which is flattering until someone goes looking for the flaw."
    },
    "stats": { "reputation": 4, "reseau": -2 },
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
    "stats": { "reputation": 4, "sangfroid": 1 },
    "target": { "popularity": 5, "standing": -4 },
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
    "stats": { "reputation": -4 },
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
    "stats": { "reputation": -4, "sangfroid": 2 },
    "target": { "popularity": -4 },
    "rejection": 0.08
  },

  "radical": {
    "family": "reputation",
    "kind": "mark",
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
const TRAIT_FAMILIES = ["physique", "talent", "appareil", "reputation", "affaires"];
