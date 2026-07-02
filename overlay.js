(function () {
  function init() {
    var eyebrow = document.querySelector('.chapter-eyebrow');
    if (!eyebrow) return;

    var chNum   = document.querySelector('.chapter-num');
    var chTitle = document.querySelector('.chapter-title-label');

    var instructionText = eyebrow.textContent.trim();
    var chapterNum      = chNum   ? chNum.textContent.trim()   : '';
    var chapterTitle    = chTitle ? chTitle.textContent.trim() : '';

    // ── Overlay ──────────────────────────────────
    var overlay = document.createElement('div');
    overlay.className = 'instruction-overlay';
    overlay.innerHTML =
      '<div class="instruction-card">' +
        '<div class="instruction-card-meta">' + chapterNum + '</div>' +
        '<div class="instruction-card-title">' + chapterTitle + '</div>' +
        '<div class="instruction-card-divider"></div>' +
        '<p class="instruction-card-text">' + instructionText + '</p>' +
        '<button class="instruction-btn-ok" type="button">Verstanden</button>' +
      '</div>';
    document.body.appendChild(overlay);

    var card = overlay.querySelector('.instruction-card');

    // ── Acknowledgement state ─────────────────────
    var titleNum   = chapterNum.replace('CH.', '');
    var storageKey = 'type-lab-overlay-ack-' + titleNum;
    var acknowledged = false;
    try { acknowledged = !!localStorage.getItem(storageKey); } catch(e) {}

    if (acknowledged) overlay.style.display = 'none';

    // ── Chapter accent color (for pill + info btn) ────
    var accentMap = {
      '01': { bg: '#135ae4', fg: '#ffffff' },
      '02': { bg: '#ffa3cf', fg: '#1e1c19' },
      '03': { bg: '#269e5f', fg: '#ffffff' },
      '04': { bg: '#fbd530', fg: '#1e1c19' },
      '05': { bg: '#ff6853', fg: '#ffffff' },
      '06': { bg: '#cba6e8', fg: '#1e1c19' }
    };
    var accent = accentMap[titleNum] || { bg: '#1e1c19', fg: '#f6f5f0' };

    // ── Chapter title pill (bottom right) ────────
    var titlePill = document.createElement('div');
    titlePill.className = 'chapter-title-pill';
    titlePill.textContent = titleNum + ' ' + chapterTitle;
    titlePill.style.background = accent.bg;
    titlePill.style.color = accent.fg;
    var headerInner = document.querySelector('.chapter-header-inner');
    if (headerInner) headerInner.appendChild(titlePill);
    else document.body.appendChild(titlePill);

    // ── Info-Button ───────────────────────────────
    var infoBtn = document.createElement('button');
    infoBtn.className = 'info-btn';
    infoBtn.type = 'button';
    infoBtn.title = 'Aufgabe anzeigen';
    infoBtn.textContent = 'i';
    infoBtn.style.background = accent.bg;
    infoBtn.style.color = accent.fg;
    infoBtn.style.border = 'none';
    document.body.appendChild(infoBtn);

    function dismiss() {
      overlay.style.display = 'none';
      try { localStorage.setItem(storageKey, '1'); } catch(e) {}
    }

    function show() {
      overlay.style.display = 'flex';
      // Re-trigger card entrance animation
      card.style.animation = 'none';
      card.offsetHeight; // force reflow
      card.style.animation = '';
    }

    var okBtn = overlay.querySelector('.instruction-btn-ok');
    okBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dismiss();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismiss();
    });

    infoBtn.addEventListener('click', show);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
