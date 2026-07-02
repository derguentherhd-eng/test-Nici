/* ============================================
   chapter6.js — Knowledge Hub
   ============================================ */

const CHAPTER_ID = 6;

document.getElementById('btn-complete').addEventListener('click', () => markComplete(CHAPTER_ID));
renderDots(CHAPTER_ID);

/* ── Article data ───────────────────────────── */
const POSTS = [
  {
    tag: 'VARIABLE FONTS · PANGRAM PANGRAM',
    title: 'Die besten Variable Fonts der Gegenwart',
    excerpt: 'Fragment, GT Ultra und Kachi-Buwa zeigen, wie Variable-Font-Technologie heute genutzt wird – nicht als technische Optimierung, sondern als kreatives Werkzeug, das typografische Klassifikationen neu herausfordert und emotionale Ausdrucksformen erschliesst.',
    read: '8 Min. Lesezeit',
    url: 'https://pangrampangram.com/blogs/journal/best-variable-fonts',
    img: 'Images/ch6-variable-fonts.jpg',
  },
  {
    tag: 'EDITORIAL · DESIGN OBSERVER',
    title: 'Die Zukunft der Typografie',
    excerpt: 'Petr van Blokland argumentiert, dass Schriftgroesse, Zeilenabstand und Schriftwahl auch im digitalen Zeitalter unveraendert gueltig bleiben. Responsives Design aendert nicht die Regeln – sondern die Komplexitaet ihrer Anwendung.',
    read: '6 Min. Lesezeit',
    url: 'https://designobserver.com/the-future-of-typography/',
    img: 'Images/ch6-design-observer.png',
  },
  {
    tag: 'TRENDS · MONOTYPE',
    title: 'Sound & Vision: Wenn Klang zur Schrift wird',
    excerpt: 'Monotypes Tool Sonotype erkundet die Synaesthesie zwischen Audio und visueller Typografie. Es hilft Kreativen, emotionale Verbindungen zwischen Klang und Schriftform herzustellen und macht sie zu gestalterischen Design-Assets.',
    read: '5 Min. Lesezeit',
    url: 'https://www.monotype.com/type-trends/sound-vision/',
    img: null,
    art: 'sound',
  },
  {
    tag: 'ZUKUNFT · KI',
    title: 'KI formt die Typografie neu',
    excerpt: 'Custom-Font-Generatoren und KI-Layoutsysteme bieten neue Effizienz – werfen aber grundlegende Fragen zu kreativer Originalitaet, kultureller Vielfalt in Schriftformen und den urheberrechtlichen Rahmenbedingungen fuer KI-generierte Typefaces auf.',
    read: '7 Min. Lesezeit',
    url: 'https://medium.com/aimonks/ai-and-typography-typography-and-ai-144bb7b2687f',
    img: null,
    art: 'ai',
  },
  {
    tag: 'LEXIKON · TYPOLEXIKON',
    title: 'Generative Typografie durch Kuenstliche Intelligenz',
    excerpt: 'Algorithmen erzeugen Layouts, Schriften und Webseiten auf Basis vordefinierter Regeln. Das Typolexikon untersucht Effizienzgewinne ebenso wie die Gefahr der Uniformierung und den Verlust menschlicher Kreativitaet im maschinell generierten Design.',
    read: '9 Min. Lesezeit',
    url: 'https://www.typolexikon.de/generative-typografie/',
    img: 'Images/ch6-typolexikon.jpg',
  },
  {
    tag: 'GESCHICHTE · PANGRAM PANGRAM',
    title: 'Die ersten Schriften im Internet',
    excerpt: 'Von Times New Roman und Arial als web-safe Fonts ueber Microsofts Schriften-Initiative 1996 bis zu CSS @font-face und Google Fonts – eine Zeitreise durch die Technologien, die Typografie im Web erst moeglich machten.',
    read: '5 Min. Lesezeit',
    url: 'https://pangrampangram.com/blogs/journal/internet-fonts',
    img: 'Images/ch6-internet-fonts.jpg',
  },
];

/* ── Build fallback art (articles without image) ── */
function buildFallbackArt(kind) {
  const wrap = document.createElement('div');
  wrap.className = 'ch6-article-art';

  if (kind === 'sound') {
    const d = document.createElement('div');
    d.className = 'art-sound';
    for (let i = 0; i < 12; i++) {
      const bar = document.createElement('div');
      const h = 20 + Math.sin(i * 0.8) * 18 + Math.random() * 20;
      bar.style.cssText = 'position:absolute;bottom:50%;width:6px;border-radius:3px;background:var(--c-coral);opacity:0.7;height:' + h + 'px;left:' + (8 + i * 14) + 'px;transform:translateY(50%)';
      d.appendChild(bar);
    }
    const sp = document.createElement('span');
    sp.className = 'font-display';
    sp.textContent = '♪';
    sp.style.cssText = 'position:absolute;bottom:8px;right:12px;font-size:2rem;opacity:0.3;color:#fff;';
    d.appendChild(sp);
    wrap.appendChild(d);
  } else if (kind === 'ai') {
    const d = document.createElement('div');
    d.className = 'art-ai-type';
    const sp = document.createElement('span');
    sp.className = 'font-display';
    sp.textContent = 'AI';
    d.appendChild(sp);
    wrap.appendChild(d);
  }

  return wrap;
}

/* ── Render grid ─────────────────────────────── */
const grid = document.getElementById('ch6-grid');
POSTS.forEach(function(p) {
  const article = document.createElement('article');
  article.className = 'ch6-article';

  if (p.img) {
    const artWrap = document.createElement('div');
    artWrap.className = 'ch6-article-art';
    const img = document.createElement('img');
    img.src = p.img;
    img.alt = p.title;
    img.className = 'ch6-article-img';
    artWrap.appendChild(img);
    article.appendChild(artWrap);
  } else {
    article.appendChild(buildFallbackArt(p.art));
  }

  const body = document.createElement('div');
  body.className = 'ch6-article-body';

  const tag = document.createElement('div');
  tag.className = 'ch6-article-tag font-mono';
  tag.textContent = p.tag;

  const title = document.createElement('h3');
  title.className = 'ch6-article-title font-display';
  title.textContent = p.title;

  const excerpt = document.createElement('p');
  excerpt.className = 'ch6-article-excerpt';
  excerpt.textContent = p.excerpt;

  const footer = document.createElement('div');
  footer.className = 'ch6-article-footer';

  const read = document.createElement('span');
  read.className = 'ch6-article-read font-mono';
  read.textContent = p.read;

  const link = document.createElement('a');
  link.className = 'ch6-article-link';
  link.textContent = 'Lesen →';
  link.href = p.url;
  link.target = '_blank';

  footer.appendChild(read);
  footer.appendChild(link);

  body.appendChild(tag);
  body.appendChild(title);
  body.appendChild(excerpt);
  body.appendChild(footer);
  article.appendChild(body);
  grid.appendChild(article);
});
