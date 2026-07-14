# Tasks: Task List App

**Input**: Design documents from `specs/001-task-list-app/`

**Prerequisites**: [plan.md](plan.md) · [spec.md](spec.md) · [research.md](research.md) · [data-model.md](data-model.md) · [contracts/ui-contract.md](contracts/ui-contract.md) · [quickstart.md](quickstart.md)

**Tests**: Included — the constitution mandates a `*.spec.ts` for every component and service. Tests are not optional.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on in-progress tasks)
- **[Story]**: User story this task belongs to (US1–US6)
- All file paths are relative to the Angular project root (where `package.json` lives)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold the Angular 18+ project and establish the global foundation.

- [x] T001 Scaffold Angular 18+ app: `ng new task-list-app --standalone --style=scss --skip-tests=false` in the repo root
- [x] T002 Remove auto-generated boilerplate from `src/app/app.component.html` (keep only `<router-outlet>`-free shell)
- [x] T003 [P] Configure `tsconfig.json` to enable strict mode (`"strict": true`)
- [x] T004 [P] Set up global SCSS tokens and reset in `src/styles.scss` (color palette, typography, spacing variables)
- [x] T005 Create feature folder structure per plan.md: `src/app/core/services/`, `src/app/features/tasks/components/`, `src/app/features/tasks/models/`

**Checkpoint**: Angular project runs (`ng serve`) with no errors and a blank shell.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared data model and singleton service. Every user story depends on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Create `Task` interface and `FilterType` union in `src/app/features/tasks/models/task.model.ts`
- [x] T007 Create `TaskService` skeleton in `src/app/core/services/task.service.ts` — `providedIn: 'root'`, `ChangeDetectionStrategy` not applicable (service), `inject()` only, all signal fields declared: `tasks`, `filter`, `filteredTasks`, `remainingCount` (bodies stubbed/throwing)
- [x] T008 Create `src/app/core/services/task.service.spec.ts` — scaffold describes for: service creation, `addTask`, `toggleComplete`, `updateTaskTitle`, `deleteTask`, `setFilter`, `filteredTasks computed`, `remainingCount computed`, localStorage init, localStorage write, localStorage error fallback

**Checkpoint**: `ng test` compiles and runs — all specs in T008 are defined (most will fail until implementations land).

---

## Phase 3: User Story 1 — Add and View Tasks (Priority: P1) 🎯 MVP

**Goal**: User can type a task title into a form and submit it; the task appears at the top of the list with a correct remaining-count.

**Independent Test**: Open app → type a title → submit → task appears at top → counter reads "1 task left". Run `ng test` → all US1 specs pass.

### Implementation

- [x] T009 [US1] Implement `TaskService.addTask(title: string)` in `src/app/core/services/task.service.ts` — prepend new `Task` (with `crypto.randomUUID()`, `Date.now()` timestamp, `completed: false`) to `tasks` signal; trim title
- [x] T010 [US1] Implement `TaskService.remainingCount` computed signal in `src/app/core/services/task.service.ts` — `tasks().filter(t => !t.completed).length`
- [x] T011 [P] [US1] Create `AddTaskComponent` in `src/app/features/tasks/components/add-task/add-task.component.ts` — `standalone: true`, `OnPush`, `inject(TaskService)`, `ReactiveFormsModule`, `FormBuilder`, `Validators.required` + `maxLength(200)` + custom non-whitespace validator; on valid submit call `addTask()` then reset
- [x] T012 [P] [US1] Create `add-task.component.html` — labelled input bound to `titleControl`, submit button, validation error messages for required/whitespace/maxlength
- [x] T013 [P] [US1] Create `add-task.component.scss` — style the form input and submit button
- [x] T014 [P] [US1] Create `TaskListComponent` skeleton in `src/app/features/tasks/components/task-list/task-list.component.ts` — `standalone: true`, `OnPush`, `inject(TaskService)`, renders `filteredTasks()` with `@for … track task.id`; shows empty-state message when list is empty
- [x] T015 [P] [US1] Create `task-list.component.html` — `@for` loop over `filteredTasks()`, empty-state `<p>` shown via `@if`
- [x] T016 [P] [US1] Create `task-list.component.scss` — list container styles
- [x] T017 [US1] Create `TaskItemComponent` skeleton in `src/app/features/tasks/components/task-item/task-item.component.ts` — `standalone: true`, `OnPush`, `input<Task>()` signal input, `inject(TaskService)`, renders title only (full behaviour in later phases)
- [x] T018 [US1] Create `task-item.component.html` — display task title span
- [x] T019 [US1] Create `task-item.component.scss` — task row base styles
- [x] T020 [US1] Wire `AppComponent` in `src/app/app.component.ts` — `standalone: true`, `OnPush`, import `AddTaskComponent` and `TaskListComponent`; render both in `app.component.html`
- [x] T021 [US1] Write `src/app/core/services/task.service.spec.ts` US1 tests — `addTask` creates task with correct fields; prepends (newest-first); `remainingCount` reflects incomplete count; rejects empty/whitespace title
- [x] T022 [US1] Write `src/app/features/tasks/components/add-task/add-task.component.spec.ts` — component creates; form invalid on empty; valid on non-empty title ≤200 chars; `addTask` called on submit; form resets after submit; validation errors shown
- [x] T023 [US1] Write `src/app/features/tasks/components/task-list/task-list.component.spec.ts` — component creates; renders task items; empty-state shown when no tasks
- [x] T024 [US1] Write `src/app/features/tasks/components/task-item/task-item.component.spec.ts` — component creates; displays task title

