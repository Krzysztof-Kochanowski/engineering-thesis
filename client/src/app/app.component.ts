import {Component} from '@angular/core';
import {routes} from "assets/routes";
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, filter} from "rxjs";
import {AuthService} from "app/core/services/auth.service";
import {Role} from "shared/enums/roles.enum";
import {AccountService} from "app/core/services/account.service";
import {generalTexts} from "assets/app-texts-pl/generalTexts";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  routes = routes;
  showSideNav = true;
  route!: string;
  Role = Role;
  generalTexts = generalTexts;
  isAdmin = new BehaviorSubject(false)
  isTherapist = new BehaviorSubject(false)
  isStaff = new BehaviorSubject(false)

  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.route = (event as NavigationEnd).url;
    });

    this.accountService.roles.subscribe(() => {
      this.isAdmin.next(this.accountService.isAdmin());
      this.isTherapist.next(this.accountService.isTherapist());
      this.isStaff.next(this.accountService.isStaff());
    });
  }

  toggleSideNav() {
    this.showSideNav = !this.showSideNav;
  }

  logout() {
    this.authService.removeToken();
  }
}
