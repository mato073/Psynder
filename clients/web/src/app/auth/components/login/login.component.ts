import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Title} from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  error: BehaviorSubject<string | undefined>;

  pwdResetRedirectUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private as: AuthService,
    private sas: SocialAuthService,
    private tabTitle: Title
  ) {
    this.tabTitle.setTitle("Psynder | Connexion");
  }


  ngOnInit() {
    this.error = new BehaviorSubject(undefined);
    this.pwdResetRedirectUrl = this.isTherapist() ? '/auth/therapist/forgot-password' : '/auth/forgot-password';
  }

  isTherapist(): boolean {
    const currentUrl = window.location.href;
    return currentUrl.includes('therapist') ? true : false;
  }

  onLogin() {
    try {
      const isTherapist = this.isTherapist();
      this.as.login(
        this.form.getRawValue().email,
        this.form.getRawValue().password,
        isTherapist
      ).subscribe(res => {
        const nextRoute = window.location.href.includes('therapist') ? '/therapist/home' : '/user/questionaire';
        this.router.navigateByUrl(nextRoute);
      },
      (err) => {
        console.error(err);
        this.error.next('Email ou mot de passe incorrect.');
        this.cdr.detectChanges();
      })
    } catch(err) {
      console.error("Login error");
    }
  }

  loginWithGoogle() {
    const isTherapist: boolean = this.isTherapist();
    try {
      this.sas.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
        this.as.socialLogin(
          user.provider,
          user.id,
          isTherapist
        ).subscribe((_) => {
          const nextRoute = window.location.href.includes('therapist') ? '/therapist/home' : '/user/questionaire';
          this.router.navigateByUrl(nextRoute);
        },
        (err) => {
          console.error(err)
          this.error.next('La connexion a échoué! vérifiez que vous possédez un compte.');
          this.cdr.detectChanges();
        });
      });
    } catch(err) {
      console.error("Error on signup.");
    }
  }
}
