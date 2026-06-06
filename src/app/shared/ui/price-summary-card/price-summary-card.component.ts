import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@m3allem/ui-kit';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-price-summary-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CurrencyFormatPipe],
  templateUrl: './price-summary-card.component.html',
  styleUrls: ['./price-summary-card.component.css']
})
export class PriceSummaryCardComponent {
  @Input() serviceName = '';
  @Input() basePrice = 0;
  @Input() extras: { label: string; price: number }[] = [];
  @Input() ctaText = '';
  @Input() loading = false;

  @Output() ctaClick = new EventEmitter<void>();

  get total(): number {
    const extrasTotal = this.extras 
      ? this.extras.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;
    return (this.basePrice || 0) + extrasTotal;
  }

  onCtaClick(): void {
    if (!this.loading) {
      this.ctaClick.emit();
    }
  }
}
