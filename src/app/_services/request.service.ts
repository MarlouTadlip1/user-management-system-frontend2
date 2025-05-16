// src/app/_services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface RequestItem {
  name: string;
  quantity: number;
}

export interface Request {
  id?: number;
  type: string;
  employeeId: string;
  requestItems: RequestItem[];
  status?: string;
  created?: string;
  updated?: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(this.baseUrl);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(`${this.baseUrl}/${id}`);
  }

  create(request: Request): Observable<Request> {
    return this.http.post<Request>(this.baseUrl, request);
  }

  update(id: number, request: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/requests/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete(`/requests/${id}`);
  }
}