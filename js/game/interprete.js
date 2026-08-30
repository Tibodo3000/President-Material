/*
 * President Material — L'INTERPRÈTE D'ÉVÉNEMENTS.
 *
 * Le fichier que lisent les gens qui écrivent du contenu, et c'est pour cela
 * qu'il reste d'un seul tenant. Il lit le schéma d'un événement de bout en
 * bout : les conditions d'un "when" qui décident si une scène peut sortir, les
 * textes et leur accord en genre, les choix effectivement offerts et leur prix
 * en énergie, le jet de dés qui départage un pari, les effets appliqués puis
 * mesurés après coup, et les suites qu'un choix programme pour plus tard.
 *
 * CE FICHIER LIT EVENT_DATA AU CHARGEMENT. C'est le seul des sept à avoir une
 * contrainte d'ordre : il doit venir après js/events/_assemble.data.js.
 *
 * GENDER_MARKS EST LU DE L'EXTÉRIEUR. tools/valide-contenu.js va chercher la
 * table ici, en texte, pour contrôler le contenu sans charger le moteur.
 * Déplacer la table, c'est repointer l'outil.
 *
 * DEUX CHAÎNES PLATES L'OCCUPENT AUX DEUX TIERS : eventMatches, cinquante-
 * trois clefs "when" testées à la file, et applyEffects, une vingtaine de
 * branches. Ce sont deux registres qui s'ignorent. Les écrire comme tels est
 * l'axe B4 de wiki/Roadmap.md, et c'est ce qui permettrait à tools/editor.js
 * et tools/valide-contenu.js de lire ce vocabulaire au lieu de le redéclarer
 * chacun de son côté — les trois listes ont déjà divergé de douze entrées.
 *
 * Il remonte aussi plus haut que sa couche : applyEffects appelle setOffice,
 * switchParty, moveShare, ensureGovernment… qui vivent dans js/game.js.
 */
/* ==========================================================================
   Interpréteur d'événements
   ==========================================================================
   Les événements ne vivent plus dans le code mais dans js/events/*.data.js,
   éclatés par thème et assemblés dans EVENT_DATA par js/events/_assemble.data.js,
   sous forme de données pures. Ce qui suit sait les lire : évaluer une
   condition, tirer un dé, appliquer des effets.

   Ajouter un événement ne demande donc aucune ligne de code.
   ========================================================================== */

/* Les quatre saisons, dans l'ordre où l'année les donne. La table d'affichage
   vit dans js/game/render/fiche.js ; celle-ci est le vocabulaire du contenu. */
const SEASONS = ["printemps", "ete", "automne", "hiver"];

const EVENTS = EVENT_DATA.events;
const CAMPAIGN_EVENTS = EVENT_DATA.campaign;

/**
 * Deux paquets à part, tirés seulement au moment d'une élection.
 *
 *   NOMINATION_EVENTS  quand l'appareil refuse de vous investir. Le jeu
 *                      proposait toujours le même bouton, ce qui transformait
 *                      un moment de carrière en formalité.
 *   RACE_EVENTS        les deux ou trois temps d'une campagne locale. Une
 *                      élection ne se joue plus en un clic : on fait campagne,
 *                      puis on dépouille.
 */
const NOMINATION_EVENTS = EVENT_DATA.nomination || [];
const RACE_EVENTS = EVENT_DATA.races || [];

/**
 * Les scrutins où l'on n'est pas candidat. Ils mangeaient un tour entier
 * pour une phrase et un bouton « Continuer » : on traverse désormais la
 * campagne des autres en décidant quoi en faire.
 */
const ASIDE_EVENTS = EVENT_DATA.aside || [];

/**
 * La présidentielle qu'on ne dispute pas soi-même. Elle se réglait en un
 * clic : on y joue désormais trois temps, et ce qu'on y fait pèse un peu.
 */
const SUPPORT_EVENTS = EVENT_DATA.support || [];

/**
 * L'entre-deux-tours. Le joueur qualifié passait du dimanche soir au verdict
 * sans qu'on lui demande rien : quinze jours, le moment le plus regardé de la
 * vie politique française, et pas une seule décision à prendre. Il s'y joue
 * désormais trois temps, dont le grand débat, qui tombe toujours.
 */
const RUNOFF_EVENTS = EVENT_DATA.runoff || [];

/** Les sept statistiques, pour distinguer un effet de stat d'un autre effet. */
const STAT_KEYS = ["charisme", "eloquence", "energie", "sangfroid", "reseau", "notoriete", "reputation", "credibilite"];

/* ---------- Conditions ---------- */

/** Un événement est-il jouable dans l'état actuel de la partie ? */
/**
 * LE POIDS D'UNE SCÈNE PEUT DÉPENDRE DE LA SITUATION.
 *
 * Un poids fixe suffit à la plupart des cartes : une scène est rare ou elle
 * est courante, et elle l'est pareillement pour tout le monde. Certaines ne
 * marchent pas comme ça. Les cinq cents signatures sont une formalité pour
 * un camp qui pèse vingt-cinq pour cent et un mur pour celui qui en pèse
 * huit : la même scène doit être rare chez l'un et probable chez l'autre,
 * sans jamais devenir impossible ni obligatoire pour personne.
 *
 * "weightBonus" s'écrit comme "chanceBonus", qu'il reprend mot pour mot :
 * une liste de conditions et de valeurs, qui s'additionnent.
 *
 *   "weight": 1,
 *   "weightBonus": [ { "when": { "maxShare": 15 }, "value": 4 } ]
 */
function sceneWeight(ev, s) {
  let weight = ev.weight === undefined ? 2 : ev.weight;
  if (ev.weightBonus) {
    ev.weightBonus.forEach((b) => {
      if (!b.when || eventMatches({ when: b.when }, s)) weight += b.value;
    });
  }
  return Math.max(0, weight);
}

