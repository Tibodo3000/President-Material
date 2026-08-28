/*
 * President Material — L'ARGENT.
 *
 * Les postes où l'on investit et ce qu'ils protègent, ce qui rentre et ce qui
 * sort chaque année, ce qu'une campagne a coûté et qui vient le compter, et
 * la fortune qui dort — celle qu'on finit toujours par devoir expliquer.
 *
 * IL S'APPELLE argent.js ET PAS budget.js : js/game/render/budget.js dessine
 * le budget, ce fichier-ci le calcule. Deux fichiers du même nom dans le même
 * arbre, c'est une confusion par jour.
 *
 * La table des postes est dans js/budget.data.js, les chiffres dans
 * js/balance.js.
 */
/* ==========================================================================
   Le budget
   ==========================================================================
   Chaque saison, l'argent rentre et sort tout seul. Ce qui rentre : une
   indemnité liée à la fonction, le rendement du patrimoine, les revenus
   occultes des traits. Ce qui sort : un train de vie qu'on ne choisit pas,
   et des postes d'investissement qu'on choisit entièrement.

   C'est là que la fortune cesse d'être un chiffre décoratif : elle achète
   de la popularité et de la cote, année après année, à condition de pouvoir
   tenir la dépense. Quand le compte est vide, le moteur coupe lui-même.

   Les montants sont dans js/budget.data.js.
   ========================================================================== */

function investments(s) {
  return s.investments || (s.investments = {});
}

function investLevel(s, key) {
  return investments(s)[key] || 0;
}

/**
 * La définition du palier atteint sur un poste. Le palier zéro compte lui
 * aussi : il faut bien se loger quelque part, même au plus bas de l'échelle.
 */
function investSpec(s, key) {
  const def = BUDGET_DATA.investments[key];
  return def ? def.levels[investLevel(s, key)] : null;
}

function investSum(s, read) {
  return Object.keys(BUDGET_DATA.investments).reduce((total, key) => {
    const spec = investSpec(s, key);
    return spec ? total + (read(spec) || 0) : total;
  }, 0);
}

/**
 * Part de la BAISSE d'une jauge que les dépenses évitent. C'est la façon
 * dont l'argent agit désormais : il n'achète pas de la popularité, il
 * empêche celle qu'on a gagnée de refluer. Sans communication, tout ce
 * qu'un événement vous rapporte finit par redescendre ; avec une agence,
 * cela met beaucoup plus longtemps.
 */
function investHold(s, gauge) {
  return Math.min(0.75, investSum(s, (spec) => spec.hold && spec.hold[gauge]));
}

/** Part du risque judiciaire absorbée par les avocats, plafonnée. */
function investProtect(s) {
  return Math.min(0.7, investSum(s, (spec) => spec.protect));
}

/**
 * CE QUI REND LE RISQUE JOUABLE.
 *
 * Un pari raté coûtait toujours plein tarif, et comme les dés du jeu tournent
 * autour de pile ou face, parier était perdant presque à tous les coups :
 * dix-huit pour cent des choix à dés battaient l'option sûre du même
 * événement. Un joueur rationnel ne prenait donc jamais de risque, ce qui
 * n'est pas une façon de raconter une carrière politique.
 *
 * Ce n'est pas le moteur qui répare ça, c'est le service de presse. Une
 * bourde se paie plein tarif quand personne ne travaille pour vous ; avec une
 * agence derrière soi, elle se paie moins cher. L'audace s'achète, ce qui est
 * exactement ce que le jeu raconte par ailleurs.
 *
 * N'amortit que les jauges d'un pari perdu : ni l'argent, ni les
 * statistiques, ni les marques. Aucun attaché de presse n'a jamais fait
 * disparaître une amende ni un procès-verbal.
 */
function investNerve(s) {
  return Math.min(0.6, investSum(s, (spec) => spec.nerve));
}

/**
 * Change le niveau d'un poste. On ne peut pas monter un niveau qu'on n'a
 * pas les moyens de payer une seule année : la première échéance tombe
 * tout de suite.
 */
function setInvestment(s, key, delta) {
  const def = BUDGET_DATA.investments[key];
  if (!def) return false;

  const level = Math.max(0, Math.min(def.levels.length - 1, investLevel(s, key) + delta));
  if (level === investLevel(s, key)) return false;
  if (delta > 0 && s.money < def.levels[level].cost) return false;

  investments(s)[key] = level;
  return true;
}

