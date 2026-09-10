# BRIEF — `intake.html` international phone

> **Written 2026-09-10, against `5eb482a`. Point-in-time: every line number and
> every "currently" below was true at that commit and goes stale on the next one.
> Re-verify before acting on any of it — see `docs/briefs/README.md`.**

**Repo:** `C:\dev\neurohome-landing`, branch `main`.
**Follows:** two shipped `start.html` changes — `7542f57` (country-first, E.164
for all 197) and `5eb482a` (dial-code affix, non-NANP grouping and length cap).
**Jake runs all git operations. Produce diffs and stop.**

**Recon first. Report before editing anything.** This form is not the lead form:
it has live draft persistence, a real schema-version gate, and 121 questions of
parent-entered state behind it. The previous pass could afford to be brisk
because `start.html` turned out to persist nothing. This one cannot.

---

## Why this exists

`start.html` now posts correct E.164 for all 197 countries. `intake.html` does
not, and worse, it actively blocks non-NANP parents from finishing.

The hero says families from 63 countries. International is not hypothetical.

---

## THE PRIMARY DEFECT — the hard 10-digit gate

**`intake.html:2931`**, inside `function classify()`:

```js
if ((state.phone || '').replace(/\D/g, '').length !== 10) {
  alert('Please go back and enter a 10-digit phone number before submitting.');
  state.currentSection = 0; showScreen('welcome'); return;
}
```

Read what this does on failure, because it is worse than a rejection:

1. It fires a **blocking `alert()`**.
2. It sets `state.currentSection = 0` and calls `showScreen('welcome')` — it
   throws the parent **back to the first screen** of a 121-question form.
3. It happens at **submit**, i.e. after every question has been answered.

A UK parent whose number is `07700 900123` (11 digits) can complete the entire
intake and be bounced to the welcome screen with an instruction they cannot
comply with, because their number is not ten digits and never will be. The same
is true for most of the 195 non-NANP countries.

The draft is supposed to survive that bounce, which would be the one mercy here.
**Whether it actually does is recon §3, not an assumption** — and if it does not,
this defect is materially worse than described above and the urgency changes
again.

---

## THE SECONDARY DEFECT — duplicated phone logic, and the gap is widening

Both files carry their own copy of the same phone logic. Two shipped commits
have now landed on one side only, so the gap is widening, not stable — **re-read
the line numbers before trusting them; they moved in `5eb482a`:**

| symbol | `start.html` | `intake.html` | state |
|---|---|---|---|
| `NANP_COUNTRIES` | ✓ | ✓ | identical |
| `shouldFormatPhone` | ✓ | ✓ | identical |
| `formatPhoneNANP` | ✓ | ✓ | identical |
| `toE164` | ✓ | ✓ | **DIVERGED** (`7542f57`) — start.html handles 197 countries, the `+`-plus-leading-zero case and the Italy exception; intake.html still has the NANP-only original |
| `DIAL_CODES` (197) | ✓ | — | start.html only |
| `KEEP_LEADING_ZERO` | ✓ | — | start.html only |
| dial-code affix | ✓ | — | **start.html only** (`5eb482a`) |
| `nationalDigitCap` | ✓ | — | **start.html only** (`5eb482a`) |
| `groupPhoneDigits` | ✓ | — | **start.html only** (`5eb482a`) |

So a parent now gets a visibly different phone field on the two forms: `+43`
shown with grouped, length-capped digits on the lead form, and a bare
unformatted box on the intake. That inconsistency is a symptom of the
duplication, not a separate problem to style away.

`scripts/check-constants.js` does **not** guard any of these. It guards
`DRAFT_SCHEMA_VERSION`, `DRAFT_TTL_MS`, the three intake version strings, the
`?v=` agreement, country↔dial-code coverage (`7542f57`) and the affix being
presentational (`5eb482a`). The phone functions drift silently.

`intake.html` is **deliberately self-contained** — it loads neither
`neurohome.css` nor `neurohome.js` (verified: no reference to either). That is a
real constraint on any shared-module proposal, not an oversight, and the
`neurohome.js` header at 246-250 explains the reasoning for the draft constants.
Whatever you propose has to respect it or argue explicitly for changing it.

