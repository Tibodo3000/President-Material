/*
 * RENDU — L'ÉCRAN DE FIN.
 *
 * Le moteur ne connaît qu'une poignée de TYPES de fin (victoire, retraite,
 * retrait, mort, condamnation). Le texte, lui, est choisi par resolveEnding()
 * dans endings.data.js, qui prend la première entrée dont le `when` colle à
 * l'état final : la même victoire ne se raconte pas de la même façon selon ce
 * qu'on a laissé derrière soi.
 *
 * IL FALLAIT AUSSI QUE LA PARTIE SE RELISE. L'écran annonçait trois nombres —
 * des années, un sommet, une fortune — et quarante ans de carrière n'y
 * laissaient aucune trace : deux parties très différentes s'y ressemblaient
 * exactement. Il en montre désormais trois choses, dans cet ordre :
 *
 *   LE RÉCIT     le titre et le texte de la fin, comme avant.
 *   LA NOTE      cinq lignes qui disent ce que le manuel retiendra, et le
 *                rang qui en découle (careerScore, dans js/game-data.js).
 *   LA FRISE     tout ce qu'on a été, année par année, reconstruit depuis
 *                game.career — la liste que le moteur tient au fil de la
 *                partie et qui, elle, ne se tronque jamais.
 */

/* --------------------------------------------------------------------------
   LA FRISE
   --------------------------------------------------------------------------
   game.career enregistre les moments bruts, et deux d'entre eux racontent
   souvent la même chose : applyOutcome() pose la fonction PUIS le scrutin qui
   l'a donnée, si bien qu'une élection gagnée produisait « Député » suivi de
   « Législatives · élu ». On fusionne donc la prise de fonction avec le
   scrutin qui la porte, dans les deux sens — un siège gagné, un siège perdu.
   -------------------------------------------------------------------------- */

function timelineLabel(entry, frise, i) {
  const elec = (id) => t("cal_elec_" + id);

  if (entry.kind === "election") {
    if (entry.target === "chef") {
      return { text: t(entry.won ? "frise_house_won" : "frise_house_lost").replace("{elec}", elec(entry.id)),
               tone: entry.won ? "up" : "down" };
    }
    if (entry.won) {
      return { text: t(entry.defense ? "frise_kept" : "frise_elected").replace("{elec}", elec(entry.id)),
               tone: "up" };
    }
    return { text: t(entry.defense ? "frise_lost_seat" : "frise_beaten").replace("{elec}", elec(entry.id)),
             tone: "down" };
  }

  if (entry.kind === "office") {
    // Le scrutin qui a produit cette fonction est juste à côté : il porte
    // déjà la ligne, et deux lignes pour un seul soir ne se lisent pas.
    const voisin = frise[i + 1];
    if (voisin && voisin.kind === "election" && voisin.turn === entry.turn) return null;
    if (entry.position === "militant" || entry.position === "cadre") return null;
    // La ligne de clôture dit déjà « élu président de la République » : on ne
    // l'annonce pas deux fois à un tour d'intervalle.
    if (entry.position === "president" && game.ended && game.ended.type === "victory") return null;
    return { text: t("frise_office").replace("{pos}", t("pos_" + entry.position)), tone: "up" };
  }

  if (entry.kind === "lead") {
    return { text: t(entry.on ? "frise_lead_on" : "frise_lead_off"), tone: entry.on ? "up" : "down" };
  }

  if (entry.kind === "party") {
    return { text: t("frise_party").replace("{from}", t("party_" + entry.from))
                                   .replace("{to}", t("party_" + entry.to)), tone: "side" };
  }

  if (entry.kind === "decline") {
    return { text: t("frise_decline_" + entry.stage), tone: "body" };
  }

  return null;
}

