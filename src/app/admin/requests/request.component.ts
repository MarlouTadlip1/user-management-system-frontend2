import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AccountService } from '../../_services';
import { RequestService } from '../../_services/request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  requests: any[] = [];
  showModal = false;
  requestForm!: FormGroup;

  constructor(
    private requestService: RequestService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRequests();
  }

  // ✅ Initialize form with default item group
  private initForm() {
    this.requestForm = this.fb.group({
      id: [null], // <-- add this
      type: ['', Validators.required],
      employeeId: ['', Validators.required],
      items: this.fb.array([]),
      status: ['']
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
      quantity: [1, [Validators.required, Validators.min(1)]]
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
        }
    });
  }

  // 👤 Logged-in user
  account() {
    return this.accountService.accountValue;
  }

  // ➕ Show Add Modal
  add() {
    this.showModal = true;
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
            }
        });
    } else {
        // Create
        this.requestService.create(data).subscribe({
            next: () => {
                this.loadRequests();
                this.cancel();
            }
        });
    }
  }

  // ✏️ Placeholder edit action
  edit(id: number) {
    const req = this.requests.find(r => r.id === id);
    if (!req) return;
    this.showModal = true;
    this.requestForm.patchValue(req); // This should include id if your form has it
    // If you use FormArray for items, patch that as well
  }

  // 🗑️ Delete request
  delete(id: number) {
    if (confirm('Are you sure you want to delete this request?')) {
        this.requestService.delete(id).subscribe({
            next: () => this.loadRequests(),
            error: err => console.error('Delete failed', err)
        });
    }
  }
}