/*
 * President Material — LE CORPS, ET LA FIN QU'IL IMPOSE.
 *
 * La santé, le déclin, l'accident, la mortalité et le retrait forcé.
 *
 * Le principe qui tient l'ensemble : LE CORPS PRÉVIENT TOUJOURS, SAUF QUAND
 * C'EST UN ACCIDENT. Une carrière ne doit pas s'arrêter sur un tirage muet.
 *
 * Tout ce fichier s'écrit PAR AN et se convertit en tours au dernier moment,
 * une seule fois, avec YEARS_PER_TURN. Les chiffres sont dans js/balance.js.
 */
/**
 * Mortalité : aucune avant 60 ans, puis une probabilité qui grimpe avec
 * l'âge.
 *
 * TOUT CE BLOC SE LIT PAR AN. Les chiffres étaient des probabilités par tour,
 * ce qui les rendait muets : ils changeaient de sens le jour où la durée d'un
 * tour changeait, et une mort tous les six mois n'est pas une notion. Ils
 * disent maintenant un risque annuel, et la conversion en tours se fait au
 * dernier moment, une seule fois, avec YEARS_PER_TURN.
 */
/**
 * LE CORPS PRÉVIENT TOUJOURS, SAUF QUAND C'EST UN ACCIDENT.
 *
 * La mort tombait à soixante-trois ans sur un personnage en pleine forme dont
 * rien, nulle part, n'avait annoncé quoi que ce soit. Une carrière ne doit pas
 * s'arrêter sur un tirage muet.
 *
 * Deux morts distinctes, donc. Celle qui vient de la santé n'est possible que
 * si le corps a déjà parlé. Et celle qui ne prévient pas, l'accident, reste
 * possible à tout âge parce que c'est ce qu'est un accident : elle est rare,
 * elle ne monte presque pas avec l'âge, et elle a droit à sa propre fin.
 */
const HEALTH_TRAITS = ["fragile", "obese", "use", "declin"];

/**
 * QUI TÉMOIGNE QUE LE CORPS A PARLÉ.
 *
 * C'était le dossier médical : santé déclarée fragile, ou l'un des traits qui
 * disent qu'on s'abîme. Mauvais témoin. Un trait pris à trente-cinq ans
 * ouvrait la mortalité à soixante sur quelqu'un qui n'avait plus rien vu
 * passer depuis vingt-cinq ans ; et à l'inverse, quelqu'un qui n'avait jamais
 * rien attrapé mourait à soixante-dix-huit ans sans qu'aucune carte de la
 * partie n'ait rien annoncé. Mesuré sur trois cents carrières : une mort sur
 * six et un retrait forcé sur cinq tombaient ainsi.
 *
 * Ce qui compte est ce que le joueur a LU. state.decline compte les scènes de
 * fin de carrière effectivement jouées — voir « LE CORPS PRÉVIENT, ET IL
 * PRÉVIENT SUR UNE CARTE » dans js/game.js — et rien d'autre n'ouvre la porte.
 */
function bodySpoke(state) {
  return (state.decline || 0) > 0;
}


function declineWeight(state) {
  return DECLINE_WEIGHT[Math.min(state.decline || 0, DECLINE_WEIGHT.length - 1)];
}

/** L'accident, par an : rare, sourd, et il n'a jamais prévenu personne. */
function accidentProbability(state) {
  return 0.0024 + Math.max(0, state.age - 55) * 0.00024;
}

function deathProbability(state) {
  if (state.age >= 92) return 1;

  // L'ACCIDENT NE PASSE PAS PAR LE CORPS, et c'est la seule chose qui ne
  // passe pas par lui : il faut qu'il reste quelque chose d'imprévisible
  // quand tout le reste est annoncé.
  let p = accidentProbability(state);

  if (bodySpoke(state)) {
    const poids = declineWeight(state);

    // La part « santé ».
    if (state.age >= 60) {
      let sante = ((state.age - 60) * 0.008 + 0.006) * poids;
      if (state.flags.carefulHealth) sante /= 2;
      if (state.flags.frailHealth) sante *= 1.6;
      p += sante;
    }

    // Passé un certain âge, le corps a parlé pour tout le monde — mais il a
    // parlé, et le joueur l'a lu.
    if (state.age >= 78) p += (state.age - 78) * 0.012 * poids;
  }

  return p * YEARS_PER_TURN;
}

/**
 * LE RETRAIT FORCÉ.
 *
 * Une carrière ne s'arrête pas toujours sur une victoire, une condamnation ou
 * un cercueil. Elle s'arrête aussi parce qu'un matin le corps ne suit plus,
 * parce qu'un nom ne revient pas devant les caméras, parce que l'entourage
 * organise la sortie avant que le pays ne s'en aperçoive. C'est la fin la
 * plus banale de toutes, et le jeu ne la racontait pas : on jouait jusqu'à
 * quatre-vingt-douze ans en pleine possession de ses moyens.
 *
 * Le risque commence à soixante-deux ans, monte avec l'âge, et l'épuisement
 * l'accélère : une carrière menée à bout de forces se termine plus tôt.
 * Comme pour la mort, la santé surveillée protège et la santé fragile coûte.
 */
function withdrawalProbability(state) {
  if (state.age < 62) return 0;

  // ON NE POUSSE PAS DEHORS QUELQU'UN QUE RIEN N'A ANNONCÉ. Quatre retraits
  // forcés sur cinq tombaient sur le seul critère de l'âge, sans qu'aucune
  // carte de la partie n'ait rien dit : c'est exactement la fin abrupte que
  // l'arc de fin de carrière existe pour supprimer.
  if (!bodySpoke(state)) return 0;

  // Par an, comme la mortalité : la conversion en tours est à la sortie.
  let p = (state.age - 62) * 0.006 * declineWeight(state);

  // LA FORME PROTÈGE, ET PAS SEULEMENT L'ÉPUISEMENT QUI ACCABLE.
  //
  // L'énergie n'ajoutait du risque que lorsqu'elle était basse : un homme de
  // soixante-sept ans en pleine forme courait exactement le même risque de
  // base qu'un homme épuisé du même âge, et se voyait pousser dehors sans
  // qu'aucune ligne de sa fiche ne l'explique. On ne pousse pas dehors
  // quelqu'un qui tient debout et que tout le monde voit tenir debout.
  const forme = state.stats.energie;
  if (forme >= 12) p *= 0.3;
  else if (forme >= 8) p *= 0.65;
  else if (forme <= 2) p += 0.04;
  else if (forme <= 5) p += 0.016;

  if (state.flags.carefulHealth) p /= 2;
  if (state.flags.frailHealth) p *= 2;
  return p * YEARS_PER_TURN;
}
