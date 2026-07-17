import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenStorageService = inject(TokenStorageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorageService.getAccessToken();
    // Only attach authorization header to requests matching our main API or store API
    if (token && (request.url.startsWith(environment.apiUrl) || request.url.startsWith(environment.storeApiUrl))) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
