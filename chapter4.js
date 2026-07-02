/* ============================================
   chapter4.js — Variable Font Playground
   ============================================ */

const CHAPTER_ID = 4;

document.getElementById("btn-complete").addEventListener("click", () => markComplete(CHAPTER_ID));
renderDots(CHAPTER_ID);

/* ── Axis data ──────────────────────────────── */
const AXES = [
  {
    key:"wght", tag:"wght", label:"Weight", min:100, max:900, def:400,
    sample:"Schwere Gedanken",
    description:"Die Weight-Achse kontrolliert die Strichstärke aller Buchstaben. Niedrige Werte (100–300) erzeugen haarfeine, zarte Schnitte – ideal für elegante Überschriften oder dezente Bildunterschriften. Hohe Werte (700–900) liefern kraftvolle, präsente Schrift. Früher brauchte man für jeden Schnitt eine eigene Datei: Light, Regular, Bold, Black. Eine Variable Font enthält sie alle – und zusätzlich jeden Zwischenwert, der in keinem statischen System existiert.",
    apply: v => ({ fontVariationSettings:`"wght" ${v}`, fontWeight:v }),
  },
  {
    key:"wdth", tag:"wdth", label:"Width", min:75, max:125, def:100, unit:"%",
    sample:"Weite Horizonte",
    description:"Die Width-Achse streckt oder verdichtet alle Buchstaben gleichmäßig in der Horizontalen, ohne ihre Vertikalen zu verändern. Werte unter 100 % (Condensed) eignen sich für enge Spalten oder platzsparende Überschriften auf Mobilgeräten. Werte über 100 % (Extended) schaffen Luftigkeit für Display-Titel oder Logos. Im Gegensatz zu einem simplen CSS-Skalieren (transform: scaleX) bleibt bei Width die optische Qualität jedes Buchstabens vollständig erhalten.",
    apply: v => ({ fontVariationSettings:`"wdth" ${v}`, fontStretch:`${v}%` }),
  },
  {
    key:"slnt", tag:"slnt", label:"Slant", min:-10, max:0, step:0.1, def:0, unit:"°",
    sample:"Nach vorne",
    description:"Die Slant-Achse neigt alle Buchstaben geometrisch, ohne ihre innere Zeichnung zu verändern. Das unterscheidet sie fundamental von echtem Kursiv: Kursive Schnitte werden komplett neu gezeichnet – das 'a' wechselt die Form, Bögen werden enger, Buchstaben bekommen neue Ausläufer. Slant hingegen kippt jede Buchstabenform einfach nach links oder rechts. Das ergibt subtile Betonung ohne Stilwechsel – besonders nützlich, wenn kein echter Kursivschnitt vorhanden ist.",
    apply: v => ({ fontVariationSettings:`"slnt" ${v}`, fontStyle: v < 0 ? "oblique" : "normal" }),
  },
  {
    key:"opsz", tag:"opsz", label:"Optical size", min:8, max:144, def:36,
    sample:"Lesbar in jeder Größe",
    description:"Die Optical-Size-Achse optimiert die Buchstabenstruktur für ihren Einsatzkontext – ähnlich wie traditionelle Schriftgießereien für jede Schriftgröße eigene Stempel anfertigten. Bei kleinen Größen (8–14 pt) öffnen sich Buchstabenräume, Striche werden gleichmäßiger und Details vereinfachen sich für maximale Lesbarkeit. Bei großen Display-Größen (60–144 pt) werden Abstände enger, Kontraste feiner – die Schrift wirkt elegant und präzise. Mit 'font-optical-sizing: auto' passt der Browser diese Achse automatisch an.",
    apply: v => ({ fontVariationSettings:`"opsz" ${v}` }),
  },
  {
    key:"GRAD", tag:"GRAD", label:"Contrast", min:-50, max:150, def:0,
    sample:"Hoher Kontrast",
    description:"Die Grade-Achse verändert die optische Schwärzung der Schrift – ähnlich wie Weight –, beeinflusst aber weder Abstände noch Gesamtbreite. Buchstaben werden dunkler oder heller, ohne das Textbild zu verschieben. Das ist besonders wertvoll im responsiven Design: Im Dark Mode erscheint helle Schrift auf dunklem Grund optisch breiter als sie ist – ein negativer Grade-Wert kompensiert das. Ein positiver Wert verstärkt den Kontrast bei schwierigen Lichtverhältnissen.",
    apply: v => ({ fontVariationSettings:`"GRAD" ${v}`, fontWeight: 400 + Math.max(-50, Math.min(150, v)) }),
  },
];

