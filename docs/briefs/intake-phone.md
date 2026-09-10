# BRIEF — `intake.html` international phone

> **Written 2026-09-10 against `5eb482a`; revised 2026-09-10 against `247ce64`.
> Point-in-time: every line number and every "currently" below was true at the
> revision commit and goes stale on the next one. Re-verify before acting on any
> of it — see `docs/briefs/README.md`.**

> ### PARTIALLY CLOSED by `247ce64`
>
> **Closed:** the gate condition. `!== 10` became `< 7` (the same floor
> `start.html` uses), so a valid number from any of the 197 countries now passes
> and the bounce never fires for the families it was hitting. Verified: an
> 11-digit Austrian mobile reaches submit, and `currentSection` in the real draft
> blob is unchanged at 11 before and after.
>
> **Still open, and still in this brief:**
> - **The bounce mechanic itself.** A genuinely bad number (4 digits, say) still
>   resets `state.currentSection = 0` and still destroys the parent's place —
>   reproduced after the fix. Smaller population, same defect. See §3, which is
>   now answered rather than open.
> - **The whole divergence.** `toE164` is still NANP-only in this file, so the
>   phone reaching GHL from both call sites is still not E.164. Confirmed live
>   during the fix: an Austrian number posted as `0664 123 4567`.
>
> Recon §§1, 3 and 4 were answered on 2026-09-10 and their findings are folded in
> below. §§2, 5–10 are still open.

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

## THE PRIMARY DEFECT — the hard 10-digit gate · CONDITION FIXED in `247ce64`

**`intake.html:2958`** (was `:2931` before the fix added 34 lines above it),
inside `function classify()`. As it stood:

```js
if ((state.phone || '').replace(/\D/g, '').length !== 10) {
  alert('Please go back and enter a 10-digit phone number before submitting.');
  state.currentSection = 0; showScreen('welcome'); return;
}
```

It now reads `< 7` with `start.html`'s wording. **The two lines below the
condition are unchanged and are still the open half** — the reset and the bounce
are merely no longer reachable by a valid international number.

What it did on failure, because it was worse than a rejection — and **all three
still happen for a genuinely bad number**:

1. It fires a **blocking `alert()`**.
2. It sets `state.currentSection = 0` and calls `showScreen('welcome')` — it
   throws the parent **back to the first screen** of a 121-question form.
3. It happens at **submit**, i.e. after every question has been answered.

Before `247ce64`, a UK parent whose number is `07700 900123` (11 digits) could
complete the entire intake and be bounced to the welcome screen with an
instruction they had no way to satisfy, because their number is not ten digits
and never will be. That was true for most of the 195 non-NANP countries. It is
no longer true for any valid number.

The draft survives the bounce; **the parent's place in the form does not.** That
was the open question when this brief was written and it is now answered, with
the mechanism measured — see §3.

---

## THE SECONDARY DEFECT — duplicated phone logic, and the gap is widening

Both files carry their own copy of the same phone logic. Two shipped commits
have now landed on one side only, so the gap is widening, not stable — **re-read
the line numbers before trusting them; `5eb482a` moved them in start.html
and `247ce64` moved everything after :2931 in intake.html by +34:**

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

## SEQUENCING — RESOLVED. The gate shipped first, alone

Two defects with different urgency, and they were separated:

| | urgency | outcome |
|---|---|---|
| **the gate condition** (`:2958`) | **was active harm** — families bounced out of a completed 121-question form | **SHIPPED `247ce64`**, one condition and one string, nothing shared touched |
| **the bounce mechanic** (the two lines under it) | still reachable by a genuinely bad number | **open**, belongs to the work below |
| **the divergence** | wrong `toE164` for 195 countries, from both call sites | **open**, its own recon and its own gates |

The principle held and is worth keeping for the next one: **do not let the
refactor hold the bleeding fix.** Recon costed the two separately (§4), found the
gate could be fixed in isolation, and the fix shipped the same day. The
divergence waits without a family waiting on it.

If a future split looks impossible, say why with evidence rather than bundling by
default — "it was easier together" is not a reason to make a family wait for a
refactor.

---

## RECON — answer each with file evidence, assert nothing from memory

### 1 · HOW MANY LIVE DRAFTS ARE THERE? — answer this before anything else

This is question one because it sets the cost of every other decision in the
brief. A schema bump with zero live drafts is free. A schema bump with fifty is
fifty families dropped into a blank 121-question form.

**ANSWERED 2026-09-10.** Kept in full, because the answer is a method the next
session should reuse rather than rederive.

- **The true count is unknowable from a dev environment.** Drafts live in
  `localStorage` under `neurosage_intake_draft_v2` — per-browser, per-device. A
  local count is a count of one machine. Do not dress an estimate up as a number.
- **But it IS knowable, and the signal already exists.** `postProgress()`
  (`:3222`) POSTs to `INTAKE_PROGRESS_WEBHOOK_URL` (`:1816`, configured and
  live) on `intake_started` (`:2186`) and `intake_progress` (`:2683`). Each
  payload already carries `email`, `phone`, `questions_answered`,
  `percent_complete`, `section_reached`, `sections_total` and
  `intake_started_at`.
- **So the query is:** parents with an `intake_started` or `intake_progress`
  event in the last 72 hours and no corresponding submission. Christia can run
  that against GHL with no new instrumentation.
