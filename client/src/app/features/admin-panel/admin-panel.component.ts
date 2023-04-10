import {Component} from '@angular/core';
import {UserService} from "app/features/admin-panel/services/user.service";
import {SharedDataService} from "app/core/services/shared-data.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  constructor(
    private sharedDataService: SharedDataService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.sharedDataService.refreshEmployees();
    this.userService.refreshUsers();
  }
}
