import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
	selector: 'app-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

	constructor(
		private tabTitle: Title,
		private router: Router
		) { 
		this.tabTitle.setTitle("Psynder | Page introuvable");
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

	redirectToLoginSignupPage() {
		this.router.navigateByUrl("/login-signup");
	}
}
