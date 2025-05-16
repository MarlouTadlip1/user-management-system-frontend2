import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlertService } from './alert.service'; // Import AlertService

export interface RequestItem {
  name: string;
  quantity: number;
}

export interface Request {
  id?: number;
  type: string;
  employeeId: string;
  items: RequestItem[]; // Changed from requestItems to match RequestComponent
  status?: string;
  created?: string;
  updated?: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = `${environment.apiUrl}/requests`;

  constructor(
    private http: HttpClient,
    private alertService: AlertService // Add AlertService
  ) {}

  getAll(): Observable<Request[]> {
    return this.http
      .get<Request[]>(this.baseUrl)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'Error fetching requests')
        )
      );
  }

  getById(id: number): Observable<Request> {
    return this.http
      .get<Request>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error) => this.handleError(error, 'Error fetching request'))
      );
  }

  create(request: Request): Observable<Request> {
    return this.http.post<Request>(this.baseUrl, request).pipe(
      map((response) => {
        this.alertService.success('Request created successfully', {
          autoClose: false,
        });
        return response;
      }),
      catchError((error) => this.handleError(error, 'Error creating request'))
    );
  }

  update(id: number, request: Request): Observable<Request> {
    return this.http.put<Request>(`${this.baseUrl}/${id}`, request).pipe(
      map((response) => {
        this.alertService.success('Request updated successfully', {
          autoClose: false,
        });
        return response;
      }),
      catchError((error) => this.handleError(error, 'Error updating request'))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        this.alertService.success('Request deleted successfully', {
          autoClose: false,
        });
        return;
      }),
      catchError((error) => this.handleError(error, 'Error deleting request'))
    );
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    this.alertService.error(message, { autoClose: false });
    return throwError(() => new Error(message));
  }
}
