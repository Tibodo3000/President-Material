/*
 * President Material — traductions FR / EN et switch de langue.
 *
 * Tout le texte du site se modifie ici, dans l'objet `translations`.
 * Chaque clé correspond à un attribut data-i18n dans le HTML.
 * Les variantes data-i18n-placeholder, data-i18n-title et data-i18n-aria
 * traduisent respectivement le texte grisé d'un champ, son infobulle et
 * son libellé pour les lecteurs d'écran.
 */

const translations = {

  /* ===================== FRANÇAIS ===================== */
  fr: {
    /* -- Accueil -- */
    brand_sub: "Jeu de stratégie politique",
    desc_1:
      "Un objectif : la présidence de la République.",
    desc_2:
      "Construisez votre carrière, gagnez vos élections, choisissez vos alliés et vos combats. Aucune ascension ne se ressemble.",
    cta_start: "Commencez votre ascension",
    footer_text: "© 2026 President Material",

    /* Titres affichés dans l'onglet du navigateur */
    page_title_home: "President Material",
    page_title_create: "Création de personnage · President Material",
    page_title_party: "Choix du parti · President Material",
    page_title_game: "En campagne · President Material",

    /* Fil des étapes */
    step_character: "Personnage",
    step_party: "Parti",
    cta_continue: "Choisir un parti",
    back_to_character: "Revenir au personnage",

    /* -- Boucle de jeu -- */
    season_spring: "Printemps",
    season_autumn: "Automne",
    year_label: "Année",

    pos_militant: "Militant",
    pos_conseiller: "Conseiller municipal",
    pos_maire: "Maire",
    pos_euro: "Député européen",
    pos_depute: "Député",
    pos_ministre: "Ministre",
    pos_chef: "Chef du parti",
    pos_president: "Président de la République",

    elec_municipales: "Municipales",
    elec_europeennes: "Européennes",
    elec_legislatives: "Législatives",
    elec_congres: "Congrès du parti",
    elec_presidentielle: "Présidentielle",

    label_popularity: "Popularité",
    label_standing: "Cote au parti",
    label_next: "Prochaine échéance",
    label_president: "À l'Élysée",
    label_traits: "Traits",
    traits_none: "Rien encore",
    label_journal: "Journal",
    journal_empty: "Rien à raconter pour l'instant.",
    tab_landscape: "Rapport de force",
    tab_budget: "Budget",
    budget_income: "Revenus annuels",
    budget_expenses: "Dépenses annuelles",
    budget_salary: "Revenu d'activité",
    budget_wealth: "Rendement du patrimoine",
    budget_hidden: "Revenus non déclarés",
    budget_lifestyle: "Vie courante et impôts",
    budget_balance: "Solde annuel",
    budget_per_year: "par an",
    budget_next: "Palier suivant :",
    budget_fx_hold: "baisse ralentie de",
    budget_fx_protect: "Risque judiciaire évité",
    force_ruling: "Au pouvoir",
    force_ally: "Allié",
    fx_join: "Vous rejoignez",
    fx_alliance: "Alliance",
    age_short: "ans",
    president_vacant: "Vacant",
    label_poll: "Intentions de vote",
    label_poll_short: "Sondage",
    label_campaign: "Campagne présidentielle",
    label_round1: "Premier tour",
    label_round2: "Second tour",
    label_points: "pts",

    /* Conséquences affichées une fois le choix fait */
    choice_unlocked: "Ouvert par",
    choice_risky: "Très risqué",
    fx_end: "Fin de carrière",
    fx_strike_first: "On le remarque :",
    fx_strike_last: "Encore une et c'est une réputation :",
    fx_energy_cap: "Plafond d'énergie",
    trait_family_physique: "Physique",
    trait_family_talent: "Talents",
    trait_family_appareil: "Rapport à l'appareil",
    trait_family_reputation: "Réputation",
    trait_family_affaires: "Affaires",
    trait_fx_soften: "Mauvaises nouvelles amorties de",
    trait_fx_rejection: "Électeurs qui vous refusent au second tour",
    trait_fx_income: "par semestre",
    trait_fx_risk: "Risque d'enquête",
    flag_dirtyMoney: "Argent sale",
    flag_investigated: "Enquête ouverte",
    flag_onTrial: "Mise en examen",
    flag_carefulHealth: "Santé surveillée",
    flag_frailHealth: "Santé fragile",
    step_of: "Temps {n} sur {total}",
    term_first: "1er mandat",
    term_last: "2e mandat, non renouvelable",
    deadline_soon: "imminente",

    game_continue: "Continuer",
    game_run: "Se présenter",
    game_decline: "Renoncer",
    game_lobby: "Travailler l'appareil",
    note_exhausted: "Épuisé, vous n'êtes pas en état de tout envisager.",
    game_retire: "Prendre sa retraite",
    game_retire_confirm: "Mettre fin à votre carrière politique ?",
    game_restart: "Nouvelle partie",

    /* Les titres et les textes de fin sont dans js/endings.data.js */
    end_recap_years: "Années en politique",
    end_recap_peak: "Plus haute fonction",
    end_recap_money: "Patrimoine final",
    end_recap_traits: "Ce qu'on retiendra de vous",

    /* -- Création de personnage -- */
    create_eyebrow: "Dossier du candidat",
    create_title: "Création de personnage",
    create_sub:
      "Votre personnage a trente ans et tout à construire. Ses origines et son parcours déterminent ses atouts de départ, sans qu'aucun profil ne l'emporte vraiment sur les autres.",

    field_identity: "Identité",
    label_name: "Nom du personnage",
    placeholder_name: "Entrez un nom…",
    random_name_label: "Générer un nom au hasard",
    label_sex: "Sexe",
    sex_female: "Femme",
    sex_male: "Homme",
    start_age: "30 ans",


    field_origin: "Origine sociale",
    origin_modest: "Milieu modeste",
    origin_modest_desc:
      "Vous avez grandi dans une famille où les fins de mois se comptaient. Vous ne devez votre parcours qu'à votre propre travail.",
    origin_middle: "Classe moyenne",
    origin_middle_desc:
      "Vous avez suivi des études correctes dans une famille sans histoires. Votre milieu ne vous ouvre aucune porte, mais il ne vous en ferme aucune.",
    origin_bourgeois: "Grande bourgeoisie",
    origin_bourgeois_desc:
      "Vous avez grandi dans l'aisance, au milieu des bonnes adresses et des bonnes relations. On vous accorde une attention que les autres doivent mériter.",
    origin_dynasty: "Dynastie politique",
    origin_dynasty_desc:
      "Votre famille compte déjà des élus et le public connaît votre nom. Cet héritage vous ouvre des portes autant qu'il vous expose.",

    field_background: "Parcours",
    bg_law: "Droit",
    bg_law_desc:
      "Vous avez fait du droit et vous en avez vécu. Le métier apprend à argumenter et à ne rien laisser paraître.",
    bg_business: "Monde de l'entreprise",
    bg_business_desc:
      "Vous avez travaillé en entreprise, du côté où l'on décide. Vous y avez appris ce que valent un chiffre et une poignée de main.",
    bg_journalism: "Journalisme",
    bg_journalism_desc:
      "Vous avez travaillé dans une rédaction. Vous avez vu la politique de près, sans jamais y être.",
    bg_activism: "Militantisme",
    bg_activism_desc:
      "Vous militez depuis toujours et vous n'avez jamais rien fait d'autre. Des réunions, des tracts, des campagnes perdues.",
    bg_civil: "Haute fonction publique",
    bg_civil_desc:
      "Vous êtes haut fonctionnaire. Vous avez vu l'État de l'intérieur, là où les décisions se préparent.",
    bg_academia: "Université",
    bg_academia_desc:
      "Vous avez enseigné et publié. Un monde où l'on discute des idées plus qu'on ne les applique.",
    bg_celebrity: "Personnalité des réseaux",
    bg_celebrity_desc:
      "Vous vous êtes fait un nom en ligne. Une audience vous suit, sans que personne sache encore ce qu'elle vaut.",
    bg_comms: "Communication",
    bg_comms_desc:
      "Vous avez vendu de l'image et des éléments de langage. Un métier utile qui laisse peu de traces glorieuses.",

    field_personality: "Personnalité",
    perso_hardworking: "Acharné",
    perso_hardworking_desc:
      "Vous commencez vos journées avant tout le monde et vous les finissez après. Le travail vous tient lieu de méthode.",
    perso_charming: "Charmeur",
    perso_charming_desc:
      "Vous mettez les gens à l'aise en quelques minutes. Vos adversaires y voient une technique, vos proches une qualité.",
    perso_clever: "Brillant",
    perso_clever_desc:
      "Vous comprenez vite et vous formulez mieux encore. Les dossiers les plus techniques ne vous effraient pas.",
    perso_provocative: "Provocateur",
    perso_provocative_desc:
      "Vous dites ce que les autres évitent de dire. Les caméras vous suivent et les états majors s'en inquiètent.",
    perso_principled: "Intègre",
    perso_principled_desc:
      "Vous refusez les arrangements qui font gagner du temps. Cette réputation vous précède, pour le meilleur et pour le pire.",
    perso_calculating: "Calculateur",
    perso_calculating_desc:
      "Vous pensez toujours au coup d'après. Peu de gens savent ce que vous préparez, y compris dans votre camp.",

    /* -- Partis -- */
    field_party: "Parti",
    party_eyebrow: "Entrée en politique",
    party_title: "Choix du parti",
    party_sub:
      "Choisissez le parti dans lequel vous vous lancez. Ce ne sera pas forcément celui dans lequel vous finirez.",

    party_radical_left: "Gauche radicale",
    party_of_radical_left: "de la Gauche radicale",
    party_the_radical_left: "la Gauche radicale",
    party_radical_left_desc:
      "Rupture avec le capitalisme, redistribution massive et méfiance profonde envers les institutions établies.",
    party_socdem: "Sociaux-démocrates",
    party_of_socdem: "des Sociaux-démocrates",
    party_the_socdem: "les Sociaux-démocrates",
    party_socdem_desc:
      "Un État régulateur et protecteur, sans remettre en cause l'économie de marché.",
    party_centrists: "Centristes",
    party_of_centrists: "des Centristes",
    party_the_centrists: "les Centristes",
    party_centrists_desc:
      "Ni à gauche ni à droite, la réforme mesurée et le refus affiché des extrêmes.",
    party_liberals: "Libéraux",
    party_of_liberals: "des Libéraux",
    party_the_liberals: "les Libéraux",
    party_liberals_desc:
      "Liberté économique, ouverture des marchés et un État qui se mêle le moins possible du reste.",
    party_conservatives: "Conservateurs",
    party_of_conservatives: "des Conservateurs",
    party_the_conservatives: "les Conservateurs",
    party_conservatives_desc:
      "L'ordre, la famille et la nation, avec une économie de marché pleinement assumée.",
    party_identitarians: "Droite identitaire",
    party_of_identitarians: "de la Droite identitaire",
    party_the_identitarians: "la Droite identitaire",
    party_identitarians_desc:
      "L'identité nationale comme boussole et l'immigration comme adversaire principal.",

    /* Noms des axes, utilisés quand le parti n'a pas de position tranchée */
    axis_social_name: "Société",
    axis_world_name: "Monde",
    axis_economy_name: "Économie",
    axis_power_name: "Pouvoir",

    /* Pôles des quatre axes de positionnement */
    axis_social_left: "Progressisme",
    axis_social_right: "Conservatisme",
    axis_world_left: "Internationalisme",
    axis_world_right: "Nationalisme",
    axis_economy_left: "Socialisme",
    axis_economy_right: "Capitalisme",
    axis_power_left: "Autoritarisme",
    axis_power_right: "Laissez-faire",

    /* Le français met une espace avant les deux-points, pas l'anglais. */
    colon: " : ",

    /* Paliers de compatibilité */
    fit_label: "Compatibilité",
    fit_natural: "Terrain naturel",
    fit_credible: "Crédible",
    fit_uphill: "Difficile",
    fit_hostile: "Presque impossible",

    /* Difficulté du chemin vers le pouvoir, propre à chaque parti */
    difficulty_label: "Difficulté",
    difficulty_1: "Faible",
    difficulty_2: "Modérée",
    difficulty_3: "Élevée",
    difficulty_4: "Très élevée",
    difficulty_5: "Extrême",

    /* -- Fiche personnage -- */
    sheet_label: "Fiche du candidat",
    sheet_name_empty: "Sans nom",
    cta_begin: "Commencer la partie",

    group_personal: "Caractère",
    group_external: "Influence",

    stat_charisme: "Charisme",
    stat_eloquence: "Éloquence",
    stat_energie: "Énergie",
    stat_sangfroid: "Sang froid",
    stat_reseau: "Réseau",
    stat_notoriete: "Notoriété",
    stat_reputation: "Réputation",

    money_label: "Fortune",

  },

  /* ===================== ENGLISH ===================== */
  en: {
    /* -- Landing -- */
    brand_sub: "Political strategy game",
    desc_1:
      "One goal: the presidency.",
    desc_2:
      "Build your career, win your elections, choose your allies and your battles. No two rises to power are the same.",
    cta_start: "Start your journey",
    footer_text: "© 2026 President Material",

    /* Titles shown in the browser tab */
    page_title_home: "President Material",
    page_title_create: "Character creation · President Material",
    page_title_party: "Choosing a party · President Material",
    page_title_game: "On the trail · President Material",

    /* Step indicator */
    step_character: "Character",
    step_party: "Party",
    cta_continue: "Choose a party",
    back_to_character: "Back to the character",

    /* -- Game loop -- */
    season_spring: "Spring",
    season_autumn: "Autumn",
    year_label: "Year",

    pos_militant: "Activist",
    pos_conseiller: "Local councillor",
    pos_maire: "Mayor",
    pos_euro: "Member of the European Parliament",
    pos_depute: "Member of Parliament",
    pos_ministre: "Minister",
    pos_chef: "Party leader",
    pos_president: "President",

    elec_municipales: "Local elections",
    elec_europeennes: "European elections",
    elec_legislatives: "Parliamentary elections",
    elec_congres: "Party congress",
    elec_presidentielle: "Presidential election",

    label_popularity: "Popularity",
    label_standing: "Party standing",
    label_next: "Next milestone",
    label_president: "In office",
    label_traits: "Traits",
    traits_none: "Nothing yet",
    label_journal: "Log",
    journal_empty: "Nothing to report yet.",
    tab_landscape: "Balance of power",
    tab_budget: "Budget",
    budget_income: "Annual income",
    budget_expenses: "Annual spending",
    budget_salary: "Earned income",
    budget_wealth: "Return on wealth",
    budget_hidden: "Undeclared income",
    budget_lifestyle: "Living costs and tax",
    budget_balance: "Annual balance",
    budget_per_year: "a year",
    budget_next: "Next tier:",
    budget_fx_hold: "decline slowed by",
    budget_fx_protect: "Legal risk avoided",
    force_ruling: "In office",
    force_ally: "Allied",
    fx_join: "You join",
    fx_alliance: "Alliance",
    age_short: "yrs",
    president_vacant: "Vacant",
    label_poll: "Voting intentions",
    label_poll_short: "Poll",
    label_campaign: "Presidential campaign",
    label_round1: "First round",
    label_round2: "Runoff",
    label_points: "pts",

    /* Consequences shown once the choice is made */
    choice_unlocked: "Open to you:",
    choice_risky: "Long shot",
    fx_end: "Career over",
    fx_strike_first: "People notice:",
    fx_strike_last: "One more and it sticks:",
    fx_energy_cap: "Energy ceiling",
    trait_family_physique: "Appearance",
    trait_family_talent: "Talents",
    trait_family_appareil: "Standing with the machine",
    trait_family_reputation: "Reputation",
    trait_family_affaires: "Money",
    trait_fx_soften: "Bad news softened by",
    trait_fx_rejection: "Voters who will never back you in the runoff",
    trait_fx_income: "every half-year",
    trait_fx_risk: "Risk of investigation",
    flag_dirtyMoney: "Dirty money",
    flag_investigated: "Under investigation",
    flag_onTrial: "Facing trial",
    flag_carefulHealth: "Health looked after",
    flag_frailHealth: "Frail health",
    step_of: "Stage {n} of {total}",
    term_first: "1st term",
    term_last: "2nd term, cannot run again",
    deadline_soon: "imminent",

    game_continue: "Continue",
    game_run: "Run",
    game_decline: "Stand aside",
    game_lobby: "Work the machine",
    note_exhausted: "Exhausted, you are in no state to consider everything.",
    game_retire: "Retire",
    game_retire_confirm: "End your political career?",
    game_restart: "New game",

    /* Les titres et les textes de fin sont dans js/endings.data.js */
    end_recap_years: "Years in politics",
    end_recap_peak: "Highest office",
    end_recap_money: "Final wealth",
    end_recap_traits: "What they will remember",

    /* -- Character creation -- */
    create_eyebrow: "Candidate file",
    create_title: "Character creation",
    create_sub:
      "Your character is thirty years old with everything still to build. Their origins and career set their starting advantages, though no profile really outranks the others.",

    field_identity: "Identity",
    label_name: "Character name",
    placeholder_name: "Enter a name…",
    random_name_label: "Generate a random name",
    label_sex: "Sex",
    sex_female: "Female",
    sex_male: "Male",
    start_age: "Age 30",


    field_origin: "Social origins",
    origin_modest: "Working class",
    origin_modest_desc:
      "You grew up in a household where the end of the month was counted carefully. You owe your position to your own work alone.",
    origin_middle: "Middle class",
    origin_middle_desc:
      "You went through decent schooling in an unremarkable family. Your background opens no doors, but it closes none either.",
    origin_bourgeois: "Upper class",
    origin_bourgeois_desc:
      "You grew up in comfort, among the right addresses and the right connections. People grant you an attention that others have to earn.",
    origin_dynasty: "Political dynasty",
    origin_dynasty_desc:
      "Your family already counts elected officials and the public knows your name. That inheritance opens doors as readily as it exposes you.",

    field_background: "Background",
    bg_law: "Law",
    bg_law_desc:
      "You studied law and made a living from it. The profession teaches you to argue and to give nothing away.",
    bg_business: "Corporate world",
    bg_business_desc:
      "You worked in the corporate world, on the side that decides. You learned there what a number and a handshake are worth.",
    bg_journalism: "Journalism",
    bg_journalism_desc:
      "You worked in a newsroom. You saw politics up close without ever being part of it.",
    bg_activism: "Activism",
    bg_activism_desc:
      "You have been an activist for as long as you can remember, and never did anything else. Meetings, leaflets, campaigns you lost.",
    bg_civil: "Senior civil service",
    bg_civil_desc:
      "You are a senior civil servant. You have seen the state from the inside, where decisions are prepared.",
    bg_academia: "Academia",
    bg_academia_desc:
      "You taught and published. A world where ideas are debated more than they are applied.",
    bg_celebrity: "Social media personality",
    bg_celebrity_desc:
      "You made a name for yourself online. An audience follows you, though nobody yet knows what it is worth.",
    bg_comms: "Communications",
    bg_comms_desc:
      "You sold image and talking points. A useful trade that leaves few glorious traces.",

    field_personality: "Personality",
    perso_hardworking: "Hardworking",
    perso_hardworking_desc:
      "You start your days before everyone else and finish them long after. Work serves as your method.",
    perso_charming: "Charming",
    perso_charming_desc:
      "You put people at ease within minutes. Your opponents call it a technique, those close to you call it a quality.",
    perso_clever: "Clever",
    perso_clever_desc:
      "You understand quickly and you put it better still. The most technical files do not frighten you.",
    perso_provocative: "Provocative",
    perso_provocative_desc:
      "You say what others avoid saying. The cameras follow you and the party leadership worries.",
    perso_principled: "Principled",
    perso_principled_desc:
      "You refuse the arrangements that save time. That reputation precedes you, for better and for worse.",
    perso_calculating: "Calculating",
    perso_calculating_desc:
      "You are always thinking one move ahead. Few people know what you are preparing, including on your own side.",

    /* -- Parties -- */
    field_party: "Party",
    party_eyebrow: "Entering politics",
    party_title: "Choosing a party",
    party_sub:
      "Choose the party you are starting out in. It will not necessarily be the one you end up in.",

    party_radical_left: "Radical left",
    party_of_radical_left: "the Radical Left",
    party_the_radical_left: "the Radical Left",
    party_radical_left_desc:
      "A break with capitalism, sweeping redistribution and deep distrust of established institutions.",
    party_socdem: "Social democrats",
    party_of_socdem: "the Social Democrats",
    party_the_socdem: "the Social Democrats",
    party_socdem_desc:
      "A regulating, protective state, without calling the market economy into question.",
    party_centrists: "Centrists",
    party_of_centrists: "the Centrists",
    party_the_centrists: "the Centrists",
    party_centrists_desc:
      "Neither left nor right, measured reform and an open refusal of the extremes.",
    party_liberals: "Liberals",
    party_of_liberals: "the Liberals",
    party_the_liberals: "the Liberals",
    party_liberals_desc:
      "Economic freedom, open markets and a state that interferes as little as possible elsewhere.",
    party_conservatives: "Conservatives",
    party_of_conservatives: "the Conservatives",
    party_the_conservatives: "the Conservatives",
    party_conservatives_desc:
      "Order, family and nation, with an unapologetic market economy.",
    party_identitarians: "Identitarian right",
    party_of_identitarians: "the Identitarian Right",
    party_the_identitarians: "the Identitarian Right",
    party_identitarians_desc:
      "National identity as the compass and immigration as the main adversary.",

    /* Axis names, used when a party has no clear position on that axis */
    axis_social_name: "Society",
    axis_world_name: "World",
    axis_economy_name: "Economy",
    axis_power_name: "Power",

    /* Poles of the four positioning axes */
    axis_social_left: "Progressivism",
    axis_social_right: "Conservatism",
    axis_world_left: "Internationalism",
    axis_world_right: "Nationalism",
    axis_economy_left: "Socialism",
    axis_economy_right: "Capitalism",
    axis_power_left: "Authoritarianism",
    axis_power_right: "Laissez-faire",

    /* English puts no space before a colon, unlike French. */
    colon: ": ",

    /* Compatibility tiers */
    fit_label: "Fit",
    fit_natural: "Natural home",
    fit_credible: "Credible",
    fit_uphill: "Uphill",
    fit_hostile: "Near impossible",

    /* Difficulty of the road to power, a property of each party */
    difficulty_label: "Difficulty",
    difficulty_1: "Low",
    difficulty_2: "Moderate",
    difficulty_3: "High",
    difficulty_4: "Very high",
    difficulty_5: "Extreme",

    /* -- Character sheet -- */
    sheet_label: "Candidate file",
    sheet_name_empty: "Unnamed",
    cta_begin: "Begin the game",

    group_personal: "Character",
    group_external: "Influence",

    stat_charisme: "Charisma",
    stat_eloquence: "Eloquence",
    stat_energie: "Energy",
    stat_sangfroid: "Composure",
    stat_reseau: "Network",
    stat_notoriete: "Fame",
    stat_reputation: "Reputation",

    money_label: "Wealth",

  },
};