**Checkpoint**: `ng serve` → add tasks → newest appears at top → counter updates. `ng test` → all US1 specs pass.

---

## Phase 4: User Story 2 — Complete and Uncheck Tasks (Priority: P1)

**Goal**: User can toggle a task between incomplete and complete; completed tasks are visually distinct; counter updates correctly.

**Independent Test**: Add a task → click checkbox → task shows strikethrough → counter decrements → click again → counter increments.

### Implementation

- [x] T025 [US2] Implement `TaskService.toggleComplete(id: string)` in `src/app/core/services/task.service.ts` — map `tasks()` flipping `completed` for matching id; update signal
- [x] T026 [US2] Add checkbox input to `task-item.component.html` — bound to `task().completed`; `(change)` calls `TaskService.toggleComplete(task().id)`
- [x] T027 [US2] Add completed visual state to `task-item.component.scss` — `.completed` class applies strikethrough and muted color
- [x] T028 [US2] Apply `[class.completed]="task().completed"` binding to title element in `task-item.component.html`
- [x] T029 [US2] Write US2 tests in `task.service.spec.ts` — `toggleComplete` flips completed; `remainingCount` decrements on complete; increments on uncheck; all completed → count = 0
- [x] T030 [US2] Write US2 tests in `task-item.component.spec.ts` — checkbox present; clicking calls `toggleComplete`; completed class applied when `task.completed = true`

**Checkpoint**: `ng test` → all US1 + US2 specs pass. Visual check: completed tasks show strikethrough.

---

## Phase 5: User Story 3 — Edit Task Title (Priority: P2)

**Goal**: User clicks the pencil icon to open an inline edit field; saves with Enter or blur; cancels with Escape; empty title deletes the task.

**Independent Test**: Add task → click pencil → change title → press Enter → new title shown. Click pencil → press Escape → original title restored. Click pencil → clear → Enter → task deleted.

### Implementation

- [x] T031 [US3] Implement `TaskService.updateTaskTitle(id: string, newTitle: string)` in `src/app/core/services/task.service.ts` — if trimmed newTitle is non-empty: update title; if empty: call `deleteTask(id)`
- [x] T032 [US3] Implement `TaskService.deleteTask(id: string)` in `src/app/core/services/task.service.ts` — filter task out of `tasks()` signal (needed by both US3 and US4; implement here)
- [x] T033 [US3] Add local edit signals to `TaskItemComponent` — `isEditing = signal(false)`, `editValue = signal('')`
- [x] T034 [US3] Add pencil icon button to `task-item.component.html` — shown when `!isEditing()`; `(click)` sets `isEditing(true)` and `editValue(task().title)`
- [x] T035 [US3] Add inline edit `<input>` to `task-item.component.html` — shown when `isEditing()`; bound to `editValue()`; `(keydown.enter)` → `saveEdit()`; `(blur)` → `saveEdit()`; `(keydown.escape)` → `isEditing.set(false)`
- [x] T036 [US3] Implement `saveEdit()` method in `task-item.component.ts` — trims `editValue()`; if non-empty calls `updateTaskTitle()`; sets `isEditing(false)`; if empty calls `deleteTask()`
- [x] T037 [US3] Hide title span when `isEditing()` in `task-item.component.html` (`@if (!isEditing())`)
- [x] T038 [US3] Style inline edit input in `task-item.component.scss`
- [x] T039 [US3] Write US3 tests in `task.service.spec.ts` — `updateTaskTitle` updates title; ignores whitespace-only; empty triggers delete
- [x] T040 [US3] Write US3 tests in `task-item.component.spec.ts` — pencil icon click shows input; Enter saves; blur saves; Escape cancels; empty title calls deleteTask

