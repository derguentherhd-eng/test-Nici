/* ============================================
   chapter2.js — Type Anatomy Flashcards
   ============================================ */

document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

const CHAPTER_ID = 2;

document.getElementById("btn-complete").addEventListener("click", () => markComplete(CHAPTER_ID));
renderDots(CHAPTER_ID);

/* ── Card data ──────────────────────────────── */
const CARDS = [
  {
    icon:  "Images/Icons/Karteikarte 1Typographie_im_Kern.svg",
    front: "Was ist Typografie im Kern?",
    back:  "Typografie ist die Kunst und Technik, geschriebene Sprache durch die Auswahl von Schriftarten, Schriftgrößen, Zeilenlängen und Abständen lesbar, ansprechend und bedeutungsvoll zu gestalten."
  },
  {
    icon:  "Images/Icons/typefacevsfont.svg",
    iconLg: true,
    front: `Was ist der Unterschied zwischen einem „Typeface“ und einem „Font“?`,
    back:  "Das Typeface ist das visuelle Design (z. B. Helvetica oder Times New Roman). Es ist das, was man sieht. Der Font ist die technologische Umsetzung (die Software-Datei oder früher der Setzkasten)."
  },
  {
    icon:  "Images/Icons/bleisatz.svg",
    front: `Wie definierte sich ein „Font“ früher im Vergleich zu heute?`,
    back:  "Früher (Bleisatz): Ein Font war ein physischer Satz von Metalllettern in einer einzigen Größe und einem einzigen Stil (z. B. 12 Punkt Garamond Fett). Heute (Digital): Ein Font ist eine skalierbare Software-Datei, die alle Größen und oft hunderte verschiedene Zeichenvarianten (Glyphen) enthält."
  },
  {
    icon:  "Images/Icons/A-small_glyphs (1).svg",
    front: `Was ist eine „Glyphe“ im Kontext moderner Font-Technologie?`,
    back:  `Eine Glyphe ist die spezifische grafische Darstellung eines Zeichens. Ein Font kann für denselben Buchstaben (z. B. ein kleines „a“) verschiedene Glyphen enthalten, wie etwa Kapitälchen, Kursivformen oder dekorative Varianten.`
  },
  {
    icon:  "Images/Icons/arrows-vertical.svg",
    front: `Was versteht man unter „Leading“?`,
    back:  "Leading ist der vertikale Abstand von der Grundlinie einer Textzeile zur Grundlinie der nächsten. Der Begriff kommt aus der Zeit des Bleisatzes, als wörtlich Bleistreifen (lead) zwischen die Zeilen gelegt wurden, um den Abstand zu vergrößern."
  },
  {
    icon:  "Images/Icons/arrows.svg",
    front: `Was bedeutet „Tracking“?`,
    back:  "Tracking ist das gleichmäßige Erweitern oder Verringern des horizontalen Abstands zwischen allen Zeichen eines ganzen Wortes oder Textblocks. Es wird genutzt, um die Textdichte und die optische Schwärzung einer Seite anzupassen."
  },
  {
    icon:  "Images/Icons/kerning.svg",
    front: `Was ist „Kerning“?`,
    back:  `Im Gegensatz zum Tracking ist Kerning die gezielte Anpassung des Abstands zwischen zwei bestimmten, aufeinanderfolgenden Zeichen (z. B. „A“ und „V“). Ziel ist es, störende weiße Lücken zu schließen, damit das Schriftbild harmonisch wirkt.`
  },
  {
    icon:  "Images/Icons/fi.svg",
    front: `Was sind „Ligaturen”?`,
    back:  "Eine Ligatur ist die Verschmelzung von zwei oder mehr Buchstaben zu einem einzigen Zeichen (z. B. f und i zu fi), um Kollisionen von Buchstabenteilen zu vermeiden."
  },
  {
    icon:  "Images/Icons/ausrichtungen.svg",
    front: "Welche Satzarten (Ausrichtungen) gibt es hauptsächlich in den Fontsettings?",
    backHTML: true,
    back:  "1. Linksbündig (Flattersatz rechts) – Standard für beste Lesbarkeit.<br><br>2. Rechtsbündig (Flattersatz links).<br><br>3. Zentriert (Symmetrisch, oft für Titel).<br><br>4. Blocksatz (links und rechts bündig)"
  },
];

/* ── State ──────────────────────────────────── */
let currentIndex = 0;
const flipped = new Array(CARDS.length).fill(false);

/* ── Build carousel ─────────────────────────── */
const carousel = document.getElementById("ch2-carousel");
const cardWraps = [];

