import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { QuillModule} from 'ngx-quill';
import { NgxColorsModule } from 'ngx-colors';

import { SharedModule } from '../../../shared/shared.module';
import { TherapistSharedModule } from '../../therapist-shared/therapist-shared.module';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BasicInfoModalComponent } from './components/basic-info-modal/basic-info-modal.component';
import { SpecialtySlotComponent } from './components/specialty-slot/specialty-slot.component';
import { AddSpecialtyModalComponent } from './components/add-specialty-modal/add-specialty-modal.component';
import { TagSlotComponent } from './components/tag-slot/tag-slot.component';
import { AddTagModalComponent } from './components/add-tag-modal/add-tag-modal.component';
import { AvailabilitiesComponent } from './containers/availabilities/availabilities.component';
import { DayAvailabilitiesModalComponent } from './components/day-availabilities-modal/day-availabilities-modal.component';
import { TimeslotComponent } from './components/timeslot/timeslot.component';
import { DayAvailabilitiesSlotComponent } from './components/day-availabilities-slot/day-availabilities-slot.component';
import { DescriptionComponent } from './components/description/description.component';
import { AppointmentTypesComponent } from './components/appointment-types/appointment-types.component';
import { AppointmentTypeModalComponent } from './components/appointment-type-modal/appointment-type-modal.component';

import { AppointmentDurationPipe } from './pipes/appointment-duration.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AutosizeModule,
    QuillModule,
    NgxColorsModule,
    TherapistSharedModule,
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfilePageComponent,
    ProfileComponent,
    BasicInfoModalComponent,
    SpecialtySlotComponent,
    AddSpecialtyModalComponent,
    TagSlotComponent,
    AddTagModalComponent,
    AvailabilitiesComponent,
    DayAvailabilitiesModalComponent,
    DayAvailabilitiesSlotComponent,
    TimeslotComponent,
    DescriptionComponent,
    AppointmentTypesComponent,
    AppointmentTypeModalComponent,

    AppointmentDurationPipe
  ],
})
export class ProfileModule { }
