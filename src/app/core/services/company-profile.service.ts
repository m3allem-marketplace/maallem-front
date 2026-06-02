import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyProfileService {
  constructor(private api: ApiService) {}

  getCompanyProfiles(filters?: { city?: string; name?: string }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.city) {
        params = params.set('city', filters.city);
      }
      if (filters.name) {
        params = params.set('name', filters.name);
      }
    }
    return this.api.get<any>('/profiles/companies', params);
  }

  getCompanyProfileById(id: string): Observable<any> {
    return this.api.get<any>(`/profiles/companies/${id}`);
  }

  getMyProfile(): Observable<any> {
    return this.api.get<any>('/profiles/company/me');
  }

  createMyProfile(body: FormData | any): Observable<any> {
    return this.api.post<any>('/profiles/company/me', body);
  }

  updateMyProfile(body: FormData | any): Observable<any> {
    return this.api.put<any>('/profiles/company/me', body);
  }

  patchMyProfile(body: FormData | any): Observable<any> {
    return this.api.patch<any>('/profiles/company/me', body);
  }

  deleteMyProfile(): Observable<any> {
    return this.api.delete<any>('/profiles/company/me');
  }
}
