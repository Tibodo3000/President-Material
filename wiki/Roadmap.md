# Roadmap

Pistes d'évolution pour *President Material*. Rien ici n'est figé : ce sont des
intentions, classées par thème, avec pour chacune une note de mise en œuvre qui
s'appuie sur l'architecture actuelle (voir [architecture.md](architecture.md) et
[systems.md](systems.md)).

> Contrainte transversale à ne jamais perdre de vue : **le jeu s'ouvre en
> double-cliquant sur `index.html`, sans build ni serveur.** Toute évolution doit
> préserver cette propriété au runtime, ou l'assumer explicitement (cf. Docker,
> qui ne concerne que le *déploiement*, pas l'exécution).

---

## 1. Programme présidentiel : choisir ses mesures

**L'idée.** Pendant la campagne présidentielle, le joueur ne se contente plus de
répondre à des cartes : il **compose un programme** en sélectionnant des mesures
politiques. Chaque mesure déclenche trois réactions distinctes — celle de
**l'appareil du parti**, celle du **pays**, et celle de la **base militante** —
calculées selon deux choses : la **compatibilité** de la mesure avec le
positionnement du parti, et les **attentes des électeurs** du moment.

**Pourquoi.** C'est ce qui manque au dernier acte : aujourd'hui la présidentielle
se joue en six temps de campagne narratifs, mais le fond idéologique du candidat
n'est jamais mis en jeu. Un programme force l'arbitrage central de toute
campagne — plaire à sa base *ou* élargir — et le rend chiffré.

**Notes de mise en œuvre.**
- Les briques existent déjà : les quatre axes de positionnement
  (`PARTIES[key].axes` — `social` / `world` / `economy` / `power`, dans
  [data.js](../js/data.js)) donnent la **compatibilité** ; une mesure porterait
  ses propres positions sur ces axes, et la réaction du parti serait fonction de
  la distance à `partyAxes(party)`.
- Les **attentes des électeurs** peuvent dériver du `landscape` (le centre de
  gravité du pays) et de l'électorat visé au second tour — le même calcul que
  `rejectionRate()` / `runoff()` dans [game-data.js](../js/game-data.js).
- Trois retours ⇒ trois jauges/effets : **cote au parti** (`standing`),
  **popularité** (`popularity`), et un nouveau curseur de **ferveur militante**
  (qui jouerait sur le report de voix et la mobilisation au premier tour).
- Intégration naturelle : une **phase « programme »** insérée en tête de
  `startCampaign()` ([game.js](../js/game.js)), avant les `CAMPAIGN_STEPS`. Les
  mesures vivraient dans un nouveau fichier de données `js/programme.data.js`,
  sur le même modèle JSON pur que le reste (`{ fr, en }`, positions par axe,
  effets).
- Garde-fou d'écriture : une mesure populaire mais incompatible avec le parti
  doit coûter en cote ce qu'elle rapporte en voix — le même principe
  d'à-coups inversés que les événements.

---

## 2. Docker + GitHub Actions (déploiement automatisé)

**L'idée.** Empaqueter le projet dans un **conteneur Docker** pour simplifier le
déploiement, et utiliser les **GitHub Actions** pour automatiser build et
déploiement à chaque `push` sur `main`.

**Pourquoi.** Le site est aujourd'hui servi tel quel (pages statiques, sans
Jekyll). Un pipeline supprime l'étape manuelle et garantit qu'un push sur `main`
met à jour l'environnement en ligne sans intervention.

**Notes de mise en œuvre.**
- Le conteneur est trivial : un `nginx:alpine` qui sert les fichiers statiques
  (`index.html`, `css/`, `js/`). **Docker ne sert qu'au déploiement** — la
  propriété « double-clic sur `index.html` » reste intacte en local.
