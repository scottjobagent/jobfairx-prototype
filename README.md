# JobFairX — Job Seeker prototype

GitHub is the source of truth: `scottjobagent/jobfairx-prototype`, served at
https://scottjobagent.github.io/jobfairx-prototype/

## The live files

| File | What it is |
|---|---|
| `jobseeker-v2.html` | The dashboard. Events, Interviews, Messages, Resume. |
| `jobseeker-job.html` | The public job posting. Opens from every "View job". |
| `jobseeker-join-v1.html` | Joining an interview — Indeed's flow, 15 screens. |
| `jobseeker-scheduling-v1.html` | Schedule and reschedule. |
| `jobseeker-mobile.html` | Side-by-side phone harness. Semi-redundant. |

## Not published

`jobseeker-v1.html` is the **locked** first dashboard. Never modify it, never
push it. It correctly 404s on Pages and exists only here.

**Naming trap:** `jobseeker-v1.html` is the dead dashboard.
`jobseeker-scheduling-v1.html` is the *live* scheduling flow — the "v1" refers
to that flow, not to an old prototype. These have been confused before.

## Documents

- `HANDOFF-4.md` — **the current handoff. Read this first.**
- `INDEED-EMAIL-SPEC.md` — Indeed's email design, measured off their live DOM.
- `HANDOFF-3.md`, `HANDOFF-2.md` — earlier handoffs.
- `HANDOFF.md` — the earlier one it supersedes.
- `CHANGELOG-2026-08-18.md` — the Aug 18 build record.
- `INDEED-JOIN-FLOW.md` — how Indeed's join flow works, reconstructed from a
  screen recording. Ends with a note on what still needs capturing.

`reference/` holds earlier working artefacts. `older copies/` holds superseded
versions, iCloud conflict copies and pre-edit `.bak` snapshots — nothing in
there is current, and it can all be deleted.

## Note

This folder sits on an iCloud-synced Desktop. Deleting from here sends files to
iCloud's Recently Deleted rather than the local Trash, and restoring a file by
copying it back can collide with iCloud's own state. Recover through
Finder → iCloud Drive → Recently Deleted instead.
