// =====================================================
// NeuroHome shared interactivity
// =====================================================

// ========== SCROLL REVEAL ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ========== NAV + STICKY CTA ==========
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    const sticky = document.getElementById('stickyCta');
    if (sticky && window.innerWidth <= 900) {
      sticky.style.display = window.scrollY > 500 ? 'block' : 'none';
    }
    scrollScheduled = false;
  });
}, { passive: true });

// ========== MOBILE NAV ==========
function toggleMobileNav() {
  const links = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-mobile-toggle');
  const isOpen = links.classList.toggle('mobile-open');
  if (toggle) toggle.setAttribute('aria-expanded', String(isOpen));
}
document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('mobile-open');
    const toggle = document.querySelector('.nav-mobile-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
});

// ========== FAQ ==========
function toggleFaq(el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    const btn = i.querySelector('.faq-q');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
  if (!wasOpen) {
    item.classList.add('open');
    el.setAttribute('aria-expanded', 'true');
  }
}

// ========== THE METHOD - stepper ==========
// State: one integer `open`, 1-4. Step 01 shows by default; one step shows at a
// time (swap in place); the right-side "Next" arrow advances to open + 1.
(function () {
  const root = document.getElementById('method');
  if (!root || !root.querySelector('[data-step]')) return;
  let open = 1;
  function render() {
    root.querySelectorAll('[data-step]').forEach(el => { el.hidden = +el.dataset.step !== open; });
    const closer = root.querySelector('[data-closer]');
    if (closer) closer.hidden = open !== 4;
  }
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-go]');
    if (!btn) return;
    open = +btn.dataset.go;
    render();
  });
  render();
})();

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========== TESTIMONIAL REEL LIGHTBOX ==========
// Each reel card opens an on-site player that embeds the Instagram
// reel in an iframe (played inline, no redirect), with prev/next,
// keyboard control, backdrop/Esc close and body scroll-lock. The
// iframe src is only set on open and cleared on close, so no
// Instagram content (or its tracking) loads until a visitor clicks.
(function () {
  const grid = document.getElementById('reelGrid');
  const lb = document.getElementById('reelLightbox');
  if (!grid || !lb) return;

  const cards = Array.from(grid.querySelectorAll('.reel-card[data-embed]'));
  if (!cards.length) return;

  const frame = lb.querySelector('.reel-lb-frame');
  const labelEl = lb.querySelector('.reel-lb-label');
  const linkEl = lb.querySelector('.reel-lb-link');
  const btnPrev = lb.querySelector('.reel-lb-prev');
  const btnNext = lb.querySelector('.reel-lb-next');
  const btnClose = lb.querySelector('.reel-lb-close');
  const single = cards.length < 2;
  if (single) { btnPrev.style.display = 'none'; btnNext.style.display = 'none'; }

  let current = -1;
  let lastFocus = null;

  function show(i) {
    current = (i + cards.length) % cards.length;
    const c = cards[current];
    const label = c.getAttribute('data-label') || 'Family story';
    const iframe = document.createElement('iframe');
    iframe.src = c.getAttribute('data-embed');
    iframe.title = label + ' on Instagram';
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; clipboard-write');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('scrolling', 'no');
    frame.replaceChildren(iframe);
    labelEl.textContent = label;
    linkEl.href = c.getAttribute('data-link') || c.getAttribute('href') || '#';
  }

  function open(i) {
    lastFocus = document.activeElement;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reel-lock');
    show(i);
    btnClose.focus();
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reel-lock');
    frame.replaceChildren(); // stop playback
    current = -1;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  cards.forEach((c, i) => {
    c.addEventListener('click', (e) => { e.preventDefault(); open(i); });
  });
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));
  btnClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (!single && e.key === 'ArrowLeft') show(current - 1);
    else if (!single && e.key === 'ArrowRight') show(current + 1);
  });
})();

// ========== TESTIMONIAL CAROUSEL (3-up, arrow paging) ==========
// The reel grid is a horizontal snap-scroll track showing 3 cards at a
// time; the arrows page it by one viewport (3 on desktop, 2 on tablet,
// 1 on mobile) and hide themselves at each end. Touch/trackpad swipe
// works natively.
(function () {
  const track = document.getElementById('reelGrid');
  if (!track) return;
  const prev = document.querySelector('.reel-arrow-prev');
  const next = document.querySelector('.reel-arrow-next');
  if (!prev || !next) return;

  function step() {
    const card = track.querySelector('.reel-card');
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    const cw = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    const perView = Math.max(1, Math.round((track.clientWidth + gap) / cw));
    return cw * perView;
  }
  function update() {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.toggleAttribute('disabled', track.scrollLeft <= 0);
    next.toggleAttribute('disabled', track.scrollLeft >= max);
  }
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
