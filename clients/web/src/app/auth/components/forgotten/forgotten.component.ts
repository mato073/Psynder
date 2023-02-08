import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EqualValidator } from '../../../shared/validators/EqualValidator';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-forgotten',
  templateUrl: './forgotten.component.html',
  styleUrls: ['./forgotten.component.scss'],
})
export class ForgottenComponent implements OnInit {
  
  constructor(
    private fB: FormBuilder,
    private http: HttpClient,
    private router: Router
   ) { }

  isMobile: boolean = false;
  isWrong: boolean = false;
  pwdResetSuccessful : boolean = false;
  baseUrl = environment.backendUrl;

  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  form = this.fB.group({
    password: this.password,
    password2: new FormControl('', [Validators.required, EqualValidator(this.password)]),
  });

  ngOnInit() {
    /* checking if user is on mobile */
    if  (window.screen.width < 1024)
      this.isMobile = true;
  }

  private async redirectToLoginWithDelay() {
    setTimeout(() => {
      const nextRoute = window.location.href.includes('therapist') ? '/auth/therapist/login' : '/auth/login';
      this.router.navigateByUrl(nextRoute);
    }, 1500);
  }

  onSubmit(): void {
    const token = localStorage.getItem('pwd_reset_token');   
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    let options = { headers: headers };
    if (this.form.getRawValue().password === this.form.getRawValue().password2) {
      if (window.location.href.includes("therapist"))
      {
        var pwd: string;
        this.isWrong = false;
        pwd = this.form.getRawValue().password;
        const url = `${this.baseUrl}/therapists/reset-password`;
        this.http.patch(url, {
            password: pwd
          }, options).subscribe((res) => {
          this.pwdResetSuccessful = true;
          if (!this.isMobile)
            this.redirectToLoginWithDelay();
          return;
        }, (err) => {
          return err;
        });
      }
      else
      {
        var pwd: string;
        this.isWrong = false;
        pwd = this.form.getRawValue().password;
        const url = `${this.baseUrl}/users/reset-password`;
        this.http.patch(url, {
          password: pwd
        }, options).subscribe((res) => {
          this.pwdResetSuccessful = true;
          if (!this.isMobile)
            this.redirectToLoginWithDelay();
          return;
        }, (err) => {
          return err;
        });
      }}
    else {
      this.isWrong = true;
    }
  }
}
