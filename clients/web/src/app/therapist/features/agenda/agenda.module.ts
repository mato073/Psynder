import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AgendaRoutingModule } from './agenda-routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SharedModule} from '../../../shared/shared.module';
import { TherapistSharedModule } from '../../therapist-shared/therapist-shared.module';

import { AgendaPageComponent } from './containers/agenda-page/agenda-page.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { CreateAppointmentModalComponent } from './components/create-appointment-modal/create-appointment-modal.component';
import { ClientPickerComponent } from './components/client-picker/client-picker.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TherapistSharedModule,
    AgendaRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [
    AgendaPageComponent,
    AgendaComponent,
    CreateAppointmentModalComponent,
    ClientPickerComponent
  ],
})
export class AgendaModule {}
