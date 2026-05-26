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

// ========== DISCOVERY QUIZ ==========
const quizQuestions = [
  { id: 'speech', q: 'Speech', hint: 'How does your child communicate verbally for their age?',
    options: [
      { v: 0, label: 'Speaks in full age-appropriate sentences' },
      { v: 1, label: 'Speaks but limited vocabulary or grammar' },
      { v: 2, label: 'Uses words but not full sentences' },
      { v: 3, label: 'Minimally verbal — single words or sounds' },
      { v: 4, label: 'Nonverbal' },
    ]},
  { id: 'social', q: 'Social engagement', hint: 'Eye contact, social back-and-forth, interest in others.',
    options: [
      { v: 0, label: 'Engages socially and makes consistent eye contact' },
      { v: 1, label: 'Engages with effort, eye contact is inconsistent' },
      { v: 2, label: 'Limited engagement — prefers solo activity' },
      { v: 3, label: 'Avoids social interaction most of the time' },
      { v: 4, label: 'No social engagement / no eye contact' },
    ]},
  { id: 'sensory', q: 'Sensory regulation', hint: 'How does your child handle sounds, lights, textures, or crowds?',
    options: [
      { v: 0, label: 'Handles sensory input well' },
      { v: 1, label: 'Mildly sensitive to certain inputs' },
      { v: 2, label: 'Moderately overwhelmed by sensory input' },
      { v: 3, label: 'Frequently overwhelmed — covers ears, melts down' },
      { v: 4, label: 'Severely dysregulated by most sensory input' },
    ]},
  { id: 'motor', q: 'Motor & coordination', hint: 'Balance, coordination, gross/fine motor skills.',
    options: [
      { v: 0, label: 'Age-appropriate motor skills' },
      { v: 1, label: 'Mildly clumsy or behind on milestones' },
      { v: 2, label: 'Noticeable coordination issues' },
      { v: 3, label: 'Significant motor delays or toe-walking' },
      { v: 4, label: 'Severe motor or balance impairment' },
    ]},
  { id: 'behavior', q: 'Emotional regulation', hint: 'Meltdowns, anxiety, rigid patterns, repetitive behaviors.',
    options: [
      { v: 0, label: 'Emotionally regulated for their age' },
      { v: 1, label: 'Mild meltdowns or rigidity' },
      { v: 2, label: 'Frequent meltdowns or anxiety' },
      { v: 3, label: 'Severe meltdowns, anxiety, or rigid patterns' },
      { v: 4, label: 'Self-injury, aggression, or daily crisis' },
    ]},
];

const quizState = { current: 0, answers: {}, email: '', honeypot: '', startedAt: Date.now(), done: false };
const quizCard = document.getElementById('quizCard');

// GHL Inbound Webhook for Quiz → Create Contact workflow
const GHL_QUIZ_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/OzXiG0YQaeEKh2w5XeyU/webhook-trigger/60ce6ca2-428c-4364-bf56-27014136d0c7';

function renderQuiz() {
  if (!quizCard) return;
  if (quizState.done) { renderResult(); return; }
  const totalSteps = quizQuestions.length + 1;
  const step = quizState.current;
  const isEmailStep = step === quizQuestions.length;
  const progressPct = (step / totalSteps) * 100;

  if (isEmailStep) {
    quizCard.innerHTML = `
      <div class="quiz-progress">
        <span>Step ${step + 1} of ${totalSteps}</span>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progressPct}%"></div></div>
        <span>Almost done</span>
      </div>
      <div class="quiz-question">Where should we send your results?</div>
      <div class="quiz-hint">Just your email. We'll send a personalized summary plus a link to book a free Discovery call if you'd like to talk it through with us.</div>
      <div class="quiz-input-group">
        <label class="quiz-input-label" for="quizEmail">Your email</label>
        <input class="quiz-input" id="quizEmail" type="email" autocomplete="email" inputmode="email" placeholder="you@email.com" value="${quizState.email || ''}" aria-describedby="quizEmailError">
        <div id="quizEmailError" class="quiz-input-error" role="alert" aria-live="polite"></div>
      </div>
      <div class="quiz-honeypot" aria-hidden="true">
        <label for="quizCompany">Company</label>
        <input id="quizCompany" type="text" tabindex="-1" autocomplete="off" value="${quizState.honeypot || ''}">
      </div>
      <div class="quiz-controls">
        <button class="quiz-back" type="button" onclick="quizBack()">&larr; Back</button>
        <button class="quiz-next" id="quizNext" type="button" onclick="quizSubmit()" disabled>See my results <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
      </div>`;

    const emailInput = document.getElementById('quizEmail');
    const emailError = document.getElementById('quizEmailError');
    const nextBtn = document.getElementById('quizNext');
    const honeypotInput = document.getElementById('quizCompany');

    const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    function validateAll() {
      nextBtn.disabled = !isEmailValid(emailInput.value);
    }

    emailInput.addEventListener('input', () => {
      quizState.email = emailInput.value;
      if (emailError.textContent) emailError.textContent = '';
      validateAll();
    });
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !isEmailValid(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address.';
      }
    });
    honeypotInput.addEventListener('input', () => { quizState.honeypot = honeypotInput.value; });
    validateAll();
    return;
  }

  const question = quizQuestions[step];
  const selectedValue = quizState.answers[question.id];
  quizCard.innerHTML = `
    <div class="quiz-progress">
      <span>Question ${step + 1} of ${quizQuestions.length}</span>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progressPct}%"></div></div>
      <span>${Math.round(progressPct)}%</span>
    </div>
    <div class="quiz-question" id="quizQuestionLabel">${question.q}</div>
    <div class="quiz-hint" id="quizQuestionHint">${question.hint}</div>
    <div class="quiz-options" id="quizOptions" role="radiogroup" aria-labelledby="quizQuestionLabel" aria-describedby="quizQuestionHint">
      ${question.options.map((opt, i) => {
        const isSelected = selectedValue === opt.v;
        const isTabStop = isSelected || (selectedValue === undefined && i === 0);
        return `
        <button type="button" class="quiz-option ${isSelected ? 'selected' : ''}" data-value="${opt.v}" data-index="${i}" role="radio" aria-checked="${isSelected}" tabindex="${isTabStop ? '0' : '-1'}">
          <span class="quiz-option-dot" aria-hidden="true"></span>
          <span>${opt.label}</span>
        </button>`;
      }).join('')}
    </div>
    <div class="quiz-controls">
      <button class="quiz-back" type="button" onclick="quizBack()" ${step === 0 ? 'disabled' : ''}>&larr; Back</button>
      <button class="quiz-next" id="quizNext" type="button" onclick="quizNext()" ${selectedValue === undefined ? 'disabled' : ''}>
        ${step === quizQuestions.length - 1 ? 'Continue' : 'Next'}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>`;

  const optionEls = Array.from(document.querySelectorAll('#quizOptions .quiz-option'));

  function selectOption(el) {
    optionEls.forEach(o => {
      o.classList.remove('selected');
      o.setAttribute('aria-checked', 'false');
      o.setAttribute('tabindex', '-1');
    });
    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');
    el.setAttribute('tabindex', '0');
    quizState.answers[question.id] = parseInt(el.dataset.value, 10);
    document.getElementById('quizNext').disabled = false;
  }

  optionEls.forEach((el) => {
    el.addEventListener('click', () => selectOption(el));
    el.addEventListener('keydown', (e) => {
      const idx = parseInt(el.dataset.index, 10);
      let nextIdx = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextIdx = (idx + 1) % optionEls.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIdx = (idx - 1 + optionEls.length) % optionEls.length;
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectOption(el);
      }
      if (nextIdx !== null) {
        const target = optionEls[nextIdx];
        selectOption(target);
        target.focus();
      }
    });
  });
}