function eventMatches(ev, s) {
  const w = ev.when;

  // Un événement ne se joue qu'une fois par partie. Une carrière ne repasse
  // pas deux fois par la même scène, et revoir un texte déjà lu casse tout.
  // Seuls les temps morts, marqués "repeatable", peuvent revenir.
  if (!ev.repeatable && ev.id && s.seen && s.seen[ev.id]) return false;

  if (!w) return true;

  if (w.party && !w.party.includes(s.party)) return false;

  // LA POSITION, ET LE CAS PARTICULIER DE « CHEF ». La direction du parti
  // n'est plus une fonction mais un titre qu'on cumule : dans une liste de
  // positions, "chef" ne veut donc plus dire « votre case vaut chef » mais
  // « vous dirigez votre parti », quel que soit le mandat que vous tenez à
  // côté. Les quarante-trois événements écrits avant le cumul continuent de
  // sortir, et ils sortent pour la bonne personne.
  if (w.position && !w.position.some((p) => (p === "chef" ? leadsParty(s) : p === s.position))) return false;

  // La même chose, écrite en clair, pour une scène qui parle de la direction
  // sans rien exiger du mandat.
  if (w.partyLead !== undefined && leadsParty(s) !== w.partyLead) return false;
  if (w.origin && !w.origin.includes(s.character.origin)) return false;
  if (w.background && !w.background.includes(s.character.background)) return false;
  if (w.personality && !w.personality.includes(s.character.personality)) return false;

  if (w.minAge !== undefined && s.age < w.minAge) return false;
  if (w.maxAge !== undefined && s.age > w.maxAge) return false;
  if (w.minTurn !== undefined && s.turn < w.minTurn) return false;
  if (w.maxTurn !== undefined && s.turn > w.maxTurn) return false;
  if (w.minPopularity !== undefined && s.popularity < w.minPopularity) return false;
  if (w.maxPopularity !== undefined && s.popularity > w.maxPopularity) return false;

  // Ce que pense votre camp, et ce que pensent les autres. Une scène peut
  // exiger l'un sans l'autre, et c'est tout l'intérêt : on écrit enfin la
  // situation du candidat adoré des siens que le pays refuse.
  if (w.minBase !== undefined && basePopularity(s) < w.minBase) return false;
  if (w.maxBase !== undefined && basePopularity(s) > w.maxBase) return false;
  if (w.minGeneral !== undefined && generalPopularity(s) < w.minGeneral) return false;
  if (w.maxGeneral !== undefined && generalPopularity(s) > w.maxGeneral) return false;
  if (w.minStanding !== undefined && s.standing < w.minStanding) return false;
  if (w.maxStanding !== undefined && s.standing > w.maxStanding) return false;
  if (w.minMoney !== undefined && s.money < w.minMoney) return false;
  if (w.maxMoney !== undefined && s.money > w.maxMoney) return false;

  // COMBIEN DE FOIS LE CORPS A PARLÉ. Sert surtout aux fins : on ne raconte
  // pas de la même façon une sortie qu'on n'a pas vue venir et une sortie
  // qu'on a refusé de voir venir trois fois de suite.
  if (w.minDecline !== undefined && (s.decline || 0) < w.minDecline) return false;
  if (w.maxDecline !== undefined && (s.decline || 0) > w.maxDecline) return false;

  // CE QUE LES URNES ONT DIT, EN NOMBRE. Sert aux fins : on ne raconte pas
  // de la même façon un sommet atteint du premier coup et un sommet atteint
  // après trois défaites. La frise (game.career) est la seule mémoire du jeu
  // qui garde ça.
  if (w.minElectionsWon !== undefined || w.minElectionsLost !== undefined) {
    const frise = s.career || [];
    if (w.minElectionsWon !== undefined &&
        frise.filter((e) => e.kind === "election" && e.won).length < w.minElectionsWon) return false;
    if (w.minElectionsLost !== undefined &&
        frise.filter((e) => e.kind === "election" && !e.won).length < w.minElectionsLost) return false;
  }

  /* LA FIN DE L'ANNÉE. Quatre tours font une année, et le dernier est celui
     où l'on fait ses comptes : ce qu'on donne avant le 31 décembre, ce qu'on
     place, ce qu'on invite. Une scène qui parle d'argent qui dort n'a de sens
     qu'à ce moment-là, et elle sonnerait faux au printemps. */
  if (w.yearEnd !== undefined) {
    const dernier = (s.turn % TURNS_PER_YEAR) === TURNS_PER_YEAR - 1;
    if (dernier !== w.yearEnd) return false;
  }

  /* CE QUI VIENT, ET DANS COMBIEN DE TEMPS. Une scène peut parler d'une
     échéance précise : on ne compose pas une liste européenne trois ans avant
     les européennes, et l'événement qui le proposait tombait n'importe quand,
     à n'importe quelle distance du scrutin.

       "nextElection": ["europeennes"]   la prochaine échéance du calendrier
       "nextElectionIn": 3               et elle tombe dans trois tours au plus

     Les deux se lisent séparément : la première dit laquelle, la seconde dit
     à quelle distance, et une scène peut ne poser que l'une des deux. */
  if (w.nextElection || w.nextElectionIn !== undefined) {
    const suivante = typeof nextElection === "function" ? nextElection() : null;
    if (!suivante) return false;
    if (w.nextElection && !w.nextElection.includes(suivante.election.id)) return false;
    if (w.nextElectionIn !== undefined && suivante.inTurns > w.nextElectionIn) return false;
  }

  /* LA FIN DE VOTRE MANDAT, QUI N'EST PAS LA PROCHAINE ÉCHÉANCE.
     Le calendrier fait passer trois scrutins qui ne vous concernent pas entre
     deux renouvellements de votre siège : "nextElectionIn" dit quand le pays
     revote, jamais quand VOUS remettez votre mandat en jeu. Le moteur ne
     savait donc pas dire « à la fin de votre mandat », et une scène qui
     s'ouvre sur « le mandat s'achève et il faut dire si vous repartez »
     tombait n'importe quand, y compris sur un conseiller municipal élu de
     l'année.

       "seatUp": 2   le scrutin qui renouvelle VOTRE siège tombe dans deux
                     tours au plus

     Sans siège élu (militant, cadre du parti, ministre nommé), la condition
     est fausse : on ne finit pas un mandat qu'on n'a pas. */
  if (w.seatUp !== undefined) {
    const scrutin = typeof TARGET_ELECTION === "undefined" ? null : TARGET_ELECTION[s.position];
    if (!scrutin) return false;
    const tour = typeof turnOfNextElection === "function" ? turnOfNextElection(scrutin) : null;
    if (tour === null || tour - s.turn > w.seatUp) return false;
  }

  /* LA SAISON, pour ce qui n'arrive qu'à un moment de l'année. Une nappe
     phréatique ne se vide pas en février et une rentrée scolaire n'a pas lieu
     en juin. L'année commence au printemps, comme le calendrier électoral.
     "season": ["ete"], ou une liste pour plusieurs. */
  if (w.season) {
    const saison = SEASONS[s.turn % TURNS_PER_YEAR];
    if (![].concat(w.season).includes(saison)) return false;
  }

  if (w.stat) {
    for (const [key, range] of Object.entries(w.stat)) {
      const value = s.stats[key];
      if (range.min !== undefined && value < range.min) return false;
      if (range.max !== undefined && value > range.max) return false;
    }
  }

  // CE QU'ON A PAYÉ EST UNE CONDITION COMME UNE AUTRE. Un choix peut exiger
  // un niveau de conseil juridique ou de communication : c'est ainsi qu'un
  // budget devient jouable au lieu d'être une ligne comptable.
  if (w.legal !== undefined && investLevel(s, "juridique") < w.legal) return false;
  if (w.comms !== undefined && investLevel(s, "communication") < w.comms) return false;

  if (w.flag) {
    for (const [key, expected] of Object.entries(w.flag)) {
      if (Boolean(s.flags[key]) !== expected) return false;
    }
  }

  // Votre camp gouverne-t-il ? C'est ce qui ouvre les portes d'un ministère,
  // et ce qui ferme celles de l'opposition.
  if (w.ruling !== undefined) {
    const inPower = Boolean(s.president) &&
      (Boolean(s.president.isPlayer) || s.president.party === s.party);
    if (inPower !== w.ruling) return false;
  }

  // Un pacte en cours, ou pas de pacte du tout.
  if (w.allied !== undefined && Boolean(s.alliance) !== w.allied) return false;

  // DES LÉGISLATIVES ANTICIPÉES. Une campagne de vingt jours après une
  // dissolution ne ressemble à aucune autre, et ses scènes ne doivent pas
  // sortir dans une législative ordinaire.
  if (w.dissolved !== undefined) {
    const anticipee = Boolean(s.dissolution) && s.dissolution === s.turn;
    if (anticipee !== w.dissolved) return false;
  }

  // REDESCENDU D'UN CRAN. Vrai quand la fonction actuelle est en dessous du
  // sommet atteint dans la carrière : c'est la définition même d'un homme
  // qu'on présente encore par ce qu'il a été.
  if (w.belowPeak !== undefined) {
    const descendu = LADDER.indexOf(s.position) < LADDER.indexOf(s.peakPosition || "militant");
    if (descendu !== w.belowPeak) return false;
  }

  // LA COTE DU GOUVERNEMENT. C'est elle qui sépare une opposition qui
  // attend son tour d'une opposition qui sent le pouvoir à portée, et un
  // pouvoir tranquille d'un pouvoir aux abois.
  if (w.minApproval !== undefined && (s.approval || 0) < w.minApproval) return false;
  if (w.maxApproval !== undefined && (s.approval || 0) > w.maxApproval) return false;

  // L'ÉTAT DE L'ASSEMBLÉE : "absolue", "relative" ou "aucune". Une liste
  // accepte plusieurs états.
  if (w.majority !== undefined) {
    const etat = typeof majorityState === "function" ? majorityState() : "relative";
    const voulu = Array.isArray(w.majority) ? w.majority : [w.majority];
    if (!voulu.includes(etat)) return false;
  }

  /* ------------------------------------------------------------------------
     OÙ L'ON EST ASSIS DANS L'HÉMICYCLE.
     ------------------------------------------------------------------------
     "ruling" disait si l'on avait l'Élysée, et c'était tout : entre un camp
     qui gouverne avec deux cent quatre-vingt-quinze députés et le même camp
     qui négocie chaque texte, entre une opposition qui est le premier groupe
     et un groupe de dix-sept qui compte ses voix, le jeu ne faisait aucune
     différence. Quatre conditions le disent maintenant, et elles se
     combinent : c'est ce qui rend la carte d'Assemblée écrivable.

       inCoalition   votre camp vote les textes du gouvernement. Avec
                     "ruling": false, c'est l'allié du pouvoir — celui qui
                     soutient sans avoir l'Élysée, et qui le paie deux fois.
       firstGroup    votre parti est le premier groupe de l'Assemblée. Ce
                     n'est pas la même chose que gouverner, et c'est
                     exactement de là qu'on renverse un gouvernement.
       pivot         le gouvernement n'a pas la majorité, et il l'aurait avec
                     vous. C'est la position la plus chère de la République :
                     on ne vous demande rien, on vous achète.
       minSeats /    les sièges de votre parti. Cinq cent soixante-dix-sept
       maxSeats      en tout, deux cent quatre-vingt-neuf font la majorité.
     ---------------------------------------------------------------------- */
  if (w.inCoalition !== undefined) {
    const bloc = typeof governmentBloc === "function" ? governmentBloc() : [];
    if (bloc.includes(s.party) !== w.inCoalition) return false;
  }
  if (w.firstGroup !== undefined) {
    if (partyIsFirstGroup(s) !== w.firstGroup) return false;
  }
  if (w.pivot !== undefined) {
    if (partyIsPivot(s) !== w.pivot) return false;
  }
  if (w.minSeats !== undefined && partySeats(s) < w.minSeats) return false;
  if (w.maxSeats !== undefined && partySeats(s) > w.maxSeats) return false;

  // VOUS ÊTES PLUS AIMÉ QUE VOTRE PROPRE PRÉSIDENT. La situation la plus
  // instable d'un camp au pouvoir, et le jeu ne la connaissait pas : on
  // pouvait dépasser de vingt points celui qui occupe l'Élysée sans qu'une
  // seule scène ne s'en aperçoive.
  if (w.outshinePresident !== undefined) {
    if (outshinesPresident(s) !== w.outshinePresident) return false;
  }

  /* ------------------------------------------------------------------------
     QUI EST EN FACE, AU SECOND TOUR.
     ------------------------------------------------------------------------
     Toutes les conditions du jeu décrivent le joueur. Aucune ne décrivait
     l'adversaire, si bien qu'on pouvait proposer « attaquer son bilan » à
     quelqu'un qui affrontait un candidat n'ayant jamais rien gouverné : il
     n'y a pas de bilan à attaquer, et la scène disait le contraire.

       foeIncumbent  l'adversaire porte un bilan : il est à l'Élysée ou à
                     Matignon au moment du débat.
       foeParty      son camp, en toutes lettres.
       foeFar        son camp est loin du vôtre, au-delà du voisinage
                     idéologique. C'est ce qui ouvre le registre du front
                     républicain, et le ferme entre voisins.
     Elles ne valent que pendant l'entre-deux-tours, où le champ est connu.
     ---------------------------------------------------------------------- */
  if (w.foeIncumbent !== undefined || w.foeParty || w.foeFar !== undefined) {
    const foe = typeof runoffFoe === "function" ? runoffFoe() : null;
    if (!foe) return false;

    if (w.foeIncumbent !== undefined && foeHoldsOffice(foe) !== w.foeIncumbent) return false;
    if (w.foeParty && !w.foeParty.includes(foe.party)) return false;
    if (w.foeFar !== undefined) {
      const loin = ideologicalDistance(foe.party, s.party) > NEIGHBOUR_DISTANCE;
      if (loin !== w.foeFar) return false;
    }
  }

  /* ------------------------------------------------------------------------
     Y A-T-IL UN APPOINT ?
     ------------------------------------------------------------------------
     "minorClose" demande qu'il existe, dans le champ de la présidentielle, un
     candidat plus petit que vous et assez proche pour qu'un accord se signe.
     Sans elle, la scène du pacte sortait contre le plus petit du champ, d'où
     qu'il vienne, et racontait une alliance entre deux camps qui ne se
     parlent pas. Elle ne vaut que pendant une campagne, où le champ existe.
     ---------------------------------------------------------------------- */
  if (w.minorClose !== undefined) {
    const appoint = typeof campaignMinor === "function" ? campaignMinor() : null;
    if (Boolean(appoint) !== w.minorClose) return false;
  }

  // Le poids de votre camp dans le pays, en points d'intentions de vote.
  if (w.minShare !== undefined && (s.landscape[s.party] || 0) < w.minShare) return false;
  if (w.maxShare !== undefined && (s.landscape[s.party] || 0) > w.maxShare) return false;

  /* CE QUE LA CAMPAGNE A DÉJÀ COÛTÉ, en euros sortis depuis son ouverture.
     C'est ce qui permet à une scène de ne s'adresser qu'à celui qui a payé
     sa campagne, et de le prévenir pendant qu'il peut encore corriger. */
  if (w.minCampaignSpend !== undefined) {
    const compte = s.campaign || s.race;
    if (!compte || (compte.spent || 0) < w.minCampaignSpend) return false;
  }

  // LE CAMP D'À CÔTÉ GOUVERNE. C'est la situation qui ouvre Matignon à
  // quelqu'un qui n'est pas du camp du président : un gouvernement qui n'a
  // pas la majorité tout seul va la chercher chez son voisin le moins
  // éloigné, et il la paie avec un poste.
  if (w.rulingClose !== undefined) {
    const gouverne = s.president && !s.president.isPlayer ? s.president.party : null;
    const voisin = Boolean(gouverne) && gouverne !== s.party &&
      ideologicalDistance(gouverne, s.party) <= NEIGHBOUR_DISTANCE;
    if (voisin !== w.rulingClose) return false;
  }

  // Traits exigés, et traits rédhibitoires : c'est ce qui rend une carrière
  // irréversible. Un renégat ne se verra plus jamais proposer certaines portes.
  if (w.trait && !w.trait.every((id) => hasTrait(s, id))) return false;
  if (w.anyTrait && !w.anyTrait.some((id) => hasTrait(s, id))) return false;
  if (w.notTrait && w.notTrait.some((id) => hasTrait(s, id))) return false;

  return true;
}

