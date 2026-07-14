import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockFilteredTasks: any;

  beforeEach(async () => {
    mockFilteredTasks = signal<Task[]>([]);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        {
          provide: TaskService,
          useValue: {
            filteredTasks: mockFilteredTasks
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when filteredTasks is empty', () => {
    mockFilteredTasks.set([]);
    fixture.detectChanges();

    const emptyStateEl = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyStateEl).toBeTruthy();
    expect(emptyStateEl.nativeElement.textContent).toContain('No tasks matching this filter');

    const taskItems = fixture.debugElement.queryAll(By.css('app-task-item'));
    expect(taskItems.length).toBe(0);
  });

  it('should render list of tasks when filteredTasks has items', () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', completed: false, createdAt: Date.now() },
      { id: '2', title: 'Task 2', completed: true, createdAt: Date.now() }
    ];
    mockFilteredTasks.set(mockTasks);
    fixture.detectChanges();

    const emptyStateEl = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyStateEl).toBeNull();

    const taskItems = fixture.debugElement.queryAll(By.css('app-task-item'));
    expect(taskItems.length).toBe(2);
  });
});
