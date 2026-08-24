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

> ✅ **Livré.** Les 276 événements sont répartis dans `js/events/` : 12 fichiers
> thématiques (`debuts`, `medias`, `argent`, `appareil`, `chaines`, `rivaux`,
> `vie_privee`, `partis`, `caractere`, `institutions`, `grandes_decisions`,
> `divers`) plus un fichier par deck auxiliaire, réassemblés dans `EVENT_DATA` par
> `_assemble.data.js`. **Sans build** (stratégie 1 ci-dessous), moteur inchangé,
> découpage vérifié par égalité profonde contre l'ancien fichier.

**L'idée.** Sortir les événements de l'unique `js/events.data.js` (≈ 9 300 lignes)
vers un **dossier dédié**, avec **un fichier par thématique et/ou par mandat**.

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

> ✅ **Livré.** [`tools/event-editor.html`](../tools/event-editor.html) — page
> autonome, sans dépendance, ouverte par double-clic. Elle charge les vraies
> données du jeu (vocabulaire toujours synchronisé), construit un événement via un
> **formulaire complet** (général, conditions `when`, choix certains ou à jet,
> effets, branches, `effectsIf`), **valide** en direct contre le schéma, **prévisualise**
> le texte FR/EN, **enregistre des brouillons** dans `localStorage` avec annulation /
> rétablissement, et **exporte le JSON** en nommant le fichier de thème cible. Logique
> dans `tools/editor.js`, styles dans `tools/editor.css`.

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

## 9. Éclater `game.js` : le moteur d'un côté, les temps forts de l'autre

> ✅ **Livrée, les deux étapes.** Les sept temps forts sont sortis dans `js/game/modes/`,
> derrière un **registre** (`js/game/registry.js`) que le moteur interroge au lieu
> d'énumérer les modes. **`game.js` : 5 825 → 4 014 lignes** (−31 %) ; `renderCard()`
> passe de 284 à 73 lignes et `handleClick()` de **385 à 51**. Refactor purement
> mécanique, vérifié par **égalité de trace sur 200 carrières entières** (53 446
> étapes, octet pour octet), inventaire des fonctions identique (0 perdue, 0
> dupliquée), et une carrière complète jouée dans le navigateur, rechargement de
>
> **Étape 2 livrée aussi.** Le rendu est sorti dans `js/game/render/` : `fiche.js`
> (la fiche de gauche), `panneaux.js` (les trois panneaux), `carte.js` (de quoi une
> carte est faite : bandeau, boutons, puces, sondage), `budget.js`, `fin.js`.
> **`game.js` : 4 060 → 3 101 lignes**, soit **5 825 → 3 101 depuis le début**
> (−47 %). Il ne garde du rendu que `renderCard()`, qui ne dessine pas mais choisit
> qui dessine, et `renderAll()`, qui repeint dans l'ordre. Même vérification : 200
> carrières, trace identique octet pour octet, inventaire de 141 fonctions
> inchangé, dix carrières jouées dans le navigateur couvrant les dix types de
> carte, sans une erreur en console. La référence a été reprise sur `main` : le
> refactor a été rebasé sur trois commits de gameplay arrivés entre-temps, et
> c'est leur comportement qu'il reproduit à l'octet.
>
> Le découpage réel s'écarte un peu du plan : `pouvoir.js` et `effets.js` sont
> devenus `panneaux.js` (les trois panneaux vont ensemble, journal compris) et
> `carte.js` (les puces de conséquence ne se séparent ni des boutons de choix ni
> du bandeau : c'est le même meuble, et c'est ce qui fait qu'une carte de campagne
> et un événement ordinaire se ressemblent).
>
> Trois écarts assumés par rapport au plan ci-dessous :
> - **Le premier et le second tour tiennent dans un seul fichier**
>   (`presidentielle.js`). Ils partagent leur état (`game.campaign`, dont le second
>   tour n'est qu'une phase), leur tireur de scènes et leur carte : séparés, on
>   obtenait deux fichiers dont aucun ne se comprend seul.
> - **La chronologie des scènes reste au moteur.** `momentOf` / `momentFits` /
>   `rememberMoment` servent la course et la présidentielle des autres autant que la
>   campagne : ce n'est pas du code de campagne, c'est du vocabulaire partagé. Même
>   raison pour `pollHTML`, `standDown` et ce que vaut un résultat
>   (`ELECTION_OUTCOMES`, `applyOutcome`, `outcomeText`) — `resolveElectionRun()`
>   résout une élection sans campagne et s'en sert.
> - **La carte d'ouverture d'un scrutin et le choix du terrain** sont devenus des
>   modes à part entière, ce que le plan n'avait pas vu : neuf types de carte pour
>   sept fichiers.
>
> Ce qui reste dans le moteur et n'aurait pas dû : `enterElection()` appelle
> `startRace()` / `startSupport()` / `startAside()` pour OUVRIR un mode. Quelque
> chose doit décider quel temps fort une échéance devient, et cette décision lit
> l'enjeu du joueur, qui est affaire de moteur. Le registre lui retire la
> connaissance de la façon dont un mode se dessine et se comporte, pas celle du
> moment où il commence.
>
> Détail du contrat et tableau des fichiers : *The set pieces* dans
> [architecture.md](architecture.md).