const STORAGE_KEY = "pm-lang";
let currentLang = "fr";

/** Renvoie une chaîne traduite dans la langue active. */
function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

/** Traduit les attributs (placeholder, title, aria-label) d'un jeu d'éléments. */
function translateAttribute(dict, dataAttr, targetAttr) {
  document.querySelectorAll("[" + dataAttr + "]").forEach((el) => {
    const value = dict[el.getAttribute(dataAttr)];
    if (value !== undefined) el.setAttribute(targetAttr, value);
  });
}

function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;
  currentLang = lang;

  // Une clé absente laisserait le texte du HTML en place, donc mélangerait
  // les deux langues. On la signale plutôt que de la laisser passer.
  const missing = [];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = dict[key];
    if (value === undefined) missing.push(key);
    else el.textContent = value;
  });

  if (missing.length) {
    console.warn("[i18n] clés absentes du dictionnaire " + lang + " :", missing);
  }

  translateAttribute(dict, "data-i18n-placeholder", "placeholder");
  translateAttribute(dict, "data-i18n-title", "title");
  translateAttribute(dict, "data-i18n-aria", "aria-label");

  // Titre de l'onglet : chaque page déclare sa clé via <body data-page-title>.
  const titleKey = document.body.getAttribute("data-page-title");
  if (titleKey && dict[titleKey]) document.title = dict[titleKey];

  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
  });

  localStorage.setItem(STORAGE_KEY, lang);

  // Permet à la fiche personnage de se retraduire.
  document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

function getInitialLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) return saved;

  const browserLang = navigator.language.slice(0, 2);
  return translations[browserLang] ? browserLang : "fr";
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(getInitialLanguage());

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
  });
});