/* ---------- Textes ---------- */

/**
 * Remplace les marques d'un texte localisé.
 *
 *   {rival}         le nom de la figure mise en scène par la carte
 *   {rival_party}   le nom de son parti
 *   {party}         le nom du vôtre
 *
 * La figure est tirée au moment où la carte sort et conservée dans la partie :
 * le nom ne change donc plus entre la question et le résultat, ni quand on
 * change de langue en cours de lecture.
 */
/**
 * Un nom propre ne dit rien tout seul. La première fois qu'une figure est
 * nommée dans une carte, on la présente comme le ferait un journal : son nom,
 * son parti, sa fonction. Les mentions suivantes s'en tiennent au nom, sinon
 * la phrase devient une notice.
 */
function scenePresentation(scene) {
  const parti = t("party_" + scene.party);
  const fonction = scene.position ? t("pos_" + scene.position).toLowerCase() : null;
  return scene.name + " (" + parti + (fonction ? ", " + fonction : "") + ")";
}

/* ==========================================================================
   L'ACCORD EN GENRE
   ==========================================================================
   Les figures du jeu sont tirées à pile ou face, femme ou homme, et les
   textes leur appliquaient un masculin dans les deux langues : « vous faites
   campagne pour lui » à propos d'Agathe Hernandez, « his candidacy » à propos
   de la même. Une figure sur deux était donc mal désignée.

   Chaque langue porte ses propres marques, puisque chaque langue accorde à sa
   façon : le français doit accorder l'article, le pronom et le participe, là
   où l'anglais n'a que le pronom. Une marque écrite avec une majuscule sort
   avec une majuscule, pour les débuts de phrase.

   Le possessif français est laissé de côté volontairement : « sa candidature »
   s'accorde avec la candidature, jamais avec la personne. Il n'y a rien à y
   marquer.
   ========================================================================== */

