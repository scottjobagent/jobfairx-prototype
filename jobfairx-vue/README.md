# JobFairX Employer Dashboard — Vue 3 sample

This is a **review sample** of the Vue 3 + TypeScript + Tailwind conversion of the
employer dashboard prototype. It contains one fully built page (Lobby) so you can
sign off on file structure, naming, code style, and design-token usage before the
rest of the conversion happens.

The HTML prototype lives in the sibling folder: `Employer-Dashboard/` (the parent
of this directory). Treat those `.html` files as the source of truth for visuals
and behavior — Vue components in this project should match them 1:1.

---

## Getting started

```bash
cd Employer-Dashboard/jobfairx-vue
npm install
npm run dev
```

Open <http://localhost:5173>. You'll land on `/lobby` (the converted page).

```bash
npm run type-check   # vue-tsc, strict mode
npm run build        # production bundle (also type-checks)
npm run preview      # serve the built bundle
```

---

## Stack

- **Vue 3.5** with `<script setup>` Composition API
- **TypeScript 5.7**, strict mode (every strictness flag is on — see `tsconfig.app.json`)
- **Vite 6** for dev server and build
- **Tailwind CSS 3.4** with extended design tokens
- **Vue Router 4** for navigation

No state library (Pinia) yet — the sample is small enough that composables are
sufficient. Add Pinia when shared state grows beyond a couple of composables.

---

## Folder layout

```
jobfairx-vue/
├── index.html                  # Vite entry, loads Noto Sans
├── tailwind.config.js          # ⭐ ALL design tokens live here — never hardcode hex
├── tsconfig.app.json           # ⭐ Strict TypeScript settings
├── vite.config.ts              # @ → ./src alias, dev server config
├── src/
│   ├── main.ts                 # App entry — wires Vue + Router + global CSS
│   ├── App.vue                 # Shell: TopBar + <RouterView />
│   ├── style.css               # Tailwind directives + global resets
│   ├── router/
│   │   └── index.ts            # Routes — only /lobby is real, the rest are placeholders
│   ├── types/
│   │   ├── lobby.ts            # Lobby domain types (Candidate, LobbyEvent, etc.)
│   │   └── index.ts            # Re-exports
│   ├── data/
│   │   └── lobby-mock.ts       # Mock data — replace with API calls when backend lands
│   ├── composables/
│   │   ├── useLobbyMode.ts     # Dev-only mode toggle (active/empty/live)
│   │   └── useModal.ts         # Global modal registry (open/close/isOpen)
│   ├── components/
│   │   ├── base/               # Generic primitives — reusable across pages
│   │   │   ├── BaseButton.vue  # 3 variants (primary/secondary/ghost), 3 sizes
│   │   │   ├── BaseModal.vue   # Modal shell with header/body/footer slots
│   │   │   ├── Pill.vue        # Status / count badges
│   │   │   ├── StatusCard.vue  # Generic white card surface
│   │   │   └── Tabs.vue        # Generic tab strip (typed by tab key)
│   │   ├── layout/
│   │   │   └── TopBar.vue      # App header — mounted once in App.vue
│   │   └── lobby/              # Lobby-specific components
│   │       ├── EventHeader.vue
│   │       ├── CandidateRow.vue
│   │       ├── EmptyState.vue
│   │       ├── WaitingPanel.vue        # Tab 1
│   │       ├── InterviewingPanel.vue   # Tab 2
│   │       ├── InterviewedPanel.vue    # Tab 3
│   │       ├── NotYetPanel.vue         # Tab 4
│   │       ├── DevModeToggle.vue       # Dev-only mode switcher (delete in prod)
│   │       └── modals/
│   │           ├── MessageModal.vue    # ✅ Fully implemented
│   │           ├── ResumeModal.vue     # ✅ Fully implemented
│   │           ├── DeclineModal.vue    # ✅ Fully implemented
│   │           ├── StubModal.vue       # Generic placeholder body
│   │           ├── _STUB_README.md     # How to replace stubs
│   │           └── *.vue               # Stubs — see _STUB_README.md
│   └── pages/
│       ├── LobbyPage.vue       # The fully converted page
│       └── PlaceholderPage.vue # Used by routes that aren't converted yet
└── env.d.ts                    # Vite + Vue module type declarations
```

