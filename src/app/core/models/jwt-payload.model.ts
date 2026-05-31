import { UserRole } from './user.model';

export interface JwtPayload {
    sub: string; // user id
    role: UserRole; // user role
    exp: number; // expiration date
    iat: number; // issue date
}