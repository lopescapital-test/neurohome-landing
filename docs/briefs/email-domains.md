# Email domains

> **Not a brief.** Standing infrastructure fact, not point-in-time intent. It
> records state that lives outside this repo and cannot be checked by grepping
> it — see the re-verify line at the foot.

mail.neurohome.app remains the GHL/Mailgun sending domain (verified, warmed).
Root neurohome.app has no MX to Mailgun; inbound to hello@neurohome.app
forwards via ImprovMX → hello@mail.neurohome.app → GHL Conversations.
Verified 2026-09-14.

Written because this file is now the only place in the repo where the string
`mail.neurohome.app` appears: the public-facing address moved to
`hello@neurohome.app` on 2026-09-14. Without this file, the subdomain's absence
from the codebase would read as "retired" rather than "still the sending path".

**Re-verify** with `dig MX neurohome.app` and `dig TXT mail.neurohome.app`
against the DNS, not against this file.
