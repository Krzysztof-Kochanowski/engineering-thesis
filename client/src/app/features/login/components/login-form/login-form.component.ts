import {Component} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {AuthRequest} from "shared/models/auth-request.model";
import {AccountService} from "app/core/services/account.service";
import {AuthService} from "app/core/services/auth.service";
import {alertTexts} from "assets/app-texts-pl/alertTexts";
import {Router} from "@angular/router";
import {routes} from "assets/routes";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  generalTexts = generalTexts;
  form!: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    }, {updateOn: 'submit'});
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    let user: AuthRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value,
    };

    this.accountService.signIn(user).subscribe({
      next: () => {
        this.alertService.success(alertTexts.loginSuccess);
        if (this.accountService.isTherapist()) {
          this.router.navigate([routes.visits]);
        } else if (this.accountService.isStaff()) {
          this.router.navigate([routes.sheets]);
        } else if (this.accountService.isAdmin()) {
          this.router.navigate([routes.adminPanel]);
        }
      },
      error: () => this.alertService.error(alertTexts.loginError, undefined, {enableHtml: true})
    }).add(() => this.loading = false);
  }

  get f() { return this.form.controls; }
}
