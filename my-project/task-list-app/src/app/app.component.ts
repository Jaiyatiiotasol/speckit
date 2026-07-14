import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TaskService } from './core/services/task.service';
import { AddTaskComponent } from './features/tasks/components/add-task/add-task.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';
import { TaskFooterComponent } from './features/tasks/components/task-footer/task-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddTaskComponent, TaskListComponent, TaskFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly taskService = inject(TaskService);

  readonly hasTasks = computed(() => this.taskService.tasks().length > 0);
}
