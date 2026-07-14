import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { TaskService } from '../../../../core/services/task.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['addTask']);

    await TestBed.configureTestingModule({
      imports: [AddTaskComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty title', () => {
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.valid).toBeFalsy();
  });

  it('should validate required title', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBeTruthy();
  });

  it('should validate non-whitespace title', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('    ');
    fixture.detectChanges();
    expect(titleControl?.hasError('whitespace')).toBeTruthy();
  });

  it('should validate maxLength of 200 characters', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('a'.repeat(201));
    expect(titleControl?.hasError('maxlength')).toBeTruthy();
  });

  it('should call TaskService.addTask on valid submit and reset the form', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('Learn Angular Signals');
    expect(component.taskForm.valid).toBeTruthy();

    component.onSubmit();

    expect(taskServiceSpy.addTask).toHaveBeenCalledWith('Learn Angular Signals');
    expect(titleControl?.value).toBe(null); // FormGroup reset sets value to null
  });

  it('should not call TaskService.addTask on invalid submit', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('');
    expect(component.taskForm.valid).toBeFalsy();

    component.onSubmit();

    expect(taskServiceSpy.addTask).not.toHaveBeenCalled();
  });
});
