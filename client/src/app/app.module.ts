import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginModule} from "app/features/login/login.module";
import {CoreModule} from "app/core/core.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "app/app-routing.module";
import {SharedModule} from "shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {AuthService} from "app/core/services/auth.service";
import {JwtInterceptor} from "app/core/interceptors/jwt.interceptor";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    LoginModule,
    CoreModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    SharedModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