**Checkpoint**: `ng test` → all US1–US3 specs pass. Manual: inline edit works with all 3 gestures.

---

## Phase 6: User Story 4 — Delete Tasks (Priority: P2)

**Goal**: User can permanently delete any task via an explicit delete button; list and counter update immediately.

**Independent Test**: Add a task → hover → click delete button → task gone → counter updated.

### Implementation

- [x] T041 [US4] Add delete button to `task-item.component.html` — `(click)` calls `TaskService.deleteTask(task().id)` (service method already implemented in T032)
- [x] T042 [US4] Style delete button in `task-item.component.scss` — visible on hover, red/danger styling
- [x] T043 [US4] Write US4 tests in `task.service.spec.ts` — `deleteTask` removes task; incomplete task removal decrements `remainingCount`; completed task removal does not change `remainingCount`
- [x] T044 [US4] Write US4 tests in `task-item.component.spec.ts` — delete button present; clicking calls `deleteTask` with correct id

**Checkpoint**: `ng test` → all US1–US4 specs pass. Last task deleted → empty-state shown.

---

## Phase 7: User Story 5 — Filter Tasks by Status (Priority: P2)

**Goal**: Three filter buttons (All / Active / Completed) control which tasks are shown; active filter is visually highlighted; remaining-count is always global (not filtered).

**Independent Test**: Add 3 tasks, complete 1 → Active filter shows 2 → Completed shows 1 → All shows 3. Counter always shows global incomplete count regardless of filter.

### Implementation

- [x] T045 [US5] Implement `TaskService.setFilter(filter: FilterType)` in `src/app/core/services/task.service.ts`
- [x] T046 [US5] Implement `TaskService.filteredTasks` computed signal in `src/app/core/services/task.service.ts` — reads `tasks()` and `filter()`; returns filtered subset
- [x] T047 [US5] Create `TaskFooterComponent` in `src/app/features/tasks/components/task-footer/task-footer.component.ts` — `standalone: true`, `OnPush`, `inject(TaskService)`, renders remaining-count and 3 filter buttons
- [x] T048 [US5] Create `task-footer.component.html` — `<span>` with count text (singular/plural); 3 `<button>` elements for All / Active / Completed; `[class.active]` bound to current filter
- [x] T049 [US5] Create `task-footer.component.scss` — footer layout; active filter button highlight
- [x] T050 [US5] Add `TaskFooterComponent` to `AppComponent` imports and template in `src/app/app.component.ts` and `app.component.html`
- [x] T051 [US5] Write US5 tests in `task.service.spec.ts` — `setFilter` updates filter signal; `filteredTasks` returns all/active/completed subsets correctly; `remainingCount` is always global
- [x] T052 [US5] Write US5 tests in `task-footer.component.spec.ts` — component creates; count label uses correct singular/plural; each filter button calls `setFilter`; active button has active class
- [x] T053 [US5] Write US5 tests in `task-list.component.spec.ts` — list re-renders when `filteredTasks` signal changes; correct tasks shown per filter

**Checkpoint**: `ng test` → all US1–US5 specs pass. Filter buttons work; counter stays global.

---

## Phase 8: User Story 6 — Persist Tasks Across Sessions (Priority: P3)

**Goal**: Task list and completion states survive page refresh and browser restart via localStorage.

**Independent Test**: Add and complete tasks → hard-refresh → all tasks still present with correct state. Open DevTools → Application → localStorage → `tasks-app:tasks` key exists with correct JSON.

### Implementation

- [x] T054 [US6] Implement localStorage read on init in `TaskService` — in the `tasks` signal initializer, attempt `JSON.parse(localStorage.getItem('tasks-app:tasks') ?? '[]')`; catch errors and fall back to `[]`
- [x] T055 [US6] Implement localStorage write via `effect()` in `TaskService` — `effect(() => { try { localStorage.setItem('tasks-app:tasks', JSON.stringify(this.tasks())); } catch { /* quota/unavailable — silent */ } })`
- [x] T056 [US6] Write US6 tests in `task.service.spec.ts` — localStorage parsed on init; tasks loaded from stored JSON; invalid JSON falls back to []; `effect` writes to localStorage after every mutation; storage error is caught silently