const GENDER_MARKS = {
  /* Français */
  il:    ["il", "elle"],
  le:    ["le", "la"],
  lui:   ["lui", "elle"],
  celui: ["celui", "celle"],
  un:    ["un", "une"],
  e:     ["", "e"],
  // « Première ministre » ne s'obtient pas en collant un e : la marque
  // porte le mot entier.
  premier: ["premier", "première"],
  /* Anglais */
  he:    ["he", "she"],
  him:   ["him", "her"],
  his:   ["his", "her"],
};

/**
 * Résout les marques d'accord d'un texte selon la figure mise en scène.
 * Employée à l'affichage comme au journal, pour que les deux disent la même
 * chose de la même personne.
 */
function fillGender(text, scene) {
  const femme = scene && scene.sex === "female";
  return String(text).replace(/\{([A-Za-zÀ-ÿ]+)\}/g, (mark, mot) => {
    const clé = mot.charAt(0).toLowerCase() + mot.slice(1);
    const paire = GENDER_MARKS[clé];
    if (!paire) return mark;
    const forme = paire[femme ? 1 : 0];
    return mot.charAt(0) === clé.charAt(0)
      ? forme
      : forme.charAt(0).toUpperCase() + forme.slice(1);
  });
}

function fillText(obj, s) {
  let text = L(obj);
  const scene = s.scene || anyRival(s);

  text = fillGender(text, scene);

  if (text.includes("{rival}")) {
    let premiere = true;
    text = text.replace(/\{rival\}/g, () => {
      if (!premiere) return scene.name;
      premiere = false;
      return scenePresentation(scene);
    });
  }
  if (text.includes("{rival_party}")) {
    text = text.replace(/\{rival_party\}/g, t("party_" + scene.party));
  }
  if (text.includes("{party}")) text = text.replace(/\{party\}/g, t("party_" + s.party));
  // AVEC SON ARTICLE. {party} rend « Centristes », ce qui ne se met pas
  // derrière un verbe : « vous menez Centristes à l'Élysée ». Le journal
  // avait déjà la forme correcte sous {party_the:clé} ; on l'ouvre aux
  // textes de carte et de fin, pour le camp du joueur.
  if (text.includes("{party_the}")) text = text.replace(/\{party_the\}/g, t("party_the_" + s.party));
  return text;
}

/**
 * Le même texte, mais dans les deux langues et destiné au journal.
 *
 * Les noms propres sont posés tout de suite, puisqu'un nom ne se traduit pas ;
 * les noms de partis restent des marques que le journal résoudra à
 * l'affichage. Une ligne écrite pendant une partie en français se relit donc
 * en anglais si le joueur change de langue.
 */
function fillBoth(obj, s) {
  const scene = s.scene || anyRival(s);

  const presentation = scene.name + " ({party:" + scene.party + "}" +
    (scene.position ? ", {pos_low:" + scene.position + "}" : "") + ")";

  const fill = (text) => {
    let premiere = true;
    return String(text)
      .replace(/\{rival\}/g, () => {
        if (!premiere) return scene.name;
        premiere = false;
        return presentation;
      })
      .replace(/\{rival_party\}/g, "{party:" + scene.party + "}")
      .replace(/\{party\}/g, "{party:" + s.party + "}");
  };

  // L'accord est posé tout de suite, comme les noms propres : le journal se
  // relit dans l'autre langue, mais la personne dont il parle ne change pas.
  const fillFr = (t2) => fill(fillGender(t2, scene));

  return { fr: fillFr(obj.fr), en: fillFr(obj.en || obj.fr) };
}

