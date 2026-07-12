import { Component, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mock-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mock-payment-modal.component.html',
  styleUrls: ['./mock-payment-modal.component.css']
})
export class MockPaymentModalComponent implements OnDestroy {
  @Input() isOpen = false;
  @Input() amount = 0;
  @Input() bookingId = '';

  @Output() paymentSuccess = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  step = 1; // 1: Method selection, 2: Details input, 3: Secure gateway connection, 4: OTP Verification, 5: Processing final payment, 6: Success Checkmark
  method: 'wallet' | 'instapay' | 'card' | '' = '';
  
  // Form Fields
  walletNumber = '';
  walletProvider = 'vodafone';
  instapayAddress = '';
  cardNumber = '';
  cardHolder = '';
  cardExpiry = '';
  cardCvv = '';
  otpCode = '';

  // Timing/State
  validationError = '';
  countdown = 60;
  timerInterval: any = null;

  ngOnDestroy(): void {
    this.clearOtpTimer();
  }

  selectMethod(selected: 'wallet' | 'instapay' | 'card'): void {
    this.method = selected;
    this.validationError = '';
    this.step = 2;
  }

  goBack(): void {
    if (this.step === 2) {
      this.step = 1;
      this.method = '';
    } else if (this.step === 4) {
      this.step = 2;
      this.clearOtpTimer();
    }
  }

  submitDetails(): void {
    this.validationError = '';

    if (this.method === 'wallet') {
      if (!this.walletNumber || !/^01[0125]\d{8}$/.test(this.walletNumber)) {
        this.validationError = 'يرجى إدخال رقم محفظة مصري صحيح (11 رقم يبدأ بـ 01)';
        return;
      }
    } else if (this.method === 'instapay') {
      if (!this.instapayAddress || !this.instapayAddress.includes('@')) {
        this.validationError = 'يرجى إدخال عنوان InstaPay IPA صحيح (يحتوي على @)';
        return;
      }
    } else if (this.method === 'card') {
      const cleanCard = this.cardNumber.replace(/\s+/g, '');
      if (!cleanCard || cleanCard.length < 16) {
        this.validationError = 'رقم البطاقة غير مكتمل (يجب أن يكون 16 رقم)';
        return;
      }
      if (!this.cardHolder || this.cardHolder.trim().length < 3) {
        this.validationError = 'يرجى إدخال اسم حامل البطاقة بالكامل';
        return;
      }
      if (!this.cardExpiry || !/^\d{2}\/\d{2}$/.test(this.cardExpiry)) {
        this.validationError = 'صيغة تاريخ الانتهاء غير صحيحة (MM/YY)';
        return;
      }
      if (!this.cardCvv || this.cardCvv.length < 3) {
        this.validationError = 'يرجى إدخال رمز الأمان (CVV)';
        return;
      }
    }

    // Step 3: Connecting to Secure Gateway
    this.step = 3;
    setTimeout(() => {
      // Step 4: OTP Verification Screen
      this.step = 4;
      this.otpCode = '';
      this.startOtpTimer();
    }, 1800);
  }

  startOtpTimer(): void {
    this.clearOtpTimer();
    this.countdown = 60;
    this.timerInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearOtpTimer();
      }
    }, 1000);
  }

  clearOtpTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resendOtp(): void {
    this.startOtpTimer();
    this.otpCode = '';
  }

  verifyOtp(): void {
    this.validationError = '';
    if (!this.otpCode || this.otpCode.length < 4) {
      this.validationError = 'يرجى إدخال رمز التحقق بشكل صحيح';
      return;
    }

    // Step 5: Finalizing Payment
    this.step = 5;
    this.clearOtpTimer();

    setTimeout(() => {
      // Step 6: Success screen — stays visible until user clicks CTA
      this.step = 6;
    }, 1800);
  }

  /** Called by the success-screen CTA button */
  confirmSuccess(): void {
    this.paymentSuccess.emit();
    this.resetForm();
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.step = 1;
    this.method = '';
    this.walletNumber = '';
    this.walletProvider = 'vodafone';
    this.instapayAddress = '';
    this.cardNumber = '';
    this.cardHolder = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.otpCode = '';
    this.validationError = '';
    this.clearOtpTimer();
  }

  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < input.length; i += 4) {
      if (i > 0) formatted += ' ';
      formatted += input.substring(i, i + 4);
    }
    this.cardNumber = formatted.substring(0, 19);
  }

  formatExpiry(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2) {
      this.cardExpiry = input.substring(0, 2) + '/' + input.substring(2, 4);
    } else {
      this.cardExpiry = input;
    }
  }
}
