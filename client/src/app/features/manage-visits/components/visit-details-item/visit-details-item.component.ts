import {Component, Input, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {VisitDetailsWithVisit} from "shared/models/visit-details.model";
import {Status} from "shared/enums/visit-details-status.enum";
import {MatSelect} from "@angular/material/select";
import {FormBuilder, FormControl} from "@angular/forms";
import {Employee} from "shared/models/employee.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {VisitService} from "app/features/manage-visits/services/visit.service";
import {MatDialog} from "@angular/material/dialog";
import {SharedDataService} from "app/core/services/shared-data.service";
import {AuthService} from "app/core/services/auth.service";
import {VisitDetailsDto} from "shared/models/visit-details-dto.model";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {enumTexts} from "assets/app-texts-pl/enumTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {employeeFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {FormComponent} from "shared/abstract-components/form.component";
import {alertTexts} from "assets/app-texts-pl/alertTexts";
import {AccountService} from "app/core/services/account.service";

@Component({
  selector: 'app-visit-details-item',
  templateUrl: './visit-details-item.component.html',
  styleUrls: ['./visit-details-item.component.scss'],
})
export class VisitDetailsItemComponent extends FormComponent{
  @ViewChild('temp', { static: true }) template!: TemplateRef<any>;
  @ViewChild('singleSelect', { static: false }) singleSelect!: MatSelect;
  @Input() visitDetails!: VisitDetailsWithVisit;
  status = Status;
  generalTexts = generalTexts;
  enumTexts = enumTexts;
  loading = false;
  employees: Employee[] = []
  employeeSub!: Subscription;
  employeeCtrl = new FormControl<number | null>(null);
  employeeFilterCtrl = new FormControl<string>('') as FormControl<string>;
  filteredEmployees = new BehaviorSubject<Employee[]>([]);
  isStaff = new BehaviorSubject(false)

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private visitService: VisitService,
    private dialog: MatDialog,
    private employeeService: SharedDataService,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private viewContainerRef: ViewContainerRef,
    private accountService: AccountService,
  ) {
    super();
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.form = this.formBuilder.group({
      selectedStatus: [enumTexts.status.find(value => value.key as Status == this.visitDetails.status)],
      comment: [this.visitDetails.comment]
    });

    this.accountService.roles.subscribe(() => {
      const isStaff = this.accountService.isStaff();
      if (isStaff) {
        this.isStaff.next(isStaff);
        if (this.visitDetails.substitution) {
          this.employeeCtrl.setValue(this.visitDetails.substitution!.employee!.id!);
        }
        this.form.addControl('employee', this.employeeCtrl);
        this.employeeSub = this.sharedDataService.employees$
          .subscribe(employees => {
            this.employees = employees;
            this.filterEmployees();
          })
        this.employeeFilterCtrl.valueChanges.subscribe(() => this.filterEmployees());
      }
    });
  }

  ngOnDestroy() {
    if (this.isStaff.value)
      this.employeeSub.unsubscribe();
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

      let editedDetails: VisitDetailsDto = {
        status: this.f['selectedStatus'].value.key,
        comment: this.f['comment'].value,
        customer: this.visitDetails.customer,
        substitutingEmployeeId: this.f['employee']?.value
      };

      this.visitService.updateVisitDetails(
        this.visitDetails.id!,
        editedDetails,
        this.visitDetails.employee!.id!
      ).subscribe({
        next: () => {
          this.alertService.success(alertTexts.visitDetailsChangedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.visitDetailsChangedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.changeVisitTitle, message: dialogTexts.changeVisitMessage},
    });
    return dialogRef.afterClosed();
  }

  filterEmployees() {
    this.filteredEmployees.next(filterBySearchValue(this.employees, this.employeeFilterCtrl.value, employeeFilter));
  }
}