/* ---------- Effets ---------- */

/**
 * QUI EST VISÉ QUAND UNE SCÈNE VISE QUELQU'UN.
 *
 * "appeal" nommait les électorats par leur clef, plus "self" et "others". Il
 * manquait le seul mot dont les scènes ont vraiment besoin : CELUI D'EN
 * FACE. Refuser une alliance à la gauche radicale, humilier le chef du camp
 * qui gouverne, se faire adouber par le voisin, ce sont des gestes qui
 * s'adressent à un camp précis, et ce camp change à chaque partie : on ne
 * peut pas l'écrire en dur sans écrire six versions de la même scène.
 *
 * Le vocabulaire est donc exactement celui de "landscape", parce qu'il n'y a
 * aucune raison d'en retenir deux : "self", "scene", "ruling", "ally", ou une
 * clef de parti. "others" reste propre à l'opinion — il ne veut rien dire
 * pour un rapport de force.
 *
 * Une cible qui n'existe pas dans la partie (pas d'allié, pas de figure en
 * scène) ne fait rien, comme pour "landscape" : la scène joue quand même.
 */
function electoratesOf(s, token) {
  if (token === "others") {
    return Object.keys(PARTIES).filter((key) => key !== s.party);
  }
  const party = typeof landscapeTarget === "function"
    ? landscapeTarget(s, token)
    : (PARTIES[token] ? token : null);
  return party ? [party] : [];
}

/**
 * Applique un bloc d'effets et renvoie la liste de ce qui a réellement bougé.
 *
 * On mesure les écarts après coup plutôt que de recopier les valeurs
 * déclarées : une statistique déjà au plafond ne bouge pas, un gain de
 * popularité est raboté par les rendements décroissants, un trait déjà porté
 * ne se reprend pas. Le joueur doit voir ce qui s'est passé, pas ce qui était
 * prévu.
 */
