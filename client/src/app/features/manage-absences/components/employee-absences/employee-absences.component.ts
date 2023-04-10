import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {EmployeeAbsence} from "shared/models/employee-absence.model";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {EmployeeAbsenceService} from "app/features/manage-absences/services/employee-absence.service";

@Component({
  selector: 'app-employee-absences',
  templateUrl: './employee-absences.component.html',
  styleUrls: ['./employee-absences.component.scss']
})
export class EmployeeAbsencesComponent {
  employeeAbsences: EmployeeAbsence[] = [];
  employeeAbsenceSub!: Subscription;
  selectedOptions!: EmployeeAbsence[];
  generalTexts = generalTexts;

  constructor(private employeeAbsenceService: EmployeeAbsenceService) {}

  ngOnInit(): void {
    this.employeeAbsenceSub = this.employeeAbsenceService.employeeAbsences$
      .subscribe(employeeAbsences => {
        this.employeeAbsences = employeeAbsences;
      })
  }

  ngOnDestroy() {
    this.employeeAbsenceSub.unsubscribe();
  }
}