---

## SEQUENCING — these are two defects with different urgency

This brief describes two problems and it should probably ship as two commits.

| | urgency | risk of the fix |
|---|---|---|
| **the gate** (`:2931`) | **active harm.** Families are being bounced out of a completed 121-question form right now. | small and local, IF it can be changed without touching the phone functions |
| **the divergence** | drift plus a wrong `toE164` for non-NANP. Real, but nobody is being ejected from anything. | larger — touches duplicated logic, possibly a new shared asset, possibly the draft |

**Do not let the refactor hold the bleeding fix.** Recon must cost these
separately (§4) and say plainly whether the gate can be fixed in isolation. If
it can, that is commit one and it ships on its own; the divergence follows on its
own recon and its own gates.

If they genuinely cannot be separated, say why with evidence rather than
bundling them by default — "it was easier together" is not a reason to make a
family wait for a refactor.

---

## RECON — answer each with file evidence, assert nothing from memory

### 1 · HOW MANY LIVE DRAFTS ARE THERE? — answer this before anything else

This is question one because it sets the cost of every other decision in the
brief. A schema bump with zero live drafts is free. A schema bump with fifty is
fifty families dropped into a blank 121-question form.

Report, separately and honestly:

- **What you CAN observe.** Drafts live in `localStorage` under
  `neurosage_intake_draft_v2`, which is **per-browser, per-device**. There is no
  server-side copy and no analytics on it that this repo knows about.
- **What you CANNOT observe, and say so plainly.** A local count is a count of
  one machine. If the real number is unknowable from here, the answer is "the
  live count is unknowable from this environment", not an estimate dressed as
  one. Then say what WOULD establish it — GHL partial-submission records, a
  server-side beacon, asking Jake how many parents were mid-intake this week —
  and let Jake decide whether it is worth finding out before proceeding.
- **The TTL bounds the exposure**: 3 days (`DRAFT_TTL_MS`). Any draft older than
  that is already discarded on load, so the population at risk is parents who
  started within 72 hours of the deploy. Report that as the actual blast radius.

### 2 · The draft blob itself

- What is the exact persisted blob? Key, schema version, TTL, top-level key
  count, and where `phone` sits in it.
  *(Known starting points: `DRAFT_SCHEMA_VERSION = 2` at `intake.html:1803`,
  `STORAGE_KEY` at 1804, `saveToStorage` around 1985, `loadFromStorage` around
  1930. A live blob observed on 2026-09-09 had 23 top-level keys and a numeric
  `savedAt`; it still had 23 after `5eb482a`.)*
- Observe a REAL blob. Do not infer its shape from the code that writes it.

> ### ⛔ STOP CONDITION — the schema bump is not a step
>
> If any proposed change would alter the blob's SHAPE — adding a key, renaming
> one, or changing the type of an existing one — **stop and report. Do not bump
> `DRAFT_SCHEMA_VERSION` and do not proceed.**
>
> A bump is not a migration. `loadFromStorage` reads a versioned key, so
> bumping does not upgrade old drafts, it **orphans** them: the new key finds
> nothing, and every parent mid-form silently restarts at question one with
> their answers still sitting in a `_v2` key nobody reads.
>
> This is a product decision with a real cost to real families, and it is Jake's
> to make with the live-draft count from §1 in front of him. It is not a step in
> an implementation plan.
>
> **The phone work should not need a bump at all.** Changing what `state.phone`
> *contains* is a value change, not a shape change — `5eb482a` already respaced
> it (`06641234567` → `066 412 345 67`) and the blob stayed at 23 keys. If your
> design needs a new key, that is the signal to re-scope, not to bump.
>
> If Jake does rule for a bump, `neurohome.js:252` must move in lockstep or the
> "Resume your intake" CTA silently stops appearing. `check-constants` guards
> that pair — confirm it does by break-testing it, not by reading it.

### 3 · Does the draft actually survive the bounce?

The gate fires `alert()`, sets `state.currentSection = 0` and calls
`showScreen('welcome')`. The claim that a parent's 121 answers survive that is
**untested**, and it is the difference between an infuriating defect and a
data-loss one.

