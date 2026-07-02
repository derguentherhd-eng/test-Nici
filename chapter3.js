/* ============================================
   chapter3.js — Typography Timeline 1970–2016
   ============================================ */

const CHAPTER_ID = 3;

document.getElementById("btn-complete").addEventListener("click", () => markComplete(CHAPTER_ID));
renderDots(CHAPTER_ID);

/* ── Timeline data ──────────────────────────── */
const ENTRIES = [
  {
    year: "1970er",
    title: "Vom Blei zum Licht: Lichtsatz & Lasersatz",
    paragraphs: [
      "Der Lichtsatz und Lasersatz wurden in den 1970er Jahren eingeführt und lösten den bis dahin rund 500 Jahre alten Bleisatz ab – ein technologischer Umbruch, der die Druckindustrie fundamental veränderte.",
      "Beim Bleisatz mussten einzelne Metalllettern mühsam von Hand oder maschinell zusammengesetzt werden, ein zeitaufwändiger und körperlich anspruchsvoller Prozess. Das neue fotomechanische Verfahren hingegen projizierte Schriftzeichen auf lichtempfindliches Material, was die Produktion erheblich beschleunigte und die Herstellung von sauberem Blocksatz deutlich vereinfachte. Zudem eröffnete es gestalterische Möglichkeiten, die mit dem mechanischen Bleisatz kaum realisierbar gewesen wären, etwa feinere Abstände zwischen Buchstaben und Zeilen sowie flexiblere Schriftgrößen.",
      "In Kombination mit den ersten Computersystemen, die zunehmend Einzug in Redaktionen und Druckereien hielten, setzte diese Entwicklung den entscheidenden Grundstein für den folgenden schnelllebigen Wandel in der Typografie- und Druckgeschichte."
    ],
    image: "Images/diatype.jpg",
    swatch: "#f2eeeb", glyph: "Aa", weight: 500, invert: false,
  },
  {
    year: "1980er",
    title: "Desktop Publishing & PostScript",
    paragraphs: [
      "Das revolutionäre Desktop Publishing entstand als direkte Folge der Gründung von Adobe im Jahr 1982 und der Entwicklung der Seitenbeschreibungssprache PostScript. Diese ermöglichte erstmals eine konsistente und geräteunabhängige Darstellung von Grafiken und Schrift – unabhängig davon, ob das Dokument auf einem Bildschirm angezeigt oder auf einem Drucker ausgegeben wurde.",
      "Vor PostScript war die Ausgabe von Schrift und Bild stark an spezifische Hardware gebunden, was die Zusammenarbeit zwischen verschiedenen Systemen erheblich erschwerte. Mit dem Apple Macintosh, der 1984 auf den Markt kam, und Programmen wie PageMaker entstand ein erstes vollständiges Desktop-Publishing-Ökosystem, das professionelle Layouts direkt am Computer ermöglichte.",
      "Gestaltung und Druckprozess trennten sich damit grundlegend voneinander. Gestalterinnen und Gestalter gewannen deutlich mehr Entscheidungsmacht bei der Entwicklung von Layouts und waren nicht länger durch die technischen Einschränkungen der Druckereien limitiert. Für viele Berufsgruppen im Druckwesen bedeutete dieser Wandel jedoch auch erhebliche strukturelle Veränderungen, da zahlreiche spezialisierte Handwerksberufe an Bedeutung verloren."
    ],
    image: "Images/pagemaker.png",
    swatch: "#fbd530", glyph: "⌘", weight: 700, invert: false,
  },
  {
    year: "1990er",
    title: "Digitalisierung & die Font Wars",
    paragraphs: [
      "Der analoge Schriftsatz wurde in diesem Jahrzehnt vollständig von digitalen Schriftsatzsystemen verdrängt. Die bis dahin entstandene, jahrhundertelange Schriftgeschichte – von den Klassikern der Renaissance bis zu den modernistischen Schriften des 20. Jahrhunderts – wurde von verschiedenen Type Foundries digitalisiert und über das aufkommende Internet zugänglich gemacht.",
      "Prägend für die 1990er Jahre waren die sogenannten Font Wars: ein tiefgreifender Konflikt zwischen Microsoft und Adobe um die Vorherrschaft bei der Standardisierung digitaler Typografie. Microsoft entwickelte gemeinsam mit Apple das Format TrueType als Konkurrenz zu Adobes Type-1-Format, was die Branche in zwei unkompatible Lager spaltete und zu erheblicher Verwirrung bei Entwicklern und Gestaltern führte.",
      "Als gemeinsame Antwort auf diesen Konflikt wurde schließlich das Format OpenType entwickelt, das die Stärken beider Systeme vereinte, systemübergreifend funktionierte und erweiterte typografische Funktionen wie Ligaturen, Kapitälchen und alternative Glyphen direkt in einer einzigen Schriftdatei ermöglichte."
    ],
    image: "Images/fotothek-satztechnik.jpg",
    swatch: "#ff6853", glyph: "OT", weight: 700, invert: true,
  },
  {
    year: "1997",
    title: "CSS & @font-face",
    paragraphs: [
      "Mit der Einführung von CSS (Cascading Style Sheets) wurden erstmals standardisierte Schrifteigenschaften für das Web definiert. Vor CSS war die typografische Kontrolle im Web äußerst begrenzt – Schrift wurde weitgehend vom Browser bestimmt, nicht vom Gestalter. CSS schuf nun eine klare Trennung zwischen Inhalt und Gestaltung.",
      "Unterschieden wurde dabei in grundlegende Schriftfamilien wie Monospace, Serif und Sans-Serif, die als generische Fallback-Kategorien dienten. Darüber hinaus ermöglichte CSS umfangreiche typografische Anpassungen wie Schriftschnitt, Schriftgröße, Zeilenabstand und Zeichenabstand – Eigenschaften, die zuvor nur im Print selbstverständlich waren.",
      "Die CSS-Regel @font-face stellte dabei einen besonders bedeutsamen Schritt dar: Sie ermöglichte es erstmals, externe Schriftdateien direkt in eine Webseite einzubinden, ohne dass diese zuvor auf den Geräten der Nutzerinnen und Nutzer installiert sein mussten. Damit wurde die Grundlage für die spätere Blütezeit der Webfonts gelegt."
    ],
    image: "Images/css-tags.png",
    swatch: "#135ae4", glyph: "@f", weight: 600, invert: true,
  },
  {
    year: "2000er",
    title: "Webfont-Plattformen & Demokratisierung",
    paragraphs: [
      "Plattformen wie Google Web Fonts und kommerzielle Anbieter wie Typekit demokratisierten den Zugang zu Typografie im Web grundlegend. Zuvor waren Entwicklerinnen und Entwickler auf eine sehr begrenzte Auswahl sogenannter Systemfonts angewiesen – jene Schriften, die auf dem jeweiligen Betriebssystem vorinstalliert waren und sich auf eine Handvoll bekannte Schriften wie Arial, Times New Roman oder Georgia beschränkten. Kreative Typografie im Web war damit kaum möglich.",
      "Mit den neuen Webfont-Plattformen konnten Entwicklerinnen, Entwickler und Gestalterinnen nun frei aus hunderten, später tausenden von Schriften wählen und diese über einfache Einbindung per Link oder API direkt im Browser laden. Google Web Fonts sorgte durch sein kostenloses Angebot dafür, dass hochwertige Typografie auch für kleinere Projekte und Einzelpersonen ohne Budget zugänglich wurde."
    ],
    image: "Images/diatronic.jpg",
    swatch: "#269e5f", glyph: "Gf", weight: 600, invert: true,
  },
  {
    year: "2013",
    title: "WOFF – Der Webfont-Standard",
    paragraphs: [
      "Das Format WOFF (Web Open Font Format) wurde vom W3C zum offiziellen Standard für die Webentwicklung erklärt und von allen gängigen Browsern unterstützt. Es vereinfachte die Nutzung verschiedener Fontformate wie OpenType oder TrueType erheblich, da es diese in einem einheitlichen, für das Web optimierten Container verpackte – geräte- und nutzerunabhängig einsetzbar.",
      "WOFF komprimiert Schriftdaten mithilfe eines effizienten Algorithmus und sorgte damit für deutlich schnellere Ladezeiten bei gleichbleibender Qualität – ein entscheidender Vorteil in einer Zeit, in der das mobile Web rasant an Bedeutung gewann und Nutzerinnen wie Nutzer zunehmend über Smartphones und Tablets auf Inhalte zugriffen.",
      "Mit WOFF2, das kurze Zeit später folgte, wurde die Kompression nochmals erheblich verbessert und der Standard für die nächsten Jahre zementiert."
    ],
    image: "Images/linotype-crt.jpg",
    swatch: "#1a1a2e", glyph: "Wf", weight: 600, invert: true,
  },
  {
    year: "ab 2016",
    title: "Variable Fonts",
    paragraphs: [
      "Variable Fonts, entwickelt durch eine Zusammenarbeit von Adobe, Apple, Google und Microsoft, läuteten eine neue Ära der digitalen Typografie ein. Klassische Schriftfamilien bestanden bis dahin aus mehreren einzelnen Dateien – eine für jede Schriftgewichtsstufe, eine für kursiv, eine für schmale oder breite Schnitte.",
      "Variable Fonts fassen all diese Variationen in einer einzigen Datei zusammen und ermöglichen dabei fließende, stufenlose Übergänge zwischen verschiedenen Schrifteigenschaften wie Gewicht, Breite, Neigung oder optischer Größe. Dies reduziert die zu ladende Datenmenge erheblich und vereinfacht das Schriftmanagement in komplexen Projekten.",
      "Gleichzeitig eröffnet es völlig neue gestalterische Möglichkeiten: Schrift kann nun in einem kontinuierlichen Spektrum frei eingestellt werden – ein besonderer Vorteil im Kontext von responsivem Design, bei dem Schrift sich dynamisch an unterschiedliche Bildschirmgrößen, Auflösungen und Leseumgebungen anpassen kann."
    ],
    image: null,
    swatch: "#cba6e8", glyph: "{var}", weight: 700, invert: false,
  },
];

