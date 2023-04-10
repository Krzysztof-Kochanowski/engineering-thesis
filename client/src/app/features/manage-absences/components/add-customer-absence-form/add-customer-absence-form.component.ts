import {Component, Input} from '@angular/core';
import {FormComponent} from "shared/abstract-components/form.component";
import {MatSelectChange} from "@angular/material/select";
import * as moment from "moment";
import {Time} from "shared/components/time-input/time-input.component";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {SharedDataService} from "app/core/services/shared-data.service";
import {MatDialog} from "@angular/material/dialog";
import {customerFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Customer} from "shared/models/customer.model";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {CustomerAbsence} from "shared/models/customer-absence.model";
import {CustomerAbsenceService} from "app/features/manage-absences/services/customer-absence.service";
import {alertTexts} from "assets/app-texts-pl/alertTexts";

@Component({
  selector: 'app-add-customer-absence-form',
  templateUrl: './add-customer-absence-form.component.html',
  styleUrls: ['./add-customer-absence-form.component.scss']
})
export class AddCustomerAbsenceFormComponent extends FormComponent {
  @Input() date: moment.Moment | null = null;
  @Input() time: Time | null = null;
  generalTexts = generalTexts;
  loading = false;
  customers: Customer[] = [];
  customersSub!: Subscription;
  customerFilterCtrl = new FormControl<string>('') as FormControl<string>;
  public filteredCustomers = new BehaviorSubject<Customer[]>([]);

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private sharedDataService: SharedDataService,
    private customerAbsenceService: CustomerAbsenceService,
    private dialog: MatDialog
  ) {
    super();
  }

  override ngOnInit() {
    this.sharedDataService.refreshCustomers();

    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      customer: [null, Validators.required],
    }, {updateOn: 'submit'});

    this.customersSub = this.sharedDataService.customers$
      .subscribe(customers => {
        this.customers = customers;
        this.filterCustomers();
      })

    this.customerFilterCtrl.valueChanges.subscribe(() => this.filterCustomers());
  }

  ngOnDestroy() {
    this.customersSub.unsubscribe();
  }

  filterCustomers() {
    this.filteredCustomers.next(filterBySearchValue(this.customers, this.customerFilterCtrl.value, customerFilter));
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

      let customerAbsence: CustomerAbsence = {
        customer: this.f['customer'].value,
        startDate: this.f['startDate'].value.utc(),
        endDate: this.f['endDate'].value.utc(),
      };

      this.customerAbsenceService.postCustomerAbsence(customerAbsence).subscribe({
        next: () => {
          this.alertService.success(alertTexts.absenceAddedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.absenceAddedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.addAbsenceTitle, message: dialogTexts.addCustomerAbsenceMessage},
    });
    return dialogRef.afterClosed();
  }

  updateSelectedCustomer(event: MatSelectChange) {
    this.f['customer'].setValue(event.value);
  }

  updateSelectedStartDate(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      event.value = event.value.startOf('day');
    }
    this.f['startDate'].setValue(event.value);
  }

  updateSelectedEndDate(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      event.value = event.value.endOf('day');
    }
    this.f['endDate'].setValue(event.value);
  }
}
