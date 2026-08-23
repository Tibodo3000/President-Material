/*
 * TEMPS FORT — LE SCRUTIN QUI SE JOUE SANS VOUS.
 *
 * Le plus discret des huit. Quand une échéance tombe et que le joueur n'est
 * ni candidat ni assez proche du compte pour l'avoir jamais été, on ne lui
 * annonce pas le refus d'une investiture qu'il n'avait pas demandée : le pays
 * vote, on le lui raconte de l'extérieur, et il fait autre chose ce soir-là.
 *
 * Une seule carte, mais elle a son bandeau de scrutin, son résultat national
 * en tête et une scène par-dessus — d'où le mode plutôt qu'un événement
 * ordinaire. Ses boutons sont ceux de tout le monde (data-choice puis
 * data-continue) : il n'a donc pas de table de clics.
 *
 * Le résultat national lui-même vient de backgroundElectionText(), qui reste
 * au moteur : la carte d'élection ordinaire s'en sert aussi.
 */

/**
 * Ouvre la carte. Le scrutin est dépouillé tout de suite — le paysage bouge,
 * le journal l'enregistre — et la scène se joue par-dessus le résultat.
 */
function startAside(electionId) {
  const resultat = backgroundElectionText(electionId);
  addLog(resultat);
  const ev = drawAside();
  return {
    kind: "aside", id: ev.id, election: electionId,
    intro: fillMarks(L(resultat)), resolved: false,
  };
}

/**
 * Le paquet est petit et une carrière compte beaucoup d'échéances qu'on
 * regarde de loin : on accepte de revoir une scène déjà jouée, en évitant
 * seulement celle du scrutin précédent.
 */
function drawAside() {
  const eligible = ASIDE_EVENTS.filter((ev) => eventMatches({ ...ev, id: null }, game));
  let pool = eligible.length ? eligible : ASIDE_EVENTS;
  const autres = pool.filter((ev) => ev.id !== game.lastAsideId);
  if (autres.length) pool = autres;

  const ev = pool[randInt(pool.length)];
  game.lastAsideId = ev.id;
  setScene(ev);
  return ev;
}

function renderAsideCard(host, card) {
  const ev = eventById(card.id);
  host.innerHTML =
    '<div class="event-card event-card-election">' +
      electionBanner(card.election) +
      '<p class="event-tag">' + L(ev.tag) + " · " + cardHeader() + "</p>" +
      '<p class="event-text nomination-stake">' + card.intro + "</p>" +
      (card.resolved
        ? '<p class="event-text event-result">' + card.resultText + "</p>" +
          changesHTML(card.resultChanges) + continueButton("data-continue")
        : '<p class="event-text">' + fillText(ev.text, game) + "</p>" +
          '<div class="event-choices">' + choiceButtons(ev, game) + "</div>") +
    "</div>";
}

MODES.aside = { render: renderAsideCard };
