# Feature Specification: Task List App

**Feature Branch**: `001-task-list-app`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "Build a task list app. Users can add a task with a title, mark it complete, edit the title, and delete it. Tasks persist in the browser (no backend). Show a count of remaining incomplete tasks. Allow filtering by All / Active / Completed."

## Clarifications

### Session 2026-07-13

- Q: In what order should tasks appear in the list? → A: Newest first — most recently added task appears at the top of the list.
- Q: How does a user activate edit mode and confirm a task title edit? → A: Click an explicit pencil icon/button to activate; press Enter or click away (blur) to confirm.
- Q: Which browser storage mechanism should be used for task persistence? → A: localStorage — persists indefinitely across tab sessions and browser restarts.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add and View Tasks (Priority: P1)

A user opens the app and can immediately start adding tasks. They type a title into an input field and submit the form to create a new task. The task appears in a list below the input. The count of remaining incomplete tasks updates to reflect the new addition.

**Why this priority**: Adding tasks is the core action the entire app is built around. Without it nothing else has meaning.

**Independent Test**: Can be fully tested by loading the app, submitting one task title, and verifying the task appears in the list with the incomplete-task counter incrementing by one.

**Acceptance Scenarios**:

1. **Given** the app is open with an empty list, **When** the user types a title and submits, **Then** the task appears in the list and the remaining-count reads "1 task left".
2. **Given** one task already exists, **When** the user adds a second task, **Then** the new task appears at the top of the list and the remaining-count reads "2 tasks left".
3. **Given** the user submits an empty or whitespace-only title, **When** the form is submitted, **Then** no task is created and the input shows a validation error.

---

### User Story 2 - Complete and Uncheck Tasks (Priority: P1)

A user can mark any task as complete by clicking a toggle control next to it. Completed tasks are visually distinguished (e.g., strikethrough text). The remaining-task count decreases when a task is marked complete and increases when it is unchecked.

**Why this priority**: Task completion is the fundamental value of a task manager — it is inseparable from adding tasks in user mental model.

**Independent Test**: Can be fully tested by adding a task, marking it complete, verifying the visual change and counter decrement, then unchecking it and verifying the counter increments again.

**Acceptance Scenarios**:

1. **Given** an incomplete task exists, **When** the user clicks its completion toggle, **Then** the task is visually marked complete and the remaining-count decreases by one.
2. **Given** a completed task exists, **When** the user clicks its completion toggle again, **Then** the task returns to incomplete state and the remaining-count increases by one.
3. **Given** all tasks are completed, **Then** the remaining-count reads "0 tasks left".

---

### User Story 3 - Edit Task Title (Priority: P2)

A user can edit the title of any task by clicking the pencil icon that appears on the task row. This opens an inline text field pre-filled with the current title. The user modifies the text and saves by pressing Enter or by clicking anywhere outside the input (blur). They can abandon the edit at any time by pressing Escape, which restores the original title.

**Why this priority**: Editing corrects mistakes without requiring delete-and-recreate, which improves usability significantly.

**Independent Test**: Can be fully tested by adding a task, clicking its pencil icon, typing a new title, pressing Enter, and verifying the new title is shown.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user clicks the pencil icon and changes the title then presses Enter, **Then** the updated title is displayed and the inline field closes.
2. **Given** a task exists, **When** the user clicks the pencil icon, changes the title, and clicks outside the input, **Then** the updated title is saved and the inline field closes.
3. **Given** the user is in edit mode, **When** they clear the title and press Enter (or click away), **Then** the task is deleted.
4. **Given** the user is in edit mode, **When** they press Escape, **Then** the original title is restored and edit mode closes without saving changes.

---

### User Story 4 - Delete Tasks (Priority: P2)

A user can permanently delete any task. A delete control (e.g., a button that appears on hover) removes the task from the list immediately. The remaining-count updates accordingly.

**Why this priority**: Deletion removes unwanted tasks and keeps the list clean; it is a standard CRUD expectation.

**Independent Test**: Can be fully tested by adding a task then deleting it and verifying it no longer appears in the list and the counter updates.

**Acceptance Scenarios**:

1. **Given** an incomplete task exists, **When** the user deletes it, **Then** the task is removed from the list and the remaining-count decreases by one.
2. **Given** a completed task exists, **When** the user deletes it, **Then** the task is removed from the list and the remaining-count is unaffected.
3. **Given** the last task is deleted, **Then** the list is empty and an empty-state message is shown.

---

### User Story 5 - Filter Tasks by Status (Priority: P2)

A user can filter the task list to show only All tasks, only Active (incomplete) tasks, or only Completed tasks. The filter selection persists as long as the session is open. The remaining-count is always calculated from all tasks regardless of the active filter.

**Why this priority**: Filtering lets users focus on what matters without losing context of the full list.

**Independent Test**: Can be fully tested by adding tasks in mixed states, switching between each filter, and verifying only the appropriate tasks are shown in each view.

**Acceptance Scenarios**:

1. **Given** a mix of complete and incomplete tasks exist, **When** the user selects "Active", **Then** only incomplete tasks are shown.
2. **Given** a mix of complete and incomplete tasks exist, **When** the user selects "Completed", **Then** only completed tasks are shown.
3. **Given** the "Active" filter is selected, **When** the user selects "All", **Then** all tasks are shown again.
4. **Given** any filter is active, **Then** the remaining-count always reflects all incomplete tasks (not just visible ones).

