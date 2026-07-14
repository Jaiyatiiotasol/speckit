# Data Model: Task List App

**Feature**: `001-task-list-app` | **Date**: 2026-07-13

---

## Entities

### Task

The core domain object. Represents a single unit of work.

| Field | Type | Constraints | Source |
|-------|------|-------------|--------|
| `id` | `string` | Required; unique; generated on creation (UUID v4 or `crypto.randomUUID()`) | FR-001, Key Entities |
| `title` | `string` | Required; 1–200 chars (trimmed); non-whitespace-only | FR-001, FR-002, FR-003 |
| `completed` | `boolean` | Required; default `false` | FR-004, Key Entities |
| `createdAt` | `number` | Required; Unix timestamp (ms) set on creation; immutable | FR-017, Key Entities |

**TypeScript interface** (`src/app/features/tasks/models/task.model.ts`):

```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}
```

**Uniqueness rule**: `id` must be globally unique within the task list. No two tasks may share an `id`.

**State transitions**:

```
incomplete (completed: false)
       │
       │  toggleComplete()
       ▼
completed (completed: true)
       │
       │  toggleComplete()
       ▼
incomplete (completed: false)
```

Tasks are created as `incomplete`. They move freely between `incomplete` and `completed` via `toggleComplete()`. Deletion removes the task from the list entirely (terminal state).

---

### FilterType

A discriminated union controlling which tasks are visible in the list.

```typescript
export type FilterType = 'all' | 'active' | 'completed';
```

| Value | Meaning | Tasks shown |
|-------|---------|-------------|
| `'all'` | Show all tasks (default) | All tasks regardless of completion |
| `'active'` | Show only incomplete tasks | `task.completed === false` |
| `'completed'` | Show only completed tasks | `task.completed === true` |

**Default value**: `'all'` — applied on app load; not persisted to localStorage.

---

### TaskCount (derived, not persisted)

A derived value computed from the full task list. Never stored; always recomputed.

```
remainingCount = tasks.filter(t => !t.completed).length
```

- Always reflects the **full** task list, regardless of active filter (FR-013).
- Displays as `"1 task left"` (singular) or `"N tasks left"` (plural, including 0).

---

## Persistence Schema

Tasks are serialized to `localStorage` under the key `tasks-app:tasks`.

**Stored value**: JSON array of `Task` objects.

```json
[
  {
    "id": "a3f1e2d4-...",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": 1720876800000
  },
  {
    "id": "b9c2f3e5-...",
    "title": "Write tests",
    "completed": true,
    "createdAt": 1720876750000
  }
]
```

**Write trigger**: On every mutation to the `tasks` signal (via `effect()`).

**Read trigger**: Once on `TaskService` initialization.

**Error handling**:
- Write failure (quota exceeded): Caught silently; in-memory state is unaffected.
- Read failure (corrupt JSON): Caught; app starts with empty task list.

---

## Validation Rules

| Rule | Applies to | Spec ref |
|------|-----------|----------|
| Title must not be empty | `addTask()`, `updateTaskTitle()` | FR-002 |
| Title must not be whitespace-only | `addTask()`, `updateTaskTitle()` | FR-002 |
| Title max 200 characters | `addTask()` (form validator), `updateTaskTitle()` | FR-003 |
| `id` must be unique | `addTask()` | Key Entities |
| Updating title to empty/whitespace → delete task | `updateTaskTitle()` | FR-006, Assumption |

---

## Service Operations

`TaskService` exposes the following signal-producing operations. This is the **interface contract** between the service and components.

| Method | Signature | Effect |
|--------|-----------|--------|
| `addTask` | `(title: string): void` | Prepends new Task (newest-first); writes to localStorage |
| `toggleComplete` | `(id: string): void` | Flips `completed`; writes to localStorage |
| `updateTaskTitle` | `(id: string, newTitle: string): void` | Updates title or deletes if empty; writes to localStorage |
| `deleteTask` | `(id: string): void` | Removes task by id; writes to localStorage |
| `setFilter` | `(filter: FilterType): void` | Updates `filter` signal (in-memory only) |
| `tasks` | `Signal<Task[]>` | Read-only signal of full task list |
| `filter` | `Signal<FilterType>` | Read-only signal of active filter |
| `filteredTasks` | `Signal<Task[]>` | Computed: tasks filtered by current filter |
| `remainingCount` | `Signal<number>` | Computed: count of incomplete tasks |
