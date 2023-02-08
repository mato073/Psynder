import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class MaintenanceGuardService implements CanActivate {
	baseUrl = environment.backendUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  canActivate(): Promise<boolean> | boolean {
    const url = `${this.baseUrl}/health-check`;
    return new Promise((resolve, reject) => {
      this.http.get(url).toPromise().then(res => {
        console.log('MAINTENANCE');
        this.router.navigate(['auth']);
        resolve(false);
      }).catch(err => {
        resolve(true);
      })
    });
  }


}
