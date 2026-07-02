/* ============================================
   chapterpage.js — Chapter Overview Page
   ============================================ */

document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

const CHAPTER_DATA = [
  { id: 1, title: "E-Reader-Typografie",       subtitle: "Leseerfahrung anpassen",       slug: "chapter1", color: "#135ae4" },
  { id: 2, title: "Karteikarten-Karussell",    subtitle: "Schriftlehre lernen",          slug: "chapter2", color: "#ffa3cf" },
  { id: 3, title: "Typografie-Zeitstrahl",     subtitle: "1970 → 2016",                  slug: "chapter3", color: "#269e5f" },
  { id: 4, title: "Variable Font Playground",  subtitle: "Achsen in Bewegung",           slug: "chapter4", color: "#fbd530" },
  { id: 5, title: "Generative Eingaben",       subtitle: "Audio- & distanzreaktiv",      slug: "chapter5", color: "#ff6853" },
  { id: 6, title: "Wissenszentrum",            subtitle: "Artikel & Fallstudien",        slug: "chapter6", color: "#cba6e8" },
];

function resetProgress() {
  try { localStorage.removeItem(PROGRESS_KEY); } catch {}
  try { const s = JSON.parse(window.name || "{}"); delete s[PROGRESS_KEY]; window.name = JSON.stringify(s); } catch {}
  for (let i = 1; i <= 6; i++) {
    try { localStorage.removeItem('type-lab-overlay-ack-0' + i); } catch {}
  }
  try { localStorage.removeItem('type-lab-overlay-ack-home'); } catch {}
  if (typeof window.__showHomeOverlay === 'function') window.__showHomeOverlay();
  render();
}

/* ── SVG helpers ─────────────────────────────── */
function svgArrow() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>`;
}
function svgCheck() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`;
}
function svgLock() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>`;
}

/* ── Shared card body ────────────────────────── */
function buildCardBody(ch) {
  const body = document.createElement("div");
  body.className = "chapter-card-body";

  const top = document.createElement("div");
  top.className = "chapter-card-top";

  const num = document.createElement("span");
  num.className  = "chapter-card-num font-mono";
  num.textContent = "CH." + String(ch.id).padStart(2, "0");
  top.appendChild(num);

  const foot = document.createElement("div");
  foot.className = "chapter-card-foot";

  const name = document.createElement("h3");
  name.className  = "chapter-card-name font-display";
  name.textContent = ch.title;

  foot.appendChild(name);
  body.appendChild(top);
  body.appendChild(foot);

  return { body, top };
}

/* ── Render ──────────────────────────────────── */
function render() {
  const prog      = readProgress();
  const completed = prog.completed || [];
  const count     = completed.length;

  document.getElementById("progress-count").innerHTML = `${count}<span>/6</span>`;

  const resetBtn = document.getElementById("reset-btn");
  resetBtn.style.display = count > 0 ? "block" : "none";
  resetBtn.onclick = resetProgress;

  const grid = document.getElementById("chapters-grid");
  grid.innerHTML = "";

  CHAPTER_DATA.forEach((ch, i) => {
    const isUnlocked = ch.id === 1 || completed.includes(ch.id - 1);
    const isDone     = completed.includes(ch.id);
    const { body, top } = buildCardBody(ch);

    if (isUnlocked) {
      const card = document.createElement("a");
      card.href  = ch.slug + ".html";
      card.className = "chapter-card";
      card.style.animationDelay = (i * 50) + "ms";

      const icon = document.createElement("div");
      icon.className = isDone ? "chapter-card-check" : "chapter-card-icon";
      icon.innerHTML = isDone ? svgCheck() : svgArrow();
      top.appendChild(icon);

      card.classList.add('card-ch-' + ch.id);
      card.appendChild(body);
      grid.appendChild(card);
    } else {
      const card = document.createElement("div");
      card.className = "chapter-card-locked";
      card.style.animationDelay = (i * 50) + "ms";

      const lockIcon = document.createElement("div");
      lockIcon.innerHTML = svgLock();
      top.appendChild(lockIcon);

      card.appendChild(body);
      grid.appendChild(card);
    }
  });
}

// Re-render whenever this page becomes visible:
//   - pageshow covers both fresh loads and bfcache restores (back/forward button)
//   - visibilitychange covers tab-switching and focus returns
//   - storage covers changes made in another tab/window
window.addEventListener("pageshow", render);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) render();
});
window.addEventListener("storage", e => {
  if (e.key === PROGRESS_KEY || e.key === null) render();
});

render();
