import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, finalize } from "rxjs/operators";

import { environment } from '@environments/environment';
import { Department } from "../_models/department";
import { AccountService } from "./account.service";

const baseUrl = `${environment.apiUrl}/departments`;


@Injectable({ providedIn: 'root' })
export class DepartmentService{
  private departmentSubject: BehaviorSubject<Department>
  public department: Observable<Department>

  constructor(
    // private router: Router,
    private http: HttpClient,
  ){
    this.departmentSubject = new BehaviorSubject<Department>(null)
    this.department = this.departmentSubject.asObservable()
  }

  public get departmentValue(): Department {
    return this.departmentSubject.value
  }

  getAll() {
    return this.http.get<Department[]>(baseUrl)
  }
  
  create(params){
    return this.http.post(baseUrl, params)
  }

  update(id, params){
    return this.http.put(`${baseUrl}/${id}`, params)
      .pipe(map((department: any) => {
        // if(department.id === this.departmentValue.id){
        //   department = { ...this.departmentValue, ...department}
          this.departmentSubject.next(department)
        // }
        return department
      }))
  }

  getById(id: string){
    return this.http.get<Department>(`${baseUrl}/${id}`)
  }

  delete(id: string){
    return this.http.delete(`${baseUrl}/${id}`)
  }

}