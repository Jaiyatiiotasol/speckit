import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);

  readonly taskForm: FormGroup = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(200),
      // Validate that it doesn't consist of only whitespace
      Validators.pattern(/^\s*$/) ? (control: any) => {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
      } : Validators.required
    ]]
  });

  onSubmit(): void {
    if (this.taskForm.valid) {
      const title = this.taskForm.value.title;
      this.taskService.addTask(title);
      this.taskForm.reset();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
