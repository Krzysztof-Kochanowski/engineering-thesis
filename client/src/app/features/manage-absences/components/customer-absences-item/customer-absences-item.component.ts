import {Component, Input, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {FormComponent} from "shared/abstract-components/form.component";
import {Status} from "shared/enums/visit-details-status.enum";
import * as moment from "moment";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {VisitService} from "app/features/manage-visits/services/visit.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "app/core/services/auth.service";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {CustomerAbsence} from "shared/models/customer-absence.model";
import {CustomerAbsenceService} from "app/features/manage-absences/services/customer-absence.service";
import {alertTexts} from "assets/app-texts-pl/alertTexts";

@Component({
  selector: 'app-customer-absences-item',
  templateUrl: './customer-absences-item.component.html',
  styleUrls: ['./customer-absences-item.component.scss']
})
export class CustomerAbsencesItemComponent extends FormComponent{
  @ViewChild('temp', { static: true }) template!: TemplateRef<any>;
  @Input() absence!: CustomerAbsence;
  status = Status;
  generalTexts = generalTexts;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private visitService: VisitService,
    private dialog: MatDialog,
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private customerAbsenceService: CustomerAbsenceService
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

      let editedAbsence: CustomerAbsence = {
        customer: this.absence.customer,
        startDate: this.f['startDate'].value.utc(),
        endDate: this.f['endDate'].value.utc(),
      };

      this.customerAbsenceService.updateCustomerAbsence(this.absence.id!, editedAbsence).subscribe({
        next: () => {
          this.customerAbsenceService.refreshCustomerAbsences();
          this.alertService.success(alertTexts.absenceChangedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.absenceChangedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.changeAbsenceTitle, message: dialogTexts.changeCustomerAbsenceMessage},
    });
    return dialogRef.afterClosed();
  }

  openDialogOnDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.deleteAbsenceTitle, message: dialogTexts.deleteCustomerAbsenceMessage},
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

      this.customerAbsenceService.deleteCustomerAbsence(this.absence.id!).subscribe({
        next: () => {
          this.customerAbsenceService.refreshCustomerAbsences();
          this.alertService.success(alertTexts.absenceRemovedSuccess);
        },
        error: () => this.alertService.error(alertTexts.absenceRemovedError)
      }).add(() => this.loading = false)
    });
  }
}
