import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	baseUrl = environment.backendUrl;

	constructor(
		private router: Router,
		private http: HttpClient
	) {}

	ngOnInit() {
		let currentUrl = window.location.href;
		/* redirecting to download page if screen size < 1024 */
		if (window.screen.width < 1024 && !currentUrl.includes('reset-password'))
			this.router.navigate(['/download']);

		/* redirecting to maintenance page if server or db disconnected */
		const url = `${this.baseUrl}/health-check`;
		this.router.events.subscribe((e) => {
			if (e instanceof NavigationStart) {
				this.http.get(url).toPromise().catch((_) => {
					this.router.navigate(['/maintenance']);
				})
			}
		});

		/* initializing GDPR policy */
		let cc = window as any;
			 cc.cookieconsent.initialise({
				 palette: {
					 popup: {
						 background: "#3B82F6",
						 text: "#FFFFFF"
					 },
					 button: {
						 background: "#F4F0EC",
						 text: "#1F2937"
					 }
				 },
				 theme: "classic",
				 content: {
					 message: "Ce site utilise local storage pour garder votre session ouverte et améliorer votre experience.",
					 dismiss: "Accepter",
					 allow: "Accepter",
					 deny: "Refuser"
					 //link: this.cookieLinkText,
					 // href: environment.Frontend + "/dataprivacy" 
				 }
			 });
	}

}
