import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent {
  @Input() icon = 'activity'; // 'money' | 'briefcase' | 'users' | 'star' | 'activity'
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() change?: number;
  @Input() changeType?: 'increase' | 'decrease' | 'neutral' = 'neutral';
}
