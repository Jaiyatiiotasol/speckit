# Research: Task List App

**Feature**: `001-task-list-app` | **Date**: 2026-07-13

This document resolves all technical decisions needed before implementation begins.

---

## Decision 1: Angular Architecture Pattern

**Decision**: Standalone components with signal-based services (no NgModules, no NgRx)

**Rationale**: Angular 18+ recommends standalone by default. Signals (`signal`, `computed`, `effect`) are the idiomatic reactive primitive replacing RxJS-heavy patterns for local/shared state in Angular 18+. The constitution mandates this pattern explicitly.

**Alternatives considered**:
- NgModules: Rejected — prohibited by constitution.
- NgRx / NgRx Signal Store: Rejected — constitution forbids NgRx; overkill for a single-feature app.
- BehaviorSubject services: Rejected — signals are preferred; constitution forbids BehaviorSubject-based state stores.

---

## Decision 2: State Service Design

**Decision**: A single `TaskService` in `core/services/` using `signal<Task[]>([])` as the source of truth. All derived state (`filteredTasks`, `remainingCount`) is expressed as `computed()` signals. The active filter is a `signal<FilterType>('all')` on the service.

**Rationale**: A single source-of-truth signal is the simplest correct design. Derived values as `computed()` keep the signal graph acyclic and automatically memoized. The service is provided at root via `providedIn: 'root'` so it is a singleton, accessible to all components via `inject()`.

**Key signals**:
```
tasks = signal<Task[]>([])           // source of truth
filter = signal<FilterType>('all')   // active filter selection
filteredTasks = computed(...)        // tasks visible to the user
remainingCount = computed(...)       // count of incomplete tasks (all, not filtered)
```

**Alternatives considered**:
- Per-component state: Rejected — filter and task list must be shared.
- RxJS Subject: Rejected — constitution prohibits.

---

## Decision 3: localStorage Sync Strategy

**Decision**: An `effect()` on `tasks` signal writes the serialized task list to `localStorage` on every change. On service initialization (`constructor` / field initializer), the stored JSON is read and parsed into the initial signal value. A single key `tasks-app:tasks` is used.

**Rationale**: `effect()` is the correct Angular idiom for synchronizing signal state with side-effecting systems (localStorage). This avoids manual subscription management and keeps the sync declarative. Parsing on init ensures tasks survive page refresh / tab close (FR-014, SC-003).

**Error handling**: `try/catch` wraps both the `localStorage.setItem` call (storage quota) and the `JSON.parse` on init (corrupt data). On error, the app falls back to an empty task list without crashing (edge case from spec).

**Alternatives considered**:
- Calling `localStorage.setItem` inside each mutating method: Rejected — repetitive, error-prone.
- `IndexedDB`: Rejected — overkill for string task titles; localStorage is sufficient.
- `sessionStorage`: Rejected — cleared on tab close; violates US-6 and SC-003.

---

## Decision 4: Edit UX Implementation

**Decision**: Each `TaskItemComponent` exposes a `pencil` icon button. Clicking it sets a local `isEditing = signal(false)` to `true`, revealing an inline `<input>` pre-filled with the current title. The input listens for:
- `(keydown.enter)` → save
- `(blur)` → save
- `(keydown.escape)` → cancel

Save logic: if trimmed value is non-empty → update title; if empty → delete task. Cancel: restore original title, set `isEditing` to `false`.

**Rationale**: Matches spec FR-005, FR-006, FR-007 and clarification Q2 exactly. The local `isEditing` signal is component-scoped — no need to lift it to the service.

**Alternatives considered**:
- Double-click activation: Rejected — user selected Option B (explicit pencil icon) in clarification.
- A separate edit modal: Rejected — spec says inline.

---

## Decision 5: Form for Adding Tasks

**Decision**: `AddTaskComponent` uses `ReactiveFormsModule` with a `FormBuilder`-created `FormGroup` containing one `FormControl('', [Validators.required, Validators.maxLength(200)])`. The whitespace-only case is handled by a custom `Validators.pattern(/\S/)` or a custom validator. On valid submit, the control value is trimmed and passed to `TaskService.addTask()`. The control is reset after submission.

**Rationale**: Constitution mandates Reactive Forms. `Validators.required` + `maxLength(200)` + a whitespace validator covers FR-001, FR-002, FR-003. Template-driven `ngModel` is prohibited.

**Alternatives considered**:
- Template-driven form: Rejected — prohibited by constitution.
- Uncontrolled input with event handler: Rejected — no validation framework.

---

## Decision 6: Task Ordering

**Decision**: Tasks are stored in the `tasks` signal array in newest-first order. `addTask()` prepends new tasks to the front of the array (`[newTask, ...current]`). No sort is needed at render time.

**Rationale**: Prepending is O(1) for a signal array and maintains newest-first order (clarification Q1) without sorting overhead. Avoids the need for a separate `createdAt` sort on every render.

**Note**: The `createdAt` timestamp is still stored on the Task object for data integrity and potential future sorting needs.

---

## Decision 7: Filter Implementation

**Decision**: The `filter` signal on `TaskService` holds a `FilterType` value (`'all' | 'active' | 'completed'`). `filteredTasks` is a `computed()` that reads both `tasks` and `filter`. `TaskFooterComponent` calls `TaskService.setFilter(f)` on button click. No route-based filtering is used.

**Rationale**: Filter state is in-memory only (spec says "persists as long as the session is open" — not across refreshes). A `computed()` signal is the correct Angular idiom for derived view state. Route-based filtering would add unnecessary router dependency.

**Alternatives considered**:
- Persisting filter to localStorage: Rejected — spec does not require it, and it adds complexity.
- Route params: Rejected — overkill for a single-view app; no Angular Router needed.

---

## Decision 8: Change Detection

**Decision**: All components use `ChangeDetectionStrategy.OnPush`. Signal-based templates automatically mark the view dirty when a signal they read changes, making OnPush safe and correct with zero extra work.

**Rationale**: Constitution mandates OnPush. Angular 18 signal integration handles dirty-marking automatically — no `markForCheck()` calls needed.
