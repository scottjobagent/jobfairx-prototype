# Stub modals

The Vue files in this folder marked `// STUB` are placeholders.
They render as a `BaseModal` with the right title and a "Not implemented yet" body
so that the lobby's action wiring is end-to-end clickable, but the real form/UI
hasn't been built.

When you implement one of these:

1. Find the corresponding section in `Employer-Dashboard/lobby.html` — every stub
   has a `// SOURCE: lobby.html#section-id` comment pointing to the original markup.
2. Use `MessageModal.vue`, `ResumeModal.vue`, or `DeclineModal.vue` as your reference
   for the file shape:
   - Pull `candidate` (or other payload) from `useModal()`'s `state.value.payload`.
   - Render with `<BaseModal name="...">` and slots `body` + `footer`.
   - Reset local form state in a `watch` on the payload so re-opens are clean.
   - Call `close()` from `useModal()` after a successful submit.
3. Replace the stub body with the real form. Delete this stub note.
4. The modal is already wired into `LobbyPage.vue` and to the right action button —
   no other plumbing is needed.

## Stubs in this folder

| File                       | Modal name        | Source in HTML prototype |
| -------------------------- | ----------------- | ------------------------ |
| WelcomeModal.vue           | `welcome`         | `lobby.html` ~line 1989  |
| TeamModal.vue              | `team`            | `lobby.html` ~line 2016  |
| AVCheckModal.vue           | `av`              | `lobby.html` ~line 2044  |
| InstructionsModal.vue      | `instructions`    | `lobby.html` ~line 2196  |
| ScheduleModal.vue          | `schedule`        | `lobby.html` ~line 2836  |
| FeedbackModal.vue          | `feedback`        | `lobby.html` ~line 3012  |
| StartInterviewModal.vue    | `startInterview`  | (new — not in prototype) |
| JoinInterviewModal.vue     | `joinInterview`   | (new — not in prototype) |
