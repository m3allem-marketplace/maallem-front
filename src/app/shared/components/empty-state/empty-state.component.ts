import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@m3allem/ui-kit';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = 'inbox'; // 'search' | 'bell' | 'calendar' | 'bid' | 'inbox'
  @Input() actionText = '';

  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
