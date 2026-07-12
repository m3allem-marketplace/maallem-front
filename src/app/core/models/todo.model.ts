export interface Todo {
  _id?: string;
  user?: string;
  title: string;
  description: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
}
