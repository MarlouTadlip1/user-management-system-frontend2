import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestRoutingModule } from './requests-routing.module';
import { RequestComponent } from './request.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RequestRoutingModule
  ],
  declarations: [
    RequestComponent
  ]
})
export class RequestsModule { }