/* ---------- Ce qui rentre, ce qui sort ---------- */

function annualIncome(s) {
  return {
    salary: BUDGET_DATA.salaries[s.position] || 0,
    wealth: Math.round(Math.max(0, s.money) * BUDGET_DATA.wealth_yield),
    // Les traits déclarent un revenu occulte par SEMESTRE, et ce chiffre est
    // celui que la fiche affiche : on le passe en annuel ici, et applyBudget
    // le redécoupe en saisons. Découper l'année autrement ne change donc rien
    // à ce que le trait rapporte dans l'année.
    hidden: traitSum(s, (d) => d.income) * 2,
  };
}

/**
 * Ce qui sort. La vie courante et les impôts prennent une part de ce qui
 * rentre plutôt qu'un montant fixe : on ne vit pas de la même façon avec
 * trente mille euros par an et avec deux cent mille. Le milieu d'origine
 * ajoute son multiplicateur, parce qu'on dépense d'abord comme on a été
 * élevé.
 */
function annualExpenses(s) {
  const income = annualIncome(s);
  const base = Math.max(
    BUDGET_DATA.lifestyle_floor,
    (income.salary + income.wealth) * BUDGET_DATA.lifestyle_rate
  );
  const lifestyle = Math.round(base * (BUDGET_DATA.origin_lifestyle[s.character.origin] || 1));

  const posts = {};
  Object.keys(BUDGET_DATA.investments).forEach((key) => {
    const spec = investSpec(s, key);
    if (spec && spec.cost) posts[key] = spec.cost;
  });

  return { lifestyle, posts };
}

function annualBalance(s) {
  const income = annualIncome(s);
  const expenses = annualExpenses(s);
  const out = expenses.lifestyle + Object.values(expenses.posts).reduce((a, b) => a + b, 0);
  return income.salary + income.wealth + income.hidden - out;
}

/**
 * Un trimestre de comptabilité. Tout est écrit par an dans js/budget.data.js
 * et divisé ici : c'est le seul endroit où la durée d'un tour touche l'argent.
 * Si le solde vide le compte, on descend le poste le plus cher d'un niveau :
 * personne ne finance une agence de communication avec un découvert.
 */
function applyBudget(s) {
  const before = s.money;
  s.money = Math.max(0, s.money + Math.round(annualBalance(s) / TURNS_PER_YEAR));

  if (s.money > 0 || annualBalance(s) >= 0) return null;

  const worst = Object.keys(BUDGET_DATA.investments)
    .filter((key) => investLevel(s, key) > 0)
    .sort((a, b) => investSpec(s, b).cost - investSpec(s, a).cost)[0];

  if (!worst) return before > 0 ? { broke: true } : null;

  setInvestment(s, worst, -1);
  return { broke: true, cut: worst };
}

/* ==========================================================================
   CE QU'UNE CAMPAGNE A COÛTÉ, ET QUI LE COMPTE
   ==========================================================================
   L'argent achetait des points de sondage à prix fixe et sans risque : une
   salle remplie de cars, un chiffrage écrit par un cabinet ami, un sondage
   commandé chez soi. Le choix payant était donc toujours le bon, et il n'y
   avait rien à arbitrer. Deux corrections, et elles vont ensemble.

   La première est dans les cartes : ce qu'on paie est un ESSAI, pas un
   résultat. L'argent part dans les deux branches, y compris celle où le
   journaliste compte les cars sur le parking.

   La seconde est ici. Une campagne se solde, et le solde se lit après le
   vote. On additionne ce qui sort pendant la campagne, et au-delà de ce
   qu'un compte de campagne absorbe sans qu'on le regarde, la commission
   demande à voir les pièces. Le joueur ne perd donc pas au moment où il
   dépense, ce qui serait une punition : il prend une dette qui se présente
   plus tard, quand la campagne est finie et qu'il n'a plus rien à en tirer.
   ========================================================================== */

/**
 * Ce qui sort pendant une campagne s'inscrit sur son compte. On ne trie pas
 * les dépenses : tout ce qui part entre l'entrée en campagne et le
 * dépouillement est de l'argent de campagne, et c'est très exactement ce que
 * la commission dirait.
 */
