import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
	selector: "app-feedback-page",
	templateUrl: "./feedback-page.component.html",
	styleUrls: ["./feedback-page.component.scss"]
})
export class FeedbackPageComponent {

	backBtnEnabled = false;
	baseUrl = environment.backendUrl;

	constructor(
		private tabTitle: Title,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router
	) { 
		this.tabTitle.setTitle("Psynder | Faire un retour");
	}

	redirectToFeedbackGoogleForms() {
		const url = "https://docs.google.com/forms/d/e/1FAIpQLSdChZ5AfTVI9egEedxmUcsFidqOFLUfSzsayx7tmRKTcgmpCw/viewform";
		window.open(url, "_blank"); 
	}

	redirectToSupportGoogleForms() {
		const url = "https://forms.gle/cXL1fSXDyTdHdDpk9";
		window.open(url, "_blank"); 
	}

	redirectToDownloadPage() {
		this.router.navigateByUrl("/download");
	}

	redirectToAboutPage() {
		this.router.navigateByUrl("/about");
	}

	redirectToLoginSignupPage() {
		this.router.navigateByUrl("/login-signup");
	}

	redirectToLandingPage() {
		this.router.navigateByUrl("/");
	}

	redirectToFAQPage() {
		this.router.navigateByUrl("/faq");
	}
}
