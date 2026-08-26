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

  rows.push(ligne(Math.floor(game.turn / TURNS_PER_YEAR) + 1, t("frise_end"), "end", game.party));

  return (
    '<div class="end-frise">' +
      '<p class="end-section-title">' + t("end_timeline_title") + "</p>" +
      '<ol class="frise-list">' + rows.join("") + "</ol>" +
    "</div>"
  );
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

function scoreHTML() {
  const note = careerScore(game);

  /* CINQ CHIFFRES, PAS CINQ LIGNES. Le relevé a d'abord été écrit en cinq
     rangées avec leur libellé, leur détail et leur total : posé sous un
     grand nombre, sous un rang et sous un récapitulatif, cela faisait quatre
     blocs de chiffres à la suite, et un écran de fin qui pèse plus lourd que
     la carrière qu'il résume. Le total reste gros parce que c'est lui qu'on
     lit, le rang reste la phrase qu'on retient, et la décomposition tient
     sur une ligne — avec le détail au survol, pour qui veut savoir d'où
     vient sa part. */
  const chips = note.lines.map((line) => (
    '<span class="note-chip" title="' + escapeAttr(t(line.key) + " — " + scoreDetail(line)) + '">' +
      '<span class="note-chip-label">' + t(line.key + "_short") + "</span>" +
      '<span class="note-chip-points' + (line.points < 0 ? " is-down" : "") + '">' +
        (line.points > 0 ? "+" : "") + line.points + "</span>" +
    "</span>"
  )).join("");

  return (
    '<div class="end-note">' +
      '<p class="end-section-title">' + t("end_score_title") + "</p>" +
      '<p class="note-total"><strong>' + note.total + "</strong>" +
        '<span>' + t("end_score_unit") + "</span></p>" +
      '<p class="note-rank">' + t(note.rank) + "</p>" +
      '<p class="note-chips">' + chips + "</p>" +
    "</div>"
  );
}

/* -------------------------------------------------------------------------- */

function renderEnd(host) {
  // La fin dépend de l'état exact de la carrière : la même victoire ne se
  // raconte pas de la même façon selon ce qu'on a laissé derrière soi.
  const ending = resolveEnding(game) || { title: { fr: "", en: "" }, text: { fr: "", en: "" } };
  const years = Math.floor(game.turn / TURNS_PER_YEAR);
  const traits = traitsOf(game);

  // LE SOMMET D'UNE CARRIÈRE SE LIT SUR DEUX LIGNES, PAS UNE. La direction
  // d'un parti n'est plus une marche de l'échelle : sans cette mention, une
  // carrière qui a tenu son camp pendant douze ans se résumait à « député ».
  const sommet = game.ended.type === "victory"
    ? t("pos_president")
    : t("pos_" + game.peakPosition) + (game.peakLead ? " · " + t("pos_chef") : "");

  host.innerHTML =
    '<div class="event-card end-card end-' + game.ended.type + '">' +
      '<p class="event-tag">' + cardHeader() + "</p>" +
      '<p class="end-title">' + L(ending.title) + "</p>" +
      '<p class="event-text">' + L(ending.text) + "</p>" +
      // TROIS FAITS, UNE LIGNE. Ils occupaient trois rangées bordées juste
      // au-dessus de la note : deux tableaux de chiffres l'un sur l'autre.
      '<p class="end-meta">' +
        t("end_meta_years").replace("{n}", years) + " · " + sommet + " · " +
        formatMoney(game.money) +
      "</p>" +
      scoreHTML() +
      timelineHTML() +
      (traits.length
        ? '<div class="end-traits">' +
            '<p class="end-section-title">' + t("end_recap_traits") + "</p>" +
            traitRowsHTML(traits) +
          "</div>"
        : "") +
      '<div class="event-choices">' +
        '<button type="button" class="event-choice event-continue" data-restart>' + t("game_restart") + "</button>" +
      "</div>" +
    "</div>";
}
