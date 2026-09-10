# `docs/briefs/`

Working briefs for changes to this repo: what a change is for, what has to be
checked before touching it, and what must not break. They exist so a piece of
work can be picked up by someone — or something — that was not in the
conversation where it was scoped.

**A brief is point-in-time. It is a snapshot of intent, not a description of
current state.**

Every brief here cites file paths, line numbers, commit hashes and counts that
were accurate on the day it was written and start going stale on the next
commit. A brief that says `intake.html:2931` is telling you where a thing was,
not where it is. Line numbers move when anything above them changes, and this
repo edits large single-file pages.

So, before acting on anything in a brief:

- **Re-verify every line number and every count.** Grep for the code, do not
  trust the citation. If the brief says a function is at `:3169`, confirm it,
  and note in your report that you did.
- **Re-read the commits it names.** A brief written against one commit may
  describe a problem that a later commit already fixed, made worse, or moved.
- **Treat "currently", "today" and "as of" as expired** unless you have checked
  them yourself.
- **If a brief and the code disagree, the code wins** — and say so in your
  report rather than quietly working around it. A brief that has drifted is
  itself a finding.

The reason this warning is here at all: a stale internal document that keeps
getting cited as current state is worse than no document, because people stop
checking. This directory should not produce another
`NeuroHome_Workflow_Audit_2026-05-27_v2.html` — a file whose name still carries
the date it stopped being true and which was quoted as fact long afterwards.

## Conventions

- One file per piece of work, named for the thing it changes:
  `intake-phone.md`, not `brief-3.md`.
- Open the file with the date it was written and the commit it was written
  against. That single line is what lets a reader judge how much to trust the
  rest.
- When the work ships, either delete the brief or add a line at the top saying
  which commit closed it. A brief with no resolution is the thing that rots.

## Not deployed

`docs/` is listed in `.vercelignore`. The repo root is served as the public
site, so without that line these files would be fetchable at their own URLs —
and a brief typically names an open defect, the file and line it lives at, and
what it does to a user. Keep the exclusion.
