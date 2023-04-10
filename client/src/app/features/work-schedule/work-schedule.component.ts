import {Component} from '@angular/core';
import {SharedDataService} from "app/core/services/shared-data.service";
import {Sheet} from "shared/models/sheet.model";
import {Subscription} from "rxjs";
import * as moment from "moment";
import {AccountService} from "app/core/services/account.service";

@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.component.html',
  styleUrls: ['./work-schedule.component.scss']
})
export class WorkScheduleComponent {
  sheet: Sheet | undefined;
  sheetSub!: Subscription;

  constructor(
    private sharedDataService: SharedDataService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.sharedDataService.refreshSheets();
    this.sheetSub = this.sharedDataService.sheets$
      .subscribe(sheets => {
        this.sheet = sheets.find(sheet => this.checkIfCurrent(sheet));
        if (this.sheet) {
          this.sharedDataService.refreshPlannedVisits(this.sheet.id!, this.accountService.employeeId.value!);
        }
      })
  }

  checkIfCurrent(sheet: Sheet) {
    let now = moment();
    return moment(sheet.startDate).isSameOrBefore(now) && moment(sheet.endDate).isAfter(now);
  }
}
