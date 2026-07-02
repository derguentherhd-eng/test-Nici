/* ============================================
   chapter1.js — E-Reader Typography Simulator
   ============================================ */

document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

const CHAPTER_ID = 1;

document.getElementById("btn-complete").addEventListener("click", () => markComplete(CHAPTER_ID));
renderDots(CHAPTER_ID);

/* ── E-Reader sample text ───────────────────── */
const SAMPLE = `Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Er lag auf seinem panzerartig harten Rücken und sah, wenn er den Kopf ein wenig hob, seinen gewölbten, braunen, von bogenförmigen Versteifungen geteilten Bauch, auf dessen Höhe sich die Bettdecke, zum gänzlichen Niedergleiten bereit, kaum noch erhalten konnte. Seine vielen, im Vergleich zu seinem sonstigen Umfang kläglich dünnen Beine flimmerten ihm hilflos vor den Augen.

»Was ist mit mir geschehen?« dachte er. Es war kein Traum. Sein Zimmer, ein richtiges, nur etwas zu kleines Menschenzimmer, lag ruhig zwischen den vier wohlbekannten Wänden. Über dem Tisch, auf dem eine auseinandergepackte Musterkollektion von Tuchwaren ausgebreitet war – Samsa war Reisender –, hing das Bild, das er vor kurzem aus einer illustrierten Zeitschrift ausgeschnitten und in einem hübschen, vergoldeten Rahmen untergebracht hatte. Es stellte eine Dame dar, die, mit einem Pelzhut und einer Pelzboa versehen, aufrecht dasaß und einen schweren Pelzmuff, in dem ihr ganzer Unterarm verschwunden war, dem Beschauer entgegenhob.

Gregors Blick richtete sich dann zum Fenster, und das trübe Wetter – man hörte Regentropfen auf das Fensterblech aufschlagen – machte ihn ganz melancholisch. »Wie wäre es, wenn ich noch ein wenig weiterschliefe
und alle Narrheiten vergäße,« dachte er, aber das war gänzlich undurchführbar, denn er war gewöhnt, auf der rechten Seite zu schlafen, konnte sich aber in seinem gegenwärtigen Zustand nicht in diese Lage bringen. Mit welcher Kraft er sich auch auf die rechte Seite warf, immer wieder schaukelte er in die Rückenlage zurück. Er versuchte es wohl hundertmal, schloß die Augen, um die zappelnden Beine nicht sehen zu müssen, und ließ erst ab, als er in der Seite einen noch nie gefühlten, leichten, dumpfen Schmerz zu fühlen begann.`;

/* ── State ──────────────────────────────────── */
const state = {
  size:       18,
  lh:         1.6,
  ls:         0,
  margin:     48,
  weight:     400,
  brightness: 100,
  dark:       false,
};

const LIGHT = { bg: "#f6f5f0", fg: "#1e1c19" };
const DARK  = { bg: "#1e1c19", fg: "#f6f5f0" };

const SVG_SUN  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const SVG_MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

/* ── Populate text ──────────────────────────── */
const textEl = document.getElementById("ch1-text");
SAMPLE.split("\n\n").forEach(para => {
  const p = document.createElement("p");
  p.textContent = para;
  textEl.appendChild(p);
});

/* ── Apply state ────────────────────────────── */
function applyState() {
  const screen = document.getElementById("ch1-screen");
  const inner  = document.getElementById("ch1-screen-inner");
  const theme  = state.dark ? DARK : LIGHT;

  screen.style.background = theme.bg;
  screen.style.color       = theme.fg;
  screen.style.filter      = `brightness(${state.brightness}%)`;

  inner.style.padding = `${state.margin}px`;

  textEl.style.fontSize      = state.size + "px";
  textEl.style.lineHeight    = state.lh;
  textEl.style.letterSpacing = state.ls + "px";
  textEl.style.fontWeight    = state.weight;
  textEl.style.fontVariationSettings =
    `"opsz" ${Math.max(8, Math.min(144, state.size))}, "wght" ${state.weight}`;

  // Update dark/light toggle UI
  const switchBtn = document.getElementById("dark-mode-switch");
  const modeLabel = document.getElementById("mode-label");
  const modeIcon  = document.getElementById("mode-icon");

  switchBtn.classList.toggle("on", state.dark);
  switchBtn.setAttribute("aria-pressed", String(state.dark));
  modeLabel.textContent = state.dark ? "Dunkler Modus" : "Heller Modus";
  modeIcon.innerHTML    = state.dark ? SVG_MOON : SVG_SUN;

  // Update slider fill/thumb positions and value labels
  document.querySelectorAll("[data-key]").forEach(wrap => {
    const key   = wrap.dataset.key;
    const input = wrap.querySelector(".slider-native");
    if (!input) return;
    const fill  = wrap.querySelector(".slider-fill");
    const thumb = wrap.querySelector(".slider-thumb");
    const min   = parseFloat(input.min);
    const max   = parseFloat(input.max);
    const val   = state[key];
    const pct   = ((val - min) / (max - min)) * 100;
    fill.style.width  = pct + "%";
    thumb.style.left  = pct + "%";
    const labelSpan = wrap.closest(".control-row")?.querySelector(".control-val");
    if (labelSpan) labelSpan.textContent = formatVal(key, val);
  });
}

