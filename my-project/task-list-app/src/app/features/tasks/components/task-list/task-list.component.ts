import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  readonly taskService = inject(TaskService);
  readonly filteredTasks = this.taskService.filteredTasks;
}
