import {Component,} from "@angular/core";
import {PlannedVisit} from "shared/models/planned-visit.model";
import {dateTexts} from "assets/app-texts-pl/dateTexts";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {Subscription} from "rxjs";
import {SharedDataService} from "app/core/services/shared-data.service";
import * as moment from "moment";

@Component({
  selector: "app-work-schedule-table",
  templateUrl: "./work-schedule-table.component.html",
  styleUrls: ["./work-schedule-table.component.scss"]
})
export class WorkScheduleTableComponent {
  dataSource: PlannedVisit[][] = [[],[],[],[],[]];
  dateTexts = dateTexts;
  generalTexts = generalTexts;
  plannedVisitSub!: Subscription;
  displayedColumns = ['0', '1', '2', '3', '4', '5'];
  templateData: PlannedVisit[] = templateData;

  constructor(
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.plannedVisitSub = this.sharedDataService.plannedVisits$
      .subscribe(plannedVisits => {
        this.updateDatasource(plannedVisits);
      })
  }

  ngOnDestroy() {
    this.plannedVisitSub.unsubscribe();
  }

  updateDatasource(pVisits: PlannedVisit[][]) {
    this.dataSource = [[],[],[],[],[]];
    for (let i = 0; i < 5; i++) {
      let tempData: PlannedVisit[] = this.templateData.slice();
      if (pVisits[i]) {
        pVisits[i].forEach(pVisit => {
          pVisit.visitTime = moment(pVisit.visitTime, "HH:mm").format("HH:mm");

          // Fill hours without a visit with template data for display purposes
          for (let index = tempData.length - 1; index >= 0; index--) {
            const templateVisitTime = tempData[index].visitTime;
            if (pVisit.visitTime < templateVisitTime) {
              this.dataSource[i].push(pVisit);
              return;
            } else if (pVisit.visitTime === templateVisitTime) {
              this.dataSource[i].push(pVisit);
              tempData.pop();
              return;
            } else {
              this.dataSource[i].push(tempData.pop()!);
            }
          }
        })
      }
      this.dataSource[i] = this.dataSource[i].concat(tempData.reverse());
    }
  }
}

const templateData: PlannedVisit[] = [
  {visitTime:"17:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"17:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"16:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"16:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"15:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"15:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"14:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"14:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"13:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"13:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"12:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"12:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"11:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"11:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"10:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"10:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"09:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"09:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"08:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"08:00", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
  {visitTime:"07:30", customer: {firstName: "-", lastName: "-", organizationName: "-"}},
]
