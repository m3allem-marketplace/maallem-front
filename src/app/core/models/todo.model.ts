export interface TodoQuantity {
  target: number;
  completed: number;
  unit: string;
}

export interface TodoWorker {
  name: string;
  source: 'Internal' | 'External';
  role?: string;
  dailyRate?: number;
  assignedQuantity?: number;
}

export interface TodoTimeline {
  expectedStartDate?: string | Date;
  expectedEndDate?: string | Date;
  actualStartDate?: string | Date;
  actualEndDate?: string | Date;
}

export interface TodoInspection {
  isApproved: boolean;
  approvedBy?: string;
  notes?: string;
  date?: string | Date;
}

export interface TodoAttachment {
  url: string;
  type: 'Before' | 'During' | 'After';
}

export interface TodoProgressLog {
  _id?: string;
  updatedBy: string;
  date: string | Date;
  addedQuantity: number;
  note?: string;
}

export interface Todo {
  _id?: string;
  user?: string;
  title: string;
  description?: string; // Kept for backward compatibility
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  location?: string;
  
  quantity?: TodoQuantity;
  workers?: TodoWorker[];
  timeline?: TodoTimeline;
  status: 'Pending' | 'In Progress' | 'Paused' | 'Completed' | 'Under Inspection' | 'pending' | 'scheduled' | 'completed';
  inspection?: TodoInspection;
  attachments?: TodoAttachment[];
  progressLogs?: TodoProgressLog[];

  scheduledDate?: string; // Kept for backward compatibility
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  location?: string;
  quantity?: {
    target: number;
    unit: string;
  };
  workers?: TodoWorker[];
  timeline?: {
    expectedStartDate?: string;
    expectedEndDate?: string;
  };
  status?: 'Pending' | 'In Progress' | 'Paused' | 'Completed' | 'Under Inspection' | 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string; // Kept for backward compatibility
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  location?: string;
  quantity?: {
    target: number;
    completed?: number;
    unit: string;
  };
  workers?: TodoWorker[];
  timeline?: {
    expectedStartDate?: string | Date;
    expectedEndDate?: string | Date;
    actualStartDate?: string | Date;
    actualEndDate?: string | Date;
  };
  status?: 'Pending' | 'In Progress' | 'Paused' | 'Completed' | 'Under Inspection' | 'pending' | 'scheduled' | 'completed';
  inspection?: TodoInspection;
  progressLogs?: TodoProgressLog[];
  scheduledDate?: string; // Kept for backward compatibility
}
