/*
 * President Material — LE MOTEUR DES TRAITS.
 *
 * Ce que le personnage traîne avec lui : les traits durables, les marques
 * partielles qui n'accrochent qu'à la récidive, ce qu'ils donnent et
 * reprennent en statistiques, ce qu'ils tirent sur les deux jauges, et ce
 * qu'ils font tomber à chaque tour.
 *
 * La table des traits est dans js/traits.data.js ; ici, seulement les règles
 * qui la lisent. Les chiffres sont dans js/balance.js.
 */
/* ==========================================================================
   Traits
   ==========================================================================
   Les statistiques disent ce que vaut le personnage, les traits disent ce
   qu'on lui reproche et ce qu'on lui reconnaît. Ils viennent des choix, ne
   s'usent pas, et pèsent sur toute la suite de la partie : cibles des jauges,
   jets de dés, forme physique, second tour de la présidentielle.

   Leur définition est dans js/traits.data.js.
   ========================================================================== */

function traitsOf(s) {
  return s.traits || (s.traits = []);
}

/**
 * LES ÉCARTS.
 *
 * Une réputation ne se fait pas en une fois. Se dédire une fois est un
 * accident dont personne ne se souvient ; se dédire trois fois est une
 * réputation dont on ne se débarrasse plus. Les événements signalent l'écart,
 * le moteur compte, et la marque tombe quand le compte y est.
 *
 * C'est ce qui empêche une marque donnée par seize événements de finir dans
 * toutes les parties, sans avoir à mentir sur ce que chaque scène raconte.
 */
function strikesOf(s) {
  return s.strikes || (s.strikes = {});
}

function strikesNeeded(id) {
  const def = TRAIT_DATA[id];
  return def && def.strikes ? def.strikes : 1;
}

/**
 * Enregistre un écart. Renvoie ce qu'il faut montrer au joueur : la marque si
 * elle vient de tomber, sinon l'avertissement, pour qu'il la voie venir.
 */
/**
 * CERTAINES MARQUES NE VOUS CONCERNENT PAS.
 *
 * Un trait peut exiger d'appartenir — ou d'avoir appartenu — à certains
 * camps. « Marqué aux extrêmes » n'a aucun sens pour un centriste qui n'a
 * jamais quitté son parti : le pays ne le range pas là, quoi qu'il dise.
 * On regarde le parti actuel ET tous ceux qu'on a traversés, parce qu'une
 * étiquette d'origine ne se décolle jamais tout à fait.
 */
function traitAllowed(s, id) {
  const def = TRAIT_DATA[id];
  if (!def || !def.requiresParty) return true;

  const parcours = partyHistory(s);
  return def.requiresParty.some((key) => parcours.includes(key));
}

/** Tous les partis traversés, le premier compris. */
function partyHistory(s) {
  if (!s.parties) s.parties = [s.party];
  if (!s.parties.includes(s.party)) s.parties.push(s.party);
  return s.parties;
}

function addStrike(s, id) {
  if (hasTrait(s, id)) return null;

  // On ne compte même pas l'écart : la marque ne peut pas tomber, il n'y a
  // donc rien à compter, et le joueur n'a pas à voir un compteur avancer
  // vers un trait qu'il ne prendra jamais.
  if (!traitAllowed(s, id)) return null;

  const count = strikesOf(s)[id] = (strikesOf(s)[id] || 0) + 1;
  const need = strikesNeeded(id);
  if (count < need) return { kind: "strike", key: id, count, need };

  const gained = addTrait(s, id);
  return gained ? { kind: "trait", key: id, gained: true, stats: gained } : null;
}

function hasTrait(s, id) {
  return traitsOf(s).includes(id);
}