function quizNext() { if (quizState.current < quizQuestions.length) { quizState.current++; renderQuiz(); } }
function quizBack() { if (quizState.current > 0) { quizState.current--; renderQuiz(); } }

function quizSubmit() {
  // Render result immediately — never block parent on network
  quizState.done = true;
  renderResult();

  // Honeypot: bot detected, log + drop silently
  if (quizState.honeypot && quizState.honeypot.trim().length > 0) {
    console.warn('Quiz: honeypot triggered, dropping submission');
    return;
  }

  // Time-trap: implausibly fast completion (< 3s) is almost certainly a bot
  const elapsedMs = Date.now() - quizState.startedAt;
  if (elapsedMs < 3000) {
    console.warn('Quiz: submission too fast (' + elapsedMs + 'ms), dropping');
    return;
  }

  const payload = {
    email: quizState.email,
    quiz_score_speech: quizState.answers.speech,
    quiz_score_social: quizState.answers.social,
    quiz_score_sensory: quizState.answers.sensory,
    quiz_score_motor: quizState.answers.motor,
    quiz_score_behavior: quizState.answers.behavior,
    lead_source: 'discovery_quiz',
    lead_captured_at: new Date().toISOString(),
  };

  // Fire-and-forget POST. Marketing page never surfaces a network error.
  fetch(GHL_QUIZ_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error('GHL webhook submission failed:', err);
  });
}

function renderResult() {
  const labelMap = { speech: 'Speech & language', social: 'Social engagement', sensory: 'Sensory regulation', motor: 'Motor & coordination', behavior: 'Emotional regulation' };
  const scored = Object.entries(quizState.answers)
    .map(([k, v]) => ({ key: k, label: labelMap[k], score: v }))
    .sort((a, b) => b.score - a.score);
  const topAreas = scored.filter(s => s.score >= 2).slice(0, 3);
  const greeting = 'Based on your answers';

  let body;
  if (topAreas.length === 0) {
    body = `${greeting}, your child is in a relatively well-regulated range across these five areas. If you're noticing specific concerns we haven't covered, the best next step is a quick conversation with our team.`;
  } else {
    body = `${greeting}, the areas where your child may benefit most are below. NeuroHome's protocol works on these together &mdash; building the underlying neurology from the brainstem up, not just managing symptoms.`;
  }

  quizCard.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-icon">&#129504;</div>
      <div class="quiz-result-title">Your child's profile</div>
      <div class="quiz-result-body">${body}</div>
      ${topAreas.length > 0 ? `<div class="quiz-result-areas">${topAreas.map(a => `<span class="quiz-result-pill">${a.label}</span>`).join('')}</div>` : ''}
      <a class="btn-primary" href="#book" style="margin-top:8px;">Book your free Discovery call <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      <div class="quiz-disclaimer">This is an informational summary, not a clinical diagnosis. A licensed clinician will review your child's full profile during the Discovery call.</div>
    </div>`;
}

if (quizCard) renderQuiz();

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