function applyEffects(effects, s, soften) {
  const changes = [];
  if (!effects) return changes;

  // L'amorti d'un pari perdu ne touche que les deux jauges : c'est du
  // rattrapage d'image, pas une machine à annuler les conséquences.
  const amorti = (key, value) =>
    soften && value < 0 && (key === "popularity" || key === "standing")
      ? value * (1 - soften)
      : value;

  Object.entries(effects).forEach(([key, raw]) => {
    const value = amorti(key, raw);
    // Dépenser de l'énergie n'est pas modifier une statistique : on peut
    // dépenser ce qu'on n'a pas, et cela se paie autrement. Voir payEnergy.
    if (key === "energie" && value < 0) {
      payEnergy(s, -value).forEach((c) => changes.push(c));
      return;
    }
    if (STAT_KEYS.includes(key)) {
      const before = s.stats[key];
      bump(s, key, value);
      if (s.stats[key] !== before) changes.push({ kind: "stat", key, delta: s.stats[key] - before });
      return;
    }
    if (key === "popularity") {
      const before = s.popularity;
      const avant = s.appeal ? { ...s.appeal } : null;

      // Positionnée, elle se répartit ; nue, elle touche tout le monde pareil.
      if (effects.axis && s.appeal) applyPositionedPopularity(s, value, effects.axis);
      else bumpPop(s, value);

      pushAppealChanges(changes, avant, s, before);
      return;
    }
    // Le positionnement se lit avec "popularity" : seul, il ne fait rien.
    if (key === "axis") return;
    // ÉCRIT À LA MAIN. La formule des axes couvre l'immense majorité des cas ;
    // il reste les scènes où une réaction n'a rien d'idéologique — un scandale
    // qui ne fâche que les siens, un ralliement qui ne parle qu'à un camp.
    if (key === "appeal") {
      if (!s.appeal) return;
      const before = s.popularity;
      const avant = { ...s.appeal };
      Object.entries(value).forEach(([cible, delta]) => {
        electoratesOf(s, cible).forEach((k) => bumpAppeal(s, k, delta));
      });
      syncPopularity(s);
      pushAppealChanges(changes, avant, s, before);
      return;
    }
    if (key === "standing") {
      const before = s.standing;
      bumpStanding(s, value);
      if (s.standing !== before) changes.push({ kind: "gauge", key: "standing", delta: s.standing - before });
      return;
    }
    if (key === "money") {
      const before = s.money;
      pay(s, value);
      if (s.money !== before) {
        if (value < 0) noteCampaignSpend(s, before - s.money);
        changes.push({ kind: "money", delta: s.money - before });
      }
      return;
    }
    // L'avantage pris ou perdu dans une campagne ordinaire. On ne l'affiche
    // pas en points : le joueur le lit dans la phrase qui décrit la campagne.
    // L'avantage pris dans une campagne, la sienne ou celle qu'on soutient.
    if (key === "score") {
      if (s.race) s.race.bonus += value;
      // La présidentielle qu'on ne dispute pas a désormais un sondage, et
      // c'est lui qu'on déplace : le compteur invisible d'avant ne se voyait
      // nulle part et ne se recoupait avec rien.
      else if (s.support) shiftSupport(s, value * SUPPORT_WEIGHT);
      return;
    }
    // Ce qu'un choix fait à la cote du gouvernement. Un député d'opposition
    // qui démolit un ministre en séance abîme le pouvoir ; un ministre qui
    // tient sa réforme le renforce.
    // LA DISSOLUTION. Le président rend la parole au pays : des législatives
    // anticipées au tour suivant, hors calendrier, sans décaler le cycle
    // ordinaire. C'est le geste le plus risqué de la Cinquième République et
    // il est réservé aux événements qui le méritent.
    if (key === "dissolve") {
      if (!value) return;
      s.dissolution = s.turn + 1;
      changes.push({ kind: "dissolve" });
      return;
    }
    if (key === "approval") {
      const before = s.approval || 0;
      s.approval = clamp100(before + value);
      const delta = Math.round(s.approval - before);
      if (delta) changes.push({ kind: "approval", delta });
      return;
    }
    if (key === "poll" && s.campaign) {
      // Entre les deux tours, le sondage qui compte n'est plus celui du
      // premier : c'est le face-à-face, et c'est lui qu'on déplace.
      const duel = s.campaign.duel;
      const field = duel ? duel.field : s.campaign.field;
      const me = field.find((c) => c.isPlayer);
      if (!me) return;

      const before = me.share;
      if (duel) shiftRunoff(s, value);
      else shiftPoll(s, value);
      const delta = Math.round(me.share - before);
      if (delta) changes.push({ kind: "poll", delta });
      return;
    }
    // Un trait s'affiche comme un tout : le nom, puis les points de
    // statistiques qu'il apporte ou qu'il coûte.
    if (key === "trait") {
      const gained = addTrait(s, value);
      if (gained) {
        changes.push({ kind: "trait", key: value, gained: true });
        gained.forEach((c) => changes.push(c));
      }
      return;
    }
    // Un écart de plus. La marque ne tombe qu'à la récidive.
    if (key === "strike") {
      const marque = addStrike(s, value);
      if (marque) {
        changes.push(marque.kind === "trait" ? { kind: "trait", key: value, gained: true } : marque);
        (marque.stats || []).forEach((c) => changes.push(c));
      }
      return;
    }
    if (key === "untrait") {
      const lost = removeTrait(s, value);
      if (lost) {
        changes.push({ kind: "trait", key: value, gained: false });
        lost.forEach((c) => changes.push(c));
      }
      return;
    }
    if (key === "flags") {
      Object.entries(value).forEach(([flag, on]) => {
        if (Boolean(s.flags[flag]) !== Boolean(on)) changes.push({ kind: "flag", key: flag, on: Boolean(on) });
      });
      Object.assign(s.flags, value);
      return;
    }
    // Le rapport de force entre les partis. On mesure le déplacement réel
    // après normalisation : deux points donnés à un camp ne sont jamais tout
    // à fait deux points une fois le tableau ramené à cent.
    if (key === "landscape") {
      Object.entries(value).forEach(([token, amount]) => {
        const party = landscapeTarget(s, token);
        if (!party) return;
        const moved = moveShare(s, party, amount, "choice");
        if (Math.abs(moved) >= 0.05) {
          changes.push({ kind: "landscape", key: party, delta: Math.round(moved * 10) / 10 });
        }
      });
      return;
    }
    // L'INVESTITURE DU PARTI POUR UN SCRUTIN. Elle ne donne pas la fonction,
    // elle donne le droit de la disputer sans que l'appareil puisse encore
    // dire non, et dans une position favorable. C'est l'élection qui tranche.
    if (key === "nominate") {
      const quand = typeof turnOfNextElection === "function" ? turnOfNextElection(value) : null;
      if (quand === null) return;
      s.nominated = { election: value, until: quand };
      changes.push({ kind: "nominate", key: value });
      return;
    }
    // Une fonction qui ne s'élit pas : un ministère qu'on vous propose, un
    // retour au groupe après une sortie de route.
    if (key === "office") {
      const before = s.position;
      // ON NE RETOMBE JAMAIS. Une fonction se gagne ; elle ne se reçoit pas
      // en consolation. Un événement qui vous fait quitter un poste écrit
      // "none" et le moteur applique la règle commune : le parti vous garde
      // si vous pesez encore, sinon vous n'êtes plus rien. Sept sorties de
      // ministère rendaient leur titulaire député, y compris ceux qui ne
      // l'avaient jamais été.
      const cible = value === "none" ? officeAfterDefeat(s) : value;
      if (setOffice(s, cible)) {
        changes.push({ kind: "office", key: cible, up: LADDER.indexOf(cible) > LADDER.indexOf(before) });
      }
      // ON REFORME LE GOUVERNEMENT TOUT DE SUITE. ensureGovernment ne
      // tournait qu'au tour suivant : entre l'événement qui vous donne
      // Matignon et le tour d'après, le pays avait deux Premiers ministres,
      // et le panneau du pouvoir les affichait tous les deux.
      if ((cible === "premier" || cible === "ministre" || before === "premier" ||
           before === "ministre") && typeof ensureGovernment === "function") {
        ensureGovernment();
      }
      return;
    }
    // LA DIRECTION DU PARTI, DONNÉE OU RENDUE HORS CONGRÈS. Une direction se
    // prend au congrès, mais elle se perd aussi entre deux congrès : une
    // direction collégiale qu'on accepte, une démission après une déroute,
    // un intérim qu'on vous confie parce que personne d'autre n'en veut. Le
    // mandat, lui, ne bouge pas : c'est tout l'objet du cumul.
    if (key === "lead") {
      if (typeof setPartyLead === "function" && setPartyLead(s, Boolean(value))) {
        changes.push({ kind: "lead", on: Boolean(value) });
      }
      return;
    }
    if (key === "join") {
      const party = landscapeTarget(s, value);
      if (!party) return;
      // Le changement de camp secoue les six électorats (voir switchParty) :
      // on mesure avant et après, sans quoi la conséquence la plus lourde du
      // choix ne s'afficherait sur aucune pastille.
      const avantPop = s.popularity;
      const avantAppeal = s.appeal ? { ...s.appeal } : null;
      const avantPoste = s.position;
      if (switchParty(s, party)) {
        changes.push({ kind: "party", key: party });
        // Un ministère ne traverse pas (voir switchParty) : la perte du poste
        // est la conséquence la plus lourde du choix, elle doit se voir.
        if (s.position !== avantPoste) {
          changes.push({ kind: "office", key: s.position,
                         up: LADDER.indexOf(s.position) > LADDER.indexOf(avantPoste) });
        }
        pushAppealChanges(changes, avantAppeal, s, avantPop);
      }
      return;
    }
    if (key === "alliance") {
      const party = value === null ? null : landscapeTarget(s, value);
      const had = s.alliance ? s.alliance.party : null;
      if (party === had) return;
      // Signer ou rompre déplace deux électorats (voir setAlliance) : on
      // mesure autour, pour que la carte le montre comme le reste.
      const avantPop = s.popularity;
      const avantAppeal = s.appeal ? { ...s.appeal } : null;
      setAlliance(s, party);
      changes.push({ kind: "alliance", key: party || had, on: Boolean(party) });
      pushAppealChanges(changes, avantAppeal, s, avantPop);
      return;
    }
    if (key === "chain") {
      (Array.isArray(value) ? value : [value]).forEach((id) => scheduleChain(s, id));
      return;
    }
    if (key === "end") { s.ended = { type: value }; return; }
  });

  return changes;
}

/**
 * Ce qu'un mouvement d'opinion a réellement déplacé. On rapporte la base et
 * la générale séparément, plus le détail par électorat quand il est parlant :
 * c'est ce que la carte de résultat doit pouvoir montrer.
 */
function pushAppealChanges(changes, avant, s, popAvant) {
  if (!avant) {
    if (s.popularity !== popAvant) {
      changes.push({ kind: "gauge", key: "popularity", delta: s.popularity - popAvant });
    }
    return;
  }
  appealChanges(avant, s).forEach((c) => changes.push(c));
}

/**
 * CE QU'UN MOUVEMENT D'OPINION A DÉPLACÉ, DIT LE PLUS BRIÈVEMENT POSSIBLE.
 *
 * Un effet qui ne clive pas touche les six électorats du même montant : les
 * détailler produisait six pastilles disant six fois la même chose. Quand
 * les autres électorats bougent ensemble, on n'écrit donc qu'une ligne,
 * « popularité générale ». Le détail n'apparaît que lorsqu'il apprend
 * quelque chose, c'est-à-dire quand le choix a divisé le pays.
 */
