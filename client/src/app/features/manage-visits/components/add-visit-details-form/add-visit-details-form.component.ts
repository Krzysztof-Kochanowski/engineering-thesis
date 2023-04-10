import {Component, Input, SimpleChanges} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Customer} from "shared/models/customer.model";
import {ToastrService} from "ngx-toastr";
import {BehaviorSubject, Subscription} from "rxjs";
import {VisitService} from "app/features/manage-visits/services/visit.service";
import {MatSelectChange} from "@angular/material/select";
import * as moment from "moment";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Time} from "shared/components/time-input/time-input.component";
import {customerFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {SharedDataService} from "app/core/services/shared-data.service";
import {FormComponent} from "shared/abstract-components/form.component";
import {enumTexts} from "assets/app-texts-pl/enumTexts";
import {alertTexts} from "assets/app-texts-pl/alertTexts";
import {VisitDetailsDto} from "shared/models/visit-details-dto.model";
import {AccountService} from "app/core/services/account.service";

@Component({
  selector: 'app-add-visit-details-form',
  templateUrl: './add-visit-details-form.component.html',
  styleUrls: ['./add-visit-details-form.component.scss']
})
export class AddVisitDetailsFormComponent extends FormComponent {
  @Input() date: moment.Moment | null = null;
  @Input() time: Time | null = null;
  generalTexts = generalTexts;
  loading = false;
  customers: Customer[] = [];
  customersSub!: Subscription;
  customerFilterCtrl = new FormControl<string>('') as FormControl<string>;
  minDate = moment().startOf('month').subtract(1, 'month');
  maxDate = moment().endOf('month').add(1, 'month');
  public filteredCustomers = new BehaviorSubject<Customer[]>([]);
  enumTexts = enumTexts;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private visitService: VisitService,
    private dialog: MatDialog,
    private sharedDataService: SharedDataService,
    private accountService: AccountService
  ) {
    super();
  }

  ngOnInit() {
    this.sharedDataService.refreshCustomers();
    this.customersSub = this.sharedDataService.customers$
      .subscribe(customers => {
        this.customers = customers;
        this.filterCustomers();
      })

    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      customer: [null, Validators.required],
      status: ['', Validators.required],
    }, {updateOn: 'submit'});

    this.customerFilterCtrl.valueChanges.subscribe(() => this.filterCustomers());
  }

  ngOnDestroy() {
    this.customersSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (!changes[propName].isFirstChange() && changes.hasOwnProperty(propName)) {
        if (propName === 'date') {
          this.f['date'].setValue(this.date);
        }
        if (propName === 'time') {
          this.f['time'].setValue(this.time);
        }
      }
    }
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

      let newDetails: VisitDetailsDto = {
        customer: this.f['customer'].value,
        status: this.f['status'].value.key,
        comment: '',
      };

      this.visitService.postVisitDetails(
        newDetails,
        this.f['date'].value, this.f['time'].value,
        this.accountService.employeeId.value!
      ).subscribe({
        next: () => {
          this.alertService.success(alertTexts.visitDetailsAddedSuccess)
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.visitDetailsAddedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.addVisitTitle, message: dialogTexts.addVisitMessage},
    });
    return dialogRef.afterClosed();
  }

  updateSelectedStatus(event: MatSelectChange) {
    this.f['status'].setValue(event.value);
  }

  updateSelectedCustomer(event: MatSelectChange) {
    this.f['customer'].setValue(event.value);
  }

  updateSelectedDate(event: MatDatepickerInputEvent<moment.Moment>) {
    this.f['date'].setValue(event.value);
  }
}