- Workflow `.github/workflows/deploy.yml` déclenché `on: push: branches: [main]`.
  Deux cibles possibles :
  - **GitHub Pages** (le plus simple, cohérent avec l'existant) : pas besoin de
    Docker, une action `actions/deploy-pages` suffit.
  - **Image Docker** poussée vers un registre (GHCR) puis déployée sur un
    hébergeur — utile seulement si l'on veut sortir de Pages.
- Valeur ajoutée quasi gratuite dans le même workflow : une **étape de
  validation** qui parse les fichiers `*.data.js` (voir idée n°6) et casse le
  build si un événement est malformé — un filet avant la mise en ligne.

---

## 3. Refonte du « Rapport de force » : camemberts par institution

**L'idée.** Remplacer le tableau de barres actuel par **trois diagrammes
camembert** représentant la répartition à l'**Assemblée nationale**, au **Sénat**
et au **Parlement européen**, avec un **tooltip** au survol dévoilant le détail
par parti.

**Pourquoi.** Le rapport de force actuel est une abstraction unique (une part
nationale d'intentions de vote). Distinguer trois assemblées rend le paysage plus
lisible *et* plus juste politiquement : on peut dominer l'Assemblée sans peser au
Sénat.

**Notes de mise en œuvre.**
- Changement de **modèle de données**, pas seulement d'UI. Aujourd'hui
  `game.landscape` est un seul dictionnaire parti → %. Il faudrait trois
  répartitions, mises à jour par des logiques différentes :
  - **Assemblée** — suit les législatives (rapide à bouger).
  - **Sénat** — suffrage indirect, grands électeurs : inerte, décalé, il change
    lentement et pas au même rythme.
  - **Parlement européen** — suit les européennes.
- Rendu : le projet n'a **aucune dépendance** — les camemberts se dessinent en
  **SVG pur** (arcs calculés à la main), dans l'esprit des icônes déjà présentes
  dans [party.js](../js/party.js). Couleurs par `--p-<party>`.
- Point de départ côté code : `renderLandscape()` dans [game.js](../js/game.js)
  et le pane `#pane-landscape` de [game.html](../game.html).
- Le tooltip reprend ce que la ligne de force affiche déjà (nom du parti, part,
  figures) mais au survol d'une part du camembert.

---

## 4. Responsive / jouable sur mobile

**L'idée.** Rendre l'interface utilisable sur téléphone.

**Pourquoi.** La mise en page de jeu est aujourd'hui pensée pour le bureau : deux
à trois colonnes (fiche à gauche, carte + panneaux à droite). Sur mobile, tout se
tasse.

**Notes de mise en œuvre.**
- Le CSS a déjà une section `Responsive` ([style.css](../css/style.css), vers la
  ligne 1068) : c'est le point d'ancrage.
- Le vrai chantier est le `game-layout` : passer les deux/trois colonnes en une
  seule, et transformer la **fiche du candidat** (stats, budget, traits) en
  **onglets ou tiroir** repliable, pour que la carte du tour reste au premier
  plan.
- Les boutons de choix, les barres de sondage et le camembert (idée n°3) doivent
  rester lisibles et tactiles à 360 px de large.
- Aucune logique de jeu n'est concernée : c'est un travail de CSS et de structure
  d'affichage.

---

## 5. Éclater les événements par fichier

**L'idée.** Sortir les événements de l'unique
[events.data.js](../js/events.data.js) (≈ 6 400 lignes) vers un **dossier dédié**,
avec **un fichier par thématique et/ou par mandat**.

**Pourquoi.** Le fichier est devenu difficile à naviguer. Il est déjà découpé en
~20 sections numérotées (Débuts de carrière, Médias, Argent, Appareil, Chaîne
judiciaire, Bruxelles, Gouvernement, Le corps…) : ces sections sont des fichiers
qui s'ignorent.

**Notes de mise en œuvre.**
- La **contrainte `file://` interdit les imports ES modules** (bloqués par CORS
  en local). Deux stratégies possibles :
  1. **Sans build (recommandé).** Chaque fichier `js/events/*.data.js` s'ajoute à
     un registre partagé, p. ex. `EVENT_DATA.events.push(...)`, et
     [game.html](../game.html) charge les fichiers dans l'ordre voulu via des
     balises `<script>`. Simple, fidèle à l'esprit du projet, au prix d'une liste
     de scripts à tenir à jour.
  2. **Avec un petit build.** Un script de concaténation régénère un
     `events.data.js` unique commité — mais cela réintroduit une étape de build,
     à ne faire qu'en lien avec l'idée n°2.
- Découpage naturel : reprendre les sections existantes (`debuts`, `medias`,
  `argent`, `appareil`, `judiciaire`, `sante`, `legislatif`, `rivaux`,
  `bruxelles`, `gouvernement`, `corps`…). Les quatre decks (`campaign`,
  `nomination`, `races`) peuvent devenir leurs propres fichiers du même coup.
- Rien ne change pour le moteur : `const EVENTS = EVENT_DATA.events` (dans
  [game-data.js](../js/game-data.js)) continue de tout lire, une fois le registre
  rempli.

---

## 6. Un éditeur d'événements (authoring)

**L'idée.** Un outil pour créer et modifier les événements sans écrire le JSON à
la main.

**Pourquoi.** Le schéma est riche (conditions `when`, deux formes de choix, jets
composites, une douzaine de types d'effets, traductions FR/EN obligatoires). À la
main, on oublie une traduction, on tape un identifiant de trait inexistant, ou on
laisse un événement sans choix inconditionnel.

**Notes de mise en œuvre.**
- Fidèle à l'esprit du projet : une **page HTML autonome**, sans dépendance, du
  type `tools/event-editor.html`, qui construit un événement via un formulaire et
  **exporte le JSON** prêt à coller (ou à télécharger).
- Elle peut **valider en connaissant les vocabulaires réels**, tous disponibles
  dans les données : les stats (`STAT_KEYS` dans
  [game-data.js](../js/game-data.js)), les partis (`PARTIES`), les positions
  (`LADDER`), les traits (`TRAIT_DATA`). Plus de faute de frappe sur un `trait`
  ou un `party`.
- Contrôles utiles : au moins un choix sans `when`, chaque texte présent en `fr`
  **et** `en`, `success`/`failure` obligatoires dès qu'il y a un `roll`, aperçu
  du texte avec les marques `{rival}` / `{party}` / accord en genre résolues.
- Se combine avec l'idée n°2 : la même validation peut tourner en Action pour
  refuser un événement malformé à l'entrée.

---

## 7. Un calendrier électoral crédible et dynamique

**L'idée.** Tenir un calendrier **crédible** — législatives tous les 5 ans,
municipales tous les 6 ans, européennes tous les 5 ans **à la proportionnelle**,
présidentielle tous les 5 ans — et surtout le rendre **dynamique** : un événement
doit pouvoir le bousculer (**dissolution de l'Assemblée**, **réforme
constitutionnelle**, etc.).

**Pourquoi.** Le calendrier actuel est une **fonction modulo pure** :
`electionAtTurn(turn)` renvoie l'élection dont `turn % cycle === offset`
([game.js](../js/game.js)), à partir de la table `ELECTIONS`
([game-data.js](../js/game-data.js)). Les périodes sont déjà à peu près justes
(2 tours = 1 an, donc `cycle 10` = 5 ans, `cycle 12` = 6 ans), mais **rien ne peut
les altérer** : une dissolution ne peut pas avancer les législatives, une réforme
ne peut pas changer une durée de mandat. Le calendrier est une horloge qu'aucun
événement n'a le droit de toucher.

**Ce que ça débloque (le vrai intérêt).** Un calendrier daté et interrogeable
n'est pas qu'une correction de réalisme, c'est un levier de game design :
- **Ancrer des événements sur une échéance précise** — une carte qui ne tombe que
  dans les mois précédant les législatives, une affaire qui sort *pile* pendant la
  campagne, une manœuvre d'appareil calée sur le congrès à venir.
- **Ouvrir des phases de campagne anticipées** que le joueur voit venir et
  **prépare** : se positionner, économiser énergie et argent, travailler
  l'appareil avant l'investiture. L'anticipation devient une mécanique à part
  entière — on ne subit plus l'échéance, on la joue en amont.

**Notes de mise en œuvre.**
- Remplacer le modulo par un **échéancier mutable** : par exemple
  `game.calendar = [{ id, turn }]`, une file d'échéances datées. `electionAtTurn()`
  lit la file au lieu de calculer un reste ; après chaque scrutin, on reprogramme
  sa prochaine occurrence à `+période`, la **période étant elle-même modifiable**.
- Nouveaux effets d'événement, dans l'esprit du reste :
  - `"dissolution": true` → reprogramme des législatives anticipées à court terme
    (et solde le mandat de député en cours) ;
  - `"reforme": { "scrutin": "presidentielle", "periode": 14 }` → change la durée
    d'un mandat (un retour au septennat, par ex.) ou bascule un scrutin vers la
    **proportionnelle**.
- **Condition d'ancrage** pour les événements : une nouvelle clé `when` du type
  `"beforeElection": { "id": "legislatives", "within": 4 }` — l'événement ne se
  déclenche que dans les N tours qui précèdent un scrutin donné. Impossible
  aujourd'hui, faute d'échéancier interrogeable ; naturel dès que les échéances
  sont datées. C'est ce qui permet de scénariser une pré-campagne (bruits
  d'investiture, sondages, alliances de dernière minute).
- **Phase de pré-campagne** : généraliser ce que `startCampaign()` fait déjà pour
  la présidentielle (six temps, sondage visible) à une **fenêtre qui s'ouvre avant
  l'échéance** — meetings, investitures, positionnement — au lieu de démarrer le
  jour du scrutin comme les « races » actuelles. Le joueur prépare la campagne, il
  ne la découvre pas dans l'isoloir.
- **Européennes à la proportionnelle** : le résultat répartit des sièges au
  prorata du `landscape` sur tout le pays, sans circonscription ni vainqueur
  unique — ce qui alimente directement le camembert « Parlement européen » de
  l'idée n°3. À distinguer des législatives et municipales, plus personnelles et
  majoritaires (cf. les coefficients d'`electionBase()`).
- Lisibilité : `nextElection()` et la « prochaine échéance » de la fiche doivent
  lire la file, pas le modulo ; une échéance avancée par une dissolution doit être
  annoncée au journal.
- Raffinement possible : le **couplage présidentielle → législatives** (les
  secondes suivant les premières), aujourd'hui figé par les `offset`.

---

## 8. Événements majeurs : la conjoncture nationale

**L'idée.** Une couche d'**événements majeurs qui transforment la méta** via des
**modificateurs durables** : crise économique, guerre, vague d'immigration,
scandale politique, boom économique… Chacun installe un **climat national** qui
tient plusieurs tours et infléchit tout le reste de la partie.

**Pourquoi.** Le jeu n'a aujourd'hui aucun « climat » d'ensemble : le `landscape`
dérive, les événements sont locaux, mais rien ne dit que le pays traverse une
récession ou une guerre. Or une carrière politique se fait et se défait sur la
conjoncture — une crise sécuritaire porte la droite, une récession coule le camp
au pouvoir, un boom récompense celui qui gouverne. Cette couche donne une **météo**
à la partie.

**Notes de mise en œuvre.**
- Nouvel état global, p. ex. `game.climate` (un état dominant actif, avec une
  durée), défini dans un `js/climate.data.js` en données pures — même modèle que
  les autres fichiers.
- Chaque climat porte des **modificateurs** :
  - **biais sur le paysage** (une vague migratoire ou une crise sécuritaire
    pousse `identitarians` / `conservatives` ; un boom aide le camp au pouvoir et
    les `liberals` ; un scandale d'establishment frappe qui gouverne et profite
    aux partis antisystème) — greffé sur `driftLandscape()`
    ([game.js](../js/game.js)) ;
  - **décalage des cibles de jauges** (une récession pèse sur la popularité du
    camp au pouvoir, dans la logique du malus ministre/premier de
    `popularityTarget`) ;
  - **pools d'événements spécifiques** débloqués par une nouvelle condition
    `when` du type `"climate": ["crise_eco"]` : des cartes de crise qui n'existent
    que pendant la crise ;
  - **redéfinition des attentes électeurs** de l'idée n°1 : en temps de guerre la
    stature et la fermeté priment, en récession l'économie — l'axe qui « compte »
    change avec le climat.
- Déclenchement : soit tiré en arrière-plan (probabilité par tour, comme la
  mortalité et le retrait forcé), soit au bout d'une chaîne d'événements. Entrée
  et sortie annoncées au journal ; durée limitée, prolongeable.
- Garde-fou : **un seul climat dominant à la fois** (ou un très petit nombre
  cumulables), sinon le paysage redevient illisible — même principe que le rappel
  au socle du `landscape`.
- Nouvel effet `"climate": "boom_eco"` pour installer un climat depuis une carte.
- Liens forts : avec l'idée n°3 (le climat déplace les trois assemblées
  différemment) et l'idée n°1 (il redéfinit ce que le pays attend d'un programme).

---

## Vue d'ensemble

| # | Piste | Portée | Effort estimé | Touche la logique de jeu ? |
|---|-------|--------|---------------|----------------------------|
| 1 | Programme présidentiel | Gameplay | Élevé | Oui (nouveau système) |
| 2 | Docker + GitHub Actions | Infra / déploiement | Faible | Non |
| 3 | Camemberts par institution | UI + modèle de données | Élevé | Oui (3 répartitions) |
| 4 | Responsive mobile | UI / CSS | Moyen | Non |
| 5 | Éclater les événements | Organisation du code | Moyen | Non |
| 6 | Éditeur d'événements | Outillage | Moyen | Non |
| 7 | Calendrier électoral dynamique | Gameplay + modèle de données | Moyen | Oui (échéancier mutable) |
| 8 | Conjoncture nationale (events majeurs) | Gameplay | Élevé | Oui (couche de modificateurs) |

Les deux pistes qui débloquent les autres : **n°5** (des fichiers d'événements
maniables) et **n°2** (un pipeline qui valide et déploie). Les plus riches en jeu
forment un ensemble cohérent : **n°1** (le programme), **n°3** (le paysage
institutionnel), **n°7** (le calendrier dynamique) et **n°8** (la conjoncture) se
nourrissent mutuellement — un climat déplace les assemblées, un calendrier
bousculé par une dissolution rebat les cartes, et le programme se juge à l'aune de
ce que le pays attend au moment où il vote.