/* ── Render timeline entries ────────────────── */
const entriesEl = document.getElementById("ch3-entries");
ENTRIES.forEach(e => {
  const entry = document.createElement("div");
  entry.className = "ch3-entry";

  const dot = document.createElement("div");
  dot.className = "ch3-dot";

  const year = document.createElement("div");
  year.className = "ch3-year";
  year.textContent = e.year;

  const title = document.createElement("h3");
  title.className = "ch3-entry-title font-display";
  title.textContent = e.title;

  const textWrap = document.createElement("div");
  textWrap.className = "ch3-entry-text-wrap";
  e.paragraphs.forEach(para => {
    const p = document.createElement("p");
    p.className = "ch3-entry-text";
    p.textContent = para;
    textWrap.appendChild(p);
  });

  entry.appendChild(dot);
  entry.appendChild(year);
  entry.appendChild(title);
  entry.appendChild(textWrap);
  entriesEl.appendChild(entry);
});

/* ── Image cards (left sidebar) ──────────────── */
const IMAGES = [
  { file: 'bleisatz.jpg',          year: '1440–1970', label: 'Bleisatz Setzkasten' },
  { file: 'linotype-chicago.png',  year: '1941',      label: 'Linotype Setzer · Chicago Defender' },
  { file: 'diatype-einzel.jpg',    year: '1960',      label: 'Diatype · Einzelbuchstabenverfahren' },
  { file: 'diatype-glasmaster.jpg',year: '1960',      label: 'Glasmaster · Diatype' },
  { file: 'linotype-kompakt.jpg',  year: '1962',      label: 'Linotype Kompakt-Belichtungsgerät' },
  { file: 'fotosatz-arbeit.jpg',   year: '1983',      label: 'Fotosatz-Facharbeiterinnen' },
  { file: 'postscript-code.png',   year: '1982',      label: 'PostScript Code & Darstellung' },
  { file: 'pagemaker-ui.png',      year: '1985',      label: 'PageMaker Interface' },
  { file: 'hp-laserjet.jpg',       year: '1984',      label: 'HP LaserJet · PostScript' },
  { file: 'css-typo-tags.png',     year: '2002',      label: 'Typografie-Tags für HTML & CSS' },
  { file: 'glyphs-ui.png',         year: '2011–2026', label: 'Glyphs · Typografie-Interface' },
  { file: 'dafont-start.png',      year: '2010–2018', label: 'DaFont Startseite' },
  { file: 'variable-fonts.png',    year: '2016',      label: 'Variable Fonts · X & Y Achsen' },
];

