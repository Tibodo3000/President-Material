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

/** « Maire » plutôt que « Municipales · élu » : on dit le siège qu'on prend. */
function posLow(key) {
  const bas = t("pos_" + key + "_low");
  if (bas !== "pos_" + key + "_low") return bas;
  const nom = t("pos_" + key);
  return nom.charAt(0).toLowerCase() + nom.slice(1);
}

function timelineLabel(entry, frise, i) {
  const elec = (id) => t("cal_elec_" + id);

  if (entry.kind === "election") {
    if (entry.target === "chef") {
      return { text: t(entry.won ? "frise_house_won" : "frise_house_lost").replace("{elec}", elec(entry.id)),
               tone: entry.won ? "up" : "down" };
    }
    if (entry.won) {
      // MUNICIPALES · ÉLU NE DIT PAS QUOI. Le même scrutin donne un siège de
      // conseiller ou une mairie, et la frise ne faisait pas la différence.
      const gagne = entry.defense
        ? t("frise_kept").replace("{elec}", elec(entry.id))
        : t(entry.target ? "frise_elected_as" : "frise_elected")
            .replace("{elec}", elec(entry.id))
            .replace("{pos}", entry.target ? posLow(entry.target) : "");
      return { text: gagne, tone: "up" };
    }
    return { text: t(entry.defense ? "frise_lost_seat" : "frise_beaten").replace("{elec}", elec(entry.id)),
             tone: "down" };
  }

  // LA PRÉSIDENTIELLE PERDUE EST LE MOMENT LE PLUS IMPORTANT D'UNE CARRIÈRE
  // QUI N'A PAS GAGNÉ, et la frise n'en gardait rien.
  if (entry.kind === "presidentielle") {
    return { text: t(entry.stage === "first" ? "frise_pres_out" : "frise_pres_lost")
                     .replace("{n}", entry.share),
             tone: "down" };
  }

  // Ce que le pays fait pendant ce temps-là.
  if (entry.kind === "president") {
    return { text: fillGender(t(entry.again ? "frise_president_again" : "frise_president")
                     .replace("{name}", entry.name)
                     .replace("{party}", t("party_" + entry.party)), entry),
             tone: "world", party: entry.party };
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
    // PRENDRE LA MAISON SE DIT UNE FOIS. Le congrès du même tour porte déjà
    // « la maison est à vous » : on lisait les deux lignes à la suite.
    const congres = frise.some((e) => e.kind === "election" && e.target === "chef" &&
                                      e.turn === entry.turn && e.won === entry.on);
    if (congres) return null;
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

  // L'ANNÉE D'ABORD, LE FAIT ENSUITE. Sur une plaque centrée, la colonne des
  // dates se ferre à droite contre le fil, et le fait part à gauche : c'est
  // le seul agencement où la frise a deux bords nets au lieu d'un.
  const ligne = (an, texte, tone, party) => (
    '<li class="frise-step frise-' + tone + '"' +
      (party ? ' style="--frise-party: var(--p-' + party + ')"' : "") + ">" +
      '<span class="frise-when">' + t("frise_year").replace("{n}", an) + "</span>" +
      '<span class="frise-mark" aria-hidden="true"></span>' +
      '<span class="frise-what">' + texte + "</span>" +
    "</li>"
  );

  rows.push(ligne(1, t("frise_start"), "start", game.character.party));

  frise.forEach((entry, i) => {
    const label = timelineLabel(entry, frise, i);
    if (!label) return;
    const an = Math.floor(entry.turn / TURNS_PER_YEAR) + 1;
    rows.push(ligne(an, label.text, label.tone, label.party || entry.party || null));
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

  return '<ol class="frise-list">' + rows.join("") + "</ol>" +
    (game.careerPartial ? '<p class="frise-note">' + t("score_partial") + "</p>" : "");
}

/* --------------------------------------------------------------------------
   LA NOTE
   -------------------------------------------------------------------------- */

function scoreDetail(line) {
  const d = line.detail;

  /* UN RELEVÉ QUI NE SAIT PAS SE TAIT. Une partie commencée avant que la
     frise n'existe n'a pas d'archive : on annonçait « 0 an de mandat » et
     « aucun scrutin disputé » sous le nom d'un président de la République.
     Ce n'est pas une carrière vide, c'est une archive qui n'existait pas. */
  if (line.key === "score_office") {
    const parts = d.partiel ? [] : [t("score_office_detail").replace("{n}", d.annees)];
    if (d.lead) parts.push(t("score_office_lead"));
    return t("pos_" + d.sommet) + (parts.length ? " · " + parts.join(" ") : "");
  }
  if (line.key === "score_ballots") {
    if (d.partiel && !d.gagnes && !d.perdus) return t("score_partial");
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
function foldHTML(titre, contenu, extra) {
  return (
    '<details class="fold' + (extra ? " " + extra : "") + '">' +
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
  /* ------------------------------------------------------------------
     UNE PLAQUE COMMÉMORATIVE, PAS UN ÉCRAN DE RÉSULTATS.
     ------------------------------------------------------------------
     Quatre versions ont raté et elles ont raté de la même façon : on
     assemblait des blocs — un cadre ici, deux colonnes là, un nombre au
     milieu, une liste ferrée à gauche — sans qu'aucune règle ne les tienne
     ensemble. Et la page parlait de quelqu'un sans jamais le nommer, le nom
     du joueur vivant sur la fiche de gauche, qui disparaît ici.

     Le registre juste est celui que la direction artistique du jeu emploie
     déjà partout : nuit institutionnelle, or, typographie éditoriale. C'est
     une plaque. Une seule colonne étroite, tout centré sur un axe unique, la
     hiérarchie faite par les filets et les petites capitales, et beaucoup
     d'air. Rien ne peut être mal aligné parce qu'il n'y a qu'un alignement.

     L'ordre est celui d'une stèle : à qui, ce qu'il fut, ce qu'on en dit, ce
     que ça vaut, ce qu'il a fait, ce qu'il laisse. Les pièces justificatives
     — le détail du calcul, le journal des quarante ans — sont pliées en bas,
     là où l'on met les archives.
     ------------------------------------------------------------------ */
  const ending = resolveEnding(game) || { title: { fr: "", en: "" }, text: { fr: "", en: "" } };
  const note = careerScore(game);
  const years = Math.floor(game.turn / TURNS_PER_YEAR);
  const traits = traitsOf(game);
  const gagnes = (game.career || []).filter((e) =>
    (e.kind === "election" && e.won) || (e.kind === "office" && e.position === "president")).length;

  const sommet = game.ended.type === "victory"
    ? t("pos_president")
    : positionTitle(game.peakPosition, game.peakLead);

  const stat = (valeur, libelle) => (
    '<div class="end-stat"><strong>' + valeur + "</strong><span>" + libelle + "</span></div>"
  );

  host.innerHTML =
    '<div class="end-page end-' + game.ended.type + '">' +

      /* 1. À QUI. */
      '<header class="end-head">' +
        '<span class="end-crest" aria-hidden="true">★</span>' +
        '<p class="end-kicker">' + t("year_label") + " " +
          (Math.floor(game.turn / TURNS_PER_YEAR) + 1) + "</p>" +
        '<h2 class="end-name">' + (game.character.name || t("sheet_name_empty")) + "</h2>" +
        // Certaines fins s'intitulent exactement comme la fonction atteinte
        // (« Président de la République ») : on lisait le même mot deux fois
        // à trois lignes d'écart, en capitales puis en italique.
        // La fonction est déjà en manchette pour une victoire : on ne la
        // répète pas trois lignes plus haut.
        (game.ended.type === "victory" || fillText(ending.title, game) === sommet
          ? "" : '<p class="end-office">' + sommet + "</p>") +
        '<p class="end-identity">' + t("end_stat_age").replace("{n}", Math.floor(game.age)) +
          " · " + t("party_" + game.party) + "</p>" +
      "</header>" +

      /* 2. CE QU'ON EN DIT. */
      '<div class="end-story">' +
        // LES FINS ONT DROIT AUX MARQUES DE TEXTE. Elles passaient par L(),
        // qui ne résout rien : une fin ne pouvait donc pas nommer le camp du
        // joueur, et toutes celles qui parlent d'un parti devaient rester
        // vagues. fillText() sait le faire, comme pour n'importe quelle carte.
        // UNE VICTOIRE S'INTITULE « PRÉSIDENT DE LA RÉPUBLIQUE ». Le titre de
        // la fin sert à nuancer, pas à remplacer : « Élu quand même » en
        // manchette d'une page qui célèbre l'accession à l'Élysée enterre la
        // seule information qui compte. La nuance vit dans le texte, qui
        // change selon le camp et le parcours ; le titre, lui, ne bouge pas.
        '<p class="end-title">' +
          (game.ended.type === "victory" ? t("pos_president") : fillText(ending.title, game)) +
        "</p>" +
        '<p class="end-text">' + fillText(ending.text, game) + "</p>" +
      "</div>" +

      /* 3. CE QUE ÇA VAUT. */
      '<div class="end-verdict">' +
        '<p class="end-label">' + t("end_score_title") + "</p>" +
        '<p class="end-score">' + note.total + "</p>" +
        '<p class="end-rank">' + t(note.rank) + "</p>" +
        // Le détail appartient au chiffre qu'il explique : relégué dans les
        // archives du bas, il n'expliquait plus rien.
        foldHTML(t("end_score_detail"), '<ul class="note-lines">' + scoreLinesHTML() + "</ul>",
                 "fold-score") +
      "</div>" +

      /* 4. LE RELEVÉ — une colonne, et la frise au centre.
         Les deux colonnes coupaient la frise en deux et la reléguaient à
         côté d'une liste de traits : c'est pourtant elle le récit de la
         partie. Elle prend donc toute la largeur, le journal se déplie
         directement sous elle puisque c'est la même matière, et ce qu'on
         laisse ferme la page en petit. */
      '<section class="end-block">' +
        '<p class="end-label">' + t("end_recap_title") + "</p>" +
        '<div class="end-stats">' +
          stat(years, t("end_stat_years")) +
          stat(game.careerPartial && !gagnes ? "—" : gagnes, t("end_stat_won")) +
          stat(formatMoney(game.money), t("end_stat_money")) +
        "</div>" +
      "</section>" +

      '<section class="end-block end-block-frise">' +
        '<p class="end-label">' + t("end_timeline_title") + "</p>" +
        timelineHTML() +
        journalHTML() +
      "</section>" +

      (traits.length
        ? '<section class="end-block">' +
            '<p class="end-label">' + t("end_recap_traits") + "</p>" +
            '<div class="end-traits">' + traitRowsHTML(traits) + "</div>" +
          "</section>"
        : "") +

      '<div class="end-actions">' +
        '<button type="button" class="event-choice event-continue" data-restart>' + t("game_restart") + "</button>" +
      "</div>" +
    "</div>";
}
