import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";

@Component({
	selector: "app-auth-page",
	templateUrl: "./auth-page.component.html",
	styleUrls: ["./auth-page.component.scss"]
})
export class AuthPageComponent implements OnInit {
	currentRoute: String = "";

	constructor(public router: Router) {
		this.currentRoute = router.routerState.snapshot.url;
		router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.currentRoute = e.url;
			}
		})
	}

	ngOnInit() {
		this.currentRoute = this.router.routerState.snapshot.url;
	}

  switchAuthRoute(e) {
    if (e.target !== undefined)
      this.currentRoute = e.target.value;
    else if (typeof e === "string")
      this.currentRoute = e;
    this.router.navigate([this.currentRoute]);
    return;
  }

  redirectToLandingPage() {
		this.router.navigateByUrl("/");
	}
}
