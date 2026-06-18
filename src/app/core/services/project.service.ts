import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private api: ApiService) {}

  getProjects(filters?: Record<string, string>): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.api.get<any>('/projects', params).pipe(
      map((res: any) => {
        let list = res?.data?.projects || res?.data || res || [];
        if (Array.isArray(list)) {
          list.forEach((project: any) => {
            const metaStr = localStorage.getItem(`direct_booking_${project._id}`);
            if (metaStr) {
              try {
                const meta = JSON.parse(metaStr);
                if (new Date(meta.directRequestExpiresAt).getTime() < Date.now()) {
                  localStorage.removeItem(`direct_booking_${project._id}`);
                } else {
                  Object.assign(project, meta);
                }
              } catch (e) {
                console.error('Failed to parse direct booking metadata', e);
              }
            }
          });
        }
        return res;
      })
    );
  }

  getAssignedProjects(filters?: Record<string, string>): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.api.get<any>('/projects/assigned/me', params);
  }

  createProject(payload: CreateProjectRequest): Observable<any> {
    const backendPayload: any = { ...payload };
    
    // Remove unsupported custom fields before sending to backend to prevent Joi/AppError 500 crashes
    delete backendPayload.matchingType;
    delete backendPayload.directRequestExpiresAt;
    delete backendPayload.worker;

    if (payload.workerId) {
      backendPayload.workerId = payload.workerId;
    }

    if (backendPayload.status) {
      let backendStatus: 'open' | 'closed' | 'in-progress' = 'open';
      const status = backendPayload.status;
      if (status === 'open') {
        backendStatus = 'open';
      } else if (status === 'in-progress' || status === 'pending' || status === 'confirmed' || status === 'direct_pending') {
        backendStatus = 'in-progress';
      } else if (status === 'closed' || status === 'completed' || status === 'cancelled') {
        backendStatus = 'closed';
      }
      backendPayload.status = backendStatus;
    }
    return this.api.post<any>('/projects', backendPayload);
  }

  getProjectById(id: string): Observable<any> {
    return this.api.get<any>(`/projects/${id}`).pipe(
      map((res: any) => {
        const project = res?.data?.project || res?.data || res;
        if (project) {
          const metaStr = localStorage.getItem(`direct_booking_${project._id}`);
          if (metaStr) {
            try {
              const meta = JSON.parse(metaStr);
              if (new Date(meta.directRequestExpiresAt).getTime() < Date.now()) {
                localStorage.removeItem(`direct_booking_${project._id}`);
              } else {
                Object.assign(project, meta);
              }
            } catch (e) {
              console.error('Failed to parse direct booking metadata', e);
            }
          }
        }
        return res;
      })
    );
  }

  updateProject(id: string, payload: UpdateProjectRequest): Observable<any> {
    return this.api.put<any>(`/projects/${id}`, payload);
  }

  deleteProject(id: string): Observable<any> {
    localStorage.removeItem(`direct_booking_${id}`);
    return this.api.delete<any>(`/projects/${id}`);
  }

  updateProjectStatus(id: string, status: 'open' | 'closed' | 'in-progress' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'direct_pending'): Observable<any> {
    if (status !== 'direct_pending') {
      localStorage.removeItem(`direct_booking_${id}`);
    }
    let backendStatus: 'open' | 'closed' | 'in-progress' = 'open';
    if (status === 'open') {
      backendStatus = 'open';
    } else if (status === 'in-progress' || status === 'pending' || status === 'confirmed' || status === 'direct_pending') {
      backendStatus = 'in-progress';
    } else if (status === 'closed' || status === 'completed' || status === 'cancelled') {
      backendStatus = 'closed';
    }
    return this.api.patch<any>(`/projects/${id}/status`, { status: backendStatus });
  }
}

