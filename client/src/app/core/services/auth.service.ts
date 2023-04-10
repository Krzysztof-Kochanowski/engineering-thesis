import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly accessToken = 'jwt_token';
  private authenticated = new BehaviorSubject<boolean>(false);
  private helper = new JwtHelperService();
  authenticated$ = this.authenticated.asObservable();

  isTokenNotExpired() {
    const token: string | null = this.getToken();

    return token != null && !this.helper.isTokenExpired(token);
  }

  getToken() {
    return localStorage.getItem(this.accessToken) as string;
  }

  setToken(token: string) {
    localStorage.setItem(this.accessToken, token);
    this.authenticated.next(this.isTokenNotExpired());
  }

  removeToken() {
    localStorage.removeItem(this.accessToken)
    this.authenticated.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const tokenIsValid = this.isTokenNotExpired();
    if (this.authenticated.value != tokenIsValid) {
      this.authenticated.next(tokenIsValid);
    }
    return this.authenticated$;
  }

  getDecodedToken() {
    const token = this.getToken();
    try {
      return this.helper.decodeToken(token);
    } catch(Error) {
      return null;
    }
  }
}

