/*
 * President Material — LES SONDAGES ET LE SECOND TOUR.
 *
 * Ce qui bouge dans un champ de candidats : le sondage du premier tour, celui
 * de la présidentielle qu'on ne dispute pas, la dérive d'une campagne, et le
 * report des voix au second tour — qui se calcule sur la distance idéologique
 * entre les camps, jamais sur une table écrite à la main.
 *
 * Les chiffres sont dans js/balance.js.
 */
/* ==========================================================================
   L'année présidentielle
   ==========================================================================
   Quand le joueur dirige son parti à l'approche de la présidentielle,
   l'année ne se joue plus en deux tours ordinaires mais en SIX temps de
   campagne, avec un sondage affiché qui bouge à chaque décision.
   ========================================================================== */




/**
 * Déplace la part du joueur dans le sondage et redistribue le reste.
 *
 * Une campagne ne se gagne pas en empilant les bonnes journées : plus la
 * part est haute, moins un bon moment rapporte, parce qu'il ne reste plus
 * que des électeurs difficiles à convaincre. Les mauvaises journées, elles,
 * coûtent toujours leur prix.
 */
function shiftPoll(s, delta) {
  const field = s.campaign.field;
  const me = field.find((c) => c.isPlayer);

  const before = me.share;
  const move = delta > 0 ? delta * Math.max(0.18, 1 - me.share / 42) : delta;
  me.share = Math.max(2, Math.min(92, me.share + move));
  const moved = me.share - before;

  const others = field.filter((c) => !c.isPlayer);
  const pool = others.reduce((sum, c) => sum + c.share, 0) || 1;
  others.forEach((c) => {
    c.share = Math.max(1, c.share - moved * (c.share / pool));
  });

  // On renormalise pour que le total fasse toujours cent.
  const total = field.reduce((sum, c) => sum + c.share, 0);
  field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * La même chose, pour la campagne d'un camp que le joueur soutient sans y
 * être candidat. On déplace la ligne de son parti, pas la sienne : il n'en a
 * pas. Les rendements décroissants sont les mêmes, parce que c'est la même
 * campagne vue d'un cran plus loin.
 */
function shiftSupport(s, delta) {
  const field = s.support && s.support.field;
  const mien = field && field.find((c) => c.mine);
  if (!mien) return;

  const before = mien.share;
  const move = delta > 0 ? delta * Math.max(0.18, 1 - mien.share / 42) : delta;
  mien.share = Math.max(1, Math.min(92, mien.share + move));
  const moved = mien.share - before;

  const autres = field.filter((c) => !c.mine);
  const pool = autres.reduce((sum, c) => sum + c.share, 0) || 1;
  autres.forEach((c) => { c.share = Math.max(1, c.share - moved * (c.share / pool)); });

  const total = field.reduce((sum, c) => sum + c.share, 0) || 1;
  field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * La vie du sondage entre deux temps d'une campagne qu'on soutient. Les
 * autres bougent, exactement comme quand c'est vous le candidat : une
 * campagne où seul votre camp remue n'est pas une campagne.
 */
function driftSupport(s) {
  const field = s.support && s.support.field;
  if (!field || !field.length) return;

  const autres = field.filter((c) => !c.mine);
  if (!autres.length) return;
  const best = autres.reduce((top, c) => (c.share > top.share ? c : top), autres[0]);
  autres.forEach((c) => {
    c.share = Math.max(1, c.share + (Math.random() - 0.5) * 2.4 + (c === best ? 0.5 : 0));
  });

  const total = field.reduce((sum, c) => sum + c.share, 0) || 1;
  field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * Le sondage d'un second tour. Deux noms, cent pour cent à partager : ce que
 * l'un prend, l'autre le perd, exactement, et c'est ce qui rend ces quinze
 * jours si durs. Plus on est haut, plus chaque point coûte cher, parce qu'en
 * face il ne reste que des électeurs qui ont déjà choisi contre vous.
 */
function shiftRunoff(s, delta) {
  const field = s.campaign.duel.field;
  const me = field.find((c) => c.isPlayer);
  const other = field.find((c) => !c.isPlayer);
  if (!me || !other) return;

  const reste = delta > 0 ? (100 - me.share) : me.share;
  const move = delta * RUNOFF_WEIGHT * Math.max(0.3, reste / 55);

  me.share = Math.max(15, Math.min(85, me.share + move));
  other.share = 100 - me.share;
}


/* ==========================================================================
   Le second tour
   ==========================================================================
   Une présidentielle ne se gagne pas avec le premier tour. Il faut d'abord
   être dans les deux premiers, puis récupérer les voix des éliminés, et
   celles-là ne se commandent pas : elles vont au moins éloigné.

   C'est là que le positionnement se paie. Un candidat qui a passionné sa
   base et effrayé tout le monde arrive en tête le dimanche du premier tour
   et perd le second, ce qui est exactement ce qui doit pouvoir arriver.
   ========================================================================== */


function partyAxes(key) {
  return key && PARTIES[key] ? PARTIES[key].axes : NEUTRAL_AXES;
}

/** Distance idéologique entre deux partis, de 0 (identiques) à 1 (opposés). */

function ideologicalDistance(a, b) {
  const A = partyAxes(a);
  const B = partyAxes(b);
  return AXES.reduce((sum, ax) => sum + Math.abs(A[ax] - B[ax]), 0) / (AXES.length * 200);
}

/**
 * La part de l'électorat qui refuse de se reporter sur un candidat, quelle
 * que soit sa proximité. C'est le prix des choix qui font gagner le premier
 * tour : la radicalité, les affaires, la parole reniée.
 */
function rejectionRate(candidate, s) {
  if (!candidate.isPlayer) return 0.14;

  let rate = 0.14;
  // On hérite de ce que le pays reproche à son allié. S'allier à un parti
  // que la moitié du pays refuse, c'est acheter des voix au premier tour et
  // en perdre au second.
  if (s.alliance && PARTIES[s.alliance.party]) {
    rate += (PARTIES[s.alliance.party].difficulty - 2) * 0.045;
  }
  // Ce que vos traits ajoutent ou retirent est écrit dans js/traits.data.js :
  // le moteur ne connaît aucun trait par son nom.
  rate += traitSum(s, (d) => d.rejection);
  if (s.flags.onTrial) rate += 0.16;

  // LA STATURE, AU SECOND TOUR. C'est le moment où le pays doit se dire qu'il
  // vous voit à l'Élysée. Un candidat sans crédibilité perd là des électeurs
  // qui, au premier tour, l'avaient trouvé sympathique.
  rate += (11 - statScore(s, "credibilite")) * 0.014;

  return Math.max(0, Math.min(0.75, rate));
}

/**
 * Reporte les voix des éliminés sur les deux finalistes et renvoie le
 * second tour. Une part des électeurs ne se reporte sur personne : c'est
 * l'abstention du dimanche suivant.
 */
function runoff(field, s) {
  const sorted = [...field].sort((a, b) => b.share - a.share);
  const finalists = sorted.slice(0, 2).map((c) => ({ ...c, first: c.share }));
  const eliminated = sorted.slice(2);

  const ally = s.alliance ? s.alliance.party : null;

  eliminated.forEach((out) => {
    // La proximité commande le report, mais jamais entièrement : dans un
    // second tour, une part de l'électorat vote contre plutôt que pour, et
    // aucun finaliste ne se retrouve à zéro. Sans ce socle, un candidat de
    // rupture ne pourrait jamais gagner, ce qui n'est pas ce que le jeu
    // raconte : il doit pouvoir gagner, mais rarement.
    //
    // C'est ici que se paie une alliance : un allié éliminé appelle à voter
    // pour vous, et ses électeurs suivent presque tous. Personne d'autre ne
    // vous rendra ce service.
    const allied = Boolean(ally) && out.party === ally;

    const weights = finalists.map((f) => {
      /* POUR LE JOUEUR, ON SAIT EXACTEMENT CE QUE CET ÉLECTORAT PENSE DE LUI.
         Le report passait par rejectionRate, un forfait de quatorze pour cent
         corrigé par les traits : la proximité idéologique décidait tout, et
         ce qu'on avait fait devant ces électeurs pendant vingt ans ne comptait
         pour rien. C'est pourtant là, et seulement là, que se paie le choix
         d'avoir chauffé sa base ou d'avoir parlé à tout le monde. */
      /* CE QUE LES TRAITS COÛTENT AU SECOND TOUR N'A PAS DISPARU. En passant
         par l'adhésion réelle, on avait cessé d'appeler rejectionRate pour le
         joueur : la femme candidate, le procès en cours, la radicalité ne
         changeaient plus rien au report, alors que c'est très exactement le
         moment où ils se paient. On garde donc la part que les TRAITS
         ajoutent au refus, au-dessus du forfait commun de quatorze pour cent
         déjà contenu dans l'adhésion. */
      const base = (f.isPlayer || f.mine) && s.appeal
        ? (0.30 + (s.appeal[out.party] / 100) * 0.95) *
          (1 - Math.max(0, rejectionRate(f, s) - 0.14))
        : (0.38 + Math.pow(Math.max(0.05, 1 - ideologicalDistance(out.party, f.party)), 2)) *
          (1 - rejectionRate(f, s));
      // Le pacte vaut pour votre camp, que vous soyez le candidat ou non :
      // c'est un accord entre partis, pas entre personnes.
      return allied && (f.isPlayer || f.mine) ? base * 2.6 : base;
    });

    const total = weights[0] + weights[1] || 1;
    const transferred = out.share * (allied ? 0.88 : 0.72);
    finalists[0].share += transferred * (weights[0] / total);
    finalists[1].share += transferred * (weights[1] / total);
  });

  // Le second tour n'est pas qu'une addition de premiers tours : quinze jours
  // de face-à-face, et celui que le pays aime le mieux prend l'avantage.
  finalists.forEach((f) => {
    const standing = f.pop === undefined ? 45 : f.pop;
    f.share *= 1 + (standing - 50) * 0.008;
  });

  const total = finalists.reduce((sum, f) => sum + f.share, 0) || 1;
  finalists.forEach((f) => { f.share = (f.share / total) * 100; });
  finalists.sort((a, b) => b.share - a.share);

  return { finalists, winner: finalists[0] };
}

/**
 * La vie du sondage entre deux temps de campagne. Les adversaires ne
 * regardent pas le joueur monter sans rien faire : eux aussi ont des bons
 * jours, et le mieux placé d'entre eux profite de la dynamique.
 */
function driftCampaign(s) {
  const others = s.campaign.field.filter((c) => !c.isPlayer);
  if (!others.length) return;

  const best = others.reduce((top, c) => (c.share > top.share ? c : top), others[0]);
  others.forEach((c) => {
    c.share = Math.max(1, c.share + (Math.random() - 0.5) * 2.4 + (c === best ? 0.5 : 0));
  });

  const total = s.campaign.field.reduce((sum, c) => sum + c.share, 0) || 1;
  s.campaign.field.forEach((c) => { c.share = (c.share / total) * 100; });
}

/**
 * La vie du face-à-face entre deux temps d'entre-deux-tours. On bouge moins
 * qu'au premier tour : à ce stade, un sondage qui varie de trois points en
 * deux jours n'est pas un sondage, c'est une erreur d'échantillon.
 */
function driftRunoff(s) {
  const field = s.campaign.duel.field;
  const me = field.find((c) => c.isPlayer);
  const other = field.find((c) => !c.isPlayer);
  if (!me || !other) return;

  me.share = Math.max(15, Math.min(85, me.share + (Math.random() - 0.5) * 1.2));
  other.share = 100 - me.share;
}