/* ── Fit sample text to container ───────────── */
function fitSampleText(el) {
  const parent = el.closest(".ch4-axis-left");
  if (!parent) return;
  el.style.fontSize = "";                          // reset to CSS 4.5rem
  const available = parent.clientWidth - 80;       // subtract 2 × 2.5rem padding
  if (available <= 0) return;
  if (el.scrollWidth > available) {
    const basePx = parseFloat(window.getComputedStyle(el).fontSize);
    el.style.fontSize = Math.max(20, Math.floor(basePx * available / el.scrollWidth)) + "px";
  }
}

/* ── Build axis cards ────────────────────────── */
const layout = document.getElementById("ch4-layout");

AXES.forEach(axis => {
  const card = document.createElement("div");
  card.className = "ch4-axis-card";

  /* Left pane */
  const left = document.createElement("div");
  left.className = "ch4-axis-left";

  const header = document.createElement("div");
  header.className = "ch4-axis-header";

  const meta = document.createElement("div");
  const tag = document.createElement("div");
  tag.className = "ch4-axis-tag font-mono";
  tag.textContent = "ACHSE · " + axis.tag;

  const name = document.createElement("div");
  name.className = "ch4-axis-name font-display";
  name.textContent = axis.label;

  meta.appendChild(tag);
  meta.appendChild(name);

  const valEl = document.createElement("div");
  valEl.className = "ch4-axis-value font-mono";
  valEl.textContent = axis.def + (axis.unit || "");
  valEl.id = "val-" + axis.key;

  header.appendChild(meta);
  header.appendChild(valEl);

  const sample = document.createElement("div");
  sample.className = "ch4-sample font-showcase";
  sample.id = "sample-" + axis.key;
  sample.textContent = axis.sample;
  Object.assign(sample.style, axis.apply(axis.def));

  /* Slider */
  const sliderTrack = document.createElement("div");
  sliderTrack.className = "slider-track";

  const fill = document.createElement("div");
  fill.className = "slider-fill";
  fill.id = "fill-" + axis.key;

  const thumb = document.createElement("div");
  thumb.className = "slider-thumb";
  thumb.id = "thumb-" + axis.key;

  const input = document.createElement("input");
  input.type  = "range";
  input.className = "slider-native";
  input.min   = axis.min;
  input.max   = axis.max;
  input.step  = axis.step !== undefined ? axis.step : 1;
  input.value = axis.def;

  const pct0 = ((axis.def - axis.min) / (axis.max - axis.min)) * 100;
  fill.style.width  = pct0 + "%";
  thumb.style.left  = pct0 + "%";

  let fitRaf = null;
  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    const pct = ((v - axis.min) / (axis.max - axis.min)) * 100;
    // Phase 1 — writes only, no layout reads (runs synchronously on every event)
    fill.style.width  = pct + "%";
    thumb.style.left  = pct + "%";
    valEl.textContent = v + (axis.unit || "");
    Object.assign(sample.style, axis.apply(v));
    codeTag.textContent = `font-variation-settings: "${axis.tag}" ${v}`;
    // Phase 2 — deferred layout read; avoids forced synchronous reflow after font-variation write
    if (fitRaf) cancelAnimationFrame(fitRaf);
    fitRaf = requestAnimationFrame(() => { fitSampleText(sample); fitRaf = null; });
  });

  sliderTrack.appendChild(fill);
  sliderTrack.appendChild(thumb);
  sliderTrack.appendChild(input);

  const sliderWrap = document.createElement("div");
  sliderWrap.className = "slider-wrap";
  sliderWrap.appendChild(sliderTrack);

  const minMax = document.createElement("div");
  minMax.className = "ch4-slider-minmax font-mono";
  minMax.innerHTML = `<span>${axis.min}${axis.unit||""}</span><span>${axis.max}${axis.unit||""}</span>`;

  left.appendChild(header);
  left.appendChild(sample);
  left.appendChild(sliderWrap);
  left.appendChild(minMax);

  /* Right pane */
  const right = document.createElement("div");
  right.className = "ch4-axis-right";

  const descTitle = document.createElement("h3");
  descTitle.className = "ch4-axis-desc-title font-display";
  descTitle.textContent = axis.label + "-Achse";

  const descText = document.createElement("p");
  descText.className = "ch4-axis-desc-text";
  descText.textContent = axis.description;

  const codeTag = document.createElement("div");
  codeTag.className = "ch4-code-tag font-mono";
  codeTag.id = "code-" + axis.key;
  codeTag.textContent = `font-variation-settings: "${axis.tag}" ${axis.def}`;

  right.appendChild(descTitle);
  right.appendChild(descText);
  right.appendChild(codeTag);

  card.appendChild(left);
  card.appendChild(right);
  layout.appendChild(card);
  fitSampleText(sample);
});

window.addEventListener("resize", () => {
  AXES.forEach(axis => {
    const el = document.getElementById("sample-" + axis.key);
    if (el) fitSampleText(el);
  });
});
