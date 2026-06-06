import { FormControl, FormGroup } from '@angular/forms';
import { passwordStrength, egyptianPhone, passwordConfirmMatch, emailDomain } from './auth-form-validators';

describe('Auth Form Validators', () => {
  describe('passwordStrength', () => {
    it('should return null for valid password', () => {
      const control = new FormControl('Valid1Password');
      expect(passwordStrength()(control)).toBeNull();
    });

    it('should return passwordStrength error if less than 8 characters', () => {
      const control = new FormControl('Val1d');
      expect(passwordStrength()(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if missing uppercase', () => {
      const control = new FormControl('invalid1password');
      expect(passwordStrength()(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if missing number', () => {
      const control = new FormControl('InvalidPassword');
      expect(passwordStrength()(control)).toEqual({ passwordStrength: true });
    });

    it('should return null if value is empty', () => {
      const control = new FormControl('');
      expect(passwordStrength()(control)).toBeNull();
    });
  });

  describe('egyptianPhone', () => {
    it('should return null for valid 010 number', () => {
      const control = new FormControl('01012345678');
      expect(egyptianPhone()(control)).toBeNull();
    });

    it('should return null for valid 011 number', () => {
      const control = new FormControl('01112345678');
      expect(egyptianPhone()(control)).toBeNull();
    });

    it('should return null for valid 012 number', () => {
      const control = new FormControl('01212345678');
      expect(egyptianPhone()(control)).toBeNull();
    });

    it('should return null for valid 015 number', () => {
      const control = new FormControl('01512345678');
      expect(egyptianPhone()(control)).toBeNull();
    });

    it('should return error for invalid prefix', () => {
      const control = new FormControl('01312345678');
      expect(egyptianPhone()(control)).toEqual({ egyptianPhone: true });
    });

    it('should return error for less than 11 digits', () => {
      const control = new FormControl('0101234567');
      expect(egyptianPhone()(control)).toEqual({ egyptianPhone: true });
    });

    it('should return error for more than 11 digits', () => {
      const control = new FormControl('010123456789');
      expect(egyptianPhone()(control)).toEqual({ egyptianPhone: true });
    });

    it('should return null if value is empty', () => {
      const control = new FormControl('');
      expect(egyptianPhone()(control)).toBeNull();
    });
  });

  describe('passwordConfirmMatch', () => {
    it('should return null if passwords match', () => {
      const group = new FormGroup({
        password: new FormControl('Password123'),
        confirmPassword: new FormControl('Password123')
      });
      expect(passwordConfirmMatch()(group)).toBeNull();
    });

    it('should return error if passwords do not match', () => {
      const group = new FormGroup({
        password: new FormControl('Password123'),
        confirmPassword: new FormControl('Password1234')
      });
      expect(passwordConfirmMatch()(group)).toEqual({ passwordMismatch: true });
    });

    it('should return null if password or confirmPassword is missing from group', () => {
      const group = new FormGroup({
        password: new FormControl('Password123')
      });
      expect(passwordConfirmMatch()(group)).toBeNull();
    });
  });

  describe('emailDomain', () => {
    it('should return null for valid domain', () => {
      const control = new FormControl('test@gmail.com');
      expect(emailDomain()(control)).toBeNull();
    });

    it('should return error for mailinator domain', () => {
      const control = new FormControl('test@mailinator.com');
      expect(emailDomain()(control)).toEqual({ invalidDomain: true });
    });

    it('should return error for yopmail domain', () => {
      const control = new FormControl('test@yopmail.com');
      expect(emailDomain()(control)).toEqual({ invalidDomain: true });
    });

    it('should return null if value is empty', () => {
      const control = new FormControl('');
      expect(emailDomain()(control)).toBeNull();
    });

    it('should return null if email has no domain', () => {
      const control = new FormControl('test');
      expect(emailDomain()(control)).toBeNull();
    });
  });
});
