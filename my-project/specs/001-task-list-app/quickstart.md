# Quickstart Validation Guide: Task List App

**Feature**: `001-task-list-app` | **Date**: 2026-07-13

This guide documents how to set up, run, and validate the task list app end-to-end. It proves the feature works against the acceptance scenarios in [spec.md](spec.md).

---

## Prerequisites

- Node.js 20+ and npm installed
- Angular CLI 18+ (`npm install -g @angular/cli`)

---

## Setup

```bash
# From the project root (where package.json will live after scaffolding)
npm install
```

---

## Running the App

```bash
ng serve
# App available at http://localhost:4200
```

---

## Running Unit Tests

```bash
ng test
# Karma launches; all *.spec.ts files are executed
# Expected: all tests pass with 0 failures
```

---

## Validation Scenarios

Work through these scenarios in order against the running app at `http://localhost:4200`.

### S-01 · Add a task (US-1 / FR-001)

1. Open the app — the input field is focused.
2. Type `"Buy groceries"` and press Enter (or click the submit button).
3. ✅ `"Buy groceries"` appears at the top of the list.
4. ✅ Counter reads `"1 task left"`.

### S-02 · Newest task appears at top (FR-017)

1. (Continuing from S-01) Type `"Write tests"` and submit.
2. ✅ `"Write tests"` appears **above** `"Buy groceries"`.
3. ✅ Counter reads `"2 tasks left"`.

### S-03 · Reject empty / whitespace title (FR-002)

1. Clear the input and press Enter.
2. ✅ No task is added; a validation message is shown (e.g., `"Title is required"`).
3. Type `"   "` (spaces only) and press Enter.
4. ✅ No task is added; validation message shown.

### S-04 · Complete a task (US-2 / FR-004, FR-015)

1. Click the checkbox next to `"Buy groceries"`.
2. ✅ `"Buy groceries"` is visually marked complete (strikethrough / muted color).
3. ✅ Counter reads `"1 task left"`.

### S-05 · Uncheck a completed task (US-2)

1. Click the checkbox on `"Buy groceries"` again.
2. ✅ `"Buy groceries"` returns to incomplete state.
3. ✅ Counter reads `"2 tasks left"`.

### S-06 · Edit a task title via pencil icon (US-3 / FR-005, FR-006)

1. Hover over `"Write tests"` and click the pencil icon.
2. ✅ An inline text field appears, pre-filled with `"Write tests"`.
3. Change the text to `"Write unit tests"` and press Enter.
4. ✅ The task now shows `"Write unit tests"`.
5. ✅ No new task was created.

### S-07 · Edit confirmed by blur (FR-006)

1. Click the pencil icon on any task.
2. Change the text to `"Updated title"` and click outside the input.
3. ✅ The updated title is saved.

### S-08 · Cancel edit with Escape (FR-007)

1. Click the pencil icon on any task.
2. Change the text to `"Should not save"` and press Escape.
3. ✅ The original title is restored; the edit field closes.

### S-09 · Delete a task (US-4 / FR-008)

1. Hover over `"Buy groceries"` and click the delete (×) button.
2. ✅ `"Buy groceries"` is removed from the list.
3. ✅ Counter decrements accordingly.

### S-10 · Empty-state message (FR-016)

1. Delete all remaining tasks.
2. ✅ An empty-state message is shown (e.g., `"No tasks here!"`).
3. ✅ Counter reads `"0 tasks left"`.

### S-11 · Filter — Active (US-5 / FR-011, FR-012, FR-013)

1. Add three tasks: `"Task A"`, `"Task B"`, `"Task C"`.
2. Complete `"Task B"`.
3. Click `"Active"` filter.
4. ✅ Only `"Task A"` and `"Task C"` are shown.
5. ✅ Counter reads `"2 tasks left"` (not 1 — all-tasks count).
6. ✅ `"Active"` button is visually highlighted.

### S-12 · Filter — Completed (FR-011)

1. (Continuing from S-11) Click `"Completed"` filter.
2. ✅ Only `"Task B"` is shown.

### S-13 · Filter — All (FR-011)

1. Click `"All"` filter.
2. ✅ All three tasks are shown.

### S-14 · Persistence across refresh (US-6 / FR-014 / SC-003)

1. Add tasks and mark some complete.
2. Hard-refresh the page (`Ctrl+Shift+R` / `Cmd+Shift+R`).
3. ✅ All tasks reappear with their original titles and completion states.
4. Close the browser tab and reopen `http://localhost:4200`.
5. ✅ Tasks are still present.

### S-15 · localStorage storage key (FR-014)

1. Open DevTools → Application → Local Storage → `http://localhost:4200`.
2. ✅ Key `tasks-app:tasks` exists and contains a JSON array of task objects.

---

## References

- Data model & service API: [data-model.md](data-model.md)
- Component contracts: [contracts/ui-contract.md](contracts/ui-contract.md)
- Functional requirements: [spec.md](spec.md#functional-requirements)
