/*
 * President Material — L'ARGENT.
 * ============================================================================
 *
 * Une carrière politique a un budget : ce qui rentre chaque année, ce qui
 * sort, et ce qu'on choisit d'y consacrer. Tant que l'argent ne servait qu'à
 * débloquer une option de temps en temps, il ne décidait de rien. Ici il
 * s'épuise, il rapporte, et il finit par peser sur la carrière.
 *
 * ----------------------------------------------------------------------------
 * LES CHIFFRES SONT CEUX DU RÉEL
 * ----------------------------------------------------------------------------
 * Un député gagne environ 91 000 € par an, un maire de ville moyenne autour
 * de 45 000 €, un militant vit de son métier. Un député européen et un
 * ministre tournent tous les deux autour de 10 000 € par mois, ce qui est
 * l'une des rares choses que le public devine à peu près juste. Entre les
 * cotisations, l'impôt et la vie courante, un peu plus de la moitié de ce qui
 * rentre repart. Un attaché de presse coûte le salaire chargé d'un attaché de
 * presse, et un logement coûte un loyer.
 *
 * Rien ici ne doit être un chiffre inventé pour équilibrer une courbe : si
 * un montant surprend, c'est qu'il est faux.
 *
 * ----------------------------------------------------------------------------
 * CE QUE CONTIENT CHAQUE BLOC
 * ----------------------------------------------------------------------------
 *   "wealth_yield"      Rendement annuel du patrimoine. Un gros capital
 *                       travaille tout seul : c'est la première inégalité.
 *
 *   "salaries"          Revenu annuel d'activité. Aux échelons du bas, c'est
 *                       le métier qui paie ; à partir de maire, c'est
 *                       l'indemnité de la fonction.
 *
 *   "lifestyle_rate"    Part du revenu qui part en vie courante et en impôts,
 *   "lifestyle_floor"   avec un plancher : on ne vit pas avec rien.
 *   "origin_lifestyle"  Multiplicateur selon le milieu d'origine. On dépense
 *                       comme on a été élevé, plus que selon ce qu'on gagne.
 *
 *   "investments"       LES POSTES AJUSTABLES. Chacun a des paliers, avec
 *                       pour chacun :
 *                         "cost"      dépense annuelle
 *                         "hold"      part de la baisse d'une jauge évitée
 *                         "energy"    décale le plafond de forme physique
 *                         "protect"   part de risque judiciaire évitée
 *                         "roll"      bonus aux jets sur une statistique
 *
 * Le joueur monte et descend ces paliers quand il veut, dans l'onglet Budget.
 * Un solde annuel négatif ronge le patrimoine, et quand il n'y a plus rien,
 * le moteur coupe lui-même dans les dépenses.
 */
const BUDGET_DATA = {

  "wealth_yield": 0.018,

  "salaries": {
    "militant": 30000,
    "conseiller": 34000,
    "maire": 45000,
    "euro": 121000,
    "depute": 91000,
    "ministre": 125000,
    "chef": 110000
  },

  "lifestyle_rate": 0.52,
  "lifestyle_floor": 13000,

  "origin_lifestyle": {
    "modest": 0.95,
    "middle": 1,
    "bourgeois": 1.25,
    "dynasty": 1.15
  },

  "investments": {

    "communication": {
      "label": { "fr": "Communication", "en": "Communications" },
      "desc": {
        "fr": "Ce que le pays voit de vous entre deux campagnes.",
        "en": "What the country sees of you between campaigns."
      },
      "levels": [
        { "name": { "fr": "Aucune", "en": "None" }, "cost": 0 },
        { "name": { "fr": "Un attaché de presse à mi-temps", "en": "A part-time press officer" },
          "cost": 32000, "hold": { "popularity": 0.22 } },
        { "name": { "fr": "Un attaché de presse et un community manager", "en": "A press officer and a community manager" },
          "cost": 68000, "hold": { "popularity": 0.42 } },
        { "name": { "fr": "Une agence de communication", "en": "A communications agency" },
          "cost": 150000, "hold": { "popularity": 0.62 } }
      ]
    },

    "juridique": {
      "label": { "fr": "Conseil juridique", "en": "Legal counsel" },
      "desc": {
        "fr": "Des avocats qui répondent la nuit et qui savent à qui téléphoner.",
        "en": "Lawyers who answer at night and know who to call."
      },
      "levels": [
        { "name": { "fr": "Aucun", "en": "None" }, "cost": 0 },
        { "name": { "fr": "Un avocat au forfait", "en": "A lawyer on retainer" },
          "cost": 18000, "protect": 0.3, "roll": { "sangfroid": 1 } },
        { "name": { "fr": "Un cabinet d'avocats", "en": "A law firm" },
          "cost": 70000, "protect": 0.55, "roll": { "sangfroid": 2 } }
      ]
    },

    "logement": {
      "label": { "fr": "Logement", "en": "Housing" },
      "desc": {
        "fr": "Où vous dormez, et surtout où vous recevez.",
        "en": "Where you sleep, and above all where you entertain."
      },
      "levels": [
        { "name": { "fr": "Un studio", "en": "A studio flat" }, "cost": 7000 },
        { "name": { "fr": "Un deux-pièces correct", "en": "A decent two-room flat" },
          "cost": 14000, "energy": 1 },
        { "name": { "fr": "Une maison avec un jardin", "en": "A house with a garden" },
          "cost": 28000, "energy": 2 },
        { "name": { "fr": "Un appartement au centre de la capitale", "en": "A flat in the centre of the capital" },
          "cost": 46000, "energy": 2, "hold": { "standing": 0.35 } }
      ]
    }
  }
};