Exercise it for real, in a browser, with a non-NANP number:

- Fill enough of the form that a draft exists, confirm the blob is written.
- Trigger the gate (submit with an 11-digit number).
- After the bounce, is the draft still in `localStorage`, with the same key and
  the same answers? Does reloading the page restore them?
- Does `state.currentSection = 0` get PERSISTED? If the bounce writes
  `currentSection: 0` into the draft, then even a surviving draft returns the
  parent to screen one on every future visit — the answers are intact but the
  place in the form is gone. `saveToStorage` was changed specifically to carry
  `currentSection` (see its comment), so this is a live possibility, not a
  hypothetical.

**If the draft does not survive, or the position is clobbered, stop and report
before proposing any fix.** That changes the severity and possibly the ordering
in the SEQUENCING section above.

### 4 · Can the gate be fixed in isolation?

Cost the two defects separately, per SEQUENCING above. Specifically:

- What does a minimal gate fix touch? Just the condition at `:2931`, or does an
  acceptable replacement need `toE164`, `DIAL_CODES`, or the country list?
- Is there a correct gate that needs NO new data — e.g. a digit-count floor and
  ceiling rather than a per-country rule? A `>= 7` floor is what `start.html`
  uses and it needs nothing beyond the typed digits.
- Report the smallest change that stops the bounce, and whether it is
  independently correct or merely less wrong.

### 5 · What `state.phone` actually holds, at every stage

Trace and report the full lifecycle with line numbers:

- restored from `nh_lead` (`:1969`) — display format, per the `start.html`
  contract that this pass must not break;
- normalised on restore (`:2051-2059`) — confirm what it does for a non-NANP
  value;
- rewritten by the input mask (`:2079`, `:2099`);
- rewritten by the country-change stripper (`:2064-2067`);
- read by the gate (`:2931`);
- posted via `toE164` (`:3022`, `:3203`).

Report every write. A fix that normalises at one of these and not the others
will look correct and fail intermittently.

### 6 · The submit payload(s)

There appear to be **two** `toE164(state.phone)` call sites (`:3022` and
`:3203`). Report what each posts, to which endpoint, and whether they are the
same CRM contract. Two payloads is two chances to send a different shape.

### 7 · Country vocabulary

Does `intake.html` have its own country list, and does it match `start.html`'s
197? If it has its own copy, that is a third list and the dial-code map cannot
simply be imported. Report counts and any name that differs by even one
character — `Cote d'Ivoire` vs `Côte d'Ivoire` breaks a name-keyed map silently.

### 8 · Where the shared logic should live

`intake.html` loads no shared asset today. Report the options with their real
costs:

- **(a)** duplicate `DIAL_CODES` + the new `toE164` into `intake.html` — a fifth
  and sixth duplicated constant. **If you take this route, the guarding check
  must compare BEHAVIOUR, not source text.** A byte-for-byte comparison of two
  function bodies is the obvious idea and it is wrong: the copies will
  legitimately differ in whitespace, variable names and comment wrapping, so
  such a check produces false failures, and a check that cries wolf is a check
  nobody reads. Two workable shapes:
    - **a shared case table.** The 30-case `toE164` suite already exists (it
      lifts the real function out of `start.html` and runs it against a fixed
      input/expected table). Point it at BOTH files and assert both produce the
      same output for every case. That tests the thing that matters and is
      immune to formatting.
    - **constants only, compared as data.** `DIAL_CODES` and
      `KEEP_LEADING_ZERO` are literals, so parsing both copies and comparing the
      parsed objects IS sound — that is what check 4 already does for the
      country list. Do that for the data and the case table for the functions.
- **(b)** extract a `phone.js` loaded by both — breaks intake's self-containment,
  needs a `?v=` bump strategy for a file only two pages load;
- **(c)** something else you can argue for.

Do not pick silently. The repo's stated position is that a duplicated constant
is acceptable **only** with the reason written down and a check enforcing it —
that is the arrangement `patients_timezone_supported`, `UPLOAD_FOLDERS`, and now
`DIAL_CODES` all use.

