import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  error: BehaviorSubject<string | undefined>;

  emailSent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private as: AuthService,
    private tabTitle: Title,
    private location: Location
  ) {
    this.tabTitle.setTitle("Psynder | Réinitialisation du mot de passe");
   }


  ngOnInit() {
    this.error = new BehaviorSubject(undefined);
  }

  navigateBackToLogin() {
    this.location.back();
  }

  isTherapist(): boolean {
    const currentUrl = window.location.href;
    return currentUrl.includes('therapist') ? true : false;
  }

  sendPasswordResetEmail() {
    this.as.requestPasswordResetEmail(
      this.form.getRawValue().email,
      window.location.href.includes('therapist')
    ).subscribe((_) => {
      this.emailSent = true;
      this.error.next(undefined);
    }, (err: HttpErrorResponse) => {
      switch(err.status) {
        case 403:
            this.error.next("Vous vous êtes inscrits avec un compte Google, veuillez vous connecter à l'aide du bouton 'Se connecter avec Google'.");
            break;
          case 409:
            this.error.next("Vous avez déjà effectué cette demande, veuillez vérifier votre boîte mail ou retentez dans 10 minutes.");
            break;
        default: 
            this.error.next("Une erreur s'est produite, merci de réessayer plus tard.");
      }
    });
  }
}