const swatchesEl = document.getElementById("ch3-swatches");
IMAGES.forEach(function(img) {
  const card = document.createElement("div");
  card.className = "ch3-swatch-card has-image";

  const imgEl = document.createElement("img");
  imgEl.src = 'Images/' + img.file;
  imgEl.alt = img.label;
  imgEl.className = "ch3-swatch-img";

  const overlay = document.createElement("div");
  overlay.className = "ch3-swatch-overlay";

  const yearLbl = document.createElement("div");
  yearLbl.className = "ch3-swatch-year font-mono";
  yearLbl.textContent = img.year;

  const descLbl = document.createElement("div");
  descLbl.className = "ch3-swatch-label font-mono";
  descLbl.textContent = img.label;

  card.appendChild(imgEl);
  card.appendChild(overlay);
  card.appendChild(yearLbl);
  card.appendChild(descLbl);
  swatchesEl.appendChild(card);
});

/* ── Parallax on scroll ──────────────────────── */
const scrollEl  = document.getElementById("ch3-scroll");
const sidebarEl = document.getElementById("ch3-sidebar-inner");

scrollEl.addEventListener("scroll", () => {
  const s = scrollEl.scrollTop;
  sidebarEl.style.transform = `translateY(${-s * 0.35}px)`;
}, { passive: true });
