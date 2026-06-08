import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css']
})
export class BookingCardComponent {
  @Input() booking: any;

  getCategoryIcon(cat?: string): string {
    const map: Record<string, string> = {
      plumbing: '🔧', electricity: '⚡', painting: '🎨',
      carpentry: '🪚', tiling: '🧱', hvac: '❄️',
      cleaning: '🧹', moving: '📦', welding: '🔥'
    };
    return map[cat || ''] || '🛠️';
  }
}
