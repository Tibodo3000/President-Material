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

/** Ajoute une phrase à un texte bilingue sans le dupliquer des deux côtés. */
function ajouterSuite(texte, suite) {
  return { fr: texte.fr + suite.fr, en: texte.en + suite.en };
}

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

    /* VOTRE CAMP PORTE CE QUE VOUS AVEZ FAIT, MÊME QUAND VOUS N'ÊTES PAS LE
       CANDIDAT. La présidentielle qu'on dispute se calcule électorat par
       électorat depuis l'adhésion ; celle qu'on regarde continuait de calculer
       le camp du joueur comme n'importe quel autre parti, avec le seul tirage
       de sa figure. Vingt ans de campagne ne comptaient donc pour rien dès
       lors qu'un autre portait l'étiquette. */
    const mien = key === game.party;
    const part = mien && game.appeal
      ? Math.max(1, playerFirstRound())
      : Math.max(1, game.landscape[key] * pull);

    return {
      name: figure ? figure.name : null,
      nameKey: figure ? null : "party_" + key,
      party: key,
      pop: figure ? figure.popularity : 45,
      share: part,
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
  // CE QUE LE CAMP VALAIT LE JOUR OÙ LA CAMPAGNE S'EST OUVERTE. Sans ce
  // repère, la soirée ne peut se lire qu'en « gagné / perdu », et l'appareil
  // reproche la même chose à celui qui a doublé le score du camp et à celui
  // qui l'a coulé. C'est le baseShare de startCampaign, pour la même raison.
  const mien = game.support.field.find((c) => c.mine);
  game.support.baseShare = mien ? mien.share : game.landscape[game.party];
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
 * CE QUE LA SOIRÉE VAUT, AVANT DE SAVOIR À QUI L'IMPUTER.
 *
 * Un nom de vainqueur ne suffit pas à juger une campagne. Le moteur ne
 * regardait que lui : dix points de cote si c'était le vôtre, moins deux si
 * votre camp avait perdu le second tour, moins six s'il était sorti au
 * premier. Un camp donné quatrième qu'on portait jusqu'au duel final était
 * donc SANCTIONNÉ de deux points, et un camp qu'on avait reçu en tête et
 * ramené au troisième rang coûtait exactement la même chose.
 *
 * L'appareil compare deux nombres : ce que le camp valait à l'ouverture, ce
 * qu'il vaut le dimanche soir. Le reste — le nom du président — décide du
 * pays, pas de votre cote.
 */
function supportOutcome() {
  const res = game.support.result;
  const mien = res.won;
  const finaliste = res.duel.some((c) => c.mine);

  // Où le camp a fini, dans l'absolu : gouverner n'est pas être au duel, et
  // être au duel n'est pas sortir le premier dimanche.
  const fin = mien ? 10 : finaliste ? 3 : -6;

  // Et ce qu'on en a fait, en points de premier tour. Un camp qui passe de
  // huit à dix-huit a fait une très grande campagne, même perdue.
  const moi = res.first.find((c) => c.mine);
  const base = game.support.baseShare;
  const progression = moi && base !== undefined ? moi.share - base : 0;

  return {
    brut: fin + Math.max(-8, Math.min(8, Math.round(progression * 1.3))),
    progression,
  };
}

/**
 * CE QU'ON VOUS IMPUTE DÉPEND DE CE QU'ON VOUS AVAIT CONFIÉ.
 *
 * Le soir du scrutin coûtait six points de cote à tout le monde, du chef de
 * parti au militant qui avait collé des affiches deux dimanches. Or la cote
 * mesure ce qu'on vaut AUX YEUX DES SIENS, donc par comparaison avec eux :
 * une gifle collective ne déclasse personne à l'intérieur de la maison, et
 * l'on n'a rien à se faire pardonner d'une campagne qu'on n'a pas dirigée.
 * L'appareil ne demande des comptes qu'à ceux qui tenaient les clés.
 *
 * Ce que le joueur a fait pendant les trois temps se paie déjà dans les
 * scènes elles-mêmes : le dépouillement n'ajoute que sa part de
 * responsabilité, nulle pour un militant, entière pour qui dirige.
 */
function supportShare() {
  // Diriger le parti, c'est tenir les clés quel que soit le mandat qu'on
  // exerce par ailleurs : le chef répond de la campagne entière, y compris
  // du candidat qu'il a laissé investir.
  if (leadsParty(game)) return 1;
  return Math.min(1, rankOf(game) / 8);
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

  /* On ne demande des comptes qu'à ceux qui tenaient les clés — mais on
     partage la bonne nouvelle plus large que la mauvaise. Un camp qui gagne a
     des places à distribuer, et en avoir été suffit à en toucher quelque
     chose ; un camp qui perd ne déclasse que ceux qui décidaient. D'où le
     socle, qui ne joue que dans un sens. */
  const bilan = supportOutcome();
  const part = supportShare();
  bumpStanding(game, Math.round(bilan.brut * (bilan.brut >= 0 ? Math.max(0.3, part) : part)));

  /* CE QUE LA SOIRÉE A CHANGÉ AU CAMP, EN UNE PHRASE. Sans elle, le joueur
     lit « votre camp n'a pas passé le premier tour » au-dessus d'une cote qui
     monte, ou l'inverse, et une conséquence qu'on ne relie pas à sa cause se
     lit comme un bug. */
  const monte = bilan.progression >= 4;
  const coule = bilan.progression <= -4;
  const bouge = monte
    ? { fr: " Le camp sort de cette campagne plus haut qu'il n'y était entré, et au siège personne ne fera semblant de l'ignorer.",
        en: " The side comes out of this campaign higher than it went in, and nobody at headquarters will pretend otherwise." }
    : coule
      ? { fr: " Le camp sort de cette campagne plus bas qu'il n'y était entré, et c'est de cela qu'on parlera au bureau politique, pas du vainqueur.",
          en: " The side comes out of this campaign lower than it went in, and that is what the executive will discuss, not the winner." }
      : { fr: "", en: "" };
  const dit = (texte) => ajouterSuite(texte, bouge);

  if (mien) {
    bumpPop(game, 4);
    return dit({
      fr: nom + " est élu{e} président{e} de la République. Votre camp gouverne, et vous avez fait campagne pour lui.",
      en: nom + " is elected president. Your side is in power, and you campaigned for it.",
    });
  }

  // Un camp battu au second tour n'a pas disparu ; un camp sorti le premier
  // dimanche, si. La différence est déjà dans supportOutcome() ; ici on ne
  // fait plus que la raconter.
  return dit(finaliste
    ? {
        fr: nom + " ({party:" + gagnant.party + "}) l'emporte au second tour. Votre camp y était, ce qui ne console personne le soir même et comptera dans cinq ans.",
        en: nom + " ({party:" + gagnant.party + "}) wins the runoff. Your side was in it, which consoles nobody on the night and will count in five years.",
      }
    : {
        fr: nom + " ({party:" + gagnant.party + "}) remporte l'élection présidentielle. Votre camp n'a pas passé le premier tour, et repart pour cinq ans d'opposition.",
        en: nom + " ({party:" + gagnant.party + "}) wins the presidential election. Your side did not make the runoff, and faces five more years in opposition.",
      });
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