function timelineHTML() {
  const frise = game.career || [];
  const rows = [];

  const ligne = (an, texte, tone, party) => (
    '<li class="frise-step frise-' + tone + '"' +
      (party ? ' style="--frise-party: var(--p-' + party + ')"' : "") + ">" +
      '<span class="frise-mark" aria-hidden="true"></span>' +
      '<span class="frise-when">' + t("frise_year").replace("{n}", an) + "</span>" +
      '<span class="frise-what">' + texte + "</span>" +
    "</li>"
  );

  rows.push(ligne(1, t("frise_start"), "start", game.character.party));

  frise.forEach((entry, i) => {
    const label = timelineLabel(entry, frise, i);
    if (!label) return;
    const an = Math.floor(entry.turn / TURNS_PER_YEAR) + 1;
    rows.push(ligne(an, label.text, label.tone, entry.party || null));
  });

  // LA DERNIÈRE LIGNE DIT CE QUI S'EST PASSÉ. Elle annonçait « fin de la
  // carrière » dans tous les cas, y compris sous le nom de quelqu'un qui
  // vient d'être élu président de la République : ce n'est pas une fin de
  // carrière, c'est le sommet, et le jeu s'arrête parce qu'il n'a plus rien
  // à raconter au-dessus.
  const type = (game.ended && game.ended.type) || "";
  const cle = "frise_end_" + type;
  const dernier = t(cle) === cle ? t("frise_end") : t(cle);
  rows.push(ligne(Math.floor(game.turn / TURNS_PER_YEAR) + 1, dernier,
                  type === "victory" ? "summit" : "end", game.party));

  return '<ol class="frise-list">' + rows.join("") + "</ol>";
}

/* --------------------------------------------------------------------------
   LA NOTE
   -------------------------------------------------------------------------- */

function scoreDetail(line) {
  const d = line.detail;

  if (line.key === "score_office") {
    const parts = [t("score_office_detail").replace("{n}", d.annees)];
    if (d.lead) parts.push(t("score_office_lead"));
    return t("pos_" + d.sommet) + " · " + parts.join(" ");
  }
  if (line.key === "score_ballots") {
    if (!d.gagnes && !d.perdus) return t("score_ballots_none");
    return t("score_ballots_detail").replace("{w}", d.gagnes).replace("{l}", d.perdus);
  }
  if (line.key === "score_country") return t("score_country_detail").replace("{n}", d.pic);
  if (line.key === "score_house") {
    const bouge = Math.abs(d.ecart) < 0.5
      ? t("score_house_flat")
      : t(d.ecart > 0 ? "score_house_up" : "score_house_down")
          .replace("{n}", Math.abs(Math.round(d.ecart)));
    return t("score_house_detail").replace("{n}", d.pic) + " · " + bouge;
  }
  if (line.key === "score_legacy") {
    if (!d.atouts && !d.casseroles) return t("score_legacy_none");
    return t("score_legacy_detail").replace("{a}", d.atouts).replace("{m}", d.casseroles);
  }
  return "";
}

function scoreLinesHTML() {
  const note = careerScore(game);
  return note.lines.map((line) => (
    '<li class="note-line">' +
      '<span class="note-label">' + t(line.key) + "</span>" +
      '<span class="note-points' + (line.points < 0 ? " is-down" : "") + '">' +
        (line.points > 0 ? "+" : "") + line.points + "</span>" +
      '<span class="note-detail">' + scoreDetail(line) + "</span>" +
    "</li>"
  )).join("");
}

/**
 * Le dépliant. Un dépliant ferme le sujet sans l'effacer : on ne montre pas
 * cinq rangées de chiffres à quelqu'un qui vient de terminer une partie, et
 * on ne les lui refuse pas non plus.
 */
function foldHTML(titre, contenu) {
  return (
    '<details class="fold">' +
      "<summary>" + titre + "</summary>" +
      '<div class="fold-body">' + contenu + "</div>" +
    "</details>"
  );
}

/** Tout ce que la partie a écrit, du premier tour au dernier. */
function journalHTML() {
  if (!game.log || !game.log.length) return "";
  const lignes = game.log.slice().reverse().map((l) => (
    '<p class="journal-line"><span class="journal-turn">' + t("year_label") + " " +
      (Math.floor(l.turn / TURNS_PER_YEAR) + 1) + "</span>" + logText(l) + "</p>"
  )).join("");
  return foldHTML(t("end_journal"), lignes);
}

