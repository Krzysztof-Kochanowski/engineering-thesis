import {Component, EventEmitter, Output} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {Employee} from "shared/models/employee.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {SharedDataService} from "app/core/services/shared-data.service";
import {employeeFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import * as moment from "moment";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {EmployeeAbsenceService} from "app/features/manage-absences/services/employee-absence.service";

@Component({
  selector: 'app-employee-absences-options',
  templateUrl: './employee-absences-options.component.html',
  styleUrls: ['./employee-absences-options.component.scss']
})
export class EmployeeAbsencesOptionsComponent {
  @Output() bySelectionChange: EventEmitter<Employee> = new EventEmitter();
  generalTexts = generalTexts;
  loading = false;
  employees: Employee[] = []
  employeeSub!: Subscription;
  selectedEmployee = this.employees[0];
  employeeFilterCtrl = new FormControl<string>('') as FormControl<string>;
  filteredEmployees = new BehaviorSubject<Employee[]>([]);
  startDate!: moment.Moment;
  endDate!: moment.Moment;

  constructor(
    private sharedDataService: SharedDataService,
    private employeeAbsenceService: EmployeeAbsenceService,
  ) {}

  ngOnInit() {
    this.sharedDataService.refreshEmployees();
    this.employeeSub = this.sharedDataService.employees$
      .subscribe(employees => {
        this.employees = employees;
        this.filterEmployees();
      })

    this.employeeFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterEmployees();
      });
  }

  ngOnDestroy() {
    this.employeeSub.unsubscribe();
  }

  filterEmployees() {
    this.filteredEmployees.next(filterBySearchValue(this.employees, this.employeeFilterCtrl.value, employeeFilter));
  }

  onSubmit() {
    this.loading = true;

    this.employeeAbsenceService.refreshEmployeeAbsences(this.selectedEmployee, this.startDate, this.endDate);
  }

  updateSelectedEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.bySelectionChange.emit(employee);
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
