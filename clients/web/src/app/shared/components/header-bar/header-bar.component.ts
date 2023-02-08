import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { HeaderSection } from "../../interfaces/header-section";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
	selector: "app-header-bar",
	templateUrl: "./header-bar.component.html",
	styleUrls: ["./header-bar.component.scss"]
})
export class HeaderBarComponent {

	@Input() sections: HeaderSection[];
	@Input() isTherapist: boolean = false;

	constructor(
		private router: Router,
		private auth: AuthService
	) { }

	switchRoute(absoluteUrl: string) {
		this.router.navigateByUrl(absoluteUrl);
	}

	isSectionSelected(absoluteUrl: string) {
		return absoluteUrl === this.router.url;
	}

	logout() {
		this.auth.logout();
		this.router.navigateByUrl("/auth/login");
	}
}
