import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import * as moment from "moment";
import {MatCalendar} from "@angular/material/datepicker";
import {MatMenuTrigger} from "@angular/material/menu";
import {dateTexts} from "assets/app-texts-pl/dateTexts";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {SharedDataService} from "app/core/services/shared-data.service";
import {AccountService} from "app/core/services/account.service";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent {
  @ViewChild('calendar', {static:false}) calendar!: MatCalendar<any>;
  @ViewChild('calendarMenuTrigger', {static:false}) calendarMenuTrigger!: MatMenuTrigger;
  @Output() byDateChange: EventEmitter<moment.Moment> = new EventEmitter();
  date: moment.Moment = moment().startOf('day');
  daysOfWeek = dateTexts.dayOfWeekNamesLong;
  generalTexts = generalTexts;
  activeTab!: number;
  employeeId!: number;

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
       this.employeeId = +params.get('employee-id')! || this.accountService.employeeId.value!;
    });
    this.sharedDataService.refreshVisits(this.date, this.employeeId);
    this.updateTab();
  }

  onTabChange() {
    if (this.activeTab !== 5) {
      if (!this.date.isSame(moment().startOf('day').weekday(this.activeTab))) {
        this.date = moment().startOf('day').weekday(this.activeTab);
        this.updateVisits();
      }
    }
  }

  onTabClick(event: MouseEvent) {
    let el = event.target as Element;
    let index: number = +el.id.substring(el.id.length - 1);
    // If last tab was clicked, open calendar
    if (index as number === this.daysOfWeek.length) {
      this.openCalendar();
    }
  }

  updateTab() {
    if (this.checkIfCurrentWeek(this.date)) {
      this.activeTab = this.date.weekday();
    } else {
      this.activeTab = 5;
    }
  }

  checkIfCurrentWeek(date: moment.Moment) {
    const isCurrrentWeek = moment().startOf("week").isSame(date, "week");
    const isNotWeekend = (date.weekday() != 5) && (date.weekday() != 6);

    return isCurrrentWeek && isNotWeekend;
  }

  openCalendar() {
    this.calendarMenuTrigger.openMenu();
  }

  onOpen() {
    if (this.date) {
      this.calendar.activeDate=this.date;
    }
  }

  getDateFromDayIndex(index: number) {
    return moment().startOf('week').add(index, "days").toDate();
  }

  updateVisits() {
    this.byDateChange.emit(this.date.clone());
    this.sharedDataService.refreshVisits(this.date.clone(), this.employeeId);
  }
}
