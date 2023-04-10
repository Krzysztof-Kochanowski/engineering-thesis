import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Employee} from "shared/models/employee.model";
import {SharedDataService} from "app/core/services/shared-data.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {MatSelect} from "@angular/material/select";
import {FormControl} from "@angular/forms";
import {routes} from "assets/routes";
import {employeeFilter, filterBySearchValue} from "shared/utilities/sort.helper";

@Component({
  selector: 'app-work-schedule-options',
  templateUrl: './work-schedule-options.component.html',
  styleUrls: ['./work-schedule-options.component.scss'],
})
export class WorkScheduleOptionsComponent {
  @ViewChild('employeeSelect', { static: true }) employeeSelect!: MatSelect;
  @Output() bySelectionChange: EventEmitter<Employee> = new EventEmitter();
  generalTexts = generalTexts;
  employees: Employee[] = []
  employeeSub!: Subscription;
  selectedEmployee = this.employees[0];
  employeeFilterCtrl = new FormControl<string>('') as FormControl<string>;
  filteredEmployees = new BehaviorSubject<Employee[]>([]);
  routes = routes;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.sharedDataService.refreshEmployees();
    this.employeeSub = this.sharedDataService.employees$
      .subscribe(employees => {
        this.employees = employees;
        this.filterEmployees();
        this.employeeSelect.value = this.filteredEmployees.value[0];
        this.updateSelectedEmployee(this.employeeSelect.value);
      })

    this.employeeFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterEmployees();
      });
  }

  ngOnDestroy() {
    this.employeeSub.unsubscribe();
  }

  updateSelectedEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.bySelectionChange.emit(employee);
  }

  filterEmployees() {
    this.filteredEmployees.next(filterBySearchValue(this.employees, this.employeeFilterCtrl.value, employeeFilter));
  }
}