function noteCampaignSpend(s, amount) {
  if (!(amount > 0)) return;
  const compte = s.campaign || s.race;
  if (compte) compte.spent = (compte.spent || 0) + amount;
}

/**
 * Le plancher, c'est ce qu'un compte absorbe sans qu'on lève la tête. Le
 * plafond, c'est le montant au-delà duquel on ne passe plus. Entre les deux,
 * la probabilité monte tout droit : deux options payantes dans une
 * présidentielle ne se voient pas, quatre se voient, six se voient de loin.
 *
 * Les avocats à l'année comptent, comme pour tout le reste : c'est à cela
 * qu'ils servent, et cela donne une raison de plus de tenir la ligne
 * juridique du budget.
 */
const CAMPAIGN_ACCOUNTS = { floor: 200000, full: 700000 };
const RACE_ACCOUNTS = { floor: 30000, full: 90000 };

function accountsRisk(s, spent, seuils) {
  const excedent = spent - seuils.floor;
  if (excedent <= 0) return 0;
  const p = Math.min(0.8, (excedent / (seuils.full - seuils.floor)) * 0.8);
  return p * (1 - investProtect(s));
}

/**
 * Le soir du dépouillement, on ferme le compte. Deux drapeaux le déplacent :
 * une campagne dont les comptes ont été repris tient beaucoup mieux, une
 * campagne dont on a décidé de voir plus tard tient moins bien.
 */
function auditCampaignAccounts(s, seuils) {
  const compte = s.campaign || s.race;
  if (!compte || !compte.spent) return;

  let risque = accountsRisk(s, compte.spent, seuils);
  if (s.flags.comptesRelus) risque *= 0.35;
  if (s.flags.comptesForces) risque *= 1.5;

  s.flags.comptesRelus = false;
  s.flags.comptesForces = false;

  if (pendingChains(s).some((entry) => entry.id === "comptes_campagne")) return;
  if (Math.random() < risque) scheduleChain(s, "comptes_campagne");
}

/* ==========================================================================
   La fortune qui dort
   ==========================================================================
   L'argent ne coûtait rien à garder. Une carrière qui n'achetait rien
   terminait avec près d'un million d'euros dormant sur un compte, sans
   qu'aucun événement, aucun journaliste et aucun juge ne s'en aperçoive.
   Comme rien ne pressait de le dépenser, le dépenser était toujours gratuit :
   c'est la vraie raison pour laquelle il fallait toujours payer, dans tous
   les événements.

   Un patrimoine ne se cache pas éternellement. Passé le niveau où un élu
   peut expliquer sa fortune par son indemnité, quelqu'un finit par poser la
   question — la presse, la Haute Autorité, un adversaire qui sait compter.
   L'argent propre attire un contrôle qu'on passe ; l'argent sale attire une
   enquête qu'on ne passe pas toujours.
   ========================================================================== */


/**
 * Probabilité PAR AN qu'on regarde vos comptes de près. wealthAttention() la
 * ramène à la durée d'un tour.
 *
 * On ne compte pas la fortune, on compte L'ENRICHISSEMENT. Personne n'a
 * jamais reproché à un héritier d'avoir hérité : ce qu'on lui demande, c'est
 * d'où vient ce qu'il n'avait pas avant. Sans cette distinction, un candidat
 * né riche était soupçonné dès le premier tour pour de l'argent gagné avant
 * son entrée en politique, ce qui n'a aucun sens.
 *
 * L'argent propre attire un contrôle, qu'on passe et dont on se vante ;
 * l'argent sale attire un juge. Les avocats à l'année valent dans les deux
 * cas : c'est très exactement à cela qu'ils servent.
 */
function wealthRisk(s) {
  const gagné = Math.max(0, s.money - (s.startMoney || 0) - WEALTH_EXPLAINABLE);
  if (!gagné && !s.flags.dirtyMoney) return 0;

  let p = (gagné / 1000000) * 0.04;
  if (s.flags.dirtyMoney) p = p * 3 + 0.024;
  return Math.min(0.10, p) * (1 - investProtect(s));
}

function wealthAttention(s) {
  const chain = s.flags.dirtyMoney ? "enquete_ouverte" : "patrimoine_declare";
  if (s.seen[chain]) return;
  if (pendingChains(s).some((entry) => entry.id === chain)) return;
  if (Math.random() < wealthRisk(s) * YEARS_PER_TURN) scheduleChain(s, chain);
}
