import {Component, EventEmitter, Output} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import * as moment from "moment";
import {SharedDataService} from "app/core/services/shared-data.service";
import {customerFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Customer} from "shared/models/customer.model";
import {CustomerAbsenceService} from "app/features/manage-absences/services/customer-absence.service";

@Component({
  selector: 'app-customer-absences-options',
  templateUrl: './customer-absences-options.component.html',
  styleUrls: ['./customer-absences-options.component.scss']
})
export class CustomerAbsencesOptionsComponent {
  @Output() bySelectionChange: EventEmitter<Customer> = new EventEmitter();
  generalTexts = generalTexts;
  loading = false;
  customers: Customer[] = []
  customerSub!: Subscription;
  selectedCustomer = this.customers[0];
  customerFilterCtrl = new FormControl<string>('') as FormControl<string>;
  filteredCustomers = new BehaviorSubject<Customer[]>([]);
  startDate!: moment.Moment;
  endDate!: moment.Moment;

  constructor(
    private sharedDataService: SharedDataService,
    private customerAbsenceService: CustomerAbsenceService,
  ) {}

  ngOnInit() {
    this.sharedDataService.refreshCustomers();

    this.customerSub = this.sharedDataService.customers$
      .subscribe(customers => {
        this.customers = customers;
        this.filterCustomers();
      })

    this.customerFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterCustomers();
      });
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }

  filterCustomers() {
    this.filteredCustomers.next(filterBySearchValue(this.customers, this.customerFilterCtrl.value, customerFilter));
  }

  onSubmit() {
    this.loading = true;

    this.customerAbsenceService.refreshCustomerAbsences(this.selectedCustomer, this.startDate, this.endDate);
  }

  updateSelectedCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.bySelectionChange.emit(customer);
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
}
