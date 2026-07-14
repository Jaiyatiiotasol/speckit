# UI Contract: Task List App

**Feature**: `001-task-list-app` | **Date**: 2026-07-13

This document defines the public contract for each Angular component: its inputs, outputs, and observable behaviours. It is the interface specification that tests and consumers must honour.

---

## AppComponent

**Role**: Root shell. Composes all feature components. No business logic.

**Selector**: `app-root`

**Imports (standalone)**: `AddTaskComponent`, `TaskListComponent`, `TaskFooterComponent`

**Inputs**: none  
**Outputs**: none

**Rendered structure** (logical):
```
<app-root>
  <app-add-task />
  <app-task-list />
  <app-task-footer />   ← hidden when task list is empty
</app-root>
```

---

## AddTaskComponent

**Role**: Reactive form for entering and submitting a new task title.

**Selector**: `app-add-task`

**Inputs**: none  
**Outputs**: none (calls `TaskService.addTask()` directly via `inject()`)

**Form control**: `titleControl: FormControl<string>`
- Validators: `Validators.required`, `Validators.maxLength(200)`, custom non-whitespace validator
- Reset to empty string after successful submit

**Behaviours**:
| Trigger | Condition | Outcome |
|---------|-----------|---------|
| Form submit | `titleControl` valid | `TaskService.addTask(trimmedValue)` called; control reset |
| Form submit | `titleControl` invalid | No task created; validation error message shown |
| Input value | > 200 chars | Input rejects or truncates at 200 chars; error shown |

**Error messages shown**:
- `required` / empty: `"Title is required"`
- `whitespace`: `"Title cannot be blank"`
- `maxlength`: `"Title must be 200 characters or fewer"`

---

## TaskListComponent

**Role**: Renders the filtered list of tasks. Shows empty-state message when no tasks match the active filter.

**Selector**: `app-task-list`

**Inputs**: none (reads `TaskService.filteredTasks()` via `inject()`)  
**Outputs**: none

**Behaviours**:
| Condition | Outcome |
|-----------|---------|
| `filteredTasks()` has items | Renders one `<app-task-item>` per task, in array order (newest-first) |
| `filteredTasks()` is empty | Renders empty-state message (e.g., "No tasks here!") |
| Filter is `'active'` and last visible task is completed | List switches to empty-state immediately |

**Child component binding**:
```
@for (task of filteredTasks(); track task.id) {
  <app-task-item [task]="task" />
}
```

---

## TaskItemComponent

**Role**: Displays a single task row with completion toggle, title (or inline edit field), pencil icon, and delete button.

**Selector**: `app-task-item`

**Inputs**:
| Input | Type | Description |
|-------|------|-------------|
| `task` | `input<Task>()` | The task to display |

**Outputs**: none (calls `TaskService` methods directly via `inject()`)

**Local state**:
| Signal | Type | Default | Description |
|--------|------|---------|-------------|
| `isEditing` | `signal<boolean>` | `false` | Whether the inline edit field is open |
| `editValue` | `signal<string>` | `''` | Current value of the inline edit input |

**Behaviours**:
| Trigger | Condition | Outcome |
|---------|-----------|---------|
| Checkbox click | any | `TaskService.toggleComplete(task.id)` |
| Pencil icon click | `isEditing() === false` | `isEditing.set(true)`; `editValue.set(task.title)` |
| Edit input: Enter key | `isEditing() === true` | Call `saveEdit()` |
| Edit input: blur | `isEditing() === true` | Call `saveEdit()` |
| Edit input: Escape key | `isEditing() === true` | `isEditing.set(false)` — no save |
| `saveEdit()` | `editValue().trim()` is non-empty | `TaskService.updateTaskTitle(id, trimmedValue)`; `isEditing.set(false)` |
| `saveEdit()` | `editValue().trim()` is empty | `TaskService.deleteTask(id)` |
| Delete button click | any | `TaskService.deleteTask(task.id)` |

**Visual states**:
| State | Visual |
|-------|--------|
| `task.completed === true` | Title has `class="completed"` (strikethrough + muted color) |
| `isEditing() === true` | Title hidden; `<input>` shown pre-filled with `editValue()` |
| Hover (desktop) | Delete button and pencil icon become visible |

---

## TaskFooterComponent

**Role**: Displays remaining-task count and All / Active / Completed filter buttons.

**Selector**: `app-task-footer`

**Inputs**: none (reads `TaskService` signals via `inject()`)  
**Outputs**: none (calls `TaskService.setFilter()` directly)

**Behaviours**:
| Element | Trigger | Outcome |
|---------|---------|---------|
| Count label | `remainingCount()` changes | Re-renders count with correct singular/plural: `"1 task left"` / `"N tasks left"` |
| "All" button | click | `TaskService.setFilter('all')` |
| "Active" button | click | `TaskService.setFilter('active')` |
| "Completed" button | click | `TaskService.setFilter('completed')` |
| Active filter button | `filter() === buttonValue` | Button receives `class="active"` for visual indication |

**Visibility**: `TaskFooterComponent` is always rendered; internal count/buttons are always displayed. (The `AppComponent` may optionally hide the entire footer when `tasks().length === 0` — implementation detail.)

---

## TaskService (Injectable)

**Role**: Singleton signal store for all task state and localStorage sync.

**Provided in**: `root`

**Public API** — see [data-model.md](data-model.md#service-operations) for full method signatures.

**Behaviour guarantees**:
- `remainingCount()` is always computed from the **full** `tasks()` array, not `filteredTasks()`.
- `filteredTasks()` updates synchronously when either `tasks` or `filter` signal changes.
- Every mutating method persists the updated `tasks` signal to `localStorage` before returning.
- On initialization, tasks are loaded from `localStorage`; failures fall back to `[]`.
