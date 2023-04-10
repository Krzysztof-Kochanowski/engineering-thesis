import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from "app/features/login/login-routing.module";
import {LoginFormComponent} from './components/login-form/login-form.component';
import {SharedModule} from "shared/shared.module";


@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent
  ],
  imports: [
    LoginRoutingModule,
    SharedModule
  ]
})
export class LoginModule { }
