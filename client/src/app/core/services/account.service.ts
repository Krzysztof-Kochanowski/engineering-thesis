import {Injectable} from '@angular/core';
import {environment} from "environments/environment";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {AuthService} from "./auth.service";
import {AuthRequest} from "shared/models/auth-request.model";
import {AuthResponse} from "shared/models/auth-response.model";
import {routes} from "assets/routes";
import {Router} from "@angular/router";
import {Role} from "shared/enums/roles.enum";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  employeeId = new BehaviorSubject<number | undefined>(undefined);
  roles = new BehaviorSubject<string[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.authService.isAuthenticated()
      .subscribe((authenticated) => {
        const decodedToken = this.authService.getDecodedToken();
        this.employeeId.next(decodedToken?.employeeId);
        this.roles.next(decodedToken?.roles || []);

        if (!authenticated) {
          this.signOut();
        }
      }
    );
  }

  signIn(credentials: AuthRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((res: AuthResponse)  => {
        this.authService.setToken(res.token);
      }));
  }

  signOut(): void {
    this.router.navigate([routes.logout]);
  }

  // This probably should be contained in just one function
  isAdmin() {
    return this.roles.value.some(role => role === Role.ADMIN.toString());
  }

  isStaff() {
    return this.roles.value.some(role => role === Role.STAFF.toString());
  }

  isTherapist() {
    return this.roles.value.some(role => role === Role.THERAPIST.toString());
  }
}