function appealChanges(avant, s) {
  const out = [];

  const base = Math.round(s.appeal[s.party] - avant[s.party]);
  if (base) out.push({ kind: "appeal", key: s.party, delta: base, base: true });

  const autres = Object.keys(PARTIES)
    .filter((key) => key !== s.party)
    .map((key) => ({ kind: "appeal", key, delta: Math.round(s.appeal[key] - avant[key]) }))
    .filter((c) => c.delta);

  if (!autres.length) return out;

  const min = Math.min(...autres.map((c) => c.delta));
  const max = Math.max(...autres.map((c) => c.delta));
  const ensemble = autres.length === Object.keys(PARTIES).length - 1 && max - min <= 1;

  if (ensemble) out.push({ kind: "appeal", general: true, delta: Math.round((min + max) / 2) });
  else autres.forEach((c) => out.push(c));

  return out;
}

/* ---------- Choix disponibles ---------- */

/**
 * Tous les choix ne sont pas toujours offerts. Un choix peut porter son
 * propre "when" : il n'apparaît que si la situation s'y prête (assez
 * d'argent, la bonne fonction, le bon parcours…). On renvoie les choix
 * jouables avec leur index d'origine, pour que les boutons restent liés
 * au bon élément du tableau.
 */
function availableChoices(ev, s) {
  const ouverts = ev.choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => !choice.when || eventMatches({ when: choice.when }, s));

  // ON NE DÉPENSE PAS CE QU'ON N'A PAS.
  //
  // L'énergie est bornée à zéro : un choix qui coûtait trois points ne
  // coûtait donc plus rien à qui n'en avait plus. Arrivé à sec, on répondait
  // oui à tout gratuitement, et la seule ressource que le jeu demande de
  // gérer devenait un plafond de dépenses illimité. Le zéro était la
  // meilleure position du jeu, ce qui est l'exact contraire de ce qu'il
  // raconte.
  //
  // Une option qui demande trois jours de vie n'est plus proposée à qui n'en
  // a plus trois. On retient le coût le PLUS ÉLEVÉ des branches d'un jet :
  // au moment de choisir, on ne sait pas si l'on va réussir, et un choix ne
  // doit jamais pouvoir se solder par un découvert.
  const reste = s.stats.energie;
  const abordables = ouverts.filter(({ choice }) => energyCost(choice) <= reste);
  if (abordables.length) return abordables;

  // FILET. Une carte sans aucun choix jouable n'est pas une carte. Si tout
  // est trop cher, on laisse les moins chers : à ce stade le personnage
  // n'a plus le luxe de choisir, il a celui de faire le minimum.
  const minimum = Math.min(...ouverts.map(({ choice }) => energyCost(choice)));
  return ouverts.filter(({ choice }) => energyCost(choice) === minimum);
}

/**
 * Ce qu'un choix coûte en énergie, au pire. Un jet coûte ce que coûte sa
 * branche la plus chère : on choisit avant de savoir laquelle sortira, et
 * une débâcle coûte plus qu'un échec ordinaire.
 */
function energyCost(choice) {
  const cout = (branche) => {
    const e = branche && branche.effects && branche.effects.energie;
    return e < 0 ? -e : 0;
  };
  return Math.max(cout(choice), cout(choice.success), cout(choice.failure),
    cout(choice.triumph), cout(choice.debacle));
}

/* ---------- Jets de dés ---------- */

/**
 * Calcule les chances de réussite d'un choix. Trois formes possibles :
 *
 *   1. Aucun "roll"          → le choix réussit toujours.
 *   2. "chance": 0.6         → probabilité fixe, ajustable par "chanceBonus".
 *   3. "base" + "stat"       → score composite comparé à une difficulté.
 *
 * Dans le troisième cas le score additionne :
 *     la statistique principale ("stat", poids 1)
 *   + les contributions secondaires ("plus" : autres stats, popularité, cote)
 *   + les bonus conditionnels ("bonus" : un "when" et une valeur)
 *   + un dé de 0 à "dice" (6 par défaut)
 *
 * C'est ce qui permet à un même choix d'être facile pour un chef de parti
 * charismatique et périlleux pour un militant inconnu.
 */
function rollScore(roll, s) {
  return rollBase(roll, s) + Math.random() * rollDice(roll);
}

function rollDice(roll) {
  return roll.dice === undefined ? 6 : roll.dice;
}

/** La part certaine du score, celle qui ne doit rien au dé. */
/**
 * CE QUE LA FATIGUE COÛTE.
 *
 * Elle ne rend pas moins aimé : elle fait rater. En dessous de huit, on
 * prépare mal, on répond à côté, on laisse passer la question qu'il fallait
 * poser. Le malus s'applique à tous les jets, et le joueur le voit venir,
 * puisque l'interface prévient quand un choix devient très risqué.
 */
function fatigueMalus(s) {
  return Math.min(0, (s.stats.energie - 8) * 0.4);
}

function rollBase(roll, s) {
  let score = (roll.stat ? statScore(s, roll.stat) : 0) + fatigueMalus(s);

  if (roll.plus) {
    Object.entries(roll.plus).forEach(([key, weight]) => {
      // Un jet que la popularité aide parle de ce que le PAYS pense : la note
      // de proximité y ajouterait une dizaine de points à tous les coups.
      if (key === "popularity") score += nationalPopularity(s) * weight;
      else if (key === "standing") score += s.standing * weight;
      else if (key === "money") score += (s.money / 100000) * weight;
      else if (STAT_KEYS.includes(key)) score += statScore(s, key) * weight;
    });
  }

  if (roll.bonus) {
    roll.bonus.forEach((b) => {
      if (!b.when || eventMatches({ when: b.when }, s)) score += b.value;
    });
  }

  return score;
}

/** Le seuil à franchir. */
function rollTarget(roll) {
  return roll.base !== undefined ? roll.base : roll.difficulty;
}

/**
 * Les chances de réussite, calculées et non tirées. Le joueur les voit avant
 * de choisir : le hasard doit être un risque assumé, pas une surprise.
 * Le dé étant uniforme, la probabilité se lit directement sur l'écart entre
 * la part certaine du score et le seuil.
 */
function rollChance(roll, s) {
  if (!roll) return 1;

  if (roll.chance !== undefined) {
    let chance = roll.chance;
    if (roll.chanceBonus) {
      roll.chanceBonus.forEach((b) => {
        if (!b.when || eventMatches({ when: b.when }, s)) chance += b.value;
      });
    }
    return Math.max(0.02, Math.min(0.98, chance));
  }

  const dice = rollDice(roll);
  const margin = rollBase(roll, s) + dice - rollTarget(roll);
  return Math.max(0, Math.min(1, margin / dice));
}

/** Le choix réussit-il ? */
function rollSucceeds(roll, s) {
  if (roll.chance !== undefined) return Math.random() < rollChance(roll, s);
  return rollScore(roll, s) >= rollTarget(roll);
}

