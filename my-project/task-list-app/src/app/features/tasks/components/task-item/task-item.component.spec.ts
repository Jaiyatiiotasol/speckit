import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { TaskService } from '../../../../core/services/task.service';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  const mockTask: Task = {
    id: 'abc-123',
    title: 'Test Component Task',
    completed: false,
    createdAt: Date.now()
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['toggleComplete', 'updateTaskTitle', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [TaskItemComponent, FormsModule],
      providers: [
        { provide: TaskService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    // Set input using fixture.componentRef.setInput
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title and completion status', () => {
    const titleEl = fixture.debugElement.query(By.css('.task-title'));
    expect(titleEl.nativeElement.textContent.trim()).toBe('Test Component Task');
    expect(titleEl.nativeElement.classList.contains('completed')).toBeFalsy();

    const checkboxEl = fixture.debugElement.query(By.css('.task-checkbox'));
    expect(checkboxEl.nativeElement.checked).toBeFalsy();
  });

  it('should call TaskService.toggleComplete when checkbox is toggled', () => {
    const checkboxEl = fixture.debugElement.query(By.css('.task-checkbox'));
    checkboxEl.nativeElement.click();
    fixture.detectChanges();

    expect(taskServiceSpy.toggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('should enter edit mode when edit button is clicked', fakeAsync(() => {
    const editBtn = fixture.debugElement.query(By.css('.edit-btn'));
    editBtn.nativeElement.click();
    fixture.detectChanges();
    tick(); // allow effect and setTimeout to trigger focus

    expect(component.isEditing()).toBe(true);
    expect(component.editValue()).toBe('Test Component Task');

    const inputEl = fixture.debugElement.query(By.css('.task-edit-input'));
    expect(inputEl).toBeTruthy();
    expect(inputEl.nativeElement.value).toBe('Test Component Task');
  }));

  it('should save edit and call updateTaskTitle on Enter key', fakeAsync(() => {
    component.onStartEdit();
    fixture.detectChanges();
    tick();

    component.editValue.set('New Title');
    const inputEl = fixture.debugElement.query(By.css('.task-edit-input'));
    inputEl.triggerEventHandler('keydown.enter', {});
    fixture.detectChanges();

    expect(taskServiceSpy.updateTaskTitle).toHaveBeenCalledWith(mockTask.id, 'New Title');
    expect(component.isEditing()).toBe(false);
  }));

  it('should cancel edit on Escape key', fakeAsync(() => {
    component.onStartEdit();
    fixture.detectChanges();
    tick();

    component.editValue.set('New Title');
    const inputEl = fixture.debugElement.query(By.css('.task-edit-input'));
    inputEl.triggerEventHandler('keydown.escape', {});
    fixture.detectChanges();

    expect(taskServiceSpy.updateTaskTitle).not.toHaveBeenCalled();
    expect(component.isEditing()).toBe(false);
  }));

  it('should call TaskService.deleteTask when delete button is clicked', () => {
    const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
    deleteBtn.nativeElement.click();
    fixture.detectChanges();

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTask.id);
  });
});
