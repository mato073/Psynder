import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"]
})
export class AboutComponent {

	backBtnEnabled: boolean = false;
	currentRoute: String = "";

	constructor(
		private tabTitle: Title,
		private location: Location,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.currentRoute = router.routerState.snapshot.url;
		router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.currentRoute = e.url;
			}
		});
		this.tabTitle.setTitle("Psynder | A propos");

	}

	switchAuthRoute(e) {
		if (e.target !== undefined)
			this.currentRoute = e.target.value;
		else if (typeof e === "string")
			this.currentRoute = e;
		this.router.navigate([this.currentRoute]);
		return;
	}

	redirectToFeedbackPage() {
		this.router.navigateByUrl("/feedback");
	}

	redirectToDownloadPage() {
		this.router.navigateByUrl("/download");
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
