// ─── User Model ──────────────────────────────────────────────────────────────
// Merged: our full model (WorkerProfile, CompanyProfile, etc.)
// + Engineer 2's UserRole as string type (used by auth store)

export type UserRole = 'user' | 'worker' | 'company' | 'admin';

export interface UserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Location {
  address?: string;
  city?: string;
}

export interface User extends UserPublic {
  phone?: string;
  isVerified:      boolean;
  isActive:        boolean;
  workerProfile:   string | null;
  companyProfile:  string | null;
  createdAt:       string;
  updatedAt:       string;
}

export interface CustomerProfile {
  userId:         string;
  savedWorkerIds: string[];
  totalBookings:  number;
  totalSpend:     number;
}

export interface WorkerAvailabilitySlot {
  dayOfWeek: number; // 0-6
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  isActive: boolean;
}

export interface WorkerProfile {
  _id?:               string;
  user:               UserPublic;
  avatar?:            string;
  bio?:               string;
  experience?:        string;
  specializations?:   string[];
  location?:          Location;
  phone?:             string;
  portfolioImages?:   string[];
  idCard?:            string;
  isProfileComplete?: boolean;
  availabilities?:    WorkerAvailabilitySlot[];
  hourlyRate?:        number;
  offersFlatRate?:    boolean;
  createdAt?:         string;
  updatedAt?:         string;
}


export interface CompanyProfile {
  _id?:               string;
  user:               UserPublic;
  logo?:              string;
  companyName?:       string;
  bio?:               string;
  employeeCount?:     number;
  location?:          Location;
  contactPhones?:     string[];
  projectImages?:     string[];
  isProfileComplete?: boolean;
  createdAt?:         string;
  updatedAt?:         string;
}
