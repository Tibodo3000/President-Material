/*
 * RENDU — LA FICHE DE GAUCHE.
 *
 * Qui vous êtes, où vous en êtes, et ce qui vous attend : l'état civil, les
 * deux jauges de carrière, les huit statistiques, et le calendrier électoral
 * qui coiffe la carte.
 *
 * LE CALENDRIER EST UNE PROJECTION, PAS UNE PROMESSE. Il lit la fonction et
 * la cote du moment pour dire, de chaque échéance à venir, ce qu'elle
 * signifierait AUJOURD'HUI : le siège qu'on peut prendre, celui qu'on
 * défend, l'investiture qui n'est pas gagnée, ou le scrutin qui se jouera
 * sans vous. C'est précisément ce qui le rend utile — on a le temps de les
 * changer.
 *
 * Les rangées de statistiques elles-mêmes sont construites par buildStatRows()
 * dans data.js : elles sont partagées avec les pages de création.
 */

function fmtAge(age) {
  const years = Math.floor(age);
  return currentLang === "fr" ? years + " ans" : "Age " + years;
}

function seasonLabel() {
  return t(game.turn % 2 === 0 ? "season_spring" : "season_autumn");
}

/** Une jauge 0-100 : libellé, barre et valeur. */
/**
 * Une jauge, avec LE REPÈRE DE SON NIVEAU NATUREL.
 *
 * Les deux jauges glissaient toutes seules vers une cible que le joueur ne
 * voyait nulle part : il constatait une baisse sans jamais pouvoir apprendre
 * d'où elle venait. Le repère est le même que celui du plafond d'énergie, qui
 * existait déjà et qui fonctionnait : un trait sur la barre, et une phrase au
 * survol qui dit ce que c'est.
 */
function renderGauge(key, value, labelKey, target) {
  document.getElementById("gauge-" + key + "-label").textContent = t(labelKey);
  document.getElementById("gauge-" + key + "-fill").style.width = value + "%";
  document.getElementById("gauge-" + key + "-value").textContent = value;

  const bar = document.getElementById("gauge-" + key + "-fill").parentElement;
  if (target === undefined) return;

  bar.classList.add("has-ceiling");
  bar.style.setProperty("--ceiling", clamp100(target) + "%");
  const ligne = bar.closest(".gauge") || bar.parentElement;
  if (ligne) ligne.setAttribute("title", t("gauge_target_title"));
}

function renderStatus() {
  document.getElementById("sheet-name").textContent =
    game.character.name || t("sheet_name_empty");

  // Le nom du camp est détaché du reste pour porter sa couleur. Construit en
  // DOM plutôt qu'en chaîne : cette ligne contient le nom du personnage à un
  // caractère près, et elle n'a jamais eu besoin d'innerHTML.
  const meta = document.getElementById("sheet-meta");
  meta.textContent = fmtAge(game.age) + " · ";
  const camp = document.createElement("span");
  camp.className = "sheet-meta-party";
  camp.textContent = t("party_" + game.party);
  meta.appendChild(camp);

  // La fonction, et la maison si on la tient. Le joueur qui prend son parti
  // doit voir, sur sa propre fiche, qu'il est toujours député.
  document.getElementById("sheet-meta-2").textContent =
    t("pos_" + game.position) + (leadsParty(game) ? " · " + t("pos_chef") : "");

  // Les deux jauges de carrière, en tête de fiche.
  renderGauge("pop", game.popularity, "label_popularity", popularityTarget(game));
  renderGauge("standing", game.standing, "label_standing", standingTarget(game));

  document.querySelectorAll(".stat-row").forEach((row) => {
    const stat = row.getAttribute("data-stat");
    const value = game.stats[stat];
    if (value === undefined) return;

    row.querySelector(".stat-bar-fill").style.width = (value / STAT_MAX) * 100 + "%";
    row.querySelector(".stat-row-value").textContent = value;

    // L'énergie est la seule statistique qui se dépense et se récupère. On
    // pose un repère sur sa barre, là où la récupération s'arrête : sans lui,
    // « récupération +4 » ne veut rien dire pour personne.
    if (stat !== "energie") return;
    const bar = row.querySelector(".stat-bar");
    bar.classList.add("has-ceiling");
    bar.style.setProperty("--ceiling", (energyCeiling(game) / STAT_MAX) * 100 + "%");
    row.setAttribute("title", t("energy_ceiling_title"));
  });

  document.getElementById("sheet-money").textContent = formatMoney(game.money);

  // Le solde annuel, juste sous la fortune : on doit voir tout de suite si
  // la carrière se finance ou si elle mange le capital.
  const solde = annualBalance(game);
  const soldeEl = document.getElementById("sheet-balance");
  soldeEl.textContent = (solde < 0 ? "−" : "+") + formatMoney(Math.abs(solde)) + " " + t("budget_per_year");
  soldeEl.classList.toggle("is-negative", solde < 0);

  // La prochaine échéance a quitté la fiche : elle est en haut de colonne,
  // dans le calendrier, avec les trois suivantes et ce qu'elles engagent.
  // La répéter ici en une ligne muette n'ajoutait rien.

  // Traits : ce que la carrière a laissé sur le personnage, avec ce que
  // chacun change écrit noir sur blanc.
  const traits = traitsOf(game);
  document.getElementById("trait-rows").innerHTML = traits.length
    ? traitRowsHTML(traits)
    : '<p class="trait-empty">' + t("traits_none") + "</p>";
}

