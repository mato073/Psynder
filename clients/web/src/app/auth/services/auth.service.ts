import { Injectable} from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Roles } from '../models/roles';

export interface User {
	email: string;
	password: string;
}

export interface CompleteUser {
	_id: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	position: string,
	potentialDisorders: string,
}

export interface UserResponse {
	user: CompleteUser
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	user: CompleteUser = null;
	baseUrl = environment.backendUrl;

	cachedRequests: Array<HttpRequest<any>> = [];

	constructor(private http: HttpClient) {}

	private _setSession(authResult) {
		let accessDt = new Date();
		let refreshDt = new Date();
		accessDt.setHours(accessDt.getMinutes() + 30);
		refreshDt.setHours(refreshDt.getHours() + 48);
		if (authResult.uid)
			localStorage.setItem('uid', authResult.uid);
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('refresh_token', authResult.refreshToken);
		localStorage.setItem('access_expires_at', JSON.stringify(accessDt));
		localStorage.setItem('refresh_expires_at', JSON.stringify(refreshDt));
	}

	private _getTokenExpiration(tokenType: string) {
		if (tokenType !== 'access' && tokenType !== 'refresh')
			throw Error();
		const expiration = localStorage.getItem(tokenType + '_expires_at');
		const expiresAt = JSON.parse(expiration);
		return new Date(expiresAt);
	}

	private _getToken(email: string, password: string, isTherapist: boolean = false): Observable<any> {
		const url = isTherapist ? `${this.baseUrl}/therapists/login` : `${this.baseUrl}/users/login`;
		return this.http.post(url, {
			email: email,
			password: password
		});
	}

	login(email: string, password: string, isTherapist: boolean = false) {
		return this._getToken(email, password, isTherapist).pipe(
			tap((res) => {
				this._setSession(res);
				localStorage.setItem('role', (isTherapist ? Roles.Therapist : Roles.User));
			}),
			shareReplay()
		);
	}

	signupUser(firstName, lastName, email, phoneNumber, password, isTherapist: boolean = false) {
		const url = isTherapist ? `${this.baseUrl}/therapists/signup` : `${this.baseUrl}/users/signup`;
		return this.http.post(url, {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phoneNumber: phoneNumber,
			password: password
		});
	}

	socialLogin(provider: string, uid: string, isTherapist: boolean = false) {
		const url = isTherapist ? `${this.baseUrl}/therapists/social/login`: `${this.baseUrl}/users/social/login`;
		return this.http.post(url, {
			provider: provider,
			uid: uid
		}).pipe(tap((res) => {
			this._setSession(res);
			localStorage.setItem('role', (isTherapist ? Roles.Therapist : Roles.User));
		}), shareReplay());
	}

	socialSignup(provider: string, uid: string, email: string, firstName: string, lastName: string, isTherapist: boolean = false) {
		const url = isTherapist ? `${this.baseUrl}/therapists/social/signup`: `${this.baseUrl}/users/social/signup`;
		return this.http.post(url, {
			provider: provider,
			uid: uid,
			email: email,
			firstName: firstName,
			lastName: lastName
		});
	}

	refreshSession() {
		const refreshToken = localStorage.getItem('refresh_token');
		const refreshUrl = `${this.baseUrl}/token/refresh`;
		return this.http.post(refreshUrl, {
			refreshToken: refreshToken
		}).pipe(tap((res) => {
			this._setSession(res);
		}), shareReplay());
	}


	logout() {
		localStorage.removeItem('uid');
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('access_expires_at');
		localStorage.removeItem('refresh_expires_at');
		localStorage.removeItem('role');
	}

	isLoggedIn() {
		try {
			if (new Date() < this._getTokenExpiration('access'))
				return true;
			if (new Date() >= this._getTokenExpiration('refresh'))
				return false;
			return this.refreshSession().subscribe(
				(res) => true,
				(err) => false
			);
		} catch (err) {
			return false;
		}
	}

	isLoggedOut() {
		return !this.isLoggedIn();
	}

	requestPasswordResetEmail(emailAddress: string, isTherapist: boolean) {
		const targetUrl = `${this.baseUrl}/emails/reset-password`;
		
		const parsedHref = new URL(window.location.href);
		const origin = parsedHref.origin;
		const redirectRoute = isTherapist ? `${origin}/auth/therapist/reset-password` : `${origin}/auth/reset-password`;
		return this.http.post(targetUrl, {
			email: emailAddress,
			redirectTo: redirectRoute,
			isTherapist: isTherapist,
		});
	}

	checkIfPasswordResetTokenIsValid(token: string) {
		const url = `${this.baseUrl}/emails/is-password-reset-token-valid`;
		return this.http.get(url, {
			params: {
				token: token
			}
		});
	}
}
