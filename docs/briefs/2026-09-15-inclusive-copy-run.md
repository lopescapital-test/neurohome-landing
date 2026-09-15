# Inclusive-copy run — homepage repositioning

**Started:** 2026-09-15T02:59:28Z
**Finished:** (see run footer)
**Branch:** `feat/inclusive-copy`
**`git log -1 --oneline` at start:** `f5fbaef Replace hello@mail.neurohome.app with hello@neurohome.app across public pages`
**Preflight:** tree clean, on `main`, `git status --porcelain` returned 0 lines. Branch created with the single authorised command.

---

## 0 — Read this first

Three things change what you do with this run:

1. **Edit 06 (the diagram) was skipped** under rule 3.3. It is a hand-coordinated inline SVG, not a restyle. Details in the ledger and in "Judgement calls".
2. **Six edits introduce em-dashes into rendered copy.** There are currently **zero** em-dashes in any parent-facing copy anywhere on the site, which conflicts with a standing site-wide no-em-dash rule. The brief explicitly says not to "fix" them, so I did not. This is a merge decision, not a copy decision. See "Blocked for merge".
3. **Edit 19's premise is factually wrong, and the downstream pass is unnecessary. Do not scope it.** `start.html` and `intake.html` contain **zero** autism references, and the intake instrument already covers PANS/PANDAS, ADHD and tics. See recon 3.7 and the "Edit 19 is closed" note below it.

**Update, second run (2026-09-15T03:2x):** items 1, 2 and 3 of the follow-up brief are done. The ATEC label is gone from the SVG, the eleven em-dashes are normalised to the page's existing conventions, and the `DIAGNOSIS` node now reads `ANY DIAGNOSIS`. **Gate 7.3 now passes.** See "Second run" at the end of this file.

---

## Recon findings

### 3.2 — Diagnosis-language inventory

`git --no-pager grep -n -i "autism"` — 15 hits, 14 in `index.html`, 1 in `terms.html`.

| File:line | Text (truncated) | Category | Covered by |
|---|---|---|---|
| index.html:9 | `<title>NeuroHome: In-Home Therapy for Children with Autism</title>` | Metadata | Edit 17 |
| index.html:10 | `meta name="description"` … children with autism and developmental challenges | Metadata | Edit 18 |
| index.html:26 | `og:title` … Children with Autism | Metadata | Edit 17 |
| index.html:27 | `og:description` … children with autism | Metadata | Edit 18 |
| index.html:32 | `twitter:title` … Children with Autism | Metadata | Edit 17 |
| index.html:33 | `twitter:description` … children with autism | Metadata | Edit 18 |
| index.html:40 | JSON-LD `"description"` … children with autism | Metadata | **NOT ENUMERATED** |
| index.html:119 | `<em>Autism-focused.</em>` | Hero | Edit 01 |
| index.html:120 | hero-sub … children with autism and developmental challenges | Hero | Edit 02 |
| index.html:158 | `Autism shows up differently in every child.` | Body | Edit 04 |
| index.html:186 | `We don't treat autism as a set of behaviors…` | Body | Edit 05 |
| index.html:201 | kyle-bio … navigating autism, developmental delays | Bio | Edit 15 |
| index.html:490 | testimonial `<small>` … Most came for autism | Disclaimer | Edit 08 |
| index.html:800 | FAQ … Autism Treatment Evaluation Checklist (ATEC) | Body | Edit 16 |
| terms.html:92 | … validated assessments such as the Autism Treatment Evaluation Checklist (ATEC) | Legal | **NOT ENUMERATED** |

`git --no-pager grep -n -i "\bASD\b"` — 1 hit, `images/treatment-toddler.jpg` (binary, false positive on byte content). **No ASD text anywhere.**

`git --no-pager grep -n -i "ATEC\|Autism Treatment Evaluation"` — 6 hits:

| File:line | What | Covered by |
|---|---|---|
| index.html:314 | inline SVG: `ATEC &#183; MEASUREMENT SCHEDULE` label + `aria-label="ATEC measured across four domains…"` | **NOT ENUMERATED** |
| index.html:319 | `.mth-p` prose: `The ATEC is scored at baseline…` | Edit 07 |
| index.html:800 | FAQ answer | Edit 16 |
| privacy.html:101 | `…intake forms, clinician notes, ATEC scores…` | **NOT ENUMERATED** |
| terms.html:92 | `…such as the Autism Treatment Evaluation Checklist (ATEC).` | **NOT ENUMERATED** |
| start.html:469 | `(function populateCountries()` — substring `ateC` false positive | n/a |

### 3.3 — The DIAGNOSIS diagram (edit 06)

- **What it is:** inline SVG, `index.html:261`, single line, `viewBox="0 0 560 360"`.
- **Where it lives:** inline in `index.html`, inside `<div class="mth-fig">` in `<div class="mth-step" data-step="1">`. Not a separate asset.
- **What styles the DIAGNOSIS node:** nothing in `neurohome.css`. It is `<rect x="30" y="26" width="500" height="56" rx="12" fill="#1D2939">` plus `<text x="280" y="60" text-anchor="middle" …>DIAGNOSIS</text>`. Every value is a hardcoded coordinate or inline presentation attribute. **There are no classes on any element inside the SVG.**
- **Six-domain row:** yes, same `<svg>`, same viewBox. Occupies y=126 (`WHAT WE TEST UNDERNEATH`) through y=343, comprising 6 `<text>` labels, 6 background `<rect>` bars and 6 tick `<rect>`s, all absolutely positioned.
- **Caption "One door.":** **does not exist.** `grep -n -i "One door"` returns zero hits repo-wide. The brief's conditional ("If there is a caption reading…") resolves to no.
- **Container CSS:** `.mth-fig { width: 600px; max-width: 100%; … }` and `.mth-fig svg { display: block; width: 100%; height: auto; }` (neurohome.css:796-797). The SVG scales to container width; rendered height follows the viewBox aspect ratio.
- **Mobile:** it would not clip or overflow — `height: auto` means it just gets taller. The risk is proportion, not breakage.

