import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {CustomerAbsence} from "shared/models/customer-absence.model";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {CustomerAbsenceService} from "app/features/manage-absences/services/customer-absence.service";

@Component({
  selector: 'app-customer-absences',
  templateUrl: './customer-absences.component.html',
  styleUrls: ['./customer-absences.component.scss']
})
export class CustomerAbsencesComponent {
  customerAbsences: CustomerAbsence[] = [];
  customerAbsenceSub!: Subscription;
  selectedOptions!: CustomerAbsence[];
  generalTexts = generalTexts;

  constructor(private customerAbsenceService: CustomerAbsenceService) {}

  ngOnInit(): void {
    this.customerAbsenceSub = this.customerAbsenceService.customerAbsences$
      .subscribe(customerAbsences => {
        this.customerAbsences = customerAbsences;
      })
  }

  ngOnDestroy() {
    this.customerAbsenceSub.unsubscribe();
  }
}
