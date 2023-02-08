import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { EqualValidator } from '../../../shared/validators/EqualValidator';
import { CharValidators } from '../../validators/CharValidators';
import { BehaviorSubject } from 'rxjs';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

import { AuthService } from '../../services/auth.service';
import { httpOptions, SiteVerify, SiteVerifyResponse } from './signup.service';
import { JsonConvert } from 'json2typescript';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private as: AuthService,
    private sas: SocialAuthService,
    private tabTitle: Title,
    private charValidators: CharValidators,
    private http: HttpClient
  ) {
    tabTitle.setTitle("Psynder | Inscription");
  }


  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    this.charValidators.upperCaseValidator,
    this.charValidators.lowerCaseValidator,
    this.charValidators.numberValidator,
    this.charValidators.specialCharValidator
  ]);

  form = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.pattern(/(\d{2}[\s]?){5}/g)]),
    password: this.password,
    password2: new FormControl('', [Validators.required, EqualValidator(this.password)]),
  });


  // @ts-ignore
  error: BehaviorSubject<string | undefined>;

  socialUser: SocialUser;

  signupSuccessful: boolean;
  recaptchaSuccessful: boolean;
  signingUpWithGoogle: boolean;

  ngOnInit() {
    this.signupSuccessful = false;
    this.recaptchaSuccessful = false;
    this.signingUpWithGoogle = false;
    this.error = new BehaviorSubject(undefined);
  }

  isTherapist(): boolean {
    const currentUrl = window.location.href;
    return currentUrl.includes('therapist') ? true : false;
  }

  private resetBools() {
    this.signingUpWithGoogle = false;
    this.recaptchaSuccessful = false;
    this.signupSuccessful = false;
  }

  private redirectIfUser() {
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 1300);
  }

  signupWithGoogle() {
    if (!this.recaptchaSuccessful) {
      try {
        this.sas.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
          this.socialUser = user;
          this.signingUpWithGoogle = true;
          this.signupSuccessful = true;
          this.cdr.detectChanges();
        });
      } catch (err) {
        console.error("Error on signup: ", err);
      }
    } else {
      const isTherapist: boolean = this.isTherapist();
      this.as.socialSignup(
        this.socialUser.provider,
        this.socialUser.id,
        this.socialUser.email,
        this.socialUser.firstName,
        this.socialUser.lastName,
        isTherapist
      ).subscribe((res) => {
        if (!isTherapist)
          this.redirectIfUser();
      },
      (err) => {
        this.resetBools();
        this.error.next('Un compte est déjà lié à cette adresse mail.');
        console.log('signup successful: ', this.signupSuccessful);
        this.cdr.detectChanges();
      });
    }
  }

  onSignup() {
    this.signingUpWithGoogle = false;
    this.signupSuccessful = true;
    this.cdr.detectChanges();
    if (this.recaptchaSuccessful) {
      const isTherapist: boolean = this.isTherapist();
      try {
        this.as.signupUser(
          this.form.getRawValue().firstName,
          this.form.getRawValue().lastName,
          this.form.getRawValue().email,
          this.form.getRawValue().phoneNumber,
          this.form.getRawValue().password,
          isTherapist
        ).subscribe((_) => {
          if (!isTherapist)
            this.redirectIfUser();
        },
        (err) => {
          this.resetBools();
          this.error.next('Un compte est déjà lié à cette adresse mail.');
          this.cdr.detectChanges();
        });
      } catch(err) {
        console.error("Error on signup.");
      }
    }
  }

  recaptchaResolved(e) {
    var response = grecaptcha.getResponse();
    var secretKey = "6LdtvVUcAAAAABaGfBrQm7IDFJ1rwCraE2QCwPoF";

    this.recaptchaSuccessful = true;
    this.cdr.detectChanges();
      if (this.signingUpWithGoogle)
        this.signupWithGoogle();
      else
        this.onSignup();

  /*  if (response) {
      var verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${response}`;

      this.http.post(verificationUrl, null, httpOptions).subscribe(responseObject => {
        var response = responseObject as SiteVerifyResponse;
        if (response.success == true) {
          this.recaptchaSuccessful = true;
          this.cdr.detectChanges();
          if (this.signingUpWithGoogle)
            this.signupWithGoogle();
          else
            this.onSignup();
        } else {
          console.error('Recaptcha error');
          this.signupSuccessful = false;
          this.error.next("Verification failed : " + responseObject['error-codes']);
        }
      });
    } else
      this.signupSuccessful = false;
    this.cdr.detectChanges();*/
  }
}