**Decision: SKIP, under rule 3.3 row 4 (and the brief's own "more than reusing styles that already exist" test).**

Reasoning, stated plainly so it can be overruled: this is not a restyle. Twelve stacked labels need roughly 240px where one 56px node sits. The existing six-domain block already consumes y=126–343 of a 360-unit viewBox, so there is no free vertical space. Executing edit 06 means:

1. changing `viewBox` height from 360 to ~560 (which changes the figure's rendered height and its visual balance against `.mth-copy` in a `align-items: center` two-column grid, at all three breakpoints);
2. authoring 12 new `<text>` nodes with 12 computed y values;
3. recomputing y for the dashed divider (`y1/y2=102`);
4. recomputing y for the `WHAT WE TEST UNDERNEATH` label;
5. recomputing y for 18 elements across the six domain rows (6 labels, 6 bars, 6 ticks), each carrying 1–2 absolute coordinates.

That is roughly 35 coordinate recomputations and a new diagram layout, unverifiable without rendering. Rule 3.3's first row requires "restylable with classes already in `neurohome.css` or inline styles"; there are no classes and this is geometry, not style. Row 4 ("anything you cannot classify confidently") applies.

**No CSS change was required, so no cache-bust bump was made and `check-constants.js` stays at 8/8.**

What it would take: a designer or a daytime run re-authoring the SVG with the 12-item stack, most cleanly by converting the figure to a flow layout (foreignObject or plain HTML + flexbox) rather than continuing to hand-place coordinates. Content for the stack is specified verbatim in the brief at edit 06. Note also that no "One door." caption exists to become "Many doors. The same room." — that line would have to be **added**, which is a new element, not an edit.

### 3.4 — Metadata surfaces

**The brief says "three places, same string" for the description. Both halves are wrong.** There are **four** description surfaces, carrying **three different strings**:

| Line | Surface | Current string |
|---|---|---|
| 10 | `meta name="description"` | An 8-week in-home program for children with autism and developmental challenges. Clinician-guided, drug-free, and lab-informed. Led by Dr. Kyle Daigle. |
| 27 | `og:description` | An 8-week, clinician-guided in-home program for children with autism and developmental challenges. Drug-free, lab-informed, delivered to your home. Led by Dr. Kyle Daigle. |
| 33 | `twitter:description` | An 8-week, clinician-guided in-home program for children with autism and developmental challenges. Drug-free, lab-informed, delivered to your home. |
| 40 | JSON-LD `"description"` | An 8-week, clinician-guided in-home program for children with autism and developmental challenges. |

Title surfaces, all three identical, all covered by edit 17: line 9 `<title>`, line 26 `og:title`, line 32 `twitter:title`.

JSON-LD block (lines 35–56) is `@type: MedicalBusiness` and also carries `"name": "NeuroHome"` and `"medicalSpecialty": "Neurologic"`. Neither contains diagnosis language. Only its `"description"` does, and **edit 18 names only three surfaces**, so line 40 is reported, not edited. See "Unenumerated findings".

All four surfaces are in `index.html` only. No other page carries an autism description.

### 3.5 — The symptom card grid

- Container: `<div class="conditions-grid">`, `index.html:159`.
- Column rule: `neurohome.css:701` `grid-template-columns: repeat(3, 1fr); gap: 16px;`
- Breakpoints: **3-up** above 900px → **2-up** at `max-width: 900px` (css:1213) → **1-up** at `max-width: 600px` (css:1234).
- Template card, verbatim (`index.html:160-163`):

```html
      <article class="condition-card reveal">
        <h3 class="condition-card-title">Speech Delays</h3>
        <p class="condition-card-desc">Targeted protocols help children find their voice, building the neural foundation for expressive language.</p>
      </article>
```

- Existing stagger pattern across the six cards: `reveal`, `reveal reveal-d1`, `reveal reveal-d2`, `reveal`, `reveal reveal-d1`, `reveal reveal-d2` — a repeating 3-cycle matching the 3-up grid.

**Does the brief's reasoning hold? Partially — and not at the widest breakpoint.**

| Cards | 3-up (>900px) | 2-up (601–900px) | 1-up (≤600px) |
|---|---|---|---|
| 6 (current) | 3+3, even | 2+2+2, even | even |
| 7 | 3+3+**1 orphan** | 2+2+2+**1 orphan** | even |
| 8 (after edits 09+10) | 3+3+**2, one empty cell** | 2+2+2+2, even | even |
| 9 | 3+3+3, even | 2+2+2+2+**1 orphan** | even |

So edit 10 fixes the orphan at 2-up and 1-up, but at the widest breakpoint eight cards still leave a half-empty final row (two cards in a three-column row). It is better than seven, not "even". Nine would be even at 3-up but reintroduces an orphan at 2-up. There is no card count that is even at both. Both edits made as specified; flagging the 3-up result for visual judgement.

### 3.6 — The FAQ accordion

- Container `<div class="faq-list">`, `index.html:771`. Five items, lines 772–801.
- Item markup, verbatim (`index.html:772-777`):

```html
    <div class="faq-item reveal">
      <button class="faq-q" type="button" aria-expanded="false" onclick="toggleFaq(this)">Do I need any technical setup at home?
        <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="faq-a"><p>Just a stable internet connection and a quiet space. We ship the device kit pre-configured with instructions, and our team walks you through setup on Day 1. Most families are running their first session within 15 minutes.</p></div>
    </div>
```

- **IDs or indices used anywhere?** No. `toggleFaq(el)` (`neurohome.js:45-57`) resolves the item via `el.parentElement` and clears state with `document.querySelectorAll('.faq-item')`. No `id`, no `nth-child`, no anchor target, no analytics hook, no index arithmetic anywhere in `neurohome.css` or `neurohome.js`.
- **Does inserting at position 1 renumber anything that matters?** No. Only the `reveal-dN` stagger classes are positional, and those are cosmetic animation delays.
- **One risk worth a visual check:** `neurohome.css:1133` caps an open answer at `max-height: 260px`. Edit 11's answer is ~305 characters, the longest single-paragraph answer on the page. At 14.5px/1.7 line-height it should land near 200–220px at mobile width, inside the cap, but it is the closest any answer comes to it. Verified visually at gate 7.4.

### 3.7 — Downstream surfaces (edit 19) — recon only, no edits made

**The brief's premise is false. `start.html` and `intake.html` contain zero autism-specific strings.**

`grep -n -i "autism\|spectrum\|\bASD\b" start.html intake.html` → **zero hits.**

- `start.html`: the only diagnosis-adjacent string is the standard disclaimer at line 376 ("NeuroHome does not provide medical diagnosis or treatment of disease…"), which is diagnosis-agnostic already. Its form collects `child_first_name`, `child_age`, `country` and consents. Nothing names a condition.
- `intake.html`: `<title>NeuroHome Child Assessment</title>`. Onboarding headings are "Let's start with *the basics.*", "What matters most *to you?*", "What are you *hoping for?*", "Now help us understand *the full picture.*" — all condition-neutral.
- The intake instrument is **already** multi-presentation: 18 PANS/PANDAS references, a phenotype `P11 pans_pandas_immune_regression`, `P10 "Staring, Tics & Seizure Signs"`, and a chief-complaint key `{ key: "adhd", label: "Attention / ADHD is the main concern" }` at line 1768.

This supports the brief's own section-1 premise more strongly than the brief realises: the funnel below the homepage was never autism-specific. **The autism framing is confined to `index.html` plus one legal sentence in `terms.html`.**

### Edit 19 is closed. Do not scope a downstream pass.

Recorded explicitly so nobody re-opens this from the original brief's wording.

The original brief asserted that `start.html` and `intake.html` "carry the same framing" and warned that "a PANS/PANDAS parent who converts on a repositioned homepage will hit an autism questionnaire two clicks later". **That is not true of this repo.** Verified twice, at HEAD and again after the second run:

```
$ grep -n -i "autism\|spectrum\|\bASD\b" start.html intake.html
(zero hits)
```

- `start.html` names no condition anywhere. Its only diagnosis-adjacent sentence is the standard disclaimer at line 376, which is already condition-neutral.
- `intake.html` is titled "NeuroHome Child Assessment"; its four onboarding headings are condition-neutral; and the instrument itself **already covers the widened scope**: 18 PANS/PANDAS references, a `P11 pans_pandas_immune_regression` phenotype, a `P10 "Staring, Tics & Seizure Signs"` phenotype, and an `{ key: "adhd", label: "Attention / ADHD is the main concern" }` chief-complaint option at line 1768. The Cora H. intake that prompted this whole repositioning was itself routed on a compulsive/immune presentation through that existing engine.

**There is no downstream copy gap and no downstream pass to schedule.** The funnel below the homepage was built diagnosis-agnostic from the start; only the homepage was not. The two follow-ups that do remain are the legal documents (`terms.html:92`, `privacy.html:101`), and both are gated on the instrument decision, not on this repositioning. They are listed under "Unenumerated findings", not under edit 19.

---

## Edit ledger

| # | Edit | Status | File:line | Notes |
|---|---|---|---|---|
| 01 | Hero headline, third line | done | index.html:119 | Now wraps to 2 visual lines; see gate 7.4 |
| 02 | Hero subhead, bolded span | done | index.html:120 | No `<strong>` existed; see judgement calls |
| 03 | Hero credit line insertion | done | index.html:126 | Used `&middot;` to match existing separator |
| 04 | "What we address" first sentence | done | index.html:158 | |
| 05 | Closing line, one noun | done | index.html:194 | |
| 06 | DIAGNOSIS diagram | **skipped** | index.html:261 | Rule 3.3 row 4 — hand-coordinated inline SVG, ~35 coordinate recomputations + viewBox change. No CSS change made, no cache-bust bump. Full reasoning in recon 3.3. |
| 07 | Step 04 Measure, removes ATEC | done | index.html:328 | Blocked for merge. Adjacent `.mth-punch` "You see what moved" retained. SVG ATEC label above it NOT edited (unenumerated) |
| 08 | Testimonial disclaimer | done | index.html:499 | Blocked for merge. Brief's "current" text was incomplete; see judgement calls |
| 09 | Seventh symptom card | done | index.html:184-187 | |
| 10 | Eighth symptom card | done | index.html:188-191 | Grid still 3+3+2 at >900px; see recon 3.5 and gate 7.4 |
| 11 | New FAQ, placed first | done | index.html:781-786 | |
| 12 | New FAQ | done | index.html:787-792 | |
| 13 | Step 01, sentence added | done | index.html:276 | Blocked for merge — Kyle + counsel |
| 14 | Step 04 Start when ready | done | index.html:527 | |
| 15 | Dr. Kyle bio, two words | done | index.html:209 | Blocked for merge — Kyle |
| 16 | FAQ track progress, removes ATEC | done | index.html:821 | Blocked for merge. Ships with 07 |
| 17 | Title + og:title + twitter:title | done | index.html:9,26,32 | `&` written as `&amp;`; see judgement calls |
| 18 | Meta description, 3 surfaces | done | index.html:10,27,33 | JSON-LD line 40 is a 4th surface, NOT edited — see unenumerated findings |
| 19 | start.html / intake.html | **closed, no work needed** | — | Recon only, as instructed. Premise false: zero autism strings in either file and the instrument already covers PANS/PANDAS, ADHD and tics. **Do not scope a downstream pass.** See "Edit 19 is closed" in recon 3.7 |

**Done: 17 of 19.** One skipped (06), one recon-only by design (19).

---

## Before and after

**01 — index.html:119**
- before: `Clinician-designed.<br>Home-delivered.<br><em>Autism-focused.</em>`
- after: `Clinician-designed.<br>Home-delivered.<br><em>Built for the nervous system underneath.</em>`

**02 — index.html:120**
- before: `An 8-week, clinician-guided home program for children with autism and developmental challenges. NeuroHome looks beneath the diagnosis and combines…`
- after: `An 8-week, clinician-guided home program for neurodivergent children — autism, PANS/PANDAS, ADHD and related presentations. NeuroHome looks beneath the diagnosis and combines…`

**03 — index.html:126**
- before: `<strong>Led by Dr. Kyle Daigle, DC, FIBFN-CND</strong>. Lake Charles, Louisiana &middot; Families from 63 countries`
- after: `<strong>Led by Dr. Kyle Daigle, DC, FIBFN-CND</strong>. Lake Charles, Louisiana &middot; Families from 63 countries &middot; Autism &middot; PANS/PANDAS &middot; ADHD &middot; Developmental delay`

**04 — index.html:158**
- before: `Autism shows up differently in every child. NeuroHome looks beneath the diagnosis at the neurology driving these patterns, not just the surface behavior.`
- after: `Every child arrives with a different label, or none at all. NeuroHome looks beneath the diagnosis at the neurology driving these patterns, not just the surface behavior.`

**05 — index.html:194**
- before: `We don't treat autism as a set of behaviors to be managed.`
- after: `We don't treat a diagnosis as a set of behaviors to be managed.`

**07 — index.html:328**
- before: `The ATEC is scored at baseline, week 4 and week 8 across the same four domains, so you and your clinician are reading the same picture at the same time.`
- after: `Your child is scored at baseline, week 4 and week 8 across the same domains throughout, using the standardized measure matched to their presentation, so you and your clinician are reading the same picture at the same time.`

**08 — index.html:499**
- before: `Stories shared with written family consent. Most came for autism; others for seizures, developmental delay, or related concerns. Individual experiences vary; testimonials are not predictive of any specific outcome.`
- after: `Stories shared with written family consent. Families come to us with a range of presentations. Individual experiences vary; testimonials are not predictive of any specific outcome.`

**09 — index.html:184-187** (new)
```html
      <article class="condition-card reveal">
        <h3 class="condition-card-title">Sudden Onset &amp; Regression</h3>
        <p class="condition-card-desc">Abrupt change after an illness — new tics, OCD, rage, or refusal to eat. Often the picture families bring us with PANS or PANDAS.</p>
      </article>
```

**10 — index.html:188-191** (new)
```html
      <article class="condition-card reveal reveal-d1">
        <h3 class="condition-card-title">Attention &amp; Focus</h3>
        <p class="condition-card-desc">Restlessness, impulsivity, and the inability to settle to a task, worked at the level of arousal and regulation.</p>
      </article>
```

**11 — index.html:781-786** (new, first in `.faq-list`)
- Q: `Which children is this for?`
- A: `Children with autism, PANS/PANDAS, ADHD, developmental or speech delay, sensory processing difficulties, tics, anxiety and OCD, motor delay, seizures, learning differences — and children with no diagnosis yet whose parents know something is off. We'll tell you honestly at intake if we're not the right fit.`

**12 — index.html:787-792** (new, second)
- Q: `My child is already under a physician's care.`
- A: `Good. NeuroHome runs alongside your existing medical care, not instead of it. We don't diagnose or treat disease and we don't ask you to stop anything — our work supports nervous-system regulation and functional development.`

**13 — index.html:276** (new line, after the existing `.mth-punch`)
- added: `<p class="mth-p">In many children carrying a developmental diagnosis, we find an immune or post-infectious picture underneath that no one has tested for.</p>`

**14 — index.html:527**
- before: `Enroll directly from your plan, or talk it through with a specialist first.`
- after: `Enroll directly from your plan, or talk it through with a specialist first. If your child is in an acute flare, tell us — we'll move faster.`

**15 — index.html:209**
- before: `…families navigating autism, developmental delays, and complex neurological conditions…`
- after: `…families navigating autism, PANS/PANDAS, developmental delays, and complex neurological conditions…`

**16 — index.html:821**
- before: `We use the Autism Treatment Evaluation Checklist (ATEC) at baseline, mid-program (Week 4), and final (Week 8). It measures speech, sociability, sensory/cognitive awareness, and health/behavior, giving you and your clinician objective data on what's changing.`
- after: `We score your child at baseline, mid-program (Week 4) and final (Week 8) using the standardized measure matched to their presentation. It tracks speech, sociability, sensory and cognitive awareness, and health and behavior, giving you and your clinician objective data on what's changing.`

**17 — index.html:9, 26, 32** (all three identical, before and after)
- before: `NeuroHome: In-Home Therapy for Children with Autism`
- after: `NeuroHome: In-Home Neurodevelopmental Care — Autism, PANS/PANDAS, ADHD &amp; More`

**18 — index.html:10, 27, 33** (three different before-strings, one shared after-string)
- before (10): `An 8-week in-home program for children with autism and developmental challenges. Clinician-guided, drug-free, and lab-informed. Led by Dr. Kyle Daigle.`
- before (27): `An 8-week, clinician-guided in-home program for children with autism and developmental challenges. Drug-free, lab-informed, delivered to your home. Led by Dr. Kyle Daigle.`
- before (33): `An 8-week, clinician-guided in-home program for children with autism and developmental challenges. Drug-free, lab-informed, delivered to your home.`
- after (all three): `An 8-week in-home program for neurodivergent children — autism, PANS/PANDAS, ADHD, developmental delay. Clinician-guided, drug-free, and lab-informed. Led by Dr. Kyle Daigle.`

---

## Gate output

### 7.1 — Constant consistency — **PASS 8/8**

```
$ node scripts/check-constants.js
ok    form version agrees in all 3 places  (v1.7.0)
ok    engine version agrees in both places  (v1.3.2)
ok    draft schema version mirrored  (2)
ok    draft TTL mirrored  (3 days)
ok    neurohome.css cache-bust agrees on all 7 pages  (v=95)
ok    neurohome.js cache-bust agrees on all 7 pages  (v=20)
ok    every selectable country has a dial code  (197 countries)
ok    the dial-code affix is presentational  (span, aria-hidden, no name)

8 checks passed.
exit=0
```

No cache-bust bump was needed, because edit 06 was skipped and no CSS or JS file was touched. Baseline before any edit was also 8/8, so this gate proves the edits changed nothing it watches. (Note: this gate cannot fail from copy edits alone — it watches versions, cache-busts and the country list. Treat its pass as "nothing structural broke", not as proof the copy is right.)

### 7.2 — Residual diagnosis language — **PASS with two known survivors, one of which is a decision for you**

```
$ git --no-pager grep -n -i "autism" -- "*.html"
index.html:9:<title>NeuroHome: In-Home Neurodevelopmental Care — Autism, PANS/PANDAS, ADHD &amp; More</title>
index.html:10:<meta name="description" content="An 8-week in-home program for neurodivergent children — autism, PANS/PANDAS, ADHD, developmental delay. …">
index.html:26:<meta property="og:title" content="NeuroHome: In-Home Neurodevelopmental Care — Autism, PANS/PANDAS, ADHD &amp; More">
index.html:27:<meta property="og:description" content="An 8-week in-home program for neurodivergent children — autism, PANS/PANDAS, ADHD, developmental delay. …">
index.html:32:<meta name="twitter:title" content="NeuroHome: In-Home Neurodevelopmental Care — Autism, PANS/PANDAS, ADHD &amp; More">
index.html:33:<meta name="twitter:description" content="An 8-week in-home program for neurodivergent children — autism, PANS/PANDAS, ADHD, developmental delay. …">
index.html:40:  "description": "An 8-week, clinician-guided in-home program for children with autism and developmental challenges.",
index.html:120:        <p class="hero-sub reveal reveal-d2">An 8-week, clinician-guided home program for neurodivergent children — autism, PANS/PANDAS, ADHD and related presentations. …
index.html:126:          <strong>Led by Dr. Kyle Daigle, DC, FIBFN-CND</strong>. Lake Charles, Louisiana &middot; Families from 63 countries &middot; Autism &middot; PANS/PANDAS &middot; ADHD &middot; Developmental delay
index.html:209:        <p class="kyle-bio">For over a decade he has worked with families navigating autism, PANS/PANDAS, developmental delays, and complex neurological conditions…
index.html:785:      <div class="faq-a"><p>Children with autism, PANS/PANDAS, ADHD, developmental or speech delay, sensory processing difficulties, tics, anxiety and OCD, motor delay, seizures, learning differences…
terms.html:92:  <p>NeuroHome is a <strong>functional-neurology and developmental support program</strong>… such as the Autism Treatment Evaluation Checklist (ATEC).</p>
```

Against the brief's expected-survivor list:

| Line | Expected? | Verdict |
|---|---|---|
| 9, 26, 32 | yes — edit 17, deliberate | ok |
| 10, 27, 33 | yes — edit 18, deliberate | ok |
| 126 | yes — edit 03 credit line | ok |
| 209 | yes — edit 15 Kyle bio | ok |
| 785 | yes — edit 11 FAQ condition list | ok |
| 120 | **not on the brief's list**, but edit 02's own approved replacement text contains the word "autism". Deliberate by the patch sheet, just not anticipated by the gate. | ok |
| **40** | **NO — this is the miss.** JSON-LD `"description"`, still the original autism-only string. Not enumerated by edit 18, so not edited per rule 3.2. **Your call.** | **decide** |
| terms.html:92 | out of scope (legal document) | report only |

The brief's expected list also named "the diagram label (edit 06)" — not applicable, the diagram says `DIAGNOSIS`, not `AUTISM`, and edit 06 was skipped anyway.

### 7.3 — ATEC removal — **FAILED against the stated expectation**

The brief expects zero ATEC hits in `index.html`. There is one, and I left it deliberately.

```
$ git --no-pager grep -n -i "ATEC\|Autism Treatment Evaluation"
index.html:323:  <svg viewBox="0 0 560 360" role="img" aria-label="ATEC measured across four domains at baseline, week four and week eight"><text …>ATEC &#183; MEASUREMENT SCHEDULE</text>…
privacy.html:101:  <p>Once you enroll… (including intake forms, clinician notes, ATEC scores, and session activity)…
start.html:469:(function populateCountries() {          ← false positive: substring "ateC" in "populateCountries"
terms.html:92:  <p>… validated assessments such as the Autism Treatment Evaluation Checklist (ATEC).</p>
```

`index.html:319` (the prose, edit 07) and `index.html:800` (the FAQ, edit 16) are both gone. What survives at `index.html:323` is the **SVG immediately above the edit-07 prose**: its visible label reads `ATEC · MEASUREMENT SCHEDULE` and its `aria-label` reads `ATEC measured across four domains…`.

This is not enumerated by any edit in section 5, and rule 3.2 says report, do not edit. **But it is the most consequential thing in this report after the diagram**, because as the branch currently stands, Step 04 renders a graphic captioned "ATEC · MEASUREMENT SCHEDULE" directly above prose that has been rewritten specifically to stop naming the ATEC. A reader sees the instrument named in the picture and unnamed in the text. Edits 07 and 16 do not actually remove the ATEC from the page; they remove it from two of three places.

There is a second-order problem: edit 07's replacement says "across the same domains throughout", dropping "four", while the SVG still shows exactly four labelled rows (SPEECH / LANGUAGE, SOCIABILITY, SENSORY / COGNITIVE, HEALTH / BEHAVIOR) and is captioned "TWELVE DATA POINTS, NOT A FEELING" (4 domains × 3 timepoints). If the instrument becomes presentation-matched, the number of domains is no longer fixed at four and that caption's arithmetic stops holding.

Recommendation: fold the SVG into the same instrument decision that gates edits 07 and 16, and treat all three as one unit. Do not merge 07 and 16 without it.

### 7.4 — Visual — **PASS, with two cosmetic notes**

Served from `node .claude/static-server.js` on `localhost:4321` (the `file://` render cannot load the stylesheet). Checked at **1280×900** and **375×812**.

- **Hero third line.** Renders correctly in both, italic/gradient treatment intact across the wrap. **It now occupies two visual lines at both widths**, so the headline reads as four lines rather than three: `Clinician-designed.` / `Home-delivered.` / `Built for the nervous` / `system underneath.` Not broken, not ugly, but the three-beat rhythm the brief wanted to preserve is visually a four-beat now. Cosmetic, yours to accept or shorten.
- **Credit line, three items → four segments.** Renders, no overflow. Wraps to 2 lines at 1280 (breaking mid-phrase at "Families from 63 / countries") and 3 lines at 375 (breaking at "Developmental / delay"). It is now a run of six `&middot;`-separated fragments and reads dense. Legible, but this is the edit most likely to want a second look.
- **Symptom grid, eight cards.** Confirmed `grid-template-columns: 376.75px 376.76px 376.76px` with 8 children at 1280 → **3 + 3 + 2, one empty cell bottom-right**. At 375 → single column, `335.333px`, all 8 stacked cleanly. Both new cards render with correct titles and copy. See recon 3.5: eight is even at 2-up and 1-up but not at 3-up.
- **FAQ accordion.** 7 items, the two new ones first and in the right order. Open/close verified by clicking. Measured every answer's natural height against the `max-height: 260px` cap at 375px, the binding width: longest is item 4 (pricing, pre-existing) at 222px; the new item 1 is 173px; **nothing clips**.
- **No horizontal overflow** at 375px (`document.scrollWidth === innerWidth === 375`).
- **Diagram:** not attempted, see edit 06.

### 7.5 — File count — **PASS**

```
$ git status --short
 M index.html
?? docs/briefs/2026-09-15-inclusive-copy-run.md

$ git --no-pager diff --stat
 index.html | 53 +++++++++++++++++++++++++++++++++++++----------------
 1 file changed, 37 insertions(+), 16 deletions(-)
```

One modified file, `index.html`, as expected. The untracked file is this report, which the brief asked for; `docs/` is `.vercelignore`d so it never ships.

`37 insertions / 16 deletions` is exactly what the 17 edits should produce: 16 in-place line replacements, plus 8 new card lines, 12 new FAQ lines, and 1 new sentence line (16 + 21 = 37). Net +21 lines, and the file went 889 → 910 lines, which reconciles. No stray hunks.

**Line endings checked and clean:** `index.html` is 910/910 CRLF, matching the repo (HEAD blob is 889/889 CRLF). The `LF will be replaced by CRLF` warning git prints is a pre-existing repo condition (`core.autocrlf=true`, no `.gitattributes`, blobs stored CRLF), not something this run introduced.

**One local-only file was created that does not appear in `git status`:** `.claude/launch.json`, a four-line dev-server config needed to render the page for gate 7.4. `.claude/` is in both `.gitignore` and `.vercelignore`, so it is invisible to git and never deploys. Delete it if you don't want it; nothing depends on it.

---

## Blocked for merge

| # | What | Who signs off | Why |
|---|---|---|---|
| 13 | "In many children carrying a developmental diagnosis, we find an immune or post-infectious picture underneath that no one has tested for." | **Dr. Kyle + counsel** | Asserts a clinical claim about prevalence and aetiology, not a description of a service. The strongest repositioning sentence on the page and the one with the most exposure. |
| 07 | Step 04 Measure, ATEC → "the standardized measure matched to their presentation" | **Instrument decision** | Placeholder. Names no instrument. Cannot ship until you know what replaces the ATEC across presentations. |
| 16 | FAQ progress answer, same substitution | **Instrument decision** | Must ship with 07; they cannot disagree. |
| — | **`index.html:323` SVG still labelled `ATEC · MEASUREMENT SCHEDULE`** | **Instrument decision** | Not an enumerated edit, so not made. But merging 07 and 16 without it ships a page whose graphic names the instrument its prose just stopped naming. See gate 7.3. **I am adding this to the blocked list on my own judgement.** |
| 08 | Testimonial disclaimer | **Counsel** | Testimonial disclaimer language. The substantive change is dropping the "most came for autism" skew disclosure; the "individual experiences vary" sentence was already present and is retained verbatim. |
| 15 | PANS/PANDAS in Dr. Kyle's bio | **Dr. Kyle** | His own bio, his call whether he wants the condition named in it. |
| — | **Em-dashes in rendered copy** | **You** | Six edits (02, 09, 11, 12, 14, 17, 18) introduce 11 em-dashes into `index.html`, which currently has zero. See judgement calls. **Adding this on my own judgement.** |

## Unenumerated findings

Things recon surfaced that no edit in section 5 covers. None of these were edited.

1. **`index.html:40` — JSON-LD `"description"`** still reads "An 8-week, clinician-guided in-home program for children with autism and developmental challenges." This is a **fourth** description surface; edit 18 names three. Recon 3.2's category table lists JSON-LD under "edit per section 5", but section 5 does not cover it, so the two instructions disagree and I took the narrower reading. **Recommendation: update it to the edit-18 string.** It feeds rich results and is the one remaining place the site describes itself as autism-only to a machine. One-line change, no risk.
2. **`index.html:323` — SVG `ATEC · MEASUREMENT SCHEDULE` label and `aria-label`.** Covered at length in gate 7.3. **Recommendation: treat as part of the edit 07/16 instrument decision, and do not merge 07/16 without it.**
3. **`terms.html:92`** — "…progress tracking using validated assessments such as the Autism Treatment Evaluation Checklist (ATEC)." A contractual description of the service. **Recommendation: counsel reviews this at the same time as the instrument decision.** If the instrument becomes presentation-matched, this sentence becomes inaccurate as a term of service, which is a different and more serious problem than it being off-brand.
4. **`privacy.html:101`** — "…intake forms, clinician notes, ATEC scores, and session activity…" as an example of PHI. **Recommendation: low priority, but it dates with the instrument.** Generic wording ("assessment scores") would survive the change.
5. **`images/treatment-toddler.jpg`** matched `\bASD\b` — binary false positive on byte content, not text. No action.
6. **The intake instrument already covers the widened scope.** `intake.html` carries 18 PANS/PANDAS references, a `P11 pans_pandas_immune_regression` phenotype, `P10 "Staring, Tics & Seizure Signs"`, and an `adhd` chief-complaint key. Worth knowing before anyone scopes edit 19 as a large job.

## Judgement calls

Every decision the brief did not fully determine. Nothing tidied away.

1. **Em-dashes: followed the brief, against a standing site rule.** There is a standing rule for this site that em-dashes are not used anywhere, and six of the approved replacement strings contain them. The brief pre-empts this explicitly ("do not 'fix' the em-dashes"), so I applied the copy verbatim and changed nothing. Worth knowing precisely what that means: `index.html` contained **zero** em-dashes before this run and now contains **eleven**. Across the whole site, the only pre-existing em-dashes are 19 in `start.html` and 2 in `intake.html`, and **every one of them is inside a JS or CSS comment** — there are currently no em-dashes in rendered, parent-facing copy anywhere on neurohome.app. These eleven would be the first. Flagged in "blocked for merge" as your decision, not a copy decision. Reversing it is a find-and-replace, not a rewrite.
2. **Edit 02 had no bolded span to replace.** The brief says "Replace the bolded span only". There is no `<strong>` or `<b>` in `index.html:120`; the phrase is plain text inside `<p class="hero-sub">`. I replaced the plain-text phrase "children with autism and developmental challenges" in place and preserved the rest of the sentence byte-for-byte. I did **not** add bold markup, on the reading that "bolded span" was describing the patch sheet's own rendering of what to change, not asserting page markup.
3. **Edit 08's quoted "current" text was incomplete.** The file already contained a third sentence, "Individual experiences vary; testimonials are not predictive of any specific outcome.", which the brief's "current" omits but its "replace with" includes. A literal whole-string replacement would have duplicated that sentence. I replaced only the middle sentence ("Most came for autism; …") with "Families come to us with a range of presentations.", which produces the brief's intended final string exactly and character-for-character.
4. **Edit 03: separator and position.** The existing separator is the HTML entity `&middot;`, not a literal `·`, so I used `&middot;` throughout the addition, per the brief's "match the existing separator character exactly". Note also that the line already had three segments, not the two the brief describes (it opens with `<strong>Led by Dr. Kyle Daigle, DC, FIBFN-CND</strong>.`), and the added content is itself a four-item list, so the line now carries six `&middot;`-separated fragments. Appended at the end rather than inserted mid-line.
5. **Edit 17: `&` written as `&amp;`.** The replacement text ends "ADHD & More". A bare `&` in an HTML attribute and title is tolerated but not correct, and the surrounding file consistently uses `&amp;`. `&amp;` renders as `&`, so the copy the user sees is verbatim. This is an encoding decision, not a copy change.
6. **Edit 18 applied to three surfaces, not four.** Edit 18 names `meta description`, `og:description` and `twitter:description`. Recon found a fourth (JSON-LD, line 40) and found that the three named ones held three *different* strings, not one shared string as the brief states. I replaced all three named surfaces with the single new string and left the fourth. See unenumerated finding 1.
7. **Edit 06 skipped.** Full reasoning in recon 3.3. The short version: rule 3.3's "do it" branch requires a restyle, and this is a geometry rewrite of a hand-coordinated SVG (~35 coordinate changes plus a viewBox height change), which is squarely what the "skip rather than break something at 3am" rule exists for. Also relevant: the "One door." caption the brief expects to edit does not exist, so that part of edit 06 would have been an addition, not an edit.
8. **Edit 13 placed as a new `<p class="mth-p">` after the existing `.mth-punch`.** The brief says to add the sentence "after 'Two children with the same label rarely have the same findings'". That sentence is the step's closing punch line in its own styled element. I appended a new paragraph after it using the step's body class rather than extending the punch line, so the punch keeps its typographic treatment. This means the step now ends on body copy rather than on its punch, which is a small rhythm change you may want to look at.
9. **Stagger classes for inserted elements.** New cards continue the existing 3-cycle (`reveal`, `reveal reveal-d1`). New FAQ items took `reveal` and `reveal reveal-d1`, and I did **not** renumber the five existing items, so two items now share each of the first two delay steps. Purely cosmetic animation timing; renumbering would have meant touching five elements no edit covers.
10. **Created `.claude/launch.json`.** Needed to serve the page for gate 7.4; the `file://` render loads no stylesheet. Git-ignored and vercel-ignored, invisible in `git status`. Noted in gate 7.5.
11. **Continued past the brief-vs-repo discrepancies rather than stopping.** Section 3.8 says to stop if the brief is "substantially wrong about the page". Nine discrepancies were found (items 2, 3, 4, 6, 7 above, plus: the "One door." caption does not exist; edit 19's premise is false; edit 10's "keeps the grid even" is false at the widest breakpoint; edit 05's surrounding paragraph differs from the quote). I judged these individually wrong but collectively not disqualifying: every section, element and container the brief describes does exist, and 17 of 19 edits had unambiguous targets. Continuing was a judgement, and it is the one I would most expect you to want to second-guess.
12. **The `git checkout -b` overrides a standing rule.** There is a standing instruction that I run only read-only git commands and you run every mutating one. This brief explicitly authorises exactly one branch creation, so I ran it, and nothing else. Recording it because it is a deliberate exception to a rule that otherwise still stands.

## What stays untouched

I did not modify: the nav · the three stat tiles · the world map and travel-lines graphic · the 63-countries story · Dr. Kyle's photo and credentials · the structure of all four method steps · the testimonial rail and its videos · the four-step "what happens next" (other than edit 14's added sentence in step 04's description) · the hardware kit list · the entire three-tier NeuroSage section · five of the seven FAQs · the booking embed · the footer. "Book your plan call." and "Book my call." were not touched, reworded or repunctuated; no edit in this brief came near them.

No file other than `index.html` was edited. `start.html` and `intake.html` were read only.

## Confirmation

I ran **no** `git add`, **no** `git commit`, **no** `git merge`, **no** `git push`, **no** `git stash`, and **no** `git checkout` other than the single authorised `git checkout -b feat/inclusive-copy`. No other branch was created, touched or switched to. Nothing reached `origin`. Nothing reached Vercel. `index.html` is modified and unstaged on `feat/inclusive-copy`; the working tree is otherwise as you left it.

**Finished:** 2026-09-15T03:11:08Z

---
---

# Second run — SVG labels and em-dash normalisation

**Started:** 2026-09-15T03:14Z **Finished:** 2026-09-15T03:29Z
**Branch:** `feat/inclusive-copy` (unchanged, no new branch)
**Scope:** three follow-up items, all in `index.html`. No other file edited.

Two of the three things the first run flagged as "your decision" are now resolved in the branch. The third (edit 06, the twelve-label diagram) remains skipped by design.

## What changed

| # | Item | Status | File:line |
|---|---|---|---|
| 1 | SVG label `ATEC · MEASUREMENT SCHEDULE` → `MEASUREMENT SCHEDULE` | done | index.html:323 |
| 1b | Same SVG's `aria-label`, ATEC removed | done (scope extension) | index.html:323 |
| 2 | Eleven em-dashes normalised to house convention | done, all 11 | 9, 10, 26, 27, 32, 33, 120, 187, 785, 791, 527 |
| 3 | `DIAGNOSIS` → `ANY DIAGNOSIS` | done | index.html:269 |

---

## Item 1 — the ATEC label

### Positioning, reported before editing

```html
<text x="30" y="44" fill="#545D6E" font-family="JetBrains Mono, monospace"
      font-size="9.5" letter-spacing="1.6">ATEC &#183; MEASUREMENT SCHEDULE</text>
```

**No `text-anchor` attribute**, so it takes the SVG default, `start` — left-anchored at `x="30"`. The only `text-anchor="middle"` anywhere in that SVG belongs to a `<g>` wrapping the three timepoint labels (BASELINE / WEEK 4 / WEEK 8 at x=286/392/498), and this node is not inside it.

**x=30 is the figure's established left gutter**, shared by the four domain labels (y=140, 196, 252, 308) and the footer caption (y=348). It is also the shared eyebrow slot across the whole method sequence: the step-02 figure carries an identically-attributed node, `<text x="30" y="44" … letter-spacing="1.6">ONE WEEK &#183; GUIDED LIVE</text>`.

**Therefore no coordinate change was needed and none was made.** With a start anchor, removing a prefix does not shift the string left; the string still begins at x=30 and simply ends earlier. Confirmed by measurement after the edit:

```
MEASUREMENT SCHEDULE  bbox x=30.0  width=145.9  right=175.9
SPEECH / LANGUAGE     bbox x=30.0     (domain label)
TWELVE DATA POINTS…   bbox x=30.0     (footer caption)
leftGutterShared: true      withinViewBox560: true
```

The label sits flush with the other left-anchored text in the same figure, exactly as before, 68.6 user units shorter. Visually confirmed at desktop: the figure renders `MEASUREMENT SCHEDULE` at the left edge with no gap and no shift.

### Scope extension I made on my own judgement

The visible label was not the only ATEC in that SVG. The element's `aria-label` also read `"ATEC measured across four domains at baseline, week four and week eight"`. The brief only named the visible label, but **gate 7.3's stated expectation of zero ATEC hits in `index.html` is unreachable without also changing the aria-label**, and leaving it would mean a screen-reader user hears an instrument name that sighted users no longer see. I changed it to `"Measured across four domains at baseline, week four and week eight"` — ATEC removed, nothing else touched.

### Before / after

- before (visible): `ATEC &#183; MEASUREMENT SCHEDULE`
- after (visible): `MEASUREMENT SCHEDULE`
- before (aria): `aria-label="ATEC measured across four domains at baseline, week four and week eight"`
- after (aria): `aria-label="Measured across four domains at baseline, week four and week eight"`

### Still outstanding in that figure

I removed the instrument name. I did **not** touch the rest, and two things in the figure still encode a four-domain instrument:

1. the aria-label and the four visible rows still say/show **four domains**, while edit 07's prose now says "across the same domains throughout" with the count deliberately dropped;
2. the footer caption still reads **`TWELVE DATA POINTS, NOT A FEELING`**, which is 4 domains × 3 timepoints. If the instrument becomes presentation-matched, that arithmetic stops holding.

Neither is an ATEC reference, so neither blocks gate 7.3, and both are downstream of the instrument decision that already gates edits 07 and 16. Flagged, not fixed.

---

## Item 2 — em-dash normalisation

### The convention, established from baseline copy

I analysed `index.html` **at HEAD** (rendered copy only, SVG/script/comments stripped, 113 sentences over 25 characters):

| Construction | Convention | Count | Examples |
|---|---|---|---|
| Expansion / list after a noun phrase | **colon** | 4 | "underneath them**:** the immune, gut, and neurological patterns…"; "actually under load**:** immune, inflammatory, gut, metabolic…"; "the whole sequence**:** eight weeks, in your house."; "A personalized roadmap**:** what we see, where we'd start…" |
| Two independent clauses, explanation or contrast | **semicolon** | 3 | "Individual experiences vary**;** testimonials are not predictive…"; "…functional development**;** they are not a substitute for medical care."; "Most came for autism**;** others for seizures…" |
| Parentheses | abbreviations and values only, never asides | 2 | "(ATEC)", "(Week 4)" |
| Em dash or en dash | **0 occurrences** | 0 | — |
| Segment separator in labels and titles | **`&middot;`** | many | "DC &middot; FIBFN-CND"; "Next &middot; 02"; the credit line; "ONE WEEK &#183; GUIDED LIVE" |

The page has a clear, consistently applied convention for every construction the eleven em-dashes were doing. So they are all normalised; none were left as-is.

### Before / after, all eleven

Wording is byte-identical apart from the punctuation character in every case.

**Colon (list expansion) — 5**

1. `index.html:120` hero subhead
   - before: `…home program for neurodivergent children — autism, PANS/PANDAS, ADHD and related presentations.`
   - after: `…home program for neurodivergent children: autism, PANS/PANDAS, ADHD and related presentations.`
2. `index.html:187` symptom card 7
   - before: `Abrupt change after an illness — new tics, OCD, rage, or refusal to eat.`
   - after: `Abrupt change after an illness: new tics, OCD, rage, or refusal to eat.`
3-5. `index.html:10, 27, 33` meta / og / twitter description
   - before: `…for neurodivergent children — autism, PANS/PANDAS, ADHD, developmental delay.`
   - after: `…for neurodivergent children: autism, PANS/PANDAS, ADHD, developmental delay.`

**Semicolon (two independent clauses) — 2**

6. `index.html:791` FAQ 2
   - before: `…we don't ask you to stop anything — our work supports nervous-system regulation and functional development.`
   - after: `…we don't ask you to stop anything; our work supports nervous-system regulation and functional development.`
   - This now matches the footer disclaimer's punctuation of the *same clause* verbatim: "Our protocols support nervous-system regulation and functional development; they are not a substitute for medical care."
7. `index.html:527` step 04 description
   - before: `If your child is in an acute flare, tell us — we'll move faster.`
   - after: `If your child is in an acute flare, tell us; we'll move faster.`

**Comma — 1**

8. `index.html:785` FAQ 1 condition list
   - before: `…seizures, learning differences — and children with no diagnosis yet whose parents know something is off.`
   - after: `…seizures, learning differences, and children with no diagnosis yet whose parents know something is off.`
   - See judgement call 3 below: neither colon nor semicolon fits this one.

**`&middot;` (title segment separator) — 3**

9-11. `index.html:9, 26, 32` title / og:title / twitter:title
   - before: `NeuroHome: In-Home Neurodevelopmental Care — Autism, PANS/PANDAS, ADHD &amp; More`
   - after: `NeuroHome: In-Home Neurodevelopmental Care &middot; Autism, PANS/PANDAS, ADHD &amp; More`
   - A colon was unavailable here: the title already opens with one ("NeuroHome:"), and a second would read as a nested label. `&middot;` is the site's own separator and is standard in title tags.

**Result: `index.html` contains 0 em-dashes, back to its baseline state.** Verified in source (`grep -c` → 0) and in rendered text at mobile width (`document.body.innerText` match count → 0).

---

## Item 3 — the DIAGNOSIS node

### Positioning, reported before editing

```html
<rect x="30" y="26" width="500" height="56" rx="12" fill="#1D2939"></rect>
<text x="280" y="60" text-anchor="middle" fill="#EAF0F6"
      font-family="JetBrains Mono, monospace" font-size="12"
      font-weight="600" letter-spacing="3">DIAGNOSIS</text>
```

**`text-anchor="middle"` at x=280.** The rect spans x=30 → x=530, so its centre is exactly 280. The label is anchored to the rect's centre and **recentres itself** on any string change. No coordinate change was needed and none was made.

### Overflow check — passes with wide margin

Measured `getBBox()` at both breakpoints against the 500-unit rect:

| Viewport | text x | text width | text right | rect | overflows | clearance each side |
|---|---|---|---|---|---|---|
| 1280×900 | 213.7 | 132.6 | 346.3 | 30 → 530 | **no** | 183.7 user units |
| 375×812 | 211.8 | 134.4 | 346.2 | 30 → 530 | **no** | 182.8 user units |

`ANY DIAGNOSIS` occupies about 27% of the node's width. Nothing to revert. At mobile the SVG renders at 293 CSS px (scale 0.523 of the 560 viewBox), so the clearance is roughly 96 CSS px per side — the node is nowhere near tight at any width.

(The measured text centre came out 280.0 at desktop and 279.0 at mobile. That 1-unit difference is a webfont-loading artifact in the measurement, not a positioning error: `text-anchor="middle"` at `x="280"` is exact by construction regardless of glyph metrics.)

### Before / after

- before: `<text x="280" y="60" text-anchor="middle" …>DIAGNOSIS</text>`
- after: `<text x="280" y="60" text-anchor="middle" …>ANY DIAGNOSIS</text>`

The six test domains are untouched. The full twelve-label stack remains skipped per the first run's rule 3.3 assessment; this is the one-word interim only.

---

## Gate output, second run

### 7.1 — Constant consistency — **PASS 8/8**

```
$ node scripts/check-constants.js
ok    form version agrees in all 3 places  (v1.7.0)
ok    engine version agrees in both places  (v1.3.2)
ok    draft schema version mirrored  (2)
ok    draft TTL mirrored  (3 days)
ok    neurohome.css cache-bust agrees on all 7 pages  (v=95)
ok    neurohome.js cache-bust agrees on all 7 pages  (v=20)
ok    every selectable country has a dial code  (197 countries)
ok    the dial-code affix is presentational  (span, aria-hidden, no name)

8 checks passed.
exit=0
```

No CSS or JS file was touched, so no cache-bust bump was needed.

### 7.2 — Residual diagnosis language — **unchanged from run 1, one open decision**

```
$ git --no-pager grep -n -i "autism" -- "*.html"
index.html:9:<title>NeuroHome: In-Home Neurodevelopmental Care &middot; Autism, PANS/PANDAS, ADHD &amp; More</title>
index.html:10:<meta name="description" content="An 8-week in-home program for neurodivergent children: autism, PANS/PANDAS, ADHD, developmental delay. Clinician-guid…
index.html:26:<meta property="og:title" content="NeuroHome: In-Home Neurodevelopmental Care &middot; Autism, PANS/PANDAS, ADHD &amp; More">
index.html:27:<meta property="og:description" content="An 8-week in-home program for neurodivergent children: autism, PANS/PANDAS, ADHD, developmental delay. Clinici…
index.html:32:<meta name="twitter:title" content="NeuroHome: In-Home Neurodevelopmental Care &middot; Autism, PANS/PANDAS, ADHD &amp; More">
index.html:33:<meta name="twitter:description" content="An 8-week in-home program for neurodivergent children: autism, PANS/PANDAS, ADHD, developmental delay. Clinic…
index.html:40:  "description": "An 8-week, clinician-guided in-home program for children with autism and developmental challenges.",
index.html:120:        <p class="hero-sub reveal reveal-d2">An 8-week, clinician-guided home program for neurodivergent children: autism, PANS/PANDAS, ADHD and relat…
index.html:126:          <strong>Led by Dr. Kyle Daigle, DC, FIBFN-CND</strong>. Lake Charles, Louisiana &middot; Families from 63 countries &middot; Autism &middot;…
index.html:209:        <p class="kyle-bio">For over a decade he has worked with families navigating autism, PANS/PANDAS, developmental delays, and complex neurologic…
index.html:785:      <div class="faq-a"><p>Children with autism, PANS/PANDAS, ADHD, developmental or speech delay, sensory processing difficulties, tics, anxiety and…
terms.html:92:  <p>NeuroHome is a <strong>functional-neurology and developmental support program</strong> delivered via telehealth and a clinician-prescribed home pr…
```

Same set as run 1, all deliberate, except **`index.html:40` (JSON-LD `"description"`), which is still the original autism-only string and is still your call.** It is now the only place on the homepage that describes the programme as autism-only. Recommendation unchanged: update it to the edit-18 string.

### 7.3 — ATEC removal — **PASS. Zero hits in `index.html`.**

This gate failed in run 1. It now passes.

```
$ git --no-pager grep -n -i "ATEC\|Autism Treatment Evaluation"
privacy.html:101:  <p>Once you enroll in the NeuroHome program, clinical information you share with us about your child (including intake fo…
start.html:469:(function populateCountries() {
terms.html:92:  <p>NeuroHome is a <strong>functional-neurology and developmental support program</strong> delivered via telehealth and a cli…

$ grep -c -i "ATEC" index.html
0
```

`index.html` is clean. Survivors elsewhere, all reported in run 1 and unchanged: `privacy.html:101` and `terms.html:92` are real (both out of scope, both gated on the instrument decision); `start.html:469` is the known false positive, the substring `ateC` inside `populateCountries`.

**Negative control** — both zero-result checks were proved capable of failing before being reported as passes. A copy of `index.html` with one line appended containing an em-dash and the string ATEC:

```
probe (index.html + one injected line):
  em-dash count: 1    <- check can fail
  ATEC count:    1    <- check can fail
real index.html:
  em-dash count: 0
  ATEC count:    0
```

### 7.4 — Visual — **PASS**, with one capture caveat

Served from `node .claude/static-server.js` on `localhost:4321`. Checked at **1280×900** and **375×812**.

- **`MEASUREMENT SCHEDULE`** — visually confirmed at desktop, flush at the figure's left gutter, no gap where `ATEC ·` used to be, no shift. Geometry above.
- **`ANY DIAGNOSIS`** — no overflow at either breakpoint, measured (table above). **Caveat, stated plainly: I could not capture a screenshot of the step-01 figure.** The Browser pane returned blank frames and 5-second render timeouts for that region on four attempts. Overflow is therefore verified by `getBBox()` measurement at both widths rather than by eye. The measurement is the more precise instrument for this specific question, but it is not the same as having looked at it, and **this is the one thing in the second run I would recommend you eyeball yourself** — step 01 of the method section, the dark node at the top of the figure.
- **Em-dash normalisation** — rendered text at 375px contains **0** em-dashes. Hero subhead, card 7 and step 04 all render with the new punctuation. The hero subhead in particular reads better with the colon than it did with the dash.
- **FAQ accordion** — 7 items, none clipped against the `max-height: 260px` cap at 375px (longest is item 4, pricing, at 222px; the new item 1 is 172px, one pixel shorter than before because of the comma). Opening and closing verified.
- **Symptom grid** — 8 cards, `335px` single column at 375px; 3 columns at 1280px, still 3+3+2 with one empty cell.
- **No horizontal overflow** at 375px (`document.scrollWidth === innerWidth === 375`).
- **Title** renders as `NeuroHome: In-Home Neurodevelopmental Care · Autism, PANS/PANDAS, ADHD & More`.

### 7.5 — File count — **PASS**

```
$ git status --short
 M index.html
?? docs/briefs/2026-09-15-inclusive-copy-run.md

$ git --no-pager diff --stat
 index.html | 57 +++++++++++++++++++++++++++++++++++++++------------------
 1 file changed, 39 insertions(+), 18 deletions(-)
```

Still one modified file. The diff moved from 37/16 to **39/18**, exactly +2 each: the two SVG lines (269 and 323) are now modified where they previously were not. Every other change in this run replaced characters on lines already counted. No stray hunks.

Line endings intact: `index.html` is 910/910 CRLF, matching the repo.

---

## Judgement calls, second run

1. **Extended item 1 to the SVG's `aria-label`.** The brief named only the visible label, but gate 7.3's stated expectation (zero ATEC in `index.html`) cannot be met without it, and leaving it would have left screen-reader users hearing an instrument name that no sighted user sees. Changed the ATEC token only; left "four domains" alone, since the domain count is part of the instrument decision, not this edit.
2. **Normalised all eleven em-dashes rather than reporting no convention.** The brief allowed leaving them if the file "genuinely has no established convention". It has one, clearly: colon for expansion (4 baseline instances), semicolon for joined independent clauses (3), `&middot;` for label and title segments (many), and zero dashes of any kind in rendered copy. So none were left.
3. **`index.html:785` took a comma, not a colon or semicolon.** This is the one of the eleven where the house convention does not cleanly apply. The construction is an additive coda at the end of a long comma list ("…seizures, learning differences — and children with no diagnosis yet…"). A colon cannot introduce a clause beginning with "and"; a semicolon wants two independent clauses and that coda is not independent. A comma is grammatical, matches the list's own punctuation, and matches the page's Oxford-comma habit ("the immune, gut, and neurological patterns"). **The cost is real and I want it on the record: the dash was doing rhetorical work there**, marking the pivot from children with diagnoses to children without one, and a comma flattens that into just another list item. That pivot is arguably the most important half-sentence in the FAQ. If you want the emphasis back, the fix is structural rather than punctuational — split it into its own sentence ("…learning differences. And children with no diagnosis yet, whose parents know something is off.") — but that changes wording, which this brief explicitly forbade, so I left it.
4. **`&middot;` for the three titles rather than a colon.** The title already opens with "NeuroHome:", so a second colon would read as a nested label. `&middot;` is the site's own separator, used in the credit line, the credential line, the stepper navigation and inside the SVG eyebrow labels. It renders as `·` in both the tab title and link previews.
5. **Did not touch `TWELVE DATA POINTS, NOT A FEELING` or the "four domains" count.** Both are now in mild tension with edit 07's "the same domains throughout", but neither is an ATEC reference, and changing them is part of the instrument decision rather than this cleanup.
6. **Reported the missing screenshot rather than treating the measurement as equivalent.** See gate 7.4. I have geometry, not a picture, for `ANY DIAGNOSIS`.

## Blocked for merge — updated

Two items from run 1 are now **cleared**:

- ~~SVG still labelled `ATEC · MEASUREMENT SCHEDULE`~~ — resolved, item 1.
- ~~Em-dashes in rendered copy~~ — resolved, item 2. `index.html` is back to zero em-dashes.

Still blocked, unchanged:

| # | What | Who | Why |
|---|---|---|---|
| 13 | The PANS/PANDAS clinical claim in step 01 | **Dr. Kyle + counsel** | Asserts prevalence and aetiology, not a service description |
| 07 + 16 | "the standardized measure matched to their presentation" | **Instrument decision** | Placeholder wording; names no instrument |
| — | The step-04 figure's "four domains" and `TWELVE DATA POINTS` caption | **Instrument decision** | Now the only place the four-domain structure is still asserted; rides with 07/16 |
| 08 | Testimonial disclaimer | **Counsel** | Drops the "most came for autism" skew disclosure |
| 15 | PANS/PANDAS in Dr. Kyle's bio | **Dr. Kyle** | His bio, his call |
| — | `index.html:40` JSON-LD description | **You** | One-line decision, the last autism-only self-description on the page |

Edit 06 (the twelve-label diagram) remains skipped, not blocked. It is a designer task, and the `ANY DIAGNOSIS` change is the interim.

## Confirmation, second run

I ran **no** `git add`, **no** `git commit`, **no** `git merge`, **no** `git push`, **no** `git stash`, and **no** `git checkout`. No branch was created or switched in this run; the session stayed on `feat/inclusive-copy` throughout. Read-only git only (`status`, `grep`, `diff`, `show`, `branch --show-current`). Nothing reached `origin` and nothing reached Vercel. `index.html` remains modified and unstaged.

**Second run finished:** 2026-09-15T03:29Z

---
---

# Third run — move the "Now Accepting New Families" pill into the hero photo

**Branch:** `feat/inclusive-copy` (unchanged)
**Files touched:** `index.html`, `neurohome.css`, plus six HTML pages for the CSS cache-bust. Nothing else.

## Read this first

**The stated goal is not met, and it is not reachable by moving the pill.** The pill move is done and correct. But the gap between the credit line and the stat box is **not a constant** — it ranges from 307px to 106px depending on viewport — and the pill only ever accounted for a fixed 70.1px of it. After the move the credit line still sits **35.7px below** the stat box at desktop, and up to 229px below at 901px.

I did not guess at a fix. I measured one, tested it, and left it unapplied for you: `.hero-proof { margin-top: 16px }` (from 52px) closes it to **−0.3px** at ≥1440px. Details and the trade-off below.

Separately: **the pill landed on the subjects' faces at mobile** and I moved it to the bottom-right there. That is a change the brief anticipated but the literal remedy it suggested is not reachable. Read "Mobile" before accepting.

---

## Recon

### 1. The pill's markup, container, and positioning rules

Markup, before (`index.html:118`, first child of `.hero-text`):

```html
<div class="hero-text">
  <div class="hero-badge reveal"><span class="pulse"></span> Now Accepting New Families</div>
  <h1 class="hero-title reveal reveal-d1">…
```

The only rules that positioned it (`neurohome.css:313-314`):

```css
.hero-badge { display: inline-flex; align-items: center; gap: 10px; font-size: 13px;
  font-weight: 500; color: var(--text); background: rgba(255,255,255,0.7);
  padding: 8px 18px 8px 14px; border-radius: var(--radius-pill);
  border: 1px solid var(--border); margin-bottom: 32px; backdrop-filter: blur(8px); }
.hero-badge .pulse { width: 8px; height: 8px; border-radius: 50%;
  background: var(--brand); animation: pulse 2s ease infinite; }
```

Plus one rule in the reduced-motion block (`neurohome.css:1255`): `.hero-badge .pulse { animation: none; }`. No other rule anywhere touches it.

**The bottom margin is `margin-bottom: 32px`.** Measured box height 38.1px, so the pill occupied **70.1px** of vertical space in the left column. That figure is constant at every viewport width (the pill never wraps).

Worth noting for the contrast question below: the pill already carried `background: rgba(255,255,255,0.7)` and `backdrop-filter: blur(8px)`. It was already built as a glass chip, even though it was sitting on a flat background.

### 2. The photo container

`.hero-photo-wrap` (`neurohome.css:286-293`):

```css
.hero-photo-wrap { position: relative; border-radius: var(--radius-lg); overflow: hidden;
  aspect-ratio: 1 / 1; box-shadow: var(--shadow-lg); background: var(--bg-warm); }
```

- **`position: relative` — already present.** No change needed.
- **`overflow: hidden` — yes, it clips.**
- **`border-radius: var(--radius-lg)` = 28px** — the pill has to clear that corner arc.
- It also has a `::after` pseudo-element at `inset: 0`, `pointer-events: none`, carrying a bottom gradient. Generated content paints after element children, so an absolutely positioned pill would sit *under* it at equal stacking. The gradient is fully transparent until 60% height so this is invisible in the top corner, but I gave the pill `z-index: 2` rather than rely on that.

**The photo container has no padding at all** — the image fills it edge to edge. So the brief's "inset matching whatever padding convention the photo area already uses" has no direct answer; there is no such convention. The candidates I found, and what I chose, are in the implementation section.

### 3. Current vertical offset, measured

At 1440px wide, before any edit:

```
.hero-proof top: 842.8px      .hero-stats top: 733.0px
DELTA: +109.9px  (credit line sits 109.9px BELOW the stat box)
pill outer height: 38.1 + 32 margin = 70.1px
```

### 4. Does removing the pill close it? No — it undershoots at every width, by a width-dependent amount

This is the finding that matters. I measured across the full desktop range in an isolated iframe:

| viewport | delta before | pill accounts for | **residual if pill removed** |
|---|---|---|---|
| 901px (just above the breakpoint) | 307.1 | 70.1 | **236.9** |
| 1000px | 225.9 | 70.1 | **155.7** |
| 1100px | 223.0 | 70.1 | **152.8** |
| 1200px | 201.7 | 70.1 | **131.6** |
| 1280px | 150.9 | 70.1 | **80.7** |
| 1366px | 132.0 | 70.1 | **61.9** |
| 1440px | 109.9 | 70.1 | **39.7** |
| 1600 / 1800 / 1920px | 106.5 | 70.1 | **36.4** |

**Why it can never close on its own.** The two columns have height drivers that move in opposite directions:

- Right column = `.hero-photo-wrap` (`aspect-ratio: 1/1`, so its height *equals the column width* and grows with viewport) + 22px gap + `.hero-stats`.
- Left column = a text block whose height *grows as the viewport narrows*, because the headline and subhead wrap onto more lines.

So as the viewport narrows, the right column shrinks and the left column grows, and the gap widens fast. The pill is a fixed 70.1px against a gap that varies by 200px. It stabilises at ≥1600px only because `.hero-inner` caps at `max-width: 1320px`.

The left column is the taller of the two at every width tested, so the usual structural fix (`align-items: stretch` + `margin-top: auto` on the proof) would do nothing — there is never any free space to absorb.

**Measured result after the move: residual 35.7px at ≥1440px**, matching the prediction within 4px.

| viewport | residual delta, after the pill move |
|---|---|
| 901px | 229.0 |
| 1000px | 148.0 |
| 1200px | 123.8 |
| 1280px | 72.9 |
| 1366px | 54.2 |
| 1440 / 1600 / 1920px | **35.7** |

### The proposed adjustment — tested, not applied

To close the remaining 35.7px the left column has to lose that height above the credit line. The cleanest single lever is `.hero-proof`'s own top margin. I simulated it at 1440px rather than computing it:

| `.hero-proof` margin-top | residual delta |
|---|---|
| 52px (current) | +35.7 |
| 20px | +3.7 |
| **16px** | **−0.3** |
| 12px | −4.3 |
| 0 | −16.3 |

**`.hero-proof { margin-top: 16px }` aligns them to within a third of a pixel at ≥1440px.** One line, `neurohome.css:320`.

**I did not apply it, and here is the trade-off you are deciding.** It cuts the breathing room between the CTA buttons and the credit rule by 69%, which is a visible change to the left column's rhythm and is a design call, not a mechanical one. And it only aligns in the band it is tuned for: at 1280px the residual is 72.9px, more than the entire 52px margin, so no value of that margin can align them there. Alignment below ~1400px would need the *right* column to grow instead — e.g. a taller `aspect-ratio` on `.hero-photo-wrap`, which changes the photo crop and is out of scope here.

Say the word and it is a one-line change.

---

## Implementation

### Markup

`index.html` — the pill moved out of `.hero-text` and into `.hero-photo-wrap`, immediately after `</picture>`:

```html
        <div class="hero-photo-wrap">
          <picture>…</picture>
          <div class="hero-badge reveal"><span class="pulse"></span> Now Accepting New Families</div>
        </div>
```

The element and its classes are unchanged, including `reveal`.

### CSS — one new rule (`neurohome.css`, after `.hero-badge .pulse`)

```css
.hero-photo-wrap .hero-badge { position: absolute; top: 18px; right: 24px; margin-bottom: 0; z-index: 2; }
```

Scoped to the descendant selector so the base `.hero-badge` is untouched.

**Inset: 18px top / 24px right.** As noted, the photo wrap carries no padding of its own, so there is no convention to inherit directly. The candidates were:

| Source | Value | Verdict |
|---|---|---|
| `.hero-stats` padding | `18px 24px` | **chosen** — the photo's own sibling in the same column, the nearest "inset from a rounded card edge" the design has |
| `.hero-photo-col` gap | `clamp(16px,1.8vw,22px)` | rhythm *between* blocks, not an inset within one |
| `.method-badge` (the page's other chip-on-an-image) | `bottom 12px / left 14px` | correct pattern, but tuned to a 20px-radius 180px-tall card; too tight for a 28px radius |

18/24 also clears the 28px corner arc with room to spare: the pill's corner sits at (24, 18) from the container corner, which is well inside the arc, and the pill's own `--radius-pill` rounding adds further clearance. Verified in the browser — measured inset exactly 18.0 / 24.0, and the pill's box is fully inside the wrap at every width tested.

---

## Contrast — passes comfortably, no new treatment needed

I sampled the actual source pixels under the pill's footprint, mapping the pill's rect back through `object-fit: cover`, `object-position: center 30%` and the `scale(1.12)` transform to natural-image coordinates, then composited the pill's `rgba(255,255,255,0.7)` over the mean and computed WCAG contrast.

| | desktop (1440px) | mobile (375px, after the fix below) |
|---|---|---|
| natural-image rect under pill | x971–1393, y133–201 | x488–1569, y915–1089 |
| photo mean RGB there | (164, 155, 142) | (138, 120, 104) |
| pill effective background | (228, 225, 221) | — |
| text colour | `rgb(14,14,14)` | same |
| **contrast ratio** | **14.82 : 1** | **11.32 : 1** |
| WCAG AA needs | 4.5 : 1 | 4.5 : 1 |

**It stays legible, with a very large margin.** The brief's worry ("light-on-light") does not materialise, because the pill's *text* is near-black — it is the pill's *plate* that is light, and a 70%-opaque white plate over a mid-tone photo lands at RGB ~(228,225,221). Even if that part of the photo were pure white the ratio would be 19.3:1.

**Nothing was invented.** The existing `backdrop-filter: blur(8px)` and translucent background were already on `.hero-badge`; they are doing exactly the job they were built for, now that there is finally an image behind them. No scrim, no shadow token, no new treatment was added.

One cosmetic note, not a defect: the pill's 1px border is `rgba(14,14,14,0.08)`, which is nearly invisible against a photo. The plate itself reads the shape fine, but if you want a crisper edge over imagery, that border is where to look.

---

## Mobile — it broke, and the literal remedy was not available

### What happens at ≤900px

The `@media (max-width: 900px)` block collapses `.hero-grid` to `1fr` and changes the photo to `aspect-ratio: 16 / 11; max-height: 480px`. So:

- The columns stack, **text above photo**. There is no credit-line/stat-box alignment left to serve at this width at all.
- The photo becomes 335 × 230px at 375px viewport — **less than 40% of the height** of the square desktop version.

The pill does not overflow and does not fall outside the crop (measured: fully inside the wrap, no horizontal page overflow). **The problem is what it lands on.** The same 18px top inset that sits above the subjects in a 591px-tall square lands in the middle of a 230px-tall 16:11 crop.

I mapped the pill footprint to the source image and ran a skin-tone detector over it, with a whole-image skin map to corroborate:

```
skin-tone % per cell, 8 cols x 6 rows, row 0 = top of image
row0:   2  33  23   1  30   0   0   0
row1:   7  47  75  52  64  30  40   6     <- the faces
row2:   0   4  29  45  38   0   9   3
row3:   0   4   4  10  14   9   4   0
row4:   0  19  18  12  44   5  14   0
row5:   0   7  14   2   1   0   0   0
```

| placement | natural rect | skin-tone % | contrast |
|---|---|---|---|
| desktop top-right (unchanged) | y133–201 | 23.5% | 14.82 |
| **mobile top-right (as first implemented)** | **y184–358** | **48.7%** | 13.45 |
| mobile top-left | y184–358 | 54.7% | 13.62 |
| mobile bottom-left | y915–1089 | 16.5% | 11.56 |
| **mobile bottom-right (chosen)** | **y915–1089** | **12.4%** | **11.32** |

Row 1 (y 200–400) is the face band. The mobile top-right footprint sits squarely in it. **The pill covered the faces**, on a page whose whole subject is children. Desktop at 23.5% only grazes the top of a head and reads as overlaying background.

### What I did, and why it is not what the brief asked for

The brief said: *"if it breaks, propose reverting to in-flow at that breakpoint via the existing media query."*

**A literal revert to in-flow is not reachable from the new DOM position.** The pill is now a child of `.hero-photo-wrap`, which is `overflow: hidden` and whose `<picture>` already fills 100% of its height. Setting `position: static` there would push the pill below the image and it would be clipped out of existence. CSS cannot move it back to the text column — that needs a DOM change, which would undo the thing this run was asked to do.

So I substituted the smallest contained alternative, in the existing media query as directed:

```css
  .hero-photo-wrap .hero-badge { top: auto; bottom: 18px; }
```

Same inset values, same right edge, same corner clearance, and it matches `.method-badge`, the page's only other chip-on-an-image, which is also bottom-pinned. Face overlap drops **48.7% → 12.4%**; contrast stays at 11.32:1. Verified after the change: `bottom: 18px`, `right: 24px`, fully inside the wrap, no horizontal overflow.

**This is a judgement call you may want to reverse.** I made it rather than leaving a pill over a child's face on the branch overnight, because it is a regression I introduced and the fix is one line inside a media query. But it is a different mobile appearance from the original (the pill used to sit above the headline). If you want the original mobile behaviour back, that needs the DOM restructure — move the pill to be a child of `.hero-photo-col`, make that `position: relative`, absolutely position it against the wrap at desktop, and let it fall in-flow below the stats at ≤900px. That is a bigger change than this brief authorised, so I did not make it.

---

## Gate output

### `node scripts/check-constants.js` — **PASS 8/8**

```
ok    form version agrees in all 3 places  (v1.7.0)
ok    engine version agrees in both places  (v1.3.2)
ok    draft schema version mirrored  (2)
ok    draft TTL mirrored  (3 days)
ok    neurohome.css cache-bust agrees on all 7 pages  (v=96)
ok    neurohome.js cache-bust agrees on all 7 pages  (v=20)
ok    every selectable country has a dial code  (197 countries)
ok    the dial-code affix is presentational  (span, aria-hidden, no name)

8 checks passed.
exit=0
```

**Cache-bust: CSS `v=95` → `v=96`, applied to all seven pages** (`index`, `start`, `terms`, `privacy`, `thank-you`, `refund-policy`, `hipaa-notice`). The JS cache-bust is **unchanged at `v=20`**; no JS file was touched.

**Negative control** — the cache-bust check was proved capable of failing before its pass was reported. Setting `terms.html` alone to `v=97`:

```
FAIL  neurohome.css cache-bust differs between pages, some will serve a stale asset
      (v=96: index.html, start.html, thank-you.html, privacy.html, hipaa-notice.html, refund-policy.html | v=97: terms.html)
```

then restored, and the check returns `ok … (v=96)`.

### Visual — desktop and mobile on the local static server

- **Desktop (1440px):** pill renders in the photo's top-right at exactly 18/24, fully inside the rounded corner. Confirmed by screenshot and by measurement. The screenshot also shows the residual: the credit line sits visibly, slightly lower than the stat box, consistent with the measured 35.7px.
- **Mobile (375px):** pill bottom-right at 18/24, inside the wrap, no horizontal page overflow, off the faces.
- **Residual alignment delta, measured at eight widths:** table above. **35.7px at ≥1440px**, growing to 229px at 901px.
- Caveat, same as the second run: the Browser pane returned degraded/blank frames on several capture attempts. The desktop hero screenshot came through; the per-figure close-ups did not, so the inset, containment, contrast and face-overlap numbers are all from measurement rather than from pixels I looked at.

### `git status` — **exactly the expected set**

```
 M hipaa-notice.html
 M index.html
 M neurohome.css
 M privacy.html
 M refund-policy.html
 M start.html
 M terms.html
 M thank-you.html
?? docs/briefs/2026-09-15-inclusive-copy-run.md
```

```
 hipaa-notice.html  |  2 +-
 index.html         | 61 ++++++++++++++++++++++++++++++++++++------------------
 neurohome.css      | 19 +++++++++++++++++
 privacy.html       |  2 +-
 refund-policy.html |  2 +-
 start.html         |  2 +-
 terms.html         |  2 +-
 thank-you.html     |  2 +-
 8 files changed, 66 insertions(+), 26 deletions(-)
```

`index.html` + `neurohome.css` + six pages for the cache-bust. **No file outside that set.** The untracked file is this report.

Every number reconciles: the six cache-bust pages are `1 insertion, 1 deletion` each, one line apiece. `neurohome.css` is 19 insertions and 0 deletions — the two added rules plus their comments (9 + 10 lines). `index.html` went from 57 changed lines to 61, +4 exactly: the pill line moved (1 del + 1 ins) and its own cache-bust line changed (1 del + 1 ins).

Line endings intact: `index.html` 910/910 CRLF, `neurohome.css` 1275/1275 CRLF.

---

## Judgement calls, third run

1. **Did not apply the alignment fix.** The brief said to propose it, and it is a design trade-off rather than a mechanical one: `margin-top: 16px` aligns perfectly at ≥1440px but cuts the left column's breathing room by 69% and still cannot align below ~1400px. Tested and ready; one line.
2. **Chose `18px 24px` for the inset.** The premise that the photo area has a padding convention is false — it has none. I took `.hero-stats`'s own padding as the nearest equivalent in the same column. `.method-badge`'s 12/14 was the other candidate and is too tight for a 28px corner radius.
3. **Added `z-index: 2`.** Strictly unnecessary — `.hero-photo-wrap::after` is transparent in the top corner — but it paints after element children, so relying on that is relying on a gradient stop. One declaration, no visual change.
4. **Moved the pill to bottom-right at mobile rather than leaving it over the faces.** Explained in full above. The literal remedy the brief named is not reachable from the new DOM position. I made the substitution because it is a regression I introduced and the fix is contained to the existing media query; flag it if you disagree.
5. **Kept the `reveal` class on the pill.** It is now a `.reveal` inside a `.reveal` parent (`.hero-photo-col` is `reveal reveal-d2`), so it animates in nested. Verified it renders; I did not retune the delay, since that is animation polish rather than layout.
6. **Reported the `width`/`height` attribute mismatch rather than fixing it.** `index.html` declares `width="2048" height="1368"` on the hero `<img>`, but the actual file is **1800 × 1202**. The aspect ratios are near-identical (1.4971 vs 1.4975) so the CLS reservation is effectively correct and nothing renders wrong — but the attributes are stale. Out of scope for this brief; noted so it does not get lost.

## Confirmation

No `git add`, no `git commit`, no `git merge`, no `git push`, no `git stash`, no `git checkout`. No branch created or switched; the session stayed on `feat/inclusive-copy`. Read-only git only. Nothing reached `origin` or Vercel. All eight files are modified and unstaged.

**Third run finished:** 2026-09-15

---
---

# Fourth run — `.hero-proof` margin-top 52px → 32px

**Branch:** `feat/inclusive-copy` (unchanged). **File touched:** `neurohome.css`, one value. Nothing else.

```diff
-.hero-proof { display: block; margin-top: 52px; padding-top: 32px; …
+.hero-proof { display: block; margin-top: 32px; padding-top: 32px; …
```

**No second cache-bust bump.** `v=96` was set in the third run and has never been deployed, so it still correctly represents "CSS newer than production's `v=95`". Bumping to `v=97` would be harmless but meaningless. `check-constants` passes 8/8 at `v=96`.

## Correction to the third run's numbers

The third run's simulation ran before `document.fonts.ready`, so its residuals were ~4px optimistic. It reported `margin-top: 16px → −0.3px` at 1440. **With webfonts loaded the true figure is 16px → +3.7px, and the value that actually aligns at 1440 via this margin alone is ~12px.** Every number below was measured after `await document.fonts.ready`, with all variants measured in a single pass per width so they are internally consistent.

## Residual delta at 32px

Residual = `.hero-proof` top − `.hero-stats` top. Positive means the credit line sits below the stat box. 0 = aligned.

| viewport | 52px (before) | **32px (now, on disk)** |
|---|---|---|
| 1440px | 39.7 | **19.7** |
| 1280px | 80.7 | **60.7** |
| 901px | 236.9 | **216.9** |

The change buys exactly 20px at every width, as expected. It halves the gap at 1440 and is close to irrelevant at 901.

For reference, the full curve measured in the same pass:

| viewport | mt 52 | mt 32 | mt 20 | mt 16 | mt 12 |
|---|---|---|---|---|---|
| 1440 | 39.7 | 19.7 | 7.7 | 3.7 | ~0 |
| 1280 | 80.7 | 60.7 | 48.7 | 44.7 | — |
| 901 | 236.9 | 216.9 | 204.9 | 200.9 | — |

## Does 32px look wrong?

**No. It looks fine, and it is a defensible place to stop.** Two observations from the screenshots, neither of which is a defect:

1. **It does not achieve alignment.** At 1440 the credit rule still sits 19.7px below the top of the stat box — visible if you look for it, easy to miss if you are not. At 1280 (60.7px) the misalignment is plainly visible. At 901 (216.9px) the two are nowhere near each other, and no value of this margin changes that.
2. **32px top against the rule's own 32px `padding-top` makes a symmetric sandwich.** The hairline now has equal space above and below it. A rule that introduces a block conventionally wants more space above than below, so it groups downward with the content it heads. At 52/32 it grouped with the credit line; at 32/32 it reads slightly more like a free-floating separator. In the actual render this is a subtle effect — the credit text is 14px grey and clearly distinct from the buttons above it, so the grouping still reads. Worth your eye rather than my assertion.

## What I would suggest instead

Not applied. Three options, all measured.

**The finding that shapes this:** I tested taking the same 20px out of `.hero-sub { margin-bottom }` instead of out of `.hero-proof { margin-top }`, and the residual is **identical** (19.7 / 60.7 / 216.9). The left column is a plain stack, so any height removed anywhere above the rule has exactly the same effect on alignment. **Where the height comes from is purely a typographic decision, not an alignment one.** That decouples the two questions.

| option | change | residual @ 1440 / 1280 / 901 | trade-off |
|---|---|---|---|
| **A — keep it** | `margin-top: 32px` (current) | 19.7 / 60.7 / 216.9 | Simplest. Not aligned, but visibly closer. Rule sits 32/32. |
| **B — align via this margin alone** | `margin-top: 12px` | ~0 / 40.7 / 196.9 | Aligned at 1440, but 12px above / 32px below inverts the rule's grouping so it reads as belonging to the buttons. **I would not do this.** |
| **C — my suggestion** | keep `margin-top: 32px`, also `.hero-sub { margin-bottom: 44px → 24px }` | **−0.3 / 40.7 / 196.9** | Aligned at 1440 without touching the rule's spacing further. Costs 20px of the gap between the subhead and the CTA row. |

**I would suggest C**, and I captured a simulated screenshot of it at 1440 (applied to the live DOM only, never written to disk) so you can compare against the on-disk version. In that render the credit rule and the stat box top form a clean horizontal line, and the tighter subhead-to-buttons gap still looks unhurried — the CTA row has plenty of presence at 24px.

**The caveat that applies to all three:** none of them fix 1280 or 901. The residual there is dominated by the column-height mismatch documented in the third run (square photo grows with viewport, text column grows as viewport narrows), not by any margin. Alignment below ~1400px needs the right column to get taller — a change to `.hero-photo-wrap`'s aspect ratio, i.e. a new photo crop.

## Screenshots

Captured at full resolution on the local static server, fonts loaded, reveal animations forced on:

- **1440×900, on disk (32px):** hero renders cleanly. Credit rule slightly below the stat box top. Subhead-to-buttons gap at 44px.
- **1440×900, option C simulated:** credit rule level with the stat box top. Subhead-to-buttons gap at 24px.
- **1280×900:** credit block clearly lower than the stat box. (The photo had not painted in that frame; the layout and spacing are unaffected.)
- **901×950:** large empty region to the right of the credit block; the misalignment is severe and obviously not a margin problem. Also visible at this width, and pre-existing rather than caused by anything in these runs: the left column is narrow enough (402.75px) that the two CTA buttons wrap onto separate lines.

## Gates

```
$ node scripts/check-constants.js
ok    form version agrees in all 3 places  (v1.7.0)
ok    engine version agrees in both places  (v1.3.2)
ok    draft schema version mirrored  (2)
ok    draft TTL mirrored  (3 days)
ok    neurohome.css cache-bust agrees on all 7 pages  (v=96)
ok    neurohome.js cache-bust agrees on all 7 pages  (v=20)
ok    every selectable country has a dial code  (197 countries)
ok    the dial-code affix is presentational  (span, aria-hidden, no name)

8 checks passed.
exit=0

$ git status --short
 M hipaa-notice.html
 M index.html
 M neurohome.css
 M privacy.html
 M refund-policy.html
 M start.html
 M terms.html
 M thank-you.html
?? docs/briefs/2026-09-15-inclusive-copy-run.md
```

Same file set as the third run, no new files. Verified on disk that the only change this turn is the one value, and that `.hero-sub` still reads `margin-bottom: 44px` — the option-C simulation was live-DOM only and was never written.

## Confirmation

No `git add`, `commit`, `merge`, `push`, `stash`, or `checkout`. Stayed on `feat/inclusive-copy`. Read-only git only. Nothing reached `origin` or Vercel.

**Fourth run finished:** 2026-09-15

---
---

# Fifth run — closeout: image dimensions, JSON-LD, FAQ wording

**Branch:** `feat/inclusive-copy` (unchanged). **File touched:** `index.html` only. No CSS change, so **no cache-bust bump** — `v=96` stands.

All three done. One of the three briefs' premises did not survive verification, and one edit is a wording change to approved patch-sheet copy rather than a punctuation swap. Both are flagged below.

## Edit ledger

| # | Edit | Status | File:line | Notes |
|---|---|---|---|---|
| 20 | Hero `<img>` dimensions 2048×1368 → 1800×1202 | done | index.html:135-136 | Correctness fix. **Not a CLS fix** — measured CLS was already 0 and is still 0. See below. |
| 21 | JSON-LD `description` | done | index.html:40 | Closes gate 7.2's last survivor |
| 22 | FAQ condition list, split into two sentences | done, **ACCEPTED** | index.html:785 | **WORDING CHANGE to approved patch-sheet copy**, not punctuation. **Accepted by Jake, 2026-09-15.** Separate open item: the condition list's *contents* may want Kyle/counsel review — which conditions are named, not the sentence structure. |

---

## 20 — Hero image dimensions

### Measured, not trusted

The brief said to verify rather than take its word, and to report if the `<picture>` sources differ. I parsed both files' headers directly off disk (JPEG SOF marker, WebP VP8 chunk) rather than reading `naturalWidth` in a browser — a browser only reports whichever source it actually picked, which would have hidden a mismatch.

| Source | Role | Measured | Aspect |
|---|---|---|---|
| `images/treatment-kyle-patient.jpg` | the `<img src>` | **1800 × 1202** (SOF `0xC2`, progressive) | 1.49750 |
| `images/treatment-kyle-patient.webp` | the `<source>` | **1800 × 1202** (VP8 lossy) | 1.49750 |
| — | declared in HTML | 2048 × 1368 | 1.49708 |

**The two sources agree exactly**, so there is no ambiguity about which the attributes should describe, and no need to report a conflict. Both corrected to 1800 × 1202.

Worth noting: the browser loads the **WebP** (`currentSrc` confirmed as `treatment-kyle-patient.webp`), so the attributes had been describing neither the resource on disk nor the resource in use.

### The brief's premise about CLS does not hold, and I am reporting rather than repeating it

The brief states the wrong attributes were "causing layout shift on load." **They were not, and correcting them changes no layout.** The reason:

```css
.hero-photo-wrap { aspect-ratio: 1 / 1; overflow: hidden; }          /* reserves the box */
.hero-photo-wrap picture, .hero-photo-wrap img {
  width: 100%; height: 100%; object-fit: cover;                       /* img fills it */
}
```

The wrap reserves its own height from `aspect-ratio: 1/1` (and `16/11` at ≤900px). The image is then stretched to 100%/100% of that box. **The image's intrinsic ratio never participates in layout**, so the `width`/`height` attributes cannot move anything.

Proved directly rather than argued — I set the attributes back to 2048×1368 in the live DOM, forced reflow, and measured:

| state | wrap height | img layout height | img CSS `aspect-ratio` |
|---|---|---|---|
| 1800 × 1202 | 590.953 | 590.953px | `auto 1800 / 1202` |
| reverted to 2048 × 1368 | **590.953** | **590.953px** | `auto 2048 / 1368` |
| restored | 590.953 | 590.953px | `auto 1800 / 1202` |

Only the computed `aspect-ratio` property changes. Nothing geometric moves.

### CLS measured on cold loads

`PerformanceObserver` on `layout-shift`, isolated frame, 1.8s window, `hadRecentInput` excluded:

| viewport | CLS | shift entries | reserved box | rendered layout box | match |
|---|---|---|---|---|---|
| 1440 | **0** | 0 | 591 × 591 | 590.953 × 590.953 | yes |
| 375 | **0** | 0 | 320 × 220 (`16/11`) | 320px × 220px | yes |

**The reserved box matches the rendered box exactly at both breakpoints.** It did before this edit too.

So this edit is worth making — the attributes were factually wrong, they describe the resource to anyone reading the markup, and they would start mattering the moment that CSS changed — but it fixes a correctness bug, not a performance one. Do not expect a CLS improvement in field data.

(One measurement note: `img.getBoundingClientRect()` reports 661.9px, not 591. That is the `transform: scale(1.12)` on `.hero-photo-wrap img`, which is visual only and clipped by the wrap. 591 × 1.12 = 661.9. The layout box is the 590.953px figure.)

---

## 21 — JSON-LD description

### Schema recon, reported before editing

```
@type            : MedicalBusiness
top-level keys   : @context, @type, name, description, url, email,
                   telephone, address, parentOrganization, founder, medicalSpecialty
```

Scanned every field for diagnosis language:

| Field | Value | Diagnosis language? |
|---|---|---|
| `name` | `NeuroHome` | no |
| **`description`** | the autism-only string | **yes — the only one** |
| `medicalSpecialty` | `Neurologic` | no, condition-neutral |
| `about` | **field does not exist** | n/a |
| `audience` | **field does not exist** | n/a |
| everything else | url, email, telephone, address, parentOrganization, founder | no |

**No sibling field carries diagnosis language, and neither `about` nor `audience` is present.** So this was a single-field change with no companions to keep in sync.

**Does the schema constrain the description differently from the meta tag?** No. `schema.org/description` is plain `Text` with no length or content constraint, so the 173-character edit-18 string is unconstrained here. The meta tag has the tighter practical limit (SERP truncation around 155-160 chars), and that tag already carries this exact string from run 1. Nothing needed adapting, so nothing was adapted — the string is byte-identical across all four description surfaces now.

### Before / after — `index.html:40`

- before: `"description": "An 8-week, clinician-guided in-home program for children with autism and developmental challenges.",`
- after: `"description": "An 8-week in-home program for neurodivergent children: autism, PANS/PANDAS, ADHD, developmental delay. Clinician-guided, drug-free, and lab-informed. Led by Dr. Kyle Daigle.",`

Colon, not em-dash, per the convention established in the second run. JSON-LD block re-parsed after the edit: **valid**, `@type` intact.

---

## 22 — FAQ condition list

### FLAG: this is a wording change, not a punctuation change

The previous four runs treated the patch sheet's copy as locked and changed only punctuation. **This edit alters the words.** It adds "Also", moves "and" from before "children with no diagnosis yet" to before "learning differences", and inserts a comma after "yet". The sentence count goes from two to three.

It is the right change — the run-two comma genuinely flattened the pivot from children-with-diagnoses to children-without-one, which is the rhetorical point of the answer, and splitting it restores that without reintroducing a dash. But Jake should see it as a copy edit to approved source, not as cleanup, because it is the first one in this branch.

### Before / after — `index.html:785`

**before:**
> Children with autism, PANS/PANDAS, ADHD, developmental or speech delay, sensory processing difficulties, tics, anxiety and OCD, motor delay, seizures, learning differences, and children with no diagnosis yet whose parents know something is off. We'll tell you honestly at intake if we're not the right fit.

**after:**
> Children with autism, PANS/PANDAS, ADHD, developmental or speech delay, sensory processing difficulties, tics, anxiety and OCD, motor delay, seizures, and learning differences. Also children with no diagnosis yet, whose parents know something is off. We'll tell you honestly at intake if we're not the right fit.

Still no em-dash. The condition list itself is unchanged in content and order.

---

## Gates

### `node scripts/check-constants.js` — **PASS 8/8**

```
ok    form version agrees in all 3 places  (v1.7.0)
ok    engine version agrees in both places  (v1.3.2)
ok    draft schema version mirrored  (2)
ok    draft TTL mirrored  (3 days)
ok    neurohome.css cache-bust agrees on all 7 pages  (v=96)
ok    neurohome.js cache-bust agrees on all 7 pages  (v=20)
ok    every selectable country has a dial code  (197 countries)
ok    the dial-code affix is presentational  (span, aria-hidden, no name)

8 checks passed.
```

**No cache-bust bump was needed or made.** All three edits are HTML-only. I verified this rather than asserting it: the cumulative `neurohome.css` diff is exactly the three changes from runs 3 and 4 (the two `.hero-badge` rules and their comments, plus `margin-top: 52px → 32px`) with nothing new this turn. `v=96` remains correct and undeployed.

### Gate 7.2 — **every survivor is now deliberate**

```
index.html:9    <title> …Autism, PANS/PANDAS, ADHD &amp; More            edit 17
index.html:10   meta description …autism, PANS/PANDAS, ADHD…             edit 18
index.html:26   og:title                                                  edit 17
index.html:27   og:description                                            edit 18
index.html:32   twitter:title                                             edit 17
index.html:33   twitter:description                                       edit 18
index.html:40   JSON-LD description                                       edit 21  <- NEWLY RESOLVED
index.html:119  hero subhead …neurodivergent children: autism…            edit 02
index.html:125  credit line …Autism · PANS/PANDAS · ADHD…                 edit 03
index.html:209  Dr. Kyle bio …autism, PANS/PANDAS…                        edit 15
index.html:785  FAQ condition list                                        edit 11 / 22
terms.html:92   …Autism Treatment Evaluation Checklist (ATEC)             out of scope, legal
```

**`index.html:40` was the last non-deliberate survivor and it is closed.** The only remaining hit outside the deliberate set is `terms.html:92`, which is a legal document gated on the instrument decision, not on this repositioning.

### Visual — desktop and mobile

- **FAQ opens and closes cleanly with the longer text.** Verified programmatically and visually at 375px: clicking toggles `.open` and flips `aria-expanded` `false → true → false`. Screenshot confirms item 1 rendered open across 7 lines, ending on "…if we're not the right fit."
- **Nothing clips.** At 375px the new answer measures **172px** natural height against the `max-height: 260px` cap — unchanged from before the rewrite, because the added words do not add a line. Longest answer on the page is still item 4 (pricing) at 222px.
- 7 items, no horizontal overflow at either width.
- Hero image attributes confirmed live as `1800x1202`; JSON-LD description confirmed live as the new string.

### `git status` — **`index.html` alone moved this turn**

```
 M hipaa-notice.html      <- run 3 cache-bust, unchanged this turn
 M index.html             <- this turn
 M neurohome.css          <- runs 3 + 4, unchanged this turn
 M privacy.html           <- run 3 cache-bust
 M refund-policy.html     <- run 3 cache-bust
 M start.html             <- run 3 cache-bust
 M terms.html             <- run 3 cache-bust
 M thank-you.html         <- run 3 cache-bust
?? docs/briefs/2026-09-15-inclusive-copy-run.md
```

The eight-file set is carried over from run 3; **only `index.html` changed in this run**, as expected. `index.html` went from 61 to **67** changed lines (44 insertions / 23 deletions), +6 exactly: three edits, one of which touches two adjacent lines — `width` and `height` (2 del + 2 ins), JSON-LD (1 + 1), FAQ (1 + 1).

Line endings intact: 910/910 CRLF.

---

## Judgement calls, fifth run

1. **Reported the CLS premise as wrong rather than restating it.** The brief asserts the attributes were causing layout shift. They were not — the CSS reserves the box independently — and I proved it by reverting the attributes in the live DOM and measuring no geometric change, plus CLS 0 on cold loads at both breakpoints. The edit still stands on correctness grounds.
2. **Parsed the image headers off disk rather than reading `naturalWidth`.** A browser reports only the source it chose, which here is the WebP; had the JPG differed, a browser measurement would have silently missed it. Both turned out identical, so this changed nothing, but the check would have caught a mismatch and the browser method would not.
3. **Flagged edit 22 as a wording change in the ledger, not just in prose.** It is the first alteration to approved patch-sheet wording in this branch, and the previous runs' discipline was punctuation-only. It deserves to be visible as such.
4. **No cache-bust bump, and verified rather than assumed.** I enumerated every changed CSS line to confirm nothing new landed in `neurohome.css` this turn before concluding `v=96` still stands.

## Branch status — CLOSED for Claude Code

Both decisions that were open to Jake are now made (2026-09-15):

| Decision | Outcome |
|---|---|
| Edit 22, the FAQ wording change | **Accepted.** It restores the pivot the em-dash was carrying, without introducing the first dash in rendered copy on the site. |
| Hero alignment residual, 19.7px at 1440 | **Left as is. Option C declined.** 19.7px is invisible at desktop unless measured, and option C costs 20px of subhead-to-CTA spacing for an alignment nobody sees. `.hero-proof { margin-top: 32px }` is final; `.hero-sub` stays at `margin-bottom: 44px`. |

Nothing further on this branch is Claude Code's work. What remains needs people:

| Owner | Item | Blocks merge? |
|---|---|---|
| **Instrument decision** | Edits 07 and 16. **The one with a real dependency.** | **Yes, for two surfaces** |
| **Dr. Kyle** | Edit 13, the PANS/PANDAS clinical claim in step 01 | Yes |
| **Dr. Kyle** | Edit 15, PANS/PANDAS named in his own bio | Yes |
| **Counsel** | Edit 08, testimonial disclaimer | Yes |
| **Kyle / counsel** | The FAQ condition list's *contents* (edit 11/22) — which conditions are named. Sentence structure is settled; this is about the clinical and legal defensibility of naming them. | Not yet assessed |
| **Design** | Edit 06, the twelve-label diagram. `ANY DIAGNOSIS` is the interim and is fine to ship as-is. | No |

### The instrument decision is the one that leaves placeholder wording live

Everything else on this list can merge around its owner. This one cannot, because the branch currently ships copy that describes a measurement instrument without naming one, on **two parent-facing surfaces**:

- `index.html:328` — "…using **the standardized measure matched to their presentation**…"
- `index.html:821` — "We score your child at baseline, mid-program (Week 4) and final (Week 8) using **the standardized measure matched to their presentation**."

That phrasing is honest about the ATEC no longer being named, but it names nothing in its place. Merging it means a parent reading the method section and the FAQ is told their child is measured on a standardized instrument that the site declines to identify.

Three further surfaces move with that decision and are **not** fixed by editing those two sentences:

- `index.html:323` — the step-04 SVG still shows **four** labelled domains and is captioned **`TWELVE DATA POINTS, NOT A FEELING`** (4 domains × 3 timepoints). If the instrument becomes presentation-matched, the domain count is no longer fixed at four and that arithmetic stops holding. ATEC is gone from this figure; the four-domain structure is not.
- `terms.html:92` — names the ATEC as a validated assessment used by the service. If the instrument changes, this becomes inaccurate **as a term of service**, which is a different and more serious problem than being off-brand.
- `privacy.html:101` — cites "ATEC scores" as an example of PHI. Low priority, but it dates with the instrument. Generic wording ("assessment scores") would survive the change.

**Recommendation:** treat edits 07, 16, the step-04 figure, `terms.html:92` and `privacy.html:101` as one unit with a single owner. Merging 07 and 16 alone produces a page whose prose, graphic and terms of service disagree with each other about what is being measured.

## Confirmation

No `git add`, `commit`, `merge`, `push`, `stash`, or `checkout`. Stayed on `feat/inclusive-copy`. Read-only git only. Nothing reached `origin` or Vercel. All eight files remain modified and unstaged.

**Fifth run finished:** 2026-09-15

---
---

# Sixth run — closing the instrument gap on the legal surfaces

**Branch:** `feat/inclusive-copy` (unchanged). **Files touched:** `terms.html`, `privacy.html`, `index.html`. No CSS or JS change, so **no cache-bust bump** — `v=96` stands.

**Context:** Kyle approved edits 13 and 15 as written, and wants the instrument reference kept generic rather than naming a replacement. That settles the marketing copy. These three edits bring the two legal surfaces and the step-04 caption into line with that decision, so none of them depends on the instrument being chosen.

**Result: zero ATEC references remain anywhere in the repo.** The dependency flagged at the end of the fifth run is now narrowed to the placeholder prose alone; nothing on a legal or graphical surface still asserts a specific instrument.

## Edit ledger

| # | Edit | Status | File:line | Notes |
|---|---|---|---|---|
| 23 | `terms.html` — narrow the ATEC commitment to a general one | done | terms.html:92 | **Substitution boundary widened beyond the instrument name.** See flag. |
| 24 | `privacy.html` — ATEC scores → standardized assessment scores | done | privacy.html:101 | Clean substitution, grammar took it as-is |
| 25 | `index.html` — step-04 caption, count removed | done | index.html:323 | No coordinate change; left-anchored, no shift |

---

## 23 — `terms.html:92`

### Recon

**Section: `3. Nature of Services`** (`<h2>` at terms.html:91). The document is `Terms of Service`, last updated May 26, 2026, operated by NSH Operations, LLC. The paragraph is the first under that heading and is the clause that defines what the Services consist of.

Full sentence and its surrounding clause, verbatim, before the edit:

> NeuroHome is a **functional-neurology and developmental support program** delivered via telehealth and a clinician-prescribed home protocol. NeuroHome's Services include clinical evaluation, individualized home protocols, a clinical-grade device kit, weekly clinician-led telehealth sessions, and progress tracking using validated assessments such as the Autism Treatment Evaluation Checklist (ATEC).

The ATEC sits at the end of a list enumerating what "NeuroHome's Services include" — so it is not a passing mention, it is an itemised component of the contracted service.

### FLAG: the grammar did not take the substitution cleanly

The brief's replacement is `a validated standardized assessment appropriate to your child's presentation`. Dropped in for the instrument name alone, it reads:

> …using validated assessments such as **a validated standardized assessment** appropriate to your child's presentation.

That doubles "validated", and "such as" introduces an *example*, which a generic replacement is not. Three options considered:

| | Approach | Result |
|---|---|---|
| **A (taken)** | Replace `validated assessments such as the Autism Treatment Evaluation Checklist (ATEC)` | `…progress tracking using a validated standardized assessment appropriate to your child's presentation.` Uses the proposed wording verbatim. |
| B | Replace the instrument name only | `…validated assessments such as a validated standardized assessment appropriate to…` Redundant and clumsy. |
| C | Replace `such as the …(ATEC)` with `appropriate to your child's presentation` | `…using validated assessments appropriate to your child's presentation.` Clean, but drops "standardized" from the approved wording. |

**I took A.** The brief said to report rather than rewrite the surrounding clause if the grammar resisted; A is a choice of *substitution boundary*, not a rewrite — it introduces no new legal language and preserves the proposed text word for word. What it removes beyond the instrument name is four words of lead-in (`validated assessments such as`), which become redundant because the replacement already carries "validated" and because "such as" cannot introduce a generic. **Recorded here so the diff is reviewable without opening the file.**

If counsel prefers the plural framing retained, option C is the one-line alternative.

### Before / after — `terms.html:92`

**before:**
> …weekly clinician-led telehealth sessions, and progress tracking using **validated assessments such as the Autism Treatment Evaluation Checklist (ATEC)**.

**after:**
> …weekly clinician-led telehealth sessions, and progress tracking using **a validated standardized assessment appropriate to your child's presentation**.

Nothing else in the paragraph changed. The `<strong>` on "functional-neurology and developmental support program" is untouched, as is the `legal-emphasis` block that follows.

**Why this is accurate under any instrument:** it commits to a validated, standardized assessment matched to presentation, which is true whether the ATEC is retained for autism presentations, replaced wholesale, or varied per phenotype. The previous wording committed the service to a named instrument it may not use.

---

## 24 — `privacy.html:101`

### Recon

**Section: `Protected Health Information (PHI)`** (`<h2>` at privacy.html:100). The paragraph defines what counts as PHI once a family enrols; the ATEC appears inside a parenthetical giving **examples of the clinical information collected**, alongside intake forms, clinician notes and session activity.

Full sentence, verbatim, before the edit:

> Once you enroll in the NeuroHome program, clinical information you share with us about your child (including intake forms, clinician notes, **ATEC scores**, and session activity) is treated as Protected Health Information under the Health Insurance Portability and Accountability Act (HIPAA). PHI is handled separately from general marketing data and is governed by our HIPAA Notice of Privacy Practices, which you will receive at intake.

### Before / after — `privacy.html:101`

- before: `(including intake forms, clinician notes, ATEC scores, and session activity)`
- after: `(including intake forms, clinician notes, standardized assessment scores, and session activity)`

**The grammar took this cleanly** — it is a noun phrase inside a list of noun phrases, so no surrounding clause moved and no boundary decision was needed. Nothing else in the paragraph changed.

---

## 25 — `index.html:323`, the step-04 caption

### Recon

**Caption element, verbatim before the edit:**

```html
<text x="30" y="348" fill="#545D6E" font-family="JetBrains Mono, monospace"
      font-size="9.5" letter-spacing="1.6">TWELVE DATA POINTS, NOT A FEELING</text>
```

**No `text-anchor` attribute**, so it inherits the SVG default `start` — left-anchored at `x="30"`, the same gutter used by the eyebrow label and the four domain labels. Identical anchoring to the `MEASUREMENT SCHEDULE` node changed in the second run.

**The four domain labels** (all `x="30"`, left-anchored, untouched by this edit):

| y | label |
|---|---|
| 140 | `SPEECH / LANGUAGE` |
| 196 | `SOCIABILITY` |
| 252 | `SENSORY / COGNITIVE` |
| 308 | `HEALTH / BEHAVIOR` |

**Where the count appears elsewhere:**

- **"TWELVE" appears only in the caption.** Nowhere else in the figure.
- **But the `aria-label` carries a different count:** `"Measured across four domains at baseline, week four and week eight"`. That is a count of the *domains*, not the data points.
- The three timepoint labels (`BASELINE`, `WEEK 4`, `WEEK 8`, inside the one `text-anchor="middle"` group) encode the three visually.

**I did not change the `aria-label`, deliberately.** It says "four domains" because four domain labels are drawn, and the brief instructs leaving those alone as a coordinate job. Changing the accessible description to disagree with what is rendered would be worse than the mismatch it fixes. It is not an ATEC reference, so it does not affect the gate. Flagged as riding with the domain-label work whenever that happens.

### Why the replacement's count is safe where the old one was not

`MEASURED THREE TIMES, NOT ONCE` does still contain a number, but it counts the **timepoints**, which are structurally fixed: the figure draws three, and both surviving prose edits (07 at index.html:328 and 16 at index.html:821) name them explicitly as "baseline, week 4 and week 8". The schedule does not vary by instrument; only the domain count does. `TWELVE` was unsafe precisely because it was 4 × 3 and the 4 is the part that moves.

### Before / after — `index.html:323`

- before: `<text x="30" y="348" …>TWELVE DATA POINTS, NOT A FEELING</text>`
- after: `<text x="30" y="348" …>MEASURED THREE TIMES, NOT ONCE</text>`

### Alignment check — same anchor method as `MEASUREMENT SCHEDULE`

**No coordinate change was made and none was needed.** With a start anchor, a shorter string still begins at `x=30` and simply ends earlier. Measured after the edit at both breakpoints:

| viewport | caption x | width | right edge | shares left gutter with eyebrow + domain labels | within viewBox 560 |
|---|---|---|---|---|---|
| 1440 | **30.0** | 218.9 | 248.9 | yes | yes |
| 375 | **30.0** | 219.0 | 249.0 | yes | yes |

The caption is 68.6 user units shorter than before (`TWELVE DATA POINTS, NOT A FEELING` was 33 characters, the new one 30) and sits flush with the other left-anchored text exactly as it did. `svg.textContent` confirms no "TWELVE" remains anywhere in the figure.

---

## Gates

### `node scripts/check-constants.js` — **PASS 8/8**

```
ok    form version agrees in all 3 places  (v1.7.0)
ok    engine version agrees in both places  (v1.3.2)
ok    draft schema version mirrored  (2)
ok    draft TTL mirrored  (3 days)
ok    neurohome.css cache-bust agrees on all 7 pages  (v=96)
ok    neurohome.js cache-bust agrees on all 7 pages  (v=20)
ok    every selectable country has a dial code  (197 countries)
ok    the dial-code affix is presentational  (span, aria-hidden, no name)

8 checks passed.
exit=0
```

No CSS or JS file was touched, so no cache-bust bump was needed. `v=96` still stands and remains undeployed.

### ATEC repo-wide — **ZERO real hits**

```
$ git --no-pager grep -n -i "ATEC\|Autism Treatment Evaluation"
start.html:469:(function populateCountries() {
```

The single hit is the long-standing false positive: the substring `ateC` inside `populateCountries`, which only matches case-insensitively. Proved with a case-sensitive word-boundary search:

```
$ git --no-pager grep -n -w "ATEC"
ZERO real hits

$ git --no-pager grep -n "Autism Treatment Evaluation"
ZERO hits
```

**Negative control** — the word-boundary check was proved capable of matching before its zero result was reported: a probe file containing `ATEC scores` returns 1.

This is the first point in the branch where the repo contains no ATEC reference of any kind. Previous runs cleared `index.html` prose (07, 16), the SVG label and `aria-label` (second run); this run clears the last two, both legal.

### `git status`

```
 M hipaa-notice.html      <- run 3 cache-bust, unchanged this turn
 M index.html             <- this turn (caption)
 M neurohome.css          <- runs 3 + 4, unchanged this turn
 M privacy.html           <- this turn (+ run 3 cache-bust)
 M refund-policy.html     <- run 3 cache-bust, unchanged this turn
 M start.html             <- run 3 cache-bust, unchanged this turn
 M terms.html             <- this turn (+ run 3 cache-bust)
 M thank-you.html         <- run 3 cache-bust, unchanged this turn
?? docs/briefs/2026-09-15-inclusive-copy-run.md
```

**`index.html`, `terms.html` and `privacy.html` moved this turn**, on top of the existing eight-file set, exactly as expected. No new files.

Diff arithmetic reconciles: `terms.html` and `privacy.html` each go from `2 +-` to `4 ++--` (1 line of cache-bust from run 3, plus 1 line this turn). `index.html` stays at 67 changed lines, because the caption edit lands on line 323 — the same line already counted as modified by the second run's `MEASUREMENT SCHEDULE` and `aria-label` changes.

### Visual

- **`terms.html`** — renders cleanly at 1440 and 375. Section `3. Nature of Services` reads "…progress tracking using a validated standardized assessment appropriate to your child's presentation." No ATEC in `body.innerText`, no horizontal overflow, paragraph reflows normally at 335px.
- **`privacy.html`** — renders cleanly at 1440. Section `Protected Health Information (PHI)` reads "…intake forms, clinician notes, standardized assessment scores, and session activity…". No ATEC in `body.innerText`, no horizontal overflow.
- **Step-04 figure** — geometry verified at both breakpoints (table above): caption at `x=30`, sharing the left gutter, inside the viewBox, no "TWELVE" anywhere in the SVG. **Caveat, stated plainly: I could not capture a fresh screenshot of the figure this turn.** The Browser pane returned stale or unscrolled frames on four attempts, the same flakiness recorded in the second, third and fourth runs. The caption was captured visually in the second run when `MEASUREMENT SCHEDULE` changed on this same line, and nothing about the figure's layout has changed since — but that is an inference, not a picture taken today.

---

## Judgement calls, sixth run

1. **Widened the substitution boundary on `terms.html`** to absorb `validated assessments such as`, because the approved replacement already contains "validated" and because "such as" cannot grammatically introduce a generic. This uses the proposed wording verbatim and invents no legal language, but it removes four words beyond the instrument name, so it is flagged in the ledger and spelled out above with the two alternatives.
2. **Left the step-04 `aria-label` saying "four domains".** It is not an ATEC reference, it does not affect the gate, and it accurately describes the four domain labels that the brief instructs leaving in place. Changing it would put the accessible description out of step with what is drawn.
3. **Kept a number in the replacement caption, and checked it was the safe one.** "THREE" counts timepoints, which are fixed and named in the surviving prose; "TWELVE" was 4 × 3 and the 4 is what varies by instrument.
4. **Reported the missing screenshot rather than implying the figure was eyeballed today.** Geometry, not pixels.

## Instrument dependency — narrowed

The fifth run listed five surfaces riding on the instrument decision. Three are now closed:

| Surface | Status |
|---|---|
| ~~`terms.html:92`~~ | **Closed** — edit 23. No longer names an instrument; accurate under any. |
| ~~`privacy.html:101`~~ | **Closed** — edit 24. |
| ~~`index.html:323` caption~~ | **Closed** — edit 25. No count tied to domain structure. |
| `index.html:328` and `index.html:821` prose | **Open by decision.** Kyle wants it generic for now. Both read "the standardized measure matched to their presentation" and name nothing. |
| `index.html:323` four domain labels + `aria-label` | **Open.** Still asserts a four-domain structure visually. Coordinate work, out of scope for copy edits. |

**What this changes:** the placeholder wording is now a deliberate, approved position rather than an unresolved gap, and it no longer conflicts with a term of service or a privacy policy that says otherwise. The branch can merge without the instrument being chosen. The remaining four-domain figure is a design task alongside edit 06, not a blocker.

## Confirmation

No `git add`, `commit`, `merge`, `push`, `stash`, or `checkout`. Stayed on `feat/inclusive-copy`. Read-only git only. Nothing reached `origin` or Vercel. All eight files remain modified and unstaged.

**Sixth run finished:** 2026-09-15
