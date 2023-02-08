import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "../shared/http-interceptors/auth-interceptor";
import { UserGuardService } from "./services/user-guard.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UserRoutingModule
  ],
  declarations: [UserComponent],
  providers: [
    UserGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class UserModule { }
