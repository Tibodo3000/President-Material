/*
 * TEMPS FORT — LA PRÉSIDENTIELLE DES AUTRES.
 *
 * Le scrutin qui décide du pays et qu'on regarde depuis le siège du
 * passager. Trois temps où l'on porte le candidat de son camp — ou pas —
 * puis le dépouillement des deux tours. Ce n'est pas une carte informative :
 * ce qu'on fait pendant ces trois temps se paie en cote au parti, et le
 * résultat décide de qui gouverne pour cinq ans.
 *
 * Le sondage est VISIBLE et bouge à chaque scène : on jouait trois temps sans
 * rien voir bouger et l'on découvrait un président au dernier clic.
 */

/* ==========================================================================
   LA PRÉSIDENTIELLE DES AUTRES
   ==========================================================================
   Quand le joueur n'est pas candidat, la plus grande élection du jeu se
   réglait en une phrase et un vainqueur tiré au sort. Cinq ans basculaient
   sans qu'il ait rien à en dire.

   Elle se joue maintenant en trois temps, avec des scènes qui dépendent de
   ce qu'on est : un militant colle des affiches, un ministre défend un
   bilan, un chef de parti négocie un désistement, et celui qui est plus
   populaire que son propre candidat doit décider s'il le porte ou s'il
   s'installe pour la fois d'après.

   Ce qu'on y gagne ou qu'on y perd s'accumule dans "bonus", qui pèse ensuite
   sur le tirage du vainqueur. Un peu, jamais assez pour renverser le pays :
   on ne fait pas élire un candidat en collant des affiches, on l'aide.
   ========================================================================== */

const SUPPORT_STEPS = 3;

/** Ce qu'un point de soutien vaut en points d'intentions de vote. */
const SUPPORT_WEIGHT = 0.55;

/**
 * LE CHAMP D'UNE PRÉSIDENTIELLE QU'ON NE DISPUTE PAS.
 *
 * Il n'y en avait pas. On jouait trois scènes à l'aveugle, un compteur
 * invisible s'incrémentait, et le soir du troisième clic un tirage pondéré
 * désignait un président dont le nom tombait d'un coup. Une campagne dont on
 * ne voit rien bouger n'est pas une campagne, c'est une loterie avec des
 * décors : le joueur n'avait aucun moyen de savoir si ce qu'il faisait
 * servait à quelque chose, ni même qui était en tête.
 *
 * C'est donc le même champ que celui d'une candidature, à une différence
 * près : le joueur n'y est pas. Son camp y est, porté par son candidat, et
 * c'est cette ligne-là qu'il regarde monter ou descendre.
 */
function supportField() {
  const ally = allyParty();
  const investi = game.support && game.support.nominee;

  return normalizeShares(Object.keys(PARTIES).map((key) => {
    // Le candidat de votre camp est celui que la primaire a désigné, si elle
    // a eu lieu ; sinon celui qui dirige le parti.
    const figure = (key === game.party && investi
      ? game.rivals.find((r) => r.name === investi)
      : null) || presidentialCandidate(key);
    const sortant = Boolean(figure) && isPresident(figure);
    const pull = (figure ? figurePull(figure, sortant) : 0.8) * (key === ally ? 0.82 : 1);

    return {
      name: figure ? figure.name : null,
      nameKey: figure ? null : "party_" + key,
      party: key,
      pop: figure ? figure.popularity : 45,
      share: Math.max(1, game.landscape[key] * pull),
      // Ce n'est pas vous qui concourez : "isPlayer" reste faux partout, et
      // le second tour comme les taux de rejet s'en servent. "mine" ne sert
      // qu'à deux choses : surligner la ligne, et savoir laquelle déplacer.
      isPlayer: false,
      mine: key === game.party,
    };
  }));
}

/** Ramène un champ à cent pour cent. */
function normalizeShares(field) {
  const total = field.reduce((sum, c) => sum + c.share, 0) || 1;
  field.forEach((c) => { c.share = (c.share / total) * 100; });
  return field;
}