/* -------------------------------------------------------------------------- */

function renderEnd(host) {
  // La fin dépend de l'état exact de la carrière : la même victoire ne se
  // raconte pas de la même façon selon ce qu'on a laissé derrière soi.
  const ending = resolveEnding(game) || { title: { fr: "", en: "" }, text: { fr: "", en: "" } };
  const note = careerScore(game);
  const years = Math.floor(game.turn / TURNS_PER_YEAR);
  const traits = traitsOf(game);

  // LE SOMMET D'UNE CARRIÈRE SE LIT SUR DEUX LIGNES, PAS UNE. La direction
  // d'un parti n'est plus une marche de l'échelle : sans cette mention, une
  // carrière qui a tenu son camp pendant douze ans se résumait à « député ».
  const sommet = game.ended.type === "victory"
    ? t("pos_president")
    : t("pos_" + game.peakPosition) + (game.peakLead ? " · " + t("pos_chef") : "");

  const fait = (label, valeur) => (
    '<p class="fact"><span>' + label + "</span><strong>" + valeur + "</strong></p>"
  );

  /* UNE PAGE DE RELEVÉ, ET UN SEUL AXE.
     Les versions précédentes empilaient des blocs centrés, des blocs alignés
     à gauche, un grand nombre au milieu et des cadres au hasard : rien ne
     tombait sur rien, et l'œil n'avait aucun bord auquel se raccrocher. La
     page est maintenant construite comme un relevé de journal — un titre
     plein cadre, un bandeau de verdict qui traverse toute la largeur, puis
     deux colonnes qui gardent le même bord du haut jusqu'en bas. Tout est
     aligné à gauche, sauf ce qui se lit comme un chiffre et qui va se ranger
     à droite de sa ligne. */
  host.innerHTML =
    '<div class="end-page end-' + game.ended.type + '">' +

      /* 1. L'ENTÊTE — ce qui vient d'arriver. */
      '<header class="end-head">' +
        '<p class="end-kicker"><span class="end-crest" aria-hidden="true">★</span>' +
          cardHeader() + "</p>" +
        '<h2 class="end-title">' + L(ending.title) + "</h2>" +
        '<p class="end-text">' + L(ending.text) + "</p>" +
      "</header>" +

      /* 2. LE BANDEAU — ce que la postérité en fait. Le rang à gauche, le
         total à droite : c'est une ligne, pas un monument au milieu. */
      '<div class="end-verdict">' +
        '<div class="end-verdict-rank">' +
          '<span class="end-label">' + t("end_score_title") + "</span>" +
          '<strong>' + t(note.rank) + "</strong>" +
        "</div>" +
        '<div class="end-verdict-score">' +
          '<span class="end-score-value">' + note.total + "</span>" +
          '<span class="end-label">' + t("end_score_unit") + "</span>" +
        "</div>" +
      "</div>" +

      /* 3. LE RELEVÉ — deux colonnes, un seul bord. */
      '<div class="end-columns">' +
        '<section class="end-col">' +
          '<p class="end-label">' + t("end_timeline_title") + "</p>" +
          timelineHTML() +
          journalHTML() +
        "</section>" +
        '<section class="end-col">' +
          '<p class="end-label">' + t("end_recap_title") + "</p>" +
          '<div class="end-facts">' +
            fait(t("end_recap_years"), years) +
            fait(t("end_recap_peak"), sommet) +
            fait(t("end_recap_money"), formatMoney(game.money)) +
          "</div>" +
          (traits.length
            ? '<p class="end-label end-label-space">' + t("end_recap_traits") + "</p>" +
              '<div class="end-traits">' + traitRowsHTML(traits) + "</div>"
            : "") +
          foldHTML(t("end_score_detail"), '<ul class="note-lines">' + scoreLinesHTML() + "</ul>") +
        "</section>" +
      "</div>" +

      '<div class="end-actions">' +
        '<button type="button" class="event-choice event-continue" data-restart>' + t("game_restart") + "</button>" +
      "</div>" +
    "</div>";
}
