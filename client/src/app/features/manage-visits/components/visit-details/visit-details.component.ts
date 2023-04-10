import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {VisitDetailsWithVisit} from "shared/models/visit-details.model";
import {Visit} from "shared/models/visit.model";
import {SharedDataService} from "app/core/services/shared-data.service";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {AccountService} from "app/core/services/account.service";

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.scss']
})
export class VisitDetailsComponent {
  @Input() time: string | undefined;
  @Input() visits!: Visit[];
  @Output() byUpdate: EventEmitter<void> = new EventEmitter();
  visitDetailsList: VisitDetailsWithVisit[] = [];
  filteredList: VisitDetailsWithVisit[] = [];
  generalTexts = generalTexts;

  constructor(
    private accountService: AccountService,
    private employeeService: SharedDataService,
    ) { }

  ngOnInit() {
    if (this.accountService.isStaff()) {
      this.employeeService.refreshEmployees();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (!changes[propName].isFirstChange() && changes.hasOwnProperty(propName)) {
        if (propName === 'visits') {
          this.visitDetailsList = this.getDetails(this.visits);
          this.doFilter();
        } else if (propName === 'time') {
          this.doFilter();
        }
      }
    }
  }

  doFilter() {
    if (this.time) {
      let visits = this.visits.filter(visit => visit.dateTime === this.time);
      this.filteredList = this.getDetails(visits);
    }
  }

  getDetails(visits: Visit[]) {
    let extendedDetailsList: VisitDetailsWithVisit[] = [];
    visits.forEach(v => v.visitDetailsList.forEach(vDetails => {
      let extendedDetails: VisitDetailsWithVisit = Object.create(vDetails);
      extendedDetails.visit = v;
      extendedDetailsList.push(extendedDetails);
    }));
    return extendedDetailsList;
  }
}
