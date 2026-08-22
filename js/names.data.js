/*
 * President Material — RÉSERVOIRS DE NOMS.
 * ============================================================================
 *
 * Ce fichier ne contient que des données, en syntaxe JSON stricte. Ajoutez,
 * retirez ou remplacez des noms librement, sans toucher au reste du code :
 * le générateur (randomName, dans js/data.js) se contente de piocher ici.
 *
 * (Il porte l'extension .js et non .json pour la même raison que
 * js/events/ : un vrai fichier .json exigerait un serveur web, alors
 * que le jeu s'ouvre en double-cliquant sur index.html.)
 *
 * ----------------------------------------------------------------------------
 * CE QUE CONTIENT CHAQUE LISTE
 * ----------------------------------------------------------------------------
 *   "female", "male"     Prénoms, toutes générations confondues. Le jeu nomme
 *                        un personnage de trente ans, mais aussi des rivaux
 *                        qui peuvent avoir vingt ans de plus que lui : les
 *                        prénoms d'époques différentes sont donc mélangés,
 *                        comme dans n'importe quelle assemblée élue.
 *
 *   "surnames"           Noms de famille courants. La liste suit la démographie
 *                        française plutôt que le seul annuaire d'autrefois :
 *                        on y trouve le Maghreb, l'Afrique de l'Ouest, le
 *                        Portugal, l'Italie, l'Espagne, l'Asie du Sud-Est,
 *                        l'Europe centrale et l'outre-mer.
 *
 *   "surnames_particle"  Noms à particule, tirés rarement. Ils sont là pour la
 *                        grande bourgeoisie et les dynasties.
 *
 *   "rates"              Probabilité des deux formes rares, entre 0 et 1 :
 *                          "particle" : nom à particule (de Montclar)
 *                          "double"   : nom composé (Garnier-Delmas), très
 *                                       présent dans la vie politique
 *                        Mettez 0 pour désactiver une forme.
 *
 * Aucun nom complet de personnalité réelle ne doit figurer ici : ce sont des
 * noms ordinaires, tirés au hasard, et une ressemblance ferait sortir le
 * joueur du jeu.
 */
