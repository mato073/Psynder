import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, ObservableInput, BehaviorSubject, EMPTY } from 'rxjs';
import { take, filter, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;

  constructor(private injector: Injector) {}

  addAccessToken(req: HttpRequest<any>): HttpRequest<any> {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken && req.url.includes(environment.backendUrl))
      return req.clone({ setHeaders: { Authorization: 'Bearer ' + accessToken }});
    return req;
  }

  private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      const authService = this.injector.get(AuthService);
      
      return authService.refreshSession().pipe(
          switchMap((res: any) => {
              <void>res;
              return next.handle(this.addAccessToken(req));
          }),
          catchError((err) => {
              <void>err;
              // If there is an exception calling 'refreshToken', bad news so logout.
              authService.logout();
              return EMPTY;
          }),
          finalize(() => {
              this.isRefreshingToken = false;
          }),);
    } else 
      return next.handle(this.addAccessToken(req));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAccessToken(req)).pipe(
      catchError((err: any): Observable<HttpEvent<any>> => {
        if (err instanceof HttpErrorResponse && (<HttpErrorResponse>err).status === 401)
          return this.handleUnauthorizedError(req, next);
        return throwError(err);
      })
    );
  }

}