/* ---------- Coups critiques et débâcles ----------
   ==========================================================================
   Le premier jet dit le SORT : ça passe ou ça casse. Un second, tiré
   ensuite, dit la SÉVÉRITÉ : on peut réussir et on peut réussir fort, rater
   et sombrer. Il n'a lieu que si la scène a écrit la branche extrême ; une
   partie sans contenu critique consomme exactement l'aléa d'avant.

   CE QUI LE PILOTE, c'est la valeur des attributs que le jet met déjà en
   jeu. On ne les redemande pas à l'auteur : « les attributs impliqués dans
   la scène », le jet les a nommés. La compétence transforme donc ses
   réussites et limite ses dégâts, l'incompétence fait l'inverse.

   PAS DE RÉGLAGE PAR ÉVÉNEMENT. Une constante pour tout le jeu, et c'est
   tout : un curseur par choix rendrait chaque scène à équilibrer à la main,
   ce qui est précisément ce qu'on ne veut pas.
   ========================================================================== */


/**
 * La qualité du personnage sur les attributs du jet, ramenée entre 0 et 1 :
 * la statistique principale à poids 1, puis les appoints à leur poids.
 *
 * L'argent d'un « plus » est ignoré : il aide à réussir, il ne dit rien de
 * ce dont on est capable. La fatigue non plus n'entre pas ici — elle fait
 * rater, elle ne rend pas maladroit (voir fatigueMalus).
 *
 * Un jet à probabilité fixe ne nomme aucun attribut : sa sévérité est un
 * pur coup de dé, et c'est honnête. Pour qu'une scène ait un critique piloté
 * par le personnage, il faut l'écrire en score composite.
 */
function rollQuality(roll, s) {
  let somme = 0;
  let poids = 0;
  const ajoute = (valeur, part) => { somme += valeur * part; poids += part; };

  if (roll.stat) ajoute(s.stats[roll.stat] / STAT_MAX, 1);

  if (roll.plus) {
    Object.entries(roll.plus).forEach(([key, weight]) => {
      if (key === "popularity") ajoute(nationalPopularity(s) / 100, weight);
      else if (key === "standing") ajoute(s.standing / 100, weight);
      else if (STAT_KEYS.includes(key)) ajoute(s.stats[key] / STAT_MAX, weight);
    });
  }

  if (!poids) return 0.5;
  return Math.max(0, Math.min(1, somme / poids));
}

/** La probabilité que le sort déjà connu bascule dans son extrême. */
function critChance(roll, s, won) {
  const q = rollQuality(roll, s);
  return CRIT_MAX * (won ? q : 1 - q);
}

/**
 * Regroupe les variations d'une même chose, pour n'afficher qu'une pastille
 * par statistique même quand plusieurs blocs d'effets s'additionnent.
 */
function mergeChanges(changes) {
  const merged = [];

  changes.forEach((change) => {
    const twin = merged.find((m) =>
      m.kind === change.kind && m.key === change.key && typeof m.delta === "number");
    if (twin && typeof change.delta === "number") twin.delta += change.delta;
    else merged.push({ ...change });
  });

  return merged.filter((change) => change.delta === undefined || change.delta !== 0);
}

/**
 * Joue un choix : résout le jet s'il y en a un, applique les effets de la
 * branche retenue, et renvoie son texte de résultat avec la liste de ce qui
 * a changé.
 *
 * Une branche peut porter des effets CONDITIONNELS ("effectsIf") : le même
 * geste ne coûte pas la même chose à tout le monde. Un arrangement passe
 * inaperçu chez un calculateur et démolit quelqu'un qui s'était fait une
 * réputation d'intégrité ; une provocation qui ravit une base radicale
 * effraie un électorat centriste. C'est là que le profil du personnage cesse
 * d'être décoratif.
 */
function resolveChoice(choice, s) {
  let won = null;
  let branch = choice;

  if (choice.roll) {
    won = rollSucceeds(choice.roll, s);
    branch = won ? choice.success : choice.failure;

    // LA SÉVÉRITÉ, une fois le sort connu. Le second tirage n'a lieu que si
    // la scène a quelque chose à dire de plus : sans branche extrême écrite,
    // pas de tirage du tout.
    const extreme = won ? choice.triumph : choice.debacle;
    if (extreme && Math.random() < critChance(choice.roll, s, won)) branch = extreme;
  }

  // Seul un pari perdu s'amortit. Un choix sûr assumé n'a rien à amortir :
  // on savait ce qu'on faisait. C'est le SORT qui commande, pas la branche :
  // une débâcle est un échec, et c'est même là que l'amorti compte le plus.
  const soften = won === false ? investNerve(s) : 0;

  let changes = applyEffects(branch.effects, s, soften);

  (branch.effectsIf || []).forEach((rule) => {
    if (!rule.when || eventMatches({ when: rule.when }, s)) {
      changes = changes.concat(applyEffects(rule.effects, s, soften));
    }
  });

  return {
    text: fillText(branch.result, s),
    log: fillBoth(branch.result, s),
    changes: mergeChanges(changes),
    won,
  };
}

/** Marque un événement comme vu, pour les "once". */
function markSeen(ev, s) {
  if (!s.seen) s.seen = {};
  s.seen[ev.id] = true;
}

/* ==========================================================================
   Les suites, et le temps qu'elles mettent
   ==========================================================================
   Une affaire ne sort pas six mois après les faits, une dette d'appareil ne
   se rappelle pas au tour suivant, un procès met des années à s'ouvrir. Un
   maillon de chaîne annonce donc lui-même son délai, en tours, dans son
   champ "delay" : le moteur le programme et l'oublie jusqu'à l'échéance.

   C'est ce décalage qui fait qu'on ne relie pas immédiatement la
   conséquence à la décision, et c'est exactement ce qu'on cherche.
   ========================================================================== */



function pendingChains(s) {
  return s.pending || (s.pending = []);
}

/** Programme une suite pour dans quelques tours. */
function scheduleChain(s, id) {
  const ev = EVENTS.find((e) => e.id === id);
  if (!ev) return;

  const range = Array.isArray(ev.delay) ? ev.delay : DEFAULT_CHAIN_DELAY;
  const delay = range[0] + randInt(Math.max(1, range[1] - range[0] + 1));

  pendingChains(s).push({ id, turn: s.turn + delay, expires: s.turn + delay + CHAIN_PATIENCE });
}

/**
 * La suite arrivée à échéance, s'il y en a une de jouable. Une suite dont les
 * conditions ne sont pas réunies attend son heure, puis finit par tomber :
 * toutes les affaires ne sortent pas.
 */
function dueChain(s) {
  const pending = pendingChains(s);

  for (let i = 0; i < pending.length; i++) {
    const entry = pending[i];
    if (entry.turn > s.turn) continue;

    const ev = EVENTS.find((e) => e.id === entry.id);
    if (ev && eventMatches(ev, s)) {
      pending.splice(i, 1);
      return ev;
    }
    if (entry.expires <= s.turn) { pending.splice(i, 1); i--; }
  }
  return null;
}
