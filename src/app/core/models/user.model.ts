// User model placeholder
// Purpose: Define user data structure

export type UserRole = 'user' | 'worker' | 'company';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    isVerified: boolean;
    isActive: boolean;
    workerProfile: string | null;
    companyProfile: string | null;
    createdAt: string;
    updatedAt: string;
}
