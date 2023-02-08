import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { TherapistSharedModule } from '../../therapist-shared/therapist-shared.module';

import { HomeComponent } from './containers/home/home.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    TherapistSharedModule
  ],
  declarations: [
    HomeComponent,
    AppointmentListComponent
  ]
})
export class HomeModule { }
