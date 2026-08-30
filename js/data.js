/*
 * President Material — données et règles du jeu.
 *
 * Ce fichier ne touche pas au DOM : il contient les tables de création de
 * personnage et les fonctions de calcul, partagées par la création
 * (create.html) et le choix du parti (party.html).
 *
 * Les réglages d'équilibrage — l'échelle des statistiques comprise — sont
 * dans js/balance.js, qui se charge avant celui-ci.
 *
 * Statistiques personnelles : charisme, eloquence, energie, sangfroid
 * Statistiques externes     : reseau, notoriete, reputation, credibilite
 *
 * Les quatre externes disent quatre choses différentes, et il a fallu la
 * quatrième pour que les trois autres cessent de se marcher dessus :
 *   RÉSEAU       qui vous doit quelque chose.
 *   NOTORIÉTÉ    à quel point on vous connaît. Elle monte presque toute
 *                seule au fil d'une carrière : c'est normal, être connu
 *                n'est pas une qualité.
 *   RÉPUTATION   à quel point ce qu'on sait de vous est propre.
 *   CRÉDIBILITÉ  la stature. Est-ce qu'on vous imagine dans le fauteuil ?
 *                On peut être connu, propre et aimé sans que personne ne
 *                vous voie président, et c'est très exactement ce qui
 *                manquait au jeu.
 * La fortune n'est pas une statistique mais un capital en euros.
 */
/* ==========================================================================
   Statistiques (0 à 20)
   ========================================================================== */

/** Valeur de départ commune à tous les personnages. */
const BASE_STATS = {
  charisme: 6,
  eloquence: 6,
  energie: 6,
  sangfroid: 6,
  reseau: 4,
  notoriete: 2,
  reputation: 10,
  // À trente ans, personne n'a de stature. On en a un peu par défaut, parce
  // qu'on ne part pas de rien, et on passe la partie à la construire.
  credibilite: 6,
};


/**
 * Modificateurs de statistiques appliqués par chaque choix.
 *
 * Règles d'équilibrage, à respecter si vous ajoutez ou modifiez une option :
 *
 *   1. L'ORIGINE SOCIALE N'EST VOLONTAIREMENT PAS ÉQUILIBRÉE. Le privilège
 *      donne une vraie avance au départ, et c'est le sujet du jeu :
 *        milieu modeste      +1 point net,        5 000 €
 *        classe moyenne      +2 points nets,     20 000 €
 *        dynastie politique  +5 points nets,    400 000 €
 *        grande bourgeoisie  +3 points nets,  3 000 000 €
 *      La contrepartie ne se joue pas ici mais plus tard dans la partie :
 *      les profils privilégiés doivent s'exposer à des retours de bâton
 *      (soupçons d'héritage, affaires de famille, procès en légitimité)
 *      que les profils modestes n'auront pas. Reste à définir.
 *
 *   2. La personnalité, elle, reste strictement équilibrée : +3 points nets
 *      pour chaque trait. Un trait de caractère n'est pas un privilège, et
 *      un trait plus faible que les autres ne serait qu'un piège à joueur.
 *
 *   3. Un parcours qui enrichit donne moins de statistiques. Les métiers
 *      sans argent valent +5, les plus lucratifs +3. La fortune se paie
 *      en points, et inversement.
 *
 *   4. Presque chaque option a au moins un malus. C'est lui qui donne son
 *      identité au profil et qui rend les choix intéressants.
 *
 * Ajouter une option = une entrée ici, une entrée dans MONEY, le bloc HTML
 * correspondant et ses traductions. Une personnalité, elle, s'ajoute dans
 * js/traits.data.js, famille « caractere ».
 */