function formatVal(key, val) {
  switch (key) {
    case "size":       return val + "px";
    case "lh":         return val.toFixed(2);
    case "ls":         return val.toFixed(1) + "px";
    case "margin":     return val + "px";
    case "weight":     return String(val);
    case "brightness": return val + "%";
    default:           return val;
  }
}

/* ── Build slider ────────────────────────────── */
function buildSlider({ key, min, max, step, value }) {
  const wrap = document.createElement("div");
  wrap.className = "slider-wrap";
  wrap.dataset.key = key;

  const track = document.createElement("div");
  track.className = "slider-track";

  const fill  = document.createElement("div");
  fill.className = "slider-fill";

  const thumb = document.createElement("div");
  thumb.className = "slider-thumb";

  const input = document.createElement("input");
  input.type      = "range";
  input.className = "slider-native";
  input.min       = min;
  input.max       = max;
  input.step      = step;
  input.value     = value;

  const pct = ((value - min) / (max - min)) * 100;
  fill.style.width = pct + "%";
  thumb.style.left = pct + "%";

  input.addEventListener("input", () => {
    const v    = parseFloat(input.value);
    state[key] = v;
    const p    = ((v - min) / (max - min)) * 100;
    fill.style.width = p + "%";
    thumb.style.left = p + "%";
    const labelSpan = wrap.closest(".control-row")?.querySelector(".control-val");
    if (labelSpan) labelSpan.textContent = formatVal(key, v);
    applyState();
  });

  track.appendChild(fill);
  track.appendChild(thumb);
  track.appendChild(input);
  wrap.appendChild(track);
  return wrap;
}

/* ── Dark / Light toggle ────────────────────── */
document.getElementById("dark-mode-switch").addEventListener("click", () => {
  state.dark = !state.dark;
  applyState();
});

/* ── Brightness slider ──────────────────────── */
document.getElementById("brightness-slider-container").appendChild(
  buildSlider({ key: "brightness", min: 50, max: 120, step: 1, value: state.brightness })
);

/* ── Type control sliders ────────────────────── */
const TYPE_CONTROLS = [
  { key:"size",   label:"Schriftgröße",    min:12,  max:32,  step:1    },
  { key:"lh",     label:"Zeilenhöhe",      min:1.1, max:2.2, step:0.01 },
  { key:"ls",     label:"Zeichenabstand",  min:-1,  max:3,   step:0.1  },
  { key:"margin", label:"Ränder",          min:20,  max:100, step:1    },
  { key:"weight", label:"Weight",          min:300, max:800, step:10   },
];

const typeControlsEl = document.getElementById("type-controls");
TYPE_CONTROLS.forEach(({ key, label, min, max, step }) => {
  const row = document.createElement("div");
  row.className = "control-row";

  const labelRow = document.createElement("div");
  labelRow.className = "control-label-row";

  const lbl = document.createElement("span");
  lbl.textContent = label;

  const val = document.createElement("span");
  val.className = "control-val font-mono";
  val.textContent = formatVal(key, state[key]);

  labelRow.appendChild(lbl);
  labelRow.appendChild(val);
  row.appendChild(labelRow);
  row.appendChild(buildSlider({ key, min, max, step, value: state[key] }));
  typeControlsEl.appendChild(row);
});

applyState();
