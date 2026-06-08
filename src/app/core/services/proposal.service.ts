import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateProposalRequest, UpdateProposalRequest } from '../models/proposal.model';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  constructor(private api: ApiService) {}

  getProposalsForProject(projectId: string): Observable<any> {
    return this.api.get<any>(`/projects/${projectId}/proposals`);
  }

  submitProposal(projectId: string, payload: CreateProposalRequest): Observable<any> {
    return this.api.post<any>(`/projects/${projectId}/proposals`, payload);
  }

  getMyProposals(): Observable<any> {
    return this.api.get<any>('/proposals/my');
  }

  updateProposal(id: string, payload: UpdateProposalRequest): Observable<any> {
    return this.api.put<any>(`/proposals/${id}`, payload);
  }

  withdrawProposal(id: string): Observable<any> {
    return this.api.delete<any>(`/proposals/${id}`);
  }

  updateProposalStatus(id: string, status: 'accepted' | 'rejected'): Observable<any> {
    return this.api.patch<any>(`/proposals/${id}/status`, { status });
  }
}
