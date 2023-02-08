import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';

import { ProfileComponent } from './container/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { BasicInfoModalComponent } from './components/basic-info-modal/basic-info-modal.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { InfoComponent } from './components/info/info.component';
import { SharedModule } from '../../../shared/shared.module';
import { ExerciseModalComponent } from './components/exercise-modal/exercise-modal.component';
//import { AppointmentComponent } from './components/appointment/appointment.component';
import { QuestionaireModalComponent } from './components/questionaire-modal/questionaire-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    AutosizeModule,
    FormsModule
  ],
  declarations: [
    ProfileComponent,
    BasicInfoModalComponent,
    ExercisesComponent,
    InfoComponent,
    ExerciseModalComponent,
    //AppointmentComponent,
    QuestionaireModalComponent
  ],
  // bootstrap:[ProfileComponent]
})
export class ProfileModule { }
