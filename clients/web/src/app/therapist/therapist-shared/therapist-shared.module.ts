import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { UpdateAppointmentModalComponent } from './components/update-appointment-modal/update-appointment-modal.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    SharedModule
  ],
  declarations: [
    UpdateAppointmentModalComponent,
  ],
  exports: [
    UpdateAppointmentModalComponent,
  ]
})
export class TherapistSharedModule { }
