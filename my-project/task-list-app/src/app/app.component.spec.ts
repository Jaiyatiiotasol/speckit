import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskService } from './core/services/task.service';
import { signal } from '@angular/core';
import { Task } from './features/tasks/models/task.model';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockTasks: any;

  beforeEach(async () => {
    mockTasks = signal<Task[]>([]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: TaskService,
          useValue: {
            tasks: mockTasks,
            // Mock empty structures for subcomponents
            filteredTasks: signal([]),
            remainingCount: signal(0),
            filter: signal('all')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should not display task-footer when there are no tasks', () => {
    mockTasks.set([]);
    fixture.detectChanges();

    const footerEl = fixture.debugElement.query(By.css('app-task-footer'));
    expect(footerEl).toBeNull();
  });

  it('should display task-footer when there are tasks', () => {
    mockTasks.set([{ id: '1', title: 'Task 1', completed: false, createdAt: Date.now() }]);
    fixture.detectChanges();

    const footerEl = fixture.debugElement.query(By.css('app-task-footer'));
    expect(footerEl).toBeTruthy();
  });
});
