import {Component} from '@angular/core';
import {EmployeeAbsenceService} from "app/features/manage-absences/services/employee-absence.service";
import {CustomerAbsenceService} from "app/features/manage-absences/services/customer-absence.service";

@Component({
  selector: 'app-manage-employee-absences',
  templateUrl: './manage-absences.component.html',
  styleUrls: ['./manage-absences.component.scss']
})
export class ManageAbsencesComponent {
  activeTab: number = 0;

  constructor(
    private customerAbsenceService: CustomerAbsenceService,
    private employeeAbsenceService: EmployeeAbsenceService,
  ) {}

  ngOnInit() {
    this.refreshEmployeeAbsences();
    this.refreshCustomerAbsences();
  }

  refreshCustomerAbsences() {
    this.customerAbsenceService.refreshCustomerAbsences();
    this.activeTab = 0;
  }

  refreshEmployeeAbsences() {
    this.employeeAbsenceService.refreshEmployeeAbsences();
    this.activeTab = 1;
  }
}
