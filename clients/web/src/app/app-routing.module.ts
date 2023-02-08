import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "./auth/services/auth-guard.service";
import { LoginGuardService } from "./auth/services/login-guard.service";
import { PageNotFoundComponent } from "./appbase/components/page-not-found/page-not-found.component";
import { MaintenancePageComponent } from "./appbase/components/maintenance-page/maintenance-page.component";
import { DownloadAppPageComponent } from "./appbase/components/download-app-page/download-app-page.component";
import { AboutComponent } from "./appbase/components/about/about.component";
import { LandingPageComponent } from "./appbase/components/landing-page/landing-page.component";
import { FeedbackPageComponent } from "./appbase/components/feedback-page/feedback-page.component";
import { IntermediateLoginSignupPageComponent } from "./appbase/components/intermediate-login-signup-page/intermediate-login-signup-page.component";
import { FAQPageComponent } from "./appbase/components/faq-page/faq-page.component";

const routes: Routes = [
	{
		path: "",
		component: LandingPageComponent
	},
	{
		path: "auth",
		loadChildren: () =>
			import("./auth/auth.module").then(m => m.AuthModule),
			canActivate: [LoginGuardService]
	},
	{
		path: "user",
		loadChildren: () =>
			import("./user/user.module").then(m => m.UserModule),
			canActivate: [AuthGuardService]
	},
	{
		path: "therapist",
		loadChildren: () =>
			import("./therapist/therapist.module").then(m => m.TherapistModule),
			canActivate: [AuthGuardService]
	},
	{
		path: "maintenance",
		component: MaintenancePageComponent,
		// canActivate: [MaintenanceGuardService]
	},
	{
		path: "download",
		component: DownloadAppPageComponent
	},
	{
		path: "about",
		component: AboutComponent
	},
	{
		path: "feedback",
		component: FeedbackPageComponent
	},
	{
		path: "404",
		component: PageNotFoundComponent
	},
	{
		path: "login-signup",
		component: IntermediateLoginSignupPageComponent
	},
	{
		path: "faq",
		component: FAQPageComponent
	},
	{
		path: "**",
		redirectTo: "/404"
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)], // , { enableTracing: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
