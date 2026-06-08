import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  post<T>(path: string, body: any = {}, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, options);
  }

  put<T>(path: string, body: any = {}, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, options);
  }

  patch<T>(path: string, body: any = {}, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, options);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}
