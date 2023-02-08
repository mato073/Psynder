import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { TherapistRoutingModule } from './therapist-routing.module';
import { TherapistComponent } from './therapist.component';
import { AuthInterceptor } from '../shared/http-interceptors/auth-interceptor';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    TherapistRoutingModule
  ],
  declarations: [
    TherapistComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]

  // bootstrap: [TherapistComponent]
})
export class TherapistModule { }
