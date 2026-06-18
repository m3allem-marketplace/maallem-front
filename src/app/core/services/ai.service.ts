import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly api = inject(ApiService);

  analyzeTask(payload: { serviceType: string; description: string }): Observable<any> {
    return this.api.post<any>('/ai/analyze', payload);
  }
}
