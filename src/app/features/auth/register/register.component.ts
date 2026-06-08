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

    .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        direction: rtl;
    }

    .form-label {
        font-size: 13px;
        font-weight: 700;
        color: #1B2B6E;
        text-align: right;
        font-family: 'Cairo', sans-serif;
    }

    .toggle-password-btn {
        background: none;
        border: none;
        color: #B99343;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        padding: 0;
        font-family: 'Cairo', sans-serif;
    }

    .toggle-password-btn:hover {
        color: #DFBA6B;
        text-decoration: underline;
    }

    .store-error-msg {
        color: var(--color-error, #ef4444);
        font-size: 13px;
        text-align: right;
        direction: rtl;
        font-family: 'Cairo', sans-serif;
        font-weight: 600;
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
        font-size: 15px;
        font-weight: 700;
        transition: all 0.3s ease;
        cursor: pointer;
        width: 100%;
        font-family: 'Cairo', sans-serif;
    }

    .submit-wrap ::ng-deep app-button[variant="primary"] button {
        background: linear-gradient(135deg, #1B2B6E 0%, #0d153a 100%) !important;
        color: white !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(27, 43, 110, 0.2);
    }

    .submit-wrap ::ng-deep app-button[variant="primary"] button:hover:not(:disabled) {
        background: linear-gradient(135deg, #2b41af 0%, #1B2B6E 100%) !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(27, 43, 110, 0.3);
    }

    .submit-wrap ::ng-deep app-button[variant="secondary"] button {
        background: #ffffff !important;
        color: #1B2B6E !important;
        border: 2px solid #1B2B6E !important;
    }

    .submit-wrap ::ng-deep app-button[variant="secondary"] button:hover:not(:disabled) {
        background: rgba(27, 43, 110, 0.04) !important;
        transform: translateY(-2px);
    }

    .submit-wrap ::ng-deep app-button button:disabled {
        background: #ced4da !important;
        color: #6c757d !important;
        border: none !important;
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

    .role-cards {
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
    }

    .role-card {
        border: 2px solid rgba(27, 43, 110, 0.08);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        outline: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.02);
    }

    .role-card:hover {
        border-color: #B99343;
        background: rgba(185, 147, 67, 0.03);
        transform: translateY(-2px);
    }

    .role-card.active {
        border-color: #1B2B6E !important;
        background: rgba(27, 43, 110, 0.03) !important;
        box-shadow: 0 8px 24px rgba(27, 43, 110, 0.1) !important;
        transform: translateY(-2px) scale(1.01);
    }

    .role-icon {
        width: 36px;
        height: 36px;
        color: #6c757d;
        transition: color 0.3s ease;
    }

    .role-card.active .role-icon {
        color: #1B2B6E !important;
    }

    .role-title-text {
        font-size: 15px;
        font-weight: 800;
        color: #1B2B6E;
        font-family: 'Cairo', sans-serif;
    }

    .role-desc {
        font-size: 11px;
        color: #6c757d;
        line-height: 1.4;
        font-family: 'Cairo', sans-serif;
    }

    .summary-box {
        background: rgba(27, 43, 110, 0.03);
        border: 1px solid rgba(27, 43, 110, 0.08);
        border-radius: 16px;
        padding: 24px;
        width: 100%;
        direction: rtl;
        text-align: right;
        box-sizing: border-box;
    }

    .summary-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 800;
        color: #1B2B6E;
        margin-bottom: 12px;
        font-family: 'Cairo', sans-serif;
    }

    .summary-header-icon {
        color: #B99343;
    }

    .summary-divider {
        height: 1px;
        background: rgba(27, 43, 110, 0.08);
        margin-bottom: 16px;
        width: 100%;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 13px;
        font-family: 'Cairo', sans-serif;
    }

    .summary-item:last-child {
        margin-bottom: 0;
    }

    .summary-label {
        color: #6c757d;
        font-weight: 700;
    }

    .summary-value {
        color: #1B2B6E;
        font-weight: 800;
    }

    .highlight-role {
        color: #B99343;
        font-weight: 800;
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
        background-color: #ced4da;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .step-dot.active {
        background-color: #B99343;
        width: 28px;
        border-radius: 4px;
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

  getNameError(): string {
    const control = this.registerForm.get('name');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'الاسم الكامل مطلوب';
    }
    return '';
  }

  getEmailError(): string {
    const control = this.registerForm.get('email');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'البريد الإلكتروني مطلوب';
      if (control.hasError('email')) return 'صيغة البريد الإلكتروني غير صحيحة';
    }
    return '';
  }

  getPhoneError(): string {
    const control = this.registerForm.get('phone');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'رقم الهاتف مطلوب';
      if (control.hasError('egyptianPhone')) return 'يجب أن يكون رقم هاتف مصري صحيح (مثال: 01012345678)';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.registerForm.get('password');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'كلمة المرور مطلوبة';
      if (control.hasError('passwordStrength')) return 'يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير ورقم';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.registerForm.get('confirmPassword');
    if (control?.touched) {
      if (control.hasError('required')) return 'تأكيد كلمة المرور مطلوب';
      if (this.registerForm.hasError('passwordMismatch')) return 'كلمتا المرور غير متطابقتين';
    }
    return '';
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

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors = this.registerForm.get(key)?.errors;
      if (controlErrors != null) {
        errors[key] = controlErrors;
      }
    });
    const groupErrors = this.registerForm.errors;
    if (groupErrors) {
      errors['group'] = groupErrors;
    }
    return errors;
  }

  onSubmit(): void {
    console.log('Register Form Submitted!', {
      value: this.registerForm.value,
      valid: this.registerForm.valid,
      errors: this.getFormErrors()
    });

    if (this.registerForm.valid) {
      this.displayError = null;
      this.store.dispatch(register({ payload: this.registerForm.value as any }));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}