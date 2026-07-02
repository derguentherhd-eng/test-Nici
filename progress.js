/* ============================================
   progress.js — Shared progress utilities
   Loaded before every chapter script.
   ============================================ */

const PROGRESS_KEY = "type-lab-progress-v1";

const CHAPTERS = [
  { id:1, slug:"chapter1" }, { id:2, slug:"chapter2" },
  { id:3, slug:"chapter3" }, { id:4, slug:"chapter4" },
  { id:5, slug:"chapter5" }, { id:6, slug:"chapter6" },
];

function readProgress() {
  try { const raw = localStorage.getItem(PROGRESS_KEY); if (raw) return JSON.parse(raw); } catch {}
  try { const s = JSON.parse(window.name || "{}"); if (s[PROGRESS_KEY]) return s[PROGRESS_KEY]; } catch {}
  return { completed: [] };
}

function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
  try { const s = JSON.parse(window.name || "{}"); s[PROGRESS_KEY] = p; window.name = JSON.stringify(s); } catch {}
}

function markComplete(chapterId) {
  const p = readProgress();
  if (!p.completed.includes(chapterId)) p.completed.push(chapterId);
  saveProgress(p);
  window.dispatchEvent(new Event("type-lab-progress"));
  const next = CHAPTERS.find(c => c.id === chapterId + 1);
  location.href = next ? next.slug + ".html" : "chapterpage.html";
}

const CHECK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

function renderDots(chapterId) {
  const p    = readProgress();
  const wrap = document.getElementById("progress-dots");
  wrap.innerHTML = "";

  const startA = document.createElement("a");
  startA.href = "chapterpage.html";
  startA.className = "chapter-nav-start";
  startA.textContent = "START";
  wrap.appendChild(startA);

  const sep = document.createElement("div");
  sep.className = "chapter-nav-sep";
  wrap.appendChild(sep);

  CHAPTERS.forEach(c => {
    const isCurrent = c.id === chapterId;
    const isDone    = p.completed.includes(c.id);
    const d = isDone && !isCurrent
      ? document.createElement("a")
      : document.createElement("div");
    if (isDone && !isCurrent) d.href = c.slug + ".html";
    d.className = "chapter-nav-tab" +
      (isCurrent ? " current" : (isDone ? " done" : ""));
    d.textContent = String(c.id).padStart(2, "0");
    wrap.appendChild(d);
  });

  const btn    = document.getElementById("btn-complete");
  const done   = p.completed.includes(chapterId);
  const isLast = chapterId >= CHAPTERS.length;
  btn.className = "btn-complete" + (done ? " done" : "");
  btn.innerHTML = done
    ? `${CHECK_SVG}${isLast ? "Fertig" : "Nächstes Kapitel"}`
    : (isLast ? "Abschließen" : "Abschließen &amp; weiter");
}
