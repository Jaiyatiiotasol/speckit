import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskService } from '../../../../core/services/task.service';
import { FilterType } from '../../models/task.model';

@Component({
  selector: 'app-task-footer',
  standalone: true,
  imports: [],
  templateUrl: './task-footer.component.html',
  styleUrl: './task-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFooterComponent {
  private readonly taskService = inject(TaskService);

  readonly filter = this.taskService.filter;
  readonly remainingCount = this.taskService.remainingCount;

  onFilterChange(type: FilterType): void {
    this.taskService.setFilter(type);
  }
}
