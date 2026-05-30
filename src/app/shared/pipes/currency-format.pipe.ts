import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat', standalone: true, pure: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'EGP'): string {
    if (value == null) return '';

    const formatted = new Intl.NumberFormat('en-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

    return `${currency} ${formatted}`;
  }
}