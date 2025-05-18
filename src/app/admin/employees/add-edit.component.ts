import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import {
  EmployeeService,
  AlertService,
  AccountService,
  DepartmentService,
} from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form!: UntypedFormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  accounts: any[] = [];
  departments: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private accountService: AccountService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // Initialize form with default values
    this.form = this.formBuilder.group({
      userId: ['', [Validators.required]],
      employeeId: ['', [Validators.required]], // This is the display ID (e.g., EMP-01)
      departmentId: ['', [Validators.required]],
      position: ['', [Validators.required]],
      hireDate: ['', [Validators.required]],
      isActive: [true],
    });

    // Load accounts and departments
    this.loadAccounts();
    this.loadDepartments();

    if (!this.isAddMode) {
      this.loadEmployee();
    }
  }

  private loadAccounts() {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts.filter(
            (account) => account.isActive === true
          );
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }

  private loadDepartments() {
    this.departmentService
      .getAll()
      .pipe(first())
      .subscribe({
        next: (departments) => {
          this.departments = departments;
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }

  private loadEmployee() {
    this.employeeService
      .getById(this.id)
      .pipe(first())
      .subscribe({
        next: (employee) => {
          this.form.patchValue({
            ...employee,
            departmentId: employee.departmentId.toString(), // Ensure string for form
            userId: employee.userId.toString(), // Ensure string for form
          });
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const formValue = {
      ...this.form.value,
      departmentId: parseInt(this.form.value.departmentId, 10), // Convert to integer
      userId: parseInt(this.form.value.userId, 10), // Convert to integer
    };

    if (this.isAddMode) {
      this.createEmployee(formValue);
    } else {
      this.updateEmployee(formValue);
    }
  }

  private createEmployee(formValue: any) {
    this.employeeService
      .create(formValue)
      .pipe(first())
      .subscribe({
        next: () => {
          // Success message is handled in EmployeeService
          this.router.navigate(['/admin/employees']);
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        },
      });
  }

  private updateEmployee(formValue: any) {
    this.employeeService
      .update(this.id, formValue)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', {
            keepAfterRouteChange: true,
          });
          this.router.navigate(['/admin/employees']);
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        },
      });
  }
}
