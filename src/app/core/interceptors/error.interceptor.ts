import { inject, Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { tokenRefreshed, logoutSuccess } from '../../../store/auth/auth.actions';
import { ToastService } from '@m3allem/ui-kit';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private tokenStorage = inject(TokenStorageService);
    private router = inject(Router);
    private injector = inject(Injector);

    private get authService(): AuthService {
        return this.injector.get(AuthService);
    }

    private get store(): Store {
        return this.injector.get(Store);
    }

    private get toast(): ToastService {
        return this.injector.get(ToastService);
    }

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 401:
                            if (request.url.includes('/ai/')) {
                                // OpenAI API key error from the backend. 
                                // Do NOT refresh tokens or terminate the user session.
                                return throwError(() => error);
                            }

                            if (request.url.includes('/refresh')) {
                                this.tokenStorage.clear();
                                this.toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.');
                                this.router.navigate(['/auth/login']);
                                return throwError(() => error);
                            }

                            if (!this.isRefreshing) {
                                this.isRefreshing = true;
                                this.refreshTokenSubject.next(null);

                                return this.authService.refreshToken().pipe(
                                    switchMap((res: any) => {
                                        const access = res.data?.accessToken || res.accessToken;
                                        const refresh = res.data?.refreshToken || res.refreshToken;

                                        this.tokenStorage.setTokens(access, refresh);
                                        this.store.dispatch(tokenRefreshed({ accessToken: access }));

                                        this.refreshTokenSubject.next(access);
                                        this.isRefreshing = false;

                                        const cloned = request.clone({
                                            setHeaders: {
                                                Authorization: `Bearer ${access}`
                                            }
                                        });

                                        return next.handle(cloned);
                                    }),
                                    catchError(err => {
                                        // Bug Fix #3: dispatch logoutSuccess so NgRx store and
                                        // UserContextService are properly reset, not just the router.
                                        this.isRefreshing = false;
                                        this.refreshTokenSubject.next(null);
                                        this.tokenStorage.clear();
                                        this.store.dispatch(logoutSuccess());
                                        this.toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.');
                                        this.router.navigate(['/auth/login']);

                                        return throwError(() => err);
                                    })
                                );
                            }

                            return this.refreshTokenSubject.pipe(
                                filter(token => token != null),
                                take(1),
                                switchMap(token => {
                                    const cloned = request.clone({
                                        setHeaders: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    });

                                    return next.handle(cloned);
                                })
                            );

                        // Bug Fix #2: 429 = rate-limited. Do NOT touch the session.
                        // Just show a friendly message and let the request fail.
                        case 429:
                            this.toast.error('الخادم مشغول حالياً، يرجى الانتظار لحظة والمحاولة مجدداً.');
                            break;

                        case 403:
                            console.error('ليس لديك صلاحية لهذا الإجراء');
                            this.router.navigate(['/forbidden']);
                            break;

                        case 404:
                            console.error('المحتوى غير موجود');
                            break;

                        case 422:
                            const msg =
                                error.error?.message ||
                                error.error?.error?.message ||
                                'خطأ في البيانات';

                            console.error(msg);
                            break;

                        default:
                            if (error.status >= 500 && error.status < 600) {
                                console.error('حدث خطأ في الخادم، حاول مرة أخرى');
                            }
                    }
                }

                return throwError(() => error);
            })
        );
    }
}