/**
 * Ajoute un trait, retire ceux qu'il rend impossibles, et applique ses
 * modificateurs de statistiques. Ces points-là sont acquis : ils se voient
 * sur la fiche et restent jusqu'à la fin de la partie, ou jusqu'à ce que le
 * trait soit levé.
 *
 * Renvoie la liste des statistiques qui ont réellement bougé, pour que
 * l'interface puisse l'afficher au joueur.
 */
function addTrait(s, id) {
  const def = TRAIT_DATA[id];
  if (!def || hasTrait(s, id)) return null;
  if (!traitAllowed(s, id)) return null;

  (def.blocks || []).forEach((other) => removeTrait(s, other));
  traitsOf(s).push(id);
  return applyTraitStats(s, def, 1);
}

/** Retire un trait et reprend ce qu'il avait donné. */
function removeTrait(s, id) {
  const list = traitsOf(s);
  const at = list.indexOf(id);
  if (at < 0) return null;

  list.splice(at, 1);
  return applyTraitStats(s, TRAIT_DATA[id], -1);
}

function applyTraitStats(s, def, sign) {
  const changes = [];
  if (!def || !def.stats) return changes;

  Object.entries(def.stats).forEach(([stat, delta]) => {
    const before = s.stats[stat];
    bump(s, stat, delta * sign);
    if (s.stats[stat] !== before) {
      changes.push({ kind: "stat", key: stat, delta: s.stats[stat] - before });
    }
  });
  return changes;
}

/** Somme d'un champ numérique sur tous les traits portés. */
function traitSum(s, read) {
  return traitsOf(s).reduce((total, id) => {
    const def = TRAIT_DATA[id];
    return def ? total + (read(def) || 0) : total;
  }, 0);
}

/**
 * Ce que les traits ajoutent à la cible d'une jauge. Certains ne valent pas la
 * même chose selon le camp : ce qu'un appareil trouve normal, celui d'en face
 * en fait un sujet. C'est le rôle de "partyTarget".
 */
function traitTarget(s, gauge) {
  return traitSum(s, (d) => {
    const propre = (d.target && d.target[gauge]) || 0;
    const selonParti = d.partyTarget && d.partyTarget[s.party] && d.partyTarget[s.party][gauge];
    return propre + (selonParti || 0);
  });
}

/**
 * Ce que les traits ajoutent au score d'un scrutin. C'est le levier des
 * traits qui aident quelque part et nuisent ailleurs : un ancrage local rend
 * une mairie presque imprenable et ne sert à rien à Strasbourg. La clé "all"
 * couvre les scrutins qu'un trait ne nomme pas.
 */
function traitElections(s, electionId) {
  return traitSum(s, (d) => {
    if (!d.elections) return 0;
    const propre = d.elections[electionId];
    return propre === undefined ? (d.elections.all || 0) : propre;
  });
}

/** Part des mauvaises nouvelles que les traits amortissent, plafonnée. */
function traitSoften(s) {
  return Math.min(0.6, traitSum(s, (d) => d.soften));
}

/* ==========================================================================
   Ce que les traits font à chaque tour
   ========================================================================== */

/**
 * Revenus discrets et risques qui vont avec. Un trait qui rapporte de
 * l'argent finit toujours par coûter autre chose.
 */
function applyTraitTurn(s) {
  // Le revenu occulte est déclaré par semestre (voir annualIncome) : on en
  // verse ici la part qui revient à une saison.
  const income = Math.round(traitSum(s, (d) => d.income) * 2 * YEARS_PER_TURN);
  if (income) pay(s, income);

  traitsOf(s).forEach((id) => {
    const risk = TRAIT_DATA[id] && TRAIT_DATA[id].risk;
    if (!risk || s.seen[risk.chain]) return;
    if (pendingChains(s).some((entry) => entry.id === risk.chain)) return;
    // risk.p est un risque ANNUEL, ramené ici à la durée d'un tour.
    if (Math.random() < risk.p * YEARS_PER_TURN * (1 - investProtect(s))) scheduleChain(s, risk.chain);
  });

  wealthAttention(s);
}
