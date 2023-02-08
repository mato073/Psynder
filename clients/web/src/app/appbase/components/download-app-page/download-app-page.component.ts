import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Component({
	selector: "app-download-app-page",
	templateUrl: "./download-app-page.component.html",
	styleUrls: ["./download-app-page.component.scss"]
})
export class DownloadAppPageComponent {

	baseUrl = environment.backendUrl;

	constructor(
		private tabTitle: Title,
		private http: HttpClient,
		private router: Router
	) {
		this.tabTitle.setTitle("Psynder | Télécharger");
	}

	private download(url: string): Observable<Blob> {
		return this.http.get(url, {
			responseType: "blob"
		});
	}

	downloadAndroid() {
		const url = `${this.baseUrl}/android-app`;
		this.download(url).subscribe(blob => {
			const a = document.createElement("a")
			const objectUrl = URL.createObjectURL(blob);
			a.href = objectUrl;
			a.download = "psynder-android-app.apk";
			a.click();
			URL.revokeObjectURL(objectUrl);
		})
	}

	redirectToFeedbackPage() {
		this.router.navigateByUrl("/feedback");
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