- **Two honesty caveats on that data.** `intake_progress` only fires when a
  parent advances past `deepestSectionPinged` (`:2680-2683`), so it is a
  high-water mark and not a heartbeat — it undercounts progress but never misses
  the existence of a draft. And the fetch is `.catch(() => {})` fire-and-forget,
  so a failed ping is silent: GHL is a **lower bound** on starts.
- **Blast radius, verified live:** `DRAFT_TTL_MS` is 3 days, so only parents who
  started within 72 hours of a deploy are exposed. Scale: `SECTIONS.length` is
  **13**, `TOTAL_QUESTIONS` is **121**.

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

### 3 · Does the draft survive the bounce? — ANSWERED: answers yes, position NO

**The answers survive. The position is destroyed, and the destruction is
sticky.** Reproduced empirically on 2026-09-10, and **still reproducible after
`247ce64`** for a genuinely bad number. This remains open.

The chain, each step verified in source and then in a browser:

1. The gate runs `state.currentSection = 0; showScreen('welcome'); return;`.
2. **`showScreen()` does not save** — it only toggles CSS classes and scrolls.
   So at that instant the draft still holds the real section. Measured: blob
   `currentSection` was still `11` immediately after the bounce. This is the
   part that looks safe and is not.
3. **The alert tells the parent to fix their phone.** That field is on the
   welcome screen, inside `setupWelcome()`, and its `input` handler calls
   `saveToStorage()` in **both** branches.
4. `saveToStorage` (`:1985`) debounces 250ms and captures `{ ...state }` INSIDE
   the timer callback, so it snapshots after the mutation and writes
   `currentSection: 0`. Measured: **one keystroke in the phone field took the
   blob from `11` to `0`.**
5. On reload, `loadFromStorage` clamps with
   `Math.min(savedSection, firstIncompleteSection())`, and `Math.min(0, …)` is
   `0`.
6. `assessmentReached` is true for anyone who reached the questions, so the
   bootstrap runs `renderIntakeSection(); showScreen('intake')` → **section 1 of
   13**, all 121 answers intact, no indication the place was thrown away.

**The action the alert instructs is the action that destroys the position.**
Doing nothing preserves it. That is why this reads as user error forever: the
parent concludes the form is broken, and nothing in the logs says why.

Narrower path, also real: a debounced save already pending when the gate fires
persists `currentSection: 0` with no parent action at all. 250ms window.

**Partial mitigation that exists:** a section jump selector (`goToSection`), so
recovery is not 13 Continue clicks. But nothing tells the parent their place was
reset.

**Relevant to any fix:** `:3022` removes the draft entirely on submit SUCCESS,
deliberately and documented as PHI hygiene on a shared device. That is correct
behaviour, not a bug — but it means a test that submits successfully will find no
blob to inspect. Use a failing submit when you need the blob to survive.

### 4 · Can the gate be fixed in isolation? — ANSWERED: yes. Shipped in `247ce64`

The condition was a pure string operation on `state.phone`, so replacing it
needed **no `DIAL_CODES`, no `toE164`, no country list, no new data**. `< 7` is
`start.html`'s existing floor, so no new threshold was invented.

**And the isolated fix removed the §3 harm for the affected population as a side
effect**, because the position loss is strictly downstream of the bounce: the
reset only executes when the gate fires, so fixing the condition stops it running
at all for a valid international number. One condition, both halves gone, nothing
shared touched.

**Two findings for the LATER work, discovered while answering this:**

- **Changing the bounce to stop resetting `currentSection` would be insufficient
  on its own.** `intro-begin` (`:2331-2332`) sets `state.currentSection = 0` and
  then calls `saveToStorage()`, so a parent who walks back through onboarding is
  reset anyway. Re-entry needs to respect `assessmentReached`.
- **`alert()` was left as the mechanism**, deliberately, as out of scope for a
  bleeding fix. Whether it should be replaced by the form's own error surface is
  still §9.

### 5 · What `state.phone` actually holds, at every stage

Trace and report the full lifecycle with line numbers:

- restored from `nh_lead` (`:1969`) — display format, per the `start.html`
  contract that this pass must not break;
- normalised on restore (`:2051-2059`) — confirm what it does for a non-NANP
  value;
- rewritten by the input mask (`:2079`, `:2099`);
- rewritten by the country-change stripper (`:2064-2067`);
- read by the gate (`:2958`);
- posted via `toE164` (`:3054`, `:3235`).

Report every write. A fix that normalises at one of these and not the others
will look correct and fail intermittently.

### 6 · The submit payload(s)

There are **two** `toE164(state.phone)` call sites, and they are NOT two
attempts at the same CRM contract — an earlier draft of this brief guessed they
might be, and that was wrong:

- **`:3054`** — the submit payload.
- **`:3235`** — inside `postProgress()`, the abandoned-draft progress ping to
  `INTAKE_PROGRESS_WEBHOOK_URL` (`:1816`), fired on `intake_started` (`:2186`)
  and `intake_progress` (`:2683`).

**So the wrong phone has been reaching GHL from both, not one.** Every progress
ping for a non-NANP parent has carried a non-E.164 number for as long as the
diverged `toE164` has been in this file. Any fix has to cover both call sites;
fixing only the submit path leaves the progress webhook wrong and nothing will
tell you, because the ping is `.catch(() => {})` fire-and-forget.

Report what each posts and confirm both are covered.

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
