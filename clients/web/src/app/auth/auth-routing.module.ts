import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthPageComponent } from './containers/auth-page/auth-page.component'
import { AuthTherapistComponent } from './containers/auth-therapist/auth-therapist.component'
import { LoginComponent } from './components/login/login.component'
import { SignupComponent } from './components/signup/signup.component'
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgottenComponent } from './components/forgotten/forgotten.component'
import { PasswordResetGuardService } from './services/password-reset-guard.service';
import { FeedbackPageComponent } from "../appbase/components/feedback-page/feedback-page.component";
import { LandingPageComponent } from "../appbase/components/landing-page/landing-page.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '',
    component: AuthPageComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'sign-up',
        component: SignupComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
    ]
  },
  {
    path: 'therapist',
    component: AuthTherapistComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'sign-up',
        component: SignupComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      }
    ]
  },
  {
    path: 'reset-password',
    canActivate: [PasswordResetGuardService],
    component: ForgottenComponent
  },
  {
    path: 'therapist/reset-password',
    canActivate: [PasswordResetGuardService],
    component: ForgottenComponent
  },
  {
    path: "feedback",
    component: FeedbackPageComponent
  },
  {
    path: '',
    component: LandingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
