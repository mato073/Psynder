import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Roles } from '../models/roles';

@Injectable({
	providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

	constructor(
		private router: Router,
		private auth: AuthService
		) {}

	canActivate(): boolean {
		if (this.auth.isLoggedIn()) {
			const isTherapist: boolean = localStorage.getItem('role') === Roles.Therapist;
			const nextRoute = isTherapist ? '/therapist/home' : '/user/feed/map';
			this.router.navigateByUrl(nextRoute);
			return false;
		}
		return true;
	}
}
