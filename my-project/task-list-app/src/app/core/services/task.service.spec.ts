import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { FilterType, Task } from '../../features/tasks/models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have an empty task list', () => {
    expect(service.tasks().length).toBe(0);
    expect(service.remainingCount()).toBe(0);
  });

  it('should add a task in newest-first order', () => {
    service.addTask('Task 1');
    expect(service.tasks().length).toBe(1);
    expect(service.tasks()[0].title).toBe('Task 1');
    expect(service.tasks()[0].completed).toBe(false);
    expect(service.remainingCount()).toBe(1);

    service.addTask('Task 2');
    expect(service.tasks().length).toBe(2);
    expect(service.tasks()[0].title).toBe('Task 2'); // Newest first
    expect(service.tasks()[1].title).toBe('Task 1');
    expect(service.remainingCount()).toBe(2);
  });

  it('should reject empty or whitespace task titles', () => {
    service.addTask('');
    expect(service.tasks().length).toBe(0);

    service.addTask('   ');
    expect(service.tasks().length).toBe(0);
  });

  it('should toggle task completion state', () => {
    service.addTask('Task 1');
    const task = service.tasks()[0];

    service.toggleComplete(task.id);
    expect(service.tasks()[0].completed).toBe(true);
    expect(service.remainingCount()).toBe(0);

    service.toggleComplete(task.id);
    expect(service.tasks()[0].completed).toBe(false);
    expect(service.remainingCount()).toBe(1);
  });

  it('should update task title and trim the value', () => {
    service.addTask('Original');
    const task = service.tasks()[0];

    service.updateTaskTitle(task.id, '  Updated  ');
    expect(service.tasks()[0].title).toBe('Updated');
  });

  it('should delete task if updated title is empty or whitespace', () => {
    service.addTask('Task 1');
    const task = service.tasks()[0];

    service.updateTaskTitle(task.id, '');
    expect(service.tasks().length).toBe(0);
  });

  it('should delete a task', () => {
    service.addTask('Task 1');
    const task = service.tasks()[0];

    service.deleteTask(task.id);
    expect(service.tasks().length).toBe(0);
  });

  it('should filter tasks correctly', () => {
    service.addTask('Active 1');
    service.addTask('Active 2');
    service.addTask('Completed 1');

    const completedTask = service.tasks()[0]; // completed 1 is newest
    service.toggleComplete(completedTask.id);

    // Default filter 'all'
    expect(service.filteredTasks().length).toBe(3);
    expect(service.remainingCount()).toBe(2); // 2 active tasks

    // Set filter to 'active'
    service.setFilter('active');
    expect(service.filteredTasks().length).toBe(2);
    expect(service.filteredTasks().every(t => !t.completed)).toBe(true);

    // Set filter to 'completed'
    service.setFilter('completed');
    expect(service.filteredTasks().length).toBe(1);
    expect(service.filteredTasks()[0].completed).toBe(true);
  });

  it('should sync tasks to localStorage', () => {
    service.addTask('Persistent Task');
    const stored = JSON.parse(localStorage.getItem('tasks-app:tasks') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].title).toBe('Persistent Task');
  });
});
