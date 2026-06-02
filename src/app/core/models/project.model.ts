import { UserPublic, Location } from './user.model';

export interface Project {
  _id: string;
  client: UserPublic;
  title: string;
  description?: string;
  category?: string;
  location?: Location;
  budget?: number;
  status: 'open' | 'closed' | 'in-progress';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  category?: string;
  location?: Location;
  budget?: number;
  status?: 'open' | 'closed' | 'in-progress';
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  category?: string;
  location?: Location;
  budget?: number;
}