**Checkpoint**: `ng test` → all US1–US6 specs pass. Hard-refresh preserves data. `tasks-app:tasks` key visible in DevTools.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: SCSS refinement, accessibility basics, and final validation.

- [x] T057 [P] Add `aria-label` attributes to icon buttons (pencil, delete) and checkbox in `task-item.component.html` for screen-reader accessibility
- [x] T058 [P] Add `id` attributes to all interactive elements in all component templates (required by constitution for browser testing)
- [x] T059 [P] Polish `src/styles.scss` — finalize CSS custom properties for consistent spacing, color, and typography across all components
- [x] T060 [P] Review all component SCSS for consistency; ensure hover states work on all interactive controls
- [x] T061 Run `ng build` to confirm production build is error-free
- [x] T062 Walk through all 15 scenarios in [quickstart.md](quickstart.md) against `ng serve` and confirm each passes
- [x] T063 [P] Update `src/app/app.component.html` title/meta tags for SEO (`<title>Task List</title>`, meta description)

**Checkpoint**: `ng test` all green. `ng build` succeeds. All quickstart scenarios pass manually.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user stories**
- **Phase 3 (US1 — Add/View)**: Depends on Phase 2
- **Phase 4 (US2 — Complete)**: Depends on Phase 3 (checkbox needs task-item from T017)
- **Phase 5 (US3 — Edit)**: Depends on Phase 4 (`deleteTask` used by both US3 and US4)
- **Phase 6 (US4 — Delete)**: Depends on Phase 5 (T032 `deleteTask` implemented in US3 phase)
- **Phase 7 (US5 — Filter)**: Depends on Phase 2 (service); can start after Phase 3 in parallel
- **Phase 8 (US6 — Persist)**: Depends on Phase 2 (service); can start after Phase 3 in parallel
- **Phase 9 (Polish)**: Depends on all prior phases complete

### User Story Dependencies

| Story | Depends on | Can run in parallel with |
|-------|-----------|--------------------------|
| US1 (Add/View) | Phase 2 | — |
| US2 (Complete) | US1 (task-item component exists) | — |
| US3 (Edit) | US2 (complete delete in US3 phase) | US5, US6 |
| US4 (Delete) | US3 (deleteTask implemented in T032) | US5, US6 |
| US5 (Filter) | Phase 2 (service) + US1 (task list renders) | US6 |
| US6 (Persist) | Phase 2 (service) | US5 |

### Within Each Phase

- Tasks marked `[P]` have no file conflicts and can run simultaneously
- Component `.ts` → `.html` → `.scss` within a story can often be parallelized
- Tests should be written alongside or immediately after implementation (not deferred)

---

## Parallel Execution Example: Phase 3 (US1)

```
# These can run in parallel (different files):
T011 → add-task.component.ts
T014 → task-list.component.ts
T017 → task-item.component.ts (skeleton)

# Sequential within add-task:
T011 (ts) → T012 (html) → T013 (scss)

# Tests written after each component is ready:
T022 → add-task.component.spec.ts
T023 → task-list.component.spec.ts
T024 → task-item.component.spec.ts
```

---

## Implementation Strategy

### MVP (User Story 1 only — ~Phase 1–3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (model + service skeleton)
3. Complete Phase 3: US1 (add + view tasks, counter)
4. **STOP AND VALIDATE**: `ng test` passes, `ng serve` — add tasks manually
5. Demo-able MVP: task entry + list display + counter

### Incremental Delivery

1. Setup + Foundational → project compiles
2. US1 → add and view tasks (MVP!)
3. US2 → complete/uncheck tasks
4. US3 + US4 → edit and delete tasks
5. US5 → filter by status
6. US6 → localStorage persistence
7. Polish → production-ready

### Solo Developer Order (Recommended)

Follow phases sequentially: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Each phase leaves the app in a shippable state.

---

## Notes

- `[P]` = safe to run in parallel (no shared file conflicts)
- `[USN]` = traceability back to user story N in spec.md
- Every `*.component.ts` and `*.service.ts` must have a matching `*.spec.ts` (constitution mandate)
- Use `crypto.randomUUID()` for task IDs (available in all modern browsers)
- Use `ChangeDetectionStrategy.OnPush` on all components (constitution mandate)
- Use `inject()` function — never constructor parameter injection (constitution mandate)
- Use signal `input<Task>()` for component inputs — not `@Input()` decorator
- Commit after each checkpoint to have clean rollback points
