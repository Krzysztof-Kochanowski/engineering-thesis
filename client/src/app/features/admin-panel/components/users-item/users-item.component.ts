import {Component, Input, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {User} from "shared/models/user.model";
import {FormComponent} from "shared/abstract-components/form.component";
import {Status} from "shared/enums/visit-details-status.enum";
import {FormBuilder, FormControl} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "app/core/services/auth.service";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {routes} from "assets/routes";
import {UserService} from "app/features/admin-panel/services/user.service";
import {UserDto} from "shared/models/user-dto.model";
import {valuesToString} from "shared/utilities/key-value.helper";
import {isAdmin, Role, RoleLang} from "shared/enums/roles.enum";
import {KeyValue} from "@angular/common";
import {Employee} from "shared/models/employee.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {SharedDataService} from "app/core/services/shared-data.service";
import {employeeFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {alertTexts} from "assets/app-texts-pl/alertTexts";

@Component({
  selector: 'app-users-item',
  templateUrl: './users-item.component.html',
  styleUrls: ['./users-item.component.scss']
})
export class UsersItemComponent extends FormComponent {
  @ViewChild('employeeSelect', { static: false }) employeeSelect!: MatSelect;
  @ViewChild('roleSelect', { static: false }) roleSelect!: MatSelect;
  @ViewChild('temp', { static: true }) template!: TemplateRef<any>;
  @Input() user!: User;
  status = Status;
  generalTexts = generalTexts;
  loading = false;
  routes = routes;
  employees: Employee[] = [];
  employeesSub!: Subscription;
  employeeFilterCtrl = new FormControl<string>('') as FormControl<string>;
  public filteredEmployees = new BehaviorSubject<Employee[]>([]);

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private viewContainerRef: ViewContainerRef,
    private userService: UserService,
  ) {
    super();
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);

    this.form = this.formBuilder.group({
      roles: [null],
      employee: [this.user.employee]
    }, {updateOn: 'submit'});

    this.employeesSub = this.sharedDataService.employees$
      .subscribe(employees => {
        this.employees = employees;
        this.filterEmployees();
      })

    this.employeeFilterCtrl.valueChanges.subscribe(() => this.filterEmployees());

    setTimeout(() => {
      this.roleSelect.options.forEach((item: MatOption) => {
        if (this.user.roles.some(role => item.value.key == role)) {
          item.select();
        }
      })
      if (this.user.employee) {
        this.employeeSelect.options.forEach((item: MatOption) => {
          if (item.value?.username == this.user.employee?.username) {
            item.select();
          }
        })
      }
    })
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

      let roles: string[] = this.f['roles'].value.map((option: { key: string, value: string }) => {
        return option.key
      });

      let editedUser: UserDto = {
        id: this.user.id!,
        username: this.user.username,
        roles: roles || this.user.roles,
        employee: this.f['employee'].value
      };

      this.userService.updateUser(this.user.id!, editedUser).subscribe({
        next: () => {
          this.userService.refreshUsers();
          this.alertService.success(alertTexts.userChangedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.userChangedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.changeUserTitle, message: dialogTexts.changeUserMessage},
    });
    return dialogRef.afterClosed();
  }

  updateSelectedStartDate(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      event.value = event.value.startOf('day');
    }
  }

  updateSelectedEndDate(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      event.value = event.value.endOf('day');
    }
  }

  onDelete() {
    this.loading = true;

    this.openDialog().subscribe((result: boolean) => {
      if (!result) {
        this.loading = false;
        return;
      }

      this.userService.deleteUser(this.user.id!).subscribe({
        next: () => {
          this.userService.refreshUsers();
          this.alertService.success(alertTexts.userRemovedSuccess);
        },
        error: () => this.alertService.error(alertTexts.userRemovedError)
      }).add(() => this.loading = false)
    });
  }
  rolePl: RoleLang = {
    THERAPIST: 'Terapeuta',
    STAFF: 'Kierownik',
    ADMIN: 'Administrator',
  };

  getKeyValueArr(roles: string[]): Array<KeyValue<string, string>> {
    return roles.map((role) => ({ key: role, value: this.rolePl[role as Role]}));
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
