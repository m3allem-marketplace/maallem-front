import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { register, registerSuccess } from '../../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../../store/auth/auth.selectors';
import { ToastService } from '@m3allem/ui-kit';
import { egyptianPhone, passwordStrength, passwordConfirmMatch } from '../services/auth-form-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
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

    .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        direction: rtl;
    }

    .form-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-primary-dark, #1B2B6E);
        text-align: right;
    }

    .toggle-password-btn {
        background: none;
        border: none;
        color: var(--color-primary, #1B2B6E);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        padding: 0;
    }

    .toggle-password-btn:hover {
        text-decoration: underline;
    }

    .store-error-msg {
        color: var(--color-error, #ef4444);
        font-size: 13px;
        text-align: right;
        direction: rtl;
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

    .role-cards {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }

    /* Role Card - Icon Support */
    .role-card {
        border: 2px solid #e9ecef;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        background: #f8f9fa;
        font-weight: 600;
        color: #495057;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        outline: none;
    }

    .role-card:hover {
        border-color: #ced4da;
        background: #ffffff;
    }


    /*  Role Card Icon */
    .role-icon {
        width: 32px;
        height: 32px;
        color: #6c757d;
        transition: color 0.2s ease;
    }

    .role-card:hover .role-icon {
        color: var(--color-primary, #1B2B6E);
    }

.role-card.active {
  border: 2px solid var(--color-primary) !important;
  background: var(--color-primary-subtle, #eef0f9);  
  color: var(--color-primary-dark, #1B2B6E);
  box-shadow: 0 0 0 3px rgba(27, 43, 110, 0.2),
              0 8px 24px rgba(27, 43, 110, 0.2);  
  transform: scale(1.02);  
}

.role-card.active .role-icon {
  color: var(--color-primary) !important;
  width: 40px; 
  height: 40px;
}

    .role-card span {
        font-size: 14px;
        font-weight: 600;
    }

    .summary-box {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        direction: rtl;
        text-align: right;
        outline: none;
    }

    .summary-item {
        margin-bottom: 12px;
        font-size: 14px;
    }

    .summary-item:last-child {
        margin-bottom: 0;
    }

    .summary-label {
        color: #6c757d;
        font-weight: 500;
        margin-left: 8px;
    }

    .summary-value {
        color: var(--color-primary-dark, #1B2B6E);
        font-weight: 600;
    }

    .step-indicator {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 24px;
        width: 100%;
    }

    .step-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #e9ecef;
        transition: all 0.3s;
    }

    .step-dot.active {
        background-color: var(--color-primary, #1B2B6E);
        width: 24px;
        border-radius: 4px;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  currentStep = 1;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, egyptianPhone()]),
    password: new FormControl('', [Validators.required, passwordStrength()]),
    confirmPassword: new FormControl('', [Validators.required]),
    role: new FormControl('user', [Validators.required])
  }, { validators: passwordConfirmMatch() });

  authLoading$ = this.store.select(selectAuthLoading);
  authError$ = this.store.select(selectAuthError);
  passwordType: 'password' | 'text' = 'password';
  displayError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private toastService: ToastService,
    private actions$: Actions,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          if (error.includes('Email already in use') || error.includes('409') || error.includes('Conflict')) {
            this.displayError = 'هذا البريد الإلكتروني مستخدم بالفعل';
          } else {
            this.displayError = error;
          }
          this.toastService.show(this.displayError, 'error');
        } else {
          this.displayError = null;
        }
      });

    this.actions$
      .pipe(
        ofType(registerSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ user }) => {
        if (user.role === 'user') {
          this.router.navigate(['/customer/dashboard']);
        } else {
          this.router.navigate(['/worker/dashboard']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  getRoleDisplay(role: string): string {
    const roles: Record<string, string> = {
      'user': 'عميل',
      'worker': 'معلم',
      'company': 'شركة'
    };
    return roles[role] || role;
  }

  isStep1Valid(): boolean {
    const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const fieldsValid = fields.every(f => this.registerForm.get(f)?.valid);
    return fieldsValid && !this.registerForm.hasError('passwordMismatch');
  }

  isStep2Valid(): boolean {
    return !!this.registerForm.get('role')?.valid;
  }

  handleEnter(): void {
    if (this.currentStep === 1 && this.isStep1Valid()) {
      this.nextStep();
    } else if (this.currentStep === 2 && this.isStep2Valid()) {
      this.nextStep();
    } else if (this.currentStep === 3 && this.registerForm.valid) {
      this.onSubmit();
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.isStep1Valid()) {
        this.displayError = null;
        this.currentStep = 2;
      } else {
        const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
        fields.forEach(f => this.registerForm.get(f)?.markAsTouched());
      }
    } else if (this.currentStep === 2) {
      if (this.isStep2Valid()) {
        this.displayError = null;
        this.currentStep = 3;
      } else {
        this.registerForm.get('role')?.markAsTouched();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.displayError = null;
      this.currentStep--;
    }
  }

  setRole(role: string): void {
    this.registerForm.get('role')?.setValue(role);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.displayError = null;
      this.store.dispatch(register({ payload: this.registerForm.value as any }));
    }
  }
}