import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';

import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { EmployeeTransferComponent } from './employee-transfer/employee-transfer.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    RouterModule,
  ],
  declarations: [
    SubNavComponent,
    LayoutComponent,
    OverviewComponent,
    EmployeeTransferComponent,
  ],
})
export class AdminModule {}
