import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '@app/_services';
import { Employee } from '@app/_models';

@Component({
  templateUrl: 'list.component.html',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  isDeleting = false;
  showTransferModal = false;
  selectedEmployee: Employee | null = null;
  showWorkflowModal = false;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    console.log('Fetching updated employee list...');
    this.employeeService
      .getAll()
      .pipe(first())
      .subscribe({
        next: (employees) => {
          console.log('Updated employees list:', employees);
          this.employees = employees;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.alertService.error('Error fetching employees');
          this.cdr.markForCheck();
        },
      });
  }

  deleteEmployee(id: string) {
    const employee = this.employees.find((x) => x.id === id);
    if (!employee) return;

    this.isDeleting = true;
    this.employeeService
      .delete(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.employees = this.employees.filter((x) => x.id !== id);
          this.alertService.success('Employee deleted successfully');
          this.isDeleting = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.alertService.error(error?.message || 'Error deleting employee');
          this.isDeleting = false;
          this.cdr.markForCheck();
        },
      });
  }

  openTransferModal(employee: Employee) {
    if (!employee || !employee.id) {
      this.alertService.error('Invalid employee data');
      return;
    }
    this.selectedEmployee = { ...employee };
    this.showTransferModal = true;
    this.cdr.markForCheck();
  }

  closeTransferModal() {
    this.showTransferModal = false;
    this.selectedEmployee = null;
    this.cdr.markForCheck();
  }

  onTransferComplete() {
    this.loadEmployees();
    this.closeTransferModal();
  }

  openWorkflowModal(employee: Employee) {
    if (!employee || !employee.id) {
      console.error('Invalid employee data:', employee);
      this.alertService.error('Invalid employee data');
      return;
    }
    this.selectedEmployee = employee;
    this.showWorkflowModal = true;
    console.log('Opening workflow modal with state:', {
      showWorkflowModal: this.showWorkflowModal,
      selectedEmployee: this.selectedEmployee,
      employeeId: this.selectedEmployee.id,
    });
    this.cdr.markForCheck();
  }

  closeWorkflowModal() {
    this.showWorkflowModal = false;
    this.selectedEmployee = null;
    console.log('Closed workflow modal');
    this.cdr.markForCheck();
  }

  onWorkflowSaved() {
    this.loadEmployees();
    this.closeWorkflowModal();
  }
}
