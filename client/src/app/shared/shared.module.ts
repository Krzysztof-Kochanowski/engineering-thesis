import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularMaterialModule} from "app/angular-material.module";
import {RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  VisitDetailsStatusIconComponent
} from './components/visit-details-status-icon/visit-details-status-icon.component';
import {CustomDatePipe} from './pipes/custom-date.pipe';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import {CustomDateAdapter} from "shared/custom-date-adapter.service";
import * as moment from "moment";
import {StatusInputComponent} from './components/status-input/status-input.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {TimeInputComponent} from './components/time-input/time-input.component';
import {WorkScheduleTableComponent} from "shared/components/work-schedule-table/work-schedule-table.component";

moment.updateLocale('pl', {
  week: {
    dow : 1, // Monday is the first day of the week.
  }
});

const customDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [VisitDetailsStatusIconComponent, CustomDatePipe, StatusInputComponent, DialogComponent, TimeInputComponent,
  WorkScheduleTableComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  exports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    VisitDetailsStatusIconComponent,
    CustomDatePipe,
    TimeInputComponent,
    WorkScheduleTableComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: MAT_DATE_FORMATS, useValue: customDateFormats },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: false} },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
})
export class SharedModule { }
