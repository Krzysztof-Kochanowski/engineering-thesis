import {Component} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {FormComponent} from "shared/abstract-components/form.component";
import {Employee} from "shared/models/employee.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {SharedDataService} from "app/core/services/shared-data.service";
import {MatDialog} from "@angular/material/dialog";
import {employeeFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {MatSelectChange} from "@angular/material/select";
import {User} from "shared/models/user.model";
import {UserService} from "app/features/admin-panel/services/user.service";
import {enumTexts} from "assets/app-texts-pl/enumTexts";
import {isAdmin, RoleLang} from "shared/enums/roles.enum";
import {valuesToString} from "shared/utilities/key-value.helper";
import {alertTexts} from "assets/app-texts-pl/alertTexts";

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.scss']
})
export class AddUserFormComponent extends FormComponent {
  generalTexts = generalTexts;
  loading = false;
  employees: Employee[] = [];
  employeesSub!: Subscription;
  employeeFilterCtrl = new FormControl<string>('') as FormControl<string>;
  public filteredEmployees = new BehaviorSubject<Employee[]>([]);
  enumTexts = enumTexts;
  rolePl: RoleLang = {
    THERAPIST: 'Terapeuta',
    STAFF: 'Kierownik',
    ADMIN: 'Administrator',
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private sharedDataService: SharedDataService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    super();
  }

  override ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      employee: [null]
    }, {updateOn: 'submit'});

    this.employeesSub = this.sharedDataService.employees$
      .subscribe(employees => {
        this.employees = employees;
        this.filterEmployees();
      })

    this.employeeFilterCtrl.valueChanges.subscribe(() => this.filterEmployees());
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }

  filterEmployees() {
    this.filteredEmployees.next(filterBySearchValue(this.employees, this.employeeFilterCtrl.value, employeeFilter));
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.openDialog().subscribe((result: boolean) => {
      if (!result) {
        this.loading = false;
        return;
      }

      let roles: string[] = this.f['roles'].value.map((role: { key: string, value: string }) => {
        return role.key
      });

      let user: User = {
        username: this.f['username'].value,
        password: this.f['password'].value,
        roles: roles,
      };

      if (this.f['employee'].value) {
        user.employee = this.f['employee'].value;
      }

      this.userService.postUser(user).subscribe({
        next: () => {
          this.alertService.success(alertTexts.userAddedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.userAddedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.addUserTitle, message: dialogTexts.addUserMessage},
    });
    return dialogRef.afterClosed();
  }

  updateSelectedRoles(event: MatSelectChange) {
    this.f['roles'].setValue(event.value);
  }

  originalOrder() {
    return 0;
  }

  valuesToString = valuesToString;
  isAdmin = isAdmin;
}
