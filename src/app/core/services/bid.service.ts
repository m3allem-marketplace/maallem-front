import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectService } from './project.service';
import { ProposalService } from './proposal.service';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  constructor(
    private projectService: ProjectService,
    private proposalService: ProposalService
  ) {}

  getBidRequests(): Observable<any> {
    return this.projectService.getProjects({ status: 'open' });
  }

  getMyBidRequests(): Observable<any> {
    // In real app, filtered by the authenticated customer's projects
    return this.projectService.getProjects();
  }

  postBidRequest(payload: any): Observable<any> {
    return this.projectService.createProject(payload);
  }

  getOffersForRequest(projectId: string): Observable<any> {
    return this.proposalService.getProposalsForProject(projectId);
  }

  submitBid(projectId: string, payload: any): Observable<any> {
    return this.proposalService.submitProposal(projectId, payload);
  }

  acceptBid(proposalId: string): Observable<any> {
    return this.proposalService.updateProposalStatus(proposalId, 'accepted');
  }

  rejectBid(proposalId: string): Observable<any> {
    return this.proposalService.updateProposalStatus(proposalId, 'rejected');
  }
}
