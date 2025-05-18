import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Workflow } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private baseUrl = `${environment.apiUrl}/workflows`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Workflow[]> {
    return this.http
      .get<Workflow[]>(this.baseUrl)
      .pipe(map((response) => this.mapWorkflows(response)));
  }

  getByEmployeeId(employeeId: string | number): Observable<Workflow[]> {
    const idAsNumber = parseInt(employeeId as unknown as string, 10);
    if (isNaN(idAsNumber)) {
      throw new Error('Invalid employeeId: must be a valid number');
    }
    return this.http
      .get<Workflow[]>(`${this.baseUrl}/employeeId/${idAsNumber}`)
      .pipe(map((response) => this.mapWorkflows(response)));
  }

  getById(id: string): Observable<Workflow> {
    return this.http
      .get<Workflow>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.mapWorkflow(response)));
  }

  create(params: Partial<Workflow>): Observable<Workflow> {
    const workflowParams = {
      ...params,
      employeeId:
        params.employeeId !== undefined
          ? parseInt(params.employeeId as unknown as string, 10)
          : undefined,
    };
    if (
      workflowParams.employeeId !== undefined &&
      isNaN(workflowParams.employeeId)
    ) {
      throw new Error('Invalid employeeId: must be a valid number');
    }
    return this.http
      .post<Workflow>(this.baseUrl, workflowParams)
      .pipe(map((response) => this.mapWorkflow(response)));
  }

  update(id: string, params: Partial<Workflow>): Observable<Workflow> {
    const workflowParams = {
      ...params,
      employeeId:
        params.employeeId !== undefined
          ? parseInt(params.employeeId as unknown as string, 10)
          : undefined,
    };
    if (
      workflowParams.employeeId !== undefined &&
      isNaN(workflowParams.employeeId)
    ) {
      throw new Error('Invalid employeeId: must be a valid number');
    }
    return this.http
      .put<Workflow>(`${this.baseUrl}/${id}`, workflowParams)
      .pipe(map((response) => this.mapWorkflow(response)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private mapWorkflows(workflows: any[]): Workflow[] {
    return workflows.map((w) => this.mapWorkflow(w));
  }

  private mapWorkflow(workflow: any): Workflow {
    let parsedDetails: any;
    try {
      parsedDetails =
        typeof workflow.details === 'string'
          ? JSON.parse(workflow.details)
          : workflow.details;
    } catch (error) {
      console.error('Error parsing workflow details:', error);
      parsedDetails = workflow.details;
    }

    return {
      id: workflow.id?.toString(),
      employeeId: workflow.employeeId,
      type: workflow.type,
      details: parsedDetails.description || parsedDetails, // Use description or fallback
      status: workflow.status,
      createdById: workflow.createdById,
      created: workflow.created,
      updated: workflow.updated,
      employee: workflow.employee
        ? {
            id: workflow.employee.id,
            employeeId: workflow.employee.employeeId,
            position: workflow.employee.position,
            hireDate: workflow.employee.hireDate,
            isActive: workflow.employee.isActive,
            userId: workflow.employee.userId,
            departmentId: workflow.employee.departmentId,
          }
        : undefined,
      createdBy: workflow.createdBy
        ? {
            id: workflow.createdBy.id,
            title: workflow.createdBy.title,
            firstName: workflow.createdBy.firstName,
            lastName: workflow.createdBy.lastName,
            email: workflow.createdBy.email,
            role: workflow.createdBy.role,
            dateCreated: workflow.createdBy.dateCreated,
            isVerified: workflow.createdBy.isVerified,
            isActive: workflow.createdBy.isActive,
          }
        : undefined,
    };
  }
}
