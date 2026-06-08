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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private tokenStorage = inject(TokenStorageService);
    private router = inject(Router);
    private injector = inject(Injector);

    private get authService(): AuthService {
        return this.injector.get(AuthService);
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
                            if (request.url.includes('/refresh')) {
                                this.tokenStorage.clear();
                                this.router.navigate(['/auth/login']);
                                return throwError(() => error);
                            }

                            if (!this.isRefreshing) {
                                this.isRefreshing = true;
                                this.refreshTokenSubject.next(null);

                                return this.authService.refreshToken().pipe(
                                    switchMap((res: any) => {
                                        this.tokenStorage.setTokens(
                                            res.accessToken,
                                            res.refreshToken
                                        );

                                        this.refreshTokenSubject.next(res.accessToken);
                                        this.isRefreshing = false;

                                        const cloned = request.clone({
                                            setHeaders: {
                                                Authorization: `Bearer ${res.accessToken}`
                                            }
                                        });

                                        return next.handle(cloned);
                                    }),
                                    catchError(err => {
                                        this.isRefreshing = false;
                                        this.refreshTokenSubject.next(null);
                                        this.tokenStorage.clear();
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