---

## Conventions

### Design tokens — never hardcode

Every color, font size, radius, and shadow lives in `tailwind.config.js` under
`theme.extend`. Use them by name (e.g. `bg-brand-blue`, `text-text-primary`,
`border-border-default`). If you need a value that isn't there, **add it to the
config first**, don't drop a hex into a component.

The token namespaces:

| Namespace  | Examples                                              |
| ---------- | ----------------------------------------------------- |
| `brand.*`  | `brand-blue`, `brand-blue-dark`, `brand-blue-light`   |
| `text.*`   | `text-primary`, `text-secondary`, `text-tertiary`     |
| `border.*` | `border-default`, `border-strong`, `border-subtle`    |
| `surface.*`| `surface-raised`, `surface-sunken`, `surface-gray`    |
| `status.*` | `status-success`, `status-danger`, `status-warning`   |

### Components

- **Single-file components** with `<script setup lang="ts">`.
- **Props are typed**, never use `defineProps()` without a type.
- **Don't use `any`.** If you reach for `any`, the type model is probably wrong;
  the only `any` in the sample is in `useModal`'s payload, which is documented.
- **Prefer composition over prop drilling.** Modals read their payload from
  `useModal()`, not from parent props.
- **One responsibility per file.** If a component starts juggling more than one
  domain concept, split it.

### Modals

The pattern is:

1. A `BaseModal` instance with a unique `name` is mounted somewhere in the tree
   (in this sample they're all in `LobbyPage.vue` for simplicity).
2. To open it, call `useModal().open('messageName', { ...payload })`.
3. The modal reads its payload reactively from `useModal().state.payload`.
4. To close, call `useModal().close()` or hit Escape / click backdrop.

`MessageModal.vue` is the canonical reference. Copy it when building new modals.

### Stubs

Eight modals in `components/lobby/modals/` are stubs that render a "not implemented"
body but are wired to the right action buttons. See
`components/lobby/modals/_STUB_README.md` for how to replace them — each stub has
a comment pointing to the corresponding section in `lobby.html`.

---

## What to review

The intent of this sample is to lock in conventions before the rest of the app is
converted. Specifically, please confirm:

1. **Folder layout** — happy with `base/` vs `layout/` vs `lobby/` split?
2. **Design tokens** — extracted the right things from the prototype? Anything
   missing or named wrong?
3. **Modal pattern** — does the `useModal` registry work for you, or would you
   rather see Pinia / props-down / something else?
4. **TypeScript strictness** — `tsconfig.app.json` has every strict flag on.
   Anything you want loosened?
5. **Stub strategy** — comfortable with the "stub + comment pointer" approach,
   or should every modal be fully built before any commit lands?

Once you sign off, I'll convert the remaining pages using these same conventions.

---

## Mapping back to the prototype

| Vue file                  | HTML source                          |
| ------------------------- | ------------------------------------ |
| `LobbyPage.vue`           | `Employer-Dashboard/lobby.html`      |
| `TopBar.vue`              | `lobby.html` topbar block (~line 841)|
| `EventHeader.vue`         | `lobby.html` ~line 869               |
| `Tabs.vue` + `*Panel.vue` | `lobby.html` ~lines 905–1700         |
| `MessageModal.vue`        | `lobby.html` ~line 2772              |
| `ResumeModal.vue`         | `lobby.html` ~line 2794              |
| `DeclineModal.vue`        | `lobby.html` ~line 2820              |

The prototype's dev mode toggle (`setLobbyMode()`) is reproduced as the
`DevModeToggle.vue` floating control in the bottom right corner.
