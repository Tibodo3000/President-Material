/*
 * President Material — LES TRAITS.
 * ============================================================================
 *
 * Un trait est une marque durable laissée par un choix. Contrairement aux
 * statistiques, il ne se dose pas : on l'a ou on ne l'a pas, et il pèse sur
 * toute la suite de la partie.
 *
 * Comme les événements, ce fichier ne contient que des données, en syntaxe
 * JSON stricte, et porte l'extension .js pour que le jeu s'ouvre sans serveur.
 *
 * ----------------------------------------------------------------------------
 * CE QU'UN TRAIT PEUT FAIRE
 * ----------------------------------------------------------------------------
 *   "kind"          "asset" (atout) ou "mark" (marque). Sert à l'affichage.
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
 *   "roll"          Bonus aux jets qui reposent sur une statistique.
 *   "energy"        Décale le plafond de forme physique.
 *   "presidential"  Bonus ou malus au score de l'élection présidentielle.
 *   "soften"        Amortit les mauvaises nouvelles de popularité (0 à 1).
 *   "income"        Revenu occulte par tour, en euros.
 *   "risk"          Risque par tour de déclencher un événement.
 *   "blocks"        Traits incompatibles : les prendre retire ceux-là.
 *
 * ----------------------------------------------------------------------------
 * RÈGLE D'ÉCRITURE
 * ----------------------------------------------------------------------------
 * Aucun trait n'est purement bon. Les atouts les plus forts se paient dans
 * une statistique ou dans l'autre jauge, et les marques les plus lourdes
 * rapportent quelque chose : c'est ce qui fait qu'un joueur peut vouloir se
 * salir les mains.
 */
const TRAIT_DATA = {

  /* ---------- Atouts ---------- */

  "orateur": {
    "kind": "asset",
    "label": { "fr": "Orateur", "en": "Orator" },
    "desc": {
      "fr": "Vous tenez une salle. Les mots vous viennent quand les autres cherchent les leurs.",
      "en": "You can hold a room. The words come to you while others are still looking for theirs."
    },
    "stats": { "eloquence": 2 },
    "target": { "popularity": 3 },
    "roll": { "eloquence": 1.5 }
  },

  "bete_scene": {
    "kind": "asset",
    "label": { "fr": "Bête de plateau", "en": "Made for television" },
    "desc": {
      "fr": "Le pays vous adore à l'écran, l'appareil vous trouve encombrant.",
      "en": "The country loves you on screen; the party finds you cumbersome."
    },
    "stats": { "notoriete": 4, "reputation": -2 },
    "target": { "popularity": 2, "standing": -6 }
  },

  "appareil": {
    "kind": "asset",
    "label": { "fr": "Homme d'appareil", "en": "Party operator" },
    "desc": {
      "fr": "Vous connaissez les statuts par cœur et les fédérations une par une.",
      "en": "You know the party rulebook by heart and the local branches one by one."
    },
    "stats": { "reseau": 2, "notoriete": -2 },
    "target": { "standing": 5, "popularity": -3 }
  },

  "reseauteur": {
    "kind": "asset",
    "label": { "fr": "Carnet d'adresses", "en": "Well connected" },
    "desc": {
      "fr": "Vous décrochez votre téléphone et quelqu'un décroche en face.",
      "en": "You pick up the phone and someone always picks up on the other end."
    },
    "stats": { "reseau": 4 },
    "roll": { "reseau": 1 }
  },

  "bosseur": {
    "kind": "asset",
    "label": { "fr": "Bourreau de travail", "en": "Workhorse" },
    "desc": {
      "fr": "Vous tenez des rythmes qui usent vos équipes avant vous.",
      "en": "You keep hours that wear out your staff long before they wear out you."
    },
    "stats": { "energie": 4 },
    "energy": 2
  },

  "teflon": {
    "kind": "asset",
    "label": { "fr": "Téflon", "en": "Teflon" },
    "desc": {
      "fr": "Les affaires glissent sur vous. Personne ne comprend pourquoi, vous non plus.",
      "en": "Scandals slide off you. Nobody understands why, including you."
    },
    "stats": { "sangfroid": 2 },
    "soften": 0.45
  },

  "intouchable": {
    "kind": "asset",
    "label": { "fr": "Réputation d'intégrité", "en": "Reputation for integrity" },
    "desc": {
      "fr": "On vous cite en exemple, ce qui est flatteur jusqu'au jour où l'on cherche la faille.",
      "en": "You get held up as an example, which is flattering until someone goes looking for the flaw."
    },
    "stats": { "reputation": 4, "reseau": -2 },
    "target": { "popularity": 2 },
    "blocks": ["caisse_noire"]
  },

  /* ---------- Marques ---------- */

  "casserole": {
    "kind": "mark",
    "label": { "fr": "Casserole", "en": "Baggage" },
    "desc": {
      "fr": "Une vieille affaire revient dans chaque portrait qu'on écrit sur vous.",
      "en": "An old story comes back in every profile ever written about you."
    },
    "stats": { "reputation": -4 },
    "target": { "popularity": -5 },
    "risk": { "p": 0.03, "chain": "enquete_ouverte" }
  },

  "traitre": {
    "kind": "mark",
    "label": { "fr": "Réputation de traître", "en": "Marked as a traitor" },
    "desc": {
      "fr": "Le pays aime les francs-tireurs. L'appareil, lui, n'oublie jamais un coup de couteau.",
      "en": "The country likes a maverick. The machine never forgets a knife in the back."
    },
    "stats": { "reputation": -2, "sangfroid": 2 },
    "target": { "standing": -10, "popularity": 4 }
  },

  "radical": {
    "kind": "mark",
    "label": { "fr": "Marqué aux extrêmes", "en": "Branded an extremist" },
    "desc": {
      "fr": "Votre base vous suivrait n'importe où. C'est le reste du pays qui pose problème.",
      "en": "Your base would follow you anywhere. The rest of the country is the problem."
    },
    "stats": { "notoriete": 2, "reputation": -2 },
    "target": { "popularity": 3 },
    "presidential": -14
  },

  "use": {
    "kind": "mark",
    "label": { "fr": "Usé", "en": "Worn down" },
    "desc": {
      "fr": "Les nuits blanches ne se rattrapent plus. Votre corps tient les comptes.",
      "en": "The sleepless nights no longer wash out. Your body keeps the ledger."
    },
    "stats": { "energie": -4 },
    "energy": -2
  },

  "menteur": {
    "kind": "mark",
    "label": { "fr": "Parole en l'air", "en": "Known to say anything" },
    "desc": {
      "fr": "On vous a trop vu vous dédire. Vos promesses ne valent plus grand-chose, vos démentis non plus.",
      "en": "You have gone back on your word once too often. Your promises are cheap now, and so are your denials."
    },
    "stats": { "reputation": -4, "sangfroid": 2 },
    "target": { "popularity": -4 }
  },

  "caisse_noire": {
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
  },

  "renegat": {
    "kind": "mark",
    "label": { "fr": "Renégat", "en": "Renegade" },
    "desc": {
      "fr": "Vous avez quitté votre camp. Les deux rives vous regardent depuis l'autre bord.",
      "en": "You left your own side. Both banks now watch you from across the water."
    },
    "stats": { "sangfroid": 2, "reseau": -2 },
    "target": { "standing": -6 },
    "presidential": 6
  }
};