CARDS.forEach((card, i) => {
  const wrap = document.createElement("div");
  wrap.className = "ch2-card-wrap";

  const inner = document.createElement("div");
  inner.className = "ch2-card";

  // Front face
  const front = document.createElement("div");
  front.className = "ch2-face ch2-face-front";

  const tagF = document.createElement("span");
  tagF.className = "ch2-face-tag font-mono";
  tagF.textContent = "FRAGE";

  let glyphEl;
  if (card.icon) {
    glyphEl = document.createElement("img");
    glyphEl.className = "ch2-glyph-icon";
    glyphEl.src = card.icon;
    glyphEl.alt = "";
    if (card.iconLg) glyphEl.style.maxHeight = "13rem";
  } else {
    glyphEl = document.createElement("span");
    glyphEl.className = "ch2-glyph font-display";
    glyphEl.textContent = card.glyph;
  }

  const term = document.createElement("span");
  term.className = "ch2-card-term font-display";
  term.textContent = card.front;

  front.appendChild(tagF);
  front.appendChild(glyphEl);
  front.appendChild(term);

  // Back face
  const back = document.createElement("div");
  back.className = "ch2-face ch2-face-back";

  const tagB = document.createElement("span");
  tagB.className = "ch2-face-tag font-mono";
  tagB.textContent = "ANTWORT";

  const def = document.createElement("p");
  def.className = "ch2-card-def font-display";
  if (card.backHTML) { def.innerHTML = card.back; } else { def.textContent = card.back; }

  back.appendChild(tagB);
  back.appendChild(def);

  inner.appendChild(front);
  inner.appendChild(back);

  wrap.appendChild(inner);
  carousel.appendChild(wrap);
  cardWraps.push({ wrap, inner });
});

/* ── Position cards ─────────────────────────── */
function updateCarousel() {
  const n = CARDS.length;
  cardWraps.forEach(({ wrap, inner }, i) => {
    const offset = ((i - currentIndex + n) % n);
    const rel = offset > n / 2 ? offset - n : offset;
    const visible = Math.abs(rel) <= 2;

    wrap.style.display = visible ? "block" : "none";
    if (!visible) return;

    const isCenter = rel === 0;
    const scale    = isCenter ? 1 : 0.78;
    const opacity  = Math.abs(rel) === 2 ? 0.25 : isCenter ? 1 : 0.55;
    const tx       = rel * 280;
    const ry       = rel * -8;

    wrap.style.transform  = `translateX(${tx}px) scale(${scale}) rotateY(${ry}deg)`;
    wrap.style.opacity    = opacity;
    wrap.style.zIndex     = 10 - Math.abs(rel);
    wrap.classList.toggle("active", isCenter);

    inner.style.transform = flipped[i] ? "rotateY(180deg)" : "rotateY(0deg)";
  });

  // Update counter
  document.getElementById("ch2-counter").textContent =
    String(currentIndex + 1).padStart(2, "0") + " / " +
    String(CARDS.length).padStart(2, "0");
}

/* ── Flip card ──────────────────────────────── */
function flipCurrent() {
  flipped[currentIndex] = !flipped[currentIndex];
  updateCarousel();
}

/* ── Events ─────────────────────────────────── */
document.getElementById("ch2-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % CARDS.length;
  updateCarousel();
});

document.getElementById("ch2-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + CARDS.length) % CARDS.length;
  updateCarousel();
});

document.getElementById("ch2-flip").addEventListener("click", flipCurrent);

// Click on active card to flip
carousel.addEventListener("click", () => {
  flipCurrent();
});

// Keyboard
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { currentIndex = (currentIndex + 1) % CARDS.length; updateCarousel(); }
  if (e.key === "ArrowLeft")  { currentIndex = (currentIndex - 1 + CARDS.length) % CARDS.length; updateCarousel(); }
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipCurrent(); }
});

// Touch swipe — navigates cards; short taps still flip via the existing click handler
let swipeStartX = 0;
let swipeStartY = 0;
let swipeActive = false;

carousel.addEventListener("touchstart", e => {
  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;
  swipeActive = false;
}, { passive: true });

carousel.addEventListener("touchmove", e => {
  const dx = Math.abs(e.touches[0].clientX - swipeStartX);
  const dy = Math.abs(e.touches[0].clientY - swipeStartY);
  if (dx > dy && dx > 10) {
    swipeActive = true;
    e.preventDefault(); // block page scroll during horizontal swipe
  }
}, { passive: false });

carousel.addEventListener("touchend", e => {
  if (!swipeActive) return;
  const dx = e.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(dx) > 50) {
    e.preventDefault(); // suppress the tap-click so the card doesn't also flip
    if (dx < 0) {
      currentIndex = (currentIndex + 1) % CARDS.length; // swipe left → next
    } else {
      currentIndex = (currentIndex - 1 + CARDS.length) % CARDS.length; // swipe right → prev
    }
    updateCarousel();
  }
  swipeActive = false;
});

updateCarousel();