**L'idée.** Sortir de l'unique [`js/game.js`](../js/game.js) (5 825 lignes) les
**huit « temps forts »** — la campagne présidentielle, l'entre-deux-tours,
la primaire, la campagne d'une élection ordinaire, l'investiture refusée, la
présidentielle qu'on ne dispute pas, la carte d'ouverture d'un scrutin, le scrutin
qui se joue sans vous — pour leur
donner **un fichier chacun**, dans un dossier `js/game/` sur le modèle de
`js/events/`. Ce qui reste dans `game.js` est le **moteur** : l'état, le pays, la
carrière, le tour de jeu, le rendu.

**Pourquoi.** Le fichier est aujourd'hui rangé **par couche technique** — tout le
tirage ensemble, tout le rendu ensemble, tous les clics ensemble — alors que
l'unité naturelle du code est **le mode**. Un temps fort est une petite machine à
états complète, et ses six morceaux sont dispersés sur toute la longueur du
fichier. Pour la présidentielle :

| Morceau | Où il se trouve aujourd'hui |
|---|---|
| son état (`game.campaign`) et son ouverture | `startCampaign()`, l. 1823 |
| la chronologie de ses scènes | `momentFits()` / `rememberMoment()`, l. 1383-1441 |
| son tirage | `pickCampaignScene()` / `drawCampaignEvent()`, l. 1884-1941 |
| sa résolution | `resolveFirstRound()`, l. 1962 ; `resolveRunoff()`, l. 2049 |
| son rendu | `renderCampaignCard()`, l. 4940 |
| ses clics | cinq branches de `handleClick()`, l. 5250-5318 |

Six endroits, plus de trois mille lignes d'écart entre le premier et le dernier. La même
dispersion vaut pour la course ordinaire, la primaire et l'investiture. Ajouter un
temps fort — ce que demandent explicitement les idées n°1 (une phase « programme »
en tête de `startCampaign()`) et n°7 (une fenêtre de pré-campagne avant l'échéance)
— oblige aujourd'hui à toucher six zones sans rapport les unes avec les autres.

**Le vrai levier : deux aiguillages qui deviennent des registres.** Le découpage
seul ne suffit pas. Tant que `renderCard()` (l. 4550) et `handleClick()` (l. 5238,
**385 lignes de branches `data-*` à plat**) énumèrent les modes en dur, sortir le
code ne fait que le déplacer. Chaque mode doit donc **se déclarer** :

```js
// js/game/modes/race.js
MODES.race = {
  start:  startRace,          // ouvre le mode, pose game.race
  render: renderRaceCard,     // dessine la carte
  clicks: {                   // ce que le mode sait faire
    "data-race-next": …,
    "data-race-done": …,
  },
};
```

`renderCard()` se réduit alors à chercher `MODES[card.kind]` et à lui passer la
main ; `handleClick()` interroge d'abord la table du mode actif, puis retombe sur
les branches génériques (`data-choice`, `data-continue`, `data-restart`). Le
moteur cesse de connaître la liste des temps forts : **un nouveau mode = un
fichier + une ligne de registre.** C'est exactement ce dont les idées n°1 et n°7
ont besoin.

**Découpage proposé.** Un fichier par mode, contenant son cycle de vie **entier** —
ouverture, tirage, résolution, rendu, clics :

| Fichier | Contenu | ≈ lignes |
|---|---|---|
| `js/game/modes/race.js` | `startRace`, `drawRaceEvent`, `racePoll`, `pollFor`, `moodFor`, `ELECTION_OUTCOMES`, `applyOutcome`, `resolveRace`, `renderRaceCard` | ~480 |
| `js/game/modes/presidentielle.js` | `presidentialField`, `startCampaign`, `pickCampaignScene`, `drawCampaignEvent`, les helpers de `moment`, `resolveFirstRound`, `renderCampaignCard` | ~415 |
| `js/game/modes/investiture.js` | `drawNomination`, `nominationBlocked`, `inTheRunning`, `lobbyGain`, `standDown`, la dissidence (`REBEL_*`), `blockedPitch` | ~345 |
| `js/game/modes/primaire.js` | `PRIMARY_*`, `primaryField`, `primaryDue`, `designateNominee`, `resolvePrimary` | ~245 |
| `js/game/modes/entre-deux-tours.js` | `startDuel`, `drawRunoffEvent`, `duelField`, `resolveRunoff`, `concedeElection` | ~155 |
| `js/game/modes/soutien.js` | `supportField`, `startSupport`, `supportPoll`, `supportMood`, `drawSupport`, `resolveSupport` — la présidentielle des autres | ~220 |
| `js/game/modes/scrutin.js` | `electionBanner`, `forcesHTML`, `sortanteHTML`, `scrutinStake`, `renderScrutinCard` — la carte d'ouverture | ~120 |
| `js/game/modes/aside.js` | `startAside`, `drawAside`, `backgroundElectionText` | ~90 |

Soit **≈ 2 070 lignes sorties**, et un `game.js` ramené autour de 3 750. Ce qui
reste y est cohérent : l'état et `newGame()`, le pays (paysage, cote, Assemblée,
coalition, défections, vie des figures), la carrière (calendrier, `playerStake`,
`setOffice`, scores d'élection), le tour de jeu (`advanceTurn` — **l'aiguillage
central, qui reste au moteur**), le tirage d'événement ordinaire, et tout le rendu.

