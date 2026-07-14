import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFooterComponent } from './task-footer.component';
import { TaskService } from '../../../../core/services/task.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TaskFooterComponent', () => {
  let component: TaskFooterComponent;
  let fixture: ComponentFixture<TaskFooterComponent>;
  let taskServiceSpy: any;
  let mockRemainingCount: any;
  let mockFilter: any;

  beforeEach(async () => {
    mockRemainingCount = signal(0);
    mockFilter = signal('all');

    taskServiceSpy = {
      remainingCount: mockRemainingCount,
      filter: mockFilter,
      setFilter: jasmine.createSpy('setFilter')
    };

    await TestBed.configureTestingModule({
      imports: [TaskFooterComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format remaining count correctly (plural/singular)', () => {
    const countEl = fixture.debugElement.query(By.css('.remaining-count'));

    mockRemainingCount.set(0);
    fixture.detectChanges();
    expect(countEl.nativeElement.textContent.trim()).toBe('0 tasks left');

    mockRemainingCount.set(1);
    fixture.detectChanges();
    expect(countEl.nativeElement.textContent.trim()).toBe('1 task left');

    mockRemainingCount.set(5);
    fixture.detectChanges();
    expect(countEl.nativeElement.textContent.trim()).toBe('5 tasks left');
  });

  it('should call setFilter when filter buttons are clicked', () => {
    const activeBtn = fixture.debugElement.query(By.css('#filter-btn-active'));
    activeBtn.nativeElement.click();
    expect(taskServiceSpy.setFilter).toHaveBeenCalledWith('active');

    const completedBtn = fixture.debugElement.query(By.css('#filter-btn-completed'));
    completedBtn.nativeElement.click();
    expect(taskServiceSpy.setFilter).toHaveBeenCalledWith('completed');

    const allBtn = fixture.debugElement.query(By.css('#filter-btn-all'));
    allBtn.nativeElement.click();
    expect(taskServiceSpy.setFilter).toHaveBeenCalledWith('all');
  });

  it('should add active class to the active filter button', () => {
    mockFilter.set('active');
    fixture.detectChanges();

    const activeBtn = fixture.debugElement.query(By.css('#filter-btn-active'));
    const allBtn = fixture.debugElement.query(By.css('#filter-btn-all'));

    expect(activeBtn.nativeElement.classList.contains('active')).toBe(true);
    expect(allBtn.nativeElement.classList.contains('active')).toBe(false);
  });
});