function startSupport(nominee) {
  game.support = { step: 0, used: [], moment: null, nominee: nominee || null, result: null };
  game.support.field = supportField();
  return { kind: "support", id: drawSupport().id, resolved: false };
}

/** Le sondage tel qu'on l'affiche : la ligne de votre camp est la vôtre. */
function supportPoll() {
  return [...game.support.field]
    .map((c) => ({ ...c, isPlayer: c.mine }))
    .sort((a, b) => b.share - a.share);
}

/**
 * Où en est votre camp, en mots. Trois degrés, comme partout ailleurs : on
 * ne montre jamais au joueur l'écart qui le sépare du second tour, on le lui
 * raconte.
 */
function supportMood() {
  const trie = [...game.support.field].sort((a, b) => b.share - a.share);
  const rang = trie.findIndex((c) => c.mine);
  if (rang === 0) return "support_mood_first";
  if (rang === 1) return "support_mood_second";
  const ecart = trie[1].share - trie[rang].share;
  return ecart <= 4 ? "support_mood_close" : "support_mood_out";
}

function drawSupport() {
  const used = game.support.used;
  const situation = SUPPORT_EVENTS.filter((ev) => eventMatches({ ...ev, id: null }, game));
  const datees = situation.filter((ev) => momentFits(ev, game.support, SUPPORT_STEPS));
  const eligible = datees.filter((ev) => !used.includes(ev.id));

  // Le repli ignore ce qui a déjà été joué dans CETTE campagne plutôt que
  // d'ouvrir des scènes qui ne correspondent pas à la situation. Le dernier
  // recours ouvre les scènes sans date : revoir un décor coûte moins cher
  // que raconter le premier tour après le second.
  const pool = eligible.length
    ? eligible
    : (datees.length ? datees : situation.filter((ev) => momentOf(ev) === null));

  const ev = pool.length ? pool[randInt(pool.length)] : SUPPORT_EVENTS[0];
  used.push(ev.id);
  rememberMoment(ev, game.support);
  setScene(ev);
  return ev;
}

/**
 * LE DÉPOUILLEMENT SORT DU SONDAGE, ET DE RIEN D'AUTRE.
 *
 * Il sortait d'un tirage pondéré par le paysage, calculé à part du sondage
 * que le joueur n'avait de toute façon jamais vu : ce qu'on lui avait montré
 * pendant trois scènes et ce qui décidait du président étaient deux choses
 * sans rapport. On compte donc le champ affiché, on reporte les voix des
 * éliminés comme pour n'importe quel second tour, et le résultat est celui
 * que le joueur pouvait lire depuis le début.
 */
function resolveSupport() {
  const premier = [...game.support.field].sort((a, b) => b.share - a.share);
  const duel = runoff(game.support.field, game);

  ensureLeaders();
  const gagnant = duel.winner;
  const figure = gagnant.name ? game.rivals.find((r) => r.name === gagnant.name) : figureOf(gagnant.party);
  if (figure) setPresident({ name: figure.name, party: gagnant.party });
  else setPresident({ name: t("party_" + gagnant.party), party: gagnant.party });

  const mien = gagnant.party === game.party;
  const finaliste = duel.finalists.some((f) => f.mine);
  const nom = figure ? figure.name : t("party_" + gagnant.party);

  // On garde les deux tours pour la carte de résultat : le joueur doit voir
  // le score du premier et le report du second, pas seulement un nom.
  game.support.result = {
    first: premier.map((c) => ({ ...c, isPlayer: c.mine })),
    duel: duel.finalists.map((c) => ({ ...c, isPlayer: c.mine })),
    won: mien,
  };

  if (mien) {
    bumpStanding(game, 10);
    bumpPop(game, 4);
    return {
      fr: nom + " est élu{e} président{e} de la République. Votre camp gouverne, et vous avez fait campagne pour lui.",
      en: nom + " is elected president. Your side is in power, and you campaigned for it.",
    };
  }

  // Être au second tour et le perdre n'est pas la même défaite que d'être
  // sorti dès le premier dimanche : dans un cas le camp a existé, dans
  // l'autre il a disparu, et l'appareil ne le juge pas pareil.
  bumpStanding(game, finaliste ? -2 : -6);
  return finaliste
    ? {
        fr: nom + " ({party:" + gagnant.party + "}) l'emporte au second tour. Votre camp y était, ce qui ne console personne le soir même et comptera dans cinq ans.",
        en: nom + " ({party:" + gagnant.party + "}) wins the runoff. Your side was in it, which consoles nobody on the night and will count in five years.",
      }
    : {
        fr: nom + " ({party:" + gagnant.party + "}) remporte l'élection présidentielle. Votre camp n'a pas passé le premier tour, et repart pour cinq ans d'opposition.",
        en: nom + " ({party:" + gagnant.party + "}) wins the presidential election. Your side did not make the runoff, and faces five more years in opposition.",
      };
}

