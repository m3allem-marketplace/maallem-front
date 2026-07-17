import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '@m3allem/ui-kit';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private toast: ToastService) {}

  subscribeNewsletter(email: string): void {
    if (email && email.trim() !== '') {
      this.toast.success('حسنًا، سنرسل إليك أحدث العروض والكوبونات');
    } else {
      this.toast.warning('يرجى إدخال بريدك الإلكتروني أولاً');
    }
  }
}