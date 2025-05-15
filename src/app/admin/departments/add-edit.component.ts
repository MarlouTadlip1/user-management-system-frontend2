import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { DepartmentService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html'})
export class AddEditComponent{
  form: UntypedFormGroup
  id: string
  isAddMode: boolean
  loading = false
  submitted = false

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private alertService: AlertService
  ){ }

  ngOnInit(){
    this.id = this.route.snapshot.params['id']
    this.isAddMode = !this.id
    
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })

    if(!this.isAddMode){
      this.departmentService.getById(this.id)  
        .pipe(first())
        .subscribe(x => this.form.patchValue(x))
    }
  }

  get f() { return this.form.controls}

  onSubmit(){
    
    this.submitted = true
    this.alertService.clear()

    if(this.form.invalid) return

    this.loading = true

    if(this.isAddMode){
      this.createDepartment()
    }
    else{
      this.editDepartment()
    }
  }

  private createDepartment(){
    this.departmentService.create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Department created succesfully', { keepAfterRouteChange: true})
          this.router.navigate(['/admin/departments'])
        },
        error: error => {
          this.alertService.error(error)
          console.log('error on department shi')
          this.loading = false
        }
      })
  }

  private editDepartment(){
    this.departmentService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                  console.log('success!')
                    this.alertService.success('Updated successful', { keepAfterRouteChange: true });
                    this.router.navigate(['/admin/departments']);
                },
                error: error => {
                  console.log('error!')
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
  }
}