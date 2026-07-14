import { Component, ChangeDetectionStrategy, inject, input, signal, ElementRef, ViewChild, effect } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent {
  private readonly taskService = inject(TaskService);

  readonly task = input.required<Task>();

  readonly isEditing = signal(false);
  readonly editValue = signal('');

  @ViewChild('editInput') editInputEl?: ElementRef<HTMLInputElement>;

  constructor() {
    // Focus the input when editing starts
    effect(() => {
      if (this.isEditing()) {
        setTimeout(() => {
          this.editInputEl?.nativeElement.focus();
          this.editInputEl?.nativeElement.select();
        });
      }
    });
  }

  onToggle(): void {
    this.taskService.toggleComplete(this.task().id);
  }

  onStartEdit(): void {
    this.editValue.set(this.task().title);
    this.isEditing.set(true);
  }

  onSaveEdit(): void {
    if (!this.isEditing()) {
      return;
    }
    const val = this.editValue();
    this.taskService.updateTaskTitle(this.task().id, val);
    this.isEditing.set(false);
  }

  onCancelEdit(): void {
    this.isEditing.set(false);
  }

  onDelete(): void {
    this.taskService.deleteTask(this.task().id);
  }
}
