import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class WorkerProfileService {
  constructor(private api: ApiService) {}

  getWorkerProfiles(filters?: { city?: string; specialization?: string }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.city) {
        params = params.set('city', filters.city);
      }
      if (filters.specialization) {
        params = params.set('specialization', filters.specialization);
      }
    }
    return this.api.get<any>('/profiles/workers', params);
  }

  getWorkerProfileById(id: string): Observable<any> {
    return this.api.get<any>(`/profiles/workers/${id}`);
  }

  getMyProfile(): Observable<any> {
    return this.api.get<any>('/profiles/worker/me');
  }

  createMyProfile(body: FormData | any): Observable<any> {
    return this.api.post<any>('/profiles/worker/me', body);
  }

  updateMyProfile(body: FormData | any): Observable<any> {
    return this.api.put<any>('/profiles/worker/me', body);
  }

  patchMyProfile(body: FormData | any): Observable<any> {
    return this.api.patch<any>('/profiles/worker/me', body);
  }

  deleteMyProfile(): Observable<any> {
    return this.api.delete<any>('/profiles/worker/me');
  }
}