const STAT_MODIFIERS = {
  sex: {
    female: {},
    male: {},
  },

  /* Origine sociale : gradient de privilège assumé, de +1 à +5. */
  origin: {
    modest:    { energie: +4, reputation: +2, credibilite: -2, reseau: -2 },
    middle:    { eloquence: +2, energie: +2 },
    bourgeois: { reseau: +4, charisme: +2, sangfroid: +2, credibilite: +2, reputation: -4 },
    dynasty:   { reseau: +6, credibilite: +4, notoriete: +2, charisme: +2, sangfroid: +2,
                 reputation: -4, energie: -2 },
  },

  /* Parcours : +5 pour les moins rémunérateurs, +3 pour les plus lucratifs. */
  background: {
    activism:   { energie: +6, charisme: +4, reputation: +4, credibilite: -2, notoriete: -2 },
    journalism: { notoriete: +4, eloquence: +4, reseau: +2, credibilite: +2, reputation: -2 },
    academia:   { credibilite: +6, eloquence: +4, sangfroid: +2, notoriete: -2 },
    civil:      { sangfroid: +4, credibilite: +4, reseau: +2, notoriete: -2 },
    law:        { eloquence: +4, credibilite: +4, sangfroid: +2, notoriete: -2 },
    comms:      { eloquence: +4, reseau: +4, charisme: +4, reputation: -4, credibilite: -2 },
    business:   { reseau: +6, sangfroid: +2, credibilite: +2, energie: +2, reputation: -4, charisme: -2 },
    celebrity:  { notoriete: +8, charisme: +6, credibilite: -4, reputation: -4 },
  },

  /* La personnalité n'est plus ici : c'est un trait, et ses modificateurs sont
     écrits dans js/traits.data.js avec le reste de ce qu'il fait. Le joueur
     voit ainsi d'où viennent ses points au lieu de les subir. computeStats
     les applique quand même, pour que la fiche de création reste juste. */
};

/* ==========================================================================
   Fortune (capital de départ, en euros)
   ========================================================================== */

/**
 * Montants cumulés par les choix du joueur. Deux sources seulement :
 * l'argent hérité (origine sociale) et l'argent gagné (parcours).
 *
 * La personnalité n'apparaît volontairement pas ici : un trait de caractère
 * ne rend pas riche, il ne joue que sur les statistiques.
 *
 * L'écart est volontairement énorme : de 5 000 € pour un militant issu d'un
 * milieu modeste à 4 500 000 € pour une célébrité de grande bourgeoisie.
 * La fortune n'est pas une note sur dix, c'est un patrimoine, et les ordres
 * de grandeur du monde réel doivent se sentir.
 */
const MONEY = {
  sex: {
    female: 0,
    male: 0,
  },

  // Patrimoine familial. La grande bourgeoisie est de loin la plus riche :
  // la dynastie politique apporte du pouvoir davantage que de l'argent.
  origin: {
    modest:    5000,
    middle:    20000,
    dynasty:   400000,
    bourgeois: 3000000,
  },

  // Ce que la carrière a rapporté avant l'entrée en politique.
  background: {
    activism:   0,
    journalism: 25000,
    academia:   30000,
    civil:      50000,
    law:        80000,
    comms:      120000,
    business:   250000,
    celebrity:  1500000,
  },
};

/** Devise et formats d'affichage du capital. */
const CURRENCY = "EUR";
const MONEY_LOCALES = { fr: "fr-FR", en: "en-GB" };

