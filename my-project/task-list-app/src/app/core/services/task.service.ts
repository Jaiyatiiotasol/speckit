import { Injectable, signal, computed, effect } from '@angular/core';
import { Task, FilterType } from '../../features/tasks/models/task.model';

const STORAGE_KEY = 'tasks-app:tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks = signal<Task[]>(this.loadFromStorage());
  private readonly _filter = signal<FilterType>('all');

  readonly tasks = this._tasks.asReadonly();
  readonly filter = this._filter.asReadonly();

  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const filter = this._filter();
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  });

  readonly remainingCount = computed(() =>
    this._tasks().filter(t => !t.completed).length
  );

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._tasks()));
      } catch {
        // Storage quota exceeded or unavailable — silent fallback
      }
    });
  }

  addTask(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now()
    };
    this._tasks.update(tasks => [newTask, ...tasks]);
  }

  toggleComplete(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  updateTaskTitle(id: string, newTitle: string): void {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      this.deleteTask(id);
      return;
    }
    this._tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, title: trimmed } : t)
    );
  }

  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  setFilter(filter: FilterType): void {
    this._filter.set(filter);
  }

  private loadFromStorage(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Task[];
      }
    } catch {
      // Corrupt data — silent fallback
    }
    return [];
  }
}
