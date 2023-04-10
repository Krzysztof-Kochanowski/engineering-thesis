import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {enumTexts} from "assets/app-texts-pl/enumTexts";
import {Visit} from "shared/models/visit.model";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-visit-table',
  templateUrl: './visit-table.component.html',
  styleUrls: ['./visit-table.component.scss'],
  providers: [DatePipe]
})
export class VisitTableComponent {
  @Input() visits: Visit[] = [];
  @Output() byVisitSelect: EventEmitter<{ time: string | undefined, row: number }> = new EventEmitter();
  @Input() selectedRow: number = -1;
  generalTexts = generalTexts;
  displayedColumns = ['0', '1', '2', '3', '4', '5'];
  templateData: Visit[] = templateData;
  dataSource: Visit[] = [];
  enumTexts = enumTexts;

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (!changes[propName].isFirstChange() && changes.hasOwnProperty(propName)) {
        if (propName === 'visits') {
          this.updateDatasource(this.visits);
        }
      }
    }
  }

  updateDatasource(visits: Visit[]) {
    this.dataSource = [];
    let tempData: Visit[] = this.templateData.slice();
    visits.forEach(visit => {
      const visitTime = this.datePipe.transform(visit.dateTime, 'HH:mm')!;

      // Fill hours without a visit with template data for display purposes
      for (let index = tempData.length - 1; index >= 0; index--) {
        const templateVisitTime = this.datePipe.transform(tempData[index].dateTime, 'HH:mm')!;
        if (visitTime < templateVisitTime) {
          this.dataSource.push(visit);
          return;
        } else if (visitTime === templateVisitTime) {
          this.dataSource.push(visit);
          tempData.pop();
          return;
        } else {
          this.dataSource.push(tempData.pop()!);
        }
      }
    })
    this.dataSource = this.dataSource.concat(tempData.reverse());
  }

  assertItemType(item: Visit): Visit {
    return item;
  }

  getPlannedVisitStatus(visit: Visit): string {
    let status = '';
    if (visit.plannedVisit) {
      for (let i = 0; i < visit.visitDetailsList.length; i++) {
        if (visit.visitDetailsList[i].customer.id === visit.plannedVisit?.customer.id)
          status = visit.visitDetailsList[i].status;
      }
    }
    return status;
  }

  selectVisit(visit: Visit, index: number) {
    this.selectedRow = index;
    this.byVisitSelect.emit({time: visit.dateTime, row: this.selectedRow});
  }

  unselectVisit() {
    this.selectedRow = -1;
    this.byVisitSelect.emit({time: undefined, row: this.selectedRow});
  }

  countOtherVisits(visit: Visit) {
    if (visit.plannedVisit) {
      return visit.visitDetailsList.length - 1;
    }
    return visit.visitDetailsList.length;
  }
}

const templateData: Visit[] = [
  {dateTime:"2023-01-01T17:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T17:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T16:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T16:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T15:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T15:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T14:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T14:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T13:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T13:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T12:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T12:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T11:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T11:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T10:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T10:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T09:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T09:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T08:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T08:00", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
  {dateTime:"2023-01-01T07:30", visitDetailsList: [], employee: {firstName: "-", lastName: "-", username: "-"}},
]
