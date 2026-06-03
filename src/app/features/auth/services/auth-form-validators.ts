import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const value = control.value;
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasMinLength || !hasUppercase || !hasNumber) {
      return { passwordStrength: true };
    }
    return null;
  };
}

export function egyptianPhone(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const validPattern = /^01[0125][0-9]{8}$/;
    if (!validPattern.test(control.value)) {
      return { egyptianPhone: true };
    }
    return null;
  };
}

export function passwordConfirmMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  };
}

export function emailDomain(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const suspiciousDomains = ['mailinator.com', 'yopmail.com'];
    const emailParts = control.value.split('@');
    if (emailParts.length === 2) {
      const domain = emailParts[1].toLowerCase();
      if (suspiciousDomains.includes(domain)) {
        return { invalidDomain: true };
      }
    }
    return null;
  };
}
