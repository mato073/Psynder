import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HttpClientModule } from '@angular/common/http';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
	GoogleLoginProvider,
} from 'angularx-social-login';
import { QuillModule } from 'ngx-quill';
import { NgxColorsModule } from 'ngx-colors';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaintenancePageComponent } from './appbase/components/maintenance-page/maintenance-page.component';
import { PageNotFoundComponent } from './appbase/components/page-not-found/page-not-found.component';
import { DownloadAppPageComponent } from './appbase/components/download-app-page/download-app-page.component';
import { AboutComponent } from './appbase/components/about/about.component';
import { MaintenanceGuardService } from './appbase/services/maintenance-guard.service';
import { LandingPageComponent } from './appbase/components/landing-page/landing-page.component';
import { FAQPageComponent } from './appbase/components/faq-page/faq-page.component';

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module';
import { TherapistModule } from './therapist/therapist.module';
import { SharedModule } from './shared/shared.module';

import { RouterModule } from '@angular/router';

import { TherapistsService } from './user/features/map/services/therapists.service';

registerLocaleData(localeFr);

@NgModule({
	declarations: [
		AppComponent,
		MaintenancePageComponent,
		PageNotFoundComponent,
		DownloadAppPageComponent,
		LandingPageComponent,
		AboutComponent,
		FAQPageComponent
	],
	imports: [
		RouterModule,
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		SocialLoginModule,
		QuillModule.forRoot({
			modules: {
					syntax: false,
					toolbar: [
						[{ 'header': 1 }, { 'header': 2 }], 
						['bold', 'italic', 'underline', 'strike'],
						[{'color': []}],
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						[{ 'align': [] }],
						[ 'link' ],
						[{'size': ['0.875rem', '1.125rem', '1.5rem']}]
					]
			}
		}),
		NgxColorsModule,
		AuthModule,
		UserModule,
		TherapistModule,
		SharedModule,
	],
	providers: [
		DatePipe,
		MaintenanceGuardService,
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(
							'537375993118-vijksbfu4b84j757j92eu2g684vtrt04.apps.googleusercontent.com'
						)
					},
				]
			} as SocialAuthServiceConfig,
		},
		{ provide: LOCALE_ID, useValue: 'fr-FR'},
		TherapistsService
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
