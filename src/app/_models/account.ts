import { Role } from './role';
import { Employee } from './employee'

export class Account {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    isActive: boolean
    jwtToken?: string;
    employee?: Employee
}