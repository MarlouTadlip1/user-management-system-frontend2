export class Workflow {
  id: string;
  employeeId: string;
  type: string;
  details?: any; // Json in Prisma
  status: string;
  createdById: number;
  created: string; // ISO string
  updated: string; // ISO string
  employee?: {
    id: number;
    employeeId: string; // e.g., EMP-01
    position: string;
    hireDate: string; // ISO string
    isActive: boolean;
    userId?: number;
    departmentId?: number;
  };
  createdBy?: {
    id: number;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    dateCreated: string; // ISO string
    isVerified: boolean;
    isActive: boolean;
  };
}

export enum WorkflowType {
  PROMOTION = 'Promotion',
  TRANSFER = 'Transfer',
  TERMINATION = 'Termination',
  OTHER = 'Other',
  ONBOARDING = 'Onboarding',
}

export enum WorkflowStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}
