import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AccountService } from '../../_services';
import { RequestService } from '../../_services/request.service';
import { EmployeeService } from '../../_services/employee.service';
import { AlertService } from '../../_services/alert.service'; // Import AlertService
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  requests: any[] = [];
  employees: any[] = []; // Store employee data
  showModal = false;
  requestForm!: FormGroup;

  constructor(
    private requestService: RequestService,
    private accountService: AccountService,
    private employeeService: EmployeeService,
    private alertService: AlertService, // Add AlertService
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRequests();
    this.loadEmployees();
  }

  // ✅ Initialize form with default item group
  private initForm() {
    this.requestForm = this.fb.group({
      id: [null],
      type: ['', Validators.required],
      employeeId: ['', Validators.required],
      items: this.fb.array([]),
      status: [''],
    });
  }

  // ✅ Get form array for items
  get items(): FormArray {
    return this.requestForm.get('items') as FormArray;
  }

  // ✅ Create an item FormGroup
  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  // ➕ Add item to form
  addItem() {
    this.items.push(this.createItem());
  }

  // ➖ Remove item by index
  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // 📥 Load existing requests
  loadRequests() {
    this.requestService.getAll().subscribe({
      next: (data) => {
        this.requests = data;
        console.log('Loaded requests:', this.requests);
      },
      error: (err) => {
        console.error('Error loading requests', err);
        this.alertService.error('Error fetching requests', {
          autoClose: false,
        });
      },
    });
  }

  // 📥 Load employees for dropdown
  loadEmployees() {
    this.employeeService
      .getAll()
      .pipe(first()) // Align with ListComponent
      .subscribe({
        next: (data) => {
          this.employees = data;
          console.log('Loaded employees:', this.employees); // Debug employee data
        },
        error: (err) => {
          console.error('Error loading employees', err);
          this.alertService.error('Error fetching employees', {
            autoClose: false,
          });
        },
      });
  }

  // 🔍 Get employee name by ID for display
  getEmployeeName(employeeId: string): string {
    const employee = this.employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name || 'Unknown' : employeeId; // Use 'name' or adjust based on Employee model
  }

  // 👤 Logged-in user
  account() {
    return this.accountService.accountValue;
  }

  // ➕ Show Add Modal
  add() {
    this.showModal = true;
    this.requestForm.setControl('items', this.fb.array([this.createItem()])); // Ensure at least one item
  }

  // ❌ Cancel & reset modal form
  cancel() {
    this.showModal = false;
    this.requestForm.reset();
    this.requestForm.setControl('items', this.fb.array([this.createItem()])); // Reset items array
  }

  // ✅ Submit new request
  save() {
    if (this.requestForm.invalid) return;
    const data = this.requestForm.value;
    if (data.id) {
      // Update
      this.requestService.update(data.id, data).subscribe({
        next: () => {
          this.loadRequests();
          this.cancel();
        },
        error: (err) => {
          console.error('Error updating request', err);
          this.alertService.error('Error updating request', {
            autoClose: false,
          });
        },
      });
    } else {
      // Create
      this.requestService.create(data).subscribe({
        next: () => {
          this.loadRequests();
          this.cancel();
        },
        error: (err) => {
          console.error('Error creating request', err);
          this.alertService.error('Error creating request', {
            autoClose: false,
          });
        },
      });
    }
  }

  // ✏️ Edit request
  edit(id: number) {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return;
    this.showModal = true;
    // Patch form values
    this.requestForm.patchValue({
      id: req.id,
      type: req.type,
      employeeId: req.employeeId,
      status: req.status || '',
    });
    // Patch items array
    const itemsArray = this.fb.array(
      req.items.map((item: any) =>
        this.fb.group({
          name: [item.name, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        })
      )
    );
    this.requestForm.setControl('items', itemsArray);
  }

  // 🗑️ Delete request
  delete(id: number) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requestService.delete(id).subscribe({
        next: () => {
          this.loadRequests();
          this.alertService.success('Request deleted successfully', {
            autoClose: false,
          });
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.alertService.error('Error deleting request', {
            autoClose: false,
          });
        },
      });
    }
  }
}
