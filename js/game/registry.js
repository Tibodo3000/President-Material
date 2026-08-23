/*
 * President Material — LE REGISTRE DES TEMPS FORTS.
 *
 * Un tour ordinaire, c'est une carte : on lit, on choisit, on continue. Mais
 * une campagne présidentielle, une course municipale, une primaire ou une
 * investiture refusée ne sont pas des cartes — ce sont de petites machines à
 * états qui durent plusieurs écrans, avec leur propre état, leur propre
 * tirage, leur propre dépouillement et leurs propres boutons.
 *
 * Le moteur les énumérait en dur : une branche par mode dans renderCard(),
 * cinq branches par mode dans handleClick(), et les morceaux d'un même temps
 * fort dispersés sur trois mille lignes. Ajouter un temps fort obligeait à
 * toucher six endroits sans rapport les uns avec les autres.
 *
 * Désormais chaque mode SE DÉCLARE ici, et le moteur ne connaît plus que ce
 * registre. Un nouveau temps fort, c'est un fichier et une ligne.
 *
 * ==========================================================================
 * LE CONTRAT
 * ==========================================================================
 * On s'enregistre sous le "kind" de la carte que l'on dessine :
 *
 *   MODES.race = {
 *     ready()            optionnel — l'état du mode est-il en place ?
 *                        (game.race, game.campaign… ; sans lui, on passe)
 *     render(host, card) obligatoire — dessine la carte dans #event-area
 *     clicks             { "data-race-next": (target) => {…} }
 *     clicksWhenEnded    les mêmes, mais qui répondent ENCORE une fois la
 *                        partie terminée (voir plus bas)
 *     renderWhenEnded    true si la carte doit s'afficher même partie finie
 *   };
 *
 * DEUX ASYMÉTRIES, ET ELLES SONT VOULUES. Le dépouillement d'une
 * présidentielle gagnée arrive alors que la partie est déjà terminée : il
 * faut pouvoir l'afficher (renderWhenEnded) et pouvoir cliquer le bouton qui
 * le referme (clicksWhenEnded), là où tout le reste est gelé dès que
 * game.ended est posé. Un seul mode s'en sert. Plutôt que de cacher ce cas
 * particulier dans une exception au fond du moteur, on le nomme.
 *
 * L'ORDRE DE CHARGEMENT. Ce fichier crée MODES : il se charge donc AVANT les
 * fichiers de js/game/modes/, qui s'y inscrivent au chargement. Le moteur
 * (js/game.js), lui, ne lit le registre qu'à l'exécution : il peut venir
 * après. Voir la liste de <script> dans game.html.
 */

const MODES = {};

/**
 * Le mode qui sait dessiner cette carte, s'il y en a un ET si son état est en
 * place. Un mode dont le ready() est faux ne prend pas la main : la carte
 * retombe sur le moteur, exactement comme le faisaient les gardes
 * `card.kind === "race" && game.race` qu'il remplace.
 */
function modeFor(card) {
  const mode = card && MODES[card.kind];
  if (!mode) return null;
  return !mode.ready || mode.ready() ? mode : null;
}

/**
 * Ce que le mode affiché sait faire de ce bouton, ou null s'il ne le connaît
 * pas — auquel cas le clic redescend vers les branches génériques du moteur
 * (data-choice, data-continue, data-restart…).
 *
 * On n'interroge QUE le mode de la carte affichée, jamais les autres : c'est
 * ce qui permet à "data-choice" d'être traité par la campagne quand une carte
 * de campagne est à l'écran, et par le moteur le reste du temps.
 */
function modeClick(card, target, ended) {
  const mode = modeFor(card);
  if (!mode) return null;

  const table = ended ? mode.clicksWhenEnded : mode.clicks;
  if (!table) return null;

  const attr = Object.keys(table).find((key) => target.hasAttribute(key));
  return attr ? table[attr] : null;
}
