/*
 * President Material — LES DISTINCTIONS.
 * ============================================================================
 *
 * Une carrière ne laisse pas que des résultats d'élection. Ce fichier tient la
 * liste de ce que le jeu décerne : des distinctions gagnées en partie, une
 * fois, et qui restent acquises d'une partie à l'autre.
 *
 * Comme les autres fichiers de données, celui-ci est en syntaxe JSON stricte
 * et porte l'extension .js pour que le jeu s'ouvre sans serveur.
 *
 * ----------------------------------------------------------------------------
 * LA FICHE D'UNE DISTINCTION
 * ----------------------------------------------------------------------------
 *
 *   "id"      identifiant stable, jamais renommé : c'est lui qu'on écrit dans
 *             localStorage le jour où la distinction est obtenue. Le renommer
 *             reprendrait sa médaille à quelqu'un qui l'avait gagnée.
 *   "title"   { fr, en } — le nom sur la médaille.
 *   "hint"    { fr, en } — ce qu'on lit avant de l'avoir. Dit à quoi elle se
 *             gagne sans donner le mode d'emploi.
 *   "note"    { fr, en } — facultatif, ce qu'on lit une fois obtenue.
 *   "secret"  true si le nom lui-même doit rester caché jusqu'à l'obtention.
 *             La vitrine n'affiche alors ni titre ni indice.
 *
 * Les deux langues sont obligatoires : une distinction sans son anglais
 * s'affiche en français au milieu d'une page anglaise, sans rien casser et
 * sans que personne le voie.
 *
 * ----------------------------------------------------------------------------
 * LA LISTE EST VIDE, ET C'EST VOULU POUR L'INSTANT
 * ----------------------------------------------------------------------------
 * La vitrine sait déjà se dessiner, compter et se souvenir. Ce qui manque est
 * le contenu, et il s'ajoute ici sans toucher au reste : une entrée dans ce
 * tableau apparaît sur la page d'accueil au rechargement suivant.
 *
 * Ce qui reste à faire le jour où la liste se remplit : appeler
 * `unlockAchievement("son_id")` à l'endroit du moteur qui la mérite, dans
 * game.js ou dans le mode concerné.
 */
const ACHIEVEMENT_DATA = [

];
