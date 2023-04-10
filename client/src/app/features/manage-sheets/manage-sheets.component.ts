import {Component, SimpleChanges} from '@angular/core';
import {Employee} from "shared/models/employee.model";
import {Sheet} from "shared/models/sheet.model";
import {SharedDataService} from "app/core/services/shared-data.service";

@Component({
  selector: 'app-manage-sheets',
  templateUrl: './manage-sheets.component.html',
  styleUrls: ['./manage-sheets.component.scss']
})
export class ManageSheetsComponent {
  selectedEmployee!: Employee;
  selectedSheet!: Sheet;

  constructor(
    private sharedDataService: SharedDataService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (!changes[propName].isFirstChange() && changes.hasOwnProperty(propName)) {
        if (propName === 'selectedEmployee') {
          this.updateTable();
        }
        if (propName === 'selectedSheet') {
          this.updateTable();
        }
      }
    }
  }

  updateTable() {
    if (this.selectedEmployee && this.selectedSheet)
      this.sharedDataService.refreshPlannedVisits(this.selectedSheet.id!, this.selectedEmployee.id!);
  }

  updateSelectedEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.updateTable();
  }

  updateSelectedSheet(sheet: Sheet) {
    this.selectedSheet = sheet;
    this.updateTable();
  }
}
