# Implementation Plan: Task List App

**Branch**: `001-task-list-app` | **Date**: 2026-07-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-task-list-app/spec.md`

## Summary

Build a browser-only Angular 18+ task list application where users can add, complete, edit, and delete tasks. All state is managed with Angular Signals; tasks are persisted to `localStorage`. The UI supports filtering by All / Active / Completed and always shows the count of remaining incomplete tasks. No backend, no NgRx, no UI libraries.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Angular 18+

**Primary Dependencies**: `@angular/core` (signals, standalone), `@angular/forms` (ReactiveFormsModule), `@angular/common` — no third-party UI libraries

**Storage**: Browser `localStorage` — serialized as JSON under a single key (`tasks-app:tasks`)

**Testing**: Jasmine + Karma (Angular CLI defaults) — one `*.spec.ts` per source file

**Target Platform**: Desktop-first modern browser (Chrome, Firefox, Edge, Safari)

**Project Type**: Single-page Angular web application (no routing needed — single view)

**Performance Goals**: Instant filter switching; no perceived lag with 100+ tasks

**Constraints**: No NgModules; `ChangeDetectionStrategy.OnPush` everywhere; `inject()` over constructor injection; no `any` type; no external UI libraries

**Scale/Scope**: Single user, single browser; ~100 tasks typical; localStorage ≈ 5 MB ceiling is sufficient

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement (from constitution.md) | Status |
|------|------------------------------------|--------|
| Standalone components | `standalone: true` on every component; no NgModules | ✅ PASS — design uses only standalone components |
| Signals-only state | `signal()`, `computed()`, `effect()` only; no NgRx | ✅ PASS — TaskService uses signals; no observables for state |
| Reactive Forms | `FormBuilder` / `FormGroup` only; no `ngModel` | ✅ PASS — add-task form uses `FormBuilder` with `Validators` |
| Test coverage | Every component/service gets a `*.spec.ts` | ✅ PASS — each file in plan has a matching spec file |
| Dependency discipline | No UI libraries unless explicitly requested | ✅ PASS — zero third-party UI libs |
| `ChangeDetectionStrategy.OnPush` | All components | ✅ PASS — all components in design use `OnPush` |
| `inject()` function | Over constructor injection | ✅ PASS — all services injected via `inject()` |
| No `any` type | Explicit interfaces/types only | ✅ PASS — `Task`, `FilterType` interfaces defined |

**Constitution Check result: ALL GATES PASS ✅** — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-task-list-app/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── ui-contract.md   ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── task.service.ts          # Signal-based task state + localStorage sync
│   │       └── task.service.spec.ts
│   ├── features/
│   │   └── tasks/
│   │       ├── components/
│   │       │   ├── task-list/
│   │       │   │   ├── task-list.component.ts
│   │       │   │   ├── task-list.component.html
│   │       │   │   ├── task-list.component.scss
│   │       │   │   └── task-list.component.spec.ts
│   │       │   ├── task-item/
│   │       │   │   ├── task-item.component.ts
│   │       │   │   ├── task-item.component.html
│   │       │   │   ├── task-item.component.scss
│   │       │   │   └── task-item.component.spec.ts
│   │       │   ├── add-task/
│   │       │   │   ├── add-task.component.ts
│   │       │   │   ├── add-task.component.html
│   │       │   │   ├── add-task.component.scss
│   │       │   │   └── add-task.component.spec.ts
│   │       │   └── task-footer/
│   │       │       ├── task-footer.component.ts
│   │       │       ├── task-footer.component.html
│   │       │       ├── task-footer.component.scss
│   │       │       └── task-footer.component.spec.ts
│   │       └── models/
│   │           └── task.model.ts        # Task interface + FilterType
│   ├── app.component.ts                 # Root standalone component
│   ├── app.component.html
│   ├── app.component.scss
│   └── app.component.spec.ts
├── styles.scss                          # Global tokens, resets
└── main.ts                              # bootstrapApplication()
```

**Structure Decision**: Single-project Angular app using feature-based folder layout. All task logic lives in `features/tasks/`. Singleton state service lives in `core/services/`. No routing module needed — single view.

## Complexity Tracking

No constitution violations. No complexity justification required.
