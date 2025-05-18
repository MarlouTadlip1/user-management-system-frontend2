import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Employee } from '../_models/employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './alert.service';
import { WorkflowService } from './workflow.service';

const baseUrl = `${environment.apiUrl}/employees`;

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employeeSubject: BehaviorSubject<Employee | null> =
    new BehaviorSubject<Employee | null>(null);
  public employee: Observable<Employee | null> =
    this.employeeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private workflowService: WorkflowService
  ) {}

  private handleError(error: HttpErrorResponse) {
    this.alertService.error('An error occurred', { autoClose: false });
    return throwError('An error occurred');
  }

  public get employeeValue(): Employee | null {
    return this.employeeSubject.value;
  }

  create(params: any) {
    return this.http.post<Employee>(baseUrl, params).pipe(
      switchMap((employee) => {
        this.employeeSubject.next(employee);
        // Create Onboarding workflow
        const workflowParams = {
          type: 'Onboarding',
          details: JSON.stringify({
            step: 'Initial onboarding',
            description: `Onboarding process for ${employee.employeeId}`,
          }),
          status: 'Pending',
          employeeId: employee.id, // Convert to number
        };
        return this.workflowService.create(workflowParams).pipe(
          map(() => {
            this.alertService.success(
              'Employee and onboarding workflow created successfully',
              {
                autoClose: false,
              }
            );
            return employee;
          }),
          catchError((workflowError) => {
            this.alertService.error(
              'Employee created but failed to create onboarding workflow'
            );
            return throwError(workflowError);
          })
        );
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  getAll() {
    return this.http.get<Employee[]>(baseUrl).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  getById(id: string) {
    return this.http.get<Employee>(`${baseUrl}/${id}`).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  update(id: string, params: any) {
    return this.http.put<Employee>(`${baseUrl}/${id}`, params).pipe(
      map((employee) => {
        this.employeeSubject.next(employee);
        this.alertService.success('Employee updated successfully', {
          autoClose: false,
        });
        return employee;
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`).pipe(
      map(() => {
        this.alertService.success('Employee deleted successfully', {
          autoClose: false,
        });
        return true;
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  transferDepartment(employeeId: string, newDepartmentId: string) {
    return this.getById(employeeId).pipe(
      switchMap((currentEmployee) => {
        const updateData = {
          ...currentEmployee,
          departmentId: parseInt(newDepartmentId, 10), // Convert to number
        };
        return this.update(employeeId, updateData).pipe(
          switchMap((updatedEmployee) => {
            // Create Department Transfer workflow
            const workflowParams = {
              type: 'DepartmentTransfer',
              details: JSON.stringify({
                fromDepartmentId: currentEmployee.departmentId,
                toDepartmentId: parseInt(newDepartmentId, 10),
                description: `Transferred employee ${currentEmployee.employeeId} to ${newDepartmentId}`,
              }),
              status: 'Pending',
              employeeId: employeeId, // Keep as string
            };
            return this.workflowService.create(workflowParams).pipe(
              map(() => {
                this.alertService.success(
                  'Employee transferred and workflow created successfully',
                  { autoClose: false }
                );
                return updatedEmployee;
              }),
              catchError((workflowError) => {
                this.alertService.error(
                  'Employee transferred but failed to create transfer workflow'
                );
                return throwError(workflowError);
              })
            );
          })
        );
      })
    );
  }
}
