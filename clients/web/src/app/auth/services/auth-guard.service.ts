import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

	constructor(
		private router: Router,
		private auth: AuthService) {}


	canActivate(): boolean {
		if (!this.auth.isLoggedIn()) {
			const nextRoute = window.location.href.includes('therapist') ? '/auth/therapist/login' : '/auth/login';
			this.router.navigateByUrl(nextRoute);
			return false;
		}
		return true;
	}
}
