import { UserPublic } from './user.model';
import { Project } from './project.model';

export interface Proposal {
  _id: string;
  project: Project;
  worker: UserPublic;
  message?: string;
  price: number;
  estimatedDuration?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProposalRequest {
  message?: string;
  price: number;
  estimatedDuration?: string;
}

export interface UpdateProposalRequest {
  message?: string;
  price?: number;
  estimatedDuration?: string;
}
