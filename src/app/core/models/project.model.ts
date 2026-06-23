import { UserPublic, Location } from './user.model';

export interface Project {
  _id: string;
  client: UserPublic;
  worker?: UserPublic | null;
  title: string;
  description?: string;
  category?: string;
  location?: Location;
  budget?: number;
  matchingType?: 'direct' | 'bidding';
  status: 'open' | 'closed' | 'in-progress' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'direct_pending';
  directRequestExpiresAt?: string;
  preAuthAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  category?: string;
  location?: Location;
  budget?: number;
  matchingType?: 'direct' | 'bidding';
  workerId?: string | null;
  status?: 'open' | 'closed' | 'in-progress' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'direct_pending';
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  category?: string;
  location?: Location;
  budget?: number;
}

