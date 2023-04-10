import {Injectable} from '@angular/core';
import {catchError, first, map, Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {routes} from "assets/routes";
import {AccountService} from "app/core/services/account.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  routes = routes;
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  canActivate(): Observable<boolean>  {
    return this.authService.isAuthenticated()
      .pipe(first())
      .pipe(catchError(() => {
        return of(false);
      })
    );
  }

  isTherapist() {
    return this.canActivate().pipe(map((val) => val && this.accountService.isTherapist()));
  }

  isAdmin() {
    return this.canActivate().pipe(map((val) => val && this.accountService.isAdmin()));
  }

  isStaff() {
    return this.canActivate().pipe(map((val) => val && this.accountService.isStaff()));
  }
}