---

### User Story 6 - Persist Tasks Across Sessions (Priority: P3)

Tasks created, edited, completed, and deleted are preserved when the user closes and reopens the browser tab. No account or backend is required — persistence happens entirely in the browser.

**Why this priority**: Persistence transforms a demo into a practical tool. Without it, tasks are lost on refresh.

**Independent Test**: Can be fully tested by adding tasks, refreshing the page, and verifying all tasks and their completion state are still present.

**Acceptance Scenarios**:

1. **Given** tasks have been added, **When** the user refreshes the page, **Then** all tasks reappear with their original titles and completion states.
2. **Given** a task was marked complete and the page was refreshed, **Then** the task still appears as complete after reload.
3. **Given** a task was deleted and the page was refreshed, **Then** the deleted task does not reappear.

---

### Edge Cases

- What happens when a task title consists of only whitespace? The system must reject it and show a validation message.
- How does the remaining-count handle zero tasks? Display "0 tasks left" — never show a negative number.
- What happens when the filter is "Active" and the user marks the only visible task complete? The task disappears from the filtered view immediately; the list shows an empty-state message.
- What happens when the browser storage is full or unavailable? The app must still function for the session; persistence degrades gracefully without crashing.
- What is the maximum task title length? Titles are limited to 200 characters; longer input is truncated or rejected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to add a new task by entering a title and submitting the input form.
- **FR-002**: The system MUST reject empty or whitespace-only task titles and display a validation message.
- **FR-003**: Task titles MUST be limited to a maximum of 200 characters.
- **FR-004**: Users MUST be able to mark any task as complete or incomplete using a toggle control.
- **FR-005**: Each task MUST expose a pencil icon/button that, when clicked, opens an inline text field pre-filled with the current title for editing.
- **FR-006**: The system MUST save the edited title when the user presses Enter or moves focus away from the inline edit field (blur); if the resulting title is empty or whitespace-only, the task MUST be deleted instead.
- **FR-007**: Users MUST be able to cancel an in-progress edit (via Escape key) to revert to the original title and close the edit field without saving.
- **FR-008**: Users MUST be able to delete any task permanently via an explicit delete control.
- **FR-009**: The app MUST display a count of remaining incomplete tasks at all times.
- **FR-010**: The count display MUST use correct singular/plural form ("1 task left" vs "2 tasks left").
- **FR-011**: Users MUST be able to filter the task list by three views: All, Active (incomplete), and Completed.
- **FR-012**: The active filter MUST be visually indicated so users can tell which view is selected.
- **FR-013**: The remaining-task count MUST always reflect all incomplete tasks, regardless of the active filter.
- **FR-014**: All task data (titles, completion states) MUST be persisted to the browser's localStorage so they survive page refresh, tab close, and browser restart without a backend.
- **FR-015**: Completed tasks MUST be visually distinct from incomplete tasks (e.g., strikethrough, muted color).
- **FR-016**: The app MUST display an empty-state message when no tasks match the current filter view.
- **FR-017**: The task list MUST display tasks in newest-first order — the most recently added task appears at the top.

### Key Entities

- **Task**: A unit of work with a unique identifier, a title (text, max 200 chars), a completion state (boolean), and a creation timestamp. Tasks are displayed newest-first (sorted descending by creation timestamp).
- **Filter**: A view mode with three possible values — All, Active, Completed — that controls which tasks are displayed.
- **Task Count**: A derived value representing the number of tasks whose completion state is incomplete, computed from the full task list regardless of the active filter.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new task in under 5 seconds from opening the app for the first time.
- **SC-002**: The remaining-task count is accurate 100% of the time — it never shows an incorrect value after any add, complete, uncheck, or delete action.
- **SC-003**: All tasks and their completion states are present immediately after a hard page refresh or reopening a previously closed tab, with no data loss under normal browser conditions.
- **SC-004**: Switching between All / Active / Completed filters takes effect instantly with no noticeable delay.
- **SC-005**: 100% of user interactions (add, complete, edit, delete, filter) produce a visible result without a full page reload.
- **SC-006**: The app remains fully functional with 100+ tasks in the list without perceivable performance degradation.

## Assumptions

- **Single-user, single-browser**: The app is designed for one user per browser. No multi-device sync or conflict resolution is required.
- **No authentication**: No login or account system is needed; task data belongs to the anonymous browser session.
- **localStorage persistence**: Task data is stored in the browser's localStorage, which persists indefinitely across page refreshes, tab closes, and browser restarts until the user explicitly clears browser data.
- **Clearing an edit title deletes the task**: If a user empties a task title while editing and confirms, the task is deleted (consistent with widely-known todo MVC convention).
- **No bulk actions in v1**: Operations like "mark all complete" or "clear all completed" are out of scope for the initial version.
- **No due dates or priorities in v1**: Tasks have only a title and completion state. Tags, categories, and priorities are out of scope.
- **Desktop-first layout**: The app is optimized for desktop browsers. Mobile responsiveness is a quality-of-life improvement, not a hard requirement for v1.
- **No undo/redo**: Deleted or edited tasks cannot be recovered through an undo mechanism.
