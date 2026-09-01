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

// ========== STEPPERS ==========
// State: one integer `open` per root. One [data-step] shows at a time (swap in
// place); any [data-go] button inside the root jumps to that index.
//
// Two callers, one implementation:
//   #method  - 4 steps, opens on 01, has a [data-closer] that appears on the
//              last step only.
//   #family  - 3 tiers, opens on 02 via [data-stepper-open] because NeuroHome
//              is what this site sells, and mirrors state onto [data-tab]
//              buttons through aria-selected.
//
// A root is found either by being #method (kept as-is so its markup did not
// have to change) or by carrying [data-stepper]. New steppers should use the
// attribute; the #method lookup is here only to avoid touching working markup.
//
// Panels carry the `hidden` attribute in markup, so with JS live the correct
// one is showing from the first paint. CSS under html:not(.js) reveals them all
// when scripting is off - see the .family-* block in neurohome.css.
function initStepper(root) {
  if (!root) return;
  // Idempotent: #method is initialised by id and #family by attribute, so a
  // root that ever gains both would otherwise bind two click handlers.
  if (root.dataset.stepperReady) return;
  const steps = root.querySelectorAll('[data-step]');
  if (!steps.length) return;
  root.dataset.stepperReady = '1';

  const first = +root.dataset.stepperOpen || 1;
  let open = first;

  function render() {
    steps.forEach(el => { el.hidden = +el.dataset.step !== open; });
    // Only #method has a closer; it belongs to the final step.
    const closer = root.querySelector('[data-closer]');
    if (closer) closer.hidden = open !== steps.length;
    // Only #family has tabs; harmless no-op elsewhere.
    root.querySelectorAll('[data-tab]').forEach(tab => {
      tab.setAttribute('aria-selected', String(+tab.dataset.tab === open));
    });
  }

  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-go]');
    if (!btn || !root.contains(btn)) return;
    open = +btn.dataset.go;
    render();
  });

  render();
}

initStepper(document.getElementById('method'));
document.querySelectorAll('[data-stepper]').forEach(initStepper);

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

// ========== RESUME INTAKE CTA ==========
/* A parent who starts the 121-question intake and closes the tab has their
   answers on this device for three days, but nothing on the site said so: the
   nav CTA still pointed at the lead form they had already filled in. When a
   live draft exists, that CTA becomes the way back into it.

   Only the nav CTA is repointed. The hero, founder, method, footer and sticky
   buttons are the pitch to a first-time visitor, and rewriting those for anyone
   whose browser holds a draft would change the whole page for the wrong reason.

   Deliberately visible on a shared device: the household will see that someone
   here has an intake in progress. That is the accepted trade for making the
   draft recoverable at all.

   !! These two constants mirror intake.html and there is no shared module to
   !! enforce it, because intake.html is deliberately self-contained. If
   !! DRAFT_SCHEMA_VERSION or DRAFT_TTL_MS changes there, change them here too or
   !! this feature silently stops working: no error, the CTA just never swaps.
   !! Run `node scripts/check-constants.js` after touching either one. */
(function () {
  var DRAFT_SCHEMA_VERSION = 2;                      // intake.html DRAFT_SCHEMA_VERSION
  var DRAFT_KEY = 'neurosage_intake_draft_v' + DRAFT_SCHEMA_VERSION;
  var DRAFT_TTL_MS = 3 * 24 * 60 * 60 * 1000;        // intake.html DRAFT_TTL_MS

  function liveDraftExists() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      var savedAt = (JSON.parse(raw) || {}).savedAt || 0;
      // The same expiry intake.html applies on load. Offering to resume a draft
      // it is about to discard would drop the parent into a blank form, which is
      // worse than not offering at all.
      if (savedAt && (Date.now() - savedAt) > DRAFT_TTL_MS) return false;
      return true;
    } catch (e) {
      // Private mode, storage disabled, corrupt JSON: no draft we can promise.
      return false;
    }
  }

  if (!liveDraftExists()) return;
  document.querySelectorAll('a.nav-cta[href="start.html"]').forEach(function (cta) {
    cta.setAttribute('href', 'intake.html');
    cta.textContent = 'Resume your intake';
  });
})();
