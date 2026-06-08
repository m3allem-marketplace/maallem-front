import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private projectService: ProjectService) {}

  getBookings(): Observable<any> {
    return this.projectService.getProjects();
  }

  getBookingById(id: string): Observable<any> {
    return this.projectService.getProjectById(id);
  }

  createBooking(payload: any): Observable<any> {
    const projectPayload = {
      title: payload.serviceId || 'New Job',
      description: payload.notes || '',
      budget: payload.basePrice || 0,
      location: payload.address || {},
      status: 'open' as const,
    };
    return this.projectService.createProject(projectPayload);
  }

  cancelBooking(id: string): Observable<any> {
    return this.projectService.updateProjectStatus(id, 'closed');
  }

  completeBooking(id: string): Observable<any> {
    return this.projectService.updateProjectStatus(id, 'closed');
  }
}
