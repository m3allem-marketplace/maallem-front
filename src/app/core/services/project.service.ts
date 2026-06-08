import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private api: ApiService) {}

  getProjects(filters?: { status?: string; city?: string; category?: string }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.city) {
        params = params.set('city', filters.city);
      }
      if (filters.category) {
        params = params.set('category', filters.category);
      }
    }
    return this.api.get<any>('/projects', params);
  }

  createProject(payload: CreateProjectRequest): Observable<any> {
    return this.api.post<any>('/projects', payload);
  }

  getProjectById(id: string): Observable<any> {
    return this.api.get<any>(`/projects/${id}`);
  }

  updateProject(id: string, payload: UpdateProjectRequest): Observable<any> {
    return this.api.put<any>(`/projects/${id}`, payload);
  }

  deleteProject(id: string): Observable<any> {
    return this.api.delete<any>(`/projects/${id}`);
  }

  updateProjectStatus(id: string, status: 'open' | 'closed' | 'in-progress'): Observable<any> {
    return this.api.patch<any>(`/projects/${id}/status`, { status });
  }
}