**If the affix, grouping or cap get ported, one number transfers.** On
`start.html` at a 375px viewport, the widest affix (`+998`) plus a 12-digit
grouped number needs roughly **165px of content width**, and that field had
203.7px available. Treat 165px as a **target to check `intake.html` against, not
as a measurement of it** — `intake.html` is a separate page with its own CSS and
its phone field's geometry is entirely unmeasured. Re-measure there; reuse only
the threshold.

### 9 · What replaces the 10-digit gate

Propose the validation rule and bring the wording before shipping it. Constraints:

- It must accept a valid number from any of the 197 countries.
- It must still reject obvious garbage — the `start.html` equivalent is a
  `< 7` digit floor at submit.
- **It must not bounce the parent to section 0.** Whatever replaces this should
  land them on the field with the problem, or refuse to submit in place. The
  bounce is arguably the worse half of this defect: a wrong number is
  recoverable, being dropped at the start of a 121-question form is not.
- Report whether `alert()` is the right mechanism at all, given the form has an
  established error surface elsewhere.

### 10 · Standing greps

Run both greps from the app repo's `CLAUDE.md` convention if any role or tier
literal is touched. Expect neither to apply here; report that they were run and
returned nothing rather than skipping them.

---

## OPEN DECISION, carried forward — not a fix

**A parent who types their country code WITHOUT a `+`.**

`start.html` handles the two patterns its placeholder invites: `+44 7700 900123`
and `07700 900123`. It does **not** handle `44 7700 900123`, which becomes
`+4447700900123`.

This was left deliberately. Any heuristic that treats a leading `44` as a
country code will corrupt valid national numbers in some of the 197 — the
ambiguity is real and unresolvable from the digits alone.

Decide it here, for both files, or record that it stays open. Do not fix it in
`intake.html` alone; that reintroduces exactly the divergence this brief exists
to close.

---

## Constraints

- Recon report before any edit. Never assert file contents from memory.
- Migrations are intent, not state — not applicable here, but the same rule
  applies to the draft: **observe a real blob, do not infer it from the code
  that writes it.**
- `intake.html` **is a deployed page** (not in `.vercelignore`). It is live.
- It loads no `neurohome.css` / `neurohome.js`, so a `?v=` bump is only in scope
  if option (b) is chosen; say so explicitly either way.
- `node scripts/check-constants.js` must pass — currently **8/8**. If you add a
  check, **break-test it in both directions** and confirm the break actually
  landed before trusting the failure. A check that passes for the wrong reason
  is worse than no check; that happened once in the previous pass and was only
  caught by asserting the edit had modified the file.
- Never `git add .`, never `commit -am`. Stage by explicit path from real
  `git status` output. Confirm "On branch main". Propose commands.
- Anything written to a scratchpad must be confirmed on disk with a listing and
  byte size before claiming it exists.
- Verify in a browser on the live origin after deploy, not curl. **Do not submit
  the form to the live CRM** — build the payload and inspect it, as the previous
  pass did, or the test creates a real contact.
- Copy is locked. Propose any new wording; do not ship it unreviewed.

---

## Prior art worth reading before starting

- Commit `7542f57` — country-first + E.164 for all 197. Its message documents
  the two non-obvious correctness traps: NANP territories map to `+1`, not their
  area code (Jamaica as `+1876` prepended to a typed `876…` yields a
  plausible-looking undialable number); and Italy, San Marino and Vatican City
  keep their leading zero, so the "strip the trunk zero" rule that is right for
  GB is wrong for a Rome landline.
- Commit `5eb482a` — the dial-code affix, blur grouping and the derived length
  cap. Its message documents why the affix is a `<span>` and not an input, why
  grouping runs on blur (it dissolves the choice between a second copy of the
  caret math and editing working code), and why the cap is derived from
  `DIAL_CODES` rather than listed.
- `start.html` `DIAL_CODES` — the 197-entry map and its header, including why
  Vatican City is `+39` and not its assigned-but-unused `+379`.
- `scripts/check-constants.js` checks 4 and 5 — the coverage-assertion and
  structural-assertion patterns to copy. **Check 5's comment also records what a
  static check cannot do**, and why the runtime property it was originally asked
  to guard is verified in a browser instead. That distinction is the one to
  carry into any new check here.
