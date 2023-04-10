import {Component} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {UserService} from "app/features/admin-panel/services/user.service";
import {Subscription} from "rxjs";
import {User} from "shared/models/user.model";
import {SharedDataService} from "app/core/services/shared-data.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: User[] = [];
  userSub!: Subscription;
  generalTexts = generalTexts;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSub = this.userService.users$
      .subscribe(users => {
        this.users = users;
      })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
