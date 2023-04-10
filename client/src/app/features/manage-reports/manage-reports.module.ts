import {NgModule} from '@angular/core';

import {ManageReportsRoutingModule} from './manage-reports-routing.module';
import {ManageReportsComponent} from './manage-reports.component';
import {SharedModule} from "shared/shared.module";
import {AddReportFormComponent} from './components/add-report-form/add-report-form.component';
import {ReportService} from "app/features/manage-reports/services/report.service";
import {SavedReportsComponent} from './components/saved-reports/saved-reports.component';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    ManageReportsComponent,
    AddReportFormComponent,
    SavedReportsComponent,
  ],
  imports: [
    ManageReportsRoutingModule,
    SharedModule,
    CdkDrag,
    CdkDropList
  ],
  providers: [
    ReportService,
  ]
})
export class ManageReportsModule { }