function renderSupportCard(host, card) {
  // Le soir des deux tours. On montre le premier, puis le report : c'est la
  // seule façon de comprendre comment on est passé du sondage au résultat.
  const res = game.support.result;
  if (res) {
    host.innerHTML =
      '<div class="event-card event-card-election">' +
        electionBanner("presidentielle", t("label_result")) +
        '<p class="event-tag">' + cardHeader() + "</p>" +
        pollHTML(res.first, "label_round1") +
        pollHTML(res.duel, "label_round2", 1) +
        '<p class="event-text event-result">' + card.resultText + "</p>" +
        changesHTML(card.resultChanges) +
        continueButton("data-support-done") +
      "</div>";
    return;
  }

  const ev = eventById(card.id);
  const dernier = game.support.step >= SUPPORT_STEPS - 1;

  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner("presidentielle",
        t("step_of").replace("{n}", game.support.step + 1).replace("{total}", SUPPORT_STEPS)) +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      // LE SONDAGE, ENFIN. On jouait trois scènes sans rien voir bouger et
      // l'on découvrait un président au dernier clic.
      // On rappelle au premier temps qu'on n'est pas candidat : à partir du
      // deuxième, le sondage le dit tout seul.
      (game.support.step === 0
        ? '<p class="event-text nomination-stake">' + t("support_intro") + "</p>"
        : "") +
      pollHTML(supportPoll(), "label_poll") +
      '<p class="race-mood">' + t(supportMood()) + "</p>" +
      (card.resolved
        ? '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) +
          continueButton(dernier ? "data-support-count" : "data-support-next")
        : '<p class="event-sub-tag">' + L(ev.tag) + "</p>" +
          '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
          '<div class="event-choices">' + choiceButtons(ev, game) + "</div>") +
    "</div>";
}

MODES.support = {
  // Sans son état, la carte n'a ni sondage ni compteur de temps : on la
  // laisse au moteur plutôt que de dessiner une campagne vide.
  ready: () => Boolean(game.support),
  render: renderSupportCard,
  clicks: {
    "data-support-next": supportNext,
    "data-support-count": supportCount,
    "data-support-done": supportDone,
  },
};

function supportNext() {
  game.support.step++;
  // Les autres candidats ne regardent pas votre camp bouger sans rien
  // faire : le sondage vit entre deux scènes, comme dans une campagne.
  driftSupport(game);
  game.card = { kind: "support", id: drawSupport().id, resolved: false };
  saveGame();
  renderAll();
}

/*
 * Le dépouillement, sur la carte de la campagne elle-même : on y lit le
 * premier tour, le report et le verdict, dans cet ordre.
 */
function supportCount() {
  const before = snapshot(game);
  const texte = resolveSupport();
  addLog(texte);
  game.card = { kind: "support", id: game.card.id, resolved: true,
                resultText: fillMarks(L(texte)), resultChanges: diffSince(before, game) };
  saveGame();
  renderAll();
}

function supportDone() {
  game.support = null;
  game.card = null;
  if (game.ended) game.card = { kind: "end" };
  else advanceTurn();
  saveGame();
  renderAll();
}