**Étape 2.** Le rendu part à son tour dans `js/game/render/` (957 lignes), et
`game.js` devient le seul moteur. À ne faire qu'après l'étape 1, qui porte tout le
bénéfice — et c'est bien dans cet ordre que ça s'est fait.

**Notes de mise en œuvre.**
- **Même contrainte que l'idée n°5, même solution** : `file://` interdit les
  modules ES, donc des `<script>` dans [game.html](../game.html), chargés dans
  l'ordre, au prix d'une liste à tenir à jour. Aucun build.
- **L'ordre de chargement n'est presque jamais un problème** : les `function` sont
  hissées dans leur fichier et tous les appels ont lieu au *runtime*, une fois
  tout chargé. Deux exceptions à connaître :
  - `let game` (l. 18) est la variable globale que tout le monde lit : **son
    fichier se charge en premier**. Attention, `let`/`const` de premier niveau ne
    sont pas posés sur `window` — ils restent visibles des scripts suivants, mais
    pas des précédents.
  - une **constante dérivée d'un autre fichier** est évaluée au chargement. Il y
    en a exactement une aujourd'hui : `COALITION_DISTANCE = NEIGHBOUR_DISTANCE / 2`
    (l. 427, lit `game-data.js`). Règle : une constante reste dans le fichier qui
    la lit, et tout dérivé se charge après sa source.
- **Le format de sauvegarde ne bouge pas.** `pm-game` contient l'état entier ; le
  découpage ne doit toucher ni la forme de l'état ni les migrations de `init()`.
  Une partie en cours doit survivre au refactor — c'est le premier test.
- **Refactor purement mécanique, aucun changement de comportement.** Le projet n'a
  pas de tests : la vérification se fait comme pour l'idée n°5, par contrôle
  d'équivalence.
  - la liste triée des noms de fonctions avant/après doit être **identique**
    (aucune perdue, aucune dupliquée) ;
  - le `git diff` ne doit montrer que des déplacements, plus l'aiguillage
    transformé en registre ;
  - une partie jouée de bout en bout doit traverser **chacun** des huit modes :
    course municipale, investiture refusée, dissidence, primaire, présidentielle
    gagnée et perdue au premier tour, entre-deux-tours, présidentielle des autres.
- **Ordre de travail conseillé**, du plus isolé au plus intriqué, en vérifiant à
  chaque étape : `aside` → `scrutin` → `soutien` → `primaire` → `entre-deux-tours` →
  `race` → `investiture` → `presidentielle`. Les deux registres se posent **avant** la
  première extraction : c'est eux qui rendent les suivantes mécaniques.
- **Mettre à jour la doc du même coup** : le tableau des couches et la liste
  d'ordre de chargement de [architecture.md](architecture.md), et la section
  « The three special modes » de [game-loop.md](game-loop.md), qui décrit déjà ce
  découpage — le code se contentera de rattraper la documentation.

---

## Vue d'ensemble

| # | Piste | Portée | Effort estimé | Touche la logique de jeu ? |
|---|-------|--------|---------------|----------------------------|
| 1 | Programme présidentiel | Gameplay | Élevé | Oui (nouveau système) |
| 2 | Docker + GitHub Actions | Infra / déploiement | Faible | Non |
| 3 | Camemberts par institution | UI + modèle de données | Élevé | Oui (3 répartitions) |
| 4 | Responsive mobile | UI / CSS | Moyen | Non |
| 5 | Éclater les événements ✅ | Organisation du code | Moyen | Non |
| 6 | Éditeur d'événements ✅ | Outillage | Moyen | Non |
| 7 | Calendrier électoral dynamique | Gameplay + modèle de données | Moyen | Oui (échéancier mutable) |
| 8 | Conjoncture nationale (events majeurs) | Gameplay | Élevé | Oui (couche de modificateurs) |
| 9 | Éclater `game.js` (moteur / temps forts / rendu) ✅ | Organisation du code | Moyen | Non (refactor pur) |

Les trois pistes qui débloquent les autres : **n°5** (des fichiers d'événements
maniables), **n°9** (un moteur qui accepte un temps fort de plus sans qu'on
touche à six endroits) et **n°2** (un pipeline qui valide et déploie). Les plus
riches en jeu forment un ensemble cohérent : **n°1** (le programme), **n°3** (le
paysage institutionnel), **n°7** (le calendrier dynamique) et **n°8** (la
conjoncture) se nourrissent mutuellement — un climat déplace les assemblées, un
calendrier bousculé par une dissolution rebat les cartes, et le programme se juge
à l'aune de ce que le pays attend au moment où il vote. Les deux premières
passent d'ailleurs par le registre de modes de la n°9 : une phase « programme »
et une pré-campagne sont des temps forts, pas des rustines dans `startCampaign()`.