const NAME_DATA = {

  "female": [
    "Adèle", "Agathe", "Agnès", "Aïcha", "Alice", "Alix", "Amandine", "Amina",
    "Aminata", "Anaïs", "Anne", "Anne-Claire", "Anne-Sophie", "Annick",
    "Ariane", "Assia", "Aude", "Aurélie", "Aurore", "Awa", "Béatrice",
    "Bénédicte", "Bernadette", "Blandine", "Brigitte", "Camille", "Capucine",
    "Carla", "Carole", "Caroline", "Catherine", "Cécile", "Céline", "Chantal",
    "Charlotte", "Chloé", "Christiane", "Christine", "Claire", "Clara",
    "Clémence", "Colette", "Constance", "Corinne", "Dalila", "Danièle",
    "Delphine", "Dounia", "Édith", "Élisabeth", "Élise", "Élodie", "Elsa",
    "Émilie", "Emma", "Estelle", "Éva", "Évelyne", "Fanny", "Farida", "Fatou",
    "Florence", "Françoise", "Gabrielle", "Gaëlle", "Geneviève", "Ghislaine",
    "Gisèle", "Hélène", "Hind", "Imane", "Inès", "Ingrid", "Isabelle",
    "Jacqueline", "Jeanne", "Joséphine", "Julie", "Juliette", "Justine",
    "Kahina", "Karima", "Karine", "Khadija", "Laëtitia", "Latifa", "Laure",
    "Laurence", "Léa", "Leïla", "Léna", "Linh", "Lise", "Louise", "Lucie",
    "Madeleine", "Maëlle", "Magali", "Malika", "Manon", "Margaux",
    "Marguerite", "Mariama", "Marie", "Marie-Claude", "Marie-France",
    "Marine", "Marion", "Martine", "Mathilde", "Maud", "Mélanie", "Meriem",
    "Michèle", "Monique", "Morgane", "Muriel", "Nadia", "Nadine", "Naïma",
    "Nathalie", "Nicole", "Noémie", "Nour", "Océane", "Odile", "Ophélie",
    "Patricia", "Pauline", "Rachida", "Romane", "Rosa", "Sabine", "Salomé",
    "Samira", "Sandrine", "Sarah", "Séverine", "Simone", "Solange", "Sonia",
    "Sophie", "Stéphanie", "Sylvie", "Thérèse", "Valérie", "Véronique",
    "Victoire", "Violaine", "Virginie", "Yasmina", "Yvonne", "Zoé", "Zohra"
  ],

  "male": [
    "Adrien", "Alain", "Albert", "Alexandre", "Alexis", "Amadou", "Amine",
    "André", "Antoine", "Antonin", "Arnaud", "Arthur", "Augustin", "Aymeric",
    "Baptiste", "Benjamin", "Benoît", "Bernard", "Bertrand", "Bilal", "Brice",
    "Bruno", "Cédric", "Charles", "Christian", "Christophe", "Claude",
    "Clément", "Corentin", "Cyril", "Damien", "Daniel", "David", "Denis",
    "Didier", "Édouard", "Emmanuel", "Enzo", "Éric", "Étienne", "Fabien",
    "Fabrice", "Farid", "Félix", "Florian", "Franck", "François", "Frédéric",
    "Gabriel", "Gaël", "Georges", "Gérard", "Gilles", "Grégoire", "Guillaume",
    "Guy", "Hakim", "Henri", "Hervé", "Hubert", "Hugo", "Ibrahima", "Idriss",
    "Ismaël", "Jacques", "Jean", "Jean-Baptiste", "Jean-Claude", "Jean-Louis",
    "Jean-Marc", "Jean-Pierre", "Jérémy", "Jérôme", "José", "Joseph", "Jules",
    "Julien", "Karim", "Kévin", "Laurent", "Léo", "Loïc", "Louis", "Luc",
    "Lucas", "Ludovic", "Maël", "Malik", "Mamadou", "Marc", "Marco",
    "Matthieu", "Maurice", "Maxime", "Mehdi", "Michel", "Mohamed", "Mounir",
    "Nabil", "Nathan", "Nicolas", "Noah", "Olivier", "Pascal", "Patrice",
    "Patrick", "Paul", "Philippe", "Pierre", "Quentin", "Rachid", "Raphaël",
    "Raymond", "Rémi", "Renaud", "René", "Robert", "Roland", "Romain",
    "Samir", "Samuel", "Sébastien", "Serge", "Seydou", "Sofiane",
    "Souleymane", "Stéphane", "Sylvain", "Théo", "Thibault", "Thierry",
    "Thomas", "Timothée", "Tristan", "Valentin", "Victor", "Vincent",
    "Xavier", "Yacine", "Yann", "Yassine", "Younes", "Youssef", "Yves"
  ],

  "surnames": [
    "Adam", "Allard", "Amrani", "Andrieu", "Arnaud", "Aubert", "Aubry",
    "Bailly", "Bamba", "Barbier", "Baron", "Baudry", "Beaumont", "Ben Amar",
    "Benhamou", "Bennani", "Berger", "Bernard", "Bertin", "Bertrand",
    "Bianchi", "Blanc", "Blanchard", "Blondel", "Boivin", "Bonnet",
    "Bouchard", "Boucher", "Boulanger", "Bourdon", "Bourgeois", "Boyer",
    "Brun", "Brunet", "Camara", "Carlier", "Caron", "Carpentier", "Cartier",
    "Chaouch", "Chapuis", "Charpentier", "Chartier", "Chauvet", "Chevalier",
    "Cissé", "Clément", "Colin", "Collet", "Colombo", "Cordier", "Costa",
    "Coulibaly", "Coulon", "Courtois", "Cousin", "Da Silva", "Daniel",
    "David", "Delacroix", "Delaunay", "Delcourt", "Delmas", "Denis", "Devaux",
    "Diallo", "Diarra", "Diop", "Djebbar", "Doucet", "Dubois", "Duchêne",
    "Duclos", "Dufour", "Duhamel", "Dumas", "Dumont", "Dupont", "Dupuis",
    "Dupuy", "Durand", "Duval", "Étienne", "Évrard", "Fabre", "Faivre",
    "Fall", "Faure", "Ferhat", "Fernandes", "Ferrari", "Ferreira", "Fischer",
    "Fleury", "Fontaine", "Fortin", "Foucher", "Fournier", "Gaillard",
    "Garcia", "Garnier", "Gauthier", "Gautier", "Geoffroy", "Germain",
    "Gilbert", "Girard", "Giraud", "Gomes", "Gomez", "Gonzalez", "Gosselin",
    "Grondin", "Gros", "Guérin", "Gueye", "Guillot", "Guyot", "Haddad",
    "Hamdi", "Hébert", "Henry", "Hernandez", "Hoarau", "Huet", "Humbert",
    "Imbert", "Jacquet", "Jacquot", "Joly", "Jourdan", "Keita", "Klein",
    "Kowalski", "Lacombe", "Lacroix", "Lafont", "Lahmar", "Lambert", "Lamy",
    "Langlois", "Laroche", "Lasserre", "Laurent", "Lavigne", "Lebrun",
    "Leclerc", "Lecomte", "Lefebvre", "Lefèvre", "Legrand", "Lemaire",
    "Lemoine", "Leroux", "Leroy", "Lesage", "Lévêque", "Lévy", "Lopes",
    "Lopez", "Lucas", "Maillard", "Mansouri", "Marchal", "Marchand",
    "Marques", "Martin", "Martinez", "Marty", "Masson", "Mathieu", "Maurel",
    "Maury", "Mercier", "Meunier", "Meyer", "Meziane", "Michaud", "Michel",
    "Millet", "Mokhtari", "Monnier", "Moreau", "Morel", "Moretti", "Morin",
    "Muller", "Naceri", "Ndiaye", "Nguyen", "Nicolas", "Noël", "Ollivier",
    "Ouali", "Pasquier", "Payet", "Pelletier", "Pereira", "Perez", "Perrin",
    "Perrot", "Petit", "Pham", "Picard", "Pichon", "Pineau", "Poirier",
    "Pons", "Poulain", "Prévost", "Prieur", "Rahmani", "Ramos", "Raynaud",
    "Renard", "Renaud", "Rey", "Ribeiro", "Richard", "Riou", "Rivière",
    "Robert", "Robin", "Roche", "Rodrigues", "Rolland", "Rossi", "Rousseau",
    "Roussel", "Rousset", "Roux", "Roy", "Ruiz", "Russo", "Sabatier",
    "Sahraoui", "Saïdi", "Sanchez", "Santos", "Sarr", "Schmitt", "Schneider",
    "Simon", "Slimani", "Soares", "Sow", "Sylla", "Tahri", "Tanguy",
    "Teixeira", "Tessier", "Texier", "Thomas", "Torres", "Toussaint", "Tran",
    "Traoré", "Turpin", "Vaillant", "Vallet", "Vasseur", "Verdier", "Vernet",
    "Vidal", "Vieira", "Vincent", "Vitali", "Voisin", "Weber", "Zaidi",
    "Zimmermann"
  ],

  "surnames_particle": [
    "d'Arbaud", "d'Aubigny", "de Beauregard", "de Fontenoy", "de Kergoat",
    "de La Chesnaye", "de Montclar", "de Rochefort", "de Saint-Aubin",
    "de Valcourt", "de Vaudreuil", "de Villeret", "du Plessis", "du Rozier"
  ],

  "rates": {
    "particle": 0.05,
    "double": 0.08
  }
};
