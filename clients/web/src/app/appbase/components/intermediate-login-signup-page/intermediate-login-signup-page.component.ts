import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";


@Component({
	selector: "intermediate-login-signup-page-page",
	templateUrl: "./intermediate-login-signup-page.component.html",
	styleUrls: ["./intermediate-login-signup-page.component.scss"]
})
export class IntermediateLoginSignupPageComponent {

	backBtnEnabled = false;
	baseUrl = environment.backendUrl;

	constructor(
		private tabTitle: Title,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router
	) { 
		this.tabTitle.setTitle("Psynder | Connexion/Inscription");
		this.route.params.subscribe(params => 
			this.backBtnEnabled = params["backBtnEnabled"] ? params["backBtnEnabled"] : false
		);
	}

	redirectToUserLogin() {
		this.router.navigateByUrl("/auth");
	}

	redirectToTherapistLogin() {
		this.router.navigateByUrl("/auth/therapist/login");
	}

	redirectToDownloadPage() {
		this.router.navigateByUrl("/download");
	}

	redirectToFeedbackPage() {
		this.router.navigateByUrl("/feedback");
	}

	redirectToAboutPage() {
		this.router.navigateByUrl("/about");
	}

	redirectToLandingPage() {
		this.router.navigateByUrl("/");
	}

	redirectToFAQPage() {
		this.router.navigateByUrl("/faq");
	}
}
