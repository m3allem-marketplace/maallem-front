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
        background-color: #f7f6f0; 
        padding: 24px;
        box-sizing: border-box;
    }

    .auth-card {
        width: 100%;
        max-width: 460px;
        background: #ffffff;
        padding: 40px;
        border-radius: 24px; 
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03); 
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
    }

    .logo-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
    }

    .logo-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--color-accent, #FFB400), #e09e00);
    }

    .logo-text {
        font-size: 22px;
        font-weight: 800;
        color: var(--color-primary-dark, #1B2B6E);
        letter-spacing: -0.02em;
    }

    .logo-accent {
        color: var(--color-accent, #FFB400);
    }

    .auth-title {
        font-size: 26px;
        font-weight: 700;
        color: var(--color-primary-dark, #1B2B6E);
        margin: 0 0 6px 0;
        text-align: center;
    }

    .auth-subtitle {
        font-size: 14px;
        color: #6c757d;
        margin: 0 0 32px 0;
        text-align: center;
        line-height: 1.6;
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
        font-size: 14px;
        font-weight: 600;
        color: var(--color-primary-dark, #1B2B6E);
        text-align: right;
    }

    .submit-wrap {
        margin-top: 8px;
        width: 100%;
        display: flex;
        gap: 12px;
    }

    .submit-wrap ::ng-deep app-button {
        flex: 1;
    }

    .submit-wrap ::ng-deep app-button button {
        height: 48px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        width: 100%;
    }

    .submit-wrap ::ng-deep app-button button:disabled {
        background-color: #ced4da !important;
        color: #6c757d !important;
    }

    .register-prompt {
        margin-top: 32px;
        display: flex;
        gap: 6px;
        direction: rtl;
        font-size: 14px;
        color: #495057;
    }

    .register-link {
        color: var(--color-accent, #FFB400);
        text-decoration: none;
        font-weight: 700;
    }

    .register-link:hover {
        text-decoration: underline;
    }

    .success-msg {
        background-color: #d4edda;
        color: #155724;
        padding: 16px;
        border-radius: 12px;
        font-size: 14px;
        text-align: center;
        line-height: 1.5;
        width: 100%;
        box-sizing: border-box;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  isSuccess = false;

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isSuccess = true;
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }
}
