/*
 * RENDU — L'ÉCRAN DE FIN.
 *
 * Le moteur ne connaît qu'une poignée de TYPES de fin (victoire, retraite,
 * retrait, mort, condamnation). Le texte, lui, est choisi par resolveEnding()
 * dans endings.data.js, qui prend la première entrée dont le `when` colle à
 * l'état final : la même victoire ne se raconte pas de la même façon selon ce
 * qu'on a laissé derrière soi. Ici on ne fait que dessiner le récit et le
 * relevé de carrière.
 */

function renderEnd(host) {
  // La fin dépend de l'état exact de la carrière : la même victoire ne se
  // raconte pas de la même façon selon ce qu'on a laissé derrière soi.
  const ending = resolveEnding(game) || { title: { fr: "", en: "" }, text: { fr: "", en: "" } };
  const years = Math.floor(game.turn / 2);
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
      '<div class="end-recap">' +
        '<p><span>' + t("end_recap_years") + "</span><strong>" + years + "</strong></p>" +
        '<p><span>' + t("end_recap_peak") + "</span><strong>" +
          sommet + "</strong></p>" +
        '<p><span>' + t("end_recap_money") + "</span><strong>" + formatMoney(game.money) + "</strong></p>" +
      "</div>" +
      (traits.length
        ? '<div class="end-traits">' +
            '<p class="end-traits-title">' + t("end_recap_traits") + "</p>" +
            traitRowsHTML(traits) +
          "</div>"
        : "") +
      '<div class="event-choices">' +
        '<button type="button" class="event-choice event-continue" data-restart>' + t("game_restart") + "</button>" +
      "</div>" +
    "</div>";
}