function formatMoney(amount) {
  const locale = MONEY_LOCALES[document.documentElement.lang] || "fr-FR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ==========================================================================
   Partis politiques
   ========================================================================== */

/**
 * Six partis représentatifs d'un paysage politique occidental moyen.
 * Aucun ne correspond à un parti réel : ce sont des archétypes, rangés
 * de la gauche à la droite.
 *
 * POSITIONNEMENT (`axes`) : quatre axes notés de -100 à +100.
 *   social   : -100 progressisme      ↔  +100 conservatisme
 *   world    : -100 internationalisme ↔  +100 nationalisme
 *   economy  : -100 socialisme        ↔  +100 capitalisme
 *   power    : -100 autoritarisme     ↔  +100 laissez-faire
 *
 * DIFFICULTÉ (`difficulty`) : de 1 (voie praticable) à 5 (quasi impossible).
 * C'est la difficulté d'accéder au pouvoir PAR ce parti, indépendamment du
 * personnage : un grand parti de gouvernement mène au pouvoir par une route
 * connue, un parti extrême promet une traversée du désert. La compatibilité
 * juge la personne, la difficulté juge la route.
 *
 * COMPATIBILITÉ (`fit`) : ce que le parti pense du profil du personnage.
 * La table associe une origine sociale ou un parcours à un score, et la
 * compatibilité est la somme des deux (origine + parcours).
 *
 * Elle repose sur trois logiques distinctes qu'il ne faut pas confondre :
 *
 *   1. LA CLASSE. Les partis anticapitalistes se méfient de l'argent. La
 *      grande bourgeoisie et les affaires y sont un handicap, alors qu'ils
 *      sont un atout dans les partis pro-marché.
 *
 *   2. L'ÉTABLISSEMENT. C'est ce qui joue sur la dynastie politique, et non
 *      la gauche ou la droite : les dynasties de gauche existent (les Benn,
 *      les Papandréou, les Gandhi). Un héritier est bien accueilli dans les
 *      partis de gouvernement, de gauche comme de droite, et se fait
 *      reprocher son nom dans les partis antisystème, des néo-marxistes aux
 *      néo-fascistes.
 *
 *   3. LE MÉTIER. Le militantisme parle aux partis de mouvement, les
 *      affaires aux partis de marché, l'université aux partis d'idées, la
 *      célébrité aux partis qui se jouent dans les médias.
 */
const PARTIES = {
  radical_left: {
    axes: { social: -85, world: -70, economy: -90, power: -65 },
    difficulty: 4,
    fit: {
      modest: +3, middle: +1, bourgeois: -3, dynasty: -1,
      activism: +4, journalism: +1, academia: +2, civil: -2,
      law: -1, comms: -3, business: -4, celebrity: -2,
    },
  },

  socdem: {
    axes: { social: -40, world: -50, economy: -28, power: 0 },
    difficulty: 2,
    fit: {
      modest: +2, middle: +2, bourgeois: -1, dynasty: +1,
      activism: +2, journalism: +1, academia: +2, civil: +2,
      law: +1, comms: 0, business: -2, celebrity: -1,
    },
  },

  centrists: {
    axes: { social: -10, world: -60, economy: +25, power: +10 },
    difficulty: 1,
    fit: {
      modest: 0, middle: +2, bourgeois: +1, dynasty: +2,
      activism: -1, journalism: +1, academia: +1, civil: +3,
      law: +2, comms: +1, business: +1, celebrity: -1,
    },
  },

  liberals: {
    axes: { social: -25, world: -55, economy: +75, power: +60 },
    difficulty: 3,
    fit: {
      modest: -1, middle: +1, bourgeois: +2, dynasty: +1,
      activism: -2, journalism: 0, academia: +1, civil: 0,
      law: +2, comms: +1, business: +3, celebrity: 0,
    },
  },

  conservatives: {
    axes: { social: +60, world: 0, economy: +50, power: -20 },
    difficulty: 2,
    fit: {
      modest: 0, middle: +1, bourgeois: +2, dynasty: +2,
      activism: -2, journalism: 0, academia: 0, civil: +2,
      law: +2, comms: 0, business: +2, celebrity: -1,
    },
  },

  identitarians: {
    axes: { social: +85, world: +90, economy: -10, power: -45 },
    difficulty: 4,
    fit: {
      modest: +3, middle: +1, bourgeois: -1, dynasty: -2,
      activism: 0, journalism: +1, academia: -3, civil: -2,
      law: 0, comms: +1, business: 0, celebrity: +3,
    },
  },
};

/** Ordre d'affichage des axes dans l'interface. */
const AXES = ["social", "world", "economy", "power"];

/**
 * Paliers de compatibilité, du meilleur au pire. Le premier dont le seuil
 * est atteint gagne.
 */
const FIT_LEVELS = [
  { min: 4, key: "fit_natural", cls: "fit-natural" },
  { min: 1, key: "fit_credible", cls: "fit-credible" },
  { min: -3, key: "fit_uphill", cls: "fit-uphill" },
  { min: -Infinity, key: "fit_hostile", cls: "fit-hostile" },
];

/** Somme la compatibilité d'un parti avec l'origine et le parcours choisis. */
function computeFit(partyKey, choices) {
  const table = PARTIES[partyKey].fit;
  return (table[choices.origin] || 0) + (table[choices.background] || 0);
}

function fitLevel(score) {
  return FIT_LEVELS.find((level) => score >= level.min);
}

/* ==========================================================================
   Générateur de noms
   ========================================================================== */

/**
 * Les listes de prénoms et de noms sont dans js/names.data.js, qui doit être
 * chargé avant ce fichier. Ici, seulement la façon de les assembler.
 */

/** Longueur maximale d'un nom, identique au champ de create.html. */
const NAME_MAX_LENGTH = 32;

/** Tire un élément au hasard dans une liste. */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Tire un nom de famille : simple la plupart du temps, parfois à particule,
 * parfois composé. Les deux formes rares sont réglées dans names.data.js.
 */
function randomSurname() {
  if (Math.random() < NAME_DATA.rates.particle) {
    return pickRandom(NAME_DATA.surnames_particle);
  }

  const first = pickRandom(NAME_DATA.surnames);
  if (Math.random() >= NAME_DATA.rates.double) return first;

  let second = pickRandom(NAME_DATA.surnames);
  for (let i = 0; i < 5 && second === first; i++) {
    second = pickRandom(NAME_DATA.surnames);
  }

  return first + "-" + second;
}

/** Compose un nom complet cohérent avec le sexe sélectionné. */
function randomName(sex) {
  const firstName = pickRandom(sex === "male" ? NAME_DATA.male : NAME_DATA.female);
  const full = firstName + " " + randomSurname();

  // Trop long pour le champ du formulaire : on retombe sur un nom simple.
  if (full.length > NAME_MAX_LENGTH) {
    return firstName + " " + pickRandom(NAME_DATA.surnames);
  }

  return full;
}

/* ==========================================================================
   Calculs partagés
   ========================================================================== */

/** Groupes de statistiques, dans l'ordre d'affichage de la fiche. */
const STAT_GROUPS = [
  { scope: "personal", labelKey: "group_personal",
    stats: ["charisme", "eloquence", "energie", "sangfroid"] },
  { scope: "external", labelKey: "group_external",
    stats: ["reseau", "notoriete", "reputation", "credibilite"] },
];

/** Additionne les modificateurs des choix courants sur les stats de base. */
function computeStats(choices) {
  const stats = { ...BASE_STATS };

  const applique = (mods) => {
    if (!mods) return;
    Object.entries(mods).forEach(([stat, delta]) => { stats[stat] += delta; });
  };

  Object.entries(choices).forEach(([field, value]) => {
    applique(STAT_MODIFIERS[field] && STAT_MODIFIERS[field][value]);
  });

  // Le caractère est un trait : ses points sont écrits avec lui.
  const caractere = typeof TRAIT_DATA !== "undefined" && TRAIT_DATA[choices.personality];
  applique(caractere && caractere.stats);

  Object.keys(stats).forEach((stat) => {
    stats[stat] = Math.max(STAT_MIN, Math.min(STAT_MAX, stats[stat]));
  });

  return stats;
}

/** Additionne le capital apporté par l'origine et le parcours. */
function computeMoney(choices) {
  const total = Object.entries(choices).reduce((sum, [field, value]) => {
    const amount = MONEY[field] && MONEY[field][value];
    return sum + (amount || 0);
  }, 0);

  return Math.max(0, total);
}


/* ==========================================================================
   Le tirage de départ
   ==========================================================================
   On ne choisit ni son visage, ni sa voix, ni sa santé, ni sa mémoire. Le jeu
   distribue DEUX traits avant la première décision, sur sa propre page, pour
   que personne ne puisse passer à côté.

   Le tirage n'est pas neutre. Une main équilibrée, un atout et une marque,
   reste la plus probable : c'est la situation la plus intéressante à jouer.
   Mais le sort peut aussi gâter quelqu'un ou l'accabler, et ces parties-là
   existent : c'est ce qui rend la chance réelle.

   Les deux traits viennent toujours d'axes différents : on ne peut pas être
   grand et petit, ni avoir une voix de radio et un cheveu sur la langue.
   ========================================================================== */

const DRAW_MIX = [
  { key: "equilibre", weight: 56, kinds: ["asset", "mark"] },
  { key: "chanceux", weight: 22, kinds: ["asset", "asset"] },
  { key: "difficile", weight: 22, kinds: ["mark", "mark"] },
];

/** Tire dans une liste, chaque entrée portant son poids. */
function pickWeighted(list, poids) {
  const total = list.reduce((sum, item) => sum + poids(item), 0);
  if (!total) return null;

  let draw = Math.random() * total;
  for (const item of list) {
    draw -= poids(item);
    if (draw <= 0) return item;
  }
  return list[list.length - 1];
}

/** Renvoie la main tirée : le type de main et les deux traits. */
function drawBirthTraits() {
  const pool = Object.keys(TRAIT_DATA).filter((id) => TRAIT_DATA[id].birth);
  const mix = pickWeighted(DRAW_MIX, (m) => m.weight);

  const traits = [];
  const axes = [];

  mix.kinds.forEach((kind) => {
    const candidats = pool.filter((id) =>
      TRAIT_DATA[id].kind === kind && !axes.includes(TRAIT_DATA[id].axis));
    const choisi = pickWeighted(candidats, (id) => TRAIT_DATA[id].birth);
    if (!choisi) return;

    traits.push(choisi);
    axes.push(TRAIT_DATA[choisi].axis);
  });

  return { mix: mix.key, traits };
}

/* ==========================================================================
   Persistance entre les pages
   ========================================================================== */

const CHARACTER_KEY = "pm-character";

/** Enregistre le personnage pour que party.html puisse le relire. */
function saveCharacter(choices) {
  localStorage.setItem(CHARACTER_KEY, JSON.stringify(choices));
}

/** Relit le personnage, ou renvoie null s'il n'y en a pas. */
function loadCharacter() {
  try {
    const character = JSON.parse(localStorage.getItem(CHARACTER_KEY));

    // Le choix « Autre » a existé : une sauvegarde d'alors retombe sur femme.
    if (character && character.sex !== "male") character.sex = "female";

    return character;
  } catch (error) {
    return null;
  }
}

/* ==========================================================================
   Fiche du candidat (colonne de droite, commune aux deux pages)
   ========================================================================== */

/** Construit les jauges de statistiques. Appelé à chaque changement de langue. */
function buildStatRows() {
  const host = document.getElementById("sheet-stat-groups");
  if (!host) return;

  /* ON NE RECONSTRUIT PAS CE QUI EST DÉJÀ LÀ.
     renderAll() appelle cette fonction à chaque tour, et réécrire l'innerHTML
     fabrique huit barres NEUVES : elles naissent à zéro, puis renderStats()
     leur pose leur largeur, et la transition CSS les fait toutes se remplir
     en glissant. Le joueur voyait donc ses statistiques SE RECHARGER à chaque
     carte, comme un écran de chargement, alors que la seule chose à montrer
     est le déplacement de celles qui ont bougé — ce que font déjà très bien
     les deux jauges au-dessus, qui vivent dans le HTML et ne sont jamais
     recréées.
     On ne refait donc la structure que si elle manque ou si la langue a
     changé, les libellés étant traduits ici. Les valeurs, elles, sont posées
     à chaque tour par renderStats(). */
  // On teste innerHTML et non children : le harnais de non-régression joue
  // avec un faux DOM qui n'a pas de collection d'enfants, et lire .length
  // dessus faisait planter le premier clic de chaque carrière.
  if (host.dataset.lang === currentLang && host.innerHTML) return;
  host.dataset.lang = currentLang;

  host.innerHTML = STAT_GROUPS.map((group) =>
    '<p class="sheet-group-title' +
      (group.scope === "external" ? " sheet-group-title-ext" : "") + '">' +
      t(group.labelKey) +
    "</p>" +
    '<div class="stat-rows" data-stat-scope="' + group.scope + '">' +
      group.stats.map((stat) =>
        '<div class="stat-row" data-stat="' + stat + '">' +
          '<span class="stat-row-name">' + t("stat_" + stat) + "</span>" +
          '<span class="stat-bar"><span class="stat-bar-fill"></span></span>' +
          '<span class="stat-row-value">0</span>' +
        "</div>"
      ).join("") +
    "</div>"
  ).join("");
}

/** Remplit la fiche : nom, résumé, jauges et fortune. */
function renderCharacterSheet(choices) {
  const stats = computeStats(choices);

  document.getElementById("sheet-name").textContent =
    choices.name || t("sheet_name_empty");

  document.getElementById("sheet-meta").textContent =
    t("sex_" + choices.sex) + " · " + t("start_age") + " · " + t("origin_" + choices.origin);

  document.getElementById("sheet-meta-2").textContent =
    t("bg_" + choices.background) + " · " + t("perso_" + choices.personality);

  document.querySelectorAll(".stat-row").forEach((row) => {
    const value = stats[row.getAttribute("data-stat")];
    if (value === undefined) return;

    row.querySelector(".stat-bar-fill").style.width = (value / STAT_MAX) * 100 + "%";
    row.querySelector(".stat-row-value").textContent = value;
  });

  document.getElementById("sheet-money").textContent = formatMoney(computeMoney(choices));
}
