import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [`
    .auth-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-image: linear-gradient(135deg, rgba(13, 21, 58, 0.94) 0%, rgba(27, 43, 110, 0.88) 100%), url('/assets/hero-handyman.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        padding: 24px;
        box-sizing: border-box;
    }

    .auth-card {
        width: 100%;
        max-width: 450px;
        background: rgba(255, 255, 255, 0.93);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        padding: 40px;
        border-radius: 24px; 
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); 
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        border-top: 4px solid #DFBA6B;
    }

    .logo-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        direction: rtl;
    }

    .logo-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #1B2B6E;
        box-shadow: 0 4px 12px rgba(27, 43, 110, 0.2);
    }

    .logo-text-stack {
        display: flex;
        flex-direction: column;
        text-align: right;
    }

    .logo-title {
        font-size: 20px;
        font-weight: 800;
        color: #1B2B6E;
        line-height: 1.1;
        font-family: 'Cairo', sans-serif;
    }

    .logo-subtitle {
        font-size: 10px;
        font-weight: 700;
        color: #B99343;
        margin-top: 2px;
        font-family: 'Cairo', sans-serif;
    }

    .auth-title {
        font-size: 24px;
        font-weight: 800;
        color: #1B2B6E;
        margin: 0 0 8px 0;
        text-align: center;
        font-family: 'Cairo', sans-serif;
    }

    .auth-subtitle {
        font-size: 13px;
        color: #6c757d;
        margin: 0 0 28px 0;
        text-align: center;
        line-height: 1.6;
        font-family: 'Cairo', sans-serif;
    }

    .auth-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .form-label {
        font-size: 13px;
        font-weight: 700;
        color: #1B2B6E;
        text-align: right;
        font-family: 'Cairo', sans-serif;
    }

    .submit-wrap {
        margin-top: 12px;
        width: 100%;
        display: flex;
        gap: 12px;
    }

    .submit-wrap ::ng-deep app-button {
        flex: 1;
    }

    .submit-wrap ::ng-deep app-button button {
        height: 50px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        width: 100%;
        background: linear-gradient(135deg, #1B2B6E 0%, #0d153a 100%) !important;
        color: white !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(27, 43, 110, 0.25);
        transition: all 0.3s ease;
        cursor: pointer;
        font-family: 'Cairo', sans-serif;
    }

    .submit-wrap ::ng-deep app-button button:hover:not(:disabled) {
        background: linear-gradient(135deg, #2b41af 0%, #1B2B6E 100%) !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(27, 43, 110, 0.35);
    }

    .submit-wrap ::ng-deep app-button button:disabled {
        background: #ced4da !important;
        color: #6c757d !important;
        cursor: not-allowed;
        box-shadow: none;
    }

    .register-prompt {
        margin-top: 32px;
        display: flex;
        gap: 6px;
        direction: rtl;
        font-size: 14px;
        color: #6c757d;
        font-family: 'Cairo', sans-serif;
    }

    .register-link {
        color: #B99343;
        text-decoration: none;
        font-weight: 700;
        font-family: 'Cairo', sans-serif;
    }

    .register-link:hover {
        color: #DFBA6B;
        text-decoration: underline;
    }

    .success-msg {
        background-color: rgba(40, 167, 69, 0.05);
        border: 1px solid rgba(40, 167, 69, 0.25);
        color: #28a745;
        padding: 24px;
        border-radius: 16px;
        font-size: 14px;
        text-align: center;
        line-height: 1.6;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
    }

    .success-icon {
        color: #28a745;
        width: 32px;
        height: 32px;
    }

    .font-arabic {
        font-family: 'Cairo', sans-serif;
    }

    .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  isSuccess = false;

  getEmailError(): string {
    const control = this.forgotPasswordForm.get('email');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'البريد الإلكتروني مطلوب';
      if (control.hasError('email')) return 'صيغة البريد الإلكتروني غير صحيحة';
    }
    return '';
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isSuccess = true;
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }
}
