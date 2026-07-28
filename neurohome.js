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

// ========== INSTAGRAM EMBED LAZY-LOADER ==========
// Loads Instagram's embed.js only when a testimonial scrolls into view.
// This keeps ~200KB of Meta tracking JS off the initial page load
// for visitors who never scroll to the testimonials section.
(function () {
  const cards = document.querySelectorAll('.testimonial-ig-wrap');
  if (!cards.length) return;

  let scriptLoaded = false;

  function loadInstagramScript() {
    if (scriptLoaded) return;
    scriptLoaded = true;

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    s.onload = () => {
      // Once script loads, ask IG to process the blockquotes on the page
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };
    s.onerror = () => {
      console.warn('Instagram embed script failed to load. Falling back to permalink links inside each blockquote.');
    };
    document.body.appendChild(s);
  }

  // Trigger on first scroll-into-view of any testimonial card
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        loadInstagramScript();
        io.disconnect();
        break;
      }
    }
  }, { rootMargin: '300px 0px' }); // 300px early so embeds are ready by the time they're visible

  cards.forEach((c) => io.observe(c));
})();
