import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetGuardService implements CanActivate {


  constructor(
    private router: Router,
    private auth: AuthService,
  ) { }

  private redirectToLogin() {
    const nextRoute = window.location.href.includes('therapist') ? '/auth/therapist/login' : '/auth/login';
    this.router.navigateByUrl(nextRoute);
  }

  canActivate(): Observable<boolean>|boolean {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (!token) {
      this.redirectToLogin();
      return false;
    }
    return this.auth.checkIfPasswordResetTokenIsValid(token).pipe(map(res => {
      localStorage.setItem('pwd_reset_token', token);
      return true;
    }), catchError(_ => {
      this.redirectToLogin();
      return of(false);
    }));
  }
}
