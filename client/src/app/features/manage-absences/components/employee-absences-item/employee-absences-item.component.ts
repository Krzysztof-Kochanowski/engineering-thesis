import {Component, Input, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Status} from "shared/enums/visit-details-status.enum";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {VisitService} from "app/features/manage-visits/services/visit.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "app/core/services/auth.service";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {FormComponent} from "shared/abstract-components/form.component";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {EmployeeAbsence} from "shared/models/employee-absence.model";
import {EmployeeAbsenceService} from "app/features/manage-absences/services/employee-absence.service";
import {routes} from "assets/routes";
import {alertTexts} from "assets/app-texts-pl/alertTexts";

@Component({
  selector: 'app-employee-absences-item',
  templateUrl: './employee-absences-item.component.html',
  styleUrls: ['./employee-absences-item.component.scss']
})
export class EmployeeAbsencesItemComponent extends FormComponent {
  @ViewChild('temp', { static: true }) template!: TemplateRef<any>;
  @Input() absence!: EmployeeAbsence;
  status = Status;
  generalTexts = generalTexts;
  loading = false;
  routes = routes;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private visitService: VisitService,
    private dialog: MatDialog,
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private employeeAbsenceService: EmployeeAbsenceService
  ) {
    super();
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);

    this.form = this.formBuilder.group({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    }, {updateOn: 'submit'});
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

      let editedAbsence: EmployeeAbsence = {
        employee: this.absence.employee,
        startDate: this.f['startDate'].value.utc(),
        endDate: this.f['endDate'].value.utc(),
      };

      this.employeeAbsenceService.updateEmployeeAbsence(this.absence.id!, editedAbsence).subscribe({
        next: () => {
          this.employeeAbsenceService.refreshEmployeeAbsences();
          this.alertService.success(alertTexts.absenceChangedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.absenceChangedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.changeAbsenceTitle, message: dialogTexts.changeEmployeeAbsenceMessage},
    });
    return dialogRef.afterClosed();
  }

  openDialogOnDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.deleteAbsenceTitle, message: dialogTexts.deleteEmployeeAbsenceMessage},
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

    this.openDialogOnDelete().subscribe((result: boolean) => {
      if (!result) {
        this.loading = false;
        return;
      }

      this.employeeAbsenceService.deleteEmployeeAbsence(this.absence.id!).subscribe({
        next: () => {
          this.employeeAbsenceService.refreshEmployeeAbsences();
          this.alertService.success(alertTexts.absenceRemovedSuccess);
        },
        error: () => this.alertService.error(alertTexts.absenceRemovedError)
      }).add(() => this.loading = false)
    });
  }
}
