import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, EMPTY, Observable, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {environment} from "environments/environment";
import {AccountService} from "app/core/services/account.service";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private accountService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlPath = request.url;
    const authToken = this.authService.getToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (authToken && isApiUrl && !urlPath.includes('/auth/')) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}`}
      });
    }

    return next.handle(request).pipe(s => this.handleErrors(s, request.url));
  }

  private handleErrors(
    source: Observable<HttpEvent<unknown>>,
    urlPath: string
  ): Observable<HttpEvent<unknown>> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !urlPath.includes('/auth/')) {
          return this.handle401();
        }
        return throwError(() => error);
      })
    );
  }

  private handle401() {
    this.accountService.signOut();
    return EMPTY;
  }
}
