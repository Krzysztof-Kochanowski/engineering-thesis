import {Component} from '@angular/core';
import * as moment from "moment";
import {Visit} from "shared/models/visit.model";
import {Subscription} from "rxjs";
import {Time} from "shared/components/time-input/time-input.component";
import {SharedDataService} from "app/core/services/shared-data.service";
import {AccountService} from "app/core/services/account.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {EmployeeService} from "app/features/manage-visits/services/employee.service";
import {Employee} from "shared/models/employee.model";
import {generalTexts} from "../../../assets/app-texts-pl/generalTexts";

@Component({
  selector: 'app-manage-visits',
  templateUrl: './manage-visits.component.html',
  styleUrls: ['./manage-visits.component.scss'],
  providers: [EmployeeService]
})
export class ManageVisitsComponent {
  formVisitDate: moment.Moment | null = null;
  formVisitTime: Time | null = null;
  visitDetailsTime: string | undefined;
  visits: Visit[] = [];
  visitSub!: Subscription;
  selectedTableRow: number = -1;
  selectedDate: moment.Moment = moment().startOf('day');
  employeeId!: number;
  employeeSub: Subscription | undefined;
  employee!: Employee;

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private accountService: AccountService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let routeEmployeeId = params.get('employee-id');
      if (routeEmployeeId) {
        this.employeeId = +routeEmployeeId;
        this.employeeService.refreshEmployee(this.employeeId);
        this.employeeSub = this.employeeService.employee$.subscribe((employee) => this.employee = employee);
      } else {
        this.employeeId = this.accountService.employeeId.value!;
      }
    });
    this.visitSub = this.sharedDataService.visits$
      .subscribe(visits => {
        this.visits = visits;
      })
  }

  ngOnDestroy() {
    this.visitSub.unsubscribe();
    this.employeeSub?.unsubscribe();
  }

  updateSelectedVisitTime(time: string | undefined, selectedRow: number) {
    this.selectedTableRow = selectedRow;
    if (time) {
      let momentDate: moment.Moment = moment(time);
      this.formVisitDate = this.selectedDate;
      this.formVisitTime = {hour: momentDate.format('HH'), minute: momentDate.format('mm')};
    } else {
      this.formVisitDate = null;
      this.formVisitTime = null;
    }
    this.visitDetailsTime = time;
  }

  updateSelectedDate(date: moment.Moment) {
    this.selectedDate = date;
    this.updateSelectedVisitTime(undefined, -1)
  }

  refreshVisits() {
    this.sharedDataService.refreshVisits(this.selectedDate, this.employeeId);
  }

  protected readonly generalTexts = generalTexts;
}
