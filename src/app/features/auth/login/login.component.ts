import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { login } from '../../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../../store/auth/auth.selectors';
import { ToastService } from '@m3allem/ui-kit';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
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

        .actions-row {
            display: flex;
            justify-content: flex-start;
            width: 100%;
            direction: rtl;
            margin-top: -8px;
        }

        .forgot-link {
            font-size: 13px;
            color: #495057;
            text-decoration: none;
        }

        .forgot-link:hover {
            color: var(--color-primary-dark, #1B2B6E);
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
        }

        .submit-wrap ::v-deep app-button button {
            height: 48px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
        }

        .submit-wrap ::v-deep app-button button:disabled {
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
    `]
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    authLoading$ = this.store.select(selectAuthLoading);
    authError$ = this.store.select(selectAuthError);
    passwordType: 'password' | 'text' = 'password';

    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.authError$
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
                if (error) {
                    this.toastService.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
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

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.store.dispatch(login({ credentials: this.loginForm.value as any }));
        }
    }
}