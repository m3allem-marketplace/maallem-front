import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

import { TokenStorageService } from './services/token-storage.service';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from './services/loading.service';

describe('CoreModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      providers: [
        // Mocking dependencies required by the interceptors
        // to prevent dependency injection errors when they are instantiated.
        { provide: TokenStorageService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: LoadingService, useValue: {} },
      ]
    });
  });

  it('should provide HTTP_INTERCEPTORS with Auth, Error, and Loading interceptors', () => {
    // By injecting the token, we force Angular DI to resolve the array of interceptors
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);

    expect(interceptors).toBeTruthy();
    expect(interceptors.length).toBe(3);

    // Verify each expected interceptor is correctly instantiated in the array
    const hasAuthInterceptor = interceptors.some(i => i instanceof AuthInterceptor);
    const hasErrorInterceptor = interceptors.some(i => i instanceof ErrorInterceptor);
    const hasLoadingInterceptor = interceptors.some(i => i instanceof LoadingInterceptor);

    expect(hasAuthInterceptor).withContext('AuthInterceptor should be provided').toBeTrue();
    expect(hasErrorInterceptor).withContext('ErrorInterceptor should be provided').toBeTrue();
    expect(hasLoadingInterceptor).withContext('LoadingInterceptor should be provided').toBeTrue();
  });
});
