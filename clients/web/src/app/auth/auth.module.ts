import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecaptchaModule  } from "ng-recaptcha";

import { SharedModule } from "../shared/shared.module";

import { AuthPageComponent } from "./containers/auth-page/auth-page.component";
import { AuthTherapistComponent } from "./containers/auth-therapist/auth-therapist.component";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ForgottenComponent } from "./components/forgotten/forgotten.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthGuardService } from "./services/auth-guard.service"
import { LoginGuardService } from "./services/login-guard.service";
import { PasswordResetGuardService } from "./services/password-reset-guard.service";
import { PhoneNumberPipe } from "./pipes/phone-number-pipe";

import { CharValidators } from "./validators/CharValidators";
// import { AuthService } from "./services/auth.service";
// import { HTTP_INTERCEPTORS, HttpInterceptor } from "@angular/common/http";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RecaptchaModule,
    ReactiveFormsModule,
    // SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthPageComponent,
    AuthTherapistComponent,
    ForgotPasswordComponent,
    ForgottenComponent,
    LoginComponent,
    SignupComponent,
    PhoneNumberPipe
  ],
  providers: [
    AuthGuardService,
    LoginGuardService,
    PasswordResetGuardService,
    CharValidators
  ],
})
export class AuthModule { }