/**
 * La frise. La première échéance porte tout : c'est celle qu'on prépare.
 * Les suivantes s'effacent progressivement, parce qu'à cinq ans on ne
 * prépare rien, on se contente de savoir que ça existe.
 *
 * ELLE COMMENCE PAR MAINTENANT, et c'est ce qui manquait. La pastille pleine
 * était posée sur la première échéance : sur une frise, une pastille pleine
 * à gauche se lit « vous êtes ici », et l'on comprenait donc que la
 * présidentielle avait lieu ce tour-ci alors qu'elle était dans un an. Le
 * repère de position est désormais une case à part, et les échéances sont
 * toutes devant lui, ce qui est leur place.
 */
function renderCalendar() {
  const host = document.getElementById("election-calendar");
  if (!host) return;

  // Deux moments où le calendrier n'a plus rien à annoncer. Pendant une
  // campagne, on est dedans : le laisser affiché déplaçait l'attention hors
  // de la seule chose qui compte. Et sur l'écran de fin, il ne reste aucune
  // échéance à personne ; on y annonçait encore des européennes à quelqu'un
  // qui venait de mourir.
  const muet = Boolean(game.campaign || game.race || game.support || game.ended ||
    (game.card && game.card.kind === "end"));
  const suite = muet ? [] : electionCalendar();
  if (!suite.length) { host.innerHTML = ""; host.hidden = true; return; }
  host.hidden = false;

  // UNE DATE ET UN NOM, RIEN DE PLUS. Chaque case portait aussi une ligne
  // disant ce que le scrutin engageait pour le joueur, « conseiller
  // municipal à votre portée ». C'était du bruit : trois lignes par case,
  // quatre cases, et l'œil ne trouvait plus la seule chose qu'il cherchait,
  // qui est la date. Ce que vaut une échéance se lit quand elle arrive.
  // CE QUI SE PASSE MAINTENANT, C'EST PARFOIS UN SCRUTIN. La case du présent
  // portait toujours l'année, y compris pendant une élection : on lisait donc
  // « Maintenant · Année 2 » au-dessus d'une carte qui annonçait les
  // législatives, et la frise contredisait la carte qu'elle surmonte. Quand
  // une échéance tombe sur le tour en cours, c'est elle qui est ici.
  const enCours = electionAtTurn(game.turn);
  const maintenant =
    '<li class="cal-step is-now">' +
      '<span class="cal-mark" aria-hidden="true"></span>' +
      '<span class="cal-when">' + t("cal_now") + "</span>" +
      // Sinon l'année, et rien de plus : les autres cases tiennent sur une
      // ligne et « Printemps · Année 15 » en réclamait deux, ce qui décalait
      // toute la frise. La saison est sur la carte, juste dessous.
      '<span class="cal-name">' +
        (enCours ? t("cal_elec_" + enCours.id)
                 : t("year_label") + " " + (Math.floor(game.turn / 2) + 1)) +
      "</span>" +
    "</li>";

  const cases = suite.map((entry, i) => (
    '<li class="cal-step' + (i === 0 ? " is-next" : "") + '">' +
      '<span class="cal-mark" aria-hidden="true"></span>' +
      '<span class="cal-when">' + horizonLabel(entry.inTurns) + "</span>" +
      // La frise a ses propres noms, plus courts : une case fait cent trente
      // pixels et « Parliamentary elections » y passe sur deux lignes.
      '<span class="cal-name">' + t("cal_elec_" + entry.id) + "</span>" +
    "</li>"
  )).join("");

  host.setAttribute("aria-label", t("cal_title"));
  host.innerHTML = '<ol class="cal-track">' + maintenant + cases + "</ol>";
}
