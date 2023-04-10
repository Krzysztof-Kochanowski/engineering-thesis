import {NgModule} from '@angular/core';

import {AdminPanelRoutingModule} from './admin-panel-routing.module';
import {AdminPanelComponent} from './admin-panel.component';
import {SharedModule} from "shared/shared.module";
import {UsersComponent} from './components/users/users.component';
import {AddUserFormComponent} from './components/add-user-form/add-user-form.component';
import {UsersItemComponent} from './components/users-item/users-item.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {UserService} from "app/features/admin-panel/services/user.service";


@NgModule({
  declarations: [
    AdminPanelComponent,
    UsersComponent,
    AddUserFormComponent,
    UsersItemComponent
  ],
  imports: [
    AdminPanelRoutingModule,
    SharedModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    UserService
  ]
})
export class AdminPanelModule { }
